#!/usr/bin/env python3
"""Select operator keyframes, module parts and trust rows from fixed mirror tables."""
from pathlib import Path
import argparse,json,hashlib
p=argparse.ArgumentParser();p.add_argument('--data',type=Path,required=True);p.add_argument('--out',type=Path,required=True);a=p.parse_args()
REV='17759cc8cdf37388414145d16262a3a06f3ab25e'
tables={};sources=[]
for name in ['character_table.json','uniequip_table.json','battle_equip_table.json','favor_table.json']:
 raw=(a.data/name).read_bytes();tables[name]=json.loads(raw)
 sources.append({'url':f'https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/{REV}/zh_CN/gamedata/excel/{name}','revision':REV,'bytes':len(raw),'sha256':hashlib.sha256(raw).hexdigest(),'gitBlobSha1':hashlib.sha1(b'blob '+str(len(raw)).encode()+b'\0'+raw).hexdigest()})
characters=[]
for key in ['char_311_mudrok','char_2025_shu']:
 c=tables['character_table.json'][key]
 characters.append({'source':'character_table.json','pointer':'/'+key,'name':c['name'],'phases':[{'maxLevel':ph['maxLevel'],'attributesKeyFrames':ph['attributesKeyFrames']} for ph in c['phases']],'favorKeyFrames':c['favorKeyFrames'],'talents':c['talents']})
modules=[]
for key in ['uniequip_002_mudrok','uniequip_002_shu']:
 e=tables['uniequip_table.json']['equipDict'][key]
 modules.append({'equipmentSource':{'file':'uniequip_table.json','pointer':'/equipDict/'+key},'equipment':{k:e[k] for k in ['uniEquipId','charId','unlockEvolvePhase','unlockLevel','unlockFavors']},'battleSource':{'file':'battle_equip_table.json','pointer':'/'+key},'battle':tables['battle_equip_table.json'][key]})
favor=tables['favor_table.json']
result={'provenance':{'scope':'Selected JSON records from a fixed third-party mirror; separate from current native client version. Full input byte hashes recorded; no runtime activation observation.','sources':sources},'result':{'characters':characters,'modules':modules,'favor':favor}}
a.out.mkdir(parents=True,exist_ok=True);(a.out/'configuration.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print('selected',len(characters),'characters',len(modules),'modules',len(favor['favorFrames']),'favor rows')
