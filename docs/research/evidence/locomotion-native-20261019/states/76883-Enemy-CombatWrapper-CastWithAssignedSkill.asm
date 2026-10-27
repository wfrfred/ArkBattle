; Torappu.Battle.Enemy.CombatWrapper.CastWithAssignedSkill metadata=76883 token=0x6012c54 VA=0x180a89c40 RVA=0xa89c40 size=0x100
0000000180a89c40: mov      qword ptr [rsp + 0x10], rbp
0000000180a89c45: mov      qword ptr [rsp + 0x18], rsi
0000000180a89c4a: mov      qword ptr [rsp + 0x20], rdi
0000000180a89c4f: push     r14
0000000180a89c51: sub      rsp, 0x40
0000000180a89c55: cmp      byte ptr [rip + 0x8208d70], 0
0000000180a89c5c: mov      rsi, r9
0000000180a89c5f: mov      rbp, r8
0000000180a89c62: mov      r14, rdx
0000000180a89c65: mov      rdi, rcx
0000000180a89c68: jne      0x180a89c95
0000000180a89c6a: lea      rcx, [rip + 0x7ebbaa7] ; MethodInfo Torappu.Battle.Enemy.CombatWrapper.CombatFinishCallback [76880] @0x188945718
0000000180a89c71: call     0x18048bf00
0000000180a89c76: lea      rcx, [rip + 0x7dd3763] ; TypeInfo Torappu.Battle.Enemy.CombatWrapper @0x18885d3e0
0000000180a89c7d: call     0x18048bf00
0000000180a89c82: lea      rcx, [rip + 0x7e16faf] ; TypeInfo Torappu.Battle.Ability.FinishCallbackDelegate @0x1888a0c38
0000000180a89c89: call     0x18048bf00
0000000180a89c8e: mov      byte ptr [rip + 0x8208d37], 1
0000000180a89c95: mov      rax, qword ptr [rip + 0x7dd3744] ; TypeInfo Torappu.Battle.Enemy.CombatWrapper @0x18885d3e0
0000000180a89c9c: mov      rcx, qword ptr [rax + 0xb8]
0000000180a89ca3: mov      rcx, qword ptr [rcx + 0x80]
0000000180a89caa: test     rcx, rcx
0000000180a89cad: jne      0x180a89d1c
0000000180a89caf: mov      qword ptr [rsp + 0x50], rbx
0000000180a89cb4: mov      rcx, qword ptr [rip + 0x7e16f7d] ; TypeInfo Torappu.Battle.Ability.FinishCallbackDelegate @0x1888a0c38
0000000180a89cbb: call     0x18045cfe0
0000000180a89cc0: mov      rbx, rax
0000000180a89cc3: test     rax, rax
0000000180a89cc6: je       0x180a89d3a
0000000180a89cc8: mov      r8, qword ptr [rip + 0x7ebba49] ; MethodInfo Torappu.Battle.Enemy.CombatWrapper.CombatFinishCallback [76880] @0x188945718
0000000180a89ccf: xor      r9d, r9d
0000000180a89cd2: mov      rdx, rdi
0000000180a89cd5: mov      rcx, rax
0000000180a89cd8: call     0x1805dd580 ; Torappu.Battle.Ability.FinishCallbackDelegate..ctor [63111] | XLua.__XLua_Gen_Delegate181..ctor [224734]
0000000180a89cdd: mov      qword ptr [rsp + 0x30], 0
0000000180a89ce6: mov      r9, rsi
0000000180a89ce9: mov      byte ptr [rsp + 0x28], 0
0000000180a89cee: mov      r8, rbp
0000000180a89cf1: mov      rdx, r14
0000000180a89cf4: mov      qword ptr [rsp + 0x20], rbx
0000000180a89cf9: mov      rcx, rdi
0000000180a89cfc: call     0x180a8a620 ; Torappu.Battle.Enemy.CombatWrapper._DoCast [76884]
0000000180a89d01: mov      rbx, qword ptr [rsp + 0x50]
0000000180a89d06: mov      rbp, qword ptr [rsp + 0x58]
0000000180a89d0b: mov      rsi, qword ptr [rsp + 0x60]
0000000180a89d10: mov      rdi, qword ptr [rsp + 0x68]
0000000180a89d15: add      rsp, 0x40
0000000180a89d19: pop      r14
0000000180a89d1b: ret      
0000000180a89d1c: mov      qword ptr [rsp + 0x28], 0
0000000180a89d25: mov      r9, rbp
0000000180a89d28: mov      r8, r14
0000000180a89d2b: mov      qword ptr [rsp + 0x20], rsi
0000000180a89d30: mov      rdx, rdi
0000000180a89d33: call     0x1833fcf90 ; XLua.DelegateBridge.__Gen_Delegate_Imp42 [2697]
0000000180a89d38: jmp      0x180a89d06
0000000180a89d3a: call     0x18048c0b0
0000000180a89d3f: int3     
