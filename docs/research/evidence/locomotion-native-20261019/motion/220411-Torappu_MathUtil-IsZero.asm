; Torappu.MathUtil.IsZero metadata=220411 token=0x60002c5 VA=0x1866e5620 RVA=0x66e5620 size=0xc0
00000001866e5620: sub      rsp, 0x48
00000001866e5624: cmp      byte ptr [rip + 0x25de0fd], 0
00000001866e562b: movaps   xmmword ptr [rsp + 0x30], xmm7
00000001866e5630: movaps   xmmword ptr [rsp + 0x20], xmm8
00000001866e5636: mov      qword ptr [rsp + 0x60], rcx
00000001866e563b: jne      0x1866e5650
00000001866e563d: lea      rcx, [rip + 0x21de5f4] ; TypeInfo Torappu.MathUtil @0x1888c3c38
00000001866e5644: call     0x18048bf00
00000001866e5649: mov      byte ptr [rip + 0x25de0d8], 1
00000001866e5650: mov      rcx, qword ptr [rip + 0x21de5e1] ; TypeInfo Torappu.MathUtil @0x1888c3c38
00000001866e5657: cmp      dword ptr [rcx + 0xe0], 0
00000001866e565e: jne      0x1866e566c
00000001866e5660: call     0x18048c140
00000001866e5665: mov      rcx, qword ptr [rip + 0x21de5cc] ; TypeInfo Torappu.MathUtil @0x1888c3c38
00000001866e566c: movss    xmm0, dword ptr [rsp + 0x60]
00000001866e5672: xorps    xmm8, xmm8
00000001866e5676: comiss   xmm8, xmm0
00000001866e567a: jbe      0x1866e5683
00000001866e567c: xorps    xmm0, xmmword ptr [rip + 0x75a77d]
00000001866e5683: movss    xmm7, dword ptr [rip + 0x75a6fd]
00000001866e568b: xor      eax, eax
00000001866e568d: comiss   xmm7, xmm0
00000001866e5690: setb     al
00000001866e5693: test     eax, eax
00000001866e5695: je       0x1866e56a9
00000001866e5697: xor      al, al
00000001866e5699: movaps   xmm7, xmmword ptr [rsp + 0x30]
00000001866e569e: movaps   xmm8, xmmword ptr [rsp + 0x20]
00000001866e56a4: add      rsp, 0x48
00000001866e56a8: ret      
00000001866e56a9: cmp      dword ptr [rcx + 0xe0], 0
00000001866e56b0: jne      0x1866e56b7
00000001866e56b2: call     0x18048c140
00000001866e56b7: movss    xmm0, dword ptr [rsp + 0x64]
00000001866e56bd: comiss   xmm8, xmm0
00000001866e56c1: jbe      0x1866e56ca
00000001866e56c3: xorps    xmm0, xmmword ptr [rip + 0x75a736]
00000001866e56ca: movaps   xmm8, xmmword ptr [rsp + 0x20]
00000001866e56d0: comiss   xmm7, xmm0
00000001866e56d3: movaps   xmm7, xmmword ptr [rsp + 0x30]
00000001866e56d8: setae    al
00000001866e56db: add      rsp, 0x48
00000001866e56df: ret      
