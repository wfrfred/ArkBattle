#!/usr/bin/env python3
"""Find selected route-mutation templates in current enemy prefab components."""
import argparse
import datetime
import hashlib
import importlib.util
import json
import struct
import sys
from pathlib import Path

sys.dont_write_bytecode = True
root = Path.cwd()
tools = root / ".agents/skills/arkbattle-native-research/scripts"
sys.path.insert(0, str(tools))
from native import DEFAULT_GAME, fingerprint
from unity_assets import bundle, serialized, script

parser = argparse.ArgumentParser()
parser.add_argument("--game", type=Path, default=DEFAULT_GAME)
parser.add_argument("--out", type=Path, required=True)
args = parser.parse_args()
helper = root / "docs/research/evidence/attack-addon-order-20261102/content/decode_content.py"
spec = importlib.util.spec_from_file_location("reader", helper)
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)
ext_helper = root / "docs/research/evidence/nymph-action-settlement-20261103/projectile/decode_projectile.py"
spec = importlib.util.spec_from_file_location("external_reader", ext_helper)
em = importlib.util.module_from_spec(spec)
spec.loader.exec_module(em)
base = args.game / "Arknights_Data/StreamingAssets/AB/Windows"
script_source = base / "anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin"
script_files = dict(bundle(script_source)[0])
needles = [
    "enemy_cnvpvd[no_wait]", "enemy_bqthie_move[passive]", "enemy_cjstel_absorb", "enemy_flgshp[end_point]",
    "enemy_spbell_s[pray]", "enemy_smlead_demonize[restore]", "enemy_dufrbl_t", "enemy_arctxi_direct",
    "enemy_dyjsww_t[modify_route]", "enemy_shadvr_route_change", "enemy_ubbplwq[switch_branch]",
    "enemy_trspsb_drop", "enemy_shdopl_finish", "enemy_shsdgo_pos",
    "trap_cnvfwks[route]", "enemy_cjstel_fly", "enemy_dyyys2_s[fishing]", "enemy_dyyysg_s[fishing]",
]
class_ids = {-7235513145853390613:"EnemyTraceEnemyAbility", -4809771304807230607:"TraceTargetAbility", 8689893180211089106:"DurbusAbility"}
raw_keys = [s.encode() for s in needles] + [struct.pack("<q", i) for i in class_ids]
rows = []
scanned = []
sources = sorted((base/"battle").glob("enm_pfb_*.ab")) + sorted((base/"pkgrps").glob("btl_pfb_tokens_*.ab"))
for source in sources:
    matches = []
    for filename, data in bundle(source)[0]:
        if filename.endswith((".resS", ".resource")) or not any(s in data for s in raw_keys):
            continue
        state = serialized(data)
        trees = m.trees(data)
        names = {}
        transforms = {}
        for o in state["objects"]:
            if o["classid"] not in (1,4):
                continue
            v = m.decode(data[o["start"]:o["start"]+o["size"]], trees[o["typeid"]])
            if o["classid"] == 1:
                names[o["id"]] = v.get("common:427", v.get("m_Name"))
            else:
                transforms[o["id"]] = (v["common:374"]["m_PathID"], v["m_Father"]["m_PathID"])
        by_go = {v[0]:k for k,v in transforms.items()}
        externals = em.trees(data)[1]
        file_matches = []
        def row_for(o, raw, v, hits, class_hits):
            tid = by_go.get(v["common:374"]["m_PathID"])
            hierarchy = []
            while tid:
                go, tid_parent = transforms[tid]
                hierarchy.append({"name":names.get(go), "gameObjectPathId":str(go), "transformPathId":str(tid)})
                tid = tid_parent
            pointer = v["common:490"]
            if pointer["m_FileID"]:
                external = externals[pointer["m_FileID"]-1]
                sfname = external["path"].split("/")[-1]
                sd = script_files.get(sfname)
            else:
                external = None
                sfname = filename
                sd = data
            script_binding = {"externalReference":external, "file":sfname, "pathId":str(pointer["m_PathID"])}
            if sd is not None:
                so = next(x for x in serialized(sd)["objects"] if x["id"] == pointer["m_PathID"])
                script_binding.update(bundle="anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin" if external else str(source.relative_to(base)), value=script(so,sd))
            return {"bundle":str(source.relative_to(base)), "file":filename, "pathId":str(o["id"]),
                    "objectSha256":hashlib.sha256(raw).hexdigest(), "hits":hits, "classCandidates":class_hits, "hierarchy":hierarchy,
                    "scriptBinding":script_binding, "value":v}
        for o in state["objects"]:
            if o["classid"] != 114:
                continue
            raw = data[o["start"]:o["start"]+o["size"]]
            hits = [s for s in needles if s.encode() in raw]
            class_hits = [name for i,name in class_ids.items() if struct.pack("<q", i) in raw]
            if not hits and not class_hits:
                continue
            v = m.decode(raw, trees[o["typeid"]])
            file_matches.append(row_for(o, raw, v, hits, class_hits))
        primary = [r for r in file_matches if r["hits"] or r["scriptBinding"].get("value",{}).get("cl")=="DurbusAbility"]
        ancestor_go = {int(h["gameObjectPathId"]) for r in primary for h in r["hierarchy"]}
        related_ids = {p["m_PathID"] for r in primary for p in [r["value"].get("_selector",{}),r["value"].get("_targetValidator",{})] if p.get("m_PathID")}
        matched_ids = {int(r["pathId"]) for r in file_matches}
        companion_bytes = [struct.pack("<q",i) for i in ancestor_go]
        for o in state["objects"]:
            if o["classid"] != 114 or o["id"] in matched_ids:
                continue
            raw = data[o["start"]:o["start"]+o["size"]]
            if o["id"] not in related_ids and not any(p in raw for p in companion_bytes):
                continue
            v = m.decode(raw, trees[o["typeid"]])
            if o["id"] not in related_ids and v["common:374"]["m_PathID"] not in ancestor_go:
                continue
            r = row_for(o,raw,v,[],[])
            cl = r["scriptBinding"].get("value",{}).get("cl", "")
            if o["id"] in related_ids or cl in ("Enemy", "EnemySkill", "UnitMode", "Trap") or cl.endswith("Mode"):
                r["companion"] = True
                file_matches.append(r)
        matches.extend(file_matches)
    scanned.append({"bundle":str(source.relative_to(base)), **fingerprint(source)})
    rows.extend(matches)
    if matches:
        print(source.name, len(matches))
args.out.parent.mkdir(parents=True, exist_ok=True)
args.out.write_text(json.dumps({"provenance":{"collectedOn":datetime.date.today().isoformat(), "script":fingerprint(Path(__file__)), "typeTreeReader":fingerprint(helper), "externalReader":fingerprint(ext_helper), "sources":scanned+[fingerprint(script_source)], "scope":"Recorded enemy/trap/common bundles, byte-filtered by listed template keys or script IDs, then typed and externally script-resolved. Includes ancestor Enemy/Skill/Mode and referenced validators for actual binding checks. Shows serialized bindings, not runtime game activation."}, "result":{"needles":needles, "matches":rows}}, ensure_ascii=False, indent=2)+"\n")
print("matches", len(rows), "bundles scanned",len(scanned))
