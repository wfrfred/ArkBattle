; Torappu.Battle.Enemy.get_cursor metadata=76397 token=0x6012a6e VA=0x180a7bf80 RVA=0xa7bf80 size=0x80
0000000180a7bf80: push     rbx
0000000180a7bf82: sub      rsp, 0x20
0000000180a7bf86: cmp      byte ptr [rip + 0x82168c9], 0
0000000180a7bf8d: mov      rbx, rcx
0000000180a7bf90: jne      0x180a7bfa5
0000000180a7bf92: lea      rcx, [rip + 0x7d9f717] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7bf99: call     0x18048bf00
0000000180a7bf9e: mov      byte ptr [rip + 0x82168b1], 1
0000000180a7bfa5: mov      rax, qword ptr [rip + 0x7d9f704] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7bfac: cmp      dword ptr [rax + 0xe0], 0
0000000180a7bfb3: jne      0x180a7bfc4
0000000180a7bfb5: mov      rcx, rax
0000000180a7bfb8: call     0x18048c140
0000000180a7bfbd: mov      rax, qword ptr [rip + 0x7d9f6ec] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7bfc4: mov      rax, qword ptr [rax + 0xb8]
0000000180a7bfcb: mov      rcx, qword ptr [rax + 0x3f0]
0000000180a7bfd2: test     rcx, rcx
0000000180a7bfd5: jne      0x180a7bfe4
0000000180a7bfd7: mov      rax, qword ptr [rbx + 0x368]
0000000180a7bfde: add      rsp, 0x20
0000000180a7bfe2: pop      rbx
0000000180a7bfe3: ret      
0000000180a7bfe4: xor      r8d, r8d
0000000180a7bfe7: mov      rdx, rbx
0000000180a7bfea: add      rsp, 0x20
0000000180a7bfee: pop      rbx
0000000180a7bfef: jmp      0x1833953f0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3644 [6299]
0000000180a7bff4: int3     
0000000180a7bff5: int3     
0000000180a7bff6: int3     
0000000180a7bff7: int3     
0000000180a7bff8: int3     
0000000180a7bff9: int3     
0000000180a7bffa: int3     
0000000180a7bffb: int3     
0000000180a7bffc: int3     
0000000180a7bffd: int3     
0000000180a7bffe: int3     
0000000180a7bfff: int3     
