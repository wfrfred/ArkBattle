# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Extract the instructor module's tile allowance and Stronghold's placement checks."""

import argparse
from bisect import bisect_right
import json
from pathlib import Path
import runpy

import capstone

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[3]
native_tools = runpy.run_path(str(HERE.parent / 'stronghold-opening-deploy-20261122/extract.py'))
asset_tools = runpy.run_path(str(HERE.parent / 'special-redeploy-failure-20261122/extract_prefab.py'))

EQUIP_BUNDLE = 'battle/prefabs/[uc]equips.ab'
BASE = 'Arknights_Data/StreamingAssets/AB/Windows'
CACHE = 'Arknights_Data/PersistentData/Bundles'
MODULES = {
    'uniequip_002_doberm': ('doberm_equip_1_1_p1', 16068369839955105),
    'uniequip_002_rdoc': ('rdoc_equip_1_1_p1', 7428639274659931721),
}
FIELDS = {
    'Torappu.Battle.Deck/Card': {'m_originBuildableCondition', 'm_additionalBuildCondition'},
    'Torappu.Battle.BuildCondition': {'buildableType', 'checkManuallyBuildableType', 'manuallyBuildableType'},
    'Torappu.Battle.AdditionalBuildCondition': {'buildableType'},
    'Torappu.Battle.Deck/Card/MiscSettingModifier': {'m_additionalBuildCondition', '_additionalBuildCondition'},
    'Torappu.BuildableType': {'MELEE', 'RANGED', 'ALL'},
}
SELECTION = {
    65789: ((0x180666ca5, 0x180666cba),),
    66741: ((0x1806fb586, 0x1806fb595),),
    66755: ((0x1806fd276, 0x1806fd299),),
    66768: ((0x1806fe86a, 0x1806fe893), (0x1806fe903, 0x1806fe922)),
    66859: ((0x1806ea67f, 0x1806ea6b5), (0x1806ea8ef, 0x1806ea915)),
    66845: ((0x1806f4031, 0x1806f404d),),
    66869: ((0x1806f13c6, 0x1806f13fd),),
    66911: ((0x1806eb65b, 0x1806eb682), (0x1806eb6d1, 0x1806eb6f8)),
    67028: ((0x180711810, 0x18071183f),),
    74640: ((0x1809c4385, 0x1809c43a3),),
    74641: ((0x1809c4325, 0x1809c4344),),
    74643: ((0x1809c3f85, 0x1809c3faf),),
    74644: ((0x1809c40bf, 0x1809c40fc), (0x1809c4131, 0x1809c4182)),
    79496: ((0x180b2f025, 0x180b2f04e),),
    79504: ((0x180b2ead8, 0x180b2eb03), (0x180b2eb9e, 0x180b2ebb7)),
    80930: ((0x180bb379a, 0x180bb37ae),),
    82885: ((0x180c63af6, 0x180c63b1d), (0x180c63bd6, 0x180c63c08)),
}


def native_checks(game):
    native = native_tools['Native'](game)
    dll = native_tools['fingerprint'](native.pe.path)
    metadata = native_tools['fingerprint'](native.metadata_path)
    assert (dll['sha256'], metadata['sha256']) == (
        native_tools['EXPECTED_DLL'], native_tools['EXPECTED_METADATA'])
    engine = capstone.Cs(capstone.CS_ARCH_X86, capstone.CS_MODE_64)
    engine.detail = True
    methods = {}
    for index, ranges in SELECTION.items():
        method = native.method(index)
        start = method['address']
        end = native.addresses[bisect_right(native.addresses, start)]
        assert all(start <= low < high <= end for low, high in ranges), method['fullname']
        instructions = native_tools['disassembly'](native, engine, start, end, ranges)
        methods[index] = {'method': method, 'boundaryEnd': hex(end),
                          'selected': [[hex(low), hex(high)] for low, high in ranges],
                          'instructions': instructions}
    fields = {name: [field for field in native.fields(i) if field['name'] in FIELDS[name]]
              for i, _ in enumerate(native.types) if (name := native.typename(i)) in FIELDS}
    return {'dll': dll, 'metadata': metadata}, {'methods': methods, 'fields': fields}


def module_configs(game, tables):
    fingerprint = native_tools['fingerprint']
    bundle = asset_tools['bundle']
    serialized = asset_tools['serialized']
    script = asset_tools['script']
    base = game / BASE
    scripts_path = base / asset_tools['SCRIPTS']
    scripts = {(name, row['id']): script(row, data) for name, data in bundle(scripts_path)[0]
               if not name.endswith(('.resS', '.resource')) for row in serialized(data)['objects']
               if row['classid'] == 115}
    table_paths = {name: tables / f'{name}.json' for name in (
        'battle_equip_table', 'uniequip_table', 'character_table')}
    data = {name: json.loads(path.read_text()) for name, path in table_paths.items()}
    bundles = {'base': base / EQUIP_BUNDLE, 'cached': game / CACHE / EQUIP_BUNDLE}
    modules = {}
    for module, (prefab, path_id) in MODULES.items():
        equipped = data['uniequip_table']['equipDict'][module]
        operator = data['character_table'][equipped['charId']]
        phases = []
        for phase in data['battle_equip_table'][module]['phases']:
            for part in phase['parts']:
                candidates = part['addOrOverrideTalentDataBundle']['candidates'] or []
                for talent in candidates:
                    if any(entry['key'] == 'buildable_type' for entry in talent['blackboard']):
                        phases.append({'level': phase['equipLevel'], 'resKey': part['resKey'],
                                       'validInGameTag': part['validInGameTag'],
                                       'validInMapTag': part['validInMapTag'], 'talent': talent})
        assert equipped['typeIcon'] == 'ins-y' and operator['position'] == 'MELEE' and len(phases) == 3
        variants = {}
        for kind, path in bundles.items():
            file = next(name for name, content in bundle(path)[0]
                        if not name.endswith(('.resS', '.resource')) and
                        any(row['id'] == path_id for row in serialized(content)['objects']))
            selected = [('DeckMiscTalent', path_id, (
                '_overwriteTalentKey', '_options', '_additionBuildableType', '_additionMask'))]
            binding = asset_tools['read_bindings'](path, file, selected, scripts)
            component = binding['components']['DeckMiscTalent']
            assert component['gameObject']['name'] == prefab
            variants[kind] = {'serializedFile': file, 'component': component}
        modules[module] = {'charId': equipped['charId'], 'name': operator['name'],
                           'basePosition': operator['position'], 'typeIcon': equipped['typeIcon'],
                           'phases': phases, 'bindings': variants}
    sources = [fingerprint(path) for path in [scripts_path, *bundles.values(), *table_paths.values()]]
    return sources, modules


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--game', type=Path, default=native_tools['DEFAULT_GAME'])
    parser.add_argument('--tables', type=Path,
                        default=ROOT / 'assets/arknights-game-data/zh_CN/gamedata/excel')
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    client, native = native_checks(args.game)
    sources, modules = module_configs(args.game, args.tables)
    provenance = {'scope': 'Installed Windows native branches, two module configurations, no gameplay replay.',
                  'client': client, 'assets': sources,
                  'gameDataRevision': '17759cc8cdf37388414145d16262a3a06f3ab25e',
                  'tool': {'script': native_tools['fingerprint'](Path(__file__)),
                           'capstone': capstone.__version__}}
    args.out.write_text(json.dumps({'provenance': provenance, 'result': {**native, 'modules': modules}},
                                   ensure_ascii=False, indent=2) + '\n')


if __name__ == '__main__':
    main()
