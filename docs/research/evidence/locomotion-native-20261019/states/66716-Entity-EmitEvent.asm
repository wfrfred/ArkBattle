; Torappu.Battle.Entity.EmitEvent metadata=66716 token=0x601049d VA=0x1806f2630 RVA=0x6f2630 size=0xd0
00000001806f2630: mov      qword ptr [rsp + 8], rbx
00000001806f2635: mov      qword ptr [rsp + 0x10], rsi
00000001806f263a: push     rdi
00000001806f263b: sub      rsp, 0x30
00000001806f263f: cmp      byte ptr [rip + 0x859e2e6], 0
00000001806f2646: mov      rdi, r8
00000001806f2649: mov      esi, edx
00000001806f264b: mov      rbx, rcx
00000001806f264e: jne      0x1806f266f
00000001806f2650: lea      rcx, [rip + 0x814ed11] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806f2657: call     0x18048bf00
00000001806f265c: lea      rcx, [rip + 0x81270fd] ; GenericMethodInfo 262050 @0x188819760
00000001806f2663: call     0x18048bf00
00000001806f2668: mov      byte ptr [rip + 0x859e2bd], 1
00000001806f266f: mov      rax, qword ptr [rip + 0x814ecf2] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806f2676: cmp      dword ptr [rax + 0xe0], 0
00000001806f267d: jne      0x1806f268e
00000001806f267f: mov      rcx, rax
00000001806f2682: call     0x18048c140
00000001806f2687: mov      rax, qword ptr [rip + 0x814ecda] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806f268e: mov      rax, qword ptr [rax + 0xb8]
00000001806f2695: mov      rcx, qword ptr [rax + 0xb00]
00000001806f269c: test     rcx, rcx
00000001806f269f: jne      0x1806f26cd
00000001806f26a1: mov      rcx, qword ptr [rbx + 0xb8]
00000001806f26a8: test     rcx, rcx
00000001806f26ab: je       0x1806f26f4
00000001806f26ad: mov      r9, qword ptr [rip + 0x81270ac] ; GenericMethodInfo 262050 @0x188819760
00000001806f26b4: mov      r8, rdi
00000001806f26b7: mov      edx, esi
00000001806f26b9: mov      rbx, qword ptr [rsp + 0x40]
00000001806f26be: mov      rsi, qword ptr [rsp + 0x48]
00000001806f26c3: add      rsp, 0x30
00000001806f26c7: pop      rdi
00000001806f26c8: jmp      0x1848dca60
00000001806f26cd: mov      r9, rdi
00000001806f26d0: mov      qword ptr [rsp + 0x20], 0
00000001806f26d9: mov      r8d, esi
00000001806f26dc: mov      rdx, rbx
00000001806f26df: call     0x18333b1d0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3074 [5729]
00000001806f26e4: mov      rbx, qword ptr [rsp + 0x40]
00000001806f26e9: mov      rsi, qword ptr [rsp + 0x48]
00000001806f26ee: add      rsp, 0x30
00000001806f26f2: pop      rdi
00000001806f26f3: ret      
00000001806f26f4: call     0x18048c0b0
00000001806f26f9: int3     
00000001806f26fa: int3     
00000001806f26fb: int3     
00000001806f26fc: int3     
00000001806f26fd: int3     
00000001806f26fe: int3     
00000001806f26ff: int3     
