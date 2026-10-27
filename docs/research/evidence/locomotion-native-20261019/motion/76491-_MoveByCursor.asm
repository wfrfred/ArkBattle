; Torappu.Battle.Enemy._MoveByCursor metadata=76491 token=0x6012acc VA=0x180a78fc0 RVA=0xa78fc0 size=0x730
0000000180a78fc0: mov      rax, rsp
0000000180a78fc3: mov      qword ptr [rax + 0x10], rsi
0000000180a78fc7: mov      qword ptr [rax + 0x18], rdi
0000000180a78fcb: mov      qword ptr [rax + 0x20], r14
0000000180a78fcf: push     rbp
0000000180a78fd0: lea      rbp, [rax - 0x57]
0000000180a78fd4: sub      rsp, 0xb0
0000000180a78fdb: cmp      byte ptr [rip + 0x82198d2], 0
0000000180a78fe2: mov      r14, r9
0000000180a78fe5: movaps   xmmword ptr [rax - 0x38], xmm8
0000000180a78fea: mov      rsi, rdx
0000000180a78fed: movaps   xmm8, xmm2
0000000180a78ff1: mov      rdi, rcx
0000000180a78ff4: jne      0x180a7902d
0000000180a78ff6: lea      rcx, [rip + 0x7da26b3] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a78ffd: call     0x18048bf00
0000000180a79002: lea      rcx, [rip + 0x7e4bf7f] ; TypeInfo Torappu.GridPosition @0x1888c4f88
0000000180a79009: call     0x18048bf00
0000000180a7900e: lea      rcx, [rip + 0x7e4ac23] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180a79015: call     0x18048bf00
0000000180a7901a: lea      rcx, [rip + 0x7e67127] ; GenericMethodInfo 282061 @0x1888e0148
0000000180a79021: call     0x18048bf00
0000000180a79026: mov      byte ptr [rip + 0x8219887], 1
0000000180a7902d: xor      eax, eax
0000000180a7902f: mov      qword ptr [rbp - 0x31], rax
0000000180a79033: mov      qword ptr [rbp - 0x21], rax
0000000180a79037: mov      qword ptr [rbp - 0x19], rax
0000000180a7903b: mov      rax, qword ptr [rip + 0x7da266e] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a79042: cmp      dword ptr [rax + 0xe0], 0
0000000180a79049: jne      0x180a7905a
0000000180a7904b: mov      rcx, rax
0000000180a7904e: call     0x18048c140
0000000180a79053: mov      rax, qword ptr [rip + 0x7da2656] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7905a: mov      rax, qword ptr [rax + 0xb8]
0000000180a79061: mov      rcx, qword ptr [rax + 0x6e0]
0000000180a79068: test     rcx, rcx
0000000180a7906b: jne      0x180a796c3
0000000180a79071: xor      edx, edx
0000000180a79073: mov      rcx, rdi
0000000180a79076: call     0x180705270 ; Torappu.Battle.Entity.get_isActuallyGroundBound [66492]
0000000180a7907b: test     al, al
0000000180a7907d: jne      0x180a79682
0000000180a79083: mov      qword ptr [rsp + 0xc0], rbx
0000000180a7908b: movaps   xmmword ptr [rsp + 0xa0], xmm6
0000000180a79093: movaps   xmmword ptr [rsp + 0x90], xmm7
0000000180a7909b: movaps   xmmword ptr [rsp + 0x70], xmm9
0000000180a790a1: xor      edx, edx
0000000180a790a3: mov      rcx, rdi
0000000180a790a6: call     0x180ad4090 ; Torappu.Battle.VisualObject.get_gridPosition [77871]
0000000180a790ab: mov      rcx, qword ptr [rip + 0x7e67096] ; GenericMethodInfo 282061 @0x1888e0148
0000000180a790b2: mov      rbx, rax
0000000180a790b5: call     0x185337c50
0000000180a790ba: test     rax, rax
0000000180a790bd: je       0x180a796e2
0000000180a790c3: xor      r8d, r8d
0000000180a790c6: mov      rdx, rbx
0000000180a790c9: mov      rcx, rax
0000000180a790cc: call     0x18087a3a0 ; Torappu.Battle.Map.CheckGridValid [70066]
0000000180a790d1: test     al, al
0000000180a790d3: je       0x180a794a6
0000000180a790d9: xor      edx, edx
0000000180a790db: mov      rcx, rdi
0000000180a790de: call     0x180707aa0 ; Torappu.Battle.Entity.get_moveSpeed [66467]
0000000180a790e3: movaps   xmm6, xmm0
0000000180a790e6: test     rsi, rsi
0000000180a790e9: je       0x180a796e2
0000000180a790ef: cmp      byte ptr [rip + 0x82536fa], 0
0000000180a790f6: mulss    xmm6, xmm8
0000000180a790fb: jbe      0x180a79105
0000000180a790fd: mov      rcx, qword ptr [rsi]
0000000180a79100: call     0x180446d00
0000000180a79105: mov      rax, qword ptr [rsi]
0000000180a79108: lea      r9, [rbp - 0x21]
0000000180a7910c: lea      r8, [rbp - 0x31]
0000000180a79110: movaps   xmm1, xmm6
0000000180a79113: mov      rcx, rsi
0000000180a79116: mov      rdx, qword ptr [rax + 0x1e0]
0000000180a7911d: mov      rax, qword ptr [rax + 0x1e8]
0000000180a79124: mov      qword ptr [rsp + 0x20], rax
0000000180a79129: call     rdx
0000000180a7912b: movss    xmm6, dword ptr [rbp - 0x21]
0000000180a79130: xor      edx, edx
0000000180a79132: movss    xmm7, dword ptr [rbp - 0x1d]
0000000180a79137: mov      rcx, rdi
0000000180a7913a: test     al, al
0000000180a7913c: jne      0x180a79405
0000000180a79142: call     0x180ad4250 ; Torappu.Battle.VisualObject.get_mapPosition [77866]
0000000180a79147: mov      qword ptr [rbp - 0x11], rax
0000000180a7914b: subss    xmm6, dword ptr [rbp - 0x11]
0000000180a79150: subss    xmm7, dword ptr [rbp - 0xd]
0000000180a79155: mov      ecx, 0xc
0000000180a7915a: mov      rdx, rsi
0000000180a7915d: movss    dword ptr [rbp - 0x29], xmm6
0000000180a79162: movss    dword ptr [rbp - 0x25], xmm7
0000000180a79167: call     0x180005610
0000000180a7916c: mov      rdx, qword ptr [rdi + 0x390]
0000000180a79173: mov      dword ptr [rbp - 0x31], eax
0000000180a79176: mov      qword ptr [rbp - 1], rax
0000000180a7917a: movq     xmm0, rax
0000000180a7917f: shufps   xmm0, xmm0, 0x55
0000000180a79183: movss    dword ptr [rbp - 0x2d], xmm0
0000000180a79188: test     rdx, rdx
0000000180a7918b: je       0x180a796e2
0000000180a79191: mov      ecx, 6
0000000180a79196: mov      qword ptr [rsp + 0x20], r14
0000000180a7919b: movaps   xmm3, xmm8
0000000180a7919f: mov      r8, rax
0000000180a791a2: call     0x180028e60
0000000180a791a7: xor      edx, edx
0000000180a791a9: mov      qword ptr [rbp - 0x11], rax
0000000180a791ad: mov      rcx, rdi
0000000180a791b0: mov      qword ptr [rbp - 1], rax
0000000180a791b4: call     0x180ad4250 ; Torappu.Battle.VisualObject.get_mapPosition [77866]
0000000180a791b9: movss    xmm8, dword ptr [rbp - 0x11]
0000000180a791bf: movss    xmm9, dword ptr [rbp - 0xd]
0000000180a791c5: movaps   xmm6, xmm8
0000000180a791c9: mov      qword ptr [rbp - 9], rax
0000000180a791cd: movaps   xmm7, xmm9
0000000180a791d1: addss    xmm6, dword ptr [rbp - 9]
0000000180a791d6: addss    xmm7, dword ptr [rbp - 5]
0000000180a791db: mov      rcx, qword ptr [rip + 0x7e4bda6] ; TypeInfo Torappu.GridPosition @0x1888c4f88
0000000180a791e2: cmp      dword ptr [rcx + 0xe0], 0
0000000180a791e9: jne      0x180a791f0
0000000180a791eb: call     0x18048c140
0000000180a791f0: unpcklps xmm6, xmm7
0000000180a791f3: xor      edx, edx
0000000180a791f5: movq     rcx, xmm6
0000000180a791fa: call     0x182103900 ; Torappu.GridPosition.FromVectorPosition [28047]
0000000180a791ff: xor      r8d, r8d
0000000180a79202: mov      qword ptr [rbp - 0x19], rax
0000000180a79206: mov      rdx, rax
0000000180a79209: mov      rcx, rbx
0000000180a7920c: call     0x182104110 ; Torappu.GridPosition.op_Inequality [28052]
0000000180a79211: test     al, al
0000000180a79213: je       0x180a79370
0000000180a79219: mov      rcx, qword ptr [rip + 0x7e66f28] ; GenericMethodInfo 282061 @0x1888e0148
0000000180a79220: call     0x185337c50
0000000180a79225: xor      edx, edx
0000000180a79227: mov      rcx, rdi
0000000180a7922a: mov      rbx, rax
0000000180a7922d: call     0x180708040 ; Torappu.Battle.Entity.get_pathMotionMode [66371]
0000000180a79232: test     rbx, rbx
0000000180a79235: je       0x180a796e2
0000000180a7923b: mov      r8, qword ptr [rbp - 0x19]
0000000180a7923f: xor      r9d, r9d
0000000180a79242: mov      edx, eax
0000000180a79244: mov      rcx, rbx
0000000180a79247: call     0x18087a650 ; Torappu.Battle.Map.CheckPassable [70011]
0000000180a7924c: test     al, al
0000000180a7924e: jne      0x180a79370
0000000180a79254: mov      rcx, qword ptr [rip + 0x7e4bd2d] ; TypeInfo Torappu.GridPosition @0x1888c4f88
0000000180a7925b: cmp      dword ptr [rcx + 0xe0], 0
0000000180a79262: jne      0x180a79269
0000000180a79264: call     0x18048c140
0000000180a79269: xor      edx, edx
0000000180a7926b: lea      rcx, [rbp - 0x19]
0000000180a7926f: call     0x182104010 ; Torappu.GridPosition.get_asLocalPosition [28039]
0000000180a79274: xor      edx, edx
0000000180a79276: mov      qword ptr [rbp - 9], rax
0000000180a7927a: mov      rcx, rdi
0000000180a7927d: call     0x180ad4250 ; Torappu.Battle.VisualObject.get_mapPosition [77866]
0000000180a79282: movss    xmm6, dword ptr [rbp - 9]
0000000180a79287: movss    xmm7, dword ptr [rbp - 5]
0000000180a7928c: mov      qword ptr [rbp - 0x11], rax
0000000180a79290: subss    xmm6, dword ptr [rbp - 0x11]
0000000180a79295: subss    xmm7, dword ptr [rbp - 0xd]
0000000180a7929a: cmp      byte ptr [rip + 0x82164ee], 0
0000000180a792a1: jne      0x180a792b6
0000000180a792a3: lea      rcx, [rip + 0x7e4a516] ; TypeInfo System.Math @0x1888c37c0
0000000180a792aa: call     0x18048bf00
0000000180a792af: mov      byte ptr [rip + 0x82164d9], 1
0000000180a792b6: mov      rcx, qword ptr [rip + 0x7e4a503] ; TypeInfo System.Math @0x1888c37c0
0000000180a792bd: cmp      dword ptr [rcx + 0xe0], 0
0000000180a792c4: jne      0x180a792cb
0000000180a792c6: call     0x18048c140
0000000180a792cb: movaps   xmm1, xmm6
0000000180a792ce: movaps   xmm0, xmm7
0000000180a792d1: mulss    xmm1, xmm6
0000000180a792d5: mulss    xmm0, xmm7
0000000180a792d9: addss    xmm1, xmm0
0000000180a792dd: xorps    xmm0, xmm0
0000000180a792e0: cvtps2pd xmm2, xmm1
0000000180a792e3: ucomisd  xmm0, xmm2
0000000180a792e7: ja       0x180a792ef
0000000180a792e9: sqrtpd   xmm0, xmm2
0000000180a792ed: jmp      0x180a792f7
0000000180a792ef: movaps   xmm0, xmm2
0000000180a792f2: call     0x1804d2720
0000000180a792f7: cvtsd2ss xmm0, xmm0
0000000180a792fb: comiss   xmm0, dword ptr [rip + 0x63c6a86]
0000000180a79302: ja       0x180a79339
0000000180a79304: cmp      byte ptr [rip + 0x82162aa], 0
0000000180a7930b: jne      0x180a79320
0000000180a7930d: lea      rcx, [rip + 0x7daf8ac] ; TypeInfo UnityEngine.Vector2 @0x188828bc0
0000000180a79314: call     0x18048bf00
0000000180a79319: mov      byte ptr [rip + 0x8216295], 1
0000000180a79320: mov      rax, qword ptr [rip + 0x7daf899] ; TypeInfo UnityEngine.Vector2 @0x188828bc0
0000000180a79327: mov      rcx, qword ptr [rax + 0xb8]
0000000180a7932e: movss    xmm6, dword ptr [rcx]
0000000180a79332: movss    xmm7, dword ptr [rcx + 4]
0000000180a79337: jmp      0x180a79341
0000000180a79339: divss    xmm6, xmm0
0000000180a7933d: divss    xmm7, xmm0
0000000180a79341: movaps   xmm1, xmm8
0000000180a79345: movaps   xmm0, xmm9
0000000180a79349: mulss    xmm1, xmm6
0000000180a7934d: mulss    xmm0, xmm7
0000000180a79351: addss    xmm1, xmm0
0000000180a79355: addss    xmm1, xmm1
0000000180a79359: movaps   xmm0, xmm1
0000000180a7935c: mulss    xmm1, xmm7
0000000180a79360: mulss    xmm0, xmm6
0000000180a79364: subss    xmm9, xmm1
0000000180a79369: subss    xmm8, xmm0
0000000180a7936e: jmp      0x180a7937c
0000000180a79370: movss    xmm9, dword ptr [rbp + 3]
0000000180a79376: movss    xmm8, dword ptr [rbp - 1]
0000000180a7937c: xor      edx, edx
0000000180a7937e: mov      rcx, rdi
0000000180a79381: call     0x180ad4250 ; Torappu.Battle.VisualObject.get_mapPosition [77866]
0000000180a79386: mov      qword ptr [rbp - 1], rax
0000000180a7938a: movss    xmm0, dword ptr [rbp - 1]
0000000180a7938f: movss    xmm1, dword ptr [rbp + 3]
0000000180a79394: addss    xmm0, xmm8
0000000180a79399: addss    xmm1, xmm9
0000000180a7939e: unpcklps xmm0, xmm1
0000000180a793a1: xor      r8d, r8d
0000000180a793a4: movq     rdx, xmm0
0000000180a793a9: mov      rcx, rdi
0000000180a793ac: call     0x180ad3dc0 ; Torappu.Battle.VisualObject.SetPosition [77880]
0000000180a793b1: mov      rcx, qword ptr [rip + 0x7e4a880] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180a793b8: movss    xmm6, dword ptr [rbp - 0x31]
0000000180a793bd: movss    xmm7, dword ptr [rbp - 0x2d]
0000000180a793c2: cmp      dword ptr [rcx + 0xe0], 0
0000000180a793c9: jne      0x180a793d0
0000000180a793cb: call     0x18048c140
0000000180a793d0: movss    xmm1, dword ptr [rip + 0x63c69b0]
0000000180a793d8: xor      r8d, r8d
0000000180a793db: unpcklps xmm6, xmm7
0000000180a793de: movq     rcx, xmm6
0000000180a793e3: call     0x1866e5e20
0000000180a793e8: mov      qword ptr [rbp - 1], rax
0000000180a793ec: movss    xmm0, dword ptr [rbp - 1]
0000000180a793f1: movss    xmm1, dword ptr [rbp + 3]
0000000180a793f6: movss    dword ptr [rbp - 0x31], xmm0
0000000180a793fb: movss    dword ptr [rbp - 0x2d], xmm1
0000000180a79400: jmp      0x180a795a1
0000000180a79405: call     0x180ad4250 ; Torappu.Battle.VisualObject.get_mapPosition [77866]
0000000180a7940a: mov      qword ptr [rbp - 1], rax
0000000180a7940e: subss    xmm6, dword ptr [rbp - 1]
0000000180a79413: subss    xmm7, dword ptr [rbp + 3]
0000000180a79418: mov      rdx, qword ptr [rbp - 0x21]
0000000180a7941c: xor      r8d, r8d
0000000180a7941f: mov      rcx, rdi
0000000180a79422: movss    dword ptr [rbp - 0x29], xmm6
0000000180a79427: movss    dword ptr [rbp - 0x25], xmm7
0000000180a7942c: call     0x180ad3dc0 ; Torappu.Battle.VisualObject.SetPosition [77880]
0000000180a79431: xor      edx, edx
0000000180a79433: lea      rcx, [rbp - 0x29]
0000000180a79437: call     0x180af5570 ; Torappu.Battle.DeterministicUtil.ProcessVectorByDeterministic [78282]
0000000180a7943c: mov      rcx, qword ptr [rip + 0x7e4a7f5] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180a79443: movss    xmm6, dword ptr [rbp - 0x31]
0000000180a79448: movss    xmm7, dword ptr [rbp - 0x2d]
0000000180a7944d: cmp      dword ptr [rcx + 0xe0], 0
0000000180a79454: jne      0x180a7945b
0000000180a79456: call     0x18048c140
0000000180a7945b: unpcklps xmm6, xmm7
0000000180a7945e: xor      edx, edx
0000000180a79460: movq     rcx, xmm6
0000000180a79465: call     0x1866e5620
0000000180a7946a: test     al, al
0000000180a7946c: je       0x180a79478
0000000180a7946e: mov      al, 1
0000000180a79470: mov      byte ptr [r14], al
0000000180a79473: jmp      0x180a795a1
0000000180a79478: mov      rcx, qword ptr [rip + 0x7e4a7b9] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180a7947f: movsd    xmm6, qword ptr [rbp - 0x29]
0000000180a79484: cmp      dword ptr [rcx + 0xe0], 0
0000000180a7948b: jne      0x180a79492
0000000180a7948d: call     0x18048c140
0000000180a79492: xor      edx, edx
0000000180a79494: movq     rcx, xmm6
0000000180a79499: call     0x1866e5620
0000000180a7949e: mov      byte ptr [r14], al
0000000180a794a1: jmp      0x180a795a1
0000000180a794a6: mov      rcx, qword ptr [rip + 0x7e66c9b] ; GenericMethodInfo 282061 @0x1888e0148
0000000180a794ad: call     0x185337c50
0000000180a794b2: test     rax, rax
0000000180a794b5: je       0x180a796e2
0000000180a794bb: xor      r8d, r8d
0000000180a794be: mov      rdx, rbx
0000000180a794c1: mov      rcx, rax
0000000180a794c4: call     0x18087c0d0 ; Torappu.Battle.Map.GetDirectionToGoBackFromInvalidPos [70085]
0000000180a794c9: mov      qword ptr [rbp - 1], rax
0000000180a794cd: xor      edx, edx
0000000180a794cf: movss    xmm0, dword ptr [rbp - 1]
0000000180a794d4: mov      rcx, rdi
0000000180a794d7: movss    xmm1, dword ptr [rbp + 3]
0000000180a794dc: movss    dword ptr [rbp - 0x31], xmm0
0000000180a794e1: movss    dword ptr [rbp - 0x2d], xmm1
0000000180a794e6: call     0x180ad4250 ; Torappu.Battle.VisualObject.get_mapPosition [77866]
0000000180a794eb: movss    xmm6, dword ptr [rbp - 0x31]
0000000180a794f0: xor      edx, edx
0000000180a794f2: movss    xmm7, dword ptr [rbp - 0x2d]
0000000180a794f7: mov      rcx, rdi
0000000180a794fa: mov      qword ptr [rbp - 1], rax
0000000180a794fe: call     0x180707aa0 ; Torappu.Battle.Entity.get_moveSpeed [66467]
0000000180a79503: mulss    xmm6, xmm0
0000000180a79507: mulss    xmm7, xmm0
0000000180a7950b: mulss    xmm6, xmm8
0000000180a79510: mulss    xmm7, xmm8
0000000180a79515: addss    xmm6, dword ptr [rbp - 1]
0000000180a7951a: addss    xmm7, dword ptr [rbp + 3]
0000000180a7951f: unpcklps xmm6, xmm7
0000000180a79522: xor      r8d, r8d
0000000180a79525: movq     rdx, xmm6
0000000180a7952a: mov      rcx, rdi
0000000180a7952d: call     0x180ad3dc0 ; Torappu.Battle.VisualObject.SetPosition [77880]
0000000180a79532: mov      rcx, qword ptr [rip + 0x7e4a6ff] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180a79539: movss    xmm6, dword ptr [rbp - 0x31]
0000000180a7953e: movss    xmm7, dword ptr [rbp - 0x2d]
0000000180a79543: cmp      dword ptr [rcx + 0xe0], 0
0000000180a7954a: jne      0x180a79551
0000000180a7954c: call     0x18048c140
0000000180a79551: unpcklps xmm6, xmm7
0000000180a79554: xor      edx, edx
0000000180a79556: movq     rcx, xmm6
0000000180a7955b: call     0x1866e5620
0000000180a79560: mov      byte ptr [r14], al
0000000180a79563: cmp      byte ptr [rip + 0x821711d], 0
0000000180a7956a: jne      0x180a7957f
0000000180a7956c: lea      rcx, [rip + 0x7daf64d] ; TypeInfo UnityEngine.Vector2 @0x188828bc0
0000000180a79573: call     0x18048bf00
0000000180a79578: mov      byte ptr [rip + 0x8217108], 1
0000000180a7957f: mov      rax, qword ptr [rip + 0x7daf63a] ; TypeInfo UnityEngine.Vector2 @0x188828bc0
0000000180a79586: mov      rcx, qword ptr [rax + 0xb8]
0000000180a7958d: movss    xmm0, dword ptr [rcx + 8]
0000000180a79592: movss    xmm1, dword ptr [rcx + 0xc]
0000000180a79597: movss    dword ptr [rbp - 0x29], xmm0
0000000180a7959c: movss    dword ptr [rbp - 0x25], xmm1
0000000180a795a1: cmp      byte ptr [rdi + 0x4ac], 0
0000000180a795a8: jne      0x180a79624
0000000180a795aa: mov      rcx, qword ptr [rip + 0x7e4a687] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180a795b1: movss    xmm6, dword ptr [rbp - 0x31]
0000000180a795b6: movss    xmm7, dword ptr [rbp - 0x2d]
0000000180a795bb: cmp      dword ptr [rcx + 0xe0], 0
0000000180a795c2: jne      0x180a795c9
0000000180a795c4: call     0x18048c140
0000000180a795c9: unpcklps xmm6, xmm7
0000000180a795cc: xor      edx, edx
0000000180a795ce: movq     rcx, xmm6
0000000180a795d3: call     0x1866e5620
0000000180a795d8: test     al, al
0000000180a795da: jne      0x180a79624
0000000180a795dc: movss    xmm1, dword ptr [rbp - 0x25]
0000000180a795e1: movss    xmm0, dword ptr [rbp - 0x29]
0000000180a795e6: mulss    xmm1, xmm1
0000000180a795ea: mulss    xmm0, xmm0
0000000180a795ee: addss    xmm1, xmm0
0000000180a795f2: comiss   xmm1, dword ptr [rip + 0x63c867f]
0000000180a795f9: jbe      0x180a79624
0000000180a795fb: mov      rdx, qword ptr [rbp - 0x31]
0000000180a795ff: xor      r8d, r8d
0000000180a79602: mov      rcx, rdi
0000000180a79605: call     0x180a77dd0 ; Torappu.Battle.Enemy._CalculateFaceDirection [76519]
0000000180a7960a: xor      r9d, r9d
0000000180a7960d: mov      qword ptr [rsp + 0x20], 0
0000000180a79616: xor      r8d, r8d
0000000180a79619: mov      rdx, rax
0000000180a7961c: mov      rcx, rdi
0000000180a7961f: call     0x1806f2f10 ; Torappu.Battle.Entity.FaceTo [66535]
0000000180a79624: movss    xmm0, dword ptr [rbp - 0x31]
0000000180a79629: movss    xmm1, dword ptr [rbp - 0x2d]
0000000180a7962e: movaps   xmm7, xmmword ptr [rsp + 0x90]
0000000180a79636: movaps   xmm6, xmmword ptr [rsp + 0xa0]
0000000180a7963e: movaps   xmm9, xmmword ptr [rsp + 0x70]
0000000180a79644: mov      rbx, qword ptr [rsp + 0xc0]
0000000180a7964c: movss    dword ptr [rdi + 0x2c0], xmm0
0000000180a79654: unpcklps xmm0, xmm1
0000000180a79657: movq     rax, xmm0
0000000180a7965c: movss    dword ptr [rdi + 0x2c4], xmm1
0000000180a79664: lea      r11, [rsp + 0xb0]
0000000180a7966c: mov      rsi, qword ptr [r11 + 0x18]
0000000180a79670: mov      rdi, qword ptr [r11 + 0x20]
0000000180a79674: mov      r14, qword ptr [r11 + 0x28]
0000000180a79678: movaps   xmm8, xmmword ptr [r11 - 0x30]
0000000180a7967d: mov      rsp, r11
0000000180a79680: pop      rbp
0000000180a79681: ret      
0000000180a79682: mov      byte ptr [r14], 1
0000000180a79686: cmp      byte ptr [rip + 0x8215f28], 0
0000000180a7968d: jne      0x180a796a2
0000000180a7968f: lea      rcx, [rip + 0x7daf52a] ; TypeInfo UnityEngine.Vector2 @0x188828bc0
0000000180a79696: call     0x18048bf00
0000000180a7969b: mov      byte ptr [rip + 0x8215f13], 1
0000000180a796a2: mov      rax, qword ptr [rip + 0x7daf517] ; TypeInfo UnityEngine.Vector2 @0x188828bc0
0000000180a796a9: mov      rcx, qword ptr [rax + 0xb8]
0000000180a796b0: movss    xmm1, dword ptr [rcx + 4]
0000000180a796b5: movss    xmm0, dword ptr [rcx]
0000000180a796b9: unpcklps xmm0, xmm1
0000000180a796bc: movq     rax, xmm0
0000000180a796c1: jmp      0x180a79664
0000000180a796c3: mov      qword ptr [rsp + 0x28], 0
0000000180a796cc: movaps   xmm3, xmm8
0000000180a796d0: mov      r8, rsi
0000000180a796d3: mov      qword ptr [rsp + 0x20], r14
0000000180a796d8: mov      rdx, rdi
0000000180a796db: call     0x1833a08d0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3718 [6373]
0000000180a796e0: jmp      0x180a79664
0000000180a796e2: call     0x18048c0b0
0000000180a796e7: int3     
0000000180a796e8: int3     
0000000180a796e9: int3     
0000000180a796ea: int3     
0000000180a796eb: int3     
0000000180a796ec: int3     
0000000180a796ed: int3     
0000000180a796ee: int3     
0000000180a796ef: int3     
