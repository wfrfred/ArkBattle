#!/usr/bin/env python3
"""Selected ordinary Skill activation variations from installed resources."""
import argparse
import hashlib
import importlib.util
import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True
ROOT = next(p for p in Path(__file__).resolve().parents
            if (p / '.agents/skills/arkbattle-native-research/scripts/native.py').exists())
DECODER = ROOT / 'docs/research/evidence/targeting-pipeline-20261109/content/extract_content.py'
spec = importlib.util.spec_from_file_location('skill_variation_decoder', DECODER)
helper = importlib.util.module_from_spec(spec)
spec.loader.exec_module(helper)
KEYS = {'char_2012_typhon': 'skchr_typhon_2', 'char_293_thorns': 'skchr_thorns_3',
        'char_4098_vvana': 'skchr_vvana_3', 'char_2024_chyue': 'skchr_chyue_3',
        'char_1013_chen2': 'skchr_chen2_2'}
PREFIXES = ('typhon_', 'thorns_', 'vvana_', 'chyue_', 'chen2_')


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--game', type=Path, default=Path('/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game'))
    p.add_argument('--out', type=Path, default=Path(__file__).with_name('content.json'))
    a = p.parse_args()
    base = a.game / 'Arknights_Data/StreamingAssets/AB/Windows'
    sources, scripts, components = [], {}, []
    script_path = base / 'anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin'
    sources.append(helper.fingerprint(script_path))
    for filename, data in helper.bundle(script_path)[0]:
        if filename.endswith(('.resS', '.resource')):
            continue
        for obj in helper.serialized(data)['objects']:
            if obj['classid'] == 115:
                scripts[(filename, int(obj['id']))] = helper.script(obj, data)
    path = base / 'battle/prefabs/[uc]skills.ab'
    sources.append(helper.fingerprint(path))
    for filename, data in helper.bundle(path)[0]:
        if filename.endswith(('.resS', '.resource')):
            continue
        layouts, externals = helper.helper.trees(data)
        objects = helper.serialized(data)['objects']
        names, transforms = {}, {}
        for obj in objects:
            raw = data[obj['start']:obj['start'] + obj['size']]
            if obj['classid'] == 1:
                r = helper.Reader(raw)
                r.read(r.val('i') * 12)
                r.val('i')
                names[int(obj['id'])] = r.string()
            elif obj['classid'] == 4:
                transforms[int(obj['id'])] = helper.decode(raw, layouts[obj['typeid']])
        by_owner = {v['common:374']['m_PathID']: tid for tid, v in transforms.items()}
        for obj in objects:
            if obj['classid'] != 114:
                continue
            raw = data[obj['start']:obj['start'] + obj['size']]
            owner = int.from_bytes(raw[4:12], 'little', signed=True)
            ancestry, tid = [], by_owner.get(owner)
            while tid:
                tr = transforms[tid]
                ancestry.append(names[tr['common:374']['m_PathID']])
                tid = tr['m_Father']['m_PathID']
            ancestry.reverse()
            if not ancestry or ancestry[0] not in KEYS.values():
                continue
            value = helper.decode(raw, layouts[obj['typeid']])
            pointer = value['common:490']
            sf = filename if pointer['m_FileID'] == 0 else externals[pointer['m_FileID'] - 1]['path'].split('/')[-1]
            components.append(dict(file=filename, pathId=str(obj['id']), hierarchy=ancestry,
                script=scripts[(sf, pointer['m_PathID'])], enabled=value.get('common:349'),
                ownerPPtr=value['common:374'], objectSha256=hashlib.sha256(raw).hexdigest(),
                value={k: v for k, v in value.items() if not k.startswith('common:')}))
    path = base / 'config/buff_template_holder.ab'
    sources.append(helper.fingerprint(path))
    templates = []
    for filename, data in helper.bundle(path)[0]:
        if filename.endswith(('.resS', '.resource')):
            continue
        layouts, _ = helper.helper.trees(data)
        for obj in helper.serialized(data)['objects']:
            if int(obj['id']) != 6070581171229484677:
                continue
            raw = data[obj['start']:obj['start'] + obj['size']]
            holder = helper.decode(raw, layouts[obj['typeid']])
            for index, template in enumerate(holder['_templates']['Array']):
                if not template['templateKey'].startswith(PREFIXES):
                    continue
                events = [{'event': e['key'], 'actions': json.loads(e['value']['SerializedState'])}
                          for e in template['eventToActions']['_items']['Array']]
                row = dict(template)
                row.pop('eventToActions')
                row.update(templateIndex=index, events=events)
                templates.append(row)
    tables = ROOT / '.cache/native-research/route-operations-20261107/data'
    table_sources = [helper.fingerprint(tables / t) for t in ['character_table.json', 'skill_table.json']]
    chars = json.loads((tables / 'character_table.json').read_text())
    skills = json.loads((tables / 'skill_table.json').read_text())
    static = {key: dict(name=chars[key]['name'], skillId=skill,
              binding=[x for x in chars[key]['skills'] if x['skillId'] == skill],
              firstLevel=skills[skill]['levels'][0], maxLevel=skills[skill]['levels'][-1]) for key, skill in KEYS.items()}
    output = dict(provenance=dict(checkedOn='2026-11-17', script=helper.fingerprint(Path(__file__)),
        decoder=helper.fingerprint(DECODER), sources=sources, selection=dict(skills=list(KEYS.values()), templates=list(PREFIXES)),
        mirroredTables=dict(sources=table_sources, repository='Kengxxiao/ArknightsGameData',
          revision='63c7cec73c3858d0ae913f85cc89af3cef4d744f', boundary='Separately versioned mirror; not the installed client.'),
        scope='Selected installed Skill roots and complete matching Holder templates. Static native configuration, no runtime/XLua observation.'),
        result=dict(components=components, templates=templates, static=static))
    a.out.parent.mkdir(parents=True, exist_ok=True)
    a.out.write_text(json.dumps(output,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(dict(components=len(components),templates=len(templates))))


if __name__ == '__main__':
    main()
