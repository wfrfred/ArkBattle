0x18065d110: mov qword ptr [rsp + 0x18], rbx
0x18065d115: push rsi
0x18065d116: sub rsp, 0x30
0x18065d11a: cmp byte ptr [rip + 0x893df31], 0
0x18065d121: mov rsi, rdx
0x18065d124: mov rbx, rcx
0x18065d127: jne 0x18065d178
0x18065d129: lea rcx, [rip + 0x84b2b10]
0x18065d130: call 0x18049c210
0x18065d135: lea rcx, [rip + 0x85b8e5c]
0x18065d13c: call 0x18049c210
0x18065d141: lea rcx, [rip + 0x85b92e8]
0x18065d148: call 0x18049c210
0x18065d14d: lea rcx, [rip + 0x8520f54]
0x18065d154: call 0x18049c210
0x18065d159: lea rcx, [rip + 0x8520cf8]
0x18065d160: call 0x18049c210
0x18065d165: lea rcx, [rip + 0x84d4fa4]
0x18065d16c: call 0x18049c210
0x18065d171: mov byte ptr [rip + 0x893deda], 1
0x18065d178: mov rcx, qword ptr [rip + 0x84b2ac1]
0x18065d17f: mov qword ptr [rsp + 0x58], 0
0x18065d188: cmp dword ptr [rcx + 0xe0], 0
0x18065d18f: jne 0x18065d19d
0x18065d191: call 0x18049c450
0x18065d196: mov rcx, qword ptr [rip + 0x84b2aa3]
0x18065d19d: mov rax, qword ptr [rcx + 0xb8]
0x18065d1a4: mov r10, qword ptr [rax + 0xa70]
0x18065d1ab: test r10, r10
0x18065d1ae: jne 0x18065d295
0x18065d1b4: mov qword ptr [rsp + 0x48], rdi
0x18065d1b9: cmp dword ptr [rcx + 0xe0], r10d
0x18065d1c0: jne 0x18065d1c7
0x18065d1c2: call 0x18049c450
0x18065d1c7: xor ecx, ecx
0x18065d1c9: mov qword ptr [rsp + 0x40], rbp
0x18065d1ce: call 0x1806702b0 ; Torappu.Battle.BattleController.get_fixedFrameCnt
0x18065d1d3: mov rcx, qword ptr [rbx + 0x20]
0x18065d1d7: mov edi, eax
0x18065d1d9: test rcx, rcx
0x18065d1dc: je 0x18065d2bb
0x18065d1e2: mov r9, qword ptr [rip + 0x85b9247]
0x18065d1e9: lea r8, [rsp + 0x58]
0x18065d1ee: lea edx, [rdi + 1]
0x18065d1f1: call 0x184cb20a0
0x18065d1f6: test al, al
0x18065d1f8: jne 0x18065d270
0x18065d1fa: mov rcx, qword ptr [rip + 0x84d4f0f]
0x18065d201: mov rbp, qword ptr [rbx + 0x20]
0x18065d205: call 0x18046d2f0
0x18065d20a: mov rbx, rax
0x18065d20d: test rax, rax
0x18065d210: je 0x18065d2bb
0x18065d216: mov rdx, qword ptr [rip + 0x8520c3b]
0x18065d21d: mov rcx, rax
0x18065d220: call 0x184b06b30
0x18065d225: movups xmm0, xmmword ptr [rsi]
0x18065d228: mov r8, qword ptr [rip + 0x8520e79]
0x18065d22f: lea rdx, [rsp + 0x20]
0x18065d234: mov rcx, rbx
0x18065d237: movaps xmmword ptr [rsp + 0x20], xmm0
0x18065d23c: call 0x180007230
0x18065d241: test rbp, rbp
0x18065d244: je 0x18065d2bb
0x18065d246: mov r9, qword ptr [rip + 0x85b8d4b]
0x18065d24d: lea edx, [rdi + 1]
0x18065d250: mov r8, rbx
0x18065d253: mov rcx, rbp
0x18065d256: call 0x184ca83c0
0x18065d25b: mov rbp, qword ptr [rsp + 0x40]
0x18065d260: mov rdi, qword ptr [rsp + 0x48]
0x18065d265: mov rbx, qword ptr [rsp + 0x50]
0x18065d26a: add rsp, 0x30
0x18065d26e: pop rsi
0x18065d26f: ret
0x18065d270: mov rcx, qword ptr [rsp + 0x58]
0x18065d275: test rcx, rcx
0x18065d278: je 0x18065d2bb
0x18065d27a: movups xmm0, xmmword ptr [rsi]
0x18065d27d: mov r8, qword ptr [rip + 0x8520e24]
0x18065d284: lea rdx, [rsp + 0x20]
0x18065d289: movaps xmmword ptr [rsp + 0x20], xmm0
0x18065d28e: call 0x180007230
0x18065d293: jmp 0x18065d25b
0x18065d295: movups xmm0, xmmword ptr [rsi]
0x18065d298: xor r9d, r9d
0x18065d29b: lea r8, [rsp + 0x20]
0x18065d2a0: mov rdx, rbx
0x18065d2a3: mov rcx, r10
0x18065d2a6: movaps xmmword ptr [rsp + 0x20], xmm0
0x18065d2ab: call 0x1833e0e60 ; XLua.DelegateBridge.__Gen_Delegate_Imp2940
0x18065d2b0: mov rbx, qword ptr [rsp + 0x50]
0x18065d2b5: add rsp, 0x30
0x18065d2b9: pop rsi
0x18065d2ba: ret
0x18065d2bb: call 0x18049c3c0
0x18065d2c0: int3
0x18065d2c1: int3
0x18065d2c2: int3
0x18065d2c3: int3
0x18065d2c4: int3
0x18065d2c5: int3
0x18065d2c6: int3
0x18065d2c7: int3
0x18065d2c8: int3
0x18065d2c9: int3
0x18065d2ca: int3
0x18065d2cb: int3
0x18065d2cc: int3
0x18065d2cd: int3
0x18065d2ce: int3
0x18065d2cf: int3
