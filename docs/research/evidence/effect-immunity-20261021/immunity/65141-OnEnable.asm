; Torappu.Battle.Buff.OnEnable metadata=65141 token=0x600fe76 VA=0x1806845d0 RVA=0x6845d0 size=0x110
00000001806845d0: push     rbx
00000001806845d2: sub      rsp, 0x120
00000001806845d9: cmp      byte ptr [rip + 0x860bd1b], 0
00000001806845e0: mov      rbx, rcx
00000001806845e3: jne      0x1806845f8
00000001806845e5: lea      rcx, [rip + 0x82d7c64] ; TypeInfo Torappu.Battle.Buff @0x18895c250
00000001806845ec: call     0x18048bf00
00000001806845f1: mov      byte ptr [rip + 0x860bd03], 1
00000001806845f8: mov      rax, qword ptr [rip + 0x82d7c51] ; TypeInfo Torappu.Battle.Buff @0x18895c250
00000001806845ff: cmp      dword ptr [rax + 0xe0], 0
0000000180684606: jne      0x180684617
0000000180684608: mov      rcx, rax
000000018068460b: call     0x18048c140
0000000180684610: mov      rax, qword ptr [rip + 0x82d7c39] ; TypeInfo Torappu.Battle.Buff @0x18895c250
0000000180684617: mov      rax, qword ptr [rax + 0xb8]
000000018068461e: mov      rcx, qword ptr [rax + 0x2e8]
0000000180684625: test     rcx, rcx
0000000180684628: jne      0x1806846b9
000000018068462e: xor      edx, edx
0000000180684630: mov      rcx, rbx
0000000180684633: call     0x18068f400 ; Torappu.Battle.Buff.get_owner [65062]
0000000180684638: test     rax, rax
000000018068463b: je       0x1806846cc
0000000180684641: xor      edx, edx
0000000180684643: mov      rcx, rax
0000000180684646: call     0x180701e20 ; Torappu.Battle.Entity.get_attributes [66358]
000000018068464b: test     rax, rax
000000018068464e: je       0x1806846cc
0000000180684650: xor      r8d, r8d
0000000180684653: mov      rdx, rbx
0000000180684656: mov      rcx, rax
0000000180684659: call     0x180648650 ; Torappu.Battle.Attributes.AddModifier [64273]
000000018068465e: cmp      qword ptr [rbx + 0x70], 0
0000000180684663: je       0x180684691
0000000180684665: xor      edx, edx
0000000180684667: mov      rcx, rbx
000000018068466a: call     0x18068f400 ; Torappu.Battle.Buff.get_owner [65062]
000000018068466f: test     rax, rax
0000000180684672: je       0x1806846cc
0000000180684674: xor      edx, edx
0000000180684676: mov      rcx, rax
0000000180684679: call     0x180701e20 ; Torappu.Battle.Entity.get_attributes [66358]
000000018068467e: test     rax, rax
0000000180684681: je       0x1806846cc
0000000180684683: xor      r8d, r8d
0000000180684686: mov      rdx, rbx
0000000180684689: mov      rcx, rax
000000018068468c: call     0x1806484d0 ; Torappu.Battle.Attributes.AddAbnormalResistanceModifier [64283]
0000000180684691: mov      r9b, 1
0000000180684694: mov      qword ptr [rsp + 0x20], 0
000000018068469d: mov      r8d, 0x18
00000001806846a3: lea      rcx, [rsp + 0x30]
00000001806846a8: mov      rdx, rbx
00000001806846ab: call     0x18068d4b0 ; Torappu.Battle.Buff._RunActions [65251]
00000001806846b0: add      rsp, 0x120
00000001806846b7: pop      rbx
00000001806846b8: ret      
00000001806846b9: xor      r8d, r8d
00000001806846bc: mov      rdx, rbx
00000001806846bf: add      rsp, 0x120
00000001806846c6: pop      rbx
00000001806846c7: jmp      0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
00000001806846cc: call     0x18048c0b0
00000001806846d1: int3     
00000001806846d2: int3     
00000001806846d3: int3     
00000001806846d4: int3     
00000001806846d5: int3     
00000001806846d6: int3     
00000001806846d7: int3     
00000001806846d8: int3     
00000001806846d9: int3     
00000001806846da: int3     
00000001806846db: int3     
00000001806846dc: int3     
00000001806846dd: int3     
00000001806846de: int3     
00000001806846df: int3     