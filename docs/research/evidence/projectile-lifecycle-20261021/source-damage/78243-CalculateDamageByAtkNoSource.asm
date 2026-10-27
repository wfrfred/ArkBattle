; Torappu.Battle.BattleUtil.CalculateDamageByAtkNoSource metadata=78243 token=0x60131a4 VA=0x180aded30 RVA=0xaded30 size=0x200
0000000180aded30: mov      qword ptr [rsp + 0x18], rbx
0000000180aded35: push     rsi
0000000180aded36: push     rdi
0000000180aded37: push     r14
0000000180aded39: sub      rsp, 0x100
0000000180aded40: cmp      byte ptr [rip + 0x81b401e], 0
0000000180aded47: mov      edi, r9d
0000000180aded4a: mov      r14, r8
0000000180aded4d: mov      rbx, rdx
0000000180aded50: mov      rsi, rcx
0000000180aded53: jne      0x180aded80
0000000180aded55: lea      rcx, [rip + 0x7e51044] ; TypeInfo Torappu.Battle.BattleFormula @0x18892fda0
0000000180aded5c: call     0x18048bf00
0000000180aded61: lea      rcx, [rip + 0x7e58bf8] ; TypeInfo Torappu.Battle.BattleUtil @0x188937960
0000000180aded68: call     0x18048bf00
0000000180aded6d: lea      rcx, [rip + 0x7e0e404] ; TypeInfo Torappu.Battle.Modifier @0x1888ed178
0000000180aded74: call     0x18048bf00
0000000180aded79: mov      byte ptr [rip + 0x81b3fe5], 1
0000000180aded80: xor      eax, eax
0000000180aded82: mov      qword ptr [rsp + 0x120], rbp
0000000180aded8a: mov      qword ptr [rsp + 0x70], rax
0000000180aded8f: xorps    xmm0, xmm0
0000000180aded92: mov      rax, qword ptr [rip + 0x7e58bc7] ; TypeInfo Torappu.Battle.BattleUtil @0x188937960
0000000180aded99: movups   xmmword ptr [rsp + 0x50], xmm0
0000000180aded9e: movups   xmmword ptr [rsp + 0x60], xmm0
0000000180adeda3: mov      rcx, qword ptr [rax + 0xb8]
0000000180adedaa: mov      rdx, qword ptr [rcx + 0xc0]
0000000180adedb1: xor      ebp, ebp
0000000180adedb3: test     rdx, rdx
0000000180adedb6: jne      0x180adee80
0000000180adedbc: mov      r9, qword ptr [rsp + 0x148]
0000000180adedc4: lea      rcx, [rsp + 0x50]
0000000180adedc9: mov      r8d, edi
0000000180adedcc: mov      qword ptr [rsp + 0x128], r15
0000000180adedd4: mov      rdx, rbx
0000000180adedd7: mov      qword ptr [rsp + 0x20], rbp
0000000180adeddc: call     0x180648380 ; Torappu.Battle.BattleFormula.AttackInfo..ctor [64937]
0000000180adede1: mov      rcx, qword ptr [rip + 0x7e50fb8] ; TypeInfo Torappu.Battle.BattleFormula @0x18892fda0
0000000180adede8: cmp      dword ptr [rcx + 0xe0], ebp
0000000180adedee: jne      0x180adedf5
0000000180adedf0: call     0x18048c140
0000000180adedf5: lea      rax, [rsp + 0x50]
0000000180adedfa: mov      qword ptr [rsp + 0x28], rbp
0000000180adedff: xor      r9d, r9d
0000000180adee02: mov      qword ptr [rsp + 0x20], rax
0000000180adee07: mov      r8b, 1
0000000180adee0a: xor      edx, edx
0000000180adee0c: mov      rcx, r14
0000000180adee0f: call     0x1806573c0 ; Torappu.Battle.BattleFormula.CalculateDamage [64918]
0000000180adee14: mov      r15d, dword ptr [rsp + 0x50]
0000000180adee19: lea      rcx, [rsp + 0x50]
0000000180adee1e: xor      edx, edx
0000000180adee20: mov      rbx, rax
0000000180adee23: call     0x180648250 ; Torappu.Battle.BattleFormula.AttackInfo.GetFinalAtk [64939]
0000000180adee28: mov      rcx, qword ptr [rip + 0x7e0e349] ; TypeInfo Torappu.Battle.Modifier @0x1888ed178
0000000180adee2f: mov      rdi, rax
0000000180adee32: cmp      dword ptr [rcx + 0xe0], ebp
0000000180adee38: jne      0x180adee3f
0000000180adee3a: call     0x18048c140
0000000180adee3f: mov      eax, dword ptr [rsp + 0x150]
0000000180adee46: lea      rcx, [rsp + 0x78]
0000000180adee4b: mov      r9d, dword ptr [rsp + 0x140]
0000000180adee53: mov      r8d, r15d
0000000180adee56: mov      qword ptr [rsp + 0x40], rbp
0000000180adee5b: mov      rdx, rbx
0000000180adee5e: mov      qword ptr [rsp + 0x38], rdi
0000000180adee63: mov      dword ptr [rsp + 0x30], eax
0000000180adee67: mov      qword ptr [rsp + 0x28], r14
0000000180adee6c: mov      qword ptr [rsp + 0x20], rbp
0000000180adee71: call     0x1808b1440 ; Torappu.Battle.Modifier.NewDamageModifierAfterCalculate [71002]
0000000180adee76: mov      r15, qword ptr [rsp + 0x128]
0000000180adee7e: jmp      0x180adeebc
0000000180adee80: mov      eax, dword ptr [rsp + 0x150]
0000000180adee87: lea      rcx, [rsp + 0x78]
0000000180adee8c: mov      qword ptr [rsp + 0x40], rbp
0000000180adee91: mov      r9, r14
0000000180adee94: mov      dword ptr [rsp + 0x38], eax
0000000180adee98: mov      r8, rbx
0000000180adee9b: mov      rax, qword ptr [rsp + 0x148]
0000000180adeea3: mov      qword ptr [rsp + 0x30], rax
0000000180adeea8: mov      eax, dword ptr [rsp + 0x140]
0000000180adeeaf: mov      dword ptr [rsp + 0x28], eax
0000000180adeeb3: mov      dword ptr [rsp + 0x20], edi
0000000180adeeb7: call     0x1831b9240 ; XLua.DelegateBridge.__Gen_Delegate_Imp12183 [14838]
0000000180adeebc: movups   xmm0, xmmword ptr [rax]
0000000180adeebf: mov      rbp, qword ptr [rsp + 0x120]
0000000180adeec7: movups   xmm1, xmmword ptr [rax + 0x10]
0000000180adeecb: mov      rbx, qword ptr [rsp + 0x130]
0000000180adeed3: movups   xmmword ptr [rsi], xmm0
0000000180adeed6: movups   xmm0, xmmword ptr [rax + 0x20]
0000000180adeeda: movups   xmmword ptr [rsi + 0x10], xmm1
0000000180adeede: movups   xmm1, xmmword ptr [rax + 0x30]
0000000180adeee2: movups   xmmword ptr [rsi + 0x20], xmm0
0000000180adeee6: movups   xmm0, xmmword ptr [rax + 0x40]
0000000180adeeea: movups   xmmword ptr [rsi + 0x30], xmm1
0000000180adeeee: movups   xmm1, xmmword ptr [rax + 0x50]
0000000180adeef2: movups   xmmword ptr [rsi + 0x40], xmm0
0000000180adeef6: movups   xmm0, xmmword ptr [rax + 0x60]
0000000180adeefa: movups   xmmword ptr [rsi + 0x50], xmm1
0000000180adeefe: movups   xmm1, xmmword ptr [rax + 0x70]
0000000180adef02: movups   xmmword ptr [rsi + 0x60], xmm0
0000000180adef06: movsd    xmm0, qword ptr [rax + 0x80]
0000000180adef0e: mov      rax, rsi
0000000180adef11: movups   xmmword ptr [rsi + 0x70], xmm1
0000000180adef15: movsd    qword ptr [rsi + 0x80], xmm0
0000000180adef1d: add      rsp, 0x100
0000000180adef24: pop      r14
0000000180adef26: pop      rdi
0000000180adef27: pop      rsi
0000000180adef28: ret      
0000000180adef29: int3     
0000000180adef2a: int3     
0000000180adef2b: int3     
0000000180adef2c: int3     
0000000180adef2d: int3     
0000000180adef2e: int3     
0000000180adef2f: int3     