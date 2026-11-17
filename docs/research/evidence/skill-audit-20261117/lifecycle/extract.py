#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
"""Extract selected real trigger/sustain configurations and reused native evidence."""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import sys

sys.dont_write_bytecode = True
ROOT = Path.cwd()
READER = ROOT / 'docs/research/evidence/targeting-pipeline-20261109/content/extract_content.py'
spec = importlib.util.spec_from_file_location('archived_tree_decoder', READER)
r = importlib.util.module_from_spec(spec)
spec.loader.exec_module(r)
SKILLS = ['skchr_lessng_2', 'skchr_lessng_3', 'skchr_frncat_1', 'skchr_mudrok_2']
CHARACTERS = ['char_4011_lessng', 'char_185_frncat', 'char_311_mudrok']


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--game', type=Path, default=Path('/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game'))
    ap.add_argument('--characters', type=Path, default=ROOT / '.cache/native-research/route-operations-20261107/data/character_table.json')
    ap.add_argument('--skills', type=Path, default=ROOT / '.cache/native-research/route-operations-20261107/data/skill_table.json')
    ap.add_argument('--out', type=Path, required=True)
    args = ap.parse_args()
    base = args.game / 'Arknights_Data/StreamingAssets/AB/Windows'
    scripts_bundle = base / 'anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin'
    ability_bundle = base / 'battle/prefabs/[uc]skills.ab'
    scripts = {}
    for filename, data in r.bundle(scripts_bundle)[0]:
        if filename.endswith(('.resS', '.resource')):
            continue
        for obj in r.serialized(data)['objects']:
            if obj['classid'] == 115:
                scripts[(filename, int(obj['id']))] = r.script(obj, data)
    components = []
    for filename, data in r.bundle(ability_bundle)[0]:
        if filename.endswith(('.resS', '.resource')):
            continue
        st = r.serialized(data)
        layouts, externals = r.helper.trees(data)
        gameobjects, transforms = {}, {}
        for obj in st['objects']:
            raw = data[obj['start']:obj['start'] + obj['size']]
            if obj['classid'] == 1:
                rd = r.Reader(raw)
                pointers = [dict(m_FileID=rd.val('i'), m_PathID=rd.val('q')) for _ in range(rd.val('i'))]
                rd.val('i')
                gameobjects[int(obj['id'])] = dict(name=rd.string(), components=pointers)
            elif obj['classid'] == 4:
                value = r.decode(raw, layouts[obj['typeid']])
                transforms[int(obj['id'])] = value
        by_owner = {v['common:374']['m_PathID']: tid for tid, v in transforms.items()}
        for obj in st['objects']:
            if obj['classid'] != 114:
                continue
            raw = data[obj['start']:obj['start'] + obj['size']]
            owner = int.from_bytes(raw[4:12], 'little', signed=True)
            ancestry = []
            tid = by_owner.get(owner)
            while tid:
                v = transforms[tid]
                go = v['common:374']['m_PathID']
                ancestry.append(dict(gameObjectPathId=str(go), **gameobjects[go]))
                tid = v['m_Father']['m_PathID']
            ancestry.reverse()
            if not ancestry or ancestry[0]['name'] not in SKILLS or len(ancestry) != 1:
                continue
            value = r.decode(raw, layouts[obj['typeid']])
            if not any(k in value for k in ['_canUseInAbnormalState', '_waitForAttackEvent']):
                continue
            pointer = value['common:490']
            sf = filename if pointer['m_FileID'] == 0 else externals[pointer['m_FileID'] - 1]['path'].split('/')[-1]
            components.append(dict(file=filename, pathId=str(obj['id']), ownerPPtr=value['common:374'], ancestry=ancestry,
                                   scriptPPtr=pointer, scriptFile=sf, script=scripts[(sf, pointer['m_PathID'])],
                                   objectSha256=hashlib.sha256(raw).hexdigest(), enabled=value.get('common:349'),
                                   value={k: v for k, v in value.items() if not k.startswith('common:')}))
    characters = json.loads(args.characters.read_text())
    skills = json.loads(args.skills.read_text())
    native_path = ROOT / 'docs/research/evidence/unit-audit-20261110/control-terrain/native.json'
    native = json.loads(native_path.read_text())
    getter = next(m for m in native['result']['methods'] if m['method']['fullname'] == 'Torappu.Battle.BasicSkill.get_ownerCanUseInAbnormalState')
    result = dict(
        characterBindings={key: dict(name=characters[key]['name'], skills=characters[key]['skills']) for key in CHARACTERS},
        skillData={key: dict(skillId=key, levels=[dict(level=i+1, name=v['name'], skillType=v['skillType'], durationType=v['durationType'],
                                                    duration=v['duration'], spData=v['spData'], blackboard=v['blackboard'])
                                               for i, v in enumerate(skills[key]['levels']) if i in [0, len(skills[key]['levels'])-1]]) for key in SKILLS},
        components=components,
        reusedOwnerQualification=getter,
    )
    out = dict(provenance=dict(collectedOn='2026-11-17', script=r.fingerprint(Path(__file__)), decoder=r.fingerprint(READER),
                              treeReader=r.fingerprint(r.HELPER), installedSources=[r.fingerprint(p) for p in [scripts_bundle, ability_bundle]],
                              mirror=dict(repository='Kengxxiao/ArknightsGameData', revision='63c7cec73c3858d0ae913f85cc89af3cef4d744f',
                                          inputs=[r.fingerprint(args.characters), r.fingerprint(args.skills)]),
                              reusedNative=dict(input=r.fingerprint(native_path), provenance=native['provenance'],
                                                pointer='/result/methods:fullname=Torappu.Battle.BasicSkill.get_ownerCanUseInAbnormalState'),
                              scope='Exactly four skill roots, same-GameObject Skill/Ability pairs and fixed mirror bindings. Current installed configuration and independently versioned mirror. Reused native getter, no live execution or XLua observation.'), result=result)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(out, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(dict(output=str(args.out), components=len(components), roots=SKILLS)))


if __name__ == '__main__':
    main()
