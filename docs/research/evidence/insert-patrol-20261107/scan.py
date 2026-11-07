#!/usr/bin/env python3
"""Join actual SPAWN route references with retained-route Insert candidates."""
import argparse
import hashlib
import json
from pathlib import Path

ACTORS = {
    'afterbeast': 'enemy_2123_dyjsww',
    'reid': 'enemy_1539_reid',
    'mirbst': 'enemy_1571_mirbst',
    'mateo': 'enemy_1551_bolicp',
    'gardener': 'enemy_1544_cledub',
    'folchr': 'enemy_1572_folchr',
}
SYMBOLS = ('acfnc', 'left_acfncb', 'right_acfncb', 'agbmes', 'agmbox', 'aglina', 'agbmal', 'agbomb', 'agpack')


def fingerprint(path):
    raw = path.read_bytes()
    return {'path': str(path), 'bytes': len(raw), 'sha256': hashlib.sha256(raw).hexdigest()}


def actions(value, pointer=''):
    if isinstance(value, dict):
        if value.get('actionType') == 'SPAWN':
            yield pointer, value
        for key, child in value.items():
            yield from actions(child, pointer + '/' + key.replace('~', '~0').replace('/', '~1'))
    elif isinstance(value, list):
        for index, child in enumerate(value):
            yield from actions(child, pointer + '/' + str(index))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--levels', type=Path, default=Path('.cache/native-research/checkpoint-nondefault-20261107/mirror-current/zh_CN/gamedata/levels'))
    parser.add_argument('--manifest', type=Path, default=Path('docs/research/evidence/checkpoint-nondefault-20261107/config/current-profile.json'))
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    files = sorted((args.levels / 'obt').rglob('*.json')) + sorted((args.levels / 'activities').rglob('*.json'))
    baseline = json.loads(args.manifest.read_text())['result']['sources']
    expected = {row['path'].removeprefix('zh_CN/gamedata/levels/'): row for row in baseline}
    actual_paths = {str(path.relative_to(args.levels)) for path in files}
    if actual_paths != expected.keys():
        raise ValueError('selected file set differs from the pinned Git-verified manifest')
    matched = []; errors = []; patrol_routes = 0; alert_routes = 0; parsed = 0; null_routes = 0; null_checkpoints = 0
    actor_files = {label: 0 for label in ACTORS}
    symbol_files = {symbol: [] for symbol in SYMBOLS}
    patrol_spawn_count = 0; alert_spawn_count = 0
    for path in files:
        try:
            raw = path.read_bytes()
            source = expected[str(path.relative_to(args.levels))]
            if len(raw) != source['bytes'] or hashlib.sha256(raw).hexdigest() != source['sha256']:
                raise ValueError('raw bytes differ from the pinned Git-verified manifest')
            data = json.loads(raw); parsed += 1
        except (OSError, ValueError) as error:
            errors.append({'file': str(path), 'error': str(error)}); continue
        if not isinstance(data, dict):
            continue
        present_symbols = [symbol for symbol in SYMBOLS if symbol.encode() in raw]
        for symbol in present_symbols:
            symbol_files[symbol].append({'file': str(path.relative_to(args.levels)), 'source': fingerprint(path)})
        route_info = {}
        for group in ('routes', 'extraRoutes'):
            for index, route in enumerate(data.get(group, []) or []):
                if route is None:
                    null_routes += 1
                    continue
                checkpoints = route.get('checkpoints', []) or []
                kinds = [checkpoint.get('type') if checkpoint is not None else None for checkpoint in checkpoints]
                null_checkpoints += sum(checkpoint is None for checkpoint in checkpoints)
                patrol = [i for i, kind in enumerate(kinds) if kind == 'PATROL_MOVE']
                alert = [i for i, kind in enumerate(kinds) if kind == 'ALERT']
                patrol_routes += bool(patrol); alert_routes += bool(alert)
                route_info[(group, index)] = {'pointer': f'/{group}/{index}', 'patrolIndices': patrol, 'alertIndices': alert, 'checkpointTypes': kinds, 'definition': route}
        for symbol in present_symbols:
            symbol_files[symbol][-1]['patrolRoutePointers'] = [info['pointer'] for info in route_info.values() if info['patrolIndices']]
            symbol_files[symbol][-1]['alertRoutePointers'] = [info['pointer'] for info in route_info.values() if info['alertIndices']]
        spawns = []
        for pointer, action in actions({'waves': data.get('waves', []), 'branches': data.get('branches', {})}):
            if action.get('count', 0) <= 0 or action.get('isValid', True) is False:
                continue
            group = 'extraRoutes' if pointer.startswith('/branches/') else 'routes'
            info = route_info.get((group, action.get('routeIndex')))
            spawns.append({'pointer': pointer, 'action': action, 'routePointer': info['pointer'] if info else None,
                           'patrolIndices': info['patrolIndices'] if info else [], 'alertIndices': info['alertIndices'] if info else []})
        actors = {label: [spawn for spawn in spawns if str(spawn['action'].get('key', '')).startswith(key)] for label, key in ACTORS.items()}
        patrol_spawn_count += sum(bool(spawn['patrolIndices']) for spawn in spawns)
        alert_spawn_count += sum(bool(spawn['alertIndices']) for spawn in spawns)
        actors = {label: value for label, value in actors.items() if value}
        if not actors:
            continue
        for label in actors:
            actor_files[label] += 1
        interesting = [spawn for spawn in spawns if spawn['patrolIndices'] or spawn['alertIndices']]
        selected_pointers = {spawn['routePointer'] for spawn in interesting}
        selected_pointers.update(spawn['routePointer'] for value in actors.values() for spawn in value)
        matched.append({'file': str(path.relative_to(args.levels)), 'source': fingerprint(path), 'actors': actors,
                        'patrolOrAlertSpawns': interesting,
                        'allPatrolOrAlertRoutes': [info for info in route_info.values() if info['patrolIndices'] or info['alertIndices']],
                        'routes': [info for info in route_info.values() if info['pointer'] in selected_pointers],
                        'enemyDbRefs': data.get('enemyDbRefs', []), 'runes': data.get('runes', [])})
    summary = {'scanned': len(files), 'parsed': parsed, 'sourceHashesVerified': parsed, 'errors': len(errors), 'patrolRouteCount': patrol_routes,
               'alertRouteCount': alert_routes, 'nullRouteSlots': null_routes, 'nullCheckpointSlots': null_checkpoints, 'actorLevelCounts': actor_files,
               'patrolSpawnActionCount': patrol_spawn_count, 'alertSpawnActionCount': alert_spawn_count,
               'symbolLevelCounts': {symbol: len(hits) for symbol, hits in symbol_files.items()},
               'symbolLevelsWithPatrolOrAlert': {symbol: [hit['file'] for hit in hits if hit['patrolRoutePointers'] or hit['alertRoutePointers']] for symbol, hits in symbol_files.items()},
               'actorLevelsWithAnyPatrolOrAlertRoute': {label: [row['file'] for row in matched if label in row['actors'] and row['allPatrolOrAlertRoutes']] for label in ACTORS},
               'intersections': {label: [{'file': row['file'], 'candidateCount': len(row['patrolOrAlertSpawns']),
                    'ownRoutePatrol': any(s['patrolIndices'] for s in row['actors'][label])}
                   for row in matched if label in row['actors'] and row['patrolOrAlertSpawns']] for label in ACTORS}}
    result = {'summary': summary, 'matchedLevels': matched, 'symbolMatches': symbol_files, 'errors': errors,
              'limits': 'SPAWN and route reference joins only. Presence, random selection, branch triggering, temporal overlap, aura eligibility and state qualification require independent verification. Prefix variants are candidates. No runtime observation.'}
    provenance = {'revision': '63c7cec73c3858d0ae913f85cc89af3cef4d744f', 'sourceUrl': 'https://github.com/Kengxxiao/ArknightsGameData',
                  'script': fingerprint(Path(__file__)), 'levels': str(args.levels),
                  'sourceManifest': fingerprint(args.manifest),
                  'scope': 'All obt/**/*.json and activities/**/*.json in the fixed-revision local corpus; routes and extraRoutes; positive-count valid SPAWN in main waves and branches.'}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps({'provenance': provenance, 'result': result}, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(summary, ensure_ascii=False))


if __name__ == '__main__':
    main()
