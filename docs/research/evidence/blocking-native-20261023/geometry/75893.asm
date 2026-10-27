; Torappu.Battle.Character.get_minBlockDistToTarget metadata=75893 token=0x6012876 VA=0x180a3b970 RVA=0xa3b970 size=0x80
0000000180a3b970: push     rbx
0000000180a3b972: sub      rsp, 0x20
0000000180a3b976: cmp      byte ptr [rip + 0x8256c32], 0
0000000180a3b97d: mov      rbx, rcx
0000000180a3b980: jne      0x180a3b995
0000000180a3b982: lea      rcx, [rip + 0x7e308df] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a3b989: call     0x18048bf00
0000000180a3b98e: mov      byte ptr [rip + 0x8256c1a], 1
0000000180a3b995: mov      rax, qword ptr [rip + 0x7e308cc] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a3b99c: cmp      dword ptr [rax + 0xe0], 0
0000000180a3b9a3: jne      0x180a3b9b4
0000000180a3b9a5: mov      rcx, rax
0000000180a3b9a8: call     0x18048c140
0000000180a3b9ad: mov      rax, qword ptr [rip + 0x7e308b4] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a3b9b4: mov      rax, qword ptr [rax + 0xb8]
0000000180a3b9bb: mov      rcx, qword ptr [rax + 0x268]
0000000180a3b9c2: test     rcx, rcx
0000000180a3b9c5: jne      0x180a3b9d5
0000000180a3b9c7: movss    xmm0, dword ptr [rip + 0x64043d5]
0000000180a3b9cf: add      rsp, 0x20
0000000180a3b9d3: pop      rbx
0000000180a3b9d4: ret      
0000000180a3b9d5: xor      r8d, r8d
0000000180a3b9d8: mov      rdx, rbx
0000000180a3b9db: add      rsp, 0x20
0000000180a3b9df: pop      rbx
0000000180a3b9e0: jmp      0x1836404d0 ; XLua.DelegateBridge.__Gen_Delegate_Imp80 [2735]
0000000180a3b9e5: int3     
0000000180a3b9e6: int3     
0000000180a3b9e7: int3     
0000000180a3b9e8: int3     
0000000180a3b9e9: int3     
0000000180a3b9ea: int3     
0000000180a3b9eb: int3     
0000000180a3b9ec: int3     
0000000180a3b9ed: int3     
0000000180a3b9ee: int3     
0000000180a3b9ef: int3     