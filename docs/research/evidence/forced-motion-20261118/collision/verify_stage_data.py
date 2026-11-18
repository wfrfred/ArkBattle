#!/usr/bin/env python3
import argparse
import hashlib
import json
import re
import subprocess
from collections import Counter
from pathlib import Path

parser = argparse.ArgumentParser(description="Verify fixed-revision data and cross-check the installed per-cell collider fixtures.")
parser.add_argument("--mirror", type=Path, required=True)
parser.add_argument("--levels", type=Path, required=True)
parser.add_argument("--equip", type=Path, required=True)
parser.add_argument("--tile-assets", type=Path, required=True)
parser.add_argument("--out", type=Path, required=True)
args = parser.parse_args()

repo = "https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData"
revision = "63c7cec73c3858d0ae913f85cc89af3cef4d744f"
equipment_revision = "17759cc8cdf37388414145d16262a3a06f3ab25e"
assets = json.loads(args.tile_assets.read_bytes())
bundles = {Path(b["source"]["path"]).stem:b for b in assets["result"]["bundles"]}
stages = [
    ("2-8", "obt/main/level_main_02-08.json", "https://prts.wiki/w/2-8"),
    ("TR-14", "obt/training/level_training_14.json", "https://prts.wiki/w/TR-14"),
    ("CH-5", "obt/training/level_mechanism_5.json", "https://prts.wiki/w/CH-5"),
]
def source(raw, revision, relative_path):
    sha1 = hashlib.sha1(f"blob {len(raw)}\0".encode()+raw).hexdigest()
    return {"url":f"{repo}/{revision}/{relative_path}","revision":revision,
            "bytes":len(raw),"sha256":hashlib.sha256(raw).hexdigest(),"gitBlobSha1":sha1}

results = []
for label, relpath, wiki in stages:
    raw = (args.levels / relpath).read_bytes()
    filepath = f"zh_CN/gamedata/levels/{relpath}"
    src = source(raw, revision, filepath)
    fetched_blob = subprocess.check_output(["git", "-C", str(args.mirror), "rev-parse", f"{revision}:{filepath}"],
                                          text=True).strip()
    assert fetched_blob == src["gitBlobSha1"]
    doc = json.loads(raw)
    map_data = doc["mapData"]
    map_rows = map_data["map"]
    colliders = {}
    names = {}
    for file in bundles[Path(relpath).stem]["files"]:
        for c in file["colliders"]:
            g = c.get("gameObject")
            if not g or g["layer"] != 8:
                continue
            match = re.fullmatch(r"\((\d+),(\d+)\)#(.+)", g["name"])
            assert match is not None and g["active"]
            row,col = [int(v) for v in match.groups()[:2]]
            coordinate = (row,col)
            assert coordinate not in colliders
            colliders[coordinate] = c["box2D"]
            names[coordinate] = match.group(3)
    fixtures = []
    for file_row,map_row in enumerate(map_rows):
        for col,tile_index in enumerate(map_row):
            row = len(map_rows)-1-file_row
            t = map_data["tiles"][tile_index]
            point = (row,col)
            collider = colliders.pop(point,None)
            assert (collider is not None) == (t["heightType"] == "HIGHLAND")
            if collider is not None:
                assert names[point] == t["tileKey"]
                assert collider == {"enabled":True,"isTrigger":False,"offset":[0.0,0.0],
                                    "size":[1.0,1.0],"edgeRadius":0.0}
            fixtures.append({"row":row,"col":col,"tileIndexPointer":f"/mapData/map/{file_row}/{col}",
                             "tilePointer":f"/mapData/tiles/{tile_index}","tileKey":t["tileKey"],
                             "heightType":t["heightType"],"buildableType":t["buildableType"],
                             "passableMask":t["passableMask"],"collider":collider})
    assert not colliders
    samples = Counter((r["tileKey"], r["heightType"], r["passableMask"], bool(r["collider"])) for r in fixtures)
    results.append({"label":label,"prts":wiki,"source":src,"scene":bundles[Path(relpath).stem]["source"],"cells":fixtures,
                    "counts":[{"tileKey":k,"height":h,"passableMask":p,"isPhysical":b,"count":v}
                              for (k,h,p,b),v in sorted(samples.items())]})

raw = args.equip.read_bytes()
equip_source = source(raw,equipment_revision,"zh_CN/gamedata/excel/uniequip_table.json")
baseline = json.loads(Path("docs/research/evidence/unit-audit-20261110/operator-config/configuration.json").read_bytes())
assert equip_source == next(s for s in baseline["provenance"]["sources"] if s["url"].endswith("/uniequip_table.json"))
mission_id = "uniequip_002_sqrrel_2"
mission = json.loads(raw)["missionList"][mission_id]
assert mission["paramList"] == ["3", "main_02-08", "char_277_sqrrel", "SIMPLE,enemy_1016_diaman,fall_down", "2"]
evidence = {
    "provenance": {"scope": "Cross-version static coordinate and geometry check.",
                   "caseScriptSha256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest()},
    "result": {"stages": results, "mission": {"source": equip_source, "pointer": f"/missionList/{mission_id}",
               "prts": "https://prts.wiki/w/阿消", "value": mission}},
}
args.out.parent.mkdir(parents=True, exist_ok=True)
args.out.write_text(json.dumps(evidence, ensure_ascii=False, indent=2) + "\n")
