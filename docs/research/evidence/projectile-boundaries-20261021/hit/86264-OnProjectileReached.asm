; Torappu.Battle.Projectiles.HitBehaviour.OnProjectileReached metadata=86264 token=0x60150f9 VA=0x180d34fc0 RVA=0xd34fc0 size=0x450
0000000180d34fc0: mov      qword ptr [rsp + 0x10], rbx
0000000180d34fc5: mov      qword ptr [rsp + 8], rcx
0000000180d34fca: push     rsi
0000000180d34fcb: push     rdi
0000000180d34fcc: push     r14
0000000180d34fce: sub      rsp, 0xf0
0000000180d34fd5: mov      rbx, rcx
0000000180d34fd8: cmp      byte ptr [rip + 0x7f5f591], 0
0000000180d34fdf: jne      0x180d35054
0000000180d34fe1: lea      rcx, [rip + 0x7c235b0] ; TypeInfo Torappu.Battle.Box2dPhysicsUtil @0x188958598
0000000180d34fe8: call     0x18048bf00
0000000180d34fed: lea      rcx, [rip + 0x7bd1f64] ; GenericMethodInfo 290618 @0x188906f58
0000000180d34ff4: call     0x18048bf00
0000000180d34ff9: lea      rcx, [rip + 0x7bd4240] ; TypeInfo Torappu.Battle.Projectiles.HitBehaviour @0x188909240
0000000180d35000: call     0x18048bf00
0000000180d35005: lea      rcx, [rip + 0x7c1fc8c] ; TypeInfo System.IDisposable @0x188954c98
0000000180d3500c: call     0x18048bf00
0000000180d35011: lea      rcx, [rip + 0x7c01fc0] ; GenericMethodInfo 271513 @0x188936fd8
0000000180d35018: call     0x18048bf00
0000000180d3501d: lea      rcx, [rip + 0x7c021f4] ; GenericMethodInfo 271514 @0x188937218
0000000180d35024: call     0x18048bf00
0000000180d35029: lea      rcx, [rip + 0x7c03868] ; GenericMethodInfo 271524 @0x188938898
0000000180d35030: call     0x18048bf00
0000000180d35035: lea      rcx, [rip + 0x7c03a9c] ; GenericMethodInfo 271525 @0x188938ad8
0000000180d3503c: call     0x18048bf00
0000000180d35041: lea      rcx, [rip + 0x7bfdca0] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180d35048: call     0x18048bf00
0000000180d3504d: mov      byte ptr [rip + 0x7f5f51c], 1
0000000180d35054: mov      rax, qword ptr [rip + 0x7bd41e5] ; TypeInfo Torappu.Battle.Projectiles.HitBehaviour @0x188909240
0000000180d3505b: cmp      dword ptr [rax + 0xe0], 0
0000000180d35062: jne      0x180d35073
0000000180d35064: mov      rcx, rax
0000000180d35067: call     0x18048c140
0000000180d3506c: mov      rax, qword ptr [rip + 0x7bd41cd] ; TypeInfo Torappu.Battle.Projectiles.HitBehaviour @0x188909240
0000000180d35073: mov      rax, qword ptr [rax + 0xb8]
0000000180d3507a: mov      rcx, qword ptr [rax + 0x18]
0000000180d3507e: test     rcx, rcx
0000000180d35081: jne      0x180d353dd
0000000180d35087: xor      edx, edx
0000000180d35089: mov      rcx, rbx
0000000180d3508c: call     0x1808cca30 ; Torappu.Battle.CacheAtkToBBBehaviour.<>xLuaBaseProxy_OnProjectileReached [71086] | Torappu.Battle.BasicMovement.<>xLuaBaseProxy_OnProjectileReached [71240] | Torappu.Battle.Projectile.Behaviour.OnProjectileReached [71416]
0000000180d35091: cmp      byte ptr [rbx + 0x89], 0
0000000180d35098: je       0x180d353e8
0000000180d3509e: mov      rax, qword ptr [rip + 0x7bd419b] ; TypeInfo Torappu.Battle.Projectiles.HitBehaviour @0x188909240
0000000180d350a5: cmp      dword ptr [rax + 0xe0], 0
0000000180d350ac: jne      0x180d350bd
0000000180d350ae: mov      rcx, rax
0000000180d350b1: call     0x18048c140
0000000180d350b6: mov      rax, qword ptr [rip + 0x7bd4183] ; TypeInfo Torappu.Battle.Projectiles.HitBehaviour @0x188909240
0000000180d350bd: mov      rax, qword ptr [rax + 0xb8]
0000000180d350c4: mov      rcx, qword ptr [rax]
0000000180d350c7: test     rcx, rcx
0000000180d350ca: je       0x180d35408
0000000180d350d0: inc      dword ptr [rcx + 0x1c]
0000000180d350d3: mov      r8d, dword ptr [rcx + 0x18]
0000000180d350d7: xor      edi, edi
0000000180d350d9: mov      dword ptr [rcx + 0x18], edi
0000000180d350dc: test     r8d, r8d
0000000180d350df: jle      0x180d350ef
0000000180d350e1: xor      r9d, r9d
0000000180d350e4: xor      edx, edx
0000000180d350e6: mov      rcx, qword ptr [rcx + 0x10]
0000000180d350ea: call     0x185ee99a0
0000000180d350ef: mov      rdx, qword ptr [rip + 0x7bd1e62] ; GenericMethodInfo 290618 @0x188906f58
0000000180d350f6: mov      rcx, rbx
0000000180d350f9: call     0x1844b9d60
0000000180d350fe: mov      rsi, rax
0000000180d35101: movups   xmm0, xmmword ptr [rbx + 0x28]
0000000180d35105: movups   xmmword ptr [rsp + 0x20], xmm0
0000000180d3510a: movups   xmm1, xmmword ptr [rbx + 0x38]
0000000180d3510e: movups   xmmword ptr [rsp + 0x38], xmm1
0000000180d35113: movups   xmm2, xmmword ptr [rbx + 0x48]
0000000180d35117: movups   xmmword ptr [rsp + 0x48], xmm2
0000000180d3511c: movups   xmm3, xmmword ptr [rbx + 0x58]
0000000180d35120: movups   xmmword ptr [rsp + 0x58], xmm3
0000000180d35125: movups   xmm4, xmmword ptr [rbx + 0x68]
0000000180d35129: movups   xmmword ptr [rsp + 0x68], xmm4
0000000180d3512e: movups   xmm5, xmmword ptr [rbx + 0x78]
0000000180d35132: movups   xmmword ptr [rsp + 0x78], xmm5
0000000180d35137: mov      rcx, qword ptr [rip + 0x7c2345a] ; TypeInfo Torappu.Battle.Box2dPhysicsUtil @0x188958598
0000000180d3513e: cmp      dword ptr [rcx + 0xe0], edi
0000000180d35144: jne      0x180d35169
0000000180d35146: call     0x18048c140
0000000180d3514b: movups   xmm0, xmmword ptr [rsp + 0x20]
0000000180d35150: movups   xmm1, xmmword ptr [rsp + 0x38]
0000000180d35155: movups   xmm2, xmmword ptr [rsp + 0x48]
0000000180d3515a: movups   xmm3, xmmword ptr [rsp + 0x58]
0000000180d3515f: movups   xmm4, xmmword ptr [rsp + 0x68]
0000000180d35164: movups   xmm5, xmmword ptr [rsp + 0x78]
0000000180d35169: movaps   xmmword ptr [rsp + 0x90], xmm0
0000000180d35171: movaps   xmmword ptr [rsp + 0xa0], xmm1
0000000180d35179: movaps   xmmword ptr [rsp + 0xb0], xmm2
0000000180d35181: movaps   xmmword ptr [rsp + 0xc0], xmm3
0000000180d35189: movaps   xmmword ptr [rsp + 0xd0], xmm4
0000000180d35191: movaps   xmmword ptr [rsp + 0xe0], xmm5
0000000180d35199: xor      r9d, r9d
0000000180d3519c: xor      r8d, r8d
0000000180d3519f: lea      rdx, [rsp + 0x90]
0000000180d351a7: mov      rcx, rsi
0000000180d351aa: call     0x1809a5850 ; Torappu.Battle.Box2dPhysicsUtil.FindTargets_DISPOSE [73944]
0000000180d351af: mov      qword ptr [rsp + 0x120], rax
0000000180d351b7: mov      qword ptr [rsp + 0x20], rdi
0000000180d351bc: lea      rax, [rsp + 0x120]
0000000180d351c4: mov      qword ptr [rsp + 0x28], rax
0000000180d351c9: mov      rax, qword ptr [rip + 0x7bd4070] ; TypeInfo Torappu.Battle.Projectiles.HitBehaviour @0x188909240
0000000180d351d0: cmp      dword ptr [rax + 0xe0], 0
0000000180d351d7: jne      0x180d351e8
0000000180d351d9: mov      rcx, rax
0000000180d351dc: call     0x18048c140
0000000180d351e1: mov      rax, qword ptr [rip + 0x7bd4058] ; TypeInfo Torappu.Battle.Projectiles.HitBehaviour @0x188909240
0000000180d351e8: mov      rax, qword ptr [rax + 0xb8]
0000000180d351ef: mov      rcx, qword ptr [rax]
0000000180d351f2: test     rcx, rcx
0000000180d351f5: je       0x180d353fc
0000000180d351fb: mov      r8, qword ptr [rip + 0x7c01dd6] ; GenericMethodInfo 271513 @0x188936fd8
0000000180d35202: mov      rdx, qword ptr [rsp + 0x120]
0000000180d3520a: call     0x184d094e0
0000000180d3520f: nop      
0000000180d35210: mov      r8, qword ptr [rsp + 0x120]
0000000180d35218: test     r8, r8
0000000180d3521b: je       0x180d3522b
0000000180d3521d: xor      ecx, ecx
0000000180d3521f: mov      rdx, qword ptr [rip + 0x7c1fa72] ; TypeInfo System.IDisposable @0x188954c98
0000000180d35226: call     0x180005310
0000000180d3522b: jmp      0x180d35260
0000000180d3522d: mov      r8, qword ptr [rsp + 0x120]
0000000180d35235: test     r8, r8
0000000180d35238: je       0x180d35248
0000000180d3523a: xor      ecx, ecx
0000000180d3523c: mov      rdx, qword ptr [rip + 0x7c1fa55] ; TypeInfo System.IDisposable @0x188954c98
0000000180d35243: call     0x180005310
0000000180d35248: mov      rcx, qword ptr [rsp + 0x20]
0000000180d3524d: test     rcx, rcx
0000000180d35250: jne      0x180d35402
0000000180d35256: xor      edi, edi
0000000180d35258: mov      rbx, qword ptr [rsp + 0x110]
0000000180d35260: xor      edx, edx
0000000180d35262: mov      rcx, rbx
0000000180d35265: call     0x1808cf160 ; Torappu.Battle.Projectile.Behaviour.get_source [71404]
0000000180d3526a: mov      rsi, rax
0000000180d3526d: mov      rcx, qword ptr [rip + 0x7bfda74] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180d35274: cmp      dword ptr [rcx + 0xe0], 0
0000000180d3527b: jne      0x180d35282
0000000180d3527d: call     0x18048c140
0000000180d35282: xor      r8d, r8d
0000000180d35285: xor      edx, edx
0000000180d35287: mov      rcx, rsi
0000000180d3528a: call     0x186b63a70
0000000180d3528f: test     al, al
0000000180d35291: mov      rax, qword ptr [rip + 0x7bd3fa8] ; TypeInfo Torappu.Battle.Projectiles.HitBehaviour @0x188909240
0000000180d35298: je       0x180d35340
0000000180d3529e: cmp      dword ptr [rax + 0xe0], 0
0000000180d352a5: jne      0x180d352b6
0000000180d352a7: mov      rcx, rax
0000000180d352aa: call     0x18048c140
0000000180d352af: mov      rax, qword ptr [rip + 0x7bd3f8a] ; TypeInfo Torappu.Battle.Projectiles.HitBehaviour @0x188909240
0000000180d352b6: mov      rcx, qword ptr [rax + 0xb8]
0000000180d352bd: mov      rdx, qword ptr [rcx]
0000000180d352c0: test     rdx, rdx
0000000180d352c3: je       0x180d35408
0000000180d352c9: cmp      dword ptr [rdx + 0x18], 0
0000000180d352cd: jle      0x180d35340
0000000180d352cf: xor      edx, edx
0000000180d352d1: mov      rcx, rbx
0000000180d352d4: call     0x1808cf160 ; Torappu.Battle.Projectile.Behaviour.get_source [71404]
0000000180d352d9: mov      rsi, rax
0000000180d352dc: xor      edx, edx
0000000180d352de: mov      rcx, rbx
0000000180d352e1: call     0x1808cf100 ; Torappu.Battle.Projectile.Behaviour.get_projectile [71401]
0000000180d352e6: mov      r14, rax
0000000180d352e9: mov      rcx, qword ptr [rip + 0x7bd3f50] ; TypeInfo Torappu.Battle.Projectiles.HitBehaviour @0x188909240
0000000180d352f0: cmp      dword ptr [rcx + 0xe0], 0
0000000180d352f7: jne      0x180d35305
0000000180d352f9: call     0x18048c140
0000000180d352fe: mov      rcx, qword ptr [rip + 0x7bd3f3b] ; TypeInfo Torappu.Battle.Projectiles.HitBehaviour @0x188909240
0000000180d35305: mov      rcx, qword ptr [rcx + 0xb8]
0000000180d3530c: mov      r8, qword ptr [rcx]
0000000180d3530f: test     r8, r8
0000000180d35312: je       0x180d35408
0000000180d35318: test     rsi, rsi
0000000180d3531b: je       0x180d35408
0000000180d35321: xor      r9d, r9d
0000000180d35324: mov      r8d, dword ptr [r8 + 0x18]
0000000180d35328: mov      rdx, r14
0000000180d3532b: mov      rcx, rsi
0000000180d3532e: call     0x1806f9d30 ; Torappu.Battle.Entity.OnProjectileSelectTargets [66676]
0000000180d35333: mov      rax, qword ptr [rip + 0x7bd3f06] ; TypeInfo Torappu.Battle.Projectiles.HitBehaviour @0x188909240
0000000180d3533a: nop      word ptr [rax + rax]
0000000180d35340: cmp      dword ptr [rax + 0xe0], 0
0000000180d35347: jne      0x180d35358
0000000180d35349: mov      rcx, rax
0000000180d3534c: call     0x18048c140
0000000180d35351: mov      rax, qword ptr [rip + 0x7bd3ee8] ; TypeInfo Torappu.Battle.Projectiles.HitBehaviour @0x188909240
0000000180d35358: mov      rcx, qword ptr [rax + 0xb8]
0000000180d3535f: mov      rdx, qword ptr [rcx]
0000000180d35362: test     rdx, rdx
0000000180d35365: je       0x180d35408
0000000180d3536b: cmp      edi, dword ptr [rdx + 0x18]
0000000180d3536e: jge      0x180d353e8
0000000180d35370: cmp      dword ptr [rax + 0xe0], 0
0000000180d35377: jne      0x180d35388
0000000180d35379: mov      rcx, rax
0000000180d3537c: call     0x18048c140
0000000180d35381: mov      rax, qword ptr [rip + 0x7bd3eb8] ; TypeInfo Torappu.Battle.Projectiles.HitBehaviour @0x188909240
0000000180d35388: mov      rcx, qword ptr [rax + 0xb8]
0000000180d3538f: mov      rcx, qword ptr [rcx]
0000000180d35392: test     rcx, rcx
0000000180d35395: je       0x180d35408
0000000180d35397: mov      r8, qword ptr [rip + 0x7c0373a] ; GenericMethodInfo 271525 @0x188938ad8
0000000180d3539e: mov      edx, edi
0000000180d353a0: call     0x184afcf00
0000000180d353a5: mov      rsi, rax
0000000180d353a8: cmp      byte ptr [rip + 0x7f97441], 0
0000000180d353af: jbe      0x180d353b9
0000000180d353b1: mov      rcx, qword ptr [rbx]
0000000180d353b4: call     0x180446d00
0000000180d353b9: mov      r9, qword ptr [rbx]
0000000180d353bc: mov      r10, qword ptr [r9 + 0x230]
0000000180d353c3: mov      r9, qword ptr [r9 + 0x238]
0000000180d353ca: xor      r8d, r8d
0000000180d353cd: mov      rdx, rsi
0000000180d353d0: mov      rcx, rbx
0000000180d353d3: call     r10
0000000180d353d6: inc      edi
0000000180d353d8: jmp      0x180d35333
0000000180d353dd: xor      r8d, r8d
0000000180d353e0: mov      rdx, rbx
0000000180d353e3: call     0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
0000000180d353e8: mov      rbx, qword ptr [rsp + 0x118]
0000000180d353f0: add      rsp, 0xf0
0000000180d353f7: pop      r14
0000000180d353f9: pop      rdi
0000000180d353fa: pop      rsi
0000000180d353fb: ret      
0000000180d353fc: call     0x18048c0b0
0000000180d35401: nop      
0000000180d35402: call     0x180472d50
0000000180d35407: int3     
0000000180d35408: call     0x18048c0b0
0000000180d3540d: int3     
0000000180d3540e: int3     
0000000180d3540f: int3     