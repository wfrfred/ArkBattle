#!/usr/bin/env python3
"""Decode ShowModifierText's recorded RIP string slots without running the client."""
import argparse
import json
import sys
from pathlib import Path
sys.dont_write_bytecode = True
sys.path.insert(0, str(Path.cwd() / '.agents/skills/arkbattle-native-research/scripts'))
from native import Native, DEFAULT_GAME, fingerprint

def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--game', type=Path, default=DEFAULT_GAME)
    p.add_argument('--out', type=Path, required=True)
    a = p.parse_args()
    n = Native(a.game)
    source = Path(__file__).with_name('consumers.json')
    data = json.loads(source.read_text())
    rows = n.records(0, '<II', 'length dataIndex')
    base, _ = n.table(1)
    found = []
    for body in data['result']['bodies']:
        if body['methodIndex'] != 105936:
            continue
        for fragment in body['fragments']:
            for ins in fragment['instructions']:
                for ref in ins.get('ripReferences', []):
                    try:
                        word = n.pe.unpack('<Q', int(ref, 16))[0]
                    except (StopIteration, ValueError):
                        continue
                    if word >> 29 != 5 or word & 1 != 1:
                        continue
                    index = (word & ((1 << 29) - 1)) >> 1
                    row = rows[index]
                    start = base + row['dataIndex']
                    value = n.metadata[start:start+row['length']].decode('utf-8')
                    found.append({'instruction': ins, 'slot': ref, 'encodedUsage': hex(word),
                                  'literalIndex': index, 'value': value})
    owner = next(t for t in n.types if n.typename(t['index']) == 'Torappu.Battle.UI.UIController')
    provenance = n.provenance()
    provenance['script'] = fingerprint(Path(__file__))
    provenance['inputBodies'] = fingerprint(source)
    result = {'methodIndex': 105936, 'literalReads': found, 'uiFields': n.fields(owner['index']),
              'scope': 'Only recorded RIP references in the full ShowModifierText body; encoded literal slots only.'}
    a.out.parent.mkdir(parents=True, exist_ok=True)
    a.out.write_text(json.dumps({'provenance':provenance,'result':result},ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'literals':[(x['instruction']['address'],x['value']) for x in found]},ensure_ascii=False))
if __name__ == '__main__':
    main()
