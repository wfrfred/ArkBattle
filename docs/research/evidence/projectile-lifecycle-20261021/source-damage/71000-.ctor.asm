; Torappu.Battle.Modifier..ctor metadata=71000 token=0x6011559 VA=0x1808b3660 RVA=0x8b3660 size=0x2c0
00000001808b3660: mov      qword ptr [rsp + 8], rbx
00000001808b3665: mov      qword ptr [rsp + 0x10], rbp
00000001808b366a: mov      qword ptr [rsp + 0x18], rsi
00000001808b366f: push     rdi
00000001808b3670: push     r12
00000001808b3672: push     r13
00000001808b3674: push     r14
00000001808b3676: push     r15
00000001808b3678: sub      rsp, 0xf0
00000001808b367f: cmp      byte ptr [rip + 0x83de088], 0
00000001808b3686: mov      rbx, r9
00000001808b3689: mov      ebp, r8d
00000001808b368c: mov      r14d, edx
00000001808b368f: mov      rsi, rcx
00000001808b3692: jne      0x1808b36bf
00000001808b3694: lea      rcx, [rip + 0x7fa7065] ; TypeInfo Torappu.FP @0x18885a700
00000001808b369b: call     0x18048bf00
00000001808b36a0: lea      rcx, [rip + 0x8039ad1] ; TypeInfo Torappu.Battle.Modifier @0x1888ed178
00000001808b36a7: call     0x18048bf00
00000001808b36ac: lea      rcx, [rip + 0x80babed] ; GenericMethodInfo 298108 @0x18896e2a0
00000001808b36b3: call     0x18048bf00
00000001808b36b8: mov      byte ptr [rip + 0x83de04f], 1
00000001808b36bf: xorps    xmm0, xmm0
00000001808b36c2: xor      eax, eax
00000001808b36c4: movups   xmmword ptr [rsi], xmm0
00000001808b36c7: movups   xmmword ptr [rsi + 0x10], xmm0
00000001808b36cb: movups   xmmword ptr [rsi + 0x20], xmm0
00000001808b36cf: movups   xmmword ptr [rsi + 0x30], xmm0
00000001808b36d3: movups   xmmword ptr [rsi + 0x40], xmm0
00000001808b36d7: movups   xmmword ptr [rsi + 0x50], xmm0
00000001808b36db: movups   xmmword ptr [rsi + 0x60], xmm0
00000001808b36df: movups   xmmword ptr [rsi + 0x70], xmm0
00000001808b36e3: mov      qword ptr [rsi + 0x80], rax
00000001808b36ea: mov      rcx, qword ptr [rip + 0x8039a87] ; TypeInfo Torappu.Battle.Modifier @0x1888ed178
00000001808b36f1: cmp      dword ptr [rcx + 0xe0], eax
00000001808b36f7: jne      0x1808b36fe
00000001808b36f9: call     0x18048c140
00000001808b36fe: xor      r8d, r8d
00000001808b3701: mov      edx, r14d
00000001808b3704: mov      rcx, rsi
00000001808b3707: call     0x1808b5720 ; Torappu.Battle.Modifier.set_targetType [70954]
00000001808b370c: xor      r8d, r8d
00000001808b370f: mov      edx, ebp
00000001808b3711: mov      rcx, rsi
00000001808b3714: call     0x1808b5220 ; Torappu.Battle.Modifier.set_deltaType [70956]
00000001808b3719: xor      r8d, r8d
00000001808b371c: mov      rdx, rbx
00000001808b371f: mov      rcx, rsi
00000001808b3722: call     0x1808b5820 ; Torappu.Battle.Modifier.set_value [70981]
00000001808b3727: mov      r15d, dword ptr [rsp + 0x158]
00000001808b372f: xor      r8d, r8d
00000001808b3732: mov      edx, r15d
00000001808b3735: mov      rcx, rsi
00000001808b3738: call     0x1808b5620 ; Torappu.Battle.Modifier.set_playerSide [70983]
00000001808b373d: mov      rdi, qword ptr [rsp + 0x140]
00000001808b3745: xor      r8d, r8d
00000001808b3748: mov      rdx, rdi
00000001808b374b: mov      rcx, rsi
00000001808b374e: call     0x1808b5520 ; Torappu.Battle.Modifier.set_originValue [70978]
00000001808b3753: xor      r8d, r8d
00000001808b3756: mov      rdx, rdi
00000001808b3759: mov      rcx, rsi
00000001808b375c: call     0x1808b5420 ; Torappu.Battle.Modifier.set_originAtk [70976]
00000001808b3761: mov      r12, qword ptr [rsp + 0x148]
00000001808b3769: lea      rcx, [rsp + 0x50]
00000001808b376e: mov      r8, qword ptr [rip + 0x80bab2b] ; GenericMethodInfo 298108 @0x18896e2a0
00000001808b3775: mov      rdx, r12
00000001808b3778: call     0x1845638c0
00000001808b377d: movups   xmm0, xmmword ptr [rsp + 0x50]
00000001808b3782: xor      edx, edx
00000001808b3784: mov      rcx, rsi
00000001808b3787: movups   xmmword ptr [rsi], xmm0
00000001808b378a: call     0x18048b9e0
00000001808b378f: mov      r13, qword ptr [rsp + 0x150]
00000001808b3797: lea      rcx, [rsp + 0x50]
00000001808b379c: mov      r8, qword ptr [rip + 0x80baafd] ; GenericMethodInfo 298108 @0x18896e2a0
00000001808b37a3: mov      rdx, r13
00000001808b37a6: call     0x1845638c0
00000001808b37ab: movups   xmm0, xmmword ptr [rsp + 0x50]
00000001808b37b0: lea      rcx, [rsi + 0x10]
00000001808b37b4: xor      edx, edx
00000001808b37b6: movups   xmmword ptr [rsi + 0x10], xmm0
00000001808b37ba: call     0x18048b9e0
00000001808b37bf: xor      r8d, r8d
00000001808b37c2: xor      edx, edx
00000001808b37c4: mov      rcx, rsi
00000001808b37c7: call     0x1808b5120 ; Torappu.Battle.Modifier.set_damageType [70966]
00000001808b37cc: xor      r8d, r8d
00000001808b37cf: xor      edx, edx
00000001808b37d1: mov      rcx, rsi
00000001808b37d4: call     0x1808b4e20 ; Torappu.Battle.Modifier.set_applyWay [70968]
00000001808b37d9: xor      r8d, r8d
00000001808b37dc: xor      edx, edx
00000001808b37de: mov      rcx, rsi
00000001808b37e1: call     0x1808b5020 ; Torappu.Battle.Modifier.set_cancelReason [70970]
00000001808b37e6: xor      r8d, r8d
00000001808b37e9: xor      edx, edx
00000001808b37eb: mov      rcx, rsi
00000001808b37ee: call     0x1808b4f20 ; Torappu.Battle.Modifier.set_attackType [70972]
00000001808b37f3: mov      byte ptr [rsi + 0x28], 0
00000001808b37f7: mov      dword ptr [rsi + 0x2c], 0
00000001808b37fe: mov      rcx, qword ptr [rip + 0x7fa6efb] ; TypeInfo Torappu.FP @0x18885a700
00000001808b3805: cmp      dword ptr [rcx + 0xe0], 0
00000001808b380c: jne      0x1808b3813
00000001808b380e: call     0x18048c140
00000001808b3813: xor      edx, edx
00000001808b3815: xor      ecx, ecx
00000001808b3817: call     0x1866fdac0
00000001808b381c: xor      edx, edx
00000001808b381e: mov      qword ptr [rsi + 0x38], rax
00000001808b3822: xor      ecx, ecx
00000001808b3824: call     0x1866fdac0
00000001808b3829: lea      rcx, [rsi + 0x48]
00000001808b382d: mov      qword ptr [rsi + 0x40], rax
00000001808b3831: xor      edx, edx
00000001808b3833: mov      qword ptr [rsi + 0x48], 0
00000001808b383b: call     0x18048b9e0
00000001808b3840: mov      rax, qword ptr [rip + 0x8039931] ; TypeInfo Torappu.Battle.Modifier @0x1888ed178
00000001808b3847: mov      rcx, qword ptr [rax + 0xb8]
00000001808b384e: mov      rcx, qword ptr [rcx + 0x200]
00000001808b3855: test     rcx, rcx
00000001808b3858: je       0x1808b38fa
00000001808b385e: movups   xmm0, xmmword ptr [rsi]
00000001808b3861: mov      qword ptr [rsp + 0x48], 0
00000001808b386a: mov      r9d, ebp
00000001808b386d: movups   xmm1, xmmword ptr [rsi + 0x10]
00000001808b3871: lea      rdx, [rsp + 0x60]
00000001808b3876: mov      dword ptr [rsp + 0x40], r15d
00000001808b387b: movaps   xmmword ptr [rsp + 0x60], xmm0
00000001808b3880: mov      r8d, r14d
00000001808b3883: movups   xmm0, xmmword ptr [rsi + 0x20]
00000001808b3887: mov      qword ptr [rsp + 0x38], r13
00000001808b388c: movaps   xmmword ptr [rsp + 0x70], xmm1
00000001808b3891: movups   xmm1, xmmword ptr [rsi + 0x30]
00000001808b3895: mov      qword ptr [rsp + 0x30], r12
00000001808b389a: movaps   xmmword ptr [rsp + 0x80], xmm0
00000001808b38a2: movups   xmm0, xmmword ptr [rsi + 0x40]
00000001808b38a6: mov      qword ptr [rsp + 0x28], rdi
00000001808b38ab: movaps   xmmword ptr [rsp + 0x90], xmm1
00000001808b38b3: movups   xmm1, xmmword ptr [rsi + 0x50]
00000001808b38b7: mov      qword ptr [rsp + 0x20], rbx
00000001808b38bc: movaps   xmmword ptr [rsp + 0xa0], xmm0
00000001808b38c4: movups   xmm0, xmmword ptr [rsi + 0x60]
00000001808b38c8: movaps   xmmword ptr [rsp + 0xb0], xmm1
00000001808b38d0: movups   xmm1, xmmword ptr [rsi + 0x70]
00000001808b38d4: movaps   xmmword ptr [rsp + 0xc0], xmm0
00000001808b38dc: movsd    xmm0, qword ptr [rsi + 0x80]
00000001808b38e4: movsd    qword ptr [rsp + 0xe0], xmm0
00000001808b38ed: movaps   xmmword ptr [rsp + 0xd0], xmm1
00000001808b38f5: call     0x183373a40 ; XLua.DelegateBridge.__Gen_Delegate_Imp3436 [6091]
00000001808b38fa: lea      r11, [rsp + 0xf0]
00000001808b3902: mov      rbx, qword ptr [r11 + 0x30]
00000001808b3906: mov      rbp, qword ptr [r11 + 0x38]
00000001808b390a: mov      rsi, qword ptr [r11 + 0x40]
00000001808b390e: mov      rsp, r11
00000001808b3911: pop      r15
00000001808b3913: pop      r14
00000001808b3915: pop      r13
00000001808b3917: pop      r12
00000001808b3919: pop      rdi
00000001808b391a: ret      
00000001808b391b: int3     
00000001808b391c: int3     
00000001808b391d: int3     
00000001808b391e: int3     
00000001808b391f: int3     