#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Inspect ability cast return contracts and actual callers for this evidence batch."""
import argparse
import json
from pathlib import Path
import sys

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path.cwd() / '.agents/skills/arkbattle-native-research/scripts'))
from native import Native, fingerprint


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--game', type=Path, required=True)
    parser.add_argument('--out', type=Path, required=True)
    parser.add_argument('--methods-file', type=Path)
    parser.add_argument('--xrefs', action='store_true')
    args = parser.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)
    native = Native(args.game)
    provenance = {
        **native.provenance(),
        'collectedOn': '2026-11-10',
        'extractionScript': fingerprint(Path(__file__)),
    }

    def save(name, result):
        (args.out / name).write_text(json.dumps({
            'provenance': provenance, 'result': result,
        }, ensure_ascii=False, indent=2) + '\n')

    if args.methods_file is None:
        types = []
        failures = []
        for item in native.types:
            name = native.typename(item['index'])
            if name.startswith('Torappu.Battle.') and (
                ('Ability' in name and not any(part in name for part in ['<', '__'])) or
                name.endswith(('AttackWrapper', 'CombatWrapper', 'AttackState', 'SelectorTrigger',
                               'SelectorOrAlwaysTrigger', 'EnemySkill', 'Entity'))
            ):
                methods = [native.method(index) for index in range(
                    item['methodStart'], item['methodStart'] + item['methodCount'])
                    if not native.string(native.methods[index]['nameIndex']).startswith(('__Hotfix', '<>xLua'))]
                if name.endswith('Entity'):
                    methods = [method for method in methods if any(term in method['fullname'].lower()
                               for term in ['ability', 'cast', 'attack', 'skill'])]
                types.append({'fullname': name, 'index': item['index'],
                              'fields': native.fields(item['index']), 'methods': methods})
            if any(term in name.lower() for term in ['castfail', 'abilityfail', 'castresult', 'abilityresult']):
                failures.append({'fullname': name, 'index': item['index'],
                                 'fields': native.fields(item['index'])})
        save('contracts.json', types)
        save('failure-type-search.json', {'terms': ['castfail', 'abilityfail', 'castresult', 'abilityresult'],
                                         'matches': failures, 'scope': 'metadata type-name search only'})
        print(json.dumps({'types': len(types), 'failureTypeNameMatches': len(failures)}))
        return

    requested = json.loads(args.methods_file.read_text())
    selected = []
    for item in native.methods:
        name = native.typename(item['declaringType']) + '.' + native.string(item['nameIndex'])
        if name not in requested:
            continue
        method = native.method(item['index'])
        if not method['address']:
            selected.append({'method': method, 'unavailable': method['addressStatus']})
            continue
        address = method['address']
        end = min(value for value in native.addresses if value > address)
        parts = []
        while address < end:
            part = native.disassemble_at(address, max_bytes=end - address)
            parts.append(part)
            following = int(part['end'], 16)
            if following <= address:
                raise ValueError('non-progressing disassembly range')
            address = following
        result = {'method': method, 'followingMethodAddress': hex(end), 'parts': parts}
        if args.xrefs:
            refs = native.xrefs(method['address'])
            for candidate in refs['candidates']:
                candidate['precedingMethods'] = [native.method(index)
                    for index in candidate['precedingMethodCandidates']]
            result['directCallCandidates'] = refs
        selected.append(result)
        print(method['index'], name, method['returnTypeName'], len(parts), flush=True)
    missing = set(requested) - {item['method']['fullname'] for item in selected}
    if missing:
        raise ValueError(sorted(missing))
    save('bodies.json', selected)


if __name__ == '__main__':
    main()
