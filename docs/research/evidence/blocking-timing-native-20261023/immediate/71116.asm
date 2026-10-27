; Torappu.Battle.HarpoonProjectile.DoLink metadata=71116 token=0x60115cd VA=0x1808d0d80 RVA=0x8d0d80 size=0xd0
00000001808d0d80: mov      qword ptr [rsp + 0x10], rsi
00000001808d0d85: push     rdi
00000001808d0d86: sub      rsp, 0x20
00000001808d0d8a: cmp      byte ptr [rip + 0x83c09da], 0
00000001808d0d91: mov      rdi, rdx
00000001808d0d94: mov      rsi, rcx
00000001808d0d97: jne      0x1808d0db8
00000001808d0d99: lea      rcx, [rip + 0x802d9c0] ; TypeInfo Torappu.Battle.HarpoonProjectile @0x1888fe760
00000001808d0da0: call     0x18048bf00
00000001808d0da5: lea      rcx, [rip + 0x7fffb2c] ; TypeInfo Torappu.Battle.HarpoonProjectile.<DoLink>d__19 @0x1888d08d8
00000001808d0dac: call     0x18048bf00
00000001808d0db1: mov      byte ptr [rip + 0x83c09b3], 1
00000001808d0db8: mov      rax, qword ptr [rip + 0x802d9a1] ; TypeInfo Torappu.Battle.HarpoonProjectile @0x1888fe760
00000001808d0dbf: mov      r8, qword ptr [rax + 0xb8]
00000001808d0dc6: mov      rcx, qword ptr [r8 + 0x30]
00000001808d0dca: test     rcx, rcx
00000001808d0dcd: jne      0x1808d0e2c
00000001808d0dcf: mov      qword ptr [rsp + 0x30], rbx
00000001808d0dd4: mov      rcx, qword ptr [rip + 0x7fffafd] ; TypeInfo Torappu.Battle.HarpoonProjectile.<DoLink>d__19 @0x1888d08d8
00000001808d0ddb: call     0x18045cfe0
00000001808d0de0: mov      rbx, rax
00000001808d0de3: test     rax, rax
00000001808d0de6: je       0x1808d0e44
00000001808d0de8: xor      edx, edx
00000001808d0dea: mov      rcx, rax
00000001808d0ded: call     0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
00000001808d0df2: lea      rcx, [rbx + 0x28]
00000001808d0df6: mov      dword ptr [rbx + 0x10], 0
00000001808d0dfd: mov      rdx, rsi
00000001808d0e00: mov      qword ptr [rbx + 0x28], rsi
00000001808d0e04: call     0x18048b9e0
00000001808d0e09: lea      rcx, [rbx + 0x20]
00000001808d0e0d: mov      qword ptr [rbx + 0x20], rdi
00000001808d0e11: mov      rdx, rdi
00000001808d0e14: call     0x18048b9e0
00000001808d0e19: mov      rax, rbx
00000001808d0e1c: mov      rbx, qword ptr [rsp + 0x30]
00000001808d0e21: mov      rsi, qword ptr [rsp + 0x38]
00000001808d0e26: add      rsp, 0x20
00000001808d0e2a: pop      rdi
00000001808d0e2b: ret      
00000001808d0e2c: xor      r9d, r9d
00000001808d0e2f: mov      r8, rdi
00000001808d0e32: mov      rdx, rsi
00000001808d0e35: mov      rsi, qword ptr [rsp + 0x38]
00000001808d0e3a: add      rsp, 0x20
00000001808d0e3e: pop      rdi
00000001808d0e3f: jmp      0x18329efc0 ; XLua.DelegateBridge.__Gen_Delegate_Imp206 [2861]
00000001808d0e44: call     0x18048c0b0
00000001808d0e49: int3     
00000001808d0e4a: int3     
00000001808d0e4b: int3     
00000001808d0e4c: int3     
00000001808d0e4d: int3     
00000001808d0e4e: int3     
00000001808d0e4f: int3     