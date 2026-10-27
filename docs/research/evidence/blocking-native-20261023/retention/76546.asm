; Torappu.Battle.Enemy.ReleaseBlock metadata=76546 token=0x6012b03 VA=0x180a74110 RVA=0xa74110 size=0xb0
0000000180a74110: push     rbx
0000000180a74112: sub      rsp, 0x20
0000000180a74116: cmp      byte ptr [rip + 0x821e7ce], 0
0000000180a7411d: mov      rbx, rcx
0000000180a74120: jne      0x180a74135
0000000180a74122: lea      rcx, [rip + 0x7da7587] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a74129: call     0x18048bf00
0000000180a7412e: mov      byte ptr [rip + 0x821e7b6], 1
0000000180a74135: mov      rax, qword ptr [rip + 0x7da7574] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7413c: cmp      dword ptr [rax + 0xe0], 0
0000000180a74143: jne      0x180a74154
0000000180a74145: mov      rcx, rax
0000000180a74148: call     0x18048c140
0000000180a7414d: mov      rax, qword ptr [rip + 0x7da755c] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a74154: mov      rax, qword ptr [rax + 0xb8]
0000000180a7415b: mov      rcx, qword ptr [rax + 0x898]
0000000180a74162: test     rcx, rcx
0000000180a74165: jne      0x180a7419b
0000000180a74167: xor      edx, edx
0000000180a74169: mov      rcx, rbx
0000000180a7416c: call     0x180a741c0 ; Torappu.Battle.Enemy.ReleaseFromBlocker [76492]
0000000180a74171: xor      edx, edx
0000000180a74173: mov      rcx, rbx
0000000180a74176: call     0x180a7bc60 ; Torappu.Battle.Enemy.get_canBlockEnemies [76559]
0000000180a7417b: test     al, al
0000000180a7417d: je       0x180a741ab
0000000180a7417f: mov      rcx, qword ptr [rbx + 0x578]
0000000180a74186: test     rcx, rcx
0000000180a74189: je       0x180a741b1
0000000180a7418b: xor      r8d, r8d
0000000180a7418e: mov      rdx, rbx
0000000180a74191: add      rsp, 0x20
0000000180a74195: pop      rbx
0000000180a74196: jmp      0x180aa0660 ; Torappu.Battle.BlockManager.ClearAllBlockees [77196]
0000000180a7419b: xor      r8d, r8d
0000000180a7419e: mov      rdx, rbx
0000000180a741a1: add      rsp, 0x20
0000000180a741a5: pop      rbx
0000000180a741a6: jmp      0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
0000000180a741ab: add      rsp, 0x20
0000000180a741af: pop      rbx
0000000180a741b0: ret      
0000000180a741b1: call     0x18048c0b0
0000000180a741b6: int3     
0000000180a741b7: int3     
0000000180a741b8: int3     
0000000180a741b9: int3     
0000000180a741ba: int3     
0000000180a741bb: int3     
0000000180a741bc: int3     
0000000180a741bd: int3     
0000000180a741be: int3     
0000000180a741bf: int3     