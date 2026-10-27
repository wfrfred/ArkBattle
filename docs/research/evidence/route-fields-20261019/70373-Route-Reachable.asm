; Torappu.Battle.Route.CheckReachable metadata=70373 token=0x60112e6 VA=0x1808a1d10 RVA=0x8a1d10 size=0x220
00000001808a1d10: mov      qword ptr [rsp + 0x10], rbx
00000001808a1d15: mov      qword ptr [rsp + 0x18], rbp
00000001808a1d1a: push     rsi
00000001808a1d1b: push     rdi
00000001808a1d1c: push     r14
00000001808a1d1e: sub      rsp, 0x70
00000001808a1d22: movzx    ebp, dl
00000001808a1d25: movzx    r14d, r8b
00000001808a1d29: mov      rdx, qword ptr [rcx + 0x18]
00000001808a1d2d: mov      rsi, rcx
00000001808a1d30: test     rdx, rdx
00000001808a1d33: je       0x1808a1f1d
00000001808a1d39: mov      rdi, qword ptr [rcx + 0x18]
00000001808a1d3d: mov      rdx, qword ptr [rdx + 0x14]
00000001808a1d41: test     rdi, rdi
00000001808a1d44: je       0x1808a1f1d
00000001808a1d4a: mov      rdi, qword ptr [rdi + 0x38]
00000001808a1d4e: mov      rbx, qword ptr [rcx + 0x18]
00000001808a1d52: xor      r10d, r10d
00000001808a1d55: mov      qword ptr [rsp + 0x90], rdx
00000001808a1d5d: mov      r11d, 0x20
00000001808a1d63: mov      eax, r10d
00000001808a1d66: mov      ecx, r11d
00000001808a1d69: mov      r8d, r10d
00000001808a1d6c: test     rdi, rdi
00000001808a1d6f: je       0x1808a1f1d
00000001808a1d75: cmp      r8d, dword ptr [rdi + 0x18]
00000001808a1d79: jge      0x1808a1de2
00000001808a1d7b: mov      r8, qword ptr [rbx + 0x38]
00000001808a1d7f: test     r8, r8
00000001808a1d82: je       0x1808a1f1d
00000001808a1d88: cmp      eax, dword ptr [r8 + 0x18]
00000001808a1d8c: jae      0x1808a1f23
00000001808a1d92: mov      r9, qword ptr [rcx + r8]
00000001808a1d96: test     r9, r9
00000001808a1d99: je       0x1808a1f1d
00000001808a1d9f: cmp      dword ptr [r9 + 0x10], 6
00000001808a1da4: jne      0x1808a1dc9
00000001808a1da6: mov      rdx, qword ptr [r8 + rcx]
00000001808a1daa: lea      eax, [r10 + 1]
00000001808a1dae: lea      rcx, [r11 + 8]
00000001808a1db2: mov      r8d, eax
00000001808a1db5: mov      r11, rcx
00000001808a1db8: mov      r10d, eax
00000001808a1dbb: mov      rdx, qword ptr [rdx + 0x18]
00000001808a1dbf: mov      qword ptr [rsp + 0x90], rdx
00000001808a1dc7: jmp      0x1808a1d75
00000001808a1dc9: inc      eax
00000001808a1dcb: mov      qword ptr [rsp + 0x90], rdx
00000001808a1dd3: add      rcx, 8
00000001808a1dd7: mov      r8d, eax
00000001808a1dda: mov      r11, rcx
00000001808a1ddd: mov      r10d, eax
00000001808a1de0: jmp      0x1808a1d75
00000001808a1de2: mov      rcx, qword ptr [rsi + 0x28]
00000001808a1de6: test     rcx, rcx
00000001808a1de9: je       0x1808a1f1d
00000001808a1def: mov      rax, qword ptr [rcx + 0x10]
00000001808a1df3: movsxd   r9, dword ptr [rsp + 0x94]
00000001808a1dfb: movsxd   r10, edx
00000001808a1dfe: cmp      r10d, dword ptr [rax]
00000001808a1e01: jae      0x1808a1f23
00000001808a1e07: mov      r8, qword ptr [rax + 0x10]
00000001808a1e0b: cmp      r9d, r8d
00000001808a1e0e: jae      0x1808a1f23
00000001808a1e14: imul     r8, r10
00000001808a1e18: add      r8, r9
00000001808a1e1b: lea      rax, [r8 + r8*2]
00000001808a1e1f: add      rax, rax
00000001808a1e22: movups   xmm0, xmmword ptr [rcx + rax*8 + 0x20]
00000001808a1e27: movups   xmm1, xmmword ptr [rcx + rax*8 + 0x40]
00000001808a1e2c: movups   xmmword ptr [rsp + 0x30], xmm0
00000001808a1e31: movups   xmm0, xmm1
00000001808a1e34: psrldq   xmm0, 4
00000001808a1e39: movd     edi, xmm0
00000001808a1e3d: movups   xmmword ptr [rsp + 0x20], xmm1
00000001808a1e42: test     r14b, r14b
00000001808a1e45: je       0x1808a1e92
00000001808a1e47: mov      rcx, qword ptr [rsi + 0x10]
00000001808a1e4b: test     rcx, rcx
00000001808a1e4e: je       0x1808a1f1d
00000001808a1e54: xor      r8d, r8d
00000001808a1e57: call     0x18087dbc0 ; Torappu.Battle.Map.GetTile [70077]
00000001808a1e5c: mov      rbx, rax
00000001808a1e5f: test     rax, rax
00000001808a1e62: je       0x1808a1f1d
00000001808a1e68: cmp      byte ptr [rip + 0x842a981], 0
00000001808a1e6f: jbe      0x1808a1e79
00000001808a1e71: mov      rcx, qword ptr [rax]
00000001808a1e74: call     0x180446d00
00000001808a1e79: mov      rdx, qword ptr [rbx]
00000001808a1e7c: mov      rcx, rbx
00000001808a1e7f: mov      r8, qword ptr [rdx + 0x240]
00000001808a1e86: mov      rdx, qword ptr [rdx + 0x248]
00000001808a1e8d: call     r8
00000001808a1e90: sub      edi, eax
00000001808a1e92: cmp      byte ptr [rip + 0x83ef695], 0
00000001808a1e99: jne      0x1808a1eae
00000001808a1e9b: lea      rcx, [rip + 0x8090e46] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808a1ea2: call     0x18048bf00
00000001808a1ea7: mov      byte ptr [rip + 0x83ef680], 1
00000001808a1eae: movups   xmm0, xmmword ptr [rsp + 0x20]
00000001808a1eb3: psrldq   xmm0, 4
00000001808a1eb8: movd     eax, xmm0
00000001808a1ebc: test     eax, eax
00000001808a1ebe: js       0x1808a1f19
00000001808a1ec0: mov      rcx, qword ptr [rip + 0x8090e21] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808a1ec7: cmp      dword ptr [rcx + 0xe0], 0
00000001808a1ece: jne      0x1808a1ed5
00000001808a1ed0: call     0x18048c140
00000001808a1ed5: movups   xmm0, xmmword ptr [rsp + 0x30]
00000001808a1eda: xor      r8d, r8d
00000001808a1edd: xor      edx, edx
00000001808a1edf: psrldq   xmm0, 8
00000001808a1ee4: movq     rcx, xmm0
00000001808a1ee9: call     0x186b63a70
00000001808a1eee: test     al, al
00000001808a1ef0: je       0x1808a1f19
00000001808a1ef2: test     bpl, bpl
00000001808a1ef5: jne      0x1808a1f0e
00000001808a1ef7: mov      al, 1
00000001808a1ef9: lea      r11, [rsp + 0x70]
00000001808a1efe: mov      rbx, qword ptr [r11 + 0x28]
00000001808a1f02: mov      rbp, qword ptr [r11 + 0x30]
00000001808a1f06: mov      rsp, r11
00000001808a1f09: pop      r14
00000001808a1f0b: pop      rdi
00000001808a1f0c: pop      rsi
00000001808a1f0d: ret      
00000001808a1f0e: cmp      edi, 0x3e8
00000001808a1f14: setl     al
00000001808a1f17: jmp      0x1808a1ef9
00000001808a1f19: xor      al, al
00000001808a1f1b: jmp      0x1808a1ef9
00000001808a1f1d: call     0x18048c0b0
00000001808a1f22: int3     
00000001808a1f23: call     0x18048c0a0
00000001808a1f28: int3     
00000001808a1f29: int3     
00000001808a1f2a: int3     
00000001808a1f2b: int3     
00000001808a1f2c: int3     
00000001808a1f2d: int3     
00000001808a1f2e: int3     
00000001808a1f2f: int3     