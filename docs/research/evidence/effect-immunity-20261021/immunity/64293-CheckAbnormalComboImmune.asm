; Torappu.Battle.Attributes.CheckAbnormalComboImmune metadata=64293 token=0x600fb26 VA=0x180648860 RVA=0x648860 size=0x70
0000000180648860: mov      qword ptr [rsp + 8], rbx
0000000180648865: push     rdi
0000000180648866: sub      rsp, 0x20
000000018064886a: mov      rbx, qword ptr [rcx + 0x50]
000000018064886e: mov      edi, edx
0000000180648870: test     rbx, rbx
0000000180648873: je       0x1806488c3
0000000180648875: cmp      byte ptr [rip + 0x8647938], 0
000000018064887c: jne      0x180648891
000000018064887e: lea      rcx, [rip + 0x8227043] ; GenericMethodInfo 292620 @0x18886f8c8
0000000180648885: call     0x18048bf00
000000018064888a: mov      byte ptr [rip + 0x8647923], 1
0000000180648891: mov      rdx, qword ptr [rip + 0x8227030] ; GenericMethodInfo 292620 @0x18886f8c8
0000000180648898: mov      ecx, edi
000000018064889a: mov      rbx, qword ptr [rbx + 0x18]
000000018064889e: call     0x1844dc660
00000001806488a3: test     rbx, rbx
00000001806488a6: je       0x1806488c3
00000001806488a8: cmp      eax, dword ptr [rbx + 0x18]
00000001806488ab: jae      0x1806488c9
00000001806488ad: cdqe     
00000001806488af: cmp      word ptr [rbx + rax*2 + 0x20], 0
00000001806488b5: mov      rbx, qword ptr [rsp + 0x30]
00000001806488ba: setg     al
00000001806488bd: add      rsp, 0x20
00000001806488c1: pop      rdi
00000001806488c2: ret      
00000001806488c3: call     0x18048c0b0
00000001806488c8: int3     
00000001806488c9: call     0x18048c0a0
00000001806488ce: int3     
00000001806488cf: int3     