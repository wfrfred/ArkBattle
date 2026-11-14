#!/usr/bin/env python3
"""Replay this batch's logical-body selectors into an independent directory."""
import argparse
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path.cwd()
EXTRACTOR = ROOT / 'docs/research/evidence/facing-semantics-20261113/extract.py'


def comparable(payload):
    result = payload['result']
    if 'selection' in result:
        result = {**result, 'selection': {k: v for k, v in result['selection'].items() if k != 'out'}}
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)
    checks = []
    for record in sorted(Path(__file__).parent.glob('*.json')):
        payload = json.loads(record.read_text())
        result = payload.get('result', {})
        if not isinstance(result, dict) or 'bodies' not in result or 'selection' not in result:
            continue
        selection = result['selection']
        target = args.out / record.name
        command = [sys.executable, str(EXTRACTOR), '--game', selection['game'], '--out', str(target)]
        for key in ['search', 'body', 'body_index', 'body_prefix', 'owner', 'xref']:
            for value in selection.get(key, []):
                command += ['--' + key.replace('_', '-'), str(value)]
        subprocess.run(command, check=True)
        fresh = json.loads(target.read_text())
        equal = comparable(payload) == comparable(fresh)
        checks.append({'record': record.name, 'equalResult': equal})
        if not equal:
            raise AssertionError(record.name)
    (args.out / 'checks.json').write_text(json.dumps(checks, indent=2) + '\n')


if __name__ == '__main__':
    main()
