; Torappu.Battle.DirectionCursor..ctor metadata=70270 token=0x601127f VA=0x180897ef0 RVA=0x897ef0 size=0x1f0
0000000180897ef0: mov      qword ptr [rsp + 0x10], rbx
0000000180897ef5: mov      qword ptr [rsp + 0x18], rbp
0000000180897efa: push     rsi
0000000180897efb: push     rdi
0000000180897efc: push     r12
0000000180897efe: push     r13
0000000180897f00: push     r15
0000000180897f02: sub      rsp, 0xa0
0000000180897f09: cmp      byte ptr [rip + 0x83f95cd], 0
0000000180897f10: mov      rdi, r8
0000000180897f13: movaps   xmmword ptr [rsp + 0x80], xmm7
0000000180897f1b: mov      rbp, rdx
0000000180897f1e: movq     xmm7, r9
0000000180897f23: mov      rbx, rcx
0000000180897f26: jne      0x180897f3b
0000000180897f28: lea      rcx, [rip + 0x80d51c9] ; TypeInfo Torappu.Battle.DirectionCursor @0x18896d0f8
0000000180897f2f: call     0x18048bf00
0000000180897f34: mov      byte ptr [rip + 0x83f95a2], 1
0000000180897f3b: movups   xmm0, xmmword ptr [rdi]
0000000180897f3e: lea      r8, [rsp + 0x60]
0000000180897f43: movzx    r15d, byte ptr [rsp + 0x108]
0000000180897f4c: movsd    xmm1, qword ptr [rdi + 0x10]
0000000180897f51: mov      rdx, rbp
0000000180897f54: movzx    r12d, byte ptr [rsp + 0x100]
0000000180897f5d: mov      rcx, rbx
0000000180897f60: mov      rsi, qword ptr [rsp + 0xf0]
0000000180897f68: movzx    r13d, byte ptr [rsp + 0xf8]
0000000180897f71: mov      r9, rsi
0000000180897f74: mov      qword ptr [rsp + 0x38], 0
0000000180897f7d: mov      byte ptr [rsp + 0x30], r15b
0000000180897f82: mov      byte ptr [rsp + 0x28], r12b
0000000180897f87: movaps   xmmword ptr [rsp + 0x60], xmm0
0000000180897f8c: mov      byte ptr [rsp + 0x20], r13b
0000000180897f91: movsd    qword ptr [rsp + 0x70], xmm1
0000000180897f97: call     0x180876c80 ; Torappu.Battle.BasicCursor..ctor [70158]
0000000180897f9c: movsd    qword ptr [rbx + 0x68], xmm7
0000000180897fa1: test     rsi, rsi
0000000180897fa4: je       0x1808980da
0000000180897faa: mov      qword ptr [rsp + 0xd0], r14
0000000180897fb2: xor      edx, edx
0000000180897fb4: mov      rcx, rsi
0000000180897fb7: movaps   xmmword ptr [rsp + 0x90], xmm6
0000000180897fbf: call     0x180ad4090 ; Torappu.Battle.VisualObject.get_gridPosition [77871]
0000000180897fc4: movzx    r14d, byte ptr [rsp + 0x110]
0000000180897fcd: mov      byte ptr [rbx + 0x78], r14b
0000000180897fd1: mov      qword ptr [rbx + 0x70], rax
0000000180897fd5: cmp      byte ptr [rip + 0x8434814], 0
0000000180897fdc: jbe      0x180897fe6
0000000180897fde: mov      rcx, qword ptr [rbx]
0000000180897fe1: call     0x180446d00
0000000180897fe6: mov      rdx, qword ptr [rbx]
0000000180897fe9: mov      rcx, rbx
0000000180897fec: mov      rax, qword ptr [rdx + 0x1b0]
0000000180897ff3: mov      rdx, qword ptr [rdx + 0x1b8]
0000000180897ffa: call     rax
0000000180897ffc: cmp      byte ptr [rip + 0x83f94d4], 0
0000000180898003: movaps   xmm6, xmm0
0000000180898006: jne      0x18089801b
0000000180898008: lea      rcx, [rip + 0x80d50e9] ; TypeInfo Torappu.Battle.DirectionCursor @0x18896d0f8
000000018089800f: call     0x18048bf00
0000000180898014: mov      byte ptr [rip + 0x83f94bc], 1
000000018089801b: mov      rax, qword ptr [rip + 0x80d50d6] ; TypeInfo Torappu.Battle.DirectionCursor @0x18896d0f8
0000000180898022: mov      rcx, qword ptr [rax + 0xb8]
0000000180898029: mov      rcx, qword ptr [rcx + 0x18]
000000018089802d: test     rcx, rcx
0000000180898030: jne      0x180898039
0000000180898032: movss    dword ptr [rbx + 0x7c], xmm6
0000000180898037: jmp      0x180898047
0000000180898039: xor      r9d, r9d
000000018089803c: movaps   xmm2, xmm6
000000018089803f: mov      rdx, rbx
0000000180898042: call     0x1836500a0 ; XLua.DelegateBridge.__Gen_Delegate_Imp81 [2736]
0000000180898047: mov      rax, qword ptr [rip + 0x80d50aa] ; TypeInfo Torappu.Battle.DirectionCursor @0x18896d0f8
000000018089804e: movaps   xmm6, xmmword ptr [rsp + 0x90]
0000000180898056: mov      rcx, qword ptr [rax + 0xb8]
000000018089805d: mov      rcx, qword ptr [rcx + 0x48]
0000000180898061: test     rcx, rcx
0000000180898064: je       0x1808980b1
0000000180898066: movups   xmm0, xmmword ptr [rdi]
0000000180898069: lea      r9, [rsp + 0x60]
000000018089806e: mov      qword ptr [rsp + 0x50], 0
0000000180898077: movsd    xmm1, qword ptr [rdi + 0x10]
000000018089807c: mov      r8, rbp
000000018089807f: mov      byte ptr [rsp + 0x48], r14b
0000000180898084: mov      rdx, rbx
0000000180898087: mov      byte ptr [rsp + 0x40], r15b
000000018089808c: mov      byte ptr [rsp + 0x38], r12b
0000000180898091: mov      byte ptr [rsp + 0x30], r13b
0000000180898096: mov      qword ptr [rsp + 0x28], rsi
000000018089809b: movsd    qword ptr [rsp + 0x20], xmm7
00000001808980a1: movaps   xmmword ptr [rsp + 0x60], xmm0
00000001808980a6: movsd    qword ptr [rsp + 0x70], xmm1
00000001808980ac: call     0x183364c50 ; XLua.DelegateBridge.__Gen_Delegate_Imp3343 [5998]
00000001808980b1: mov      r14, qword ptr [rsp + 0xd0]
00000001808980b9: lea      r11, [rsp + 0xa0]
00000001808980c1: mov      rbx, qword ptr [r11 + 0x38]
00000001808980c5: mov      rbp, qword ptr [r11 + 0x40]
00000001808980c9: movaps   xmm7, xmmword ptr [r11 - 0x20]
00000001808980ce: mov      rsp, r11
00000001808980d1: pop      r15
00000001808980d3: pop      r13
00000001808980d5: pop      r12
00000001808980d7: pop      rdi
00000001808980d8: pop      rsi
00000001808980d9: ret      
00000001808980da: call     0x18048c0b0
00000001808980df: int3     