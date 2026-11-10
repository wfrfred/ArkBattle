#!/usr/bin/env python3
"""Extract the selected Dysuib passive and its Branch-triggering template."""
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
import argparse
import hashlib
import importlib.util
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[5]
TOOLS = ROOT / '.agents/skills/arkbattle-native-research/scripts'
sys.path.insert(0, str(TOOLS))
from native import fingerprint
from unity_assets import bundle, serialized

HELPER = ROOT / 'docs/research/evidence/attack-addon-order-20261102/content/decode_content.py'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--game', type=Path, default=Path('/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game'))
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)
    spec = importlib.util.spec_from_file_location('case27_reader', HELPER)
    reader = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(reader)
    base = args.game / 'Arknights_Data/StreamingAssets/AB/Windows'
    relative = 'battle/enm_pfb_29.ab'
    sources = [fingerprint(base / relative)]
    prefabs = []
    for filename, data in bundle(base / relative)[0]:
        if filename != 'CAB-ce545482313ddad0252173b3b1f77860':
            continue
        state = serialized(data)
        layouts = reader.trees(data)
        names, transforms = {}, {}
        for obj in state['objects']:
            if obj['classid'] not in (1, 4):
                continue
            value = reader.decode(data[obj['start']:obj['start'] + obj['size']], layouts[obj['typeid']])
            if obj['classid'] == 1:
                names[obj['id']] = value.get('common:427', value.get('m_Name'))
            else:
                transforms[obj['id']] = (value['common:374']['m_PathID'], value['m_Father']['m_PathID'])
        owner_transform = {owner: tid for tid, (owner, _) in transforms.items()}
        obj = next(o for o in state['objects'] if o['id'] == 8102548271911528711)
        raw = data[obj['start']:obj['start'] + obj['size']]
        value = reader.decode(raw, layouts[obj['typeid']])
        tid = owner_transform[value['common:374']['m_PathID']]
        hierarchy = []
        while tid:
            owner, parent = transforms[tid]
            hierarchy.append(dict(name=names[owner], gameObjectPathId=str(owner), transformPathId=str(tid)))
            tid = parent
        assert hierarchy[-1]['name'] == 'enemy_2128_dysuib'
        raw_name = 'dysuib-second-relic-passive.bin'
        (args.out / raw_name).write_bytes(raw)
        prefabs.append(dict(bundle=relative, file=filename, pathId=str(obj['id']), rawFile=raw_name,
                            sha256=hashlib.sha256(raw).hexdigest(), hierarchy=hierarchy, value=value))
    assert len(prefabs) == 1
    relative = 'config/buff_template_holder.ab'
    sources.append(fingerprint(base / relative))
    templates = []
    for filename, data in bundle(base / relative)[0]:
        if filename != 'CAB-7983df61b3ae63c96fb4e076fc3d80af':
            continue
        state = serialized(data)
        obj = next(o for o in state['objects'] if o['id'] == 6070581171229484677)
        raw = data[obj['start']:obj['start'] + obj['size']]
        value = reader.decode(raw, reader.trees(data)[obj['typeid']])
        for index, entry in enumerate(value['_templates']['Array']):
            if not entry['templateKey'].startswith('enemy_dysuib_second_relic_t'):
                continue
            entry = dict(entry)
            entry['templateIndex'] = index
            entry['events'] = [dict(event=e['key'], actions=json.loads(e['value']['SerializedState']))
                               for e in entry.pop('eventToActions')['_items']['Array']]
            templates.append(dict(bundle=relative, file=filename, pathId=str(obj['id']),
                                  holderSha256=hashlib.sha256(raw).hexdigest(), value=entry))
    assert templates
    provenance = dict(scope='Selected actual prefab passive hierarchy and matching template nodes; no game execution.',
                      script=fingerprint(Path(__file__)), helper=fingerprint(HELPER), sources=sources,
                      tools=[fingerprint(TOOLS / x) for x in ['unity_assets.py', 'native.py']])
    (args.out / 'content.json').write_text(json.dumps(dict(provenance=provenance, result=dict(prefabs=prefabs, templates=templates)), ensure_ascii=False, indent=2)+'\n')
    print(json.dumps(dict(prefabs=len(prefabs), templates=len(templates))))


if __name__ == '__main__':
    main()
