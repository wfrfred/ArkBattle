#!/usr/bin/env python3
"""Re-extract only Caleido bindings and project the installed ANGER programs."""
import argparse
import importlib.util
import json
import sys
from pathlib import Path

ROOT = Path.cwd()
sys.dont_write_bytecode = True
sys.path.insert(0, str(ROOT / '.agents/skills/arkbattle-native-research/scripts'))
from native import fingerprint

HELPER = ROOT / 'docs/research/evidence/resource-mechanisms-20261114/recovery-elemental/extract_content.py'
SELECTION = {
    'charpack/char_4169_caledo.ab': ['char_4169_caledo'],
    'battle/prefabs/[uc]skills.ab': ['skchr_caledo_'],
}
BUFF_TABLE = ROOT / '.cache/native-research/elemental-zero-20261105/templates/buff_table.json'
CHARACTER_TABLE = ROOT / '.cache/native-research/route-operations-20261107/data/character_table.json'
SKILL_TABLE = ROOT / '.cache/native-research/route-operations-20261107/data/skill_table.json'
REVISION = '63c7cec73c3858d0ae913f85cc89af3cef4d744f'


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--out', type=Path, required=True)
    p.add_argument('--raw-out', type=Path, required=True)
    a = p.parse_args()
    spec = importlib.util.spec_from_file_location('anger_content', HELPER)
    helper = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(helper)
    helper.SELECTION = SELECTION
    sys.argv = [str(HELPER), '--out', str(a.raw_out)]
    helper.main()
    content = json.loads((a.raw_out / 'content.json').read_text())
    templates = json.loads((a.raw_out / 'templates.json').read_text())
    buff_db = json.loads(BUFF_TABLE.read_text())
    characters = json.loads(CHARACTER_TABLE.read_text())
    skills = json.loads(SKILL_TABLE.read_text())
    chosen = [x for x in templates['result']['templates']
              if x['templateKey'].startswith(('ep_break_anger', 'caledo'))]
    payload = {
        'provenance': content['provenance'] | {
            'collectedOn': '2026-11-16',
            'projectionTool': fingerprint(Path(__file__)),
            'rawContent': fingerprint(a.raw_out / 'content.json'),
            'rawTemplates': fingerprint(a.raw_out / 'templates.json'),
            'characterMirror': fingerprint(CHARACTER_TABLE),
            'skillMirror': fingerprint(SKILL_TABLE),
            'configurationRevision': REVISION,
            'configurationSource': 'https://github.com/Kengxxiao/ArknightsGameData/tree/' + REVISION + '/zh_CN/gamedata/excel',
            'characterPointer': '/char_4169_caledo',
            'skillPointers': ['/skchr_caledo_1', '/skchr_caledo_2'],
            'projection': 'All components under the two selected roots; ANGER and caledo-prefixed programs; three complete ANGER BuffDB entries. Native facts remain separately versioned from mirror JSON.',
        },
        'result': {
            'selection': SELECTION,
            'components': content['result']['components'],
            'templates': chosen,
            'buffDb': {key: buff_db[key] for key in
                       ('ep_break_anger', 'ep_break_anger_char', 'ep_break_anger_enemy')},
            'character': characters['char_4169_caledo'],
            'skills': {key: skills[key] for key in ('skchr_caledo_1', 'skchr_caledo_2')},
        },
    }
    a.out.parent.mkdir(parents=True, exist_ok=True)
    a.out.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'components': len(payload['result']['components']),
                      'templates': [x['templateKey'] for x in chosen], 'out': str(a.out)}))


if __name__ == '__main__':
    main()
