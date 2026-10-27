; UnityEngine.Vector2.get_normalized metadata=282407 token=0x600083a VA=0x180535530 RVA=0x535530 size=0xe0
0000000180535530: sub      rsp, 0x48
0000000180535534: cmp      byte ptr [rip + 0x875a254], 0
000000018053553b: movaps   xmmword ptr [rsp + 0x30], xmm6
0000000180535540: movss    xmm6, dword ptr [rcx]
0000000180535544: movaps   xmmword ptr [rsp + 0x20], xmm7
0000000180535549: movss    xmm7, dword ptr [rcx + 4]
000000018053554e: jne      0x180535563
0000000180535550: lea      rcx, [rip + 0x838e269] ; TypeInfo System.Math @0x1888c37c0
0000000180535557: call     0x18048bf00
000000018053555c: mov      byte ptr [rip + 0x875a22c], 1
0000000180535563: mov      rcx, qword ptr [rip + 0x838e256] ; TypeInfo System.Math @0x1888c37c0
000000018053556a: cmp      dword ptr [rcx + 0xe0], 0
0000000180535571: jne      0x180535578
0000000180535573: call     0x18048c140
0000000180535578: movaps   xmm1, xmm7
000000018053557b: movaps   xmm0, xmm6
000000018053557e: mulss    xmm1, xmm7
0000000180535582: mulss    xmm0, xmm6
0000000180535586: addss    xmm1, xmm0
000000018053558a: xorps    xmm0, xmm0
000000018053558d: cvtps2pd xmm2, xmm1
0000000180535590: ucomisd  xmm0, xmm2
0000000180535594: ja       0x18053559c
0000000180535596: sqrtpd   xmm0, xmm2
000000018053559a: jmp      0x1805355a4
000000018053559c: movaps   xmm0, xmm2
000000018053559f: call     0x1804d2720
00000001805355a4: cvtsd2ss xmm0, xmm0
00000001805355a8: comiss   xmm0, dword ptr [rip + 0x690a7d9]
00000001805355af: ja       0x1805355e6
00000001805355b1: cmp      byte ptr [rip + 0x8759ffd], 0
00000001805355b8: jne      0x1805355cd
00000001805355ba: lea      rcx, [rip + 0x82f35ff] ; TypeInfo UnityEngine.Vector2 @0x188828bc0
00000001805355c1: call     0x18048bf00
00000001805355c6: mov      byte ptr [rip + 0x8759fe8], 1
00000001805355cd: mov      rax, qword ptr [rip + 0x82f35ec] ; TypeInfo UnityEngine.Vector2 @0x188828bc0
00000001805355d4: mov      rcx, qword ptr [rax + 0xb8]
00000001805355db: movss    xmm6, dword ptr [rcx]
00000001805355df: movss    xmm7, dword ptr [rcx + 4]
00000001805355e4: jmp      0x1805355ee
00000001805355e6: divss    xmm6, xmm0
00000001805355ea: divss    xmm7, xmm0
00000001805355ee: unpcklps xmm6, xmm7
00000001805355f1: movaps   xmm7, xmmword ptr [rsp + 0x20]
00000001805355f6: movq     rax, xmm6
00000001805355fb: movaps   xmm6, xmmword ptr [rsp + 0x30]
0000000180535600: add      rsp, 0x48
0000000180535604: ret      
0000000180535605: int3     
0000000180535606: int3     
0000000180535607: int3     
0000000180535608: int3     
0000000180535609: int3     
000000018053560a: int3     
000000018053560b: int3     
000000018053560c: int3     
000000018053560d: int3     
000000018053560e: int3     
000000018053560f: int3     
