#!/usr/bin/env python3
"""Select category-sensitive Buff template programs from the installed holder."""
import hashlib
import argparse
import importlib.util
import json
from pathlib import Path
import sys

ROOT = Path.cwd()
sys.dont_write_bytecode = True
sys.path.insert(0, str(ROOT / '.agents/skills/arkbattle-native-research/scripts'))
from native import DEFAULT_GAME, fingerprint
from unity_assets import bundle, serialized

HELPER = ROOT / 'docs/research/evidence/attack-addon-order-20261102/content/decode_content.py'
spec = importlib.util.spec_from_file_location('classification_template_reader', HELPER)
helper = importlib.util.module_from_spec(spec)
spec.loader.exec_module(helper)
SOURCE = DEFAULT_GAME / 'Arknights_Data/StreamingAssets/AB/Windows/config/buff_template_holder.ab'
OUT = ROOT / 'docs/research/evidence/unit-classification-20261114/config/templates.json'
KEYS = {'milu_t_1', 'filtertag[reduce_damage]', 'siege2_e_003_t_2',
        'act1vautochess_time_out_bleeding', 'act1vautochess_band10_buff'}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out', type=Path, default=OUT)
    args = parser.parse_args()
    assert fingerprint(SOURCE)['sha256'] == '8edcb8017c977cdf52c2593b58e21db96949f3ad1e6f904180ac1241f145ca79'
    results = []
    for filename, data in bundle(SOURCE)[0]:
        if filename.endswith(('.resS', '.resource')):
            continue
        for obj in serialized(data)['objects']:
            if obj['id'] != 6070581171229484677:
                continue
            raw = data[obj['start']:obj['start'] + obj['size']]
            value = helper.decode(raw, helper.trees(data)[obj['typeid']])
            selected = []
            for index, template in enumerate(value['_templates']['Array']):
                if template['templateKey'] not in KEYS:
                    continue
                entry = dict(template, templateIndex=index)
                entry['events'] = [{'event': event['key'], 'actions': json.loads(event['value']['SerializedState'])}
                                   for event in template['eventToActions']['_items']['Array']]
                selected.append(entry)
            assert {entry['templateKey'] for entry in selected} == KEYS
            results.append(dict(bundle='config/buff_template_holder.ab', file=filename,
                                pathId=str(obj['id']), objectSha256=hashlib.sha256(raw).hexdigest(), templates=selected))
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(dict(provenance=dict(collectedOn='2026-11-14', script=fingerprint(Path(__file__)),
                   helper=fingerprint(HELPER), source=fingerprint(SOURCE),
                   scope='Selected installed Buff template programs; concrete character/talent/module binding recorded separately. Autochess templates retained as candidates, not proof of activation.'),
                   result=results), ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(dict(out=str(args.out), templates=sum(len(row['templates']) for row in results))))


if __name__ == '__main__':
    main()
