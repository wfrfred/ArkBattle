; Torappu.Battle.Enemy.States.FreezeState.CheckSwitchOut metadata=76723 token=0x6012bb4 VA=0x180a94da0 RVA=0xa94da0 size=0xc0
0000000180a94da0: mov      qword ptr [rsp + 8], rbx
0000000180a94da5: push     rdi
0000000180a94da6: sub      rsp, 0x20
0000000180a94daa: cmp      byte ptr [rip + 0x81fdb93], 0
0000000180a94db1: mov      ebx, edx
0000000180a94db3: mov      rdi, rcx
0000000180a94db6: jne      0x180a94dd7
0000000180a94db8: lea      rcx, [rip + 0x7df0821] ; TypeInfo Torappu.Battle.Enemy.States.FreezeState @0x1888855e0
0000000180a94dbf: call     0x18048bf00
0000000180a94dc4: lea      rcx, [rip + 0x7ec2d95] ; GenericMethodInfo 282794 @0x188957b60
0000000180a94dcb: call     0x18048bf00
0000000180a94dd0: mov      byte ptr [rip + 0x81fdb6d], 1
0000000180a94dd7: mov      rax, qword ptr [rip + 0x7df0802] ; TypeInfo Torappu.Battle.Enemy.States.FreezeState @0x1888855e0
0000000180a94dde: mov      r8, qword ptr [rax + 0xb8]
0000000180a94de5: mov      rcx, qword ptr [r8 + 0x50]
0000000180a94de9: test     rcx, rcx
0000000180a94dec: jne      0x180a94e3d
0000000180a94dee: mov      rdx, qword ptr [rip + 0x7ec2d6b] ; GenericMethodInfo 282794 @0x188957b60
0000000180a94df5: mov      rcx, rdi
0000000180a94df8: call     0x18536e540
0000000180a94dfd: test     rax, rax
0000000180a94e00: je       0x180a94e55
0000000180a94e02: xor      edx, edx
0000000180a94e04: mov      rcx, rax
0000000180a94e07: call     0x180705b50 ; Torappu.Battle.Entity.get_isFrozen [66488]
0000000180a94e0c: test     al, al
0000000180a94e0e: je       0x180a94e30
0000000180a94e10: cmp      ebx, 0xe
0000000180a94e13: ja       0x180a94e1f
0000000180a94e15: mov      eax, 0x4330
0000000180a94e1a: bt       eax, ebx
0000000180a94e1d: jb       0x180a94e30
0000000180a94e1f: cmp      ebx, 0xa
0000000180a94e22: sete     al
0000000180a94e25: mov      rbx, qword ptr [rsp + 0x30]
0000000180a94e2a: add      rsp, 0x20
0000000180a94e2e: pop      rdi
0000000180a94e2f: ret      
0000000180a94e30: mov      al, 1
0000000180a94e32: mov      rbx, qword ptr [rsp + 0x30]
0000000180a94e37: add      rsp, 0x20
0000000180a94e3b: pop      rdi
0000000180a94e3c: ret      
0000000180a94e3d: xor      r9d, r9d
0000000180a94e40: mov      r8d, ebx
0000000180a94e43: mov      rdx, rdi
0000000180a94e46: mov      rbx, qword ptr [rsp + 0x30]
0000000180a94e4b: add      rsp, 0x20
0000000180a94e4f: pop      rdi
0000000180a94e50: jmp      0x183250150 ; XLua.DelegateBridge.__Gen_Delegate_Imp154 [2809]
0000000180a94e55: call     0x18048c0b0
0000000180a94e5a: int3     
0000000180a94e5b: int3     
0000000180a94e5c: int3     
0000000180a94e5d: int3     
0000000180a94e5e: int3     
0000000180a94e5f: int3     
