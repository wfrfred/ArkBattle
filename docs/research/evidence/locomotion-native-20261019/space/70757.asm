; Torappu.Battle.Tile.RefreshTileOptionsViaToken metadata=70757 token=0x6011466 VA=0x1808c1c90 RVA=0x8c1c90 size=0x220
00000001808c1c90: mov      qword ptr [rsp + 0x18], rbp
00000001808c1c95: push     rsi
00000001808c1c96: sub      rsp, 0x90
00000001808c1c9d: cmp      byte ptr [rip + 0x83cf9b1], 0
00000001808c1ca4: mov      rsi, rdx
00000001808c1ca7: mov      rbp, rcx
00000001808c1caa: jne      0x1808c1cd7
00000001808c1cac: lea      rcx, [rip + 0x7f4fcad] ; GenericMethodInfo 261998 @0x188811960
00000001808c1cb3: call     0x18048bf00
00000001808c1cb8: lea      rcx, [rip + 0x8011c49] ; GenericMethodInfo 281972 @0x1888d3908
00000001808c1cbf: call     0x18048bf00
00000001808c1cc4: lea      rcx, [rip + 0x8006e05] ; TypeInfo Torappu.Battle.Tile @0x1888c8ad0
00000001808c1ccb: call     0x18048bf00
00000001808c1cd0: mov      byte ptr [rip + 0x83cf97e], 1
00000001808c1cd7: mov      rax, qword ptr [rip + 0x8006df2] ; TypeInfo Torappu.Battle.Tile @0x1888c8ad0
00000001808c1cde: mov      rcx, qword ptr [rax + 0xb8]
00000001808c1ce5: mov      rcx, qword ptr [rcx + 0x400]
00000001808c1cec: test     rcx, rcx
00000001808c1cef: jne      0x1808c1e7e
00000001808c1cf5: test     rsi, rsi
00000001808c1cf8: je       0x1808c1e9c
00000001808c1cfe: xor      edx, edx
00000001808c1d00: mov      rcx, rsi
00000001808c1d03: call     0x180ab74f0 ; Torappu.Battle.Token.get_rewriteTileOptions [77447]
00000001808c1d08: test     al, al
00000001808c1d0a: je       0x1808c1e6b
00000001808c1d10: mov      qword ptr [rsp + 0xa0], rbx
00000001808c1d18: lea      rcx, [rsp + 0x50]
00000001808c1d1d: mov      qword ptr [rsp + 0xa8], rdi
00000001808c1d25: xor      r8d, r8d
00000001808c1d28: movaps   xmmword ptr [rsp + 0x80], xmm6
00000001808c1d30: mov      rdx, rsi
00000001808c1d33: movaps   xmmword ptr [rsp + 0x70], xmm7
00000001808c1d38: call     0x180ab7870 ; Torappu.Battle.Token.get_tileOptions [77453]
00000001808c1d3d: xor      edx, edx
00000001808c1d3f: mov      rcx, rsi
00000001808c1d42: movups   xmm6, xmmword ptr [rax]
00000001808c1d45: movsd    xmm7, qword ptr [rax + 0x10]
00000001808c1d4a: movups   xmmword ptr [rsp + 0x30], xmm6
00000001808c1d4f: movsd    qword ptr [rsp + 0x40], xmm7
00000001808c1d55: call     0x180ab6fb0 ; Torappu.Battle.Token.get_rewriteTileAdvancedBuildMask [77459]
00000001808c1d5a: test     al, al
00000001808c1d5c: jne      0x1808c1d6d
00000001808c1d5e: mov      eax, dword ptr [rbp + 0x9c]
00000001808c1d64: mov      dword ptr [rsp + 0x3c], eax
00000001808c1d68: movups   xmm6, xmmword ptr [rsp + 0x30]
00000001808c1d6d: xor      edx, edx
00000001808c1d6f: mov      rcx, rsi
00000001808c1d72: call     0x180ab71f0 ; Torappu.Battle.Token.get_rewriteTileHeightType [77456]
00000001808c1d77: test     al, al
00000001808c1d79: je       0x1808c1daf
00000001808c1d7b: mov      eax, dword ptr [rsp + 0x40]
00000001808c1d7f: xor      edx, edx
00000001808c1d81: mov      rcx, rsi
00000001808c1d84: mov      dword ptr [rbp + 0xa0], eax
00000001808c1d8a: call     0x180ab7370 ; Torappu.Battle.Token.get_rewriteTileHeight [77457]
00000001808c1d8f: test     al, al
00000001808c1d91: je       0x1808c1d9f
00000001808c1d93: xor      edx, edx
00000001808c1d95: mov      rcx, rsi
00000001808c1d98: call     0x180ab6e30 ; Torappu.Battle.Token.get_rewriteHeight [77458]
00000001808c1d9d: jmp      0x1808c1da7
00000001808c1d9f: movss    xmm0, dword ptr [rbp + 0xac]
00000001808c1da7: movss    dword ptr [rbp + 0xac], xmm0
00000001808c1daf: xor      edx, edx
00000001808c1db1: mov      rcx, rsi
00000001808c1db4: call     0x180ab6bf0 ; Torappu.Battle.Token.get_keepCurrentPassableMask [77454]
00000001808c1db9: xor      edx, edx
00000001808c1dbb: mov      rcx, rsi
00000001808c1dbe: movzx    edi, al
00000001808c1dc1: call     0x180ab6830 ; Torappu.Battle.Token.get_ignoreBlockAnyRoutes [77451]
00000001808c1dc6: xor      edx, edx
00000001808c1dc8: mov      rcx, rsi
00000001808c1dcb: movzx    ebx, al
00000001808c1dce: call     0x180ab6a70 ; Torappu.Battle.Token.get_keepCurrentBuildableType [77455]
00000001808c1dd3: movzx    r9d, bl
00000001808c1dd7: mov      qword ptr [rsp + 0x28], 0
00000001808c1de0: movzx    r8d, dil
00000001808c1de4: movaps   xmmword ptr [rsp + 0x30], xmm6
00000001808c1de9: lea      rdx, [rsp + 0x30]
00000001808c1dee: movsd    qword ptr [rsp + 0x40], xmm7
00000001808c1df4: mov      rcx, rbp
00000001808c1df7: mov      byte ptr [rsp + 0x20], al
00000001808c1dfb: call     0x1808c3820 ; Torappu.Battle.Tile.TryUpdateOptions [70734]
00000001808c1e00: movaps   xmm7, xmmword ptr [rsp + 0x70]
00000001808c1e05: movaps   xmm6, xmmword ptr [rsp + 0x80]
00000001808c1e0d: mov      rdi, qword ptr [rsp + 0xa8]
00000001808c1e15: mov      rbx, qword ptr [rsp + 0xa0]
00000001808c1e1d: test     al, al
00000001808c1e1f: jne      0x1808c1e6b
00000001808c1e21: mov      rcx, qword ptr [rip + 0x8011ae0] ; GenericMethodInfo 281972 @0x1888d3908
00000001808c1e28: call     0x185337c50
00000001808c1e2d: test     rax, rax
00000001808c1e30: je       0x1808c1e9c
00000001808c1e32: xor      edx, edx
00000001808c1e34: mov      rcx, rax
00000001808c1e37: call     0x180641550 ; Torappu.Battle.BattleController.get_eventPool [64504]
00000001808c1e3c: test     rax, rax
00000001808c1e3f: je       0x1808c1e9c
00000001808c1e41: mov      r9, qword ptr [rip + 0x7f4fb18] ; GenericMethodInfo 261998 @0x188811960
00000001808c1e48: mov      r8, rsi
00000001808c1e4b: mov      edx, 0x17
00000001808c1e50: mov      rcx, rax
00000001808c1e53: call     0x1848dca60
00000001808c1e58: xor      al, al
00000001808c1e5a: mov      rbp, qword ptr [rsp + 0xb0]
00000001808c1e62: add      rsp, 0x90
00000001808c1e69: pop      rsi
00000001808c1e6a: ret      
00000001808c1e6b: mov      al, 1
00000001808c1e6d: mov      rbp, qword ptr [rsp + 0xb0]
00000001808c1e75: add      rsp, 0x90
00000001808c1e7c: pop      rsi
00000001808c1e7d: ret      
00000001808c1e7e: xor      r9d, r9d
00000001808c1e81: mov      r8, rsi
00000001808c1e84: mov      rdx, rbp
00000001808c1e87: mov      rbp, qword ptr [rsp + 0xb0]
00000001808c1e8f: add      rsp, 0x90
00000001808c1e96: pop      rsi
00000001808c1e97: jmp      0x18332fc60 ; XLua.DelegateBridge.__Gen_Delegate_Imp29 [2684]
00000001808c1e9c: call     0x18048c0b0
00000001808c1ea1: int3     
00000001808c1ea2: int3     
00000001808c1ea3: int3     
00000001808c1ea4: int3     
00000001808c1ea5: int3     
00000001808c1ea6: int3     
00000001808c1ea7: int3     
00000001808c1ea8: int3     
00000001808c1ea9: int3     
00000001808c1eaa: int3     
00000001808c1eab: int3     
00000001808c1eac: int3     
00000001808c1ead: int3     
00000001808c1eae: int3     
00000001808c1eaf: int3     
