#!/usr/bin/env python3
"""Select current Nymph-S1 target/release methods by complete metadata names."""
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
import argparse
import json
from pathlib import Path
import sys

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path.cwd() / '.agents/skills/arkbattle-native-research/scripts'))
from native import Native, fingerprint

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--game', type=Path, required=True)
    parser.add_argument('--out', type=Path, required=True)
    parser.add_argument('--method', action='append', default=[])
    parser.add_argument('--scout', action='store_true')
    args = parser.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)
    native = Native(args.game)
    provenance = native.provenance()
    provenance.update(collectedOn='2026-11-03', extractionScript=fingerprint(Path(__file__)))
    expected = {'dll':'cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff',
                'metadata':'e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5'}
    assert all(provenance['client'][key]['sha256'] == digest for key,digest in expected.items())
    reference=Path('docs/research/evidence/attack-addon-order-20261102/content/decoded-content.json')
    content=json.loads(reference.read_text())
    checked=[]
    for source in content['provenance']['sources']:
        relative=source['path'].split('Arknights_Data/',1)[1]
        current=fingerprint(args.game/'Arknights_Data'/relative)
        assert current['sha256']==source['sha256']
        checked.append(current)
    provenance['reusedContent']=dict(reference=fingerprint(reference),currentSources=checked)
    if not args.method and not args.scout:
        args.method=[
            'Torappu.Battle.AbilityStandard.CastToTarget',
            'Torappu.Battle.AbilityStandard/<_DoCast>d__86.MoveNext',
            'Torappu.Battle.AbilityStandard.UpdateTargets',
            'Torappu.Battle.AbilityStandard.ExecuteSpell',
            'Torappu.Battle.Abilities.RangedAttack.UpdateTargets',
            'Torappu.Battle.Abilities.RangedAttack.OnCastOnTarget',
            'Torappu.Battle.Abilities.RangedAttack.CreateProjectile',
        ]
    def save(name,result):
        (args.out/name).write_text(json.dumps(dict(provenance=provenance,result=result),ensure_ascii=False,indent=2)+'\n')
    enum_types = ['Torappu.Battle.AbilityStandard/SelectTargetSource','Torappu.Battle.AbilityStandard/SelectTargetTiming']
    defaults = {row['fieldIndex']:row for row in native.records(7,'<iii','fieldIndex typeIndex dataIndex')}
    data_start,_ = native.table(8)
    enums=[]
    for entry in native.types:
        name=native.typename(entry['index'])
        if name not in enum_types:continue
        values=[]
        for field in native.fields(entry['index']):
            if field['index'] not in defaults:continue
            offset=defaults[field['index']]['dataIndex'];raw=native.metadata[data_start+offset]
            assert raw<128
            values.append(dict(name=field['name'],value=(raw>>1)^-(raw&1),fieldIndex=field['index'],dataIndex=offset))
        enums.append(dict(name=name,index=entry['index'],values=values))
    save('selector-enums.json',enums)
    owners = ['Torappu.Battle.AbilityStandard','Torappu.Battle.Abilities.RangedAttack','Torappu.Battle.Abilities.AbstractBasicAttack',
              'Torappu.Battle.Abilities.AbstractAnimatedAbility']
    if args.scout:
        result=[]
        for entry in native.types:
            name=native.typename(entry['index'])
            if name in owners or 'SelectTargetSource' in name or 'SelectTargetTiming' in name:
                fields=[f for f in native.fields(entry['index']) if not f['static']]
                methods=[native.method(i) for i in range(entry['methodStart'],entry['methodStart']+entry['methodCount'])
                         if not native.string(native.methods[i]['nameIndex']).startswith('__Hotfix')]
                result.append(dict(name=name,index=entry['index'],fields=fields,methods=methods))
                print(name, [(m['index'],m['fullname'].rsplit('.',1)[1]) for m in methods],flush=True)
        save('scout.json',result)
        return
    result=[]
    for entry in native.methods:
        name=native.typename(entry['declaringType'])+'.'+native.string(entry['nameIndex'])
        if name not in args.method:continue
        method=native.method(entry['index'])
        address=method['address'];end=min(v for v in native.addresses if v>address)
        parts=[]
        while address<end:
            part=native.disassemble_at(address,max_bytes=end-address);parts.append(part)
            following=int(part['end'],16);assert following>address;address=following
        result.append(dict(method=method,followingMethodAddress=hex(end),parts=parts))
        print(name,method['index'],hex(method['address']),len(parts),flush=True)
    assert set(args.method)=={row['method']['fullname'] for row in result}
    save('selected-native.json',result)
    relevant={row['method']['declaringType'] for row in result}
    save('fields.json',[dict(type=native.typename(index),fields=[f for f in native.fields(index) if not f['static']],
                             methods=[native.method(i) for i in range(native.types[index]['methodStart'],native.types[index]['methodStart']+native.types[index]['methodCount'])
                                      if native.methods[i]['slot'] in [54,70,71,83,84,91,92,120,121]])
                        for index in sorted(relevant)])

if __name__=='__main__':main()
