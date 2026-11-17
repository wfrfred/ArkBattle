#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Inventory native AttributesData/AttributeType declarations and bounded constructors."""
import argparse
import bisect
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

DECODER = ROOT / 'docs/research/evidence/resource-mechanisms-20261114/death-attributes/extract_metadata.py'
FLOAT_DECODER = ROOT / 'docs/research/evidence/unit-audit-20261110/coordinates-numeric/extract.py'
OWNERS = {'Torappu.AttributesData', 'Torappu.AttributeType', 'Torappu.AttributeMetaAttribute', 'CodeStage.AntiCheat.ObscuredTypes.ObscuredInt'}
BODIES = {
    'Torappu.AttributesData..ctor',
    'Torappu.AttributesData.ReadAttributesField',
    'Torappu.AttributesData.WriteAttributesField',
    'Torappu.AttributeMetaAttribute..ctor',
    'Torappu.AttributeMetaAttribute.GetRangeAsTVector2',
    'CodeStage.AntiCheat.ObscuredTypes.ObscuredInt.InternalDecrypt',
}


def module(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    result = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(result)
    return result


def body(native, method):
    begin = method['address']
    end = native.addresses[bisect.bisect_right(native.addresses, begin)]
    cursor, parts = begin, []
    while cursor < end:
        part = native.disassemble_at(cursor, end - cursor,
                                     method=method if cursor == begin else None)
        for instruction in part['instructions']:
            if len(instruction.get('methods', [])) > 100:
                instruction['methodAliasCount'] = len(instruction.pop('methods'))
        parts.append(part)
        next_cursor = int(part['end'], 16)
        if next_cursor <= cursor:
            raise RuntimeError('non-progressing body decoder')
        cursor = next_cursor
    return {'method': method, 'logicalEnd': hex(end), 'fragments': parts}



def constructor_defaults(native, owners, bodies):
    owner = next(row for row in owners if row['fullname'] == 'Torappu.AttributesData')
    fields = {row['offset']: row for row in owner['fields'] if not row['static']}
    ctor = next(row for row in bodies if row['method']['fullname'] == 'Torappu.AttributesData..ctor')
    registers, pending, writes, constants = {}, None, {}, {}
    for part in ctor['fragments']:
        for instruction in part['instructions']:
            mnemonic, operands = instruction['mnemonic'], instruction['operands']
            if mnemonic == 'mov' and operands.startswith('edx, '):
                value = int(operands.split(', ')[1], 0)
                registers['edx'] = value - 2**32 if value >= 2**31 else value
            elif mnemonic == 'xor' and operands == 'edx, edx':
                registers['edx'] = 0
            elif mnemonic == 'xorps' and operands in ('xmm1, xmm1', 'xmm6, xmm6'):
                registers[operands.split(',')[0]] = 0.0
            elif mnemonic == 'movss' and operands.split(',')[0] in ('xmm1', 'xmm6') and instruction.get('ripReferences'):
                address = int(instruction['ripReferences'][0], 16)
                raw = native.pe.read(address, 4)
                value = struct.unpack('<f', raw)[0]
                registers[operands.split(',')[0]] = value
                constants[hex(address)] = {'hex': raw.hex(), 'float32': value}
            elif mnemonic == 'movaps' and operands == 'xmm1, xmm6':
                registers['xmm1'] = registers['xmm6']
            elif mnemonic == 'movups' and operands.startswith('xmm1, '):
                registers['xmm1'] = None
            if mnemonic == 'call':
                methods = instruction.get('methods', [])
                if 'CodeStage.AntiCheat.ObscuredTypes.ObscuredInt.op_Implicit' in methods:
                    pending = {'value': registers['edx'], 'conversion': methods[0], 'callAddress': instruction['address']}
                elif 'CodeStage.AntiCheat.ObscuredTypes.ObscuredFloat.op_Implicit' in methods:
                    value = registers.get('xmm1')
                    if value is None:
                        raise ValueError('unresolved constructor floating-point argument')
                    pending = {'value': value, 'conversion': methods[0], 'callAddress': instruction['address']}
            match = re.fullmatch(r'xmmword ptr \[rbx \+ (0x[0-9a-f]+)\], xmm\d+', operands)
            if mnemonic == 'movups' and match:
                offset = int(match[1], 16)
                if offset in fields:
                    if pending is None:
                        raise ValueError('unresolved constructor return copy')
                    field = fields[offset]
                    writes[field['name']] = pending | {'storeAddress': instruction['address'], 'fieldOffset': offset}
    return {'methodIndex': ctor['method']['index'], 'explicitWrites': writes,
            'notExplicitlyWritten': [row['name'] for row in fields.values() if row['name'] not in writes],
            'floatConstants': constants,
            'scope': 'Bounded argument/copy decoder for this constructor; not a general native emulator.'}



def summarize_inventory(source):
    payload = json.loads(source.read_text())
    result = payload['result']
    defaults = result['constructorDefaults']['explicitWrites']
    declarations = {row['decoded']['attribute']: row for row in result['attributes']}
    zero_default_method = next(row['method']['index'] for row in result['bodies'] if row['method']['fullname'] == 'CodeStage.AntiCheat.ObscuredTypes.ObscuredInt.InternalDecrypt')
    rows = []
    for enumeration in result['attributeType']:
        number = enumeration['value']
        row = {'id': number, 'name': enumeration['name']}
        declaration = declarations.get(number)
        if declaration is None:
            row |= {'status': 'enum-sentinel' if enumeration['name'] == 'E_NUM' else 'reserved-no-AttributesData-field'}
            rows.append(row)
            continue
        field, decoded = declaration['field'], declaration['decoded']
        default = defaults.get(field['name'])
        if default is None:
            if field['name'] not in ('atk', 'def'):
                raise ValueError('unresolved numeric constructor default')
            default = {'value': 0, 'source': 'CLR zero-initialized ObscuredInt; InternalDecrypt uninitialized branch returns zero',
                       'proofMethodIndex': zero_default_method}
        row |= {'status': 'AttributeMeta', 'field': field['name'], 'fieldType': field['typeName'],
                'fieldToken': hex(field['token']), 'default': default,
                'declaredMinimum': decoded['minimum'], 'declaredMaximum': decoded['maximum'],
                'minimumDeclared': decoded['minimumDeclared'], 'maximumDeclared': decoded['maximumDeclared'],
                'rangeMinimum': decoded['minimum'] if decoded['minimumDeclared'] else 'FP.MinValue',
                'rangeMaximum': decoded['maximum'] if decoded['maximumDeclared'] else 'FP.MaxValue',
                'declarationConstructorIndex': decoded['constructor']['index'],
                'rawBlob': declaration['blobHex'],
                'AttributesDataWrite': 'RoundToEven on integer field write' if field['typeName'].endswith('ObscuredInt') else 'floating-point field write',
                'runtimeQuery': 'Attributes.GetValue returns FP; field representation alone does not establish integer rounding of final runtime modifiers',
                'consumerConstraints': []}
        if number == 7:
            row['consumerConstraints'] = [{'rule': 'Ordinary attack period calculation consumes attack speed clamped to 10..600; the attribute default minimum is separately 20 and its maximum is not declared.',
                                           'evidence': 'docs/research/evidence/attribute-ranges-20261117/README-native.md'}]
        rows.append(row)
    block = next(row for row in result['otherFields'] if row['field']['name'] == 'blockVolume')
    return {'provenance': {'source': fingerprint(source), 'script': fingerprint(Path(__file__)),
                           'client': payload['provenance']['client']},
            'result': {'attributeType': rows,
                       'numericAttributeCount': len(declarations),
                       'additionalNumericDataField': {'field': block['field'], 'default': defaults['blockVolume'],
                           'status': 'No AttributeMeta/AttributeType; not a hidden 35th modifiable enum attribute'},
                       'abnormalImmunityFields': [{'field': row['field']['name'], 'default': False,
                           'source': 'CLR zero initialization; no constructor write', 'blobHex': row['blobHex']}
                           for row in result['otherFields'] if row['field']['typeName'] == 'bool'],
                       'roundingEvidence': {'writeMethodIndices': [31442, 31443],
                            'roundToEvenHelper': '0x180007310',
                            'helperProof': 'docs/research/evidence/unit-audit-20261110/coordinates-numeric/native.json',
                            'runtimeFPQueryProof': 'docs/research/evidence/unit-audit-20261110/coordinates-numeric/native.json'},
                       'rangeFallbackProof': {'methodIndex': 31432, 'lowerFlagOffset': '0x20', 'upperFlagOffset': '0x21',
                            'omittedLower': 'FP.MinValue', 'omittedUpper': 'FP.MaxValue'},
                       'coverage': 'Complete current AttributeType and AttributeMeta declarations plus AttributesData constructor defaults. Consumer-specific limits and quantization are not exhaustively inventoried.'}}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--game', type=Path, default=DEFAULT_GAME)
    parser.add_argument('--out', type=Path, required=True)
    parser.add_argument('--body', action='append', default=[])
    parser.add_argument('--summarize', type=Path, help='derive the inventory from an existing native extraction without reopening the client')
    args = parser.parse_args()
    if args.summarize:
        args.out.parent.mkdir(parents=True, exist_ok=True)
        args.out.write_text(json.dumps(summarize_inventory(args.summarize), ensure_ascii=False, indent=2) + "\n")
        print(json.dumps({"summary": str(args.out)}))
        return
    native = Native(args.game)
    decoder = module('inventory_attribute_decoder', DECODER)
    float_decoder = module('inventory_float_decoder', FLOAT_DECODER)
    ranges = native.records(25, '<II', 'token startOffset')
    data_start, _ = native.table(24)
    image = next(row for row in native.images if native.string(row['nameIndex']) == 'Assembly-CSharp.dll')
    start = image['customAttributeStart']
    selected = ranges[start:start + image['customAttributeCount']]
    by_token = {row['token']: index for index, row in enumerate(selected)}
    owners, attributes, other = [], [], []
    for owner in native.types:
        fullname = native.typename(owner['index'])
        if fullname not in OWNERS:
            continue
        fields = native.fields(owner['index'])
        methods = [native.method(index) for index in range(owner['methodStart'], owner['methodStart'] + owner['methodCount'])]
        owners.append({'fullname': fullname, 'index': owner['index'], 'fields': fields, 'methods': methods})
        if fullname != 'Torappu.AttributesData':
            continue
        for field in fields:
            position = by_token.get(field['token'])
            row = {'field': field}
            if position is None or position + 1 >= len(selected):
                row['status'] = 'no-custom-attribute-blob'
                other.append(row)
                continue
            first, following = selected[position:position + 2]
            raw = native.metadata[data_start + first['startOffset']:data_start + following['startOffset']]
            row |= {'range': first, 'nextRange': following, 'dataStart': data_start, 'blobHex': raw.hex()}
            try:
                row['decoded'] = decoder.attribute_meta(native, float_decoder, raw)
            except (AssertionError, ValueError, IndexError) as error:
                row |= {'status': 'not-AttributeMeta', 'reason': str(error)}
                other.append(row)
            else:
                attributes.append(row)
    defaults = {row['fieldIndex']: row for row in native.records(7, '<iii', 'fieldIndex typeIndex dataIndex')}
    default_start, _ = native.table(8)
    enum = next(row for row in owners if row['fullname'] == 'Torappu.AttributeType')
    values = []
    for field in enum['fields']:
        default = defaults.get(field['index'])
        if default is None or default['dataIndex'] < 0:
            continue
        at = default_start + default['dataIndex']
        encoded, end = float_decoder.cu32(native.metadata, at)
        values.append({'name': field['name'], 'value': (encoded >> 1) ^ -(encoded & 1),
                       'defaultRecord': default, 'encodedHex': native.metadata[at:end].hex()})
    all_methods = [native.method(row['index']) for row in native.methods
                   if native.typename(row['declaringType']) in OWNERS]
    selected_bodies = BODIES | set(args.body)
    bodies = [body(native, row) for row in all_methods
              if row['fullname'] in selected_bodies and row.get('address')]
    provenance = native.provenance()
    provenance['location']['modules'] = {'Assembly-CSharp.dll': native.modules['Assembly-CSharp.dll']}
    provenance['extractionScript'] = fingerprint(Path(__file__))
    provenance['attributeDecoder'] = fingerprint(DECODER)
    provenance['floatDecoder'] = fingerprint(FLOAT_DECODER)
    provenance['collectedOn'] = '2026-11-17'
    ctor_defaults = constructor_defaults(native, owners, bodies)
    result = {'constructorDefaults': ctor_defaults, 'selection': {'owners': sorted(OWNERS), 'bodies': sorted(selected_bodies)},
              'owners': owners, 'attributes': attributes, 'otherFields': other,
              'attributeType': values, 'bodies': bodies}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps({'provenance': provenance, 'result': result}, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'attributes': len(attributes), 'otherFields': len(other), 'enumValues': len(values), 'bodies': len(bodies), 'out': str(args.out)}))


if __name__ == '__main__':
    main()
