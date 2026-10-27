; Torappu.Battle.Enemy.get_totalMoveDist metadata=76319 token=0x6012a20 VA=0x180a801b0 RVA=0xa801b0 size=0x80
0000000180a801b0: push     rbx
0000000180a801b2: sub      rsp, 0x20
0000000180a801b6: cmp      byte ptr [rip + 0x821264b], 0
0000000180a801bd: mov      rbx, rcx
0000000180a801c0: jne      0x180a801d5
0000000180a801c2: lea      rcx, [rip + 0x7d9b4e7] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a801c9: call     0x18048bf00
0000000180a801ce: mov      byte ptr [rip + 0x8212633], 1
0000000180a801d5: mov      rax, qword ptr [rip + 0x7d9b4d4] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a801dc: cmp      dword ptr [rax + 0xe0], 0
0000000180a801e3: jne      0x180a801f4
0000000180a801e5: mov      rcx, rax
0000000180a801e8: call     0x18048c140
0000000180a801ed: mov      rax, qword ptr [rip + 0x7d9b4bc] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a801f4: mov      rax, qword ptr [rax + 0xb8]
0000000180a801fb: mov      rcx, qword ptr [rax + 0x180]
0000000180a80202: test     rcx, rcx
0000000180a80205: jne      0x180a80215
0000000180a80207: movss    xmm0, dword ptr [rbx + 0x348]
0000000180a8020f: add      rsp, 0x20
0000000180a80213: pop      rbx
0000000180a80214: ret      
0000000180a80215: xor      r8d, r8d
0000000180a80218: mov      rdx, rbx
0000000180a8021b: add      rsp, 0x20
0000000180a8021f: pop      rbx
0000000180a80220: jmp      0x1836404d0 ; XLua.DelegateBridge.__Gen_Delegate_Imp80 [2735]
0000000180a80225: int3     
0000000180a80226: int3     
0000000180a80227: int3     
0000000180a80228: int3     
0000000180a80229: int3     
0000000180a8022a: int3     
0000000180a8022b: int3     
0000000180a8022c: int3     
0000000180a8022d: int3     
0000000180a8022e: int3     
0000000180a8022f: int3     
