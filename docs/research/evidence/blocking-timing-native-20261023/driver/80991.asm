; Torappu.Battle.GameMode.GameModeFactory.AutoChessGameMode.Tick metadata=80991 token=0x6013c60 VA=0x180bde140 RVA=0xbde140 size=0xe0
0000000180bde140: mov      qword ptr [rsp + 8], rbx
0000000180bde145: push     rdi
0000000180bde146: sub      rsp, 0x20
0000000180bde14a: cmp      byte ptr [rip + 0x80b553c], 0
0000000180bde151: mov      rbx, rdx
0000000180bde154: mov      rdi, rcx
0000000180bde157: jne      0x180bde184
0000000180bde159: lea      rcx, [rip + 0x7cca2c8] ; TypeInfo Torappu.Battle.GameMode.GameModeFactory.AutoChessGameMode @0x1888a8428
0000000180bde160: call     0x18048bf00
0000000180bde165: lea      rcx, [rip + 0x7d1ab7c] ; GenericMethodInfo 282237 @0x1888f8ce8
0000000180bde16c: call     0x18048bf00
0000000180bde171: lea      rcx, [rip + 0x7ce8600] ; TypeInfo type(0x15, data=0x188b8a1b0) @0x1888c6778
0000000180bde178: call     0x18048bf00
0000000180bde17d: mov      byte ptr [rip + 0x80b5509], 1
0000000180bde184: mov      rax, qword ptr [rip + 0x7cca29d] ; TypeInfo Torappu.Battle.GameMode.GameModeFactory.AutoChessGameMode @0x1888a8428
0000000180bde18b: cmp      dword ptr [rax + 0xe0], 0
0000000180bde192: jne      0x180bde1a3
0000000180bde194: mov      rcx, rax
0000000180bde197: call     0x18048c140
0000000180bde19c: mov      rax, qword ptr [rip + 0x7cca285] ; TypeInfo Torappu.Battle.GameMode.GameModeFactory.AutoChessGameMode @0x1888a8428
0000000180bde1a3: mov      rax, qword ptr [rax + 0xb8]
0000000180bde1aa: mov      rcx, qword ptr [rax + 0xa0]
0000000180bde1b1: test     rcx, rcx
0000000180bde1b4: jne      0x180bde1f4
0000000180bde1b6: mov      rcx, qword ptr [rip + 0x7ce85bb] ; TypeInfo type(0x15, data=0x188b8a1b0) @0x1888c6778
0000000180bde1bd: cmp      dword ptr [rcx + 0xe0], 0
0000000180bde1c4: jne      0x180bde1cb
0000000180bde1c6: call     0x18048c140
0000000180bde1cb: mov      rcx, qword ptr [rip + 0x7d1ab16] ; GenericMethodInfo 282237 @0x1888f8ce8
0000000180bde1d2: call     0x185338d50
0000000180bde1d7: test     rax, rax
0000000180bde1da: je       0x180bde20c
0000000180bde1dc: xor      r8d, r8d
0000000180bde1df: mov      rdx, rbx
0000000180bde1e2: mov      rcx, rax
0000000180bde1e5: mov      rbx, qword ptr [rsp + 0x30]
0000000180bde1ea: add      rsp, 0x20
0000000180bde1ee: pop      rdi
0000000180bde1ef: jmp      0x180b41590 ; Torappu.Battle.AutoChess.AutoChessGameManager.OnTick [79505]
0000000180bde1f4: xor      r9d, r9d
0000000180bde1f7: mov      r8, rbx
0000000180bde1fa: mov      rdx, rdi
0000000180bde1fd: mov      rbx, qword ptr [rsp + 0x30]
0000000180bde202: add      rsp, 0x20
0000000180bde206: pop      rdi
0000000180bde207: jmp      0x1832d2220 ; XLua.DelegateBridge.__Gen_Delegate_Imp23 [2678]
0000000180bde20c: call     0x18048c0b0
0000000180bde211: int3     
0000000180bde212: int3     
0000000180bde213: int3     
0000000180bde214: int3     
0000000180bde215: int3     
0000000180bde216: int3     
0000000180bde217: int3     
0000000180bde218: int3     
0000000180bde219: int3     
0000000180bde21a: int3     
0000000180bde21b: int3     
0000000180bde21c: int3     
0000000180bde21d: int3     
0000000180bde21e: int3     
0000000180bde21f: int3     