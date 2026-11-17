#!/usr/bin/env python3
"""Count actual Fever Skill bindings and select two payment-variation examples."""
import argparse
import hashlib
import importlib.util
import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True
ROOT = Path.cwd()
HELPER = ROOT / 'docs/research/evidence/targeting-pipeline-20261109/content/extract_content.py'
spec = importlib.util.spec_from_file_location('payment_content_decoder', HELPER)
helper = importlib.util.module_from_spec(spec)
spec.loader.exec_module(helper)
PAYMENT_ROOTS = {'skchr_lumen_2', 'skchr_vvana_1'}
VERIFY = ROOT / 'docs/research/evidence/route-operations-20261107/data-source-verification.json'
CACHE = ROOT / '.cache/native-research/route-operations-20261107/data'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    base = Path('/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game/Arknights_Data/StreamingAssets/AB/Windows')
    script_bundle = base / 'anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin'
    sources, scripts = [helper.fingerprint(script_bundle)], {}
    for filename, data in helper.bundle(script_bundle)[0]:
        if filename.endswith(('.resS', '.resource')):
            continue
        for obj in helper.serialized(data)['objects']:
            if obj['classid'] == 115:
                scripts[(filename, int(obj['id']))] = helper.script(obj, data)
    source = base / 'battle/prefabs/[uc]skills.ab'
    sources.append(helper.fingerprint(source))
    rows = []
    for filename, data in helper.bundle(source)[0]:
        if filename.endswith(('.resS', '.resource')):
            continue
        state = helper.serialized(data)
        layouts, externals = helper.helper.trees(data)
        gameobjects, transforms = {}, {}
        for obj in state['objects']:
            raw = data[obj['start']:obj['start'] + obj['size']]
            if obj['classid'] == 1:
                reader = helper.Reader(raw)
                links = [dict(m_FileID=reader.val('i'), m_PathID=reader.val('q')) for _ in range(reader.val('i'))]
                layer = reader.val('i')
                gameobjects[int(obj['id'])] = dict(pathId=str(obj['id']), name=reader.string(), layer=layer, components=links)
            elif obj['classid'] == 4:
                transforms[int(obj['id'])] = helper.decode(raw, layouts[obj['typeid']])
        by_owner = {value['common:374']['m_PathID']: index for index, value in transforms.items()}
        for obj in state['objects']:
            if obj['classid'] != 114:
                continue
            raw = data[obj['start']:obj['start'] + obj['size']]
            owner = int.from_bytes(raw[4:12], 'little', signed=True)
            path, tid = [], by_owner.get(owner)
            while tid:
                transform = transforms[tid]
                path.append(gameobjects[transform['common:374']['m_PathID']])
                tid = transform['m_Father']['m_PathID']
            path.reverse()
            names = {node['name'] for node in layouts[obj['typeid']]}
            if not (path and path[0]['name'] in PAYMENT_ROOTS) and '_feverKey' not in names:
                continue
            value = helper.decode(raw, layouts[obj['typeid']])
            pointer = value['common:490']
            script_file = filename if pointer['m_FileID'] == 0 else externals[pointer['m_FileID'] - 1]['path'].split('/')[-1]
            script = scripts.get((script_file, pointer['m_PathID']))
            if not (path and path[0]['name'] in PAYMENT_ROOTS) and (script or {}).get('cl') != 'FeverCommonBehaviour':
                continue
            rows.append(dict(bundle='battle/prefabs/[uc]skills.ab', file=filename, pathId=str(obj['id']),
                             owner=value['common:374'], ancestry=path, scriptPPtr=pointer, scriptFile=script_file, script=script,
                             enabled=value.get('common:349'), objectSha256=hashlib.sha256(raw).hexdigest(),
                             value={key: val for key, val in value.items() if not key.startswith('common:')}))
    verified = json.loads(VERIFY.read_text())
    tables = {}
    for filename in ['character_table.json', 'skill_table.json']:
        path = CACHE / filename
        raw = path.read_bytes()
        original = next(item for item in verified['result']['sources'] if item['sourcePath'].endswith('/' + filename))
        blob = hashlib.sha1(b'blob ' + str(len(raw)).encode() + b'\0' + raw).hexdigest()
        if hashlib.sha256(raw).hexdigest() != original['sha256'] or blob != original['expectedGitBlob']:
            raise ValueError('Changed pinned table ' + filename)
        sources.append(dict(**helper.fingerprint(path), gitBlobSha1=blob, sourcePath=original['sourcePath']))
        tables[filename] = json.loads(raw)
    fever_rows = [row for row in rows if row['script']['cl'] == 'FeverCommonBehaviour']
    fever_roots = sorted({row['ancestry'][0]['name'] for row in fever_rows})
    selected_roots = set(fever_roots) | PAYMENT_ROOTS
    selected_skills = {key: value for key, value in tables['skill_table.json'].items()
                       if any(level['prefabId'] in selected_roots for level in value['levels'])}
    bindings = []
    for key, character in tables['character_table.json'].items():
        for index, skill in enumerate(character['skills']):
            skill_id = skill.get('skillId')
            if skill_id not in selected_skills:
                continue
            prefabs = sorted({level['prefabId'] for level in selected_skills[skill_id]['levels']})
            bindings.append(dict(characterId=key, name=character['name'], skillIndex=index+1, skillId=skill_id, prefabIds=prefabs))
    fever_ids = sorted({row['skillId'] for row in bindings if any(key in fever_roots for key in row['prefabIds'])})
    holder_path = base / 'config/buff_template_holder.ab'
    sources.append(helper.fingerprint(holder_path))
    selected_templates = []
    for filename, data in helper.bundle(holder_path)[0]:
        if filename.endswith(('.resS', '.resource')):
            continue
        layouts, _ = helper.helper.trees(data)
        for obj in helper.serialized(data)['objects']:
            if obj['id'] != 6070581171229484677:
                continue
            raw = data[obj['start']:obj['start'] + obj['size']]
            holder = helper.decode(raw, layouts[obj['typeid']])
            for index, template in enumerate(holder['_templates']['Array']):
                if not template['templateKey'].startswith(('lumen_s_2', 'vvana_s_1')):
                    continue
                value = dict(template)
                value.pop('eventToActions')
                value['templateIndex'] = index
                value['events'] = [{'event': e['key'], 'actions': json.loads(e['value']['SerializedState'])}
                                   for e in template['eventToActions']['_items']['Array']]
                selected_templates.append(value)
            holder_identity = dict(file=filename, pathId=str(obj['id']), objectSha256=hashlib.sha256(raw).hexdigest(),
                                   templatesScanned=len(holder['_templates']['Array']))
    result = dict(components=rows, bindings=bindings, skills=selected_skills,
                  templates=selected_templates, holder=holder_identity,
                  counts=dict(feverComponents=len(fever_rows), feverPrefabRoots=len(fever_roots), feverSkillIds=len(fever_ids),
                              feverCharacters=len({row['characterId'] for row in bindings if row['skillId'] in fever_ids})),
                  feverSkillIds=fever_ids)
    provenance = dict(collectedOn='2026-11-17', script=helper.fingerprint(Path(__file__)), decoder=helper.fingerprint(HELPER),
                      sources=sources, tableVerification=helper.fingerprint(VERIFY), tableRevision=verified['provenance']['revision'],
                      selection=dict(paymentRoots=sorted(PAYMENT_ROOTS), feverSelection='All MonoBehaviours with _feverKey, resolved class exactly FeverCommonBehaviour, in installed [uc]skills.ab'),
                      scope='Fresh installed component decoding and fixed mirror binding. Does not prove arbitrary runtime Lua abilities, all-client absence, or live gameplay.')
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(dict(provenance=provenance, result=result), ensure_ascii=False, indent=2)+'\n')
    print(json.dumps(dict(**result['counts'], components=len(rows), bindings=len(bindings))))


if __name__ == '__main__':
    main()
