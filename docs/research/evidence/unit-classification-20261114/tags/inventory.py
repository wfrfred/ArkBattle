#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Inventory battle tag names and exact related storage owners, not live game behavior."""
import argparse
import json
import re
import sys
from pathlib import Path

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path.cwd() / '.agents/skills/arkbattle-native-research/scripts'))
from native import Native, DEFAULT_GAME, fingerprint


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--game', type=Path, default=DEFAULT_GAME)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    native = Native(args.game)
    matches, fields, owners = [], [], []
    pattern = re.compile(r'tag|race|enemytype|applyway|leveltype', re.I)
    owner_names = {'Torappu.Battle.Entity', 'Torappu.Battle.Unit',
                   'Torappu.Battle.Enemy', 'Torappu.Battle.EnemyData',
                   'Torappu.EnemyData', 'Torappu.CharacterData',
                   'Torappu.Battle.Character', 'Torappu.Battle.TargetOptions'}
    for owner in native.types:
        fullname = native.typename(owner['index'])
        if not fullname.startswith('Torappu.'):
            continue
        battle = fullname.startswith('Torappu.Battle.')
        related_type = bool(pattern.search(fullname)) and (
            battle or any(x in fullname for x in ('Enemy', 'Character', 'Race')))
        selected_fields = []
        for i in range(max(0, owner['fieldStart']), max(0, owner['fieldStart']) + owner['fieldCount']):
            field = native.field_records[i]
            name = native.string(field['nameIndex'])
            if name.startswith('__Hotfix') or name.startswith('_c__Hotfix'):
                continue
            if pattern.search(name):
                selected_fields.append(i)
        if related_type or fullname in owner_names or (battle and selected_fields):
            decoded = native.fields(owner['index'])
            fields.extend({'owner': fullname, **f} for f in decoded if f['index'] in selected_fields)
            if related_type or fullname in owner_names:
                owners.append({'index': owner['index'], 'fullname': fullname,
                               'fields': decoded,
                               'methods': [native.method(i) for i in range(max(0, owner['methodStart']),
                                  max(0, owner['methodStart']) + owner['methodCount'])]})
        for i in range(max(0, owner['methodStart']), max(0, owner['methodStart']) + owner['methodCount']):
            name = native.string(native.methods[i]['nameIndex'])
            if pattern.search(name) and (battle or related_type):
                matches.append(native.method(i))
    provenance = native.provenance()
    provenance['caseTool'] = {'script': fingerprint(Path(__file__))}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps({'provenance': provenance,
        'result': {'scope': 'Full Torappu.Battle metadata method/field name inventory with tag/race/enemytype/applyway/leveltype terms; related static data types are separately included.',
                   'methods': matches, 'fields': fields, 'owners': owners}}, ensure_ascii=False, indent=2)+'\n')
    print(json.dumps({'methods': len(matches), 'fields': len(fields), 'owners': len(owners)}))


if __name__ == '__main__':
    main()
