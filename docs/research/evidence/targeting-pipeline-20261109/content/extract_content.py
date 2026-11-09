#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
"""Read representative Targeting prefab bindings from installed type trees."""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import struct
import sys

sys.dont_write_bytecode = True
ROOT = Path.cwd()
TOOLS = ROOT / '.agents/skills/arkbattle-native-research/scripts'
sys.path.insert(0, str(TOOLS))
from native import fingerprint
from unity_assets import Reader, bundle, serialized, script

HELPER = ROOT / 'docs/research/evidence/nymph-action-settlement-20261103/projectile/decode_projectile.py'
spec = importlib.util.spec_from_file_location('archived_tree_reader', HELPER)
helper = importlib.util.module_from_spec(spec)
spec.loader.exec_module(helper)

CHARACTERS = ['char_208_melan', 'char_124_kroos', 'char_210_stward',
              'char_117_myrrh', 'char_473_mberry', 'char_121_lava',
              'char_101_sora', 'char_1012_skadi2', 'char_4191_tippi', 'char_325_bison',
              'char_4062_totter', 'char_423_blemsh', 'char_1039_thorn2', 'char_1045_svash2']
SHARED = {
    'battle/enm_pfb_base_0.ab': ['enemy_1003_ncbow', 'enemy_1002_nsabr'],
    'battle/prefabs/[uc]skills.ab': ['skchr_iris_2', 'skchr_kafka_1', 'skchr_shining_3',
                                  'skchr_cgbird_3', 'skchr_sora_1', 'skchr_sora_2',
                                  'skchr_skadi2_2', 'skchr_skadi2_3', 'skchr_bison_2',
                                  'skchr_monstr_1', 'skchr_blemsh_3', 'skchr_tocka_3',
                                  'skchr_horn_1'],
}
FIELDS = {
    '_modes', '_commonAbilities', '_traitAbility', '_attack', '_attackTrigger', '_combat',
    '_generalAbilities', '_selector', '_targetValidator', '_targetOptions', '_selfOption',
    '_abilities', '_ability', '_wrappedAbilities', '_trigger', '_buffs', '_activeBuffs', '_passiveBuffs', '_additiveActiveBuffs',
    '_excludeKey', '_filterBuffSource', '_hostAsTarget', '_targetFamilyMask', '_probKey',
    '_waitForAttackEvent', '_interuptIfTargetDead', '_selectTargetSource', '_selectTargetTiming',
    '_alwaysIncludeTarget', '_allowNoTarget', '_attackType', '_useDynamicAttackType',
    '_ignoreHealFree', '_applyEPHeal', '_applyHealScaleToEPHealScale', '_projectileKey',
    '_keepTarget', '_minTargetNum', '_overrideSearchTargetTick', '_purposeMask',
    '_defaultModeIndex', '_attackBlackboardModeIndex', '_extraAttackBlackboardModeIndices',
    '_rangeIdModeIndex', '_overwriteTalentKey',
}
OPTION_KEYS = ['_ignoreTargetFree', '_ignoreAllyTargetFree', '_ignoreHealFree',
               '_ignoreMotionMode', '_forceIgnoreCamouflage', '_needProfessionMask',
               '_excludeSomeAbnormalFlags', '_excludeOwner', '_sortByTauntAtLast',
               '_ignoreHitRange', '_checkUnitType', '_abilityInputTargetAsSortSource',
               '_targetOptionHookedKeys', '_onlyIgnoreSomeOfTargetFreeCase']

def decode(raw, nodes):
    reader = Reader(raw)
    def walk(index):
        node = nodes[index]
        if node['type'] == 'string':
            value = reader.string()
        elif node['flags'] & 1:
            value = [walk(node['children'][1]) for _ in range(reader.val('i'))]
        elif node['children']:
            value = {nodes[child]['name']: walk(child) for child in node['children']}
        else:
            data = reader.read(node['width'])
            fmt = {'float': '<f', 'double': '<d', 'bool': '<?', 'int': '<i',
                   'unsigned int': '<I', 'SInt64': '<q', 'UInt64': '<Q',
                   'common:222': '<i', 'common:161': '<f', 'common:928': '<B',
                   'common:814': '<q'}.get(node['type'])
            value = struct.unpack(fmt, data)[0] if fmt and struct.calcsize(fmt) == len(data) else dict(type=node['type'], hex=data.hex())
        if node['meta'] & 0x4000:
            reader.align()
        return value
    result = walk(0)
    assert reader.p == len(raw), (reader.p, len(raw))
    return result

def project(value):
    for key in ['_buffs', '_activeBuffs', '_passiveBuffs', '_additiveActiveBuffs']:
        if key in value:
            value[key] = {'Array': [{k: v for k, v in entry.items()
                                    if k in ['buffKey', 'templateKey', 'loadFromDB', 'attributes',
                                             'blackboard', 'lifeTimeType', 'durationKey', 'stripBlackboardParamsWithBuffKey']} if isinstance(entry, dict) else entry
                                   for entry in value[key]['Array']]}
    return value

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--game', type=Path, default=Path('/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game'))
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)
    base = args.game / 'Arknights_Data/StreamingAssets/AB/Windows'
    script_paths = ['anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin',
                    'anon/88b3c3ecaaefa6003de730686dd5ac53.bin']
    scripts = {}
    sources = []
    for relative in script_paths:
        path = base / relative
        if not path.exists():
            continue
        sources.append(fingerprint(path))
        for filename, data in bundle(path)[0]:
            if filename.endswith(('.resS', '.resource')):
                continue
            for obj in serialized(data)['objects']:
                if obj['classid'] == 115:
                    scripts[(filename, obj['id'])] = dict(bundle=relative, value=script(obj, data))
    entries = {f'charpack/{name}.ab': [name] for name in CHARACTERS}
    entries.update(SHARED)
    rows = []
    survey = []
    for relative, wanted in entries.items():
        path = base / relative
        sources.append(fingerprint(path))
        before = len(rows)
        for filename, data in bundle(path)[0]:
            if filename.endswith(('.resS', '.resource')):
                continue
            state = serialized(data)
            layouts, externals = helper.trees(data)
            names, transforms = {}, {}
            for obj in state['objects']:
                raw = data[obj['start']:obj['start'] + obj['size']]
                if obj['classid'] == 1:
                    reader = Reader(raw)
                    reader.read(reader.val('i') * 12)
                    reader.val('i')
                    names[obj['id']] = reader.string()
                elif obj['classid'] == 4:
                    value = decode(raw, layouts[obj['typeid']])
                    transforms[obj['id']] = (value['common:374']['m_PathID'], value['m_Father']['m_PathID'])
            by_owner = {owner: tid for tid, (owner, _) in transforms.items()}
            if relative == 'battle/prefabs/[uc]skills.ab':
                scanned = 0
                trigger_scanned = 0
                witnesses = []
                coverage = {key: [] for key in OPTION_KEYS}
                for obj in state['objects']:
                    if obj['classid'] != 114:
                        continue
                    keys = {node['name'] for node in layouts[obj['typeid']]}
                    selector_component = bool(keys.intersection({'_sortByTauntAtLast', '_selectTargetTiming', '_onlyIgnoreSomeOfTargetFreeCase', '_forceIgnoreCamouflage'}))
                    if not selector_component and '_keepTarget' not in keys:
                        continue
                    raw = data[obj['start']:obj['start'] + obj['size']]
                    value = decode(raw, layouts[obj['typeid']])
                    owner = int.from_bytes(raw[4:12], 'little', signed=True)
                    hierarchy = []
                    tid = by_owner.get(owner)
                    while tid:
                        go, tid = transforms[tid]
                        hierarchy.append(names[go])
                    hierarchy.reverse()
                    for key in OPTION_KEYS:
                        present = value.get(key)
                        if isinstance(present, dict) and 'Array' in present:
                            present = present['Array']
                        if present:
                            coverage[key].append(dict(pathId=str(obj['id']), hierarchy=hierarchy, value=value[key]))
                    reasons = []
                    for key in ['_sortByTauntAtLast', '_onlyIgnoreSomeOfTargetFreeCase', '_forceIgnoreCamouflage']:
                        if value.get(key):
                            reasons.append(key)
                    if value.get('_selectTargetTiming') in [2, 3]:
                        reasons.append('_selectTargetTiming=' + str(value['_selectTargetTiming']))
                    if '_keepTarget' in value:
                        trigger_scanned += 1
                        if value['_keepTarget']:
                            reasons.append('_keepTarget=1')
                        if value['_minTargetNum'] != 1:
                            reasons.append('_minTargetNum=' + str(value['_minTargetNum']))
                        if value['_overrideSearchTargetTick'] != -1:
                            reasons.append('_overrideSearchTargetTick=' + str(value['_overrideSearchTargetTick']))
                    scanned += int(selector_component)
                    if reasons:
                        if hierarchy:
                            if hierarchy[0].startswith('skchr_') and hierarchy[0] not in wanted:
                                wanted.append(hierarchy[0])
                            witnesses.append(dict(pathId=str(obj['id']), hierarchy=hierarchy, reasons=reasons))
                survey.append(dict(bundle=relative, file=filename, candidateComponents=scanned,
                                   triggerComponents=trigger_scanned,
                                   reasonCounts={key: sum(key in row['reasons'] for row in witnesses)
                                                 for key in ['_sortByTauntAtLast', '_onlyIgnoreSomeOfTargetFreeCase', '_forceIgnoreCamouflage', '_selectTargetTiming=2', '_selectTargetTiming=3']},
                                   witnesses=witnesses,
                                   optionCoverage={key: dict(count=len(values), examples=sorted(values, key=lambda row: (not row['hierarchy'][0].startswith('skchr_'), row['hierarchy']))[:3]) for key, values in coverage.items()}))
            for obj in state['objects']:
                if obj['classid'] != 114:
                    continue
                raw = data[obj['start']:obj['start'] + obj['size']]
                owner = int.from_bytes(raw[4:12], 'little', signed=True)
                hierarchy = []
                tid = by_owner.get(owner)
                while tid:
                    go, tid = transforms[tid]
                    hierarchy.append(names[go])
                hierarchy.reverse()
                if not hierarchy or hierarchy[0] not in wanted:
                    continue
                value = decode(raw, layouts[obj['typeid']])
                if not any(k in value for k in FIELDS) and '_postFilter' not in value:
                    continue
                if '_postFilter' in value or '_targetOptions' in value:
                    projected = {k: v for k, v in value.items() if not k.startswith('common:')}
                else:
                    projected = {k: v for k, v in value.items() if k in FIELDS}
                pointer = value['common:490']
                script_file = filename if pointer['m_FileID'] == 0 else externals[pointer['m_FileID'] - 1]['path'].split('/')[-1]
                binding = scripts.get((script_file, pointer['m_PathID']))
                rows.append(dict(bundle=relative, file=filename, pathId=str(obj['id']),
                                 hierarchy=hierarchy, sha256=hashlib.sha256(raw).hexdigest(),
                                 scriptPPtr=pointer, scriptFile=script_file, script=binding,
                                 enabled=value.get('common:349'), value=project(projected)))
        print(relative, len(rows) - before, flush=True)
    result = dict(provenance=dict(collectedOn='2026-11-09', script=fingerprint(Path(__file__)),
                  helper=fingerprint(HELPER), tools=[fingerprint(TOOLS / name) for name in ['native.py', 'unity_assets.py']],
                  sources=sources, selection=dict(characters=CHARACTERS, shared=SHARED),
                  scope='Selected installed prefab components plus nondefault-option witnesses in the shared skills bundle, exact external MonoScript resolution where available; static configuration and references, not runtime execution or active XLua.'), result=rows, survey=survey)
    (args.out / 'selected-prefabs.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(dict(components=len(rows), unresolvedScripts=sum(row['script'] is None for row in rows))))

if __name__ == '__main__':
    main()
