#!/usr/bin/env python3
"""Decode the installed Fever Skill behaviours and Tuye S2's counter-bearing ability."""
import argparse
import hashlib
import importlib.util
import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True
ROOT = next(p for p in Path(__file__).resolve().parents
            if (p / '.agents/skills/arkbattle-native-research/scripts/native.py').exists())
DECODER = ROOT / 'docs/research/evidence/targeting-pipeline-20261109/content/extract_content.py'
spec = importlib.util.spec_from_file_location('archived_content_decoder', DECODER)
decoder = importlib.util.module_from_spec(spec)
spec.loader.exec_module(decoder)


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--game', type=Path, default=Path('/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game'))
    p.add_argument('--out', type=Path, default=Path(__file__).with_name('content.json'))
    a = p.parse_args()
    base = a.game / 'Arknights_Data/StreamingAssets/AB/Windows'
    scripts_path = base / 'anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin'
    sources = [decoder.fingerprint(scripts_path)]
    scripts = {}
    for filename, data in decoder.bundle(scripts_path)[0]:
        if filename.endswith(('.resS', '.resource')):
            continue
        for obj in decoder.serialized(data)['objects']:
            if obj['classid'] == 115:
                scripts[(filename, int(obj['id']))] = decoder.script(obj, data)
    selected = []
    for relative in ['battle/prefabs/[uc]skills.ab', 'charpack/char_402_tuye.ab', 'charpack/char_4183_mortis.ab']:
        path = base / relative
        sources.append(decoder.fingerprint(path))
        for filename, data in decoder.bundle(path)[0]:
            if filename.endswith(('.resS', '.resource')):
                continue
            layouts, externals = decoder.helper.trees(data)
            gameobjects, transforms, components = {}, {}, []
            for obj in decoder.serialized(data)['objects']:
                raw = data[obj['start']:obj['start'] + obj['size']]
                if obj['classid'] == 1:
                    reader = decoder.Reader(raw)
                    refs = [dict(m_FileID=reader.val('i'), m_PathID=reader.val('q')) for _ in range(reader.val('i'))]
                    reader.val('i')
                    gameobjects[int(obj['id'])] = dict(name=reader.string(), components=refs)
                elif obj['classid'] == 4:
                    transforms[int(obj['id'])] = decoder.decode(raw, layouts[obj['typeid']])
                elif obj['classid'] == 114:
                    components.append((obj, raw))
            by_owner = {v['common:374']['m_PathID']: tid for tid, v in transforms.items()}
            for obj, raw in components:
                value = decoder.decode(raw, layouts[obj['typeid']])
                owner = value['common:374']['m_PathID']
                ancestry = []
                tid = by_owner.get(owner)
                while tid:
                    tr = transforms[tid]
                    ancestry.append(gameobjects[tr['common:374']['m_PathID']]['name'])
                    tid = tr['m_Father']['m_PathID']
                ancestry.reverse()
                pointer = value['common:490']
                sf = filename if pointer['m_FileID'] == 0 else externals[pointer['m_FileID'] - 1]['path'].split('/')[-1]
                script = scripts[(sf, pointer['m_PathID'])]
                keep = ('Fever' in script['cl'] or (ancestry and (ancestry[0] == 'skchr_tuye_2'
                        or ancestry[0].startswith('skcom_atk_up')))
                        or relative.startswith('charpack/') and ('Character' == script['cl'] or 'Fever' in script['cl']))
                if not keep:
                    continue
                fields = {k: v for k, v in value.items() if not k.startswith('common:')}
                if script['cl'] == 'Character':
                    fields = {k: v for k, v in fields.items() if k in ['_modes', '_commonAbilities', '_skills']}
                selected.append(dict(bundle=relative, file=filename, pathId=str(obj['id']),
                    script=script, ancestry=ancestry, enabled=value.get('common:349'),
                    ownerPPtr=value['common:374'], ownerComponents=gameobjects[owner]['components'],
                    objectSha256=hashlib.sha256(raw).hexdigest(), value=fields))
    table_root = ROOT / '.cache/native-research/route-operations-20261107/data'
    table_sources = []
    table_values = {}
    for table, keys in [('character_table.json', ['char_208_melan', 'char_402_tuye', 'char_4183_mortis']),
                        ('skill_table.json', ['skcom_atk_up[1]', 'skchr_tuye_2', 'skchr_mortis_1', 'skchr_mortis_2'])]:
        path = table_root / table
        table_sources.append(decoder.fingerprint(path))
        raw = json.loads(path.read_text())
        if table.startswith('character'):
            table_values[table] = {k: dict(name=raw[k]['name'], skills=[s['skillId'] for s in raw[k]['skills']]) for k in keys}
        else:
            table_values[table] = {k: {q: v for q, v in raw[k]['levels'][-1].items()
                                      if q in ['prefabId', 'duration', 'durationType', 'skillType', 'spData', 'blackboard']} for k in keys}
    output = dict(provenance=dict(checkedOn='2026-11-17', sources=sources,
                  mirroredTables=dict(sources=table_sources, repository='Kengxxiao/ArknightsGameData',
                     revision='63c7cec73c3858d0ae913f85cc89af3cef4d744f',
                     archive='docs/research/evidence/route-operations-20261107/content/README.md',
                     boundary='Previously cached mirror tables; versioned separately from the installed client.'),
                  extractor=decoder.fingerprint(Path(__file__)), decoder=decoder.fingerprint(DECODER),
                  treeReader=decoder.fingerprint(decoder.HELPER),
                  scope='All Fever-named Skill behaviours, Tuye S2 and the shared attack-up hierarchy; installed static configuration plus separately versioned tables, no runtime/XLua observation.'),
                  result=dict(components=selected, tables=table_values))
    a.out.parent.mkdir(parents=True, exist_ok=True)
    a.out.write_text(json.dumps(output,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'components':len(selected),'out':str(a.out)}))


if __name__ == '__main__':
    main()
