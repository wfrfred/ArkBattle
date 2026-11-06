#!/usr/bin/env python3
"""Verify MODIFIER_TARGET's metadata value and native switch destination."""
import argparse,json,re,struct,sys
from pathlib import Path
sys.dont_write_bytecode=True
ROOT=Path(__file__).resolve().parents[4];sys.path.insert(0,str(ROOT/'.agents/skills/arkbattle-native-research/scripts'))
from native import Native,PE,DEFAULT_GAME
p=argparse.ArgumentParser();p.add_argument('--game',type=Path,default=DEFAULT_GAME);p.add_argument('--native',type=Path,required=True);p.add_argument('--out',type=Path,required=True);a=p.parse_args()
evidence=json.loads(a.native.read_text())['result'];t=next(t for t in evidence['types'] if t['name']=='Torappu.Battle.Action.Nodes/ActionTargetType');f=next(f for f in t['fields'] if f['name']=='MODIFIER_TARGET')
n=Native.__new__(Native);n.metadata=(a.game/'Arknights_Data/il2cpp_data/Metadata/global-metadata.dat').read_bytes();rec=next(r for r in n.records(7,'<iii','fieldIndex typeIndex dataIndex') if r['fieldIndex']==f['index']);start,_=n.table(8);raw=n.metadata[start+rec['dataIndex']];assert raw<128;value=(raw>>1)^-(raw&1)
b=next(b for b in evidence['bodies'] if b['method']['fullname']=='Torappu.Battle.Action.Nodes.GetActionTarget');ins=[i for part in b['parts'] for i in part['instructions']];switch=next(i for i in ins if i['mnemonic']=='mov' and 'rdx + rdi*4 +' in i['operands']);offset=int(re.search(r'\+ (0x[0-9a-f]+)\]',switch['operands']).group(1),16)
pe=PE(a.game/'GameAssembly.dll');target=pe.base+struct.unpack('<I',pe.read(pe.base+offset+value*4,4))[0]
result=dict(fieldIndex=f['index'],name=f['name'],metadataDefault=rec,compressedByte=raw,value=value,jumpTable=hex(pe.base+offset),selectedBranch=hex(target),branchGetter=next(i for i in ins if any(x=='Torappu.Battle.Modifier.get_target' for x in i.get('methods',[]))))
a.out.parent.mkdir(parents=True,exist_ok=True);a.out.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
