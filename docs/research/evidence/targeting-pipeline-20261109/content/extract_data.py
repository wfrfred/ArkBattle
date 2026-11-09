#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
"""Select representative skill/character links from the already verified pinned mirror."""
import argparse
import json
from pathlib import Path
import sys

sys.dont_write_bytecode = True
TOOLS = Path.cwd() / '.agents/skills/arkbattle-native-research/scripts'
sys.path.insert(0, str(TOOLS))
from native import fingerprint

CHARACTERS = ['char_208_melan', 'char_124_kroos', 'char_210_stward', 'char_117_myrrh',
              'char_473_mberry', 'char_121_lava', 'char_101_sora', 'char_1012_skadi2',
              'char_4191_tippi', 'char_325_bison', 'char_338_iris', 'char_214_kafka',
              'char_010_chen', 'char_4062_totter', 'char_423_blemsh', 'char_1039_thorn2',
              'char_1045_svash2']
SKILLS = ['skchr_bison_2', 'skchr_iris_2', 'skchr_kafka_1', 'skchr_sora_1', 'skchr_sora_2',
          'skchr_skadi2_2', 'skchr_skadi2_3', 'skchr_chen_3', 'skchr_totter_1',
          'skchr_blemsh_2', 'skchr_thorn2_1', 'skchr_svash2_2']

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--data', type=Path, default=Path('.cache/native-research/route-operations-20261107/data'))
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    prefabs = args.out / 'selected-prefabs.json'
    observed = json.loads(prefabs.read_text())
    observed_skills = sorted({row['hierarchy'][0] for row in observed['result'] if row['hierarchy'][0].startswith('skchr_')})
    requested_skills = sorted(set(SKILLS + observed_skills))
    verification = Path('docs/research/evidence/route-operations-20261107/data-source-verification.json')
    proof = json.loads(verification.read_text())
    records = proof['result']
    if isinstance(records, dict):
        records = records['sources']
    selected = {}
    sources = []
    for name in ['character_table.json', 'skill_table.json']:
        path = args.data / name
        source = fingerprint(path)
        record = next(r for r in records if r['sourcePath'].endswith('/' + name))
        expected = record.get('sha256') or record.get('local', {}).get('sha256')
        assert source['sha256'] == expected, (name, source['sha256'], expected)
        source.update(sourcePath=record['sourcePath'], revision=proof['provenance']['revision'])
        sources.append(source)
        value = json.loads(path.read_text())
        if name == 'character_table.json':
            characters = [key for key, entry in value.items() if key in CHARACTERS or any(skill['skillId'] in requested_skills for skill in entry.get('skills', []))]
            selected['characters'] = {key: {field: value[key].get(field) for field in ['name', 'skills', 'talents', 'trait']} for key in characters}
            for key in selected['characters']:
                selected['characters'][key]['phases'] = [{field: phase.get(field) for field in ['characterPrefabKey', 'rangeId']} for phase in value[key]['phases']]
        else:
            selected['skills'] = {key: value[key] for key in requested_skills if key in value}
    result = dict(provenance=dict(collectedOn='2026-11-09', script=fingerprint(Path(__file__)),
                 verification=fingerprint(verification), observedPrefabs=fingerprint(prefabs), sourceUrl='https://github.com/Kengxxiao/ArknightsGameData',
                 revision=proof['provenance']['revision'], sources=sources,
                 scope='Selected raw entries from a previously Git-blob-verified public mirror; not an official document or installed-client runtime observation.'), result=selected)
    args.out.mkdir(parents=True, exist_ok=True)
    (args.out / 'selected-data.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({key: len(value) for key, value in selected.items()}))

if __name__ == '__main__':
    main()
