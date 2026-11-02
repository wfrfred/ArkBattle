#!/usr/bin/env python3
"""Decode the selected ordinary healer resources with archived type-tree parsing."""
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
import argparse, hashlib, importlib.util, json, struct, sys
from pathlib import Path
sys.dont_write_bytecode = True
ROOT = Path.cwd()
TOOLS = ROOT / '.agents/skills/arkbattle-native-research/scripts'
sys.path.insert(0, str(TOOLS))
from unity_assets import Reader, bundle, serialized
from native import fingerprint
TREE = ROOT / 'docs/research/evidence/attack-addon-order-20261102/content/decode_content.py'
spec = importlib.util.spec_from_file_location('archived_tree_decoder', TREE)
tree = importlib.util.module_from_spec(spec)
spec.loader.exec_module(tree)

def decode(raw, nodes):
    r = Reader(raw)
    def walk(index):
        n = nodes[index]
        if n['type'] == 'string': value = r.string()
        elif n['flags'] & 1: value = [walk(n['children'][1]) for _ in range(r.val('i'))]
        elif n['children']: value = {nodes[c]['name']: walk(c) for c in n['children']}
        else:
            data = r.read(n['width'])
            fmt = {'float':'<f','double':'<d','bool':'<?','int':'<i','unsigned int':'<I','SInt64':'<q','UInt64':'<Q','common:222':'<i','common:161':'<f','common:928':'<B','common:814':'<q'}.get(n['type'])
            value = struct.unpack(fmt, data)[0] if fmt and struct.calcsize(fmt)==len(data) else {'type':n['type'],'hex':data.hex()}
        if n['meta'] & 0x4000: r.align()
        return value
    result = walk(0)
    assert r.p == len(raw), (r.p, len(raw))
    return result

def main():
    p=argparse.ArgumentParser();p.add_argument('--game',type=Path,default=Path('/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game'));p.add_argument('--out',type=Path,required=True);p.add_argument('--bundle',action='append',required=True);p.add_argument('--find',default='');p.add_argument('--object',type=int,action='append');p.add_argument('--template',action='append');a=p.parse_args()
    a.out.mkdir(parents=True,exist_ok=True);sources=[];rows=[]
    for rel in a.bundle:
        path=a.game/'Arknights_Data/StreamingAssets/AB/Windows'/rel;sources.append(fingerprint(path))
        for filename,data in bundle(path)[0]:
            if filename.endswith(('.resS','.resource')):continue
            state=serialized(data);layouts=tree.trees(data);names={};transforms={}
            for o in state['objects']:
                raw=data[o['start']:o['start']+o['size']]
                if o['classid']==1:
                    r=Reader(raw);r.read(r.val('i')*12);r.val('i');names[o['id']]=r.string()
                elif o['classid']==4:
                    t=decode(raw,layouts[o['typeid']]);transforms[o['id']]=(t['common:374']['m_PathID'],t['m_Father']['m_PathID'])
            by_owner={owner:tid for tid,(owner,_) in transforms.items()}
            for o in state['objects']:
                if o['classid']!=114:continue
                if a.object and o['id'] not in a.object:continue
                raw=data[o['start']:o['start']+o['size']];owner=struct.unpack_from('<q',raw,4)[0];name=names.get(owner,'')
                if a.find and a.find not in name and a.find.encode() not in raw:continue
                value=decode(raw,layouts[o['typeid']]);hierarchy=[];tid=by_owner.get(owner)
                while tid:
                    go,parent=transforms[tid];hierarchy.append({'name':names[go],'gameObjectPathId':str(go),'transformPathId':str(tid)});tid=parent
                rawfile=path.stem+'-'+str(o['id'])+'.bin'
                if a.template:
                    if '_templates' not in value:continue
                    selected=[]
                    for index,t in enumerate(value['_templates']['Array']):
                        if t['templateKey'] not in a.template:continue
                        entry=dict(t);entry['templateIndex']=index;entry['events']=[{'event':e['key'],'actions':json.loads(e['value']['SerializedState'])} for e in entry.pop('eventToActions')['_items']['Array']];selected.append(entry)
                    value={'templates':selected};rawfile=None
                else:(a.out/rawfile).write_bytes(raw)
                rows.append({'bundle':rel,'file':filename,'pathId':str(o['id']),'name':name,'hierarchy':hierarchy,'sha256':hashlib.sha256(raw).hexdigest(),'rawFile':rawfile,'value':value})
    result={'provenance':{'collectedOn':'2026-11-03','script':fingerprint(Path(__file__)),'tools':[fingerprint(TREE),fingerprint(TOOLS/'unity_assets.py'),fingerprint(TOOLS/'native.py')],'sources':sources,'scope':'Static installed type-tree content; two selected ordinary healers; no runtime or XLua verification.'},'result':rows}
    (a.out/'decoded-content.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'out':str(a.out),'components':len(rows),'summary':[{'bundle':r['bundle'],'pathId':r['pathId'],'name':r['name'],'fields':list(r['value'])} for r in rows]},ensure_ascii=False))
if __name__=='__main__':main()
