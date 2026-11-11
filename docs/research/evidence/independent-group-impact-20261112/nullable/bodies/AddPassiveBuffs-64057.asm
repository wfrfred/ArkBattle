0x180601b30: push r14
0x180601b32: sub rsp, 0x60
0x180601b36: cmp byte ptr [rip + 0x89990f3], 0
0x180601b3d: mov r14, rcx
0x180601b40: jne 0x180601b79
0x180601b42: lea rcx, [rip + 0x852f087]
0x180601b49: call 0x18049c210
0x180601b4e: lea rcx, [rip + 0x85c00eb]
0x180601b55: call 0x18049c210
0x180601b5a: lea rcx, [rip + 0x861bc1f]
0x180601b61: call 0x18049c210
0x180601b66: lea rcx, [rip + 0x85f1b7b]
0x180601b6d: call 0x18049c210
0x180601b72: mov byte ptr [rip + 0x89990b7], 1
0x180601b79: mov rax, qword ptr [rip + 0x852f050]
0x180601b80: mov rcx, qword ptr [rax + 0xb8]
0x180601b87: mov rcx, qword ptr [rcx + 0x268]
0x180601b8e: test rcx, rcx
0x180601b91: jne 0x180601d74
0x180601b97: mov qword ptr [rsp + 0x50], r15
0x180601b9c: cmp byte ptr [rip + 0x89d6ece], cl
0x180601ba2: jbe 0x180601bac
0x180601ba4: mov rcx, qword ptr [r14]
0x180601ba7: call 0x180457010
0x180601bac: mov rdx, qword ptr [r14]
0x180601baf: mov rcx, r14
0x180601bb2: mov rax, qword ptr [rdx + 0x420]
0x180601bb9: mov rdx, qword ptr [rdx + 0x428]
0x180601bc0: call rax
0x180601bc2: mov r15, rax
0x180601bc5: test rax, rax
0x180601bc8: je 0x180601da4
0x180601bce: mov qword ptr [rsp + 0x70], rbx
0x180601bd3: mov qword ptr [rsp + 0x78], rbp
0x180601bd8: mov qword ptr [rsp + 0x80], rsi
0x180601be0: mov qword ptr [rsp + 0x88], rdi
0x180601be8: mov qword ptr [rsp + 0x58], r12
0x180601bed: xor r12d, r12d
0x180601bf0: mov ebp, r12d
0x180601bf3: mov esi, r12d
0x180601bf6: nop word ptr [rax + rax]
0x180601c00: cmp byte ptr [rip + 0x89d6e69], r12b
0x180601c07: mov rbx, qword ptr [rip + 0x85c0032]
0x180601c0e: mov rdi, qword ptr [r15]
0x180601c11: je 0x180601c1b
0x180601c13: mov rcx, rdi
0x180601c16: call 0x180457010
0x180601c1b: movzx edx, word ptr [rdi + 0x12e]
0x180601c22: movzx eax, r12w
0x180601c26: cmp r12w, dx
0x180601c2a: jae 0x180601c47
0x180601c2c: mov r8, qword ptr [rdi + 0xb0]
0x180601c33: movzx ecx, ax
0x180601c36: add rcx, rcx
0x180601c39: cmp qword ptr [r8 + rcx*8], rbx
0x180601c3d: je 0x180601cbb
0x180601c3f: inc ax
0x180601c42: cmp ax, dx
0x180601c45: jb 0x180601c33
0x180601c47: xor r8d, r8d
0x180601c4a: mov rdx, rbx
0x180601c4d: mov rcx, r15
0x180601c50: call 0x180455fd0
0x180601c55: mov r8, qword ptr [rax]
0x180601c58: mov rcx, r15
0x180601c5b: mov rdx, qword ptr [rax + 8]
0x180601c5f: call r8
0x180601c62: cmp esi, eax
0x180601c64: jge 0x180601d85
0x180601c6a: cmp byte ptr [rip + 0x8998f7e], r12b
0x180601c71: jne 0x180601c92
0x180601c73: lea rcx, [rip + 0x852ef56]
0x180601c7a: call 0x18049c210
0x180601c7f: lea rcx, [rip + 0x860e4f2]
0x180601c86: call 0x18049c210
0x180601c8b: mov byte ptr [rip + 0x8998f5d], 1
0x180601c92: mov rax, qword ptr [rip + 0x852ef37]
0x180601c99: mov rcx, qword ptr [rax + 0xb8]
0x180601ca0: mov rcx, qword ptr [rcx + 0x60]
0x180601ca4: test rcx, rcx
0x180601ca7: jne 0x180601cd3
0x180601ca9: mov rdx, qword ptr [rip + 0x860e4c8]
0x180601cb0: lea rcx, [r14 + 0x50]
0x180601cb4: call 0x1853ae540
0x180601cb9: jmp 0x180601cde
0x180601cbb: movzx ecx, ax
0x180601cbe: add rcx, rcx
0x180601cc1: movsxd rax, dword ptr [r8 + rcx*8 + 8]
0x180601cc6: add rax, 0x14
0x180601cca: shl rax, 4
0x180601cce: add rax, rdi
0x180601cd1: jmp 0x180601c55
0x180601cd3: xor r8d, r8d
0x180601cd6: mov rdx, r14
0x180601cd9: call 0x1833b9b90 ; XLua.DelegateBridge.__Gen_Delegate_Imp2695
0x180601cde: mov rsi, rax
0x180601ce1: test rax, rax
0x180601ce4: je 0x180601d6b
0x180601cea: mov rdx, qword ptr [rip + 0x861ba8f]
0x180601cf1: xor ecx, ecx
0x180601cf3: mov r9d, ebp
0x180601cf6: mov r8, r15
0x180601cf9: call 0x180004e80
0x180601cfe: xor edx, edx
0x180601d00: mov rcx, r14
0x180601d03: mov rdi, rax
0x180601d06: call 0x180605810 ; Torappu.Battle.Ability.get_owner
0x180601d0b: xor edx, edx
0x180601d0d: mov rcx, r14
0x180601d10: mov rbx, rax
0x180601d13: call 0x180604d90 ; Torappu.Battle.Ability.get_blackboard
0x180601d18: mov qword ptr [rsp + 0x40], r12
0x180601d1d: mov r9, r14
0x180601d20: mov qword ptr [rsp + 0x38], r12
0x180601d25: mov r8, rbx
0x180601d28: mov qword ptr [rsp + 0x30], r12
0x180601d2d: mov rdx, rdi
0x180601d30: mov qword ptr [rsp + 0x28], r12
0x180601d35: mov rcx, rsi
0x180601d38: mov qword ptr [rsp + 0x20], rax
0x180601d3d: call 0x1807208c0 ; Torappu.Battle.Entity.AddBuff
0x180601d42: test rax, rax
0x180601d45: je 0x180601d6b
0x180601d47: mov rbx, qword ptr [r14 + 0x78]
0x180601d4b: xor edx, edx
0x180601d4d: mov rcx, rax
0x180601d50: call 0x1806ddbe0 ; Torappu.Battle.Buff.get_instanceUid
0x180601d55: test rbx, rbx
0x180601d58: je 0x180601db0
0x180601d5a: mov r8, qword ptr [rip + 0x85f1987]
0x180601d61: mov edx, eax
0x180601d63: mov rcx, rbx
0x180601d66: call 0x180007820
0x180601d6b: inc ebp
0x180601d6d: mov esi, ebp
0x180601d6f: jmp 0x180601c00
0x180601d74: xor r8d, r8d
0x180601d77: mov rdx, r14
0x180601d7a: add rsp, 0x60
0x180601d7e: pop r14
0x180601d80: jmp 0x1833c9ac0 ; XLua.DelegateBridge.__Gen_Delegate_Imp27
0x180601d85: mov r12, qword ptr [rsp + 0x58]
0x180601d8a: mov rdi, qword ptr [rsp + 0x88]
0x180601d92: mov rsi, qword ptr [rsp + 0x80]
0x180601d9a: mov rbp, qword ptr [rsp + 0x78]
0x180601d9f: mov rbx, qword ptr [rsp + 0x70]
0x180601da4: mov r15, qword ptr [rsp + 0x50]
0x180601da9: add rsp, 0x60
0x180601dad: pop r14
0x180601daf: ret
0x180601db0: call 0x18049c3c0
0x180601db5: int3
0x180601db6: int3
0x180601db7: int3
0x180601db8: int3
0x180601db9: int3
0x180601dba: int3
0x180601dbb: int3
0x180601dbc: int3
0x180601dbd: int3
0x180601dbe: int3
0x180601dbf: int3
