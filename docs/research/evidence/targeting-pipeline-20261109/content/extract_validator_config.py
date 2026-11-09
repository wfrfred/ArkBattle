#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
"""Complete Tocka's exact GroupSelector and its skill/alias registration PPtrs."""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import struct
import sys

sys.dont_write_bytecode = True
READER = Path('docs/research/evidence/targeting-pipeline-20261109/content/extract_content.py')
spec = importlib.util.spec_from_file_location('archived_content_reader', READER)
content = importlib.util.module_from_spec(spec)
spec.loader.exec_module(content)

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--game', type=Path, required=True)
    parser.add_argument('--out', type=Path, required=True)
    parser.add_argument('--contracts', type=Path, default=Path('docs/research/evidence/targeting-pipeline-20261109/content/validator-composition.json'))
    args = parser.parse_args()
    base = args.game / 'Arknights_Data/StreamingAssets/AB/Windows'
    relative = 'battle/prefabs/[uc]skills.ab'
    scripts_relative = 'anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin'
    scripts = {}
    for filename, data in content.bundle(base / scripts_relative)[0]:
        if filename.endswith(('.resS', '.resource')):
            continue
        for obj in content.serialized(data)['objects']:
            if obj['classid'] == 115:
                scripts[(filename, obj['id'])] = content.script(obj, data)
    rows = []
    for filename, data in content.bundle(base / relative)[0]:
        if filename.endswith(('.resS', '.resource')):
            continue
        state = content.serialized(data)
        layouts, externals = content.helper.trees(data)
        for obj in state['objects']:
            if obj['id'] not in [4307741335078991844, 6416742763189139428, 8715933233783011300]:
                continue
            raw = data[obj['start']:obj['start'] + obj['size']]
            value = content.decode(raw, layouts[obj['typeid']])
            pointer = value['common:490']
            script_file = filename if pointer['m_FileID'] == 0 else externals[pointer['m_FileID'] - 1]['path'].split('/')[-1]
            script = scripts[(script_file, pointer['m_PathID'])]
            if obj['id'] == 4307741335078991844:
                assert script['cl'] == 'GroupSelector'
            rows.append(dict(bundle=relative, file=filename, pathId=str(obj['id']),
                             objectSha256=hashlib.sha256(raw).hexdigest(), scriptPPtr=pointer,
                             scriptFile=script_file, script=script, value=value))
    assert len(rows) == 3
    contracts = json.loads(args.contracts.read_text())
    metadata_path = args.game / 'Arknights_Data/il2cpp_data/Metadata/global-metadata.dat'
    metadata_fingerprint = content.fingerprint(metadata_path)
    assert metadata_fingerprint['sha256'] == contracts['provenance']['client']['metadata']['sha256']
    metadata = metadata_path.read_bytes()
    assert struct.unpack_from('<II', metadata) == (0xfab11baf, 29)
    defaults_start, defaults_size = struct.unpack_from('<II', metadata, 8 + 7 * 8)
    values_start, _ = struct.unpack_from('<II', metadata, 8 + 8 * 8)
    defaults = {field: offset for field, _type, offset in struct.iter_unpack('<iii', metadata[defaults_start:defaults_start + defaults_size])}
    skill_type = next(row for row in contracts['result']['types'] if row['name'] == 'Torappu.SkillType')
    constants = []
    for field in skill_type['fields']:
        if field['index'] not in defaults:
            continue
        offset = defaults[field['index']]
        encoded = metadata[values_start + offset]
        assert encoded < 128
        value = (encoded >> 1) if encoded % 2 == 0 else -(encoded >> 1) - 1
        constants.append(dict(name=field['name'], fieldIndex=field['index'], dataIndex=offset,
                              encodedByte=hex(encoded), value=value))
    result = dict(provenance=dict(collectedOn='2026-11-09', script=content.fingerprint(Path(__file__)),
                  contentReader=content.fingerprint(READER),
                  contracts=content.fingerprint(args.contracts), metadata=metadata_fingerprint,
                  sources=[content.fingerprint(base / relative), content.fingerprint(base / scripts_relative)],
                  scope='Exact GroupSelector, EmptyAbility alias and CastSkill registration objects with external MonoScripts; current SkillType metadata constants; other linked validators remain in selected-prefabs.json.'),
                  result=rows, metadataEnums=[dict(name='Torappu.SkillType', values=constants)])
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(dict(out=str(args.out), components=len(rows))))

if __name__ == '__main__':
    main()
