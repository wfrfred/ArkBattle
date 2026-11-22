"""Read the installed AutoChess acfnc components and route-related programs."""

import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import sys

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT / ".agents/skills/arkbattle-native-research/scripts"))
from native import DEFAULT_GAME, fingerprint
from unity_assets import bundle, script, serialized

HELPER = ROOT / "docs/research/evidence/nymph-action-settlement-20261103/projectile/decode_projectile.py"
PREFABS = {"enemy_9029_acfnc", "enemy_9029_acfnc_2", "enemy_9028_acfncb"}
COMPONENTS = {
    -4710201899321149233, -6513235382794062763, -6345513398052489735,
    -3260352162757625649, -3054321940928007083,
    -6574366394107316017, 9011679895843828821,
    2918002476129040591, -7904400336690875307,
}
TEMPLATES = {"acfnc_t1", "acfnc[skill]", "acfnc[insert-cp]"}


def script_map(path):
    return {
        (name, obj["id"]): script(obj, data)
        for name, data in bundle(path)[0]
        if not name.endswith((".resource", ".resS"))
        for obj in serialized(data)["objects"]
        if obj["classid"] == 115
    }


def extract_prefabs(reader, path, scripts):
    rows = []
    for name, data in bundle(path)[0]:
        if name.endswith((".resource", ".resS")) or b"enemy_9029_acfnc" not in data:
            continue
        objects = serialized(data)["objects"]
        layouts, externals = reader.trees(data)
        names, parents, components = {}, {}, []
        for obj in objects:
            if obj["classid"] not in (1, 4) and obj["id"] not in COMPONENTS:
                continue
            raw = data[obj["start"]:obj["start"] + obj["size"]]
            value = reader.decode(raw, layouts[obj["typeid"]])
            if obj["classid"] == 1:
                names[obj["id"]] = value.get("common:427", value.get("m_Name"))
            elif obj["classid"] == 4:
                parents[obj["id"]] = value["common:374"]["m_PathID"], value["m_Father"]["m_PathID"]
            else:
                components.append((obj["id"], value, hashlib.sha256(raw).hexdigest()))
        transform_of = {owner: node for node, (owner, _) in parents.items()}
        for path_id, value, digest in components:
            pointer = value["common:490"]
            script_file = externals[pointer["m_FileID"] - 1]["path"].split("/")[-1]
            hierarchy = []
            node = transform_of[value["common:374"]["m_PathID"]]
            while node:
                owner, node = parents[node]
                hierarchy.append(names[owner])
            assert hierarchy[-1] in PREFABS
            rows.append({
                "file": name, "pathId": str(path_id), "objectSha256": digest,
                "hierarchy": hierarchy[::-1], "enabled": value["common:349"],
                "scriptFile": script_file, "script": scripts[(script_file, pointer["m_PathID"])],
                "fields": {key: value[key] for key in ("_modes", "_buffs", "_trigger") if key in value},
            })
    assert {int(row["pathId"]) for row in rows} == COMPONENTS
    return rows


def extract_templates(reader, path):
    for name, data in bundle(path)[0]:
        if name.endswith((".resource", ".resS")):
            continue
        for obj in serialized(data)["objects"]:
            if obj["id"] != 6070581171229484677:
                continue
            raw = data[obj["start"]:obj["start"] + obj["size"]]
            layouts, _ = reader.trees(data)
            holder = reader.decode(raw, layouts[obj["typeid"]])
            rows = [
                {"index": index, "key": row["templateKey"], "events": [
                    {"event": event["key"], "actions": json.loads(event["value"]["SerializedState"])}
                    for event in row["eventToActions"]["_items"]["Array"]
                ]}
                for index, row in enumerate(holder["_templates"]["Array"])
                if row["templateKey"] in TEMPLATES
            ]
            assert {row["key"] for row in rows} == TEMPLATES
            return {"file": name, "pathId": str(obj["id"]), "objectSha256": hashlib.sha256(raw).hexdigest(), "templates": rows}
    raise ValueError("BuffTemplateHolder missing")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    data = args.game / "Arknights_Data"
    update = data / "PersistentData/Bundles"
    manifest = update / "hot_update_list.json"
    prefabs = update / "battle/enm_pfb_36.ab"
    holder = update / "config/buff_template_holder.ab"
    script_path = "anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin"
    scripts = update / script_path
    if not scripts.exists():
        scripts = data / "StreamingAssets/AB/Windows" / script_path
    spec = importlib.util.spec_from_file_location("typetree", HELPER)
    reader = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(reader)
    output = {
        "provenance": {
            "collectedOn": "2026-11-22", "versionId": json.loads(manifest.read_text())["versionId"],
            "assets": [fingerprint(path) for path in (manifest, prefabs, holder, scripts)],
            "reader": fingerprint(HELPER),
        },
        "result": {"prefabs": extract_prefabs(reader, prefabs, script_map(scripts)), "holder": extract_templates(reader, holder)},
    }
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()
