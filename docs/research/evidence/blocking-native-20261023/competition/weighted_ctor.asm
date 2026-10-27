; Torappu.Battle.FilterUtil.weighted_ctor metadata=-1 token=0x0 VA=0x185528bb0 RVA=0x5528bb0 size=0x100
0000000185528bb0: mov      qword ptr [rsp + 8], rbx
0000000185528bb5: mov      qword ptr [rsp + 0x10], rbp
0000000185528bba: mov      qword ptr [rsp + 0x18], rsi
0000000185528bbf: push     rdi
0000000185528bc0: push     r14
0000000185528bc2: push     r15
0000000185528bc4: sub      rsp, 0x50
0000000185528bc8: cmp      byte ptr [rip + 0x3793c01], 0
0000000185528bcf: mov      r15d, r9d
0000000185528bd2: mov      r14, r8
0000000185528bd5: mov      rbx, rdx
0000000185528bd8: mov      rdi, rcx
0000000185528bdb: jne      0x185528c08
0000000185528bdd: lea      rcx, [rip + 0x3388ef4] ; GenericMethodInfo 232031 @0x1888b1ad8
0000000185528be4: call     0x18048bf00
0000000185528be9: lea      rcx, [rip + 0x33912b0] ; GenericMethodInfo 232035 @0x1888b9ea0
0000000185528bf0: call     0x18048bf00
0000000185528bf5: lea      rcx, [rip + 0x3331b04] ; TypeInfo Torappu.FP @0x18885a700
0000000185528bfc: call     0x18048bf00
0000000185528c01: mov      byte ptr [rip + 0x3793bc8], 1
0000000185528c08: lea      rcx, [rdi + 0x10]
0000000185528c0c: mov      qword ptr [rdi], rbx
0000000185528c0f: mov      rdx, r14
0000000185528c12: mov      qword ptr [rdi + 0x10], r14
0000000185528c16: call     0x18048b9e0
0000000185528c1b: mov      dword ptr [rdi + 0x18], r15d
0000000185528c1f: mov      rax, qword ptr [rip + 0x3331ada] ; TypeInfo Torappu.FP @0x18885a700
0000000185528c26: cmp      dword ptr [rax + 0xe0], 0
0000000185528c2d: jne      0x185528c3e
0000000185528c2f: mov      rcx, rax
0000000185528c32: call     0x18048c140
0000000185528c37: mov      rax, qword ptr [rip + 0x3331ac2] ; TypeInfo Torappu.FP @0x18885a700
0000000185528c3e: mov      rax, qword ptr [rax + 0xb8]
0000000185528c45: mov      rsi, qword ptr [rsp + 0x90]
0000000185528c4d: mov      rcx, qword ptr [rax + 0x38]
0000000185528c51: mov      qword ptr [rdi + 8], rcx
0000000185528c55: mov      rax, qword ptr [rsi + 0x20]
0000000185528c59: test     byte ptr [rax + 0x136], 1
0000000185528c60: jne      0x185528c6a
0000000185528c62: mov      rcx, rax
0000000185528c65: call     0x1804463f0
0000000185528c6a: mov      rax, qword ptr [rax + 0xc0]
0000000185528c71: mov      rax, qword ptr [rax + 8]
0000000185528c75: test     byte ptr [rax + 0x136], 1
0000000185528c7c: jne      0x185528c86
0000000185528c7e: mov      rcx, rax
0000000185528c81: call     0x1804463f0
0000000185528c86: cmp      dword ptr [rax + 0xe0], 0
0000000185528c8d: jne      0x185528c97
0000000185528c8f: mov      rcx, rax
0000000185528c92: call     0x18048c140
0000000185528c97: mov      rax, qword ptr [rsi + 0x20]
0000000185528c9b: test     byte ptr [rax + 0x136], 1
0000000185528ca2: jne      0x185528cac
0000000185528ca4: mov      rcx, rax
0000000185528ca7: call     0x1804463f0