; Torappu.Battle.Entity.get_isDoze metadata=66489 token=0x60103ba VA=0x180705950 RVA=0x705950 size=0xa0
0000000180705950: push     rbx
0000000180705952: sub      rsp, 0x20
0000000180705956: cmp      byte ptr [rip + 0x858aef4], 0
000000018070595d: mov      rbx, rcx
0000000180705960: jne      0x180705975
0000000180705962: lea      rcx, [rip + 0x813b9ff] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180705969: call     0x18048bf00
000000018070596e: mov      byte ptr [rip + 0x858aedc], 1
0000000180705975: mov      rax, qword ptr [rip + 0x813b9ec] ; TypeInfo Torappu.Battle.Entity @0x188841368
000000018070597c: cmp      dword ptr [rax + 0xe0], 0
0000000180705983: jne      0x180705994
0000000180705985: mov      rcx, rax
0000000180705988: call     0x18048c140
000000018070598d: mov      rax, qword ptr [rip + 0x813b9d4] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180705994: mov      rax, qword ptr [rax + 0xb8]
000000018070599b: mov      rcx, qword ptr [rax + 0x420]
00000001807059a2: test     rcx, rcx
00000001807059a5: jne      0x1807059cb
00000001807059a7: xor      edx, edx
00000001807059a9: mov      rcx, rbx
00000001807059ac: call     0x180701e20 ; Torappu.Battle.Entity.get_attributes [66358]
00000001807059b1: test     rax, rax
00000001807059b4: je       0x1807059db
00000001807059b6: xor      r8d, r8d
00000001807059b9: mov      edx, 0x2b
00000001807059be: mov      rcx, rax
00000001807059c1: add      rsp, 0x20
00000001807059c5: pop      rbx
00000001807059c6: jmp      0x180649280 ; Torappu.Battle.Attributes.GetAbnormalFlag [64279]
00000001807059cb: xor      r8d, r8d
00000001807059ce: mov      rdx, rbx
00000001807059d1: add      rsp, 0x20
00000001807059d5: pop      rbx
00000001807059d6: jmp      0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
00000001807059db: call     0x18048c0b0
00000001807059e0: int3     
00000001807059e1: int3     
00000001807059e2: int3     
00000001807059e3: int3     
00000001807059e4: int3     
00000001807059e5: int3     
00000001807059e6: int3     
00000001807059e7: int3     
00000001807059e8: int3     
00000001807059e9: int3     
00000001807059ea: int3     
00000001807059eb: int3     
00000001807059ec: int3     
00000001807059ed: int3     
00000001807059ee: int3     
00000001807059ef: int3     
