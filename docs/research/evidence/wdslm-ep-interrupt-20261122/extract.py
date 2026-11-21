#!/usr/bin/env python3
"""Extract the actual 12-18 boss projectile's summon and target EP interrupt."""

import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import sys

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT / ".agents/skills/arkbattle-native-research/scripts"))
from native import DEFAULT_GAME, fingerprint
from unity_assets import Reader, bundle, script, serialized


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    decoder = ROOT / "docs/research/evidence/nymph-action-settlement-20261103/projectile/decode_projectile.py"
    spec = importlib.util.spec_from_file_location("wdslm_type_tree", decoder)
    reader = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(reader)
    base = args.game / "Arknights_Data/StreamingAssets/AB/Windows"
    sources, scripts, components = [], {}, []
    for relative in ("anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin",):
        path = base / relative
        sources.append({"bundle": relative, **fingerprint(path)})
        for filename, data in bundle(path)[0]:
            if filename.endswith((".resS", ".resource")):
                continue
            for obj in serialized(data)["objects"]:
                if obj["classid"] == 115:
                    scripts[filename, obj["id"]] = script(obj, data)

    selection = {
        "battle/enm_pfb_18.ab": {
            5624699378828557120: ("boss", "_modes"),
            309747327906134848: ("boss P2 mode", "_generalAbilities", "_bodyTransform"),
            -112682243156362432: ("P2 syncAttackWithSummon EnemySkill", "_trigger"),
            3025183016322382656: ("P2 syncAttackWithSummon", "_metadata", "_projectileKey"),
            3975990805935340352: ("boss reborn", "_modeIndex", "_maxRespawnCnt"),
        },
        "battle/enm_pfb_13.ab": {
            -3417072777402592606: ("summoned target", "_commonAbilities"),
            -6677586229009001822: ("summoned target Talent", "_defaultModeIndex"),
            -7188237669545160030: ("summoned target PassiveBuffAbility", "_buffs"),
        },
        "battle/prefabs/[uc]projectiles.ab": {
            -1243116483898611156: ("projectile", "_actionController"),
            7339034304921823788: ("projectile summon actions", "_ev", "_actions"),
        },
    }
    files = {
        "battle/enm_pfb_18.ab": "CAB-0df5f4c8c8dade07e2ee475a972da576",
        "battle/enm_pfb_13.ab": "CAB-d5a5ebb06b9b5c15f66b6f736b421497",
        "battle/prefabs/[uc]projectiles.ab": "CAB-34af01ecb5d2ad63aca01b6e0d71279d",
    }
    for relative, ids in selection.items():
        path = base / relative
        sources.append({"bundle": relative, **fingerprint(path)})
        for filename, data in bundle(path)[0]:
            if filename != files[relative]:
                continue
            layouts, externals = reader.trees(data)
            objects = serialized(data)["objects"]
            names, transforms = {}, {}
            for obj in objects:
                raw = data[obj["start"]:obj["start"] + obj["size"]]
                if obj["classid"] == 1:
                    value = Reader(raw)
                    value.read(value.val("i") * 12)
                    value.val("i")
                    names[obj["id"]] = value.string()
                elif obj["classid"] == 4:
                    value = reader.decode(raw, layouts[obj["typeid"]])
                    transforms[obj["id"]] = (value["common:374"]["m_PathID"], value["m_Father"]["m_PathID"])
            owners = {owner: transform for transform, (owner, _) in transforms.items()}
            for obj in objects:
                if obj["id"] not in ids:
                    continue
                purpose, *fields = ids[obj["id"]]
                raw = data[obj["start"]:obj["start"] + obj["size"]]
                value = reader.decode(raw, layouts[obj["typeid"]])
                pointer = value["common:490"]
                script_file = filename if pointer["m_FileID"] == 0 else externals[pointer["m_FileID"] - 1]["path"].split("/")[-1]
                hierarchy, transform = [], owners.get(value["common:374"]["m_PathID"], 0)
                while transform:
                    owner, parent = transforms[transform]
                    hierarchy.append(names[owner])
                    transform = parent
                values = {name: value[name] for name in fields}
                if "_actions" in values:
                    values["_actions"] = json.loads(values["_actions"]["SerializedState"])
                components.append({
                    "purpose": purpose,
                    "bundle": relative,
                    "file": filename,
                    "pathId": str(obj["id"]),
                    "objectSha256": hashlib.sha256(raw).hexdigest(),
                    "hierarchy": hierarchy[::-1],
                    "script": scripts[script_file, pointer["m_PathID"]],
                    "fields": values,
                })
        found = {int(row["pathId"]) for row in components if row["bundle"] == relative}
        assert found == ids.keys(), (relative, sorted(ids.keys() - found))

    result = {
        "provenance": {"collectedOn": "2026-11-22", "sources": sources, "decoder": fingerprint(decoder)},
        "components": components,
    }
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()
