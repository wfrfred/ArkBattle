#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
"""Resolve only Mulberry Trait's external MonoScript using case27's known script bundle."""
import argparse,hashlib,importlib.util,json,struct,sys
from pathlib import Path
sys.dont_write_bytecode=True
ROOT=Path.cwd();TOOLS=ROOT/'.agents/skills/arkbattle-native-research/scripts';sys.path.insert(0,str(TOOLS))
from native import fingerprint
from unity_assets import bundle,serialized,script
HELPER=ROOT/'docs/research/evidence/nymph-action-settlement-20261103/projectile/decode_projectile.py'
spec=importlib.util.spec_from_file_location('case27_external_reader',HELPER);helper=importlib.util.module_from_spec(spec);spec.loader.exec_module(helper)
def main():
 p=argparse.ArgumentParser();p.add_argument('--game',type=Path,default=Path('/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game'));p.add_argument('--out',type=Path,required=True);a=p.parse_args();a.out.mkdir(parents=True,exist_ok=True)
 base=a.game/'Arknights_Data/StreamingAssets/AB/Windows';char_path=base/'charpack/char_473_mberry.ab';scripts_path=base/'anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin'
 assert fingerprint(char_path)['sha256']=='ef53adb2b73899bf2db7b52102af86cb1612915f01f41a4e16e4a6417b204acb'
 assert fingerprint(scripts_path)['sha256']=='10fca9cc0cc0fde445e5133c004ef08f776640fb99440e3cb8949fa7d9541c99'
 char_file='CAB-64da1f07e74ec4318182d559126b9e0a';script_file='CAB-658d74aab777086fc32b93f385be999a'
 data=next(data for name,data in bundle(char_path)[0] if name==char_file);state=serialized(data);layouts,externals=helper.trees(data);obj=next(o for o in state['objects'] if o['id']==2182608855241056915);raw=data[obj['start']:obj['start']+obj['size']];value=helper.decode(raw,layouts[obj['typeid']]);ptr=value['common:490'];assert ptr=={'m_FileID':1,'m_PathID':-8004000125733044417}
 external=externals[ptr['m_FileID']-1];assert external['path'].split('/')[-1]==script_file
 sd=next(data for name,data in bundle(scripts_path)[0] if name==script_file);so=next(o for o in serialized(sd)['objects'] if o['id']==ptr['m_PathID']);assert so['classid']==115;script_raw=sd[so['start']:so['start']+so['size']];decoded=script(so,sd)
 assert decoded['cl']=='PassiveAttachmentAbility' and decoded['ns']=='Torappu.Battle.Abilities' and decoded['asm']=='Assembly-CSharp.dll'
 raw_name='MonoScript-'+str(so['id'])+'.bin';(a.out/raw_name).write_bytes(script_raw)
 result={'trait':{'bundle':'charpack/char_473_mberry.ab','file':char_file,'pathId':str(obj['id']),'sha256':hashlib.sha256(raw).hexdigest(),'scriptPPtr':{'fileId':ptr['m_FileID'],'pathId':str(ptr['m_PathID'])}},'externalScriptReference':external,'resolvedMonoScript':{'bundle':'anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin','file':script_file,'classId':so['classid'],'pathId':str(so['id']),'sha256':hashlib.sha256(script_raw).hexdigest(),'rawFile':raw_name,'value':decoded},'scope':'Direct external PPtr -> exact SerializedFile -> exact MonoScript object identity; no runtime/XLua verification; no bundle scan.'}
 out={'provenance':{'collectedOn':'2026-11-03','script':fingerprint(Path(__file__)),'helper':fingerprint(HELPER),'tools':[fingerprint(TOOLS/'native.py'),fingerprint(TOOLS/'unity_assets.py')],'sources':[fingerprint(char_path),fingerprint(scripts_path)],'scriptBundleLocator':'Existing case27 projectile/decode_projectile.py known current bundle path and SHA256'},'result':result};(a.out/'trait-script-binding.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n');print(json.dumps(result,ensure_ascii=False))
if __name__=='__main__':main()
