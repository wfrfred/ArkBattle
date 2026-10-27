; Torappu.Battle.Entity.OnAppliedModifier metadata=66669 token=0x601046e VA=0x1806f68c0 RVA=0x6f68c0 size=0x5e0
00000001806f68c0: mov      qword ptr [rsp + 0x10], rbx
00000001806f68c5: mov      qword ptr [rsp + 0x18], rdi
00000001806f68ca: push     rbp
00000001806f68cb: lea      rbp, [rsp - 0x60]
00000001806f68d0: sub      rsp, 0x160
00000001806f68d7: cmp      byte ptr [rip + 0x859a01f], 0
00000001806f68de: mov      rbx, rdx
00000001806f68e1: mov      rdi, rcx
00000001806f68e4: jne      0x1806f6941
00000001806f68e6: lea      rcx, [rip + 0x8231473] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
00000001806f68ed: call     0x18048bf00
00000001806f68f2: lea      rcx, [rip + 0x814aa6f] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806f68f9: call     0x18048bf00
00000001806f68fe: lea      rcx, [rip + 0x811b05b] ; GenericMethodInfo 261998 @0x188811960
00000001806f6905: call     0x18048bf00
00000001806f690a: lea      rcx, [rip + 0x81f6867] ; TypeInfo Torappu.Battle.Modifier @0x1888ed178
00000001806f6911: call     0x18048bf00
00000001806f6916: lea      rcx, [rip + 0x823c3cb] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001806f691d: call     0x18048bf00
00000001806f6922: lea      rcx, [rip + 0x81dcfdf] ; GenericMethodInfo 281972 @0x1888d3908
00000001806f6929: call     0x18048bf00
00000001806f692e: lea      rcx, [rip + 0x82625f3] ; StringLiteral 'ON_MODIFIER_HEAL' @0x188958f28
00000001806f6935: call     0x18048bf00
00000001806f693a: mov      byte ptr [rip + 0x8599fbc], 1
00000001806f6941: mov      rax, qword ptr [rip + 0x814aa20] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806f6948: cmp      dword ptr [rax + 0xe0], 0
00000001806f694f: jne      0x1806f6960
00000001806f6951: mov      rcx, rax
00000001806f6954: call     0x18048c140
00000001806f6959: mov      rax, qword ptr [rip + 0x814aa08] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806f6960: mov      rax, qword ptr [rax + 0xb8]
00000001806f6967: mov      rcx, qword ptr [rax + 0x988]
00000001806f696e: test     rcx, rcx
00000001806f6971: jne      0x1806f6e78
00000001806f6977: mov      qword ptr [rsp + 0x170], rsi
00000001806f697f: xor      edx, edx
00000001806f6981: mov      rcx, rdi
00000001806f6984: call     0x180702100 ; Torappu.Battle.Entity.get_buffContainer [66402]
00000001806f6989: test     rax, rax
00000001806f698c: je       0x1806f6e8e
00000001806f6992: xor      r8d, r8d
00000001806f6995: mov      rdx, rbx
00000001806f6998: mov      rcx, rax
00000001806f699b: call     0x18066b9a0 ; Torappu.Battle.Buff.BuffContainer.OnAppliedModifier [65379]
00000001806f69a0: movups   xmm0, xmmword ptr [rbx]
00000001806f69a3: mov      rcx, qword ptr [rip + 0x81f67ce] ; TypeInfo Torappu.Battle.Modifier @0x1888ed178
00000001806f69aa: lea      rdx, [rsp + 0x40]
00000001806f69af: movups   xmm1, xmmword ptr [rbx + 0x10]
00000001806f69b3: movaps   xmmword ptr [rsp + 0x40], xmm0
00000001806f69b8: movups   xmm0, xmmword ptr [rbx + 0x20]
00000001806f69bc: movaps   xmmword ptr [rsp + 0x50], xmm1
00000001806f69c1: movups   xmm1, xmmword ptr [rbx + 0x30]
00000001806f69c5: movaps   xmmword ptr [rsp + 0x60], xmm0
00000001806f69ca: movups   xmm0, xmmword ptr [rbx + 0x40]
00000001806f69ce: movaps   xmmword ptr [rsp + 0x70], xmm1
00000001806f69d3: movups   xmm1, xmmword ptr [rbx + 0x50]
00000001806f69d7: movaps   xmmword ptr [rbp - 0x80], xmm0
00000001806f69db: movups   xmm0, xmmword ptr [rbx + 0x60]
00000001806f69df: movaps   xmmword ptr [rbp - 0x70], xmm1
00000001806f69e3: movups   xmm1, xmmword ptr [rbx + 0x70]
00000001806f69e7: movaps   xmmword ptr [rbp - 0x60], xmm0
00000001806f69eb: movsd    xmm0, qword ptr [rbx + 0x80]
00000001806f69f3: movsd    qword ptr [rbp - 0x40], xmm0
00000001806f69f8: movaps   xmmword ptr [rbp - 0x50], xmm1
00000001806f69fc: call     0x18048b9c0
00000001806f6a01: xor      r9d, r9d
00000001806f6a04: mov      r8, rax
00000001806f6a07: mov      edx, 0xa
00000001806f6a0c: mov      rcx, rdi
00000001806f6a0f: call     0x1806f2630 ; Torappu.Battle.Entity.EmitEvent [66716]
00000001806f6a14: mov      rcx, qword ptr [rip + 0x81dceed] ; GenericMethodInfo 281972 @0x1888d3908
00000001806f6a1b: call     0x185337c50
00000001806f6a20: test     rax, rax
00000001806f6a23: je       0x1806f6e8e
00000001806f6a29: xor      edx, edx
00000001806f6a2b: mov      rcx, rax
00000001806f6a2e: call     0x180641550 ; Torappu.Battle.BattleController.get_eventPool [64504]
00000001806f6a33: movups   xmm0, xmmword ptr [rbx]
00000001806f6a36: mov      rcx, qword ptr [rip + 0x81f673b] ; TypeInfo Torappu.Battle.Modifier @0x1888ed178
00000001806f6a3d: lea      rdx, [rbp - 0x30]
00000001806f6a41: movups   xmm1, xmmword ptr [rbx + 0x10]
00000001806f6a45: mov      rsi, rax
00000001806f6a48: movaps   xmmword ptr [rbp - 0x30], xmm0
00000001806f6a4c: movups   xmm0, xmmword ptr [rbx + 0x20]
00000001806f6a50: movaps   xmmword ptr [rbp - 0x20], xmm1
00000001806f6a54: movups   xmm1, xmmword ptr [rbx + 0x30]
00000001806f6a58: movaps   xmmword ptr [rbp - 0x10], xmm0
00000001806f6a5c: movups   xmm0, xmmword ptr [rbx + 0x40]
00000001806f6a60: movaps   xmmword ptr [rbp], xmm1
00000001806f6a64: movups   xmm1, xmmword ptr [rbx + 0x50]
00000001806f6a68: movaps   xmmword ptr [rbp + 0x10], xmm0
00000001806f6a6c: movups   xmm0, xmmword ptr [rbx + 0x60]
00000001806f6a70: movaps   xmmword ptr [rbp + 0x20], xmm1
00000001806f6a74: movups   xmm1, xmmword ptr [rbx + 0x70]
00000001806f6a78: movaps   xmmword ptr [rbp + 0x30], xmm0
00000001806f6a7c: movsd    xmm0, qword ptr [rbx + 0x80]
00000001806f6a84: movsd    qword ptr [rbp + 0x50], xmm0
00000001806f6a89: movaps   xmmword ptr [rbp + 0x40], xmm1
00000001806f6a8d: call     0x18048b9c0
00000001806f6a92: test     rsi, rsi
00000001806f6a95: je       0x1806f6e8e
00000001806f6a9b: mov      r9, qword ptr [rip + 0x811aebe] ; GenericMethodInfo 261998 @0x188811960
00000001806f6aa2: mov      r8, rax
00000001806f6aa5: mov      edx, 0xe
00000001806f6aaa: mov      rcx, rsi
00000001806f6aad: call     0x1848dca60
00000001806f6ab2: mov      rcx, qword ptr [rip + 0x81f66bf] ; TypeInfo Torappu.Battle.Modifier @0x1888ed178
00000001806f6ab9: cmp      dword ptr [rcx + 0xe0], 0
00000001806f6ac0: jne      0x1806f6ac7
00000001806f6ac2: call     0x18048c140
00000001806f6ac7: xor      edx, edx
00000001806f6ac9: mov      rcx, rbx
00000001806f6acc: call     0x1808b46c0 ; Torappu.Battle.Modifier.get_isHeal [70960]
00000001806f6ad1: test     al, al
00000001806f6ad3: je       0x1806f6b67
00000001806f6ad9: mov      rcx, qword ptr [rip + 0x81f6698] ; TypeInfo Torappu.Battle.Modifier @0x1888ed178
00000001806f6ae0: cmp      dword ptr [rcx + 0xe0], 0
00000001806f6ae7: jne      0x1806f6aee
00000001806f6ae9: call     0x18048c140
00000001806f6aee: xor      r8d, r8d
00000001806f6af1: mov      edx, 1
00000001806f6af6: mov      rcx, rbx
00000001806f6af9: call     0x1808b0fa0 ; Torappu.Battle.Modifier.CheckSharedFlag [70995]
00000001806f6afe: test     al, al
00000001806f6b00: jne      0x1806f6b67
00000001806f6b02: xor      r8d, r8d
00000001806f6b05: lea      rcx, [rsp + 0x30]
00000001806f6b0a: mov      rdx, rdi
00000001806f6b0d: call     0x180ad4360 ; Torappu.Battle.VisualObject.get_worldPosition [77868]
00000001806f6b12: mov      rcx, qword ptr [rip + 0x8231247] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
00000001806f6b19: movsd    xmm0, qword ptr [rax]
00000001806f6b1d: cmp      dword ptr [rcx + 0xe0], 0
00000001806f6b24: mov      edi, dword ptr [rax + 8]
00000001806f6b27: movsd    qword ptr [rbp + 0x88], xmm0
00000001806f6b2f: jne      0x1806f6b3e
00000001806f6b31: call     0x18048c140
00000001806f6b36: movsd    xmm0, qword ptr [rbp + 0x88]
00000001806f6b3e: mov      rcx, qword ptr [rip + 0x82623e3] ; StringLiteral 'ON_MODIFIER_HEAL' @0x188958f28
00000001806f6b45: lea      r8, [rsp + 0x30]
00000001806f6b4a: xor      r9d, r9d
00000001806f6b4d: movsd    qword ptr [rsp + 0x30], xmm0
00000001806f6b53: xor      edx, edx
00000001806f6b55: mov      dword ptr [rsp + 0x38], edi
00000001806f6b59: mov      qword ptr [rsp + 0x20], 0
00000001806f6b62: call     0x18062daf0 ; Torappu.Battle.BattleController.PlayAudioAtPos [64740]
00000001806f6b67: mov      rcx, qword ptr [rip + 0x81f660a] ; TypeInfo Torappu.Battle.Modifier @0x1888ed178
00000001806f6b6e: cmp      dword ptr [rcx + 0xe0], 0
00000001806f6b75: jne      0x1806f6b7c
00000001806f6b77: call     0x18048c140
00000001806f6b7c: xor      edx, edx
00000001806f6b7e: mov      rcx, rbx
00000001806f6b81: call     0x1808b4a60 ; Torappu.Battle.Modifier.get_source [70963]
00000001806f6b86: xor      edx, edx
00000001806f6b88: mov      rcx, rbx
00000001806f6b8b: mov      rdi, rax
00000001806f6b8e: call     0x1808b4310 ; Torappu.Battle.Modifier.get_isDamage [70959]
00000001806f6b93: test     al, al
00000001806f6b95: je       0x1806f6c4d
00000001806f6b9b: mov      rcx, qword ptr [rip + 0x823c146] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001806f6ba2: cmp      dword ptr [rcx + 0xe0], 0
00000001806f6ba9: jne      0x1806f6bb0
00000001806f6bab: call     0x18048c140
00000001806f6bb0: xor      r8d, r8d
00000001806f6bb3: xor      edx, edx
00000001806f6bb5: mov      rcx, rdi
00000001806f6bb8: call     0x186b63a70
00000001806f6bbd: test     al, al
00000001806f6bbf: je       0x1806f6c4d
00000001806f6bc5: test     rdi, rdi
00000001806f6bc8: je       0x1806f6e88
00000001806f6bce: cmp      byte ptr [rip + 0x8599d2c], 0
00000001806f6bd5: jne      0x1806f6bea
00000001806f6bd7: lea      rcx, [rip + 0x814a78a] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806f6bde: call     0x18048bf00
00000001806f6be3: mov      byte ptr [rip + 0x8599d17], 1
00000001806f6bea: mov      rax, qword ptr [rip + 0x814a777] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806f6bf1: cmp      dword ptr [rax + 0xe0], 0
00000001806f6bf8: jne      0x1806f6c09
00000001806f6bfa: mov      rcx, rax
00000001806f6bfd: call     0x18048c140
00000001806f6c02: mov      rax, qword ptr [rip + 0x814a75f] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806f6c09: mov      rax, qword ptr [rax + 0xb8]
00000001806f6c10: mov      rcx, qword ptr [rax + 0x9a8]
00000001806f6c17: test     rcx, rcx
00000001806f6c1a: jne      0x1806f6c3f
00000001806f6c1c: xor      edx, edx
00000001806f6c1e: mov      rcx, rdi
00000001806f6c21: call     0x180702100 ; Torappu.Battle.Entity.get_buffContainer [66402]
00000001806f6c26: test     rax, rax
00000001806f6c29: je       0x1806f6e88
00000001806f6c2f: xor      r8d, r8d
00000001806f6c32: mov      rdx, rbx
00000001806f6c35: mov      rcx, rax
00000001806f6c38: call     0x18066aee0 ; Torappu.Battle.Buff.BuffContainer.OnAfterOutputDamage [65383]
00000001806f6c3d: jmp      0x1806f6c4d
00000001806f6c3f: xor      r9d, r9d
00000001806f6c42: mov      r8, rbx
00000001806f6c45: mov      rdx, rdi
00000001806f6c48: call     0x1832fd8c0 ; XLua.DelegateBridge.__Gen_Delegate_Imp2682 [5337]
00000001806f6c4d: mov      rcx, qword ptr [rip + 0x81f6524] ; TypeInfo Torappu.Battle.Modifier @0x1888ed178
00000001806f6c54: cmp      dword ptr [rcx + 0xe0], 0
00000001806f6c5b: jne      0x1806f6c62
00000001806f6c5d: call     0x18048c140
00000001806f6c62: xor      edx, edx
00000001806f6c64: mov      rcx, rbx
00000001806f6c67: call     0x1808b46c0 ; Torappu.Battle.Modifier.get_isHeal [70960]
00000001806f6c6c: test     al, al
00000001806f6c6e: je       0x1806f6d26
00000001806f6c74: mov      rcx, qword ptr [rip + 0x823c06d] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001806f6c7b: cmp      dword ptr [rcx + 0xe0], 0
00000001806f6c82: jne      0x1806f6c89
00000001806f6c84: call     0x18048c140
00000001806f6c89: xor      r8d, r8d
00000001806f6c8c: xor      edx, edx
00000001806f6c8e: mov      rcx, rdi
00000001806f6c91: call     0x186b63a70
00000001806f6c96: test     al, al
00000001806f6c98: je       0x1806f6d26
00000001806f6c9e: test     rdi, rdi
00000001806f6ca1: je       0x1806f6e88
00000001806f6ca7: cmp      byte ptr [rip + 0x8599c54], 0
00000001806f6cae: jne      0x1806f6cc3
00000001806f6cb0: lea      rcx, [rip + 0x814a6b1] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806f6cb7: call     0x18048bf00
00000001806f6cbc: mov      byte ptr [rip + 0x8599c3f], 1
00000001806f6cc3: mov      rax, qword ptr [rip + 0x814a69e] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806f6cca: cmp      dword ptr [rax + 0xe0], 0
00000001806f6cd1: jne      0x1806f6ce2
00000001806f6cd3: mov      rcx, rax
00000001806f6cd6: call     0x18048c140
00000001806f6cdb: mov      rax, qword ptr [rip + 0x814a686] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806f6ce2: mov      rax, qword ptr [rax + 0xb8]
00000001806f6ce9: mov      rcx, qword ptr [rax + 0x9b0]
00000001806f6cf0: test     rcx, rcx
00000001806f6cf3: jne      0x1806f6d18
00000001806f6cf5: xor      edx, edx
00000001806f6cf7: mov      rcx, rdi
00000001806f6cfa: call     0x180702100 ; Torappu.Battle.Entity.get_buffContainer [66402]
00000001806f6cff: test     rax, rax
00000001806f6d02: je       0x1806f6e88
00000001806f6d08: xor      r8d, r8d
00000001806f6d0b: mov      rdx, rbx
00000001806f6d0e: mov      rcx, rax
00000001806f6d11: call     0x18066b600 ; Torappu.Battle.Buff.BuffContainer.OnAfterOutputHeal [65384]
00000001806f6d16: jmp      0x1806f6d26
00000001806f6d18: xor      r9d, r9d
00000001806f6d1b: mov      r8, rbx
00000001806f6d1e: mov      rdx, rdi
00000001806f6d21: call     0x1832fd8c0 ; XLua.DelegateBridge.__Gen_Delegate_Imp2682 [5337]
00000001806f6d26: mov      rcx, qword ptr [rip + 0x81f644b] ; TypeInfo Torappu.Battle.Modifier @0x1888ed178
00000001806f6d2d: cmp      dword ptr [rcx + 0xe0], 0
00000001806f6d34: jne      0x1806f6d3b
00000001806f6d36: call     0x18048c140
00000001806f6d3b: xor      edx, edx
00000001806f6d3d: mov      rcx, rbx
00000001806f6d40: call     0x1808b4460 ; Torappu.Battle.Modifier.get_isElementDamage [70961]
00000001806f6d45: test     al, al
00000001806f6d47: je       0x1806f6dff
00000001806f6d4d: mov      rcx, qword ptr [rip + 0x823bf94] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001806f6d54: cmp      dword ptr [rcx + 0xe0], 0
00000001806f6d5b: jne      0x1806f6d62
00000001806f6d5d: call     0x18048c140
00000001806f6d62: xor      r8d, r8d
00000001806f6d65: xor      edx, edx
00000001806f6d67: mov      rcx, rdi
00000001806f6d6a: call     0x186b63a70
00000001806f6d6f: test     al, al
00000001806f6d71: je       0x1806f6dff
00000001806f6d77: test     rdi, rdi
00000001806f6d7a: je       0x1806f6e88
00000001806f6d80: cmp      byte ptr [rip + 0x8599b7c], 0
00000001806f6d87: jne      0x1806f6d9c
00000001806f6d89: lea      rcx, [rip + 0x814a5d8] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806f6d90: call     0x18048bf00
00000001806f6d95: mov      byte ptr [rip + 0x8599b67], 1
00000001806f6d9c: mov      rax, qword ptr [rip + 0x814a5c5] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806f6da3: cmp      dword ptr [rax + 0xe0], 0
00000001806f6daa: jne      0x1806f6dbb
00000001806f6dac: mov      rcx, rax
00000001806f6daf: call     0x18048c140
00000001806f6db4: mov      rax, qword ptr [rip + 0x814a5ad] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806f6dbb: mov      rax, qword ptr [rax + 0xb8]
00000001806f6dc2: mov      rcx, qword ptr [rax + 0x9b8]
00000001806f6dc9: test     rcx, rcx
00000001806f6dcc: jne      0x1806f6df1
00000001806f6dce: xor      edx, edx
00000001806f6dd0: mov      rcx, rdi
00000001806f6dd3: call     0x180702100 ; Torappu.Battle.Entity.get_buffContainer [66402]
00000001806f6dd8: test     rax, rax
00000001806f6ddb: je       0x1806f6e88
00000001806f6de1: xor      r8d, r8d
00000001806f6de4: mov      rdx, rbx
00000001806f6de7: mov      rcx, rax
00000001806f6dea: call     0x18066b260 ; Torappu.Battle.Buff.BuffContainer.OnAfterOutputElementDamage [65385]
00000001806f6def: jmp      0x1806f6dff
00000001806f6df1: xor      r9d, r9d
00000001806f6df4: mov      r8, rbx
00000001806f6df7: mov      rdx, rdi
00000001806f6dfa: call     0x1832fd8c0 ; XLua.DelegateBridge.__Gen_Delegate_Imp2682 [5337]
00000001806f6dff: mov      rcx, qword ptr [rip + 0x81dcb02] ; GenericMethodInfo 281972 @0x1888d3908
00000001806f6e06: call     0x185337c50
00000001806f6e0b: test     rax, rax
00000001806f6e0e: je       0x1806f6e88
00000001806f6e10: xor      edx, edx
00000001806f6e12: mov      rcx, rax
00000001806f6e15: call     0x1806430d0 ; Torappu.Battle.BattleController.get_logger [64507]
00000001806f6e1a: test     rax, rax
00000001806f6e1d: je       0x1806f6e88
00000001806f6e1f: xor      r8d, r8d
00000001806f6e22: mov      rdx, rbx
00000001806f6e25: mov      rcx, rax
00000001806f6e28: call     0x1807114b0 ; Torappu.Battle.BattleLogger.LogModifier [66981]
00000001806f6e2d: mov      rcx, qword ptr [rip + 0x81dcad4] ; GenericMethodInfo 281972 @0x1888d3908
00000001806f6e34: call     0x185337c50
00000001806f6e39: test     rax, rax
00000001806f6e3c: je       0x1806f6e88
00000001806f6e3e: xor      edx, edx
00000001806f6e40: mov      rcx, rax
00000001806f6e43: call     0x1806430d0 ; Torappu.Battle.BattleController.get_logger [64507]
00000001806f6e48: test     rax, rax
00000001806f6e4b: je       0x1806f6e88
00000001806f6e4d: xor      r8d, r8d
00000001806f6e50: mov      rdx, rbx
00000001806f6e53: mov      rcx, rax
00000001806f6e56: call     0x180710120 ; Torappu.Battle.BattleLogger.LogEpModifier [66982]
00000001806f6e5b: mov      rsi, qword ptr [rsp + 0x170]
00000001806f6e63: lea      r11, [rsp + 0x160]
00000001806f6e6b: mov      rbx, qword ptr [r11 + 0x18]
00000001806f6e6f: mov      rdi, qword ptr [r11 + 0x20]
00000001806f6e73: mov      rsp, r11
00000001806f6e76: pop      rbp
00000001806f6e77: ret      
00000001806f6e78: xor      r9d, r9d
00000001806f6e7b: mov      r8, rbx
00000001806f6e7e: mov      rdx, rdi
00000001806f6e81: call     0x1832fd8c0 ; XLua.DelegateBridge.__Gen_Delegate_Imp2682 [5337]
00000001806f6e86: jmp      0x1806f6e63
00000001806f6e88: call     0x18048c0b0
00000001806f6e8d: int3     
00000001806f6e8e: call     0x18048c0b0
00000001806f6e93: int3     
00000001806f6e94: int3     
00000001806f6e95: int3     
00000001806f6e96: int3     
00000001806f6e97: int3     
00000001806f6e98: int3     
00000001806f6e99: int3     
00000001806f6e9a: int3     
00000001806f6e9b: int3     
00000001806f6e9c: int3     
00000001806f6e9d: int3     
00000001806f6e9e: int3     
00000001806f6e9f: int3     