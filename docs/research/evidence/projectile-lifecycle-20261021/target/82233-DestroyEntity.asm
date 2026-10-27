; Torappu.Battle.GameMode.GameModeFactory.DefaultGameMode.DestroyEntity metadata=82233 token=0x601413a VA=0x180c18e70 RVA=0xc18e70 size=0xf0
0000000180c18e70: mov      qword ptr [rsp + 8], rbx
0000000180c18e75: mov      qword ptr [rsp + 0x10], rsi
0000000180c18e7a: push     rdi
0000000180c18e7b: sub      rsp, 0x30
0000000180c18e7f: cmp      byte ptr [rip + 0x807ab7f], 0
0000000180c18e86: mov      edi, r8d
0000000180c18e89: mov      rbx, rdx
0000000180c18e8c: mov      rsi, rcx
0000000180c18e8f: jne      0x180c18eb0
0000000180c18e91: lea      rcx, [rip + 0x7c8fe78] ; TypeInfo Torappu.Battle.GameMode.GameModeFactory.DefaultGameMode @0x1888a8d10
0000000180c18e98: call     0x18048bf00
0000000180c18e9d: lea      rcx, [rip + 0x7c284c4] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180c18ea4: call     0x18048bf00
0000000180c18ea9: mov      byte ptr [rip + 0x807ab55], 1
0000000180c18eb0: mov      rax, qword ptr [rip + 0x7c8fe59] ; TypeInfo Torappu.Battle.GameMode.GameModeFactory.DefaultGameMode @0x1888a8d10
0000000180c18eb7: mov      r8, qword ptr [rax + 0xb8]
0000000180c18ebe: mov      rcx, qword ptr [r8 + 0x2f8]
0000000180c18ec5: test     rcx, rcx
0000000180c18ec8: jne      0x180c18f2d
0000000180c18eca: mov      rcx, qword ptr [rip + 0x7c28497] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180c18ed1: cmp      dword ptr [rcx + 0xe0], 0
0000000180c18ed8: jne      0x180c18edf
0000000180c18eda: call     0x18048c140
0000000180c18edf: xor      edx, edx
0000000180c18ee1: mov      ecx, edi
0000000180c18ee3: call     0x1806f4e80 ; Torappu.Battle.Entity.IfReasonIsDeath [66713]
0000000180c18ee8: test     al, al
0000000180c18eea: jne      0x180c18f0f
0000000180c18eec: cmp      edi, 1
0000000180c18eef: je       0x180c18f0f
0000000180c18ef1: test     rbx, rbx
0000000180c18ef4: je       0x180c18f54
0000000180c18ef6: xor      edx, edx
0000000180c18ef8: mov      rcx, rbx
0000000180c18efb: mov      rbx, qword ptr [rsp + 0x40]
0000000180c18f00: mov      rsi, qword ptr [rsp + 0x48]
0000000180c18f05: add      rsp, 0x30
0000000180c18f09: pop      rdi
0000000180c18f0a: jmp      0x1806fb210 ; Torappu.Battle.Entity.RecycleSelfImmediately [66634]
0000000180c18f0f: test     rbx, rbx
0000000180c18f12: je       0x180c18f54
0000000180c18f14: xor      edx, edx
0000000180c18f16: mov      rcx, rbx
0000000180c18f19: mov      rbx, qword ptr [rsp + 0x40]
0000000180c18f1e: mov      rsi, qword ptr [rsp + 0x48]
0000000180c18f23: add      rsp, 0x30
0000000180c18f27: pop      rdi
0000000180c18f28: jmp      0x1806fb290 ; Torappu.Battle.Entity.RecycleSelfWithDelay [66635]
0000000180c18f2d: mov      r9d, edi
0000000180c18f30: mov      qword ptr [rsp + 0x20], 0
0000000180c18f39: mov      r8, rbx
0000000180c18f3c: mov      rdx, rsi
0000000180c18f3f: call     0x18331caf0 ; XLua.DelegateBridge.__Gen_Delegate_Imp2874 [5529]
0000000180c18f44: mov      rbx, qword ptr [rsp + 0x40]
0000000180c18f49: mov      rsi, qword ptr [rsp + 0x48]
0000000180c18f4e: add      rsp, 0x30
0000000180c18f52: pop      rdi
0000000180c18f53: ret      
0000000180c18f54: call     0x18048c0b0
0000000180c18f59: int3     
0000000180c18f5a: int3     
0000000180c18f5b: int3     
0000000180c18f5c: int3     
0000000180c18f5d: int3     
0000000180c18f5e: int3     
0000000180c18f5f: int3     