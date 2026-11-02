#!/usr/bin/env python3
"""Decode selected Nymph MonoBehaviours from installed Unity type trees."""
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
import argparse
import hashlib
import json
from pathlib import Path
import struct
import sys

sys.dont_write_bytecode = True
TOOLS = Path.cwd() / '.agents/skills/arkbattle-native-research/scripts'
sys.path.insert(0, str(TOOLS))
from native import fingerprint
from unity_assets import Reader, bundle, serialized, script


def trees(data):
    reader = Reader(data, '>')
    reader.read(48)
    reader.e = '<'
    reader.cs()
    reader.val('i')
    assert reader.val('B')
    layouts = []
    for _ in range(reader.val('i')):
        class_id = reader.val('i')
        reader.val('B')
        reader.val('h')
        if class_id == 114:
            reader.read(16)
        reader.read(16)
        count, size = reader.val('ii')
        raw, strings = reader.read(count * 32), reader.read(size)
        def string(offset):
            if offset & 0x80000000:
                return {49: 'Array', 840: 'string'}.get(offset & 0x7fffffff, f'common:{offset & 0x7fffffff}')
            return strings[offset:strings.index(0, offset)].decode()
        nodes = []
        for index in range(count):
            _, level, flags, typ, name, width, _, meta, _ = struct.unpack_from('<HBBIIiiiQ', raw, index * 32)
            nodes.append(dict(level=level, flags=flags, type=string(typ), name=string(name), width=width, meta=meta, children=[]))
        stack = []
        for index, node in enumerate(nodes):
            while stack and nodes[stack[-1]]['level'] >= node['level']:
                stack.pop()
            if stack:
                nodes[stack[-1]]['children'].append(index)
            stack.append(index)
        layouts.append(nodes)
        reader.read(reader.val('i') * 4)
    position=reader.p
    for _ in range(reader.val('i')):
        reader.align();reader.read(24)
    for _ in range(reader.val('i')):
        reader.val('i');reader.align();reader.val('q')
    externals=[]
    for _ in range(reader.val('i')):
        empty=reader.cs();guid=reader.read(16).hex();typ=reader.val('i');path=reader.cs();externals.append(dict(fileId=len(externals)+1,guid=guid,type=typ,path=path))
    return layouts,externals


def decode(raw, nodes):
    reader = Reader(raw)
    def walk(index):
        node = nodes[index]
        if node['type'] == 'string':
            value = reader.string()
        elif node['flags'] & 1:
            value = [walk(node['children'][1]) for _ in range(reader.val('i'))]
        elif node['children']:
            value = {nodes[child]['name']: walk(child) for child in node['children']}
        else:
            data = reader.read(node['width'])
            fmt = {'float': '<f', 'double': '<d', 'bool': '<?', 'int': '<i', 'unsigned int': '<I', 'SInt64': '<q', 'UInt64': '<Q', 'common:222': '<i', 'common:161': '<f', 'common:928': '<?', 'common:814': '<q'}.get(node['type'])
            value = struct.unpack(fmt, data)[0] if fmt and struct.calcsize(fmt) == len(data) else dict(type=node['type'], hex=data.hex())
        if node['meta'] & 0x4000:
            reader.align()
        return value
    result = walk(0)
    assert reader.p == len(raw), (reader.p, len(raw))
    return result


def main():
    parser=argparse.ArgumentParser();parser.add_argument('--game',type=Path,default=Path('/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game'));parser.add_argument('--out',type=Path,required=True);args=parser.parse_args();args.out.mkdir(parents=True,exist_ok=True)
    relative='battle/prefabs/[uc]projectiles.ab';path=args.game/'Arknights_Data/StreamingAssets/AB/Windows'/relative
    assert fingerprint(path)['sha256']=='cc3f21b73b10fbc619a1ff8b099f31e678c883ddacb7bb6775fea960ffecb0e1'
    scripts_path=args.game/'Arknights_Data/StreamingAssets/AB/Windows/anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin'
    assert fingerprint(scripts_path)['sha256']=='10fca9cc0cc0fde445e5133c004ef08f776640fb99440e3cb8949fa7d9541c99'
    scripts={};script_file=None
    for sf,sd in bundle(scripts_path)[0]:
        if sf!='CAB-658d74aab777086fc32b93f385be999a':continue
        script_file=sf;ss=serialized(sd)
        for so in ss['objects']:
            if so['classid']==115:scripts[so['id']]=script(so,sd)
    assert script_file, 'required external MonoScript SerializedFile absent'
    rows=[];files,version=bundle(path)
    for filename,data in files:
        if filename.endswith(('.resS','.resource')):continue
        state=serialized(data);layouts,externals=trees(data);names={};transforms={}
        for obj in state['objects']:
            raw=data[obj['start']:obj['start']+obj['size']]
            if obj['classid']==1:
                reader=Reader(raw);reader.read(reader.val('i')*12);reader.val('i');names[obj['id']]=reader.string()
            elif obj['classid']==4:
                value=decode(raw,layouts[obj['typeid']]);transforms[obj['id']]=(value['common:374']['m_PathID'],value['m_Father']['m_PathID'])
        byowner={owner:tid for tid,(owner,_) in transforms.items()}
        for obj in state['objects']:
            if obj['classid']!=114:continue
            raw=data[obj['start']:obj['start']+obj['size']];owner=struct.unpack_from('<q',raw,4)[0];hier=[];tid=byowner.get(owner)
            while tid:
                go,parent=transforms[tid];hier.append(dict(name=names[go],gameObjectPathId=str(go),transformPathId=str(tid)));tid=parent
            if not any(row['name']=='projectile_chr_nymph_s1' for row in hier):continue
            value=decode(raw,layouts[obj['typeid']]);scriptref=value['common:490'];assert scriptref['m_FileID']==1;assert externals[0]['path'].endswith('/'+script_file);binding=scripts[scriptref['m_PathID']];rawfile=f"projectile-{obj['id']}.bin";(args.out/rawfile).write_bytes(raw)
            rows.append(dict(bundle=relative,file=filename,pathId=str(obj['id']),name=names.get(owner,''),hierarchy=hier,typeId=obj['typeid'],monoScript=dict(file=script_file,**binding),externalScriptReference=externals[0],sha256=hashlib.sha256(raw).hexdigest(),rawFile=rawfile,value=value))
    result=dict(provenance=dict(collectedOn='2026-11-03',script=fingerprint(Path(__file__)),lock=fingerprint(Path(str(Path(__file__))+'.lock')),tools=[fingerprint(TOOLS/name) for name in ['assets.py','unity_assets.py','native.py']],source=fingerprint(path),monoScriptSource=fingerprint(scripts_path),scope='Current real S1 projectile prefab hierarchy only; static configuration, not runtime observation.'),result=rows)
    (args.out/'projectile-content.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    for r in rows:print(r['name'],r['pathId'],list(r['value']))
if __name__=='__main__':main()
