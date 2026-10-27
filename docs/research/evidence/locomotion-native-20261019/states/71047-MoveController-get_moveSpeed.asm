; Torappu.Battle.MoveController.get_moveSpeed metadata=71047 token=0x6011588 VA=0x1808b8750 RVA=0x8b8750 size=0x160
00000001808b8750: push     rbx
00000001808b8752: sub      rsp, 0x20
00000001808b8756: cmp      byte ptr [rip + 0x83d8fd2], 0
00000001808b875d: mov      rbx, rcx
00000001808b8760: jne      0x1808b8775
00000001808b8762: lea      rcx, [rip + 0x804533f] ; TypeInfo Torappu.Battle.MoveController @0x1888fdaa8
00000001808b8769: call     0x18048bf00
00000001808b876e: mov      byte ptr [rip + 0x83d8fba], 1
00000001808b8775: mov      rax, qword ptr [rip + 0x804532c] ; TypeInfo Torappu.Battle.MoveController @0x1888fdaa8
00000001808b877c: mov      rdx, qword ptr [rax + 0xb8]
00000001808b8783: mov      rcx, qword ptr [rdx]
00000001808b8786: test     rcx, rcx
00000001808b8789: jne      0x1808b8876
00000001808b878f: mov      rbx, qword ptr [rbx + 0x28]
00000001808b8793: test     rbx, rbx
00000001808b8796: je       0x1808b8886
00000001808b879c: mov      rax, qword ptr [rbx]
00000001808b879f: mov      ecx, dword ptr [rax + 0x11c]
00000001808b87a5: add      ecx, -0x60
00000001808b87a8: cmp      ecx, 0x13
00000001808b87ab: ja       0x1808b87e5
00000001808b87ad: movsxd   rax, ecx
00000001808b87b0: lea      rdx, [rip - 0x8b87b7]
00000001808b87b7: movzx    eax, byte ptr [rdx + rax + 0x8b8898]
00000001808b87bf: mov      ecx, dword ptr [rdx + rax*4 + 0x8b888c]
00000001808b87c6: add      rcx, rdx
00000001808b87c9: jmp      rcx
00000001808b87cb: xor      edx, edx
00000001808b87cd: mov      rcx, rbx
00000001808b87d0: add      rsp, 0x20
00000001808b87d4: pop      rbx
00000001808b87d5: jmp      0x180707aa0 ; Torappu.Battle.Entity.get_moveSpeed [66467]
00000001808b87da: movss    xmm0, dword ptr [rbx + 0x3c]
00000001808b87df: add      rsp, 0x20
00000001808b87e3: pop      rbx
00000001808b87e4: ret      
00000001808b87e5: cmp      byte ptr [rip + 0x8414004], 0
00000001808b87ec: mov      qword ptr [rsp + 0x30], rsi
00000001808b87f1: mov      rsi, qword ptr [rbx]
00000001808b87f4: mov      qword ptr [rsp + 0x38], rdi
00000001808b87f9: mov      rdi, qword ptr [rip + 0x80bb5b8] ; TypeInfo Torappu.Battle.IMovable @0x188973db8
00000001808b8800: je       0x1808b880a
00000001808b8802: mov      rcx, rsi
00000001808b8805: call     0x180446d00
00000001808b880a: movzx    edx, word ptr [rsi + 0x12e]
00000001808b8811: xor      ecx, ecx
00000001808b8813: cmp      cx, dx
00000001808b8816: jae      0x1808b8834
00000001808b8818: mov      r8, qword ptr [rsi + 0xb0]
00000001808b881f: nop      
00000001808b8820: movzx    eax, cx
00000001808b8823: add      rax, rax
00000001808b8826: cmp      qword ptr [r8 + rax*8], rdi
00000001808b882a: je       0x1808b885e
00000001808b882c: inc      cx
00000001808b882f: cmp      cx, dx
00000001808b8832: jb       0x1808b8820
00000001808b8834: xor      r8d, r8d
00000001808b8837: mov      rdx, rdi
00000001808b883a: mov      rcx, rbx
00000001808b883d: call     0x180445cc0
00000001808b8842: mov      r8, qword ptr [rax]
00000001808b8845: mov      rcx, rbx
00000001808b8848: mov      rdx, qword ptr [rax + 8]
00000001808b884c: mov      rdi, qword ptr [rsp + 0x38]
00000001808b8851: mov      rsi, qword ptr [rsp + 0x30]
00000001808b8856: add      rsp, 0x20
00000001808b885a: pop      rbx
00000001808b885b: jmp      r8
00000001808b885e: movzx    ecx, cx
00000001808b8861: add      rcx, rcx
00000001808b8864: movsxd   rax, dword ptr [r8 + rcx*8 + 8]
00000001808b8869: add      rax, 0x14
00000001808b886d: shl      rax, 4
00000001808b8871: add      rax, rsi
00000001808b8874: jmp      0x1808b8842
00000001808b8876: xor      r8d, r8d
00000001808b8879: mov      rdx, rbx
00000001808b887c: add      rsp, 0x20
00000001808b8880: pop      rbx
00000001808b8881: jmp      0x1836404d0 ; XLua.DelegateBridge.__Gen_Delegate_Imp80 [2735]
00000001808b8886: call     0x18048c0b0
00000001808b888b: int3     
00000001808b888c: retf     
00000001808b888d: xchg     dword ptr [rbx - 0x74782600], ecx
00000001808b8893: add      ch, ah
00000001808b8895: xchg     dword ptr [rbx], ecx
00000001808b889b: add      al, byte ptr [rdx]
00000001808b889d: add      al, byte ptr [rax]
00000001808b889f: add      byte ptr [rax], al
00000001808b88a1: add      byte ptr [rdx], al
00000001808b88a3: add      byte ptr [rax], al
00000001808b88a5: add      al, byte ptr [rax]
00000001808b88a7: add      al, byte ptr [rax]
00000001808b88a9: add      byte ptr [rax], al
00000001808b88ab: add      esp, ecx
00000001808b88ad: int3     
00000001808b88ae: int3     
00000001808b88af: int3     
