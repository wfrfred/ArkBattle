; Torappu.Battle.BlockedEnemyManager.RecalculateVolume metadata=77185 token=0x6012d82 VA=0x180aa1e80 RVA=0xaa1e80 size=0x120
0000000180aa1e80: mov      qword ptr [rsp + 8], rbx
0000000180aa1e85: mov      qword ptr [rsp + 0x10], rsi
0000000180aa1e8a: push     rdi
0000000180aa1e8b: sub      rsp, 0x60
0000000180aa1e8f: mov      rdi, rcx
0000000180aa1e92: cmp      byte ptr [rip + 0x81f0bf0], 0
0000000180aa1e99: jne      0x180aa1ed2
0000000180aa1e9b: lea      rcx, [rip + 0x7d971de] ; GenericMethodInfo 257251 @0x188839080
0000000180aa1ea2: call     0x18048bf00
0000000180aa1ea7: lea      rcx, [rip + 0x7d97412] ; GenericMethodInfo 257252 @0x1888392c0
0000000180aa1eae: call     0x18048bf00
0000000180aa1eb3: lea      rcx, [rip + 0x7d9763e] ; GenericMethodInfo 257253 @0x1888394f8
0000000180aa1eba: call     0x18048bf00
0000000180aa1ebf: lea      rcx, [rip + 0x7e82c92] ; GenericMethodInfo 271393 @0x188924b58
0000000180aa1ec6: call     0x18048bf00
0000000180aa1ecb: mov      byte ptr [rip + 0x81f0bb7], 1
0000000180aa1ed2: xor      ebx, ebx
0000000180aa1ed4: mov      dword ptr [rdi + 0x10], ebx
0000000180aa1ed7: mov      rdx, qword ptr [rdi + 0x18]
0000000180aa1edb: test     rdx, rdx
0000000180aa1ede: je       0x180aa1f98
0000000180aa1ee4: mov      r8, qword ptr [rip + 0x7e82c6d] ; GenericMethodInfo 271393 @0x188924b58
0000000180aa1eeb: lea      rcx, [rsp + 0x28]
0000000180aa1ef0: call     0x184aef040
0000000180aa1ef5: movups   xmm0, xmmword ptr [rsp + 0x28]
0000000180aa1efa: movups   xmmword ptr [rsp + 0x40], xmm0
0000000180aa1eff: movsd    xmm1, qword ptr [rsp + 0x38]
0000000180aa1f05: movsd    qword ptr [rsp + 0x50], xmm1
0000000180aa1f0b: mov      qword ptr [rsp + 0x28], rbx
0000000180aa1f10: lea      rbx, [rsp + 0x40]
0000000180aa1f15: mov      qword ptr [rsp + 0x30], rbx
0000000180aa1f1a: nop      word ptr [rax + rax]
0000000180aa1f20: mov      rdx, qword ptr [rip + 0x7d97399] ; GenericMethodInfo 257252 @0x1888392c0
0000000180aa1f27: lea      rcx, [rsp + 0x40]
0000000180aa1f2c: call     0x185a610f0
0000000180aa1f31: test     al, al
0000000180aa1f33: je       0x180aa1f50
0000000180aa1f35: mov      rcx, qword ptr [rsp + 0x50]
0000000180aa1f3a: mov      esi, dword ptr [rdi + 0x10]
0000000180aa1f3d: test     rcx, rcx
0000000180aa1f40: je       0x180aa1f8c
0000000180aa1f42: xor      edx, edx
0000000180aa1f44: call     0x180a7ba10 ; Torappu.Battle.Enemy.get_blockVolume [76350]
0000000180aa1f49: add      eax, esi
0000000180aa1f4b: mov      dword ptr [rdi + 0x10], eax
0000000180aa1f4e: jmp      0x180aa1f20
0000000180aa1f50: mov      rdx, qword ptr [rip + 0x7d97129] ; GenericMethodInfo 257251 @0x188839080
0000000180aa1f57: mov      rcx, rbx
0000000180aa1f5a: call     0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
0000000180aa1f5f: jmp      0x180aa1f7c
0000000180aa1f61: mov      rdx, qword ptr [rip + 0x7d97118] ; GenericMethodInfo 257251 @0x188839080
0000000180aa1f68: mov      rcx, qword ptr [rsp + 0x30]
0000000180aa1f6d: call     0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
0000000180aa1f72: mov      rcx, qword ptr [rsp + 0x28]
0000000180aa1f77: test     rcx, rcx
0000000180aa1f7a: jne      0x180aa1f92
0000000180aa1f7c: mov      rbx, qword ptr [rsp + 0x70]
0000000180aa1f81: mov      rsi, qword ptr [rsp + 0x78]
0000000180aa1f86: add      rsp, 0x60
0000000180aa1f8a: pop      rdi
0000000180aa1f8b: ret      
0000000180aa1f8c: call     0x18048c0b0
0000000180aa1f91: nop      
0000000180aa1f92: call     0x180472d50
0000000180aa1f97: int3     
0000000180aa1f98: call     0x18048c0b0
0000000180aa1f9d: int3     
0000000180aa1f9e: int3     
0000000180aa1f9f: int3     