0x18066d270: mov qword ptr [rsp + 0x10], rbx
0x18066d275: mov qword ptr [rsp + 0x20], rsi
0x18066d27a: mov qword ptr [rsp + 8], rcx
0x18066d27f: push rdi
0x18066d280: sub rsp, 0x80
0x18066d287: mov rsi, rcx
0x18066d28a: cmp byte ptr [rip + 0x892ddc2], 0
0x18066d291: jne 0x18066d312
0x18066d293: lea rcx, [rip + 0x84a29a6]
0x18066d29a: call 0x18049c210
0x18066d29f: lea rcx, [rip + 0x8553f1a]
0x18066d2a6: call 0x18049c210
0x18066d2ab: lea rcx, [rip + 0x855415e]
0x18066d2b2: call 0x18049c210
0x18066d2b7: lea rcx, [rip + 0x855439a]
0x18066d2be: call 0x18049c210
0x18066d2c3: lea rcx, [rip + 0x85a8f16]
0x18066d2ca: call 0x18049c210
0x18066d2cf: lea rcx, [rip + 0x85a915a]
0x18066d2d6: call 0x18049c210
0x18066d2db: lea rcx, [rip + 0x8511266]
0x18066d2e2: call 0x18049c210
0x18066d2e7: lea rcx, [rip + 0x858ff62]
0x18066d2ee: call 0x18049c210
0x18066d2f3: lea rcx, [rip + 0x859ee36]
0x18066d2fa: call 0x18049c210
0x18066d2ff: lea rcx, [rip + 0x859f2c2]
0x18066d306: call 0x18049c210
0x18066d30b: mov byte ptr [rip + 0x892dd41], 1
0x18066d312: xor edi, edi
0x18066d314: mov qword ptr [rsp + 0xa0], rdi
0x18066d31c: xorps xmm0, xmm0
0x18066d31f: movups xmmword ptr [rsp + 0x58], xmm0
0x18066d324: movups xmmword ptr [rsp + 0x68], xmm0
0x18066d329: movups xmmword ptr [rsp + 0x48], xmm0
0x18066d32e: mov rcx, qword ptr [rip + 0x84a290b]
0x18066d335: cmp dword ptr [rcx + 0xe0], edi
0x18066d33b: jne 0x18066d349
0x18066d33d: call 0x18049c450
0x18066d342: mov rcx, qword ptr [rip + 0x84a28f7]
0x18066d349: mov rax, qword ptr [rcx + 0xb8]
0x18066d350: mov r9, qword ptr [rax + 0xa78]
0x18066d357: test r9, r9
0x18066d35a: jne 0x18066d4c5
0x18066d360: mov rbx, qword ptr [rsi + 0x20]
0x18066d364: cmp dword ptr [rcx + 0xe0], edi
0x18066d36a: jne 0x18066d371
0x18066d36c: call 0x18049c450
0x18066d371: xor ecx, ecx
0x18066d373: call 0x1806702b0 ; Torappu.Battle.BattleController.get_fixedFrameCnt
0x18066d378: test rbx, rbx
0x18066d37b: je 0x18066d4f4
0x18066d381: mov r9, qword ptr [rip + 0x85a90a8]
0x18066d388: lea r8, [rsp + 0xa0]
0x18066d390: mov edx, eax
0x18066d392: mov rcx, rbx
0x18066d395: call 0x184cb20a0
0x18066d39a: test al, al
0x18066d39c: je 0x18066d4d3
0x18066d3a2: mov rdx, qword ptr [rsp + 0xa0]
0x18066d3aa: test rdx, rdx
0x18066d3ad: je 0x18066d48d
0x18066d3b3: mov r8, qword ptr [rip + 0x851118e]
0x18066d3ba: lea rcx, [rsp + 0x28]
0x18066d3bf: call 0x184ce30d0
0x18066d3c4: movups xmm0, xmmword ptr [rsp + 0x28]
0x18066d3c9: movups xmmword ptr [rsp + 0x58], xmm0
0x18066d3ce: movups xmm1, xmmword ptr [rsp + 0x38]
0x18066d3d3: movups xmmword ptr [rsp + 0x68], xmm1
0x18066d3d8: mov qword ptr [rsp + 0x28], rdi
0x18066d3dd: lea rbx, [rsp + 0x58]
0x18066d3e2: mov qword ptr [rsp + 0x30], rbx
0x18066d3e7: nop word ptr [rax + rax]
0x18066d3f0: mov rdx, qword ptr [rip + 0x8554019]
0x18066d3f7: lea rcx, [rsp + 0x58]
0x18066d3fc: call 0x185cb62d0
0x18066d401: test al, al
0x18066d403: je 0x18066d459
0x18066d405: movups xmm0, xmmword ptr [rsp + 0x68]
0x18066d40a: movups xmmword ptr [rsp + 0x48], xmm0
0x18066d40f: mov rdx, qword ptr [rip + 0x859f1b2]
0x18066d416: lea rcx, [rsp + 0x48]
0x18066d41b: call 0x1853ae780
0x18066d420: test al, al
0x18066d422: je 0x18066d3f0
0x18066d424: mov rdi, qword ptr [rsi + 0x90]
0x18066d42b: mov rdx, qword ptr [rip + 0x859ecfe]
0x18066d432: lea rcx, [rsp + 0x48]
0x18066d437: call 0x1853ae540
0x18066d43c: test rdi, rdi
0x18066d43f: je 0x18066d4e8
0x18066d445: mov r8, qword ptr [rip + 0x858fe04]
0x18066d44c: mov rdx, rax
0x18066d44f: mov rcx, rdi
0x18066d452: call 0x1853acb60
0x18066d457: jmp 0x18066d3f0
0x18066d459: mov rdx, qword ptr [rip + 0x8553d60]
0x18066d460: mov rcx, rbx
0x18066d463: call 0x18051df60 ; 3159 metadata aliases
0x18066d468: jmp 0x18066d48d
0x18066d46a: mov rdx, qword ptr [rip + 0x8553d4f]
0x18066d471: mov rcx, qword ptr [rsp + 0x30]
0x18066d476: call 0x18051df60 ; 3159 metadata aliases
0x18066d47b: mov rcx, qword ptr [rsp + 0x28]
0x18066d480: test rcx, rcx
0x18066d483: jne 0x18066d4ee
0x18066d485: mov rsi, qword ptr [rsp + 0x90]
0x18066d48d: mov rbx, qword ptr [rsi + 0x20]
0x18066d491: mov rcx, qword ptr [rip + 0x84a27a8]
0x18066d498: cmp dword ptr [rcx + 0xe0], 0
0x18066d49f: jne 0x18066d4a6
0x18066d4a1: call 0x18049c450
0x18066d4a6: xor ecx, ecx
0x18066d4a8: call 0x1806702b0 ; Torappu.Battle.BattleController.get_fixedFrameCnt
0x18066d4ad: test rbx, rbx
0x18066d4b0: je 0x18066d4f4
0x18066d4b2: mov r8, qword ptr [rip + 0x85a8d27]
0x18066d4b9: mov edx, eax
0x18066d4bb: mov rcx, rbx
0x18066d4be: call 0x184cadfb0
0x18066d4c3: jmp 0x18066d4d3
0x18066d4c5: xor r8d, r8d
0x18066d4c8: mov rdx, rsi
0x18066d4cb: mov rcx, r9
0x18066d4ce: call 0x1833c9ac0 ; XLua.DelegateBridge.__Gen_Delegate_Imp27
0x18066d4d3: lea r11, [rsp + 0x80]
0x18066d4db: mov rbx, qword ptr [r11 + 0x18]
0x18066d4df: mov rsi, qword ptr [r11 + 0x28]
0x18066d4e3: mov rsp, r11
0x18066d4e6: pop rdi
0x18066d4e7: ret
0x18066d4e8: call 0x18049c3c0
0x18066d4ed: nop
0x18066d4ee: call 0x180483060
0x18066d4f3: int3
0x18066d4f4: call 0x18049c3c0
0x18066d4f9: int3
0x18066d4fa: int3
0x18066d4fb: int3
0x18066d4fc: int3
0x18066d4fd: int3
0x18066d4fe: int3
0x18066d4ff: int3
