; Torappu.Battle.Buff.BuffContainer._CheckThroughBuffAbnormalAnti metadata=65363 token=0x600ff54 VA=0x18067e9f0 RVA=0x67e9f0 size=0x1e0
000000018067e9f0: mov      qword ptr [rsp + 8], rbx
000000018067e9f5: mov      qword ptr [rsp + 0x10], rsi
000000018067e9fa: push     rdi
000000018067e9fb: sub      rsp, 0x60
000000018067e9ff: mov      rbx, rdx
000000018067ea02: mov      rsi, rcx
000000018067ea05: cmp      byte ptr [rip + 0x86119ca], 0
000000018067ea0c: jne      0x18067ea5d
000000018067ea0e: lea      rcx, [rip + 0x825683b] ; TypeInfo Torappu.Battle.Buff.BuffContainer @0x1888d5250
000000018067ea15: call     0x18048bf00
000000018067ea1a: lea      rcx, [rip + 0x82df1ff] ; GenericMethodInfo 286502 @0x18895dc20
000000018067ea21: call     0x18048bf00
000000018067ea26: lea      rcx, [rip + 0x82f04f3] ; GenericMethodInfo 256818 @0x18896ef20
000000018067ea2d: call     0x18048bf00
000000018067ea32: lea      rcx, [rip + 0x82f0727] ; GenericMethodInfo 256819 @0x18896f160
000000018067ea39: call     0x18048bf00
000000018067ea3e: lea      rcx, [rip + 0x82f095b] ; GenericMethodInfo 256820 @0x18896f3a0
000000018067ea45: call     0x18048bf00
000000018067ea4a: lea      rcx, [rip + 0x827b6c7] ; GenericMethodInfo 268607 @0x1888fa118
000000018067ea51: call     0x18048bf00
000000018067ea56: mov      byte ptr [rip + 0x8611979], 1
000000018067ea5d: mov      rax, qword ptr [rip + 0x82567ec] ; TypeInfo Torappu.Battle.Buff.BuffContainer @0x1888d5250
000000018067ea64: mov      rcx, qword ptr [rax + 0xb8]
000000018067ea6b: mov      rcx, qword ptr [rcx + 0x1e8]
000000018067ea72: test     rcx, rcx
000000018067ea75: jne      0x18067eb9c
000000018067ea7b: test     rbx, rbx
000000018067ea7e: je       0x18067ebc6
000000018067ea84: mov      rcx, qword ptr [rbx + 0x10]
000000018067ea88: test     rcx, rcx
000000018067ea8b: je       0x18067ebc6
000000018067ea91: mov      rdx, qword ptr [rip + 0x82df188] ; GenericMethodInfo 286502 @0x18895dc20
000000018067ea98: mov      rcx, qword ptr [rcx + 0x10]
000000018067ea9c: call     0x1844acab0
000000018067eaa1: test     al, al
000000018067eaa3: jne      0x18067eb8a
000000018067eaa9: mov      rax, qword ptr [rbx + 0x10]
000000018067eaad: test     rax, rax
000000018067eab0: je       0x18067ebc6
000000018067eab6: mov      rdx, qword ptr [rax + 0x10]
000000018067eaba: test     rdx, rdx
000000018067eabd: je       0x18067ebc6
000000018067eac3: mov      r8, qword ptr [rip + 0x827b64e] ; GenericMethodInfo 268607 @0x1888fa118
000000018067eaca: lea      rcx, [rsp + 0x28]
000000018067eacf: call     0x184c3ec30
000000018067ead4: movups   xmm0, xmmword ptr [rsp + 0x28]
000000018067ead9: movups   xmmword ptr [rsp + 0x40], xmm0
000000018067eade: movsd    xmm1, qword ptr [rsp + 0x38]
000000018067eae4: movsd    qword ptr [rsp + 0x50], xmm1
000000018067eaea: mov      qword ptr [rsp + 0x28], 0
000000018067eaf3: lea      rbx, [rsp + 0x40]
000000018067eaf8: mov      qword ptr [rsp + 0x30], rbx
000000018067eafd: nop      dword ptr [rax]
000000018067eb00: mov      rdx, qword ptr [rip + 0x82f0659] ; GenericMethodInfo 256819 @0x18896f160
000000018067eb07: lea      rcx, [rsp + 0x40]
000000018067eb0c: call     0x185a56be0
000000018067eb11: test     al, al
000000018067eb13: je       0x18067eb5e
000000018067eb15: mov      edi, dword ptr [rsp + 0x50]
000000018067eb19: xor      edx, edx
000000018067eb1b: mov      rcx, rsi
000000018067eb1e: call     0x18067feb0 ; Torappu.Battle.Buff.BuffContainer.get_attributes [65304]
000000018067eb23: test     rax, rax
000000018067eb26: je       0x18067ebba
000000018067eb2c: xor      r8d, r8d
000000018067eb2f: mov      edx, edi
000000018067eb31: mov      rcx, rax
000000018067eb34: call     0x180648d20 ; Torappu.Battle.Attributes.GetAbnormalAnti [64282]
000000018067eb39: test     al, al
000000018067eb3b: je       0x18067eb00
000000018067eb3d: mov      rdx, qword ptr [rip + 0x82f03dc] ; GenericMethodInfo 256818 @0x18896ef20
000000018067eb44: mov      rcx, rbx
000000018067eb47: call     0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
000000018067eb4c: xor      al, al
000000018067eb4e: mov      rbx, qword ptr [rsp + 0x70]
000000018067eb53: mov      rsi, qword ptr [rsp + 0x78]
000000018067eb58: add      rsp, 0x60
000000018067eb5c: pop      rdi
000000018067eb5d: ret      
000000018067eb5e: mov      rdx, qword ptr [rip + 0x82f03bb] ; GenericMethodInfo 256818 @0x18896ef20
000000018067eb65: mov      rcx, rbx
000000018067eb68: call     0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
000000018067eb6d: jmp      0x18067eb8a
000000018067eb6f: mov      rdx, qword ptr [rip + 0x82f03aa] ; GenericMethodInfo 256818 @0x18896ef20
000000018067eb76: mov      rcx, qword ptr [rsp + 0x30]
000000018067eb7b: call     0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
000000018067eb80: mov      rcx, qword ptr [rsp + 0x28]
000000018067eb85: test     rcx, rcx
000000018067eb88: jne      0x18067ebc0
000000018067eb8a: mov      al, 1
000000018067eb8c: mov      rbx, qword ptr [rsp + 0x70]
000000018067eb91: mov      rsi, qword ptr [rsp + 0x78]
000000018067eb96: add      rsp, 0x60
000000018067eb9a: pop      rdi
000000018067eb9b: ret      
000000018067eb9c: xor      r9d, r9d
000000018067eb9f: mov      r8, rbx
000000018067eba2: mov      rdx, rsi
000000018067eba5: call     0x18332fc60 ; XLua.DelegateBridge.__Gen_Delegate_Imp29 [2684]
000000018067ebaa: mov      rbx, qword ptr [rsp + 0x70]
000000018067ebaf: mov      rsi, qword ptr [rsp + 0x78]
000000018067ebb4: add      rsp, 0x60
000000018067ebb8: pop      rdi
000000018067ebb9: ret      
000000018067ebba: call     0x18048c0b0
000000018067ebbf: nop      
000000018067ebc0: call     0x180472d50
000000018067ebc5: int3     
000000018067ebc6: call     0x18048c0b0
000000018067ebcb: int3     
000000018067ebcc: int3     
000000018067ebcd: int3     
000000018067ebce: int3     
000000018067ebcf: int3     