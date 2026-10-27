; Torappu.Battle.Entity.EmitEvent metadata=66715 token=0x601049c VA=0x1806f2700 RVA=0x6f2700 size=0xb0
00000001806f2700: mov      qword ptr [rsp + 8], rbx
00000001806f2705: push     rdi
00000001806f2706: sub      rsp, 0x20
00000001806f270a: cmp      byte ptr [rip + 0x859e21a], 0
00000001806f2711: mov      edi, edx
00000001806f2713: mov      rbx, rcx
00000001806f2716: jne      0x1806f2737
00000001806f2718: lea      rcx, [rip + 0x814ec49] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806f271f: call     0x18048bf00
00000001806f2724: lea      rcx, [rip + 0x8127035] ; GenericMethodInfo 262050 @0x188819760
00000001806f272b: call     0x18048bf00
00000001806f2730: mov      byte ptr [rip + 0x859e1f4], 1
00000001806f2737: mov      rax, qword ptr [rip + 0x814ec2a] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806f273e: cmp      dword ptr [rax + 0xe0], 0
00000001806f2745: jne      0x1806f2756
00000001806f2747: mov      rcx, rax
00000001806f274a: call     0x18048c140
00000001806f274f: mov      rax, qword ptr [rip + 0x814ec12] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806f2756: mov      rax, qword ptr [rax + 0xb8]
00000001806f275d: mov      rcx, qword ptr [rax + 0xaf8]
00000001806f2764: test     rcx, rcx
00000001806f2767: jne      0x1806f2790
00000001806f2769: mov      rcx, qword ptr [rbx + 0xb8]
00000001806f2770: test     rcx, rcx
00000001806f2773: je       0x1806f27a8
00000001806f2775: mov      r9, qword ptr [rip + 0x8126fe4] ; GenericMethodInfo 262050 @0x188819760
00000001806f277c: xor      r8d, r8d
00000001806f277f: mov      edx, edi
00000001806f2781: mov      rbx, qword ptr [rsp + 0x30]
00000001806f2786: add      rsp, 0x20
00000001806f278a: pop      rdi
00000001806f278b: jmp      0x1848dca60
00000001806f2790: xor      r9d, r9d
00000001806f2793: mov      r8d, edi
00000001806f2796: mov      rdx, rbx
00000001806f2799: mov      rbx, qword ptr [rsp + 0x30]
00000001806f279e: add      rsp, 0x20
00000001806f27a2: pop      rdi
00000001806f27a3: jmp      0x18333b000 ; XLua.DelegateBridge.__Gen_Delegate_Imp3073 [5728]
00000001806f27a8: call     0x18048c0b0
00000001806f27ad: int3     
00000001806f27ae: int3     
00000001806f27af: int3     