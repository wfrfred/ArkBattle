#!/usr/bin/env python3
"""Complete declared SP method inventory for BasicSkill, SpController and Entity."""
import argparse
import importlib.util
import json
import re
import struct
import sys
from pathlib import Path

sys.dont_write_bytecode = True
ROOT = Path.cwd()
sys.path.insert(0, str(ROOT / '.agents/skills/arkbattle-native-research/scripts'))
from native import Native, DEFAULT_GAME, fingerprint

OWNERS = {
    'Torappu.SpData', 'Torappu.Battle.BasicSkill', 'Torappu.Battle.Entity/SpController',
    'Torappu.Battle.Deck/Card', 'Torappu.Battle.CardHoldTalent',
    'Torappu.Battle.CardHoldTalent/CardHoldDataModifier',
    'Torappu.Battle.PeriodModifySharedDataBbTalent/SharedDataBbModifier',
    'Torappu.Battle.PeriodModifySharedDataBbTalent/SharedDataBbModifier/SharedDataBbModifierParam',
}
ENUMS = {'Torappu.SpType', 'Torappu.AbnormalFlag', 'Torappu.Battle.Buff/Event'}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    native = Native(DEFAULT_GAME)
    owners, methods, enums = [], [], []
    for owner in native.types:
        fullname = native.typename(owner['index'])
        selected = fullname in OWNERS or (fullname.startswith('Torappu.Battle.Deck/Card/') and owner['bitfield'] & 2)
        if selected:
            own_methods = [native.method(i) for i in range(owner['methodStart'], owner['methodStart'] + owner['methodCount'])]
            owners.append(dict(index=owner['index'], fullname=fullname, fields=native.fields(owner['index']), methods=own_methods,
                               parent=native.type_name(owner['parentIndex']) if owner['parentIndex'] >= 0 else None))
        if fullname == 'Torappu.Battle.Entity':
            for index in range(owner['methodStart'], owner['methodStart'] + owner['methodCount']):
                name = native.string(native.methods[index]['nameIndex'])
                method = native.method(index)
                if re.search(r'sp', name, re.I) or any('SpData' in p['typeName'] for p in method['parameters']):
                    methods.append(method)
    decoder_path = ROOT / 'docs/research/evidence/unit-audit-20261110/coordinates-numeric/extract.py'
    spec = importlib.util.spec_from_file_location('sp_enum_decoder', decoder_path)
    decoder = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(decoder)
    defaults = {x['fieldIndex']: x for x in native.records(7, '<iii', 'fieldIndex typeIndex dataIndex')}
    base, _ = native.table(8)
    for owner in native.types:
        fullname = native.typename(owner['index'])
        if fullname not in ENUMS and not (fullname.startswith('Torappu.Battle.Deck/Card/') and owner['bitfield'] & 2):
            continue
        values = []
        for field in native.fields(owner['index']):
            row = defaults.get(field['index'])
            if row is None or row['dataIndex'] < 0:
                continue
            at = base + row['dataIndex']
            encoded, following = decoder.cu32(native.metadata, at)
            constant_type = native.type_name(row['typeIndex'])
            value = encoded if constant_type == 'uint' else (encoded >> 1) ^ -(encoded & 1)
            values.append(dict(name=field['name'], value=value, fieldIndex=field['index'], default=row,
                               encodedBytes=native.metadata[at:following].hex()))
        enums.append(dict(fullname=fullname, index=owner['index'], values=values))
    provenance = native.provenance()
    provenance['caseTool'] = dict(script=fingerprint(Path(__file__)), enumDecoder=fingerprint(decoder_path))
    result = dict(scope='All declared methods on the listed owners; Entity methods whose name contains sp (case insensitive; includes Speed/Spell false positives) or whose parameters use SpData. Names are inventory, not proof of activation.',
                  selection=dict(owners=sorted(OWNERS), enums=sorted(ENUMS)), owners=owners, entitySpMethods=methods, enums=enums)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(dict(provenance=provenance, result=result), ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(dict(owners=len(owners), entitySpMethods=len(methods), enums=len(enums))))


if __name__ == '__main__':
    main()
