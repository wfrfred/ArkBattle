#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Native consumers of the selected activation-variation configurations."""
import argparse
import importlib.util
import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True
ROOT = next(p for p in Path(__file__).resolve().parents
            if (p / '.agents/skills/arkbattle-native-research/scripts/native.py').exists())
HELPER = ROOT / 'docs/research/evidence/skill-audit-20261117/sustain/extract.py'
spec = importlib.util.spec_from_file_location('skill_native_body_reader', HELPER)
helper = importlib.util.module_from_spec(spec)
spec.loader.exec_module(helper)
OWNERS = ['Torappu.Battle.Abilities.ActiveOneOfBuffAbility', 'Torappu.Battle.Abilities.ActiveBuffAbility',
          'Torappu.Battle.CastSkill', 'Torappu.Battle.BasicSkill',
          'Torappu.Battle.Skills.BuffDuringSkill', 'Torappu.Battle.Action.Nodes/TriggerSkill',
          'Torappu.Battle.Action.Nodes/ModifyAbilityBlackboard',
          'Torappu.Battle.Action.Nodes/FilterSkillTriggerdCnt',
          'Torappu.Battle.Abilities.AbilityEventCounter', 'Torappu.Battle.CastSkillWithLimitTimes']
METHODS = ['Torappu.Battle.Abilities.ActiveBuffAbility.SetLifeTime',
           'Torappu.Battle.Abilities.ActiveBuffAbility.OnSpellStart',
           'Torappu.Battle.Abilities.ActiveBuffAbility.DoOnSpellStart',
           'Torappu.Battle.CastSkill.IsAvailable',
           'Torappu.Battle.CastSkill.CanTriggerWithReason',
           'Torappu.Battle.Action.Nodes/TriggerSkill.Execute',
           'Torappu.Battle.Action.Nodes/ModifyAbilityBlackboard.Execute',
           'Torappu.Battle.Action.Nodes/FilterSkillTriggerdCnt.Execute',
           'Torappu.Battle.Character.RemoteTrigSkill',
           'Torappu.Battle.Abilities.AbilityEventCounter.SetData',
           'Torappu.Battle.Abilities.AbilityEventCounter.get_originalMaxCount',
           'Torappu.Battle.Abilities.AbilityEventCounter.SetMaxAdditionCount',
           'Torappu.Battle.CastSkillWithLimitTimes._FetchCounterSource',
           'Torappu.Battle.CastSkillWithLimitTimes._UpdateMaxAdditionCount']


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--game', type=Path, default=helper.DEFAULT_GAME)
    p.add_argument('--out', type=Path, default=Path(__file__).with_name('native.json'))
    a = p.parse_args()
    n = helper.Native(a.game)
    by_name = {}
    for method in n.methods:
        name = n.typename(method['declaringType']) + '.' + n.string(method['nameIndex'])
        by_name.setdefault(name, []).append(method['index'])
    owners = []
    for name in OWNERS:
        owner = next((t for t in n.types if n.typename(t['index']) == name), None)
        if owner is None:
            print('Missing owner:', name, file=sys.stderr)
            continue
        owners.append(dict(index=owner['index'], fullname=name,
            parent=n.type_name(owner['parentIndex']) if owner['parentIndex'] >= 0 else None,
            fields=n.fields(owner['index']),
            methods=[n.method(i) for i in range(owner['methodStart'], owner['methodStart'] + owner['methodCount'])]))
    names = list(METHODS)
    for t in owners:
        if t['fullname'].endswith(('ActiveOneOfBuffAbility', 'BuffDuringSkill')):
            names.extend(m['fullname'] for m in t['methods']
                         if m['address'] and '__Hotfix' not in m['fullname'] and '<>' not in m['fullname'])
    bodies = []
    for name in names:
        indices = by_name.get(name, [])
        if len(indices) != 1:
            raise ValueError(('Missing or ambiguous method', name, indices))
        bodies.append(helper.body(n, n.method(indices[0])))
    output = dict(provenance=n.provenance() | dict(extractor=helper.fingerprint(Path(__file__)),
        bodyReader=helper.fingerprint(HELPER)), result=dict(selection=names, owners=owners, bodies=bodies))
    a.out.parent.mkdir(parents=True, exist_ok=True)
    a.out.write_text(json.dumps(output,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(dict(owners=len(owners), methods=len(bodies), complete=all(x['fullyDecoded'] for x in bodies))))


if __name__ == '__main__':
    main()
