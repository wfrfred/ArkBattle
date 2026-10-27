; Torappu.Battle.Tile.TileDynamicPositionController.set_tile metadata=70789 token=0x6011486 VA=0x1808bb000 RVA=0x8bb000 size=0x80
00000001808bb000: mov      qword ptr [rsp + 8], rbx
00000001808bb005: push     rdi
00000001808bb006: sub      rsp, 0x20
00000001808bb00a: cmp      byte ptr [rip + 0x83d6664], 0
00000001808bb011: mov      rbx, rdx
00000001808bb014: mov      rdi, rcx
00000001808bb017: jne      0x1808bb02c
00000001808bb019: lea      rcx, [rip + 0x8074a98] ; TypeInfo Torappu.Battle.Tile.TileDynamicPositionController @0x18892fab8
00000001808bb020: call     0x18048bf00
00000001808bb025: mov      byte ptr [rip + 0x83d6649], 1
00000001808bb02c: mov      rax, qword ptr [rip + 0x8074a85] ; TypeInfo Torappu.Battle.Tile.TileDynamicPositionController @0x18892fab8
00000001808bb033: mov      r8, qword ptr [rax + 0xb8]
00000001808bb03a: mov      rcx, qword ptr [r8 + 8]
00000001808bb03e: test     rcx, rcx
00000001808bb041: jne      0x1808bb05d
00000001808bb043: lea      rcx, [rdi + 0x10]
00000001808bb047: mov      qword ptr [rdi + 0x10], rbx
00000001808bb04b: mov      rdx, rbx
00000001808bb04e: mov      rbx, qword ptr [rsp + 0x30]
00000001808bb053: add      rsp, 0x20
00000001808bb057: pop      rdi
00000001808bb058: jmp      0x18048b9e0
00000001808bb05d: xor      r9d, r9d
00000001808bb060: mov      r8, rbx
00000001808bb063: mov      rdx, rdi
00000001808bb066: mov      rbx, qword ptr [rsp + 0x30]
00000001808bb06b: add      rsp, 0x20
00000001808bb06f: pop      rdi
00000001808bb070: jmp      0x1832d2220 ; XLua.DelegateBridge.__Gen_Delegate_Imp23 [2678]
00000001808bb075: int3     
00000001808bb076: int3     
00000001808bb077: int3     
00000001808bb078: int3     
00000001808bb079: int3     
00000001808bb07a: int3     
00000001808bb07b: int3     
00000001808bb07c: int3     
00000001808bb07d: int3     
00000001808bb07e: int3     
00000001808bb07f: int3     