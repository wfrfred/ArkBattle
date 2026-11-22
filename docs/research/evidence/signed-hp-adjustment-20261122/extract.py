# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
import argparse
import importlib.util
import json
from pathlib import Path
from subprocess import check_output
import sys

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[4]
EVIDENCE = ROOT / "docs/research/evidence"
TRACE = EVIDENCE / "resource-mechanisms-20261114/damage/trace_flags.py"
REVISION = "17759cc8cdf37388414145d16262a3a06f3ab25e"
sys.path.insert(0, str(ROOT / ".agents/skills/arkbattle-native-research/scripts"))
from native import DEFAULT_GAME, Native, fingerprint

WINDOWS = {
    102136: [(0x1811FCA50, 0x1811FCA90), (0x1811FCAE9, 0x1811FCB2A)],
    69565: [(0x18082D60D, 0x18082D6DB), (0x18082D897, 0x18082D8E7),
            (0x18082D93E, 0x18082D968), (0x18082DEEC, 0x18082DF60),
            (0x18082E1E3, 0x18082E25F), (0x18082E4F0, 0x18082E58C)],
    72184: [(0x18090AFE7, 0x18090B07C)],
    67665: [(0x180721266, 0x1807212D1), (0x180721348, 0x180721424),
            (0x1807218B8, 0x1807218E5), (0x18072196D, 0x18072199E),
            (0x180721AFF, 0x180721B47)],
    67667: [],
    67683: [(0x18072335A, 0x18072337F), (0x1807233F6, 0x180723430)],
    67625: [(0x18072EB79, 0x18072EB8B), (0x18072ED48, 0x18072ED86),
            (0x18072EF15, 0x18072EF43), (0x18072EFAF, 0x18072EFD6),
            (0x18072F023, 0x18072F034), (0x18072F186, 0x18072F19F),
            (0x18072F275, 0x18072F2D1)],
    67669: [(0x180727D71, 0x180727D92), (0x180727DFC, 0x180727E11),
            (0x18072821B, 0x180728235)],
    106903: [(0x18137305C, 0x181373092), (0x1813730B6, 0x1813730EB),
             (0x181373110, 0x181373145)],
    106913: [(0x181375418, 0x1813754D0)],
    106914: [(0x181374D85, 0x181374DB9), (0x181374E8B, 0x181374EBE)],
}


def configuration():
    assets = ROOT / "assets/arknights-game-data"
    paths = ("excel/battle_equip_table.json", "battle/buff_template_data.json")
    equip, templates = [json.loads(check_output([
        "git", "-C", str(assets), "show", f"{REVISION}:zh_CN/gamedata/{path}",
    ])) for path in paths]
    module = equip["uniequip_003_slent2"]
    phases = []
    for phase in module["phases"]:
        for part in phase["parts"]:
            if part["resKey"] in ("slent2_equip_2_2_p2", "slent2_equip_2_3_p2"):
                phases.append({"level": phase["equipLevel"], "part": part})
    prefab_path = EVIDENCE / "reception-stages-20261115/content/resource-search.json"
    resource_hits = json.loads(prefab_path.read_text())["result"]["hits"]
    resources = {phase["part"]["resKey"] for phase in phases}
    matches = [
        {key: item[key] for key in ("bundle", "file", "pathId", "objectSha256", "hierarchy",
                                    "scriptPPtr", "scriptFile", "references")}
        for item in resource_hits
        if len(item["hierarchy"]) == 1 and item["hierarchy"][0] in resources
        and any(ref["templateKey"] == "slent2_e_003_t2" for ref in item["references"])
    ]
    if len(phases) != 2 or len(matches) != 2:
        raise ValueError("Silence upgrade data and prefab selection must each match Y2/Y3")
    programs = templates["slent2_e_003_t2"]["eventToActions"]
    return {
        "sourceRevision": REVISION, "tablePaths": paths, "previousPrefabArchive": fingerprint(prefab_path),
        "module": "uniequip_003_slent2", "phases": phases, "prefabBindings": matches,
        "programs": {name: programs[name] for name in ("ON_APPLYING_MODIFIER", "ON_APPLYING_SKIPPED_MODIFIER")},
    }


def entity_events(native):
    owner = next(item for item in native.types
                 if native.typename(item["index"]) == "Torappu.Battle.Entity/Event")
    defaults = {row["fieldIndex"]: row for row in
                native.records(7, "<iii", "fieldIndex typeIndex dataIndex")}
    start, _ = native.table(8)
    result = []
    for field in native.fields(owner["index"]):
        if field["index"] not in defaults:
            continue
        offset = start + defaults[field["index"]]["dataIndex"]
        byte = native.metadata[offset]
        if byte < 128 and (byte >> 1) in (8, 9, 10, 11, 12, 13, 14):
            result.append({"field": field["name"], "index": field["index"],
                           "encoded": hex(byte), "value": byte >> 1})
    return result


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", type=Path, required=True)
    arguments = parser.parse_args()

    expected_path = EVIDENCE / "health-equalization-20261122/result.json"
    expected = json.loads(expected_path.read_text())["provenance"]["client"]
    native = Native(arguments.game)
    provenance = native.provenance()
    for role in ("dll", "metadata"):
        if provenance["client"][role]["sha256"] != expected[role]["sha256"]:
            raise ValueError(f"different client {role}; re-identify native windows")

    trace_spec = importlib.util.spec_from_file_location("trace_flags", TRACE)
    trace = importlib.util.module_from_spec(trace_spec)
    trace_spec.loader.exec_module(trace)
    literals = native.records(0, "<II", "length dataIndex")
    string_data, _ = native.table(1)
    bodies, subscriptions, phase_literals = [], [], []

    for index, windows in WINDOWS.items():
        method = native.method(index)
        segments = trace.full_body(native, method)["fragments"]
        rows = [row for segment in segments for row in segment["instructions"]]
        excerpts = [[row for row in rows if start <= int(row["address"], 16) < end]
                    for start, end in windows]
        if index == 67667:
            excerpts = [rows[offset - 5:offset + 1] for offset, row in enumerate(rows)
                        if "Torappu.Battle.Entity.EmitEvent" in row.get("methods", [])]
        if index in (106903, 69565):
            for row in rows:
                for slot in row.get("ripReferences", []):
                    try:
                        encoded, = native.pe.unpack("<Q", int(slot, 16))
                    except (StopIteration, ValueError):
                        continue
                    if encoded >= 2**32 or not encoded & 1:
                        continue
                    kind = encoded >> 29
                    item = encoded >> 1 & 0xfffffff
                    usage = {"instruction": row["address"], "slot": slot, "encoded": hex(encoded)}
                    if index == 106903 and kind == 3 and item in (106913, 106914):
                        subscriptions.append({**usage, "method": native.method(item)})
                    if index == 69565 and kind == 5 and item < len(literals):
                        literal = literals[item]
                        start = string_data + literal["dataIndex"]
                        value = native.metadata[start:start + literal["length"]].decode()
                        phase_literals.append({**usage, "value": value})
        bodies.append({"method": method, "excerpts": excerpts})

    arguments.out.parent.mkdir(parents=True, exist_ok=True)
    arguments.out.write_text(json.dumps({
        "provenance": {"collectedOn": "2026-11-22", "scope": provenance["scope"],
                       "client": provenance["client"], "tool": provenance["tool"],
                       "caseTool": fingerprint(Path(__file__)), "rangeReader": fingerprint(TRACE)},
        "result": {"native": bodies, "hudDelegates": subscriptions, "entityEvents": entity_events(native),
                   "suiStringLiterals": phase_literals, "silenceY": configuration()},
    }, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()
