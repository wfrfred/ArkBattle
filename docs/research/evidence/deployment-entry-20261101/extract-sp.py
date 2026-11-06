#!/usr/bin/env python3
"""Re-extract the bounded native initial-SP assignment before character callbacks."""
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
import argparse
import datetime
import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT / ".agents/skills/arkbattle-native-research/scripts"))
from native import DEFAULT_GAME, Native, fingerprint


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    expected = json.loads(Path(__file__).with_name("probe.json").read_text())["provenance"]["client"]
    for kind, relative in (
        ("dll", "GameAssembly.dll"),
        ("metadata", "Arknights_Data/il2cpp_data/Metadata/global-metadata.dat"),
    ):
        if fingerprint(args.game / relative)["sha256"] != expected[kind]["sha256"]:
            raise ValueError(f"{kind} fingerprint differs from the recorded investigation")

    native = Native(args.game)
    methods = [native.method(m["index"]) for m in native.methods
               if native.typename(m["declaringType"]) == "Torappu.Battle.Entity"
               and native.string(m["nameIndex"]) == "Init"]
    candidates = [m for m in methods if any(p["name"] == "spData" for p in m["parameters"])]
    if len(candidates) != 1:
        raise ValueError("expected one Entity.Init overload accepting spData")
    method = candidates[0]
    entry = native.disassemble(method["index"])
    normal = native.disassemble_at(int(entry["end"], 16))
    epilogue = native.disassemble_at(int(normal["end"], 16))
    types = []
    for name, names in (
        ("Torappu.SpData", {"initSp"}),
        ("Torappu.Battle.Entity", {"m_sp", "<maxSp>k__BackingField"}),
    ):
        owner = next(t for t in native.types if native.typename(t["index"]) == name)
        types.append(dict(index=owner["index"], fullname=name,
                          fields=[f for f in native.fields(owner["index"]) if f["name"] in names]))
    provenance = native.provenance()
    provenance["collectedOn"] = datetime.date.today().isoformat()
    provenance["extractionScript"] = fingerprint(Path(__file__))
    result = dict(
        scope="Entity.Init's ordinary contiguous branch; external hotfix/error edges remain explicit. "
              "Private content-specific SP additions are not inferred from this base assignment.",
        method=method, blocks=[entry, normal, epilogue], types=types,
    )
    args.out.mkdir(parents=True, exist_ok=True)
    (args.out / "sp-initialization.json").write_text(json.dumps(
        dict(provenance=provenance, result=result), ensure_ascii=False, indent=2,
    ) + "\n")


if __name__ == "__main__":
    main()
