#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Fresh static witnesses for autonomous movement while a block tween survives."""
import argparse, bisect, json, sys
from pathlib import Path
ROOT = next(p for p in Path(__file__).resolve().parents if (p/'package.json').is_file())
sys.dont_write_bytecode = True
sys.path.insert(0, str(ROOT/'.agents/skills/arkbattle-native-research/scripts'))
from native import Native, DEFAULT_GAME, fingerprint
EXPECTED={'dll':'583b04ff4d1b1a4b35eaf09d77d936408c25447c9e345ef0463d814b6a123fc5','metadata':'d3fede171f92740a6f5dc053c58c7013d3c962db764ad1f05cbe977c074fcd1f'}
IDS={63043,91778,66413,71056,76320,76341,76358,76359,76487,76491,76656,76658,76699,76700,76877,76878}
TYPE_NAMES={'Torappu.Battle.Enemy','Torappu.Battle.Entity','Torappu.Battle.Enemy/States/MoveState','Torappu.Battle.MoveController'}

def main():
 p=argparse.ArgumentParser();p.add_argument('--game',type=Path,default=DEFAULT_GAME);p.add_argument('--out',type=Path,required=True);p.add_argument('--method',type=int,action='append',default=[]);p.add_argument('--query',action='append',default=[]);a=p.parse_args()
 n=Native(a.game); provenance=n.provenance();provenance['extractionScript']=fingerprint(Path(__file__))
 if any(provenance['client'][k]['sha256']!=v for k,v in EXPECTED.items()):raise ValueError('historical client identity changed')
 a.out.mkdir(parents=True,exist_ok=True)
 def save(name,result):
  (a.out/name).write_text(json.dumps({'provenance':provenance,'result':result},ensure_ascii=False,indent=2)+'\n')
 enemy=next(t for t in n.types if n.typename(t['index'])=='Torappu.Battle.Enemy')
 metadata=[n.method(m['index']) for m in n.methods[enemy['methodStart']:enemy['methodStart']+enemy['methodCount']]]
 save('enemy-methods.json',metadata)
 selected_fields=[f for f in n.fields(enemy['index']) if not f['static'] and f['name'] in ('m_blocker','m_blockTween','m_combatNextEscapeTime','_combatEscapeTime')]
 save('selected-fields.json',dict(type=n.typename(enemy['index']),fields=selected_fields))
 ids=set(IDS)|set(a.method)
 field_candidates=[]
 for section in n.pe.sections:
  if not section['executable']:continue
  code=n.pe.data[section['offset']:section['offset']+section['raw_size']];pos=0
  while (pos:=code.find(b'\x08\x05\x00\x00',pos))>=0:
   at=section['address']+pos;own=n.addresses[bisect.bisect_right(n.addresses,at)-1]
   owners=[n.method(i) for i in n.address_methods[own] if n.typename(n.methods[i]['declaringType']).startswith('Torappu.Battle.Enemy')]
   if owners:
    field_candidates.append(dict(at=hex(at),owners=[dict(index=m['index'],fullname=m['fullname']) for m in owners]))
    ids.update(m['index'] for m in owners)
   pos+=1
 save('field508-candidates.json',field_candidates)
 for t in n.types:
  tn=n.typename(t['index'])
  if tn in TYPE_NAMES:
   save('type-'+str(t['index'])+'.json',dict(t,fullname=tn,fields=n.fields(t['index'])))
 a.query.append('Enemy/CombatWrapper.StartCombat')
 if a.query:
  for m in n.methods:
   short=n.string(m['nameIndex'])
   if any(q.split('.')[-1].casefold() in short.casefold() for q in a.query):
    current=n.method(m['index'])
    if any(q.casefold() in current['fullname'].casefold() for q in a.query):ids.add(m['index'])
 bodies=[]
 for i in sorted(ids):
  m=n.method(i)
  if not m.get('address'):continue
  start=m['address']; limit=n.addresses[bisect.bisect_right(n.addresses,start)]
  pending=[n.disassemble(i)];seen={start}
  while pending:
   body=pending.pop()
   for instruction in body['instructions']:
    if len(instruction.get('methods',[]))>8:
     instruction['omittedSharedAliasCount']=len(instruction.pop('methods'))
   bodies.append(dict(selector=f'method-{i}',**body))
   save('method-'+str(i)+'-'+body['address'][2:]+'.json',body)
   targets=[int(ins['target'],16) for ins in body['instructions'] if ins.get('targetOutsideRange')]
   if body['fullyDecoded'] and body['instructions'] and body['instructions'][-1]['mnemonic'] not in ('ret','jmp','int3'):targets.append(int(body['end'],16))
   for target in targets:
    if start<=target<limit and target not in seen:
     seen.add(target);pending.append(n.disassemble_at(target))
 save('selected-movement.json',dict(date='2026-10-31',type=dict(fullname=n.typename(enemy['index']),fields=selected_fields),methods=[n.method(i) for i in sorted(ids)],bodies=bodies))
 print(f'{len(ids)} methods / {len(bodies)} native ranges')
if __name__=='__main__':main()
