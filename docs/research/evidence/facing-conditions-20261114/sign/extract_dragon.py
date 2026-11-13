#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
"""Resolve one installed fire-dragon hierarchy and its actual facing/talent components."""
import argparse
import hashlib
import importlib.util
import json
import struct
import sys
from pathlib import Path

sys.dont_write_bytecode = True
ROOT = Path.cwd()
sys.path.insert(0, str(ROOT / ".agents/skills/arkbattle-native-research/scripts"))
from native import fingerprint
from unity_assets import Reader, bundle, serialized, script

HELPER = ROOT / "docs/research/evidence/targeting-pipeline-20261109/content/extract_content.py"
spec = importlib.util.spec_from_file_location("facing_content", HELPER)
helper = importlib.util.module_from_spec(spec)
spec.loader.exec_module(helper)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=Path("/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game"))
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    base = args.game / "Arknights_Data/StreamingAssets/AB/Windows"
    manifest = base / "hot_update_list.json"
    resource_version = json.loads(manifest.read_text())["versionId"]
    sources, scripts = [fingerprint(manifest)], {}
    for relative in ["anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin", "anon/88b3c3ecaaefa6003de730686dd5ac53.bin"]:
        path = base / relative
        if not path.exists():
            continue
        sources.append(fingerprint(path))
        for name, data in bundle(path)[0]:
            if name.endswith((".resS", ".resource")):
                continue
            for obj in serialized(data)["objects"]:
                if obj["classid"] == 115:
                    scripts[name, obj["id"]] = {"bundle": relative, "value": script(obj, data)}
    relative = "battle/enm_pfb_18.ab"
    path = base / relative
    sources.append(fingerprint(path))
    rows, selected_roots = [], []
    for name, data in bundle(path)[0]:
        state = serialized(data)
        layouts, externals = helper.helper.trees(data)
        names, transforms, game_objects = {}, {}, {}
        for obj in state["objects"]:
            raw = data[obj["start"]:obj["start"]+obj["size"]]
            if obj["classid"] == 1:
                reader = Reader(raw)
                reader.read(reader.val("i") * 12)
                reader.val("i")
                names[obj["id"]] = reader.string()
                game_objects[obj["id"]] = helper.decode(raw, layouts[obj["typeid"]])
            elif obj["classid"] == 4:
                value = helper.decode(raw, layouts[obj["typeid"]])
                transforms[obj["id"]] = value["common:374"]["m_PathID"], value["m_Father"]["m_PathID"]
        by_owner = {owner: tid for tid, (owner, _) in transforms.items()}
        for obj in state["objects"]:
            if obj["classid"] != 114:
                continue
            raw = data[obj["start"]:obj["start"]+obj["size"]]
            owner = struct.unpack_from("<q", raw, 4)[0]
            hierarchy, owners, tid = [], [], by_owner.get(owner)
            while tid:
                go, tid = transforms[tid]
                hierarchy.append(names[go])
                owners.append(go)
            hierarchy.reverse()
            owners.reverse()
            if not hierarchy or hierarchy[0] != "enemy_1537_mhrors":
                continue
            value = helper.decode(raw, layouts[obj["typeid"]])
            pointer = value.get("common:490", {})
            sf = name if pointer.get("m_FileID") == 0 else externals[pointer["m_FileID"]-1]["path"].split("/")[-1]
            binding = scripts.get((sf, pointer.get("m_PathID")))
            cl = binding["value"]["cl"] if binding else None
            if cl not in {"Enemy", "FaceSwitcher", "SingleSpineAnimator", "MhPartHpHudPluginTalent", "MhWeaknessHudPluginTalent"}:
                continue
            root = {"id": str(owners[0]), "value": game_objects[owners[0]]}
            if root not in selected_roots:
                selected_roots.append(root)
            rows.append({"bundle": relative, "file": name, "pathId": str(obj["id"]), "hierarchy": hierarchy,
                         "hierarchyObjects": [{"id": str(go), "value": game_objects[go]} for go in owners],
                         "objectSha256": hashlib.sha256(raw).hexdigest(), "scriptPPtr": pointer,
                         "scriptFile": sf, "script": binding, "value": value})
    payload = {"provenance": {"collectedOn": "2026-11-14", "resourceManifestVersionId": resource_version, "script": fingerprint(Path(__file__)), "helper": fingerprint(HELPER),
                              "sources": sources, "selection": "enemy_1537_mhrors exact root; Enemy/SingleSpineAnimator/FaceSwitcher/MhPartHpHudPluginTalent/MhWeaknessHudPluginTalent only",
                              "scope": "Static installed Prefab binding and active flags, not game execution or runtime XLua activation."},
               "result": {"roots": selected_roots, "components": rows}}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"components": [(row["script"]["value"]["cl"], row["pathId"], row["hierarchy"]) for row in rows], "out": str(args.out)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
