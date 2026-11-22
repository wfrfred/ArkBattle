"""Scan cached hot-update Enemy controllers for nonzero blocking masks."""

import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import struct
import sys

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT / ".agents/skills/arkbattle-native-research/scripts"))
from native import DEFAULT_GAME, fingerprint
from unity_assets import Reader, bundle, serialized

HELPER = ROOT / "docs/research/evidence/blocker-roles-20261031/extract.py"


def scan(path, reader):
    count, kinds, matches = 0, set(), []
    for name, data in bundle(path)[0]:
        if name.endswith((".resS", ".resource")):
            continue
        objects = {obj["id"]: obj for obj in serialized(data)["objects"]}
        layouts = reader.trees(data)
        relevant = {index for index, nodes in enumerate(layouts) if any(node["name"] == "_specificBlockMask" for node in nodes)}
        for obj in objects.values():
            if obj["typeid"] not in relevant:
                continue
            raw = data[obj["start"]:obj["start"] + obj["size"]]
            fields = reader.fields(raw, layouts[obj["typeid"]])
            count += 1
            kinds.add(obj["scriptid"])
            if fields["_specificBlockMask"]["value"] == 0:
                continue
            owner_id, = struct.unpack_from("<q", raw, 4)
            owner = Reader(data, p=objects[owner_id]["start"])
            owner.read(owner.val("i") * 12)
            owner.val("i")
            matches.append({
                "file": name, "pathId": str(obj["id"]), "objectSha256": hashlib.sha256(raw).hexdigest(),
                "prefab": owner.string(), "fields": fields,
            })
    return {"source": fingerprint(path), "controllers": count, "scriptTypes": sorted(kinds), "nonzeroMasks": matches}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    update = args.game / "Arknights_Data/PersistentData/Bundles"
    manifest = update / "hot_update_list.json"
    spec = importlib.util.spec_from_file_location("layout", HELPER)
    reader = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(reader)
    result = [scan(path, reader) for path in sorted(update.glob("battle/enm_pfb_*.ab"))]
    provenance = {
        "collectedOn": "2026-11-22", "versionId": json.loads(manifest.read_text())["versionId"],
        "source": fingerprint(manifest), "reader": fingerprint(HELPER), "inputGlob": "battle/enm_pfb_*.ab",
    }
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps({"provenance": provenance, "result": result}, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()
