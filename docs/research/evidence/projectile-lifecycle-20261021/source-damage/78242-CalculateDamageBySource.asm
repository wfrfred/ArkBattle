; Torappu.Battle.BattleUtil.CalculateDamageBySource metadata=78242 token=0x60131a3 VA=0x180adf370 RVA=0xadf370 size=0x2d0
0000000180adf370: push     rbp
0000000180adf372: push     rdi
0000000180adf373: push     r12
0000000180adf375: push     r14
0000000180adf377: sub      rsp, 0x138
0000000180adf37e: cmp      byte ptr [rip + 0x81b39df], 0
0000000180adf385: mov      edi, r9d
0000000180adf388: mov      r12, r8
0000000180adf38b: mov      r14, rdx
0000000180adf38e: mov      rbp, rcx
0000000180adf391: jne      0x180adf3ca
0000000180adf393: lea      rcx, [rip + 0x7e50a06] ; TypeInfo Torappu.Battle.BattleFormula @0x18892fda0
0000000180adf39a: call     0x18048bf00
0000000180adf39f: lea      rcx, [rip + 0x7e585ba] ; TypeInfo Torappu.Battle.BattleUtil @0x188937960
0000000180adf3a6: call     0x18048bf00
0000000180adf3ab: lea      rcx, [rip + 0x7d7b34e] ; TypeInfo Torappu.FP @0x18885a700
0000000180adf3b2: call     0x18048bf00
0000000180adf3b7: lea      rcx, [rip + 0x7e0ddba] ; TypeInfo Torappu.Battle.Modifier @0x1888ed178
0000000180adf3be: call     0x18048bf00
0000000180adf3c3: mov      byte ptr [rip + 0x81b399a], 1
0000000180adf3ca: xor      eax, eax
0000000180adf3cc: mov      qword ptr [rsp + 0x130], r15
0000000180adf3d4: mov      qword ptr [rsp + 0x70], rax
0000000180adf3d9: xorps    xmm0, xmm0
0000000180adf3dc: mov      qword ptr [rsp + 0x98], rax
0000000180adf3e4: xorps    xmm1, xmm1
0000000180adf3e7: mov      rax, qword ptr [rip + 0x7e58572] ; TypeInfo Torappu.Battle.BattleUtil @0x188937960
0000000180adf3ee: movups   xmmword ptr [rsp + 0x50], xmm0
0000000180adf3f3: movups   xmmword ptr [rsp + 0x60], xmm0
0000000180adf3f8: movups   xmmword ptr [rsp + 0x78], xmm1
0000000180adf3fd: movups   xmmword ptr [rsp + 0x88], xmm1
0000000180adf405: mov      rcx, qword ptr [rax + 0xb8]
0000000180adf40c: mov      rdx, qword ptr [rcx + 0xb8]
0000000180adf413: test     rdx, rdx
0000000180adf416: jne      0x180adf58f
0000000180adf41c: test     r14, r14
0000000180adf41f: je       0x180adf639
0000000180adf425: mov      qword ptr [rsp + 0x160], rbx
0000000180adf42d: mov      rcx, r14
0000000180adf430: mov      qword ptr [rsp + 0x168], rsi
0000000180adf438: mov      qword ptr [rsp + 0x170], r13
0000000180adf440: call     0x180701b30 ; Torappu.Battle.Entity.get_atk [66458]
0000000180adf445: mov      r9, qword ptr [rsp + 0x188]
0000000180adf44d: lea      rcx, [rsp + 0x50]
0000000180adf452: xor      r15d, r15d
0000000180adf455: mov      r8d, edi
0000000180adf458: mov      rdx, rax
0000000180adf45b: mov      qword ptr [rsp + 0x20], r15
0000000180adf460: call     0x180648380 ; Torappu.Battle.BattleFormula.AttackInfo..ctor [64937]
0000000180adf465: xor      edx, edx
0000000180adf467: mov      rcx, r14
0000000180adf46a: call     0x180701b30 ; Torappu.Battle.Entity.get_atk [66458]
0000000180adf46f: mov      r9, qword ptr [rip + 0x7d7b28a] ; TypeInfo Torappu.FP @0x18885a700
0000000180adf476: mov      rbx, rax
0000000180adf479: cmp      dword ptr [r9 + 0xe0], r15d
0000000180adf480: jne      0x180adf491
0000000180adf482: mov      rcx, r9
0000000180adf485: call     0x18048c140
0000000180adf48a: mov      r9, qword ptr [rip + 0x7d7b26f] ; TypeInfo Torappu.FP @0x18885a700
0000000180adf491: mov      r9, qword ptr [r9 + 0xb8]
0000000180adf498: lea      rcx, [rsp + 0x78]
0000000180adf49d: mov      r8d, edi
0000000180adf4a0: mov      qword ptr [rsp + 0x20], r15
0000000180adf4a5: mov      rdx, rbx
0000000180adf4a8: mov      r9, qword ptr [r9 + 0x20]
0000000180adf4ac: call     0x180648380 ; Torappu.Battle.BattleFormula.AttackInfo..ctor [64937]
0000000180adf4b1: mov      rcx, qword ptr [rip + 0x7e508e8] ; TypeInfo Torappu.Battle.BattleFormula @0x18892fda0
0000000180adf4b8: cmp      dword ptr [rcx + 0xe0], r15d
0000000180adf4bf: jne      0x180adf4c6
0000000180adf4c1: call     0x18048c140
0000000180adf4c6: mov      r9b, 1
0000000180adf4c9: mov      qword ptr [rsp + 0x28], r15
0000000180adf4ce: lea      rax, [rsp + 0x50]
0000000180adf4d3: movzx    r8d, r9b
0000000180adf4d7: mov      rdx, r14
0000000180adf4da: mov      qword ptr [rsp + 0x20], rax
0000000180adf4df: mov      rcx, r12
0000000180adf4e2: call     0x1806573c0 ; Torappu.Battle.BattleFormula.CalculateDamage [64918]
0000000180adf4e7: mov      rbx, rax
0000000180adf4ea: mov      qword ptr [rsp + 0x28], r15
0000000180adf4ef: lea      rax, [rsp + 0x78]
0000000180adf4f4: xor      r9d, r9d
0000000180adf4f7: mov      r8b, 1
0000000180adf4fa: mov      qword ptr [rsp + 0x20], rax
0000000180adf4ff: xor      edx, edx
0000000180adf501: mov      rcx, r12
0000000180adf504: call     0x1806573c0 ; Torappu.Battle.BattleFormula.CalculateDamage [64918]
0000000180adf509: mov      r13d, dword ptr [rsp + 0x50]
0000000180adf50e: lea      rcx, [rsp + 0x50]
0000000180adf513: xor      edx, edx
0000000180adf515: mov      rdi, rax
0000000180adf518: call     0x180648250 ; Torappu.Battle.BattleFormula.AttackInfo.GetFinalAtk [64939]
0000000180adf51d: mov      rcx, qword ptr [rip + 0x7e0dc54] ; TypeInfo Torappu.Battle.Modifier @0x1888ed178
0000000180adf524: mov      rsi, rax
0000000180adf527: cmp      dword ptr [rcx + 0xe0], r15d
0000000180adf52e: jne      0x180adf535
0000000180adf530: call     0x18048c140
0000000180adf535: mov      eax, dword ptr [rsp + 0x190]
0000000180adf53c: lea      rcx, [rsp + 0xa0]
0000000180adf544: mov      qword ptr [rsp + 0x48], r15
0000000180adf549: mov      r9d, r13d
0000000180adf54c: mov      qword ptr [rsp + 0x40], rsi
0000000180adf551: mov      r8, rdi
0000000180adf554: mov      dword ptr [rsp + 0x38], eax
0000000180adf558: mov      rdx, rbx
0000000180adf55b: mov      eax, dword ptr [rsp + 0x180]
0000000180adf562: mov      qword ptr [rsp + 0x30], r12
0000000180adf567: mov      qword ptr [rsp + 0x28], r14
0000000180adf56c: mov      dword ptr [rsp + 0x20], eax
0000000180adf570: call     0x1808b1670 ; Torappu.Battle.Modifier.NewDamageModifierAfterCalculate [71003]
0000000180adf575: mov      r13, qword ptr [rsp + 0x170]
0000000180adf57d: mov      rsi, qword ptr [rsp + 0x168]
0000000180adf585: mov      rbx, qword ptr [rsp + 0x160]
0000000180adf58d: jmp      0x180adf5d1
0000000180adf58f: mov      eax, dword ptr [rsp + 0x190]
0000000180adf596: lea      rcx, [rsp + 0xa0]
0000000180adf59e: xor      r15d, r15d
0000000180adf5a1: mov      r9, r12
0000000180adf5a4: mov      qword ptr [rsp + 0x40], r15
0000000180adf5a9: mov      r8, r14
0000000180adf5ac: mov      dword ptr [rsp + 0x38], eax
0000000180adf5b0: mov      rax, qword ptr [rsp + 0x188]
0000000180adf5b8: mov      qword ptr [rsp + 0x30], rax
0000000180adf5bd: mov      eax, dword ptr [rsp + 0x180]
0000000180adf5c4: mov      dword ptr [rsp + 0x28], eax
0000000180adf5c8: mov      dword ptr [rsp + 0x20], edi
0000000180adf5cc: call     0x1831b8e90 ; XLua.DelegateBridge.__Gen_Delegate_Imp12182 [14837]
0000000180adf5d1: movups   xmm0, xmmword ptr [rax]
0000000180adf5d4: mov      r15, qword ptr [rsp + 0x130]
0000000180adf5dc: movups   xmm1, xmmword ptr [rax + 0x10]
0000000180adf5e0: movups   xmmword ptr [rbp], xmm0
0000000180adf5e4: movups   xmm0, xmmword ptr [rax + 0x20]
0000000180adf5e8: movups   xmmword ptr [rbp + 0x10], xmm1
0000000180adf5ec: movups   xmm1, xmmword ptr [rax + 0x30]
0000000180adf5f0: movups   xmmword ptr [rbp + 0x20], xmm0
0000000180adf5f4: movups   xmm0, xmmword ptr [rax + 0x40]
0000000180adf5f8: movups   xmmword ptr [rbp + 0x30], xmm1
0000000180adf5fc: movups   xmm1, xmmword ptr [rax + 0x50]
0000000180adf600: movups   xmmword ptr [rbp + 0x40], xmm0
0000000180adf604: movups   xmm0, xmmword ptr [rax + 0x60]
0000000180adf608: movups   xmmword ptr [rbp + 0x50], xmm1
0000000180adf60c: movups   xmm1, xmmword ptr [rax + 0x70]
0000000180adf610: movups   xmmword ptr [rbp + 0x60], xmm0
0000000180adf614: movsd    xmm0, qword ptr [rax + 0x80]
0000000180adf61c: mov      rax, rbp
0000000180adf61f: movups   xmmword ptr [rbp + 0x70], xmm1
0000000180adf623: movsd    qword ptr [rbp + 0x80], xmm0
0000000180adf62b: add      rsp, 0x138
0000000180adf632: pop      r14
0000000180adf634: pop      r12
0000000180adf636: pop      rdi
0000000180adf637: pop      rbp
0000000180adf638: ret      
0000000180adf639: call     0x18048c0b0
0000000180adf63e: int3     
0000000180adf63f: int3     