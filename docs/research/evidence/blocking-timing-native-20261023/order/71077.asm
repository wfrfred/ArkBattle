; Torappu.Battle.ObjectManager.OnFixedUpdate metadata=71077 token=0x60115a6 VA=0x1808d5300 RVA=0x8d5300 size=0x1d0
00000001808d5300: push     rbx
00000001808d5302: push     rsi
00000001808d5303: sub      rsp, 0x28
00000001808d5307: cmp      byte ptr [rip + 0x83bc43e], 0
00000001808d530e: mov      rbx, rdx
00000001808d5311: mov      rsi, rcx
00000001808d5314: jne      0x1808d5365
00000001808d5316: lea      rcx, [rip + 0x7f86e8b] ; GenericMethodInfo 270124 @0x18885c1a8
00000001808d531d: call     0x18048bf00
00000001808d5322: lea      rcx, [rip + 0x7f870af] ; GenericMethodInfo 270125 @0x18885c3d8
00000001808d5329: call     0x18048bf00
00000001808d532e: lea      rcx, [rip + 0x7f872db] ; GenericMethodInfo 270126 @0x18885c610
00000001808d5335: call     0x18048bf00
00000001808d533a: lea      rcx, [rip + 0x7f874ff] ; GenericMethodInfo 270127 @0x18885c840
00000001808d5341: call     0x18048bf00
00000001808d5346: lea      rcx, [rip + 0x809b573] ; GenericMethodInfo 280718 @0x1889708c0
00000001808d534d: call     0x18048bf00
00000001808d5352: lea      rcx, [rip + 0x809b7a7] ; GenericMethodInfo 280719 @0x188970b00
00000001808d5359: call     0x18048bf00
00000001808d535e: mov      byte ptr [rip + 0x83bc3e7], 1
00000001808d5365: mov      rcx, qword ptr [rsi + 0x10]
00000001808d5369: mov      qword ptr [rsp + 0x40], rbp
00000001808d536e: mov      qword ptr [rsp + 0x48], rdi
00000001808d5373: mov      qword ptr [rsp + 0x50], r14
00000001808d5378: mov      qword ptr [rsp + 0x20], r15
00000001808d537d: test     rcx, rcx
00000001808d5380: je       0x1808d54c1
00000001808d5386: mov      rdx, qword ptr [rip + 0x809b773] ; GenericMethodInfo 280719 @0x188970b00
00000001808d538d: call     0x1848dd0d0
00000001808d5392: mov      rcx, qword ptr [rsi + 0x18]
00000001808d5396: mov      r15d, eax
00000001808d5399: test     rcx, rcx
00000001808d539c: je       0x1808d54c1
00000001808d53a2: mov      r8d, dword ptr [rcx + 0x18]
00000001808d53a6: xor      ebp, ebp
00000001808d53a8: inc      dword ptr [rcx + 0x1c]
00000001808d53ab: mov      dword ptr [rcx + 0x18], ebp
00000001808d53ae: test     r8d, r8d
00000001808d53b1: jle      0x1808d53c1
00000001808d53b3: mov      rcx, qword ptr [rcx + 0x10]
00000001808d53b7: xor      r9d, r9d
00000001808d53ba: xor      edx, edx
00000001808d53bc: call     0x185ee99a0
00000001808d53c1: mov      edi, ebp
00000001808d53c3: test     r15d, r15d
00000001808d53c6: jle      0x1808d5443
00000001808d53c8: nop      dword ptr [rax + rax]
00000001808d53d0: mov      rcx, qword ptr [rsi + 0x10]
00000001808d53d4: test     rcx, rcx
00000001808d53d7: je       0x1808d54c1
00000001808d53dd: mov      r8, qword ptr [rip + 0x809b4dc] ; GenericMethodInfo 280718 @0x1889708c0
00000001808d53e4: mov      edx, edi
00000001808d53e6: call     0x184ac5e60
00000001808d53eb: test     rax, rax
00000001808d53ee: je       0x1808d54c1
00000001808d53f4: xor      edx, edx
00000001808d53f6: mov      rcx, rax
00000001808d53f9: call     0x180663080 ; Torappu.Battle.BObject.get_validAndBorned [65019]
00000001808d53fe: test     al, al
00000001808d5400: je       0x1808d543c
00000001808d5402: mov      rcx, qword ptr [rsi + 0x10]
00000001808d5406: mov      r14, qword ptr [rsi + 0x18]
00000001808d540a: test     rcx, rcx
00000001808d540d: je       0x1808d54c1
00000001808d5413: mov      r8, qword ptr [rip + 0x809b4a6] ; GenericMethodInfo 280718 @0x1889708c0
00000001808d541a: mov      edx, edi
00000001808d541c: call     0x184ac5e60
00000001808d5421: test     r14, r14
00000001808d5424: je       0x1808d54c1
00000001808d542a: mov      r8, qword ptr [rip + 0x7f86d77] ; GenericMethodInfo 270124 @0x18885c1a8
00000001808d5431: mov      rdx, rax
00000001808d5434: mov      rcx, r14
00000001808d5437: call     0x1805072d0
00000001808d543c: inc      edi
00000001808d543e: cmp      edi, r15d
00000001808d5441: jl       0x1808d53d0
00000001808d5443: mov      r14, qword ptr [rsi + 0x18]
00000001808d5447: test     r14, r14
00000001808d544a: je       0x1808d54c1
00000001808d544c: mov      r14d, dword ptr [r14 + 0x18]
00000001808d5450: test     r14d, r14d
00000001808d5453: jle      0x1808d54a6
00000001808d5455: mov      rcx, qword ptr [rsi + 0x18]
00000001808d5459: test     rcx, rcx
00000001808d545c: je       0x1808d54c1
00000001808d545e: mov      r8, qword ptr [rip + 0x7f873db] ; GenericMethodInfo 270127 @0x18885c840
00000001808d5465: mov      edx, ebp
00000001808d5467: call     0x184afcf00
00000001808d546c: mov      rdi, rax
00000001808d546f: test     rax, rax
00000001808d5472: je       0x1808d54c1
00000001808d5474: cmp      byte ptr [rip + 0x83f7375], 0
00000001808d547b: jbe      0x1808d5485
00000001808d547d: mov      rcx, qword ptr [rax]
00000001808d5480: call     0x180446d00
00000001808d5485: mov      r8, qword ptr [rdi]
00000001808d5488: mov      rdx, rbx
00000001808d548b: mov      rcx, rdi
00000001808d548e: mov      r9, qword ptr [r8 + 0x2f0]
00000001808d5495: mov      r8, qword ptr [r8 + 0x2f8]
00000001808d549c: call     r9
00000001808d549f: inc      ebp
00000001808d54a1: cmp      ebp, r14d
00000001808d54a4: jl       0x1808d5455
00000001808d54a6: mov      r15, qword ptr [rsp + 0x20]
00000001808d54ab: mov      r14, qword ptr [rsp + 0x50]
00000001808d54b0: mov      rdi, qword ptr [rsp + 0x48]
00000001808d54b5: mov      rbp, qword ptr [rsp + 0x40]
00000001808d54ba: add      rsp, 0x28
00000001808d54be: pop      rsi
00000001808d54bf: pop      rbx
00000001808d54c0: ret      
00000001808d54c1: call     0x18048c0b0
00000001808d54c6: int3     
00000001808d54c7: int3     
00000001808d54c8: int3     
00000001808d54c9: int3     
00000001808d54ca: int3     
00000001808d54cb: int3     
00000001808d54cc: int3     
00000001808d54cd: int3     
00000001808d54ce: int3     
00000001808d54cf: int3     