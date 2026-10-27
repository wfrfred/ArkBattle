; Torappu.Battle.Enemy.States.MoveState.OnExit metadata=76657 token=0x6012b72 VA=0x180a97740 RVA=0xa97740 size=0x90
0000000180a97740: mov      qword ptr [rsp + 8], rbx
0000000180a97745: push     rdi
0000000180a97746: sub      rsp, 0x20
0000000180a9774a: cmp      byte ptr [rip + 0x81fb1bf], 0
0000000180a97751: mov      ebx, edx
0000000180a97753: mov      rdi, rcx
0000000180a97756: jne      0x180a97777
0000000180a97758: lea      rcx, [rip + 0x7dee2f9] ; TypeInfo Torappu.Battle.Enemy.States.MoveState @0x188885a58
0000000180a9775f: call     0x18048bf00
0000000180a97764: lea      rcx, [rip + 0x7ebfaf5] ; GenericMethodInfo 194512 @0x188957260
0000000180a9776b: call     0x18048bf00
0000000180a97770: mov      byte ptr [rip + 0x81fb199], 1
0000000180a97777: mov      rax, qword ptr [rip + 0x7dee2da] ; TypeInfo Torappu.Battle.Enemy.States.MoveState @0x188885a58
0000000180a9777e: mov      r8, qword ptr [rax + 0xb8]
0000000180a97785: mov      rcx, qword ptr [r8 + 0x18]
0000000180a97789: test     rcx, rcx
0000000180a9778c: jne      0x180a977a9
0000000180a9778e: mov      r8, qword ptr [rip + 0x7ebfacb] ; GenericMethodInfo 194512 @0x188957260
0000000180a97795: mov      edx, ebx
0000000180a97797: mov      rcx, rdi
0000000180a9779a: mov      rbx, qword ptr [rsp + 0x30]
0000000180a9779f: add      rsp, 0x20
0000000180a977a3: pop      rdi
0000000180a977a4: jmp      0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
0000000180a977a9: xor      r9d, r9d
0000000180a977ac: mov      r8d, ebx
0000000180a977af: mov      rdx, rdi
0000000180a977b2: mov      rbx, qword ptr [rsp + 0x30]
0000000180a977b7: add      rsp, 0x20
0000000180a977bb: pop      rdi
0000000180a977bc: jmp      0x1834c0e30 ; XLua.DelegateBridge.__Gen_Delegate_Imp55 [2710]
0000000180a977c1: int3     
0000000180a977c2: int3     
0000000180a977c3: int3     
0000000180a977c4: int3     
0000000180a977c5: int3     
0000000180a977c6: int3     
0000000180a977c7: int3     
0000000180a977c8: int3     
0000000180a977c9: int3     
0000000180a977ca: int3     
0000000180a977cb: int3     
0000000180a977cc: int3     
0000000180a977cd: int3     
0000000180a977ce: int3     
0000000180a977cf: int3     
