; Torappu.Battle.Enemy.get_isInCombat metadata=76358 token=0x6012a47 VA=0x180a7dfe0 RVA=0xa7dfe0 size=0xf0
0000000180a7dfe0: push     rbx
0000000180a7dfe2: sub      rsp, 0x20
0000000180a7dfe6: cmp      byte ptr [rip + 0x8214842], 0
0000000180a7dfed: mov      rbx, rcx
0000000180a7dff0: jne      0x180a7e011
0000000180a7dff2: lea      rcx, [rip + 0x7d9d6b7] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7dff9: call     0x18048bf00
0000000180a7dffe: lea      rcx, [rip + 0x7eb4ce3] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a7e005: call     0x18048bf00
0000000180a7e00a: mov      byte ptr [rip + 0x821481e], 1
0000000180a7e011: mov      rax, qword ptr [rip + 0x7d9d698] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7e018: cmp      dword ptr [rax + 0xe0], 0
0000000180a7e01f: jne      0x180a7e030
0000000180a7e021: mov      rcx, rax
0000000180a7e024: call     0x18048c140
0000000180a7e029: mov      rax, qword ptr [rip + 0x7d9d680] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7e030: mov      rax, qword ptr [rax + 0xb8]
0000000180a7e037: mov      rcx, qword ptr [rax + 0x2b8]
0000000180a7e03e: test     rcx, rcx
0000000180a7e041: jne      0x180a7e0ac
0000000180a7e043: mov      qword ptr [rsp + 0x30], rdi
0000000180a7e048: xor      edx, edx
0000000180a7e04a: mov      rcx, rbx
0000000180a7e04d: call     0x180a7bb20 ; Torappu.Battle.Enemy.get_blocker [76320]
0000000180a7e052: mov      rcx, qword ptr [rip + 0x7eb4c8f] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a7e059: mov      rdi, rax
0000000180a7e05c: cmp      dword ptr [rcx + 0xe0], 0
0000000180a7e063: jne      0x180a7e06a
0000000180a7e065: call     0x18048c140
0000000180a7e06a: xor      r8d, r8d
0000000180a7e06d: xor      edx, edx
0000000180a7e06f: mov      rcx, rdi
0000000180a7e072: call     0x186b63a70
0000000180a7e077: mov      rdi, qword ptr [rsp + 0x30]
0000000180a7e07c: test     al, al
0000000180a7e07e: je       0x180a7e088
0000000180a7e080: mov      al, 1
0000000180a7e082: add      rsp, 0x20
0000000180a7e086: pop      rbx
0000000180a7e087: ret      
0000000180a7e088: xor      edx, edx
0000000180a7e08a: mov      rcx, rbx
0000000180a7e08d: call     0x180a7b770 ; Torappu.Battle.Enemy.get_blockManager [76548]
0000000180a7e092: test     rax, rax
0000000180a7e095: je       0x180a7e0bc
0000000180a7e097: xor      edx, edx
0000000180a7e099: mov      rcx, rax
0000000180a7e09c: call     0x180aa1900 ; Torappu.Battle.BlockManager.get_blockEnemyCnt [77187]
0000000180a7e0a1: test     eax, eax
0000000180a7e0a3: setg     al
0000000180a7e0a6: add      rsp, 0x20
0000000180a7e0aa: pop      rbx
0000000180a7e0ab: ret      
0000000180a7e0ac: xor      r8d, r8d
0000000180a7e0af: mov      rdx, rbx
0000000180a7e0b2: add      rsp, 0x20
0000000180a7e0b6: pop      rbx
0000000180a7e0b7: jmp      0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
0000000180a7e0bc: call     0x18048c0b0
0000000180a7e0c1: int3     
0000000180a7e0c2: int3     
0000000180a7e0c3: int3     
0000000180a7e0c4: int3     
0000000180a7e0c5: int3     
0000000180a7e0c6: int3     
0000000180a7e0c7: int3     
0000000180a7e0c8: int3     
0000000180a7e0c9: int3     
0000000180a7e0ca: int3     
0000000180a7e0cb: int3     
0000000180a7e0cc: int3     
0000000180a7e0cd: int3     
0000000180a7e0ce: int3     
0000000180a7e0cf: int3     