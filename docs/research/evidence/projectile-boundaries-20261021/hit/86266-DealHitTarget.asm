; Torappu.Battle.Projectiles.HitBehaviour.DealHitTarget metadata=86266 token=0x60150fb VA=0x180d34840 RVA=0xd34840 size=0x240
0000000180d34840: mov      qword ptr [rsp + 0x10], rbx
0000000180d34845: mov      qword ptr [rsp + 0x18], rbp
0000000180d3484a: push     rdi
0000000180d3484b: sub      rsp, 0x30
0000000180d3484f: cmp      byte ptr [rip + 0x7f5fd1c], 0
0000000180d34856: movzx    ebp, r8b
0000000180d3485a: mov      rdi, rdx
0000000180d3485d: mov      rbx, rcx
0000000180d34860: jne      0x180d3488d
0000000180d34862: lea      rcx, [rip + 0x7b379ff] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180d34869: call     0x18048bf00
0000000180d3486e: lea      rcx, [rip + 0x7bd49cb] ; TypeInfo Torappu.Battle.Projectiles.HitBehaviour @0x188909240
0000000180d34875: call     0x18048bf00
0000000180d3487a: lea      rcx, [rip + 0x7bfe467] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180d34881: call     0x18048bf00
0000000180d34886: mov      byte ptr [rip + 0x7f5fce5], 1
0000000180d3488d: mov      rax, qword ptr [rip + 0x7bd49ac] ; TypeInfo Torappu.Battle.Projectiles.HitBehaviour @0x188909240
0000000180d34894: cmp      dword ptr [rax + 0xe0], 0
0000000180d3489b: jne      0x180d348ac
0000000180d3489d: mov      rcx, rax
0000000180d348a0: call     0x18048c140
0000000180d348a5: mov      rax, qword ptr [rip + 0x7bd4994] ; TypeInfo Torappu.Battle.Projectiles.HitBehaviour @0x188909240
0000000180d348ac: mov      rax, qword ptr [rax + 0xb8]
0000000180d348b3: mov      rcx, qword ptr [rax + 0x28]
0000000180d348b7: test     rcx, rcx
0000000180d348ba: jne      0x180d34a51
0000000180d348c0: mov      qword ptr [rsp + 0x40], rsi
0000000180d348c5: cmp      byte ptr [rbx + 0x99], cl
0000000180d348cb: jne      0x180d348e8
0000000180d348cd: test     rdi, rdi
0000000180d348d0: je       0x180d34a79
0000000180d348d6: xor      edx, edx
0000000180d348d8: mov      rcx, rdi
0000000180d348db: call     0x180705680 ; Torappu.Battle.Entity.get_isCamouflage [66527]
0000000180d348e0: test     al, al
0000000180d348e2: jne      0x180d34a3c
0000000180d348e8: cmp      byte ptr [rbx + 0x9b], 0
0000000180d348ef: je       0x180d34929
0000000180d348f1: xor      edx, edx
0000000180d348f3: mov      rcx, rbx
0000000180d348f6: call     0x1808cf160 ; Torappu.Battle.Projectile.Behaviour.get_source [71404]
0000000180d348fb: mov      rcx, qword ptr [rip + 0x7bfe3e6] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180d34902: mov      rsi, rax
0000000180d34905: cmp      dword ptr [rcx + 0xe0], 0
0000000180d3490c: jne      0x180d34913
0000000180d3490e: call     0x18048c140
0000000180d34913: xor      r8d, r8d
0000000180d34916: mov      rdx, rsi
0000000180d34919: mov      rcx, rdi
0000000180d3491c: call     0x186b638d0
0000000180d34921: test     al, al
0000000180d34923: jne      0x180d34a3c
0000000180d34929: cmp      byte ptr [rbx + 0x98], 0
0000000180d34930: je       0x180d3496a
0000000180d34932: xor      edx, edx
0000000180d34934: mov      rcx, rbx
0000000180d34937: call     0x1808cf2a0 ; Torappu.Battle.Projectile.Behaviour.get_traceTarget [71403]
0000000180d3493c: mov      rcx, qword ptr [rip + 0x7bfe3a5] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180d34943: mov      rsi, rax
0000000180d34946: cmp      dword ptr [rcx + 0xe0], 0
0000000180d3494d: jne      0x180d34954
0000000180d3494f: call     0x18048c140
0000000180d34954: xor      r8d, r8d
0000000180d34957: mov      rdx, rsi
0000000180d3495a: mov      rcx, rdi
0000000180d3495d: call     0x186b63a70
0000000180d34962: test     al, al
0000000180d34964: jne      0x180d34a3c
0000000180d3496a: cmp      byte ptr [rbx + 0x9e], 0
0000000180d34971: je       0x180d349de
0000000180d34973: mov      rcx, qword ptr [rip + 0x7bfe36e] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180d3497a: cmp      dword ptr [rcx + 0xe0], 0
0000000180d34981: jne      0x180d34988
0000000180d34983: call     0x18048c140
0000000180d34988: mov      rdx, qword ptr [rip + 0x7b378d9] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180d3498f: mov      rcx, rdi
0000000180d34992: call     0x1800057a0
0000000180d34997: mov      rcx, rax
0000000180d3499a: xor      r8d, r8d
0000000180d3499d: xor      edx, edx
0000000180d3499f: call     0x186b63a70
0000000180d349a4: test     al, al
0000000180d349a6: je       0x180d349de
0000000180d349a8: mov      rdx, qword ptr [rip + 0x7b378b9] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180d349af: mov      rcx, rdi
0000000180d349b2: call     0x1800057a0
0000000180d349b7: test     rax, rax
0000000180d349ba: je       0x180d34a79
0000000180d349c0: mov      rdx, qword ptr [rip + 0x7b378a1] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180d349c7: mov      rcx, rdi
0000000180d349ca: call     0x1800057a0
0000000180d349cf: mov      rcx, rax
0000000180d349d2: xor      edx, edx
0000000180d349d4: call     0x180a39480 ; Torappu.Battle.Character.get_blockMode [75898]
0000000180d349d9: cmp      eax, 1
0000000180d349dc: je       0x180d34a3c
0000000180d349de: cmp      byte ptr [rbx + 0x8c], 0
0000000180d349e5: je       0x180d34a1b
0000000180d349e7: xor      edx, edx
0000000180d349e9: mov      rcx, rbx
0000000180d349ec: call     0x1808cf2a0 ; Torappu.Battle.Projectile.Behaviour.get_traceTarget [71403]
0000000180d349f1: mov      rcx, qword ptr [rip + 0x7bfe2f0] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180d349f8: mov      rsi, rax
0000000180d349fb: cmp      dword ptr [rcx + 0xe0], 0
0000000180d34a02: jne      0x180d34a09
0000000180d34a04: call     0x18048c140
0000000180d34a09: xor      r8d, r8d
0000000180d34a0c: mov      rdx, rsi
0000000180d34a0f: mov      rcx, rdi
0000000180d34a12: call     0x186b63a70
0000000180d34a17: test     al, al
0000000180d34a19: je       0x180d34a3c
0000000180d34a1b: xor      edx, edx
0000000180d34a1d: mov      rcx, rbx
0000000180d34a20: call     0x1808cf100 ; Torappu.Battle.Projectile.Behaviour.get_projectile [71401]
0000000180d34a25: test     rax, rax
0000000180d34a28: je       0x180d34a79
0000000180d34a2a: xor      r9d, r9d
0000000180d34a2d: movzx    r8d, bpl
0000000180d34a31: mov      rdx, rdi
0000000180d34a34: mov      rcx, rax
0000000180d34a37: call     0x1808d6c40 ; Torappu.Battle.Projectile.DealHitTarget [71347]
0000000180d34a3c: mov      rsi, qword ptr [rsp + 0x40]
0000000180d34a41: mov      rbx, qword ptr [rsp + 0x48]
0000000180d34a46: mov      rbp, qword ptr [rsp + 0x50]
0000000180d34a4b: add      rsp, 0x30
0000000180d34a4f: pop      rdi
0000000180d34a50: ret      
0000000180d34a51: movzx    r9d, bpl
0000000180d34a55: mov      qword ptr [rsp + 0x20], 0
0000000180d34a5e: mov      r8, rdi
0000000180d34a61: mov      rdx, rbx
0000000180d34a64: call     0x1832fa300 ; XLua.DelegateBridge.__Gen_Delegate_Imp265 [2920]
0000000180d34a69: mov      rbx, qword ptr [rsp + 0x48]
0000000180d34a6e: mov      rbp, qword ptr [rsp + 0x50]
0000000180d34a73: add      rsp, 0x30
0000000180d34a77: pop      rdi
0000000180d34a78: ret      
0000000180d34a79: call     0x18048c0b0
0000000180d34a7e: int3     
0000000180d34a7f: int3     