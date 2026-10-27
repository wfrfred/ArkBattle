; Torappu.Battle.Projectiles.SelectorHitBehaviour.OnTick metadata=86499 token=0x60151e4 VA=0x180d49a40 RVA=0xd49a40 size=0x2e0
0000000180d49a40: mov      qword ptr [rsp + 0x18], rbx
0000000180d49a45: push     r14
0000000180d49a47: sub      rsp, 0x20
0000000180d49a4b: cmp      byte ptr [rip + 0x7f4abc1], 0
0000000180d49a52: mov      rbx, rdx
0000000180d49a55: mov      r14, rcx
0000000180d49a58: jne      0x180d49a9d
0000000180d49a5a: lea      rcx, [rip + 0x7b10c9f] ; TypeInfo Torappu.FP @0x18885a700
0000000180d49a61: call     0x18048bf00
0000000180d49a66: lea      rcx, [rip + 0x7b7a1cb] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180d49a6d: call     0x18048bf00
0000000180d49a72: lea      rcx, [rip + 0x7bb29af] ; TypeInfo Torappu.Battle.MountPoint @0x1888fc428
0000000180d49a79: call     0x18048bf00
0000000180d49a7e: lea      rcx, [rip + 0x7be9263] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180d49a85: call     0x18048bf00
0000000180d49a8a: lea      rcx, [rip + 0x7bea397] ; TypeInfo Torappu.Battle.Projectiles.SelectorHitBehaviour @0x188933e28
0000000180d49a91: call     0x18048bf00
0000000180d49a96: mov      byte ptr [rip + 0x7f4ab76], 1
0000000180d49a9d: mov      rax, qword ptr [rip + 0x7bea384] ; TypeInfo Torappu.Battle.Projectiles.SelectorHitBehaviour @0x188933e28
0000000180d49aa4: mov      rcx, qword ptr [rax + 0xb8]
0000000180d49aab: mov      rcx, qword ptr [rcx + 0x40]
0000000180d49aaf: test     rcx, rcx
0000000180d49ab2: jne      0x180d49cf4
0000000180d49ab8: mov      qword ptr [rsp + 0x38], rdi
0000000180d49abd: xor      r8d, r8d
0000000180d49ac0: mov      rdx, rbx
0000000180d49ac3: mov      rcx, r14
0000000180d49ac6: call     0x1808ccaf0 ; Torappu.Battle.CacheAtkToBBBehaviour.<>xLuaBaseProxy_OnTick [71088] | Torappu.Battle.BasicMovement.<>xLuaBaseProxy_OnTick [71238] | Torappu.Battle.Projectile.Behaviour.OnTick [71412]
0000000180d49acb: mov      rcx, qword ptr [rip + 0x7be9216] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180d49ad2: mov      rdi, qword ptr [r14 + 0x28]
0000000180d49ad6: cmp      dword ptr [rcx + 0xe0], 0
0000000180d49add: jne      0x180d49ae4
0000000180d49adf: call     0x18048c140
0000000180d49ae4: xor      r8d, r8d
0000000180d49ae7: xor      edx, edx
0000000180d49ae9: mov      rcx, rdi
0000000180d49aec: call     0x186b63a70
0000000180d49af1: test     al, al
0000000180d49af3: je       0x180d49c80
0000000180d49af9: cmp      byte ptr [rip + 0x7f82cf0], 0
0000000180d49b00: jbe      0x180d49b0a
0000000180d49b02: mov      rcx, qword ptr [r14]
0000000180d49b05: call     0x180446d00
0000000180d49b0a: mov      rdx, qword ptr [r14]
0000000180d49b0d: mov      rcx, r14
0000000180d49b10: mov      rax, qword ptr [rdx + 0x240]
0000000180d49b17: mov      rdx, qword ptr [rdx + 0x248]
0000000180d49b1e: call     rax
0000000180d49b20: test     al, al
0000000180d49b22: je       0x180d49c80
0000000180d49b28: cmp      byte ptr [r14 + 0x43], 0
0000000180d49b2d: jne      0x180d49b41
0000000180d49b2f: xor      edx, edx
0000000180d49b31: mov      rcx, r14
0000000180d49b34: call     0x1808cee80 ; Torappu.Battle.Projectile.Behaviour.get_hasReached [71407]
0000000180d49b39: test     al, al
0000000180d49b3b: je       0x180d49c80
0000000180d49b41: mov      rcx, qword ptr [r14 + 0x78]
0000000180d49b45: test     rcx, rcx
0000000180d49b48: je       0x180d49d0d
0000000180d49b4e: xor      edx, edx
0000000180d49b50: call     0x181e04d40 ; Torappu.PeriodicTimer.get_isValid [25965]
0000000180d49b55: test     al, al
0000000180d49b57: je       0x180d49c80
0000000180d49b5d: movss    xmm1, dword ptr [r14 + 0x80]
0000000180d49b66: xorps    xmm0, xmm0
0000000180d49b69: comiss   xmm1, xmm0
0000000180d49b6c: jbe      0x180d49c0d
0000000180d49b72: cmp      byte ptr [r14 + 0x84], 0
0000000180d49b7a: jne      0x180d49c0d
0000000180d49b80: mov      rdi, qword ptr [r14 + 0x78]
0000000180d49b84: test     rdi, rdi
0000000180d49b87: je       0x180d49d0d
0000000180d49b8d: mov      rcx, qword ptr [rip + 0x7b10b6c] ; TypeInfo Torappu.FP @0x18885a700
0000000180d49b94: mov      rdi, qword ptr [rdi + 0x18]
0000000180d49b98: mov      qword ptr [rsp + 0x30], rsi
0000000180d49b9d: cmp      dword ptr [rcx + 0xe0], 0
0000000180d49ba4: jne      0x180d49bab
0000000180d49ba6: call     0x18048c140
0000000180d49bab: xor      r8d, r8d
0000000180d49bae: mov      rdx, rbx
0000000180d49bb1: mov      rcx, rdi
0000000180d49bb4: call     0x1866fba10
0000000180d49bb9: movss    xmm0, dword ptr [r14 + 0x80]
0000000180d49bc2: xor      edx, edx
0000000180d49bc4: mov      rdi, rax
0000000180d49bc7: call     0x1866fdad0
0000000180d49bcc: mov      rcx, qword ptr [rip + 0x7b7a065] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180d49bd3: mov      rsi, rax
0000000180d49bd6: cmp      dword ptr [rcx + 0xe0], 0
0000000180d49bdd: jne      0x180d49be4
0000000180d49bdf: call     0x18048c140
0000000180d49be4: xor      r8d, r8d
0000000180d49be7: mov      rdx, rsi
0000000180d49bea: mov      rcx, rdi
0000000180d49bed: call     0x1866e5700
0000000180d49bf2: mov      rsi, qword ptr [rsp + 0x30]
0000000180d49bf7: test     al, al
0000000180d49bf9: je       0x180d49c0d
0000000180d49bfb: xor      edx, edx
0000000180d49bfd: mov      rcx, r14
0000000180d49c00: call     0x180d49eb0 ; Torappu.Battle.Projectiles.SelectorHitBehaviour._PlayEffectsWhenSelect [86506]
0000000180d49c05: mov      byte ptr [r14 + 0x84], 1
0000000180d49c0d: mov      rcx, qword ptr [r14 + 0x78]
0000000180d49c11: test     rcx, rcx
0000000180d49c14: je       0x180d49d0d
0000000180d49c1a: movzx    r8d, byte ptr [r14 + 0x44]
0000000180d49c1f: xor      r9d, r9d
0000000180d49c22: mov      rdx, rbx
0000000180d49c25: call     0x181e049e0 ; Torappu.PeriodicTimer.Update [25980]
0000000180d49c2a: test     al, al
0000000180d49c2c: je       0x180d49c80
0000000180d49c2e: mov      ecx, 0x11
0000000180d49c33: mov      rdx, r14
0000000180d49c36: call     0x180005610
0000000180d49c3b: xor      edx, edx
0000000180d49c3d: mov      rcx, r14
0000000180d49c40: call     0x180d4a3a0 ; Torappu.Battle.Projectiles.SelectorHitBehaviour.get_limitedTimeUsedUp [86495]
0000000180d49c45: mov      r8, qword ptr [r14 + 0x78]
0000000180d49c49: test     r8, r8
0000000180d49c4c: je       0x180d49d0d
0000000180d49c52: test     al, al
0000000180d49c54: jne      0x180d49c65
0000000180d49c56: mov      ecx, 7
0000000180d49c5b: mov      rdx, r8
0000000180d49c5e: call     0x180005610
0000000180d49c63: jmp      0x180d49c80
0000000180d49c65: xor      edx, edx
0000000180d49c67: mov      rcx, r8
0000000180d49c6a: call     0x181e04430 ; Torappu.PeriodicTimer.MarkInvalid [25976]
0000000180d49c6f: cmp      byte ptr [r14 + 0x74], 0
0000000180d49c74: je       0x180d49c80
0000000180d49c76: xor      edx, edx
0000000180d49c78: mov      rcx, r14
0000000180d49c7b: call     0x1808ce920 ; Torappu.Battle.Projectile.Behaviour.Stop [71422]
0000000180d49c80: cmp      byte ptr [r14 + 0x4c], 0
0000000180d49c85: je       0x180d49ce3
0000000180d49c87: xor      edx, edx
0000000180d49c89: mov      rcx, r14
0000000180d49c8c: call     0x1808cee80 ; Torappu.Battle.Projectile.Behaviour.get_hasReached [71407]
0000000180d49c91: test     al, al
0000000180d49c93: jne      0x180d49ce3
0000000180d49c95: mov      rdx, qword ptr [rip + 0x7bb278c] ; TypeInfo Torappu.Battle.MountPoint @0x1888fc428
0000000180d49c9c: mov      rcx, qword ptr [r14 + 0xa0]
0000000180d49ca3: call     0x1800057a0
0000000180d49ca8: test     rax, rax
0000000180d49cab: je       0x180d49ce3
0000000180d49cad: xor      edx, edx
0000000180d49caf: mov      rcx, rax
0000000180d49cb2: call     0x1808b5ca0 ; Torappu.Battle.MountPoint.get_isValid [71036]
0000000180d49cb7: test     al, al
0000000180d49cb9: je       0x180d49ce3
0000000180d49cbb: xor      edx, edx
0000000180d49cbd: mov      rcx, r14
0000000180d49cc0: call     0x1808cf100 ; Torappu.Battle.Projectile.Behaviour.get_projectile [71401]
0000000180d49cc5: test     rax, rax
0000000180d49cc8: je       0x180d49d0d
0000000180d49cca: mov      rdx, qword ptr [r14 + 0xa0]
0000000180d49cd1: lea      r8, [r14 + 0x90]
0000000180d49cd8: xor      r9d, r9d
0000000180d49cdb: mov      rcx, rax
0000000180d49cde: call     0x1808db500 ; Torappu.Battle.Projectile.UpdateTargetGroundPosZ [71345]
0000000180d49ce3: mov      rdi, qword ptr [rsp + 0x38]
0000000180d49ce8: mov      rbx, qword ptr [rsp + 0x40]
0000000180d49ced: add      rsp, 0x20
0000000180d49cf1: pop      r14
0000000180d49cf3: ret      
0000000180d49cf4: xor      r9d, r9d
0000000180d49cf7: mov      r8, rbx
0000000180d49cfa: mov      rdx, r14
0000000180d49cfd: mov      rbx, qword ptr [rsp + 0x40]
0000000180d49d02: add      rsp, 0x20
0000000180d49d06: pop      r14
0000000180d49d08: jmp      0x1833f9830 ; XLua.DelegateBridge.__Gen_Delegate_Imp427 [3082]
0000000180d49d0d: call     0x18048c0b0
0000000180d49d12: int3     
0000000180d49d13: int3     
0000000180d49d14: int3     
0000000180d49d15: int3     
0000000180d49d16: int3     
0000000180d49d17: int3     
0000000180d49d18: int3     
0000000180d49d19: int3     
0000000180d49d1a: int3     
0000000180d49d1b: int3     
0000000180d49d1c: int3     
0000000180d49d1d: int3     
0000000180d49d1e: int3     
0000000180d49d1f: int3     