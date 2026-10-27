; Torappu.Battle.EnemySkill.OnTick metadata=66313 token=0x601030a VA=0x1806de0e0 RVA=0x6de0e0 size=0x1a0
00000001806de0e0: mov      qword ptr [rsp + 0x10], rbx
00000001806de0e5: push     rdi
00000001806de0e6: sub      rsp, 0x20
00000001806de0ea: cmp      byte ptr [rip + 0x85b26c3], 0
00000001806de0f1: mov      rdi, rdx
00000001806de0f4: mov      rbx, rcx
00000001806de0f7: jne      0x1806de118
00000001806de0f9: lea      rcx, [rip + 0x8161320] ; TypeInfo Torappu.Battle.EnemySkill @0x18883f420
00000001806de100: call     0x18048bf00
00000001806de105: lea      rcx, [rip + 0x817c5f4] ; TypeInfo Torappu.FP @0x18885a700
00000001806de10c: call     0x18048bf00
00000001806de111: mov      byte ptr [rip + 0x85b269c], 1
00000001806de118: mov      rcx, qword ptr [rip + 0x8161301] ; TypeInfo Torappu.Battle.EnemySkill @0x18883f420
00000001806de11f: mov      rax, qword ptr [rcx + 0xb8]
00000001806de126: mov      r10, qword ptr [rax + 0x158]
00000001806de12d: test     r10, r10
00000001806de130: jne      0x1806de25f
00000001806de136: cmp      byte ptr [rip + 0x85b2650], r10b
00000001806de13d: jne      0x1806de159
00000001806de13f: lea      rcx, [rip + 0x81612da] ; TypeInfo Torappu.Battle.EnemySkill @0x18883f420
00000001806de146: call     0x18048bf00
00000001806de14b: mov      rcx, qword ptr [rip + 0x81612ce] ; TypeInfo Torappu.Battle.EnemySkill @0x18883f420
00000001806de152: mov      byte ptr [rip + 0x85b2634], 1
00000001806de159: mov      rax, qword ptr [rcx + 0xb8]
00000001806de160: mov      rcx, qword ptr [rax + 0x20]
00000001806de164: test     rcx, rcx
00000001806de167: jne      0x1806de16f
00000001806de169: mov      rax, qword ptr [rbx + 0x70]
00000001806de16d: jmp      0x1806de17a
00000001806de16f: xor      r8d, r8d
00000001806de172: mov      rdx, rbx
00000001806de175: call     0x183324130 ; XLua.DelegateBridge.__Gen_Delegate_Imp2921 [5576]
00000001806de17a: mov      qword ptr [rsp + 0x30], rsi
00000001806de17f: test     rax, rax
00000001806de182: je       0x1806de27a
00000001806de188: xor      edx, edx
00000001806de18a: mov      rcx, rax
00000001806de18d: call     0x1805d7e90 ; Torappu.Battle.Ability.get_isCasting [63037]
00000001806de192: test     al, al
00000001806de194: jne      0x1806de24f
00000001806de19a: cmp      byte ptr [rip + 0x85b25f8], al
00000001806de1a0: mov      rsi, qword ptr [rbx + 0x48]
00000001806de1a4: jne      0x1806de1b9
00000001806de1a6: lea      rcx, [rip + 0x8161273] ; TypeInfo Torappu.Battle.EnemySkill @0x18883f420
00000001806de1ad: call     0x18048bf00
00000001806de1b2: mov      byte ptr [rip + 0x85b25df], 1
00000001806de1b9: mov      rax, qword ptr [rip + 0x8161260] ; TypeInfo Torappu.Battle.EnemySkill @0x18883f420
00000001806de1c0: mov      rcx, qword ptr [rax + 0xb8]
00000001806de1c7: mov      rcx, qword ptr [rcx + 0x78]
00000001806de1cb: test     rcx, rcx
00000001806de1ce: jne      0x1806de1d9
00000001806de1d0: mov      rax, qword ptr [rbx + 0x88]
00000001806de1d7: jmp      0x1806de1e4
00000001806de1d9: xor      r8d, r8d
00000001806de1dc: mov      rdx, rbx
00000001806de1df: call     0x1833327f0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3017 [5672]
00000001806de1e4: test     rax, rax
00000001806de1e7: je       0x1806de27a
00000001806de1ed: xor      edx, edx
00000001806de1ef: mov      rcx, rax
00000001806de1f2: call     0x180708350 ; Torappu.Battle.Entity.get_slowDown [66484]
00000001806de1f7: mov      rcx, qword ptr [rip + 0x817c502] ; TypeInfo Torappu.FP @0x18885a700
00000001806de1fe: mov      rbx, rax
00000001806de201: cmp      dword ptr [rcx + 0xe0], 0
00000001806de208: jne      0x1806de20f
00000001806de20a: call     0x18048c140
00000001806de20f: xor      r8d, r8d
00000001806de212: mov      rdx, rbx
00000001806de215: mov      rcx, rdi
00000001806de218: call     0x1866fb870 ; Torappu.FP.op_Multiply [220471] | Torappu.FP.FastMul [220473]
00000001806de21d: mov      rbx, rax
00000001806de220: test     rsi, rsi
00000001806de223: je       0x1806de27a
00000001806de225: cmp      byte ptr [rip + 0x85ee5c4], 0
00000001806de22c: jbe      0x1806de236
00000001806de22e: mov      rcx, qword ptr [rsi]
00000001806de231: call     0x180446d00
00000001806de236: mov      r8, qword ptr [rsi]
00000001806de239: mov      rdx, rbx
00000001806de23c: mov      rcx, rsi
00000001806de23f: mov      rax, qword ptr [r8 + 0x190]
00000001806de246: mov      r8, qword ptr [r8 + 0x198]
00000001806de24d: call     rax
00000001806de24f: mov      rsi, qword ptr [rsp + 0x30]
00000001806de254: mov      rbx, qword ptr [rsp + 0x38]
00000001806de259: add      rsp, 0x20
00000001806de25d: pop      rdi
00000001806de25e: ret      
00000001806de25f: xor      r9d, r9d
00000001806de262: mov      r8, rdi
00000001806de265: mov      rdx, rbx
00000001806de268: mov      rcx, r10
00000001806de26b: mov      rbx, qword ptr [rsp + 0x38]
00000001806de270: add      rsp, 0x20
00000001806de274: pop      rdi
00000001806de275: jmp      0x1833f9830 ; XLua.DelegateBridge.__Gen_Delegate_Imp427 [3082]
00000001806de27a: call     0x18048c0b0
00000001806de27f: int3     
