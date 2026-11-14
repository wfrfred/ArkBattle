#!/usr/bin/env python3
"""Decode recovery content bindings and elemental-break template dependencies."""
import argparse
import hashlib
import importlib.util
import json
import re
import sys
from pathlib import Path

ROOT = Path.cwd()
sys.dont_write_bytecode = True
TOOLS = ROOT / ".agents/skills/arkbattle-native-research/scripts"
sys.path.insert(0, str(TOOLS))
from native import fingerprint
from unity_assets import Reader, bundle, serialized, script

HELPER = ROOT / "docs/research/evidence/targeting-pipeline-20261109/content/extract_content.py"
spec = importlib.util.spec_from_file_location("recovery_content_helper", HELPER)
helper = importlib.util.module_from_spec(spec)
spec.loader.exec_module(helper)

SELECTION = {
    "charpack/char_491_humus.ab": ["char_491_humus"],
    "charpack/char_4125_rdoc.ab": ["char_4125_rdoc"],
    "charpack/char_4235_thumpy.ab": ["char_4235_thumpy"],
    "charpack/char_1016_agoat2.ab": ["char_1016_agoat2"],
    "charpack/char_1042_phatm2.ab": ["char_1042_phatm2"],
    "charpack/char_4056_titi.ab": ["char_4056_titi"],
    "charpack/char_1012_skadi2.ab": ["char_1012_skadi2"],
    "charpack/char_4119_wanqin.ab": ["char_4119_wanqin"],
    "charpack/char_2026_yu.ab": ["char_2026_yu"],
    "battle/enm_pfb_35.ab": ["enemy_8018_etouch"],
    "battle/enm_pfb_0.ab": ["enemy_10009_sggem"],
    "battle/enm_pfb_17.ab": ["enemy_1436_dsdivi"],
    "battle/enm_pfb_28.ab": ["enemy_9014_acstma", "enemy_9015_acstmb", "enemy_4053_muejet"],
    "pkgrps/btl_pfb_tokens_0.ab": ["trap_056_sfsuifire"],
    "pkgrps/btl_pfb_tokens_4.ab": ["trap_259_murjet"],
    "battle/prefabs/[uc]skills.ab": ["skchr_titi_3", "skchr_rdoc_", "skchr_humus_", "skchr_skadi2_", "skchr_wanqin_2", "skchr_agoat2_2"],
    "battle/prefabs/[uc]globalbuffs.ab": ["ep_recovery"],
}


def walk(v, path=""):
    if isinstance(v, dict):
        yield path, v
        for k, x in v.items():
            yield from walk(x, path + "/" + k)
    elif isinstance(v, list):
        for i, x in enumerate(v):
            yield from walk(x, path + "/" + str(i))


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--game", type=Path, default=Path("/mnt/c/Program Files/Hypergryph Launcher/games/Arknights Game"))
    p.add_argument("--buff-table", type=Path, default=Path(".cache/native-research/elemental-zero-20261105/templates/buff_table.json"))
    p.add_argument("--out", type=Path, required=True)
    a = p.parse_args()
    base = a.game / "Arknights_Data/StreamingAssets/AB/Windows"
    sources, scripts, components, unavailable = [], {}, [], []
    for relative in ("anon/bac85f8fe65f27a2b7ea13fff6de62e8.bin", "anon/88b3c3ecaaefa6003de730686dd5ac53.bin"):
        source = base / relative
        if not source.is_file():
            unavailable.append(relative)
            continue
        sources.append(fingerprint(source))
        for fn, data in bundle(source)[0]:
            if fn.endswith((".resS", ".resource")):
                continue
            for obj in serialized(data)["objects"]:
                if obj["classid"] == 115:
                    scripts[(fn, obj["id"])] = script(obj, data)
    for relative, roots in SELECTION.items():
        source = base / relative
        sources.append(fingerprint(source))
        for fn, data in bundle(source)[0]:
            if fn.endswith((".resS", ".resource")):
                continue
            state = serialized(data)
            layouts, externals = helper.helper.trees(data)
            names, transforms = {}, {}
            for obj in state["objects"]:
                raw = data[obj["start"]:obj["start"] + obj["size"]]
                if obj["classid"] == 1:
                    r = Reader(raw); r.read(r.val("i") * 12); r.val("i")
                    names[obj["id"]] = r.string()
                elif obj["classid"] == 4:
                    v = helper.decode(raw, layouts[obj["typeid"]])
                    transforms[obj["id"]] = (v["common:374"]["m_PathID"], v["m_Father"]["m_PathID"])
            by_owner = {owner: tid for tid, (owner, _) in transforms.items()}
            for obj in state["objects"]:
                if obj["classid"] != 114:
                    continue
                raw = data[obj["start"]:obj["start"] + obj["size"]]
                owner = int.from_bytes(raw[4:12], "little", signed=True)
                hierarchy, tid = [], by_owner.get(owner)
                while tid:
                    go, tid = transforms[tid]
                    hierarchy.append(names[go])
                hierarchy.reverse()
                if not hierarchy or not any(hierarchy[0].startswith(root) for root in roots):
                    continue
                v = helper.decode(raw, layouts[obj["typeid"]])
                ptr = v["common:490"]
                script_file = fn if ptr["m_FileID"] == 0 else externals[ptr["m_FileID"] - 1]["path"].split("/")[-1]
                components.append({"bundle": relative, "file": fn, "pathId": str(obj["id"]),
                                   "hierarchy": hierarchy, "objectSha256": hashlib.sha256(raw).hexdigest(),
                                   "scriptPPtr": ptr, "scriptFile": script_file,
                                   "script": scripts.get((script_file, ptr["m_PathID"])),
                                   "value": {k: x for k, x in v.items() if not k.startswith("common:")}})
    source = base / "config/buff_template_holder.ab"
    sources.append(fingerprint(source))
    holder_file = "CAB-7983df61b3ae63c96fb4e076fc3d80af"
    data = dict(bundle(source)[0])[holder_file]
    layouts, _ = helper.helper.trees(data)
    obj = next(x for x in serialized(data)["objects"] if x["id"] == 6070581171229484677)
    raw = data[obj["start"]:obj["start"] + obj["size"]]
    holder = helper.decode(raw, layouts[obj["typeid"]])
    templates = {}
    usage, attribute_usage = [], []
    pattern = re.compile(r"Heal|Element|EPBreak|EpBreak|HpRecovery|OverHeal|Overflow")
    for i, t in enumerate(holder["_templates"]["Array"]):
        t = dict(t); t["templateIndex"] = i
        t["events"] = [{"event": e["key"], "actions": json.loads(e["value"]["SerializedState"])}
                       for e in t.pop("eventToActions")["_items"]["Array"]]
        templates[t["templateKey"]] = t
        for path, node in walk(t["events"]):
            if pattern.search(str(node.get("$type", ""))):
                usage.append({"templateKey": t["templateKey"], "templateIndex": i, "pointer": "/events" + path,
                              "node": node})
            if any(k in node for k in ("abnormalFlags", "attributeModifiers")) and re.search(r"EP_|EPFree|ELEMENT|MAX_EP", json.dumps(node), re.I):
                attribute_usage.append({"templateKey": t["templateKey"], "templateIndex": i,
                                        "pointer": "/events" + path, "attributes": node})
    buff_raw = a.buff_table.read_bytes()
    if hashlib.sha256(buff_raw).hexdigest() != "f9c67db93cd9e8d40a3ff76ec6375d232993f1b61f3d277cb96b05e32fe537c3":
        raise ValueError("Pinned BuffDB mirror differs")
    buff_db = json.loads(buff_raw)
    seeds = {key for key in templates if key.startswith(("ep_break_", "humus_t_1", "rdoc_t2", "thumpy[t_2]", "titi_s_3[doze", "trap_sfsuiball_devour", "acstma", "acstmb", "dsdivi_tr_1", "wanqin_s_2[hp_recover]", "cetsyr_atk_to_hp_recovery", "enemy_muejet")) or any(e["event"] == 46 for e in templates[key]["events"]) or any(node.get("_attributeType", node.get("attributeType")) == "EP_RECOVERY_PER_SEC" for _, node in walk(templates[key]["events"]))}
    for row in components:
        for _, node in walk(row["value"]):
            if node.get("templateKey") in templates:
                seeds.add(node["templateKey"])
    selected, missing, selected_db, pending = set(), set(), {}, list(seeds)
    while pending:
        key = pending.pop()
        if key in selected or key == "empty":
            continue
        if key not in templates:
            missing.add(key); continue
        selected.add(key)
        for _, node in walk(templates[key]["events"]):
            b = node.get("_buff")
            if not isinstance(b, dict):
                continue
            if b.get("loadFromDB"):
                db_key = b["buffKey"]
                if db_key not in buff_db:
                    missing.add("BuffDB:" + db_key); continue
                selected_db[db_key] = buff_db[db_key]
                b = buff_db[db_key]
            if b.get("templateKey"):
                pending.append(b["templateKey"])
    provenance = {"collectedOn": "2026-11-14", "script": fingerprint(Path(__file__)),
                  "helper": fingerprint(HELPER), "sources": sources, "unavailableOptionalScriptBundles": unavailable,
                  "buffDbMirror": {"revision": "bffe31bf66739842f99b457327066c695e2af389", **fingerprint(a.buff_table)},
                  "scope": "Installed selected components and full Holder node-name inventory; chosen template dependency closure. Pinned BuffDB is separately versioned. No live execution or XLua observation."}
    a.out.mkdir(parents=True, exist_ok=True)
    for name, result in (("content.json", {"selection": SELECTION, "components": components}),
                         ("holder-usage.json", {"templateCount": len(templates), "nodePattern": pattern.pattern,
                                                "matches": usage, "attributeMatches": attribute_usage}),
                         ("templates.json", {"seeds": sorted(seeds), "missing": sorted(missing),
                                             "templates": [templates[k] for k in sorted(selected)], "buffDb": selected_db})):
        (a.out / name).write_text(json.dumps({"provenance": provenance, "result": result}, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"components": len(components), "templates": len(selected), "usage": len(usage), "missing": sorted(missing)}))


if __name__ == "__main__":
    main()
