; Torappu.Battle.Character.get_defaultBlockRadiusScale metadata=75927 token=0x6012898 VA=0x180a39f70 RVA=0xa39f70 size=0xa0
0000000180a39f70: push     rbx
0000000180a39f72: sub      rsp, 0x20
0000000180a39f76: cmp      byte ptr [rip + 0x8258654], 0
0000000180a39f7d: mov      rbx, rcx
0000000180a39f80: jne      0x180a39fa1
0000000180a39f82: lea      rcx, [rip + 0x7e322df] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a39f89: call     0x18048bf00
0000000180a39f8e: lea      rcx, [rip + 0x7e2076b] ; TypeInfo Torappu.FP @0x18885a700
0000000180a39f95: call     0x18048bf00
0000000180a39f9a: mov      byte ptr [rip + 0x8258630], 1
0000000180a39fa1: mov      rax, qword ptr [rip + 0x7e322c0] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a39fa8: cmp      dword ptr [rax + 0xe0], 0
0000000180a39faf: jne      0x180a39fc0
0000000180a39fb1: mov      rcx, rax
0000000180a39fb4: call     0x18048c140
0000000180a39fb9: mov      rax, qword ptr [rip + 0x7e322a8] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a39fc0: mov      rax, qword ptr [rax + 0xb8]
0000000180a39fc7: mov      rcx, qword ptr [rax + 0x378]
0000000180a39fce: test     rcx, rcx
0000000180a39fd1: jne      0x180a39ffc
0000000180a39fd3: mov      rcx, qword ptr [rip + 0x7e20726] ; TypeInfo Torappu.FP @0x18885a700
0000000180a39fda: cmp      dword ptr [rcx + 0xe0], 0
0000000180a39fe1: jne      0x180a39fe8
0000000180a39fe3: call     0x18048c140
0000000180a39fe8: movss    xmm0, dword ptr [rip + 0x6405bf0]
0000000180a39ff0: xor      edx, edx
0000000180a39ff2: add      rsp, 0x20
0000000180a39ff6: pop      rbx
0000000180a39ff7: jmp      0x1866fdad0
0000000180a39ffc: xor      r8d, r8d
0000000180a39fff: mov      rdx, rbx
0000000180a3a002: add      rsp, 0x20
0000000180a3a006: pop      rbx
0000000180a3a007: jmp      0x1832f4c20 ; XLua.DelegateBridge.__Gen_Delegate_Imp2620 [5275]
0000000180a3a00c: int3     
0000000180a3a00d: int3     
0000000180a3a00e: int3     
0000000180a3a00f: int3     