; Torappu.Battle.Projectiles.PullHitTargetBehaviour.<_DoLink>d__8.MoveNext metadata=86422 token=0x6015197 VA=0x180d4fa40 RVA=0xd4fa40 size=0x7e0
0000000180d4fa40: push     rbp
0000000180d4fa42: push     rsi
0000000180d4fa43: sub      rsp, 0x88
0000000180d4fa4a: cmp      byte ptr [rip + 0x7f44b8b], 0
0000000180d4fa51: mov      rsi, rcx
0000000180d4fa54: jne      0x180d4fae5
0000000180d4fa5a: lea      rcx, [rip + 0x7be033f] ; TypeInfo Torappu.Battle.BattleFormula @0x18892fda0
0000000180d4fa61: call     0x18048bf00
0000000180d4fa66: lea      rcx, [rip + 0x7c1ada3] ; GenericMethodInfo 285167 @0x18896a810
0000000180d4fa6d: call     0x18048bf00
0000000180d4fa72: lea      rcx, [rip + 0x7c1afd7] ; GenericMethodInfo 285168 @0x18896aa50
0000000180d4fa79: call     0x18048bf00
0000000180d4fa7e: lea      rcx, [rip + 0x7b1c7e3] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180d4fa85: call     0x18048bf00
0000000180d4fa8a: lea      rcx, [rip + 0x7b0ac6f] ; TypeInfo Torappu.FP @0x18885a700
0000000180d4fa91: call     0x18048bf00
0000000180d4fa96: lea      rcx, [rip + 0x7b7419b] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180d4fa9d: call     0x18048bf00
0000000180d4faa2: lea      rcx, [rip + 0x7c1e5b7] ; GenericMethodInfo 298107 @0x18896e060
0000000180d4faa9: call     0x18048bf00
0000000180d4faae: lea      rcx, [rip + 0x7c1e7eb] ; GenericMethodInfo 298108 @0x18896e2a0
0000000180d4fab5: call     0x18048bf00
0000000180d4faba: lea      rcx, [rip + 0x7be3227] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180d4fac1: call     0x18048bf00
0000000180d4fac6: lea      rcx, [rip + 0x7bff113] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
0000000180d4facd: call     0x18048bf00
0000000180d4fad2: lea      rcx, [rip + 0x7b1aaf7] ; TypeInfo Torappu.Battle.Yields @0x18886a5d0
0000000180d4fad9: call     0x18048bf00
0000000180d4fade: mov      byte ptr [rip + 0x7f44af7], 1
0000000180d4fae5: mov      ecx, dword ptr [rsi + 0x10]
0000000180d4fae8: mov      rbp, qword ptr [rsi + 0x20]
0000000180d4faec: mov      qword ptr [rsp + 0xa8], rbx
0000000180d4faf4: mov      qword ptr [rsp + 0xb0], rdi
0000000180d4fafc: movaps   xmmword ptr [rsp + 0x70], xmm6
0000000180d4fb01: movaps   xmmword ptr [rsp + 0x60], xmm7
0000000180d4fb06: test     ecx, ecx
0000000180d4fb08: je       0x180d50089
0000000180d4fb0e: sub      ecx, 1
0000000180d4fb11: je       0x180d5007e
0000000180d4fb17: sub      ecx, 1
0000000180d4fb1a: je       0x180d4fe3a
0000000180d4fb20: sub      ecx, 1
0000000180d4fb23: je       0x180d5007e
0000000180d4fb29: cmp      ecx, 1
0000000180d4fb2c: jne      0x180d50085
0000000180d4fb32: mov      dword ptr [rsi + 0x10], 0xffffffff
0000000180d4fb39: test     rbp, rbp
0000000180d4fb3c: je       0x180d5020b
0000000180d4fb42: mov      rcx, qword ptr [rip + 0x7b0abb7] ; TypeInfo Torappu.FP @0x18885a700
0000000180d4fb49: mov      rbx, qword ptr [rbp + 0x38]
0000000180d4fb4d: cmp      dword ptr [rcx + 0xe0], 0
0000000180d4fb54: jne      0x180d4fb5b
0000000180d4fb56: call     0x18048c140
0000000180d4fb5b: xor      edx, edx
0000000180d4fb5d: xor      ecx, ecx
0000000180d4fb5f: call     0x1866fdac0
0000000180d4fb64: mov      rcx, qword ptr [rip + 0x7b740cd] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180d4fb6b: mov      rdi, rax
0000000180d4fb6e: cmp      dword ptr [rcx + 0xe0], 0
0000000180d4fb75: jne      0x180d4fb7c
0000000180d4fb77: call     0x18048c140
0000000180d4fb7c: xor      r8d, r8d
0000000180d4fb7f: mov      rdx, rdi
0000000180d4fb82: mov      rcx, rbx
0000000180d4fb85: call     0x1866e5700
0000000180d4fb8a: mov      rbx, qword ptr [rsi + 0x28]
0000000180d4fb8e: test     al, al
0000000180d4fb90: jne      0x180d4fe14
0000000180d4fb96: test     rbx, rbx
0000000180d4fb99: je       0x180d5020b
0000000180d4fb9f: xor      edx, edx
0000000180d4fba1: mov      rcx, rbx
0000000180d4fba4: call     0x180ad4250 ; Torappu.Battle.VisualObject.get_mapPosition [77866]
0000000180d4fba9: mov      qword ptr [rsp + 0xa0], rax
0000000180d4fbb1: movss    xmm0, dword ptr [rsp + 0xa0]
0000000180d4fbba: movss    xmm1, dword ptr [rsp + 0xa4]
0000000180d4fbc3: subss    xmm0, dword ptr [rsi + 0x38]
0000000180d4fbc8: subss    xmm1, dword ptr [rsi + 0x3c]
0000000180d4fbcd: movss    xmm6, dword ptr [rsi + 0x40]
0000000180d4fbd2: xor      r8d, r8d
0000000180d4fbd5: unpcklps xmm0, xmm1
0000000180d4fbd8: movss    xmm1, dword ptr [rsi + 0x44]
0000000180d4fbdd: movq     rcx, xmm0
0000000180d4fbe2: movsd    qword ptr [rsp + 0xa0], xmm0
0000000180d4fbeb: call     0x180adf640 ; Torappu.Battle.BattleUtil.CalculatePullAttenuationFactor [78265]
0000000180d4fbf0: mov      rcx, qword ptr [rsi + 0x28]
0000000180d4fbf4: movaps   xmm7, xmm0
0000000180d4fbf7: mulss    xmm7, xmm6
0000000180d4fbfb: test     rcx, rcx
0000000180d4fbfe: je       0x180d5020b
0000000180d4fc04: movaps   xmmword ptr [rsp + 0x50], xmm8
0000000180d4fc0a: xor      edx, edx
0000000180d4fc0c: movaps   xmmword ptr [rsp + 0x40], xmm9
0000000180d4fc12: call     0x180ad4250 ; Torappu.Battle.VisualObject.get_mapPosition [77866]
0000000180d4fc17: mov      rcx, qword ptr [rip + 0x7b7401a] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180d4fc1e: movss    xmm8, dword ptr [rsi + 0x38]
0000000180d4fc24: movss    xmm9, dword ptr [rsi + 0x3c]
0000000180d4fc2a: movq     xmm6, rax
0000000180d4fc2f: cmp      dword ptr [rcx + 0xe0], 0
0000000180d4fc36: jne      0x180d4fc3d
0000000180d4fc38: call     0x18048c140
0000000180d4fc3d: movss    xmm2, dword ptr [rip + 0x60f1037]
0000000180d4fc45: xor      r9d, r9d
0000000180d4fc48: unpcklps xmm8, xmm9
0000000180d4fc4c: movq     rcx, xmm6
0000000180d4fc51: movq     rdx, xmm8
0000000180d4fc56: call     0x1866e3dc0
0000000180d4fc5b: movaps   xmm9, xmmword ptr [rsp + 0x40]
0000000180d4fc61: movaps   xmm8, xmmword ptr [rsp + 0x50]
0000000180d4fc67: test     al, al
0000000180d4fc69: jne      0x180d4fce0
0000000180d4fc6b: mov      rdx, qword ptr [rip + 0x7b1c5f6] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180d4fc72: mov      rcx, qword ptr [rsi + 0x30]
0000000180d4fc76: mov      rbx, qword ptr [rsi + 0x28]
0000000180d4fc7a: call     0x1800057a0
0000000180d4fc7f: mov      rdx, rax
0000000180d4fc82: xor      r9d, r9d
0000000180d4fc85: mov      r8b, 1
0000000180d4fc88: mov      rcx, rbx
0000000180d4fc8b: call     0x180adfa90 ; Torappu.Battle.BattleUtil.CheckTargetWithinBlockRange [78264]
0000000180d4fc90: test     al, al
0000000180d4fc92: jne      0x180d4fce0
0000000180d4fc94: mov      rcx, qword ptr [rip + 0x7b0aa65] ; TypeInfo Torappu.FP @0x18885a700
0000000180d4fc9b: mov      rbx, qword ptr [rbp + 0x38]
0000000180d4fc9f: cmp      dword ptr [rcx + 0xe0], 0
0000000180d4fca6: jne      0x180d4fcad
0000000180d4fca8: call     0x18048c140
0000000180d4fcad: xor      edx, edx
0000000180d4fcaf: xor      ecx, ecx
0000000180d4fcb1: call     0x1866fdac0
0000000180d4fcb6: mov      rcx, qword ptr [rip + 0x7b73f7b] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180d4fcbd: mov      rdi, rax
0000000180d4fcc0: cmp      dword ptr [rcx + 0xe0], 0
0000000180d4fcc7: jne      0x180d4fcce
0000000180d4fcc9: call     0x18048c140
0000000180d4fcce: xor      r8d, r8d
0000000180d4fcd1: mov      rdx, rdi
0000000180d4fcd4: mov      rcx, rbx
0000000180d4fcd7: call     0x1866e5700
0000000180d4fcdc: test     al, al
0000000180d4fcde: je       0x180d4fd08
0000000180d4fce0: mov      rbx, qword ptr [rsi + 0x28]
0000000180d4fce4: xor      edx, edx
0000000180d4fce6: mov      rcx, rbp
0000000180d4fce9: call     0x1808cf100 ; Torappu.Battle.Projectile.Behaviour.get_projectile [71401]
0000000180d4fcee: test     rbx, rbx
0000000180d4fcf1: je       0x180d5020b
0000000180d4fcf7: xor      r8d, r8d
0000000180d4fcfa: mov      rdx, rax
0000000180d4fcfd: mov      rcx, rbx
0000000180d4fd00: call     0x180a75a80 ; Torappu.Battle.Enemy.TryEarlyStopPull [76439]
0000000180d4fd05: xorps    xmm7, xmm7
0000000180d4fd08: xor      edx, edx
0000000180d4fd0a: lea      rcx, [rsp + 0xa0]
0000000180d4fd12: call     0x180535530
0000000180d4fd17: mov      rbx, qword ptr [rsi + 0x28]
0000000180d4fd1b: movq     xmm6, rax
0000000180d4fd20: xor      edx, edx
0000000180d4fd22: mov      rcx, rbp
0000000180d4fd25: cmp      byte ptr [rsi + 0x48], dl
0000000180d4fd28: jne      0x180d4fdba
0000000180d4fd2e: call     0x1808cf100 ; Torappu.Battle.Projectile.Behaviour.get_projectile [71401]
0000000180d4fd33: test     rbx, rbx
0000000180d4fd36: je       0x180d5020b
0000000180d4fd3c: xor      edi, edi
0000000180d4fd3e: movaps   xmm3, xmm7
0000000180d4fd41: movq     r8, xmm6
0000000180d4fd46: mov      qword ptr [rsp + 0x20], rdi
0000000180d4fd4b: mov      rdx, rax
0000000180d4fd4e: mov      rcx, rbx
0000000180d4fd51: call     0x180a752d0 ; Torappu.Battle.Enemy.StillPull [76438]
0000000180d4fd56: test     al, al
0000000180d4fd58: jne      0x180d4ff6a
0000000180d4fd5e: mov      rcx, qword ptr [rip + 0x7be2f83] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180d4fd65: mov      rbx, qword ptr [rsi + 0x28]
0000000180d4fd69: cmp      dword ptr [rcx + 0xe0], 0
0000000180d4fd70: jne      0x180d4fd77
0000000180d4fd72: call     0x18048c140
0000000180d4fd77: xor      r8d, r8d
0000000180d4fd7a: xor      edx, edx
0000000180d4fd7c: mov      rcx, rbx
0000000180d4fd7f: call     0x186b63a70
0000000180d4fd84: test     al, al
0000000180d4fd86: je       0x180d50085
0000000180d4fd8c: mov      rbx, qword ptr [rsi + 0x28]
0000000180d4fd90: xor      edx, edx
0000000180d4fd92: mov      rcx, rbp
0000000180d4fd95: call     0x1808cf100 ; Torappu.Battle.Projectile.Behaviour.get_projectile [71401]
0000000180d4fd9a: test     rbx, rbx
0000000180d4fd9d: je       0x180d5020b
0000000180d4fda3: mov      ecx, 0xea
0000000180d4fda8: mov      r8, rax
0000000180d4fdab: mov      rdx, rbx
0000000180d4fdae: call     0x180005480
0000000180d4fdb3: xor      al, al
0000000180d4fdb5: jmp      0x180d5001b
0000000180d4fdba: call     0x1808cf100 ; Torappu.Battle.Projectile.Behaviour.get_projectile [71401]
0000000180d4fdbf: mov      rdi, rax
0000000180d4fdc2: test     rbx, rbx
0000000180d4fdc5: je       0x180d5020b
0000000180d4fdcb: cmp      byte ptr [rip + 0x7f7ca1e], 0
0000000180d4fdd2: jbe      0x180d4fddc
0000000180d4fdd4: mov      rcx, qword ptr [rbx]
0000000180d4fdd7: call     0x180446d00
0000000180d4fddc: mov      rcx, qword ptr [rbx]
0000000180d4fddf: movaps   xmm3, xmm7
0000000180d4fde2: movq     r8, xmm6
0000000180d4fde7: mov      rdx, rdi
0000000180d4fdea: mov      r9, qword ptr [rcx + 0xfd0]
0000000180d4fdf1: mov      rcx, qword ptr [rcx + 0xfd8]
0000000180d4fdf8: mov      qword ptr [rsp + 0x20], rcx
0000000180d4fdfd: mov      rcx, rbx
0000000180d4fe00: call     r9
0000000180d4fe03: test     al, al
0000000180d4fe05: je       0x180d4fd5e
0000000180d4fe0b: mov      byte ptr [rsi + 0x48], 0
0000000180d4fe0f: jmp      0x180d4ff6a
0000000180d4fe14: xor      edx, edx
0000000180d4fe16: mov      rcx, rbp
0000000180d4fe19: call     0x1808cf100 ; Torappu.Battle.Projectile.Behaviour.get_projectile [71401]
0000000180d4fe1e: test     rbx, rbx
0000000180d4fe21: je       0x180d5020b
0000000180d4fe27: xor      r8d, r8d
0000000180d4fe2a: mov      rdx, rax
0000000180d4fe2d: mov      rcx, rbx
0000000180d4fe30: call     0x180a75a80 ; Torappu.Battle.Enemy.TryEarlyStopPull [76439]
0000000180d4fe35: jmp      0x180d4fd5e
0000000180d4fe3a: mov      rbx, qword ptr [rsi + 0x30]
0000000180d4fe3e: mov      dword ptr [rsi + 0x10], 0xffffffff
0000000180d4fe45: mov      rcx, qword ptr [rip + 0x7be2e9c] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180d4fe4c: cmp      dword ptr [rcx + 0xe0], 0
0000000180d4fe53: jne      0x180d4fe5a
0000000180d4fe55: call     0x18048c140
0000000180d4fe5a: xor      r8d, r8d
0000000180d4fe5d: xor      edx, edx
0000000180d4fe5f: mov      rcx, rbx
0000000180d4fe62: call     0x186b63a70
0000000180d4fe67: test     al, al
0000000180d4fe69: je       0x180d4fe83
0000000180d4fe6b: mov      rcx, qword ptr [rsi + 0x30]
0000000180d4fe6f: test     rcx, rcx
0000000180d4fe72: je       0x180d5020b
0000000180d4fe78: xor      edx, edx
0000000180d4fe7a: call     0x180701f40 ; Torappu.Battle.Entity.get_baseForceLevel [66481]
0000000180d4fe7f: mov      edi, eax
0000000180d4fe81: jmp      0x180d4fe85
0000000180d4fe83: xor      edi, edi
0000000180d4fe85: test     rbp, rbp
0000000180d4fe88: je       0x180d5020b
0000000180d4fe8e: mov      rcx, qword ptr [rsi + 0x28]
0000000180d4fe92: mov      ebx, dword ptr [rbp + 0x30]
0000000180d4fe95: test     rcx, rcx
0000000180d4fe98: je       0x180d5020b
0000000180d4fe9e: xor      edx, edx
0000000180d4fea0: mov      qword ptr [rsp + 0x80], r14
0000000180d4fea8: call     0x180a7ea90 ; Torappu.Battle.Enemy.get_massLevel [76330]
0000000180d4fead: mov      rcx, qword ptr [rip + 0x7bdfeec] ; TypeInfo Torappu.Battle.BattleFormula @0x18892fda0
0000000180d4feb4: mov      r14d, eax
0000000180d4feb7: cmp      dword ptr [rcx + 0xe0], 0
0000000180d4febe: jne      0x180d4fec5
0000000180d4fec0: call     0x18048c140
0000000180d4fec5: lea      ecx, [rbx + rdi]
0000000180d4fec8: xor      r8d, r8d
0000000180d4fecb: mov      edx, r14d
0000000180d4fece: call     0x1806582a0 ; Torappu.Battle.BattleFormula.CalculatePullForce [64933]
0000000180d4fed3: mov      r14, qword ptr [rsp + 0x80]
0000000180d4fedb: movaps   xmm6, xmm0
0000000180d4fede: movss    dword ptr [rsi + 0x40], xmm6
0000000180d4fee3: mov      rcx, qword ptr [rip + 0x7b73d4e] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180d4feea: cmp      dword ptr [rcx + 0xe0], 0
0000000180d4fef1: jne      0x180d4fef8
0000000180d4fef3: call     0x18048c140
0000000180d4fef8: xor      r8d, r8d
0000000180d4fefb: xorps    xmm1, xmm1
0000000180d4fefe: movaps   xmm0, xmm6
0000000180d4ff01: call     0x1866e56f0
0000000180d4ff06: test     al, al
0000000180d4ff08: jne      0x180d5003f
0000000180d4ff0e: mov      rcx, qword ptr [rsi + 0x28]
0000000180d4ff12: test     rcx, rcx
0000000180d4ff15: je       0x180d5020b
0000000180d4ff1b: xor      edx, edx
0000000180d4ff1d: call     0x180ad4250 ; Torappu.Battle.VisualObject.get_mapPosition [77866]
0000000180d4ff22: mov      qword ptr [rsp + 0xa0], rax
0000000180d4ff2a: movss    xmm0, dword ptr [rsp + 0xa0]
0000000180d4ff33: movss    xmm1, dword ptr [rsp + 0xa4]
0000000180d4ff3c: subss    xmm0, dword ptr [rsi + 0x38]
0000000180d4ff41: subss    xmm1, dword ptr [rsi + 0x3c]
0000000180d4ff46: unpcklps xmm0, xmm1
0000000180d4ff49: lea      rcx, [rsp + 0xa0]
0000000180d4ff51: xor      edx, edx
0000000180d4ff53: movsd    qword ptr [rsp + 0xa0], xmm0
0000000180d4ff5c: call     0x180535480
0000000180d4ff61: movss    dword ptr [rsi + 0x44], xmm0
0000000180d4ff66: mov      byte ptr [rsi + 0x48], 1
0000000180d4ff6a: mov      r8, qword ptr [rip + 0x7c1e0ef] ; GenericMethodInfo 298107 @0x18896e060
0000000180d4ff71: lea      rcx, [rsp + 0x30]
0000000180d4ff76: mov      rdx, qword ptr [rsi + 0x28]
0000000180d4ff7a: call     0x1845638c0
0000000180d4ff7f: movaps   xmm0, xmmword ptr [rsp + 0x30]
0000000180d4ff84: lea      rcx, [rsp + 0x30]
0000000180d4ff89: mov      rdx, qword ptr [rip + 0x7c1a880] ; GenericMethodInfo 285167 @0x18896a810
0000000180d4ff90: movdqa   xmmword ptr [rsp + 0x30], xmm0
0000000180d4ff96: call     0x18449ab40
0000000180d4ff9b: test     al, al
0000000180d4ff9d: je       0x180d4fd5e
0000000180d4ffa3: mov      r8, qword ptr [rip + 0x7c1e2f6] ; GenericMethodInfo 298108 @0x18896e2a0
0000000180d4ffaa: lea      rcx, [rsp + 0x30]
0000000180d4ffaf: mov      rdx, qword ptr [rsi + 0x30]
0000000180d4ffb3: call     0x1845638c0
0000000180d4ffb8: movaps   xmm0, xmmword ptr [rsp + 0x30]
0000000180d4ffbd: lea      rcx, [rsp + 0x30]
0000000180d4ffc2: mov      rdx, qword ptr [rip + 0x7c1aa87] ; GenericMethodInfo 285168 @0x18896aa50
0000000180d4ffc9: movdqa   xmmword ptr [rsp + 0x30], xmm0
0000000180d4ffcf: call     0x18449ab40
0000000180d4ffd4: test     al, al
0000000180d4ffd6: je       0x180d4fd5e
0000000180d4ffdc: mov      rax, qword ptr [rip + 0x7b1a5ed] ; TypeInfo Torappu.Battle.Yields @0x18886a5d0
0000000180d4ffe3: cmp      dword ptr [rax + 0xe0], 0
0000000180d4ffea: jne      0x180d4fffb
0000000180d4ffec: mov      rcx, rax
0000000180d4ffef: call     0x18048c140
0000000180d4fff4: mov      rax, qword ptr [rip + 0x7b1a5d5] ; TypeInfo Torappu.Battle.Yields @0x18886a5d0
0000000180d4fffb: mov      rax, qword ptr [rax + 0xb8]
0000000180d50002: lea      rcx, [rsi + 0x18]
0000000180d50006: mov      rdx, qword ptr [rax]
0000000180d50009: mov      qword ptr [rsi + 0x18], rdx
0000000180d5000d: call     0x18048b9e0
0000000180d50012: mov      dword ptr [rsi + 0x10], 4
0000000180d50019: mov      al, 1
0000000180d5001b: movaps   xmm7, xmmword ptr [rsp + 0x60]
0000000180d50020: movaps   xmm6, xmmword ptr [rsp + 0x70]
0000000180d50025: mov      rdi, qword ptr [rsp + 0xb0]
0000000180d5002d: mov      rbx, qword ptr [rsp + 0xa8]
0000000180d50035: add      rsp, 0x88
0000000180d5003c: pop      rsi
0000000180d5003d: pop      rbp
0000000180d5003e: ret      
0000000180d5003f: mov      rax, qword ptr [rip + 0x7b1a58a] ; TypeInfo Torappu.Battle.Yields @0x18886a5d0
0000000180d50046: cmp      dword ptr [rax + 0xe0], 0
0000000180d5004d: jne      0x180d5005e
0000000180d5004f: mov      rcx, rax
0000000180d50052: call     0x18048c140
0000000180d50057: mov      rax, qword ptr [rip + 0x7b1a572] ; TypeInfo Torappu.Battle.Yields @0x18886a5d0
0000000180d5005e: mov      rax, qword ptr [rax + 0xb8]
0000000180d50065: lea      rcx, [rsi + 0x18]
0000000180d50069: mov      rdx, qword ptr [rax]
0000000180d5006c: mov      qword ptr [rsi + 0x18], rdx
0000000180d50070: call     0x18048b9e0
0000000180d50075: mov      dword ptr [rsi + 0x10], 3
0000000180d5007c: jmp      0x180d50019
0000000180d5007e: mov      dword ptr [rsi + 0x10], 0xffffffff
0000000180d50085: xor      al, al
0000000180d50087: jmp      0x180d5001b
0000000180d50089: mov      dword ptr [rsi + 0x10], 0xffffffff
0000000180d50090: test     rbp, rbp
0000000180d50093: je       0x180d5020b
0000000180d50099: xor      edx, edx
0000000180d5009b: mov      rcx, rbp
0000000180d5009e: call     0x1808cf100 ; Torappu.Battle.Projectile.Behaviour.get_projectile [71401]
0000000180d500a3: test     rax, rax
0000000180d500a6: je       0x180d5020b
0000000180d500ac: xor      edx, edx
0000000180d500ae: mov      rcx, rax
0000000180d500b1: call     0x1808dd7b0 ; Torappu.Battle.Projectile.get_source [71293]
0000000180d500b6: lea      rcx, [rsi + 0x30]
0000000180d500ba: mov      qword ptr [rsi + 0x30], rax
0000000180d500be: mov      rdx, rax
0000000180d500c1: call     0x18048b9e0
0000000180d500c6: mov      rcx, qword ptr [rsi + 0x30]
0000000180d500ca: test     rcx, rcx
0000000180d500cd: je       0x180d5020b
0000000180d500d3: xor      edx, edx
0000000180d500d5: call     0x180ad4250 ; Torappu.Battle.VisualObject.get_mapPosition [77866]
0000000180d500da: mov      qword ptr [rsp + 0xa0], rax
0000000180d500e2: mov      rax, qword ptr [rip + 0x7bfeaf7] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
0000000180d500e9: cmp      dword ptr [rax + 0xe0], 0
0000000180d500f0: jne      0x180d50101
0000000180d500f2: mov      rcx, rax
0000000180d500f5: call     0x18048c140
0000000180d500fa: mov      rax, qword ptr [rip + 0x7bfeadf] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
0000000180d50101: mov      rax, qword ptr [rax + 0xb8]
0000000180d50108: mov      rcx, qword ptr [rsi + 0x30]
0000000180d5010c: mov      rbx, qword ptr [rax + 0x50]
0000000180d50110: test     rcx, rcx
0000000180d50113: je       0x180d5020b
0000000180d50119: xor      edx, edx
0000000180d5011b: call     0x180703170 ; Torappu.Battle.Entity.get_direction [66391]
0000000180d50120: test     rbx, rbx
0000000180d50123: je       0x180d5020b
0000000180d50129: cmp      eax, dword ptr [rbx + 0x18]
0000000180d5012c: jae      0x180d50211
0000000180d50132: movss    xmm1, dword ptr [rbp + 0x28]
0000000180d50137: cdqe     
0000000180d50139: movaps   xmm0, xmm1
0000000180d5013c: mulss    xmm0, dword ptr [rbx + rax*8 + 0x24]
0000000180d50142: addss    xmm0, dword ptr [rsp + 0xa4]
0000000180d5014b: mulss    xmm1, dword ptr [rbx + rax*8 + 0x20]
0000000180d50151: mov      rbx, qword ptr [rsi + 0x28]
0000000180d50155: movss    dword ptr [rsi + 0x3c], xmm0
0000000180d5015a: addss    xmm1, dword ptr [rsp + 0xa0]
0000000180d50163: movss    dword ptr [rsi + 0x38], xmm1
0000000180d50168: mov      rcx, qword ptr [rip + 0x7be2b79] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180d5016f: cmp      dword ptr [rcx + 0xe0], 0
0000000180d50176: jne      0x180d5017d
0000000180d50178: call     0x18048c140
0000000180d5017d: xor      r8d, r8d
0000000180d50180: xor      edx, edx
0000000180d50182: mov      rcx, rbx
0000000180d50185: call     0x186b638d0
0000000180d5018a: test     al, al
0000000180d5018c: mov      rax, qword ptr [rip + 0x7b1a43d] ; TypeInfo Torappu.Battle.Yields @0x18886a5d0
0000000180d50193: jne      0x180d501d0
0000000180d50195: cmp      dword ptr [rax + 0xe0], 0
0000000180d5019c: jne      0x180d501ad
0000000180d5019e: mov      rcx, rax
0000000180d501a1: call     0x18048c140
0000000180d501a6: mov      rax, qword ptr [rip + 0x7b1a423] ; TypeInfo Torappu.Battle.Yields @0x18886a5d0
0000000180d501ad: mov      rax, qword ptr [rax + 0xb8]
0000000180d501b4: lea      rcx, [rsi + 0x18]
0000000180d501b8: mov      rdx, qword ptr [rax]
0000000180d501bb: mov      qword ptr [rsi + 0x18], rdx
0000000180d501bf: call     0x18048b9e0
0000000180d501c4: mov      dword ptr [rsi + 0x10], 2
0000000180d501cb: jmp      0x180d50019
0000000180d501d0: cmp      dword ptr [rax + 0xe0], 0
0000000180d501d7: jne      0x180d501e8
0000000180d501d9: mov      rcx, rax
0000000180d501dc: call     0x18048c140
0000000180d501e1: mov      rax, qword ptr [rip + 0x7b1a3e8] ; TypeInfo Torappu.Battle.Yields @0x18886a5d0
0000000180d501e8: mov      rax, qword ptr [rax + 0xb8]
0000000180d501ef: lea      rcx, [rsi + 0x18]
0000000180d501f3: mov      rdx, qword ptr [rax]
0000000180d501f6: mov      qword ptr [rsi + 0x18], rdx
0000000180d501fa: call     0x18048b9e0
0000000180d501ff: mov      dword ptr [rsi + 0x10], 1
0000000180d50206: jmp      0x180d50019
0000000180d5020b: call     0x18048c0b0
0000000180d50210: int3     
0000000180d50211: call     0x18048c0a0
0000000180d50216: int3     
0000000180d50217: int3     
0000000180d50218: int3     
0000000180d50219: int3     
0000000180d5021a: int3     
0000000180d5021b: int3     
0000000180d5021c: int3     
0000000180d5021d: int3     
0000000180d5021e: int3     
0000000180d5021f: int3     