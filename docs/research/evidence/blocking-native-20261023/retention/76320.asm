; Torappu.Battle.Enemy.get_blocker metadata=76320 token=0x6012a21 VA=0x180a7bb20 RVA=0xa7bb20 size=0xc0
0000000180a7bb20: push     rbx
0000000180a7bb22: sub      rsp, 0x30
0000000180a7bb26: cmp      byte ptr [rip + 0x8216cdc], 0
0000000180a7bb2d: mov      rbx, rcx
0000000180a7bb30: jne      0x180a7bb5d
0000000180a7bb32: lea      rcx, [rip + 0x7eeef17] ; GenericMethodInfo 285168 @0x18896aa50
0000000180a7bb39: call     0x18048bf00
0000000180a7bb3e: lea      rcx, [rip + 0x7d9fb6b] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7bb45: call     0x18048bf00
0000000180a7bb4a: lea      rcx, [rip + 0x7eb9a57] ; GenericMethodInfo 280377 @0x1889355a8
0000000180a7bb51: call     0x18048bf00
0000000180a7bb56: mov      byte ptr [rip + 0x8216cac], 1
0000000180a7bb5d: mov      rax, qword ptr [rip + 0x7d9fb4c] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7bb64: cmp      dword ptr [rax + 0xe0], 0
0000000180a7bb6b: jne      0x180a7bb7c
0000000180a7bb6d: mov      rcx, rax
0000000180a7bb70: call     0x18048c140
0000000180a7bb75: mov      rax, qword ptr [rip + 0x7d9fb34] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7bb7c: mov      rax, qword ptr [rax + 0xb8]
0000000180a7bb83: mov      rcx, qword ptr [rax + 0x188]
0000000180a7bb8a: test     rcx, rcx
0000000180a7bb8d: jne      0x180a7bbd0
0000000180a7bb8f: movups   xmm0, xmmword ptr [rbx + 0x398]
0000000180a7bb96: mov      rdx, qword ptr [rip + 0x7eeeeb3] ; GenericMethodInfo 285168 @0x18896aa50
0000000180a7bb9d: lea      rcx, [rsp + 0x20]
0000000180a7bba2: movaps   xmmword ptr [rsp + 0x20], xmm0
0000000180a7bba7: call     0x18449ab40
0000000180a7bbac: test     al, al
0000000180a7bbae: je       0x180a7bbc8
0000000180a7bbb0: mov      rdx, qword ptr [rip + 0x7eb99f1] ; GenericMethodInfo 280377 @0x1889355a8
0000000180a7bbb7: lea      rcx, [rbx + 0x398]
0000000180a7bbbe: add      rsp, 0x30
0000000180a7bbc2: pop      rbx
0000000180a7bbc3: jmp      0x185159d80
0000000180a7bbc8: xor      eax, eax
0000000180a7bbca: add      rsp, 0x30
0000000180a7bbce: pop      rbx
0000000180a7bbcf: ret      
0000000180a7bbd0: xor      r8d, r8d
0000000180a7bbd3: mov      rdx, rbx
0000000180a7bbd6: add      rsp, 0x30
0000000180a7bbda: pop      rbx
0000000180a7bbdb: jmp      0x1832f6410 ; XLua.DelegateBridge.__Gen_Delegate_Imp2631 [5286]