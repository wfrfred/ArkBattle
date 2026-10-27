; Torappu.Battle.Entity.get_isTargetFree metadata=66501 token=0x60103c6 VA=0x180706b40 RVA=0x706b40 size=0xa0
0000000180706b40: push     rbx
0000000180706b42: sub      rsp, 0x20
0000000180706b46: cmp      byte ptr [rip + 0x8589d10], 0
0000000180706b4d: mov      rbx, rcx
0000000180706b50: jne      0x180706b65
0000000180706b52: lea      rcx, [rip + 0x813a80f] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180706b59: call     0x18048bf00
0000000180706b5e: mov      byte ptr [rip + 0x8589cf8], 1
0000000180706b65: mov      rax, qword ptr [rip + 0x813a7fc] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180706b6c: cmp      dword ptr [rax + 0xe0], 0
0000000180706b73: jne      0x180706b84
0000000180706b75: mov      rcx, rax
0000000180706b78: call     0x18048c140
0000000180706b7d: mov      rax, qword ptr [rip + 0x813a7e4] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180706b84: mov      rax, qword ptr [rax + 0xb8]
0000000180706b8b: mov      rcx, qword ptr [rax + 0x480]
0000000180706b92: test     rcx, rcx
0000000180706b95: jne      0x180706bc7
0000000180706b97: cmp      byte ptr [rbx + 0x88], cl
0000000180706b9d: je       0x180706bbf
0000000180706b9f: cmp      byte ptr [rbx + 0x26], cl
0000000180706ba2: jne      0x180706bbf
0000000180706ba4: xor      r9d, r9d
0000000180706ba7: mov      edx, 0x2e
0000000180706bac: mov      r8d, 3
0000000180706bb2: mov      rcx, rbx
0000000180706bb5: add      rsp, 0x20
0000000180706bb9: pop      rbx
0000000180706bba: jmp      0x180709290 ; Torappu.Battle.Entity.isTargetFreeWithImmuneFlag [66508]
0000000180706bbf: mov      al, 1
0000000180706bc1: add      rsp, 0x20
0000000180706bc5: pop      rbx
0000000180706bc6: ret      
0000000180706bc7: xor      r8d, r8d
0000000180706bca: mov      rdx, rbx
0000000180706bcd: add      rsp, 0x20
0000000180706bd1: pop      rbx
0000000180706bd2: jmp      0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
0000000180706bd7: int3     
0000000180706bd8: int3     
0000000180706bd9: int3     
0000000180706bda: int3     
0000000180706bdb: int3     
0000000180706bdc: int3     
0000000180706bdd: int3     
0000000180706bde: int3     
0000000180706bdf: int3     