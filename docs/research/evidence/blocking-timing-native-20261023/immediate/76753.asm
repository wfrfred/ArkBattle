; Torappu.Battle.Enemy.States.UnbalanceState.OnAfterPhysicSimulate metadata=76753 token=0x6012bd2 VA=0x180a9e6f0 RVA=0xa9e6f0 size=0xd0
0000000180a9e6f0: push     rbx
0000000180a9e6f2: sub      rsp, 0x30
0000000180a9e6f6: cmp      byte ptr [rip + 0x81f4265], 0
0000000180a9e6fd: mov      rbx, rcx
0000000180a9e700: movaps   xmmword ptr [rsp + 0x20], xmm6
0000000180a9e705: movaps   xmm6, xmm1
0000000180a9e708: jne      0x180a9e729
0000000180a9e70a: lea      rcx, [rip + 0x7eb944f] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9e711: call     0x18048bf00
0000000180a9e716: lea      rcx, [rip + 0x7de7e6b] ; TypeInfo Torappu.Battle.Enemy.States.UnbalanceState @0x188886588
0000000180a9e71d: call     0x18048bf00
0000000180a9e722: mov      byte ptr [rip + 0x81f4239], 1
0000000180a9e729: mov      rax, qword ptr [rip + 0x7de7e58] ; TypeInfo Torappu.Battle.Enemy.States.UnbalanceState @0x188886588
0000000180a9e730: mov      rdx, qword ptr [rax + 0xb8]
0000000180a9e737: mov      rcx, qword ptr [rdx + 0x70]
0000000180a9e73b: test     rcx, rcx
0000000180a9e73e: jne      0x180a9e797
0000000180a9e740: mov      qword ptr [rsp + 0x40], rdi
0000000180a9e745: mov      rdx, qword ptr [rip + 0x7eb9414] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9e74c: mov      rcx, rbx
0000000180a9e74f: call     0x18536e540
0000000180a9e754: mov      rdx, qword ptr [rip + 0x7eb9405] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9e75b: mov      rcx, rbx
0000000180a9e75e: mov      rdi, rax
0000000180a9e761: call     0x18536e540
0000000180a9e766: test     rax, rax
0000000180a9e769: je       0x180a9e7af
0000000180a9e76b: xor      edx, edx
0000000180a9e76d: mov      rcx, rax
0000000180a9e770: call     0x180ad4250 ; Torappu.Battle.VisualObject.get_mapPosition [77866]
0000000180a9e775: test     rdi, rdi
0000000180a9e778: je       0x180a9e7af
0000000180a9e77a: xor      r8d, r8d
0000000180a9e77d: mov      rdx, rax
0000000180a9e780: mov      rcx, rdi
0000000180a9e783: mov      rdi, qword ptr [rsp + 0x40]
0000000180a9e788: movaps   xmm6, xmmword ptr [rsp + 0x20]
0000000180a9e78d: add      rsp, 0x30
0000000180a9e791: pop      rbx
0000000180a9e792: jmp      0x180ad3dc0 ; Torappu.Battle.VisualObject.SetPosition [77880]
0000000180a9e797: xor      r9d, r9d
0000000180a9e79a: movaps   xmm2, xmm6
0000000180a9e79d: mov      rdx, rbx
0000000180a9e7a0: movaps   xmm6, xmmword ptr [rsp + 0x20]
0000000180a9e7a5: add      rsp, 0x30
0000000180a9e7a9: pop      rbx
0000000180a9e7aa: jmp      0x1836500a0 ; XLua.DelegateBridge.__Gen_Delegate_Imp81 [2736]
0000000180a9e7af: call     0x18048c0b0
0000000180a9e7b4: int3     
0000000180a9e7b5: int3     
0000000180a9e7b6: int3     
0000000180a9e7b7: int3     
0000000180a9e7b8: int3     
0000000180a9e7b9: int3     
0000000180a9e7ba: int3     
0000000180a9e7bb: int3     
0000000180a9e7bc: int3     
0000000180a9e7bd: int3     
0000000180a9e7be: int3     
0000000180a9e7bf: int3     