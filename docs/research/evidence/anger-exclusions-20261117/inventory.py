#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Resolve the current ability-family enums and exclusion policy entrypoints."""
import argparse
import importlib.util
import json
import sys
from pathlib import Path

ROOT = Path.cwd()
sys.dont_write_bytecode = True
sys.path.insert(0, str(ROOT / '.agents/skills/arkbattle-native-research/scripts'))
from native import Native, DEFAULT_GAME, fingerprint


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--game', type=Path, default=DEFAULT_GAME)
    p.add_argument('--out', type=Path, required=True)
    a = p.parse_args()
    n = Native(a.game)
    decoder_path = ROOT / 'docs/research/evidence/unit-audit-20261110/coordinates-numeric/extract.py'
    spec = importlib.util.spec_from_file_location('anger_enum_decoder', decoder_path)
    decoder = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(decoder)
    defaults = {x['fieldIndex']: x for x in n.records(7, '<iii', 'fieldIndex typeIndex dataIndex')}
    base, _ = n.table(8)
    owners, enums = [], []
    for t in n.types:
        name = n.typename(t['index'])
        if name in ('Torappu.Battle.Ability', 'Torappu.Battle.Ability/Options') or ('Ability' in name and 'Family' in name):
            fields = n.fields(t['index'])
            owners.append({'index': t['index'], 'fullname': name, 'fields': fields})
            values = []
            for field in fields:
                default = defaults.get(field['index'])
                if default is None or default['dataIndex'] < 0:
                    continue
                start = base + default['dataIndex']
                first = n.metadata[start]
                if first < 0xe0:
                    value, end = decoder.cu32(n.metadata, start)
                elif first == 0xf0:
                    value, end = int.from_bytes(n.metadata[start + 1:start + 5], 'little'), start + 5
                elif first in (0xfe, 0xff):
                    value, end = (0xfffffffe if first == 0xfe else 0xffffffff), start + 1
                else:
                    raise ValueError((name, field['name'], first))
                values.append({'name': field['name'], 'value': (value >> 1) ^ -(value & 1), 'encodedBytes': n.metadata[start:end].hex(), 'default': default})
            if values:
                enums.append({'fullname': name, 'values': values})
    methods = []
    for raw in n.methods:
        name = n.typename(raw['declaringType']) + '.' + n.string(raw['nameIndex'])
        if ('palsyinterrupt' in name.lower() or 'familygroup' in name.lower()
                or 'skillcaster' in name.lower()
                or name in ('Torappu.Battle.Ability.AssignData', 'Torappu.Battle.Ability.Init',
                            'Torappu.Battle.BasicSkill.AssignData', 'Torappu.Battle.BasicSkill.Init')):
            methods.append(n.method(raw['index']))
    provenance = n.provenance()
    provenance['checkedOn'] = '2026-11-17'
    provenance['caseTool'] = {'script': fingerprint(Path(__file__)), 'enumDecoder': fingerprint(decoder_path)}
    a.out.parent.mkdir(parents=True, exist_ok=True)
    a.out.write_text(json.dumps({'provenance': provenance, 'result': {'owners': owners, 'enums': enums, 'methods': methods}}, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'enums': enums, 'methods': [(m['index'], m['fullname']) for m in methods]}, ensure_ascii=False))


if __name__ == '__main__':
    main()
