; Torappu.Battle.Trap.get_blockRadiusSquare metadata=77516 token=0x6012ecd VA=0x180aa7fb0 RVA=0xaa7fb0 size=0x60
0000000180aa7fb0: push     rbx
0000000180aa7fb2: sub      rsp, 0x20
0000000180aa7fb6: cmp      byte ptr [rip + 0x81eabae], 0
0000000180aa7fbd: mov      rbx, rcx
0000000180aa7fc0: jne      0x180aa7fd5
0000000180aa7fc2: lea      rcx, [rip + 0x7e48337] ; TypeInfo Torappu.Battle.Trap @0x1888f0300
0000000180aa7fc9: call     0x18048bf00
0000000180aa7fce: mov      byte ptr [rip + 0x81eab96], 1
0000000180aa7fd5: mov      rax, qword ptr [rip + 0x7e48324] ; TypeInfo Torappu.Battle.Trap @0x1888f0300
0000000180aa7fdc: mov      rdx, qword ptr [rax + 0xb8]
0000000180aa7fe3: mov      rcx, qword ptr [rdx + 0x90]
0000000180aa7fea: test     rcx, rcx
0000000180aa7fed: jne      0x180aa7ffd
0000000180aa7fef: movss    xmm0, dword ptr [rbx + 0x57c]
0000000180aa7ff7: add      rsp, 0x20
0000000180aa7ffb: pop      rbx
0000000180aa7ffc: ret      
0000000180aa7ffd: xor      r8d, r8d
0000000180aa8000: mov      rdx, rbx
0000000180aa8003: add      rsp, 0x20
0000000180aa8007: pop      rbx
0000000180aa8008: jmp      0x1836404d0 ; XLua.DelegateBridge.__Gen_Delegate_Imp80 [2735]
0000000180aa800d: int3     
0000000180aa800e: int3     
0000000180aa800f: int3     