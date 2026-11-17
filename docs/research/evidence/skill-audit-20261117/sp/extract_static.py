#!/usr/bin/env python3
"""Select the fixed character/skill inputs that bind the SP audit examples."""
import argparse
import hashlib
import json
from pathlib import Path

ROOT = Path.cwd()
BASE = ROOT / '.cache/native-research/route-operations-20261107/data'
RECORD = ROOT / 'docs/research/evidence/route-operations-20261107/data-source-verification.json'
CHARACTERS = ['char_4141_marcil', 'char_1033_swire2']


def fp(path):
    raw = path.read_bytes()
    return dict(path=str(path), bytes=len(raw), sha256=hashlib.sha256(raw).hexdigest())


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    verified = json.loads(RECORD.read_text())
    sources, tables = [], {}
    for filename in ['character_table.json', 'skill_table.json']:
        path = BASE / filename
        raw = path.read_bytes()
        old = next(s for s in verified['result']['sources'] if s['sourcePath'].endswith('/' + filename))
        actual_blob = hashlib.sha1(b'blob ' + str(len(raw)).encode() + b'\0' + raw).hexdigest()
        if hashlib.sha256(raw).hexdigest() != old['sha256'] or actual_blob != old['expectedGitBlob']:
            raise ValueError('Pinned table changed: ' + filename)
        sources.append(dict(**fp(path), gitBlobSha1=actual_blob, sourcePath=old['sourcePath']))
        tables[filename] = json.loads(raw)
    characters = {key: tables['character_table.json'][key] for key in CHARACTERS}
    skill_keys = sorted({s['skillId'] for c in characters.values() for s in c['skills']})
    skills = {key: tables['skill_table.json'][key] for key in skill_keys}
    payload = dict(provenance=dict(script=fp(Path(__file__)), sources=sources,
                                  verificationRecord=fp(RECORD), source=verified['provenance'],
                                  scope='Pinned raw third-party mirror records, independently versioned from installed Prefabs.'),
                   result=dict(characterData=characters, skillData=skills))
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(dict(characters=len(characters), skills=len(skills))))


if __name__ == '__main__':
    main()
