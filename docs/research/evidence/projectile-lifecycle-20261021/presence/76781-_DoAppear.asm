; Torappu.Battle.Enemy.States.DisappearState._DoAppear metadata=76781 token=0x6012bee VA=0x180a8d440 RVA=0xa8d440 size=0x5c0
0000000180a8d440: push     rbx
0000000180a8d442: sub      rsp, 0x50
0000000180a8d446: cmp      byte ptr [rip + 0x820552c], 0
0000000180a8d44d: mov      rbx, rcx
0000000180a8d450: jne      0x180a8d4ed
0000000180a8d456: lea      rcx, [rip + 0x7ee418b] ; TypeInfo type(0x15, data=0x188b374d0) @0x1889715e8
0000000180a8d45d: call     0x18048bf00
0000000180a8d462: lea      rcx, [rip + 0x7ee5c7f] ; TypeInfo type(0x15, data=0x188b3d8f0) @0x1889730e8
0000000180a8d469: call     0x18048bf00
0000000180a8d46e: lea      rcx, [rip + 0x7ea1eab] ; TypeInfo DG.Tweening.DOTween @0x18892f320
0000000180a8d475: call     0x18048bf00
0000000180a8d47a: lea      rcx, [rip + 0x7df7aaf] ; TypeInfo Torappu.Battle.Enemy.States.DisappearState @0x188884f30
0000000180a8d481: call     0x18048bf00
0000000180a8d486: lea      rcx, [rip + 0x7eca6d3] ; GenericMethodInfo 282794 @0x188957b60
0000000180a8d48d: call     0x18048bf00
0000000180a8d492: lea      rcx, [rip + 0x7d87447] ; GenericMethodInfo 301116 @0x1888148e0
0000000180a8d499: call     0x18048bf00
0000000180a8d49e: lea      rcx, [rip + 0x7d91a0b] ; MethodInfo Torappu.Battle.Enemy.States.DisappearState.<>c.<_DoAppear>b__22_0 [76791] @0x18881eeb0
0000000180a8d4a5: call     0x18048bf00
0000000180a8d4aa: lea      rcx, [rip + 0x7d91c3f] ; MethodInfo Torappu.Battle.Enemy.States.DisappearState.<>c.<_DoAppear>b__22_2 [76792] @0x18881f0f0
0000000180a8d4b1: call     0x18048bf00
0000000180a8d4b6: lea      rcx, [rip + 0x7d92773] ; MethodInfo Torappu.Battle.Enemy.States.DisappearState.<>c__DisplayClass22_0.<_DoAppear>b__1 [76800] @0x18881fc30
0000000180a8d4bd: call     0x18048bf00
0000000180a8d4c2: lea      rcx, [rip + 0x7d929a7] ; MethodInfo Torappu.Battle.Enemy.States.DisappearState.<>c__DisplayClass22_0.<_DoAppear>b__3 [76801] @0x18881fe70
0000000180a8d4c9: call     0x18048bf00
0000000180a8d4ce: lea      rcx, [rip + 0x7e5a083] ; TypeInfo Torappu.Battle.Enemy.States.DisappearState.<>c__DisplayClass22_0 @0x1888e7558
0000000180a8d4d5: call     0x18048bf00
0000000180a8d4da: lea      rcx, [rip + 0x7e59bf7] ; TypeInfo Torappu.Battle.Enemy.States.DisappearState.<>c @0x1888e70d8
0000000180a8d4e1: call     0x18048bf00
0000000180a8d4e6: mov      byte ptr [rip + 0x820548c], 1
0000000180a8d4ed: mov      rax, qword ptr [rip + 0x7df7a3c] ; TypeInfo Torappu.Battle.Enemy.States.DisappearState @0x188884f30
0000000180a8d4f4: mov      rcx, qword ptr [rax + 0xb8]
0000000180a8d4fb: mov      rcx, qword ptr [rcx + 0x58]
0000000180a8d4ff: test     rcx, rcx
0000000180a8d502: jne      0x180a8d9ea
0000000180a8d508: mov      qword ptr [rsp + 0x68], rsi
0000000180a8d50d: mov      qword ptr [rsp + 0x60], rbp
0000000180a8d512: mov      qword ptr [rsp + 0x70], rdi
0000000180a8d517: mov      qword ptr [rsp + 0x78], r14
0000000180a8d51c: movaps   xmmword ptr [rsp + 0x40], xmm6
0000000180a8d521: mov      rcx, qword ptr [rip + 0x7e5a030] ; TypeInfo Torappu.Battle.Enemy.States.DisappearState.<>c__DisplayClass22_0 @0x1888e7558
0000000180a8d528: call     0x18045cfe0
0000000180a8d52d: mov      rsi, rax
0000000180a8d530: test     rax, rax
0000000180a8d533: je       0x180a8d9fa
0000000180a8d539: xor      edx, edx
0000000180a8d53b: mov      rcx, rax
0000000180a8d53e: call     0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
0000000180a8d543: lea      rcx, [rsi + 0x20]
0000000180a8d547: mov      qword ptr [rsi + 0x20], rbx
0000000180a8d54b: mov      rdx, rbx
0000000180a8d54e: call     0x18048b9e0
0000000180a8d553: mov      rdx, qword ptr [rip + 0x7eca606] ; GenericMethodInfo 282794 @0x188957b60
0000000180a8d55a: mov      rcx, rbx
0000000180a8d55d: call     0x18536e540
0000000180a8d562: test     rax, rax
0000000180a8d565: je       0x180a8d9fa
0000000180a8d56b: xor      edx, edx
0000000180a8d56d: mov      rcx, rax
0000000180a8d570: call     0x186b59d80
0000000180a8d575: xor      r8d, r8d
0000000180a8d578: mov      dl, 1
0000000180a8d57a: mov      rcx, rax
0000000180a8d57d: call     0x18671b320
0000000180a8d582: mov      rdx, qword ptr [rip + 0x7eca5d7] ; GenericMethodInfo 282794 @0x188957b60
0000000180a8d589: mov      rcx, rbx
0000000180a8d58c: call     0x18536e540
0000000180a8d591: test     rax, rax
0000000180a8d594: je       0x180a8d9fa
0000000180a8d59a: xor      r8d, r8d
0000000180a8d59d: lea      rcx, [rsp + 0x30]
0000000180a8d5a2: mov      rdx, rax
0000000180a8d5a5: call     0x1806f3c30 ; Torappu.Battle.Entity.GetBodyColor [66588]
0000000180a8d5aa: mov      rcx, rbx
0000000180a8d5ad: movups   xmm0, xmmword ptr [rax]
0000000180a8d5b0: movups   xmmword ptr [rsi + 0x10], xmm0
0000000180a8d5b4: mov      rdx, qword ptr [rip + 0x7eca5a5] ; GenericMethodInfo 282794 @0x188957b60
0000000180a8d5bb: call     0x18536e540
0000000180a8d5c0: test     rax, rax
0000000180a8d5c3: je       0x180a8d9fa
0000000180a8d5c9: xor      edx, edx
0000000180a8d5cb: mov      rcx, rax
0000000180a8d5ce: call     0x180a7c560 ; Torappu.Battle.Enemy.get_disableAppearTweenColor [76278]
0000000180a8d5d3: test     al, al
0000000180a8d5d5: je       0x180a8d6e0
0000000180a8d5db: cmp      byte ptr [rip + 0x8205398], 0
0000000180a8d5e2: jne      0x180a8d603
0000000180a8d5e4: lea      rcx, [rip + 0x7df7945] ; TypeInfo Torappu.Battle.Enemy.States.DisappearState @0x188884f30
0000000180a8d5eb: call     0x18048bf00
0000000180a8d5f0: lea      rcx, [rip + 0x7eca569] ; GenericMethodInfo 282794 @0x188957b60
0000000180a8d5f7: call     0x18048bf00
0000000180a8d5fc: mov      byte ptr [rip + 0x8205377], 1
0000000180a8d603: mov      rax, qword ptr [rip + 0x7df7926] ; TypeInfo Torappu.Battle.Enemy.States.DisappearState @0x188884f30
0000000180a8d60a: mov      rcx, qword ptr [rax + 0xb8]
0000000180a8d611: mov      rcx, qword ptr [rcx + 0x60]
0000000180a8d615: xor      r8d, r8d
0000000180a8d618: test     rcx, rcx
0000000180a8d61b: jne      0x180a8d6d3
0000000180a8d621: mov      rcx, qword ptr [rbx + 0x30]
0000000180a8d625: mov      dl, 1
0000000180a8d627: call     0x184260440
0000000180a8d62c: mov      rdx, qword ptr [rip + 0x7eca52d] ; GenericMethodInfo 282794 @0x188957b60
0000000180a8d633: mov      rcx, rbx
0000000180a8d636: call     0x18536e540
0000000180a8d63b: test     rax, rax
0000000180a8d63e: je       0x180a8d9fa
0000000180a8d644: xor      r8d, r8d
0000000180a8d647: lea      rcx, [rsp + 0x30]
0000000180a8d64c: mov      rdx, rax
0000000180a8d64f: call     0x1806f3c30 ; Torappu.Battle.Entity.GetBodyColor [66588]
0000000180a8d654: mov      rdx, qword ptr [rip + 0x7eca505] ; GenericMethodInfo 282794 @0x188957b60
0000000180a8d65b: mov      rcx, rbx
0000000180a8d65e: movups   xmm6, xmmword ptr [rax]
0000000180a8d661: call     0x18536e540
0000000180a8d666: mov      rdi, rax
0000000180a8d669: test     rax, rax
0000000180a8d66c: je       0x180a8d9fa
0000000180a8d672: cmp      byte ptr [rip + 0x823f177], 0
0000000180a8d679: movaps   xmm0, xmm6
0000000180a8d67c: shufps   xmm0, xmm6, 0x55
0000000180a8d680: movss    dword ptr [rsp + 0x30], xmm6
0000000180a8d686: shufps   xmm6, xmm6, 0xaa
0000000180a8d68a: movss    dword ptr [rsp + 0x38], xmm6
0000000180a8d690: movss    dword ptr [rsp + 0x34], xmm0
0000000180a8d696: mov      dword ptr [rsp + 0x3c], 0x3f800000
0000000180a8d69e: jbe      0x180a8d6a8
0000000180a8d6a0: mov      rcx, qword ptr [rax]
0000000180a8d6a3: call     0x180446d00
0000000180a8d6a8: mov      r8, qword ptr [rdi]
0000000180a8d6ab: lea      rdx, [rsp + 0x30]
0000000180a8d6b0: movaps   xmm0, xmmword ptr [rsp + 0x30]
0000000180a8d6b5: mov      rcx, rdi
0000000180a8d6b8: movdqa   xmmword ptr [rsp + 0x30], xmm0
0000000180a8d6be: mov      rax, qword ptr [r8 + 0x560]
0000000180a8d6c5: mov      r8, qword ptr [r8 + 0x568]
0000000180a8d6cc: call     rax
0000000180a8d6ce: jmp      0x180a8d9ab
0000000180a8d6d3: mov      rdx, rbx
0000000180a8d6d6: call     0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
0000000180a8d6db: jmp      0x180a8d9ab
0000000180a8d6e0: mov      rdx, qword ptr [rip + 0x7eca479] ; GenericMethodInfo 282794 @0x188957b60
0000000180a8d6e7: mov      rcx, rbx
0000000180a8d6ea: call     0x18536e540
0000000180a8d6ef: mov      rdi, rax
0000000180a8d6f2: test     rax, rax
0000000180a8d6f5: je       0x180a8d9fa
0000000180a8d6fb: cmp      byte ptr [rip + 0x823f0ee], 0
0000000180a8d702: movdqa   xmm6, xmmword ptr [rip + 0x63b24e6]
0000000180a8d70a: jbe      0x180a8d714
0000000180a8d70c: mov      rcx, qword ptr [rax]
0000000180a8d70f: call     0x180446d00
0000000180a8d714: mov      r8, qword ptr [rdi]
0000000180a8d717: lea      rdx, [rsp + 0x30]
0000000180a8d71c: mov      rcx, rdi
0000000180a8d71f: movdqa   xmmword ptr [rsp + 0x30], xmm6
0000000180a8d725: mov      rax, qword ptr [r8 + 0x560]
0000000180a8d72c: mov      r8, qword ptr [r8 + 0x568]
0000000180a8d733: call     rax
0000000180a8d735: mov      rcx, qword ptr [rip + 0x7ea1be4] ; TypeInfo DG.Tweening.DOTween @0x18892f320
0000000180a8d73c: cmp      dword ptr [rcx + 0xe0], 0
0000000180a8d743: jne      0x180a8d74a
0000000180a8d745: call     0x18048c140
0000000180a8d74a: xor      ecx, ecx
0000000180a8d74c: call     0x18424e070
0000000180a8d751: mov      r14, rax
0000000180a8d754: mov      rax, qword ptr [rip + 0x7e5997d] ; TypeInfo Torappu.Battle.Enemy.States.DisappearState.<>c @0x1888e70d8
0000000180a8d75b: cmp      dword ptr [rax + 0xe0], 0
0000000180a8d762: jne      0x180a8d773
0000000180a8d764: mov      rcx, rax
0000000180a8d767: call     0x18048c140
0000000180a8d76c: mov      rax, qword ptr [rip + 0x7e59965] ; TypeInfo Torappu.Battle.Enemy.States.DisappearState.<>c @0x1888e70d8
0000000180a8d773: mov      rcx, qword ptr [rax + 0xb8]
0000000180a8d77a: mov      rdi, qword ptr [rcx + 0x18]
0000000180a8d77e: test     rdi, rdi
0000000180a8d781: jne      0x180a8d7fd
0000000180a8d783: cmp      dword ptr [rax + 0xe0], edi
0000000180a8d789: jne      0x180a8d79a
0000000180a8d78b: mov      rcx, rax
0000000180a8d78e: call     0x18048c140
0000000180a8d793: mov      rax, qword ptr [rip + 0x7e5993e] ; TypeInfo Torappu.Battle.Enemy.States.DisappearState.<>c @0x1888e70d8
0000000180a8d79a: mov      rax, qword ptr [rax + 0xb8]
0000000180a8d7a1: mov      rcx, qword ptr [rip + 0x7ee3e40] ; TypeInfo type(0x15, data=0x188b374d0) @0x1889715e8
0000000180a8d7a8: mov      rbp, qword ptr [rax]
0000000180a8d7ab: call     0x18045cfe0
0000000180a8d7b0: mov      rdi, rax
0000000180a8d7b3: test     rax, rax
0000000180a8d7b6: je       0x180a8d9fa
0000000180a8d7bc: mov      r8, qword ptr [rip + 0x7d916ed] ; MethodInfo Torappu.Battle.Enemy.States.DisappearState.<>c.<_DoAppear>b__22_0 [76791] @0x18881eeb0
0000000180a8d7c3: xor      r9d, r9d
0000000180a8d7c6: mov      rdx, rbp
0000000180a8d7c9: mov      rcx, rax
0000000180a8d7cc: call     0x184918520
0000000180a8d7d1: mov      rax, qword ptr [rip + 0x7e59900] ; TypeInfo Torappu.Battle.Enemy.States.DisappearState.<>c @0x1888e70d8
0000000180a8d7d8: mov      rdx, rdi
0000000180a8d7db: mov      rcx, qword ptr [rax + 0xb8]
0000000180a8d7e2: mov      qword ptr [rcx + 0x18], rdi
0000000180a8d7e6: mov      rax, qword ptr [rip + 0x7e598eb] ; TypeInfo Torappu.Battle.Enemy.States.DisappearState.<>c @0x1888e70d8
0000000180a8d7ed: mov      rcx, qword ptr [rax + 0xb8]
0000000180a8d7f4: add      rcx, 0x18
0000000180a8d7f8: call     0x18048b9e0
0000000180a8d7fd: mov      rcx, qword ptr [rip + 0x7ee58e4] ; TypeInfo type(0x15, data=0x188b3d8f0) @0x1889730e8
0000000180a8d804: call     0x18045cfe0
0000000180a8d809: mov      rbp, rax
0000000180a8d80c: test     rax, rax
0000000180a8d80f: je       0x180a8d9fa
0000000180a8d815: mov      r8, qword ptr [rip + 0x7d92414] ; MethodInfo Torappu.Battle.Enemy.States.DisappearState.<>c__DisplayClass22_0.<_DoAppear>b__1 [76800] @0x18881fc30
0000000180a8d81c: xor      r9d, r9d
0000000180a8d81f: mov      rdx, rsi
0000000180a8d822: mov      rcx, rax
0000000180a8d825: call     0x18198efc0 ; BitBenderGames.AbstractTouchInputController.InputLongTapProgress..ctor [21694]
0000000180a8d82a: mov      rcx, qword ptr [rip + 0x7ea1aef] ; TypeInfo DG.Tweening.DOTween @0x18892f320
0000000180a8d831: cmp      dword ptr [rcx + 0xe0], 0
0000000180a8d838: jne      0x180a8d83f
0000000180a8d83a: call     0x18048c140
0000000180a8d83f: movss    xmm6, dword ptr [rip + 0x63b44b5]
0000000180a8d847: mov      rdx, rbp
0000000180a8d84a: movss    xmm2, dword ptr [rip + 0x63b238e]
0000000180a8d852: movaps   xmm3, xmm6
0000000180a8d855: mov      rcx, rdi
0000000180a8d858: mov      qword ptr [rsp + 0x20], 0
0000000180a8d861: call     0x18424f2c0
0000000180a8d866: xor      r8d, r8d
0000000180a8d869: mov      rdx, rax
0000000180a8d86c: mov      rcx, r14
0000000180a8d86f: call     0x184262620
0000000180a8d874: mov      r14, rax
0000000180a8d877: mov      rax, qword ptr [rip + 0x7e5985a] ; TypeInfo Torappu.Battle.Enemy.States.DisappearState.<>c @0x1888e70d8
0000000180a8d87e: cmp      dword ptr [rax + 0xe0], 0
0000000180a8d885: jne      0x180a8d896
0000000180a8d887: mov      rcx, rax
0000000180a8d88a: call     0x18048c140
0000000180a8d88f: mov      rax, qword ptr [rip + 0x7e59842] ; TypeInfo Torappu.Battle.Enemy.States.DisappearState.<>c @0x1888e70d8
0000000180a8d896: mov      rcx, qword ptr [rax + 0xb8]
0000000180a8d89d: mov      rdi, qword ptr [rcx + 0x20]
0000000180a8d8a1: test     rdi, rdi
0000000180a8d8a4: jne      0x180a8d920
0000000180a8d8a6: cmp      dword ptr [rax + 0xe0], edi
0000000180a8d8ac: jne      0x180a8d8bd
0000000180a8d8ae: mov      rcx, rax
0000000180a8d8b1: call     0x18048c140
0000000180a8d8b6: mov      rax, qword ptr [rip + 0x7e5981b] ; TypeInfo Torappu.Battle.Enemy.States.DisappearState.<>c @0x1888e70d8
0000000180a8d8bd: mov      rax, qword ptr [rax + 0xb8]
0000000180a8d8c4: mov      rcx, qword ptr [rip + 0x7ee3d1d] ; TypeInfo type(0x15, data=0x188b374d0) @0x1889715e8
0000000180a8d8cb: mov      rbp, qword ptr [rax]
0000000180a8d8ce: call     0x18045cfe0
0000000180a8d8d3: mov      rdi, rax
0000000180a8d8d6: test     rax, rax
0000000180a8d8d9: je       0x180a8d9fa
0000000180a8d8df: mov      r8, qword ptr [rip + 0x7d9180a] ; MethodInfo Torappu.Battle.Enemy.States.DisappearState.<>c.<_DoAppear>b__22_2 [76792] @0x18881f0f0
0000000180a8d8e6: xor      r9d, r9d
0000000180a8d8e9: mov      rdx, rbp
0000000180a8d8ec: mov      rcx, rax
0000000180a8d8ef: call     0x184918520
0000000180a8d8f4: mov      rax, qword ptr [rip + 0x7e597dd] ; TypeInfo Torappu.Battle.Enemy.States.DisappearState.<>c @0x1888e70d8
0000000180a8d8fb: mov      rdx, rdi
0000000180a8d8fe: mov      rcx, qword ptr [rax + 0xb8]
0000000180a8d905: mov      qword ptr [rcx + 0x20], rdi
0000000180a8d909: mov      rax, qword ptr [rip + 0x7e597c8] ; TypeInfo Torappu.Battle.Enemy.States.DisappearState.<>c @0x1888e70d8
0000000180a8d910: mov      rcx, qword ptr [rax + 0xb8]
0000000180a8d917: add      rcx, 0x20
0000000180a8d91b: call     0x18048b9e0
0000000180a8d920: mov      rcx, qword ptr [rip + 0x7ee57c1] ; TypeInfo type(0x15, data=0x188b3d8f0) @0x1889730e8
0000000180a8d927: call     0x18045cfe0
0000000180a8d92c: mov      rbp, rax
0000000180a8d92f: test     rax, rax
0000000180a8d932: je       0x180a8d9fa
0000000180a8d938: mov      r8, qword ptr [rip + 0x7d92531] ; MethodInfo Torappu.Battle.Enemy.States.DisappearState.<>c__DisplayClass22_0.<_DoAppear>b__3 [76801] @0x18881fe70
0000000180a8d93f: xor      r9d, r9d
0000000180a8d942: mov      rdx, rsi
0000000180a8d945: mov      rcx, rax
0000000180a8d948: call     0x18198efc0 ; BitBenderGames.AbstractTouchInputController.InputLongTapProgress..ctor [21694]
0000000180a8d94d: mov      rcx, qword ptr [rip + 0x7ea19cc] ; TypeInfo DG.Tweening.DOTween @0x18892f320
0000000180a8d954: cmp      dword ptr [rcx + 0xe0], 0
0000000180a8d95b: jne      0x180a8d962
0000000180a8d95d: call     0x18048c140
0000000180a8d962: movss    xmm2, dword ptr [rip + 0x63b2276]
0000000180a8d96a: movaps   xmm3, xmm6
0000000180a8d96d: mov      rdx, rbp
0000000180a8d970: mov      qword ptr [rsp + 0x20], 0
0000000180a8d979: mov      rcx, rdi
0000000180a8d97c: call     0x18424f2c0
0000000180a8d981: xor      r8d, r8d
0000000180a8d984: mov      rdx, rax
0000000180a8d987: mov      rcx, r14
0000000180a8d98a: call     0x184262620
0000000180a8d98f: mov      r8, qword ptr [rip + 0x7d86f4a] ; GenericMethodInfo 301116 @0x1888148e0
0000000180a8d996: mov      rdx, rbx
0000000180a8d999: mov      rcx, rax
0000000180a8d99c: call     0x1845f1320
0000000180a8d9a1: xor      edx, edx
0000000180a8d9a3: mov      rcx, rax
0000000180a8d9a6: call     0x180ae0a10 ; Torappu.Battle.BattleUtil.Deprecated_PlayTweenInBattle [78250]
0000000180a8d9ab: mov      rdx, qword ptr [rip + 0x7eca1ae] ; GenericMethodInfo 282794 @0x188957b60
0000000180a8d9b2: mov      rcx, rbx
0000000180a8d9b5: call     0x18536e540
0000000180a8d9ba: test     rax, rax
0000000180a8d9bd: je       0x180a8d9fa
0000000180a8d9bf: xor      r8d, r8d
0000000180a8d9c2: xor      edx, edx
0000000180a8d9c4: mov      rcx, rax
0000000180a8d9c7: mov      r14, qword ptr [rsp + 0x78]
0000000180a8d9cc: mov      rdi, qword ptr [rsp + 0x70]
0000000180a8d9d1: mov      rbp, qword ptr [rsp + 0x60]
0000000180a8d9d6: movaps   xmm6, xmmword ptr [rsp + 0x40]
0000000180a8d9db: mov      rsi, qword ptr [rsp + 0x68]
0000000180a8d9e0: add      rsp, 0x50
0000000180a8d9e4: pop      rbx
0000000180a8d9e5: jmp      0x180a80f80 ; Torappu.Battle.Enemy.set_disableAppearTweenColor [76279]
0000000180a8d9ea: xor      r8d, r8d
0000000180a8d9ed: mov      rdx, rbx
0000000180a8d9f0: add      rsp, 0x50
0000000180a8d9f4: pop      rbx
0000000180a8d9f5: jmp      0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
0000000180a8d9fa: call     0x18048c0b0
0000000180a8d9ff: int3     