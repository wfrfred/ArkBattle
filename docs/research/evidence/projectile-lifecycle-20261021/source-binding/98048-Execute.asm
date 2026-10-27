; Torappu.Battle.Action.Nodes.FinishManagedProjectiles.Execute metadata=98048 token=0x6017f01 VA=0x1810ae7f0 RVA=0x10ae7f0 size=0x2c0
00000001810ae7f0: mov      qword ptr [rsp + 8], rbx
00000001810ae7f5: mov      qword ptr [rsp + 0x10], rsi
00000001810ae7fa: mov      qword ptr [rsp + 0x18], rdi
00000001810ae7ff: push     r14
00000001810ae801: sub      rsp, 0xa0
00000001810ae808: mov      rbx, r9
00000001810ae80b: mov      esi, r8d
00000001810ae80e: mov      r14, rdx
00000001810ae811: mov      rdi, rcx
00000001810ae814: cmp      byte ptr [rip + 0x7be8357], 0
00000001810ae81b: jne      0x1810ae890
00000001810ae81d: lea      rcx, [rip + 0x78ba1c4] ; GenericMethodInfo 256773 @0x1889689e8
00000001810ae824: call     0x18048bf00
00000001810ae829: lea      rcx, [rip + 0x78ba3f8] ; GenericMethodInfo 256774 @0x188968c28
00000001810ae830: call     0x18048bf00
00000001810ae835: lea      rcx, [rip + 0x78ba62c] ; GenericMethodInfo 256775 @0x188968e68
00000001810ae83c: call     0x18048bf00
00000001810ae841: lea      rcx, [rip + 0x77cae28] ; TypeInfo Torappu.Battle.Action.Nodes.FinishManagedProjectiles @0x188879670
00000001810ae848: call     0x18048bf00
00000001810ae84d: lea      rcx, [rip + 0x783751c] ; GenericMethodInfo 268477 @0x1888e5d70
00000001810ae854: call     0x18048bf00
00000001810ae859: lea      rcx, [rip + 0x7837990] ; GenericMethodInfo 268479 @0x1888e61f0
00000001810ae860: call     0x18048bf00
00000001810ae865: lea      rcx, [rip + 0x7889c7c] ; GenericMethodInfo 280398 @0x1889384e8
00000001810ae86c: call     0x18048bf00
00000001810ae871: lea      rcx, [rip + 0x7889eb0] ; GenericMethodInfo 280399 @0x188938728
00000001810ae878: call     0x18048bf00
00000001810ae87d: lea      rcx, [rip + 0x7884464] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001810ae884: call     0x18048bf00
00000001810ae889: mov      byte ptr [rip + 0x7be82e2], 1
00000001810ae890: xorps    xmm0, xmm0
00000001810ae893: movups   xmmword ptr [rsp + 0x68], xmm0
00000001810ae898: mov      rax, qword ptr [rip + 0x77cadd1] ; TypeInfo Torappu.Battle.Action.Nodes.FinishManagedProjectiles @0x188879670
00000001810ae89f: mov      rcx, qword ptr [rax + 0xb8]
00000001810ae8a6: mov      rcx, qword ptr [rcx + 8]
00000001810ae8aa: test     rcx, rcx
00000001810ae8ad: jne      0x1810aea5a
00000001810ae8b3: xor      r8d, r8d
00000001810ae8b6: mov      edx, dword ptr [rdi + 0x10]
00000001810ae8b9: mov      rcx, rbx
00000001810ae8bc: call     0x180fceed0 ; Torappu.Battle.Action.Nodes.GetActionTarget [95120]
00000001810ae8c1: mov      rdi, rax
00000001810ae8c4: mov      rsi, rax
00000001810ae8c7: mov      qword ptr [rsp + 0x30], rax
00000001810ae8cc: mov      rcx, qword ptr [rip + 0x7884415] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001810ae8d3: cmp      dword ptr [rcx + 0xe0], 0
00000001810ae8da: jne      0x1810ae8e1
00000001810ae8dc: call     0x18048c140
00000001810ae8e1: xor      r8d, r8d
00000001810ae8e4: xor      edx, edx
00000001810ae8e6: mov      rcx, rdi
00000001810ae8e9: call     0x186b638d0
00000001810ae8ee: test     al, al
00000001810ae8f0: jne      0x1810aea56
00000001810ae8f6: test     rdi, rdi
00000001810ae8f9: je       0x1810aea9c
00000001810ae8ff: cmp      byte ptr [rip + 0x7c1deeb], al
00000001810ae905: jbe      0x1810ae90f
00000001810ae907: mov      rcx, qword ptr [rdi]
00000001810ae90a: call     0x180446d00
00000001810ae90f: mov      rdx, qword ptr [rdi]
00000001810ae912: mov      rax, qword ptr [rdx + 0x4a0]
00000001810ae919: mov      rdx, qword ptr [rdx + 0x4a8]
00000001810ae920: mov      rcx, rdi
00000001810ae923: call     rax
00000001810ae925: test     rax, rax
00000001810ae928: je       0x1810aea9c
00000001810ae92e: mov      r8, qword ptr [rip + 0x78378bb] ; GenericMethodInfo 268479 @0x1888e61f0
00000001810ae935: mov      rdx, rax
00000001810ae938: lea      rcx, [rsp + 0x48]
00000001810ae93d: call     0x184aca6f0
00000001810ae942: movups   xmm0, xmmword ptr [rsp + 0x48]
00000001810ae947: movups   xmmword ptr [rsp + 0x78], xmm0
00000001810ae94c: movups   xmm1, xmmword ptr [rsp + 0x58]
00000001810ae951: movups   xmmword ptr [rsp + 0x88], xmm1
00000001810ae959: mov      qword ptr [rsp + 0x48], 0
00000001810ae962: lea      rbx, [rsp + 0x78]
00000001810ae967: mov      qword ptr [rsp + 0x50], rbx
00000001810ae96c: nop      dword ptr [rax]
00000001810ae970: mov      rdx, qword ptr [rip + 0x78ba2b1] ; GenericMethodInfo 256774 @0x188968c28
00000001810ae977: lea      rcx, [rsp + 0x78]
00000001810ae97c: call     0x185a4d210
00000001810ae981: test     al, al
00000001810ae983: je       0x1810ae9cd
00000001810ae985: movups   xmm0, xmmword ptr [rsp + 0x88]
00000001810ae98d: movups   xmmword ptr [rsp + 0x68], xmm0
00000001810ae992: mov      rdx, qword ptr [rip + 0x7889d8f] ; GenericMethodInfo 280399 @0x188938728
00000001810ae999: lea      rcx, [rsp + 0x68]
00000001810ae99e: call     0x185159fc0
00000001810ae9a3: test     al, al
00000001810ae9a5: je       0x1810ae970
00000001810ae9a7: mov      rdx, qword ptr [rip + 0x7889b3a] ; GenericMethodInfo 280398 @0x1889384e8
00000001810ae9ae: lea      rcx, [rsp + 0x68]
00000001810ae9b3: call     0x185159d80
00000001810ae9b8: test     rax, rax
00000001810ae9bb: je       0x1810aea90
00000001810ae9c1: xor      edx, edx
00000001810ae9c3: mov      rcx, rax
00000001810ae9c6: call     0x1808d8ab0 ; Torappu.Battle.Projectile.Interrupt [71338]
00000001810ae9cb: jmp      0x1810ae970
00000001810ae9cd: mov      rdx, qword ptr [rip + 0x78ba014] ; GenericMethodInfo 256773 @0x1889689e8
00000001810ae9d4: mov      rcx, rbx
00000001810ae9d7: call     0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
00000001810ae9dc: jmp      0x1810aea05
00000001810ae9de: mov      rdx, qword ptr [rip + 0x78ba003] ; GenericMethodInfo 256773 @0x1889689e8
00000001810ae9e5: mov      rcx, qword ptr [rsp + 0x50]
00000001810ae9ea: call     0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
00000001810ae9ef: mov      rcx, qword ptr [rsp + 0x48]
00000001810ae9f4: test     rcx, rcx
00000001810ae9f7: jne      0x1810aea96
00000001810ae9fd: mov      rsi, qword ptr [rsp + 0x30]
00000001810aea02: mov      rdi, rsi
00000001810aea05: cmp      byte ptr [rip + 0x7c1dde4], 0
00000001810aea0c: jbe      0x1810aea16
00000001810aea0e: mov      rcx, qword ptr [rdi]
00000001810aea11: call     0x180446d00
00000001810aea16: mov      rdx, qword ptr [rdi]
00000001810aea19: mov      rax, qword ptr [rdx + 0x4a0]
00000001810aea20: mov      rdx, qword ptr [rdx + 0x4a8]
00000001810aea27: mov      rcx, rsi
00000001810aea2a: call     rax
00000001810aea2c: test     rax, rax
00000001810aea2f: je       0x1810aea9c
00000001810aea31: inc      dword ptr [rax + 0x1c]
00000001810aea34: mov      r8d, dword ptr [rax + 0x18]
00000001810aea38: mov      dword ptr [rax + 0x18], 0
00000001810aea3f: test     r8d, r8d
00000001810aea42: jle      0x1810aea52
00000001810aea44: xor      r9d, r9d
00000001810aea47: xor      edx, edx
00000001810aea49: mov      rcx, qword ptr [rax + 0x10]
00000001810aea4d: call     0x185ee99a0
00000001810aea52: mov      al, 1
00000001810aea54: jmp      0x1810aea76
00000001810aea56: xor      al, al
00000001810aea58: jmp      0x1810aea76
00000001810aea5a: mov      qword ptr [rsp + 0x28], 0
00000001810aea63: mov      qword ptr [rsp + 0x20], rbx
00000001810aea68: mov      r9d, esi
00000001810aea6b: mov      r8, r14
00000001810aea6e: mov      rdx, rdi
00000001810aea71: call     0x183108750 ; XLua.DelegateBridge.__Gen_Delegate_Imp11071 [13726]
00000001810aea76: lea      r11, [rsp + 0xa0]
00000001810aea7e: mov      rbx, qword ptr [r11 + 0x10]
00000001810aea82: mov      rsi, qword ptr [r11 + 0x18]
00000001810aea86: mov      rdi, qword ptr [r11 + 0x20]
00000001810aea8a: mov      rsp, r11
00000001810aea8d: pop      r14
00000001810aea8f: ret      
00000001810aea90: call     0x18048c0b0
00000001810aea95: nop      
00000001810aea96: call     0x180472d50
00000001810aea9b: int3     
00000001810aea9c: call     0x18048c0b0
00000001810aeaa1: int3     
00000001810aeaa2: int3     
00000001810aeaa3: int3     
00000001810aeaa4: int3     
00000001810aeaa5: int3     
00000001810aeaa6: int3     
00000001810aeaa7: int3     
00000001810aeaa8: int3     
00000001810aeaa9: int3     
00000001810aeaaa: int3     
00000001810aeaab: int3     
00000001810aeaac: int3     
00000001810aeaad: int3     
00000001810aeaae: int3     
00000001810aeaaf: int3     