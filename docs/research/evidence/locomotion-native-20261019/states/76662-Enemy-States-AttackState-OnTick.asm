; Torappu.Battle.Enemy.States.AttackState.OnTick metadata=76662 token=0x6012b77 VA=0x180a85990 RVA=0xa85990 size=0x1f0
0000000180a85990: mov      qword ptr [rsp + 8], rbx
0000000180a85995: push     rdi
0000000180a85996: sub      rsp, 0x20
0000000180a8599a: cmp      byte ptr [rip + 0x820cf74], 0
0000000180a859a1: mov      rbx, rdx
0000000180a859a4: mov      rdi, rcx
0000000180a859a7: jne      0x180a859d4
0000000180a859a9: lea      rcx, [rip + 0x7dfe3a0] ; TypeInfo Torappu.Battle.Enemy.States.AttackState @0x188883d50
0000000180a859b0: call     0x18048bf00
0000000180a859b5: lea      rcx, [rip + 0x7ed1d24] ; GenericMethodInfo 282792 @0x1889576e0
0000000180a859bc: call     0x18048bf00
0000000180a859c1: lea      rcx, [rip + 0x7ed2198] ; GenericMethodInfo 282794 @0x188957b60
0000000180a859c8: call     0x18048bf00
0000000180a859cd: mov      byte ptr [rip + 0x820cf41], 1
0000000180a859d4: mov      rax, qword ptr [rip + 0x7dfe375] ; TypeInfo Torappu.Battle.Enemy.States.AttackState @0x188883d50
0000000180a859db: mov      rcx, qword ptr [rax + 0xb8]
0000000180a859e2: mov      rcx, qword ptr [rcx + 8]
0000000180a859e6: test     rcx, rcx
0000000180a859e9: jne      0x180a85b5a
0000000180a859ef: mov      rdx, qword ptr [rip + 0x7ed216a] ; GenericMethodInfo 282794 @0x188957b60
0000000180a859f6: mov      rcx, rdi
0000000180a859f9: call     0x18536e540
0000000180a859fe: test     rax, rax
0000000180a85a01: je       0x180a85b73
0000000180a85a07: xor      edx, edx
0000000180a85a09: mov      rcx, rax
0000000180a85a0c: call     0x180705320 ; Torappu.Battle.Entity.get_isActuallyLevitate [66493]
0000000180a85a11: mov      rcx, rdi
0000000180a85a14: test     al, al
0000000180a85a16: jne      0x180a85b3f
0000000180a85a1c: mov      rdx, qword ptr [rip + 0x7ed213d] ; GenericMethodInfo 282794 @0x188957b60
0000000180a85a23: call     0x18536e540
0000000180a85a28: test     rax, rax
0000000180a85a2b: je       0x180a85b73
0000000180a85a31: xor      edx, edx
0000000180a85a33: mov      rcx, rax
0000000180a85a36: call     0x180706a00 ; Torappu.Battle.Entity.get_isStunned [66486]
0000000180a85a3b: mov      rcx, rdi
0000000180a85a3e: test     al, al
0000000180a85a40: jne      0x180a85b24
0000000180a85a46: mov      rdx, qword ptr [rip + 0x7ed2113] ; GenericMethodInfo 282794 @0x188957b60
0000000180a85a4d: call     0x18536e540
0000000180a85a52: test     rax, rax
0000000180a85a55: je       0x180a85b73
0000000180a85a5b: xor      edx, edx
0000000180a85a5d: mov      rcx, rax
0000000180a85a60: call     0x180705b50 ; Torappu.Battle.Entity.get_isFrozen [66488]
0000000180a85a65: mov      rcx, rdi
0000000180a85a68: test     al, al
0000000180a85a6a: jne      0x180a85b09
0000000180a85a70: mov      rdx, qword ptr [rip + 0x7ed20e9] ; GenericMethodInfo 282794 @0x188957b60
0000000180a85a77: call     0x18536e540
0000000180a85a7c: test     rax, rax
0000000180a85a7f: je       0x180a85b73
0000000180a85a85: xor      edx, edx
0000000180a85a87: mov      rcx, rax
0000000180a85a8a: call     0x180706560 ; Torappu.Battle.Entity.get_isPalsying [66504]
0000000180a85a8f: mov      rcx, rdi
0000000180a85a92: test     al, al
0000000180a85a94: jne      0x180a85aee
0000000180a85a96: mov      rdx, qword ptr [rip + 0x7ed20c3] ; GenericMethodInfo 282794 @0x188957b60
0000000180a85a9d: call     0x18536e540
0000000180a85aa2: test     rax, rax
0000000180a85aa5: je       0x180a85b73
0000000180a85aab: xor      edx, edx
0000000180a85aad: mov      rcx, rax
0000000180a85ab0: call     0x180a7b4c0 ; Torappu.Battle.Enemy.get_attackAbilityCasted [76293]
0000000180a85ab5: test     rax, rax
0000000180a85ab8: je       0x180a85b73
0000000180a85abe: xor      edx, edx
0000000180a85ac0: mov      rcx, rax
0000000180a85ac3: call     0x1805d7e90 ; Torappu.Battle.Ability.get_isCasting [63037]
0000000180a85ac8: test     al, al
0000000180a85aca: jne      0x180a85b68
0000000180a85ad0: mov      r8, qword ptr [rip + 0x7ed1c09] ; GenericMethodInfo 282792 @0x1889576e0
0000000180a85ad7: mov      edx, 1
0000000180a85adc: mov      rcx, rdi
0000000180a85adf: mov      rbx, qword ptr [rsp + 0x30]
0000000180a85ae4: add      rsp, 0x20
0000000180a85ae8: pop      rdi
0000000180a85ae9: jmp      0x18536e450
0000000180a85aee: mov      r8, qword ptr [rip + 0x7ed1beb] ; GenericMethodInfo 282792 @0x1889576e0
0000000180a85af5: mov      edx, 0x10
0000000180a85afa: mov      rbx, qword ptr [rsp + 0x30]
0000000180a85aff: add      rsp, 0x20
0000000180a85b03: pop      rdi
0000000180a85b04: jmp      0x18536e450
0000000180a85b09: mov      r8, qword ptr [rip + 0x7ed1bd0] ; GenericMethodInfo 282792 @0x1889576e0
0000000180a85b10: mov      edx, 0xd
0000000180a85b15: mov      rbx, qword ptr [rsp + 0x30]
0000000180a85b1a: add      rsp, 0x20
0000000180a85b1e: pop      rdi
0000000180a85b1f: jmp      0x18536e450
0000000180a85b24: mov      r8, qword ptr [rip + 0x7ed1bb5] ; GenericMethodInfo 282792 @0x1889576e0
0000000180a85b2b: mov      edx, 4
0000000180a85b30: mov      rbx, qword ptr [rsp + 0x30]
0000000180a85b35: add      rsp, 0x20
0000000180a85b39: pop      rdi
0000000180a85b3a: jmp      0x18536e450
0000000180a85b3f: mov      r8, qword ptr [rip + 0x7ed1b9a] ; GenericMethodInfo 282792 @0x1889576e0
0000000180a85b46: mov      edx, 0xe
0000000180a85b4b: mov      rbx, qword ptr [rsp + 0x30]
0000000180a85b50: add      rsp, 0x20
0000000180a85b54: pop      rdi
0000000180a85b55: jmp      0x18536e450
0000000180a85b5a: xor      r9d, r9d
0000000180a85b5d: mov      r8, rbx
0000000180a85b60: mov      rdx, rdi
0000000180a85b63: call     0x1833f9830 ; XLua.DelegateBridge.__Gen_Delegate_Imp427 [3082]
0000000180a85b68: mov      rbx, qword ptr [rsp + 0x30]
0000000180a85b6d: add      rsp, 0x20
0000000180a85b71: pop      rdi
0000000180a85b72: ret      
0000000180a85b73: call     0x18048c0b0
0000000180a85b78: int3     
0000000180a85b79: int3     
0000000180a85b7a: int3     
0000000180a85b7b: int3     
0000000180a85b7c: int3     
0000000180a85b7d: int3     
0000000180a85b7e: int3     
0000000180a85b7f: int3     
