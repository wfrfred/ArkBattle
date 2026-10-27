; Torappu.Battle.Enemy.get_defaultBlockRadiusScale metadata=76558 token=0x6012b0f VA=0x180a7c1b0 RVA=0xa7c1b0 size=0xa0
0000000180a7c1b0: push     rbx
0000000180a7c1b2: sub      rsp, 0x20
0000000180a7c1b6: cmp      byte ptr [rip + 0x821673a], 0
0000000180a7c1bd: mov      rbx, rcx
0000000180a7c1c0: jne      0x180a7c1e1
0000000180a7c1c2: lea      rcx, [rip + 0x7d9f4e7] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7c1c9: call     0x18048bf00
0000000180a7c1ce: lea      rcx, [rip + 0x7dde52b] ; TypeInfo Torappu.FP @0x18885a700
0000000180a7c1d5: call     0x18048bf00
0000000180a7c1da: mov      byte ptr [rip + 0x8216716], 1
0000000180a7c1e1: mov      rax, qword ptr [rip + 0x7d9f4c8] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7c1e8: cmp      dword ptr [rax + 0xe0], 0
0000000180a7c1ef: jne      0x180a7c200
0000000180a7c1f1: mov      rcx, rax
0000000180a7c1f4: call     0x18048c140
0000000180a7c1f9: mov      rax, qword ptr [rip + 0x7d9f4b0] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7c200: mov      rax, qword ptr [rax + 0xb8]
0000000180a7c207: mov      rcx, qword ptr [rax + 0x8f8]
0000000180a7c20e: test     rcx, rcx
0000000180a7c211: jne      0x180a7c23c
0000000180a7c213: mov      rcx, qword ptr [rip + 0x7dde4e6] ; TypeInfo Torappu.FP @0x18885a700
0000000180a7c21a: cmp      dword ptr [rcx + 0xe0], 0
0000000180a7c221: jne      0x180a7c228
0000000180a7c223: call     0x18048c140
0000000180a7c228: movss    xmm0, dword ptr [rip + 0x63c39b0]
0000000180a7c230: xor      edx, edx
0000000180a7c232: add      rsp, 0x20
0000000180a7c236: pop      rbx
0000000180a7c237: jmp      0x1866fdad0
0000000180a7c23c: xor      r8d, r8d
0000000180a7c23f: mov      rdx, rbx
0000000180a7c242: add      rsp, 0x20
0000000180a7c246: pop      rbx
0000000180a7c247: jmp      0x1832f4c20 ; XLua.DelegateBridge.__Gen_Delegate_Imp2620 [5275]
0000000180a7c24c: int3     
0000000180a7c24d: int3     
0000000180a7c24e: int3     
0000000180a7c24f: int3     