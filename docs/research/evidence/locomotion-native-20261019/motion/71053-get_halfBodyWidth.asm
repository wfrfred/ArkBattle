; Torappu.Battle.MoveController.get_halfBodyWidth metadata=71053 token=0x601158e VA=0x1808b86f0 RVA=0x8b86f0 size=0x60
00000001808b86f0: push     rbx
00000001808b86f2: sub      rsp, 0x20
00000001808b86f6: cmp      byte ptr [rip + 0x83d9038], 0
00000001808b86fd: mov      rbx, rcx
00000001808b8700: jne      0x1808b8715
00000001808b8702: lea      rcx, [rip + 0x804539f] ; TypeInfo Torappu.Battle.MoveController @0x1888fdaa8
00000001808b8709: call     0x18048bf00
00000001808b870e: mov      byte ptr [rip + 0x83d9020], 1
00000001808b8715: mov      rax, qword ptr [rip + 0x804538c] ; TypeInfo Torappu.Battle.MoveController @0x1888fdaa8
00000001808b871c: mov      rdx, qword ptr [rax + 0xb8]
00000001808b8723: mov      rcx, qword ptr [rdx + 0x30]
00000001808b8727: test     rcx, rcx
00000001808b872a: jne      0x1808b8737
00000001808b872c: movss    xmm0, dword ptr [rbx + 0x20]
00000001808b8731: add      rsp, 0x20
00000001808b8735: pop      rbx
00000001808b8736: ret      
00000001808b8737: xor      r8d, r8d
00000001808b873a: mov      rdx, rbx
00000001808b873d: add      rsp, 0x20
00000001808b8741: pop      rbx
00000001808b8742: jmp      0x1836404d0 ; XLua.DelegateBridge.__Gen_Delegate_Imp80 [2735]
00000001808b8747: int3     
00000001808b8748: int3     
00000001808b8749: int3     
00000001808b874a: int3     
00000001808b874b: int3     
00000001808b874c: int3     
00000001808b874d: int3     
00000001808b874e: int3     
00000001808b874f: int3     
