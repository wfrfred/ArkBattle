0x180a9d3a0: mov qword ptr [rsp + 8], rbx
0x180a9d3a5: mov qword ptr [rsp + 0x10], rsi
0x180a9d3aa: mov qword ptr [rsp + 0x18], rdi
0x180a9d3af: mov qword ptr [rsp + 0x20], r14
0x180a9d3b4: push rbp
0x180a9d3b5: lea rbp, [rsp - 0x20]
0x180a9d3ba: sub rsp, 0x120
0x180a9d3c1: cmp byte ptr [rip + 0x850033c], 0
0x180a9d3c8: mov r14d, r9d
0x180a9d3cb: mov rsi, r8
0x180a9d3ce: mov rbx, rdx
0x180a9d3d1: mov rdi, rcx
0x180a9d3d4: jne 0x180a9d3e9
0x180a9d3d6: lea rcx, [rip + 0x813a243]
0x180a9d3dd: call 0x18049c210
0x180a9d3e2: mov byte ptr [rip + 0x850031b], 1
0x180a9d3e9: mov rax, qword ptr [rip + 0x813a230]
0x180a9d3f0: cmp dword ptr [rax + 0xe0], 0
0x180a9d3f7: jne 0x180a9d408
0x180a9d3f9: mov rcx, rax
0x180a9d3fc: call 0x18049c450
0x180a9d401: mov rax, qword ptr [rip + 0x813a218]
0x180a9d408: mov rax, qword ptr [rax + 0xb8]
0x180a9d40f: mov rcx, qword ptr [rax + 0x3a0]
0x180a9d416: test rcx, rcx
0x180a9d419: jne 0x180a9d5a6
0x180a9d41f: test rbx, rbx
0x180a9d422: je 0x180a9d5df
0x180a9d428: xor r8d, r8d
0x180a9d42b: lea rcx, [rbp - 0x60]
0x180a9d42f: mov rdx, rbx
0x180a9d432: call 0x1806f24b0 ; Torappu.Battle.Deck/Card.get_deckBuffOnBorn
0x180a9d437: xor edx, edx
0x180a9d439: mov rcx, rbx
0x180a9d43c: movups xmm0, xmmword ptr [rax]
0x180a9d43f: movups xmmword ptr [rbp - 0x70], xmm0
0x180a9d443: xorps xmm0, xmm0
0x180a9d446: movups xmmword ptr [rsp + 0x38], xmm0
0x180a9d44b: movups xmmword ptr [rsp + 0x48], xmm0
0x180a9d450: movups xmmword ptr [rsp + 0x58], xmm0
0x180a9d455: movups xmmword ptr [rsp + 0x68], xmm0
0x180a9d45a: movups xmmword ptr [rsp + 0x78], xmm0
0x180a9d45f: call 0x1806f2450 ; Torappu.Battle.Deck/Card.get_data
0x180a9d464: mov rdx, rax
0x180a9d467: mov qword ptr [rsp + 0x30], rax
0x180a9d46c: lea rcx, [rsp + 0x30]
0x180a9d471: call 0x18049bcf0
0x180a9d476: mov rdx, rsi
0x180a9d479: mov qword ptr [rsp + 0x38], rsi
0x180a9d47e: lea rcx, [rsp + 0x38]
0x180a9d483: call 0x18049bcf0
0x180a9d488: cmp byte ptr [rip + 0x853b5e1], 0
0x180a9d48f: mov dword ptr [rsp + 0x40], r14d
0x180a9d494: jbe 0x180a9d49e
0x180a9d496: mov rcx, qword ptr [rbx]
0x180a9d499: call 0x180457010
0x180a9d49e: mov rdx, qword ptr [rbx]
0x180a9d4a1: mov rcx, rbx
0x180a9d4a4: mov rax, qword ptr [rdx + 0x1e0]
0x180a9d4ab: mov rdx, qword ptr [rdx + 0x1e8]
0x180a9d4b2: call rax
0x180a9d4b4: mov rdx, qword ptr [rbp - 0x70]
0x180a9d4b8: lea rcx, [rsp + 0x50]
0x180a9d4bd: mov qword ptr [rsp + 0x50], rdx
0x180a9d4c2: mov dword ptr [rsp + 0x44], eax
0x180a9d4c6: call 0x18049bcf0
0x180a9d4cb: movups xmm0, xmmword ptr [rbp - 0x70]
0x180a9d4cf: lea rcx, [rsp + 0x58]
0x180a9d4d4: psrldq xmm0, 8
0x180a9d4d9: movq rdx, xmm0
0x180a9d4de: mov qword ptr [rsp + 0x58], rdx
0x180a9d4e3: call 0x18049bcf0
0x180a9d4e8: xor edx, edx
0x180a9d4ea: mov rcx, rbx
0x180a9d4ed: call 0x1806f32a0 ; Torappu.Battle.Deck/Card.get_playerSide
0x180a9d4f2: xor edx, edx
0x180a9d4f4: mov dword ptr [rsp + 0x60], eax
0x180a9d4f8: mov rcx, rbx
0x180a9d4fb: call 0x1806f2540 ; Torappu.Battle.Deck/Card.get_dontOccupyDeployCnt
0x180a9d500: xor r8d, r8d
0x180a9d503: mov byte ptr [rsp + 0x64], al
0x180a9d507: mov rdx, rbx
0x180a9d50a: lea rcx, [rbp - 0x60]
0x180a9d50e: call 0x1806f1ea0 ; Torappu.Battle.Deck/Card.get_additionalBuildCondition
0x180a9d513: cmp byte ptr [rip + 0x853b556], 0
0x180a9d51a: movups xmm1, xmmword ptr [rax]
0x180a9d51d: movsd xmm0, qword ptr [rax + 0x10]
0x180a9d522: movups xmmword ptr [rsp + 0x68], xmm1
0x180a9d527: movsd qword ptr [rsp + 0x78], xmm0
0x180a9d52d: jbe 0x180a9d537
0x180a9d52f: mov rcx, qword ptr [rdi]
0x180a9d532: call 0x180457010
0x180a9d537: mov rdx, qword ptr [rdi]
0x180a9d53a: mov rcx, rdi
0x180a9d53d: mov rax, qword ptr [rdx + 0xe80]
0x180a9d544: mov rdx, qword ptr [rdx + 0xe88]
0x180a9d54b: call rax
0x180a9d54d: xor edx, edx
0x180a9d54f: mov dword ptr [rsp + 0x48], eax
0x180a9d553: mov rcx, rbx
0x180a9d556: call 0x1806f1f30 ; Torappu.Battle.Deck/Card.get_advancedBuildState
0x180a9d55b: movaps xmm0, xmmword ptr [rsp + 0x30]
0x180a9d560: lea rdx, [rbp - 0x40]
0x180a9d564: movaps xmm1, xmmword ptr [rsp + 0x40]
0x180a9d569: xor r8d, r8d
0x180a9d56c: movaps xmmword ptr [rbp - 0x40], xmm0
0x180a9d570: mov rcx, rdi
0x180a9d573: movaps xmm0, xmmword ptr [rsp + 0x50]
0x180a9d578: movaps xmmword ptr [rbp - 0x30], xmm1
0x180a9d57c: movaps xmm1, xmmword ptr [rsp + 0x60]
0x180a9d581: movaps xmmword ptr [rbp - 0x20], xmm0
0x180a9d585: movaps xmm0, xmmword ptr [rsp + 0x70]
0x180a9d58a: movaps xmmword ptr [rbp - 0x10], xmm1
0x180a9d58e: mov dword ptr [rbp - 0x80], eax
0x180a9d591: movsd xmm1, qword ptr [rbp - 0x80]
0x180a9d596: movaps xmmword ptr [rbp], xmm0
0x180a9d59a: movsd qword ptr [rbp + 0x10], xmm1
0x180a9d59f: call 0x180aaaaf0 ; Torappu.Battle.Character._BuildAtInternal
0x180a9d5a4: jmp 0x180a9d5c2
0x180a9d5a6: mov qword ptr [rsp + 0x28], 0
0x180a9d5af: mov r9, rsi
0x180a9d5b2: mov r8, rbx
0x180a9d5b5: mov dword ptr [rsp + 0x20], r14d
0x180a9d5ba: mov rdx, rdi
0x180a9d5bd: call 0x1832f7ec0 ; XLua.DelegateBridge.__Gen_Delegate_Imp1426
0x180a9d5c2: lea r11, [rsp + 0x120]
0x180a9d5ca: mov rbx, qword ptr [r11 + 0x10]
0x180a9d5ce: mov rsi, qword ptr [r11 + 0x18]
0x180a9d5d2: mov rdi, qword ptr [r11 + 0x20]
0x180a9d5d6: mov r14, qword ptr [r11 + 0x28]
0x180a9d5da: mov rsp, r11
0x180a9d5dd: pop rbp
0x180a9d5de: ret
0x180a9d5df: call 0x18049c3c0
0x180a9d5e4: int3
0x180a9d5e5: int3
0x180a9d5e6: int3
0x180a9d5e7: int3
0x180a9d5e8: int3
0x180a9d5e9: int3
0x180a9d5ea: int3
0x180a9d5eb: int3
0x180a9d5ec: int3
0x180a9d5ed: int3
0x180a9d5ee: int3
0x180a9d5ef: int3
