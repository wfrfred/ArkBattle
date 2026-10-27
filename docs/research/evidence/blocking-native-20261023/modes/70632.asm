; Torappu.Battle.Tile.get_charBlockMotionMode metadata=70632 token=0x60113e9 VA=0x1808c5190 RVA=0x8c5190 size=0xb0
00000001808c5190: push     rbx
00000001808c5192: sub      rsp, 0x20
00000001808c5196: cmp      byte ptr [rip + 0x83cc43b], 0
00000001808c519d: mov      rbx, rcx
00000001808c51a0: jne      0x1808c51b5
00000001808c51a2: lea      rcx, [rip + 0x8003927] ; TypeInfo Torappu.Battle.Tile @0x1888c8ad0
00000001808c51a9: call     0x18048bf00
00000001808c51ae: mov      byte ptr [rip + 0x83cc423], 1
00000001808c51b5: mov      rax, qword ptr [rip + 0x8003914] ; TypeInfo Torappu.Battle.Tile @0x1888c8ad0
00000001808c51bc: mov      rdx, qword ptr [rax + 0xb8]
00000001808c51c3: mov      rcx, qword ptr [rdx + 0x18]
00000001808c51c7: test     rcx, rcx
00000001808c51ca: jne      0x1808c522e
00000001808c51cc: cmp      qword ptr [rbx + 0xb8], rcx
00000001808c51d3: jne      0x1808c51dd
00000001808c51d5: xor      eax, eax
00000001808c51d7: add      rsp, 0x20
00000001808c51db: pop      rbx
00000001808c51dc: ret      
00000001808c51dd: cmp      byte ptr [rip + 0x83cc493], 0
00000001808c51e4: mov      rbx, qword ptr [rbx + 0xb8]
00000001808c51eb: jne      0x1808c5200
00000001808c51ed: lea      rcx, [rip + 0x806a8c4] ; TypeInfo Torappu.Battle.Tile.TileDynamicPositionController @0x18892fab8
00000001808c51f4: call     0x18048bf00
00000001808c51f9: mov      byte ptr [rip + 0x83cc477], 1
00000001808c5200: mov      rax, qword ptr [rip + 0x806a8b1] ; TypeInfo Torappu.Battle.Tile.TileDynamicPositionController @0x18892fab8
00000001808c5207: mov      rcx, qword ptr [rax + 0xb8]
00000001808c520e: mov      rcx, qword ptr [rcx + 0x18]
00000001808c5212: test     rcx, rcx
00000001808c5215: jne      0x1808c522e
00000001808c5217: movss    xmm0, dword ptr [rbx + 0x38]
00000001808c521c: xor      eax, eax
00000001808c521e: comiss   xmm0, dword ptr [rip + 0x657acef]
00000001808c5225: seta     al
00000001808c5228: add      rsp, 0x20
00000001808c522c: pop      rbx
00000001808c522d: ret      
00000001808c522e: xor      r8d, r8d
00000001808c5231: mov      rdx, rbx
00000001808c5234: add      rsp, 0x20
00000001808c5238: pop      rbx
00000001808c5239: jmp      0x183333df0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3027 [5682]
00000001808c523e: int3     
00000001808c523f: int3     