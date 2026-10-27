; Torappu.Battle.Entity.get_isStunned metadata=66486 token=0x60103b7 VA=0x180706a00 RVA=0x706a00 size=0xc0
0000000180706a00: push     rbx
0000000180706a02: sub      rsp, 0x20
0000000180706a06: cmp      byte ptr [rip + 0x8589e41], 0
0000000180706a0d: mov      rbx, rcx
0000000180706a10: jne      0x180706a25
0000000180706a12: lea      rcx, [rip + 0x813a94f] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180706a19: call     0x18048bf00
0000000180706a1e: mov      byte ptr [rip + 0x8589e29], 1
0000000180706a25: mov      rax, qword ptr [rip + 0x813a93c] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180706a2c: cmp      dword ptr [rax + 0xe0], 0
0000000180706a33: jne      0x180706a44
0000000180706a35: mov      rcx, rax
0000000180706a38: call     0x18048c140
0000000180706a3d: mov      rax, qword ptr [rip + 0x813a924] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180706a44: mov      rax, qword ptr [rax + 0xb8]
0000000180706a4b: mov      rcx, qword ptr [rax + 0x408]
0000000180706a52: test     rcx, rcx
0000000180706a55: jne      0x180706aa3
0000000180706a57: xor      edx, edx
0000000180706a59: mov      rcx, rbx
0000000180706a5c: call     0x180701e20 ; Torappu.Battle.Entity.get_attributes [66358]
0000000180706a61: test     rax, rax
0000000180706a64: je       0x180706ab3
0000000180706a66: xor      r8d, r8d
0000000180706a69: xor      edx, edx
0000000180706a6b: mov      rcx, rax
0000000180706a6e: call     0x180649280 ; Torappu.Battle.Attributes.GetAbnormalFlag [64279]
0000000180706a73: test     al, al
0000000180706a75: je       0x180706a7f
0000000180706a77: mov      al, 1
0000000180706a79: add      rsp, 0x20
0000000180706a7d: pop      rbx
0000000180706a7e: ret      
0000000180706a7f: xor      edx, edx
0000000180706a81: mov      rcx, rbx
0000000180706a84: call     0x180701e20 ; Torappu.Battle.Entity.get_attributes [66358]
0000000180706a89: test     rax, rax
0000000180706a8c: je       0x180706ab3
0000000180706a8e: xor      r8d, r8d
0000000180706a91: mov      edx, 0x13
0000000180706a96: mov      rcx, rax
0000000180706a99: add      rsp, 0x20
0000000180706a9d: pop      rbx
0000000180706a9e: jmp      0x180649280 ; Torappu.Battle.Attributes.GetAbnormalFlag [64279]
0000000180706aa3: xor      r8d, r8d
0000000180706aa6: mov      rdx, rbx
0000000180706aa9: add      rsp, 0x20
0000000180706aad: pop      rbx
0000000180706aae: jmp      0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
0000000180706ab3: call     0x18048c0b0
0000000180706ab8: int3     
0000000180706ab9: int3     
0000000180706aba: int3     
0000000180706abb: int3     
0000000180706abc: int3     
0000000180706abd: int3     
0000000180706abe: int3     
0000000180706abf: int3     
