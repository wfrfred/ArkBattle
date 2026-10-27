; Torappu.Battle.Enemy._InitPhysics metadata=76539 token=0x6012afc VA=0x180a78c30 RVA=0xa78c30 size=0x390
0000000180a78c30: push     rdi
0000000180a78c32: sub      rsp, 0x40
0000000180a78c36: cmp      byte ptr [rip + 0x8219ca7], 0
0000000180a78c3d: mov      rdi, rcx
0000000180a78c40: jne      0x180a78c9d
0000000180a78c42: lea      rcx, [rip + 0x7e190f7] ; TypeInfo UnityEngine.CircleCollider2D @0x188891d40
0000000180a78c49: call     0x18048bf00
0000000180a78c4e: lea      rcx, [rip + 0x7e69183] ; GenericMethodInfo 290354 @0x1888e1dd8
0000000180a78c55: call     0x18048bf00
0000000180a78c5a: lea      rcx, [rip + 0x7e737e7] ; GenericMethodInfo 290428 @0x1888ec448
0000000180a78c61: call     0x18048bf00
0000000180a78c66: lea      rcx, [rip + 0x7da2a43] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a78c6d: call     0x18048bf00
0000000180a78c72: lea      rcx, [rip + 0x7de1a87] ; TypeInfo Torappu.FP @0x18885a700
0000000180a78c79: call     0x18048bf00
0000000180a78c7e: lea      rcx, [rip + 0x7e42d53] ; TypeInfo Torappu.GlobalTemp @0x1888bb9d8
0000000180a78c85: call     0x18048bf00
0000000180a78c8a: lea      rcx, [rip + 0x7eba057] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a78c91: call     0x18048bf00
0000000180a78c96: mov      byte ptr [rip + 0x8219c47], 1
0000000180a78c9d: mov      rax, qword ptr [rip + 0x7da2a0c] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a78ca4: cmp      dword ptr [rax + 0xe0], 0
0000000180a78cab: jne      0x180a78cbc
0000000180a78cad: mov      rcx, rax
0000000180a78cb0: call     0x18048c140
0000000180a78cb5: mov      rax, qword ptr [rip + 0x7da29f4] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a78cbc: mov      rax, qword ptr [rax + 0xb8]
0000000180a78cc3: mov      rcx, qword ptr [rax + 0x860]
0000000180a78cca: test     rcx, rcx
0000000180a78ccd: jne      0x180a78fa0
0000000180a78cd3: mov      qword ptr [rsp + 0x50], rbx
0000000180a78cd8: mov      rdx, qword ptr [rip + 0x7e73769] ; GenericMethodInfo 290428 @0x1888ec448
0000000180a78cdf: mov      rcx, rdi
0000000180a78ce2: call     0x1844b9cd0
0000000180a78ce7: cmp      byte ptr [rip + 0x8219b5c], 0
0000000180a78cee: mov      rbx, rax
0000000180a78cf1: jne      0x180a78d06
0000000180a78cf3: lea      rcx, [rip + 0x7da29b6] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a78cfa: call     0x18048bf00
0000000180a78cff: mov      byte ptr [rip + 0x8219b44], 1
0000000180a78d06: mov      rax, qword ptr [rip + 0x7da29a3] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a78d0d: cmp      dword ptr [rax + 0xe0], 0
0000000180a78d14: jne      0x180a78d25
0000000180a78d16: mov      rcx, rax
0000000180a78d19: call     0x18048c140
0000000180a78d1e: mov      rax, qword ptr [rip + 0x7da298b] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a78d25: mov      rax, qword ptr [rax + 0xb8]
0000000180a78d2c: mov      rcx, qword ptr [rax + 0x390]
0000000180a78d33: test     rcx, rcx
0000000180a78d36: jne      0x180a78d50
0000000180a78d38: lea      rcx, [rdi + 0x558]
0000000180a78d3f: mov      qword ptr [rdi + 0x558], rbx
0000000180a78d46: mov      rdx, rbx
0000000180a78d49: call     0x18048b9e0
0000000180a78d4e: jmp      0x180a78d5e
0000000180a78d50: xor      r9d, r9d
0000000180a78d53: mov      r8, rbx
0000000180a78d56: mov      rdx, rdi
0000000180a78d59: call     0x1832d2220 ; XLua.DelegateBridge.__Gen_Delegate_Imp23 [2678]
0000000180a78d5e: mov      qword ptr [rsp + 0x58], rbp
0000000180a78d63: lea      rcx, [rdi + 0x420]
0000000180a78d6a: mov      qword ptr [rsp + 0x60], rsi
0000000180a78d6f: xor      ebx, ebx
0000000180a78d71: mov      qword ptr [rsp + 0x38], r14
0000000180a78d76: xor      edx, edx
0000000180a78d78: mov      qword ptr [rsp + 0x30], r15
0000000180a78d7d: mov      qword ptr [rdi + 0x420], rbx
0000000180a78d84: call     0x18048b9e0
0000000180a78d89: xor      edx, edx
0000000180a78d8b: mov      rcx, rdi
0000000180a78d8e: call     0x180a7f9d0 ; Torappu.Battle.Enemy.get_rigidbody2D [76384]
0000000180a78d93: test     rax, rax
0000000180a78d96: je       0x180a78fb6
0000000180a78d9c: mov      rdx, qword ptr [rip + 0x7e69035] ; GenericMethodInfo 290354 @0x1888e1dd8
0000000180a78da3: mov      rcx, rax
0000000180a78da6: call     0x1844b9cd0
0000000180a78dab: lea      rcx, [rdi + 0x428]
0000000180a78db2: mov      qword ptr [rdi + 0x428], rax
0000000180a78db9: mov      rdx, rax
0000000180a78dbc: call     0x18048b9e0
0000000180a78dc1: mov      rcx, qword ptr [rip + 0x7eb9f20] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a78dc8: mov      rsi, qword ptr [rdi + 0x428]
0000000180a78dcf: cmp      dword ptr [rcx + 0xe0], ebx
0000000180a78dd5: jne      0x180a78ddc
0000000180a78dd7: call     0x18048c140
0000000180a78ddc: xor      r8d, r8d
0000000180a78ddf: xor      edx, edx
0000000180a78de1: mov      rcx, rsi
0000000180a78de4: call     0x186b63a70 ; UnityEngine.Object.op_Inequality [282977]
0000000180a78de9: test     al, al
0000000180a78deb: je       0x180a78e78
0000000180a78df1: mov      rcx, qword ptr [rdi + 0x428]
0000000180a78df8: mov      rsi, rbx
0000000180a78dfb: test     rcx, rcx
0000000180a78dfe: je       0x180a78e0e
0000000180a78e00: mov      rax, qword ptr [rip + 0x7e18f39] ; TypeInfo UnityEngine.CircleCollider2D @0x188891d40
0000000180a78e07: cmp      qword ptr [rcx], rax
0000000180a78e0a: cmove    rsi, rcx
0000000180a78e0e: mov      rcx, qword ptr [rip + 0x7eb9ed3] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a78e15: cmp      dword ptr [rcx + 0xe0], ebx
0000000180a78e1b: jne      0x180a78e22
0000000180a78e1d: call     0x18048c140
0000000180a78e22: xor      r8d, r8d
0000000180a78e25: xor      edx, edx
0000000180a78e27: mov      rcx, rsi
0000000180a78e2a: call     0x186b63a70 ; UnityEngine.Object.op_Inequality [282977]
0000000180a78e2f: test     al, al
0000000180a78e31: je       0x180a78e78
0000000180a78e33: test     rsi, rsi
0000000180a78e36: je       0x180a78fb6
0000000180a78e3c: xor      edx, edx
0000000180a78e3e: movaps   xmmword ptr [rsp + 0x20], xmm6
0000000180a78e43: mov      rcx, rsi
0000000180a78e46: call     0x186bc2840 ; UnityEngine.CircleCollider2D.get_radius [318579]
0000000180a78e4b: mov      rcx, qword ptr [rip + 0x7de18ae] ; TypeInfo Torappu.FP @0x18885a700
0000000180a78e52: movaps   xmm6, xmm0
0000000180a78e55: cmp      dword ptr [rcx + 0xe0], ebx
0000000180a78e5b: jne      0x180a78e62
0000000180a78e5d: call     0x18048c140
0000000180a78e62: xor      edx, edx
0000000180a78e64: movaps   xmm0, xmm6
0000000180a78e67: call     0x1866fdad0
0000000180a78e6c: movaps   xmm6, xmmword ptr [rsp + 0x20]
0000000180a78e71: mov      qword ptr [rdi + 0x430], rax
0000000180a78e78: mov      rax, qword ptr [rip + 0x7e42b59] ; TypeInfo Torappu.GlobalTemp @0x1888bb9d8
0000000180a78e7f: cmp      dword ptr [rax + 0xe0], ebx
0000000180a78e85: jne      0x180a78e96
0000000180a78e87: mov      rcx, rax
0000000180a78e8a: call     0x18048c140
0000000180a78e8f: mov      rax, qword ptr [rip + 0x7e42b42] ; TypeInfo Torappu.GlobalTemp @0x1888bb9d8
0000000180a78e96: cmp      byte ptr [rip + 0x82199ad], bl
0000000180a78e9c: mov      rax, qword ptr [rax + 0xb8]
0000000180a78ea3: mov      rbp, qword ptr [rax]
0000000180a78ea6: jne      0x180a78ebb
0000000180a78ea8: lea      rcx, [rip + 0x7da2801] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a78eaf: call     0x18048bf00
0000000180a78eb4: mov      byte ptr [rip + 0x821998e], 1
0000000180a78ebb: mov      rax, qword ptr [rip + 0x7da27ee] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a78ec2: cmp      dword ptr [rax + 0xe0], ebx
0000000180a78ec8: jne      0x180a78ed9
0000000180a78eca: mov      rcx, rax
0000000180a78ecd: call     0x18048c140
0000000180a78ed2: mov      rax, qword ptr [rip + 0x7da27d7] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a78ed9: mov      rax, qword ptr [rax + 0xb8]
0000000180a78ee0: mov      rcx, qword ptr [rax + 0x388]
0000000180a78ee7: test     rcx, rcx
0000000180a78eea: jne      0x180a78ef5
0000000180a78eec: mov      rax, qword ptr [rdi + 0x558]
0000000180a78ef3: jmp      0x180a78f00
0000000180a78ef5: xor      r8d, r8d
0000000180a78ef8: mov      rdx, rdi
0000000180a78efb: call     0x18339eba0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3705 [6360]
0000000180a78f00: test     rax, rax
0000000180a78f03: je       0x180a78fb6
0000000180a78f09: xor      r8d, r8d
0000000180a78f0c: mov      rdx, rbp
0000000180a78f0f: mov      rcx, rax
0000000180a78f12: call     0x186bc6c90 ; UnityEngine.Rigidbody2D.GetAttachedColliders [318557] | UnityEngine.Rigidbody2D.GetAttachedCollidersArray_Internal [318558]
0000000180a78f17: test     eax, eax
0000000180a78f19: jle      0x180a78f56
0000000180a78f1b: movsxd   r15, eax
0000000180a78f1e: nop      
0000000180a78f20: lea      r14, [rbp + 0x20]
0000000180a78f24: mov      rsi, rbx
0000000180a78f27: test     rbp, rbp
0000000180a78f2a: je       0x180a78fb6
0000000180a78f30: cmp      ebx, dword ptr [rbp + 0x18]
0000000180a78f33: jae      0x180a78fb0
0000000180a78f35: mov      rcx, qword ptr [r14]
0000000180a78f38: test     rcx, rcx
0000000180a78f3b: je       0x180a78fb6
0000000180a78f3d: xor      edx, edx
0000000180a78f3f: call     0x186bc2a50 ; UnityEngine.Collider2D.get_isTrigger [318565]
0000000180a78f44: test     al, al
0000000180a78f46: je       0x180a78f7e
0000000180a78f48: inc      ebx
0000000180a78f4a: inc      rsi
0000000180a78f4d: add      r14, 8
0000000180a78f51: cmp      rsi, r15
0000000180a78f54: jl       0x180a78f30
0000000180a78f56: xor      edx, edx
0000000180a78f58: mov      rcx, rdi
0000000180a78f5b: mov      r14, qword ptr [rsp + 0x38]
0000000180a78f60: mov      rsi, qword ptr [rsp + 0x60]
0000000180a78f65: mov      rbp, qword ptr [rsp + 0x58]
0000000180a78f6a: mov      r15, qword ptr [rsp + 0x30]
0000000180a78f6f: mov      rbx, qword ptr [rsp + 0x50]
0000000180a78f74: add      rsp, 0x40
0000000180a78f78: pop      rdi
0000000180a78f79: jmp      0x180a7a1f0 ; Torappu.Battle.Enemy._ResetPhysicsStatus [76493]
0000000180a78f7e: cmp      ebx, dword ptr [rbp + 0x18]
0000000180a78f81: jae      0x180a78fb0
0000000180a78f83: movsxd   rax, ebx
0000000180a78f86: lea      rcx, [rdi + 0x420]
0000000180a78f8d: mov      rdx, qword ptr [rbp + rax*8 + 0x20]
0000000180a78f92: mov      qword ptr [rdi + 0x420], rdx
0000000180a78f99: call     0x18048b9e0
0000000180a78f9e: jmp      0x180a78f56
0000000180a78fa0: xor      r8d, r8d
0000000180a78fa3: mov      rdx, rdi
0000000180a78fa6: add      rsp, 0x40
0000000180a78faa: pop      rdi
0000000180a78fab: jmp      0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
0000000180a78fb0: call     0x18048c0a0
0000000180a78fb5: int3     
0000000180a78fb6: call     0x18048c0b0
0000000180a78fbb: int3     
0000000180a78fbc: int3     
0000000180a78fbd: int3     
0000000180a78fbe: int3     
0000000180a78fbf: int3     