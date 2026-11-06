#!/usr/bin/env python3
"""Reproduce finite field profiles and retain complete, pointer-addressed samples.

Run shared config.py select first; this script is a batch-specific report, not an
alternative JSON selector. Source cache is optional to retain in git: refetch the
manifest's pinned raw URLs to reconstruct it, then verify the recorded hashes.
"""
import argparse
import collections
import hashlib
import json
from pathlib import Path


def read(path):
    return json.loads(Path(path).read_text())


def write(path, value):
    Path(path).write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")


def pointer(value, path):
    for token in path.lstrip("/").split("/"):
        token = token.replace("~1", "/").replace("~0", "~")
        value = value[int(token)] if isinstance(value, list) else value[token]
    return value


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--selection", default=".cache/native-research/scheduler-general-20261107/action-configs.json")
    parser.add_argument("--batch", default="docs/research/evidence/scheduler-general-20261107/config")
    args = parser.parse_args()
    batch = Path(args.batch)
    manifest = read(batch / "sources.json")
    lookup = {Path(row["cache"]).name: row for row in manifest["sources"]}
    docs = {}
    for row in manifest["sources"]:
        data = Path(row["cache"]).read_bytes()
        docs[row["path"]] = json.loads(data)
        row["bytes"] = len(data)
        row["connectorTextSha256"] = hashlib.sha256(data).hexdigest()
        row["canonicalJsonSha256"] = hashlib.sha256(json.dumps(docs[row["path"]], ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode()).hexdigest()
        row["cachedGitBlobSha1"] = hashlib.sha1(b"blob " + str(len(data)).encode() + b"\0" + data).hexdigest()
        row["cacheMatchesGithubBlob"] = row["cachedGitBlobSha1"] == row["githubBlobSha"]
        assert row["cacheMatchesGithubBlob"], f"Source fingerprint mismatch: {row['path']}"
    write(batch / "sources.json", manifest)
    selected = read(args.selection)
    assert selected["result"]["complete"] and not selected["result"]["errors"]
    actions = []
    for row in selected["result"]["matches"]:
        source = lookup[Path(row["source"]).name]
        actions.append({"file": source["path"], "pointer": row["pointer"], "action": row["value"]})
    fields = ["actionType", "managedByScheduler", "key", "count", "preDelay", "interval", "useExtraRoute", "routeIndex", "blockFragment", "autoPreviewRoute", "autoDisplayEnemyInfo", "isUnharmfulAndAlwaysCountAsKilled", "hiddenGroup", "randomSpawnGroupKey", "randomSpawnGroupPackKey", "randomType", "refreshType", "weight", "dontBlockWave", "forceBlockWaveInBranch", "isValid", "notCountInTotal", "extraMeta", "actionId"]
    profiles = {}
    for field in fields:
        values = collections.Counter(json.dumps(row["action"][field], ensure_ascii=False, sort_keys=True) for row in actions if field in row["action"])
        profiles[field] = {"missing": sum(field not in row["action"] for row in actions), "values": [{"value": json.loads(value), "count": count} for value, count in values.most_common()]}
    checks = {
        "managedByScheduler=false": lambda a: a.get("managedByScheduler") is False,
        "blockFragment=true": lambda a: a.get("blockFragment") is True,
        "dontBlockWave=true": lambda a: a.get("dontBlockWave") is True,
        "forceBlockWaveInBranch=true": lambda a: a.get("forceBlockWaveInBranch") is True,
        "hiddenGroup nonempty": lambda a: bool(a.get("hiddenGroup")),
        "randomSpawnGroupKey nonempty": lambda a: bool(a.get("randomSpawnGroupKey")),
        "randomSpawnGroupPackKey nonempty": lambda a: bool(a.get("randomSpawnGroupPackKey")),
        "randomType non-ALWAYS": lambda a: "randomType" in a and a["randomType"] != "ALWAYS",
        "refreshType non-ALWAYS": lambda a: "refreshType" in a and a["refreshType"] != "ALWAYS",
        "ActionData notCountInTotal=true": lambda a: a.get("notCountInTotal") is True,
        "non-SPAWN named enum": lambda a: isinstance(a.get("actionType"), str) and a["actionType"] != "SPAWN",
        "count>1": lambda a: a.get("count", 0) > 1,
        "preDelay>0": lambda a: a.get("preDelay", 0) > 0,
        "interval>0": lambda a: a.get("interval", 0) > 0,
        "routeIndex>0": lambda a: a.get("routeIndex", 0) > 0,
        # UI helpers are consumed when queuing SPAWN. Merely retaining the same
        # field on STORY or another action kind is not a consumption witness.
        # Numeric enum values remain uninterpreted in this batch.
        "autoPreviewRoute=true on named SPAWN": lambda a: a.get("actionType") == "SPAWN" and a.get("autoPreviewRoute") is True,
        "autoDisplayEnemyInfo=true on named SPAWN": lambda a: a.get("actionType") == "SPAWN" and a.get("autoDisplayEnemyInfo") is True,
        "isUnharmfulAndAlwaysCountAsKilled=true": lambda a: a.get("isUnharmfulAndAlwaysCountAsKilled") is True,
        "empty key": lambda a: a.get("key") == "",
    }
    # One complete source node can witness several positive timing fields. Use
    # ordinary main-wave SPAWN nodes for scheduling, UI, and unharmful flags;
    # use a real weighted empty-key candidate for the empty-key check.
    focused_witnesses = {
        label: ("level_main_00-01.json", "/waves/0/fragments/2/actions/0")
        for label in ["count>1", "preDelay>0", "interval>0", "routeIndex>0", "autoPreviewRoute=true on named SPAWN"]
    }
    focused_witnesses.update({
        "autoDisplayEnemyInfo=true on named SPAWN": ("level_main_12-18.json", "/waves/0/fragments/0/actions/0"),
        "isUnharmfulAndAlwaysCountAsKilled=true": ("level_main_06-15.json", "/waves/0/fragments/0/actions/0"),
        "empty key": ("level_rogue1_1-1.json", "/waves/0/fragments/0/actions/0"),
    })
    coverage = {}
    retained = {}
    for label, check in checks.items():
        rows = [row for row in actions if check(row["action"])]
        coverage[label] = {"actions": len(rows), "files": len({row["file"] for row in rows}), "unsupportedSandboxActions": sum("/sandbox/" in row["file"] for row in rows), "examples": []}
        if label in focused_witnesses:
            file, path = focused_witnesses[label]
            row = next(row for row in rows if Path(row["file"]).name == file and row["pointer"] == path)
            coverage[label]["examples"].append({"file": row["file"], "pointer": row["pointer"]})
            retained.setdefault((row["file"], row["pointer"]), {**row, "reasons": []})["reasons"].append(label)
            continue
        # Keep different files, action kinds and literal field values. These are
        # actual source nodes, not fabricated truth-table combinations.
        seen = set()
        for row in rows:
            a = row["action"]
            signature = (row["file"], a.get("actionType"), a.get("hiddenGroup"), a.get("randomType"), a.get("refreshType"))
            if signature in seen:
                continue
            seen.add(signature)
            identity = (row["file"], row["pointer"])
            if len(coverage[label]["examples"]) < 8:
                coverage[label]["examples"].append({"file": row["file"], "pointer": row["pointer"]})
                retained.setdefault(identity, {**row, "reasons": []})["reasons"].append(label)
    # Ensure every named non-SPAWN kind is represented even if the per-check
    # example cap is reached by repeated STORY/DISPLAY_ENEMY_INFO samples.
    for kind in sorted({row["action"]["actionType"] for row in actions if isinstance(row["action"].get("actionType"), str) and row["action"]["actionType"] != "SPAWN"}):
        row = next(row for row in actions if row["action"]["actionType"] == kind)
        retained.setdefault((row["file"], row["pointer"]), {**row, "reasons": []})["reasons"].append("named action kind " + kind)
    # Preserve adjacent alternatives for pack/group comparison.
    wanted = {
        "level_main_00-01.json": ["/waves/0/fragments/0/actions/0", "/waves/0/fragments/1/actions/0"],
        "level_guide_02.json": ["/waves/0/fragments/2/actions/2"],
        "level_rogue4_1-1.json": ["/waves/0/fragments/0/actions/8", "/waves/0/fragments/0/actions/9", "/waves/0/fragments/1/actions/2", "/waves/0/fragments/1/actions/3"],
        "level_rogue1_t-1.json": ["/waves/0/fragments/0/actions/0", "/waves/0/fragments/0/actions/1", "/waves/0/fragments/1/actions/1"],
        "level_rogue5_b-9-a.json": ["/branches/dysuib_relic_branch/phases/0/actions/0", "/branches/dysuib_relic_branch/phases/0/actions/1"],
        "level_act1multi_01.json": ["/waves/3/fragments/0/actions/93", "/waves/3/fragments/0/actions/94"],
        "level_main_17-17.json": ["/waves/0/fragments/0/actions/2"],
    }
    for row in actions:
        if row["pointer"] in wanted.get(Path(row["file"]).name, []):
            retained.setdefault((row["file"], row["pointer"]), {**row, "reasons": []})["reasons"].append("comparison/context sample")
    enemy_overrides = []
    for file, doc in docs.items():
        for index, enemy in enumerate(doc.get("enemyDbRefs", [])):
            field = (enemy.get("overwrittenData") or {}).get("notCountInTotal") or {}
            if field.get("m_defined") is True:
                enemy_overrides.append({"file": file, "pointer": f"/enemyDbRefs/{index}", "value": enemy, "spawnActionPointers": [row["pointer"] for row in actions if row["file"] == file and row["action"].get("key") == enemy.get("id")]})
    sample_rows = list(retained.values())
    # Assertions guarantee excerpts refer to exactly preserved source values.
    for row in sample_rows:
        assert pointer(docs[row["file"]], row["pointer"]) == row["action"]
    write(batch / "samples.json", {"revision": manifest["revision"], "scope": "Complete source action nodes at listed pointers; configuration presence is not runtime observation.", "samples": sample_rows, "enemyNotCountInTotalOverrides": enemy_overrides})
    cohorts = {}
    for name, excluded in [("generalNonSandboxSample", False), ("excludedSandboxFieldControls", True)]:
        source_docs = {file: doc for file, doc in docs.items() if ("/sandbox/" in file) == excluded}
        source_actions = [row for row in actions if row["file"] in source_docs]
        field_profiles = {}
        for field in fields:
            values = collections.Counter(json.dumps(row["action"][field], ensure_ascii=False, sort_keys=True) for row in source_actions if field in row["action"])
            field_profiles[field] = {"missing": sum(field not in row["action"] for row in source_actions), "values": [{"value": json.loads(value), "count": count} for value, count in values.most_common()]}
        cohorts[name] = {"scope": "Excluded gameplay; field-source comparison only, no Core requirement" if excluded else "Finite non-sandbox sample; source variety does not itself establish gameplay support requirements", "files": len(source_docs), "actions": len(source_actions), "namedActions": sum(isinstance(row["action"].get("actionType"), str) for row in source_actions), "numericEnumActions": sum(isinstance(row["action"].get("actionType"), int) for row in source_actions), "fields": field_profiles, "coverage": {label: {"actions": sum(check(row["action"]) for row in source_actions), "files": len({row["file"] for row in source_actions if check(row["action"])})} for label, check in checks.items()}}
    write(batch / "profile.json", {"revision": manifest["revision"], "scope": manifest["scope"], "files": len(docs), "actions": len(actions), "namedActions": sum(isinstance(row["action"].get("actionType"), str) for row in actions), "numericEnumActions": sum(isinstance(row["action"].get("actionType"), int) for row in actions), "fields": profiles, "coverage": coverage, "cohorts": cohorts, "retainedSamples": len(sample_rows), "enemyNotCountInTotalOverrides": len(enemy_overrides), "sourceHashMatches": sum(row["cacheMatchesGithubBlob"] for row in manifest["sources"])})
    print(json.dumps({"files": len(docs), "actions": len(actions), "samples": len(sample_rows), "sourceHashMatches": sum(row["cacheMatchesGithubBlob"] for row in manifest["sources"]), "coverage": {key: row["actions"] for key, row in coverage.items()}}, ensure_ascii=False))


if __name__ == "__main__":
    main()
