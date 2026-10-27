; Vector2 magnitude native helper; managed alias unresolved VA=0x180535480 size=0xb0
0000000180535480: push     rbx
0000000180535482: sub      rsp, 0x60
0000000180535486: cmp      byte ptr [rip + 0x875a302], 0
000000018053548d: mov      rbx, rcx
0000000180535490: movaps   xmmword ptr [rsp + 0x50], xmm6
0000000180535495: movaps   xmmword ptr [rsp + 0x40], xmm7
000000018053549a: movaps   xmmword ptr [rsp + 0x30], xmm8
00000001805354a0: movaps   xmmword ptr [rsp + 0x20], xmm9
00000001805354a6: jne      0x1805354bb
00000001805354a8: lea      rcx, [rip + 0x838e311] ; TypeInfo System.Math @0x1888c37c0
00000001805354af: call     0x18048bf00
00000001805354b4: mov      byte ptr [rip + 0x875a2d4], 1
00000001805354bb: mov      rcx, qword ptr [rip + 0x838e2fe] ; TypeInfo System.Math @0x1888c37c0
00000001805354c2: movss    xmm8, dword ptr [rbx]
00000001805354c7: movss    xmm9, dword ptr [rbx + 4]
00000001805354cd: movaps   xmm7, xmm8
00000001805354d1: movaps   xmm6, xmm9
00000001805354d5: cmp      dword ptr [rcx + 0xe0], 0
00000001805354dc: jne      0x1805354e3
00000001805354de: call     0x18048c140
00000001805354e3: mulss    xmm6, xmm9
00000001805354e8: xorps    xmm0, xmm0
00000001805354eb: mulss    xmm7, xmm8
00000001805354f0: addss    xmm6, xmm7
00000001805354f4: cvtps2pd xmm1, xmm6
00000001805354f7: ucomisd  xmm0, xmm1
00000001805354fb: ja       0x180535507
00000001805354fd: sqrtpd   xmm0, xmm1
0000000180535501: cvtpd2ps xmm0, xmm0
0000000180535505: jmp      0x180535513
0000000180535507: movaps   xmm0, xmm1
000000018053550a: call     0x1804d2720
000000018053550f: cvtsd2ss xmm0, xmm0
0000000180535513: movaps   xmm6, xmmword ptr [rsp + 0x50]
0000000180535518: movaps   xmm7, xmmword ptr [rsp + 0x40]
000000018053551d: movaps   xmm8, xmmword ptr [rsp + 0x30]
0000000180535523: movaps   xmm9, xmmword ptr [rsp + 0x20]
0000000180535529: add      rsp, 0x60
000000018053552d: pop      rbx
000000018053552e: ret      
000000018053552f: int3     
