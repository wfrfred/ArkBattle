; Torappu.Battle.NetCatcherProjectile.OnTick metadata=71254 token=0x6011657 VA=0x1808d46c0 RVA=0x8d46c0 size=0x3a0
00000001808d46c0: mov      qword ptr [rsp + 0x10], rbx
00000001808d46c5: push     rdi
00000001808d46c6: sub      rsp, 0x70
00000001808d46ca: cmp      byte ptr [rip + 0x83bd0f6], 0
00000001808d46d1: mov      rbx, rdx
00000001808d46d4: mov      rdi, rcx
00000001808d46d7: jne      0x1808d4740
00000001808d46d9: lea      rcx, [rip + 0x80a05d0] ; TypeInfo Torappu.Battle.AbilityStandard @0x188974cb0
00000001808d46e0: call     0x18048bf00
00000001808d46e5: lea      rcx, [rip + 0x805a334] ; TypeInfo UnityEngine.DLog @0x18892ea20
00000001808d46ec: call     0x18048bf00
00000001808d46f1: lea      rcx, [rip + 0x7f85ec0] ; GenericMethodInfo 264923 @0x18885a5b8
00000001808d46f8: call     0x18048bf00
00000001808d46fd: lea      rcx, [rip + 0x804d374] ; TypeInfo Torappu.Battle.NetCatcherProjectile @0x188921a78
00000001808d4704: call     0x18048bf00
00000001808d4709: lea      rcx, [rip + 0x8060e98] ; GenericMethodInfo 280377 @0x1889355a8
00000001808d4710: call     0x18048bf00
00000001808d4715: lea      rcx, [rip + 0x80610cc] ; GenericMethodInfo 280378 @0x1889357e8
00000001808d471c: call     0x18048bf00
00000001808d4721: lea      rcx, [rip + 0x805e5c0] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808d4728: call     0x18048bf00
00000001808d472d: lea      rcx, [rip + 0x80115d4] ; StringLiteral 'NetCatcherProjectile need a Ability' @0x1888e5d08
00000001808d4734: call     0x18048bf00
00000001808d4739: mov      byte ptr [rip + 0x83bd087], 1
00000001808d4740: mov      rax, qword ptr [rip + 0x804d331] ; TypeInfo Torappu.Battle.NetCatcherProjectile @0x188921a78
00000001808d4747: mov      rcx, qword ptr [rax + 0xb8]
00000001808d474e: mov      rcx, qword ptr [rcx + 0x68]
00000001808d4752: test     rcx, rcx
00000001808d4755: jne      0x1808d4a38
00000001808d475b: xor      r8d, r8d
00000001808d475e: mov      rdx, rbx
00000001808d4761: mov      rcx, rdi
00000001808d4764: call     0x1808d2e20 ; Torappu.Battle.LinkProjectile.OnTick [71178]
00000001808d4769: cmp      byte ptr [rip + 0x83bd081], 0
00000001808d4770: jne      0x1808d4785
00000001808d4772: lea      rcx, [rip + 0x7f4ec7f] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808d4779: call     0x18048bf00
00000001808d477e: mov      byte ptr [rip + 0x83bd06c], 1
00000001808d4785: mov      rax, qword ptr [rip + 0x7f4ec6c] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808d478c: mov      rcx, qword ptr [rax + 0xb8]
00000001808d4793: mov      rcx, qword ptr [rcx + 0x118]
00000001808d479a: test     rcx, rcx
00000001808d479d: jne      0x1808d47a8
00000001808d479f: movzx    eax, byte ptr [rdi + 0xa6]
00000001808d47a6: jmp      0x1808d47b3
00000001808d47a8: xor      r8d, r8d
00000001808d47ab: mov      rdx, rdi
00000001808d47ae: call     0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
00000001808d47b3: test     al, al
00000001808d47b5: jne      0x1808d4929
00000001808d47bb: xor      edx, edx
00000001808d47bd: mov      qword ptr [rsp + 0x80], rsi
00000001808d47c5: mov      rcx, rdi
00000001808d47c8: call     0x1808dcb90 ; Torappu.Battle.Projectile.get_ability [71298]
00000001808d47cd: mov      rdx, qword ptr [rip + 0x80a04dc] ; TypeInfo Torappu.Battle.AbilityStandard @0x188974cb0
00000001808d47d4: mov      rsi, rax
00000001808d47d7: test     rax, rax
00000001808d47da: jne      0x1808d47e0
00000001808d47dc: xor      ebx, ebx
00000001808d47de: jmp      0x1808d482a
00000001808d47e0: cmp      byte ptr [rip + 0x83f8009], 0
00000001808d47e7: mov      r8, qword ptr [rax]
00000001808d47ea: jbe      0x1808d47fa
00000001808d47ec: mov      rcx, r8
00000001808d47ef: call     0x1804463e0
00000001808d47f4: xor      ebx, ebx
00000001808d47f6: test     al, al
00000001808d47f8: jmp      0x1808d4826
00000001808d47fa: movzx    eax, byte ptr [rdx + 0x130]
00000001808d4801: xor      ebx, ebx
00000001808d4803: cmp      byte ptr [r8 + 0x130], al
00000001808d480a: jb       0x1808d4822
00000001808d480c: movzx    ecx, al
00000001808d480f: mov      rax, qword ptr [r8 + 0xc8]
00000001808d4816: cmp      qword ptr [rax + rcx*8 - 8], rdx
00000001808d481b: mov      eax, 1
00000001808d4820: je       0x1808d4824
00000001808d4822: mov      eax, ebx
00000001808d4824: test     eax, eax
00000001808d4826: cmovne   rbx, rsi
00000001808d482a: mov      rcx, qword ptr [rip + 0x805e4b7] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808d4831: cmp      dword ptr [rcx + 0xe0], 0
00000001808d4838: jne      0x1808d483f
00000001808d483a: call     0x18048c140
00000001808d483f: xor      r8d, r8d
00000001808d4842: xor      edx, edx
00000001808d4844: mov      rcx, rbx
00000001808d4847: call     0x186b638d0
00000001808d484c: test     al, al
00000001808d484e: jne      0x1808d4a10
00000001808d4854: test     rbx, rbx
00000001808d4857: je       0x1808d4a54
00000001808d485d: xor      r8d, r8d
00000001808d4860: lea      rcx, [rsp + 0x58]
00000001808d4865: mov      rdx, rbx
00000001808d4868: cmp      byte ptr [rdi + 0x1e9], r8b
00000001808d486f: je       0x1808d4937
00000001808d4875: call     0x1805d4270 ; Torappu.Battle.AbilityStandard.get_inputTarget [63121]
00000001808d487a: mov      rdx, qword ptr [rip + 0x8060f67] ; GenericMethodInfo 280378 @0x1889357e8
00000001808d4881: lea      rcx, [rsp + 0x30]
00000001808d4886: movups   xmm0, xmmword ptr [rax]
00000001808d4889: movsd    xmm1, qword ptr [rax + 0x10]
00000001808d488e: movups   xmmword ptr [rsp + 0x40], xmm0
00000001808d4893: movups   xmm2, xmmword ptr [rsp + 0x48]
00000001808d4898: unpcklpd xmm2, xmm1
00000001808d489c: movups   xmmword ptr [rsp + 0x30], xmm2
00000001808d48a1: call     0x185159fc0
00000001808d48a6: test     al, al
00000001808d48a8: je       0x1808d48f8
00000001808d48aa: mov      rdx, qword ptr [rip + 0x8060cf7] ; GenericMethodInfo 280377 @0x1889355a8
00000001808d48b1: lea      rcx, [rsp + 0x30]
00000001808d48b6: call     0x185159d80
00000001808d48bb: test     rax, rax
00000001808d48be: je       0x1808d4a54
00000001808d48c4: xor      edx, edx
00000001808d48c6: mov      rcx, rax
00000001808d48c9: call     0x180ad4250 ; Torappu.Battle.VisualObject.get_mapPosition [77866]
00000001808d48ce: mov      qword ptr [rsp + 0x98], rax
00000001808d48d6: movss    xmm0, dword ptr [rsp + 0x98]
00000001808d48df: movss    xmm1, dword ptr [rsp + 0x9c]
00000001808d48e8: movss    dword ptr [rdi + 0x210], xmm0
00000001808d48f0: movss    dword ptr [rdi + 0x214], xmm1
00000001808d48f8: cmp      byte ptr [rdi + 0x218], 0
00000001808d48ff: je       0x1808d4921
00000001808d4901: movss    xmm0, dword ptr [rdi + 0x210]
00000001808d4909: movss    xmm1, dword ptr [rdi + 0x214]
00000001808d4911: movss    dword ptr [rdi + 0x200], xmm0
00000001808d4919: movss    dword ptr [rdi + 0x204], xmm1
00000001808d4921: mov      rsi, qword ptr [rsp + 0x80]
00000001808d4929: mov      rbx, qword ptr [rsp + 0x88]
00000001808d4931: add      rsp, 0x70
00000001808d4935: pop      rdi
00000001808d4936: ret      
00000001808d4937: call     0x1805d4270 ; Torappu.Battle.AbilityStandard.get_inputTarget [63121]
00000001808d493c: mov      rdx, qword ptr [rip + 0x8060c65] ; GenericMethodInfo 280377 @0x1889355a8
00000001808d4943: lea      rcx, [rsp + 0x20]
00000001808d4948: movups   xmm0, xmmword ptr [rax]
00000001808d494b: movsd    xmm1, qword ptr [rax + 0x10]
00000001808d4950: movups   xmmword ptr [rsp + 0x40], xmm0
00000001808d4955: movups   xmm2, xmmword ptr [rsp + 0x48]
00000001808d495a: unpcklpd xmm2, xmm1
00000001808d495e: movups   xmmword ptr [rsp + 0x48], xmm2
00000001808d4963: movups   xmmword ptr [rsp + 0x20], xmm2
00000001808d4968: call     0x185159d80
00000001808d496d: mov      rcx, qword ptr [rip + 0x805e374] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808d4974: mov      rsi, rax
00000001808d4977: cmp      dword ptr [rcx + 0xe0], 0
00000001808d497e: jne      0x1808d4985
00000001808d4980: call     0x18048c140
00000001808d4985: xor      r8d, r8d
00000001808d4988: xor      edx, edx
00000001808d498a: mov      rcx, rsi
00000001808d498d: call     0x186b638d0
00000001808d4992: test     al, al
00000001808d4994: jne      0x1808d4921
00000001808d4996: cmp      byte ptr [rdi + 0x218], al
00000001808d499c: je       0x1808d4921
00000001808d499e: xor      r8d, r8d
00000001808d49a1: lea      rcx, [rsp + 0x58]
00000001808d49a6: mov      rdx, rbx
00000001808d49a9: call     0x1805d4270 ; Torappu.Battle.AbilityStandard.get_inputTarget [63121]
00000001808d49ae: mov      rdx, qword ptr [rip + 0x8060bf3] ; GenericMethodInfo 280377 @0x1889355a8
00000001808d49b5: lea      rcx, [rsp + 0x20]
00000001808d49ba: movups   xmm0, xmmword ptr [rax]
00000001808d49bd: movsd    xmm1, qword ptr [rax + 0x10]
00000001808d49c2: movups   xmmword ptr [rsp + 0x40], xmm0
00000001808d49c7: movups   xmm2, xmmword ptr [rsp + 0x48]
00000001808d49cc: unpcklpd xmm2, xmm1
00000001808d49d0: movups   xmmword ptr [rsp + 0x20], xmm2
00000001808d49d5: call     0x185159d80
00000001808d49da: test     rax, rax
00000001808d49dd: je       0x1808d4a54
00000001808d49df: xor      edx, edx
00000001808d49e1: mov      rcx, rax
00000001808d49e4: call     0x180ad4250 ; Torappu.Battle.VisualObject.get_mapPosition [77866]
00000001808d49e9: mov      qword ptr [rsp + 0x98], rax
00000001808d49f1: movss    xmm0, dword ptr [rsp + 0x98]
00000001808d49fa: movss    xmm1, dword ptr [rsp + 0x9c]
00000001808d4a03: movss    dword ptr [rdi + 0x200], xmm0
00000001808d4a0b: jmp      0x1808d4919
00000001808d4a10: mov      rcx, qword ptr [rip + 0x805a009] ; TypeInfo UnityEngine.DLog @0x18892ea20
00000001808d4a17: cmp      dword ptr [rcx + 0xe0], 0
00000001808d4a1e: jne      0x1808d4a25
00000001808d4a20: call     0x18048c140
00000001808d4a25: mov      rcx, qword ptr [rip + 0x80112dc] ; StringLiteral 'NetCatcherProjectile need a Ability' @0x1888e5d08
00000001808d4a2c: xor      edx, edx
00000001808d4a2e: call     0x1866dd600
00000001808d4a33: jmp      0x1808d4921
00000001808d4a38: xor      r9d, r9d
00000001808d4a3b: mov      r8, rbx
00000001808d4a3e: mov      rdx, rdi
00000001808d4a41: call     0x1833f9830 ; XLua.DelegateBridge.__Gen_Delegate_Imp427 [3082]
00000001808d4a46: mov      rbx, qword ptr [rsp + 0x88]
00000001808d4a4e: add      rsp, 0x70
00000001808d4a52: pop      rdi
00000001808d4a53: ret      
00000001808d4a54: call     0x18048c0b0
00000001808d4a59: int3     
00000001808d4a5a: int3     
00000001808d4a5b: int3     
00000001808d4a5c: int3     
00000001808d4a5d: int3     
00000001808d4a5e: int3     
00000001808d4a5f: int3     