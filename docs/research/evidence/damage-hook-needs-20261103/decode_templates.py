#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
"""Decode the six receiving/HP-protection templates used in this study."""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import sys

sys.dont_write_bytecode = True
TOOLS = Path.cwd() / '.agents/skills/arkbattle-native-research/scripts'
sys.path.insert(0, str(TOOLS))
from native import fingerprint
from unity_assets import bundle, serialized

TREE_READER = Path('docs/research/evidence/attack-addon-order-20261102/content/decode_content.py')
KEYS = {'mudrok_t_1[shield_a]', 'mlynar_t_2[inverse]', 'surtr_t_2', 'bena_tr', 'makoto_tr', 'skadi_e_muso'}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--game', type=Path, required=True)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    spec = importlib.util.spec_from_file_location('type_tree_reader', TREE_READER)
    reader = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(reader)
    relative = 'config/buff_template_holder.ab'
    path = args.game / 'Arknights_Data/StreamingAssets/AB/Windows' / relative
    source = fingerprint(path)
    assert source['sha256'] == '8edcb8017c977cdf52c2593b58e21db96949f3ad1e6f904180ac1241f145ca79'
    results = []
    for filename, data in bundle(path)[0]:
        if filename != 'CAB-7983df61b3ae63c96fb4e076fc3d80af':
            continue
        state = serialized(data)
        obj = next(row for row in state['objects'] if row['id'] == 6070581171229484677)
        assert obj['classid'] == 114
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
        assert {entry['templateKey'] for entry in selected} == KEYS
        results.append(dict(bundle=relative, file=filename, pathId=str(obj['id']),
                            sha256=hashlib.sha256(raw).hexdigest(), templates=selected))
    assert len(results) == 1
    record = dict(provenance=dict(collectedOn='2026-11-03', script=fingerprint(Path(__file__)),
                  treeReader=fingerprint(TREE_READER), tools=[fingerprint(TOOLS / name) for name in ['native.py', 'unity_assets.py']],
                  sources=[source], scope='Selected current holder entries only; no claim that every character currently reaches these templates; no runtime/XLua verification.'), result=results)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(record, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(dict(out=str(args.out), templates=len(selected))))


if __name__ == '__main__':
    main()
