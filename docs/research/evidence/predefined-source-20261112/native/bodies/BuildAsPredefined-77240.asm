0x180a9ceb0: mov qword ptr [rsp + 0x18], rsi
0x180a9ceb5: mov qword ptr [rsp + 0x20], rdi
0x180a9ceba: push rbp
0x180a9cebb: push r14
0x180a9cebd: push r15
0x180a9cebf: lea rbp, [rsp - 0x3f]
0x180a9cec4: sub rsp, 0xf0
0x180a9cecb: cmp byte ptr [rip + 0x8500833], 0
0x180a9ced2: mov r14d, r9d
0x180a9ced5: mov r15, r8
0x180a9ced8: mov rdi, rdx
0x180a9cedb: mov rsi, rcx
0x180a9cede: jne 0x180a9cf0b
0x180a9cee0: lea rcx, [rip + 0x80cc9f9]
0x180a9cee7: call 0x18049c210
0x180a9ceec: lea rcx, [rip + 0x813a72d]
0x180a9cef3: call 0x18049c210
0x180a9cef8: lea rcx, [rip + 0x8114c61]
0x180a9ceff: call 0x18049c210
0x180a9cf04: mov byte ptr [rip + 0x85007fa], 1
0x180a9cf0b: mov rax, qword ptr [rip + 0x813a70e]
0x180a9cf12: cmp dword ptr [rax + 0xe0], 0
0x180a9cf19: jne 0x180a9cf2a
0x180a9cf1b: mov rcx, rax
0x180a9cf1e: call 0x18049c450
0x180a9cf23: mov rax, qword ptr [rip + 0x813a6f6]
0x180a9cf2a: mov rax, qword ptr [rax + 0xb8]
0x180a9cf31: mov qword ptr [rsp + 0x110], rbx
0x180a9cf39: mov rcx, qword ptr [rax + 0x3a8]
0x180a9cf40: test rcx, rcx
0x180a9cf43: jne 0x180a9d177
0x180a9cf49: xorps xmm0, xmm0
0x180a9cf4c: mov qword ptr [rsp + 0x30], rdi
0x180a9cf51: mov rdx, rdi
0x180a9cf54: lea rcx, [rsp + 0x30]
0x180a9cf59: movups xmmword ptr [rbp - 0x79], xmm0
0x180a9cf5d: movups xmmword ptr [rbp - 0x69], xmm0
0x180a9cf61: movups xmmword ptr [rbp - 0x59], xmm0
0x180a9cf65: movups xmmword ptr [rbp - 0x49], xmm0
0x180a9cf69: movups xmmword ptr [rbp - 0x39], xmm0
0x180a9cf6d: call 0x18049bcf0
0x180a9cf72: mov rdx, r15
0x180a9cf75: mov qword ptr [rbp - 0x79], r15
0x180a9cf79: lea rcx, [rbp - 0x79]
0x180a9cf7d: call 0x18049bcf0
0x180a9cf82: xor ebx, ebx
0x180a9cf84: mov dword ptr [rbp - 0x71], r14d
0x180a9cf88: xor edx, edx
0x180a9cf8a: mov dword ptr [rbp - 0x6d], ebx
0x180a9cf8d: lea rcx, [rbp - 0x61]
0x180a9cf91: mov qword ptr [rbp - 0x61], rbx
0x180a9cf95: call 0x18049bcf0
0x180a9cf9a: mov rcx, qword ptr [rip + 0x8114bbf]
0x180a9cfa1: call 0x18558e720
0x180a9cfa6: test rax, rax
0x180a9cfa9: je 0x180a9d1b2
0x180a9cfaf: xor edx, edx
0x180a9cfb1: mov rcx, rax
0x180a9cfb4: call 0x180670490 ; Torappu.Battle.BattleController.get_gameMode
0x180a9cfb9: mov rdi, rax
0x180a9cfbc: test rax, rax
0x180a9cfbf: je 0x180a9d1b2
0x180a9cfc5: mov rax, qword ptr [rax]
0x180a9cfc8: mov ecx, dword ptr [rax + 0x11c]
0x180a9cfce: add ecx, 0xfffff625
0x180a9cfd4: cmp ecx, 0x1a
0x180a9cfd7: ja 0x180a9d023
0x180a9cfd9: movsxd rax, ecx
0x180a9cfdc: lea rdx, [rip - 0xa9cfe3]
0x180a9cfe3: movzx eax, byte ptr [rdx + rax + 0xa9d1c0]
0x180a9cfeb: mov ecx, dword ptr [rdx + rax*4 + 0xa9d1b8]
0x180a9cff2: add rcx, rdx
0x180a9cff5: jmp rcx
0x180a9cff7: xor r9d, r9d
0x180a9cffa: mov r8, r15
0x180a9cffd: mov rdx, rsi
0x180a9d000: mov rcx, rdi
0x180a9d003: call 0x180c9d000 ; Torappu.Battle.GameMode.GameModeFactory/DefaultGameMode.GetPlayerSideOnMap
0x180a9d008: jmp 0x180a9d0a4
0x180a9d00d: xor r9d, r9d
0x180a9d010: mov r8, r15
0x180a9d013: mov rdx, rsi
0x180a9d016: mov rcx, rdi
0x180a9d019: call 0x180c625d0 ; Torappu.Battle.GameMode.GameModeFactory/AutoChessGameMode.GetPlayerSideOnMap
0x180a9d01e: jmp 0x180a9d0a4
0x180a9d023: cmp byte ptr [rip + 0x853ba47], bl
0x180a9d029: mov r14, qword ptr [rip + 0x80afdb8]
0x180a9d030: mov qword ptr [rsp + 0x118], r13
0x180a9d038: mov r13, qword ptr [rdi]
0x180a9d03b: je 0x180a9d045
0x180a9d03d: mov rcx, r13
0x180a9d040: call 0x180457010
0x180a9d045: movzx ecx, word ptr [r13 + 0x12e]
0x180a9d04d: cmp bx, cx
0x180a9d050: jae 0x180a9d078
0x180a9d052: mov rdx, qword ptr [r13 + 0xb0]
0x180a9d059: nop dword ptr [rax]
0x180a9d060: movzx eax, bx
0x180a9d063: add rax, rax
0x180a9d066: cmp qword ptr [rdx + rax*8], r14
0x180a9d06a: je 0x180a9d158
0x180a9d070: inc bx
0x180a9d073: cmp bx, cx
0x180a9d076: jb 0x180a9d060
0x180a9d078: mov r8d, 0x72
0x180a9d07e: mov rdx, r14
0x180a9d081: mov rcx, rdi
0x180a9d084: call 0x180455fd0
0x180a9d089: mov r10, qword ptr [rax]
0x180a9d08c: mov r8, r15
0x180a9d08f: mov r9, qword ptr [rax + 8]
0x180a9d093: mov rdx, rsi
0x180a9d096: mov rcx, rdi
0x180a9d099: call r10
0x180a9d09c: mov r13, qword ptr [rsp + 0x118]
0x180a9d0a4: mov dword ptr [rbp - 0x51], eax
0x180a9d0a7: mov rax, qword ptr [rip + 0x80cc832]
0x180a9d0ae: mov byte ptr [rbp - 0x4d], 0
0x180a9d0b2: cmp dword ptr [rax + 0xe0], 0
0x180a9d0b9: jne 0x180a9d0ca
0x180a9d0bb: mov rcx, rax
0x180a9d0be: call 0x18049c450
0x180a9d0c3: mov rax, qword ptr [rip + 0x80cc816]
0x180a9d0ca: cmp byte ptr [rip + 0x853b99f], 0
0x180a9d0d1: mov rax, qword ptr [rax + 0xb8]
0x180a9d0d8: movups xmm0, xmmword ptr [rax + 0x30]
0x180a9d0dc: movups xmmword ptr [rbp - 0x49], xmm0
0x180a9d0e0: movsd xmm1, qword ptr [rax + 0x40]
0x180a9d0e5: movsd qword ptr [rbp - 0x39], xmm1
0x180a9d0ea: jbe 0x180a9d0f4
0x180a9d0ec: mov rcx, qword ptr [rsi]
0x180a9d0ef: call 0x180457010
0x180a9d0f4: mov rdx, qword ptr [rsi]
0x180a9d0f7: mov rcx, rsi
0x180a9d0fa: mov rax, qword ptr [rdx + 0xe80]
0x180a9d101: mov rdx, qword ptr [rdx + 0xe88]
0x180a9d108: call rax
0x180a9d10a: movaps xmm0, xmmword ptr [rsp + 0x30]
0x180a9d10f: lea rdx, [rbp - 0x21]
0x180a9d113: movaps xmmword ptr [rbp - 0x21], xmm0
0x180a9d117: xor r8d, r8d
0x180a9d11a: movaps xmm0, xmmword ptr [rbp - 0x61]
0x180a9d11e: mov rcx, rsi
0x180a9d121: mov dword ptr [rbp - 0x69], eax
0x180a9d124: movaps xmm1, xmmword ptr [rbp - 0x71]
0x180a9d128: movaps xmmword ptr [rbp - 0x11], xmm1
0x180a9d12c: movaps xmm1, xmmword ptr [rbp - 0x51]
0x180a9d130: movaps xmmword ptr [rbp + 0xf], xmm1
0x180a9d134: movsd xmm1, qword ptr [rbp - 0x31]
0x180a9d139: movaps xmmword ptr [rbp - 1], xmm0
0x180a9d13d: movaps xmm0, xmmword ptr [rbp - 0x41]
0x180a9d141: movsd qword ptr [rbp + 0x2f], xmm1
0x180a9d146: mov byte ptr [rsi + 0x376], 1
0x180a9d14d: movaps xmmword ptr [rbp + 0x1f], xmm0
0x180a9d151: call 0x180aaaaf0 ; Torappu.Battle.Character._BuildAtInternal
0x180a9d156: jmp 0x180a9d191
0x180a9d158: movzx ecx, bx
0x180a9d15b: add rcx, rcx
0x180a9d15e: mov eax, dword ptr [rdx + rcx*8 + 8]
0x180a9d162: add eax, 0x72
0x180a9d165: cdqe
0x180a9d167: add rax, 0x14
0x180a9d16b: shl rax, 4
0x180a9d16f: add rax, r13
0x180a9d172: jmp 0x180a9d089
0x180a9d177: xor ebx, ebx
0x180a9d179: mov r9, r15
0x180a9d17c: mov qword ptr [rsp + 0x28], rbx
0x180a9d181: mov r8, rdi
0x180a9d184: mov rdx, rsi
0x180a9d187: mov dword ptr [rsp + 0x20], r14d
0x180a9d18c: call 0x1832f7ec0 ; XLua.DelegateBridge.__Gen_Delegate_Imp1426
0x180a9d191: mov rbx, qword ptr [rsp + 0x110]
0x180a9d199: lea r11, [rsp + 0xf0]
0x180a9d1a1: mov rsi, qword ptr [r11 + 0x30]
0x180a9d1a5: mov rdi, qword ptr [r11 + 0x38]
0x180a9d1a9: mov rsp, r11
0x180a9d1ac: pop r15
0x180a9d1ae: pop r14
0x180a9d1b0: pop rbp
0x180a9d1b1: ret
0x180a9d1b2: call 0x18049c3c0
0x180a9d1b7: int3
