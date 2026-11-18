#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Archive native push dispatch and its immediate arguments from the local client."""

import argparse
import bisect
import json
from pathlib import Path
import sys

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path.cwd() / '.agents/skills/arkbattle-native-research/scripts'))
from native import DEFAULT_GAME, Native, fingerprint


METHODS = {
    'Torappu.Battle.Ability.GetActiveBuffs',
    'Torappu.Battle.Abilities.AbstractAnimatedAbility.GetActiveBuffs',
    'Torappu.Battle.Abilities.RangedAttack.OnCastOnTarget',
    'Torappu.Battle.Abilities.RangedAttack.CreateProjectile',
    'Torappu.Battle.BattleController.CreateProjectile',
    'Torappu.Battle.Projectile.Init',
    'Torappu.Battle.Projectile.RegisterBuffs',
    'Torappu.Battle.Projectile/ActionController.Init',
    'Torappu.Battle.Projectile/ActionController.RegisterBuffs',
    'Torappu.Battle.Projectile/ActionController.InitFromProjectile',
    'Torappu.Battle.Projectile/ActionController.OnHitTarget',
    'Torappu.Battle.Projectile/ActionController._AttachBuffs',
    'Torappu.Battle.Buff.OnStart',
    'Torappu.Battle.Buff.Reset',
    'Torappu.Battle.Buff/BuffContainer.NewBuff',
    'Torappu.Battle.Buff._RunActions',
    'Torappu.Battle.Buff._RunActionsCore',
    'Torappu.Battle.Entity.AddBuff',
    'Torappu.Battle.Action.Nodes.GetActionTarget',
    'Torappu.Battle.Action.Nodes/Knockback.Execute',
    'Torappu.Battle.Entity.get_baseForceLevel',
    'Torappu.Battle.Enemy.get_massLevel',
    'Torappu.Battle.Enemy.KnockBack',
    'Torappu.Battle.Enemy/States/Blackboard.UpdateUnbalanceProtectTime',
    'Torappu.Battle.MapUtil.ParseDirection',
    'Torappu.MathUtil.IsZero',
    'Torappu.MathUtil.LE',
    'Torappu.MathUtil.NormalizeDirectionSafely',
}
OWNERS = {
    'Torappu.Battle.Action.Nodes/Knockback',
    'Torappu.Battle.Abilities.AbstractAnimatedAbility',
    'Torappu.Battle.Abilities.RangedAttack',
    'Torappu.Battle.BattleOptions',
    'Torappu.Battle.Buff/Event',
    'Torappu.Battle.Context/Snapshot',
    'Torappu.Battle.Enemy/States/Blackboard',
    'Torappu.Battle.Projectile/ActionController',
    'UnityEngine.ForceMode2D',
}
FLOAT_LITERALS = {
    'TOO_CLOSE_TOLERANCE_SQR': 0x1870afe58,
    'MathUtil and NormalizeDirectionSafely epsilon': 0x1870add88,
    'Impulse multiplier': 0x1870afe54,
    'Unbalance protection seconds and speed threshold': 0x1870aded8,
}
STRING_LITERALS = {'GetIntOrDefault key': 0x188bec840}
TYPE_SLOTS = {
    'Motion multiplier declaring type': 0x188b1b070,
    'Knockback target cast': 0x188b851c0,
    'Normalized zero vector declaring type': 0x188b9e900,
}


def extract_body(native, method):
    cursor = method['address']
    end = native.addresses[bisect.bisect_right(native.addresses, cursor)]
    parts = []
    while cursor < end:
        part = native.disassemble_at(cursor, end - cursor)
        for ins in part['instructions']:
            if len(ins.get('methods', [])) > 30:
                ins['methodAliasCount'] = len(ins.pop('methods'))
        parts.append(part)
        next_cursor = int(part['end'], 16)
        assert next_cursor > cursor
        cursor = next_cursor
    return {'method': method, 'logicalEnd': hex(end), 'fragments': parts}


def resolve_string(native, slot):
    encoded = native.pe.unpack('<Q', slot)[0]
    assert encoded >> 29 == 5 and encoded & 1, hex(encoded)
    index = (encoded & 0x1ffffffe) >> 1
    entry = native.records(0, '<II', 'length dataIndex')[index]
    base, _ = native.table(1)
    start = base + entry['dataIndex']
    value = native.metadata[start:start + entry['length']].decode('utf-8')
    return {'slot': hex(slot), 'encodedUsage': hex(encoded), 'index': index, 'value': value}


def resolve_type(native, slot):
    encoded = native.pe.unpack('<Q', slot)[0]
    assert encoded >> 29 == 1 and encoded & 1, hex(encoded)
    index = (encoded & 0x1ffffffe) >> 1
    return {'slot': hex(slot), 'encodedUsage': hex(encoded), 'index': index, 'name': native.type_name(index)}


def enum_values(native, fields):
    defaults = {entry['fieldIndex']: entry['dataIndex']
                for entry in native.records(7, '<iii', 'fieldIndex typeIndex dataIndex')}
    base, _ = native.table(8)
    values = {}
    for field in fields:
        if field['index'] not in defaults:
            continue
        address = base + defaults[field['index']]
        encoded = native.metadata[address]
        assert encoded < 0x80
        values[field['name']] = {'encodedByte': f'{encoded:02x}', 'value': (encoded >> 1) ^ -(encoded & 1)}
    return values


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--game', type=Path, default=DEFAULT_GAME)
    parser.add_argument('--out', type=Path, default=Path(__file__).with_name('native-push.json'))
    args = parser.parse_args()
    native = Native(args.game)
    methods = [native.method(m['index']) for m in native.methods
               if native.typename(m['declaringType']) + '.' + native.string(m['nameIndex']) in METHODS]
    assert {m['fullname'] for m in methods} == METHODS
    fields = {native.typename(t['index']): native.fields(t['index']) for t in native.types
              if native.typename(t['index']) in OWNERS}
    literals = {name: {'address': hex(address), 'bytes': native.pe.read(address, 4).hex(),
                       'value': native.pe.unpack('<f', address)[0]}
                for name, address in FLOAT_LITERALS.items()}
    strings = {name: resolve_string(native, address) for name, address in STRING_LITERALS.items()}
    type_slots = {name: resolve_type(native, address) for name, address in TYPE_SLOTS.items()}
    enum_fields = {
        'UnityEngine.ForceMode2D': fields['UnityEngine.ForceMode2D'],
        'Torappu.Battle.Buff/Event': [field for field in fields['Torappu.Battle.Buff/Event']
                                     if field['name'] == 'ON_BUFF_START'],
    }
    result = {'bodies': [extract_body(native, m) for m in methods if m['addressStatus'] == 'file-backed'],
              'methodsWithoutBody': [m for m in methods if m['addressStatus'] != 'file-backed'],
              'fieldOwners': fields,
              'floatLiterals': literals, 'stringLiterals': strings, 'typeSlots': type_slots,
              'enumValues': {name: enum_values(native, enum) for name, enum in enum_fields.items()}}
    provenance = native.provenance() | {'caseScript': fingerprint(Path(__file__))}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps({'provenance': provenance, 'result': result}, ensure_ascii=False,
                                   indent=2) + '\n')


if __name__ == '__main__':
    main()
