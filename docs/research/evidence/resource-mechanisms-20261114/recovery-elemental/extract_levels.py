#!/usr/bin/env python3
"""Project actual level references for the chosen elemental examples."""
import argparse
import hashlib
import json
import subprocess
from pathlib import Path

REVISION = "bee3f83c5d60590b5e1cd42b8d09d00ce32ab10d"
LEVELS = ["zh_CN/gamedata/levels/activities/act3break/level_act3break_04.json",
          "zh_CN/gamedata/levels/activities/act35side/level_act35side_01.json",
          "zh_CN/gamedata/levels/activities/act34side/level_act34side_03.json",
          "zh_CN/gamedata/levels/activities/act2multi/raftlevels/level_act2multi_raft_start-r-1.json"]
KEYS = {"enemy_8018_etouch", "enemy_8018_etouch_1", "enemy_8018_etouch_2", "enemy_8018_etouch_3", "enemy_10009_sggem", "enemy_4053_muejet", "enemy_1436_dsdivi", "enemy_1436_dsdivi_2", "enemy_1436_dsdivi_3", "enemy_1436_dsdivi_4"}


def walk(v, path=""):
    if isinstance(v, dict):
        yield path, v
        for k, x in v.items():
            yield from walk(x, path + "/" + k.replace("~", "~0").replace("/", "~1"))
    elif isinstance(v, list):
        for i, x in enumerate(v):
            yield from walk(x, path + "/" + str(i))


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--mirror", type=Path, default=Path(".cache/native-research/checkpoint-nondefault-20261107/mirror"))
    p.add_argument("--out", type=Path, required=True)
    a = p.parse_args()
    sources = []
    def load(relative):
        raw = (a.mirror / relative).read_bytes()
        blob = hashlib.sha1(b"blob " + str(len(raw)).encode() + b"\0" + raw).hexdigest()
        expected = subprocess.check_output(["git", "-C", str(a.mirror), "rev-parse", f"{REVISION}:{relative}"], text=True).strip()
        if blob != expected:
            raise ValueError((relative, blob, expected))
        sources.append({"revision": REVISION, "path": relative,
                        "url": f"https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/{REVISION}/{relative}",
                        "bytes": len(raw), "sha256": hashlib.sha256(raw).hexdigest(), "gitBlobSha1": blob})
        return json.loads(raw)
    enemy_data = load("zh_CN/gamedata/levels/enemydata/enemy_database.json")
    enemies = [{"pointer": f"/enemies/{i}", "record": row} for i, row in enumerate(enemy_data["enemies"]) if row["Key"] in KEYS]
    levels = []
    for relative in LEVELS:
        data = load(relative)
        matches = [{"pointer": path, "record": v} for path, v in walk(data)
                   if any(isinstance(x, str) and x in KEYS for x in v.values())]
        levels.append({"path": relative, "levelId": data.get("levelId"), "references": matches})
    a.out.parent.mkdir(parents=True, exist_ok=True)
    a.out.write_text(json.dumps({"provenance": {"collectedOn": "2026-11-14", "sources": sources,
        "scriptSha256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
        "scope": "Pinned raw level and EnemyDB references; exact direct values selected. Does not prove a particular battle execution."},
        "result": {"keys": sorted(KEYS), "enemies": enemies, "levels": levels}}, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"enemies": len(enemies), "levelMatches": [len(x["references"]) for x in levels]}))


if __name__ == "__main__":
    main()
