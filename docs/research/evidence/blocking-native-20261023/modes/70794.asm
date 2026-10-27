; Torappu.Battle.Tile.TileDynamicPositionController.UnbindDynamicPositionDeltaProvider metadata=70794 token=0x601148b VA=0x1808bac40 RVA=0x8bac40 size=0xa0
00000001808bac40: mov      qword ptr [rsp + 8], rbx
00000001808bac45: push     rdi
00000001808bac46: sub      rsp, 0x20
00000001808bac4a: cmp      byte ptr [rip + 0x83d6a29], 0
00000001808bac51: mov      rbx, rdx
00000001808bac54: mov      rdi, rcx
00000001808bac57: jne      0x1808bac78
00000001808bac59: lea      rcx, [rip + 0x7fc7cf8] ; GenericMethodInfo 279448 @0x188882958
00000001808bac60: call     0x18048bf00
00000001808bac65: lea      rcx, [rip + 0x8074e4c] ; TypeInfo Torappu.Battle.Tile.TileDynamicPositionController @0x18892fab8
00000001808bac6c: call     0x18048bf00
00000001808bac71: mov      byte ptr [rip + 0x83d6a02], 1
00000001808bac78: mov      rax, qword ptr [rip + 0x8074e39] ; TypeInfo Torappu.Battle.Tile.TileDynamicPositionController @0x18892fab8
00000001808bac7f: mov      r8, qword ptr [rax + 0xb8]
00000001808bac86: mov      rcx, qword ptr [r8 + 0x30]
00000001808bac8a: test     rcx, rcx
00000001808bac8d: jne      0x1808bacb6
00000001808bac8f: test     rbx, rbx
00000001808bac92: je       0x1808bacc4
00000001808bac94: mov      rcx, qword ptr [rdi + 0x50]
00000001808bac98: test     rcx, rcx
00000001808bac9b: je       0x1808baccf
00000001808bac9d: mov      r8, qword ptr [rip + 0x7fc7cb4] ; GenericMethodInfo 279448 @0x188882958
00000001808baca4: mov      rdx, rbx
00000001808baca7: mov      rbx, qword ptr [rsp + 0x30]
00000001808bacac: add      rsp, 0x20
00000001808bacb0: pop      rdi
00000001808bacb1: jmp      0x184d139a0
00000001808bacb6: xor      r9d, r9d
00000001808bacb9: mov      r8, rbx
00000001808bacbc: mov      rdx, rdi
00000001808bacbf: call     0x1832d2220 ; XLua.DelegateBridge.__Gen_Delegate_Imp23 [2678]
00000001808bacc4: mov      rbx, qword ptr [rsp + 0x30]
00000001808bacc9: add      rsp, 0x20
00000001808baccd: pop      rdi
00000001808bacce: ret      
00000001808baccf: call     0x18048c0b0
00000001808bacd4: int3     
00000001808bacd5: int3     
00000001808bacd6: int3     
00000001808bacd7: int3     
00000001808bacd8: int3     
00000001808bacd9: int3     
00000001808bacda: int3     
00000001808bacdb: int3     
00000001808bacdc: int3     
00000001808bacdd: int3     
00000001808bacde: int3     
00000001808bacdf: int3     