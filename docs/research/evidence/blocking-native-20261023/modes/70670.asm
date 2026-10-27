; Torappu.Battle.Tile.get_isHighland metadata=70670 token=0x601140f VA=0x1808c5f10 RVA=0x8c5f10 size=0xb0
00000001808c5f10: push     rbx
00000001808c5f12: sub      rsp, 0x20
00000001808c5f16: cmp      byte ptr [rip + 0x83cb6e1], 0
00000001808c5f1d: mov      rbx, rcx
00000001808c5f20: jne      0x1808c5f35
00000001808c5f22: lea      rcx, [rip + 0x8002ba7] ; TypeInfo Torappu.Battle.Tile @0x1888c8ad0
00000001808c5f29: call     0x18048bf00
00000001808c5f2e: mov      byte ptr [rip + 0x83cb6c9], 1
00000001808c5f35: mov      rdx, qword ptr [rip + 0x8002b94] ; TypeInfo Torappu.Battle.Tile @0x1888c8ad0
00000001808c5f3c: mov      rax, qword ptr [rdx + 0xb8]
00000001808c5f43: mov      rcx, qword ptr [rax + 0x148]
00000001808c5f4a: test     rcx, rcx
00000001808c5f4d: jne      0x1808c5fa7
00000001808c5f4f: cmp      byte ptr [rip + 0x83cb6b6], cl
00000001808c5f55: jne      0x1808c5f71
00000001808c5f57: lea      rcx, [rip + 0x8002b72] ; TypeInfo Torappu.Battle.Tile @0x1888c8ad0
00000001808c5f5e: call     0x18048bf00
00000001808c5f63: mov      rdx, qword ptr [rip + 0x8002b66] ; TypeInfo Torappu.Battle.Tile @0x1888c8ad0
00000001808c5f6a: mov      byte ptr [rip + 0x83cb69a], 1
00000001808c5f71: mov      rax, qword ptr [rdx + 0xb8]
00000001808c5f78: mov      rcx, qword ptr [rax + 0x1b0]
00000001808c5f7f: test     rcx, rcx
00000001808c5f82: jne      0x1808c5f8a
00000001808c5f84: mov      rax, qword ptr [rbx + 0x50]
00000001808c5f88: jmp      0x1808c5f95
00000001808c5f8a: xor      r8d, r8d
00000001808c5f8d: mov      rdx, rbx
00000001808c5f90: call     0x183369250 ; XLua.DelegateBridge.__Gen_Delegate_Imp3373 [6028]
00000001808c5f95: test     rax, rax
00000001808c5f98: je       0x1808c5fb7
00000001808c5f9a: cmp      dword ptr [rax + 0x18], 1
00000001808c5f9e: sete     al
00000001808c5fa1: add      rsp, 0x20
00000001808c5fa5: pop      rbx
00000001808c5fa6: ret      
00000001808c5fa7: xor      r8d, r8d
00000001808c5faa: mov      rdx, rbx
00000001808c5fad: add      rsp, 0x20
00000001808c5fb1: pop      rbx
00000001808c5fb2: jmp      0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
00000001808c5fb7: call     0x18048c0b0
00000001808c5fbc: int3     
00000001808c5fbd: int3     
00000001808c5fbe: int3     
00000001808c5fbf: int3     