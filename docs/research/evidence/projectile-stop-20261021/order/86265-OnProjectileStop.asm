; Torappu.Battle.Projectiles.HitBehaviour.OnProjectileStop metadata=86265 token=0x60150fa VA=0x180d35410 RVA=0xd35410 size=0x490
0000000180d35410: mov      qword ptr [rsp + 0x10], rbx
0000000180d35415: mov      qword ptr [rsp + 8], rcx
0000000180d3541a: push     rsi
0000000180d3541b: push     rdi
0000000180d3541c: push     r14
0000000180d3541e: sub      rsp, 0xf0
0000000180d35425: mov      rbx, rcx
0000000180d35428: cmp      byte ptr [rip + 0x7f5f142], 0
0000000180d3542f: jne      0x180d354a4
0000000180d35431: lea      rcx, [rip + 0x7c23160] ; TypeInfo Torappu.Battle.Box2dPhysicsUtil @0x188958598
0000000180d35438: call     0x18048bf00
0000000180d3543d: lea      rcx, [rip + 0x7bd1b14] ; GenericMethodInfo 290618 @0x188906f58
0000000180d35444: call     0x18048bf00
0000000180d35449: lea      rcx, [rip + 0x7bd3df0] ; TypeInfo Torappu.Battle.Projectiles.HitBehaviour @0x188909240
0000000180d35450: call     0x18048bf00
0000000180d35455: lea      rcx, [rip + 0x7c1f83c] ; TypeInfo System.IDisposable @0x188954c98
0000000180d3545c: call     0x18048bf00
0000000180d35461: lea      rcx, [rip + 0x7c01b70] ; GenericMethodInfo 271513 @0x188936fd8
0000000180d35468: call     0x18048bf00
0000000180d3546d: lea      rcx, [rip + 0x7c01da4] ; GenericMethodInfo 271514 @0x188937218
0000000180d35474: call     0x18048bf00
0000000180d35479: lea      rcx, [rip + 0x7c03418] ; GenericMethodInfo 271524 @0x188938898
0000000180d35480: call     0x18048bf00
0000000180d35485: lea      rcx, [rip + 0x7c0364c] ; GenericMethodInfo 271525 @0x188938ad8
0000000180d3548c: call     0x18048bf00
0000000180d35491: lea      rcx, [rip + 0x7bfd850] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180d35498: call     0x18048bf00
0000000180d3549d: mov      byte ptr [rip + 0x7f5f0cd], 1
0000000180d354a4: mov      rax, qword ptr [rip + 0x7bd3d95] ; TypeInfo Torappu.Battle.Projectiles.HitBehaviour @0x188909240
0000000180d354ab: cmp      dword ptr [rax + 0xe0], 0
0000000180d354b2: jne      0x180d354c3
0000000180d354b4: mov      rcx, rax
0000000180d354b7: call     0x18048c140
0000000180d354bc: mov      rax, qword ptr [rip + 0x7bd3d7d] ; TypeInfo Torappu.Battle.Projectiles.HitBehaviour @0x188909240
0000000180d354c3: mov      rax, qword ptr [rax + 0xb8]
0000000180d354ca: mov      rcx, qword ptr [rax + 0x20]
0000000180d354ce: test     rcx, rcx
0000000180d354d1: jne      0x180d35865
0000000180d354d7: xor      edx, edx
0000000180d354d9: mov      rcx, rbx
0000000180d354dc: call     0x1808cca90 ; Torappu.Battle.CacheAtkToBBBehaviour.<>xLuaBaseProxy_OnProjectileStop [71087] | Torappu.Battle.ProjectileTileMarkBehaviour.<>xLuaBaseProxy_OnProjectileStop [71093] | Torappu.Battle.BasicMovement.<>xLuaBaseProxy_OnProjectileStop [71239] | Torappu.Battle.Projectile.Behaviour.OnProjectileStop [71414]
0000000180d354e1: xor      edx, edx
0000000180d354e3: mov      rcx, rbx
0000000180d354e6: call     0x1808cf100 ; Torappu.Battle.Projectile.Behaviour.get_projectile [71401]
0000000180d354eb: test     rax, rax
0000000180d354ee: je       0x180d35890
0000000180d354f4: xor      edx, edx
0000000180d354f6: mov      rcx, rax
0000000180d354f9: call     0x1808dd1c0 ; Torappu.Battle.Projectile.get_isEliminated [71307]
0000000180d354fe: test     al, al
0000000180d35500: jne      0x180d35851
0000000180d35506: cmp      byte ptr [rbx + 0x8a], al
0000000180d3550c: je       0x180d35851
0000000180d35512: mov      rax, qword ptr [rip + 0x7bd3d27] ; TypeInfo Torappu.Battle.Projectiles.HitBehaviour @0x188909240
0000000180d35519: cmp      dword ptr [rax + 0xe0], 0
0000000180d35520: jne      0x180d35531
0000000180d35522: mov      rcx, rax
0000000180d35525: call     0x18048c140
0000000180d3552a: mov      rax, qword ptr [rip + 0x7bd3d0f] ; TypeInfo Torappu.Battle.Projectiles.HitBehaviour @0x188909240
0000000180d35531: mov      rax, qword ptr [rax + 0xb8]
0000000180d35538: mov      rcx, qword ptr [rax]
0000000180d3553b: test     rcx, rcx
0000000180d3553e: je       0x180d35890
0000000180d35544: inc      dword ptr [rcx + 0x1c]
0000000180d35547: mov      r8d, dword ptr [rcx + 0x18]
0000000180d3554b: xor      edi, edi
0000000180d3554d: mov      dword ptr [rcx + 0x18], edi
0000000180d35550: test     r8d, r8d
0000000180d35553: jle      0x180d35563
0000000180d35555: xor      r9d, r9d
0000000180d35558: xor      edx, edx
0000000180d3555a: mov      rcx, qword ptr [rcx + 0x10]
0000000180d3555e: call     0x185ee99a0
0000000180d35563: mov      rdx, qword ptr [rip + 0x7bd19ee] ; GenericMethodInfo 290618 @0x188906f58
0000000180d3556a: mov      rcx, rbx
0000000180d3556d: call     0x1844b9d60
0000000180d35572: mov      rsi, rax
0000000180d35575: movups   xmm0, xmmword ptr [rbx + 0x28]
0000000180d35579: movups   xmmword ptr [rsp + 0x20], xmm0
0000000180d3557e: movups   xmm1, xmmword ptr [rbx + 0x38]
0000000180d35582: movups   xmmword ptr [rsp + 0x38], xmm1
0000000180d35587: movups   xmm2, xmmword ptr [rbx + 0x48]
0000000180d3558b: movups   xmmword ptr [rsp + 0x48], xmm2
0000000180d35590: movups   xmm3, xmmword ptr [rbx + 0x58]
0000000180d35594: movups   xmmword ptr [rsp + 0x58], xmm3
0000000180d35599: movups   xmm4, xmmword ptr [rbx + 0x68]
0000000180d3559d: movups   xmmword ptr [rsp + 0x68], xmm4
0000000180d355a2: movups   xmm5, xmmword ptr [rbx + 0x78]
0000000180d355a6: movups   xmmword ptr [rsp + 0x78], xmm5
0000000180d355ab: mov      rcx, qword ptr [rip + 0x7c22fe6] ; TypeInfo Torappu.Battle.Box2dPhysicsUtil @0x188958598
0000000180d355b2: cmp      dword ptr [rcx + 0xe0], edi
0000000180d355b8: jne      0x180d355dd
0000000180d355ba: call     0x18048c140
0000000180d355bf: movups   xmm0, xmmword ptr [rsp + 0x20]
0000000180d355c4: movups   xmm1, xmmword ptr [rsp + 0x38]
0000000180d355c9: movups   xmm2, xmmword ptr [rsp + 0x48]
0000000180d355ce: movups   xmm3, xmmword ptr [rsp + 0x58]
0000000180d355d3: movups   xmm4, xmmword ptr [rsp + 0x68]
0000000180d355d8: movups   xmm5, xmmword ptr [rsp + 0x78]
0000000180d355dd: movaps   xmmword ptr [rsp + 0x90], xmm0
0000000180d355e5: movaps   xmmword ptr [rsp + 0xa0], xmm1
0000000180d355ed: movaps   xmmword ptr [rsp + 0xb0], xmm2
0000000180d355f5: movaps   xmmword ptr [rsp + 0xc0], xmm3
0000000180d355fd: movaps   xmmword ptr [rsp + 0xd0], xmm4
0000000180d35605: movaps   xmmword ptr [rsp + 0xe0], xmm5
0000000180d3560d: xor      r9d, r9d
0000000180d35610: xor      r8d, r8d
0000000180d35613: lea      rdx, [rsp + 0x90]
0000000180d3561b: mov      rcx, rsi
0000000180d3561e: call     0x1809a5850 ; Torappu.Battle.Box2dPhysicsUtil.FindTargets_DISPOSE [73944]
0000000180d35623: mov      qword ptr [rsp + 0x120], rax
0000000180d3562b: mov      qword ptr [rsp + 0x20], rdi
0000000180d35630: lea      rax, [rsp + 0x120]
0000000180d35638: mov      qword ptr [rsp + 0x28], rax
0000000180d3563d: mov      rax, qword ptr [rip + 0x7bd3bfc] ; TypeInfo Torappu.Battle.Projectiles.HitBehaviour @0x188909240
0000000180d35644: cmp      dword ptr [rax + 0xe0], 0
0000000180d3564b: jne      0x180d3565c
0000000180d3564d: mov      rcx, rax
0000000180d35650: call     0x18048c140
0000000180d35655: mov      rax, qword ptr [rip + 0x7bd3be4] ; TypeInfo Torappu.Battle.Projectiles.HitBehaviour @0x188909240
0000000180d3565c: mov      rax, qword ptr [rax + 0xb8]
0000000180d35663: mov      rcx, qword ptr [rax]
0000000180d35666: test     rcx, rcx
0000000180d35669: je       0x180d35884
0000000180d3566f: mov      r8, qword ptr [rip + 0x7c01962] ; GenericMethodInfo 271513 @0x188936fd8
0000000180d35676: mov      rdx, qword ptr [rsp + 0x120]
0000000180d3567e: call     0x184d094e0
0000000180d35683: nop      
0000000180d35684: mov      r8, qword ptr [rsp + 0x120]
0000000180d3568c: test     r8, r8
0000000180d3568f: je       0x180d3569f
0000000180d35691: xor      ecx, ecx
0000000180d35693: mov      rdx, qword ptr [rip + 0x7c1f5fe] ; TypeInfo System.IDisposable @0x188954c98
0000000180d3569a: call     0x180005310
0000000180d3569f: jmp      0x180d356d4
0000000180d356a1: mov      r8, qword ptr [rsp + 0x120]
0000000180d356a9: test     r8, r8
0000000180d356ac: je       0x180d356bc
0000000180d356ae: xor      ecx, ecx
0000000180d356b0: mov      rdx, qword ptr [rip + 0x7c1f5e1] ; TypeInfo System.IDisposable @0x188954c98
0000000180d356b7: call     0x180005310
0000000180d356bc: mov      rcx, qword ptr [rsp + 0x20]
0000000180d356c1: test     rcx, rcx
0000000180d356c4: jne      0x180d3588a
0000000180d356ca: xor      edi, edi
0000000180d356cc: mov      rbx, qword ptr [rsp + 0x110]
0000000180d356d4: xor      edx, edx
0000000180d356d6: mov      rcx, rbx
0000000180d356d9: call     0x1808cf160 ; Torappu.Battle.Projectile.Behaviour.get_source [71404]
0000000180d356de: mov      rsi, rax
0000000180d356e1: mov      rcx, qword ptr [rip + 0x7bfd600] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180d356e8: cmp      dword ptr [rcx + 0xe0], 0
0000000180d356ef: jne      0x180d356f6
0000000180d356f1: call     0x18048c140
0000000180d356f6: xor      r8d, r8d
0000000180d356f9: xor      edx, edx
0000000180d356fb: mov      rcx, rsi
0000000180d356fe: call     0x186b63a70
0000000180d35703: test     al, al
0000000180d35705: mov      rax, qword ptr [rip + 0x7bd3b34] ; TypeInfo Torappu.Battle.Projectiles.HitBehaviour @0x188909240
0000000180d3570c: je       0x180d357b0
0000000180d35712: cmp      dword ptr [rax + 0xe0], 0
0000000180d35719: jne      0x180d3572a
0000000180d3571b: mov      rcx, rax
0000000180d3571e: call     0x18048c140
0000000180d35723: mov      rax, qword ptr [rip + 0x7bd3b16] ; TypeInfo Torappu.Battle.Projectiles.HitBehaviour @0x188909240
0000000180d3572a: mov      rcx, qword ptr [rax + 0xb8]
0000000180d35731: mov      rdx, qword ptr [rcx]
0000000180d35734: test     rdx, rdx
0000000180d35737: je       0x180d35890
0000000180d3573d: cmp      dword ptr [rdx + 0x18], 0
0000000180d35741: jle      0x180d357b0
0000000180d35743: xor      edx, edx
0000000180d35745: mov      rcx, rbx
0000000180d35748: call     0x1808cf160 ; Torappu.Battle.Projectile.Behaviour.get_source [71404]
0000000180d3574d: mov      rsi, rax
0000000180d35750: xor      edx, edx
0000000180d35752: mov      rcx, rbx
0000000180d35755: call     0x1808cf100 ; Torappu.Battle.Projectile.Behaviour.get_projectile [71401]
0000000180d3575a: mov      r14, rax
0000000180d3575d: mov      rcx, qword ptr [rip + 0x7bd3adc] ; TypeInfo Torappu.Battle.Projectiles.HitBehaviour @0x188909240
0000000180d35764: cmp      dword ptr [rcx + 0xe0], 0
0000000180d3576b: jne      0x180d35779
0000000180d3576d: call     0x18048c140
0000000180d35772: mov      rcx, qword ptr [rip + 0x7bd3ac7] ; TypeInfo Torappu.Battle.Projectiles.HitBehaviour @0x188909240
0000000180d35779: mov      rcx, qword ptr [rcx + 0xb8]
0000000180d35780: mov      r8, qword ptr [rcx]
0000000180d35783: test     r8, r8
0000000180d35786: je       0x180d35890
0000000180d3578c: test     rsi, rsi
0000000180d3578f: je       0x180d35890
0000000180d35795: xor      r9d, r9d
0000000180d35798: mov      r8d, dword ptr [r8 + 0x18]
0000000180d3579c: mov      rdx, r14
0000000180d3579f: mov      rcx, rsi
0000000180d357a2: call     0x1806f9d30 ; Torappu.Battle.Entity.OnProjectileSelectTargets [66676]
0000000180d357a7: mov      rax, qword ptr [rip + 0x7bd3a92] ; TypeInfo Torappu.Battle.Projectiles.HitBehaviour @0x188909240
0000000180d357ae: nop      
0000000180d357b0: cmp      dword ptr [rax + 0xe0], 0
0000000180d357b7: jne      0x180d357c8
0000000180d357b9: mov      rcx, rax
0000000180d357bc: call     0x18048c140
0000000180d357c1: mov      rax, qword ptr [rip + 0x7bd3a78] ; TypeInfo Torappu.Battle.Projectiles.HitBehaviour @0x188909240
0000000180d357c8: mov      rcx, qword ptr [rax + 0xb8]
0000000180d357cf: mov      rdx, qword ptr [rcx]
0000000180d357d2: test     rdx, rdx
0000000180d357d5: je       0x180d35890
0000000180d357db: cmp      edi, dword ptr [rdx + 0x18]
0000000180d357de: jge      0x180d35851
0000000180d357e0: cmp      dword ptr [rax + 0xe0], 0
0000000180d357e7: jne      0x180d357f8
0000000180d357e9: mov      rcx, rax
0000000180d357ec: call     0x18048c140
0000000180d357f1: mov      rax, qword ptr [rip + 0x7bd3a48] ; TypeInfo Torappu.Battle.Projectiles.HitBehaviour @0x188909240
0000000180d357f8: mov      rcx, qword ptr [rax + 0xb8]
0000000180d357ff: mov      rcx, qword ptr [rcx]
0000000180d35802: test     rcx, rcx
0000000180d35805: je       0x180d35890
0000000180d3580b: mov      r8, qword ptr [rip + 0x7c032c6] ; GenericMethodInfo 271525 @0x188938ad8
0000000180d35812: mov      edx, edi
0000000180d35814: call     0x184afcf00
0000000180d35819: mov      rsi, rax
0000000180d3581c: cmp      byte ptr [rip + 0x7f96fcd], 0
0000000180d35823: jbe      0x180d3582d
0000000180d35825: mov      rcx, qword ptr [rbx]
0000000180d35828: call     0x180446d00
0000000180d3582d: mov      r9, qword ptr [rbx]
0000000180d35830: mov      r10, qword ptr [r9 + 0x230]
0000000180d35837: mov      r9, qword ptr [r9 + 0x238]
0000000180d3583e: xor      r8d, r8d
0000000180d35841: mov      rdx, rsi
0000000180d35844: mov      rcx, rbx
0000000180d35847: call     r10
0000000180d3584a: inc      edi
0000000180d3584c: jmp      0x180d357a7
0000000180d35851: cmp      byte ptr [rbx + 0x9c], 0
0000000180d35858: je       0x180d35870
0000000180d3585a: mov      eax, dword ptr [rbx + 0xa4]
0000000180d35860: mov      dword ptr [rbx + 0x2c], eax
0000000180d35863: jmp      0x180d35870
0000000180d35865: xor      r8d, r8d
0000000180d35868: mov      rdx, rbx
0000000180d3586b: call     0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
0000000180d35870: mov      rbx, qword ptr [rsp + 0x118]
0000000180d35878: add      rsp, 0xf0
0000000180d3587f: pop      r14
0000000180d35881: pop      rdi
0000000180d35882: pop      rsi
0000000180d35883: ret      
0000000180d35884: call     0x18048c0b0
0000000180d35889: nop      
0000000180d3588a: call     0x180472d50
0000000180d3588f: int3     
0000000180d35890: call     0x18048c0b0
0000000180d35895: int3     
0000000180d35896: int3     
0000000180d35897: int3     
0000000180d35898: int3     
0000000180d35899: int3     
0000000180d3589a: int3     
0000000180d3589b: int3     
0000000180d3589c: int3     
0000000180d3589d: int3     
0000000180d3589e: int3     
0000000180d3589f: int3     