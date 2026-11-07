#!/usr/bin/env python3
"""Read Enemy checkpoint flags from the installed enemy and token prefab bundles."""
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
import argparse
from collections import Counter
import datetime
import hashlib
import importlib.util
import json
from pathlib import Path
import struct
import sys

sys.dont_write_bytecode = True
ROOT = Path.cwd()
TOOLS = ROOT / ".agents/skills/arkbattle-native-research/scripts"
sys.path.insert(0, str(TOOLS))
from native import DEFAULT_GAME, fingerprint
from unity_assets import Reader, bundle, script, serialized


def load_module(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument("--bundle", action="append", help="Relative bundle; defaults to all enm_pfb and token bundles")
    args = parser.parse_args()
    decoder_path = ROOT / "docs/research/evidence/attack-addon-order-20261102/content/decode_content.py"
    external_path = ROOT / "docs/research/evidence/nymph-action-settlement-20261103/projectile/decode_projectile.py"
    inheritance_path = ROOT / "docs/research/evidence/route-operations-20261107/cursor/subclass-slot-audit.json"
    decoder = load_module("checkpoint_decoder", decoder_path)
    external_reader = load_module("checkpoint_externals", external_path)
    descendants = json.loads(inheritance_path.read_text())["result"]["selection"]["types"]
    enemy_classes = {"Torappu.Battle.Enemy", *descendants}
    base = args.game / "Arknights_Data/StreamingAssets/AB/Windows"
    script_source = base / "anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin"
    script_files = dict(bundle(script_source)[0])
    script_objects = {name: {obj["id"]: obj for obj in serialized(data)["objects"]}
                      for name, data in script_files.items() if not name.endswith((".resS", ".resource"))}
    sources = ([base / value for value in args.bundle] if args.bundle else
               sorted((base / "battle").glob("enm_pfb_*.ab")) +
               sorted((base / "pkgrps").glob("btl_pfb_tokens_*.ab")))
    rows, scanned, failures, null_scripts = [], [], [], []
    unresolved, non_enemy_field_classes = Counter(), Counter()
    for source in sources:
        relative = str(source.relative_to(base))
        counts = Counter()
        try:
            files, unity_version = bundle(source)
            for filename, data in files:
                if filename.endswith((".resS", ".resource")):
                    continue
                state = serialized(data)
                layouts = decoder.trees(data)
                externals = external_reader.trees(data)[1]
                objects = {obj["id"]: obj for obj in state["objects"]}
                names, transforms = {}, {}
                for obj in state["objects"]:
                    raw = data[obj["start"]:obj["start"] + obj["size"]]
                    if obj["classid"] == 1:
                        reader = Reader(raw)
                        reader.read(reader.val("i") * 12)
                        reader.val("i")
                        names[obj["id"]] = reader.string()
                    elif obj["classid"] == 4:
                        value = decoder.decode(raw, layouts[obj["typeid"]])
                        transforms[obj["id"]] = (value["common:374"]["m_PathID"], value["m_Father"]["m_PathID"])
                transform_by_owner = {owner: tid for tid, (owner, _) in transforms.items()}
                bindings = {}
                for obj in state["objects"]:
                    if obj["classid"] != 114:
                        continue
                    counts["monoBehaviours"] += 1
                    raw = data[obj["start"]:obj["start"] + obj["size"]]
                    file_id, path_id = struct.unpack_from("<iq", raw, 16)
                    binding_key = file_id, path_id
                    if binding_key not in bindings:
                        ext = externals[file_id - 1] if file_id else None
                        script_file = ext["path"].split("/")[-1] if ext else filename
                        script_data = script_files.get(script_file) if ext else data
                        script_obj = (script_objects.get(script_file, {}).get(path_id) if ext else objects.get(path_id))
                        value = script(script_obj, script_data) if script_obj is not None and script_data is not None else None
                        bindings[binding_key] = {"externalReference": ext, "file": script_file,
                                                 "pathId": str(path_id), "value": value}
                    binding = bindings[binding_key]
                    identity = binding["value"]
                    fullname = f'{identity["ns"]}.{identity["cl"]}' if identity else None
                    layout = layouts[obj["typeid"]]
                    has_field = any(node["name"] == "_alwaysCheckCurrentPoint" for node in layout)
                    if path_id == 0:
                        value = decoder.decode(raw, layout)
                        assert value["common:490"] == {"m_FileID": file_id, "m_PathID": path_id}
                        counts["nullMonoScripts"] += 1
                        null_scripts.append({"bundle": relative, "file": filename, "pathId": str(obj["id"]),
                                             "typeId": obj["typeid"], "scriptPointer": value["common:490"],
                                             "fieldNames": list(value), "fieldPresent": has_field})
                    elif fullname is None:
                        unresolved[f'{binding["file"]}:{binding["pathId"]}'] += 1
                        counts["unresolvedMonoScripts"] += 1
                    if fullname not in enemy_classes and not has_field:
                        continue
                    value = decoder.decode(raw, layout)
                    assert value["common:490"] == {"m_FileID": file_id, "m_PathID": path_id}
                    owner = value["common:374"]["m_PathID"]
                    tid, hierarchy = transform_by_owner.get(owner), []
                    while tid:
                        go, parent = transforms[tid]
                        hierarchy.append({"name": names.get(go), "gameObjectPathId": str(go), "transformPathId": str(tid)})
                        tid = parent
                    status = ("missing" if "_alwaysCheckCurrentPoint" not in value else
                              "true" if value["_alwaysCheckCurrentPoint"] is True else
                              "false" if value["_alwaysCheckCurrentPoint"] is False else "other")
                    counts["selectedComponents"] += 1
                    counts[status] += 1
                    if fullname not in enemy_classes:
                        non_enemy_field_classes[str(fullname)] += 1
                    row = {"bundle": relative, "unityVersion": unity_version, "file": filename,
                           "pathId": str(obj["id"]), "typeId": obj["typeid"],
                           "objectSha256": hashlib.sha256(raw).hexdigest(), "hierarchy": hierarchy,
                           "scriptBinding": binding, "knownEnemyClass": fullname in enemy_classes,
                           "field": {"name": "_alwaysCheckCurrentPoint", "status": status}}
                    if status != "missing":
                        row["field"]["value"] = value["_alwaysCheckCurrentPoint"]
                    if status == "true":
                        row["value"] = value
                        print(json.dumps({"true": [entry["name"] for entry in hierarchy], "bundle": relative,
                                          "file": filename, "pathId": str(obj["id"])}, ensure_ascii=False), flush=True)
                    rows.append(row)
            scanned.append({"bundle": relative, **fingerprint(source), "counts": dict(counts)})
            print(json.dumps({"bundle": relative, "counts": dict(counts)}), flush=True)
        except Exception as error:
            failures.append({"bundle": relative, "error": repr(error)})
            print(json.dumps({"failed": relative, "error": repr(error)}), flush=True)
    total = Counter({key: 0 for key in ["monoBehaviours", "selectedComponents", "true", "false", "missing",
                                      "other", "nullMonoScripts", "unresolvedMonoScripts"]})
    for source in scanned:
        total.update(source["counts"])
    result = {"complete": not failures, "bundlePatterns": ["battle/enm_pfb_*.ab", "pkgrps/btl_pfb_tokens_*.ab"],
              "counts": dict(total), "bundleCount": len(sources), "successfulBundles": len(scanned),
              "enemyClasses": sorted(enemy_classes), "unresolvedMonoScripts": dict(unresolved),
              "fieldOnOtherClasses": dict(non_enemy_field_classes), "nullScriptComponents": null_scripts,
              "failures": failures, "components": rows}
    provenance = {"collectedOn": datetime.date.today().isoformat(), "script": fingerprint(Path(__file__)),
                  "tools": [fingerprint(path) for path in [TOOLS / "unity_assets.py", decoder_path, external_path]],
                  "enemyInheritanceSource": fingerprint(inheritance_path),
                  "client": {"dll": fingerprint(args.game / "GameAssembly.dll"),
                             "metadata": fingerprint(args.game / "Arknights_Data/il2cpp_data/Metadata/global-metadata.dat")},
                  "sources": [*scanned, fingerprint(script_source)],
                  "scope": "All MonoBehaviour script bindings in selected installed enemy/token bundles are examined. "
                           "Decode Enemy base/metadata descendants, plus any type tree containing the named field. "
                           "Complete means every selected bundle parsed, not that these patterns cover all game resources. "
                           "Serialized configuration is not runtime activation."}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps({"provenance": provenance, "result": result}, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"summary": dict(total), "bundles": len(scanned), "failures": failures}), flush=True)


if __name__ == "__main__":
    main()
