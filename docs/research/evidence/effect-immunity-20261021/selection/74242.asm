; Torappu.Battle.AdvancedSelector._CheckAbilityInputTargetValid metadata=74242 token=0x6012203 VA=0x1809c3c20 RVA=0x9c3c20 size=0x210
00000001809c3c20: push     rbx
00000001809c3c22: sub      rsp, 0x60
00000001809c3c26: cmp      byte ptr [rip + 0x82ce4ba], 0
00000001809c3c2d: mov      rbx, rcx
00000001809c3c30: jne      0x1809c3c8d
00000001809c3c32: lea      rcx, [rip + 0x7fb1077] ; TypeInfo Torappu.Battle.AbilityStandard @0x188974cb0
00000001809c3c39: call     0x18048bf00
00000001809c3c3e: lea      rcx, [rip + 0x7e61d23] ; TypeInfo Torappu.Battle.AdvancedSelector @0x188825968
00000001809c3c45: call     0x18048bf00
00000001809c3c4a: lea      rcx, [rip + 0x7e96967] ; GenericMethodInfo 264923 @0x18885a5b8
00000001809c3c51: call     0x18048bf00
00000001809c3c56: lea      rcx, [rip + 0x7f5810b] ; TypeInfo type(0x15, data=0x188986630) @0x18891bd68
00000001809c3c5d: call     0x18048bf00
00000001809c3c62: lea      rcx, [rip + 0x7f6fdff] ; TypeInfo Torappu.ObjectExtensions @0x188933a68
00000001809c3c69: call     0x18048bf00
00000001809c3c6e: lea      rcx, [rip + 0x7f71b73] ; GenericMethodInfo 280378 @0x1889357e8
00000001809c3c75: call     0x18048bf00
00000001809c3c7a: lea      rcx, [rip + 0x7f6f067] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001809c3c81: call     0x18048bf00
00000001809c3c86: mov      byte ptr [rip + 0x82ce45a], 1
00000001809c3c8d: mov      rax, qword ptr [rip + 0x7e61cd4] ; TypeInfo Torappu.Battle.AdvancedSelector @0x188825968
00000001809c3c94: cmp      dword ptr [rax + 0xe0], 0
00000001809c3c9b: jne      0x1809c3cac
00000001809c3c9d: mov      rcx, rax
00000001809c3ca0: call     0x18048c140
00000001809c3ca5: mov      rax, qword ptr [rip + 0x7e61cbc] ; TypeInfo Torappu.Battle.AdvancedSelector @0x188825968
00000001809c3cac: mov      rax, qword ptr [rax + 0xb8]
00000001809c3cb3: mov      rcx, qword ptr [rax + 0x100]
00000001809c3cba: test     rcx, rcx
00000001809c3cbd: jne      0x1809c3e10
00000001809c3cc3: mov      qword ptr [rsp + 0x70], rdi
00000001809c3cc8: xor      edx, edx
00000001809c3cca: mov      rcx, rbx
00000001809c3ccd: call     0x1809fc7a0 ; Torappu.Battle.TargetSelector.get_ability [75082]
00000001809c3cd2: mov      rdx, qword ptr [rip + 0x7fb0fd7] ; TypeInfo Torappu.Battle.AbilityStandard @0x188974cb0
00000001809c3cd9: mov      rdi, rax
00000001809c3cdc: test     rax, rax
00000001809c3cdf: jne      0x1809c3ce5
00000001809c3ce1: xor      ebx, ebx
00000001809c3ce3: jmp      0x1809c3d2f
00000001809c3ce5: cmp      byte ptr [rip + 0x8308b04], 0
00000001809c3cec: mov      r8, qword ptr [rax]
00000001809c3cef: jbe      0x1809c3cff
00000001809c3cf1: mov      rcx, r8
00000001809c3cf4: call     0x1804463e0
00000001809c3cf9: xor      ebx, ebx
00000001809c3cfb: test     al, al
00000001809c3cfd: jmp      0x1809c3d2b
00000001809c3cff: movzx    eax, byte ptr [rdx + 0x130]
00000001809c3d06: xor      ebx, ebx
00000001809c3d08: cmp      byte ptr [r8 + 0x130], al
00000001809c3d0f: jb       0x1809c3d27
00000001809c3d11: movzx    ecx, al
00000001809c3d14: mov      rax, qword ptr [r8 + 0xc8]
00000001809c3d1b: cmp      qword ptr [rax + rcx*8 - 8], rdx
00000001809c3d20: mov      eax, 1
00000001809c3d25: je       0x1809c3d29
00000001809c3d27: mov      eax, ebx
00000001809c3d29: test     eax, eax
00000001809c3d2b: cmovne   rbx, rdi
00000001809c3d2f: mov      rcx, qword ptr [rip + 0x7f6efb2] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001809c3d36: cmp      dword ptr [rcx + 0xe0], 0
00000001809c3d3d: jne      0x1809c3d44
00000001809c3d3f: call     0x18048c140
00000001809c3d44: xor      r8d, r8d
00000001809c3d47: xor      edx, edx
00000001809c3d49: mov      rcx, rbx
00000001809c3d4c: call     0x186b63a70
00000001809c3d51: test     al, al
00000001809c3d53: je       0x1809c3e03
00000001809c3d59: test     rbx, rbx
00000001809c3d5c: je       0x1809c3e21
00000001809c3d62: xor      r8d, r8d
00000001809c3d65: lea      rcx, [rsp + 0x48]
00000001809c3d6a: mov      rdx, rbx
00000001809c3d6d: call     0x1805d4270 ; Torappu.Battle.AbilityStandard.get_inputTarget [63121]
00000001809c3d72: mov      rcx, qword ptr [rip + 0x7f57fef] ; TypeInfo type(0x15, data=0x188986630) @0x18891bd68
00000001809c3d79: lea      rdx, [rsp + 0x30]
00000001809c3d7e: movups   xmm0, xmmword ptr [rax]
00000001809c3d81: movups   xmmword ptr [rsp + 0x30], xmm0
00000001809c3d86: movsd    xmm1, qword ptr [rax + 0x10]
00000001809c3d8b: movsd    qword ptr [rsp + 0x40], xmm1
00000001809c3d91: call     0x18048b9c0
00000001809c3d96: mov      rcx, qword ptr [rip + 0x7f6fccb] ; TypeInfo Torappu.ObjectExtensions @0x188933a68
00000001809c3d9d: mov      rdi, rax
00000001809c3da0: cmp      dword ptr [rcx + 0xe0], 0
00000001809c3da7: jne      0x1809c3dae
00000001809c3da9: call     0x18048c140
00000001809c3dae: xor      edx, edx
00000001809c3db0: mov      rcx, rdi
00000001809c3db3: call     0x1866e81e0
00000001809c3db8: test     al, al
00000001809c3dba: jne      0x1809c3e03
00000001809c3dbc: xor      r8d, r8d
00000001809c3dbf: lea      rcx, [rsp + 0x48]
00000001809c3dc4: mov      rdx, rbx
00000001809c3dc7: call     0x1805d4270 ; Torappu.Battle.AbilityStandard.get_inputTarget [63121]
00000001809c3dcc: mov      rdx, qword ptr [rip + 0x7f71a15] ; GenericMethodInfo 280378 @0x1889357e8
00000001809c3dd3: lea      rcx, [rsp + 0x20]
00000001809c3dd8: movups   xmm0, xmmword ptr [rax]
00000001809c3ddb: movsd    xmm1, qword ptr [rax + 0x10]
00000001809c3de0: movups   xmmword ptr [rsp + 0x30], xmm0
00000001809c3de5: movups   xmm2, xmmword ptr [rsp + 0x38]
00000001809c3dea: unpcklpd xmm2, xmm1
00000001809c3dee: movups   xmmword ptr [rsp + 0x20], xmm2
00000001809c3df3: call     0x185159fc0
00000001809c3df8: mov      rdi, qword ptr [rsp + 0x70]
00000001809c3dfd: add      rsp, 0x60
00000001809c3e01: pop      rbx
00000001809c3e02: ret      
00000001809c3e03: mov      rdi, qword ptr [rsp + 0x70]
00000001809c3e08: xor      al, al
00000001809c3e0a: add      rsp, 0x60
00000001809c3e0e: pop      rbx
00000001809c3e0f: ret      
00000001809c3e10: xor      r8d, r8d
00000001809c3e13: mov      rdx, rbx
00000001809c3e16: call     0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
00000001809c3e1b: add      rsp, 0x60
00000001809c3e1f: pop      rbx
00000001809c3e20: ret      
00000001809c3e21: call     0x18048c0b0
00000001809c3e26: int3     
00000001809c3e27: int3     
00000001809c3e28: int3     
00000001809c3e29: int3     
00000001809c3e2a: int3     
00000001809c3e2b: int3     
00000001809c3e2c: int3     
00000001809c3e2d: int3     
00000001809c3e2e: int3     
00000001809c3e2f: int3     