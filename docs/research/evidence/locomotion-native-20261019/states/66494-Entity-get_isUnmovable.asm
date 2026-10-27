; Torappu.Battle.Entity.get_isUnmovable metadata=66494 token=0x60103bf VA=0x180706d20 RVA=0x706d20 size=0xc0
0000000180706d20: push     rbx
0000000180706d22: sub      rsp, 0x20
0000000180706d26: cmp      byte ptr [rip + 0x8589b29], 0
0000000180706d2d: mov      rbx, rcx
0000000180706d30: jne      0x180706d45
0000000180706d32: lea      rcx, [rip + 0x813a62f] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180706d39: call     0x18048bf00
0000000180706d3e: mov      byte ptr [rip + 0x8589b11], 1
0000000180706d45: mov      rax, qword ptr [rip + 0x813a61c] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180706d4c: cmp      dword ptr [rax + 0xe0], 0
0000000180706d53: jne      0x180706d64
0000000180706d55: mov      rcx, rax
0000000180706d58: call     0x18048c140
0000000180706d5d: mov      rax, qword ptr [rip + 0x813a604] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180706d64: mov      rax, qword ptr [rax + 0xb8]
0000000180706d6b: mov      rcx, qword ptr [rax + 0x448]
0000000180706d72: test     rcx, rcx
0000000180706d75: jne      0x180706dc6
0000000180706d77: xor      edx, edx
0000000180706d79: mov      rcx, rbx
0000000180706d7c: call     0x180701e20 ; Torappu.Battle.Entity.get_attributes [66358]
0000000180706d81: test     rax, rax
0000000180706d84: je       0x180706dd6
0000000180706d86: xor      r8d, r8d
0000000180706d89: mov      edx, 0xd
0000000180706d8e: mov      rcx, rax
0000000180706d91: call     0x180649280 ; Torappu.Battle.Attributes.GetAbnormalFlag [64279]
0000000180706d96: test     al, al
0000000180706d98: je       0x180706da2
0000000180706d9a: mov      al, 1
0000000180706d9c: add      rsp, 0x20
0000000180706da0: pop      rbx
0000000180706da1: ret      
0000000180706da2: xor      edx, edx
0000000180706da4: mov      rcx, rbx
0000000180706da7: call     0x180701e20 ; Torappu.Battle.Entity.get_attributes [66358]
0000000180706dac: test     rax, rax
0000000180706daf: je       0x180706dd6
0000000180706db1: xor      r8d, r8d
0000000180706db4: mov      edx, 0x16
0000000180706db9: mov      rcx, rax
0000000180706dbc: add      rsp, 0x20
0000000180706dc0: pop      rbx
0000000180706dc1: jmp      0x180649280 ; Torappu.Battle.Attributes.GetAbnormalFlag [64279]
0000000180706dc6: xor      r8d, r8d
0000000180706dc9: mov      rdx, rbx
0000000180706dcc: add      rsp, 0x20
0000000180706dd0: pop      rbx
0000000180706dd1: jmp      0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
0000000180706dd6: call     0x18048c0b0
0000000180706ddb: int3     
0000000180706ddc: int3     
0000000180706ddd: int3     
0000000180706dde: int3     
0000000180706ddf: int3     
