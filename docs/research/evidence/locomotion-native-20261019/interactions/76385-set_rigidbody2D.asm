; Torappu.Battle.Enemy.set_rigidbody2D metadata=76385 token=0x6012a62 VA=0x180a814f0 RVA=0xa814f0 size=0xa0
0000000180a814f0: mov      qword ptr [rsp + 8], rbx
0000000180a814f5: push     rdi
0000000180a814f6: sub      rsp, 0x20
0000000180a814fa: cmp      byte ptr [rip + 0x8211349], 0
0000000180a81501: mov      rbx, rdx
0000000180a81504: mov      rdi, rcx
0000000180a81507: jne      0x180a8151c
0000000180a81509: lea      rcx, [rip + 0x7d9a1a0] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a81510: call     0x18048bf00
0000000180a81515: mov      byte ptr [rip + 0x821132e], 1
0000000180a8151c: mov      rax, qword ptr [rip + 0x7d9a18d] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a81523: cmp      dword ptr [rax + 0xe0], 0
0000000180a8152a: jne      0x180a8153b
0000000180a8152c: mov      rcx, rax
0000000180a8152f: call     0x18048c140
0000000180a81534: mov      rax, qword ptr [rip + 0x7d9a175] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a8153b: mov      rax, qword ptr [rax + 0xb8]
0000000180a81542: mov      rcx, qword ptr [rax + 0x390]
0000000180a81549: test     rcx, rcx
0000000180a8154c: jne      0x180a8156e
0000000180a8154e: lea      rcx, [rdi + 0x558]
0000000180a81555: mov      qword ptr [rdi + 0x558], rbx
0000000180a8155c: mov      rdx, rbx
0000000180a8155f: mov      rbx, qword ptr [rsp + 0x30]
0000000180a81564: add      rsp, 0x20
0000000180a81568: pop      rdi
0000000180a81569: jmp      0x18048b9e0
0000000180a8156e: xor      r9d, r9d
0000000180a81571: mov      r8, rbx
0000000180a81574: mov      rdx, rdi
0000000180a81577: mov      rbx, qword ptr [rsp + 0x30]
0000000180a8157c: add      rsp, 0x20
0000000180a81580: pop      rdi
0000000180a81581: jmp      0x1832d2220 ; XLua.DelegateBridge.__Gen_Delegate_Imp23 [2678]
0000000180a81586: int3     
0000000180a81587: int3     
0000000180a81588: int3     
0000000180a81589: int3     
0000000180a8158a: int3     
0000000180a8158b: int3     
0000000180a8158c: int3     
0000000180a8158d: int3     
0000000180a8158e: int3     
0000000180a8158f: int3     