; Torappu.Battle.MoveController.CalculateTotalForce metadata=71057 token=0x6011592 VA=0x1808b6530 RVA=0x8b6530 size=0x1b0
00000001808b6530: mov      qword ptr [rsp + 8], rbx
00000001808b6535: push     rdi
00000001808b6536: sub      rsp, 0x60
00000001808b653a: cmp      byte ptr [rip + 0x83db1f8], 0
00000001808b6541: mov      rdi, r8
00000001808b6544: movaps   xmmword ptr [rsp + 0x50], xmm6
00000001808b6549: mov      rbx, rcx
00000001808b654c: movq     xmm6, rdx
00000001808b6551: movsd    qword ptr [rsp + 0x38], xmm6
00000001808b6557: jne      0x1808b6578
00000001808b6559: lea      rcx, [rip + 0x800d6d8] ; TypeInfo Torappu.MathUtil @0x1888c3c38
00000001808b6560: call     0x18048bf00
00000001808b6565: lea      rcx, [rip + 0x804753c] ; TypeInfo Torappu.Battle.MoveController @0x1888fdaa8
00000001808b656c: call     0x18048bf00
00000001808b6571: mov      byte ptr [rip + 0x83db1c1], 1
00000001808b6578: mov      rax, qword ptr [rip + 0x8047529] ; TypeInfo Torappu.Battle.MoveController @0x1888fdaa8
00000001808b657f: mov      rcx, qword ptr [rax + 0xb8]
00000001808b6586: mov      rcx, qword ptr [rcx + 0x50]
00000001808b658a: test     rcx, rcx
00000001808b658d: jne      0x1808b66b3
00000001808b6593: movaps   xmmword ptr [rsp + 0x40], xmm7
00000001808b6598: xor      edx, edx
00000001808b659a: lea      rcx, [rsp + 0x38]
00000001808b659f: call     0x1805353f0
00000001808b65a4: cmp      byte ptr [rip + 0x83d900a], 0
00000001808b65ab: jne      0x1808b65c0
00000001808b65ad: lea      rcx, [rip + 0x7f7260c] ; TypeInfo UnityEngine.Vector2 @0x188828bc0
00000001808b65b4: call     0x18048bf00
00000001808b65b9: mov      byte ptr [rip + 0x83d8ff5], 1
00000001808b65c0: mov      rax, qword ptr [rip + 0x7f725f9] ; TypeInfo UnityEngine.Vector2 @0x188828bc0
00000001808b65c7: mov      rcx, qword ptr [rax + 0xb8]
00000001808b65ce: movss    xmm1, dword ptr [rcx + 4]
00000001808b65d3: cmp      byte ptr [rip + 0x8416216], 0
00000001808b65da: movss    xmm0, dword ptr [rcx]
00000001808b65de: unpcklps xmm0, xmm1
00000001808b65e1: movsd    qword ptr [rsp + 0x30], xmm0
00000001808b65e7: jbe      0x1808b65f1
00000001808b65e9: mov      rcx, qword ptr [rbx]
00000001808b65ec: call     0x180446d00
00000001808b65f1: mov      r9, qword ptr [rbx]
00000001808b65f4: lea      r8, [rsp + 0x30]
00000001808b65f9: movsd    xmm6, qword ptr [rsp + 0x38]
00000001808b65ff: mov      rcx, rbx
00000001808b6602: movq     rdx, xmm6
00000001808b6607: mov      rax, qword ptr [r9 + 0x1c0]
00000001808b660e: mov      r9, qword ptr [r9 + 0x1c8]
00000001808b6615: call     rax
00000001808b6617: mov      rcx, qword ptr [rip + 0x800d61a] ; TypeInfo Torappu.MathUtil @0x1888c3c38
00000001808b661e: cmp      dword ptr [rcx + 0xe0], 0
00000001808b6625: jne      0x1808b662c
00000001808b6627: call     0x18048c140
00000001808b662c: xor      edx, edx
00000001808b662e: movq     rcx, xmm6
00000001808b6633: call     0x1866e5620
00000001808b6638: test     al, al
00000001808b663a: jne      0x1808b663e
00000001808b663c: jmp      0x1808b6665
00000001808b663e: mov      rcx, qword ptr [rip + 0x800d5f3] ; TypeInfo Torappu.MathUtil @0x1888c3c38
00000001808b6645: movsd    xmm7, qword ptr [rsp + 0x30]
00000001808b664b: cmp      dword ptr [rcx + 0xe0], 0
00000001808b6652: jne      0x1808b6659
00000001808b6654: call     0x18048c140
00000001808b6659: xor      edx, edx
00000001808b665b: movq     rcx, xmm7
00000001808b6660: call     0x1866e5620
00000001808b6665: movsd    xmm7, qword ptr [rsp + 0x30]
00000001808b666b: mov      byte ptr [rdi], al
00000001808b666d: cmp      byte ptr [rip + 0x841617c], 0
00000001808b6674: jbe      0x1808b667e
00000001808b6676: mov      rcx, qword ptr [rbx]
00000001808b6679: call     0x180446d00
00000001808b667e: mov      r9, qword ptr [rbx]
00000001808b6681: movq     r8, xmm6
00000001808b6686: movq     rdx, xmm7
00000001808b668b: mov      rcx, rbx
00000001808b668e: mov      rax, qword ptr [r9 + 0x1b0]
00000001808b6695: mov      r9, qword ptr [r9 + 0x1b8]
00000001808b669c: call     rax
00000001808b669e: movaps   xmm7, xmmword ptr [rsp + 0x40]
00000001808b66a3: mov      rbx, qword ptr [rsp + 0x70]
00000001808b66a8: movaps   xmm6, xmmword ptr [rsp + 0x50]
00000001808b66ad: add      rsp, 0x60
00000001808b66b1: pop      rdi
00000001808b66b2: ret      
00000001808b66b3: mov      r9, rdi
00000001808b66b6: mov      qword ptr [rsp + 0x20], 0
00000001808b66bf: movq     r8, xmm6
00000001808b66c4: mov      rdx, rbx
00000001808b66c7: call     0x1832fae40 ; XLua.DelegateBridge.__Gen_Delegate_Imp2664 [5319]
00000001808b66cc: mov      rbx, qword ptr [rsp + 0x70]
00000001808b66d1: movaps   xmm6, xmmword ptr [rsp + 0x50]
00000001808b66d6: add      rsp, 0x60
00000001808b66da: pop      rdi
00000001808b66db: ret      
00000001808b66dc: int3     
00000001808b66dd: int3     
00000001808b66de: int3     
00000001808b66df: int3     
