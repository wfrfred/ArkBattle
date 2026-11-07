#!/usr/bin/env python3
"""Select ordinary stage SPAWN witnesses for the route operation examples."""
import argparse
import datetime
import hashlib
import json
import sys
from pathlib import Path

sys.path.insert(0, ".agents/skills/arkbattle-native-research/scripts")
from native import fingerprint
parser = argparse.ArgumentParser()
parser.add_argument("--levels", type=Path, default=Path(".cache/native-research/checkpoint-nondefault-20261107/mirror-current/zh_CN/gamedata/levels"))
parser.add_argument("--out", type=Path, required=True)
args = parser.parse_args()
keys = {"enemy_10036_cnvpvd", "enemy_10057_cjstel", "enemy_1263_durbus", "enemy_1576_spbell", "enemy_17002_flgshp", "enemy_2055_smlead", "enemy_1177_dufrbl", "enemy_2123_dyjsww", "enemy_10007_trspsb", "enemy_6027_bqthie", "enemy_2137_shsdgo"}
def walk(value, pointer=""):
    if isinstance(value, dict):
        yield pointer, value
        for k,v in value.items():
            yield from walk(v, pointer+"/"+k.replace("~", "~0").replace("/", "~1"))
    elif isinstance(value, list):
        for i,v in enumerate(value):
            yield from walk(v, pointer+"/"+str(i))
dbpath = args.levels/"enemydata/enemy_database.json"
db = json.loads(dbpath.read_text())
data = [{"pointer":"/enemies/"+str(i), "entry":r} for i,r in enumerate(db["enemies"]) if r["Key"] in keys]
found = {}
files = sorted((args.levels/"activities").rglob("*.json")) + sorted((args.levels/"obt/main").rglob("*.json")) + sorted((args.levels/"obt/roguelike").rglob("*.json"))
for p in files:
    if any(s in str(p) for s in ("sandbox", "coop", "enemyduel", "tower")):
        continue
    raw = p.read_bytes()
    if not any(k.encode() in raw for k in keys-found.keys()):
        continue
    x = json.loads(raw)
    for pointer, node in walk(x.get("waves", []), "/waves"):
        key = node.get("key")
        if key in keys and key not in found and node.get("actionType") == "SPAWN" and node.get("count", 0) > 0:
            route_i = node.get("routeIndex")
            found[key] = {"file":str(p.relative_to(args.levels)), "source":fingerprint(p), "pointer":pointer, "spawn":node,
                          "route":x.get("routes", [])[route_i] if isinstance(route_i,int) and 0<=route_i<len(x.get("routes",[])) else None,
                          "enemyDbRefs":[r for r in x.get("enemyDbRefs",[]) if r.get("id")==key],
                          "branches":x.get("branches"), "runes":x.get("runes"),
                          "routeMarkers":[{"tileIndex":i,"definition":t} for i,t in enumerate(x.get("mapData",{}).get("tiles",[])) if any(b.get("key")=="check_point_index" for b in t.get("blackboard",[]) or [])],
                          "trapCards":[r for r in (x.get("predefines") or {}).get("tokenCards",[]) if r.get("inst",{}).get("characterKey")=="trap_186_cnvfwks"]}
args.out.parent.mkdir(parents=True, exist_ok=True)
args.out.write_text(json.dumps({"provenance":{"collectedOn":datetime.date.today().isoformat(), "script":fingerprint(Path(__file__)), "sourceUrl":"https://github.com/Kengxxiao/ArknightsGameData", "revision":"63c7cec73c3858d0ae913f85cc89af3cef4d744f", "enemyDatabase":fingerprint(dbpath), "scope":"Selected positive SPAWN witnesses. No runtime execution or completeness claim; excludes explicitly out-of-scope modes from witness selection."}, "result":{"enemyData":data, "stageWitnesses":found, "unfound":sorted(keys-found.keys())}}, ensure_ascii=False, indent=2)+"\n")
print("found",len(found),"missing",sorted(keys-found.keys()))
for k,v in found.items():print(k,v["file"],v["pointer"])
