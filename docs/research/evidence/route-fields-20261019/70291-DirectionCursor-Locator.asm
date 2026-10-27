; Torappu.Battle.DirectionCursor.GetLocatorPosition metadata=70291 token=0x6011294 VA=0x180894ed0 RVA=0x894ed0 size=0x90
0000000180894ed0: push     rbx
0000000180894ed2: sub      rsp, 0x20
0000000180894ed6: cmp      byte ptr [rip + 0x83fc615], 0
0000000180894edd: mov      rbx, rcx
0000000180894ee0: jne      0x180894ef5
0000000180894ee2: lea      rcx, [rip + 0x80d820f] ; TypeInfo Torappu.Battle.DirectionCursor @0x18896d0f8
0000000180894ee9: call     0x18048bf00
0000000180894eee: mov      byte ptr [rip + 0x83fc5fd], 1
0000000180894ef5: mov      rax, qword ptr [rip + 0x80d81fc] ; TypeInfo Torappu.Battle.DirectionCursor @0x18896d0f8
0000000180894efc: mov      rdx, qword ptr [rax + 0xb8]
0000000180894f03: mov      rcx, qword ptr [rdx + 0xf0]
0000000180894f0a: test     rcx, rcx
0000000180894f0d: jne      0x180894f48
0000000180894f0f: mov      rcx, qword ptr [rbx + 0x30]
0000000180894f13: test     rcx, rcx
0000000180894f16: je       0x180894f58
0000000180894f18: xor      edx, edx
0000000180894f1a: call     0x180ad4250 ; Torappu.Battle.VisualObject.get_mapPosition [77866]
0000000180894f1f: mov      qword ptr [rsp + 0x40], rax
0000000180894f24: movss    xmm0, dword ptr [rsp + 0x40]
0000000180894f2a: movss    xmm1, dword ptr [rsp + 0x44]
0000000180894f30: addss    xmm0, dword ptr [rbx + 0x68]
0000000180894f35: addss    xmm1, dword ptr [rbx + 0x6c]
0000000180894f3a: unpcklps xmm0, xmm1
0000000180894f3d: movq     rax, xmm0
0000000180894f42: add      rsp, 0x20
0000000180894f46: pop      rbx
0000000180894f47: ret      
0000000180894f48: xor      r8d, r8d
0000000180894f4b: mov      rdx, rbx
0000000180894f4e: add      rsp, 0x20
0000000180894f52: pop      rbx
0000000180894f53: jmp      0x1835c4140 ; XLua.DelegateBridge.__Gen_Delegate_Imp72 [2727]
0000000180894f58: call     0x18048c0b0
0000000180894f5d: int3     
0000000180894f5e: int3     
0000000180894f5f: int3     