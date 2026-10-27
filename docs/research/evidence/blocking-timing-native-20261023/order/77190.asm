; Torappu.Battle.BlockManager.SearchBlockee metadata=77190 token=0x6012d87 VA=0x180aa09e0 RVA=0xaa09e0 size=0x630
0000000180aa09e0: mov      rax, rsp
0000000180aa09e3: mov      qword ptr [rax + 0x20], rbx
0000000180aa09e7: mov      qword ptr [rax + 0x10], rdx
0000000180aa09eb: mov      qword ptr [rax + 8], rcx
0000000180aa09ef: push     rsi
0000000180aa09f0: push     r12
0000000180aa09f2: push     r13
0000000180aa09f4: push     r14
0000000180aa09f6: push     r15
0000000180aa09f8: sub      rsp, 0xa0
0000000180aa09ff: movaps   xmmword ptr [rax - 0x38], xmm6
0000000180aa0a03: movaps   xmmword ptr [rax - 0x48], xmm7
0000000180aa0a07: movzx    ebx, r8b
0000000180aa0a0b: mov      r13, rdx
0000000180aa0a0e: mov      r15, rcx
0000000180aa0a11: cmp      byte ptr [rip + 0x81f2073], 0
0000000180aa0a18: jne      0x180aa0ab5
0000000180aa0a1e: lea      rcx, [rip + 0x7e8733b] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
0000000180aa0a25: call     0x18048bf00
0000000180aa0a2a: lea      rcx, [rip + 0x7d60e0f] ; MethodInfo Torappu.Battle.BlockManager._CheckBlockable [77194] @0x188801840
0000000180aa0a31: call     0x18048bf00
0000000180aa0a36: lea      rcx, [rip + 0x7d7ac73] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180aa0a3d: call     0x18048bf00
0000000180aa0a42: lea      rcx, [rip + 0x7de8e8f] ; TypeInfo Torappu.Battle.FilterUtil.FilterFuncWithVolumne @0x1888898d8
0000000180aa0a49: call     0x18048bf00
0000000180aa0a4e: lea      rcx, [rip + 0x7e644e3] ; GenericMethodInfo 293297 @0x188904f38
0000000180aa0a55: call     0x18048bf00
0000000180aa0a5a: lea      rcx, [rip + 0x7dd40bf] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
0000000180aa0a61: call     0x18048bf00
0000000180aa0a66: lea      rcx, [rip + 0x7eb422b] ; TypeInfo System.IDisposable @0x188954c98
0000000180aa0a6d: call     0x18048bf00
0000000180aa0a72: lea      rcx, [rip + 0x7e97e1f] ; GenericMethodInfo 271524 @0x188938898
0000000180aa0a79: call     0x18048bf00
0000000180aa0a7e: lea      rcx, [rip + 0x7e98053] ; GenericMethodInfo 271525 @0x188938ad8
0000000180aa0a85: call     0x18048bf00
0000000180aa0a8a: lea      rcx, [rip + 0x7e92257] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180aa0a91: call     0x18048bf00
0000000180aa0a96: lea      rcx, [rip + 0x7e32e6b] ; GenericMethodInfo 281972 @0x1888d3908
0000000180aa0a9d: call     0x18048bf00
0000000180aa0aa2: lea      rcx, [rip + 0x7e7051f] ; GenericMethodInfo 282409 @0x188910fc8
0000000180aa0aa9: call     0x18048bf00
0000000180aa0aae: mov      byte ptr [rip + 0x81f1fd6], 1
0000000180aa0ab5: mov      qword ptr [rsp + 0x30], 0
0000000180aa0abe: test     bl, bl
0000000180aa0ac0: jne      0x180aa0ade
0000000180aa0ac2: mov      rcx, qword ptr [r15 + 0x20]
0000000180aa0ac6: test     rcx, rcx
0000000180aa0ac9: je       0x180aa0ffe
0000000180aa0acf: xor      edx, edx
0000000180aa0ad1: call     0x181a6ba10 ; Torappu.PeriodicTicker.get_isReady [25959] | Torappu.UI.SandboxPerm.SandboxV2.SandboxV2DropDetail.get_isEmpty [132924]
0000000180aa0ad6: test     al, al
0000000180aa0ad8: je       0x180aa0fc4
0000000180aa0ade: mov      rcx, qword ptr [r15 + 0x20]
0000000180aa0ae2: test     rcx, rcx
0000000180aa0ae5: je       0x180aa0ffe
0000000180aa0aeb: xor      edx, edx
0000000180aa0aed: call     0x181e04370 ; Torappu.PeriodicTicker.Next [25964]
0000000180aa0af2: test     r13, r13
0000000180aa0af5: je       0x180aa0ffe
0000000180aa0afb: xor      edx, edx
0000000180aa0afd: mov      rcx, r13
0000000180aa0b00: call     0x180a64910
0000000180aa0b05: mov      rsi, rax
0000000180aa0b08: mov      qword ptr [rsp + 0x38], rax
0000000180aa0b0d: mov      rbx, qword ptr [r15 + 0x18]
0000000180aa0b11: test     rax, rax
0000000180aa0b14: je       0x180aa0ffe
0000000180aa0b1a: cmp      byte ptr [rip + 0x822bccf], 0
0000000180aa0b21: jbe      0x180aa0b2b
0000000180aa0b23: mov      rcx, qword ptr [rax]
0000000180aa0b26: call     0x180446d00
0000000180aa0b2b: mov      rdx, qword ptr [rsi]
0000000180aa0b2e: mov      rax, qword ptr [rdx + 0x680]
0000000180aa0b35: mov      rdx, qword ptr [rdx + 0x688]
0000000180aa0b3c: mov      rcx, rsi
0000000180aa0b3f: call     rax
0000000180aa0b41: test     rbx, rbx
0000000180aa0b44: je       0x180aa0ffe
0000000180aa0b4a: sub      eax, dword ptr [rbx + 0x10]
0000000180aa0b4d: mov      r14d, 0
0000000180aa0b53: cmovns   r14d, eax
0000000180aa0b57: mov      dword ptr [rsp + 0xe0], r14d
0000000180aa0b5f: xor      edx, edx
0000000180aa0b61: mov      rcx, r13
0000000180aa0b64: call     0x180a64b90
0000000180aa0b69: cmp      eax, 1
0000000180aa0b6c: jne      0x180aa0b76
0000000180aa0b6e: movzx    ebx, al
0000000180aa0b71: jmp      0x180aa0c07
0000000180aa0b76: cmp      byte ptr [rip + 0x822bc73], 0
0000000180aa0b7d: jbe      0x180aa0b87
0000000180aa0b7f: mov      rcx, qword ptr [rsi]
0000000180aa0b82: call     0x180446d00
0000000180aa0b87: mov      rdx, qword ptr [rsi]
0000000180aa0b8a: mov      rax, qword ptr [rdx + 0x480]
0000000180aa0b91: mov      rdx, qword ptr [rdx + 0x488]
0000000180aa0b98: mov      rcx, rsi
0000000180aa0b9b: call     rax
0000000180aa0b9d: mov      rbx, rax
0000000180aa0ba0: mov      rcx, qword ptr [rip + 0x7e92141] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180aa0ba7: cmp      dword ptr [rcx + 0xe0], 0
0000000180aa0bae: jne      0x180aa0bb5
0000000180aa0bb0: call     0x18048c140
0000000180aa0bb5: xor      r8d, r8d
0000000180aa0bb8: xor      edx, edx
0000000180aa0bba: mov      rcx, rbx
0000000180aa0bbd: call     0x186b63a70
0000000180aa0bc2: test     al, al
0000000180aa0bc4: jne      0x180aa0bca
0000000180aa0bc6: xor      bl, bl
0000000180aa0bc8: jmp      0x180aa0c07
0000000180aa0bca: cmp      byte ptr [rip + 0x822bc1f], 0
0000000180aa0bd1: jbe      0x180aa0bdb
0000000180aa0bd3: mov      rcx, qword ptr [rsi]
0000000180aa0bd6: call     0x180446d00
0000000180aa0bdb: mov      rdx, qword ptr [rsi]
0000000180aa0bde: mov      rax, qword ptr [rdx + 0x480]
0000000180aa0be5: mov      rdx, qword ptr [rdx + 0x488]
0000000180aa0bec: mov      rcx, rsi
0000000180aa0bef: call     rax
0000000180aa0bf1: test     rax, rax
0000000180aa0bf4: je       0x180aa0ffe
0000000180aa0bfa: xor      edx, edx
0000000180aa0bfc: mov      rcx, rax
0000000180aa0bff: call     0x1808c6070 ; Torappu.Battle.Tile.get_isMeleeBlockable [70673]
0000000180aa0c04: movzx    ebx, al
0000000180aa0c07: xor      edx, edx
0000000180aa0c09: mov      rcx, rsi
0000000180aa0c0c: call     0x180705590 ; Torappu.Battle.Entity.get_isBlockFree [66511]
0000000180aa0c11: test     al, al
0000000180aa0c13: jne      0x180aa0fc4
0000000180aa0c19: xor      edx, edx
0000000180aa0c1b: mov      rcx, rsi
0000000180aa0c1e: call     0x180706a00 ; Torappu.Battle.Entity.get_isStunned [66486]
0000000180aa0c23: test     al, al
0000000180aa0c25: jne      0x180aa0fc4
0000000180aa0c2b: test     r14d, r14d
0000000180aa0c2e: jle      0x180aa0fc4
0000000180aa0c34: test     bl, bl
0000000180aa0c36: je       0x180aa0fc4
0000000180aa0c3c: cmp      qword ptr [r15 + 0x28], 0
0000000180aa0c41: jne      0x180aa0c80
0000000180aa0c43: mov      rcx, qword ptr [rip + 0x7de8c8e] ; TypeInfo Torappu.Battle.FilterUtil.FilterFuncWithVolumne @0x1888898d8
0000000180aa0c4a: call     0x18045cfe0
0000000180aa0c4f: mov      rbx, rax
0000000180aa0c52: test     rax, rax
0000000180aa0c55: je       0x180aa0ffe
0000000180aa0c5b: xor      r9d, r9d
0000000180aa0c5e: mov      r8, qword ptr [rip + 0x7d60bdb] ; MethodInfo Torappu.Battle.BlockManager._CheckBlockable [77194] @0x188801840
0000000180aa0c65: mov      rdx, r15
0000000180aa0c68: mov      rcx, rax
0000000180aa0c6b: call     0x1809d6350 ; Torappu.Battle.FilterUtil.FilterFuncWithPriorWeight..ctor [74724] | Torappu.Battle.FilterUtil.FilterFuncWithVolumne..ctor [74728]
0000000180aa0c70: mov      qword ptr [r15 + 0x28], rbx
0000000180aa0c74: lea      rcx, [r15 + 0x28]
0000000180aa0c78: mov      rdx, rbx
0000000180aa0c7b: call     0x18048b9e0
0000000180aa0c80: mov      rcx, qword ptr [rip + 0x7e70341] ; GenericMethodInfo 282409 @0x188910fc8
0000000180aa0c87: call     0x185339460
0000000180aa0c8c: test     rax, rax
0000000180aa0c8f: je       0x180aa0ffe
0000000180aa0c95: xor      edx, edx
0000000180aa0c97: mov      rcx, rax
0000000180aa0c9a: call     0x1867927a0
0000000180aa0c9f: test     al, al
0000000180aa0ca1: je       0x180aa0ebc
0000000180aa0ca7: mov      rcx, qword ptr [rip + 0x7e870b2] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
0000000180aa0cae: cmp      dword ptr [rcx + 0xe0], 0
0000000180aa0cb5: jne      0x180aa0cbc
0000000180aa0cb7: call     0x18048c140
0000000180aa0cbc: xor      ecx, ecx
0000000180aa0cbe: call     0x18061b8d0 ; Torappu.Battle.BattleController.AllocateEntityList_DISPOSE [64473]
0000000180aa0cc3: mov      qword ptr [rsp + 0x30], rax
0000000180aa0cc8: mov      qword ptr [rsp + 0x70], 0
0000000180aa0cd1: lea      rbx, [rsp + 0x30]
0000000180aa0cd6: mov      qword ptr [rsp + 0x78], rbx
0000000180aa0cdb: xor      r8d, r8d
0000000180aa0cde: mov      rdx, r13
0000000180aa0ce1: lea      rcx, [rsp + 0x50]
0000000180aa0ce6: call     0x180aa00d0
0000000180aa0ceb: movsd    xmm0, qword ptr [rax]
0000000180aa0cef: movsd    qword ptr [rsp + 0x60], xmm0
0000000180aa0cf5: mov      r12d, dword ptr [rax + 8]
0000000180aa0cf9: xor      r8d, r8d
0000000180aa0cfc: mov      rdx, rsi
0000000180aa0cff: lea      rcx, [rsp + 0x60]
0000000180aa0d04: call     0x180ad4360 ; Torappu.Battle.VisualObject.get_worldPosition [77868]
0000000180aa0d09: movsd    xmm7, qword ptr [rax]
0000000180aa0d0d: mov      eax, dword ptr [rax + 8]
0000000180aa0d10: mov      dword ptr [rsp + 0x58], eax
0000000180aa0d14: movaps   xmm6, xmm7
0000000180aa0d17: shufps   xmm6, xmm6, 0x55
0000000180aa0d1b: movsd    qword ptr [rsp + 0x50], xmm7
0000000180aa0d21: mov      rcx, qword ptr [rip + 0x7e32be0] ; GenericMethodInfo 281972 @0x1888d3908
0000000180aa0d28: call     0x185337c50
0000000180aa0d2d: test     rax, rax
0000000180aa0d30: je       0x180aa0ff2
0000000180aa0d36: xor      edx, edx
0000000180aa0d38: mov      rcx, rax
0000000180aa0d3b: call     0x180643410 ; Torappu.Battle.BattleController.get_physicManager [64526]
0000000180aa0d40: test     rax, rax
0000000180aa0d43: je       0x180aa0fed
0000000180aa0d49: movaps   xmm0, xmm7
0000000180aa0d4c: unpcklps xmm0, xmm6
0000000180aa0d4f: movsd    qword ptr [rsp + 0x50], xmm0
0000000180aa0d55: mov      dword ptr [rsp + 0x58], r12d
0000000180aa0d5a: xor      r9d, r9d
0000000180aa0d5d: mov      r8, qword ptr [rsp + 0x30]
0000000180aa0d62: lea      rdx, [rsp + 0x50]
0000000180aa0d67: mov      rcx, rax
0000000180aa0d6a: call     0x180b231c0 ; Torappu.Battle.TPhysic2D.TPhysicManager.QueryEnemy [78700]
0000000180aa0d6f: mov      r12, qword ptr [rsp + 0x30]
0000000180aa0d74: mov      r13, qword ptr [r15 + 0x28]
0000000180aa0d78: mov      rcx, qword ptr [rip + 0x7dd3da1] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
0000000180aa0d7f: cmp      dword ptr [rcx + 0xe0], 0
0000000180aa0d86: jne      0x180aa0d8d
0000000180aa0d88: call     0x18048c140
0000000180aa0d8d: mov      qword ptr [rsp + 0x20], 0
0000000180aa0d96: mov      r9, r13
0000000180aa0d99: mov      r8d, r14d
0000000180aa0d9c: mov      rdx, rsi
0000000180aa0d9f: mov      rcx, r12
0000000180aa0da2: call     0x1809d7e10 ; Torappu.Battle.FilterUtil.FilterWithVolume [74627]
0000000180aa0da7: mov      r12, rax
0000000180aa0daa: nop      word ptr [rax + rax]
0000000180aa0db0: xor      r14d, r14d
0000000180aa0db3: test     rax, rax
0000000180aa0db6: je       0x180aa0fe7
0000000180aa0dbc: mov      r13, qword ptr [rsp + 0xd8]
0000000180aa0dc4: cmp      r14d, dword ptr [r12 + 0x18]
0000000180aa0dc9: jge      0x180aa0e59
0000000180aa0dcf: mov      r8, qword ptr [rip + 0x7e97d02] ; GenericMethodInfo 271525 @0x188938ad8
0000000180aa0dd6: mov      edx, r14d
0000000180aa0dd9: mov      rcx, r12
0000000180aa0ddc: call     0x184afcf00
0000000180aa0de1: mov      rsi, rax
0000000180aa0de4: mov      rdx, qword ptr [rip + 0x7d7a8c5] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180aa0deb: test     rax, rax
0000000180aa0dee: jne      0x180aa0df5
0000000180aa0df0: xor      r8d, r8d
0000000180aa0df3: jmp      0x180aa0e43
0000000180aa0df5: mov      r8, qword ptr [rax]
0000000180aa0df8: cmp      byte ptr [rip + 0x822b9f1], 0
0000000180aa0dff: jbe      0x180aa0e10
0000000180aa0e01: mov      rcx, r8
0000000180aa0e04: call     0x1804463e0
0000000180aa0e09: xor      r8d, r8d
0000000180aa0e0c: test     al, al
0000000180aa0e0e: jmp      0x180aa0e3f
0000000180aa0e10: movzx    eax, byte ptr [rdx + 0x130]
0000000180aa0e17: cmp      byte ptr [r8 + 0x130], al
0000000180aa0e1e: jb       0x180aa0e38
0000000180aa0e20: movzx    ecx, al
0000000180aa0e23: mov      rax, qword ptr [r8 + 0xc8]
0000000180aa0e2a: cmp      qword ptr [rax + rcx*8 - 8], rdx
0000000180aa0e2f: jne      0x180aa0e38
0000000180aa0e31: mov      eax, 1
0000000180aa0e36: jmp      0x180aa0e3a
0000000180aa0e38: xor      eax, eax
0000000180aa0e3a: xor      r8d, r8d
0000000180aa0e3d: test     eax, eax
0000000180aa0e3f: cmovne   r8, rsi
0000000180aa0e43: xor      r9d, r9d
0000000180aa0e46: mov      rdx, r13
0000000180aa0e49: mov      rcx, r15
0000000180aa0e4c: call     0x180aa0430 ; Torappu.Battle.BlockManager.AddBlockee [77191]
0000000180aa0e51: inc      r14d
0000000180aa0e54: jmp      0x180aa0dc4
0000000180aa0e59: cmp      qword ptr [rbx], 0
0000000180aa0e5d: je       0x180aa0e70
0000000180aa0e5f: xor      ecx, ecx
0000000180aa0e61: mov      r8, qword ptr [rbx]
0000000180aa0e64: mov      rdx, qword ptr [rip + 0x7eb3e2d] ; TypeInfo System.IDisposable @0x188954c98
0000000180aa0e6b: call     0x180005310
0000000180aa0e70: jmp      0x180aa0fc4
0000000180aa0e75: mov      r8, qword ptr [rsp + 0x78]
0000000180aa0e7a: cmp      qword ptr [r8], 0
0000000180aa0e7e: je       0x180aa0e91
0000000180aa0e80: xor      ecx, ecx
0000000180aa0e82: mov      r8, qword ptr [r8]
0000000180aa0e85: mov      rdx, qword ptr [rip + 0x7eb3e0c] ; TypeInfo System.IDisposable @0x188954c98
0000000180aa0e8c: call     0x180005310
0000000180aa0e91: mov      rcx, qword ptr [rsp + 0x70]
0000000180aa0e96: test     rcx, rcx
0000000180aa0e99: jne      0x180aa0ff8
0000000180aa0e9f: mov      r15, qword ptr [rsp + 0xd0]
0000000180aa0ea7: mov      rsi, qword ptr [rsp + 0x38]
0000000180aa0eac: mov      r14d, dword ptr [rsp + 0xe0]
0000000180aa0eb4: mov      r13, qword ptr [rsp + 0xd8]
0000000180aa0ebc: mov      rcx, qword ptr [rip + 0x7e32a45] ; GenericMethodInfo 281972 @0x1888d3908
0000000180aa0ec3: call     0x185337c50
0000000180aa0ec8: test     rax, rax
0000000180aa0ecb: je       0x180aa0ffe
0000000180aa0ed1: xor      edx, edx
0000000180aa0ed3: mov      rcx, rax
0000000180aa0ed6: call     0x180644510 ; Torappu.Battle.BattleController.get_unitManager [64502]
0000000180aa0edb: test     rax, rax
0000000180aa0ede: je       0x180aa0ffe
0000000180aa0ee4: mov      rbx, qword ptr [rax + 0x30]
0000000180aa0ee8: mov      r12, qword ptr [r15 + 0x28]
0000000180aa0eec: mov      rcx, qword ptr [rip + 0x7dd3c2d] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
0000000180aa0ef3: cmp      dword ptr [rcx + 0xe0], 0
0000000180aa0efa: jne      0x180aa0f01
0000000180aa0efc: call     0x18048c140
0000000180aa0f01: mov      rax, qword ptr [rip + 0x7e64030] ; GenericMethodInfo 293297 @0x188904f38
0000000180aa0f08: mov      qword ptr [rsp + 0x20], rax
0000000180aa0f0d: mov      r9, r12
0000000180aa0f10: mov      r8d, r14d
0000000180aa0f13: mov      rdx, rsi
0000000180aa0f16: mov      rcx, rbx
0000000180aa0f19: call     0x184511e30
0000000180aa0f1e: mov      r14, rax
0000000180aa0f21: xor      esi, esi
0000000180aa0f23: xor      ecx, ecx
0000000180aa0f25: test     rax, rax
0000000180aa0f28: je       0x180aa0ffe
0000000180aa0f2e: nop      
0000000180aa0f30: cmp      ecx, dword ptr [r14 + 0x18]
0000000180aa0f34: jge      0x180aa0fc4
0000000180aa0f3a: mov      r8, qword ptr [rip + 0x7e97b97] ; GenericMethodInfo 271525 @0x188938ad8
0000000180aa0f41: mov      edx, esi
0000000180aa0f43: mov      rcx, r14
0000000180aa0f46: call     0x184afcf00
0000000180aa0f4b: mov      rbx, rax
0000000180aa0f4e: mov      rdx, qword ptr [rip + 0x7d7a75b] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180aa0f55: test     rax, rax
0000000180aa0f58: jne      0x180aa0f5f
0000000180aa0f5a: xor      r8d, r8d
0000000180aa0f5d: jmp      0x180aa0fad
0000000180aa0f5f: mov      r8, qword ptr [rax]
0000000180aa0f62: cmp      byte ptr [rip + 0x822b887], 0
0000000180aa0f69: jbe      0x180aa0f7a
0000000180aa0f6b: mov      rcx, r8
0000000180aa0f6e: call     0x1804463e0
0000000180aa0f73: xor      r8d, r8d
0000000180aa0f76: test     al, al
0000000180aa0f78: jmp      0x180aa0fa9
0000000180aa0f7a: movzx    eax, byte ptr [rdx + 0x130]
0000000180aa0f81: cmp      byte ptr [r8 + 0x130], al
0000000180aa0f88: jb       0x180aa0fa2
0000000180aa0f8a: movzx    ecx, al
0000000180aa0f8d: mov      rax, qword ptr [r8 + 0xc8]
0000000180aa0f94: cmp      qword ptr [rax + rcx*8 - 8], rdx
0000000180aa0f99: jne      0x180aa0fa2
0000000180aa0f9b: mov      eax, 1
0000000180aa0fa0: jmp      0x180aa0fa4
0000000180aa0fa2: xor      eax, eax
0000000180aa0fa4: xor      r8d, r8d
0000000180aa0fa7: test     eax, eax
0000000180aa0fa9: cmovne   r8, rbx
0000000180aa0fad: xor      r9d, r9d
0000000180aa0fb0: mov      rdx, r13
0000000180aa0fb3: mov      rcx, r15
0000000180aa0fb6: call     0x180aa0430 ; Torappu.Battle.BlockManager.AddBlockee [77191]
0000000180aa0fbb: inc      esi
0000000180aa0fbd: mov      ecx, esi
0000000180aa0fbf: jmp      0x180aa0f30
0000000180aa0fc4: lea      r11, [rsp + 0xa0]
0000000180aa0fcc: mov      rbx, qword ptr [r11 + 0x48]
0000000180aa0fd0: movaps   xmm6, xmmword ptr [r11 - 0x10]
0000000180aa0fd5: movaps   xmm7, xmmword ptr [r11 - 0x20]
0000000180aa0fda: mov      rsp, r11
0000000180aa0fdd: pop      r15
0000000180aa0fdf: pop      r14
0000000180aa0fe1: pop      r13
0000000180aa0fe3: pop      r12
0000000180aa0fe5: pop      rsi
0000000180aa0fe6: ret      
0000000180aa0fe7: call     0x18048c0b0
0000000180aa0fec: nop      
0000000180aa0fed: call     0x18048c0b0
0000000180aa0ff2: call     0x18048c0b0
0000000180aa0ff7: nop      
0000000180aa0ff8: call     0x180472d50
0000000180aa0ffd: int3     
0000000180aa0ffe: call     0x18048c0b0
0000000180aa1003: int3     
0000000180aa1004: int3     
0000000180aa1005: int3     
0000000180aa1006: int3     
0000000180aa1007: int3     
0000000180aa1008: int3     
0000000180aa1009: int3     
0000000180aa100a: int3     
0000000180aa100b: int3     
0000000180aa100c: int3     
0000000180aa100d: int3     
0000000180aa100e: int3     
0000000180aa100f: int3     