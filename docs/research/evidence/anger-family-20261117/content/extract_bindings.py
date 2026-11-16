#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
"""Trace installed ability owners without inferring family from hierarchy names."""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import sys

sys.dont_write_bytecode = True
ROOT = Path.cwd()
DECODER = ROOT / 'docs/research/evidence/targeting-pipeline-20261109/content/extract_content.py'
spec = importlib.util.spec_from_file_location('archived_content_decoder', DECODER)
decoder = importlib.util.module_from_spec(spec)
spec.loader.exec_module(decoder)
SELECTED = {
    'char_208_melan': [-7356919617350662683, -1353240200450669083, -1757267164089940507],
    'char_1012_skadi2': [-3662291628995893316, -3551814154833287236],
    'char_494_vendla': [-5727053032967838823, 3830709308923437977, 7110607010283185049],
}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--game', type=Path, default=Path('/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game'))
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    base = args.game / 'Arknights_Data/StreamingAssets/AB/Windows'
    script_bundle = base / 'anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin'
    sources = [decoder.fingerprint(script_bundle)]
    scripts = {}
    for filename, data in decoder.bundle(script_bundle)[0]:
        if filename.endswith(('.resS', '.resource')):
            continue
        for obj in decoder.serialized(data)['objects']:
            if obj['classid'] == 115:
                scripts[(filename, int(obj['id']))] = decoder.script(obj, data)
    rows = []
    for key, selected in SELECTED.items():
        bundle = base / f'charpack/{key}.ab'
        sources.append(decoder.fingerprint(bundle))
        for filename, data in decoder.bundle(bundle)[0]:
            if filename.endswith(('.resS', '.resource')):
                continue
            state = decoder.serialized(data)
            layouts, externals = decoder.helper.trees(data)
            gameobjects, transforms, values = {}, {}, {}
            for obj in state['objects']:
                raw = data[obj['start']:obj['start'] + obj['size']]
                if obj['classid'] == 1:
                    reader = decoder.Reader(raw)
                    components = [dict(m_FileID=reader.val('i'), m_PathID=reader.val('q')) for _ in range(reader.val('i'))]
                    layer = reader.val('i')
                    gameobjects[int(obj['id'])] = dict(pathId=str(obj['id']), name=reader.string(), layer=layer, components=components)
                elif obj['classid'] == 4:
                    value = decoder.decode(raw, layouts[obj['typeid']])
                    transforms[int(obj['id'])] = value
                elif obj['classid'] == 114 and int(obj['id']) in selected:
                    value = decoder.decode(raw, layouts[obj['typeid']])
                    values[int(obj['id'])] = (obj, raw, value)
            by_owner = {v['common:374']['m_PathID']: tid for tid, v in transforms.items()}
            for path_id in selected:
                obj, raw, value = values[path_id]
                owner = value['common:374']['m_PathID']
                ancestry = []
                tid = by_owner.get(owner)
                while tid:
                    transform = transforms[tid]
                    go = transform['common:374']['m_PathID']
                    ancestry.append(dict(gameObject=gameobjects[go], transformPathId=str(tid), father=transform['m_Father']))
                    tid = transform['m_Father']['m_PathID']
                ancestry.reverse()
                pointer = value['common:490']
                script_file = filename if pointer['m_FileID'] == 0 else externals[pointer['m_FileID'] - 1]['path'].split('/')[-1]
                resolved = scripts[(script_file, pointer['m_PathID'])]
                fields = {k: v for k, v in value.items() if not k.startswith('common:')}
                if resolved['cl'] == 'Character':
                    fields = {k: fields[k] for k in ['_modes', '_commonAbilities', '_traitAbility']}
                rows.append(dict(characterKey=key, bundle=f'charpack/{key}.ab', file=filename,
                                 pathId=str(path_id), objectSha256=hashlib.sha256(raw).hexdigest(),
                                 ownerPPtr=value['common:374'], ancestry=ancestry,
                                 scriptPPtr=pointer, scriptFile=script_file, script=resolved,
                                 enabled=value.get('common:349'), value=fields))
    table = ROOT / 'docs/research/evidence/targeting-pipeline-20261109/content/selected-data.json'
    table_data = json.loads(table.read_text())
    characters = table_data['result']['characters']
    profiles = ROOT / 'docs/research/evidence/reception-stages-20261115/content/profiles.json'
    profile_data = json.loads(profiles.read_text())
    characters['char_494_vendla'] = profile_data['result']['characters']['char_494_vendla']
    result = dict(
        components=rows,
        characterData={key: dict(name=characters[key]['name'],
                                skills=[x['skillId'] for x in characters[key]['skills']],
                                talents=characters[key]['talents'] if key != 'char_1012_skadi2' else None)
                       for key in SELECTED},
    )
    output = dict(provenance=dict(collectedOn='2026-11-17', script=decoder.fingerprint(Path(__file__)),
                                 decoder=decoder.fingerprint(DECODER), treeReader=decoder.fingerprint(decoder.HELPER),
                                 tools=[decoder.fingerprint(decoder.TOOLS / x) for x in ['unity_assets.py', 'native.py']],
                                 installedSources=sources, mirroredDataExcerpt=decoder.fingerprint(table),
                                 mirroredDataProvenance=table_data['provenance'],
                                 vendlaProfileExcerpt=decoder.fingerprint(profiles),
                                 vendlaProfilePointer='/result/characters/char_494_vendla',
                                 vendlaProfileSource={k: profile_data['provenance'][k] for k in ['characterTable', 'characterTableRevision']},
                                 selection=SELECTED,
                                 scope='Installed Character, Talent and PassiveBuffAbility references plus same-GameObject and ancestor components. Family classification requires the separate native initialization chain. Mirrored character data is separately versioned; no live execution or active XLua observation.'), result=result)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(output, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(dict(output=str(args.out), components=len(rows), sources=len(sources))))


if __name__ == '__main__':
    main()
