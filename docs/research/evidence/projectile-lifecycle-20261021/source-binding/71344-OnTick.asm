; Torappu.Battle.Projectile.OnTick metadata=71344 token=0x60116b1 VA=0x1808d9af0 RVA=0x8d9af0 size=0x460
00000001808d9af0: push     rsi
00000001808d9af2: push     rdi
00000001808d9af3: sub      rsp, 0x38
00000001808d9af7: cmp      byte ptr [rip + 0x83b7d05], 0
00000001808d9afe: mov      rdi, rdx
00000001808d9b01: mov      rsi, rcx
00000001808d9b04: jne      0x1808d9b3d
00000001808d9b06: lea      rcx, [rip + 0x8090f43] ; GenericMethodInfo 285168 @0x18896aa50
00000001808d9b0d: call     0x18048bf00
00000001808d9b12: lea      rcx, [rip + 0x7f80be7] ; TypeInfo Torappu.FP @0x18885a700
00000001808d9b19: call     0x18048bf00
00000001808d9b1e: lea      rcx, [rip + 0x80591c3] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808d9b25: call     0x18048bf00
00000001808d9b2a: lea      rcx, [rip + 0x7f498c7] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808d9b31: call     0x18048bf00
00000001808d9b36: mov      byte ptr [rip + 0x83b7cc6], 1
00000001808d9b3d: mov      rdx, qword ptr [rip + 0x7f498b4] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808d9b44: mov      rax, qword ptr [rdx + 0xb8]
00000001808d9b4b: mov      rcx, qword ptr [rax + 0x1a8]
00000001808d9b52: test     rcx, rcx
00000001808d9b55: jne      0x1808d9f29
00000001808d9b5b: cmp      byte ptr [rsi + 0xa4], cl
00000001808d9b61: jne      0x1808d9e2f
00000001808d9b67: cmp      byte ptr [rip + 0x83b7cc0], cl
00000001808d9b6d: jne      0x1808d9ba1
00000001808d9b6f: lea      rcx, [rip + 0x7f80b8a] ; TypeInfo Torappu.FP @0x18885a700
00000001808d9b76: call     0x18048bf00
00000001808d9b7b: lea      rcx, [rip + 0x8059166] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808d9b82: call     0x18048bf00
00000001808d9b87: lea      rcx, [rip + 0x7f4986a] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808d9b8e: call     0x18048bf00
00000001808d9b93: mov      rdx, qword ptr [rip + 0x7f4985e] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808d9b9a: mov      byte ptr [rip + 0x83b7c8c], 1
00000001808d9ba1: mov      rax, qword ptr [rdx + 0xb8]
00000001808d9ba8: mov      qword ptr [rsp + 0x50], rbx
00000001808d9bad: mov      qword ptr [rsp + 0x58], rbp
00000001808d9bb2: mov      qword ptr [rsp + 0x60], r14
00000001808d9bb7: mov      rcx, qword ptr [rax + 0x2f8]
00000001808d9bbe: mov      qword ptr [rsp + 0x30], r15
00000001808d9bc3: test     rcx, rcx
00000001808d9bc6: jne      0x1808d9c5b
00000001808d9bcc: mov      rcx, qword ptr [rip + 0x8059115] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808d9bd3: mov      rbx, qword ptr [rsi + 0xf0]
00000001808d9bda: cmp      dword ptr [rcx + 0xe0], 0
00000001808d9be1: jne      0x1808d9be8
00000001808d9be3: call     0x18048c140
00000001808d9be8: xor      r8d, r8d
00000001808d9beb: xor      edx, edx
00000001808d9bed: mov      rcx, rbx
00000001808d9bf0: call     0x186b638d0
00000001808d9bf5: test     al, al
00000001808d9bf7: je       0x1808d9c22
00000001808d9bf9: mov      rcx, qword ptr [rip + 0x7f80b00] ; TypeInfo Torappu.FP @0x18885a700
00000001808d9c00: cmp      dword ptr [rcx + 0xe0], 0
00000001808d9c07: jne      0x1808d9c0e
00000001808d9c09: call     0x18048c140
00000001808d9c0e: mov      rax, qword ptr [rip + 0x7f80aeb] ; TypeInfo Torappu.FP @0x18885a700
00000001808d9c15: mov      rbx, qword ptr [rax + 0xb8]
00000001808d9c1c: mov      rbx, qword ptr [rbx + 0x20]
00000001808d9c20: jmp      0x1808d9c69
00000001808d9c22: mov      rbx, qword ptr [rsi + 0xf0]
00000001808d9c29: test     rbx, rbx
00000001808d9c2c: je       0x1808d9f3d
00000001808d9c32: cmp      byte ptr [rip + 0x83f2bb7], 0
00000001808d9c39: jbe      0x1808d9c43
00000001808d9c3b: mov      rcx, qword ptr [rbx]
00000001808d9c3e: call     0x180446d00
00000001808d9c43: mov      rdx, qword ptr [rbx]
00000001808d9c46: mov      rcx, rbx
00000001808d9c49: mov      rax, qword ptr [rdx + 0x220]
00000001808d9c50: mov      rdx, qword ptr [rdx + 0x228]
00000001808d9c57: call     rax
00000001808d9c59: jmp      0x1808d9c66
00000001808d9c5b: xor      r8d, r8d
00000001808d9c5e: mov      rdx, rsi
00000001808d9c61: call     0x1832f4c20 ; XLua.DelegateBridge.__Gen_Delegate_Imp2620 [5275]
00000001808d9c66: mov      rbx, rax
00000001808d9c69: mov      rcx, qword ptr [rip + 0x7f80a90] ; TypeInfo Torappu.FP @0x18885a700
00000001808d9c70: cmp      dword ptr [rcx + 0xe0], 0
00000001808d9c77: jne      0x1808d9c7e
00000001808d9c79: call     0x18048c140
00000001808d9c7e: xor      r8d, r8d
00000001808d9c81: mov      rdx, rdi
00000001808d9c84: mov      rcx, rbx
00000001808d9c87: call     0x1866fb870
00000001808d9c8c: cmp      byte ptr [rip + 0x83b7b3e], 0
00000001808d9c93: mov      rbx, rax
00000001808d9c96: jne      0x1808d9cab
00000001808d9c98: lea      rcx, [rip + 0x7f49759] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808d9c9f: call     0x18048bf00
00000001808d9ca4: mov      byte ptr [rip + 0x83b7b26], 1
00000001808d9cab: mov      rax, qword ptr [rip + 0x7f49746] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808d9cb2: mov      rcx, qword ptr [rax + 0xb8]
00000001808d9cb9: mov      rcx, qword ptr [rcx + 0x18]
00000001808d9cbd: test     rcx, rcx
00000001808d9cc0: jne      0x1808d9ccb
00000001808d9cc2: mov      rax, qword ptr [rsi + 0x160]
00000001808d9cc9: jmp      0x1808d9cd6
00000001808d9ccb: xor      r8d, r8d
00000001808d9cce: mov      rdx, rsi
00000001808d9cd1: call     0x1832f4c20 ; XLua.DelegateBridge.__Gen_Delegate_Imp2620 [5275]
00000001808d9cd6: xor      r8d, r8d
00000001808d9cd9: mov      rdx, rbx
00000001808d9cdc: mov      rcx, rax
00000001808d9cdf: call     0x184624db0
00000001808d9ce4: xor      r8d, r8d
00000001808d9ce7: mov      rdx, rax
00000001808d9cea: mov      rcx, rsi
00000001808d9ced: call     0x1808ddbb0 ; Torappu.Battle.Projectile.set_currentTime [71289]
00000001808d9cf2: cmp      byte ptr [rip + 0x83b7ad8], 0
00000001808d9cf9: jne      0x1808d9d0e
00000001808d9cfb: lea      rcx, [rip + 0x7f496f6] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808d9d02: call     0x18048bf00
00000001808d9d07: mov      byte ptr [rip + 0x83b7ac3], 1
00000001808d9d0e: mov      rax, qword ptr [rip + 0x7f496e3] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808d9d15: mov      rcx, qword ptr [rax + 0xb8]
00000001808d9d1c: mov      rcx, qword ptr [rcx + 0x18]
00000001808d9d20: test     rcx, rcx
00000001808d9d23: jne      0x1808d9d2e
00000001808d9d25: mov      rax, qword ptr [rsi + 0x160]
00000001808d9d2c: jmp      0x1808d9d39
00000001808d9d2e: xor      r8d, r8d
00000001808d9d31: mov      rdx, rsi
00000001808d9d34: call     0x1832f4c20 ; XLua.DelegateBridge.__Gen_Delegate_Imp2620 [5275]
00000001808d9d39: mov      rdx, qword ptr [rsi + 0x98]
00000001808d9d40: xor      r8d, r8d
00000001808d9d43: mov      rcx, rax
00000001808d9d46: call     0x185ed91b0
00000001808d9d4b: test     al, al
00000001808d9d4d: je       0x1808d9d9a
00000001808d9d4f: mov      rcx, qword ptr [rip + 0x8058f92] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808d9d56: mov      rbx, qword ptr [rsi + 0xf0]
00000001808d9d5d: cmp      dword ptr [rcx + 0xe0], 0
00000001808d9d64: jne      0x1808d9d6b
00000001808d9d66: call     0x18048c140
00000001808d9d6b: xor      r8d, r8d
00000001808d9d6e: xor      edx, edx
00000001808d9d70: mov      rcx, rbx
00000001808d9d73: call     0x186b638d0
00000001808d9d78: test     al, al
00000001808d9d7a: jne      0x1808d9de6
00000001808d9d7c: mov      rdx, qword ptr [rsi + 0xf0]
00000001808d9d83: test     rdx, rdx
00000001808d9d86: je       0x1808d9f3d
00000001808d9d8c: mov      ecx, 0x11
00000001808d9d91: call     0x180005610
00000001808d9d96: test     al, al
00000001808d9d98: je       0x1808d9de6
00000001808d9d9a: cmp      byte ptr [rip + 0x83f2a4f], 0
00000001808d9da1: jbe      0x1808d9dab
00000001808d9da3: mov      rcx, qword ptr [rsi]
00000001808d9da6: call     0x180446d00
00000001808d9dab: mov      rdx, qword ptr [rsi]
00000001808d9dae: mov      rcx, rsi
00000001808d9db1: mov      rax, qword ptr [rdx + 0x3e0]
00000001808d9db8: mov      rdx, qword ptr [rdx + 0x3e8]
00000001808d9dbf: call     rax
00000001808d9dc1: test     al, al
00000001808d9dc3: je       0x1808d9e36
00000001808d9dc5: movups   xmm0, xmmword ptr [rsi + 0xf8]
00000001808d9dcc: mov      rdx, qword ptr [rip + 0x8090c7d] ; GenericMethodInfo 285168 @0x18896aa50
00000001808d9dd3: lea      rcx, [rsp + 0x20]
00000001808d9dd8: movaps   xmmword ptr [rsp + 0x20], xmm0
00000001808d9ddd: call     0x18449ab40
00000001808d9de2: test     al, al
00000001808d9de4: jne      0x1808d9e36
00000001808d9de6: cmp      byte ptr [rip + 0x83f2a03], 0
00000001808d9ded: jbe      0x1808d9df7
00000001808d9def: mov      rcx, qword ptr [rsi]
00000001808d9df2: call     0x180446d00
00000001808d9df7: mov      rdx, qword ptr [rsi]
00000001808d9dfa: mov      rcx, rsi
00000001808d9dfd: mov      rax, qword ptr [rdx + 0x420]
00000001808d9e04: mov      rdx, qword ptr [rdx + 0x428]
00000001808d9e0b: call     rax
00000001808d9e0d: test     al, al
00000001808d9e0f: je       0x1808d9e36
00000001808d9e11: xor      edx, edx
00000001808d9e13: mov      rcx, rsi
00000001808d9e16: call     0x1808daf40 ; Torappu.Battle.Projectile.StopMe [71373]
00000001808d9e1b: mov      r14, qword ptr [rsp + 0x60]
00000001808d9e20: mov      rbp, qword ptr [rsp + 0x58]
00000001808d9e25: mov      rbx, qword ptr [rsp + 0x50]
00000001808d9e2a: mov      r15, qword ptr [rsp + 0x30]
00000001808d9e2f: add      rsp, 0x38
00000001808d9e33: pop      rdi
00000001808d9e34: pop      rsi
00000001808d9e35: ret      
00000001808d9e36: mov      rax, qword ptr [rsi + 0x148]
00000001808d9e3d: xor      ebp, ebp
00000001808d9e3f: mov      ecx, ebp
00000001808d9e41: test     rax, rax
00000001808d9e44: je       0x1808d9f3d
00000001808d9e4a: mov      r15d, 0x20
00000001808d9e50: cmp      ecx, dword ptr [rax + 0x18]
00000001808d9e53: jge      0x1808d9e1b
00000001808d9e55: mov      rax, qword ptr [rsi + 0x148]
00000001808d9e5c: test     rax, rax
00000001808d9e5f: je       0x1808d9f3d
00000001808d9e65: cmp      ebp, dword ptr [rax + 0x18]
00000001808d9e68: jae      0x1808d9f43
00000001808d9e6e: mov      rbx, qword ptr [r15 + rax]
00000001808d9e72: test     rbx, rbx
00000001808d9e75: je       0x1808d9f3d
00000001808d9e7b: cmp      byte ptr [rip + 0x83f296e], 0
00000001808d9e82: jbe      0x1808d9e8c
00000001808d9e84: mov      rcx, qword ptr [rbx]
00000001808d9e87: call     0x180446d00
00000001808d9e8c: mov      rdx, qword ptr [rbx]
00000001808d9e8f: mov      rcx, rbx
00000001808d9e92: mov      rax, qword ptr [rdx + 0x220]
00000001808d9e99: mov      rdx, qword ptr [rdx + 0x228]
00000001808d9ea0: call     rax
00000001808d9ea2: mov      rcx, qword ptr [rip + 0x7f80857] ; TypeInfo Torappu.FP @0x18885a700
00000001808d9ea9: mov      rbx, rax
00000001808d9eac: cmp      dword ptr [rcx + 0xe0], 0
00000001808d9eb3: jne      0x1808d9eba
00000001808d9eb5: call     0x18048c140
00000001808d9eba: xor      r8d, r8d
00000001808d9ebd: mov      rdx, rdi
00000001808d9ec0: mov      rcx, rbx
00000001808d9ec3: call     0x1866fb870
00000001808d9ec8: mov      r14, qword ptr [rsi + 0x148]
00000001808d9ecf: mov      rbx, rax
00000001808d9ed2: test     r14, r14
00000001808d9ed5: je       0x1808d9f3d
00000001808d9ed7: cmp      ebp, dword ptr [r14 + 0x18]
00000001808d9edb: jae      0x1808d9f43
00000001808d9edd: mov      r14, qword ptr [r15 + r14]
00000001808d9ee1: test     r14, r14
00000001808d9ee4: je       0x1808d9f3d
00000001808d9ee6: cmp      byte ptr [rip + 0x83f2903], 0
00000001808d9eed: jbe      0x1808d9ef7
00000001808d9eef: mov      rcx, qword ptr [r14]
00000001808d9ef2: call     0x180446d00
00000001808d9ef7: mov      r8, qword ptr [r14]
00000001808d9efa: mov      rdx, rbx
00000001808d9efd: mov      rcx, r14
00000001808d9f00: mov      rax, qword ptr [r8 + 0x190]
00000001808d9f07: mov      r8, qword ptr [r8 + 0x198]
00000001808d9f0e: call     rax
00000001808d9f10: mov      rax, qword ptr [rsi + 0x148]
00000001808d9f17: inc      ebp
00000001808d9f19: add      r15, 8
00000001808d9f1d: mov      ecx, ebp
00000001808d9f1f: test     rax, rax
00000001808d9f22: je       0x1808d9f3d
00000001808d9f24: jmp      0x1808d9e50
00000001808d9f29: xor      r9d, r9d
00000001808d9f2c: mov      r8, rdi
00000001808d9f2f: mov      rdx, rsi
00000001808d9f32: add      rsp, 0x38
00000001808d9f36: pop      rdi
00000001808d9f37: pop      rsi
00000001808d9f38: jmp      0x1833f9830 ; XLua.DelegateBridge.__Gen_Delegate_Imp427 [3082]
00000001808d9f3d: call     0x18048c0b0
00000001808d9f42: int3     
00000001808d9f43: call     0x18048c0a0
00000001808d9f48: int3     
00000001808d9f49: int3     
00000001808d9f4a: int3     
00000001808d9f4b: int3     
00000001808d9f4c: int3     
00000001808d9f4d: int3     
00000001808d9f4e: int3     
00000001808d9f4f: int3     