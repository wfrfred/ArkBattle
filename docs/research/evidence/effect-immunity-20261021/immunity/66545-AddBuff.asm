; Torappu.Battle.Entity.AddBuff metadata=66545 token=0x60103f2 VA=0x1806ef4a0 RVA=0x6ef4a0 size=0x270
00000001806ef4a0: mov      qword ptr [rsp + 8], rbx
00000001806ef4a5: mov      qword ptr [rsp + 0x10], rbp
00000001806ef4aa: mov      qword ptr [rsp + 0x18], rsi
00000001806ef4af: push     rdi
00000001806ef4b0: sub      rsp, 0x70
00000001806ef4b4: cmp      byte ptr [rip + 0x85a13cd], 0
00000001806ef4bb: mov      rbx, r9
00000001806ef4be: mov      rdi, r8
00000001806ef4c1: mov      rsi, rdx
00000001806ef4c4: mov      rbp, rcx
00000001806ef4c7: jne      0x1806ef4dc
00000001806ef4c9: lea      rcx, [rip + 0x8151e98] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806ef4d0: call     0x18048bf00
00000001806ef4d5: mov      byte ptr [rip + 0x85a13ac], 1
00000001806ef4dc: mov      rax, qword ptr [rip + 0x8151e85] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806ef4e3: xorps    xmm0, xmm0
00000001806ef4e6: movups   xmmword ptr [rsp + 0x50], xmm0
00000001806ef4eb: cmp      dword ptr [rax + 0xe0], 0
00000001806ef4f2: jne      0x1806ef503
00000001806ef4f4: mov      rcx, rax
00000001806ef4f7: call     0x18048c140
00000001806ef4fc: mov      rax, qword ptr [rip + 0x8151e65] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806ef503: mov      rax, qword ptr [rax + 0xb8]
00000001806ef50a: mov      rcx, qword ptr [rax + 0x5d8]
00000001806ef511: test     rcx, rcx
00000001806ef514: jne      0x1806ef58b
00000001806ef516: xor      r8d, r8d
00000001806ef519: lea      rdx, [rsp + 0x50]
00000001806ef51e: mov      rcx, rsi
00000001806ef521: call     0x180af40b0 ; Torappu.Battle.BuffDBUtil.TryGetBuff [78272]
00000001806ef526: test     al, al
00000001806ef528: je       0x1806ef5f1
00000001806ef52e: mov      rax, qword ptr [rsp + 0xb8]
00000001806ef536: lea      rdx, [rsp + 0x60]
00000001806ef53b: movaps   xmm0, xmmword ptr [rsp + 0x50]
00000001806ef540: mov      r9, rbx
00000001806ef543: mov      qword ptr [rsp + 0x40], 0
00000001806ef54c: mov      r8, rdi
00000001806ef54f: mov      qword ptr [rsp + 0x38], rax
00000001806ef554: mov      rcx, rbp
00000001806ef557: mov      rax, qword ptr [rsp + 0xb0]
00000001806ef55f: mov      qword ptr [rsp + 0x30], rax
00000001806ef564: mov      rax, qword ptr [rsp + 0xa8]
00000001806ef56c: mov      qword ptr [rsp + 0x28], rax
00000001806ef571: mov      rax, qword ptr [rsp + 0xa0]
00000001806ef579: mov      qword ptr [rsp + 0x20], rax
00000001806ef57e: movdqa   xmmword ptr [rsp + 0x60], xmm0
00000001806ef584: call     0x1806ef340 ; Torappu.Battle.Entity.AddBuff [66544]
00000001806ef589: jmp      0x1806ef5db
00000001806ef58b: mov      rax, qword ptr [rsp + 0xb8]
00000001806ef593: mov      r9, rdi
00000001806ef596: mov      qword ptr [rsp + 0x48], 0
00000001806ef59f: mov      r8, rsi
00000001806ef5a2: mov      qword ptr [rsp + 0x40], rax
00000001806ef5a7: mov      rdx, rbp
00000001806ef5aa: mov      rax, qword ptr [rsp + 0xb0]
00000001806ef5b2: mov      qword ptr [rsp + 0x38], rax
00000001806ef5b7: mov      rax, qword ptr [rsp + 0xa8]
00000001806ef5bf: mov      qword ptr [rsp + 0x30], rax
00000001806ef5c4: mov      rax, qword ptr [rsp + 0xa0]
00000001806ef5cc: mov      qword ptr [rsp + 0x28], rax
00000001806ef5d1: mov      qword ptr [rsp + 0x20], rbx
00000001806ef5d6: call     0x1833364f0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3043 [5698]
00000001806ef5db: lea      r11, [rsp + 0x70]
00000001806ef5e0: mov      rbx, qword ptr [r11 + 0x10]
00000001806ef5e4: mov      rbp, qword ptr [r11 + 0x18]
00000001806ef5e8: mov      rsi, qword ptr [r11 + 0x20]
00000001806ef5ec: mov      rsp, r11
00000001806ef5ef: pop      rdi
00000001806ef5f0: ret      
00000001806ef5f1: lea      rcx, [rip + 0x8243320] ; TypeInfo type(0x1d, data=0x188a2ad40) @0x188932918
00000001806ef5f8: call     0x18048bf20
00000001806ef5fd: mov      rcx, rax
00000001806ef600: mov      edx, 5
00000001806ef605: call     0x18048ba50
00000001806ef60a: mov      rcx, rax
00000001806ef60d: mov      rdi, rax
00000001806ef610: call     0x180005cb0
00000001806ef615: lea      rcx, [rip + 0x81084f4] ; StringLiteral '[Entity] Buff key ' @0x1887f7b10
00000001806ef61c: call     0x18048bf20
00000001806ef621: mov      r8, rax
00000001806ef624: xor      edx, edx
00000001806ef626: mov      rcx, rdi
00000001806ef629: call     0x180005fe0
00000001806ef62e: mov      rcx, rsi
00000001806ef631: call     0x180005cb0
00000001806ef636: mov      rbx, qword ptr [rsi + 0x18]
00000001806ef63a: mov      rcx, rdi
00000001806ef63d: call     0x180005cb0
00000001806ef642: mov      r8, rbx
00000001806ef645: mov      edx, 1
00000001806ef64a: mov      rcx, rdi
00000001806ef64d: call     0x180005fe0
00000001806ef652: mov      rcx, rdi
00000001806ef655: call     0x180005cb0
00000001806ef65a: lea      rcx, [rip + 0x821ec9f] ; StringLiteral ' is invalid or template key ' @0x18890e300
00000001806ef661: call     0x18048bf20
00000001806ef666: mov      r8, rax
00000001806ef669: mov      edx, 2
00000001806ef66e: mov      rcx, rdi
00000001806ef671: call     0x180005fe0
00000001806ef676: mov      rcx, rsi
00000001806ef679: call     0x180005cb0
00000001806ef67e: mov      rbx, qword ptr [rsi + 0x30]
00000001806ef682: mov      rcx, rdi
00000001806ef685: call     0x180005cb0
00000001806ef68a: mov      r8, rbx
00000001806ef68d: mov      edx, 3
00000001806ef692: mov      rcx, rdi
00000001806ef695: call     0x180005fe0
00000001806ef69a: mov      rcx, rdi
00000001806ef69d: call     0x180005cb0
00000001806ef6a2: lea      rcx, [rip + 0x821ee97] ; StringLiteral ' is invalid!' @0x18890e540
00000001806ef6a9: call     0x18048bf20
00000001806ef6ae: mov      r8, rax
00000001806ef6b1: mov      edx, 4
00000001806ef6b6: mov      rcx, rdi
00000001806ef6b9: call     0x180005fe0
00000001806ef6be: xor      edx, edx
00000001806ef6c0: mov      rcx, rdi
00000001806ef6c3: call     0x185db3d00
00000001806ef6c8: lea      rcx, [rip + 0x81bcf81] ; TypeInfo Torappu.GameDataException @0x1888ac650
00000001806ef6cf: mov      rbx, rax
00000001806ef6d2: call     0x18048bf20
00000001806ef6d7: mov      rcx, rax
00000001806ef6da: call     0x18045cfe0
00000001806ef6df: mov      rcx, rax
00000001806ef6e2: mov      rdi, rax
00000001806ef6e5: call     0x180005cb0
00000001806ef6ea: xor      r8d, r8d
00000001806ef6ed: mov      rdx, rbx
00000001806ef6f0: mov      rcx, rdi
00000001806ef6f3: call     0x181a957d0 ; Torappu.GameDataException..ctor [22359]
00000001806ef6f8: lea      rcx, [rip + 0x8159549] ; MethodInfo Torappu.Battle.Entity.AddBuff [66545] @0x188848c48
00000001806ef6ff: call     0x18048bf20
00000001806ef704: mov      rdx, rax
00000001806ef707: mov      rcx, rdi
00000001806ef70a: call     0x18048c070
00000001806ef70f: int3     