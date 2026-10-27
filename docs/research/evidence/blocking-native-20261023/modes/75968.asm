; Torappu.Battle.Character.ChangeBlockMode metadata=75968 token=0x60128c1 VA=0x180a27d30 RVA=0xa27d30 size=0x90
0000000180a27d30: mov      qword ptr [rsp + 8], rbx
0000000180a27d35: push     rdi
0000000180a27d36: sub      rsp, 0x20
0000000180a27d3a: cmp      byte ptr [rip + 0x826a8b9], 0
0000000180a27d41: mov      edi, edx
0000000180a27d43: mov      rbx, rcx
0000000180a27d46: jne      0x180a27d5b
0000000180a27d48: lea      rcx, [rip + 0x7e44519] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a27d4f: call     0x18048bf00
0000000180a27d54: mov      byte ptr [rip + 0x826a89f], 1
0000000180a27d5b: mov      rax, qword ptr [rip + 0x7e44506] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a27d62: cmp      dword ptr [rax + 0xe0], 0
0000000180a27d69: jne      0x180a27d7a
0000000180a27d6b: mov      rcx, rax
0000000180a27d6e: call     0x18048c140
0000000180a27d73: mov      rax, qword ptr [rip + 0x7e444ee] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a27d7a: mov      rax, qword ptr [rax + 0xb8]
0000000180a27d81: mov      rcx, qword ptr [rax + 0x4c0]
0000000180a27d88: test     rcx, rcx
0000000180a27d8b: jne      0x180a27da7
0000000180a27d8d: xor      edx, edx
0000000180a27d8f: mov      dword ptr [rbx + 0x51c], edi
0000000180a27d95: mov      rcx, rbx
0000000180a27d98: mov      rbx, qword ptr [rsp + 0x30]
0000000180a27d9d: add      rsp, 0x20
0000000180a27da1: pop      rdi
0000000180a27da2: jmp      0x180a2d0e0 ; Torappu.Battle.Character.OnBlockModeChanged [75970]
0000000180a27da7: xor      r9d, r9d
0000000180a27daa: mov      r8d, edi
0000000180a27dad: mov      rdx, rbx
0000000180a27db0: mov      rbx, qword ptr [rsp + 0x30]
0000000180a27db5: add      rsp, 0x20
0000000180a27db9: pop      rdi
0000000180a27dba: jmp      0x183333fc0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3028 [5683]
0000000180a27dbf: int3     