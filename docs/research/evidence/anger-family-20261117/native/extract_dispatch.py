#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Bounded attachment/casting closure for the three selected Ability objects."""
import argparse
import bisect
import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path.cwd() / '.agents/skills/arkbattle-native-research/scripts'))
from native import Native, DEFAULT_GAME, fingerprint

BODIES = {
    'Torappu.Battle.AbilityStandard.DoSetData',
    'Torappu.Battle.AbilityStandard.CastDirectly',
    'Torappu.Battle.AbilityStandard.OnAttached',
    'Torappu.Battle.AppearTalent.DoAttach',
}
OWNERS = {'Torappu.Battle.AbilityStandard', 'Torappu.Battle.AppearTalent',
          'Torappu.Battle.Abilities.PassiveBuffAbility',
          'Torappu.Battle.Abilities.GloballUniqueBuffAbility'}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    native = Native(DEFAULT_GAME)
    bodies, methods, types = [], [], []
    for owner in native.types:
        fullname = native.typename(owner['index'])
        if fullname in OWNERS:
            own_methods = [native.method(i) for i in range(owner['methodStart'], owner['methodStart'] + owner['methodCount'])]
            types.append({'type': owner, 'fullname': fullname,
                          'parent': native.type_name(owner['parentIndex']),
                          'fields': native.fields(owner['index']), 'methods': own_methods})
        for index in range(owner['methodStart'], owner['methodStart'] + owner['methodCount']):
            fullname_method = fullname + '.' + native.string(native.methods[index]['nameIndex'])
            if fullname_method not in BODIES:
                continue
            method = native.method(index)
            methods.append(method)
            cursor = method['address']
            end = native.addresses[bisect.bisect_right(native.addresses, cursor)]
            parts = []
            while cursor < end:
                part = native.disassemble_at(cursor, end - cursor, method=method if cursor == method['address'] else None)
                for instruction in part['instructions']:
                    if len(instruction.get('methods', [])) > 100:
                        instruction['methodAliasCount'] = len(instruction.pop('methods'))
                parts.append(part)
                advanced = int(part['end'], 16)
                if advanced <= cursor:
                    raise RuntimeError('non-progress')
                cursor = advanced
            bodies.append({'methodIndex': index, 'fullname': fullname_method, 'logicalEnd': hex(end), 'fragments': parts})
    provenance = native.provenance()
    provenance['caseTool'] = {'script': fingerprint(Path(__file__))}
    result = {'selection': {'bodies': sorted(BODIES), 'owners': sorted(OWNERS)},
              'methods': methods, 'types': types, 'bodies': bodies}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps({'provenance': provenance, 'result': result}, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'bodies': len(bodies), 'types': len(types), 'out': str(args.out)}))


if __name__ == '__main__':
    main()
