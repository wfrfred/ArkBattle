; Torappu.Battle.EnemySkill.CastToTarget metadata=66305 token=0x6010302 VA=0x1806dd2d0 RVA=0x6dd2d0 size=0x290
00000001806dd2d0: mov      qword ptr [rsp + 0x10], rbx
00000001806dd2d5: mov      qword ptr [rsp + 0x18], rbp
00000001806dd2da: mov      qword ptr [rsp + 0x20], rsi
00000001806dd2df: push     r14
00000001806dd2e1: sub      rsp, 0x40
00000001806dd2e5: cmp      byte ptr [rip + 0x85b34c0], 0
00000001806dd2ec: mov      rsi, r9
00000001806dd2ef: mov      rbp, r8
00000001806dd2f2: mov      r14, rdx
00000001806dd2f5: mov      rbx, rcx
00000001806dd2f8: jne      0x1806dd325
00000001806dd2fa: lea      rcx, [rip + 0x8168caf] ; MethodInfo Torappu.Battle.EnemySkill._OnCastFinish [66319] @0x188845fb0
00000001806dd301: call     0x18048bf00
00000001806dd306: lea      rcx, [rip + 0x8162113] ; TypeInfo Torappu.Battle.EnemySkill @0x18883f420
00000001806dd30d: call     0x18048bf00
00000001806dd312: lea      rcx, [rip + 0x81c391f] ; TypeInfo Torappu.Battle.Ability.FinishCallbackDelegate @0x1888a0c38
00000001806dd319: call     0x18048bf00
00000001806dd31e: mov      byte ptr [rip + 0x85b3487], 1
00000001806dd325: mov      rax, qword ptr [rip + 0x81620f4] ; TypeInfo Torappu.Battle.EnemySkill @0x18883f420
00000001806dd32c: mov      qword ptr [rsp + 0x50], rdi
00000001806dd331: mov      rcx, qword ptr [rax + 0xb8]
00000001806dd338: mov      rcx, qword ptr [rcx + 0x118]
00000001806dd33f: test     rcx, rcx
00000001806dd342: jne      0x1806dd50e
00000001806dd348: lea      rcx, [rbx + 0x50]
00000001806dd34c: mov      qword ptr [rbx + 0x50], rsi
00000001806dd350: mov      rdx, rsi
00000001806dd353: call     0x18048b9e0
00000001806dd358: lea      rcx, [rbx + 0x58]
00000001806dd35c: mov      qword ptr [rbx + 0x58], rbp
00000001806dd360: mov      rdx, rbp
00000001806dd363: call     0x18048b9e0
00000001806dd368: cmp      byte ptr [rip + 0x85b341e], 0
00000001806dd36f: jne      0x1806dd384
00000001806dd371: lea      rcx, [rip + 0x81620a8] ; TypeInfo Torappu.Battle.EnemySkill @0x18883f420
00000001806dd378: call     0x18048bf00
00000001806dd37d: mov      byte ptr [rip + 0x85b3409], 1
00000001806dd384: mov      rax, qword ptr [rip + 0x8162095] ; TypeInfo Torappu.Battle.EnemySkill @0x18883f420
00000001806dd38b: mov      rcx, qword ptr [rax + 0xb8]
00000001806dd392: mov      rcx, qword ptr [rcx + 0x20]
00000001806dd396: test     rcx, rcx
00000001806dd399: jne      0x1806dd3a1
00000001806dd39b: mov      rax, qword ptr [rbx + 0x70]
00000001806dd39f: jmp      0x1806dd3ac
00000001806dd3a1: xor      r8d, r8d
00000001806dd3a4: mov      rdx, rbx
00000001806dd3a7: call     0x183324130 ; XLua.DelegateBridge.__Gen_Delegate_Imp2921 [5576]
00000001806dd3ac: test     rax, rax
00000001806dd3af: je       0x1806dd54c
00000001806dd3b5: xor      edx, edx
00000001806dd3b7: mov      rcx, rax
00000001806dd3ba: call     0x186b59d80
00000001806dd3bf: test     rax, rax
00000001806dd3c2: je       0x1806dd54c
00000001806dd3c8: xor      edx, edx
00000001806dd3ca: mov      rcx, rax
00000001806dd3cd: call     0x186b5c940
00000001806dd3d2: test     al, al
00000001806dd3d4: je       0x1806dd4ea
00000001806dd3da: mov      edx, dword ptr [rbx + 0x3c]
00000001806dd3dd: xor      r8d, r8d
00000001806dd3e0: mov      rcx, rbx
00000001806dd3e3: call     0x1806de840 ; Torappu.Battle.EnemySkill.TryReduceSp [66316]
00000001806dd3e8: test     al, al
00000001806dd3ea: je       0x1806dd4ea
00000001806dd3f0: xor      edx, edx
00000001806dd3f2: mov      rcx, rbx
00000001806dd3f5: call     0x1806df160 ; Torappu.Battle.EnemySkill.get_ability [66274]
00000001806dd3fa: mov      rcx, qword ptr [rip + 0x81c3837] ; TypeInfo Torappu.Battle.Ability.FinishCallbackDelegate @0x1888a0c38
00000001806dd401: mov      rdi, rax
00000001806dd404: call     0x18045cfe0
00000001806dd409: mov      rsi, rax
00000001806dd40c: test     rax, rax
00000001806dd40f: je       0x1806dd54c
00000001806dd415: mov      r8, qword ptr [rip + 0x8168b94] ; MethodInfo Torappu.Battle.EnemySkill._OnCastFinish [66319] @0x188845fb0
00000001806dd41c: xor      r9d, r9d
00000001806dd41f: mov      rdx, rbx
00000001806dd422: mov      rcx, rax
00000001806dd425: call     0x1805dd580 ; Torappu.Battle.Ability.FinishCallbackDelegate..ctor [63111] | XLua.__XLua_Gen_Delegate181..ctor [224734]
00000001806dd42a: test     rdi, rdi
00000001806dd42d: je       0x1806dd54c
00000001806dd433: cmp      byte ptr [rip + 0x85ef3b6], 0
00000001806dd43a: jbe      0x1806dd444
00000001806dd43c: mov      rcx, qword ptr [rdi]
00000001806dd43f: call     0x180446d00
00000001806dd444: mov      rax, qword ptr [rdi]
00000001806dd447: mov      r8, rsi
00000001806dd44a: movzx    r9d, byte ptr [rsp + 0x70]
00000001806dd450: mov      rdx, r14
00000001806dd453: mov      rcx, rdi
00000001806dd456: mov      r10, qword ptr [rax + 0x350]
00000001806dd45d: mov      rax, qword ptr [rax + 0x358]
00000001806dd464: mov      qword ptr [rsp + 0x20], rax
00000001806dd469: call     r10
00000001806dd46c: test     al, al
00000001806dd46e: je       0x1806dd4ea
00000001806dd470: mov      rdx, qword ptr [rbx + 0x48]
00000001806dd474: test     rdx, rdx
00000001806dd477: je       0x1806dd54c
00000001806dd47d: mov      ecx, 7
00000001806dd482: call     0x180005610
00000001806dd487: mov      ecx, 0x10
00000001806dd48c: mov      rdx, rbx
00000001806dd48f: call     0x180005610
00000001806dd494: inc      dword ptr [rbx + 0x40]
00000001806dd497: cmp      byte ptr [rip + 0x85b3317], 0
00000001806dd49e: jne      0x1806dd4b3
00000001806dd4a0: lea      rcx, [rip + 0x8161f79] ; TypeInfo Torappu.Battle.EnemySkill @0x18883f420
00000001806dd4a7: call     0x18048bf00
00000001806dd4ac: mov      byte ptr [rip + 0x85b3302], 1
00000001806dd4b3: mov      rax, qword ptr [rip + 0x8161f66] ; TypeInfo Torappu.Battle.EnemySkill @0x18883f420
00000001806dd4ba: mov      rcx, qword ptr [rax + 0xb8]
00000001806dd4c1: mov      rcx, qword ptr [rcx + 0x160]
00000001806dd4c8: xor      r8d, r8d
00000001806dd4cb: test     rcx, rcx
00000001806dd4ce: jne      0x1806dd4de
00000001806dd4d0: mov      dl, 1
00000001806dd4d2: mov      rcx, rbx
00000001806dd4d5: call     0x1806dfed0 ; Torappu.Battle.EnemySkill.set_registeredAsModifier [66291]
00000001806dd4da: mov      al, 1
00000001806dd4dc: jmp      0x1806dd531
00000001806dd4de: mov      rdx, rbx
00000001806dd4e1: call     0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
00000001806dd4e6: mov      al, 1
00000001806dd4e8: jmp      0x1806dd531
00000001806dd4ea: xor      edi, edi
00000001806dd4ec: lea      rcx, [rbx + 0x50]
00000001806dd4f0: xor      edx, edx
00000001806dd4f2: mov      qword ptr [rbx + 0x50], rdi
00000001806dd4f6: call     0x18048b9e0
00000001806dd4fb: lea      rcx, [rbx + 0x58]
00000001806dd4ff: mov      qword ptr [rbx + 0x58], rdi
00000001806dd503: xor      edx, edx
00000001806dd505: call     0x18048b9e0
00000001806dd50a: xor      al, al
00000001806dd50c: jmp      0x1806dd531
00000001806dd50e: movzx    eax, byte ptr [rsp + 0x70]
00000001806dd513: xor      edi, edi
00000001806dd515: mov      qword ptr [rsp + 0x30], rdi
00000001806dd51a: mov      r9, rbp
00000001806dd51d: mov      byte ptr [rsp + 0x28], al
00000001806dd521: mov      r8, r14
00000001806dd524: mov      rdx, rbx
00000001806dd527: mov      qword ptr [rsp + 0x20], rsi
00000001806dd52c: call     0x183332a60 ; XLua.DelegateBridge.__Gen_Delegate_Imp3018 [5673]
00000001806dd531: mov      rdi, qword ptr [rsp + 0x50]
00000001806dd536: mov      rbx, qword ptr [rsp + 0x58]
00000001806dd53b: mov      rbp, qword ptr [rsp + 0x60]
00000001806dd540: mov      rsi, qword ptr [rsp + 0x68]
00000001806dd545: add      rsp, 0x40
00000001806dd549: pop      r14
00000001806dd54b: ret      
00000001806dd54c: call     0x18048c0b0
00000001806dd551: int3     
00000001806dd552: int3     
00000001806dd553: int3     
00000001806dd554: int3     
00000001806dd555: int3     
00000001806dd556: int3     
00000001806dd557: int3     
00000001806dd558: int3     
00000001806dd559: int3     
00000001806dd55a: int3     
00000001806dd55b: int3     
00000001806dd55c: int3     
00000001806dd55d: int3     
00000001806dd55e: int3     
00000001806dd55f: int3     
