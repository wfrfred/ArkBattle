; Torappu.Battle.BasicCursor.MoveCheckpoint.OnBegin metadata=70197 token=0x6011236 VA=0x1808a0590 RVA=0x8a0590 size=0xa0
00000001808a0590: push     rbx
00000001808a0592: sub      rsp, 0x20
00000001808a0596: mov      rax, qword ptr [rcx + 0x10]
00000001808a059a: mov      rbx, rcx
00000001808a059d: test     rax, rax
00000001808a05a0: je       0x1808a062a
00000001808a05a6: cmp      byte ptr [rax + 0x28], 0
00000001808a05aa: je       0x1808a060b
00000001808a05ac: mov      rcx, qword ptr [rcx + 0x18]
00000001808a05b0: test     rcx, rcx
00000001808a05b3: je       0x1808a062a
00000001808a05b5: xor      edx, edx
00000001808a05b7: call     0x180877280 ; Torappu.Battle.BasicCursor.get_random [70154]
00000001808a05bc: mov      rcx, qword ptr [rbx + 0x10]
00000001808a05c0: test     rcx, rcx
00000001808a05c3: je       0x1808a062a
00000001808a05c5: movss    xmm1, dword ptr [rcx + 0x24]
00000001808a05ca: test     rax, rax
00000001808a05cd: je       0x1808a062a
00000001808a05cf: movss    xmm0, dword ptr [rcx + 0x20]
00000001808a05d4: xor      r8d, r8d
00000001808a05d7: unpcklps xmm0, xmm1
00000001808a05da: mov      rcx, rax
00000001808a05dd: movq     rdx, xmm0
00000001808a05e2: call     0x18088fc90
00000001808a05e7: mov      qword ptr [rsp + 0x30], rax
00000001808a05ec: movss    xmm2, dword ptr [rsp + 0x30]
00000001808a05f2: movss    dword ptr [rbx + 0x20], xmm2
00000001808a05f7: movq     xmm1, rax
00000001808a05fc: shufps   xmm1, xmm1, 0x55
00000001808a0600: movss    dword ptr [rbx + 0x24], xmm1
00000001808a0605: add      rsp, 0x20
00000001808a0609: pop      rbx
00000001808a060a: ret      
00000001808a060b: test     rax, rax
00000001808a060e: je       0x1808a062a
00000001808a0610: movss    xmm2, dword ptr [rax + 0x20]
00000001808a0615: movss    xmm1, dword ptr [rax + 0x24]
00000001808a061a: movss    dword ptr [rbx + 0x20], xmm2
00000001808a061f: movss    dword ptr [rbx + 0x24], xmm1
00000001808a0624: add      rsp, 0x20
00000001808a0628: pop      rbx
00000001808a0629: ret      
00000001808a062a: call     0x18048c0b0
00000001808a062f: int3     
