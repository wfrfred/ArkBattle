#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
"""Extract complete selected AoE emitters with archived type-tree decoding."""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import sys

sys.dont_write_bytecode = True
READER = Path('docs/research/evidence/targeting-pipeline-20261109/content/extract_content.py')
spec = importlib.util.spec_from_file_location('archived_content_reader', READER)
content = importlib.util.module_from_spec(spec)
spec.loader.exec_module(content)


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--game', type=Path, required=True)
    p.add_argument('--out', type=Path, required=True)
    p.add_argument('--bundle', action='append', required=True)
    p.add_argument('--root', action='append', default=[])
    args = p.parse_args()
    base = args.game / 'Arknights_Data/StreamingAssets/AB/Windows'
    scripts_bundle = 'anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin'
    scripts = {}
    sources = [content.fingerprint(base / scripts_bundle)]
    for filename, data in content.bundle(base / scripts_bundle)[0]:
        if filename.endswith(('.resS', '.resource')):
            continue
        for obj in content.serialized(data)['objects']:
            if obj['classid'] == 115:
                scripts[(filename, obj['id'])] = content.script(obj, data)
    rows = []
    for relative in args.bundle:
        sources.append(content.fingerprint(base / relative))
        for filename, data in content.bundle(base / relative)[0]:
            if filename.endswith(('.resS', '.resource')):
                continue
            state = content.serialized(data)
            layouts, externals = content.helper.trees(data)
            names, transforms = {}, {}
            for obj in state['objects']:
                raw = data[obj['start']:obj['start'] + obj['size']]
                if obj['classid'] == 1:
                    r = content.Reader(raw)
                    r.read(r.val('i') * 12)
                    r.val('i')
                    names[obj['id']] = r.string()
                elif obj['classid'] == 4:
                    v = content.decode(raw, layouts[obj['typeid']])
                    transforms[obj['id']] = (v['common:374']['m_PathID'], v['m_Father']['m_PathID'])
            by_owner = {owner: tid for tid, (owner, _) in transforms.items()}
            for obj in state['objects']:
                if obj['classid'] != 114:
                    continue
                raw = data[obj['start']:obj['start'] + obj['size']]
                owner = int.from_bytes(raw[4:12], 'little', signed=True)
                hierarchy = []
                tid = by_owner.get(owner)
                while tid:
                    go, tid = transforms[tid]
                    hierarchy.append(names[go])
                hierarchy.reverse()
                if args.root and (not hierarchy or hierarchy[0] not in args.root):
                    continue
                value = content.decode(raw, layouts[obj['typeid']])
                pointer = value['common:490']
                script_file = filename if pointer['m_FileID'] == 0 else externals[pointer['m_FileID'] - 1]['path'].split('/')[-1]
                script = scripts.get((script_file, pointer['m_PathID']))
                rows.append(dict(bundle=relative, file=filename, pathId=str(obj['id']), hierarchy=hierarchy,
                                 objectSha256=hashlib.sha256(raw).hexdigest(), scriptPPtr=pointer,
                                 scriptFile=script_file, script=script, value=value))
    result = dict(provenance=dict(collectedOn='2026-11-09', script=content.fingerprint(Path(__file__)),
                  contentReader=content.fingerprint(READER), sources=sources,
                  selection=dict(bundles=args.bundle, roots=args.root),
                  scope='Complete decoded MonoBehaviour fields for selected roots; other serialized objects and external PPtrs remain references.'),
                  result=rows)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(dict(out=str(args.out), components=len(rows))))

if __name__ == '__main__':
    main()
