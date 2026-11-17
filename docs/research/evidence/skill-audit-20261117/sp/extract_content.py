#!/usr/bin/env python3
"""Bounded installed SP configuration, mana and runtime operation evidence."""
import argparse
import hashlib
import importlib.util
import json
import re
import sys
from pathlib import Path

sys.dont_write_bytecode = True
ROOT = Path.cwd()
TOOL = ROOT / 'docs/research/evidence/targeting-pipeline-20261109/content/extract_content.py'
spec = importlib.util.spec_from_file_location('skill_sp_decoder', TOOL)
helper = importlib.util.module_from_spec(spec)
spec.loader.exec_module(helper)
PREFIXES = ('marcil_', 'swire2_')
ROOTS = ('skchr_marcil_', 'skchr_swire2_')


def walk(value, pointer=''):
    if isinstance(value, dict):
        yield pointer, value
        for key, child in value.items():
            yield from walk(child, pointer + '/' + key.replace('~', '~0').replace('/', '~1'))
    elif isinstance(value, list):
        for index, child in enumerate(value):
            yield from walk(child, pointer + '/' + str(index))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--game', type=Path, default=Path('/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game'))
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    base = args.game / 'Arknights_Data/StreamingAssets/AB/Windows'
    scripts, sources, components, sp_changes = {}, [], [], []
    script_bundle = base / 'anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin'
    sources.append(helper.fingerprint(script_bundle))
    for filename, data in helper.bundle(script_bundle)[0]:
        if filename.endswith(('.resS', '.resource')):
            continue
        for obj in helper.serialized(data)['objects']:
            if obj['classid'] == 115:
                scripts[(filename, int(obj['id']))] = helper.script(obj, data)
    for relative in ['charpack/char_4141_marcil.ab', 'battle/prefabs/[uc]skills.ab']:
        path = base / relative
        sources.append(helper.fingerprint(path))
        for filename, data in helper.bundle(path)[0]:
            if filename.endswith(('.resS', '.resource')):
                continue
            state = helper.serialized(data)
            layouts, externals = helper.helper.trees(data)
            objects = {int(obj['id']): obj for obj in state['objects']}
            gameobjects, transforms = {}, {}
            for obj in state['objects']:
                raw = data[obj['start']:obj['start'] + obj['size']]
                if obj['classid'] == 1:
                    reader = helper.Reader(raw)
                    links = [dict(m_FileID=reader.val('i'), m_PathID=reader.val('q')) for _ in range(reader.val('i'))]
                    layer = reader.val('i')
                    gameobjects[int(obj['id'])] = dict(pathId=str(obj['id']), name=reader.string(), layer=layer, components=links)
                elif obj['classid'] == 4:
                    transforms[int(obj['id'])] = helper.decode(raw, layouts[obj['typeid']])
            by_owner = {v['common:374']['m_PathID']: tid for tid, v in transforms.items()}
            for obj in state['objects']:
                if obj['classid'] != 114:
                    continue
                raw = data[obj['start']:obj['start'] + obj['size']]
                owner = int.from_bytes(raw[4:12], 'little', signed=True)
                ancestry, tid = [], by_owner.get(owner)
                while tid:
                    transform = transforms[tid]
                    ancestry.append(gameobjects[transform['common:374']['m_PathID']])
                    tid = transform['m_Father']['m_PathID']
                ancestry.reverse()
                selected = relative.startswith('charpack/') or bool(ancestry and ancestry[0]['name'].startswith(ROOTS))
                field_names = {node['name'] for node in layouts[obj['typeid']]}
                candidate = bool(field_names & {'_modifySpType', '_spScale'})
                if not selected and not candidate:
                    continue
                value = helper.decode(raw, layouts[obj['typeid']])
                ptr = value['common:490']
                script_file = filename if ptr['m_FileID'] == 0 else externals[ptr['m_FileID'] - 1]['path'].split('/')[-1]
                script = scripts.get((script_file, ptr['m_PathID']))
                fields = {k: v for k, v in value.items() if not k.startswith('common:')}
                row = dict(bundle=relative, file=filename, pathId=str(obj['id']), objectSha256=hashlib.sha256(raw).hexdigest(),
                           ownerPPtr=value['common:374'], ancestry=ancestry, scriptPPtr=ptr, scriptFile=script_file, script=script,
                           enabled=value.get('common:349'), value=fields)
                if selected:
                    components.append(row)
                if candidate:
                    sp_changes.append(row)
    path = base / 'config/buff_template_holder.ab'
    sources.append(helper.fingerprint(path))
    templates, usage, holder_source = [], [], None
    for filename, data in helper.bundle(path)[0]:
        if filename.endswith(('.resS', '.resource')):
            continue
        layouts, _ = helper.helper.trees(data)
        for obj in helper.serialized(data)['objects']:
            if obj['id'] != 6070581171229484677:
                continue
            raw = data[obj['start']:obj['start'] + obj['size']]
            holder_source = dict(file=filename, pathId=str(obj['id']), objectSha256=hashlib.sha256(raw).hexdigest())
            holder = helper.decode(raw, layouts[obj['typeid']])
            for index, template in enumerate(holder['_templates']['Array']):
                events = [{'event': e['key'], 'actions': json.loads(e['value']['SerializedState'])}
                          for e in template['eventToActions']['_items']['Array']]
                if template['templateKey'].startswith(PREFIXES):
                    row = dict(template)
                    row.pop('eventToActions')
                    row.update(templateIndex=index, events=events)
                    templates.append(row)
                for pointer, node in walk(events):
                    if re.search(r'(ModifySpData|ModifySkillSp|CharacterSharedBlackboard)', str(node.get('$type', ''))):
                        usage.append(dict(templateKey=template['templateKey'], templateIndex=index, pointer=pointer, node=node))
            template_count = len(holder['_templates']['Array'])
    result = dict(components=components, installedSkillSpChangeComponents=sp_changes, selectedTemplates=templates,
                  holder=dict(**holder_source, templateCount=template_count), configurationNodeUsage=usage)
    provenance = dict(collectedOn='2026-11-17', scope='Installed selected mana/skill components and complete Holder SP-configuration node index; static bindings, not execution.',
                      script=helper.fingerprint(Path(__file__)), decoder=helper.fingerprint(TOOL), sources=sources,
                      selection=dict(character='char_4141_marcil', skillRoots=list(ROOTS), templatePrefixes=list(PREFIXES),
                                     skillComponentFields=['_modifySpType', '_spScale']))
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(dict(provenance=provenance, result=result), ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(dict(components=len(components), spChangeComponents=len(sp_changes), templates=len(templates), nodeUses=len(usage))))


if __name__ == '__main__':
    main()
