; Torappu.Battle.AdvancedSelector.OnPostFilter metadata=74238 token=0x60121ff VA=0x1809c34f0 RVA=0x9c34f0 size=0x330
00000001809c34f0: mov      qword ptr [rsp + 0x20], rbx
00000001809c34f5: push     rdi
00000001809c34f6: sub      rsp, 0x70
00000001809c34fa: cmp      byte ptr [rip + 0x82cebe2], 0
00000001809c3501: mov      rdi, rdx
00000001809c3504: mov      rbx, rcx
00000001809c3507: jne      0x1809c3564
00000001809c3509: lea      rcx, [rip + 0x7fb17a0] ; TypeInfo Torappu.Battle.AbilityStandard @0x188974cb0
00000001809c3510: call     0x18048bf00
00000001809c3515: lea      rcx, [rip + 0x7e6244c] ; TypeInfo Torappu.Battle.AdvancedSelector @0x188825968
00000001809c351c: call     0x18048bf00
00000001809c3521: lea      rcx, [rip + 0x7eb15f8] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809c3528: call     0x18048bf00
00000001809c352d: lea      rcx, [rip + 0x7e97084] ; GenericMethodInfo 264923 @0x18885a5b8
00000001809c3534: call     0x18048bf00
00000001809c3539: lea      rcx, [rip + 0x7f74818] ; GenericMethodInfo 271519 @0x188937d58
00000001809c3540: call     0x18048bf00
00000001809c3545: lea      rcx, [rip + 0x7f7205c] ; GenericMethodInfo 280377 @0x1889355a8
00000001809c354c: call     0x18048bf00
00000001809c3551: lea      rcx, [rip + 0x7f6f790] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001809c3558: call     0x18048bf00
00000001809c355d: mov      byte ptr [rip + 0x82ceb7f], 1
00000001809c3564: mov      rcx, qword ptr [rip + 0x7e623fd] ; TypeInfo Torappu.Battle.AdvancedSelector @0x188825968
00000001809c356b: xorps    xmm0, xmm0
00000001809c356e: movups   xmmword ptr [rsp + 0x30], xmm0
00000001809c3573: cmp      dword ptr [rcx + 0xe0], 0
00000001809c357a: jne      0x1809c3588
00000001809c357c: call     0x18048c140
00000001809c3581: mov      rcx, qword ptr [rip + 0x7e623e0] ; TypeInfo Torappu.Battle.AdvancedSelector @0x188825968
00000001809c3588: mov      rax, qword ptr [rcx + 0xb8]
00000001809c358f: mov      r10, qword ptr [rax + 0xe0]
00000001809c3596: test     r10, r10
00000001809c3599: jne      0x1809c37f4
00000001809c359f: cmp      byte ptr [rip + 0x82ceb36], r10b
00000001809c35a6: jne      0x1809c35c2
00000001809c35a8: lea      rcx, [rip + 0x7e623b9] ; TypeInfo Torappu.Battle.AdvancedSelector @0x188825968
00000001809c35af: call     0x18048bf00
00000001809c35b4: mov      rcx, qword ptr [rip + 0x7e623ad] ; TypeInfo Torappu.Battle.AdvancedSelector @0x188825968
00000001809c35bb: mov      byte ptr [rip + 0x82ceb1a], 1
00000001809c35c2: cmp      dword ptr [rcx + 0xe0], 0
00000001809c35c9: jne      0x1809c35d7
00000001809c35cb: call     0x18048c140
00000001809c35d0: mov      rcx, qword ptr [rip + 0x7e62391] ; TypeInfo Torappu.Battle.AdvancedSelector @0x188825968
00000001809c35d7: mov      rax, qword ptr [rcx + 0xb8]
00000001809c35de: mov      rcx, qword ptr [rax + 0xa8]
00000001809c35e5: test     rcx, rcx
00000001809c35e8: jne      0x1809c35f5
00000001809c35ea: movzx    eax, byte ptr [rbx + 0xb0]
00000001809c35f1: and      al, 1
00000001809c35f3: jmp      0x1809c3600
00000001809c35f5: xor      r8d, r8d
00000001809c35f8: mov      rdx, rbx
00000001809c35fb: call     0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
00000001809c3600: mov      qword ptr [rsp + 0x88], rsi
00000001809c3608: test     al, al
00000001809c360a: je       0x1809c366d
00000001809c360c: cmp      byte ptr [rbx + 0xf4], 0
00000001809c3613: je       0x1809c366d
00000001809c3615: xor      edx, edx
00000001809c3617: mov      rcx, rbx
00000001809c361a: call     0x1809fc920 ; Torappu.Battle.TargetSelector.get_owner [75080]
00000001809c361f: mov      rcx, qword ptr [rip + 0x7f6f6c2] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001809c3626: mov      rsi, rax
00000001809c3629: cmp      dword ptr [rcx + 0xe0], 0
00000001809c3630: jne      0x1809c3637
00000001809c3632: call     0x18048c140
00000001809c3637: xor      r8d, r8d
00000001809c363a: xor      edx, edx
00000001809c363c: mov      rcx, rsi
00000001809c363f: call     0x186b63a70
00000001809c3644: test     al, al
00000001809c3646: je       0x1809c366d
00000001809c3648: xor      edx, edx
00000001809c364a: mov      rcx, rbx
00000001809c364d: call     0x1809fc920 ; Torappu.Battle.TargetSelector.get_owner [75080]
00000001809c3652: test     rdi, rdi
00000001809c3655: je       0x1809c3813
00000001809c365b: mov      r8, qword ptr [rip + 0x7f746f6] ; GenericMethodInfo 271519 @0x188937d58
00000001809c3662: mov      rdx, rax
00000001809c3665: mov      rcx, rdi
00000001809c3668: call     0x184d139a0
00000001809c366d: xor      edx, edx
00000001809c366f: mov      rcx, rbx
00000001809c3672: call     0x1809fc920 ; Torappu.Battle.TargetSelector.get_owner [75080]
00000001809c3677: cmp      byte ptr [rbx + 0xfc], 0
00000001809c367e: mov      rsi, rax
00000001809c3681: je       0x1809c3708
00000001809c3687: xor      edx, edx
00000001809c3689: mov      rcx, rbx
00000001809c368c: call     0x1809c3c20 ; Torappu.Battle.AdvancedSelector._CheckAbilityInputTargetValid [74242]
00000001809c3691: test     al, al
00000001809c3693: je       0x1809c3708
00000001809c3695: xor      edx, edx
00000001809c3697: mov      rcx, rbx
00000001809c369a: call     0x1809fc7a0 ; Torappu.Battle.TargetSelector.get_ability [75082]
00000001809c369f: mov      rdx, qword ptr [rip + 0x7fb160a] ; TypeInfo Torappu.Battle.AbilityStandard @0x188974cb0
00000001809c36a6: mov      rcx, rax
00000001809c36a9: mov      rsi, rax
00000001809c36ac: call     0x1800057a0
00000001809c36b1: test     rax, rax
00000001809c36b4: je       0x1809c3813
00000001809c36ba: mov      rdx, qword ptr [rip + 0x7fb15ef] ; TypeInfo Torappu.Battle.AbilityStandard @0x188974cb0
00000001809c36c1: mov      rcx, rsi
00000001809c36c4: call     0x1800057a0
00000001809c36c9: mov      rdx, rax
00000001809c36cc: lea      rcx, [rsp + 0x58]
00000001809c36d1: xor      r8d, r8d
00000001809c36d4: call     0x1805d4270 ; Torappu.Battle.AbilityStandard.get_inputTarget [63121]
00000001809c36d9: mov      rdx, qword ptr [rip + 0x7f71ec8] ; GenericMethodInfo 280377 @0x1889355a8
00000001809c36e0: lea      rcx, [rsp + 0x30]
00000001809c36e5: movups   xmm0, xmmword ptr [rax]
00000001809c36e8: movsd    xmm1, qword ptr [rax + 0x10]
00000001809c36ed: movups   xmmword ptr [rsp + 0x40], xmm0
00000001809c36f2: movups   xmm2, xmmword ptr [rsp + 0x48]
00000001809c36f7: unpcklpd xmm2, xmm1
00000001809c36fb: movups   xmmword ptr [rsp + 0x30], xmm2
00000001809c3700: call     0x185159d80
00000001809c3705: mov      rsi, rax
00000001809c3708: mov      qword ptr [rsp + 0x80], rbp
00000001809c3710: xor      edx, edx
00000001809c3712: mov      rcx, rbx
00000001809c3715: cmp      byte ptr [rbx + 0xf5], dl
00000001809c371b: jne      0x1809c3777
00000001809c371d: call     0x1809c48f0 ; Torappu.Battle.AdvancedSelector.get_maxTargetNum [74215]
00000001809c3722: mov      rcx, qword ptr [rip + 0x7eb13f7] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809c3729: mov      ebp, eax
00000001809c372b: mov      ebx, dword ptr [rbx + 0xbc]
00000001809c3731: cmp      dword ptr [rcx + 0xe0], 0
00000001809c3738: jne      0x1809c373f
00000001809c373a: call     0x18048c140
00000001809c373f: mov      r9d, ebx
00000001809c3742: mov      qword ptr [rsp + 0x20], 0
00000001809c374b: mov      r8d, ebp
00000001809c374e: mov      rdx, rsi
00000001809c3751: mov      rcx, rdi
00000001809c3754: call     0x1809d8270 ; Torappu.Battle.FilterUtil.Filter [74633]
00000001809c3759: mov      rbp, qword ptr [rsp + 0x80]
00000001809c3761: mov      rsi, qword ptr [rsp + 0x88]
00000001809c3769: mov      rbx, qword ptr [rsp + 0x98]
00000001809c3771: add      rsp, 0x70
00000001809c3775: pop      rdi
00000001809c3776: ret      
00000001809c3777: mov      qword ptr [rsp + 0x90], r14
00000001809c377f: call     0x1809c48f0 ; Torappu.Battle.AdvancedSelector.get_maxTargetNum [74215]
00000001809c3784: mov      rcx, qword ptr [rip + 0x7e621dd] ; TypeInfo Torappu.Battle.AdvancedSelector @0x188825968
00000001809c378b: mov      ebp, eax
00000001809c378d: mov      r14d, dword ptr [rbx + 0xbc]
00000001809c3794: cmp      dword ptr [rcx + 0xe0], 0
00000001809c379b: jne      0x1809c37a9
00000001809c379d: call     0x18048c140
00000001809c37a2: mov      rcx, qword ptr [rip + 0x7e621bf] ; TypeInfo Torappu.Battle.AdvancedSelector @0x188825968
00000001809c37a9: mov      rcx, qword ptr [rcx + 0xb8]
00000001809c37b0: mov      rbx, qword ptr [rcx]
00000001809c37b3: mov      rcx, qword ptr [rip + 0x7eb1366] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809c37ba: cmp      dword ptr [rcx + 0xe0], 0
00000001809c37c1: jne      0x1809c37c8
00000001809c37c3: call     0x18048c140
00000001809c37c8: mov      qword ptr [rsp + 0x28], 0
00000001809c37d1: mov      r9d, r14d
00000001809c37d4: mov      r8d, ebp
00000001809c37d7: mov      qword ptr [rsp + 0x20], rbx
00000001809c37dc: mov      rdx, rsi
00000001809c37df: mov      rcx, rdi
00000001809c37e2: call     0x1809d7cd0 ; Torappu.Battle.FilterUtil.FilterWithFilterByPriorCompFunc [74634]
00000001809c37e7: mov      r14, qword ptr [rsp + 0x90]
00000001809c37ef: jmp      0x1809c3759
00000001809c37f4: xor      r9d, r9d
00000001809c37f7: mov      r8, rdi
00000001809c37fa: mov      rdx, rbx
00000001809c37fd: mov      rcx, r10
00000001809c3800: call     0x1832d2220 ; XLua.DelegateBridge.__Gen_Delegate_Imp23 [2678]
00000001809c3805: mov      rbx, qword ptr [rsp + 0x98]
00000001809c380d: add      rsp, 0x70
00000001809c3811: pop      rdi
00000001809c3812: ret      
00000001809c3813: call     0x18048c0b0
00000001809c3818: int3     
00000001809c3819: int3     
00000001809c381a: int3     
00000001809c381b: int3     
00000001809c381c: int3     
00000001809c381d: int3     
00000001809c381e: int3     
00000001809c381f: int3     