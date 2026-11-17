#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Selected ordinary-native Fever sustain and ammo-counter paths; no client execution."""
import argparse
import bisect
import hashlib
import json
import sys
from pathlib import Path

import capstone

ROOT = next(p for p in Path(__file__).resolve().parents
            if (p / '.agents/skills/arkbattle-native-research/scripts/native.py').exists())
sys.dont_write_bytecode = True
sys.path.insert(0, str(ROOT / '.agents/skills/arkbattle-native-research/scripts'))
from native import DEFAULT_GAME, Native, fingerprint

OWNERS = [
    'Torappu.Battle.FeverBehaviour',
    'Torappu.Battle.FeverCommonBehaviour',
    'Torappu.Battle.BasicSkill',
    'Torappu.Battle.CastSkill',
    'Torappu.Battle.CastSkillWithLimitTimes',
    'Torappu.Battle.AbilityStandard',
    'Torappu.Battle.Ability',
    'Torappu.Battle.Abilities.AbilityEventCounter',
]
METHODS = [
    'Torappu.Battle.FeverBehaviour._JoinFeverDuringSkill',
    'Torappu.Battle.FeverBehaviour._JoinFever',
    'Torappu.Battle.FeverBehaviour._LeaveFever',
    'Torappu.Battle.FeverBehaviour._CheckJoinFeverOrTickUseSkill',
    'Torappu.Battle.FeverBehaviour.UseSkillByFeverLogic',
    'Torappu.Battle.FeverCommonBehaviour.get_isDirectlyJoinFeverTypeSkill',
    'Torappu.Battle.FeverCommonBehaviour.OnBeforeJoinFever',
    'Torappu.Battle.FeverCommonBehaviour.OnAfterJoinFever',
    'Torappu.Battle.FeverCommonBehaviour.OnBeforeLeaveFever',
    'Torappu.Battle.FeverCommonBehaviour.OnAfterLeaveFever',
    'Torappu.Battle.FeverCommonBehaviour._RecoverSpCost',
    'Torappu.Battle.FeverCommonBehaviour._RevertRecoverSpCost',
    'Torappu.Battle.FeverCommonBehaviour.OnTick',
    'Torappu.Battle.FeverCommonBehaviour.OnCastSucceed',
    'Torappu.Battle.FeverCommonBehaviour.AssignData',
    'Torappu.Battle.FeverCommonBehaviour.get_feverTime',
    'Torappu.Battle.CastSkillWithLimitTimes._FetchCounterSource',
    'Torappu.Battle.CastSkillWithLimitTimes.OnTick',
    'Torappu.Battle.CastSkillWithLimitTimes.SetMaxAdditionCount',
    'Torappu.Battle.CastSkillWithLimitTimes.SetMaxAdditionCountPercent',
    'Torappu.Battle.CastSkillWithLimitTimes.IsDiscardable',
    'Torappu.Battle.BasicSkill.IsRetriggerAvailable',
    'Torappu.Battle.BasicSkill.isRetriggerable',
    'Torappu.Battle.BasicSkill.IsDiscardable',
]


def body(n, method):
    start = method['address']
    end = n.addresses[bisect.bisect_right(n.addresses, start)]
    raw = n.pe.read(start, end - start)
    cs = capstone.Cs(capstone.CS_ARCH_X86, capstone.CS_MODE_64)
    cs.detail = True
    instructions = []
    for ins in cs.disasm(raw, start):
        row = {'address': hex(ins.address), 'bytes': ins.bytes.hex(),
               'mnemonic': ins.mnemonic, 'operands': ins.op_str}
        if ((ins.mnemonic == 'call' or ins.group(capstone.CS_GRP_JUMP))
                and ins.operands and ins.operands[0].type == capstone.x86.X86_OP_IMM):
            target = ins.operands[0].imm
            row['target'] = hex(target)
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
    decoded = int(instructions[-1]['address'], 16) + len(bytes.fromhex(instructions[-1]['bytes']))
    return {'method': method, 'address': hex(start), 'end': hex(end),
            'boundary': 'Next greater native method entry; virtual/delegate callees are separate.',
            'fullyDecoded': decoded == end,
            'bytesSha256': hashlib.sha256(raw).hexdigest(), 'instructions': instructions}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--game', type=Path, default=DEFAULT_GAME)
    parser.add_argument('--out', type=Path, default=Path(__file__).with_name('native.json'))
    parser.add_argument('--method', action='append')
    args = parser.parse_args()
    n = Native(args.game)
    by_name = {}
    for method in n.methods:
        name = n.typename(method['declaringType']) + '.' + n.string(method['nameIndex'])
        by_name.setdefault(name, []).append(method['index'])
    methods = []
    for name in args.method or METHODS:
        indices = by_name.get(name, [])
        if len(indices) != 1:
            raise ValueError((name, indices))
        methods.append(body(n, n.method(indices[0])))
    provenance = n.provenance()
    provenance['extractor'] = fingerprint(Path(__file__))
    owners = []
    for name in OWNERS:
        owner = next(t for t in n.types if n.typename(t['index']) == name)
        owners.append({'index': owner['index'], 'fullname': name,
                       'fields': n.fields(owner['index']),
                       'methods': [n.method(i) for i in range(owner['methodStart'],
                                   owner['methodStart'] + owner['methodCount'])]})
    result = {'scope': 'Selected Fever ordinary-native paths, not runtime/XLua observation.',
              'owners': owners, 'methods': methods}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps({'provenance': provenance, 'result': result},
                                   ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'methods': len(methods), 'complete': all(x['fullyDecoded'] for x in methods)}))


if __name__ == '__main__':
    main()
