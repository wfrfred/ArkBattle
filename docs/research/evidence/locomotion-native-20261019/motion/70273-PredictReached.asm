; Torappu.Battle.DirectionCursor.PredictReached metadata=70273 token=0x6011282 VA=0x180896590 RVA=0x896590 size=0x190
0000000180896590: mov      qword ptr [rsp + 8], rbx
0000000180896595: mov      qword ptr [rsp + 0x10], rsi
000000018089659a: push     rdi
000000018089659b: sub      rsp, 0x70
000000018089659f: cmp      byte ptr [rip + 0x83faf3a], 0
00000001808965a6: mov      rdi, r9
00000001808965a9: movaps   xmmword ptr [rsp + 0x50], xmm7
00000001808965ae: mov      rsi, r8
00000001808965b1: movaps   xmm7, xmm1
00000001808965b4: mov      rbx, rcx
00000001808965b7: jne      0x1808965d8
00000001808965b9: lea      rcx, [rip + 0x80d6b38] ; TypeInfo Torappu.Battle.DirectionCursor @0x18896d0f8
00000001808965c0: call     0x18048bf00
00000001808965c5: lea      rcx, [rip + 0x802d66c] ; TypeInfo Torappu.MathUtil @0x1888c3c38
00000001808965cc: call     0x18048bf00
00000001808965d1: mov      byte ptr [rip + 0x83faf08], 1
00000001808965d8: mov      rax, qword ptr [rip + 0x80d6b19] ; TypeInfo Torappu.Battle.DirectionCursor @0x18896d0f8
00000001808965df: mov      rdx, qword ptr [rax + 0xb8]
00000001808965e6: mov      rcx, qword ptr [rdx + 0x60]
00000001808965ea: test     rcx, rcx
00000001808965ed: jne      0x1808966e9
00000001808965f3: movaps   xmmword ptr [rsp + 0x60], xmm6
00000001808965f8: movaps   xmmword ptr [rsp + 0x40], xmm8
00000001808965fe: xor      edx, edx
0000000180896600: mov      rcx, rbx
0000000180896603: call     0x180894ed0 ; Torappu.Battle.DirectionCursor.GetLocatorPosition [70291]
0000000180896608: cmp      byte ptr [rip + 0x84361e1], 0
000000018089660f: mov      qword ptr [rsp + 0x38], rax
0000000180896614: jbe      0x18089661e
0000000180896616: mov      rcx, qword ptr [rbx]
0000000180896619: call     0x180446d00
000000018089661e: mov      rdx, qword ptr [rbx]
0000000180896621: mov      rcx, rbx
0000000180896624: mov      rax, qword ptr [rdx + 0x1f0]
000000018089662b: mov      rdx, qword ptr [rdx + 0x1f8]
0000000180896632: call     rax
0000000180896634: mov      qword ptr [rsp + 0x30], rax
0000000180896639: movss    xmm6, dword ptr [rsp + 0x30]
000000018089663f: movss    xmm8, dword ptr [rsp + 0x34]
0000000180896646: movaps   xmm0, xmm6
0000000180896649: subss    xmm0, dword ptr [rbx + 0x68]
000000018089664e: movaps   xmm1, xmm8
0000000180896652: subss    xmm1, dword ptr [rbx + 0x6c]
0000000180896657: unpcklps xmm0, xmm1
000000018089665a: movsd    qword ptr [rdi], xmm0
000000018089665e: movaps   xmm1, xmm6
0000000180896661: lea      rcx, [rsp + 0x30]
0000000180896666: subss    xmm1, dword ptr [rsp + 0x38]
000000018089666c: movaps   xmm0, xmm8
0000000180896670: xor      edx, edx
0000000180896672: subss    xmm0, dword ptr [rsp + 0x3c]
0000000180896678: movss    dword ptr [rsp + 0x30], xmm1
000000018089667e: movss    dword ptr [rsp + 0x34], xmm0
0000000180896684: call     0x180535530
0000000180896689: xor      edx, edx
000000018089668b: mov      qword ptr [rsi], rax
000000018089668e: mov      rcx, rbx
0000000180896691: call     0x180894ed0 ; Torappu.Battle.DirectionCursor.GetLocatorPosition [70291]
0000000180896696: mov      qword ptr [rsp + 0x38], rax
000000018089669b: subss    xmm6, dword ptr [rsp + 0x38]
00000001808966a1: subss    xmm8, dword ptr [rsp + 0x3c]
00000001808966a8: mov      rcx, qword ptr [rip + 0x802d589] ; TypeInfo Torappu.MathUtil @0x1888c3c38
00000001808966af: mulss    xmm6, xmm6
00000001808966b3: mulss    xmm8, xmm8
00000001808966b8: cmp      dword ptr [rcx + 0xe0], 0
00000001808966bf: addss    xmm8, xmm6
00000001808966c4: movaps   xmm6, xmmword ptr [rsp + 0x60]
00000001808966c9: jne      0x1808966d0
00000001808966cb: call     0x18048c140
00000001808966d0: xor      edx, edx
00000001808966d2: movaps   xmm0, xmm7
00000001808966d5: call     0x1866e6db0
00000001808966da: comiss   xmm0, xmm8
00000001808966de: movaps   xmm8, xmmword ptr [rsp + 0x40]
00000001808966e4: setae    al
00000001808966e7: jmp      0x180896705
00000001808966e9: mov      qword ptr [rsp + 0x28], 0
00000001808966f2: mov      r9, rsi
00000001808966f5: movaps   xmm2, xmm7
00000001808966f8: mov      qword ptr [rsp + 0x20], rdi
00000001808966fd: mov      rdx, rbx
0000000180896700: call     0x183363850 ; XLua.DelegateBridge.__Gen_Delegate_Imp3334 [5989]
0000000180896705: movaps   xmm7, xmmword ptr [rsp + 0x50]
000000018089670a: lea      r11, [rsp + 0x70]
000000018089670f: mov      rbx, qword ptr [r11 + 0x10]
0000000180896713: mov      rsi, qword ptr [r11 + 0x18]
0000000180896717: mov      rsp, r11
000000018089671a: pop      rdi
000000018089671b: ret      
000000018089671c: int3     
000000018089671d: int3     
000000018089671e: int3     
000000018089671f: int3     
