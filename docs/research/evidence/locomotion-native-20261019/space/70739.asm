; Torappu.Battle.Tile.RewriteOptions metadata=70739 token=0x6011454 VA=0x1808c2cd0 RVA=0x8c2cd0 size=0x230
00000001808c2cd0: push     rbx
00000001808c2cd2: push     rsi
00000001808c2cd3: sub      rsp, 0x48
00000001808c2cd7: cmp      byte ptr [rip + 0x83ce965], 0
00000001808c2cde: mov      rsi, rdx
00000001808c2ce1: mov      rbx, rcx
00000001808c2ce4: jne      0x1808c2d05
00000001808c2ce6: lea      rcx, [rip + 0x801d45b] ; GenericMethodInfo 282061 @0x1888e0148
00000001808c2ced: call     0x18048bf00
00000001808c2cf2: lea      rcx, [rip + 0x8005dd7] ; TypeInfo Torappu.Battle.Tile @0x1888c8ad0
00000001808c2cf9: call     0x18048bf00
00000001808c2cfe: mov      byte ptr [rip + 0x83ce93e], 1
00000001808c2d05: mov      rax, qword ptr [rip + 0x8005dc4] ; TypeInfo Torappu.Battle.Tile @0x1888c8ad0
00000001808c2d0c: mov      r8, qword ptr [rax + 0xb8]
00000001808c2d13: mov      rcx, qword ptr [r8 + 0x370]
00000001808c2d1a: test     rcx, rcx
00000001808c2d1d: jne      0x1808c2ecc
00000001808c2d23: mov      qword ptr [rsp + 0x60], rbp
00000001808c2d28: mov      qword ptr [rsp + 0x68], rdi
00000001808c2d2d: mov      qword ptr [rsp + 0x70], r14
00000001808c2d32: mov      qword ptr [rsp + 0x40], r15
00000001808c2d37: mov      r14d, dword ptr [rbx + 0x94]
00000001808c2d3e: nop      
00000001808c2d40: movsd    xmm0, qword ptr [rsi + 0x10]
00000001808c2d45: mov      rax, qword ptr [rsi]
00000001808c2d48: shr      rax, 0x20
00000001808c2d4c: xor      eax, r14d
00000001808c2d4f: and      eax, 1
00000001808c2d52: mov      rbp, qword ptr [rsi]
00000001808c2d55: and      r14d, 2
00000001808c2d59: shr      rbp, 0x20
00000001808c2d5d: mov      edi, eax
00000001808c2d5f: or       edi, 2
00000001808c2d62: movsd    qword ptr [rsp + 0x30], xmm0
00000001808c2d68: and      ebp, 2
00000001808c2d6b: cmp      ebp, r14d
00000001808c2d6e: cmove    edi, eax
00000001808c2d71: cmp      byte ptr [rip + 0x8409a79], cl
00000001808c2d77: jbe      0x1808c2d81
00000001808c2d79: mov      rcx, qword ptr [rbx]
00000001808c2d7c: call     0x180446d00
00000001808c2d81: mov      rdx, qword ptr [rbx]
00000001808c2d84: mov      rcx, rbx
00000001808c2d87: mov      rax, qword ptr [rdx + 0x240]
00000001808c2d8e: mov      rdx, qword ptr [rdx + 0x248]
00000001808c2d95: call     rax
00000001808c2d97: movsd    xmm1, qword ptr [rsi + 0x10]
00000001808c2d9c: mov      r15d, eax
00000001808c2d9f: mov      ecx, dword ptr [rbx + 0xa0]
00000001808c2da5: movups   xmm0, xmmword ptr [rsi]
00000001808c2da8: movsd    qword ptr [rsp + 0x30], xmm1
00000001808c2dae: mov      rax, qword ptr [rsp + 0x30]
00000001808c2db3: shr      rax, 0x20
00000001808c2db7: movups   xmmword ptr [rbx + 0x90], xmm0
00000001808c2dbe: movsd    qword ptr [rbx + 0xa0], xmm1
00000001808c2dc6: test     al, al
00000001808c2dc8: jne      0x1808c2dd0
00000001808c2dca: mov      dword ptr [rbx + 0xa0], ecx
00000001808c2dd0: cmp      byte ptr [rip + 0x8409a19], 0
00000001808c2dd7: jbe      0x1808c2de1
00000001808c2dd9: mov      rcx, qword ptr [rbx]
00000001808c2ddc: call     0x180446d00
00000001808c2de1: mov      rdx, qword ptr [rbx]
00000001808c2de4: mov      rcx, rbx
00000001808c2de7: mov      rax, qword ptr [rdx + 0x240]
00000001808c2dee: mov      rdx, qword ptr [rdx + 0x248]
00000001808c2df5: call     rax
00000001808c2df7: cmp      eax, r15d
00000001808c2dfa: mov      esi, 1
00000001808c2dff: mov      r15, qword ptr [rsp + 0x40]
00000001808c2e04: je       0x1808c2e11
00000001808c2e06: cmp      ebp, r14d
00000001808c2e09: mov      edi, 3
00000001808c2e0e: cmove    edi, esi
00000001808c2e11: mov      rcx, qword ptr [rip + 0x801d330] ; GenericMethodInfo 282061 @0x1888e0148
00000001808c2e18: call     0x185337c50
00000001808c2e1d: mov      r14, qword ptr [rsp + 0x70]
00000001808c2e22: mov      rbp, qword ptr [rsp + 0x60]
00000001808c2e27: test     rax, rax
00000001808c2e2a: je       0x1808c2ef6
00000001808c2e30: xor      r8d, r8d
00000001808c2e33: mov      rdx, rbx
00000001808c2e36: mov      rcx, rax
00000001808c2e39: call     0x1808827b0 ; Torappu.Battle.Map.UpdatePassableMap [70014]
00000001808c2e3e: mov      rcx, qword ptr [rip + 0x801d303] ; GenericMethodInfo 282061 @0x1888e0148
00000001808c2e45: call     0x185337c50
00000001808c2e4a: test     rax, rax
00000001808c2e4d: je       0x1808c2ef6
00000001808c2e53: xor      edx, edx
00000001808c2e55: mov      rcx, rax
00000001808c2e58: call     0x180886aa0 ; Torappu.Battle.Map.get_isBatchingTileUpdate [70000]
00000001808c2e5d: test     al, al
00000001808c2e5f: jne      0x1808c2ea0
00000001808c2e61: xor      ebx, ebx
00000001808c2e63: mov      ecx, ebx
00000001808c2e65: mov      eax, esi
00000001808c2e67: shl      eax, cl
00000001808c2e69: test     edi, eax
00000001808c2e6b: jbe      0x1808c2e8b
00000001808c2e6d: mov      rcx, qword ptr [rip + 0x801d2d4] ; GenericMethodInfo 282061 @0x1888e0148
00000001808c2e74: call     0x185337c50
00000001808c2e79: test     rax, rax
00000001808c2e7c: je       0x1808c2ef6
00000001808c2e7e: xor      r8d, r8d
00000001808c2e81: mov      edx, ebx
00000001808c2e83: mov      rcx, rax
00000001808c2e86: call     0x180882900 ; Torappu.Battle.Map.UpdateRoutes [70004]
00000001808c2e8b: inc      ebx
00000001808c2e8d: cmp      ebx, 2
00000001808c2e90: jl       0x1808c2e63
00000001808c2e92: mov      eax, edi
00000001808c2e94: mov      rdi, qword ptr [rsp + 0x68]
00000001808c2e99: add      rsp, 0x48
00000001808c2e9d: pop      rsi
00000001808c2e9e: pop      rbx
00000001808c2e9f: ret      
00000001808c2ea0: mov      rcx, qword ptr [rip + 0x801d2a1] ; GenericMethodInfo 282061 @0x1888e0148
00000001808c2ea7: call     0x185337c50
00000001808c2eac: test     rax, rax
00000001808c2eaf: je       0x1808c2ef6
00000001808c2eb1: xor      r8d, r8d
00000001808c2eb4: mov      edx, edi
00000001808c2eb6: mov      rcx, rax
00000001808c2eb9: call     0x180879e30 ; Torappu.Battle.Map.AccumulateDirtyRoutes [70003]
00000001808c2ebe: mov      eax, edi
00000001808c2ec0: mov      rdi, qword ptr [rsp + 0x68]
00000001808c2ec5: add      rsp, 0x48
00000001808c2ec9: pop      rsi
00000001808c2eca: pop      rbx
00000001808c2ecb: ret      
00000001808c2ecc: movups   xmm0, xmmword ptr [rsi]
00000001808c2ecf: lea      r8, [rsp + 0x20]
00000001808c2ed4: xor      r9d, r9d
00000001808c2ed7: movsd    xmm1, qword ptr [rsi + 0x10]
00000001808c2edc: mov      rdx, rbx
00000001808c2edf: movaps   xmmword ptr [rsp + 0x20], xmm0
00000001808c2ee4: movsd    qword ptr [rsp + 0x30], xmm1
00000001808c2eea: call     0x18336b3f0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3388 [6043]
00000001808c2eef: add      rsp, 0x48
00000001808c2ef3: pop      rsi
00000001808c2ef4: pop      rbx
00000001808c2ef5: ret      
00000001808c2ef6: call     0x18048c0b0
00000001808c2efb: int3     
00000001808c2efc: int3     
00000001808c2efd: int3     
00000001808c2efe: int3     
00000001808c2eff: int3     
