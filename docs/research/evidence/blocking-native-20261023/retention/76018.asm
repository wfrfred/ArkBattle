; Torappu.Battle.Character.RevalidateBlockees metadata=76018 token=0x60128f3 VA=0x180a31150 RVA=0xa31150 size=0x2b0
0000000180a31150: mov      qword ptr [rsp + 8], rbx
0000000180a31155: mov      qword ptr [rsp + 0x10], rsi
0000000180a3115a: push     rdi
0000000180a3115b: sub      rsp, 0x60
0000000180a3115f: mov      rsi, rcx
0000000180a31162: cmp      byte ptr [rip + 0x82614c3], 0
0000000180a31169: jne      0x180a311de
0000000180a3116b: lea      rcx, [rip + 0x7e3b0f6] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a31172: call     0x18048bf00
0000000180a31177: lea      rcx, [rip + 0x7e97f92] ; GenericMethodInfo 287958 @0x1888c9110
0000000180a3117e: call     0x18048bf00
0000000180a31183: lea      rcx, [rip + 0x7e07ef6] ; GenericMethodInfo 257251 @0x188839080
0000000180a3118a: call     0x18048bf00
0000000180a3118f: lea      rcx, [rip + 0x7e0812a] ; GenericMethodInfo 257252 @0x1888392c0
0000000180a31196: call     0x18048bf00
0000000180a3119b: lea      rcx, [rip + 0x7e08356] ; GenericMethodInfo 257253 @0x1888394f8
0000000180a311a2: call     0x18048bf00
0000000180a311a7: lea      rcx, [rip + 0x7ef39aa] ; GenericMethodInfo 271393 @0x188924b58
0000000180a311ae: call     0x18048bf00
0000000180a311b3: lea      rcx, [rip + 0x7ef2e66] ; GenericMethodInfo 271388 @0x188924020
0000000180a311ba: call     0x18048bf00
0000000180a311bf: lea      rcx, [rip + 0x7e3745a] ; TypeInfo type(0x15, data=0x1889ec260) @0x188868620
0000000180a311c6: call     0x18048bf00
0000000180a311cb: lea      rcx, [rip + 0x7f01b16] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a311d2: call     0x18048bf00
0000000180a311d7: mov      byte ptr [rip + 0x826144e], 1
0000000180a311de: mov      rax, qword ptr [rip + 0x7e3b083] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a311e5: cmp      dword ptr [rax + 0xe0], 0
0000000180a311ec: jne      0x180a311fd
0000000180a311ee: mov      rcx, rax
0000000180a311f1: call     0x18048c140
0000000180a311f6: mov      rax, qword ptr [rip + 0x7e3b06b] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a311fd: mov      rax, qword ptr [rax + 0xb8]
0000000180a31204: mov      rcx, qword ptr [rax + 0x650]
0000000180a3120b: test     rcx, rcx
0000000180a3120e: jne      0x180a313c1
0000000180a31214: xor      edx, edx
0000000180a31216: mov      rcx, rsi
0000000180a31219: call     0x180a39480 ; Torappu.Battle.Character.get_blockMode [75898]
0000000180a3121e: cmp      eax, 1
0000000180a31221: jne      0x180a313cc
0000000180a31227: cmp      byte ptr [rip + 0x8261378], 0
0000000180a3122e: jne      0x180a31243
0000000180a31230: lea      rcx, [rip + 0x7e3b031] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a31237: call     0x18048bf00
0000000180a3123c: mov      byte ptr [rip + 0x8261363], 1
0000000180a31243: mov      rax, qword ptr [rip + 0x7e3b01e] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a3124a: cmp      dword ptr [rax + 0xe0], 0
0000000180a31251: jne      0x180a31262
0000000180a31253: mov      rcx, rax
0000000180a31256: call     0x18048c140
0000000180a3125b: mov      rax, qword ptr [rip + 0x7e3b006] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a31262: mov      rax, qword ptr [rax + 0xb8]
0000000180a31269: mov      rcx, qword ptr [rax + 0x220]
0000000180a31270: test     rcx, rcx
0000000180a31273: jne      0x180a3128e
0000000180a31275: mov      rcx, qword ptr [rsi + 0x510]
0000000180a3127c: test     rcx, rcx
0000000180a3127f: je       0x180a313ee
0000000180a31285: xor      edx, edx
0000000180a31287: call     0x180aa1950 ; Torappu.Battle.BlockManager.get_exposedRawList [77188]
0000000180a3128c: jmp      0x180a31299
0000000180a3128e: xor      r8d, r8d
0000000180a31291: mov      rdx, rsi
0000000180a31294: call     0x183396f70 ; XLua.DelegateBridge.__Gen_Delegate_Imp3656 [6311]
0000000180a31299: mov      rdi, rax
0000000180a3129c: mov      rcx, qword ptr [rip + 0x7e3737d] ; TypeInfo type(0x15, data=0x1889ec260) @0x188868620
0000000180a312a3: call     0x18045cfe0
0000000180a312a8: mov      rbx, rax
0000000180a312ab: test     rax, rax
0000000180a312ae: je       0x180a313ee
0000000180a312b4: mov      r8, qword ptr [rip + 0x7ef2d65] ; GenericMethodInfo 271388 @0x188924020
0000000180a312bb: mov      rdx, rdi
0000000180a312be: mov      rcx, rax
0000000180a312c1: call     0x184d1bb80
0000000180a312c6: mov      rdx, qword ptr [rip + 0x7e97e43] ; GenericMethodInfo 287958 @0x1888c9110
0000000180a312cd: mov      rcx, rbx
0000000180a312d0: call     0x1844afc00
0000000180a312d5: test     eax, eax
0000000180a312d7: jle      0x180a313cc
0000000180a312dd: mov      r8, qword ptr [rip + 0x7ef3874] ; GenericMethodInfo 271393 @0x188924b58
0000000180a312e4: mov      rdx, rbx
0000000180a312e7: lea      rcx, [rsp + 0x28]
0000000180a312ec: call     0x184aef040
0000000180a312f1: movups   xmm0, xmmword ptr [rsp + 0x28]
0000000180a312f6: movups   xmmword ptr [rsp + 0x40], xmm0
0000000180a312fb: movsd    xmm1, qword ptr [rsp + 0x38]
0000000180a31301: movsd    qword ptr [rsp + 0x50], xmm1
0000000180a31307: mov      qword ptr [rsp + 0x28], 0
0000000180a31310: lea      rbx, [rsp + 0x40]
0000000180a31315: mov      qword ptr [rsp + 0x30], rbx
0000000180a3131a: nop      word ptr [rax + rax]
0000000180a31320: mov      rdx, qword ptr [rip + 0x7e07f99] ; GenericMethodInfo 257252 @0x1888392c0
0000000180a31327: lea      rcx, [rsp + 0x40]
0000000180a3132c: call     0x185a610f0
0000000180a31331: test     al, al
0000000180a31333: je       0x180a31393
0000000180a31335: mov      rdi, qword ptr [rsp + 0x50]
0000000180a3133a: mov      rcx, qword ptr [rip + 0x7f019a7] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a31341: cmp      dword ptr [rcx + 0xe0], 0
0000000180a31348: jne      0x180a3134f
0000000180a3134a: call     0x18048c140
0000000180a3134f: xor      r8d, r8d
0000000180a31352: xor      edx, edx
0000000180a31354: mov      rcx, rdi
0000000180a31357: call     0x186b638d0
0000000180a3135c: test     al, al
0000000180a3135e: jne      0x180a31377
0000000180a31360: test     rdi, rdi
0000000180a31363: je       0x180a313dc
0000000180a31365: xor      r8d, r8d
0000000180a31368: mov      rdx, rsi
0000000180a3136b: mov      rcx, rdi
0000000180a3136e: call     0x180a6bb70 ; Torappu.Battle.Enemy.CheckBlockable [76428]
0000000180a31373: test     al, al
0000000180a31375: jne      0x180a31320
0000000180a31377: mov      rcx, qword ptr [rsi + 0x510]
0000000180a3137e: test     rcx, rcx
0000000180a31381: je       0x180a313e2
0000000180a31383: xor      r9d, r9d
0000000180a31386: mov      r8, rdi
0000000180a31389: mov      rdx, rsi
0000000180a3138c: call     0x180aa08a0 ; Torappu.Battle.BlockManager.RemoveBlockee [77193]
0000000180a31391: jmp      0x180a31320
0000000180a31393: mov      rdx, qword ptr [rip + 0x7e07ce6] ; GenericMethodInfo 257251 @0x188839080
0000000180a3139a: mov      rcx, rbx
0000000180a3139d: call     0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
0000000180a313a2: jmp      0x180a313cc
0000000180a313a4: mov      rdx, qword ptr [rip + 0x7e07cd5] ; GenericMethodInfo 257251 @0x188839080
0000000180a313ab: mov      rcx, qword ptr [rsp + 0x30]
0000000180a313b0: call     0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
0000000180a313b5: mov      rcx, qword ptr [rsp + 0x28]
0000000180a313ba: test     rcx, rcx
0000000180a313bd: jne      0x180a313e8
0000000180a313bf: jmp      0x180a313cc
0000000180a313c1: xor      r8d, r8d
0000000180a313c4: mov      rdx, rsi
0000000180a313c7: call     0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
0000000180a313cc: mov      rbx, qword ptr [rsp + 0x70]
0000000180a313d1: mov      rsi, qword ptr [rsp + 0x78]
0000000180a313d6: add      rsp, 0x60
0000000180a313da: pop      rdi
0000000180a313db: ret      
0000000180a313dc: call     0x18048c0b0
0000000180a313e1: nop      
0000000180a313e2: call     0x18048c0b0
0000000180a313e7: nop      
0000000180a313e8: call     0x180472d50
0000000180a313ed: int3     
0000000180a313ee: call     0x18048c0b0
0000000180a313f3: int3     
0000000180a313f4: int3     
0000000180a313f5: int3     
0000000180a313f6: int3     
0000000180a313f7: int3     
0000000180a313f8: int3     
0000000180a313f9: int3     
0000000180a313fa: int3     
0000000180a313fb: int3     
0000000180a313fc: int3     
0000000180a313fd: int3     
0000000180a313fe: int3     
0000000180a313ff: int3     