#!/usr/bin/env python3
"""Verify reused decoded witnesses against their recorded installed Bundle bytes."""
import hashlib
import json
from pathlib import Path


def fingerprint(path):
    data = path.read_bytes()
    return {"path": str(path), "bytes": len(data), "sha256": hashlib.sha256(data).hexdigest()}


root = Path.cwd()
old_path = root / "docs/research/evidence/action-timing-20261014/records.json"
old = json.loads(old_path.read_text())
heal_path = root / "docs/research/evidence/healing-settlement-20261103/content/characters/decoded-content.json"
heal = json.loads(heal_path.read_text())
sources = [
    {"path": old["enemyComponents"]["source"], "sha256": old["enemyComponents"]["sha256"]},
    {"path": old["prefabComponents"][48]["bundle"], "sha256": old["prefabComponents"][48]["sha256"]},
    heal["provenance"]["sources"][0],
]
checks = []
for source in sources:
    current = fingerprint(Path(source["path"]))
    checks.append({"recorded": source, "current": current, "identicalBytes": source["sha256"] == current["sha256"]})
output = root / "docs/research/evidence/facing-conditions-20261114/attack/config-resource-checks.json"
output.write_text(json.dumps({
    "collectedOn": "2026-11-14",
    "scope": "Historical decoded witnesses; only unchanged Bundle bytes may be reused as current local configuration evidence.",
    "script": fingerprint(Path(__file__)),
    "archives": [fingerprint(old_path), fingerprint(heal_path)],
    "checks": checks,
}, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({"out": str(output), "allIdentical": all(item["identicalBytes"] for item in checks)}))
