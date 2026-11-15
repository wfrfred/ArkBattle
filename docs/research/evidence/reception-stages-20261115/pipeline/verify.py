#!/usr/bin/env python3
"""Independently re-extract the bounded reception pipeline and compare all result bytes."""
import argparse
import ast
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys

ROOT = Path.cwd()
HERE = Path(__file__).resolve().parent


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)
    destination = args.out / "native.json"
    command = ["uv", "run", "--offline", str(HERE / "extract.py"), "--out", str(destination)]
    subprocess.run(command, cwd=ROOT, env=os.environ | {"UV_CACHE_DIR": str(ROOT / ".cache/uv")}, check=True)
    source = json.loads((HERE / "native.json").read_text())
    replay = json.loads(destination.read_text())
    assert source["result"] == replay["result"], "pipeline result changed"
    for script in HERE.glob("*.py"):
        ast.parse(script.read_text(), filename=str(script))
    result = {"scope": "Independent complete static method-body and enum re-extraction; no gameplay execution or product test.",
              "script": {"path": str(Path(__file__).relative_to(ROOT)), "sha256": sha(Path(__file__))},
              "command": command, "equalResult": True,
              "archivedSha256": sha(HERE / "native.json"), "reextractedSha256": sha(destination),
              "bodyCount": len(source["result"]["bodies"]),
              "enumCount": len(source["result"]["enums"])}
    (args.out / "verification.json").write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"equalResult": True, "bodies": result["bodyCount"], "out": str(args.out)}))


if __name__ == "__main__":
    main()
