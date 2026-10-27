; Torappu.Battle.BattleLogger.LogExtraBattleInfoAddCount metadata=66995 token=0x60105b4 VA=0x180710440 RVA=0x710440 size=0x290
0000000180710440: mov      qword ptr [rsp + 8], rbx
0000000180710445: mov      qword ptr [rsp + 0x10], rsi
000000018071044a: mov      qword ptr [rsp + 0x18], rdi
000000018071044f: mov      qword ptr [rsp + 0x20], r14
0000000180710454: push     r15
0000000180710456: sub      rsp, 0x70
000000018071045a: mov      rbx, r8
000000018071045d: mov      r15d, edx
0000000180710460: mov      r14, rcx
0000000180710463: cmp      byte ptr [rip + 0x8580567], 0
000000018071046a: jne      0x1807104eb
000000018071046c: lea      rcx, [rip + 0x82223ed] ; TypeInfo Torappu.Battle.BattleLogger @0x188932860
0000000180710473: call     0x18048bf00
0000000180710478: lea      rcx, [rip + 0x81b41b1] ; GenericMethodInfo 230095 @0x1888c4630
000000018071047f: call     0x18048bf00
0000000180710484: lea      rcx, [rip + 0x81b2fc5] ; GenericMethodInfo 285436 @0x1888c3450
000000018071048b: call     0x18048bf00
0000000180710490: lea      rcx, [rip + 0x8157021] ; GenericMethodInfo 58136 @0x1888674b8
0000000180710497: call     0x18048bf00
000000018071049c: lea      rcx, [rip + 0x815724d] ; GenericMethodInfo 58137 @0x1888676f0
00000001807104a3: call     0x18048bf00
00000001807104a8: lea      rcx, [rip + 0x8157471] ; GenericMethodInfo 58141 @0x188867920
00000001807104af: call     0x18048bf00
00000001807104b4: lea      rcx, [rip + 0x816c485] ; GenericMethodInfo 117542 @0x18887c940
00000001807104bb: call     0x18048bf00
00000001807104c0: lea      rcx, [rip + 0x816fc51] ; GenericMethodInfo 117583 @0x188880118
00000001807104c7: call     0x18048bf00
00000001807104cc: lea      rcx, [rip + 0x81c0725] ; GenericMethodInfo 268327 @0x1888d0bf8
00000001807104d3: call     0x18048bf00
00000001807104d8: lea      rcx, [rip + 0x81700b1] ; GenericMethodInfo 117585 @0x188880590
00000001807104df: call     0x18048bf00
00000001807104e4: mov      byte ptr [rip + 0x85804e6], 1
00000001807104eb: mov      rax, qword ptr [rip + 0x822236e] ; TypeInfo Torappu.Battle.BattleLogger @0x188932860
00000001807104f2: mov      rcx, qword ptr [rax + 0xb8]
00000001807104f9: mov      rcx, qword ptr [rcx + 0xb0]
0000000180710500: test     rcx, rcx
0000000180710503: jne      0x18071066b
0000000180710509: mov      rcx, qword ptr [r14 + 0x30]
000000018071050d: test     rcx, rcx
0000000180710510: je       0x1807106be
0000000180710516: mov      r8, qword ptr [rip + 0x81b2f33] ; GenericMethodInfo 285436 @0x1888c3450
000000018071051d: mov      edx, r15d
0000000180710520: mov      rcx, qword ptr [rcx + 0x58]
0000000180710524: call     0x1844a8610
0000000180710529: test     al, al
000000018071052b: je       0x180710682
0000000180710531: test     rbx, rbx
0000000180710534: je       0x1807106be
000000018071053a: mov      r8, qword ptr [rip + 0x816c3ff] ; GenericMethodInfo 117542 @0x18887c940
0000000180710541: mov      rdx, rbx
0000000180710544: lea      rcx, [rsp + 0x38]
0000000180710549: call     0x184c3ec30
000000018071054e: movups   xmm0, xmmword ptr [rsp + 0x38]
0000000180710553: movups   xmmword ptr [rsp + 0x50], xmm0
0000000180710558: movsd    xmm1, qword ptr [rsp + 0x48]
000000018071055e: movsd    qword ptr [rsp + 0x60], xmm1
0000000180710564: mov      qword ptr [rsp + 0x38], 0
000000018071056d: lea      rbx, [rsp + 0x50]
0000000180710572: mov      qword ptr [rsp + 0x40], rbx
0000000180710577: nop      word ptr [rax + rax]
0000000180710580: mov      rdx, qword ptr [rip + 0x8157169] ; GenericMethodInfo 58137 @0x1888676f0
0000000180710587: lea      rcx, [rsp + 0x50]
000000018071058c: call     0x185a56be0
0000000180710591: test     al, al
0000000180710593: je       0x18071063b
0000000180710599: mov      esi, dword ptr [rsp + 0x60]
000000018071059d: mov      rax, qword ptr [r14 + 0x30]
00000001807105a1: test     rax, rax
00000001807105a4: je       0x1807106b2
00000001807105aa: mov      rcx, qword ptr [rax + 0x58]
00000001807105ae: test     rcx, rcx
00000001807105b1: je       0x1807106ad
00000001807105b7: mov      r8, qword ptr [rip + 0x81c063a] ; GenericMethodInfo 268327 @0x1888d0bf8
00000001807105be: mov      edx, r15d
00000001807105c1: call     0x184afcf00
00000001807105c6: mov      r8, qword ptr [rip + 0x81b4063] ; GenericMethodInfo 230095 @0x1888c4630
00000001807105cd: mov      edx, esi
00000001807105cf: mov      rcx, rax
00000001807105d2: call     0x1844a8610
00000001807105d7: test     al, al
00000001807105d9: je       0x180710580
00000001807105db: mov      rax, qword ptr [r14 + 0x30]
00000001807105df: test     rax, rax
00000001807105e2: je       0x1807106a8
00000001807105e8: mov      rcx, qword ptr [rax + 0x58]
00000001807105ec: test     rcx, rcx
00000001807105ef: je       0x1807106a3
00000001807105f5: mov      r8, qword ptr [rip + 0x81c05fc] ; GenericMethodInfo 268327 @0x1888d0bf8
00000001807105fc: mov      edx, r15d
00000001807105ff: call     0x184afcf00
0000000180710604: mov      rdi, rax
0000000180710607: test     rax, rax
000000018071060a: je       0x18071069d
0000000180710610: mov      r8, qword ptr [rip + 0x816fb01] ; GenericMethodInfo 117583 @0x188880118
0000000180710617: mov      edx, esi
0000000180710619: mov      rcx, rax
000000018071061c: call     0x184c4e390
0000000180710621: lea      r8d, [rax + 1]
0000000180710625: mov      r9, qword ptr [rip + 0x816ff64] ; GenericMethodInfo 117585 @0x188880590
000000018071062c: mov      edx, esi
000000018071062e: mov      rcx, rdi
0000000180710631: call     0x184cd8870
0000000180710636: jmp      0x180710580
000000018071063b: mov      rdx, qword ptr [rip + 0x8156e76] ; GenericMethodInfo 58136 @0x1888674b8
0000000180710642: mov      rcx, rbx
0000000180710645: call     0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
000000018071064a: jmp      0x180710667
000000018071064c: mov      rdx, qword ptr [rip + 0x8156e65] ; GenericMethodInfo 58136 @0x1888674b8
0000000180710653: mov      rcx, qword ptr [rsp + 0x40]
0000000180710658: call     0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
000000018071065d: mov      rcx, qword ptr [rsp + 0x38]
0000000180710662: test     rcx, rcx
0000000180710665: jne      0x1807106b8
0000000180710667: mov      al, 1
0000000180710669: jmp      0x180710682
000000018071066b: mov      qword ptr [rsp + 0x20], 0
0000000180710674: mov      r9, rbx
0000000180710677: mov      r8d, r15d
000000018071067a: mov      rdx, r14
000000018071067d: call     0x18333dfa0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3093 [5748]
0000000180710682: lea      r11, [rsp + 0x70]
0000000180710687: mov      rbx, qword ptr [r11 + 0x10]
000000018071068b: mov      rsi, qword ptr [r11 + 0x18]
000000018071068f: mov      rdi, qword ptr [r11 + 0x20]
0000000180710693: mov      r14, qword ptr [r11 + 0x28]
0000000180710697: mov      rsp, r11
000000018071069a: pop      r15
000000018071069c: ret      
000000018071069d: call     0x18048c0b0
00000001807106a2: nop      
00000001807106a3: call     0x18048c0b0
00000001807106a8: call     0x18048c0b0
00000001807106ad: call     0x18048c0b0
00000001807106b2: call     0x18048c0b0
00000001807106b7: nop      
00000001807106b8: call     0x180472d50
00000001807106bd: int3     
00000001807106be: call     0x18048c0b0
00000001807106c3: int3     
00000001807106c4: int3     
00000001807106c5: int3     
00000001807106c6: int3     
00000001807106c7: int3     
00000001807106c8: int3     
00000001807106c9: int3     
00000001807106ca: int3     
00000001807106cb: int3     
00000001807106cc: int3     
00000001807106cd: int3     
00000001807106ce: int3     
00000001807106cf: int3     