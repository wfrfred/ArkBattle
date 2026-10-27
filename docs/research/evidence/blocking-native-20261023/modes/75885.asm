; Torappu.Battle.Character.get_canBlockEnemies metadata=75885 token=0x601286e VA=0x180a39b40 RVA=0xa39b40 size=0x70
0000000180a39b40: push     rbx
0000000180a39b42: sub      rsp, 0x20
0000000180a39b46: cmp      byte ptr [rip + 0x8258a5a], 0
0000000180a39b4d: mov      rbx, rcx
0000000180a39b50: jne      0x180a39b65
0000000180a39b52: lea      rcx, [rip + 0x7e3270f] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a39b59: call     0x18048bf00
0000000180a39b5e: mov      byte ptr [rip + 0x8258a42], 1
0000000180a39b65: mov      rax, qword ptr [rip + 0x7e326fc] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a39b6c: cmp      dword ptr [rax + 0xe0], 0
0000000180a39b73: jne      0x180a39b84
0000000180a39b75: mov      rcx, rax
0000000180a39b78: call     0x18048c140
0000000180a39b7d: mov      rax, qword ptr [rip + 0x7e326e4] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a39b84: mov      rax, qword ptr [rax + 0xb8]
0000000180a39b8b: mov      rcx, qword ptr [rax + 0x228]
0000000180a39b92: test     rcx, rcx
0000000180a39b95: jne      0x180a39b9f
0000000180a39b97: mov      al, 1
0000000180a39b99: add      rsp, 0x20
0000000180a39b9d: pop      rbx
0000000180a39b9e: ret      
0000000180a39b9f: xor      r8d, r8d
0000000180a39ba2: mov      rdx, rbx
0000000180a39ba5: add      rsp, 0x20
0000000180a39ba9: pop      rbx
0000000180a39baa: jmp      0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
0000000180a39baf: int3     