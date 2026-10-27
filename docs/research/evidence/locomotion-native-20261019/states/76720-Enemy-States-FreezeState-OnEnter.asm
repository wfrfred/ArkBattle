; Torappu.Battle.Enemy.States.FreezeState.OnEnter metadata=76720 token=0x6012bb1 VA=0x180a94f40 RVA=0xa94f40 size=0x220
0000000180a94f40: mov      qword ptr [rsp + 8], rbx
0000000180a94f45: push     rdi
0000000180a94f46: sub      rsp, 0x30
0000000180a94f4a: cmp      byte ptr [rip + 0x81fd9f0], 0
0000000180a94f51: mov      edi, edx
0000000180a94f53: mov      rbx, rcx
0000000180a94f56: jne      0x180a94f83
0000000180a94f58: lea      rcx, [rip + 0x7eb4101] ; TypeInfo bool @0x188949060
0000000180a94f5f: call     0x18048bf00
0000000180a94f64: lea      rcx, [rip + 0x7df0675] ; TypeInfo Torappu.Battle.Enemy.States.FreezeState @0x1888855e0
0000000180a94f6b: call     0x18048bf00
0000000180a94f70: lea      rcx, [rip + 0x7ec2be9] ; GenericMethodInfo 282794 @0x188957b60
0000000180a94f77: call     0x18048bf00
0000000180a94f7c: mov      byte ptr [rip + 0x81fd9be], 1
0000000180a94f83: mov      rax, qword ptr [rip + 0x7df0656] ; TypeInfo Torappu.Battle.Enemy.States.FreezeState @0x1888855e0
0000000180a94f8a: mov      rcx, qword ptr [rax + 0xb8]
0000000180a94f91: mov      rcx, qword ptr [rcx + 0x38]
0000000180a94f95: test     rcx, rcx
0000000180a94f98: jne      0x180a95140
0000000180a94f9e: mov      rdx, qword ptr [rip + 0x7ec2bbb] ; GenericMethodInfo 282794 @0x188957b60
0000000180a94fa5: mov      rcx, rbx
0000000180a94fa8: call     0x18536e540
0000000180a94fad: mov      rdi, rax
0000000180a94fb0: test     rax, rax
0000000180a94fb3: je       0x180a95158
0000000180a94fb9: cmp      byte ptr [rip + 0x8237830], 0
0000000180a94fc0: jbe      0x180a94fca
0000000180a94fc2: mov      rcx, qword ptr [rax]
0000000180a94fc5: call     0x180446d00
0000000180a94fca: mov      rdx, qword ptr [rdi]
0000000180a94fcd: mov      rcx, rdi
0000000180a94fd0: mov      r8, qword ptr [rdx + 0xb60]
0000000180a94fd7: mov      rdx, qword ptr [rdx + 0xb68]
0000000180a94fde: call     r8
0000000180a94fe1: mov      rdi, rax
0000000180a94fe4: test     rax, rax
0000000180a94fe7: je       0x180a95158
0000000180a94fed: cmp      byte ptr [rip + 0x82377fc], 0
0000000180a94ff4: jbe      0x180a94ffe
0000000180a94ff6: mov      rcx, qword ptr [rax]
0000000180a94ff9: call     0x180446d00
0000000180a94ffe: mov      r8, qword ptr [rdi]
0000000180a95001: lea      rcx, [rsp + 0x20]
0000000180a95006: mov      rdx, rdi
0000000180a95009: mov      r9, qword ptr [r8 + 0x3e0]
0000000180a95010: mov      r8, qword ptr [r8 + 0x3e8]
0000000180a95017: call     r9
0000000180a9501a: lea      rcx, [rbx + 0x18]
0000000180a9501e: xor      edx, edx
0000000180a95020: movups   xmm0, xmmword ptr [rax]
0000000180a95023: movups   xmmword ptr [rbx + 0x18], xmm0
0000000180a95027: call     0x18048b9e0
0000000180a9502c: mov      rdx, qword ptr [rip + 0x7ec2b2d] ; GenericMethodInfo 282794 @0x188957b60
0000000180a95033: mov      rcx, rbx
0000000180a95036: call     0x18536e540
0000000180a9503b: mov      rdi, rax
0000000180a9503e: test     rax, rax
0000000180a95041: je       0x180a95158
0000000180a95047: cmp      byte ptr [rip + 0x82377a2], 0
0000000180a9504e: jbe      0x180a95058
0000000180a95050: mov      rcx, qword ptr [rax]
0000000180a95053: call     0x180446d00
0000000180a95058: mov      rdx, qword ptr [rdi]
0000000180a9505b: mov      rcx, rdi
0000000180a9505e: mov      r8, qword ptr [rdx + 0xb60]
0000000180a95065: mov      rdx, qword ptr [rdx + 0xb68]
0000000180a9506c: call     r8
0000000180a9506f: mov      rdi, rax
0000000180a95072: test     rax, rax
0000000180a95075: je       0x180a95158
0000000180a9507b: cmp      byte ptr [rip + 0x823776e], 0
0000000180a95082: jbe      0x180a9508c
0000000180a95084: mov      rcx, qword ptr [rax]
0000000180a95087: call     0x180446d00
0000000180a9508c: mov      rdx, qword ptr [rdi]
0000000180a9508f: mov      rcx, rdi
0000000180a95092: mov      r8, qword ptr [rdx + 0x2d0]
0000000180a95099: mov      rdx, qword ptr [rdx + 0x2d8]
0000000180a950a0: call     r8
0000000180a950a3: mov      rdx, qword ptr [rip + 0x7ec2ab6] ; GenericMethodInfo 282794 @0x188957b60
0000000180a950aa: mov      rcx, rbx
0000000180a950ad: call     0x18536e540
0000000180a950b2: mov      rdx, qword ptr [rip + 0x7ec2aa7] ; GenericMethodInfo 282794 @0x188957b60
0000000180a950b9: mov      rcx, rbx
0000000180a950bc: mov      rdi, rax
0000000180a950bf: call     0x18536e540
0000000180a950c4: test     rax, rax
0000000180a950c7: je       0x180a95158
0000000180a950cd: xor      edx, edx
0000000180a950cf: mov      rcx, rax
0000000180a950d2: call     0x180705b50 ; Torappu.Battle.Entity.get_isFrozen [66488]
0000000180a950d7: mov      rcx, qword ptr [rip + 0x7eb3f82] ; TypeInfo bool @0x188949060
0000000180a950de: lea      rdx, [rsp + 0x58]
0000000180a950e3: mov      byte ptr [rsp + 0x58], al
0000000180a950e7: call     0x18048b9c0
0000000180a950ec: test     rdi, rdi
0000000180a950ef: je       0x180a95158
0000000180a950f1: xor      r9d, r9d
0000000180a950f4: mov      r8, rax
0000000180a950f7: mov      edx, 0x1a
0000000180a950fc: mov      rcx, rdi
0000000180a950ff: call     0x1806f2630 ; Torappu.Battle.Entity.EmitEvent [66716]
0000000180a95104: mov      rdx, qword ptr [rip + 0x7ec2a55] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9510b: mov      rcx, rbx
0000000180a9510e: call     0x18536e540
0000000180a95113: test     rax, rax
0000000180a95116: je       0x180a95158
0000000180a95118: xor      edx, edx
0000000180a9511a: mov      rcx, rax
0000000180a9511d: call     0x180701e20 ; Torappu.Battle.Entity.get_attributes [66358]
0000000180a95122: test     rax, rax
0000000180a95125: je       0x180a95158
0000000180a95127: xor      r8d, r8d
0000000180a9512a: mov      rdx, rbx
0000000180a9512d: mov      rcx, rax
0000000180a95130: call     0x180648650 ; Torappu.Battle.Attributes.AddModifier [64273]
0000000180a95135: mov      rbx, qword ptr [rsp + 0x40]
0000000180a9513a: add      rsp, 0x30
0000000180a9513e: pop      rdi
0000000180a9513f: ret      
0000000180a95140: xor      r9d, r9d
0000000180a95143: mov      r8d, edi
0000000180a95146: mov      rdx, rbx
0000000180a95149: mov      rbx, qword ptr [rsp + 0x40]
0000000180a9514e: add      rsp, 0x30
0000000180a95152: pop      rdi
0000000180a95153: jmp      0x1834c0e30 ; XLua.DelegateBridge.__Gen_Delegate_Imp55 [2710]
0000000180a95158: call     0x18048c0b0
0000000180a9515d: int3     
0000000180a9515e: int3     
0000000180a9515f: int3     
