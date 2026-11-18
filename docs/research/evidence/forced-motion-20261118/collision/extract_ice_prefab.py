#!/usr/bin/env python3
import argparse
import hashlib
import importlib.util
import json
import sys
from pathlib import Path

parser = argparse.ArgumentParser(description="Resolve tile_icetur_lt Prefab to its serialized IceCornerTile MonoScript.")
parser.add_argument("--out", type=Path, required=True)
parser.add_argument("--game-data", type=Path, required=True)
args = parser.parse_args()
sys.dont_write_bytecode = True
repo = Path.cwd()
tools = repo / ".agents/skills/arkbattle-native-research/scripts"
sys.path.insert(0, str(tools))
from native import fingerprint
from unity_assets import bundle, serialized, script

def load_helper(path):
    spec = importlib.util.spec_from_file_location(path.stem, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module

fields_reader = repo / "docs/research/evidence/attack-addon-order-20261102/content/decode_content.py"
external_reader = repo / "docs/research/evidence/nymph-action-settlement-20261103/projectile/decode_projectile.py"
decoder = load_helper(fields_reader)
externals = load_helper(external_reader)
assets = args.game_data / "StreamingAssets/AB/Windows"
tiles = assets / "battle/prefabs/[uc]tiles.ab"
scripts = assets / "anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin"
cab, data = bundle(tiles)[0][0]
types = decoder.trees(data)
objects = serialized(data)["objects"]

def decode(o):
    raw = data[o["start"]:o["start"] + o["size"]]
    return {"pathId":str(o["id"]),"type":o["typeid"],"classId":o["classid"],
            "rawHex":raw.hex(),"sha256":hashlib.sha256(raw).hexdigest(),
            "values":decoder.decode(raw,types[o["typeid"]])}

obj = next(decode(o) for o in objects if o["id"] == -5167338031130463484)
comp = next(decode(o) for o in objects if o["id"] == 7296226687332004612)
assert obj["values"]["common:427"] == comp["values"]["_tileKey"] == "tile_icetur_lt"
assert comp["values"]["common:374"] == {"m_FileID":0,"m_PathID":int(obj["pathId"])}
p = comp["values"]["common:490"]
external = externals.trees(data)[1][p["m_FileID"]-1]
script_file = external["path"].split("/")[-1]
script_data = dict(bundle(scripts)[0])[script_file]
script_obj = next(o for o in serialized(script_data)["objects"] if o["id"] == p["m_PathID"])
assert script_obj["classid"] == 115
script_type = script(script_obj,script_data)
assert (script_type["ns"],script_type["cl"]) == ("Torappu.Battle","IceCornerTile")
raw = script_data[script_obj["start"]:script_obj["start"] + script_obj["size"]]
evidence = {
    "provenance": {
        "scope": "Installed prefab and externally resolved MonoScript.",
        "sources": [fingerprint(tiles), fingerprint(scripts)],
        "tools": [fingerprint(path) for path in (Path(__file__), fields_reader, external_reader)],
    },
    "result": {
        "prefab": {"file": cab, "gameObject": obj, "component": comp},
        "scriptBinding": {"externalReference": external, "file": script_file, "value": script_type,
                          "rawHex": raw.hex(), "sha256": hashlib.sha256(raw).hexdigest()},
    },
}
args.out.parent.mkdir(parents=True, exist_ok=True)
args.out.write_text(json.dumps(evidence, ensure_ascii=False, indent=2) + "\n")
