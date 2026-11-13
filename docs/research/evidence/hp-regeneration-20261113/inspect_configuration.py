#!/usr/bin/env python3
"""Select real HP-recovery configuration and HP-full listeners; no game execution."""
import argparse
import hashlib
import importlib.util
import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True
ROOT = Path.cwd()
TOOLS = ROOT / '.agents/skills/arkbattle-native-research/scripts'
sys.path.insert(0, str(TOOLS))
from native import fingerprint
from unity_assets import Reader, bundle, serialized

EXPECTED_DB = 'eb8559db76aecd92c37b3ac038de0e9aeb8b6d6c107adfaeadfe0fbc098e067b'
EXPECTED_LEVEL = 'zh_CN/gamedata/levels/obt/main/level_main_05-08.json'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--database', type=Path, default=Path('.cache/native-research/leithanien-enemydata-20261109/enemy_database.json'))
    parser.add_argument('--mirror', type=Path, default=Path('.cache/native-research/checkpoint-nondefault-20261107/mirror'))
    parser.add_argument('--game', type=Path, default=Path('/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game'))
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    assert hashlib.sha256(args.database.read_bytes()).hexdigest() == EXPECTED_DB
    database = json.loads(args.database.read_text())
    counts = {'defined': 0, 'positive': 0, 'zero': 0, 'negative': 0, 'undefined': 0, 'missing': 0}
    positive = []
    for ei, enemy in enumerate(database['enemies']):
        for vi, value in enumerate(enemy['Value']):
            data = value['enemyData']
            rate = data.get('attributes', {}).get('hpRecoveryPerSec')
            if rate is None:
                counts['missing'] += 1
                continue
            if not rate['m_defined']:
                counts['undefined'] += 1
                continue
            counts['defined'] += 1
            category = 'positive' if rate['m_value'] > 0 else 'negative' if rate['m_value'] < 0 else 'zero'
            counts[category] += 1
            if category == 'positive':
                positive.append({'pointer': f'/enemies/{ei}/Value/{vi}/enemyData', 'id': enemy['Key'], 'level': value['level'], 'name': data['name'], 'prefabKey': data['prefabKey'], 'hpRecoveryPerSec': rate})
    level_path = args.mirror / EXPECTED_LEVEL
    level = json.loads(level_path.read_text())
    sample_key = 'enemy_1043_zomsbr'
    references = [{'pointer': f'/enemyDbRefs/{i}', 'value': entry} for i, entry in enumerate(level['enemyDbRefs']) if entry['id'] == sample_key]
    actions = []
    for wi, wave in enumerate(level['waves']):
        for fi, fragment in enumerate(wave['fragments']):
            for ai, action in enumerate(fragment['actions']):
                if action.get('key') == sample_key and action['actionType'] == 'SPAWN':
                    actions.append({'pointer': f'/waves/{wi}/fragments/{fi}/actions/{ai}', 'value': action})
    # Verify this exact level against the prior full-tree audit, rather than trusting a branch name.
    profile_path = Path('docs/research/evidence/checkpoint-nondefault-20261107/config/pinned-profile.json')
    profile = json.loads(profile_path.read_text())
    profile_rows = []
    def walk(value):
        if isinstance(value, dict):
            if value.get('path') == EXPECTED_LEVEL or str(value.get('path', '')).endswith('/' + EXPECTED_LEVEL):
                profile_rows.append(value)
            for v in value.values(): walk(v)
        elif isinstance(value, list):
            for v in value: walk(v)
    walk(profile)
    assert len(profile_rows) == 1
    assert profile_rows[0]['sha256'] == hashlib.sha256(level_path.read_bytes()).hexdigest()
    # Native OnOwnerHpFull dispatches Buff.Event 98; keep exact configured consumers.
    holder = args.game / 'Arknights_Data/StreamingAssets/AB/Windows/config/buff_template_holder.ab'
    consumers = []
    template_count = 0
    files, version = bundle(holder)
    for cab, data in files:
        if cab.endswith(('.resS', '.resource')): continue
        for obj in serialized(data)['objects']:
            if obj['classid'] != 114: continue
            raw = data[obj['start']:obj['start'] + obj['size']]
            stream = Reader(raw, p=28)
            name = stream.string()
            for _ in range(stream.val('i')):
                start = stream.p
                key, effect, priority = stream.string(), stream.string(), stream.val('i')
                events = []
                for _ in range(stream.val('i')):
                    event, program = stream.val('i'), stream.string()
                    refs = [{'file': stream.val('i'), 'pathId': str(stream.val('q'))} for _ in range(stream.val('i'))]
                    if event == 98:
                        events.append({'event': event, 'actions': json.loads(program), 'references': refs})
                template_count += 1
                if events:
                    consumers.append({'templateKey': key, 'effect': effect, 'priority': priority, 'events': events,
                                      'origin': {'cab': cab, 'pathId': str(obj['id']), 'objectSha256': hashlib.sha256(raw).hexdigest(),
                                                 'templateOffsetInObject': start, 'templateBytes': stream.p-start,
                                                 'templateSha256': hashlib.sha256(raw[start:stream.p]).hexdigest()}})
    result = {
        'enemyRecovery': {'field': 'enemyData.attributes.hpRecoveryPerSec', 'counts': counts, 'positive': positive},
        'ordinaryStageExample': {'file': fingerprint(level_path), 'sourcePath': EXPECTED_LEVEL, 'priorProfileMatches': profile_rows, 'enemyDbRefs': references, 'spawnActions': actions},
        'hpFullListeners': {'templatesScanned': template_count, 'matchedTemplates': len(consumers), 'templates': consumers},
    }
    provenance = {'script': fingerprint(Path(__file__)),
                  'database': {**fingerprint(args.database), 'sourceUrl': 'https://api.github.com/repos/Kengxxiao/ArknightsGameData/git/blobs/62ab806926b9c8ca5c80524730caf0066f6c2c2f', 'revision': '63c7cec73c3858d0ae913f85cc89af3cef4d744f'},
                  'stageProfile': fingerprint(profile_path), 'stageRevision': 'bee3f83c5d60590b5e1cd42b8d09d00ce32ab10d',
                  'holder': fingerprint(holder), 'holderUnityVersion': version,
                  'scope': 'Enemy JSON declarations and actual ordinary-stage SPAWN reference; native Buff-template event 98 entries. Static configuration, not live battle observation.'}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps({'provenance': provenance, 'result': result}, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'out': str(args.out), 'recovery': counts, 'hpFullListeners': len(consumers), 'levelRefs': len(references), 'spawns': len(actions), 'profileMatches': len(profile_rows)},ensure_ascii=False))


if __name__ == '__main__':
    main()
