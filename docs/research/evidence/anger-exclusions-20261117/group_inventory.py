#!/usr/bin/env python3
"""Locate the selected empty-animation fallback's inherited casting and option path."""
import argparse
import json
import sys
from pathlib import Path
ROOT = Path.cwd()
sys.dont_write_bytecode = True
sys.path.insert(0, str(ROOT / '.agents/skills/arkbattle-native-research/scripts'))
from native import Native, DEFAULT_GAME, fingerprint

def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--out',type=Path,required=True);a=p.parse_args();n=Native(DEFAULT_GAME)
 names={'Torappu.Battle.Abilities.AbilityFirstSucceedGroup','Torappu.Battle.Abilities.EmptyAnimatedAbility','Torappu.Battle.EmptyAbility'}
 selected=[];pending=list(names)
 while pending:
  name=pending.pop()
  if name in [x['fullname'] for x in selected]:continue
  t=next(x for x in n.types if n.typename(x['index'])==name)
  parent=n.type_name(t['parentIndex']) if t['parentIndex']>=0 else None
  methods=[n.method(i) for i in range(t['methodStart'],t['methodStart']+t['methodCount'])]
  selected.append({'fullname':name,'index':t['index'],'parent':parent,'methods':methods,'fields':n.fields(t['index'])})
  if parent and 'Group' in parent:pending.append(parent)
 result={'types':selected}
 a.out.parent.mkdir(parents=True,exist_ok=True);a.out.write_text(json.dumps({'provenance':n.provenance()|{'checkedOn':'2026-11-17','caseTool':{'script':fingerprint(Path(__file__))}},'result':result},ensure_ascii=False,indent=2)+'\n')
 print(json.dumps([(x['fullname'],x['parent'],[(m['index'],m['fullname']) for m in x['methods']]) for x in selected],ensure_ascii=False))
if __name__=='__main__':main()
