# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Extract current Stronghold operator selections, entry effects, and static native branches."""

import argparse
from bisect import bisect_right
import json
from pathlib import Path
import runpy
import struct

import capstone


BATCHES = Path(__file__).resolve().parents[1]
ROOT = BATCHES.parents[2]
opening = runpy.run_path(str(BATCHES / 'stronghold-opening-deploy-20261122/extract.py'))
activity = runpy.run_path(str(BATCHES / 'stronghold-opening-current-content-20261122/extract.py'))
prefab = runpy.run_path(str(BATCHES / 'special-redeploy-failure-20261122/extract_prefab.py'))
Native, fingerprint = opening['Native'], opening['fingerprint']

SKILLS = 'battle/prefabs/[uc]skills.ab'
JUDGE = 'charpack/char_4065_judge.ab'
HOLDER = 'config/buff_template_holder.ab'
SELECTED = {'chess_char_2_16_a': 'skchr_utage_2', 'chess_char_2_06_a': 'skchr_gravel_1',
            'chess_char_4_16_a': None}

NATIVE = {
    64019: ((0x18060261E, 0x18060266A),),
    64057: ((0x180601D06, 0x180601D42),),
    66123: ((0x1806D501A, 0x1806D503C),),
    73732: ((0x180990585, 0x1809905A5),),
    73733: ((0x180990B22, 0x180990B45),),
    73734: ((0x18099076C, 0x1809907C9),),
    73735: ((0x180990970, 0x1809909C4),),
    74552: ((0x1809BE18F, 0x1809BE1A9),),
    77332: ((0x180AA3911, 0x180AA394B),),
    77334: ((0x180AA2E30, 0x180AA2E90),),
    77339: ((0x180AA3A23, 0x180AA3AA7),),
    77465: ((0x180A9B66D, 0x180A9B69D), (0x180A9B6EC, 0x180A9B72F)),
    77467: ((0x180A9B818, 0x180A9B860),),
    92986: ((0x180F570E3, 0x180F57140),),
}


def content(game, activity_path, gamedata):
    activity_source = fingerprint(activity_path)
    assert activity_source['sha256'] == activity['ACTIVITY_SHA'], activity_source
    edition = json.loads(activity_path.read_bytes())['activity']['AUTOCHESS']['act3autochess']['V3_1']
    skills = gamedata / 'excel/skill_table.json'
    characters = gamedata / 'excel/character_table.json'
    skill_table, char_table = json.loads(skills.read_bytes()), json.loads(characters.read_bytes())
    configured = {}
    for card, skill_id in SELECTED.items():
        shop, chess = edition['charShopChessDatas'][card], edition['charChessDataDict'][card]
        row = {'shop': shop, 'status': chess['status']}
        data = char_table[shop['charId']]
        if skill_id:
            assert data['skills'][shop['defaultSkillIndex']]['skillId'] == skill_id
            row['skill'] = {'id': skill_id, **skill_table[skill_id]['levels'][chess['status']['skillLevel'] - 1]}
        else:
            row['talentCandidates'] = data['talents'][0]['candidates']
        configured[card] = row

    base = game / 'Arknights_Data/StreamingAssets/AB/Windows'
    hot = game / 'Arknights_Data/PersistentData/Bundles'
    bundle, script, serialized = (prefab[key] for key in ('bundle', 'script', 'serialized'))
    scripts = {(name, row['id']): script(row, data)
               for name, data in bundle(base / prefab['SCRIPTS'])[0]
               if not name.endswith(('.resS', '.resource'))
               for row in serialized(data)['objects'] if row['classid'] == 115}
    skills_components = {}
    for version in (base, hot):
        components = {}
        for name, skill_id, ability_id in (('skchr_utage_2', -7589396649162081342, 2105435139465313218),
                                          ('skchr_gravel_1', 4339346020550054301, -3447525517632663139)):
            value = prefab['read_bindings'](version / SKILLS, 'CAB-e39773c4d1462aefe0ea30134bbccdbb', [
                ('AppearSkill', skill_id, ('_castOnLocate', '_availableValidator', '_switchToState')),
                ('ActiveBuffAbility', ability_id, ('_buffs', '_passiveBuffs', '_preDelay', '_waitForCasting')),
            ], scripts)
            assert value['components']['ActiveBuffAbility']['gameObject']['name'] == name
            assert value['components']['AppearSkill']['gameObject'] == value['components']['ActiveBuffAbility']['gameObject']
            components[name] = value
        skills_components[version.name] = components
    assert skills_components[base.name] == skills_components[hot.name]
    judge = prefab['read_bindings'](base / JUDGE, 'CAB-477c14cc28d6491dc9d13aa70761cadf', [
        ('PassiveBuffAbility', -5237745640822817507, ('_buffs',)),
    ], scripts)
    templates = prefab['read_holder'](hot / HOLDER, {'utage_s_2', 'def_atten', 'judge_t_1'})
    provenance = {'activity': {**activity_source, 'url': activity['ACTIVITY_URL'], 'revision': activity['REVISION']},
                  'ordinaryTables': [fingerprint(path) for path in (skills, characters)],
                  'ordinaryTablesRevision': '17759cc8cdf37388414145d16262a3a06f3ab25e',
                  'bundles': [fingerprint(path) for path in (base / prefab['SCRIPTS'], base / SKILLS,
                                                             hot / SKILLS, base / JUDGE, hot / HOLDER)]}
    return provenance, {'operatorSelections': configured, 'skillComponents': skills_components,
                        'judge': judge, 'holderTemplates': templates}


def native(game):
    native = Native(game)
    dll, metadata = fingerprint(native.pe.path), fingerprint(native.metadata_path)
    assert (dll['sha256'], metadata['sha256']) == (opening['EXPECTED_DLL'], opening['EXPECTED_METADATA'])
    cs = capstone.Cs(capstone.CS_ARCH_X86, capstone.CS_MODE_64)
    cs.detail = True
    methods = {}
    for index, ranges in NATIVE.items():
        method = native.method(index)
        start = method['address']
        end = native.addresses[bisect_right(native.addresses, start)]
        instructions = opening['disassembly'](native, cs, start, end, ranges)
        assert instructions
        methods[index] = {'method': method,'selected': [[hex(lo), hex(hi)] for lo, hi in ranges],
                          'instructions': instructions}
    selected_slots = {'Torappu.Battle.AppearSkill': {54: 73733, 61: 73734, 62: 73735},
                      'Torappu.Battle.Character': {119: 77339},
                      'Torappu.Battle.Abilities.PassiveBuffAbility': {66: 64057}}
    type_evidence = {}
    for name, slots in selected_slots.items():
        type_index = next(i for i, _ in enumerate(native.types) if native.typename(i) == name)
        table = native.table(17)[0] + 4 * native.types[type_index]['vtableStart']
        entry = {'vtable': {}}
        if name == 'Torappu.Battle.AppearSkill':
            entry['castOnLocateField'] = next(f for f in native.fields(type_index)
                                               if not f['static'] and f['name'] == '_castOnLocate')
        for slot, expected in slots.items():
            encoded, = struct.unpack_from('<I', native.metadata, table + 4 * slot)
            actual = (encoded & 0x1fffffff) >> 1
            assert encoded >> 29 == 3 and actual == expected, (name, slot, native.method(actual))
            entry['vtable'][slot] = {'encoded': hex(encoded), 'method': native.method(actual)}
        type_evidence[name] = entry
    return {'dll': dll, 'metadata': metadata}, {'methods': methods, 'types': type_evidence}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--game', type=Path, default=opening['DEFAULT_GAME'])
    parser.add_argument('--activity', type=Path, required=True)
    parser.add_argument('--gamedata', type=Path, default=ROOT / 'assets/arknights-game-data/zh_CN/gamedata')
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    sources, bindings = content(args.game, args.activity, args.gamedata)
    client, implementation = native(args.game)
    result = {'provenance': {'scope': 'Selected ordinary static native branches and actual operator resources. No live execution.',
                             'client': client, 'content': sources,
                             'tool': {'script': fingerprint(Path(__file__)), 'capstone': capstone.__version__}},
              'result': {**implementation, **bindings}}
    args.out.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')


if __name__ == '__main__':
    main()
