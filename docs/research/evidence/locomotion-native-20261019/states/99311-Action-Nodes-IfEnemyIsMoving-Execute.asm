; Torappu.Battle.Action.Nodes.IfEnemyIsMoving.Execute metadata=99311 token=0x60183f0 VA=0x181146030 RVA=0x1146030 size=0x200
0000000181146030: mov      qword ptr [rsp + 0x10], rbp
0000000181146035: mov      qword ptr [rsp + 0x18], rsi
000000018114603a: mov      qword ptr [rsp + 0x20], rdi
000000018114603f: push     r14
0000000181146041: sub      rsp, 0x40
0000000181146045: cmp      byte ptr [rip + 0x7b51234], 0
000000018114604c: mov      rdi, r9
000000018114604f: mov      ebp, r8d
0000000181146052: mov      r14, rdx
0000000181146055: mov      rsi, rcx
0000000181146058: jne      0x181146085
000000018114605a: lea      rcx, [rip + 0x76d564f] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000181146061: call     0x18048bf00
0000000181146066: lea      rcx, [rip + 0x774327b] ; TypeInfo Torappu.Battle.Action.Nodes.IfEnemyIsMoving @0x1888892e8
000000018114606d: call     0x18048bf00
0000000181146072: lea      rcx, [rip + 0x77ecc6f] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000181146079: call     0x18048bf00
000000018114607e: mov      byte ptr [rip + 0x7b511fb], 1
0000000181146085: mov      rax, qword ptr [rip + 0x774325c] ; TypeInfo Torappu.Battle.Action.Nodes.IfEnemyIsMoving @0x1888892e8
000000018114608c: mov      qword ptr [rsp + 0x50], rbx
0000000181146091: mov      rcx, qword ptr [rax + 0xb8]
0000000181146098: mov      rcx, qword ptr [rcx + 8]
000000018114609c: test     rcx, rcx
000000018114609f: jne      0x1811461f1
00000001811460a5: mov      edx, dword ptr [rsi + 0x10]
00000001811460a8: xor      r8d, r8d
00000001811460ab: mov      rcx, rdi
00000001811460ae: call     0x180fceed0 ; Torappu.Battle.Action.Nodes.GetActionTarget [95120]
00000001811460b3: mov      rdx, qword ptr [rip + 0x76d55f6] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
00000001811460ba: mov      rdi, rax
00000001811460bd: test     rax, rax
00000001811460c0: jne      0x1811460c6
00000001811460c2: xor      ebx, ebx
00000001811460c4: jmp      0x181146110
00000001811460c6: cmp      byte ptr [rip + 0x7b86723], 0
00000001811460cd: mov      r8, qword ptr [rax]
00000001811460d0: jbe      0x1811460e0
00000001811460d2: mov      rcx, r8
00000001811460d5: call     0x1804463e0
00000001811460da: xor      ebx, ebx
00000001811460dc: test     al, al
00000001811460de: jmp      0x18114610c
00000001811460e0: movzx    eax, byte ptr [rdx + 0x130]
00000001811460e7: xor      ebx, ebx
00000001811460e9: cmp      byte ptr [r8 + 0x130], al
00000001811460f0: jb       0x181146108
00000001811460f2: movzx    ecx, al
00000001811460f5: mov      rax, qword ptr [r8 + 0xc8]
00000001811460fc: cmp      qword ptr [rax + rcx*8 - 8], rdx
0000000181146101: mov      eax, 1
0000000181146106: je       0x18114610a
0000000181146108: mov      eax, ebx
000000018114610a: test     eax, eax
000000018114610c: cmovne   rbx, rdi
0000000181146110: mov      rcx, qword ptr [rip + 0x77ecbd1] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000181146117: cmp      dword ptr [rcx + 0xe0], 0
000000018114611e: jne      0x181146125
0000000181146120: call     0x18048c140
0000000181146125: xor      r8d, r8d
0000000181146128: xor      edx, edx
000000018114612a: mov      rcx, rbx
000000018114612d: call     0x186b63a70
0000000181146132: test     al, al
0000000181146134: jne      0x18114613b
0000000181146136: jmp      0x18114620b
000000018114613b: test     rbx, rbx
000000018114613e: je       0x181146226
0000000181146144: cmp      byte ptr [rip + 0x7b866a5], 0
000000018114614b: jbe      0x181146155
000000018114614d: mov      rcx, qword ptr [rbx]
0000000181146150: call     0x180446d00
0000000181146155: mov      rdx, qword ptr [rbx]
0000000181146158: mov      rcx, rbx
000000018114615b: mov      rax, qword ptr [rdx + 0xf20]
0000000181146162: mov      rdx, qword ptr [rdx + 0xf28]
0000000181146169: call     rax
000000018114616b: cmp      byte ptr [rip + 0x7b4961d], 0
0000000181146172: mov      qword ptr [rsp + 0x30], rax
0000000181146177: jne      0x18114618c
0000000181146179: lea      rcx, [rip + 0x777d640] ; TypeInfo System.Math @0x1888c37c0
0000000181146180: call     0x18048bf00
0000000181146185: mov      byte ptr [rip + 0x7b49603], 1
000000018114618c: mov      rcx, qword ptr [rip + 0x777d62d] ; TypeInfo System.Math @0x1888c37c0
0000000181146193: cmp      dword ptr [rcx + 0xe0], 0
000000018114619a: jne      0x1811461a1
000000018114619c: call     0x18048c140
00000001811461a1: movss    xmm1, dword ptr [rsp + 0x34]
00000001811461a7: movss    xmm0, dword ptr [rsp + 0x30]
00000001811461ad: mulss    xmm1, xmm1
00000001811461b1: mulss    xmm0, xmm0
00000001811461b5: addss    xmm1, xmm0
00000001811461b9: xorps    xmm0, xmm0
00000001811461bc: cvtps2pd xmm2, xmm1
00000001811461bf: ucomisd  xmm0, xmm2
00000001811461c3: ja       0x1811461d9
00000001811461c5: sqrtpd   xmm0, xmm2
00000001811461c9: cvtsd2ss xmm0, xmm0
00000001811461cd: comiss   xmm0, dword ptr [rip + 0x5cf9d40]
00000001811461d4: seta     al
00000001811461d7: jmp      0x18114620b
00000001811461d9: movaps   xmm0, xmm2
00000001811461dc: call     0x1804d2720
00000001811461e1: cvtsd2ss xmm0, xmm0
00000001811461e5: comiss   xmm0, dword ptr [rip + 0x5cf9d28]
00000001811461ec: seta     al
00000001811461ef: jmp      0x18114620b
00000001811461f1: xor      ebx, ebx
00000001811461f3: mov      r9d, ebp
00000001811461f6: mov      qword ptr [rsp + 0x28], rbx
00000001811461fb: mov      r8, r14
00000001811461fe: mov      rdx, rsi
0000000181146201: mov      qword ptr [rsp + 0x20], rdi
0000000181146206: call     0x183108750 ; XLua.DelegateBridge.__Gen_Delegate_Imp11071 [13726]
000000018114620b: mov      rbx, qword ptr [rsp + 0x50]
0000000181146210: mov      rbp, qword ptr [rsp + 0x58]
0000000181146215: mov      rsi, qword ptr [rsp + 0x60]
000000018114621a: mov      rdi, qword ptr [rsp + 0x68]
000000018114621f: add      rsp, 0x40
0000000181146223: pop      r14
0000000181146225: ret      
0000000181146226: call     0x18048c0b0
000000018114622b: int3     
000000018114622c: int3     
000000018114622d: int3     
000000018114622e: int3     
000000018114622f: int3     
