; Torappu.Battle.Enemy.OnDisappearChanged metadata=76479 token=0x6012ac0 VA=0x180a70650 RVA=0xa70650 size=0x1c0
0000000180a70650: mov      qword ptr [rsp + 0x10], rbx
0000000180a70655: push     rdi
0000000180a70656: sub      rsp, 0x30
0000000180a7065a: cmp      byte ptr [rip + 0x8222247], 0
0000000180a70661: movzx    edi, dl
0000000180a70664: mov      rbx, rcx
0000000180a70667: jne      0x180a706a0
0000000180a70669: lea      rcx, [rip + 0x7ed89f0] ; TypeInfo bool @0x188949060
0000000180a70670: call     0x18048bf00
0000000180a70675: lea      rcx, [rip + 0x7dab034] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7067c: call     0x18048bf00
0000000180a70681: lea      rcx, [rip + 0x7da90d8] ; GenericMethodInfo 262050 @0x188819760
0000000180a70688: call     0x18048bf00
0000000180a7068d: lea      rcx, [rip + 0x7e2b614] ; GenericMethodInfo 262831 @0x18889bca8
0000000180a70694: call     0x18048bf00
0000000180a70699: mov      byte ptr [rip + 0x8222208], 1
0000000180a706a0: mov      rax, qword ptr [rip + 0x7dab009] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a706a7: cmp      dword ptr [rax + 0xe0], 0
0000000180a706ae: jne      0x180a706bf
0000000180a706b0: mov      rcx, rax
0000000180a706b3: call     0x18048c140
0000000180a706b8: mov      rax, qword ptr [rip + 0x7daaff1] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a706bf: mov      rax, qword ptr [rax + 0xb8]
0000000180a706c6: mov      rcx, qword ptr [rax + 0x680]
0000000180a706cd: test     rcx, rcx
0000000180a706d0: jne      0x180a707df
0000000180a706d6: mov      qword ptr [rsp + 0x40], rsi
0000000180a706db: test     dil, dil
0000000180a706de: jne      0x180a70769
0000000180a706e4: cmp      byte ptr [rip + 0x825c105], dil
0000000180a706eb: jbe      0x180a706f5
0000000180a706ed: mov      rcx, qword ptr [rbx]
0000000180a706f0: call     0x180446d00
0000000180a706f5: mov      rdx, qword ptr [rbx]
0000000180a706f8: mov      rcx, rbx
0000000180a706fb: mov      rax, qword ptr [rdx + 0xf50]
0000000180a70702: mov      rdx, qword ptr [rdx + 0xf58]
0000000180a70709: call     rax
0000000180a7070b: mov      rsi, rax
0000000180a7070e: test     rax, rax
0000000180a70711: je       0x180a707fe
0000000180a70717: cmp      byte ptr [rip + 0x825c0d2], 0
0000000180a7071e: jbe      0x180a70728
0000000180a70720: mov      rcx, qword ptr [rax]
0000000180a70723: call     0x180446d00
0000000180a70728: mov      rdx, qword ptr [rsi]
0000000180a7072b: mov      rcx, rsi
0000000180a7072e: mov      r8, qword ptr [rdx + 0x200]
0000000180a70735: mov      rdx, qword ptr [rdx + 0x208]
0000000180a7073c: call     r8
0000000180a7073f: xor      r8d, r8d
0000000180a70742: mov      rdx, rax
0000000180a70745: mov      rcx, rbx
0000000180a70748: call     0x180a77dd0 ; Torappu.Battle.Enemy._CalculateFaceDirection [76519]
0000000180a7074d: xor      r9d, r9d
0000000180a70750: mov      qword ptr [rsp + 0x20], 0
0000000180a70759: mov      r8b, 1
0000000180a7075c: mov      rdx, rax
0000000180a7075f: mov      rcx, rbx
0000000180a70762: call     0x1806f2f10 ; Torappu.Battle.Entity.FaceTo [66535]
0000000180a70767: jmp      0x180a70790
0000000180a70769: xor      edx, edx
0000000180a7076b: mov      rcx, rbx
0000000180a7076e: call     0x180a800c0 ; Torappu.Battle.Enemy.get_stateMachine [76373]
0000000180a70773: test     rax, rax
0000000180a70776: je       0x180a707fe
0000000180a7077c: mov      r8, qword ptr [rip + 0x7e2b525] ; GenericMethodInfo 262831 @0x18889bca8
0000000180a70783: mov      edx, 0xb
0000000180a70788: mov      rcx, rax
0000000180a7078b: call     0x18499c9d0
0000000180a70790: xor      edx, edx
0000000180a70792: mov      rcx, rbx
0000000180a70795: call     0x180703a80 ; Torappu.Battle.Entity.get_eventPool [66359]
0000000180a7079a: mov      rcx, qword ptr [rip + 0x7ed88bf] ; TypeInfo bool @0x188949060
0000000180a707a1: lea      rdx, [rsp + 0x58]
0000000180a707a6: mov      rbx, rax
0000000180a707a9: mov      byte ptr [rsp + 0x58], dil
0000000180a707ae: call     0x18048b9c0
0000000180a707b3: test     rbx, rbx
0000000180a707b6: je       0x180a707f8
0000000180a707b8: mov      r9, qword ptr [rip + 0x7da8fa1] ; GenericMethodInfo 262050 @0x188819760
0000000180a707bf: mov      r8, rax
0000000180a707c2: mov      edx, 0x17
0000000180a707c7: mov      rcx, rbx
0000000180a707ca: call     0x1848dca60
0000000180a707cf: mov      rsi, qword ptr [rsp + 0x40]
0000000180a707d4: mov      rbx, qword ptr [rsp + 0x48]
0000000180a707d9: add      rsp, 0x30
0000000180a707dd: pop      rdi
0000000180a707de: ret      
0000000180a707df: xor      r9d, r9d
0000000180a707e2: movzx    r8d, dil
0000000180a707e6: mov      rdx, rbx
0000000180a707e9: mov      rbx, qword ptr [rsp + 0x48]
0000000180a707ee: add      rsp, 0x30
0000000180a707f2: pop      rdi
0000000180a707f3: jmp      0x1833005f0 ; XLua.DelegateBridge.__Gen_Delegate_Imp26 [2681]
0000000180a707f8: call     0x18048c0b0
0000000180a707fd: int3     
0000000180a707fe: call     0x18048c0b0
0000000180a70803: int3     
0000000180a70804: int3     
0000000180a70805: int3     
0000000180a70806: int3     
0000000180a70807: int3     
0000000180a70808: int3     
0000000180a70809: int3     
0000000180a7080a: int3     
0000000180a7080b: int3     
0000000180a7080c: int3     
0000000180a7080d: int3     
0000000180a7080e: int3     
0000000180a7080f: int3     