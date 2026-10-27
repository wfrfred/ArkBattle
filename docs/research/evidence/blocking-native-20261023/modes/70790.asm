; Torappu.Battle.Tile.TileDynamicPositionController.get_dynamicPositionDelta metadata=70790 token=0x6011487 VA=0x1808baf20 RVA=0x8baf20 size=0x80
00000001808baf20: mov      qword ptr [rsp + 8], rbx
00000001808baf25: push     rdi
00000001808baf26: sub      rsp, 0x30
00000001808baf2a: cmp      byte ptr [rip + 0x83d6745], 0
00000001808baf31: mov      rdi, rdx
00000001808baf34: mov      rbx, rcx
00000001808baf37: jne      0x1808baf4c
00000001808baf39: lea      rcx, [rip + 0x8074b78] ; TypeInfo Torappu.Battle.Tile.TileDynamicPositionController @0x18892fab8
00000001808baf40: call     0x18048bf00
00000001808baf45: mov      byte ptr [rip + 0x83d672a], 1
00000001808baf4c: mov      rax, qword ptr [rip + 0x8074b65] ; TypeInfo Torappu.Battle.Tile.TileDynamicPositionController @0x18892fab8
00000001808baf53: mov      r8, qword ptr [rax + 0xb8]
00000001808baf5a: mov      rdx, qword ptr [r8 + 0x10]
00000001808baf5e: test     rdx, rdx
00000001808baf61: jne      0x1808baf6d
00000001808baf63: movsd    xmm0, qword ptr [rdi + 0x30]
00000001808baf68: mov      eax, dword ptr [rdi + 0x38]
00000001808baf6b: jmp      0x1808baf84
00000001808baf6d: xor      r9d, r9d
00000001808baf70: lea      rcx, [rsp + 0x20]
00000001808baf75: mov      r8, rdi
00000001808baf78: call     0x18326a400 ; XLua.DelegateBridge.__Gen_Delegate_Imp171 [2826]
00000001808baf7d: movsd    xmm0, qword ptr [rax]
00000001808baf81: mov      eax, dword ptr [rax + 8]
00000001808baf84: movsd    qword ptr [rbx], xmm0
00000001808baf88: mov      dword ptr [rbx + 8], eax
00000001808baf8b: mov      rax, rbx
00000001808baf8e: mov      rbx, qword ptr [rsp + 0x40]
00000001808baf93: add      rsp, 0x30
00000001808baf97: pop      rdi
00000001808baf98: ret      
00000001808baf99: int3     
00000001808baf9a: int3     
00000001808baf9b: int3     
00000001808baf9c: int3     
00000001808baf9d: int3     
00000001808baf9e: int3     
00000001808baf9f: int3     