; Torappu.Battle.Enemy.States.AttackState.OnExit metadata=76663 token=0x6012b78 VA=0x180a85850 RVA=0xa85850 size=0x140
0000000180a85850: mov      qword ptr [rsp + 8], rbx
0000000180a85855: push     rdi
0000000180a85856: sub      rsp, 0x20
0000000180a8585a: cmp      byte ptr [rip + 0x820d0b5], 0
0000000180a85861: mov      ebx, edx
0000000180a85863: mov      rdi, rcx
0000000180a85866: jne      0x180a85893
0000000180a85868: lea      rcx, [rip + 0x7dfe4e1] ; TypeInfo Torappu.Battle.Enemy.States.AttackState @0x188883d50
0000000180a8586f: call     0x18048bf00
0000000180a85874: lea      rcx, [rip + 0x7ead46d] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a8587b: call     0x18048bf00
0000000180a85880: lea      rcx, [rip + 0x7ed22d9] ; GenericMethodInfo 282794 @0x188957b60
0000000180a85887: call     0x18048bf00
0000000180a8588c: mov      byte ptr [rip + 0x820d083], 1
0000000180a85893: mov      rax, qword ptr [rip + 0x7dfe4b6] ; TypeInfo Torappu.Battle.Enemy.States.AttackState @0x188883d50
0000000180a8589a: mov      rcx, qword ptr [rax + 0xb8]
0000000180a858a1: mov      rcx, qword ptr [rcx + 0x10]
0000000180a858a5: test     rcx, rcx
0000000180a858a8: jne      0x180a8596f
0000000180a858ae: mov      rdx, qword ptr [rip + 0x7ed22ab] ; GenericMethodInfo 282794 @0x188957b60
0000000180a858b5: mov      rcx, rdi
0000000180a858b8: call     0x18536e540
0000000180a858bd: test     rax, rax
0000000180a858c0: je       0x180a85987
0000000180a858c6: xor      edx, edx
0000000180a858c8: mov      rcx, rax
0000000180a858cb: call     0x180a7b4c0 ; Torappu.Battle.Enemy.get_attackAbilityCasted [76293]
0000000180a858d0: mov      rcx, qword ptr [rip + 0x7ead411] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a858d7: mov      rbx, rax
0000000180a858da: cmp      dword ptr [rcx + 0xe0], 0
0000000180a858e1: jne      0x180a858e8
0000000180a858e3: call     0x18048c140
0000000180a858e8: xor      r8d, r8d
0000000180a858eb: xor      edx, edx
0000000180a858ed: mov      rcx, rbx
0000000180a858f0: call     0x186b63a70
0000000180a858f5: test     al, al
0000000180a858f7: je       0x180a85947
0000000180a858f9: mov      rdx, qword ptr [rip + 0x7ed2260] ; GenericMethodInfo 282794 @0x188957b60
0000000180a85900: mov      rcx, rdi
0000000180a85903: call     0x18536e540
0000000180a85908: test     rax, rax
0000000180a8590b: je       0x180a85987
0000000180a8590d: xor      edx, edx
0000000180a8590f: mov      rcx, rax
0000000180a85912: call     0x180a7b4c0 ; Torappu.Battle.Enemy.get_attackAbilityCasted [76293]
0000000180a85917: mov      rbx, rax
0000000180a8591a: test     rax, rax
0000000180a8591d: je       0x180a85987
0000000180a8591f: cmp      byte ptr [rip + 0x8246eca], 0
0000000180a85926: jbe      0x180a85930
0000000180a85928: mov      rcx, qword ptr [rax]
0000000180a8592b: call     0x180446d00
0000000180a85930: mov      rdx, qword ptr [rbx]
0000000180a85933: mov      rcx, rbx
0000000180a85936: mov      r8, qword ptr [rdx + 0x380]
0000000180a8593d: mov      rdx, qword ptr [rdx + 0x388]
0000000180a85944: call     r8
0000000180a85947: mov      rdx, qword ptr [rip + 0x7ed2212] ; GenericMethodInfo 282794 @0x188957b60
0000000180a8594e: mov      rcx, rdi
0000000180a85951: call     0x18536e540
0000000180a85956: test     rax, rax
0000000180a85959: je       0x180a85987
0000000180a8595b: xor      edx, edx
0000000180a8595d: mov      rcx, rax
0000000180a85960: mov      rbx, qword ptr [rsp + 0x30]
0000000180a85965: add      rsp, 0x20
0000000180a85969: pop      rdi
0000000180a8596a: jmp      0x180aca550 ; Torappu.Battle.Unit.OnFinishAttack [77688]
0000000180a8596f: xor      r9d, r9d
0000000180a85972: mov      r8d, ebx
0000000180a85975: mov      rdx, rdi
0000000180a85978: mov      rbx, qword ptr [rsp + 0x30]
0000000180a8597d: add      rsp, 0x20
0000000180a85981: pop      rdi
0000000180a85982: jmp      0x1834c0e30 ; XLua.DelegateBridge.__Gen_Delegate_Imp55 [2710]
0000000180a85987: call     0x18048c0b0
0000000180a8598c: int3     
0000000180a8598d: int3     
0000000180a8598e: int3     
0000000180a8598f: int3     
