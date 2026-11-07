#!/usr/bin/env python3
"""Inventory route-related metadata independently of a hand-picked method list."""
import argparse
import importlib.util
import json
from functools import lru_cache
from pathlib import Path


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--game', type=Path, default=Path('/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game'))
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    path = Path('.agents/skills/arkbattle-native-research/scripts/native.py')
    spec = importlib.util.spec_from_file_location('native', path)
    native_module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(native_module)
    n = native_module.Native(args.game)
    type_name = lru_cache(None)(n.type_name)
    names = {t['index']: n.typename(t['index']) for t in n.types}
    core = {'Torappu.Battle.Route', 'Torappu.Battle.Enemy', 'Torappu.Battle.BasicCursor'}
    selected = set(core)
    parents = {}
    for t in n.types:
        try:
            parents[t['index']] = type_name(t['parentIndex']) if t['parentIndex'] >= 0 else None
        except (ValueError, StopIteration):
            parents[t['index']] = 'unresolved'
    # Follow actual parent metadata, not names containing "Cursor".
    while True:
        added = {names[i] for i, parent in parents.items() if parent in selected and names[i].startswith('Torappu.Battle.')}
        if added <= selected:
            break
        selected |= added
    cursor_types = {'Torappu.Battle.BasicCursor'}
    while True:
        added = {names[i] for i, parent in parents.items() if parent in cursor_types and names[i].startswith('Torappu.Battle.')}
        if added <= cursor_types:
            break
        cursor_types |= added
    reference_types = cursor_types | {'Torappu.Battle.Route'}
    types = []
    for t in n.types:
        if names[t['index']] not in selected:
            continue
        types.append({'fullname': names[t['index']], 'index': t['index'], 'parent': parents[t['index']],
                      'fields': n.fields(t['index']),
                      'methods': [n.method(i) for i in range(max(0, t['methodStart']), max(0, t['methodStart']) + t['methodCount'])]})
    references = []
    for m in n.methods:
        if not names[m['declaringType']].startswith('Torappu.'):
            continue
        start = max(0, m['parameterStart'])
        used = {type_name(m['returnType'])}
        used.update(type_name(p['typeIndex']) for p in n.parameters[start:start + m['parameterCount']])
        if any(name.removesuffix('&').removesuffix('[]') in reference_types for name in used):
            references.append(n.method(m['index']))
    field_references = []
    for t in n.types:
        if not names[t['index']].startswith('Torappu.'):
            continue
        fields = n.fields(t['index'])
        matched = [f for f in fields if f['typeName'].removesuffix('&').removesuffix('[]') in reference_types]
        if matched:
            field_references.append({'fullname': names[t['index']], 'fields': matched})
    provenance = n.provenance()
    provenance['queryScript'] = native_module.fingerprint(Path(__file__))
    result = {'selection': 'Complete declared methods and fields of Route, Enemy, BasicCursor and all Torappu.Battle metadata descendants; all Torappu signatures/fields referring to selected route/cursor types.',
              'limits': 'Metadata signatures do not expose object-typed, generic, reflection, hotfix or untyped native uses. Field references are discovery candidates, not proof of activation or mutation.',
              'types': types, 'signatureReferences': references, 'fieldReferences': field_references}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps({'provenance': provenance, 'result': result}, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'types': [(t['fullname'], len(t['methods'])) for t in types], 'signatureReferences': len(references), 'fieldReferenceTypes': len(field_references)}, ensure_ascii=False))


if __name__ == '__main__':
    main()
