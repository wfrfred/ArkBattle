; Torappu.Battle.Enemy.States.FreezeState.OnExit metadata=76722 token=0x6012bb3 VA=0x180a95160 RVA=0xa95160 size=0x1a0
0000000180a95160: mov      qword ptr [rsp + 8], rbx
0000000180a95165: push     rdi
0000000180a95166: sub      rsp, 0x30
0000000180a9516a: cmp      byte ptr [rip + 0x81fd7d2], 0
0000000180a95171: mov      edi, edx
0000000180a95173: mov      rbx, rcx
0000000180a95176: jne      0x180a951a3
0000000180a95178: lea      rcx, [rip + 0x7eb3ee1] ; TypeInfo bool @0x188949060
0000000180a9517f: call     0x18048bf00
0000000180a95184: lea      rcx, [rip + 0x7df0455] ; TypeInfo Torappu.Battle.Enemy.States.FreezeState @0x1888855e0
0000000180a9518b: call     0x18048bf00
0000000180a95190: lea      rcx, [rip + 0x7ec29c9] ; GenericMethodInfo 282794 @0x188957b60
0000000180a95197: call     0x18048bf00
0000000180a9519c: mov      byte ptr [rip + 0x81fd7a0], 1
0000000180a951a3: mov      rax, qword ptr [rip + 0x7df0436] ; TypeInfo Torappu.Battle.Enemy.States.FreezeState @0x1888855e0
0000000180a951aa: mov      rcx, qword ptr [rax + 0xb8]
0000000180a951b1: mov      rcx, qword ptr [rcx + 0x48]
0000000180a951b5: test     rcx, rcx
0000000180a951b8: jne      0x180a952d2
0000000180a951be: mov      rdx, qword ptr [rip + 0x7ec299b] ; GenericMethodInfo 282794 @0x188957b60
0000000180a951c5: mov      rcx, rbx
0000000180a951c8: call     0x18536e540
0000000180a951cd: mov      rdx, qword ptr [rip + 0x7ec298c] ; GenericMethodInfo 282794 @0x188957b60
0000000180a951d4: mov      rcx, rbx
0000000180a951d7: mov      rdi, rax
0000000180a951da: call     0x18536e540
0000000180a951df: test     rax, rax
0000000180a951e2: je       0x180a952f0
0000000180a951e8: xor      edx, edx
0000000180a951ea: mov      rcx, rax
0000000180a951ed: call     0x180705b50 ; Torappu.Battle.Entity.get_isFrozen [66488]
0000000180a951f2: mov      rcx, qword ptr [rip + 0x7eb3e67] ; TypeInfo bool @0x188949060
0000000180a951f9: lea      rdx, [rsp + 0x58]
0000000180a951fe: mov      byte ptr [rsp + 0x58], al
0000000180a95202: call     0x18048b9c0
0000000180a95207: test     rdi, rdi
0000000180a9520a: je       0x180a952f0
0000000180a95210: xor      r9d, r9d
0000000180a95213: mov      r8, rax
0000000180a95216: mov      edx, 0x1a
0000000180a9521b: mov      rcx, rdi
0000000180a9521e: call     0x1806f2630 ; Torappu.Battle.Entity.EmitEvent [66716]
0000000180a95223: mov      rcx, qword ptr [rbx + 0x18]
0000000180a95227: xor      edx, edx
0000000180a95229: call     0x185db9d60
0000000180a9522e: test     al, al
0000000180a95230: jne      0x180a95297
0000000180a95232: mov      rdx, qword ptr [rip + 0x7ec2927] ; GenericMethodInfo 282794 @0x188957b60
0000000180a95239: mov      rcx, rbx
0000000180a9523c: call     0x18536e540
0000000180a95241: mov      rdi, rax
0000000180a95244: test     rax, rax
0000000180a95247: je       0x180a952ea
0000000180a9524d: cmp      byte ptr [rip + 0x823759c], 0
0000000180a95254: jbe      0x180a9525e
0000000180a95256: mov      rcx, qword ptr [rax]
0000000180a95259: call     0x180446d00
0000000180a9525e: mov      rdx, qword ptr [rdi]
0000000180a95261: mov      rcx, rdi
0000000180a95264: mov      r8, qword ptr [rdx + 0xb60]
0000000180a9526b: mov      rdx, qword ptr [rdx + 0xb68]
0000000180a95272: call     r8
0000000180a95275: test     rax, rax
0000000180a95278: je       0x180a952ea
0000000180a9527a: movss    xmm3, dword ptr [rbx + 0x20]
0000000180a9527f: xor      r8d, r8d
0000000180a95282: mov      rdx, qword ptr [rbx + 0x18]
0000000180a95286: mov      rcx, rax
0000000180a95289: mov      qword ptr [rsp + 0x20], 0
0000000180a95292: call     0x1806189e0 ; Torappu.Battle.UnitAnimator.PlayAnimation [64046]
0000000180a95297: mov      rdx, qword ptr [rip + 0x7ec28c2] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9529e: mov      rcx, rbx
0000000180a952a1: call     0x18536e540
0000000180a952a6: test     rax, rax
0000000180a952a9: je       0x180a952ea
0000000180a952ab: xor      edx, edx
0000000180a952ad: mov      rcx, rax
0000000180a952b0: call     0x180701e20 ; Torappu.Battle.Entity.get_attributes [66358]
0000000180a952b5: test     rax, rax
0000000180a952b8: je       0x180a952ea
0000000180a952ba: xor      r8d, r8d
0000000180a952bd: mov      rdx, rbx
0000000180a952c0: mov      rcx, rax
0000000180a952c3: mov      rbx, qword ptr [rsp + 0x40]
0000000180a952c8: add      rsp, 0x30
0000000180a952cc: pop      rdi
0000000180a952cd: jmp      0x18064a270 ; Torappu.Battle.Attributes.RemoveModifier [64274]
0000000180a952d2: xor      r9d, r9d
0000000180a952d5: mov      r8d, edi
0000000180a952d8: mov      rdx, rbx
0000000180a952db: mov      rbx, qword ptr [rsp + 0x40]
0000000180a952e0: add      rsp, 0x30
0000000180a952e4: pop      rdi
0000000180a952e5: jmp      0x1834c0e30 ; XLua.DelegateBridge.__Gen_Delegate_Imp55 [2710]
0000000180a952ea: call     0x18048c0b0
0000000180a952ef: int3     
0000000180a952f0: call     0x18048c0b0
0000000180a952f5: int3     
0000000180a952f6: int3     
0000000180a952f7: int3     
0000000180a952f8: int3     
0000000180a952f9: int3     
0000000180a952fa: int3     
0000000180a952fb: int3     
0000000180a952fc: int3     
0000000180a952fd: int3     
0000000180a952fe: int3     
0000000180a952ff: int3     
