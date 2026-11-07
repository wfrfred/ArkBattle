#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Selected map-route consumers and batched direct-call candidates."""
import argparse
import bisect
import importlib.util
import json
import struct
from pathlib import Path


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--game', type=Path, default=Path('/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game'))
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    tool = Path('.agents/skills/arkbattle-native-research/scripts/native.py')
    spec = importlib.util.spec_from_file_location('native', tool)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    n = module.Native(args.game)
    wanted = {
        'Torappu.Battle.Map.ClearAllRoutes', 'Torappu.Battle.Map.ReplaceAllRoutes',
        'Torappu.Battle.Map.UpdateAllRoutes', 'Torappu.Battle.Map.UpdateRoutes',
        'Torappu.Battle.Map.EndBatchTileUpdate', 'Torappu.Battle.Map.AccumulateDirtyRoutes',
        'Torappu.Battle.Map.UpdateAllRoutesOffset', 'Torappu.Battle.Map.TryRemoveRuntimeRoute',
        'Torappu.Battle.Map.GenerateRuntimeExtraRoute', 'Torappu.Battle.Map.RemoveRuntimeExtraRoute',
        'Torappu.Battle.Mainline15PrtsManager/EnemyPrts.TracePosition',
        'Torappu.Battle.LhshipRouteManager._GetValidRoute',
    }
    matches = []
    for row in n.methods:
        fullname = n.typename(row['declaringType']) + '.' + n.string(row['nameIndex'])
        if fullname in wanted or 'PathMotionMode' in fullname:
            matches.append(n.method(row['index']))
    missing = wanted - {m['fullname'] for m in matches}
    if missing:
        raise ValueError(sorted(missing))
    targets = {m['address'] for m in matches if m['address']}
    references = {address: [] for address in targets}
    for sec in n.pe.sections:
        if not sec['executable']:
            continue
        data = n.pe.data[sec['offset']:sec['offset'] + sec['raw_size']]
        for opcode in (b'\xe8', b'\xe9'):
            pos = 0
            while (pos := data.find(opcode, pos)) >= 0:
                offset = pos
                pos += 1
                if offset + 5 > len(data):
                    continue
                address = sec['address'] + offset
                target = address + 5 + struct.unpack_from('<i', data, offset + 1)[0]
                if target not in targets:
                    continue
                owner = n.addresses[bisect.bisect_right(n.addresses, address) - 1]
                references[target].append({'address': hex(address), 'opcode': opcode.hex(),
                    'precedingMethods': [n.method(i) for i in n.address_methods[owner]]})
    bodies = []
    for method in matches:
        if not method['address'] or method['fullname'].startswith('XLua.'):
            continue
        cursor = method['address']
        end = n.addresses[bisect.bisect_right(n.addresses, cursor)]
        fragments = []
        while cursor < end:
            body = n.disassemble_at(cursor, end - cursor, method=method if cursor == method['address'] else None)
            for ins in body['instructions']:
                if len(ins.get('methods', [])) > 100:
                    ins['methodAliasCount'] = len(ins.pop('methods'))
            fragments.append(body)
            following = int(body['end'], 16)
            if following <= cursor:
                raise ValueError('non advancing fragment')
            cursor = following
        bodies.append({'selector': {'fullname': method['fullname'], 'token': method['token']},
                       'method': method, 'logicalEnd': hex(end), 'fragments': fragments})
    provenance = n.provenance()
    provenance['queryScript'] = module.fingerprint(Path(__file__))
    result = {'methods': matches, 'bodies': bodies,
        'directCallers': [{'target': hex(a), 'methods': [m['fullname'] for m in matches if m['address'] == a], 'candidates': refs} for a, refs in references.items()],
        'limits': 'E8/E9 byte candidates need instruction-boundary confirmation. Virtual and delegate calls require separate slot or binding evidence. Bodies include consecutive pdata fragments to the next known method; labels do not prove all blocks reachable.'}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps({'provenance': provenance, 'result': result}, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'methods': len(matches), 'bodies': len(bodies), 'directCandidates': sum(map(len, references.values()))}))


if __name__ == '__main__':
    main()
