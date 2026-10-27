; Torappu.Battle.Enemy.States.DisappearState.OnExit metadata=76778 token=0x6012beb VA=0x180a8d1f0 RVA=0xa8d1f0 size=0x180
0000000180a8d1f0: mov      qword ptr [rsp + 8], rbx
0000000180a8d1f5: push     rdi
0000000180a8d1f6: sub      rsp, 0x40
0000000180a8d1fa: cmp      byte ptr [rip + 0x8205775], 0
0000000180a8d201: mov      edi, edx
0000000180a8d203: mov      rbx, rcx
0000000180a8d206: jne      0x180a8d24b
0000000180a8d208: lea      rcx, [rip + 0x7e9ab51] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
0000000180a8d20f: call     0x18048bf00
0000000180a8d214: lea      rcx, [rip + 0x7e58d5d] ; TypeInfo Torappu.Battle.CoroutineId @0x1888e5f78
0000000180a8d21b: call     0x18048bf00
0000000180a8d220: lea      rcx, [rip + 0x7df7d09] ; TypeInfo Torappu.Battle.Enemy.States.DisappearState @0x188884f30
0000000180a8d227: call     0x18048bf00
0000000180a8d22c: lea      rcx, [rip + 0x7eca02d] ; GenericMethodInfo 194512 @0x188957260
0000000180a8d233: call     0x18048bf00
0000000180a8d238: lea      rcx, [rip + 0x7eca921] ; GenericMethodInfo 282794 @0x188957b60
0000000180a8d23f: call     0x18048bf00
0000000180a8d244: mov      byte ptr [rip + 0x820572b], 1
0000000180a8d24b: mov      rax, qword ptr [rip + 0x7df7cde] ; TypeInfo Torappu.Battle.Enemy.States.DisappearState @0x188884f30
0000000180a8d252: mov      rcx, qword ptr [rax + 0xb8]
0000000180a8d259: mov      rcx, qword ptr [rcx + 0x40]
0000000180a8d25d: test     rcx, rcx
0000000180a8d260: jne      0x180a8d34b
0000000180a8d266: mov      r8, qword ptr [rip + 0x7ec9ff3] ; GenericMethodInfo 194512 @0x188957260
0000000180a8d26d: mov      edx, edi
0000000180a8d26f: mov      rcx, rbx
0000000180a8d272: call     0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
0000000180a8d277: mov      rcx, qword ptr [rip + 0x7e58cfa] ; TypeInfo Torappu.Battle.CoroutineId @0x1888e5f78
0000000180a8d27e: cmp      dword ptr [rcx + 0xe0], 0
0000000180a8d285: jne      0x180a8d28c
0000000180a8d287: call     0x18048c140
0000000180a8d28c: lea      rcx, [rbx + 0x18]
0000000180a8d290: xor      edx, edx
0000000180a8d292: call     0x18065cf80 ; Torappu.Battle.CoroutineId.get_isValid [64225]
0000000180a8d297: test     al, al
0000000180a8d299: je       0x180a8d306
0000000180a8d29b: mov      rdx, qword ptr [rip + 0x7eca8be] ; GenericMethodInfo 282794 @0x188957b60
0000000180a8d2a2: mov      rcx, rbx
0000000180a8d2a5: movaps   xmmword ptr [rsp + 0x30], xmm6
0000000180a8d2aa: call     0x18536e540
0000000180a8d2af: mov      rcx, qword ptr [rip + 0x7e9aaaa] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
0000000180a8d2b6: mov      rdi, rax
0000000180a8d2b9: movups   xmm6, xmmword ptr [rbx + 0x18]
0000000180a8d2bd: cmp      dword ptr [rcx + 0xe0], 0
0000000180a8d2c4: jne      0x180a8d2cb
0000000180a8d2c6: call     0x18048c140
0000000180a8d2cb: xor      r8d, r8d
0000000180a8d2ce: movdqa   xmmword ptr [rsp + 0x20], xmm6
0000000180a8d2d4: lea      rdx, [rsp + 0x20]
0000000180a8d2d9: mov      rcx, rdi
0000000180a8d2dc: call     0x1806339f0 ; Torappu.Battle.BattleController.StopBattleCoroutine [64744]
0000000180a8d2e1: mov      rcx, qword ptr [rip + 0x7e58c90] ; TypeInfo Torappu.Battle.CoroutineId @0x1888e5f78
0000000180a8d2e8: movaps   xmm6, xmmword ptr [rsp + 0x30]
0000000180a8d2ed: cmp      dword ptr [rcx + 0xe0], 0
0000000180a8d2f4: jne      0x180a8d2fb
0000000180a8d2f6: call     0x18048c140
0000000180a8d2fb: lea      rcx, [rbx + 0x18]
0000000180a8d2ff: xor      edx, edx
0000000180a8d301: call     0x18065ce60 ; Torappu.Battle.CoroutineId.MarkInvalid [64226]
0000000180a8d306: mov      rdx, qword ptr [rip + 0x7eca853] ; GenericMethodInfo 282794 @0x188957b60
0000000180a8d30d: mov      rcx, rbx
0000000180a8d310: call     0x18536e540
0000000180a8d315: test     rax, rax
0000000180a8d318: je       0x180a8d363
0000000180a8d31a: xor      edx, edx
0000000180a8d31c: mov      rcx, rax
0000000180a8d31f: call     0x180701e20 ; Torappu.Battle.Entity.get_attributes [66358]
0000000180a8d324: test     rax, rax
0000000180a8d327: je       0x180a8d363
0000000180a8d329: xor      r8d, r8d
0000000180a8d32c: mov      rdx, rbx
0000000180a8d32f: mov      rcx, rax
0000000180a8d332: call     0x18064a270 ; Torappu.Battle.Attributes.RemoveModifier [64274]
0000000180a8d337: xor      edx, edx
0000000180a8d339: mov      rcx, rbx
0000000180a8d33c: mov      rbx, qword ptr [rsp + 0x50]
0000000180a8d341: add      rsp, 0x40
0000000180a8d345: pop      rdi
0000000180a8d346: jmp      0x180a8d440 ; Torappu.Battle.Enemy.States.DisappearState._DoAppear [76781]
0000000180a8d34b: xor      r9d, r9d
0000000180a8d34e: mov      r8d, edi
0000000180a8d351: mov      rdx, rbx
0000000180a8d354: mov      rbx, qword ptr [rsp + 0x50]
0000000180a8d359: add      rsp, 0x40
0000000180a8d35d: pop      rdi
0000000180a8d35e: jmp      0x1834c0e30 ; XLua.DelegateBridge.__Gen_Delegate_Imp55 [2710]
0000000180a8d363: call     0x18048c0b0
0000000180a8d368: int3     
0000000180a8d369: int3     
0000000180a8d36a: int3     
0000000180a8d36b: int3     
0000000180a8d36c: int3     
0000000180a8d36d: int3     
0000000180a8d36e: int3     
0000000180a8d36f: int3     