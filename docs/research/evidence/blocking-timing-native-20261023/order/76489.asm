; Torappu.Battle.Enemy._MoveInAttractArea metadata=76489 token=0x6012aca VA=0x180a797d0 RVA=0xa797d0 size=0x100
0000000180a797d0: mov      qword ptr [rsp + 8], rbx
0000000180a797d5: push     rdi
0000000180a797d6: sub      rsp, 0x40
0000000180a797da: cmp      byte ptr [rip + 0x82190d1], 0
0000000180a797e1: mov      rdi, r8
0000000180a797e4: movaps   xmmword ptr [rsp + 0x30], xmm6
0000000180a797e9: mov      rbx, rcx
0000000180a797ec: movaps   xmm6, xmm1
0000000180a797ef: jne      0x180a79804
0000000180a797f1: lea      rcx, [rip + 0x7da1eb8] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a797f8: call     0x18048bf00
0000000180a797fd: mov      byte ptr [rip + 0x82190ae], 1
0000000180a79804: mov      rax, qword ptr [rip + 0x7da1ea5] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7980b: cmp      dword ptr [rax + 0xe0], 0
0000000180a79812: jne      0x180a79823
0000000180a79814: mov      rcx, rax
0000000180a79817: call     0x18048c140
0000000180a7981c: mov      rax, qword ptr [rip + 0x7da1e8d] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a79823: mov      rax, qword ptr [rax + 0xb8]
0000000180a7982a: mov      rcx, qword ptr [rax + 0x6d0]
0000000180a79831: test     rcx, rcx
0000000180a79834: jne      0x180a7989f
0000000180a79836: mov      rax, qword ptr [rbx + 0x3e0]
0000000180a7983d: test     rax, rax
0000000180a79840: je       0x180a798c6
0000000180a79846: mov      rax, qword ptr [rax + 0x20]
0000000180a7984a: test     rax, rax
0000000180a7984d: jne      0x180a79875
0000000180a7984f: cmp      byte ptr [rip + 0x8252f9b], al
0000000180a79855: jbe      0x180a7985f
0000000180a79857: mov      rcx, qword ptr [rbx]
0000000180a7985a: call     0x180446d00
0000000180a7985f: mov      rdx, qword ptr [rbx]
0000000180a79862: mov      rcx, rbx
0000000180a79865: mov      rax, qword ptr [rdx + 0xf50]
0000000180a7986c: mov      rdx, qword ptr [rdx + 0xf58]
0000000180a79873: call     rax
0000000180a79875: mov      r9, rdi
0000000180a79878: mov      qword ptr [rsp + 0x20], 0
0000000180a79881: movaps   xmm2, xmm6
0000000180a79884: mov      rdx, rax
0000000180a79887: mov      rcx, rbx
0000000180a7988a: call     0x180a78fc0 ; Torappu.Battle.Enemy._MoveByCursor [76491]
0000000180a7988f: mov      rbx, qword ptr [rsp + 0x50]
0000000180a79894: movaps   xmm6, xmmword ptr [rsp + 0x30]
0000000180a79899: add      rsp, 0x40
0000000180a7989d: pop      rdi
0000000180a7989e: ret      
0000000180a7989f: mov      r9, rdi
0000000180a798a2: mov      qword ptr [rsp + 0x20], 0
0000000180a798ab: movaps   xmm2, xmm6
0000000180a798ae: mov      rdx, rbx
0000000180a798b1: call     0x183395aa0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3647 [6302]
0000000180a798b6: mov      rbx, qword ptr [rsp + 0x50]
0000000180a798bb: movaps   xmm6, xmmword ptr [rsp + 0x30]
0000000180a798c0: add      rsp, 0x40
0000000180a798c4: pop      rdi
0000000180a798c5: ret      
0000000180a798c6: call     0x18048c0b0
0000000180a798cb: int3     
0000000180a798cc: int3     
0000000180a798cd: int3     
0000000180a798ce: int3     
0000000180a798cf: int3     