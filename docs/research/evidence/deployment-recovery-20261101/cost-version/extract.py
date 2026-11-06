#!/usr/bin/env python3
"""Re-extract the bounded Card cost chain from the recorded client inputs."""
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
ROOT = Path.cwd()
sys.path.insert(0, str(ROOT / ".agents/skills/arkbattle-native-research/scripts"))
from native import DEFAULT_GAME, Native, fingerprint


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    expected = json.loads(Path(__file__).with_name('probe.json').read_text())['provenance']['client']
    for kind, relative in [('dll', 'GameAssembly.dll'), ('metadata', 'Arknights_Data/il2cpp_data/Metadata/global-metadata.dat')]:
        if fingerprint(args.game / relative)['sha256'] != expected[kind]['sha256']:
            raise ValueError('client fingerprint differs from the recorded investigation: ' + kind)
    native = Native(args.game)
    names = {
        "Torappu.Battle.Deck/Card.get_rawCost",
        "Torappu.Battle.Deck/Card.get_cost",
        "Torappu.Battle.BattleFormula.CalculateRuntimeCardCost",
    }
    methods = {}
    for item in native.methods:
        name = native.typename(item["declaringType"]) + "." + native.string(item["nameIndex"])
        if name in names:
            methods[name] = native.method(item["index"])
    if set(methods) != names:
        raise ValueError("the three recorded methods were not uniquely resolved")

    provenance = native.provenance()
    provenance["collectedOn"] = datetime.date.today().isoformat()
    provenance["extractionScript"] = fingerprint(Path(__file__))
    args.out.mkdir(parents=True, exist_ok=True)

    def write(name, result):
        (args.out / name).write_text(json.dumps(
            dict(provenance=provenance, result=result), ensure_ascii=False, indent=2,
        ) + "\n")

    entries = [native.disassemble(methods[name]["index"]) for name in (
        "Torappu.Battle.Deck/Card.get_rawCost",
        "Torappu.Battle.Deck/Card.get_cost",
    )]
    # Both getters have a .pdata split immediately before their native path.
    # Preserve the first range and the native continuation separately.
    continuations = [native.disassemble_at(int(body["end"], 16)) for body in entries]
    card = native.types[entries[0]["method"]["declaringType"]]
    cost_fields = {
        "m_respawnCostMultCnt", "m_respawnCostMaxMultiplier", "m_respawnCostMultiplier",
        "m_respawnCostMaxMultiplierOffset",
        "m_costDelta", "m_rawCostScale", "m_attributesSnapshot",
    }
    write("card-cost.json", dict(
        methods=[body["method"] for body in entries], bodies=entries,
        type=dict(fullname=native.typename(card["index"]), index=card["index"],
                  fields=[field for field in native.fields(card["index"]) if field["name"] in cost_fields]),
    ))
    write("expanded.json", continuations)
    formula = methods["Torappu.Battle.BattleFormula.CalculateRuntimeCardCost"]
    runtime = native.disassemble(formula["index"])
    write("runtime-cost.json", runtime)

    owner = next(t for t in native.types if native.typename(t["index"]) == "Torappu.Battle.BattleOptions")
    fields = native.fields(owner["index"])
    ceiling = next(field for field in fields if field["name"] == "MAX_COST_CEIL")
    instructions = runtime["instructions"]
    load = next(i for i, row in enumerate(instructions)
                if row["mnemonic"] == "movups" and
                row["operands"] == f"xmm0, xmmword ptr [rcx + {ceiling['offset']:#x}]")
    type_load = next(row for row in reversed(instructions[:load])
                     if row["mnemonic"] == "mov" and
                     row["operands"].startswith("rcx, qword ptr [rip + "))
    global_address = int(type_load["ripReferences"][0], 16)
    encoded = native.pe.unpack("<Q", global_address)[0]
    usage_kind = (encoded >> 29) & 7
    type_index = (encoded & 0x1ffffffe) >> 1
    type_pointer = native.type_pointers[type_index]
    data, bits = native.pe.unpack("<QI", type_pointer)
    if usage_kind != 1 or (bits >> 16) & 255 != 0x12 or data != owner["index"]:
        raise ValueError("formula's static field load does not resolve to BattleOptions")
    write("cap-field.json", [dict(type=native.typename(owner["index"]), index=owner["index"], fields=fields)])
    write("cap-field-binding.json", dict(
        instruction=type_load, fieldLoad=instructions[load], globalAddress=hex(global_address),
        encodedUsage=hex(encoded), usageKind=usage_kind, typeIndex=type_index,
        typePointer=hex(type_pointer), data=data, kind=hex((bits >> 16) & 255),
        declaringType=native.typename(data), field=ceiling,
    ))
    write("probe.json", dict(typeCount=len(native.types), methodCount=len(native.methods)))
    print(f"Wrote six evidence records to {args.out}")


if __name__ == "__main__":
    main()
