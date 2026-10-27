; Torappu.Battle.NetCatcherProjectile.OnProjectileStop metadata=71246 token=0x601164f VA=0x1808d4480 RVA=0x8d4480 size=0x1d0
00000001808d4480: push     rbx
00000001808d4482: sub      rsp, 0x30
00000001808d4486: cmp      byte ptr [rip + 0x83bd332], 0
00000001808d448d: mov      rbx, rcx
00000001808d4490: jne      0x1808d44ed
00000001808d4492: lea      rcx, [rip + 0x80538c7] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
00000001808d4499: call     0x18048bf00
00000001808d449e: lea      rcx, [rip + 0x80965ab] ; GenericMethodInfo 285168 @0x18896aa50
00000001808d44a5: call     0x18048bf00
00000001808d44aa: lea      rcx, [rip + 0x7f97db7] ; TypeInfo Torappu.Battle.Character @0x18886c268
00000001808d44b1: call     0x18048bf00
00000001808d44b6: lea      rcx, [rip + 0x7f471f3] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
00000001808d44bd: call     0x18048bf00
00000001808d44c2: lea      rcx, [rip + 0x804d5af] ; TypeInfo Torappu.Battle.NetCatcherProjectile @0x188921a78
00000001808d44c9: call     0x18048bf00
00000001808d44ce: lea      rcx, [rip + 0x80610d3] ; GenericMethodInfo 280377 @0x1889355a8
00000001808d44d5: call     0x18048bf00
00000001808d44da: lea      rcx, [rip + 0x805e807] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808d44e1: call     0x18048bf00
00000001808d44e6: mov      byte ptr [rip + 0x83bd2d2], 1
00000001808d44ed: mov      rax, qword ptr [rip + 0x804d584] ; TypeInfo Torappu.Battle.NetCatcherProjectile @0x188921a78
00000001808d44f4: mov      rcx, qword ptr [rax + 0xb8]
00000001808d44fb: mov      rcx, qword ptr [rcx + 0x28]
00000001808d44ff: test     rcx, rcx
00000001808d4502: jne      0x1808d4638
00000001808d4508: mov      qword ptr [rsp + 0x40], rdi
00000001808d450d: xor      edx, edx
00000001808d450f: mov      rcx, rbx
00000001808d4512: call     0x1808d97d0 ; Torappu.Battle.Projectile.OnProjectileStop [71361]
00000001808d4517: cmp      byte ptr [rbx + 0x1c8], 0
00000001808d451e: je       0x1808d460c
00000001808d4524: movups   xmm0, xmmword ptr [rbx + 0x1b8]
00000001808d452b: mov      rdx, qword ptr [rip + 0x809651e] ; GenericMethodInfo 285168 @0x18896aa50
00000001808d4532: lea      rcx, [rsp + 0x20]
00000001808d4537: movaps   xmmword ptr [rsp + 0x20], xmm0
00000001808d453c: call     0x18449ab40
00000001808d4541: test     al, al
00000001808d4543: je       0x1808d460c
00000001808d4549: mov      byte ptr [rbx + 0x1c8], 0
00000001808d4550: lea      rcx, [rbx + 0x1b8]
00000001808d4557: mov      rdx, qword ptr [rip + 0x806104a] ; GenericMethodInfo 280377 @0x1889355a8
00000001808d455e: call     0x185159d80
00000001808d4563: mov      rdx, qword ptr [rip + 0x7f47146] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
00000001808d456a: mov      rcx, rax
00000001808d456d: call     0x1800057a0
00000001808d4572: mov      rcx, qword ptr [rip + 0x805e76f] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808d4579: mov      rdi, rax
00000001808d457c: cmp      dword ptr [rcx + 0xe0], 0
00000001808d4583: jne      0x1808d458a
00000001808d4585: call     0x18048c140
00000001808d458a: xor      r8d, r8d
00000001808d458d: xor      edx, edx
00000001808d458f: mov      rcx, rdi
00000001808d4592: call     0x186b63a70
00000001808d4597: test     al, al
00000001808d4599: je       0x1808d460c
00000001808d459b: test     rdi, rdi
00000001808d459e: je       0x1808d4648
00000001808d45a4: mov      ecx, 0xea
00000001808d45a9: mov      r8, rbx
00000001808d45ac: mov      rdx, rdi
00000001808d45af: call     0x180005480
00000001808d45b4: xor      edx, edx
00000001808d45b6: mov      byte ptr [rbx + 0x219], 1
00000001808d45bd: mov      rcx, rbx
00000001808d45c0: call     0x1808dd7b0 ; Torappu.Battle.Projectile.get_source [71293]
00000001808d45c5: mov      rdx, qword ptr [rip + 0x7f97c9c] ; TypeInfo Torappu.Battle.Character @0x18886c268
00000001808d45cc: mov      rcx, rax
00000001808d45cf: call     0x1800057a0
00000001808d45d4: mov      rcx, qword ptr [rip + 0x805e70d] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808d45db: mov      rdi, rax
00000001808d45de: cmp      dword ptr [rcx + 0xe0], 0
00000001808d45e5: jne      0x1808d45ec
00000001808d45e7: call     0x18048c140
00000001808d45ec: xor      r8d, r8d
00000001808d45ef: xor      edx, edx
00000001808d45f1: mov      rcx, rdi
00000001808d45f4: call     0x186b63a70
00000001808d45f9: test     al, al
00000001808d45fb: je       0x1808d460c
00000001808d45fd: test     rdi, rdi
00000001808d4600: je       0x1808d4648
00000001808d4602: xor      edx, edx
00000001808d4604: mov      rcx, rdi
00000001808d4607: call     0x180a31400 ; Torappu.Battle.Character.SearchBlockeeImmediate [75955]
00000001808d460c: mov      rcx, qword ptr [rip + 0x805374d] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
00000001808d4613: cmp      dword ptr [rcx + 0xe0], 0
00000001808d461a: jne      0x1808d4621
00000001808d461c: call     0x18048c140
00000001808d4621: xor      r8d, r8d
00000001808d4624: mov      dl, 1
00000001808d4626: mov      rcx, rbx
00000001808d4629: mov      rdi, qword ptr [rsp + 0x40]
00000001808d462e: add      rsp, 0x30
00000001808d4632: pop      rbx
00000001808d4633: jmp      0x180633870 ; Torappu.Battle.BattleController.StopAllBattleCoroutines [64745]
00000001808d4638: xor      r8d, r8d
00000001808d463b: mov      rdx, rbx
00000001808d463e: add      rsp, 0x30
00000001808d4642: pop      rbx
00000001808d4643: jmp      0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
00000001808d4648: call     0x18048c0b0
00000001808d464d: int3     
00000001808d464e: int3     
00000001808d464f: int3     