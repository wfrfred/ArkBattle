; Torappu.Battle.Projectiles.SelectorHitBehaviour._FindTargets_DISPOSE metadata=86507 token=0x60151ec VA=0x180d49d20 RVA=0xd49d20 size=0x190
0000000180d49d20: push     rbx
0000000180d49d22: sub      rsp, 0x30
0000000180d49d26: cmp      byte ptr [rip + 0x7f4a8ee], 0
0000000180d49d2d: mov      rbx, rcx
0000000180d49d30: movaps   xmmword ptr [rsp + 0x20], xmm6
0000000180d49d35: movq     xmm6, rdx
0000000180d49d3a: jne      0x180d49d67
0000000180d49d3c: lea      rcx, [rip + 0x7b81c4d] ; GenericMethodInfo 287974 @0x1888cb990
0000000180d49d43: call     0x18048bf00
0000000180d49d48: lea      rcx, [rip + 0x7be8f99] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180d49d4f: call     0x18048bf00
0000000180d49d54: lea      rcx, [rip + 0x7bea0cd] ; TypeInfo Torappu.Battle.Projectiles.SelectorHitBehaviour @0x188933e28
0000000180d49d5b: call     0x18048bf00
0000000180d49d60: mov      byte ptr [rip + 0x7f4a8b4], 1
0000000180d49d67: mov      rdx, qword ptr [rip + 0x7bea0ba] ; TypeInfo Torappu.Battle.Projectiles.SelectorHitBehaviour @0x188933e28
0000000180d49d6e: mov      rax, qword ptr [rdx + 0xb8]
0000000180d49d75: mov      rcx, qword ptr [rax + 0x80]
0000000180d49d7c: test     rcx, rcx
0000000180d49d7f: jne      0x180d49e8a
0000000180d49d85: cmp      byte ptr [rip + 0x7f4a880], cl
0000000180d49d8b: jne      0x180d49da7
0000000180d49d8d: lea      rcx, [rip + 0x7bea094] ; TypeInfo Torappu.Battle.Projectiles.SelectorHitBehaviour @0x188933e28
0000000180d49d94: call     0x18048bf00
0000000180d49d99: mov      rdx, qword ptr [rip + 0x7bea088] ; TypeInfo Torappu.Battle.Projectiles.SelectorHitBehaviour @0x188933e28
0000000180d49da0: mov      byte ptr [rip + 0x7f4a864], 1
0000000180d49da7: mov      rax, qword ptr [rdx + 0xb8]
0000000180d49dae: mov      rcx, qword ptr [rax]
0000000180d49db1: test     rcx, rcx
0000000180d49db4: jne      0x180d49dbc
0000000180d49db6: mov      rax, qword ptr [rbx + 0x28]
0000000180d49dba: jmp      0x180d49dc7
0000000180d49dbc: xor      r8d, r8d
0000000180d49dbf: mov      rdx, rbx
0000000180d49dc2: call     0x1832f68f0 ; XLua.DelegateBridge.__Gen_Delegate_Imp2633 [5288]
0000000180d49dc7: mov      qword ptr [rsp + 0x40], rsi
0000000180d49dcc: mov      qword ptr [rsp + 0x48], rdi
0000000180d49dd1: test     rax, rax
0000000180d49dd4: je       0x180d49ea4
0000000180d49dda: xor      r8d, r8d
0000000180d49ddd: movq     rdx, xmm6
0000000180d49de2: mov      rcx, rax
0000000180d49de5: call     0x1809fbcb0 ; Torappu.Battle.TargetSelector.FindTargets_DISPOSE [75093]
0000000180d49dea: xor      edx, edx
0000000180d49dec: mov      rcx, rbx
0000000180d49def: mov      rdi, rax
0000000180d49df2: call     0x1808cf160 ; Torappu.Battle.Projectile.Behaviour.get_source [71404]
0000000180d49df7: mov      rcx, qword ptr [rip + 0x7be8eea] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180d49dfe: mov      rsi, rax
0000000180d49e01: cmp      dword ptr [rcx + 0xe0], 0
0000000180d49e08: jne      0x180d49e0f
0000000180d49e0a: call     0x18048c140
0000000180d49e0f: xor      r8d, r8d
0000000180d49e12: xor      edx, edx
0000000180d49e14: mov      rcx, rsi
0000000180d49e17: call     0x186b63a70
0000000180d49e1c: test     al, al
0000000180d49e1e: je       0x180d49e72
0000000180d49e20: mov      rdx, qword ptr [rip + 0x7b81b69] ; GenericMethodInfo 287974 @0x1888cb990
0000000180d49e27: mov      rcx, rdi
0000000180d49e2a: call     0x1844afc00
0000000180d49e2f: test     eax, eax
0000000180d49e31: jle      0x180d49e72
0000000180d49e33: xor      edx, edx
0000000180d49e35: mov      rcx, rbx
0000000180d49e38: call     0x1808cf160 ; Torappu.Battle.Projectile.Behaviour.get_source [71404]
0000000180d49e3d: xor      edx, edx
0000000180d49e3f: mov      rcx, rbx
0000000180d49e42: mov      rsi, rax
0000000180d49e45: call     0x1808cf100 ; Torappu.Battle.Projectile.Behaviour.get_projectile [71401]
0000000180d49e4a: mov      rdx, qword ptr [rip + 0x7b81b3f] ; GenericMethodInfo 287974 @0x1888cb990
0000000180d49e51: mov      rcx, rdi
0000000180d49e54: mov      rbx, rax
0000000180d49e57: call     0x1844afc00
0000000180d49e5c: test     rsi, rsi
0000000180d49e5f: je       0x180d49ea4
0000000180d49e61: xor      r9d, r9d
0000000180d49e64: mov      r8d, eax
0000000180d49e67: mov      rdx, rbx
0000000180d49e6a: mov      rcx, rsi
0000000180d49e6d: call     0x1806f9d30 ; Torappu.Battle.Entity.OnProjectileSelectTargets [66676]
0000000180d49e72: mov      rsi, qword ptr [rsp + 0x40]
0000000180d49e77: mov      rax, rdi
0000000180d49e7a: mov      rdi, qword ptr [rsp + 0x48]
0000000180d49e7f: movaps   xmm6, xmmword ptr [rsp + 0x20]
0000000180d49e84: add      rsp, 0x30
0000000180d49e88: pop      rbx
0000000180d49e89: ret      
0000000180d49e8a: xor      r9d, r9d
0000000180d49e8d: movq     r8, xmm6
0000000180d49e92: mov      rdx, rbx
0000000180d49e95: movaps   xmm6, xmmword ptr [rsp + 0x20]
0000000180d49e9a: add      rsp, 0x30
0000000180d49e9e: pop      rbx
0000000180d49e9f: jmp      0x18338dee0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3597 [6252]
0000000180d49ea4: call     0x18048c0b0
0000000180d49ea9: int3     
0000000180d49eaa: int3     
0000000180d49eab: int3     
0000000180d49eac: int3     
0000000180d49ead: int3     
0000000180d49eae: int3     
0000000180d49eaf: int3     