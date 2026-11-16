#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Trace the actual Tulip S1 empty fallback's parent/sub-ability notifications."""
import argparse
import bisect
import hashlib
import json
import sys
from pathlib import Path

import capstone

ROOT = next(p for p in Path(__file__).resolve().parents if (p / '.agents/skills/arkbattle-native-research/scripts/native.py').exists())
sys.dont_write_bytecode = True
sys.path.insert(0, str(ROOT / '.agents/skills/arkbattle-native-research/scripts'))
from native import DEFAULT_GAME, Native, fingerprint

OWNERS = [
    'Torappu.Battle.Ability',
    'Torappu.Battle.Ability/Options',
    'Torappu.Battle.AbilityStandard',
    'Torappu.Battle.Abilities.EasyToStartAbility',
    'Torappu.Battle.Abilities.AbstractAnimatedAbility',
    'Torappu.Battle.Abilities.EmptyAnimatedAbility',
    'Torappu.Battle.Abilities.MultiMeleeAttack',
    'Torappu.Battle.Abilities.MeleeAttack',
    'Torappu.Battle.Abilities.AbstractBasicAttack',
    'Torappu.Battle.Abilities.AbilityFirstSucceedGroup',
    'Torappu.Battle.BasicSkill',
    'Torappu.Battle.CastSkill',
]
METHODS = [
    'Torappu.Battle.Abilities.AbilityFirstSucceedGroup.CastToTarget',
    'Torappu.Battle.Abilities.AbilityFirstSucceedGroup.CastDirectly',
    'Torappu.Battle.Abilities.AbilityFirstSucceedGroup._OnSubAbilityCasted',
    'Torappu.Battle.Abilities.AbilityFirstSucceedGroup.OnWaitForPreDelay',
    'Torappu.Battle.Abilities.AbilityFirstSucceedGroup.OnWaitForPostDelay',
    'Torappu.Battle.Abilities.AbilityFirstSucceedGroup.DoAttach',
    'Torappu.Battle.Abilities.AbilityFirstSucceedGroup..ctor',
    'Torappu.Battle.Abilities.AbilityFirstSucceedGroup.get_selectTargetSource',
    'Torappu.Battle.Abilities.AbilityFirstSucceedGroup.DoSetData',
    'Torappu.Battle.Abilities.AbilityFirstSucceedGroup._OnSubAbilityFinished',
    'Torappu.Battle.Abilities.AbilityFirstSucceedGroup.OnCastEnd',
    'Torappu.Battle.Ability.StartCastingInternal',
    'Torappu.Battle.Ability.SetData',
    'Torappu.Battle.Ability.DoSetData',
    'Torappu.Battle.Ability.ModifyOptions',
    'Torappu.Battle.Ability.OnCastStart',
    'Torappu.Battle.Ability.get_ignorePalsyInterrupt',
    'Torappu.Battle.Ability.get_isReady',
    'Torappu.Battle.AbilityStandard.CastToTarget',
    'Torappu.Battle.AbilityStandard.CastDirectly',
    'Torappu.Battle.AbilityStandard.get_allowNoTarget',
    'Torappu.Battle.AbilityStandard._DoCast',
    'Torappu.Battle.AbilityStandard.OnTick',
    'Torappu.Battle.AbilityStandard.OnCastStart',
    'Torappu.Battle.AbilityStandard.OnAttached',
    'Torappu.Battle.AbilityStandard.ExecuteSpell',
    'Torappu.Battle.Abilities.AbstractAnimatedAbility.get_ignorePalsyInterrupt',
    'Torappu.Battle.Abilities.AbstractAnimatedAbility.OnCastStart',
    'Torappu.Battle.Abilities.EmptyAnimatedAbility.get_ignorePalsyInterrupt',
    'Torappu.Battle.BasicSkill.AssignData',
    'Torappu.Battle.BasicSkill.get_familyGroup',
    'Torappu.Battle.BasicSkill.IsAvailable',
    'Torappu.Battle.BasicSkill.IsOpTriggerable',
    'Torappu.Battle.BasicSkill.IsClickable',
    'Torappu.Battle.BasicSkill.IsTriggerable',
    'Torappu.Battle.BasicSkill.CanTriggerWithReason',
    'Torappu.Battle.BasicSkill.CanCastCheckBeforeStart',
    'Torappu.Battle.BasicSkill.OnInit',
    'Torappu.Battle.BasicSkill.OnSkillStart',
    'Torappu.Battle.Character.OnSkillStart',
    'Torappu.Battle.Buff/BuffContainer.OnSkillStart',
    'Torappu.Battle.Buff.OnSkillStart',
    'Torappu.Battle.CastSkill.OnInit',
    'Torappu.Battle.CastSkill.DoCast',
    'Torappu.Battle.CastSkill.IsAvailable',
    'Torappu.Battle.CastSkill.CanTriggerWithReason',
    'Torappu.Battle.CastSkill.get_canCastCheck',
    'Torappu.Battle.CastSkill.CanCastCheckBeforeStart',
    'Torappu.Battle.CastSkill.UseSkill',
    'Torappu.Battle.Character/States/SkillState.OnTick',
    'Torappu.Battle.Character/States/SkillState._StartSkill',
    'Torappu.Battle.Character/States/SkillState._DoStartSkill',
]


def full_body(n, method):
    start = method['address']
    end = n.addresses[bisect.bisect_right(n.addresses, start)]
    raw = n.pe.read(start, end - start)
    cs = capstone.Cs(capstone.CS_ARCH_X86, capstone.CS_MODE_64)
    cs.detail = True
    instructions = []
    for ins in cs.disasm(raw, start):
        row = {'address': hex(ins.address), 'bytes': ins.bytes.hex(), 'mnemonic': ins.mnemonic, 'operands': ins.op_str}
        if (ins.mnemonic == 'call' or ins.group(capstone.CS_GRP_JUMP)) and ins.operands and ins.operands[0].type == capstone.x86.X86_OP_IMM:
            target = ins.operands[0].imm
            row['target'] = hex(target)
            row['targetOutsideRange'] = not start <= target < end
            aliases = [n.method(i)['fullname'] for i in n.address_methods.get(target, [])]
            if len(aliases) <= 20:
                row['methods'] = aliases
            else:
                row['aliasCount'] = len(aliases)
                row['aliasesSha256'] = hashlib.sha256(json.dumps(aliases).encode()).hexdigest()
        for op in ins.operands:
            if op.type == capstone.x86.X86_OP_MEM and op.mem.base == capstone.x86.X86_REG_RIP:
                row.setdefault('ripReferences', []).append(hex(ins.address + ins.size + op.mem.disp))
        instructions.append(row)
    decoded = int(instructions[-1]['address'], 16) + len(bytes.fromhex(instructions[-1]['bytes'])) if instructions else start
    return {'method': method, 'address': hex(start), 'end': hex(end),
            'boundary': 'Next higher known native method entry; includes split pdata fallthrough blocks. Nonlocal targets and virtual calls require separate resolution.',
            'fullyDecoded': decoded == end, 'bytesSha256': hashlib.sha256(raw).hexdigest(), 'instructions': instructions}


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--game', type=Path, default=DEFAULT_GAME)
    p.add_argument('--out', type=Path, required=True)
    p.add_argument('--method', action='append', default=[])
    a = p.parse_args()
    n = Native(a.game)
    owner_names = OWNERS + [n.typename(t['index']) for t in n.types if n.typename(t['index']).startswith('Torappu.Battle.AbilityStandard/<_DoCast>')]
    owners = []
    for name in owner_names:
        t = next(t for t in n.types if n.typename(t['index']) == name)
        owners.append({'index': t['index'], 'fullname': name,
                       'parent': n.type_name(t['parentIndex']) if t['parentIndex'] >= 0 else None,
                       'fields': n.fields(t['index']),
                       'methods': [n.method(i) for i in range(t['methodStart'], t['methodStart'] + t['methodCount'])]})
    dynamic_methods = [m['fullname'] for t in owners for m in t['methods'] if m['address'] and (
                       (t['fullname'].startswith('Torappu.Battle.AbilityStandard/<_DoCast>') and m['fullname'].endswith('.MoveNext'))
                       or (t['fullname'] == 'Torappu.Battle.Abilities.EasyToStartAbility' and '__' not in m['fullname'] and '<>' not in m['fullname']))]
    names = METHODS + dynamic_methods + a.method
    methods = []
    for name in names:
        matches = [raw['index'] for raw in n.methods if n.typename(raw['declaringType']) + '.' + n.string(raw['nameIndex']) == name]
        if len(matches) != 1:
            raise ValueError((name, matches))
        methods.append(n.method(matches[0]))
    bodies = [full_body(n, m) for m in methods]
    result = {'selection': {'owners': owner_names, 'methods': names}, 'owners': owners, 'bodies': bodies}
    provenance = n.provenance() | {'checkedOn': '2026-11-17', 'caseTool': {'script': fingerprint(Path(__file__))}}
    a.out.parent.mkdir(parents=True, exist_ok=True)
    a.out.write_text(json.dumps({'provenance': provenance, 'result': result}, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'owners': len(owners), 'methods': len(bodies), 'fullyDecoded': all(b['fullyDecoded'] for b in bodies), 'out': str(a.out)}, ensure_ascii=False))


if __name__ == '__main__':
    main()
