; Torappu.Battle.Enemy.States.MoveState.get_isHanging metadata=76654 token=0x6012b6f VA=0x180a97eb0 RVA=0xa97eb0 size=0xb0
0000000180a97eb0: push     rbx
0000000180a97eb2: sub      rsp, 0x20
0000000180a97eb6: cmp      byte ptr [rip + 0x81faa50], 0
0000000180a97ebd: mov      rbx, rcx
0000000180a97ec0: jne      0x180a97eed
0000000180a97ec2: lea      rcx, [rip + 0x7dedb8f] ; TypeInfo Torappu.Battle.Enemy.States.MoveState @0x188885a58
0000000180a97ec9: call     0x18048bf00
0000000180a97ece: lea      rcx, [rip + 0x7ebfa4b] ; GenericMethodInfo 282793 @0x188957920
0000000180a97ed5: call     0x18048bf00
0000000180a97eda: lea      rcx, [rip + 0x7ebfc7f] ; GenericMethodInfo 282794 @0x188957b60
0000000180a97ee1: call     0x18048bf00
0000000180a97ee6: mov      byte ptr [rip + 0x81faa20], 1
0000000180a97eed: mov      rax, qword ptr [rip + 0x7dedb64] ; TypeInfo Torappu.Battle.Enemy.States.MoveState @0x188885a58
0000000180a97ef4: mov      rcx, qword ptr [rax + 0xb8]
0000000180a97efb: mov      rcx, qword ptr [rcx]
0000000180a97efe: test     rcx, rcx
0000000180a97f01: jne      0x180a97f48
0000000180a97f03: mov      rdx, qword ptr [rip + 0x7ebfa16] ; GenericMethodInfo 282793 @0x188957920
0000000180a97f0a: mov      rcx, rbx
0000000180a97f0d: call     0x18536e4d0
0000000180a97f12: test     rax, rax
0000000180a97f15: je       0x180a97f58
0000000180a97f17: cmp      byte ptr [rax + 0x10], 0
0000000180a97f1b: je       0x180a97f25
0000000180a97f1d: mov      al, 1
0000000180a97f1f: add      rsp, 0x20
0000000180a97f23: pop      rbx
0000000180a97f24: ret      
0000000180a97f25: mov      rdx, qword ptr [rip + 0x7ebfc34] ; GenericMethodInfo 282794 @0x188957b60
0000000180a97f2c: mov      rcx, rbx
0000000180a97f2f: call     0x18536e540
0000000180a97f34: test     rax, rax
0000000180a97f37: je       0x180a97f58
0000000180a97f39: xor      edx, edx
0000000180a97f3b: mov      rcx, rax
0000000180a97f3e: add      rsp, 0x20
0000000180a97f42: pop      rbx
0000000180a97f43: jmp      0x180705270 ; Torappu.Battle.Entity.get_isActuallyGroundBound [66492]
0000000180a97f48: xor      r8d, r8d
0000000180a97f4b: mov      rdx, rbx
0000000180a97f4e: add      rsp, 0x20
0000000180a97f52: pop      rbx
0000000180a97f53: jmp      0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
0000000180a97f58: call     0x18048c0b0
0000000180a97f5d: int3     
0000000180a97f5e: int3     
0000000180a97f5f: int3     
