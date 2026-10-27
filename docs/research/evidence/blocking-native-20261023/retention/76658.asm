; Torappu.Battle.Enemy.States.MoveState.OnTick metadata=76658 token=0x6012b73 VA=0x180a977d0 RVA=0xa977d0 size=0x4c0
0000000180a977d0: mov      qword ptr [rsp + 0x10], rdx
0000000180a977d5: push     rbx
0000000180a977d6: sub      rsp, 0x40
0000000180a977da: cmp      byte ptr [rip + 0x81fb130], 0
0000000180a977e1: mov      rbx, rcx
0000000180a977e4: jne      0x180a9782e
0000000180a977e6: lea      rcx, [rip + 0x7dc2f13] ; TypeInfo Torappu.FP @0x18885a700
0000000180a977ed: call     0x18048bf00
0000000180a977f2: lea      rcx, [rip + 0x7dee25f] ; TypeInfo Torappu.Battle.Enemy.States.MoveState @0x188885a58
0000000180a977f9: call     0x18048bf00
0000000180a977fe: lea      rcx, [rip + 0x7e9b4e3] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a97805: call     0x18048bf00
0000000180a9780a: lea      rcx, [rip + 0x7ebfecf] ; GenericMethodInfo 282792 @0x1889576e0
0000000180a97811: call     0x18048bf00
0000000180a97816: lea      rcx, [rip + 0x7ec0343] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9781d: call     0x18048bf00
0000000180a97822: mov      rdx, qword ptr [rsp + 0x58]
0000000180a97827: mov      byte ptr [rip + 0x81fb0e3], 1
0000000180a9782e: mov      rax, qword ptr [rip + 0x7dee223] ; TypeInfo Torappu.Battle.Enemy.States.MoveState @0x188885a58
0000000180a97835: mov      byte ptr [rsp + 0x68], 0
0000000180a9783a: mov      qword ptr [rsp + 0x20], 0
0000000180a97843: mov      rcx, qword ptr [rax + 0xb8]
0000000180a9784a: mov      rcx, qword ptr [rcx + 0x20]
0000000180a9784e: test     rcx, rcx
0000000180a97851: jne      0x180a97c70
0000000180a97857: mov      qword ptr [rsp + 0x50], rdi
0000000180a9785c: movaps   xmmword ptr [rsp + 0x30], xmm6
0000000180a97861: mov      rdx, qword ptr [rip + 0x7ec02f8] ; GenericMethodInfo 282794 @0x188957b60
0000000180a97868: mov      rcx, rbx
0000000180a9786b: call     0x18536e540
0000000180a97870: test     rax, rax
0000000180a97873: je       0x180a97c84
0000000180a97879: xor      edx, edx
0000000180a9787b: mov      rcx, rax
0000000180a9787e: call     0x1807057e0 ; Torappu.Battle.Entity.get_isDialogTarget [66530]
0000000180a97883: mov      rcx, rbx
0000000180a97886: test     al, al
0000000180a97888: jne      0x180a97c62
0000000180a9788e: mov      rdx, qword ptr [rip + 0x7ec02cb] ; GenericMethodInfo 282794 @0x188957b60
0000000180a97895: call     0x18536e540
0000000180a9789a: test     rax, rax
0000000180a9789d: je       0x180a97c84
0000000180a978a3: xor      edx, edx
0000000180a978a5: mov      rcx, rax
0000000180a978a8: call     0x180705320 ; Torappu.Battle.Entity.get_isActuallyLevitate [66493]
0000000180a978ad: mov      rcx, rbx
0000000180a978b0: test     al, al
0000000180a978b2: jne      0x180a97c54
0000000180a978b8: mov      rdx, qword ptr [rip + 0x7ec02a1] ; GenericMethodInfo 282794 @0x188957b60
0000000180a978bf: call     0x18536e540
0000000180a978c4: test     rax, rax
0000000180a978c7: je       0x180a97c84
0000000180a978cd: xor      edx, edx
0000000180a978cf: mov      rcx, rax
0000000180a978d2: call     0x180706a00 ; Torappu.Battle.Entity.get_isStunned [66486]
0000000180a978d7: mov      rcx, rbx
0000000180a978da: test     al, al
0000000180a978dc: jne      0x180a97c46
0000000180a978e2: mov      rdx, qword ptr [rip + 0x7ec0277] ; GenericMethodInfo 282794 @0x188957b60
0000000180a978e9: call     0x18536e540
0000000180a978ee: test     rax, rax
0000000180a978f1: je       0x180a97c84
0000000180a978f7: xor      edx, edx
0000000180a978f9: mov      rcx, rax
0000000180a978fc: call     0x180705b50 ; Torappu.Battle.Entity.get_isFrozen [66488]
0000000180a97901: mov      rcx, rbx
0000000180a97904: test     al, al
0000000180a97906: jne      0x180a97c38
0000000180a9790c: mov      rdx, qword ptr [rip + 0x7ec024d] ; GenericMethodInfo 282794 @0x188957b60
0000000180a97913: call     0x18536e540
0000000180a97918: test     rax, rax
0000000180a9791b: je       0x180a97c84
0000000180a97921: xor      edx, edx
0000000180a97923: mov      rcx, rax
0000000180a97926: call     0x180706560 ; Torappu.Battle.Entity.get_isPalsying [66504]
0000000180a9792b: mov      rcx, rbx
0000000180a9792e: test     al, al
0000000180a97930: jne      0x180a97c2a
0000000180a97936: mov      rdx, qword ptr [rip + 0x7ec0223] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9793d: call     0x18536e540
0000000180a97942: test     rax, rax
0000000180a97945: je       0x180a97c84
0000000180a9794b: xor      edx, edx
0000000180a9794d: mov      rcx, rax
0000000180a97950: call     0x180a7bb20 ; Torappu.Battle.Enemy.get_blocker [76320]
0000000180a97955: mov      rcx, qword ptr [rip + 0x7e9b38c] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a9795c: mov      rdi, rax
0000000180a9795f: cmp      dword ptr [rcx + 0xe0], 0
0000000180a97966: jne      0x180a9796d
0000000180a97968: call     0x18048c140
0000000180a9796d: xor      r8d, r8d
0000000180a97970: xor      edx, edx
0000000180a97972: mov      rcx, rdi
0000000180a97975: call     0x186b63a70
0000000180a9797a: test     al, al
0000000180a9797c: jne      0x180a97c19
0000000180a97982: mov      rdx, qword ptr [rip + 0x7ec01d7] ; GenericMethodInfo 282794 @0x188957b60
0000000180a97989: mov      rcx, rbx
0000000180a9798c: call     0x18536e540
0000000180a97991: test     rax, rax
0000000180a97994: je       0x180a97c84
0000000180a9799a: xor      r8d, r8d
0000000180a9799d: lea      rdx, [rsp + 0x20]
0000000180a979a2: mov      rcx, rax
0000000180a979a5: call     0x180a75dd0 ; Torappu.Battle.Enemy.TryGetCombatTargetBlockee [76545]
0000000180a979aa: test     al, al
0000000180a979ac: jne      0x180a97c19
0000000180a979b2: mov      rdx, qword ptr [rip + 0x7ec01a7] ; GenericMethodInfo 282794 @0x188957b60
0000000180a979b9: mov      rcx, rbx
0000000180a979bc: call     0x18536e540
0000000180a979c1: test     rax, rax
0000000180a979c4: je       0x180a97c84
0000000180a979ca: xor      edx, edx
0000000180a979cc: mov      rcx, rax
0000000180a979cf: call     0x180a7a4a0 ; Torappu.Battle.Enemy._SearchAttackTarget [76495]
0000000180a979d4: mov      rcx, rbx
0000000180a979d7: test     al, al
0000000180a979d9: jne      0x180a97bf8
0000000180a979df: mov      rdx, qword ptr [rip + 0x7ec017a] ; GenericMethodInfo 282794 @0x188957b60
0000000180a979e6: call     0x18536e540
0000000180a979eb: test     rax, rax
0000000180a979ee: je       0x180a97c84
0000000180a979f4: xor      edx, edx
0000000180a979f6: mov      rcx, rax
0000000180a979f9: call     0x180705a90 ; Torappu.Battle.Entity.get_isFeared [66502]
0000000180a979fe: mov      rdx, qword ptr [rip + 0x7ec015b] ; GenericMethodInfo 282794 @0x188957b60
0000000180a97a05: mov      rcx, rbx
0000000180a97a08: test     al, al
0000000180a97a0a: jne      0x180a97b5b
0000000180a97a10: call     0x18536e540
0000000180a97a15: test     rax, rax
0000000180a97a18: je       0x180a97c84
0000000180a97a1e: xor      edx, edx
0000000180a97a20: mov      rcx, rax
0000000180a97a23: call     0x1807054f0 ; Torappu.Battle.Entity.get_isAttracted [66505]
0000000180a97a28: mov      rdx, qword ptr [rip + 0x7ec0131] ; GenericMethodInfo 282794 @0x188957b60
0000000180a97a2f: mov      rcx, rbx
0000000180a97a32: test     al, al
0000000180a97a34: jne      0x180a97abe
0000000180a97a3a: call     0x18536e540
0000000180a97a3f: mov      rcx, qword ptr [rip + 0x7dc2cba] ; TypeInfo Torappu.FP @0x18885a700
0000000180a97a46: mov      rdi, rax
0000000180a97a49: cmp      dword ptr [rcx + 0xe0], 0
0000000180a97a50: jne      0x180a97a57
0000000180a97a52: call     0x18048c140
0000000180a97a57: xor      edx, edx
0000000180a97a59: lea      rcx, [rsp + 0x58]
0000000180a97a5e: call     0x1866fae20
0000000180a97a63: movaps   xmm6, xmm0
0000000180a97a66: test     rdi, rdi
0000000180a97a69: je       0x180a97c84
0000000180a97a6f: cmp      byte ptr [rip + 0x8234d7a], 0
0000000180a97a76: jbe      0x180a97a80
0000000180a97a78: mov      rcx, qword ptr [rdi]
0000000180a97a7b: call     0x180446d00
0000000180a97a80: mov      r9, qword ptr [rdi]
0000000180a97a83: lea      r8, [rsp + 0x68]
0000000180a97a88: movaps   xmm1, xmm6
0000000180a97a8b: mov      rcx, rdi
0000000180a97a8e: mov      rax, qword ptr [r9 + 0x1010]
0000000180a97a95: mov      r9, qword ptr [r9 + 0x1018]
0000000180a97a9c: call     rax
0000000180a97a9e: movzx    edx, byte ptr [rsp + 0x68]
0000000180a97aa3: xor      r8d, r8d
0000000180a97aa6: mov      rcx, rbx
0000000180a97aa9: call     0x180a97f60 ; Torappu.Battle.Enemy.States.MoveState.set_isHanging [76655]
0000000180a97aae: mov      rdi, qword ptr [rsp + 0x50]
0000000180a97ab3: movaps   xmm6, xmmword ptr [rsp + 0x30]
0000000180a97ab8: add      rsp, 0x40
0000000180a97abc: pop      rbx
0000000180a97abd: ret      
0000000180a97abe: call     0x18536e540
0000000180a97ac3: test     rax, rax
0000000180a97ac6: je       0x180a97c84
0000000180a97acc: xor      edx, edx
0000000180a97ace: mov      rcx, rax
0000000180a97ad1: call     0x180a7b5c0 ; Torappu.Battle.Enemy.get_attractController [76282]
0000000180a97ad6: test     rax, rax
0000000180a97ad9: je       0x180a97c84
0000000180a97adf: xor      r8d, r8d
0000000180a97ae2: xor      edx, edx
0000000180a97ae4: mov      rcx, rax
0000000180a97ae7: call     0x180a87190 ; Torappu.Battle.Enemy.AttractController.UpdateAttractCursor [76905]
0000000180a97aec: mov      rdx, qword ptr [rip + 0x7ec006d] ; GenericMethodInfo 282794 @0x188957b60
0000000180a97af3: mov      rcx, rbx
0000000180a97af6: call     0x18536e540
0000000180a97afb: mov      rcx, qword ptr [rip + 0x7dc2bfe] ; TypeInfo Torappu.FP @0x18885a700
0000000180a97b02: mov      rdi, rax
0000000180a97b05: cmp      dword ptr [rcx + 0xe0], 0
0000000180a97b0c: jne      0x180a97b13
0000000180a97b0e: call     0x18048c140
0000000180a97b13: xor      edx, edx
0000000180a97b15: lea      rcx, [rsp + 0x58]
0000000180a97b1a: call     0x1866fae20
0000000180a97b1f: test     rdi, rdi
0000000180a97b22: je       0x180a97c84
0000000180a97b28: xor      r9d, r9d
0000000180a97b2b: lea      r8, [rsp + 0x68]
0000000180a97b30: movaps   xmm1, xmm0
0000000180a97b33: mov      rcx, rdi
0000000180a97b36: call     0x180a797d0 ; Torappu.Battle.Enemy._MoveInAttractArea [76489]
0000000180a97b3b: movzx    edx, byte ptr [rsp + 0x68]
0000000180a97b40: xor      r8d, r8d
0000000180a97b43: mov      rcx, rbx
0000000180a97b46: call     0x180a97f60 ; Torappu.Battle.Enemy.States.MoveState.set_isHanging [76655]
0000000180a97b4b: mov      rdi, qword ptr [rsp + 0x50]
0000000180a97b50: movaps   xmm6, xmmword ptr [rsp + 0x30]
0000000180a97b55: add      rsp, 0x40
0000000180a97b59: pop      rbx
0000000180a97b5a: ret      
0000000180a97b5b: call     0x18536e540
0000000180a97b60: test     rax, rax
0000000180a97b63: je       0x180a97c84
0000000180a97b69: xor      edx, edx
0000000180a97b6b: mov      rcx, rax
0000000180a97b6e: call     0x180a7ce50 ; Torappu.Battle.Enemy.get_fearController [76281]
0000000180a97b73: test     rax, rax
0000000180a97b76: je       0x180a97c84
0000000180a97b7c: xor      r8d, r8d
0000000180a97b7f: xor      edx, edx
0000000180a97b81: mov      rcx, rax
0000000180a97b84: call     0x180a91730 ; Torappu.Battle.Enemy.FearController.UpdateFearCursor [76895]
0000000180a97b89: mov      rdx, qword ptr [rip + 0x7ebffd0] ; GenericMethodInfo 282794 @0x188957b60
0000000180a97b90: mov      rcx, rbx
0000000180a97b93: call     0x18536e540
0000000180a97b98: mov      rcx, qword ptr [rip + 0x7dc2b61] ; TypeInfo Torappu.FP @0x18885a700
0000000180a97b9f: mov      rdi, rax
0000000180a97ba2: cmp      dword ptr [rcx + 0xe0], 0
0000000180a97ba9: jne      0x180a97bb0
0000000180a97bab: call     0x18048c140
0000000180a97bb0: xor      edx, edx
0000000180a97bb2: lea      rcx, [rsp + 0x58]
0000000180a97bb7: call     0x1866fae20
0000000180a97bbc: test     rdi, rdi
0000000180a97bbf: je       0x180a97c84
0000000180a97bc5: xor      r9d, r9d
0000000180a97bc8: lea      r8, [rsp + 0x68]
0000000180a97bcd: movaps   xmm1, xmm0
0000000180a97bd0: mov      rcx, rdi
0000000180a97bd3: call     0x180a798d0 ; Torappu.Battle.Enemy._MoveInFearArea [76488]
0000000180a97bd8: movzx    edx, byte ptr [rsp + 0x68]
0000000180a97bdd: xor      r8d, r8d
0000000180a97be0: mov      rcx, rbx
0000000180a97be3: call     0x180a97f60 ; Torappu.Battle.Enemy.States.MoveState.set_isHanging [76655]
0000000180a97be8: mov      rdi, qword ptr [rsp + 0x50]
0000000180a97bed: movaps   xmm6, xmmword ptr [rsp + 0x30]
0000000180a97bf2: add      rsp, 0x40
0000000180a97bf6: pop      rbx
0000000180a97bf7: ret      
0000000180a97bf8: mov      r8, qword ptr [rip + 0x7ebfae1] ; GenericMethodInfo 282792 @0x1889576e0
0000000180a97bff: mov      edx, 2
0000000180a97c04: call     0x18536e450
0000000180a97c09: mov      rdi, qword ptr [rsp + 0x50]
0000000180a97c0e: movaps   xmm6, xmmword ptr [rsp + 0x30]
0000000180a97c13: add      rsp, 0x40
0000000180a97c17: pop      rbx
0000000180a97c18: ret      
0000000180a97c19: mov      r8, qword ptr [rip + 0x7ebfac0] ; GenericMethodInfo 282792 @0x1889576e0
0000000180a97c20: mov      edx, 3
0000000180a97c25: mov      rcx, rbx
0000000180a97c28: jmp      0x180a97c04
0000000180a97c2a: mov      r8, qword ptr [rip + 0x7ebfaaf] ; GenericMethodInfo 282792 @0x1889576e0
0000000180a97c31: mov      edx, 0x10
0000000180a97c36: jmp      0x180a97c04
0000000180a97c38: mov      r8, qword ptr [rip + 0x7ebfaa1] ; GenericMethodInfo 282792 @0x1889576e0
0000000180a97c3f: mov      edx, 0xd
0000000180a97c44: jmp      0x180a97c04
0000000180a97c46: mov      r8, qword ptr [rip + 0x7ebfa93] ; GenericMethodInfo 282792 @0x1889576e0
0000000180a97c4d: mov      edx, 4
0000000180a97c52: jmp      0x180a97c04
0000000180a97c54: mov      r8, qword ptr [rip + 0x7ebfa85] ; GenericMethodInfo 282792 @0x1889576e0
0000000180a97c5b: mov      edx, 0xe
0000000180a97c60: jmp      0x180a97c04
0000000180a97c62: mov      r8, qword ptr [rip + 0x7ebfa77] ; GenericMethodInfo 282792 @0x1889576e0
0000000180a97c69: mov      edx, 0xf
0000000180a97c6e: jmp      0x180a97c04
0000000180a97c70: mov      r8, rdx
0000000180a97c73: xor      r9d, r9d
0000000180a97c76: mov      rdx, rbx
0000000180a97c79: call     0x1833f9830 ; XLua.DelegateBridge.__Gen_Delegate_Imp427 [3082]
0000000180a97c7e: add      rsp, 0x40
0000000180a97c82: pop      rbx
0000000180a97c83: ret      
0000000180a97c84: call     0x18048c0b0
0000000180a97c89: int3     
0000000180a97c8a: int3     
0000000180a97c8b: int3     
0000000180a97c8c: int3     
0000000180a97c8d: int3     
0000000180a97c8e: int3     
0000000180a97c8f: int3     