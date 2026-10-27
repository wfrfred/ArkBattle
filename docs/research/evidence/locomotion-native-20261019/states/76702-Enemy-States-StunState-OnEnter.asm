; Torappu.Battle.Enemy.States.StunState.OnEnter metadata=76702 token=0x6012b9f VA=0x180a9c400 RVA=0xa9c400 size=0x190
0000000180a9c400: mov      qword ptr [rsp + 8], rbx
0000000180a9c405: push     rdi
0000000180a9c406: sub      rsp, 0x30
0000000180a9c40a: cmp      byte ptr [rip + 0x81f651e], 0
0000000180a9c411: mov      edi, edx
0000000180a9c413: mov      rbx, rcx
0000000180a9c416: jne      0x180a9c443
0000000180a9c418: lea      rcx, [rip + 0x7ebb741] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9c41f: call     0x18048bf00
0000000180a9c424: lea      rcx, [rip + 0x7de9f1d] ; TypeInfo Torappu.Battle.Enemy.States.StunState @0x188886348
0000000180a9c42b: call     0x18048bf00
0000000180a9c430: lea      rcx, [rip + 0x7dfff81] ; StringLiteral 'Stun' @0x18889c3b8
0000000180a9c437: call     0x18048bf00
0000000180a9c43c: mov      byte ptr [rip + 0x81f64ec], 1
0000000180a9c443: mov      rax, qword ptr [rip + 0x7de9efe] ; TypeInfo Torappu.Battle.Enemy.States.StunState @0x188886348
0000000180a9c44a: mov      rcx, qword ptr [rax + 0xb8]
0000000180a9c451: mov      rcx, qword ptr [rcx]
0000000180a9c454: test     rcx, rcx
0000000180a9c457: jne      0x180a9c56e
0000000180a9c45d: mov      rdx, qword ptr [rip + 0x7ebb6fc] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9c464: mov      rcx, rbx
0000000180a9c467: call     0x18536e540
0000000180a9c46c: test     rax, rax
0000000180a9c46f: je       0x180a9c586
0000000180a9c475: mov      rdx, qword ptr [rip + 0x7dfff3c] ; StringLiteral 'Stun' @0x18889c3b8
0000000180a9c47c: xor      r9d, r9d
0000000180a9c47f: xor      r8d, r8d
0000000180a9c482: mov      rcx, rax
0000000180a9c485: call     0x180ac6ae0 ; Torappu.Battle.Unit.ContainsAnimation [77638]
0000000180a9c48a: mov      rdx, qword ptr [rip + 0x7ebb6cf] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9c491: mov      rcx, rbx
0000000180a9c494: test     al, al
0000000180a9c496: jne      0x180a9c50f
0000000180a9c498: call     0x18536e540
0000000180a9c49d: mov      rbx, rax
0000000180a9c4a0: test     rax, rax
0000000180a9c4a3: je       0x180a9c586
0000000180a9c4a9: cmp      byte ptr [rip + 0x8230340], 0
0000000180a9c4b0: jbe      0x180a9c4ba
0000000180a9c4b2: mov      rcx, qword ptr [rax]
0000000180a9c4b5: call     0x180446d00
0000000180a9c4ba: mov      rdx, qword ptr [rbx]
0000000180a9c4bd: mov      rcx, rbx
0000000180a9c4c0: mov      r8, qword ptr [rdx + 0xb60]
0000000180a9c4c7: mov      rdx, qword ptr [rdx + 0xb68]
0000000180a9c4ce: call     r8
0000000180a9c4d1: mov      rbx, rax
0000000180a9c4d4: test     rax, rax
0000000180a9c4d7: je       0x180a9c586
0000000180a9c4dd: cmp      byte ptr [rip + 0x823030c], 0
0000000180a9c4e4: jbe      0x180a9c4ee
0000000180a9c4e6: mov      rcx, qword ptr [rax]
0000000180a9c4e9: call     0x180446d00
0000000180a9c4ee: mov      rdx, qword ptr [rbx]
0000000180a9c4f1: mov      rcx, rbx
0000000180a9c4f4: mov      r8, qword ptr [rdx + 0x2d0]
0000000180a9c4fb: mov      rdx, qword ptr [rdx + 0x2d8]
0000000180a9c502: mov      rbx, qword ptr [rsp + 0x40]
0000000180a9c507: add      rsp, 0x30
0000000180a9c50b: pop      rdi
0000000180a9c50c: jmp      r8
0000000180a9c50f: call     0x18536e540
0000000180a9c514: mov      rbx, rax
0000000180a9c517: test     rax, rax
0000000180a9c51a: je       0x180a9c586
0000000180a9c51c: cmp      byte ptr [rip + 0x82302cd], 0
0000000180a9c523: mov      rdi, qword ptr [rip + 0x7dffe8e] ; StringLiteral 'Stun' @0x18889c3b8
0000000180a9c52a: jbe      0x180a9c534
0000000180a9c52c: mov      rcx, qword ptr [rax]
0000000180a9c52f: call     0x180446d00
0000000180a9c534: mov      rax, qword ptr [rbx]
0000000180a9c537: xor      r8d, r8d
0000000180a9c53a: movss    xmm3, dword ptr [rip + 0x63a369e]
0000000180a9c542: mov      rdx, rdi
0000000180a9c545: mov      rcx, rbx
0000000180a9c548: mov      r9, qword ptr [rax + 0x7b0]
0000000180a9c54f: mov      rax, qword ptr [rax + 0x7b8]
0000000180a9c556: mov      qword ptr [rsp + 0x28], rax
0000000180a9c55b: mov      byte ptr [rsp + 0x20], 0
0000000180a9c560: call     r9
0000000180a9c563: mov      rbx, qword ptr [rsp + 0x40]
0000000180a9c568: add      rsp, 0x30
0000000180a9c56c: pop      rdi
0000000180a9c56d: ret      
0000000180a9c56e: xor      r9d, r9d
0000000180a9c571: mov      r8d, edi
0000000180a9c574: mov      rdx, rbx
0000000180a9c577: mov      rbx, qword ptr [rsp + 0x40]
0000000180a9c57c: add      rsp, 0x30
0000000180a9c580: pop      rdi
0000000180a9c581: jmp      0x1834c0e30 ; XLua.DelegateBridge.__Gen_Delegate_Imp55 [2710]
0000000180a9c586: call     0x18048c0b0
0000000180a9c58b: int3     
0000000180a9c58c: int3     
0000000180a9c58d: int3     
0000000180a9c58e: int3     
0000000180a9c58f: int3     
