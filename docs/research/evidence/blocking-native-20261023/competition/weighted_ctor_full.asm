; Torappu.Battle.FilterUtil.weighted_ctor_full metadata=-1 token=0x0 VA=0x185528bb0 RVA=0x5528bb0 size=0x29c
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
0000000185528cac: mov      rax, qword ptr [rax + 0xc0]
0000000185528cb3: mov      rax, qword ptr [rax + 8]
0000000185528cb7: test     byte ptr [rax + 0x136], 1
0000000185528cbe: jne      0x185528cc8
0000000185528cc0: mov      rcx, rax
0000000185528cc3: call     0x1804463f0
0000000185528cc8: mov      rax, qword ptr [rax + 0xb8]
0000000185528ccf: mov      rbp, qword ptr [rax + 0x20]
0000000185528cd3: test     rbp, rbp
0000000185528cd6: je       0x185528e30
0000000185528cdc: xor      edx, edx
0000000185528cde: mov      rcx, rbp
0000000185528ce1: call     0x1830626c0 ; XLua.DelegateBridge.InvokeSessionStart [15516]
0000000185528ce6: movups   xmm0, xmmword ptr [rdi]
0000000185528ce9: mov      rax, qword ptr [rsi + 0x20]
0000000185528ced: movups   xmmword ptr [rsp + 0x20], xmm0
0000000185528cf2: test     byte ptr [rax + 0x136], 1
0000000185528cf9: movups   xmm0, xmmword ptr [rdi + 0x10]
0000000185528cfd: movups   xmmword ptr [rsp + 0x40], xmm0
0000000185528d02: jne      0x185528d0c
0000000185528d04: mov      rcx, rax
0000000185528d07: call     0x1804463f0
0000000185528d0c: mov      rax, qword ptr [rax + 0xc0]
0000000185528d13: mov      rcx, qword ptr [rax + 0x10]
0000000185528d17: cmp      qword ptr [rcx + 0x20], 0
0000000185528d1c: jne      0x185528d40
0000000185528d1e: mov      rax, qword ptr [rsi + 0x20]
0000000185528d22: test     byte ptr [rax + 0x136], 1
0000000185528d29: jne      0x185528d33
0000000185528d2b: mov      rcx, rax
0000000185528d2e: call     0x1804463f0
0000000185528d33: mov      rax, qword ptr [rax + 0xc0]
0000000185528d3a: mov      rcx, qword ptr [rax + 0x10]
0000000185528d3e: call     qword ptr [rcx]
0000000185528d40: mov      rax, qword ptr [rsi + 0x20]
0000000185528d44: test     byte ptr [rax + 0x136], 1
0000000185528d4b: jne      0x185528d55
0000000185528d4d: mov      rcx, rax
0000000185528d50: call     0x1804463f0
0000000185528d55: mov      r8, qword ptr [rax + 0xc0]
0000000185528d5c: lea      rdx, [rsp + 0x20]
0000000185528d61: movups   xmm0, xmmword ptr [rsp + 0x20]
0000000185528d66: mov      rcx, rbp
0000000185528d69: movups   xmm1, xmmword ptr [rsp + 0x40]
0000000185528d6e: mov      r8, qword ptr [r8 + 0x10]
0000000185528d72: movaps   xmmword ptr [rsp + 0x20], xmm0
0000000185528d77: movaps   xmmword ptr [rsp + 0x30], xmm1
0000000185528d7c: call     0x1844c5480
0000000185528d81: mov      r8, qword ptr [rip + 0x3388d50] ; GenericMethodInfo 232031 @0x1888b1ad8
0000000185528d88: mov      rdx, rbx
0000000185528d8b: mov      rcx, rbp
0000000185528d8e: call     0x1844c52d0
0000000185528d93: mov      rax, qword ptr [rsi + 0x20]
0000000185528d97: test     byte ptr [rax + 0x136], 1
0000000185528d9e: jne      0x185528da8
0000000185528da0: mov      rcx, rax
0000000185528da3: call     0x1804463f0
0000000185528da8: mov      rax, qword ptr [rax + 0xc0]
0000000185528daf: mov      rcx, qword ptr [rax + 0x18]
0000000185528db3: cmp      qword ptr [rcx + 0x20], 0
0000000185528db8: jne      0x185528ddc
0000000185528dba: mov      rax, qword ptr [rsi + 0x20]
0000000185528dbe: test     byte ptr [rax + 0x136], 1
0000000185528dc5: jne      0x185528dcf
0000000185528dc7: mov      rcx, rax
0000000185528dca: call     0x1804463f0
0000000185528dcf: mov      rax, qword ptr [rax + 0xc0]
0000000185528dd6: mov      rcx, qword ptr [rax + 0x18]
0000000185528dda: call     qword ptr [rcx]
0000000185528ddc: mov      rax, qword ptr [rsi + 0x20]
0000000185528de0: test     byte ptr [rax + 0x136], 1
0000000185528de7: jne      0x185528df1
0000000185528de9: mov      rcx, rax
0000000185528dec: call     0x1804463f0
0000000185528df1: mov      r8, qword ptr [rax + 0xc0]
0000000185528df8: mov      rdx, r14
0000000185528dfb: mov      rcx, rbp
0000000185528dfe: mov      r8, qword ptr [r8 + 0x18]
0000000185528e02: call     0x1844c6730
0000000185528e07: mov      r8, qword ptr [rip + 0x3391092] ; GenericMethodInfo 232035 @0x1888b9ea0
0000000185528e0e: mov      edx, r15d
0000000185528e11: mov      rcx, rbp
0000000185528e14: call     0x1844c6210
0000000185528e19: xor      r8d, r8d
0000000185528e1c: xor      edx, edx
0000000185528e1e: mov      rcx, rbp
0000000185528e21: call     0x183062770 ; XLua.DelegateBridge.Invoke [15517]
0000000185528e26: xor      edx, edx
0000000185528e28: mov      rcx, rbp
0000000185528e2b: call     0x183062640 ; XLua.DelegateBridge.InvokeSessionEnd [15518]
0000000185528e30: mov      rbx, qword ptr [rsp + 0x70]
0000000185528e35: mov      rbp, qword ptr [rsp + 0x78]
0000000185528e3a: mov      rsi, qword ptr [rsp + 0x80]
0000000185528e42: add      rsp, 0x50
0000000185528e46: pop      r15
0000000185528e48: pop      r14
0000000185528e4a: pop      rdi
0000000185528e4b: ret      