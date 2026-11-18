#!/usr/bin/env python3
import argparse
import bisect
import json
import sys
from pathlib import Path

from capstone import Cs, CS_ARCH_X86, CS_MODE_64, CS_GRP_JUMP
from capstone.x86_const import X86_OP_MEM, X86_OP_IMM, X86_REG_RIP

parser = argparse.ArgumentParser(description="Dump selected original client ranges across split PE unwind entries.")
parser.add_argument("--out", type=Path, required=True)
parser.add_argument("--index", nargs="*", type=int, default=[])
parser.add_argument("--xref", nargs="*", type=int, default=[])
parser.add_argument("--search", nargs="*", default=[])
parser.add_argument("--select", nargs="*", default=[])
parser.add_argument("--fields", nargs="*", default=[])
args = parser.parse_args()
sys.dont_write_bytecode = True
sys.path.insert(0, str(Path(".agents/skills/arkbattle-native-research/scripts").resolve()))
from native import Native, fingerprint

p = Native()
cs = Cs(CS_ARCH_X86, CS_MODE_64)
cs.detail = True
cs.skipdata = True
selected = set(args.index)
search = []
xrefs = {}
for index in args.xref:
    target = p.method(index)
    found = p.xrefs(target["address"])
    xrefs[index] = {"method": target, "candidateSites":found}
    for site in found["candidates"]:
        selected.update(site["precedingMethodCandidates"])
if args.search or args.select:
    for method in p.methods:
        fullname = f'{p.typename(method["declaringType"])}.{p.string(method["nameIndex"])}'
        if fullname in args.select:
            selected.add(method["index"])
        if any(term in fullname for term in args.search):
            search.append(p.method(method["index"]))
ranges = {}
for index in sorted(selected):
    m = p.method(index)
    a = m["address"]
    if not a:
        continue
    end = p.addresses[bisect.bisect_right(p.addresses, a)]
    instructions = []
    for ins in cs.disasm(p.pe.read(a, end-a), a):
        row = {"address":hex(ins.address),"bytes":ins.bytes.hex(),"mnemonic":ins.mnemonic,"operands":ins.op_str}
        if ins.id and (ins.mnemonic == "call" or ins.group(CS_GRP_JUMP)) and ins.operands and ins.operands[0].type == X86_OP_IMM:
            target = ins.operands[0].imm
            row["target"] = hex(target)
            row["namedTargets"] = [p.method(i)["fullname"] for i in p.address_methods.get(target, ())]
            row["namedTargetCount"] = len(row["namedTargets"])
            row["namedTargets"] = row["namedTargets"][:12]
            row["targetOutsideRange"] = not a <= target < end
        if ins.id:
            for operand in ins.operands:
                if operand.type == X86_OP_MEM and operand.mem.base == X86_REG_RIP:
                    row.setdefault("ripReferences", []).append(hex(ins.address + ins.size + operand.mem.disp))
        instructions.append(row)
    ranges[index] = {"method":m,"end":hex(end),"instructions":instructions}
fields = {p.typename(t["index"]): p.fields(t["index"]) for t in p.types if p.typename(t["index"]) in args.fields}
evidence = {
    "provenance": p.provenance() | {"caseScript": fingerprint(Path(__file__))},
    "result": {"search": search, "xrefs": xrefs, "fields": fields, "ranges": ranges},
}
args.out.parent.mkdir(parents=True, exist_ok=True)
args.out.write_text(json.dumps(evidence, ensure_ascii=False, indent=2) + "\n")
