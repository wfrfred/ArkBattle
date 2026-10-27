; <Module>.game-mode-fixedupdate-dispatch metadata=-1 token=0x0 VA=0x18061a6d0 RVA=0x61a6d0 size=0x550
000000018061a6d0: mov      rax, qword ptr [rcx]
000000018061a6d3: mov      r10, rcx
000000018061a6d6: mov      r8d, dword ptr [rax + 0x11c]
000000018061a6dd: add      r8d, 0xfffff649
000000018061a6e4: cmp      r8d, 0x1a
000000018061a6e8: ja       0x18061a7d7
000000018061a6ee: movsxd   rax, r8d
000000018061a6f1: lea      rcx, [rip - 0x61a6f8]
000000018061a6f8: mov      r8d, dword ptr [rcx + rax*4 + 0x61a7f0]
000000018061a700: add      r8, rcx
000000018061a703: jmp      r8
000000018061a706: xor      r8d, r8d
000000018061a709: mov      rcx, r10
000000018061a70c: jmp      0x180bcc3f0 ; Torappu.Battle.GameMode.GameModeFactory.Act20SideGameMode.Tick [80716]
000000018061a711: xor      r8d, r8d
000000018061a714: mov      rcx, r10
000000018061a717: jmp      0x180bccdc0 ; Torappu.Battle.GameMode.GameModeFactory.Act27SideGameMode.Tick [80729]
000000018061a71c: xor      r8d, r8d
000000018061a71f: mov      rcx, r10
000000018061a722: jmp      0x180bce4c0 ; Torappu.Battle.GameMode.GameModeFactory.Act6FunGameMode.Tick [80749]
000000018061a727: xor      r8d, r8d
000000018061a72a: mov      rcx, r10
000000018061a72d: jmp      0x180bd1c10 ; Torappu.Battle.GameMode.GameModeFactory.Act7FunGameMode.Tick [80792]
000000018061a732: xor      r8d, r8d
000000018061a735: mov      rcx, r10
000000018061a738: jmp      0x180bda350 ; Torappu.Battle.GameMode.GameModeFactory.ArkDexGameMode.Tick [80912]
000000018061a73d: xor      r8d, r8d
000000018061a740: mov      rcx, r10
000000018061a743: jmp      0x180bde140 ; Torappu.Battle.GameMode.GameModeFactory.AutoChessGameMode.Tick [80991]
000000018061a748: xor      r8d, r8d
000000018061a74b: mov      rcx, r10
000000018061a74e: jmp      0x180bf4600 ; Torappu.Battle.GameMode.GameModeFactory.CooperateGameMode.Tick [81420]
000000018061a753: xor      r8d, r8d
000000018061a756: mov      rcx, r10
000000018061a759: jmp      0x180c0dcd0 ; Torappu.Battle.GameMode.GameModeFactory.DouququGameMode.Tick [81786]
000000018061a75e: xor      r8d, r8d
000000018061a761: mov      rcx, r10
000000018061a764: jmp      0x180c10dc0 ; Torappu.Battle.GameMode.GameModeFactory.EnemyDuelGameMode.Tick [81828]
000000018061a769: xor      r8d, r8d
000000018061a76c: mov      rcx, r10
000000018061a76f: jmp      0x180c26ec0 ; Torappu.Battle.GameMode.GameModeFactory.FunLiveGameMode.Tick [82050]
000000018061a774: xor      r8d, r8d
000000018061a777: mov      rcx, r10
000000018061a77a: jmp      0x180c2ae20 ; Torappu.Battle.GameMode.GameModeFactory.GameCityGameMode.Tick [82080]
000000018061a77f: xor      r8d, r8d
000000018061a782: mov      rcx, r10
000000018061a785: jmp      0x180c33ad0 ; Torappu.Battle.GameMode.GameModeFactory.HalfIdleGameMode.Tick [82297]
000000018061a78a: xor      r8d, r8d
000000018061a78d: mov      rcx, r10
000000018061a790: jmp      0x180c458d0 ; Torappu.Battle.GameMode.GameModeFactory.LegionGameMode.Tick [82510]
000000018061a795: xor      r8d, r8d
000000018061a798: mov      rcx, r10
000000018061a79b: jmp      0x180c4c660 ; Torappu.Battle.GameMode.GameModeFactory.RacingGameMode.Tick [82656]
000000018061a7a0: xor      r8d, r8d
000000018061a7a3: mov      rcx, r10
000000018061a7a6: jmp      0x180c4f7a0 ; Torappu.Battle.GameMode.GameModeFactory.RoguelikeDeifyGameMode.Tick [82688]
000000018061a7ab: xor      r8d, r8d
000000018061a7ae: mov      rcx, r10
000000018061a7b1: jmp      0x180c52550 ; Torappu.Battle.GameMode.GameModeFactory.RoguelikeDuelGameMode.Tick [82714]
000000018061a7b6: xor      r8d, r8d
000000018061a7b9: mov      rcx, r10
000000018061a7bc: jmp      0x180c69a70 ; Torappu.Battle.GameMode.GameModeFactory.SandboxGameMode.Tick [82864]
000000018061a7c1: xor      r8d, r8d
000000018061a7c4: mov      rcx, r10
000000018061a7c7: jmp      0x180c6e900 ; Torappu.Battle.GameMode.GameModeFactory.SandboxV3GameMode.Tick [83007]
000000018061a7cc: xor      r8d, r8d
000000018061a7cf: mov      rcx, r10
000000018061a7d2: jmp      0x180c1b5e0 ; Torappu.Battle.GameMode.GameModeFactory.FunLiveGameMode.<>xLuaBaseProxy_Tick [82062] | Torappu.Battle.GameMode.GameModeFactory.GameCityGameMode.<>xLuaBaseProxy_Tick [82135] | Torappu.Battle.GameMode.GameModeFactory.DefaultGameMode.Tick [82164] | Torappu.Battle.GameMode.GameModeFactory.HalfIdleGameMode.<>xLuaBaseProxy_Tick [82403]
000000018061a7d7: mov      r9, rdx
000000018061a7da: mov      ecx, 0x1c
000000018061a7df: mov      rdx, qword ptr [rip + 0x83475ea] ; TypeInfo Torappu.Battle.GameMode.IGameMode @0x188961dd0
000000018061a7e6: mov      r8, r10
000000018061a7e9: jmp      0x180005010
000000018061a7ee: nop      
000000018061a7f0: int3     
000000018061a7f1: cmpsd    dword ptr [rsi], dword ptr [rdi]