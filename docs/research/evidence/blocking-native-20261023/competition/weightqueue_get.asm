; Torappu.Battle.FilterUtil.weightqueue_get metadata=-1 token=0x0 VA=0x1851b36f0 RVA=0x51b36f0 size=0x120
00000001851b36f0: mov      qword ptr [rsp + 8], rbx
00000001851b36f5: mov      qword ptr [rsp + 0x10], rbp
00000001851b36fa: mov      qword ptr [rsp + 0x18], rsi
00000001851b36ff: push     rdi
00000001851b3700: sub      rsp, 0x40
00000001851b3704: mov      rsi, qword ptr [rdx + 0x10]
00000001851b3708: mov      rbx, r9
00000001851b370b: mov      ebp, r8d
00000001851b370e: mov      rdi, rcx
00000001851b3711: test     rsi, rsi
00000001851b3714: je       0x1851b3785
00000001851b3716: mov      rax, qword ptr [r9 + 0x20]
00000001851b371a: mov      rdx, qword ptr [rax + 0xc0]
00000001851b3721: mov      rax, qword ptr [rdx + 0x18]
00000001851b3725: cmp      qword ptr [rax + 0x20], 0
00000001851b372a: jne      0x1851b373d
00000001851b372c: mov      rax, qword ptr [r9 + 0x20]
00000001851b3730: mov      r8, qword ptr [rax + 0xc0]
00000001851b3737: mov      rax, qword ptr [r8 + 0x18]
00000001851b373b: call     qword ptr [rax]
00000001851b373d: mov      rax, qword ptr [rbx + 0x20]
00000001851b3741: lea      rcx, [rsp + 0x20]
00000001851b3746: mov      r8d, ebp
00000001851b3749: mov      rdx, rsi
00000001851b374c: mov      r9, qword ptr [rax + 0xc0]
00000001851b3753: mov      r9, qword ptr [r9 + 0x18]
00000001851b3757: call     0x184ae93d0
00000001851b375c: movups   xmm0, xmmword ptr [rsp + 0x20]
00000001851b3761: mov      rbx, qword ptr [rsp + 0x50]
00000001851b3766: mov      rax, rdi
00000001851b3769: movups   xmm1, xmmword ptr [rsp + 0x30]
00000001851b376e: mov      rbp, qword ptr [rsp + 0x58]
00000001851b3773: mov      rsi, qword ptr [rsp + 0x60]
00000001851b3778: movups   xmmword ptr [rdi], xmm0
00000001851b377b: movups   xmmword ptr [rdi + 0x10], xmm1
00000001851b377f: add      rsp, 0x40
00000001851b3783: pop      rdi
00000001851b3784: ret      
00000001851b3785: call     0x18048c0b0
00000001851b378a: int3     
00000001851b378b: int3     
00000001851b378c: int3     
00000001851b378d: int3     
00000001851b378e: int3     
00000001851b378f: int3     
00000001851b3790: mov      qword ptr [rsp + 8], rbx
00000001851b3795: mov      qword ptr [rsp + 0x10], rbp
00000001851b379a: mov      qword ptr [rsp + 0x18], rsi
00000001851b379f: push     rdi
00000001851b37a0: sub      rsp, 0x60
00000001851b37a4: mov      rsi, qword ptr [rdx + 0x10]
00000001851b37a8: mov      rbx, r9
00000001851b37ab: mov      ebp, r8d
00000001851b37ae: mov      rdi, rcx
00000001851b37b1: test     rsi, rsi
00000001851b37b4: je       0x1851b383e
00000001851b37ba: mov      rax, qword ptr [r9 + 0x20]
00000001851b37be: mov      rdx, qword ptr [rax + 0xc0]
00000001851b37c5: mov      rax, qword ptr [rdx + 0x18]
00000001851b37c9: cmp      qword ptr [rax + 0x20], 0
00000001851b37ce: jne      0x1851b37e1
00000001851b37d0: mov      rax, qword ptr [r9 + 0x20]
00000001851b37d4: mov      r8, qword ptr [rax + 0xc0]
00000001851b37db: mov      rax, qword ptr [r8 + 0x18]
00000001851b37df: call     qword ptr [rax]
00000001851b37e1: mov      rax, qword ptr [rbx + 0x20]
00000001851b37e5: lea      rcx, [rsp + 0x20]
00000001851b37ea: mov      r8d, ebp
00000001851b37ed: mov      rdx, rsi
00000001851b37f0: mov      r9, qword ptr [rax + 0xc0]
00000001851b37f7: mov      r9, qword ptr [r9 + 0x18]
00000001851b37fb: call     0x184b80cd0
00000001851b3800: movups   xmm0, xmmword ptr [rsp + 0x20]
00000001851b3805: mov      rbx, qword ptr [rsp + 0x70]
00000001851b380a: mov      rax, rdi