#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Extract current selector qualification methods by metadata identity."""
import argparse
import bisect
import json
from pathlib import Path
import sys

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path.cwd() / ".agents/skills/arkbattle-native-research/scripts"))
from native import Native, fingerprint


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, required=True)
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument("--scout", action="store_true")
    parser.add_argument("--method", action="append", default=[])
    parser.add_argument("--methods-file", type=Path)
    parser.add_argument("--address", action="append", default=[], type=lambda value: int(value, 0))
    parser.add_argument("--type", action="append", default=[])
    args = parser.parse_args()
    if args.methods_file:
        args.method.extend(json.loads(args.methods_file.read_text()))
    native = Native(args.game)
    provenance = native.provenance()
    if args.address:
        expected = {
            "dll": "cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff",
            "metadata": "e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5",
        }
        if any(provenance["client"][key]["sha256"] != digest for key, digest in expected.items()):
            raise ValueError("address-bound helpers require re-location for this client")
    provenance["extractionScript"] = fingerprint(Path(__file__))
    provenance["collectedOn"] = "2026-11-09"
    types = []
    owners = {
        "Torappu.Battle.TargetSelector", "Torappu.Battle.AdvancedSelector",
        "Torappu.Battle.BlockedOrAdvancedSelector", "Torappu.Battle.TargetValidator",
        "Torappu.Battle.TargetOptions", "Torappu.Battle.FilterBuffTargetValidator",
        "Torappu.Battle.SecondaryFilterAdvancedSelector",
        "Torappu.Battle.RangeSelector", "Torappu.Battle.BlockedBaseSelector",
    }
    owners.update(args.type)
    methods = []
    for row in native.types:
        name = native.typename(row["index"])
        if name in owners or ("TargetFree" in name and name.startswith("Torappu.Battle")):
            members = [native.method(i) for i in range(max(0, row["methodStart"]),
                       max(0, row["methodStart"]) + row["methodCount"])
                       if not native.string(native.methods[i]["nameIndex"]).startswith("__Hotfix")]
            types.append(dict(name=name, index=row["index"], parent=native.type_name(row["parentIndex"])
                              if row["parentIndex"] >= 0 else None,
                              fields=native.fields(row["index"]), methods=members))
        for i in range(max(0, row["methodStart"]), max(0, row["methodStart"]) + row["methodCount"]):
            full = name + "." + native.string(native.methods[i]["nameIndex"])
            if full in args.method:
                methods.append(native.method(i))
    bodies = []
    if not args.scout:
        missing = set(args.method) - {m["fullname"] for m in methods}
        if missing:
            raise ValueError(f"unresolved methods: {sorted(missing)}")
        for method in methods:
            address = method["address"]
            if not address:
                bodies.append(dict(method=method, unavailable=method["addressStatus"]))
                continue
            end = native.addresses[bisect.bisect_right(native.addresses, address)]
            parts = []
            while address < end:
                part = native.disassemble_at(address, end-address,
                                             method=method if address == method["address"] else None)
                for instruction in part["instructions"]:
                    if len(instruction.get("methods", [])) > 80:
                        instruction["methodAliasCount"] = len(instruction.pop("methods"))
                parts.append(part)
                following = int(part["end"], 16)
                if following <= address:
                    raise ValueError("non-advancing disassembly")
                address = following
            bodies.append(dict(method=method, followingMethodAddress=hex(end), parts=parts))
    args.out.parent.mkdir(parents=True, exist_ok=True)
    defaults = {row["fieldIndex"]: row for row in native.records(7, "<iii", "fieldIndex typeIndex dataIndex")}
    constant_start, _ = native.table(8)
    enum_names = {"Torappu.AbnormalFlag", "Torappu.AbnormalCombo", "Torappu.MotionMask",
                  "Torappu.Battle.ActionPurposeMask", "Torappu.Battle.SideType",
                  "Torappu.Battle.EntityCategory", "Torappu.MapLayer", "Torappu.UnitTypeMask"}
    enums = []
    for row in native.types:
        name = native.typename(row["index"])
        if name not in enum_names:
            continue
        values = []
        for field in native.fields(row["index"]):
            default = defaults.get(field["index"])
            if default is None or default["dataIndex"] < 0:
                continue
            raw = native.metadata[constant_start+default["dataIndex"]:]
            head = raw[0]
            if head < 0x80:
                unsigned, used = head, 1
            elif head < 0xc0:
                unsigned, used = ((head & 0x3f) << 8) | raw[1], 2
            elif head < 0xe0:
                unsigned, used = ((head & 0x1f) << 24) | int.from_bytes(raw[1:4], "big"), 4
            elif head == 0xf0:
                unsigned, used = int.from_bytes(raw[1:5], "little"), 5
            elif head in (0xfe, 0xff):
                unsigned, used = (0xfffffffe if head == 0xfe else 0xffffffff), 1
            else:
                raise ValueError(f"unsupported enum constant {name}.{field['name']}")
            value = (unsigned >> 1) if unsigned % 2 == 0 else -(unsigned >> 1)-1
            values.append(dict(name=field["name"], value=value, fieldIndex=field["index"],
                               dataIndex=default["dataIndex"], encodedBytes=raw[:used].hex()))
        enums.append(dict(name=name, index=row["index"], values=values))
    inventory = []
    parents = {native.typename(row["index"]): native.type_name(row["parentIndex"])
               if row["parentIndex"] >= 0 else None for row in native.types}
    def in_scope(name):
        seen = set()
        while name is not None and name not in seen:
            if name in {"Torappu.Battle.TargetSelector", "Torappu.Battle.Range", "Torappu.Battle.TargetValidator"}:
                return True
            seen.add(name)
            name = parents.get(name)
        return False
    for row in native.types:
        name = native.typename(row["index"])
        if in_scope(name) and "Torappu.Battle.Range" in args.type:
            inventory.append(dict(name=name, parent=native.type_name(row["parentIndex"])
                                  if row["parentIndex"] >= 0 else None,
                                  methods=[native.method(i) for i in range(max(0, row["methodStart"]),
                                           max(0, row["methodStart"]) + row["methodCount"])
                                           if not native.string(native.methods[i]["nameIndex"]).startswith("__Hotfix")]))
    literals = []
    literal_rows = native.records(0, "<II", "length dataIndex")
    literal_data, _ = native.table(1)
    for body in bodies:
        for part in body.get("parts", []):
            for instruction in part["instructions"]:
                for ref in instruction.get("ripReferences", []):
                    try:
                        encoded = native.pe.unpack("<Q", int(ref, 16))[0]
                    except (StopIteration, ValueError):
                        continue
                    kind, index = (encoded >> 29) & 7, (encoded & 0x1ffffffe) >> 1
                    if encoded >> 32 or kind != 5 or index >= len(literal_rows):
                        continue
                    row = literal_rows[index]
                    text = native.metadata[literal_data+row["dataIndex"]:literal_data+row["dataIndex"]+row["length"]].decode("utf-8")
                    literals.append(dict(instruction=instruction["address"], reference=ref,
                                         encodedUsage=hex(encoded), index=index, text=text))
    result = dict(types=types, enums=enums, selectorRangeInventory=inventory,
                  stringLiterals=literals, bodies=bodies,
                  additionalBodies=[native.disassemble_at(address) for address in args.address])
    args.out.write_text(json.dumps(dict(provenance=provenance, result=result), ensure_ascii=False, indent=2)+"\n")
    print(json.dumps(dict(out=str(args.out), types=len(types), methods=len(bodies),
                          dll=provenance["client"]["dll"]["sha256"],
                          metadata=provenance["client"]["metadata"]["sha256"])))


if __name__ == "__main__":
    main()
