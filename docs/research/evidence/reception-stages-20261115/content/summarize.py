#!/usr/bin/env python3
"""Group the full reaction inventory and extract exact static activation witnesses."""
import argparse
from collections import Counter, defaultdict
import hashlib
import json
from pathlib import Path
import re
import sys

sys.dont_write_bytecode = True
ROOT = Path.cwd()
sys.path.insert(0, str(ROOT / ".agents/skills/arkbattle-native-research/scripts"))
from native import fingerprint
ENEMY_DB = ROOT / ".cache/native-research/leithanien-enemydata-20261109/enemy_database.json"
SKILL_DB = ROOT / ".cache/native-research/route-operations-20261107/data/skill_table.json"
LEVEL_ROOT = ROOT / ".cache/native-research/checkpoint-nondefault-20261107/mirror-current/zh_CN/gamedata/levels"
LEVEL_PROFILE = ROOT / ".cache/native-research/checkpoint-nondefault-20261107/current-profile.json"
ENEMIES = ("enemy_10231_agpack", "enemy_1323_wdbshd", "enemy_1372_ltntpt", "enemy_1405_boomer", "enemy_10002_trtrsl", "enemy_19051_wlrage", "enemy_7010_bldrgn")


def walk(value, pointer=""):
    if isinstance(value, dict):
        yield pointer, value
        for key, child in value.items():
            yield from walk(child, pointer + "/" + str(key).replace("~", "~0").replace("/", "~1"))
    elif isinstance(value, list):
        for index, child in enumerate(value):
            yield from walk(child, pointer + "/" + str(index))


def family(name):
    name = name.rsplit("+", 1)[-1]
    if name.startswith(("If", "Is", "Check", "Filter", "Compare", "Has", "Vertify", "Dice", "RandomSetter", "AutoChessCheck", "Act49SideCheck", "Act33SideDamage")) or name in ("AlwaysNext", "AlwaysExecuteNodeList"):
        return "predicate_and_control"
    if any(word in name for word in ("CancelModifier", "BlockDamage", "BlockElementDamage", "Evade", "DamageScale", "DamageFixedValueResistance", "DamageValueModify", "ModifyDamageValue", "ModifierScaleUp", "HpNoLessThan", "EpDamageScale", "EnsureDmgOrHeal", "ChangeModifierSource", "SetSharedFlag", "SetIgnore", "ResetAbilityAtkScale")):
        return "current_modifier_and_permissions"
    if name.startswith(("CreateBuff", "CreateCardBuff", "AddBuffTo", "FinishBuff", "FinishDerived", "FinishOneBuff", "ClearAllBuffs", "TriggerBuff")):
        return "buff_install_remove_trigger"
    if name.startswith(("Assign", "CalculateBlackboard", "BlackboardAdd", "AddBuffBlackboard", "AddCharacterSharedBlackboard", "ModifyBlackboard", "CoopRecord")) or name in ("AttributeModifierWithCertainBuffCount", "AddFeverBySourceIfNotFull"):
        return "blackboard_counter_or_attribute_write"
    if name.startswith(("ModifySp", "ClearEnemySp", "ModifyCost", "AmmoSkillCountModifier", "SetCharacterMaxEs", "GainToken")):
        return "resource_write"
    if name.startswith(("Damage", "AdvancedApplyDamage", "FixedValueDamage", "FixedValueHeal", "Heal", "InverseDamage", "AOEDamage", "ApplyElement", "ApplyFixedElement", "SplitDamage", "AutoChessDamageSplit")):
        return "nested_damage_healing_or_split"
    if name.startswith(("TriggerAbility", "TriggerSkill", "TriggerAutoSkill", "TriggerEnemySkill", "Interrupt", "SwitchMode", "CharSkillManual")):
        return "skill_action_or_mode_change"
    if name.startswith(("CreateEffect", "PlayAudio", "SetSpineSkin", "LogExtraBattleInfo", "SandboxShowToast")):
        return "presentation_or_log"
    if name.startswith(("SetDisappear", "SetBodyDirection", "SwitchDirection", "SwitchSourceDirection", "ReleaseFromBlocker", "InsertCheckPoint", "ClearCheckpoint", "EnemySkipWait", "ForceSet", "Ristar", "SpawnToken", "Summon", "SurvivalSummon", "InstantKill", "MoveNextLevelBranch", "PickRandomBranchPhase", "CreateTileEffect", "RewriteTileOptions")):
        return "spatial_spawn_route_or_lifecycle"
    return "mode_specific_or_unclassified"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--batch", type=Path, required=True)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    inventory = json.loads((args.batch / "inventory.json").read_text())["result"]
    programs = json.loads((args.batch / "programs.json").read_text())["result"]["programs"]
    search = json.loads((args.batch / "resource-search.json").read_text())["result"]
    definitions = defaultdict(list)
    for hit in search["hits"]:
        for reference in hit["references"]:
            definitions[reference["resolvedTemplateKey"]].append({
                "bundle": hit["bundle"], "file": hit["file"], "pathId": hit["pathId"], "hierarchy": hit["hierarchy"],
                "pointer": reference["pointer"], "buffKey": reference["buffKey"], "templateKey": reference["templateKey"], "loadFromDB": reference["loadFromDB"],
            })
    nodes = defaultdict(list)
    for node in inventory["nodes"]:
        nodes[(node["template"], node["event"])].append(node)
    counts = defaultdict(Counter)
    rows = []
    for program in programs:
        entries = nodes[(program["template"], program["event"])]
        classes = Counter(family(node["nodeType"]) for node in entries)
        counts[program["event"]].update(classes)
        rows.append({"template": program["template"], "event": program["event"], "families": dict(sorted(classes.items())),
            "nodeTypes": sorted({node["nodeType"].rsplit("+", 1)[-1] for node in entries}),
            "bindingStatus": "exact_serialized_reference" if definitions[program["template"]] else "no_direct_reference_in_scanned_families",
            "directReferences": definitions[program["template"]],
            "scopeNote": "Sandbox name identifies an excluded-mode program; no claim of global non-use." if program["template"].startswith("sandbox") else "Binding and conditional execution require the selected path evidence; this inventory is not an activation assertion."})
    enemy_data = json.loads(ENEMY_DB.read_text())
    skill_data = json.loads(SKILL_DB.read_text())
    static = {"enemies": [entry for entry in enemy_data["enemies"] if entry["Key"] in ENEMIES],
              "skills": {key: skill_data[key] for key in ("skchr_tippi_2", "skchr_agoat2_2", "skchr_philae_1", "skchr_philae_2") if key in skill_data}}
    files, level_hits, errors = [], [], []
    for path in sorted(LEVEL_ROOT.rglob("level_*.json")):
        raw = path.read_bytes()
        digest = hashlib.sha256(raw).hexdigest()
        files.append({"path": str(path.relative_to(LEVEL_ROOT)), "sha256": digest})
        if not any(enemy.encode() in raw for enemy in ENEMIES):
            continue
        try:
            value = json.loads(raw)
            refs = [(pointer, entry) for pointer, entry in walk(value.get("enemyDbRefs", [])) if entry.get("id") in ENEMIES]
            ids = {entry["id"] for _, entry in refs}
            actions = [{"pointer": pointer, "action": entry} for pointer, entry in walk(value)
                       if entry.get("actionType") == "SPAWN" and entry.get("key") in ids]
            level_hits.append({"path": str(path.relative_to(LEVEL_ROOT)), "sha256": digest,
                "gitBlob": hashlib.sha1(b"blob " + str(len(raw)).encode() + b"\0" + raw).hexdigest(),
                "enemyDbRefs": [{"pointer": "/enemyDbRefs" + pointer, "value": entry} for pointer, entry in refs],
                "spawns": actions, "excludedMode": any(part in ("sandbox", "tower") for part in path.relative_to(LEVEL_ROOT).parts)})
        except Exception as error:
            errors.append({"path": str(path), "error": str(error)})
    provenance = {"checkedOn": "2026-11-15", "script": fingerprint(Path(__file__)),
        "inputs": [fingerprint(args.batch / name) for name in ("inventory.json", "programs.json", "resource-search.json")],
        "enemyData": fingerprint(ENEMY_DB), "skillData": fingerprint(SKILL_DB), "levelProfile": fingerprint(LEVEL_PROFILE),
        "levelRevision": "63c7cec73c3858d0ae913f85cc89af3cef4d744f", "scope": "Syntactic action families guide selection, not native semantics. Every installed selected-event program is classified, direct serialized bindings are separated from runtime activation. Static tables/levels are fixed mirror data, independently versioned from resources."}
    args.out.mkdir(parents=True, exist_ok=True)
    for name, result in {
        "family-inventory.json": {"programs": rows, "nodeCountsByEvent": {str(key): dict(sorted(value.items())) for key, value in counts.items()}},
        "static-inputs.json": static,
        "level-witnesses.json": {"complete": not errors, "selection": list(ENEMIES), "scannedFiles": files, "matches": level_hits, "errors": errors},
    }.items():
        (args.out / name).write_text(json.dumps({"provenance": provenance, "result": result}, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"programs": len(rows), "directlyBoundPrograms": sum(bool(row["directReferences"]) for row in rows), "levels": len(files), "matchedLevels": len(level_hits), "spawnActions": sum(len(row["spawns"]) for row in level_hits), "errors": len(errors)}))


if __name__ == "__main__":
    main()
