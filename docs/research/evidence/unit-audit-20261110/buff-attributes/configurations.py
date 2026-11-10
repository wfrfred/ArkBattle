#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
"""Project selected embedded Buff descriptors from the installed template holder."""
import argparse
import hashlib
import json
from pathlib import Path
import sys

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path.cwd() / '.agents/skills/arkbattle-native-research/scripts'))
from native import DEFAULT_GAME, fingerprint
from unity_assets import Reader, bundle, serialized


def walk(value, pointer=''):
    if isinstance(value, dict):
        yield pointer, value
        for key, child in value.items():
            yield from walk(child, pointer + '/' + str(key).replace('~', '~0').replace('/', '~1'))
    elif isinstance(value, list):
        for index, child in enumerate(value):
            yield from walk(child, pointer + '/' + str(index))


parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--game', type=Path, default=DEFAULT_GAME)
parser.add_argument('--out', type=Path, required=True)
args = parser.parse_args()
source = args.game / 'Arknights_Data/StreamingAssets/AB/Windows/config/buff_template_holder.ab'
selected_keys = {
    'astesi_t_1[Stack]', 'ascln_t_1[debuff]', 'sbell2_e_002_trait[interval]',
    'enemy_shushu_support', 'skadi2_t_2[atk][2]',
    'nothin_s_2[a][attack_speed_down]', 'enemu_nstmom[weak_attr]',
    'sophia_e_shield_physical_kxml', 'encourage[atk]',
}
selected, snapshot_extend, holders = [], [], []
template_count = 0
files, unity_version = bundle(source)
for cab, data in files:
    if cab.endswith(('.resS', '.resource')):
        continue
    for obj in serialized(data)['objects']:
        if obj['classid'] != 114:
            continue
        raw = data[obj['start']:obj['start'] + obj['size']]
        reader = Reader(raw, p=28)
        name = reader.string()
        count = reader.val('i')
        holder = {
            'cab': cab, 'pathId': str(obj['id']), 'objectStart': obj['start'],
            'objectSize': obj['size'], 'objectSha256': hashlib.sha256(raw).hexdigest(),
            'name': name, 'templateCount': count,
        }
        holders.append(holder)
        for _ in range(count):
            start = reader.p
            key, effect = reader.string(), reader.string()
            priority = reader.val('i')
            events = []
            for _ in range(reader.val('i')):
                event, program = reader.val('i'), reader.string()
                references = [{'file': reader.val('i'), 'pathId': str(reader.val('q'))}
                              for _ in range(reader.val('i'))]
                events.append({'event': event, 'actions': json.loads(program), 'refs': references})
            template_count += 1
            origin = {
                'cab': cab, 'pathId': str(obj['id']), 'templateKey': key,
                'templateOffsetInObject': start, 'templateBytes': reader.p - start,
                'templateSha256': hashlib.sha256(raw[start:reader.p]).hexdigest(),
            }
            for pointer, node in walk({'events': events}):
                if node.get('buffKey') in selected_keys:
                    selected.append({'origin': origin, 'pointer': pointer, 'descriptor': node})
                if node.get('overrideType') in ('EXTEND', 3) and node.get('takeSnapshotWhenExtend'):
                    snapshot_extend.append({
                        'origin': origin, 'pointer': pointer,
                        'buffKey': node.get('buffKey'),
                        'overrideType': node['overrideType'],
                        'takeSnapshotWhenExtend': node['takeSnapshotWhenExtend'],
                    })
        if reader.p != len(raw):
            raise ValueError(('unparsed holder suffix', reader.p, len(raw)))

result = {
    'provenance': {
        'collectedOn': '2026-11-10', 'source': fingerprint(source),
        'script': fingerprint(Path(__file__)), 'unityVersion': unity_version,
        'decoder': fingerprint(Path('.agents/skills/arkbattle-native-research/scripts/unity_assets.py')),
    },
    'scope': 'Exact selected descriptor subtrees; template existence does not establish a gameplay binding.',
    'holders': holders, 'templateCount': template_count,
    'selected': selected,
    'allEmbeddedExtendWithSnapshot': snapshot_extend,
}
args.out.parent.mkdir(parents=True, exist_ok=True)
args.out.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'templates': template_count, 'selected': len(selected),
                  'extendWithSnapshot': snapshot_extend, 'out': str(args.out)}, ensure_ascii=False))
