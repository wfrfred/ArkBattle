#!/usr/bin/env python3
"""Project the existing Tulip S1 extraction after verifying its current inputs."""
import argparse
import hashlib
import json
from pathlib import Path

ROOT = next(p for p in Path(__file__).resolve().parents if (p / '.agents/skills/arkbattle-native-research/scripts/native.py').exists())
SOURCE = ROOT / 'docs/research/evidence/anger-exclusions-20261117/content.json'


def fingerprint(path):
    return {'path': str(path.resolve()), 'bytes': path.stat().st_size, 'sha256': hashlib.sha256(path.read_bytes()).hexdigest()}


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--out', type=Path, required=True)
    a = p.parse_args()
    original = json.loads(SOURCE.read_text())
    inputs = original['provenance']['sources'] + original['provenance']['configurationInputs']
    verification = []
    for previous in inputs:
        path = Path(previous['path'])
        if not (str(path).endswith('battle/prefabs/[uc]skills.ab') or path.name in ['character_table.json', 'skill_table.json']):
            continue
        current = fingerprint(path)
        if current['sha256'] != previous['sha256']:
            raise ValueError(('source changed; re-extract before projection', current))
        verification.append({'previous': previous, 'current': current, 'sha256Matches': True})
    r = original['result']
    result = {'components': [c for c in r['components'] if c['hierarchy'][0] == 'skchr_apionr_1'],
              'character': {'id': 'char_513_apionr', 'name': r['character']['name'], 'skills': r['character']['skills']},
              'skill': {'skillId': r['skill']['skillId'], 'firstLevel': r['skill']['levels'][0], 'maxLevel': r['skill']['levels'][-1]}}
    provenance = {'checkedOn': '2026-11-17', 'scope': 'Projection of archived component decoding, not a second bundle decoding; current Bundle and table fingerprints checked.',
                  'sourceEvidence': fingerprint(SOURCE), 'tool': fingerprint(Path(__file__)),
                  'sourceVerification': verification, 'configurationSource': original['provenance']['configurationSource']}
    a.out.parent.mkdir(parents=True, exist_ok=True)
    a.out.write_text(json.dumps({'provenance': provenance, 'result': result}, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'components': len(result['components']), 'verifiedInputs': len(verification)}))


if __name__ == '__main__':
    main()
