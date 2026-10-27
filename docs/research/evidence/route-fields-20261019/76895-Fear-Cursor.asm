; Torappu.Battle.Enemy.FearController.UpdateFearCursor metadata=76895 token=0x6012c60 VA=0x180a91730 RVA=0xa91730 size=0x310
0000000180a91730: mov      qword ptr [rsp + 0x10], rbx
0000000180a91735: mov      qword ptr [rsp + 0x18], rsi
0000000180a9173a: push     rdi
0000000180a9173b: sub      rsp, 0xb0
0000000180a91742: cmp      byte ptr [rip + 0x820128b], 0
0000000180a91749: movzx    esi, dl
0000000180a9174c: mov      rbx, rcx
0000000180a9174f: jne      0x180a917a0
0000000180a91751: lea      rcx, [rip + 0x7dafe98] ; GenericMethodInfo 287058 @0x1888415f0
0000000180a91758: call     0x18048bf00
0000000180a9175d: lea      rcx, [rip + 0x7edb994] ; TypeInfo Torappu.Battle.DirectionCursor @0x18896d0f8
0000000180a91764: call     0x18048bf00
0000000180a91769: lea      rcx, [rip + 0x7d7cc18] ; GenericMethodInfo 292362 @0x18880e388
0000000180a91770: call     0x18048bf00
0000000180a91775: lea      rcx, [rip + 0x7e3f9b4] ; GenericMethodInfo 263114 @0x1888d1130
0000000180a9177c: call     0x18048bf00
0000000180a91781: lea      rcx, [rip + 0x7db1f10] ; GenericMethodInfo 267367 @0x188843698
0000000180a91788: call     0x18048bf00
0000000180a9178d: lea      rcx, [rip + 0x7e4e9b4] ; GenericMethodInfo 282061 @0x1888e0148
0000000180a91794: call     0x18048bf00
0000000180a91799: mov      byte ptr [rip + 0x8201234], 1
0000000180a917a0: mov      rcx, qword ptr [rip + 0x7e4e9a1] ; GenericMethodInfo 282061 @0x1888e0148
0000000180a917a7: mov      qword ptr [rsp + 0xc0], rbp
0000000180a917af: movaps   xmmword ptr [rsp + 0xa0], xmm6
0000000180a917b7: movaps   xmmword ptr [rsp + 0x90], xmm7
0000000180a917bf: movaps   xmmword ptr [rsp + 0x80], xmm8
0000000180a917c8: call     0x185337c50
0000000180a917cd: mov      rcx, qword ptr [rbx + 0x10]
0000000180a917d1: mov      rdi, rax
0000000180a917d4: test     rcx, rcx
0000000180a917d7: je       0x180a91a2f
0000000180a917dd: xor      edx, edx
0000000180a917df: call     0x180ad4090 ; Torappu.Battle.VisualObject.get_gridPosition [77871]
0000000180a917e4: test     rdi, rdi
0000000180a917e7: je       0x180a91a2f
0000000180a917ed: xor      r8d, r8d
0000000180a917f0: mov      rdx, rax
0000000180a917f3: mov      rcx, rdi
0000000180a917f6: call     0x18087a3a0 ; Torappu.Battle.Map.CheckGridValid [70066]
0000000180a917fb: test     al, al
0000000180a917fd: je       0x180a91946
0000000180a91803: mov      rax, qword ptr [rbx + 0x18]
0000000180a91807: test     rax, rax
0000000180a9180a: je       0x180a91a2f
0000000180a91810: cmp      dword ptr [rax + 0x18], 0
0000000180a91814: jle      0x180a91946
0000000180a9181a: mov      r8, qword ptr [rip + 0x7dafdcf] ; GenericMethodInfo 287058 @0x1888415f0
0000000180a91821: lea      rcx, [rsp + 0x50]
0000000180a91826: mov      rdx, qword ptr [rbx + 0x18]
0000000180a9182a: call     0x1844ad0a0
0000000180a9182f: mov      rdi, qword ptr [rsp + 0x50]
0000000180a91834: test     rdi, rdi
0000000180a91837: je       0x180a91847
0000000180a91839: xor      edx, edx
0000000180a9183b: mov      rcx, rdi
0000000180a9183e: call     0x18068ef80 ; Torappu.Battle.Buff.get_isValid [65107]
0000000180a91843: test     al, al
0000000180a91845: jne      0x180a9186b
0000000180a91847: mov      r8, qword ptr [rip + 0x7d7cb3a] ; GenericMethodInfo 292362 @0x18880e388
0000000180a9184e: lea      rcx, [rsp + 0x60]
0000000180a91853: mov      rdx, qword ptr [rbx + 0x18]
0000000180a91857: call     0x1844d22e0
0000000180a9185c: mov      rax, qword ptr [rbx + 0x18]
0000000180a91860: test     rax, rax
0000000180a91863: je       0x180a91a2f
0000000180a91869: jmp      0x180a91810
0000000180a9186b: test     sil, sil
0000000180a9186e: jne      0x180a918b3
0000000180a91870: cmp      qword ptr [rbx + 0x20], 0
0000000180a91875: je       0x180a918b3
0000000180a91877: mov      rcx, qword ptr [rbx + 0x20]
0000000180a9187b: xor      edx, edx
0000000180a9187d: call     0x180898140 ; Torappu.Battle.DirectionCursor.get_cursorIndex [70265]
0000000180a91882: mov      rcx, qword ptr [rbx + 0x20]
0000000180a91886: mov      esi, eax
0000000180a91888: test     rcx, rcx
0000000180a9188b: je       0x180a91a2f
0000000180a91891: xor      edx, edx
0000000180a91893: call     0x180877390 ; Torappu.Battle.BasicCursor.get_route [70151]
0000000180a91898: test     rax, rax
0000000180a9189b: je       0x180a91a2f
0000000180a918a1: xor      edx, edx
0000000180a918a3: mov      rcx, rax
0000000180a918a6: call     0x1808a4420 ; Torappu.Battle.Route.get_checkpointCnt [70354]
0000000180a918ab: cmp      esi, eax
0000000180a918ad: jl       0x180a91946
0000000180a918b3: xor      edx, edx
0000000180a918b5: mov      rcx, rbx
0000000180a918b8: call     0x180a91a40 ; Torappu.Battle.Enemy.FearController._InitializeFearRouteData [76896]
0000000180a918bd: xor      r9d, r9d
0000000180a918c0: mov      r8, rdi
0000000180a918c3: mov      rdx, rax
0000000180a918c6: mov      rcx, rbx
0000000180a918c9: mov      rsi, rax
0000000180a918cc: call     0x180a91dc0 ; Torappu.Battle.Enemy.FearController._TryGetFearRouteReachable [76897]
0000000180a918d1: test     al, al
0000000180a918d3: je       0x180a9192c
0000000180a918d5: mov      rcx, qword ptr [rbx + 0x10]
0000000180a918d9: test     rcx, rcx
0000000180a918dc: je       0x180a91a2f
0000000180a918e2: xor      edx, edx
0000000180a918e4: call     0x180ad4090 ; Torappu.Battle.VisualObject.get_gridPosition [77871]
0000000180a918e9: test     rsi, rsi
0000000180a918ec: je       0x180a91a2f
0000000180a918f2: mov      rcx, qword ptr [rsi + 0x38]
0000000180a918f6: test     rcx, rcx
0000000180a918f9: je       0x180a91a2f
0000000180a918ff: cmp      dword ptr [rcx + 0x18], 0
0000000180a91903: jbe      0x180a91a35
0000000180a91909: mov      rdx, qword ptr [rcx + 0x20]
0000000180a9190d: test     rdx, rdx
0000000180a91910: je       0x180a91a2f
0000000180a91916: mov      qword ptr [rdx + 0x18], rax
0000000180a9191a: xor      r8d, r8d
0000000180a9191d: mov      rdx, rsi
0000000180a91920: mov      qword ptr [rsi + 0x1c], rax
0000000180a91924: mov      rcx, rbx
0000000180a91927: call     0x180a92100 ; Torappu.Battle.Enemy.FearController._UpdateFearRoute [76898]
0000000180a9192c: cmp      qword ptr [rbx + 0x20], 0
0000000180a91931: mov      rdi, qword ptr [rbx + 0x28]
0000000180a91935: je       0x180a9197c
0000000180a91937: mov      rcx, qword ptr [rbx + 0x20]
0000000180a9193b: xor      r8d, r8d
0000000180a9193e: mov      rdx, rdi
0000000180a91941: call     0x180875fa0 ; Torappu.Battle.BasicCursor.OnRouteChanged [70159]
0000000180a91946: movaps   xmm8, xmmword ptr [rsp + 0x80]
0000000180a9194f: lea      r11, [rsp + 0xb0]
0000000180a91957: mov      rbx, qword ptr [r11 + 0x18]
0000000180a9195b: mov      rsi, qword ptr [r11 + 0x20]
0000000180a9195f: movaps   xmm7, xmmword ptr [rsp + 0x90]
0000000180a91967: movaps   xmm6, xmmword ptr [rsp + 0xa0]
0000000180a9196f: mov      rbp, qword ptr [rsp + 0xc0]
0000000180a91977: mov      rsp, r11
0000000180a9197a: pop      rdi
0000000180a9197b: ret      
0000000180a9197c: mov      rdx, qword ptr [rbx + 0x10]
0000000180a91980: test     rdx, rdx
0000000180a91983: je       0x180a91a2f
0000000180a91989: mov      ecx, 0xe0
0000000180a9198e: call     0x180005610
0000000180a91993: test     rax, rax
0000000180a91996: je       0x180a91a2f
0000000180a9199c: xor      r8d, r8d
0000000180a9199f: lea      rcx, [rsp + 0x60]
0000000180a919a4: mov      rdx, rax
0000000180a919a7: call     0x1808773f0 ; Torappu.Battle.BasicCursor.get_snapshot [70152]
0000000180a919ac: xor      ecx, ecx
0000000180a919ae: movups   xmm6, xmmword ptr [rax]
0000000180a919b1: movsd    xmm7, qword ptr [rax + 0x10]
0000000180a919b6: call     0x1805073b0 ; Torappu.Battle.BasicCursor.DisappearCheckpoint.GetNextDirection [70205] | Torappu.Battle.BasicCursor.AppearAtPosCheckpoint.GetNextDirection [70214] | Torappu.Battle.BasicCursor.WaitForSecondsCheckpoint.GetNextDirection [70219] | Torappu.Battle.BasicCursor.WaitForPlayTimeCheckpoint.GetNextDirection [70228] | Torappu.Battle.BasicCursor.WaitCurrentWaveTimeCheckpoint.GetNextDirection [70234] | Torappu.Battle.BasicCursor.WaitCurrentFragmentTimeCheckpoint.GetNextDirection [70240] | Torappu.Battle.BasicCursor.AlertCheckpoint.GetNextDirection [70245] | Torappu.Battle.BasicCursor.WaitBossrushWaveCheckPoint.GetNextDirection [70254]
0000000180a919bb: mov      rcx, qword ptr [rip + 0x7edb736] ; TypeInfo Torappu.Battle.DirectionCursor @0x18896d0f8
0000000180a919c2: mov      rbp, qword ptr [rbx + 0x10]
0000000180a919c6: movq     xmm8, rax
0000000180a919cb: call     0x18045cfe0
0000000180a919d0: mov      rsi, rax
0000000180a919d3: test     rax, rax
0000000180a919d6: je       0x180a91a2f
0000000180a919d8: mov      qword ptr [rsp + 0x48], 0
0000000180a919e1: lea      r8, [rsp + 0x60]
0000000180a919e6: mov      byte ptr [rsp + 0x40], 0
0000000180a919eb: movq     r9, xmm8
0000000180a919f0: mov      byte ptr [rsp + 0x38], 0
0000000180a919f5: mov      rdx, rdi
0000000180a919f8: mov      byte ptr [rsp + 0x30], 0
0000000180a919fd: mov      rcx, rax
0000000180a91a00: mov      byte ptr [rsp + 0x28], 0
0000000180a91a05: mov      qword ptr [rsp + 0x20], rbp
0000000180a91a0a: movaps   xmmword ptr [rsp + 0x60], xmm6
0000000180a91a0f: movsd    qword ptr [rsp + 0x70], xmm7
0000000180a91a15: call     0x180897ef0 ; Torappu.Battle.DirectionCursor..ctor [70270]
0000000180a91a1a: lea      rcx, [rbx + 0x20]
0000000180a91a1e: mov      qword ptr [rbx + 0x20], rsi
0000000180a91a22: mov      rdx, rsi
0000000180a91a25: call     0x18048b9e0
0000000180a91a2a: jmp      0x180a91946
0000000180a91a2f: call     0x18048c0b0
0000000180a91a34: int3     
0000000180a91a35: call     0x18048c0a0
0000000180a91a3a: int3     
0000000180a91a3b: int3     
0000000180a91a3c: int3     
0000000180a91a3d: int3     
0000000180a91a3e: int3     
0000000180a91a3f: int3     