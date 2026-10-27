; Torappu.Battle.FilterUtil.weighted_compare metadata=-1 token=0x0 VA=0x1855279c0 RVA=0x55279c0 size=0x300
00000001855279c0: push     rbp
00000001855279c2: push     rbx
00000001855279c3: push     r12
00000001855279c5: push     r13
00000001855279c7: push     r14
00000001855279c9: mov      rbp, rsp
00000001855279cc: sub      rsp, 0x60
00000001855279d0: cmp      byte ptr [rip + 0x3794dfb], 0
00000001855279d7: mov      r14, r8
00000001855279da: mov      r12, rdx
00000001855279dd: mov      r13, rcx
00000001855279e0: jne      0x185527a19
00000001855279e2: lea      rcx, [rip + 0x340750f] ; GenericMethodInfo 232560 @0x18892eef8
00000001855279e9: call     0x18048bf00
00000001855279ee: lea      rcx, [rip + 0x3332d0b] ; TypeInfo Torappu.FP @0x18885a700
00000001855279f5: call     0x18048bf00
00000001855279fa: lea      rcx, [rip + 0x339c237] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000185527a01: call     0x18048bf00
0000000185527a06: lea      rcx, [rip + 0x3369bcb] ; TypeInfo Torappu.TSMath @0x1888915d8
0000000185527a0d: call     0x18048bf00
0000000185527a12: mov      byte ptr [rip + 0x3794db9], 1
0000000185527a19: mov      rax, qword ptr [r14 + 0x20]
0000000185527a1d: test     byte ptr [rax + 0x136], 1
0000000185527a24: jne      0x185527a2e
0000000185527a26: mov      rcx, rax
0000000185527a29: call     0x1804463f0
0000000185527a2e: mov      rax, qword ptr [rax + 0xc0]
0000000185527a35: mov      rax, qword ptr [rax + 8]
0000000185527a39: test     byte ptr [rax + 0x136], 1
0000000185527a40: jne      0x185527a4a
0000000185527a42: mov      rcx, rax
0000000185527a45: call     0x1804463f0
0000000185527a4a: cmp      dword ptr [rax + 0xe0], 0
0000000185527a51: jne      0x185527a5b
0000000185527a53: mov      rcx, rax
0000000185527a56: call     0x18048c140
0000000185527a5b: mov      rax, qword ptr [r14 + 0x20]
0000000185527a5f: test     byte ptr [rax + 0x136], 1
0000000185527a66: jne      0x185527a70
0000000185527a68: mov      rcx, rax
0000000185527a6b: call     0x1804463f0
0000000185527a70: mov      rax, qword ptr [rax + 0xc0]
0000000185527a77: mov      rax, qword ptr [rax + 8]
0000000185527a7b: test     byte ptr [rax + 0x136], 1
0000000185527a82: jne      0x185527a8c
0000000185527a84: mov      rcx, rax
0000000185527a87: call     0x1804463f0
0000000185527a8c: mov      rax, qword ptr [rax + 0xb8]
0000000185527a93: mov      rbx, qword ptr [rax + 0x30]
0000000185527a97: test     rbx, rbx
0000000185527a9a: jne      0x1855281ef
0000000185527aa0: mov      rcx, qword ptr [rip + 0x3332c59] ; TypeInfo Torappu.FP @0x18885a700
0000000185527aa7: movups   xmm0, xmmword ptr [r12]
0000000185527aac: movups   xmmword ptr [rbp - 0x20], xmm0
0000000185527ab0: cmp      dword ptr [rcx + 0xe0], ebx
0000000185527ab6: jne      0x185527abd
0000000185527ab8: call     0x18048c140
0000000185527abd: mov      rdx, qword ptr [rbp - 0x18]
0000000185527ac1: lea      rcx, [r13 + 8]
0000000185527ac5: xor      r8d, r8d
0000000185527ac8: call     0x1866fb550
0000000185527acd: test     eax, eax
0000000185527acf: jne      0x1855281a4
0000000185527ad5: mov      qword ptr [rsp + 0x90], rsi
0000000185527add: mov      qword ptr [rsp + 0x98], rdi
0000000185527ae5: mov      qword ptr [rsp + 0xa8], r15
0000000185527aed: mov      rcx, qword ptr [rip + 0x3369ae4] ; TypeInfo Torappu.TSMath @0x1888915d8
0000000185527af4: movups   xmm0, xmmword ptr [r12]
0000000185527af9: mov      rbx, qword ptr [r13]
0000000185527afd: mov      qword ptr [rbp + 0x40], rbx
0000000185527b01: movups   xmmword ptr [rbp - 0x20], xmm0
0000000185527b05: mov      rsi, qword ptr [rbp - 0x20]
0000000185527b09: cmp      dword ptr [rcx + 0xe0], eax
0000000185527b0f: jne      0x185527b16
0000000185527b11: call     0x18048c140
0000000185527b16: xor      edx, edx
0000000185527b18: mov      rcx, rbx
0000000185527b1b: call     0x1866fed50
0000000185527b20: xor      edx, edx
0000000185527b22: mov      rcx, rsi
0000000185527b25: mov      rbx, rax
0000000185527b28: call     0x1866fed50
0000000185527b2d: mov      rdi, rax
0000000185527b30: mov      rax, qword ptr [r14 + 0x20]
0000000185527b34: test     byte ptr [rax + 0x136], 1
0000000185527b3b: jne      0x185527b45
0000000185527b3d: mov      rcx, rax
0000000185527b40: call     0x1804463f0
0000000185527b45: mov      rax, qword ptr [rax + 0xc0]
0000000185527b4c: mov      rax, qword ptr [rax + 8]
0000000185527b50: test     byte ptr [rax + 0x136], 1
0000000185527b57: jne      0x185527b61
0000000185527b59: mov      rcx, rax
0000000185527b5c: call     0x1804463f0
0000000185527b61: cmp      dword ptr [rax + 0xe0], 0
0000000185527b68: jne      0x185527b72
0000000185527b6a: mov      rcx, rax
0000000185527b6d: call     0x18048c140
0000000185527b72: mov      rax, qword ptr [r14 + 0x20]
0000000185527b76: test     byte ptr [rax + 0x136], 1
0000000185527b7d: jne      0x185527b87
0000000185527b7f: mov      rcx, rax
0000000185527b82: call     0x1804463f0
0000000185527b87: mov      rax, qword ptr [rax + 0xc0]
0000000185527b8e: mov      rax, qword ptr [rax + 8]
0000000185527b92: test     byte ptr [rax + 0x136], 1
0000000185527b99: jne      0x185527ba3
0000000185527b9b: mov      rcx, rax
0000000185527b9e: call     0x1804463f0
0000000185527ba3: mov      rcx, qword ptr [rip + 0x3332b56] ; TypeInfo Torappu.FP @0x18885a700
0000000185527baa: mov      rax, qword ptr [rax + 0xb8]
0000000185527bb1: cmp      dword ptr [rcx + 0xe0], 0
0000000185527bb8: mov      r15d, dword ptr [rax + 8]
0000000185527bbc: jne      0x185527bc3
0000000185527bbe: call     0x18048c140
0000000185527bc3: xor      edx, edx
0000000185527bc5: mov      ecx, r15d
0000000185527bc8: call     0x1866fdac0
0000000185527bcd: xor      r8d, r8d
0000000185527bd0: mov      rdx, rax
0000000185527bd3: mov      rcx, rbx
0000000185527bd6: call     0x185ed91c0
0000000185527bdb: test     al, al
0000000185527bdd: je       0x185527e33
0000000185527be3: mov      rax, qword ptr [r14 + 0x20]
0000000185527be7: test     byte ptr [rax + 0x136], 1
0000000185527bee: jne      0x185527bf8
0000000185527bf0: mov      rcx, rax
0000000185527bf3: call     0x1804463f0
0000000185527bf8: mov      rax, qword ptr [rax + 0xc0]
0000000185527bff: mov      rax, qword ptr [rax + 8]
0000000185527c03: test     byte ptr [rax + 0x136], 1
0000000185527c0a: jne      0x185527c14
0000000185527c0c: mov      rcx, rax
0000000185527c0f: call     0x1804463f0
0000000185527c14: cmp      dword ptr [rax + 0xe0], 0
0000000185527c1b: jne      0x185527c25
0000000185527c1d: mov      rcx, rax
0000000185527c20: call     0x18048c140
0000000185527c25: mov      rax, qword ptr [r14 + 0x20]
0000000185527c29: test     byte ptr [rax + 0x136], 1
0000000185527c30: jne      0x185527c3a
0000000185527c32: mov      rcx, rax
0000000185527c35: call     0x1804463f0
0000000185527c3a: mov      rax, qword ptr [rax + 0xc0]
0000000185527c41: mov      rax, qword ptr [rax + 8]
0000000185527c45: test     byte ptr [rax + 0x136], 1
0000000185527c4c: jne      0x185527c56
0000000185527c4e: mov      rcx, rax
0000000185527c51: call     0x1804463f0
0000000185527c56: mov      rcx, qword ptr [rip + 0x3332aa3] ; TypeInfo Torappu.FP @0x18885a700
0000000185527c5d: mov      rax, qword ptr [rax + 0xb8]
0000000185527c64: cmp      dword ptr [rcx + 0xe0], 0
0000000185527c6b: mov      r15d, dword ptr [rax + 8]
0000000185527c6f: jne      0x185527c76
0000000185527c71: call     0x18048c140
0000000185527c76: xor      edx, edx
0000000185527c78: mov      ecx, r15d
0000000185527c7b: call     0x1866fdac0
0000000185527c80: xor      r8d, r8d
0000000185527c83: mov      rdx, rax
0000000185527c86: mov      rcx, rdi
0000000185527c89: call     0x185ed91c0
0000000185527c8e: test     al, al
0000000185527c90: je       0x185527e33
0000000185527c96: mov      rcx, qword ptr [rip + 0x336993b] ; TypeInfo Torappu.TSMath @0x1888915d8
0000000185527c9d: mov      rbx, qword ptr [r13]
0000000185527ca1: cmp      dword ptr [rcx + 0xe0], 0
0000000185527ca8: jne      0x185527caf
0000000185527caa: call     0x18048c140
0000000185527caf: xor      edx, edx
0000000185527cb1: mov      rcx, rbx
0000000185527cb4: call     0x1866ff410
0000000185527cb9: movups   xmm0, xmmword ptr [r12]
0000000185527cbe: xor      edx, edx