; Torappu.Battle.Unit.get_enableNormalHud metadata=77624 token=0x6012f39 VA=0x180ad1380 RVA=0xad1380 size=0x60
0000000180ad1380: push     rbx
0000000180ad1382: sub      rsp, 0x20
0000000180ad1386: cmp      byte ptr [rip + 0x81c182e], 0
0000000180ad138d: mov      rbx, rcx
0000000180ad1390: jne      0x180ad13a5
0000000180ad1392: lea      rcx, [rip + 0x7d33ca7] ; TypeInfo Torappu.Battle.Unit @0x188805040
0000000180ad1399: call     0x18048bf00
0000000180ad139e: mov      byte ptr [rip + 0x81c1816], 1
0000000180ad13a5: mov      rax, qword ptr [rip + 0x7d33c94] ; TypeInfo Torappu.Battle.Unit @0x188805040
0000000180ad13ac: mov      rdx, qword ptr [rax + 0xb8]
0000000180ad13b3: mov      rcx, qword ptr [rdx + 0x208]
0000000180ad13ba: test     rcx, rcx
0000000180ad13bd: jne      0x180ad13c7
0000000180ad13bf: mov      al, 1
0000000180ad13c1: add      rsp, 0x20
0000000180ad13c5: pop      rbx
0000000180ad13c6: ret      
0000000180ad13c7: xor      r8d, r8d
0000000180ad13ca: mov      rdx, rbx
0000000180ad13cd: add      rsp, 0x20
0000000180ad13d1: pop      rbx
0000000180ad13d2: jmp      0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
0000000180ad13d7: int3     
0000000180ad13d8: int3     
0000000180ad13d9: int3     
0000000180ad13da: int3     
0000000180ad13db: int3     
0000000180ad13dc: int3     
0000000180ad13dd: int3     
0000000180ad13de: int3     
0000000180ad13df: int3     