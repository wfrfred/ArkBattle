#!/usr/bin/env python3
"""Bind selected true-prefab enemies to pinned EnemyData and real stage spawns."""
import argparse
import collections
import datetime
import hashlib
import json
import subprocess
from pathlib import Path

REVISION = '63c7cec73c3858d0ae913f85cc89af3cef4d744f'
ROOT = Path.cwd()
PREFABS = ('enemy_10163_mnctur', 'enemy_10163_mnctur_2', 'enemy_2137_shsdgo')
EXAMPLES = (
    ('activities/act48side/level_act48side_07.json', '/waves/0/fragments/2/actions/0'),
    ('activities/act48side/level_act48side_ex03.json', '/waves/0/fragments/0/actions/0'),
    ('obt/roguelike/ro6/level_rogue6_c-7.json', '/waves/0/fragments/3/actions/0'),
)

def fingerprint(path, raw=None):
    data = path.read_bytes() if raw is None else raw
    return {'path': str(path.resolve()), 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()}

def git_blob(raw):
    return hashlib.sha1(b'blob ' + str(len(raw)).encode() + b'\0' + raw).hexdigest()

def walk(value, pointer=''):
    if isinstance(value, dict):
        if value.get('actionType') == 'SPAWN':
            yield pointer, value
        for key, item in value.items():
            yield from walk(item, pointer + '/' + str(key).replace('~', '~0').replace('/', '~1'))
    elif isinstance(value, list):
        for index, item in enumerate(value):
            yield from walk(item, pointer + '/' + str(index))

def ordinary_main(pointer, action):
    return (pointer.startswith('/waves/') and action.get('count', 0) > 0
            and not action.get('hiddenGroup') and not action.get('randomSpawnGroupKey')
            and not action.get('randomSpawnGroupPackKey')
            and action.get('randomType') == 'ALWAYS')

def route(document, pointer, action):
    category = 'extraRoutes' if pointer.startswith('/branches/') else 'routes'
    index = action.get('routeIndex')
    items = document.get(category) or []
    if not isinstance(index, int) or not 0 <= index < len(items):
        return None, None
    return f'/{category}/{index}', items[index]

p = argparse.ArgumentParser()
p.add_argument('--mirror', type=Path, default=ROOT / '.cache/native-research/checkpoint-nondefault-20261107/mirror-current')
p.add_argument('--enemy-db', type=Path, default=ROOT / '.cache/native-research/route-operations-20261107/data/enemy_database.json')
p.add_argument('--revision', default=REVISION)
p.add_argument('--out', type=Path, required=True)
a = p.parse_args()
base = a.mirror / 'zh_CN/gamedata/levels'
raw_tree = subprocess.check_output(['git', '-C', str(a.mirror), 'ls-tree', '-r', '-z', a.revision, '--',
                                   'zh_CN/gamedata/levels/obt', 'zh_CN/gamedata/levels/activities'])
expected = {}
for item in raw_tree.split(b'\0'):
    if not item:
        continue
    head, name = item.split(b'\t', 1)
    path = name.decode()
    if path.endswith('.json'):
        expected[path.removeprefix('zh_CN/gamedata/levels/')] = head.split()[2].decode()
paths = {str(path.relative_to(base)): path for category in ('obt', 'activities')
         for path in (base / category).rglob('*.json')}
if set(paths) != set(expected):
    raise ValueError('Pinned level Git tree and actual JSON paths differ')
db_raw = a.enemy_db.read_bytes()
db_git = subprocess.check_output(['git', '-C', str(a.mirror), 'rev-parse',
                                 a.revision + ':zh_CN/gamedata/levels/enemydata/enemy_database.json'], text=True).strip()
if git_blob(db_raw) != db_git:
    raise ValueError('EnemyData source does not match pinned Git blob')
database = json.loads(db_raw)
identities = []
by_key = {}
for index, entry in enumerate(database['enemies']):
    first = entry['Value'][0]['enemyData']
    prefab = first.get('prefabKey', {}).get('m_value')
    if prefab not in PREFABS:
        continue
    row = {'key': entry['Key'], 'prefabKey': prefab, 'pointer': f'/enemies/{index}/Value/0',
           'level': entry['Value'][0]['level'],
           'fields': {key: first.get(key) for key in ('name', 'description', 'prefabKey', 'motion', 'skills', 'talentBlackboard')}}
    identities.append(row)
    by_key[entry['Key']] = prefab
if set(by_key.values()) != set(PREFABS):
    raise ValueError('Not every requested prefab has a pinned EnemyData identity')
stats = {key: {'spawnEntries': 0, 'levelFiles': set(), 'mainUngroupedPositiveEntries': 0,
               'mainUngroupedPositiveFiles': set(), 'mainUngroupedWithMoveEntries': 0,
               'checkpointTypeCountsInMainUngroupedEntries': collections.Counter()} for key in PREFABS}
selected = []
verified = 0
for relative, path in sorted(paths.items()):
    raw = path.read_bytes()
    if git_blob(raw) != expected[relative]:
        raise ValueError(f'File differs from pinned Git blob: {relative}')
    verified += 1
    document = json.loads(raw)
    for pointer, action in walk(document):
        prefab = by_key.get(action.get('key'))
        if prefab is None:
            continue
        summary = stats[prefab]
        summary['spawnEntries'] += 1
        summary['levelFiles'].add(relative)
        route_pointer, program = route(document, pointer, action)
        types = [cp['type'] for cp in (program or {}).get('checkpoints', []) if cp is not None]
        if ordinary_main(pointer, action):
            summary['mainUngroupedPositiveEntries'] += 1
            summary['mainUngroupedPositiveFiles'].add(relative)
            summary['mainUngroupedWithMoveEntries'] += bool(set(types) & {'MOVE', 'PATROL_MOVE'})
            summary['checkpointTypeCountsInMainUngroupedEntries'].update(types)
        if (relative, pointer) in EXAMPLES:
            if not ordinary_main(pointer, action) or 'MOVE' not in types:
                raise ValueError('Selected witness is no longer a plain main Spawn with MOVE')
            selected.append({'file': relative, 'source': fingerprint(path, raw), 'gitBlobSha': expected[relative],
                             'pointer': pointer, 'action': action, 'routePointer': route_pointer, 'route': program,
                             'enemyDbRefs': [{'pointer': f'/enemyDbRefs/{i}', 'value': value}
                                             for i, value in enumerate(document.get('enemyDbRefs') or [])
                                             if value.get('id') == action['key']],
                             'evidence': 'Direct main Wave SPAWN, positive count, no hidden/random group; static executable plan, not game observation.'})
if len(selected) != len(EXAMPLES):
    raise ValueError('A selected witness is absent')
for row in stats.values():
    row['levelFileCount'] = len(row.pop('levelFiles'))
    row['mainUngroupedPositiveFileCount'] = len(row['mainUngroupedPositiveFiles'])
    row['mainUngroupedPositiveFiles'] = sorted(row['mainUngroupedPositiveFiles'])
manifest = '\n'.join(f'{path}\t{expected[path]}' for path in sorted(expected)) + '\n'
output = {'provenance': {'collectedOn': datetime.date.today().isoformat(),
                         'script': fingerprint(Path(__file__)),
                         'repository': 'https://github.com/Kengxxiao/ArknightsGameData',
                         'revision': a.revision, 'mirror': str(a.mirror.resolve()),
                         'enemyDatabase': dict(fingerprint(a.enemy_db, db_raw), gitBlobSha=db_git),
                         'levelSelection': ['zh_CN/gamedata/levels/obt/**/*.json', 'zh_CN/gamedata/levels/activities/**/*.json'],
                         'pathAndGitBlobManifestSha256': hashlib.sha256(manifest.encode()).hexdigest(),
                         'scope': 'Pinned JSON identity/plan evidence. Actual _alwaysCheckCurrentPoint values and native cursor behaviour come from sibling evidence. No game execution or proof that an unreachable layout occurred.'},
          'result': {'requestedPrefabs': list(PREFABS),
                     'inputValidation': {'gitTreeJsonCount': len(expected), 'actualJsonCount': len(paths),
                                         'rawGitBlobsVerified': verified, 'errors': 0},
                     'identities': identities, 'summaries': stats, 'selectedExamples': selected,
                     'limits': ['Counts refer to SPAWN entries, not generated enemy quantities.',
                                'Hidden/group/Branch entries are counted separately from direct main witnesses and are not presumed enabled.',
                                'Supported SideStory and integrated-strategy witnesses contain MOVE; actual path unreachability is not asserted.']}}
a.out.parent.mkdir(parents=True, exist_ok=True)
a.out.write_text(json.dumps(output, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'validated': verified, 'identities': [(x['key'], x['fields']['name']) for x in identities],
                  'counts': {key: {k: value for k, value in row.items() if not isinstance(value, (list, dict))}
                             for key, row in stats.items()}, 'examples': len(selected)}, ensure_ascii=False))
