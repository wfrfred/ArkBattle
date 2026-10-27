; Torappu.Battle.Projectiles.AdvancedMovement.DoCheckReached metadata=86735 token=0x60152d0 VA=0x180d522b0 RVA=0xd522b0 size=0x190
0000000180d522b0: push     rsi
0000000180d522b2: sub      rsp, 0x20
0000000180d522b6: cmp      byte ptr [rip + 0x7f423f6], 0
0000000180d522bd: mov      rsi, rcx
0000000180d522c0: jne      0x180d522ed
0000000180d522c2: lea      rcx, [rip + 0x7ad2b5f] ; TypeInfo Torappu.Battle.Projectiles.AdvancedMovement @0x188824e28
0000000180d522c9: call     0x18048bf00
0000000180d522ce: lea      rcx, [rip + 0x7b0842b] ; TypeInfo Torappu.FP @0x18885a700
0000000180d522d5: call     0x18048bf00
0000000180d522da: lea      rcx, [rip + 0x7b71957] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180d522e1: call     0x18048bf00
0000000180d522e6: mov      byte ptr [rip + 0x7f423c6], 1
0000000180d522ed: mov      rax, qword ptr [rip + 0x7ad2b34] ; TypeInfo Torappu.Battle.Projectiles.AdvancedMovement @0x188824e28
0000000180d522f4: mov      rcx, qword ptr [rax + 0xb8]
0000000180d522fb: mov      rcx, qword ptr [rcx + 0xc0]
0000000180d52302: test     rcx, rcx
0000000180d52305: jne      0x180d52415
0000000180d5230b: xor      edx, edx
0000000180d5230d: mov      rcx, rsi
0000000180d52310: call     0x1808ca5f0 ; Torappu.Battle.BasicMovement.CheckReached [71221]
0000000180d52315: test     al, al
0000000180d52317: je       0x180d52425
0000000180d5231d: xor      edx, edx
0000000180d5231f: mov      rcx, rsi
0000000180d52322: call     0x186b59d80
0000000180d52327: test     rax, rax
0000000180d5232a: je       0x180d5242b
0000000180d52330: xor      edx, edx
0000000180d52332: mov      rcx, rax
0000000180d52335: call     0x186b5c980
0000000180d5233a: test     al, al
0000000180d5233c: je       0x180d52406
0000000180d52342: mov      rcx, qword ptr [rip + 0x7b083b7] ; TypeInfo Torappu.FP @0x18885a700
0000000180d52349: mov      qword ptr [rsp + 0x30], rbx
0000000180d5234e: mov      rbx, qword ptr [rsi + 0x110]
0000000180d52355: mov      qword ptr [rsp + 0x38], rdi
0000000180d5235a: cmp      dword ptr [rcx + 0xe0], 0
0000000180d52361: jne      0x180d52368
0000000180d52363: call     0x18048c140
0000000180d52368: xor      edx, edx
0000000180d5236a: xor      ecx, ecx
0000000180d5236c: call     0x1866fdac0
0000000180d52371: mov      rcx, qword ptr [rip + 0x7b718c0] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180d52378: mov      rdi, rax
0000000180d5237b: cmp      dword ptr [rcx + 0xe0], 0
0000000180d52382: jne      0x180d52389
0000000180d52384: call     0x18048c140
0000000180d52389: xor      r8d, r8d
0000000180d5238c: mov      rdx, rdi
0000000180d5238f: mov      rcx, rbx
0000000180d52392: call     0x1866e4c60
0000000180d52397: mov      rdi, qword ptr [rsp + 0x38]
0000000180d5239c: mov      rbx, qword ptr [rsp + 0x30]
0000000180d523a1: test     al, al
0000000180d523a3: je       0x180d52406
0000000180d523a5: xor      edx, edx
0000000180d523a7: mov      rcx, rsi
0000000180d523aa: call     0x1808cf100 ; Torappu.Battle.Projectile.Behaviour.get_projectile [71401]
0000000180d523af: test     rax, rax
0000000180d523b2: je       0x180d5242b
0000000180d523b4: movzx    r8d, byte ptr [rsi + 0xdc]
0000000180d523bc: xor      r9d, r9d
0000000180d523bf: mov      rdx, qword ptr [rsi + 0x110]
0000000180d523c6: mov      rcx, rax
0000000180d523c9: call     0x1808d7050 ; Torappu.Battle.Projectile.EnsureLifeTime [71349]
0000000180d523ce: cmp      byte ptr [rsi + 0xdd], 0
0000000180d523d5: je       0x180d523f7
0000000180d523d7: cmp      byte ptr [rsi + 0x138], 0
0000000180d523de: jne      0x180d52425
0000000180d523e0: xor      edx, edx
0000000180d523e2: mov      rcx, rsi
0000000180d523e5: call     0x180d54a10 ; Torappu.Battle.Projectiles.AdvancedMovement._UpdateAfterReach [86736]
0000000180d523ea: mov      byte ptr [rsi + 0x138], 1
0000000180d523f1: add      rsp, 0x20
0000000180d523f5: pop      rsi
0000000180d523f6: ret      
0000000180d523f7: xor      edx, edx
0000000180d523f9: mov      rcx, rsi
0000000180d523fc: add      rsp, 0x20
0000000180d52400: pop      rsi
0000000180d52401: jmp      0x180d54a10 ; Torappu.Battle.Projectiles.AdvancedMovement._UpdateAfterReach [86736]
0000000180d52406: xor      edx, edx
0000000180d52408: mov      rcx, rsi
0000000180d5240b: add      rsp, 0x20
0000000180d5240f: pop      rsi
0000000180d52410: jmp      0x1808ce920 ; Torappu.Battle.Projectile.Behaviour.Stop [71422]
0000000180d52415: xor      r8d, r8d
0000000180d52418: mov      rdx, rsi
0000000180d5241b: add      rsp, 0x20
0000000180d5241f: pop      rsi
0000000180d52420: jmp      0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
0000000180d52425: add      rsp, 0x20
0000000180d52429: pop      rsi
0000000180d5242a: ret      
0000000180d5242b: call     0x18048c0b0
0000000180d52430: int3     
0000000180d52431: int3     
0000000180d52432: int3     
0000000180d52433: int3     
0000000180d52434: int3     
0000000180d52435: int3     
0000000180d52436: int3     
0000000180d52437: int3     
0000000180d52438: int3     
0000000180d52439: int3     
0000000180d5243a: int3     
0000000180d5243b: int3     
0000000180d5243c: int3     
0000000180d5243d: int3     
0000000180d5243e: int3     
0000000180d5243f: int3     