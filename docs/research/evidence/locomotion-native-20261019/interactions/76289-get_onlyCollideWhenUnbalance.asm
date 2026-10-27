; Torappu.Battle.Enemy.get_onlyCollideWhenUnbalance metadata=76289 token=0x6012a02 VA=0x180a7f4f0 RVA=0xa7f4f0 size=0x70
0000000180a7f4f0: push     rbx
0000000180a7f4f2: sub      rsp, 0x20
0000000180a7f4f6: cmp      byte ptr [rip + 0x82132ed], 0
0000000180a7f4fd: mov      rbx, rcx
0000000180a7f500: jne      0x180a7f515
0000000180a7f502: lea      rcx, [rip + 0x7d9c1a7] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7f509: call     0x18048bf00
0000000180a7f50e: mov      byte ptr [rip + 0x82132d5], 1
0000000180a7f515: mov      rax, qword ptr [rip + 0x7d9c194] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7f51c: cmp      dword ptr [rax + 0xe0], 0
0000000180a7f523: jne      0x180a7f534
0000000180a7f525: mov      rcx, rax
0000000180a7f528: call     0x18048c140
0000000180a7f52d: mov      rax, qword ptr [rip + 0x7d9c17c] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7f534: mov      rax, qword ptr [rax + 0xb8]
0000000180a7f53b: mov      rcx, qword ptr [rax + 0x90]
0000000180a7f542: test     rcx, rcx
0000000180a7f545: jne      0x180a7f54f
0000000180a7f547: mov      al, 1
0000000180a7f549: add      rsp, 0x20
0000000180a7f54d: pop      rbx
0000000180a7f54e: ret      
0000000180a7f54f: xor      r8d, r8d
0000000180a7f552: mov      rdx, rbx
0000000180a7f555: add      rsp, 0x20
0000000180a7f559: pop      rbx
0000000180a7f55a: jmp      0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
0000000180a7f55f: int3     