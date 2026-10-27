; Torappu.Battle.Enemy.get_footMapPosition metadata=76361 token=0x6012a4a VA=0x180a7cf50 RVA=0xa7cf50 size=0x90
0000000180a7cf50: push     rbx
0000000180a7cf52: sub      rsp, 0x20
0000000180a7cf56: cmp      byte ptr [rip + 0x82158d5], 0
0000000180a7cf5d: mov      rbx, rcx
0000000180a7cf60: jne      0x180a7cf75
0000000180a7cf62: lea      rcx, [rip + 0x7d9e747] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7cf69: call     0x18048bf00
0000000180a7cf6e: mov      byte ptr [rip + 0x82158bd], 1
0000000180a7cf75: mov      rax, qword ptr [rip + 0x7d9e734] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7cf7c: cmp      dword ptr [rax + 0xe0], 0
0000000180a7cf83: jne      0x180a7cf94
0000000180a7cf85: mov      rcx, rax
0000000180a7cf88: call     0x18048c140
0000000180a7cf8d: mov      rax, qword ptr [rip + 0x7d9e71c] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7cf94: mov      rax, qword ptr [rax + 0xb8]
0000000180a7cf9b: mov      rcx, qword ptr [rax + 0x2d0]
0000000180a7cfa2: test     rcx, rcx
0000000180a7cfa5: jne      0x180a7cfc5
0000000180a7cfa7: xor      edx, edx
0000000180a7cfa9: mov      rcx, rbx
0000000180a7cfac: call     0x180704020 ; Torappu.Battle.Entity.get_footMountPoint [66429]
0000000180a7cfb1: test     rax, rax
0000000180a7cfb4: je       0x180a7cfd5
0000000180a7cfb6: xor      edx, edx
0000000180a7cfb8: mov      rcx, rax
0000000180a7cfbb: add      rsp, 0x20
0000000180a7cfbf: pop      rbx
0000000180a7cfc0: jmp      0x1808b5d90 ; Torappu.Battle.MountPoint.get_mapPosition [71039]
0000000180a7cfc5: xor      r8d, r8d
0000000180a7cfc8: mov      rdx, rbx
0000000180a7cfcb: add      rsp, 0x20
0000000180a7cfcf: pop      rbx
0000000180a7cfd0: jmp      0x1835c4140 ; XLua.DelegateBridge.__Gen_Delegate_Imp72 [2727]
0000000180a7cfd5: call     0x18048c0b0
0000000180a7cfda: int3     
0000000180a7cfdb: int3     
0000000180a7cfdc: int3     
0000000180a7cfdd: int3     
0000000180a7cfde: int3     
0000000180a7cfdf: int3     
