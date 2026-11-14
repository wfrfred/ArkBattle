#!/usr/bin/env python3
"""Decode only the installed Mudrock S2 skill root and its descendants."""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import sys

sys.dont_write_bytecode = True
ROOT = Path.cwd()
sys.path.insert(0, str(ROOT / ".agents/skills/arkbattle-native-research/scripts"))
from native import DEFAULT_GAME, fingerprint
from unity_assets import Reader, bundle, serialized, script

HELPER = ROOT / "docs/research/evidence/targeting-pipeline-20261109/content/extract_content.py"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    spec = importlib.util.spec_from_file_location("mudrock_skill_reader", HELPER)
    helper = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(helper)
    base = args.game / "Arknights_Data/StreamingAssets/AB/Windows"
    script_source = base / "anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin"
    scripts = {}
    for filename, data in bundle(script_source)[0]:
        if filename.endswith((".resS", ".resource")):
            continue
        for obj in serialized(data)["objects"]:
            if obj["classid"] == 115:
                scripts[(filename, obj["id"])] = script(obj, data)
    source = base / "battle/prefabs/[uc]skills.ab"
    records = []
    for filename, data in bundle(source)[0]:
        if filename.endswith((".resS", ".resource")):
            continue
        state = serialized(data)
        layouts, externals = helper.helper.trees(data)
        names, transforms = {}, {}
        for obj in state["objects"]:
            raw = data[obj["start"]:obj["start"] + obj["size"]]
            if obj["classid"] == 1:
                reader = Reader(raw)
                reader.read(reader.val("i") * 12)
                reader.val("i")
                names[obj["id"]] = reader.string()
            elif obj["classid"] == 4:
                value = helper.decode(raw, layouts[obj["typeid"]])
                transforms[obj["id"]] = (value["common:374"]["m_PathID"], value["m_Father"]["m_PathID"])
        by_owner = {owner: tid for tid, (owner, _) in transforms.items()}
        for obj in state["objects"]:
            if obj["classid"] != 114:
                continue
            raw = data[obj["start"]:obj["start"] + obj["size"]]
            tid = by_owner.get(int.from_bytes(raw[4:12], "little", signed=True))
            hierarchy = []
            while tid:
                owner, tid = transforms[tid]
                hierarchy.append(names.get(owner, ""))
            hierarchy.reverse()
            if not hierarchy or hierarchy[0] != "skchr_mudrok_2":
                continue
            value = helper.decode(raw, layouts[obj["typeid"]])
            pointer = value["common:490"]
            script_file = filename if pointer["m_FileID"] == 0 else externals[pointer["m_FileID"] - 1]["path"].split("/")[-1]
            records.append({"bundle": "battle/prefabs/[uc]skills.ab", "file": filename, "pathId": str(obj["id"]),
                            "hierarchy": hierarchy, "objectSha256": hashlib.sha256(raw).hexdigest(),
                            "scriptPPtr": pointer, "scriptFile": script_file, "script": scripts.get((script_file, pointer["m_PathID"])),
                            "value": {key: item for key, item in value.items() if not key.startswith("common:")}})
    profile_source = ROOT / "docs/research/evidence/resource-mechanisms-20261114/damage/operator-bindings.json"
    profile = next(item for item in json.loads(profile_source.read_text())["result"]["profiles"] if item["id"] == "char_311_mudrok")
    payload = {"provenance": {"collectedOn": "2026-11-15", "script": fingerprint(Path(__file__)), "reader": fingerprint(HELPER),
               "sources": [fingerprint(source), fingerprint(script_source)], "profileSource": fingerprint(profile_source),
               "scope": "Only the installed skchr_mudrok_2 root and descendants; actual PPtr and script identity, no gameplay execution or other character scan."},
               "result": {"root": "skchr_mudrok_2", "profile": profile, "components": records}}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"components": len(records), "out": str(args.out)}))


if __name__ == "__main__":
    main()
