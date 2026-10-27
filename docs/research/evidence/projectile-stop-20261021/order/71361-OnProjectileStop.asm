; Torappu.Battle.Projectile.OnProjectileStop metadata=71361 token=0x60116c2 VA=0x1808d97d0 RVA=0x8d97d0 size=0x320
00000001808d97d0: push     rbx
00000001808d97d2: sub      rsp, 0x60
00000001808d97d6: cmp      byte ptr [rip + 0x83b8035], 0
00000001808d97dd: mov      rbx, rcx
00000001808d97e0: jne      0x1808d980d
00000001808d97e2: lea      rcx, [rip + 0x804e577] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
00000001808d97e9: call     0x18048bf00
00000001808d97ee: lea      rcx, [rip + 0x7f49c03] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808d97f5: call     0x18048bf00
00000001808d97fa: lea      rcx, [rip + 0x8086e5f] ; StringLiteral 'ON_PROJECTILE_STOP' @0x188960660
00000001808d9801: call     0x18048bf00
00000001808d9806: mov      byte ptr [rip + 0x83b8005], 1
00000001808d980d: mov      rax, qword ptr [rip + 0x7f49be4] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808d9814: mov      rcx, qword ptr [rax + 0xb8]
00000001808d981b: mov      rcx, qword ptr [rcx + 0x220]
00000001808d9822: test     rcx, rcx
00000001808d9825: jne      0x1808d9ad3
00000001808d982b: cmp      byte ptr [rbx + 0xa5], cl
00000001808d9831: jne      0x1808d989c
00000001808d9833: cmp      byte ptr [rip + 0x83f2fb7], cl
00000001808d9839: jbe      0x1808d9843
00000001808d983b: mov      rcx, qword ptr [rbx]
00000001808d983e: call     0x180446d00
00000001808d9843: mov      rdx, qword ptr [rbx]
00000001808d9846: mov      rcx, rbx
00000001808d9849: mov      rax, qword ptr [rdx + 0x3f0]
00000001808d9850: mov      rdx, qword ptr [rdx + 0x3f8]
00000001808d9857: call     rax
00000001808d9859: test     al, al
00000001808d985b: je       0x1808d9867
00000001808d985d: xor      edx, edx
00000001808d985f: mov      rcx, rbx
00000001808d9862: call     0x1808db940 ; Torappu.Battle.Projectile._DealHitTraceTarget [71375]
00000001808d9867: cmp      byte ptr [rip + 0x83f2f82], 0
00000001808d986e: jbe      0x1808d9878
00000001808d9870: mov      rcx, qword ptr [rbx]
00000001808d9873: call     0x180446d00
00000001808d9878: mov      rdx, qword ptr [rbx]
00000001808d987b: mov      rcx, rbx
00000001808d987e: mov      rax, qword ptr [rdx + 0x410]
00000001808d9885: mov      rdx, qword ptr [rdx + 0x418]
00000001808d988c: call     rax
00000001808d988e: test     al, al
00000001808d9890: je       0x1808d989c
00000001808d9892: xor      edx, edx
00000001808d9894: mov      rcx, rbx
00000001808d9897: call     0x1808d96b0 ; Torappu.Battle.Projectile.OnProjectileReached [71365]
00000001808d989c: mov      rcx, qword ptr [rbx + 0x60]
00000001808d98a0: mov      qword ptr [rsp + 0x70], rsi
00000001808d98a5: mov      qword ptr [rsp + 0x78], rdi
00000001808d98aa: mov      qword ptr [rsp + 0x88], r14
00000001808d98b2: test     rcx, rcx
00000001808d98b5: je       0x1808d9ae3
00000001808d98bb: xor      edx, edx
00000001808d98bd: call     0x1808c8b30 ; Torappu.Battle.Projectile.ActionController.OnProjectileStop [71443]
00000001808d98c2: mov      rax, qword ptr [rbx + 0x148]
00000001808d98c9: xor      ecx, ecx
00000001808d98cb: xor      esi, esi
00000001808d98cd: test     rax, rax
00000001808d98d0: je       0x1808d9ae3
00000001808d98d6: mov      r14d, 0x20
00000001808d98dc: nop      dword ptr [rax]
00000001808d98e0: cmp      ecx, dword ptr [rax + 0x18]
00000001808d98e3: jge      0x1808d994c
00000001808d98e5: mov      rax, qword ptr [rbx + 0x148]
00000001808d98ec: test     rax, rax
00000001808d98ef: je       0x1808d9ae3
00000001808d98f5: cmp      esi, dword ptr [rax + 0x18]
00000001808d98f8: jae      0x1808d9ae9
00000001808d98fe: mov      rdi, qword ptr [r14 + rax]
00000001808d9902: test     rdi, rdi
00000001808d9905: je       0x1808d9ae3
00000001808d990b: cmp      byte ptr [rip + 0x83f2ede], 0
00000001808d9912: jbe      0x1808d991c
00000001808d9914: mov      rcx, qword ptr [rdi]
00000001808d9917: call     0x180446d00
00000001808d991c: mov      rdx, qword ptr [rdi]
00000001808d991f: mov      rcx, rdi
00000001808d9922: mov      rax, qword ptr [rdx + 0x1b0]
00000001808d9929: mov      rdx, qword ptr [rdx + 0x1b8]
00000001808d9930: call     rax
00000001808d9932: mov      rax, qword ptr [rbx + 0x148]
00000001808d9939: inc      esi
00000001808d993b: add      r14, 8
00000001808d993f: mov      ecx, esi
00000001808d9941: test     rax, rax
00000001808d9944: je       0x1808d9ae3
00000001808d994a: jmp      0x1808d98e0
00000001808d994c: mov      rsi, qword ptr [rbx + 0xc8]
00000001808d9953: test     rsi, rsi
00000001808d9956: je       0x1808d99cd
00000001808d9958: cmp      byte ptr [rip + 0x83b7f0b], 0
00000001808d995f: jne      0x1808d9980
00000001808d9961: lea      rcx, [rip + 0x7fa2da0] ; GenericMethodInfo 149731 @0x18887c708
00000001808d9968: call     0x18048bf00
00000001808d996d: lea      rcx, [rip + 0x7fa2fd4] ; GenericMethodInfo 149732 @0x18887c948
00000001808d9974: call     0x18048bf00
00000001808d9979: mov      byte ptr [rip + 0x83b7eea], 1
00000001808d9980: cmp      qword ptr [rsi + 0x10], 0
00000001808d9985: je       0x1808d99cd
00000001808d9987: mov      rax, qword ptr [rsi + 0x10]
00000001808d998b: mov      edi, dword ptr [rax + 0x18]
00000001808d998e: sub      edi, 1
00000001808d9991: js       0x1808d99cd
00000001808d9993: mov      rdx, qword ptr [rsi + 0x10]
00000001808d9997: test     rdx, rdx
00000001808d999a: je       0x1808d9ae3
00000001808d99a0: mov      r9, qword ptr [rip + 0x7fa2fa1] ; GenericMethodInfo 149732 @0x18887c948
00000001808d99a7: lea      rcx, [rsp + 0x40]
00000001808d99ac: mov      r8d, edi
00000001808d99af: call     0x184ae93d0
00000001808d99b4: cmp      byte ptr [rsp + 0x58], 0
00000001808d99b9: je       0x1808d99c8
00000001808d99bb: xor      r8d, r8d
00000001808d99be: mov      edx, edi
00000001808d99c0: mov      rcx, rsi
00000001808d99c3: call     0x1808d0a80 ; Torappu.Battle.Projectile.ExtraFollowEffectManager.FinishAt [71465]
00000001808d99c8: sub      edi, 1
00000001808d99cb: jns      0x1808d9993
00000001808d99cd: xor      edx, edx
00000001808d99cf: mov      rcx, rbx
00000001808d99d2: call     0x1808d66e0 ; Torappu.Battle.Projectile.ClearMainEffectIfNot [71378]
00000001808d99d7: cmp      dword ptr [rbx + 0xd0], 2
00000001808d99de: je       0x1808d9abb
00000001808d99e4: xor      edx, edx
00000001808d99e6: mov      rcx, rbx
00000001808d99e9: call     0x1808dccb0 ; Torappu.Battle.Projectile.get_audioSignalKey [71324]
00000001808d99ee: xor      r8d, r8d
00000001808d99f1: lea      rcx, [rsp + 0x30]
00000001808d99f6: mov      rdx, rbx
00000001808d99f9: mov      rdi, rax
00000001808d99fc: call     0x180ad4360 ; Torappu.Battle.VisualObject.get_worldPosition [77868]
00000001808d9a01: cmp      byte ptr [rip + 0x83b7dce], 0
00000001808d9a08: movsd    xmm0, qword ptr [rax]
00000001808d9a0c: mov      esi, dword ptr [rax + 8]
00000001808d9a0f: movsd    qword ptr [rsp + 0x80], xmm0
00000001808d9a18: jne      0x1808d9a39
00000001808d9a1a: lea      rcx, [rip + 0x805bb87] ; GenericMethodInfo 280377 @0x1889355a8
00000001808d9a21: call     0x18048bf00
00000001808d9a26: lea      rcx, [rip + 0x7f499cb] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808d9a2d: call     0x18048bf00
00000001808d9a32: mov      byte ptr [rip + 0x83b7d9d], 1
00000001808d9a39: mov      rax, qword ptr [rip + 0x7f499b8] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808d9a40: mov      rcx, qword ptr [rax + 0xb8]
00000001808d9a47: mov      rcx, qword ptr [rcx + 0x40]
00000001808d9a4b: test     rcx, rcx
00000001808d9a4e: jne      0x1808d9a65
00000001808d9a50: mov      rdx, qword ptr [rip + 0x805bb51] ; GenericMethodInfo 280377 @0x1889355a8
00000001808d9a57: lea      rcx, [rbx + 0xf8]
00000001808d9a5e: call     0x185159d80
00000001808d9a63: jmp      0x1808d9a70
00000001808d9a65: xor      r8d, r8d
00000001808d9a68: mov      rdx, rbx
00000001808d9a6b: call     0x1832f6410 ; XLua.DelegateBridge.__Gen_Delegate_Imp2631 [5286]
00000001808d9a70: mov      rcx, qword ptr [rip + 0x804e2e9] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
00000001808d9a77: mov      rbx, rax
00000001808d9a7a: cmp      dword ptr [rcx + 0xe0], 0
00000001808d9a81: jne      0x1808d9a88
00000001808d9a83: call     0x18048c140
00000001808d9a88: movsd    xmm0, qword ptr [rsp + 0x80]
00000001808d9a91: lea      r8, [rsp + 0x30]
00000001808d9a96: mov      rcx, qword ptr [rip + 0x8086bc3] ; StringLiteral 'ON_PROJECTILE_STOP' @0x188960660
00000001808d9a9d: mov      r9, rbx
00000001808d9aa0: mov      rdx, rdi
00000001808d9aa3: movsd    qword ptr [rsp + 0x30], xmm0
00000001808d9aa9: mov      dword ptr [rsp + 0x38], esi
00000001808d9aad: mov      qword ptr [rsp + 0x20], 0
00000001808d9ab6: call     0x18062daf0 ; Torappu.Battle.BattleController.PlayAudioAtPos [64740]
00000001808d9abb: mov      rdi, qword ptr [rsp + 0x78]
00000001808d9ac0: mov      rsi, qword ptr [rsp + 0x70]
00000001808d9ac5: mov      r14, qword ptr [rsp + 0x88]
00000001808d9acd: add      rsp, 0x60
00000001808d9ad1: pop      rbx
00000001808d9ad2: ret      
00000001808d9ad3: xor      r8d, r8d
00000001808d9ad6: mov      rdx, rbx
00000001808d9ad9: add      rsp, 0x60
00000001808d9add: pop      rbx
00000001808d9ade: jmp      0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
00000001808d9ae3: call     0x18048c0b0
00000001808d9ae8: int3     
00000001808d9ae9: call     0x18048c0a0
00000001808d9aee: int3     
00000001808d9aef: int3     