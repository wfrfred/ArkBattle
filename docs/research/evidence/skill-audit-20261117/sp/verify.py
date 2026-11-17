#!/usr/bin/env python3
"""Independently reread this bounded SP evidence and rerun its config selectors."""
import argparse
import importlib.util
import json
import subprocess
import sys
from pathlib import Path

sys.dont_write_bytecode = True
ROOT = Path.cwd()
HERE = Path(__file__).parent
sys.path.insert(0, str(ROOT / '.agents/skills/arkbattle-native-research/scripts'))
from native import Native, DEFAULT_GAME, fingerprint


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    native = Native(DEFAULT_GAME)
    identity, code, fields, enums, fingerprints = [], [], [], [], []
    for name in ['discovery.json', 'native.json', 'mana.json']:
        old = json.loads((HERE / name).read_text())
        fingerprints.append(old['provenance']['client'] == native.provenance()['client'])
        result = old['result']
        for method in result['methods']:
            identity.append(native.method(method['index']) == method)
        for owner in result['fieldOwners']:
            fields.append(native.fields(owner['index']) == owner['fields'])
        for body in result['bodies']:
            identity.append(native.method(body['methodIndex'])['fullname'] == body['fullname'])
            for part in body['fragments']:
                for instruction in part['instructions']:
                    raw = bytes.fromhex(instruction['bytes'])
                    code.append(native.pe.read(int(instruction['address'], 16), len(raw)) == raw)
    inventory = json.loads((HERE / 'inventory.json').read_text())
    fingerprints.append(inventory['provenance']['client'] == native.provenance()['client'])
    for owner in inventory['result']['owners']:
        fields.append(native.fields(owner['index']) == owner['fields'])
        identity.extend(native.method(m['index']) == m for m in owner['methods'])
    identity.extend(native.method(m['index']) == m for m in inventory['result']['entitySpMethods'])
    base, _ = native.table(8)
    for enum in inventory['result']['enums']:
        for item in enum['values']:
            raw = bytes.fromhex(item['encodedBytes'])
            at = base + item['default']['dataIndex']
            enums.append(native.metadata[at:at + len(raw)] == raw)
    args.out.mkdir(parents=True, exist_ok=True)
    configurations = []
    for script, output in [('extract_content.py', 'content.json'), ('extract_static.py', 'static-inputs.json')]:
        target = args.out / output
        subprocess.run([sys.executable, str(HERE / script), '--out', str(target)], check=True, stdout=subprocess.DEVNULL)
        expected = json.loads((HERE / output).read_text())['result']
        actual = json.loads(target.read_text())['result']
        configurations.append(expected == actual)
    checks = dict(clientFingerprint=all(fingerprints), methodIdentity=all(identity), instructionBytes=all(code),
                  fieldLayouts=all(fields), enumBytes=all(enums), freshConfiguration=all(configurations))
    result = dict(complete=all(checks.values()), checks=checks, methods=len(identity), instructions=len(code),
                  fieldOwners=len(fields), enumConstants=len(enums), configurationSelectors=len(configurations))
    report = dict(provenance=dict(script=fingerprint(Path(__file__)), scope='Fresh identity/byte/layout checks and independent config re-extraction; no client execution/XLua verification.'), result=result)
    (args.out / 'verification.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(result))
    if not result['complete']:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
