; Torappu.Battle.Enemy.get_velocity metadata=76382 token=0x6012a5f VA=0x180a80980 RVA=0xa80980 size=0x90
0000000180a80980: push     rbx
0000000180a80982: sub      rsp, 0x20
0000000180a80986: cmp      byte ptr [rip + 0x8211eba], 0
0000000180a8098d: mov      rbx, rcx
0000000180a80990: jne      0x180a809a5
0000000180a80992: lea      rcx, [rip + 0x7d9ad17] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a80999: call     0x18048bf00
0000000180a8099e: mov      byte ptr [rip + 0x8211ea2], 1
0000000180a809a5: mov      rax, qword ptr [rip + 0x7d9ad04] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a809ac: cmp      dword ptr [rax + 0xe0], 0
0000000180a809b3: jne      0x180a809c4
0000000180a809b5: mov      rcx, rax
0000000180a809b8: call     0x18048c140
0000000180a809bd: mov      rax, qword ptr [rip + 0x7d9acec] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a809c4: mov      rax, qword ptr [rax + 0xb8]
0000000180a809cb: mov      rcx, qword ptr [rax + 0x378]
0000000180a809d2: test     rcx, rcx
0000000180a809d5: jne      0x180a809f5
0000000180a809d7: xor      edx, edx
0000000180a809d9: mov      rcx, rbx
0000000180a809dc: call     0x180a7f9d0 ; Torappu.Battle.Enemy.get_rigidbody2D [76384]
0000000180a809e1: test     rax, rax
0000000180a809e4: je       0x180a80a05
0000000180a809e6: xor      edx, edx
0000000180a809e8: mov      rcx, rax
0000000180a809eb: add      rsp, 0x20
0000000180a809ef: pop      rbx
0000000180a809f0: jmp      0x186bc6f40
0000000180a809f5: xor      r8d, r8d
0000000180a809f8: mov      rdx, rbx
0000000180a809fb: add      rsp, 0x20
0000000180a809ff: pop      rbx
0000000180a80a00: jmp      0x1835c4140 ; XLua.DelegateBridge.__Gen_Delegate_Imp72 [2727]
0000000180a80a05: call     0x18048c0b0
0000000180a80a0a: int3     
0000000180a80a0b: int3     
0000000180a80a0c: int3     
0000000180a80a0d: int3     
0000000180a80a0e: int3     
0000000180a80a0f: int3     
