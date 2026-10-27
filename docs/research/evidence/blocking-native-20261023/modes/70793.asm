; Torappu.Battle.Tile.TileDynamicPositionController.BindDynamicPositionDeltaProvider metadata=70793 token=0x601148a VA=0x1808ba560 RVA=0x8ba560 size=0xa0
00000001808ba560: mov      qword ptr [rsp + 8], rbx
00000001808ba565: push     rdi
00000001808ba566: sub      rsp, 0x20
00000001808ba56a: cmp      byte ptr [rip + 0x83d7108], 0
00000001808ba571: mov      rbx, rdx
00000001808ba574: mov      rdi, rcx
00000001808ba577: jne      0x1808ba598
00000001808ba579: lea      rcx, [rip + 0x7fc81a0] ; GenericMethodInfo 279447 @0x188882720
00000001808ba580: call     0x18048bf00
00000001808ba585: lea      rcx, [rip + 0x807552c] ; TypeInfo Torappu.Battle.Tile.TileDynamicPositionController @0x18892fab8
00000001808ba58c: call     0x18048bf00
00000001808ba591: mov      byte ptr [rip + 0x83d70e1], 1
00000001808ba598: mov      rax, qword ptr [rip + 0x8075519] ; TypeInfo Torappu.Battle.Tile.TileDynamicPositionController @0x18892fab8
00000001808ba59f: mov      r8, qword ptr [rax + 0xb8]
00000001808ba5a6: mov      rcx, qword ptr [r8 + 0x28]
00000001808ba5aa: test     rcx, rcx
00000001808ba5ad: jne      0x1808ba5d6
00000001808ba5af: test     rbx, rbx
00000001808ba5b2: je       0x1808ba5e4
00000001808ba5b4: mov      rcx, qword ptr [rdi + 0x50]
00000001808ba5b8: test     rcx, rcx
00000001808ba5bb: je       0x1808ba5ef
00000001808ba5bd: mov      r8, qword ptr [rip + 0x7fc815c] ; GenericMethodInfo 279447 @0x188882720
00000001808ba5c4: mov      rdx, rbx
00000001808ba5c7: mov      rbx, qword ptr [rsp + 0x30]
00000001808ba5cc: add      rsp, 0x20
00000001808ba5d0: pop      rdi
00000001808ba5d1: jmp      0x1805072d0
00000001808ba5d6: xor      r9d, r9d
00000001808ba5d9: mov      r8, rbx
00000001808ba5dc: mov      rdx, rdi
00000001808ba5df: call     0x1832d2220 ; XLua.DelegateBridge.__Gen_Delegate_Imp23 [2678]
00000001808ba5e4: mov      rbx, qword ptr [rsp + 0x30]
00000001808ba5e9: add      rsp, 0x20
00000001808ba5ed: pop      rdi
00000001808ba5ee: ret      
00000001808ba5ef: call     0x18048c0b0
00000001808ba5f4: int3     
00000001808ba5f5: int3     
00000001808ba5f6: int3     
00000001808ba5f7: int3     
00000001808ba5f8: int3     
00000001808ba5f9: int3     
00000001808ba5fa: int3     
00000001808ba5fb: int3     
00000001808ba5fc: int3     
00000001808ba5fd: int3     
00000001808ba5fe: int3     
00000001808ba5ff: int3     