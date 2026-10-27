; Torappu.Battle.Tile.get_passableMask metadata=70662 token=0x6011407 VA=0x1808c66f0 RVA=0x8c66f0 size=0x60
00000001808c66f0: push     rbx
00000001808c66f2: sub      rsp, 0x20
00000001808c66f6: cmp      byte ptr [rip + 0x83caef9], 0
00000001808c66fd: mov      rbx, rcx
00000001808c6700: jne      0x1808c6715
00000001808c6702: lea      rcx, [rip + 0x80023c7] ; TypeInfo Torappu.Battle.Tile @0x1888c8ad0
00000001808c6709: call     0x18048bf00
00000001808c670e: mov      byte ptr [rip + 0x83caee1], 1
00000001808c6715: mov      rax, qword ptr [rip + 0x80023b4] ; TypeInfo Torappu.Battle.Tile @0x1888c8ad0
00000001808c671c: mov      rdx, qword ptr [rax + 0xb8]
00000001808c6723: mov      rcx, qword ptr [rdx + 0x108]
00000001808c672a: test     rcx, rcx
00000001808c672d: jne      0x1808c673b
00000001808c672f: mov      eax, dword ptr [rbx + 0x94]
00000001808c6735: add      rsp, 0x20
00000001808c6739: pop      rbx
00000001808c673a: ret      
00000001808c673b: xor      r8d, r8d
00000001808c673e: mov      rdx, rbx
00000001808c6741: add      rsp, 0x20
00000001808c6745: pop      rbx
00000001808c6746: jmp      0x183367f80 ; XLua.DelegateBridge.__Gen_Delegate_Imp3364 [6019]
00000001808c674b: int3     
00000001808c674c: int3     
00000001808c674d: int3     
00000001808c674e: int3     
00000001808c674f: int3     
