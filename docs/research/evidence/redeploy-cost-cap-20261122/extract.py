#!/usr/bin/env python3
"""Replay the evidence for SilverAsh the Reignfrost's X3 redeploy-cost cap."""
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
import argparse
from bisect import bisect_right
from hashlib import sha256
import importlib.util
import json
from pathlib import Path
import struct
from subprocess import check_output
import sys

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT / ".agents/skills/arkbattle-native-research/scripts"))
from native import DEFAULT_GAME, Native, fingerprint
from unity_assets import Reader, bundle, script, serialized

REVISION = "bffe31bf66739842f99b457327066c695e2af389"
MODULE = "uniequip_002_svash2"
METHODS = {
    65778: [(0x18064B666, 0x18064B6AC), (0x18064B71E, 0x18064B738), (0x18064B7DD, 0x18064B841)],
    66823: [(0x1806F36F8, 0x1806F37EB)],
    66869: [(0x1806F1026, 0x1806F103B), (0x1806F1095, 0x1806F10AB),
            (0x1806F1105, 0x1806F111B), (0x1806F1156, 0x1806F1185)],
    66882: [(0x1806EB08F, 0x1806EB0E0)],
    66884: [(0x1806EA1C9, 0x1806EA1E2)],
    66993: [(0x1807192DD, 0x1807192F2), (0x18071936E, 0x1807193DF)],
    66996: [],
    96393: [(0x18100CDB8, 0x18100CDF3), (0x18100CE4E, 0x18100CE85)],
    96397: [(0x18100C992, 0x18100C9A9), (0x18100CA03, 0x18100CA65),
            (0x18100CAB2, 0x18100CB1C)],
    98680: [(0x1810D339F, 0x1810D3405)],
    98706: [(0x1810C5F12, 0x1810C5F51)],
}


def native_evidence(native):
    index = 32722
    literal_table, _ = native.table(0)
    literal_content, _ = native.table(1)
    length, offset = struct.unpack_from("<II", native.metadata, literal_table + 8 * index)
    literal = native.metadata[literal_content + offset:literal_content + offset + length].decode()
    usage_slot = 0x188C2DA30
    encoded, = native.pe.unpack("<Q", usage_slot)
    assert literal == "multiplier_max_offset" and encoded == 0xA000FFA5
    result = []
    for index, spans in METHODS.items():
        method = native.method(index)
        start = method["address"]
        end = native.addresses[bisect_right(native.addresses, start)]
        found = []
        address = start
        while address < end:
            part = native.disassemble_at(address)
            for instruction in part["instructions"]:
                va = int(instruction["address"], 16)
                if va < end and (not spans or any(low <= va < high for low, high in spans)):
                    found.append(f'{instruction["address"]} {instruction["mnemonic"]} {instruction["operands"]}'.rstrip())
            address = int(part["end"], 16)
        assert found, method
        result.append({"method": method, "instructions": found})
    return {
        "stringLiteral": {"index": 32722, "value": literal, "usageSlot": hex(usage_slot), "encoded": hex(encoded)},
        "methods": result,
    }


def table_evidence():
    data = ROOT / "assets/arknights-game-data"
    paths = ["zh_CN/gamedata/excel/uniequip_table.json", "zh_CN/gamedata/excel/battle_equip_table.json"]
    contents = [check_output(["git", "-C", data, "show", f"{REVISION}:{path}"]) for path in paths]
    inventory, battle = map(json.loads, contents)
    display = inventory["equipDict"][MODULE]
    rows = []
    for phase, entry in enumerate(battle[MODULE]["phases"], start=1):
        if phase == 1:
            continue
        part = entry["parts"][2]
        candidate = part["addOrOverrideTalentDataBundle"]["candidates"][0]
        rows.append({
            "phase": phase, "resKey": part["resKey"], "target": part["target"],
            **{key: candidate[key] for key in ("talentIndex", "prefabKey", "blackboard")},
        })
    return {
        "revision": REVISION,
        "files": [{"path": path, "bytes": len(raw), "sha256": sha256(raw).hexdigest()}
                  for path, raw in zip(paths, contents)],
    }, {"module": {key: display[key] for key in ("charId", "uniEquipId", "uniEquipName", "typeName2")}, "talents": rows}


def prefab_evidence(base, decoder):
    spec = importlib.util.spec_from_file_location("silverash_type_tree", decoder)
    reader = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(reader)
    shared = base / "anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin"
    scripts = {
        (filename, obj["id"]): script(obj, data)
        for filename, data in bundle(shared)[0]
        if not filename.endswith((".resS", ".resource"))
        for obj in serialized(data)["objects"]
        if obj["classid"] == 115
    }
    sources = {
        "battle/prefabs/[uc]equips.ab": {
            -3466141754792830343, 4954402412657482361, -8898539420386388375, 2964740664816572009,
        },
        "config/buff_template_holder.ab": {6070581171229484677},
    }
    output = []
    for relative, ids in sources.items():
        found = set()
        for filename, data in bundle(base / relative)[0]:
            if filename.endswith((".resS", ".resource")):
                continue
            objects = serialized(data)["objects"]
            if not ids.intersection(obj["id"] for obj in objects):
                continue
            layouts, externals = reader.trees(data)
            for obj in objects:
                if obj["id"] not in ids:
                    continue
                raw = data[obj["start"]:obj["start"] + obj["size"]]
                value = reader.decode(raw, layouts[obj["typeid"]])
                pointer = value["common:490"]
                script_file = externals[pointer["m_FileID"] - 1]["path"].split("/")[-1]
                row = {"bundle": relative, "file": filename, "pathId": str(obj["id"]),
                       "script": scripts[script_file, pointer["m_PathID"]], "enabled": value["common:349"]}
                if "_templates" in value:
                    row["events"] = {
                        template["templateKey"]: json.loads(event["value"]["SerializedState"])
                        for template in value["_templates"]["Array"]
                        if template["templateKey"] in ("svash2_t_1[sp]", "svash2_t_1[resp]")
                        for event in template["eventToActions"]["_items"]["Array"]
                        if event["key"] == 4
                    }
                else:
                    owner = next(entry for entry in objects if entry["id"] == value["common:374"]["m_PathID"])
                    name = Reader(data[owner["start"]:owner["start"] + owner["size"]])
                    name.read(name.val("i") * 12)
                    name.val("i")
                    row["gameObject"] = name.string()
                    if "_deckBuffs" in value:
                        fields = ("_overrideId", "_containsCardBuff", "_cardBuffKey", "_cardBuffIsRatio", "_compareType")
                        row["aura"] = {key: value[key] for key in fields}
                        buffs = value["_deckBuffs"]["Array"]
                        row["deckBuffs"] = [
                            {**{key: buff[key] for key in ("lifeType", "affectInHand", "affectOutOfHand")},
                             "templateKey": buff["buff"]["templateKey"]} for buff in buffs
                        ]
                    else:
                        row["buffs"] = [
                            {key: buff[key] for key in ("templateKey", "blackboard")}
                            for buff in value["_buffs"]["Array"]
                        ]
                found.add(obj["id"])
                output.append(row)
        assert found == ids
    return [fingerprint(path) for path in (shared, decoder, *(base / name for name in sources))], output


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
    config_sources, config = table_evidence()
    provenance = {"collectedOn": "2026-11-22", "client": provenance["client"],
                  "tool": provenance["tool"], "assets": assets, "config": config_sources}
    result = {"prefab": prefab, "config": config, "native": native_evidence(native)}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps({"provenance": provenance, "result": result}, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()
