; Torappu.Battle.Tile.RestoreOptionsOnlyViaToken metadata=70759 token=0x6011468 VA=0x1808c29f0 RVA=0x8c29f0 size=0x150
00000001808c29f0: mov      qword ptr [rsp + 0x20], rbx
00000001808c29f5: push     rdi
00000001808c29f6: sub      rsp, 0x40
00000001808c29fa: cmp      byte ptr [rip + 0x83cec56], 0
00000001808c2a01: mov      rdi, rdx
00000001808c2a04: mov      rbx, rcx
00000001808c2a07: jne      0x1808c2a1c
00000001808c2a09: lea      rcx, [rip + 0x80060c0] ; TypeInfo Torappu.Battle.Tile @0x1888c8ad0
00000001808c2a10: call     0x18048bf00
00000001808c2a15: mov      byte ptr [rip + 0x83cec3b], 1
00000001808c2a1c: mov      rax, qword ptr [rip + 0x80060ad] ; TypeInfo Torappu.Battle.Tile @0x1888c8ad0
00000001808c2a23: mov      r8, qword ptr [rax + 0xb8]
00000001808c2a2a: mov      rcx, qword ptr [r8 + 0x410]
00000001808c2a31: test     rcx, rcx
00000001808c2a34: jne      0x1808c2b19
00000001808c2a3a: test     rdi, rdi
00000001808c2a3d: je       0x1808c2b31
00000001808c2a43: xor      edx, edx
00000001808c2a45: mov      rcx, rdi
00000001808c2a48: call     0x180ab74f0 ; Torappu.Battle.Token.get_rewriteTileOptions [77447]
00000001808c2a4d: test     al, al
00000001808c2a4f: je       0x1808c2b0e
00000001808c2a55: movups   xmm0, xmmword ptr [rbx + 0x78]
00000001808c2a59: lea      rdx, [rsp + 0x20]
00000001808c2a5e: mov      qword ptr [rsp + 0x50], rbp
00000001808c2a63: movsd    xmm1, qword ptr [rbx + 0x88]
00000001808c2a6b: xor      r8d, r8d
00000001808c2a6e: mov      ebp, dword ptr [rbx + 0x94]
00000001808c2a74: mov      rcx, rbx
00000001808c2a77: mov      qword ptr [rsp + 0x58], rsi
00000001808c2a7c: mov      esi, dword ptr [rbx + 0x9c]
00000001808c2a82: mov      qword ptr [rsp + 0x60], r14
00000001808c2a87: mov      r14d, dword ptr [rbx + 0x90]
00000001808c2a8e: movaps   xmmword ptr [rsp + 0x20], xmm0
00000001808c2a93: movsd    qword ptr [rsp + 0x30], xmm1
00000001808c2a99: call     0x1808c2cd0 ; Torappu.Battle.Tile.RewriteOptions [70739]
00000001808c2a9e: xor      edx, edx
00000001808c2aa0: mov      rcx, rdi
00000001808c2aa3: call     0x180ab6fb0 ; Torappu.Battle.Token.get_rewriteTileAdvancedBuildMask [77459]
00000001808c2aa8: test     al, al
00000001808c2aaa: jne      0x1808c2ab2
00000001808c2aac: mov      dword ptr [rbx + 0x9c], esi
00000001808c2ab2: xor      edx, edx
00000001808c2ab4: mov      rcx, rdi
00000001808c2ab7: call     0x180ab6bf0 ; Torappu.Battle.Token.get_keepCurrentPassableMask [77454]
00000001808c2abc: mov      rsi, qword ptr [rsp + 0x58]
00000001808c2ac1: test     al, al
00000001808c2ac3: je       0x1808c2acb
00000001808c2ac5: mov      dword ptr [rbx + 0x94], ebp
00000001808c2acb: xor      edx, edx
00000001808c2acd: mov      rcx, rdi
00000001808c2ad0: call     0x180ab71f0 ; Torappu.Battle.Token.get_rewriteTileHeightType [77456]
00000001808c2ad5: mov      rbp, qword ptr [rsp + 0x50]
00000001808c2ada: test     al, al
00000001808c2adc: je       0x1808c2af4
00000001808c2ade: mov      eax, dword ptr [rbx + 0x88]
00000001808c2ae4: mov      dword ptr [rbx + 0xa0], eax
00000001808c2aea: mov      dword ptr [rbx + 0xac], 0
00000001808c2af4: xor      edx, edx
00000001808c2af6: mov      rcx, rdi
00000001808c2af9: call     0x180ab6a70 ; Torappu.Battle.Token.get_keepCurrentBuildableType [77455]
00000001808c2afe: test     al, al
00000001808c2b00: je       0x1808c2b09
00000001808c2b02: mov      dword ptr [rbx + 0x90], r14d
00000001808c2b09: mov      r14, qword ptr [rsp + 0x60]
00000001808c2b0e: mov      rbx, qword ptr [rsp + 0x68]
00000001808c2b13: add      rsp, 0x40
00000001808c2b17: pop      rdi
00000001808c2b18: ret      
00000001808c2b19: xor      r9d, r9d
00000001808c2b1c: mov      r8, rdi
00000001808c2b1f: mov      rdx, rbx
00000001808c2b22: mov      rbx, qword ptr [rsp + 0x68]
00000001808c2b27: add      rsp, 0x40
00000001808c2b2b: pop      rdi
00000001808c2b2c: jmp      0x1832d2220 ; XLua.DelegateBridge.__Gen_Delegate_Imp23 [2678]
00000001808c2b31: call     0x18048c0b0
00000001808c2b36: int3     
00000001808c2b37: int3     
00000001808c2b38: int3     
00000001808c2b39: int3     
00000001808c2b3a: int3     
00000001808c2b3b: int3     
00000001808c2b3c: int3     
00000001808c2b3d: int3     
00000001808c2b3e: int3     
00000001808c2b3f: int3     
