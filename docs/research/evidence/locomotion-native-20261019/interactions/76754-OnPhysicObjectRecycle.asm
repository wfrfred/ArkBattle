; Torappu.Battle.Enemy.States.UnbalanceState.OnPhysicObjectRecycle metadata=76754 token=0x6012bd3 VA=0x180a9ee80 RVA=0xa9ee80 size=0x90
0000000180a9ee80: push     rbx
0000000180a9ee82: sub      rsp, 0x20
0000000180a9ee86: cmp      byte ptr [rip + 0x81f3ad6], 0
0000000180a9ee8d: mov      rbx, rcx
0000000180a9ee90: jne      0x180a9eeb1
0000000180a9ee92: lea      rcx, [rip + 0x7e34a6f] ; GenericMethodInfo 281972 @0x1888d3908
0000000180a9ee99: call     0x18048bf00
0000000180a9ee9e: lea      rcx, [rip + 0x7de76e3] ; TypeInfo Torappu.Battle.Enemy.States.UnbalanceState @0x188886588
0000000180a9eea5: call     0x18048bf00
0000000180a9eeaa: mov      byte ptr [rip + 0x81f3ab2], 1
0000000180a9eeb1: mov      rax, qword ptr [rip + 0x7de76d0] ; TypeInfo Torappu.Battle.Enemy.States.UnbalanceState @0x188886588
0000000180a9eeb8: mov      rdx, qword ptr [rax + 0xb8]
0000000180a9eebf: mov      rcx, qword ptr [rdx + 0x78]
0000000180a9eec3: test     rcx, rcx
0000000180a9eec6: jne      0x180a9eeec
0000000180a9eec8: mov      rcx, qword ptr [rip + 0x7e34a39] ; GenericMethodInfo 281972 @0x1888d3908
0000000180a9eecf: call     0x185337c50
0000000180a9eed4: test     rax, rax
0000000180a9eed7: je       0x180a9eefc
0000000180a9eed9: xor      r8d, r8d
0000000180a9eedc: mov      rdx, rbx
0000000180a9eedf: mov      rcx, rax
0000000180a9eee2: add      rsp, 0x20
0000000180a9eee6: pop      rbx
0000000180a9eee7: jmp      0x18062bf70 ; Torappu.Battle.BattleController.OnPhysicObjectRecycle [64762]
0000000180a9eeec: xor      r8d, r8d
0000000180a9eeef: mov      rdx, rbx
0000000180a9eef2: add      rsp, 0x20
0000000180a9eef6: pop      rbx
0000000180a9eef7: jmp      0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
0000000180a9eefc: call     0x18048c0b0
0000000180a9ef01: int3     
0000000180a9ef02: int3     
0000000180a9ef03: int3     
0000000180a9ef04: int3     
0000000180a9ef05: int3     
0000000180a9ef06: int3     
0000000180a9ef07: int3     
0000000180a9ef08: int3     
0000000180a9ef09: int3     
0000000180a9ef0a: int3     
0000000180a9ef0b: int3     
0000000180a9ef0c: int3     
0000000180a9ef0d: int3     
0000000180a9ef0e: int3     
0000000180a9ef0f: int3     