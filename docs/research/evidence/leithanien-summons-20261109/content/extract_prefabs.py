#!/usr/bin/env python3
"""Extract the updated Leithanien summons and their actual component/script identities."""
import argparse
import datetime
import hashlib
import importlib.util
import json
import struct
import sys
from pathlib import Path

sys.dont_write_bytecode = True
ROOT = Path.cwd()
sys.path.insert(0, str(ROOT / ".agents/skills/arkbattle-native-research/scripts"))
from native import DEFAULT_GAME, fingerprint
from unity_assets import bundle, serialized, script


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    helper = ROOT / "docs/research/evidence/nymph-action-settlement-20261103/projectile/decode_projectile.py"
    spec = importlib.util.spec_from_file_location("reader", helper)
    reader = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(reader)
    data_root = args.game / "Arknights_Data"
    base = data_root / "StreamingAssets/AB/Windows"
    update = data_root / "PersistentData/Bundles"
    source = update / "battle/enm_pfb_36.ab"
    script_source = base / "anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin"
    if (update / script_source.relative_to(base)).exists():
        script_source = update / script_source.relative_to(base)
    script_files = dict(bundle(script_source)[0])
    wanted = {"enemy_9025_aclts", "enemy_9026_acltm"}
    rows = []
    for filename, data in bundle(source)[0]:
        if filename.endswith((".resS", ".resource")) or not any(key.encode() in data for key in wanted):
            continue
        state = serialized(data)
        layouts, externals = reader.trees(data)
        names, transforms = {}, {}
        for obj in state["objects"]:
            if obj["classid"] not in [1, 4]:
                continue
            value = reader.decode(data[obj["start"]:obj["start"] + obj["size"]], layouts[obj["typeid"]])
            if obj["classid"] == 1:
                names[obj["id"]] = value.get("common:427", value.get("m_Name"))
            else:
                transforms[obj["id"]] = (value["common:374"]["m_PathID"], value["m_Father"]["m_PathID"])
        by_go = {go: transform for transform, (go, _) in transforms.items()}
        selected = {}
        for go, transform in by_go.items():
            hierarchy, cursor = [], transform
            while cursor:
                owner, parent = transforms[cursor]
                hierarchy.append({"name": names.get(owner), "gameObjectPathId": str(owner), "transformPathId": str(cursor)})
                cursor = parent
            if hierarchy and hierarchy[-1]["name"] in wanted:
                selected[go] = hierarchy
        for obj in state["objects"]:
            if obj["classid"] != 114:
                continue
            raw = data[obj["start"]:obj["start"] + obj["size"]]
            go = struct.unpack_from("<q", raw, 4)[0]
            if go not in selected:
                continue
            value = reader.decode(raw, layouts[obj["typeid"]])
            pointer = value["common:490"]
            external = externals[pointer["m_FileID"] - 1] if pointer["m_FileID"] else None
            script_file = external["path"].split("/")[-1] if external else filename
            script_data = script_files.get(script_file) if external else data
            binding = {"file": script_file, "pathId": str(pointer["m_PathID"]), "externalReference": external}
            if script_data is not None:
                entry = next(item for item in serialized(script_data)["objects"] if item["id"] == pointer["m_PathID"])
                binding.update(source=script_source.as_posix() if external else source.as_posix(), value=script(entry, script_data))
            rows.append({"key": selected[go][-1]["name"], "file": filename, "pathId": str(obj["id"]),
                         "hierarchy": selected[go], "objectSha256": hashlib.sha256(raw).hexdigest(),
                         "scriptBinding": binding, "value": value})
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps({
        "provenance": {"collectedOn": datetime.date.today().isoformat(), "script": fingerprint(Path(__file__)),
                       "reader": fingerprint(helper), "sources": [fingerprint(source), fingerprint(script_source)],
                       "scope": "Two exact updated prefab roots and all descendant MonoBehaviour components; static binding, not game execution."},
        "result": {"keys": sorted(wanted), "components": rows},
    }, ensure_ascii=False, indent=2) + "\n")
    print("components", len(rows), "unresolved scripts", sum("value" not in row["scriptBinding"] for row in rows))


if __name__ == "__main__":
    main()
