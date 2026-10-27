; Torappu.Battle.Character.AsValidIBlocker metadata=75887 token=0x6012870 VA=0x180a273e0 RVA=0xa273e0 size=0x90
0000000180a273e0: mov      qword ptr [rsp + 8], rbx
0000000180a273e5: push     rdi
0000000180a273e6: sub      rsp, 0x20
0000000180a273ea: cmp      byte ptr [rip + 0x826b1b8], 0
0000000180a273f1: mov      rbx, rdx
0000000180a273f4: mov      rdi, rcx
0000000180a273f7: jne      0x180a2740c
0000000180a273f9: lea      rcx, [rip + 0x7e44e68] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a27400: call     0x18048bf00
0000000180a27405: mov      byte ptr [rip + 0x826b19d], 1
0000000180a2740c: mov      rax, qword ptr [rip + 0x7e44e55] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a27413: cmp      dword ptr [rax + 0xe0], 0
0000000180a2741a: jne      0x180a2742b
0000000180a2741c: mov      rcx, rax
0000000180a2741f: call     0x18048c140
0000000180a27424: mov      rax, qword ptr [rip + 0x7e44e3d] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a2742b: mov      rax, qword ptr [rax + 0xb8]
0000000180a27432: mov      rdx, rdi
0000000180a27435: mov      rcx, qword ptr [rax + 0x238]
0000000180a2743c: test     rcx, rcx
0000000180a2743f: jne      0x180a27459
0000000180a27441: mov      rcx, rbx
0000000180a27444: mov      qword ptr [rbx], rdi
0000000180a27447: call     0x18048b9e0
0000000180a2744c: mov      al, 1
0000000180a2744e: mov      rbx, qword ptr [rsp + 0x30]
0000000180a27453: add      rsp, 0x20
0000000180a27457: pop      rdi
0000000180a27458: ret      
0000000180a27459: xor      r9d, r9d
0000000180a2745c: mov      r8, rbx
0000000180a2745f: mov      rbx, qword ptr [rsp + 0x30]
0000000180a27464: add      rsp, 0x20
0000000180a27468: pop      rdi
0000000180a27469: jmp      0x1833971a0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3657 [6312]
0000000180a2746e: int3     
0000000180a2746f: int3     