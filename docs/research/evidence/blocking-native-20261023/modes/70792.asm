; Torappu.Battle.Tile.TileDynamicPositionController.Init metadata=70792 token=0x6011489 VA=0x1808ba600 RVA=0x8ba600 size=0x100
00000001808ba600: mov      qword ptr [rsp + 8], rbx
00000001808ba605: push     rdi
00000001808ba606: sub      rsp, 0x20
00000001808ba60a: cmp      byte ptr [rip + 0x83d7067], 0
00000001808ba611: mov      rbx, rdx
00000001808ba614: mov      rdi, rcx
00000001808ba617: jne      0x1808ba638
00000001808ba619: lea      rcx, [rip + 0x8025b28] ; GenericMethodInfo 282061 @0x1888e0148
00000001808ba620: call     0x18048bf00
00000001808ba625: lea      rcx, [rip + 0x807548c] ; TypeInfo Torappu.Battle.Tile.TileDynamicPositionController @0x18892fab8
00000001808ba62c: call     0x18048bf00
00000001808ba631: mov      byte ptr [rip + 0x83d7040], 1
00000001808ba638: mov      rdx, qword ptr [rip + 0x8075479] ; TypeInfo Torappu.Battle.Tile.TileDynamicPositionController @0x18892fab8
00000001808ba63f: mov      rax, qword ptr [rdx + 0xb8]
00000001808ba646: mov      rcx, qword ptr [rax + 0x20]
00000001808ba64a: test     rcx, rcx
00000001808ba64d: jne      0x1808ba6dd
00000001808ba653: cmp      byte ptr [rip + 0x83d701c], cl
00000001808ba659: jne      0x1808ba675
00000001808ba65b: lea      rcx, [rip + 0x8075456] ; TypeInfo Torappu.Battle.Tile.TileDynamicPositionController @0x18892fab8
00000001808ba662: call     0x18048bf00
00000001808ba667: mov      rdx, qword ptr [rip + 0x807544a] ; TypeInfo Torappu.Battle.Tile.TileDynamicPositionController @0x18892fab8
00000001808ba66e: mov      byte ptr [rip + 0x83d7000], 1
00000001808ba675: mov      rax, qword ptr [rdx + 0xb8]
00000001808ba67c: mov      rcx, qword ptr [rax + 8]
00000001808ba680: test     rcx, rcx
00000001808ba683: jne      0x1808ba697
00000001808ba685: lea      rcx, [rdi + 0x10]
00000001808ba689: mov      qword ptr [rdi + 0x10], rbx
00000001808ba68d: mov      rdx, rbx
00000001808ba690: call     0x18048b9e0
00000001808ba695: jmp      0x1808ba6a5
00000001808ba697: xor      r9d, r9d
00000001808ba69a: mov      r8, rbx
00000001808ba69d: mov      rdx, rdi
00000001808ba6a0: call     0x1832d2220 ; XLua.DelegateBridge.__Gen_Delegate_Imp23 [2678]
00000001808ba6a5: mov      rcx, qword ptr [rip + 0x8025a9c] ; GenericMethodInfo 282061 @0x1888e0148
00000001808ba6ac: call     0x185337c50
00000001808ba6b1: test     rax, rax
00000001808ba6b4: je       0x1808ba6f5
00000001808ba6b6: xor      r8d, r8d
00000001808ba6b9: mov      rdx, rdi
00000001808ba6bc: mov      rcx, rax
00000001808ba6bf: call     0x180879ec0 ; Torappu.Battle.Map.AddTileUpdateable [70035]
00000001808ba6c4: test     rbx, rbx
00000001808ba6c7: je       0x1808ba6f5
00000001808ba6c9: xor      edx, edx
00000001808ba6cb: mov      rcx, rbx
00000001808ba6ce: mov      rbx, qword ptr [rsp + 0x30]
00000001808ba6d3: add      rsp, 0x20
00000001808ba6d7: pop      rdi
00000001808ba6d8: jmp      0x1808c3fc0 ; Torappu.Battle.Tile._InitDefaultTransformStatus [70733]
00000001808ba6dd: xor      r9d, r9d
00000001808ba6e0: mov      r8, rbx
00000001808ba6e3: mov      rdx, rdi
00000001808ba6e6: mov      rbx, qword ptr [rsp + 0x30]
00000001808ba6eb: add      rsp, 0x20
00000001808ba6ef: pop      rdi
00000001808ba6f0: jmp      0x1832d2220 ; XLua.DelegateBridge.__Gen_Delegate_Imp23 [2678]
00000001808ba6f5: call     0x18048c0b0
00000001808ba6fa: int3     
00000001808ba6fb: int3     
00000001808ba6fc: int3     
00000001808ba6fd: int3     
00000001808ba6fe: int3     
00000001808ba6ff: int3     