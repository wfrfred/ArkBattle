; Torappu.Battle.Tile.TileDynamicPositionController.OnFixedUpdate metadata=70795 token=0x601148c VA=0x1808ba700 RVA=0x8ba700 size=0x540
00000001808ba700: mov      qword ptr [rsp + 0x18], rbx
00000001808ba705: push     rbp
00000001808ba706: push     rsi
00000001808ba707: push     r15
00000001808ba709: lea      rbp, [rsp - 0x47]
00000001808ba70e: sub      rsp, 0xb0
00000001808ba715: cmp      byte ptr [rip + 0x83d6f5f], 0
00000001808ba71c: mov      rbx, rdx
00000001808ba71f: mov      rsi, rcx
00000001808ba722: jne      0x1808ba773
00000001808ba724: lea      rcx, [rip + 0x806d635] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
00000001808ba72b: call     0x18048bf00
00000001808ba730: lea      rcx, [rip + 0x7f9ffc9] ; TypeInfo Torappu.FP @0x18885a700
00000001808ba737: call     0x18048bf00
00000001808ba73c: lea      rcx, [rip + 0x7fc8455] ; GenericMethodInfo 279449 @0x188882b98
00000001808ba743: call     0x18048bf00
00000001808ba748: lea      rcx, [rip + 0x7fc8681] ; GenericMethodInfo 279450 @0x188882dd0
00000001808ba74f: call     0x18048bf00
00000001808ba754: lea      rcx, [rip + 0x80259ed] ; GenericMethodInfo 282061 @0x1888e0148
00000001808ba75b: call     0x18048bf00
00000001808ba760: lea      rcx, [rip + 0x8075351] ; TypeInfo Torappu.Battle.Tile.TileDynamicPositionController @0x18892fab8
00000001808ba767: call     0x18048bf00
00000001808ba76c: mov      byte ptr [rip + 0x83d6f08], 1
00000001808ba773: mov      rax, qword ptr [rip + 0x807533e] ; TypeInfo Torappu.Battle.Tile.TileDynamicPositionController @0x18892fab8
00000001808ba77a: xor      r15d, r15d
00000001808ba77d: mov      qword ptr [rbp - 0x39], r15
00000001808ba781: mov      qword ptr [rbp + 0x7f], r15
00000001808ba785: mov      rcx, qword ptr [rax + 0xb8]
00000001808ba78c: mov      rcx, qword ptr [rcx + 0x38]
00000001808ba790: test     rcx, rcx
00000001808ba793: jne      0x1808bac1d
00000001808ba799: mov      qword ptr [rsp + 0xd8], r14
00000001808ba7a1: movaps   xmmword ptr [rsp + 0xa0], xmm6
00000001808ba7a9: movsd    xmm0, qword ptr [rsi + 0x30]
00000001808ba7ae: mov      eax, dword ptr [rsi + 0x38]
00000001808ba7b1: movsd    qword ptr [rsi + 0x3c], xmm0
00000001808ba7b6: mov      dword ptr [rsi + 0x44], eax
00000001808ba7b9: cmp      byte ptr [rip + 0x83d4df6], r15b
00000001808ba7c0: jne      0x1808ba7d5
00000001808ba7c2: lea      rcx, [rip + 0x7f6f827] ; TypeInfo UnityEngine.Vector3 @0x188829ff0
00000001808ba7c9: call     0x18048bf00
00000001808ba7ce: mov      byte ptr [rip + 0x83d4de1], 1
00000001808ba7d5: mov      qword ptr [rsp + 0xd0], rdi
00000001808ba7dd: movaps   xmmword ptr [rsp + 0x90], xmm7
00000001808ba7e5: movaps   xmmword ptr [rsp + 0x80], xmm8
00000001808ba7ee: movaps   xmmword ptr [rsp + 0x70], xmm9
00000001808ba7f4: mov      rax, qword ptr [rip + 0x7f6f7f5] ; TypeInfo UnityEngine.Vector3 @0x188829ff0
00000001808ba7fb: mov      ebx, r15d
00000001808ba7fe: mov      rcx, qword ptr [rax + 0xb8]
00000001808ba805: mov      rax, qword ptr [rsi + 0x50]
00000001808ba809: movsd    xmm6, qword ptr [rcx]
00000001808ba80d: mov      r14d, dword ptr [rcx + 8]
00000001808ba811: mov      ecx, r15d
00000001808ba814: movsd    qword ptr [rbp - 0x29], xmm6
00000001808ba819: mov      dword ptr [rbp - 0x21], r14d
00000001808ba81d: test     rax, rax
00000001808ba820: je       0x1808bac2d
00000001808ba826: cmp      ecx, dword ptr [rax + 0x18]
00000001808ba829: jge      0x1808ba904
00000001808ba82f: mov      rcx, qword ptr [rsi + 0x50]
00000001808ba833: test     rcx, rcx
00000001808ba836: je       0x1808bac2d
00000001808ba83c: mov      r8, qword ptr [rip + 0x7fc858d] ; GenericMethodInfo 279450 @0x188882dd0
00000001808ba843: mov      edx, ebx
00000001808ba845: call     0x184afcf00
00000001808ba84a: mov      rdi, rax
00000001808ba84d: test     rax, rax
00000001808ba850: je       0x1808ba8ee
00000001808ba856: cmp      byte ptr [rip + 0x83d6e17], r15b
00000001808ba85d: jne      0x1808ba872
00000001808ba85f: lea      rcx, [rip + 0x8075252] ; TypeInfo Torappu.Battle.Tile.TileDynamicPositionController @0x18892fab8
00000001808ba866: call     0x18048bf00
00000001808ba86b: mov      byte ptr [rip + 0x83d6e02], 1
00000001808ba872: mov      rcx, qword ptr [rip + 0x807523f] ; TypeInfo Torappu.Battle.Tile.TileDynamicPositionController @0x18892fab8
00000001808ba879: mov      rdx, qword ptr [rcx + 0xb8]
00000001808ba880: mov      rcx, qword ptr [rdx]
00000001808ba883: test     rcx, rcx
00000001808ba886: jne      0x1808ba88e
00000001808ba888: mov      rax, qword ptr [rsi + 0x10]
00000001808ba88c: jmp      0x1808ba899
00000001808ba88e: xor      r8d, r8d
00000001808ba891: mov      rdx, rsi
00000001808ba894: call     0x183334190 ; XLua.DelegateBridge.__Gen_Delegate_Imp3029 [5684]
00000001808ba899: xor      r9d, r9d
00000001808ba89c: lea      rcx, [rbp - 0x19]
00000001808ba8a0: mov      r8, rax
00000001808ba8a3: mov      rdx, rdi
00000001808ba8a6: call     0x1808a8f00
00000001808ba8ab: movss    xmm4, dword ptr [rbp - 0x29]
00000001808ba8b0: movss    xmm3, dword ptr [rbp - 0x25]
00000001808ba8b5: movss    xmm2, dword ptr [rbp - 0x21]
00000001808ba8ba: movsd    xmm1, qword ptr [rax]
00000001808ba8be: addss    xmm2, dword ptr [rax + 8]
00000001808ba8c3: movaps   xmm0, xmm1
00000001808ba8c6: movsd    qword ptr [rbp - 9], xmm1
00000001808ba8cb: shufps   xmm0, xmm0, 0x55
00000001808ba8cf: addss    xmm4, xmm1
00000001808ba8d3: addss    xmm3, xmm0
00000001808ba8d7: movaps   xmm0, xmm4
00000001808ba8da: movd     r14d, xmm2
00000001808ba8df: unpcklps xmm0, xmm3
00000001808ba8e2: movaps   xmm6, xmm0
00000001808ba8e5: movsd    qword ptr [rbp - 0x29], xmm0
00000001808ba8ea: mov      dword ptr [rbp - 0x21], r14d
00000001808ba8ee: mov      rax, qword ptr [rsi + 0x50]
00000001808ba8f2: inc      ebx
00000001808ba8f4: mov      ecx, ebx
00000001808ba8f6: test     rax, rax
00000001808ba8f9: je       0x1808bac2d
00000001808ba8ff: jmp      0x1808ba826
00000001808ba904: movsd    xmm0, qword ptr [rsi + 0x18]
00000001808ba909: movss    xmm1, dword ptr [rsi + 0x20]
00000001808ba90e: movaps   xmm3, xmm0
00000001808ba911: movaps   xmm2, xmm0
00000001808ba914: movsd    qword ptr [rbp - 9], xmm0
00000001808ba919: subss    xmm2, dword ptr [rbp - 0x29]
00000001808ba91e: shufps   xmm3, xmm3, 0x55
00000001808ba922: subss    xmm3, dword ptr [rbp - 0x25]
00000001808ba927: movd     xmm0, r14d
00000001808ba92c: subss    xmm1, xmm0
00000001808ba930: movss    xmm7, dword ptr [rip + 0x658544c]
00000001808ba938: mov      eax, r15d
00000001808ba93b: mulss    xmm3, xmm3
00000001808ba93f: mulss    xmm2, xmm2
00000001808ba943: mulss    xmm1, xmm1
00000001808ba947: addss    xmm3, xmm2
00000001808ba94b: addss    xmm3, xmm1
00000001808ba94f: comiss   xmm7, xmm3
00000001808ba952: seta     al
00000001808ba955: test     eax, eax
00000001808ba957: jne      0x1808ba992
00000001808ba959: movsd    xmm0, qword ptr [rsi + 0x30]
00000001808ba95e: mov      eax, dword ptr [rsi + 0x38]
00000001808ba961: movsd    qword ptr [rsi + 0x24], xmm0
00000001808ba966: movsd    qword ptr [rsi + 0x18], xmm6
00000001808ba96b: mov      dword ptr [rsi + 0x2c], eax
00000001808ba96e: mov      dword ptr [rsi + 0x20], r14d
00000001808ba972: mov      rcx, qword ptr [rip + 0x806d3e7] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
00000001808ba979: cmp      dword ptr [rcx + 0xe0], r15d
00000001808ba980: jne      0x1808ba987
00000001808ba982: call     0x18048c140
00000001808ba987: xor      ecx, ecx
00000001808ba989: call     0x180644590 ; Torappu.Battle.BattleController.get_userFixedPlayTime [64469]
00000001808ba98e: mov      qword ptr [rsi + 0x48], rax
00000001808ba992: mov      rcx, qword ptr [rip + 0x806d3c7] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
00000001808ba999: cmp      dword ptr [rcx + 0xe0], r15d
00000001808ba9a0: jne      0x1808ba9a7
00000001808ba9a2: call     0x18048c140
00000001808ba9a7: xor      ecx, ecx
00000001808ba9a9: call     0x180644590 ; Torappu.Battle.BattleController.get_userFixedPlayTime [64469]
00000001808ba9ae: mov      rcx, qword ptr [rip + 0x7f9fd4b] ; TypeInfo Torappu.FP @0x18885a700
00000001808ba9b5: mov      rbx, rax
00000001808ba9b8: mov      rdi, qword ptr [rsi + 0x48]
00000001808ba9bc: cmp      dword ptr [rcx + 0xe0], r15d
00000001808ba9c3: jne      0x1808ba9ca
00000001808ba9c5: call     0x18048c140
00000001808ba9ca: xor      r8d, r8d
00000001808ba9cd: mov      rdx, rdi
00000001808ba9d0: mov      rcx, rbx
00000001808ba9d3: call     0x1866fba10
00000001808ba9d8: mov      rcx, qword ptr [rip + 0x8025769] ; GenericMethodInfo 282061 @0x1888e0148
00000001808ba9df: mov      rbx, rax
00000001808ba9e2: call     0x185337c50
00000001808ba9e7: test     rax, rax
00000001808ba9ea: je       0x1808bac2d
00000001808ba9f0: xor      edx, edx
00000001808ba9f2: mov      rcx, rax
00000001808ba9f5: call     0x1808871a0 ; Torappu.Battle.Map.get_tileMoveTime [69966]
00000001808ba9fa: xor      edx, edx
00000001808ba9fc: call     0x1866fdad0
00000001808baa01: xor      r8d, r8d
00000001808baa04: mov      qword ptr [rbp - 0x39], rax
00000001808baa08: mov      rdx, rax
00000001808baa0b: mov      rcx, rbx
00000001808baa0e: call     0x185ed91c0
00000001808baa13: test     al, al
00000001808baa15: jne      0x1808babda
00000001808baa1b: mov      rcx, qword ptr [rip + 0x806d33e] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
00000001808baa22: cmp      dword ptr [rcx + 0xe0], r15d
00000001808baa29: jne      0x1808baa30
00000001808baa2b: call     0x18048c140
00000001808baa30: xor      ecx, ecx
00000001808baa32: call     0x180644590 ; Torappu.Battle.BattleController.get_userFixedPlayTime [64469]
00000001808baa37: mov      rcx, qword ptr [rip + 0x7f9fcc2] ; TypeInfo Torappu.FP @0x18885a700
00000001808baa3e: mov      rbx, rax
00000001808baa41: mov      rdi, qword ptr [rsi + 0x48]
00000001808baa45: cmp      dword ptr [rcx + 0xe0], r15d
00000001808baa4c: jne      0x1808baa53
00000001808baa4e: call     0x18048c140
00000001808baa53: xor      r8d, r8d
00000001808baa56: mov      rdx, rdi
00000001808baa59: mov      rcx, rbx
00000001808baa5c: call     0x1866fba10
00000001808baa61: xor      edx, edx
00000001808baa63: mov      qword ptr [rbp + 0x7f], rax
00000001808baa67: lea      rcx, [rbp + 0x7f]
00000001808baa6b: call     0x1866fae20
00000001808baa70: xor      edx, edx
00000001808baa72: lea      rcx, [rbp - 0x39]
00000001808baa76: movaps   xmm6, xmm0
00000001808baa79: call     0x1866fae20
00000001808baa7e: xorps    xmm1, xmm1
00000001808baa81: comiss   xmm1, xmm6
00000001808baa84: ja       0x1808baa90
00000001808baa86: comiss   xmm6, xmm0
00000001808baa89: jbe      0x1808baa93
00000001808baa8b: movaps   xmm6, xmm0
00000001808baa8e: jmp      0x1808baa93
00000001808baa90: xorps    xmm6, xmm6
00000001808baa93: xor      edx, edx
00000001808baa95: movaps   xmm0, xmm6
00000001808baa98: call     0x1866fdad0
00000001808baa9d: mov      rdx, qword ptr [rbp - 0x39]
00000001808baaa1: xor      r8d, r8d
00000001808baaa4: movsd    xmm6, qword ptr [rsi + 0x24]
00000001808baaa9: mov      rcx, rax
00000001808baaac: mov      ebx, dword ptr [rsi + 0x2c]
00000001808baaaf: movsd    xmm8, qword ptr [rsi + 0x18]
00000001808baab5: mov      edi, dword ptr [rsi + 0x20]
00000001808baab8: call     0x1866fd730
00000001808baabd: xor      edx, edx
00000001808baabf: mov      qword ptr [rbp + 0x7f], rax
00000001808baac3: lea      rcx, [rbp + 0x7f]
00000001808baac7: call     0x1866fae20
00000001808baacc: mov      rcx, qword ptr [rip + 0x8025675] ; GenericMethodInfo 282061 @0x1888e0148
00000001808baad3: movaps   xmm9, xmm0
00000001808baad7: call     0x185337c50
00000001808baadc: test     rax, rax
00000001808baadf: je       0x1808bac2d
00000001808baae5: xor      edx, edx
00000001808baae7: mov      rcx, rax
00000001808baaea: call     0x180887130 ; Torappu.Battle.Map.get_tileMoveEase [69967]
00000001808baaef: movaps   xmm3, xmm9
00000001808baaf3: mov      qword ptr [rsp + 0x28], r15
00000001808baaf8: lea      r8, [rbp - 0x29]
00000001808baafc: movsd    qword ptr [rbp - 0x29], xmm8
00000001808bab02: lea      rdx, [rbp - 0x19]
00000001808bab06: mov      dword ptr [rbp - 0x21], edi
00000001808bab09: lea      rcx, [rbp - 9]
00000001808bab0d: movsd    qword ptr [rbp - 0x19], xmm6
00000001808bab12: mov      dword ptr [rbp - 0x11], ebx
00000001808bab15: mov      dword ptr [rsp + 0x20], eax
00000001808bab19: call     0x184250fd0
00000001808bab1e: movsd    xmm2, qword ptr [rsi + 0x3c]
00000001808bab23: movss    xmm3, dword ptr [rsi + 0x40]
00000001808bab28: movss    xmm1, dword ptr [rsi + 0x44]
00000001808bab2d: movsd    xmm0, qword ptr [rax]
00000001808bab31: mov      ecx, dword ptr [rax + 8]
00000001808bab34: movsd    qword ptr [rbp - 0x19], xmm0
00000001808bab39: subss    xmm2, dword ptr [rbp - 0x19]
00000001808bab3e: subss    xmm3, dword ptr [rbp - 0x15]
00000001808bab43: movsd    qword ptr [rsi + 0x30], xmm0
00000001808bab48: movd     xmm0, ecx
00000001808bab4c: subss    xmm1, xmm0
00000001808bab50: mov      dword ptr [rsi + 0x38], ecx
00000001808bab53: mulss    xmm3, xmm3
00000001808bab57: mulss    xmm2, xmm2
00000001808bab5b: mulss    xmm1, xmm1
00000001808bab5f: addss    xmm3, xmm2
00000001808bab63: addss    xmm3, xmm1
00000001808bab67: comiss   xmm7, xmm3
00000001808bab6a: seta     r15b
00000001808bab6e: test     r15d, r15d
00000001808bab71: jne      0x1808babda
00000001808bab73: cmp      byte ptr [rip + 0x83d6afa], r15b
00000001808bab7a: jne      0x1808bab8f
00000001808bab7c: lea      rcx, [rip + 0x8074f35] ; TypeInfo Torappu.Battle.Tile.TileDynamicPositionController @0x18892fab8
00000001808bab83: call     0x18048bf00
00000001808bab88: mov      byte ptr [rip + 0x83d6ae5], 1
00000001808bab8f: mov      rax, qword ptr [rip + 0x8074f22] ; TypeInfo Torappu.Battle.Tile.TileDynamicPositionController @0x18892fab8
00000001808bab96: mov      rcx, qword ptr [rax + 0xb8]
00000001808bab9d: mov      rcx, qword ptr [rcx]
00000001808baba0: test     rcx, rcx
00000001808baba3: jne      0x1808babab
00000001808baba5: mov      rax, qword ptr [rsi + 0x10]
00000001808baba9: jmp      0x1808babb6
00000001808babab: xor      r8d, r8d
00000001808babae: mov      rdx, rsi
00000001808babb1: call     0x183334190 ; XLua.DelegateBridge.__Gen_Delegate_Imp3029 [5684]
00000001808babb6: test     rax, rax
00000001808babb9: je       0x1808bac2d
00000001808babbb: mov      ecx, dword ptr [rsi + 0x38]
00000001808babbe: lea      rdx, [rbp - 0x19]
00000001808babc2: movsd    xmm0, qword ptr [rsi + 0x30]
00000001808babc7: xor      r8d, r8d
00000001808babca: mov      dword ptr [rbp - 0x11], ecx
00000001808babcd: mov      rcx, rax
00000001808babd0: movsd    qword ptr [rbp - 0x19], xmm0
00000001808babd5: call     0x1808c43a0 ; Torappu.Battle.Tile._SetPositionDelta [70769]
00000001808babda: movaps   xmm8, xmmword ptr [rsp + 0x80]
00000001808babe3: movaps   xmm7, xmmword ptr [rsp + 0x90]
00000001808babeb: mov      rdi, qword ptr [rsp + 0xd0]
00000001808babf3: movaps   xmm9, xmmword ptr [rsp + 0x70]
00000001808babf9: mov      r14, qword ptr [rsp + 0xd8]
00000001808bac01: movaps   xmm6, xmmword ptr [rsp + 0xa0]
00000001808bac09: mov      rbx, qword ptr [rsp + 0xe0]
00000001808bac11: add      rsp, 0xb0
00000001808bac18: pop      r15
00000001808bac1a: pop      rsi
00000001808bac1b: pop      rbp
00000001808bac1c: ret      
00000001808bac1d: xor      r9d, r9d
00000001808bac20: mov      r8, rbx
00000001808bac23: mov      rdx, rsi
00000001808bac26: call     0x1833f9830 ; XLua.DelegateBridge.__Gen_Delegate_Imp427 [3082]
00000001808bac2b: jmp      0x1808bac09
00000001808bac2d: call     0x18048c0b0
00000001808bac32: int3     
00000001808bac33: int3     
00000001808bac34: int3     
00000001808bac35: int3     
00000001808bac36: int3     
00000001808bac37: int3     
00000001808bac38: int3     
00000001808bac39: int3     
00000001808bac3a: int3     
00000001808bac3b: int3     
00000001808bac3c: int3     
00000001808bac3d: int3     
00000001808bac3e: int3     
00000001808bac3f: int3     