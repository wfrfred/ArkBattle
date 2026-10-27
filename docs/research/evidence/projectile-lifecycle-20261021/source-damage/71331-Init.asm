; Torappu.Battle.Projectile.Init metadata=71331 token=0x60116a4 VA=0x1808d7560 RVA=0x8d7560 size=0x880
00000001808d7560: mov      qword ptr [rsp + 0x20], rbx
00000001808d7565: push     rbp
00000001808d7566: push     rdi
00000001808d7567: push     r15
00000001808d7569: sub      rsp, 0x70
00000001808d756d: cmp      byte ptr [rip + 0x83ba282], 0
00000001808d7574: mov      r15, r9
00000001808d7577: mov      rbp, r8
00000001808d757a: mov      rbx, rdx
00000001808d757d: mov      rdi, rcx
00000001808d7580: jne      0x1808d7635
00000001808d7586: lea      rcx, [rip + 0x7f94cdb] ; TypeInfo Torappu.Battle.Character @0x18886c268
00000001808d758d: call     0x18048bf00
00000001808d7592: lea      rcx, [rip + 0x8003fa7] ; TypeInfo Torappu.HGString @0x1888db540
00000001808d7599: call     0x18048bf00
00000001808d759e: lea      rcx, [rip + 0x800e34b] ; GenericMethodInfo 268475 @0x1888e58f0
00000001808d75a5: call     0x18048bf00
00000001808d75aa: lea      rcx, [rip + 0x805dff7] ; GenericMethodInfo 280377 @0x1889355a8
00000001808d75b1: call     0x18048bf00
00000001808d75b6: lea      rcx, [rip + 0x8057aab] ; GenericMethodInfo 280332 @0x18892f068
00000001808d75bd: call     0x18048bf00
00000001808d75c2: lea      rcx, [rip + 0x8057cdf] ; GenericMethodInfo 280333 @0x18892f2a8
00000001808d75c9: call     0x18048bf00
00000001808d75ce: lea      rcx, [rip + 0x805e213] ; GenericMethodInfo 280378 @0x1889357e8
00000001808d75d5: call     0x18048bf00
00000001808d75da: lea      rcx, [rip + 0x80615c7] ; GenericMethodInfo 280401 @0x188938ba8
00000001808d75e1: call     0x18048bf00
00000001808d75e6: lea      rcx, [rip + 0x8095f33] ; GenericMethodInfo 298102 @0x18896d520
00000001808d75ed: call     0x18048bf00
00000001808d75f2: lea      rcx, [rip + 0x8096ca7] ; GenericMethodInfo 298108 @0x18896e2a0
00000001808d75f9: call     0x18048bf00
00000001808d75fe: lea      rcx, [rip + 0x805b6e3] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808d7605: call     0x18048bf00
00000001808d760a: lea      rcx, [rip + 0x7f4bde7] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808d7611: call     0x18048bf00
00000001808d7616: lea      rcx, [rip + 0x7fefceb] ; GenericMethodInfo 281884 @0x1888c7308
00000001808d761d: call     0x18048bf00
00000001808d7622: lea      rcx, [rip + 0x7fa1217] ; TypeInfo string @0x188878840
00000001808d7629: call     0x18048bf00
00000001808d762e: mov      byte ptr [rip + 0x83ba1c1], 1
00000001808d7635: mov      rax, qword ptr [rip + 0x7f4bdbc] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808d763c: mov      rcx, qword ptr [rax + 0xb8]
00000001808d7643: mov      rcx, qword ptr [rcx + 0x140]
00000001808d764a: test     rcx, rcx
00000001808d764d: jne      0x1808d7d70
00000001808d7653: mov      qword ptr [rsp + 0x98], r13
00000001808d765b: mov      qword ptr [rsp + 0xa0], r14
00000001808d7663: mov      qword ptr [rsp + 0x90], r12
00000001808d766b: xor      r8d, r8d
00000001808d766e: mov      rdx, rbx
00000001808d7671: mov      rcx, rdi
00000001808d7674: call     0x1808ddd00 ; Torappu.Battle.Projectile.set_key [71321]
00000001808d7679: mov      r13, qword ptr [rsp + 0xc0]
00000001808d7681: xor      r8d, r8d
00000001808d7684: mov      rdx, r13
00000001808d7687: mov      rcx, rdi
00000001808d768a: call     0x1808dddf0 ; Torappu.Battle.Projectile.set_originalKey [71323]
00000001808d768f: mov      r14, qword ptr [rsp + 0xb0]
00000001808d7697: test     r14, r14
00000001808d769a: je       0x1808d7dd5
00000001808d76a0: xor      edx, edx
00000001808d76a2: mov      rcx, r14
00000001808d76a5: call     0x1805d82c0 ; Torappu.Battle.Ability.get_owner [63023]
00000001808d76aa: mov      r8, qword ptr [rip + 0x8096bef] ; GenericMethodInfo 298108 @0x18896e2a0
00000001808d76b1: lea      rcx, [rsp + 0x50]
00000001808d76b6: mov      rdx, rax
00000001808d76b9: call     0x1845638c0
00000001808d76be: movups   xmm0, xmmword ptr [rsp + 0x50]
00000001808d76c3: lea      rcx, [rdi + 0xf8]
00000001808d76ca: xor      edx, edx
00000001808d76cc: movups   xmmword ptr [rdi + 0xf8], xmm0
00000001808d76d3: call     0x18048b9e0
00000001808d76d8: mov      rdx, qword ptr [rip + 0x805e109] ; GenericMethodInfo 280378 @0x1889357e8
00000001808d76df: lea      rcx, [rdi + 0xf8]
00000001808d76e6: call     0x185159fc0
00000001808d76eb: test     al, al
00000001808d76ed: je       0x1808d771c
00000001808d76ef: mov      rdx, qword ptr [rip + 0x805deb2] ; GenericMethodInfo 280377 @0x1889355a8
00000001808d76f6: lea      rcx, [rdi + 0xf8]
00000001808d76fd: call     0x185159d80
00000001808d7702: test     rax, rax
00000001808d7705: je       0x1808d7dd5
00000001808d770b: xor      edx, edx
00000001808d770d: mov      rcx, rax
00000001808d7710: call     0x180ad4250 ; Torappu.Battle.VisualObject.get_mapPosition [77866]
00000001808d7715: mov      qword ptr [rsp + 0x50], rax
00000001808d771a: jmp      0x1808d7758
00000001808d771c: cmp      byte ptr [rip + 0x83b7e92], 0
00000001808d7723: jne      0x1808d7738
00000001808d7725: lea      rcx, [rip + 0x7f51494] ; TypeInfo UnityEngine.Vector2 @0x188828bc0
00000001808d772c: call     0x18048bf00
00000001808d7731: mov      byte ptr [rip + 0x83b7e7d], 1
00000001808d7738: mov      rax, qword ptr [rip + 0x7f51481] ; TypeInfo UnityEngine.Vector2 @0x188828bc0
00000001808d773f: mov      rcx, qword ptr [rax + 0xb8]
00000001808d7746: movss    xmm1, dword ptr [rcx + 4]
00000001808d774b: movss    xmm0, dword ptr [rcx]
00000001808d774f: unpcklps xmm0, xmm1
00000001808d7752: movsd    qword ptr [rsp + 0x50], xmm0
00000001808d7758: movss    xmm0, dword ptr [rsp + 0x50]
00000001808d775e: lea      rcx, [rsp + 0x50]
00000001808d7763: movss    xmm1, dword ptr [rsp + 0x54]
00000001808d7769: mov      rdx, r14
00000001808d776c: movss    dword ptr [rdi + 0x108], xmm0
00000001808d7774: movss    dword ptr [rdi + 0x10c], xmm1
00000001808d777c: mov      r8, qword ptr [rip + 0x8095d9d] ; GenericMethodInfo 298102 @0x18896d520
00000001808d7783: call     0x1845638c0
00000001808d7788: movups   xmm0, xmmword ptr [rsp + 0x50]
00000001808d778d: lea      rcx, [rdi + 0x138]
00000001808d7794: xor      edx, edx
00000001808d7796: movups   xmmword ptr [rdi + 0x138], xmm0
00000001808d779d: call     0x18048b9e0
00000001808d77a2: mov      rdx, qword ptr [rip + 0x8057aff] ; GenericMethodInfo 280333 @0x18892f2a8
00000001808d77a9: lea      rcx, [rdi + 0x138]
00000001808d77b0: call     0x185159fc0
00000001808d77b5: test     al, al
00000001808d77b7: jne      0x1808d77bb
00000001808d77b9: jmp      0x1808d77e1
00000001808d77bb: mov      rdx, qword ptr [rip + 0x80578a6] ; GenericMethodInfo 280332 @0x18892f068
00000001808d77c2: lea      rcx, [rdi + 0x138]
00000001808d77c9: call     0x185159d80
00000001808d77ce: test     rax, rax
00000001808d77d1: je       0x1808d7dd5
00000001808d77d7: xor      edx, edx
00000001808d77d9: mov      rcx, rax
00000001808d77dc: call     0x1805d79f0 ; Torappu.Battle.Ability.get_damageMissFlag [63049]
00000001808d77e1: xor      r8d, r8d
00000001808d77e4: movzx    edx, al
00000001808d77e7: mov      rcx, rdi
00000001808d77ea: call     0x1808ddc20 ; Torappu.Battle.Projectile.set_damageMissFlag [71328]
00000001808d77ef: mov      rdx, qword ptr [rsp + 0xc8]
00000001808d77f7: lea      rcx, [rdi + 0xd8]
00000001808d77fe: mov      eax, dword ptr [rsp + 0xb8]
00000001808d7805: mov      qword ptr [rdi + 0xd8], rdx
00000001808d780c: mov      dword ptr [rdi + 0xd0], eax
00000001808d7812: call     0x18048b9e0
00000001808d7817: mov      rcx, qword ptr [rdi + 0x60]
00000001808d781b: test     rcx, rcx
00000001808d781e: je       0x1808d7dd5
00000001808d7824: xor      r9d, r9d
00000001808d7827: mov      r8, rdi
00000001808d782a: mov      rdx, r14
00000001808d782d: call     0x1808c8690 ; Torappu.Battle.Projectile.ActionController.Init [71436]
00000001808d7832: test     rbp, rbp
00000001808d7835: je       0x1808d7dd5
00000001808d783b: xor      edx, edx
00000001808d783d: mov      rcx, rbp
00000001808d7840: call     0x1808a9010
00000001808d7845: mov      qword ptr [rsp + 0x50], rax
00000001808d784a: xor      edx, edx
00000001808d784c: movss    xmm0, dword ptr [rsp + 0x50]
00000001808d7852: mov      rcx, rdi
00000001808d7855: movss    xmm1, dword ptr [rsp + 0x54]
00000001808d785b: movss    dword ptr [rdi + 0x110], xmm0
00000001808d7863: movss    dword ptr [rdi + 0x114], xmm1
00000001808d786b: call     0x1808dd7b0 ; Torappu.Battle.Projectile.get_source [71293]
00000001808d7870: test     rax, rax
00000001808d7873: je       0x1808d7dd5
00000001808d7879: mov      r12d, dword ptr [rax + 0x1c]
00000001808d787d: xor      edx, edx
00000001808d787f: mov      rcx, rdi
00000001808d7882: call     0x1808dd7b0 ; Torappu.Battle.Projectile.get_source [71293]
00000001808d7887: test     rax, rax
00000001808d788a: je       0x1808d7dd5
00000001808d7890: mov      ebx, dword ptr [rax + 0x20]
00000001808d7893: xor      edx, edx
00000001808d7895: mov      rcx, rbp
00000001808d7898: movaps   xmmword ptr [rsp + 0x60], xmm6
00000001808d789d: call     0x1808a9010
00000001808d78a2: xor      edx, edx
00000001808d78a4: mov      rcx, rbp
00000001808d78a7: movq     xmm6, rax
00000001808d78ac: call     0x1808c8210
00000001808d78b1: movq     r9, xmm6
00000001808d78b6: mov      qword ptr [rsp + 0x28], 0
00000001808d78bf: mov      r8d, ebx
00000001808d78c2: movss    dword ptr [rsp + 0x20], xmm0
00000001808d78c8: mov      edx, r12d
00000001808d78cb: mov      rcx, rdi
00000001808d78ce: call     0x180662860 ; Torappu.Battle.BObject.Init [65029]
00000001808d78d3: xor      r9d, r9d
00000001808d78d6: mov      r8, rbp
00000001808d78d9: mov      rdx, r15
00000001808d78dc: mov      rcx, rdi
00000001808d78df: call     0x1808dbda0 ; Torappu.Battle.Projectile._InitInline [71334]
00000001808d78e4: mov      rcx, qword ptr [rip + 0x7fefa1d] ; GenericMethodInfo 281884 @0x1888c7308
00000001808d78eb: call     0x1853364a0
00000001808d78f0: mov      r12, rax
00000001808d78f3: xor      edx, edx
00000001808d78f5: mov      rax, qword ptr [rdi + 0xe8]
00000001808d78fc: mov      rcx, rdi
00000001808d78ff: mov      qword ptr [rsp + 0x50], rax
00000001808d7904: call     0x1808dd7b0 ; Torappu.Battle.Projectile.get_source [71293]
00000001808d7909: mov      rcx, qword ptr [rip + 0x805b3d8] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808d7910: mov      rbx, rax
00000001808d7913: movaps   xmm6, xmmword ptr [rsp + 0x60]
00000001808d7918: cmp      dword ptr [rcx + 0xe0], 0
00000001808d791f: jne      0x1808d7926
00000001808d7921: call     0x18048c140
00000001808d7926: xor      r8d, r8d
00000001808d7929: xor      edx, edx
00000001808d792b: mov      rcx, rbx
00000001808d792e: call     0x186b63a70
00000001808d7933: test     al, al
00000001808d7935: je       0x1808d79ae
00000001808d7937: cmp      byte ptr [rip + 0x83b9e98], 0
00000001808d793e: jne      0x1808d795f
00000001808d7940: lea      rcx, [rip + 0x805dc61] ; GenericMethodInfo 280377 @0x1889355a8
00000001808d7947: call     0x18048bf00
00000001808d794c: lea      rcx, [rip + 0x7f4baa5] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808d7953: call     0x18048bf00
00000001808d7958: mov      byte ptr [rip + 0x83b9e77], 1
00000001808d795f: mov      rax, qword ptr [rip + 0x7f4ba92] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808d7966: mov      rcx, qword ptr [rax + 0xb8]
00000001808d796d: mov      rcx, qword ptr [rcx + 0x40]
00000001808d7971: test     rcx, rcx
00000001808d7974: jne      0x1808d798b
00000001808d7976: mov      rdx, qword ptr [rip + 0x805dc2b] ; GenericMethodInfo 280377 @0x1889355a8
00000001808d797d: lea      rcx, [rdi + 0xf8]
00000001808d7984: call     0x185159d80
00000001808d7989: jmp      0x1808d7996
00000001808d798b: xor      r8d, r8d
00000001808d798e: mov      rdx, rdi
00000001808d7991: call     0x1832f6410 ; XLua.DelegateBridge.__Gen_Delegate_Imp2631 [5286]
00000001808d7996: test     rax, rax
00000001808d7999: je       0x1808d7dd5
00000001808d799f: xor      edx, edx
00000001808d79a1: mov      rcx, rax
00000001808d79a4: call     0x180704d90 ; Torappu.Battle.Entity.get_id [66343]
00000001808d79a9: mov      r15, rax
00000001808d79ac: jmp      0x1808d79bf
00000001808d79ae: mov      rax, qword ptr [rip + 0x7fa0e8b] ; TypeInfo string @0x188878840
00000001808d79b5: mov      rcx, qword ptr [rax + 0xb8]
00000001808d79bc: mov      r15, qword ptr [rcx]
00000001808d79bf: xor      edx, edx
00000001808d79c1: mov      rcx, rdi
00000001808d79c4: call     0x1808dd7b0 ; Torappu.Battle.Projectile.get_source [71293]
00000001808d79c9: mov      rcx, qword ptr [rip + 0x805b318] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808d79d0: mov      rbx, rax
00000001808d79d3: cmp      dword ptr [rcx + 0xe0], 0
00000001808d79da: jne      0x1808d79e1
00000001808d79dc: call     0x18048c140
00000001808d79e1: mov      rdx, qword ptr [rip + 0x7f94880] ; TypeInfo Torappu.Battle.Character @0x18886c268
00000001808d79e8: mov      ebp, 1
00000001808d79ed: test     rbx, rbx
00000001808d79f0: jne      0x1808d79f6
00000001808d79f2: xor      ecx, ecx
00000001808d79f4: jmp      0x1808d7a3f
00000001808d79f6: cmp      byte ptr [rip + 0x83f4df3], 0
00000001808d79fd: mov      r8, qword ptr [rbx]
00000001808d7a00: jbe      0x1808d7a10
00000001808d7a02: mov      rcx, r8
00000001808d7a05: call     0x1804463e0
00000001808d7a0a: xor      ecx, ecx
00000001808d7a0c: test     al, al
00000001808d7a0e: jmp      0x1808d7a3b
00000001808d7a10: movzx    eax, byte ptr [rdx + 0x130]
00000001808d7a17: cmp      byte ptr [r8 + 0x130], al
00000001808d7a1e: jb       0x1808d7a35
00000001808d7a20: movzx    ecx, al
00000001808d7a23: mov      rax, qword ptr [r8 + 0xc8]
00000001808d7a2a: cmp      qword ptr [rax + rcx*8 - 8], rdx
00000001808d7a2f: jne      0x1808d7a35
00000001808d7a31: mov      eax, ebp
00000001808d7a33: jmp      0x1808d7a37
00000001808d7a35: xor      eax, eax
00000001808d7a37: xor      ecx, ecx
00000001808d7a39: test     eax, eax
00000001808d7a3b: cmovne   rcx, rbx
00000001808d7a3f: xor      r8d, r8d
00000001808d7a42: xor      edx, edx
00000001808d7a44: call     0x186b63a70
00000001808d7a49: test     al, al
00000001808d7a4b: je       0x1808d7b95
00000001808d7a51: cmp      byte ptr [rip + 0x83b9d7e], 0
00000001808d7a58: jne      0x1808d7a79
00000001808d7a5a: lea      rcx, [rip + 0x805db47] ; GenericMethodInfo 280377 @0x1889355a8
00000001808d7a61: call     0x18048bf00
00000001808d7a66: lea      rcx, [rip + 0x7f4b98b] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808d7a6d: call     0x18048bf00
00000001808d7a72: mov      byte ptr [rip + 0x83b9d5d], bpl
00000001808d7a79: mov      rax, qword ptr [rip + 0x7f4b978] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808d7a80: mov      rcx, qword ptr [rax + 0xb8]
00000001808d7a87: mov      rcx, qword ptr [rcx + 0x40]
00000001808d7a8b: test     rcx, rcx
00000001808d7a8e: jne      0x1808d7aa5
00000001808d7a90: mov      rdx, qword ptr [rip + 0x805db11] ; GenericMethodInfo 280377 @0x1889355a8
00000001808d7a97: lea      rcx, [rdi + 0xf8]
00000001808d7a9e: call     0x185159d80
00000001808d7aa3: jmp      0x1808d7ab0
00000001808d7aa5: xor      r8d, r8d
00000001808d7aa8: mov      rdx, rdi
00000001808d7aab: call     0x1832f6410 ; XLua.DelegateBridge.__Gen_Delegate_Imp2631 [5286]
00000001808d7ab0: mov      rdx, qword ptr [rip + 0x7f947b1] ; TypeInfo Torappu.Battle.Character @0x18886c268
00000001808d7ab7: mov      rbx, rax
00000001808d7aba: test     rax, rax
00000001808d7abd: je       0x1808d7dd5
00000001808d7ac3: movzx    r9d, byte ptr [rip + 0x83f4d25]
00000001808d7acb: mov      r8, qword ptr [rax]
00000001808d7ace: test     r9b, r9b
00000001808d7ad1: je       0x1808d7af0
00000001808d7ad3: mov      rcx, r8
00000001808d7ad6: call     0x1804463e0
00000001808d7adb: mov      rdx, qword ptr [rip + 0x7f94786] ; TypeInfo Torappu.Battle.Character @0x18886c268
00000001808d7ae2: xor      ecx, ecx
00000001808d7ae4: movzx    r9d, byte ptr [rip + 0x83f4d04]
00000001808d7aec: test     al, al
00000001808d7aee: jmp      0x1808d7b1b
00000001808d7af0: movzx    eax, byte ptr [rdx + 0x130]
00000001808d7af7: cmp      byte ptr [r8 + 0x130], al
00000001808d7afe: jb       0x1808d7b15
00000001808d7b00: movzx    ecx, al
00000001808d7b03: mov      rax, qword ptr [r8 + 0xc8]
00000001808d7b0a: cmp      qword ptr [rax + rcx*8 - 8], rdx
00000001808d7b0f: jne      0x1808d7b15
00000001808d7b11: mov      eax, ebp
00000001808d7b13: jmp      0x1808d7b17
00000001808d7b15: xor      eax, eax
00000001808d7b17: xor      ecx, ecx
00000001808d7b19: test     eax, eax
00000001808d7b1b: cmovne   rcx, rbx
00000001808d7b1f: test     rcx, rcx
00000001808d7b22: je       0x1808d7dd5
00000001808d7b28: mov      r8, qword ptr [rbx]
00000001808d7b2b: test     r9b, r9b
00000001808d7b2e: je       0x1808d7b3e
00000001808d7b30: mov      rcx, r8
00000001808d7b33: call     0x1804463e0
00000001808d7b38: xor      ecx, ecx
00000001808d7b3a: test     al, al
00000001808d7b3c: jmp      0x1808d7b65
00000001808d7b3e: movzx    eax, byte ptr [rdx + 0x130]
00000001808d7b45: cmp      byte ptr [r8 + 0x130], al
00000001808d7b4c: jb       0x1808d7b5f
00000001808d7b4e: movzx    ecx, al
00000001808d7b51: mov      rax, qword ptr [r8 + 0xc8]
00000001808d7b58: cmp      qword ptr [rax + rcx*8 - 8], rdx
00000001808d7b5d: je       0x1808d7b61
00000001808d7b5f: xor      ebp, ebp
00000001808d7b61: xor      ecx, ecx
00000001808d7b63: test     ebp, ebp
00000001808d7b65: cmovne   rcx, rbx
00000001808d7b69: xor      edx, edx
00000001808d7b6b: call     0x180ad0f70 ; Torappu.Battle.Unit.get_currentModeIndex [77558]
00000001808d7b70: mov      rcx, qword ptr [rip + 0x80039c9] ; TypeInfo Torappu.HGString @0x1888db540
00000001808d7b77: mov      ebx, eax
00000001808d7b79: cmp      dword ptr [rcx + 0xe0], 0
00000001808d7b80: jne      0x1808d7b87
00000001808d7b82: call     0x18048c140
00000001808d7b87: xor      edx, edx
00000001808d7b89: mov      ecx, ebx
00000001808d7b8b: call     0x186724360
00000001808d7b90: mov      rbx, rax
00000001808d7b93: jmp      0x1808d7ba6
00000001808d7b95: mov      rax, qword ptr [rip + 0x7fa0ca4] ; TypeInfo string @0x188878840
00000001808d7b9c: mov      rcx, qword ptr [rax + 0xb8]
00000001808d7ba3: mov      rbx, qword ptr [rcx]
00000001808d7ba6: mov      rcx, qword ptr [rip + 0x805b13b] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808d7bad: cmp      dword ptr [rcx + 0xe0], 0
00000001808d7bb4: jne      0x1808d7bbb
00000001808d7bb6: call     0x18048c140
00000001808d7bbb: xor      r8d, r8d
00000001808d7bbe: xor      edx, edx
00000001808d7bc0: mov      rcx, r14
00000001808d7bc3: call     0x186b63a70
00000001808d7bc8: test     al, al
00000001808d7bca: je       0x1808d7bd8
00000001808d7bcc: xor      edx, edx
00000001808d7bce: mov      rcx, r14
00000001808d7bd1: call     0x1805d7ad0 ; Torappu.Battle.Ability.get_extraDataId [63020]
00000001808d7bd6: jmp      0x1808d7be9
00000001808d7bd8: mov      rax, qword ptr [rip + 0x7fa0c61] ; TypeInfo string @0x188878840
00000001808d7bdf: mov      rcx, qword ptr [rax + 0xb8]
00000001808d7be6: mov      rax, qword ptr [rcx]
00000001808d7be9: test     r12, r12
00000001808d7bec: je       0x1808d7dd5
00000001808d7bf2: mov      rdx, qword ptr [rsp + 0x50]
00000001808d7bf7: mov      r9, r15
00000001808d7bfa: mov      qword ptr [rsp + 0x38], 0
00000001808d7c03: mov      r8d, 2
00000001808d7c09: mov      qword ptr [rsp + 0x30], rax
00000001808d7c0e: mov      rcx, r12
00000001808d7c11: mov      qword ptr [rsp + 0x28], r13
00000001808d7c16: mov      qword ptr [rsp + 0x20], rbx
00000001808d7c1b: call     0x180af6370 ; Torappu.Battle.ExtraBattleLogDB.FetchLoggerIds [78479]
00000001808d7c20: cmp      byte ptr [rdi + 0x84], 0
00000001808d7c27: je       0x1808d7d14
00000001808d7c2d: mov      rdx, qword ptr [rip + 0x805dbb4] ; GenericMethodInfo 280378 @0x1889357e8
00000001808d7c34: lea      rcx, [rdi + 0xf8]
00000001808d7c3b: call     0x185159fc0
00000001808d7c40: test     al, al
00000001808d7c42: je       0x1808d7d14
00000001808d7c48: xor      edx, edx
00000001808d7c4a: mov      rcx, rdi
00000001808d7c4d: call     0x1808dd7b0 ; Torappu.Battle.Projectile.get_source [71293]
00000001808d7c52: mov      rbx, rax
00000001808d7c55: test     rax, rax
00000001808d7c58: je       0x1808d7dd5
00000001808d7c5e: cmp      byte ptr [rip + 0x83f4b8b], 0
00000001808d7c65: jbe      0x1808d7c6f
00000001808d7c67: mov      rcx, qword ptr [rax]
00000001808d7c6a: call     0x180446d00
00000001808d7c6f: mov      rdx, qword ptr [rbx]
00000001808d7c72: mov      rcx, rbx
00000001808d7c75: mov      r8, qword ptr [rdx + 0x4a0]
00000001808d7c7c: mov      rdx, qword ptr [rdx + 0x4a8]
00000001808d7c83: call     r8
00000001808d7c86: mov      r8, qword ptr [rip + 0x8060f1b] ; GenericMethodInfo 280401 @0x188938ba8
00000001808d7c8d: lea      rcx, [rsp + 0x50]
00000001808d7c92: mov      rdx, rdi
00000001808d7c95: mov      rbx, rax
00000001808d7c98: call     0x18515a130
00000001808d7c9d: test     rbx, rbx
00000001808d7ca0: je       0x1808d7dd5
00000001808d7ca6: mov      rdi, qword ptr [rip + 0x800dc43] ; GenericMethodInfo 268475 @0x1888e58f0
00000001808d7cad: inc      dword ptr [rbx + 0x1c]
00000001808d7cb0: mov      rdx, qword ptr [rbx + 0x10]
00000001808d7cb4: test     rdx, rdx
00000001808d7cb7: je       0x1808d7dd5
00000001808d7cbd: movsxd   rcx, dword ptr [rbx + 0x18]
00000001808d7cc1: cmp      ecx, dword ptr [rdx + 0x18]
00000001808d7cc4: jb       0x1808d7d3d
00000001808d7cc6: mov      rax, qword ptr [rdi + 0x20]
00000001808d7cca: mov      rcx, qword ptr [rax + 0xc0]
00000001808d7cd1: mov      rax, qword ptr [rcx + 0x58]
00000001808d7cd5: cmp      qword ptr [rax + 0x20], 0
00000001808d7cda: jne      0x1808d7ced
00000001808d7cdc: mov      rax, qword ptr [rdi + 0x20]
00000001808d7ce0: mov      rcx, qword ptr [rax + 0xc0]
00000001808d7ce7: mov      rax, qword ptr [rcx + 0x58]
00000001808d7ceb: call     qword ptr [rax]
00000001808d7ced: mov      rax, qword ptr [rdi + 0x20]
00000001808d7cf1: lea      rdx, [rsp + 0x50]
00000001808d7cf6: movaps   xmm0, xmmword ptr [rsp + 0x50]
00000001808d7cfb: mov      rcx, rbx
00000001808d7cfe: movdqa   xmmword ptr [rsp + 0x50], xmm0
00000001808d7d04: mov      r8, qword ptr [rax + 0xc0]
00000001808d7d0b: mov      r8, qword ptr [r8 + 0x58]
00000001808d7d0f: call     0x184ac7730
00000001808d7d14: mov      r12, qword ptr [rsp + 0x90]
00000001808d7d1c: mov      r13, qword ptr [rsp + 0x98]
00000001808d7d24: mov      r14, qword ptr [rsp + 0xa0]
00000001808d7d2c: mov      rbx, qword ptr [rsp + 0xa8]
00000001808d7d34: add      rsp, 0x70
00000001808d7d38: pop      r15
00000001808d7d3a: pop      rdi
00000001808d7d3b: pop      rbp
00000001808d7d3c: ret      
00000001808d7d3d: lea      eax, [rcx + 1]
00000001808d7d40: mov      dword ptr [rbx + 0x18], eax
00000001808d7d43: cmp      ecx, dword ptr [rdx + 0x18]
00000001808d7d46: jae      0x1808d7dcf
00000001808d7d4c: movaps   xmm0, xmmword ptr [rsp + 0x50]
00000001808d7d51: lea      rax, [rcx + 2]
00000001808d7d55: add      rcx, 2
00000001808d7d59: add      rax, rax
00000001808d7d5c: shl      rcx, 4
00000001808d7d60: add      rcx, rdx
00000001808d7d63: movups   xmmword ptr [rdx + rax*8], xmm0
00000001808d7d67: xor      edx, edx
00000001808d7d69: call     0x18048b9e0
00000001808d7d6e: jmp      0x1808d7d14
00000001808d7d70: mov      rax, qword ptr [rsp + 0xc8]
00000001808d7d78: mov      r9, rbp
00000001808d7d7b: mov      qword ptr [rsp + 0x48], 0
00000001808d7d84: mov      r8, rbx
00000001808d7d87: mov      qword ptr [rsp + 0x40], rax
00000001808d7d8c: mov      rdx, rdi
00000001808d7d8f: mov      rax, qword ptr [rsp + 0xc0]
00000001808d7d97: mov      qword ptr [rsp + 0x38], rax
00000001808d7d9c: mov      eax, dword ptr [rsp + 0xb8]
00000001808d7da3: mov      dword ptr [rsp + 0x30], eax
00000001808d7da7: mov      rax, qword ptr [rsp + 0xb0]
00000001808d7daf: mov      qword ptr [rsp + 0x28], rax
00000001808d7db4: mov      qword ptr [rsp + 0x20], r15
00000001808d7db9: call     0x1833757f0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3448 [6103]
00000001808d7dbe: mov      rbx, qword ptr [rsp + 0xa8]
00000001808d7dc6: add      rsp, 0x70
00000001808d7dca: pop      r15
00000001808d7dcc: pop      rdi
00000001808d7dcd: pop      rbp
00000001808d7dce: ret      
00000001808d7dcf: call     0x18048c0a0
00000001808d7dd4: int3     
00000001808d7dd5: call     0x18048c0b0
00000001808d7dda: int3     
00000001808d7ddb: int3     
00000001808d7ddc: int3     
00000001808d7ddd: int3     
00000001808d7dde: int3     
00000001808d7ddf: int3     