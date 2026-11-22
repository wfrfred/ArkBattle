"""Join the pinned current-season activity selection to installed battle templates."""

import argparse
import json
from pathlib import Path
import runpy
import sys

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT / '.agents/skills/arkbattle-native-research/scripts'))
from native import DEFAULT_GAME, fingerprint

REVISION = '0fdfa06570cda97c404a4519da4df984eae56951'
ACTIVITY_URL = f'https://raw.githubusercontent.com/yuanyan3060/ArknightsGameResource/{REVISION}/gamedata/excel/activity_table.json'
ACTIVITY_SHA = '8869e76acaf1e78d27152ae896bcb837e43d6390a7e61eca6b927fb0901f6dc0'
READER = ROOT / 'docs/research/evidence/special-redeploy-failure-20261122/extract_prefab.py'
MODES = '/activity/AUTOCHESS/act3autochess/V3_1'
TEMPLATE = 'act3autochess_bond_eff_kazimierz'


def activity_selections(path):
    document = json.loads(path.read_bytes())
    edition = document['activity']['AUTOCHESS']['act3autochess']['V3_1']
    bond = edition['bondInfoDict']['kazimierzShip']
    assert bond['effectId'] == 'bondeffect_kazimierz_2'
    players = edition['charShopChessDatas']
    assert players['chess_char_2_06_a']['charId'] == 'char_237_gravel'
    assert players['chess_char_6_05_a']['charId'] == 'char_1014_nearl2'
    return {
        '/basicInfo/act3autochess': {
            key: document['basicInfo']['act3autochess'][key]
            for key in ('name', 'startTime', 'endTime')
        },
        f'{MODES}/bondInfoDict/kazimierzShip': bond,
        f'{MODES}/effectBuffInfoDataDict/bondeffect_kazimierz_2':
            edition['effectBuffInfoDataDict']['bondeffect_kazimierz_2'],
        f'{MODES}/charShopChessDatas/chess_char_2_06_a': players['chess_char_2_06_a'],
        f'{MODES}/charShopChessDatas/chess_char_6_05_a': players['chess_char_6_05_a'],
        f'{MODES}/charChessDataDict/chess_char_6_05_a':
            edition['charChessDataDict']['chess_char_6_05_a'],
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--activity', type=Path, required=True)
    parser.add_argument('--game', type=Path, default=DEFAULT_GAME)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    activity = fingerprint(args.activity)
    assert activity['sha256'] == ACTIVITY_SHA, activity
    holder = args.game / 'Arknights_Data/PersistentData/Bundles/config/buff_template_holder.ab'
    programs = runpy.run_path(str(READER))['read_holder'](holder, {TEMPLATE})
    record = {
        'provenance': {
            'collectedOn': '2026-11-22',
            'scope': 'Selected activity mirror rows and the pact template from the installed hot Holder.',
            'activity': {**activity, 'url': ACTIVITY_URL, 'revision': REVISION},
            'holder': fingerprint(holder),
            'reader': fingerprint(READER),
        },
        'result': {'activitySelections': activity_selections(args.activity), 'holderTemplates': programs},
    }
    args.out.write_text(json.dumps(record, indent=2, ensure_ascii=False) + '\n')


if __name__ == '__main__':
    main()
