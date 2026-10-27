; Torappu.Battle.Enemy.get_lastMoveDirVec metadata=76274 token=0x60129f3 VA=0x180a7e650 RVA=0xa7e650 size=0x90
0000000180a7e650: push     rbx
0000000180a7e652: sub      rsp, 0x20
0000000180a7e656: cmp      byte ptr [rip + 0x821417e], 0
0000000180a7e65d: mov      rbx, rcx
0000000180a7e660: jne      0x180a7e675
0000000180a7e662: lea      rcx, [rip + 0x7d9d047] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7e669: call     0x18048bf00
0000000180a7e66e: mov      byte ptr [rip + 0x8214166], 1
0000000180a7e675: mov      rax, qword ptr [rip + 0x7d9d034] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7e67c: cmp      dword ptr [rax + 0xe0], 0
0000000180a7e683: jne      0x180a7e694
0000000180a7e685: mov      rcx, rax
0000000180a7e688: call     0x18048c140
0000000180a7e68d: mov      rax, qword ptr [rip + 0x7d9d01c] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7e694: mov      rax, qword ptr [rax + 0xb8]
0000000180a7e69b: mov      rcx, qword ptr [rax + 0x18]
0000000180a7e69f: test     rcx, rcx
0000000180a7e6a2: jne      0x180a7e6c2
0000000180a7e6a4: movss    xmm0, dword ptr [rbx + 0x2c4]
0000000180a7e6ac: movss    xmm1, dword ptr [rbx + 0x2c0]
0000000180a7e6b4: unpcklps xmm1, xmm0
0000000180a7e6b7: movq     rax, xmm1
0000000180a7e6bc: add      rsp, 0x20
0000000180a7e6c0: pop      rbx
0000000180a7e6c1: ret      
0000000180a7e6c2: xor      r8d, r8d
0000000180a7e6c5: mov      rdx, rbx
0000000180a7e6c8: add      rsp, 0x20
0000000180a7e6cc: pop      rbx
0000000180a7e6cd: jmp      0x1835c4140 ; XLua.DelegateBridge.__Gen_Delegate_Imp72 [2727]
0000000180a7e6d2: int3     
0000000180a7e6d3: int3     
0000000180a7e6d4: int3     
0000000180a7e6d5: int3     
0000000180a7e6d6: int3     
0000000180a7e6d7: int3     
0000000180a7e6d8: int3     
0000000180a7e6d9: int3     
0000000180a7e6da: int3     
0000000180a7e6db: int3     
0000000180a7e6dc: int3     
0000000180a7e6dd: int3     
0000000180a7e6de: int3     
0000000180a7e6df: int3     
