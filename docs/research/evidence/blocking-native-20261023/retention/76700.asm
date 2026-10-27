; Torappu.Battle.Enemy.States.CombatState.OnExit metadata=76700 token=0x6012b9d VA=0x180a89530 RVA=0xa89530 size=0x120
0000000180a89530: mov      qword ptr [rsp + 8], rbx
0000000180a89535: push     rdi
0000000180a89536: sub      rsp, 0x20
0000000180a8953a: cmp      byte ptr [rip + 0x82093ec], 0
0000000180a89541: mov      edi, edx
0000000180a89543: mov      rbx, rcx
0000000180a89546: jne      0x180a89573
0000000180a89548: lea      rcx, [rip + 0x7dfb329] ; TypeInfo Torappu.Battle.Enemy.States.CombatState @0x188884878
0000000180a8954f: call     0x18048bf00
0000000180a89554: lea      rcx, [rip + 0x7ea978d] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a8955b: call     0x18048bf00
0000000180a89560: lea      rcx, [rip + 0x7ece5f9] ; GenericMethodInfo 282794 @0x188957b60
0000000180a89567: call     0x18048bf00
0000000180a8956c: mov      byte ptr [rip + 0x82093ba], 1
0000000180a89573: mov      rax, qword ptr [rip + 0x7dfb2fe] ; TypeInfo Torappu.Battle.Enemy.States.CombatState @0x188884878
0000000180a8957a: mov      rcx, qword ptr [rax + 0xb8]
0000000180a89581: mov      rcx, qword ptr [rcx + 0x10]
0000000180a89585: test     rcx, rcx
0000000180a89588: jne      0x180a89631
0000000180a8958e: mov      rdx, qword ptr [rip + 0x7ece5cb] ; GenericMethodInfo 282794 @0x188957b60
0000000180a89595: mov      rcx, rbx
0000000180a89598: call     0x18536e540
0000000180a8959d: test     rax, rax
0000000180a895a0: je       0x180a8964a
0000000180a895a6: xor      edx, edx
0000000180a895a8: mov      rcx, rax
0000000180a895ab: call     0x180a7bd60 ; Torappu.Battle.Enemy.get_combatAbilityCasted [76294]
0000000180a895b0: mov      rcx, qword ptr [rip + 0x7ea9731] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a895b7: mov      rdi, rax
0000000180a895ba: cmp      dword ptr [rcx + 0xe0], 0
0000000180a895c1: jne      0x180a895c8
0000000180a895c3: call     0x18048c140
0000000180a895c8: xor      r8d, r8d
0000000180a895cb: xor      edx, edx
0000000180a895cd: mov      rcx, rdi
0000000180a895d0: call     0x186b63a70
0000000180a895d5: test     al, al
0000000180a895d7: je       0x180a8963f
0000000180a895d9: mov      rdx, qword ptr [rip + 0x7ece580] ; GenericMethodInfo 282794 @0x188957b60
0000000180a895e0: mov      rcx, rbx
0000000180a895e3: call     0x18536e540
0000000180a895e8: test     rax, rax
0000000180a895eb: je       0x180a8964a
0000000180a895ed: xor      edx, edx
0000000180a895ef: mov      rcx, rax
0000000180a895f2: call     0x180a7bd60 ; Torappu.Battle.Enemy.get_combatAbilityCasted [76294]
0000000180a895f7: mov      rbx, rax
0000000180a895fa: test     rax, rax
0000000180a895fd: je       0x180a8964a
0000000180a895ff: cmp      byte ptr [rip + 0x82431ea], 0
0000000180a89606: jbe      0x180a89610
0000000180a89608: mov      rcx, qword ptr [rax]
0000000180a8960b: call     0x180446d00
0000000180a89610: mov      rdx, qword ptr [rbx]
0000000180a89613: mov      rcx, rbx
0000000180a89616: mov      r8, qword ptr [rdx + 0x380]
0000000180a8961d: mov      rdx, qword ptr [rdx + 0x388]
0000000180a89624: mov      rbx, qword ptr [rsp + 0x30]
0000000180a89629: add      rsp, 0x20
0000000180a8962d: pop      rdi
0000000180a8962e: jmp      r8
0000000180a89631: xor      r9d, r9d
0000000180a89634: mov      r8d, edi
0000000180a89637: mov      rdx, rbx
0000000180a8963a: call     0x1834c0e30 ; XLua.DelegateBridge.__Gen_Delegate_Imp55 [2710]
0000000180a8963f: mov      rbx, qword ptr [rsp + 0x30]
0000000180a89644: add      rsp, 0x20
0000000180a89648: pop      rdi
0000000180a89649: ret      
0000000180a8964a: call     0x18048c0b0
0000000180a8964f: int3     