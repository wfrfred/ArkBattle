#!/usr/bin/env python3
"""Extract selected real operator/skill bindings for damage classifications and permissions."""
import argparse
import hashlib
import importlib.util
import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True
ROOT = Path.cwd()
sys.path.insert(0, str(ROOT / ".agents/skills/arkbattle-native-research/scripts"))
from native import DEFAULT_GAME, fingerprint
from unity_assets import Reader, bundle, serialized, script

HELPER = ROOT / "docs/research/evidence/targeting-pipeline-20261109/content/extract_content.py"
CHARACTERS = ["char_430_fartth", "char_445_wscoot", "char_1012_skadi2", "char_4082_qiubai", "char_4214_cairn", "char_362_saga", "char_4058_pepe", "char_4151_tinman", "char_1051_headb2", "char_4144_chilc", "char_345_folnic", "char_311_mudrok", "char_423_blemsh", "char_4064_mlynar", "char_420_flamtl", "char_237_gravel", "char_4131_odda"]
SKILLS = ["skchr_fartth_2", "skchr_fartth_3", "skchr_wscoot_2", "skchr_skadi2_1", "skchr_qiubai_1", "skchr_cairn_2", "skchr_pepe_1", "skchr_pepe_2", "skchr_pepe_3", "skchr_headb2_3", "skchr_tinman_1", "skchr_tinman_2", "skchr_gravel_2", "skchr_odda_1"]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    spec = importlib.util.spec_from_file_location("damage_binding_helper", HELPER)
    helper = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(helper)
    base = args.game / "Arknights_Data/StreamingAssets/AB/Windows"
    sources, script_lookup, unavailable = [], {}, []
    for relative in ["anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin", "anon/88b3c3ecaaefa6003de730686dd5ac53.bin"]:
        source = base / relative
        if not source.exists():
            unavailable.append({"path": str(source), "reason": "optional script bundle absent"})
            continue
        sources.append(fingerprint(source))
        for filename, data in bundle(source)[0]:
            if filename.endswith((".resS", ".resource")):
                continue
            for obj in serialized(data)["objects"]:
                if obj["classid"] == 115:
                    script_lookup[(filename, obj["id"])] = script(obj, data)
    selection = {"charpack/" + char + ".ab": [char] for char in CHARACTERS}
    selection["battle/prefabs/[uc]skills.ab"] = SKILLS
    enemy_scan = []
    for path in sorted((base / "battle").glob("enm_pfb*.ab")):
        hit = any(b"enemy_5601_entlec" in data for filename, data in bundle(path)[0]
                  if not filename.endswith((".resS", ".resource")))
        enemy_scan.append({"bundle": str(path.relative_to(base)), "containsSelectedName": hit})
        if hit:
            selection[str(path.relative_to(base))] = ["enemy_5601_entlec"]
    rows = []
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
            by_owner = {owner: tid for tid, (owner, _) in transforms.items()}
            for obj in state["objects"]:
                if obj["classid"] != 114:
                    continue
                raw = data[obj["start"]:obj["start"] + obj["size"]]
                owner = int.from_bytes(raw[4:12], "little", signed=True)
                tid = by_owner.get(owner)
                hierarchy = []
                while tid:
                    go, tid = transforms[tid]
                    hierarchy.append(names[go])
                hierarchy.reverse()
                if not hierarchy or hierarchy[0] not in roots:
                    continue
                value = helper.decode(raw, layouts[obj["typeid"]])
                pointer = value["common:490"]
                script_file = filename if pointer["m_FileID"] == 0 else externals[pointer["m_FileID"] - 1]["path"].split("/")[-1]
                rows.append({"bundle": relative, "file": filename, "pathId": str(obj["id"]), "hierarchy": hierarchy,
                             "objectSha256": hashlib.sha256(raw).hexdigest(), "scriptPPtr": pointer,
                             "scriptFile": script_file, "script": script_lookup.get((script_file, pointer["m_PathID"])),
                             "value": {k: v for k, v in value.items() if not k.startswith("common:")}})
    table = ROOT / ".cache/native-research/unit-audit-20261110/operator-config/character_table.json"
    raw_table = json.loads(table.read_text())
    profiles = [{"pointer": "/" + key, "id": key, "name": raw_table[key]["name"],
                 "talents": raw_table[key].get("talents"), "skills": raw_table[key].get("skills")}
                for key in CHARACTERS]
    provenance = {"collectedOn": "2026-11-14", "script": fingerprint(Path(__file__)), "helper": fingerprint(HELPER),
                  "sources": sources, "unavailableOptionalScriptBundles": unavailable, "characterTable": fingerprint(table),
                  "characterTableRevision": "17759cc8cdf37388414145d16262a3a06f3ab25e",
                  "characterTableUrl": "https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/17759cc8cdf37388414145d16262a3a06f3ab25e/zh_CN/gamedata/excel/character_table.json",
                  "scope": "All MonoBehaviours below selected actual character and skill roots; source table excerpts and resources have independent versions. Static binding, not live execution."}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps({"provenance": provenance, "result": {"selection": selection, "enemyBundleScan": enemy_scan, "profiles": profiles, "components": rows}}, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"components": len(rows), "profiles": len(profiles), "out": str(args.out)}))


if __name__ == "__main__":
    main()
