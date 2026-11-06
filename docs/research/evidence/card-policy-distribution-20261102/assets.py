#!/usr/bin/env python3
"""Scan installed Token/Trap controller policy and supply fields, with complete tree consumption."""
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
import argparse,collections,hashlib,json,struct,sys
from pathlib import Path
sys.dont_write_bytecode=True
ROOT=Path(__file__).resolve().parents[4]
sys.path.insert(0,str(ROOT/'docs/research/evidence/blocker-roles-20261031'))
from extract import trees
from unity_assets import Reader,bundle,serialized
FIELDS={'_cardPolicy','_isInfinity','_rechargeOnlyOnce','_notShowInDeck','_sideType','_category','_withdrawCostRecoverRatio','_maxWithdrawCostRatioOfRawCost'}

def project(raw,nodes):
 r=Reader(raw);selected={}
 def walk(i):
  node=nodes[i];start=r.p
  if node['type']=='string':r.string()
  elif node['flags']&1:
   count=r.val('i');assert 0<=count<=len(raw)
   assert len(node['children'])==2
   for _ in range(count):walk(node['children'][1])
  elif node['children']:
   for child in node['children']:walk(child)
  else:
   assert node['width']>=0
   r.read(node['width'])
  if node['name'] in FIELDS:
   value=struct.unpack_from('<f',raw,start)[0] if node['type']=='common:161' else int.from_bytes(raw[start:r.p],'little',signed=True)
   selected[node['name']]=dict(value=value,offset=start)
  if node['meta']&0x4000:r.align()
  assert r.p<=len(raw),(r.p,len(raw),node)
 walk(0);assert r.p==len(raw),(r.p,len(raw))
 return selected

def main():
 p=argparse.ArgumentParser();p.add_argument('--game',type=Path,required=True);p.add_argument('--out',type=Path,required=True);p.add_argument('--extra',action='append',default=[]);a=p.parse_args()
 root=a.game/'Arknights_Data/StreamingAssets/AB/Windows'
 paths=sorted((root/'pkgrps').glob('btl_pfb_tokens_*.ab'))+[root/x for x in a.extra]
 rows=[];sources=[]
 for path in paths:
  sources.append(dict(path=str(path.relative_to(root)),bytes=path.stat().st_size,sha256=hashlib.sha256(path.read_bytes()).hexdigest()))
  for name,data in bundle(path)[0]:
   if name.endswith(('.resS','.resource')):continue
   state=serialized(data);layouts=trees(data);objects={o['id']:o for o in state['objects']}
   for obj in state['objects']:
    nodes=layouts[obj['typeid']]
    if not any(n['name']=='_cardPolicy' for n in nodes):continue
    raw=data[obj['start']:obj['start']+obj['size']];values=project(raw,nodes)
    go=objects[struct.unpack_from('<q',raw,4)[0]];r=Reader(data,p=go['start']);r.read(r.val('i')*12);r.val('i');goname=r.string()
    rows.append(dict(bundle=str(path.relative_to(root)),file=name,name=goname,pathId=str(obj['id']),scriptId=obj['scriptid'],rawSha256=hashlib.sha256(raw).hexdigest(),fields=values))
 counts=collections.Counter(tuple(row['fields'].get(f,{}).get('value') for f in ['_cardPolicy','_isInfinity','_rechargeOnlyOnce','_notShowInDeck']) for row in rows)
 result=dict(date='2026-11-02',scope='Initial serialized controller configuration, not effective runtime overrides or counts of playable content.',sources=sources,controllers=rows,distribution=[dict(policy=k[0],isInfinity=k[1],rechargeOnlyOnce=k[2],notShowInDeck=k[3],count=v) for k,v in sorted(counts.items(),key=str)])
 a.out.parent.mkdir(parents=True,exist_ok=True);a.out.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
 print(json.dumps(dict(controllers=len(rows),distribution=result['distribution']),ensure_ascii=False))
if __name__=='__main__':main()
