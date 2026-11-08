#!/usr/bin/env python3
"""Record a bounded EnemyDB lookup without treating an old mirror as current."""
import argparse
import hashlib
import json
from pathlib import Path


def digest(path):
    raw = path.read_bytes()
    return {
        "path": str(path),
        "bytes": len(raw),
        "sha256": hashlib.sha256(raw).hexdigest(),
        "gitBlobSha1": hashlib.sha1(
            f"blob {len(raw)}\0".encode() + raw
        ).hexdigest(),
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--database", type=Path, required=True)
    parser.add_argument("--commit", type=Path, required=True)
    parser.add_argument("--encrypted-level", type=Path, required=True)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    commit = json.loads(args.commit.read_text())
    database = json.loads(args.database.read_text())
    keys = ["enemy_9025_aclts", "enemy_9026_acltm"]
    matches = [row for row in database["enemies"] if row["Key"] in keys]
    source = digest(args.database)
    # This blob SHA was independently returned by the GitHub contents tool.
    assert source["gitBlobSha1"] == "62ab806926b9c8ca5c80524730caf0066f6c2c2f"
    result = {
        "provenance": {
            "collectedOn": "2026-11-09",
            "script": digest(Path(__file__)),
            "mirror": {
                "repository": "Kengxxiao/ArknightsGameData",
                "requestedRef": "master",
                "observedHeadCommit": commit["sha"],
                "observedHeadCommitDate": commit["commit"]["committer"]["date"],
                "path": "zh_CN/gamedata/levels/enemydata/enemy_database.json",
                "immutableBlobUrl": "https://api.github.com/repos/Kengxxiao/ArknightsGameData/git/blobs/" + source["gitBlobSha1"],
                "file": source,
            },
            "encryptedLevelCache": digest(args.encrypted_level),
            "scope": "Two exact keys in the downloaded global EnemyDB only. The observed repository head predates the 2026-11-08 release; this is not the installed hot-update EnemyDB. No current encrypted level was decrypted.",
        },
        "result": {
            "keys": keys,
            "globalEnemyEntriesScanned": len(database["enemies"]),
            "matches": matches,
            "unresolvedFields": ["sideType", "blockCnt", "moveSpeed", "levelOverrides"],
            "conclusion": "This mirror does not establish values for either new summon. Zero hits do not establish absence from the current client.",
        },
    }
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps(result["result"], ensure_ascii=False))


if __name__ == "__main__":
    main()
