#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Extract selected Pallas/Skadi source-group bindings and two host-source methods."""
import argparse
import importlib.util
import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True
root = Path.cwd()
sys.path.insert(0, str(root / '.agents/skills/arkbattle-native-research/scripts'))
from native import DEFAULT_GAME, Native, fingerprint

reader_path = root / 'docs/research/evidence/buff-group-expiry-20261111/content/extract.py'
spec = importlib.util.spec_from_file_location('previous_content_extractor', reader_path)
reader = importlib.util.module_from_spec(spec)
spec.loader.exec_module(reader)
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--game', type=Path, default=DEFAULT_GAME)
parser.add_argument('--out', type=Path, required=True)
args = parser.parse_args()
args.out.mkdir(parents=True, exist_ok=True)
base = args.game / 'Arknights_Data/StreamingAssets/AB/Windows'
scripts = base / 'anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin'
lookup = {}
for filename, data in reader.bundle(scripts)[0]:
    if filename.endswith(('.resS', '.resource')):
        continue
    for obj in reader.serialized(data)['objects']:
        if obj['classid'] == 115:
            lookup[(filename, obj['id'])] = reader.script(obj, data)
selected_sources = {
    'charpack/char_485_pallas.ab': 'char_485_pallas',
    'charpack/char_1012_skadi2.ab': 'char_1012_skadi2',
    'pkgrps/btl_pfb_tokens_0.ab': 'token_10017_skadi2_dedant',
}
selected = []
for relative, actor in selected_sources.items():
    bundle = base / relative
    result = reader.prefab(bundle, {actor}, lookup)
    rows = []
    for item in result['selected']:
        descriptors = [entry for entry in item['descriptors']
                       if entry['value'].get('buffKey') in ('skadi2_heal', 'pallas_s_3[peak]')]
        if not descriptors and not (actor == 'char_485_pallas' and '_modes' in item['bindingFields']):
            continue
        rows.append({**item, 'descriptors': descriptors})
    wanted = {int(row['pathId']): row for row in rows}
    for cab, data in reader.bundle(bundle)[0]:
        if cab.endswith(('.resS', '.resource')):
            continue
        layouts, _ = reader.external_reader.trees(data)
        for obj in reader.serialized(data)['objects']:
            if obj['id'] not in wanted:
                continue
            value = reader.reader.decode(data[obj['start']:obj['start'] + obj['size']], layouts[obj['typeid']])
            wanted[obj['id']]['lifecycleFields'] = {key: value[key] for key in (
                '_removeBuffWhenTargetLeave', '_removeBuffWhenAbilityDetached',
                '_onlyAddBuffOnceForEachTarget', '_selfOption',
            ) if key in value}
    selected.append({'relative': relative, 'actor': actor, 'selected': rows})
native = Native(args.game)
provenance = native.provenance()
provenance.update(collectedOn='2026-11-12', extractionScript=fingerprint(Path(__file__)))
provenance['location']['modules'] = {
    key: value for key, value in provenance['location']['modules'].items()
    if key in ('Assembly-CSharp.dll', 'mscorlib.dll')
}
names = {
    'Torappu.Battle.Abilities.AuraWithHostAsSourceAbility.DealTargetTouched',
    'Torappu.Battle.Abilities.AuraWithHostAsSourceAbility.DoAttach',
}
records = []
for item in native.methods:
    name = native.typename(item['declaringType']) + '.' + native.string(item['nameIndex'])
    if name not in names:
        continue
    method = native.method(item['index'])
    start = method['address']
    end = min(address for address in native.addresses if address > start)
    cursor = start
    parts = []
    while cursor < end:
        part = native.disassemble_at(cursor, max_bytes=end - cursor)
        parts.append(part)
        following = int(part['end'], 16)
        if following <= cursor:
            raise ValueError('nonprogressing native range')
        cursor = following
    label = name.rsplit('.', 1)[-1] + '-' + str(method['index'])
    lines = []
    for part in parts:
        for instruction in part['instructions']:
            line = instruction['address'] + ': ' + instruction['mnemonic']
            if instruction['operands']:
                line += ' ' + instruction['operands']
            if instruction.get('methods'):
                line += ' ; ' + ' | '.join(instruction['methods'][:4])
            lines.append(line)
    (args.out / (label + '.asm')).write_text('\n'.join(lines) + '\n')
    records.append({
        'method': method,
        'followingMethodAddress': hex(end),
        'parts': [
            {key: value for key, value in part.items() if key != 'instructions'}
            | {'instructionCount': len(part['instructions'])}
            for part in parts
        ],
    })
assert len(records) == len(names)
(args.out / 'native.json').write_text(json.dumps(
    {'provenance': provenance, 'result': records}, ensure_ascii=False, indent=2,
) + '\n')
content_provenance = {
    'collectedOn': '2026-11-12',
    'scope': 'Selected current static actor bindings; no client execution or XLua verification.',
    'sources': [fingerprint(scripts), *[fingerprint(base / relative) for relative in selected_sources]],
    'readers': [fingerprint(reader_path), fingerprint(reader.READER_PATH), fingerprint(reader.EXTERNAL_PATH)],
    'extractionScript': fingerprint(Path(__file__)),
}
(args.out / 'bindings.json').write_text(json.dumps(
    {'provenance': content_provenance, 'result': selected}, ensure_ascii=False, indent=2,
) + '\n')
print(json.dumps({'nativeMethods': len(records), 'selectedComponents': sum(len(row['selected']) for row in selected)}))
