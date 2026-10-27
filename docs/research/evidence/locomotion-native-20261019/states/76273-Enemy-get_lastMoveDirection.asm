; Torappu.Battle.Enemy.get_lastMoveDirection metadata=76273 token=0x60129f2 VA=0x180a7e6e0 RVA=0xa7e6e0 size=0xd0
0000000180a7e6e0: push     rbx
0000000180a7e6e2: sub      rsp, 0x40
0000000180a7e6e6: cmp      byte ptr [rip + 0x82140ed], 0
0000000180a7e6ed: mov      rbx, rcx
0000000180a7e6f0: jne      0x180a7e711
0000000180a7e6f2: lea      rcx, [rip + 0x7d9cfb7] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7e6f9: call     0x18048bf00
0000000180a7e6fe: lea      rcx, [rip + 0x7e404c3] ; TypeInfo Torappu.Battle.MapUtil @0x1888bebc8
0000000180a7e705: call     0x18048bf00
0000000180a7e70a: mov      byte ptr [rip + 0x82140c9], 1
0000000180a7e711: mov      rax, qword ptr [rip + 0x7d9cf98] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7e718: cmp      dword ptr [rax + 0xe0], 0
0000000180a7e71f: jne      0x180a7e730
0000000180a7e721: mov      rcx, rax
0000000180a7e724: call     0x18048c140
0000000180a7e729: mov      rax, qword ptr [rip + 0x7d9cf80] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7e730: mov      rax, qword ptr [rax + 0xb8]
0000000180a7e737: mov      rcx, qword ptr [rax + 0x10]
0000000180a7e73b: test     rcx, rcx
0000000180a7e73e: jne      0x180a7e791
0000000180a7e740: movaps   xmmword ptr [rsp + 0x30], xmm6
0000000180a7e745: movaps   xmmword ptr [rsp + 0x20], xmm7
0000000180a7e74a: mov      rcx, qword ptr [rip + 0x7e40477] ; TypeInfo Torappu.Battle.MapUtil @0x1888bebc8
0000000180a7e751: movss    xmm6, dword ptr [rbx + 0x2c0]
0000000180a7e759: movss    xmm7, dword ptr [rbx + 0x2c4]
0000000180a7e761: cmp      dword ptr [rcx + 0xe0], 0
0000000180a7e768: jne      0x180a7e76f
0000000180a7e76a: call     0x18048c140
0000000180a7e76f: unpcklps xmm6, xmm7
0000000180a7e772: xor      r8d, r8d
0000000180a7e775: movq     rcx, xmm6
0000000180a7e77a: xorps    xmm1, xmm1
0000000180a7e77d: movaps   xmm7, xmmword ptr [rsp + 0x20]
0000000180a7e782: movaps   xmm6, xmmword ptr [rsp + 0x30]
0000000180a7e787: add      rsp, 0x40
0000000180a7e78b: pop      rbx
0000000180a7e78c: jmp      0x180b01280 ; Torappu.Battle.MapUtil.ParseDirection [78308]
0000000180a7e791: xor      r8d, r8d
0000000180a7e794: mov      rdx, rbx
0000000180a7e797: add      rsp, 0x40
0000000180a7e79b: pop      rbx
0000000180a7e79c: jmp      0x18323f040 ; XLua.DelegateBridge.__Gen_Delegate_Imp1433 [4088]
0000000180a7e7a1: int3     
0000000180a7e7a2: int3     
0000000180a7e7a3: int3     
0000000180a7e7a4: int3     
0000000180a7e7a5: int3     
0000000180a7e7a6: int3     
0000000180a7e7a7: int3     
0000000180a7e7a8: int3     
0000000180a7e7a9: int3     
0000000180a7e7aa: int3     
0000000180a7e7ab: int3     
0000000180a7e7ac: int3     
0000000180a7e7ad: int3     
0000000180a7e7ae: int3     
0000000180a7e7af: int3     
