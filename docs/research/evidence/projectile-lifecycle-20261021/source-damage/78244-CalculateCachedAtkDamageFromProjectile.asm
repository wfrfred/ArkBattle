; Torappu.Battle.BattleUtil.CalculateCachedAtkDamageFromProjectile metadata=78244 token=0x60131a5 VA=0x180adea80 RVA=0xadea80 size=0x2b0
0000000180adea80: push     rbx
0000000180adea82: push     rbp
0000000180adea83: push     r12
0000000180adea85: push     r14
0000000180adea87: sub      rsp, 0x118
0000000180adea8e: cmp      byte ptr [rip + 0x81b42d1], 0
0000000180adea95: mov      r12, r9
0000000180adea98: mov      rbp, r8
0000000180adea9b: mov      rbx, rdx
0000000180adea9e: mov      r14, rcx
0000000180adeaa1: jne      0x180adeada
0000000180adeaa3: lea      rcx, [rip + 0x7e512f6] ; TypeInfo Torappu.Battle.BattleFormula @0x18892fda0
0000000180adeaaa: call     0x18048bf00
0000000180adeaaf: lea      rcx, [rip + 0x7e58eaa] ; TypeInfo Torappu.Battle.BattleUtil @0x188937960
0000000180adeab6: call     0x18048bf00
0000000180adeabb: lea      rcx, [rip + 0x7e0e6b6] ; TypeInfo Torappu.Battle.Modifier @0x1888ed178
0000000180adeac2: call     0x18048bf00
0000000180adeac7: lea      rcx, [rip + 0x7e5421a] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180adeace: call     0x18048bf00
0000000180adead3: mov      byte ptr [rip + 0x81b428c], 1
0000000180adeada: xor      eax, eax
0000000180adeadc: mov      qword ptr [rsp + 0x110], r15
0000000180adeae4: mov      qword ptr [rsp + 0x80], rax
0000000180adeaec: xorps    xmm0, xmm0
0000000180adeaef: mov      rax, qword ptr [rip + 0x7e58e6a] ; TypeInfo Torappu.Battle.BattleUtil @0x188937960
0000000180adeaf6: movups   xmmword ptr [rsp + 0x60], xmm0
0000000180adeafb: movups   xmmword ptr [rsp + 0x70], xmm0
0000000180adeb00: mov      rcx, qword ptr [rax + 0xb8]
0000000180adeb07: mov      rdx, qword ptr [rcx + 0xc8]
0000000180adeb0e: xor      r15d, r15d
0000000180adeb11: test     rdx, rdx
0000000180adeb14: jne      0x180adec62
0000000180adeb1a: mov      r9, qword ptr [rsp + 0x170]
0000000180adeb22: lea      rcx, [rsp + 0x60]
0000000180adeb27: mov      r8d, dword ptr [rsp + 0x160]
0000000180adeb2f: mov      rdx, rbx
0000000180adeb32: mov      qword ptr [rsp + 0x20], r15
0000000180adeb37: call     0x180648380 ; Torappu.Battle.BattleFormula.AttackInfo..ctor [64937]
0000000180adeb3c: mov      rcx, qword ptr [rip + 0x7e541a5] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180adeb43: cmp      dword ptr [rcx + 0xe0], r15d
0000000180adeb4a: jne      0x180adeb51
0000000180adeb4c: call     0x18048c140
0000000180adeb51: xor      r8d, r8d
0000000180adeb54: xor      edx, edx
0000000180adeb56: mov      rcx, rbp
0000000180adeb59: call     0x186b63a70
0000000180adeb5e: test     al, al
0000000180adeb60: je       0x180adeb7e
0000000180adeb62: test     rbp, rbp
0000000180adeb65: je       0x180aded29
0000000180adeb6b: xor      r9d, r9d
0000000180adeb6e: lea      r8, [rsp + 0x60]
0000000180adeb73: mov      rdx, r12
0000000180adeb76: mov      rcx, rbp
0000000180adeb79: call     0x1806f8550 ; Torappu.Battle.Entity.OnCalculateCachedProjectileDamage [66659]
0000000180adeb7e: mov      qword ptr [rsp + 0x140], rsi
0000000180adeb86: mov      qword ptr [rsp + 0x148], rdi
0000000180adeb8e: mov      qword ptr [rsp + 0x150], r13
0000000180adeb96: cmp      byte ptr [rsp + 0x180], r15b
0000000180adeb9e: mov      rcx, qword ptr [rip + 0x7e511fb] ; TypeInfo Torappu.Battle.BattleFormula @0x18892fda0
0000000180adeba5: cmove    rbp, r15
0000000180adeba9: cmp      dword ptr [rcx + 0xe0], r15d
0000000180adebb0: jne      0x180adebb7
0000000180adebb2: call     0x18048c140
0000000180adebb7: lea      rax, [rsp + 0x60]
0000000180adebbc: mov      qword ptr [rsp + 0x28], r15
0000000180adebc1: xor      r9d, r9d
0000000180adebc4: mov      qword ptr [rsp + 0x20], rax
0000000180adebc9: mov      r8b, 1
0000000180adebcc: mov      rdx, rbp
0000000180adebcf: mov      rcx, r12
0000000180adebd2: call     0x1806573c0 ; Torappu.Battle.BattleFormula.CalculateDamage [64918]
0000000180adebd7: mov      rdi, qword ptr [rsp + 0x68]
0000000180adebdc: lea      rcx, [rsp + 0x60]
0000000180adebe1: mov      r13d, dword ptr [rsp + 0x60]
0000000180adebe6: xor      edx, edx
0000000180adebe8: mov      rbx, rax
0000000180adebeb: call     0x180648250 ; Torappu.Battle.BattleFormula.AttackInfo.GetFinalAtk [64939]
0000000180adebf0: mov      rcx, qword ptr [rip + 0x7e0e581] ; TypeInfo Torappu.Battle.Modifier @0x1888ed178
0000000180adebf7: mov      rsi, rax
0000000180adebfa: cmp      dword ptr [rcx + 0xe0], r15d
0000000180adec01: jne      0x180adec08
0000000180adec03: call     0x18048c140
0000000180adec08: mov      eax, dword ptr [rsp + 0x178]
0000000180adec0f: lea      rcx, [rsp + 0x88]
0000000180adec17: mov      qword ptr [rsp + 0x48], r15
0000000180adec1c: mov      r9d, r13d
0000000180adec1f: mov      qword ptr [rsp + 0x40], rsi
0000000180adec24: mov      r8, rdi
0000000180adec27: mov      dword ptr [rsp + 0x38], eax
0000000180adec2b: mov      rdx, rbx
0000000180adec2e: mov      eax, dword ptr [rsp + 0x168]
0000000180adec35: mov      qword ptr [rsp + 0x30], r12
0000000180adec3a: mov      qword ptr [rsp + 0x28], rbp
0000000180adec3f: mov      dword ptr [rsp + 0x20], eax
0000000180adec43: call     0x1808b1670 ; Torappu.Battle.Modifier.NewDamageModifierAfterCalculate [71003]
0000000180adec48: mov      r13, qword ptr [rsp + 0x150]
0000000180adec50: mov      rdi, qword ptr [rsp + 0x148]
0000000180adec58: mov      rsi, qword ptr [rsp + 0x140]
0000000180adec60: jmp      0x180adecb9
0000000180adec62: movzx    eax, byte ptr [rsp + 0x180]
0000000180adec6a: lea      rcx, [rsp + 0x88]
0000000180adec72: mov      qword ptr [rsp + 0x50], r15
0000000180adec77: mov      r9, rbp
0000000180adec7a: mov      byte ptr [rsp + 0x48], al
0000000180adec7e: mov      r8, rbx
0000000180adec81: mov      eax, dword ptr [rsp + 0x178]
0000000180adec88: mov      dword ptr [rsp + 0x40], eax
0000000180adec8c: mov      rax, qword ptr [rsp + 0x170]
0000000180adec94: mov      qword ptr [rsp + 0x38], rax
0000000180adec99: mov      eax, dword ptr [rsp + 0x168]
0000000180adeca0: mov      dword ptr [rsp + 0x30], eax
0000000180adeca4: mov      eax, dword ptr [rsp + 0x160]
0000000180adecab: mov      dword ptr [rsp + 0x28], eax
0000000180adecaf: mov      qword ptr [rsp + 0x20], r12
0000000180adecb4: call     0x1831b9610 ; XLua.DelegateBridge.__Gen_Delegate_Imp12184 [14839]
0000000180adecb9: movups   xmm0, xmmword ptr [rax]
0000000180adecbc: mov      r15, qword ptr [rsp + 0x110]
0000000180adecc4: movups   xmm1, xmmword ptr [rax + 0x10]
0000000180adecc8: movups   xmmword ptr [r14], xmm0
0000000180adeccc: movups   xmm0, xmmword ptr [rax + 0x20]
0000000180adecd0: movups   xmmword ptr [r14 + 0x10], xmm1
0000000180adecd5: movups   xmm1, xmmword ptr [rax + 0x30]
0000000180adecd9: movups   xmmword ptr [r14 + 0x20], xmm0
0000000180adecde: movups   xmm0, xmmword ptr [rax + 0x40]
0000000180adece2: movups   xmmword ptr [r14 + 0x30], xmm1
0000000180adece7: movups   xmm1, xmmword ptr [rax + 0x50]
0000000180adeceb: movups   xmmword ptr [r14 + 0x40], xmm0
0000000180adecf0: movups   xmm0, xmmword ptr [rax + 0x60]
0000000180adecf4: movups   xmmword ptr [r14 + 0x50], xmm1
0000000180adecf9: movups   xmm1, xmmword ptr [rax + 0x70]
0000000180adecfd: movups   xmmword ptr [r14 + 0x60], xmm0
0000000180aded02: movsd    xmm0, qword ptr [rax + 0x80]
0000000180aded0a: mov      rax, r14
0000000180aded0d: movups   xmmword ptr [r14 + 0x70], xmm1
0000000180aded12: movsd    qword ptr [r14 + 0x80], xmm0
0000000180aded1b: add      rsp, 0x118
0000000180aded22: pop      r14
0000000180aded24: pop      r12
0000000180aded26: pop      rbp
0000000180aded27: pop      rbx
0000000180aded28: ret      
0000000180aded29: call     0x18048c0b0
0000000180aded2e: int3     
0000000180aded2f: int3     