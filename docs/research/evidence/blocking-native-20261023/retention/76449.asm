; Torappu.Battle.Enemy.BlinkWithDirection metadata=76449 token=0x6012aa2 VA=0x180a6a4c0 RVA=0xa6a4c0 size=0x240
0000000180a6a4c0: push     rbx
0000000180a6a4c2: sub      rsp, 0x80
0000000180a6a4c9: cmp      byte ptr [rip + 0x82283ba], 0
0000000180a6a4d0: mov      rbx, rcx
0000000180a6a4d3: movaps   xmmword ptr [rsp + 0x70], xmm6
0000000180a6a4d8: movq     xmm6, r8
0000000180a6a4dd: movaps   xmmword ptr [rsp + 0x60], xmm7
0000000180a6a4e2: movq     xmm7, rdx
0000000180a6a4e7: movaps   xmmword ptr [rsp + 0x50], xmm8
0000000180a6a4ed: movaps   xmm8, xmm3
0000000180a6a4f1: movsd    qword ptr [rsp + 0x40], xmm7
0000000180a6a4f7: jne      0x180a6a530
0000000180a6a4f9: lea      rcx, [rip + 0x7db11b0] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6a500: call     0x18048bf00
0000000180a6a505: lea      rcx, [rip + 0x7e3179c] ; GenericMethodInfo 262831 @0x18889bca8
0000000180a6a50c: call     0x18048bf00
0000000180a6a511: lea      rcx, [rip + 0x7e319c8] ; GenericMethodInfo 262832 @0x18889bee0
0000000180a6a518: call     0x18048bf00
0000000180a6a51d: lea      rcx, [rip + 0x7e59714] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180a6a524: call     0x18048bf00
0000000180a6a529: mov      byte ptr [rip + 0x822835a], 1
0000000180a6a530: mov      rax, qword ptr [rip + 0x7db1179] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6a537: cmp      dword ptr [rax + 0xe0], 0
0000000180a6a53e: jne      0x180a6a54f
0000000180a6a540: mov      rcx, rax
0000000180a6a543: call     0x18048c140
0000000180a6a548: mov      rax, qword ptr [rip + 0x7db1161] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6a54f: mov      rax, qword ptr [rax + 0xb8]
0000000180a6a556: mov      rcx, qword ptr [rax + 0x590]
0000000180a6a55d: test     rcx, rcx
0000000180a6a560: jne      0x180a6a6a6
0000000180a6a566: cmp      byte ptr [rip + 0x8262284], cl
0000000180a6a56c: jbe      0x180a6a576
0000000180a6a56e: mov      rcx, qword ptr [rbx]
0000000180a6a571: call     0x180446d00
0000000180a6a576: mov      rdx, qword ptr [rbx]
0000000180a6a579: mov      rcx, rbx
0000000180a6a57c: mov      rax, qword ptr [rdx + 0xad0]
0000000180a6a583: mov      rdx, qword ptr [rdx + 0xad8]
0000000180a6a58a: call     rax
0000000180a6a58c: test     al, al
0000000180a6a58e: je       0x180a6a59a
0000000180a6a590: xor      edx, edx
0000000180a6a592: mov      rcx, rbx
0000000180a6a595: call     0x180a74110 ; Torappu.Battle.Enemy.ReleaseBlock [76546]
0000000180a6a59a: mov      rcx, qword ptr [rip + 0x7e59697] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180a6a5a1: cmp      dword ptr [rcx + 0xe0], 0
0000000180a6a5a8: jne      0x180a6a5af
0000000180a6a5aa: call     0x18048c140
0000000180a6a5af: xor      edx, edx
0000000180a6a5b1: movq     rcx, xmm6
0000000180a6a5b6: call     0x1866e5620
0000000180a6a5bb: test     al, al
0000000180a6a5bd: jne      0x180a6a5db
0000000180a6a5bf: xor      r9d, r9d
0000000180a6a5c2: mov      qword ptr [rsp + 0x20], 0
0000000180a6a5cb: xor      r8d, r8d
0000000180a6a5ce: movq     rdx, xmm6
0000000180a6a5d3: mov      rcx, rbx
0000000180a6a5d6: call     0x1806f2f10 ; Torappu.Battle.Entity.FaceTo [66535]
0000000180a6a5db: xor      edx, edx
0000000180a6a5dd: mov      rcx, rbx
0000000180a6a5e0: call     0x180a800c0 ; Torappu.Battle.Enemy.get_stateMachine [76373]
0000000180a6a5e5: test     rax, rax
0000000180a6a5e8: je       0x180a6a6ed
0000000180a6a5ee: mov      rdx, qword ptr [rip + 0x7e318eb] ; GenericMethodInfo 262832 @0x18889bee0
0000000180a6a5f5: mov      rcx, rax
0000000180a6a5f8: call     0x18499ca80
0000000180a6a5fd: test     rax, rax
0000000180a6a600: je       0x180a6a6ed
0000000180a6a606: movss    xmm0, dword ptr [rsp + 0x40]
0000000180a6a60c: xor      edx, edx
0000000180a6a60e: movss    xmm1, dword ptr [rsp + 0x44]
0000000180a6a614: mov      rcx, rbx
0000000180a6a617: movss    dword ptr [rax + 0x34], xmm0
0000000180a6a61c: movss    dword ptr [rax + 0x38], xmm1
0000000180a6a621: call     0x180a800c0 ; Torappu.Battle.Enemy.get_stateMachine [76373]
0000000180a6a626: test     rax, rax
0000000180a6a629: je       0x180a6a6ed
0000000180a6a62f: mov      rdx, qword ptr [rip + 0x7e318aa] ; GenericMethodInfo 262832 @0x18889bee0
0000000180a6a636: mov      rcx, rax
0000000180a6a639: call     0x18499ca80
0000000180a6a63e: test     rax, rax
0000000180a6a641: je       0x180a6a6ed
0000000180a6a647: xor      edx, edx
0000000180a6a649: movss    dword ptr [rax + 0x24], xmm8
0000000180a6a64f: mov      rcx, rbx
0000000180a6a652: call     0x180a800c0 ; Torappu.Battle.Enemy.get_stateMachine [76373]
0000000180a6a657: test     rax, rax
0000000180a6a65a: je       0x180a6a6ed
0000000180a6a660: mov      rdx, qword ptr [rip + 0x7e31879] ; GenericMethodInfo 262832 @0x18889bee0
0000000180a6a667: mov      rcx, rax
0000000180a6a66a: call     0x18499ca80
0000000180a6a66f: test     rax, rax
0000000180a6a672: je       0x180a6a6ed
0000000180a6a674: movzx    ecx, byte ptr [rsp + 0xb0]
0000000180a6a67c: xor      edx, edx
0000000180a6a67e: mov      byte ptr [rax + 0x28], cl
0000000180a6a681: mov      rcx, rbx
0000000180a6a684: call     0x180a800c0 ; Torappu.Battle.Enemy.get_stateMachine [76373]
0000000180a6a689: test     rax, rax
0000000180a6a68c: je       0x180a6a6ed
0000000180a6a68e: mov      r8, qword ptr [rip + 0x7e31613] ; GenericMethodInfo 262831 @0x18889bca8
0000000180a6a695: mov      edx, 0xc
0000000180a6a69a: mov      rcx, rax
0000000180a6a69d: call     0x18499c9d0
0000000180a6a6a2: mov      al, 1
0000000180a6a6a4: jmp      0x180a6a6d4
0000000180a6a6a6: movzx    eax, byte ptr [rsp + 0xb0]
0000000180a6a6ae: movq     r9, xmm6
0000000180a6a6b3: mov      qword ptr [rsp + 0x30], 0
0000000180a6a6bc: movq     r8, xmm7
0000000180a6a6c1: mov      byte ptr [rsp + 0x28], al
0000000180a6a6c5: mov      rdx, rbx
0000000180a6a6c8: movss    dword ptr [rsp + 0x20], xmm8
0000000180a6a6cf: call     0x18339ff10 ; XLua.DelegateBridge.__Gen_Delegate_Imp3713 [6368]
0000000180a6a6d4: movaps   xmm6, xmmword ptr [rsp + 0x70]
0000000180a6a6d9: movaps   xmm7, xmmword ptr [rsp + 0x60]
0000000180a6a6de: movaps   xmm8, xmmword ptr [rsp + 0x50]
0000000180a6a6e4: add      rsp, 0x80
0000000180a6a6eb: pop      rbx
0000000180a6a6ec: ret      
0000000180a6a6ed: call     0x18048c0b0
0000000180a6a6f2: int3     
0000000180a6a6f3: int3     
0000000180a6a6f4: int3     
0000000180a6a6f5: int3     
0000000180a6a6f6: int3     
0000000180a6a6f7: int3     
0000000180a6a6f8: int3     
0000000180a6a6f9: int3     
0000000180a6a6fa: int3     
0000000180a6a6fb: int3     
0000000180a6a6fc: int3     
0000000180a6a6fd: int3     
0000000180a6a6fe: int3     
0000000180a6a6ff: int3     