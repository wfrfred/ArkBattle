#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Locate attribute range writers and their installed template consumers."""
import argparse
import hashlib
import importlib.util
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path.cwd()
sys.dont_write_bytecode = True
sys.path.insert(0, str(ROOT / '.agents/skills/arkbattle-native-research/scripts'))
from native import Native, DEFAULT_GAME, fingerprint
from unity_assets import Reader, bundle, serialized, script

PATTERN = re.compile(r'Override.*(?:Data|Attribute).*Range|Clear.*(?:Data|Attribute).*Range|(?:Data|Attribute).*Range.*Override', re.I)


def save(path, provenance, result):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps({'provenance': provenance, 'result': result}, ensure_ascii=False, indent=2) + '\n')


def native_usage(args):
    native = Native(args.game)
    selected = [native.method(row['index']) for row in native.methods
                if PATTERN.search(native.typename(row['declaringType']) + '.' + native.string(row['nameIndex']))]
    operational = [row for row in selected if '__Hotfix' not in row['fullname'] and '<>xLua' not in row['fullname']]
    by_address = {}
    for row in operational:
        address = row.get('address')
        if address is not None:
            by_address.setdefault(address, []).append(row)
    xrefs = []
    bodies = {}
    for address, rows in by_address.items():
        target = int(address, 16) if isinstance(address, str) else address
        found = native.xrefs(target)
        for candidate in found['candidates']:
            evidence = []
            for index in candidate['precedingMethodCandidates']:
                if index not in bodies:
                    bodies[index] = native.disassemble(index)
                instruction = next((ins for ins in bodies[index]['instructions']
                                    if ins['address'] == candidate['address'] and ins.get('target') == hex(target)), None)
                if instruction:
                    evidence.append({'method': native.method(index), 'instruction': instruction})
            candidate['confirmedInstructions'] = evidence
        xrefs.append({'targetMethods': rows, **found})
    for row in operational:
        if row['index'] not in bodies:
            bodies[row['index']] = native.disassemble(row['index'])
    owners = sorted({row['declaringType'] for row in operational})
    provenance = native.provenance() | {
        'checkedOn': '2026-11-17', 'script': fingerprint(Path(__file__)),
        'scope': 'All metadata writer-name matches and their direct E8/E9 candidates; confirmed instruction boundaries retained. Indirect calls and active XLua are not enumerated.'}
    save(args.out, provenance, {'pattern': PATTERN.pattern, 'methods': selected,
         'owners': [{'name': native.typename(owner), 'fields': native.fields(owner)} for owner in owners],
         'xrefs': xrefs, 'bodies': list(bodies.values())})
    print(json.dumps({'methods': len(selected), 'operationalMethods': len(operational),
                      'directTargets': len(xrefs), 'bodies': len(bodies)}, ensure_ascii=False))


def walk(value, path=''):
    yield path, value
    if isinstance(value, dict):
        for key, child in value.items():
            yield from walk(child, path + '/' + str(key).replace('~', '~0').replace('/', '~1'))
    elif isinstance(value, list):
        for index, child in enumerate(value):
            yield from walk(child, path + '/' + str(index))


def template_usage(args):
    helper_path = ROOT / 'docs/research/evidence/attack-addon-order-20261102/content/decode_content.py'
    spec = importlib.util.spec_from_file_location('range_template_reader', helper_path)
    helper = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(helper)
    source = args.game / 'Arknights_Data/StreamingAssets/AB/Windows/config/buff_template_holder.ab'
    result = []
    for filename, data in bundle(source)[0]:
        if filename.endswith(('.resS', '.resource')):
            continue
        for obj in serialized(data)['objects']:
            if obj['id'] != 6070581171229484677:
                continue
            raw = data[obj['start']:obj['start'] + obj['size']]
            value = helper.decode(raw, helper.trees(data)[obj['typeid']])
            templates = value['_templates']['Array']
            selected = []
            programs = []
            for index, template in enumerate(templates):
                events = [{'event': event['key'], 'actions': json.loads(event['value']['SerializedState'])}
                          for event in template['eventToActions']['_items']['Array']]
                programs.append((index, template, events))
                matches = [{'path': path, 'value': node} for path, node in walk(events)
                           if isinstance(node, dict) and isinstance(node.get('$type'), str)
                           and PATTERN.search(node['$type'])]
                if matches:
                    selected.append(dict(template, templateIndex=index, events=events, matches=matches))
            keys = {row['templateKey'] for row in selected}
            references = []
            for index, template, events in programs:
                matches = [{'path': path, 'templateKey': node} for path, node in walk(events)
                           if isinstance(node, str) and node in keys]
                if matches:
                    references.append({'templateIndex': index, 'templateKey': template['templateKey'],
                                       'matches': matches, 'events': events})
            result.append({'bundle': 'config/buff_template_holder.ab', 'file': filename,
                           'pathId': str(obj['id']), 'objectSha256': hashlib.sha256(raw).hexdigest(),
                           'scannedTemplates': len(templates), 'templates': selected,
                           'directTemplateReferences': references})
    save(args.out, {'checkedOn': '2026-11-17', 'script': fingerprint(Path(__file__)),
                   'helper': fingerprint(helper_path), 'source': fingerprint(source),
                   'scope': 'All installed holder template event programs scanned by decoded node type; references are literal template-key edges, not runtime reachability.'}, result)
    print(json.dumps({'templates': sum(len(row['templates']) for row in result),
                      'scanned': sum(row['scannedTemplates'] for row in result),
                      'references': sum(len(row['directTemplateReferences']) for row in result)}))


def prefab_usage(args):
    helper_path = ROOT / 'docs/research/evidence/targeting-pipeline-20261109/content/extract_content.py'
    spec = importlib.util.spec_from_file_location('range_prefab_reader', helper_path)
    helper = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(helper)
    template_record = args.out.with_name('usage-templates.json')
    template_rows = json.loads(template_record.read_text())['result']
    keys = sorted({t['templateKey'] for row in template_rows for t in row['templates']} |
                  {t['templateKey'] for row in template_rows for t in row['directTemplateReferences']})
    needles = [(key, key.encode()) for key in keys]
    base = args.game / 'Arknights_Data/StreamingAssets/AB/Windows'
    paths = [base / rel for rel in ['charpack/char_4212_nasti.ab', 'battle/enm_pfb_35.ab',
             'battle/enm_pfb_33.ab', 'battle/[pack]common.ab',
             'battle/prefabs/[uc]skills.ab', 'battle/prefabs/[uc]equips.ab',
             'battle/prefabs/[uc]globalbuffs.ab', 'battle/prefabs/[uc]envsystems.ab']]
    paths += sorted((base / 'pkgrps').glob('btl_pfb_tokens_*.ab'))
    scripts = {}
    sources = []
    missing_scripts = []
    for relative in ['anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin', 'anon/88b3c3ecaaefa6003de730686dd5ac53.bin']:
        path = base / relative
        if not path.exists():
            missing_scripts.append(relative)
            continue
        sources.append(fingerprint(path))
        for filename, data in bundle(path)[0]:
            if filename.endswith(('.resS', '.resource')):
                continue
            for obj in serialized(data)['objects']:
                if obj['classid'] == 115:
                    scripts[(filename, obj['id'])] = script(obj, data)
    records = []
    scans = []
    for path in paths:
        sources.append(fingerprint(path))
        relative = str(path.relative_to(base))
        hit_count = 0
        for filename, data in bundle(path)[0]:
            if filename.endswith(('.resS', '.resource')):
                continue
            objects = serialized(data)['objects']
            layouts, externals = helper.helper.trees(data)
            names, transforms = {}, {}
            for obj in objects:
                raw = data[obj['start']:obj['start'] + obj['size']]
                if obj['classid'] == 1:
                    reader = Reader(raw)
                    reader.read(reader.val('i') * 12)
                    reader.val('i')
                    names[obj['id']] = reader.string()
                elif obj['classid'] == 4:
                    value = helper.decode(raw, layouts[obj['typeid']])
                    transforms[obj['id']] = (value['common:374']['m_PathID'], value['m_Father']['m_PathID'])
            by_owner = {owner: tid for tid, (owner, _) in transforms.items()}
            def hierarchy(owner):
                chain = []
                tid = by_owner.get(owner)
                while tid:
                    go, tid = transforms[tid]
                    chain.append(names[go])
                return list(reversed(chain))
            hit_roots = set()
            candidates = []
            for obj in objects:
                if obj['classid'] != 114:
                    continue
                raw = data[obj['start']:obj['start'] + obj['size']]
                matched = [key for key, needle in needles if needle in raw]
                if matched:
                    chain = hierarchy(int.from_bytes(raw[4:12], 'little', signed=True))
                    hit_count += 1
                    if chain:
                        hit_roots.add(chain[0])
                    candidates.append((obj, matched))
            exact = {obj['id']: matched for obj, matched in candidates}
            for obj in objects:
                if obj['classid'] != 114:
                    continue
                raw = data[obj['start']:obj['start'] + obj['size']]
                chain = hierarchy(int.from_bytes(raw[4:12], 'little', signed=True))
                if obj['id'] not in exact and (not chain or chain[0] not in hit_roots):
                    continue
                value = helper.decode(raw, layouts[obj['typeid']])
                pointer = value['common:490']
                script_file = filename if pointer['m_FileID'] == 0 else externals[pointer['m_FileID'] - 1]['path'].split('/')[-1]
                binding = scripts.get((script_file, pointer['m_PathID']))
                if obj['id'] not in exact and (not binding or not binding.get('ns', '').startswith('Torappu.Battle')):
                    continue
                projected = {key: child for key, child in value.items() if not key.startswith('common:')}
                matches = [{'path': loc, 'templateKey': node} for loc, node in walk(projected)
                           if isinstance(node, str) and node in keys]
                records.append({'bundle': relative, 'file': filename, 'pathId': str(obj['id']),
                                'hierarchy': chain, 'objectSha256': hashlib.sha256(raw).hexdigest(),
                                'scriptPPtr': pointer, 'scriptFile': script_file, 'script': binding,
                                'literalByteMatches': exact.get(obj['id'], []),
                                'exactDecodedMatches': matches, 'value': projected})
        scans.append({'bundle': relative, 'literalHitComponents': hit_count})
    save(args.out, {'checkedOn': '2026-11-17', 'script': fingerprint(Path(__file__)),
                   'helper': fingerprint(helper_path), 'sources': sources,
                   'unavailableScriptPackages': missing_scripts,
                   'templateInput': fingerprint(template_record),
                   'scope': 'Targeted native resource packages plus all seven token packages. Literal template consumers and related Battle components under their root retained; not a full-client reachability proof.'},
         {'templateKeys': keys, 'scanned': scans, 'components': records})
    print(json.dumps({'packages': len(paths), 'components': len(records),
                      'literalHits': sum(row['literalHitComponents'] for row in scans)}, ensure_ascii=False))


def static_usage(args):
    data_root = ROOT / '.cache/native-research/route-operations-20261107/data'
    character_path = data_root / 'character_table.json'
    skill_path = data_root / 'skill_table.json'
    enemy_path = ROOT / '.cache/native-research/leithanien-enemydata-20261109/enemy_database.json'
    characters = json.loads(character_path.read_text())
    skills = json.loads(skill_path.read_text())
    enemy_rows = json.loads(enemy_path.read_text())['enemies']
    selected_ids = ['char_4212_nasti', 'token_10060_nasti_nstchr', 'trap_279_pirene',
                    'trap_324_shmbmb', 'trap_345_shadvt', 'trap_349_shadvt2',
                    'trap_344_shadvr', 'trap_348_shadvr2']
    selected_characters = {key: characters[key] for key in selected_ids if key in characters}
    skill_ids = {row['skillId'] for character in selected_characters.values()
                 for row in character.get('skills', [])}
    selected_skills = {key: skills[key] for key in sorted(skill_ids) if key in skills}
    selected_enemies = [row for row in enemy_rows if row['Key'].startswith(('enemy_8018_etouch', 'enemy_2142_shsggd'))]
    level_root = ROOT / '.cache/native-research/checkpoint-nondefault-20261107/mirror-current/zh_CN/gamedata/levels'
    keys = sorted(set(selected_ids) | {row['Key'] for row in selected_enemies} | {'move_speed_range_override'})
    found = subprocess.run(['rg', '--files-with-matches', '--glob', '*.json',
                            '|'.join(re.escape(key) for key in keys), str(level_root)],
                           capture_output=True, text=True, check=False)
    if found.returncode not in (0, 1):
        raise RuntimeError(found.stderr)
    levels = []
    counts = {key: 0 for key in keys}
    for filename in sorted(found.stdout.splitlines()):
        path = Path(filename)
        value = json.loads(path.read_text())
        if not isinstance(value, dict) or 'mapData' not in value:
            continue
        matches = [{'path': loc, 'key': node} for loc, node in walk(value)
                   if isinstance(node, str) and node in counts]
        if not matches:
            continue
        for key in {row['key'] for row in matches}:
            counts[key] += 1
        levels.append({'path': str(path.relative_to(level_root)), 'source': fingerprint(path), 'matches': matches})
    save(args.out, {'checkedOn': '2026-11-17', 'script': fingerprint(Path(__file__)),
                   'sources': [fingerprint(path) for path in [character_path, skill_path, enemy_path]],
                   'levelRoot': str(level_root), 'levelSelection': keys,
                   'scope': 'Exact selected character/skill/enemy records and literal ID references in actual level objects (mapData present) in the fixed cached level mirror. References establish configured use, not execution or exclusivity of gameplay mode.'},
         {'characters': selected_characters, 'skills': selected_skills, 'enemies': selected_enemies,
          'levelReferenceCounts': counts, 'levels': levels})
    print(json.dumps({'characters': len(selected_characters), 'skills': len(selected_skills),
                      'enemies': len(selected_enemies), 'levels': len(levels), 'counts': counts}, ensure_ascii=False))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--game', type=Path, default=DEFAULT_GAME)
    parser.add_argument('--out', type=Path, required=True)
    parser.add_argument('mode', choices=['native', 'templates', 'prefabs', 'static'])
    args = parser.parse_args()
    {'native': native_usage, 'templates': template_usage, 'prefabs': prefab_usage, 'static': static_usage}[args.mode](args)


if __name__ == '__main__':
    main()
