; Torappu.Battle.SeparateMoveController._CalculateSeparationForce metadata=72516 token=0x6011b45 VA=0x18094d5e0 RVA=0x94d5e0 size=0xab0
000000018094d5e0: mov      rax, rsp
000000018094d5e3: mov      qword ptr [rax + 8], rcx
000000018094d5e7: push     rbx
000000018094d5e8: push     rsi
000000018094d5e9: push     rdi
000000018094d5ea: push     r12
000000018094d5ec: push     r13
000000018094d5ee: push     r14
000000018094d5f0: push     r15
000000018094d5f2: sub      rsp, 0x170
000000018094d5f9: movaps   xmmword ptr [rax - 0x48], xmm6
000000018094d5fd: movaps   xmmword ptr [rax - 0x58], xmm7
000000018094d601: movaps   xmmword ptr [rax - 0x68], xmm8
000000018094d606: movaps   xmmword ptr [rax - 0x78], xmm9
000000018094d60b: movaps   xmmword ptr [rax - 0x88], xmm10
000000018094d613: movaps   xmmword ptr [rax - 0x98], xmm11
000000018094d61b: movaps   xmmword ptr [rax - 0xa8], xmm12
000000018094d623: mov      r13, rcx
000000018094d626: cmp      byte ptr [rip + 0x83445a4], 0
000000018094d62d: jne      0x18094d736
000000018094d633: lea      rcx, [rip + 0x7fda726] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
000000018094d63a: call     0x18048bf00
000000018094d63f: lea      rcx, [rip + 0x7ece06a] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
000000018094d646: call     0x18048bf00
000000018094d64b: lea      rcx, [rip + 0x7eef446] ; GenericMethodInfo 257274 @0x18883ca98
000000018094d652: call     0x18048bf00
000000018094d657: lea      rcx, [rip + 0x80191d2] ; GenericMethodInfo 256758 @0x188966830
000000018094d65e: call     0x18048bf00
000000018094d663: lea      rcx, [rip + 0x8019406] ; GenericMethodInfo 256759 @0x188966a70
000000018094d66a: call     0x18048bf00
000000018094d66f: lea      rcx, [rip + 0x7eef662] ; GenericMethodInfo 257275 @0x18883ccd8
000000018094d676: call     0x18048bf00
000000018094d67b: lea      rcx, [rip + 0x801962e] ; GenericMethodInfo 256760 @0x188966cb0
000000018094d682: call     0x18048bf00
000000018094d687: lea      rcx, [rip + 0x7eef882] ; GenericMethodInfo 257276 @0x18883cf10
000000018094d68e: call     0x18048bf00
000000018094d693: lea      rcx, [rip + 0x80075fe] ; TypeInfo System.IDisposable @0x188954c98
000000018094d69a: call     0x18048bf00
000000018094d69f: lea      rcx, [rip + 0x7edbd42] ; TypeInfo Torappu.Battle.IUseEnemyTrace @0x1888293e8
000000018094d6a6: call     0x18048bf00
000000018094d6ab: lea      rcx, [rip + 0x7f93ec6] ; GenericMethodInfo 268445 @0x1888e1578
000000018094d6b2: call     0x18048bf00
000000018094d6b7: lea      rcx, [rip + 0x7f9433a] ; GenericMethodInfo 268447 @0x1888e19f8
000000018094d6be: call     0x18048bf00
000000018094d6c3: lea      rcx, [rip + 0x7fea20e] ; GenericMethodInfo 271517 @0x1889378d8
000000018094d6ca: call     0x18048bf00
000000018094d6cf: lea      rcx, [rip + 0x7f94562] ; GenericMethodInfo 268448 @0x1888e1c38
000000018094d6d6: call     0x18048bf00
000000018094d6db: lea      rcx, [rip + 0x7f6f35e] ; TypeInfo Torappu.Battle.Map @0x1888bca40
000000018094d6e2: call     0x18048bf00
000000018094d6e7: lea      rcx, [rip + 0x7fe6cba] ; GenericMethodInfo 280369 @0x1889343a8
000000018094d6ee: call     0x18048bf00
000000018094d6f3: lea      rcx, [rip + 0x7fe75ae] ; GenericMethodInfo 280373 @0x188934ca8
000000018094d6fa: call     0x18048bf00
000000018094d6ff: lea      rcx, [rip + 0x7fe55e2] ; TypeInfo UnityEngine.Object @0x188932ce8
000000018094d706: call     0x18048bf00
000000018094d70b: lea      rcx, [rip + 0x7fea616] ; TypeInfo Torappu.Battle.SeparateMoveController @0x188937d28
000000018094d712: call     0x18048bf00
000000018094d717: lea      rcx, [rip + 0x7f861ea] ; GenericMethodInfo 281972 @0x1888d3908
000000018094d71e: call     0x18048bf00
000000018094d723: lea      rcx, [rip + 0x7fc389e] ; GenericMethodInfo 282409 @0x188910fc8
000000018094d72a: call     0x18048bf00
000000018094d72f: mov      byte ptr [rip + 0x834449b], 1
000000018094d736: mov      qword ptr [rsp + 0x20], 0
000000018094d73f: xor      r15d, r15d
000000018094d742: mov      qword ptr [rsp + 0x40], r15
000000018094d747: xorps    xmm0, xmm0
000000018094d74a: xor      eax, eax
000000018094d74c: movups   xmmword ptr [rsp + 0x58], xmm0
000000018094d751: mov      qword ptr [rsp + 0x68], rax
000000018094d756: xorps    xmm1, xmm1
000000018094d759: movups   xmmword ptr [rsp + 0xa0], xmm1
000000018094d761: movups   xmmword ptr [rsp + 0xb0], xmm1
000000018094d769: movups   xmmword ptr [rsp + 0xc0], xmm0
000000018094d771: mov      rax, qword ptr [rip + 0x7fea5b0] ; TypeInfo Torappu.Battle.SeparateMoveController @0x188937d28
000000018094d778: mov      rcx, qword ptr [rax + 0xb8]
000000018094d77f: mov      rcx, qword ptr [rcx + 8]
000000018094d783: test     rcx, rcx
000000018094d786: jne      0x18094dfe2
000000018094d78c: mov      rbx, qword ptr [r13 + 0x28]
000000018094d790: test     rbx, rbx
000000018094d793: je       0x18094e055
000000018094d799: mov      rax, qword ptr [rbx]
000000018094d79c: mov      ecx, dword ptr [rax + 0x11c]
000000018094d7a2: add      ecx, -0x4e
000000018094d7a5: cmp      ecx, 0x25
000000018094d7a8: ja       0x18094d7ec
000000018094d7aa: movsxd   rax, ecx
000000018094d7ad: lea      rdx, [rip - 0x94d7b4]
000000018094d7b4: movzx    eax, byte ptr [rdx + rax + 0x94e068]
000000018094d7bc: mov      ecx, dword ptr [rdx + rax*4 + 0x94e05c]
000000018094d7c3: add      rcx, rdx
000000018094d7c6: jmp      rcx
000000018094d7c8: xor      edx, edx
000000018094d7ca: mov      rcx, rbx
000000018094d7cd: call     0x180ad4250 ; Torappu.Battle.VisualObject.get_mapPosition [77866]
000000018094d7d2: jmp      0x18094d853
000000018094d7d4: xor      edx, edx
000000018094d7d6: mov      rcx, rbx
000000018094d7d9: call     0x1800149b0
000000018094d7de: jmp      0x18094d853
000000018094d7e0: xor      edx, edx
000000018094d7e2: mov      rcx, rbx
000000018094d7e5: call     0x1808b5d90 ; Torappu.Battle.MountPoint.get_mapPosition [71039]
000000018094d7ea: jmp      0x18094d853
000000018094d7ec: mov      rdi, qword ptr [rip + 0x801f0c5] ; TypeInfo Torappu.Battle.ILocatable @0x18896c8b8
000000018094d7f3: mov      rsi, qword ptr [rbx]
000000018094d7f6: cmp      byte ptr [rip + 0x837eff3], r15b
000000018094d7fd: je       0x18094d807
000000018094d7ff: mov      rcx, rsi
000000018094d802: call     0x180446d00
000000018094d807: movzx    ecx, r15w
000000018094d80b: movzx    edx, word ptr [rsi + 0x12e]
000000018094d812: cmp      r15w, dx
000000018094d816: jae      0x18094d838
000000018094d818: mov      r8, qword ptr [rsi + 0xb0]
000000018094d81f: nop      
000000018094d820: movzx    eax, cx
000000018094d823: add      rax, rax
000000018094d826: cmp      qword ptr [r8 + rax*8], rdi
000000018094d82a: je       0x18094d8db
000000018094d830: inc      cx
000000018094d833: cmp      cx, dx
000000018094d836: jb       0x18094d820
000000018094d838: xor      r8d, r8d
000000018094d83b: mov      rdx, rdi
000000018094d83e: mov      rcx, rbx
000000018094d841: call     0x180445cc0
000000018094d846: mov      r8, qword ptr [rax]
000000018094d849: mov      rdx, qword ptr [rax + 8]
000000018094d84d: mov      rcx, rbx
000000018094d850: call     r8
000000018094d853: mov      qword ptr [rsp + 0x1c0], rax
000000018094d85b: movss    xmm11, dword ptr [rsp + 0x1c0]
000000018094d865: movss    dword ptr [rsp + 0x1c8], xmm11
000000018094d86f: movss    xmm12, dword ptr [rsp + 0x1c4]
000000018094d879: movss    dword ptr [rsp + 0x1c0], xmm12
000000018094d883: cmp      byte ptr [rip + 0x8341d2b], r15b
000000018094d88a: jne      0x18094d89f
000000018094d88c: lea      rcx, [rip + 0x7edb32d] ; TypeInfo UnityEngine.Vector2 @0x188828bc0
000000018094d893: call     0x18048bf00
000000018094d898: mov      byte ptr [rip + 0x8341d16], 1
000000018094d89f: mov      rax, qword ptr [rip + 0x7edb31a] ; TypeInfo UnityEngine.Vector2 @0x188828bc0
000000018094d8a6: mov      rcx, qword ptr [rax + 0xb8]
000000018094d8ad: movss    xmm9, dword ptr [rcx]
000000018094d8b2: movss    xmm10, dword ptr [rcx + 4]
000000018094d8b8: movss    dword ptr [rsp + 0x20], xmm9
000000018094d8bf: movss    dword ptr [rsp + 0x24], xmm10
000000018094d8c6: mov      rdi, qword ptr [r13 + 0x28]
000000018094d8ca: mov      rdx, qword ptr [rip + 0x7ecdddf] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
000000018094d8d1: test     rdi, rdi
000000018094d8d4: jne      0x18094d8f6
000000018094d8d6: mov      rbx, r15
000000018094d8d9: jmp      0x18094d940
000000018094d8db: movzx    ecx, cx
000000018094d8de: add      rcx, rcx
000000018094d8e1: movsxd   rax, dword ptr [r8 + rcx*8 + 8]
000000018094d8e6: add      rax, 0x14
000000018094d8ea: shl      rax, 4
000000018094d8ee: add      rax, rsi
000000018094d8f1: jmp      0x18094d846
000000018094d8f6: mov      r8, qword ptr [rdi]
000000018094d8f9: cmp      byte ptr [rip + 0x837eef0], r15b
000000018094d900: jbe      0x18094d90e
000000018094d902: mov      rcx, r8
000000018094d905: call     0x1804463e0
000000018094d90a: test     al, al
000000018094d90c: jmp      0x18094d939
000000018094d90e: movzx    eax, byte ptr [rdx + 0x130]
000000018094d915: cmp      byte ptr [r8 + 0x130], al
000000018094d91c: jb       0x18094d934
000000018094d91e: movzx    ecx, al
000000018094d921: mov      rax, qword ptr [r8 + 0xc8]
000000018094d928: cmp      qword ptr [rax + rcx*8 - 8], rdx
000000018094d92d: mov      eax, 1
000000018094d932: je       0x18094d937
000000018094d934: mov      eax, r15d
000000018094d937: test     eax, eax
000000018094d939: mov      rbx, r15
000000018094d93c: cmovne   rbx, rdi
000000018094d940: mov      r12, rbx
000000018094d943: mov      qword ptr [rsp + 0x70], rbx
000000018094d948: mov      rcx, qword ptr [rip + 0x7fe5399] ; TypeInfo UnityEngine.Object @0x188932ce8
000000018094d94f: cmp      dword ptr [rcx + 0xe0], r15d
000000018094d956: jne      0x18094d95d
000000018094d958: call     0x18048c140
000000018094d95d: xor      r8d, r8d
000000018094d960: xor      edx, edx
000000018094d962: mov      rcx, rbx
000000018094d965: call     0x186b638d0 ; UnityEngine.Object.op_Equality [282976]
000000018094d96a: test     al, al
000000018094d96c: jne      0x18094dfd3
000000018094d972: mov      rcx, qword ptr [r13 + 0x70]
000000018094d976: test     rcx, rcx
000000018094d979: je       0x18094e055
000000018094d97f: inc      dword ptr [rcx + 0x1c]
000000018094d982: mov      r8d, dword ptr [rcx + 0x18]
000000018094d986: mov      dword ptr [rcx + 0x18], r15d
000000018094d98a: test     r8d, r8d
000000018094d98d: jle      0x18094d99d
000000018094d98f: xor      r9d, r9d
000000018094d992: xor      edx, edx
000000018094d994: mov      rcx, qword ptr [rcx + 0x10]
000000018094d998: call     0x185ee99a0
000000018094d99d: mov      rcx, qword ptr [rip + 0x7fc3624] ; GenericMethodInfo 282409 @0x188910fc8
000000018094d9a4: call     0x185339460
000000018094d9a9: test     rax, rax
000000018094d9ac: je       0x18094e055
000000018094d9b2: xor      edx, edx
000000018094d9b4: mov      rcx, rax
000000018094d9b7: call     0x1867927a0
000000018094d9bc: test     al, al
000000018094d9be: je       0x18094dc80
000000018094d9c4: test     rbx, rbx
000000018094d9c7: je       0x18094e055
000000018094d9cd: xor      r8d, r8d
000000018094d9d0: mov      rdx, rbx
000000018094d9d3: lea      rcx, [rsp + 0x30]
000000018094d9d8: call     0x180ad4360 ; Torappu.Battle.VisualObject.get_worldPosition [77868]
000000018094d9dd: movsd    xmm1, qword ptr [rax]
000000018094d9e1: mov      eax, dword ptr [rax + 8]
000000018094d9e4: mov      dword ptr [rsp + 0x38], eax
000000018094d9e8: movss    dword ptr [r13 + 0x78], xmm1
000000018094d9ee: movaps   xmm0, xmm1
000000018094d9f1: shufps   xmm0, xmm0, 0x55
000000018094d9f5: movsd    qword ptr [rsp + 0x30], xmm1
000000018094d9fb: movss    dword ptr [r13 + 0x7c], xmm0
000000018094da01: mov      eax, dword ptr [r13 + 0x64]
000000018094da05: mov      dword ptr [r13 + 0x80], eax
000000018094da0c: mov      rcx, qword ptr [rip + 0x7fda34d] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
000000018094da13: cmp      dword ptr [rcx + 0xe0], r15d
000000018094da1a: jne      0x18094da21
000000018094da1c: call     0x18048c140
000000018094da21: xor      ecx, ecx
000000018094da23: call     0x18061b8d0 ; Torappu.Battle.BattleController.AllocateEntityList_DISPOSE [64473]
000000018094da28: mov      qword ptr [rsp + 0x40], rax
000000018094da2d: mov      qword ptr [rsp + 0x48], r15
000000018094da32: lea      rbx, [rsp + 0x40]
000000018094da37: mov      qword ptr [rsp + 0x50], rbx
000000018094da3c: mov      rcx, qword ptr [rip + 0x7f85ec5] ; GenericMethodInfo 281972 @0x1888d3908
000000018094da43: call     0x185337c50
000000018094da48: test     rax, rax
000000018094da4b: je       0x18094e043
000000018094da51: xor      edx, edx
000000018094da53: mov      rcx, rax
000000018094da56: call     0x180643410 ; Torappu.Battle.BattleController.get_physicManager [64526]
000000018094da5b: test     rax, rax
000000018094da5e: je       0x18094e03e
000000018094da64: movsd    xmm0, qword ptr [r13 + 0x78]
000000018094da6a: movsd    qword ptr [rsp + 0x30], xmm0
000000018094da70: mov      ecx, dword ptr [r13 + 0x80]
000000018094da77: mov      dword ptr [rsp + 0x38], ecx
000000018094da7b: xor      r9d, r9d
000000018094da7e: mov      r8, qword ptr [rsp + 0x40]
000000018094da83: lea      rdx, [rsp + 0x30]
000000018094da88: mov      rcx, rax
000000018094da8b: call     0x180b231c0 ; Torappu.Battle.TPhysic2D.TPhysicManager.QueryEnemy [78700]
000000018094da90: mov      rdx, qword ptr [rsp + 0x40]
000000018094da95: test     rdx, rdx
000000018094da98: je       0x18094e039
000000018094da9e: mov      r8, qword ptr [rip + 0x7fe9e33] ; GenericMethodInfo 271517 @0x1889378d8
000000018094daa5: lea      rcx, [rsp + 0x80]
000000018094daad: call     0x184aef040
000000018094dab2: movups   xmm0, xmmword ptr [rsp + 0x80]
000000018094daba: movups   xmmword ptr [rsp + 0x58], xmm0
000000018094dabf: movsd    xmm1, qword ptr [rsp + 0x90]
000000018094dac8: movsd    qword ptr [rsp + 0x68], xmm1
000000018094dace: mov      qword ptr [rsp + 0x30], r15
000000018094dad3: lea      rdi, [rsp + 0x58]
000000018094dad8: mov      qword ptr [rsp + 0x38], rdi
000000018094dadd: nop      dword ptr [rax]
000000018094dae0: mov      rdx, qword ptr [rip + 0x7eef1f1] ; GenericMethodInfo 257275 @0x18883ccd8
000000018094dae7: lea      rcx, [rsp + 0x58]
000000018094daec: call     0x185a610f0
000000018094daf1: test     al, al
000000018094daf3: je       0x18094dbd4
000000018094daf9: mov      r14, qword ptr [rsp + 0x68]
000000018094dafe: mov      rdx, qword ptr [rip + 0x7ecdbab] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
000000018094db05: test     r14, r14
000000018094db08: jne      0x18094db0f
000000018094db0a: mov      rsi, r15
000000018094db0d: jmp      0x18094db59
000000018094db0f: mov      r8, qword ptr [r14]
000000018094db12: cmp      byte ptr [rip + 0x837ecd7], 0
000000018094db19: jbe      0x18094db27
000000018094db1b: mov      rcx, r8
000000018094db1e: call     0x1804463e0
000000018094db23: test     al, al
000000018094db25: jmp      0x18094db52
000000018094db27: movzx    eax, byte ptr [rdx + 0x130]
000000018094db2e: cmp      byte ptr [r8 + 0x130], al
000000018094db35: jb       0x18094db4d
000000018094db37: movzx    ecx, al
000000018094db3a: mov      rax, qword ptr [r8 + 0xc8]
000000018094db41: cmp      qword ptr [rax + rcx*8 - 8], rdx
000000018094db46: mov      eax, 1
000000018094db4b: je       0x18094db50
000000018094db4d: mov      eax, r15d
000000018094db50: test     eax, eax
000000018094db52: mov      rsi, r15
000000018094db55: cmovne   rsi, r14
000000018094db59: mov      rcx, qword ptr [rip + 0x7fe5188] ; TypeInfo UnityEngine.Object @0x188932ce8
000000018094db60: cmp      dword ptr [rcx + 0xe0], 0
000000018094db67: jne      0x18094db6e
000000018094db69: call     0x18048c140
000000018094db6e: xor      r8d, r8d
000000018094db71: xor      edx, edx
000000018094db73: mov      rcx, rsi
000000018094db76: call     0x186b638d0 ; UnityEngine.Object.op_Equality [282976]
000000018094db7b: test     al, al
000000018094db7d: jne      0x18094dae0
000000018094db83: mov      r14, qword ptr [r13 + 0x70]
000000018094db87: mov      r8, qword ptr [rip + 0x7fe711a] ; GenericMethodInfo 280373 @0x188934ca8
000000018094db8e: mov      rdx, rsi
000000018094db91: lea      rcx, [rsp + 0xf0]
000000018094db99: call     0x18515a130
000000018094db9e: test     r14, r14
000000018094dba1: je       0x18094e027
000000018094dba7: movaps   xmm0, xmmword ptr [rsp + 0xf0]
000000018094dbaf: movdqa   xmmword ptr [rsp + 0x80], xmm0
000000018094dbb8: mov      r8, qword ptr [rip + 0x7f939b9] ; GenericMethodInfo 268445 @0x1888e1578
000000018094dbbf: lea      rdx, [rsp + 0x80]
000000018094dbc7: mov      rcx, r14
000000018094dbca: call     0x1800153c0
000000018094dbcf: jmp      0x18094dae0
000000018094dbd4: mov      rdx, qword ptr [rip + 0x7eeeebd] ; GenericMethodInfo 257274 @0x18883ca98
000000018094dbdb: mov      rcx, rdi
000000018094dbde: call     0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
000000018094dbe3: nop      
000000018094dbe4: cmp      qword ptr [rbx], 0
000000018094dbe8: je       0x18094dbfb
000000018094dbea: xor      ecx, ecx
000000018094dbec: mov      r8, qword ptr [rbx]
000000018094dbef: mov      rdx, qword ptr [rip + 0x80070a2] ; TypeInfo System.IDisposable @0x188954c98
000000018094dbf6: call     0x180005310
000000018094dbfb: jmp      0x18094dcda
000000018094dc00: mov      rdx, qword ptr [rip + 0x7eeee91] ; GenericMethodInfo 257274 @0x18883ca98
000000018094dc07: mov      rcx, qword ptr [rsp + 0x38]
000000018094dc0c: call     0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
000000018094dc11: mov      rcx, qword ptr [rsp + 0x30]
000000018094dc16: test     rcx, rcx
000000018094dc19: jne      0x18094e02d
000000018094dc1f: mov      r8, qword ptr [rsp + 0x50]
000000018094dc24: cmp      qword ptr [r8], 0
000000018094dc28: je       0x18094dc3b
000000018094dc2a: xor      ecx, ecx
000000018094dc2c: mov      r8, qword ptr [r8]
000000018094dc2f: mov      rdx, qword ptr [rip + 0x8007062] ; TypeInfo System.IDisposable @0x188954c98
000000018094dc36: call     0x180005310
000000018094dc3b: mov      rcx, qword ptr [rsp + 0x48]
000000018094dc40: test     rcx, rcx
000000018094dc43: jne      0x18094e033
000000018094dc49: xor      r15d, r15d
000000018094dc4c: mov      r13, qword ptr [rsp + 0x1b0]
000000018094dc54: movss    xmm10, dword ptr [rsp + 0x24]
000000018094dc5b: movss    xmm9, dword ptr [rsp + 0x20]
000000018094dc62: mov      r12, qword ptr [rsp + 0x70]
000000018094dc67: movss    xmm12, dword ptr [rsp + 0x1c0]
000000018094dc71: movss    xmm11, dword ptr [rsp + 0x1c8]
000000018094dc7b: mov      rbx, r12
000000018094dc7e: jmp      0x18094dc89
000000018094dc80: test     rbx, rbx
000000018094dc83: je       0x18094e055
000000018094dc89: cmp      byte ptr [rip + 0x837eb60], 0
000000018094dc90: jbe      0x18094dc9a
000000018094dc92: mov      rcx, qword ptr [rbx]
000000018094dc95: call     0x180446d00
000000018094dc9a: mov      rdx, qword ptr [rbx]
000000018094dc9d: mov      rax, qword ptr [rdx + 0x480]
000000018094dca4: mov      rdx, qword ptr [rdx + 0x488]
000000018094dcab: mov      rcx, r12
000000018094dcae: call     rax
000000018094dcb0: mov      rbx, rax
000000018094dcb3: mov      rdi, qword ptr [r13 + 0x70]
000000018094dcb7: mov      rcx, qword ptr [rip + 0x7f6ed82] ; TypeInfo Torappu.Battle.Map @0x1888bca40
000000018094dcbe: cmp      dword ptr [rcx + 0xe0], 0
000000018094dcc5: jne      0x18094dccc
000000018094dcc7: call     0x18048c140
000000018094dccc: xor      r8d, r8d
000000018094dccf: mov      rdx, rdi
000000018094dcd2: mov      rcx, rbx
000000018094dcd5: call     0x18087bda0 ; Torappu.Battle.Map.GetAdjacentTilesEnemies [70087]
000000018094dcda: mov      rdx, qword ptr [r13 + 0x70]
000000018094dcde: test     rdx, rdx
000000018094dce1: je       0x18094e055
000000018094dce7: mov      r8, qword ptr [rip + 0x7f93f4a] ; GenericMethodInfo 268448 @0x1888e1c38
000000018094dcee: lea      rcx, [rsp + 0x80]
000000018094dcf6: call     0x184aca6f0
000000018094dcfb: movups   xmm0, xmmword ptr [rsp + 0x80]
000000018094dd03: movups   xmmword ptr [rsp + 0xa0], xmm0
000000018094dd0b: movups   xmm1, xmmword ptr [rsp + 0x90]
000000018094dd13: movups   xmmword ptr [rsp + 0xb0], xmm1
000000018094dd1b: mov      qword ptr [rsp + 0x48], r15
000000018094dd20: lea      rbx, [rsp + 0xa0]
000000018094dd28: mov      qword ptr [rsp + 0x50], rbx
000000018094dd2d: movdqa   xmm8, xmmword ptr [rip + 0x64f20ba]
000000018094dd36: nop      word ptr [rax + rax]
000000018094dd40: mov      rdx, qword ptr [rip + 0x8018d29] ; GenericMethodInfo 256759 @0x188966a70
000000018094dd47: lea      rcx, [rsp + 0xa0]
000000018094dd4f: call     0x185a4d210
000000018094dd54: test     al, al
000000018094dd56: je       0x18094de85
000000018094dd5c: movups   xmm0, xmmword ptr [rsp + 0xb0]
000000018094dd64: movups   xmmword ptr [rsp + 0xc0], xmm0
000000018094dd6c: mov      rdx, qword ptr [rip + 0x7fe6635] ; GenericMethodInfo 280369 @0x1889343a8
000000018094dd73: lea      rcx, [rsp + 0xc0]
000000018094dd7b: call     0x185159d80
000000018094dd80: mov      rdi, rax
000000018094dd83: test     rax, rax
000000018094dd86: je       0x18094e049
000000018094dd8c: xor      edx, edx
000000018094dd8e: mov      rcx, rax
000000018094dd91: call     0x180ad43b0 ; Torappu.Battle.VisualObject.get_x [77872]
000000018094dd96: movaps   xmm6, xmm0
000000018094dd99: subss    xmm6, xmm11
000000018094dd9e: xor      edx, edx
000000018094dda0: mov      rcx, rdi
000000018094dda3: call     0x180ad43e0 ; Torappu.Battle.VisualObject.get_y [77873]
000000018094dda8: movaps   xmm7, xmm0
000000018094ddab: subss    xmm7, xmm12
000000018094ddb0: movaps   xmm0, xmm7
000000018094ddb3: andps    xmm0, xmm8
000000018094ddb7: movaps   xmm1, xmm6
000000018094ddba: andps    xmm1, xmm8
000000018094ddbe: comiss   xmm1, dword ptr [r13 + 0x64]
000000018094ddc3: jae      0x18094dd40
000000018094ddc9: comiss   xmm0, dword ptr [r13 + 0x64]
000000018094ddce: jae      0x18094dd40
000000018094ddd4: mov      ecx, 0x9e
000000018094ddd9: mov      rdx, rdi
000000018094dddc: call     0x180005610
000000018094dde1: test     al, al
000000018094dde3: je       0x18094dd40
000000018094dde9: mov      rcx, qword ptr [rip + 0x7fe4ef8] ; TypeInfo UnityEngine.Object @0x188932ce8
000000018094ddf0: cmp      dword ptr [rcx + 0xe0], 0
000000018094ddf7: jne      0x18094ddfe
000000018094ddf9: call     0x18048c140
000000018094ddfe: xor      r8d, r8d
000000018094de01: mov      rdx, rdi
000000018094de04: mov      rcx, r12
000000018094de07: call     0x186b638d0 ; UnityEngine.Object.op_Equality [282976]
000000018094de0c: test     al, al
000000018094de0e: jne      0x18094dd40
000000018094de14: mov      rdx, qword ptr [rip + 0x7edb5cd] ; TypeInfo Torappu.Battle.IUseEnemyTrace @0x1888293e8
000000018094de1b: mov      rcx, rdi
000000018094de1e: call     0x18048b9f0
000000018094de23: test     rax, rax
000000018094de26: je       0x18094de3a
000000018094de28: xor      edx, edx
000000018094de2a: mov      rcx, rax
000000018094de2d: call     0x1809422d0
000000018094de32: test     al, al
000000018094de34: jne      0x18094dd40
000000018094de3a: movss    xmm2, dword ptr [r13 + 0x68]
000000018094de40: movaps   xmm1, xmm7
000000018094de43: andps    xmm1, xmm8
000000018094de47: movaps   xmm0, xmm6
000000018094de4a: andps    xmm0, xmm8
000000018094de4e: addss    xmm1, xmm0
000000018094de52: comiss   xmm1, xmm2
000000018094de55: ja       0x18094de5a
000000018094de57: movaps   xmm1, xmm2
000000018094de5a: divss    xmm6, xmm1
000000018094de5e: addss    xmm6, xmm9
000000018094de63: movaps   xmm9, xmm6
000000018094de67: movss    dword ptr [rsp + 0x20], xmm6
000000018094de6d: divss    xmm7, xmm1
000000018094de71: addss    xmm7, xmm10
000000018094de76: movaps   xmm10, xmm7
000000018094de7a: movss    dword ptr [rsp + 0x24], xmm7
000000018094de80: jmp      0x18094dd40
000000018094de85: mov      rdx, qword ptr [rip + 0x80189a4] ; GenericMethodInfo 256758 @0x188966830
000000018094de8c: mov      rcx, rbx
000000018094de8f: call     0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
000000018094de94: jmp      0x18094dece
000000018094de96: mov      rdx, qword ptr [rip + 0x8018993] ; GenericMethodInfo 256758 @0x188966830
000000018094de9d: mov      rcx, qword ptr [rsp + 0x50]
000000018094dea2: call     0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
000000018094dea7: mov      rcx, qword ptr [rsp + 0x48]
000000018094deac: test     rcx, rcx
000000018094deaf: jne      0x18094e04f
000000018094deb5: xor      r15d, r15d
000000018094deb8: mov      r13, qword ptr [rsp + 0x1b0]
000000018094dec0: movss    xmm10, dword ptr [rsp + 0x24]
000000018094dec7: movss    xmm9, dword ptr [rsp + 0x20]
000000018094dece: mov      rcx, qword ptr [r13 + 0x70]
000000018094ded2: test     rcx, rcx
000000018094ded5: je       0x18094e055
000000018094dedb: inc      dword ptr [rcx + 0x1c]
000000018094dede: mov      r8d, dword ptr [rcx + 0x18]
000000018094dee2: mov      dword ptr [rcx + 0x18], r15d
000000018094dee6: test     r8d, r8d
000000018094dee9: jle      0x18094def9
000000018094deeb: xor      r9d, r9d
000000018094deee: xor      edx, edx
000000018094def0: mov      rcx, qword ptr [rcx + 0x10]
000000018094def4: call     0x185ee99a0
000000018094def9: cmp      byte ptr [rip + 0x834188f], 0
000000018094df00: jne      0x18094df15
000000018094df02: lea      rcx, [rip + 0x7f758b7] ; TypeInfo System.Math @0x1888c37c0
000000018094df09: call     0x18048bf00
000000018094df0e: mov      byte ptr [rip + 0x834187a], 1
000000018094df15: mov      rcx, qword ptr [rip + 0x7f758a4] ; TypeInfo System.Math @0x1888c37c0
000000018094df1c: cmp      dword ptr [rcx + 0xe0], 0
000000018094df23: jne      0x18094df2a
000000018094df25: call     0x18048c140
000000018094df2a: movaps   xmm1, xmm10
000000018094df2e: mulss    xmm1, xmm10
000000018094df33: movaps   xmm0, xmm9
000000018094df37: mulss    xmm0, xmm9
000000018094df3c: addss    xmm1, xmm0
000000018094df40: xorps    xmm2, xmm2
000000018094df43: cvtss2sd xmm2, xmm1
000000018094df47: xorps    xmm0, xmm0
000000018094df4a: ucomisd  xmm0, xmm2
000000018094df4e: ja       0x18094df56
000000018094df50: sqrtpd   xmm0, xmm2
000000018094df54: jmp      0x18094df5e
000000018094df56: movaps   xmm0, xmm2
000000018094df59: call     0x1804d2720
000000018094df5e: cvtsd2ss xmm0, xmm0
000000018094df62: comiss   xmm0, dword ptr [rip + 0x64f1e1f]
000000018094df69: ja       0x18094dfa2
000000018094df6b: cmp      byte ptr [rip + 0x8341643], 0
000000018094df72: jne      0x18094df87
000000018094df74: lea      rcx, [rip + 0x7edac45] ; TypeInfo UnityEngine.Vector2 @0x188828bc0
000000018094df7b: call     0x18048bf00
000000018094df80: mov      byte ptr [rip + 0x834162e], 1
000000018094df87: mov      rax, qword ptr [rip + 0x7edac32] ; TypeInfo UnityEngine.Vector2 @0x188828bc0
000000018094df8e: mov      rcx, qword ptr [rax + 0xb8]
000000018094df95: movss    xmm9, dword ptr [rcx]
000000018094df9a: movss    xmm10, dword ptr [rcx + 4]
000000018094dfa0: jmp      0x18094dfac
000000018094dfa2: divss    xmm9, xmm0
000000018094dfa7: divss    xmm10, xmm0
000000018094dfac: xorps    xmm9, xmmword ptr [rip + 0x64f1e4c]
000000018094dfb4: mulss    xmm9, dword ptr [r13 + 0x60]
000000018094dfba: xorps    xmm10, xmmword ptr [rip + 0x64f1e3e]
000000018094dfc2: mulss    xmm10, dword ptr [r13 + 0x60]
000000018094dfc8: unpcklps xmm9, xmm10
000000018094dfcc: movq     rax, xmm9
000000018094dfd1: jmp      0x18094dfed
000000018094dfd3: movaps   xmm0, xmm9
000000018094dfd7: unpcklps xmm0, xmm10
000000018094dfdb: movq     rax, xmm0
000000018094dfe0: jmp      0x18094dfed
000000018094dfe2: xor      r8d, r8d
000000018094dfe5: mov      rdx, r13
000000018094dfe8: call     0x1835c4140 ; XLua.DelegateBridge.__Gen_Delegate_Imp72 [2727]
000000018094dfed: lea      r11, [rsp + 0x170]
000000018094dff5: movaps   xmm6, xmmword ptr [r11 - 0x10]
000000018094dffa: movaps   xmm7, xmmword ptr [r11 - 0x20]
000000018094dfff: movaps   xmm8, xmmword ptr [r11 - 0x30]
000000018094e004: movaps   xmm9, xmmword ptr [r11 - 0x40]
000000018094e009: movaps   xmm10, xmmword ptr [r11 - 0x50]
000000018094e00e: movaps   xmm11, xmmword ptr [r11 - 0x60]
000000018094e013: movaps   xmm12, xmmword ptr [r11 - 0x70]
000000018094e018: mov      rsp, r11
000000018094e01b: pop      r15
000000018094e01d: pop      r14
000000018094e01f: pop      r13
000000018094e021: pop      r12
000000018094e023: pop      rdi
000000018094e024: pop      rsi
000000018094e025: pop      rbx
000000018094e026: ret      
000000018094e027: call     0x18048c0b0
000000018094e02c: nop      
000000018094e02d: call     0x180472d50
000000018094e032: nop      
000000018094e033: call     0x180472d50
000000018094e038: nop      
000000018094e039: call     0x18048c0b0
000000018094e03e: call     0x18048c0b0
000000018094e043: call     0x18048c0b0
000000018094e048: nop      
000000018094e049: call     0x18048c0b0
000000018094e04e: nop      
000000018094e04f: call     0x180472d50
000000018094e054: int3     
000000018094e055: call     0x18048c0b0
000000018094e05a: int3     
000000018094e05b: nop      
000000018094e05c: enter    -0x6b29, 0