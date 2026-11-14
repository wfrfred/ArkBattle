#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Decode recovery enum constants and metadata usages referenced by archived bodies."""
import argparse
import importlib.util
import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True
ROOT = Path.cwd()
sys.path.insert(0, str(ROOT / ".agents/skills/arkbattle-native-research/scripts"))
from native import Native, DEFAULT_GAME, fingerprint


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--game", type=Path, default=DEFAULT_GAME)
    p.add_argument("--bodies", type=Path, action="append", required=True)
    p.add_argument("--out", type=Path, required=True)
    a = p.parse_args()
    n = Native(a.game)
    decoder_path = ROOT / "docs/research/evidence/unit-audit-20261110/coordinates-numeric/extract.py"
    spec = importlib.util.spec_from_file_location("recovery_enum_decoder", decoder_path)
    decoder = importlib.util.module_from_spec(spec); spec.loader.exec_module(decoder)
    defaults = {r["fieldIndex"]: r for r in n.records(7, "<iii", "fieldIndex typeIndex dataIndex")}
    base, _ = n.table(8)
    enums = []
    for t in n.types:
        name = n.typename(t["index"])
        if name not in ("Torappu.Battle.ElementType", "Torappu.AttributeType", "Torappu.Battle.Buff/Event", "Torappu.Battle.Action.Nodes/HealViaDamage/HealType"):
            continue
        values = []
        for f in n.fields(t["index"]):
            d = defaults.get(f["index"])
            if d is None or d["dataIndex"] < 0:
                continue
            pos = base + d["dataIndex"]
            first = n.metadata[pos]
            if first < 0xe0: value, end = decoder.cu32(n.metadata, pos)
            elif first == 0xf0: value, end = int.from_bytes(n.metadata[pos+1:pos+5], "little"), pos+5
            elif first in (0xfe, 0xff): value, end = (0xfffffffe if first == 0xfe else 0xffffffff), pos+1
            else: raise ValueError((name, f["name"], first))
            values.append({"name": f["name"], "value": (value >> 1) ^ -(value & 1),
                           "encodedBytes": n.metadata[pos:end].hex(), "default": d})
        enums.append({"fullname": name, "index": t["index"], "values": values})
    string_rows = n.records(0, "<II", "length dataIndex"); string_base, _ = n.table(1)
    usages, float_reads = [], []; type_owners = set()
    for file in a.bodies:
        source = json.loads(file.read_text())
        for b in source["result"]["bodies"]:
            for part in b["fragments"]:
                for ins in part["instructions"]:
                    for ref in ins.get("ripReferences", []):
                        if ins["mnemonic"] == "movss" and "dword ptr [rip" in ins["operands"]:
                            float_reads.append({"body": b["methodIndex"], "instruction": ins["address"],
                                                "address": ref, "bytes": n.pe.read(int(ref, 16), 4).hex(),
                                                "float32": n.pe.unpack("<f", int(ref, 16))[0]})
                        try: encoded = n.pe.unpack("<Q", int(ref, 16))[0]
                        except (ValueError, StopIteration): continue
                        kind, index = (encoded >> 29) & 7, (encoded & 0x1ffffffe) >> 1
                        if encoded >> 32: continue
                        value = None
                        if kind == 5 and index < len(string_rows):
                            row = string_rows[index]; start = string_base + row["dataIndex"]
                            value = n.metadata[start:start + row["length"]].decode("utf-8")
                        elif kind in (1, 2) and index < len(n.type_pointers):
                            value = n.type_name(index)
                            type_owners.add(value)
                        if value is not None:
                            usages.append({"body": b["methodIndex"], "instruction": ins["address"],
                                           "slot": ref, "encodedUsage": hex(encoded), "kind": kind,
                                           "index": index, "value": value})
    fields = [{"fullname": n.typename(t["index"]), "index": t["index"], "fields": n.fields(t["index"])}
              for t in n.types if n.typename(t["index"]) in type_owners]
    provenance = n.provenance(); provenance["collectedOn"] = "2026-11-14"
    provenance["caseTool"] = {"script": fingerprint(Path(__file__)), "enumDecoder": fingerprint(decoder_path),
                              "bodyInputs": [fingerprint(f) for f in a.bodies]}
    a.out.parent.mkdir(parents=True, exist_ok=True)
    a.out.write_text(json.dumps({"provenance": provenance, "result": {"enums": enums,
                            "metadataUsages": usages, "float32Reads": float_reads,
                            "referencedTypeFields": fields}}, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"enums": len(enums), "usages": len(usages), "fieldOwners": len(fields)}))


if __name__ == "__main__":
    main()
