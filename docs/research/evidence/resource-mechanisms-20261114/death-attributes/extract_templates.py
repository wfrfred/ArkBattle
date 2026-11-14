#!/usr/bin/env python3
"""Select full template programs used by the death/attribute examples."""
import argparse
import importlib.util
import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True
ROOT = Path.cwd()
sys.path.insert(0, str(ROOT / ".agents/skills/arkbattle-native-research/scripts"))
from native import fingerprint

HELPER = ROOT / "docs/research/evidence/unit-classification-20261114/config/extract_templates.py"
KEYS = {"saga_t_1", "saga_s_2", "cripple", "suicide", "kill_to_add_sp",
        "rmixer_e_002_t1", "nasti_nstchr[blood_one]", "trap_pirene_init"}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    spec = importlib.util.spec_from_file_location("resource_templates", HELPER)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    module.KEYS = KEYS
    sys.argv = [str(HELPER), "--out", str(args.out)]
    module.main()
    payload = json.loads(args.out.read_text())
    payload["provenance"]["driver"] = fingerprint(Path(__file__))
    payload["provenance"]["selectedKeys"] = sorted(KEYS)
    args.out.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()
