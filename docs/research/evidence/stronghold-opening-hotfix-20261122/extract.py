import argparse
import hashlib
import json
import re
from pathlib import Path
from urllib.parse import quote
from urllib.request import urlopen


GAME = Path('/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game')
REPOSITORY = 'yuanyan3060/ArknightsGameResource'
REVISION = '0fdfa06570cda97c404a4519da4df984eae56951'
VERSION = '26-11-13-06-37-23-89286612'
LUA = 'gamedata/[uc]lua/hotfixes'
REGISTRY = f'{LUA}/definedfix.lua'
ASSETS = (
    'activity/[uc]act3autochess.ab',
    'charpack/char_1014_nearl2.ab',
    'config/buff_template_holder.ab',
    'battle/prefabs/[uc]skills.ab',
)
CALLS = re.compile(
    r'\b(?:DoBattlePreSpawn|inBattlePrespawn|_TryDeployChessInst|OnCardDrawn|'
    r'ManagedComboDrawCardBuff|SpawnCharacterOrToken|nearl2_t_1|kazimierz|'
    r'DeckManagedCardBuff|_LoadBattlePlayerData|_ResetBattleInfo|DoLoadGameInternal|'
    r'Draw|PreprocessDeck|RegisterComboDrawCardBuff|DealDummyTalent|RegisterDeckManagedCardBuff)\b',
    re.IGNORECASE,
)
REPLACEMENT = re.compile(r'self:Fix(?:_ex)?\(([^,]+),\s*"([^"]+)"')


def fingerprint(data):
    return {'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()}


def local_manifests(game):
    result = {}
    data_root = game / 'Arknights_Data'
    for name in ('StreamingAssets/AB/Windows', 'PersistentData/Bundles'):
        directory = data_root / name
        raw = (directory / 'hot_update_list.json').read_bytes()
        manifest = json.loads(raw)
        entries = {entry['name']: entry for entry in manifest['abInfos']}
        resources = {}
        for path in ASSETS:
            local_file = directory / path
            resources[path] = {
                'manifestEntry': entries.get(path),
                'downloaded': fingerprint(local_file.read_bytes()) if local_file.is_file() else None,
            }
        result[name] = {
            'manifest': fingerprint(raw),
            'versionId': manifest['versionId'],
            'manifestVersion': manifest['manifestVersion'],
            'resources': resources,
        }
    return result


def inspect_registry(mirror):
    sources = {}

    def read(path):
        url = f'https://raw.githubusercontent.com/{REPOSITORY}/{REVISION}/{quote(path)}'
        if mirror is None:
            with urlopen(url, timeout=20) as response:
                raw = response.read()
        else:
            raw = (mirror / path).read_bytes()
        sources[path] = {
            'url': url,
            'gitBlob': hashlib.sha1(f'blob {len(raw)}\0'.encode() + raw).hexdigest(),
            **fingerprint(raw),
        }
        return raw.decode('utf-8')

    version = read('version').strip()
    if version != VERSION:
        raise ValueError(f'Unexpected mirror resource version {version}')
    registry = re.findall(r'"(HotFixes/\w+)"', read(REGISTRY), flags=re.IGNORECASE)
    scripts = []
    for name in registry:
        path = f'{LUA}/{name.split("/")[-1].lower()}.lua'
        replacements, calls = [], []
        for number, line in enumerate(read(path).splitlines(), start=1):
            replacement = REPLACEMENT.search(line)
            if replacement:
                replacements.append({'line': number, 'target': replacement[1], 'method': replacement[2]})
            matches = list(dict.fromkeys(match[0] for match in CALLS.finditer(line)))
            if matches:
                calls.append({'line': number, 'matches': matches})
        scripts.append({'name': name, 'path': path, 'replacements': replacements, 'termHits': calls})
    return {'version': version, 'registry': REGISTRY, 'sources': sources, 'scripts': scripts}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--game', type=Path, default=GAME)
    parser.add_argument('--mirror', type=Path, help='Local files from pinned mirror commit, fetched from GitHub when omitted')
    parser.add_argument('--out', type=Path, required=True)
    arguments = parser.parse_args()
    document = {
        'provenance': {
            'collectedOn': '2026-11-22',
            'game': str(arguments.game.resolve()),
            'mirrorRepository': REPOSITORY,
            'mirrorCommit': REVISION,
            'scope': 'Installed Windows resource manifests and a separately versioned public decoded Lua registry. No runtime execution.',
        },
        'result': {
            'localManifests': local_manifests(arguments.game),
            'mirror': inspect_registry(arguments.mirror),
        },
    }
    arguments.out.write_text(json.dumps(document, indent=2, ensure_ascii=False) + '\n')


if __name__ == '__main__':
    main()
