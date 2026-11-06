#!/usr/bin/env python3
"""Re-extract the recorded Card recovery-budget chain; run from repository root."""
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
import argparse
import datetime
import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path.cwd() / '.agents/skills/arkbattle-native-research/scripts'))
from native import DEFAULT_GAME, Native, fingerprint

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--game', type=Path, default=DEFAULT_GAME)
parser.add_argument('--out', type=Path, required=True)
args = parser.parse_args()
expected = json.loads(Path(__file__).with_name('probe.json').read_text())['provenance']['client']
for kind, relative in [('dll', 'GameAssembly.dll'), ('metadata', 'Arknights_Data/il2cpp_data/Metadata/global-metadata.dat')]:
    if fingerprint(args.game / relative)['sha256'] != expected[kind]['sha256']:
        raise ValueError('client fingerprint differs from the recorded investigation: ' + kind)

n = Native(args.game)
provenance = n.provenance()
provenance['collectedOn'] = datetime.date.today().isoformat()
provenance['extractionScript'] = fingerprint(Path(__file__))
args.out.mkdir(parents=True, exist_ok=True)

def write(name, result):
    (args.out / name).write_text(json.dumps(dict(provenance=provenance, result=result), ensure_ascii=False, indent=2) + '\n')

names = {
    'Torappu.Battle.Deck/Card.OnRecycle', 'Torappu.Battle.Deck/Card.OnTick',
    'Torappu.Battle.Deck/Card.Recharge', 'Torappu.Battle.Deck/Card.Draw',
    'Torappu.Battle.Deck/Card._UpdateCardBuff', 'Torappu.Battle.Deck/TokenCard.OnRecycle',
    'Torappu.PeriodicTimer.Reset',
}
bodies = []
found = set()
for m in n.methods:
    name = n.typename(m['declaringType']) + '.' + n.string(m['nameIndex'])
    if name not in names or not m['address']:
        continue
    found.add(name)
    method = n.method(m['index'])
    limit = next(a for a in n.addresses if a > m['address'])
    cursor = m['address']
    parts = []
    while cursor < limit:
        body = n.disassemble_at(cursor)
        parts.append(body)
        end = int(body['end'], 16)
        if end <= cursor:
            raise ValueError('nonprogressing native code range')
        cursor = end
    bodies.append(dict(method=method, followingMethodAddress=hex(limit), parts=parts))
if found != names:
    raise ValueError('missing recorded methods: ' + str(names - found))
write('supply-methods.json', bodies)

defaults = n.records(7, '<iii', 'fieldIndex typeIndex dataIndex')
data_start, _ = n.table(8)
selected = []
for name in ['Torappu.Battle.Deck/Card', 'Torappu.PeriodicTimer', 'Torappu.Battle.Deck/Card/CardPolicy', 'Torappu.Battle.Deck/Card/State', 'Torappu.Battle.Deck/Card/RechargeTiming']:
    t = next(t for t in n.types if n.typename(t['index']) == name)
    fields = n.fields(t['index'])
    if name == 'Torappu.Battle.Deck/Card':
        fields = [f for f in fields if f['name'] in ['m_remainingCnt', 'm_respawnTimer', 'm_queuedRespawnCnt', 'm_newRespawnTimePeriod', 'm_respawnTimerStopped', 'm_respawnDisabled']]
    else:
        for f in fields:
            d = next((d for d in defaults if d['fieldIndex'] == f['index']), None)
            if d is None or d['dataIndex'] < 0:
                continue
            u = n.metadata[data_start + d['dataIndex']]
            if u >= 128:
                raise ValueError('expected the observed one-byte enum constants')
            f.update(defaultRecord=d, defaultByte=hex(u), defaultValue=(u >> 1) ^ -(u & 1), defaultEncoding='IL2CPP compressed signed integer; one-byte records')
    selected.append(dict(fullname=name, index=t['index'], fields=fields))
write('supply-fields.json', selected)
write('probe.json', dict(typeCount=len(n.types), methodCount=len(n.methods)))
