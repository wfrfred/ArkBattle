0x180b2bf50: mov qword ptr [rsp + 0x10], rbx
0x180b2bf55: mov qword ptr [rsp + 8], rcx
0x180b2bf5a: push rsi
0x180b2bf5b: push rdi
0x180b2bf5c: push r14
0x180b2bf5e: sub rsp, 0x60
0x180b2bf62: mov rsi, rcx
0x180b2bf65: cmp byte ptr [rip + 0x8471ddc], 0
0x180b2bf6c: jne 0x180b2bffd
0x180b2bf72: lea rcx, [rip + 0x80ef1c7]
0x180b2bf79: call 0x18049c210
0x180b2bf7e: lea rcx, [rip + 0x7fe339b]
0x180b2bf85: call 0x18049c210
0x180b2bf8a: lea rcx, [rip + 0x7ffa25f]
0x180b2bf91: call 0x18049c210
0x180b2bf96: lea rcx, [rip + 0x7ff9543]
0x180b2bf9d: call 0x18049c210
0x180b2bfa2: lea rcx, [rip + 0x7ff977f]
0x180b2bfa9: call 0x18049c210
0x180b2bfae: lea rcx, [rip + 0x7ff99bb]
0x180b2bfb5: call 0x18049c210
0x180b2bfba: lea rcx, [rip + 0x807784f]
0x180b2bfc1: call 0x18049c210
0x180b2bfc6: lea rcx, [rip + 0x8077f23]
0x180b2bfcd: call 0x18049c210
0x180b2bfd2: lea rcx, [rip + 0x807739f]
0x180b2bfd9: call 0x18049c210
0x180b2bfde: lea rcx, [rip + 0x8109503]
0x180b2bfe5: call 0x18049c210
0x180b2bfea: lea rcx, [rip + 0x7fd48f7]
0x180b2bff1: call 0x18049c210
0x180b2bff6: mov byte ptr [rip + 0x8471d4b], 1
0x180b2bffd: xorps xmm0, xmm0
0x180b2c000: xor eax, eax
0x180b2c002: movups xmmword ptr [rsp + 0x40], xmm0
0x180b2c007: mov qword ptr [rsp + 0x50], rax
0x180b2c00c: mov rcx, qword ptr [rip + 0x7fe330d]
0x180b2c013: call 0x18046d2f0
0x180b2c018: mov rdi, rax
0x180b2c01b: test rax, rax
0x180b2c01e: je 0x180b2c4ea
0x180b2c024: xor edx, edx
0x180b2c026: mov rcx, rax
0x180b2c029: call 0x180b2c8c0 ; Torappu.Battle.BattleCharacterData..ctor
0x180b2c02e: mov rdx, qword ptr [rsi + 0x18]
0x180b2c032: mov qword ptr [rdi + 0x18], rdx
0x180b2c036: lea rcx, [rdi + 0x18]
0x180b2c03a: call 0x18049bcf0
0x180b2c03f: movups xmm0, xmmword ptr [rsi + 0xa8]
0x180b2c046: movups xmm1, xmmword ptr [rsi + 0xb8]
0x180b2c04d: movups xmm2, xmmword ptr [rsi + 0xc8]
0x180b2c054: movups xmm3, xmmword ptr [rsi + 0xd8]
0x180b2c05b: movups xmm4, xmmword ptr [rsi + 0xe8]
0x180b2c062: movups xmm5, xmmword ptr [rsi + 0xf8]
0x180b2c069: movups xmmword ptr [rdi + 0xa8], xmm0
0x180b2c070: movups xmmword ptr [rdi + 0xb8], xmm1
0x180b2c077: movups xmmword ptr [rdi + 0xc8], xmm2
0x180b2c07e: movups xmmword ptr [rdi + 0xd8], xmm3
0x180b2c085: movups xmmword ptr [rdi + 0xe8], xmm4
0x180b2c08c: movups xmmword ptr [rdi + 0xf8], xmm5
0x180b2c093: lea rcx, [rdi + 0xb8]
0x180b2c09a: xor edx, edx
0x180b2c09c: call 0x18049bcf0
0x180b2c0a1: mov eax, dword ptr [rsi + 0x84]
0x180b2c0a7: mov dword ptr [rdi + 0x84], eax
0x180b2c0ad: mov eax, dword ptr [rsi + 0x44]
0x180b2c0b0: mov dword ptr [rdi + 0x44], eax
0x180b2c0b3: mov eax, dword ptr [rsi + 0x4c]
0x180b2c0b6: mov dword ptr [rdi + 0x4c], eax
0x180b2c0b9: mov rdx, qword ptr [rsi + 0x148]
0x180b2c0c0: mov qword ptr [rdi + 0x148], rdx
0x180b2c0c7: lea rcx, [rdi + 0x148]
0x180b2c0ce: call 0x18049bcf0
0x180b2c0d3: mov rdx, qword ptr [rsi + 0x10]
0x180b2c0d7: mov qword ptr [rdi + 0x10], rdx
0x180b2c0db: lea rcx, [rdi + 0x10]
0x180b2c0df: call 0x18049bcf0
0x180b2c0e4: movzx eax, byte ptr [rsi + 0x93]
0x180b2c0eb: mov byte ptr [rdi + 0x93], al
0x180b2c0f1: movzx eax, byte ptr [rsi + 0x92]
0x180b2c0f8: mov byte ptr [rdi + 0x92], al
0x180b2c0fe: movzx eax, byte ptr [rsi + 0x91]
0x180b2c105: mov byte ptr [rdi + 0x91], al
0x180b2c10b: movzx eax, byte ptr [rsi + 0x90]
0x180b2c112: mov byte ptr [rdi + 0x90], al
0x180b2c118: mov eax, dword ptr [rsi + 0x40]
0x180b2c11b: mov dword ptr [rdi + 0x40], eax
0x180b2c11e: mov eax, dword ptr [rsi + 0x70]
0x180b2c121: mov dword ptr [rdi + 0x70], eax
0x180b2c124: mov eax, dword ptr [rsi + 0x48]
0x180b2c127: mov dword ptr [rdi + 0x48], eax
0x180b2c12a: mov rdx, qword ptr [rsi + 0x50]
0x180b2c12e: mov qword ptr [rdi + 0x50], rdx
0x180b2c132: lea rcx, [rdi + 0x50]
0x180b2c136: call 0x18049bcf0
0x180b2c13b: mov rdx, qword ptr [rsi + 0x58]
0x180b2c13f: mov qword ptr [rdi + 0x58], rdx
0x180b2c143: lea rcx, [rdi + 0x58]
0x180b2c147: call 0x18049bcf0
0x180b2c14c: mov rdx, qword ptr [rsi + 0x60]
0x180b2c150: mov qword ptr [rdi + 0x60], rdx
0x180b2c154: lea rcx, [rdi + 0x60]
0x180b2c158: call 0x18049bcf0
0x180b2c15d: movzx eax, byte ptr [rsi + 0x68]
0x180b2c161: mov byte ptr [rdi + 0x68], al
0x180b2c164: mov eax, dword ptr [rsi + 0x6c]
0x180b2c167: mov dword ptr [rdi + 0x6c], eax
0x180b2c16a: mov rdx, qword ptr [rsi + 0x78]
0x180b2c16e: mov qword ptr [rdi + 0x78], rdx
0x180b2c172: lea rcx, [rdi + 0x78]
0x180b2c176: call 0x18049bcf0
0x180b2c17b: mov eax, dword ptr [rsi + 0x80]
0x180b2c181: mov dword ptr [rdi + 0x80], eax
0x180b2c187: mov rdx, qword ptr [rsi + 0x88]
0x180b2c18e: mov qword ptr [rdi + 0x88], rdx
0x180b2c195: lea rcx, [rdi + 0x88]
0x180b2c19c: call 0x18049bcf0
0x180b2c1a1: mov rdx, qword ptr [rsi + 0x98]
0x180b2c1a8: mov qword ptr [rdi + 0x98], rdx
0x180b2c1af: lea rcx, [rdi + 0x98]
0x180b2c1b6: call 0x18049bcf0
0x180b2c1bb: mov eax, dword ptr [rsi + 0xa0]
0x180b2c1c1: mov dword ptr [rdi + 0xa0], eax
0x180b2c1c7: mov eax, dword ptr [rsi + 0xa4]
0x180b2c1cd: mov dword ptr [rdi + 0xa4], eax
0x180b2c1d3: mov eax, dword ptr [rsi + 0x108]
0x180b2c1d9: mov dword ptr [rdi + 0x108], eax
0x180b2c1df: mov rdx, qword ptr [rsi + 0x128]
0x180b2c1e6: mov qword ptr [rdi + 0x128], rdx
0x180b2c1ed: lea rcx, [rdi + 0x128]
0x180b2c1f4: call 0x18049bcf0
0x180b2c1f9: mov rdx, qword ptr [rsi + 0x130]
0x180b2c200: mov qword ptr [rdi + 0x130], rdx
0x180b2c207: lea rcx, [rdi + 0x130]
0x180b2c20e: call 0x18049bcf0
0x180b2c213: mov rdx, qword ptr [rsi + 0x138]
0x180b2c21a: mov qword ptr [rdi + 0x138], rdx
0x180b2c221: lea rcx, [rdi + 0x138]
0x180b2c228: call 0x18049bcf0
0x180b2c22d: mov rdx, qword ptr [rsi + 0x140]
0x180b2c234: mov qword ptr [rdi + 0x140], rdx
0x180b2c23b: lea rcx, [rdi + 0x140]
0x180b2c242: call 0x18049bcf0
0x180b2c247: mov rdx, qword ptr [rsi + 0x150]
0x180b2c24e: mov qword ptr [rdi + 0x150], rdx
0x180b2c255: lea rcx, [rdi + 0x150]
0x180b2c25c: call 0x18049bcf0
0x180b2c261: mov rdx, qword ptr [rsi + 0x20]
0x180b2c265: mov qword ptr [rdi + 0x20], rdx
0x180b2c269: lea rcx, [rdi + 0x20]
0x180b2c26d: call 0x18049bcf0
0x180b2c272: mov rdx, qword ptr [rsi + 0x28]
0x180b2c276: mov qword ptr [rdi + 0x28], rdx
0x180b2c27a: lea rcx, [rdi + 0x28]
0x180b2c27e: call 0x18049bcf0
0x180b2c283: mov rdx, qword ptr [rsi + 0x30]
0x180b2c287: mov qword ptr [rdi + 0x30], rdx
0x180b2c28b: lea rcx, [rdi + 0x30]
0x180b2c28f: call 0x18049bcf0
0x180b2c294: mov qword ptr [rsp + 0x90], rdi
0x180b2c29c: mov rcx, qword ptr [rip + 0x80eee9d]
0x180b2c2a3: call 0x18046d2f0
0x180b2c2a8: mov rbx, rax
0x180b2c2ab: test rax, rax
0x180b2c2ae: je 0x180b2c4ea
0x180b2c2b4: xor edx, edx
0x180b2c2b6: mov rcx, rax
0x180b2c2b9: call 0x1823749b0 ; Torappu.AttributesData..ctor
0x180b2c2be: mov qword ptr [rdi + 0x38], rbx
0x180b2c2c2: lea rcx, [rdi + 0x38]
0x180b2c2c6: mov rdx, rbx
0x180b2c2c9: call 0x18049bcf0
0x180b2c2ce: mov rcx, qword ptr [rdi + 0x38]
0x180b2c2d2: test rcx, rcx
0x180b2c2d5: je 0x180b2c4ea
0x180b2c2db: xor r8d, r8d
0x180b2c2de: mov rdx, qword ptr [rsi + 0x38]
0x180b2c2e2: call 0x182373700 ; Torappu.AttributesData.Assign
0x180b2c2e7: mov rdx, qword ptr [rip + 0x7ff9f02]
0x180b2c2ee: mov rcx, qword ptr [rsi + 0x118]
0x180b2c2f5: call 0x184696030
0x180b2c2fa: test al, al
0x180b2c2fc: jne 0x180b2c41e
0x180b2c302: mov rcx, qword ptr [rip + 0x81091df]
0x180b2c309: call 0x18046d2f0
0x180b2c30e: mov rbx, rax
0x180b2c311: test rax, rax
0x180b2c314: je 0x180b2c4ea
0x180b2c31a: mov rdx, qword ptr [rip + 0x8077057]
0x180b2c321: mov rcx, rax
0x180b2c324: call 0x184b06b30
0x180b2c329: mov qword ptr [rdi + 0x118], rbx
0x180b2c330: lea rcx, [rdi + 0x118]
0x180b2c337: mov rdx, rbx
0x180b2c33a: call 0x18049bcf0
0x180b2c33f: mov rdx, qword ptr [rsi + 0x118]
0x180b2c346: test rdx, rdx
0x180b2c349: je 0x180b2c4ea
0x180b2c34f: mov r8, qword ptr [rip + 0x8077b9a]
0x180b2c356: lea rcx, [rsp + 0x28]
0x180b2c35b: call 0x184d19f20
0x180b2c360: movups xmm0, xmmword ptr [rsp + 0x28]
0x180b2c365: movups xmmword ptr [rsp + 0x40], xmm0
0x180b2c36a: movsd xmm1, qword ptr [rsp + 0x38]
0x180b2c370: movsd qword ptr [rsp + 0x50], xmm1
0x180b2c376: mov qword ptr [rsp + 0x28], 0
0x180b2c37f: lea rbx, [rsp + 0x40]
0x180b2c384: mov qword ptr [rsp + 0x30], rbx
0x180b2c389: nop dword ptr [rax]
0x180b2c390: mov rdx, qword ptr [rip + 0x7ff9391]
0x180b2c397: lea rcx, [rsp + 0x40]
0x180b2c39c: call 0x185cc82d0
0x180b2c3a1: test al, al
0x180b2c3a3: je 0x180b2c3de
0x180b2c3a5: mov rcx, qword ptr [rsp + 0x50]
0x180b2c3aa: mov r14, qword ptr [rdi + 0x118]
0x180b2c3b1: test rcx, rcx
0x180b2c3b4: je 0x180b2c4f6
0x180b2c3ba: xor edx, edx
0x180b2c3bc: call 0x1826a6cd0 ; Torappu.TalentData.Duplicate
0x180b2c3c1: test r14, r14
0x180b2c3c4: je 0x180b2c4f0
0x180b2c3ca: mov r8, qword ptr [rip + 0x807743f]
0x180b2c3d1: mov rdx, rax
0x180b2c3d4: mov rcx, r14
0x180b2c3d7: call 0x1805182d0
0x180b2c3dc: jmp 0x180b2c390
0x180b2c3de: mov rdx, qword ptr [rip + 0x7ff90fb]
0x180b2c3e5: mov rcx, rbx
0x180b2c3e8: call 0x18051df60 ; BattleTimer.EventOnEntryClick | BattleTimer.EventOnTimerPlayNPause | BattleTimer.EventOnTimerRecord | BattleTimer.EventOnTimerReset
0x180b2c3ed: jmp 0x180b2c41e
0x180b2c3ef: mov rdx, qword ptr [rip + 0x7ff90ea]
0x180b2c3f6: mov rcx, qword ptr [rsp + 0x30]
0x180b2c3fb: call 0x18051df60 ; BattleTimer.EventOnEntryClick | BattleTimer.EventOnTimerPlayNPause | BattleTimer.EventOnTimerRecord | BattleTimer.EventOnTimerReset
0x180b2c400: mov rcx, qword ptr [rsp + 0x28]
0x180b2c405: test rcx, rcx
0x180b2c408: jne 0x180b2c4fc
0x180b2c40e: mov rsi, qword ptr [rsp + 0x80]
0x180b2c416: mov rdi, qword ptr [rsp + 0x90]
0x180b2c41e: cmp qword ptr [rsi + 0x110], 0
0x180b2c426: je 0x180b2c44c
0x180b2c428: xor edx, edx
0x180b2c42a: mov rcx, qword ptr [rsi + 0x110]
0x180b2c431: call 0x18257a280 ; Torappu.SkillData.Duplicate
0x180b2c436: mov qword ptr [rdi + 0x110], rax
0x180b2c43d: lea rcx, [rdi + 0x110]
0x180b2c444: mov rdx, rax
0x180b2c447: call 0x18049bcf0
0x180b2c44c: cmp qword ptr [rsi + 0x120], 0
0x180b2c454: je 0x180b2c47a
0x180b2c456: xor edx, edx
0x180b2c458: mov rcx, qword ptr [rsi + 0x120]
0x180b2c45f: call 0x182479c30 ; Torappu.CharacterData/TraitData.Duplicate
0x180b2c464: mov qword ptr [rdi + 0x120], rax
0x180b2c46b: lea rcx, [rdi + 0x120]
0x180b2c472: mov rdx, rax
0x180b2c475: call 0x18049bcf0
0x180b2c47a: cmp qword ptr [rsi + 0x158], 0
0x180b2c482: je 0x180b2c4d6
0x180b2c484: mov rdx, qword ptr [rsi + 0x158]
0x180b2c48b: mov edx, dword ptr [rdx + 0x18]
0x180b2c48e: mov rcx, qword ptr [rip + 0x7fd4453]
0x180b2c495: call 0x18049bd60
0x180b2c49a: mov qword ptr [rdi + 0x158], rax
0x180b2c4a1: lea rcx, [rdi + 0x158]
0x180b2c4a8: mov rdx, rax
0x180b2c4ab: call 0x18049bcf0
0x180b2c4b0: mov r8, qword ptr [rsi + 0x158]
0x180b2c4b7: test r8, r8
0x180b2c4ba: je 0x180b2c4ea
0x180b2c4bc: xor r9d, r9d
0x180b2c4bf: mov r8d, dword ptr [r8 + 0x18]
0x180b2c4c3: mov rdx, qword ptr [rdi + 0x158]
0x180b2c4ca: mov rcx, qword ptr [rsi + 0x158]
0x180b2c4d1: call 0x18614a400 ; System.Array.Copy
0x180b2c4d6: mov rax, rdi
0x180b2c4d9: mov rbx, qword ptr [rsp + 0x88]
0x180b2c4e1: add rsp, 0x60
0x180b2c4e5: pop r14
0x180b2c4e7: pop rdi
0x180b2c4e8: pop rsi
0x180b2c4e9: ret
0x180b2c4ea: call 0x18049c3c0
0x180b2c4ef: nop
0x180b2c4f0: call 0x18049c3c0
0x180b2c4f5: nop
0x180b2c4f6: call 0x18049c3c0
0x180b2c4fb: nop
0x180b2c4fc: call 0x180483060
0x180b2c501: int3
0x180b2c502: int3
0x180b2c503: int3
0x180b2c504: int3
0x180b2c505: int3
0x180b2c506: int3
0x180b2c507: int3
0x180b2c508: int3
0x180b2c509: int3
0x180b2c50a: int3
0x180b2c50b: int3
0x180b2c50c: int3
0x180b2c50d: int3
0x180b2c50e: int3
0x180b2c50f: int3
