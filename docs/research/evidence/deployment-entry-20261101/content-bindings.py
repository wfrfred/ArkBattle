#!/usr/bin/env python3
"""Extract only Matsukiri S2 / Reignfrost SilverAsh S1/S2 content bindings.

The holder layout is checked against its serialized object length. Prefab
strings are located with the bundle's own type tree, not native offsets.
"""
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
import argparse
import datetime
import hashlib
import json
from pathlib import Path
import struct
import sys

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[4]
SCRIPTS = ROOT / ".agents/skills/arkbattle-native-research/scripts"
sys.path.insert(0, str(SCRIPTS))
from unity_assets import Reader, bundle, serialized

def skill_layouts(data):
    """Read v22 skill-component field paths; common names remain numeric.

    This bounded string projection follows the same installed layout as the
    shared serialized-object reader; it does not infer unknown field semantics.
    """
    reader = Reader(data, ">")
    reader.read(48)
    reader.e = "<"
    reader.cs()
    reader.val("i")
    if not reader.val("B"):
        raise ValueError("Selected skill bundle has no serialized type trees")
    result = []
    for _ in range(reader.val("i")):
        classid = reader.val("i")
        reader.val("B")
        reader.val("h")
        if classid == 114:
            reader.read(16)
        reader.read(16)
        count, size = reader.val("ii")
        raw, strings = reader.read(count * 32), reader.read(size)
        def string(offset):
            if offset & 0x80000000:
                return {49: "Array", 840: "string"}.get(offset & 0x7fffffff, f"common:{offset & 0x7fffffff}")
            return strings[offset:strings.index(0, offset)].decode()
        nodes, stack = [], []
        for index in range(count):
            _, level, flags, kind, name, width, _, meta, _ = struct.unpack_from("<HBBIIiiiQ", raw, index * 32)
            node = dict(level=level, flags=flags, type=string(kind), name=string(name), width=width, meta=meta, children=[])
            while stack and nodes[stack[-1]]["level"] >= level:
                stack.pop()
            if stack:
                nodes[stack[-1]]["children"].append(index)
            nodes.append(node)
            stack.append(index)
        result.append(nodes)
        reader.read(reader.val("i") * 4)
    return result

def fingerprint(path):
    data = path.read_bytes()
    return dict(path=str(path), bytes=len(data), sha256=hashlib.sha256(data).hexdigest())

def projected_strings(raw, nodes):
    reader = Reader(raw)
    matches = []
    def walk(index, path):
        node = nodes[index]
        path = path + [node["name"]]
        offset = reader.p
        if node["type"] == "string":
            value = reader.string()
            if "makiri_s_2" in value or "svash2_s_1" in value or "svash2_s_2" in value:
                matches.append(dict(path=path, offset=offset, value=value))
        elif node["flags"] & 1:
            count = reader.val("i")
            if not 0 <= count <= len(raw):
                raise ValueError((path, count))
            for item in range(count):
                walk(node["children"][1], path + [str(item)])
        elif node["children"]:
            for child in node["children"]:
                walk(child, path)
        else:
            if node["width"] < 0:
                raise ValueError(node)
            reader.read(node["width"])
        if node["meta"] & 0x4000:
            reader.align()
    walk(0, [])
    if reader.p != len(raw):
        raise ValueError((reader.p, len(raw)))
    return matches

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=Path("/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game"))
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    ab = args.game / "Arknights_Data/StreamingAssets/AB/Windows"
    holder = ab / "config/buff_template_holder.ab"
    selected = {"empty", "makiri_s_2", "svash2_s_1[deck]", "svash2_s_2", "svash2_s_2[build_set]", "svash2_s_2[build]", "shield"}
    templates = []
    for filename, data in bundle(holder)[0]:
        if filename.endswith((".resS", ".resource")):
            continue
        state = serialized(data)
        for obj in state["objects"]:
            if obj["classid"] != 114:
                continue
            raw = data[obj["start"]:obj["start"] + obj["size"]]
            reader = Reader(raw, p=28)
            name = reader.string()
            count = reader.val("i")
            for _ in range(count):
                start = reader.p
                key, effect = reader.string(), reader.string()
                priority = reader.val("i")
                events = []
                for _ in range(reader.val("i")):
                    event = reader.val("i")
                    program = reader.string()
                    refs = [dict(file=reader.val("i"), pathId=str(reader.val("q"))) for _ in range(reader.val("i"))]
                    if key in selected:
                        events.append(dict(event=event, actions=json.loads(program), objectReferences=refs))
                if key in selected:
                    templates.append(dict(file=filename, holderPathId=str(obj["id"]), holderName=name,
                                          holderObjectOffset=start, serializedBytes=reader.p-start,
                                          serializedSha256=hashlib.sha256(raw[start:reader.p]).hexdigest(),
                                          key=key, effectKey=effect, onEventPriority=priority, events=events))
            if reader.p != len(raw):
                raise ValueError((reader.p, len(raw)))
    if {t["key"] for t in templates} != selected:
        raise ValueError("Some selected templates were not found")

    prefab = ab / "battle/prefabs/[uc]skills.ab"
    bindings = []
    for filename, data in bundle(prefab)[0]:
        if filename.endswith((".resS", ".resource")):
            continue
        state = serialized(data)
        layouts = skill_layouts(data)
        game_objects = {}
        for obj in state["objects"]:
            if obj["classid"] != 1:
                continue
            raw = data[obj["start"]:obj["start"] + obj["size"]]
            reader = Reader(raw)
            components = [dict(file=reader.val("i"), pathId=str(reader.val("q"))) for _ in range(reader.val("i"))]
            reader.val("i")
            game_objects[obj["id"]] = dict(name=reader.string(), pathId=str(obj["id"]), components=components)
        for obj in state["objects"]:
            if obj["classid"] != 114:
                continue
            raw = data[obj["start"]:obj["start"] + obj["size"]]
            if not any(key in raw for key in (b"makiri_s_2", b"svash2_s_1", b"svash2_s_2")):
                continue
            strings = projected_strings(raw, layouts[obj["typeid"]])
            if not strings:
                continue
            reader = Reader(raw)
            owner_file, owner_path = reader.val("i"), reader.val("q")
            bindings.append(dict(file=filename, componentPathId=str(obj["id"]), scriptId=obj["scriptid"],
                                 ownerFile=owner_file, gameObject=game_objects.get(owner_path),
                                 objectSha256=hashlib.sha256(raw).hexdigest(), selectedStringFields=strings))

    output = dict(
        provenance=dict(
            collectedOn=datetime.date.today().isoformat(),
            scope="Exact selected serialized templates and their skill-prefab string bindings; no runtime execution or hotfix claim.",
            inputs=[fingerprint(holder), fingerprint(prefab)],
            tools=[fingerprint(Path(__file__)), fingerprint(SCRIPTS / "unity_assets.py")],
        ),
        result=dict(templates=templates, skillBindings=bindings),
    )
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps(dict(templates=[t["key"] for t in templates], bindings=len(bindings), output=str(args.out)), ensure_ascii=False))

if __name__ == "__main__":
    main()
