; Torappu.Battle.Route.ReconstructNextMap metadata=70362 token=0x60112db VA=0x1808a2d60 RVA=0x8a2d60 size=0x300
00000001808a2d60: mov      qword ptr [rsp + 8], rbx
00000001808a2d65: mov      qword ptr [rsp + 0x10], rbp
00000001808a2d6a: mov      qword ptr [rsp + 0x18], rsi
00000001808a2d6f: push     rdi
00000001808a2d70: push     r12
00000001808a2d72: push     r13
00000001808a2d74: push     r14
00000001808a2d76: push     r15
00000001808a2d78: sub      rsp, 0x30
00000001808a2d7c: mov      rdx, qword ptr [rcx + 0x18]
00000001808a2d80: mov      rsi, rcx
00000001808a2d83: test     rdx, rdx
00000001808a2d86: je       0x1808a304e
00000001808a2d8c: mov      r8, qword ptr [rcx + 0x28]
00000001808a2d90: xor      r9d, r9d
00000001808a2d93: mov      rdx, qword ptr [rdx + 0x1c]
00000001808a2d97: call     0x1808a3890 ; Torappu.Battle.Route._GenerateNextMap [70381]
00000001808a2d9c: mov      rdx, qword ptr [rsi + 0x18]
00000001808a2da0: test     rdx, rdx
00000001808a2da3: je       0x1808a304e
00000001808a2da9: mov      r8, qword ptr [rsi + 0x28]
00000001808a2dad: xor      r9d, r9d
00000001808a2db0: mov      rdx, qword ptr [rdx + 0x1c]
00000001808a2db4: mov      rcx, rsi
00000001808a2db7: mov      qword ptr [rsp + 0x20], 0
00000001808a2dc0: call     0x1808a3a10 ; Torappu.Battle.Route._GenerateNextTurn [70383]
00000001808a2dc5: mov      rax, qword ptr [rsi + 0x30]
00000001808a2dc9: xor      ebx, ebx
00000001808a2dcb: mov      rdi, qword ptr [rsi + 0x28]
00000001808a2dcf: test     rax, rax
00000001808a2dd2: je       0x1808a304e
00000001808a2dd8: mov      r12d, dword ptr [rax + 0x18]
00000001808a2ddc: sub      r12d, 1
00000001808a2de0: js       0x1808a3031
00000001808a2de6: movsxd   rax, r12d
00000001808a2de9: lea      r13, [rax*8 + 0x20]
00000001808a2df1: mov      rax, qword ptr [rsi + 0x30]
00000001808a2df5: test     rax, rax
00000001808a2df8: je       0x1808a304e
00000001808a2dfe: cmp      r12d, dword ptr [rax + 0x18]
00000001808a2e02: jae      0x1808a3054
00000001808a2e08: mov      rcx, qword ptr [rax + r13]
00000001808a2e0c: mov      rax, qword ptr [rsi + 0x18]
00000001808a2e10: test     rax, rax
00000001808a2e13: je       0x1808a304e
00000001808a2e19: mov      rax, qword ptr [rax + 0x38]
00000001808a2e1d: test     rcx, rcx
00000001808a2e20: jne      0x1808a2e5d
00000001808a2e22: test     rax, rax
00000001808a2e25: je       0x1808a304e
00000001808a2e2b: cmp      r12d, dword ptr [rax + 0x18]
00000001808a2e2f: jae      0x1808a3054
00000001808a2e35: mov      rcx, qword ptr [rax + r13]
00000001808a2e39: test     rcx, rcx
00000001808a2e3c: je       0x1808a304e
00000001808a2e42: cmp      dword ptr [rcx + 0x10], 6
00000001808a2e46: jne      0x1808a3023
00000001808a2e4c: mov      rax, qword ptr [rsi + 0x18]
00000001808a2e50: mov      rcx, qword ptr [rax + 0x38]
00000001808a2e54: mov      rbx, qword ptr [rcx + r13]
00000001808a2e58: jmp      0x1808a3023
00000001808a2e5d: test     rax, rax
00000001808a2e60: je       0x1808a304e
00000001808a2e66: cmp      r12d, dword ptr [rax + 0x18]
00000001808a2e6a: jae      0x1808a3054
00000001808a2e70: mov      rdx, qword ptr [rax + r13]
00000001808a2e74: test     rdx, rdx
00000001808a2e77: je       0x1808a304e
00000001808a2e7d: mov      r8, qword ptr [rsi + 0x30]
00000001808a2e81: xor      r9d, r9d
00000001808a2e84: mov      rdx, qword ptr [rdx + 0x18]
00000001808a2e88: mov      rcx, rsi
00000001808a2e8b: mov      r8, qword ptr [r8 + r13]
00000001808a2e8f: call     0x1808a3890 ; Torappu.Battle.Route._GenerateNextMap [70381]
00000001808a2e94: mov      rax, qword ptr [rsi + 0x18]
00000001808a2e98: test     rax, rax
00000001808a2e9b: je       0x1808a304e
00000001808a2ea1: mov      rax, qword ptr [rax + 0x38]
00000001808a2ea5: test     rax, rax
00000001808a2ea8: je       0x1808a304e
00000001808a2eae: cmp      r12d, dword ptr [rax + 0x18]
00000001808a2eb2: jae      0x1808a3054
00000001808a2eb8: cmp      qword ptr [rax + r13], 0
00000001808a2ebd: lea      rdx, [rax + r13]
00000001808a2ec1: je       0x1808a304e
00000001808a2ec7: mov      rax, qword ptr [rsi + 0x30]
00000001808a2ecb: test     rax, rax
00000001808a2ece: je       0x1808a304e
00000001808a2ed4: cmp      r12d, dword ptr [rax + 0x18]
00000001808a2ed8: jae      0x1808a3054
00000001808a2ede: movsxd   rax, r12d
00000001808a2ee1: mov      r8, qword ptr [rsi + 0x30]
00000001808a2ee5: xor      r9d, r9d
00000001808a2ee8: mov      rdx, qword ptr [rdx]
00000001808a2eeb: test     rbx, rbx
00000001808a2eee: mov      rcx, rsi
00000001808a2ef1: mov      qword ptr [rsp + 0x20], 0
00000001808a2efa: cmove    r9, rdi
00000001808a2efe: mov      r8, qword ptr [r8 + rax*8 + 0x20]
00000001808a2f03: mov      rdx, qword ptr [rdx + 0x18]
00000001808a2f07: call     0x1808a3a10 ; Torappu.Battle.Route._GenerateNextTurn [70383]
00000001808a2f0c: mov      rbp, qword ptr [rsi + 0x30]
00000001808a2f10: test     rbp, rbp
00000001808a2f13: je       0x1808a304e
00000001808a2f19: cmp      r12d, dword ptr [rbp + 0x18]
00000001808a2f1d: jae      0x1808a3054
00000001808a2f23: test     rbx, rbx
00000001808a2f26: je       0x1808a2f2e
00000001808a2f28: mov      rax, qword ptr [rbx + 0x18]
00000001808a2f2c: jmp      0x1808a2f63
00000001808a2f2e: mov      rax, qword ptr [rsi + 0x18]
00000001808a2f32: test     rax, rax
00000001808a2f35: je       0x1808a304e
00000001808a2f3b: mov      rax, qword ptr [rax + 0x38]
00000001808a2f3f: test     rax, rax
00000001808a2f42: je       0x1808a304e
00000001808a2f48: cmp      r12d, dword ptr [rax + 0x18]
00000001808a2f4c: jae      0x1808a3054
00000001808a2f52: mov      rax, qword ptr [rax + r13]
00000001808a2f56: test     rax, rax
00000001808a2f59: je       0x1808a304e
00000001808a2f5f: mov      rax, qword ptr [rax + 0x18]
00000001808a2f63: mov      ecx, r12d
00000001808a2f66: movsxd   rcx, ecx
00000001808a2f69: mov      rbp, qword ptr [rbp + rcx*8 + 0x20]
00000001808a2f6e: test     rdi, rdi
00000001808a2f71: jne      0x1808a2f78
00000001808a2f73: xor      r15d, r15d
00000001808a2f76: jmp      0x1808a2f91
00000001808a2f78: mov      rdx, rax
00000001808a2f7b: mov      rcx, rdi
00000001808a2f7e: shr      rdx, 0x20
00000001808a2f82: movsxd   r8, edx
00000001808a2f85: movsxd   rdx, eax
00000001808a2f88: call     0x1800169b0
00000001808a2f8d: mov      r15d, dword ptr [rax + 0x28]
00000001808a2f91: xor      r14d, r14d
00000001808a2f94: nop      dword ptr [rax]
00000001808a2f98: nop      dword ptr [rax + rax]
00000001808a2fa0: mov      rcx, qword ptr [rsi + 0x10]
00000001808a2fa4: test     rcx, rcx
00000001808a2fa7: je       0x1808a304e
00000001808a2fad: xor      edx, edx
00000001808a2faf: call     0x180886a20 ; Torappu.Battle.Map.get_height [69971]
00000001808a2fb4: cmp      r14d, eax
00000001808a2fb7: jge      0x1808a300e
00000001808a2fb9: xor      ebx, ebx
00000001808a2fbb: nop      dword ptr [rax + rax]
00000001808a2fc0: mov      rcx, qword ptr [rsi + 0x10]
00000001808a2fc4: test     rcx, rcx
00000001808a2fc7: je       0x1808a304e
00000001808a2fcd: xor      edx, edx
00000001808a2fcf: call     0x180887350 ; Torappu.Battle.Map.get_width [69970]
00000001808a2fd4: cmp      ebx, eax
00000001808a2fd6: jge      0x1808a3009
00000001808a2fd8: test     rbp, rbp
00000001808a2fdb: je       0x1808a304e
00000001808a2fdd: movsxd   r8, ebx
00000001808a2fe0: mov      rcx, rbp
00000001808a2fe3: movsxd   rdx, r14d
00000001808a2fe6: call     0x1800169b0
00000001808a2feb: xor      edx, edx
00000001808a2fed: mov      rcx, rax
00000001808a2ff0: mov      rdi, rax
00000001808a2ff3: call     0x1808a0db0 ; Torappu.Battle.Route.Node.get_isValid [70387]
00000001808a2ff8: test     al, al
00000001808a2ffa: je       0x1808a3005
00000001808a2ffc: mov      edx, dword ptr [rdi + 0x24]
00000001808a2fff: add      edx, r15d
00000001808a3002: mov      dword ptr [rdi + 0x28], edx
00000001808a3005: inc      ebx
00000001808a3007: jmp      0x1808a2fc0
00000001808a3009: inc      r14d
00000001808a300c: jmp      0x1808a2fa0
00000001808a300e: mov      rax, qword ptr [rsi + 0x30]
00000001808a3012: test     rax, rax
00000001808a3015: je       0x1808a304e
00000001808a3017: cmp      r12d, dword ptr [rax + 0x18]
00000001808a301b: jae      0x1808a3054
00000001808a301d: mov      rdi, qword ptr [rax + r13]
00000001808a3021: xor      ebx, ebx
00000001808a3023: sub      r13, 8
00000001808a3027: sub      r12d, 1
00000001808a302b: jns      0x1808a2df1
00000001808a3031: mov      rbx, qword ptr [rsp + 0x60]
00000001808a3036: mov      rbp, qword ptr [rsp + 0x68]
00000001808a303b: mov      rsi, qword ptr [rsp + 0x70]
00000001808a3040: add      rsp, 0x30
00000001808a3044: pop      r15
00000001808a3046: pop      r14
00000001808a3048: pop      r13
00000001808a304a: pop      r12
00000001808a304c: pop      rdi
00000001808a304d: ret      
00000001808a304e: call     0x18048c0b0
00000001808a3053: int3     
00000001808a3054: call     0x18048c0a0
00000001808a3059: int3     
00000001808a305a: int3     
00000001808a305b: int3     
00000001808a305c: int3     
00000001808a305d: int3     
00000001808a305e: int3     
00000001808a305f: int3     