; Torappu.Battle.Projectiles.PullHitTargetBehaviour.OnProjectileStop metadata=86413 token=0x601518e VA=0x180d42ae0 RVA=0xd42ae0 size=0x2b0
0000000180d42ae0: push     rsi
0000000180d42ae2: sub      rsp, 0x40
0000000180d42ae6: cmp      byte ptr [rip + 0x7f51aec], 0
0000000180d42aed: mov      rsi, rcx
0000000180d42af0: jne      0x180d42b59
0000000180d42af2: lea      rcx, [rip + 0x7be5267] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
0000000180d42af9: call     0x18048bf00
0000000180d42afe: lea      rcx, [rip + 0x7c27f4b] ; GenericMethodInfo 285168 @0x18896aa50
0000000180d42b05: call     0x18048bf00
0000000180d42b0a: lea      rcx, [rip + 0x7b29757] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180d42b11: call     0x18048bf00
0000000180d42b16: lea      rcx, [rip + 0x7ad8b93] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180d42b1d: call     0x18048bf00
0000000180d42b22: lea      rcx, [rip + 0x7b4d44f] ; TypeInfo Torappu.Battle.LinkProjectile @0x18888ff78
0000000180d42b29: call     0x18048bf00
0000000180d42b2e: lea      rcx, [rip + 0x7bf2a73] ; GenericMethodInfo 280377 @0x1889355a8
0000000180d42b35: call     0x18048bf00
0000000180d42b3a: lea      rcx, [rip + 0x7bf01a7] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180d42b41: call     0x18048bf00
0000000180d42b46: lea      rcx, [rip + 0x7ae8d33] ; TypeInfo Torappu.Battle.Projectiles.PullHitTargetBehaviour @0x18882b880
0000000180d42b4d: call     0x18048bf00
0000000180d42b52: mov      byte ptr [rip + 0x7f51a80], 1
0000000180d42b59: mov      rax, qword ptr [rip + 0x7ae8d20] ; TypeInfo Torappu.Battle.Projectiles.PullHitTargetBehaviour @0x18882b880
0000000180d42b60: xorps    xmm0, xmm0
0000000180d42b63: movups   xmmword ptr [rsp + 0x20], xmm0
0000000180d42b68: mov      rcx, qword ptr [rax + 0xb8]
0000000180d42b6f: mov      rcx, qword ptr [rcx + 0x18]
0000000180d42b73: test     rcx, rcx
0000000180d42b76: jne      0x180d42d74
0000000180d42b7c: mov      qword ptr [rsp + 0x50], rbx
0000000180d42b81: mov      qword ptr [rsp + 0x58], rdi
0000000180d42b86: xor      edx, edx
0000000180d42b88: mov      rcx, rsi
0000000180d42b8b: call     0x1808cca90 ; Torappu.Battle.CacheAtkToBBBehaviour.<>xLuaBaseProxy_OnProjectileStop [71087] | Torappu.Battle.ProjectileTileMarkBehaviour.<>xLuaBaseProxy_OnProjectileStop [71093] | Torappu.Battle.BasicMovement.<>xLuaBaseProxy_OnProjectileStop [71239] | Torappu.Battle.Projectile.Behaviour.OnProjectileStop [71414]
0000000180d42b90: xor      edx, edx
0000000180d42b92: mov      rcx, rsi
0000000180d42b95: call     0x1808cf100 ; Torappu.Battle.Projectile.Behaviour.get_projectile [71401]
0000000180d42b9a: mov      rdx, qword ptr [rip + 0x7b4d3d7] ; TypeInfo Torappu.Battle.LinkProjectile @0x18888ff78
0000000180d42ba1: mov      rbx, rax
0000000180d42ba4: test     rax, rax
0000000180d42ba7: jne      0x180d42bad
0000000180d42ba9: xor      edi, edi
0000000180d42bab: jmp      0x180d42bf7
0000000180d42bad: cmp      byte ptr [rip + 0x7f89c3c], 0
0000000180d42bb4: mov      r8, qword ptr [rax]
0000000180d42bb7: jbe      0x180d42bc7
0000000180d42bb9: mov      rcx, r8
0000000180d42bbc: call     0x1804463e0
0000000180d42bc1: xor      edi, edi
0000000180d42bc3: test     al, al
0000000180d42bc5: jmp      0x180d42bf3
0000000180d42bc7: movzx    eax, byte ptr [rdx + 0x130]
0000000180d42bce: xor      edi, edi
0000000180d42bd0: cmp      byte ptr [r8 + 0x130], al
0000000180d42bd7: jb       0x180d42bef
0000000180d42bd9: movzx    ecx, al
0000000180d42bdc: mov      rax, qword ptr [r8 + 0xc8]
0000000180d42be3: cmp      qword ptr [rax + rcx*8 - 8], rdx
0000000180d42be8: mov      eax, 1
0000000180d42bed: je       0x180d42bf1
0000000180d42bef: mov      eax, edi
0000000180d42bf1: test     eax, eax
0000000180d42bf3: cmovne   rdi, rbx
0000000180d42bf7: mov      rcx, qword ptr [rip + 0x7bf00ea] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180d42bfe: cmp      dword ptr [rcx + 0xe0], 0
0000000180d42c05: jne      0x180d42c0c
0000000180d42c07: call     0x18048c140
0000000180d42c0c: xor      r8d, r8d
0000000180d42c0f: xor      edx, edx
0000000180d42c11: mov      rcx, rdi
0000000180d42c14: call     0x186b63a70
0000000180d42c19: test     al, al
0000000180d42c1b: je       0x180d42d42
0000000180d42c21: test     rdi, rdi
0000000180d42c24: je       0x180d42d85
0000000180d42c2a: xor      edx, edx
0000000180d42c2c: mov      rcx, rdi
0000000180d42c2f: call     0x1808d3360 ; Torappu.Battle.LinkProjectile.get_isAttachedToTarget [71165]
0000000180d42c34: xor      r8d, r8d
0000000180d42c37: lea      rcx, [rsp + 0x30]
0000000180d42c3c: mov      rdx, rdi
0000000180d42c3f: movzx    ebx, al
0000000180d42c42: call     0x1808d3420 ; Torappu.Battle.LinkProjectile.get_linkTarget [71163]
0000000180d42c47: movups   xmm0, xmmword ptr [rax]
0000000180d42c4a: movups   xmmword ptr [rsp + 0x20], xmm0
0000000180d42c4f: test     bl, bl
0000000180d42c51: je       0x180d42d42
0000000180d42c57: movups   xmm0, xmmword ptr [rax]
0000000180d42c5a: mov      rdx, qword ptr [rip + 0x7c27def] ; GenericMethodInfo 285168 @0x18896aa50
0000000180d42c61: lea      rcx, [rsp + 0x30]
0000000180d42c66: movaps   xmmword ptr [rsp + 0x30], xmm0
0000000180d42c6b: call     0x18449ab40
0000000180d42c70: test     al, al
0000000180d42c72: je       0x180d42d42
0000000180d42c78: xor      r8d, r8d
0000000180d42c7b: xor      edx, edx
0000000180d42c7d: mov      rcx, rdi
0000000180d42c80: call     0x1808d35c0 ; Torappu.Battle.LinkProjectile.set_isAttachedToTarget [71164]
0000000180d42c85: mov      rdx, qword ptr [rip + 0x7bf291c] ; GenericMethodInfo 280377 @0x1889355a8
0000000180d42c8c: lea      rcx, [rsp + 0x20]
0000000180d42c91: call     0x185159d80
0000000180d42c96: mov      rdx, qword ptr [rip + 0x7ad8a13] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180d42c9d: mov      rcx, rax
0000000180d42ca0: call     0x1800057a0
0000000180d42ca5: mov      rcx, qword ptr [rip + 0x7bf003c] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180d42cac: mov      rbx, rax
0000000180d42caf: cmp      dword ptr [rcx + 0xe0], 0
0000000180d42cb6: jne      0x180d42cbd
0000000180d42cb8: call     0x18048c140
0000000180d42cbd: xor      r8d, r8d
0000000180d42cc0: xor      edx, edx
0000000180d42cc2: mov      rcx, rbx
0000000180d42cc5: call     0x186b63a70
0000000180d42cca: test     al, al
0000000180d42ccc: je       0x180d42d42
0000000180d42cce: xor      edx, edx
0000000180d42cd0: mov      rcx, rsi
0000000180d42cd3: call     0x1808cf100 ; Torappu.Battle.Projectile.Behaviour.get_projectile [71401]
0000000180d42cd8: test     rbx, rbx
0000000180d42cdb: je       0x180d42d85
0000000180d42ce1: mov      ecx, 0xea
0000000180d42ce6: mov      r8, rax
0000000180d42ce9: mov      rdx, rbx
0000000180d42cec: call     0x180005480
0000000180d42cf1: xor      edx, edx
0000000180d42cf3: mov      rcx, rsi
0000000180d42cf6: call     0x1808cf160 ; Torappu.Battle.Projectile.Behaviour.get_source [71404]
0000000180d42cfb: mov      rdx, qword ptr [rip + 0x7b29566] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180d42d02: mov      rcx, rax
0000000180d42d05: call     0x1800057a0
0000000180d42d0a: mov      rcx, qword ptr [rip + 0x7beffd7] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180d42d11: mov      rbx, rax
0000000180d42d14: cmp      dword ptr [rcx + 0xe0], 0
0000000180d42d1b: jne      0x180d42d22
0000000180d42d1d: call     0x18048c140
0000000180d42d22: xor      r8d, r8d
0000000180d42d25: xor      edx, edx
0000000180d42d27: mov      rcx, rbx
0000000180d42d2a: call     0x186b63a70
0000000180d42d2f: test     al, al
0000000180d42d31: je       0x180d42d42
0000000180d42d33: test     rbx, rbx
0000000180d42d36: je       0x180d42d85
0000000180d42d38: xor      edx, edx
0000000180d42d3a: mov      rcx, rbx
0000000180d42d3d: call     0x180a31400 ; Torappu.Battle.Character.SearchBlockeeImmediate [75955]
0000000180d42d42: mov      rcx, qword ptr [rip + 0x7be5017] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
0000000180d42d49: cmp      dword ptr [rcx + 0xe0], 0
0000000180d42d50: jne      0x180d42d57
0000000180d42d52: call     0x18048c140
0000000180d42d57: xor      r8d, r8d
0000000180d42d5a: mov      dl, 1
0000000180d42d5c: mov      rcx, rsi
0000000180d42d5f: call     0x180633870 ; Torappu.Battle.BattleController.StopAllBattleCoroutines [64745]
0000000180d42d64: mov      rbx, qword ptr [rsp + 0x50]
0000000180d42d69: mov      rdi, qword ptr [rsp + 0x58]
0000000180d42d6e: add      rsp, 0x40
0000000180d42d72: pop      rsi
0000000180d42d73: ret      
0000000180d42d74: xor      r8d, r8d
0000000180d42d77: mov      rdx, rsi
0000000180d42d7a: call     0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
0000000180d42d7f: add      rsp, 0x40
0000000180d42d83: pop      rsi
0000000180d42d84: ret      
0000000180d42d85: call     0x18048c0b0
0000000180d42d8a: int3     
0000000180d42d8b: int3     
0000000180d42d8c: int3     
0000000180d42d8d: int3     
0000000180d42d8e: int3     
0000000180d42d8f: int3     