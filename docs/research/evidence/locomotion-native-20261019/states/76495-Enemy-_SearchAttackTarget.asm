; Torappu.Battle.Enemy._SearchAttackTarget metadata=76495 token=0x6012ad0 VA=0x180a7a4a0 RVA=0xa7a4a0 size=0xb0
0000000180a7a4a0: push     rbx
0000000180a7a4a2: sub      rsp, 0x20
0000000180a7a4a6: cmp      byte ptr [rip + 0x821840b], 0
0000000180a7a4ad: mov      rbx, rcx
0000000180a7a4b0: jne      0x180a7a4c5
0000000180a7a4b2: lea      rcx, [rip + 0x7da11f7] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7a4b9: call     0x18048bf00
0000000180a7a4be: mov      byte ptr [rip + 0x82183f3], 1
0000000180a7a4c5: mov      rax, qword ptr [rip + 0x7da11e4] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7a4cc: cmp      dword ptr [rax + 0xe0], 0
0000000180a7a4d3: jne      0x180a7a4e4
0000000180a7a4d5: mov      rcx, rax
0000000180a7a4d8: call     0x18048c140
0000000180a7a4dd: mov      rax, qword ptr [rip + 0x7da11cc] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7a4e4: mov      rax, qword ptr [rax + 0xb8]
0000000180a7a4eb: mov      rcx, qword ptr [rax + 0x700]
0000000180a7a4f2: test     rcx, rcx
0000000180a7a4f5: jne      0x180a7a52b
0000000180a7a4f7: xor      edx, edx
0000000180a7a4f9: mov      rcx, rbx
0000000180a7a4fc: call     0x1807026b0 ; Torappu.Battle.Entity.get_canUseAtkOrCbt [66412]
0000000180a7a501: test     al, al
0000000180a7a503: je       0x180a7a523
0000000180a7a505: xor      edx, edx
0000000180a7a507: mov      rcx, rbx
0000000180a7a50a: call     0x180a7b540 ; Torappu.Battle.Enemy.get_attackWrapper [76386]
0000000180a7a50f: test     rax, rax
0000000180a7a512: je       0x180a7a53b
0000000180a7a514: xor      edx, edx
0000000180a7a516: mov      rcx, rax
0000000180a7a519: add      rsp, 0x20
0000000180a7a51d: pop      rbx
0000000180a7a51e: jmp      0x180a861e0 ; Torappu.Battle.Enemy.AttackWrapper.SearchTarget [76860]
0000000180a7a523: xor      al, al
0000000180a7a525: add      rsp, 0x20
0000000180a7a529: pop      rbx
0000000180a7a52a: ret      
0000000180a7a52b: xor      r8d, r8d
0000000180a7a52e: mov      rdx, rbx
0000000180a7a531: add      rsp, 0x20
0000000180a7a535: pop      rbx
0000000180a7a536: jmp      0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
0000000180a7a53b: call     0x18048c0b0
0000000180a7a540: int3     
0000000180a7a541: int3     
0000000180a7a542: int3     
0000000180a7a543: int3     
0000000180a7a544: int3     
0000000180a7a545: int3     
0000000180a7a546: int3     
0000000180a7a547: int3     
0000000180a7a548: int3     
0000000180a7a549: int3     
0000000180a7a54a: int3     
0000000180a7a54b: int3     
0000000180a7a54c: int3     
0000000180a7a54d: int3     
0000000180a7a54e: int3     
0000000180a7a54f: int3     
