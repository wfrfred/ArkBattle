#!/usr/bin/env python3
"""Select byte-fingerprinted existing native and prefab evidence for classification."""
import argparse
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[5]
BASE = ROOT / "docs/research/evidence"


def fingerprint(path):
    raw = path.read_bytes()
    return {"path": path.relative_to(ROOT).as_posix(), "bytes": len(raw),
            "sha256": hashlib.sha256(raw).hexdigest()}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path, default=Path(__file__).with_name("selected-evidence.json"))
    args = parser.parse_args()
    sources = []

    def load(relative):
        path = BASE / relative
        sources.append(fingerprint(path))
        return json.loads(path.read_text())

    identity = load("unit-classification-20261114/identity/native.json")
    terrain = load("unit-audit-20261110/control-terrain/components.json")
    prison = load("damage-output-order-20261103/prison/decoded-content.json")
    summons = load("leithanien-summons-20261109/content/prefabs.json")
    configuration = load("unit-audit-20261110/control-terrain/configuration.json")
    character_path = ROOT / ".cache/native-research/unit-audit-20261110/operator-config/character_table.json"
    characters = json.loads(character_path.read_text())
    character_source = fingerprint(character_path)
    assert character_source["sha256"] == "e523c7c83c36e2d76697121079e17d0282da1a94d59a55e1cc55616edf0b41c4"
    character_source.update(revision="17759cc8cdf37388414145d16262a3a06f3ab25e",
                            url="https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/17759cc8cdf37388414145d16262a3a06f3ab25e/zh_CN/gamedata/excel/character_table.json")
    sources.append(character_source)
    character_names = [{"pointer": "/" + key,
                        "values": {field: characters[key][field] for field in ["name", "profession", "subProfessionId"]}}
                       for key in ["trap_042_tidectrl", "trap_098_mire", "trap_317_ubprison"]]
    rows = []

    def select(source, pointer, row):
        value = row["value"]
        return {"source": source, "pointer": pointer,
                "identity": {key: row[key] for key in row if key != "value"},
                "values": {key: value[key] for key in ["common:490", "_sideType", "_sideTypeIndex", "_category", "_filterTag"] if key in value}}

    for index in [42, 72]:
        rows.append(select("unit-audit-20261110/control-terrain/components.json", f"/result/{index}", terrain["result"][index]))
    rows.append(select("damage-output-order-20261103/prison/decoded-content.json", "/result/0", prison["result"][0]))
    for index, row in enumerate(summons["result"]["components"]):
        if row.get("scriptBinding", {}).get("value", {}).get("cl") == "Enemy":
            rows.append(select("leithanien-summons-20261109/content/prefabs.json", f"/result/components/{index}", row))
    levels = [{"source": "unit-audit-20261110/control-terrain/configuration.json",
               "pointer": f"/result/levelSelections/{index}", "selection": row}
              for index, row in enumerate(configuration["result"]["levelSelections"])
              if "trap_042_tidectrl" in json.dumps(row)]
    enums = [row for row in identity["result"]["enums"]
             if row["fullname"] in ["Torappu.Battle.SideType", "Torappu.Battle.SideTypeIndex"]]
    assembly = []
    for relative, addresses in [
        ("card-source-identity-20261111/deployment/native/BuildAt-77239.asm", (0x180a9d537, 0x180a9d553)),
        ("card-source-identity-20261111/deployment/native/_BuildAtInternal-77293.asm", (0x180aaafa2, 0x180aaafdd)),
    ]:
        path = BASE / relative
        sources.append(fingerprint(path))
        lines = [line for line in path.read_text().splitlines()
                 if line.startswith("0x") and addresses[0] <= int(line.split(":", 1)[0], 16) < addresses[1]]
        assembly.append({"source": relative, "range": [hex(x) for x in addresses], "lines": lines})
    payload = {
        "provenance": {"collectedOn": "2026-11-18", "script": fingerprint(Path(__file__)),
                       "sources": sources, "scope": "Targeted reuse of existing exact component and native evidence; no client execution or exhaustive prefab scan."},
        "result": {"sideEnums": enums, "components": rows, "levelBindings": levels,
                   "characterNames": character_names,
                   "buildSideSnippets": assembly,
                   "limits": ["The excluded sandbox factory is not used as a supported-content example.",
                              "The prison MonoScript PPtr matches the resolved Trap binding in the same installed bundle; raw object and sources remain in the original evidence.",
                              "Prefab side is an initialization policy, not a guarantee that later content cannot change current side.",
                              "A nonempty Trap FilterTag exists in an actual visible supported level controller; this does not enumerate all tag consumers."]}}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"out": str(args.out), "components": len(rows), "levelBindings": len(levels)}))


if __name__ == "__main__":
    main()
