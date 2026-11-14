#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Resolve encoded metadata string usages referenced by archived life method bodies."""
import argparse
import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path.cwd() / '.agents/skills/arkbattle-native-research/scripts'))
from native import DEFAULT_GAME, Native, fingerprint


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--game', type=Path, default=DEFAULT_GAME)
    parser.add_argument('--input', type=Path, required=True)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    source = json.loads(args.input.read_text())
    n = Native(args.game)
    provenance = n.provenance()
    for kind in ('dll', 'metadata'):
        assert provenance['client'][kind]['sha256'] == source['provenance']['client'][kind]['sha256']
    literal_rows = n.records(0, '<II', 'length dataIndex')
    literal_base, _ = n.table(1)
    found = []
    for body in source['result']['bodies']:
        for part in body['fragments']:
            for ins in part['instructions']:
                for ref in ins.get('ripReferences', []):
                    try:
                        encoded = n.pe.unpack('<Q', int(ref, 16))[0]
                    except (StopIteration, ValueError):
                        continue
                    kind = (encoded >> 29) & 7
                    index = (encoded & 0x1ffffffe) >> 1
                    if encoded >> 32 or kind != 5 or index >= len(literal_rows):
                        continue
                    row = literal_rows[index]
                    begin = literal_base + row['dataIndex']
                    text = n.metadata[begin:begin + row['length']].decode('utf-8')
                    found.append({'methodIndex': body['methodIndex'], 'method': body['fullname'],
                                  'instruction': ins['address'], 'slot': ref,
                                  'encodedUsage': hex(encoded), 'literalIndex': index, 'text': text})
    provenance['caseTool'] = {'script': fingerprint(Path(__file__)), 'input': fingerprint(args.input)}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps({'provenance': provenance, 'result': found},
                                   ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'literals': len(found), 'out': str(args.out)}))


if __name__ == '__main__':
    main()
