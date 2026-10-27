; Torappu.Battle.Character.get_ignoreBlockMode metadata=75899 token=0x601287c VA=0x180a3abd0 RVA=0xa3abd0 size=0x80
0000000180a3abd0: push     rbx
0000000180a3abd2: sub      rsp, 0x20
0000000180a3abd6: cmp      byte ptr [rip + 0x82579d8], 0
0000000180a3abdd: mov      rbx, rcx
0000000180a3abe0: jne      0x180a3abf5
0000000180a3abe2: lea      rcx, [rip + 0x7e3167f] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a3abe9: call     0x18048bf00
0000000180a3abee: mov      byte ptr [rip + 0x82579c0], 1
0000000180a3abf5: mov      rax, qword ptr [rip + 0x7e3166c] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a3abfc: cmp      dword ptr [rax + 0xe0], 0
0000000180a3ac03: jne      0x180a3ac14
0000000180a3ac05: mov      rcx, rax
0000000180a3ac08: call     0x18048c140
0000000180a3ac0d: mov      rax, qword ptr [rip + 0x7e31654] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a3ac14: mov      rax, qword ptr [rax + 0xb8]
0000000180a3ac1b: mov      rcx, qword ptr [rax + 0x298]
0000000180a3ac22: test     rcx, rcx
0000000180a3ac25: jne      0x180a3ac34
0000000180a3ac27: movzx    eax, byte ptr [rbx + 0x2d0]
0000000180a3ac2e: add      rsp, 0x20
0000000180a3ac32: pop      rbx
0000000180a3ac33: ret      
0000000180a3ac34: xor      r8d, r8d
0000000180a3ac37: mov      rdx, rbx
0000000180a3ac3a: add      rsp, 0x20
0000000180a3ac3e: pop      rbx
0000000180a3ac3f: jmp      0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
0000000180a3ac44: int3     
0000000180a3ac45: int3     
0000000180a3ac46: int3     
0000000180a3ac47: int3     
0000000180a3ac48: int3     
0000000180a3ac49: int3     
0000000180a3ac4a: int3     
0000000180a3ac4b: int3     
0000000180a3ac4c: int3     
0000000180a3ac4d: int3     
0000000180a3ac4e: int3     
0000000180a3ac4f: int3     