# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Reproduce the bound resource observers and their source instructions."""

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
from unity_assets import bundle, script, serialized

DECODER = ROOT / "docs/research/evidence/nymph-action-settlement-20261103/projectile/decode_projectile.py"
SHARED_SCRIPTS = "anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin"
PREFABS = {
    ("battle/enm_pfb_25.ab", "CAB-eef20e46e9f0e9e38e18bc35388f76fa"): {
        -5046442390387465871: ("dirctr default aura", "_targetValidator", "_buffs"),
        -4027245157280030351: ("dirctr second mode aura", "_targetValidator", "_buffs"),
        -500895993683811983: ("dirctr third mode aura", "_targetValidator", "_buffs"),
    },
    ("battle/prefabs/[uc]equips.ab", "CAB-7e3af38637f0d056d61e3e709179a7d1"): {
        7011898347435499456: ("hoshiguma Y2 talent", "_buffs"),
        -4259617978525433877: ("hoshiguma Y3 talent", "_buffs"),
    },
    ("battle/prefabs/[uc]projectiles.ab", "CAB-34af01ecb5d2ad63aca01b6e0d71279d"): {
        -8640056801199653612: ("dirctr p1 motion", "_delayAfterReached", "_delayTime", "_followTarget"),
        1761316698136694351: ("dirctr p2 motion", "_delayAfterReached", "_delayTime", "_followTarget"),
        132995003735276820: ("dirctr p1 projectile", "_canHitSameTargetMultipleTimes"),
    },
    ("pkgrps/btl_pfb_tokens_2.ab", "CAB-3d61805b2486576a81f236427ebd9963"): {
        2825486651041938679: ("construction workshop mode talent", "_buffs"),
    },
}
METHODS = {
    66158: [(0x1806D1960, 0x1806D1B00)],
    66382: [(0x1806BD1FA, 0x1806BD255)],
    67680: [(0x18072918F, 0x1807291EA)],
    67747: [(0x18073BCEC, 0x18073BDDB)],
    98849: None,
    99151: [(0x181104173, 0x1811041B3)],
    99230: [(0x1810FA3BD, 0x1810FA412), (0x1810FA468, 0x1810FA4BD)],
    100255: [(0x1811771EF, 0x181177368)],
    100328: [(0x181175075, 0x181175100)],
}
TEMPLATES = (
    "enemy_dirctr_t[aura]", "enemy_dirctr_t[aura2]", "enemy_dirctr_t[aura3]",
    "hsguma_e_002_t", "huang_t_1[lock]", "multi_fortress_p[mesh]", "enemy_wdsdw[loss_hp]",
)


def extract_prefabs(base):
    spec = importlib.util.spec_from_file_location("resource_observer_decoder", DECODER)
    reader = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(reader)
    scripts = {
        (file, obj["id"]): script(obj, data)
        for file, data in bundle(base / SHARED_SCRIPTS)[0]
        if not file.endswith((".resS", ".resource"))
        for obj in serialized(data)["objects"]
        if obj["classid"] == 115
    }
    sources = [fingerprint(DECODER), fingerprint(base / SHARED_SCRIPTS)]
    result = []
    for (relative, file), selection in PREFABS.items():
        path = base / relative
        sources.append(fingerprint(path))
        data = next(data for name, data in bundle(path)[0] if name == file)
        layouts, externals = reader.trees(data)
        remaining = set(selection)
        for obj in serialized(data)["objects"]:
            path_id = obj["id"]
            if path_id not in selection:
                continue
            raw = data[obj["start"]:obj["start"] + obj["size"]]
            value = reader.decode(raw, layouts[obj["typeid"]])
            pointer = value["common:490"]
            owner = file if pointer["m_FileID"] == 0 else externals[pointer["m_FileID"] - 1]["path"].split("/")[-1]
            label, *fields = selection[path_id]
            result.append({
                "bundle": relative, "file": file, "pathId": str(path_id), "label": label,
                "script": scripts[owner, pointer["m_PathID"]], "enabled": value["common:349"],
                "fields": {field: value[field] for field in fields},
            })
            remaining.remove(path_id)
        if remaining:
            raise ValueError(f"missing objects in {file}: {remaining}")
    return sources, result


def nodes(value):
    if isinstance(value, dict):
        if "$type" in value:
            yield value
        for child in value.values():
            yield from nodes(child)
    elif isinstance(value, list):
        for child in value:
            yield from nodes(child)


def extract_tables():
    mirror = ROOT / "assets/arknights-game-data"
    base = mirror / "zh_CN/gamedata"
    templates_path = base / "battle/buff_template_data.json"
    equip_path = base / "excel/battle_equip_table.json"
    skill_path = base / "excel/skill_table.json"
    stage_path = base / "excel/stage_table.json"
    relic_path = base / "excel/roguelike_topic_table.json"
    level_paths = [
        base / "levels/activities/act43side/level_act43side_08.json",
        base / "levels/activities/act43side/level_act43side_ex08.json",
        base / "levels/activities/act1multi/level_act1multi_tr03.json",
    ]
    sources = {
        "revision": check_output(["git", "-C", mirror, "rev-parse", "HEAD"], text=True).strip(),
        "files": [
            fingerprint(path)
            for path in (templates_path, equip_path, skill_path, stage_path, relic_path, *level_paths)
        ],
    }
    templates = json.loads(templates_path.read_bytes())
    equip = json.loads(equip_path.read_bytes())["uniequip_002_hsguma"]["phases"]
    skill = json.loads(skill_path.read_bytes())["sktok_mufrfm"]["levels"][0]["spData"]
    stages = json.loads(stage_path.read_bytes())["stages"]
    relics = json.loads(relic_path.read_bytes())["details"]["rogue_6"]
    relic_id = "rogue_6_relic_fight_11"
    levels = [json.loads(path.read_bytes()) for path in level_paths]
    placements = [
        (level_paths[0].name, "/waves/0/fragments/1/actions/0", levels[0]["waves"][0]["fragments"][1]["actions"][0]),
        (level_paths[1].name, "/waves/0/fragments/2/actions/0", levels[1]["waves"][0]["fragments"][2]["actions"][0]),
    ]
    placements.extend(
        (level_paths[2].name, f"/predefines/{key}/{index}", item)
        for key, items in levels[2]["predefines"].items() if isinstance(items, list)
        for index, item in enumerate(items) if "trap_205_mufrfm" in json.dumps(item)
    )
    observations = [
        {"template": key, "event": event, "node": node}
        for key, template in templates.items()
        for event, actions in (template.get("eventToActions") or {}).items()
        for node in nodes(actions)
        if (
            "+FilterModifierCancelReason," in node["$type"]
            or ("+ModifySpData," in node["$type"] and node.get("_onlyUpdateSpCost") is False)
            or node.get("_isNotChangeableValue") is True
        )
    ]
    return sources, {
        "templates": {key: templates[key]["eventToActions"] for key in TEMPLATES},
        "templateCount": len(templates), "observations": observations,
        "hoshigumaY2Y3": [
            part for phase in equip[1:] for part in phase["parts"] if part["target"] == "TALENT"
        ],
        "constructionWorkshopSp": skill, "placements": placements,
        "deploymentRelic": {
            f"/details/rogue_6/{table}/{relic_id}": relics[table][relic_id]
            for table in ("relics", "items")
        },
        "stageCodes": {
            key: stages[key]["code"] for key in ("act43side_08", "act43side_ex08", "act1multi_tr03")
        },
    }


def extract_native(native):
    decoder = capstone.Cs(capstone.CS_ARCH_X86, capstone.CS_MODE_64)
    result = []
    for index, spans in METHODS.items():
        method = native.method(index)
        start = method["address"]
        end = native.addresses[bisect_right(native.addresses, start)]
        lines = [
            f"{ins.address:#x}: {ins.mnemonic} {ins.op_str}".rstrip()
            for ins in decoder.disasm(native.pe.read(start, end - start), start)
            if ins.mnemonic != "int3"
            and (spans is None or any(low <= ins.address < high for low, high in spans))
        ]
        if not lines:
            raise ValueError(f"empty instruction selection for {index}")
        result.append({"method": method, "instructions": lines})
    owners = {
        "Torappu.Battle.Action.Nodes/EmitProjectile": {"_dealHitTargetAfterCreate", "_forceDealHitTarget"},
        "Torappu.Battle.Action.Nodes/ModifySpData": {"_onlyUpdateSpCost", "_spCostString"},
        "Torappu.Battle.Action.Nodes/NoSourceDamage": {"_isNotChangeableValue"},
        "Torappu.SpData": {"spType", "spCost"},
    }
    fields = {
        name: [field for field in native.fields(row["index"]) if field["name"] in owners[name]]
        for row in native.types
        if (name := native.typename(row["index"])) in owners
    }
    return {"methods": result, "fields": fields, "blockDamageXrefs": native.xrefs(0x180729150)}


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
    assets, prefabs = extract_prefabs(args.game / "Arknights_Data/StreamingAssets/AB/Windows")
    config_sources, config = extract_tables()
    provenance = {
        "collectedOn": "2026-11-22", "client": provenance["client"],
        "tool": [fingerprint(Path(__file__)), provenance["tool"]["script"]],
        "assets": assets, "config": config_sources,
    }
    result = {"prefabs": prefabs, "config": config, "native": extract_native(native)}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps({"provenance": provenance, "result": result}, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()
