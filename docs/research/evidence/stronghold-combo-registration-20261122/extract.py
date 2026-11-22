# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Extract the installed native ordering of combo registration and opening deployment."""

import argparse
from bisect import bisect_right
import json
from pathlib import Path
import runpy
import struct

import capstone

loader = runpy.run_path(str(Path(__file__).resolve().parents[1] /
                            'stronghold-opening-deploy-20261122/extract.py'))
Native = loader['Native']
DEFAULT_GAME = loader['DEFAULT_GAME']
fingerprint = loader['fingerprint']

SELECTION = {
    65788: ((0x18065645d, 0x180656478),),
    65789: ((0x180666b57, 0x180666b80),),
    66739: ((0x1806fefcd, 0x1806fefed), (0x1806ff010, 0x1806ff062)),
    66853: ((0x1806f1d3d, 0x1806f1d80),),
    66884: ((0x1806ea118, 0x1806ea1dd),),
    66911: ((0x1806eb8a0, 0x1806eb91f),),
    67048: ((0x18071eaa1, 0x18071eb1d),),
    67059: ((0x180707968, 0x1807079e9),),
    67063: ((0x180707a44, 0x180707a55),),
    72802: ((0x180926f48, 0x180926f80), (0x180926fbf, 0x180927050)),
    74509: ((0x1809c08bb, 0x1809c0917),),
    74635: ((0x1809c3879, 0x1809c388b), (0x1809c3a51, 0x1809c3aac)),
    80930: ((0x180bb36ee, 0x180bb3710),),
    80989: ((0x180bc8475, 0x180bc84eb),),
    81328: ((0x180bd5025, 0x180bd5043),),
    81393: ((0x180bffde9, 0x180bffe22), (0x180bffe34, 0x180bffe54)),
}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--game', type=Path, default=DEFAULT_GAME)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    native = Native(args.game)
    dll = fingerprint(native.pe.path)
    metadata = fingerprint(native.metadata_path)
    assert (dll['sha256'], metadata['sha256']) == (
        loader['EXPECTED_DLL'], loader['EXPECTED_METADATA'])

    cs = capstone.Cs(capstone.CS_ARCH_X86, capstone.CS_MODE_64)
    cs.detail = True
    methods = {}
    for index, ranges in SELECTION.items():
        method = native.method(index)
        start = method['address']
        end = native.addresses[bisect_right(native.addresses, start)]
        assert all(start <= lo < hi <= end for lo, hi in ranges), method['fullname']
        instructions = loader['disassembly'](native, cs, start, end, ranges)
        methods[index] = {'method': method, 'boundaryEnd': hex(end),
                          'selected': [[hex(lo), hex(hi)] for lo, hi in ranges],
                          'instructions': instructions}

    class_index = next(i for i, _ in enumerate(native.types)
                       if native.typename(i) == 'Torappu.Battle.Deck/CharacterCard')
    talent_class_index = next(i for i, _ in enumerate(native.types)
                              if native.typename(i) == 'Torappu.Battle.BasicTalent')
    slot = 21
    row = native.types[class_index]
    encoded, = struct.unpack_from('<I', native.metadata,
                                  native.table(17)[0] + 4 * (row['vtableStart'] + slot))
    _, prefix, displacement = struct.unpack('<BHi', native.pe.read(0x1806f1d3d, 7))
    assert prefix == 0x058b, hex(prefix)
    operand = 0x1806f1d44 + displacement
    callback, = native.pe.unpack('<Q', operand)
    assert callback >> 29 == 3 and callback & 1, hex(callback)
    callback_method = native.method((callback & 0x1fffffff) >> 1)
    assert callback_method['index'] == 67048, callback_method['fullname']
    result = {
        'methods': methods,
        'validTalentField': next(field for field in native.fields(talent_class_index)
                                 if not field['static'] and field['offset'] == 0x48),
        'touchPrefabSlot': {'slot': slot, 'encoded': hex(encoded),
                            'method': native.method((encoded & 0x1fffffff) >> 1)},
        'cardConstructorCallback': {'operand': hex(operand), 'encoded': hex(callback),
                                    'method': callback_method},
    }
    provenance = {
        'scope': 'Selected native startup and registration instructions. No game execution.',
        'client': {'dll': dll, 'metadata': metadata},
        'tool': {'script': fingerprint(Path(__file__)), 'capstone': capstone.__version__},
    }
    args.out.write_text(json.dumps({'provenance': provenance, 'result': result},
                                   ensure_ascii=False, indent=2) + '\n')


if __name__ == '__main__':
    main()
