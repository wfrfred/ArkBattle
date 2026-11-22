# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Record SUM module classification, current shop choices, and installed effect bindings."""

import argparse
from bisect import bisect_right
import json
from pathlib import Path
import runpy
import sys

import capstone

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[4]
EVIDENCE = ROOT / 'docs/research/evidence'
sys.path.insert(0, str(ROOT / '.agents/skills/arkbattle-native-research/scripts'))
from native import DEFAULT_GAME, Native, fingerprint
from unity_assets import bundle, script, serialized

REVISION = '0fdfa06570cda97c404a4519da4df984eae56951'
EQUIP = 'battle/prefabs/[uc]equips.ab'
SERIALIZED = 'CAB-7e3af38637f0d056d61e3e709179a7d1'
SCRIPTS = 'anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin'
HOLDER = 'config/buff_template_holder.ab'
SPANS = {
    65678: ((0x180651638, 0x18065166b),),
    66840: ((0x1806f3160, 0x1806f317b),),
    66841: ((0x1806f257f, 0x1806f258d),),
    66869: ((0x1806f13bf, 0x1806f13f8),),
    67086: ((0x18071da93, 0x18071dac6),),
    77177: ((0x180ab1633, 0x180ab166d),),
    77180: ((0x180ab1cd7, 0x180ab1ce5), (0x180ab1d33, 0x180ab1d47)),
    77239: ((0x180a9d4e8, 0x180a9d514), (0x180a9d55b, 0x180a9d5a4)),
    77293: ((0x180aaaba5, 0x180aaabad), (0x180aaad46, 0x180aaad72)),
    79124: ((0x180b115b2, 0x180b115cd),),
    81082: ((0x180bcd3e6, 0x180bcd417), (0x180bcd4ef, 0x180bcd52a), (0x180bcd5ce, 0x180bcd5db)),
    98651: ((0x1810d24be, 0x1810d2501),),
}


def extract_code(native):
    helper = runpy.run_path(str(EVIDENCE / 'stronghold-opening-deploy-20261122/extract.py'))
    disassembler = capstone.Cs(capstone.CS_ARCH_X86, capstone.CS_MODE_64)
    disassembler.detail = True
    methods = {}
    for index, spans in SPANS.items():
        method = native.method(index)
        start = method['address']
        end = native.addresses[bisect_right(native.addresses, start)]
        assert all(start <= lower < upper <= end for lower, upper in spans), method['fullname']
        methods[index] = {'method': method,
                          'instructions': helper['disassembly'](native, disassembler, start, end, spans)}
    return methods


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--game', type=Path, default=DEFAULT_GAME)
    parser.add_argument('--tables', type=Path, required=True)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    table_url = f'https://raw.githubusercontent.com/yuanyan3060/ArknightsGameResource/{REVISION}/gamedata/excel/'
    provenance, tables = {}, {}
    for name in ('activity', 'character', 'uniequip', 'battle_equip'):
        filename = f'{name}_table.json'
        source = args.tables / filename
        provenance[name] = {**fingerprint(source), 'url': table_url + filename, 'revision': REVISION}
        tables[name] = json.loads(source.read_bytes())

    summoners = {key: row['name'] for key, row in tables['character'].items() if row['subProfessionId'] == 'summoner'}
    modules = {}
    for key, row in tables['uniequip']['equipDict'].items():
        if row['typeName1'] != 'SUM' or row['typeName2'] not in ('X', 'Y'):
            continue
        phase = tables['battle_equip'][key]['phases'][0]
        assert phase['equipLevel'] == 1
        trait = next(part for part in phase['parts'] if part['target'] == 'TRAIT')
        modules[key] = {
            'character': row['charId'], 'branch': row['typeName2'], 'resKey': trait['resKey'],
            'trait': trait['overrideTraitDataBundle']['candidates'], 'tokenAttributes': phase['tokenAttributeBlackboard'],
        }

    mode = tables['activity']['activity']['AUTOCHESS']['act3autochess']['V3_1']
    shop = mode['charShopChessDatas'].values()
    character_ids = {field: sorted({row[field] for row in shop if row.get(field)}) for field in ('charId', 'backupCharId')}

    assets = args.game / 'Arknights_Data/StreamingAssets/AB/Windows'
    hot = args.game / 'Arknights_Data/PersistentData/Bundles'
    reader = runpy.run_path(str(EVIDENCE / 'special-redeploy-failure-20261122/extract_prefab.py'))
    scripts = {(file, row['id']): script(row, data) for file, data in bundle(assets / SCRIPTS)[0]
               if not file.endswith(('.resS', '.resource')) for row in serialized(data)['objects']
               if row['classid'] == 115}
    magallan = reader['read_bindings'](hot / EQUIP, SERIALIZED, [
        ('AbilityParallelGroup', 1313723894072194195, ('_abilities',)),
        ('ToggleablePassiveBuffAbility', -3862666386653793133, ('_checker', '_buffs')),
        ('ExistCertainCharacterToggleChecker', 2781181989040338067, ('_chooseMyToken', '_inverse', '_minCnt')),
        ('GlobalAuraAbility', 1571358713574962323, ('_buffs', '_targetValidator')),
    ], scripts)
    ling = reader['read_bindings'](hot / EQUIP, SERIALIZED, [
        ('PassiveBuffAbility', 2953687657027693134, ('_buffs',)),
    ], scripts)
    templates = reader['read_holder'](hot / HOLDER, {'free_summon[card]', 'free_summon[token]', 'trigger_charge_token'})
    native = Native(args.game)
    result = {
        'provenance': {
            'collectedOn': '2026-11-22', 'tableMirror': provenance, 'scriptNames': fingerprint(assets / SCRIPTS),
            'equipPrefab': fingerprint(hot / EQUIP), 'buffHolder': fingerprint(hot / HOLDER),
            'dll': fingerprint(native.pe.path), 'metadata': fingerprint(native.metadata_path),
        },
        'result': {
            'summoners': summoners, 'modules': modules,
            'shop': {
                'source': '/activity/AUTOCHESS/act3autochess/V3_1/charShopChessDatas',
                'totalRows': len(shop), 'characterIds': character_ids,
                'summonerMatches': {key: sorted(summoners.keys() & set(ids)) for key, ids in character_ids.items()},
                'diyChessIds': sorted(mode['diyChessDict']),
            },
            'prefabs': {'magallanX': magallan, 'lingY': ling}, 'templates': templates, 'methods': extract_code(native),
        },
    }
    args.out.write_text(json.dumps(result, indent=2, ensure_ascii=False) + '\n')


if __name__ == '__main__':
    main()
