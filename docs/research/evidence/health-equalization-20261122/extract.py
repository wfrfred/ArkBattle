# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Extract the actual 魔王 S3 bindings and HP equalization implementation."""

import argparse
import importlib.util
import json
from hashlib import sha256
from pathlib import Path
from subprocess import check_output
import sys

import capstone

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT / ".agents/skills/arkbattle-native-research/scripts"))
from native import DEFAULT_GAME, Native, fingerprint
from unity_assets import Reader, bundle, script, serialized

DECODER = ROOT / "docs/research/evidence/nymph-action-settlement-20261103/projectile/decode_projectile.py"
REVISION = "17759cc8cdf37388414145d16262a3a06f3ab25e"
SKILL = "skchr_cetsyr_3"
CHARACTER = "char_4134_cetsyr"
TEMPLATES = {
    "cetsyr_s_3", "cetsyr_s_3[collect_hp_ratio]", "cetsyr_s_3[record_cur_hp_ratio]",
    "cetsyr_s_3[cal_hp_ratio]", "cetsyr_s_3[set_hp_ratio]",
}


def configuration():
    files = ("excel/character_table.json", "excel/skill_table.json")
    contents = [
        check_output(["git", "-C", ROOT / "assets/arknights-game-data",
                      "show", f"{REVISION}:zh_CN/gamedata/{path}"])
        for path in files
    ]
    characters, skills = map(json.loads, contents)
    skills_ids = [item["skillId"] for item in characters[CHARACTER]["skills"]]
    assert skills_ids[2] == SKILL
    level = skills[SKILL]["levels"][0]
    return {
        "revision": REVISION,
        "files": [
            {"path": f"zh_CN/gamedata/{path}", "bytes": len(raw),
             "sha256": sha256(raw).hexdigest()}
            for path, raw in zip(files, contents)
        ],
    }, {
        "character": CHARACTER, "skillIndex": 2, "skillId": SKILL,
        "skillName": level["name"], "description": level["description"],
    }


def prefab_bindings(base, update):
    shared = base / "anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin"
    spec = importlib.util.spec_from_file_location("cetsyr_typetree", DECODER)
    decoder = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(decoder)
    scripts = {
        (file, obj["id"]): script(obj, data)
        for file, data in bundle(shared)[0] if not file.endswith((".resS", ".resource"))
        for obj in serialized(data)["objects"] if obj["classid"] == 115
    }
    selected = {
        base / "charpack/char_4134_cetsyr.ab": (
            "CAB-ece02e2b7d2fa263aa15adeba5aeb24f", -8492696783154872102,
        ),
        update / "battle/prefabs/[uc]skills.ab": (
            "CAB-e39773c4d1462aefe0ea30134bbccdbb", 5353210746435603503,
        ),
    }
    result = []
    for path, (file, path_id) in selected.items():
        data = dict(bundle(path)[0])[file]
        objects = {obj["id"]: obj for obj in serialized(data)["objects"]}
        layouts, externals = decoder.trees(data)

        def raw(path_id):
            obj = objects[path_id]
            return data[obj["start"]:obj["start"] + obj["size"]]

        def decode(path_id):
            return decoder.decode(raw(path_id), layouts[objects[path_id]["typeid"]])

        value = decode(path_id)
        component = value["common:490"]
        script_file = Path(externals[component["m_FileID"] - 1]["path"]).name
        transform_by_owner = {}
        for obj in objects.values():
            if obj["classid"] == 4:
                transform = decode(obj["id"])
                transform_by_owner[transform["common:374"]["m_PathID"]] = transform
        owner = value["common:374"]["m_PathID"]
        hierarchy = []
        while owner:
            go = Reader(raw(owner))
            go.read(go.val("i") * 12)
            go.val("i")
            hierarchy.append({"pathId": str(owner), "name": go.string()})
            father = transform_by_owner[owner]["m_Father"]["m_PathID"]
            owner = decode(father)["common:374"]["m_PathID"] if father else 0
        result.append({
            "bundle": str(path), "file": file, "pathId": str(path_id),
            "objectSha256": sha256(raw(path_id)).hexdigest(),
            "hierarchy": hierarchy[::-1], "enabled": value["common:349"],
            "script": scripts[script_file, component["m_PathID"]],
            "passives": [
                {key: buff[key] for key in (
                    "buffKey", "templateKey", "triggerInterval", "firstTriggerInterval",
                    "waitFirstTriggerInterval", "blackboard",
                )}
                for buff in value["_passiveBuffs"]["Array"] if buff["templateKey"] in TEMPLATES
            ],
        })
        if path.name.startswith("char_"):
            unit_id = 1493490605794099418
            modes = decode(unit_id)["_modes"]["Array"]
            mode_id = modes[3]["m_PathID"]
            mode_owner = decode(mode_id)["common:374"]["m_PathID"]
            assert str(mode_owner) in [node["pathId"] for node in hierarchy]
            result[-1]["character"] = {"pathId": str(unit_id), "modeIndex": 3, "modePathId": str(mode_id)}
    return [fingerprint(path) for path in (*selected, shared, DECODER)], result


def installed_templates(holder):
    selections = {}
    for file, data in bundle(holder)[0]:
        if file.endswith((".resS", ".resource")):
            continue
        for obj in serialized(data)["objects"]:
            if obj["classid"] != 114:
                continue
            reader = Reader(data[obj["start"]:obj["start"] + obj["size"]], p=28)
            reader.string()
            for _ in range(reader.val("i")):
                key = reader.string()
                reader.string()
                reader.val("i")
                events = []
                for _ in range(reader.val("i")):
                    event, program = reader.val("i"), reader.string()
                    reader.read(reader.val("i") * 12)
                    if key in TEMPLATES:
                        events.append({"event": event, "program": json.loads(program)})
                if key in TEMPLATES:
                    selections[key] = {"file": file, "pathId": str(obj["id"]), "events": events}
    assert set(selections) == TEMPLATES
    return selections


def native_evidence(client):
    method = client.method(102136)
    start = method["address"]
    stop = client.method(102137)["address"]
    assert start == 0x1811FC7F0 and stop == 0x1811FCB80
    raw = client.pe.read(start, stop - start)
    decoder = capstone.Cs(capstone.CS_ARCH_X86, capstone.CS_MODE_64)
    decoder.detail = True
    instructions = []
    for instruction in decoder.disasm(raw, start):
        line = {"address": hex(instruction.address), "mnemonic": instruction.mnemonic,
                "operands": instruction.op_str}
        if instruction.mnemonic == "call" and instruction.operands[0].type == capstone.x86.X86_OP_IMM:
            target = instruction.operands[0].imm
            line["methods"] = [
                client.method(index)["fullname"] for index in client.address_methods.get(target, [])
            ]
        instructions.append(line)
    return {"method": method, "bytesSha256": sha256(raw).hexdigest(), "instructions": instructions}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", type=Path, required=True)
    arguments = parser.parse_args()
    client = Native(arguments.game)
    provenance = client.provenance()
    client_records = provenance["client"]
    assert client_records["dll"]["sha256"] == "cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff"
    assert client_records["metadata"]["sha256"] == "e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5"
    install = arguments.game / "Arknights_Data"
    update = install / "PersistentData/Bundles"
    assets, prefabs = prefab_bindings(install / "StreamingAssets/AB/Windows", update)
    holder = update / "config/buff_template_holder.ab"
    config_sources, config = configuration()
    evidence = {
        "provenance": {
            "collectedOn": "2026-11-22", "scope": "Installed static assets and normal native branches.",
            "client": client_records, "tool": provenance["tool"],
            "assets": [*assets, fingerprint(holder)], "config": config_sources,
        },
        "result": {
            "config": config, "prefabs": prefabs, "templates": installed_templates(holder),
            "native": native_evidence(client),
        },
    }
    arguments.out.parent.mkdir(parents=True, exist_ok=True)
    arguments.out.write_text(json.dumps(evidence, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()
