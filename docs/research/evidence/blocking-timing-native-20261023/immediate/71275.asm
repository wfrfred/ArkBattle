; Torappu.Battle.NetCatcherProjectile.<DoLink_SecondPart>d__30.MoveNext metadata=71275 token=0x601166c VA=0x1808e4a20 RVA=0x8e4a20 size=0x260
00000001808e4a20: mov      qword ptr [rsp + 0x20], rbx
00000001808e4a25: push     rsi
00000001808e4a26: sub      rsp, 0x70
00000001808e4a2a: cmp      byte ptr [rip + 0x83acd9b], 0
00000001808e4a31: mov      rbx, rcx
00000001808e4a34: jne      0x1808e4a79
00000001808e4a36: lea      rcx, [rip + 0x7f36c73] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
00000001808e4a3d: call     0x18048bf00
00000001808e4a42: lea      rcx, [rip + 0x7f4f297] ; TypeInfo type(0x15, data=0x188a36200) @0x188833ce0
00000001808e4a49: call     0x18048bf00
00000001808e4a4e: lea      rcx, [rip + 0x7fdacfb] ; MethodInfo Torappu.Battle.NetCatcherProjectile.<DoLink_SecondPart>b__30_0 [71260] @0x1888bf750
00000001808e4a55: call     0x18048bf00
00000001808e4a5a: lea      rcx, [rip + 0x804e287] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808e4a61: call     0x18048bf00
00000001808e4a66: lea      rcx, [rip + 0x7f85b63] ; TypeInfo Torappu.Battle.Yields @0x18886a5d0
00000001808e4a6d: call     0x18048bf00
00000001808e4a72: mov      byte ptr [rip + 0x83acd53], 1
00000001808e4a79: mov      ecx, dword ptr [rbx + 0x10]
00000001808e4a7c: mov      rsi, qword ptr [rbx + 0x28]
00000001808e4a80: mov      qword ptr [rsp + 0x80], rbp
00000001808e4a88: mov      qword ptr [rsp + 0x88], rdi
00000001808e4a90: movaps   xmmword ptr [rsp + 0x60], xmm6
00000001808e4a95: movaps   xmmword ptr [rsp + 0x50], xmm7
00000001808e4a9a: movaps   xmmword ptr [rsp + 0x40], xmm8
00000001808e4aa0: test     ecx, ecx
00000001808e4aa2: je       0x1808e4abc
00000001808e4aa4: sub      ecx, 1
00000001808e4aa7: je       0x1808e4aae
00000001808e4aa9: cmp      ecx, 1
00000001808e4aac: jne      0x1808e4ab5
00000001808e4aae: mov      dword ptr [rbx + 0x10], 0xffffffff
00000001808e4ab5: xor      al, al
00000001808e4ab7: jmp      0x1808e4c49
00000001808e4abc: mov      qword ptr [rsp + 0x90], r14
00000001808e4ac4: mov      r14, qword ptr [rbx + 0x20]
00000001808e4ac8: mov      dword ptr [rbx + 0x10], 0xffffffff
00000001808e4acf: mov      rdx, qword ptr [rip + 0x7f36bda] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
00000001808e4ad6: test     r14, r14
00000001808e4ad9: jne      0x1808e4adf
00000001808e4adb: xor      edi, edi
00000001808e4add: jmp      0x1808e4b2b
00000001808e4adf: cmp      byte ptr [rip + 0x83e7d0a], 0
00000001808e4ae6: mov      r8, qword ptr [r14]
00000001808e4ae9: jbe      0x1808e4af9
00000001808e4aeb: mov      rcx, r8
00000001808e4aee: call     0x1804463e0
00000001808e4af3: xor      edi, edi
00000001808e4af5: test     al, al
00000001808e4af7: jmp      0x1808e4b27
00000001808e4af9: movzx    eax, byte ptr [rdx + 0x130]
00000001808e4b00: cmp      byte ptr [r8 + 0x130], al
00000001808e4b07: jb       0x1808e4b21
00000001808e4b09: movzx    ecx, al
00000001808e4b0c: mov      rax, qword ptr [r8 + 0xc8]
00000001808e4b13: cmp      qword ptr [rax + rcx*8 - 8], rdx
00000001808e4b18: jne      0x1808e4b21
00000001808e4b1a: mov      eax, 1
00000001808e4b1f: jmp      0x1808e4b23
00000001808e4b21: xor      eax, eax
00000001808e4b23: xor      edi, edi
00000001808e4b25: test     eax, eax
00000001808e4b27: cmovne   rdi, r14
00000001808e4b2b: mov      rcx, qword ptr [rip + 0x804e1b6] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808e4b32: mov      r14, qword ptr [rsp + 0x90]
00000001808e4b3a: cmp      dword ptr [rcx + 0xe0], 0
00000001808e4b41: jne      0x1808e4b48
00000001808e4b43: call     0x18048c140
00000001808e4b48: xor      r8d, r8d
00000001808e4b4b: xor      edx, edx
00000001808e4b4d: mov      rcx, rdi
00000001808e4b50: call     0x186b638d0
00000001808e4b55: test     al, al
00000001808e4b57: jne      0x1808e4c0a
00000001808e4b5d: test     rsi, rsi
00000001808e4b60: je       0x1808e4c77
00000001808e4b66: xor      edx, edx
00000001808e4b68: mov      rcx, rsi
00000001808e4b6b: call     0x1808ddb50 ; Torappu.Battle.Projectile.get_type [71299]
00000001808e4b70: cmp      eax, 2
00000001808e4b73: je       0x1808e4ab5
00000001808e4b79: mov      rcx, qword ptr [rip + 0x7f4f160] ; TypeInfo type(0x15, data=0x188a36200) @0x188833ce0
00000001808e4b80: movss    xmm6, dword ptr [rsi + 0x208]
00000001808e4b88: movss    xmm7, dword ptr [rsi + 0x20c]
00000001808e4b90: movss    xmm8, dword ptr [rsi + 0x1f0]
00000001808e4b99: call     0x18045cfe0
00000001808e4b9e: mov      rbp, rax
00000001808e4ba1: test     rax, rax
00000001808e4ba4: je       0x1808e4c77
00000001808e4baa: mov      r8, qword ptr [rip + 0x7fdab9f] ; MethodInfo Torappu.Battle.NetCatcherProjectile.<DoLink_SecondPart>b__30_0 [71260] @0x1888bf750
00000001808e4bb1: xor      r9d, r9d
00000001808e4bb4: mov      rdx, rsi
00000001808e4bb7: mov      rcx, rax
00000001808e4bba: call     0x180518030
00000001808e4bbf: movzx    r8d, byte ptr [rsi + 0x1f4]
00000001808e4bc7: movaps   xmm3, xmm8
00000001808e4bcb: mov      qword ptr [rsp + 0x30], 0
00000001808e4bd4: mov      rdx, rdi
00000001808e4bd7: mov      byte ptr [rsp + 0x28], r8b
00000001808e4bdc: mov      rcx, rsi
00000001808e4bdf: unpcklps xmm6, xmm7
00000001808e4be2: movq     r8, xmm6
00000001808e4be7: mov      qword ptr [rsp + 0x20], rbp
00000001808e4bec: call     0x1808d4de0 ; Torappu.Battle.NetCatcherProjectile._DoPull [71255]
00000001808e4bf1: lea      rcx, [rbx + 0x18]
00000001808e4bf5: mov      qword ptr [rbx + 0x18], rax
00000001808e4bf9: mov      rdx, rax
00000001808e4bfc: call     0x18048b9e0
00000001808e4c01: mov      dword ptr [rbx + 0x10], 2
00000001808e4c08: jmp      0x1808e4c47
00000001808e4c0a: mov      rax, qword ptr [rip + 0x7f859bf] ; TypeInfo Torappu.Battle.Yields @0x18886a5d0
00000001808e4c11: cmp      dword ptr [rax + 0xe0], 0
00000001808e4c18: jne      0x1808e4c29
00000001808e4c1a: mov      rcx, rax
00000001808e4c1d: call     0x18048c140
00000001808e4c22: mov      rax, qword ptr [rip + 0x7f859a7] ; TypeInfo Torappu.Battle.Yields @0x18886a5d0
00000001808e4c29: mov      rax, qword ptr [rax + 0xb8]
00000001808e4c30: lea      rcx, [rbx + 0x18]
00000001808e4c34: mov      rdx, qword ptr [rax]
00000001808e4c37: mov      qword ptr [rbx + 0x18], rdx
00000001808e4c3b: call     0x18048b9e0
00000001808e4c40: mov      dword ptr [rbx + 0x10], 1
00000001808e4c47: mov      al, 1
00000001808e4c49: movaps   xmm8, xmmword ptr [rsp + 0x40]
00000001808e4c4f: movaps   xmm7, xmmword ptr [rsp + 0x50]
00000001808e4c54: movaps   xmm6, xmmword ptr [rsp + 0x60]
00000001808e4c59: mov      rdi, qword ptr [rsp + 0x88]
00000001808e4c61: mov      rbp, qword ptr [rsp + 0x80]
00000001808e4c69: mov      rbx, qword ptr [rsp + 0x98]
00000001808e4c71: add      rsp, 0x70
00000001808e4c75: pop      rsi
00000001808e4c76: ret      
00000001808e4c77: call     0x18048c0b0
00000001808e4c7c: int3     
00000001808e4c7d: int3     
00000001808e4c7e: int3     
00000001808e4c7f: int3     