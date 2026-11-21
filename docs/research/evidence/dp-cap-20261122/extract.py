# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Extract the DP cap and card price ceiling witnesses."""

import argparse
import hashlib
import json
import struct
import sys
from pathlib import Path

sys.dont_write_bytecode = True
root = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(root / ".agents/skills/arkbattle-native-research/scripts"))
from native import DEFAULT_GAME, Native


REVISION = "17759cc8cdf37388414145d16262a3a06f3ab25e"
DLL_SHA256 = "cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff"
METADATA_SHA256 = "e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5"
MIRROR = root / "assets/arknights-game-data/zh_CN/gamedata"
ENEMY = "enemy_1313_wdfmr"


def selected_config():
    files = ["excel/enemy_handbook_table.json",
             "levels/obt/training/level_training_22.json",
             "levels/obt/main/level_main_12-13.json"]
    result = []
    for file in files:
        raw = (MIRROR / file).read_bytes()
        data = json.loads(raw)
        if file.startswith("excel/"):
            handbook = data["enemyData"][ENEMY]
            rows = [{"pointer": f"/enemyData/{ENEMY}/abilityList", "value": handbook["abilityList"]}]
        else:
            rows = [{"pointer": "/options/maxCost", "value": data["options"]["maxCost"]}]
            rows.extend({"pointer": f"/runes/{i}", "value": rune}
                        for i, rune in enumerate(data["runes"] or [])
                        if rune["key"] == "cbuff_max_cost")
            rows.extend({"pointer": f"/enemyDbRefs/{i}", "value": enemy}
                        for i, enemy in enumerate(data["enemyDbRefs"])
                        if enemy["id"] == ENEMY)
            rows.extend(
                {"pointer": f"/waves/{w}/fragments/{f}/actions/{a}",
                 "value": action}
                for w, wave in enumerate(data["waves"])
                for f, fragment in enumerate(wave["fragments"])
                for a, action in enumerate(fragment["actions"])
                if action["actionType"] == "SPAWN" and action["key"] == ENEMY)
        result.append({"path": f"zh_CN/gamedata/{file}",
                       "sha256": hashlib.sha256(raw).hexdigest(), "selected": rows})
    return {"revision": REVISION, "source": "https://github.com/Kengxxiao/ArknightsGameData",
            "result": result}


def selected_native(game):
    native = Native(game)
    provenance = native.provenance()
    client = provenance["client"]
    if client["dll"]["sha256"] != DLL_SHA256 or client["metadata"]["sha256"] != METADATA_SHA256:
        raise ValueError("expected the recorded Windows client fingerprints")
    names = [
        "Torappu.Battle.BattleOptions..cctor",
        "Torappu.Battle.BattleOptions.ModifyMaxCost",
        "Torappu.Battle.BattleController.SetMaxCost",
        "Torappu.Battle.BattleController.ModifyMaxCost",
        "Torappu.Battle.BattleCostManager.SetMaxCost",
        "Torappu.Battle.Runes.Internal.LMaxCostSet.PreprocessLevelOptions",
        "Torappu.Battle.Action.Nodes/ModifyMaxCost.Execute",
    ]
    methods = {}
    for entry in native.methods:
        owner = native.typename(entry["declaringType"])
        name = owner + "." + native.string(entry["nameIndex"])
        if name in names:
            if name in methods:
                raise ValueError(f"ambiguous method: {name}")
            methods[name] = native.method(entry["index"])
    bodies = []
    for name in names:
        method = methods[name]
        start = method["address"]
        end = min(item for item in native.addresses if item > start)
        parts = [native.disassemble(method["index"], end - start)]
        start = int(parts[-1]["end"], 16)
        while start < end:
            parts.append(native.disassemble_at(start, end - start))
            start = int(parts[-1]["end"], 16)
        bodies.append({"method": method, "parts": parts})
    options = next(t for t in native.types if native.typename(t["index"]) == "Torappu.Battle.BattleOptions")
    field_names = {"MAX_COST", "MAX_COST_CEIL", "MIN_COST", "SYNC_MAXCOST_CEIL_WITH_MAXCOST"}
    fields = [field for field in native.fields(options["index"]) if field["name"] in field_names]
    rune = next(body for body in bodies
                if body["method"]["fullname"].endswith("LMaxCostSet.PreprocessLevelOptions"))
    literals = []
    records, size, data, data_size = struct.unpack_from("<4I", native.metadata, 8)
    for address in ("0x180d7b2c4", "0x180d7b2f6"):
        row = next(row for part in rune["parts"] for row in part["instructions"]
                   if row["address"] == address)
        slot = int(row["ripReferences"][0], 16)
        encoded, = native.pe.unpack("<Q", slot)
        index = (encoded & 0x1fffffff) >> 1
        if encoded >> 29 != 5 or not encoded & 1 or index * 8 >= size:
            raise ValueError("expected a string literal usage")
        length, offset = struct.unpack_from("<II", native.metadata, records + index * 8)
        if offset + length > data_size:
            raise ValueError("literal outside data")
        literals.append({"instruction": address, "slot": hex(slot), "encodedUsage": hex(encoded),
                         "value": native.metadata[data + offset:data + offset + length].decode()})
    level_options = next(t for t in native.types
                         if native.typename(t["index"]) == "Torappu.LevelData/Options")
    level_fields = [field for field in native.fields(level_options["index"])
                    if field["name"].lower() == "maxcost"]
    return {"provenance": provenance,
            "result": {"fields": fields, "levelOptionFields": level_fields,
                       "runeKeys": literals, "bodies": bodies}}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    config = selected_config()
    native = selected_native(args.game)
    args.out.mkdir(parents=True, exist_ok=True)
    for name, record in [("config", config), ("native", native)]:
        (args.out / f"{name}.json").write_text(
            json.dumps(record, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()
