; Torappu.Battle.MoveController._GetFootMapPosition metadata=71061 token=0x6011596 VA=0x1808b84f0 RVA=0x8b84f0 size=0x90
00000001808b84f0: push     rbx
00000001808b84f2: sub      rsp, 0x20
00000001808b84f6: cmp      byte ptr [rip + 0x83d9240], 0
00000001808b84fd: mov      rbx, rcx
00000001808b8500: jne      0x1808b8515
00000001808b8502: lea      rcx, [rip + 0x804559f] ; TypeInfo Torappu.Battle.MoveController @0x1888fdaa8
00000001808b8509: call     0x18048bf00
00000001808b850e: mov      byte ptr [rip + 0x83d9228], 1
00000001808b8515: mov      rax, qword ptr [rip + 0x804558c] ; TypeInfo Torappu.Battle.MoveController @0x1888fdaa8
00000001808b851c: mov      rdx, qword ptr [rax + 0xb8]
00000001808b8523: mov      rcx, qword ptr [rdx + 0x70]
00000001808b8527: test     rcx, rcx
00000001808b852a: jne      0x1808b8565
00000001808b852c: mov      rcx, qword ptr [rbx + 0x28]
00000001808b8530: test     rcx, rcx
00000001808b8533: je       0x1808b8575
00000001808b8535: xor      edx, edx
00000001808b8537: call     0x1808a9010
00000001808b853c: mov      qword ptr [rsp + 0x40], rax
00000001808b8541: movss    xmm0, dword ptr [rsp + 0x40]
00000001808b8547: movss    xmm1, dword ptr [rsp + 0x44]
00000001808b854d: addss    xmm0, dword ptr [rbx + 0x30]
00000001808b8552: addss    xmm1, dword ptr [rbx + 0x34]
00000001808b8557: unpcklps xmm0, xmm1
00000001808b855a: movq     rax, xmm0
00000001808b855f: add      rsp, 0x20
00000001808b8563: pop      rbx
00000001808b8564: ret      
00000001808b8565: xor      r8d, r8d
00000001808b8568: mov      rdx, rbx
00000001808b856b: add      rsp, 0x20
00000001808b856f: pop      rbx
00000001808b8570: jmp      0x1835c4140 ; XLua.DelegateBridge.__Gen_Delegate_Imp72 [2727]
00000001808b8575: call     0x18048c0b0
00000001808b857a: int3     
00000001808b857b: int3     
00000001808b857c: int3     
00000001808b857d: int3     
00000001808b857e: int3     
00000001808b857f: int3     
