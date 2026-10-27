; Torappu.Battle.Enemy.set_blockVolumeAddition metadata=76352 token=0x6012a41 VA=0x180a80b40 RVA=0xa80b40 size=0x1d0
0000000180a80b40: mov      qword ptr [rsp + 8], rbx
0000000180a80b45: push     rdi
0000000180a80b46: sub      rsp, 0x20
0000000180a80b4a: cmp      byte ptr [rip + 0x8211cd8], 0
0000000180a80b51: mov      edi, edx
0000000180a80b53: mov      rbx, rcx
0000000180a80b56: jne      0x180a80b6b
0000000180a80b58: lea      rcx, [rip + 0x7d9ab51] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a80b5f: call     0x18048bf00
0000000180a80b64: mov      byte ptr [rip + 0x8211cbe], 1
0000000180a80b6b: mov      rax, qword ptr [rip + 0x7d9ab3e] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a80b72: cmp      dword ptr [rax + 0xe0], 0
0000000180a80b79: jne      0x180a80b8a
0000000180a80b7b: mov      rcx, rax
0000000180a80b7e: call     0x18048c140
0000000180a80b83: mov      rax, qword ptr [rip + 0x7d9ab26] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a80b8a: mov      rax, qword ptr [rax + 0xb8]
0000000180a80b91: mov      rcx, qword ptr [rax + 0x288]
0000000180a80b98: test     rcx, rcx
0000000180a80b9b: jne      0x180a80ceb
0000000180a80ba1: cmp      byte ptr [rip + 0x8211cd4], cl
0000000180a80ba7: mov      dword ptr [rbx + 0x4a8], edi
0000000180a80bad: jne      0x180a80bda
0000000180a80baf: lea      rcx, [rip + 0x7d9aafa] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a80bb6: call     0x18048bf00
0000000180a80bbb: lea      rcx, [rip + 0x7eb49e6] ; GenericMethodInfo 280377 @0x1889355a8
0000000180a80bc2: call     0x18048bf00
0000000180a80bc7: lea      rcx, [rip + 0x7eb4c1a] ; GenericMethodInfo 280378 @0x1889357e8
0000000180a80bce: call     0x18048bf00
0000000180a80bd3: mov      byte ptr [rip + 0x8211ca1], 1
0000000180a80bda: mov      rax, qword ptr [rip + 0x7d9aacf] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a80be1: mov      qword ptr [rsp + 0x48], 0
0000000180a80bea: cmp      dword ptr [rax + 0xe0], 0
0000000180a80bf1: jne      0x180a80c02
0000000180a80bf3: mov      rcx, rax
0000000180a80bf6: call     0x18048c140
0000000180a80bfb: mov      rax, qword ptr [rip + 0x7d9aaae] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a80c02: mov      rax, qword ptr [rax + 0xb8]
0000000180a80c09: mov      rcx, qword ptr [rax + 0x518]
0000000180a80c10: test     rcx, rcx
0000000180a80c13: jne      0x180a80cd5
0000000180a80c19: mov      rdx, qword ptr [rip + 0x7eb4bc8] ; GenericMethodInfo 280378 @0x1889357e8
0000000180a80c20: lea      rcx, [rbx + 0x398]
0000000180a80c27: call     0x185159fc0
0000000180a80c2c: test     al, al
0000000180a80c2e: je       0x180a80cf9
0000000180a80c34: mov      rdx, qword ptr [rip + 0x7eb496d] ; GenericMethodInfo 280377 @0x1889355a8
0000000180a80c3b: lea      rcx, [rbx + 0x398]
0000000180a80c42: call     0x185159d80
0000000180a80c47: mov      rbx, rax
0000000180a80c4a: test     rax, rax
0000000180a80c4d: je       0x180a80d04
0000000180a80c53: cmp      byte ptr [rip + 0x824bb96], 0
0000000180a80c5a: jbe      0x180a80c64
0000000180a80c5c: mov      rcx, qword ptr [rax]
0000000180a80c5f: call     0x180446d00
0000000180a80c64: mov      r8, qword ptr [rbx]
0000000180a80c67: lea      rdx, [rsp + 0x48]
0000000180a80c6c: mov      rcx, rbx
0000000180a80c6f: mov      r9, qword ptr [r8 + 0x5d0]
0000000180a80c76: mov      r8, qword ptr [r8 + 0x5d8]
0000000180a80c7d: call     r9
0000000180a80c80: test     al, al
0000000180a80c82: je       0x180a80cf9
0000000180a80c84: mov      rcx, qword ptr [rsp + 0x48]
0000000180a80c89: test     rcx, rcx
0000000180a80c8c: je       0x180a80d04
0000000180a80c8e: xor      edx, edx
0000000180a80c90: call     0x180a64a50
0000000180a80c95: test     rax, rax
0000000180a80c98: je       0x180a80d04
0000000180a80c9a: xor      edx, edx
0000000180a80c9c: mov      rcx, rax
0000000180a80c9f: call     0x180aa0880 ; Torappu.Battle.BlockManager.RecalculateBlockeesTotalVolume [77201]
0000000180a80ca4: mov      rcx, qword ptr [rsp + 0x48]
0000000180a80ca9: test     rcx, rcx
0000000180a80cac: je       0x180a80d04
0000000180a80cae: xor      edx, edx
0000000180a80cb0: call     0x180a64a50
0000000180a80cb5: test     rax, rax
0000000180a80cb8: je       0x180a80d04
0000000180a80cba: mov      rdx, qword ptr [rsp + 0x48]
0000000180a80cbf: xor      r8d, r8d
0000000180a80cc2: mov      rcx, rax
0000000180a80cc5: call     0x180aa1170 ; Torappu.Battle.BlockManager.UpdateBlockees [77192]
0000000180a80cca: mov      rbx, qword ptr [rsp + 0x30]
0000000180a80ccf: add      rsp, 0x20
0000000180a80cd3: pop      rdi
0000000180a80cd4: ret      
0000000180a80cd5: xor      r8d, r8d
0000000180a80cd8: mov      rdx, rbx
0000000180a80cdb: call     0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
0000000180a80ce0: mov      rbx, qword ptr [rsp + 0x30]
0000000180a80ce5: add      rsp, 0x20
0000000180a80ce9: pop      rdi
0000000180a80cea: ret      
0000000180a80ceb: xor      r9d, r9d
0000000180a80cee: mov      r8d, edi
0000000180a80cf1: mov      rdx, rbx
0000000180a80cf4: call     0x1834c0e30 ; XLua.DelegateBridge.__Gen_Delegate_Imp55 [2710]
0000000180a80cf9: mov      rbx, qword ptr [rsp + 0x30]
0000000180a80cfe: add      rsp, 0x20
0000000180a80d02: pop      rdi
0000000180a80d03: ret      
0000000180a80d04: call     0x18048c0b0
0000000180a80d09: int3     
0000000180a80d0a: int3     
0000000180a80d0b: int3     
0000000180a80d0c: int3     
0000000180a80d0d: int3     
0000000180a80d0e: int3     
0000000180a80d0f: int3     