#!/usr/bin/env python3
"""Re-extract block-position interpolation and interruption witnesses."""
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
import argparse
import bisect
import json
import struct
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT / '.agents/skills/arkbattle-native-research/scripts'))
from native import Native, DEFAULT_GAME, fingerprint

QUERIES = (
    'Enemy._MoveToBlockPosition', 'Enemy.ReleaseFromBlocker', 'Enemy.ReleaseBlock',
    'Enemy.UnregisterBlocker', 'Enemy.RegisterBlocker', 'Enemy.get_stableBlockPosition',
    'Enemy.ForceSetPositionByWorldCoords', 'Enemy.Blink', 'Enemy.OnFinish',
    'Enemy.KnockBack', 'Enemy.BeginPull', 'Enemy.StillPull', 'Enemy.CheckBlockable',
    'UnbalanceState.OnEnter', 'LevitateState.OnEnter', 'DeadState.OnEnter',
    'BattleTweenMgr', 'BattleController.StartBattleTween',
    'DOTweenWrapper', 'TweenSettingsExtensions.SetEase', 'BattleUtil.CancelTween',
    'BlockManager.RemoveBlockee', 'BlockManager.ClearAllBlockees',
    'BlockManager.UpdateBlockees', 'BlockManager.AddBlockee',
)
EXPECTED = {
    'dll': '583b04ff4d1b1a4b35eaf09d77d936408c25447c9e345ef0463d814b6a123fc5',
    'metadata': 'd3fede171f92740a6f5dc053c58c7013d3c962db764ad1f05cbe977c074fcd1f',
}
WITNESS_IDS = {22093, 22097, 22106, 22107, 22108, 22109, 22112, 22113, 22115,
    22116, 22117, 22119, 64749, 76363, 76429, 76432, 76433, 76435, 76437,
    76438, 76448, 76449, 76450, 76452, 76492, 76515, 76529, 76546, 76564,
    76565, 76666, 76732, 76746, 77191, 77192, 77193, 77196, 78250, 305282}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--game', type=Path, default=DEFAULT_GAME)
    parser.add_argument('--out', type=Path, required=True)
    parser.add_argument('--query', action='append', default=[])
    parser.add_argument('--address', type=lambda s: int(s, 0), action='append', default=[])
    args = parser.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)
    native = Native(args.game)
    methods = [native.method(m['index']) for m in native.methods]
    selected = [m for m in methods if any(q.casefold() in m['fullname'].casefold()
                for q in QUERIES + tuple(args.query))]
    provenance = native.provenance()
    provenance['extractionScript'] = fingerprint(Path(__file__))
    if any(provenance['client'][key]['sha256'] != digest for key, digest in EXPECTED.items()):
        raise ValueError('client changed: re-locate batch-specific constants and raw helper VAs')
    results = {}
    def save(name, result):
        results[name] = result
        (args.out / name).write_text(json.dumps(dict(provenance=provenance, result=result),
            ensure_ascii=False, indent=2) + '\n')
    save('methods.json', selected)
    save('types.json', [dict(fullname=native.typename(t['index']), fields=native.fields(t['index']))
        for t in native.types if native.typename(t['index']) in (
            'Torappu.BattleTweenMgr/Tween', 'DG.Tweening.DOTween', 'DG.Tweening.Tween',
            'DG.Tweening.Ease')])
    defaults = {row['fieldIndex']: row for row in native.records(7, '<iii', 'fieldIndex typeIndex dataIndex')}
    data_offset, _ = native.table(8)
    enum_defaults = []
    for schema in results['types.json']:
        if schema['fullname'] == 'DG.Tweening.Ease':
            for field in schema['fields']:
                if field['name'] in ('Unset', 'Linear', 'OutQuad'):
                    record = defaults[field['index']]
                    encoded = native.metadata[data_offset + record['dataIndex']]
                    if encoded >= 128:
                        raise ValueError('unexpected multi-byte encoding for selected small enum')
                    enum_defaults.append(dict(name=field['name'], fieldIndex=field['index'],
                        dataIndex=record['dataIndex'], encodedByte=hex(encoded),
                        value=-(encoded >> 1) - 1 if encoded & 1 else encoded >> 1))
    save('enum-defaults.json', enum_defaults)
    save('constants.json', [dict(address=hex(address), bytes=native.pe.read(address, 4).hex(),
        value=struct.unpack('<f', native.pe.read(address, 4))[0])
        for address in (0x186e40b18, 0x186e3fbe0)])
    def extract_body(stem, body, start):
        save(stem + '.json', body)
        pos = bisect.bisect_right(native.addresses, start)
        limit = native.addresses[pos] if pos < len(native.addresses) else start
        seen = {start}
        pending = [body]
        while pending:
            part = pending.pop()
            targets = [int(ins.get('target', '0'), 16) for ins in part['instructions']
                if ins.get('targetOutsideRange')]
            if part['fullyDecoded'] and part['instructions'][-1]['mnemonic'] not in ('ret', 'jmp', 'int3'):
                targets.append(int(part['end'], 16))
            for target in targets:
                if start <= target < limit and target not in seen:
                    seen.add(target)
                    extra = native.disassemble_at(target)
                    save(f'{stem}-branch-{target:x}.json', extra)
                    pending.append(extra)
    for method in selected:
        if method.get('address'):
            body = native.disassemble(method['index'])
            # Expand separate .pdata ranges inside this method's known interval.
            # Calls and branches beyond the next entry still need explicit review.
            extract_body(f"method-{method['index']}", body, method['address'])
    for address in args.address:
        extract_body(f'address-{address:x}', native.disassemble_at(address), address)
    bodies = []
    for name, result in results.items():
        selected_body = (name.startswith('method-') and int(name.split('-')[1].split('.')[0]) in WITNESS_IDS)
        if not (selected_body or name.startswith('address-')):
            continue
        body = {k: v for k, v in result.items() if k not in ('aliases', 'instructions')}
        body['instructions'] = []
        for instruction in result['instructions']:
            row = dict(instruction)
            if len(row.get('methods', [])) > 8:
                row['omittedSharedAliasCount'] = len(row.pop('methods'))
            body['instructions'].append(row)
        bodies.append(dict(selector=name, **body))
    save('selected-native.json', dict(date='2026-10-31', methods=[m for m in selected
        if m['index'] in WITNESS_IDS], types=results['types.json'],
        enumDefaults=enum_defaults, constants=results['constants.json'], bodies=bodies))
    print(f'{len(selected)} method selectors; outputs: {args.out}')


if __name__ == '__main__':
    main()
