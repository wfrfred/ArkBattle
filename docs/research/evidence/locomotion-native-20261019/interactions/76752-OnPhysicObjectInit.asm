; Torappu.Battle.Enemy.States.UnbalanceState.OnPhysicObjectInit metadata=76752 token=0x6012bd1 VA=0x180a9edf0 RVA=0xa9edf0 size=0x90
0000000180a9edf0: push     rbx
0000000180a9edf2: sub      rsp, 0x20
0000000180a9edf6: cmp      byte ptr [rip + 0x81f3b64], 0
0000000180a9edfd: mov      rbx, rcx
0000000180a9ee00: jne      0x180a9ee21
0000000180a9ee02: lea      rcx, [rip + 0x7e34aff] ; GenericMethodInfo 281972 @0x1888d3908
0000000180a9ee09: call     0x18048bf00
0000000180a9ee0e: lea      rcx, [rip + 0x7de7773] ; TypeInfo Torappu.Battle.Enemy.States.UnbalanceState @0x188886588
0000000180a9ee15: call     0x18048bf00
0000000180a9ee1a: mov      byte ptr [rip + 0x81f3b40], 1
0000000180a9ee21: mov      rax, qword ptr [rip + 0x7de7760] ; TypeInfo Torappu.Battle.Enemy.States.UnbalanceState @0x188886588
0000000180a9ee28: mov      rdx, qword ptr [rax + 0xb8]
0000000180a9ee2f: mov      rcx, qword ptr [rdx + 0x68]
0000000180a9ee33: test     rcx, rcx
0000000180a9ee36: jne      0x180a9ee5c
0000000180a9ee38: mov      rcx, qword ptr [rip + 0x7e34ac9] ; GenericMethodInfo 281972 @0x1888d3908
0000000180a9ee3f: call     0x185337c50
0000000180a9ee44: test     rax, rax
0000000180a9ee47: je       0x180a9ee6c
0000000180a9ee49: xor      r8d, r8d
0000000180a9ee4c: mov      rdx, rbx
0000000180a9ee4f: mov      rcx, rax
0000000180a9ee52: add      rsp, 0x20
0000000180a9ee56: pop      rbx
0000000180a9ee57: jmp      0x18062bec0 ; Torappu.Battle.BattleController.OnPhysicObjectInit [64761]
0000000180a9ee5c: xor      r8d, r8d
0000000180a9ee5f: mov      rdx, rbx
0000000180a9ee62: add      rsp, 0x20
0000000180a9ee66: pop      rbx
0000000180a9ee67: jmp      0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
0000000180a9ee6c: call     0x18048c0b0
0000000180a9ee71: int3     
0000000180a9ee72: int3     
0000000180a9ee73: int3     
0000000180a9ee74: int3     
0000000180a9ee75: int3     
0000000180a9ee76: int3     
0000000180a9ee77: int3     
0000000180a9ee78: int3     
0000000180a9ee79: int3     
0000000180a9ee7a: int3     
0000000180a9ee7b: int3     
0000000180a9ee7c: int3     
0000000180a9ee7d: int3     
0000000180a9ee7e: int3     
0000000180a9ee7f: int3     