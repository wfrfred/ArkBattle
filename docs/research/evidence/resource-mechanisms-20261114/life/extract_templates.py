#!/usr/bin/env python3
"""Select life programs and inventory life nodes in the installed Buff holder."""
import argparse
import hashlib
import importlib.util
import json
import re
import sys
from pathlib import Path

sys.dont_write_bytecode = True
ROOT = Path.cwd()
sys.path.insert(0, str(ROOT / '.agents/skills/arkbattle-native-research/scripts'))
from native import DEFAULT_GAME, fingerprint
from unity_assets import bundle, serialized
HELPER = ROOT / 'docs/research/evidence/attack-addon-order-20261102/content/decode_content.py'
spec = importlib.util.spec_from_file_location('life_template_reader', HELPER)
helper = importlib.util.module_from_spec(spec)
spec.loader.exec_module(helper)
PREFIXES = ('huang_t_1', 'surtr_t_2', 'skadi_e_muso', 'horn_t_1', 'bena_', 'mortis_',
            'makoto_', 'hsgma2_t_1', 'enemy_sfsui_', 'enemy_msfsui_', 'rmixer_sk2', 'enemy_duskls_', 'enemy_spnwiz_',
            'crab_', 'vigil_wolf_t_1', 'mlyss_wtrman_t_1', 'phatm2_')
NODE_PATTERN = re.compile(r'TrySetHp|SetHp|MinusHp|SetEs|Reborn|Undead|HpNoLess', re.I)


def walk(value, path=''):
    if isinstance(value, dict):
        yield path, value
        for key, child in value.items():
            yield from walk(child, path + '/' + key)
    elif isinstance(value, list):
        for index, child in enumerate(value):
            yield from walk(child, path + '/' + str(index))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--game', type=Path, default=DEFAULT_GAME)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    source = args.game / 'Arknights_Data/StreamingAssets/AB/Windows/config/buff_template_holder.ab'
    selected, nodes, count, owner = [], [], 0, None
    for filename, data in bundle(source)[0]:
        if filename.endswith(('.resS', '.resource')):
            continue
        for obj in serialized(data)['objects']:
            if obj['id'] != 6070581171229484677:
                continue
            raw = data[obj['start']:obj['start'] + obj['size']]
            value = helper.decode(raw, helper.trees(data)[obj['typeid']])
            owner = {'file': filename, 'pathId': str(obj['id']),
                     'objectSha256': hashlib.sha256(raw).hexdigest()}
            for index, template in enumerate(value['_templates']['Array']):
                count += 1
                events = [{'event': e['key'], 'actions': json.loads(e['value']['SerializedState'])}
                          for e in template['eventToActions']['_items']['Array']]
                for path, node in walk(events):
                    if NODE_PATTERN.search(node.get('$type', '')):
                        nodes.append({'template': template['templateKey'], 'templateIndex': index,
                                      'path': path, 'node': node})
                if template['templateKey'].startswith(PREFIXES):
                    entry = {k: v for k, v in template.items() if k != 'eventToActions'}
                    entry.update(templateIndex=index, events=events)
                    selected.append(entry)
    payload = {'provenance': {'checkedOn': '2026-11-14', 'script': fingerprint(Path(__file__)),
                'helper': fingerprint(HELPER), 'source': fingerprint(source),
                'scope': 'Complete installed holder life-node name scan; selected programs preserve raw event actions. A template entry alone is not evidence of actual activation.'},
               'result': {'selection': {'prefixes': PREFIXES, 'nodePattern': NODE_PATTERN.pattern},
                          'holder': owner, 'templateCount': count, 'lifeNodes': nodes,
                          'selectedTemplates': selected}}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'templates': count, 'selected': len(selected), 'lifeNodes': len(nodes), 'out': str(args.out)}))


if __name__ == '__main__':
    main()
