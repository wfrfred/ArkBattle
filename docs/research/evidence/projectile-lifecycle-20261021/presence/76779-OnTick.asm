; Torappu.Battle.Enemy.States.DisappearState.OnTick metadata=76779 token=0x6012bec VA=0x180a8d370 RVA=0xa8d370 size=0xd0
0000000180a8d370: mov      qword ptr [rsp + 8], rbx
0000000180a8d375: push     rdi
0000000180a8d376: sub      rsp, 0x20
0000000180a8d37a: cmp      byte ptr [rip + 0x82055f6], 0
0000000180a8d381: mov      rbx, rdx
0000000180a8d384: mov      rdi, rcx
0000000180a8d387: jne      0x180a8d3c0
0000000180a8d389: lea      rcx, [rip + 0x7df7ba0] ; TypeInfo Torappu.Battle.Enemy.States.DisappearState @0x188884f30
0000000180a8d390: call     0x18048bf00
0000000180a8d395: lea      rcx, [rip + 0x7eca104] ; GenericMethodInfo 194514 @0x1889574a0
0000000180a8d39c: call     0x18048bf00
0000000180a8d3a1: lea      rcx, [rip + 0x7eca338] ; GenericMethodInfo 282792 @0x1889576e0
0000000180a8d3a8: call     0x18048bf00
0000000180a8d3ad: lea      rcx, [rip + 0x7eca7ac] ; GenericMethodInfo 282794 @0x188957b60
0000000180a8d3b4: call     0x18048bf00
0000000180a8d3b9: mov      byte ptr [rip + 0x82055b7], 1
0000000180a8d3c0: mov      rax, qword ptr [rip + 0x7df7b69] ; TypeInfo Torappu.Battle.Enemy.States.DisappearState @0x188884f30
0000000180a8d3c7: mov      rcx, qword ptr [rax + 0xb8]
0000000180a8d3ce: mov      rcx, qword ptr [rcx + 0x48]
0000000180a8d3d2: test     rcx, rcx
0000000180a8d3d5: jne      0x180a8d41e
0000000180a8d3d7: mov      r8, qword ptr [rip + 0x7eca0c2] ; GenericMethodInfo 194514 @0x1889574a0
0000000180a8d3de: mov      rdx, rbx
0000000180a8d3e1: mov      rcx, rdi
0000000180a8d3e4: call     0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
0000000180a8d3e9: mov      rdx, qword ptr [rip + 0x7eca770] ; GenericMethodInfo 282794 @0x188957b60
0000000180a8d3f0: mov      rcx, rdi
0000000180a8d3f3: call     0x18536e540
0000000180a8d3f8: test     rax, rax
0000000180a8d3fb: je       0x180a8d437
0000000180a8d3fd: cmp      byte ptr [rax + 0x26], 0
0000000180a8d401: jne      0x180a8d42c
0000000180a8d403: mov      r8, qword ptr [rip + 0x7eca2d6] ; GenericMethodInfo 282792 @0x1889576e0
0000000180a8d40a: xor      edx, edx
0000000180a8d40c: mov      rcx, rdi
0000000180a8d40f: mov      rbx, qword ptr [rsp + 0x30]
0000000180a8d414: add      rsp, 0x20
0000000180a8d418: pop      rdi
0000000180a8d419: jmp      0x18536e450
0000000180a8d41e: xor      r9d, r9d
0000000180a8d421: mov      r8, rbx
0000000180a8d424: mov      rdx, rdi
0000000180a8d427: call     0x1833f9830 ; XLua.DelegateBridge.__Gen_Delegate_Imp427 [3082]
0000000180a8d42c: mov      rbx, qword ptr [rsp + 0x30]
0000000180a8d431: add      rsp, 0x20
0000000180a8d435: pop      rdi
0000000180a8d436: ret      
0000000180a8d437: call     0x18048c0b0
0000000180a8d43c: int3     
0000000180a8d43d: int3     
0000000180a8d43e: int3     
0000000180a8d43f: int3     