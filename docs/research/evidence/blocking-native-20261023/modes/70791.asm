; Torappu.Battle.Tile.TileDynamicPositionController.get_charMotionMode metadata=70791 token=0x6011488 VA=0x1808baeb0 RVA=0x8baeb0 size=0x70
00000001808baeb0: push     rbx
00000001808baeb2: sub      rsp, 0x20
00000001808baeb6: cmp      byte ptr [rip + 0x83d67ba], 0
00000001808baebd: mov      rbx, rcx
00000001808baec0: jne      0x1808baed5
00000001808baec2: lea      rcx, [rip + 0x8074bef] ; TypeInfo Torappu.Battle.Tile.TileDynamicPositionController @0x18892fab8
00000001808baec9: call     0x18048bf00
00000001808baece: mov      byte ptr [rip + 0x83d67a2], 1
00000001808baed5: mov      rax, qword ptr [rip + 0x8074bdc] ; TypeInfo Torappu.Battle.Tile.TileDynamicPositionController @0x18892fab8
00000001808baedc: mov      rdx, qword ptr [rax + 0xb8]
00000001808baee3: mov      rcx, qword ptr [rdx + 0x18]
00000001808baee7: test     rcx, rcx
00000001808baeea: jne      0x1808baf03
00000001808baeec: movss    xmm0, dword ptr [rbx + 0x38]
00000001808baef1: xor      eax, eax
00000001808baef3: comiss   xmm0, dword ptr [rip + 0x658501a]
00000001808baefa: seta     al
00000001808baefd: add      rsp, 0x20
00000001808baf01: pop      rbx
00000001808baf02: ret      
00000001808baf03: xor      r8d, r8d
00000001808baf06: mov      rdx, rbx
00000001808baf09: add      rsp, 0x20
00000001808baf0d: pop      rbx
00000001808baf0e: jmp      0x183333df0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3027 [5682]
00000001808baf13: int3     
00000001808baf14: int3     
00000001808baf15: int3     
00000001808baf16: int3     
00000001808baf17: int3     
00000001808baf18: int3     
00000001808baf19: int3     
00000001808baf1a: int3     
00000001808baf1b: int3     
00000001808baf1c: int3     
00000001808baf1d: int3     
00000001808baf1e: int3     
00000001808baf1f: int3     