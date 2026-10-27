; Torappu.Battle.Abilities.RangedAttack.NewDamageNode metadata=90824 token=0x60162c9 VA=0x180ec3ca0 RVA=0xec3ca0 size=0x190
0000000180ec3ca0: push     rbx
0000000180ec3ca2: push     rsi
0000000180ec3ca3: push     rdi
0000000180ec3ca4: sub      rsp, 0x40
0000000180ec3ca8: cmp      byte ptr [rip + 0x7dd1748], 0
0000000180ec3caf: mov      rbx, r8
0000000180ec3cb2: mov      esi, edx
0000000180ec3cb4: mov      rdi, rcx
0000000180ec3cb7: jne      0x180ec3cd8
0000000180ec3cb9: lea      rcx, [rip + 0x7951648] ; TypeInfo Torappu.Battle.Action.Nodes.ApplyCacheAtkDamageFromProjectile @0x188815308
0000000180ec3cc0: call     0x18048bf00
0000000180ec3cc5: lea      rcx, [rip + 0x79f082c] ; TypeInfo Torappu.Battle.Abilities.RangedAttack @0x1888b44f8
0000000180ec3ccc: call     0x18048bf00
0000000180ec3cd1: mov      byte ptr [rip + 0x7dd171f], 1
0000000180ec3cd8: mov      rax, qword ptr [rip + 0x79f0819] ; TypeInfo Torappu.Battle.Abilities.RangedAttack @0x1888b44f8
0000000180ec3cdf: mov      r8, qword ptr [rax + 0xb8]
0000000180ec3ce6: mov      rcx, qword ptr [r8 + 0xb8]
0000000180ec3ced: test     rcx, rcx
0000000180ec3cf0: jne      0x180ec3e0b
0000000180ec3cf6: cmp      byte ptr [rdi + 0x242], cl
0000000180ec3cfc: jne      0x180ec3d15
0000000180ec3cfe: xor      r9d, r9d
0000000180ec3d01: mov      r8, rbx
0000000180ec3d04: mov      edx, esi
0000000180ec3d06: mov      rcx, rdi
0000000180ec3d09: add      rsp, 0x40
0000000180ec3d0d: pop      rdi
0000000180ec3d0e: pop      rsi
0000000180ec3d0f: pop      rbx
0000000180ec3d10: jmp      0x180effe20 ; Torappu.Battle.Abilities.AbstractAnimatedAbility.NewDamageNode [91792]
0000000180ec3d15: cmp      byte ptr [rip + 0x7e08ad4], 0
0000000180ec3d1c: mov      qword ptr [rsp + 0x60], rbp
0000000180ec3d21: mov      qword ptr [rsp + 0x68], r12
0000000180ec3d26: mov      qword ptr [rsp + 0x70], r14
0000000180ec3d2b: mov      qword ptr [rsp + 0x78], r15
0000000180ec3d30: jbe      0x180ec3d3a
0000000180ec3d32: mov      rcx, qword ptr [rdi]
0000000180ec3d35: call     0x180446d00
0000000180ec3d3a: mov      rdx, qword ptr [rdi]
0000000180ec3d3d: mov      rcx, rdi
0000000180ec3d40: mov      rax, qword ptr [rdx + 0x2b0]
0000000180ec3d47: mov      rdx, qword ptr [rdx + 0x2b8]
0000000180ec3d4e: call     rax
0000000180ec3d50: cmp      byte ptr [rip + 0x7e08a99], 0
0000000180ec3d57: mov      r14d, eax
0000000180ec3d5a: jbe      0x180ec3d64
0000000180ec3d5c: mov      rcx, qword ptr [rdi]
0000000180ec3d5f: call     0x180446d00
0000000180ec3d64: mov      rdx, qword ptr [rdi]
0000000180ec3d67: mov      rcx, rdi
0000000180ec3d6a: mov      r8, qword ptr [rdx + 0x7b0]
0000000180ec3d71: mov      rdx, qword ptr [rdx + 0x7b8]
0000000180ec3d78: call     r8
0000000180ec3d7b: cmp      byte ptr [rip + 0x7e08a6e], 0
0000000180ec3d82: mov      ebp, eax
0000000180ec3d84: jbe      0x180ec3d8e
0000000180ec3d86: mov      rcx, qword ptr [rdi]
0000000180ec3d89: call     0x180446d00
0000000180ec3d8e: mov      rdx, qword ptr [rdi]
0000000180ec3d91: mov      rcx, rdi
0000000180ec3d94: mov      r8, qword ptr [rdx + 0x7c0]
0000000180ec3d9b: mov      rdx, qword ptr [rdx + 0x7c8]
0000000180ec3da2: call     r8
0000000180ec3da5: mov      rcx, qword ptr [rip + 0x795155c] ; TypeInfo Torappu.Battle.Action.Nodes.ApplyCacheAtkDamageFromProjectile @0x188815308
0000000180ec3dac: movzx    r15d, al
0000000180ec3db0: movzx    r12d, byte ptr [rdi + 0x243]
0000000180ec3db8: call     0x18045cfe0
0000000180ec3dbd: mov      rdi, rax
0000000180ec3dc0: test     rax, rax
0000000180ec3dc3: je       0x180ec3e2a
0000000180ec3dc5: mov      qword ptr [rsp + 0x38], 0
0000000180ec3dce: mov      r9, rbx
0000000180ec3dd1: mov      byte ptr [rsp + 0x30], r12b
0000000180ec3dd6: mov      r8d, r14d
0000000180ec3dd9: mov      byte ptr [rsp + 0x28], r15b
0000000180ec3dde: mov      edx, esi
0000000180ec3de0: mov      rcx, rax
0000000180ec3de3: mov      dword ptr [rsp + 0x20], ebp
0000000180ec3de7: call     0x18104a070 ; Torappu.Battle.Action.Nodes.ApplyCacheAtkDamageFromProjectile..ctor [96833]
0000000180ec3dec: mov      r14, qword ptr [rsp + 0x70]
0000000180ec3df1: mov      rax, rdi
0000000180ec3df4: mov      r12, qword ptr [rsp + 0x68]
0000000180ec3df9: mov      rbp, qword ptr [rsp + 0x60]
0000000180ec3dfe: mov      r15, qword ptr [rsp + 0x78]
0000000180ec3e03: add      rsp, 0x40
0000000180ec3e07: pop      rdi
0000000180ec3e08: pop      rsi
0000000180ec3e09: pop      rbx
0000000180ec3e0a: ret      
0000000180ec3e0b: mov      r9, rbx
0000000180ec3e0e: mov      qword ptr [rsp + 0x20], 0
0000000180ec3e17: mov      r8d, esi
0000000180ec3e1a: mov      rdx, rdi
0000000180ec3e1d: call     0x18340dbb0 ; XLua.DelegateBridge.__Gen_Delegate_Imp4406 [7061]
0000000180ec3e22: add      rsp, 0x40
0000000180ec3e26: pop      rdi
0000000180ec3e27: pop      rsi
0000000180ec3e28: pop      rbx
0000000180ec3e29: ret      
0000000180ec3e2a: call     0x18048c0b0
0000000180ec3e2f: int3     