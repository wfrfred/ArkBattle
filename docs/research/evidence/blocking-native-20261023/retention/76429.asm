; Torappu.Battle.Enemy.CheckBlockableWithoutCheckRange metadata=76429 token=0x6012a8e VA=0x180a6b980 RVA=0xa6b980 size=0x1f0
0000000180a6b980: mov      qword ptr [rsp + 0x10], rbx
0000000180a6b985: push     rdi
0000000180a6b986: sub      rsp, 0x20
0000000180a6b98a: cmp      byte ptr [rip + 0x8226ee5], 0
0000000180a6b991: mov      rdi, rdx
0000000180a6b994: mov      rbx, rcx
0000000180a6b997: jne      0x180a6b9ac
0000000180a6b999: lea      rcx, [rip + 0x7dafd10] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6b9a0: call     0x18048bf00
0000000180a6b9a5: mov      byte ptr [rip + 0x8226eca], 1
0000000180a6b9ac: mov      rax, qword ptr [rip + 0x7dafcfd] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6b9b3: cmp      dword ptr [rax + 0xe0], 0
0000000180a6b9ba: jne      0x180a6b9cb
0000000180a6b9bc: mov      rcx, rax
0000000180a6b9bf: call     0x18048c140
0000000180a6b9c4: mov      rax, qword ptr [rip + 0x7dafce5] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6b9cb: mov      rax, qword ptr [rax + 0xb8]
0000000180a6b9d2: mov      rcx, qword ptr [rax + 0x4f0]
0000000180a6b9d9: test     rcx, rcx
0000000180a6b9dc: jne      0x180a6bb46
0000000180a6b9e2: cmp      byte ptr [rip + 0x8260e08], cl
0000000180a6b9e8: jbe      0x180a6b9f2
0000000180a6b9ea: mov      rcx, qword ptr [rbx]
0000000180a6b9ed: call     0x180446d00
0000000180a6b9f2: mov      rdx, qword ptr [rbx]
0000000180a6b9f5: mov      rcx, rbx
0000000180a6b9f8: mov      rax, qword ptr [rdx + 0x3c0]
0000000180a6b9ff: mov      rdx, qword ptr [rdx + 0x3c8]
0000000180a6ba06: call     rax
0000000180a6ba08: test     al, al
0000000180a6ba0a: je       0x180a6bb39
0000000180a6ba10: cmp      byte ptr [rip + 0x8260dd9], 0
0000000180a6ba17: jbe      0x180a6ba21
0000000180a6ba19: mov      rcx, qword ptr [rbx]
0000000180a6ba1c: call     0x180446d00
0000000180a6ba21: mov      rdx, qword ptr [rbx]
0000000180a6ba24: mov      rcx, rbx
0000000180a6ba27: mov      rax, qword ptr [rdx + 0xa90]
0000000180a6ba2e: mov      rdx, qword ptr [rdx + 0xa98]
0000000180a6ba35: call     rax
0000000180a6ba37: test     al, al
0000000180a6ba39: je       0x180a6bb39
0000000180a6ba3f: xor      edx, edx
0000000180a6ba41: mov      rcx, rbx
0000000180a6ba44: call     0x180705590 ; Torappu.Battle.Entity.get_isBlockFree [66511]
0000000180a6ba49: test     al, al
0000000180a6ba4b: jne      0x180a6bb39
0000000180a6ba51: xor      r8d, r8d
0000000180a6ba54: mov      rdx, rdi
0000000180a6ba57: mov      rcx, rbx
0000000180a6ba5a: call     0x180a78230 ; Torappu.Battle.Enemy._CheckMotionModeBlockable [76430]
0000000180a6ba5f: test     al, al
0000000180a6ba61: je       0x180a6bb39
0000000180a6ba67: cmp      byte ptr [rip + 0x8226e0a], 0
0000000180a6ba6e: jne      0x180a6ba83
0000000180a6ba70: lea      rcx, [rip + 0x7dafc39] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6ba77: call     0x18048bf00
0000000180a6ba7c: mov      byte ptr [rip + 0x8226df5], 1
0000000180a6ba83: mov      rax, qword ptr [rip + 0x7dafc26] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6ba8a: cmp      dword ptr [rax + 0xe0], 0
0000000180a6ba91: jne      0x180a6baa2
0000000180a6ba93: mov      rcx, rax
0000000180a6ba96: call     0x18048c140
0000000180a6ba9b: mov      rax, qword ptr [rip + 0x7dafc0e] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6baa2: mov      rax, qword ptr [rax + 0xb8]
0000000180a6baa9: mov      qword ptr [rsp + 0x30], rsi
0000000180a6baae: mov      rcx, qword ptr [rax + 0x500]
0000000180a6bab5: test     rcx, rcx
0000000180a6bab8: jne      0x180a6bb1c
0000000180a6baba: xor      edx, edx
0000000180a6babc: mov      rcx, rbx
0000000180a6babf: call     0x180a7fdd0 ; Torappu.Battle.Enemy.get_specialBlockCondition [76276]
0000000180a6bac4: test     rax, rax
0000000180a6bac7: jne      0x180a6badb
0000000180a6bac9: mov      rsi, qword ptr [rsp + 0x30]
0000000180a6bace: mov      al, 1
0000000180a6bad0: mov      rbx, qword ptr [rsp + 0x38]
0000000180a6bad5: add      rsp, 0x20
0000000180a6bad9: pop      rdi
0000000180a6bada: ret      
0000000180a6badb: xor      edx, edx
0000000180a6badd: mov      rcx, rbx
0000000180a6bae0: call     0x180a7fdd0 ; Torappu.Battle.Enemy.get_specialBlockCondition [76276]
0000000180a6bae5: mov      rsi, rax
0000000180a6bae8: test     rdi, rdi
0000000180a6baeb: je       0x180a6bb5e
0000000180a6baed: xor      edx, edx
0000000180a6baef: mov      rcx, rdi
0000000180a6baf2: call     0x180a64910
0000000180a6baf7: test     rsi, rsi
0000000180a6bafa: je       0x180a6bb5e
0000000180a6bafc: xor      r9d, r9d
0000000180a6baff: mov      r8, rbx
0000000180a6bb02: mov      rdx, rax
0000000180a6bb05: mov      rcx, rsi
0000000180a6bb08: mov      rsi, qword ptr [rsp + 0x30]
0000000180a6bb0d: mov      rbx, qword ptr [rsp + 0x38]
0000000180a6bb12: add      rsp, 0x20
0000000180a6bb16: pop      rdi
0000000180a6bb17: jmp      0x180a9af70 ; Torappu.Battle.Enemy.SpecialBlockCondition.CheckBlockable [76914]
0000000180a6bb1c: xor      r9d, r9d
0000000180a6bb1f: mov      r8, rdi
0000000180a6bb22: mov      rdx, rbx
0000000180a6bb25: mov      rsi, qword ptr [rsp + 0x30]
0000000180a6bb2a: mov      rbx, qword ptr [rsp + 0x38]
0000000180a6bb2f: add      rsp, 0x20
0000000180a6bb33: pop      rdi
0000000180a6bb34: jmp      0x18332fc60 ; XLua.DelegateBridge.__Gen_Delegate_Imp29 [2684]
0000000180a6bb39: xor      al, al
0000000180a6bb3b: mov      rbx, qword ptr [rsp + 0x38]
0000000180a6bb40: add      rsp, 0x20
0000000180a6bb44: pop      rdi
0000000180a6bb45: ret      
0000000180a6bb46: xor      r9d, r9d
0000000180a6bb49: mov      r8, rdi
0000000180a6bb4c: mov      rdx, rbx
0000000180a6bb4f: mov      rbx, qword ptr [rsp + 0x38]
0000000180a6bb54: add      rsp, 0x20
0000000180a6bb58: pop      rdi
0000000180a6bb59: jmp      0x18332fc60 ; XLua.DelegateBridge.__Gen_Delegate_Imp29 [2684]
0000000180a6bb5e: call     0x18048c0b0
0000000180a6bb63: int3     
0000000180a6bb64: int3     
0000000180a6bb65: int3     
0000000180a6bb66: int3     
0000000180a6bb67: int3     
0000000180a6bb68: int3     
0000000180a6bb69: int3     
0000000180a6bb6a: int3     
0000000180a6bb6b: int3     
0000000180a6bb6c: int3     
0000000180a6bb6d: int3     
0000000180a6bb6e: int3     
0000000180a6bb6f: int3     