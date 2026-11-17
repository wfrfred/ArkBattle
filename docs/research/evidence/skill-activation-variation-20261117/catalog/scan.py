#!/usr/bin/env python3
"""Index fixed skill/character tables and retain variation keyword candidates.

This is a reproducible static search, not a native execution or a semantic
classifier. Manual decisions live in review.json and are kept separate.
"""
import argparse
import collections
import hashlib
import json
from pathlib import Path
import re


ROOT = Path(__file__).resolve().parents[5]
REVISION = "63c7cec73c3858d0ae913f85cc89af3cef4d744f"
PATTERNS = {
    "uses_or_phase": r"第[一二三四五六七八九十0-9]+次|首次|(?:累计|总计)(?:使用|释放|开启|发动)|(?:使用|释放|开启|发动)[一二三四五六七八九十0-9]+次后|每次(?:部署后)?(?:使用|开启|释放)|每使用|后续开启|下一次技能",
    "duration": r"持续.{0,32}(?:增加|延长|缩短|减少|变为|无限)|(?:增加|延长|缩短|减少|变为).{0,16}持续|技能.{0,32}(?:延长|缩短)",
    "automatic_start": r"自动.{0,8}(?:开启|释放|触发)|变为自动|重新释放|强制.{0,8}技能",
    "activation_resource": r"技力消耗|所需技力|消耗.{0,10}技力|魔力|(?:技能|技力).{0,12}上限|(?:技力|SP).{0,8}(?:需求|所需|消耗|耗费|上限)|(?:需求|所需|消耗|耗费).{0,8}(?:技力|SP)|充能.{0,12}(?:消耗|层数)|消耗.{0,12}充能",
    "content_branch": r"蓄力|过载|随机|二次|再次|切换|阶段",
    "program_replacement": r"技能.{0,24}(?:替换|转换|改变为|更换)|(?:替换|转换|更换).{0,24}技能",
}
KEY_PATTERN = re.compile(
    r"sp_cost|skill_cost|sp_require|spcost|trigger_type|skill_type|"
    r"enhanc\w*_duration|first_duration|duration_plus|duration_add|duration_ratio|"
    r"duration_scale|extend_duration|extra\.duration"
)


def fingerprint(path):
    raw = path.read_bytes()
    return {"path": str(path.resolve()), "bytes": len(raw),
            "sha256": hashlib.sha256(raw).hexdigest()}


def plain(text):
    return re.sub(r"<[^>]*>", "", text or "")


def matching(text):
    value = plain(text)
    return [name for name, pattern in PATTERNS.items() if re.search(pattern, value, re.IGNORECASE)]


def descriptions(rows):
    grouped = {}
    for index, row in enumerate(rows, 1):
        raw = row.get("description")
        grouped.setdefault(raw, []).append(index)
    return [{"levels": levels, "raw": raw, "plain": plain(raw)}
            for raw, levels in grouped.items()]


def level_config(index, row):
    return {"level": index, **{key: row.get(key) for key in (
        "name", "skillType", "durationType", "duration", "spData",
        "prefabId", "rangeId", "blackboard")}}


def obtainable_operator(character):
    return character.get("profession") not in ("TOKEN", "TRAP") and not character.get("isNotObtainable", False)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    base = ROOT / ".cache/native-research/route-operations-20261107/data"
    parser.add_argument("--characters", type=Path, default=base / "character_table.json")
    parser.add_argument("--skills", type=Path, default=base / "skill_table.json")
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    characters = json.loads(args.characters.read_text())
    skills = json.loads(args.skills.read_text())
    # Verify the claimed fixed revision against the earlier archived fingerprints.
    manifest_path = ROOT / "docs/research/evidence/skill-audit-20261117/lifecycle/result.json"
    manifest = json.loads(manifest_path.read_text())["provenance"]["mirror"]
    expected = {Path(value["path"]).name: value["sha256"] for value in manifest["inputs"]}
    for path in (args.characters, args.skills):
        if fingerprint(path)["sha256"] != expected[path.name]:
            raise ValueError(f"input does not match fixed mirror: {path}")
    if manifest["revision"] != REVISION:
        raise ValueError("fixed source revision mismatch")

    owners = collections.defaultdict(list)
    for character_id, character in characters.items():
        for slot, item in enumerate(character.get("skills") or [], 1):
            skill_id = item.get("skillId")
            if skill_id:
                owners[skill_id].append({
                    "characterId": character_id, "name": character.get("name"),
                    "profession": character.get("profession"),
                    "isNotObtainable": character.get("isNotObtainable"),
                    "obtainableOperatorSubset": obtainable_operator(character),
                    "slot": slot, "unlockCond": item.get("unlockCond"),
                    "overridePrefabKey": item.get("overridePrefabKey"),
                })

    candidates, inventory, level_variations = [], [], []
    for skill_id, skill in sorted(skills.items()):
        rows = skill.get("levels") or []
        text_matches = sorted({name for row in rows for name in matching(row.get("description"))})
        key_matches = sorted({item["key"] for row in rows for item in row.get("blackboard") or []
                              if KEY_PATTERN.search(item["key"])})
        triggers = sorted({row.get("skillType") for row in rows})
        duration_types = sorted({row.get("durationType") for row in rows})
        inventory.append({
            "skillId": skill_id, "name": rows[-1].get("name") if rows else None,
            "levelCount": len(rows), "referenced": skill_id in owners,
            "owners": owners.get(skill_id, []), "skillTypesAcrossLevels": triggers,
            "durationTypesAcrossLevels": duration_types,
        })
        if len(triggers) > 1 or len(duration_types) > 1:
            level_variations.append(skill_id)
        if text_matches or key_matches or skill_id in level_variations:
            candidates.append({
                "skillId": skill_id, "owners": owners.get(skill_id, []),
                "matchedTextFamilies": text_matches, "matchedBlackboardKeys": key_matches,
                "descriptions": descriptions(rows),
                "levels": [level_config(index, row) for index, row in enumerate(rows, 1)],
            })

    character_candidates = []
    for character_id, character in sorted(characters.items()):
        groups = [("trait", character.get("trait") or {})]
        groups.extend((f"talents/{index}", talent) for index, talent in enumerate(character.get("talents") or []))
        matched = []
        for path, group in groups:
            rows = group.get("candidates") or []
            if any(matching(row.get("description")) or any(KEY_PATTERN.search(item["key"])
                       for item in row.get("blackboard") or []) for row in rows):
                matched.append({"path": path, "candidates": rows})
        if matched:
            character_candidates.append({
                "characterId": character_id, "name": character.get("name"),
                "profession": character.get("profession"),
                "isNotObtainable": character.get("isNotObtainable"),
                "skills": character.get("skills"), "groups": matched,
            })

    referenced = set(owners)
    obtainable = {skill_id for skill_id, entries in owners.items()
                  if any(item["obtainableOperatorSubset"] for item in entries)}
    result = {
        "counts": {
            "skillTableRecords": len(skills), "characterTableRecords": len(characters),
            "charactersWithSkillReferences": sum(bool(item.get("skills")) for item in characters.values()),
            "referencedUniqueSkillIds": len(referenced),
            "referencedPresentInSkillTable": len(referenced & skills.keys()),
            "referencedMissingFromSkillTable": len(referenced - skills.keys()),
            "obtainableOperatorUniqueSkillIds": len(obtainable),
            "skillKeywordCandidates": len(candidates),
            "characterKeywordCandidates": len(character_candidates),
            "ordinaryAmmoDurationTypeSkillIds": sum(item["durationTypesAcrossLevels"] == ["AMMO"] for item in inventory),
            "candidateTextFamilies": {name: sum(name in item["matchedTextFamilies"] for item in candidates)
                                      for name in PATTERNS},
        },
        "missingReferences": [{"skillId": skill_id, "owners": owners[skill_id]}
                              for skill_id in sorted(referenced - skills.keys())],
        "unreferencedSkillTableIds": sorted(skills.keys() - referenced),
        "staticEnumDifferencesBetweenLevels": level_variations,
        "inventory": inventory,
        "skillCandidates": candidates,
        "characterCandidates": character_candidates,
    }
    output = {
        "provenance": {
            "collectedOn": "2026-11-17", "script": fingerprint(Path(__file__)),
            "repository": "Kengxxiao/ArknightsGameData", "revision": REVISION,
            "inputs": [fingerprint(args.characters), fingerprint(args.skills)],
            "fixedFingerprintManifest": fingerprint(manifest_path),
            "textPatterns": PATTERNS, "blackboardKeyPattern": KEY_PATTERN.pattern,
            "scope": "All skill_table records; all character_table skills references including TOKEN/TRAP and non-obtainable records; all character trait/talent candidates. SkillID deduplicated, every data level searched. Keyword hits are candidates, not semantic conclusions. No native/client execution; no claim to inspect other source tables, modules or external effects.",
        },
        "result": result,
    }
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"output": str(args.out), **result["counts"]}, ensure_ascii=False))


if __name__ == "__main__":
    main()
