; Torappu.Battle.IBlocker.helper_180a64a50 metadata=-1 token=0x0 VA=0x180a64a50 RVA=0xa64a50 size=0x140
0000000180a64a50: push     rbx
0000000180a64a52: sub      rsp, 0x20
0000000180a64a56: mov      rax, qword ptr [rcx]
0000000180a64a59: mov      rbx, rcx
0000000180a64a5c: mov      edx, dword ptr [rax + 0x11c]
0000000180a64a62: add      edx, -0x60
0000000180a64a65: cmp      edx, 0x12
0000000180a64a68: ja       0x180a64a9e
0000000180a64a6a: movsxd   rax, edx
0000000180a64a6d: lea      rcx, [rip - 0xa64a74]
0000000180a64a74: mov      edx, dword ptr [rcx + rax*4 + 0xa64b40]
0000000180a64a7b: add      rdx, rcx
0000000180a64a7e: jmp      rdx
0000000180a64a80: xor      edx, edx
0000000180a64a82: mov      rcx, rbx
0000000180a64a85: add      rsp, 0x20
0000000180a64a89: pop      rbx
0000000180a64a8a: jmp      0x180a7b770 ; Torappu.Battle.Enemy.get_blockManager [76548]
0000000180a64a8f: xor      edx, edx
0000000180a64a91: mov      rcx, rbx
0000000180a64a94: add      rsp, 0x20
0000000180a64a98: pop      rbx
0000000180a64a99: jmp      0x180a39400 ; Torappu.Battle.Character.get_blockManager [75897]
0000000180a64a9e: cmp      byte ptr [rip + 0x8267d4b], 0
0000000180a64aa5: mov      qword ptr [rsp + 0x30], rsi
0000000180a64aaa: mov      rsi, qword ptr [rbx]
0000000180a64aad: mov      qword ptr [rsp + 0x38], rdi
0000000180a64ab2: mov      rdi, qword ptr [rip + 0x7ed99e7] ; TypeInfo Torappu.Battle.IBlocker @0x18893e4a0
0000000180a64ab9: je       0x180a64ac3
0000000180a64abb: mov      rcx, rsi
0000000180a64abe: call     0x180446d00
0000000180a64ac3: movzx    edx, word ptr [rsi + 0x12e]
0000000180a64aca: xor      ecx, ecx
0000000180a64acc: cmp      cx, dx
0000000180a64acf: jae      0x180a64af4
0000000180a64ad1: mov      r8, qword ptr [rsi + 0xb0]
0000000180a64ad8: nop      dword ptr [rax + rax]
0000000180a64ae0: movzx    eax, cx
0000000180a64ae3: add      rax, rax
0000000180a64ae6: cmp      qword ptr [r8 + rax*8], rdi
0000000180a64aea: je       0x180a64b21
0000000180a64aec: inc      cx
0000000180a64aef: cmp      cx, dx
0000000180a64af2: jb       0x180a64ae0
0000000180a64af4: mov      r8d, 1
0000000180a64afa: mov      rdx, rdi
0000000180a64afd: mov      rcx, rbx
0000000180a64b00: call     0x180445cc0
0000000180a64b05: mov      r8, qword ptr [rax]
0000000180a64b08: mov      rcx, rbx
0000000180a64b0b: mov      rdx, qword ptr [rax + 8]
0000000180a64b0f: mov      rdi, qword ptr [rsp + 0x38]
0000000180a64b14: mov      rsi, qword ptr [rsp + 0x30]
0000000180a64b19: add      rsp, 0x20
0000000180a64b1d: pop      rbx
0000000180a64b1e: jmp      r8
0000000180a64b21: movzx    ecx, cx
0000000180a64b24: add      rcx, rcx
0000000180a64b27: mov      eax, dword ptr [r8 + rcx*8 + 8]
0000000180a64b2c: inc      eax
0000000180a64b2e: cdqe     
0000000180a64b30: add      rax, 0x14
0000000180a64b34: shl      rax, 4
0000000180a64b38: add      rax, rsi
0000000180a64b3b: jmp      0x180a64b05
0000000180a64b3d: nop      dword ptr [rax]
0000000180a64b40: or       byte ptr [rdx - 0x5a], 0
0000000180a64b44: or       byte ptr [rdx - 0x5a], 0
0000000180a64b48: or       byte ptr [rdx - 0x5a], 0