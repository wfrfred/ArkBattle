#!/usr/bin/env python3
"""Read Character relocation and default state machine witnesses."""
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
import argparse
import bisect
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[5]
sys.path.insert(0, str(ROOT / '.agents/skills/arkbattle-native-research/scripts'))
from native import Native, DEFAULT_GAME, fingerprint

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--game', type=Path, default=DEFAULT_GAME)
parser.add_argument('--out', type=Path, required=True)
args = parser.parse_args()
n = Native(args.game)
methods = [n.method(m['index']) for m in n.methods if
    'Character' in n.typename(m['declaringType'])]
names = {
    'Torappu.Battle.Character.MoveLikeRespawnSelf',
    'Torappu.Battle.Character.MoveLikeRespawnExternal',
    'Torappu.Battle.Character._MoveLikeRespawn',
    'Torappu.Battle.Character.ConstructStateMachine',
    'Torappu.Battle.Character/States.ConstructStateMachine',
}
selected = [m for m in methods if m['fullname'] in names]
result = {'selectedMethods': selected, 'stateMethods': [m for m in methods if
    m['fullname'].startswith('Torappu.Battle.Character/States')], 'bodies': []}
for m in selected:
    start = m['address']
    limit = n.addresses[bisect.bisect_right(n.addresses, start)]
    first = n.disassemble(m['index'])
    pending = [first]
    seen = {start}
    while pending:
        body = pending.pop()
        result['bodies'].append(dict(selector=m['fullname'], **body))
        targets = [int(i['target'], 16) for i in body['instructions'] if i.get('targetOutsideRange')]
        if body['fullyDecoded'] and body['instructions'][-1]['mnemonic'] not in ('ret', 'jmp', 'int3'):
            targets.append(int(body['end'], 16))
        for target in targets:
            if start <= target < limit and target not in seen:
                seen.add(target)
                pending.append(n.disassemble_at(target))
result['finishMethod'] = next(m for m in methods if
    m['fullname'] == 'Torappu.Battle.Character.FinishMe')
for body in result['bodies']:
    aliases = body.get('aliases', [])
    if len(aliases) > 8:
        kept = [a for a in aliases if 'Torappu.Battle.Character' in str(a)]
        body['omittedSharedAliasCount'] = len(aliases) - len(kept)
        body['aliases'] = kept
    for instruction in body['instructions']:
        aliases = instruction.get('methods', [])
        if len(aliases) > 8:
            kept = [a for a in aliases if a.startswith('Torappu.Battle.Character/States')]
            instruction['omittedSharedAliasCount'] = len(aliases) - len(kept)
            instruction['methods'] = kept
result['projectionNote'] = (
    'Complete selected instruction bodies retained; unrelated shared-address aliases omitted. '
    'Aliases do not establish the runtime callee.'
)
provenance = n.provenance()
provenance['extractionScript'] = fingerprint(Path(__file__))
provenance['collectedOn'] = '2026-10-31'
args.out.parent.mkdir(parents=True, exist_ok=True)
args.out.write_text(json.dumps(dict(provenance=provenance, result=result), ensure_ascii=False, indent=2) + '\n')
