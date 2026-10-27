; Torappu.Battle.Enemy.States.StunState.OnTick metadata=76703 token=0x6012ba0 VA=0x180a9c590 RVA=0xa9c590 size=0x190
0000000180a9c590: mov      qword ptr [rsp + 8], rbx
0000000180a9c595: push     rdi
0000000180a9c596: sub      rsp, 0x20
0000000180a9c59a: cmp      byte ptr [rip + 0x81f638f], 0
0000000180a9c5a1: mov      rbx, rdx
0000000180a9c5a4: mov      rdi, rcx
0000000180a9c5a7: jne      0x180a9c5d4
0000000180a9c5a9: lea      rcx, [rip + 0x7ebb130] ; GenericMethodInfo 282792 @0x1889576e0
0000000180a9c5b0: call     0x18048bf00
0000000180a9c5b5: lea      rcx, [rip + 0x7ebb5a4] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9c5bc: call     0x18048bf00
0000000180a9c5c1: lea      rcx, [rip + 0x7de9d80] ; TypeInfo Torappu.Battle.Enemy.States.StunState @0x188886348
0000000180a9c5c8: call     0x18048bf00
0000000180a9c5cd: mov      byte ptr [rip + 0x81f635c], 1
0000000180a9c5d4: mov      rax, qword ptr [rip + 0x7de9d6d] ; TypeInfo Torappu.Battle.Enemy.States.StunState @0x188886348
0000000180a9c5db: mov      rcx, qword ptr [rax + 0xb8]
0000000180a9c5e2: mov      rcx, qword ptr [rcx + 8]
0000000180a9c5e6: test     rcx, rcx
0000000180a9c5e9: jne      0x180a9c6f4
0000000180a9c5ef: mov      rdx, qword ptr [rip + 0x7ebb56a] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9c5f6: mov      rcx, rdi
0000000180a9c5f9: call     0x18536e540
0000000180a9c5fe: test     rax, rax
0000000180a9c601: je       0x180a9c70d
0000000180a9c607: xor      edx, edx
0000000180a9c609: mov      rcx, rax
0000000180a9c60c: call     0x180705320 ; Torappu.Battle.Entity.get_isActuallyLevitate [66493]
0000000180a9c611: mov      rcx, rdi
0000000180a9c614: test     al, al
0000000180a9c616: jne      0x180a9c6d9
0000000180a9c61c: mov      rdx, qword ptr [rip + 0x7ebb53d] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9c623: call     0x18536e540
0000000180a9c628: test     rax, rax
0000000180a9c62b: je       0x180a9c70d
0000000180a9c631: xor      edx, edx
0000000180a9c633: mov      rcx, rax
0000000180a9c636: call     0x180706a00 ; Torappu.Battle.Entity.get_isStunned [66486]
0000000180a9c63b: test     al, al
0000000180a9c63d: jne      0x180a9c702
0000000180a9c643: mov      rdx, qword ptr [rip + 0x7ebb516] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9c64a: mov      rcx, rdi
0000000180a9c64d: call     0x18536e540
0000000180a9c652: test     rax, rax
0000000180a9c655: je       0x180a9c70d
0000000180a9c65b: xor      edx, edx
0000000180a9c65d: mov      rcx, rax
0000000180a9c660: call     0x180705b50 ; Torappu.Battle.Entity.get_isFrozen [66488]
0000000180a9c665: mov      rcx, rdi
0000000180a9c668: test     al, al
0000000180a9c66a: jne      0x180a9c6be
0000000180a9c66c: mov      rdx, qword ptr [rip + 0x7ebb4ed] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9c673: call     0x18536e540
0000000180a9c678: test     rax, rax
0000000180a9c67b: je       0x180a9c70d
0000000180a9c681: xor      edx, edx
0000000180a9c683: mov      rcx, rax
0000000180a9c686: call     0x180706560 ; Torappu.Battle.Entity.get_isPalsying [66504]
0000000180a9c68b: mov      r8, qword ptr [rip + 0x7ebb04e] ; GenericMethodInfo 282792 @0x1889576e0
0000000180a9c692: mov      rcx, rdi
0000000180a9c695: test     al, al
0000000180a9c697: jne      0x180a9c6aa
0000000180a9c699: xor      edx, edx
0000000180a9c69b: mov      rbx, qword ptr [rsp + 0x30]
0000000180a9c6a0: add      rsp, 0x20
0000000180a9c6a4: pop      rdi
0000000180a9c6a5: jmp      0x18536e450
0000000180a9c6aa: mov      edx, 0x10
0000000180a9c6af: mov      rbx, qword ptr [rsp + 0x30]
0000000180a9c6b4: add      rsp, 0x20
0000000180a9c6b8: pop      rdi
0000000180a9c6b9: jmp      0x18536e450
0000000180a9c6be: mov      r8, qword ptr [rip + 0x7ebb01b] ; GenericMethodInfo 282792 @0x1889576e0
0000000180a9c6c5: mov      edx, 0xd
0000000180a9c6ca: mov      rbx, qword ptr [rsp + 0x30]
0000000180a9c6cf: add      rsp, 0x20
0000000180a9c6d3: pop      rdi
0000000180a9c6d4: jmp      0x18536e450
0000000180a9c6d9: mov      r8, qword ptr [rip + 0x7ebb000] ; GenericMethodInfo 282792 @0x1889576e0
0000000180a9c6e0: mov      edx, 0xe
0000000180a9c6e5: mov      rbx, qword ptr [rsp + 0x30]
0000000180a9c6ea: add      rsp, 0x20
0000000180a9c6ee: pop      rdi
0000000180a9c6ef: jmp      0x18536e450
0000000180a9c6f4: xor      r9d, r9d
0000000180a9c6f7: mov      r8, rbx
0000000180a9c6fa: mov      rdx, rdi
0000000180a9c6fd: call     0x1833f9830 ; XLua.DelegateBridge.__Gen_Delegate_Imp427 [3082]
0000000180a9c702: mov      rbx, qword ptr [rsp + 0x30]
0000000180a9c707: add      rsp, 0x20
0000000180a9c70b: pop      rdi
0000000180a9c70c: ret      
0000000180a9c70d: call     0x18048c0b0
0000000180a9c712: int3     
0000000180a9c713: int3     
0000000180a9c714: int3     
0000000180a9c715: int3     
0000000180a9c716: int3     
0000000180a9c717: int3     
0000000180a9c718: int3     
0000000180a9c719: int3     
0000000180a9c71a: int3     
0000000180a9c71b: int3     
0000000180a9c71c: int3     
0000000180a9c71d: int3     
0000000180a9c71e: int3     
0000000180a9c71f: int3     
