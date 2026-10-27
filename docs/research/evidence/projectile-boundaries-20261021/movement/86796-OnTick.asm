; Torappu.Battle.Projectiles.AmiyaDefaultMovement.OnTick metadata=86796 token=0x601530d VA=0x180d560f0 RVA=0xd560f0 size=0x2b0
0000000180d560f0: mov      qword ptr [rsp + 0x18], rdi
0000000180d560f5: mov      qword ptr [rsp + 0x10], rdx
0000000180d560fa: push     rbp
0000000180d560fb: mov      rbp, rsp
0000000180d560fe: sub      rsp, 0x80
0000000180d56105: cmp      byte ptr [rip + 0x7f3e5d2], 0
0000000180d5610c: mov      rdi, rcx
0000000180d5610f: jne      0x180d56134
0000000180d56111: lea      rcx, [rip + 0x7ad8e60] ; TypeInfo Torappu.Battle.Projectiles.AmiyaDefaultMovement @0x18882ef78
0000000180d56118: call     0x18048bf00
0000000180d5611d: lea      rcx, [rip + 0x7b045dc] ; TypeInfo Torappu.FP @0x18885a700
0000000180d56124: call     0x18048bf00
0000000180d56129: mov      rdx, qword ptr [rbp + 0x18]
0000000180d5612d: mov      byte ptr [rip + 0x7f3e5aa], 1
0000000180d56134: mov      rax, qword ptr [rip + 0x7ad8e3d] ; TypeInfo Torappu.Battle.Projectiles.AmiyaDefaultMovement @0x18882ef78
0000000180d5613b: mov      rcx, qword ptr [rax + 0xb8]
0000000180d56142: mov      rcx, qword ptr [rcx + 0x10]
0000000180d56146: test     rcx, rcx
0000000180d56149: jne      0x180d56379
0000000180d5614f: movaps   xmmword ptr [rsp + 0x50], xmm8
0000000180d56155: xor      r8d, r8d
0000000180d56158: mov      rcx, rdi
0000000180d5615b: call     0x1808cbc30 ; Torappu.Battle.BasicMovement.OnTick [71215]
0000000180d56160: mov      rcx, qword ptr [rip + 0x7b04599] ; TypeInfo Torappu.FP @0x18885a700
0000000180d56167: cmp      dword ptr [rcx + 0xe0], 0
0000000180d5616e: jne      0x180d56175
0000000180d56170: call     0x18048c140
0000000180d56175: xor      edx, edx
0000000180d56177: lea      rcx, [rbp + 0x18]
0000000180d5617b: call     0x1866fae20
0000000180d56180: cmp      byte ptr [rdi + 0xc8], 0
0000000180d56187: movaps   xmm8, xmm0
0000000180d5618b: je       0x180d56362
0000000180d56191: cmp      byte ptr [rdi + 0x6c], 0
0000000180d56195: jne      0x180d56331
0000000180d5619b: mov      qword ptr [rsp + 0x90], rbx
0000000180d561a3: xor      edx, edx
0000000180d561a5: movaps   xmmword ptr [rsp + 0x70], xmm6
0000000180d561aa: mov      rcx, rdi
0000000180d561ad: movaps   xmmword ptr [rsp + 0x60], xmm7
0000000180d561b2: call     0x1808ca5f0 ; Torappu.Battle.BasicMovement.CheckReached [71221]
0000000180d561b7: test     al, al
0000000180d561b9: je       0x180d561c5
0000000180d561bb: xor      edx, edx
0000000180d561bd: mov      rcx, rdi
0000000180d561c0: call     0x1808ce920 ; Torappu.Battle.Projectile.Behaviour.Stop [71422]
0000000180d561c5: cmp      byte ptr [rip + 0x7f76624], 0
0000000180d561cc: jbe      0x180d561d6
0000000180d561ce: mov      rcx, qword ptr [rdi]
0000000180d561d1: call     0x180446d00
0000000180d561d6: mov      r8, qword ptr [rdi]
0000000180d561d9: lea      rcx, [rbp - 0x50]
0000000180d561dd: mov      rdx, rdi
0000000180d561e0: mov      rax, qword ptr [r8 + 0x2c0]
0000000180d561e7: mov      r8, qword ptr [r8 + 0x2c8]
0000000180d561ee: call     rax
0000000180d561f0: xor      r8d, r8d
0000000180d561f3: lea      rcx, [rbp - 0x50]
0000000180d561f7: mov      rdx, rdi
0000000180d561fa: movsd    xmm0, qword ptr [rax]
0000000180d561fe: mov      ebx, dword ptr [rax + 8]
0000000180d56201: movsd    qword ptr [rdi + 0x60], xmm0
0000000180d56206: mov      dword ptr [rdi + 0x68], ebx
0000000180d56209: movsd    qword ptr [rbp - 0x60], xmm0
0000000180d5620e: call     0x1808cdb70 ; Torappu.Battle.BasicMovement.get_position [71203]
0000000180d56213: movss    xmm3, dword ptr [rbp - 0x60]
0000000180d56218: movss    xmm2, dword ptr [rbp - 0x5c]
0000000180d5621d: movsd    xmm1, qword ptr [rax]
0000000180d56221: movaps   xmm0, xmm1
0000000180d56224: movsd    qword ptr [rbp - 0x60], xmm1
0000000180d56229: subss    xmm3, xmm1
0000000180d5622d: shufps   xmm0, xmm0, 0x55
0000000180d56231: movd     xmm1, ebx
0000000180d56235: subss    xmm2, xmm0
0000000180d56239: subss    xmm1, dword ptr [rax + 8]
0000000180d5623e: unpcklps xmm3, xmm2
0000000180d56241: lea      rdx, [rbp - 0x60]
0000000180d56245: xor      r8d, r8d
0000000180d56248: movsd    qword ptr [rbp - 0x60], xmm3
0000000180d5624d: lea      rcx, [rbp - 0x40]
0000000180d56251: movss    dword ptr [rbp - 0x58], xmm1
0000000180d56256: call     0x18051dd20
0000000180d5625b: xor      r8d, r8d
0000000180d5625e: lea      rdx, [rbp - 0x50]
0000000180d56262: mov      rcx, rdi
0000000180d56265: movsd    xmm0, qword ptr [rax]
0000000180d56269: mov      eax, dword ptr [rax + 8]
0000000180d5626c: movsd    qword ptr [rbp - 0x50], xmm0
0000000180d56271: mov      dword ptr [rbp - 0x48], eax
0000000180d56274: call     0x1808cdee0 ; Torappu.Battle.BasicMovement.set_direction [71202]
0000000180d56279: xor      edx, edx
0000000180d5627b: lea      rcx, [rbp - 0x60]
0000000180d5627f: call     0x1805690f0
0000000180d56284: movaps   xmm7, xmm0
0000000180d56287: lea      rcx, [rbp - 0x40]
0000000180d5628b: divss    xmm7, dword ptr [rdi + 0xc4]
0000000180d56293: xor      r8d, r8d
0000000180d56296: mov      rdx, rdi
0000000180d56299: call     0x1808cdb70 ; Torappu.Battle.BasicMovement.get_position [71203]
0000000180d5629e: xor      r8d, r8d
0000000180d562a1: lea      rcx, [rbp - 0x40]
0000000180d562a5: mov      rdx, rdi
0000000180d562a8: mov      ebx, dword ptr [rax + 8]
0000000180d562ab: movsd    xmm6, qword ptr [rax]
0000000180d562af: call     0x1808cda30 ; Torappu.Battle.BasicMovement.get_direction [71201]
0000000180d562b4: movsd    xmm0, qword ptr [rax]
0000000180d562b8: movss    xmm1, dword ptr [rax + 8]
0000000180d562bd: movaps   xmm2, xmm0
0000000180d562c0: movaps   xmm3, xmm0
0000000180d562c3: movsd    qword ptr [rbp - 0x50], xmm0
0000000180d562c8: shufps   xmm2, xmm2, 0x55
0000000180d562cc: movaps   xmm0, xmm6
0000000180d562cf: mulss    xmm2, xmm8
0000000180d562d4: mulss    xmm3, xmm8
0000000180d562d9: mulss    xmm1, xmm8
0000000180d562de: shufps   xmm0, xmm0, 0x55
0000000180d562e2: mulss    xmm2, xmm7
0000000180d562e6: mulss    xmm3, xmm7
0000000180d562ea: mulss    xmm1, xmm7
0000000180d562ee: addss    xmm2, xmm0
0000000180d562f2: movd     xmm0, ebx
0000000180d562f6: addss    xmm3, xmm6
0000000180d562fa: movsd    qword ptr [rbp - 0x50], xmm6
0000000180d562ff: addss    xmm1, xmm0
0000000180d56303: unpcklps xmm3, xmm2
0000000180d56306: lea      rdx, [rbp - 0x50]
0000000180d5630a: xor      r8d, r8d
0000000180d5630d: movsd    qword ptr [rbp - 0x50], xmm3
0000000180d56312: mov      rcx, rdi
0000000180d56315: movss    dword ptr [rbp - 0x48], xmm1
0000000180d5631a: call     0x1808cdfe0 ; Torappu.Battle.BasicMovement.set_position [71204]
0000000180d5631f: movaps   xmm7, xmmword ptr [rsp + 0x60]
0000000180d56324: movaps   xmm6, xmmword ptr [rsp + 0x70]
0000000180d56329: mov      rbx, qword ptr [rsp + 0x90]
0000000180d56331: movss    xmm1, dword ptr [rdi + 0xc4]
0000000180d56339: xorps    xmm0, xmm0
0000000180d5633c: subss    xmm1, xmm8
0000000180d56341: comiss   xmm0, xmm1
0000000180d56344: movss    dword ptr [rdi + 0xc4], xmm1
0000000180d5634c: jb       0x180d56362
0000000180d5634e: xor      edx, edx
0000000180d56350: mov      dword ptr [rdi + 0xc4], 0
0000000180d5635a: mov      rcx, rdi
0000000180d5635d: call     0x1808ce920 ; Torappu.Battle.Projectile.Behaviour.Stop [71422]
0000000180d56362: movaps   xmm8, xmmword ptr [rsp + 0x50]
0000000180d56368: mov      rdi, qword ptr [rsp + 0xa0]
0000000180d56370: add      rsp, 0x80
0000000180d56377: pop      rbp
0000000180d56378: ret      
0000000180d56379: mov      r8, rdx
0000000180d5637c: xor      r9d, r9d
0000000180d5637f: mov      rdx, rdi
0000000180d56382: call     0x1833f9830 ; XLua.DelegateBridge.__Gen_Delegate_Imp427 [3082]
0000000180d56387: mov      rdi, qword ptr [rsp + 0xa0]
0000000180d5638f: add      rsp, 0x80
0000000180d56396: pop      rbp
0000000180d56397: ret      
0000000180d56398: int3     
0000000180d56399: int3     
0000000180d5639a: int3     
0000000180d5639b: int3     
0000000180d5639c: int3     
0000000180d5639d: int3     
0000000180d5639e: int3     
0000000180d5639f: int3     