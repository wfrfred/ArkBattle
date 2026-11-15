#!/usr/bin/env python3
"""Index UnityFS assets and extract selected raw serialized objects.

Does not infer custom MonoBehaviour field layouts or resolve external PPtrs.
Use preserved object bytes with a question-specific, archived decoder.
"""
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
import argparse
import hashlib
import json
from pathlib import Path

import sys
sys.dont_write_bytecode = True

from native import fingerprint
from unity_assets import bundle, serialized, script


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('bundle', type=Path)
    parser.add_argument('--find', help='UTF-8 byte search inside each serialized object')
    parser.add_argument('--object', type=int, action='append', help='PathID to extract; repeatable')
    parser.add_argument('--file', help='serialized file node name, when a bundle contains several')
    parser.add_argument('--out', type=Path, required=True, help='evidence or scratch output directory')
    args = parser.parse_args()
    files, uv = bundle(args.bundle)
    if args.file and args.file not in {name for name, _ in files}:
        parser.error(f'unknown serialized file: {args.file}')
    result = dict(source=fingerprint(args.bundle), unityVersion=uv,
                  tool=[fingerprint(Path(__file__)), fingerprint(Path(__file__).with_name('unity_assets.py'))],
                  scope='Serialized object index and raw bytes; custom field semantics/external references require decoding.', files=[])
    args.out.mkdir(parents=True, exist_ok=True)
    found = set()
    matches = {}
    for node_index, (name, data) in enumerate(files):
        if args.file and name != args.file:
            continue
        # UnityFS may also contain .resS/.resource payloads, not SerializedFiles.
        if name.endswith(('.resS', '.resource')):
            result['files'].append(dict(name=name, kind='resource', bytes=len(data)))
            continue
        state = serialized(data)
        entry = dict(name=name, version=state['version'], types=state['types'], objects=[])
        for obj in state['objects']:
            raw = data[obj['start']:obj['start'] + obj['size']]
            if args.object and obj['id'] not in args.object:
                continue
            if args.find and args.find.encode() not in raw:
                continue
            row = dict(obj, id=str(obj['id']))
            if args.object:
                matches.setdefault(obj['id'], []).append(name)
                if len(matches[obj['id']]) > 1:
                    parser.error(f'PathID {obj["id"]} occurs in several files; select --file')
            if obj['classid'] == 115:
                row['monoScript'] = script(obj, data)
            if args.object:
                target = args.out / f'{node_index}-{obj["id"]}.bin'
                target.write_bytes(raw)
                row.update(rawFile=target.name, sha256=hashlib.sha256(raw).hexdigest())
                found.add(obj['id'])
            entry['objects'].append(row)
        result['files'].append(entry)
    if args.object and found != set(args.object):
        parser.error(f'object IDs not found after filtering: {set(args.object) - found}')
    (args.out / 'assets.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(args.out / 'assets.json')


if __name__ == '__main__':
    main()
