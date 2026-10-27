; Torappu.Battle.Character.get_isInCombat metadata=75836 token=0x601283d VA=0x180a3b070 RVA=0xa3b070 size=0x90
0000000180a3b070: push     rbx
0000000180a3b072: sub      rsp, 0x20
0000000180a3b076: cmp      byte ptr [rip + 0x82574f9], 0
0000000180a3b07d: mov      rbx, rcx
0000000180a3b080: jne      0x180a3b095
0000000180a3b082: lea      rcx, [rip + 0x7e311df] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a3b089: call     0x18048bf00
0000000180a3b08e: mov      byte ptr [rip + 0x82574e1], 1
0000000180a3b095: mov      rax, qword ptr [rip + 0x7e311cc] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a3b09c: cmp      dword ptr [rax + 0xe0], 0
0000000180a3b0a3: jne      0x180a3b0b4
0000000180a3b0a5: mov      rcx, rax
0000000180a3b0a8: call     0x18048c140
0000000180a3b0ad: mov      rax, qword ptr [rip + 0x7e311b4] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a3b0b4: mov      rax, qword ptr [rax + 0xb8]
0000000180a3b0bb: mov      rcx, qword ptr [rax + 0xa0]
0000000180a3b0c2: test     rcx, rcx
0000000180a3b0c5: jne      0x180a3b0e5
0000000180a3b0c7: mov      rcx, qword ptr [rbx + 0x510]
0000000180a3b0ce: test     rcx, rcx
0000000180a3b0d1: je       0x180a3b0f5
0000000180a3b0d3: xor      edx, edx
0000000180a3b0d5: call     0x180aa1900 ; Torappu.Battle.BlockManager.get_blockEnemyCnt [77187]
0000000180a3b0da: test     eax, eax
0000000180a3b0dc: setg     al
0000000180a3b0df: add      rsp, 0x20
0000000180a3b0e3: pop      rbx
0000000180a3b0e4: ret      
0000000180a3b0e5: xor      r8d, r8d
0000000180a3b0e8: mov      rdx, rbx
0000000180a3b0eb: add      rsp, 0x20
0000000180a3b0ef: pop      rbx
0000000180a3b0f0: jmp      0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
0000000180a3b0f5: call     0x18048c0b0
0000000180a3b0fa: int3     
0000000180a3b0fb: int3     
0000000180a3b0fc: int3     
0000000180a3b0fd: int3     
0000000180a3b0fe: int3     
0000000180a3b0ff: int3     