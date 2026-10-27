; Torappu.Battle.FilterBuffTargetValidator..ctor metadata=75546 token=0x601271b VA=0x180a12bb0 RVA=0xa12bb0 size=0xa0
0000000180a12bb0: push     rbx
0000000180a12bb2: sub      rsp, 0x20
0000000180a12bb6: cmp      byte ptr [rip + 0x827f8e4], 0
0000000180a12bbd: mov      rbx, rcx
0000000180a12bc0: jne      0x180a12bd5
0000000180a12bc2: lea      rcx, [rip + 0x7e5f957] ; TypeInfo Torappu.Battle.FilterBuffTargetValidator @0x188872520
0000000180a12bc9: call     0x18048bf00
0000000180a12bce: mov      byte ptr [rip + 0x827f8cc], 1
0000000180a12bd5: cmp      byte ptr [rip + 0x827f91d], 0
0000000180a12bdc: jne      0x180a12bf1
0000000180a12bde: lea      rcx, [rip + 0x7e852f3] ; TypeInfo Torappu.Battle.TargetValidator @0x188897ed8
0000000180a12be5: call     0x18048bf00
0000000180a12bea: mov      byte ptr [rip + 0x827f908], 1
0000000180a12bf1: xor      edx, edx
0000000180a12bf3: mov      rcx, rbx
0000000180a12bf6: call     0x186b58fb0
0000000180a12bfb: mov      rax, qword ptr [rip + 0x7e852d6] ; TypeInfo Torappu.Battle.TargetValidator @0x188897ed8
0000000180a12c02: mov      rcx, qword ptr [rax + 0xb8]
0000000180a12c09: mov      rcx, qword ptr [rcx + 0x38]
0000000180a12c0d: test     rcx, rcx
0000000180a12c10: je       0x180a12c1d
0000000180a12c12: xor      r8d, r8d
0000000180a12c15: mov      rdx, rbx
0000000180a12c18: call     0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
0000000180a12c1d: mov      rax, qword ptr [rip + 0x7e5f8fc] ; TypeInfo Torappu.Battle.FilterBuffTargetValidator @0x188872520
0000000180a12c24: mov      rcx, qword ptr [rax + 0xb8]
0000000180a12c2b: mov      rcx, qword ptr [rcx + 8]
0000000180a12c2f: test     rcx, rcx
0000000180a12c32: je       0x180a12c44
0000000180a12c34: xor      r8d, r8d
0000000180a12c37: mov      rdx, rbx
0000000180a12c3a: add      rsp, 0x20
0000000180a12c3e: pop      rbx
0000000180a12c3f: jmp      0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
0000000180a12c44: add      rsp, 0x20
0000000180a12c48: pop      rbx
0000000180a12c49: ret      
0000000180a12c4a: int3     
0000000180a12c4b: int3     
0000000180a12c4c: int3     
0000000180a12c4d: int3     
0000000180a12c4e: int3     
0000000180a12c4f: int3     