; Torappu.Battle.Enemy.RegisterBlocker metadata=76432 token=0x6012a91 VA=0x180a73e00 RVA=0xa73e00 size=0x310
0000000180a73e00: mov      qword ptr [rsp + 0x20], rbx
0000000180a73e05: push     rdi
0000000180a73e06: sub      rsp, 0x60
0000000180a73e0a: cmp      byte ptr [rip + 0x821ea68], 0
0000000180a73e11: mov      rbx, rdx
0000000180a73e14: movaps   xmmword ptr [rsp + 0x50], xmm6
0000000180a73e19: mov      rdi, rcx
0000000180a73e1c: movq     xmm6, r8
0000000180a73e21: movsd    qword ptr [rsp + 0x40], xmm6
0000000180a73e27: jne      0x180a73e48
0000000180a73e29: lea      rcx, [rip + 0x7da7880] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a73e30: call     0x18048bf00
0000000180a73e35: lea      rcx, [rip + 0x7ec1e2c] ; GenericMethodInfo 280380 @0x188935c68
0000000180a73e3c: call     0x18048bf00
0000000180a73e41: mov      byte ptr [rip + 0x821ea31], 1
0000000180a73e48: mov      rcx, qword ptr [rip + 0x7da7861] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a73e4f: cmp      dword ptr [rcx + 0xe0], 0
0000000180a73e56: jne      0x180a73e64
0000000180a73e58: call     0x18048c140
0000000180a73e5d: mov      rcx, qword ptr [rip + 0x7da784c] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a73e64: mov      rax, qword ptr [rcx + 0xb8]
0000000180a73e6b: mov      r10, qword ptr [rax + 0x508]
0000000180a73e72: test     r10, r10
0000000180a73e75: jne      0x180a740bf
0000000180a73e7b: cmp      byte ptr [rip + 0x821e9f3], r10b
0000000180a73e82: jne      0x180a73eaa
0000000180a73e84: lea      rcx, [rip + 0x7da7825] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a73e8b: call     0x18048bf00
0000000180a73e90: lea      rcx, [rip + 0x7ec1951] ; GenericMethodInfo 280378 @0x1889357e8
0000000180a73e97: call     0x18048bf00
0000000180a73e9c: mov      rcx, qword ptr [rip + 0x7da780d] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a73ea3: mov      byte ptr [rip + 0x821e9cb], 1
0000000180a73eaa: cmp      dword ptr [rcx + 0xe0], 0
0000000180a73eb1: jne      0x180a73ebf
0000000180a73eb3: call     0x18048c140
0000000180a73eb8: mov      rcx, qword ptr [rip + 0x7da77f1] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a73ebf: mov      rax, qword ptr [rcx + 0xb8]
0000000180a73ec6: mov      rcx, qword ptr [rax + 0x4e8]
0000000180a73ecd: test     rcx, rcx
0000000180a73ed0: jne      0x180a73f17
0000000180a73ed2: mov      rdx, qword ptr [rip + 0x7ec190f] ; GenericMethodInfo 280378 @0x1889357e8
0000000180a73ed9: lea      rcx, [rdi + 0x398]
0000000180a73ee0: call     0x185159fc0
0000000180a73ee5: test     al, al
0000000180a73ee7: jne      0x180a73f29
0000000180a73ee9: test     rbx, rbx
0000000180a73eec: je       0x180a740ec
0000000180a73ef2: xor      r9d, r9d
0000000180a73ef5: xorps    xmm2, xmm2
0000000180a73ef8: mov      rdx, rdi
0000000180a73efb: mov      rcx, rbx
0000000180a73efe: call     0x180a64780
0000000180a73f03: test     al, al
0000000180a73f05: je       0x180a73f29
0000000180a73f07: xor      r8d, r8d
0000000180a73f0a: mov      rdx, rbx
0000000180a73f0d: mov      rcx, rdi
0000000180a73f10: call     0x180a6b980 ; Torappu.Battle.Enemy.CheckBlockableWithoutCheckRange [76429]
0000000180a73f15: jmp      0x180a73f25
0000000180a73f17: xor      r9d, r9d
0000000180a73f1a: mov      r8, rbx
0000000180a73f1d: mov      rdx, rdi
0000000180a73f20: call     0x18332fc60 ; XLua.DelegateBridge.__Gen_Delegate_Imp29 [2684]
0000000180a73f25: test     al, al
0000000180a73f27: jne      0x180a73f3e
0000000180a73f29: xor      al, al
0000000180a73f2b: mov      rbx, qword ptr [rsp + 0x88]
0000000180a73f33: movaps   xmm6, xmmword ptr [rsp + 0x50]
0000000180a73f38: add      rsp, 0x60
0000000180a73f3c: pop      rdi
0000000180a73f3d: ret      
0000000180a73f3e: test     rbx, rbx
0000000180a73f41: je       0x180a740ec
0000000180a73f47: xor      edx, edx
0000000180a73f49: mov      rcx, rbx
0000000180a73f4c: call     0x180a64910
0000000180a73f51: mov      r8, qword ptr [rip + 0x7ec1d10] ; GenericMethodInfo 280380 @0x188935c68
0000000180a73f58: lea      rcx, [rsp + 0x30]
0000000180a73f5d: mov      rdx, rax
0000000180a73f60: call     0x18515a130
0000000180a73f65: movups   xmm0, xmmword ptr [rsp + 0x30]
0000000180a73f6a: lea      rcx, [rdi + 0x398]
0000000180a73f71: xor      edx, edx
0000000180a73f73: movups   xmmword ptr [rdi + 0x398], xmm0
0000000180a73f7a: call     0x18048b9e0
0000000180a73f7f: xor      r8d, r8d
0000000180a73f82: mov      edx, 0x18
0000000180a73f87: mov      rcx, rdi
0000000180a73f8a: call     0x1806f2700 ; Torappu.Battle.Entity.EmitEvent [66715]
0000000180a73f8f: xor      edx, edx
0000000180a73f91: mov      rcx, rdi
0000000180a73f94: call     0x180702100 ; Torappu.Battle.Entity.get_buffContainer [66402]
0000000180a73f99: test     rax, rax
0000000180a73f9c: je       0x180a740ec
0000000180a73fa2: xor      edx, edx
0000000180a73fa4: mov      rcx, rax
0000000180a73fa7: call     0x180675680 ; Torappu.Battle.Buff.BuffContainer.OnOwnerBlockeeChanged [65434]
0000000180a73fac: mov      rax, qword ptr [rbx]
0000000180a73faf: mov      ecx, dword ptr [rax + 0x11c]
0000000180a73fb5: add      ecx, -0x60
0000000180a73fb8: cmp      ecx, 0x12
0000000180a73fbb: ja       0x180a73fe7
0000000180a73fbd: movsxd   rax, ecx
0000000180a73fc0: lea      rdx, [rip - 0xa73fc7]
0000000180a73fc7: movzx    eax, byte ptr [rdx + rax + 0xa740f8]
0000000180a73fcf: mov      ecx, dword ptr [rdx + rax*4 + 0xa740f4]
0000000180a73fd6: add      rcx, rdx
0000000180a73fd9: jmp      rcx
0000000180a73fdb: xor      edx, edx
0000000180a73fdd: mov      rcx, rbx
0000000180a73fe0: call     0x180ad4250 ; Torappu.Battle.VisualObject.get_mapPosition [77866]
0000000180a73fe5: jmp      0x180a7405d
0000000180a73fe7: cmp      byte ptr [rip + 0x8258802], 0
0000000180a73fee: mov      qword ptr [rsp + 0x70], rbp
0000000180a73ff3: mov      rbp, qword ptr [rbx]
0000000180a73ff6: mov      qword ptr [rsp + 0x78], rsi
0000000180a73ffb: mov      rsi, qword ptr [rip + 0x7eca49e] ; TypeInfo Torappu.Battle.IBlocker @0x18893e4a0
0000000180a74002: je       0x180a7400c
0000000180a74004: mov      rcx, rbp
0000000180a74007: call     0x180446d00
0000000180a7400c: movzx    edx, word ptr [rbp + 0x12e]
0000000180a74013: xor      ecx, ecx
0000000180a74015: cmp      cx, dx
0000000180a74018: jae      0x180a74035
0000000180a7401a: mov      r8, qword ptr [rbp + 0xb0]
0000000180a74021: movzx    eax, cx
0000000180a74024: add      rax, rax
0000000180a74027: cmp      qword ptr [r8 + rax*8], rsi
0000000180a7402b: je       0x180a740a2
0000000180a7402d: inc      cx
0000000180a74030: cmp      cx, dx
0000000180a74033: jb       0x180a74021
0000000180a74035: mov      r8d, 7
0000000180a7403b: mov      rdx, rsi
0000000180a7403e: mov      rcx, rbx
0000000180a74041: call     0x180445cc0
0000000180a74046: mov      r8, qword ptr [rax]
0000000180a74049: mov      rcx, rbx
0000000180a7404c: mov      rdx, qword ptr [rax + 8]
0000000180a74050: call     r8
0000000180a74053: mov      rsi, qword ptr [rsp + 0x78]
0000000180a74058: mov      rbp, qword ptr [rsp + 0x70]
0000000180a7405d: mov      qword ptr [rsp + 0x30], rax
0000000180a74062: movss    xmm0, dword ptr [rsp + 0x30]
0000000180a74068: movss    xmm1, dword ptr [rsp + 0x34]
0000000180a7406e: addss    xmm0, dword ptr [rsp + 0x40]
0000000180a74074: addss    xmm1, dword ptr [rsp + 0x44]
0000000180a7407a: unpcklps xmm0, xmm1
0000000180a7407d: xor      r8d, r8d
0000000180a74080: movq     rdx, xmm0
0000000180a74085: mov      rcx, rdi
0000000180a74088: call     0x180a799d0 ; Torappu.Battle.Enemy._MoveToBlockPosition [76515]
0000000180a7408d: mov      al, 1
0000000180a7408f: mov      rbx, qword ptr [rsp + 0x88]
0000000180a74097: movaps   xmm6, xmmword ptr [rsp + 0x50]
0000000180a7409c: add      rsp, 0x60
0000000180a740a0: pop      rdi
0000000180a740a1: ret      
0000000180a740a2: movzx    ecx, cx
0000000180a740a5: add      rcx, rcx
0000000180a740a8: mov      eax, dword ptr [r8 + rcx*8 + 8]
0000000180a740ad: add      eax, 7
0000000180a740b0: cdqe     
0000000180a740b2: add      rax, 0x14
0000000180a740b6: shl      rax, 4
0000000180a740ba: add      rax, rbp
0000000180a740bd: jmp      0x180a74046
0000000180a740bf: xor      ecx, ecx
0000000180a740c1: movq     r9, xmm6
0000000180a740c6: mov      qword ptr [rsp + 0x20], rcx
0000000180a740cb: mov      r8, rbx
0000000180a740ce: mov      rcx, r10
0000000180a740d1: mov      rdx, rdi
0000000180a740d4: call     0x18339f970 ; XLua.DelegateBridge.__Gen_Delegate_Imp3710 [6365]
0000000180a740d9: mov      rbx, qword ptr [rsp + 0x88]
0000000180a740e1: movaps   xmm6, xmmword ptr [rsp + 0x50]
0000000180a740e6: add      rsp, 0x60
0000000180a740ea: pop      rdi
0000000180a740eb: ret      
0000000180a740ec: call     0x18048c0b0
0000000180a740f1: int3     
0000000180a740f2: nop      
0000000180a740f4: fstp     xword ptr [rdi]
0000000180a740f6: cmpsd    dword ptr [rsi], dword ptr [rdi]
0000000180a740f7: add      byte ptr [rax], al
0000000180a740f9: add      byte ptr [rax], al
0000000180a740fb: add      byte ptr [rax], al
0000000180a740fd: add      byte ptr [rax], al
0000000180a740ff: add      byte ptr [rax], al
0000000180a74101: add      byte ptr [rax], al
0000000180a74103: add      byte ptr [rax], al
0000000180a74105: add      byte ptr [rax], al
0000000180a74107: add      byte ptr [rax], al
0000000180a74109: add      byte ptr [rax], al
0000000180a7410b: int3     
0000000180a7410c: int3     
0000000180a7410d: int3     
0000000180a7410e: int3     
0000000180a7410f: int3     