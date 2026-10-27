; Torappu.Battle.Entity.get_isGroundBound metadata=66491 token=0x60103bc VA=0x180705bf0 RVA=0x705bf0 size=0xa0
0000000180705bf0: push     rbx
0000000180705bf2: sub      rsp, 0x20
0000000180705bf6: cmp      byte ptr [rip + 0x858ac56], 0
0000000180705bfd: mov      rbx, rcx
0000000180705c00: jne      0x180705c15
0000000180705c02: lea      rcx, [rip + 0x813b75f] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180705c09: call     0x18048bf00
0000000180705c0e: mov      byte ptr [rip + 0x858ac3e], 1
0000000180705c15: mov      rax, qword ptr [rip + 0x813b74c] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180705c1c: cmp      dword ptr [rax + 0xe0], 0
0000000180705c23: jne      0x180705c34
0000000180705c25: mov      rcx, rax
0000000180705c28: call     0x18048c140
0000000180705c2d: mov      rax, qword ptr [rip + 0x813b734] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180705c34: mov      rax, qword ptr [rax + 0xb8]
0000000180705c3b: mov      rcx, qword ptr [rax + 0x430]
0000000180705c42: test     rcx, rcx
0000000180705c45: jne      0x180705c6b
0000000180705c47: xor      edx, edx
0000000180705c49: mov      rcx, rbx
0000000180705c4c: call     0x180701e20 ; Torappu.Battle.Entity.get_attributes [66358]
0000000180705c51: test     rax, rax
0000000180705c54: je       0x180705c7b
0000000180705c56: xor      r8d, r8d
0000000180705c59: mov      edx, 0x2d
0000000180705c5e: mov      rcx, rax
0000000180705c61: add      rsp, 0x20
0000000180705c65: pop      rbx
0000000180705c66: jmp      0x180649280 ; Torappu.Battle.Attributes.GetAbnormalFlag [64279]
0000000180705c6b: xor      r8d, r8d
0000000180705c6e: mov      rdx, rbx
0000000180705c71: add      rsp, 0x20
0000000180705c75: pop      rbx
0000000180705c76: jmp      0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
0000000180705c7b: call     0x18048c0b0
0000000180705c80: int3     
0000000180705c81: int3     
0000000180705c82: int3     
0000000180705c83: int3     
0000000180705c84: int3     
0000000180705c85: int3     
0000000180705c86: int3     
0000000180705c87: int3     
0000000180705c88: int3     
0000000180705c89: int3     
0000000180705c8a: int3     
0000000180705c8b: int3     
0000000180705c8c: int3     
0000000180705c8d: int3     
0000000180705c8e: int3     
0000000180705c8f: int3     
