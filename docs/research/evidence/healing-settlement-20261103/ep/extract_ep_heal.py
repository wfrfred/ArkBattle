#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["capstone==5.0.7"]
# ///
"""EP healing gaps, reusing current-fingerprint Modifier/EP application evidence."""
import argparse
import bisect
import importlib.util
import json
from pathlib import Path

SELECTORS = {
    "Torappu.Battle.Entity.get_canRecoverEp",
    "Torappu.Battle.Entity.get_isEPFreeAll",
    "Torappu.Battle.Modifier..ctor",
    "Torappu.Battle.Modifier.get_isElementHeal",
    "Torappu.Battle.Modifier.NewElementHeal",
    "Torappu.Battle.Action.Nodes/ApplyElementHeal.Execute",
    "Torappu.Battle.Action.Nodes/ApplyElementHeal.PreprocessForProjectile",
    "Torappu.Battle.Action.Nodes/ApplyElementHeal..ctor",
}
EXPECTED = {
    "dll": "cf7956bf88a61986859ef55c026d231713e2d12cf69ffd9a19779ab491cf76ff",
    "metadata": "e58fb854ae519bc22f7d8bc7ac83502425a51b896a907a3374f5215202f9caa5",
}
REUSED = [
    "docs/research/evidence/ep-modifier-events-20261103/native-ep-events.json",
    "docs/research/evidence/elemental-timing-20261102/schedule-native.json",
    "docs/research/evidence/elemental-timing-20261102/ep-native.json",
    "docs/research/evidence/attack-addon-order-20261102/hp/native-hp.json",
    "docs/research/evidence/nymph-action-settlement-20261103/damage/native-damage.json",
]

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--game", type=Path, required=True)
    p.add_argument("--out", type=Path, required=True)
    p.add_argument("--extra", action="append", default=[])
    args = p.parse_args()
    tool = Path.cwd() / ".agents/skills/arkbattle-native-research/scripts/native.py"
    spec = importlib.util.spec_from_file_location("arkbattle_native", tool)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    n = mod.Native(args.game)
    provenance = n.provenance()
    for key, value in EXPECTED.items():
        if provenance["client"][key]["sha256"] != value:
            raise ValueError(f"{key} fingerprint differs")
    provenance["location"]["modules"] = {"Assembly-CSharp.dll": n.modules["Assembly-CSharp.dll"]}
    provenance["caseTool"] = {"script": mod.fingerprint(Path(__file__))}
    lock = Path(str(Path(__file__)) + ".lock")
    if lock.exists(): provenance["caseTool"]["lock"] = mod.fingerprint(lock)
    provenance["reused"] = [mod.fingerprint(Path(x)) for x in REUSED]
    selectors = SELECTORS | set(args.extra)
    methods, discovery = [], []
    for row in n.methods:
        owner = n.typename(row["declaringType"])
        name = owner + "." + n.string(row["nameIndex"])
        if name in selectors: methods.append(n.method(row["index"]))
        if owner in {"Torappu.Battle.Entity", "Torappu.Battle.Buff", "Torappu.Battle.BattleFormula", "Torappu.Battle.Modifier"} and any(x in name for x in ["Heal", "Ep", "EP"]):
            discovery.append(n.method(row["index"]))
    missing = selectors - {m["fullname"] for m in methods}
    if missing: raise ValueError(sorted(missing))
    bodies = []
    for method in methods:
        cursor = method["address"]
        end = n.addresses[bisect.bisect_right(n.addresses, cursor)]
        fragments = []
        while cursor < end:
            body = n.disassemble_at(cursor, end-cursor, method=method if cursor == method["address"] else None)
            for ins in body["instructions"]:
                if len(ins.get("methods", [])) > 100:
                    ins["methodAliasCount"] = len(ins["methods"])
                    del ins["methods"]
            fragments.append(body)
            nxt = int(body["end"],16)
            if nxt <= cursor: raise ValueError("fragment did not advance")
            cursor = nxt
        bodies.append({"methodIndex":method["index"],"logicalEnd":hex(end),"fragments":fragments})
    fields=[]
    for t in n.types:
        if n.typename(t["index"]) in {"Torappu.Battle.Modifier", "Torappu.Battle.Action.Nodes/ApplyElementHeal", "Torappu.Battle.Entity"}:
            fs=n.fields(t["index"])
            if n.typename(t["index"]) == "Torappu.Battle.Entity":
                fs=[f for f in fs if any(s in f["name"].lower() for s in ["ep", "heal", "recover"])]
            fs=[f for f in fs if not f["static"]]
            fields.append({"fullname":n.typename(t["index"]),"typeIndex":t["index"],"fields":fs})
    default_ratio_instruction = next(i for b in bodies if b["methodIndex"] == next(m["index"] for m in methods if m["fullname"] == "Torappu.Battle.Action.Nodes/ApplyElementHeal..ctor" and not m["parameters"]) for f in b["fragments"] for i in f["instructions"] if i["mnemonic"] == "movss" and "rip +" in i["operands"])
    ratio_address = int(default_ratio_instruction["address"],16) + len(bytes.fromhex(default_ratio_instruction["bytes"])) + int(default_ratio_instruction["operands"].split("rip + ")[1].split("]")[0],16)
    constants={"defaultEpHealRatio":{"instruction":default_ratio_instruction,"address":hex(ratio_address),"bytes":n.pe.read(ratio_address,4).hex(),"float":n.pe.unpack("<f",ratio_address)[0]}}
    args.out.parent.mkdir(parents=True,exist_ok=True)
    args.out.write_text(json.dumps({"provenance":provenance,"result":{"methods":methods,"bodies":bodies,"fields":fields,"discovery":discovery,"constants":constants}},ensure_ascii=False,indent=2)+"\n")
    print(json.dumps({"out":str(args.out),"methods":[{"index":m["index"],"fullname":m["fullname"],"address":hex(m["address"])} for m in methods]}))

if __name__ == "__main__": main()
