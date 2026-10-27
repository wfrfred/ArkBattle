; Torappu.Battle.LinkProjectile.OnHitTarget metadata=71180 token=0x601160d VA=0x1808d2740 RVA=0x8d2740 size=0x260
00000001808d2740: mov      qword ptr [rsp + 0x20], rbx
00000001808d2745: push     rdi
00000001808d2746: sub      rsp, 0x40
00000001808d274a: cmp      byte ptr [rip + 0x83bf03d], 0
00000001808d2751: mov      rdi, rdx
00000001808d2754: mov      rbx, rcx
00000001808d2757: jne      0x1808d2790
00000001808d2759: lea      rcx, [rip + 0x8055600] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
00000001808d2760: call     0x18048bf00
00000001808d2765: lea      rcx, [rip + 0x7fbd80c] ; TypeInfo Torappu.Battle.LinkProjectile @0x18888ff78
00000001808d276c: call     0x18048bf00
00000001808d2771: lea      rcx, [rip + 0x8062e30] ; GenericMethodInfo 280377 @0x1889355a8
00000001808d2778: call     0x18048bf00
00000001808d277d: lea      rcx, [rip + 0x8060564] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808d2784: call     0x18048bf00
00000001808d2789: mov      byte ptr [rip + 0x83beffe], 1
00000001808d2790: mov      rax, qword ptr [rip + 0x7fbd7e1] ; TypeInfo Torappu.Battle.LinkProjectile @0x18888ff78
00000001808d2797: mov      rcx, qword ptr [rax + 0xb8]
00000001808d279e: mov      rcx, qword ptr [rcx + 0x98]
00000001808d27a5: test     rcx, rcx
00000001808d27a8: jne      0x1808d2981
00000001808d27ae: mov      qword ptr [rsp + 0x58], rsi
00000001808d27b3: cmp      byte ptr [rbx + 0x1c8], cl
00000001808d27b9: je       0x1808d2808
00000001808d27bb: cmp      byte ptr [rbx + 0x1a1], cl
00000001808d27c1: je       0x1808d2971
00000001808d27c7: mov      rdx, qword ptr [rip + 0x8062dda] ; GenericMethodInfo 280377 @0x1889355a8
00000001808d27ce: lea      rcx, [rbx + 0x1b8]
00000001808d27d5: call     0x185159d80
00000001808d27da: mov      rcx, qword ptr [rip + 0x8060507] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808d27e1: mov      rsi, rax
00000001808d27e4: cmp      dword ptr [rcx + 0xe0], 0
00000001808d27eb: jne      0x1808d27f2
00000001808d27ed: call     0x18048c140
00000001808d27f2: xor      r8d, r8d
00000001808d27f5: mov      rdx, rdi
00000001808d27f8: mov      rcx, rsi
00000001808d27fb: call     0x186b63a70
00000001808d2800: test     al, al
00000001808d2802: jne      0x1808d2971
00000001808d2808: cmp      byte ptr [rbx + 0x1a3], 0
00000001808d280f: mov      qword ptr [rsp + 0x50], rbp
00000001808d2814: mov      qword ptr [rsp + 0x60], r14
00000001808d2819: je       0x1808d2836
00000001808d281b: test     rdi, rdi
00000001808d281e: je       0x1808d2999
00000001808d2824: xor      edx, edx
00000001808d2826: mov      rcx, rdi
00000001808d2829: call     0x180705f70 ; Torappu.Battle.Entity.get_isInvincible [66514]
00000001808d282e: test     al, al
00000001808d2830: jne      0x1808d2967
00000001808d2836: cmp      dword ptr [rbx + 0x1a8], 0
00000001808d283d: jl       0x1808d2851
00000001808d283f: mov      eax, dword ptr [rbx + 0x1a8]
00000001808d2845: cmp      dword ptr [rbx + 0x1ac], eax
00000001808d284b: jge      0x1808d2967
00000001808d2851: inc      dword ptr [rbx + 0x1ac]
00000001808d2857: xor      edx, edx
00000001808d2859: mov      rcx, rbx
00000001808d285c: call     0x1808d3300 ; Torappu.Battle.LinkProjectile.get_hasSplittedDamage [71166]
00000001808d2861: test     al, al
00000001808d2863: jne      0x1808d2878
00000001808d2865: xor      r8d, r8d
00000001808d2868: mov      rdx, rdi
00000001808d286b: mov      rcx, rbx
00000001808d286e: call     0x1808d9090 ; Torappu.Battle.Projectile.OnHitTarget [71362]
00000001808d2873: jmp      0x1808d2915
00000001808d2878: mov      rdx, qword ptr [rip + 0x8062d29] ; GenericMethodInfo 280377 @0x1889355a8
00000001808d287f: lea      rcx, [rbx + 0xf8]
00000001808d2886: mov      rsi, qword ptr [rbx + 0x1d0]
00000001808d288d: call     0x185159d80
00000001808d2892: mov      r14d, dword ptr [rbx + 0x1ac]
00000001808d2899: xor      edx, edx
00000001808d289b: mov      rcx, rbx
00000001808d289e: mov      rbp, rax
00000001808d28a1: call     0x1808ddae0 ; Torappu.Battle.Projectile.get_traceTarget [71296]
00000001808d28a6: test     rsi, rsi
00000001808d28a9: je       0x1808d2999
00000001808d28af: cmp      r14d, 1
00000001808d28b3: mov      qword ptr [rsp + 0x28], 0
00000001808d28bc: mov      r8, rdi
00000001808d28bf: mov      qword ptr [rsp + 0x20], rax
00000001808d28c4: setle    r9b
00000001808d28c8: mov      rdx, rbp
00000001808d28cb: mov      rcx, rsi
00000001808d28ce: call     0x1808aff00 ; Torappu.Battle.ModifierSplitter.BeforeApply [71021]
00000001808d28d3: xor      r8d, r8d
00000001808d28d6: mov      rdx, rdi
00000001808d28d9: mov      rcx, rbx
00000001808d28dc: call     0x1808d9090 ; Torappu.Battle.Projectile.OnHitTarget [71362]
00000001808d28e1: mov      rdx, qword ptr [rip + 0x8062cc0] ; GenericMethodInfo 280377 @0x1889355a8
00000001808d28e8: lea      rcx, [rbx + 0xf8]
00000001808d28ef: mov      rsi, qword ptr [rbx + 0x1d0]
00000001808d28f6: call     0x185159d80
00000001808d28fb: test     rsi, rsi
00000001808d28fe: je       0x1808d2999
00000001808d2904: xor      r9d, r9d
00000001808d2907: mov      r8, rdi
00000001808d290a: mov      rdx, rax
00000001808d290d: mov      rcx, rsi
00000001808d2910: call     0x1808afec0 ; Torappu.Battle.ModifierSplitter.AfterApply [71022]
00000001808d2915: cmp      byte ptr [rbx + 0x1c8], 0
00000001808d291c: jne      0x1808d2967
00000001808d291e: xor      edx, edx
00000001808d2920: mov      rcx, rbx
00000001808d2923: call     0x1808dd220 ; Torappu.Battle.Projectile.get_isStopped [71325]
00000001808d2928: test     al, al
00000001808d292a: jne      0x1808d2967
00000001808d292c: mov      ecx, 0x38
00000001808d2931: mov      r8, rdi
00000001808d2934: mov      rdx, rbx
00000001808d2937: call     0x180005480
00000001808d293c: mov      rcx, qword ptr [rip + 0x805541d] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
00000001808d2943: mov      rdi, rax
00000001808d2946: cmp      dword ptr [rcx + 0xe0], 0
00000001808d294d: jne      0x1808d2954
00000001808d294f: call     0x18048c140
00000001808d2954: xor      r9d, r9d
00000001808d2957: lea      rcx, [rsp + 0x30]
00000001808d295c: mov      r8, rdi
00000001808d295f: mov      rdx, rbx
00000001808d2962: call     0x180633110 ; Torappu.Battle.BattleController.StartBattleCoroutine [64743]
00000001808d2967: mov      rbp, qword ptr [rsp + 0x50]
00000001808d296c: mov      r14, qword ptr [rsp + 0x60]
00000001808d2971: mov      rsi, qword ptr [rsp + 0x58]
00000001808d2976: mov      rbx, qword ptr [rsp + 0x68]
00000001808d297b: add      rsp, 0x40
00000001808d297f: pop      rdi
00000001808d2980: ret      
00000001808d2981: xor      r9d, r9d
00000001808d2984: mov      r8, rdi
00000001808d2987: mov      rdx, rbx
00000001808d298a: mov      rbx, qword ptr [rsp + 0x68]
00000001808d298f: add      rsp, 0x40
00000001808d2993: pop      rdi
00000001808d2994: jmp      0x1832d2220 ; XLua.DelegateBridge.__Gen_Delegate_Imp23 [2678]
00000001808d2999: call     0x18048c0b0
00000001808d299e: int3     
00000001808d299f: int3     