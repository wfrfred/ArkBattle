#!/usr/bin/env python3
"""Select compact Content witnesses from the recorded cancellation resources."""
import argparse
import json
from pathlib import Path
import sys

sys.dont_write_bytecode = True
ROOT = Path.cwd()
sys.path.insert(0, str(ROOT / ".agents/skills/arkbattle-native-research/scripts"))
from native import fingerprint

HERE = Path(__file__).resolve().parent
KEYS = {"ascln_s_3[self]", "logos_s_1", "oxi_s_2_guard_manager", "enemy_ltntpt[aoe_attack]", "enemy_ltntpt[aoe_attack_magic]"}


def walk(value, pointer=""):
    if isinstance(value, dict):
        yield pointer, value
        for key, child in value.items():
            yield from walk(child, pointer + "/" + key.replace("~", "~0").replace("/", "~1"))
    elif isinstance(value, list):
        for index, child in enumerate(value):
            yield from walk(child, pointer + "/" + str(index))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    holder_path, bindings_path = HERE / "holder.json", HERE / "bindings.json"
    holder, bindings = json.loads(holder_path.read_text())["result"], json.loads(bindings_path.read_text())["result"]
    buff_bindings, assembly = [], []
    for index, component in enumerate(bindings["components"]):
        for pointer, node in walk(component["value"]):
            if node.get("templateKey") in KEYS:
                buff_bindings.append({"componentPointer": "/result/components/" + str(index),
                    "path": component["hierarchy"], "pathId": component["pathId"],
                    "file": component["file"], "script": component.get("script"),
                    "buffPointer": "/value" + pointer, "buff": node})
        name = (component.get("script") or {}).get("name")
        if name in ("Character", "UnitMode", "CastSkill", "ActiveBuffAbility") and not component["hierarchy"][0].startswith("enemy_"):
            selected = {key: value for key, value in component["value"].items()
                        if key in ("_modes", "_generalAbilities", "_attackBlackboardModeIndex", "_extraAbilities", "_buffs")}
            assembly.append({"componentPointer": "/result/components/" + str(index), "path": component["hierarchy"],
                             "pathId": component["pathId"], "script": name, "fields": selected})
    levels = ROOT / ".cache/native-research/checkpoint-nondefault-20261107/mirror-current/zh_CN/gamedata/levels"
    stage = levels / "activities/act29side/level_act29side_04.json"
    database = levels / "enemydata/enemy_database.json"
    level, enemies = json.loads(stage.read_text()), json.loads(database.read_text())["enemies"]
    keys = {"enemy_1372_ltntpt", "enemy_1372_ltntpt_2"}
    spawns = [{"pointer": pointer, "spawn": node} for pointer, node in walk(level)
              if node.get("actionType") == "SPAWN" and node.get("key") in keys and node.get("count", 0) > 0]
    matching = [{"pointer": "/enemies/" + str(index), "entry": enemy}
                for index, enemy in enumerate(enemies) if enemy["Key"] in keys]
    filters = [{"template": row["template"], "pointer": row["pointer"], "node": row["node"]}
               for row in holder["reasonFilters"]]
    by_cancel_reason = [{"template": row["template"], "pointer": row["pointer"], "mask": row["nondefault"]}
                        for row in holder["nondefaultPermissions"]]
    payload = {"provenance": {"checkedOn": "2026-11-14", "script": fingerprint(Path(__file__)),
               "inputs": [fingerprint(holder_path), fingerprint(bindings_path)], "stage": fingerprint(stage),
               "enemyDatabase": fingerprint(database), "mirrorRevision": "63c7cec73c3858d0ae913f85cc89af3cef4d744f",
               "scope": "Exact resource/table references and one ordinary stage SPAWN witness; not a live client observation or exhaustive Content activation proof."},
               "result": {"counts": {"templates": holder["templateCount"], "reasonFilters": len(filters),
               "nondefaultPermissions": len(by_cancel_reason), "blockDamageNodes": len(holder["blockDamageNodes"]),
               "showDamageNumberTrue": sum(bool(row["node"].get("_showDamageNumber")) for row in holder["blockDamageNodes"])},
               "reasonFilters": filters, "nondefaultPermissions": by_cancel_reason,
               "buffBindings": buff_bindings, "characterSkillAssembly": assembly,
               "ordinaryStage": {"sourceRelativePath": str(stage.relative_to(levels)), "spawns": spawns,
               "enemyDbRefs": [ref for ref in level.get("enemyDbRefs", []) if ref.get("id") in keys], "enemyEntries": matching}}}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"buffBindings": len(buff_bindings), "ordinarySpawns": len(spawns), "out": str(args.out)}))


if __name__ == "__main__":
    main()
