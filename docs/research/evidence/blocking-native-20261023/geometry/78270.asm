; Torappu.Battle.BlockBalancer.CalculateBlockOffset metadata=78270 token=0x60131bf VA=0x180af3090 RVA=0xaf3090 size=0x900
0000000180af3090: push     rbx
0000000180af3092: push     rsi
0000000180af3093: push     r14
0000000180af3095: sub      rsp, 0xf0
0000000180af309c: cmp      byte ptr [rip + 0x819fcdb], 0
0000000180af30a3: mov      r14, r8
0000000180af30a6: mov      rbx, rdx
0000000180af30a9: mov      rsi, rcx
0000000180af30ac: jne      0x180af30d9
0000000180af30ae: lea      rcx, [rip + 0x7da8973] ; TypeInfo type(0x15, data=0x1889947c0) @0x18889ba28
0000000180af30b5: call     0x18048bf00
0000000180af30ba: lea      rcx, [rip + 0x7e01b4f] ; TypeInfo type(0x15, data=0x1889af1c0) @0x1888f4c10
0000000180af30c1: call     0x18048bf00
0000000180af30c6: lea      rcx, [rip + 0x7dcbafb] ; TypeInfo Torappu.Battle.MapUtil @0x1888bebc8
0000000180af30cd: call     0x18048bf00
0000000180af30d2: mov      byte ptr [rip + 0x819fca5], 1
0000000180af30d9: mov      qword ptr [rsp + 0x110], rbp
0000000180af30e1: xor      eax, eax
0000000180af30e3: mov      qword ptr [rsp + 0x120], rdi
0000000180af30eb: mov      qword ptr [rsp + 0xe8], r12
0000000180af30f3: mov      qword ptr [rsp + 0xe0], r15
0000000180af30fb: movaps   xmmword ptr [rsp + 0xd0], xmm6
0000000180af3103: movaps   xmmword ptr [rsp + 0xc0], xmm7
0000000180af310b: movaps   xmmword ptr [rsp + 0xb0], xmm8
0000000180af3114: movaps   xmmword ptr [rsp + 0xa0], xmm9
0000000180af311d: movaps   xmmword ptr [rsp + 0x90], xmm10
0000000180af3126: movaps   xmmword ptr [rsp + 0x80], xmm11
0000000180af312f: movaps   xmmword ptr [rsp + 0x70], xmm12
0000000180af3135: movaps   xmmword ptr [rsp + 0x60], xmm13
0000000180af313b: movaps   xmmword ptr [rsp + 0x50], xmm14
0000000180af3141: movaps   xmmword ptr [rsp + 0x40], xmm15
0000000180af3147: mov      qword ptr [rsp + 0x20], rax
0000000180af314c: test     rbx, rbx
0000000180af314f: je       0x180af3935
0000000180af3155: xor      edx, edx
0000000180af3157: mov      rcx, rbx
0000000180af315a: call     0x180ad4250 ; Torappu.Battle.VisualObject.get_mapPosition [77866]
0000000180af315f: mov      qword ptr [rsp + 0x118], rax
0000000180af3167: test     r14, r14
0000000180af316a: je       0x180af3935
0000000180af3170: xor      edx, edx
0000000180af3172: mov      rcx, r14
0000000180af3175: call     0x180a64c30
0000000180af317a: movss    xmm7, dword ptr [rsp + 0x118]
0000000180af3183: movss    xmm8, dword ptr [rsp + 0x11c]
0000000180af318d: mov      qword ptr [rsp + 0x28], rax
0000000180af3192: subss    xmm7, dword ptr [rsp + 0x28]
0000000180af3198: subss    xmm8, dword ptr [rsp + 0x2c]
0000000180af319f: mov      rax, qword ptr [r14]
0000000180af31a2: xor      r12d, r12d
0000000180af31a5: mov      ecx, dword ptr [rax + 0x11c]
0000000180af31ab: add      ecx, -0x60
0000000180af31ae: cmp      ecx, 0x12
0000000180af31b1: ja       0x180af31f3
0000000180af31b3: movsxd   rax, ecx
0000000180af31b6: lea      rdx, [rip - 0xaf31bd]
0000000180af31bd: mov      ecx, dword ptr [rdx + rax*4 + 0xaf393c]
0000000180af31c4: add      rcx, rdx
0000000180af31c7: jmp      rcx
0000000180af31c9: xor      edx, edx
0000000180af31cb: mov      rcx, r14
0000000180af31ce: call     0x180a7ed80 ; Torappu.Battle.Enemy.get_minBlockDistToTarget [76552]
0000000180af31d3: jmp      0x180af3266
0000000180af31d8: xor      edx, edx
0000000180af31da: mov      rcx, r14
0000000180af31dd: call     0x180a3b970 ; Torappu.Battle.Character.get_minBlockDistToTarget [75893]
0000000180af31e2: jmp      0x180af3266
0000000180af31e7: xor      edx, edx
0000000180af31e9: mov      rcx, r14
0000000180af31ec: call     0x180aa8470 ; Torappu.Battle.GiantTrap.get_minBlockDistToTarget [77105]
0000000180af31f1: jmp      0x180af3266
0000000180af31f3: cmp      byte ptr [rip + 0x81d95f6], r12b
0000000180af31fa: mov      rbx, qword ptr [rip + 0x7e4b29f] ; TypeInfo Torappu.Battle.IBlocker @0x18893e4a0
0000000180af3201: mov      rdi, qword ptr [r14]
0000000180af3204: je       0x180af320e
0000000180af3206: mov      rcx, rdi
0000000180af3209: call     0x180446d00
0000000180af320e: movzx    edx, word ptr [rdi + 0x12e]
0000000180af3215: movzx    ecx, r12w
0000000180af3219: cmp      r12w, dx
0000000180af321d: jae      0x180af3248
0000000180af321f: mov      r8, qword ptr [rdi + 0xb0]
0000000180af3226: nop      word ptr [rax + rax]
0000000180af3230: movzx    eax, cx
0000000180af3233: add      rax, rax
0000000180af3236: cmp      qword ptr [r8 + rax*8], rbx
0000000180af323a: je       0x180af32d6
0000000180af3240: inc      cx
0000000180af3243: cmp      cx, dx
0000000180af3246: jb       0x180af3230
0000000180af3248: mov      r8d, 6
0000000180af324e: mov      rdx, rbx
0000000180af3251: mov      rcx, r14
0000000180af3254: call     0x180445cc0
0000000180af3259: mov      r8, qword ptr [rax]
0000000180af325c: mov      rcx, r14
0000000180af325f: mov      rdx, qword ptr [rax + 8]
0000000180af3263: call     r8
0000000180af3266: mov      rcx, qword ptr [rip + 0x7dcb95b] ; TypeInfo Torappu.Battle.MapUtil @0x1888bebc8
0000000180af326d: movaps   xmm6, xmm0
0000000180af3270: cmp      dword ptr [rcx + 0xe0], r12d
0000000180af3277: jne      0x180af327e
0000000180af3279: call     0x18048c140
0000000180af327e: movss    dword ptr [rsp + 0x118], xmm7
0000000180af3287: movss    dword ptr [rsp + 0x11c], xmm8
0000000180af3291: movaps   xmm0, xmm7
0000000180af3294: movaps   xmm1, xmm8
0000000180af3298: mulss    xmm0, xmm7
0000000180af329c: mulss    xmm1, xmm8
0000000180af32a1: addss    xmm1, xmm0
0000000180af32a5: movaps   xmm0, xmm6
0000000180af32a8: mulss    xmm0, xmm6
0000000180af32ac: comiss   xmm0, xmm1
0000000180af32af: ja       0x180af32f6
0000000180af32b1: movaps   xmm0, xmm7
0000000180af32b4: unpcklps xmm0, xmm8
0000000180af32b8: movaps   xmm11, xmm0
0000000180af32bc: movsd    qword ptr [rsp + 0x118], xmm0
0000000180af32c5: movss    xmm10, dword ptr [rsp + 0x118]
0000000180af32cf: shufps   xmm11, xmm11, 0x55
0000000180af32d4: jmp      0x180af332d
0000000180af32d6: movzx    ecx, cx
0000000180af32d9: add      rcx, rcx
0000000180af32dc: mov      eax, dword ptr [r8 + rcx*8 + 8]
0000000180af32e1: add      eax, 6
0000000180af32e4: cdqe     
0000000180af32e6: add      rax, 0x14
0000000180af32ea: shl      rax, 4
0000000180af32ee: add      rax, rdi
0000000180af32f1: jmp      0x180af3259
0000000180af32f6: xor      edx, edx
0000000180af32f8: lea      rcx, [rsp + 0x118]
0000000180af3300: call     0x180535530
0000000180af3305: mov      qword ptr [rsp + 0x118], rax
0000000180af330d: movss    xmm0, dword ptr [rsp + 0x11c]
0000000180af3316: movss    xmm10, dword ptr [rsp + 0x118]
0000000180af3320: mulss    xmm0, xmm6
0000000180af3324: mulss    xmm10, xmm6
0000000180af3329: movaps   xmm11, xmm0
0000000180af332d: xor      edx, edx
0000000180af332f: mov      rcx, r14
0000000180af3332: call     0x180a64c30
0000000180af3337: mov      qword ptr [rsp + 0x118], rax
0000000180af333f: movaps   xmm12, xmm10
0000000180af3343: addss    xmm12, dword ptr [rsp + 0x118]
0000000180af334d: movaps   xmm13, xmm11
0000000180af3351: addss    xmm13, dword ptr [rsp + 0x11c]
0000000180af335b: mov      ebx, r12d
0000000180af335e: mov      edi, r12d
0000000180af3361: test     rsi, rsi
0000000180af3364: je       0x180af3935
0000000180af336a: movss    xmm15, dword ptr [rip + 0x634ee69]
0000000180af3373: mov      rdx, qword ptr [rip + 0x7da86ae] ; TypeInfo type(0x15, data=0x1889947c0) @0x18889ba28
0000000180af337a: xor      ecx, ecx
0000000180af337c: mov      r8, rsi
0000000180af337f: call     0x180005310
0000000180af3384: cmp      edi, eax
0000000180af3386: jge      0x180af38b0
0000000180af338c: mov      rdx, qword ptr [rip + 0x7e0187d] ; TypeInfo type(0x15, data=0x1889af1c0) @0x1888f4c10
0000000180af3393: xor      ecx, ecx
0000000180af3395: mov      r9d, ebx
0000000180af3398: mov      r8, rsi
0000000180af339b: call     0x180004e80
0000000180af33a0: test     rax, rax
0000000180af33a3: je       0x180af3935
0000000180af33a9: xor      edx, edx
0000000180af33ab: mov      rcx, rax
0000000180af33ae: call     0x180a7fef0 ; Torappu.Battle.Enemy.get_stableBlockPosition [76363]
0000000180af33b3: mov      qword ptr [rsp + 0x28], rax
0000000180af33b8: movaps   xmm1, xmm12
0000000180af33bc: subss    xmm1, dword ptr [rsp + 0x28]
0000000180af33c2: movaps   xmm0, xmm13
0000000180af33c6: subss    xmm0, dword ptr [rsp + 0x2c]
0000000180af33cc: movss    dword ptr [rsp + 0x118], xmm1
0000000180af33d5: movss    dword ptr [rsp + 0x11c], xmm0
0000000180af33de: mulss    xmm0, xmm0
0000000180af33e2: mulss    xmm1, xmm1
0000000180af33e6: addss    xmm0, xmm1
0000000180af33ea: comiss   xmm15, xmm0
0000000180af33ee: ja       0x180af33f9
0000000180af33f0: inc      ebx
0000000180af33f2: mov      edi, ebx
0000000180af33f4: jmp      0x180af3373
0000000180af33f9: cmp      byte ptr [rip + 0x819c1b5], r12b
0000000180af3400: jne      0x180af3415
0000000180af3402: lea      rcx, [rip + 0x7d357b7] ; TypeInfo UnityEngine.Vector2 @0x188828bc0
0000000180af3409: call     0x18048bf00
0000000180af340e: mov      byte ptr [rip + 0x819c1a0], 1
0000000180af3415: mov      rax, qword ptr [rip + 0x7d357a4] ; TypeInfo UnityEngine.Vector2 @0x188828bc0
0000000180af341c: mov      rcx, qword ptr [rax + 0xb8]
0000000180af3423: movss    xmm8, dword ptr [rcx]
0000000180af3428: movss    xmm9, dword ptr [rcx + 4]
0000000180af342e: movss    xmm14, dword ptr [rip + 0x634edc1]
0000000180af3437: mov      r15d, r12d
0000000180af343a: mov      ebp, r12d
0000000180af343d: nop      dword ptr [rax]
0000000180af3440: cmp      byte ptr [rip + 0x81d93a9], r12b
0000000180af3447: mov      rbx, qword ptr [rip + 0x7da85da] ; TypeInfo type(0x15, data=0x1889947c0) @0x18889ba28
0000000180af344e: mov      rdi, qword ptr [rsi]
0000000180af3451: je       0x180af345b
0000000180af3453: mov      rcx, rdi
0000000180af3456: call     0x180446d00
0000000180af345b: movzx    edx, word ptr [rdi + 0x12e]
0000000180af3462: movzx    ecx, r12w
0000000180af3466: cmp      r12w, dx
0000000180af346a: jae      0x180af3498
0000000180af346c: mov      r8, qword ptr [rdi + 0xb0]
0000000180af3473: nop      dword ptr [rax]
0000000180af3477: nop      word ptr [rax + rax]
0000000180af3480: movzx    eax, cx
0000000180af3483: add      rax, rax
0000000180af3486: cmp      qword ptr [r8 + rax*8], rbx
0000000180af348a: je       0x180af3601
0000000180af3490: inc      cx
0000000180af3493: cmp      cx, dx
0000000180af3496: jb       0x180af3480
0000000180af3498: xor      r8d, r8d
0000000180af349b: mov      rdx, rbx
0000000180af349e: mov      rcx, rsi
0000000180af34a1: call     0x180445cc0
0000000180af34a6: mov      r8, qword ptr [rax]
0000000180af34a9: mov      rcx, rsi
0000000180af34ac: mov      rdx, qword ptr [rax + 8]
0000000180af34b0: call     r8
0000000180af34b3: cmp      ebp, eax
0000000180af34b5: jge      0x180af3738
0000000180af34bb: cmp      byte ptr [rip + 0x81d932e], r12b
0000000180af34c2: mov      rbx, qword ptr [rip + 0x7e01747] ; TypeInfo type(0x15, data=0x1889af1c0) @0x1888f4c10
0000000180af34c9: mov      rdi, qword ptr [rsi]
0000000180af34cc: je       0x180af34d6
0000000180af34ce: mov      rcx, rdi
0000000180af34d1: call     0x180446d00
0000000180af34d6: movzx    edx, word ptr [rdi + 0x12e]
0000000180af34dd: movzx    ecx, r12w
0000000180af34e1: cmp      r12w, dx
0000000180af34e5: jae      0x180af3508
0000000180af34e7: mov      r8, qword ptr [rdi + 0xb0]
0000000180af34ee: nop      
0000000180af34f0: movzx    eax, cx
0000000180af34f3: add      rax, rax
0000000180af34f6: cmp      qword ptr [r8 + rax*8], rbx
0000000180af34fa: je       0x180af361c
0000000180af3500: inc      cx
0000000180af3503: cmp      cx, dx
0000000180af3506: jb       0x180af34f0
0000000180af3508: xor      r8d, r8d
0000000180af350b: mov      rdx, rbx
0000000180af350e: mov      rcx, rsi
0000000180af3511: call     0x180445cc0
0000000180af3516: mov      r9, qword ptr [rax]
0000000180af3519: mov      edx, r15d
0000000180af351c: mov      r8, qword ptr [rax + 8]
0000000180af3520: mov      rcx, rsi
0000000180af3523: call     r9
0000000180af3526: test     rax, rax
0000000180af3529: je       0x180af3935
0000000180af352f: xor      edx, edx
0000000180af3531: mov      rcx, rax
0000000180af3534: call     0x180a7fef0 ; Torappu.Battle.Enemy.get_stableBlockPosition [76363]
0000000180af3539: mov      qword ptr [rsp + 0x28], rax
0000000180af353e: movaps   xmm7, xmm12
0000000180af3542: subss    xmm7, dword ptr [rsp + 0x28]
0000000180af3548: movaps   xmm6, xmm13
0000000180af354c: subss    xmm6, dword ptr [rsp + 0x2c]
0000000180af3552: movss    dword ptr [rsp + 0x20], xmm7
0000000180af3558: movss    dword ptr [rsp + 0x24], xmm6
0000000180af355e: movaps   xmm1, xmm6
0000000180af3561: movaps   xmm0, xmm7
0000000180af3564: mulss    xmm1, xmm6
0000000180af3568: mulss    xmm0, xmm7
0000000180af356c: addss    xmm1, xmm0
0000000180af3570: comiss   xmm15, xmm1
0000000180af3574: ja       0x180af368a
0000000180af357a: movaps   xmm0, xmm7
0000000180af357d: movaps   xmm1, xmm6
0000000180af3580: mulss    xmm0, xmm7
0000000180af3584: mulss    xmm1, xmm6
0000000180af3588: addss    xmm1, xmm0
0000000180af358c: movss    xmm0, dword ptr [rip + 0x634ec4c]
0000000180af3594: comiss   xmm0, xmm1
0000000180af3597: jbe      0x180af372d
0000000180af359d: cmp      byte ptr [rip + 0x819c1eb], r12b
0000000180af35a4: jne      0x180af35b9
0000000180af35a6: lea      rcx, [rip + 0x7dd0213] ; TypeInfo System.Math @0x1888c37c0
0000000180af35ad: call     0x18048bf00
0000000180af35b2: mov      byte ptr [rip + 0x819c1d6], 1
0000000180af35b9: mov      rcx, qword ptr [rip + 0x7dd0200] ; TypeInfo System.Math @0x1888c37c0
0000000180af35c0: cmp      dword ptr [rcx + 0xe0], r12d
0000000180af35c7: jne      0x180af35ce
0000000180af35c9: call     0x18048c140
0000000180af35ce: xor      edx, edx
0000000180af35d0: lea      rcx, [rsp + 0x20]
0000000180af35d5: call     0x180535530
0000000180af35da: mulss    xmm6, xmm6
0000000180af35de: xorps    xmm1, xmm1
0000000180af35e1: mov      qword ptr [rsp + 0x28], rax
0000000180af35e6: mulss    xmm7, xmm7
0000000180af35ea: xorps    xmm0, xmm0
0000000180af35ed: addss    xmm6, xmm7
0000000180af35f1: cvtss2sd xmm1, xmm6
0000000180af35f5: ucomisd  xmm0, xmm1
0000000180af35f9: ja       0x180af3637
0000000180af35fb: sqrtpd   xmm0, xmm1
0000000180af35ff: jmp      0x180af363f
0000000180af3601: movzx    ecx, cx
0000000180af3604: add      rcx, rcx
0000000180af3607: movsxd   rax, dword ptr [r8 + rcx*8 + 8]
0000000180af360c: add      rax, 0x14
0000000180af3610: shl      rax, 4
0000000180af3614: add      rax, rdi
0000000180af3617: jmp      0x180af34a6
0000000180af361c: movzx    ecx, cx
0000000180af361f: add      rcx, rcx
0000000180af3622: movsxd   rax, dword ptr [r8 + rcx*8 + 8]
0000000180af3627: add      rax, 0x14
0000000180af362b: shl      rax, 4
0000000180af362f: add      rax, rdi
0000000180af3632: jmp      0x180af3516
0000000180af3637: movaps   xmm0, xmm1
0000000180af363a: call     0x1804d2720
0000000180af363f: movss    xmm2, dword ptr [rip + 0x634e05d]
0000000180af3647: cvtsd2ss xmm0, xmm0
0000000180af364b: subss    xmm2, xmm0
0000000180af364f: movss    xmm0, dword ptr [rsp + 0x28]
0000000180af3655: inc      r15d
0000000180af3658: movss    xmm1, dword ptr [rsp + 0x2c]
0000000180af365e: mov      ebp, r15d
0000000180af3661: mulss    xmm0, xmm2
0000000180af3665: mulss    xmm1, xmm2
0000000180af3669: mulss    xmm0, xmm14
0000000180af366e: mulss    xmm1, xmm14
0000000180af3673: addss    xmm0, xmm8
0000000180af3678: addss    xmm1, xmm9
0000000180af367d: movaps   xmm8, xmm0
0000000180af3681: movaps   xmm9, xmm1
0000000180af3685: jmp      0x180af3440
0000000180af368a: mov      rdx, qword ptr [rip + 0x7e0157f] ; TypeInfo type(0x15, data=0x1889af1c0) @0x1888f4c10
0000000180af3691: xor      ecx, ecx
0000000180af3693: mov      r9d, r15d
0000000180af3696: mov      r8, rsi
0000000180af3699: call     0x180004e80
0000000180af369e: test     rax, rax
0000000180af36a1: je       0x180af3935
0000000180af36a7: xor      edx, edx
0000000180af36a9: mov      rcx, rax
0000000180af36ac: call     0x180a7fef0 ; Torappu.Battle.Enemy.get_stableBlockPosition [76363]
0000000180af36b1: xor      edx, edx
0000000180af36b3: mov      qword ptr [rsp + 0x28], rax
0000000180af36b8: mov      rcx, r14
0000000180af36bb: call     0x180a64c30
0000000180af36c0: movss    xmm6, dword ptr [rsp + 0x28]
0000000180af36c6: movss    xmm7, dword ptr [rsp + 0x2c]
0000000180af36cc: mov      qword ptr [rsp + 0x30], rax
0000000180af36d1: subss    xmm6, dword ptr [rsp + 0x30]
0000000180af36d7: subss    xmm7, dword ptr [rsp + 0x34]
0000000180af36dd: mov      rcx, qword ptr [rip + 0x7dcb4e4] ; TypeInfo Torappu.Battle.MapUtil @0x1888bebc8
0000000180af36e4: cmp      dword ptr [rcx + 0xe0], r12d
0000000180af36eb: jne      0x180af36f2
0000000180af36ed: call     0x18048c140
0000000180af36f2: xorps    xmm6, xmmword ptr [rip + 0x634c707]
0000000180af36f9: lea      rcx, [rsp + 0x118]
0000000180af3701: xor      edx, edx
0000000180af3703: movss    dword ptr [rsp + 0x11c], xmm6
0000000180af370c: movss    dword ptr [rsp + 0x118], xmm7
0000000180af3715: call     0x180535530
0000000180af371a: mov      qword ptr [rsp + 0x30], rax
0000000180af371f: addss    xmm8, dword ptr [rsp + 0x30]
0000000180af3726: addss    xmm9, dword ptr [rsp + 0x34]
0000000180af372d: inc      r15d
0000000180af3730: mov      ebp, r15d
0000000180af3733: jmp      0x180af3440
0000000180af3738: cmp      byte ptr [rip + 0x819c050], r12b
0000000180af373f: jne      0x180af3754
0000000180af3741: lea      rcx, [rip + 0x7dd0078] ; TypeInfo System.Math @0x1888c37c0
0000000180af3748: call     0x18048bf00
0000000180af374d: mov      byte ptr [rip + 0x819c03b], 1
0000000180af3754: mov      rcx, qword ptr [rip + 0x7dd0065] ; TypeInfo System.Math @0x1888c37c0
0000000180af375b: cmp      dword ptr [rcx + 0xe0], r12d
0000000180af3762: jne      0x180af3769
0000000180af3764: call     0x18048c140
0000000180af3769: movaps   xmm0, xmm8
0000000180af376d: movaps   xmm1, xmm9
0000000180af3771: mulss    xmm0, xmm8
0000000180af3776: xorps    xmm2, xmm2
0000000180af3779: mulss    xmm1, xmm9
0000000180af377e: addss    xmm1, xmm0
0000000180af3782: xorps    xmm0, xmm0
0000000180af3785: cvtss2sd xmm2, xmm1
0000000180af3789: ucomisd  xmm0, xmm2
0000000180af378d: ja       0x180af3795
0000000180af378f: sqrtpd   xmm0, xmm2
0000000180af3793: jmp      0x180af379d
0000000180af3795: movaps   xmm0, xmm2
0000000180af3798: call     0x1804d2720
0000000180af379d: cvtsd2ss xmm0, xmm0
0000000180af37a1: comiss   xmm0, dword ptr [rip + 0x634c5e0]
0000000180af37a8: ja       0x180af37e1
0000000180af37aa: cmp      byte ptr [rip + 0x819be04], r12b
0000000180af37b1: jne      0x180af37c6
0000000180af37b3: lea      rcx, [rip + 0x7d35406] ; TypeInfo UnityEngine.Vector2 @0x188828bc0
0000000180af37ba: call     0x18048bf00
0000000180af37bf: mov      byte ptr [rip + 0x819bdef], 1
0000000180af37c6: mov      rax, qword ptr [rip + 0x7d353f3] ; TypeInfo UnityEngine.Vector2 @0x188828bc0
0000000180af37cd: mov      rcx, qword ptr [rax + 0xb8]
0000000180af37d4: movss    xmm8, dword ptr [rcx]
0000000180af37d9: movss    xmm9, dword ptr [rcx + 4]
0000000180af37df: jmp      0x180af37eb
0000000180af37e1: divss    xmm8, xmm0
0000000180af37e6: divss    xmm9, xmm0
0000000180af37eb: mulss    xmm8, dword ptr [rip + 0x634d324]
0000000180af37f4: lea      rcx, [rsp + 0x118]
0000000180af37fc: xor      edx, edx
0000000180af37fe: mulss    xmm9, dword ptr [rip + 0x634d311]
0000000180af3807: addss    xmm8, xmm10
0000000180af380c: addss    xmm9, xmm11
0000000180af3811: movss    dword ptr [rsp + 0x118], xmm8
0000000180af381b: movss    dword ptr [rsp + 0x11c], xmm9
0000000180af3825: call     0x180535530
0000000180af382a: cmp      byte ptr [rip + 0x819bf5e], r12b
0000000180af3831: mov      qword ptr [rsp + 0x118], rax
0000000180af3839: jne      0x180af384e
0000000180af383b: lea      rcx, [rip + 0x7dcff7e] ; TypeInfo System.Math @0x1888c37c0
0000000180af3842: call     0x18048bf00
0000000180af3847: mov      byte ptr [rip + 0x819bf41], 1
0000000180af384e: mov      rcx, qword ptr [rip + 0x7dcff6b] ; TypeInfo System.Math @0x1888c37c0
0000000180af3855: cmp      dword ptr [rcx + 0xe0], r12d
0000000180af385c: jne      0x180af3863
0000000180af385e: call     0x18048c140
0000000180af3863: mulss    xmm10, xmm10
0000000180af3868: xorps    xmm1, xmm1
0000000180af386b: mulss    xmm11, xmm11
0000000180af3870: xorps    xmm0, xmm0
0000000180af3873: addss    xmm10, xmm11
0000000180af3878: cvtss2sd xmm1, xmm10
0000000180af387d: ucomisd  xmm0, xmm1
0000000180af3881: ja       0x180af3889
0000000180af3883: sqrtpd   xmm0, xmm1
0000000180af3887: jmp      0x180af3891
0000000180af3889: movaps   xmm0, xmm1
0000000180af388c: call     0x1804d2720
0000000180af3891: cvtsd2ss xmm0, xmm0
0000000180af3895: movaps   xmm10, xmm0
0000000180af3899: mulss    xmm0, dword ptr [rsp + 0x11c]
0000000180af38a2: mulss    xmm10, dword ptr [rsp + 0x118]
0000000180af38ac: movaps   xmm11, xmm0
0000000180af38b0: movaps   xmm15, xmmword ptr [rsp + 0x40]
0000000180af38b6: movaps   xmm0, xmm10
0000000180af38ba: movaps   xmm14, xmmword ptr [rsp + 0x50]
0000000180af38c0: movaps   xmm13, xmmword ptr [rsp + 0x60]
0000000180af38c6: movaps   xmm12, xmmword ptr [rsp + 0x70]
0000000180af38cc: movaps   xmm10, xmmword ptr [rsp + 0x90]
0000000180af38d5: movaps   xmm9, xmmword ptr [rsp + 0xa0]
0000000180af38de: movaps   xmm8, xmmword ptr [rsp + 0xb0]
0000000180af38e7: movaps   xmm7, xmmword ptr [rsp + 0xc0]
0000000180af38ef: movaps   xmm6, xmmword ptr [rsp + 0xd0]
0000000180af38f7: mov      r15, qword ptr [rsp + 0xe0]
0000000180af38ff: mov      r12, qword ptr [rsp + 0xe8]
0000000180af3907: mov      rdi, qword ptr [rsp + 0x120]
0000000180af390f: mov      rbp, qword ptr [rsp + 0x110]
0000000180af3917: unpcklps xmm0, xmm11
0000000180af391b: movaps   xmm11, xmmword ptr [rsp + 0x80]
0000000180af3924: movq     rax, xmm0
0000000180af3929: add      rsp, 0xf0
0000000180af3930: pop      r14
0000000180af3932: pop      rsi
0000000180af3933: pop      rbx
0000000180af3934: ret      
0000000180af3935: call     0x18048c0b0
0000000180af393a: int3     
0000000180af393b: nop      
0000000180af393c: leave    
0000000180af393d: xor      dword ptr [rdi - 0x50ce3700], ebp
0000000180af3943: add      cl, cl
0000000180af3945: xor      dword ptr [rdi - 0x50ce2800], ebp
0000000180af394b: add      al, bl
0000000180af394d: xor      dword ptr [rdi - 0x50ce2800], ebp
0000000180af3953: add      cl, cl
0000000180af3955: xor      dword ptr [rdi - 0x50ce3700], ebp
0000000180af395b: add      cl, cl
0000000180af395d: xor      dword ptr [rdi - 0x50ce3700], ebp
0000000180af3963: add      bh, ah
0000000180af3965: xor      dword ptr [rdi - 0x50ce3700], ebp
0000000180af396b: add      cl, cl
0000000180af396d: xor      dword ptr [rdi - 0x50ce2800], ebp
0000000180af3973: add      cl, cl
0000000180af3975: xor      dword ptr [rdi - 0x50ce2800], ebp
0000000180af397b: add      cl, cl
0000000180af397d: xor      dword ptr [rdi - 0x50ce3700], ebp
0000000180af3983: add      cl, cl
0000000180af3985: xor      dword ptr [rdi - 0x33333400], ebp
0000000180af398b: int3     
0000000180af398c: int3     
0000000180af398d: int3     
0000000180af398e: int3     
0000000180af398f: int3     