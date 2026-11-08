#!/usr/bin/env python3
"""Record the exact Enemy state and finish-reason metadata for the exit chain."""
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
import argparse
import importlib.util
import json
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=Path("/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game"))
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    tool = Path(".agents/skills/arkbattle-native-research/scripts/native.py")
    spec = importlib.util.spec_from_file_location("exit_native", tool)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    native = module.Native(args.game)
    related = [native.typename(t["index"]) for t in native.types
               if native.typename(t["index"]).startswith("Torappu.Battle.Enemy/")]
    names = {"Torappu.Battle.Entity/FinishReason", "Torappu.Battle.Enemy/States", "Torappu.Battle.Enemy/States/State"}
    names.update(name for name in related if name.endswith(("StateType", "StateId", "StateID")))
    defaults = {d["fieldIndex"]: d for d in native.records(7, "<iii", "fieldIndex typeIndex dataIndex")}
    data_base, _ = native.table(8)
    types = []
    for item in native.types:
        fullname = native.typename(item["index"])
        if fullname not in names:
            continue
        fields = native.fields(item["index"])
        for field in fields:
            default = defaults.get(field["index"])
            if default and default["dataIndex"] >= 0:
                raw = native.metadata[data_base + default["dataIndex"]]
                assert raw < 128, "this selection expects a one-byte compressed enum value"
                field["enumDefault"] = {"dataIndex": default["dataIndex"], "encodedByte": raw,
                                        "value": (raw >> 1) ^ -(raw & 1)}
        types.append({"fullname": fullname, "index": item["index"], "fields": fields,
                      "methods": [native.method(i) for i in range(item["methodStart"], item["methodStart"] + item["methodCount"])]})
    methods = []
    for item in native.methods:
        fullname = native.typename(item["declaringType"]) + "." + native.string(item["nameIndex"])
        if any(value in fullname for value in ["OnEnemyReachedExit", "OnEnemyFinished", "OnUnitDestroyed",
                                               "Enemy/States/Reach", "Enemy/States/Finish", "Enemy/States/Disappear"]):
            methods.append(native.method(item["index"]))
    provenance = native.provenance()
    provenance["queryScript"] = module.fingerprint(Path(__file__))
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps({"provenance": provenance,
                                    "result": {"relatedEnemyTypeNames": related, "types": types, "methods": methods}},
                                   ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"types": [item["fullname"] for item in types], "methods": len(methods)}))


if __name__ == "__main__":
    main()
