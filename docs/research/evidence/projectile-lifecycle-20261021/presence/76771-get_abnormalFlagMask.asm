; Torappu.Battle.Enemy.States.DisappearState.get_abnormalFlagMask metadata=76771 token=0x6012be4 VA=0x180a8dda0 RVA=0xa8dda0 size=0x60
0000000180a8dda0: push     rbx
0000000180a8dda2: sub      rsp, 0x20
0000000180a8dda6: cmp      byte ptr [rip + 0x8204bc2], 0
0000000180a8ddad: mov      rbx, rcx
0000000180a8ddb0: jne      0x180a8ddc5
0000000180a8ddb2: lea      rcx, [rip + 0x7df7177] ; TypeInfo Torappu.Battle.Enemy.States.DisappearState @0x188884f30
0000000180a8ddb9: call     0x18048bf00
0000000180a8ddbe: mov      byte ptr [rip + 0x8204baa], 1
0000000180a8ddc5: mov      rax, qword ptr [rip + 0x7df7164] ; TypeInfo Torappu.Battle.Enemy.States.DisappearState @0x188884f30
0000000180a8ddcc: mov      rdx, qword ptr [rax + 0xb8]
0000000180a8ddd3: mov      rcx, qword ptr [rdx + 8]
0000000180a8ddd7: test     rcx, rcx
0000000180a8ddda: jne      0x180a8dde7
0000000180a8dddc: mov      eax, 0x128
0000000180a8dde1: add      rsp, 0x20
0000000180a8dde5: pop      rbx
0000000180a8dde6: ret      
0000000180a8dde7: xor      r8d, r8d
0000000180a8ddea: mov      rdx, rbx
0000000180a8dded: add      rsp, 0x20
0000000180a8ddf1: pop      rbx
0000000180a8ddf2: jmp      0x18335f7c0 ; XLua.DelegateBridge.__Gen_Delegate_Imp330 [2985]
0000000180a8ddf7: int3     
0000000180a8ddf8: int3     
0000000180a8ddf9: int3     
0000000180a8ddfa: int3     
0000000180a8ddfb: int3     
0000000180a8ddfc: int3     
0000000180a8ddfd: int3     
0000000180a8ddfe: int3     
0000000180a8ddff: int3     