; Torappu.Battle.Enemy.get_minBlockDistToTarget metadata=76552 token=0x6012b09 VA=0x180a7ed80 RVA=0xa7ed80 size=0x80
0000000180a7ed80: push     rbx
0000000180a7ed82: sub      rsp, 0x20
0000000180a7ed86: cmp      byte ptr [rip + 0x8213b64], 0
0000000180a7ed8d: mov      rbx, rcx
0000000180a7ed90: jne      0x180a7eda5
0000000180a7ed92: lea      rcx, [rip + 0x7d9c917] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7ed99: call     0x18048bf00
0000000180a7ed9e: mov      byte ptr [rip + 0x8213b4c], 1
0000000180a7eda5: mov      rax, qword ptr [rip + 0x7d9c904] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7edac: cmp      dword ptr [rax + 0xe0], 0
0000000180a7edb3: jne      0x180a7edc4
0000000180a7edb5: mov      rcx, rax
0000000180a7edb8: call     0x18048c140
0000000180a7edbd: mov      rax, qword ptr [rip + 0x7d9c8ec] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7edc4: mov      rax, qword ptr [rax + 0xb8]
0000000180a7edcb: mov      rcx, qword ptr [rax + 0x8c8]
0000000180a7edd2: test     rcx, rcx
0000000180a7edd5: jne      0x180a7ede5
0000000180a7edd7: movss    xmm0, dword ptr [rip + 0x63c0fc5]
0000000180a7eddf: add      rsp, 0x20
0000000180a7ede3: pop      rbx
0000000180a7ede4: ret      
0000000180a7ede5: xor      r8d, r8d
0000000180a7ede8: mov      rdx, rbx
0000000180a7edeb: add      rsp, 0x20
0000000180a7edef: pop      rbx
0000000180a7edf0: jmp      0x1836404d0 ; XLua.DelegateBridge.__Gen_Delegate_Imp80 [2735]
0000000180a7edf5: int3     
0000000180a7edf6: int3     
0000000180a7edf7: int3     
0000000180a7edf8: int3     
0000000180a7edf9: int3     
0000000180a7edfa: int3     
0000000180a7edfb: int3     
0000000180a7edfc: int3     
0000000180a7edfd: int3     
0000000180a7edfe: int3     
0000000180a7edff: int3     