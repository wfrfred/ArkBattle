; Torappu.Battle.MoveController.get_footOffset metadata=71052 token=0x601158d VA=0x1808b8680 RVA=0x8b8680 size=0x70
00000001808b8680: push     rbx
00000001808b8682: sub      rsp, 0x20
00000001808b8686: cmp      byte ptr [rip + 0x83d90a7], 0
00000001808b868d: mov      rbx, rcx
00000001808b8690: jne      0x1808b86a5
00000001808b8692: lea      rcx, [rip + 0x804540f] ; TypeInfo Torappu.Battle.MoveController @0x1888fdaa8
00000001808b8699: call     0x18048bf00
00000001808b869e: mov      byte ptr [rip + 0x83d908f], 1
00000001808b86a5: mov      rax, qword ptr [rip + 0x80453fc] ; TypeInfo Torappu.Battle.MoveController @0x1888fdaa8
00000001808b86ac: mov      rdx, qword ptr [rax + 0xb8]
00000001808b86b3: mov      rcx, qword ptr [rdx + 0x28]
00000001808b86b7: test     rcx, rcx
00000001808b86ba: jne      0x1808b86d4
00000001808b86bc: movss    xmm0, dword ptr [rbx + 0x34]
00000001808b86c1: movss    xmm1, dword ptr [rbx + 0x30]
00000001808b86c6: unpcklps xmm1, xmm0
00000001808b86c9: movq     rax, xmm1
00000001808b86ce: add      rsp, 0x20
00000001808b86d2: pop      rbx
00000001808b86d3: ret      
00000001808b86d4: xor      r8d, r8d
00000001808b86d7: mov      rdx, rbx
00000001808b86da: add      rsp, 0x20
00000001808b86de: pop      rbx
00000001808b86df: jmp      0x1835c4140 ; XLua.DelegateBridge.__Gen_Delegate_Imp72 [2727]
00000001808b86e4: int3     
00000001808b86e5: int3     
00000001808b86e6: int3     
00000001808b86e7: int3     
00000001808b86e8: int3     
00000001808b86e9: int3     
00000001808b86ea: int3     
00000001808b86eb: int3     
00000001808b86ec: int3     
00000001808b86ed: int3     
00000001808b86ee: int3     
00000001808b86ef: int3     
