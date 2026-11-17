#!/usr/bin/env python3
"""Compare classification fields across byte-verified Character/Enemy JSON inputs."""

import argparse
import collections
import hashlib
import json
from pathlib import Path


ROOT = Path.cwd()
HERE = Path(__file__).resolve().parent
SOURCES = [
    {
        "file": ".cache/native-research/unit-audit-20261110/operator-config/character_table.json",
        "revision": "17759cc8cdf37388414145d16262a3a06f3ab25e",
        "path": "zh_CN/gamedata/excel/character_table.json",
        "sha256": "e523c7c83c36e2d76697121079e17d0282da1a94d59a55e1cc55616edf0b41c4",
        "gitBlobSha1": "f7284f66cfd87273a6805142b389aa314320968f",
    },
    {
        "file": ".cache/native-research/leithanien-enemydata-20261109/enemy_database.json",
        "revision": "63c7cec73c3858d0ae913f85cc89af3cef4d744f",
        "path": "zh_CN/gamedata/levels/enemydata/enemy_database.json",
        "sha256": "eb8559db76aecd92c37b3ac038de0e9aeb8b6d6c107adfaeadfe0fbc098e067b",
        "gitBlobSha1": "62ab806926b9c8ca5c80524730caf0066f6c2c2f",
    },
]
FIELDS = [
    "name", "profession", "subProfessionId", "position", "mainPower", "subPower",
    "tagList", "isNotObtainable",
]
SELECTED = [
    "char_504_rguard", "char_510_amedic", "char_616_pithst",
    "char_110_deepcl", "token_10001_deepcl_tentac",
    "char_250_phatom", "token_10007_phatom_twin",
    "char_248_mgllan", "token_10005_mgllan_drone1", "token_10005_mgllan_drone2",
    "token_10005_mgllan_drone3", "char_1033_swire2", "token_10031_swire2_gdtrap",
    "trap_001_crate", "trap_007_ballis", "trap_079_allydonq", "trap_235_hlnpcm",
    "trap_236_hlnpcs", "trap_237_hlnpcb",
    "trap_042_tidectrl", "trap_317_ubprison", "trap_014_tower",
]
SIDE_KEYS = {"side", "sideType", "sideTypeIndex", "_sideTypeIndex", "playerSide"}


def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def distribution(values):
    counts = collections.Counter(canonical(value) for value in values)
    return [{"value": json.loads(value), "count": count}
            for value, count in sorted(counts.items())]


def pointer_key(value):
    return str(value).replace("~", "~0").replace("/", "~1")


def walk(value, pointer=""):
    if isinstance(value, dict):
        for key, item in value.items():
            location = pointer + "/" + pointer_key(key)
            yield location, key, item
            yield from walk(item, location)
    elif isinstance(value, list):
        for index, item in enumerate(value):
            yield from walk(item, pointer + "/" + str(index))


def read_source(source):
    raw = (ROOT / source["file"]).read_bytes()
    digest = hashlib.sha256(raw).hexdigest()
    blob = hashlib.sha1(f"blob {len(raw)}\0".encode() + raw).hexdigest()
    if digest != source["sha256"] or blob != source["gitBlobSha1"]:
        raise ValueError("source fingerprint mismatch: " + source["file"])
    return json.loads(raw), {
        **source, "bytes": len(raw),
        "url": "https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/"
               + source["revision"] + "/" + source["path"],
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path, default=HERE / "result.json")
    args = parser.parse_args()
    characters, char_source = read_source(SOURCES[0])
    enemy_table, enemy_source = read_source(SOURCES[1])
    professions = sorted({value["profession"] for value in characters.values()})
    summaries = {}
    for profession in professions:
        rows = [(key, value) for key, value in characters.items()
                if value["profession"] == profession]
        power_rows = [
            {"pointer": "/" + pointer_key(key), "id": key,
             **{field: value.get(field) for field in FIELDS}}
            for key, value in rows
            if any((value.get("mainPower") or {}).values()) or value.get("subPower")
        ]
        summaries[profession] = {
            "count": len(rows),
            "distributions": {
                field: distribution(value.get(field) for _, value in rows)
                for field in ["mainPower", "subPower", "position", "subProfessionId", "tagList"]
            },
            "withNonemptyPowerCount": len(power_rows),
            "nonemptyPowerRows": power_rows if profession in {"TOKEN", "TRAP"} else [],
        }
    selected = []
    for key in SELECTED:
        if key not in characters:
            raise ValueError("missing selected Character data: " + key)
        value = characters[key]
        selected.append({"pointer": "/" + pointer_key(key), "id": key,
                         **{field: value.get(field) for field in FIELDS}})
    references = []
    selected_references = []
    for owner, value in characters.items():
        for pointer, key, target in walk(value, "/" + pointer_key(owner)):
            if key not in {"tokenKey", "overrideTokenKey"} or not target:
                continue
            target_data = characters.get(target)
            row = {
                "pointer": pointer, "field": key, "owner": owner,
                "ownerName": value["name"], "target": target,
                "targetPointer": "/" + pointer_key(target) if target_data else None,
                "targetName": target_data.get("name") if target_data else None,
                "targetProfession": target_data.get("profession") if target_data else None,
            }
            references.append(row)
            if owner in SELECTED:
                selected_references.append(row)
    enemy_fields = collections.Counter()
    enemies = enemy_table["enemies"]
    for enemy in enemies:
        for row in enemy["Value"]:
            enemy_fields.update(row["enemyData"].keys())
    result = {
        "characterCount": len(characters),
        "characterTopLevelFieldCounts": dict(sorted(collections.Counter(
            key for value in characters.values() for key in value).items())),
        "characterByProfession": summaries,
        "selectedCharacterRows": selected,
        "tokenReferenceCount": len(references),
        "tokenReferenceFieldCounts": dict(collections.Counter(row["field"] for row in references)),
        "tokenReferenceTargetProfessions": distribution(row["targetProfession"] for row in references),
        "unresolvedTokenReferences": [row for row in references if row["targetPointer"] is None],
        "selectedTokenReferences": selected_references,
        "sideKeyScan": {
            "exactKeys": sorted(SIDE_KEYS),
            "characterMatches": [{"pointer": pointer, "key": key, "value": value}
                                 for pointer, key, value in walk(characters) if key in SIDE_KEYS],
            "enemyMatches": [{"pointer": pointer, "key": key, "value": value}
                             for pointer, key, value in walk(enemy_table) if key in SIDE_KEYS],
        },
        "enemyCount": len(enemies),
        "enemyDataFieldCounts": dict(sorted(enemy_fields.items())),
        "requestedLeithanienEnemyRowsPresent": [enemy["Key"] for enemy in enemies
                                                if enemy["Key"] in {"enemy_9025_aclts", "enemy_9026_acltm"}],
        "limits": [
            "The whole-table counts include excluded modes; selected records are not all mode-activation proofs.",
            "profession is an explicit source field; no controller class or side is inferred from key prefixes.",
            "A tokenKey/overrideTokenKey reference proves a static binding, not that it is enabled in a particular battle.",
            "DisplayTokenDict is display data and is not treated as a runtime creation instruction.",
            "No matching side key in these tables does not prove side cannot be configured in Prefabs or changed by code.",
            "No claim that empty powers of the selected TOKEN rows can never be supplemented by preprocessing.",
        ],
    }
    output = {
        "provenance": {
            "collectedOn": "2026-11-18", "sources": [char_source, enemy_source],
            "script": {"path": str(Path(__file__).resolve()),
                       "sha256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest()},
            "scope": "Complete fixed Character/Enemy tables; explicit profession cohorts and selected original fields/references.",
        },
        "result": result,
    }
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"out": str(args.out), "characters": len(characters),
                      "cohorts": {key: value["count"] for key, value in summaries.items()},
                      "tokenReferences": len(references)}))


if __name__ == "__main__":
    main()
