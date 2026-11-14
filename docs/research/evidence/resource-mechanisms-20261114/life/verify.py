#!/usr/bin/env python3
"""Re-extract the life batch into a separate directory and compare selected results."""
import argparse
import ast
import copy
import json
import os
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).parent
EXTRACT = Path('docs/research/evidence/facing-semantics-20261113/extract.py')


def run(command, env):
    subprocess.run([str(x) for x in command], check=True, env=env)


def comparable(payload):
    value = copy.deepcopy(payload['result'])
    if isinstance(value, dict) and 'selection' in value:
        value['selection'].pop('out', None)
    return value


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--reference', type=Path, default=HERE)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)
    env = dict(os.environ, UV_CACHE_DIR=str(Path.cwd() / '.cache/uv'),
               PYTHONDONTWRITEBYTECODE='1', GIT_NO_LAZY_FETCH='1')
    rows = []
    for script in HERE.glob('*.py'):
        ast.parse(script.read_text(), filename=str(script))
    commands = {
        'inventory.json': ['uv', 'run', '--locked', '--offline', HERE / 'inventory.py'],
        'content.json': [sys.executable, HERE / 'extract_content.py'],
        'templates.json': [sys.executable, HERE / 'extract_templates.py'],
        'prefab-policy-scan.json': [sys.executable, HERE / 'scan_prefab_policies.py',
                                   '--extra-bundle', 'battle/[pack]common.ab'],
    }
    for name, command in commands.items():
        run(command + ['--out', args.out / name], env)
    for name in ('native.json', 'native-specializations.json', 'native-overrides.json', 'native-binding.json'):
        reference = json.loads((args.reference / name).read_text())
        selection = reference['result']['selection']
        command = ['uv', 'run', '--locked', '--offline', EXTRACT,
                   '--game', selection['game'], '--out', args.out / name]
        for key in ('search', 'body', 'body_index', 'body_prefix', 'owner', 'xref'):
            for value in selection.get(key, []):
                command.extend(['--' + key.replace('_', '-'), value])
        run(command, env)
        for kind in ('dll', 'metadata'):
            fresh = json.loads((args.out / name).read_text())
            assert fresh['provenance']['client'][kind]['sha256'] == reference['provenance']['client'][kind]['sha256']
    run([sys.executable, HERE / 'extract_static.py', '--content', args.out / 'content.json',
         '--out', args.out / 'static-bindings.json'], env)
    run(['uv', 'run', '--locked', '--offline', HERE / 'resolve_literals.py',
         '--input', args.out / 'native.json', '--out', args.out / 'literals.json'], env)
    for name in (*commands, 'native.json', 'native-specializations.json', 'native-overrides.json',
                 'native-binding.json', 'static-bindings.json', 'literals.json'):
        original = json.loads((args.reference / name).read_text())
        fresh = json.loads((args.out / name).read_text())
        assert comparable(original) == comparable(fresh), name
        rows.append({'file': name, 'selectedResultEqual': True})
    summary = {'provenance': {'scope': 'Independent static re-extraction; no client execution.',
                              'reference': str(args.reference), 'output': str(args.out)},
               'result': {'pythonSyntax': True, 'comparisons': rows}}
    (args.out / 'verification.json').write_text(json.dumps(summary, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'verified': len(rows), 'out': str(args.out / 'verification.json')}))


if __name__ == '__main__':
    main()
