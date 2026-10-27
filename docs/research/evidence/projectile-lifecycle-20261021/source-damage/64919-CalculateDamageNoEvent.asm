; Torappu.Battle.BattleFormula.CalculateDamageNoEvent metadata=64919 token=0x600fd98 VA=0x180657050 RVA=0x657050 size=0x370
0000000180657050: push     rbp
0000000180657052: push     rsi
0000000180657053: push     r15
0000000180657055: sub      rsp, 0x60
0000000180657059: cmp      byte ptr [rip + 0x86391e6], 0
0000000180657060: mov      rbp, r8
0000000180657063: mov      rsi, rdx
0000000180657066: mov      r15, rcx
0000000180657069: jne      0x180657096
000000018065706b: lea      rcx, [rip + 0x82d8d2e] ; TypeInfo Torappu.Battle.BattleFormula @0x18892fda0
0000000180657072: call     0x18048bf00
0000000180657077: lea      rcx, [rip + 0x8203682] ; TypeInfo Torappu.FP @0x18885a700
000000018065707e: call     0x18048bf00
0000000180657083: lea      rcx, [rip + 0x82dbc5e] ; TypeInfo UnityEngine.Object @0x188932ce8
000000018065708a: call     0x18048bf00
000000018065708f: mov      byte ptr [rip + 0x86391b0], 1
0000000180657096: mov      rax, qword ptr [rip + 0x82d8d03] ; TypeInfo Torappu.Battle.BattleFormula @0x18892fda0
000000018065709d: cmp      dword ptr [rax + 0xe0], 0
00000001806570a4: jne      0x1806570b5
00000001806570a6: mov      rcx, rax
00000001806570a9: call     0x18048c140
00000001806570ae: mov      rax, qword ptr [rip + 0x82d8ceb] ; TypeInfo Torappu.Battle.BattleFormula @0x18892fda0
00000001806570b5: mov      rax, qword ptr [rax + 0xb8]
00000001806570bc: mov      qword ptr [rsp + 0x90], r14
00000001806570c4: mov      rcx, qword ptr [rax + 0x28]
00000001806570c8: test     rcx, rcx
00000001806570cb: jne      0x180657371
00000001806570d1: mov      qword ptr [rsp + 0x80], rbx
00000001806570d9: mov      qword ptr [rsp + 0x88], rdi
00000001806570e1: mov      rbx, qword ptr [rip + 0x8203618] ; TypeInfo Torappu.FP @0x18885a700
00000001806570e8: cmp      dword ptr [rbx + 0xe0], ecx
00000001806570ee: jne      0x1806570ff
00000001806570f0: mov      rcx, rbx
00000001806570f3: call     0x18048c140
00000001806570f8: mov      rbx, qword ptr [rip + 0x8203601] ; TypeInfo Torappu.FP @0x18885a700
00000001806570ff: mov      rdi, qword ptr [rbx + 0xb8]
0000000180657106: mov      rcx, qword ptr [rip + 0x82dbbdb] ; TypeInfo UnityEngine.Object @0x188932ce8
000000018065710d: mov      rbx, qword ptr [rbx + 0xb8]
0000000180657114: mov      rdi, qword ptr [rdi + 0x38]
0000000180657118: cmp      dword ptr [rcx + 0xe0], 0
000000018065711f: mov      rbx, qword ptr [rbx + 0x38]
0000000180657123: jne      0x18065712a
0000000180657125: call     0x18048c140
000000018065712a: xor      r8d, r8d
000000018065712d: xor      edx, edx
000000018065712f: mov      rcx, rsi
0000000180657132: call     0x186b63a70
0000000180657137: xor      r14d, r14d
000000018065713a: test     al, al
000000018065713c: je       0x180657306
0000000180657142: mov      rcx, qword ptr [rip + 0x82d8c57] ; TypeInfo Torappu.Battle.BattleFormula @0x18892fda0
0000000180657149: movups   xmm0, xmmword ptr [rbp + 0x10]
000000018065714d: movsd    xmm1, qword ptr [rbp + 0x20]
0000000180657152: movups   xmmword ptr [rsp + 0x40], xmm0
0000000180657157: movsd    qword ptr [rsp + 0x50], xmm1
000000018065715d: cmp      dword ptr [rcx + 0xe0], r14d
0000000180657164: jne      0x18065716b
0000000180657166: call     0x18048c140
000000018065716b: cmp      byte ptr [rip + 0x86390dd], r14b
0000000180657172: jne      0x180657193
0000000180657174: lea      rcx, [rip + 0x82d8c25] ; TypeInfo Torappu.Battle.BattleFormula @0x18892fda0
000000018065717b: call     0x18048bf00
0000000180657180: lea      rcx, [rip + 0x8203579] ; TypeInfo Torappu.FP @0x18885a700
0000000180657187: call     0x18048bf00
000000018065718c: mov      byte ptr [rip + 0x86390bc], 1
0000000180657193: mov      rcx, qword ptr [rip + 0x82d8c06] ; TypeInfo Torappu.Battle.BattleFormula @0x18892fda0
000000018065719a: cmp      dword ptr [rcx + 0xe0], r14d
00000001806571a1: jne      0x1806571a8
00000001806571a3: call     0x18048c140
00000001806571a8: mov      rax, qword ptr [rip + 0x82d8bf1] ; TypeInfo Torappu.Battle.BattleFormula @0x18892fda0
00000001806571af: mov      rcx, qword ptr [rax + 0xb8]
00000001806571b6: mov      rcx, qword ptr [rcx + 0x70]
00000001806571ba: test     rcx, rcx
00000001806571bd: jne      0x180657216
00000001806571bf: mov      eax, dword ptr [rbp]
00000001806571c2: cmp      eax, 1
00000001806571c5: jne      0x1806571dc
00000001806571c7: test     rsi, rsi
00000001806571ca: je       0x1806573b7
00000001806571d0: xor      edx, edx
00000001806571d2: mov      rcx, rsi
00000001806571d5: call     0x180702e80 ; Torappu.Battle.Entity.get_defPenetrateRatio [66470]
00000001806571da: jmp      0x18065722a
00000001806571dc: cmp      eax, 2
00000001806571df: jne      0x1806571f6
00000001806571e1: test     rsi, rsi
00000001806571e4: je       0x1806573b7
00000001806571ea: xor      edx, edx
00000001806571ec: mov      rcx, rsi
00000001806571ef: call     0x180706e80 ; Torappu.Battle.Entity.get_magicResistPenetrate [66472]
00000001806571f4: jmp      0x18065722a
00000001806571f6: mov      rcx, qword ptr [rip + 0x8203503] ; TypeInfo Torappu.FP @0x18885a700
00000001806571fd: cmp      dword ptr [rcx + 0xe0], r14d
0000000180657204: jne      0x18065720b
0000000180657206: call     0x18048c140
000000018065720b: xor      edx, edx
000000018065720d: xor      ecx, ecx
000000018065720f: call     0x1866fdac0
0000000180657214: jmp      0x18065722a
0000000180657216: mov      r9d, dword ptr [rbp]
000000018065721a: mov      r8, r15
000000018065721d: mov      rdx, rsi
0000000180657220: mov      qword ptr [rsp + 0x20], r14
0000000180657225: call     0x1831ae870 ; XLua.DelegateBridge.__Gen_Delegate_Imp12117 [14772]
000000018065722a: cmp      byte ptr [rip + 0x863901f], r14b
0000000180657231: mov      rdi, rax
0000000180657234: movups   xmm0, xmmword ptr [rbp + 0x10]
0000000180657238: movsd    xmm1, qword ptr [rbp + 0x20]
000000018065723d: movups   xmmword ptr [rsp + 0x40], xmm0
0000000180657242: movsd    qword ptr [rsp + 0x50], xmm1
0000000180657248: jne      0x180657269
000000018065724a: lea      rcx, [rip + 0x82d8b4f] ; TypeInfo Torappu.Battle.BattleFormula @0x18892fda0
0000000180657251: call     0x18048bf00
0000000180657256: lea      rcx, [rip + 0x82034a3] ; TypeInfo Torappu.FP @0x18885a700
000000018065725d: call     0x18048bf00
0000000180657262: mov      byte ptr [rip + 0x8638fe7], 1
0000000180657269: mov      rax, qword ptr [rip + 0x82d8b30] ; TypeInfo Torappu.Battle.BattleFormula @0x18892fda0
0000000180657270: cmp      dword ptr [rax + 0xe0], r14d
0000000180657277: jne      0x180657288
0000000180657279: mov      rcx, rax
000000018065727c: call     0x18048c140
0000000180657281: mov      rax, qword ptr [rip + 0x82d8b18] ; TypeInfo Torappu.Battle.BattleFormula @0x18892fda0
0000000180657288: mov      rax, qword ptr [rax + 0xb8]
000000018065728f: mov      rcx, qword ptr [rax + 0x78]
0000000180657293: test     rcx, rcx
0000000180657296: jne      0x1806572ef
0000000180657298: mov      eax, dword ptr [rbp]
000000018065729b: cmp      eax, 1
000000018065729e: jne      0x1806572b5
00000001806572a0: test     rsi, rsi
00000001806572a3: je       0x1806573b7
00000001806572a9: xor      edx, edx
00000001806572ab: mov      rcx, rsi
00000001806572ae: call     0x180702de0 ; Torappu.Battle.Entity.get_defPenetrateFixed [66471]
00000001806572b3: jmp      0x180657303
00000001806572b5: cmp      eax, 2
00000001806572b8: jne      0x1806572cf
00000001806572ba: test     rsi, rsi
00000001806572bd: je       0x1806573b7
00000001806572c3: xor      edx, edx
00000001806572c5: mov      rcx, rsi
00000001806572c8: call     0x180706de0 ; Torappu.Battle.Entity.get_magicResistPenetrateFixed [66473]
00000001806572cd: jmp      0x180657303
00000001806572cf: mov      rcx, qword ptr [rip + 0x820342a] ; TypeInfo Torappu.FP @0x18885a700
00000001806572d6: cmp      dword ptr [rcx + 0xe0], r14d
00000001806572dd: jne      0x1806572e4
00000001806572df: call     0x18048c140
00000001806572e4: xor      edx, edx
00000001806572e6: xor      ecx, ecx
00000001806572e8: call     0x1866fdac0
00000001806572ed: jmp      0x180657303
00000001806572ef: mov      r9d, dword ptr [rbp]
00000001806572f3: mov      r8, r15
00000001806572f6: mov      rdx, rsi
00000001806572f9: mov      qword ptr [rsp + 0x20], r14
00000001806572fe: call     0x1831ae870 ; XLua.DelegateBridge.__Gen_Delegate_Imp12117 [14772]
0000000180657303: mov      rbx, rax
0000000180657306: mov      rcx, qword ptr [rip + 0x82d8a93] ; TypeInfo Torappu.Battle.BattleFormula @0x18892fda0
000000018065730d: cmp      dword ptr [rcx + 0xe0], r14d
0000000180657314: jne      0x18065731b
0000000180657316: call     0x18048c140
000000018065731b: movups   xmm0, xmmword ptr [rbp]
000000018065731f: mov      r9, r15
0000000180657322: mov      r8, rbx
0000000180657325: movups   xmm1, xmmword ptr [rbp + 0x10]
0000000180657329: lea      rcx, [rsp + 0x30]
000000018065732e: mov      rdx, rdi
0000000180657331: movaps   xmmword ptr [rsp + 0x30], xmm0
0000000180657336: movsd    xmm0, qword ptr [rbp + 0x20]
000000018065733b: movsd    qword ptr [rsp + 0x50], xmm0
0000000180657341: movaps   xmmword ptr [rsp + 0x40], xmm1
0000000180657346: mov      qword ptr [rsp + 0x20], r14
000000018065734b: call     0x180656ba0 ; Torappu.Battle.BattleFormula.CalculateDamageInternal [64920]
0000000180657350: mov      rbx, qword ptr [rsp + 0x80]
0000000180657358: mov      rdi, qword ptr [rsp + 0x88]
0000000180657360: mov      r14, qword ptr [rsp + 0x90]
0000000180657368: add      rsp, 0x60
000000018065736c: pop      r15
000000018065736e: pop      rsi
000000018065736f: pop      rbp
0000000180657370: ret      
0000000180657371: movups   xmm0, xmmword ptr [rbp]
0000000180657375: xor      r14d, r14d
0000000180657378: lea      r9, [rsp + 0x30]
000000018065737d: movups   xmm1, xmmword ptr [rbp + 0x10]
0000000180657381: mov      r8, rsi
0000000180657384: mov      rdx, r15
0000000180657387: movaps   xmmword ptr [rsp + 0x30], xmm0
000000018065738c: movsd    xmm0, qword ptr [rbp + 0x20]
0000000180657391: movsd    qword ptr [rsp + 0x50], xmm0
0000000180657397: movaps   xmmword ptr [rsp + 0x40], xmm1
000000018065739c: mov      qword ptr [rsp + 0x20], r14
00000001806573a1: call     0x1831ad830 ; XLua.DelegateBridge.__Gen_Delegate_Imp12110 [14765]
00000001806573a6: mov      r14, qword ptr [rsp + 0x90]
00000001806573ae: add      rsp, 0x60
00000001806573b2: pop      r15
00000001806573b4: pop      rsi
00000001806573b5: pop      rbp
00000001806573b6: ret      
00000001806573b7: call     0x18048c0b0
00000001806573bc: int3     
00000001806573bd: int3     
00000001806573be: int3     
00000001806573bf: int3     