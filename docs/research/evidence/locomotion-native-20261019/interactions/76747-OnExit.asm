; Torappu.Battle.Enemy.States.UnbalanceState.OnExit metadata=76747 token=0x6012bcc VA=0x180a9ec10 RVA=0xa9ec10 size=0x1e0
0000000180a9ec10: mov      qword ptr [rsp + 8], rbx
0000000180a9ec15: push     rdi
0000000180a9ec16: sub      rsp, 0x20
0000000180a9ec1a: cmp      byte ptr [rip + 0x81f3d3b], 0
0000000180a9ec21: mov      edi, edx
0000000180a9ec23: mov      rbx, rcx
0000000180a9ec26: jne      0x180a9ec47
0000000180a9ec28: lea      rcx, [rip + 0x7eb8f31] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9ec2f: call     0x18048bf00
0000000180a9ec34: lea      rcx, [rip + 0x7de794d] ; TypeInfo Torappu.Battle.Enemy.States.UnbalanceState @0x188886588
0000000180a9ec3b: call     0x18048bf00
0000000180a9ec40: mov      byte ptr [rip + 0x81f3d15], 1
0000000180a9ec47: mov      rax, qword ptr [rip + 0x7de793a] ; TypeInfo Torappu.Battle.Enemy.States.UnbalanceState @0x188886588
0000000180a9ec4e: mov      rdx, qword ptr [rax + 0xb8]
0000000180a9ec55: mov      rcx, qword ptr [rdx + 0x40]
0000000180a9ec59: test     rcx, rcx
0000000180a9ec5c: jne      0x180a9edcd
0000000180a9ec62: mov      rdx, qword ptr [rip + 0x7eb8ef7] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9ec69: mov      rcx, rbx
0000000180a9ec6c: call     0x18536e540
0000000180a9ec71: movss    xmm2, dword ptr [rip + 0x63a307f]
0000000180a9ec79: xor      r9d, r9d
0000000180a9ec7c: mov      rdx, rax
0000000180a9ec7f: mov      rcx, rbx
0000000180a9ec82: call     0x180a9f350 ; Torappu.Battle.Enemy.States.UnbalanceState._CheckCollideWithHighLand [76749]
0000000180a9ec87: test     al, al
0000000180a9ec89: je       0x180a9ecc0
0000000180a9ec8b: mov      rdx, qword ptr [rip + 0x7eb8ece] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9ec92: mov      rcx, rbx
0000000180a9ec95: call     0x18536e540
0000000180a9ec9a: test     rax, rax
0000000180a9ec9d: je       0x180a9ede5
0000000180a9eca3: xor      edx, edx
0000000180a9eca5: mov      rcx, rax
0000000180a9eca8: call     0x180702100 ; Torappu.Battle.Entity.get_buffContainer [66402]
0000000180a9ecad: test     rax, rax
0000000180a9ecb0: je       0x180a9ede5
0000000180a9ecb6: xor      edx, edx
0000000180a9ecb8: mov      rcx, rax
0000000180a9ecbb: call     0x180670160 ; Torappu.Battle.Buff.BuffContainer.OnCollideWithHighLand [65436]
0000000180a9ecc0: mov      rdx, qword ptr [rip + 0x7eb8e99] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9ecc7: mov      rcx, rbx
0000000180a9ecca: call     0x18536e540
0000000180a9eccf: test     rax, rax
0000000180a9ecd2: je       0x180a9ede5
0000000180a9ecd8: xor      edx, edx
0000000180a9ecda: mov      rcx, rax
0000000180a9ecdd: call     0x180a7a1f0 ; Torappu.Battle.Enemy._ResetPhysicsStatus [76493]
0000000180a9ece2: mov      rdx, qword ptr [rip + 0x7eb8e77] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9ece9: mov      rcx, rbx
0000000180a9ecec: call     0x18536e540
0000000180a9ecf1: test     rax, rax
0000000180a9ecf4: je       0x180a9ede5
0000000180a9ecfa: xor      edx, edx
0000000180a9ecfc: mov      rcx, rax
0000000180a9ecff: call     0x180701e20 ; Torappu.Battle.Entity.get_attributes [66358]
0000000180a9ed04: test     rax, rax
0000000180a9ed07: je       0x180a9ede5
0000000180a9ed0d: xor      r8d, r8d
0000000180a9ed10: mov      rdx, rbx
0000000180a9ed13: mov      rcx, rax
0000000180a9ed16: call     0x18064a270 ; Torappu.Battle.Attributes.RemoveModifier [64274]
0000000180a9ed1b: mov      rdx, qword ptr [rip + 0x7eb8e3e] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9ed22: mov      rcx, rbx
0000000180a9ed25: call     0x18536e540
0000000180a9ed2a: test     rax, rax
0000000180a9ed2d: je       0x180a9ede5
0000000180a9ed33: xor      edx, edx
0000000180a9ed35: mov      rcx, rax
0000000180a9ed38: call     0x180702100 ; Torappu.Battle.Entity.get_buffContainer [66402]
0000000180a9ed3d: test     rax, rax
0000000180a9ed40: je       0x180a9ede5
0000000180a9ed46: xor      edx, edx
0000000180a9ed48: mov      rcx, rax
0000000180a9ed4b: call     0x18066e070 ; Torappu.Battle.Buff.BuffContainer.OnBeforeExitUnbalancedState [65437]
0000000180a9ed50: cmp      byte ptr [rip + 0x81f3c0c], 0
0000000180a9ed57: jne      0x180a9ed78
0000000180a9ed59: lea      rcx, [rip + 0x7e34ba8] ; GenericMethodInfo 281972 @0x1888d3908
0000000180a9ed60: call     0x18048bf00
0000000180a9ed65: lea      rcx, [rip + 0x7de781c] ; TypeInfo Torappu.Battle.Enemy.States.UnbalanceState @0x188886588
0000000180a9ed6c: call     0x18048bf00
0000000180a9ed71: mov      byte ptr [rip + 0x81f3beb], 1
0000000180a9ed78: mov      rax, qword ptr [rip + 0x7de7809] ; TypeInfo Torappu.Battle.Enemy.States.UnbalanceState @0x188886588
0000000180a9ed7f: mov      rcx, qword ptr [rax + 0xb8]
0000000180a9ed86: mov      rcx, qword ptr [rcx + 0x78]
0000000180a9ed8a: test     rcx, rcx
0000000180a9ed8d: jne      0x180a9edb8
0000000180a9ed8f: mov      rcx, qword ptr [rip + 0x7e34b72] ; GenericMethodInfo 281972 @0x1888d3908
0000000180a9ed96: call     0x185337c50
0000000180a9ed9b: test     rax, rax
0000000180a9ed9e: je       0x180a9ede5
0000000180a9eda0: xor      r8d, r8d
0000000180a9eda3: mov      rdx, rbx
0000000180a9eda6: mov      rcx, rax
0000000180a9eda9: mov      rbx, qword ptr [rsp + 0x30]
0000000180a9edae: add      rsp, 0x20
0000000180a9edb2: pop      rdi
0000000180a9edb3: jmp      0x18062bf70 ; Torappu.Battle.BattleController.OnPhysicObjectRecycle [64762]
0000000180a9edb8: xor      r8d, r8d
0000000180a9edbb: mov      rdx, rbx
0000000180a9edbe: mov      rbx, qword ptr [rsp + 0x30]
0000000180a9edc3: add      rsp, 0x20
0000000180a9edc7: pop      rdi
0000000180a9edc8: jmp      0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
0000000180a9edcd: xor      r9d, r9d
0000000180a9edd0: mov      r8d, edi
0000000180a9edd3: mov      rdx, rbx
0000000180a9edd6: mov      rbx, qword ptr [rsp + 0x30]
0000000180a9eddb: add      rsp, 0x20
0000000180a9eddf: pop      rdi
0000000180a9ede0: jmp      0x1834c0e30 ; XLua.DelegateBridge.__Gen_Delegate_Imp55 [2710]
0000000180a9ede5: call     0x18048c0b0
0000000180a9edea: int3     
0000000180a9edeb: int3     
0000000180a9edec: int3     
0000000180a9eded: int3     
0000000180a9edee: int3     
0000000180a9edef: int3     