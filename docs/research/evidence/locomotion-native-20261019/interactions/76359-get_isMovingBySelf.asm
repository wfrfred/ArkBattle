; Torappu.Battle.Enemy.get_isMovingBySelf metadata=76359 token=0x6012a48 VA=0x180a7e3a0 RVA=0xa7e3a0 size=0xd0
0000000180a7e3a0: push     rbx
0000000180a7e3a2: sub      rsp, 0x20
0000000180a7e3a6: cmp      byte ptr [rip + 0x8214483], 0
0000000180a7e3ad: mov      rbx, rcx
0000000180a7e3b0: jne      0x180a7e3d1
0000000180a7e3b2: lea      rcx, [rip + 0x7d9d2f7] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7e3b9: call     0x18048bf00
0000000180a7e3be: lea      rcx, [rip + 0x7e1db1b] ; GenericMethodInfo 262832 @0x18889bee0
0000000180a7e3c5: call     0x18048bf00
0000000180a7e3ca: mov      byte ptr [rip + 0x821445f], 1
0000000180a7e3d1: mov      rax, qword ptr [rip + 0x7d9d2d8] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7e3d8: cmp      dword ptr [rax + 0xe0], 0
0000000180a7e3df: jne      0x180a7e3f0
0000000180a7e3e1: mov      rcx, rax
0000000180a7e3e4: call     0x18048c140
0000000180a7e3e9: mov      rax, qword ptr [rip + 0x7d9d2c0] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7e3f0: mov      rax, qword ptr [rax + 0xb8]
0000000180a7e3f7: mov      rcx, qword ptr [rax + 0x2c0]
0000000180a7e3fe: test     rcx, rcx
0000000180a7e401: jne      0x180a7e455
0000000180a7e403: cmp      byte ptr [rbx + 0x26], cl
0000000180a7e406: jne      0x180a7e44d
0000000180a7e408: xor      edx, edx
0000000180a7e40a: mov      rcx, rbx
0000000180a7e40d: call     0x180a800c0 ; Torappu.Battle.Enemy.get_stateMachine [76373]
0000000180a7e412: test     rax, rax
0000000180a7e415: je       0x180a7e465
0000000180a7e417: cmp      dword ptr [rax + 0x48], 1
0000000180a7e41b: jne      0x180a7e44d
0000000180a7e41d: xor      edx, edx
0000000180a7e41f: mov      rcx, rbx
0000000180a7e422: call     0x180a800c0 ; Torappu.Battle.Enemy.get_stateMachine [76373]
0000000180a7e427: test     rax, rax
0000000180a7e42a: je       0x180a7e465
0000000180a7e42c: mov      rdx, qword ptr [rip + 0x7e1daad] ; GenericMethodInfo 262832 @0x18889bee0
0000000180a7e433: mov      rcx, rax
0000000180a7e436: call     0x18499ca80
0000000180a7e43b: test     rax, rax
0000000180a7e43e: je       0x180a7e465
0000000180a7e440: cmp      byte ptr [rax + 0x10], 0
0000000180a7e444: sete     al
0000000180a7e447: add      rsp, 0x20
0000000180a7e44b: pop      rbx
0000000180a7e44c: ret      
0000000180a7e44d: xor      al, al
0000000180a7e44f: add      rsp, 0x20
0000000180a7e453: pop      rbx
0000000180a7e454: ret      
0000000180a7e455: xor      r8d, r8d
0000000180a7e458: mov      rdx, rbx
0000000180a7e45b: add      rsp, 0x20
0000000180a7e45f: pop      rbx
0000000180a7e460: jmp      0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
0000000180a7e465: call     0x18048c0b0
0000000180a7e46a: int3     
0000000180a7e46b: int3     
0000000180a7e46c: int3     
0000000180a7e46d: int3     
0000000180a7e46e: int3     
0000000180a7e46f: int3     