#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Inventory runtime classification/profession and selected native bodies."""
import argparse
import bisect
import importlib.util
import json
import re
import sys
from pathlib import Path

sys.dont_write_bytecode = True
ROOT = Path.cwd()
sys.path.insert(0, str(ROOT / '.agents/skills/arkbattle-native-research/scripts'))
from native import Native, DEFAULT_GAME, fingerprint

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--game', type=Path, default=DEFAULT_GAME)
parser.add_argument('--out', type=Path, required=True)
parser.add_argument('--body', type=int, action='append', default=[])
parser.add_argument('--xref', type=int, action='append', default=[])
args = parser.parse_args()
n = Native(args.game)
pattern = re.compile(r'profession|entitycategory|unittype|charactertype|charactercategory|category|characterdata|shareddata', re.I)
owners = {'Torappu.Battle.Entity', 'Torappu.Battle.Unit', 'Torappu.Battle.Character',
          'Torappu.Battle.Enemy', 'Torappu.Battle.Token', 'Torappu.Battle.Trap',
          'Torappu.Battle.TargetOptions', 'Torappu.Battle.BattleUtil',
          'Torappu.Battle.BattleCharacterData', 'Torappu.Battle.SharedDataModel',
          'Torappu.ProfessionID', 'Torappu.ProfessionCategory', 'Torappu.ProfessionCategories',
          'Torappu.UnitType', 'Torappu.UnitTypeMask', 'Torappu.Battle.EntityCategory',
          'Torappu.SourceApplyWay', 'Torappu.EnemyLevelType', 'Torappu.EnemyLevelMask',
          'Torappu.Battle.SideType', 'Torappu.Battle.SideTypeIndex', 'Torappu.PlayerSide',
          'Torappu.PlayerSideMask', 'Torappu.PlayerSideCategories', 'Torappu.CharacterData',
          'Torappu.CharacterData/PowerData'}
excluded = ('Torappu.Battle.UI.', 'Torappu.Battle.Legion', 'Torappu.Battle.Sandbox',
            'Torappu.Battle.ClimbTower.', 'Torappu.Battle.AutoChessShip.')
def relevant(name):
    return (name.startswith('Torappu.Battle.') and not name.startswith(excluded)) or name in owners
field_matches = []
types = []
for t in n.types:
    name = n.typename(t['index'])
    fields = n.fields(t['index']) if relevant(name) else []
    matching = [f for f in fields if pattern.search(f['name']) and not f['name'].startswith('__Hotfix')]
    if matching: field_matches.append({'fullname': name, 'index': t['index'], 'fields': matching})
    if name in owners or (relevant(name) and pattern.search(name)) or matching:
        types.append({'fullname': name, 'index': t['index'],
                      'parentName': n.type_name(t['parentIndex']) if t['parentIndex'] >= 0 else None,
                      'fields': fields})
methods = []
for m in n.methods:
    owner = n.typename(m['declaringType'])
    name = owner + '.' + n.string(m['nameIndex'])
    if relevant(owner) and (owner in owners or pattern.search(name)) and '__Hotfix' not in name and '<>xLua' not in name:
        methods.append(n.method(m['index']))

decoder_path = ROOT / 'docs/research/evidence/unit-audit-20261110/coordinates-numeric/extract.py'
spec = importlib.util.spec_from_file_location('enum_decoder', decoder_path)
decoder = importlib.util.module_from_spec(spec)
spec.loader.exec_module(decoder)
defaults = {r['fieldIndex']: r for r in n.records(7, '<iii', 'fieldIndex typeIndex dataIndex')}
base, _ = n.table(8)
enums = []
for t in types:
    if t['parentName'] != 'System.Enum' and t['fullname'] not in {'Torappu.ProfessionCategories', 'Torappu.PlayerSideCategories'}: continue
    values = []
    for f in t['fields']:
        row = defaults.get(f['index'])
        if row is None or row['dataIndex'] < 0: continue
        position = base + row['dataIndex']
        first = n.metadata[position]
        if first < 0xe0: encoded, end = decoder.cu32(n.metadata, position)
        elif first == 0xf0: encoded, end = int.from_bytes(n.metadata[position+1:position+5], 'little'), position+5
        elif first in (0xfe, 0xff): encoded, end = (0xfffffffe if first == 0xfe else 0xffffffff), position+1
        else: raise ValueError(f'unsupported compressed enum {t["fullname"]}.{f["name"]}: {first:#x}')
        values.append({'name': f['name'], 'value': (encoded >> 1) ^ -(encoded & 1),
                       'fieldIndex': f['index'], 'default': row, 'encodedBytes': n.metadata[position:end].hex()})
    if values: enums.append({'fullname': t['fullname'], 'index': t['index'], 'values': values})

bodies = []
for index in args.body:
    m = n.method(index)
    cursor = m['address']
    end = n.addresses[bisect.bisect_right(n.addresses, cursor)]
    fragments = []
    while cursor < end:
        part = n.disassemble_at(cursor, end - cursor, method=m if cursor == m['address'] else None)
        for ins in part['instructions']:
            if len(ins.get('methods', [])) > 100:
                ins['methodAliasCount'] = len(ins.pop('methods'))
        fragments.append(part)
        advanced = int(part['end'], 16)
        if advanced <= cursor: raise RuntimeError('non-progress')
        cursor = advanced
    bodies.append({'methodIndex': index, 'fullname': m['fullname'], 'logicalEnd': hex(end),
                   'fragments': fragments})
literals = []
literal_rows = n.records(0, '<II', 'length dataIndex')
literal_data, _ = n.table(1)
for body in bodies:
    for part in body['fragments']:
        for instruction in part['instructions']:
            for ref in instruction.get('ripReferences', []):
                try: encoded = n.pe.unpack('<Q', int(ref, 16))[0]
                except (StopIteration, ValueError): continue
                kind, index = (encoded >> 29) & 7, (encoded & 0x1ffffffe) >> 1
                if encoded >> 32 or kind != 5 or index >= len(literal_rows): continue
                row = literal_rows[index]
                value = n.metadata[literal_data+row['dataIndex']:literal_data+row['dataIndex']+row['length']].decode('utf-8')
                literals.append({'instruction': instruction['address'], 'reference': ref,
                    'encodedUsage': hex(encoded), 'index': index, 'text': value})
type_usage_slots = []
for slot in [0x188bd7620, 0x188b851c0, 0x188c54860]:
    encoded = n.pe.unpack('<Q', slot)[0]
    kind = (encoded >> 29) & 7
    index = (encoded & 0x1ffffffe) >> 1
    pointer = n.type_pointers[index]
    data, bits = n.pe.unpack('<QI', pointer)
    type_usage_slots.append({'slot': hex(slot), 'raw': hex(encoded), 'usageKind': kind,
        'typeIndex': index, 'typePointer': hex(pointer), 'typeKind': hex((bits>>16)&255),
        'typeDefinitionIndex': data, 'typeName': n.typename(data)})
xrefs = [{'targetMethod': n.method(i), 'directCandidates': n.xrefs(n.method(i)['address'])}
         for i in args.xref]
provenance = n.provenance()
provenance['collectedOn'] = '2026-11-14'
provenance['scope'] = 'Metadata inventory and bounded static native bodies; not runtime observation.'
provenance['extractionScript'] = fingerprint(Path(__file__))
provenance['enumDecoder'] = fingerprint(decoder_path)
provenance['location']['modules'] = {'Assembly-CSharp.dll': n.modules['Assembly-CSharp.dll']}
args.out.parent.mkdir(parents=True, exist_ok=True)
args.out.write_text(json.dumps({'provenance': provenance,
    'result': {'selection': {'methodPattern': pattern.pattern, 'owners': sorted(owners),
                             'bodies': args.body, 'xrefs': args.xref},
               'types': types, 'fieldMatches': field_matches, 'methods': methods, 'enums': enums, 'typeUsageSlots': type_usage_slots, 'stringLiterals': literals, 'bodies': bodies, 'xrefs': xrefs}},
    ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'types': len(types), 'methods': len(methods), 'enums': len(enums), 'bodies': len(bodies)}))
