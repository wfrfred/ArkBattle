#!/usr/bin/env python3
"""Decode string-literal usage slots referenced by this batch's selected methods."""
import importlib.util
import json
import struct
from pathlib import Path

root = Path.cwd()
base = root / "docs/research/evidence/scheduler-general-20261107/lifecycle"
spec = importlib.util.spec_from_file_location("native", root / ".agents/skills/arkbattle-native-research/scripts/native.py")
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
game = Path("/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game")
pe = module.PE(game / "GameAssembly.dll")
metadata = (game / "Arknights_Data/il2cpp_data/Metadata/global-metadata.dat").read_bytes()
literal_table, literal_bytes = struct.unpack_from("<II", metadata, 8)
literal_data, literal_data_bytes = struct.unpack_from("<II", metadata, 16)
source = json.loads((base / "tag-consumer-bodies.json").read_text())
preprocessor_source = json.loads((base / "tag-cooperate-preprocessor.json").read_text())
rows = []
for body in source["result"]["bodies"] + preprocessor_source["result"]["bodies"]:
    for fragment in body["fragments"]:
        for ins in fragment["instructions"]:
            for ref in ins.get("ripReferences", []):
                try:
                    value, = pe.unpack("<Q", int(ref, 16))
                except (ValueError, StopIteration):
                    continue
                # v29 string-literal metadata usage: kind 5, odd encoded index.
                if value >> 29 != 5 or not value & 1:
                    continue
                index = (value & 0x1ffffffe) >> 1
                if (index + 1) * 8 > literal_bytes:
                    continue
                length, data_index = struct.unpack_from("<II", metadata, literal_table + index * 8)
                if data_index + length > literal_data_bytes:
                    continue
                value_text = metadata[literal_data + data_index:literal_data + data_index + length].decode("utf-8")
                rows.append({"method": body["method"]["fullname"], "instructionVA": ins["address"],
                             "slotVA": ref, "encodedUsage": hex(value), "literalIndex": index,
                             "literalLength": length, "literalDataIndex": data_index, "text": value_text})
(base / "tag-literals.json").write_text(json.dumps({"provenance": source["provenance"],
    "decoder": "decode_tag_literals.py; metadata tables 0/1; kind=5; index=(encoded&0x1ffffffe)>>1; bounds checked",
    "result": rows}, ensure_ascii=False, indent=2) + "\n")
