#!/usr/bin/env python3
"""Select the Ability inheritance/attachment metadata used by this bounded study."""
import argparse
import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path.cwd() / '.agents/skills/arkbattle-native-research/scripts'))
from native import Native, DEFAULT_GAME, fingerprint

NAMES = {
    'Torappu.Battle.Ability',
    'Torappu.Battle.AbilityStandard',
    'Torappu.Battle.Abilities.PassiveBuffAbility',
    'Torappu.Battle.BasicTalent',
    'Torappu.Battle.Talent',
    'Torappu.Battle.BasicSkill',
}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    native = Native(DEFAULT_GAME)
    selected = []
    for owner in native.types:
        name = native.typename(owner['index'])
        if name not in NAMES:
            continue
        selected.append({
            'type': owner,
            'fullname': name,
            'parent': native.type_name(owner['parentIndex']) if owner['parentIndex'] >= 0 else None,
            'methods': [native.method(i) for i in range(owner['methodStart'], owner['methodStart'] + owner['methodCount'])],
            'fields': native.fields(owner['index']),
        })
    provenance = native.provenance()
    provenance['caseTool'] = {'script': fingerprint(Path(__file__))}
    result = {'selection': sorted(NAMES), 'types': selected}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps({'provenance': provenance, 'result': result}, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'types': len(selected), 'out': str(args.out)}))


if __name__ == '__main__':
    main()
