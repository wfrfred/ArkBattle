# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Extract the Act49side per-part HP synchronization evidence."""

import argparse
from bisect import bisect_right
import importlib.util
import json
from pathlib import Path
from subprocess import check_output
import sys

import capstone

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT / ".agents/skills/arkbattle-native-research/scripts"))
from native import DEFAULT_GAME, Native, fingerprint
from unity_assets import Reader, bundle, script, serialized

REVISION = "17759cc8cdf37388414145d16262a3a06f3ab25e"
PARTS = {"enemy_1582_suisho", "enemy_1583_suizzh", "enemy_1584_suiyzh", "enemy_1585_suiwei"}
REPORT = "enemy_sui_report_damage"
PREFAB = "battle/enm_pfb_30.ab"
PREFAB_FILE = "CAB-4259af29fb317836113f2409abf8b606"
SHARED_SCRIPTS = "anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin"
HOLDER = "config/buff_template_holder.ab"
HOLDER_ID = 6070581171229484677
DECODER = ROOT / "docs/research/evidence/nymph-action-settlement-20261103/projectile/decode_projectile.py"
METHOD_SPANS = {
    97662: [(0x181085FB0, 0x181086063)],
    69527: [(0x1807D8253, 0x1807D828F)],
    69565: [
        (0x18082D612, 0x18082D64E),
        (0x18082D722, 0x18082D777),
        (0x18082D79E, 0x18082D8E7),
        (0x18082D936, 0x18082D965),
        (0x18082DA95, 0x18082DAA4), (0x18082DAF6, 0x18082DB24),
        (0x18082DC54, 0x18082DC63), (0x18082DCCC, 0x18082DD01),
        (0x18082DE30, 0x18082DE3F), (0x18082DEA8, 0x18082DEDD),
        (0x18082DEE0, 0x18082DF20),
    ],
}


def extract_config():
    mirror = ROOT / "assets/arknights-game-data"
    records = []

    def read(relative, select):
        data = json.loads(check_output(["git", "-C", mirror, "show", f"{REVISION}:{relative}"]))
        records.append({
            "path": relative,
            "gitBlob": check_output(["git", "-C", mirror, "rev-parse", f"{REVISION}:{relative}"], text=True).strip(),
            "entries": select(data),
        })

    for name in ("level_act49side_10.json", "level_act49side_ex08.json"):
        read(f"zh_CN/gamedata/levels/activities/act49side/{name}", lambda data: {
            f"/waves/1/fragments/0/actions/{i}": action
            for i, action in enumerate(data["waves"][1]["fragments"][0]["actions"])
            if action["actionType"] == "SPAWN" and action["key"] in PARTS
        })
    read("zh_CN/gamedata/excel/enemy_handbook_table.json",
         lambda data: {"/enemyData/enemy_1582_suisho": data["enemyData"]["enemy_1582_suisho"]})
    read("zh_CN/gamedata/battle/buff_template_data.json", lambda data: {f"/{REPORT}": data[REPORT]})
    return records


def extract_assets(base, reader):
    scripts = {
        (file, obj["id"]): script(obj, data)
        for file, data in bundle(base / SHARED_SCRIPTS)[0]
        if not file.endswith((".resS", ".resource"))
        for obj in serialized(data)["objects"]
        if obj["classid"] == 115
    }
    data = next(data for file, data in bundle(base / PREFAB)[0] if file == PREFAB_FILE)
    layouts, externals = reader.trees(data)
    names, parents, reports = {}, {}, []
    for obj in serialized(data)["objects"]:
        raw = data[obj["start"]:obj["start"] + obj["size"]]
        if obj["classid"] == 1:
            value = Reader(raw)
            value.read(value.val("i") * 12)
            value.val("i")
            names[obj["id"]] = value.string()
        elif obj["classid"] == 4:
            value = reader.decode(raw, layouts[obj["typeid"]])
            parents[obj["id"]] = (value["common:374"]["m_PathID"], value["m_Father"]["m_PathID"])
        elif obj["classid"] == 114 and REPORT.encode() in raw:
            value = reader.decode(raw, layouts[obj["typeid"]])
            pointer = value["common:490"]
            script_file = (PREFAB_FILE if pointer["m_FileID"] == 0
                           else externals[pointer["m_FileID"] - 1]["path"].split("/")[-1])
            buffs = [buff for buff in value["_buffs"]["Array"] if buff["templateKey"] == REPORT]
            reports.append({
                "pathId": str(obj["id"]), "gameObjectId": value["common:374"]["m_PathID"],
                "scriptPPtr": pointer, "scriptFile": script_file,
                "script": scripts[script_file, pointer["m_PathID"]], "enabled": value["common:349"],
                "buffs": [{key: entry[key] for key in ("buffKey", "templateKey", "loadFromDB")} for entry in buffs],
            })
    owner_transforms = {owner: transform for transform, (owner, _) in parents.items()}
    for report in reports:
        hierarchy = []
        current = owner_transforms[report["gameObjectId"]]
        while current:
            owner, current = parents[current]
            hierarchy.append(names[owner])
        report["hierarchy"] = list(reversed(hierarchy))
    if {report["hierarchy"][0] for report in reports if report["enabled"] and report["buffs"]} != PARTS:
        raise ValueError("an enabled report binding is missing")

    for file, data in bundle(base / HOLDER)[0]:
        if file.endswith((".resS", ".resource")):
            continue
        for obj in serialized(data)["objects"]:
            if obj["id"] != HOLDER_ID:
                continue
            raw = data[obj["start"]:obj["start"] + obj["size"]]
            value = reader.decode(raw, reader.trees(data)[0][obj["typeid"]])
            for index, template in enumerate(value["_templates"]["Array"]):
                if template["templateKey"] == REPORT:
                    events = [
                        {"event": entry["key"], "actions": json.loads(entry["value"]["SerializedState"])}
                        for entry in template["eventToActions"]["_items"]["Array"]
                    ]
                    return {
                        "prefabBundle": PREFAB, "prefabFile": PREFAB_FILE, "reports": reports,
                        "holder": {"bundle": HOLDER, "file": file, "pathId": str(HOLDER_ID),
                                   "index": index, "templateKey": REPORT, "events": events},
                    }
    raise ValueError("missing report template in the installed Holder")


def extract_native(native):
    decoder = capstone.Cs(capstone.CS_ARCH_X86, capstone.CS_MODE_64)
    methods = []
    for index, spans in METHOD_SPANS.items():
        method = native.method(index)
        start = method["address"]
        end = native.addresses[bisect_right(native.addresses, start)]
        instructions = list(decoder.disasm(native.pe.read(start, end - start), start))
        records = []
        for low, high in spans:
            selected = [ins for ins in instructions if low <= ins.address < high]
            if not selected:
                raise ValueError(f"empty span for method {index}: {low:#x}–{high:#x}")
            records.append({
                "address": f"{selected[0].address:#x}",
                "range": [hex(low), hex(high)],
                "instructions": [f"{ins.address:#x}: {ins.mnemonic} {ins.op_str}".rstrip() for ins in selected],
            })
        methods.append({"method": method, "spans": records})
    fields = [field for field in native.fields(10567)
              if field["name"] in {"headEnemy", "tailEnemy", "leftHandEnemy", "rightHandEnemy",
                                   "enemyHp", "enemyMaxHp", "headDmg", "tailDmg", "leftHandDmg", "rightHandDmg"}]
    return {"methods": methods, "bossStateFields": fields}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    native = Native(args.game)
    provenance = native.provenance()
    expected = (
        "cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff",
        "e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5",
    )
    if tuple(provenance["client"][name]["sha256"] for name in ("dll", "metadata")) != expected:
        raise ValueError("client fingerprint does not match this batch")

    spec = importlib.util.spec_from_file_location("sui_object_reader", DECODER)
    reader = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(reader)
    base = args.game / "Arknights_Data/StreamingAssets/AB/Windows"
    result = {
        "provenance": {
            "collectedOn": "2026-11-22", "client": provenance["client"],
            "tools": [fingerprint(Path(__file__)), provenance["tool"]["script"], fingerprint(DECODER)],
            "assets": [fingerprint(base / relative) for relative in (PREFAB, HOLDER, SHARED_SCRIPTS)],
            "configRevision": REVISION,
        },
        "result": {"config": extract_config(), "assets": extract_assets(base, reader), "native": extract_native(native)},
    }
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()
