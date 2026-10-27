; Torappu.Battle.Character.get_alive metadata=75822 token=0x601282f VA=0x180a38df0 RVA=0xa38df0 size=0xc0
0000000180a38df0: push     rbx
0000000180a38df2: sub      rsp, 0x20
0000000180a38df6: cmp      byte ptr [rip + 0x825976b], 0
0000000180a38dfd: mov      rbx, rcx
0000000180a38e00: jne      0x180a38e15
0000000180a38e02: lea      rcx, [rip + 0x7e3345f] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a38e09: call     0x18048bf00
0000000180a38e0e: mov      byte ptr [rip + 0x8259753], 1
0000000180a38e15: mov      rax, qword ptr [rip + 0x7e3344c] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a38e1c: cmp      dword ptr [rax + 0xe0], 0
0000000180a38e23: jne      0x180a38e34
0000000180a38e25: mov      rcx, rax
0000000180a38e28: call     0x18048c140
0000000180a38e2d: mov      rax, qword ptr [rip + 0x7e33434] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a38e34: mov      rax, qword ptr [rax + 0xb8]
0000000180a38e3b: mov      rcx, qword ptr [rax + 0x30]
0000000180a38e3f: test     rcx, rcx
0000000180a38e42: jne      0x180a38e9a
0000000180a38e44: xor      edx, edx
0000000180a38e46: mov      rcx, rbx
0000000180a38e49: call     0x180ad2c00 ; Torappu.Battle.Unit.get_isDummy [77610]
0000000180a38e4e: test     al, al
0000000180a38e50: jne      0x180a38e92
0000000180a38e52: xor      edx, edx
0000000180a38e54: mov      rcx, rbx
0000000180a38e57: call     0x180701920 ; Torappu.Battle.Entity.get_alive [66349]
0000000180a38e5c: test     al, al
0000000180a38e5e: je       0x180a38e92
0000000180a38e60: cmp      byte ptr [rip + 0x8293989], 0
0000000180a38e67: jbe      0x180a38e71
0000000180a38e69: mov      rcx, qword ptr [rbx]
0000000180a38e6c: call     0x180446d00
0000000180a38e71: mov      rdx, qword ptr [rbx]
0000000180a38e74: mov      rcx, rbx
0000000180a38e77: mov      rax, qword ptr [rdx + 0xb00]
0000000180a38e7e: mov      rdx, qword ptr [rdx + 0xb08]
0000000180a38e85: call     rax
0000000180a38e87: test     al, al
0000000180a38e89: sete     al
0000000180a38e8c: add      rsp, 0x20
0000000180a38e90: pop      rbx
0000000180a38e91: ret      
0000000180a38e92: xor      al, al
0000000180a38e94: add      rsp, 0x20
0000000180a38e98: pop      rbx
0000000180a38e99: ret      
0000000180a38e9a: xor      r8d, r8d
0000000180a38e9d: mov      rdx, rbx
0000000180a38ea0: add      rsp, 0x20
0000000180a38ea4: pop      rbx
0000000180a38ea5: jmp      0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
0000000180a38eaa: int3     
0000000180a38eab: int3     
0000000180a38eac: int3     
0000000180a38ead: int3     
0000000180a38eae: int3     
0000000180a38eaf: int3     