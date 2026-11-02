#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Extract only HP healing formula/receive gaps, reusing archived generic Modifier settlement."""
import argparse
import bisect
import importlib.util
import json
from pathlib import Path


SELECTORS = {
    "Torappu.Battle.BattleFormula.CalculateHeal",
    "Torappu.Battle.Modifier.get_isHeal",
    "Torappu.Battle.Modifier.get_finalDelta",
    "Torappu.Battle.Entity.OnTakeHeal",
    "Torappu.Battle.Buff.OnAfterOutputHeal",
}
EXPECTED = {
    "dll": "cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff",
    "metadata": "e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5",
}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--game", type=Path, default=Path("/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game"))
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    tool = Path.cwd() / ".agents/skills/arkbattle-native-research/scripts/native.py"
    spec = importlib.util.spec_from_file_location("arkbattle_native", tool)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    native = module.Native(args.game)
    provenance = native.provenance()
    for name, digest in EXPECTED.items():
        if provenance["client"][name]["sha256"] != digest:
            raise ValueError(f"client {name} differs from this case's inputs")
    provenance["location"]["modules"] = {
        "Assembly-CSharp.dll": native.modules["Assembly-CSharp.dll"],
    }
    provenance["caseTool"] = {
        "script": module.fingerprint(Path(__file__)),
        "lock": module.fingerprint(Path(str(Path(__file__)) + ".lock")),
    }
    methods = []
    for row in native.methods:
        name = native.typename(row["declaringType"]) + "." + native.string(row["nameIndex"])
        if name in SELECTORS:
            methods.append(native.method(row["index"]))
    missing = SELECTORS - {method["fullname"] for method in methods}
    if missing:
        raise ValueError(f"selectors absent in current metadata: {sorted(missing)}")
    bodies = []
    for method in methods:
        cursor = method["address"]
        logical_end = native.addresses[bisect.bisect_right(native.addresses, cursor)]
        fragments = []
        while cursor < logical_end:
            body = native.disassemble_at(cursor, logical_end - cursor, method=method if cursor == method["address"] else None)
            for instruction in body["instructions"]:
                aliases = instruction.get("methods", [])
                if len(aliases) > 100:
                    instruction["methodAliasCount"] = len(aliases)
                    del instruction["methods"]
            fragments.append(body)
            following = int(body["end"], 16)
            if following <= cursor:
                raise RuntimeError("native fragment did not advance")
            cursor = following
        bodies.append({
            "methodIndex": method["index"],
            "logicalEnd": hex(logical_end),
            "boundary": "consecutive pdata fragments up to next known native method",
            "fragments": fragments,
        })
    modifier = next(row for row in native.types if native.typename(row["index"]) == "Torappu.Battle.Modifier")
    fields = [field for field in native.fields(modifier["index"]) if field["name"] in ("m_value", "realDelta")]
    fp_type = next(t for t in native.types if native.typename(t["index"]) == "Torappu.FP")
    result = {
        "formulaZeroField": [f for f in native.fields(fp_type["index"]) if f["static"] and f["offset"] == 0x38],
        "selectors": sorted(SELECTORS),
        "methods": methods,
        "bodies": bodies,
        "modifierFields": {
            "typeIndex": modifier["index"],
            "fullname": "Torappu.Battle.Modifier",
            "valueType": bool(modifier["bitfield"] & 1),
            "fields": fields,
        },
    }
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps({"provenance": provenance, "result": result}, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"out": str(args.out), "methods": [{"index": method["index"], "fullname": method["fullname"], "address": hex(method["address"])} for method in methods]}))


if __name__ == "__main__":
    main()
