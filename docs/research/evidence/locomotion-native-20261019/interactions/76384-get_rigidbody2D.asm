; Torappu.Battle.Enemy.get_rigidbody2D metadata=76384 token=0x6012a61 VA=0x180a7f9d0 RVA=0xa7f9d0 size=0x80
0000000180a7f9d0: push     rbx
0000000180a7f9d2: sub      rsp, 0x20
0000000180a7f9d6: cmp      byte ptr [rip + 0x8212e6c], 0
0000000180a7f9dd: mov      rbx, rcx
0000000180a7f9e0: jne      0x180a7f9f5
0000000180a7f9e2: lea      rcx, [rip + 0x7d9bcc7] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7f9e9: call     0x18048bf00
0000000180a7f9ee: mov      byte ptr [rip + 0x8212e54], 1
0000000180a7f9f5: mov      rax, qword ptr [rip + 0x7d9bcb4] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7f9fc: cmp      dword ptr [rax + 0xe0], 0
0000000180a7fa03: jne      0x180a7fa14
0000000180a7fa05: mov      rcx, rax
0000000180a7fa08: call     0x18048c140
0000000180a7fa0d: mov      rax, qword ptr [rip + 0x7d9bc9c] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7fa14: mov      rax, qword ptr [rax + 0xb8]
0000000180a7fa1b: mov      rcx, qword ptr [rax + 0x388]
0000000180a7fa22: test     rcx, rcx
0000000180a7fa25: jne      0x180a7fa34
0000000180a7fa27: mov      rax, qword ptr [rbx + 0x558]
0000000180a7fa2e: add      rsp, 0x20
0000000180a7fa32: pop      rbx
0000000180a7fa33: ret      
0000000180a7fa34: xor      r8d, r8d
0000000180a7fa37: mov      rdx, rbx
0000000180a7fa3a: add      rsp, 0x20
0000000180a7fa3e: pop      rbx
0000000180a7fa3f: jmp      0x18339eba0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3705 [6360]
0000000180a7fa44: int3     
0000000180a7fa45: int3     
0000000180a7fa46: int3     
0000000180a7fa47: int3     
0000000180a7fa48: int3     
0000000180a7fa49: int3     
0000000180a7fa4a: int3     
0000000180a7fa4b: int3     
0000000180a7fa4c: int3     
0000000180a7fa4d: int3     
0000000180a7fa4e: int3     
0000000180a7fa4f: int3     