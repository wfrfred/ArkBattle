#!/usr/bin/env python3
"""Extract actual Ascalon/Logos/Oxi character and skill cancellation bindings."""
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
CHARACTERS = ["char_4132_ascln", "char_4133_logos", "char_4247_oxi"]
SKILLS = ["skchr_ascln_3", "skchr_logos_1", "skchr_oxi_2"]
ENEMIES = ["enemy_1372_ltntpt", "enemy_1372_ltntpt_2"]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    spec = importlib.util.spec_from_file_location("cancel_content_reader", HELPER)
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
    for source in sorted((base / "battle").glob("enm_pfb*.ab")):
        entries = bundle(source)[0]
        matches = [key for key in ENEMIES if any(key.encode() in data for _, data in entries)]
        enemy_scan.append({"bundle": str(source.relative_to(base)), "matches": matches})
        if matches:
            selection[str(source.relative_to(base))] = matches
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
                tid, hierarchy = by_owner.get(owner), []
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
                             "value": {key: child for key, child in value.items() if not key.startswith("common:")}})
    table = ROOT / ".cache/native-research/route-operations-20261107/data/character_table.json"
    raw_table = json.loads(table.read_text())
    profiles = [{"pointer": "/" + key, "id": key, "name": raw_table[key]["name"],
                 "talents": raw_table[key].get("talents"), "skills": raw_table[key].get("skills")}
                for key in CHARACTERS if key in raw_table]
    payload = {"provenance": {"collectedOn": "2026-11-14", "script": fingerprint(Path(__file__)),
               "helper": fingerprint(HELPER), "sources": sources, "unavailableOptionalScriptBundles": unavailable,
               "characterTable": fingerprint(table), "characterTableRevision": "63c7cec73c3858d0ae913f85cc89af3cef4d744f",
               "characterTableUrl": "https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/63c7cec73c3858d0ae913f85cc89af3cef4d744f/zh_CN/gamedata/excel/character_table.json",
               "scope": "All MonoBehaviours below selected character and skill roots; static binding, not live execution. Table and resources have independent versions."},
               "result": {"selection": selection, "profiles": profiles, "enemyBundleScan": enemy_scan,
               "missingFromRecordedTable": [key for key in CHARACTERS if key not in raw_table], "components": rows}}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"components": len(rows), "profiles": len(profiles), "out": str(args.out)}))


if __name__ == "__main__":
    main()
