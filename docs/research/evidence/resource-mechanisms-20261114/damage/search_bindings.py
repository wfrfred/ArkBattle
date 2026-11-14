#!/usr/bin/env python3
"""Search selected installed resource families for literal damage-program bindings."""
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
from native import DEFAULT_GAME, fingerprint
from unity_assets import Reader, bundle, serialized
HELPER = ROOT / "docs/research/evidence/targeting-pipeline-20261109/content/extract_content.py"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--needle", action="append", required=True)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    spec = importlib.util.spec_from_file_location("damage_binding_search", HELPER)
    helper = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(helper)
    base = args.game / "Arknights_Data/StreamingAssets/AB/Windows"
    patterns = ["charpack/*.ab", "battle/enm_pfb*.ab", "battle/prefabs/*.ab", "config/*.ab"]
    files = sorted({p for pattern in patterns for p in base.glob(pattern) if p.name != "buff_template_holder.ab"})
    scan, hits, errors = [], [], []
    for path in files:
        row = {"bundle": str(path.relative_to(base)), "fileSha256": hashlib.sha256(path.read_bytes()).hexdigest(), "matches": []}
        try:
            for filename, data in bundle(path)[0]:
                if filename.endswith((".resS", ".resource")):
                    continue
                needles = [q for q in args.needle if q.encode() in data]
                if not needles:
                    continue
                row["matches"].append({"file": filename, "needles": needles})
                state = serialized(data)
                layouts, _ = helper.helper.trees(data)
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
                by_owner = {go: tid for tid, (go, _) in transforms.items()}
                for obj in state["objects"]:
                    raw = data[obj["start"]:obj["start"] + obj["size"]]
                    matched = [q for q in needles if q.encode() in raw]
                    if not matched:
                        continue
                    hierarchy = []
                    if obj["classid"] == 114:
                        owner = struct.unpack_from("<q", raw, 4)[0]
                        tid = by_owner.get(owner)
                        while tid:
                            go, tid = transforms[tid]
                            hierarchy.append(names.get(go, ""))
                        hierarchy.reverse()
                    value = helper.decode(raw, layouts[obj["typeid"]]) if obj["classid"] == 114 else None
                    hits.append({"bundle": row["bundle"], "file": filename, "pathId": str(obj["id"]),
                                 "classId": obj["classid"], "needles": matched, "hierarchy": hierarchy,
                                 "objectSha256": hashlib.sha256(raw).hexdigest(), "value": value})
        except Exception as error:
            errors.append({"bundle": row["bundle"], "error": type(error).__name__ + ": " + str(error)})
        scan.append(row)
    prov = {"collectedOn": "2026-11-14", "script": fingerprint(Path(__file__)), "helper": fingerprint(HELPER),
            "scope": "Complete byte search within the listed installed resource families, excluding the Holder itself; only matching object projections decoded. No hit is not proof of global non-use or dead native code."}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps({"provenance": prov, "result": {"selection": {"patterns": patterns, "needles": args.needle},
               "complete": not errors, "scan": scan, "hits": hits, "errors": errors}}, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"files": len(files), "hits": len(hits), "errors": len(errors), "out": str(args.out)}))


if __name__ == "__main__":
    main()
