; <Module>.virtual-bool-helper metadata=-1 token=0x0 VA=0x180005610 RVA=0x5610 size=0x44
0000000180005610: mov      qword ptr [rsp + 8], rbx
0000000180005615: push     rdi
0000000180005616: sub      rsp, 0x20
000000018000561a: cmp      byte ptr [rip + 0x8cc71cf], 0
0000000180005621: mov      rbx, rdx
0000000180005624: movzx    edi, cx
0000000180005627: jbe      0x180005631
0000000180005629: mov      rcx, qword ptr [rdx]
000000018000562c: call     0x180446d00
0000000180005631: mov      rax, qword ptr [rbx]
0000000180005634: lea      rdx, [rdi + 0x14]
0000000180005638: add      rdx, rdx
000000018000563b: mov      rcx, rbx
000000018000563e: mov      r8, qword ptr [rax + rdx*8]
0000000180005642: mov      rdx, qword ptr [rax + rdx*8 + 8]
0000000180005647: mov      rbx, qword ptr [rsp + 0x30]
000000018000564c: add      rsp, 0x20
0000000180005650: pop      rdi
0000000180005651: jmp      r8