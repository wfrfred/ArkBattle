#!/usr/bin/env python3
"""Re-extract recorded native selectors into fresh skill output."""
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
import argparse
import json
import subprocess
import sys
from pathlib import Path

sys.dont_write_bytecode = True
from native import DEFAULT_GAME, Native, fingerprint


def canonical(name):
    return name.replace('+', '.').replace('/', '.')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('batch', type=Path)
    parser.add_argument('--game', type=Path, default=DEFAULT_GAME)
    parser.add_argument('--out', type=Path, required=True)
    parser.add_argument('--method', action='append', type=int, help='replay only these recorded method indices')
    args = parser.parse_args()
    batch, out = args.batch.resolve(), args.out.resolve()
    if out.is_relative_to(batch):
        parser.error('--out must be outside the historical evidence batch')
    manifest = batch / 'archive.json'
    archive = json.loads(manifest.read_text())
    plan = archive['result']['replay']
    n = Native(args.game)
    provenance = n.provenance()
    matches = {}
    for kind in ('dll', 'metadata'):
        expected = archive['provenance']['client'][kind]
        if expected is None:
            matches[kind] = 'historical fingerprint not recorded'
            continue
        if 'variants' in expected:
            parser.error(f'{kind}: several historical fingerprints; split the source-specific replay first')
        actual = provenance['client'][kind]['sha256']
        if expected['sha256'] != actual:
            parser.error(f'{kind}: input fingerprint differs from this historical batch; historical selectors were not applied')
        matches[kind] = True
    provenance['tool']['entrypoint'] = fingerprint(Path(__file__))
    provenance['archive'] = fingerprint(manifest)
    provenance['historicalInputMatch'] = matches
    provenance['scope'] = ('Fresh static re-extraction of recorded selectors. Does not reconstruct historical '
                           'content decoders, mirrors, emulation stubs or runtime XLua state.')
    result = dict(methods=[], blocks=[], types=[], constants=[], bundles=[], unavailable=[])
    selected = [m for m in plan['methods'] if not args.method or m['index'] in args.method]
    if args.method and set(args.method) != {m['index'] for m in selected}:
        parser.error('--method includes an index not recorded in this batch')
    # Validate recorded identities before applying any indices/addresses.
    for item in selected:
        if any(matches[k] is not True for k in ('dll', 'metadata')):
            result['unavailable'].append(dict(selector=item, reason='historical native input identity not recorded'))
            continue
        current = n.method(item['index'])
        if item.get('fullname') and not (canonical(item['fullname']) == canonical(current['fullname']) or
                canonical(current['fullname']).endswith('.' + canonical(item['fullname']))):
            result['unavailable'].append(dict(selector=item, reason='method name differs from historical record',
                                              current=current['fullname']))
            continue
        if item.get('address') and int(item['address'], 16) != current.get('address'):
            result['unavailable'].append(dict(selector=item, reason='method VA differs from historical record'))
            continue
        if item['mode'] == 'disasm':
            if not current.get('address'):
                result['unavailable'].append(dict(selector=item, reason=current.get('addressStatus', 'no native body')))
                continue
            result['methods'].append(n.disassemble(item['index']))
        else:
            result['methods'].append(dict(method=current))
    if not args.method:
        native_identity = all(matches[k] is True for k in ('dll', 'metadata'))
        for item in plan['blocks']:
            if native_identity:
                result['blocks'].append(n.disassemble_at(int(item['address'], 16)))
            else:
                result['unavailable'].append(dict(selector=item, reason='historical native input identity not recorded'))
        by_name = {canonical(n.typename(t['index'])):t for t in n.types}
        for item in plan['types']:
            if not native_identity:
                result['unavailable'].append(dict(selector=item, reason='historical native input identity not recorded'))
                continue
            t = by_name.get(canonical(item['name']))
            if t is None:
                result['unavailable'].append(dict(selector=item, reason='recorded type name not found'))
                continue
            result['types'].append(dict(t, fullname=n.typename(t['index']), recordedName=item['name'], fields=n.fields(t['index'])))
        for item in plan['constants']:
            if native_identity:
                result['constants'].append(dict(item, bytes=n.pe.read(int(item['address'], 16), 4).hex(),
                    values=n.pe.unpack(item['format'], int(item['address'], 16))))
            else:
                result['unavailable'].append(dict(selector=item, reason='historical native input identity not recorded'))
        for i, item in enumerate(plan['bundles']):
            path = args.game / item['gameRelativePath']
            if not path.is_file() or fingerprint(path)['sha256'] != item['sha256']:
                result['unavailable'].append(dict(selector=item, reason='recorded bundle missing or fingerprint differs'))
                continue
            destination = out / f'bundle-{i}'
            subprocess.run([sys.executable, str(Path(__file__).with_name('assets.py')), str(path),
                            '--out', str(destination)], check=True)
            result['bundles'].append(dict(source=item, output=str(destination.relative_to(out) / 'assets.json')))
    out.mkdir(parents=True, exist_ok=True)
    target = out / 'replay.json'
    target.write_text(json.dumps(dict(provenance=provenance, result=result), ensure_ascii=False, indent=2) + '\n')
    print(f'{target}: {len(result["methods"])} methods, {len(result["unavailable"])} unavailable selectors')
    if result['unavailable']:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
