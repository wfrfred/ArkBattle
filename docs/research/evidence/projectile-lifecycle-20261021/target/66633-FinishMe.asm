; Torappu.Battle.Entity.FinishMe metadata=66633 token=0x601044a VA=0x1806f3360 RVA=0x6f3360 size=0x2b0
00000001806f3360: mov      qword ptr [rsp + 0x20], rbx
00000001806f3365: push     rsi
00000001806f3366: sub      rsp, 0x20
00000001806f336a: cmp      byte ptr [rip + 0x859d568], 0
00000001806f3371: mov      esi, edx
00000001806f3373: mov      rbx, rcx
00000001806f3376: jne      0x1806f3397
00000001806f3378: lea      rcx, [rip + 0x814dfe9] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806f337f: call     0x18048bf00
00000001806f3384: lea      rcx, [rip + 0x81e057d] ; GenericMethodInfo 281972 @0x1888d3908
00000001806f338b: call     0x18048bf00
00000001806f3390: mov      byte ptr [rip + 0x859d542], 1
00000001806f3397: mov      rax, qword ptr [rip + 0x814dfca] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806f339e: cmp      dword ptr [rax + 0xe0], 0
00000001806f33a5: jne      0x1806f33b6
00000001806f33a7: mov      rcx, rax
00000001806f33aa: call     0x18048c140
00000001806f33af: mov      rax, qword ptr [rip + 0x814dfb2] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806f33b6: mov      rax, qword ptr [rax + 0xb8]
00000001806f33bd: mov      rcx, qword ptr [rax + 0x868]
00000001806f33c4: test     rcx, rcx
00000001806f33c7: jne      0x1806f35c0
00000001806f33cd: xor      edx, edx
00000001806f33cf: mov      rcx, rbx
00000001806f33d2: call     0x180708ee0 ; Torappu.Battle.Entity.get_unfinished [66386]
00000001806f33d7: test     al, al
00000001806f33d9: je       0x1806f34ac
00000001806f33df: mov      qword ptr [rsp + 0x38], rdi
00000001806f33e4: xor      r8d, r8d
00000001806f33e7: mov      edx, esi
00000001806f33e9: mov      rcx, rbx
00000001806f33ec: call     0x1807096c0 ; Torappu.Battle.Entity.set_finishReason [66361]
00000001806f33f1: mov      rcx, qword ptr [rbx + 0x38]
00000001806f33f5: test     rcx, rcx
00000001806f33f8: je       0x1806f35d8
00000001806f33fe: xor      edx, edx
00000001806f3400: call     0x1826483c0 ; Torappu.StateMachine.Stop [33273]
00000001806f3405: mov      byte ptr [rbx + 0x8a], 0
00000001806f340c: cmp      byte ptr [rip + 0x85d93dd], 0
00000001806f3413: jbe      0x1806f341d
00000001806f3415: mov      rcx, qword ptr [rbx]
00000001806f3418: call     0x180446d00
00000001806f341d: mov      r8, qword ptr [rbx]
00000001806f3420: mov      edx, esi
00000001806f3422: mov      rcx, rbx
00000001806f3425: mov      rax, qword ptr [r8 + 0x8f0]
00000001806f342c: mov      r8, qword ptr [r8 + 0x8f8]
00000001806f3433: call     rax
00000001806f3435: mov      rcx, qword ptr [rip + 0x81e04cc] ; GenericMethodInfo 281972 @0x1888d3908
00000001806f343c: call     0x185337c50
00000001806f3441: test     rax, rax
00000001806f3444: je       0x1806f35d8
00000001806f344a: xor      edx, edx
00000001806f344c: mov      rcx, rax
00000001806f344f: call     0x180641830 ; Torappu.Battle.BattleController.get_gameMode [64515]
00000001806f3454: mov      rdi, rax
00000001806f3457: test     rax, rax
00000001806f345a: je       0x1806f35d8
00000001806f3460: mov      rax, qword ptr [rax]
00000001806f3463: mov      ecx, dword ptr [rax + 0x11c]
00000001806f3469: add      ecx, 0xfffff649
00000001806f346f: cmp      ecx, 0x1a
00000001806f3472: ja       0x1806f3517
00000001806f3478: movsxd   rax, ecx
00000001806f347b: lea      rdx, [rip - 0x6f3482]
00000001806f3482: movzx    eax, byte ptr [rdx + rax + 0x6f35f0]
00000001806f348a: mov      ecx, dword ptr [rdx + rax*4 + 0x6f35e0]
00000001806f3491: add      rcx, rdx
00000001806f3494: jmp      rcx
00000001806f3496: xor      r9d, r9d
00000001806f3499: mov      r8d, esi
00000001806f349c: mov      rdx, rbx
00000001806f349f: mov      rcx, rdi
00000001806f34a2: call     0x180bdcc00 ; Torappu.Battle.GameMode.GameModeFactory.AutoChessGameMode.DestroyEntity [81006]
00000001806f34a7: mov      rdi, qword ptr [rsp + 0x38]
00000001806f34ac: mov      rbx, qword ptr [rsp + 0x48]
00000001806f34b1: add      rsp, 0x20
00000001806f34b5: pop      rsi
00000001806f34b6: ret      
00000001806f34b7: xor      r9d, r9d
00000001806f34ba: mov      r8d, esi
00000001806f34bd: mov      rdx, rbx
00000001806f34c0: mov      rcx, rdi
00000001806f34c3: mov      rdi, qword ptr [rsp + 0x38]
00000001806f34c8: mov      rbx, qword ptr [rsp + 0x48]
00000001806f34cd: add      rsp, 0x20
00000001806f34d1: pop      rsi
00000001806f34d2: jmp      0x180c28440 ; Torappu.Battle.GameMode.GameModeFactory.GameCityGameMode.DestroyEntity [82081]
00000001806f34d7: xor      r9d, r9d
00000001806f34da: mov      r8d, esi
00000001806f34dd: mov      rdx, rbx
00000001806f34e0: mov      rcx, rdi
00000001806f34e3: mov      rdi, qword ptr [rsp + 0x38]
00000001806f34e8: mov      rbx, qword ptr [rsp + 0x48]
00000001806f34ed: add      rsp, 0x20
00000001806f34f1: pop      rsi
00000001806f34f2: jmp      0x180c6ce70 ; Torappu.Battle.GameMode.GameModeFactory.SandboxV3GameMode.DestroyEntity [83046]
00000001806f34f7: xor      r9d, r9d
00000001806f34fa: mov      r8d, esi
00000001806f34fd: mov      rdx, rbx
00000001806f3500: mov      rcx, rdi
00000001806f3503: mov      rdi, qword ptr [rsp + 0x38]
00000001806f3508: mov      rbx, qword ptr [rsp + 0x48]
00000001806f350d: add      rsp, 0x20
00000001806f3511: pop      rsi
00000001806f3512: jmp      0x180c18e70 ; Torappu.Battle.GameMode.GameModeFactory.DefaultGameMode.DestroyEntity [82233]
00000001806f3517: cmp      byte ptr [rip + 0x85d92d2], 0
00000001806f351e: mov      qword ptr [rsp + 0x30], rbp
00000001806f3523: mov      rbp, qword ptr [rip + 0x826e8a6] ; TypeInfo Torappu.Battle.GameMode.IGameMode @0x188961dd0
00000001806f352a: mov      qword ptr [rsp + 0x40], r14
00000001806f352f: mov      r14, qword ptr [rdi]
00000001806f3532: je       0x1806f353c
00000001806f3534: mov      rcx, r14
00000001806f3537: call     0x180446d00
00000001806f353c: movzx    edx, word ptr [r14 + 0x12e]
00000001806f3544: xor      ecx, ecx
00000001806f3546: cmp      cx, dx
00000001806f3549: jae      0x1806f3566
00000001806f354b: mov      r8, qword ptr [r14 + 0xb0]
00000001806f3552: movzx    eax, cx
00000001806f3555: add      rax, rax
00000001806f3558: cmp      qword ptr [r8 + rax*8], rbp
00000001806f355c: je       0x1806f35a3
00000001806f355e: inc      cx
00000001806f3561: cmp      cx, dx
00000001806f3564: jb       0x1806f3552
00000001806f3566: mov      r8d, 0x5a
00000001806f356c: mov      rdx, rbp
00000001806f356f: mov      rcx, rdi
00000001806f3572: call     0x180445cc0
00000001806f3577: mov      r10, qword ptr [rax]
00000001806f357a: mov      r8d, esi
00000001806f357d: mov      r9, qword ptr [rax + 8]
00000001806f3581: mov      rdx, rbx
00000001806f3584: mov      rcx, rdi
00000001806f3587: mov      r14, qword ptr [rsp + 0x40]
00000001806f358c: mov      rbp, qword ptr [rsp + 0x30]
00000001806f3591: mov      rdi, qword ptr [rsp + 0x38]
00000001806f3596: mov      rbx, qword ptr [rsp + 0x48]
00000001806f359b: add      rsp, 0x20
00000001806f359f: pop      rsi
00000001806f35a0: jmp      r10
00000001806f35a3: movzx    ecx, cx
00000001806f35a6: add      rcx, rcx
00000001806f35a9: mov      eax, dword ptr [r8 + rcx*8 + 8]
00000001806f35ae: add      eax, 0x5a
00000001806f35b1: cdqe     
00000001806f35b3: add      rax, 0x14
00000001806f35b7: shl      rax, 4
00000001806f35bb: add      rax, r14
00000001806f35be: jmp      0x1806f3577
00000001806f35c0: xor      r9d, r9d
00000001806f35c3: mov      r8d, esi
00000001806f35c6: mov      rdx, rbx
00000001806f35c9: mov      rbx, qword ptr [rsp + 0x48]
00000001806f35ce: add      rsp, 0x20
00000001806f35d2: pop      rsi
00000001806f35d3: jmp      0x183333c20 ; XLua.DelegateBridge.__Gen_Delegate_Imp3026 [5681]
00000001806f35d8: call     0x18048c0b0
00000001806f35dd: int3     
00000001806f35de: nop      
00000001806f35e0: div      dword ptr [rdi + rbp*2]
00000001806f35e3: add      byte ptr [rsi - 0x48ff90cc], dl
00000001806f35e9: xor      al, 0x6f
00000001806f35eb: add      bh, dl
00000001806f35ed: xor      al, 0x6f
00000001806f35ef: add      byte ptr [rax], al
00000001806f35f1: add      byte ptr [rax], al
00000001806f35f3: add      byte ptr [rax], al
00000001806f35f5: add      byte ptr [rax], al
00000001806f35f7: add      dword ptr [rax], eax
00000001806f35f9: add      byte ptr [rax], al
00000001806f35fb: add      byte ptr [rax], al
00000001806f35fd: add      byte ptr [rax], al
00000001806f35ff: add      al, byte ptr [rax]
00000001806f3601: add      byte ptr [rax], al
00000001806f3603: add      byte ptr [rax], al
00000001806f3605: add      byte ptr [rax], al
00000001806f3607: add      byte ptr [rax], al
00000001806f3609: add      eax, dword ptr [rax]
00000001806f360b: int3     
00000001806f360c: int3     
00000001806f360d: int3     
00000001806f360e: int3     
00000001806f360f: int3     