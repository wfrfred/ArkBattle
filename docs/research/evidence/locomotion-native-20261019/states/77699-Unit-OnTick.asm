; Torappu.Battle.Unit.OnTick metadata=77699 token=0x6012f84 VA=0x180acbdb0 RVA=0xacbdb0 size=0xf0
0000000180acbdb0: mov      qword ptr [rsp + 8], rbx
0000000180acbdb5: push     rdi
0000000180acbdb6: sub      rsp, 0x20
0000000180acbdba: cmp      byte ptr [rip + 0x81c6e44], 0
0000000180acbdc1: mov      rbx, rdx
0000000180acbdc4: mov      rdi, rcx
0000000180acbdc7: jne      0x180acbde8
0000000180acbdc9: lea      rcx, [rip + 0x7e66f18] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180acbdd0: call     0x18048bf00
0000000180acbdd5: lea      rcx, [rip + 0x7d39264] ; TypeInfo Torappu.Battle.Unit @0x188805040
0000000180acbddc: call     0x18048bf00
0000000180acbde1: mov      byte ptr [rip + 0x81c6e1d], 1
0000000180acbde8: mov      rax, qword ptr [rip + 0x7d39251] ; TypeInfo Torappu.Battle.Unit @0x188805040
0000000180acbdef: mov      rdx, qword ptr [rax + 0xb8]
0000000180acbdf6: mov      rcx, qword ptr [rdx + 0x458]
0000000180acbdfd: test     rcx, rcx
0000000180acbe00: jne      0x180acbe80
0000000180acbe02: xor      r8d, r8d
0000000180acbe05: mov      rdx, rbx
0000000180acbe08: mov      rcx, rdi
0000000180acbe0b: call     0x1806fadf0 ; Torappu.Battle.Entity.OnTick [66697]
0000000180acbe10: mov      rcx, qword ptr [rip + 0x7e66ed1] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180acbe17: mov      rbx, qword ptr [rdi + 0x1c0]
0000000180acbe1e: cmp      dword ptr [rcx + 0xe0], 0
0000000180acbe25: jne      0x180acbe2c
0000000180acbe27: call     0x18048c140
0000000180acbe2c: xor      r8d, r8d
0000000180acbe2f: xor      edx, edx
0000000180acbe31: mov      rcx, rbx
0000000180acbe34: call     0x186b63a70
0000000180acbe39: test     al, al
0000000180acbe3b: je       0x180acbe8e
0000000180acbe3d: mov      rcx, qword ptr [rdi + 0x1c0]
0000000180acbe44: test     rcx, rcx
0000000180acbe47: je       0x180acbe99
0000000180acbe49: xor      edx, edx
0000000180acbe4b: call     0x186b59d80
0000000180acbe50: test     rax, rax
0000000180acbe53: je       0x180acbe99
0000000180acbe55: xor      edx, edx
0000000180acbe57: mov      rcx, rax
0000000180acbe5a: call     0x186b5c980
0000000180acbe5f: test     al, al
0000000180acbe61: je       0x180acbe8e
0000000180acbe63: mov      rcx, qword ptr [rdi + 0x1c0]
0000000180acbe6a: test     rcx, rcx
0000000180acbe6d: je       0x180acbe99
0000000180acbe6f: xor      edx, edx
0000000180acbe71: mov      rbx, qword ptr [rsp + 0x30]
0000000180acbe76: add      rsp, 0x20
0000000180acbe7a: pop      rdi
0000000180acbe7b: jmp      0x180b05c10 ; Torappu.Battle.ShadowController.OnUpdate [78434]
0000000180acbe80: xor      r9d, r9d
0000000180acbe83: mov      r8, rbx
0000000180acbe86: mov      rdx, rdi
0000000180acbe89: call     0x1833f9830 ; XLua.DelegateBridge.__Gen_Delegate_Imp427 [3082]
0000000180acbe8e: mov      rbx, qword ptr [rsp + 0x30]
0000000180acbe93: add      rsp, 0x20
0000000180acbe97: pop      rdi
0000000180acbe98: ret      
0000000180acbe99: call     0x18048c0b0
0000000180acbe9e: int3     
0000000180acbe9f: int3     
