; Torappu.Battle.Entity.CheckOneOfFilterBuffs metadata=66604 token=0x601042d VA=0x1806f0d40 RVA=0x6f0d40 size=0x190
00000001806f0d40: mov      qword ptr [rsp + 0x20], rsi
00000001806f0d45: push     r14
00000001806f0d47: sub      rsp, 0x20
00000001806f0d4b: cmp      byte ptr [rip + 0x859fb6f], 0
00000001806f0d52: mov      r14, rdx
00000001806f0d55: mov      rsi, rcx
00000001806f0d58: jne      0x1806f0d85
00000001806f0d5a: lea      rcx, [rip + 0x824670f] ; GenericMethodInfo 288687 @0x188937470
00000001806f0d61: call     0x18048bf00
00000001806f0d66: lea      rcx, [rip + 0x81505fb] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806f0d6d: call     0x18048bf00
00000001806f0d72: lea      rcx, [rip + 0x820b817] ; TypeInfo type(0x15, data=0x1889c2b90) @0x1888fc590
00000001806f0d79: call     0x18048bf00
00000001806f0d7e: mov      byte ptr [rip + 0x859fb3c], 1
00000001806f0d85: mov      rax, qword ptr [rip + 0x81505dc] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806f0d8c: cmp      dword ptr [rax + 0xe0], 0
00000001806f0d93: jne      0x1806f0da4
00000001806f0d95: mov      rcx, rax
00000001806f0d98: call     0x18048c140
00000001806f0d9d: mov      rax, qword ptr [rip + 0x81505c4] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806f0da4: mov      rax, qword ptr [rax + 0xb8]
00000001806f0dab: mov      rcx, qword ptr [rax + 0x7a8]
00000001806f0db2: test     rcx, rcx
00000001806f0db5: jne      0x1806f0eb1
00000001806f0dbb: mov      qword ptr [rsp + 0x38], rbp
00000001806f0dc0: mov      qword ptr [rsp + 0x30], rbx
00000001806f0dc5: mov      qword ptr [rsp + 0x40], rdi
00000001806f0dca: mov      rdx, qword ptr [rip + 0x824669f] ; GenericMethodInfo 288687 @0x188937470
00000001806f0dd1: mov      rcx, r14
00000001806f0dd4: call     0x1844afc00
00000001806f0dd9: mov      ebp, eax
00000001806f0ddb: test     eax, eax
00000001806f0ddd: jle      0x1806f0e90
00000001806f0de3: xor      ebx, ebx
00000001806f0de5: test     r14, r14
00000001806f0de8: je       0x1806f0eca
00000001806f0dee: nop      
00000001806f0df0: mov      rdx, qword ptr [rip + 0x820b799] ; TypeInfo type(0x15, data=0x1889c2b90) @0x1888fc590
00000001806f0df7: xor      ecx, ecx
00000001806f0df9: mov      r9d, ebx
00000001806f0dfc: mov      r8, r14
00000001806f0dff: call     0x180004e80
00000001806f0e04: cmp      byte ptr [rip + 0x859fa8e], 0
00000001806f0e0b: mov      rdi, rax
00000001806f0e0e: jne      0x1806f0e23
00000001806f0e10: lea      rcx, [rip + 0x8150551] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806f0e17: call     0x18048bf00
00000001806f0e1c: mov      byte ptr [rip + 0x859fa76], 1
00000001806f0e23: mov      rax, qword ptr [rip + 0x815053e] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806f0e2a: cmp      dword ptr [rax + 0xe0], 0
00000001806f0e31: jne      0x1806f0e42
00000001806f0e33: mov      rcx, rax
00000001806f0e36: call     0x18048c140
00000001806f0e3b: mov      rax, qword ptr [rip + 0x8150526] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806f0e42: mov      rax, qword ptr [rax + 0xb8]
00000001806f0e49: mov      rcx, qword ptr [rax + 0x660]
00000001806f0e50: test     rcx, rcx
00000001806f0e53: jne      0x1806f0e74
00000001806f0e55: xor      edx, edx
00000001806f0e57: mov      rcx, rsi
00000001806f0e5a: call     0x180702100 ; Torappu.Battle.Entity.get_buffContainer [66402]
00000001806f0e5f: test     rax, rax
00000001806f0e62: je       0x1806f0eca
00000001806f0e64: xor      r8d, r8d
00000001806f0e67: mov      rdx, rdi
00000001806f0e6a: mov      rcx, rax
00000001806f0e6d: call     0x180665a10 ; Torappu.Battle.Buff.BuffContainer.ContainsBuff [65336]
00000001806f0e72: jmp      0x1806f0e82
00000001806f0e74: xor      r9d, r9d
00000001806f0e77: mov      r8, rdi
00000001806f0e7a: mov      rdx, rsi
00000001806f0e7d: call     0x18332fc60 ; XLua.DelegateBridge.__Gen_Delegate_Imp29 [2684]
00000001806f0e82: test     al, al
00000001806f0e84: jne      0x1806f0ead
00000001806f0e86: inc      ebx
00000001806f0e88: cmp      ebx, ebp
00000001806f0e8a: jl       0x1806f0df0
00000001806f0e90: xor      al, al
00000001806f0e92: mov      rbx, qword ptr [rsp + 0x30]
00000001806f0e97: mov      rdi, qword ptr [rsp + 0x40]
00000001806f0e9c: mov      rbp, qword ptr [rsp + 0x38]
00000001806f0ea1: mov      rsi, qword ptr [rsp + 0x48]
00000001806f0ea6: add      rsp, 0x20
00000001806f0eaa: pop      r14
00000001806f0eac: ret      
00000001806f0ead: mov      al, 1
00000001806f0eaf: jmp      0x1806f0e92
00000001806f0eb1: xor      r9d, r9d
00000001806f0eb4: mov      r8, r14
00000001806f0eb7: mov      rdx, rsi
00000001806f0eba: mov      rsi, qword ptr [rsp + 0x48]
00000001806f0ebf: add      rsp, 0x20
00000001806f0ec3: pop      r14
00000001806f0ec5: jmp      0x18332fc60 ; XLua.DelegateBridge.__Gen_Delegate_Imp29 [2684]
00000001806f0eca: call     0x18048c0b0
00000001806f0ecf: int3     