#!/usr/bin/env python3
"""Scan installed source-independent Buff descriptors and two concrete candidate bindings."""
import argparse
import hashlib
import importlib.util
import json
import struct
from pathlib import Path

decoder_path = Path('docs/research/evidence/buff-group-expiry-20261111/content/extract.py')
spec = importlib.util.spec_from_file_location('existing_buff_decoder', decoder_path)
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--game', type=Path, default=m.DEFAULT_GAME)
parser.add_argument('--out', type=Path, required=True)
args = parser.parse_args()
args.out.mkdir(parents=True, exist_ok=True)
base = args.game / 'Arknights_Data/StreamingAssets/AB/Windows'
script_source = base / 'anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin'
scripts = {}
for cab, data in m.bundle(script_source)[0]:
    if cab.endswith(('.resS', '.resource')):
        continue
    for obj in m.serialized(data)['objects']:
        if obj['classid'] == 115:
            scripts[(cab, obj['id'])] = m.script(obj, data)

provenance = {
    'collectedOn': '2026-11-12',
    'scope': 'Static installed holder and selected serialized Prefabs; no game execution or runtime XLua verification.',
    'script': m.fingerprint(Path(__file__)),
    'decoder': m.fingerprint(decoder_path),
    'typeTreeDecoder': m.fingerprint(m.READER_PATH),
    'serializedLayoutReader': m.fingerprint(m.EXTERNAL_PATH),
    'scriptBundle': m.fingerprint(script_source),
}


def save(name, result, sources):
    (args.out / name).write_text(json.dumps(
        {'provenance': provenance | {'sources': sources}, 'result': result},
        ensure_ascii=False, indent=2,
    ) + '\n')


def source_node(root, pointer):
    current, parents = root, []
    for part in pointer.strip('/').split('/'):
        parents.append(current)
        current = current[int(part)] if isinstance(current, list) else current[part]
    return next((p for p in reversed(parents) if isinstance(p, dict) and '$type' in p), {})


holder = base / 'config/buff_template_holder.ab'
fields = ['buffKey', 'templateKey', 'loadFromDB', 'disableOverride', 'overrideKey',
          'overrideType', 'maxStackCnt', 'maxValidStackCnt', 'independentCharacterSource',
          'lifeTimeType', 'lifeTime', 'durationKey']
source_fields = ['_buffOwner', '_useSpecialBuffSource', '_specialBuffSource',
                 '_sourceType', '_overrideBuffSourceType', '_buffSourceType', '_useHostAsSource',
                 '_isDerivedBuff', '_finishDerivedBuffIfParentFinish']
template_count, descriptors, selected = 0, [], []
for cab, data in m.bundle(holder)[0]:
    if cab.endswith(('.resS', '.resource')):
        continue
    for obj in m.serialized(data)['objects']:
        if obj['classid'] != 114:
            continue
        raw = data[obj['start']:obj['start'] + obj['size']]
        stream = m.Reader(raw, p=28)
        stream.string()
        for _ in range(stream.val('i')):
            start = stream.p
            key, effect, priority = stream.string(), stream.string(), stream.val('i')
            events = []
            for _ in range(stream.val('i')):
                event, program = stream.val('i'), stream.string()
                refs = [{'file': stream.val('i'), 'pathId': str(stream.val('q'))}
                        for _ in range(stream.val('i'))]
                events.append({'event': event, 'actions': json.loads(program), 'refs': refs})
            template_count += 1
            origin = {'templateKey': key, 'cab': cab, 'pathId': str(obj['id']),
                      'offset': start, 'bytes': stream.p - start,
                      'sha256': hashlib.sha256(raw[start:stream.p]).hexdigest()}
            root = {'events': events}
            for pointer, node in m.walk(root):
                if not node.get('independentCharacterSource'):
                    continue
                owner = source_node(root, pointer)
                descriptors.append({'origin': origin, 'pointer': pointer,
                                    'descriptor': {name: node.get(name) for name in fields},
                                    'creation': {name: owner[name] for name in source_fields if name in owner}
                                    | {'type': owner.get('$type')}})
            if key in {'vampir[light]', 'halfidle_damage_scale[stack]'}:
                selected.append({'origin': origin, 'priority': priority, 'effect': effect, 'events': events})
        assert stream.p == len(raw)
save('holder.json', {'templateCount': template_count,
                     'independentDescriptorCount': len(descriptors),
                     'independentTemplateCount': len({r['origin']['templateKey'] for r in descriptors}),
                     'loadFromDBCount': sum(bool(r['descriptor']['loadFromDB']) for r in descriptors),
                     'descriptors': descriptors}, [m.fingerprint(holder)])


def script_binding(value, externals):
    reference = value['common:490']
    external = externals[reference['m_FileID'] - 1]
    return scripts[(external['path'].split('/')[-1], reference['m_PathID'])]


def object_record(source, cab, obj, raw, value, externals, hierarchy=None):
    row = {'bundle': str(source), 'cab': cab, 'pathId': str(obj['id']),
           'rawSha256': hashlib.sha256(raw).hexdigest(),
           'script': script_binding(value, externals), 'value': value}
    if hierarchy is not None:
        row['hierarchy'] = hierarchy
    return row


counts = {'bundles': 0, 'objects': 0, 'candidateTypes': 0, 'decoded': 0,
          'independentDescriptors': 0, 'failures': []}
enemy_sources, enemy_selected = [], []
vampir_validator = None
for source in sorted((base / 'battle').glob('enm_pfb*.ab')):
    counts['bundles'] += 1
    enemy_sources.append(m.fingerprint(source))
    for cab, data in m.bundle(source)[0]:
        if cab.endswith(('.resS', '.resource')):
            continue
        state = m.serialized(data)
        layouts, externals = m.external_reader.trees(data)
        candidates = {key for key, layout in enumerate(layouts)
                      if 'independentCharacterSource' in json.dumps(layout)}
        counts['candidateTypes'] += len(candidates)
        names, transforms = {}, {}
        for obj in state['objects']:
            raw = data[obj['start']:obj['start'] + obj['size']]
            if obj['classid'] == 1:
                reader = m.Reader(raw)
                reader.read(reader.val('i') * 12)
                reader.val('i')
                names[obj['id']] = reader.string()
            elif obj['classid'] == 4:
                value = m.reader.decode(raw, layouts[obj['typeid']])
                transforms[obj['id']] = (value['common:374']['m_PathID'], value['m_Father']['m_PathID'])
        by_owner = {owner: tid for tid, (owner, _) in transforms.items()}
        for obj in state['objects']:
            if obj['classid'] != 114:
                continue
            counts['objects'] += 1
            raw = data[obj['start']:obj['start'] + obj['size']]
            if source.name == 'enm_pfb_35.ab' and obj['id'] == -4100747990600572875:
                value = m.reader.decode(raw, layouts[obj['typeid']])
                vampir_validator = object_record(source, cab, obj, raw, value, externals)
            if obj['typeid'] not in candidates:
                continue
            try:
                value = m.reader.decode(raw, layouts[obj['typeid']])
            except Exception as error:
                counts['failures'].append({'bundle': str(source), 'cab': cab,
                                           'pathId': str(obj['id']), 'error': str(error)})
                continue
            counts['decoded'] += 1
            independent = [{'pointer': p, 'value': n} for p, n in m.walk(value)
                           if n.get('independentCharacterSource')]
            counts['independentDescriptors'] += len(independent)
            if not independent and 'vampir[light]' not in json.dumps(value):
                continue
            tid = by_owner.get(struct.unpack_from('<q', raw, 4)[0])
            hierarchy = []
            while tid:
                owner, parent = transforms[tid]
                hierarchy.append(names[owner])
                tid = parent
            enemy_selected.append(object_record(source, cab, obj, raw, value, externals, hierarchy)
                                  | {'independentDescriptors': independent})
save('enemy-prefabs.json', {'counts': counts, 'selected': enemy_selected}, enemy_sources)

global_source = base / 'battle/prefabs/[uc]globalbuffs.ab'
global_selected = []
for cab, data in m.bundle(global_source)[0]:
    if cab.endswith(('.resS', '.resource')):
        continue
    state = m.serialized(data)
    layouts, externals = m.external_reader.trees(data)
    for obj in state['objects']:
        if obj['classid'] != 114:
            continue
        raw = data[obj['start']:obj['start'] + obj['size']]
        if b'halfidle_damage_scale[stack]' not in raw:
            continue
        value = m.reader.decode(raw, layouts[obj['typeid']])
        if value.get('_key') == 'halfidle_damage_scale[stack]':
            global_selected.append(object_record(global_source, cab, obj, raw, value, externals))

metadata_path = args.game / 'Arknights_Data/il2cpp_data/Metadata/global-metadata.dat'
metadata = metadata_path.read_bytes()
assert struct.unpack_from('<II', metadata) == (0xfab11baf, 29)


def table(index):
    return struct.unpack_from('<II', metadata, 8 + index * 8)


def records(index, layout):
    offset, size = table(index)
    layout = struct.Struct(layout)
    return [layout.unpack_from(metadata, position) for position in range(offset, offset + size, layout.size)]


strings, _ = table(2)


def string(index):
    start = strings + index
    return metadata[start:metadata.index(0, start)].decode()


field_rows = records(11, '<iiI')
defaults = {row[0]: row for row in records(7, '<iii')}
default_start, _ = table(8)
enums = []
for definition in records(19, '<17i8H2I'):
    name = string(definition[1]) + '.' + string(definition[0])
    if name not in {'Torappu.ProfessionCategory', 'Torappu.Battle.EntityCategory', 'Torappu.Battle.SideType'}:
        continue
    values = []
    for index in range(definition[8], definition[8] + definition[19]):
        default = defaults.get(index)
        if default is None or default[2] < 0:
            continue
        position = default_start + default[2]
        first = metadata[position]
        if first < 0x80:
            encoded, length = first, 1
        elif first < 0xc0:
            encoded, length = ((first & 0x3f) << 8) | metadata[position + 1], 2
        else:
            raise ValueError('Selected enum constant needs an unimplemented compressed encoding')
        values.append({'name': string(field_rows[index][0]), 'fieldIndex': index,
                       'encodedBytes': metadata[position:position + length].hex(),
                       'value': (encoded >> 1) ^ -(encoded & 1)})
    enums.append({'typename': name, 'values': values})
assert vampir_validator is not None
assert len(global_selected) == 1
save('candidates.json', {'templates': selected, 'vampirValidator': vampir_validator,
                         'halfidleGlobalBuff': global_selected[0], 'enums': enums},
     [m.fingerprint(holder), m.fingerprint(base / 'battle/enm_pfb_35.ab'),
      m.fingerprint(global_source), m.fingerprint(metadata_path)])
print(json.dumps({'holderTemplates': template_count, 'independentDescriptors': len(descriptors),
                  'independentTemplates': len({r['origin']['templateKey'] for r in descriptors}),
                  'enemyPrefabCounts': counts}, ensure_ascii=False))
