; Torappu.Battle.Enemy.TriggerEnemySkill metadata=76425 token=0x6012a8a VA=0x180a75770 RVA=0xa75770 size=0x310
0000000180a75770: mov      qword ptr [rsp + 8], rbx
0000000180a75775: mov      qword ptr [rsp + 0x10], rbp
0000000180a7577a: mov      qword ptr [rsp + 0x18], rdi
0000000180a7577f: push     r14
0000000180a75781: sub      rsp, 0x40
0000000180a75785: cmp      byte ptr [rip + 0x821d0e6], 0
0000000180a7578c: mov      rdi, r9
0000000180a7578f: mov      r14, r8
0000000180a75792: mov      rbp, rdx
0000000180a75795: mov      rbx, rcx
0000000180a75798: jne      0x180a757b9
0000000180a7579a: lea      rcx, [rip + 0x7da5f0f] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a757a1: call     0x18048bf00
0000000180a757a6: lea      rcx, [rip + 0x7e264fb] ; GenericMethodInfo 262831 @0x18889bca8
0000000180a757ad: call     0x18048bf00
0000000180a757b2: mov      byte ptr [rip + 0x821d0b9], 1
0000000180a757b9: mov      rax, qword ptr [rip + 0x7da5ef0] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a757c0: cmp      dword ptr [rax + 0xe0], 0
0000000180a757c7: jne      0x180a757d8
0000000180a757c9: mov      rcx, rax
0000000180a757cc: call     0x18048c140
0000000180a757d1: mov      rax, qword ptr [rip + 0x7da5ed8] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a757d8: mov      rax, qword ptr [rax + 0xb8]
0000000180a757df: mov      rcx, qword ptr [rax + 0x4d0]
0000000180a757e6: test     rcx, rcx
0000000180a757e9: jne      0x180a75a37
0000000180a757ef: xor      edx, edx
0000000180a757f1: mov      rcx, rbx
0000000180a757f4: call     0x180a7b540 ; Torappu.Battle.Enemy.get_attackWrapper [76386]
0000000180a757f9: test     rax, rax
0000000180a757fc: je       0x180a758aa
0000000180a75802: cmp      byte ptr [rip + 0x8256fe7], 0
0000000180a75809: jbe      0x180a75813
0000000180a7580b: mov      rcx, qword ptr [rbx]
0000000180a7580e: call     0x180446d00
0000000180a75813: mov      rdx, qword ptr [rbx]
0000000180a75816: mov      rcx, rbx
0000000180a75819: mov      rax, qword ptr [rdx + 0xae0]
0000000180a75820: mov      rdx, qword ptr [rdx + 0xae8]
0000000180a75827: call     rax
0000000180a75829: test     al, al
0000000180a7582b: je       0x180a758aa
0000000180a7582d: test     rdi, rdi
0000000180a75830: je       0x180a75a72
0000000180a75836: xor      r8d, r8d
0000000180a75839: xor      edx, edx
0000000180a7583b: mov      rcx, rdi
0000000180a7583e: call     0x1806dd7f0 ; Torappu.Battle.EnemySkill.CheckFamilyMask [66307]
0000000180a75843: test     al, al
0000000180a75845: je       0x180a758aa
0000000180a75847: xor      edx, edx
0000000180a75849: mov      rcx, rbx
0000000180a7584c: call     0x180a7b540 ; Torappu.Battle.Enemy.get_attackWrapper [76386]
0000000180a75851: test     rax, rax
0000000180a75854: je       0x180a75a72
0000000180a7585a: mov      r9, rdi
0000000180a7585d: mov      qword ptr [rsp + 0x20], 0
0000000180a75866: mov      r8, r14
0000000180a75869: mov      rdx, rbp
0000000180a7586c: mov      rcx, rax
0000000180a7586f: call     0x180a85d00 ; Torappu.Battle.Enemy.AttackWrapper.AssignAbility [76863]
0000000180a75874: xor      edx, edx
0000000180a75876: mov      rcx, rbx
0000000180a75879: call     0x180a7b540 ; Torappu.Battle.Enemy.get_attackWrapper [76386]
0000000180a7587e: test     rax, rax
0000000180a75881: je       0x180a75a72
0000000180a75887: lea      rdx, [rbx + 0x4f8]
0000000180a7588e: mov      qword ptr [rsp + 0x20], 0
0000000180a75897: mov      r9b, 1
0000000180a7589a: xor      r8d, r8d
0000000180a7589d: mov      rcx, rax
0000000180a758a0: call     0x180a85dc0 ; Torappu.Battle.Enemy.AttackWrapper.Cast [76861]
0000000180a758a5: jmp      0x180a75a5c
0000000180a758aa: xor      edx, edx
0000000180a758ac: mov      rcx, rbx
0000000180a758af: call     0x180a7bde0 ; Torappu.Battle.Enemy.get_combatWrapper [76388]
0000000180a758b4: test     rax, rax
0000000180a758b7: je       0x180a7595f
0000000180a758bd: cmp      byte ptr [rip + 0x8256f2c], 0
0000000180a758c4: jbe      0x180a758ce
0000000180a758c6: mov      rcx, qword ptr [rbx]
0000000180a758c9: call     0x180446d00
0000000180a758ce: mov      rdx, qword ptr [rbx]
0000000180a758d1: mov      rcx, rbx
0000000180a758d4: mov      rax, qword ptr [rdx + 0xaf0]
0000000180a758db: mov      rdx, qword ptr [rdx + 0xaf8]
0000000180a758e2: call     rax
0000000180a758e4: test     al, al
0000000180a758e6: je       0x180a7595f
0000000180a758e8: test     rdi, rdi
0000000180a758eb: je       0x180a75a72
0000000180a758f1: xor      r8d, r8d
0000000180a758f4: mov      edx, 1
0000000180a758f9: mov      rcx, rdi
0000000180a758fc: call     0x1806dd7f0 ; Torappu.Battle.EnemySkill.CheckFamilyMask [66307]
0000000180a75901: test     al, al
0000000180a75903: je       0x180a7595f
0000000180a75905: cmp      byte ptr [rsp + 0x70], 0
0000000180a7590a: je       0x180a7592d
0000000180a7590c: xor      edx, edx
0000000180a7590e: mov      rcx, rbx
0000000180a75911: call     0x180a7bde0 ; Torappu.Battle.Enemy.get_combatWrapper [76388]
0000000180a75916: test     rax, rax
0000000180a75919: je       0x180a75a72
0000000180a7591f: xor      r8d, r8d
0000000180a75922: mov      rdx, rbp
0000000180a75925: mov      rcx, rax
0000000180a75928: call     0x180a89a90 ; Torappu.Battle.Enemy.CombatWrapper.AssignAbility [76882]
0000000180a7592d: xor      edx, edx
0000000180a7592f: mov      rcx, rbx
0000000180a75932: call     0x180a7bde0 ; Torappu.Battle.Enemy.get_combatWrapper [76388]
0000000180a75937: test     rax, rax
0000000180a7593a: je       0x180a75a72
0000000180a75940: mov      r9, rdi
0000000180a75943: mov      qword ptr [rsp + 0x20], 0
0000000180a7594c: mov      r8, r14
0000000180a7594f: mov      rdx, rbp
0000000180a75952: mov      rcx, rax
0000000180a75955: call     0x180a89c40 ; Torappu.Battle.Enemy.CombatWrapper.CastWithAssignedSkill [76883]
0000000180a7595a: jmp      0x180a75a5c
0000000180a7595f: xor      edx, edx
0000000180a75961: mov      rcx, rbx
0000000180a75964: call     0x180a7b540 ; Torappu.Battle.Enemy.get_attackWrapper [76386]
0000000180a75969: test     rax, rax
0000000180a7596c: je       0x180a75a33
0000000180a75972: test     rdi, rdi
0000000180a75975: je       0x180a75a72
0000000180a7597b: xor      r8d, r8d
0000000180a7597e: xor      edx, edx
0000000180a75980: mov      rcx, rdi
0000000180a75983: call     0x1806dd7f0 ; Torappu.Battle.EnemySkill.CheckFamilyMask [66307]
0000000180a75988: test     al, al
0000000180a7598a: je       0x180a75a33
0000000180a75990: xor      edx, edx
0000000180a75992: mov      rcx, rbx
0000000180a75995: call     0x180a800c0 ; Torappu.Battle.Enemy.get_stateMachine [76373]
0000000180a7599a: test     rax, rax
0000000180a7599d: je       0x180a75a72
0000000180a759a3: cmp      qword ptr [rax + 0x50], 0
0000000180a759a8: je       0x180a75a33
0000000180a759ae: xor      edx, edx
0000000180a759b0: mov      rcx, rbx
0000000180a759b3: call     0x180a800c0 ; Torappu.Battle.Enemy.get_stateMachine [76373]
0000000180a759b8: test     rax, rax
0000000180a759bb: je       0x180a75a72
0000000180a759c1: mov      rcx, qword ptr [rax + 0x50]
0000000180a759c5: test     rcx, rcx
0000000180a759c8: je       0x180a75a72
0000000180a759ce: xor      r8d, r8d
0000000180a759d1: mov      edx, 2
0000000180a759d6: call     0x185c320a0
0000000180a759db: test     al, al
0000000180a759dd: je       0x180a75a33
0000000180a759df: xor      edx, edx
0000000180a759e1: mov      rcx, rbx
0000000180a759e4: call     0x180a7b540 ; Torappu.Battle.Enemy.get_attackWrapper [76386]
0000000180a759e9: test     rax, rax
0000000180a759ec: je       0x180a75a72
0000000180a759f2: mov      r9, rdi
0000000180a759f5: mov      qword ptr [rsp + 0x20], 0
0000000180a759fe: mov      r8, r14
0000000180a75a01: mov      rdx, rbp
0000000180a75a04: mov      rcx, rax
0000000180a75a07: call     0x180a85d00 ; Torappu.Battle.Enemy.AttackWrapper.AssignAbility [76863]
0000000180a75a0c: xor      edx, edx
0000000180a75a0e: mov      rcx, rbx
0000000180a75a11: call     0x180a800c0 ; Torappu.Battle.Enemy.get_stateMachine [76373]
0000000180a75a16: test     rax, rax
0000000180a75a19: je       0x180a75a72
0000000180a75a1b: mov      r8, qword ptr [rip + 0x7e26286] ; GenericMethodInfo 262831 @0x18889bca8
0000000180a75a22: mov      edx, 2
0000000180a75a27: mov      rcx, rax
0000000180a75a2a: call     0x18499c9d0
0000000180a75a2f: mov      al, 1
0000000180a75a31: jmp      0x180a75a5c
0000000180a75a33: xor      al, al
0000000180a75a35: jmp      0x180a75a5c
0000000180a75a37: movzx    eax, byte ptr [rsp + 0x70]
0000000180a75a3c: mov      r9, r14
0000000180a75a3f: mov      qword ptr [rsp + 0x30], 0
0000000180a75a48: mov      r8, rbp
0000000180a75a4b: mov      byte ptr [rsp + 0x28], al
0000000180a75a4f: mov      rdx, rbx
0000000180a75a52: mov      qword ptr [rsp + 0x20], rdi
0000000180a75a57: call     0x183332a60 ; XLua.DelegateBridge.__Gen_Delegate_Imp3018 [5673]
0000000180a75a5c: mov      rbx, qword ptr [rsp + 0x50]
0000000180a75a61: mov      rbp, qword ptr [rsp + 0x58]
0000000180a75a66: mov      rdi, qword ptr [rsp + 0x60]
0000000180a75a6b: add      rsp, 0x40
0000000180a75a6f: pop      r14
0000000180a75a71: ret      
0000000180a75a72: call     0x18048c0b0
0000000180a75a77: int3     
0000000180a75a78: int3     
0000000180a75a79: int3     
0000000180a75a7a: int3     
0000000180a75a7b: int3     
0000000180a75a7c: int3     
0000000180a75a7d: int3     
0000000180a75a7e: int3     
0000000180a75a7f: int3     
