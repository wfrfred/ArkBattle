; Torappu.Battle.Enemy.get_blockRadiusSquare metadata=76551 token=0x6012b08 VA=0x180a7b870 RVA=0xa7b870 size=0xa0
0000000180a7b870: push     rbx
0000000180a7b872: sub      rsp, 0x20
0000000180a7b876: cmp      byte ptr [rip + 0x8217073], 0
0000000180a7b87d: mov      rbx, rcx
0000000180a7b880: jne      0x180a7b895
0000000180a7b882: lea      rcx, [rip + 0x7d9fe27] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7b889: call     0x18048bf00
0000000180a7b88e: mov      byte ptr [rip + 0x821705b], 1
0000000180a7b895: mov      rax, qword ptr [rip + 0x7d9fe14] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7b89c: cmp      dword ptr [rax + 0xe0], 0
0000000180a7b8a3: jne      0x180a7b8b4
0000000180a7b8a5: mov      rcx, rax
0000000180a7b8a8: call     0x18048c140
0000000180a7b8ad: mov      rax, qword ptr [rip + 0x7d9fdfc] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7b8b4: mov      rax, qword ptr [rax + 0xb8]
0000000180a7b8bb: mov      rcx, qword ptr [rax + 0x8c0]
0000000180a7b8c2: test     rcx, rcx
0000000180a7b8c5: jne      0x180a7b8f2
0000000180a7b8c7: xor      edx, edx
0000000180a7b8c9: mov      rcx, rbx
0000000180a7b8cc: call     0x180a7b7f0 ; Torappu.Battle.Enemy.get_blockMode [76549]
0000000180a7b8d1: cmp      eax, 1
0000000180a7b8d4: je       0x180a7b8e4
0000000180a7b8d6: movss    xmm0, dword ptr [rip + 0x63c6322]
0000000180a7b8de: add      rsp, 0x20
0000000180a7b8e2: pop      rbx
0000000180a7b8e3: ret      
0000000180a7b8e4: movss    xmm0, dword ptr [rip + 0x63c6318]
0000000180a7b8ec: add      rsp, 0x20
0000000180a7b8f0: pop      rbx
0000000180a7b8f1: ret      
0000000180a7b8f2: xor      r8d, r8d
0000000180a7b8f5: mov      rdx, rbx
0000000180a7b8f8: add      rsp, 0x20
0000000180a7b8fc: pop      rbx
0000000180a7b8fd: jmp      0x1836404d0 ; XLua.DelegateBridge.__Gen_Delegate_Imp80 [2735]
0000000180a7b902: int3     
0000000180a7b903: int3     
0000000180a7b904: int3     
0000000180a7b905: int3     
0000000180a7b906: int3     
0000000180a7b907: int3     
0000000180a7b908: int3     
0000000180a7b909: int3     
0000000180a7b90a: int3     
0000000180a7b90b: int3     
0000000180a7b90c: int3     
0000000180a7b90d: int3     
0000000180a7b90e: int3     
0000000180a7b90f: int3     