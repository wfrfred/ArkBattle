; Torappu.Battle.Character.get_alwaysBlockFree metadata=75923 token=0x6012894 VA=0x180a38f50 RVA=0xa38f50 size=0x70
0000000180a38f50: push     rbx
0000000180a38f52: sub      rsp, 0x20
0000000180a38f56: cmp      byte ptr [rip + 0x8259670], 0
0000000180a38f5d: mov      rbx, rcx
0000000180a38f60: jne      0x180a38f75
0000000180a38f62: lea      rcx, [rip + 0x7e332ff] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a38f69: call     0x18048bf00
0000000180a38f6e: mov      byte ptr [rip + 0x8259658], 1
0000000180a38f75: mov      rax, qword ptr [rip + 0x7e332ec] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a38f7c: cmp      dword ptr [rax + 0xe0], 0
0000000180a38f83: jne      0x180a38f94
0000000180a38f85: mov      rcx, rax
0000000180a38f88: call     0x18048c140
0000000180a38f8d: mov      rax, qword ptr [rip + 0x7e332d4] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a38f94: mov      rax, qword ptr [rax + 0xb8]
0000000180a38f9b: mov      rcx, qword ptr [rax + 0x358]
0000000180a38fa2: test     rcx, rcx
0000000180a38fa5: jne      0x180a38faf
0000000180a38fa7: xor      al, al
0000000180a38fa9: add      rsp, 0x20
0000000180a38fad: pop      rbx
0000000180a38fae: ret      
0000000180a38faf: xor      r8d, r8d
0000000180a38fb2: mov      rdx, rbx
0000000180a38fb5: add      rsp, 0x20
0000000180a38fb9: pop      rbx
0000000180a38fba: jmp      0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
0000000180a38fbf: int3     