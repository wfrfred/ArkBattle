#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
"""Re-extract selected Buff descriptors and actor bindings with existing Unity readers."""
import argparse
import hashlib
import importlib.util
import json
import sys
import struct
from pathlib import Path

sys.dont_write_bytecode = True
ROOT = Path.cwd()
TOOLS = ROOT / '.agents/skills/arkbattle-native-research/scripts'
sys.path.insert(0, str(TOOLS))
from native import DEFAULT_GAME, fingerprint
from unity_assets import Reader, bundle, serialized, script

READER_PATH = ROOT / 'docs/research/evidence/attack-addon-order-20261102/content/decode_content.py'
spec = importlib.util.spec_from_file_location('existing_unity_decoder', READER_PATH)
reader = importlib.util.module_from_spec(spec)
spec.loader.exec_module(reader)
EXTERNAL_PATH = ROOT / 'docs/research/evidence/nymph-action-settlement-20261103/projectile/decode_projectile.py'
spec = importlib.util.spec_from_file_location('existing_external_decoder', EXTERNAL_PATH)
external_reader = importlib.util.module_from_spec(spec)
spec.loader.exec_module(external_reader)

SELECTED_TEMPLATES = {
    'skadi2_t_2', 'pallas_s_3[peak]', 'ascln_t_1',
    'atk_to_atk[final_addition]', 'ep_break_sanity_enemy',
    'abnormal_buff[creator]', 'ymgpck_t[push_enemy]', 'nymph_t_1', 'nymph_e_003_t_1',
}
BUFF_FIELDS = ['buffKey', 'templateKey', 'loadFromDB', 'overrideKey', 'disableOverride',
    'independentCharacterSource', 'overrideType', 'maxStackCnt', 'maxValidStackCnt',
    'refreshRemainingTimeWhenStackMax', 'clearAllStackCntWhenTimeUp',
    'lifeTimeType', 'lifeTime', 'durationKey', 'remainingTimeKey', 'blackboard']

def walk(value, pointer=''):
    if isinstance(value, dict):
        yield pointer, value
        for key, child in value.items():
            yield from walk(child, pointer + '/' + str(key).replace('~', '~0').replace('/', '~1'))
    elif isinstance(value, list):
        for index, child in enumerate(value):
            yield from walk(child, pointer + '/' + str(index))


def templates(source):
    selected, counts = [], {'templates': 0, 'sourceIndependent': 0,
        'differentOverrideKey': 0, 'limitedStackDecay': 0, 'limitedStackClearAll': 0,
        'overrideDisabled': 0, 'overrideDisabledAndSourceIndependent': 0}
    files, version = bundle(source)
    for cab, data in files:
        if cab.endswith(('.resS', '.resource')):
            continue
        for obj in serialized(data)['objects']:
            if obj['classid'] != 114:
                continue
            raw = data[obj['start']:obj['start'] + obj['size']]
            stream = Reader(raw, p=28)
            object_sha256 = hashlib.sha256(raw).hexdigest()
            name = stream.string()
            count = stream.val('i')
            for _ in range(count):
                start = stream.p
                key, effect = stream.string(), stream.string()
                priority = stream.val('i')
                events = []
                for _ in range(stream.val('i')):
                    event, program = stream.val('i'), stream.string()
                    references = [{'file': stream.val('i'), 'pathId': str(stream.val('q'))}
                                  for _ in range(stream.val('i'))]
                    events.append({'event': event, 'actions': json.loads(program), 'refs': references})
                counts['templates'] += 1
                origin = {'cab': cab, 'pathId': str(obj['id']), 'objectSha256': object_sha256,
                    'templateKey': key, 'templateOffsetInObject': start, 'templateBytes': stream.p-start,
                    'templateSha256': hashlib.sha256(raw[start:stream.p]).hexdigest()}
                descriptors = []
                for pointer, node in walk({'events': events}):
                    if 'buffKey' not in node or 'overrideType' not in node:
                        continue
                    if node.get('independentCharacterSource'): counts['sourceIndependent'] += 1
                    if node.get('overrideKey') and node['overrideKey'] != node['buffKey']: counts['differentOverrideKey'] += 1
                    if node.get('disableOverride'): counts['overrideDisabled'] += 1
                    if node.get('disableOverride') and node.get('independentCharacterSource'): counts['overrideDisabledAndSourceIndependent'] += 1
                    if node.get('overrideType') in ('STACK', 1) and node.get('lifeTimeType') in ('LIMITED', 1):
                        counts['limitedStackClearAll' if node.get('clearAllStackCntWhenTimeUp') else 'limitedStackDecay'] += 1
                    if key in SELECTED_TEMPLATES:
                        descriptors.append({'pointer': pointer, 'value': {field: node.get(field) for field in BUFF_FIELDS}})
                if key in SELECTED_TEMPLATES:
                    selected.append({'origin': origin, 'effect': effect, 'priority': priority,
                                     'events': events, 'descriptors': descriptors})
            assert stream.p == len(raw), ('unparsed holder suffix', stream.p, len(raw))
    return {'unityVersion': version, 'scanCounts': counts, 'selected': selected}


def prefab(source, wanted_roots, script_lookup):
    rows = []
    files, version = bundle(source)
    for cab, data in files:
        if cab.endswith(('.resS', '.resource')):
            continue
        state = serialized(data)
        layouts, externals = external_reader.trees(data)
        names, transforms = {}, {}
        for obj in state['objects']:
            if obj['classid'] == 1:
                raw = data[obj['start']:obj['start'] + obj['size']]
                stream = Reader(raw)
                stream.read(stream.val('i')*12)
                stream.val('i')
                names[obj['id']] = stream.string()
            elif obj['classid'] == 4:
                value = reader.decode(data[obj['start']:obj['start'] + obj['size']], layouts[obj['typeid']])
                transforms[obj['id']] = (value['common:374']['m_PathID'], value['m_Father']['m_PathID'])
        transform_by_owner = {owner: tid for tid, (owner, _) in transforms.items()}
        for obj in state['objects']:
            if obj['classid'] != 114:
                continue
            raw = data[obj['start']:obj['start'] + obj['size']]
            owner = struct.unpack_from('<q', raw, 4)[0]
            tid = transform_by_owner.get(owner)
            hierarchy = []
            while tid:
                owner, parent = transforms[tid]
                hierarchy.append({'name': names[owner], 'gameObjectPathId': str(owner), 'transformPathId': str(tid)})
                tid = parent
            if not any(entry['name'] in wanted_roots for entry in hierarchy):
                continue
            value = reader.decode(raw, layouts[obj['typeid']])
            buff_rows = []
            for pointer, node in walk(value):
                if 'buffKey' in node and 'overrideType' in node:
                    buff_rows.append({'pointer': pointer, 'value': {field: node.get(field) for field in BUFF_FIELDS if field != 'lifeTimeType'}})
            # Keep the binding component and linked mode metadata; only selected actor roots are considered.
            if buff_rows or '_modes' in value or '_talents' in value:
                script_ref = value['common:490']
                external = externals[script_ref['m_FileID'] - 1]
                script_file = external['path'].split('/')[-1]
                binding = script_lookup[(script_file, script_ref['m_PathID'])]
                rows.append({'bundle': str(source), 'cab': cab, 'pathId': str(obj['id']),
                    'typeId': obj['typeid'], 'objectSha256': hashlib.sha256(raw).hexdigest(),
                    'hierarchy': hierarchy,
                    'scriptBinding': {'externalReference': external, 'file': script_file, 'value': binding},
                    'bindingFields': {key: value[key] for key in ['common:349', 'common:490', '_modes', '_talents', '_metadata', '_selector', '_attachPassiveBuffsOnDummy', '_ignoreIfOwnerDead'] if key in value},
                    'descriptors': buff_rows})
    return {'unityVersion': version, 'selected': rows}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--game', type=Path, default=DEFAULT_GAME)
    parser.add_argument('--out', type=Path, required=True)
    parser.add_argument('--database', type=Path, default=Path('.cache/native-research/leithanien-enemydata-20261109/enemy_database.json'))
    args = parser.parse_args()
    base = args.game / 'Arknights_Data/StreamingAssets/AB/Windows'
    holder = base / 'config/buff_template_holder.ab'
    prefab_sources = {
        'charpack/char_1012_skadi2.ab': {'char_1012_skadi2'},
        'charpack/char_4132_ascln.ab': {'char_4132_ascln'},
        'charpack/char_4146_nymph.ab': {'char_4146_nymph'},
        'battle/enm_pfb_26.ab': {'enemy_10111_ymgpck'},
        'battle/prefabs/[uc]skills.ab': {'skchr_pallas_3', 'skchr_skadi2_3'},
    }
    scripts_path = base / 'anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin'
    script_lookup = {}
    for filename, data in bundle(scripts_path)[0]:
        if filename.endswith(('.resS', '.resource')): continue
        for obj in serialized(data)['objects']:
            if obj['classid'] == 115:
                script_lookup[(filename, obj['id'])] = script(obj, data)
    print('reading installed template holder', flush=True)
    result = {'templates': templates(holder), 'prefabs': []}
    for relative, wanted in prefab_sources.items():
        print('reading', relative, flush=True)
        result['prefabs'].append({'relative': relative, **prefab(base / relative, wanted, script_lookup)})
    database_raw = args.database.read_bytes()
    assert hashlib.sha256(database_raw).hexdigest() == 'eb8559db76aecd92c37b3ac038de0e9aeb8b6d6c107adfaeadfe0fbc098e067b', 'EnemyDB fixed revision differs'
    database = json.loads(database_raw)
    result['enemyData'] = [{'key': row['Key'], 'levels': [{'level': level['level'], 'prefabKey': level['enemyData']['prefabKey'], 'name': level['enemyData']['name'], 'talentBlackboard': level['enemyData']['talentBlackboard']} for level in row['Value']]} for row in database['enemies'] if row['Key'] == 'enemy_10111_ymgpck']
    document = {'provenance': {'collectedOn': '2026-11-11', 'script': fingerprint(Path(__file__)),
        'readers': [fingerprint(READER_PATH), fingerprint(EXTERNAL_PATH), fingerprint(TOOLS / 'unity_assets.py')],
        'database': {'file': fingerprint(args.database), 'sourceUrl': 'https://github.com/Kengxxiao/ArknightsGameData', 'revision': '63c7cec73c3858d0ae913f85cc89af3cef4d744f', 'path': 'zh_CN/gamedata/levels/enemydata/enemy_database.json', 'gitBlobSha1': hashlib.sha1(b'blob '+str(len(database_raw)).encode()+b'\0'+database_raw).hexdigest()},
        'sources': [fingerprint(holder), fingerprint(scripts_path), *[fingerprint(base / p) for p in prefab_sources]],
        'scope': 'Entire installed holder descriptor count with nine selected templates, four actor roots and two selected skill roots. Static configuration and binding only; no client/XLua execution.'}, 'result': result}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(document, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'templates': result['templates']['scanCounts'], 'selectedTemplates': len(result['templates']['selected']),
        'prefabs': {p['relative']: len(p['selected']) for p in result['prefabs']}, 'out': str(args.out)}, ensure_ascii=False))

if __name__ == '__main__':
    main()
