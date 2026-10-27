; Torappu.Battle.Enemy.States.CombatState.OnEnter metadata=76698 token=0x6012b9b VA=0x180a89320 RVA=0xa89320 size=0x210
0000000180a89320: mov      qword ptr [rsp + 0x10], rbx
0000000180a89325: push     rdi
0000000180a89326: sub      rsp, 0x30
0000000180a8932a: cmp      byte ptr [rip + 0x82095fa], 0
0000000180a89331: mov      edi, edx
0000000180a89333: mov      rbx, rcx
0000000180a89336: jne      0x180a8937b
0000000180a89338: lea      rcx, [rip + 0x7dfb539] ; TypeInfo Torappu.Battle.Enemy.States.CombatState @0x188884878
0000000180a8933f: call     0x18048bf00
0000000180a89344: lea      rcx, [rip + 0x7ea999d] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a8934b: call     0x18048bf00
0000000180a89350: lea      rcx, [rip + 0x7ece389] ; GenericMethodInfo 282792 @0x1889576e0
0000000180a89357: call     0x18048bf00
0000000180a8935c: lea      rcx, [rip + 0x7ece7fd] ; GenericMethodInfo 282794 @0x188957b60
0000000180a89363: call     0x18048bf00
0000000180a89368: lea      rcx, [rip + 0x7eaf339] ; StringLiteral 'Idle' @0x1889386a8
0000000180a8936f: call     0x18048bf00
0000000180a89374: mov      byte ptr [rip + 0x82095b0], 1
0000000180a8937b: mov      rax, qword ptr [rip + 0x7dfb4f6] ; TypeInfo Torappu.Battle.Enemy.States.CombatState @0x188884878
0000000180a89382: mov      rcx, qword ptr [rax + 0xb8]
0000000180a89389: mov      rcx, qword ptr [rcx]
0000000180a8938c: test     rcx, rcx
0000000180a8938f: jne      0x180a89512
0000000180a89395: mov      rdx, qword ptr [rip + 0x7ece7c4] ; GenericMethodInfo 282794 @0x188957b60
0000000180a8939c: mov      rcx, rbx
0000000180a8939f: call     0x18536e540
0000000180a893a4: test     rax, rax
0000000180a893a7: je       0x180a8952a
0000000180a893ad: xor      edx, edx
0000000180a893af: mov      rcx, rax
0000000180a893b2: call     0x180a7bde0 ; Torappu.Battle.Enemy.get_combatWrapper [76388]
0000000180a893b7: test     rax, rax
0000000180a893ba: je       0x180a8952a
0000000180a893c0: xor      edx, edx
0000000180a893c2: mov      rcx, rax
0000000180a893c5: call     0x180a89f80 ; Torappu.Battle.Enemy.CombatWrapper.GetTarget [76877]
0000000180a893ca: mov      rcx, qword ptr [rip + 0x7ea9917] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a893d1: mov      rdi, rax
0000000180a893d4: cmp      dword ptr [rcx + 0xe0], 0
0000000180a893db: jne      0x180a893e2
0000000180a893dd: call     0x18048c140
0000000180a893e2: xor      r8d, r8d
0000000180a893e5: xor      edx, edx
0000000180a893e7: mov      rcx, rdi
0000000180a893ea: call     0x186b638d0
0000000180a893ef: mov      rcx, rbx
0000000180a893f2: test     al, al
0000000180a893f4: jne      0x180a894f7
0000000180a893fa: mov      rdx, qword ptr [rip + 0x7ece75f] ; GenericMethodInfo 282794 @0x188957b60
0000000180a89401: call     0x18536e540
0000000180a89406: mov      rdi, rax
0000000180a89409: test     rax, rax
0000000180a8940c: je       0x180a8952a
0000000180a89412: cmp      byte ptr [rip + 0x82433d7], 0
0000000180a89419: mov      qword ptr [rsp + 0x40], rsi
0000000180a8941e: mov      rsi, qword ptr [rip + 0x7eaf283] ; StringLiteral 'Idle' @0x1889386a8
0000000180a89425: jbe      0x180a8942f
0000000180a89427: mov      rcx, qword ptr [rax]
0000000180a8942a: call     0x180446d00
0000000180a8942f: mov      rax, qword ptr [rdi]
0000000180a89432: xor      r8d, r8d
0000000180a89435: movss    xmm3, dword ptr [rip + 0x63b67a3]
0000000180a8943d: mov      rdx, rsi
0000000180a89440: mov      rcx, rdi
0000000180a89443: mov      r9, qword ptr [rax + 0x7b0]
0000000180a8944a: mov      rax, qword ptr [rax + 0x7b8]
0000000180a89451: mov      qword ptr [rsp + 0x28], rax
0000000180a89456: mov      byte ptr [rsp + 0x20], 0
0000000180a8945b: call     r9
0000000180a8945e: mov      rdx, qword ptr [rip + 0x7ece6fb] ; GenericMethodInfo 282794 @0x188957b60
0000000180a89465: mov      rcx, rbx
0000000180a89468: call     0x18536e540
0000000180a8946d: mov      rsi, qword ptr [rsp + 0x40]
0000000180a89472: test     rax, rax
0000000180a89475: je       0x180a8952a
0000000180a8947b: xor      edx, edx
0000000180a8947d: mov      rcx, rax
0000000180a89480: call     0x180a7bde0 ; Torappu.Battle.Enemy.get_combatWrapper [76388]
0000000180a89485: test     rax, rax
0000000180a89488: je       0x180a8952a
0000000180a8948e: xor      edx, edx
0000000180a89490: mov      rcx, rax
0000000180a89493: call     0x180a8a210 ; Torappu.Battle.Enemy.CombatWrapper.PickCombatAbility [76870]
0000000180a89498: mov      rdx, qword ptr [rip + 0x7ece6c1] ; GenericMethodInfo 282794 @0x188957b60
0000000180a8949f: mov      rcx, rbx
0000000180a894a2: test     al, al
0000000180a894a4: jne      0x180a894c7
0000000180a894a6: call     0x18536e540
0000000180a894ab: test     rax, rax
0000000180a894ae: je       0x180a8952a
0000000180a894b0: xor      r8d, r8d
0000000180a894b3: xor      edx, edx
0000000180a894b5: mov      rcx, rax
0000000180a894b8: mov      rbx, qword ptr [rsp + 0x48]
0000000180a894bd: add      rsp, 0x30
0000000180a894c1: pop      rdi
0000000180a894c2: jmp      0x180a80d10 ; Torappu.Battle.Enemy.set_combatAbilityCasted [76295]
0000000180a894c7: call     0x18536e540
0000000180a894cc: test     rax, rax
0000000180a894cf: je       0x180a8952a
0000000180a894d1: xor      edx, edx
0000000180a894d3: mov      rcx, rax
0000000180a894d6: call     0x180a7bde0 ; Torappu.Battle.Enemy.get_combatWrapper [76388]
0000000180a894db: test     rax, rax
0000000180a894de: je       0x180a8952a
0000000180a894e0: xor      r8d, r8d
0000000180a894e3: mov      dl, 1
0000000180a894e5: mov      rcx, rax
0000000180a894e8: mov      rbx, qword ptr [rsp + 0x48]
0000000180a894ed: add      rsp, 0x30
0000000180a894f1: pop      rdi
0000000180a894f2: jmp      0x180a8a090 ; Torappu.Battle.Enemy.CombatWrapper.NextCombatOrExit [76878]
0000000180a894f7: mov      r8, qword ptr [rip + 0x7ece1e2] ; GenericMethodInfo 282792 @0x1889576e0
0000000180a894fe: mov      edx, 1
0000000180a89503: mov      rbx, qword ptr [rsp + 0x48]
0000000180a89508: add      rsp, 0x30
0000000180a8950c: pop      rdi
0000000180a8950d: jmp      0x18536e450
0000000180a89512: xor      r9d, r9d
0000000180a89515: mov      r8d, edi
0000000180a89518: mov      rdx, rbx
0000000180a8951b: mov      rbx, qword ptr [rsp + 0x48]
0000000180a89520: add      rsp, 0x30
0000000180a89524: pop      rdi
0000000180a89525: jmp      0x1834c0e30 ; XLua.DelegateBridge.__Gen_Delegate_Imp55 [2710]
0000000180a8952a: call     0x18048c0b0
0000000180a8952f: int3     