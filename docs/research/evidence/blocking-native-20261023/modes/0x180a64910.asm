; <Module>.raw-interface-wrapper metadata=0 token=0x0 VA=0x180a64910 RVA=0xa64910 size=0x190
0000000180a64910: push     rbx
0000000180a64912: sub      rsp, 0x20
0000000180a64916: mov      rax, qword ptr [rcx]
0000000180a64919: mov      rbx, rcx
0000000180a6491c: mov      edx, dword ptr [rax + 0x11c]
0000000180a64922: add      edx, -0x60
0000000180a64925: cmp      edx, 0x12
0000000180a64928: ja       0x180a6495e
0000000180a6492a: movsxd   rax, edx
0000000180a6492d: lea      rcx, [rip - 0xa64934]
0000000180a64934: mov      edx, dword ptr [rcx + rax*4 + 0xa649f8]
0000000180a6493b: add      rdx, rcx
0000000180a6493e: jmp      rdx
0000000180a64940: xor      edx, edx
0000000180a64942: mov      rcx, rbx
0000000180a64945: add      rsp, 0x20
0000000180a64949: pop      rbx
0000000180a6494a: jmp      0x180a7b450 ; Torappu.Battle.Enemy.get_asEntity [76547]
0000000180a6494f: xor      edx, edx
0000000180a64951: mov      rcx, rbx
0000000180a64954: add      rsp, 0x20
0000000180a64958: pop      rbx
0000000180a64959: jmp      0x180a39040 ; Torappu.Battle.Character.get_asEntity [75896]
0000000180a6495e: cmp      byte ptr [rip + 0x8267e8b], 0
0000000180a64965: mov      qword ptr [rsp + 0x30], rsi
0000000180a6496a: mov      rsi, qword ptr [rbx]
0000000180a6496d: mov      qword ptr [rsp + 0x38], rdi
0000000180a64972: mov      rdi, qword ptr [rip + 0x7ed9b27] ; TypeInfo Torappu.Battle.IBlocker @0x18893e4a0
0000000180a64979: je       0x180a64983
0000000180a6497b: mov      rcx, rsi
0000000180a6497e: call     0x180446d00
0000000180a64983: movzx    edx, word ptr [rsi + 0x12e]
0000000180a6498a: xor      ecx, ecx
0000000180a6498c: cmp      cx, dx
0000000180a6498f: jae      0x180a649b4
0000000180a64991: mov      r8, qword ptr [rsi + 0xb0]
0000000180a64998: nop      dword ptr [rax + rax]
0000000180a649a0: movzx    eax, cx
0000000180a649a3: add      rax, rax
0000000180a649a6: cmp      qword ptr [r8 + rax*8], rdi
0000000180a649aa: je       0x180a649de
0000000180a649ac: inc      cx
0000000180a649af: cmp      cx, dx
0000000180a649b2: jb       0x180a649a0
0000000180a649b4: xor      r8d, r8d
0000000180a649b7: mov      rdx, rdi
0000000180a649ba: mov      rcx, rbx
0000000180a649bd: call     0x180445cc0
0000000180a649c2: mov      r8, qword ptr [rax]
0000000180a649c5: mov      rcx, rbx
0000000180a649c8: mov      rdx, qword ptr [rax + 8]
0000000180a649cc: mov      rdi, qword ptr [rsp + 0x38]
0000000180a649d1: mov      rsi, qword ptr [rsp + 0x30]
0000000180a649d6: add      rsp, 0x20
0000000180a649da: pop      rbx
0000000180a649db: jmp      r8
0000000180a649de: movzx    ecx, cx
0000000180a649e1: add      rcx, rcx
0000000180a649e4: movsxd   rax, dword ptr [r8 + rcx*8 + 8]
0000000180a649e9: add      rax, 0x14
0000000180a649ed: shl      rax, 4
0000000180a649f1: add      rax, rsi
0000000180a649f4: jmp      0x180a649c2
0000000180a649f6: nop      
0000000180a649f8: cmpsb    byte ptr [rsi], byte ptr [rdi]
0000000180a649fb: add      byte ptr [rax + 0x49], al
0000000180a649fe: cmpsb    byte ptr [rsi], byte ptr [rdi]
0000000180a649ff: add      byte ptr [rax + 0x49], al
0000000180a64a02: cmpsb    byte ptr [rsi], byte ptr [rdi]
0000000180a64a03: add      byte ptr [rdi + 0x49], cl
0000000180a64a06: cmpsb    byte ptr [rsi], byte ptr [rdi]
0000000180a64a07: add      byte ptr [rdi + 0x49], cl
0000000180a64a0a: cmpsb    byte ptr [rsi], byte ptr [rdi]
0000000180a64a0b: add      byte ptr [rdi + 0x49], cl
0000000180a64a0e: cmpsb    byte ptr [rsi], byte ptr [rdi]
0000000180a64a0f: add      byte ptr [rax + 0x49], al
0000000180a64a12: cmpsb    byte ptr [rsi], byte ptr [rdi]
0000000180a64a13: add      byte ptr [rax + 0x49], al
0000000180a64a16: cmpsb    byte ptr [rsi], byte ptr [rdi]
0000000180a64a17: add      byte ptr [rax + 0x49], al
0000000180a64a1a: cmpsb    byte ptr [rsi], byte ptr [rdi]
0000000180a64a1b: add      byte ptr [rax + 0x49], al
0000000180a64a1e: cmpsb    byte ptr [rsi], byte ptr [rdi]
0000000180a64a1f: add      byte ptr [rdi + 0x49], cl
0000000180a64a22: cmpsb    byte ptr [rsi], byte ptr [rdi]
0000000180a64a23: add      byte ptr [rax + 0x49], al
0000000180a64a26: cmpsb    byte ptr [rsi], byte ptr [rdi]
0000000180a64a27: add      byte ptr [rax + 0x49], al
0000000180a64a2a: cmpsb    byte ptr [rsi], byte ptr [rdi]
0000000180a64a2b: add      byte ptr [rdi + 0x49], cl
0000000180a64a2e: cmpsb    byte ptr [rsi], byte ptr [rdi]
0000000180a64a2f: add      byte ptr [rax + 0x49], al
0000000180a64a32: cmpsb    byte ptr [rsi], byte ptr [rdi]
0000000180a64a33: add      byte ptr [rdi + 0x49], cl
0000000180a64a36: cmpsb    byte ptr [rsi], byte ptr [rdi]
0000000180a64a37: add      byte ptr [rax + 0x49], al
0000000180a64a3a: cmpsb    byte ptr [rsi], byte ptr [rdi]
0000000180a64a3b: add      byte ptr [rax + 0x49], al
0000000180a64a3e: cmpsb    byte ptr [rsi], byte ptr [rdi]
0000000180a64a3f: add      byte ptr [rax + 0x49], al
0000000180a64a42: cmpsb    byte ptr [rsi], byte ptr [rdi]
0000000180a64a43: add      ah, cl
0000000180a64a45: int3     
0000000180a64a46: int3     
0000000180a64a47: int3     
0000000180a64a48: int3     
0000000180a64a49: int3     
0000000180a64a4a: int3     
0000000180a64a4b: int3     
0000000180a64a4c: int3     
0000000180a64a4d: int3     
0000000180a64a4e: int3     
0000000180a64a4f: int3     
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