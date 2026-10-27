; UnityEngine.Vector2.ClampMagnitude metadata=282422 token=0x6000849 VA=0x186b53e50 RVA=0x6b53e50 size=0x100
0000000186b53e50: sub      rsp, 0x78
0000000186b53e54: cmp      byte ptr [rip + 0x21739e3], 0
0000000186b53e5b: movaps   xmmword ptr [rsp + 0x60], xmm6
0000000186b53e60: movaps   xmmword ptr [rsp + 0x50], xmm7
0000000186b53e65: movq     xmm7, rcx
0000000186b53e6a: movaps   xmmword ptr [rsp + 0x40], xmm8
0000000186b53e70: movaps   xmmword ptr [rsp + 0x30], xmm9
0000000186b53e76: movaps   xmmword ptr [rsp + 0x20], xmm10
0000000186b53e7c: movaps   xmm10, xmm1
0000000186b53e80: movsd    qword ptr [rsp + 0x98], xmm7
0000000186b53e89: jne      0x186b53e9e
0000000186b53e8b: lea      rcx, [rip + 0x1d6f92e] ; TypeInfo System.Math @0x1888c37c0
0000000186b53e92: call     0x18048bf00
0000000186b53e97: mov      byte ptr [rip + 0x21739a0], 1
0000000186b53e9e: movss    xmm9, dword ptr [rsp + 0x9c]
0000000186b53ea8: movss    xmm8, dword ptr [rsp + 0x98]
0000000186b53eb2: movaps   xmm6, xmm9
0000000186b53eb6: movaps   xmm0, xmm8
0000000186b53eba: mulss    xmm6, xmm9
0000000186b53ebf: mulss    xmm0, xmm8
0000000186b53ec4: addss    xmm6, xmm0
0000000186b53ec8: movaps   xmm0, xmm10
0000000186b53ecc: mulss    xmm0, xmm10
0000000186b53ed1: comiss   xmm6, xmm0
0000000186b53ed4: ja       0x186b53edd
0000000186b53ed6: movq     rax, xmm7
0000000186b53edb: jmp      0x186b53f2d
0000000186b53edd: mov      rcx, qword ptr [rip + 0x1d6f8dc] ; TypeInfo System.Math @0x1888c37c0
0000000186b53ee4: cmp      dword ptr [rcx + 0xe0], 0
0000000186b53eeb: jne      0x186b53ef2
0000000186b53eed: call     0x18048c140
0000000186b53ef2: cvtps2pd xmm1, xmm6
0000000186b53ef5: xorps    xmm0, xmm0
0000000186b53ef8: ucomisd  xmm0, xmm1
0000000186b53efc: ja       0x186b53f04
0000000186b53efe: sqrtpd   xmm0, xmm1
0000000186b53f02: jmp      0x186b53f0c
0000000186b53f04: movaps   xmm0, xmm1
0000000186b53f07: call     0x1804d2720
0000000186b53f0c: cvtsd2ss xmm0, xmm0
0000000186b53f10: divss    xmm8, xmm0
0000000186b53f15: divss    xmm9, xmm0
0000000186b53f1a: mulss    xmm8, xmm10
0000000186b53f1f: mulss    xmm9, xmm10
0000000186b53f24: unpcklps xmm8, xmm9
0000000186b53f28: movq     rax, xmm8
0000000186b53f2d: movaps   xmm6, xmmword ptr [rsp + 0x60]
0000000186b53f32: movaps   xmm7, xmmword ptr [rsp + 0x50]
0000000186b53f37: movaps   xmm8, xmmword ptr [rsp + 0x40]
0000000186b53f3d: movaps   xmm9, xmmword ptr [rsp + 0x30]
0000000186b53f43: movaps   xmm10, xmmword ptr [rsp + 0x20]
0000000186b53f49: add      rsp, 0x78
0000000186b53f4d: ret      
0000000186b53f4e: int3     
0000000186b53f4f: int3     
