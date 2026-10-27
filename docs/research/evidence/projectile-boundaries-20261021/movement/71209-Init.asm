; Torappu.Battle.BasicMovement.Init metadata=71209 token=0x601162a VA=0x1808cb090 RVA=0x8cb090 size=0x1f0
00000001808cb090: mov      qword ptr [rsp + 0x10], rbp
00000001808cb095: mov      qword ptr [rsp + 0x18], rsi
00000001808cb09a: mov      qword ptr [rsp + 0x20], rdi
00000001808cb09f: push     r14
00000001808cb0a1: sub      rsp, 0x30
00000001808cb0a5: cmp      byte ptr [rip + 0x83c66f3], 0
00000001808cb0ac: mov      rsi, r9
00000001808cb0af: mov      rbp, r8
00000001808cb0b2: mov      r14, rdx
00000001808cb0b5: mov      rdi, rcx
00000001808cb0b8: jne      0x1808cb0d9
00000001808cb0ba: lea      rcx, [rip + 0x8059f9f] ; TypeInfo Torappu.Battle.BasicMovement @0x188925060
00000001808cb0c1: call     0x18048bf00
00000001808cb0c6: lea      rcx, [rip + 0x7f8f633] ; TypeInfo Torappu.FP @0x18885a700
00000001808cb0cd: call     0x18048bf00
00000001808cb0d2: mov      byte ptr [rip + 0x83c66c6], 1
00000001808cb0d9: mov      rax, qword ptr [rip + 0x8059f80] ; TypeInfo Torappu.Battle.BasicMovement @0x188925060
00000001808cb0e0: mov      rdx, qword ptr [rax + 0xb8]
00000001808cb0e7: mov      rcx, qword ptr [rdx + 0x60]
00000001808cb0eb: test     rcx, rcx
00000001808cb0ee: jne      0x1808cb243
00000001808cb0f4: mov      qword ptr [rsp + 0x40], rbx
00000001808cb0f9: mov      qword ptr [rsp + 0x20], rcx
00000001808cb0fe: mov      r9, rsi
00000001808cb101: mov      rcx, rdi
00000001808cb104: mov      r8, rbp
00000001808cb107: mov      rdx, r14
00000001808cb10a: call     0x1808ce540 ; Torappu.Battle.Projectile.Behaviour.Init [71411]
00000001808cb10f: mov      rbx, qword ptr [rip + 0x7f8f5ea] ; TypeInfo Torappu.FP @0x18885a700
00000001808cb116: cmp      dword ptr [rbx + 0xe0], 0
00000001808cb11d: jne      0x1808cb12e
00000001808cb11f: mov      rcx, rbx
00000001808cb122: call     0x18048c140
00000001808cb127: mov      rbx, qword ptr [rip + 0x7f8f5d2] ; TypeInfo Torappu.FP @0x18885a700
00000001808cb12e: cmp      byte ptr [rip + 0x83c665f], 0
00000001808cb135: mov      rbx, qword ptr [rbx + 0xb8]
00000001808cb13c: mov      rbx, qword ptr [rbx + 0x20]
00000001808cb140: jne      0x1808cb155
00000001808cb142: lea      rcx, [rip + 0x8059f17] ; TypeInfo Torappu.Battle.BasicMovement @0x188925060
00000001808cb149: call     0x18048bf00
00000001808cb14e: mov      byte ptr [rip + 0x83c663f], 1
00000001808cb155: mov      rax, qword ptr [rip + 0x8059f04] ; TypeInfo Torappu.Battle.BasicMovement @0x188925060
00000001808cb15c: mov      rcx, qword ptr [rax + 0xb8]
00000001808cb163: mov      rcx, qword ptr [rcx + 8]
00000001808cb167: test     rcx, rcx
00000001808cb16a: jne      0x1808cb175
00000001808cb16c: mov      qword ptr [rdi + 0x98], rbx
00000001808cb173: jmp      0x1808cb183
00000001808cb175: xor      r9d, r9d
00000001808cb178: mov      r8, rbx
00000001808cb17b: mov      rdx, rdi
00000001808cb17e: call     0x1833f9830 ; XLua.DelegateBridge.__Gen_Delegate_Imp427 [3082]
00000001808cb183: cmp      byte ptr [rip + 0x8401666], 0
00000001808cb18a: mov      rbx, qword ptr [rsp + 0x40]
00000001808cb18f: jbe      0x1808cb199
00000001808cb191: mov      rcx, qword ptr [rdi]
00000001808cb194: call     0x180446d00
00000001808cb199: mov      r9, qword ptr [rdi]
00000001808cb19c: mov      r8, rbp
00000001808cb19f: mov      rdx, r14
00000001808cb1a2: mov      rcx, rdi
00000001808cb1a5: mov      rax, qword ptr [r9 + 0x260]
00000001808cb1ac: mov      r9, qword ptr [r9 + 0x268]
00000001808cb1b3: call     rax
00000001808cb1b5: cmp      byte ptr [rip + 0x8401634], 0
00000001808cb1bc: jbe      0x1808cb1c6
00000001808cb1be: mov      rcx, qword ptr [rdi]
00000001808cb1c1: call     0x180446d00
00000001808cb1c6: mov      rdx, qword ptr [rdi]
00000001808cb1c9: mov      rcx, rdi
00000001808cb1cc: mov      rax, qword ptr [rdx + 0x290]
00000001808cb1d3: mov      rdx, qword ptr [rdx + 0x298]
00000001808cb1da: call     rax
00000001808cb1dc: test     rsi, rsi
00000001808cb1df: je       0x1808cb275
00000001808cb1e5: cmp      byte ptr [rip + 0x83c660e], 0
00000001808cb1ec: jne      0x1808cb201
00000001808cb1ee: lea      rcx, [rip + 0x7f58203] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808cb1f5: call     0x18048bf00
00000001808cb1fa: mov      byte ptr [rip + 0x83c65f9], 1
00000001808cb201: mov      rax, qword ptr [rip + 0x7f581f0] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808cb208: mov      rcx, qword ptr [rax + 0xb8]
00000001808cb20f: mov      rcx, qword ptr [rcx + 0x160]
00000001808cb216: test     rcx, rcx
00000001808cb219: jne      0x1808cb233
00000001808cb21b: lea      rcx, [rsi + 0xf0]
00000001808cb222: mov      qword ptr [rsi + 0xf0], rdi
00000001808cb229: mov      rdx, rdi
00000001808cb22c: call     0x18048b9e0
00000001808cb231: jmp      0x1808cb25f
00000001808cb233: xor      r9d, r9d
00000001808cb236: mov      r8, rdi
00000001808cb239: mov      rdx, rsi
00000001808cb23c: call     0x1832d2220 ; XLua.DelegateBridge.__Gen_Delegate_Imp23 [2678]
00000001808cb241: jmp      0x1808cb25f
00000001808cb243: mov      qword ptr [rsp + 0x28], 0
00000001808cb24c: mov      r9, rbp
00000001808cb24f: mov      r8, r14
00000001808cb252: mov      qword ptr [rsp + 0x20], rsi
00000001808cb257: mov      rdx, rdi
00000001808cb25a: call     0x1833bd180 ; XLua.DelegateBridge.__Gen_Delegate_Imp38 [2693]
00000001808cb25f: mov      rbp, qword ptr [rsp + 0x48]
00000001808cb264: mov      rsi, qword ptr [rsp + 0x50]
00000001808cb269: mov      rdi, qword ptr [rsp + 0x58]
00000001808cb26e: add      rsp, 0x30
00000001808cb272: pop      r14
00000001808cb274: ret      
00000001808cb275: call     0x18048c0b0
00000001808cb27a: int3     
00000001808cb27b: int3     
00000001808cb27c: int3     
00000001808cb27d: int3     
00000001808cb27e: int3     
00000001808cb27f: int3     