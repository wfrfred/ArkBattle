; Torappu.Battle.Character._SearchBlockee metadata=76016 token=0x60128f1 VA=0x180a38200 RVA=0xa38200 size=0xb0
0000000180a38200: mov      qword ptr [rsp + 8], rbx
0000000180a38205: push     rdi
0000000180a38206: sub      rsp, 0x20
0000000180a3820a: cmp      byte ptr [rip + 0x825a419], 0
0000000180a38211: movzx    edi, dl
0000000180a38214: mov      rbx, rcx
0000000180a38217: jne      0x180a3822c
0000000180a38219: lea      rcx, [rip + 0x7e34048] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a38220: call     0x18048bf00
0000000180a38225: mov      byte ptr [rip + 0x825a3fe], 1
0000000180a3822c: mov      rax, qword ptr [rip + 0x7e34035] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a38233: cmp      dword ptr [rax + 0xe0], 0
0000000180a3823a: jne      0x180a3824b
0000000180a3823c: mov      rcx, rax
0000000180a3823f: call     0x18048c140
0000000180a38244: mov      rax, qword ptr [rip + 0x7e3401d] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a3824b: mov      rax, qword ptr [rax + 0xb8]
0000000180a38252: mov      rcx, qword ptr [rax + 0x640]
0000000180a38259: test     rcx, rcx
0000000180a3825c: jne      0x180a38283
0000000180a3825e: mov      rcx, qword ptr [rbx + 0x510]
0000000180a38265: test     rcx, rcx
0000000180a38268: je       0x180a3829c
0000000180a3826a: xor      r9d, r9d
0000000180a3826d: movzx    r8d, dil
0000000180a38271: mov      rdx, rbx
0000000180a38274: mov      rbx, qword ptr [rsp + 0x30]
0000000180a38279: add      rsp, 0x20
0000000180a3827d: pop      rdi
0000000180a3827e: jmp      0x180aa09e0 ; Torappu.Battle.BlockManager.SearchBlockee [77190]
0000000180a38283: xor      r9d, r9d
0000000180a38286: movzx    r8d, dil
0000000180a3828a: mov      rdx, rbx
0000000180a3828d: mov      rbx, qword ptr [rsp + 0x30]
0000000180a38292: add      rsp, 0x20
0000000180a38296: pop      rdi
0000000180a38297: jmp      0x1833005f0 ; XLua.DelegateBridge.__Gen_Delegate_Imp26 [2681]
0000000180a3829c: call     0x18048c0b0
0000000180a382a1: int3     
0000000180a382a2: int3     
0000000180a382a3: int3     
0000000180a382a4: int3     
0000000180a382a5: int3     
0000000180a382a6: int3     
0000000180a382a7: int3     
0000000180a382a8: int3     
0000000180a382a9: int3     
0000000180a382aa: int3     
0000000180a382ab: int3     
0000000180a382ac: int3     
0000000180a382ad: int3     
0000000180a382ae: int3     
0000000180a382af: int3     