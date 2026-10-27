; Torappu.Battle.Enemy.CombatWrapper.GetTarget metadata=76877 token=0x6012c4e VA=0x180a89f80 RVA=0xa89f80 size=0x110
0000000180a89f80: mov      qword ptr [rsp + 0x10], rbx
0000000180a89f85: push     rsi
0000000180a89f86: sub      rsp, 0x20
0000000180a89f8a: cmp      byte ptr [rip + 0x8208a35], 0
0000000180a89f91: mov      rbx, rcx
0000000180a89f94: jne      0x180a89fb5
0000000180a89f96: lea      rcx, [rip + 0x7dd3443] ; TypeInfo Torappu.Battle.Enemy.CombatWrapper @0x18885d3e0
0000000180a89f9d: call     0x18048bf00
0000000180a89fa2: lea      rcx, [rip + 0x7ea8d3f] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a89fa9: call     0x18048bf00
0000000180a89fae: mov      byte ptr [rip + 0x8208a11], 1
0000000180a89fb5: mov      rax, qword ptr [rip + 0x7dd3424] ; TypeInfo Torappu.Battle.Enemy.CombatWrapper @0x18885d3e0
0000000180a89fbc: xor      esi, esi
0000000180a89fbe: mov      qword ptr [rsp + 0x40], rsi
0000000180a89fc3: mov      rcx, qword ptr [rax + 0xb8]
0000000180a89fca: mov      rcx, qword ptr [rcx + 0x50]
0000000180a89fce: test     rcx, rcx
0000000180a89fd1: jne      0x180a8a06b
0000000180a89fd7: mov      rcx, qword ptr [rbx + 0x10]
0000000180a89fdb: test     rcx, rcx
0000000180a89fde: je       0x180a8a081
0000000180a89fe4: xor      edx, edx
0000000180a89fe6: mov      qword ptr [rsp + 0x30], rdi
0000000180a89feb: call     0x180a7bb20 ; Torappu.Battle.Enemy.get_blocker [76320]
0000000180a89ff0: mov      rcx, qword ptr [rip + 0x7ea8cf1] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a89ff7: mov      rdi, rax
0000000180a89ffa: cmp      dword ptr [rcx + 0xe0], esi
0000000180a8a000: jne      0x180a8a007
0000000180a8a002: call     0x18048c140
0000000180a8a007: xor      r8d, r8d
0000000180a8a00a: xor      edx, edx
0000000180a8a00c: mov      rcx, rdi
0000000180a8a00f: call     0x186b63a70
0000000180a8a014: mov      rcx, qword ptr [rbx + 0x10]
0000000180a8a018: mov      rdi, qword ptr [rsp + 0x30]
0000000180a8a01d: test     rcx, rcx
0000000180a8a020: je       0x180a8a081
0000000180a8a022: xor      edx, edx
0000000180a8a024: test     al, al
0000000180a8a026: jne      0x180a8a05b
0000000180a8a028: call     0x180a7b770 ; Torappu.Battle.Enemy.get_blockManager [76548]
0000000180a8a02d: test     rax, rax
0000000180a8a030: je       0x180a8a081
0000000180a8a032: xor      r8d, r8d
0000000180a8a035: lea      rdx, [rsp + 0x40]
0000000180a8a03a: mov      rcx, rax
0000000180a8a03d: call     0x180aa1030 ; Torappu.Battle.BlockManager.TryGetCombatTarget [77202]
0000000180a8a042: mov      rcx, qword ptr [rsp + 0x40]
0000000180a8a047: test     al, al
0000000180a8a049: cmove    rcx, rsi
0000000180a8a04d: mov      rax, rcx
0000000180a8a050: mov      rbx, qword ptr [rsp + 0x38]
0000000180a8a055: add      rsp, 0x20
0000000180a8a059: pop      rsi
0000000180a8a05a: ret      
0000000180a8a05b: call     0x180a7bb20 ; Torappu.Battle.Enemy.get_blocker [76320]
0000000180a8a060: mov      rbx, qword ptr [rsp + 0x38]
0000000180a8a065: add      rsp, 0x20
0000000180a8a069: pop      rsi
0000000180a8a06a: ret      
0000000180a8a06b: xor      r8d, r8d
0000000180a8a06e: mov      rdx, rbx
0000000180a8a071: call     0x1832f6410 ; XLua.DelegateBridge.__Gen_Delegate_Imp2631 [5286]
0000000180a8a076: mov      rbx, qword ptr [rsp + 0x38]
0000000180a8a07b: add      rsp, 0x20
0000000180a8a07f: pop      rsi
0000000180a8a080: ret      
0000000180a8a081: call     0x18048c0b0
0000000180a8a086: int3     
0000000180a8a087: int3     
0000000180a8a088: int3     
0000000180a8a089: int3     
0000000180a8a08a: int3     
0000000180a8a08b: int3     
0000000180a8a08c: int3     
0000000180a8a08d: int3     
0000000180a8a08e: int3     
0000000180a8a08f: int3     