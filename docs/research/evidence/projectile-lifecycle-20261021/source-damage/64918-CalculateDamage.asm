; Torappu.Battle.BattleFormula.CalculateDamage metadata=64918 token=0x600fd97 VA=0x1806573c0 RVA=0x6573c0 size=0x220
00000001806573c0: mov      qword ptr [rsp + 0x10], rbx
00000001806573c5: mov      qword ptr [rsp + 0x18], rsi
00000001806573ca: mov      qword ptr [rsp + 0x20], rdi
00000001806573cf: push     r14
00000001806573d1: sub      rsp, 0xa0
00000001806573d8: cmp      byte ptr [rip + 0x8638e66], 0
00000001806573df: movzx    r14d, r9b
00000001806573e3: movzx    ebx, r8b
00000001806573e7: mov      rdi, rdx
00000001806573ea: mov      rsi, rcx
00000001806573ed: jne      0x18065740e
00000001806573ef: lea      rcx, [rip + 0x82d89aa] ; TypeInfo Torappu.Battle.BattleFormula @0x18892fda0
00000001806573f6: call     0x18048bf00
00000001806573fb: lea      rcx, [rip + 0x82db8e6] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180657402: call     0x18048bf00
0000000180657407: mov      byte ptr [rip + 0x8638e37], 1
000000018065740e: mov      rcx, qword ptr [rip + 0x82d898b] ; TypeInfo Torappu.Battle.BattleFormula @0x18892fda0
0000000180657415: cmp      dword ptr [rcx + 0xe0], 0
000000018065741c: jne      0x180657423
000000018065741e: call     0x18048c140
0000000180657423: mov      rax, qword ptr [rip + 0x82d8976] ; TypeInfo Torappu.Battle.BattleFormula @0x18892fda0
000000018065742a: mov      rcx, qword ptr [rax + 0xb8]
0000000180657431: mov      rcx, qword ptr [rcx + 0x20]
0000000180657435: test     rcx, rcx
0000000180657438: jne      0x1806575a8
000000018065743e: mov      qword ptr [rsp + 0xb0], rbp
0000000180657446: mov      rbp, qword ptr [rsp + 0xd0]
000000018065744e: test     r14b, r14b
0000000180657451: je       0x180657493
0000000180657453: mov      rcx, qword ptr [rip + 0x82db88e] ; TypeInfo UnityEngine.Object @0x188932ce8
000000018065745a: cmp      dword ptr [rcx + 0xe0], 0
0000000180657461: jne      0x180657468
0000000180657463: call     0x18048c140
0000000180657468: xor      r8d, r8d
000000018065746b: xor      edx, edx
000000018065746d: mov      rcx, rdi
0000000180657470: call     0x186b63a70
0000000180657475: test     al, al
0000000180657477: je       0x180657493
0000000180657479: test     rdi, rdi
000000018065747c: je       0x1806575d4
0000000180657482: xor      r9d, r9d
0000000180657485: mov      r8, rbp
0000000180657488: mov      rdx, rsi
000000018065748b: mov      rcx, rdi
000000018065748e: call     0x1806f8620 ; Torappu.Battle.Entity.OnCalculateDamage [66660]
0000000180657493: test     bl, bl
0000000180657495: je       0x1806574d4
0000000180657497: mov      rcx, qword ptr [rip + 0x82db84a] ; TypeInfo UnityEngine.Object @0x188932ce8
000000018065749e: cmp      dword ptr [rcx + 0xe0], 0
00000001806574a5: jne      0x1806574ac
00000001806574a7: call     0x18048c140
00000001806574ac: xor      r8d, r8d
00000001806574af: xor      edx, edx
00000001806574b1: mov      rcx, rsi
00000001806574b4: call     0x186b63a70
00000001806574b9: test     al, al
00000001806574bb: je       0x1806574d4
00000001806574bd: test     rsi, rsi
00000001806574c0: je       0x1806575d4
00000001806574c6: xor      r8d, r8d
00000001806574c9: mov      rdx, rbp
00000001806574cc: mov      rcx, rsi
00000001806574cf: call     0x1806f7c90 ; Torappu.Battle.Entity.OnBeingCalculateDamage [66662]
00000001806574d4: mov      rcx, qword ptr [rip + 0x82d88c5] ; TypeInfo Torappu.Battle.BattleFormula @0x18892fda0
00000001806574db: movups   xmm0, xmmword ptr [rbp]
00000001806574df: movups   xmm1, xmmword ptr [rbp + 0x10]
00000001806574e3: cmp      dword ptr [rcx + 0xe0], 0
00000001806574ea: movsd    xmm2, qword ptr [rbp + 0x20]
00000001806574ef: movups   xmmword ptr [rsp + 0x48], xmm0
00000001806574f4: movups   xmmword ptr [rsp + 0x58], xmm1
00000001806574f9: movsd    qword ptr [rsp + 0x40], xmm2
00000001806574ff: jne      0x180657516
0000000180657501: call     0x18048c140
0000000180657506: movups   xmm0, xmmword ptr [rsp + 0x48]
000000018065750b: movups   xmm1, xmmword ptr [rsp + 0x58]
0000000180657510: movsd    xmm2, qword ptr [rsp + 0x40]
0000000180657516: xor      r9d, r9d
0000000180657519: movaps   xmmword ptr [rsp + 0x70], xmm0
000000018065751e: lea      r8, [rsp + 0x70]
0000000180657523: movaps   xmmword ptr [rsp + 0x80], xmm1
000000018065752b: mov      rdx, rdi
000000018065752e: movsd    qword ptr [rsp + 0x90], xmm2
0000000180657537: mov      rcx, rsi
000000018065753a: call     0x180657050 ; Torappu.Battle.BattleFormula.CalculateDamageNoEvent [64919]
000000018065753f: mov      rbx, rax
0000000180657542: test     r14b, r14b
0000000180657545: je       0x180657583
0000000180657547: mov      rcx, qword ptr [rip + 0x82db79a] ; TypeInfo UnityEngine.Object @0x188932ce8
000000018065754e: cmp      dword ptr [rcx + 0xe0], 0
0000000180657555: jne      0x18065755c
0000000180657557: call     0x18048c140
000000018065755c: xor      r8d, r8d
000000018065755f: xor      edx, edx
0000000180657561: mov      rcx, rdi
0000000180657564: call     0x186b63a70
0000000180657569: test     al, al
000000018065756b: je       0x180657583
000000018065756d: test     rdi, rdi
0000000180657570: je       0x1806575d4
0000000180657572: xor      r9d, r9d
0000000180657575: mov      r8, rbp
0000000180657578: mov      rdx, rsi
000000018065757b: mov      rcx, rdi
000000018065757e: call     0x1806f65f0 ; Torappu.Battle.Entity.OnAfterCalculateDamage [66661]
0000000180657583: mov      rbp, qword ptr [rsp + 0xb0]
000000018065758b: mov      rax, rbx
000000018065758e: lea      r11, [rsp + 0xa0]
0000000180657596: mov      rbx, qword ptr [r11 + 0x18]
000000018065759a: mov      rsi, qword ptr [r11 + 0x20]
000000018065759e: mov      rdi, qword ptr [r11 + 0x28]
00000001806575a2: mov      rsp, r11
00000001806575a5: pop      r14
00000001806575a7: ret      
00000001806575a8: mov      rax, qword ptr [rsp + 0xd0]
00000001806575b0: movzx    r9d, bl
00000001806575b4: mov      qword ptr [rsp + 0x30], 0
00000001806575bd: mov      r8, rdi
00000001806575c0: mov      qword ptr [rsp + 0x28], rax
00000001806575c5: mov      rdx, rsi
00000001806575c8: mov      byte ptr [rsp + 0x20], r14b
00000001806575cd: call     0x1831ad380 ; XLua.DelegateBridge.__Gen_Delegate_Imp12109 [14764]
00000001806575d2: jmp      0x18065758e
00000001806575d4: call     0x18048c0b0
00000001806575d9: int3     
00000001806575da: int3     
00000001806575db: int3     
00000001806575dc: int3     
00000001806575dd: int3     
00000001806575de: int3     
00000001806575df: int3     