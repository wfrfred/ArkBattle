#!/usr/bin/env python3
import argparse
import json
import sys
from collections import Counter
from pathlib import Path

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path(".agents/skills/arkbattle-native-research/scripts").resolve()))
from native import fingerprint
from unity_assets import Reader, bundle, serialized

parser = argparse.ArgumentParser(description="Extract named GameObjects and 2D collider source bytes from installed terrain bundles.")
parser.add_argument("--out", type=Path, required=True)
parser.add_argument("bundles", type=Path, nargs="+")
args = parser.parse_args()
records = []
collider_classes = {53, 58, 60, 61, 66, 68, 70}
names_exact = {"tile_road", "tile_forbidden", "tile_wall", "tile_fence", "tile_hole", "tile_bigforce", "tile_gazebo"}
for path in args.bundles:
    files, version = bundle(path)
    result = {"source": fingerprint(path), "bundleUnityVersion": version, "files": []}
    for name, data in files:
        if name.endswith((".resS", ".resource")):
            continue
        state = serialized(data)
        type_reader = Reader(data, "<", 48)
        type_reader.cs()
        type_reader.val("i")
        has_type_tree = bool(type_reader.val("B"))
        box_type_tree = []
        if has_type_tree:
            for _ in range(type_reader.val("i")):
                class_id = type_reader.val("i")
                type_reader.val("B")
                type_reader.val("h")
                type_reader.read(16)
                if class_id == 114:
                    type_reader.read(16)
                node_count, string_size = type_reader.val("ii")
                nodes = [type_reader.val("HBBIIiiiQ") for _ in range(node_count)]
                strings = type_reader.read(string_size)
                type_reader.read(4 * type_reader.val("i"))
                if class_id == 61:
                    def label(i):
                        return f"common:{i & 0x7fffffff}" if i & 0x80000000 else strings[i:strings.index(0, i)].decode()
                    box_type_tree.append([
                        {"level":node[1],"type":label(node[3]),"name":label(node[4]),"size":node[5],"flags":hex(node[7])}
                        for node in nodes
                    ])
        class_counts = Counter(o["classid"] for o in state["objects"])
        game_objects = {}
        by_id = {o["id"]: o for o in state["objects"]}
        for o in state["objects"]:
            if o["classid"] != 1:
                continue
            raw = data[o["start"]:o["start"]+o["size"]]
            r = Reader(raw)
            n = r.val("i")
            if n < 0 or n * 12 + 12 > len(raw):
                continue
            pointers = [(r.val("i"), r.val("q")) for _ in range(n)]
            layer = r.val("i")
            object_name = r.string()
            game_objects[o["id"]] = {"name":object_name,"layer":layer,"components":pointers,"active":bool(raw[r.p+2])}
        colliders = []
        for o in state["objects"]:
            if o["classid"] not in collider_classes:
                continue
            raw = data[o["start"]:o["start"]+o["size"]]
            r = Reader(raw)
            file, go = (r.val("i"), r.val("q"))
            properties = {}
            if o["classid"] == 61 and len(raw) == 112 and box_type_tree:
                properties = {"enabled":bool(raw[12]), "isTrigger":bool(raw[32]),
                              "offset":Reader(raw,p=36).val("ff"), "size":Reader(raw,p=100).val("ff"),
                              "edgeRadius":Reader(raw,p=108).val("f")}
            colliders.append({**o, "gameObjectPointer":[file,go], "gameObject":game_objects.get(go) if file == 0 else None,
                              "rawHex":raw.hex(), "box2D":properties})
        targets = {}
        for go, value in game_objects.items():
            if value["name"] in names_exact or value["name"].lower().startswith(("collider", "physics")):
                targets[go] = {**value, "componentClasses":[by_id[p]["classid"] if f == 0 and p in by_id else None for f,p in value["components"]]}
        result["files"].append({"name":name,"serializedUnityVersion":state["uv"],"classCounts":class_counts,"boxColliderTypeTrees":box_type_tree,"colliders":colliders,"targetRoots":targets})
    records.append(result)
evidence = {
    "provenance": {
        "scope": "GameObject component PPtrs and raw Collider bytes.",
        "caseScript": fingerprint(Path(__file__)),
    },
    "result": {"bundles": records},
}
args.out.parent.mkdir(parents=True, exist_ok=True)
args.out.write_text(json.dumps(evidence, ensure_ascii=False, indent=2) + "\n")
