; Torappu.Battle.Entity.get_isFrozen metadata=66488 token=0x60103b9 VA=0x180705b50 RVA=0x705b50 size=0xa0
0000000180705b50: push     rbx
0000000180705b52: sub      rsp, 0x20
0000000180705b56: cmp      byte ptr [rip + 0x858acf3], 0
0000000180705b5d: mov      rbx, rcx
0000000180705b60: jne      0x180705b75
0000000180705b62: lea      rcx, [rip + 0x813b7ff] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180705b69: call     0x18048bf00
0000000180705b6e: mov      byte ptr [rip + 0x858acdb], 1
0000000180705b75: mov      rax, qword ptr [rip + 0x813b7ec] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180705b7c: cmp      dword ptr [rax + 0xe0], 0
0000000180705b83: jne      0x180705b94
0000000180705b85: mov      rcx, rax
0000000180705b88: call     0x18048c140
0000000180705b8d: mov      rax, qword ptr [rip + 0x813b7d4] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180705b94: mov      rax, qword ptr [rax + 0xb8]
0000000180705b9b: mov      rcx, qword ptr [rax + 0x418]
0000000180705ba2: test     rcx, rcx
0000000180705ba5: jne      0x180705bcb
0000000180705ba7: xor      edx, edx
0000000180705ba9: mov      rcx, rbx
0000000180705bac: call     0x180701e20 ; Torappu.Battle.Entity.get_attributes [66358]
0000000180705bb1: test     rax, rax
0000000180705bb4: je       0x180705bdb
0000000180705bb6: xor      r8d, r8d
0000000180705bb9: mov      edx, 0x10
0000000180705bbe: mov      rcx, rax
0000000180705bc1: add      rsp, 0x20
0000000180705bc5: pop      rbx
0000000180705bc6: jmp      0x180649280 ; Torappu.Battle.Attributes.GetAbnormalFlag [64279]
0000000180705bcb: xor      r8d, r8d
0000000180705bce: mov      rdx, rbx
0000000180705bd1: add      rsp, 0x20
0000000180705bd5: pop      rbx
0000000180705bd6: jmp      0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
0000000180705bdb: call     0x18048c0b0
0000000180705be0: int3     
0000000180705be1: int3     
0000000180705be2: int3     
0000000180705be3: int3     
0000000180705be4: int3     
0000000180705be5: int3     
0000000180705be6: int3     
0000000180705be7: int3     
0000000180705be8: int3     
0000000180705be9: int3     
0000000180705bea: int3     
0000000180705beb: int3     
0000000180705bec: int3     
0000000180705bed: int3     
0000000180705bee: int3     
0000000180705bef: int3     
