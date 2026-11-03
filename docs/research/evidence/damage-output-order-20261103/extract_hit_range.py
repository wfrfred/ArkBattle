#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Narrow Crow/ubprison targeting reachability evidence; not damage-pipeline discovery."""
import argparse, bisect, json, sys
from pathlib import Path
sys.dont_write_bytecode=True
sys.path.insert(0,str(Path.cwd()/'.agents/skills/arkbattle-native-research/scripts'))
from native import Native, fingerprint
p=argparse.ArgumentParser();p.add_argument('--game',type=Path,required=True);p.add_argument('--out',type=Path,required=True);p.add_argument('--method',type=int,action='append',default=[]);a=p.parse_args()
n=Native(a.game);prov=n.provenance()
assert prov['client']['dll']['sha256']=='cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff'
assert prov['client']['metadata']['sha256']=='e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5'
prov['caseTool']=fingerprint(Path(__file__))
rows=[]
for m in n.methods:
 owner=n.typename(m['declaringType'])
 if owner in {'Torappu.Battle.TargetSelector','Torappu.Battle.AdvancedSelector'}: rows.append(n.method(m['index']))
methods=[n.method(i) for i in a.method];bodies=[]
for m in methods:
 cursor=m['address'];end=n.addresses[bisect.bisect_right(n.addresses,cursor)];fragments=[]
 while cursor<end:
  b=n.disassemble_at(cursor,end-cursor,method=m if cursor==m['address'] else None)
  for ins in b['instructions']:
   if len(ins.get('methods',[]))>100: ins['methodAliasCount']=len(ins['methods']);del ins['methods']
  fragments.append(b);nxt=int(b['end'],16)
  assert nxt>cursor;cursor=nxt
 bodies.append({'methodIndex':m['index'],'logicalEnd':hex(end),'fragments':fragments})
a.out.parent.mkdir(parents=True,exist_ok=True)
a.out.write_text(json.dumps({'provenance':prov,'result':{'discovery':rows,'methods':methods,'bodies':bodies}},ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'out':str(a.out),'methods':[m['fullname'] for m in methods],'discovery':[{'index':m['index'],'fullname':m['fullname']} for m in rows]},ensure_ascii=False))
