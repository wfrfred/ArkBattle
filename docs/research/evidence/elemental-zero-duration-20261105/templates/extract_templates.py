#!/usr/bin/env python3
"""Decode selected live EP-break templates and separately project a pinned BuffDB mirror."""
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
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

TREE_READER = ROOT / 'docs/research/evidence/attack-addon-order-20261102/content/decode_content.py'
MIRROR_COMMIT = 'bffe31bf66739842f99b457327066c695e2af389'
MIRROR_HASH = 'f9c67db93cd9e8d40a3ff76ec6375d232993f1b61f3d277cb96b05e32fe537c3'
ROOT_KEYS = {f'ep_break_{kind}' for kind in ['sanity', 'water', 'fire', 'dark']}


def walk(value, path=''):
    if isinstance(value, dict):
        yield path, value
        for key, child in value.items():
            yield from walk(child, f'{path}/{key}')
    elif isinstance(value, list):
        for index, child in enumerate(value):
            yield from walk(child, f'{path}/{index}')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--game', type=Path, default=Path('/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game'))
    parser.add_argument('--buff-table', type=Path, required=True)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)
    mirror_bytes = args.buff_table.read_bytes()
    assert hashlib.sha256(mirror_bytes).hexdigest() == MIRROR_HASH
    buff_db = json.loads(mirror_bytes)
    spec = importlib.util.spec_from_file_location('type_tree_reader', TREE_READER)
    reader = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(reader)
    relative = 'config/buff_template_holder.ab'
    source = args.game / 'Arknights_Data/StreamingAssets/AB/Windows' / relative
    assert fingerprint(source)['sha256'] == '8edcb8017c977cdf52c2593b58e21db96949f3ad1e6f904180ac1241f145ca79'
    filename = 'CAB-7983df61b3ae63c96fb4e076fc3d80af'
    data = dict(bundle(source)[0])[filename]
    objects = serialized(data)['objects']
    obj = next(item for item in objects if item['id'] == 6070581171229484677)
    raw = data[obj['start']:obj['start'] + obj['size']]
    value = reader.decode(raw, reader.trees(data)[obj['typeid']])
    templates = {}
    for index, template in enumerate(value['_templates']['Array']):
        entry = dict(template)
        entry['templateIndex'] = index
        entry['events'] = [dict(event=event['key'], actions=json.loads(event['value']['SerializedState']))
                           for event in entry.pop('eventToActions')['_items']['Array']]
        templates[entry['templateKey']] = entry
    selected = set()
    selected_db = set(ROOT_KEYS)
    pending = list(ROOT_KEYS)
    while pending:
        key = pending.pop()
        if key in selected or key == 'empty':
            continue
        selected.add(key)
        for _, node in walk(templates[key]['events']):
            if '_buff' not in node:
                continue
            buff = node['_buff']
            if buff.get('loadFromDB'):
                db_key = buff['buffKey']
                selected_db.add(db_key)
                buff = buff_db[db_key]
            pending.append(buff['templateKey'])
    installed = dict(provenance=dict(collectedOn='2026-11-05', script=fingerprint(Path(__file__)),
        treeReader=fingerprint(TREE_READER), tools=[fingerprint(TOOLS / name) for name in ['assets.py', 'unity_assets.py']],
        source=fingerprint(source), scope='Installed holder entries and direct action-node bindings; BuffDB resolution below uses a separate pinned third-party mirror; no runtime/XLua verification.'),
        result=dict(bundle=relative, file=filename, pathId=str(obj['id']), sha256=hashlib.sha256(raw).hexdigest(),
                    templates=[templates[key] for key in sorted(selected)]))
    mirror = dict(provenance=dict(collectedOn='2026-11-05', source='Third-party extracted game-data mirror; separate from installed bundle.',
        url=f'https://github.com/Kengxxiao/ArknightsGameData/blob/{MIRROR_COMMIT}/zh_CN/gamedata/buff_table.json',
        bytes=len(mirror_bytes), sha256=MIRROR_HASH), result={key: buff_db[key] for key in sorted(selected_db)})
    for name, output in [('selected-templates.json', installed), ('buffdb-mirror.json', mirror)]:
        (args.out / name).write_text(json.dumps(output, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(dict(templates=len(selected), mirrorEntries=len(selected_db), out=str(args.out))))


if __name__ == '__main__':
    main()
