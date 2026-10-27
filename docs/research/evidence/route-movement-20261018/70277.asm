; Torappu.Battle.DirectionCursor.GetNextDirection metadata=70277 token=0x6011286 VA=0x180894f60 RVA=0x894f60 size=0x730
0000000180894f60: push     rbp
0000000180894f62: push     rsi
0000000180894f63: lea      rbp, [rsp - 0x4f]
0000000180894f68: sub      rsp, 0xa8
0000000180894f6f: cmp      byte ptr [rip + 0x83fc56e], 0
0000000180894f76: mov      rsi, rcx
0000000180894f79: jne      0x180894fb2
0000000180894f7b: lea      rcx, [rip + 0x80d8176] ; TypeInfo Torappu.Battle.DirectionCursor @0x18896d0f8
0000000180894f82: call     0x18048bf00
0000000180894f87: lea      rcx, [rip + 0x802fffa] ; TypeInfo Torappu.GridPosition @0x1888c4f88
0000000180894f8e: call     0x18048bf00
0000000180894f93: lea      rcx, [rip + 0x802ec9e] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180894f9a: call     0x18048bf00
0000000180894f9f: lea      rcx, [rip + 0x804b1a2] ; GenericMethodInfo 282061 @0x1888e0148
0000000180894fa6: call     0x18048bf00
0000000180894fab: mov      byte ptr [rip + 0x83fc532], 1
0000000180894fb2: mov      rax, qword ptr [rip + 0x80d813f] ; TypeInfo Torappu.Battle.DirectionCursor @0x18896d0f8
0000000180894fb9: xorps    xmm0, xmm0
0000000180894fbc: movups   xmmword ptr [rbp - 0x31], xmm0
0000000180894fc0: movups   xmmword ptr [rbp - 0x21], xmm0
0000000180894fc4: movups   xmmword ptr [rbp - 0x11], xmm0
0000000180894fc8: mov      rcx, qword ptr [rax + 0xb8]
0000000180894fcf: mov      rcx, qword ptr [rcx + 0x80]
0000000180894fd6: test     rcx, rcx
0000000180894fd9: jne      0x18089566d
0000000180894fdf: movaps   xmmword ptr [rsp + 0x90], xmm6
0000000180894fe7: movaps   xmmword ptr [rsp + 0x60], xmm9
0000000180894fed: xor      edx, edx
0000000180894fef: mov      rcx, rsi
0000000180894ff2: call     0x180894ed0 ; Torappu.Battle.DirectionCursor.GetLocatorPosition [70291]
0000000180894ff7: mov      rcx, qword ptr [rip + 0x802ff8a] ; TypeInfo Torappu.GridPosition @0x1888c4f88
0000000180894ffe: movq     xmm6, rax
0000000180895003: cmp      dword ptr [rcx + 0xe0], 0
000000018089500a: movaps   xmm9, xmm6
000000018089500e: movsd    qword ptr [rbp + 0x7f], xmm6
0000000180895013: movsd    qword ptr [rbp - 0x39], xmm6
0000000180895018: jne      0x18089501f
000000018089501a: call     0x18048c140
000000018089501f: mov      qword ptr [rsp + 0xc0], rbx
0000000180895027: xor      edx, edx
0000000180895029: mov      qword ptr [rsp + 0xa0], rdi
0000000180895031: movq     rcx, xmm6
0000000180895036: movaps   xmmword ptr [rsp + 0x80], xmm7
000000018089503e: movaps   xmmword ptr [rsp + 0x70], xmm8
0000000180895044: call     0x182103900 ; Torappu.GridPosition.FromVectorPosition [28047]
0000000180895049: mov      rcx, qword ptr [rsi + 0x10]
000000018089504d: mov      qword ptr [rbp + 0x77], rax
0000000180895051: test     rcx, rcx
0000000180895054: je       0x180895682
000000018089505a: mov      rcx, qword ptr [rcx + 0x10]
000000018089505e: test     rcx, rcx
0000000180895061: je       0x180895682
0000000180895067: xor      r8d, r8d
000000018089506a: mov      rdx, rax
000000018089506d: call     0x18087a3a0 ; Torappu.Battle.Map.CheckGridValid [70066]
0000000180895072: test     al, al
0000000180895074: je       0x180895648
000000018089507a: xor      edx, edx
000000018089507c: mov      rcx, rsi
000000018089507f: call     0x180877530 ; Torappu.Battle.BasicCursor.get_visitEveryTileCenter [70146]
0000000180895084: test     al, al
0000000180895086: jne      0x1808953fa
000000018089508c: xor      edx, edx
000000018089508e: mov      rcx, rsi
0000000180895091: call     0x180877470 ; Torappu.Battle.BasicCursor.get_visitEveryNodeCenter [70148]
0000000180895096: test     al, al
0000000180895098: jne      0x1808951b5
000000018089509e: xor      edx, edx
00000001808950a0: mov      rcx, rsi
00000001808950a3: call     0x1808774d0 ; Torappu.Battle.BasicCursor.get_visitEveryNodeStably [70156]
00000001808950a8: test     al, al
00000001808950aa: je       0x1808952e8
00000001808950b0: mov      rcx, qword ptr [rip + 0x802fed1] ; TypeInfo Torappu.GridPosition @0x1888c4f88
00000001808950b7: mov      rbx, qword ptr [rbp + 0x77]
00000001808950bb: mov      rdi, qword ptr [rsi + 0x70]
00000001808950bf: cmp      dword ptr [rcx + 0xe0], 0
00000001808950c6: jne      0x1808950cd
00000001808950c8: call     0x18048c140
00000001808950cd: xor      r8d, r8d
00000001808950d0: mov      rdx, rdi
00000001808950d3: mov      rcx, rbx
00000001808950d6: call     0x182104110 ; Torappu.GridPosition.op_Inequality [28052]
00000001808950db: test     al, al
00000001808950dd: je       0x1808950f2
00000001808950df: mov      rdx, qword ptr [rbp + 0x77]
00000001808950e3: xor      r8d, r8d
00000001808950e6: mov      rcx, rsi
00000001808950e9: call     0x180897510 ; Torappu.Battle.DirectionCursor._GetNextGrid [70290]
00000001808950ee: mov      qword ptr [rsi + 0x70], rax
00000001808950f2: mov      rcx, qword ptr [rip + 0x804b04f] ; GenericMethodInfo 282061 @0x1888e0148
00000001808950f9: call     0x185337c50
00000001808950fe: mov      rcx, qword ptr [rsi + 0x10]
0000000180895102: test     rcx, rcx
0000000180895105: je       0x180895682
000000018089510b: mov      rdx, qword ptr [rcx + 0x18]
000000018089510f: test     rdx, rdx
0000000180895112: je       0x180895682
0000000180895118: test     rax, rax
000000018089511b: je       0x180895682
0000000180895121: mov      r8, qword ptr [rsi + 0x70]
0000000180895125: xor      r9d, r9d
0000000180895128: mov      edx, dword ptr [rdx + 0x10]
000000018089512b: mov      rcx, rax
000000018089512e: call     0x18087a650 ; Torappu.Battle.Map.CheckPassable [70011]
0000000180895133: test     al, al
0000000180895135: je       0x1808952e8
000000018089513b: mov      rcx, qword ptr [rip + 0x802fe46] ; TypeInfo Torappu.GridPosition @0x1888c4f88
0000000180895142: cmp      dword ptr [rcx + 0xe0], 0
0000000180895149: jne      0x180895150
000000018089514b: call     0x18048c140
0000000180895150: lea      rcx, [rsi + 0x70]
0000000180895154: xor      edx, edx
0000000180895156: call     0x182104010 ; Torappu.GridPosition.get_asLocalPosition [28039]
000000018089515b: mov      rcx, qword ptr [rip + 0x802ead6] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180895162: movq     xmm7, rax
0000000180895167: cmp      dword ptr [rcx + 0xe0], 0
000000018089516e: jne      0x180895175
0000000180895170: call     0x18048c140
0000000180895175: movss    xmm2, dword ptr [rip + 0x65aac1f]
000000018089517d: xor      r9d, r9d
0000000180895180: movq     rdx, xmm7
0000000180895185: movq     rcx, xmm6
000000018089518a: call     0x1866e3dc0 ; Torappu.MathUtil.CheckDistance [220420]
000000018089518f: test     al, al
0000000180895191: jne      0x1808952d5
0000000180895197: mov      rcx, qword ptr [rip + 0x802fdea] ; TypeInfo Torappu.GridPosition @0x1888c4f88
000000018089519e: cmp      dword ptr [rcx + 0xe0], 0
00000001808951a5: jne      0x1808951ac
00000001808951a7: call     0x18048c140
00000001808951ac: lea      rcx, [rsi + 0x70]
00000001808951b0: jmp      0x1808954ec
00000001808951b5: mov      rcx, qword ptr [rip + 0x802fdcc] ; TypeInfo Torappu.GridPosition @0x1888c4f88
00000001808951bc: mov      rbx, qword ptr [rbp + 0x77]
00000001808951c0: mov      rdi, qword ptr [rsi + 0x70]
00000001808951c4: cmp      dword ptr [rcx + 0xe0], 0
00000001808951cb: jne      0x1808951d2
00000001808951cd: call     0x18048c140
00000001808951d2: xor      r8d, r8d
00000001808951d5: mov      rdx, rdi
00000001808951d8: mov      rcx, rbx
00000001808951db: call     0x182104110 ; Torappu.GridPosition.op_Inequality [28052]
00000001808951e0: test     al, al
00000001808951e2: je       0x1808951f7
00000001808951e4: mov      rdx, qword ptr [rbp + 0x77]
00000001808951e8: xor      r8d, r8d
00000001808951eb: mov      rcx, rsi
00000001808951ee: call     0x180897510 ; Torappu.Battle.DirectionCursor._GetNextGrid [70290]
00000001808951f3: mov      qword ptr [rsi + 0x70], rax
00000001808951f7: mov      rdx, qword ptr [rsi + 0x60]
00000001808951fb: test     rdx, rdx
00000001808951fe: je       0x180895682
0000000180895204: mov      rax, qword ptr [rdx + 0x10]
0000000180895208: movsxd   r8, dword ptr [rsi + 0x70]
000000018089520c: movsxd   rcx, dword ptr [rsi + 0x74]
0000000180895210: cmp      r8d, dword ptr [rax]
0000000180895213: jae      0x180895688
0000000180895219: mov      r9, qword ptr [rax + 0x10]
000000018089521d: cmp      ecx, r9d
0000000180895220: jae      0x180895688
0000000180895226: mov      rax, r8
0000000180895229: imul     rax, r9
000000018089522d: add      rax, rdx
0000000180895230: cmp      byte ptr [rcx + rax + 0x20], 0
0000000180895235: jne      0x1808952e8
000000018089523b: mov      rcx, qword ptr [rip + 0x802fd46] ; TypeInfo Torappu.GridPosition @0x1888c4f88
0000000180895242: cmp      dword ptr [rcx + 0xe0], 0
0000000180895249: jne      0x180895250
000000018089524b: call     0x18048c140
0000000180895250: lea      rcx, [rsi + 0x70]
0000000180895254: xor      edx, edx
0000000180895256: call     0x182104010 ; Torappu.GridPosition.get_asLocalPosition [28039]
000000018089525b: mov      rcx, qword ptr [rip + 0x802e9d6] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180895262: movq     xmm7, rax
0000000180895267: cmp      dword ptr [rcx + 0xe0], 0
000000018089526e: jne      0x180895275
0000000180895270: call     0x18048c140
0000000180895275: movss    xmm2, dword ptr [rip + 0x65ab9ff]
000000018089527d: xor      r9d, r9d
0000000180895280: movq     rdx, xmm7
0000000180895285: movq     rcx, xmm6
000000018089528a: call     0x1866e3dc0 ; Torappu.MathUtil.CheckDistance [220420]
000000018089528f: test     al, al
0000000180895291: je       0x180895197
0000000180895297: mov      rdx, qword ptr [rsi + 0x60]
000000018089529b: test     rdx, rdx
000000018089529e: je       0x180895682
00000001808952a4: mov      rax, qword ptr [rdx + 0x10]
00000001808952a8: movsxd   r8, dword ptr [rsi + 0x70]
00000001808952ac: movsxd   rcx, dword ptr [rsi + 0x74]
00000001808952b0: cmp      r8d, dword ptr [rax]
00000001808952b3: jae      0x180895688
00000001808952b9: mov      r9, qword ptr [rax + 0x10]
00000001808952bd: cmp      ecx, r9d
00000001808952c0: jae      0x180895688
00000001808952c6: mov      rax, r8
00000001808952c9: imul     rax, r9
00000001808952cd: add      rax, rdx
00000001808952d0: mov      byte ptr [rcx + rax + 0x20], 1
00000001808952d5: mov      rdx, qword ptr [rsi + 0x70]
00000001808952d9: xor      r8d, r8d
00000001808952dc: mov      rcx, rsi
00000001808952df: call     0x180897510 ; Torappu.Battle.DirectionCursor._GetNextGrid [70290]
00000001808952e4: mov      qword ptr [rsi + 0x70], rax
00000001808952e8: mov      rax, qword ptr [rsi + 0x10]
00000001808952ec: mov      edx, dword ptr [rsi + 0x18]
00000001808952ef: test     rax, rax
00000001808952f2: je       0x180895682
00000001808952f8: movss    xmm7, dword ptr [rbp - 0x35]
00000001808952fd: movss    xmm8, dword ptr [rbp - 0x39]
0000000180895303: mov      rcx, qword ptr [rax + 0x30]
0000000180895307: test     rcx, rcx
000000018089530a: je       0x180895682
0000000180895310: cmp      edx, dword ptr [rcx + 0x18]
0000000180895313: jge      0x18089554e
0000000180895319: mov      rbx, qword ptr [rsi + 0x28]
000000018089531d: test     rbx, rbx
0000000180895320: je       0x180895682
0000000180895326: movsxd   rax, dword ptr [rsi + 0x18]
000000018089532a: cmp      eax, dword ptr [rbx + 0x18]
000000018089532d: jae      0x180895688
0000000180895333: mov      rbx, qword ptr [rbx + rax*8 + 0x20]
0000000180895338: test     rbx, rbx
000000018089533b: je       0x180895682
0000000180895341: cmp      byte ptr [rip + 0x84374a8], 0
0000000180895348: jbe      0x180895352
000000018089534a: mov      rcx, qword ptr [rbx]
000000018089534d: call     0x180446d00
0000000180895352: mov      r8, qword ptr [rbx]
0000000180895355: movq     rdx, xmm9
000000018089535a: mov      rcx, rbx
000000018089535d: mov      rax, qword ptr [r8 + 0x190]
0000000180895364: mov      r8, qword ptr [r8 + 0x198]
000000018089536b: call     rax
000000018089536d: cmp      byte ptr [rip + 0x843747c], 0
0000000180895374: movq     xmm6, rax
0000000180895379: jbe      0x180895383
000000018089537b: mov      rcx, qword ptr [rbx]
000000018089537e: call     0x180446d00
0000000180895383: mov      r8, qword ptr [rbx]
0000000180895386: movq     rdx, xmm9
000000018089538b: mov      rcx, rbx
000000018089538e: mov      rax, qword ptr [r8 + 0x1b0]
0000000180895395: mov      r8, qword ptr [r8 + 0x1b8]
000000018089539c: call     rax
000000018089539e: test     al, al
00000001808953a0: je       0x180895513
00000001808953a6: mov      ecx, 4
00000001808953ab: mov      rdx, rbx
00000001808953ae: call     0x180005610
00000001808953b3: test     al, al
00000001808953b5: je       0x1808953db
00000001808953b7: xor      edx, edx
00000001808953b9: mov      rcx, rsi
00000001808953bc: call     0x180894ed0 ; Torappu.Battle.DirectionCursor.GetLocatorPosition [70291]
00000001808953c1: mov      qword ptr [rbp + 0x7f], rax
00000001808953c5: movss    xmm8, dword ptr [rbp + 0x7f]
00000001808953cb: movss    xmm7, dword ptr [rbp + 0x83]
00000001808953d3: movaps   xmm9, xmm8
00000001808953d7: unpcklps xmm9, xmm7
00000001808953db: xor      edx, edx
00000001808953dd: mov      rcx, rsi
00000001808953e0: call     0x180876920 ; Torappu.Battle.BasicCursor._MoveNext [70163]
00000001808953e5: mov      rax, qword ptr [rsi + 0x10]
00000001808953e9: mov      edx, dword ptr [rsi + 0x18]
00000001808953ec: test     rax, rax
00000001808953ef: je       0x180895682
00000001808953f5: jmp      0x180895303
00000001808953fa: mov      rdx, qword ptr [rsi + 0x60]
00000001808953fe: test     rdx, rdx
0000000180895401: je       0x180895682
0000000180895407: mov      rax, qword ptr [rdx + 0x10]
000000018089540b: movsxd   r9, dword ptr [rbp + 0x77]
000000018089540f: movsxd   r8, dword ptr [rbp + 0x7b]
0000000180895413: cmp      r9d, dword ptr [rax]
0000000180895416: jae      0x180895688
000000018089541c: mov      rcx, qword ptr [rax + 0x10]
0000000180895420: cmp      r8d, ecx
0000000180895423: jae      0x180895688
0000000180895429: imul     rcx, r9
000000018089542d: add      rcx, r8
0000000180895430: cmp      byte ptr [rcx + rdx + 0x20], 0
0000000180895435: jne      0x1808952e8
000000018089543b: mov      rcx, qword ptr [rip + 0x802fb46] ; TypeInfo Torappu.GridPosition @0x1888c4f88
0000000180895442: cmp      dword ptr [rcx + 0xe0], 0
0000000180895449: jne      0x180895450
000000018089544b: call     0x18048c140
0000000180895450: xor      edx, edx
0000000180895452: lea      rcx, [rbp + 0x77]
0000000180895456: call     0x182104010 ; Torappu.GridPosition.get_asLocalPosition [28039]
000000018089545b: mov      rcx, qword ptr [rip + 0x802e7d6] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180895462: movq     xmm7, rax
0000000180895467: cmp      dword ptr [rcx + 0xe0], 0
000000018089546e: jne      0x180895475
0000000180895470: call     0x18048c140
0000000180895475: movss    xmm2, dword ptr [rip + 0x65ab7ff]
000000018089547d: xor      r9d, r9d
0000000180895480: movq     rdx, xmm7
0000000180895485: movq     rcx, xmm6
000000018089548a: call     0x1866e3dc0 ; Torappu.MathUtil.CheckDistance [220420]
000000018089548f: test     al, al
0000000180895491: je       0x1808954d3
0000000180895493: mov      rdx, qword ptr [rsi + 0x60]
0000000180895497: test     rdx, rdx
000000018089549a: je       0x180895682
00000001808954a0: mov      rax, qword ptr [rdx + 0x10]
00000001808954a4: movsxd   r9, dword ptr [rbp + 0x77]
00000001808954a8: movsxd   r8, dword ptr [rbp + 0x7b]
00000001808954ac: cmp      r9d, dword ptr [rax]
00000001808954af: jae      0x180895688
00000001808954b5: mov      rcx, qword ptr [rax + 0x10]
00000001808954b9: cmp      r8d, ecx
00000001808954bc: jae      0x180895688
00000001808954c2: imul     rcx, r9
00000001808954c6: add      rcx, r8
00000001808954c9: mov      byte ptr [rcx + rdx + 0x20], 1
00000001808954ce: jmp      0x1808952e8
00000001808954d3: mov      rcx, qword ptr [rip + 0x802faae] ; TypeInfo Torappu.GridPosition @0x1888c4f88
00000001808954da: cmp      dword ptr [rcx + 0xe0], 0
00000001808954e1: jne      0x1808954e8
00000001808954e3: call     0x18048c140
00000001808954e8: lea      rcx, [rbp + 0x77]
00000001808954ec: xor      edx, edx
00000001808954ee: call     0x182104010 ; Torappu.GridPosition.get_asLocalPosition [28039]
00000001808954f3: mov      qword ptr [rbp - 0x39], rax
00000001808954f7: movss    xmm0, dword ptr [rbp - 0x39]
00000001808954fc: movss    xmm1, dword ptr [rbp - 0x35]
0000000180895501: subss    xmm0, dword ptr [rbp + 0x7f]
0000000180895506: subss    xmm1, dword ptr [rbp + 0x83]
000000018089550e: jmp      0x180895624
0000000180895513: movq     rax, xmm6
0000000180895518: movaps   xmm8, xmmword ptr [rsp + 0x70]
000000018089551e: movaps   xmm7, xmmword ptr [rsp + 0x80]
0000000180895526: mov      rdi, qword ptr [rsp + 0xa0]
000000018089552e: mov      rbx, qword ptr [rsp + 0xc0]
0000000180895536: movaps   xmm6, xmmword ptr [rsp + 0x90]
000000018089553e: movaps   xmm9, xmmword ptr [rsp + 0x60]
0000000180895544: add      rsp, 0xa8
000000018089554b: pop      rsi
000000018089554c: pop      rbp
000000018089554d: ret      
000000018089554e: mov      rcx, qword ptr [rsi + 0x10]
0000000180895552: test     rcx, rcx
0000000180895555: je       0x180895682
000000018089555b: mov      rcx, qword ptr [rcx + 0x28]
000000018089555f: test     rcx, rcx
0000000180895562: je       0x180895682
0000000180895568: mov      rax, qword ptr [rcx + 0x10]
000000018089556c: movsxd   r9, dword ptr [rbp + 0x77]
0000000180895570: movsxd   r8, dword ptr [rbp + 0x7b]
0000000180895574: cmp      r9d, dword ptr [rax]
0000000180895577: jae      0x180895688
000000018089557d: mov      rdx, qword ptr [rax + 0x10]
0000000180895581: cmp      r8d, edx
0000000180895584: jae      0x180895688
000000018089558a: imul     rdx, r9
000000018089558e: add      rdx, r8
0000000180895591: lea      rax, [rdx + rdx*2]
0000000180895595: add      rax, rax
0000000180895598: cmp      byte ptr [rip + 0x83fbf8f], 0
000000018089559f: movups   xmm0, xmmword ptr [rcx + rax*8 + 0x20]
00000001808955a4: movups   xmmword ptr [rbp - 0x31], xmm0
00000001808955a8: movups   xmm1, xmmword ptr [rcx + rax*8 + 0x30]
00000001808955ad: movups   xmmword ptr [rbp - 0x21], xmm1
00000001808955b1: movups   xmm0, xmmword ptr [rcx + rax*8 + 0x40]
00000001808955b6: movups   xmmword ptr [rbp - 0x11], xmm0
00000001808955ba: jne      0x1808955cf
00000001808955bc: lea      rcx, [rip + 0x809d725] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808955c3: call     0x18048bf00
00000001808955c8: mov      byte ptr [rip + 0x83fbf5f], 1
00000001808955cf: cmp      dword ptr [rbp - 0xd], 0
00000001808955d3: jl       0x18089563c
00000001808955d5: mov      rcx, qword ptr [rip + 0x809d70c] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808955dc: mov      rbx, qword ptr [rbp - 0x29]
00000001808955e0: cmp      dword ptr [rcx + 0xe0], 0
00000001808955e7: jne      0x1808955ee
00000001808955e9: call     0x18048c140
00000001808955ee: xor      r8d, r8d
00000001808955f1: xor      edx, edx
00000001808955f3: mov      rcx, rbx
00000001808955f6: call     0x186b63a70
00000001808955fb: test     al, al
00000001808955fd: je       0x18089563c
00000001808955ff: xor      edx, edx
0000000180895601: lea      rcx, [rbp - 0x31]
0000000180895605: call     0x1808a0b20 ; Torappu.Battle.Route.Node.GetSafeNextPosition [70389]
000000018089560a: mov      qword ptr [rbp + 0x7f], rax
000000018089560e: movss    xmm0, dword ptr [rbp + 0x7f]
0000000180895613: movss    xmm1, dword ptr [rbp + 0x83]
000000018089561b: subss    xmm0, xmm8
0000000180895620: subss    xmm1, xmm7
0000000180895624: unpcklps xmm0, xmm1
0000000180895627: lea      rcx, [rbp + 0x7f]
000000018089562b: xor      edx, edx
000000018089562d: movsd    qword ptr [rbp + 0x7f], xmm0
0000000180895632: call     0x180535530
0000000180895637: jmp      0x180895518
000000018089563c: xor      ecx, ecx
000000018089563e: call     0x1805073b0 ; Torappu.Battle.BasicCursor.DisappearCheckpoint.GetNextDirection [70205] | Torappu.Battle.BasicCursor.AppearAtPosCheckpoint.GetNextDirection [70214] | Torappu.Battle.BasicCursor.WaitForSecondsCheckpoint.GetNextDirection [70219] | Torappu.Battle.BasicCursor.WaitForPlayTimeCheckpoint.GetNextDirection [70228] | Torappu.Battle.BasicCursor.WaitCurrentWaveTimeCheckpoint.GetNextDirection [70234] | Torappu.Battle.BasicCursor.WaitCurrentFragmentTimeCheckpoint.GetNextDirection [70240] | Torappu.Battle.BasicCursor.AlertCheckpoint.GetNextDirection [70245] | Torappu.Battle.BasicCursor.WaitBossrushWaveCheckPoint.GetNextDirection [70254]
0000000180895643: jmp      0x180895518
0000000180895648: mov      rcx, qword ptr [rip + 0x804aaf9] ; GenericMethodInfo 282061 @0x1888e0148
000000018089564f: call     0x185337c50
0000000180895654: test     rax, rax
0000000180895657: je       0x180895682
0000000180895659: mov      rdx, qword ptr [rbp + 0x77]
000000018089565d: xor      r8d, r8d
0000000180895660: mov      rcx, rax
0000000180895663: call     0x18087c0d0 ; Torappu.Battle.Map.GetDirectionToGoBackFromInvalidPos [70085]
0000000180895668: jmp      0x180895518
000000018089566d: xor      r8d, r8d
0000000180895670: mov      rdx, rsi
0000000180895673: call     0x1835c4140 ; XLua.DelegateBridge.__Gen_Delegate_Imp72 [2727]
0000000180895678: add      rsp, 0xa8
000000018089567f: pop      rsi
0000000180895680: pop      rbp
0000000180895681: ret      
0000000180895682: call     0x18048c0b0
0000000180895687: int3     
0000000180895688: call     0x18048c0a0
000000018089568d: int3     
000000018089568e: int3     
000000018089568f: int3     
