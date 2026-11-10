#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Read infection auto-priority, attribute slot loading, and its exact rounding helper."""
import argparse,bisect,json,struct,sys
from pathlib import Path
sys.dont_write_bytecode=True
ROOT=Path.cwd();sys.path.insert(0,str(ROOT/'.agents/skills/arkbattle-native-research/scripts'))
from native import DEFAULT_GAME,Native,fingerprint
WANTED={'Torappu.Battle.Buff._CalculatePriority','Torappu.Battle.Buff._LoadAttributesModifier','Torappu.Battle.Buff._SetAttributeModifier','Torappu.BuffData.get_isAutoPriority','Torappu.MathUtil.RoundToInt','Torappu.FP.Round','Torappu.FP.AsInt'}
def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--game',type=Path,default=DEFAULT_GAME);p.add_argument('--out',type=Path,required=True);a=p.parse_args();n=Native(a.game);rows=[]
 for m in n.methods:
  name=n.typename(m['declaringType'])+'.'+n.string(m['nameIndex'])
  if name not in WANTED:continue
  meta=n.method(m['index']);address=meta.get('address')
  if not address:continue
  if name=='Torappu.MathUtil.RoundToInt' and address!=0x186946c30:continue
  end=n.addresses[bisect.bisect_right(n.addresses,address)];parts=[]
  while address<end:
   part=n.disassemble_at(address,max_bytes=end-address,method=meta if not parts else None);parts.append({k:v for k,v in part.items() if k not in {'method','aliases'}});following=int(part['end'],16)
   if following<=address:raise ValueError(name)
   address=following
  rows.append({'method':meta,'end':hex(end),'parts':parts})
 literals=[]
 for address in [0x1870addf0,0x1870adbe0]:
  raw=n.pe.read(address,4);literals.append({'address':hex(address),'bytes':raw.hex(),'float32':struct.unpack('<f',raw)[0]})
 fields=[]
 for t in n.types:
  name=n.typename(t['index'])
  if name in ['Torappu.Battle.Buff','Torappu.BuffData','Torappu.Battle.BuffTile']:
   fields.append({'type':name,'index':t['index'],'fields':[f for f in n.fields(t['index']) if not f['static']],'methods':[n.method(m['index']) for m in n.methods if m['declaringType']==t['index']] if name=='Torappu.Battle.BuffTile' else []})
 a.out.parent.mkdir(parents=True,exist_ok=True);a.out.write_text(json.dumps({'provenance':{**n.provenance(),'script':fingerprint(Path(__file__)),'scope':'Selected empty-priorityBBKeys path, attribute loading and exact FP rounding helper; literal reads only at directly referenced addresses; no game execution.'},'selection':sorted(WANTED),'result':{'methods':rows,'literals':literals,'fields':fields}},ensure_ascii=False,indent=2)+'\n');print('methods',len(rows))
if __name__=='__main__':main()
