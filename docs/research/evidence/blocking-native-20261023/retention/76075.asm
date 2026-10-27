; Torappu.Battle.Character.get_ColliderRadius metadata=76075 token=0x601292c VA=0x180a389c0 RVA=0xa389c0 size=0x80
0000000180a389c0: push     rbx
0000000180a389c2: sub      rsp, 0x20
0000000180a389c6: cmp      byte ptr [rip + 0x8259c98], 0
0000000180a389cd: mov      rbx, rcx
0000000180a389d0: jne      0x180a389e5
0000000180a389d2: lea      rcx, [rip + 0x7e3388f] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a389d9: call     0x18048bf00
0000000180a389de: mov      byte ptr [rip + 0x8259c80], 1
0000000180a389e5: mov      rax, qword ptr [rip + 0x7e3387c] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a389ec: cmp      dword ptr [rax + 0xe0], 0
0000000180a389f3: jne      0x180a38a04
0000000180a389f5: mov      rcx, rax
0000000180a389f8: call     0x18048c140
0000000180a389fd: mov      rax, qword ptr [rip + 0x7e33864] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a38a04: mov      rax, qword ptr [rax + 0xb8]
0000000180a38a0b: mov      rcx, qword ptr [rax + 0x818]
0000000180a38a12: test     rcx, rcx
0000000180a38a15: jne      0x180a38a24
0000000180a38a17: mov      rax, qword ptr [rbx + 0x538]
0000000180a38a1e: add      rsp, 0x20
0000000180a38a22: pop      rbx
0000000180a38a23: ret      
0000000180a38a24: xor      r8d, r8d
0000000180a38a27: mov      rdx, rbx
0000000180a38a2a: add      rsp, 0x20
0000000180a38a2e: pop      rbx
0000000180a38a2f: jmp      0x1832f4c20 ; XLua.DelegateBridge.__Gen_Delegate_Imp2620 [5275]
0000000180a38a34: int3     
0000000180a38a35: int3     
0000000180a38a36: int3     
0000000180a38a37: int3     
0000000180a38a38: int3     
0000000180a38a39: int3     
0000000180a38a3a: int3     
0000000180a38a3b: int3     
0000000180a38a3c: int3     
0000000180a38a3d: int3     
0000000180a38a3e: int3     
0000000180a38a3f: int3     