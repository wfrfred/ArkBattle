; Torappu.Battle.HarpoonProjectile.<DoLink>d__19.MoveNext metadata=71125 token=0x60115d6 VA=0x1808e3890 RVA=0x8e3890 size=0x800
00000001808e3890: push     rsi
00000001808e3892: push     rdi
00000001808e3893: sub      rsp, 0x98
00000001808e389a: cmp      byte ptr [rip + 0x83adecc], 0
00000001808e38a1: mov      rdi, rcx
00000001808e38a4: jne      0x1808e3935
00000001808e38aa: lea      rcx, [rip + 0x804c4ef] ; TypeInfo Torappu.Battle.BattleFormula @0x18892fda0
00000001808e38b1: call     0x18048bf00
00000001808e38b6: lea      rcx, [rip + 0x8087193] ; GenericMethodInfo 285168 @0x18896aa50
00000001808e38bd: call     0x18048bf00
00000001808e38c2: lea      rcx, [rip + 0x7f8899f] ; TypeInfo Torappu.Battle.Character @0x18886c268
00000001808e38c9: call     0x18048bf00
00000001808e38ce: lea      rcx, [rip + 0x7f37ddb] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
00000001808e38d5: call     0x18048bf00
00000001808e38da: lea      rcx, [rip + 0x7f95f0f] ; TypeInfo Torappu.EventPool.EventCallbackDelegate @0x1888797f0
00000001808e38e1: call     0x18048bf00
00000001808e38e6: lea      rcx, [rip + 0x7f360b3] ; GenericMethodInfo 262051 @0x1888199a0
00000001808e38ed: call     0x18048bf00
00000001808e38f2: lea      rcx, [rip + 0x7f76e07] ; TypeInfo Torappu.FP @0x18885a700
00000001808e38f9: call     0x18048bf00
00000001808e38fe: lea      rcx, [rip + 0x7f7f043] ; MethodInfo Torappu.Battle.HarpoonProjectile._StopCollideHighLand [71114] @0x188862948
00000001808e3905: call     0x18048bf00
00000001808e390a: lea      rcx, [rip + 0x7fe0327] ; TypeInfo Torappu.MathUtil @0x1888c3c38
00000001808e3911: call     0x18048bf00
00000001808e3916: lea      rcx, [rip + 0x804f3cb] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808e391d: call     0x18048bf00
00000001808e3922: lea      rcx, [rip + 0x7f86ca7] ; TypeInfo Torappu.Battle.Yields @0x18886a5d0
00000001808e3929: call     0x18048bf00
00000001808e392e: mov      byte ptr [rip + 0x83ade38], 1
00000001808e3935: mov      ecx, dword ptr [rdi + 0x10]
00000001808e3938: mov      rsi, qword ptr [rdi + 0x28]
00000001808e393c: mov      qword ptr [rsp + 0xb8], rbx
00000001808e3944: mov      qword ptr [rsp + 0xc0], rbp
00000001808e394c: mov      qword ptr [rsp + 0x90], r14
00000001808e3954: movaps   xmmword ptr [rsp + 0x80], xmm6
00000001808e395c: movaps   xmmword ptr [rsp + 0x70], xmm7
00000001808e3961: test     ecx, ecx
00000001808e3963: je       0x1808e3edf
00000001808e3969: sub      ecx, 1
00000001808e396c: je       0x1808e3ed1
00000001808e3972: sub      ecx, 1
00000001808e3975: je       0x1808e3baf
00000001808e397b: cmp      ecx, 1
00000001808e397e: jne      0x1808e3ed8
00000001808e3984: mov      rcx, qword ptr [rdi + 0x30]
00000001808e3988: mov      dword ptr [rdi + 0x10], 0xffffffff
00000001808e398f: test     rcx, rcx
00000001808e3992: je       0x1808e407e
00000001808e3998: xor      edx, edx
00000001808e399a: call     0x180ad4250 ; Torappu.Battle.VisualObject.get_mapPosition [77866]
00000001808e399f: mov      qword ptr [rsp + 0xb0], rax
00000001808e39a7: test     rsi, rsi
00000001808e39aa: je       0x1808e407e
00000001808e39b0: movss    xmm0, dword ptr [rsp + 0xb0]
00000001808e39b9: movss    xmm1, dword ptr [rsp + 0xb4]
00000001808e39c2: subss    xmm0, dword ptr [rsi + 0x1f0]
00000001808e39ca: subss    xmm1, dword ptr [rsi + 0x1f4]
00000001808e39d2: movss    xmm6, dword ptr [rdi + 0x38]
00000001808e39d7: xor      r8d, r8d
00000001808e39da: unpcklps xmm0, xmm1
00000001808e39dd: movss    xmm1, dword ptr [rdi + 0x3c]
00000001808e39e2: movq     rcx, xmm0
00000001808e39e7: movsd    qword ptr [rsp + 0xb0], xmm0
00000001808e39f0: call     0x180adf640 ; Torappu.Battle.BattleUtil.CalculatePullAttenuationFactor [78265]
00000001808e39f5: mov      rcx, qword ptr [rdi + 0x30]
00000001808e39f9: movaps   xmm7, xmm0
00000001808e39fc: mulss    xmm7, xmm6
00000001808e3a00: test     rcx, rcx
00000001808e3a03: je       0x1808e407e
00000001808e3a09: movaps   xmmword ptr [rsp + 0x60], xmm8
00000001808e3a0f: xor      edx, edx
00000001808e3a11: movaps   xmmword ptr [rsp + 0x50], xmm9
00000001808e3a17: movaps   xmmword ptr [rsp + 0x40], xmm10
00000001808e3a1d: call     0x180ad4250 ; Torappu.Battle.VisualObject.get_mapPosition [77866]
00000001808e3a22: cmp      byte ptr [rsi + 0x1e8], 0
00000001808e3a29: movss    xmm9, dword ptr [rsi + 0x1f0]
00000001808e3a32: movss    xmm10, dword ptr [rsi + 0x1f4]
00000001808e3a3b: movq     xmm8, rax
00000001808e3a40: je       0x1808e3a54
00000001808e3a42: movss    xmm6, dword ptr [rsi + 0x1e0]
00000001808e3a4a: addss    xmm6, dword ptr [rip + 0x655d22a]
00000001808e3a52: jmp      0x1808e3a5c
00000001808e3a54: movss    xmm6, dword ptr [rip + 0x655d220]
00000001808e3a5c: mov      rcx, qword ptr [rip + 0x7fe01d5] ; TypeInfo Torappu.MathUtil @0x1888c3c38
00000001808e3a63: cmp      dword ptr [rcx + 0xe0], 0
00000001808e3a6a: jne      0x1808e3a71
00000001808e3a6c: call     0x18048c140
00000001808e3a71: unpcklps xmm9, xmm10
00000001808e3a75: xor      r9d, r9d
00000001808e3a78: movq     rdx, xmm9
00000001808e3a7d: movaps   xmm2, xmm6
00000001808e3a80: movq     rcx, xmm8
00000001808e3a85: call     0x1866e3dc0
00000001808e3a8a: movaps   xmm10, xmmword ptr [rsp + 0x40]
00000001808e3a90: movaps   xmm9, xmmword ptr [rsp + 0x50]
00000001808e3a96: movaps   xmm8, xmmword ptr [rsp + 0x60]
00000001808e3a9c: test     al, al
00000001808e3a9e: jne      0x1808e3ada
00000001808e3aa0: cmp      byte ptr [rsi + 0x1e7], al
00000001808e3aa6: jne      0x1808e3b12
00000001808e3aa8: mov      rbx, qword ptr [rdi + 0x30]
00000001808e3aac: xor      edx, edx
00000001808e3aae: mov      rcx, rsi
00000001808e3ab1: call     0x1808dd7b0 ; Torappu.Battle.Projectile.get_source [71293]
00000001808e3ab6: mov      rdx, qword ptr [rip + 0x7f887ab] ; TypeInfo Torappu.Battle.Character @0x18886c268
00000001808e3abd: mov      rcx, rax
00000001808e3ac0: call     0x1800057a0
00000001808e3ac5: mov      rdx, rax
00000001808e3ac8: xor      r9d, r9d
00000001808e3acb: mov      r8b, 1
00000001808e3ace: mov      rcx, rbx
00000001808e3ad1: call     0x180adfa90 ; Torappu.Battle.BattleUtil.CheckTargetWithinBlockRange [78264]
00000001808e3ad6: test     al, al
00000001808e3ad8: je       0x1808e3b12
00000001808e3ada: cmp      byte ptr [rsi + 0x1f8], 0
00000001808e3ae1: jne      0x1808e3b06
00000001808e3ae3: mov      rcx, qword ptr [rdi + 0x30]
00000001808e3ae7: test     rcx, rcx
00000001808e3aea: je       0x1808e407e
00000001808e3af0: xor      r8d, r8d
00000001808e3af3: mov      rdx, rsi
00000001808e3af6: call     0x180a75a80 ; Torappu.Battle.Enemy.TryEarlyStopPull [76439]
00000001808e3afb: test     al, al
00000001808e3afd: je       0x1808e3b06
00000001808e3aff: mov      byte ptr [rsi + 0x1f8], 1
00000001808e3b06: cmp      byte ptr [rsi + 0x1e4], 0
00000001808e3b0d: jne      0x1808e3b57
00000001808e3b0f: xorps    xmm7, xmm7
00000001808e3b12: xor      edx, edx
00000001808e3b14: lea      rcx, [rsp + 0xb0]
00000001808e3b1c: call     0x180535530
00000001808e3b21: movq     xmm0, rax
00000001808e3b26: mov      rax, qword ptr [rdi + 0x30]
00000001808e3b2a: test     rax, rax
00000001808e3b2d: je       0x1808e407e
00000001808e3b33: cmp      byte ptr [rdi + 0x40], 0
00000001808e3b37: jne      0x1808e3b68
00000001808e3b39: xor      ebp, ebp
00000001808e3b3b: movaps   xmm3, xmm7
00000001808e3b3e: movq     r8, xmm0
00000001808e3b43: mov      qword ptr [rsp + 0x20], rbp
00000001808e3b48: mov      rdx, rsi
00000001808e3b4b: mov      rcx, rax
00000001808e3b4e: call     0x180a752d0 ; Torappu.Battle.Enemy.StillPull [76438]
00000001808e3b53: test     al, al
00000001808e3b55: jne      0x1808e3b8b
00000001808e3b57: xor      edx, edx
00000001808e3b59: mov      rcx, rsi
00000001808e3b5c: call     0x1808daf40 ; Torappu.Battle.Projectile.StopMe [71373]
00000001808e3b61: xor      al, al
00000001808e3b63: jmp      0x1808e404f
00000001808e3b68: mov      ecx, 0xe9
00000001808e3b6d: movss    dword ptr [rsp + 0x20], xmm7
00000001808e3b73: movq     r9, xmm0
00000001808e3b78: mov      r8, rsi
00000001808e3b7b: mov      rdx, rax
00000001808e3b7e: call     0x18001f690
00000001808e3b83: test     al, al
00000001808e3b85: je       0x1808e3b57
00000001808e3b87: mov      byte ptr [rdi + 0x40], 0
00000001808e3b8b: cmp      byte ptr [rsi + 0x1a1], 0
00000001808e3b92: je       0x1808e3e22
00000001808e3b98: mov      rdx, qword ptr [rdi + 0x30]
00000001808e3b9c: xor      r9d, r9d
00000001808e3b9f: mov      r8b, 1
00000001808e3ba2: mov      rcx, rsi
00000001808e3ba5: call     0x1808d6c40 ; Torappu.Battle.Projectile.DealHitTarget [71347]
00000001808e3baa: jmp      0x1808e3e22
00000001808e3baf: mov      dword ptr [rdi + 0x10], 0xffffffff
00000001808e3bb6: test     rsi, rsi
00000001808e3bb9: je       0x1808e407e
00000001808e3bbf: mov      ebx, dword ptr [rsi + 0x1ec]
00000001808e3bc5: xor      ebp, ebp
00000001808e3bc7: cmp      byte ptr [rsi + 0x1e5], bpl
00000001808e3bce: je       0x1808e3bd4
00000001808e3bd0: mov      eax, ebp
00000001808e3bd2: jmp      0x1808e3be8
00000001808e3bd4: mov      rcx, qword ptr [rdi + 0x30]
00000001808e3bd8: test     rcx, rcx
00000001808e3bdb: je       0x1808e407e
00000001808e3be1: xor      edx, edx
00000001808e3be3: call     0x180a7ea90 ; Torappu.Battle.Enemy.get_massLevel [76330]
00000001808e3be8: movss    xmm0, dword ptr [rip + 0x655c1f0]
00000001808e3bf0: sub      ebx, eax
00000001808e3bf2: movd     xmm1, ebx
00000001808e3bf6: cvtdq2ps xmm1, xmm1
00000001808e3bf9: comiss   xmm0, xmm1
00000001808e3bfc: jb       0x1808e3c23
00000001808e3bfe: mov      rcx, qword ptr [rip + 0x7f76afb] ; TypeInfo Torappu.FP @0x18885a700
00000001808e3c05: cmp      dword ptr [rcx + 0xe0], ebp
00000001808e3c0b: jne      0x1808e3c12
00000001808e3c0d: call     0x18048c140
00000001808e3c12: movss    xmm0, dword ptr [rip + 0x655c18a]
00000001808e3c1a: xor      edx, edx
00000001808e3c1c: call     0x1866fdad0
00000001808e3c21: jmp      0x1808e3c2d
00000001808e3c23: xor      edx, edx
00000001808e3c25: mov      rcx, rsi
00000001808e3c28: call     0x1808d33c0 ; Torappu.Battle.LinkProjectile.get_linkDuration [71161]
00000001808e3c2d: xor      r9d, r9d
00000001808e3c30: xor      r8d, r8d
00000001808e3c33: mov      rdx, rax
00000001808e3c36: mov      rcx, rsi
00000001808e3c39: call     0x1808d7050 ; Torappu.Battle.Projectile.EnsureLifeTime [71349]
00000001808e3c3e: xor      edx, edx
00000001808e3c40: mov      rcx, rsi
00000001808e3c43: call     0x1808dcf20 ; Torappu.Battle.Projectile.get_currentTime [71288]
00000001808e3c48: mov      rcx, qword ptr [rip + 0x7f76ab1] ; TypeInfo Torappu.FP @0x18885a700
00000001808e3c4f: mov      rbx, rax
00000001808e3c52: movss    xmm6, dword ptr [rsi + 0x1d8]
00000001808e3c5a: cmp      dword ptr [rcx + 0xe0], ebp
00000001808e3c60: jne      0x1808e3c67
00000001808e3c62: call     0x18048c140
00000001808e3c67: xor      edx, edx
00000001808e3c69: movaps   xmm0, xmm6
00000001808e3c6c: call     0x1866fdad0
00000001808e3c71: xor      r8d, r8d
00000001808e3c74: mov      rdx, rax
00000001808e3c77: mov      rcx, rbx
00000001808e3c7a: call     0x184624db0
00000001808e3c7f: mov      qword ptr [rsi + 0x200], rax
00000001808e3c86: cmp      byte ptr [rsi + 0x1e6], bpl
00000001808e3c8d: je       0x1808e3cf3
00000001808e3c8f: mov      rcx, qword ptr [rdi + 0x30]
00000001808e3c93: test     rcx, rcx
00000001808e3c96: je       0x1808e407e
00000001808e3c9c: xor      edx, edx
00000001808e3c9e: call     0x180703a80 ; Torappu.Battle.Entity.get_eventPool [66359]
00000001808e3ca3: mov      rcx, qword ptr [rip + 0x7f95b46] ; TypeInfo Torappu.EventPool.EventCallbackDelegate @0x1888797f0
00000001808e3caa: mov      r14, rax
00000001808e3cad: call     0x18045cfe0
00000001808e3cb2: mov      rbx, rax
00000001808e3cb5: test     rax, rax
00000001808e3cb8: je       0x1808e407e
00000001808e3cbe: mov      r8, qword ptr [rip + 0x7f7ec83] ; MethodInfo Torappu.Battle.HarpoonProjectile._StopCollideHighLand [71114] @0x188862948
00000001808e3cc5: xor      r9d, r9d
00000001808e3cc8: mov      rdx, rsi
00000001808e3ccb: mov      rcx, rax
00000001808e3cce: call     0x18051b7e0 ; Torappu.UI.UIPushMessageHandler.MsgLuaHandler.LuaMsgHandlerCallback..ctor [113098] | Torappu.UI.SandboxPerm.SandboxPermTradeCallback..ctor [125084] | Torappu.UI.TemplateCharSelect.TemplateCharSelectTroopFetcher..ctor [168055]
00000001808e3cd3: test     r14, r14
00000001808e3cd6: je       0x1808e407e
00000001808e3cdc: mov      r9, qword ptr [rip + 0x7f35cbd] ; GenericMethodInfo 262051 @0x1888199a0
00000001808e3ce3: mov      r8, rbx
00000001808e3ce6: mov      edx, 0x2e
00000001808e3ceb: mov      rcx, r14
00000001808e3cee: call     0x1848dcb10
00000001808e3cf3: xor      edx, edx
00000001808e3cf5: mov      rcx, rsi
00000001808e3cf8: call     0x1808ddb50 ; Torappu.Battle.Projectile.get_type [71299]
00000001808e3cfd: cmp      eax, 2
00000001808e3d00: je       0x1808e3ed8
00000001808e3d06: xor      edx, edx
00000001808e3d08: mov      rcx, rsi
00000001808e3d0b: call     0x1808dd7b0 ; Torappu.Battle.Projectile.get_source [71293]
00000001808e3d10: mov      rcx, qword ptr [rip + 0x804efd1] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808e3d17: mov      rbx, rax
00000001808e3d1a: cmp      dword ptr [rcx + 0xe0], ebp
00000001808e3d20: jne      0x1808e3d27
00000001808e3d22: call     0x18048c140
00000001808e3d27: xor      r8d, r8d
00000001808e3d2a: xor      edx, edx
00000001808e3d2c: mov      rcx, rbx
00000001808e3d2f: call     0x186b63a70
00000001808e3d34: test     al, al
00000001808e3d36: je       0x1808e3d4d
00000001808e3d38: test     rbx, rbx
00000001808e3d3b: je       0x1808e407e
00000001808e3d41: xor      edx, edx
00000001808e3d43: mov      rcx, rbx
00000001808e3d46: call     0x180701f40 ; Torappu.Battle.Entity.get_baseForceLevel [66481]
00000001808e3d4b: mov      ebp, eax
00000001808e3d4d: mov      rcx, qword ptr [rdi + 0x30]
00000001808e3d51: mov      ebx, dword ptr [rsi + 0x1ec]
00000001808e3d57: test     rcx, rcx
00000001808e3d5a: je       0x1808e407e
00000001808e3d60: xor      edx, edx
00000001808e3d62: call     0x180a7ea90 ; Torappu.Battle.Enemy.get_massLevel [76330]
00000001808e3d67: mov      rcx, qword ptr [rip + 0x804c032] ; TypeInfo Torappu.Battle.BattleFormula @0x18892fda0
00000001808e3d6e: mov      r14d, eax
00000001808e3d71: cmp      dword ptr [rcx + 0xe0], 0
00000001808e3d78: jne      0x1808e3d7f
00000001808e3d7a: call     0x18048c140
00000001808e3d7f: lea      ecx, [rbx + rbp]
00000001808e3d82: xor      r8d, r8d
00000001808e3d85: mov      edx, r14d
00000001808e3d88: call     0x1806582a0 ; Torappu.Battle.BattleFormula.CalculatePullForce [64933]
00000001808e3d8d: movaps   xmm6, xmm0
00000001808e3d90: movss    dword ptr [rdi + 0x38], xmm6
00000001808e3d95: mov      rcx, qword ptr [rip + 0x7fdfe9c] ; TypeInfo Torappu.MathUtil @0x1888c3c38
00000001808e3d9c: cmp      dword ptr [rcx + 0xe0], 0
00000001808e3da3: jne      0x1808e3daa
00000001808e3da5: call     0x18048c140
00000001808e3daa: xor      r8d, r8d
00000001808e3dad: xorps    xmm1, xmm1
00000001808e3db0: movaps   xmm0, xmm6
00000001808e3db3: call     0x1866e56f0
00000001808e3db8: test     al, al
00000001808e3dba: jne      0x1808e3ec0
00000001808e3dc0: mov      rcx, qword ptr [rdi + 0x30]
00000001808e3dc4: test     rcx, rcx
00000001808e3dc7: je       0x1808e407e
00000001808e3dcd: xor      edx, edx
00000001808e3dcf: call     0x180ad4250 ; Torappu.Battle.VisualObject.get_mapPosition [77866]
00000001808e3dd4: mov      qword ptr [rsp + 0xb0], rax
00000001808e3ddc: movss    xmm0, dword ptr [rsp + 0xb0]
00000001808e3de5: movss    xmm1, dword ptr [rsp + 0xb4]
00000001808e3dee: subss    xmm0, dword ptr [rsi + 0x1f0]
00000001808e3df6: subss    xmm1, dword ptr [rsi + 0x1f4]
00000001808e3dfe: unpcklps xmm0, xmm1
00000001808e3e01: lea      rcx, [rsp + 0xb0]
00000001808e3e09: xor      edx, edx
00000001808e3e0b: movsd    qword ptr [rsp + 0xb0], xmm0
00000001808e3e14: call     0x180535480
00000001808e3e19: movss    dword ptr [rdi + 0x3c], xmm0
00000001808e3e1e: mov      byte ptr [rdi + 0x40], 1
00000001808e3e22: xor      edx, edx
00000001808e3e24: mov      rcx, rsi
00000001808e3e27: call     0x180663060 ; Torappu.RoguelikeChoiceDisplayData.ShouldSerializeeffectHintType [32018] | Torappu.Battle.BObject.get_isValid [65018]
00000001808e3e2c: test     al, al
00000001808e3e2e: je       0x1808e3b57
00000001808e3e34: movups   xmm0, xmmword ptr [rsi + 0x1b8]
00000001808e3e3b: mov      rdx, qword ptr [rip + 0x8086c0e] ; GenericMethodInfo 285168 @0x18896aa50
00000001808e3e42: lea      rcx, [rsp + 0x30]
00000001808e3e47: movaps   xmmword ptr [rsp + 0x30], xmm0
00000001808e3e4c: call     0x18449ab40
00000001808e3e51: test     al, al
00000001808e3e53: je       0x1808e3b57
00000001808e3e59: movups   xmm0, xmmword ptr [rsi + 0xf8]
00000001808e3e60: mov      rdx, qword ptr [rip + 0x8086be9] ; GenericMethodInfo 285168 @0x18896aa50
00000001808e3e67: lea      rcx, [rsp + 0x30]
00000001808e3e6c: movaps   xmmword ptr [rsp + 0x30], xmm0
00000001808e3e71: call     0x18449ab40
00000001808e3e76: test     al, al
00000001808e3e78: je       0x1808e3b57
00000001808e3e7e: mov      rax, qword ptr [rip + 0x7f8674b] ; TypeInfo Torappu.Battle.Yields @0x18886a5d0
00000001808e3e85: cmp      dword ptr [rax + 0xe0], 0
00000001808e3e8c: jne      0x1808e3e9d
00000001808e3e8e: mov      rcx, rax
00000001808e3e91: call     0x18048c140
00000001808e3e96: mov      rax, qword ptr [rip + 0x7f86733] ; TypeInfo Torappu.Battle.Yields @0x18886a5d0
00000001808e3e9d: mov      rax, qword ptr [rax + 0xb8]
00000001808e3ea4: lea      rcx, [rdi + 0x18]
00000001808e3ea8: mov      rdx, qword ptr [rax]
00000001808e3eab: mov      qword ptr [rdi + 0x18], rdx
00000001808e3eaf: call     0x18048b9e0
00000001808e3eb4: mov      dword ptr [rdi + 0x10], 3
00000001808e3ebb: jmp      0x1808e404d
00000001808e3ec0: xor      edx, edx
00000001808e3ec2: mov      rcx, rsi
00000001808e3ec5: call     0x1808daf40 ; Torappu.Battle.Projectile.StopMe [71373]
00000001808e3eca: xor      al, al
00000001808e3ecc: jmp      0x1808e404f
00000001808e3ed1: mov      dword ptr [rdi + 0x10], 0xffffffff
00000001808e3ed8: xor      al, al
00000001808e3eda: jmp      0x1808e404f
00000001808e3edf: mov      rbx, qword ptr [rdi + 0x20]
00000001808e3ee3: mov      dword ptr [rdi + 0x10], 0xffffffff
00000001808e3eea: mov      rdx, qword ptr [rip + 0x7f377bf] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
00000001808e3ef1: test     rbx, rbx
00000001808e3ef4: jne      0x1808e3f01
00000001808e3ef6: xor      ebp, ebp
00000001808e3ef8: mov      qword ptr [rdi + 0x30], rbp
00000001808e3efc: jmp      0x1808e3fa9
00000001808e3f01: cmp      byte ptr [rip + 0x83e88e8], 0
00000001808e3f08: mov      r8, qword ptr [rbx]
00000001808e3f0b: jbe      0x1808e3f25
00000001808e3f0d: mov      rcx, r8
00000001808e3f10: call     0x1804463e0
00000001808e3f15: xor      ebp, ebp
00000001808e3f17: test     al, al
00000001808e3f19: mov      ecx, ebp
00000001808e3f1b: cmovne   rcx, rbx
00000001808e3f1f: mov      qword ptr [rdi + 0x30], rcx
00000001808e3f23: jmp      0x1808e3f5c
00000001808e3f25: movzx    eax, byte ptr [rdx + 0x130]
00000001808e3f2c: xor      ebp, ebp
00000001808e3f2e: cmp      byte ptr [r8 + 0x130], al
00000001808e3f35: jb       0x1808e3f4d
00000001808e3f37: movzx    ecx, al
00000001808e3f3a: mov      rax, qword ptr [r8 + 0xc8]
00000001808e3f41: cmp      qword ptr [rax + rcx*8 - 8], rdx
00000001808e3f46: mov      ecx, 1
00000001808e3f4b: je       0x1808e3f4f
00000001808e3f4d: mov      ecx, ebp
00000001808e3f4f: test     ecx, ecx
00000001808e3f51: mov      rax, rbp
00000001808e3f54: cmovne   rax, rbx
00000001808e3f58: mov      qword ptr [rdi + 0x30], rax
00000001808e3f5c: cmp      byte ptr [rip + 0x83e888d], 0
00000001808e3f63: mov      rdx, qword ptr [rip + 0x7f37746] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
00000001808e3f6a: mov      r8, qword ptr [rbx]
00000001808e3f6d: jbe      0x1808e3f7b
00000001808e3f6f: mov      rcx, r8
00000001808e3f72: call     0x1804463e0
00000001808e3f77: test     al, al
00000001808e3f79: jmp      0x1808e3fa5
00000001808e3f7b: movzx    eax, byte ptr [rdx + 0x130]
00000001808e3f82: cmp      byte ptr [r8 + 0x130], al
00000001808e3f89: jb       0x1808e3fa1
00000001808e3f8b: movzx    ecx, al
00000001808e3f8e: mov      rax, qword ptr [r8 + 0xc8]
00000001808e3f95: cmp      qword ptr [rax + rcx*8 - 8], rdx
00000001808e3f9a: mov      eax, 1
00000001808e3f9f: je       0x1808e3fa3
00000001808e3fa1: mov      eax, ebp
00000001808e3fa3: test     eax, eax
00000001808e3fa5: cmovne   rbp, rbx
00000001808e3fa9: lea      rcx, [rdi + 0x30]
00000001808e3fad: mov      rdx, rbp
00000001808e3fb0: call     0x18048b9e0
00000001808e3fb5: mov      rcx, qword ptr [rip + 0x804ed2c] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808e3fbc: mov      rbx, qword ptr [rdi + 0x30]
00000001808e3fc0: cmp      dword ptr [rcx + 0xe0], 0
00000001808e3fc7: jne      0x1808e3fce
00000001808e3fc9: call     0x18048c140
00000001808e3fce: xor      r8d, r8d
00000001808e3fd1: xor      edx, edx
00000001808e3fd3: mov      rcx, rbx
00000001808e3fd6: call     0x186b638d0
00000001808e3fdb: test     al, al
00000001808e3fdd: jne      0x1808e4010
00000001808e3fdf: test     rsi, rsi
00000001808e3fe2: je       0x1808e407e
00000001808e3fe8: mov      rdx, qword ptr [rdi + 0x20]
00000001808e3fec: xor      r8d, r8d
00000001808e3fef: mov      rcx, rsi
00000001808e3ff2: call     0x1808d2340 ; Torappu.Battle.LinkProjectile.DoLink [71181]
00000001808e3ff7: lea      rcx, [rdi + 0x18]
00000001808e3ffb: mov      qword ptr [rdi + 0x18], rax
00000001808e3fff: mov      rdx, rax
00000001808e4002: call     0x18048b9e0
00000001808e4007: mov      dword ptr [rdi + 0x10], 2
00000001808e400e: jmp      0x1808e404d
00000001808e4010: mov      rax, qword ptr [rip + 0x7f865b9] ; TypeInfo Torappu.Battle.Yields @0x18886a5d0
00000001808e4017: cmp      dword ptr [rax + 0xe0], 0
00000001808e401e: jne      0x1808e402f
00000001808e4020: mov      rcx, rax
00000001808e4023: call     0x18048c140
00000001808e4028: mov      rax, qword ptr [rip + 0x7f865a1] ; TypeInfo Torappu.Battle.Yields @0x18886a5d0
00000001808e402f: mov      rax, qword ptr [rax + 0xb8]
00000001808e4036: lea      rcx, [rdi + 0x18]
00000001808e403a: mov      rdx, qword ptr [rax]
00000001808e403d: mov      qword ptr [rdi + 0x18], rdx
00000001808e4041: call     0x18048b9e0
00000001808e4046: mov      dword ptr [rdi + 0x10], 1
00000001808e404d: mov      al, 1
00000001808e404f: movaps   xmm7, xmmword ptr [rsp + 0x70]
00000001808e4054: movaps   xmm6, xmmword ptr [rsp + 0x80]
00000001808e405c: mov      r14, qword ptr [rsp + 0x90]
00000001808e4064: mov      rbp, qword ptr [rsp + 0xc0]
00000001808e406c: mov      rbx, qword ptr [rsp + 0xb8]
00000001808e4074: add      rsp, 0x98
00000001808e407b: pop      rdi
00000001808e407c: pop      rsi
00000001808e407d: ret      
00000001808e407e: call     0x18048c0b0
00000001808e4083: int3     
00000001808e4084: int3     
00000001808e4085: int3     
00000001808e4086: int3     
00000001808e4087: int3     
00000001808e4088: int3     
00000001808e4089: int3     
00000001808e408a: int3     
00000001808e408b: int3     
00000001808e408c: int3     
00000001808e408d: int3     
00000001808e408e: int3     
00000001808e408f: int3     