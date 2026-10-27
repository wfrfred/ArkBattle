; Torappu.Battle.BattleController.StartBattleCoroutine metadata=64743 token=0x600fce8 VA=0x180633110 RVA=0x633110 size=0x1f0
0000000180633110: mov      qword ptr [rsp + 8], rbx
0000000180633115: mov      qword ptr [rsp + 0x10], rsi
000000018063311a: push     rdi
000000018063311b: sub      rsp, 0x40
000000018063311f: cmp      byte ptr [rip + 0x865cfec], 0
0000000180633126: mov      rsi, r8
0000000180633129: mov      rbx, rdx
000000018063312c: mov      rdi, rcx
000000018063312f: jne      0x180633180
0000000180633131: lea      rcx, [rip + 0x82f4c28] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
0000000180633138: call     0x18048bf00
000000018063313d: lea      rcx, [rip + 0x82b2e34] ; TypeInfo Torappu.Battle.CoroutineId @0x1888e5f78
0000000180633144: call     0x18048bf00
0000000180633149: lea      rcx, [rip + 0x82fb8d0] ; TypeInfo UnityEngine.DLog @0x18892ea20
0000000180633150: call     0x18048bf00
0000000180633155: lea      rcx, [rip + 0x82a056c] ; GenericMethodInfo 281971 @0x1888d36c8
000000018063315c: call     0x18048bf00
0000000180633161: lea      rcx, [rip + 0x82a07a0] ; GenericMethodInfo 281972 @0x1888d3908
0000000180633168: call     0x18048bf00
000000018063316d: lea      rcx, [rip + 0x831abfc] ; StringLiteral '[BattleController] Failed to start coroutine since BattleController is invalid.' @0x18894dd70
0000000180633174: call     0x18048bf00
0000000180633179: mov      byte ptr [rip + 0x865cf92], 1
0000000180633180: mov      rcx, qword ptr [rip + 0x82f4bd9] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
0000000180633187: cmp      dword ptr [rcx + 0xe0], 0
000000018063318e: jne      0x18063319c
0000000180633190: call     0x18048c140
0000000180633195: mov      rcx, qword ptr [rip + 0x82f4bc4] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
000000018063319c: mov      rax, qword ptr [rcx + 0xb8]
00000001806331a3: mov      rdx, qword ptr [rax + 0x9e0]
00000001806331aa: test     rdx, rdx
00000001806331ad: jne      0x1806332bf
00000001806331b3: cmp      dword ptr [rcx + 0xe0], edx
00000001806331b9: jne      0x1806331c0
00000001806331bb: call     0x18048c140
00000001806331c0: xor      ecx, ecx
00000001806331c2: call     0x180642080 ; Torappu.Battle.BattleController.get_isDeterministic [64441]
00000001806331c7: test     al, al
00000001806331c9: jne      0x18063320f
00000001806331cb: test     rbx, rbx
00000001806331ce: je       0x1806332f1
00000001806331d4: xor      r8d, r8d
00000001806331d7: mov      rdx, rsi
00000001806331da: mov      rcx, rbx
00000001806331dd: call     0x186b60e10
00000001806331e2: mov      rcx, qword ptr [rip + 0x82b2d8f] ; TypeInfo Torappu.Battle.CoroutineId @0x1888e5f78
00000001806331e9: mov      rbx, rax
00000001806331ec: cmp      dword ptr [rcx + 0xe0], 0
00000001806331f3: jne      0x1806331fa
00000001806331f5: call     0x18048c140
00000001806331fa: xor      r8d, r8d
00000001806331fd: lea      rcx, [rsp + 0x30]
0000000180633202: mov      rdx, rbx
0000000180633205: call     0x18065cff0 ; Torappu.Battle.CoroutineId.op_Explicit [64227]
000000018063320a: jmp      0x1806332d8
000000018063320f: mov      rcx, qword ptr [rip + 0x82a04b2] ; GenericMethodInfo 281971 @0x1888d36c8
0000000180633216: call     0x185337b70
000000018063321b: test     al, al
000000018063321d: jne      0x18063326a
000000018063321f: mov      rcx, qword ptr [rip + 0x82fb7fa] ; TypeInfo UnityEngine.DLog @0x18892ea20
0000000180633226: cmp      dword ptr [rcx + 0xe0], 0
000000018063322d: jne      0x180633234
000000018063322f: call     0x18048c140
0000000180633234: mov      rcx, qword ptr [rip + 0x831ab35] ; StringLiteral '[BattleController] Failed to start coroutine since BattleController is invalid.' @0x18894dd70
000000018063323b: xor      edx, edx
000000018063323d: call     0x1866dd600
0000000180633242: mov      rax, qword ptr [rip + 0x82b2d2f] ; TypeInfo Torappu.Battle.CoroutineId @0x1888e5f78
0000000180633249: cmp      dword ptr [rax + 0xe0], 0
0000000180633250: jne      0x180633261
0000000180633252: mov      rcx, rax
0000000180633255: call     0x18048c140
000000018063325a: mov      rax, qword ptr [rip + 0x82b2d17] ; TypeInfo Torappu.Battle.CoroutineId @0x1888e5f78
0000000180633261: mov      rax, qword ptr [rax + 0xb8]
0000000180633268: jmp      0x1806332d8
000000018063326a: mov      rcx, qword ptr [rip + 0x82a0697] ; GenericMethodInfo 281972 @0x1888d3908
0000000180633271: call     0x185337c50
0000000180633276: test     rax, rax
0000000180633279: je       0x1806332f1
000000018063327b: mov      rcx, qword ptr [rax + 0x130]
0000000180633282: test     rcx, rcx
0000000180633285: je       0x1806332f1
0000000180633287: xor      r9d, r9d
000000018063328a: mov      r8, rsi
000000018063328d: mov      rdx, rbx
0000000180633290: call     0x18065d200 ; Torappu.Battle.CoroutineSimulator.StartCoroutine [64232]
0000000180633295: mov      rcx, qword ptr [rip + 0x82b2cdc] ; TypeInfo Torappu.Battle.CoroutineId @0x1888e5f78
000000018063329c: mov      rbx, rax
000000018063329f: cmp      dword ptr [rcx + 0xe0], 0
00000001806332a6: jne      0x1806332ad
00000001806332a8: call     0x18048c140
00000001806332ad: xor      r8d, r8d
00000001806332b0: lea      rcx, [rsp + 0x30]
00000001806332b5: mov      rdx, rbx
00000001806332b8: call     0x18065cfe0 ; Torappu.Battle.CoroutineId.op_Explicit [64228]
00000001806332bd: jmp      0x1806332d8
00000001806332bf: mov      r9, rsi
00000001806332c2: mov      qword ptr [rsp + 0x20], 0
00000001806332cb: mov      r8, rbx
00000001806332ce: lea      rcx, [rsp + 0x30]
00000001806332d3: call     0x18331b6a0 ; XLua.DelegateBridge.__Gen_Delegate_Imp2866 [5521]
00000001806332d8: movups   xmm0, xmmword ptr [rax]
00000001806332db: mov      rbx, qword ptr [rsp + 0x50]
00000001806332e0: mov      rax, rdi
00000001806332e3: mov      rsi, qword ptr [rsp + 0x58]
00000001806332e8: movups   xmmword ptr [rdi], xmm0
00000001806332eb: add      rsp, 0x40
00000001806332ef: pop      rdi
00000001806332f0: ret      
00000001806332f1: call     0x18048c0b0
00000001806332f6: int3     
00000001806332f7: int3     
00000001806332f8: int3     
00000001806332f9: int3     
00000001806332fa: int3     
00000001806332fb: int3     
00000001806332fc: int3     
00000001806332fd: int3     
00000001806332fe: int3     
00000001806332ff: int3     