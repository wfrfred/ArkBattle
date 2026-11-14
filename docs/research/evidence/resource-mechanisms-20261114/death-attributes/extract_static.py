#!/usr/bin/env python3
"""Select byte-verified character/module records; no behavior is implemented here."""
import argparse
import hashlib
import json
from pathlib import Path

ROOT = Path.cwd()
REFERENCE = ROOT / 'docs/research/evidence/unit-audit-20261110/operator-config/configuration.json'
CACHE = ROOT / '.cache/native-research/unit-audit-20261110/operator-config'
CHARACTERS = ['char_362_saga', 'char_002_amiya', 'char_4194_rmixer']


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    sources = json.loads(REFERENCE.read_text())['provenance']['sources'][:3]
    tables = {}
    for source in sources:
        name = source['url'].rsplit('/', 1)[1]
        raw = (CACHE / name).read_bytes()
        assert hashlib.sha256(raw).hexdigest() == source['sha256'], name
        assert hashlib.sha1(f'blob {len(raw)}\0'.encode() + raw).hexdigest() == source['gitBlobSha1'], name
        tables[name] = json.loads(raw)
    characters = tables['character_table.json']
    result = {
        'characters': [dict(pointer='/' + key, id=key,
                            record={field: characters[key][field]
                                    for field in ['name', 'profession', 'talents', 'skills', 'trait']})
                       for key in CHARACTERS],
        'module': {
            'pointer': '/equipDict/uniequip_002_rmixer',
            'record': {key: tables['uniequip_table.json']['equipDict']['uniequip_002_rmixer'][key]
                       for key in ['uniEquipId', 'uniEquipName', 'typeName2', 'charId', 'unlockEvolvePhase', 'unlockLevel']},
            'battlePointer': '/uniequip_002_rmixer',
            'battle': tables['battle_equip_table.json']['uniequip_002_rmixer'],
        },
    }
    payload = {'provenance': {'sources': sources, 'reference': str(REFERENCE.relative_to(ROOT)),
                              'scriptSha256': hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
                              'scope': 'Fixed mirror static selection, separate from installed prefab/client versions.'},
               'result': result}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + '\n')


if __name__ == '__main__':
    main()
