#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Extract bounded facing writers/readers; never executes the client."""
import argparse
import bisect
import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path.cwd() / '.agents/skills/arkbattle-native-research/scripts'))
from native import Native, DEFAULT_GAME, fingerprint


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--game', type=Path, default=DEFAULT_GAME)
    p.add_argument('--out', type=Path, required=True)
    p.add_argument('--search', action='append', default=[])
    p.add_argument('--body', action='append', default=[], help='exact full method name')
    p.add_argument('--body-index', type=int, action='append', default=[], help='current metadata selector')
    p.add_argument('--body-prefix', action='append', default=[], help='bounded owner method prefix')
    p.add_argument('--owner', action='append', default=[], help='exact type name for fields')
    p.add_argument('--xref', action='append', default=[], help='exact full method name')
    a = p.parse_args()
    n = Native(a.game)
    provenance = n.provenance()
    provenance['location']['modules'] = {'Assembly-CSharp.dll': n.modules['Assembly-CSharp.dll']}
    provenance['caseTool'] = {'script': fingerprint(Path(__file__))}
    methods, bodies, xrefs = [], [], []
    for raw in n.methods:
        fullname = n.typename(raw['declaringType']) + '.' + n.string(raw['nameIndex'])
        if not (any(q.casefold() in fullname.casefold() for q in a.search)
                or fullname in a.body or fullname in a.xref or raw['index'] in a.body_index
                or any(fullname.startswith(q) for q in a.body_prefix)):
            continue
        method = n.method(raw['index'])
        methods.append(method)
        if (fullname in a.body or raw['index'] in a.body_index
                or any(fullname.startswith(q) for q in a.body_prefix)) and method.get('address'):
            cursor = method['address']
            end = n.addresses[bisect.bisect_right(n.addresses, cursor)]
            parts = []
            while cursor < end:
                part = n.disassemble_at(cursor, end - cursor,
                                        method=method if cursor == method['address'] else None)
                for ins in part['instructions']:
                    if len(ins.get('methods', [])) > 100:
                        ins['methodAliasCount'] = len(ins.pop('methods'))
                parts.append(part)
                advanced = int(part['end'], 16)
                if advanced <= cursor:
                    raise RuntimeError('non-progress')
                cursor = advanced
            bodies.append({'methodIndex': method['index'], 'fullname': fullname,
                           'logicalEnd': hex(end), 'fragments': parts})
        if fullname in a.xref and method.get('address'):
            xrefs.append({'targetMethod': method, 'directCandidates': n.xrefs(method['address'])})
    owners = [{'index': t['index'], 'fullname': n.typename(t['index']),
               'fields': n.fields(t['index'])}
              for t in n.types if n.typename(t['index']) in a.owner]
    payload = {'provenance': provenance, 'result': {'selection': vars(a) | {'game': str(a.game), 'out': str(a.out)},
               'methods': methods, 'fieldOwners': owners, 'bodies': bodies, 'xrefs': xrefs}}
    a.out.parent.mkdir(parents=True, exist_ok=True)
    a.out.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'methods': len(methods), 'bodies': len(bodies), 'owners': len(owners), 'out': str(a.out)}))


if __name__ == '__main__':
    main()
