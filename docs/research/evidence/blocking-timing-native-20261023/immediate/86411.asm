; Torappu.Battle.Projectiles.PullHitTargetBehaviour.OnTick metadata=86411 token=0x601518c VA=0x180d42d90 RVA=0xd42d90 size=0x100
0000000180d42d90: mov      qword ptr [rsp + 0x10], rbx
0000000180d42d95: push     rsi
0000000180d42d96: sub      rsp, 0x20
0000000180d42d9a: cmp      byte ptr [rip + 0x7f51836], 0
0000000180d42da1: mov      rbx, rdx
0000000180d42da4: mov      rsi, rcx
0000000180d42da7: jne      0x180d42dc8
0000000180d42da9: lea      rcx, [rip + 0x7b17950] ; TypeInfo Torappu.FP @0x18885a700
0000000180d42db0: call     0x18048bf00
0000000180d42db5: lea      rcx, [rip + 0x7ae8ac4] ; TypeInfo Torappu.Battle.Projectiles.PullHitTargetBehaviour @0x18882b880
0000000180d42dbc: call     0x18048bf00
0000000180d42dc1: mov      byte ptr [rip + 0x7f5180f], 1
0000000180d42dc8: mov      rax, qword ptr [rip + 0x7ae8ab1] ; TypeInfo Torappu.Battle.Projectiles.PullHitTargetBehaviour @0x18882b880
0000000180d42dcf: mov      rdx, qword ptr [rax + 0xb8]
0000000180d42dd6: mov      rcx, qword ptr [rdx + 8]
0000000180d42dda: test     rcx, rcx
0000000180d42ddd: jne      0x180d42e71
0000000180d42de3: mov      qword ptr [rsp + 0x30], rdi
0000000180d42de8: xor      r8d, r8d
0000000180d42deb: mov      rdx, rbx
0000000180d42dee: mov      rcx, rsi
0000000180d42df1: call     0x1808ccaf0 ; Torappu.Battle.CacheAtkToBBBehaviour.<>xLuaBaseProxy_OnTick [71088] | Torappu.Battle.BasicMovement.<>xLuaBaseProxy_OnTick [71238] | Torappu.Battle.Projectile.Behaviour.OnTick [71412]
0000000180d42df6: mov      rcx, qword ptr [rip + 0x7b17903] ; TypeInfo Torappu.FP @0x18885a700
0000000180d42dfd: mov      rdi, qword ptr [rsi + 0x38]
0000000180d42e01: cmp      dword ptr [rcx + 0xe0], 0
0000000180d42e08: jne      0x180d42e0f
0000000180d42e0a: call     0x18048c140
0000000180d42e0f: xor      r8d, r8d
0000000180d42e12: mov      rdx, rbx
0000000180d42e15: mov      rcx, rdi
0000000180d42e18: call     0x1866fba10
0000000180d42e1d: xor      edx, edx
0000000180d42e1f: mov      qword ptr [rsi + 0x38], rax
0000000180d42e23: xor      ecx, ecx
0000000180d42e25: mov      rbx, rax
0000000180d42e28: call     0x1866fdac0
0000000180d42e2d: xor      r8d, r8d
0000000180d42e30: mov      rdx, rax
0000000180d42e33: mov      rcx, rbx
0000000180d42e36: call     0x185ed91f0
0000000180d42e3b: mov      rdi, qword ptr [rsp + 0x30]
0000000180d42e40: test     al, al
0000000180d42e42: je       0x180d42e7f
0000000180d42e44: mov      rcx, qword ptr [rip + 0x7b178b5] ; TypeInfo Torappu.FP @0x18885a700
0000000180d42e4b: cmp      dword ptr [rcx + 0xe0], 0
0000000180d42e52: jne      0x180d42e59
0000000180d42e54: call     0x18048c140
0000000180d42e59: xor      edx, edx
0000000180d42e5b: xor      ecx, ecx
0000000180d42e5d: call     0x1866fdac0
0000000180d42e62: mov      qword ptr [rsi + 0x38], rax
0000000180d42e66: mov      rbx, qword ptr [rsp + 0x38]
0000000180d42e6b: add      rsp, 0x20
0000000180d42e6f: pop      rsi
0000000180d42e70: ret      
0000000180d42e71: xor      r9d, r9d
0000000180d42e74: mov      r8, rbx
0000000180d42e77: mov      rdx, rsi
0000000180d42e7a: call     0x1833f9830 ; XLua.DelegateBridge.__Gen_Delegate_Imp427 [3082]
0000000180d42e7f: mov      rbx, qword ptr [rsp + 0x38]
0000000180d42e84: add      rsp, 0x20
0000000180d42e88: pop      rsi
0000000180d42e89: ret      
0000000180d42e8a: int3     
0000000180d42e8b: int3     
0000000180d42e8c: int3     
0000000180d42e8d: int3     
0000000180d42e8e: int3     
0000000180d42e8f: int3     