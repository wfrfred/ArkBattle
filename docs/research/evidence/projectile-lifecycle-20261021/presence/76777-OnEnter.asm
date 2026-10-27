; Torappu.Battle.Enemy.States.DisappearState.OnEnter metadata=76777 token=0x6012bea VA=0x180a8d030 RVA=0xa8d030 size=0x1c0
0000000180a8d030: mov      qword ptr [rsp + 0x10], rbx
0000000180a8d035: push     rdi
0000000180a8d036: sub      rsp, 0x30
0000000180a8d03a: cmp      byte ptr [rip + 0x8205934], 0
0000000180a8d041: mov      edi, edx
0000000180a8d043: mov      rbx, rcx
0000000180a8d046: jne      0x180a8d07f
0000000180a8d048: lea      rcx, [rip + 0x7e9ad11] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
0000000180a8d04f: call     0x18048bf00
0000000180a8d054: lea      rcx, [rip + 0x7df7ed5] ; TypeInfo Torappu.Battle.Enemy.States.DisappearState @0x188884f30
0000000180a8d05b: call     0x18048bf00
0000000180a8d060: lea      rcx, [rip + 0x7ec9fb9] ; GenericMethodInfo 194511 @0x188957020
0000000180a8d067: call     0x18048bf00
0000000180a8d06c: lea      rcx, [rip + 0x7ecaaed] ; GenericMethodInfo 282794 @0x188957b60
0000000180a8d073: call     0x18048bf00
0000000180a8d078: mov      byte ptr [rip + 0x82058f6], 1
0000000180a8d07f: mov      rax, qword ptr [rip + 0x7df7eaa] ; TypeInfo Torappu.Battle.Enemy.States.DisappearState @0x188884f30
0000000180a8d086: mov      rcx, qword ptr [rax + 0xb8]
0000000180a8d08d: mov      rcx, qword ptr [rcx + 0x38]
0000000180a8d091: test     rcx, rcx
0000000180a8d094: jne      0x180a8d1cc
0000000180a8d09a: mov      qword ptr [rsp + 0x40], rsi
0000000180a8d09f: mov      r8, qword ptr [rip + 0x7ec9f7a] ; GenericMethodInfo 194511 @0x188957020
0000000180a8d0a6: mov      edx, edi
0000000180a8d0a8: mov      rcx, rbx
0000000180a8d0ab: call     0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
0000000180a8d0b0: mov      rdx, qword ptr [rip + 0x7ecaaa9] ; GenericMethodInfo 282794 @0x188957b60
0000000180a8d0b7: mov      rcx, rbx
0000000180a8d0ba: call     0x18536e540
0000000180a8d0bf: test     rax, rax
0000000180a8d0c2: je       0x180a8d1e4
0000000180a8d0c8: xor      edx, edx
0000000180a8d0ca: mov      rcx, rax
0000000180a8d0cd: call     0x180701e20 ; Torappu.Battle.Entity.get_attributes [66358]
0000000180a8d0d2: test     rax, rax
0000000180a8d0d5: je       0x180a8d1e4
0000000180a8d0db: xor      r8d, r8d
0000000180a8d0de: mov      rdx, rbx
0000000180a8d0e1: mov      rcx, rax
0000000180a8d0e4: call     0x180648650 ; Torappu.Battle.Attributes.AddModifier [64273]
0000000180a8d0e9: mov      rdx, qword ptr [rip + 0x7ecaa70] ; GenericMethodInfo 282794 @0x188957b60
0000000180a8d0f0: mov      rcx, rbx
0000000180a8d0f3: call     0x18536e540
0000000180a8d0f8: cmp      byte ptr [rip + 0x8205879], 0
0000000180a8d0ff: mov      rsi, rax
0000000180a8d102: jne      0x180a8d123
0000000180a8d104: lea      rcx, [rip + 0x7df7e25] ; TypeInfo Torappu.Battle.Enemy.States.DisappearState @0x188884f30
0000000180a8d10b: call     0x18048bf00
0000000180a8d110: lea      rcx, [rip + 0x7e5a681] ; TypeInfo Torappu.Battle.Enemy.States.DisappearState.<_DoDisappear>d__21 @0x1888e7798
0000000180a8d117: call     0x18048bf00
0000000180a8d11c: mov      byte ptr [rip + 0x8205855], 1
0000000180a8d123: mov      rcx, qword ptr [rip + 0x7df7e06] ; TypeInfo Torappu.Battle.Enemy.States.DisappearState @0x188884f30
0000000180a8d12a: mov      rdx, qword ptr [rcx + 0xb8]
0000000180a8d131: mov      rcx, qword ptr [rdx + 0x50]
0000000180a8d135: test     rcx, rcx
0000000180a8d138: jne      0x180a8d175
0000000180a8d13a: mov      rcx, qword ptr [rip + 0x7e5a657] ; TypeInfo Torappu.Battle.Enemy.States.DisappearState.<_DoDisappear>d__21 @0x1888e7798
0000000180a8d141: call     0x18045cfe0
0000000180a8d146: mov      rdi, rax
0000000180a8d149: test     rax, rax
0000000180a8d14c: je       0x180a8d1e4
0000000180a8d152: xor      edx, edx
0000000180a8d154: mov      rcx, rax
0000000180a8d157: call     0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
0000000180a8d15c: lea      rcx, [rdi + 0x20]
0000000180a8d160: mov      dword ptr [rdi + 0x10], 0
0000000180a8d167: mov      rdx, rbx
0000000180a8d16a: mov      qword ptr [rdi + 0x20], rbx
0000000180a8d16e: call     0x18048b9e0
0000000180a8d173: jmp      0x180a8d183
0000000180a8d175: xor      r8d, r8d
0000000180a8d178: mov      rdx, rbx
0000000180a8d17b: call     0x1835d3a10 ; XLua.DelegateBridge.__Gen_Delegate_Imp73 [2728]
0000000180a8d180: mov      rdi, rax
0000000180a8d183: mov      rcx, qword ptr [rip + 0x7e9abd6] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
0000000180a8d18a: cmp      dword ptr [rcx + 0xe0], 0
0000000180a8d191: jne      0x180a8d198
0000000180a8d193: call     0x18048c140
0000000180a8d198: xor      r9d, r9d
0000000180a8d19b: lea      rcx, [rsp + 0x20]
0000000180a8d1a0: mov      r8, rdi
0000000180a8d1a3: mov      rdx, rsi
0000000180a8d1a6: call     0x180633110 ; Torappu.Battle.BattleController.StartBattleCoroutine [64743]
0000000180a8d1ab: lea      rcx, [rbx + 0x18]
0000000180a8d1af: xor      edx, edx
0000000180a8d1b1: movups   xmm0, xmmword ptr [rax]
0000000180a8d1b4: movups   xmmword ptr [rbx + 0x18], xmm0
0000000180a8d1b8: mov      rsi, qword ptr [rsp + 0x40]
0000000180a8d1bd: mov      rbx, qword ptr [rsp + 0x48]
0000000180a8d1c2: add      rsp, 0x30
0000000180a8d1c6: pop      rdi
0000000180a8d1c7: jmp      0x18048b9e0
0000000180a8d1cc: xor      r9d, r9d
0000000180a8d1cf: mov      r8d, edi
0000000180a8d1d2: mov      rdx, rbx
0000000180a8d1d5: mov      rbx, qword ptr [rsp + 0x48]
0000000180a8d1da: add      rsp, 0x30
0000000180a8d1de: pop      rdi
0000000180a8d1df: jmp      0x1834c0e30 ; XLua.DelegateBridge.__Gen_Delegate_Imp55 [2710]
0000000180a8d1e4: call     0x18048c0b0
0000000180a8d1e9: int3     
0000000180a8d1ea: int3     
0000000180a8d1eb: int3     
0000000180a8d1ec: int3     
0000000180a8d1ed: int3     
0000000180a8d1ee: int3     
0000000180a8d1ef: int3     