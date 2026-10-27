; Torappu.Battle.Enemy.States.AttackState.OnEnter metadata=76661 token=0x6012b76 VA=0x180a85670 RVA=0xa85670 size=0x1e0
0000000180a85670: mov      qword ptr [rsp + 0x18], rbx
0000000180a85675: push     rdi
0000000180a85676: sub      rsp, 0x30
0000000180a8567a: cmp      byte ptr [rip + 0x820d293], 0
0000000180a85681: mov      edi, edx
0000000180a85683: mov      rbx, rcx
0000000180a85686: jne      0x180a856cb
0000000180a85688: lea      rcx, [rip + 0x7ed6c41] ; MethodInfo Torappu.Battle.Enemy.States.AttackState._AttackFinishCallback [76664] @0x18895c2d0
0000000180a8568f: call     0x18048bf00
0000000180a85694: lea      rcx, [rip + 0x7dfe6b5] ; TypeInfo Torappu.Battle.Enemy.States.AttackState @0x188883d50
0000000180a8569b: call     0x18048bf00
0000000180a856a0: lea      rcx, [rip + 0x7e1b591] ; TypeInfo Torappu.Battle.Ability.FinishCallbackDelegate @0x1888a0c38
0000000180a856a7: call     0x18048bf00
0000000180a856ac: lea      rcx, [rip + 0x7ed202d] ; GenericMethodInfo 282792 @0x1889576e0
0000000180a856b3: call     0x18048bf00
0000000180a856b8: lea      rcx, [rip + 0x7ed24a1] ; GenericMethodInfo 282794 @0x188957b60
0000000180a856bf: call     0x18048bf00
0000000180a856c4: mov      byte ptr [rip + 0x820d249], 1
0000000180a856cb: mov      rax, qword ptr [rip + 0x7dfe67e] ; TypeInfo Torappu.Battle.Enemy.States.AttackState @0x188883d50
0000000180a856d2: mov      rcx, qword ptr [rax + 0xb8]
0000000180a856d9: mov      rcx, qword ptr [rcx]
0000000180a856dc: test     rcx, rcx
0000000180a856df: jne      0x180a85828
0000000180a856e5: mov      qword ptr [rsp + 0x40], rbp
0000000180a856ea: mov      qword ptr [rsp + 0x48], rsi
0000000180a856ef: mov      rdx, qword ptr [rip + 0x7ed246a] ; GenericMethodInfo 282794 @0x188957b60
0000000180a856f6: mov      rcx, rbx
0000000180a856f9: call     0x18536e540
0000000180a856fe: test     rax, rax
0000000180a85701: je       0x180a85840
0000000180a85707: xor      edx, edx
0000000180a85709: mov      rcx, rax
0000000180a8570c: call     0x1807057e0 ; Torappu.Battle.Entity.get_isDialogTarget [66530]
0000000180a85711: test     al, al
0000000180a85713: jne      0x180a85812
0000000180a85719: test     edi, edi
0000000180a8571b: jg       0x180a85747
0000000180a8571d: mov      rdx, qword ptr [rip + 0x7ed243c] ; GenericMethodInfo 282794 @0x188957b60
0000000180a85724: mov      rcx, rbx
0000000180a85727: call     0x18536e540
0000000180a8572c: test     rax, rax
0000000180a8572f: je       0x180a85840
0000000180a85735: xor      edx, edx
0000000180a85737: mov      rcx, rax
0000000180a8573a: call     0x180a7a4a0 ; Torappu.Battle.Enemy._SearchAttackTarget [76495]
0000000180a8573f: test     al, al
0000000180a85741: je       0x180a85812
0000000180a85747: mov      rdx, qword ptr [rip + 0x7ed2412] ; GenericMethodInfo 282794 @0x188957b60
0000000180a8574e: mov      rcx, rbx
0000000180a85751: call     0x18536e540
0000000180a85756: test     rax, rax
0000000180a85759: je       0x180a85840
0000000180a8575f: xor      edx, edx
0000000180a85761: mov      rcx, rax
0000000180a85764: call     0x180a7b540 ; Torappu.Battle.Enemy.get_attackWrapper [76386]
0000000180a85769: mov      rdx, qword ptr [rip + 0x7ed23f0] ; GenericMethodInfo 282794 @0x188957b60
0000000180a85770: mov      rcx, rbx
0000000180a85773: mov      rsi, rax
0000000180a85776: call     0x18536e540
0000000180a8577b: mov      rbp, rax
0000000180a8577e: test     rax, rax
0000000180a85781: je       0x180a85840
0000000180a85787: mov      rcx, qword ptr [rip + 0x7e1b4aa] ; TypeInfo Torappu.Battle.Ability.FinishCallbackDelegate @0x1888a0c38
0000000180a8578e: call     0x18045cfe0
0000000180a85793: mov      rdi, rax
0000000180a85796: test     rax, rax
0000000180a85799: je       0x180a85840
0000000180a8579f: mov      r8, qword ptr [rip + 0x7ed6b2a] ; MethodInfo Torappu.Battle.Enemy.States.AttackState._AttackFinishCallback [76664] @0x18895c2d0
0000000180a857a6: xor      r9d, r9d
0000000180a857a9: mov      rdx, rbx
0000000180a857ac: mov      rcx, rax
0000000180a857af: call     0x1805dd580 ; Torappu.Battle.Ability.FinishCallbackDelegate..ctor [63111] | XLua.__XLua_Gen_Delegate181..ctor [224734]
0000000180a857b4: test     rsi, rsi
0000000180a857b7: je       0x180a85840
0000000180a857bd: lea      rdx, [rbp + 0x4f8]
0000000180a857c4: mov      qword ptr [rsp + 0x20], 0
0000000180a857cd: mov      r9b, 1
0000000180a857d0: mov      r8, rdi
0000000180a857d3: mov      rcx, rsi
0000000180a857d6: call     0x180a85dc0 ; Torappu.Battle.Enemy.AttackWrapper.Cast [76861]
0000000180a857db: test     al, al
0000000180a857dd: je       0x180a85812
0000000180a857df: mov      rdx, qword ptr [rip + 0x7ed237a] ; GenericMethodInfo 282794 @0x188957b60
0000000180a857e6: mov      rcx, rbx
0000000180a857e9: call     0x18536e540
0000000180a857ee: test     rax, rax
0000000180a857f1: je       0x180a85840
0000000180a857f3: xor      edx, edx
0000000180a857f5: mov      rcx, rax
0000000180a857f8: call     0x180acbb00 ; Torappu.Battle.Unit.OnStartAttack [77687]
0000000180a857fd: mov      rbp, qword ptr [rsp + 0x40]
0000000180a85802: mov      rsi, qword ptr [rsp + 0x48]
0000000180a85807: mov      rbx, qword ptr [rsp + 0x50]
0000000180a8580c: add      rsp, 0x30
0000000180a85810: pop      rdi
0000000180a85811: ret      
0000000180a85812: mov      r8, qword ptr [rip + 0x7ed1ec7] ; GenericMethodInfo 282792 @0x1889576e0
0000000180a85819: mov      edx, 1
0000000180a8581e: mov      rcx, rbx
0000000180a85821: call     0x18536e450
0000000180a85826: jmp      0x180a857fd
0000000180a85828: xor      r9d, r9d
0000000180a8582b: mov      r8d, edi
0000000180a8582e: mov      rdx, rbx
0000000180a85831: mov      rbx, qword ptr [rsp + 0x50]
0000000180a85836: add      rsp, 0x30
0000000180a8583a: pop      rdi
0000000180a8583b: jmp      0x1834c0e30 ; XLua.DelegateBridge.__Gen_Delegate_Imp55 [2710]
0000000180a85840: call     0x18048c0b0
0000000180a85845: int3     
0000000180a85846: int3     
0000000180a85847: int3     
0000000180a85848: int3     
0000000180a85849: int3     
0000000180a8584a: int3     
0000000180a8584b: int3     
0000000180a8584c: int3     
0000000180a8584d: int3     
0000000180a8584e: int3     
0000000180a8584f: int3     
