; <Module>.raw-interface-wrapper metadata=0 token=0x0 VA=0x180a64780 RVA=0xa64780 size=0x190
0000000180a64780: mov      qword ptr [rsp + 0x18], rbx
0000000180a64785: push     rdi
0000000180a64786: sub      rsp, 0x30
0000000180a6478a: mov      rax, qword ptr [rcx]
0000000180a6478d: mov      rdi, rdx
0000000180a64790: movaps   xmmword ptr [rsp + 0x20], xmm6
0000000180a64795: mov      rbx, rcx
0000000180a64798: movaps   xmm6, xmm2
0000000180a6479b: mov      r8d, dword ptr [rax + 0x11c]
0000000180a647a2: add      r8d, -0x60
0000000180a647a6: cmp      r8d, 0x12
0000000180a647aa: ja       0x180a64812
0000000180a647ac: movsxd   rax, r8d
0000000180a647af: lea      rcx, [rip - 0xa647b6]
0000000180a647b6: mov      r8d, dword ptr [rcx + rax*4 + 0xa648c0]
0000000180a647be: add      r8, rcx
0000000180a647c1: jmp      r8
0000000180a647c4: xor      r9d, r9d
0000000180a647c7: mov      rcx, rbx
0000000180a647ca: mov      rbx, qword ptr [rsp + 0x50]
0000000180a647cf: movaps   xmm6, xmmword ptr [rsp + 0x20]
0000000180a647d4: add      rsp, 0x30
0000000180a647d8: pop      rdi
0000000180a647d9: jmp      0x180a6be30 ; Torappu.Battle.Enemy.CheckInBlockRange [76554]
0000000180a647de: xor      r9d, r9d
0000000180a647e1: mov      rcx, rbx
0000000180a647e4: mov      rbx, qword ptr [rsp + 0x50]
0000000180a647e9: movaps   xmm6, xmmword ptr [rsp + 0x20]
0000000180a647ee: add      rsp, 0x30
0000000180a647f2: pop      rdi
0000000180a647f3: jmp      0x180a28250 ; Torappu.Battle.Character.CheckInBlockRange [76015]
0000000180a647f8: xor      r9d, r9d
0000000180a647fb: mov      rcx, rbx
0000000180a647fe: mov      rbx, qword ptr [rsp + 0x50]
0000000180a64803: movaps   xmm6, xmmword ptr [rsp + 0x20]
0000000180a64808: add      rsp, 0x30
0000000180a6480c: pop      rdi
0000000180a6480d: jmp      0x180aa69c0 ; Torappu.Battle.GiantTrap.CheckInBlockRange [77113]
0000000180a64812: cmp      byte ptr [rip + 0x8267fd7], 0
0000000180a64819: mov      qword ptr [rsp + 0x40], rbp
0000000180a6481e: mov      rbp, qword ptr [rbx]
0000000180a64821: mov      qword ptr [rsp + 0x48], rsi
0000000180a64826: mov      rsi, qword ptr [rip + 0x7ed9c73] ; TypeInfo Torappu.Battle.IBlocker @0x18893e4a0
0000000180a6482d: je       0x180a64837
0000000180a6482f: mov      rcx, rbp
0000000180a64832: call     0x180446d00
0000000180a64837: movzx    edx, word ptr [rbp + 0x12e]
0000000180a6483e: xor      ecx, ecx
0000000180a64840: cmp      cx, dx
0000000180a64843: jae      0x180a64864
0000000180a64845: mov      r8, qword ptr [rbp + 0xb0]
0000000180a6484c: nop      dword ptr [rax]
0000000180a64850: movzx    eax, cx
0000000180a64853: add      rax, rax
0000000180a64856: cmp      qword ptr [r8 + rax*8], rsi
0000000180a6485a: je       0x180a648a1
0000000180a6485c: inc      cx
0000000180a6485f: cmp      cx, dx
0000000180a64862: jb       0x180a64850
0000000180a64864: mov      r8d, 9
0000000180a6486a: mov      rdx, rsi
0000000180a6486d: mov      rcx, rbx
0000000180a64870: call     0x180445cc0
0000000180a64875: mov      r8, qword ptr [rax]
0000000180a64878: movaps   xmm2, xmm6
0000000180a6487b: mov      r9, qword ptr [rax + 8]
0000000180a6487f: mov      rdx, rdi
0000000180a64882: mov      rcx, rbx
0000000180a64885: mov      rsi, qword ptr [rsp + 0x48]
0000000180a6488a: mov      rbp, qword ptr [rsp + 0x40]
0000000180a6488f: mov      rbx, qword ptr [rsp + 0x50]
0000000180a64894: movaps   xmm6, xmmword ptr [rsp + 0x20]
0000000180a64899: add      rsp, 0x30
0000000180a6489d: pop      rdi
0000000180a6489e: jmp      r8
0000000180a648a1: movzx    ecx, cx
0000000180a648a4: add      rcx, rcx
0000000180a648a7: mov      eax, dword ptr [r8 + rcx*8 + 8]
0000000180a648ac: add      eax, 9
0000000180a648af: cdqe     
0000000180a648b1: add      rax, 0x14
0000000180a648b5: shl      rax, 4
0000000180a648b9: add      rax, rbp
0000000180a648bc: jmp      0x180a64875
0000000180a648be: nop      