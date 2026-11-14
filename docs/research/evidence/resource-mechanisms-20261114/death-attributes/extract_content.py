#!/usr/bin/env python3
"""Reuse the verified prefab decoder with this investigation's explicit selection."""
import argparse
import importlib.util
import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True
ROOT = Path.cwd()
sys.path.insert(0, str(ROOT / ".agents/skills/arkbattle-native-research/scripts"))
from native import fingerprint

HELPER = ROOT / "docs/research/evidence/unit-classification-20261114/config/extract_prefabs.py"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--selection", type=Path,
                        default=Path(__file__).with_name("content-selection.json"))
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    spec = importlib.util.spec_from_file_location("resource_prefabs", HELPER)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    module.SELECTION = json.loads(args.selection.read_text())
    sys.argv = [str(HELPER), "--out", str(args.out)]
    module.main()
    payload = json.loads(args.out.read_text())
    payload["provenance"]["driver"] = fingerprint(Path(__file__))
    payload["provenance"]["selectionFile"] = fingerprint(args.selection)
    args.out.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()
