; Torappu.Battle.Action.Nodes.ApplyDamage.CreateDamageModifier metadata=96826 token=0x6017a3b VA=0x18104a3d0 RVA=0x104a3d0 size=0x2e0
000000018104a3d0: mov      qword ptr [rsp + 0x18], rbx
000000018104a3d5: push     rbp
000000018104a3d6: push     rsi
000000018104a3d7: push     r15
000000018104a3d9: sub      rsp, 0xd0
000000018104a3e0: cmp      byte ptr [rip + 0x7c4c2e0], 0
000000018104a3e7: mov      r15, r9
000000018104a3ea: mov      rbx, r8
000000018104a3ed: mov      rsi, rdx
000000018104a3f0: mov      rbp, rcx
000000018104a3f3: jne      0x18104a42c
000000018104a3f5: lea      rcx, [rip + 0x77cb14c] ; TypeInfo Torappu.Battle.Action.Nodes.ApplyDamage @0x188815548
000000018104a3fc: call     0x18048bf00
000000018104a401: lea      rcx, [rip + 0x78102f8] ; TypeInfo Torappu.FP @0x18885a700
000000018104a408: call     0x18048bf00
000000018104a40d: lea      rcx, [rip + 0x78e88d4] ; TypeInfo UnityEngine.Object @0x188932ce8
000000018104a414: call     0x18048bf00
000000018104a419: lea      rcx, [rip + 0x78471b8] ; TypeInfo Torappu.TSMath @0x1888915d8
000000018104a420: call     0x18048bf00
000000018104a425: mov      byte ptr [rip + 0x7c4c29b], 1
000000018104a42c: mov      rax, qword ptr [rip + 0x77cb115] ; TypeInfo Torappu.Battle.Action.Nodes.ApplyDamage @0x188815548
000000018104a433: mov      rcx, qword ptr [rax + 0xb8]
000000018104a43a: mov      rdx, qword ptr [rcx + 0x48]
000000018104a43e: test     rdx, rdx
000000018104a441: jne      0x18104a633
000000018104a447: mov      rcx, qword ptr [rip + 0x78e889a] ; TypeInfo UnityEngine.Object @0x188932ce8
000000018104a44e: cmp      dword ptr [rcx + 0xe0], edx
000000018104a454: jne      0x18104a45b
000000018104a456: call     0x18048c140
000000018104a45b: mov      qword ptr [rsp + 0xf0], rdi
000000018104a463: xor      r8d, r8d
000000018104a466: xor      edx, edx
000000018104a468: mov      qword ptr [rsp + 0xf8], r14
000000018104a470: mov      rcx, rbx
000000018104a473: call     0x186b63a70
000000018104a478: test     al, al
000000018104a47a: jne      0x18104a545
000000018104a480: mov      rcx, qword ptr [rip + 0x7810279] ; TypeInfo Torappu.FP @0x18885a700
000000018104a487: mov      rbx, qword ptr [rsi + 0x28]
000000018104a48b: cmp      dword ptr [rcx + 0xe0], 0
000000018104a492: jne      0x18104a499
000000018104a494: call     0x18048c140
000000018104a499: xor      edx, edx
000000018104a49b: xor      ecx, ecx
000000018104a49d: call     0x1866fdac0
000000018104a4a2: mov      rcx, qword ptr [rip + 0x784712f] ; TypeInfo Torappu.TSMath @0x1888915d8
000000018104a4a9: mov      rdi, rax
000000018104a4ac: cmp      dword ptr [rcx + 0xe0], 0
000000018104a4b3: jne      0x18104a4ba
000000018104a4b5: call     0x18048c140
000000018104a4ba: xor      r8d, r8d
000000018104a4bd: mov      rdx, rdi
000000018104a4c0: mov      rcx, rbx
000000018104a4c3: call     0x1866ff750
000000018104a4c8: cmp      byte ptr [rip + 0x7c4c1f1], 0
000000018104a4cf: mov      rbx, rax
000000018104a4d2: mov      edi, dword ptr [rsi + 0x10]
000000018104a4d5: mov      r14d, dword ptr [rsi + 0x14]
000000018104a4d9: jne      0x18104a4ee
000000018104a4db: lea      rcx, [rip + 0x77cb066] ; TypeInfo Torappu.Battle.Action.Nodes.ApplyDamage @0x188815548
000000018104a4e2: call     0x18048bf00
000000018104a4e7: mov      byte ptr [rip + 0x7c4c1d2], 1
000000018104a4ee: mov      rax, qword ptr [rip + 0x77cb053] ; TypeInfo Torappu.Battle.Action.Nodes.ApplyDamage @0x188815548
000000018104a4f5: mov      rcx, qword ptr [rax + 0xb8]
000000018104a4fc: mov      rcx, qword ptr [rcx + 0x10]
000000018104a500: test     rcx, rcx
000000018104a503: jne      0x18104a50b
000000018104a505: mov      rax, qword ptr [rsi + 0x30]
000000018104a509: jmp      0x18104a516
000000018104a50b: xor      r8d, r8d
000000018104a50e: mov      rdx, rsi
000000018104a511: call     0x1832f4c20 ; XLua.DelegateBridge.__Gen_Delegate_Imp2620 [5275]
000000018104a516: mov      ecx, dword ptr [rsi + 0x18]
000000018104a519: mov      r9d, edi
000000018104a51c: mov      qword ptr [rsp + 0x38], 0
000000018104a525: mov      r8, r15
000000018104a528: mov      dword ptr [rsp + 0x30], ecx
000000018104a52c: mov      rdx, rbx
000000018104a52f: mov      qword ptr [rsp + 0x28], rax
000000018104a534: lea      rcx, [rsp + 0x40]
000000018104a539: mov      dword ptr [rsp + 0x20], r14d
000000018104a53e: call     0x180aded30 ; Torappu.Battle.BattleUtil.CalculateDamageByAtkNoSource [78243]
000000018104a543: jmp      0x18104a5bd
000000018104a545: cmp      byte ptr [rip + 0x7c4c174], 0
000000018104a54c: mov      edi, dword ptr [rsi + 0x10]
000000018104a54f: mov      r14d, dword ptr [rsi + 0x14]
000000018104a553: jne      0x18104a568
000000018104a555: lea      rcx, [rip + 0x77cafec] ; TypeInfo Torappu.Battle.Action.Nodes.ApplyDamage @0x188815548
000000018104a55c: call     0x18048bf00
000000018104a561: mov      byte ptr [rip + 0x7c4c158], 1
000000018104a568: mov      rax, qword ptr [rip + 0x77cafd9] ; TypeInfo Torappu.Battle.Action.Nodes.ApplyDamage @0x188815548
000000018104a56f: mov      rcx, qword ptr [rax + 0xb8]
000000018104a576: mov      rcx, qword ptr [rcx + 0x10]
000000018104a57a: test     rcx, rcx
000000018104a57d: jne      0x18104a585
000000018104a57f: mov      rax, qword ptr [rsi + 0x30]
000000018104a583: jmp      0x18104a590
000000018104a585: xor      r8d, r8d
000000018104a588: mov      rdx, rsi
000000018104a58b: call     0x1832f4c20 ; XLua.DelegateBridge.__Gen_Delegate_Imp2620 [5275]
000000018104a590: mov      ecx, dword ptr [rsi + 0x18]
000000018104a593: mov      r9d, edi
000000018104a596: mov      qword ptr [rsp + 0x38], 0
000000018104a59f: mov      r8, r15
000000018104a5a2: mov      dword ptr [rsp + 0x30], ecx
000000018104a5a6: mov      rdx, rbx
000000018104a5a9: mov      qword ptr [rsp + 0x28], rax
000000018104a5ae: lea      rcx, [rsp + 0x40]
000000018104a5b3: mov      dword ptr [rsp + 0x20], r14d
000000018104a5b8: call     0x180adf370 ; Torappu.Battle.BattleUtil.CalculateDamageBySource [78242]
000000018104a5bd: movups   xmm0, xmmword ptr [rax]
000000018104a5c0: mov      rdi, qword ptr [rsp + 0xf0]
000000018104a5c8: movups   xmm1, xmmword ptr [rax + 0x10]
000000018104a5cc: mov      r14, qword ptr [rsp + 0xf8]
000000018104a5d4: movups   xmmword ptr [rbp], xmm0
000000018104a5d8: movups   xmm0, xmmword ptr [rax + 0x20]
000000018104a5dc: movups   xmmword ptr [rbp + 0x10], xmm1
000000018104a5e0: movups   xmm1, xmmword ptr [rax + 0x30]
000000018104a5e4: movups   xmmword ptr [rbp + 0x20], xmm0
000000018104a5e8: movups   xmm0, xmmword ptr [rax + 0x40]
000000018104a5ec: movups   xmmword ptr [rbp + 0x30], xmm1
000000018104a5f0: movups   xmm1, xmmword ptr [rax + 0x50]
000000018104a5f4: movups   xmmword ptr [rbp + 0x40], xmm0
000000018104a5f8: movups   xmm0, xmmword ptr [rax + 0x60]
000000018104a5fc: movups   xmmword ptr [rbp + 0x50], xmm1
000000018104a600: movups   xmm1, xmmword ptr [rax + 0x70]
000000018104a604: movups   xmmword ptr [rbp + 0x60], xmm0
000000018104a608: movsd    xmm0, qword ptr [rax + 0x80]
000000018104a610: mov      rax, rbp
000000018104a613: movups   xmmword ptr [rbp + 0x70], xmm1
000000018104a617: movsd    qword ptr [rbp + 0x80], xmm0
000000018104a61f: mov      rbx, qword ptr [rsp + 0x100]
000000018104a627: add      rsp, 0xd0
000000018104a62e: pop      r15
000000018104a630: pop      rsi
000000018104a631: pop      rbp
000000018104a632: ret      
000000018104a633: mov      qword ptr [rsp + 0x28], 0
000000018104a63c: lea      rcx, [rsp + 0x40]
000000018104a641: mov      r9, rbx
000000018104a644: mov      qword ptr [rsp + 0x20], r15
000000018104a649: mov      r8, rsi
000000018104a64c: call     0x18310af00 ; XLua.DelegateBridge.__Gen_Delegate_Imp11085 [13740]
000000018104a651: movups   xmm0, xmmword ptr [rax]
000000018104a654: movups   xmm1, xmmword ptr [rax + 0x10]
000000018104a658: movups   xmmword ptr [rbp], xmm0
000000018104a65c: movups   xmm0, xmmword ptr [rax + 0x20]
000000018104a660: movups   xmmword ptr [rbp + 0x10], xmm1
000000018104a664: movups   xmm1, xmmword ptr [rax + 0x30]
000000018104a668: movups   xmmword ptr [rbp + 0x20], xmm0
000000018104a66c: movups   xmm0, xmmword ptr [rax + 0x40]
000000018104a670: movups   xmmword ptr [rbp + 0x30], xmm1
000000018104a674: movups   xmm1, xmmword ptr [rax + 0x50]
000000018104a678: movups   xmmword ptr [rbp + 0x40], xmm0
000000018104a67c: movups   xmm0, xmmword ptr [rax + 0x60]
000000018104a680: movups   xmmword ptr [rbp + 0x50], xmm1
000000018104a684: movups   xmm1, xmmword ptr [rax + 0x70]
000000018104a688: movups   xmmword ptr [rbp + 0x60], xmm0
000000018104a68c: movsd    xmm0, qword ptr [rax + 0x80]
000000018104a694: mov      rax, rbp
000000018104a697: movups   xmmword ptr [rbp + 0x70], xmm1
000000018104a69b: movsd    qword ptr [rbp + 0x80], xmm0
000000018104a6a3: jmp      0x18104a61f
000000018104a6a8: int3     
000000018104a6a9: int3     
000000018104a6aa: int3     
000000018104a6ab: int3     
000000018104a6ac: int3     
000000018104a6ad: int3     
000000018104a6ae: int3     
000000018104a6af: int3     