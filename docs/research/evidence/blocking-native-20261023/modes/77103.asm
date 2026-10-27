; Torappu.Battle.GiantTrap.get_blockRadiusSquare metadata=77103 token=0x6012d30 VA=0x180aa82f0 RVA=0xaa82f0 size=0x60
0000000180aa82f0: push     rbx
0000000180aa82f2: sub      rsp, 0x20
0000000180aa82f6: cmp      byte ptr [rip + 0x81ea75b], 0
0000000180aa82fd: mov      rbx, rcx
0000000180aa8300: jne      0x180aa8315
0000000180aa8302: lea      rcx, [rip + 0x7e10a1f] ; TypeInfo Torappu.Battle.GiantTrap @0x1888b8d28
0000000180aa8309: call     0x18048bf00
0000000180aa830e: mov      byte ptr [rip + 0x81ea743], 1
0000000180aa8315: mov      rax, qword ptr [rip + 0x7e10a0c] ; TypeInfo Torappu.Battle.GiantTrap @0x1888b8d28
0000000180aa831c: mov      rdx, qword ptr [rax + 0xb8]
0000000180aa8323: mov      rcx, qword ptr [rdx]
0000000180aa8326: test     rcx, rcx
0000000180aa8329: jne      0x180aa8339
0000000180aa832b: movss    xmm0, dword ptr [rip + 0x63998cd]
0000000180aa8333: add      rsp, 0x20
0000000180aa8337: pop      rbx
0000000180aa8338: ret      
0000000180aa8339: xor      r8d, r8d
0000000180aa833c: mov      rdx, rbx
0000000180aa833f: add      rsp, 0x20
0000000180aa8343: pop      rbx
0000000180aa8344: jmp      0x1836404d0 ; XLua.DelegateBridge.__Gen_Delegate_Imp80 [2735]
0000000180aa8349: int3     
0000000180aa834a: int3     
0000000180aa834b: int3     
0000000180aa834c: int3     
0000000180aa834d: int3     
0000000180aa834e: int3     
0000000180aa834f: int3     