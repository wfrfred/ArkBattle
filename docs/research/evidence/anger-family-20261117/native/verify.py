#!/usr/bin/env python3
"""Independently reread the selected native identities, fields and instruction bytes."""
import argparse
import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True
ROOT = Path.cwd()
BATCH = Path(__file__).parent
sys.path.insert(0, str(ROOT / '.agents/skills/arkbattle-native-research/scripts'))
from native import Native, DEFAULT_GAME, fingerprint


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    native = Native(DEFAULT_GAME)
    identities, instructions, layouts, parents, fingerprints, intervals = [], [], [], [], [], []
    sources = []
    for path in sorted(BATCH.glob('*.json')):
        if path.name in {'verification.json', 'archive.json'}:
            continue
        old = json.loads(path.read_text())
        if not old.get('provenance', {}).get('client'):
            continue
        fingerprints.append(old['provenance']['client'] == native.provenance()['client'])
        sources.append(fingerprint(path))
        result = old['result']
        for method in result.get('methods', []):
            identities.append(native.method(method['index']) == method)
        for owner in result.get('fieldOwners', []) + result.get('types', []):
            index = owner.get('index', owner.get('type', {}).get('index'))
            if index is None:
                continue
            layouts.append(native.fields(index) == owner['fields'])
            if 'parent' in owner:
                parent = native.types[index]['parentIndex']
                parents.append(owner['parent'] == (native.type_name(parent) if parent >= 0 else None))
            for method in owner.get('methods', []):
                identities.append(native.method(method['index']) == method)
        for body in result.get('bodies', []):
            method = native.method(body['methodIndex'])
            identities.append(method['fullname'] == body['fullname'])
            cursor = method['address']
            for part in body['fragments']:
                intervals.append(cursor == int(part['address'], 16))
                cursor = int(part['end'], 16)
                for instruction in part['instructions']:
                    raw = bytes.fromhex(instruction['bytes'])
                    instructions.append(native.pe.read(int(instruction['address'], 16), len(raw)) == raw)
            intervals.append(cursor == int(body['logicalEnd'], 16))
    checks = {'clientFingerprint': all(fingerprints), 'methodIdentity': all(identities),
              'nativeInstructions': all(instructions), 'fieldLayouts': all(layouts),
              'typeParents': all(parents), 'bodyIntervals': all(intervals)}
    result = {'complete': all(checks.values()), 'checks': checks, 'files': len(sources),
              'methodChecks': len(identities), 'instructions': len(instructions),
              'fieldOwners': len(layouts), 'parentChecks': len(parents)}
    payload = {'provenance': {'scope': 'Independent metadata/byte reread; no client execution or runtime XLua verification.',
                              'script': fingerprint(Path(__file__)), 'sources': sources}, 'result': result}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(result))
    if not result['complete']:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
