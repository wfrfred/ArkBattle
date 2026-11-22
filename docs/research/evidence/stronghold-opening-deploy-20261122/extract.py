# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Extract Stronghold placement and the shared Card draw path from an installed client."""

import argparse
from bisect import bisect_right
import json
from pathlib import Path
import runpy
import struct
import sys

import capstone

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT / '.agents/skills/arkbattle-native-research/scripts'))
from native import DEFAULT_GAME, Native, fingerprint

EXPECTED_DLL = 'cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff'
EXPECTED_METADATA = 'e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5'
SELECTION = {
    66741: ((0x1806fb5fa, 0x1806fb60f),),
    66753: ((0x1806fcf11, 0x1806fcf8d),),
    66755: ((0x1806fd276, 0x1806fd30b), (0x1806fd341, 0x1806fd366),
            (0x1806fd38f, 0x1806fd425), (0x1806fd567, 0x1806fd612)),
    66857: ((0x1806eecf5, 0x1806eed32),),
    66860: ((0x1806ea9bb, 0x1806ea9c6),),
    66861: ((0x1806eb9d9, 0x1806eba33), (0x1806ebaba, 0x1806ebb2a)),
    67124: ((0x18070c9bd, 0x18070c9da),),
    80433: ((0x180b72ec7, 0x180b72f21),),
    80435: ((0x180b70d1b, 0x180b70d7d),),
    80930: ((0x180bb3710, 0x180bb37b6),),
    80940: ((0x180bc6fe5, 0x180bc6ff2), (0x180bc719b, 0x180bc71a9)),
    80989: ((0x180bc8473, 0x180bc8496),),
    82885: ((0x180c63af6, 0x180c63b1d), (0x180c63bd6, 0x180c63c08)),
}
FIELDS = {
    'Torappu.Battle.AutoChess.ChessInst': {'cardUid', 'character'},
    'Torappu.Battle.Deck/SpawnDetailsTracker': {'isSpawnOperationSucceed', 'overlapLikeOperationDetail'},
    'Torappu.Battle.Deck/SpawnDetailsTracker/OverlapLikeOperationDetail': {
        'isOverlapLikeOperation', 'ignoreRespawn', 'needSetCardStateAfterOverlapLikeOperation'},
}
TEMPLATES = {'nearl2_t_1[mark]', 'nearl2_t_1[combo]', 'nearl2_s_2[end]'}


def disassembly(native, cs, start, end, ranges):
    rows = []
    for insn in cs.disasm(native.pe.read(start, end - start), start):
        if not any(lo <= insn.address < hi for lo, hi in ranges):
            continue
        item = {'address': hex(insn.address), 'bytes': insn.bytes.hex(),
                'mnemonic': insn.mnemonic, 'operands': insn.op_str}
        if insn.mnemonic in ('call', 'jmp') and insn.operands[0].type == capstone.x86.X86_OP_IMM:
            indices = native.address_methods.get(insn.operands[0].imm, [])
            item['callees'] = [native.method(i)['fullname'] for i in indices[:3]]
        rows.append(item)
    assert rows, (hex(start), ranges)
    return rows


def extract_native(native):
    cs = capstone.Cs(capstone.CS_ARCH_X86, capstone.CS_MODE_64)
    cs.detail = True
    methods = {}
    for index, ranges in SELECTION.items():
        method = native.method(index)
        start = method['address']
        end = native.addresses[bisect_right(native.addresses, start)]
        assert all(start <= lo < hi <= end for lo, hi in ranges), method['fullname']
        methods[index] = {'method': method, 'boundaryEnd': hex(end),
                          'selected': [[hex(lo), hex(hi)] for lo, hi in ranges],
                          'instructions': disassembly(native, cs, start, end, ranges)}
    virtual_dispatch = 0x180005610
    dispatch_end = virtual_dispatch + 0x60
    vtable = {}
    fields = {}
    for i, row in enumerate(native.types):
        name = native.typename(i)
        if name in FIELDS:
            fields[name] = [f for f in native.fields(i) if not f['static'] and f['name'] in FIELDS[name]]
        if name in ('Torappu.Battle.Character', 'Torappu.Battle.Token', 'Torappu.Battle.Trap'):
            entry, = struct.unpack_from('<I', native.metadata, native.table(17)[0] + 4 * (row['vtableStart'] + 41))
            vtable[name] = {'slot': 41, 'encoded': hex(entry),
                            'method': native.method((entry & 0x1fffffff) >> 1)}
    return {'methods': methods, 'fieldSelection': fields, 'vtable': vtable,
            'virtualDispatch': disassembly(native, cs, virtual_dispatch, dispatch_end,
                                            ((virtual_dispatch, dispatch_end),))}


def extract_holders(game):
    readers = runpy.run_path(str(ROOT / 'docs/research/evidence/special-redeploy-failure-20261122/extract_prefab.py'))
    results = {}
    for directory in ('StreamingAssets/AB/Windows', 'PersistentData/Bundles'):
        root = game / 'Arknights_Data' / directory
        holder = root / 'config/buff_template_holder.ab'
        if not holder.is_file():
            continue
        result = readers['read_holder'](holder, TEMPLATES)
        assert result.keys() == TEMPLATES, result.keys()
        results[directory] = {'source': fingerprint(holder), 'templates': result}
    return results


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--game', type=Path, default=DEFAULT_GAME)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    native = Native(args.game)
    dll = fingerprint(native.pe.path)
    metadata = fingerprint(native.metadata_path)
    assert (dll['sha256'], metadata['sha256']) == (EXPECTED_DLL, EXPECTED_METADATA)
    result = {'dll': dll, 'metadata': metadata,
              **extract_native(native), 'holders': extract_holders(args.game)}
    args.out.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')


if __name__ == '__main__':
    main()
