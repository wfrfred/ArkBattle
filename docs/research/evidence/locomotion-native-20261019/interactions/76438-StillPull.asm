; Torappu.Battle.Enemy.StillPull metadata=76438 token=0x6012a97 VA=0x180a752d0 RVA=0xa752d0 size=0x200
0000000180a752d0: mov      qword ptr [rsp + 0x10], rbx
0000000180a752d5: push     rsi
0000000180a752d6: sub      rsp, 0x70
0000000180a752da: cmp      byte ptr [rip + 0x821d59e], 0
0000000180a752e1: mov      rsi, rdx
0000000180a752e4: movaps   xmmword ptr [rsp + 0x60], xmm6
0000000180a752e9: mov      rbx, rcx
0000000180a752ec: movq     xmm6, r8
0000000180a752f1: movaps   xmmword ptr [rsp + 0x50], xmm7
0000000180a752f6: movsd    qword ptr [rsp + 0x30], xmm6
0000000180a752fc: movaps   xmm7, xmm3
0000000180a752ff: jne      0x180a75338
0000000180a75301: lea      rcx, [rip + 0x7da63a8] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a75308: call     0x18048bf00
0000000180a7530d: lea      rcx, [rip + 0x7da4ed4] ; GenericMethodInfo 267086 @0x18881a1e8
0000000180a75314: call     0x18048bf00
0000000180a75319: lea      rcx, [rip + 0x7ebbcc8] ; GenericMethodInfo 280346 @0x188930fe8
0000000180a75320: call     0x18048bf00
0000000180a75325: lea      rcx, [rip + 0x7ebd9bc] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a7532c: call     0x18048bf00
0000000180a75331: mov      byte ptr [rip + 0x821d547], 1
0000000180a75338: mov      rax, qword ptr [rip + 0x7da6371] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7533f: cmp      dword ptr [rax + 0xe0], 0
0000000180a75346: jne      0x180a75357
0000000180a75348: mov      rcx, rax
0000000180a7534b: call     0x18048c140
0000000180a75350: mov      rax, qword ptr [rip + 0x7da6359] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a75357: mov      rax, qword ptr [rax + 0xb8]
0000000180a7535e: mov      rcx, qword ptr [rax + 0x538]
0000000180a75365: test     rcx, rcx
0000000180a75368: jne      0x180a754a2
0000000180a7536e: cmp      byte ptr [rip + 0x825747c], cl
0000000180a75374: jbe      0x180a7537e
0000000180a75376: mov      rcx, qword ptr [rbx]
0000000180a75379: call     0x180446d00
0000000180a7537e: mov      rdx, qword ptr [rbx]
0000000180a75381: mov      rcx, rbx
0000000180a75384: mov      qword ptr [rsp + 0x80], rdi
0000000180a7538c: mov      rax, qword ptr [rdx + 0x3c0]
0000000180a75393: mov      rdx, qword ptr [rdx + 0x3c8]
0000000180a7539a: call     rax
0000000180a7539c: test     al, al
0000000180a7539e: je       0x180a7549e
0000000180a753a4: xor      edx, edx
0000000180a753a6: mov      rcx, rbx
0000000180a753a9: call     0x180706be0 ; Torappu.Battle.Entity.get_isUnbalanceImmune [66519]
0000000180a753ae: test     al, al
0000000180a753b0: jne      0x180a7549e
0000000180a753b6: xor      edx, edx
0000000180a753b8: mov      rcx, rbx
0000000180a753bb: call     0x180a7e4f0 ; Torappu.Battle.Enemy.get_isUnbalanced [76336]
0000000180a753c0: test     al, al
0000000180a753c2: je       0x180a7549e
0000000180a753c8: mov      rcx, qword ptr [rip + 0x7ebd919] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a753cf: cmp      dword ptr [rcx + 0xe0], 0
0000000180a753d6: jne      0x180a753dd
0000000180a753d8: call     0x18048c140
0000000180a753dd: xor      r8d, r8d
0000000180a753e0: xor      edx, edx
0000000180a753e2: mov      rcx, rsi
0000000180a753e5: call     0x186b63a70 ; UnityEngine.Object.op_Inequality [282977]
0000000180a753ea: test     al, al
0000000180a753ec: je       0x180a75435
0000000180a753ee: mov      r8, qword ptr [rip + 0x7ebbbf3] ; GenericMethodInfo 280346 @0x188930fe8
0000000180a753f5: lea      rcx, [rsp + 0x40]
0000000180a753fa: mov      rdi, qword ptr [rbx + 0x440]
0000000180a75401: mov      rdx, rsi
0000000180a75404: call     0x18515a130
0000000180a75409: test     rdi, rdi
0000000180a7540c: je       0x180a754c3
0000000180a75412: movaps   xmm0, xmmword ptr [rsp + 0x40]
0000000180a75417: lea      rdx, [rsp + 0x40]
0000000180a7541c: mov      r8, qword ptr [rip + 0x7da4dc5] ; GenericMethodInfo 267086 @0x18881a1e8
0000000180a75423: mov      rcx, rdi
0000000180a75426: movdqa   xmmword ptr [rsp + 0x40], xmm0
0000000180a7542c: call     0x184ac4bf0
0000000180a75431: test     al, al
0000000180a75433: jne      0x180a7549e
0000000180a75435: xor      edx, edx
0000000180a75437: mov      rcx, rbx
0000000180a7543a: call     0x180a7f9d0 ; Torappu.Battle.Enemy.get_rigidbody2D [76384]
0000000180a7543f: movss    xmm1, dword ptr [rsp + 0x30]
0000000180a75445: movss    xmm2, dword ptr [rsp + 0x34]
0000000180a7544b: xorps    xmm1, xmmword ptr [rip + 0x63ca9ae]
0000000180a75452: xorps    xmm2, xmmword ptr [rip + 0x63ca9a7]
0000000180a75459: mulss    xmm1, xmm7
0000000180a7545d: mulss    xmm2, xmm7
0000000180a75461: test     rax, rax
0000000180a75464: je       0x180a754c3
0000000180a75466: unpcklps xmm1, xmm2
0000000180a75469: xor      r9d, r9d
0000000180a7546c: movq     rdx, xmm1
0000000180a75471: xor      r8d, r8d
0000000180a75474: mov      rcx, rax
0000000180a75477: call     0x186bc6c40 ; UnityEngine.Rigidbody2D.AddForce [318556]
0000000180a7547c: mov      al, 1
0000000180a7547e: mov      rdi, qword ptr [rsp + 0x80]
0000000180a75486: mov      rbx, qword ptr [rsp + 0x88]
0000000180a7548e: movaps   xmm6, xmmword ptr [rsp + 0x60]
0000000180a75493: movaps   xmm7, xmmword ptr [rsp + 0x50]
0000000180a75498: add      rsp, 0x70
0000000180a7549c: pop      rsi
0000000180a7549d: ret      
0000000180a7549e: xor      al, al
0000000180a754a0: jmp      0x180a7547e
0000000180a754a2: mov      qword ptr [rsp + 0x28], 0
0000000180a754ab: movq     r9, xmm6
0000000180a754b0: mov      r8, rsi
0000000180a754b3: movss    dword ptr [rsp + 0x20], xmm7
0000000180a754b9: mov      rdx, rbx
0000000180a754bc: call     0x1833962a0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3650 [6305]
0000000180a754c1: jmp      0x180a75486
0000000180a754c3: call     0x18048c0b0
0000000180a754c8: int3     
0000000180a754c9: int3     
0000000180a754ca: int3     
0000000180a754cb: int3     
0000000180a754cc: int3     
0000000180a754cd: int3     
0000000180a754ce: int3     
0000000180a754cf: int3     