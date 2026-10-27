; Torappu.Battle.Projectiles.ParacurveMovement._CalculateNextPosition metadata=87129 token=0x601545a VA=0x180d78310 RVA=0xd78310 size=0x5a0
0000000180d78310: mov      qword ptr [rsp + 0x20], rbx
0000000180d78315: push     rbp
0000000180d78316: push     rsi
0000000180d78317: push     rdi
0000000180d78318: lea      rbp, [rsp - 0x3f]
0000000180d7831d: sub      rsp, 0xd0
0000000180d78324: cmp      byte ptr [rip + 0x7f1c4a7], 0
0000000180d7832b: movzx    esi, r9b
0000000180d7832f: movaps   xmmword ptr [rsp + 0x90], xmm9
0000000180d78338: mov      rbx, rdx
0000000180d7833b: movaps   xmm9, xmm2
0000000180d7833f: mov      rdi, rcx
0000000180d78342: jne      0x180d7837b
0000000180d78344: lea      rcx, [rip + 0x7ae23b5] ; TypeInfo Torappu.FP @0x18885a700
0000000180d7834b: call     0x18048bf00
0000000180d78350: lea      rcx, [rip + 0x7b46871] ; TypeInfo Torappu.Battle.MapUtil @0x1888bebc8
0000000180d78357: call     0x18048bf00
0000000180d7835c: lea      rcx, [rip + 0x7b4b8d5] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180d78363: call     0x18048bf00
0000000180d78368: lea      rcx, [rip + 0x7bd91b1] ; TypeInfo Torappu.Battle.Projectiles.ParacurveMovement @0x188951520
0000000180d7836f: call     0x18048bf00
0000000180d78374: mov      byte ptr [rip + 0x7f1c457], 1
0000000180d7837b: mov      rax, qword ptr [rip + 0x7bd919e] ; TypeInfo Torappu.Battle.Projectiles.ParacurveMovement @0x188951520
0000000180d78382: mov      rcx, qword ptr [rax + 0xb8]
0000000180d78389: mov      rdx, qword ptr [rcx + 0x70]
0000000180d7838d: test     rdx, rdx
0000000180d78390: jne      0x180d7885e
0000000180d78396: cmp      byte ptr [rip + 0x7f54454], dl
0000000180d7839c: jbe      0x180d783a6
0000000180d7839e: mov      rcx, qword ptr [rbx]
0000000180d783a1: call     0x180446d00
0000000180d783a6: mov      r8, qword ptr [rbx]
0000000180d783a9: lea      rcx, [rbp - 0x51]
0000000180d783ad: mov      rdx, rbx
0000000180d783b0: mov      rax, qword ptr [r8 + 0x2c0]
0000000180d783b7: mov      r8, qword ptr [r8 + 0x2c8]
0000000180d783be: call     rax
0000000180d783c0: xor      edx, edx
0000000180d783c2: mov      ecx, dword ptr [rax + 8]
0000000180d783c5: movsd    xmm0, qword ptr [rax]
0000000180d783c9: movsd    qword ptr [rbx + 0x60], xmm0
0000000180d783ce: mov      dword ptr [rbx + 0x68], ecx
0000000180d783d1: mov      rcx, rbx
0000000180d783d4: call     0x1808cf100 ; Torappu.Battle.Projectile.Behaviour.get_projectile [71401]
0000000180d783d9: test     rax, rax
0000000180d783dc: je       0x180d788a5
0000000180d783e2: mov      qword ptr [rsp + 0xf8], r14
0000000180d783ea: xor      edx, edx
0000000180d783ec: mov      qword ptr [rsp + 0x100], r15
0000000180d783f4: mov      rcx, rax
0000000180d783f7: movaps   xmmword ptr [rsp + 0xc0], xmm6
0000000180d783ff: movaps   xmmword ptr [rsp + 0xb0], xmm7
0000000180d78407: movaps   xmmword ptr [rsp + 0xa0], xmm8
0000000180d78410: movaps   xmmword ptr [rsp + 0x80], xmm10
0000000180d78419: movaps   xmmword ptr [rsp + 0x60], xmm12
0000000180d7841f: call     0x1808dd8f0 ; Torappu.Battle.Projectile.get_timeRatio [71302]
0000000180d78424: xor      r8d, r8d
0000000180d78427: lea      rcx, [rbp - 0x51]
0000000180d7842b: mov      rdx, rbx
0000000180d7842e: call     0x1808cdb70 ; Torappu.Battle.BasicMovement.get_position [71203]
0000000180d78433: movsd    xmm6, qword ptr [rbx + 0x60]
0000000180d78438: lea      rcx, [rbp - 0x51]
0000000180d7843c: xor      r8d, r8d
0000000180d7843f: mov      rdx, rbx
0000000180d78442: movsd    xmm0, qword ptr [rax]
0000000180d78446: mov      eax, dword ptr [rax + 8]
0000000180d78449: mov      dword ptr [rbp - 0x59], eax
0000000180d7844c: mov      eax, dword ptr [rbx + 0x68]
0000000180d7844f: mov      dword ptr [rbp - 0x49], eax
0000000180d78452: movsd    qword ptr [rbp - 0x61], xmm0
0000000180d78457: call     0x1808cdb70 ; Torappu.Battle.BasicMovement.get_position [71203]
0000000180d7845c: movsd    xmm2, qword ptr [rax]
0000000180d78460: mov      eax, dword ptr [rax + 8]
0000000180d78463: mov      dword ptr [rbp - 0x49], eax
0000000180d78466: movaps   xmm1, xmm6
0000000180d78469: movsd    qword ptr [rbp - 0x51], xmm6
0000000180d7846e: movaps   xmm0, xmm2
0000000180d78471: shufps   xmm1, xmm1, 0x55
0000000180d78475: shufps   xmm0, xmm0, 0x55
0000000180d78479: movaps   xmm3, xmm6
0000000180d7847c: subss    xmm1, xmm0
0000000180d78480: movsd    qword ptr [rbp - 0x51], xmm2
0000000180d78485: subss    xmm3, xmm2
0000000180d78489: unpcklps xmm3, xmm1
0000000180d7848c: lea      rcx, [rbp + 0x5f]
0000000180d78490: xor      edx, edx
0000000180d78492: movsd    qword ptr [rbp + 0x5f], xmm3
0000000180d78497: call     0x180535480
0000000180d7849c: movaps   xmm1, xmm9
0000000180d784a0: xorps    xmm10, xmm10
0000000180d784a4: mulss    xmm1, dword ptr [rbx + 0xf4]
0000000180d784ac: comiss   xmm1, xmm0
0000000180d784af: jae      0x180d784fd
0000000180d784b1: xor      edx, edx
0000000180d784b3: lea      rcx, [rbp + 0x5f]
0000000180d784b7: call     0x180535530
0000000180d784bc: mov      qword ptr [rbp + 0x5f], rax
0000000180d784c0: movss    xmm0, dword ptr [rbx + 0xf4]
0000000180d784c8: movss    xmm7, dword ptr [rbp + 0x5f]
0000000180d784cd: movss    xmm8, dword ptr [rbp + 0x63]
0000000180d784d3: movss    xmm6, dword ptr [rbp - 0x59]
0000000180d784d8: mulss    xmm7, xmm9
0000000180d784dd: addss    xmm6, xmm10
0000000180d784e2: mulss    xmm8, xmm9
0000000180d784e7: mulss    xmm7, xmm0
0000000180d784eb: mulss    xmm8, xmm0
0000000180d784f0: addss    xmm7, dword ptr [rbp - 0x61]
0000000180d784f5: addss    xmm8, dword ptr [rbp - 0x5d]
0000000180d784fb: jmp      0x180d7850d
0000000180d784fd: movss    xmm7, dword ptr [rbx + 0x60]
0000000180d78502: movss    xmm8, dword ptr [rbx + 0x64]
0000000180d78508: movss    xmm6, dword ptr [rbp - 0x59]
0000000180d7850d: cmp      byte ptr [rbx + 0xe8], 0
0000000180d78514: jne      0x180d78545
0000000180d78516: cmp      byte ptr [rbx + 0xf1], 0
0000000180d7851d: movss    xmm0, dword ptr [rbx + 0xe4]
0000000180d78525: jne      0x180d7852f
0000000180d78527: comiss   xmm10, xmm0
0000000180d7852b: jae      0x180d78535
0000000180d7852d: jmp      0x180d7853c
0000000180d7852f: comiss   xmm0, xmm10
0000000180d78533: jb       0x180d7853c
0000000180d78535: mov      byte ptr [rbx + 0xe8], 1
0000000180d7853c: cmp      byte ptr [rbx + 0xe8], 0
0000000180d78543: je       0x180d78574
0000000180d78545: movss    xmm2, dword ptr [rbx + 0x68]
0000000180d7854a: movaps   xmm0, xmm9
0000000180d7854e: mulss    xmm0, dword ptr [rbx + 0xe4]
0000000180d78556: subss    xmm2, xmm6
0000000180d7855a: andps    xmm0, xmmword ptr [rip + 0x60c788f]
0000000180d78561: andps    xmm2, xmmword ptr [rip + 0x60c7888]
0000000180d78568: comiss   xmm0, xmm2
0000000180d7856b: jb       0x180d78574
0000000180d7856d: movss    xmm6, dword ptr [rbx + 0x68]
0000000180d78572: jmp      0x180d78584
0000000180d78574: movaps   xmm0, xmm9
0000000180d78578: mulss    xmm0, dword ptr [rbx + 0xe4]
0000000180d78580: subss    xmm6, xmm0
0000000180d78584: xor      r8d, r8d
0000000180d78587: lea      rcx, [rbp - 0x51]
0000000180d7858b: mov      rdx, rbx
0000000180d7858e: call     0x1808cda30 ; Torappu.Battle.BasicMovement.get_direction [71201]
0000000180d78593: xor      r8d, r8d
0000000180d78596: lea      rcx, [rbp - 0x51]
0000000180d7859a: mov      rdx, rbx
0000000180d7859d: movsd    xmm12, qword ptr [rax]
0000000180d785a2: mov      r15d, dword ptr [rax + 8]
0000000180d785a6: call     0x1808cdb70 ; Torappu.Battle.BasicMovement.get_position [71203]
0000000180d785ab: movaps   xmm3, xmm7
0000000180d785ae: movaps   xmm2, xmm8
0000000180d785b2: movsd    xmm1, qword ptr [rax]
0000000180d785b6: movaps   xmm0, xmm1
0000000180d785b9: movsd    qword ptr [rbp - 0x61], xmm1
0000000180d785be: subss    xmm3, xmm1
0000000180d785c2: shufps   xmm0, xmm0, 0x55
0000000180d785c6: movaps   xmm1, xmm6
0000000180d785c9: subss    xmm2, xmm0
0000000180d785cd: subss    xmm1, dword ptr [rax + 8]
0000000180d785d2: unpcklps xmm3, xmm2
0000000180d785d5: lea      rdx, [rbp - 0x61]
0000000180d785d9: xor      r8d, r8d
0000000180d785dc: movsd    qword ptr [rbp - 0x61], xmm3
0000000180d785e1: mov      rcx, rbx
0000000180d785e4: movss    dword ptr [rbp - 0x59], xmm1
0000000180d785e9: call     0x1808cdee0 ; Torappu.Battle.BasicMovement.set_direction [71202]
0000000180d785ee: xor      r8d, r8d
0000000180d785f1: lea      rcx, [rbp - 0x51]
0000000180d785f5: mov      rdx, rbx
0000000180d785f8: call     0x1808cda30 ; Torappu.Battle.BasicMovement.get_direction [71201]
0000000180d785fd: mov      rcx, qword ptr [rip + 0x7b465c4] ; TypeInfo Torappu.Battle.MapUtil @0x1888bebc8
0000000180d78604: movsd    xmm10, qword ptr [rax]
0000000180d78609: cmp      dword ptr [rcx + 0xe0], 0
0000000180d78610: mov      r14d, dword ptr [rax + 8]
0000000180d78614: jne      0x180d7861b
0000000180d78616: call     0x18048c140
0000000180d7861b: movsd    qword ptr [rbp - 0x61], xmm10
0000000180d78621: lea      rcx, [rbp - 0x61]
0000000180d78625: movss    xmm10, dword ptr [rip + 0x60c78e2]
0000000180d7862e: xor      r8d, r8d
0000000180d78631: movaps   xmm1, xmm10
0000000180d78635: mov      dword ptr [rbp - 0x59], r14d
0000000180d78639: call     0x180b00c30 ; Torappu.Battle.MapUtil.IsAlmostZero [78314]
0000000180d7863e: mov      r14, qword ptr [rsp + 0xf8]
0000000180d78646: test     al, al
0000000180d78648: jne      0x180d7869f
0000000180d7864a: xor      r8d, r8d
0000000180d7864d: lea      rcx, [rbp - 0x51]
0000000180d78651: mov      rdx, rbx
0000000180d78654: call     0x1808cdb70 ; Torappu.Battle.BasicMovement.get_position [71203]
0000000180d78659: movaps   xmm3, xmm7
0000000180d7865c: movaps   xmm2, xmm8
0000000180d78660: movsd    xmm1, qword ptr [rax]
0000000180d78664: movaps   xmm0, xmm1
0000000180d78667: movsd    qword ptr [rbp - 0x61], xmm1
0000000180d7866c: subss    xmm3, xmm1
0000000180d78670: shufps   xmm0, xmm0, 0x55
0000000180d78674: movaps   xmm1, xmm6
0000000180d78677: subss    xmm2, xmm0
0000000180d7867b: subss    xmm1, dword ptr [rax + 8]
0000000180d78680: unpcklps xmm3, xmm2
0000000180d78683: lea      rdx, [rbp - 0x61]
0000000180d78687: xor      r8d, r8d
0000000180d7868a: movsd    qword ptr [rbp - 0x61], xmm3
0000000180d7868f: lea      rcx, [rbp - 0x51]
0000000180d78693: movss    dword ptr [rbp - 0x59], xmm1
0000000180d78698: call     0x18051dd20
0000000180d7869d: jmp      0x180d786c9
0000000180d7869f: cmp      byte ptr [rip + 0x7f16f10], 0
0000000180d786a6: jne      0x180d786bb
0000000180d786a8: lea      rcx, [rip + 0x7ab1941] ; TypeInfo UnityEngine.Vector3 @0x188829ff0
0000000180d786af: call     0x18048bf00
0000000180d786b4: mov      byte ptr [rip + 0x7f16efb], 1
0000000180d786bb: mov      rax, qword ptr [rip + 0x7ab192e] ; TypeInfo UnityEngine.Vector3 @0x188829ff0
0000000180d786c2: mov      rax, qword ptr [rax + 0xb8]
0000000180d786c9: movsd    xmm0, qword ptr [rax]
0000000180d786cd: lea      rdx, [rbp - 0x61]
0000000180d786d1: mov      eax, dword ptr [rax + 8]
0000000180d786d4: xor      r8d, r8d
0000000180d786d7: mov      rcx, rbx
0000000180d786da: movsd    qword ptr [rbp - 0x61], xmm0
0000000180d786df: mov      dword ptr [rbp - 0x59], eax
0000000180d786e2: call     0x1808cdee0 ; Torappu.Battle.BasicMovement.set_direction [71202]
0000000180d786e7: movaps   xmmword ptr [rsp + 0x70], xmm11
0000000180d786ed: test     sil, sil
0000000180d786f0: jne      0x180d78780
0000000180d786f6: xor      r8d, r8d
0000000180d786f9: lea      rcx, [rbp - 0x51]
0000000180d786fd: mov      rdx, rbx
0000000180d78700: call     0x1808cda30 ; Torappu.Battle.BasicMovement.get_direction [71201]
0000000180d78705: mov      rcx, qword ptr [rip + 0x7ae1ff4] ; TypeInfo Torappu.FP @0x18885a700
0000000180d7870c: movsd    xmm11, qword ptr [rax]
0000000180d78711: cmp      dword ptr [rcx + 0xe0], 0
0000000180d78718: mov      esi, dword ptr [rax + 8]
0000000180d7871b: jne      0x180d78722
0000000180d7871d: call     0x18048c140
0000000180d78722: xor      edx, edx
0000000180d78724: movaps   xmm0, xmm9
0000000180d78728: call     0x1866fdad0
0000000180d7872d: mov      r9, rax
0000000180d78730: mov      qword ptr [rsp + 0x28], 0
0000000180d78739: lea      r8, [rbp - 0x61]
0000000180d7873d: movsd    qword ptr [rbp - 0x61], xmm11
0000000180d78743: lea      rdx, [rbp - 0x51]
0000000180d78747: mov      dword ptr [rbp - 0x59], esi
0000000180d7874a: lea      rcx, [rbp - 0x41]
0000000180d7874e: movsd    qword ptr [rbp - 0x51], xmm12
0000000180d78754: mov      dword ptr [rbp - 0x49], r15d
0000000180d78758: mov      byte ptr [rsp + 0x20], 0
0000000180d7875d: call     0x1808cc530 ; Torappu.Battle.BasicMovement.SmoothLerpDirection [71225]
0000000180d78762: xor      r8d, r8d
0000000180d78765: lea      rdx, [rbp - 0x51]
0000000180d78769: mov      rcx, rbx
0000000180d7876c: movsd    xmm0, qword ptr [rax]
0000000180d78770: mov      eax, dword ptr [rax + 8]
0000000180d78773: movsd    qword ptr [rbp - 0x51], xmm0
0000000180d78778: mov      dword ptr [rbp - 0x49], eax
0000000180d7877b: call     0x1808cdee0 ; Torappu.Battle.BasicMovement.set_direction [71202]
0000000180d78780: cmp      byte ptr [rbx + 0xe8], 0
0000000180d78787: movaps   xmm12, xmmword ptr [rsp + 0x60]
0000000180d7878d: mov      r15, qword ptr [rsp + 0x100]
0000000180d78795: je       0x180d78824
0000000180d7879b: movsd    xmm2, qword ptr [rbx + 0x60]
0000000180d787a0: movss    xmm1, dword ptr [rbx + 0x64]
0000000180d787a5: subss    xmm2, xmm7
0000000180d787a9: subss    xmm1, xmm8
0000000180d787ae: unpcklps xmm2, xmm1
0000000180d787b1: lea      rcx, [rbp + 0x5f]
0000000180d787b5: xor      edx, edx
0000000180d787b7: movsd    qword ptr [rbp + 0x5f], xmm2
0000000180d787bc: call     0x180535480
0000000180d787c1: mov      rcx, qword ptr [rip + 0x7b4b470] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180d787c8: movaps   xmm9, xmm0
0000000180d787cc: movss    xmm11, dword ptr [rbx + 0xf4]
0000000180d787d5: cmp      dword ptr [rcx + 0xe0], 0
0000000180d787dc: jne      0x180d787e3
0000000180d787de: call     0x18048c140
0000000180d787e3: divss    xmm9, xmm11
0000000180d787e8: xor      r8d, r8d
0000000180d787eb: movaps   xmm1, xmm10
0000000180d787ef: movaps   xmm0, xmm9
0000000180d787f3: call     0x1866e5a40
0000000180d787f8: movss    xmm2, dword ptr [rbx + 0x68]
0000000180d787fd: movaps   xmm1, xmm0
0000000180d78800: mulss    xmm1, dword ptr [rbx + 0xe4]
0000000180d78808: subss    xmm2, xmm6
0000000180d7880c: mulss    xmm0, xmm0
0000000180d78810: addss    xmm2, xmm1
0000000180d78814: addss    xmm2, xmm2
0000000180d78818: divss    xmm2, xmm0
0000000180d7881c: movss    dword ptr [rbx + 0xe0], xmm2
0000000180d78824: movaps   xmm11, xmmword ptr [rsp + 0x70]
0000000180d7882a: movaps   xmm0, xmm7
0000000180d7882d: movaps   xmm10, xmmword ptr [rsp + 0x80]
0000000180d78836: movaps   xmm7, xmmword ptr [rsp + 0xb0]
0000000180d7883e: unpcklps xmm0, xmm8
0000000180d78842: movaps   xmm8, xmmword ptr [rsp + 0xa0]
0000000180d7884b: movsd    qword ptr [rdi], xmm0
0000000180d7884f: movss    dword ptr [rdi + 8], xmm6
0000000180d78854: movaps   xmm6, xmmword ptr [rsp + 0xc0]
0000000180d7885c: jmp      0x180d7888a
0000000180d7885e: mov      qword ptr [rsp + 0x28], 0
0000000180d78867: lea      rcx, [rbp - 0x41]
0000000180d7886b: movaps   xmm3, xmm9
0000000180d7886f: mov      byte ptr [rsp + 0x20], sil
0000000180d78874: mov      r8, rbx
0000000180d78877: call     0x1833e14e0 ; XLua.DelegateBridge.__Gen_Delegate_Imp4128 [6783]
0000000180d7887c: movsd    xmm0, qword ptr [rax]
0000000180d78880: mov      eax, dword ptr [rax + 8]
0000000180d78883: movsd    qword ptr [rdi], xmm0
0000000180d78887: mov      dword ptr [rdi + 8], eax
0000000180d7888a: lea      r11, [rsp + 0xd0]
0000000180d78892: mov      rax, rdi
0000000180d78895: mov      rbx, qword ptr [r11 + 0x38]
0000000180d78899: movaps   xmm9, xmmword ptr [r11 - 0x40]
0000000180d7889e: mov      rsp, r11
0000000180d788a1: pop      rdi
0000000180d788a2: pop      rsi
0000000180d788a3: pop      rbp
0000000180d788a4: ret      
0000000180d788a5: call     0x18048c0b0
0000000180d788aa: int3     
0000000180d788ab: int3     
0000000180d788ac: int3     
0000000180d788ad: int3     
0000000180d788ae: int3     
0000000180d788af: int3     