; Torappu.Battle.Projectile.OnProjectileBorn metadata=71360 token=0x60116c1 VA=0x1808d93a0 RVA=0x8d93a0 size=0x310
00000001808d93a0: push     rbx
00000001808d93a2: sub      rsp, 0x40
00000001808d93a6: cmp      byte ptr [rip + 0x83b8464], 0
00000001808d93ad: mov      rbx, rcx
00000001808d93b0: jne      0x1808d93f5
00000001808d93b2: lea      rcx, [rip + 0x804e9a7] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
00000001808d93b9: call     0x18048bf00
00000001808d93be: lea      rcx, [rip + 0x8059923] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808d93c5: call     0x18048bf00
00000001808d93ca: lea      rcx, [rip + 0x7f4a027] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808d93d1: call     0x18048bf00
00000001808d93d6: lea      rcx, [rip + 0x7ffa52b] ; GenericMethodInfo 281972 @0x1888d3908
00000001808d93dd: call     0x18048bf00
00000001808d93e2: lea      rcx, [rip + 0x8086bb7] ; StringLiteral 'ON_PROJECTILE_BORN' @0x18895ffa0
00000001808d93e9: call     0x18048bf00
00000001808d93ee: mov      byte ptr [rip + 0x83b841c], 1
00000001808d93f5: mov      rax, qword ptr [rip + 0x7f49ffc] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808d93fc: mov      rcx, qword ptr [rax + 0xb8]
00000001808d9403: mov      rcx, qword ptr [rcx + 0x218]
00000001808d940a: xor      r8d, r8d
00000001808d940d: test     rcx, rcx
00000001808d9410: jne      0x1808d968a
00000001808d9416: mov      rdx, qword ptr [rbx + 0x50]
00000001808d941a: mov      rcx, rbx
00000001808d941d: mov      qword ptr [rsp + 0x50], rsi
00000001808d9422: mov      qword ptr [rsp + 0x58], rdi
00000001808d9427: mov      qword ptr [rsp + 0x68], r14
00000001808d942c: call     0x1808db790 ; Torappu.Battle.Projectile._CreateMainEffect [71377]
00000001808d9431: mov      rcx, qword ptr [rbx + 0x60]
00000001808d9435: test     rcx, rcx
00000001808d9438: je       0x1808d9697
00000001808d943e: xor      r9d, r9d
00000001808d9441: xor      r8d, r8d
00000001808d9444: mov      edx, 5
00000001808d9449: call     0x1808ca1f0 ; Torappu.Battle.Projectile.ActionController._RunActions [71449]
00000001808d944e: cmp      dword ptr [rbx + 0xd0], 2
00000001808d9455: je       0x1808d94ab
00000001808d9457: xor      edx, edx
00000001808d9459: mov      rcx, rbx
00000001808d945c: call     0x1808dd7b0 ; Torappu.Battle.Projectile.get_source [71293]
00000001808d9461: mov      rcx, qword ptr [rip + 0x8059880] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808d9468: mov      rdi, rax
00000001808d946b: cmp      dword ptr [rcx + 0xe0], 0
00000001808d9472: jne      0x1808d9479
00000001808d9474: call     0x18048c140
00000001808d9479: xor      r8d, r8d
00000001808d947c: xor      edx, edx
00000001808d947e: mov      rcx, rdi
00000001808d9481: call     0x186b63a70
00000001808d9486: test     al, al
00000001808d9488: je       0x1808d94ab
00000001808d948a: xor      edx, edx
00000001808d948c: mov      rcx, rbx
00000001808d948f: call     0x1808dd7b0 ; Torappu.Battle.Projectile.get_source [71293]
00000001808d9494: test     rax, rax
00000001808d9497: je       0x1808d9697
00000001808d949d: xor      r8d, r8d
00000001808d94a0: mov      rdx, rbx
00000001808d94a3: mov      rcx, rax
00000001808d94a6: call     0x1806f9bb0 ; Torappu.Battle.Entity.OnProjectileBorn [66677]
00000001808d94ab: mov      rax, qword ptr [rbx + 0x148]
00000001808d94b2: xor      esi, esi
00000001808d94b4: xor      ecx, ecx
00000001808d94b6: test     rax, rax
00000001808d94b9: je       0x1808d9697
00000001808d94bf: mov      r14d, 0x20
00000001808d94c5: cmp      ecx, dword ptr [rax + 0x18]
00000001808d94c8: jge      0x1808d9531
00000001808d94ca: mov      rdi, qword ptr [rbx + 0x148]
00000001808d94d1: test     rdi, rdi
00000001808d94d4: je       0x1808d9697
00000001808d94da: cmp      esi, dword ptr [rdi + 0x18]
00000001808d94dd: jae      0x1808d969d
00000001808d94e3: mov      rdi, qword ptr [r14 + rdi]
00000001808d94e7: test     rdi, rdi
00000001808d94ea: je       0x1808d9697
00000001808d94f0: cmp      byte ptr [rip + 0x83f32f9], 0
00000001808d94f7: jbe      0x1808d9501
00000001808d94f9: mov      rcx, qword ptr [rdi]
00000001808d94fc: call     0x180446d00
00000001808d9501: mov      rdx, qword ptr [rdi]
00000001808d9504: mov      rcx, rdi
00000001808d9507: mov      rax, qword ptr [rdx + 0x1a0]
00000001808d950e: mov      rdx, qword ptr [rdx + 0x1a8]
00000001808d9515: call     rax
00000001808d9517: mov      rax, qword ptr [rbx + 0x148]
00000001808d951e: inc      esi
00000001808d9520: add      r14, 8
00000001808d9524: mov      ecx, esi
00000001808d9526: test     rax, rax
00000001808d9529: je       0x1808d9697
00000001808d952f: jmp      0x1808d94c5
00000001808d9531: cmp      byte ptr [rip + 0x83f32b8], 0
00000001808d9538: jbe      0x1808d9542
00000001808d953a: mov      rcx, qword ptr [rbx]
00000001808d953d: call     0x180446d00
00000001808d9542: mov      rdx, qword ptr [rbx]
00000001808d9545: mov      rcx, rbx
00000001808d9548: mov      rax, qword ptr [rdx + 0x2c0]
00000001808d954f: mov      rdx, qword ptr [rdx + 0x2c8]
00000001808d9556: call     rax
00000001808d9558: cmp      dword ptr [rbx + 0xd0], 2
00000001808d955f: je       0x1808d9675
00000001808d9565: mov      rcx, qword ptr [rip + 0x7ffa39c] ; GenericMethodInfo 281972 @0x1888d3908
00000001808d956c: call     0x185337c50
00000001808d9571: test     rax, rax
00000001808d9574: je       0x1808d9697
00000001808d957a: xor      edx, edx
00000001808d957c: mov      rcx, rax
00000001808d957f: call     0x1806430d0 ; Torappu.Battle.BattleController.get_logger [64507]
00000001808d9584: test     rax, rax
00000001808d9587: je       0x1808d9697
00000001808d958d: mov      r8, qword ptr [rbx + 0xe8]
00000001808d9594: xor      r9d, r9d
00000001808d9597: mov      edx, 2
00000001808d959c: mov      rcx, rax
00000001808d959f: call     0x180710440 ; Torappu.Battle.BattleLogger.LogExtraBattleInfoAddCount [66995]
00000001808d95a4: xor      edx, edx
00000001808d95a6: mov      rcx, rbx
00000001808d95a9: call     0x1808dccb0 ; Torappu.Battle.Projectile.get_audioSignalKey [71324]
00000001808d95ae: xor      r8d, r8d
00000001808d95b1: lea      rcx, [rsp + 0x30]
00000001808d95b6: mov      rdx, rbx
00000001808d95b9: mov      rdi, rax
00000001808d95bc: call     0x180ad4360 ; Torappu.Battle.VisualObject.get_worldPosition [77868]
00000001808d95c1: cmp      byte ptr [rip + 0x83b820e], 0
00000001808d95c8: movsd    xmm0, qword ptr [rax]
00000001808d95cc: mov      esi, dword ptr [rax + 8]
00000001808d95cf: movsd    qword ptr [rsp + 0x60], xmm0
00000001808d95d5: jne      0x1808d95f6
00000001808d95d7: lea      rcx, [rip + 0x805bfca] ; GenericMethodInfo 280377 @0x1889355a8
00000001808d95de: call     0x18048bf00
00000001808d95e3: lea      rcx, [rip + 0x7f49e0e] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808d95ea: call     0x18048bf00
00000001808d95ef: mov      byte ptr [rip + 0x83b81e0], 1
00000001808d95f6: mov      rax, qword ptr [rip + 0x7f49dfb] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808d95fd: mov      rcx, qword ptr [rax + 0xb8]
00000001808d9604: mov      rcx, qword ptr [rcx + 0x40]
00000001808d9608: test     rcx, rcx
00000001808d960b: jne      0x1808d9622
00000001808d960d: mov      rdx, qword ptr [rip + 0x805bf94] ; GenericMethodInfo 280377 @0x1889355a8
00000001808d9614: lea      rcx, [rbx + 0xf8]
00000001808d961b: call     0x185159d80
00000001808d9620: jmp      0x1808d962d
00000001808d9622: xor      r8d, r8d
00000001808d9625: mov      rdx, rbx
00000001808d9628: call     0x1832f6410 ; XLua.DelegateBridge.__Gen_Delegate_Imp2631 [5286]
00000001808d962d: mov      rcx, qword ptr [rip + 0x804e72c] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
00000001808d9634: mov      rbx, rax
00000001808d9637: cmp      dword ptr [rcx + 0xe0], 0
00000001808d963e: jne      0x1808d9645
00000001808d9640: call     0x18048c140
00000001808d9645: movsd    xmm0, qword ptr [rsp + 0x60]
00000001808d964b: lea      r8, [rsp + 0x30]
00000001808d9650: mov      rcx, qword ptr [rip + 0x8086949] ; StringLiteral 'ON_PROJECTILE_BORN' @0x18895ffa0
00000001808d9657: mov      r9, rbx
00000001808d965a: mov      rdx, rdi
00000001808d965d: movsd    qword ptr [rsp + 0x30], xmm0
00000001808d9663: mov      dword ptr [rsp + 0x38], esi
00000001808d9667: mov      qword ptr [rsp + 0x20], 0
00000001808d9670: call     0x18062daf0 ; Torappu.Battle.BattleController.PlayAudioAtPos [64740]
00000001808d9675: mov      rdi, qword ptr [rsp + 0x58]
00000001808d967a: mov      rsi, qword ptr [rsp + 0x50]
00000001808d967f: mov      r14, qword ptr [rsp + 0x68]
00000001808d9684: add      rsp, 0x40
00000001808d9688: pop      rbx
00000001808d9689: ret      
00000001808d968a: mov      rdx, rbx
00000001808d968d: add      rsp, 0x40
00000001808d9691: pop      rbx
00000001808d9692: jmp      0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
00000001808d9697: call     0x18048c0b0
00000001808d969c: int3     
00000001808d969d: call     0x18048c0a0
00000001808d96a2: int3     
00000001808d96a3: int3     
00000001808d96a4: int3     
00000001808d96a5: int3     
00000001808d96a6: int3     
00000001808d96a7: int3     
00000001808d96a8: int3     
00000001808d96a9: int3     
00000001808d96aa: int3     
00000001808d96ab: int3     
00000001808d96ac: int3     
00000001808d96ad: int3     
00000001808d96ae: int3     
00000001808d96af: int3     