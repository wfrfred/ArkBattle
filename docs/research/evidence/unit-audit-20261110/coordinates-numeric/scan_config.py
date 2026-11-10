#!/usr/bin/env python3
"""Profile pinned Branch groups and keep only the selected Pack/trigger witnesses."""
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
import argparse
import hashlib
import json
import subprocess
import sys
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[5]
TOOLS = ROOT / '.agents/skills/arkbattle-native-research/scripts'
sys.path.insert(0, str(TOOLS))
from native import fingerprint
from config import select, get

REPOSITORY = 'Kengxxiao/ArknightsGameData'
REVISION = 'bee3f83c5d60590b5e1cd42b8d09d00ce32ab10d'
PREFIX = 'zh_CN/gamedata/levels/'
RO5 = PREFIX + 'obt/roguelike/ro5/level_rogue5_b-9-a.json'
RO6 = PREFIX + 'obt/roguelike/ro6/level_rogue6_3-7.json'
ENEMIES = PREFIX + 'enemydata/enemy_database.json'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--mirror', type=Path, required=True)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    tree = subprocess.run(['git', '-C', str(args.mirror), 'ls-tree', '-r', '-z', REVISION, '--', PREFIX],
                          check=True, capture_output=True).stdout
    blobs = {}
    for line in tree.split(b'\0'):
        if not line:
            continue
        meta, path = line.split(b'\t', 1)
        mode, kind, blob = meta.decode().split()
        if kind == 'blob':
            blobs[path.decode()] = blob
    paths = sorted(p for p in blobs if Path(p).name.startswith('level_') and p.endswith('.json'))
    selection = hashlib.sha256('\n'.join(f'{p}\t{blobs[p]}' for p in paths).encode()).hexdigest()
    counts = Counter()
    interleaved, failures = [], []
    cache, sources = {}, {}

    def read(path):
        raw = (args.mirror / path).read_bytes()
        git_blob = hashlib.sha1(b'blob ' + str(len(raw)).encode() + b'\0' + raw).hexdigest()
        if git_blob != blobs[path]:
            raise ValueError(f'{path}: worktree bytes do not match pinned Git blob')
        return json.loads(raw), dict(path=path, gitBlob=git_blob, bytes=len(raw), sha256=hashlib.sha256(raw).hexdigest(),
                                     url=f'https://github.com/{REPOSITORY}/blob/{REVISION}/{path}')

    for path in paths:
        try:
            data, source = read(path)
        except (OSError, ValueError) as error:
            failures.append(dict(path=path, error=str(error)))
            continue
        counts['verifiedFiles'] += 1
        excluded = '/sandbox/' in path or '/tower/' in path
        counts['excludedFiles' if excluded else 'includedFiles'] += 1
        if path in {RO5, RO6}:
            cache[path], sources[path] = data, source
        for pointer, actions in select(data, ('branches', '*', 'phases', '*', 'actions')):
            counts['excludedPhases' if excluded else 'includedPhases'] += 1
            if excluded:
                continue
            groups = defaultdict(list)
            named_spawns = [(i, action) for i, action in enumerate(actions) if action.get('actionType') == 'SPAWN']
            for order, (index, action) in enumerate(named_spawns):
                key = action.get('randomSpawnGroupKey')
                if key:
                    groups[key].append((order, index))
            matches = [dict(group=key, filteredIndices=[x for x, _ in indices], sourceIndices=[y for _, y in indices])
                       for key, indices in groups.items() if indices[-1][0] - indices[0][0] + 1 != len(indices)]
            if any(a.get('randomSpawnGroupPackKey') for a in actions):
                counts['packPhases'] += 1
            if matches:
                counts['interleavedNamedSpawnPhases'] += 1
                interleaved.append(dict(path=path, pointer=pointer, groups=matches,
                                        hasPack=any(a.get('randomSpawnGroupPackKey') for a in actions)))
    if failures:
        raise ValueError(f'incomplete pinned scan: {failures[:3]}')
    enemy_data, sources[ENEMIES] = read(ENEMIES)
    samples = []

    def sample(path, pointer):
        samples.append(dict(source=path, pointer=pointer, value=get(cache[path], pointer)))

    sample(RO5, '/branches/dysuib_relic_branch/phases/0')
    sample(RO5, '/branches/dycyue_body/phases/0')
    sample(RO5, '/waves/0/fragments/0/actions/3')
    sample(RO6, '/waves/0/fragments/1/actions')
    for index, reference in enumerate(cache[RO5]['enemyDbRefs']):
        if reference['id'] == 'enemy_2128_dysuib_sp':
            base = f'/enemyDbRefs/{index}'
            for field in ['id', 'level', 'useDb', 'overwrittenData/prefabKey', 'overwrittenData/talentBlackboard']:
                sample(RO5, base + '/' + field)
    for index, entry in enumerate(enemy_data['enemies']):
        if entry['Key'] not in {'enemy_2126_dycyue', 'enemy_2128_dysuib'}:
            continue
        samples.append(dict(source=ENEMIES, pointer=f'/enemies/{index}/Key', value=entry['Key']))
        for field in ['prefabKey', 'talentBlackboard', 'skills']:
            if field in entry['Value'][0]['enemyData']:
                samples.append(dict(source=ENEMIES, pointer=f'/enemies/{index}/Value/0/enemyData/{field}',
                                    value=entry['Value'][0]['enemyData'][field]))
    provenance = dict(repository=REPOSITORY, revision=REVISION, script=fingerprint(Path(__file__)),
                      tools=[fingerprint(TOOLS / 'config.py')],
                      selection=dict(prefix=PREFIX, filename='level_*.json', totalFiles=len(paths),
                                     treePathBlobListSha256=selection,
                                     excludedCohorts=['path containing /sandbox/', 'path containing /tower/']),
                      scope='Pinned JSON config and reference evidence only; excludes runtime execution and active XLua. Integer legacy ActionType values are not decoded as SPAWN.')
    result = dict(complete=not failures, counts=counts, failures=failures, sources=list(sources.values()),
                  interleaved=interleaved, samples=samples)
    args.out.mkdir(parents=True, exist_ok=True)
    (args.out / 'configuration.json').write_text(json.dumps(dict(provenance=provenance, result=result), ensure_ascii=False, indent=2)+'\n')
    print(json.dumps(dict(counts)))


if __name__ == '__main__':
    main()
