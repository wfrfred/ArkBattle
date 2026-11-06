#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
import argparse,json,sys
from pathlib import Path
sys.dont_write_bytecode=True
sys.path.insert(0,str(Path.cwd()/'.agents/skills/arkbattle-native-research/scripts'))
from native import Native, DEFAULT_GAME
p=argparse.ArgumentParser();p.add_argument('--game',type=Path,default=DEFAULT_GAME);p.add_argument('--out',type=Path,required=True);a=p.parse_args()
n=Native(a.game)
selected=[]
for t in n.types:
 name=n.typename(t['index'])
 if name in ['Torappu.Battle.Deck/Card','Torappu.Battle.Deck/TokenCard','Torappu.Battle.Token','Torappu.Battle.Trap','Torappu.Battle.Deck/Card/CardPolicy','Torappu.Battle.Deck/Card/RechargeTiming','Torappu.Battle.Character','Torappu.Battle.Deck/CharCard','Torappu.Battle.Deck/CharacterCard','Torappu.Battle.Deck/PredefinedCard']:
  methods=[n.method(i) for i in range(t['methodStart'],t['methodStart']+t['methodCount'])]
  if name=='Torappu.Battle.Character':methods=[m for m in methods if any(s in m['fullname'].lower() for s in ['recycle','card','withdraw','finish','cost','respawn'])]
  selected.append(dict(name=name,index=t['index'],fields=n.fields(t['index']),methods=methods))
body_names={'Torappu.Battle.Deck/TokenCard.OnRecycle','Torappu.Battle.Deck/TokenCard.OnSummon','Torappu.Battle.Deck/TokenCard.OnUse','Torappu.Battle.Deck/TokenCard..ctor','Torappu.Battle.Deck/Card.OnRecycle','Torappu.Battle.Deck/Card.OnUse','Torappu.Battle.Deck/Card.Recharge','Torappu.Battle.Deck/Card.Draw', 'Torappu.Battle.Deck/Card..ctor', 'Torappu.Battle.Deck/Card.Init', 'Torappu.Battle.Deck/Card.get_cardPolicy', 'Torappu.Battle.Deck/Card.get_isInfinity', 'Torappu.Battle.Deck/Card.OnSpawned', 'Torappu.Battle.Deck/TokenCard.Init', 'Torappu.Battle.Deck/TokenCard.OnFetchDataFromPrefab', 'Torappu.Battle.Deck/TokenCard.Recharge', 'Torappu.Battle.Deck/TokenCard.ForceRecharge', 'Torappu.Battle.Deck/TokenCard.get_isInfinity', 'Torappu.Battle.Deck/TokenCard.OnSpawned', 'Torappu.Battle.Deck/Card.OnSpawnOperationSucceed', 'Torappu.Battle.Deck/Card.ModifyRespawnParameters', 'Torappu.Battle.Deck/CharCard..ctor', 'Torappu.Battle.Deck/CharCard.OnRecycle', 'Torappu.Battle.Deck/CharCard.get_cardPolicy', 'Torappu.Battle.Deck/CharCard.get_isInfinity'}
body_names |= {'Torappu.Battle.Deck/CharacterCard..ctor','Torappu.Battle.Deck/CharacterCard.get_isInfinity','Torappu.Battle.Deck/CharacterCard.get_cardPolicy','Torappu.Battle.Deck/TokenCard.get_cost','Torappu.Battle.Deck/TokenCard.get_rawCost','Torappu.Battle.Deck/TokenCard.get_cardPolicy'}
# Include Card methods containing the cost-counter enable field or multiplier offsets.
for entry in selected:
 if entry['name'] in ['Torappu.Battle.Deck/Card','Torappu.Battle.Deck/TokenCard','Torappu.Battle.Deck/CharacterCard']:
  for method in entry['methods']:
   if not method['address']:continue
   end=next(x for x in n.addresses if x>method['address'])
   raw=n.pe.read(method['address'],end-method['address'])
   if any(value.to_bytes(4,'little') in raw for value in [0x15c,0x160,0x168]):body_names.add(method['fullname'])
bodies=[]
for entry in selected:
 for m in entry['methods']:
  if m['fullname'] not in body_names or not m['address']:continue
  limit=next(x for x in n.addresses if x>m['address']);cursor=m['address'];parts=[]
  while cursor<limit:
   body=n.disassemble_at(cursor);parts.append(body);end=int(body['end'],16)
   if end<=cursor:raise ValueError('nonprogress')
   cursor=end
  bodies.append(dict(method=m,followingMethodAddress=hex(limit),parts=parts))
# Recover enum values from this client's compressed metadata defaults.
defaults=n.records(7,'<iii','fieldIndex typeIndex dataIndex');data_start,_=n.table(8)
for entry in selected:
 if entry['name'].endswith(('/CardPolicy','/RechargeTiming')):
  for field in entry['fields']:
   record=next((d for d in defaults if d['fieldIndex']==field['index']),None)
   if record is not None and record['dataIndex']>=0:
    value=n.metadata[data_start+record['dataIndex']];assert value<128
    field['enumValue']=(value>>1)^-(value&1)
# Remove unrelated generic-method aliases from the evidence projection.
for body in bodies:
 for part in body['parts']:
  for ins in part['instructions']:
   if 'methods' in ins:ins['methods']=[name for name in ins['methods'] if name.startswith(('Torappu.Battle.','Torappu.FP.','Torappu.PeriodicTimer.','XLua.DelegateBridge.'))]
a.out.parent.mkdir(parents=True,exist_ok=True)
a.out.write_text(json.dumps(dict(provenance=n.provenance(),types=selected,bodies=bodies),ensure_ascii=False,indent=2)+'\n')
print('types',len(selected),'bodies',len(bodies))
