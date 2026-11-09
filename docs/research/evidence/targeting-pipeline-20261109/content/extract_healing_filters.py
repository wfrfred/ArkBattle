#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Extract the ordinary HP/EP-healer candidate filters and their resource getters."""
import argparse
import json
from pathlib import Path
import sys

sys.dont_write_bytecode = True
TOOLS = Path.cwd() / '.agents/skills/arkbattle-native-research/scripts'
sys.path.insert(0, str(TOOLS))
from native import Native, fingerprint

NAMES = [
    'Torappu.Battle.FilterUtil._Filter_HpRatioNotFullAsc',
    'Torappu.Battle.FilterUtil._Filter_EpMinAscHpRatioAscFirstNotAllFull',
    'Torappu.Battle.FilterUtil._Filter_HpRatioAscEpMinAscFirstNotAllFull',
    'Torappu.Battle.Entity.get_hpRatio',
    'Torappu.Battle.Entity.get_minEpType',
    'Torappu.Battle.Entity.get_isInEpBreakRecovery',
    'Torappu.Battle.Entity.get_epArray',
    'Torappu.Battle.Entity.get_maxEp',
    'Torappu.Battle.Abilities.Heal.get_ignoreHealFree',
    'Torappu.Battle.Abilities.Heal.GeneratePurposeMask',
    'Torappu.Battle.Abilities.Heal.NewHealNode',
    'Torappu.Battle.Abilities.RangedHeal.NewHealNode',
    'Torappu.Battle.Action.Nodes/ApplyHeal..ctor',
    'Torappu.Battle.Action.Nodes/ApplyHeal.Execute',
]

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--game', type=Path, default=Path('/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game'))
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)
    native = Native(args.game)
    methods = [native.method(row['index']) for row in native.methods]
    selected = [row for row in methods if row['fullname'] in NAMES]
    contract_names = ['Torappu.Battle.Abilities.Heal', 'Torappu.Battle.Abilities.RangedHeal',
                      'Torappu.Battle.Abilities.MultiMeleeAttack', 'Torappu.Battle.Action.Nodes/ApplyHeal']
    contracts = []
    for row in native.types:
        name = native.typename(row['index'])
        if name in contract_names:
            declared = [method for method in methods if method['declaringType'] == row['index'] and not method['fullname'].rsplit('.', 1)[-1].startswith('__Hotfix')]
            contracts.append(dict(type=name, index=row['index'], fields=native.fields(row['index']), methods=declared))
            if name.endswith('MultiMeleeAttack'):
                selected += [method for method in declared if method['fullname'].rsplit('.', 1)[-1] in ['UpdateTargets', 'get_selectTargetTiming']]
    found = {row['fullname'] for row in selected}
    unavailable = [name for name in NAMES if name not in found]
    results = []
    for method in selected:
        address = method['address']
        if not address:
            unavailable.append(method['fullname'])
            continue
        end = min(v for v in native.addresses if v > address)
        parts = []
        while address < end:
            part = native.disassemble_at(address, max_bytes=end - address)
            parts.append(part)
            following = int(part['end'], 16)
            assert following > address
            address = following
        constants = []
        for part in parts:
            for instruction in part['instructions']:
                if instruction['mnemonic'] == 'movss':
                    for ref in instruction.get('ripReferences', []):
                        constants.append(dict(instruction=instruction['address'], address=ref,
                                              float=native.pe.unpack('<f', int(ref, 16))[0]))
        results.append(dict(method=method, followingMethodAddress=hex(end), parts=parts, constants=constants))
        print(method['fullname'], method['index'], hex(method['address']), flush=True)
    entity = next(row for row in native.types if native.typename(row['index']) == 'Torappu.Battle.Entity')
    slots = [row for row in methods if row['declaringType'] == entity['index'] and row['slot'] in [80,81]]
    result = dict(provenance={**native.provenance(), 'collectedOn': '2026-11-09',
                            'script': fingerprint(Path(__file__)), 'nativeTool': fingerprint(TOOLS / 'native.py')},
                  result=dict(methods=results, entityVirtualSlots=slots, typeContracts=contracts, unavailable=unavailable))
    (args.out / 'healing-filters.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')

if __name__ == '__main__':
    main()
