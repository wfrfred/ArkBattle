; Torappu.Battle.Enemy.PlayMoveAnim metadata=76444 token=0x6012a9d VA=0x180a72f40 RVA=0xa72f40 size=0x390
0000000180a72f40: push     rsi
0000000180a72f42: sub      rsp, 0x50
0000000180a72f46: cmp      byte ptr [rip + 0x821f938], 0
0000000180a72f4d: mov      rsi, rcx
0000000180a72f50: jne      0x180a72fa1
0000000180a72f52: lea      rcx, [rip + 0x7da8757] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a72f59: call     0x18048bf00
0000000180a72f5e: lea      rcx, [rip + 0x7de779b] ; TypeInfo Torappu.FP @0x18885a700
0000000180a72f65: call     0x18048bf00
0000000180a72f6a: lea      rcx, [rip + 0x7de59d7] ; GenericMethodInfo 234666 @0x188858948
0000000180a72f71: call     0x18048bf00
0000000180a72f76: lea      rcx, [rip + 0x7e50cbb] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180a72f7d: call     0x18048bf00
0000000180a72f82: lea      rcx, [rip + 0x7e549c7] ; StringLiteral 'Move' @0x1888c7950
0000000180a72f89: call     0x18048bf00
0000000180a72f8e: lea      rcx, [rip + 0x7ec5713] ; StringLiteral 'Idle' @0x1889386a8
0000000180a72f95: call     0x18048bf00
0000000180a72f9a: mov      byte ptr [rip + 0x821f8e4], 1
0000000180a72fa1: mov      rax, qword ptr [rip + 0x7da8708] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a72fa8: cmp      dword ptr [rax + 0xe0], 0
0000000180a72faf: jne      0x180a72fc0
0000000180a72fb1: mov      rcx, rax
0000000180a72fb4: call     0x18048c140
0000000180a72fb9: mov      rax, qword ptr [rip + 0x7da86f0] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a72fc0: mov      rax, qword ptr [rax + 0xb8]
0000000180a72fc7: mov      rcx, qword ptr [rax + 0x568]
0000000180a72fce: test     rcx, rcx
0000000180a72fd1: jne      0x180a732ac
0000000180a72fd7: mov      rdx, qword ptr [rip + 0x7e54972] ; StringLiteral 'Move' @0x1888c7950
0000000180a72fde: xor      r9d, r9d
0000000180a72fe1: xor      r8d, r8d
0000000180a72fe4: mov      rcx, rsi
0000000180a72fe7: call     0x180ac6ae0 ; Torappu.Battle.Unit.ContainsAnimation [77638]
0000000180a72fec: test     al, al
0000000180a72fee: je       0x180a73261
0000000180a72ff4: cmp      byte ptr [rsi + 0x2fa], 0
0000000180a72ffb: jne      0x180a73216
0000000180a73001: mov      qword ptr [rsp + 0x68], rdi
0000000180a73006: movaps   xmmword ptr [rsp + 0x40], xmm6
0000000180a7300b: cmp      byte ptr [rsi + 0x2e1], 0
0000000180a73012: je       0x180a73023
0000000180a73014: xor      edx, edx
0000000180a73016: mov      rcx, rsi
0000000180a73019: call     0x180707aa0 ; Torappu.Battle.Entity.get_moveSpeed [66467]
0000000180a7301e: jmp      0x180a73118
0000000180a73023: cmp      byte ptr [rip + 0x821f82a], 0
0000000180a7302a: jne      0x180a7304b
0000000180a7302c: lea      rcx, [rip + 0x7da867d] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a73033: call     0x18048bf00
0000000180a73038: lea      rcx, [rip + 0x7de76c1] ; TypeInfo Torappu.FP @0x18885a700
0000000180a7303f: call     0x18048bf00
0000000180a73044: mov      byte ptr [rip + 0x821f809], 1
0000000180a7304b: mov      rax, qword ptr [rip + 0x7da865e] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a73052: cmp      dword ptr [rax + 0xe0], 0
0000000180a73059: jne      0x180a7306a
0000000180a7305b: mov      rcx, rax
0000000180a7305e: call     0x18048c140
0000000180a73063: mov      rax, qword ptr [rip + 0x7da8646] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7306a: mov      rax, qword ptr [rax + 0xb8]
0000000180a73071: mov      rcx, qword ptr [rax + 0x3e0]
0000000180a73078: test     rcx, rcx
0000000180a7307b: jne      0x180a7310d
0000000180a73081: xor      edx, edx
0000000180a73083: mov      rcx, rsi
0000000180a73086: call     0x180701e20 ; Torappu.Battle.Entity.get_attributes [66358]
0000000180a7308b: test     rax, rax
0000000180a7308e: je       0x180a732bd
0000000180a73094: xor      r8d, r8d
0000000180a73097: mov      edx, 6
0000000180a7309c: mov      rcx, rax
0000000180a7309f: call     0x1806499a0 ; Torappu.Battle.Attributes.GetValue [64276]
0000000180a730a4: xor      edx, edx
0000000180a730a6: mov      rcx, rsi
0000000180a730a9: mov      rdi, rax
0000000180a730ac: call     0x180701e20 ; Torappu.Battle.Entity.get_attributes [66358]
0000000180a730b1: test     rax, rax
0000000180a730b4: je       0x180a732bd
0000000180a730ba: xor      r8d, r8d
0000000180a730bd: mov      qword ptr [rsp + 0x60], rbx
0000000180a730c2: mov      edx, 6
0000000180a730c7: mov      rcx, rax
0000000180a730ca: call     0x1806498a0 ; Torappu.Battle.Attributes.GetRawValue [64277]
0000000180a730cf: mov      rcx, qword ptr [rip + 0x7de762a] ; TypeInfo Torappu.FP @0x18885a700
0000000180a730d6: mov      rbx, rax
0000000180a730d9: cmp      dword ptr [rcx + 0xe0], 0
0000000180a730e0: jne      0x180a730e7
0000000180a730e2: call     0x18048c140
0000000180a730e7: xor      r8d, r8d
0000000180a730ea: mov      rdx, rbx
0000000180a730ed: mov      rcx, rdi
0000000180a730f0: call     0x1866fd730 ; Torappu.FP.op_Division [220475]
0000000180a730f5: xor      edx, edx
0000000180a730f7: mov      qword ptr [rsp + 0x78], rax
0000000180a730fc: lea      rcx, [rsp + 0x78]
0000000180a73101: call     0x1866fae20 ; Torappu.FP.AsFloat [220505]
0000000180a73106: mov      rbx, qword ptr [rsp + 0x60]
0000000180a7310b: jmp      0x180a73118
0000000180a7310d: xor      r8d, r8d
0000000180a73110: mov      rdx, rsi
0000000180a73113: call     0x1836404d0 ; XLua.DelegateBridge.__Gen_Delegate_Imp80 [2735]
0000000180a73118: movaps   xmm6, xmm0
0000000180a7311b: movaps   xmmword ptr [rsp + 0x30], xmm7
0000000180a73120: xor      edx, edx
0000000180a73122: mov      rcx, rsi
0000000180a73125: movaps   xmmword ptr [rsp + 0x20], xmm8
0000000180a7312b: call     0x180701a20 ; Torappu.Battle.Entity.get_animSlowDown [66485]
0000000180a73130: mov      rcx, qword ptr [rip + 0x7de75c9] ; TypeInfo Torappu.FP @0x18885a700
0000000180a73137: mov      qword ptr [rsp + 0x70], rax
0000000180a7313c: cmp      dword ptr [rcx + 0xe0], 0
0000000180a73143: jne      0x180a7314a
0000000180a73145: call     0x18048c140
0000000180a7314a: xor      edx, edx
0000000180a7314c: lea      rcx, [rsp + 0x70]
0000000180a73151: call     0x1866fae20 ; Torappu.FP.AsFloat [220505]
0000000180a73156: movss    xmm7, dword ptr [rsi + 0x2e8]
0000000180a7315e: movaps   xmm8, xmm0
0000000180a73162: mulss    xmm8, xmm6
0000000180a73167: xor      ecx, ecx
0000000180a73169: movss    xmm6, dword ptr [rsi + 0x2e4]
0000000180a73171: call     0x1805073b0 ; Torappu.Battle.BasicCursor.DisappearCheckpoint.GetNextDirection [70205] | Torappu.Battle.BasicCursor.AppearAtPosCheckpoint.GetNextDirection [70214] | Torappu.Battle.BasicCursor.WaitForSecondsCheckpoint.GetNextDirection [70219] | Torappu.Battle.BasicCursor.WaitForPlayTimeCheckpoint.GetNextDirection [70228] | Torappu.Battle.BasicCursor.WaitCurrentWaveTimeCheckpoint.GetNextDirection [70234] | Torappu.Battle.BasicCursor.WaitCurrentFragmentTimeCheckpoint.GetNextDirection [70240] | Torappu.Battle.BasicCursor.AlertCheckpoint.GetNextDirection [70245] | Torappu.Battle.BasicCursor.WaitBossrushWaveCheckPoint.GetNextDirection [70254]
0000000180a73176: mov      qword ptr [rsp + 0x78], rax
0000000180a7317b: subss    xmm6, dword ptr [rsp + 0x78]
0000000180a73181: subss    xmm7, dword ptr [rsp + 0x7c]
0000000180a73187: movss    xmm0, dword ptr [rip + 0x63ccbf5]
0000000180a7318f: xor      eax, eax
0000000180a73191: mulss    xmm7, xmm7
0000000180a73195: mulss    xmm6, xmm6
0000000180a73199: addss    xmm7, xmm6
0000000180a7319d: comiss   xmm0, xmm7
0000000180a731a0: seta     al
0000000180a731a3: test     eax, eax
0000000180a731a5: jne      0x180a731e5
0000000180a731a7: mov      rcx, qword ptr [rip + 0x7e50a8a] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180a731ae: movss    xmm6, dword ptr [rsi + 0x2e4]
0000000180a731b6: movss    xmm7, dword ptr [rsi + 0x2e8]
0000000180a731be: cmp      dword ptr [rcx + 0xe0], eax
0000000180a731c4: jne      0x180a731cb
0000000180a731c6: call     0x18048c140
0000000180a731cb: mov      r9, qword ptr [rip + 0x7de5776] ; GenericMethodInfo 234666 @0x188858948
0000000180a731d2: movaps   xmm2, xmm7
0000000180a731d5: movaps   xmm1, xmm6
0000000180a731d8: movaps   xmm0, xmm8
0000000180a731dc: call     0x1845546e0
0000000180a731e1: movaps   xmm8, xmm0
0000000180a731e5: mov      rdx, qword ptr [rip + 0x7e54764] ; StringLiteral 'Move' @0x1888c7950
0000000180a731ec: xor      r9d, r9d
0000000180a731ef: movaps   xmm2, xmm8
0000000180a731f3: mov      rcx, rsi
0000000180a731f6: call     0x180acc2e0 ; Torappu.Battle.Unit.PlayAnimation [77637]
0000000180a731fb: movaps   xmm8, xmmword ptr [rsp + 0x20]
0000000180a73201: movaps   xmm7, xmmword ptr [rsp + 0x30]
0000000180a73206: mov      rdi, qword ptr [rsp + 0x68]
0000000180a7320b: movaps   xmm6, xmmword ptr [rsp + 0x40]
0000000180a73210: add      rsp, 0x50
0000000180a73214: pop      rsi
0000000180a73215: ret      
0000000180a73216: xor      edx, edx
0000000180a73218: mov      rcx, rsi
0000000180a7321b: call     0x180701a20 ; Torappu.Battle.Entity.get_animSlowDown [66485]
0000000180a73220: mov      rcx, qword ptr [rip + 0x7de74d9] ; TypeInfo Torappu.FP @0x18885a700
0000000180a73227: mov      qword ptr [rsp + 0x70], rax
0000000180a7322c: cmp      dword ptr [rcx + 0xe0], 0
0000000180a73233: jne      0x180a7323a
0000000180a73235: call     0x18048c140
0000000180a7323a: xor      edx, edx
0000000180a7323c: lea      rcx, [rsp + 0x70]
0000000180a73241: call     0x1866fae20 ; Torappu.FP.AsFloat [220505]
0000000180a73246: mov      rdx, qword ptr [rip + 0x7e54703] ; StringLiteral 'Move' @0x1888c7950
0000000180a7324d: xor      r9d, r9d
0000000180a73250: movaps   xmm2, xmm0
0000000180a73253: mov      rcx, rsi
0000000180a73256: call     0x180acc2e0 ; Torappu.Battle.Unit.PlayAnimation [77637]
0000000180a7325b: add      rsp, 0x50
0000000180a7325f: pop      rsi
0000000180a73260: ret      
0000000180a73261: xor      edx, edx
0000000180a73263: mov      rcx, rsi
0000000180a73266: call     0x180701a20 ; Torappu.Battle.Entity.get_animSlowDown [66485]
0000000180a7326b: mov      rcx, qword ptr [rip + 0x7de748e] ; TypeInfo Torappu.FP @0x18885a700
0000000180a73272: mov      qword ptr [rsp + 0x70], rax
0000000180a73277: cmp      dword ptr [rcx + 0xe0], 0
0000000180a7327e: jne      0x180a73285
0000000180a73280: call     0x18048c140
0000000180a73285: xor      edx, edx
0000000180a73287: lea      rcx, [rsp + 0x70]
0000000180a7328c: call     0x1866fae20 ; Torappu.FP.AsFloat [220505]
0000000180a73291: mov      rdx, qword ptr [rip + 0x7ec5410] ; StringLiteral 'Idle' @0x1889386a8
0000000180a73298: xor      r9d, r9d
0000000180a7329b: movaps   xmm2, xmm0
0000000180a7329e: mov      rcx, rsi
0000000180a732a1: call     0x180acc2e0 ; Torappu.Battle.Unit.PlayAnimation [77637]
0000000180a732a6: add      rsp, 0x50
0000000180a732aa: pop      rsi
0000000180a732ab: ret      
0000000180a732ac: xor      r8d, r8d
0000000180a732af: mov      rdx, rsi
0000000180a732b2: call     0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
0000000180a732b7: add      rsp, 0x50
0000000180a732bb: pop      rsi
0000000180a732bc: ret      
0000000180a732bd: call     0x18048c0b0
0000000180a732c2: int3     
0000000180a732c3: int3     
0000000180a732c4: int3     
0000000180a732c5: int3     
0000000180a732c6: int3     
0000000180a732c7: int3     
0000000180a732c8: int3     
0000000180a732c9: int3     
0000000180a732ca: int3     
0000000180a732cb: int3     
0000000180a732cc: int3     
0000000180a732cd: int3     
0000000180a732ce: int3     
0000000180a732cf: int3     
