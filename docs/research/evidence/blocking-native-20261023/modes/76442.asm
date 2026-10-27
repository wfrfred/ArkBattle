; Torappu.Battle.Enemy.OnMotionModeChanged metadata=76442 token=0x6012a9b VA=0x180a71440 RVA=0xa71440 size=0x190
0000000180a71440: mov      qword ptr [rsp + 0x10], rbx
0000000180a71445: mov      qword ptr [rsp + 0x18], rbp
0000000180a7144a: push     rsi
0000000180a7144b: sub      rsp, 0x30
0000000180a7144f: cmp      byte ptr [rip + 0x822142d], 0
0000000180a71456: mov      esi, r8d
0000000180a71459: mov      ebp, edx
0000000180a7145b: mov      rbx, rcx
0000000180a7145e: jne      0x180a7147f
0000000180a71460: lea      rcx, [rip + 0x7daa249] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a71467: call     0x18048bf00
0000000180a7146c: lea      rcx, [rip + 0x7ec1875] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a71473: call     0x18048bf00
0000000180a71478: mov      byte ptr [rip + 0x8221404], 1
0000000180a7147f: mov      rax, qword ptr [rip + 0x7daa22a] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a71486: cmp      dword ptr [rax + 0xe0], 0
0000000180a7148d: jne      0x180a7149e
0000000180a7148f: mov      rcx, rax
0000000180a71492: call     0x18048c140
0000000180a71497: mov      rax, qword ptr [rip + 0x7daa212] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7149e: mov      rax, qword ptr [rax + 0xb8]
0000000180a714a5: mov      rcx, qword ptr [rax + 0x558]
0000000180a714ac: test     rcx, rcx
0000000180a714af: jne      0x180a71594
0000000180a714b5: mov      qword ptr [rsp + 0x40], rdi
0000000180a714ba: xor      r9d, r9d
0000000180a714bd: mov      r8d, esi
0000000180a714c0: mov      edx, ebp
0000000180a714c2: mov      rcx, rbx
0000000180a714c5: call     0x1806f94b0 ; Torappu.Battle.Entity.OnMotionModeChanged [66704]
0000000180a714ca: cmp      byte ptr [rip + 0x825b31f], 0
0000000180a714d1: jbe      0x180a714db
0000000180a714d3: mov      rcx, qword ptr [rbx]
0000000180a714d6: call     0x180446d00
0000000180a714db: mov      rdx, qword ptr [rbx]
0000000180a714de: mov      rcx, rbx
0000000180a714e1: mov      rax, qword ptr [rdx + 0x480]
0000000180a714e8: mov      rdx, qword ptr [rdx + 0x488]
0000000180a714ef: call     rax
0000000180a714f1: mov      rcx, qword ptr [rip + 0x7ec17f0] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a714f8: mov      rdi, rax
0000000180a714fb: cmp      dword ptr [rcx + 0xe0], 0
0000000180a71502: jne      0x180a71509
0000000180a71504: call     0x18048c140
0000000180a71509: xor      r8d, r8d
0000000180a7150c: xor      edx, edx
0000000180a7150e: mov      rcx, rdi
0000000180a71511: call     0x186b63a70
0000000180a71516: test     al, al
0000000180a71518: je       0x180a7157f
0000000180a7151a: cmp      byte ptr [rip + 0x825b2cf], 0
0000000180a71521: jbe      0x180a7152b
0000000180a71523: mov      rcx, qword ptr [rbx]
0000000180a71526: call     0x180446d00
0000000180a7152b: mov      rdx, qword ptr [rbx]
0000000180a7152e: mov      rcx, rbx
0000000180a71531: mov      rax, qword ptr [rdx + 0x480]
0000000180a71538: mov      rdx, qword ptr [rdx + 0x488]
0000000180a7153f: call     rax
0000000180a71541: mov      rdi, rax
0000000180a71544: test     rax, rax
0000000180a71547: je       0x180a715bb
0000000180a71549: cmp      byte ptr [rip + 0x825b2a0], 0
0000000180a71550: jbe      0x180a7155a
0000000180a71552: mov      rcx, qword ptr [rax]
0000000180a71555: call     0x180446d00
0000000180a7155a: mov      rcx, qword ptr [rdi]
0000000180a7155d: mov      r9d, esi
0000000180a71560: mov      r8d, ebp
0000000180a71563: mov      rdx, rbx
0000000180a71566: mov      r10, qword ptr [rcx + 0x370]
0000000180a7156d: mov      rcx, qword ptr [rcx + 0x378]
0000000180a71574: mov      qword ptr [rsp + 0x20], rcx
0000000180a71579: mov      rcx, rdi
0000000180a7157c: call     r10
0000000180a7157f: mov      rdi, qword ptr [rsp + 0x40]
0000000180a71584: mov      rbx, qword ptr [rsp + 0x48]
0000000180a71589: mov      rbp, qword ptr [rsp + 0x50]
0000000180a7158e: add      rsp, 0x30
0000000180a71592: pop      rsi
0000000180a71593: ret      
0000000180a71594: mov      r9d, esi
0000000180a71597: mov      qword ptr [rsp + 0x20], 0
0000000180a715a0: mov      r8d, ebp
0000000180a715a3: mov      rdx, rbx
0000000180a715a6: call     0x18333ac40 ; XLua.DelegateBridge.__Gen_Delegate_Imp3071 [5726]
0000000180a715ab: mov      rbx, qword ptr [rsp + 0x48]
0000000180a715b0: mov      rbp, qword ptr [rsp + 0x50]
0000000180a715b5: add      rsp, 0x30
0000000180a715b9: pop      rsi
0000000180a715ba: ret      
0000000180a715bb: call     0x18048c0b0
0000000180a715c0: int3     
0000000180a715c1: int3     
0000000180a715c2: int3     
0000000180a715c3: int3     
0000000180a715c4: int3     
0000000180a715c5: int3     
0000000180a715c6: int3     
0000000180a715c7: int3     
0000000180a715c8: int3     
0000000180a715c9: int3     
0000000180a715ca: int3     
0000000180a715cb: int3     
0000000180a715cc: int3     
0000000180a715cd: int3     
0000000180a715ce: int3     
0000000180a715cf: int3     