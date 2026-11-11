0x18066c050: push rbp
0x18066c052: push rsi
0x18066c053: push rdi
0x18066c054: push r12
0x18066c056: sub rsp, 0x98
0x18066c05d: cmp byte ptr [rip + 0x892f011], 0
0x18066c064: mov r12, r9
0x18066c067: movzx edi, r8b
0x18066c06b: mov rbp, rdx
0x18066c06e: mov rsi, rcx
0x18066c071: jne 0x18066c09e
0x18066c073: lea rcx, [rip + 0x84fd866]
0x18066c07a: call 0x18049c210
0x18066c07f: lea rcx, [rip + 0x84a3bba]
0x18066c086: call 0x18049c210
0x18066c08b: lea rcx, [rip + 0x851691e]
0x18066c092: call 0x18049c210
0x18066c097: mov byte ptr [rip + 0x892efd7], 1
0x18066c09e: mov rax, qword ptr [rip + 0x84a3b9b]
0x18066c0a5: xorps xmm0, xmm0
0x18066c0a8: movups xmmword ptr [rsp + 0x30], xmm0
0x18066c0ad: cmp dword ptr [rax + 0xe0], 0
0x18066c0b4: jne 0x18066c0c5
0x18066c0b6: mov rcx, rax
0x18066c0b9: call 0x18049c450
0x18066c0be: mov rax, qword ptr [rip + 0x84a3b7b]
0x18066c0c5: mov rax, qword ptr [rax + 0xb8]
0x18066c0cc: mov qword ptr [rsp + 0xc0], rbx
0x18066c0d4: mov rcx, qword ptr [rax + 0xb88]
0x18066c0db: test rcx, rcx
0x18066c0de: jne 0x18066c544
0x18066c0e4: mov qword ptr [rsp + 0xc8], r13
0x18066c0ec: mov qword ptr [rsp + 0xd0], r14
0x18066c0f4: mov qword ptr [rsp + 0x90], r15
0x18066c0fc: movaps xmmword ptr [rsp + 0x80], xmm6
0x18066c104: movaps xmmword ptr [rsp + 0x70], xmm7
0x18066c109: mov rcx, qword ptr [rsi + 0x100]
0x18066c110: test rcx, rcx
0x18066c113: je 0x18066c561
0x18066c119: xor r8d, r8d
0x18066c11c: mov edx, 2
0x18066c121: call 0x180d7dad0 ; Torappu.Battle.Runes.RuneManager.ContainsAnyRune
0x18066c126: mov r8, qword ptr [rsi + 0x178]
0x18066c12d: movzx r15d, al
0x18066c131: test r8, r8
0x18066c134: je 0x18066c561
0x18066c13a: mov rcx, qword ptr [r8]
0x18066c13d: lea r13, [rip - 0x66c144]
0x18066c144: mov edx, dword ptr [rcx + 0x11c]
0x18066c14a: add edx, 0xfffff625
0x18066c150: cmp edx, 0x1a
0x18066c153: ja 0x18066c186
0x18066c155: movsxd rdx, edx
0x18066c158: movzx eax, byte ptr [rdx + r13 + 0x66c570]
0x18066c161: mov edx, dword ptr [r13 + rax*4 + 0x66c568]
0x18066c169: add rdx, r13
0x18066c16c: jmp rdx
0x18066c16e: xor edx, edx
0x18066c170: mov rcx, r8
0x18066c173: call 0x180c9d9e0 ; Torappu.Battle.GameMode.GameModeFactory/DefaultGameMode.NeedPreprocessPredefinedCharacter
0x18066c178: jmp 0x18066c197
0x18066c17a: xor edx, edx
0x18066c17c: mov rcx, r8
0x18066c17f: call 0x180cf8350 ; Torappu.Battle.GameMode.GameModeFactory/RoguelikeGameMode.NeedPreprocessPredefinedCharacter
0x18066c184: jmp 0x18066c197
0x18066c186: mov rdx, qword ptr [rip + 0x84e0c5b]
0x18066c18d: mov ecx, 0x38
0x18066c192: call 0x180005310
0x18066c197: movzx r14d, al
0x18066c19b: mov byte ptr [r12], 0
0x18066c1a0: or al, r15b
0x18066c1a3: je 0x18066c4eb
0x18066c1a9: mov rax, qword ptr [rip + 0x84fd730]
0x18066c1b0: test dil, dil
0x18066c1b3: je 0x18066c24f
0x18066c1b9: cmp dword ptr [rax + 0xe0], 0
0x18066c1c0: jne 0x18066c1d1
0x18066c1c2: mov rcx, rax
0x18066c1c5: call 0x18049c450
0x18066c1ca: mov rax, qword ptr [rip + 0x84fd70f]
0x18066c1d1: cmp byte ptr [rip + 0x892ee53], 0
0x18066c1d8: mov rax, qword ptr [rax + 0xb8]
0x18066c1df: movups xmm6, xmmword ptr [rax]
0x18066c1e2: movsd xmm7, qword ptr [rax + 0x10]
0x18066c1e7: jne 0x18066c1fc
0x18066c1e9: lea rcx, [rip + 0x84a3a50]
0x18066c1f0: call 0x18049c210
0x18066c1f5: mov byte ptr [rip + 0x892ee2f], 1
0x18066c1fc: mov rax, qword ptr [rip + 0x84a3a3d]
0x18066c203: cmp dword ptr [rax + 0xe0], 0
0x18066c20a: jne 0x18066c21b
0x18066c20c: mov rcx, rax
0x18066c20f: call 0x18049c450
0x18066c214: mov rax, qword ptr [rip + 0x84a3a25]
0x18066c21b: mov rax, qword ptr [rax + 0xb8]
0x18066c222: mov rcx, qword ptr [rax + 0x938]
0x18066c229: test rcx, rcx
0x18066c22c: jne 0x18066c317
0x18066c232: mov rcx, qword ptr [rsi + 0x38]
0x18066c236: test rcx, rcx
0x18066c239: je 0x18066c561
0x18066c23f: xor r8d, r8d
0x18066c242: mov rdx, rbp
0x18066c245: call 0x180926d50 ; Torappu.Battle.BattleFactory.CreateToken
0x18066c24a: jmp 0x18066c2dd
0x18066c24f: cmp dword ptr [rax + 0xe0], 0
0x18066c256: jne 0x18066c267
0x18066c258: mov rcx, rax
0x18066c25b: call 0x18049c450
0x18066c260: mov rax, qword ptr [rip + 0x84fd679]
0x18066c267: cmp byte ptr [rip + 0x892edbc], 0
0x18066c26e: mov rax, qword ptr [rax + 0xb8]
0x18066c275: movups xmm6, xmmword ptr [rax + 0x30]
0x18066c279: movsd xmm7, qword ptr [rax + 0x40]
0x18066c27e: jne 0x18066c293
0x18066c280: lea rcx, [rip + 0x84a39b9]
0x18066c287: call 0x18049c210
0x18066c28c: mov byte ptr [rip + 0x892ed97], 1
0x18066c293: mov rax, qword ptr [rip + 0x84a39a6]
0x18066c29a: cmp dword ptr [rax + 0xe0], 0
0x18066c2a1: jne 0x18066c2b2
0x18066c2a3: mov rcx, rax
0x18066c2a6: call 0x18049c450
0x18066c2ab: mov rax, qword ptr [rip + 0x84a398e]
0x18066c2b2: mov rax, qword ptr [rax + 0xb8]
0x18066c2b9: mov rcx, qword ptr [rax + 0x930]
0x18066c2c0: test rcx, rcx
0x18066c2c3: jne 0x18066c317
0x18066c2c5: mov rcx, qword ptr [rsi + 0x38]
0x18066c2c9: test rcx, rcx
0x18066c2cc: je 0x18066c561
0x18066c2d2: xor r8d, r8d
0x18066c2d5: mov rdx, rbp
0x18066c2d8: call 0x180925b70 ; Torappu.Battle.BattleFactory.CreateCharacter
0x18066c2dd: mov rdi, rax
0x18066c2e0: test rax, rax
0x18066c2e3: je 0x18066c561
0x18066c2e9: xor ebx, ebx
0x18066c2eb: movaps xmmword ptr [rsp + 0x50], xmm6
0x18066c2f0: mov qword ptr [rsp + 0x28], rbx
0x18066c2f5: lea r9, [rsp + 0x50]
0x18066c2fa: mov r8d, 3
0x18066c300: mov dword ptr [rsp + 0x20], ebx
0x18066c304: mov rdx, rbp
0x18066c307: movsd qword ptr [rsp + 0x60], xmm7
0x18066c30d: mov rcx, rax
0x18066c310: call 0x180aa1340 ; Torappu.Battle.Character.MakeDummy
0x18066c315: jmp 0x18066c340
0x18066c317: xor ebx, ebx
0x18066c319: movaps xmmword ptr [rsp + 0x50], xmm6
0x18066c31e: mov qword ptr [rsp + 0x28], rbx
0x18066c323: lea r9, [rsp + 0x50]
0x18066c328: mov r8, rbp
0x18066c32b: mov byte ptr [rsp + 0x20], bl
0x18066c32f: mov rdx, rsi
0x18066c332: movsd qword ptr [rsp + 0x60], xmm7
0x18066c338: call 0x1833dcf30 ; XLua.DelegateBridge.__Gen_Delegate_Imp2917
0x18066c33d: mov rdi, rax
0x18066c340: test rdi, rdi
0x18066c343: je 0x18066c561
0x18066c349: xor edx, edx
0x18066c34b: mov rcx, rdi
0x18066c34e: call 0x186dc5740 ; UnityEngine.Component.get_gameObject
0x18066c353: xor r8d, r8d
0x18066c356: xor edx, edx
0x18066c358: mov rcx, rax
0x18066c35b: call 0x18697b9d0 ; Torappu.GameObjectUtil.SetActiveIfNecessary
0x18066c360: test r15b, r15b
0x18066c363: je 0x18066c3d8
0x18066c365: mov r15, qword ptr [rsi + 0x100]
0x18066c36c: test rbp, rbp
0x18066c36f: je 0x18066c561
0x18066c375: mov rdx, qword ptr [rbp + 0x38]
0x18066c379: lea rcx, [rsp + 0x30]
0x18066c37e: mov qword ptr [rsp + 0x30], rdx
0x18066c383: call 0x18049bcf0
0x18066c388: test r15, r15
0x18066c38b: je 0x18066c561
0x18066c391: movaps xmm0, xmmword ptr [rsp + 0x30]
0x18066c396: lea r8, [rsp + 0x40]
0x18066c39b: mov r9, rdi
0x18066c39e: movdqa xmmword ptr [rsp + 0x40], xmm0
0x18066c3a4: mov rdx, r15
0x18066c3a7: mov qword ptr [rsp + 0x20], rbx
0x18066c3ac: lea rcx, [rsp + 0x50]
0x18066c3b1: call 0x180d7e460 ; Torappu.Battle.Runes.RuneManager.PreprocessCharacter
0x18066c3b6: lea rcx, [rbp + 0x38]
0x18066c3ba: movups xmm6, xmmword ptr [rax]
0x18066c3bd: movq rdx, xmm6
0x18066c3c2: mov qword ptr [rbp + 0x38], rdx
0x18066c3c6: call 0x18049bcf0
0x18066c3cb: psrldq xmm6, 8
0x18066c3d0: movd eax, xmm6
0x18066c3d4: mov byte ptr [r12], al
0x18066c3d8: test r14b, r14b
0x18066c3db: je 0x18066c4cc
0x18066c3e1: mov rsi, qword ptr [rsi + 0x178]
0x18066c3e8: test rsi, rsi
0x18066c3eb: je 0x18066c561
0x18066c3f1: mov rax, qword ptr [rsi]
0x18066c3f4: mov ecx, dword ptr [rax + 0x11c]
0x18066c3fa: add ecx, 0xfffff625
0x18066c400: cmp ecx, 0x1a
0x18066c403: ja 0x18066c45d
0x18066c405: movsxd rax, ecx
0x18066c408: movzx eax, byte ptr [rax + r13 + 0x66c598]
0x18066c411: mov ecx, dword ptr [r13 + rax*4 + 0x66c58c]
0x18066c419: add rcx, r13
0x18066c41c: jmp rcx
0x18066c41e: xor r9d, r9d
0x18066c421: mov r8, rdi
0x18066c424: mov rdx, rbp
0x18066c427: mov rcx, rsi
0x18066c42a: call 0x180cf8ab0 ; Torappu.Battle.GameMode.GameModeFactory/RoguelikeGameMode.PreprocessCharacterCard
0x18066c42f: jmp 0x18066c4cc
0x18066c434: xor r9d, r9d
0x18066c437: mov r8, rdi
0x18066c43a: mov rdx, rbp
0x18066c43d: mov rcx, rsi
0x18066c440: call 0x180cfd130 ; Torappu.Battle.GameMode.GameModeFactory/SandboxGameMode.PreprocessCharacterCard
0x18066c445: jmp 0x18066c4cc
0x18066c44a: xor r9d, r9d
0x18066c44d: mov r8, rdi
0x18066c450: mov rdx, rbp
0x18066c453: mov rcx, rsi
0x18066c456: call 0x180c9e9c0 ; Torappu.Battle.GameMode.GameModeFactory/DefaultGameMode.PreprocessCharacterCard
0x18066c45b: jmp 0x18066c4cc
0x18066c45d: cmp byte ptr [rip + 0x896c60c], 0
0x18066c464: mov r14, qword ptr [rip + 0x84e097d]
0x18066c46b: mov r15, qword ptr [rsi]
0x18066c46e: je 0x18066c478
0x18066c470: mov rcx, r15
0x18066c473: call 0x180457010
0x18066c478: movzx ecx, word ptr [r15 + 0x12e]
0x18066c480: cmp bx, cx
0x18066c483: jae 0x18066c4a8
0x18066c485: mov rdx, qword ptr [r15 + 0xb0]
0x18066c48c: nop dword ptr [rax]
0x18066c490: movzx eax, bx
0x18066c493: add rax, rax
0x18066c496: cmp qword ptr [rdx + rax*8], r14
0x18066c49a: je 0x18066c525
0x18066c4a0: inc bx
0x18066c4a3: cmp bx, cx
0x18066c4a6: jb 0x18066c490
0x18066c4a8: mov r8d, 0x2a
0x18066c4ae: mov rdx, r14
0x18066c4b1: mov rcx, rsi
0x18066c4b4: call 0x180455fd0
0x18066c4b9: mov r10, qword ptr [rax]
0x18066c4bc: mov r8, rdi
0x18066c4bf: mov r9, qword ptr [rax + 8]
0x18066c4c3: mov rdx, rbp
0x18066c4c6: mov rcx, rsi
0x18066c4c9: call r10
0x18066c4cc: mov rcx, qword ptr [rip + 0x85164dd]
0x18066c4d3: cmp dword ptr [rcx + 0xe0], 0
0x18066c4da: jne 0x18066c4e1
0x18066c4dc: call 0x18049c450
0x18066c4e1: xor edx, edx
0x18066c4e3: mov rcx, rdi
0x18066c4e6: call 0x182ac0360 ; Torappu.ObjectPool.PoolManager.Recycle
0x18066c4eb: movaps xmm6, xmmword ptr [rsp + 0x80]
0x18066c4f3: mov r15, qword ptr [rsp + 0x90]
0x18066c4fb: mov r14, qword ptr [rsp + 0xd0]
0x18066c503: mov r13, qword ptr [rsp + 0xc8]
0x18066c50b: movaps xmm7, xmmword ptr [rsp + 0x70]
0x18066c510: mov rbx, qword ptr [rsp + 0xc0]
0x18066c518: add rsp, 0x98
0x18066c51f: pop r12
0x18066c521: pop rdi
0x18066c522: pop rsi
0x18066c523: pop rbp
0x18066c524: ret
0x18066c525: movzx ecx, bx
0x18066c528: add rcx, rcx
0x18066c52b: mov eax, dword ptr [rdx + rcx*8 + 8]
0x18066c52f: add eax, 0x2a
0x18066c532: cdqe
0x18066c534: add rax, 0x14
0x18066c538: shl rax, 4
0x18066c53c: add rax, r15
0x18066c53f: jmp 0x18066c4b9
0x18066c544: xor ebx, ebx
0x18066c546: movzx r9d, dil
0x18066c54a: mov qword ptr [rsp + 0x28], rbx
0x18066c54f: mov r8, rbp
0x18066c552: mov rdx, rsi
0x18066c555: mov qword ptr [rsp + 0x20], r12
0x18066c55a: call 0x1833e18e0 ; XLua.DelegateBridge.__Gen_Delegate_Imp2945
0x18066c55f: jmp 0x18066c510
0x18066c561: call 0x18049c3c0
0x18066c566: int3
0x18066c567: nop
