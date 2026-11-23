# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Extract the explicit Deck sort bindings and the native list update."""

import argparse
from hashlib import sha256
import json
from pathlib import Path
from subprocess import check_output
import sys

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT / ".agents/skills/arkbattle-native-research/scripts"))
from native import DEFAULT_GAME, Native, fingerprint

sys.path.insert(0, str(ROOT / "docs/research/evidence/special-redeploy-failure-20261122"))
from extract_prefab import SCRIPTS, bundle, read_bindings, script, serialized

REVISION = "17759cc8cdf37388414145d16262a3a06f3ab25e"
BUFF_TABLE = "zh_CN/gamedata/battle/buff_template_data.json"
DLL_SHA = "cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff"
METADATA_SHA = "e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5"
CHARACTER = "charpack/char_1045_svash2.ab"
SKILLS = "battle/prefabs/[uc]skills.ab"
BUNDLES = {
    CHARACTER: "4da58c3993d531490f90faa511dd8e0b314e89ffd5d081b1efb3b09d5f59130b",
    SKILLS: "0d0b4c0f9252c14a69a20d4bea09527403dd3eddfc2f7bcd757c3c30cf37ffc3",
    SCRIPTS: "10fca9cc0cc0fde445e5133c004ef08f776640fb99440e3cb8949fa7d9541c99",
}

SPANS = {
    64017: ((0x180602408, 0x180602436),),
    64020: ((0x180602917, 0x180602925),),
    64106: ((0x1805FF7DB, 0x1805FF7EF),),
    64125: ((0x1805FF532, 0x1805FF551),),
    65712: ((0x180660856, 0x180660869), (0x1806608D0, 0x1806608DA),
            (0x180660966, 0x1806609A9), (0x180660AB7, 0x180660ABC)),
    66727: ((0x1806FF3FC, 0x1806FF405),),
    66761: ((0x1806FACBE, 0x1806FACFE), (0x1806FAD47, 0x1806FAD5D)),
    66772: ((0x1806FA4F1, 0x1806FA500),),
    66783: ((0x1806F8AD7, 0x1806F8B17),),
    66784: ((0x1806FC91D, 0x1806FC92F), (0x1806FCA17, 0x1806FCA4B),
            (0x1806FCAC0, 0x1806FCAEE), (0x1806FCB1F, 0x1806FCB38)),
    66789: ((0x1806FCBCA, 0x1806FCBDC),),
    66867: ((0x1806ECE7F, 0x1806ECE92),),
    66869: ((0x1806F11A1, 0x1806F11C3), (0x1806F120C, 0x1806F122C)),
    67092: None,
    67639: ((0x180722617, 0x180722633),),
    67653: ((0x18072A480, 0x18072A494),),
    77291: ((0x180A9E2B2, 0x180A9E2B2),),
    77340: ((0x180AA33F0, 0x180AA33FE), (0x180AA34D0, 0x180AA34D8)),
    84114: None,
    96387: ((0x181010C35, 0x181010C3F), (0x181010C54, 0x181010CBB)),
    96395: ((0x18100C6B0, 0x18100C70F),),
    98776: ((0x1810D92EE, 0x1810D9308),),
    99407: None,
}


def sort_nodes(value, path=""):
    if isinstance(value, dict):
        if value.get("$type") == "Torappu.Battle.Action.Nodes+SortDeck, Assembly-CSharp":
            yield {"path": path, "node": value}
        for key, item in value.items():
            yield from sort_nodes(item, f"{path}/{key}")
    elif isinstance(value, list):
        for index, item in enumerate(value):
            yield from sort_nodes(item, f"{path}/{index}")


def types_of(nodes):
    return [node["$type"] for node in nodes]


def config_evidence():
    data = check_output(["git", "show", f"{REVISION}:{BUFF_TABLE}"],
                        cwd=ROOT / "assets/arknights-game-data")
    table = json.loads(data)
    events = table["svash2_s_3"]["eventToActions"]
    child = events["ON_BUFF_START"][4]["_succeedNodes"][0]
    sort_once = table["svash2_s_3[sort_once]"]["eventToActions"]
    deck_buff = table["svash2_s_3[deck_build]"]["eventToActions"]
    return {
        "source": {"revision": REVISION, "path": BUFF_TABLE,
                   "bytes": len(data), "sha256": sha256(data).hexdigest()},
        "explicitSortNodes": list(sort_nodes(table)),
        "sortOnceInstallation": {
            "path": "/svash2_s_3/eventToActions/ON_BUFF_START/4/_succeedNodes/0",
            "node": child,
        },
        "sortOnceEvents": {event: types_of(nodes) for event, nodes in sort_once.items()},
        "swapGrants": sort_once["ON_BUFF_START"][0]["_deckBuff"]["buff"]["templateKey"],
        "swapFollowup": deck_buff["ON_BUFF_START"],
        "skillEndActions": {event: types_of(events[event])
                            for event in ("ON_BUFF_FINISH", "ON_OWNER_FINISH")},
    }


def selected_body(native, index, spans):
    body = native.disassemble(index)
    if spans is not None:
        instructions = body.pop("instructions")
        selections = []
        for lo, hi in spans:
            rows = [row for row in instructions if lo <= int(row["address"], 16) <= hi]
            if not rows:
                branch = native.disassemble_at(lo, hi - lo + 15)
                rows = [row for row in branch["instructions"] if int(row["address"], 16) <= hi]
            if not rows:
                raise ValueError(f"method {index} has no decoded instructions in {lo:#x}–{hi:#x}")
            selections.extend(rows)
        body["selectedInstructions"] = selections
    return body


def prefab_evidence(game):
    root = game / "Arknights_Data/StreamingAssets/AB/Windows"
    inputs = {path: fingerprint(root / path) for path in BUNDLES}
    if any(inputs[path]["sha256"] != digest for path, digest in BUNDLES.items()):
        raise ValueError("bundle fingerprint differs from the evidence input")
    scripts = {(file, row["id"]): script(row, data)
               for file, data in bundle(root / SCRIPTS)[0]
               if not file.endswith((".resS", ".resource"))
               for row in serialized(data)["objects"] if row["classid"] == 115}
    talent = read_bindings(root / CHARACTER, "CAB-b5a36193fd0e7e01a20cd497ceb83a97", [
        ("Svash2DeckAuraBehaviour", -2811945632205488851, ("_overrideId", "_compareType")),
    ], scripts)
    skill = read_bindings(root / SKILLS, "CAB-e39773c4d1462aefe0ea30134bbccdbb", [
        ("ActiveBuffAbility", 465448942424363708, ("_buffs",)),
    ], scripts)
    fields = skill["components"]["ActiveBuffAbility"]["fields"]
    fields["_buffs"] = [{key: buff[key] for key in ("buffKey", "templateKey", "loadFromDB")}
                        for buff in fields["_buffs"]["Array"]]
    return {"inputs": inputs, "talent": talent, "skill": skill}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()

    native = Native(args.game)
    provenance = native.provenance()
    client = provenance["client"]
    if (client["dll"]["sha256"], client["metadata"]["sha256"]) != (DLL_SHA, METADATA_SHA):
        raise ValueError("client fingerprint differs from the evidence input")
    decl = native.method(66727)["declaringType"]
    fields = [f for f in native.fields(decl) if f["name"] in (
        "m_cards", "m_shouldSortThisFrame", "m_shouldSortDeckAfterCostChange",
    )]
    result = {"configuration": config_evidence(), "prefabs": prefab_evidence(args.game),
              "deckFields": fields,
              "methods": [selected_body(native, index, spans) for index, spans in SPANS.items()]}
    args.out.write_text(json.dumps({"provenance": provenance, "result": result},
                                   ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()
