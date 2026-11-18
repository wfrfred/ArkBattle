#!/usr/bin/env python3
"""Extract the installed Shaw S1/S2 push binding and pinned table inputs."""

import argparse
import hashlib
import json
from pathlib import Path
import runpy
import sys


REPO = Path.cwd()
EXTRACTORS = REPO / 'docs/research/evidence/attack-way-20261118'
DATA_CACHE = REPO / '.cache/native-research/route-operations-20261107/data'
CHARACTER_ID = 'char_277_sqrrel'
SKILL_IDS = ('skchr_sqrrel_1', 'skchr_sqrrel_2')
REVISION = '63c7cec73c3858d0ae913f85cc89af3cef4d744f'
MIRROR = 'https://github.com/Kengxxiao/ArknightsGameData'
HASHES = {
    'character_table.json': '6a61f54802ee194dbb21968976eb99e2a4050e38928bd24bd2b770479076cea1',
    'skill_table.json': '492900f6b957233296c9736c86bb4e5f3ab4b4d7f5055a0f973c5acec3d174b1',
}


def read_table(name):
    file = DATA_CACHE / name
    raw = file.read_bytes()
    digest = hashlib.sha256(raw).hexdigest()
    assert digest == HASHES[name], (name, digest)
    return json.loads(raw), {
        'sourcePath': f'zh_CN/gamedata/excel/{name}',
        'localPath': str(file.relative_to(REPO)),
        'sha256': digest,
        'bytes': len(raw),
    }


def extract_tables(output):
    characters, character_source = read_table('character_table.json')
    skills, skill_source = read_table('skill_table.json')
    character = characters[CHARACTER_ID]
    assert tuple(entry['skillId'] for entry in character['skills']) == SKILL_IDS
    selection = {}
    for skill_id in SKILL_IDS:
        selection[skill_id] = [
            {field: level[field] for field in ('name', 'skillType', 'durationType', 'spData', 'blackboard')}
            for level in skills[skill_id]['levels']
        ]
    result = {
        'provenance': {'sourceUrl': MIRROR, 'revision': REVISION, 'sources': [character_source, skill_source]},
        'result': {
            'characterId': CHARACTER_ID,
            'characterName': character['name'],
            'characterSkillBindings': character['skills'],
            'skillLevels': selection,
        },
    }
    output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')


def extract_with(script_name, output, **selection):
    script = EXTRACTORS / script_name
    main = runpy.run_path(str(script))['main']
    main.__globals__.update(selection)
    saved = sys.argv
    try:
        sys.argv = [str(script), '--out', str(output)]
        main()
    finally:
        sys.argv = saved


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out-dir', type=Path, default=Path(__file__).parent)
    args = parser.parse_args()
    out = args.out_dir
    out.mkdir(parents=True, exist_ok=True)
    extract_tables(out / 'skill-inputs.json')
    extract_with('extract_aak_fuze_prefabs.py', out / 'prefabs.json', SELECTION={
        'battle/prefabs/[uc]skills.ab': list(SKILL_IDS),
        f'charpack/{CHARACTER_ID}.ab': [CHARACTER_ID],
    })
    extract_with('extract_aak_fuze_prefabs.py', out / 'projectiles.json', SELECTION={
        'battle/prefabs/[uc]projectiles.ab': ['projectile_sqrrel_s1', 'projectile_sqrrel_s2'],
    })
    extract_with('extract_templates.py', out / 'templates.json', KEYS={'knockback[dir]'})


if __name__ == '__main__':
    main()
