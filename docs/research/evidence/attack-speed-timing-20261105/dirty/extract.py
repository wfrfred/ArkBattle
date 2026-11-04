#!/usr/bin/env python3
"""Extract attribute-dirty publication timing from the fingerprinted client."""
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
import argparse
import json
from pathlib import Path
import sys

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path.cwd() / '.agents/skills/arkbattle-native-research/scripts'))
from native import DEFAULT_GAME, Native, fingerprint

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--game', type=Path, default=DEFAULT_GAME)
parser.add_argument('--out', type=Path, required=True)
parser.add_argument('--method', type=int, action='append', default=[])
args = parser.parse_args()
expected = {
    'GameAssembly.dll': 'cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff',
    'Arknights_Data/il2cpp_data/Metadata/global-metadata.dat': 'e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5',
}
for relative, sha in expected.items():
    if fingerprint(args.game / relative)['sha256'] != sha:
        raise ValueError(f'client fingerprint changed: {relative}')
native = Native(args.game)
selectors = {
    'Torappu.Battle.Attributes': {'AddModifier', 'RemoveModifier', 'GetValue', 'MarkAttributeDirty', 'MarkAttributesDirty', 'AddModifierToSingleAttribute', '_CalculateAttributeValue'},
    'Torappu.Battle.Entity': {'OnAttributeDirty', 'OnReset', 'Init'},
}
metadata = {}
selected = set(args.method)
for t in native.types:
    full = native.typename(t['index'])
    if full not in selectors and not full.endswith('.Ability') and not full.endswith('.AbstractAnimatedAbility'):
        continue
    methods = [native.method(i) for i in range(t['methodStart'], t['methodStart'] + t['methodCount'])]
    metadata[full] = {'type': t, 'fields': native.fields(t['index']), 'methods': methods}
    names = selectors.get(full, {'OnAttackTimeChanged'})
    selected.update(m['index'] for m in methods if native.string(m['nameIndex']) in names)

def extract(index):
    body = native.disassemble(index)
    limit = min(a for a in native.addresses if a > int(body['address'],16))
    body['followingMethodAddress'] = hex(limit)
    body['continuations'] = []
    cursor = int(body['end'],16)
    while cursor < limit:
        part = native.disassemble_at(cursor, max_bytes=limit-cursor)
        body['continuations'].append(part)
        following = int(part['end'],16)
        if following <= cursor:
            raise ValueError('nonprogressing native range')
        cursor = following
    return body

args.out.mkdir(parents=True,exist_ok=True)
provenance = native.provenance()
provenance['extractionScript'] = fingerprint(Path(__file__))
provenance['collectedOn'] = '2026-11-05'
bodies = {str(i):extract(i) for i in sorted(selected)}
for name,result in [('metadata',metadata),('native',bodies)]:
    (args.out/(name+'.json')).write_text(json.dumps({'provenance':provenance,'result':result},ensure_ascii=False,indent=2)+'\n')
table = 0x180728dcc
switch = {'table':hex(table), 'inputRange':[7,15], 'imageBase':hex(native.pe.base),
    'rawBytes':native.pe.read(table,36).hex(),
    'targets':[{'attribute':7+i,'target':hex(native.pe.base+rva)}
        for i,rva in enumerate(native.pe.unpack('<9i',table))]}
(args.out/'switch.json').write_text(json.dumps({'provenance':provenance,'result':switch},indent=2)+'\n')
for key,body in bodies.items():
    lines = [f"{i['address']}: {i['mnemonic']:8} {i['operands']}" +
        (' ; '+' | '.join(i.get('methods',[])[:5]) if i.get('methods') else '')
        for part in [body,*body['continuations']] for i in part['instructions']]
    (args.out/(body['method']['fullname'].rsplit('.',1)[1]+'-'+key+'.asm')).write_text('\n'.join(lines)+'\n')
print(json.dumps({'out':str(args.out),'selected':[{'index':i,'name':bodies[str(i)]['method']['fullname']} for i in sorted(selected)]}))
