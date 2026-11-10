#!/usr/bin/env python3
"""Extract selected EnemySkill/UnitMode bindings using existing Unity readers."""
import argparse
import datetime
import hashlib
import importlib.util
import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True
ROOT = Path.cwd()
TOOLS = ROOT / '.agents/skills/arkbattle-native-research/scripts'
sys.path.insert(0, str(TOOLS))
from native import DEFAULT_GAME, fingerprint
from unity_assets import bundle, serialized, script

def module(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    result = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(result)
    return result

READER_PATH = ROOT / 'docs/research/evidence/attack-addon-order-20261102/content/decode_content.py'
EXTERNAL_PATH = ROOT / 'docs/research/evidence/nymph-action-settlement-20261103/projectile/decode_projectile.py'
reader = module('existing_reader', READER_PATH)
external_reader = module('existing_external_reader', EXTERNAL_PATH)
ACTORS = {
    'enemy_9012_acloon': 'battle/enm_pfb_28.ab',
    'enemy_1505_frstar': 'battle/enm_pfb_17.ab',
    'enemy_10088_hlsnip': 'battle/enm_pfb_3.ab',
}

def references(value):
    if isinstance(value, dict):
        if value.get('m_FileID') == 0 and isinstance(value.get('m_PathID'), int) and value['m_PathID']:
            yield value['m_PathID']
        for child in value.values():
            yield from references(child)
    elif isinstance(value, list):
        for child in value:
            yield from references(child)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--game', type=Path, default=DEFAULT_GAME)
    parser.add_argument('--database', type=Path, default=Path('.cache/native-research/leithanien-enemydata-20261109/enemy_database.json'))
    parser.add_argument('--level', type=Path, default=Path('.cache/native-research/checkpoint-nondefault-20261107/mirror-current/zh_CN/gamedata/levels/obt/main/level_main_04-10.json'))
    parser.add_argument('--level-manifest', type=Path, default=Path('docs/research/evidence/checkpoint-nondefault-20261107/config/current-profile.json'))
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    base = args.game / 'Arknights_Data/StreamingAssets/AB/Windows'
    scripts_path = base / 'anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin'
    scripts = dict(bundle(scripts_path)[0])
    script_objects = {name: {o['id']: o for o in serialized(data)['objects'] if o['classid'] == 115} for name, data in scripts.items() if not name.endswith(('.resS','.resource'))}
    sources = [fingerprint(scripts_path)]
    rows = []
    for actor, relative in ACTORS.items():
        path = base / relative
        sources.append(fingerprint(path))
        actor_rows = []
        for filename, data in bundle(path)[0]:
            if filename.endswith(('.resS','.resource')):
                continue
            state = serialized(data)
            layouts, externals = external_reader.trees(data)
            names, transforms, game_objects = {}, {}, {}
            for obj in state['objects']:
                if obj['classid'] not in (1, 4):
                    continue
                value = reader.decode(data[obj['start']:obj['start'] + obj['size']], layouts[obj['typeid']])
                if obj['classid'] == 1:
                    names[obj['id']] = value.get('common:427', value.get('m_Name'))
                    game_objects[obj['id']] = value
                else:
                    transforms[obj['id']] = (value['common:374']['m_PathID'], value['m_Father']['m_PathID'])
            by_owner = {value[0]: key for key, value in transforms.items()}
            for obj in state['objects']:
                if obj['classid'] != 114:
                    continue
                raw = data[obj['start']:obj['start'] + obj['size']]
                value = reader.decode(raw, layouts[obj['typeid']])
                transform = by_owner.get(value['common:374']['m_PathID'])
                hierarchy = []
                while transform:
                    owner, parent = transforms[transform]
                    hierarchy.append({'name': names.get(owner), 'gameObjectPathId': str(owner), 'transformPathId': str(transform)})
                    transform = parent
                if not any(entry['name'] == actor for entry in hierarchy):
                    continue
                script_ref = value['common:490']
                external = externals[script_ref['m_FileID'] - 1]
                script_file = external['path'].split('/')[-1]
                script_data = scripts[script_file]
                script_obj = script_objects[script_file][script_ref['m_PathID']]
                binding = script(script_obj, script_data)
                actor_rows.append({
                    'actor': actor, 'bundle': relative, 'file': filename,
                    'pathId': str(obj['id']), 'typeId': obj['typeid'],
                    'objectSha256': hashlib.sha256(raw).hexdigest(),
                    'hierarchy': hierarchy,
                    'gameObject': game_objects[value['common:374']['m_PathID']],
                    'scriptBinding': {'externalReference': external, 'file': script_file, 'pathId': str(script_obj['id']), 'value': binding},
                    'value': value,
                })
        selected_ids = {int(row['pathId']) for row in actor_rows if row['scriptBinding']['value']['cl'] in ('EnemySkill', 'UnitMode', 'Enemy')}
        # EnemySkill obtains the Ability component on its own GameObject; preserve that pairing.
        skill_owners = {row['value']['common:374']['m_PathID'] for row in actor_rows if row['scriptBinding']['value']['cl'] == 'EnemySkill'}
        paired_rows = [row for row in actor_rows if row['value']['common:374']['m_PathID'] in skill_owners]
        for row in paired_rows:
            selected_ids.add(int(row['pathId']))
            selected_ids.update(references(row['value']))
        selected = [row for row in actor_rows if int(row['pathId']) in selected_ids]
        rows.extend(selected)
        print(actor, 'all MonoBehaviours', len(actor_rows), 'selected', len(selected))
        for row in selected:
            if row['scriptBinding']['value']['cl'] in ('EnemySkill','UnitMode'):
                print(row['pathId'], row['scriptBinding']['value']['cl'], [entry['name'] for entry in row['hierarchy']])
    database_raw = args.database.read_bytes()
    assert hashlib.sha256(database_raw).hexdigest() == 'eb8559db76aecd92c37b3ac038de0e9aeb8b6d6c107adfaeadfe0fbc098e067b', 'EnemyDB differs from the fixed-revision source'
    database = json.loads(database_raw)
    records = []
    for record in database['enemies']:
        if record['Key'] in ACTORS:
            records.append({'key': record['Key'], 'levels': [{
                'level': level['level'],
                'name': level['enemyData'].get('name'),
                'prefabKey': level['enemyData'].get('prefabKey'),
                'skills': level['enemyData'].get('skills'),
                'spData': level['enemyData'].get('spData'),
            } for level in record['Value']]})
    level_raw = args.level.read_bytes()
    level_manifest = json.loads(args.level_manifest.read_text())
    level_source = next(row for row in level_manifest['result']['sources'] if row['path'] == 'zh_CN/gamedata/levels/obt/main/level_main_04-10.json')
    assert hashlib.sha256(level_raw).hexdigest() == level_source['sha256']
    assert len(level_raw) == level_source['bytes']
    level = json.loads(level_raw)
    spawns = []
    for wi, wave in enumerate(level['waves']):
        for fi, fragment in enumerate(wave['fragments']):
            for ai, action in enumerate(fragment['actions']):
                if action.get('actionType') == 'SPAWN' and action.get('key') == 'enemy_1505_frstar':
                    spawns.append({'pointer': f'/waves/{wi}/fragments/{fi}/actions/{ai}', 'value': action})
    level_binding = {'source': level_source, 'sourceHashVerified': True, 'enemyDbRefs': [row for row in level['enemyDbRefs'] if row['id'] == 'enemy_1505_frstar'], 'spawns': spawns}
    result = {
        'provenance': {
            'collectedOn': datetime.date.today().isoformat(),
            'script': fingerprint(Path(__file__)),
            'readers': [fingerprint(READER_PATH), fingerprint(EXTERNAL_PATH), fingerprint(TOOLS / 'unity_assets.py')],
            'sources': sources,
            'database': {'file': fingerprint(args.database), 'sourceUrl': 'https://github.com/Kengxxiao/ArknightsGameData', 'revision': '63c7cec73c3858d0ae913f85cc89af3cef4d744f', 'path': 'zh_CN/gamedata/levels/enemydata/enemy_database.json', 'gitBlobSha1': hashlib.sha1(b'blob ' + str(len(database_raw)).encode() + b'\0' + database_raw).hexdigest()},
            'levelManifest': fingerprint(args.level_manifest),
            'scope': 'One exact main-stage SPAWN plus three exact Enemy-model actor roots; Enemy/UnitMode/EnemySkill components, Ability siblings on each skill GameObject and directly referenced Trigger/Behaviour objects. Current installed Prefab and fixed-revision mirror EnemyData; no runtime observation, no XLua execution.'
        },
        'result': {'enemyData': records, 'prefabBindings': rows, 'frostnovaLevelBinding': level_binding},
    }
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')

if __name__ == '__main__':
    main()
