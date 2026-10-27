; Torappu.Battle.NetCatcherProjectile.<DoLink>d__29.MoveNext metadata=71269 token=0x6011666 VA=0x1808e4340 RVA=0x8e4340 size=0x310
00000001808e4340: mov      qword ptr [rsp + 0x20], rbx
00000001808e4345: push     rsi
00000001808e4346: sub      rsp, 0x70
00000001808e434a: cmp      byte ptr [rip + 0x83ad47a], 0
00000001808e4351: mov      rbx, rcx
00000001808e4354: jne      0x1808e4399
00000001808e4356: lea      rcx, [rip + 0x7f37353] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
00000001808e435d: call     0x18048bf00
00000001808e4362: lea      rcx, [rip + 0x7f4f977] ; TypeInfo type(0x15, data=0x188a36200) @0x188833ce0
00000001808e4369: call     0x18048bf00
00000001808e436e: lea      rcx, [rip + 0x7fdb1a3] ; MethodInfo Torappu.Battle.NetCatcherProjectile.<DoLink>b__29_0 [71258] @0x1888bf518
00000001808e4375: call     0x18048bf00
00000001808e437a: lea      rcx, [rip + 0x804e967] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808e4381: call     0x18048bf00
00000001808e4386: lea      rcx, [rip + 0x7f86243] ; TypeInfo Torappu.Battle.Yields @0x18886a5d0
00000001808e438d: call     0x18048bf00
00000001808e4392: mov      byte ptr [rip + 0x83ad432], 1
00000001808e4399: mov      ecx, dword ptr [rbx + 0x10]
00000001808e439c: mov      rsi, qword ptr [rbx + 0x28]
00000001808e43a0: mov      qword ptr [rsp + 0x80], rbp
00000001808e43a8: mov      qword ptr [rsp + 0x88], rdi
00000001808e43b0: mov      qword ptr [rsp + 0x90], r14
00000001808e43b8: movaps   xmmword ptr [rsp + 0x60], xmm6
00000001808e43bd: movaps   xmmword ptr [rsp + 0x50], xmm7
00000001808e43c2: movaps   xmmword ptr [rsp + 0x40], xmm8
00000001808e43c8: test     ecx, ecx
00000001808e43ca: je       0x1808e44a2
00000001808e43d0: sub      ecx, 1
00000001808e43d3: je       0x1808e43df
00000001808e43d5: sub      ecx, 1
00000001808e43d8: je       0x1808e43ed
00000001808e43da: cmp      ecx, 1
00000001808e43dd: jne      0x1808e43e6
00000001808e43df: mov      dword ptr [rbx + 0x10], 0xffffffff
00000001808e43e6: xor      al, al
00000001808e43e8: jmp      0x1808e4612
00000001808e43ed: mov      dword ptr [rbx + 0x10], 0xffffffff
00000001808e43f4: test     rsi, rsi
00000001808e43f7: je       0x1808e4648
00000001808e43fd: xor      edx, edx
00000001808e43ff: mov      rcx, rsi
00000001808e4402: call     0x1808ddb50 ; Torappu.Battle.Projectile.get_type [71299]
00000001808e4407: cmp      eax, 2
00000001808e440a: je       0x1808e43e6
00000001808e440c: mov      rcx, qword ptr [rip + 0x7f4f8cd] ; TypeInfo type(0x15, data=0x188a36200) @0x188833ce0
00000001808e4413: mov      r14, qword ptr [rbx + 0x30]
00000001808e4417: movss    xmm6, dword ptr [rsi + 0x200]
00000001808e441f: movss    xmm7, dword ptr [rsi + 0x204]
00000001808e4427: movss    xmm8, dword ptr [rsi + 0x1e4]
00000001808e4430: call     0x18045cfe0
00000001808e4435: mov      rbp, rax
00000001808e4438: test     rax, rax
00000001808e443b: je       0x1808e4648
00000001808e4441: mov      r8, qword ptr [rip + 0x7fdb0d0] ; MethodInfo Torappu.Battle.NetCatcherProjectile.<DoLink>b__29_0 [71258] @0x1888bf518
00000001808e4448: xor      r9d, r9d
00000001808e444b: mov      rdx, rsi
00000001808e444e: mov      rcx, rax
00000001808e4451: call     0x180518030
00000001808e4456: movzx    r8d, byte ptr [rsi + 0x1e8]
00000001808e445e: xor      edi, edi
00000001808e4460: mov      qword ptr [rsp + 0x30], rdi
00000001808e4465: movaps   xmm3, xmm8
00000001808e4469: mov      byte ptr [rsp + 0x28], r8b
00000001808e446e: mov      rdx, r14
00000001808e4471: unpcklps xmm6, xmm7
00000001808e4474: mov      rcx, rsi
00000001808e4477: movq     r8, xmm6
00000001808e447c: mov      qword ptr [rsp + 0x20], rbp
00000001808e4481: call     0x1808d4de0 ; Torappu.Battle.NetCatcherProjectile._DoPull [71255]
00000001808e4486: lea      rcx, [rbx + 0x18]
00000001808e448a: mov      qword ptr [rbx + 0x18], rax
00000001808e448e: mov      rdx, rax
00000001808e4491: call     0x18048b9e0
00000001808e4496: mov      dword ptr [rbx + 0x10], 3
00000001808e449d: jmp      0x1808e4610
00000001808e44a2: mov      r14, qword ptr [rbx + 0x20]
00000001808e44a6: mov      dword ptr [rbx + 0x10], 0xffffffff
00000001808e44ad: mov      rdx, qword ptr [rip + 0x7f371fc] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
00000001808e44b4: test     r14, r14
00000001808e44b7: jne      0x1808e44c4
00000001808e44b9: xor      edi, edi
00000001808e44bb: mov      qword ptr [rbx + 0x30], rdi
00000001808e44bf: jmp      0x1808e456c
00000001808e44c4: cmp      byte ptr [rip + 0x83e8325], 0
00000001808e44cb: mov      r8, qword ptr [r14]
00000001808e44ce: jbe      0x1808e44e8
00000001808e44d0: mov      rcx, r8
00000001808e44d3: call     0x1804463e0
00000001808e44d8: xor      edi, edi
00000001808e44da: test     al, al
00000001808e44dc: mov      ecx, edi
00000001808e44de: cmovne   rcx, r14
00000001808e44e2: mov      qword ptr [rbx + 0x30], rcx
00000001808e44e6: jmp      0x1808e451f
00000001808e44e8: movzx    eax, byte ptr [rdx + 0x130]
00000001808e44ef: xor      edi, edi
00000001808e44f1: cmp      byte ptr [r8 + 0x130], al
00000001808e44f8: jb       0x1808e4510
00000001808e44fa: movzx    ecx, al
00000001808e44fd: mov      rax, qword ptr [r8 + 0xc8]
00000001808e4504: cmp      qword ptr [rax + rcx*8 - 8], rdx
00000001808e4509: mov      ecx, 1
00000001808e450e: je       0x1808e4512
00000001808e4510: mov      ecx, edi
00000001808e4512: test     ecx, ecx
00000001808e4514: mov      rax, rdi
00000001808e4517: cmovne   rax, r14
00000001808e451b: mov      qword ptr [rbx + 0x30], rax
00000001808e451f: cmp      byte ptr [rip + 0x83e82ca], 0
00000001808e4526: mov      rdx, qword ptr [rip + 0x7f37183] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
00000001808e452d: mov      r8, qword ptr [r14]
00000001808e4530: jbe      0x1808e453e
00000001808e4532: mov      rcx, r8
00000001808e4535: call     0x1804463e0
00000001808e453a: test     al, al
00000001808e453c: jmp      0x1808e4568
00000001808e453e: movzx    eax, byte ptr [rdx + 0x130]
00000001808e4545: cmp      byte ptr [r8 + 0x130], al
00000001808e454c: jb       0x1808e4564
00000001808e454e: movzx    ecx, al
00000001808e4551: mov      rax, qword ptr [r8 + 0xc8]
00000001808e4558: cmp      qword ptr [rax + rcx*8 - 8], rdx
00000001808e455d: mov      eax, 1
00000001808e4562: je       0x1808e4566
00000001808e4564: mov      eax, edi
00000001808e4566: test     eax, eax
00000001808e4568: cmovne   rdi, r14
00000001808e456c: lea      rcx, [rbx + 0x30]
00000001808e4570: mov      rdx, rdi
00000001808e4573: call     0x18048b9e0
00000001808e4578: mov      rcx, qword ptr [rip + 0x804e769] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808e457f: mov      rdi, qword ptr [rbx + 0x30]
00000001808e4583: cmp      dword ptr [rcx + 0xe0], 0
00000001808e458a: jne      0x1808e4591
00000001808e458c: call     0x18048c140
00000001808e4591: xor      r8d, r8d
00000001808e4594: xor      edx, edx
00000001808e4596: mov      rcx, rdi
00000001808e4599: call     0x186b638d0
00000001808e459e: test     al, al
00000001808e45a0: jne      0x1808e45d3
00000001808e45a2: test     rsi, rsi
00000001808e45a5: je       0x1808e4648
00000001808e45ab: mov      rdx, qword ptr [rbx + 0x20]
00000001808e45af: xor      r8d, r8d
00000001808e45b2: mov      rcx, rsi
00000001808e45b5: call     0x1808d2340 ; Torappu.Battle.LinkProjectile.DoLink [71181]
00000001808e45ba: lea      rcx, [rbx + 0x18]
00000001808e45be: mov      qword ptr [rbx + 0x18], rax
00000001808e45c2: mov      rdx, rax
00000001808e45c5: call     0x18048b9e0
00000001808e45ca: mov      dword ptr [rbx + 0x10], 2
00000001808e45d1: jmp      0x1808e4610
00000001808e45d3: mov      rax, qword ptr [rip + 0x7f85ff6] ; TypeInfo Torappu.Battle.Yields @0x18886a5d0
00000001808e45da: cmp      dword ptr [rax + 0xe0], 0
00000001808e45e1: jne      0x1808e45f2
00000001808e45e3: mov      rcx, rax
00000001808e45e6: call     0x18048c140
00000001808e45eb: mov      rax, qword ptr [rip + 0x7f85fde] ; TypeInfo Torappu.Battle.Yields @0x18886a5d0
00000001808e45f2: mov      rax, qword ptr [rax + 0xb8]
00000001808e45f9: lea      rcx, [rbx + 0x18]
00000001808e45fd: mov      rdx, qword ptr [rax]
00000001808e4600: mov      qword ptr [rbx + 0x18], rdx
00000001808e4604: call     0x18048b9e0
00000001808e4609: mov      dword ptr [rbx + 0x10], 1
00000001808e4610: mov      al, 1
00000001808e4612: movaps   xmm8, xmmword ptr [rsp + 0x40]
00000001808e4618: movaps   xmm7, xmmword ptr [rsp + 0x50]
00000001808e461d: movaps   xmm6, xmmword ptr [rsp + 0x60]
00000001808e4622: mov      r14, qword ptr [rsp + 0x90]
00000001808e462a: mov      rdi, qword ptr [rsp + 0x88]
00000001808e4632: mov      rbp, qword ptr [rsp + 0x80]
00000001808e463a: mov      rbx, qword ptr [rsp + 0x98]
00000001808e4642: add      rsp, 0x70
00000001808e4646: pop      rsi
00000001808e4647: ret      
00000001808e4648: call     0x18048c0b0
00000001808e464d: int3     
00000001808e464e: int3     
00000001808e464f: int3     