; Torappu.Battle.BasicMovement.CheckReached metadata=71221 token=0x6011636 VA=0x1808ca5f0 RVA=0x8ca5f0 size=0x130
00000001808ca5f0: push     rbx
00000001808ca5f2: sub      rsp, 0x20
00000001808ca5f6: cmp      byte ptr [rip + 0x83c71ae], 0
00000001808ca5fd: mov      rbx, rcx
00000001808ca600: jne      0x1808ca615
00000001808ca602: lea      rcx, [rip + 0x805aa57] ; TypeInfo Torappu.Battle.BasicMovement @0x188925060
00000001808ca609: call     0x18048bf00
00000001808ca60e: mov      byte ptr [rip + 0x83c7196], 1
00000001808ca615: mov      rax, qword ptr [rip + 0x805aa44] ; TypeInfo Torappu.Battle.BasicMovement @0x188925060
00000001808ca61c: mov      rdx, qword ptr [rax + 0xb8]
00000001808ca623: mov      rcx, qword ptr [rdx + 0xc0]
00000001808ca62a: test     rcx, rcx
00000001808ca62d: jne      0x1808ca70a
00000001808ca633: cmp      byte ptr [rbx + 0x6c], cl
00000001808ca636: jne      0x1808ca702
00000001808ca63c: cmp      byte ptr [rip + 0x83c71fd], cl
00000001808ca642: jne      0x1808ca657
00000001808ca644: lea      rcx, [rip + 0x803e24d] ; TypeInfo Torappu.Battle.Projectile.Behaviour @0x188908898
00000001808ca64b: call     0x18048bf00
00000001808ca650: mov      byte ptr [rip + 0x83c71e8], 1
00000001808ca657: mov      rdx, qword ptr [rip + 0x803e23a] ; TypeInfo Torappu.Battle.Projectile.Behaviour @0x188908898
00000001808ca65e: mov      rax, qword ptr [rdx + 0xb8]
00000001808ca665: mov      rcx, qword ptr [rax + 0x38]
00000001808ca669: test     rcx, rcx
00000001808ca66c: jne      0x1808ca6be
00000001808ca66e: cmp      byte ptr [rip + 0x83c71c4], cl
00000001808ca674: jne      0x1808ca690
00000001808ca676: lea      rcx, [rip + 0x803e21b] ; TypeInfo Torappu.Battle.Projectile.Behaviour @0x188908898
00000001808ca67d: call     0x18048bf00
00000001808ca682: mov      rdx, qword ptr [rip + 0x803e20f] ; TypeInfo Torappu.Battle.Projectile.Behaviour @0x188908898
00000001808ca689: mov      byte ptr [rip + 0x83c71a8], 1
00000001808ca690: mov      rax, qword ptr [rdx + 0xb8]
00000001808ca697: mov      rcx, qword ptr [rax]
00000001808ca69a: test     rcx, rcx
00000001808ca69d: jne      0x1808ca6a5
00000001808ca69f: mov      rax, qword ptr [rbx + 0x18]
00000001808ca6a3: jmp      0x1808ca6b0
00000001808ca6a5: xor      r8d, r8d
00000001808ca6a8: mov      rdx, rbx
00000001808ca6ab: call     0x1833234a0 ; XLua.DelegateBridge.__Gen_Delegate_Imp2916 [5571]
00000001808ca6b0: test     rax, rax
00000001808ca6b3: je       0x1808ca71a
00000001808ca6b5: movzx    eax, byte ptr [rax + 0x150]
00000001808ca6bc: jmp      0x1808ca6c9
00000001808ca6be: xor      r8d, r8d
00000001808ca6c1: mov      rdx, rbx
00000001808ca6c4: call     0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
00000001808ca6c9: test     al, al
00000001808ca6cb: je       0x1808ca6fa
00000001808ca6cd: cmp      byte ptr [rip + 0x840211c], 0
00000001808ca6d4: jbe      0x1808ca6de
00000001808ca6d6: mov      rcx, qword ptr [rbx]
00000001808ca6d9: call     0x180446d00
00000001808ca6de: mov      rdx, qword ptr [rbx]
00000001808ca6e1: mov      rcx, rbx
00000001808ca6e4: mov      rax, qword ptr [rdx + 0x2b0]
00000001808ca6eb: mov      rdx, qword ptr [rdx + 0x2b8]
00000001808ca6f2: add      rsp, 0x20
00000001808ca6f6: pop      rbx
00000001808ca6f7: jmp      rax
00000001808ca6fa: xor      al, al
00000001808ca6fc: add      rsp, 0x20
00000001808ca700: pop      rbx
00000001808ca701: ret      
00000001808ca702: mov      al, 1
00000001808ca704: add      rsp, 0x20
00000001808ca708: pop      rbx
00000001808ca709: ret      
00000001808ca70a: xor      r8d, r8d
00000001808ca70d: mov      rdx, rbx
00000001808ca710: add      rsp, 0x20
00000001808ca714: pop      rbx
00000001808ca715: jmp      0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
00000001808ca71a: call     0x18048c0b0
00000001808ca71f: int3     