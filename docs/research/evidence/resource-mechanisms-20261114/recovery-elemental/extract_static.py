#!/usr/bin/env python3
"""Archive pinned elemental-break configuration and selected character inputs."""
import argparse
import hashlib
import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path.cwd() / ".agents/skills/arkbattle-native-research/scripts"))
from native import fingerprint

REVISION = "bee3f83c5d60590b5e1cd42b8d09d00ce32ab10d"
EP_HASH = "5d2df31b72546fe0b320173311b44231473080a788a0ac9575eeec58f1c7e8a4"
CHAR_REVISION = "17759cc8cdf37388414145d16262a3a06f3ab25e"
CHAR_HASH = "e523c7c83c36e2d76697121079e17d0282da1a94d59a55e1cc55616edf0b41c4"
CHAR_IDS = ["char_491_humus", "char_4125_rdoc", "char_4235_thumpy", "char_1016_agoat2", "char_4056_titi", "char_1042_phatm2", "char_2026_yu", "char_4119_wanqin", "char_1012_skadi2", "char_473_mberry"]


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--ep-table", type=Path, required=True)
    p.add_argument("--character-table", type=Path, default=Path(".cache/native-research/unit-audit-20261110/operator-config/character_table.json"))
    p.add_argument("--skill-table", type=Path, default=Path(".cache/native-research/route-operations-20261107/data/skill_table.json"))
    p.add_argument("--out", type=Path, required=True)
    a = p.parse_args()
    ep_raw = a.ep_table.read_bytes()
    if hashlib.sha256(ep_raw).hexdigest() != EP_HASH:
        raise ValueError("EP table byte fingerprint differs")
    char_raw = a.character_table.read_bytes()
    if hashlib.sha256(char_raw).hexdigest() != CHAR_HASH:
        raise ValueError("Character table byte fingerprint differs")
    chars = json.loads(char_raw)
    skill_raw = a.skill_table.read_bytes()
    if hashlib.sha256(skill_raw).hexdigest() != "492900f6b957233296c9736c86bb4e5f3ab4b4d7f5055a0f973c5acec3d174b1":
        raise ValueError("Pinned skill table differs")
    skills = json.loads(skill_raw)
    projected = {key: {"pointer": "/" + key, "name": chars[key]["name"],
                       "trait": chars[key].get("trait"), "talents": chars[key].get("talents"),
                       "skills": chars[key].get("skills")}
                 for key in CHAR_IDS}
    ep_blob = hashlib.sha1(b"blob " + str(len(ep_raw)).encode() + b"\0" + ep_raw).hexdigest()
    sources = [{"url": f"https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/{REVISION}/zh_CN/gamedata/battle/ep_breakbuff_table.json",
                "revision": REVISION, "pointer": "", "bytes": len(ep_raw), "sha256": EP_HASH, "gitBlobSha1": ep_blob},
               {"url": f"https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/{CHAR_REVISION}/zh_CN/gamedata/excel/character_table.json",
                "revision": CHAR_REVISION, **fingerprint(a.character_table)},
               {"url": "https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/63c7cec73c3858d0ae913f85cc89af3cef4d744f/zh_CN/gamedata/excel/skill_table.json",
                "revision": "63c7cec73c3858d0ae913f85cc89af3cef4d744f", **fingerprint(a.skill_table)}]
    result = {"provenance": {"collectedOn": "2026-11-14", "script": fingerprint(Path(__file__)),
                            "sources": sources, "scope": "Pinned extracted static game data; table configuration and character resource selection, not live battle observation."},
              "result": {"elementBreakTable": json.loads(ep_raw), "characters": projected,
                         "skills": {key: {"pointer": "/" + key, "definition": skills[key]}
                                    for key in ("skchr_phatm2_3", "skchr_titi_3")}}}
    a.out.parent.mkdir(parents=True, exist_ok=True)
    a.out.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"elementTypes": list(result["result"]["elementBreakTable"]), "characters": len(projected)}))


if __name__ == "__main__":
    main()
