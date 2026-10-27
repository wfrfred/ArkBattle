; Torappu.Battle.GameMode.GameModeFactory.DefaultGameMode.Tick metadata=82164 token=0x60140f5 VA=0x180c1b5e0 RVA=0xc1b5e0 size=0x90
0000000180c1b5e0: mov      qword ptr [rsp + 8], rbx
0000000180c1b5e5: push     rdi
0000000180c1b5e6: sub      rsp, 0x20
0000000180c1b5ea: cmp      byte ptr [rip + 0x80783cf], 0
0000000180c1b5f1: mov      rbx, rdx
0000000180c1b5f4: mov      rdi, rcx
0000000180c1b5f7: jne      0x180c1b60c
0000000180c1b5f9: lea      rcx, [rip + 0x7c8d710] ; TypeInfo Torappu.Battle.GameMode.GameModeFactory.DefaultGameMode @0x1888a8d10
0000000180c1b600: call     0x18048bf00
0000000180c1b605: mov      byte ptr [rip + 0x80783b4], 1
0000000180c1b60c: mov      rax, qword ptr [rip + 0x7c8d6fd] ; TypeInfo Torappu.Battle.GameMode.GameModeFactory.DefaultGameMode @0x1888a8d10
0000000180c1b613: mov      r8, qword ptr [rax + 0xb8]
0000000180c1b61a: mov      rcx, qword ptr [r8 + 0xd0]
0000000180c1b621: test     rcx, rcx
0000000180c1b624: jne      0x180c1b649
0000000180c1b626: cmp      byte ptr [rdi + 0x10], cl
0000000180c1b629: jne      0x180c1b657
0000000180c1b62b: test     rbx, rbx
0000000180c1b62e: je       0x180c1b662
0000000180c1b630: mov      rax, qword ptr [rbx + 0x18]
0000000180c1b634: mov      rdx, qword ptr [rbx + 0x28]
0000000180c1b638: mov      rcx, qword ptr [rbx + 0x40]
0000000180c1b63c: mov      rbx, qword ptr [rsp + 0x30]
0000000180c1b641: add      rsp, 0x20
0000000180c1b645: pop      rdi
0000000180c1b646: jmp      rax
0000000180c1b649: xor      r9d, r9d
0000000180c1b64c: mov      r8, rbx
0000000180c1b64f: mov      rdx, rdi
0000000180c1b652: call     0x1832d2220 ; XLua.DelegateBridge.__Gen_Delegate_Imp23 [2678]
0000000180c1b657: mov      rbx, qword ptr [rsp + 0x30]
0000000180c1b65c: add      rsp, 0x20
0000000180c1b660: pop      rdi
0000000180c1b661: ret      
0000000180c1b662: call     0x18048c0b0
0000000180c1b667: int3     
0000000180c1b668: int3     
0000000180c1b669: int3     
0000000180c1b66a: int3     
0000000180c1b66b: int3     
0000000180c1b66c: int3     
0000000180c1b66d: int3     
0000000180c1b66e: int3     
0000000180c1b66f: int3     