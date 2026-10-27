; Torappu.Battle.BattleController.ManualFrameTick metadata=64666 token=0x600fc9b VA=0x180629410 RVA=0x629410 size=0x1d0
0000000180629410: mov      qword ptr [rsp + 8], rbx
0000000180629415: mov      qword ptr [rsp + 0x10], rsi
000000018062941a: push     rdi
000000018062941b: sub      rsp, 0x30
000000018062941f: cmp      byte ptr [rip + 0x8666c9f], 0
0000000180629426: movzx    esi, r8b
000000018062942a: mov      rdi, rdx
000000018062942d: mov      rbx, rcx
0000000180629430: jne      0x180629445
0000000180629432: lea      rcx, [rip + 0x82fe927] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
0000000180629439: call     0x18048bf00
000000018062943e: mov      byte ptr [rip + 0x8666c80], 1
0000000180629445: mov      rax, qword ptr [rip + 0x82fe914] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
000000018062944c: cmp      dword ptr [rax + 0xe0], 0
0000000180629453: jne      0x180629464
0000000180629455: mov      rcx, rax
0000000180629458: call     0x18048c140
000000018062945d: mov      rax, qword ptr [rip + 0x82fe8fc] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
0000000180629464: mov      rax, qword ptr [rax + 0xb8]
000000018062946b: mov      rcx, qword ptr [rax + 0x778]
0000000180629472: test     rcx, rcx
0000000180629475: jne      0x180629546
000000018062947b: mov      r8, qword ptr [rbx + 0x170]
0000000180629482: test     r8, r8
0000000180629485: je       0x18062956e
000000018062948b: mov      rax, qword ptr [r8]
000000018062948e: mov      edx, dword ptr [rax + 0x11c]
0000000180629494: add      edx, 0xfffff649
000000018062949a: cmp      edx, 0x1a
000000018062949d: ja       0x1806294fd
000000018062949f: movsxd   rax, edx
00000001806294a2: lea      rcx, [rip - 0x6294a9]
00000001806294a9: mov      edx, dword ptr [rcx + rax*4 + 0x629574]
00000001806294b0: add      rdx, rcx
00000001806294b3: jmp      rdx
00000001806294b5: xor      edx, edx
00000001806294b7: mov      rcx, r8
00000001806294ba: call     0x180c1ba60 ; Torappu.Battle.GameMode.GameModeFactory.DefaultGameMode.get_allowManualTick [82138]
00000001806294bf: jmp      0x18062950b
00000001806294c1: xor      edx, edx
00000001806294c3: mov      rcx, r8
00000001806294c6: call     0x180bdbdb0 ; Torappu.Battle.GameMode.GameModeFactory.ArkDexGameMode.get_allowManualTick [80901]
00000001806294cb: jmp      0x18062950b
00000001806294cd: xor      edx, edx
00000001806294cf: mov      rcx, r8
00000001806294d2: call     0x180bdf650 ; Torappu.Battle.GameMode.GameModeFactory.AutoChessGameMode.get_allowManualTick [80986]
00000001806294d7: jmp      0x18062950b
00000001806294d9: xor      edx, edx
00000001806294db: mov      rcx, r8
00000001806294de: call     0x180bf99f0 ; Torappu.Battle.GameMode.GameModeFactory.CooperateGameMode.get_allowManualTick [81370]
00000001806294e3: jmp      0x18062950b
00000001806294e5: xor      edx, edx
00000001806294e7: mov      rcx, r8
00000001806294ea: call     0x180c14380 ; Torappu.Battle.GameMode.GameModeFactory.EnemyDuelGameMode.get_allowManualTick [81829]
00000001806294ef: jmp      0x18062950b
00000001806294f1: xor      edx, edx
00000001806294f3: mov      rcx, r8
00000001806294f6: call     0x180c4b970 ; Torappu.Battle.GameMode.GameModeFactory.MultiplayerGameMode.get_allowManualTick [82603]
00000001806294fb: jmp      0x18062950b
00000001806294fd: mov      rdx, qword ptr [rip + 0x83388cc] ; TypeInfo Torappu.Battle.GameMode.IGameMode @0x188961dd0
0000000180629504: xor      ecx, ecx
0000000180629506: call     0x180005310
000000018062950b: test     al, al
000000018062950d: je       0x18062955e
000000018062950f: mov      byte ptr [rbx + 0x118], sil
0000000180629516: test     rdi, rdi
0000000180629519: je       0x18062952d
000000018062951b: mov      rdx, qword ptr [rbx + 0x110]
0000000180629522: xor      r8d, r8d
0000000180629525: mov      rcx, rdi
0000000180629528: call     0x18065dd70 ; Torappu.Battle.BattleController.FrameData.DumpToPlayerOpQueue [64866]
000000018062952d: xor      edx, edx
000000018062952f: mov      rcx, rbx
0000000180629532: mov      rbx, qword ptr [rsp + 0x40]
0000000180629537: mov      rsi, qword ptr [rsp + 0x48]
000000018062953c: add      rsp, 0x30
0000000180629540: pop      rdi
0000000180629541: jmp      0x18062c440 ; Torappu.Battle.BattleController.OnTick [64825]
0000000180629546: movzx    r9d, sil
000000018062954a: mov      qword ptr [rsp + 0x20], 0
0000000180629553: mov      r8, rdi
0000000180629556: mov      rdx, rbx
0000000180629559: call     0x1832fa300 ; XLua.DelegateBridge.__Gen_Delegate_Imp265 [2920]
000000018062955e: mov      rbx, qword ptr [rsp + 0x40]
0000000180629563: mov      rsi, qword ptr [rsp + 0x48]
0000000180629568: add      rsp, 0x30
000000018062956c: pop      rdi
000000018062956d: ret      
000000018062956e: call     0x18048c0b0
0000000180629573: int3     
0000000180629574: mov      ch, 0x94