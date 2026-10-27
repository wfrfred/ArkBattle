; Torappu.Battle.Enemy.States.PalsyState.OnTick metadata=76708 token=0x6012ba5 VA=0x180a98500 RVA=0xa98500 size=0x1a0
0000000180a98500: mov      qword ptr [rsp + 8], rbx
0000000180a98505: push     rdi
0000000180a98506: sub      rsp, 0x20
0000000180a9850a: cmp      byte ptr [rip + 0x81fa424], 0
0000000180a98511: mov      rbx, rdx
0000000180a98514: mov      rdi, rcx
0000000180a98517: jne      0x180a98544
0000000180a98519: lea      rcx, [rip + 0x7ded778] ; TypeInfo Torappu.Battle.Enemy.States.PalsyState @0x188885c98
0000000180a98520: call     0x18048bf00
0000000180a98525: lea      rcx, [rip + 0x7ebf1b4] ; GenericMethodInfo 282792 @0x1889576e0
0000000180a9852c: call     0x18048bf00
0000000180a98531: lea      rcx, [rip + 0x7ebf628] ; GenericMethodInfo 282794 @0x188957b60
0000000180a98538: call     0x18048bf00
0000000180a9853d: mov      byte ptr [rip + 0x81fa3f1], 1
0000000180a98544: mov      rax, qword ptr [rip + 0x7ded74d] ; TypeInfo Torappu.Battle.Enemy.States.PalsyState @0x188885c98
0000000180a9854b: cmp      dword ptr [rax + 0xe0], 0
0000000180a98552: jne      0x180a98563
0000000180a98554: mov      rcx, rax
0000000180a98557: call     0x18048c140
0000000180a9855c: mov      rax, qword ptr [rip + 0x7ded735] ; TypeInfo Torappu.Battle.Enemy.States.PalsyState @0x188885c98
0000000180a98563: mov      rax, qword ptr [rax + 0xb8]
0000000180a9856a: mov      rcx, qword ptr [rax + 0x20]
0000000180a9856e: test     rcx, rcx
0000000180a98571: jne      0x180a9867f
0000000180a98577: mov      rdx, qword ptr [rip + 0x7ebf5e2] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9857e: mov      rcx, rdi
0000000180a98581: call     0x18536e540
0000000180a98586: test     rax, rax
0000000180a98589: je       0x180a98698
0000000180a9858f: xor      edx, edx
0000000180a98591: mov      rcx, rax
0000000180a98594: call     0x180705320 ; Torappu.Battle.Entity.get_isActuallyLevitate [66493]
0000000180a98599: mov      rcx, rdi
0000000180a9859c: test     al, al
0000000180a9859e: jne      0x180a98664
0000000180a985a4: mov      rdx, qword ptr [rip + 0x7ebf5b5] ; GenericMethodInfo 282794 @0x188957b60
0000000180a985ab: call     0x18536e540
0000000180a985b0: test     rax, rax
0000000180a985b3: je       0x180a98698
0000000180a985b9: xor      edx, edx
0000000180a985bb: mov      rcx, rax
0000000180a985be: call     0x180706a00 ; Torappu.Battle.Entity.get_isStunned [66486]
0000000180a985c3: mov      rcx, rdi
0000000180a985c6: test     al, al
0000000180a985c8: jne      0x180a98649
0000000180a985ca: mov      rdx, qword ptr [rip + 0x7ebf58f] ; GenericMethodInfo 282794 @0x188957b60
0000000180a985d1: call     0x18536e540
0000000180a985d6: test     rax, rax
0000000180a985d9: je       0x180a98698
0000000180a985df: xor      edx, edx
0000000180a985e1: mov      rcx, rax
0000000180a985e4: call     0x180705b50 ; Torappu.Battle.Entity.get_isFrozen [66488]
0000000180a985e9: mov      rcx, rdi
0000000180a985ec: test     al, al
0000000180a985ee: jne      0x180a9862e
0000000180a985f0: mov      rdx, qword ptr [rip + 0x7ebf569] ; GenericMethodInfo 282794 @0x188957b60
0000000180a985f7: call     0x18536e540
0000000180a985fc: test     rax, rax
0000000180a985ff: je       0x180a98698
0000000180a98605: xor      edx, edx
0000000180a98607: mov      rcx, rax
0000000180a9860a: call     0x180706560 ; Torappu.Battle.Entity.get_isPalsying [66504]
0000000180a9860f: test     al, al
0000000180a98611: jne      0x180a9868d
0000000180a98613: mov      r8, qword ptr [rip + 0x7ebf0c6] ; GenericMethodInfo 282792 @0x1889576e0
0000000180a9861a: xor      edx, edx
0000000180a9861c: mov      rcx, rdi
0000000180a9861f: mov      rbx, qword ptr [rsp + 0x30]
0000000180a98624: add      rsp, 0x20
0000000180a98628: pop      rdi
0000000180a98629: jmp      0x18536e450
0000000180a9862e: mov      r8, qword ptr [rip + 0x7ebf0ab] ; GenericMethodInfo 282792 @0x1889576e0
0000000180a98635: mov      edx, 0xd
0000000180a9863a: mov      rbx, qword ptr [rsp + 0x30]
0000000180a9863f: add      rsp, 0x20
0000000180a98643: pop      rdi
0000000180a98644: jmp      0x18536e450
0000000180a98649: mov      r8, qword ptr [rip + 0x7ebf090] ; GenericMethodInfo 282792 @0x1889576e0
0000000180a98650: mov      edx, 4
0000000180a98655: mov      rbx, qword ptr [rsp + 0x30]
0000000180a9865a: add      rsp, 0x20
0000000180a9865e: pop      rdi
0000000180a9865f: jmp      0x18536e450
0000000180a98664: mov      r8, qword ptr [rip + 0x7ebf075] ; GenericMethodInfo 282792 @0x1889576e0
0000000180a9866b: mov      edx, 0xe
0000000180a98670: mov      rbx, qword ptr [rsp + 0x30]
0000000180a98675: add      rsp, 0x20
0000000180a98679: pop      rdi
0000000180a9867a: jmp      0x18536e450
0000000180a9867f: xor      r9d, r9d
0000000180a98682: mov      r8, rbx
0000000180a98685: mov      rdx, rdi
0000000180a98688: call     0x1833f9830 ; XLua.DelegateBridge.__Gen_Delegate_Imp427 [3082]
0000000180a9868d: mov      rbx, qword ptr [rsp + 0x30]
0000000180a98692: add      rsp, 0x20
0000000180a98696: pop      rdi
0000000180a98697: ret      
0000000180a98698: call     0x18048c0b0
0000000180a9869d: int3     
0000000180a9869e: int3     
0000000180a9869f: int3     
