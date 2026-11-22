# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Re-extract selected movement and repeater skill bindings from the installed client."""

import argparse
from bisect import bisect_right
from hashlib import sha256
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


SNAPSHOT = "bffe31bf66739842f99b457327066c695e2af389"
SKILLS = ("skchr_ulpia_3", "skchr_monstr_3", "skchr_kalts2_3", "skchr_aphris_3")
TEMPLATES = {
    "ulpia_s3_hp_ratio_sync", "ulpia_s3_respawn_buff", "ulpia_s3_restore",
    "monstr_s_3[sync_hp]", "monstr_s_3_buff[respawn]", "monstr_s_3[restore_mode]",
    "monstr_s_3[route]", "monstr_s_3[reborned_passive]",
    "aphris_sk3[token-withdraw]", "aphris_sk3[on_finish]",
    "kalts2_s_3[withdraw]", "kalts2_s_3[restore]",
}
PREFABS = {
    "charpack/char_4145_ulpia.ab": {361761531358409182, 2172895230037848542, 2516051002928001502},
    "charpack/char_4179_monstr.ab": {267648895035992040, 1617163052631877608, 7177902086600812520},
    "battle/prefabs/[uc]skills.ab": {
        -3750018467266955814, 1657737257676205052, 916522204719311868,
        875698991745679599, -5427451279434235665, -2859062326968680928,
    },
}
SPANS = {
    66746: [(0x1806f9df0, 0x1806f9e1d)],
    67088: [(0x18071d5b7, 0x18071d5cb), (0x18071d610, 0x18071d621), (0x18071d6b0, 0x18071d717)],
    67089: [(0x18071c650, 0x18071c668), (0x18071c6a8, 0x18071c6b7), (0x18071c758, 0x18071c770),
            (0x18071c7ad, 0x18071c7bb), (0x18071c85f, 0x18071c86d), (0x18071c8f1, 0x18071c969)],
    72168: [(0x18090c010, 0x18090c0a5)],
    74295: [(0x1809b9680, 0x1809b96f5)],
    74450: [(0x1809d33c0, 0x1809d35e0)],
    74456: [(0x1809d4354, 0x1809d4376), (0x1809d43b1, 0x1809d4407), (0x1809d44d1, 0x1809d4551)],
    77257: [(0x180a9f799, 0x180a9f7f4)],
    77285: [(0x180aa1bfe, 0x180aa1c63)],
    77287: [(0x180aac45e, 0x180aac4a7), (0x180aac4e0, 0x180aac57b)],
    80433: [(0x180b72eac, 0x180b72f3a)],
    80435: [(0x180b70cd2, 0x180b70d59), (0x180b70da3, 0x180b70dc0)],
    86845: [(0x180d65619, 0x180d65740), (0x180d658a4, 0x180d65939)],
    99367: [(0x1811019eb, 0x181101a58), (0x181101afc, 0x181101ba2)],
    101247: [(0x1811bc4b7, 0x1811bc4e7)],
    102387: [(0x1812192a7, 0x1812192f4), (0x181219331, 0x181219440), (0x18121944f, 0x181219584)],
}


def walk(value):
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from walk(child)
    elif isinstance(value, list):
        for child in value:
            yield from walk(child)


def native_evidence(native):
    decoder = capstone.Cs(capstone.CS_ARCH_X86, capstone.CS_MODE_64)
    decoder.detail = True
    evidence = []
    for index, spans in SPANS.items():
        method = native.method(index)
        start = method["address"]
        end = native.addresses[bisect_right(native.addresses, start)]
        lines = []
        for instruction in decoder.disasm(native.pe.read(start, end - start), start):
            if not any(low <= instruction.address < high for low, high in spans):
                continue
            line = f"{instruction.address:#x} {instruction.mnemonic} {instruction.op_str}".rstrip()
            if (instruction.mnemonic in {"call", "jmp"} and instruction.operands
                and instruction.operands[0].type == capstone.x86.X86_OP_IMM):
                aliases = native.address_methods.get(instruction.operands[0].imm, [])
                if aliases:
                    line += " ; " + ", ".join(native.method(i)["fullname"] for i in aliases[:2])
            lines.append(line)
        assert lines, method
        evidence.append({"method": method, "instructions": lines})
    names = {native.typename(t["index"]): t["index"] for t in native.types}
    fields = {}
    for name, selected in (
        ("Torappu.Battle.Deck/Card", {"m_remainingCnt", "m_queuedRespawnCnt"}),
        ("Torappu.Battle.Deck/TokenCard", {"<maxDeployCnt>k__BackingField", "<maxDeckStackCnt>k__BackingField"}),
        ("Torappu.Battle.Action.Nodes/FetchHpToBlackboard", {"_isHpRatio", "_skipModifierEvent"}),
        ("Torappu.Battle.AutoChess.ChessInst", {"btlCardUid", "<btlCardUid>k__BackingField", "cardUid", "<cardUid>k__BackingField"}),
    ):
        fields[name] = [field for field in native.fields(names[name]) if field["name"] in selected]
    return {"methods": evidence, "fields": fields}


def prefab_evidence(base, decoder_path):
    spec = importlib.util.spec_from_file_location("movement_typetree", decoder_path)
    decoder = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(decoder)
    shared = base / "anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin"
    scripts = {
        (file, obj["id"]): script(obj, data)
        for file, data in bundle(shared)[0] if not file.endswith((".resS", ".resource"))
        for obj in serialized(data)["objects"] if obj["classid"] == 115
    }
    results = []
    for path, selection in PREFABS.items():
        found = set()
        for file, data in bundle(base / path)[0]:
            if file.endswith((".resS", ".resource")):
                continue
            objects = serialized(data)["objects"]
            selected = [obj for obj in objects if obj["id"] in selection]
            if not selected:
                continue
            layouts, externals = decoder.trees(data)
            for obj in selected:
                raw = data[obj["start"]:obj["start"] + obj["size"]]
                value = decoder.decode(raw, layouts[obj["typeid"]])
                component = value["common:490"]
                script_file = externals[component["m_FileID"] - 1]["path"].split("/")[-1]
                owner = next(o for o in objects if o["id"] == value["common:374"]["m_PathID"])
                owner_data = Reader(data[owner["start"]:owner["start"] + owner["size"]])
                owner_data.read(owner_data.val("i") * 12)
                owner_data.val("i")
                results.append({
                    "bundle": path, "file": file, "pathId": str(obj["id"]),
                    "object": owner_data.string(), "enabled": value["common:349"],
                    "sha256": sha256(raw).hexdigest(), "script": scripts[script_file, component["m_PathID"]],
                    "buffs": [
                        {"template": row["templateKey"], "blackboard": row["blackboard"]["Array"]}
                        for row in walk(value) if row.get("templateKey") in TEMPLATES and "blackboard" in row
                    ],
                    "selectors": {key: value[key] for key in ("_skillProgressBBKey", "_restoreAbility", "_respawnBBKey") if key in value},
                })
                found.add(obj["id"])
        assert found == selection, (path, selection - found)
    holder = base / "config/buff_template_holder.ab"
    templates = []
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
                    templates.append({"key": key, "file": file, "pathId": str(obj["id"]), "events": events})
    assert {row["key"] for row in templates} == TEMPLATES
    sources = [fingerprint(path) for path in (shared, holder, decoder_path, *(base / path for path in PREFABS))]
    return sources, {"components": results, "templates": templates}


def configuration():
    repository = ROOT / "assets/arknights-game-data"
    paths = ("zh_CN/gamedata/excel/character_table.json", "zh_CN/gamedata/excel/skill_table.json")
    contents = [check_output(["git", "-C", repository, "show", f"{SNAPSHOT}:{path}"]) for path in paths]
    characters, skills = map(json.loads, contents)
    bindings = {
        key: [row for row in value["skills"] if row["skillId"] in SKILLS]
        for key, value in characters.items() if any(row["skillId"] in SKILLS for row in value.get("skills", []))
    }
    sources = [{"path": path, "sha256": sha256(raw).hexdigest(), "bytes": len(raw)} for path, raw in zip(paths, contents)]
    return {"revision": SNAPSHOT, "sources": sources}, {
        "characterSlots": bindings,
        "repeaterBonusStock": [
            row for row in skills["skchr_aphris_3"]["levels"][-1]["blackboard"] if row["key"] == "token_recharge_cnt"
        ],
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    native = Native(args.game)
    provenance = native.provenance()
    assert provenance["client"]["dll"]["sha256"] == "cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff"
    assert provenance["client"]["metadata"]["sha256"] == "e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5"
    decoder = ROOT / "docs/research/evidence/nymph-action-settlement-20261103/projectile/decode_projectile.py"
    assets, prefabs = prefab_evidence(args.game / "Arknights_Data/StreamingAssets/AB/Windows", decoder)
    config_sources, config = configuration()
    provenance = {
        "collectedOn": "2026-11-22", "client": provenance["client"], "tool": provenance["tool"],
        "assets": assets, "config": config_sources,
        "scope": "Selected static paths and serialized bindings. No runtime or XLua observation.",
    }
    result = {"native": native_evidence(native), "prefabs": prefabs, "config": config}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps({"provenance": provenance, "result": result}, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()
