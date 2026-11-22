# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Capture act3autochess Roberta, the installed device, and the native birth path."""

import argparse
from bisect import bisect_right
import json
from pathlib import Path
import runpy
import sys

import capstone

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT / '.agents/skills/arkbattle-native-research/scripts'))
from native import DEFAULT_GAME, Native, fingerprint
from unity_assets import Reader, bundle, script, serialized

EVIDENCE = ROOT / 'docs/research/evidence'
TOKEN = 'pkgrps/btl_pfb_tokens_0.ab'
TOKEN_FILE = 'CAB-f68700761ef4b9b267b0af89309727d6'
SCRIPTS = 'anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin'
HOLDER = 'config/buff_template_holder.ab'
CHARACTER_TABLE = ROOT / 'assets/arknights-game-data/zh_CN/gamedata/excel/character_table.json'
ACTIVITY_SHA = '8869e76acaf1e78d27152ae896bcb837e43d6390a7e61eca6b927fb0901f6dc0'
CLIENT_SHA = ('cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff',
              'e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5')
SPANS = {
    67086: ((0x18071da93, 0x18071dac6),),
    65678: ((0x1806514a3, 0x180651502), (0x1806515eb, 0x180651659)),
    77255: ((0x180aa10be, 0x180aa110a),),
    77334: ((0x180aa2db8, 0x180aa2e30),),
    79022: ((0x180b18988, 0x180b189ba), (0x180b18a0e, 0x180b18aa9),
            (0x180b18b20, 0x180b18bc1)),
    94015: ((0x180f946ed, 0x180f9473e),),
    94018: ((0x180f96a9b, 0x180f96acf),),
}


def transform_ancestry(assets, start):
    data = next(data for name, data in bundle(assets / TOKEN)[0] if name == TOKEN_FILE)
    objects = {row['id']: row for row in serialized(data)['objects']}

    def reader(path_id):
        row = objects[path_id]
        return Reader(data[row['start']:row['start'] + row['size']])

    result = []
    while start:
        assert objects[start]['classid'] == 4
        current = reader(start)
        assert current.val('i') == 0
        game_object = current.val('q')
        current.read(40)
        current.read(12 * current.val('i'))
        assert current.val('i') == 0
        parent = current.val('q')
        owner = reader(game_object)
        components = [(owner.val('i'), owner.val('q')) for _ in range(owner.val('i'))]
        owner.val('i')
        result.append({'transform': str(start), 'gameObject': str(game_object),
                       'name': owner.string(), 'components': [str(id) for file, id in components if file == 0]})
        start = parent
    assert result[-1]['name'] == 'token_10018_robrta_mach'
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--game', type=Path, default=DEFAULT_GAME)
    parser.add_argument('--activity', type=Path, required=True)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    native = Native(args.game)
    client = {name: fingerprint(path) for name, path in
              (('dll', native.pe.path), ('metadata', native.metadata_path))}
    assert tuple(row['sha256'] for row in client.values()) == CLIENT_SHA
    activity = fingerprint(args.activity)
    assert activity['sha256'] == ACTIVITY_SHA
    mode = json.loads(args.activity.read_bytes())['activity']['AUTOCHESS']['act3autochess']['V3_1']
    shop = mode['charShopChessDatas']['chess_char_3_19_a']
    assert shop['charId'] == 'char_484_robrta'
    chars = json.loads(CHARACTER_TABLE.read_bytes())
    token_source = chars[shop['charId']]['talents'][0]['candidates']
    assert {entry['tokenKey'] for entry in token_source} == {'token_10018_robrta_mach'}

    assets = args.game / 'Arknights_Data/StreamingAssets/AB/Windows'
    hot = args.game / 'Arknights_Data/PersistentData/Bundles'
    prefab_reader = runpy.run_path(str(EVIDENCE / 'special-redeploy-failure-20261122/extract_prefab.py'))
    scripts = {(name, row['id']): script(row, data) for name, data in bundle(assets / SCRIPTS)[0]
               if not name.endswith(('.resource', '.resS')) for row in serialized(data)['objects']
               if row['classid'] == 115}
    def prefab(parts):
        return prefab_reader['read_bindings'](assets / TOKEN, TOKEN_FILE, parts, scripts)['components']

    code_reader = runpy.run_path(str(EVIDENCE / 'stronghold-opening-deploy-20261122/extract.py'))
    disassembler = capstone.Cs(capstone.CS_ARCH_X86, capstone.CS_MODE_64)
    disassembler.detail = True
    methods = {}
    for index, spans in SPANS.items():
        method = native.method(index)
        start = method['address']
        end = native.addresses[bisect_right(native.addresses, start)]
        assert all(start <= lo < hi <= end for lo, hi in spans), method['fullname']
        methods[index] = {
            'method': method,
            'instructions': code_reader['disassembly'](native, disassembler, start, end, spans),
        }
    holder = prefab_reader['read_holder'](hot / HOLDER, {'robrta_mach_t', 'robrta_mach_t[mode]'})
    token = prefab([('Token', 1757915464240851100, ('_commonAbilities',))])
    passive = prefab([('PassiveBuffAbility', 5147192285674596508, ('_buffs',))])
    talents = {}
    for tier, component, transform in (
        ('1', 4422298484895836316, -6135359798177175396),
        ('1+', -8855635408115472228, -1828744403578328932),
    ):
        ancestry = transform_ancestry(assets, transform)
        assert str(component) in ancestry[0]['components']
        assert ancestry[0]['name'] == tier
        talents[tier] = {'ancestry': ancestry, 'binding': prefab([
            ('AuraAbility', component, ('_buffs', '_passiveBuffs', '_targetValidator')),
        ])}
    result = {
        'provenance': {'collectedOn': '2026-11-22', 'client': client, 'activity': activity,
                       'characterTable': fingerprint(CHARACTER_TABLE), 'token': fingerprint(assets / TOKEN),
                       'scripts': fingerprint(assets / SCRIPTS), 'hotHolder': fingerprint(hot / HOLDER),
                       'tool': fingerprint(Path(__file__)),
                       'scope': 'Static installed native branch, active-season mirror, installed prefab and holder.'},
        'result': {'activityShop': shop, 'activityStatus': mode['charChessDataDict']['chess_char_3_19_a'],
                   'tokenTalent': token_source, 'token': token, 'passive': passive,
                   'talentAura': talents, 'holder': holder, 'methods': methods},
    }
    args.out.write_text(json.dumps(result, indent=2, ensure_ascii=False) + '\n')


if __name__ == '__main__':
    main()
