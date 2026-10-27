; Torappu.Battle.MoveController.OnTick metadata=71063 token=0x6011598 VA=0x1808b68e0 RVA=0x8b68e0 size=0xa0
00000001808b68e0: mov      qword ptr [rsp + 0x10], rdx
00000001808b68e5: push     rbx
00000001808b68e6: sub      rsp, 0x20
00000001808b68ea: cmp      byte ptr [rip + 0x83dae4e], 0
00000001808b68f1: mov      rbx, rcx
00000001808b68f4: jne      0x1808b691a
00000001808b68f6: lea      rcx, [rip + 0x7fa3e03] ; TypeInfo Torappu.FP @0x18885a700
00000001808b68fd: call     0x18048bf00
00000001808b6902: lea      rcx, [rip + 0x804719f] ; TypeInfo Torappu.Battle.MoveController @0x1888fdaa8
00000001808b6909: call     0x18048bf00
00000001808b690e: mov      rdx, qword ptr [rsp + 0x38]
00000001808b6913: mov      byte ptr [rip + 0x83dae25], 1
00000001808b691a: mov      rax, qword ptr [rip + 0x8047187] ; TypeInfo Torappu.Battle.MoveController @0x1888fdaa8
00000001808b6921: mov      r8, qword ptr [rax + 0xb8]
00000001808b6928: mov      rcx, qword ptr [r8 + 0x80]
00000001808b692f: test     rcx, rcx
00000001808b6932: jne      0x1808b6969
00000001808b6934: mov      rcx, qword ptr [rip + 0x7fa3dc5] ; TypeInfo Torappu.FP @0x18885a700
00000001808b693b: cmp      dword ptr [rcx + 0xe0], 0
00000001808b6942: jne      0x1808b6949
00000001808b6944: call     0x18048c140
00000001808b6949: xor      edx, edx
00000001808b694b: lea      rcx, [rsp + 0x38]
00000001808b6950: call     0x1866fae20
00000001808b6955: xor      r8d, r8d
00000001808b6958: movaps   xmm1, xmm0
00000001808b695b: mov      rcx, rbx
00000001808b695e: call     0x1808b7f60 ; Torappu.Battle.MoveController._ConveyorMove [71064]
00000001808b6963: add      rsp, 0x20
00000001808b6967: pop      rbx
00000001808b6968: ret      
00000001808b6969: mov      r8, rdx
00000001808b696c: xor      r9d, r9d
00000001808b696f: mov      rdx, rbx
00000001808b6972: call     0x1833f9830 ; XLua.DelegateBridge.__Gen_Delegate_Imp427 [3082]
00000001808b6977: add      rsp, 0x20
00000001808b697b: pop      rbx
00000001808b697c: ret      
00000001808b697d: int3     
00000001808b697e: int3     
00000001808b697f: int3     