; Torappu.Battle.MoveController.get_velocity metadata=71048 token=0x6011589 VA=0x1808b8910 RVA=0x8b8910 size=0x70
00000001808b8910: push     rbx
00000001808b8912: sub      rsp, 0x20
00000001808b8916: cmp      byte ptr [rip + 0x83d8e13], 0
00000001808b891d: mov      rbx, rcx
00000001808b8920: jne      0x1808b8935
00000001808b8922: lea      rcx, [rip + 0x804517f] ; TypeInfo Torappu.Battle.MoveController @0x1888fdaa8
00000001808b8929: call     0x18048bf00
00000001808b892e: mov      byte ptr [rip + 0x83d8dfb], 1
00000001808b8935: mov      rax, qword ptr [rip + 0x804516c] ; TypeInfo Torappu.Battle.MoveController @0x1888fdaa8
00000001808b893c: mov      rdx, qword ptr [rax + 0xb8]
00000001808b8943: mov      rcx, qword ptr [rdx + 8]
00000001808b8947: test     rcx, rcx
00000001808b894a: jne      0x1808b8964
00000001808b894c: movss    xmm0, dword ptr [rbx + 0x3c]
00000001808b8951: movss    xmm1, dword ptr [rbx + 0x38]
00000001808b8956: unpcklps xmm1, xmm0
00000001808b8959: movq     rax, xmm1
00000001808b895e: add      rsp, 0x20
00000001808b8962: pop      rbx
00000001808b8963: ret      
00000001808b8964: xor      r8d, r8d
00000001808b8967: mov      rdx, rbx
00000001808b896a: add      rsp, 0x20
00000001808b896e: pop      rbx
00000001808b896f: jmp      0x1835c4140 ; XLua.DelegateBridge.__Gen_Delegate_Imp72 [2727]
00000001808b8974: int3     
00000001808b8975: int3     
00000001808b8976: int3     
00000001808b8977: int3     
00000001808b8978: int3     
00000001808b8979: int3     
00000001808b897a: int3     
00000001808b897b: int3     
00000001808b897c: int3     
00000001808b897d: int3     
00000001808b897e: int3     
00000001808b897f: int3     
