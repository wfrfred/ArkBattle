; Torappu.Battle.MoveController.get_steeringFactor metadata=71050 token=0x601158b VA=0x1808b88b0 RVA=0x8b88b0 size=0x60
00000001808b88b0: push     rbx
00000001808b88b2: sub      rsp, 0x20
00000001808b88b6: cmp      byte ptr [rip + 0x83d8e75], 0
00000001808b88bd: mov      rbx, rcx
00000001808b88c0: jne      0x1808b88d5
00000001808b88c2: lea      rcx, [rip + 0x80451df] ; TypeInfo Torappu.Battle.MoveController @0x1888fdaa8
00000001808b88c9: call     0x18048bf00
00000001808b88ce: mov      byte ptr [rip + 0x83d8e5d], 1
00000001808b88d5: mov      rax, qword ptr [rip + 0x80451cc] ; TypeInfo Torappu.Battle.MoveController @0x1888fdaa8
00000001808b88dc: mov      rdx, qword ptr [rax + 0xb8]
00000001808b88e3: mov      rcx, qword ptr [rdx + 0x18]
00000001808b88e7: test     rcx, rcx
00000001808b88ea: jne      0x1808b88f7
00000001808b88ec: movss    xmm0, dword ptr [rbx + 0x24]
00000001808b88f1: add      rsp, 0x20
00000001808b88f5: pop      rbx
00000001808b88f6: ret      
00000001808b88f7: xor      r8d, r8d
00000001808b88fa: mov      rdx, rbx
00000001808b88fd: add      rsp, 0x20
00000001808b8901: pop      rbx
00000001808b8902: jmp      0x1836404d0 ; XLua.DelegateBridge.__Gen_Delegate_Imp80 [2735]
00000001808b8907: int3     
00000001808b8908: int3     
00000001808b8909: int3     
00000001808b890a: int3     
00000001808b890b: int3     
00000001808b890c: int3     
00000001808b890d: int3     
00000001808b890e: int3     
00000001808b890f: int3     
