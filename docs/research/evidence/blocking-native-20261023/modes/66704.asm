; Torappu.Battle.Entity.OnMotionModeChanged metadata=66704 token=0x6010491 VA=0x1806f94b0 RVA=0x6f94b0 size=0xc0
00000001806f94b0: mov      qword ptr [rsp + 8], rbx
00000001806f94b5: mov      qword ptr [rsp + 0x10], rsi
00000001806f94ba: push     rdi
00000001806f94bb: sub      rsp, 0x30
00000001806f94bf: cmp      byte ptr [rip + 0x859745a], 0
00000001806f94c6: mov      edi, r8d
00000001806f94c9: mov      esi, edx
00000001806f94cb: mov      rbx, rcx
00000001806f94ce: jne      0x1806f94e3
00000001806f94d0: lea      rcx, [rip + 0x8147e91] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806f94d7: call     0x18048bf00
00000001806f94dc: mov      byte ptr [rip + 0x859743d], 1
00000001806f94e3: mov      rax, qword ptr [rip + 0x8147e7e] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806f94ea: cmp      dword ptr [rax + 0xe0], 0
00000001806f94f1: jne      0x1806f9502
00000001806f94f3: mov      rcx, rax
00000001806f94f6: call     0x18048c140
00000001806f94fb: mov      rax, qword ptr [rip + 0x8147e66] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806f9502: mov      rax, qword ptr [rax + 0xb8]
00000001806f9509: mov      rcx, qword ptr [rax + 0xaa0]
00000001806f9510: test     rcx, rcx
00000001806f9513: jne      0x1806f953d
00000001806f9515: xor      edx, edx
00000001806f9517: mov      rcx, rbx
00000001806f951a: call     0x180702100 ; Torappu.Battle.Entity.get_buffContainer [66402]
00000001806f951f: test     rax, rax
00000001806f9522: je       0x1806f9564
00000001806f9524: xor      edx, edx
00000001806f9526: mov      rcx, rax
00000001806f9529: mov      rbx, qword ptr [rsp + 0x40]
00000001806f952e: mov      rsi, qword ptr [rsp + 0x48]
00000001806f9533: add      rsp, 0x30
00000001806f9537: pop      rdi
00000001806f9538: jmp      0x180673730 ; Torappu.Battle.Buff.BuffContainer.OnMotionModeChanged [65442]
00000001806f953d: mov      r9d, edi
00000001806f9540: mov      qword ptr [rsp + 0x20], 0
00000001806f9549: mov      r8d, esi
00000001806f954c: mov      rdx, rbx
00000001806f954f: call     0x18333ac40 ; XLua.DelegateBridge.__Gen_Delegate_Imp3071 [5726]
00000001806f9554: mov      rbx, qword ptr [rsp + 0x40]
00000001806f9559: mov      rsi, qword ptr [rsp + 0x48]
00000001806f955e: add      rsp, 0x30
00000001806f9562: pop      rdi
00000001806f9563: ret      
00000001806f9564: call     0x18048c0b0
00000001806f9569: int3     
00000001806f956a: int3     
00000001806f956b: int3     
00000001806f956c: int3     
00000001806f956d: int3     
00000001806f956e: int3     
00000001806f956f: int3     