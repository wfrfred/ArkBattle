#!/usr/bin/env python3
"""Extract one pinned level's predefined operator and separate Card configuration."""
import argparse
import hashlib
import json
import subprocess
import sys
from pathlib import Path

REVISION = "bee3f83c5d60590b5e1cd42b8d09d00ce32ab10d"
SOURCE = "zh_CN/gamedata/levels/obt/main/level_main_08-09.json"
EXPECTED_SHA256 = "1321e847d9d2c4c873c72d0c108fe424fbcd38cc205583feb30f1b0b09adf9b3"


def fingerprint(path):
    data = path.read_bytes()
    return {
        "path": str(path.resolve()),
        "bytes": len(data),
        "sha256": hashlib.sha256(data).hexdigest(),
    }


parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument(
    "--repo", type=Path,
    default=Path(".cache/native-research/checkpoint-nondefault-20261107/mirror"),
    help="existing local Kengxxiao/ArknightsGameData checkout containing the pinned commit",
)
parser.add_argument("--out", type=Path, required=True)
args = parser.parse_args()
source_path = args.repo / SOURCE
raw = source_path.read_bytes()
blob = subprocess.check_output([
    "git", "-C", str(args.repo), "show", f"{REVISION}:{SOURCE}",
])
if raw != blob:
    raise ValueError("working-tree source differs from the pinned revision's Git blob")
if hashlib.sha256(raw).hexdigest() != EXPECTED_SHA256:
    raise ValueError("source bytes differ from the recorded raw SHA-256")
blob_oid = subprocess.check_output([
    "git", "-C", str(args.repo), "rev-parse", f"{REVISION}:{SOURCE}",
], text=True).strip()
level = json.loads(raw)
excerpts = {
    "/predefines/characterInsts/0": level["predefines"]["characterInsts"][0],
    "/predefines/characterCards": level["predefines"]["characterCards"],
    "/hardPredefines/characterCards": level["hardPredefines"]["characterCards"],
}
record = {
    "provenance": {
        "collectedOn": "2026-11-12",
        "scope": "Pinned static level configuration; no native call-chain or runtime observation.",
        "repository": "Kengxxiao/ArknightsGameData",
        "commit": REVISION,
        "path": SOURCE,
        "url": f"https://github.com/Kengxxiao/ArknightsGameData/blob/{REVISION}/{SOURCE}",
        "source": fingerprint(source_path),
        "rawSha256": EXPECTED_SHA256,
        "gitBlobOid": blob_oid,
        "workingTreeMatchesPinnedBlob": True,
        "tool": {"script": fingerprint(Path(__file__)), "python": sys.version},
        "selectors": list(excerpts),
    },
    "result": {"excerpts": excerpts},
}
args.out.mkdir(parents=True, exist_ok=True)
(args.out / "level_main_08-09.json").write_text(
    json.dumps(record, ensure_ascii=False, indent=2) + "\n",
)
print(json.dumps({"source": SOURCE, "selectors": list(excerpts)}, ensure_ascii=False))
