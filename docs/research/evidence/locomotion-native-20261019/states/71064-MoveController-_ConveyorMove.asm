; Torappu.Battle.MoveController._ConveyorMove metadata=71064 token=0x6011599 VA=0x1808b7f60 RVA=0x8b7f60 size=0x590
00000001808b7f60: push     r14
00000001808b7f62: sub      rsp, 0x80
00000001808b7f69: cmp      byte ptr [rip + 0x83d97d0], 0
00000001808b7f70: mov      r14, rcx
00000001808b7f73: movaps   xmmword ptr [rsp + 0x40], xmm8
00000001808b7f79: movaps   xmm8, xmm1
00000001808b7f7d: jne      0x1808b7fb6
00000001808b7f7f: lea      rcx, [rip + 0x7f6372a] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
00000001808b7f86: call     0x18048bf00
00000001808b7f8b: lea      rcx, [rip + 0x800bca6] ; TypeInfo Torappu.MathUtil @0x1888c3c38
00000001808b7f92: call     0x18048bf00
00000001808b7f97: lea      rcx, [rip + 0x8045b0a] ; TypeInfo Torappu.Battle.MoveController @0x1888fdaa8
00000001808b7f9e: call     0x18048bf00
00000001808b7fa3: lea      rcx, [rip + 0x807ad3e] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808b7faa: call     0x18048bf00
00000001808b7faf: mov      byte ptr [rip + 0x83d978a], 1
00000001808b7fb6: xor      eax, eax
00000001808b7fb8: mov      qword ptr [rsp + 0xa8], rax
00000001808b7fc0: mov      rax, qword ptr [rip + 0x8045ae1] ; TypeInfo Torappu.Battle.MoveController @0x1888fdaa8
00000001808b7fc7: mov      rcx, qword ptr [rax + 0xb8]
00000001808b7fce: mov      rcx, qword ptr [rcx + 0x88]
00000001808b7fd5: test     rcx, rcx
00000001808b7fd8: jne      0x1808b84ca
00000001808b7fde: mov      rcx, qword ptr [rip + 0x800bc53] ; TypeInfo Torappu.MathUtil @0x1888c3c38
00000001808b7fe5: cmp      dword ptr [rcx + 0xe0], 0
00000001808b7fec: jne      0x1808b7ff3
00000001808b7fee: call     0x18048c140
00000001808b7ff3: xor      r8d, r8d
00000001808b7ff6: xorps    xmm1, xmm1
00000001808b7ff9: movaps   xmm0, xmm8
00000001808b7ffd: call     0x1866e56f0 ; Torappu.MathUtil.LE [220364]
00000001808b8002: test     al, al
00000001808b8004: jne      0x1808b84ba
00000001808b800a: cmp      byte ptr [rip + 0x83d9731], al
00000001808b8010: mov      qword ptr [rsp + 0x70], r15
00000001808b8015: jne      0x1808b8042
00000001808b8017: lea      rcx, [rip + 0x7f63692] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
00000001808b801e: call     0x18048bf00
00000001808b8023: lea      rcx, [rip + 0x8045a7e] ; TypeInfo Torappu.Battle.MoveController @0x1888fdaa8
00000001808b802a: call     0x18048bf00
00000001808b802f: lea      rcx, [rip + 0x807acb2] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808b8036: call     0x18048bf00
00000001808b803b: mov      byte ptr [rip + 0x83d96ff], 1
00000001808b8042: mov      rax, qword ptr [rip + 0x8045a5f] ; TypeInfo Torappu.Battle.MoveController @0x1888fdaa8
00000001808b8049: xor      r15d, r15d
00000001808b804c: mov      qword ptr [rsp + 0x90], rbx
00000001808b8054: mov      qword ptr [rsp + 0x98], rbp
00000001808b805c: mov      qword ptr [rsp + 0xa0], rsi
00000001808b8064: mov      rcx, qword ptr [rax + 0xb8]
00000001808b806b: mov      qword ptr [rsp + 0x78], rdi
00000001808b8070: movaps   xmmword ptr [rsp + 0x60], xmm6
00000001808b8075: mov      rcx, qword ptr [rcx + 0x90]
00000001808b807c: test     rcx, rcx
00000001808b807f: jne      0x1808b8191
00000001808b8085: mov      rdi, qword ptr [r14 + 0x28]
00000001808b8089: mov      rdx, qword ptr [rip + 0x7f63620] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
00000001808b8090: test     rdi, rdi
00000001808b8093: jne      0x1808b809a
00000001808b8095: mov      ebx, r15d
00000001808b8098: jmp      0x1808b80e4
00000001808b809a: cmp      byte ptr [rip + 0x841474f], r15b
00000001808b80a1: mov      r8, qword ptr [rdi]
00000001808b80a4: jbe      0x1808b80b2
00000001808b80a6: mov      rcx, r8
00000001808b80a9: call     0x1804463e0
00000001808b80ae: test     al, al
00000001808b80b0: jmp      0x1808b80dd
00000001808b80b2: movzx    eax, byte ptr [rdx + 0x130]
00000001808b80b9: cmp      byte ptr [r8 + 0x130], al
00000001808b80c0: jb       0x1808b80d8
00000001808b80c2: movzx    ecx, al
00000001808b80c5: mov      rax, qword ptr [r8 + 0xc8]
00000001808b80cc: cmp      qword ptr [rax + rcx*8 - 8], rdx
00000001808b80d1: mov      eax, 1
00000001808b80d6: je       0x1808b80db
00000001808b80d8: mov      eax, r15d
00000001808b80db: test     eax, eax
00000001808b80dd: mov      rbx, r15
00000001808b80e0: cmovne   rbx, rdi
00000001808b80e4: mov      rcx, qword ptr [rip + 0x807abfd] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808b80eb: cmp      dword ptr [rcx + 0xe0], r15d
00000001808b80f2: jne      0x1808b80f9
00000001808b80f4: call     0x18048c140
00000001808b80f9: xor      r8d, r8d
00000001808b80fc: xor      edx, edx
00000001808b80fe: mov      rcx, rbx
00000001808b8101: call     0x186b638d0
00000001808b8106: test     al, al
00000001808b8108: jne      0x1808b8493
00000001808b810e: test     rbx, rbx
00000001808b8111: je       0x1808b84e9
00000001808b8117: cmp      byte ptr [rip + 0x84146d2], r15b
00000001808b811e: jbe      0x1808b8128
00000001808b8120: mov      rcx, qword ptr [rbx]
00000001808b8123: call     0x180446d00
00000001808b8128: mov      rdx, qword ptr [rbx]
00000001808b812b: mov      rcx, rbx
00000001808b812e: mov      rax, qword ptr [rdx + 0xad0]
00000001808b8135: mov      rdx, qword ptr [rdx + 0xad8]
00000001808b813c: call     rax
00000001808b813e: test     al, al
00000001808b8140: jne      0x1808b8493
00000001808b8146: xor      edx, edx
00000001808b8148: mov      rcx, rbx
00000001808b814b: call     0x1807060c0 ; Torappu.Battle.Entity.get_isLevitate [66490]
00000001808b8150: test     al, al
00000001808b8152: jne      0x1808b8493
00000001808b8158: xor      edx, edx
00000001808b815a: mov      rcx, rbx
00000001808b815d: call     0x180a7e4f0 ; Torappu.Battle.Enemy.get_isUnbalanced [76336]
00000001808b8162: test     al, al
00000001808b8164: jne      0x1808b8493
00000001808b816a: xor      edx, edx
00000001808b816c: mov      rcx, rbx
00000001808b816f: call     0x180701e20 ; Torappu.Battle.Entity.get_attributes [66358]
00000001808b8174: test     rax, rax
00000001808b8177: je       0x1808b84e9
00000001808b817d: xor      r8d, r8d
00000001808b8180: mov      edx, 0x2c
00000001808b8185: mov      rcx, rax
00000001808b8188: call     0x180649370 ; Torappu.Battle.Attributes.GetAbnormalImmune [64280]
00000001808b818d: xor      al, 1
00000001808b818f: jmp      0x1808b819c
00000001808b8191: xor      r8d, r8d
00000001808b8194: mov      rdx, r14
00000001808b8197: call     0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
00000001808b819c: test     al, al
00000001808b819e: je       0x1808b8493
00000001808b81a4: mov      rdx, qword ptr [rip + 0x7f63505] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
00000001808b81ab: mov      rcx, qword ptr [r14 + 0x28]
00000001808b81af: call     0x1800057a0
00000001808b81b4: mov      rcx, qword ptr [rip + 0x807ab2d] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808b81bb: mov      rsi, rax
00000001808b81be: cmp      dword ptr [rcx + 0xe0], r15d
00000001808b81c5: jne      0x1808b81cc
00000001808b81c7: call     0x18048c140
00000001808b81cc: xor      r8d, r8d
00000001808b81cf: xor      edx, edx
00000001808b81d1: mov      rcx, rsi
00000001808b81d4: call     0x186b638d0
00000001808b81d9: test     al, al
00000001808b81db: jne      0x1808b8493
00000001808b81e1: test     rsi, rsi
00000001808b81e4: je       0x1808b84e9
00000001808b81ea: mov      ecx, 0x34
00000001808b81ef: mov      rdx, rsi
00000001808b81f2: call     0x180005610
00000001808b81f7: mov      rcx, qword ptr [rip + 0x807aaea] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808b81fe: mov      rbx, rax
00000001808b8201: cmp      dword ptr [rcx + 0xe0], r15d
00000001808b8208: jne      0x1808b820f
00000001808b820a: call     0x18048c140
00000001808b820f: xor      r8d, r8d
00000001808b8212: xor      edx, edx
00000001808b8214: mov      rcx, rbx
00000001808b8217: call     0x186b638d0
00000001808b821c: test     al, al
00000001808b821e: jne      0x1808b8493
00000001808b8224: mov      ecx, 0x34
00000001808b8229: mov      rdx, rsi
00000001808b822c: call     0x180005610
00000001808b8231: mov      rdi, rax
00000001808b8234: test     rax, rax
00000001808b8237: je       0x1808b84e9
00000001808b823d: cmp      byte ptr [rip + 0x83d93d6], r15b
00000001808b8244: jne      0x1808b8295
00000001808b8246: lea      rcx, [rip + 0x8094c4b] ; TypeInfo Torappu.Battle.IConveyorTileVelocitySource @0x18894ce98
00000001808b824d: call     0x18048bf00
00000001808b8252: lea      rcx, [rip + 0x7faa0ef] ; GenericMethodInfo 272656 @0x188862348
00000001808b8259: call     0x18048bf00
00000001808b825e: lea      rcx, [rip + 0x7faa313] ; GenericMethodInfo 272657 @0x188862578
00000001808b8265: call     0x18048bf00
00000001808b826a: lea      rcx, [rip + 0x800b9c7] ; TypeInfo Torappu.MathUtil @0x1888c3c38
00000001808b8271: call     0x18048bf00
00000001808b8276: lea      rcx, [rip + 0x807aa6b] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808b827d: call     0x18048bf00
00000001808b8282: lea      rcx, [rip + 0x8010847] ; TypeInfo Torappu.Battle.Tile @0x1888c8ad0
00000001808b8289: call     0x18048bf00
00000001808b828e: mov      byte ptr [rip + 0x83d9385], 1
00000001808b8295: mov      rax, qword ptr [rip + 0x8010834] ; TypeInfo Torappu.Battle.Tile @0x1888c8ad0
00000001808b829c: mov      rcx, qword ptr [rax + 0xb8]
00000001808b82a3: mov      rcx, qword ptr [rcx + 0x228]
00000001808b82aa: test     rcx, rcx
00000001808b82ad: jne      0x1808b83da
00000001808b82b3: cmp      byte ptr [rip + 0x83d72fb], r15b
00000001808b82ba: jne      0x1808b82cf
00000001808b82bc: lea      rcx, [rip + 0x7f708fd] ; TypeInfo UnityEngine.Vector2 @0x188828bc0
00000001808b82c3: call     0x18048bf00
00000001808b82c8: mov      byte ptr [rip + 0x83d72e6], 1
00000001808b82cf: mov      rax, qword ptr [rip + 0x7f708ea] ; TypeInfo UnityEngine.Vector2 @0x188828bc0
00000001808b82d6: mov      rcx, qword ptr [rax + 0xb8]
00000001808b82dd: movss    xmm0, dword ptr [rcx]
00000001808b82e1: movss    xmm1, dword ptr [rcx + 4]
00000001808b82e6: mov      rcx, qword ptr [rip + 0x807a9fb] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808b82ed: movss    dword ptr [rsp + 0xa8], xmm0
00000001808b82f6: movss    dword ptr [rsp + 0xac], xmm1
00000001808b82ff: cmp      dword ptr [rcx + 0xe0], r15d
00000001808b8306: jne      0x1808b830d
00000001808b8308: call     0x18048c140
00000001808b830d: xor      r8d, r8d
00000001808b8310: xor      edx, edx
00000001808b8312: mov      rcx, rsi
00000001808b8315: call     0x186b638d0
00000001808b831a: test     al, al
00000001808b831c: jne      0x1808b8493
00000001808b8322: mov      rbp, qword ptr [rdi + 0x108]
00000001808b8329: mov      ebx, r15d
00000001808b832c: test     rbp, rbp
00000001808b832f: je       0x1808b84e9
00000001808b8335: mov      ebp, dword ptr [rbp + 0x18]
00000001808b8338: test     ebp, ebp
00000001808b833a: jle      0x1808b8393
00000001808b833c: nop      dword ptr [rax]
00000001808b8340: mov      rcx, qword ptr [rdi + 0x108]
00000001808b8347: test     rcx, rcx
00000001808b834a: je       0x1808b84e9
00000001808b8350: mov      r8, qword ptr [rip + 0x7faa221] ; GenericMethodInfo 272657 @0x188862578
00000001808b8357: mov      edx, ebx
00000001808b8359: call     0x184afcf00
00000001808b835e: mov      rdx, qword ptr [rip + 0x8094b33] ; TypeInfo Torappu.Battle.IConveyorTileVelocitySource @0x18894ce98
00000001808b8365: mov      rcx, rax
00000001808b8368: call     0x18048b9f0
00000001808b836d: test     rax, rax
00000001808b8370: je       0x1808b838d
00000001808b8372: lea      r9, [rsp + 0xa8]
00000001808b837a: mov      qword ptr [rsp + 0x20], r15
00000001808b837f: mov      r8, rdi
00000001808b8382: mov      rdx, rsi
00000001808b8385: mov      rcx, rax
00000001808b8388: call     0x1808a8e00
00000001808b838d: inc      ebx
00000001808b838f: cmp      ebx, ebp
00000001808b8391: jl       0x1808b8340
00000001808b8393: mov      rcx, qword ptr [rip + 0x800b89e] ; TypeInfo Torappu.MathUtil @0x1888c3c38
00000001808b839a: movss    xmm6, dword ptr [rsp + 0xa8]
00000001808b83a3: movaps   xmmword ptr [rsp + 0x50], xmm7
00000001808b83a8: movss    xmm7, dword ptr [rsp + 0xac]
00000001808b83b1: cmp      dword ptr [rcx + 0xe0], r15d
00000001808b83b8: jne      0x1808b83bf
00000001808b83ba: call     0x18048c140
00000001808b83bf: movaps   xmm0, xmm6
00000001808b83c2: xor      edx, edx
00000001808b83c4: unpcklps xmm0, xmm7
00000001808b83c7: movq     rcx, xmm0
00000001808b83cc: call     0x1866e5620 ; Torappu.MathUtil.IsZero [220411]
00000001808b83d1: movaps   xmm7, xmmword ptr [rsp + 0x50]
00000001808b83d6: xor      al, 1
00000001808b83d8: jmp      0x1808b83f2
00000001808b83da: lea      r9, [rsp + 0xa8]
00000001808b83e2: mov      qword ptr [rsp + 0x20], r15
00000001808b83e7: mov      r8, rsi
00000001808b83ea: mov      rdx, rdi
00000001808b83ed: call     0x1833696b0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3375 [6030]
00000001808b83f2: test     al, al
00000001808b83f4: je       0x1808b8493
00000001808b83fa: movss    xmm0, dword ptr [rsp + 0xa8]
00000001808b8403: movss    xmm1, dword ptr [rsp + 0xac]
00000001808b840c: mulss    xmm0, xmm8
00000001808b8411: mulss    xmm1, xmm8
00000001808b8416: unpcklps xmm0, xmm1
00000001808b8419: xor      r8d, r8d
00000001808b841c: movq     rdx, xmm0
00000001808b8421: mov      rcx, r14
00000001808b8424: call     0x1808b7c50 ; Torappu.Battle.MoveController._ClampConveyorDelta [71066]
00000001808b8429: mov      rcx, qword ptr [rip + 0x800b808] ; TypeInfo Torappu.MathUtil @0x1888c3c38
00000001808b8430: movq     xmm6, rax
00000001808b8435: movsd    qword ptr [rsp + 0x30], xmm6
00000001808b843b: cmp      dword ptr [rcx + 0xe0], r15d
00000001808b8442: jne      0x1808b8449
00000001808b8444: call     0x18048c140
00000001808b8449: xor      edx, edx
00000001808b844b: movq     rcx, xmm6
00000001808b8450: call     0x1866e5620 ; Torappu.MathUtil.IsZero [220411]
00000001808b8455: test     al, al
00000001808b8457: jne      0x1808b8493
00000001808b8459: xor      edx, edx
00000001808b845b: mov      rcx, rsi
00000001808b845e: call     0x180ad4250 ; Torappu.Battle.VisualObject.get_mapPosition [77866]
00000001808b8463: movss    xmm0, dword ptr [rsp + 0x30]
00000001808b8469: movss    xmm1, dword ptr [rsp + 0x34]
00000001808b846f: mov      qword ptr [rsp + 0x38], rax
00000001808b8474: addss    xmm0, dword ptr [rsp + 0x38]
00000001808b847a: addss    xmm1, dword ptr [rsp + 0x3c]
00000001808b8480: unpcklps xmm0, xmm1
00000001808b8483: xor      r8d, r8d
00000001808b8486: movq     rdx, xmm0
00000001808b848b: mov      rcx, rsi
00000001808b848e: call     0x180ad3dc0 ; Torappu.Battle.VisualObject.SetPosition [77880]
00000001808b8493: mov      rbx, qword ptr [rsp + 0x90]
00000001808b849b: mov      rdi, qword ptr [rsp + 0x78]
00000001808b84a0: mov      rsi, qword ptr [rsp + 0xa0]
00000001808b84a8: mov      rbp, qword ptr [rsp + 0x98]
00000001808b84b0: movaps   xmm6, xmmword ptr [rsp + 0x60]
00000001808b84b5: mov      r15, qword ptr [rsp + 0x70]
00000001808b84ba: movaps   xmm8, xmmword ptr [rsp + 0x40]
00000001808b84c0: add      rsp, 0x80
00000001808b84c7: pop      r14
00000001808b84c9: ret      
00000001808b84ca: xor      r9d, r9d
00000001808b84cd: movaps   xmm2, xmm8
00000001808b84d1: mov      rdx, r14
00000001808b84d4: call     0x1836500a0 ; XLua.DelegateBridge.__Gen_Delegate_Imp81 [2736]
00000001808b84d9: movaps   xmm8, xmmword ptr [rsp + 0x40]
00000001808b84df: add      rsp, 0x80
00000001808b84e6: pop      r14
00000001808b84e8: ret      
00000001808b84e9: call     0x18048c0b0
00000001808b84ee: int3     
00000001808b84ef: int3     
