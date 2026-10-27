; Torappu.Battle.FilterUtil.weighted_compare_full metadata=-1 token=0x0 VA=0x1855279c0 RVA=0x55279c0 size=0x990
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
0000000185527cc0: mov      qword ptr [rbp + 0x40], rax
0000000185527cc4: movups   xmmword ptr [rbp - 0x20], xmm0
0000000185527cc8: mov      rcx, qword ptr [rbp - 0x20]
0000000185527ccc: call     0x1866ff410
0000000185527cd1: mov      rcx, qword ptr [rip + 0x339bf60] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000185527cd8: mov      rsi, rax
0000000185527cdb: mov      rbx, qword ptr [rbp + 0x40]
0000000185527cdf: cmp      dword ptr [rcx + 0xe0], 0
0000000185527ce6: jne      0x185527ced
0000000185527ce8: call     0x18048c140
0000000185527ced: xor      r8d, r8d
0000000185527cf0: mov      rdx, rsi
0000000185527cf3: mov      rcx, rbx
0000000185527cf6: call     0x1866e46f0
0000000185527cfb: test     al, al
0000000185527cfd: je       0x1855280be
0000000185527d03: mov      rcx, qword ptr [rip + 0x33329f6] ; TypeInfo Torappu.FP @0x18885a700
0000000185527d0a: mov      rbx, qword ptr [r13]
0000000185527d0e: mov      rdi, qword ptr [rbp + 0x40]
0000000185527d12: cmp      dword ptr [rcx + 0xe0], 0
0000000185527d19: jne      0x185527d20
0000000185527d1b: call     0x18048c140
0000000185527d20: xor      r8d, r8d
0000000185527d23: mov      rdx, rdi
0000000185527d26: mov      rcx, rbx
0000000185527d29: call     0x1866fba10
0000000185527d2e: mov      rbx, rax
0000000185527d31: mov      rax, qword ptr [r14 + 0x20]
0000000185527d35: test     byte ptr [rax + 0x136], 1
0000000185527d3c: jne      0x185527d46
0000000185527d3e: mov      rcx, rax
0000000185527d41: call     0x1804463f0
0000000185527d46: mov      rax, qword ptr [rax + 0xc0]
0000000185527d4d: mov      rax, qword ptr [rax + 8]
0000000185527d51: test     byte ptr [rax + 0x136], 1
0000000185527d58: jne      0x185527d62
0000000185527d5a: mov      rcx, rax
0000000185527d5d: call     0x1804463f0
0000000185527d62: cmp      dword ptr [rax + 0xe0], 0
0000000185527d69: jne      0x185527d73
0000000185527d6b: mov      rcx, rax
0000000185527d6e: call     0x18048c140
0000000185527d73: mov      rax, qword ptr [r14 + 0x20]
0000000185527d77: test     byte ptr [rax + 0x136], 1
0000000185527d7e: jne      0x185527d88
0000000185527d80: mov      rcx, rax
0000000185527d83: call     0x1804463f0
0000000185527d88: mov      rax, qword ptr [rax + 0xc0]
0000000185527d8f: mov      rax, qword ptr [rax + 8]
0000000185527d93: test     byte ptr [rax + 0x136], 1
0000000185527d9a: jne      0x185527da4
0000000185527d9c: mov      rcx, rax
0000000185527d9f: call     0x1804463f0
0000000185527da4: mov      rdx, qword ptr [rax + 0xb8]
0000000185527dab: xor      r8d, r8d
0000000185527dae: mov      rcx, rbx
0000000185527db1: mov      rdx, qword ptr [rdx]
0000000185527db4: call     0x1866fd730
0000000185527db9: mov      rcx, qword ptr [rip + 0x3369818] ; TypeInfo Torappu.TSMath @0x1888915d8
0000000185527dc0: mov      rbx, rax
0000000185527dc3: cmp      dword ptr [rcx + 0xe0], 0
0000000185527dca: jne      0x185527dd1
0000000185527dcc: call     0x18048c140
0000000185527dd1: xor      edx, edx
0000000185527dd3: mov      rcx, rbx
0000000185527dd6: call     0x1866ff410
0000000185527ddb: movups   xmm0, xmmword ptr [r12]
0000000185527de0: xor      r8d, r8d
0000000185527de3: mov      qword ptr [rbp + 0x40], rax
0000000185527de7: mov      rdx, rsi
0000000185527dea: movups   xmmword ptr [rbp - 0x20], xmm0
0000000185527dee: mov      rcx, qword ptr [rbp - 0x20]
0000000185527df2: call     0x1866fba10
0000000185527df7: mov      rbx, rax
0000000185527dfa: mov      rax, qword ptr [r14 + 0x20]
0000000185527dfe: test     byte ptr [rax + 0x136], 1
0000000185527e05: jne      0x185527e0f
0000000185527e07: mov      rcx, rax
0000000185527e0a: call     0x1804463f0
0000000185527e0f: mov      rax, qword ptr [rax + 0xc0]
0000000185527e16: mov      rax, qword ptr [rax + 8]
0000000185527e1a: test     byte ptr [rax + 0x136], 1
0000000185527e21: jne      0x185527e2b
0000000185527e23: mov      rcx, rax
0000000185527e26: call     0x1804463f0
0000000185527e2b: mov      rcx, rbx
0000000185527e2e: jmp      0x18552809f
0000000185527e33: mov      rax, qword ptr [r14 + 0x20]
0000000185527e37: test     byte ptr [rax + 0x136], 1
0000000185527e3e: jne      0x185527e48
0000000185527e40: mov      rcx, rax
0000000185527e43: call     0x1804463f0
0000000185527e48: mov      rax, qword ptr [rax + 0xc0]
0000000185527e4f: mov      rax, qword ptr [rax + 8]
0000000185527e53: test     byte ptr [rax + 0x136], 1
0000000185527e5a: jne      0x185527e64
0000000185527e5c: mov      rcx, rax
0000000185527e5f: call     0x1804463f0
0000000185527e64: cmp      dword ptr [rax + 0xe0], 0
0000000185527e6b: jne      0x185527e75
0000000185527e6d: mov      rcx, rax
0000000185527e70: call     0x18048c140
0000000185527e75: mov      rax, qword ptr [r14 + 0x20]
0000000185527e79: test     byte ptr [rax + 0x136], 1
0000000185527e80: jne      0x185527e8a
0000000185527e82: mov      rcx, rax
0000000185527e85: call     0x1804463f0
0000000185527e8a: mov      rax, qword ptr [rax + 0xc0]
0000000185527e91: mov      rax, qword ptr [rax + 8]
0000000185527e95: test     byte ptr [rax + 0x136], 1
0000000185527e9c: jne      0x185527ea6
0000000185527e9e: mov      rcx, rax
0000000185527ea1: call     0x1804463f0
0000000185527ea6: mov      rcx, qword ptr [rip + 0x3332853] ; TypeInfo Torappu.FP @0x18885a700
0000000185527ead: mov      rax, qword ptr [rax + 0xb8]
0000000185527eb4: cmp      dword ptr [rcx + 0xe0], 0
0000000185527ebb: mov      r15d, dword ptr [rax + 8]
0000000185527ebf: jne      0x185527ec6
0000000185527ec1: call     0x18048c140
0000000185527ec6: xor      edx, edx
0000000185527ec8: mov      ecx, r15d
0000000185527ecb: call     0x1866fdac0
0000000185527ed0: xor      r8d, r8d
0000000185527ed3: mov      rdx, rax
0000000185527ed6: mov      rcx, rbx
0000000185527ed9: call     0x185ed91f0
0000000185527ede: test     al, al
0000000185527ee0: je       0x1855280be
0000000185527ee6: mov      rax, qword ptr [r14 + 0x20]
0000000185527eea: test     byte ptr [rax + 0x136], 1
0000000185527ef1: jne      0x185527efb
0000000185527ef3: mov      rcx, rax
0000000185527ef6: call     0x1804463f0
0000000185527efb: mov      rax, qword ptr [rax + 0xc0]
0000000185527f02: mov      rax, qword ptr [rax + 8]
0000000185527f06: test     byte ptr [rax + 0x136], 1
0000000185527f0d: jne      0x185527f17
0000000185527f0f: mov      rcx, rax
0000000185527f12: call     0x1804463f0
0000000185527f17: cmp      dword ptr [rax + 0xe0], 0
0000000185527f1e: jne      0x185527f28
0000000185527f20: mov      rcx, rax
0000000185527f23: call     0x18048c140
0000000185527f28: mov      rax, qword ptr [r14 + 0x20]
0000000185527f2c: test     byte ptr [rax + 0x136], 1
0000000185527f33: jne      0x185527f3d
0000000185527f35: mov      rcx, rax
0000000185527f38: call     0x1804463f0
0000000185527f3d: mov      rax, qword ptr [rax + 0xc0]
0000000185527f44: mov      rax, qword ptr [rax + 8]
0000000185527f48: test     byte ptr [rax + 0x136], 1
0000000185527f4f: jne      0x185527f59
0000000185527f51: mov      rcx, rax
0000000185527f54: call     0x1804463f0
0000000185527f59: mov      rcx, qword ptr [rip + 0x33327a0] ; TypeInfo Torappu.FP @0x18885a700
0000000185527f60: mov      rax, qword ptr [rax + 0xb8]
0000000185527f67: cmp      dword ptr [rcx + 0xe0], 0
0000000185527f6e: mov      ebx, dword ptr [rax + 8]
0000000185527f71: jne      0x185527f78
0000000185527f73: call     0x18048c140
0000000185527f78: xor      edx, edx
0000000185527f7a: mov      ecx, ebx
0000000185527f7c: call     0x1866fdac0
0000000185527f81: xor      r8d, r8d
0000000185527f84: mov      rdx, rax
0000000185527f87: mov      rcx, rdi
0000000185527f8a: call     0x185ed91f0
0000000185527f8f: test     al, al
0000000185527f91: je       0x1855280be
0000000185527f97: mov      rax, qword ptr [r14 + 0x20]
0000000185527f9b: mov      rdi, qword ptr [r13]
0000000185527f9f: test     byte ptr [rax + 0x136], 1
0000000185527fa6: jne      0x185527fb0
0000000185527fa8: mov      rcx, rax
0000000185527fab: call     0x1804463f0
0000000185527fb0: mov      rax, qword ptr [rax + 0xc0]
0000000185527fb7: mov      rax, qword ptr [rax + 8]
0000000185527fbb: test     byte ptr [rax + 0x136], 1
0000000185527fc2: jne      0x185527fcc
0000000185527fc4: mov      rcx, rax
0000000185527fc7: call     0x1804463f0
0000000185527fcc: cmp      dword ptr [rax + 0xe0], 0
0000000185527fd3: jne      0x185527fdd
0000000185527fd5: mov      rcx, rax
0000000185527fd8: call     0x18048c140
0000000185527fdd: mov      rax, qword ptr [r14 + 0x20]
0000000185527fe1: test     byte ptr [rax + 0x136], 1
0000000185527fe8: jne      0x185527ff2
0000000185527fea: mov      rcx, rax
0000000185527fed: call     0x1804463f0
0000000185527ff2: mov      rax, qword ptr [rax + 0xc0]
0000000185527ff9: mov      rax, qword ptr [rax + 8]
0000000185527ffd: test     byte ptr [rax + 0x136], 1
0000000185528004: jne      0x18552800e
0000000185528006: mov      rcx, rax
0000000185528009: call     0x1804463f0
000000018552800e: mov      rcx, qword ptr [rip + 0x33326eb] ; TypeInfo Torappu.FP @0x18885a700
0000000185528015: mov      rbx, qword ptr [rax + 0xb8]
000000018552801c: cmp      dword ptr [rcx + 0xe0], 0
0000000185528023: mov      rbx, qword ptr [rbx]
0000000185528026: jne      0x18552802d
0000000185528028: call     0x18048c140
000000018552802d: xor      r8d, r8d
0000000185528030: mov      rdx, rbx
0000000185528033: mov      rcx, rdi
0000000185528036: call     0x1866fd730
000000018552803b: mov      rcx, qword ptr [rip + 0x3369596] ; TypeInfo Torappu.TSMath @0x1888915d8
0000000185528042: mov      rbx, rax
0000000185528045: cmp      dword ptr [rcx + 0xe0], 0
000000018552804c: jne      0x185528053
000000018552804e: call     0x18048c140
0000000185528053: xor      edx, edx
0000000185528055: mov      rcx, rbx
0000000185528058: call     0x1866ff410
000000018552805d: movups   xmm0, xmmword ptr [r12]
0000000185528062: mov      qword ptr [rbp + 0x40], rax
0000000185528066: mov      rax, qword ptr [r14 + 0x20]
000000018552806a: movups   xmmword ptr [rbp - 0x20], xmm0
000000018552806e: test     byte ptr [rax + 0x136], 1
0000000185528075: jne      0x18552807f
0000000185528077: mov      rcx, rax
000000018552807a: call     0x1804463f0
000000018552807f: mov      rax, qword ptr [rax + 0xc0]
0000000185528086: mov      rax, qword ptr [rax + 8]
000000018552808a: test     byte ptr [rax + 0x136], 1
0000000185528091: jne      0x18552809b
0000000185528093: mov      rcx, rax
0000000185528096: call     0x1804463f0
000000018552809b: mov      rcx, qword ptr [rbp - 0x20]
000000018552809f: mov      rdx, qword ptr [rax + 0xb8]
00000001855280a6: xor      r8d, r8d
00000001855280a9: mov      rdx, qword ptr [rdx]
00000001855280ac: call     0x1866fd730
00000001855280b1: xor      edx, edx
00000001855280b3: mov      rcx, rax
00000001855280b6: call     0x1866ff410
00000001855280bb: mov      rsi, rax
00000001855280be: mov      rcx, qword ptr [rip + 0x339bb73] ; TypeInfo Torappu.MathUtil @0x1888c3c38
00000001855280c5: mov      rbx, qword ptr [rbp + 0x40]
00000001855280c9: mov      r15, qword ptr [rsp + 0xa8]
00000001855280d1: cmp      dword ptr [rcx + 0xe0], 0
00000001855280d8: jne      0x1855280df
00000001855280da: call     0x18048c140
00000001855280df: xor      r8d, r8d
00000001855280e2: mov      rdx, rsi
00000001855280e5: mov      rcx, rbx
00000001855280e8: call     0x1866e46f0
00000001855280ed: test     al, al
00000001855280ef: je       0x1855281c9
00000001855280f5: mov      rdi, qword ptr [r13 + 0x10]
00000001855280f9: test     rdi, rdi
00000001855280fc: je       0x185528344
0000000185528102: mov      rax, qword ptr [r14 + 0x20]
0000000185528106: test     byte ptr [rax + 0x136], 1
000000018552810d: jne      0x185528117
000000018552810f: mov      rcx, rax
0000000185528112: call     0x1804463f0
0000000185528117: mov      rax, qword ptr [rax + 0xc0]
000000018552811e: mov      rbx, qword ptr [rax + 0x30]
0000000185528122: test     byte ptr [rbx + 0x136], 1
0000000185528129: jne      0x185528136
000000018552812b: mov      rcx, rbx
000000018552812e: call     0x1804463f0
0000000185528133: mov      rbx, rax
0000000185528136: cmp      byte ptr [rip + 0x37a46b3], 0
000000018552813d: mov      rsi, qword ptr [rdi]
0000000185528140: je       0x18552814a
0000000185528142: mov      rcx, rsi
0000000185528145: call     0x180446d00
000000018552814a: movzx    edx, word ptr [rsi + 0x12e]
0000000185528151: xor      ecx, ecx
0000000185528153: cmp      cx, dx
0000000185528156: jae      0x185528174
0000000185528158: mov      r8, qword ptr [rsi + 0xb0]
000000018552815f: nop      
0000000185528160: movzx    eax, cx
0000000185528163: add      rax, rax
0000000185528166: cmp      qword ptr [r8 + rax*8], rbx
000000018552816a: je       0x1855281b1
000000018552816c: inc      cx
000000018552816f: cmp      cx, dx
0000000185528172: jb       0x185528160
0000000185528174: xor      r8d, r8d
0000000185528177: mov      rdx, rbx
000000018552817a: mov      rcx, rdi
000000018552817d: call     0x180445cc0
0000000185528182: mov      r9, qword ptr [rax]
0000000185528185: mov      rcx, rdi
0000000185528188: mov      r8, qword ptr [rax + 8]
000000018552818c: mov      rdx, qword ptr [r12 + 0x10]
0000000185528191: call     r9
0000000185528194: mov      rsi, qword ptr [rsp + 0x90]
000000018552819c: mov      rdi, qword ptr [rsp + 0x98]
00000001855281a4: add      rsp, 0x60
00000001855281a8: pop      r14
00000001855281aa: pop      r13
00000001855281ac: pop      r12
00000001855281ae: pop      rbx
00000001855281af: pop      rbp
00000001855281b0: ret      
00000001855281b1: movzx    ecx, cx
00000001855281b4: add      rcx, rcx
00000001855281b7: movsxd   rax, dword ptr [r8 + rcx*8 + 8]
00000001855281bc: add      rax, 0x14
00000001855281c0: shl      rax, 4
00000001855281c4: add      rax, rsi
00000001855281c7: jmp      0x185528182
00000001855281c9: mov      rcx, qword ptr [rip + 0x3332530] ; TypeInfo Torappu.FP @0x18885a700
00000001855281d0: cmp      dword ptr [rcx + 0xe0], 0
00000001855281d7: jne      0x1855281de
00000001855281d9: call     0x18048c140
00000001855281de: xor      r8d, r8d
00000001855281e1: lea      rcx, [rbp + 0x40]
00000001855281e5: mov      rdx, rsi
00000001855281e8: call     0x1866fb550
00000001855281ed: jmp      0x185528194
00000001855281ef: xor      edx, edx
00000001855281f1: mov      rcx, rbx
00000001855281f4: call     0x1830626c0 ; XLua.DelegateBridge.InvokeSessionStart [15516]
00000001855281f9: movups   xmm0, xmmword ptr [r13]
00000001855281fe: mov      rax, qword ptr [r14 + 0x20]
0000000185528202: movups   xmmword ptr [rbp - 0x40], xmm0
0000000185528206: test     byte ptr [rax + 0x136], 1
000000018552820d: movups   xmm0, xmmword ptr [r13 + 0x10]
0000000185528212: movups   xmmword ptr [rbp - 0x20], xmm0
0000000185528216: jne      0x185528220
0000000185528218: mov      rcx, rax
000000018552821b: call     0x1804463f0
0000000185528220: mov      rax, qword ptr [rax + 0xc0]
0000000185528227: mov      rcx, qword ptr [rax + 0x10]
000000018552822b: cmp      qword ptr [rcx + 0x20], 0
0000000185528230: jne      0x185528254
0000000185528232: mov      rax, qword ptr [r14 + 0x20]
0000000185528236: test     byte ptr [rax + 0x136], 1
000000018552823d: jne      0x185528247
000000018552823f: mov      rcx, rax
0000000185528242: call     0x1804463f0
0000000185528247: mov      rax, qword ptr [rax + 0xc0]
000000018552824e: mov      rcx, qword ptr [rax + 0x10]
0000000185528252: call     qword ptr [rcx]
0000000185528254: mov      rax, qword ptr [r14 + 0x20]
0000000185528258: test     byte ptr [rax + 0x136], 1
000000018552825f: jne      0x185528269
0000000185528261: mov      rcx, rax
0000000185528264: call     0x1804463f0
0000000185528269: mov      r8, qword ptr [rax + 0xc0]
0000000185528270: lea      rdx, [rbp - 0x40]
0000000185528274: movups   xmm0, xmmword ptr [rbp - 0x40]
0000000185528278: mov      rcx, rbx
000000018552827b: movups   xmm1, xmmword ptr [rbp - 0x20]
000000018552827f: mov      r8, qword ptr [r8 + 0x10]
0000000185528283: movaps   xmmword ptr [rbp - 0x40], xmm0
0000000185528287: movaps   xmmword ptr [rbp - 0x30], xmm1
000000018552828b: call     0x1844c5480
0000000185528290: mov      rax, qword ptr [r14 + 0x20]
0000000185528294: test     byte ptr [rax + 0x136], 1
000000018552829b: jne      0x1855282a5
000000018552829d: mov      rcx, rax
00000001855282a0: call     0x1804463f0
00000001855282a5: mov      rax, qword ptr [rax + 0xc0]
00000001855282ac: mov      rcx, qword ptr [rax + 0x10]
00000001855282b0: cmp      qword ptr [rcx + 0x20], 0
00000001855282b5: jne      0x1855282d9
00000001855282b7: mov      rax, qword ptr [r14 + 0x20]
00000001855282bb: test     byte ptr [rax + 0x136], 1
00000001855282c2: jne      0x1855282cc
00000001855282c4: mov      rcx, rax
00000001855282c7: call     0x1804463f0
00000001855282cc: mov      rax, qword ptr [rax + 0xc0]
00000001855282d3: mov      rcx, qword ptr [rax + 0x10]
00000001855282d7: call     qword ptr [rcx]
00000001855282d9: mov      rax, qword ptr [r14 + 0x20]
00000001855282dd: test     byte ptr [rax + 0x136], 1
00000001855282e4: jne      0x1855282ee
00000001855282e6: mov      rcx, rax
00000001855282e9: call     0x1804463f0
00000001855282ee: mov      r8, qword ptr [rax + 0xc0]
00000001855282f5: lea      rdx, [rbp - 0x20]
00000001855282f9: movups   xmm0, xmmword ptr [r12]
00000001855282fe: mov      rcx, rbx
0000000185528301: movups   xmm1, xmmword ptr [r12 + 0x10]
0000000185528307: mov      r8, qword ptr [r8 + 0x10]
000000018552830b: movaps   xmmword ptr [rbp - 0x20], xmm0
000000018552830f: movaps   xmmword ptr [rbp - 0x10], xmm1
0000000185528313: call     0x1844c5480
0000000185528318: xor      r8d, r8d
000000018552831b: mov      edx, 1
0000000185528320: mov      rcx, rbx
0000000185528323: call     0x183062770 ; XLua.DelegateBridge.Invoke [15517]
0000000185528328: mov      rdx, qword ptr [rip + 0x3406bc9] ; GenericMethodInfo 232560 @0x18892eef8
000000018552832f: mov      rcx, rbx
0000000185528332: call     0x1844c7a20
0000000185528337: add      rsp, 0x60
000000018552833b: pop      r14
000000018552833d: pop      r13
000000018552833f: pop      r12
0000000185528341: pop      rbx
0000000185528342: pop      rbp
0000000185528343: ret      
0000000185528344: call     0x18048c0b0
0000000185528349: int3     
000000018552834a: int3     
000000018552834b: int3     
000000018552834c: int3     
000000018552834d: int3     
000000018552834e: int3     
000000018552834f: int3     