; Torappu.Battle.Enemy.get_ignoreBlockMode metadata=76550 token=0x6012b07 VA=0x180a7daa0 RVA=0xa7daa0 size=0x80
0000000180a7daa0: push     rbx
0000000180a7daa2: sub      rsp, 0x20
0000000180a7daa6: cmp      byte ptr [rip + 0x8214e42], 0
0000000180a7daad: mov      rbx, rcx
0000000180a7dab0: jne      0x180a7dac5
0000000180a7dab2: lea      rcx, [rip + 0x7d9dbf7] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7dab9: call     0x18048bf00
0000000180a7dabe: mov      byte ptr [rip + 0x8214e2a], 1
0000000180a7dac5: mov      rax, qword ptr [rip + 0x7d9dbe4] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7dacc: cmp      dword ptr [rax + 0xe0], 0
0000000180a7dad3: jne      0x180a7dae4
0000000180a7dad5: mov      rcx, rax
0000000180a7dad8: call     0x18048c140
0000000180a7dadd: mov      rax, qword ptr [rip + 0x7d9dbcc] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7dae4: mov      rax, qword ptr [rax + 0xb8]
0000000180a7daeb: mov      rcx, qword ptr [rax + 0x8b8]
0000000180a7daf2: test     rcx, rcx
0000000180a7daf5: jne      0x180a7db04
0000000180a7daf7: movzx    eax, byte ptr [rbx + 0x33e]
0000000180a7dafe: add      rsp, 0x20
0000000180a7db02: pop      rbx
0000000180a7db03: ret      
0000000180a7db04: xor      r8d, r8d
0000000180a7db07: mov      rdx, rbx
0000000180a7db0a: add      rsp, 0x20
0000000180a7db0e: pop      rbx
0000000180a7db0f: jmp      0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
0000000180a7db14: int3     
0000000180a7db15: int3     
0000000180a7db16: int3     
0000000180a7db17: int3     
0000000180a7db18: int3     
0000000180a7db19: int3     
0000000180a7db1a: int3     
0000000180a7db1b: int3     
0000000180a7db1c: int3     
0000000180a7db1d: int3     
0000000180a7db1e: int3     
0000000180a7db1f: int3     