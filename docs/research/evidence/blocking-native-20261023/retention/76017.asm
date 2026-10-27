; Torappu.Battle.Character.OnBlockeeChanged metadata=76017 token=0x60128f2 VA=0x180a2d1c0 RVA=0xa2d1c0 size=0xa0
0000000180a2d1c0: push     rbx
0000000180a2d1c2: sub      rsp, 0x20
0000000180a2d1c6: cmp      byte ptr [rip + 0x826545e], 0
0000000180a2d1cd: mov      rbx, rcx
0000000180a2d1d0: jne      0x180a2d1e5
0000000180a2d1d2: lea      rcx, [rip + 0x7e3f08f] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a2d1d9: call     0x18048bf00
0000000180a2d1de: mov      byte ptr [rip + 0x8265446], 1
0000000180a2d1e5: mov      rax, qword ptr [rip + 0x7e3f07c] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a2d1ec: cmp      dword ptr [rax + 0xe0], 0
0000000180a2d1f3: jne      0x180a2d204
0000000180a2d1f5: mov      rcx, rax
0000000180a2d1f8: call     0x18048c140
0000000180a2d1fd: mov      rax, qword ptr [rip + 0x7e3f064] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a2d204: mov      rax, qword ptr [rax + 0xb8]
0000000180a2d20b: mov      rcx, qword ptr [rax + 0x648]
0000000180a2d212: xor      r8d, r8d
0000000180a2d215: test     rcx, rcx
0000000180a2d218: jne      0x180a2d245
0000000180a2d21a: mov      edx, 0x18
0000000180a2d21f: mov      rcx, rbx
0000000180a2d222: call     0x1806f2700 ; Torappu.Battle.Entity.EmitEvent [66715]
0000000180a2d227: xor      edx, edx
0000000180a2d229: mov      rcx, rbx
0000000180a2d22c: call     0x180702100 ; Torappu.Battle.Entity.get_buffContainer [66402]
0000000180a2d231: test     rax, rax
0000000180a2d234: je       0x180a2d252
0000000180a2d236: xor      edx, edx
0000000180a2d238: mov      rcx, rax
0000000180a2d23b: add      rsp, 0x20
0000000180a2d23f: pop      rbx
0000000180a2d240: jmp      0x180675680 ; Torappu.Battle.Buff.BuffContainer.OnOwnerBlockeeChanged [65434]
0000000180a2d245: mov      rdx, rbx
0000000180a2d248: add      rsp, 0x20
0000000180a2d24c: pop      rbx
0000000180a2d24d: jmp      0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
0000000180a2d252: call     0x18048c0b0
0000000180a2d257: int3     
0000000180a2d258: int3     
0000000180a2d259: int3     
0000000180a2d25a: int3     
0000000180a2d25b: int3     
0000000180a2d25c: int3     
0000000180a2d25d: int3     
0000000180a2d25e: int3     
0000000180a2d25f: int3     