# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Extract the card and blocker bindings and the identified native branches."""

import argparse
from bisect import bisect_right
from hashlib import sha256
import importlib.util
import json
from pathlib import Path
import struct
from subprocess import check_output
import sys

import capstone

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT / ".agents/skills/arkbattle-native-research/scripts"))
from native import DEFAULT_GAME, Native, fingerprint
from unity_assets import Reader, bundle, script, serialized

REVISION = "17759cc8cdf37388414145d16262a3a06f3ab25e"
DLL_SHA = "cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff"
META_SHA = "e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5"
SHARED = "anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin"
LAYOUT = ROOT / "docs/research/evidence/nymph-action-settlement-20261103/projectile/decode_projectile.py"
COMPONENTS = {
    "charpack/char_496_wildmn.ab": (-3488643510784291281,),
    "battle/prefabs/[uc]equips.ab": (
        -2052492723133430373, 724506915439801841, -1918662421834868884, 7966293647921525027,
    ),
    "battle/prefabs/[uc]skills.ab": (
        4611325026417859596, -1073599293142318865, -4303161870961327889,
        875698991745679599, -5427451279434235665,
    ),
    "pkgrps/btl_pfb_tokens_0.ab": (-5202899342101043299,),
    "battle/enm_pfb_10.ab": (
        -6026862551145620425, 3820378949989932560, -2958871983337808841,
        -6677181239113065417, 1167961754612309520, -2045335621966127600,
    ),
}
TEMPLATES = (
    "wildmn_t_1", "svrash_e_002_t[aura]", "svrash_e_002_tr", "gravel_e_t_10",
    "slent2_s_2", "trigger_charge_token", "aphris_sk3[token-withdraw]", "aphris_sk3[on_finish]",
    "enemy_bloodsucker_block_cnt[control]",
)
SPAN = {
    64020: [(0x1806028A6, 0x1806028B5)],
    64056: [(0x180602F42, 0x180602F5D), (0x180603038, 0x18060305D)],
    65727: [(0x18065D1E2, 0x18065D1F9)],
    65914: [(0x18068735D, 0x180687399), (0x1806873F6, 0x180687405)],
    66009: [(0x1806AFBB4, 0x1806AFBC5)],
    66101: [(0x1806CFAE2, 0x1806CFAFF)],
    66120: [(0x1806D4A0A, 0x1806D4A1D)],
    66126: [(0x1806D554B, 0x1806D556A)],
    66304: [(0x1806C935A, 0x1806C9368)],
    66349: [(0x1806C9CB5, 0x1806C9CBF)],
    66363: [(0x1806CD980, 0x1806CD99A)],
    66755: [(0x1806FD2A6, 0x1806FD2F5), (0x1806FD4A0, 0x1806FD4D8), (0x1806FD567, 0x1806FD5CF)],
    66823: [(0x1806F3537, 0x1806F3599), (0x1806F36FA, 0x1806F37EB)],
    66826: [(0x1806F2360, 0x1806F23CD)],
    66865: [(0x1806EE753, 0x1806EE7B4)],
    66869: [(0x1806F0D2B, 0x1806F0D89), (0x1806F0EB2, 0x1806F0F00), (0x1806F0F70, 0x1806F0FD5),
            (0x1806F1027, 0x1806F103A), (0x1806F1097, 0x1806F10AA),
            (0x1806F111D, 0x1806F1185), (0x1806F124F, 0x1806F13BF), (0x1806F1486, 0x1806F14A3)],
    66882: [(0x1806EB0A0, 0x1806EB0DC)],
    66890: [(0x1806EBE08, 0x1806EBE56)],
    66909: [(0x1806ED798, 0x1806ED7CF)],
    66993: [(0x18071930A, 0x180719388), (0x1807193CF, 0x1807193DF)],
    66996: [(0x180719156, 0x1807191A9)],
    67007: [(0x18071946D, 0x1807194CB)],
    67008: [(0x18071963C, 0x180719688)],
    67009: [(0x18071952D, 0x1807195F0)],
    67016: [(0x180718F06, 0x180718F55), (0x180718FF7, 0x18071905B)],
    67017: [(0x180718C22, 0x180718CB1), (0x180718CF0, 0x180718D12)],
    67018: [(0x180718D6D, 0x180718DED)],
    67038: [(0x1807070D7, 0x1807070F0), (0x18070712A, 0x18070717A)],
    67039: [(0x18070654F, 0x1807065B1)],
    67088: [(0x18071D564, 0x18071D590), (0x18071D610, 0x18071D6C9), (0x18071D6DA, 0x18071D719)],
    67089: [(0x18071C650, 0x18071C668), (0x18071C758, 0x18071C770), (0x18071C8F1, 0x18071C969)],
    67091: [(0x18071D2D3, 0x18071D2E6)],
    67092: [(0x18071D273, 0x18071D285)],
    66742: [(0x1806FBA1C, 0x1806FBA75)],
    77256: [(0x180AA5BD3, 0x180AA5BDE), (0x180AA5C05, 0x180AA5C2E)],
    77332: [(0x180AA393D, 0x180AA394B)],
    77340: [(0x180AA33F0, 0x180AA33FE), (0x180AA34D0, 0x180AA34D8)],
    67549: [(0x18072D353, 0x18072D375)],
    67653: [(0x18072A431, 0x18072A470)],
    78504: [(0x180AEE7D9, 0x180AEE801), (0x180AEEA07, 0x180AEEA11)],
    78505: [(0x180AEE0B0, 0x180AEE125)],
    77745: [(0x180AC255B, 0x180AC260F)],
    93828: [(0x180F8F381, 0x180F8F3A0), (0x180F8F53D, 0x180F8F562)],
    93933: [(0x180F92852, 0x180F928A5)],
    94716: [(0x180FBFFB0, 0x180FBFFCB)],
    94719: [(0x180FC0C26, 0x180FC0C59), (0x180FC0D00, 0x180FC0D5F)],
    98646: [(0x1810D3725, 0x1810D3745)],
    65778: [(0x18064B7DD, 0x18064B841)],
    98739: [(0x1810D0FFA, 0x1810D1020)],
    98706: [(0x1810C5E8A, 0x1810C5F51)],
    101199: [(0x1811BF321, 0x1811BF359)],
}
LITERALS = {
    0x18071930A: (0x188B61EA8, "value"),
    0x180719348: (0x188B08F60, "cost_scale"),
    0x18071936E: (0x188C2DA30, "multiplier_max_offset"),
    0x180718F06: (0x188B72D80, "remaining_respawn_time"),
    0x180718F26: (0x188B7FFE8, "respawn_time_max_mult"),
}


def walk(node):
    if isinstance(node, dict):
        yield node
        for value in node.values():
            yield from walk(value)
    elif isinstance(node, list):
        for value in node:
            yield from walk(value)


def read_assets(base):
    spec = importlib.util.spec_from_file_location("asset_typetree", LAYOUT)
    reader = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(reader)
    paths = [base / SHARED, base / "config/buff_template_holder.ab", *(base / p for p in COMPONENTS)]
    scripts = {
        (name, obj["id"]): script(obj, payload)
        for name, payload in bundle(paths[0])[0] if not name.endswith((".resource", ".resS"))
        for obj in serialized(payload)["objects"] if obj["classid"] == 115
    }
    components = []
    for relative, ids in COMPONENTS.items():
        remaining = set(ids)
        for name, payload in bundle(base / relative)[0]:
            if name.endswith((".resource", ".resS")):
                continue
            objects = {row["id"]: row for row in serialized(payload)["objects"]}
            found = remaining.intersection(objects)
            if not found:
                continue
            layouts, externals = reader.trees(payload)
            for path_id in sorted(found):
                obj = objects[path_id]
                raw = payload[obj["start"]:obj["start"] + obj["size"]]
                layout = [dict(node, type="raw-lifetime") if node["name"] == "lifeTimeType" else node
                          for node in layouts[obj["typeid"]]]
                decoded = reader.decode(raw, layout)
                pointer = decoded["common:490"]
                file = externals[pointer["m_FileID"] - 1]["path"].split("/")[-1]
                owner = objects[decoded["common:374"]["m_PathID"]]
                owner_data = Reader(payload[owner["start"]:owner["start"] + owner["size"]])
                owner_data.read(owner_data.val("i") * 12)
                owner_data.val("i")
                buffs = [
                    {key: value[key] for key in (
                        "templateKey", "durationKey", "lifeTimeType", "lifeTime", "loadFromDB", "blackboard",
                    ) if key in value}
                    for value in walk(decoded) if value.get("templateKey") in TEMPLATES
                ]
                components.append({
                    "bundle": relative, "file": name, "pathId": str(path_id),
                    "sha256": sha256(raw).hexdigest(), "owner": owner_data.string(),
                    "ownerPathId": str(owner["id"]), "enabled": decoded["common:349"],
                    "script": scripts[file, pointer["m_PathID"]]["cl"],
                    "fields": {key: decoded[key] for key in (
                        "_cardPolicy", "_isInfinity", "_rechargeOnlyOnce", "_checker",
                        "_commonAbilities", "_modes", "_ignoreIfOwnerDead",
                        "_abilities", "_wrappedAbilities", "_durationKey", "_alwaysNext",
                    ) if key in decoded},
                    "buffs": buffs,
                })
            remaining -= found
        assert not remaining, (relative, remaining)
    templates = []
    for name, payload in bundle(paths[1])[0]:
        if name.endswith((".resource", ".resS")):
            continue
        for obj in serialized(payload)["objects"]:
            if obj["classid"] != 114:
                continue
            data = Reader(payload[obj["start"]:obj["start"] + obj["size"]], p=28)
            data.string()
            for _ in range(data.val("i")):
                key = data.string()
                data.string()
                data.val("i")
                events = []
                for _ in range(data.val("i")):
                    event, program = data.val("i"), data.string()
                    data.read(data.val("i") * 12)
                    if key in TEMPLATES:
                        events.append({"event": event, "program": json.loads(program)})
                if key in TEMPLATES:
                    templates.append({"key": key, "file": name, "pathId": str(obj["id"]), "events": events})
    assert {row["key"] for row in templates} == set(TEMPLATES)
    return {"sources": [fingerprint(p) for p in [LAYOUT, *paths]], "components": components, "templates": templates}


def read_configuration():
    sources = []
    values = {}
    for name, keys in (
        ("character_table", ("char_496_wildmn", "char_172_svrash", "token_10029_slent2_protrb")),
        ("battle_equip_table", ("uniequip_002_svrash", "uniequip_002_gravel")),
        ("skill_table", ("skchr_aphris_3", "skchr_slent2_2")),
    ):
        path = f"zh_CN/gamedata/excel/{name}.json"
        raw = check_output(["git", "-C", ROOT / "assets/arknights-game-data", "show", f"{REVISION}:{path}"])
        data = json.loads(raw)
        sources.append({"path": path, "sha256": sha256(raw).hexdigest(), "bytes": len(raw)})
        for key in keys:
            row = data[key]
            if name == "character_table":
                row = {k: row.get(k) for k in ("name", "talents", "displayTokenDict")}
            elif name == "skill_table":
                row = row["levels"][-1]["blackboard"]
            else:
                row = [c for phase in row["phases"] for part in phase["parts"]
                       for c in part["addOrOverrideTalentDataBundle"]["candidates"] or []]
            values[key] = row
    spawns = []
    for level, enemy in (
        ("main/level_main_10-08", "enemy_1220_dzoms"),
        ("roguelike/ro4/level_rogue4_b-5", "enemy_1220_dzoms_2"),
    ):
        path = f"zh_CN/gamedata/levels/obt/{level}.json"
        raw = check_output(["git", "-C", ROOT / "assets/arknights-game-data", "show", f"{REVISION}:{path}"])
        level_data = json.loads(raw)
        sources.append({"path": path, "sha256": sha256(raw).hexdigest(), "bytes": len(raw)})
        wave, fragment, action, row = next(
            (i, j, k, action)
            for i, wave in enumerate(level_data["waves"])
            for j, fragment in enumerate(wave["fragments"])
            for k, action in enumerate(fragment["actions"])
            if action["actionType"] == "SPAWN" and action["key"] == enemy and action["count"] > 0
        )
        spawns.append({"path": path, "pointer": f"/waves/{wave}/fragments/{fragment}/actions/{action}", "action": row})
    path = "zh_CN/gamedata/battle/buff_template_data.json"
    raw = check_output(["git", "-C", ROOT / "assets/arknights-game-data", "show", f"{REVISION}:{path}"])
    data = json.loads(raw)
    sources.append({"path": path, "sha256": sha256(raw).hexdigest(), "bytes": len(raw)})
    for key, event in (("nearl2_t_1[mark]", "ON_OWNER_BORN"), ("nearl2_s_2[end]", "ON_BUFF_START")):
        values[key] = {"event": event, "firstAction": data[key]["eventToActions"][event][0]}
    return {"revision": REVISION, "sources": sources, "values": values, "spawns": spawns}


def read_native(native):
    decoder = capstone.Cs(capstone.CS_ARCH_X86, capstone.CS_MODE_64)
    decoder.detail = True
    results = []
    for index, spans in SPAN.items():
        method = native.method(index)
        start = method["address"]
        end = native.addresses[bisect_right(native.addresses, start)]
        assert all(start <= low < high <= end for low, high in spans), (index, spans)
        instructions = []
        for item in decoder.disasm(native.pe.read(start, end - start), start):
            if not any(low <= item.address < high for low, high in spans):
                continue
            line = f"{item.address:#x} {item.mnemonic} {item.op_str}".rstrip()
            if (item.mnemonic in {"call", "jmp"} and item.operands
                and item.operands[0].type == capstone.x86.X86_OP_IMM):
                aliases = native.address_methods.get(item.operands[0].imm, [])
                if aliases:
                    line += " ; " + native.method(aliases[0])["fullname"]
            instructions.append(line)
        assert instructions, index
        results.append({"method": method, "range": [hex(start), hex(end)], "instructions": instructions})
    types = {
        "Torappu.Battle.Deck/Card", "Torappu.Battle.Deck/TokenCard", "Torappu.Battle.Deck",
        "Torappu.Battle.Deck/Card/RemainingRespawnTimeModifier",
        "Torappu.Battle.Deck/Card/RuntimeRespawnTimeModifier", "Torappu.PeriodicTimer",
    }
    fields = {name: [field for field in native.fields(t["index"]) if not field["static"]]
              for t in native.types if (name := native.typename(t["index"])) in types}
    literals = []
    for address, (slot, expected) in LITERALS.items():
        displacement, = native.pe.unpack("<i", address + 3)
        assert address + 7 + displacement == slot
        token, = native.pe.unpack("<Q", slot)
        assert token >> 29 == 5
        index = (token & 0x1FFFFFFF) >> 1
        length, offset = struct.unpack_from("<II", native.metadata, native.table(0)[0] + index * 8)
        start = native.table(1)[0] + offset
        value = native.metadata[start:start + length].decode()
        assert value == expected
        literals.append({"address": hex(address), "slot": hex(slot), "literalIndex": index, "value": value})
    reference_start, reference_end = 0x1853AE780, 0x1853AE7FC
    reference = [f"{x.address:#x} {x.mnemonic} {x.op_str}".rstrip()
                 for x in decoder.disasm(native.pe.read(reference_start, reference_end - reference_start), reference_start)]
    return {"types": fields, "methods": results, "literals": literals, "buffReferenceValidation": reference}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    native = Native(args.game)
    provenance = native.provenance()
    assert provenance["client"]["dll"]["sha256"] == DLL_SHA
    assert provenance["client"]["metadata"]["sha256"] == META_SHA
    result = {
        "provenance": {"client": provenance["client"], "tool": provenance["tool"],
                       "capstone": capstone.__version__, "collectedOn": "2026-11-22",
                       "scope": "Selected static client paths. No live game or XLua."},
        "result": {
            "native": read_native(native),
            "assets": read_assets(args.game / "Arknights_Data/StreamingAssets/AB/Windows"),
            "config": read_configuration(),
        },
    }
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()
