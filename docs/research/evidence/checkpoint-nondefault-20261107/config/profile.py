#!/usr/bin/env python3
"""Verify the pinned level corpus behind shared config.py statistics."""
import argparse
import hashlib
import json
from pathlib import Path
import subprocess


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--mirror', type=Path, required=True)
    parser.add_argument('--revision', required=True)
    parser.add_argument('--randomize', type=Path, required=True)
    parser.add_argument('--distance', type=Path, required=True)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    mirror = args.mirror.resolve()
    prefixes = ['zh_CN/gamedata/levels/obt/', 'zh_CN/gamedata/levels/activities/']
    actual_revision = subprocess.check_output(
        ['git', '-C', str(mirror), 'rev-parse', 'HEAD'], text=True).strip()
    assert actual_revision == args.revision, (actual_revision, args.revision)
    tree = subprocess.check_output(
        ['git', '-C', str(mirror), 'ls-tree', '-r', '-z', args.revision, '--', *prefixes])
    sources = []
    for record in tree.split(b'\0'):
        if not record:
            continue
        header, name = record.split(b'\t', 1)
        mode, kind, blob = header.decode().split()
        relative = name.decode()
        if kind != 'blob' or not relative.endswith('.json'):
            continue
        path = mirror / relative
        raw = path.read_bytes()
        digest = hashlib.sha1(b'blob ' + str(len(raw)).encode() + b'\0' + raw).hexdigest()
        assert digest == blob, relative
        sources.append({'path': relative, 'githubBlobSha': blob, 'bytes': len(raw),
                        'sha256': hashlib.sha256(raw).hexdigest()})
    reports = {}
    for field, path in [('randomizeReachOffset', args.randomize), ('reachDistance', args.distance)]:
        report = json.loads(path.read_text())
        provenance, result = report['provenance'], report['result']
        assert provenance['revision'] == args.revision
        assert result['complete'] and not result['errors'] and not result['missing']
        inputs = {str(Path(row['path']).resolve()): row for row in provenance['inputs']}
        assert set(inputs) == {str(mirror / row['path']) for row in sources}
        for source in sources:
            row = inputs[str(mirror / source['path'])]
            assert row['status'] == 'ok' and row['bytes'] == source['bytes']
            assert row['sha256'] == source['sha256']
        assert result['scanned'] == len(sources)
        reports[field] = {'record': path.name, 'sha256': hashlib.sha256(path.read_bytes()).hexdigest(),
                          'groups': result['groups'], 'matched': result['matched'],
                          'missing': result['missing'], 'errors': result['errors']}
    out = {'provenance': {'repository': 'Kengxxiao/ArknightsGameData', 'revision': args.revision,
                         'selection': prefixes, 'treeCommand': 'git ls-tree -r -z <revision> -- <prefixes>',
                         'verification': 'Complete listed JSON set; every byte string matches its Git blob and both shared-selector inputs.',
                         'scriptSha256': hashlib.sha256(Path(__file__).read_bytes()).hexdigest()},
           'result': {'files': len(sources), 'bytes': sum(row['bytes'] for row in sources),
                      'reports': reports, 'sources': sources}}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(out, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'revision': args.revision, 'files': len(sources), 'reports': reports}))


if __name__ == '__main__':
    main()
