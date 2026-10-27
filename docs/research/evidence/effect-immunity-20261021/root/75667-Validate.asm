; Torappu.Battle.TargetValidator.Validate metadata=75667 token=0x6012794 VA=0x180a1fc90 RVA=0xa1fc90 size=0x90
0000000180a1fc90: mov      qword ptr [rsp + 8], rbx
0000000180a1fc95: push     rdi
0000000180a1fc96: sub      rsp, 0x20
0000000180a1fc9a: cmp      byte ptr [rip + 0x8272853], 0
0000000180a1fca1: mov      rdi, rdx
0000000180a1fca4: mov      rbx, rcx
0000000180a1fca7: jne      0x180a1fcbc
0000000180a1fca9: lea      rcx, [rip + 0x7e78228] ; TypeInfo Torappu.Battle.TargetValidator @0x188897ed8
0000000180a1fcb0: call     0x18048bf00
0000000180a1fcb5: mov      byte ptr [rip + 0x8272838], 1
0000000180a1fcbc: mov      rax, qword ptr [rip + 0x7e78215] ; TypeInfo Torappu.Battle.TargetValidator @0x188897ed8
0000000180a1fcc3: mov      r8, qword ptr [rax + 0xb8]
0000000180a1fcca: mov      rcx, qword ptr [r8 + 0x10]
0000000180a1fcce: xor      r9d, r9d
0000000180a1fcd1: test     rcx, rcx
0000000180a1fcd4: jne      0x180a1fd07
0000000180a1fcd6: xor      r8d, r8d
0000000180a1fcd9: lea      rcx, [rbx + 0x18]
0000000180a1fcdd: mov      rdx, rdi
0000000180a1fce0: cmp      byte ptr [rbx + 0x88], r8b
0000000180a1fce7: je       0x180a1fcf8
0000000180a1fce9: mov      rbx, qword ptr [rsp + 0x30]
0000000180a1fcee: add      rsp, 0x20
0000000180a1fcf2: pop      rdi
0000000180a1fcf3: jmp      0x1809fa670 ; Torappu.Battle.TargetOptions.VerifyTargetWithoutCheckingTargetSide [75074]
0000000180a1fcf8: mov      rbx, qword ptr [rsp + 0x30]
0000000180a1fcfd: add      rsp, 0x20
0000000180a1fd01: pop      rdi
0000000180a1fd02: jmp      0x1809fa6e0 ; Torappu.Battle.TargetOptions.VerifyTarget [75072]
0000000180a1fd07: mov      r8, rdi
0000000180a1fd0a: mov      rdx, rbx
0000000180a1fd0d: mov      rbx, qword ptr [rsp + 0x30]
0000000180a1fd12: add      rsp, 0x20
0000000180a1fd16: pop      rdi
0000000180a1fd17: jmp      0x18332fc60 ; XLua.DelegateBridge.__Gen_Delegate_Imp29 [2684]
0000000180a1fd1c: int3     
0000000180a1fd1d: int3     
0000000180a1fd1e: int3     
0000000180a1fd1f: int3     