; Torappu.Battle.EnemySkill.Tick metadata=66312 token=0x6010309 VA=0x1806de520 RVA=0x6de520 size=0x320
00000001806de520: push     rsi
00000001806de522: push     rdi
00000001806de523: sub      rsp, 0x28
00000001806de527: cmp      byte ptr [rip + 0x85b2285], 0
00000001806de52e: mov      rdi, rdx
00000001806de531: mov      rsi, rcx
00000001806de534: jne      0x1806de561
00000001806de536: lea      rcx, [rip + 0x811c64b] ; GenericMethodInfo 289069 @0x1887fab88
00000001806de53d: call     0x18048bf00
00000001806de542: lea      rcx, [rip + 0x8160ed7] ; TypeInfo Torappu.Battle.EnemySkill @0x18883f420
00000001806de549: call     0x18048bf00
00000001806de54e: lea      rcx, [rip + 0x8254793] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001806de555: call     0x18048bf00
00000001806de55a: mov      byte ptr [rip + 0x85b2252], 1
00000001806de561: mov      rcx, qword ptr [rip + 0x8160eb8] ; TypeInfo Torappu.Battle.EnemySkill @0x18883f420
00000001806de568: mov      rax, qword ptr [rcx + 0xb8]
00000001806de56f: mov      r10, qword ptr [rax + 0x150]
00000001806de576: test     r10, r10
00000001806de579: jne      0x1806de813
00000001806de57f: mov      qword ptr [rsp + 0x40], rbx
00000001806de584: cmp      byte ptr [rip + 0x85b220d], r10b
00000001806de58b: jne      0x1806de5a7
00000001806de58d: lea      rcx, [rip + 0x8160e8c] ; TypeInfo Torappu.Battle.EnemySkill @0x18883f420
00000001806de594: call     0x18048bf00
00000001806de599: mov      rcx, qword ptr [rip + 0x8160e80] ; TypeInfo Torappu.Battle.EnemySkill @0x18883f420
00000001806de5a0: mov      byte ptr [rip + 0x85b21f1], 1
00000001806de5a7: mov      rax, qword ptr [rcx + 0xb8]
00000001806de5ae: mov      rcx, qword ptr [rax + 0x78]
00000001806de5b2: test     rcx, rcx
00000001806de5b5: jne      0x1806de5c0
00000001806de5b7: mov      rbx, qword ptr [rsi + 0x88]
00000001806de5be: jmp      0x1806de5ce
00000001806de5c0: xor      r8d, r8d
00000001806de5c3: mov      rdx, rsi
00000001806de5c6: call     0x1833327f0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3017 [5672]
00000001806de5cb: mov      rbx, rax
00000001806de5ce: mov      rcx, qword ptr [rip + 0x8254713] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001806de5d5: cmp      dword ptr [rcx + 0xe0], 0
00000001806de5dc: jne      0x1806de5e3
00000001806de5de: call     0x18048c140
00000001806de5e3: xor      r8d, r8d
00000001806de5e6: xor      edx, edx
00000001806de5e8: mov      rcx, rbx
00000001806de5eb: call     0x186b638d0
00000001806de5f0: test     al, al
00000001806de5f2: jne      0x1806de807
00000001806de5f8: cmp      byte ptr [rip + 0x85b21b6], al
00000001806de5fe: jne      0x1806de61f
00000001806de600: lea      rcx, [rip + 0x8160e19] ; TypeInfo Torappu.Battle.EnemySkill @0x18883f420
00000001806de607: call     0x18048bf00
00000001806de60c: lea      rcx, [rip + 0x817c0ed] ; TypeInfo Torappu.FP @0x18885a700
00000001806de613: call     0x18048bf00
00000001806de618: mov      byte ptr [rip + 0x85b2195], 1
00000001806de61f: mov      rcx, qword ptr [rip + 0x8160dfa] ; TypeInfo Torappu.Battle.EnemySkill @0x18883f420
00000001806de626: mov      qword ptr [rsp + 0x48], rbp
00000001806de62b: mov      qword ptr [rsp + 0x50], r12
00000001806de630: mov      qword ptr [rsp + 0x58], r14
00000001806de635: mov      rax, qword ptr [rcx + 0xb8]
00000001806de63c: mov      qword ptr [rsp + 0x20], r15
00000001806de641: mov      r10, qword ptr [rax + 0x158]
00000001806de648: test     r10, r10
00000001806de64b: jne      0x1806de76b
00000001806de651: cmp      byte ptr [rip + 0x85b2135], r10b
00000001806de658: jne      0x1806de674
00000001806de65a: lea      rcx, [rip + 0x8160dbf] ; TypeInfo Torappu.Battle.EnemySkill @0x18883f420
00000001806de661: call     0x18048bf00
00000001806de666: mov      rcx, qword ptr [rip + 0x8160db3] ; TypeInfo Torappu.Battle.EnemySkill @0x18883f420
00000001806de66d: mov      byte ptr [rip + 0x85b2119], 1
00000001806de674: mov      rax, qword ptr [rcx + 0xb8]
00000001806de67b: mov      rcx, qword ptr [rax + 0x20]
00000001806de67f: test     rcx, rcx
00000001806de682: jne      0x1806de68a
00000001806de684: mov      rax, qword ptr [rsi + 0x70]
00000001806de688: jmp      0x1806de695
00000001806de68a: xor      r8d, r8d
00000001806de68d: mov      rdx, rsi
00000001806de690: call     0x183324130 ; XLua.DelegateBridge.__Gen_Delegate_Imp2921 [5576]
00000001806de695: test     rax, rax
00000001806de698: je       0x1806de830
00000001806de69e: xor      edx, edx
00000001806de6a0: mov      rcx, rax
00000001806de6a3: call     0x1805d7e90 ; Torappu.Battle.Ability.get_isCasting [63037]
00000001806de6a8: test     al, al
00000001806de6aa: jne      0x1806de77c
00000001806de6b0: cmp      byte ptr [rip + 0x85b20e2], al
00000001806de6b6: mov      r14, qword ptr [rsi + 0x48]
00000001806de6ba: jne      0x1806de6cf
00000001806de6bc: lea      rcx, [rip + 0x8160d5d] ; TypeInfo Torappu.Battle.EnemySkill @0x18883f420
00000001806de6c3: call     0x18048bf00
00000001806de6c8: mov      byte ptr [rip + 0x85b20c9], 1
00000001806de6cf: mov      rax, qword ptr [rip + 0x8160d4a] ; TypeInfo Torappu.Battle.EnemySkill @0x18883f420
00000001806de6d6: mov      rcx, qword ptr [rax + 0xb8]
00000001806de6dd: mov      rcx, qword ptr [rcx + 0x78]
00000001806de6e1: test     rcx, rcx
00000001806de6e4: jne      0x1806de6ef
00000001806de6e6: mov      rax, qword ptr [rsi + 0x88]
00000001806de6ed: jmp      0x1806de6fa
00000001806de6ef: xor      r8d, r8d
00000001806de6f2: mov      rdx, rsi
00000001806de6f5: call     0x1833327f0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3017 [5672]
00000001806de6fa: test     rax, rax
00000001806de6fd: je       0x1806de830
00000001806de703: xor      edx, edx
00000001806de705: mov      rcx, rax
00000001806de708: call     0x180708350 ; Torappu.Battle.Entity.get_slowDown [66484]
00000001806de70d: mov      rcx, qword ptr [rip + 0x817bfec] ; TypeInfo Torappu.FP @0x18885a700
00000001806de714: mov      rbx, rax
00000001806de717: cmp      dword ptr [rcx + 0xe0], 0
00000001806de71e: jne      0x1806de725
00000001806de720: call     0x18048c140
00000001806de725: xor      r8d, r8d
00000001806de728: mov      rdx, rbx
00000001806de72b: mov      rcx, rdi
00000001806de72e: call     0x1866fb870 ; Torappu.FP.op_Multiply [220471] | Torappu.FP.FastMul [220473]
00000001806de733: mov      rbx, rax
00000001806de736: test     r14, r14
00000001806de739: je       0x1806de830
00000001806de73f: cmp      byte ptr [rip + 0x85ee0aa], 0
00000001806de746: jbe      0x1806de750
00000001806de748: mov      rcx, qword ptr [r14]
00000001806de74b: call     0x180446d00
00000001806de750: mov      r8, qword ptr [r14]
00000001806de753: mov      rdx, rbx
00000001806de756: mov      rcx, r14
00000001806de759: mov      rax, qword ptr [r8 + 0x190]
00000001806de760: mov      r8, qword ptr [r8 + 0x198]
00000001806de767: call     rax
00000001806de769: jmp      0x1806de77c
00000001806de76b: xor      r9d, r9d
00000001806de76e: mov      r8, rdi
00000001806de771: mov      rdx, rsi
00000001806de774: mov      rcx, r10
00000001806de777: call     0x1833f9830 ; XLua.DelegateBridge.__Gen_Delegate_Imp427 [3082]
00000001806de77c: mov      rdx, qword ptr [rip + 0x811c405] ; GenericMethodInfo 289069 @0x1887fab88
00000001806de783: xor      ebp, ebp
00000001806de785: mov      rcx, qword ptr [rsi + 0x68]
00000001806de789: call     0x1844afc00
00000001806de78e: movsxd   r12, eax
00000001806de791: test     eax, eax
00000001806de793: jle      0x1806de7f3
00000001806de795: mov      r15d, ebp
00000001806de798: mov      r14d, 0x20
00000001806de79e: nop      
00000001806de7a0: mov      rax, qword ptr [rsi + 0x68]
00000001806de7a4: test     rax, rax
00000001806de7a7: je       0x1806de830
00000001806de7ad: cmp      ebp, dword ptr [rax + 0x18]
00000001806de7b0: jae      0x1806de82a
00000001806de7b2: mov      rbx, qword ptr [r14 + rax]
00000001806de7b6: test     rbx, rbx
00000001806de7b9: je       0x1806de830
00000001806de7bb: cmp      byte ptr [rip + 0x85ee02e], 0
00000001806de7c2: jbe      0x1806de7cc
00000001806de7c4: mov      rcx, qword ptr [rbx]
00000001806de7c7: call     0x180446d00
00000001806de7cc: mov      r8, qword ptr [rbx]
00000001806de7cf: mov      rdx, rdi
00000001806de7d2: mov      rcx, rbx
00000001806de7d5: mov      rax, qword ptr [r8 + 0x1c0]
00000001806de7dc: mov      r8, qword ptr [r8 + 0x1c8]
00000001806de7e3: call     rax
00000001806de7e5: inc      ebp
00000001806de7e7: inc      r15
00000001806de7ea: add      r14, 8
00000001806de7ee: cmp      r15, r12
00000001806de7f1: jl       0x1806de7a0
00000001806de7f3: mov      r14, qword ptr [rsp + 0x58]
00000001806de7f8: mov      r12, qword ptr [rsp + 0x50]
00000001806de7fd: mov      rbp, qword ptr [rsp + 0x48]
00000001806de802: mov      r15, qword ptr [rsp + 0x20]
00000001806de807: mov      rbx, qword ptr [rsp + 0x40]
00000001806de80c: add      rsp, 0x28
00000001806de810: pop      rdi
00000001806de811: pop      rsi
00000001806de812: ret      
00000001806de813: xor      r9d, r9d
00000001806de816: mov      r8, rdi
00000001806de819: mov      rdx, rsi
00000001806de81c: mov      rcx, r10
00000001806de81f: add      rsp, 0x28
00000001806de823: pop      rdi
00000001806de824: pop      rsi
00000001806de825: jmp      0x1833f9830 ; XLua.DelegateBridge.__Gen_Delegate_Imp427 [3082]
00000001806de82a: call     0x18048c0a0
00000001806de82f: int3     
00000001806de830: call     0x18048c0b0
00000001806de835: int3     
00000001806de836: int3     
00000001806de837: int3     
00000001806de838: int3     
00000001806de839: int3     
00000001806de83a: int3     
00000001806de83b: int3     
00000001806de83c: int3     
00000001806de83d: int3     
00000001806de83e: int3     
00000001806de83f: int3     
