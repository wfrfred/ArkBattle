#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Decode SP type constants and the recovery boundary used by receiving damage."""
import argparse
import importlib.util
import json
from pathlib import Path
import struct
import sys

sys.dont_write_bytecode = True
ROOT = Path.cwd()
sys.path.insert(0, str(ROOT / ".agents/skills/arkbattle-native-research/scripts"))
from native import Native, DEFAULT_GAME, fingerprint


def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    body_path = ROOT / "docs/research/evidence/resource-mechanisms-20261114/damage/trace_flags.py"
    decoder_path = ROOT / "docs/research/evidence/unit-audit-20261110/coordinates-numeric/extract.py"
    body_reader, decoder = load("addition_body_reader", body_path), load("addition_enum_reader", decoder_path)
    native = Native(args.game)
    owner = next(t for t in native.types if native.typename(t["index"]) == "Torappu.SpType")
    fields = native.fields(owner["index"])
    defaults = {x["fieldIndex"]: x for x in native.records(7, "<iii", "fieldIndex typeIndex dataIndex")}
    base, _ = native.table(8)
    values = []
    for field in fields:
        default = defaults.get(field["index"])
        if default is None or default["dataIndex"] < 0:
            continue
        kind = native.type_name(default["typeIndex"])
        offset = base + default["dataIndex"]
        if kind in {"short", "ushort", "byte", "sbyte"}:
            decoded = struct.unpack_from({"short": "<h", "ushort": "<H", "byte": "<B", "sbyte": "<b"}[kind], native.metadata, offset)[0]
        else:
            raw, _ = decoder.cu32(native.metadata, offset)
            decoded = raw if kind == "uint" else (raw >> 1) ^ -(raw & 1)
        values.append({"field": field, "default": default, "constantType": kind, "value": decoded})
    methods = [native.method(index) for index in [67749, 67752]]
    provenance = native.provenance()
    provenance["caseTool"] = {"script": fingerprint(Path(__file__)), "bodyReader": fingerprint(body_path), "enumReader": fingerprint(decoder_path)}
    payload = {"provenance": provenance, "result": {"enum": {"fullname": "Torappu.SpType", "index": owner["index"], "values": values},
               "methods": methods, "bodies": [body_reader.full_body(native, method) for method in methods]}}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"values": len(values), "bodies": len(methods), "out": str(args.out)}))


if __name__ == "__main__":
    main()
