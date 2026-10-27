; Torappu.Battle.Unit.get_isMovingBySelf metadata=77577 token=0x6012f0a VA=0x180ad2cf0 RVA=0xad2cf0 size=0x60
0000000180ad2cf0: push     rbx
0000000180ad2cf2: sub      rsp, 0x20
0000000180ad2cf6: cmp      byte ptr [rip + 0x81bfe8f], 0
0000000180ad2cfd: mov      rbx, rcx
0000000180ad2d00: jne      0x180ad2d15
0000000180ad2d02: lea      rcx, [rip + 0x7d32337] ; TypeInfo Torappu.Battle.Unit @0x188805040
0000000180ad2d09: call     0x18048bf00
0000000180ad2d0e: mov      byte ptr [rip + 0x81bfe77], 1
0000000180ad2d15: mov      rax, qword ptr [rip + 0x7d32324] ; TypeInfo Torappu.Battle.Unit @0x188805040
0000000180ad2d1c: mov      rdx, qword ptr [rax + 0xb8]
0000000180ad2d23: mov      rcx, qword ptr [rdx + 0x90]
0000000180ad2d2a: test     rcx, rcx
0000000180ad2d2d: jne      0x180ad2d37
0000000180ad2d2f: xor      al, al
0000000180ad2d31: add      rsp, 0x20
0000000180ad2d35: pop      rbx
0000000180ad2d36: ret      
0000000180ad2d37: xor      r8d, r8d
0000000180ad2d3a: mov      rdx, rbx
0000000180ad2d3d: add      rsp, 0x20
0000000180ad2d41: pop      rbx
0000000180ad2d42: jmp      0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
0000000180ad2d47: int3     
0000000180ad2d48: int3     
0000000180ad2d49: int3     
0000000180ad2d4a: int3     
0000000180ad2d4b: int3     
0000000180ad2d4c: int3     
0000000180ad2d4d: int3     
0000000180ad2d4e: int3     
0000000180ad2d4f: int3     
