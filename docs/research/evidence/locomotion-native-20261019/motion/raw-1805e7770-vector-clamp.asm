; Direct native helper called by MoveController. Metadata mapping unresolved; decoded behavior is vector magnitude clamp.
; VA=0x1805e7770 size=0x100
00000001805e7770: sub      rsp, 0x78
00000001805e7774: cmp      byte ptr [rip + 0x86a872d], 0
00000001805e777b: movaps   xmmword ptr [rsp + 0x60], xmm6
00000001805e7780: movaps   xmmword ptr [rsp + 0x50], xmm7
00000001805e7785: movq     xmm7, rcx
00000001805e778a: movaps   xmmword ptr [rsp + 0x40], xmm8
00000001805e7790: movaps   xmmword ptr [rsp + 0x30], xmm9
00000001805e7796: movaps   xmmword ptr [rsp + 0x20], xmm10
00000001805e779c: movaps   xmm10, xmm1
00000001805e77a0: movsd    qword ptr [rsp + 0x98], xmm7
00000001805e77a9: jne      0x1805e77be
00000001805e77ab: lea      rcx, [rip + 0x82dc00e]
00000001805e77b2: call     0x18048bf00
00000001805e77b7: mov      byte ptr [rip + 0x86a86ea], 1
00000001805e77be: movss    xmm9, dword ptr [rsp + 0x9c]
00000001805e77c8: movss    xmm8, dword ptr [rsp + 0x98]
00000001805e77d2: movaps   xmm6, xmm9
00000001805e77d6: movaps   xmm0, xmm8
00000001805e77da: mulss    xmm6, xmm9
00000001805e77df: mulss    xmm0, xmm8
00000001805e77e4: addss    xmm6, xmm0
00000001805e77e8: movaps   xmm0, xmm10
00000001805e77ec: mulss    xmm0, xmm10
00000001805e77f1: comiss   xmm6, xmm0
00000001805e77f4: ja       0x1805e77fd
00000001805e77f6: movq     rax, xmm7
00000001805e77fb: jmp      0x1805e784d
00000001805e77fd: mov      rcx, qword ptr [rip + 0x82dbfbc]
00000001805e7804: cmp      dword ptr [rcx + 0xe0], 0
00000001805e780b: jne      0x1805e7812
00000001805e780d: call     0x18048c140
00000001805e7812: cvtps2pd xmm1, xmm6
00000001805e7815: xorps    xmm0, xmm0
00000001805e7818: ucomisd  xmm0, xmm1
00000001805e781c: ja       0x1805e7824
00000001805e781e: sqrtpd   xmm0, xmm1
00000001805e7822: jmp      0x1805e782c
00000001805e7824: movaps   xmm0, xmm1
00000001805e7827: call     0x1804d2720
00000001805e782c: cvtsd2ss xmm0, xmm0
00000001805e7830: divss    xmm8, xmm0
00000001805e7835: divss    xmm9, xmm0
00000001805e783a: mulss    xmm8, xmm10
00000001805e783f: mulss    xmm9, xmm10
00000001805e7844: unpcklps xmm8, xmm9
00000001805e7848: movq     rax, xmm8
00000001805e784d: movaps   xmm6, xmmword ptr [rsp + 0x60]
00000001805e7852: movaps   xmm7, xmmword ptr [rsp + 0x50]
00000001805e7857: movaps   xmm8, xmmword ptr [rsp + 0x40]
00000001805e785d: movaps   xmm9, xmmword ptr [rsp + 0x30]
00000001805e7863: movaps   xmm10, xmmword ptr [rsp + 0x20]
00000001805e7869: add      rsp, 0x78
00000001805e786d: ret      
00000001805e786e: int3     
00000001805e786f: int3     
