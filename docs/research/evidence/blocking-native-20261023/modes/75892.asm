; Torappu.Battle.Character.get__blockRadius metadata=75892 token=0x6012875 VA=0x180a38a40 RVA=0xa38a40 size=0xe0
0000000180a38a40: push     rbx
0000000180a38a42: sub      rsp, 0x20
0000000180a38a46: cmp      byte ptr [rip + 0x8259b61], 0
0000000180a38a4d: mov      rbx, rcx
0000000180a38a50: jne      0x180a38a65
0000000180a38a52: lea      rcx, [rip + 0x7e3380f] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a38a59: call     0x18048bf00
0000000180a38a5e: mov      byte ptr [rip + 0x8259b49], 1
0000000180a38a65: mov      rax, qword ptr [rip + 0x7e337fc] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a38a6c: cmp      dword ptr [rax + 0xe0], 0
0000000180a38a73: jne      0x180a38a84
0000000180a38a75: mov      rcx, rax
0000000180a38a78: call     0x18048c140
0000000180a38a7d: mov      rax, qword ptr [rip + 0x7e337e4] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a38a84: mov      rax, qword ptr [rax + 0xb8]
0000000180a38a8b: mov      rcx, qword ptr [rax + 0x260]
0000000180a38a92: test     rcx, rcx
0000000180a38a95: jne      0x180a38b01
0000000180a38a97: cmp      qword ptr [rbx + 0x510], rcx
0000000180a38a9e: je       0x180a38ad2
0000000180a38aa0: mov      rcx, qword ptr [rbx + 0x510]
0000000180a38aa7: xor      r8d, r8d
0000000180a38aaa: mov      rdx, rbx
0000000180a38aad: call     0x180aa0860 ; Torappu.Battle.BlockManager.HookBlockRadius [77197]
0000000180a38ab2: test     al, al
0000000180a38ab4: je       0x180a38ad2
0000000180a38ab6: mov      rcx, qword ptr [rbx + 0x510]
0000000180a38abd: test     rcx, rcx
0000000180a38ac0: je       0x180a38b11
0000000180a38ac2: xor      r8d, r8d
0000000180a38ac5: mov      rdx, rbx
0000000180a38ac8: add      rsp, 0x20
0000000180a38acc: pop      rbx
0000000180a38acd: jmp      0x180aa0840 ; Torappu.Battle.BlockManager.GetBlockRadius [77198]
0000000180a38ad2: xor      edx, edx
0000000180a38ad4: mov      rcx, rbx
0000000180a38ad7: call     0x180a39480 ; Torappu.Battle.Character.get_blockMode [75898]
0000000180a38adc: test     eax, eax
0000000180a38ade: je       0x180a38af3
0000000180a38ae0: cmp      eax, 1
0000000180a38ae3: jne      0x180a38af3
0000000180a38ae5: movss    xmm0, dword ptr [rip + 0x640911b]
0000000180a38aed: add      rsp, 0x20
0000000180a38af1: pop      rbx
0000000180a38af2: ret      
0000000180a38af3: movss    xmm0, dword ptr [rip + 0x6409095]
0000000180a38afb: add      rsp, 0x20
0000000180a38aff: pop      rbx
0000000180a38b00: ret      
0000000180a38b01: xor      r8d, r8d
0000000180a38b04: mov      rdx, rbx
0000000180a38b07: add      rsp, 0x20
0000000180a38b0b: pop      rbx
0000000180a38b0c: jmp      0x1836404d0 ; XLua.DelegateBridge.__Gen_Delegate_Imp80 [2735]
0000000180a38b11: call     0x18048c0b0
0000000180a38b16: int3     
0000000180a38b17: int3     
0000000180a38b18: int3     
0000000180a38b19: int3     
0000000180a38b1a: int3     
0000000180a38b1b: int3     
0000000180a38b1c: int3     
0000000180a38b1d: int3     
0000000180a38b1e: int3     
0000000180a38b1f: int3     