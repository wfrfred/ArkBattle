; Torappu.Battle.Tile.TileDynamicPositionController.get_tile metadata=70788 token=0x6011485 VA=0x1808bafa0 RVA=0x8bafa0 size=0x60
00000001808bafa0: push     rbx
00000001808bafa2: sub      rsp, 0x20
00000001808bafa6: cmp      byte ptr [rip + 0x83d66c7], 0
00000001808bafad: mov      rbx, rcx
00000001808bafb0: jne      0x1808bafc5
00000001808bafb2: lea      rcx, [rip + 0x8074aff] ; TypeInfo Torappu.Battle.Tile.TileDynamicPositionController @0x18892fab8
00000001808bafb9: call     0x18048bf00
00000001808bafbe: mov      byte ptr [rip + 0x83d66af], 1
00000001808bafc5: mov      rax, qword ptr [rip + 0x8074aec] ; TypeInfo Torappu.Battle.Tile.TileDynamicPositionController @0x18892fab8
00000001808bafcc: mov      rdx, qword ptr [rax + 0xb8]
00000001808bafd3: mov      rcx, qword ptr [rdx]
00000001808bafd6: test     rcx, rcx
00000001808bafd9: jne      0x1808bafe5
00000001808bafdb: mov      rax, qword ptr [rbx + 0x10]
00000001808bafdf: add      rsp, 0x20
00000001808bafe3: pop      rbx
00000001808bafe4: ret      
00000001808bafe5: xor      r8d, r8d
00000001808bafe8: mov      rdx, rbx
00000001808bafeb: add      rsp, 0x20
00000001808bafef: pop      rbx
00000001808baff0: jmp      0x183334190 ; XLua.DelegateBridge.__Gen_Delegate_Imp3029 [5684]
00000001808baff5: int3     
00000001808baff6: int3     
00000001808baff7: int3     
00000001808baff8: int3     
00000001808baff9: int3     
00000001808baffa: int3     
00000001808baffb: int3     
00000001808baffc: int3     
00000001808baffd: int3     
00000001808baffe: int3     
00000001808bafff: int3     