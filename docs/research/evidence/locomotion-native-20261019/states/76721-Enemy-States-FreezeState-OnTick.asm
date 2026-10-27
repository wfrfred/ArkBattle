; Torappu.Battle.Enemy.States.FreezeState.OnTick metadata=76721 token=0x6012bb2 VA=0x180a95300 RVA=0xa95300 size=0x190
0000000180a95300: mov      qword ptr [rsp + 8], rbx
0000000180a95305: push     rdi
0000000180a95306: sub      rsp, 0x20
0000000180a9530a: cmp      byte ptr [rip + 0x81fd631], 0
0000000180a95311: mov      rbx, rdx
0000000180a95314: mov      rdi, rcx
0000000180a95317: jne      0x180a95344
0000000180a95319: lea      rcx, [rip + 0x7df02c0] ; TypeInfo Torappu.Battle.Enemy.States.FreezeState @0x1888855e0
0000000180a95320: call     0x18048bf00
0000000180a95325: lea      rcx, [rip + 0x7ec23b4] ; GenericMethodInfo 282792 @0x1889576e0
0000000180a9532c: call     0x18048bf00
0000000180a95331: lea      rcx, [rip + 0x7ec2828] ; GenericMethodInfo 282794 @0x188957b60
0000000180a95338: call     0x18048bf00
0000000180a9533d: mov      byte ptr [rip + 0x81fd5fe], 1
0000000180a95344: mov      rax, qword ptr [rip + 0x7df0295] ; TypeInfo Torappu.Battle.Enemy.States.FreezeState @0x1888855e0
0000000180a9534b: mov      rcx, qword ptr [rax + 0xb8]
0000000180a95352: mov      rcx, qword ptr [rcx + 0x40]
0000000180a95356: test     rcx, rcx
0000000180a95359: jne      0x180a95464
0000000180a9535f: mov      rdx, qword ptr [rip + 0x7ec27fa] ; GenericMethodInfo 282794 @0x188957b60
0000000180a95366: mov      rcx, rdi
0000000180a95369: call     0x18536e540
0000000180a9536e: test     rax, rax
0000000180a95371: je       0x180a9547d
0000000180a95377: xor      edx, edx
0000000180a95379: mov      rcx, rax
0000000180a9537c: call     0x180705320 ; Torappu.Battle.Entity.get_isActuallyLevitate [66493]
0000000180a95381: mov      rcx, rdi
0000000180a95384: test     al, al
0000000180a95386: jne      0x180a95449
0000000180a9538c: mov      rdx, qword ptr [rip + 0x7ec27cd] ; GenericMethodInfo 282794 @0x188957b60
0000000180a95393: call     0x18536e540
0000000180a95398: test     rax, rax
0000000180a9539b: je       0x180a9547d
0000000180a953a1: xor      edx, edx
0000000180a953a3: mov      rcx, rax
0000000180a953a6: call     0x180706a00 ; Torappu.Battle.Entity.get_isStunned [66486]
0000000180a953ab: mov      rcx, rdi
0000000180a953ae: test     al, al
0000000180a953b0: jne      0x180a9542e
0000000180a953b2: mov      rdx, qword ptr [rip + 0x7ec27a7] ; GenericMethodInfo 282794 @0x188957b60
0000000180a953b9: call     0x18536e540
0000000180a953be: test     rax, rax
0000000180a953c1: je       0x180a9547d
0000000180a953c7: xor      edx, edx
0000000180a953c9: mov      rcx, rax
0000000180a953cc: call     0x180705b50 ; Torappu.Battle.Entity.get_isFrozen [66488]
0000000180a953d1: test     al, al
0000000180a953d3: jne      0x180a95472
0000000180a953d9: mov      rdx, qword ptr [rip + 0x7ec2780] ; GenericMethodInfo 282794 @0x188957b60
0000000180a953e0: mov      rcx, rdi
0000000180a953e3: call     0x18536e540
0000000180a953e8: test     rax, rax
0000000180a953eb: je       0x180a9547d
0000000180a953f1: xor      edx, edx
0000000180a953f3: mov      rcx, rax
0000000180a953f6: call     0x180706560 ; Torappu.Battle.Entity.get_isPalsying [66504]
0000000180a953fb: mov      r8, qword ptr [rip + 0x7ec22de] ; GenericMethodInfo 282792 @0x1889576e0
0000000180a95402: mov      rcx, rdi
0000000180a95405: test     al, al
0000000180a95407: jne      0x180a9541a
0000000180a95409: xor      edx, edx
0000000180a9540b: mov      rbx, qword ptr [rsp + 0x30]
0000000180a95410: add      rsp, 0x20
0000000180a95414: pop      rdi
0000000180a95415: jmp      0x18536e450
0000000180a9541a: mov      edx, 0x10
0000000180a9541f: mov      rbx, qword ptr [rsp + 0x30]
0000000180a95424: add      rsp, 0x20
0000000180a95428: pop      rdi
0000000180a95429: jmp      0x18536e450
0000000180a9542e: mov      r8, qword ptr [rip + 0x7ec22ab] ; GenericMethodInfo 282792 @0x1889576e0
0000000180a95435: mov      edx, 4
0000000180a9543a: mov      rbx, qword ptr [rsp + 0x30]
0000000180a9543f: add      rsp, 0x20
0000000180a95443: pop      rdi
0000000180a95444: jmp      0x18536e450
0000000180a95449: mov      r8, qword ptr [rip + 0x7ec2290] ; GenericMethodInfo 282792 @0x1889576e0
0000000180a95450: mov      edx, 0xe
0000000180a95455: mov      rbx, qword ptr [rsp + 0x30]
0000000180a9545a: add      rsp, 0x20
0000000180a9545e: pop      rdi
0000000180a9545f: jmp      0x18536e450
0000000180a95464: xor      r9d, r9d
0000000180a95467: mov      r8, rbx
0000000180a9546a: mov      rdx, rdi
0000000180a9546d: call     0x1833f9830 ; XLua.DelegateBridge.__Gen_Delegate_Imp427 [3082]
0000000180a95472: mov      rbx, qword ptr [rsp + 0x30]
0000000180a95477: add      rsp, 0x20
0000000180a9547b: pop      rdi
0000000180a9547c: ret      
0000000180a9547d: call     0x18048c0b0
0000000180a95482: int3     
0000000180a95483: int3     
0000000180a95484: int3     
0000000180a95485: int3     
0000000180a95486: int3     
0000000180a95487: int3     
0000000180a95488: int3     
0000000180a95489: int3     
0000000180a9548a: int3     
0000000180a9548b: int3     
0000000180a9548c: int3     
0000000180a9548d: int3     
0000000180a9548e: int3     
0000000180a9548f: int3     
