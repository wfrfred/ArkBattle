#!/usr/bin/env python3
"""Extract the bounded current-DP-sign to natural-recovery timer chain."""
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
import argparse,datetime,json,sys
from pathlib import Path
sys.dont_write_bytecode=True
ROOT=Path.cwd()
sys.path.insert(0,str(ROOT/".agents/skills/arkbattle-native-research/scripts"))
from native import Native,DEFAULT_GAME,fingerprint
p=argparse.ArgumentParser(description=__doc__)
p.add_argument("--game",type=Path,default=DEFAULT_GAME)
p.add_argument("--out",type=Path,required=True)
a=p.parse_args()
record=json.loads(Path(__file__).with_name("probe.json").read_text())["provenance"]["client"]
for kind,rel in [("dll","GameAssembly.dll"),("metadata","Arknights_Data/il2cpp_data/Metadata/global-metadata.dat")]:
 if fingerprint(a.game/rel)["sha256"] != record[kind]["sha256"]:raise ValueError("client fingerprint changed: "+kind)
n=Native(a.game)
names={"Torappu.Battle.BattleCostManager.UpdateCost","Torappu.Battle.BattleCostManager.SetCost","Torappu.Battle.BattleCostManager..ctor","Torappu.PrecisePeriodicTimer.Update","Torappu.PrecisePeriodicTimer.get_isReady","Torappu.PrecisePeriodicTimer.Next"}
r={}
for m in n.methods:
 name=n.typename(m["declaringType"])+"."+n.string(m["nameIndex"])
 if name not in names:continue
 method=n.method(m["index"])
 address=method["address"]
 end=min(v for v in n.address_methods if v>address)
 parts=[]
 while address<end:
  part=n.disassemble_at(address)
  parts.append(part)
  nxt=int(part["end"],16)
  if nxt<=address:raise ValueError("nonprogress")
  address=nxt
 r[name]=dict(method=method,followingMethodAddress=hex(end),parts=parts)
if set(r)!=names:raise ValueError("expected all methods")
t=next(t for t in n.types if n.typename(t["index"])=="Torappu.Battle.BattleCostManager")
fields=[f for f in n.fields(t["index"]) if f["name"] in ["m_negativeRecoveryMultiplier","m_costTimerDict","m_costStatusDict"]]
a.out.mkdir(parents=True,exist_ok=True)
provenance=n.provenance()
provenance['collectedOn']=datetime.date.today().isoformat()
provenance["extractionScript"]=fingerprint(Path(__file__))
(a.out/"negative-dp.json").write_text(json.dumps(dict(provenance=provenance,result=dict(methods=r,fields=fields)),ensure_ascii=False,indent=2)+"\n")
related={}
for name in ['Torappu.PrecisePeriodicTimer']:
 t=next(t for t in n.types if n.typename(t['index'])==name)
 related[name]=dict(type=t,fields=n.fields(t['index']),methods=[n.method(i) for i in range(t['methodStart'],t['methodStart']+t['methodCount'])])
for item in r.values():
 for part in item['parts']:
  for row in part['instructions']:
   if row.get('target') and any(s.startswith('Torappu.FP.') for s in row.get('methods',[])):
    target=int(row['target'],16)
    related[row['target']]=[n.method(i) for i in n.address_methods[target]]
(a.out/'related.json').write_text(json.dumps(dict(provenance=provenance,result=related),ensure_ascii=False,indent=2)+'\n')
