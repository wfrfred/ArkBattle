; Torappu.Battle.FilterUtil.interface-ec metadata=-1 token=0x0 VA=0x180005540 RVA=0x5540 size=0x100
0000000180005540: mov      qword ptr [rsp + 8], rbx
0000000180005545: mov      qword ptr [rsp + 0x10], rsi
000000018000554a: push     rdi
000000018000554b: sub      rsp, 0x20
000000018000554f: cmp      byte ptr [rip + 0x8cc729a], 0
0000000180005556: movzx    edi, r8b
000000018000555a: mov      rbx, rdx
000000018000555d: movzx    esi, cx
0000000180005560: jbe      0x18000556a
0000000180005562: mov      rcx, qword ptr [rdx]
0000000180005565: call     0x180446d00
000000018000556a: mov      rax, qword ptr [rbx]
000000018000556d: lea      r8, [rsi + 0x14]
0000000180005571: add      r8, r8
0000000180005574: movzx    edx, dil
0000000180005578: mov      rcx, rbx
000000018000557b: mov      r9, qword ptr [rax + r8*8]
000000018000557f: mov      r8, qword ptr [rax + r8*8 + 8]
0000000180005584: mov      rbx, qword ptr [rsp + 0x30]
0000000180005589: mov      rsi, qword ptr [rsp + 0x38]
000000018000558e: add      rsp, 0x20
0000000180005592: pop      rdi
0000000180005593: jmp      r9
0000000180005596: int3     
0000000180005597: int3     
0000000180005598: int3     
0000000180005599: int3     
000000018000559a: int3     
000000018000559b: int3     
000000018000559c: int3     
000000018000559d: int3     
000000018000559e: int3     
000000018000559f: int3     
00000001800055a0: mov      qword ptr [rsp + 8], rbx
00000001800055a5: mov      qword ptr [rsp + 0x10], rbp
00000001800055aa: mov      qword ptr [rsp + 0x18], rsi
00000001800055af: push     rdi
00000001800055b0: sub      rsp, 0x20
00000001800055b4: cmp      byte ptr [rip + 0x8cc7235], 0
00000001800055bb: mov      rdi, r9
00000001800055be: mov      rsi, r8
00000001800055c1: movzx    ebp, cx
00000001800055c4: mov      rbx, rdx
00000001800055c7: jbe      0x1800055d1
00000001800055c9: mov      rcx, qword ptr [rdx]
00000001800055cc: call     0x180446d00
00000001800055d1: mov      rax, qword ptr [rbx]
00000001800055d4: lea      r9, [rbp + 0x14]
00000001800055d8: add      r9, r9
00000001800055db: mov      r8, rdi
00000001800055de: mov      rdx, rsi
00000001800055e1: mov      rcx, rbx
00000001800055e4: mov      r10, qword ptr [rax + r9*8]
00000001800055e8: mov      r9, qword ptr [rax + r9*8 + 8]
00000001800055ed: mov      rbx, qword ptr [rsp + 0x30]
00000001800055f2: mov      rbp, qword ptr [rsp + 0x38]
00000001800055f7: mov      rsi, qword ptr [rsp + 0x40]
00000001800055fc: add      rsp, 0x20
0000000180005600: pop      rdi
0000000180005601: jmp      r10
0000000180005604: int3     
0000000180005605: int3     
0000000180005606: int3     
0000000180005607: int3     
0000000180005608: int3     
0000000180005609: int3     
000000018000560a: int3     
000000018000560b: int3     
000000018000560c: int3     
000000018000560d: int3     
000000018000560e: int3     
000000018000560f: int3     
0000000180005610: mov      qword ptr [rsp + 8], rbx
0000000180005615: push     rdi
0000000180005616: sub      rsp, 0x20
000000018000561a: cmp      byte ptr [rip + 0x8cc71cf], 0
0000000180005621: mov      rbx, rdx
0000000180005624: movzx    edi, cx
0000000180005627: jbe      0x180005631
0000000180005629: mov      rcx, qword ptr [rdx]
000000018000562c: call     0x180446d00
0000000180005631: mov      rax, qword ptr [rbx]
0000000180005634: lea      rdx, [rdi + 0x14]
0000000180005638: add      rdx, rdx
000000018000563b: mov      rcx, rbx