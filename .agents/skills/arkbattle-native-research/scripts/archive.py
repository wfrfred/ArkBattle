#!/usr/bin/env python3
"""Index historical evidence without rewriting its original payloads."""
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
import argparse
import ast
import datetime
import hashlib
import json
import re
import sys
from pathlib import Path

sys.dont_write_bytecode = True
from native import fingerprint

HASH = re.compile(r'^[a-fA-F0-9]{64}$')
GAME_PREFIX = 'Arknights_Data/StreamingAssets/AB/Windows/'


def walk(value, pointer=''):
    if isinstance(value, dict):
        yield pointer, value
        for key, child in value.items():
            yield from walk(child, pointer + '/' + str(key).replace('~', '~0').replace('/', '~1'))
    elif isinstance(value, list):
        for i, child in enumerate(value):
            yield from walk(child, pointer + '/' + str(i))


def va(value):
    if isinstance(value, int):
        return value
    if isinstance(value, str) and value.startswith('0x'):
        return int(value, 16)
    return None


def archive(batch):
    inputs, methods, blocks, types, constants = {}, {}, {}, {}, {}
    dates, source_records, artifacts = set(), [], []

    def add_input(path, digest, source, size=None):
        if not isinstance(path, str) or not isinstance(digest, str) or not HASH.fullmatch(digest):
            return
        path = path.replace('\\', '/')
        if path.endswith('GameAssembly.dll'):
            kind, relative = 'dll', 'GameAssembly.dll'
        elif path.endswith('global-metadata.dat'):
            kind, relative = 'metadata', 'Arknights_Data/il2cpp_data/Metadata/global-metadata.dat'
        elif path.endswith('.ab') or path.endswith('.bin') and ('/anon/' in path or path.startswith('anon/')):
            kind = 'bundle'
            relative = ('Arknights_Data/StreamingAssets/AB/Windows/' + path.split(GAME_PREFIX)[-1]
                        if GAME_PREFIX in path else GAME_PREFIX + path.lstrip('/'))
        else:
            return
        key = kind, relative, digest.lower()
        row = inputs.setdefault(key, dict(kind=kind, path=path, gameRelativePath=relative,
                                         sha256=digest.lower(), records=[]))
        if isinstance(size, int):
            row['bytes'] = size
        if source not in row['records']:
            row['records'].append(source)

    def add_method(index, source, mode='metadata', name=None, address=None):
        if not isinstance(index, int) or index < 0:
            return
        row = methods.setdefault(index, dict(index=index, mode=mode, records=[]))
        if mode == 'disasm':
            row['mode'] = mode
        if isinstance(name, str) and '.' in name:
            row['fullname'] = name
        if va(address):
            row['address'] = hex(va(address))
        if source not in row['records']:
            row['records'].append(source)

    for path in sorted(batch.rglob('*')):
        if not path.is_file() or '__pycache__' in path.parts or path.name in ('archive.json', 'README.md'):
            continue
        rel = str(path.relative_to(batch))
        data = path.read_bytes()
        kind = {'.asm':'instructions', '.json':'record', '.py':'historical-script',
                '.md':'historical-report', '.txt':'historical-report'}.get(path.suffix, 'artifact')
        artifacts.append(dict(path=rel, kind=kind, bytes=len(data), sha256=hashlib.sha256(data).hexdigest()))
        if path.suffix == '.asm':
            header = data.decode(errors='replace').splitlines()[0]
            index = re.search(r'metadata=(\d+)', header)
            address = re.search(r'\bVA=(0x[0-9a-fA-F]+)', header)
            if index and not re.search(r'token=0x0\b', header):
                name = header.lstrip('; ').split(' metadata=')[0]
                add_method(int(index[1]), rel, 'disasm', name, address[1] if address else None)
            elif header.startswith('{'):
                row = ast.literal_eval(header)
                name = row.get('fullname') or (str(row.get('type', '')) + '.' + row.get('name', ''))
                add_method(row.get('index'), rel, 'disasm', name, row.get('address'))
            else:
                first = re.search(rb'(?m)^(?:0x)?(0*[0-9a-fA-F]{9,16}):', data)
                if first:
                    start = int(first[1], 16)
                    blocks.setdefault(start, dict(address=hex(start), records=[]))['records'].append(rel)
            continue
        if path.suffix != '.json':
            continue
        record = json.loads(data)
        source_records.append(rel)
        references = []
        if isinstance(record, dict):
            if isinstance(record.get('client_inputs'), str):
                references.append(record['client_inputs'])
            if 'provenance' in str(record.get('scope', '')).lower():
                references.extend(re.findall(r'\.\./[\w./-]+\.json', record['scope']))
        for reference in references:
            external = path.parent / reference
            if not external.is_file():
                continue
            external_record = json.loads(external.read_text())
            for external_pointer, external_row in walk(external_record):
                if isinstance(external_row.get('path'), str):
                    add_input(external_row['path'], external_row.get('sha256'),
                              reference + '#' + external_pointer,
                              external_row.get('bytes', external_row.get('size')))

        for pointer, row in walk(record):
            source = rel + '#' + pointer
            # Only explicit historical metadata is promoted into provenance.
            # File timestamps and today's client must not fill missing history.
            if pointer == '':
                for key in ('collectedOn', 'checkedOn', 'checked_at', 'date', 'created'):
                    if isinstance(row.get(key), str) and re.match(r'^20\d\d-\d\d-\d\d', row[key]):
                        dates.add(row[key][:10])
            for key, value in row.items():
                key_lower = key.lower().replace('_', '')
                if key_lower == 'dllsha256':
                    add_input(row.get('dllPath', row.get('dll', 'GameAssembly.dll')), value, source)
                elif key_lower == 'metadatasha256':
                    add_input(row.get('metadataPath', row.get('metadata', 'Arknights_Data/il2cpp_data/Metadata/global-metadata.dat')),
                              value, source)
                elif isinstance(value, str) and HASH.fullmatch(value) and (key.endswith('.dll') or key.endswith('.dat') or key.endswith('.ab')):
                    add_input(key, value, source)
                elif isinstance(value, dict):
                    digest = value.get('sha256')
                    fallback = key if key.endswith(('.dll', '.dat', '.ab')) else {
                        'dll':'GameAssembly.dll', 'binary':'GameAssembly.dll', 'metadata':'Arknights_Data/il2cpp_data/Metadata/global-metadata.dat'}.get(key)
                    add_input(value.get('path', fallback), digest, source + '/' + key.replace('~', '~0').replace('/', '~1'),
                              value.get('bytes', value.get('size')))
            path_value = row.get('path', row.get('sourceFile', row.get('source', row.get('bundle'))))
            add_input(path_value, row.get('sha256'), source, row.get('bytes', row.get('size')))
            token = row.get('token')
            if isinstance(token, str):
                try:
                    token = int(token, 0)
                except ValueError:
                    token = None
            index = row.get('methodIndex', row.get('metadataIndex', row.get('index')))
            method_like = ('methodIndex' in row or isinstance(token, int) and token >> 24 == 6
                           or 'slot' in row or 'virtualSlot' in row
                           or len(pointer.split('/')) >= 2 and pointer.split('/')[-2] in ('methods', 'nativeMethods', 'nativeWitnesses'))
            if method_like and isinstance(index, int) and isinstance(row.get('name', row.get('method', row.get('fullname'))), str) and token != 0:
                name = row.get('fullname', row.get('method'))
                if not name and '.' in row['name']:
                    name = row['name']
                declaring = row.get('declaringType', row.get('type'))
                if not name and isinstance(declaring, str):
                    name = declaring + '.' + row['name']
                add_method(index, source,
                           'disasm' if any(k in row for k in ('instructions', 'selectedInstructions', 'disassembly')) else 'metadata',
                           name, row.get('address', row.get('VA', row.get('va'))))
            native_method = row.get('method')
            if isinstance(native_method, dict) and 'instructions' in row:
                add_method(native_method.get('index'), source, 'disasm', native_method.get('fullname'), native_method.get('address'))
            typename = row.get('typename')
            if not typename and 'fields' in row and isinstance(row.get('fullname'), str):
                typename = row['fullname']
            if not typename and 'fields' in row and isinstance(row.get('name'), str) and row['name'].startswith('Torappu.'):
                typename = row['name']
            if not typename and 'namespace' in row and isinstance(row.get('name'), str):
                typename = '.'.join(v for v in (row['namespace'], row['name']) if v)
                if row.get('declaringTypeIndex', -1) >= 0:
                    typename = None  # Nested types need a fully qualified recorded name.
            if isinstance(typename, str) and typename.startswith('Torappu.'):
                types.setdefault(typename, dict(name=typename, records=[]))['records'].append(source)
            if ('fields' in row or 'methods' in row) and isinstance(row.get('type'), str) and row['type'].startswith('Torappu.'):
                types.setdefault(row['type'], dict(name=row['type'], records=[]))['records'].append(source)
            address = va(row.get('address'))
            if address and any(k in row for k in ('float', 'float32')) and 'mnemonic' not in row:
                constants.setdefault(address, dict(address=hex(address), format='<f', records=[]))['records'].append(source)

    match = re.search(r'-(20\d{6})$', batch.name)
    directory_date = f'{match[1][:4]}-{match[1][4:6]}-{match[1][6:]}' if match else None
    client = {}
    for kind in ('dll', 'metadata'):
        found = [r for r in inputs.values() if r['kind'] == kind]
        client[kind] = found[0] if len(found) == 1 else dict(variants=found) if found else None
    replay = dict(methods=sorted(methods.values(), key=lambda r:r['index']),
                  blocks=sorted(blocks.values(), key=lambda r:int(r['address'], 16)),
                  types=sorted(types.values(), key=lambda r:r['name']),
                  constants=sorted(constants.values(), key=lambda r:int(r['address'], 16)),
                  bundles=[r for r in inputs.values() if r['kind'] == 'bundle'])
    return dict(provenance=dict(
        scope='Organization of historical evidence; not a new client extraction or gameplay observation.',
        collectedOn=sorted(dates) or ([directory_date] if directory_date else []),
        collectionDateSource='record fields' if dates else 'batch directory' if directory_date else 'not recorded',
        organizedOn=datetime.date.today().isoformat(),
        client=client, sourceRecords=source_records,
        tool=dict(script=fingerprint(Path(__file__)), python=sys.version,
                  role='archive inventory; historical tool versions remain in the source records')),
        result=dict(artifacts=artifacts, replay=replay,
            limits=['Original extracts and reports retain their original payload and evidence strength.',
                    'Replay writes fresh skill output; it does not recreate missing historical decoders, mirrors, hotfixes or emulation stubs.']))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--batch', action='store_true', help='process only the specified batch directory')
    parser.add_argument('evidence', type=Path)
    args = parser.parse_args()
    if args.batch:
        if not args.evidence.is_dir():
            parser.error('batch must be an existing directory')
        batches = [args.evidence]
    else:
        batches = [batch for batch in sorted(args.evidence.iterdir())
                   if batch.is_dir() and batch.name != '__pycache__']
    for batch in batches:
        data = archive(batch)
        (batch / 'archive.json').write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
        r = data['result']['replay']
        print(batch.name, len(r['methods']), 'methods,', len(r['types']), 'types,', len(r['constants']), 'constants')


if __name__ == '__main__':
    main()
