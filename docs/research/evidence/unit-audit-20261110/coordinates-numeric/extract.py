#!/usr/bin/env python3
"""Re-extract only the numeric/coordinate/Phase selectors used in this batch."""
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
import argparse
import hashlib
import json
import struct
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[5]
sys.path.insert(0, str(ROOT / '.agents/skills/arkbattle-native-research/scripts'))
from native import Native, fingerprint


def compact(body):
    body = dict(body)
    if len(body.get('aliases', [])) > 8:
        body['aliasCount'] = len(body.pop('aliases'))
    body['instructions'] = [dict(row) for row in body['instructions']]
    for row in body['instructions']:
        if len(row.get('methods', [])) > 8:
            row['methodAliasCount'] = len(row.pop('methods'))
    return body


def complete_selected_body(n, method):
    body = compact(n.disassemble(method['index']))
    following = next(address for address in n.addresses if address > method['address'])
    segments = [dict(address=body['address'], end=body['end'], bytesSha256=body['bytesSha256'],
                     fullyDecoded=body['fullyDecoded'], decodedEnd=body['decodedEnd'])]
    cursor = int(body['end'], 16)
    while cursor < following:
        part = compact(n.disassemble_at(cursor))
        assert cursor < int(part['end'], 16) <= following
        body['instructions'].extend(part['instructions'])
        segments.append(dict(address=part['address'], end=part['end'], bytesSha256=part['bytesSha256'],
                             fullyDecoded=part['fullyDecoded'], decodedEnd=part['decodedEnd']))
        cursor = int(part['end'], 16)
    body['segments'] = segments
    body['end'] = hex(following)
    last = body['instructions'][-1]
    body['decodedEnd'] = hex(int(last['address'], 16) + len(bytes.fromhex(last['bytes'])))
    body['decodedBytes'] = sum(len(bytes.fromhex(row['bytes'])) for row in body['instructions'])
    body['fullyDecoded'] = all(part['fullyDecoded'] for part in segments)
    body['bytesSha256'] = hashlib.sha256(n.pe.read(method['address'], following - method['address'])).hexdigest()
    body['boundary'] = 'Consecutive native.py ranges through the next distinct managed method address; includes split fallback and padding.'
    return body


def helper_control_flow(body):
    body = compact(body)
    indexed = {int(row['address'], 16): row for row in body['instructions']}
    pending = [int(body['address'], 16)]
    visited = set()
    external = set()
    while pending:
        cursor = pending.pop()
        while cursor in indexed and cursor not in visited:
            visited.add(cursor)
            row = indexed[cursor]
            following = cursor + len(bytes.fromhex(row['bytes']))
            if row['mnemonic'].startswith('j') and row.get('target'):
                target = int(row['target'], 16)
                if target in indexed:
                    pending.append(target)
                else:
                    external.add(row['target'])
                if row['mnemonic'] == 'jmp':
                    break
            if row['mnemonic'] in {'ret', 'int3'}:
                break
            cursor = following
    body['instructions'] = [row for address, row in indexed.items() if address in visited]
    body['instructionScope'] = 'Reachable basic blocks within this selected native byte window; calls are not traversed.'
    body['unexpandedTailTargets'] = sorted(external)
    return body


def cu32(raw, position):
    first = raw[position]
    if first < 0x80:
        return first, position + 1
    if first < 0xc0:
        return ((first & 0x3f) << 8) | raw[position + 1], position + 2
    if first < 0xe0:
        return int.from_bytes(bytes([first & 0x1f]) + raw[position + 1:position + 4], 'big'), position + 4
    raise ValueError(f'unsupported compressed uint tag {first:#x}')


def decode_meta(n, blob):
    raw = bytes.fromhex(blob)
    count, pos = cu32(raw, 0)
    constructors = list(struct.unpack_from('<' + 'I' * count, raw, pos))
    pos += 4 * count
    ctor = n.method(constructors[0])
    assert ctor['fullname'] == 'Torappu.AttributeMetaAttribute..ctor'
    argc, pos = cu32(raw, pos)
    fields, pos = cu32(raw, pos)
    properties, pos = cu32(raw, pos)
    assert argc in (2, 3) and fields == properties == 0
    assert [p['name'] for p in ctor['parameters']] == ['attribute', 'min', 'max'][:argc]
    assert raw[pos] == 0x55
    enum_type_code, pos = cu32(raw, pos + 1)
    assert ctor['parameters'][0]['typeName'] == 'Torappu.AttributeType'
    encoded, pos = cu32(raw, pos)
    attribute = (encoded >> 1) ^ -(encoded & 1)
    values = []
    for _ in range(argc - 1):
        assert raw[pos] == 0x0c
        values.append(struct.unpack_from('<f', raw, pos + 1)[0])
        pos += 5
    return dict(attribute=attribute, minimum=values[0], maximum=values[1] if argc == 3 else None,
                maximumDeclared=argc == 3, constructor=ctor, constructorIndices=constructors,
                enumSerializedTypeCode=enum_type_code,
                consumedThrough=pos, otherAttributeTailHex=raw[pos:].hex(),
                decoderScope='Only first AttributeMeta enum + float arguments; unrelated attributes are not decoded.')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--game', type=Path, default=Path('/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game'))
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    n = Native(args.game)
    names = {
        'Torappu.GridPosition.FromVectorPosition',
        'UnityEngine.Mathf.RoundToInt',
        'Torappu.AttributesData.get_fieldMetas', 'Torappu.AttributesData..cctor',
        'Torappu.AttributeMetaAttribute..ctor', 'Torappu.AttributeMetaAttribute.GetRangeAsTVector2',
        'Torappu.Battle.Attributes.Reset', 'Torappu.Battle.Attributes.GetValue',
        'Torappu.Battle.Attributes._CalculateAttributeValue',
        'Torappu.Battle.Attributes.GetMinValue', 'Torappu.Battle.Attributes.GetMaxValue',
        'Torappu.Battle.Entity.get_def', 'Torappu.Battle.Entity.get_epResistance',
        'Torappu.Battle.Entity.get_epDamageResistance',
        'Torappu.Battle.Enemy.get_offsetMapPosition',
        'Torappu.Battle.Enemy.get_footMapPosition',
        'Torappu.Battle.MoveController.OnStart',
        'Torappu.Battle.MoveController.CalculateIsHanging',
        'Torappu.Battle.MoveController..ctor',
        'Torappu.Battle.BattleFormula.CalculateElementDamage',
        'Torappu.Battle.BattleFormula.CalculateDamageInternal',
        'Torappu.Battle.BattleFormula..cctor',
        'Torappu.Battle.Action.Nodes/MoveNextLevelBranch.Execute',
        'Torappu.LevelData/BranchData/PhaseData.FetchActionsWithRandomSpawn',
        'Torappu.LevelData/BranchData/PhaseData.get_randomActionGroups',
    }
    methods = []
    for m in n.methods:
        name = n.typename(m['declaringType']) + '.' + n.string(m['nameIndex'])
        if name in names:
            methods.append(n.method(m['index']))
    bodies = [complete_selected_body(n, m) for m in methods]
    coordinate = next(b for b in bodies if b['method']['fullname'] == 'Torappu.GridPosition.FromVectorPosition')
    helper_address = int(next(i['target'] for i in coordinate['instructions'] if i['mnemonic'] == 'call'), 16)
    helpers = [compact(n.disassemble_at(helper_address))]
    mathf = next(b for b in bodies if b['method']['fullname'] == 'UnityEngine.Mathf.RoundToInt')
    targets = set()
    for body in [helpers[0], mathf]:
        for index, row in enumerate(body['instructions']):
            if row['mnemonic'] == 'cvttsd2si':
                call = next(i for i in reversed(body['instructions'][:index]) if i['mnemonic'] == 'call')
                targets.add(int(call['target'], 16))
    for address in sorted(targets):
        helpers.append(compact(n.disassemble_at(address, max_bytes=0x200)))
    helpers = [helper_control_flow(body) for body in helpers]
    ranges = n.records(25, '<II', 'token startOffset')
    data_start, _ = n.table(24)
    image = next(i for i in n.images if n.string(i['nameIndex']) == 'Assembly-CSharp.dll')
    begin = image['customAttributeStart']
    selected_ranges = ranges[begin:begin + image['customAttributeCount']]
    type_def = next(t for t in n.types if n.typename(t['index']) == 'Torappu.AttributesData')
    attributes = []
    for field in n.fields(type_def['index']):
        if field['name'] not in {'maxHp', 'def', 'magicResistance', 'epDamageResistance', 'epResistance'}:
            continue
        index = next(i for i, row in enumerate(selected_ranges) if row['token'] == field['token'])
        first, following = selected_ranges[index:index + 2]
        raw = n.metadata[data_start + first['startOffset']:data_start + following['startOffset']]
        attributes.append(dict(field=field, dataStart=data_start, rangeIndex=begin + index,
                               range=first, nextRange=following, blobHex=raw.hex(), decoded=decode_meta(n, raw.hex())))
    types = []
    for name in ['Torappu.AttributeMetaAttribute', 'Torappu.Battle.Attributes', 'Torappu.LevelData/BranchData/PhaseData', 'Torappu.Battle.BattleFormula', 'Torappu.Battle.MoveController']:
        t = next(t for t in n.types if n.typename(t['index']) == name)
        types.append(dict(fullname=name, index=t['index'], fields=[f for f in n.fields(t['index']) if not f['name'].startswith('__Hotfix')]))
    provenance = n.provenance()
    provenance['tool']['batchScript'] = fingerprint(Path(__file__))
    provenance['scope'] = 'Static selected native fallback methods and five current custom-attribute blobs; no runtime game/XLua observation.'
    args.out.mkdir(parents=True, exist_ok=True)
    constants = []
    seen_constants = set()
    for body in bodies + helpers:
        for row in body['instructions']:
            if row['mnemonic'] not in {'movsd', 'movss', 'addsd', 'subsd', 'ucomisd', 'comisd', 'mulss', 'mulsd'}:
                continue
            for address in row.get('ripReferences', []):
                fmt = '<d' if row['mnemonic'].endswith('sd') else '<f'
                if (address, fmt) not in seen_constants:
                    seen_constants.add((address, fmt))
                    raw = n.pe.read(int(address, 16), struct.calcsize(fmt))
                    constants.append(dict(address=address, format=fmt, bytes=raw.hex(), value=struct.unpack(fmt, raw)[0],
                                          referencedAt=row['address']))
    result = dict(methods=methods, bodies=bodies, helpers=helpers, attributes=attributes, types=types, constants=constants,
                  omissions='Shared native alias name lists above eight entries are replaced with counts; instruction bytes and targets are unchanged.')
    (args.out / 'native.json').write_text(json.dumps(dict(provenance=provenance, result=result), ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(dict(methods=len(methods), helpers=len(helpers), fields=len(attributes))))


if __name__ == '__main__':
    main()
