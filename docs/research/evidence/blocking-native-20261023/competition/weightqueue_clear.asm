; Torappu.Battle.FilterUtil.weightqueue_clear metadata=-1 token=0x0 VA=0x1851b0a00 RVA=0x51b0a00 size=0x100
00000001851b0a00: push     rbx
00000001851b0a02: sub      rsp, 0x20
00000001851b0a06: mov      rbx, qword ptr [rcx + 0x10]
00000001851b0a0a: test     rbx, rbx
00000001851b0a0d: je       0x1851b0a68
00000001851b0a0f: mov      rax, qword ptr [rdx + 0x20]
00000001851b0a13: mov      rcx, qword ptr [rax + 0xc0]
00000001851b0a1a: mov      rax, qword ptr [rcx + 0x98]
00000001851b0a21: cmp      qword ptr [rax + 0x20], 0
00000001851b0a26: jne      0x1851b0a3c
00000001851b0a28: mov      rax, qword ptr [rdx + 0x20]
00000001851b0a2c: mov      rcx, qword ptr [rax + 0xc0]
00000001851b0a33: mov      rax, qword ptr [rcx + 0x98]
00000001851b0a3a: call     qword ptr [rax]
00000001851b0a3c: mov      r8d, dword ptr [rbx + 0x18]
00000001851b0a40: inc      dword ptr [rbx + 0x1c]
00000001851b0a43: mov      dword ptr [rbx + 0x18], 0
00000001851b0a4a: test     r8d, r8d
00000001851b0a4d: jle      0x1851b0a62
00000001851b0a4f: mov      rcx, qword ptr [rbx + 0x10]
00000001851b0a53: xor      r9d, r9d
00000001851b0a56: xor      edx, edx
00000001851b0a58: add      rsp, 0x20
00000001851b0a5c: pop      rbx
00000001851b0a5d: jmp      0x185ee99a0 ; System.Array.Clear [241886]
00000001851b0a62: add      rsp, 0x20
00000001851b0a66: pop      rbx
00000001851b0a67: ret      
00000001851b0a68: call     0x18048c0b0
00000001851b0a6d: int3     
00000001851b0a6e: int3     
00000001851b0a6f: int3     
00000001851b0a70: mov      qword ptr [rsp + 8], rbx
00000001851b0a75: push     rdi
00000001851b0a76: sub      rsp, 0x50
00000001851b0a7a: mov      rdi, qword ptr [rcx + 0x10]
00000001851b0a7e: mov      rbx, rdx
00000001851b0a81: test     rdi, rdi
00000001851b0a84: je       0x1851b0b27
00000001851b0a8a: mov      rax, qword ptr [rdx + 0x20]
00000001851b0a8e: mov      rcx, qword ptr [rax + 0xc0]
00000001851b0a95: mov      rax, qword ptr [rcx + 0xa0]
00000001851b0a9c: cmp      qword ptr [rax + 0x20], 0
00000001851b0aa1: jne      0x1851b0ab7
00000001851b0aa3: mov      rax, qword ptr [rdx + 0x20]
00000001851b0aa7: mov      rcx, qword ptr [rax + 0xc0]
00000001851b0aae: mov      rax, qword ptr [rcx + 0xa0]
00000001851b0ab5: call     qword ptr [rax]
00000001851b0ab7: mov      rax, qword ptr [rbx + 0x20]
00000001851b0abb: lea      rcx, [rsp + 0x20]
00000001851b0ac0: mov      rdx, rdi
00000001851b0ac3: mov      r8, qword ptr [rax + 0xc0]
00000001851b0aca: mov      r8, qword ptr [r8 + 0xa0]
00000001851b0ad1: call     0x184aef040
00000001851b0ad6: mov      rax, qword ptr [rbx + 0x20]
00000001851b0ada: movups   xmm0, xmmword ptr [rsp + 0x20]
00000001851b0adf: movsd    xmm1, qword ptr [rsp + 0x30]
00000001851b0ae5: movups   xmmword ptr [rsp + 0x38], xmm0
00000001851b0aea: movsd    qword ptr [rsp + 0x48], xmm1
00000001851b0af0: mov      rcx, qword ptr [rax + 0xc0]
00000001851b0af7: mov      rax, qword ptr [rcx + 0xa8]