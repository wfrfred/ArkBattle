; Torappu.Battle.NetCatcherProjectile.ExtraCheckToFinish metadata=71248 token=0x6011651 VA=0x1808d37d0 RVA=0x8d37d0 size=0x2f0
00000001808d37d0: push     rbx
00000001808d37d2: sub      rsp, 0x30
00000001808d37d6: cmp      byte ptr [rip + 0x83bdfe4], 0
00000001808d37dd: mov      rbx, rcx
00000001808d37e0: jne      0x1808d3801
00000001808d37e2: lea      rcx, [rip + 0x804e28f] ; TypeInfo Torappu.Battle.NetCatcherProjectile @0x188921a78
00000001808d37e9: call     0x18048bf00
00000001808d37ee: lea      rcx, [rip + 0x8061db3] ; GenericMethodInfo 280377 @0x1889355a8
00000001808d37f5: call     0x18048bf00
00000001808d37fa: mov      byte ptr [rip + 0x83bdfc0], 1
00000001808d3801: mov      rax, qword ptr [rip + 0x804e270] ; TypeInfo Torappu.Battle.NetCatcherProjectile @0x188921a78
00000001808d3808: mov      rcx, qword ptr [rax + 0xb8]
00000001808d380f: mov      rcx, qword ptr [rcx + 0x38]
00000001808d3813: test     rcx, rcx
00000001808d3816: jne      0x1808d3aa6
00000001808d381c: cmp      byte ptr [rbx + 0x218], cl
00000001808d3822: je       0x1808d3a9e
00000001808d3828: mov      qword ptr [rsp + 0x40], rsi
00000001808d382d: mov      rdx, qword ptr [rip + 0x8061d74] ; GenericMethodInfo 280377 @0x1889355a8
00000001808d3834: lea      rcx, [rbx + 0x1b8]
00000001808d383b: call     0x185159d80
00000001808d3840: cmp      byte ptr [rip + 0x83bdf7b], 0
00000001808d3847: mov      rsi, rax
00000001808d384a: jne      0x1808d3877
00000001808d384c: lea      rcx, [rip + 0x7f47e5d] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
00000001808d3853: call     0x18048bf00
00000001808d3858: lea      rcx, [rip + 0x804e219] ; TypeInfo Torappu.Battle.NetCatcherProjectile @0x188921a78
00000001808d385f: call     0x18048bf00
00000001808d3864: lea      rcx, [rip + 0x805f47d] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808d386b: call     0x18048bf00
00000001808d3870: mov      byte ptr [rip + 0x83bdf4b], 1
00000001808d3877: mov      rax, qword ptr [rip + 0x804e1fa] ; TypeInfo Torappu.Battle.NetCatcherProjectile @0x188921a78
00000001808d387e: mov      qword ptr [rsp + 0x48], rdi
00000001808d3883: mov      rcx, qword ptr [rax + 0xb8]
00000001808d388a: mov      rcx, qword ptr [rcx + 0x40]
00000001808d388e: test     rcx, rcx
00000001808d3891: jne      0x1808d3932
00000001808d3897: mov      rdx, qword ptr [rip + 0x7f47e12] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
00000001808d389e: test     rsi, rsi
00000001808d38a1: jne      0x1808d38a7
00000001808d38a3: xor      edi, edi
00000001808d38a5: jmp      0x1808d38f3
00000001808d38a7: cmp      byte ptr [rip + 0x83f8f42], 0
00000001808d38ae: mov      r8, qword ptr [rsi]
00000001808d38b1: jbe      0x1808d38c1
00000001808d38b3: mov      rcx, r8
00000001808d38b6: call     0x1804463e0
00000001808d38bb: xor      edi, edi
00000001808d38bd: test     al, al
00000001808d38bf: jmp      0x1808d38ef
00000001808d38c1: movzx    eax, byte ptr [rdx + 0x130]
00000001808d38c8: cmp      byte ptr [r8 + 0x130], al
00000001808d38cf: jb       0x1808d38e9
00000001808d38d1: movzx    ecx, al
00000001808d38d4: mov      rax, qword ptr [r8 + 0xc8]
00000001808d38db: cmp      qword ptr [rax + rcx*8 - 8], rdx
00000001808d38e0: jne      0x1808d38e9
00000001808d38e2: mov      eax, 1
00000001808d38e7: jmp      0x1808d38eb
00000001808d38e9: xor      eax, eax
00000001808d38eb: xor      edi, edi
00000001808d38ed: test     eax, eax
00000001808d38ef: cmovne   rdi, rsi
00000001808d38f3: mov      rcx, qword ptr [rip + 0x805f3ee] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808d38fa: cmp      dword ptr [rcx + 0xe0], 0
00000001808d3901: jne      0x1808d3908
00000001808d3903: call     0x18048c140
00000001808d3908: xor      r8d, r8d
00000001808d390b: xor      edx, edx
00000001808d390d: mov      rcx, rdi
00000001808d3910: call     0x186b638d0
00000001808d3915: test     al, al
00000001808d3917: jne      0x1808d3940
00000001808d3919: test     rdi, rdi
00000001808d391c: je       0x1808d3ab6
00000001808d3922: xor      r8d, r8d
00000001808d3925: mov      rdx, rbx
00000001808d3928: mov      rcx, rdi
00000001808d392b: call     0x180a75a80 ; Torappu.Battle.Enemy.TryEarlyStopPull [76439]
00000001808d3930: jmp      0x1808d3940
00000001808d3932: xor      r9d, r9d
00000001808d3935: mov      r8, rsi
00000001808d3938: mov      rdx, rbx
00000001808d393b: call     0x1832d2220 ; XLua.DelegateBridge.__Gen_Delegate_Imp23 [2678]
00000001808d3940: cmp      byte ptr [rip + 0x83bde7c], 0
00000001808d3947: jne      0x1808d3974
00000001808d3949: lea      rcx, [rip + 0x8054410] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
00000001808d3950: call     0x18048bf00
00000001808d3955: lea      rcx, [rip + 0x804e11c] ; TypeInfo Torappu.Battle.NetCatcherProjectile @0x188921a78
00000001808d395c: call     0x18048bf00
00000001808d3961: lea      rcx, [rip + 0x8061c40] ; GenericMethodInfo 280377 @0x1889355a8
00000001808d3968: call     0x18048bf00
00000001808d396d: mov      byte ptr [rip + 0x83bde4f], 1
00000001808d3974: mov      rax, qword ptr [rip + 0x804e0fd] ; TypeInfo Torappu.Battle.NetCatcherProjectile @0x188921a78
00000001808d397b: mov      rcx, qword ptr [rax + 0xb8]
00000001808d3982: mov      rcx, qword ptr [rcx + 0x48]
00000001808d3986: test     rcx, rcx
00000001808d3989: jne      0x1808d3a81
00000001808d398f: mov      word ptr [rbx + 0x218], cx
00000001808d3996: lea      rcx, [rbx + 0x1b8]
00000001808d399d: mov      rdx, qword ptr [rip + 0x8061c04] ; GenericMethodInfo 280377 @0x1889355a8
00000001808d39a4: call     0x185159d80
00000001808d39a9: cmp      byte ptr [rip + 0x83bde15], 0
00000001808d39b0: mov      rsi, rax
00000001808d39b3: jne      0x1808d39d4
00000001808d39b5: lea      rcx, [rip + 0x804e0bc] ; TypeInfo Torappu.Battle.NetCatcherProjectile @0x188921a78
00000001808d39bc: call     0x18048bf00
00000001808d39c1: lea      rcx, [rip + 0x809fbc8] ; TypeInfo Torappu.Battle.NetCatcherProjectile.<DoLink_SecondPart>d__30 @0x188973590
00000001808d39c8: call     0x18048bf00
00000001808d39cd: mov      byte ptr [rip + 0x83bddf1], 1
00000001808d39d4: mov      rcx, qword ptr [rip + 0x804e09d] ; TypeInfo Torappu.Battle.NetCatcherProjectile @0x188921a78
00000001808d39db: mov      rdx, qword ptr [rcx + 0xb8]
00000001808d39e2: mov      rcx, qword ptr [rdx + 0x58]
00000001808d39e6: test     rcx, rcx
00000001808d39e9: jne      0x1808d3a36
00000001808d39eb: mov      rcx, qword ptr [rip + 0x809fb9e] ; TypeInfo Torappu.Battle.NetCatcherProjectile.<DoLink_SecondPart>d__30 @0x188973590
00000001808d39f2: call     0x18045cfe0
00000001808d39f7: mov      rdi, rax
00000001808d39fa: test     rax, rax
00000001808d39fd: je       0x1808d3ab6
00000001808d3a03: xor      edx, edx
00000001808d3a05: mov      rcx, rax
00000001808d3a08: call     0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
00000001808d3a0d: lea      rcx, [rdi + 0x28]
00000001808d3a11: mov      dword ptr [rdi + 0x10], 0
00000001808d3a18: mov      rdx, rbx
00000001808d3a1b: mov      qword ptr [rdi + 0x28], rbx
00000001808d3a1f: call     0x18048b9e0
00000001808d3a24: lea      rcx, [rdi + 0x20]
00000001808d3a28: mov      qword ptr [rdi + 0x20], rsi
00000001808d3a2c: mov      rdx, rsi
00000001808d3a2f: call     0x18048b9e0
00000001808d3a34: jmp      0x1808d3a47
00000001808d3a36: xor      r9d, r9d
00000001808d3a39: mov      r8, rsi
00000001808d3a3c: mov      rdx, rbx
00000001808d3a3f: call     0x18329efc0 ; XLua.DelegateBridge.__Gen_Delegate_Imp206 [2861]
00000001808d3a44: mov      rdi, rax
00000001808d3a47: mov      rcx, qword ptr [rip + 0x8054312] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
00000001808d3a4e: cmp      dword ptr [rcx + 0xe0], 0
00000001808d3a55: jne      0x1808d3a5c
00000001808d3a57: call     0x18048c140
00000001808d3a5c: xor      r9d, r9d
00000001808d3a5f: lea      rcx, [rsp + 0x20]
00000001808d3a64: mov      r8, rdi
00000001808d3a67: mov      rdx, rbx
00000001808d3a6a: call     0x180633110 ; Torappu.Battle.BattleController.StartBattleCoroutine [64743]
00000001808d3a6f: mov      rdi, qword ptr [rsp + 0x48]
00000001808d3a74: xor      al, al
00000001808d3a76: mov      rsi, qword ptr [rsp + 0x40]
00000001808d3a7b: add      rsp, 0x30
00000001808d3a7f: pop      rbx
00000001808d3a80: ret      
00000001808d3a81: xor      r8d, r8d
00000001808d3a84: mov      rdx, rbx
00000001808d3a87: call     0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
00000001808d3a8c: mov      rdi, qword ptr [rsp + 0x48]
00000001808d3a91: xor      al, al
00000001808d3a93: mov      rsi, qword ptr [rsp + 0x40]
00000001808d3a98: add      rsp, 0x30
00000001808d3a9c: pop      rbx
00000001808d3a9d: ret      
00000001808d3a9e: mov      al, 1
00000001808d3aa0: add      rsp, 0x30
00000001808d3aa4: pop      rbx
00000001808d3aa5: ret      
00000001808d3aa6: xor      r8d, r8d
00000001808d3aa9: mov      rdx, rbx
00000001808d3aac: add      rsp, 0x30
00000001808d3ab0: pop      rbx
00000001808d3ab1: jmp      0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
00000001808d3ab6: call     0x18048c0b0
00000001808d3abb: int3     
00000001808d3abc: int3     
00000001808d3abd: int3     
00000001808d3abe: int3     
00000001808d3abf: int3     