#!/usr/bin/env python3
"""Decode the facing call-site constants from the fingerprinted PE input."""
import argparse
import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path.cwd() / '.agents/skills/arkbattle-native-research/scripts'))
from native import DEFAULT_GAME, PE, fingerprint


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--game', type=Path, default=DEFAULT_GAME)
    parser.add_argument('--reference', type=Path, required=True)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    reference = json.loads(args.reference.read_text())
    dll = fingerprint(args.game / 'GameAssembly.dll')
    expected = reference['provenance']['client']['dll']
    if dll['sha256'] != expected['sha256']:
        raise ValueError('DLL differs from the extraction reference')
    pe = PE(args.game / 'GameAssembly.dll')
    selections = [
        ('move-distance-squared-threshold', 0x1870afe58, '0x180ac7f82'),
        ('almost-vertical-dot-threshold', 0x1870b03cc, '0x180b4bcc4'),
        ('positive-horizontal', 0x1870adbe0, '0x180abb275'),
        ('negative-horizontal', 0x1870addf8, '0x180abb27f'),
        ('safe-normalization-epsilon', 0x1870add88, '0x180abc06d'),
    ]
    result = []
    for label, address, instruction in selections:
        result.append(dict(label=label, address=hex(address), format='<f',
                           rawHex=pe.read(address, 4).hex(),
                           value=pe.unpack('<f', address)[0],
                           instruction=instruction))
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(dict(
        provenance=dict(dll=dll, reference=fingerprint(args.reference),
                        script=fingerprint(Path(__file__))),
        result=result), ensure_ascii=False, indent=2) + '\n')


if __name__ == '__main__':
    main()
