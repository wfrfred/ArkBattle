#!/usr/bin/env python3
"""Installed Ch'en alter mode/attack counter bindings for charged S2 ammunition."""
import argparse
import hashlib
import importlib.util
import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True
ROOT = next(p for p in Path(__file__).resolve().parents
            if (p / '.agents/skills/arkbattle-native-research/scripts/native.py').exists())
TOOL = ROOT / 'docs/research/evidence/targeting-pipeline-20261109/content/extract_content.py'
spec = importlib.util.spec_from_file_location('chen2_counter_decoder', TOOL)
helper = importlib.util.module_from_spec(spec)
spec.loader.exec_module(helper)


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--game',type=Path,default=Path('/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game'))
    p.add_argument('--out',type=Path,default=Path(__file__).with_name('chen2.json'))
    a=p.parse_args()
    base=a.game/'Arknights_Data/StreamingAssets/AB/Windows'
    scripts,sources,rows={},[],[]
    path=base/'anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin'
    sources.append(helper.fingerprint(path))
    for filename,data in helper.bundle(path)[0]:
        if filename.endswith(('.resS','.resource')):continue
        for obj in helper.serialized(data)['objects']:
            if obj['classid']==115:scripts[(filename,int(obj['id']))]=helper.script(obj,data)
    path=base/'charpack/char_1013_chen2.ab'
    sources.append(helper.fingerprint(path))
    for filename,data in helper.bundle(path)[0]:
        if filename.endswith(('.resS','.resource')):continue
        layouts,externals=helper.helper.trees(data)
        objects=helper.serialized(data)['objects']
        names,transforms={},{}
        for obj in objects:
            raw=data[obj['start']:obj['start']+obj['size']]
            if obj['classid']==1:
                r=helper.Reader(raw);r.read(r.val('i')*12);r.val('i');names[int(obj['id'])]=r.string()
            elif obj['classid']==4:transforms[int(obj['id'])]=helper.decode(raw,layouts[obj['typeid']])
        by_owner={v['common:374']['m_PathID']:tid for tid,v in transforms.items()}
        for obj in objects:
            if obj['classid']!=114:continue
            raw=data[obj['start']:obj['start']+obj['size']]
            value=helper.decode(raw,layouts[obj['typeid']]);owner=value['common:374']['m_PathID']
            hierarchy,tid=[],by_owner.get(owner)
            while tid:
                tr=transforms[tid];hierarchy.append(names[tr['common:374']['m_PathID']]);tid=tr['m_Father']['m_PathID']
            hierarchy.reverse();ptr=value['common:490']
            sf=filename if ptr['m_FileID']==0 else externals[ptr['m_FileID']-1]['path'].split('/')[-1]
            script=scripts[(sf,ptr['m_PathID'])]
            fields={k:v for k,v in value.items() if not k.startswith('common:')}
            if script['cl']=='Character':fields={k:v for k,v in fields.items() if k in ['_modes','_attack','_commonAbilities']}
            elif not ('S2' in hierarchy or 'S2+' in hierarchy) and 'Mode' not in script['cl'] and not any(s in json.dumps(fields) for s in ['trigger_time','another_trigger_time','_maxCount','_counterSource','_countKey']):continue
            rows.append(dict(file=filename,pathId=str(obj['id']),script=script,hierarchy=hierarchy,
                ownerPPtr=value['common:374'],objectSha256=hashlib.sha256(raw).hexdigest(),value=fields))
    out=dict(provenance=dict(checkedOn='2026-11-17',extractor=helper.fingerprint(Path(__file__)),
        decoder=helper.fingerprint(TOOL),sources=sources,
        scope='Single installed Character: root modes, complete S2/S2+ attack hierarchies and count/trigger-time configuration. No runtime/XLua observation.'),result=dict(components=rows))
    a.out.parent.mkdir(parents=True,exist_ok=True);a.out.write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(dict(components=len(rows))))


if __name__=='__main__':main()
