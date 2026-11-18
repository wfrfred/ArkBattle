#!/usr/bin/env python3
import argparse
import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path(".agents/skills/arkbattle-native-research/scripts").resolve()))
from native import fingerprint
from unity_assets import Reader, bundle, serialized

parser = argparse.ArgumentParser(description="Read ordinary enemy body and configured Unity2D collision matrix.")
parser.add_argument("--out", type=Path, required=True)
parser.add_argument("--enemy-bundle", type=Path, required=True)
parser.add_argument("--manager", type=Path, required=True)
parser.add_argument("--enemy", nargs="+", default=["enemy_1016_diaman", "enemy_1003_ncbow"])
args = parser.parse_args()

def pptr(r):
    return r.val("i"), r.val("q")

data = args.manager.read_bytes()
r = Reader(data, ">", 8)
assert r.val("I") == 22 and r.val("I") == 0 and r.val("B") == 0
r.p = 32
data_offset = r.val("Q")
r.val("Q")
r.e = "<"
unity_build = r.cs()
platform = r.val("i")
assert r.val("B") == 0
classes = []
for _ in range(r.val("i")):
    class_id = r.val("i")
    r.val("B")
    r.val("h")
    r.read(32 if class_id == 114 else 16)
    classes.append(class_id)
settings = {}
for _ in range(r.val("i")):
    r.align()
    path_id = r.val("q")
    offset = r.val("q")
    size = r.val("I")
    class_id = classes[r.val("i")]
    if class_id in {19,78}:
        settings[class_id] = {"id":path_id, "rawHex":data[data_offset+offset:data_offset+offset+size].hex()}
tags = Reader(bytes.fromhex(settings[78]["rawHex"]))
for _ in range(tags.val("i")):
    tags.string()
layer_names = [tags.string() for _ in range(tags.val("i"))]
physics = Reader(bytes.fromhex(settings[19]["rawHex"]),p=148)
assert physics.val("i") == len(layer_names) == 32
layer_mask = [physics.val("I") for _ in layer_names]
assert physics.p == len(physics.b)
assert all((layer_mask[a] >> b & 1) == (layer_mask[b] >> a & 1) for a in range(32) for b in range(32))
matrix = {k: {"layer": i, "collidesWith": [layer_names[j] or str(j) for j in range(32) if layer_mask[i] >> j & 1]}
          for i, k in enumerate(layer_names) if k}

enemies = []
for cab,data in bundle(args.enemy_bundle)[0]:
    state = serialized(data)
    raws = {o["id"]:data[o["start"]:o["start"]+o["size"]] for o in state["objects"]}
    classes = {o["id"]:o["classid"] for o in state["objects"]}
    objects = {}
    transforms = {}
    for o in state["objects"]:
        path_id = o["id"]
        raw = raws[path_id]
        if o["classid"] == 1:
            r = Reader(raw)
            components = [pptr(r) for _ in range(r.val("i"))]
            layer = r.val("i")
            name = r.string()
            tag = r.val("H")
            active = r.val("B")
            objects[path_id] = {"name":name,"active":bool(active),"layer":layer,"layerName":layer_names[layer],
                                "components":components}
        if o["classid"] == 4:
            r = Reader(raw)
            game_object = pptr(r)
            r.read(16)
            local_position = r.val("fff")
            local_scale = r.val("fff")
            children = [pptr(r) for _ in range(r.val("i"))]
            parent = pptr(r)
            transforms[path_id] = {"gameObject":game_object,"children":children,"parent":parent,
                                   "localPosition":local_position, "localScale":local_scale}
    for path_id, game_object in objects.items():
        if game_object["name"] not in args.enemy:
            continue
        own_transform = next(pid for f,pid in game_object["components"] if f == 0 and classes.get(pid) == 4)
        pending = [own_transform]
        records = []
        while pending:
            child = transforms[pending.pop()]
            pending.extend(pid for f,pid in child["children"] if f == 0)
            file,pid = child["gameObject"]
            if file != 0:
                continue
            current = objects[pid]
            for component_file,component_id in current["components"]:
                if component_file != 0 or classes.get(component_id) not in {50, 53, 58,60,61,66,68,70}:
                    continue
                c = classes[component_id]
                raw = raws[component_id]
                properties = {}
                if c == 58 and len(raw) == 48:
                    properties.update(enabled=bool(raw[12]),isTrigger=bool(raw[32]),
                                      offset=Reader(raw,p=36).val("ff"),radius=Reader(raw,p=44).val("f"))
                if c == 70 and len(raw) == 56:
                    properties.update(enabled=bool(raw[12]),isTrigger=bool(raw[32]),
                                      offset=Reader(raw,p=36).val("ff"),size=Reader(raw,p=44).val("ff"),
                                      direction=Reader(raw,p=52).val("i"))
                if c == 50 and len(raw) == 64:
                    properties.update(bodyType=Reader(raw,p=12).val("i"),simulated=bool(raw[16]),mass=Reader(raw,p=20).val("f"),
                                      gravityScale=Reader(raw,p=32).val("f"),collisionDetection=Reader(raw,p=56).val("i"),
                                      linearDrag=Reader(raw,p=24).val("f"),constraints=Reader(raw,p=60).val("I"))
                records.append({"classId":c,"componentId":component_id,"gameObjectId":pid,"gameObject":current,
                                "transform":child,"rawHex":raw.hex(),"properties":properties})
        enemies.append({"prefab":game_object["name"],"rootId":path_id,"cab":cab,"physics":records})
assert {r["prefab"] for r in enemies} == set(args.enemy)
evidence = {
    "provenance": {
        "scope": "Static serialized settings and component bytes for selected prefab roots.",
        "caseScript": fingerprint(Path(__file__)),
        "sources": {"manager": fingerprint(args.manager), "enemyBundle": fingerprint(args.enemy_bundle)},
    },
    "result": {"unityBuild": unity_build, "playerSettings": settings,
               "layerNames": layer_names, "matrix": matrix, "enemies": enemies},
}
args.out.parent.mkdir(parents=True, exist_ok=True)
args.out.write_text(json.dumps(evidence, ensure_ascii=False, indent=2) + "\n")
