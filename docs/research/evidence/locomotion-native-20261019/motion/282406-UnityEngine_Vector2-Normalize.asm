; UnityEngine.Vector2.Normalize metadata=282406 token=0x6000839 VA=0x1805353f0 RVA=0x5353f0 size=0x140
00000001805353f0: push     rbx
00000001805353f2: sub      rsp, 0x20
00000001805353f6: xor      edx, edx
00000001805353f8: mov      rbx, rcx
00000001805353fb: call     0x180535480
0000000180535400: comiss   xmm0, dword ptr [rip + 0x690a981]
0000000180535407: ja       0x180535452
0000000180535409: cmp      byte ptr [rip + 0x875a1a5], 0
0000000180535410: jne      0x180535425
0000000180535412: lea      rcx, [rip + 0x82f37a7] ; TypeInfo UnityEngine.Vector2 @0x188828bc0
0000000180535419: call     0x18048bf00
000000018053541e: mov      byte ptr [rip + 0x875a190], 1
0000000180535425: mov      rax, qword ptr [rip + 0x82f3794] ; TypeInfo UnityEngine.Vector2 @0x188828bc0
000000018053542c: mov      rcx, qword ptr [rax + 0xb8]
0000000180535433: movss    xmm1, dword ptr [rcx + 4]
0000000180535438: movss    xmm0, dword ptr [rcx]
000000018053543c: unpcklps xmm0, xmm1
000000018053543f: movss    dword ptr [rbx], xmm0
0000000180535443: shufps   xmm0, xmm0, 0x55
0000000180535447: movss    dword ptr [rbx + 4], xmm0
000000018053544c: add      rsp, 0x20
0000000180535450: pop      rbx
0000000180535451: ret      
0000000180535452: movsd    xmm2, qword ptr [rbx]
0000000180535456: movss    xmm1, dword ptr [rbx + 4]
000000018053545b: divss    xmm2, xmm0
000000018053545f: divss    xmm1, xmm0
0000000180535463: movaps   xmm0, xmm2
0000000180535466: unpcklps xmm0, xmm1
0000000180535469: movss    dword ptr [rbx], xmm0
000000018053546d: shufps   xmm0, xmm0, 0x55
0000000180535471: movss    dword ptr [rbx + 4], xmm0
0000000180535476: add      rsp, 0x20
000000018053547a: pop      rbx
000000018053547b: ret      
000000018053547c: int3     
000000018053547d: int3     
000000018053547e: int3     
000000018053547f: int3     
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
