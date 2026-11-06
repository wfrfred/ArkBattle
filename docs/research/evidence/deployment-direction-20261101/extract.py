#!/usr/bin/env python3
"""Re-extract the bounded giant locate-region and direction witnesses."""
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
ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT / '.agents/skills/arkbattle-native-research/scripts'))
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

selected = []
methods = {}
field_names = {
    'Torappu.Battle.Entity': {'m_direction'},
    'Torappu.Battle.Unit': set(),
    'Torappu.Battle.Enemy': {'_locateRange', '_bodyDirectionPolicy', 'm_nonTriggerCollider', 'm_mainTriggerCollider', 'm_mainTriggerColliderRadius'},
    'Torappu.Battle.EnemyGiantBoss': {'_locateTileEffectKey', '_tokenToSpawn'},
}
method_names = {
    'Torappu.Battle.Entity.get_direction',
    'Torappu.Battle.Entity.set_direction',
    'Torappu.Battle.Entity.SetBodyAndFaceDirection',
    'Torappu.Battle.Enemy.SetBodyAndFaceDirection',
    'Torappu.Battle.Enemy._CalculateFaceDirection',
    'Torappu.Battle.EnemyGiantBoss._DoBorn',
}
for name, wanted in field_names.items():
    t = next(t for t in n.types if n.typename(t['index']) == name)
    relevant = []
    for i in range(t['methodStart'], t['methodStart'] + t['methodCount']):
        m = n.method(i)
        if m['fullname'] in method_names:
            relevant.append(m)
            methods[m['fullname']] = m
    selected.append(dict(fullname=name, index=t['index'], token=t['token'],
        parent=n.type_name(t['parentIndex']),
        fields=[f for f in n.fields(t['index']) if f['name'] in wanted], methods=relevant))
if set(methods) != method_names:
    raise ValueError('recorded method identity could not be resolved')
write('selected-types.json', selected)

method = methods['Torappu.Battle.EnemyGiantBoss._DoBorn']
cursor = method['address']
limit = next(a for a in n.addresses if a > cursor)
parts = []
while cursor < limit:
    body = n.disassemble_at(cursor)
    # Shared no-op stubs can have thousands of aliases. Preserve code and
    # address, but do not claim any one method identity for such a call.
    for row in body['instructions']:
        aliases = row.get('methods', [])
        if len(aliases) > 32:
            row['sharedMethodAliasCount'] = len(aliases)
            row['methodAliasesOmitted'] = True
            del row['methods']
    parts.append(body)
    end = int(body['end'], 16)
    if end <= cursor:
        raise ValueError('nonprogressing native code range')
    cursor = end
write('giant-born.json', dict(method=method, followingMethodAddress=hex(limit), parts=parts,
    scope='Static native class witness, not a Sui prefab binding. Shared-stub alias lists are elided, not resolved to one caller.'))
write('probe.json', dict(typeCount=len(n.types), methodCount=len(n.methods)))
