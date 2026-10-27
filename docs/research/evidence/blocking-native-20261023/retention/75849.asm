; Torappu.Battle.Character.get_hasCombat metadata=75849 token=0x601284a VA=0x180a3a610 RVA=0xa3a610 size=0xb0
0000000180a3a610: push     rbx
0000000180a3a612: sub      rsp, 0x20
0000000180a3a616: cmp      byte ptr [rip + 0x8257f66], 0
0000000180a3a61d: mov      rbx, rcx
0000000180a3a620: jne      0x180a3a635
0000000180a3a622: lea      rcx, [rip + 0x7e31c3f] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a3a629: call     0x18048bf00
0000000180a3a62e: mov      byte ptr [rip + 0x8257f4e], 1
0000000180a3a635: mov      rax, qword ptr [rip + 0x7e31c2c] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a3a63c: cmp      dword ptr [rax + 0xe0], 0
0000000180a3a643: jne      0x180a3a654
0000000180a3a645: mov      rcx, rax
0000000180a3a648: call     0x18048c140
0000000180a3a64d: mov      rax, qword ptr [rip + 0x7e31c14] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a3a654: mov      rax, qword ptr [rax + 0xb8]
0000000180a3a65b: mov      rcx, qword ptr [rax + 0x108]
0000000180a3a662: test     rcx, rcx
0000000180a3a665: jne      0x180a3a6a2
0000000180a3a667: xor      edx, edx
0000000180a3a669: mov      rcx, rbx
0000000180a3a66c: call     0x180ad21f0 ; Torappu.Battle.Unit.get_hasCombat [77565]
0000000180a3a671: test     al, al
0000000180a3a673: jne      0x180a3a67b
0000000180a3a675: add      rsp, 0x20
0000000180a3a679: pop      rbx
0000000180a3a67a: ret      
0000000180a3a67b: xor      edx, edx
0000000180a3a67d: mov      rcx, rbx
0000000180a3a680: call     0x180701e20 ; Torappu.Battle.Entity.get_attributes [66358]
0000000180a3a685: test     rax, rax
0000000180a3a688: je       0x180a3a6b2
0000000180a3a68a: xor      r8d, r8d
0000000180a3a68d: mov      edx, 0x14
0000000180a3a692: mov      rcx, rax
0000000180a3a695: call     0x180649280 ; Torappu.Battle.Attributes.GetAbnormalFlag [64279]
0000000180a3a69a: xor      al, 1
0000000180a3a69c: add      rsp, 0x20
0000000180a3a6a0: pop      rbx
0000000180a3a6a1: ret      
0000000180a3a6a2: xor      r8d, r8d
0000000180a3a6a5: mov      rdx, rbx
0000000180a3a6a8: add      rsp, 0x20
0000000180a3a6ac: pop      rbx
0000000180a3a6ad: jmp      0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
0000000180a3a6b2: call     0x18048c0b0
0000000180a3a6b7: int3     
0000000180a3a6b8: int3     
0000000180a3a6b9: int3     
0000000180a3a6ba: int3     
0000000180a3a6bb: int3     
0000000180a3a6bc: int3     
0000000180a3a6bd: int3     
0000000180a3a6be: int3     
0000000180a3a6bf: int3     