#!/usr/bin/env python3
"""Select the finite DEFAULT stock return of Blood's Whisper."""
import argparse
import json
from pathlib import Path
import sys

sys.dont_write_bytecode = True
root = Path.cwd()
sys.path.insert(0, str(root / 'docs/research/evidence/special-redeploy-failure-20261122'))
from extract_prefab import (
    DEFAULT_GAME, GAME_DATA_REVISION, SCRIPTS, bundle, decode, fingerprint,
    read_bindings, script, serialized, trees, unpack_bundle,
)

arg = argparse.ArgumentParser(description=__doc__)
arg.add_argument('--game', type=Path, default=DEFAULT_GAME)
arg.add_argument('--out', type=Path, required=True)
args = arg.parse_args()
assets = args.game / 'Arknights_Data/StreamingAssets/AB/Windows'
prefab = assets / 'pkgrps/btl_pfb_tokens_0.ab'
scripts_bundle = assets / SCRIPTS
file = 'CAB-f68700761ef4b9b267b0af89309727d6'
assert fingerprint(prefab)['sha256'] == 'adcf77f260748418d57e08d2539993232de53053bf4a5ec2292ff9a4c7865f1d'
scripts = {
    (name, row['id']): script(row, data)
    for name, data in bundle(scripts_bundle)[0]
    if not name.endswith(('.resS', '.resource'))
    for row in serialized(data)['objects'] if row['classid'] == 115
}
selection = read_bindings(prefab, file, [
    ('Token', 9056605678497710654, ('_cardPolicy', '_isInfinity', '_rechargeOnlyOnce', '_commonAbilities')),
    ('PassiveBuffAbility', -6541251740818587074, ('_buffs',)),
], scripts)
token = selection['components']['Token']
ability = selection['components']['PassiveBuffAbility']
buff = ability['fields']['_buffs']['Array'][0]
assert token['gameObject']['name'] == 'token_10054_phatm2_encdool'
assert token['enabled'] and token['fields']['_cardPolicy'] == 0
assert not token['fields']['_isInfinity'] and not token['fields']['_rechargeOnlyOnce']
assert ability['enabled'] and buff['templateKey'] == 'charge_token[finish]'
assert {'m_FileID': 0, 'm_PathID': int(ability['pathId'])} in token['fields']['_commonAbilities']['Array']

data = unpack_bundle(prefab, file)
layout, _ = trees(data)
transforms = {}
for obj in serialized(data)['objects']:
    if obj['classid'] == 4:
        value = decode(data[obj['start']:obj['start'] + obj['size']], layout[obj['typeid']])
        transforms[obj['id']] = (value['common:374']['m_PathID'], value['m_Father']['m_PathID'])
owners = {pair[0]: path for path, pair in transforms.items()}
hierarchy = []
transform = owners[int(ability['gameObject']['pathId'])]
while transform in transforms:
    owner, parent = transforms[transform]
    hierarchy.append({'transformPathId': str(transform), 'gameObjectPathId': str(owner)})
    transform = parent
assert any(row['gameObjectPathId'] == token['gameObject']['pathId'] for row in hierarchy)
config = root / 'assets/arknights-game-data/zh_CN/gamedata/battle/buff_template_data.json'
template = json.loads(config.read_bytes())[buff['templateKey']]['eventToActions']['ON_OWNER_FINISH']
assert template == [{
    '$type': 'Torappu.Battle.Action.Nodes+RechargeToken, Assembly-CSharp',
    '_cntKey': 'cnt', '_rechargeTiming': 'ON_FINISH', '_refreshRemainingCnt': False,
}]

result = dict(
    provenance=dict(prefab=fingerprint(prefab), scriptBundle=fingerprint(scripts_bundle),
                    config=fingerprint(config), configRevision=GAME_DATA_REVISION,
                    decoder='special-redeploy-failure-20261122/extract_prefab.py'),
    result=dict(prefab=selection, hierarchy=hierarchy, ownerFinish=template),
)
args.out.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
