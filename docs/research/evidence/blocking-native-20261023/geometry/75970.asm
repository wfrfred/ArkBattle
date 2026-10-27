; Torappu.Battle.Character.OnBlockModeChanged metadata=75970 token=0x60128c3 VA=0x180a2d0e0 RVA=0xa2d0e0 size=0xe0
0000000180a2d0e0: push     rdi
0000000180a2d0e2: sub      rsp, 0x20
0000000180a2d0e6: cmp      byte ptr [rip + 0x826550f], 0
0000000180a2d0ed: mov      rdi, rcx
0000000180a2d0f0: jne      0x180a2d105
0000000180a2d0f2: lea      rcx, [rip + 0x7e3f16f] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a2d0f9: call     0x18048bf00
0000000180a2d0fe: mov      byte ptr [rip + 0x82654f7], 1
0000000180a2d105: mov      rax, qword ptr [rip + 0x7e3f15c] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a2d10c: cmp      dword ptr [rax + 0xe0], 0
0000000180a2d113: jne      0x180a2d124
0000000180a2d115: mov      rcx, rax
0000000180a2d118: call     0x18048c140
0000000180a2d11d: mov      rax, qword ptr [rip + 0x7e3f144] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a2d124: mov      rax, qword ptr [rax + 0xb8]
0000000180a2d12b: mov      rcx, qword ptr [rax + 0x4d0]
0000000180a2d132: test     rcx, rcx
0000000180a2d135: jne      0x180a2d19a
0000000180a2d137: mov      qword ptr [rsp + 0x30], rbx
0000000180a2d13c: mov      ebx, dword ptr [rdi + 0x520]
0000000180a2d142: xor      edx, edx
0000000180a2d144: mov      rcx, rdi
0000000180a2d147: call     0x180a39480 ; Torappu.Battle.Character.get_blockMode [75898]
0000000180a2d14c: cmp      ebx, eax
0000000180a2d14e: mov      rbx, qword ptr [rsp + 0x30]
0000000180a2d153: je       0x180a2d1aa
0000000180a2d155: mov      rcx, qword ptr [rdi + 0x510]
0000000180a2d15c: test     rcx, rcx
0000000180a2d15f: je       0x180a2d1b0
0000000180a2d161: xor      r8d, r8d
0000000180a2d164: mov      rdx, rdi
0000000180a2d167: call     0x180aa0660 ; Torappu.Battle.BlockManager.ClearAllBlockees [77196]
0000000180a2d16c: xor      edx, edx
0000000180a2d16e: mov      rcx, rdi
0000000180a2d171: call     0x180a39480 ; Torappu.Battle.Character.get_blockMode [75898]
0000000180a2d176: xor      edx, edx
0000000180a2d178: mov      dword ptr [rdi + 0x520], eax
0000000180a2d17e: mov      rcx, rdi
0000000180a2d181: call     0x180702100 ; Torappu.Battle.Entity.get_buffContainer [66402]
0000000180a2d186: test     rax, rax
0000000180a2d189: je       0x180a2d1b0
0000000180a2d18b: xor      edx, edx
0000000180a2d18d: mov      rcx, rax
0000000180a2d190: add      rsp, 0x20
0000000180a2d194: pop      rdi
0000000180a2d195: jmp      0x180675420 ; Torappu.Battle.Buff.BuffContainer.OnOwnerBlockModeChanged [65435]
0000000180a2d19a: xor      r8d, r8d
0000000180a2d19d: mov      rdx, rdi
0000000180a2d1a0: add      rsp, 0x20
0000000180a2d1a4: pop      rdi
0000000180a2d1a5: jmp      0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
0000000180a2d1aa: add      rsp, 0x20
0000000180a2d1ae: pop      rdi
0000000180a2d1af: ret      
0000000180a2d1b0: call     0x18048c0b0
0000000180a2d1b5: int3     
0000000180a2d1b6: int3     
0000000180a2d1b7: int3     
0000000180a2d1b8: int3     
0000000180a2d1b9: int3     
0000000180a2d1ba: int3     
0000000180a2d1bb: int3     
0000000180a2d1bc: int3     
0000000180a2d1bd: int3     
0000000180a2d1be: int3     
0000000180a2d1bf: int3     