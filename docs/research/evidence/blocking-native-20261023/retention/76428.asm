; Torappu.Battle.Enemy.CheckBlockable metadata=76428 token=0x6012a8d VA=0x180a6bb70 RVA=0xa6bb70 size=0xe0
0000000180a6bb70: mov      qword ptr [rsp + 8], rbx
0000000180a6bb75: push     rdi
0000000180a6bb76: sub      rsp, 0x20
0000000180a6bb7a: cmp      byte ptr [rip + 0x8226cf4], 0
0000000180a6bb81: mov      rbx, rdx
0000000180a6bb84: mov      rdi, rcx
0000000180a6bb87: jne      0x180a6bba8
0000000180a6bb89: lea      rcx, [rip + 0x7dafb20] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6bb90: call     0x18048bf00
0000000180a6bb95: lea      rcx, [rip + 0x7ec9c4c] ; GenericMethodInfo 280378 @0x1889357e8
0000000180a6bb9c: call     0x18048bf00
0000000180a6bba1: mov      byte ptr [rip + 0x8226ccd], 1
0000000180a6bba8: mov      rax, qword ptr [rip + 0x7dafb01] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6bbaf: cmp      dword ptr [rax + 0xe0], 0
0000000180a6bbb6: jne      0x180a6bbc7
0000000180a6bbb8: mov      rcx, rax
0000000180a6bbbb: call     0x18048c140
0000000180a6bbc0: mov      rax, qword ptr [rip + 0x7dafae9] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6bbc7: mov      rax, qword ptr [rax + 0xb8]
0000000180a6bbce: mov      rcx, qword ptr [rax + 0x4e8]
0000000180a6bbd5: test     rcx, rcx
0000000180a6bbd8: jne      0x180a6bc30
0000000180a6bbda: mov      rdx, qword ptr [rip + 0x7ec9c07] ; GenericMethodInfo 280378 @0x1889357e8
0000000180a6bbe1: lea      rcx, [rdi + 0x398]
0000000180a6bbe8: call     0x185159fc0
0000000180a6bbed: test     al, al
0000000180a6bbef: jne      0x180a6bc23
0000000180a6bbf1: test     rbx, rbx
0000000180a6bbf4: je       0x180a6bc48
0000000180a6bbf6: xor      r9d, r9d
0000000180a6bbf9: xorps    xmm2, xmm2
0000000180a6bbfc: mov      rdx, rdi
0000000180a6bbff: mov      rcx, rbx
0000000180a6bc02: call     0x180a64780
0000000180a6bc07: test     al, al
0000000180a6bc09: je       0x180a6bc23
0000000180a6bc0b: xor      r8d, r8d
0000000180a6bc0e: mov      rdx, rbx
0000000180a6bc11: mov      rcx, rdi
0000000180a6bc14: mov      rbx, qword ptr [rsp + 0x30]
0000000180a6bc19: add      rsp, 0x20
0000000180a6bc1d: pop      rdi
0000000180a6bc1e: jmp      0x180a6b980 ; Torappu.Battle.Enemy.CheckBlockableWithoutCheckRange [76429]
0000000180a6bc23: xor      al, al
0000000180a6bc25: mov      rbx, qword ptr [rsp + 0x30]
0000000180a6bc2a: add      rsp, 0x20
0000000180a6bc2e: pop      rdi
0000000180a6bc2f: ret      
0000000180a6bc30: xor      r9d, r9d
0000000180a6bc33: mov      r8, rbx
0000000180a6bc36: mov      rdx, rdi
0000000180a6bc39: mov      rbx, qword ptr [rsp + 0x30]
0000000180a6bc3e: add      rsp, 0x20
0000000180a6bc42: pop      rdi
0000000180a6bc43: jmp      0x18332fc60 ; XLua.DelegateBridge.__Gen_Delegate_Imp29 [2684]
0000000180a6bc48: call     0x18048c0b0
0000000180a6bc4d: int3     
0000000180a6bc4e: int3     
0000000180a6bc4f: int3     