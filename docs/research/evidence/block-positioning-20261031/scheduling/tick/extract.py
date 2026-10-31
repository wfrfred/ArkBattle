#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Fresh static Tween manager scheduling/ownership witnesses."""
import argparse,bisect,json,sys
from pathlib import Path
sys.dont_write_bytecode=True
ROOT=next(p for p in Path(__file__).resolve().parents if (p/'package.json').is_file())
sys.path.insert(0,str(ROOT/'.agents/skills/arkbattle-native-research/scripts'))
from native import Native,DEFAULT_GAME,fingerprint
EXPECTED={'dll':'583b04ff4d1b1a4b35eaf09d77d936408c25447c9e345ef0463d814b6a123fc5','metadata':'d3fede171f92740a6f5dc053c58c7013d3c962db764ad1f05cbe977c074fcd1f'}
WITNESS_IDS={22097,22098,22108,22112,22113,22117,64825,76433,76492,76564,76565}
QUERIES=('Torappu.BattleTweenMgr.', 'Torappu.BattleTweenMgr/Tween.', 'BattleController.OnTick', 'BattleController.StartBattleTween', 'BattleController.get_battleTweenMgr','Enemy.UnregisterBlocker','Enemy.ReleaseFromBlocker','Enemy._MoveToBlockPosition','Enemy.<_MoveToBlockPosition>','Enemy.get_isBlock','Enemy.get_isInCombat','Enemy.get_isMovingBySelf')
def main():
 p=argparse.ArgumentParser();p.add_argument('--game',type=Path,default=DEFAULT_GAME);p.add_argument('--out',type=Path,required=True);p.add_argument('--query',action='append',default=[]);p.add_argument('--address',action='append',type=lambda v:int(v,0),default=[]);a=p.parse_args()
 n=Native(a.game); prov=n.provenance();prov['entrypoint']=fingerprint(Path(__file__))
 if any(prov['client'][k]['sha256']!=v for k,v in EXPECTED.items()):raise ValueError('input fingerprint differs; re-locate selectors')
 a.out.mkdir(parents=True,exist_ok=True)
 ms=[]
 for m in n.methods:
  name=n.typename(m['declaringType'])+'.'+n.string(m['nameIndex'])
  if (m['index'] in WITNESS_IDS and any(q.casefold() in name.casefold() for q in QUERIES)) or any(q.casefold() in name.casefold() for q in a.query):ms.append(n.method(m['index']))
 bodies=[]
 def save_body(label,start,body):
  pos=bisect.bisect_right(n.addresses,start);limit=n.addresses[pos] if pos<len(n.addresses) else start
  pending=[body];seen={start}
  while pending:
   part=pending.pop();part=dict(part); part['selector']=label
   for ins in part['instructions']:
    if len(ins.get('methods',[]))>16:ins['sharedAliasCount']=len(ins.pop('methods'))
   bodies.append(part)
   refs=[int(i['target'],16) for i in part['instructions'] if i.get('targetOutsideRange')]
   if part['fullyDecoded'] and part['instructions'] and part['instructions'][-1]['mnemonic'] not in ('ret','jmp','int3'):refs.append(int(part['end'],16))
   for x in refs:
    if start<=x<limit and x not in seen:seen.add(x);pending.append(n.disassemble_at(x))
 for m in ms:
  if m.get('address'):save_body(f'method-{m["index"]}',m['address'],n.disassemble(m['index']))
 for x in a.address:save_body(f'address-{x:x}',x,n.disassemble_at(x))
 ts=[dict(fullname=n.typename(t['index']),index=t['index'],fields=n.fields(t['index'])) for t in n.types if n.typename(t['index']) in ('Torappu.BattleTweenMgr','Torappu.BattleTweenMgr/Tween')]
 data=dict(provenance=prov,result=dict(methods=ms,types=ts,bodies=bodies))
 (a.out/'selected-native.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
 for m in ms:print(m['index'],hex(m.get('address',0)),m['fullname'])
 print('wrote',a.out/'selected-native.json')
if __name__=='__main__':main()
