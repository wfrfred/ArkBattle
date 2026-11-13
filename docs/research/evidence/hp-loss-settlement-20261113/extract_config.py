#!/usr/bin/env python3
"""Pin ordinary level bindings and the selected enemies' static records."""
import argparse
import hashlib
import json
import subprocess
from pathlib import Path

REVISION = 'bee3f83c5d60590b5e1cd42b8d09d00ce32ab10d'
ENEMIES = ['enemy_1343_ltrock', 'enemy_3005_lpeopl', 'enemy_1565_mpprme', 'enemy_1164_bmbmot']
LEVELS = ['activities/act26side/level_act26side_tr02.json',
          'obt/main/level_main_15-18.json',
          'activities/act12side/level_act12side_09.json']


def fingerprint(path):
    raw = path.read_bytes()
    return {'path': str(path), 'bytes': len(raw), 'sha256': hashlib.sha256(raw).hexdigest()}


def walk(value, pointer=''):
    if isinstance(value, dict):
        yield pointer, value
        for key, child in value.items():
            yield from walk(child, pointer + '/' + key.replace('~', '~0').replace('/', '~1'))
    elif isinstance(value, list):
        for index, child in enumerate(value):
            yield from walk(child, pointer + '/' + str(index))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--mirror', type=Path, required=True)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    revision = subprocess.check_output(['git', '-C', str(args.mirror), 'rev-parse', 'HEAD'], text=True).strip()
    assert revision == REVISION, revision
    base = args.mirror / 'zh_CN/gamedata/levels'
    sources = []
    levels = []
    for name in LEVELS:
        source = base / name
        sources.append(fingerprint(source))
        document = json.loads(source.read_text())
        selected = []
        for pointer, value in walk(document):
            if (value.get('actionType') == 'SPAWN' and value.get('key') in ENEMIES
                or value.get('id') in ENEMIES
                or value.get('inst', {}).get('characterKey') == 'trap_118_rockfl'):
                selected.append({'pointer': pointer, 'value': value})
        levels.append({'path': name, 'selected': selected})
    source = base / 'enemydata/enemy_database.json'
    sources.append(fingerprint(source))
    records = [{'pointer': '/enemies/' + str(index), 'value': value}
               for index, value in enumerate(json.loads(source.read_text())['enemies'])
               if value['Key'] in ENEMIES]
    args.out.parent.mkdir(parents=True, exist_ok=True)
    result = {'provenance': {'repository': 'Kengxxiao/ArknightsGameData', 'revision': revision,
                            'collectedOn': '2026-11-13', 'script': fingerprint(Path(__file__)),
                            'sources': sources, 'scope': 'Selected ordinary levels and four enemy records; not a claim to scan all content.'},
              'result': {'levels': levels, 'enemies': records}}
    args.out.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'levels': len(levels), 'enemies': len(records)}))


if __name__ == '__main__':
    main()
