; <Module>.raw-interface-wrapper metadata=0 token=0x0 VA=0x180a64b90 RVA=0xa64b90 size=0x190
0000000180a64b90: mov      rax, qword ptr [rcx]
0000000180a64b93: mov      r8, rcx
0000000180a64b96: mov      edx, dword ptr [rax + 0x11c]
0000000180a64b9c: add      edx, -0x60
0000000180a64b9f: cmp      edx, 0x12
0000000180a64ba2: ja       0x180a64bce
0000000180a64ba4: movsxd   rax, edx
0000000180a64ba7: lea      rcx, [rip - 0xa64bae]
0000000180a64bae: mov      edx, dword ptr [rcx + rax*4 + 0xa64be0]
0000000180a64bb5: add      rdx, rcx
0000000180a64bb8: jmp      rdx
0000000180a64bba: xor      edx, edx
0000000180a64bbc: mov      rcx, r8
0000000180a64bbf: jmp      0x180a7b7f0 ; Torappu.Battle.Enemy.get_blockMode [76549]
0000000180a64bc4: xor      edx, edx
0000000180a64bc6: mov      rcx, r8
0000000180a64bc9: jmp      0x180a39480 ; Torappu.Battle.Character.get_blockMode [75898]
0000000180a64bce: mov      rdx, qword ptr [rip + 0x7ed98cb] ; TypeInfo Torappu.Battle.IBlocker @0x18893e4a0
0000000180a64bd5: mov      ecx, 2
0000000180a64bda: jmp      0x180005310
0000000180a64bdf: nop      
0000000180a64be0: mov      edx, 0xba00a64b
0000000180a64be5: cmpsb    byte ptr [rsi], byte ptr [rdi]
0000000180a64be7: add      byte ptr [rdx - 0x3bff59b5], bh
0000000180a64bed: cmpsb    byte ptr [rsi], byte ptr [rdi]
0000000180a64bef: add      ah, al
0000000180a64bf1: cmpsb    byte ptr [rsi], byte ptr [rdi]
0000000180a64bf3: add      ah, al
0000000180a64bf5: cmpsb    byte ptr [rsi], byte ptr [rdi]
0000000180a64bf7: add      byte ptr [rdx - 0x45ff59b5], bh
0000000180a64bfd: cmpsb    byte ptr [rsi], byte ptr [rdi]
0000000180a64bff: add      byte ptr [rdx - 0x45ff59b5], bh
0000000180a64c05: cmpsb    byte ptr [rsi], byte ptr [rdi]
0000000180a64c07: add      ah, al
0000000180a64c09: cmpsb    byte ptr [rsi], byte ptr [rdi]
0000000180a64c0b: add      byte ptr [rdx - 0x45ff59b5], bh
0000000180a64c11: cmpsb    byte ptr [rsi], byte ptr [rdi]
0000000180a64c13: add      ah, al
0000000180a64c15: cmpsb    byte ptr [rsi], byte ptr [rdi]
0000000180a64c17: add      byte ptr [rdx - 0x3bff59b5], bh
0000000180a64c1d: cmpsb    byte ptr [rsi], byte ptr [rdi]
0000000180a64c1f: add      byte ptr [rdx - 0x45ff59b5], bh
0000000180a64c25: cmpsb    byte ptr [rsi], byte ptr [rdi]
0000000180a64c27: add      byte ptr [rdx - 0x33ff59b5], bh
0000000180a64c2d: int3     
0000000180a64c2e: int3     
0000000180a64c2f: int3     
0000000180a64c30: push     rbx
0000000180a64c32: sub      rsp, 0x20
0000000180a64c36: mov      rax, qword ptr [rcx]
0000000180a64c39: mov      rbx, rcx
0000000180a64c3c: mov      edx, dword ptr [rax + 0x11c]
0000000180a64c42: add      edx, -0x60
0000000180a64c45: cmp      edx, 0x12
0000000180a64c48: ja       0x180a64c77
0000000180a64c4a: movsxd   rax, edx
0000000180a64c4d: lea      rcx, [rip - 0xa64c54]
0000000180a64c54: movzx    eax, byte ptr [rcx + rax + 0xa64d14]
0000000180a64c5c: mov      edx, dword ptr [rcx + rax*4 + 0xa64d10]
0000000180a64c63: add      rdx, rcx
0000000180a64c66: jmp      rdx
0000000180a64c68: xor      edx, edx
0000000180a64c6a: mov      rcx, rbx
0000000180a64c6d: add      rsp, 0x20
0000000180a64c71: pop      rbx
0000000180a64c72: jmp      0x180ad4250 ; Torappu.Battle.VisualObject.get_mapPosition [77866]
0000000180a64c77: cmp      byte ptr [rip + 0x8267b72], 0
0000000180a64c7e: mov      qword ptr [rsp + 0x30], rsi
0000000180a64c83: mov      rsi, qword ptr [rbx]
0000000180a64c86: mov      qword ptr [rsp + 0x38], rdi
0000000180a64c8b: mov      rdi, qword ptr [rip + 0x7ed980e] ; TypeInfo Torappu.Battle.IBlocker @0x18893e4a0
0000000180a64c92: je       0x180a64c9c
0000000180a64c94: mov      rcx, rsi
0000000180a64c97: call     0x180446d00
0000000180a64c9c: movzx    edx, word ptr [rsi + 0x12e]
0000000180a64ca3: xor      ecx, ecx
0000000180a64ca5: cmp      cx, dx
0000000180a64ca8: jae      0x180a64cc5
0000000180a64caa: mov      r8, qword ptr [rsi + 0xb0]
0000000180a64cb1: movzx    eax, cx
0000000180a64cb4: add      rax, rax
0000000180a64cb7: cmp      qword ptr [r8 + rax*8], rdi
0000000180a64cbb: je       0x180a64cf2
0000000180a64cbd: inc      cx
0000000180a64cc0: cmp      cx, dx
0000000180a64cc3: jb       0x180a64cb1
0000000180a64cc5: mov      r8d, 7
0000000180a64ccb: mov      rdx, rdi
0000000180a64cce: mov      rcx, rbx
0000000180a64cd1: call     0x180445cc0
0000000180a64cd6: mov      r8, qword ptr [rax]
0000000180a64cd9: mov      rcx, rbx
0000000180a64cdc: mov      rdx, qword ptr [rax + 8]
0000000180a64ce0: mov      rdi, qword ptr [rsp + 0x38]
0000000180a64ce5: mov      rsi, qword ptr [rsp + 0x30]
0000000180a64cea: add      rsp, 0x20
0000000180a64cee: pop      rbx
0000000180a64cef: jmp      r8
0000000180a64cf2: movzx    ecx, cx
0000000180a64cf5: add      rcx, rcx
0000000180a64cf8: mov      eax, dword ptr [r8 + rcx*8 + 8]
0000000180a64cfd: add      eax, 7
0000000180a64d00: cdqe     
0000000180a64d02: add      rax, 0x14
0000000180a64d06: shl      rax, 4
0000000180a64d0a: add      rax, rsi
0000000180a64d0d: jmp      0x180a64cd6
0000000180a64d0f: nop      
0000000180a64d10: push     0xa64c
0000000180a64d15: add      byte ptr [rax], al
0000000180a64d17: add      byte ptr [rax], al
0000000180a64d19: add      byte ptr [rax], al
0000000180a64d1b: add      byte ptr [rax], al
0000000180a64d1d: add      byte ptr [rax], al