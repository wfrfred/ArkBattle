#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""Record the narrow ActionData meta source/type witnesses for this batch."""
import argparse
import importlib.util
import json
from pathlib import Path


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--game", type=Path, default=Path("/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game"))
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    script = Path.cwd() / ".agents/skills/arkbattle-native-research/scripts/native.py"
    spec = importlib.util.spec_from_file_location("native", script)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    native = module.Native(args.game)
    wanted = {
        "Torappu.Battle.AutoChess.EnemyInfo",
        "Torappu.Battle.AutoChess.SelfEnemyInfo",
        "Torappu.Battle.AutoChess.EscapedEnemyInfo",
        "Torappu.Battle.AutoChess.BossBattleEnemyInfo",
    }
    types = [dict(t, fullname=native.typename(t["index"]),
                  parentTypeName=native.type_name(t["parentIndex"]), fields=native.fields(t["index"]))
             for t in native.types if native.typename(t["index"]) in wanted]
    generic_parameters = []
    for index in [81510, 81511, 81512]:
        method = native.method(index)
        parameter = method["parameters"][-1 if index != 81512 else -2]
        pointer = native.type_pointers[parameter["typeIndex"]]
        generic_class, bits = native.pe.unpack("<QI", pointer)
        if (bits >> 16) & 255 != 0x15:
            raise ValueError("expected generic class parameter")
        container_type, class_inst, method_inst = native.pe.unpack("<3Q", generic_class)
        count, argv = native.pe.unpack("<2Q", class_inst)
        arguments = native.pe.unpack("<" + "Q" * count, argv)
        generic_parameters.append(dict(
            method=method, parameter=parameter,
            typePointer=hex(pointer), genericClass=hex(generic_class),
            containerTypePointer=hex(container_type), containerTypeName=native.type_name(pointer=container_type),
            classInst=hex(class_inst), methodInst=hex(method_inst), argumentVector=hex(argv),
            arguments=[dict(pointer=hex(arg), rawType=list(native.pe.unpack("<QI", arg)),
                            fullname=native.type_name(pointer=arg)) for arg in arguments]))
    slot = 0x188ba8cb8
    raw = native.pe.unpack("<Q", slot)[0]
    kind, type_index = raw >> 29, (raw & 0x1ffffffe) >> 1
    if kind != 1 or not raw & 1:
        raise ValueError("expected encoded, uninitialized TypeInfo metadata usage")
    result = dict(types=types, genericParameterWitnesses=generic_parameters,
                  typeInfoSlot=dict(address=hex(slot), format="<Q", raw=hex(raw),
                                    usageKind=kind, typeIndex=type_index,
                                    fullname=native.type_name(type_index)),
                  note="Generic class context is recorded as raw pointers plus decoded class arguments; TypeInfo slot is the cast target read by AutoChessGameManager.OnEnemyRegistered.")
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(dict(provenance=native.provenance(), result=result), ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()
