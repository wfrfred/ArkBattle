; Torappu.Battle.Enemy.UnregisterBlocker metadata=76433 token=0x6012a92 VA=0x180a76b50 RVA=0xa76b50 size=0x160
0000000180a76b50: mov      qword ptr [rsp + 8], rbx
0000000180a76b55: push     rdi
0000000180a76b56: sub      rsp, 0x50
0000000180a76b5a: cmp      byte ptr [rip + 0x821bd19], 0
0000000180a76b61: mov      rdi, rdx
0000000180a76b64: mov      rbx, rcx
0000000180a76b67: jne      0x180a76b94
0000000180a76b69: lea      rcx, [rip + 0x7da4b40] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a76b70: call     0x18048bf00
0000000180a76b75: lea      rcx, [rip + 0x7ebeeac] ; GenericMethodInfo 280379 @0x188935a28
0000000180a76b7c: call     0x18048bf00
0000000180a76b81: lea      rcx, [rip + 0x7ebf0e0] ; GenericMethodInfo 280380 @0x188935c68
0000000180a76b88: call     0x18048bf00
0000000180a76b8d: mov      byte ptr [rip + 0x821bce6], 1
0000000180a76b94: mov      rax, qword ptr [rip + 0x7da4b15] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a76b9b: cmp      dword ptr [rax + 0xe0], 0
0000000180a76ba2: jne      0x180a76bb3
0000000180a76ba4: mov      rcx, rax
0000000180a76ba7: call     0x18048c140
0000000180a76bac: mov      rax, qword ptr [rip + 0x7da4afd] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a76bb3: mov      rax, qword ptr [rax + 0xb8]
0000000180a76bba: mov      rcx, qword ptr [rax + 0x510]
0000000180a76bc1: test     rcx, rcx
0000000180a76bc4: jne      0x180a76c8e
0000000180a76bca: movaps   xmmword ptr [rsp + 0x40], xmm6
0000000180a76bcf: movups   xmm6, xmmword ptr [rbx + 0x398]
0000000180a76bd6: test     rdi, rdi
0000000180a76bd9: je       0x180a76ca6
0000000180a76bdf: xor      edx, edx
0000000180a76be1: mov      rcx, rdi
0000000180a76be4: call     0x180a64910
0000000180a76be9: mov      r8, qword ptr [rip + 0x7ebf078] ; GenericMethodInfo 280380 @0x188935c68
0000000180a76bf0: lea      rcx, [rsp + 0x20]
0000000180a76bf5: mov      rdx, rax
0000000180a76bf8: call     0x18515a130
0000000180a76bfd: movaps   xmm0, xmmword ptr [rsp + 0x20]
0000000180a76c02: lea      rdx, [rsp + 0x20]
0000000180a76c07: mov      r8, qword ptr [rip + 0x7ebee1a] ; GenericMethodInfo 280379 @0x188935a28
0000000180a76c0e: lea      rcx, [rsp + 0x30]
0000000180a76c13: movdqa   xmmword ptr [rsp + 0x20], xmm0
0000000180a76c19: movdqa   xmmword ptr [rsp + 0x30], xmm6
0000000180a76c1f: call     0x18515a050
0000000180a76c24: test     al, al
0000000180a76c26: je       0x180a76c7e
0000000180a76c28: mov      r8, qword ptr [rip + 0x7ebf039] ; GenericMethodInfo 280380 @0x188935c68
0000000180a76c2f: lea      rcx, [rsp + 0x30]
0000000180a76c34: xor      edx, edx
0000000180a76c36: call     0x18515a130
0000000180a76c3b: movups   xmm0, xmmword ptr [rsp + 0x30]
0000000180a76c40: lea      rcx, [rbx + 0x398]
0000000180a76c47: xor      edx, edx
0000000180a76c49: movups   xmmword ptr [rbx + 0x398], xmm0
0000000180a76c50: call     0x18048b9e0
0000000180a76c55: xor      r8d, r8d
0000000180a76c58: mov      edx, 0x18
0000000180a76c5d: mov      rcx, rbx
0000000180a76c60: call     0x1806f2700 ; Torappu.Battle.Entity.EmitEvent [66715]
0000000180a76c65: xor      edx, edx
0000000180a76c67: mov      rcx, rbx
0000000180a76c6a: call     0x180702100 ; Torappu.Battle.Entity.get_buffContainer [66402]
0000000180a76c6f: test     rax, rax
0000000180a76c72: je       0x180a76ca6
0000000180a76c74: xor      edx, edx
0000000180a76c76: mov      rcx, rax
0000000180a76c79: call     0x180675680 ; Torappu.Battle.Buff.BuffContainer.OnOwnerBlockeeChanged [65434]
0000000180a76c7e: movaps   xmm6, xmmword ptr [rsp + 0x40]
0000000180a76c83: mov      rbx, qword ptr [rsp + 0x60]
0000000180a76c88: add      rsp, 0x50
0000000180a76c8c: pop      rdi
0000000180a76c8d: ret      
0000000180a76c8e: xor      r9d, r9d
0000000180a76c91: mov      r8, rdi
0000000180a76c94: mov      rdx, rbx
0000000180a76c97: mov      rbx, qword ptr [rsp + 0x60]
0000000180a76c9c: add      rsp, 0x50
0000000180a76ca0: pop      rdi
0000000180a76ca1: jmp      0x1832d2220 ; XLua.DelegateBridge.__Gen_Delegate_Imp23 [2678]
0000000180a76ca6: call     0x18048c0b0
0000000180a76cab: int3     
0000000180a76cac: int3     
0000000180a76cad: int3     
0000000180a76cae: int3     
0000000180a76caf: int3     