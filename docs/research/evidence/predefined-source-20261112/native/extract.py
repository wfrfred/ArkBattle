#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Extract ordinary predefined-character creation and optional Card injection."""
import argparse
import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path.cwd() / '.agents/skills/arkbattle-native-research/scripts'))
from native import DEFAULT_GAME, Native, fingerprint

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--game', type=Path, default=DEFAULT_GAME)
parser.add_argument('--out', type=Path, required=True)
args = parser.parse_args()
args.out.mkdir(parents=True, exist_ok=True)
native = Native(args.game)
provenance = native.provenance()
provenance.update(collectedOn='2026-11-12', extractionScript=fingerprint(Path(__file__)))
provenance['location']['modules'] = {
    key: value for key, value in provenance['location']['modules'].items()
    if key in ('Assembly-CSharp.dll', 'mscorlib.dll')
}
selected = {
    'Torappu.Battle.BattleController.CreatePredefinedCharacter',
    'Torappu.Battle.BattleController._CreatePredefinedCharacter',
    'Torappu.Battle.BattleController._PreprocessPredefinedCharacter',
    'Torappu.Battle.BattleController._LoadPredefinedData',
    'Torappu.Battle.Character.BuildAsPredefined',
    'Torappu.Battle.GameMode.GameModeFactory/DefaultGameMode.NeedPreprocessPredefinedCharacter',
    'Torappu.DataConvertUtil.CheckStagePredefine',
    'Torappu.DataConvertUtil.GenPredefinedCardsToInject',
}
code_ends = {
    'Torappu.Battle.Character.BuildAsPredefined': 0x180a9d1b8,
    'Torappu.Battle.BattleController._CreatePredefinedCharacter': 0x18066520c,
    'Torappu.Battle.BattleController._PreprocessPredefinedCharacter': 0x18066c568,
}
records = []
xrefs = []
for item in native.methods:
    name = native.typename(item['declaringType']) + '.' + native.string(item['nameIndex'])
    if name not in selected:
        continue
    method = native.method(item['index'])
    start = method['address']
    following_method = min(address for address in native.addresses if address > start)
    end = code_ends.get(name, following_method)
    cursor = start
    parts = []
    while cursor < end:
        part = native.disassemble_at(cursor, max_bytes=end - cursor)
        parts.append(part)
        following = int(part['end'], 16)
        if following <= cursor:
            raise ValueError('nonprogressing native range')
        cursor = following
    lines = []
    for part in parts:
        for instruction in part['instructions']:
            line = instruction['address'] + ': ' + instruction['mnemonic']
            if instruction['operands']:
                line += ' ' + instruction['operands']
            if instruction.get('methods'):
                line += ' ; ' + ' | '.join(instruction['methods'][:4])
            lines.append(line)
    label = name.rsplit('.', 1)[-1] + '-' + str(method['index'])
    (args.out / (label + '.asm')).write_text('\n'.join(lines) + '\n')
    records.append({
        'method': method,
        'followingMethodAddress': hex(following_method),
        'codeEnd': hex(end),
        'excludedTail': None if end == following_method else {
            'start': hex(end), 'end': hex(following_method),
            'reason': 'Switch-table data and trailing alignment; not decoded as instructions.',
        },
        'parts': [
            {key: value for key, value in part.items() if key != 'instructions'}
            | {'instructionCount': len(part['instructions'])}
            for part in parts
        ],
    })
    if name in {
        'Torappu.Battle.Character.BuildAsPredefined',
        'Torappu.Battle.BattleController._CreatePredefinedCharacter',
    }:
        found = native.xrefs(start)
        for candidate in found['candidates']:
            candidate['precedingMethods'] = [
                native.method(index) for index in candidate['precedingMethodCandidates']
            ]
        xrefs.append({'method': method, 'xrefs': found})
metadata = []
for item in native.types:
    name = native.typename(item['index'])
    if name not in {
        'Torappu.LevelData/PredefinedData',
        'Torappu.LevelData/PredefinedData/PredefinedCharacter',
    }:
        continue
    metadata.append({
        'fullname': name, 'index': item['index'],
        'parent': native.type_name(item['parentIndex']),
        'fields': [
            field for field in native.fields(item['index'])
            if not field['name'].startswith(('__Hotfix', '_c__Hotfix'))
        ],
        'methods': [
            native.method(index)
            for index in range(item['methodStart'], item['methodStart'] + item['methodCount'])
            if native.string(native.methods[index]['nameIndex']).startswith('get_')
        ],
    })
for name, result in [('native', records), ('metadata', metadata), ('xrefs', xrefs)]:
    (args.out / (name + '.json')).write_text(json.dumps(
        {'provenance': provenance, 'result': result}, ensure_ascii=False, indent=2,
    ) + '\n')
print(json.dumps({'methods': [
    (row['method']['index'], row['method']['fullname']) for row in records
], 'types': [row['fullname'] for row in metadata]}))
