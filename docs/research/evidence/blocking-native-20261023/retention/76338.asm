; Torappu.Battle.Enemy.get_isInCombatState metadata=76338 token=0x6012a33 VA=0x180a7df50 RVA=0xa7df50 size=0x90
0000000180a7df50: push     rbx
0000000180a7df52: sub      rsp, 0x20
0000000180a7df56: cmp      byte ptr [rip + 0x82148be], 0
0000000180a7df5d: mov      rbx, rcx
0000000180a7df60: jne      0x180a7df75
0000000180a7df62: lea      rcx, [rip + 0x7d9d747] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7df69: call     0x18048bf00
0000000180a7df6e: mov      byte ptr [rip + 0x82148a6], 1
0000000180a7df75: mov      rax, qword ptr [rip + 0x7d9d734] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7df7c: cmp      dword ptr [rax + 0xe0], 0
0000000180a7df83: jne      0x180a7df94
0000000180a7df85: mov      rcx, rax
0000000180a7df88: call     0x18048c140
0000000180a7df8d: mov      rax, qword ptr [rip + 0x7d9d71c] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7df94: mov      rax, qword ptr [rax + 0xb8]
0000000180a7df9b: mov      rcx, qword ptr [rax + 0x218]
0000000180a7dfa2: test     rcx, rcx
0000000180a7dfa5: jne      0x180a7dfbd
0000000180a7dfa7: mov      rax, qword ptr [rbx + 0x38]
0000000180a7dfab: test     rax, rax
0000000180a7dfae: je       0x180a7dfcd
0000000180a7dfb0: cmp      dword ptr [rax + 0x48], 3
0000000180a7dfb4: sete     al
0000000180a7dfb7: add      rsp, 0x20
0000000180a7dfbb: pop      rbx
0000000180a7dfbc: ret      
0000000180a7dfbd: xor      r8d, r8d
0000000180a7dfc0: mov      rdx, rbx
0000000180a7dfc3: add      rsp, 0x20
0000000180a7dfc7: pop      rbx
0000000180a7dfc8: jmp      0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
0000000180a7dfcd: call     0x18048c0b0
0000000180a7dfd2: int3     
0000000180a7dfd3: int3     
0000000180a7dfd4: int3     
0000000180a7dfd5: int3     
0000000180a7dfd6: int3     
0000000180a7dfd7: int3     
0000000180a7dfd8: int3     
0000000180a7dfd9: int3     
0000000180a7dfda: int3     
0000000180a7dfdb: int3     
0000000180a7dfdc: int3     
0000000180a7dfdd: int3     
0000000180a7dfde: int3     
0000000180a7dfdf: int3     