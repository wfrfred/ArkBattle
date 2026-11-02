#!/usr/bin/env python3
"""Extract the native EP controller's trigger, timer and reset methods."""
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
import argparse
import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path.cwd() / ".agents/skills/arkbattle-native-research/scripts"))
from native import DEFAULT_GAME, Native, fingerprint

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
parser.add_argument("--out", type=Path, required=True)
args = parser.parse_args()
expected = {
    "GameAssembly.dll": "cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff",
    "Arknights_Data/il2cpp_data/Metadata/global-metadata.dat":
        "e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5",
}
for relative, digest in expected.items():
    if fingerprint(args.game / relative)["sha256"] != digest:
        raise ValueError(f"client fingerprint changed: {relative}")

native = Native(args.game)
controller = next(t for t in native.types
                  if native.typename(t["index"]) == "Torappu.Battle.Entity/EPController")
methods = [native.method(i) for i in range(controller["methodStart"],
                                         controller["methodStart"] + controller["methodCount"])]
selected = {}
for method in methods:
    if not method["address"]:
        continue
    address = method["address"]
    end = min(v for v in native.addresses if v > address)
    parts = []
    while address < end:
        part = native.disassemble_at(address, max_bytes=end - address)
        parts.append(part)
        following = int(part["end"], 16)
        if following <= address:
            raise ValueError("nonprogressing native range")
        address = following
    selected[method["fullname"]] = {
        "method": method,
        "followingMethodAddress": hex(end),
        "parts": parts,
    }

provenance = native.provenance()
provenance["collectedOn"] = "2026-11-02"
provenance["extractionScript"] = fingerprint(Path(__file__))
args.out.mkdir(parents=True, exist_ok=True)
(args.out / "ep-native.json").write_text(json.dumps({
    "provenance": provenance,
    "result": {
        "controller": controller,
        "fields": native.fields(controller["index"]),
        "methods": selected,
    },
}, ensure_ascii=False, indent=2) + "\n")

for name, entry in selected.items():
    lines = [f"{row['address']}: {row['mnemonic']:8} {row['operands']}"
             + (" ; " + " | ".join(row["methods"]) if row.get("methods") else "")
             for part in entry["parts"] for row in part["instructions"]]
    filename = name.rsplit(".", 1)[1] + "-" + str(entry["method"]["index"]) + ".asm"
    (args.out / filename).write_text("\n".join(lines) + "\n")
print(json.dumps({"methods": len(selected), "out": str(args.out)}))
