; Torappu.Battle.Enemy.get_canBlockEnemies metadata=76559 token=0x6012b10 VA=0x180a7bc60 RVA=0xa7bc60 size=0x80
0000000180a7bc60: push     rbx
0000000180a7bc62: sub      rsp, 0x20
0000000180a7bc66: cmp      byte ptr [rip + 0x8216c8b], 0
0000000180a7bc6d: mov      rbx, rcx
0000000180a7bc70: jne      0x180a7bc85
0000000180a7bc72: lea      rcx, [rip + 0x7d9fa37] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7bc79: call     0x18048bf00
0000000180a7bc7e: mov      byte ptr [rip + 0x8216c73], 1
0000000180a7bc85: mov      rax, qword ptr [rip + 0x7d9fa24] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7bc8c: cmp      dword ptr [rax + 0xe0], 0
0000000180a7bc93: jne      0x180a7bca4
0000000180a7bc95: mov      rcx, rax
0000000180a7bc98: call     0x18048c140
0000000180a7bc9d: mov      rax, qword ptr [rip + 0x7d9fa0c] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7bca4: mov      rax, qword ptr [rax + 0xb8]
0000000180a7bcab: mov      rcx, qword ptr [rax + 0x900]
0000000180a7bcb2: test     rcx, rcx
0000000180a7bcb5: jne      0x180a7bcc6
0000000180a7bcb7: cmp      dword ptr [rbx + 0x340], ecx
0000000180a7bcbd: seta     al
0000000180a7bcc0: add      rsp, 0x20
0000000180a7bcc4: pop      rbx
0000000180a7bcc5: ret      
0000000180a7bcc6: xor      r8d, r8d
0000000180a7bcc9: mov      rdx, rbx
0000000180a7bccc: add      rsp, 0x20
0000000180a7bcd0: pop      rbx
0000000180a7bcd1: jmp      0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
0000000180a7bcd6: int3     
0000000180a7bcd7: int3     
0000000180a7bcd8: int3     
0000000180a7bcd9: int3     
0000000180a7bcda: int3     
0000000180a7bcdb: int3     
0000000180a7bcdc: int3     
0000000180a7bcdd: int3     
0000000180a7bcde: int3     
0000000180a7bcdf: int3     