; Torappu.Battle.Enemy.States.CombatState.OnTick metadata=76699 token=0x6012b9c VA=0x180a89650 RVA=0xa89650 size=0x390
0000000180a89650: mov      qword ptr [rsp + 0x10], rbx
0000000180a89655: push     rsi
0000000180a89656: sub      rsp, 0x20
0000000180a8965a: cmp      byte ptr [rip + 0x82092cb], 0
0000000180a89661: mov      rbx, rdx
0000000180a89664: mov      rsi, rcx
0000000180a89667: jne      0x180a896b8
0000000180a89669: lea      rcx, [rip + 0x7e9e6f0] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
0000000180a89670: call     0x18048bf00
0000000180a89675: lea      rcx, [rip + 0x7dfb1fc] ; TypeInfo Torappu.Battle.Enemy.States.CombatState @0x188884878
0000000180a8967c: call     0x18048bf00
0000000180a89681: lea      rcx, [rip + 0x7dd1078] ; TypeInfo Torappu.FP @0x18885a700
0000000180a89688: call     0x18048bf00
0000000180a8968d: lea      rcx, [rip + 0x7ea9654] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a89694: call     0x18048bf00
0000000180a89699: lea      rcx, [rip + 0x7ece040] ; GenericMethodInfo 282792 @0x1889576e0
0000000180a896a0: call     0x18048bf00
0000000180a896a5: lea      rcx, [rip + 0x7ece4b4] ; GenericMethodInfo 282794 @0x188957b60
0000000180a896ac: call     0x18048bf00
0000000180a896b1: mov      byte ptr [rip + 0x8209274], 1
0000000180a896b8: mov      rax, qword ptr [rip + 0x7dfb1b9] ; TypeInfo Torappu.Battle.Enemy.States.CombatState @0x188884878
0000000180a896bf: mov      rcx, qword ptr [rax + 0xb8]
0000000180a896c6: mov      rcx, qword ptr [rcx + 8]
0000000180a896ca: test     rcx, rcx
0000000180a896cd: jne      0x180a899b3
0000000180a896d3: mov      qword ptr [rsp + 0x30], rdi
0000000180a896d8: mov      rdx, qword ptr [rip + 0x7ece481] ; GenericMethodInfo 282794 @0x188957b60
0000000180a896df: mov      rcx, rsi
0000000180a896e2: call     0x18536e540
0000000180a896e7: test     rax, rax
0000000180a896ea: je       0x180a899cb
0000000180a896f0: xor      edx, edx
0000000180a896f2: mov      rcx, rax
0000000180a896f5: call     0x180705320 ; Torappu.Battle.Entity.get_isActuallyLevitate [66493]
0000000180a896fa: mov      rcx, rsi
0000000180a896fd: test     al, al
0000000180a896ff: jne      0x180a899a2
0000000180a89705: mov      rdx, qword ptr [rip + 0x7ece454] ; GenericMethodInfo 282794 @0x188957b60
0000000180a8970c: call     0x18536e540
0000000180a89711: test     rax, rax
0000000180a89714: je       0x180a899cb
0000000180a8971a: xor      edx, edx
0000000180a8971c: mov      rcx, rax
0000000180a8971f: call     0x180706a00 ; Torappu.Battle.Entity.get_isStunned [66486]
0000000180a89724: mov      rcx, rsi
0000000180a89727: test     al, al
0000000180a89729: jne      0x180a89991
0000000180a8972f: mov      rdx, qword ptr [rip + 0x7ece42a] ; GenericMethodInfo 282794 @0x188957b60
0000000180a89736: call     0x18536e540
0000000180a8973b: test     rax, rax
0000000180a8973e: je       0x180a899cb
0000000180a89744: xor      edx, edx
0000000180a89746: mov      rcx, rax
0000000180a89749: call     0x180705b50 ; Torappu.Battle.Entity.get_isFrozen [66488]
0000000180a8974e: mov      rcx, rsi
0000000180a89751: test     al, al
0000000180a89753: jne      0x180a89980
0000000180a89759: mov      rdx, qword ptr [rip + 0x7ece400] ; GenericMethodInfo 282794 @0x188957b60
0000000180a89760: call     0x18536e540
0000000180a89765: test     rax, rax
0000000180a89768: je       0x180a899cb
0000000180a8976e: xor      edx, edx
0000000180a89770: mov      rcx, rax
0000000180a89773: call     0x180706560 ; Torappu.Battle.Entity.get_isPalsying [66504]
0000000180a89778: mov      rcx, rsi
0000000180a8977b: test     al, al
0000000180a8977d: jne      0x180a8996f
0000000180a89783: mov      rdx, qword ptr [rip + 0x7ece3d6] ; GenericMethodInfo 282794 @0x188957b60
0000000180a8978a: call     0x18536e540
0000000180a8978f: test     rax, rax
0000000180a89792: je       0x180a899cb
0000000180a89798: xor      edx, edx
0000000180a8979a: mov      rcx, rax
0000000180a8979d: call     0x180a7bde0 ; Torappu.Battle.Enemy.get_combatWrapper [76388]
0000000180a897a2: test     rax, rax
0000000180a897a5: je       0x180a899cb
0000000180a897ab: xor      edx, edx
0000000180a897ad: mov      rcx, rax
0000000180a897b0: call     0x180a89f80 ; Torappu.Battle.Enemy.CombatWrapper.GetTarget [76877]
0000000180a897b5: mov      rdx, qword ptr [rip + 0x7ece3a4] ; GenericMethodInfo 282794 @0x188957b60
0000000180a897bc: mov      rcx, rsi
0000000180a897bf: mov      rdi, rax
0000000180a897c2: call     0x18536e540
0000000180a897c7: test     rax, rax
0000000180a897ca: je       0x180a899cb
0000000180a897d0: xor      edx, edx
0000000180a897d2: mov      rcx, rax
0000000180a897d5: call     0x180a7bd60 ; Torappu.Battle.Enemy.get_combatAbilityCasted [76294]
0000000180a897da: mov      rcx, qword ptr [rip + 0x7ea9507] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a897e1: mov      rbx, rax
0000000180a897e4: cmp      dword ptr [rcx + 0xe0], 0
0000000180a897eb: jne      0x180a897f2
0000000180a897ed: call     0x18048c140
0000000180a897f2: xor      r8d, r8d
0000000180a897f5: xor      edx, edx
0000000180a897f7: mov      rcx, rbx
0000000180a897fa: call     0x186b638d0
0000000180a897ff: test     al, al
0000000180a89801: jne      0x180a89840
0000000180a89803: mov      rdx, qword ptr [rip + 0x7ece356] ; GenericMethodInfo 282794 @0x188957b60
0000000180a8980a: mov      rcx, rsi
0000000180a8980d: call     0x18536e540
0000000180a89812: test     rax, rax
0000000180a89815: je       0x180a899cb
0000000180a8981b: xor      edx, edx
0000000180a8981d: mov      rcx, rax
0000000180a89820: call     0x180a7bd60 ; Torappu.Battle.Enemy.get_combatAbilityCasted [76294]
0000000180a89825: test     rax, rax
0000000180a89828: je       0x180a899cb
0000000180a8982e: xor      edx, edx
0000000180a89830: mov      rcx, rax
0000000180a89833: call     0x1805d7e90 ; Torappu.Battle.Ability.get_isCasting [63037]
0000000180a89838: test     al, al
0000000180a8983a: jne      0x180a898e3
0000000180a89840: mov      rcx, qword ptr [rip + 0x7ea94a1] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a89847: cmp      dword ptr [rcx + 0xe0], 0
0000000180a8984e: jne      0x180a89855
0000000180a89850: call     0x18048c140
0000000180a89855: xor      r8d, r8d
0000000180a89858: xor      edx, edx
0000000180a8985a: mov      rcx, rdi
0000000180a8985d: call     0x186b638d0
0000000180a89862: test     al, al
0000000180a89864: je       0x180a898f3
0000000180a8986a: mov      rcx, qword ptr [rip + 0x7e9e4ef] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
0000000180a89871: cmp      dword ptr [rcx + 0xe0], 0
0000000180a89878: jne      0x180a8987f
0000000180a8987a: call     0x18048c140
0000000180a8987f: xor      ecx, ecx
0000000180a89881: call     0x1806416e0 ; Torappu.Battle.BattleController.get_fixedPlayTime [64468]
0000000180a89886: mov      rdx, qword ptr [rip + 0x7ece2d3] ; GenericMethodInfo 282794 @0x188957b60
0000000180a8988d: mov      rcx, rsi
0000000180a89890: mov      rdi, rax
0000000180a89893: call     0x18536e540
0000000180a89898: test     rax, rax
0000000180a8989b: je       0x180a899cb
0000000180a898a1: mov      rcx, qword ptr [rip + 0x7dd0e58] ; TypeInfo Torappu.FP @0x18885a700
0000000180a898a8: mov      rbx, qword ptr [rax + 0x508]
0000000180a898af: cmp      dword ptr [rcx + 0xe0], 0
0000000180a898b6: jne      0x180a898bd
0000000180a898b8: call     0x18048c140
0000000180a898bd: xor      r8d, r8d
0000000180a898c0: mov      rdx, rbx
0000000180a898c3: mov      rcx, rdi
0000000180a898c6: call     0x185ed91b0
0000000180a898cb: test     al, al
0000000180a898cd: je       0x180a898f3
0000000180a898cf: mov      r8, qword ptr [rip + 0x7ecde0a] ; GenericMethodInfo 282792 @0x1889576e0
0000000180a898d6: mov      edx, 1
0000000180a898db: mov      rcx, rsi
0000000180a898de: call     0x18536e450
0000000180a898e3: mov      rdi, qword ptr [rsp + 0x30]
0000000180a898e8: mov      rbx, qword ptr [rsp + 0x38]
0000000180a898ed: add      rsp, 0x20
0000000180a898f1: pop      rsi
0000000180a898f2: ret      
0000000180a898f3: mov      rdx, qword ptr [rip + 0x7ece266] ; GenericMethodInfo 282794 @0x188957b60
0000000180a898fa: mov      rcx, rsi
0000000180a898fd: call     0x18536e540
0000000180a89902: test     rax, rax
0000000180a89905: je       0x180a899cb
0000000180a8990b: xor      edx, edx
0000000180a8990d: mov      rcx, rax
0000000180a89910: call     0x180a7bde0 ; Torappu.Battle.Enemy.get_combatWrapper [76388]
0000000180a89915: test     rax, rax
0000000180a89918: je       0x180a899cb
0000000180a8991e: xor      edx, edx
0000000180a89920: mov      rcx, rax
0000000180a89923: call     0x180a8a210 ; Torappu.Battle.Enemy.CombatWrapper.PickCombatAbility [76870]
0000000180a89928: test     al, al
0000000180a8992a: je       0x180a898e3
0000000180a8992c: mov      rdx, qword ptr [rip + 0x7ece22d] ; GenericMethodInfo 282794 @0x188957b60
0000000180a89933: mov      rcx, rsi
0000000180a89936: call     0x18536e540
0000000180a8993b: test     rax, rax
0000000180a8993e: je       0x180a899cb
0000000180a89944: xor      edx, edx
0000000180a89946: mov      rcx, rax
0000000180a89949: call     0x180a7bde0 ; Torappu.Battle.Enemy.get_combatWrapper [76388]
0000000180a8994e: test     rax, rax
0000000180a89951: je       0x180a899cb
0000000180a89953: xor      r8d, r8d
0000000180a89956: xor      edx, edx
0000000180a89958: mov      rcx, rax
0000000180a8995b: mov      rdi, qword ptr [rsp + 0x30]
0000000180a89960: mov      rbx, qword ptr [rsp + 0x38]
0000000180a89965: add      rsp, 0x20
0000000180a89969: pop      rsi
0000000180a8996a: jmp      0x180a8a090 ; Torappu.Battle.Enemy.CombatWrapper.NextCombatOrExit [76878]
0000000180a8996f: mov      r8, qword ptr [rip + 0x7ecdd6a] ; GenericMethodInfo 282792 @0x1889576e0
0000000180a89976: mov      edx, 0x10
0000000180a8997b: jmp      0x180a898de
0000000180a89980: mov      r8, qword ptr [rip + 0x7ecdd59] ; GenericMethodInfo 282792 @0x1889576e0
0000000180a89987: mov      edx, 0xd
0000000180a8998c: jmp      0x180a898de
0000000180a89991: mov      r8, qword ptr [rip + 0x7ecdd48] ; GenericMethodInfo 282792 @0x1889576e0
0000000180a89998: mov      edx, 4
0000000180a8999d: jmp      0x180a898de
0000000180a899a2: mov      r8, qword ptr [rip + 0x7ecdd37] ; GenericMethodInfo 282792 @0x1889576e0
0000000180a899a9: mov      edx, 0xe
0000000180a899ae: jmp      0x180a898de
0000000180a899b3: xor      r9d, r9d
0000000180a899b6: mov      r8, rbx
0000000180a899b9: mov      rdx, rsi
0000000180a899bc: mov      rbx, qword ptr [rsp + 0x38]
0000000180a899c1: add      rsp, 0x20
0000000180a899c5: pop      rsi
0000000180a899c6: jmp      0x1833f9830 ; XLua.DelegateBridge.__Gen_Delegate_Imp427 [3082]
0000000180a899cb: call     0x18048c0b0
0000000180a899d0: int3     
0000000180a899d1: int3     
0000000180a899d2: int3     
0000000180a899d3: int3     
0000000180a899d4: int3     
0000000180a899d5: int3     
0000000180a899d6: int3     
0000000180a899d7: int3     
0000000180a899d8: int3     
0000000180a899d9: int3     
0000000180a899da: int3     
0000000180a899db: int3     
0000000180a899dc: int3     
0000000180a899dd: int3     
0000000180a899de: int3     
0000000180a899df: int3     