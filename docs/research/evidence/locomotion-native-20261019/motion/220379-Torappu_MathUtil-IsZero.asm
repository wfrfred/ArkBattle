; Torappu.MathUtil.IsZero metadata=220379 token=0x60002a5 VA=0x1866e5600 RVA=0x66e5600 size=0x20
00000001866e5600: xorps    xmm1, xmm1
00000001866e5603: comisd   xmm1, xmm0
00000001866e5607: jbe      0x1866e5610
00000001866e5609: xorps    xmm0, xmmword ptr [rip + 0x7718b0]
00000001866e5610: movsd    xmm1, qword ptr [rip + 0x7693f8]
00000001866e5618: comisd   xmm1, xmm0
00000001866e561c: setae    al
00000001866e561f: ret      
