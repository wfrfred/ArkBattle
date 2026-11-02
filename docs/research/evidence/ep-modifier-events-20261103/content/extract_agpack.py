#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
"""Extract the current Floating Letter HP/EP common-event witness."""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import sys

sys.dont_write_bytecode = True
ROOT = Path.cwd()
TOOLS = ROOT / '.agents/skills/arkbattle-native-research/scripts'
sys.path.insert(0, str(TOOLS))
from native import fingerprint
from unity_assets import bundle, serialized

HELPER = ROOT / 'docs/research/evidence/attack-addon-order-20261102/content/decode_content.py'
EXPECTED = {
    'config/buff_template_holder.ab': '8edcb8017c977cdf52c2593b58e21db96949f3ad1e6f904180ac1241f145ca79',
    'battle/enm_pfb_34.ab': 'f6bae238962bc330c6cc72734f788fe09be81dd6eae8eda1305312495899bafb',
}
KEYS = {'agpack_t[record_damage_cnt]', 'agpack_a[passive]'}


def write_json(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--game', type=Path, default=Path('/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game'))
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    base = args.game / 'Arknights_Data/StreamingAssets/AB/Windows'
    sources = {}
    for relative, expected in EXPECTED.items():
        source = fingerprint(base / relative)
        if source['sha256'] != expected:
            raise ValueError(f'{relative} differs from this witness input: {source["sha256"]}')
        sources[relative] = source
    args.out.mkdir(parents=True, exist_ok=True)
    spec = importlib.util.spec_from_file_location('case27_type_tree_reader', HELPER)
    reader = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(reader)
    provenance = dict(
        collectedOn='2026-11-03', script=fingerprint(Path(__file__)),
        helper=fingerprint(HELPER),
        tools=[fingerprint(TOOLS / name) for name in ['native.py', 'unity_assets.py']],
        sources=list(sources.values()),
        scope='Exact Floating Letter holder entries and prefab passive binding; no runtime/XLua verification.',
    )

    relative = 'config/buff_template_holder.ab'
    templates = []
    for filename, data in bundle(base / relative)[0]:
        if filename != 'CAB-7983df61b3ae63c96fb4e076fc3d80af':
            continue
        state = serialized(data)
        obj = next(row for row in state['objects'] if row['id'] == 6070581171229484677)
        if obj['classid'] != 114:
            raise ValueError('holder object is no longer a MonoBehaviour')
        raw = data[obj['start']:obj['start'] + obj['size']]
        value = reader.decode(raw, reader.trees(data)[obj['typeid']])
        selected = []
        for index, template in enumerate(value['_templates']['Array']):
            if template['templateKey'] not in KEYS:
                continue
            entry = dict(template)
            entry['templateIndex'] = index
            entry['events'] = [dict(event=event['key'], actions=json.loads(event['value']['SerializedState']))
                               for event in entry.pop('eventToActions')['_items']['Array']]
            selected.append(entry)
        if {entry['templateKey'] for entry in selected} != KEYS:
            raise ValueError('selected Floating Letter templates are missing')
        templates.append(dict(bundle=relative, file=filename, pathId=str(obj['id']),
                              sha256=hashlib.sha256(raw).hexdigest(), templates=selected))
    if len(templates) != 1:
        raise ValueError('holder SerializedFile was not uniquely located')
    write_json(args.out / 'agpack-templates.json', dict(provenance=provenance, result=templates))

    relative = 'battle/enm_pfb_34.ab'
    prefabs = []
    for filename, data in bundle(base / relative)[0]:
        if filename != 'CAB-aa22395bb3f0e1a2e0e3e1bbfb74af3b':
            continue
        state = serialized(data)
        layouts = reader.trees(data)
        objects = {row['id']: row for row in state['objects']}
        names, transforms = {}, {}
        for obj in state['objects']:
            if obj['classid'] not in (1, 4):
                continue
            raw = data[obj['start']:obj['start'] + obj['size']]
            value = reader.decode(raw, layouts[obj['typeid']])
            if obj['classid'] == 1:
                names[obj['id']] = value.get('common:427', value.get('m_Name'))
            else:
                transforms[obj['id']] = (value['common:374']['m_PathID'], value['m_Father']['m_PathID'])
        transform_by_owner = {owner: tid for tid, (owner, _) in transforms.items()}
        obj = objects[-4786395766426076502]
        if obj['classid'] != 114:
            raise ValueError('selected passive is no longer a MonoBehaviour')
        raw = data[obj['start']:obj['start'] + obj['size']]
        value = reader.decode(raw, layouts[obj['typeid']])
        tid = transform_by_owner[value['common:374']['m_PathID']]
        hierarchy = []
        while tid:
            owner, parent = transforms[tid]
            hierarchy.append(dict(name=names[owner], gameObjectPathId=str(owner), transformPathId=str(tid)))
            tid = parent
        if hierarchy[-1]['name'] != 'enemy_10231_agpack':
            raise ValueError('passive owner hierarchy no longer reaches Floating Letter')
        if value['_buffs']['Array'][0]['templateKey'] != 'agpack_t[record_damage_cnt]':
            raise ValueError('selected passive no longer binds the recording template')
        raw_name = f'agpack-passive-{obj["id"]}.bin'
        (args.out / raw_name).write_bytes(raw)
        prefabs.append(dict(bundle=relative, source=sources[relative], file=filename, pathId=str(obj['id']),
                            sha256=hashlib.sha256(raw).hexdigest(), rawFile=raw_name, hierarchy=hierarchy, value=value))
    if len(prefabs) != 1:
        raise ValueError('prefab SerializedFile was not uniquely located')
    write_json(args.out / 'agpack-prefab.json', dict(provenance=provenance, result=prefabs))
    print(json.dumps(dict(out=str(args.out), templates=len(KEYS), passiveObjects=len(prefabs))))


if __name__ == '__main__':
    main()
