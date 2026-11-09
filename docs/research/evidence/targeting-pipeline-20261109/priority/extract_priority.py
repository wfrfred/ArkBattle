#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Re-extract the fingerprint-bound native target-priority selection in queries.json."""
import argparse
import json
from pathlib import Path
import sys

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path.cwd()/'.agents/skills/arkbattle-native-research/scripts'))
from native import Native, fingerprint


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--game', type=Path, required=True)
    parser.add_argument('--out', type=Path, required=True)
    parser.add_argument('--query', type=Path, default=Path(__file__).with_name('queries.json'))
    args = parser.parse_args()
    query = json.loads(args.query.read_text())
    native = Native(args.game)
    provenance = native.provenance()
    actual = provenance['client']
    if any(actual[key]['sha256'] != digest for key, digest in query['client'].items()):
        raise ValueError('client changed; relocate methods, generic bodies and constants before replay')
    provenance.update(extractionScript=fingerprint(Path(__file__)), query=fingerprint(args.query))
    args.out.mkdir(parents=True, exist_ok=True)

    def save(name, result):
        (args.out/name).write_text(json.dumps({'provenance': provenance, 'result': result},
                                             ensure_ascii=False, indent=2)+'\n')

    def pieces(address, end):
        parts = []
        while address < end:
            part = native.disassemble_at(address, max_bytes=end-address)
            parts.append(part)
            following = int(part['end'], 16)
            if following <= address:
                raise ValueError('disassembly failed to advance')
            address = following
        return parts

    methods = []
    for name in query['methods']:
        found = [native.method(m['index']) for m in native.methods if m['address'] and
                 native.typename(m['declaringType'])+'.'+native.string(m['nameIndex']) == name]
        if not found:
            raise ValueError(f'no current native method: {name}')
        for method in found:
            address = method['address']
            end = min(value for value in native.addresses if value > address)
            methods.append({'method': method, 'followingMethodAddress': hex(end),
                            'parts': pieces(address, end)})
            print(method['index'], name, hex(address), flush=True)
    for item in query['addresses']:
        label, interval = item.split('=', 1)
        if ':' in interval:
            left, right = interval.split(':', 1)
            methods.append({'label': label, 'range': interval,
                            'parts': pieces(int(left, 0), int(right, 0))})
        else:
            methods.append({'label': label, 'body': native.disassemble_at(int(interval, 0))})
    save('native.json', methods)

    owners = {item['method']['declaringType'] for item in methods if 'method' in item}
    save('fields.json', [{'name': native.typename(index),
                         'fields': [field for field in native.fields(index)
                                    if not field['name'].startswith('__Hotfix')],
                         'methods': [item['method'] for item in methods if 'method' in item and
                                     item['method']['declaringType'] == index]}
                        for index in sorted(owners)])
    types = []
    for entry in native.types:
        name = native.typename(entry['index'])
        if name not in query['types']:
            continue
        # BattleController contributes static source fields; its other APIs are outside this selection.
        names = [] if name == 'Torappu.Battle.BattleController' else [
            native.method(index) for index in range(entry['methodStart'], entry['methodStart']+entry['methodCount'])
            if not native.string(native.methods[index]['nameIndex']).startswith('__Hotfix')]
        types.append({'name': name, 'parent': native.type_name(entry['parentIndex'])
                      if entry['parentIndex'] >= 0 else None,
                      'fields': [field for field in native.fields(entry['index'])
                                 if not field['name'].startswith('__Hotfix')], 'methods': names})
    save('types.json', types)

    _, specs = native.pe.unpack('<2Q', native.registration+64)
    _, insts = native.pe.unpack('<2Q', native.registration+16)

    def type_at(pointer):
        data, bits = native.pe.unpack('<QI', pointer)
        if (bits >> 16) & 255 != 21:
            return native.type_name(pointer=pointer)
        definition, arguments, _ = native.pe.unpack('<3Q', data)
        count, values = native.pe.unpack('<2Q', arguments)
        return type_at(definition)+'<'+', '.join(type_at(native.pe.unpack('<Q', values+8*i)[0])
                                                for i in range(count))+'>'

    def arguments(index):
        if index < 0:
            return []
        inst = native.pe.unpack('<Q', insts+8*index)[0]
        count, values = native.pe.unpack('<2Q', inst)
        return [type_at(native.pe.unpack('<Q', values+8*i)[0]) for i in range(count)]
    bindings = []
    for item in query['resolutions']:
        label, location = item.split('=', 1)
        raw = native.pe.unpack('<Q', int(location, 0))[0]
        index = (raw & 0x1ffffffe) >> 1
        row = {'label': label, 'address': location, 'encodedUsage': hex(raw),
               'usage': raw >> 29, 'index': index}
        if row['usage'] != 6:
            raise ValueError(f'{label}: expected encoded MethodRef')
        method, class_inst, method_inst = native.pe.unpack('<iii', specs+index*12)
        row.update(method=native.method(method), classInstantiation=class_inst,
                   methodInstantiation=method_inst, classTypeArguments=arguments(class_inst),
                   methodTypeArguments=arguments(method_inst))
        bindings.append(row)
    save('generic-bindings.json', bindings)
    save('constants.json', [{'label': item.split('=', 1)[0], 'address': item.split('=', 1)[1],
                            'value': native.pe.unpack('<f', int(item.split('=', 1)[1], 0))[0]}
                           for item in query['floats']])
    save('xrefs.json', [{'method': method,
                        'references': native.xrefs(method['address'])}
                       for item in query['xrefs'] for method in [entry['method'] for entry in methods
                           if 'method' in entry and entry['method']['fullname'] == item]])


if __name__ == '__main__':
    main()
