#!/usr/bin/env python3
"""Decode selected installed character components; retain configuration, not activation claims."""
import hashlib
import argparse
import importlib.util
import json
from pathlib import Path
import sys

ROOT = Path.cwd()
sys.dont_write_bytecode = True
sys.path.insert(0, str(ROOT / '.agents/skills/arkbattle-native-research/scripts'))
from native import fingerprint
from unity_assets import Reader, bundle, serialized, script

HELPER = ROOT / 'docs/research/evidence/targeting-pipeline-20261109/content/extract_content.py'
spec = importlib.util.spec_from_file_location('classification_prefab_helper', HELPER)
helper = importlib.util.module_from_spec(spec)
spec.loader.exec_module(helper)

BASE = Path('/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game/Arknights_Data/StreamingAssets/AB/Windows')
SELECTION = {
    'charpack/char_158_milu.ab': ['char_158_milu'],
    'charpack/char_311_mudrok.ab': ['char_311_mudrok'],
    'battle/prefabs/[uc]equips.ab': ['uniequip_003_siege2', 'siege2_equip_2_'],
}
OUT = ROOT / 'docs/research/evidence/unit-classification-20261114/config/prefabs.json'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out', type=Path, default=OUT)
    args = parser.parse_args()
    scripts = {}
    sources = []
    for relative in ['anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin', 'anon/88b3c3ecaaefa6003de730686dd5ac53.bin']:
        path = BASE / relative
        if not path.exists():
            continue
        sources.append(fingerprint(path))
        for filename, data in bundle(path)[0]:
            if filename.endswith(('.resS', '.resource')):
                continue
            for obj in serialized(data)['objects']:
                if obj['classid'] == 115:
                    scripts[(filename, obj['id'])] = script(obj, data)
    rows = []
    for relative, wanted in SELECTION.items():
        path = BASE / relative
        sources.append(fingerprint(path))
        for filename, data in bundle(path)[0]:
            if filename.endswith(('.resS', '.resource')):
                continue
            state = serialized(data)
            layouts, externals = helper.helper.trees(data)
            names, transforms = {}, {}
            for obj in state['objects']:
                raw = data[obj['start']:obj['start'] + obj['size']]
                if obj['classid'] == 1:
                    reader = Reader(raw)
                    reader.read(reader.val('i') * 12)
                    reader.val('i')
                    names[obj['id']] = reader.string()
                elif obj['classid'] == 4:
                    value = helper.decode(raw, layouts[obj['typeid']])
                    transforms[obj['id']] = (value['common:374']['m_PathID'], value['m_Father']['m_PathID'])
            by_owner = {owner: tid for tid, (owner, _) in transforms.items()}
            for obj in state['objects']:
                if obj['classid'] != 114:
                    continue
                raw = data[obj['start']:obj['start'] + obj['size']]
                value = helper.decode(raw, layouts[obj['typeid']])
                owner = int.from_bytes(raw[4:12], 'little', signed=True)
                hierarchy = []
                tid = by_owner.get(owner)
                while tid:
                    go, tid = transforms[tid]
                    hierarchy.append(names[go])
                hierarchy.reverse()
                if not hierarchy or not any(hierarchy[0].startswith(prefix) for prefix in wanted):
                    continue
                pointer = value['common:490']
                script_file = filename if pointer['m_FileID'] == 0 else externals[pointer['m_FileID'] - 1]['path'].split('/')[-1]
                binding = scripts.get((script_file, pointer['m_PathID']))
                projected = {k: v for k, v in value.items() if not k.startswith('common:')}
                rows.append(dict(bundle=relative, file=filename, pathId=str(obj['id']), hierarchy=hierarchy,
                                 objectSha256=hashlib.sha256(raw).hexdigest(), scriptPPtr=pointer,
                                 scriptFile=script_file, script=binding, value=projected))
    result = dict(provenance=dict(collectedOn='2026-11-14', script=fingerprint(Path(__file__)),
                  helper=fingerprint(HELPER), sources=sources,
                  selection=SELECTION,
                  scope='All MonoBehaviour components under selected character/module hierarchy roots; no live execution observation.'),
                  result=rows)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(dict(out=str(args.out), components=len(rows))))


if __name__ == '__main__':
    main()
