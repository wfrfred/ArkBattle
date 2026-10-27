; Torappu.Battle.GiantTrap.get_minBlockDistToTarget metadata=77105 token=0x6012d32 VA=0x180aa8470 RVA=0xaa8470 size=0x60
0000000180aa8470: push     rbx
0000000180aa8472: sub      rsp, 0x20
0000000180aa8476: cmp      byte ptr [rip + 0x81ea5dd], 0
0000000180aa847d: mov      rbx, rcx
0000000180aa8480: jne      0x180aa8495
0000000180aa8482: lea      rcx, [rip + 0x7e1089f] ; TypeInfo Torappu.Battle.GiantTrap @0x1888b8d28
0000000180aa8489: call     0x18048bf00
0000000180aa848e: mov      byte ptr [rip + 0x81ea5c5], 1
0000000180aa8495: mov      rax, qword ptr [rip + 0x7e1088c] ; TypeInfo Torappu.Battle.GiantTrap @0x1888b8d28
0000000180aa849c: mov      rdx, qword ptr [rax + 0xb8]
0000000180aa84a3: mov      rcx, qword ptr [rdx + 0x10]
0000000180aa84a7: test     rcx, rcx
0000000180aa84aa: jne      0x180aa84ba
0000000180aa84ac: movss    xmm0, dword ptr [rbx + 0x618]
0000000180aa84b4: add      rsp, 0x20
0000000180aa84b8: pop      rbx
0000000180aa84b9: ret      
0000000180aa84ba: xor      r8d, r8d
0000000180aa84bd: mov      rdx, rbx
0000000180aa84c0: add      rsp, 0x20
0000000180aa84c4: pop      rbx
0000000180aa84c5: jmp      0x1836404d0 ; XLua.DelegateBridge.__Gen_Delegate_Imp80 [2735]
0000000180aa84ca: int3     
0000000180aa84cb: int3     
0000000180aa84cc: int3     
0000000180aa84cd: int3     
0000000180aa84ce: int3     
0000000180aa84cf: int3     