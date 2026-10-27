; Torappu.Battle.FilterUtil.generic_filter metadata=-1 token=0x0 VA=0x184511e30 RVA=0x4511e30 size=0x500
0000000184511e30: mov      qword ptr [rsp + 8], rbx
0000000184511e35: mov      qword ptr [rsp + 0x10], rbp
0000000184511e3a: mov      qword ptr [rsp + 0x18], rsi
0000000184511e3f: push     rdi
0000000184511e40: push     r14
0000000184511e42: push     r15
0000000184511e44: sub      rsp, 0x30
0000000184511e48: mov      rbx, qword ptr [rsp + 0x70]
0000000184511e4d: mov      rsi, r9
0000000184511e50: mov      ebp, r8d
0000000184511e53: mov      r14, rdx
0000000184511e56: mov      r15, rcx
0000000184511e59: cmp      qword ptr [rbx + 0x38], 0
0000000184511e5e: jne      0x184511eab
0000000184511e60: lea      rcx, [rip + 0x439ef09] ; GenericMethodInfo 291272 @0x1888b0d70
0000000184511e67: call     0x18048bf00
0000000184511e6c: lea      rcx, [rip + 0x43ecac5] ; GenericMethodInfo 291773 @0x1888fe938
0000000184511e73: call     0x18048bf00
0000000184511e78: lea      rcx, [rip + 0x43a8021] ; GenericMethodInfo 232035 @0x1888b9ea0
0000000184511e7f: call     0x18048bf00
0000000184511e84: lea      rcx, [rip + 0x44117f5] ; GenericMethodInfo 291950 @0x188923680
0000000184511e8b: call     0x18048bf00
0000000184511e90: lea      rcx, [rip + 0x4362c89] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
0000000184511e97: call     0x18048bf00
0000000184511e9c: cmp      qword ptr [rbx + 0x38], 0
0000000184511ea1: jne      0x184511eab
0000000184511ea3: mov      rcx, rbx
0000000184511ea6: call     0x180446470
0000000184511eab: mov      rcx, qword ptr [rip + 0x4362c6e] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
0000000184511eb2: cmp      dword ptr [rcx + 0xe0], 0
0000000184511eb9: jne      0x184511ec7
0000000184511ebb: call     0x18048c140
0000000184511ec0: mov      rcx, qword ptr [rip + 0x4362c59] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
0000000184511ec7: mov      rax, qword ptr [rcx + 0xb8]
0000000184511ece: mov      rdi, qword ptr [rax + 0x88]
0000000184511ed5: test     rdi, rdi
0000000184511ed8: jne      0x184511f21
0000000184511eda: cmp      dword ptr [rcx + 0xe0], edi
0000000184511ee0: jne      0x184511eee
0000000184511ee2: call     0x18048c140
0000000184511ee7: mov      rcx, qword ptr [rip + 0x4362c32] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
0000000184511eee: mov      rax, qword ptr [rcx + 0xb8]
0000000184511ef5: mov      r9, rsi
0000000184511ef8: mov      rcx, qword ptr [rbx + 0x38]
0000000184511efc: mov      r8d, ebp
0000000184511eff: mov      rax, qword ptr [rax + 0x10]
0000000184511f03: mov      rdx, qword ptr [rcx + 8]
0000000184511f07: mov      rcx, r15
0000000184511f0a: mov      qword ptr [rsp + 0x28], rdx
0000000184511f0f: mov      rdx, r14
0000000184511f12: mov      qword ptr [rsp + 0x20], rax
0000000184511f17: call     0x184511870
0000000184511f1c: jmp      0x184511fa1
0000000184511f21: xor      edx, edx
0000000184511f23: mov      rcx, rdi
0000000184511f26: call     0x1830626c0 ; XLua.DelegateBridge.InvokeSessionStart [15516]
0000000184511f2b: mov      rax, qword ptr [rbx + 0x38]
0000000184511f2f: mov      rcx, qword ptr [rax]
0000000184511f32: cmp      qword ptr [rcx + 0x20], 0
0000000184511f37: jne      0x184511f3b
0000000184511f39: call     qword ptr [rcx]
0000000184511f3b: mov      r8, qword ptr [rbx + 0x38]
0000000184511f3f: mov      rdx, r15
0000000184511f42: mov      rcx, rdi
0000000184511f45: mov      r8, qword ptr [r8]
0000000184511f48: call     0x1844c6730
0000000184511f4d: mov      r8, qword ptr [rip + 0x439ee1c] ; GenericMethodInfo 291272 @0x1888b0d70
0000000184511f54: mov      rdx, r14
0000000184511f57: mov      rcx, rdi
0000000184511f5a: call     0x1844c6730
0000000184511f5f: mov      r8, qword ptr [rip + 0x43a7f3a] ; GenericMethodInfo 232035 @0x1888b9ea0
0000000184511f66: mov      edx, ebp
0000000184511f68: mov      rcx, rdi
0000000184511f6b: call     0x1844c6210
0000000184511f70: mov      r8, qword ptr [rip + 0x43ec9c1] ; GenericMethodInfo 291773 @0x1888fe938
0000000184511f77: mov      rdx, rsi
0000000184511f7a: mov      rcx, rdi
0000000184511f7d: call     0x1844c6730
0000000184511f82: xor      r8d, r8d
0000000184511f85: mov      edx, 1
0000000184511f8a: mov      rcx, rdi
0000000184511f8d: call     0x183062770 ; XLua.DelegateBridge.Invoke [15517]
0000000184511f92: mov      rdx, qword ptr [rip + 0x44116e7] ; GenericMethodInfo 291950 @0x188923680
0000000184511f99: mov      rcx, rdi
0000000184511f9c: call     0x1844c9fe0
0000000184511fa1: mov      rbx, qword ptr [rsp + 0x50]
0000000184511fa6: mov      rbp, qword ptr [rsp + 0x58]
0000000184511fab: mov      rsi, qword ptr [rsp + 0x60]
0000000184511fb0: add      rsp, 0x30
0000000184511fb4: pop      r15
0000000184511fb6: pop      r14
0000000184511fb8: pop      rdi
0000000184511fb9: ret      
0000000184511fba: int3     
0000000184511fbb: int3     
0000000184511fbc: int3     
0000000184511fbd: int3     
0000000184511fbe: int3     
0000000184511fbf: int3     
0000000184511fc0: mov      rax, rsp
0000000184511fc3: mov      qword ptr [rax + 0x10], rdx
0000000184511fc7: mov      qword ptr [rax + 8], rcx
0000000184511fcb: push     rbx
0000000184511fcc: push     rsi
0000000184511fcd: push     rdi
0000000184511fce: push     r12
0000000184511fd0: push     r13
0000000184511fd2: push     r14
0000000184511fd4: push     r15
0000000184511fd6: sub      rsp, 0x90
0000000184511fdd: movaps   xmmword ptr [rax - 0x48], xmm6
0000000184511fe1: movaps   xmmword ptr [rax - 0x58], xmm7
0000000184511fe5: movaps   xmmword ptr [rax - 0x68], xmm8
0000000184511fea: movaps   xmmword ptr [rax - 0x78], xmm9
0000000184511fef: mov      rdi, r8
0000000184511ff2: mov      r15, rdx
0000000184511ff5: mov      rsi, rcx
0000000184511ff8: movq     xmm6, r9
0000000184511ffd: movsd    qword ptr [rsp + 0x20], xmm6
0000000184512003: mov      r13, qword ptr [rsp + 0xf8]
000000018451200b: cmp      qword ptr [r13 + 0x38], 0
0000000184512010: jne      0x18451208d
0000000184512012: lea      rcx, [rip + 0x43a016f] ; GenericMethodInfo 291280 @0x1888b2188
0000000184512019: call     0x18048bf00
000000018451201e: lea      rcx, [rip + 0x43b62b3] ; GenericMethodInfo 291427 @0x1888c82d8
0000000184512025: call     0x18048bf00
000000018451202a: lea      rcx, [rip + 0x43dbb57] ; GenericMethodInfo 232067 @0x1888edb88
0000000184512031: call     0x18048bf00
0000000184512036: lea      rcx, [rip + 0x436dfdb] ; TypeInfo Torappu.UI.Firework.FireworkUtil @0x188880018
000000018451203d: call     0x18048bf00
0000000184512042: lea      rcx, [rip + 0x4442c4f] ; TypeInfo System.IDisposable @0x188954c98
0000000184512049: call     0x18048bf00
000000018451204e: lea      rcx, [rip + 0x43a8793] ; TypeInfo type(0x15, data=0x188a85ca0) @0x1888ba7e8
0000000184512055: call     0x18048bf00
000000018451205a: lea      rcx, [rip + 0x43c634f] ; TypeInfo type(0x15, data=0x188af6d90) @0x1888d83b0
0000000184512061: call     0x18048bf00
0000000184512066: lea      rcx, [rip + 0x4447aeb] ; TypeInfo System.Collections.IEnumerator @0x188959b58
000000018451206d: call     0x18048bf00
0000000184512072: lea      rcx, [rip + 0x4420c6f] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000184512079: call     0x18048bf00
000000018451207e: cmp      qword ptr [r13 + 0x38], 0
0000000184512083: jne      0x18451208d
0000000184512085: mov      rcx, r13
0000000184512088: call     0x180446470
000000018451208d: mov      rax, qword ptr [rip + 0x436df84] ; TypeInfo Torappu.UI.Firework.FireworkUtil @0x188880018
0000000184512094: mov      rcx, qword ptr [rax + 0xb8]
000000018451209b: mov      rbx, qword ptr [rcx + 0xe8]
00000001845120a2: test     rbx, rbx
00000001845120a5: jne      0x18451245a
00000001845120ab: mov      rcx, qword ptr [rip + 0x4420c36] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001845120b2: cmp      dword ptr [rcx + 0xe0], ebx
00000001845120b8: jne      0x1845120bf
00000001845120ba: call     0x18048c140
00000001845120bf: xor      r8d, r8d
00000001845120c2: xor      edx, edx
00000001845120c4: mov      rcx, rsi
00000001845120c7: call     0x186b638d0
00000001845120cc: test     al, al
00000001845120ce: jne      0x184512453
00000001845120d4: mov      rcx, qword ptr [rip + 0x4420c0d] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001845120db: cmp      dword ptr [rcx + 0xe0], 0
00000001845120e2: jne      0x1845120e9
00000001845120e4: call     0x18048c140
00000001845120e9: xor      r8d, r8d
00000001845120ec: xor      edx, edx
00000001845120ee: mov      rcx, r15
00000001845120f1: call     0x186b638d0
00000001845120f6: test     al, al
00000001845120f8: jne      0x184512453
00000001845120fe: test     rdi, rdi
0000000184512101: je       0x184512453
0000000184512107: mov      rax, qword ptr [r13 + 0x38]
000000018451210b: mov      rax, qword ptr [rax + 0x18]
000000018451210f: test     byte ptr [rax + 0x136], 1
0000000184512116: jne      0x184512120
0000000184512118: mov      rcx, rax
000000018451211b: call     0x1804463f0
0000000184512120: mov      rcx, rax
0000000184512123: call     0x18045cfe0
0000000184512128: mov      r12, rax
000000018451212b: test     rax, rax
000000018451212e: je       0x18451254e
0000000184512134: mov      rax, qword ptr [r13 + 0x38]
0000000184512138: mov      rcx, qword ptr [rax + 0x20]
000000018451213c: cmp      qword ptr [rcx + 0x20], 0
0000000184512141: jne      0x184512145
0000000184512143: call     qword ptr [rcx]
0000000184512145: mov      rdx, qword ptr [r13 + 0x38]
0000000184512149: mov      rdx, qword ptr [rdx + 0x20]
000000018451214d: mov      rcx, r12
0000000184512150: call     0x1848f2320
0000000184512155: mov      qword ptr [rsp + 0x30], r12
000000018451215a: xor      edx, edx
000000018451215c: mov      rcx, rdi
000000018451215f: call     0x181f38e20 ; Torappu.UI.Firework.FireworkPlateModel.IterAllGrids [148121]
0000000184512164: test     rax, rax
0000000184512167: je       0x18451254e
000000018451216d: xor      ecx, ecx
000000018451216f: mov      r8, rax
0000000184512172: mov      rdx, qword ptr [rip + 0x43a866f] ; TypeInfo type(0x15, data=0x188a85ca0) @0x1888ba7e8
0000000184512179: call     0x180005310
000000018451217e: mov      qword ptr [rsp + 0xf8], rax
0000000184512186: mov      qword ptr [rsp + 0x40], 0
000000018451218f: lea      rdi, [rsp + 0xf8]
0000000184512197: mov      qword ptr [rsp + 0x48], rdi
000000018451219c: movss    xmm6, dword ptr [rsp + 0xf4]
00000001845121a5: movss    xmm7, dword ptr [rsp + 0xf0]
00000001845121ae: movss    xmm8, dword ptr [rsp + 0x24]
00000001845121b5: movss    xmm9, dword ptr [rsp + 0x20]
00000001845121bc: nop      dword ptr [rax]
00000001845121c0: mov      r8, qword ptr [rsp + 0xf8]
00000001845121c8: test     r8, r8
00000001845121cb: je       0x184512542
00000001845121d1: xor      ecx, ecx
00000001845121d3: mov      rdx, qword ptr [rip + 0x444797e] ; TypeInfo System.Collections.IEnumerator @0x188959b58
00000001845121da: call     0x180005310
00000001845121df: test     al, al
00000001845121e1: je       0x184512403
00000001845121e7: mov      rbx, qword ptr [rsp + 0xf8]
00000001845121ef: test     rbx, rbx
00000001845121f2: je       0x18451253d
00000001845121f8: mov      rsi, qword ptr [rip + 0x43c61b1] ; TypeInfo type(0x15, data=0x188af6d90) @0x1888d83b0
00000001845121ff: mov      r14, qword ptr [rbx]
0000000184512202: cmp      byte ptr [rip + 0x47ba5e7], 0
0000000184512209: je       0x184512213
000000018451220b: mov      rcx, r14
000000018451220e: call     0x180446d00
0000000184512213: xor      eax, eax
0000000184512215: movzx    ecx, ax
0000000184512218: movzx    edx, word ptr [r14 + 0x12e]
0000000184512220: cmp      ax, dx
0000000184512223: jae      0x184512248
0000000184512225: mov      r8, qword ptr [r14 + 0xb0]
000000018451222c: nop      dword ptr [rax]
0000000184512230: movzx    eax, cx
0000000184512233: add      rax, rax
0000000184512236: cmp      qword ptr [r8 + rax*8], rsi
000000018451223a: je       0x184512384
0000000184512240: inc      cx
0000000184512243: cmp      cx, dx
0000000184512246: jb       0x184512230
0000000184512248: xor      r8d, r8d
000000018451224b: mov      rdx, rsi
000000018451224e: mov      rcx, rbx
0000000184512251: call     0x180445cc0
0000000184512256: mov      rdx, rax
0000000184512259: mov      rax, qword ptr [rdx]
000000018451225c: mov      rdx, qword ptr [rdx + 8]
0000000184512260: mov      rcx, rbx
0000000184512263: call     rax
0000000184512265: mov      rbx, rax
0000000184512268: mov      qword ptr [rsp + 0x28], rax
000000018451226d: mov      rcx, qword ptr [rip + 0x4420a74] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000184512274: cmp      dword ptr [rcx + 0xe0], 0
000000018451227b: jne      0x184512282
000000018451227d: call     0x18048c140
0000000184512282: mov      r8, qword ptr [r13 + 0x38]
0000000184512286: mov      r8, qword ptr [r8 + 0x28]
000000018451228a: mov      rdx, r15
000000018451228d: mov      rcx, qword ptr [rsp + 0xd0]
0000000184512295: call     0x18456d770
000000018451229a: mov      rsi, rax
000000018451229d: xor      edx, edx
000000018451229f: mov      rcx, rax
00000001845122a2: call     0x18051e920 ; ComponentExtensions.rectTransform [198]
00000001845122a7: movaps   xmm2, xmm6
00000001845122aa: addss    xmm2, xmm8
00000001845122af: movd     xmm0, ebx
00000001845122b3: cvtdq2ps xmm0, xmm0
00000001845122b6: mulss    xmm2, xmm0
00000001845122ba: movaps   xmm1, xmm7
00000001845122bd: addss    xmm1, xmm9
00000001845122c2: movd     xmm0, dword ptr [rsp + 0x2c]
00000001845122c8: cvtdq2ps xmm0, xmm0
00000001845122cb: mulss    xmm1, xmm0
00000001845122cf: test     rax, rax
00000001845122d2: je       0x184512538
00000001845122d8: xor      r8d, r8d
00000001845122db: unpcklps xmm1, xmm2
00000001845122de: movq     rdx, xmm1
00000001845122e3: mov      rcx, rax
00000001845122e6: call     0x186b699d0
00000001845122eb: test     rsi, rsi
00000001845122ee: je       0x184512532
00000001845122f4: mov      rcx, qword ptr [rsi]
00000001845122f7: mov      edx, dword ptr [rcx + 0x11c]
00000001845122fd: sub      edx, 0xc36
0000000184512303: je       0x1845123cc
0000000184512309: cmp      edx, 1
000000018451230c: je       0x1845123bc
0000000184512312: mov      r14, qword ptr [rip + 0x444c277] ; TypeInfo Torappu.UI.Firework.IFireworkPlateElementView @0x18895e590
0000000184512319: mov      r15, rcx
000000018451231c: cmp      byte ptr [rip + 0x47ba4cd], 0
0000000184512323: je       0x18451232a
0000000184512325: call     0x180446d00
000000018451232a: xor      eax, eax
000000018451232c: movzx    ecx, ax