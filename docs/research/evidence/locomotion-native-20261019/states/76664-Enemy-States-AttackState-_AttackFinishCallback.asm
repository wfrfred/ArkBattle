; Torappu.Battle.Enemy.States.AttackState._AttackFinishCallback metadata=76664 token=0x6012b79 VA=0x180a85b80 RVA=0xa85b80 size=0xd0
0000000180a85b80: mov      qword ptr [rsp + 8], rbx
0000000180a85b85: mov      qword ptr [rsp + 0x10], rbp
0000000180a85b8a: mov      qword ptr [rsp + 0x18], rsi
0000000180a85b8f: push     rdi
0000000180a85b90: sub      rsp, 0x30
0000000180a85b94: cmp      byte ptr [rip + 0x820cd7c], 0
0000000180a85b9b: movzx    ebp, r9b
0000000180a85b9f: mov      edi, r8d
0000000180a85ba2: mov      rsi, rdx
0000000180a85ba5: mov      rbx, rcx
0000000180a85ba8: jne      0x180a85bc9
0000000180a85baa: lea      rcx, [rip + 0x7dfe19f] ; TypeInfo Torappu.Battle.Enemy.States.AttackState @0x188883d50
0000000180a85bb1: call     0x18048bf00
0000000180a85bb6: lea      rcx, [rip + 0x7ed1fa3] ; GenericMethodInfo 282794 @0x188957b60
0000000180a85bbd: call     0x18048bf00
0000000180a85bc2: mov      byte ptr [rip + 0x820cd4e], 1
0000000180a85bc9: mov      rax, qword ptr [rip + 0x7dfe180] ; TypeInfo Torappu.Battle.Enemy.States.AttackState @0x188883d50
0000000180a85bd0: mov      r8, qword ptr [rax + 0xb8]
0000000180a85bd7: mov      rcx, qword ptr [r8 + 0x18]
0000000180a85bdb: test     rcx, rcx
0000000180a85bde: jne      0x180a85c10
0000000180a85be0: mov      rdx, qword ptr [rip + 0x7ed1f79] ; GenericMethodInfo 282794 @0x188957b60
0000000180a85be7: mov      rcx, rbx
0000000180a85bea: call     0x18536e540
0000000180a85bef: test     rax, rax
0000000180a85bf2: je       0x180a85c41
0000000180a85bf4: mov      r9d, edi
0000000180a85bf7: mov      qword ptr [rsp + 0x20], 0
0000000180a85c00: xor      r8d, r8d
0000000180a85c03: mov      rdx, rsi
0000000180a85c06: mov      rcx, rax
0000000180a85c09: call     0x180a6f620 ; Torappu.Battle.Enemy.OnAfterAttack [76535]
0000000180a85c0e: jmp      0x180a85c2c
0000000180a85c10: mov      qword ptr [rsp + 0x28], 0
0000000180a85c19: mov      r9d, edi
0000000180a85c1c: mov      r8, rsi
0000000180a85c1f: mov      byte ptr [rsp + 0x20], bpl
0000000180a85c24: mov      rdx, rbx
0000000180a85c27: call     0x1833331b0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3021 [5676]
0000000180a85c2c: mov      rbx, qword ptr [rsp + 0x40]
0000000180a85c31: mov      rbp, qword ptr [rsp + 0x48]
0000000180a85c36: mov      rsi, qword ptr [rsp + 0x50]
0000000180a85c3b: add      rsp, 0x30
0000000180a85c3f: pop      rdi
0000000180a85c40: ret      
0000000180a85c41: call     0x18048c0b0
0000000180a85c46: int3     
0000000180a85c47: int3     
0000000180a85c48: int3     
0000000180a85c49: int3     
0000000180a85c4a: int3     
0000000180a85c4b: int3     
0000000180a85c4c: int3     
0000000180a85c4d: int3     
0000000180a85c4e: int3     
0000000180a85c4f: int3     
