#!/usr/bin/env python3
"""Replay the Repeater's ordinary queued stock recovery evidence."""
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
import argparse
from bisect import bisect_right
import importlib.util
import json
from pathlib import Path
from subprocess import check_output
import sys

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT / ".agents/skills/arkbattle-native-research/scripts"))
from native import DEFAULT_GAME, Native, fingerprint
from unity_assets import Reader, bundle, script, serialized

METHODS = {
    26424: [(0x181E4B04A, 0x181E4B097)],
    65741: [(0x180658FA0, 0x180658FC0)],
    66351: [(0x1806B1EBD, 0x1806B1EDC), (0x1806B2088, 0x1806B20A8)],
    66363: [(0x1806CD7B0, 0x1806CD7DC), (0x1806CD82D, 0x1806CD86C)],
    66742: [(0x1806FBA02, 0x1806FBAB8)],
    66747: [(0x1806FCC75, 0x1806FCCB6)],
    66748: [(0x1806FBF33, 0x1806FBF98)],
    66861: [(0x1806EBA24, 0x1806EBABB)],
    66863: [(0x1806EE867, 0x1806EE8CD), (0x1806EE924, 0x1806EE953)],
    66867: [(0x1806ECD94, 0x1806ECE3C)],
    66909: [(0x1806ED798, 0x1806ED7F9)],
    67088: [(0x18071D55A, 0x18071D586), (0x18071D610, 0x18071D621),
            (0x18071D6B4, 0x18071D719)],
    67094: [(0x18071D325, 0x18071D35D)],
    67653: [(0x18072A44B, 0x18072A470)],
    77256: [(0x180AA5B80, 0x180AA5C2E)],
    77258: [(0x180AA66FE, 0x180AA6731), (0x180AA6766, 0x180AA67B8)],
    77340: [(0x180AA33EF, 0x180AA3400), (0x180AA34BF, 0x180AA34DA)],
    79015: [(0x180B18E9B, 0x180B18EB4)],
    99423: [(0x18111F349, 0x18111F363)],
    101199: [(0x1811BF300, 0x1811BF359)],
}


def method_evidence(native):
    result = []
    for index, spans in METHODS.items():
        method = native.method(index)
        start = method["address"]
        end = native.addresses[bisect_right(native.addresses, start)]
        found = []
        address = start
        while address < end:
            block = native.disassemble_at(address)
            for instruction in block["instructions"]:
                va = int(instruction["address"], 16)
                if any(low <= va < high for low, high in spans):
                    found.append(" ".join([instruction["address"], instruction["mnemonic"],
                                           instruction["operands"]]).rstrip())
            address = int(block["end"], 16)
        assert found, method
        result.append({"method": method, "instructions": found})
    return result


def prefab_evidence(base, decoder):
    spec = importlib.util.spec_from_file_location("repeater_type_tree", decoder)
    reader = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(reader)
    shared = base / "anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin"
    prefab = base / "pkgrps/btl_pfb_tokens_5.ab"
    scripts = {
        (filename, obj["id"]): script(obj, data)
        for filename, data in bundle(shared)[0]
        if not filename.endswith((".resS", ".resource"))
        for obj in serialized(data)["objects"]
        if obj["classid"] == 115
    }
    selection = {
        -8739687973461992897: ("_cardPolicy", "_isInfinity", "_rechargeOnlyOnce"),
        -6219056184261649857: ("_overwriteTalentKey", "_defaultModeIndex"),
        4654743988350966335: ("_buffs",),
    }
    output = []
    for filename, data in bundle(prefab)[0]:
        if filename != "CAB-d45134594599a24ae95f928a8f1b3420":
            continue
        layouts, externals = reader.trees(data)
        names, transforms, components = {}, {}, []
        for obj in serialized(data)["objects"]:
            raw = data[obj["start"]:obj["start"] + obj["size"]]
            if obj["classid"] == 1:
                value = Reader(raw)
                value.read(value.val("i") * 12)
                value.val("i")
                names[obj["id"]] = value.string()
            elif obj["classid"] == 4:
                value = reader.decode(raw, layouts[obj["typeid"]])
                transforms[value["common:374"]["m_PathID"]] = (obj["id"], value["m_Father"]["m_PathID"])
            elif obj["id"] in selection:
                value = reader.decode(raw, layouts[obj["typeid"]])
                components.append((obj["id"], value))
        owners = {transform: owner for owner, (transform, _) in transforms.items()}
        for path_id, value in components:
            script_pointer = value["common:490"]
            script_file = externals[script_pointer["m_FileID"] - 1]["path"].split("/")[-1]
            fields = {field: value[field] for field in selection[path_id]}
            if "_buffs" in fields:
                fields["_buffs"] = [
                    {key: buff[key] for key in ("buffKey", "templateKey", "isDurableBuff", "lifeTimeType",
                                                "durationKey", "blackboard")}
                    for buff in fields["_buffs"]["Array"]
                ]
            hierarchy = []
            owner = value["common:374"]["m_PathID"]
            while owner:
                hierarchy.append(names[owner])
                owner = owners.get(transforms[owner][1], 0)
            output.append({"file": filename, "pathId": str(path_id), "hierarchy": hierarchy[::-1],
                           "enabled": value["common:349"],
                           "script": scripts[script_file, script_pointer["m_PathID"]], "fields": fields})
    assert {int(value["pathId"]) for value in output} == selection.keys()
    return [fingerprint(path) for path in (shared, prefab, decoder)], output


def config_evidence():
    submodule = ROOT / "assets/arknights-game-data"
    config = submodule / "zh_CN/gamedata"
    buffs_path = config / "battle/buff_template_data.json"
    characters_path = config / "excel/character_table.json"
    buffs = json.loads(buffs_path.read_bytes())
    characters = json.loads(characters_path.read_bytes())
    token = "token_10070_aphris_pc"
    host = "char_4229_aphris"
    config_sources = {"revision": check_output(["git", "-C", submodule, "rev-parse", "HEAD"], text=True).strip(),
                      "files": [fingerprint(path) for path in (buffs_path, characters_path)]}
    result = {
        "buff_template_data.json": {key: buffs[key]["eventToActions"]
                                    for key in ("aphris_pc[recharge]", "aphris_pc_t[with-draw]",
                                                "aphris_sk3[token-withdraw]")},
        "character_table.json": {
            f"/{token}/talents/0/candidates": characters[token]["talents"][0]["candidates"],
            f"/{host}/talents/0/candidates": characters[host]["talents"][0]["candidates"],
        },
    }
    return config_sources, result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()

    native = Native(args.game)
    provenance = native.provenance()
    assert provenance["client"]["dll"]["sha256"] == "cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff"
    assert provenance["client"]["metadata"]["sha256"] == "e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5"
    base = args.game / "Arknights_Data/StreamingAssets/AB/Windows"
    decoder = ROOT / "docs/research/evidence/nymph-action-settlement-20261103/projectile/decode_projectile.py"
    assets, prefab = prefab_evidence(base, decoder)
    config_sources, config = config_evidence()
    provenance = {"collectedOn": "2026-11-22", "client": provenance["client"],
                  "tool": provenance["tool"], "assets": assets, "config": config_sources}
    result = {"prefab": prefab, "config": config, "native": method_evidence(native)}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps({"provenance": provenance, "result": result}, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()
