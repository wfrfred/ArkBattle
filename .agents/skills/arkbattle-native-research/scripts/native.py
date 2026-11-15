#!/usr/bin/env python3
"""Read Windows x64 Arknights IL2CPP v29 files without executing client code."""
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
import argparse
import bisect
import hashlib
import json
import struct
import sys
from pathlib import Path

DEFAULT_GAME = Path('/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game')


def fingerprint(path):
    return dict(path=str(path.resolve()), bytes=path.stat().st_size,
                sha256=hashlib.sha256(path.read_bytes()).hexdigest())


class PE:
    def __init__(self, path):
        self.path = Path(path)
        self.data = self.path.read_bytes()
        pe = struct.unpack_from('<I', self.data, 60)[0]
        if self.data[:2] != b'MZ' or self.data[pe:pe + 4] != b'PE\0\0':
            raise ValueError('expected PE input')
        machine, count = struct.unpack_from('<HH', self.data, pe + 4)
        optional_size = struct.unpack_from('<H', self.data, pe + 20)[0]
        if machine != 0x8664 or struct.unpack_from('<H', self.data, pe + 24)[0] != 0x20b:
            raise ValueError('only Windows x64 PE32+ is supported')
        self.base = struct.unpack_from('<Q', self.data, pe + 48)[0]
        self.sections = []
        for i in range(count):
            start = pe + 24 + optional_size + i * 40
            size, rva, raw_size, offset = struct.unpack_from('<4I', self.data, start + 8)
            flags = struct.unpack_from('<I', self.data, start + 36)[0]
            self.sections.append(dict(name=self.data[start:start + 8].rstrip(b'\0').decode(),
                address=self.base + rva, size=size, offset=offset, raw_size=raw_size,
                executable=bool(flags & 0x20000000)))

    def section(self, address):
        return next(s for s in self.sections if s['address'] <= address < s['address'] + s['raw_size'])

    def offset(self, address):
        s = self.section(address)
        return s['offset'] + address - s['address']

    def address(self, offset):
        s = next(s for s in self.sections if s['offset'] <= offset < s['offset'] + s['raw_size'])
        return s['address'] + offset - s['offset']

    def read(self, address, size):
        s = self.section(address)
        if address + size > s['address'] + s['raw_size']:
            raise ValueError('read crosses file-backed section boundary')
        offset = self.offset(address)
        return self.data[offset:offset + size]

    def unpack(self, fmt, address):
        return struct.unpack(fmt, self.read(address, struct.calcsize(fmt)))

    def find(self, value):
        start = 0
        while (start := self.data.find(value, start)) >= 0:
            yield start
            start += 1


class Native:
    def __init__(self, game=DEFAULT_GAME):
        self.game = Path(game)
        self.pe = PE(self.game / 'GameAssembly.dll')
        self.metadata_path = self.game / 'Arknights_Data/il2cpp_data/Metadata/global-metadata.dat'
        self.metadata = self.metadata_path.read_bytes()
        magic, self.version = struct.unpack_from('<II', self.metadata)
        if magic != 0xfab11baf or self.version != 29:
            raise ValueError('only IL2CPP metadata v29 is supported')
        self.strings, _ = self.table(2)
        # Installed Arknights layout: 92 bytes, including an uninterpreted
        # extra int before the counts. Standard v29 tools may expect 88 bytes.
        self.types = self.records(19, '<17i8H2I',
            'nameIndex namespaceIndex byvalTypeIndex declaringTypeIndex parentIndex elementTypeIndex '
            'genericContainerIndex flags fieldStart methodStart eventStart propertyStart nestedTypesStart '
            'interfacesStart vtableStart interfaceOffsetsStart reserved methodCount propertyCount '
            'fieldCount eventCount nestedTypeCount vtableCount interfacesCount interfaceOffsetsCount bitfield token')
        self.methods = self.records(5, '<5iI4H',
            'nameIndex declaringType returnType parameterStart genericContainerIndex token flags iflags slot parameterCount')
        self.parameters = self.records(10, '<iIi', 'nameIndex token typeIndex')
        self.field_records = self.records(11, '<iiI', 'nameIndex typeIndex token')
        self.images = self.records(20, '<10i',
            'nameIndex assemblyIndex typeStart typeCount exportedTypeStart exportedTypeCount '
            'entryPointIndex token customAttributeStart customAttributeCount')
        for t in self.types:
            t['name'] = self.string(t['nameIndex'])
            t['namespace'] = self.string(t['namespaceIndex'])
            if t['token'] >> 24 != 2:
                raise ValueError('unsupported TypeDefinition layout: token column mismatch')
        self.modules = {}
        self.address_methods = {}
        for image in self.images:
            name = self.string(image['nameIndex'])
            methods = [m for t in self.types[image['typeStart']:image['typeStart'] + image['typeCount']]
                for m in self.methods[max(0, t['methodStart']):max(0, t['methodStart']) + t['methodCount']]]
            count = max((m['token'] & 0xffffff for m in methods), default=0)
            if not count:
                continue
            matches = []
            for offset in self.pe.find(name.encode() + b'\0'):
                string_address = self.pe.address(offset)
                for candidate in self.pe.find(struct.pack('<Q', string_address)):
                    if candidate % 8:
                        continue
                    _, n, pointer = struct.unpack_from('<3Q', self.pe.data, candidate)
                    if n == count:
                        matches.append((self.pe.address(candidate), pointer))
            if len(matches) != 1:
                raise ValueError(f'{name}: expected one CodeGenModule, found {matches}')
            module, pointers = matches[0]
            table_file_backed = True
            try:
                addresses = self.pe.unpack('<' + 'Q' * count, pointers) if pointers else (0,) * count
            except StopIteration:
                # Some generated helper assemblies have tables in zero-filled
                # memory. Metadata is still searchable; no address is invented.
                addresses = (0,) * count
                table_file_backed = False
            self.modules[name] = dict(address=module, methodPointers=pointers, count=count,
                fileBacked=table_file_backed)
            for m in methods:
                m['image'] = name
                m['address'] = addresses[(m['token'] & 0xffffff) - 1]
                m['addressStatus'] = ('file-backed' if m['address'] else
                    'null-method-pointer' if table_file_backed else 'runtime-only-table')
                if m['address']:
                    self.address_methods.setdefault(m['address'], []).append(m['index'])
        self.addresses = sorted(self.address_methods)
        # MetadataRegistration: consecutive fieldOffsets/typeDefinitionsSizes
        # pairs, both counted by TypeDefinition count. Locate from this input.
        registrations = []
        count = len(self.types)
        for offset in self.pe.find(struct.pack('<Q', count)):
            if offset < 80 or offset % 8 or struct.unpack_from('<Q', self.pe.data, offset + 16)[0] != count:
                continue
            type_count, types = struct.unpack_from('<2Q', self.pe.data, offset - 32)
            fields = struct.unpack_from('<Q', self.pe.data, offset + 8)[0]
            if type_count <= max(t['byvalTypeIndex'] for t in self.types):
                continue
            try:
                self.pe.read(types, type_count * 8)
                self.pe.read(fields, count * 8)
            except (StopIteration, ValueError):
                continue
            registrations.append((self.pe.address(offset - 80), types, fields, type_count))
        if len(registrations) != 1:
            raise ValueError(f'expected one MetadataRegistration, found {registrations}')
        self.registration, types, fields, count = registrations[0]
        self.type_pointers = self.pe.unpack('<' + 'Q' * count, types)
        self.field_offsets = self.pe.unpack('<' + 'Q' * len(self.types), fields)

    def table(self, index):
        return struct.unpack_from('<II', self.metadata, 8 + index * 8)

    def records(self, table, fmt, names):
        start, size = self.table(table)
        stride = struct.calcsize(fmt)
        if size % stride:
            raise ValueError(f'metadata table {table}: unsupported record layout')
        return [dict(zip(names.split(), row), index=i) for i, row in
                enumerate(struct.iter_unpack(fmt, self.metadata[start:start + size]))]

    def string(self, index):
        start = self.strings + index
        return self.metadata[start:self.metadata.index(0, start)].decode('utf-8')

    def typename(self, index):
        t = self.types[index]
        if t['declaringTypeIndex'] >= 0:
            return self.type_name(t['declaringTypeIndex']) + '/' + t['name']
        return '.'.join(x for x in (t['namespace'], t['name']) if x)

    def type_name(self, index=None, *, pointer=None):
        data, bits = self.pe.unpack('<QI', self.type_pointers[index] if pointer is None else pointer)
        kind = (bits >> 16) & 255
        simple = {1:'void', 2:'bool', 3:'char', 4:'sbyte', 5:'byte', 6:'short', 7:'ushort',
                  8:'int', 9:'uint', 10:'long', 11:'ulong', 12:'float', 13:'double',
                  14:'string', 24:'nint', 25:'nuint', 28:'object'}
        if kind in simple:
            result = simple[kind]
        elif kind in (17, 18):
            result = self.typename(data)
        elif kind in (15, 29):
            result = self.type_name(pointer=data) + ('*' if kind == 15 else '[]')
        else:
            result = f'type(kind={kind:#x}, data={data:#x})'
        return result + ('&' if (bits >> 29) & 1 else '')

    def method(self, index):
        m = self.methods[index]
        start = max(0, m['parameterStart'])
        return dict(m, fullname=self.typename(m['declaringType']) + '.' + self.string(m['nameIndex']),
            returnTypeName=self.type_name(m['returnType']),
            parameters=[dict(p, name=self.string(p['nameIndex']), typeName=self.type_name(p['typeIndex']))
                for p in self.parameters[start:start + m['parameterCount']]])

    def fields(self, index):
        t = self.types[index]
        result = []
        for local in range(t['fieldCount']):
            f = self.field_records[t['fieldStart'] + local]
            _, bits = self.pe.unpack('<QI', self.type_pointers[f['typeIndex']])
            offset = self.pe.unpack('<i', self.field_offsets[index] + local * 4)[0]
            static = bool(bits & 0x10)
            result.append(dict(f, name=self.string(f['nameIndex']), typeName=self.type_name(f['typeIndex']),
                static=static, offset=offset,
                unboxedOffset=offset - 16 if t['bitfield'] & 1 and not static else None))
        return result

    def provenance(self):
        return dict(scope='Static native branches; no game execution or runtime XLua verification.',
            client=dict(dll=fingerprint(self.pe.path), metadata=fingerprint(self.metadata_path),
                        metadataVersion=self.version, imageBase=hex(self.pe.base)),
            tool=dict(script=fingerprint(Path(__file__)), python=sys.version),
            location=dict(metadataRegistration=hex(self.registration), modules=self.modules))

    def disassemble(self, index, max_bytes=None):
        m = self.method(index)
        address = m.get('address', 0)
        if not address:
            raise ValueError(f'no direct native body ({m.get("addressStatus", "unresolved")}); requires separate resolution')
        return self.disassemble_at(address, max_bytes, method=m)

    def disassemble_at(self, address, max_bytes=None, *, method=None):
        import capstone
        pdata = next(s for s in self.pe.sections if s['name'] == '.pdata')
        bounds = [(self.pe.base + a, self.pe.base + b) for a, b, _ in struct.iter_unpack(
            '<III', self.pe.data[pdata['offset']:pdata['offset'] + pdata['raw_size'] - pdata['raw_size'] % 12])
            if a and a <= address - self.pe.base < b]
        if bounds:
            end = max(b for _, b in bounds)
            boundary = 'PE .pdata range containing entry; separate funclets/tail targets require expansion'
        else:
            pos = bisect.bisect_right(self.addresses, address)
            section = self.pe.section(address)
            end = min(self.addresses[pos] if pos < len(self.addresses) else address + 4096,
                      section['address'] + section['raw_size'])
            boundary = 'next known method/section boundary; completeness unproven'
        if max_bytes is not None:
            end = min(end, address + max_bytes)
            boundary += '; explicit byte limit'
        code = self.pe.read(address, end - address)
        cs = capstone.Cs(capstone.CS_ARCH_X86, capstone.CS_MODE_64)
        cs.detail = True
        instructions = []
        for ins in cs.disasm(code, address):
            row = dict(address=hex(ins.address), bytes=ins.bytes.hex(), mnemonic=ins.mnemonic, operands=ins.op_str)
            if (ins.mnemonic == 'call' or ins.group(capstone.CS_GRP_JUMP)) and ins.operands and ins.operands[0].type == capstone.x86.X86_OP_IMM:
                target = ins.operands[0].imm
                row['target'] = hex(target)
                if ins.group(capstone.CS_GRP_JUMP):
                    row['targetOutsideRange'] = not (address <= target < end)
                row['methods'] = [self.method(i)['fullname'] for i in self.address_methods.get(target, [])]
            for op in ins.operands:
                if op.type == capstone.x86.X86_OP_MEM and op.mem.base == capstone.x86.X86_REG_RIP:
                    row.setdefault('ripReferences', []).append(hex(ins.address + ins.size + op.mem.disp))
            instructions.append(row)
        decoded_end = int(instructions[-1]['address'], 16) + len(bytes.fromhex(instructions[-1]['bytes'])) if instructions else address
        return dict(method=method, address=hex(address), aliases=self.address_methods.get(address, []),
            boundary=boundary, end=hex(end),
            decodedEnd=hex(decoded_end), decodedBytes=decoded_end - address, fullyDecoded=decoded_end == end,
            bytesSha256=hashlib.sha256(code).hexdigest(), capstoneVersion=capstone.__version__, instructions=instructions)

    def xrefs(self, target):
        results = []
        for s in self.pe.sections:
            if not s['executable']:
                continue
            code = self.pe.data[s['offset']:s['offset'] + s['raw_size']]
            for opcode in (b'\xe8', b'\xe9'):
                start = 0
                while (start := code.find(opcode, start)) >= 0:
                    if start + 5 <= len(code):
                        address = s['address'] + start
                        if address + 5 + struct.unpack_from('<i', code, start + 1)[0] == target:
                            pos = bisect.bisect_right(self.addresses, address) - 1
                            results.append(dict(address=hex(address), opcode=opcode.hex(), section=s['name'],
                                precedingMethodCandidates=self.address_methods[self.addresses[pos]] if pos >= 0 else []))
                    start += 1
        return dict(target=hex(target),
            scope='Direct E8/E9 candidates only; excludes indirect/virtual calls; instruction boundaries require confirmation.',
            candidates=results)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--game', type=Path, default=DEFAULT_GAME)
    parser.add_argument('--out', type=Path, help='JSON output; otherwise stdout')
    sub = parser.add_subparsers(dest='command', required=True)
    sub.add_parser('probe', help='fingerprints and freshly located registration tables')
    sub.add_parser('search', help='case-insensitive full method name search').add_argument('query')
    sub.add_parser('type', help='exact fully qualified type name, fields and methods').add_argument('name')
    asm = sub.add_parser('disasm', help='native body of a current metadata method index')
    asm.add_argument('index', type=int, nargs='+')
    asm.add_argument('--max-bytes', type=lambda s: int(s, 0))
    block = sub.add_parser('disasm-at', help='expand a native branch/funclet at its VA')
    block.add_argument('address', type=lambda s: int(s, 0))
    block.add_argument('--max-bytes', type=lambda s: int(s, 0))
    sub.add_parser('xrefs', help='direct call/jump candidates to a VA').add_argument('address', type=lambda s: int(s, 0))
    read = sub.add_parser('read', help='read a native VA, e.g. a RIP-relative float constant')
    read.add_argument('address', type=lambda s: int(s, 0))
    read.add_argument('--size', type=int, default=16)
    read.add_argument('--format', help='explicit struct format, e.g. <f or <I')
    args = parser.parse_args()
    n = Native(args.game)
    if args.command == 'probe':
        result = dict(typeCount=len(n.types), methodCount=len(n.methods))
    elif args.command == 'search':
        result = [n.method(m['index']) for m in n.methods if args.query.casefold() in
            (n.typename(m['declaringType']) + '.' + n.string(m['nameIndex'])).casefold()]
    elif args.command == 'type':
        ts = [t for t in n.types if n.typename(t['index']) == args.name]
        if not ts:
            parser.error(f'unknown type: {args.name}')
        result = [dict(t, fullname=n.typename(t['index']), fields=n.fields(t['index']),
            methods=[n.method(i) for i in range(max(0, t['methodStart']), max(0, t['methodStart']) + t['methodCount'])]) for t in ts]
    elif args.command == 'disasm':
        bodies = [n.disassemble(index, args.max_bytes) for index in args.index]
        result = bodies[0] if len(bodies) == 1 else bodies
    elif args.command == 'disasm-at':
        result = n.disassemble_at(args.address, args.max_bytes)
    elif args.command == 'xrefs':
        result = n.xrefs(args.address)
    else:
        size = struct.calcsize(args.format) if args.format else args.size
        raw = n.pe.read(args.address, size)
        result = dict(address=hex(args.address), bytes=raw.hex())
        if args.format:
            result['values'] = struct.unpack(args.format, raw)
    output = json.dumps(dict(provenance=n.provenance(), result=result), ensure_ascii=False, indent=2) + '\n'
    if args.out:
        args.out.parent.mkdir(parents=True, exist_ok=True)
        args.out.write_text(output)
    else:
        print(output, end='')


if __name__ == '__main__':
    main()
