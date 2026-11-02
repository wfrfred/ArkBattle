#!/usr/bin/env python3
"""Bind selected serialized Buff events to current-client native methods."""
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
import argparse
import datetime
import json
from pathlib import Path
import sys

sys.dont_write_bytecode = True
TOOLS = Path.cwd() / '.agents/skills/arkbattle-native-research/scripts'
sys.path.insert(0, str(TOOLS))
from native import Native, fingerprint


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--game', type=Path, required=True)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)
    native = Native(args.game)
    provenance = native.provenance()
    provenance.update(collectedOn=datetime.date.today().isoformat(), extractionScript=fingerprint(Path(__file__)))
    def save(name, result):
        (args.out / name).write_text(json.dumps(dict(provenance=provenance, result=result), ensure_ascii=False, indent=2) + '\n')
    all_methods = []
    for entry in native.methods:
        owner = native.typename(entry['declaringType'])
        name = native.string(entry['nameIndex'])
        if (owner == 'Torappu.Battle.Buff' and name in ['OnStart', 'OnTrigger', 'OnBeforeTargetApplyModifier', 'OnAfterOutputDamage']
            or owner == 'Torappu.Battle.Projectile/ActionController' and name in ['Init', '_AttachBuffs']
            or owner in ['Torappu.Battle.Ability', 'Torappu.Battle.Abilities.AbstractAnimatedAbility'] and name == 'GetActiveBuffs'):
            all_methods.append(native.method(entry['index']))
    save('method-selectors.json', all_methods)
    bodies = []
    event_bindings = []
    for entry in all_methods:
        name = entry['fullname']
        if name not in ['Torappu.Battle.Buff.OnStart', 'Torappu.Battle.Buff.OnTrigger', 'Torappu.Battle.Buff.OnBeforeTargetApplyModifier', 'Torappu.Battle.Buff.OnAfterOutputDamage']:
            continue
        if name.startswith('Torappu.Battle.Buff.On') and not name.endswith('.OnTick'):
            body = native.disassemble(entry['index'])
            matched = []
            for position, instruction in enumerate(body['instructions']):
                if 'Torappu.Battle.Buff._RunActions' not in instruction.get('methods', []):
                    continue
                preceding = body['instructions'][max(0, position - 18):position]
                events = [row['operands'] for row in preceding if row['mnemonic'] in ['mov', 'xor'] and row['operands'].startswith('r8d, ')]
                if any(value in ['r8d, r8d', 'r8d, 2', 'r8d, 0x15', 'r8d, 0x3d'] for value in events):
                    matched.append(dict(call=instruction['address'], preceding=preceding, events=events))
            if matched or name in ['Torappu.Battle.Buff.OnStart', 'Torappu.Battle.Buff.OnTrigger']:
                event_bindings.append(dict(method=entry, matches=matched))
                bodies.append(body)
                print('EVENT', entry['index'], name, [m['events'] for m in matched], flush=True)
    save('event-bindings.json', event_bindings)
    save('event-bodies.json', bodies)
    controllers = []
    for entry in all_methods:
        if entry['fullname'] not in ['Torappu.Battle.Projectile/ActionController.Init', 'Torappu.Battle.Projectile/ActionController._AttachBuffs']:
            continue
        address = entry['address']
        end = min(value for value in native.addresses if value > address)
        parts = []
        while address < end:
            part = native.disassemble_at(address, max_bytes=end - address)
            parts.append(part)
            following = int(part['end'], 16)
            assert following > address
            address = following
        controllers.append(dict(method=entry, followingMethodAddress=hex(end), parts=parts))
        print('CONTROLLER', entry['index'], entry['fullname'], len(parts), flush=True)
    save('projectile-active-buffs.json', dict(methods=controllers,
        fields=[dict(type=native.typename(entry['index']), fields=native.fields(entry['index']))
                for entry in native.types if native.typename(entry['index']) == 'Torappu.Battle.Projectile/ActionController']))
    accessors = []
    for entry in native.methods:
        owner = native.typename(entry['declaringType'])
        if entry['slot'] == 47 and owner in ['Torappu.Battle.Ability', 'Torappu.Battle.Abilities.AbstractAnimatedAbility']:
            method = native.method(entry['index'])
            print('SLOT47', method['index'], method['fullname'], flush=True)
            parts = []
            if method['address']:
                address = method['address']
                end = min(value for value in native.addresses if value > address)
                while address < end:
                    part = native.disassemble_at(address, max_bytes=end - address)
                    parts.append(part)
                    following = int(part['end'], 16)
                    assert following > address
                    address = following
            accessors.append(dict(method=method, parts=parts,
                                  fields=native.fields(entry['declaringType'])))
    save('ability-active-buffs.json', accessors)
    chain = []
    names = {native.typename(entry['index']): entry for entry in native.types}
    current = names['Torappu.Battle.Abilities.RangedAttack']
    while True:
        parent = native.type_name(current['parentIndex'])
        chain.append(dict(index=current['index'], name=native.typename(current['index']),
                          byvalTypeIndex=current['byvalTypeIndex'], parentIndex=current['parentIndex'], parent=parent,
                          declaredActiveBuffAccessors=[native.method(index) for index in range(current['methodStart'], current['methodStart'] + current['methodCount'])
                                                     if native.methods[index]['slot'] == 47]))
        if parent == 'Torappu.Battle.Ability':
            break
        current = names[parent]
    save('ability-type-chain.json', chain)


if __name__ == '__main__':
    main()
