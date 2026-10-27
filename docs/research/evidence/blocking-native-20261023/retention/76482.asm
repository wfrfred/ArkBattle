; Torappu.Battle.Enemy.OnAttributeDirty metadata=76482 token=0x6012ac3 VA=0x180a6f7f0 RVA=0xa6f7f0 size=0x1a0
0000000180a6f7f0: mov      qword ptr [rsp + 8], rbx
0000000180a6f7f5: mov      qword ptr [rsp + 0x10], rsi
0000000180a6f7fa: push     rdi
0000000180a6f7fb: sub      rsp, 0x30
0000000180a6f7ff: cmp      byte ptr [rip + 0x82230a5], 0
0000000180a6f806: mov      rbx, r8
0000000180a6f809: mov      esi, edx
0000000180a6f80b: mov      rdi, rcx
0000000180a6f80e: jne      0x180a6f82f
0000000180a6f810: lea      rcx, [rip + 0x7dabe99] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6f817: call     0x18048bf00
0000000180a6f81c: lea      rcx, [rip + 0x7e16235] ; TypeInfo Torappu.Battle.Enemy.States.MoveState @0x188885a58
0000000180a6f823: call     0x18048bf00
0000000180a6f828: mov      byte ptr [rip + 0x822307c], 1
0000000180a6f82f: mov      rax, qword ptr [rip + 0x7dabe7a] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6f836: cmp      dword ptr [rax + 0xe0], 0
0000000180a6f83d: jne      0x180a6f84e
0000000180a6f83f: mov      rcx, rax
0000000180a6f842: call     0x18048c140
0000000180a6f847: mov      rax, qword ptr [rip + 0x7dabe62] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6f84e: mov      rax, qword ptr [rax + 0xb8]
0000000180a6f855: mov      rcx, qword ptr [rax + 0x698]
0000000180a6f85c: test     rcx, rcx
0000000180a6f85f: jne      0x180a6f95a
0000000180a6f865: xor      r9d, r9d
0000000180a6f868: mov      r8, rbx
0000000180a6f86b: mov      edx, esi
0000000180a6f86d: mov      rcx, rdi
0000000180a6f870: call     0x180ac9c50 ; Torappu.Battle.Unit.OnAttributeDirty [77706]
0000000180a6f875: cmp      esi, 5
0000000180a6f878: jne      0x180a6f8fe
0000000180a6f87e: mov      rcx, qword ptr [rdi + 0x578]
0000000180a6f885: test     rcx, rcx
0000000180a6f888: je       0x180a6f981
0000000180a6f88e: xor      r8d, r8d
0000000180a6f891: mov      rdx, rdi
0000000180a6f894: call     0x180aa1170 ; Torappu.Battle.BlockManager.UpdateBlockees [77192]
0000000180a6f899: xor      edx, edx
0000000180a6f89b: mov      rcx, rdi
0000000180a6f89e: call     0x180702100 ; Torappu.Battle.Entity.get_buffContainer [66402]
0000000180a6f8a3: test     rax, rax
0000000180a6f8a6: je       0x180a6f981
0000000180a6f8ac: xor      edx, edx
0000000180a6f8ae: mov      rcx, rax
0000000180a6f8b1: call     0x18066f260 ; Torappu.Battle.Buff.BuffContainer.OnBlockCntChanged [65468]
0000000180a6f8b6: cmp      byte ptr [rip + 0x825cf33], 0
0000000180a6f8bd: jbe      0x180a6f8c7
0000000180a6f8bf: mov      rcx, qword ptr [rdi]
0000000180a6f8c2: call     0x180446d00
0000000180a6f8c7: mov      rdx, qword ptr [rdi]
0000000180a6f8ca: mov      rcx, rdi
0000000180a6f8cd: mov      rax, qword ptr [rdx + 0x680]
0000000180a6f8d4: mov      rdx, qword ptr [rdx + 0x688]
0000000180a6f8db: call     rax
0000000180a6f8dd: test     eax, eax
0000000180a6f8df: jne      0x180a6f971
0000000180a6f8e5: xor      edx, edx
0000000180a6f8e7: mov      rcx, rdi
0000000180a6f8ea: mov      rbx, qword ptr [rsp + 0x40]
0000000180a6f8ef: mov      rsi, qword ptr [rsp + 0x48]
0000000180a6f8f4: add      rsp, 0x30
0000000180a6f8f8: pop      rdi
0000000180a6f8f9: jmp      0x180a74110 ; Torappu.Battle.Enemy.ReleaseBlock [76546]
0000000180a6f8fe: cmp      esi, 6
0000000180a6f901: je       0x180a6f908
0000000180a6f903: cmp      esi, 0x24
0000000180a6f906: jne      0x180a6f971
0000000180a6f908: xor      edx, edx
0000000180a6f90a: mov      rcx, rdi
0000000180a6f90d: call     0x180a800c0 ; Torappu.Battle.Enemy.get_stateMachine [76373]
0000000180a6f912: test     rax, rax
0000000180a6f915: je       0x180a6f981
0000000180a6f917: cmp      dword ptr [rax + 0x48], 1
0000000180a6f91b: jne      0x180a6f971
0000000180a6f91d: xor      edx, edx
0000000180a6f91f: mov      rcx, rdi
0000000180a6f922: call     0x180a800c0 ; Torappu.Battle.Enemy.get_stateMachine [76373]
0000000180a6f927: test     rax, rax
0000000180a6f92a: je       0x180a6f981
0000000180a6f92c: mov      rdx, qword ptr [rip + 0x7e16125] ; TypeInfo Torappu.Battle.Enemy.States.MoveState @0x188885a58
0000000180a6f933: mov      rcx, qword ptr [rax + 0x50]
0000000180a6f937: call     0x1800057a0
0000000180a6f93c: test     rax, rax
0000000180a6f93f: je       0x180a6f971
0000000180a6f941: xor      edx, edx
0000000180a6f943: mov      rcx, rax
0000000180a6f946: mov      rbx, qword ptr [rsp + 0x40]
0000000180a6f94b: mov      rsi, qword ptr [rsp + 0x48]
0000000180a6f950: add      rsp, 0x30
0000000180a6f954: pop      rdi
0000000180a6f955: jmp      0x180a97c90 ; Torappu.Battle.Enemy.States.MoveState.UpdateMoveAnimation [76659]
0000000180a6f95a: mov      r9, rbx
0000000180a6f95d: mov      qword ptr [rsp + 0x20], 0
0000000180a6f966: mov      r8d, esi
0000000180a6f969: mov      rdx, rdi
0000000180a6f96c: call     0x183325f60 ; XLua.DelegateBridge.__Gen_Delegate_Imp2934 [5589]
0000000180a6f971: mov      rbx, qword ptr [rsp + 0x40]
0000000180a6f976: mov      rsi, qword ptr [rsp + 0x48]
0000000180a6f97b: add      rsp, 0x30
0000000180a6f97f: pop      rdi
0000000180a6f980: ret      
0000000180a6f981: call     0x18048c0b0
0000000180a6f986: int3     
0000000180a6f987: int3     
0000000180a6f988: int3     
0000000180a6f989: int3     
0000000180a6f98a: int3     
0000000180a6f98b: int3     
0000000180a6f98c: int3     
0000000180a6f98d: int3     
0000000180a6f98e: int3     
0000000180a6f98f: int3     