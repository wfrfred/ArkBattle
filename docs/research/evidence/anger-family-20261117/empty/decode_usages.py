#!/usr/bin/env python3
"""Resolve MethodDef usages in the selected BasicSkill initialization delegate."""
import argparse
import hashlib
import json
import sys
from pathlib import Path

ROOT = next(p for p in Path(__file__).resolve().parents if (p / '.agents/skills/arkbattle-native-research/scripts/native.py').exists())
sys.dont_write_bytecode = True
sys.path.insert(0, str(ROOT / '.agents/skills/arkbattle-native-research/scripts'))
from native import DEFAULT_GAME, Native, PE, fingerprint


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--game', type=Path, default=DEFAULT_GAME)
    p.add_argument('--native', type=Path, default=Path(__file__).with_name('native.json'))
    p.add_argument('--out', type=Path, required=True)
    a = p.parse_args()
    n = Native.__new__(Native)
    n.metadata_path = a.game / 'Arknights_Data/il2cpp_data/Metadata/global-metadata.dat'
    n.metadata = n.metadata_path.read_bytes()
    n.strings, _ = n.table(2)
    n.types = n.records(19, '<17i8H2I', 'nameIndex namespaceIndex byvalTypeIndex declaringTypeIndex parentIndex elementTypeIndex genericContainerIndex flags fieldStart methodStart eventStart propertyStart nestedTypesStart interfacesStart vtableStart interfaceOffsetsStart reserved methodCount propertyCount fieldCount eventCount nestedTypeCount vtableCount interfacesCount interfaceOffsetsCount bitfield token')
    n.methods = n.records(5, '<5iI4H', 'nameIndex declaringType returnType parameterStart genericContainerIndex token flags iflags slot parameterCount')
    for t in n.types:
        t['name'], t['namespace'] = n.string(t['nameIndex']), n.string(t['namespaceIndex'])
    pe = PE(a.game / 'GameAssembly.dll')
    rows, not_file_backed = [], []
    bodies = json.loads(a.native.read_text())['result']['bodies']
    for b in bodies:
        if b['method']['index'] != 73860:
            continue
        for ins in b['instructions']:
            for address in ins.get('ripReferences', []):
                try:
                    encoded = pe.unpack('<Q', int(address, 16))[0]
                except (StopIteration, ValueError):
                    not_file_backed.append({'instruction': ins['address'], 'global': address})
                    continue
                kind, index = (encoded >> 29) & 7, (encoded & 0x1ffffffe) >> 1
                if not (encoded & 1 and kind == 3 and index < len(n.methods)):
                    continue
                m = n.methods[index]
                rows.append({'instruction': ins['address'], 'global': address, 'encoded': hex(encoded),
                             'kind': kind, 'methodIndex': index,
                             'fullname': n.typename(m['declaringType']) + '.' + n.string(m['nameIndex'])})
    result = {'decode': 'IL2CPP tagged odd metadata usage; MethodDef kind=3, index=(encoded & 0x1ffffffe)>>1', 'usages': rows, 'notFileBacked': not_file_backed}
    a.out.parent.mkdir(parents=True, exist_ok=True)
    a.out.write_text(json.dumps({'provenance': {'scope': 'Static uninitialized MethodDef usages; not runtime delegate inspection.',
        'dll': fingerprint(pe.path), 'metadata': fingerprint(n.metadata_path), 'nativeEvidence': fingerprint(a.native), 'tool': fingerprint(Path(__file__))}, 'result': result}, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(rows, ensure_ascii=False))


if __name__ == '__main__':
    main()
