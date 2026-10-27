; Torappu.Battle.Projectile.ActionController._RunActions metadata=71449 token=0x601171a VA=0x1808ca1f0 RVA=0x8ca1f0 size=0x2a0
00000001808ca1f0: mov      qword ptr [rsp + 0x18], rbx
00000001808ca1f5: mov      dword ptr [rsp + 0x10], edx
00000001808ca1f9: mov      qword ptr [rsp + 8], rcx
00000001808ca1fe: push     rsi
00000001808ca1ff: push     rdi
00000001808ca200: push     r14
00000001808ca202: sub      rsp, 0x140
00000001808ca209: mov      r14, r8
00000001808ca20c: movsxd   rdi, edx
00000001808ca20f: mov      rbx, rcx
00000001808ca212: cmp      byte ptr [rip + 0x83c7644], 0
00000001808ca219: jne      0x1808ca22e
00000001808ca21b: lea      rcx, [rip + 0x8068ac6] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808ca222: call     0x18048bf00
00000001808ca227: mov      byte ptr [rip + 0x83c762f], 1
00000001808ca22e: mov      rsi, qword ptr [rbx + 0x58]
00000001808ca232: test     rsi, rsi
00000001808ca235: je       0x1808ca454
00000001808ca23b: cmp      byte ptr [rip + 0x83c75a6], 0
00000001808ca242: jne      0x1808ca263
00000001808ca244: lea      rcx, [rip + 0x7f591ad] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808ca24b: call     0x18048bf00
00000001808ca250: lea      rcx, [rip + 0x80096b1] ; GenericMethodInfo 281972 @0x1888d3908
00000001808ca257: call     0x18048bf00
00000001808ca25c: mov      byte ptr [rip + 0x83c7585], 1
00000001808ca263: mov      rax, qword ptr [rip + 0x7f5918e] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808ca26a: mov      rcx, qword ptr [rax + 0xb8]
00000001808ca271: mov      rcx, qword ptr [rcx + 0xd0]
00000001808ca278: test     rcx, rcx
00000001808ca27b: jne      0x1808ca29e
00000001808ca27d: mov      rcx, qword ptr [rip + 0x8009684] ; GenericMethodInfo 281972 @0x1888d3908
00000001808ca284: call     0x185337c50
00000001808ca289: test     rax, rax
00000001808ca28c: je       0x1808ca454
00000001808ca292: xor      edx, edx
00000001808ca294: mov      rcx, rax
00000001808ca297: call     0x180640a10 ; Torappu.Battle.BattleController.get_context [64505]
00000001808ca29c: jmp      0x1808ca2a9
00000001808ca29e: xor      r8d, r8d
00000001808ca2a1: mov      rdx, rsi
00000001808ca2a4: call     0x1832f6680 ; XLua.DelegateBridge.__Gen_Delegate_Imp2632 [5287]
00000001808ca2a9: test     rax, rax
00000001808ca2ac: je       0x1808ca454
00000001808ca2b2: xor      edx, edx
00000001808ca2b4: mov      rcx, rax
00000001808ca2b7: call     0x1806c5c20 ; Torappu.Battle.Context.BeginChangeGard [65685]
00000001808ca2bc: mov      qword ptr [rsp + 0x30], rax
00000001808ca2c1: xor      esi, esi
00000001808ca2c3: mov      qword ptr [rsp + 0x38], rsi
00000001808ca2c8: lea      rax, [rsp + 0x30]
00000001808ca2cd: mov      qword ptr [rsp + 0x40], rax
00000001808ca2d2: xor      r8d, r8d
00000001808ca2d5: mov      rdx, qword ptr [rbx + 0x58]
00000001808ca2d9: lea      rcx, [rsp + 0x30]
00000001808ca2de: call     0x1806c3690 ; Torappu.Battle.Context.ChangeGuard.set_projectile [65712]
00000001808ca2e3: mov      rcx, qword ptr [rbx + 0x58]
00000001808ca2e7: test     rcx, rcx
00000001808ca2ea: je       0x1808ca474
00000001808ca2f0: xor      edx, edx
00000001808ca2f2: call     0x1808dd7b0 ; Torappu.Battle.Projectile.get_source [71293]
00000001808ca2f7: xor      r8d, r8d
00000001808ca2fa: mov      rdx, rax
00000001808ca2fd: lea      rcx, [rsp + 0x30]
00000001808ca302: call     0x1806c3720 ; Torappu.Battle.Context.ChangeGuard.set_source [65702]
00000001808ca307: mov      rcx, qword ptr [rip + 0x80689da] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808ca30e: cmp      dword ptr [rcx + 0xe0], esi
00000001808ca314: jne      0x1808ca31b
00000001808ca316: call     0x18048c140
00000001808ca31b: xor      r8d, r8d
00000001808ca31e: xor      edx, edx
00000001808ca320: mov      rcx, r14
00000001808ca323: call     0x186b638d0
00000001808ca328: test     al, al
00000001808ca32a: je       0x1808ca343
00000001808ca32c: mov      rcx, qword ptr [rbx + 0x58]
00000001808ca330: test     rcx, rcx
00000001808ca333: je       0x1808ca460
00000001808ca339: xor      edx, edx
00000001808ca33b: call     0x1808ddae0 ; Torappu.Battle.Projectile.get_traceTarget [71296]
00000001808ca340: mov      r14, rax
00000001808ca343: xor      r8d, r8d
00000001808ca346: mov      rdx, r14
00000001808ca349: lea      rcx, [rsp + 0x30]
00000001808ca34e: call     0x1806c37b0 ; Torappu.Battle.Context.ChangeGuard.set_target [65704]
00000001808ca353: mov      rcx, qword ptr [rbx + 0x58]
00000001808ca357: test     rcx, rcx
00000001808ca35a: je       0x1808ca46f
00000001808ca360: xor      edx, edx
00000001808ca362: call     0x1808ddae0 ; Torappu.Battle.Projectile.get_traceTarget [71296]
00000001808ca367: xor      r8d, r8d
00000001808ca36a: mov      rdx, rax
00000001808ca36d: lea      rcx, [rsp + 0x30]
00000001808ca372: call     0x1806c34f0 ; Torappu.Battle.Context.ChangeGuard.set_mainTarget [65718]
00000001808ca377: mov      rcx, qword ptr [rbx + 0x58]
00000001808ca37b: test     rcx, rcx
00000001808ca37e: je       0x1808ca46a
00000001808ca384: xor      edx, edx
00000001808ca386: call     0x1808dcb90 ; Torappu.Battle.Projectile.get_ability [71298]
00000001808ca38b: xor      r8d, r8d
00000001808ca38e: mov      rdx, rax
00000001808ca391: lea      rcx, [rsp + 0x30]
00000001808ca396: call     0x1806c3290 ; Torappu.Battle.Context.ChangeGuard.set_ability [65708]
00000001808ca39b: mov      rax, qword ptr [rbx + 0x28]
00000001808ca39f: test     rax, rax
00000001808ca3a2: je       0x1808ca465
00000001808ca3a8: cmp      edi, dword ptr [rax + 0x18]
00000001808ca3ab: jae      0x1808ca45a
00000001808ca3b1: mov      qword ptr [rsp + 0x20], rsi
00000001808ca3b6: mov      r9, qword ptr [rbx + 0x50]
00000001808ca3ba: mov      r8d, 4
00000001808ca3c0: mov      rdx, qword ptr [rax + rdi*8 + 0x20]
00000001808ca3c5: lea      rcx, [rsp + 0x50]
00000001808ca3ca: call     0x1811903e0 ; Torappu.Battle.Action.ActionUtil.RunActions [100609]
00000001808ca3cf: nop      
00000001808ca3d0: xor      edx, edx
00000001808ca3d2: lea      rcx, [rsp + 0x30]
00000001808ca3d7: call     0x1806c2ce0 ; Torappu.Battle.Context.ChangeGuard.Dispose [65721]
00000001808ca3dc: jmp      0x1808ca407
00000001808ca3de: xor      edx, edx
00000001808ca3e0: lea      rcx, [rsp + 0x30]
00000001808ca3e5: call     0x1806c2ce0 ; Torappu.Battle.Context.ChangeGuard.Dispose [65721]
00000001808ca3ea: mov      rcx, qword ptr [rsp + 0x38]
00000001808ca3ef: test     rcx, rcx
00000001808ca3f2: jne      0x1808ca47a
00000001808ca3f8: mov      edi, dword ptr [rsp + 0x168]
00000001808ca3ff: mov      rbx, qword ptr [rsp + 0x160]
00000001808ca407: mov      rcx, qword ptr [rbx + 0x58]
00000001808ca40b: test     rcx, rcx
00000001808ca40e: je       0x1808ca454
00000001808ca410: mov      rcx, qword ptr [rcx + 0x90]
00000001808ca417: test     rcx, rcx
00000001808ca41a: je       0x1808ca454
00000001808ca41c: cmp      edi, dword ptr [rcx + 0x18]
00000001808ca41f: jae      0x1808ca480
00000001808ca421: movsxd   rax, edi
00000001808ca424: mov      rcx, qword ptr [rcx + rax*8 + 0x20]
00000001808ca429: test     rcx, rcx
00000001808ca42c: je       0x1808ca440
00000001808ca42e: mov      rax, qword ptr [rcx + 0x18]
00000001808ca432: mov      r8, qword ptr [rcx + 0x28]
00000001808ca436: mov      rdx, qword ptr [rbx + 0x58]
00000001808ca43a: mov      rcx, qword ptr [rcx + 0x40]
00000001808ca43e: call     rax
00000001808ca440: mov      rbx, qword ptr [rsp + 0x170]
00000001808ca448: add      rsp, 0x140
00000001808ca44f: pop      r14
00000001808ca451: pop      rdi
00000001808ca452: pop      rsi
00000001808ca453: ret      
00000001808ca454: call     0x18048c0b0
00000001808ca459: nop      
00000001808ca45a: call     0x18048c0a0
00000001808ca45f: nop      
00000001808ca460: call     0x18048c0b0
00000001808ca465: call     0x18048c0b0
00000001808ca46a: call     0x18048c0b0
00000001808ca46f: call     0x18048c0b0
00000001808ca474: call     0x18048c0b0
00000001808ca479: nop      
00000001808ca47a: call     0x180472d50
00000001808ca47f: int3     
00000001808ca480: call     0x18048c0a0
00000001808ca485: int3     
00000001808ca486: int3     
00000001808ca487: int3     
00000001808ca488: int3     
00000001808ca489: int3     
00000001808ca48a: int3     
00000001808ca48b: int3     
00000001808ca48c: int3     
00000001808ca48d: int3     
00000001808ca48e: int3     
00000001808ca48f: int3     