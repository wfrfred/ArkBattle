#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Extract attribute declarations, finish reasons, virtual slots and source-stack helpers."""
import argparse
import importlib.util
import json
import struct
import sys
from pathlib import Path

sys.dont_write_bytecode = True
ROOT = Path.cwd()
sys.path.insert(0, str(ROOT / ".agents/skills/arkbattle-native-research/scripts"))
from native import Native, DEFAULT_GAME, fingerprint

DECODER = ROOT / "docs/research/evidence/unit-audit-20261110/coordinates-numeric/extract.py"


def attribute_meta(native, decoder, raw):
    count, position = decoder.cu32(raw, 0)
    constructors = list(struct.unpack_from("<" + "I" * count, raw, position))
    position += 4 * count
    constructor = native.method(constructors[0])
    if constructor["fullname"] != "Torappu.AttributeMetaAttribute..ctor":
        raise ValueError("first attribute constructor is " + constructor["fullname"])
    argc, position = decoder.cu32(raw, position)
    fields, position = decoder.cu32(raw, position)
    properties, position = decoder.cu32(raw, position)
    assert argc in (1, 2, 3) and fields == properties == 0
    assert [p["name"] for p in constructor["parameters"]] == ["attribute", "min", "max"][:argc]
    assert raw[position] == 0x55
    enum_type, position = decoder.cu32(raw, position + 1)
    encoded, position = decoder.cu32(raw, position)
    values = []
    for _ in range(argc - 1):
        assert raw[position] == 0x0c
        values.append(struct.unpack_from("<f", raw, position + 1)[0])
        position += 5
    return {"attribute": (encoded >> 1) ^ -(encoded & 1),
            "minimum": values[0] if argc >= 2 else None,
            "maximum": values[1] if argc == 3 else None,
            "minimumDeclared": argc >= 2, "maximumDeclared": argc == 3,
            "constructor": constructor, "constructorIndices": constructors,
            "enumSerializedTypeCode": enum_type, "consumedThrough": position,
            "otherAttributeTailHex": raw[position:].hex(),
            "scope": "Declared enum/float constructor arguments; omitted bounds are not inferred here."}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    native = Native(args.game)
    spec = importlib.util.spec_from_file_location("resource_meta_decoder", DECODER)
    decoder = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(decoder)
    ranges = native.records(25, "<II", "token startOffset")
    data_start, _ = native.table(24)
    image = next(i for i in native.images if native.string(i["nameIndex"]) == "Assembly-CSharp.dll")
    first = image["customAttributeStart"]
    selected = ranges[first:first + image["customAttributeCount"]]
    positions = {row["token"]: i for i, row in enumerate(selected)}
    owner = next(t for t in native.types if native.typename(t["index"]) == "Torappu.AttributesData")
    attributes, other_fields = [], []
    for field in native.fields(owner["index"]):
        index = positions.get(field["token"])
        if index is None or index + 1 >= len(selected):
            continue
        begin, end = selected[index:index + 2]
        raw = native.metadata[data_start + begin["startOffset"]:data_start + end["startOffset"]]
        try:
            decoded = attribute_meta(native, decoder, raw)
        except (AssertionError, ValueError, IndexError) as error:
            other_fields.append({"field": field, "blobHex": raw.hex(),
                                 "status": "not-decoded-as-AttributeMeta", "reason": str(error)})
            continue
        attributes.append({"field": field, "range": begin, "nextRange": end,
                           "dataStart": data_start, "blobHex": raw.hex(), "decoded": decoded})
    defaults = {r["fieldIndex"]: r for r in native.records(7, "<iii", "fieldIndex typeIndex dataIndex")}
    default_base, _ = native.table(8)
    enums = []
    enum_names = {"Torappu.Battle.Entity/FinishReason", "Torappu.AttributeType"}
    for row in native.types:
        name = native.typename(row["index"])
        if name not in enum_names:
            continue
        values = []
        for field in native.fields(row["index"]):
            source = defaults.get(field["index"])
            if source is None or source["dataIndex"] < 0:
                continue
            at = default_base + source["dataIndex"]
            encoded, end = decoder.cu32(native.metadata, at)
            values.append({"name": field["name"], "value": (encoded >> 1) ^ -(encoded & 1),
                           "source": source, "encodedBytes": native.metadata[at:end].hex()})
        enums.append({"fullname": name, "index": row["index"], "values": values})
    owners = {"Torappu.Battle.Entity", "Torappu.Battle.Unit", "Torappu.Battle.Character",
              "Torappu.Battle.Enemy", "Torappu.Battle.Buff", "Torappu.Battle.Projectile",
              "Torappu.Battle.Ability", "Torappu.Battle.Context/ContextPtrStack`1"}
    slots = [native.method(m["index"]) for m in native.methods
             if native.typename(m["declaringType"]) in owners and m["slot"] != 65535]
    helper_addresses = [0x185996c20, 0x185996cf0, 0x185996dc0, 0x1853ae540, 0x180013c50]
    helpers = []
    for address in helper_addresses:
        part = native.disassemble_at(address, 0x800)
        for instruction in part["instructions"]:
            if len(instruction.get("methods", [])) > 100:
                instruction["methodAliasCount"] = len(instruction.pop("methods"))
        helpers.append(part)
    provenance = native.provenance()
    provenance["location"]["modules"] = {"Assembly-CSharp.dll": native.modules["Assembly-CSharp.dll"]}
    provenance["extractionScript"] = fingerprint(Path(__file__))
    provenance["attributeDecoder"] = fingerprint(DECODER)
    provenance["scope"] = "Current static metadata/custom attributes and selected helper machine-code regions."
    result = {"attributes": attributes, "otherAttributeFields": other_fields,
              "enums": enums, "virtualMethods": slots, "helpers": helpers,
              "selection": {"enumNames": sorted(enum_names), "slotOwners": sorted(owners),
                            "helperAddresses": [hex(a) for a in helper_addresses]}}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps({"provenance": provenance, "result": result},
                                   ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"attributes": len(attributes), "otherFields": len(other_fields),
                      "virtualMethods": len(slots), "helpers": len(helpers)}))


if __name__ == "__main__":
    main()
