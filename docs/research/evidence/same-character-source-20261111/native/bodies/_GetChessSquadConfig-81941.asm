0x180c2c490: mov qword ptr [rsp + 0x20], rbx
0x180c2c495: mov qword ptr [rsp + 8], rcx
0x180c2c49a: push rbp
0x180c2c49b: push rdi
0x180c2c49c: push r12
0x180c2c49e: push r13
0x180c2c4a0: push r15
0x180c2c4a2: lea rbp, [rsp - 0x27]
0x180c2c4a7: sub rsp, 0xd0
0x180c2c4ae: cmp byte ptr [rip + 0x8372164], 0
0x180c2c4b5: mov rdi, r9
0x180c2c4b8: mov r15, r8
0x180c2c4bb: mov r12, rdx
0x180c2c4be: mov rbx, rcx
0x180c2c4c1: jne 0x180c2c59a
0x180c2c4c7: lea rcx, [rip + 0x7f3f6c2]
0x180c2c4ce: call 0x18049c210
0x180c2c4d3: lea rcx, [rip + 0x803f746]
0x180c2c4da: call 0x18049c210
0x180c2c4df: lea rcx, [rip + 0x7fc7592]
0x180c2c4e6: call 0x18049c210
0x180c2c4eb: lea rcx, [rip + 0x7fce60e]
0x180c2c4f2: call 0x18049c210
0x180c2c4f7: lea rcx, [rip + 0x7ef9aaa]
0x180c2c4fe: call 0x18049c210
0x180c2c503: lea rcx, [rip + 0x7eeb326]
0x180c2c50a: call 0x18049c210
0x180c2c50f: lea rcx, [rip + 0x801ce62]
0x180c2c516: call 0x18049c210
0x180c2c51b: lea rcx, [rip + 0x7fb9b5e]
0x180c2c522: call 0x18049c210
0x180c2c527: lea rcx, [rip + 0x7f5d6d2]
0x180c2c52e: call 0x18049c210
0x180c2c533: lea rcx, [rip + 0x7f5cfd6]
0x180c2c53a: call 0x18049c210
0x180c2c53f: lea rcx, [rip + 0x800491a]
0x180c2c546: call 0x18049c210
0x180c2c54b: lea rcx, [rip + 0x7f78bfe]
0x180c2c552: call 0x18049c210
0x180c2c557: lea rcx, [rip + 0x7f7b0aa]
0x180c2c55e: call 0x18049c210
0x180c2c563: lea rcx, [rip + 0x7f4cf86]
0x180c2c56a: call 0x18049c210
0x180c2c56f: lea rcx, [rip + 0x7fbf842]
0x180c2c576: call 0x18049c210
0x180c2c57b: lea rcx, [rip + 0x7fcd21e]
0x180c2c582: call 0x18049c210
0x180c2c587: lea rcx, [rip + 0x7f4bbea]
0x180c2c58e: call 0x18049c210
0x180c2c593: mov byte ptr [rip + 0x837207f], 1
0x180c2c59a: mov rax, qword ptr [rip + 0x803f67f]
0x180c2c5a1: xor r13d, r13d
0x180c2c5a4: mov qword ptr [rbp - 0x21], r13
0x180c2c5a8: xorps xmm0, xmm0
0x180c2c5ab: movdqu xmmword ptr [rbp - 0x31], xmm0
0x180c2c5b0: mov qword ptr [rbp - 0x61], r13
0x180c2c5b4: mov rcx, qword ptr [rax + 0xb8]
0x180c2c5bb: mov rcx, qword ptr [rcx + 0x30]
0x180c2c5bf: test rcx, rcx
0x180c2c5c2: jne 0x180c2cac1
0x180c2c5c8: mov qword ptr [rsp + 0x108], rsi
0x180c2c5d0: mov qword ptr [rsp + 0x110], r14
0x180c2c5d8: movaps xmmword ptr [rsp + 0xc0], xmm6
0x180c2c5e0: movaps xmmword ptr [rsp + 0xb0], xmm7
0x180c2c5e8: xor edx, edx
0x180c2c5ea: mov rcx, r12
0x180c2c5ed: call 0x18601a180 ; System.String.IsNullOrEmpty
0x180c2c5f2: test al, al
0x180c2c5f4: jne 0x180c2cabd
0x180c2c5fa: test rdi, rdi
0x180c2c5fd: je 0x180c2cae3
0x180c2c603: mov rcx, qword ptr [rdi + 0x18]
0x180c2c607: xor edx, edx
0x180c2c609: call 0x18601a180 ; System.String.IsNullOrEmpty
0x180c2c60e: test al, al
0x180c2c610: jne 0x180c2cabd
0x180c2c616: test r15, r15
0x180c2c619: je 0x180c2cae3
0x180c2c61f: movzx r8d, byte ptr [rbp + 0x77]
0x180c2c624: xor r9d, r9d
0x180c2c627: mov edx, dword ptr [r15 + 0x20]
0x180c2c62b: mov rcx, rbx
0x180c2c62e: call 0x180c2caf0 ; Torappu.Battle.AutoChess.AutoChessSquadModel._GetLevelStatus
0x180c2c633: mov r14, rax
0x180c2c636: test rax, rax
0x180c2c639: je 0x180c2cabd
0x180c2c63f: mov rcx, qword ptr [rip + 0x7f78b0a]
0x180c2c646: call 0x18558cf50
0x180c2c64b: test rax, rax
0x180c2c64e: je 0x180c2cae3
0x180c2c654: mov edx, dword ptr [r14 + 0x24]
0x180c2c658: xor r8d, r8d
0x180c2c65b: mov rcx, rax
0x180c2c65e: call 0x182057b80 ; Torappu.FavorDB.GetFavorData
0x180c2c663: mov rcx, qword ptr [rip + 0x7f3f526]
0x180c2c66a: mov rbx, rax
0x180c2c66d: call 0x18046d2f0
0x180c2c672: mov rsi, rax
0x180c2c675: test rax, rax
0x180c2c678: je 0x180c2cae3
0x180c2c67e: xor edx, edx
0x180c2c680: mov rcx, rax
0x180c2c683: call 0x182461050 ; Torappu.CharacterInst..ctor | Torappu.AdvancedCharacterInst..ctor | Torappu.LevelData/PredefinedData/PredefinedInst..ctor | Torappu.LevelData/PredefinedData/PredefinedCard..ctor
0x180c2c688: mov rdx, qword ptr [rdi + 0x18]
0x180c2c68c: lea rcx, [rbp - 0x19]
0x180c2c690: xorps xmm0, xmm0
0x180c2c693: mov qword ptr [rbp - 0x19], rdx
0x180c2c697: movdqu xmmword ptr [rbp - 0x11], xmm0
0x180c2c69c: mov qword ptr [rbp - 1], r13
0x180c2c6a0: call 0x18049bcf0
0x180c2c6a5: mov eax, dword ptr [r14 + 0x18]
0x180c2c6a9: mov dword ptr [rbp - 0xd], eax
0x180c2c6ac: mov eax, dword ptr [rdi + 0x44]
0x180c2c6af: mov dword ptr [rbp - 5], eax
0x180c2c6b2: test rbx, rbx
0x180c2c6b5: je 0x180c2cae3
0x180c2c6bb: mov eax, dword ptr [rbx + 0x18]
0x180c2c6be: lea rcx, [rsi + 0x10]
0x180c2c6c2: mov dword ptr [rbp - 9], eax
0x180c2c6c5: xor edx, edx
0x180c2c6c7: mov eax, dword ptr [r14 + 0x1c]
0x180c2c6cb: movups xmm1, xmmword ptr [rbp - 9]
0x180c2c6cf: mov dword ptr [rbp - 0x11], eax
0x180c2c6d2: movups xmm0, xmmword ptr [rbp - 0x19]
0x180c2c6d6: movups xmmword ptr [rsi + 0x10], xmm0
0x180c2c6da: movups xmmword ptr [rsi + 0x20], xmm1
0x180c2c6de: call 0x18049bcf0
0x180c2c6e3: mov rdx, qword ptr [rdi + 0x20]
0x180c2c6e7: lea rcx, [rsi + 0x40]
0x180c2c6eb: mov qword ptr [rsi + 0x40], rdx
0x180c2c6ef: call 0x18049bcf0
0x180c2c6f4: mov eax, dword ptr [r14 + 0x20]
0x180c2c6f8: lea rcx, [rsi + 0x38]
0x180c2c6fc: mov dword ptr [rsi + 0x34], eax
0x180c2c6ff: mov rdx, qword ptr [rdi + 0x38]
0x180c2c703: mov qword ptr [rsi + 0x38], rdx
0x180c2c707: call 0x18049bcf0
0x180c2c70c: mov eax, dword ptr [rdi + 0x48]
0x180c2c70f: mov dword ptr [rsi + 0x30], eax
0x180c2c712: mov rcx, qword ptr [rip + 0x7fc735f]
0x180c2c719: mov rbx, qword ptr [rdi + 0x38]
0x180c2c71d: cmp dword ptr [rcx + 0xe0], r13d
0x180c2c724: jne 0x180c2c72b
0x180c2c726: call 0x18049c450
0x180c2c72b: xor edx, edx
0x180c2c72d: mov rcx, rbx
0x180c2c730: call 0x182694bd0 ; Torappu.CharacterUtil.IsPlayerCharShowSpIllust
0x180c2c735: mov byte ptr [rsi + 0x60], al
0x180c2c738: xor edx, edx
0x180c2c73a: mov rax, qword ptr [rip + 0x7fbf677]
0x180c2c741: mov rcx, qword ptr [rax + 0xb8]
0x180c2c748: mov rbx, qword ptr [rcx]
0x180c2c74b: mov rcx, qword ptr [rdi + 0x30]
0x180c2c74f: call 0x18601a180 ; System.String.IsNullOrEmpty
0x180c2c754: test al, al
0x180c2c756: je 0x180c2c76d
0x180c2c758: mov rcx, qword ptr [r15 + 0x48]
0x180c2c75c: xor edx, edx
0x180c2c75e: call 0x18601a180 ; System.String.IsNullOrEmpty
0x180c2c763: test al, al
0x180c2c765: jne 0x180c2c771
0x180c2c767: mov rbx, qword ptr [r15 + 0x48]
0x180c2c76b: jmp 0x180c2c771
0x180c2c76d: mov rbx, qword ptr [rdi + 0x30]
0x180c2c771: xor edx, edx
0x180c2c773: mov rcx, rbx
0x180c2c776: call 0x18601a180 ; System.String.IsNullOrEmpty
0x180c2c77b: test al, al
0x180c2c77d: jne 0x180c2c796
0x180c2c77f: cmp dword ptr [r14 + 0x28], r13d
0x180c2c783: jle 0x180c2c796
0x180c2c785: xor r9d, r9d
0x180c2c788: mov r8, rsi
0x180c2c78b: mov rdx, r14
0x180c2c78e: mov rcx, rbx
0x180c2c791: call 0x180c2ba30 ; Torappu.Battle.AutoChess.AutoChessSquadModel._AppendUniequip
0x180c2c796: xor r9d, r9d
0x180c2c799: mov qword ptr [rsp + 0x20], r13
0x180c2c79e: xor r8d, r8d
0x180c2c7a1: xor edx, edx
0x180c2c7a3: mov rcx, rsi
0x180c2c7a6: call 0x180b09f20 ; Torappu.Battle.BattleDataConverter.ConvertToRuntimeCharacterData
0x180c2c7ab: mov rcx, qword ptr [rip + 0x7fce34e]
0x180c2c7b2: mov r13, rax
0x180c2c7b5: call 0x18046d2f0
0x180c2c7ba: mov rbx, rax
0x180c2c7bd: test rax, rax
0x180c2c7c0: je 0x180c2cae3
0x180c2c7c6: xor edx, edx
0x180c2c7c8: mov rcx, rax
0x180c2c7cb: call 0x18051df60 ; BattleTimer.EventOnEntryClick | BattleTimer.EventOnTimerPlayNPause | BattleTimer.EventOnTimerRecord | BattleTimer.EventOnTimerReset
0x180c2c7d0: lea rcx, [rbx + 0x10]
0x180c2c7d4: mov qword ptr [rbx + 0x10], r12
0x180c2c7d8: mov rdx, r12
0x180c2c7db: call 0x18049bcf0
0x180c2c7e0: lea rcx, [rbx + 0x38]
0x180c2c7e4: mov qword ptr [rbx + 0x38], rsi
0x180c2c7e8: mov rdx, rsi
0x180c2c7eb: call 0x18049bcf0
0x180c2c7f0: mov byte ptr [rbx + 0x50], 1
0x180c2c7f4: test r13, r13
0x180c2c7f7: je 0x180c2c7ff
0x180c2c7f9: mov eax, dword ptr [r13 + 0x70]
0x180c2c7fd: jmp 0x180c2c801
0x180c2c7ff: xor eax, eax
0x180c2c801: mov dword ptr [rbx + 0x54], eax
0x180c2c804: mov eax, dword ptr [rdi + 0x40]
0x180c2c807: mov dword ptr [rbx + 0x64], eax
0x180c2c80a: mov rcx, qword ptr [rbx + 0x38]
0x180c2c80e: test rcx, rcx
0x180c2c811: je 0x180c2cae3
0x180c2c817: mov rcx, qword ptr [rcx + 0x38]
0x180c2c81b: xor edx, edx
0x180c2c81d: mov qword ptr [rbp - 0x69], rcx
0x180c2c821: call 0x18601a180 ; System.String.IsNullOrEmpty
0x180c2c826: test al, al
0x180c2c828: je 0x180c2c88b
0x180c2c82a: mov rdx, qword ptr [rbx + 0x38]
0x180c2c82e: test rdx, rdx
0x180c2c831: je 0x180c2cae3
0x180c2c837: xor r8d, r8d
0x180c2c83a: lea rcx, [rbp - 0x59]
0x180c2c83e: call 0x182464a80 ; Torappu.CharacterInst.GetCharQuery
0x180c2c843: movups xmm6, xmmword ptr [rax]
0x180c2c846: movsd xmm7, qword ptr [rax + 0x10]
0x180c2c84b: mov rax, qword ptr [rbx + 0x38]
0x180c2c84f: test rax, rax
0x180c2c852: je 0x180c2cae3
0x180c2c858: mov rcx, qword ptr [rip + 0x7f4cc91]
0x180c2c85f: mov esi, dword ptr [rax + 0x1c]
0x180c2c862: cmp dword ptr [rcx + 0xe0], 0
0x180c2c869: jne 0x180c2c870
0x180c2c86b: call 0x18049c450
0x180c2c870: xor r9d, r9d
0x180c2c873: movaps xmmword ptr [rbp - 0x59], xmm6
0x180c2c877: lea r8, [rbp - 0x69]
0x180c2c87b: movsd qword ptr [rbp - 0x49], xmm7
0x180c2c880: mov edx, esi
0x180c2c882: lea rcx, [rbp - 0x59]
0x180c2c886: call 0x1821577e0 ; Torappu.SkinDB.TryPickBestBuildinSkinId
0x180c2c88b: mov rcx, qword ptr [rip + 0x7f7ad76]
0x180c2c892: call 0x18558cf50
0x180c2c897: test rax, rax
0x180c2c89a: je 0x180c2cae3
0x180c2c8a0: mov rdx, qword ptr [rbp - 0x69]
0x180c2c8a4: lea r8, [rbx + 0x48]
0x180c2c8a8: xor r9d, r9d
0x180c2c8ab: mov rcx, rax
0x180c2c8ae: call 0x182156ce0 ; Torappu.SkinDB.TryGetCharSkin
0x180c2c8b3: cmp qword ptr [rbx + 0x48], 0
0x180c2c8b8: je 0x180c2c929
0x180c2c8ba: mov rcx, qword ptr [rbx + 0x48]
0x180c2c8be: xor r8d, r8d
0x180c2c8c1: mov rdx, qword ptr [rdi + 0x18]
0x180c2c8c5: mov rcx, qword ptr [rcx + 0x18]
0x180c2c8c9: call 0x186020b40 ; System.String.op_Inequality
0x180c2c8ce: test al, al
0x180c2c8d0: je 0x180c2c929
0x180c2c8d2: mov rcx, qword ptr [rip + 0x801ca9f]
0x180c2c8d9: mov rsi, qword ptr [rbp - 0x69]
0x180c2c8dd: mov r13, qword ptr [rdi + 0x18]
0x180c2c8e1: cmp dword ptr [rcx + 0xe0], 0
0x180c2c8e8: jne 0x180c2c8ef
0x180c2c8ea: call 0x18049c450
0x180c2c8ef: mov rcx, qword ptr [rip + 0x7fcceaa]
0x180c2c8f6: xor r9d, r9d
0x180c2c8f9: mov r8, r13
0x180c2c8fc: mov rdx, rsi
0x180c2c8ff: call 0x186983c90 ; Torappu.HGString.Format
0x180c2c904: mov rcx, qword ptr [rip + 0x7eeaf25]
0x180c2c90b: mov rsi, rax
0x180c2c90e: cmp dword ptr [rcx + 0xe0], 0
0x180c2c915: jne 0x180c2c91c
0x180c2c917: call 0x18049c450
0x180c2c91c: xor r8d, r8d
0x180c2c91f: mov rdx, rsi
0x180c2c922: mov cl, 0x41
0x180c2c924: call 0x18693d9b0 ; UnityEngine.DLog.LogError
0x180c2c929: mov rcx, qword ptr [rdi + 0x28]
0x180c2c92d: xor edx, edx
0x180c2c92f: call 0x18601a180 ; System.String.IsNullOrEmpty
0x180c2c934: test al, al
0x180c2c936: jne 0x180c2c949
0x180c2c938: mov rdx, qword ptr [rdi + 0x28]
0x180c2c93c: lea rcx, [rbx + 0x40]
0x180c2c940: mov qword ptr [rbx + 0x40], rdx
0x180c2c944: call 0x18049bcf0
0x180c2c949: mov rdx, qword ptr [rdi + 0x18]
0x180c2c94d: lea rcx, [rbp - 0x39]
0x180c2c951: xorps xmm0, xmm0
0x180c2c954: mov qword ptr [rbp - 0x39], rdx
0x180c2c958: xor esi, esi
0x180c2c95a: movdqu xmmword ptr [rbp - 0x31], xmm0
0x180c2c95f: mov qword ptr [rbp - 0x21], rsi
0x180c2c963: call 0x18049bcf0
0x180c2c968: movzx eax, byte ptr [rbp + 0x77]
0x180c2c96c: lea rcx, [rbx + 0x18]
0x180c2c970: mov byte ptr [rbp - 0x31], al
0x180c2c973: xor edx, edx
0x180c2c975: mov eax, dword ptr [r15 + 0x20]
0x180c2c979: mov dword ptr [rbp - 0x2d], esi
0x180c2c97c: movups xmm0, xmmword ptr [rbp - 0x39]
0x180c2c980: mov dword ptr [rbp - 0x29], eax
0x180c2c983: movups xmm1, xmmword ptr [rbp - 0x29]
0x180c2c987: movups xmmword ptr [rbx + 0x18], xmm0
0x180c2c98b: movups xmmword ptr [rbx + 0x28], xmm1
0x180c2c98f: call 0x18049bcf0
0x180c2c994: mov rdx, qword ptr [rip + 0x7ef960d]
0x180c2c99b: mov rcx, qword ptr [rdi + 0x50]
0x180c2c99f: call 0x184696030
0x180c2c9a4: test al, al
0x180c2c9a6: je 0x180c2ca2d
0x180c2c9ac: mov rax, qword ptr [rbp + 0x57]
0x180c2c9b0: mov rax, qword ptr [rax + 0x10]
0x180c2c9b4: test rax, rax
0x180c2c9b7: je 0x180c2cae3
0x180c2c9bd: mov rcx, qword ptr [rax + 0xe8]
0x180c2c9c4: test rcx, rcx
0x180c2c9c7: je 0x180c2cae3
0x180c2c9cd: mov r9, qword ptr [rip + 0x7fb96ac]
0x180c2c9d4: lea r8, [rbp - 0x61]
0x180c2c9d8: mov rdx, r12
0x180c2c9db: call 0x184cc65f0
0x180c2c9e0: test al, al
0x180c2c9e2: jne 0x180c2ca1a
0x180c2c9e4: cmp qword ptr [rbx + 0x30], rsi
0x180c2c9e8: jne 0x180c2ca3e
0x180c2c9ea: mov rcx, qword ptr [rip + 0x800446f]
0x180c2c9f1: call 0x18046d2f0
0x180c2c9f6: mov rdi, rax
0x180c2c9f9: test rax, rax
0x180c2c9fc: je 0x180c2cae3
0x180c2ca02: mov rdx, qword ptr [rip + 0x7f5cb07]
0x180c2ca09: mov rcx, rax
0x180c2ca0c: call 0x184b06b30
0x180c2ca11: mov rdx, rdi
0x180c2ca14: mov qword ptr [rbx + 0x30], rdi
0x180c2ca18: jmp 0x180c2ca35
0x180c2ca1a: mov rdx, qword ptr [rbp - 0x61]
0x180c2ca1e: test rdx, rdx
0x180c2ca21: je 0x180c2cae3
0x180c2ca27: mov rdx, qword ptr [rdx + 0x40]
0x180c2ca2b: jmp 0x180c2ca31
0x180c2ca2d: mov rdx, qword ptr [rdi + 0x50]
0x180c2ca31: mov qword ptr [rbx + 0x30], rdx
0x180c2ca35: lea rcx, [rbx + 0x30]
0x180c2ca39: call 0x18049bcf0
0x180c2ca3e: mov rdx, qword ptr [rip + 0x7ef9563]
0x180c2ca45: mov rcx, qword ptr [rbx + 0x30]
0x180c2ca49: call 0x184696030
0x180c2ca4e: test al, al
0x180c2ca50: je 0x180c2ca72
0x180c2ca52: mov rcx, qword ptr [rbx + 0x30]
0x180c2ca56: test rcx, rcx
0x180c2ca59: je 0x180c2cae3
0x180c2ca5f: mov r8, qword ptr [rip + 0x7f5d19a]
0x180c2ca66: mov rdx, qword ptr [rip + 0x7f4b70b]
0x180c2ca6d: call 0x1805182d0
0x180c2ca72: lea rcx, [rbx + 0x58]
0x180c2ca76: mov qword ptr [rbx + 0x58], r14
0x180c2ca7a: mov rdx, r14
0x180c2ca7d: call 0x18049bcf0
0x180c2ca82: mov rax, rbx
0x180c2ca85: movaps xmm6, xmmword ptr [rsp + 0xc0]
0x180c2ca8d: mov r14, qword ptr [rsp + 0x110]
0x180c2ca95: mov rsi, qword ptr [rsp + 0x108]
0x180c2ca9d: movaps xmm7, xmmword ptr [rsp + 0xb0]
0x180c2caa5: mov rbx, qword ptr [rsp + 0x118]
0x180c2caad: add rsp, 0xd0
0x180c2cab4: pop r15
0x180c2cab6: pop r13
0x180c2cab8: pop r12
0x180c2caba: pop rdi
0x180c2cabb: pop rbp
0x180c2cabc: ret
0x180c2cabd: xor eax, eax
0x180c2cabf: jmp 0x180c2ca85
0x180c2cac1: movzx eax, byte ptr [rbp + 0x77]
0x180c2cac5: mov r9, r15
0x180c2cac8: mov qword ptr [rsp + 0x30], r13
0x180c2cacd: mov r8, r12
0x180c2cad0: mov byte ptr [rsp + 0x28], al
0x180c2cad4: mov rdx, rbx
0x180c2cad7: mov qword ptr [rsp + 0x20], rdi
0x180c2cadc: call 0x183491130 ; XLua.DelegateBridge.__Gen_Delegate_Imp4064
0x180c2cae1: jmp 0x180c2caa5
0x180c2cae3: call 0x18049c3c0
0x180c2cae8: int3
0x180c2cae9: int3
0x180c2caea: int3
0x180c2caeb: int3
0x180c2caec: int3
0x180c2caed: int3
0x180c2caee: int3
0x180c2caef: int3
