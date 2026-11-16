#!/usr/bin/env python3
"""Re-extract ANGER native bodies and selected configuration into a fresh cache."""
import argparse
import json
import os
import subprocess
from pathlib import Path

ROOT = Path.cwd()
BATCH = Path(__file__).parent


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--out', type=Path, required=True)
    a = p.parse_args()
    a.out.mkdir(parents=True, exist_ok=True)
    historical = json.loads((BATCH / 'native.json').read_text())
    command = ['uv', 'run', '--offline',
               'docs/research/evidence/facing-semantics-20261113/extract.py',
               '--out', str(a.out / 'native.json')]
    for body in historical['result']['bodies']:
        command += ['--body-index', str(body['methodIndex'])]
    for owner in historical['result']['fieldOwners']:
        command += ['--owner', owner['fullname']]
    subprocess.run(command, check=True, env={**os.environ, 'UV_CACHE_DIR': str(ROOT / '.cache/uv')})
    subprocess.run(['python3', str(BATCH / 'extract_content.py'),
                    '--out', str(a.out / 'content.json'), '--raw-out', str(a.out / 'raw')], check=True)
    fresh = json.loads((a.out / 'native.json').read_text())
    config_before = json.loads((BATCH / 'content.json').read_text())
    config_after = json.loads((a.out / 'content.json').read_text())
    checks = {
        'nativeClientIdentity': historical['provenance']['client'] == fresh['provenance']['client'],
        'nativeBodies': historical['result']['bodies'] == fresh['result']['bodies'],
        'nativeFields': historical['result']['fieldOwners'] == fresh['result']['fieldOwners'],
        'configurationResult': config_before['result'] == config_after['result'],
    }
    report = {
        'provenance': {'checkedOn': '2026-11-16', 'script': str(Path(__file__)),
                       'freshDirectory': str(a.out), 'nativeCommand': command},
        'result': {'complete': all(checks.values()), 'checks': checks,
                   'nativeBodyCount': len(historical['result']['bodies']),
                   'componentCount': len(config_before['result']['components'])},
    }
    (BATCH / 'verification.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(report['result']))
    if not report['result']['complete']:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
