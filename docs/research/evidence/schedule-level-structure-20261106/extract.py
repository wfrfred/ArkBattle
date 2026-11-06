#!/usr/bin/env python3
"""Extract pinned level structure, accepting either local JSON or a fresh download."""
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
import argparse
import hashlib
import json
from pathlib import Path
from urllib.request import urlopen

COMMIT = "bee3f83c5d60590b5e1cd42b8d09d00ce32ab10d"
REPOSITORY = "Kengxxiao/ArknightsGameData"
SOURCES = (
    (
        "level_hard_08-01.json",
        "zh_CN/gamedata/levels/obt/hard/level_hard_08-01.json",
        (
            "/waves/0/preDelay",
            "/waves/0/postDelay",
            "/waves/0/maxTimeWaitingForNextWave",
            "/waves/0/fragments/1",
            "/waves/0/fragments/5/actions/4",
            "/branches",
        ),
    ),
    (
        "level_act1autochess_h07_02.json",
        "zh_CN/gamedata/levels/activities/act1autochess/level_act1autochess_h07_02.json",
        ("/waves/0", "/branches", "/extraRoutes/0"),
    ),
)


def pointer(document, selector):
    value = document
    for part in selector.split("/")[1:]:
        key = part.replace("~1", "/").replace("~0", "~")
        value = value[int(key)] if isinstance(value, list) else value[key]
    return value


def extract(name, path, selectors, document):
    canonical = json.dumps(document, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    branches = document["branches"] or {}
    return {
        "provenance": {
            "collectedOn": "2026-11-06",
            "scope": "Pinned extracted game configuration; no new native-code or runtime observation.",
            "repository": REPOSITORY,
            "commit": COMMIT,
            "path": path,
            "url": f"https://github.com/{REPOSITORY}/blob/{COMMIT}/{path}",
            "canonicalJsonSha256": hashlib.sha256(canonical.encode()).hexdigest(),
            "hashDefinition": "SHA-256 of complete parsed source, JSON ensure_ascii=False, sort_keys=True, separators=(',', ':'); not a raw Git blob hash.",
            "selectors": list(selectors),
        },
        "result": {
            "name": name,
            "topLevelKeys": list(document),
            "hasTimelineField": "timeline" in document,
            "waveCount": len(document["waves"]),
            "fragmentCounts": [len(wave["fragments"]) for wave in document["waves"]],
            "routeCount": len(document["routes"]),
            "extraRouteCount": len(document["extraRoutes"]),
            "branches": {
                key: {
                    "keys": list(branch),
                    "phaseCount": len(branch["phases"]),
                    "phaseKeys": [list(phase) for phase in branch["phases"]],
                }
                for key, branch in branches.items()
            },
            "excerpts": {selector: pointer(document, selector) for selector in selectors},
        },
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input-dir", type=Path, help="Read the two named JSON files locally instead of downloading.")
    parser.add_argument("--out", required=True, type=Path)
    args = parser.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)
    for name, path, selectors in SOURCES:
        if args.input_dir is not None:
            source = (args.input_dir / name).read_bytes()
        else:
            with urlopen(f"https://raw.githubusercontent.com/{REPOSITORY}/{COMMIT}/{path}", timeout=60) as response:
                source = response.read()
        record = extract(name, path, selectors, json.loads(source))
        destination = args.out / name
        destination.write_text(json.dumps(record, ensure_ascii=False, indent=2) + "\n")
        print(f"{name}: waves={record['result']['waveCount']}, branches={list(record['result']['branches'])}")


if __name__ == "__main__":
    main()
