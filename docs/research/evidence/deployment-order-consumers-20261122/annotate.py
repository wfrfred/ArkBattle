from bisect import bisect_right
import struct
import sys
from pathlib import Path

import capstone

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path.cwd() / ".agents/skills/arkbattle-native-research/scripts"))
from native import Native

n = Native()
engine = capstone.Cs(capstone.CS_ARCH_X86, capstone.CS_MODE_64)
engine.detail = True
indices = [int(index) for index in sys.argv[1:]]
for index in indices:
    method = n.method(index)
    address = method["address"]
    end = n.addresses[bisect_right(n.addresses, address)]
    print(f'{index} {method["fullname"]} {address:#x}–{end:#x}')
    for ins in engine.disasm(n.pe.read(address, end - address), address):
        line = f"{ins.address:#x} {ins.mnemonic:5} {ins.op_str}"
        if ins.mnemonic in ("call", "jmp") and ins.operands and ins.operands[0].type == capstone.x86.X86_OP_IMM:
            target = ins.operands[0].imm
            names = [n.method(index)["fullname"] for index in n.address_methods.get(target, ())[:3]]
            if names:
                line += "   " + " / ".join(names)
        for op in ins.operands:
            if op.type != capstone.x86.X86_OP_MEM or op.mem.base != capstone.x86.X86_REG_RIP:
                continue
            slot = ins.address + ins.size + op.mem.disp
            try:
                (encoded,) = n.pe.unpack("<Q", slot)
            except StopIteration:
                continue
            if encoded >> 29 == 5:
                literal_index = (encoded & 0x1fffffff) >> 1
                table, size = n.table(0)
                if 8 * literal_index >= size:
                    continue
                length, offset = struct.unpack_from("<II", n.metadata, table + 8 * literal_index)
                start = n.table(1)[0] + offset
                literal = n.metadata[start:start + length].decode("utf-8")
                line += f"   {literal!r}"
        print(line.rstrip())
