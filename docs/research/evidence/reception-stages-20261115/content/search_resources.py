#!/usr/bin/env python3
"""Locate reception template references, resolving fixed-mirror DB aliases explicitly."""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import re
import struct
import sys

sys.dont_write_bytecode = True
ROOT = Path.cwd()
sys.path.insert(0, str(ROOT / ".agents/skills/arkbattle-native-research/scripts"))
from native import DEFAULT_GAME, fingerprint
from unity_assets import Reader, bundle, serialized

HELPER = ROOT / "docs/research/evidence/targeting-pipeline-20261109/content/extract_content.py"
DB = ROOT / ".cache/native-research/arcane-chain-20261102/buff_table.json"
PATTERNS = ["charpack/*.ab", "battle/enm_pfb*.ab", "battle/prefabs/*.ab", "pkgrps/btl_pfb_tokens*.ab", "config/*.ab"]


def walk(value, pointer=""):
    if isinstance(value, dict):
        yield pointer, value
        for key, child in value.items():
            yield from walk(child, pointer + "/" + str(key).replace("~", "~0").replace("/", "~1"))
    elif isinstance(value, list):
        for index, child in enumerate(value):
            yield from walk(child, pointer + "/" + str(index))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--programs", type=Path, required=True)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    spec = importlib.util.spec_from_file_location("reception_resource_reader", HELPER)
    helper = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(helper)
    programs = json.loads(args.programs.read_text())["result"]["programs"]
    keys = {row["template"] for row in programs}
    db = json.loads(DB.read_text())
    aliases = {key: value for key, value in db.items() if value.get("templateKey") in keys}
    needles = sorted(keys | set(aliases), key=lambda key: (-len(key), key))
    pattern = re.compile(b"|".join(re.escape(key.encode()) for key in needles))
    base = args.game / "Arknights_Data/StreamingAssets/AB/Windows"
    files = sorted({p for glob in PATTERNS for p in base.glob(glob) if p.name != "buff_template_holder.ab"})
    scans, hits, errors = [], [], []
    for path in files:
        row = {"bundle": str(path.relative_to(base)), "sha256": hashlib.sha256(path.read_bytes()).hexdigest(), "matchingObjects": 0}
        try:
            for filename, data in bundle(path)[0]:
                if filename.endswith((".resS", ".resource")) or pattern.search(data) is None:
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
                owners = {owner: tid for tid, (owner, _) in transforms.items()}
                for obj in state["objects"]:
                    if obj["classid"] != 114:
                        continue
                    raw = data[obj["start"]:obj["start"] + obj["size"]]
                    matched = sorted({match.group().decode() for match in pattern.finditer(raw)})
                    if not matched:
                        continue
                    value = helper.decode(raw, layouts[obj["typeid"]])
                    references = []
                    for pointer, node in walk(value):
                        if "templateKey" not in node and "buffKey" not in node:
                            continue
                        key, template = node.get("buffKey"), node.get("templateKey")
                        load = node.get("loadFromDB", False)
                        resolved = db.get(key) if load else node
                        if resolved is not None and resolved.get("templateKey") in keys:
                            references.append({"pointer": pointer, "buffKey": key, "templateKey": template,
                                               "loadFromDB": load, "resolvedTemplateKey": resolved["templateKey"],
                                               "definition": node, "dbDefinition": resolved if load else None})
                    owner = struct.unpack_from("<q", raw, 4)[0]
                    tid, hierarchy = owners.get(owner), []
                    while tid:
                        go, tid = transforms[tid]
                        hierarchy.append(names.get(go, ""))
                    hierarchy.reverse()
                    script_pointer = value.get("common:490")
                    script_file = None
                    if script_pointer:
                        script_file = filename if script_pointer["m_FileID"] == 0 else externals[script_pointer["m_FileID"] - 1]["path"].split("/")[-1]
                    hits.append({"bundle": row["bundle"], "file": filename, "pathId": str(obj["id"]),
                                 "objectSha256": hashlib.sha256(raw).hexdigest(), "hierarchy": hierarchy,
                                 "scriptPPtr": script_pointer, "scriptFile": script_file,
                                 "matchedBytes": matched, "references": references,
                                 "value": {key: item for key, item in value.items() if not key.startswith("common:")}})
                    row["matchingObjects"] += 1
        except Exception as error:
            errors.append({"bundle": row["bundle"], "error": type(error).__name__ + ": " + str(error)})
        scans.append(row)
    payload = {"provenance": {"checkedOn": "2026-11-15", "script": fingerprint(Path(__file__)),
        "reader": fingerprint(HELPER), "programs": fingerprint(args.programs), "db": fingerprint(DB),
        "dbSource": "Fixed mirror BuffDB used by the 2026-11-02/05 evidence; archive provenance in elemental-zero-20261105/templates/decoded/buffdb-mirror.json. Its revision is independent from installed resources.",
        "scope": "Complete listed resource-family byte scan; exact decoded Buff definitions and DB aliases distinguished from byte-only candidates. A serialized reference does not prove runtime activation."},
        "result": {"selection": {"patterns": PATTERNS, "templateKeys": sorted(keys), "dbAliases": aliases},
                   "complete": not errors, "scan": scans, "hits": hits, "errors": errors}}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"files": len(scans), "objects": len(hits), "references": sum(len(hit["references"]) for hit in hits), "errors": len(errors), "out": str(args.out)}))


if __name__ == "__main__":
    main()
