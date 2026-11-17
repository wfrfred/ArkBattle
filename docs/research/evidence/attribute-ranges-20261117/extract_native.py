#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Extract the selected numeric attribute and range paths without running the client."""
import argparse
import bisect
import json
import struct
import sys
from pathlib import Path

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT / ".agents/skills/arkbattle-native-research/scripts"))
from native import Native, DEFAULT_GAME, fingerprint

EXPECTED = {
    "dll": "cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff",
    "metadata": "e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5",
}
BODIES = [
    "Torappu.Battle.Attributes.get_rawData",
    "Torappu.Battle.Attributes..ctor",
    "Torappu.Battle.Attributes.Reset",
    "Torappu.Battle.Attributes.OverwriteRawData",
    "Torappu.Battle.Attributes.OverwriteAllAttributesRawData",
    "Torappu.Battle.Attributes.GetRawValue",
    "Torappu.Battle.Attributes.GetValue",
    "Torappu.Battle.Attributes.GetValueRoundToInt",
    "Torappu.Battle.Attributes._CalculateAttributeValue",
    "Torappu.Battle.Attributes.GetMinValue",
    "Torappu.Battle.Attributes.GetMaxValue",
    "Torappu.Battle.Attributes.OverrideDataRange",
    "Torappu.Battle.Attributes.ClearDataRangeOverride",
    "Torappu.Battle.Attributes.MarkAttributeDirty",
    "Torappu.Battle.Attributes.MarkAttributesDirty",
    "Torappu.Battle.BattleFormula.CalculateAttackInterval",
    "Torappu.Battle.BattleFormula..cctor",
    "Torappu.Battle.Entity.get_attackTime",
]
OWNERS = {"Torappu.Battle.Attributes", "Torappu.Battle.BattleFormula"}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    if args.out.resolve().is_relative_to(Path(__file__).resolve().parent):
        parser.error("--out must be outside the historical evidence batch")
    n = Native(args.game)
    provenance = n.provenance()
    if any(provenance["client"][key]["sha256"] != value for key, value in EXPECTED.items()):
        parser.error("client fingerprint differs; relocate before applying this selection")
    provenance["tool"]["entrypoint"] = fingerprint(Path(__file__))
    provenance["location"]["modules"] = {"Assembly-CSharp.dll": n.modules["Assembly-CSharp.dll"]}
    provenance["scope"] = "Static numeric Attributes/range paths and attack interval formula; no live XLua or client execution."
    methods, bodies, constants = [], [], []
    for raw in n.methods:
        fullname = n.typename(raw["declaringType"]) + "." + n.string(raw["nameIndex"])
        if fullname not in BODIES:
            continue
        method = n.method(raw["index"])
        methods.append(method)
        cursor = method["address"]
        end = n.addresses[bisect.bisect_right(n.addresses, cursor)]
        fragments = []
        while cursor < end:
            part = n.disassemble_at(cursor, end - cursor,
                                   method=method if cursor == method["address"] else None)
            for instruction in part["instructions"]:
                if len(instruction.get("methods", [])) > 100:
                    instruction["methodAliasCount"] = len(instruction.pop("methods"))
                if (instruction["mnemonic"] == "movss" and
                        ", dword ptr [rip" in instruction["operands"]):
                    for address in instruction.get("ripReferences", []):
                        raw_constant = n.pe.read(int(address, 16), 4)
                        constants.append(dict(instruction=instruction["address"], address=address,
                                              bytes=raw_constant.hex(), format="<f",
                                              value=struct.unpack("<f", raw_constant)[0]))
            fragments.append(part)
            next_cursor = int(part["end"], 16)
            if next_cursor <= cursor:
                raise RuntimeError("disassembly did not advance")
            cursor = next_cursor
        bodies.append(dict(methodIndex=method["index"], fullname=fullname,
                           logicalEnd=hex(end), fragments=fragments))
    owners = [dict(index=t["index"], fullname=n.typename(t["index"]), fields=n.fields(t["index"]))
              for t in n.types if n.typename(t["index"]) in OWNERS]
    result = dict(selection=dict(bodies=BODIES, owners=sorted(OWNERS)),
                  methods=methods, fieldOwners=owners, bodies=bodies, constants=constants)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(dict(provenance=provenance, result=result),
                                   ensure_ascii=False, indent=2) + "\n")
    print(json.dumps(dict(methods=len(methods), bodies=len(bodies), out=str(args.out))))


if __name__ == "__main__":
    main()
