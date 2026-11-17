#!/usr/bin/env python3
"""Read Hound's selected attack, mapper and Spine input from installed bundles."""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import subprocess
import sys

sys.dont_write_bytecode = True
ROOT = Path.cwd()
TOOLS = ROOT / '.agents/skills/arkbattle-native-research/scripts'
sys.path.insert(0, str(TOOLS))
from native import fingerprint
from unity_assets import Reader, bundle, serialized

HELPER = ROOT / 'docs/research/evidence/targeting-pipeline-20261109/content/extract_content.py'
spec = importlib.util.spec_from_file_location('archived_config_decoder', HELPER)
helper = importlib.util.module_from_spec(spec)
spec.loader.exec_module(helper)

RUNTIME_COMMIT = '8b4844bd4b193ba9e54487ed397a777993cbad56'
RUNTIME_SHA256 = 'f1e0a31b9906e4d4daf2733857d21381ddbbe75adec7f4d83e1cc9b2b070dfc1'
RUNTIME_URL = f'https://raw.githubusercontent.com/EsotericSoftware/spine-runtimes/{RUNTIME_COMMIT}/spine-ts/build/spine-core.js'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--game', type=Path, default=Path('/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game'))
    parser.add_argument('--spine-runtime', type=Path, required=True)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    if hashlib.sha256(args.spine_runtime.read_bytes()).hexdigest() != RUNTIME_SHA256:
        raise ValueError('Spine runtime does not match the archived parser fingerprint')
    args.out.mkdir(parents=True, exist_ok=True)
    base = args.game / 'Arknights_Data/StreamingAssets/AB/Windows'
    rows, sources = [], []

    def load(relative):
        path = base / relative
        sources.append(fingerprint(path))
        files = [(name, data) for name, data in bundle(path)[0] if not name.endswith(('.resS', '.resource'))]
        assert len(files) == 1
        cab, data = files[0]
        state = serialized(data)
        layouts, externals = helper.helper.trees(data)
        objects = {obj['id']: obj for obj in state['objects']}

        def read(path_id):
            obj = objects[path_id]
            raw = data[obj['start']:obj['start'] + obj['size']]
            raw_file = f'{path.stem}-{path_id}.bin'
            (args.out / raw_file).write_bytes(raw)
            value = helper.decode(raw, layouts[obj['typeid']])
            rows.append(dict(bundle=relative, file=cab, pathId=str(path_id),
                             classId=obj['classid'], value=value, rawFile=raw_file,
                             sha256=hashlib.sha256(raw).hexdigest()))
            return value
        return cab, data, objects, externals, read

    prefab_cab, _, _, externals, read_prefab = load('battle/enm_pfb_base_0.ab')
    enemy = read_prefab(-2249318070340056801)
    mode = read_prefab(enemy['_modes']['Array'][0]['m_PathID'])
    assert mode['_attack']['m_PathID'] == 0
    attack_id = mode['_combat']['m_PathID']
    attack = read_prefab(attack_id)
    mapper = read_prefab(enemy['_animator']['m_PathID'])
    skeleton = read_prefab(mapper['_skeleton']['m_PathID'])
    asset_pointer = skeleton['skeletonDataAsset']
    target_cab = externals[asset_pointer['m_FileID'] - 1]['path'].split('/')[-1]
    art_cab, art_data, art_objects, _, read_art = load('refs/arts/enm_art_base_0.ab')
    assert target_cab == art_cab
    asset = read_art(asset_pointer['m_PathID'])
    text_pointer = asset['skeletonJSON']
    assert text_pointer['m_FileID'] == 0
    text = art_objects[text_pointer['m_PathID']]
    reader = Reader(art_data[text['start']:text['start'] + text['size']])
    text_name = reader.string()
    payload = reader.read(reader.val('i'))
    payload_path = args.out / 'hound.skel'
    payload_path.write_bytes(payload)
    output = subprocess.check_output(['node', str(Path(__file__).with_name('read-spine.cjs')),
                                      str(args.spine_runtime), str(payload_path)], text=True)
    spine = json.loads(output)
    animation_key = attack['_animKey']
    mapped = next(item for item in mapper['_animations']['Array'] if item['animKey'] == animation_key)
    animation = next(item for item in spine['animations'] if item['name'] == mapped['animName'])
    result = dict(provenance=dict(
        collectedOn='2026-11-17', scope='One selected Hound default Combat ability and its static animation input; no client execution, XLua or exact gameplay-frame observation.',
        script=fingerprint(Path(__file__)), decoder=fingerprint(Path(__file__).with_name('read-spine.cjs')),
        helpers=[fingerprint(HELPER), fingerprint(helper.HELPER), fingerprint(TOOLS / 'unity_assets.py')],
        sources=sources, runtime=dict(url=RUNTIME_URL, sha256=RUNTIME_SHA256, commit=RUNTIME_COMMIT)),
        result=dict(components=rows, externals=externals,
                    textAsset=dict(file=art_cab, pathId=str(text['id']), name=text_name,
                                   rawFile=payload_path.name, bytes=len(payload), sha256=hashlib.sha256(payload).hexdigest()),
                    spine=spine, selected=dict(prefabFile=prefab_cab, abilityPathId=str(attack_id),
                    abilityRole='Default._combat', animationKey=animation_key, mapper=mapped, animation=animation)))
    (args.out / 'result.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(dict(out=str(args.out), selected=result['result']['selected']), ensure_ascii=False))


if __name__ == '__main__':
    main()
