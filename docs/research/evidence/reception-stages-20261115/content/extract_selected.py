#!/usr/bin/env python3
"""Extract real reception participants and their complete referenced Holder programs."""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import struct
import sys

sys.dont_write_bytecode = True
ROOT = Path.cwd()
sys.path.insert(0, str(ROOT / ".agents/skills/arkbattle-native-research/scripts"))
from native import DEFAULT_GAME, fingerprint
from unity_assets import Reader, bundle, serialized, script
HELPER = ROOT / "docs/research/evidence/targeting-pipeline-20261109/content/extract_content.py"
DB = ROOT / ".cache/native-research/arcane-chain-20261102/buff_table.json"
CHARACTERS = ("char_4191_tippi", "char_4244_tocka", "char_4246_dminon", "char_1012_skadi2", "char_017_huang", "char_4064_mlynar", "char_494_vendla", "char_4144_chilc", "char_4114_harold", "char_4148_philae", "char_1026_gvial2")
SKILLS = ("skchr_tippi_2", "skchr_tocka_1", "skchr_dminon_2", "skchr_skadi2_1", "skchr_philae_1", "skchr_philae_2", "skchr_agoat2_2")
ENEMIES = ("enemy_10231_agpack", "enemy_1323_wdbshd", "enemy_19051_wlrage", "enemy_1372_ltntpt", "enemy_1405_boomer", "enemy_10002_trtrsl", "enemy_1566_mpascl", "enemy_10092_hlslp", "enemy_7010_bldrgn")
DEVICES = ("trap_043_dupilr",)


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
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    spec = importlib.util.spec_from_file_location("reception_selected_reader", HELPER)
    helper = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(helper)
    base = args.game / "Arknights_Data/StreamingAssets/AB/Windows"
    sources, scripts, errors = [], {}, []
    for relative in ("anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin", "anon/88b3c3ecaaefa6003de730686dd5ac53.bin"):
        source = base / relative
        if not source.exists():
            continue
        sources.append(fingerprint(source))
        for filename, data in bundle(source)[0]:
            if filename.endswith((".resS", ".resource")):
                continue
            for obj in serialized(data)["objects"]:
                if obj["classid"] == 115:
                    scripts[(filename, obj["id"])] = script(obj, data)
    selection = {"charpack/" + key + ".ab": [key] for key in CHARACTERS}
    selection["battle/prefabs/[uc]skills.ab"] = list(SKILLS)
    candidate_scan = []
    for path in sorted(list((base / "battle").glob("enm_pfb*.ab")) + list((base / "pkgrps").glob("btl_pfb_tokens*.ab"))):
        roots = set()
        for filename, data in bundle(path)[0]:
            if not filename.endswith((".resS", ".resource")):
                roots.update(key for key in ENEMIES + DEVICES if key.encode() in data)
        candidate_scan.append({"bundle": str(path.relative_to(base)), "roots": sorted(roots)})
        if roots:
            selection[str(path.relative_to(base))] = sorted(roots)
    components = []
    for relative, roots in selection.items():
        source = base / relative
        sources.append(fingerprint(source))
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
            owners = {owner: tid for tid, (owner, _) in transforms.items()}
            for obj in state["objects"]:
                if obj["classid"] != 114:
                    continue
                raw = data[obj["start"]:obj["start"] + obj["size"]]
                tid, hierarchy = owners.get(struct.unpack_from("<q", raw, 4)[0]), []
                while tid:
                    go, tid = transforms[tid]
                    hierarchy.append(names.get(go, ""))
                hierarchy.reverse()
                if not hierarchy or hierarchy[0] not in roots:
                    continue
                try:
                    value = helper.decode(raw, layouts[obj["typeid"]])
                    pointer = value["common:490"]
                    script_file = filename if pointer["m_FileID"] == 0 else externals[pointer["m_FileID"] - 1]["path"].split("/")[-1]
                    components.append({"bundle": relative, "file": filename, "pathId": str(obj["id"]), "hierarchy": hierarchy,
                        "objectSha256": hashlib.sha256(raw).hexdigest(), "scriptPPtr": pointer, "scriptFile": script_file,
                        "script": scripts.get((script_file, pointer["m_PathID"])), "value": value})
                except Exception as error:
                    errors.append({"bundle": relative, "pathId": str(obj["id"]), "error": str(error)})
    db = json.loads(DB.read_text())
    references = []
    wanted = set()
    for component in components:
        for pointer, value in walk(component["value"]):
            if "templateKey" not in value:
                continue
            resolved = db.get(value.get("buffKey")) if value.get("loadFromDB") else value
            if resolved:
                wanted.add(resolved["templateKey"])
                references.append({"component": component["pathId"], "file": component["file"], "hierarchy": component["hierarchy"],
                    "pointer": pointer, "buffKey": value.get("buffKey"), "templateKey": value.get("templateKey"),
                    "loadFromDB": value.get("loadFromDB"), "resolvedTemplateKey": resolved["templateKey"], "definition": value})
    holder_source = base / "config/buff_template_holder.ab"
    sources.append(fingerprint(holder_source))
    templates = {}
    for filename, data in bundle(holder_source)[0]:
        if filename.endswith((".resS", ".resource")):
            continue
        for obj in serialized(data)["objects"]:
            if obj["id"] != 6070581171229484677:
                continue
            raw = data[obj["start"]:obj["start"] + obj["size"]]
            value = helper.helper.decode(raw, helper.helper.trees(data)[0][obj["typeid"]])
            for index, template in enumerate(value["_templates"]["Array"]):
                templates[template["templateKey"]] = {"template": template["templateKey"], "index": index, "priority": template["onEventPriority"],
                    "events": [{"event": event["key"], "actions": json.loads(event["value"]["SerializedState"])} for event in template["eventToActions"]["_items"]["Array"]]}
    pending = list(wanted)
    while pending:
        key = pending.pop()
        for pointer, value in walk(templates.get(key, {})):
            if "templateKey" not in value:
                continue
            resolved = db.get(value.get("buffKey")) if value.get("loadFromDB") else value
            child = resolved.get("templateKey") if resolved else None
            if child is not None and child not in wanted:
                wanted.add(child)
                pending.append(child)
    profile_source = ROOT / ".cache/native-research/unit-audit-20261110/operator-config/character_table.json"
    profiles = json.loads(profile_source.read_text())
    provenance = {"checkedOn": "2026-11-15", "script": fingerprint(Path(__file__)), "reader": fingerprint(HELPER),
        "sources": sources, "db": fingerprint(DB), "characterTable": fingerprint(profile_source),
        "characterTableRevision": "17759cc8cdf37388414145d16262a3a06f3ab25e",
        "scope": "All MonoBehaviours under explicitly selected roots; complete referenced Holder programs including recursively created Buff definitions. Static references and enabled paths require separate interpretation; fixed mirror DB and Character data are independent of installed resources."}
    args.out.mkdir(parents=True, exist_ok=True)
    outputs = {
        "selected-content.json": {"selection": selection, "candidateBundleScan": candidate_scan, "components": components, "references": references, "errors": errors},
        "selected-programs.json": {"templates": [templates[key] for key in sorted(wanted) if key in templates], "missingTemplates": sorted(wanted - templates.keys())},
        "profiles.json": {"characters": {key: profiles[key] for key in CHARACTERS if key in profiles}, "absentInFixedMirror": [key for key in CHARACTERS if key not in profiles]},
    }
    for name, result in outputs.items():
        (args.out / name).write_text(json.dumps({"provenance": provenance, "result": result}, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"components": len(components), "references": len(references), "templates": len(wanted), "errors": len(errors)}))


if __name__ == "__main__":
    main()
