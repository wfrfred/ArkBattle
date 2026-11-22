# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Capture Nearl S2's actual deployment-slot exemption and its native consumers."""

import argparse
from bisect import bisect_right
import json
from pathlib import Path
import runpy
import sys

import capstone


sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT / '.agents/skills/arkbattle-native-research/scripts'))
from native import DEFAULT_GAME, Native, fingerprint
from unity_assets import bundle, script, serialized

PREFAB_READER = ROOT / 'docs/research/evidence/special-redeploy-failure-20261122/extract_prefab.py'
EXPECTED_CLIENT = (
    'cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff',
    'e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5',
)
SKILLS = 'battle/prefabs/[uc]skills.ab'
SCRIPTS = 'anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin'
SERIALIZED_FILE = 'CAB-e39773c4d1462aefe0ea30134bbccdbb'
SELECTED = [('CardBuffWithSkill', -1291650482406657799, ('_cardBuffKey', '_lifeType', '_dontOccupyDeployCnt'))]
SELECTION = {
    86711: ((0x180d5e8c3, 0x180d5e933), (0x180d5e986, 0x180d5e9b7)),
    67048: ((0x18071ebf9, 0x18071ec51),),
    73893: ((0x180993a79, 0x180993a9a), (0x180993ab3, 0x180993acf)),
    67125: ((0x18070c825, 0x18070c87c),),
    66884: ((0x1806ea1c9, 0x1806ea1e2),),
    66869: ((0x1806f13bf, 0x1806f13e0),),
    66841: ((0x1806f2573, 0x1806f258c),),
    67060: ((0x180707894, 0x1807078d0),),
    65677: ((0x18064bd8f, 0x18064bda5),),
    77239: ((0x180a9d4e8, 0x180a9d513), (0x180a9d55b, 0x180a9d5a4)),
    77293: ((0x180aaad46, 0x180aaad72),),
    77177: ((0x180ab163c, 0x180ab166d),),
    77180: ((0x180ab1cd7, 0x180ab1ce5), (0x180ab1d3f, 0x180ab1d47)),
    79124: ((0x180b115b2, 0x180b115cd),),
    81098: ((0x180bcc58a, 0x180bcc58f),),
    81997: ((0x180c1d86e, 0x180c1d8e4),),
    65687: ((0x18064b97d, 0x18064b9b2),),
    81082: ((0x180bcd3dc, 0x180bcd41a), (0x180bcd4e3, 0x180bcd504), (0x180bcd5c1, 0x180bcd5db)),
}


def extract_prefab(assets, cache):
    read_bindings = runpy.run_path(str(PREFAB_READER))['read_bindings']
    scripts = {(name, row['id']): script(row, data) for name, data in bundle(assets / SCRIPTS)[0]
               if not name.endswith(('.resource', '.resS')) for row in serialized(data)['objects']
               if row['classid'] == 115}
    packages = {'base': assets / SKILLS, 'scripts': assets / SCRIPTS}
    base = read_bindings(packages['base'], SERIALIZED_FILE, SELECTED, scripts)
    asset = base['components']['CardBuffWithSkill']
    assert asset['enabled'] and asset['gameObject']['name'] == 'skchr_nearl2_2', asset
    assert asset['fields']['_dontOccupyDeployCnt'] is True, asset
    result = {'base': base}
    if (cache / SKILLS).is_file():
        packages['cache'] = cache / SKILLS
        cached = read_bindings(packages['cache'], SERIALIZED_FILE, SELECTED, scripts)
        result['cache'] = {'matchesBase': cached == base, 'projection': cached}
    return result, {name: fingerprint(path) for name, path in packages.items()}


def extract_methods(native):
    decoder = capstone.Cs(capstone.CS_ARCH_X86, capstone.CS_MODE_64)
    decoder.detail = True
    result = {}
    for index, spans in SELECTION.items():
        method = native.method(index)
        start = method['address']
        end = native.addresses[bisect_right(native.addresses, start)]
        assert all(start <= low < high <= end for low, high in spans), method
        instructions = []
        for inst in decoder.disasm(native.pe.read(start, end - start), start):
            if not any(low <= inst.address < high for low, high in spans):
                continue
            item = dict(address=hex(inst.address), bytes=inst.bytes.hex(), mnemonic=inst.mnemonic, operands=inst.op_str)
            if inst.mnemonic in ('call', 'jmp') and inst.operands[0].type == capstone.x86.X86_OP_IMM:
                item['callees'] = [native.method(i)['fullname'] for i in native.address_methods.get(inst.operands[0].imm, [])[:3]]
            instructions.append(item)
        assert instructions, index
        result[index] = dict(method=method, instructions=instructions)
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--game', type=Path, default=DEFAULT_GAME)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    native = Native(args.game)
    client = dict(dll=fingerprint(native.pe.path), metadata=fingerprint(native.metadata_path))
    assert tuple(row['sha256'] for row in client.values()) == EXPECTED_CLIENT, client
    assets = args.game / 'Arknights_Data/StreamingAssets/AB/Windows'
    cache = args.game / 'Arknights_Data/PersistentData/Bundles'
    prefab, packages = extract_prefab(assets, cache)
    provenance = dict(collectedOn='2026-11-22', client=client, metadataVersion=native.version,
                      packages=packages, tool=fingerprint(Path(__file__)), prefabReader=fingerprint(PREFAB_READER),
                      scope='Base and installed cached S2 prefab, and selected static native instructions. No live match.')
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(dict(provenance=provenance, result=dict(prefab=prefab, methods=extract_methods(native))),
                                  ensure_ascii=False, indent=2) + '\n')


if __name__ == '__main__':
    main()
