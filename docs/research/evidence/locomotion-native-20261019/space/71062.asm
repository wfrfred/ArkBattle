; Torappu.Battle.MoveController.GetBodyEdgeOffset metadata=71062 token=0x6011597 VA=0x1808b66e0 RVA=0x8b66e0 size=0xe0
00000001808b66e0: push     rbx
00000001808b66e2: sub      rsp, 0x40
00000001808b66e6: cmp      byte ptr [rip + 0x83db051], 0
00000001808b66ed: mov      rbx, rcx
00000001808b66f0: movaps   xmmword ptr [rsp + 0x30], xmm6
00000001808b66f5: movq     xmm6, rdx
00000001808b66fa: movsd    qword ptr [rsp + 0x20], xmm6
00000001808b6700: jne      0x1808b6721
00000001808b6702: lea      rcx, [rip + 0x800d52f] ; TypeInfo Torappu.MathUtil @0x1888c3c38
00000001808b6709: call     0x18048bf00
00000001808b670e: lea      rcx, [rip + 0x8047393] ; TypeInfo Torappu.Battle.MoveController @0x1888fdaa8
00000001808b6715: call     0x18048bf00
00000001808b671a: mov      byte ptr [rip + 0x83db01d], 1
00000001808b6721: mov      rax, qword ptr [rip + 0x8047380] ; TypeInfo Torappu.Battle.MoveController @0x1888fdaa8
00000001808b6728: mov      rcx, qword ptr [rax + 0xb8]
00000001808b672f: mov      rcx, qword ptr [rcx + 0x78]
00000001808b6733: test     rcx, rcx
00000001808b6736: jne      0x1808b67a4
00000001808b6738: mov      qword ptr [rsp + 0x50], rdi
00000001808b673d: mov      rcx, qword ptr [rip + 0x800d4f4] ; TypeInfo Torappu.MathUtil @0x1888c3c38
00000001808b6744: movss    xmm6, dword ptr [rbx + 0x20]
00000001808b6749: cmp      dword ptr [rcx + 0xe0], 0
00000001808b6750: jne      0x1808b6757
00000001808b6752: call     0x18048c140
00000001808b6757: movss    xmm0, dword ptr [rsp + 0x20]
00000001808b675d: xor      edx, edx
00000001808b675f: call     0x1866e6e10 ; Torappu.MathUtil.ToIntSign [220356]
00000001808b6764: movss    xmm0, dword ptr [rsp + 0x24]
00000001808b676a: xor      edx, edx
00000001808b676c: mov      edi, eax
00000001808b676e: call     0x1866e6e10 ; Torappu.MathUtil.ToIntSign [220356]
00000001808b6773: test     eax, eax
00000001808b6775: js       0x1808b677c
00000001808b6777: xorps    xmm1, xmm1
00000001808b677a: jmp      0x1808b6781
00000001808b677c: movss    xmm1, dword ptr [rbx + 0x34]
00000001808b6781: movd     xmm0, edi
00000001808b6785: mov      rdi, qword ptr [rsp + 0x50]
00000001808b678a: cvtdq2ps xmm0, xmm0
00000001808b678d: mulss    xmm0, xmm6
00000001808b6791: unpcklps xmm0, xmm1
00000001808b6794: movq     rax, xmm0
00000001808b6799: movaps   xmm6, xmmword ptr [rsp + 0x30]
00000001808b679e: add      rsp, 0x40
00000001808b67a2: pop      rbx
00000001808b67a3: ret      
00000001808b67a4: xor      r9d, r9d
00000001808b67a7: movq     r8, xmm6
00000001808b67ac: mov      rdx, rbx
00000001808b67af: movaps   xmm6, xmmword ptr [rsp + 0x30]
00000001808b67b4: add      rsp, 0x40
00000001808b67b8: pop      rbx
00000001808b67b9: jmp      0x183329910 ; XLua.DelegateBridge.__Gen_Delegate_Imp2960 [5615]
00000001808b67be: int3     
00000001808b67bf: int3     
