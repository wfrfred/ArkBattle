#!/usr/bin/env python3
"""Archive fixed raw data records selecting the actual life-mechanism examples."""
import argparse
import hashlib
import json
import os
import subprocess
from pathlib import Path


def digest(data):
    return {'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest(),
            'gitBlobSha1': hashlib.sha1(f'blob {len(data)}\0'.encode() + data).hexdigest()}


def walk(value, path=''):
    if isinstance(value, dict):
        yield path, value
        for key, child in value.items():
            yield from walk(child, path + '/' + key)
    elif isinstance(value, list):
        for index, child in enumerate(value):
            yield from walk(child, path + '/' + str(index))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--content', type=Path, required=True)
    parser.add_argument('--mirror', type=Path, default=Path('.cache/native-research/checkpoint-nondefault-20261107/mirror'))
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    content = json.loads(args.content.read_text())
    baseline = json.loads(Path('docs/research/evidence/unit-classification-20261114/config/static-inputs.json').read_text())
    sources = baseline['provenance']['sources']
    data = {}
    for row in sources:
        raw = Path(row['file']).read_bytes()
        assert hashlib.sha256(raw).hexdigest() == row['sha256'], row['file']
        data[Path(row['path']).name] = json.loads(raw)
    chars = []
    for key in content['result']['selection']['characters']:
        v = data['character_table.json'][key]
        chars.append({'pointer': '/' + key, 'key': key,
                      'value': {k: v.get(k) for k in ('name', 'appellation', 'profession', 'subProfessionId', 'trait', 'talents', 'skills', 'displayTokenDict')}})
    enemy_keys = set(content['result']['selection']['enemies']) | {
        'enemy_1529_dsdevr', 'enemy_1567_pope', 'enemy_1595_agbmes', 'enemy_1562_cjtaot',
        'enemy_1288_duskls', 'enemy_1365_spnwiz', 'enemy_9010_acpupp'}
    enemies = [{'pointer': '/enemies/' + str(i), 'value': value}
               for i, value in enumerate(data['enemy_database.json']['enemies'])
               if value['Key'] in enemy_keys]
    equip = [{'pointer': '/' + key, 'value': value}
             for key, value in data['battle_equip_table.json'].items()
             if key == 'uniequip_002_skadi']
    env = dict(os.environ, GIT_NO_LAZY_FETCH='1')
    revision = subprocess.check_output(['git', '-C', str(args.mirror), 'rev-parse', 'HEAD'], env=env).decode().strip()
    assert revision == 'bee3f83c5d60590b5e1cd42b8d09d00ce32ab10d'
    levels = []
    for path in ('zh_CN/gamedata/levels/obt/main/level_main_04-10.json',
                 'zh_CN/gamedata/levels/activities/act15side/level_act15side_01.json',
                 'zh_CN/gamedata/levels/activities/act15side/level_act15side_09.json',
                 'zh_CN/gamedata/levels/activities/act17side/level_act17side_10.json'):
        raw = subprocess.check_output(['git', '-C', str(args.mirror), 'show', revision + ':' + path], env=env)
        value = json.loads(raw)
        chosen = []
        # Preserve original DB refs and Spawn nodes referring to the relevant keys.
        for pointer, node in walk(value):
            if (node.get('actionType') == 'SPAWN' and isinstance(node.get('key'), str) and node['key'] in enemy_keys
                    or isinstance(node.get('id'), str) and node['id'] in enemy_keys
                    or isinstance(node.get('prefabKey'), str) and node['prefabKey'] in enemy_keys):
                chosen.append({'pointer': pointer, 'value': node})
        levels.append({'path': path, 'revision': revision, **digest(raw), 'selected': chosen})
    result = {'provenance': {'checkedOn': '2026-11-14',
                  'script': {'path': str(Path(__file__)), **digest(Path(__file__).read_bytes())},
                  'staticSources': sources, 'contentSelectionInput': {'path': str(args.content), **digest(args.content.read_bytes())},
                  'scope': 'Selected original character/equipment/enemy records and actual supported normal-level DB/Spawn references. Git mirror reads disable lazy fetching; versions remain separate from installed Prefabs.'},
              'result': {'characters': chars, 'enemies': enemies, 'equipment': equip, 'levels': levels}}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'characters': len(chars), 'enemies': len(enemies), 'equipment': len(equip),
                      'levelMatches': [len(x['selected']) for x in levels], 'out': str(args.out)}))


if __name__ == '__main__':
    main()
