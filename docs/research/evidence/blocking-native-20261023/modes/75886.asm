; Torappu.Battle.Character.get_blockSideMask metadata=75886 token=0x601286f VA=0x180a39680 RVA=0xa39680 size=0x80
0000000180a39680: push     rbx
0000000180a39682: sub      rsp, 0x20
0000000180a39686: cmp      byte ptr [rip + 0x8258f1b], 0
0000000180a3968d: mov      rbx, rcx
0000000180a39690: jne      0x180a396a5
0000000180a39692: lea      rcx, [rip + 0x7e32bcf] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a39699: call     0x18048bf00
0000000180a3969e: mov      byte ptr [rip + 0x8258f03], 1
0000000180a396a5: mov      rax, qword ptr [rip + 0x7e32bbc] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a396ac: cmp      dword ptr [rax + 0xe0], 0
0000000180a396b3: jne      0x180a396c4
0000000180a396b5: mov      rcx, rax
0000000180a396b8: call     0x18048c140
0000000180a396bd: mov      rax, qword ptr [rip + 0x7e32ba4] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a396c4: mov      rax, qword ptr [rax + 0xb8]
0000000180a396cb: mov      rcx, qword ptr [rax + 0x230]
0000000180a396d2: test     rcx, rcx
0000000180a396d5: jne      0x180a396e2
0000000180a396d7: mov      eax, 2
0000000180a396dc: add      rsp, 0x20
0000000180a396e0: pop      rbx
0000000180a396e1: ret      
0000000180a396e2: xor      r8d, r8d
0000000180a396e5: mov      rdx, rbx
0000000180a396e8: add      rsp, 0x20
0000000180a396ec: pop      rbx
0000000180a396ed: jmp      0x183341bc0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3118 [5773]
0000000180a396f2: int3     
0000000180a396f3: int3     
0000000180a396f4: int3     
0000000180a396f5: int3     
0000000180a396f6: int3     
0000000180a396f7: int3     
0000000180a396f8: int3     
0000000180a396f9: int3     
0000000180a396fa: int3     
0000000180a396fb: int3     
0000000180a396fc: int3     
0000000180a396fd: int3     
0000000180a396fe: int3     
0000000180a396ff: int3     