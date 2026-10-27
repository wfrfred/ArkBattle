; Torappu.Battle.PropLikeStaticBlockToken._CheckBlockable metadata=77294 token=0x6012def VA=0x180aafd50 RVA=0xaafd50 size=0x1e0
0000000180aafd50: mov      qword ptr [rsp + 8], rbx
0000000180aafd55: mov      qword ptr [rsp + 0x10], rbp
0000000180aafd5a: mov      qword ptr [rsp + 0x18], rsi
0000000180aafd5f: push     rdi
0000000180aafd60: sub      rsp, 0x40
0000000180aafd64: cmp      byte ptr [rip + 0x81e2d65], 0
0000000180aafd6b: mov      rsi, r9
0000000180aafd6e: mov      rbx, r8
0000000180aafd71: mov      rdi, rdx
0000000180aafd74: mov      rbp, rcx
0000000180aafd77: jne      0x180aafdb0
0000000180aafd79: lea      rcx, [rip + 0x7d6b930] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180aafd80: call     0x18048bf00
0000000180aafd85: lea      rcx, [rip + 0x7daa974] ; TypeInfo Torappu.FP @0x18885a700
0000000180aafd8c: call     0x18048bf00
0000000180aafd91: lea      rcx, [rip + 0x7e82f50] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180aafd98: call     0x18048bf00
0000000180aafd9d: lea      rcx, [rip + 0x7d75a54] ; TypeInfo Torappu.Battle.PropLikeStaticBlockToken @0x1888257f8
0000000180aafda4: call     0x18048bf00
0000000180aafda9: mov      byte ptr [rip + 0x81e2d20], 1
0000000180aafdb0: mov      rax, qword ptr [rip + 0x7d75a41] ; TypeInfo Torappu.Battle.PropLikeStaticBlockToken @0x1888257f8
0000000180aafdb7: cmp      dword ptr [rax + 0xe0], 0
0000000180aafdbe: jne      0x180aafdcf
0000000180aafdc0: mov      rcx, rax
0000000180aafdc3: call     0x18048c140
0000000180aafdc8: mov      rax, qword ptr [rip + 0x7d75a29] ; TypeInfo Torappu.Battle.PropLikeStaticBlockToken @0x1888257f8
0000000180aafdcf: mov      rax, qword ptr [rax + 0xb8]
0000000180aafdd6: mov      rcx, qword ptr [rax + 0x40]
0000000180aafdda: test     rcx, rcx
0000000180aafddd: jne      0x180aafee0
0000000180aafde3: mov      rdx, qword ptr [rip + 0x7d6b8c6] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180aafdea: test     rdi, rdi
0000000180aafded: jne      0x180aafdf3
0000000180aafdef: xor      ebx, ebx
0000000180aafdf1: jmp      0x180aafe3f
0000000180aafdf3: cmp      byte ptr [rip + 0x821c9f6], 0
0000000180aafdfa: mov      r8, qword ptr [rdi]
0000000180aafdfd: jbe      0x180aafe0d
0000000180aafdff: mov      rcx, r8
0000000180aafe02: call     0x1804463e0
0000000180aafe07: xor      ebx, ebx
0000000180aafe09: test     al, al
0000000180aafe0b: jmp      0x180aafe3b
0000000180aafe0d: movzx    eax, byte ptr [rdx + 0x130]
0000000180aafe14: cmp      byte ptr [r8 + 0x130], al
0000000180aafe1b: jb       0x180aafe35
0000000180aafe1d: movzx    ecx, al
0000000180aafe20: mov      rax, qword ptr [r8 + 0xc8]
0000000180aafe27: cmp      qword ptr [rax + rcx*8 - 8], rdx
0000000180aafe2c: jne      0x180aafe35
0000000180aafe2e: mov      eax, 1
0000000180aafe33: jmp      0x180aafe37
0000000180aafe35: xor      eax, eax
0000000180aafe37: xor      ebx, ebx
0000000180aafe39: test     eax, eax
0000000180aafe3b: cmovne   rbx, rdi
0000000180aafe3f: mov      rcx, qword ptr [rip + 0x7e82ea2] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180aafe46: cmp      dword ptr [rcx + 0xe0], 0
0000000180aafe4d: jne      0x180aafe54
0000000180aafe4f: call     0x18048c140
0000000180aafe54: xor      r8d, r8d
0000000180aafe57: xor      edx, edx
0000000180aafe59: mov      rcx, rbx
0000000180aafe5c: call     0x186b638d0
0000000180aafe61: test     al, al
0000000180aafe63: jne      0x180aafeb0
0000000180aafe65: test     rbx, rbx
0000000180aafe68: je       0x180aaff1b
0000000180aafe6e: xor      r8d, r8d
0000000180aafe71: mov      rdx, rbp
0000000180aafe74: mov      rcx, rbx
0000000180aafe77: call     0x180a6bb70 ; Torappu.Battle.Enemy.CheckBlockable [76428]
0000000180aafe7c: test     al, al
0000000180aafe7e: je       0x180aafeb0
0000000180aafe80: mov      rcx, qword ptr [rip + 0x7daa879] ; TypeInfo Torappu.FP @0x18885a700
0000000180aafe87: cmp      dword ptr [rcx + 0xe0], 0
0000000180aafe8e: jne      0x180aafe95
0000000180aafe90: call     0x18048c140
0000000180aafe95: xor      edx, edx
0000000180aafe97: xor      ecx, ecx
0000000180aafe99: call     0x1866fdac0
0000000180aafe9e: mov      qword ptr [rsi], rax
0000000180aafea1: mov      rax, qword ptr [rsp + 0x70]
0000000180aafea6: mov      dword ptr [rax], 0
0000000180aafeac: mov      al, 1
0000000180aafeae: jmp      0x180aaff06
0000000180aafeb0: mov      rcx, qword ptr [rip + 0x7daa849] ; TypeInfo Torappu.FP @0x18885a700
0000000180aafeb7: cmp      dword ptr [rcx + 0xe0], 0
0000000180aafebe: jne      0x180aafec5
0000000180aafec0: call     0x18048c140
0000000180aafec5: xor      edx, edx
0000000180aafec7: xor      ecx, ecx
0000000180aafec9: call     0x1866fdac0
0000000180aafece: mov      qword ptr [rsi], rax
0000000180aafed1: mov      rax, qword ptr [rsp + 0x70]
0000000180aafed6: mov      dword ptr [rax], 0
0000000180aafedc: xor      al, al
0000000180aafede: jmp      0x180aaff06
0000000180aafee0: mov      rax, qword ptr [rsp + 0x70]
0000000180aafee5: mov      r9, rbx
0000000180aafee8: mov      qword ptr [rsp + 0x30], 0
0000000180aafef1: mov      r8, rdi
0000000180aafef4: mov      qword ptr [rsp + 0x28], rax
0000000180aafef9: mov      rdx, rbp
0000000180aafefc: mov      qword ptr [rsp + 0x20], rsi
0000000180aaff01: call     0x18338fc30 ; XLua.DelegateBridge.__Gen_Delegate_Imp3608 [6263]
0000000180aaff06: mov      rbx, qword ptr [rsp + 0x50]
0000000180aaff0b: mov      rbp, qword ptr [rsp + 0x58]
0000000180aaff10: mov      rsi, qword ptr [rsp + 0x60]
0000000180aaff15: add      rsp, 0x40
0000000180aaff19: pop      rdi
0000000180aaff1a: ret      
0000000180aaff1b: call     0x18048c0b0
0000000180aaff20: int3     
0000000180aaff21: int3     
0000000180aaff22: int3     
0000000180aaff23: int3     
0000000180aaff24: int3     
0000000180aaff25: int3     
0000000180aaff26: int3     
0000000180aaff27: int3     
0000000180aaff28: int3     
0000000180aaff29: int3     
0000000180aaff2a: int3     
0000000180aaff2b: int3     
0000000180aaff2c: int3     
0000000180aaff2d: int3     
0000000180aaff2e: int3     
0000000180aaff2f: int3     