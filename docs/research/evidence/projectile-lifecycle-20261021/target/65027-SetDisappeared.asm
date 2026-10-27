; Torappu.Battle.BObject.SetDisappeared metadata=65027 token=0x600fe04 VA=0x180662be0 RVA=0x662be0 size=0x90
0000000180662be0: mov      qword ptr [rsp + 8], rbx
0000000180662be5: push     rdi
0000000180662be6: sub      rsp, 0x20
0000000180662bea: cmp      dword ptr [rcx + 0x18], 0
0000000180662bee: movzx    edi, dl
0000000180662bf1: mov      rbx, rcx
0000000180662bf4: jbe      0x180662c62
0000000180662bf6: cmp      dl, byte ptr [rcx + 0x26]
0000000180662bf9: je       0x180662c62
0000000180662bfb: cmp      byte ptr [rip + 0x8669bee], 0
0000000180662c02: jbe      0x180662c0c
0000000180662c04: mov      rcx, qword ptr [rcx]
0000000180662c07: call     0x180446d00
0000000180662c0c: mov      r8, qword ptr [rbx]
0000000180662c0f: movzx    edx, dil
0000000180662c13: mov      rcx, rbx
0000000180662c16: mov      rax, qword ptr [r8 + 0x350]
0000000180662c1d: mov      r8, qword ptr [r8 + 0x358]
0000000180662c24: call     rax
0000000180662c26: mov      byte ptr [rbx + 0x26], dil
0000000180662c2a: cmp      byte ptr [rip + 0x8669bbf], 0
0000000180662c31: jbe      0x180662c3b
0000000180662c33: mov      rcx, qword ptr [rbx]
0000000180662c36: call     0x180446d00
0000000180662c3b: mov      r8, qword ptr [rbx]
0000000180662c3e: movzx    edx, dil
0000000180662c42: mov      rcx, rbx
0000000180662c45: mov      rax, qword ptr [r8 + 0x360]
0000000180662c4c: mov      r8, qword ptr [r8 + 0x368]
0000000180662c53: call     rax
0000000180662c55: mov      al, 1
0000000180662c57: mov      rbx, qword ptr [rsp + 0x30]
0000000180662c5c: add      rsp, 0x20
0000000180662c60: pop      rdi
0000000180662c61: ret      
0000000180662c62: mov      rbx, qword ptr [rsp + 0x30]
0000000180662c67: xor      al, al
0000000180662c69: add      rsp, 0x20
0000000180662c6d: pop      rdi
0000000180662c6e: ret      
0000000180662c6f: int3     