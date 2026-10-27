; Torappu.Battle.BattleController.OnTick metadata=64825 token=0x600fd3a VA=0x18062c440 RVA=0x62c440 size=0xaf0
000000018062c440: mov      qword ptr [rsp + 8], rcx
000000018062c445: push     rbx
000000018062c446: push     rsi
000000018062c447: push     rdi
000000018062c448: push     r12
000000018062c44a: push     r13
000000018062c44c: push     r14
000000018062c44e: push     r15
000000018062c450: sub      rsp, 0x70
000000018062c454: movaps   xmmword ptr [rsp + 0x60], xmm6
000000018062c459: mov      rsi, rcx
000000018062c45c: cmp      byte ptr [rip + 0x8663d01], 0
000000018062c463: jne      0x18062c518
000000018062c469: lea      rcx, [rip + 0x82fb8f0] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
000000018062c470: call     0x18048bf00
000000018062c475: lea      rcx, [rip + 0x825746c] ; GenericMethodInfo 257702 @0x1888838e8
000000018062c47c: call     0x18048bf00
000000018062c481: lea      rcx, [rip + 0x8257698] ; GenericMethodInfo 257703 @0x188883b20
000000018062c488: call     0x18048bf00
000000018062c48d: lea      rcx, [rip + 0x82578cc] ; GenericMethodInfo 257704 @0x188883d60
000000018062c494: call     0x18048bf00
000000018062c499: lea      rcx, [rip + 0x822e260] ; TypeInfo Torappu.FP @0x18885a700
000000018062c4a0: call     0x18048bf00
000000018062c4a5: lea      rcx, [rip + 0x829875c] ; GenericMethodInfo 265608 @0x1888c4c08
000000018062c4ac: call     0x18048bf00
000000018062c4b1: lea      rcx, [rip + 0x82ca368] ; GenericMethodInfo 273529 @0x1888f6820
000000018062c4b8: call     0x18048bf00
000000018062c4bd: lea      rcx, [rip + 0x821d114] ; GenericMethodInfo 272476 @0x1888495d8
000000018062c4c4: call     0x18048bf00
000000018062c4c9: lea      rcx, [rip + 0x8339ef0] ; GenericMethodInfo 271821 @0x1889663c0
000000018062c4d0: call     0x18048bf00
000000018062c4d5: lea      rcx, [rip + 0x821d334] ; GenericMethodInfo 272477 @0x188849810
000000018062c4dc: call     0x18048bf00
000000018062c4e1: lea      rcx, [rip + 0x833a118] ; GenericMethodInfo 271822 @0x188966600
000000018062c4e8: call     0x18048bf00
000000018062c4ed: lea      rcx, [rip + 0x8336964] ; TypeInfo UnityEngine.Physics2D @0x188962e58
000000018062c4f4: call     0x18048bf00
000000018062c4f9: lea      rcx, [rip + 0x82be980] ; GenericMethodInfo 282138 @0x1888eae80
000000018062c500: call     0x18048bf00
000000018062c505: lea      rcx, [rip + 0x82bebb4] ; GenericMethodInfo 282139 @0x1888eb0c0
000000018062c50c: call     0x18048bf00
000000018062c511: mov      byte ptr [rip + 0x8663c4c], 1
000000018062c518: mov      rdx, qword ptr [rip + 0x82fb841] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
000000018062c51f: cmp      dword ptr [rdx + 0xe0], 0
000000018062c526: jne      0x18062c537
000000018062c528: mov      rcx, rdx
000000018062c52b: call     0x18048c140
000000018062c530: mov      rdx, qword ptr [rip + 0x82fb829] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
000000018062c537: mov      rax, qword ptr [rdx + 0xb8]
000000018062c53e: mov      rcx, qword ptr [rax + 0xc70]
000000018062c545: test     rcx, rcx
000000018062c548: jne      0x18062cec5
000000018062c54e: cmp      dword ptr [rdx + 0xe0], ecx
000000018062c554: jne      0x18062c565
000000018062c556: mov      rcx, rdx
000000018062c559: call     0x18048c140
000000018062c55e: mov      rdx, qword ptr [rip + 0x82fb7fb] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
000000018062c565: mov      rax, qword ptr [rdx + 0xb8]
000000018062c56c: mov      ecx, dword ptr [rax + 0x14]
000000018062c56f: inc      ecx
000000018062c571: mov      dword ptr [rax + 0x14], ecx
000000018062c574: xor      ecx, ecx
000000018062c576: call     0x180640e40 ; Torappu.Battle.BattleController.get_deltaPlayTimeFP [64602]
000000018062c57b: mov      rbx, rax
000000018062c57e: mov      qword ptr [rsp + 0xc8], rax
000000018062c586: cmp      byte ptr [rip + 0x8663afd], 0
000000018062c58d: jne      0x18062c5ae
000000018062c58f: lea      rcx, [rip + 0x82fb7ca] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
000000018062c596: call     0x18048bf00
000000018062c59b: lea      rcx, [rip + 0x822e15e] ; TypeInfo Torappu.FP @0x18885a700
000000018062c5a2: call     0x18048bf00
000000018062c5a7: mov      byte ptr [rip + 0x8663adc], 1
000000018062c5ae: xor      r15d, r15d
000000018062c5b1: mov      qword ptr [rsp + 0xc0], r15
000000018062c5b9: mov      rcx, qword ptr [rip + 0x82fb7a0] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
000000018062c5c0: cmp      dword ptr [rcx + 0xe0], r15d
000000018062c5c7: jne      0x18062c5d5
000000018062c5c9: call     0x18048c140
000000018062c5ce: mov      rcx, qword ptr [rip + 0x82fb78b] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
000000018062c5d5: mov      rax, qword ptr [rcx + 0xb8]
000000018062c5dc: mov      r8, qword ptr [rax + 0x580]
000000018062c5e3: test     r8, r8
000000018062c5e6: jne      0x18062c62b
000000018062c5e8: cmp      dword ptr [rcx + 0xe0], r15d
000000018062c5ef: jne      0x18062c5f6
000000018062c5f1: call     0x18048c140
000000018062c5f6: xor      ecx, ecx
000000018062c5f8: call     0x180640e40 ; Torappu.Battle.BattleController.get_deltaPlayTimeFP [64602]
000000018062c5fd: mov      qword ptr [rsp + 0xc0], rax
000000018062c605: mov      rcx, qword ptr [rip + 0x822e0f4] ; TypeInfo Torappu.FP @0x18885a700
000000018062c60c: cmp      dword ptr [rcx + 0xe0], r15d
000000018062c613: jne      0x18062c61a
000000018062c615: call     0x18048c140
000000018062c61a: xor      edx, edx
000000018062c61c: lea      rcx, [rsp + 0xc0]
000000018062c624: call     0x1866fae20
000000018062c629: jmp      0x18062c635
000000018062c62b: xor      edx, edx
000000018062c62d: mov      rcx, r8
000000018062c630: call     0x1834682c0 ; XLua.DelegateBridge.__Gen_Delegate_Imp4 [2659]
000000018062c635: movaps   xmm6, xmm0
000000018062c638: movss    dword ptr [rsp + 0xc0], xmm6
000000018062c641: mov      rax, qword ptr [rip + 0x82fb718] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
000000018062c648: mov      rcx, qword ptr [rax + 0xb8]
000000018062c64f: mov      dword ptr [rcx + 0x50], r15d
000000018062c653: mov      rax, qword ptr [rip + 0x82fb706] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
000000018062c65a: mov      rdi, qword ptr [rax + 0xb8]
000000018062c661: mov      rdi, qword ptr [rdi + 0x18]
000000018062c665: mov      rcx, qword ptr [rip + 0x822e094] ; TypeInfo Torappu.FP @0x18885a700
000000018062c66c: cmp      dword ptr [rcx + 0xe0], r15d
000000018062c673: jne      0x18062c67a
000000018062c675: call     0x18048c140
000000018062c67a: xor      r8d, r8d
000000018062c67d: mov      rdx, rbx
000000018062c680: mov      rcx, rdi
000000018062c683: call     0x184624db0
000000018062c688: mov      rcx, qword ptr [rip + 0x82fb6d1] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
000000018062c68f: mov      rdx, qword ptr [rcx + 0xb8]
000000018062c696: mov      qword ptr [rdx + 0x18], rax
000000018062c69a: mov      rcx, qword ptr [rip + 0x82fb6bf] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
000000018062c6a1: mov      rax, qword ptr [rcx + 0xb8]
000000018062c6a8: movaps   xmm0, xmm6
000000018062c6ab: addss    xmm0, dword ptr [rax + 0x28]
000000018062c6b0: movss    dword ptr [rax + 0x28], xmm0
000000018062c6b5: xor      edx, edx
000000018062c6b7: mov      rcx, rsi
000000018062c6ba: call     0x180641830 ; Torappu.Battle.BattleController.get_gameMode [64515]
000000018062c6bf: test     rax, rax
000000018062c6c2: je       0x18062cf02
000000018062c6c8: mov      rcx, qword ptr [rax]
000000018062c6cb: mov      edx, dword ptr [rcx + 0x11c]
000000018062c6d1: add      edx, 0xfffff649
000000018062c6d7: cmp      edx, 0x1a
000000018062c6da: ja       0x18062c714
000000018062c6dc: movsxd   rcx, edx
000000018062c6df: lea      r8, [rip - 0x62c6e6]
000000018062c6e6: movzx    ecx, byte ptr [r8 + rcx + 0x62cf10]
000000018062c6ef: mov      edx, dword ptr [r8 + rcx*4 + 0x62cf08]
000000018062c6f7: add      rdx, r8
000000018062c6fa: jmp      rdx
000000018062c6fc: xor      edx, edx
000000018062c6fe: mov      rcx, rax
000000018062c701: call     0x180c19e20 ; Torappu.Battle.GameMode.GameModeFactory.DefaultGameMode.IgnoreFixedPlayTimeStatistics [82242]
000000018062c706: jmp      0x18062c728
000000018062c708: xor      edx, edx
000000018062c70a: mov      rcx, rax
000000018062c70d: call     0x180c6dc40 ; Torappu.Battle.GameMode.GameModeFactory.SandboxV3GameMode.IgnoreFixedPlayTimeStatistics [83011]
000000018062c712: jmp      0x18062c728
000000018062c714: mov      ecx, 0x6a
000000018062c719: mov      r8, rax
000000018062c71c: mov      rdx, qword ptr [rip + 0x83356ad] ; TypeInfo Torappu.Battle.GameMode.IGameMode @0x188961dd0
000000018062c723: call     0x180005310
000000018062c728: test     al, al
000000018062c72a: je       0x18062c78b
000000018062c72c: mov      rdi, qword ptr [rip + 0x82fb62d] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
000000018062c733: cmp      dword ptr [rdi + 0xe0], r15d
000000018062c73a: jne      0x18062c74b
000000018062c73c: mov      rcx, rdi
000000018062c73f: call     0x18048c140
000000018062c744: mov      rdi, qword ptr [rip + 0x82fb615] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
000000018062c74b: mov      rdi, qword ptr [rdi + 0xb8]
000000018062c752: mov      rdi, qword ptr [rdi + 0x20]
000000018062c756: mov      rcx, qword ptr [rip + 0x822dfa3] ; TypeInfo Torappu.FP @0x18885a700
000000018062c75d: cmp      dword ptr [rcx + 0xe0], r15d
000000018062c764: jne      0x18062c76b
000000018062c766: call     0x18048c140
000000018062c76b: xor      r8d, r8d
000000018062c76e: mov      rdx, rbx
000000018062c771: mov      rcx, rdi
000000018062c774: call     0x184624db0
000000018062c779: mov      rcx, qword ptr [rip + 0x82fb5e0] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
000000018062c780: mov      rdx, qword ptr [rcx + 0xb8]
000000018062c787: mov      qword ptr [rdx + 0x20], rax
000000018062c78b: cmp      qword ptr [rsi + 0x150], r15
000000018062c792: je       0x18062c7a6
000000018062c794: xor      r8d, r8d
000000018062c797: mov      rdx, rbx
000000018062c79a: mov      rcx, qword ptr [rsi + 0x150]
000000018062c7a1: call     0x181986890 ; Torappu.BattleTweenMgr.Tick [22098]
000000018062c7a6: mov      rdx, qword ptr [rsi + 0xa8]
000000018062c7ad: test     rdx, rdx
000000018062c7b0: je       0x18062cf02
000000018062c7b6: mov      r8, qword ptr [rip + 0x82ca063] ; GenericMethodInfo 273529 @0x1888f6820
000000018062c7bd: lea      rcx, [rsp + 0x30]
000000018062c7c2: call     0x184c3ec30
000000018062c7c7: movups   xmm0, xmmword ptr [rsp + 0x30]
000000018062c7cc: movups   xmmword ptr [rsp + 0x48], xmm0
000000018062c7d1: movsd    xmm1, qword ptr [rsp + 0x40]
000000018062c7d7: movsd    qword ptr [rsp + 0x58], xmm1
000000018062c7dd: mov      qword ptr [rsp + 0x30], r15
000000018062c7e2: lea      rdi, [rsp + 0x48]
000000018062c7e7: mov      qword ptr [rsp + 0x38], rdi
000000018062c7ec: nop      dword ptr [rax]
000000018062c7f0: mov      rdx, qword ptr [rip + 0x8257329] ; GenericMethodInfo 257703 @0x188883b20
000000018062c7f7: lea      rcx, [rsp + 0x48]
000000018062c7fc: call     0x185a56be0
000000018062c801: test     al, al
000000018062c803: je       0x18062c830
000000018062c805: mov      r14d, dword ptr [rsp + 0x58]
000000018062c80a: xor      edx, edx
000000018062c80c: mov      rcx, rsi
000000018062c80f: call     0x180640b90 ; Torappu.Battle.BattleController.get_costManager [64510]
000000018062c814: test     rax, rax
000000018062c817: je       0x18062cee5
000000018062c81d: xor      r9d, r9d
000000018062c820: mov      r8d, r14d
000000018062c823: mov      rdx, rbx
000000018062c826: mov      rcx, rax
000000018062c829: call     0x180656130 ; Torappu.Battle.BattleCostManager.UpdateCost [64915]
000000018062c82e: jmp      0x18062c7f0
000000018062c830: mov      rdx, qword ptr [rip + 0x82570b1] ; GenericMethodInfo 257702 @0x1888838e8
000000018062c837: mov      rcx, rdi
000000018062c83a: call     0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
000000018062c83f: jmp      0x18062c87c
000000018062c841: mov      rdx, qword ptr [rip + 0x82570a0] ; GenericMethodInfo 257702 @0x1888838e8
000000018062c848: mov      rcx, qword ptr [rsp + 0x38]
000000018062c84d: call     0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
000000018062c852: mov      rcx, qword ptr [rsp + 0x30]
000000018062c857: test     rcx, rcx
000000018062c85a: jne      0x18062ceeb
000000018062c860: xor      r15d, r15d
000000018062c863: mov      rsi, qword ptr [rsp + 0xb0]
000000018062c86b: mov      rbx, qword ptr [rsp + 0xc8]
000000018062c873: movss    xmm6, dword ptr [rsp + 0xc0]
000000018062c87c: cmp      byte ptr [rip + 0x86638ce], 0
000000018062c883: jne      0x18062c8a4
000000018062c885: lea      rcx, [rip + 0x82fb4d4] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
000000018062c88c: call     0x18048bf00
000000018062c891: lea      rcx, [rip + 0x822de68] ; TypeInfo Torappu.FP @0x18885a700
000000018062c898: call     0x18048bf00
000000018062c89d: mov      byte ptr [rip + 0x86638ad], 1
000000018062c8a4: mov      rax, qword ptr [rip + 0x82fb4b5] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
000000018062c8ab: cmp      dword ptr [rax + 0xe0], 0
000000018062c8b2: jne      0x18062c8c3
000000018062c8b4: mov      rcx, rax
000000018062c8b7: call     0x18048c140
000000018062c8bc: mov      rax, qword ptr [rip + 0x82fb49d] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
000000018062c8c3: mov      rax, qword ptr [rax + 0xb8]
000000018062c8ca: mov      rcx, qword ptr [rax + 0xbd8]
000000018062c8d1: test     rcx, rcx
000000018062c8d4: jne      0x18062c94a
000000018062c8d6: xor      edx, edx
000000018062c8d8: mov      rcx, rsi
000000018062c8db: call     0x180644510 ; Torappu.Battle.BattleController.get_unitManager [64502]
000000018062c8e0: test     rax, rax
000000018062c8e3: je       0x18062cf02
000000018062c8e9: xor      edx, edx
000000018062c8eb: mov      rcx, rax
000000018062c8ee: call     0x180ac3930 ; Torappu.Battle.UnitManager.get_enemyCnt [77790]
000000018062c8f3: mov      rcx, qword ptr [rip + 0x822de06] ; TypeInfo Torappu.FP @0x18885a700
000000018062c8fa: test     eax, eax
000000018062c8fc: jg       0x18062c92a
000000018062c8fe: mov      rdi, qword ptr [rsi + 0x288]
000000018062c905: cmp      dword ptr [rcx + 0xe0], 0
000000018062c90c: jne      0x18062c913
000000018062c90e: call     0x18048c140
000000018062c913: xor      r8d, r8d
000000018062c916: mov      rdx, rbx
000000018062c919: mov      rcx, rdi
000000018062c91c: call     0x184624db0
000000018062c921: mov      qword ptr [rsi + 0x288], rax
000000018062c928: jmp      0x18062c958
000000018062c92a: cmp      dword ptr [rcx + 0xe0], 0
000000018062c931: jne      0x18062c938
000000018062c933: call     0x18048c140
000000018062c938: xor      edx, edx
000000018062c93a: xor      ecx, ecx
000000018062c93c: call     0x1866fdac0
000000018062c941: mov      qword ptr [rsi + 0x288], rax
000000018062c948: jmp      0x18062c958
000000018062c94a: xor      r9d, r9d
000000018062c94d: mov      r8, rbx
000000018062c950: mov      rdx, rsi
000000018062c953: call     0x1833f9830 ; XLua.DelegateBridge.__Gen_Delegate_Imp427 [3082]
000000018062c958: mov      rdx, qword ptr [rsi + 0xa8]
000000018062c95f: test     rdx, rdx
000000018062c962: je       0x18062cf02
000000018062c968: mov      r8, qword ptr [rip + 0x82c9eb1] ; GenericMethodInfo 273529 @0x1888f6820
000000018062c96f: lea      rcx, [rsp + 0x30]
000000018062c974: call     0x184c3ec30
000000018062c979: movups   xmm0, xmmword ptr [rsp + 0x30]
000000018062c97e: movups   xmmword ptr [rsp + 0x48], xmm0
000000018062c983: movsd    xmm1, qword ptr [rsp + 0x40]
000000018062c989: movsd    qword ptr [rsp + 0x58], xmm1
000000018062c98f: mov      qword ptr [rsp + 0x30], r15
000000018062c994: lea      rdi, [rsp + 0x48]
000000018062c999: mov      qword ptr [rsp + 0x38], rdi
000000018062c99e: nop      
000000018062c9a0: mov      rdx, qword ptr [rip + 0x8257179] ; GenericMethodInfo 257703 @0x188883b20
000000018062c9a7: lea      rcx, [rsp + 0x48]
000000018062c9ac: call     0x185a56be0
000000018062c9b1: test     al, al
000000018062c9b3: je       0x18062c9ee
000000018062c9b5: mov      rcx, qword ptr [rsi + 0xb0]
000000018062c9bc: test     rcx, rcx
000000018062c9bf: je       0x18062cef6
000000018062c9c5: mov      r8, qword ptr [rip + 0x829823c] ; GenericMethodInfo 265608 @0x1888c4c08
000000018062c9cc: mov      edx, dword ptr [rsp + 0x58]
000000018062c9d0: call     0x184a8da30
000000018062c9d5: test     rax, rax
000000018062c9d8: je       0x18062cef1
000000018062c9de: xor      r8d, r8d
000000018062c9e1: mov      rdx, rbx
000000018062c9e4: mov      rcx, rax
000000018062c9e7: call     0x1806c96d0 ; Torappu.Battle.Deck.OnFixedUpdate [65769]
000000018062c9ec: jmp      0x18062c9a0
000000018062c9ee: mov      rdx, qword ptr [rip + 0x8256ef3] ; GenericMethodInfo 257702 @0x1888838e8
000000018062c9f5: mov      rcx, rdi
000000018062c9f8: call     0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
000000018062c9fd: jmp      0x18062ca3a
000000018062c9ff: mov      rdx, qword ptr [rip + 0x8256ee2] ; GenericMethodInfo 257702 @0x1888838e8
000000018062ca06: mov      rcx, qword ptr [rsp + 0x38]
000000018062ca0b: call     0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
000000018062ca10: mov      rcx, qword ptr [rsp + 0x30]
000000018062ca15: test     rcx, rcx
000000018062ca18: jne      0x18062cefc
000000018062ca1e: xor      r15d, r15d
000000018062ca21: mov      rsi, qword ptr [rsp + 0xb0]
000000018062ca29: mov      rbx, qword ptr [rsp + 0xc8]
000000018062ca31: movss    xmm6, dword ptr [rsp + 0xc0]
000000018062ca3a: mov      rcx, qword ptr [rsi + 0x78]
000000018062ca3e: test     rcx, rcx
000000018062ca41: je       0x18062cf02
000000018062ca47: xor      r8d, r8d
000000018062ca4a: mov      rdx, rbx
000000018062ca4d: call     0x1808d5300 ; Torappu.Battle.ObjectManager.OnFixedUpdate [71077]
000000018062ca52: mov      rcx, qword ptr [rip + 0x82be427] ; GenericMethodInfo 282138 @0x1888eae80
000000018062ca59: call     0x185337b70
000000018062ca5e: test     al, al
000000018062ca60: je       0x18062ca85
000000018062ca62: mov      rcx, qword ptr [rip + 0x82be657] ; GenericMethodInfo 282139 @0x1888eb0c0
000000018062ca69: call     0x185337c50
000000018062ca6e: test     rax, rax
000000018062ca71: je       0x18062cf02
000000018062ca77: xor      r8d, r8d
000000018062ca7a: mov      rdx, rbx
000000018062ca7d: mov      rcx, rax
000000018062ca80: call     0x181277dc0 ; Torappu.Battle.UI.UIController.OnFixedUpdate [103412]
000000018062ca85: cmp      byte ptr [rip + 0x866358a], 0
000000018062ca8c: jne      0x18062caa1
000000018062ca8e: lea      rcx, [rip + 0x82fb2cb] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
000000018062ca95: call     0x18048bf00
000000018062ca9a: mov      byte ptr [rip + 0x8663575], 1
000000018062caa1: mov      rax, qword ptr [rip + 0x82fb2b8] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
000000018062caa8: cmp      dword ptr [rax + 0xe0], 0
000000018062caaf: jne      0x18062cac0
000000018062cab1: mov      rcx, rax
000000018062cab4: call     0x18048c140
000000018062cab9: mov      rax, qword ptr [rip + 0x82fb2a0] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
000000018062cac0: mov      rax, qword ptr [rax + 0xb8]
000000018062cac7: mov      rcx, qword ptr [rax + 0x1e0]
000000018062cace: test     rcx, rcx
000000018062cad1: jne      0x18062cad9
000000018062cad3: mov      rax, qword ptr [rsi + 0x28]
000000018062cad7: jmp      0x18062cae4
000000018062cad9: xor      r8d, r8d
000000018062cadc: mov      rdx, rsi
000000018062cadf: call     0x183308530 ; XLua.DelegateBridge.__Gen_Delegate_Imp2750 [5405]
000000018062cae4: test     rax, rax
000000018062cae7: je       0x18062cf02
000000018062caed: xor      r8d, r8d
000000018062caf0: mov      rdx, rbx
000000018062caf3: mov      rcx, rax
000000018062caf6: call     0x18087f9b0 ; Torappu.Battle.Map.OnFixedUpdate [70036]
000000018062cafb: mov      rcx, qword ptr [rsi + 0x1e0]
000000018062cb02: test     rcx, rcx
000000018062cb05: je       0x18062cf02
000000018062cb0b: xor      r8d, r8d
000000018062cb0e: mov      rdx, rbx
000000018062cb11: call     0x180c8c230 ; Torappu.Battle.LevelScript.ActionExecutorManager.Tick [83813]
000000018062cb16: mov      rcx, qword ptr [rsi + 0x1e8]
000000018062cb1d: test     rcx, rcx
000000018062cb20: je       0x18062cf02
000000018062cb26: xor      r8d, r8d
000000018062cb29: mov      rdx, rbx
000000018062cb2c: call     0x180c9d3e0 ; Torappu.Battle.LevelScript.LevelScriptEventManager.OnTick [83948]
000000018062cb31: mov      rcx, qword ptr [rsi + 0x190]
000000018062cb38: test     rcx, rcx
000000018062cb3b: je       0x18062cf02
000000018062cb41: xor      r8d, r8d
000000018062cb44: mov      rdx, rbx
000000018062cb47: call     0x180603ff0 ; Torappu.Battle.ClientAntiCheatChecker.OnFixedUpdate [64088]
000000018062cb4c: cmp      byte ptr [rip + 0x86635ff], 0
000000018062cb53: jne      0x18062cb68
000000018062cb55: lea      rcx, [rip + 0x82fb204] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
000000018062cb5c: call     0x18048bf00
000000018062cb61: mov      byte ptr [rip + 0x86635ea], 1
000000018062cb68: mov      rax, qword ptr [rip + 0x82fb1f1] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
000000018062cb6f: cmp      dword ptr [rax + 0xe0], 0
000000018062cb76: jne      0x18062cb87
000000018062cb78: mov      rcx, rax
000000018062cb7b: call     0x18048c140
000000018062cb80: mov      rax, qword ptr [rip + 0x82fb1d9] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
000000018062cb87: mov      rax, qword ptr [rax + 0xb8]
000000018062cb8e: mov      rcx, qword ptr [rax + 0xbe0]
000000018062cb95: test     rcx, rcx
000000018062cb98: jne      0x18062cbfd
000000018062cb9a: xor      edx, edx
000000018062cb9c: mov      rcx, rsi
000000018062cb9f: call     0x180641ed0 ; Torappu.Battle.BattleController.get_isAutoReplayOn [64534]
000000018062cba4: test     al, al
000000018062cba6: jne      0x18062cbc1
000000018062cba8: mov      rcx, qword ptr [rsi + 0x110]
000000018062cbaf: test     rcx, rcx
000000018062cbb2: je       0x18062cf02
000000018062cbb8: xor      edx, edx
000000018062cbba: call     0x18065e580 ; Torappu.Battle.BattleController.PlayerOperationQueue.Drain [64854]
000000018062cbbf: jmp      0x18062cc08
000000018062cbc1: mov      rdi, qword ptr [rsi + 0xe0]
000000018062cbc8: mov      rcx, qword ptr [rip + 0x82fb191] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
000000018062cbcf: cmp      dword ptr [rcx + 0xe0], 0
000000018062cbd6: jne      0x18062cbdd
000000018062cbd8: call     0x18048c140
000000018062cbdd: xor      ecx, ecx
000000018062cbdf: call     0x1806416e0 ; Torappu.Battle.BattleController.get_fixedPlayTime [64468]
000000018062cbe4: test     rdi, rdi
000000018062cbe7: je       0x18062cf02
000000018062cbed: xor      r8d, r8d
000000018062cbf0: mov      rdx, rax
000000018062cbf3: mov      rcx, rdi
000000018062cbf6: call     0x18065f240 ; Torappu.Battle.BattleController.ReplayController.Tick [64842]
000000018062cbfb: jmp      0x18062cc08
000000018062cbfd: xor      r8d, r8d
000000018062cc00: mov      rdx, rsi
000000018062cc03: call     0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
000000018062cc08: xor      edx, edx
000000018062cc0a: mov      rcx, rsi
000000018062cc0d: call     0x18063e6d0 ; Torappu.Battle.BattleController._UpdateDelayToRecycleBuffContainer [64753]
000000018062cc12: xor      ecx, ecx
000000018062cc14: call     0x1867460c0
000000018062cc19: test     al, al
000000018062cc1b: jne      0x18062cd5c
000000018062cc21: mov      rcx, qword ptr [rip + 0x8336230] ; TypeInfo UnityEngine.Physics2D @0x188962e58
000000018062cc28: cmp      dword ptr [rcx + 0xe0], 0
000000018062cc2f: jne      0x18062cc36
000000018062cc31: call     0x18048c140
000000018062cc36: xor      edx, edx
000000018062cc38: movaps   xmm0, xmm6
000000018062cc3b: call     0x186bc5160
000000018062cc40: mov      r12d, r15d
000000018062cc43: mov      ecx, r15d
000000018062cc46: mov      rax, qword ptr [rsi + 0xc8]
000000018062cc4d: test     rax, rax
000000018062cc50: je       0x18062cf02
000000018062cc56: cmp      ecx, dword ptr [rax + 0x18]
000000018062cc59: jge      0x18062cd5c
000000018062cc5f: mov      rcx, qword ptr [rsi + 0xc8]
000000018062cc66: test     rcx, rcx
000000018062cc69: je       0x18062cf02
000000018062cc6f: mov      r8, qword ptr [rip + 0x821cb9a] ; GenericMethodInfo 272477 @0x188849810
000000018062cc76: mov      edx, r12d
000000018062cc79: call     0x184afcf00
000000018062cc7e: mov      rdi, rax
000000018062cc81: test     rax, rax
000000018062cc84: je       0x18062cf02
000000018062cc8a: mov      rax, qword ptr [rax]
000000018062cc8d: cmp      dword ptr [rax + 0x11c], 0x8cd
000000018062cc97: je       0x18062cd33
000000018062cc9d: mov      r14, qword ptr [rip + 0x81d2214] ; TypeInfo Torappu.Battle.IPhysicObject @0x1887feeb8
000000018062cca4: mov      r13, rax
000000018062cca7: cmp      byte ptr [rip + 0x869fb42], 0
000000018062ccae: je       0x18062ccb8
000000018062ccb0: mov      rcx, rax
000000018062ccb3: call     0x180446d00
000000018062ccb8: movzx    ecx, r15w
000000018062ccbc: movzx    edx, word ptr [r13 + 0x12e]
000000018062ccc4: cmp      r15w, dx
000000018062ccc8: jae      0x18062cce5
000000018062ccca: mov      r8, qword ptr [r13 + 0xb0]
000000018062ccd1: movzx    eax, cx
000000018062ccd4: add      rax, rax
000000018062ccd7: cmp      qword ptr [r8 + rax*8], r14
000000018062ccdb: je       0x18062cd07
000000018062ccdd: inc      cx
000000018062cce0: cmp      cx, dx
000000018062cce3: jb       0x18062ccd1
000000018062cce5: mov      r8d, 2
000000018062cceb: mov      rdx, r14
000000018062ccee: mov      rcx, rdi
000000018062ccf1: call     0x180445cc0
000000018062ccf6: mov      rdx, qword ptr [rax]
000000018062ccf9: mov      r8, qword ptr [rax + 8]
000000018062ccfd: movaps   xmm1, xmm6
000000018062cd00: mov      rcx, rdi
000000018062cd03: call     rdx
000000018062cd05: jmp      0x18062cd41
000000018062cd07: movzx    ecx, cx
000000018062cd0a: add      rcx, rcx
000000018062cd0d: mov      eax, dword ptr [r8 + rcx*8 + 8]
000000018062cd12: add      eax, 2
000000018062cd15: cdqe     
000000018062cd17: add      rax, 0x14
000000018062cd1b: shl      rax, 4
000000018062cd1f: add      rax, r13
000000018062cd22: mov      rdx, qword ptr [rax]
000000018062cd25: mov      r8, qword ptr [rax + 8]
000000018062cd29: movaps   xmm1, xmm6
000000018062cd2c: mov      rcx, rdi
000000018062cd2f: call     rdx
000000018062cd31: jmp      0x18062cd41
000000018062cd33: xor      r8d, r8d
000000018062cd36: movaps   xmm1, xmm6
000000018062cd39: mov      rcx, rdi
000000018062cd3c: call     0x180a9e6f0 ; Torappu.Battle.Enemy.States.UnbalanceState.OnAfterPhysicSimulate [76753]
000000018062cd41: inc      r12d
000000018062cd44: mov      ecx, r12d
000000018062cd47: mov      rax, qword ptr [rsi + 0xc8]
000000018062cd4e: test     rax, rax
000000018062cd51: je       0x18062cf02
000000018062cd57: jmp      0x18062cc56
000000018062cd5c: mov      rcx, qword ptr [rsi + 0x1b8]
000000018062cd63: test     rcx, rcx
000000018062cd66: je       0x18062cf02
000000018062cd6c: xor      r8d, r8d
000000018062cd6f: mov      rdx, rbx
000000018062cd72: call     0x180c7a980 ; Torappu.Battle.Dialog.DialogController.OnTick [83491]
000000018062cd77: mov      rcx, qword ptr [rip + 0x82fafe2] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
000000018062cd7e: cmp      dword ptr [rcx + 0xe0], 0
000000018062cd85: jne      0x18062cd93
000000018062cd87: call     0x18048c140
000000018062cd8c: mov      rcx, qword ptr [rip + 0x82fafcd] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
000000018062cd93: cmp      byte ptr [rip + 0x866324e], 0
000000018062cd9a: jne      0x18062cdb6
000000018062cd9c: lea      rcx, [rip + 0x82fafbd] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
000000018062cda3: call     0x18048bf00
000000018062cda8: mov      byte ptr [rip + 0x8663239], 1
000000018062cdaf: mov      rcx, qword ptr [rip + 0x82fafaa] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
000000018062cdb6: cmp      dword ptr [rcx + 0xe0], 0
000000018062cdbd: jne      0x18062cdcb
000000018062cdbf: call     0x18048c140
000000018062cdc4: mov      rcx, qword ptr [rip + 0x82faf95] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
000000018062cdcb: mov      rax, qword ptr [rcx + 0xb8]
000000018062cdd2: mov      r8, qword ptr [rax + 0x70]
000000018062cdd6: test     r8, r8
000000018062cdd9: jne      0x18062cdfd
000000018062cddb: cmp      dword ptr [rcx + 0xe0], r8d
000000018062cde2: jne      0x18062cdf0
000000018062cde4: call     0x18048c140
000000018062cde9: mov      rcx, qword ptr [rip + 0x82faf70] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
000000018062cdf0: mov      rax, qword ptr [rcx + 0xb8]
000000018062cdf7: movzx    eax, byte ptr [rax + 0x10]
000000018062cdfb: jmp      0x18062ce07
000000018062cdfd: xor      edx, edx
000000018062cdff: mov      rcx, r8
000000018062ce02: call     0x183596f60 ; XLua.DelegateBridge.__Gen_Delegate_Imp6 [2661]
000000018062ce07: test     al, al
000000018062ce09: je       0x18062ce22
000000018062ce0b: mov      rcx, qword ptr [rsi + 0x130]
000000018062ce12: test     rcx, rcx
000000018062ce15: je       0x18062cf02
000000018062ce1b: xor      edx, edx
000000018062ce1d: call     0x18065d0a0 ; Torappu.Battle.CoroutineSimulator.SimulateTick [64230]
000000018062ce22: mov      ecx, r15d
000000018062ce25: mov      rax, qword ptr [rsi + 0x68]
000000018062ce29: test     rax, rax
000000018062ce2c: je       0x18062cf02
000000018062ce32: cmp      ecx, dword ptr [rax + 0x18]
000000018062ce35: jge      0x18062ce9b
000000018062ce37: mov      rcx, qword ptr [rsi + 0x68]
000000018062ce3b: test     rcx, rcx
000000018062ce3e: je       0x18062cf02
000000018062ce44: mov      r8, qword ptr [rip + 0x83397b5] ; GenericMethodInfo 271822 @0x188966600
000000018062ce4b: mov      edx, r15d
000000018062ce4e: call     0x184afcf00
000000018062ce53: mov      rdi, rax
000000018062ce56: test     rax, rax
000000018062ce59: je       0x18062cf02
000000018062ce5f: cmp      byte ptr [rip + 0x869f98a], 0
000000018062ce66: jbe      0x18062ce70
000000018062ce68: mov      rcx, qword ptr [rax]
000000018062ce6b: call     0x180446d00
000000018062ce70: mov      r8, qword ptr [rdi]
000000018062ce73: mov      r9, qword ptr [r8 + 0x1e0]
000000018062ce7a: mov      r8, qword ptr [r8 + 0x1e8]
000000018062ce81: mov      rdx, rbx
000000018062ce84: mov      rcx, rdi
000000018062ce87: call     r9
000000018062ce8a: inc      r15d
000000018062ce8d: mov      ecx, r15d
000000018062ce90: mov      rax, qword ptr [rsi + 0x68]
000000018062ce94: test     rax, rax
000000018062ce97: jne      0x18062ce32
000000018062ce99: jmp      0x18062cf02
000000018062ce9b: mov      rcx, qword ptr [rsi + 0x70]
000000018062ce9f: test     rcx, rcx
000000018062cea2: je       0x18062cf02
000000018062cea4: xor      r8d, r8d
000000018062cea7: mov      rdx, rbx
000000018062ceaa: call     0x18074b330 ; Torappu.Battle.GlobalEnvSystemController.Tick [67762]
000000018062ceaf: mov      rcx, qword ptr [rsi + 0x78]
000000018062ceb3: test     rcx, rcx
000000018062ceb6: je       0x18062cf02
000000018062ceb8: xor      r8d, r8d
000000018062cebb: mov      rdx, rbx
000000018062cebe: call     0x1808d54d0 ; Torappu.Battle.ObjectManager.OnLateFixedUpdate [71078]
000000018062cec3: jmp      0x18062ced0
000000018062cec5: xor      r8d, r8d
000000018062cec8: mov      rdx, rsi
000000018062cecb: call     0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
000000018062ced0: movaps   xmm6, xmmword ptr [rsp + 0x60]
000000018062ced5: add      rsp, 0x70
000000018062ced9: pop      r15
000000018062cedb: pop      r14
000000018062cedd: pop      r13
000000018062cedf: pop      r12
000000018062cee1: pop      rdi
000000018062cee2: pop      rsi
000000018062cee3: pop      rbx
000000018062cee4: ret      
000000018062cee5: call     0x18048c0b0
000000018062ceea: nop      
000000018062ceeb: call     0x180472d50
000000018062cef0: nop      
000000018062cef1: call     0x18048c0b0
000000018062cef6: call     0x18048c0b0
000000018062cefb: nop      
000000018062cefc: call     0x180472d50
000000018062cf01: int3     
000000018062cf02: call     0x18048c0b0
000000018062cf07: int3     
000000018062cf08: cld      