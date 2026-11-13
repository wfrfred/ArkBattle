#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Extract only the facing enums, Animator threshold and referenced float literals."""
import argparse
import importlib.util
import json
import struct
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=Path("/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game"))
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    spec = importlib.util.spec_from_file_location("facing_native", ".agents/skills/arkbattle-native-research/scripts/native.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    native = module.Native(args.game)
    defaults = {item["fieldIndex"]: item for item in native.records(7, "<iii", "fieldIndex typeIndex dataIndex")}
    start, _ = native.table(8)
    selected, animators = [], []
    for owner in native.types:
        name = native.typename(owner["index"])
        if name in {"Torappu.Battle.UnitAnimator", "Torappu.Battle.SpineAnimator", "Torappu.Battle.MultiSpineAnimator", "Torappu.Battle.SingleSpineAnimator", "Torappu.Battle.CharacterAnimator", "Torappu.Battle.MeshAnimator", "Torappu.Battle.EmptyAnimator"}:
            methods = [native.method(index) for index in range(owner["methodStart"], owner["methodStart"]+owner["methodCount"])]
            animators.append({"fullname": name, "parent": native.type_name(owner["parentIndex"]),
                              "facingOverrides": [method for method in methods if method["fullname"].split(".")[-1] in {"get_faceSign", "get_faceLOrR", "OnFaceChanged", "_UpdateDirection"}]})
        if name not in {"Torappu.SharedConsts/Direction", "Torappu.Battle.Enemy/BodyDirectionPolicy", "Torappu.Battle.UnitAnimator"}:
            continue
        fields = native.fields(owner["index"])
        if name.endswith("UnitAnimator"):
            fields = [item for item in fields if item["name"] == "L_OR_R_THRESHOLD"]
        for field in fields:
            default = defaults.get(field["index"])
            if default is None or default["dataIndex"] < 0:
                continue
            offset = start + default["dataIndex"]
            if field["typeName"] == "float":
                field["default"] = {"bytes": native.metadata[offset:offset+4].hex(), "value": struct.unpack_from("<f", native.metadata, offset)[0]}
            else:
                encoded = native.metadata[offset]
                assert encoded < 128, "selected enum defaults must fit one compressed byte"
                field["default"] = {"encodedByte": encoded, "value": (encoded >> 1) ^ -(encoded & 1)}
        selected.append({"fullname": name, "index": owner["index"], "fields": fields})
    literals = [{"address": hex(address), "bytes": native.pe.read(address, 4).hex(), "float": native.pe.unpack("<f", address)[0]}
                for address in [0x1870aed80, 0x1870aed7c, 0x1870aec7c, 0x1870aec18, 0x1870adda0]]
    provenance = native.provenance()
    provenance["queryScript"] = module.fingerprint(Path(__file__))
    callbacks = [native.method(method["index"]) for method in native.methods
                 if native.typename(method["declaringType"]).startswith("Torappu.Battle.FaceSwitcher/")]
    result = {"provenance": provenance, "result": {"types": selected, "literals": literals, "animatorInheritance": animators, "faceSwitcherCallbacks": callbacks}}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"out": str(args.out), "types": len(selected)}))


if __name__ == "__main__":
    main()
