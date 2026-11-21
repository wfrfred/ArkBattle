#!/usr/bin/env python3
"""Extract the selected Predefine and alias examples from the pinned Git blobs."""
import argparse
import hashlib
import json
from pathlib import Path
import subprocess
import sys

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path.cwd() / ".agents/skills/arkbattle-native-research/scripts"))
from config import MISSING, get

revision = "17759cc8cdf37388414145d16262a3a06f3ab25e"
gamedata = "zh_CN/gamedata"
blocks = ("predefines", "hardPredefines")
arrays = ("characterInsts", "tokenInsts", "characterCards", "tokenCards")
switches = ("isTrainingLevel", "isHardTrainingLevel", "isPredefinedCardsSelectable")
examples = {
    "obt/main/level_main_01-02.json": (
        "/predefines/characterCards/0",
    ),
    "obt/main/level_main_01-11.json": (
        "/predefines/characterInsts/0",
        "/waves/0/fragments/1/actions/2",
    ),
    "obt/main/level_main_03-07.json": (
        "/predefines/tokenInsts/0",
        "/predefines/tokenCards/0",
    ),
    "obt/main/level_main_08-09.json": (
        "/predefines/characterInsts/0",
    ),
    "obt/main/level_main_14-09.json": (
        "/predefines/characterInsts/0",
        "/predefines/characterInsts/6",
        "/waves/0/fragments/8/actions/12",
        "/waves/0/fragments/8/actions/13",
    ),
    "obt/training/level_training_1.json": (
        "/predefines/characterCards/2",
        "/waves/2/fragments/0/actions/0",
    ),
    "activities/act11d0/level_act11d0_sub-1-1.json": (
        "/predefines/characterInsts/0",
        "/predefines/characterInsts/1",
        "/hardPredefines/characterCards/0",
    ),
    "activities/act11d0/level_act11d0_sub-1-2.json": (
        "/predefines/characterInsts/0",
        "/hardPredefines/characterCards/0",
    ),
    "activities/act14side/level_act14side_ex02.json": (
        "/predefines/tokenInsts/0",
        "/waves/0/fragments/0/actions/0",
        "/waves/0/fragments/0/actions/1",
    ),
}
stage_ids = (
    "main_01-02", "main_01-11", "main_03-07", "main_08-09", "main_14-09", "tr_01",
    "act11d0_s01", "act11d0_s01#f#", "act11d0_s02", "act11d0_s02#f#",
    "act14side_ex02",
)

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--repo", type=Path, default=Path("assets/arknights-game-data"))
parser.add_argument("--out", type=Path, required=True)
args = parser.parse_args()


def git(*arguments):
    return subprocess.check_output(("git", "-C", str(args.repo), *arguments))


def source(path):
    spec = f"{revision}:{path}"
    value = git("show", spec)
    return json.loads(value), {
        "path": path,
        "gitBlob": git("rev-parse", spec).decode().strip(),
        "bytes": len(value),
        "sha256": hashlib.sha256(value).hexdigest(),
    }


records = []
for level, pointers in examples.items():
    data, provenance = source(f"{gamedata}/levels/{level}")
    excerpt = {}
    for pointer in pointers:
        value = get(data, pointer)
        if value is MISSING:
            raise ValueError(f"missing selected pointer {level}#{pointer}")
        excerpt[pointer] = value

    counts = {
        block: (
            {key: len(result[key]) if isinstance(result.get(key), list) else result.get(key)
             for key in arrays}
            if isinstance(result := data.get(block), dict) else result
        )
        for block in blocks
    }
    records.append({
        "source": provenance,
        "counts": counts,
        "options": {key: data["options"].get(key) for key in switches},
        "excerpts": excerpt,
    })

data, provenance = source(f"{gamedata}/excel/stage_table.json")
stage_info = {
    f"/stages/{key}": {
        field: data["stages"][key][field]
        for field in ("stageId", "levelId", "code", "name", "difficulty")
    }
    for key in stage_ids
}
args.out.parent.mkdir(parents=True, exist_ok=True)
args.out.write_text(json.dumps(
    {
        "provenance": {
            "collectedOn": "2026-11-22",
            "repository": "https://github.com/Kengxxiao/ArknightsGameData",
            "revision": revision,
            "scope": "Explicitly selected level and stage-table JSON pointers from verified Git blobs",
        },
        "result": {
            "levels": records,
            "stageTable": {"source": provenance, "excerpts": stage_info},
        },
    },
    ensure_ascii=False, indent=2,
) + "\n")
