; Torappu.MathUtil.IsZero metadata=220378 token=0x60002a4 VA=0x1866e54e0 RVA=0x66e54e0 size=0x20
00000001866e54e0: xorps    xmm1, xmm1
00000001866e54e3: comiss   xmm1, xmm0
00000001866e54e6: jbe      0x1866e54ef
00000001866e54e8: xorps    xmm0, xmmword ptr [rip + 0x75a911]
00000001866e54ef: movss    xmm1, dword ptr [rip + 0x75a891]
00000001866e54f7: comiss   xmm1, xmm0
00000001866e54fa: setae    al
00000001866e54fd: ret      
00000001866e54fe: int3     
00000001866e54ff: int3     
