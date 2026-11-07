#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Extract the global-mark writer/reader and casting/selection consumers for one positive."""
import argparse,bisect,importlib.util,json
from pathlib import Path

def main():
 p=argparse.ArgumentParser();p.add_argument('--game',type=Path,default=Path('/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game'));p.add_argument('--out',type=Path,default=Path('.cache/native-research/route-operations-20261107/endpoint-native-replay'));a=p.parse_args();spec=importlib.util.spec_from_file_location('native',Path('.agents/skills/arkbattle-native-research/scripts/native.py'));m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);n=m.Native(a.game)
 type_names={'Torappu.Battle.TileSelector','Torappu.Battle.TileSelector/Options','Torappu.Battle.TileSelector/FilterType','Torappu.Battle.TileSelector/TileSortType','Torappu.Battle.Abilities.BuffDuringCastingFixed','Torappu.Battle.Action.Nodes/AddGlobalBlackboard','Torappu.Battle.Action.Nodes/FilterByGlobalBlackboard','Torappu.Battle.Action.Nodes/AssignFirstTileToBlackboardByAbilityTileSelector'}
 selected=[]
 for t in n.types:
  name=n.typename(t['index'])
  if name in type_names:
   fields=n.fields(t['index']);methods=[n.method(i)for i in range(t['methodStart'],t['methodStart']+t['methodCount'])];selected.append({'fullname':name,'fields':fields,'methods':methods})
   if name.endswith('/Options'):type_names.update(f['typeName']for f in fields if 'tileTypes' in f['name'])
 defaults={x['fieldIndex']:x for x in n.records(7,'<iii','fieldIndex typeIndex dataIndex')};data_base,_=n.table(8)
 for t in selected:
  if t['fullname'].endswith(('/FilterType','/TileSortType')):
   for f in t['fields']:
    d=defaults.get(f['index'])
    if d and d['dataIndex']>=0:
     raw=n.metadata[data_base+d['dataIndex']];assert raw<128;f['enumDefault']={'metadataDataIndex':d['dataIndex'],'encodedByte':raw,'value':(raw>>1)^-(raw&1)}
 names={'Torappu.Battle.Action.Nodes/AddGlobalBlackboard.Execute','Torappu.Battle.Action.Nodes/FilterByGlobalBlackboard.Execute','Torappu.Battle.Action.Nodes/AssignFirstTileToBlackboardByAbilityTileSelector.Execute','Torappu.Battle.Action.Nodes/TriggerAbility.Execute','Torappu.Battle.Abilities.BuffDuringCastingFixed.OnCastStart','Torappu.Battle.Abilities.BuffDuringCastingFixed.OnCastFinish','Torappu.Battle.TileSelector.ValidateTile','Torappu.Battle.TileSelector._DoFilter','Torappu.Battle.TileSelector._SortTiles','Torappu.Battle.TileSelector._SortTiles_DistToOwnerAsc'}
 methods=[]
 for row in n.methods:
  fullname=n.typename(row['declaringType'])+'.'+n.string(row['nameIndex'])
  if fullname in names or (n.typename(row['declaringType'])=='Torappu.Battle.TileSelector/Options'and n.string(row['nameIndex'])not in ['.ctor']):methods.append(n.method(row['index']))
 bodies=[]
 for method in methods:
  if not method['address']:continue
  start=method['address'];end=n.addresses[bisect.bisect_right(n.addresses,start)];cur=start;parts=[]
  while cur<end:
   b=n.disassemble_at(cur,end-cur,method=method if cur==start else None)
   for ins in b['instructions']:
    if len(ins.get('methods',[]))>100:ins['methodAliasCount']=len(ins.pop('methods'));ins['methodAliasesOmitted']=True
   parts.append(b);nxt=int(b['end'],16)
   if nxt<=cur:raise RuntimeError('no progress')
   cur=nxt
  bodies.append({'selector':{'fullname':method['fullname'],'token':method['token']},'method':method,'logicalEnd':hex(end),'boundary':'all consecutive pdata fragments to next known method','fragments':parts})
 provenance=n.provenance();provenance['queryScript']=m.fingerprint(Path(__file__));a.out.mkdir(parents=True,exist_ok=True);(a.out/'endpoint-native.json').write_text(json.dumps({'provenance':provenance,'result':{'types':selected,'bodies':bodies}},ensure_ascii=False,indent=2)+'\n');print(json.dumps({'types':len(selected),'bodies':len(bodies)}))
if __name__=='__main__':main()
