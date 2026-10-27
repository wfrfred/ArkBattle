; Torappu.Battle.Action.Nodes.CharSearchBlockeeImmediate.Execute metadata=99962 token=0x601867b VA=0x181162e20 RVA=0x1162e20 size=0x160
0000000181162e20: mov      qword ptr [rsp + 0x10], rbp
0000000181162e25: mov      qword ptr [rsp + 0x18], rsi
0000000181162e2a: mov      qword ptr [rsp + 0x20], rdi
0000000181162e2f: push     r14
0000000181162e31: sub      rsp, 0x30
0000000181162e35: cmp      byte ptr [rip + 0x7b346c4], 0
0000000181162e3c: mov      rdi, r9
0000000181162e3f: mov      ebp, r8d
0000000181162e42: mov      r14, rdx
0000000181162e45: mov      rsi, rcx
0000000181162e48: jne      0x181162e75
0000000181162e4a: lea      rcx, [rip + 0x76d1927] ; TypeInfo Torappu.Battle.Action.Nodes.CharSearchBlockeeImmediate @0x188834778
0000000181162e51: call     0x18048bf00
0000000181162e56: lea      rcx, [rip + 0x770940b] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000181162e5d: call     0x18048bf00
0000000181162e62: lea      rcx, [rip + 0x77cfe7f] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000181162e69: call     0x18048bf00
0000000181162e6e: mov      byte ptr [rip + 0x7b3468b], 1
0000000181162e75: mov      rax, qword ptr [rip + 0x76d18fc] ; TypeInfo Torappu.Battle.Action.Nodes.CharSearchBlockeeImmediate @0x188834778
0000000181162e7c: mov      qword ptr [rsp + 0x40], rbx
0000000181162e81: mov      rcx, qword ptr [rax + 0xb8]
0000000181162e88: mov      rcx, qword ptr [rcx + 8]
0000000181162e8c: test     rcx, rcx
0000000181162e8f: jne      0x181162f3d
0000000181162e95: mov      edx, dword ptr [rsi + 0x10]
0000000181162e98: xor      r8d, r8d
0000000181162e9b: mov      rcx, rdi
0000000181162e9e: call     0x180fceed0 ; Torappu.Battle.Action.Nodes.GetActionTarget [95120]
0000000181162ea3: mov      rdx, qword ptr [rip + 0x77093be] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000181162eaa: mov      rdi, rax
0000000181162ead: test     rax, rax
0000000181162eb0: jne      0x181162eb6
0000000181162eb2: xor      ebx, ebx
0000000181162eb4: jmp      0x181162f00
0000000181162eb6: cmp      byte ptr [rip + 0x7b69933], 0
0000000181162ebd: mov      r8, qword ptr [rax]
0000000181162ec0: jbe      0x181162ed0
0000000181162ec2: mov      rcx, r8
0000000181162ec5: call     0x1804463e0
0000000181162eca: xor      ebx, ebx
0000000181162ecc: test     al, al
0000000181162ece: jmp      0x181162efc
0000000181162ed0: movzx    eax, byte ptr [rdx + 0x130]
0000000181162ed7: xor      ebx, ebx
0000000181162ed9: cmp      byte ptr [r8 + 0x130], al
0000000181162ee0: jb       0x181162ef8
0000000181162ee2: movzx    ecx, al
0000000181162ee5: mov      rax, qword ptr [r8 + 0xc8]
0000000181162eec: cmp      qword ptr [rax + rcx*8 - 8], rdx
0000000181162ef1: mov      eax, 1
0000000181162ef6: je       0x181162efa
0000000181162ef8: mov      eax, ebx
0000000181162efa: test     eax, eax
0000000181162efc: cmovne   rbx, rdi
0000000181162f00: mov      rcx, qword ptr [rip + 0x77cfde1] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000181162f07: cmp      dword ptr [rcx + 0xe0], 0
0000000181162f0e: jne      0x181162f15
0000000181162f10: call     0x18048c140
0000000181162f15: xor      r8d, r8d
0000000181162f18: xor      edx, edx
0000000181162f1a: mov      rcx, rbx
0000000181162f1d: call     0x186b638d0
0000000181162f22: test     al, al
0000000181162f24: jne      0x181162f39
0000000181162f26: test     rbx, rbx
0000000181162f29: je       0x181162f72
0000000181162f2b: xor      edx, edx
0000000181162f2d: mov      rcx, rbx
0000000181162f30: call     0x180a31400 ; Torappu.Battle.Character.SearchBlockeeImmediate [75955]
0000000181162f35: mov      al, 1
0000000181162f37: jmp      0x181162f57
0000000181162f39: xor      al, al
0000000181162f3b: jmp      0x181162f57
0000000181162f3d: xor      ebx, ebx
0000000181162f3f: mov      r9d, ebp
0000000181162f42: mov      qword ptr [rsp + 0x28], rbx
0000000181162f47: mov      r8, r14
0000000181162f4a: mov      rdx, rsi
0000000181162f4d: mov      qword ptr [rsp + 0x20], rdi
0000000181162f52: call     0x183108750 ; XLua.DelegateBridge.__Gen_Delegate_Imp11071 [13726]
0000000181162f57: mov      rbx, qword ptr [rsp + 0x40]
0000000181162f5c: mov      rbp, qword ptr [rsp + 0x48]
0000000181162f61: mov      rsi, qword ptr [rsp + 0x50]
0000000181162f66: mov      rdi, qword ptr [rsp + 0x58]
0000000181162f6b: add      rsp, 0x30
0000000181162f6f: pop      r14
0000000181162f71: ret      
0000000181162f72: call     0x18048c0b0
0000000181162f77: int3     
0000000181162f78: int3     
0000000181162f79: int3     
0000000181162f7a: int3     
0000000181162f7b: int3     
0000000181162f7c: int3     
0000000181162f7d: int3     
0000000181162f7e: int3     
0000000181162f7f: int3     