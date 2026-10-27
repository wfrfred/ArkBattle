; Torappu.Battle.Enemy.get_blockMode metadata=76549 token=0x6012b06 VA=0x180a7b7f0 RVA=0xa7b7f0 size=0x80
0000000180a7b7f0: push     rbx
0000000180a7b7f2: sub      rsp, 0x20
0000000180a7b7f6: cmp      byte ptr [rip + 0x82170f1], 0
0000000180a7b7fd: mov      rbx, rcx
0000000180a7b800: jne      0x180a7b815
0000000180a7b802: lea      rcx, [rip + 0x7d9fea7] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7b809: call     0x18048bf00
0000000180a7b80e: mov      byte ptr [rip + 0x82170d9], 1
0000000180a7b815: mov      rax, qword ptr [rip + 0x7d9fe94] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7b81c: cmp      dword ptr [rax + 0xe0], 0
0000000180a7b823: jne      0x180a7b834
0000000180a7b825: mov      rcx, rax
0000000180a7b828: call     0x18048c140
0000000180a7b82d: mov      rax, qword ptr [rip + 0x7d9fe7c] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7b834: mov      rax, qword ptr [rax + 0xb8]
0000000180a7b83b: mov      rcx, qword ptr [rax + 0x8b0]
0000000180a7b842: test     rcx, rcx
0000000180a7b845: jne      0x180a7b856
0000000180a7b847: xor      edx, edx
0000000180a7b849: mov      rcx, rbx
0000000180a7b84c: add      rsp, 0x20
0000000180a7b850: pop      rbx
0000000180a7b851: jmp      0x180702940 ; Torappu.Battle.Entity.get_changeableMotionMode [66374]
0000000180a7b856: xor      r8d, r8d
0000000180a7b859: mov      rdx, rbx
0000000180a7b85c: add      rsp, 0x20
0000000180a7b860: pop      rbx
0000000180a7b861: jmp      0x183333df0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3027 [5682]
0000000180a7b866: int3     
0000000180a7b867: int3     
0000000180a7b868: int3     
0000000180a7b869: int3     
0000000180a7b86a: int3     
0000000180a7b86b: int3     
0000000180a7b86c: int3     
0000000180a7b86d: int3     
0000000180a7b86e: int3     
0000000180a7b86f: int3     