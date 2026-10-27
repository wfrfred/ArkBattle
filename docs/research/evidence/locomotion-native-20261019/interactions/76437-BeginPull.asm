; Torappu.Battle.Enemy.BeginPull metadata=76437 token=0x6012a96 VA=0x180a69fe0 RVA=0xa69fe0 size=0x350
0000000180a69fe0: mov      qword ptr [rsp + 0x20], rbx
0000000180a69fe5: push     rsi
0000000180a69fe6: sub      rsp, 0x70
0000000180a69fea: cmp      byte ptr [rip + 0x822888d], 0
0000000180a69ff1: mov      rsi, rdx
0000000180a69ff4: movaps   xmmword ptr [rsp + 0x60], xmm6
0000000180a69ff9: mov      rbx, rcx
0000000180a69ffc: movq     xmm6, r8
0000000180a6a001: movaps   xmmword ptr [rsp + 0x50], xmm7
0000000180a6a006: movsd    qword ptr [rsp + 0x30], xmm6
0000000180a6a00c: movaps   xmm7, xmm3
0000000180a6a00f: jne      0x180a6a078
0000000180a6a011: lea      rcx, [rip + 0x7e02250] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a6a018: call     0x18048bf00
0000000180a6a01d: lea      rcx, [rip + 0x7db168c] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6a024: call     0x18048bf00
0000000180a6a029: lea      rcx, [rip + 0x7e31c78] ; GenericMethodInfo 262831 @0x18889bca8
0000000180a6a030: call     0x18048bf00
0000000180a6a035: lea      rcx, [rip + 0x7e31ea4] ; GenericMethodInfo 262832 @0x18889bee0
0000000180a6a03c: call     0x18048bf00
0000000180a6a041: lea      rcx, [rip + 0x7dafae0] ; GenericMethodInfo 267083 @0x188819b28
0000000180a6a048: call     0x18048bf00
0000000180a6a04d: lea      rcx, [rip + 0x7ec6f94] ; GenericMethodInfo 280346 @0x188930fe8
0000000180a6a054: call     0x18048bf00
0000000180a6a059: lea      rcx, [rip + 0x7ec8c88] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a6a060: call     0x18048bf00
0000000180a6a065: lea      rcx, [rip + 0x7db938c] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
0000000180a6a06c: call     0x18048bf00
0000000180a6a071: mov      byte ptr [rip + 0x8228806], 1
0000000180a6a078: mov      rax, qword ptr [rip + 0x7db1631] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6a07f: cmp      dword ptr [rax + 0xe0], 0
0000000180a6a086: jne      0x180a6a097
0000000180a6a088: mov      rcx, rax
0000000180a6a08b: call     0x18048c140
0000000180a6a090: mov      rax, qword ptr [rip + 0x7db1619] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6a097: mov      rax, qword ptr [rax + 0xb8]
0000000180a6a09e: mov      rcx, qword ptr [rax + 0x530]
0000000180a6a0a5: test     rcx, rcx
0000000180a6a0a8: jne      0x180a6a2fc
0000000180a6a0ae: cmp      byte ptr [rip + 0x826273c], cl
0000000180a6a0b4: jbe      0x180a6a0be
0000000180a6a0b6: mov      rcx, qword ptr [rbx]
0000000180a6a0b9: call     0x180446d00
0000000180a6a0be: mov      rdx, qword ptr [rbx]
0000000180a6a0c1: mov      rcx, rbx
0000000180a6a0c4: mov      rax, qword ptr [rdx + 0x3c0]
0000000180a6a0cb: mov      rdx, qword ptr [rdx + 0x3c8]
0000000180a6a0d2: call     rax
0000000180a6a0d4: test     al, al
0000000180a6a0d6: je       0x180a6a2f8
0000000180a6a0dc: xor      edx, edx
0000000180a6a0de: mov      rcx, rbx
0000000180a6a0e1: call     0x180706be0 ; Torappu.Battle.Entity.get_isUnbalanceImmune [66519]
0000000180a6a0e6: test     al, al
0000000180a6a0e8: jne      0x180a6a2f8
0000000180a6a0ee: mov      qword ptr [rsp + 0x88], rdi
0000000180a6a0f6: mov      r8, qword ptr [rip + 0x7ec6eeb] ; GenericMethodInfo 280346 @0x188930fe8
0000000180a6a0fd: lea      rcx, [rsp + 0x40]
0000000180a6a102: mov      rdi, qword ptr [rbx + 0x438]
0000000180a6a109: mov      rdx, rsi
0000000180a6a10c: call     0x18515a130
0000000180a6a111: test     rdi, rdi
0000000180a6a114: je       0x180a6a31d
0000000180a6a11a: movaps   xmm0, xmmword ptr [rsp + 0x40]
0000000180a6a11f: lea      rdx, [rsp + 0x40]
0000000180a6a124: mov      r8, qword ptr [rip + 0x7daf9fd] ; GenericMethodInfo 267083 @0x188819b28
0000000180a6a12b: mov      rcx, rdi
0000000180a6a12e: movdqa   xmmword ptr [rsp + 0x40], xmm0
0000000180a6a134: call     0x184ac4890
0000000180a6a139: xor      edx, edx
0000000180a6a13b: mov      rcx, rbx
0000000180a6a13e: call     0x180a7f9d0 ; Torappu.Battle.Enemy.get_rigidbody2D [76384]
0000000180a6a143: movss    xmm1, dword ptr [rsp + 0x30]
0000000180a6a149: movss    xmm2, dword ptr [rsp + 0x34]
0000000180a6a14f: xorps    xmm1, xmmword ptr [rip + 0x63d5caa]
0000000180a6a156: xorps    xmm2, xmmword ptr [rip + 0x63d5ca3]
0000000180a6a15d: mulss    xmm1, xmm7
0000000180a6a161: mulss    xmm2, xmm7
0000000180a6a165: test     rax, rax
0000000180a6a168: je       0x180a6a31d
0000000180a6a16e: unpcklps xmm1, xmm2
0000000180a6a171: xor      r9d, r9d
0000000180a6a174: movq     rdx, xmm1
0000000180a6a179: xor      r8d, r8d
0000000180a6a17c: mov      rcx, rax
0000000180a6a17f: call     0x186bc6c40 ; UnityEngine.Rigidbody2D.AddForce [318556]
0000000180a6a184: xor      edx, edx
0000000180a6a186: mov      rcx, rbx
0000000180a6a189: call     0x180a800c0 ; Torappu.Battle.Enemy.get_stateMachine [76373]
0000000180a6a18e: test     rax, rax
0000000180a6a191: je       0x180a6a31d
0000000180a6a197: mov      rdx, qword ptr [rip + 0x7e31d42] ; GenericMethodInfo 262832 @0x18889bee0
0000000180a6a19e: mov      rcx, rax
0000000180a6a1a1: call     0x18499ca80
0000000180a6a1a6: test     rax, rax
0000000180a6a1a9: je       0x180a6a31d
0000000180a6a1af: xor      edx, edx
0000000180a6a1b1: mov      rcx, rax
0000000180a6a1b4: call     0x180a87ab0 ; Torappu.Battle.Enemy.States.Blackboard.UpdateUnbalanceProtectTime [76637]
0000000180a6a1b9: xor      edx, edx
0000000180a6a1bb: mov      rcx, rbx
0000000180a6a1be: call     0x180a800c0 ; Torappu.Battle.Enemy.get_stateMachine [76373]
0000000180a6a1c3: test     rax, rax
0000000180a6a1c6: je       0x180a6a31d
0000000180a6a1cc: mov      r8, qword ptr [rip + 0x7e31ad5] ; GenericMethodInfo 262831 @0x18889bca8
0000000180a6a1d3: mov      edx, 9
0000000180a6a1d8: mov      rcx, rax
0000000180a6a1db: call     0x18499c9d0
0000000180a6a1e0: mov      rdx, qword ptr [rip + 0x7db9211] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
0000000180a6a1e7: mov      rcx, rsi
0000000180a6a1ea: call     0x1800057a0
0000000180a6a1ef: mov      rcx, qword ptr [rip + 0x7ec8af2] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a6a1f6: mov      rdi, rax
0000000180a6a1f9: cmp      dword ptr [rcx + 0xe0], 0
0000000180a6a200: jne      0x180a6a207
0000000180a6a202: call     0x18048c140
0000000180a6a207: xor      r8d, r8d
0000000180a6a20a: xor      edx, edx
0000000180a6a20c: mov      rcx, rdi
0000000180a6a20f: call     0x186b63a70 ; UnityEngine.Object.op_Inequality [282977]
0000000180a6a214: test     al, al
0000000180a6a216: je       0x180a6a27c
0000000180a6a218: test     rdi, rdi
0000000180a6a21b: je       0x180a6a31d
0000000180a6a221: xor      edx, edx
0000000180a6a223: mov      qword ptr [rsp + 0x80], rbp
0000000180a6a22b: mov      rcx, rdi
0000000180a6a22e: call     0x1808dd7b0 ; Torappu.Battle.Projectile.get_source [71293]
0000000180a6a233: mov      rcx, qword ptr [rip + 0x7ec8aae] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a6a23a: mov      rbp, rax
0000000180a6a23d: cmp      dword ptr [rcx + 0xe0], 0
0000000180a6a244: jne      0x180a6a24b
0000000180a6a246: call     0x18048c140
0000000180a6a24b: xor      r8d, r8d
0000000180a6a24e: xor      edx, edx
0000000180a6a250: mov      rcx, rbp
0000000180a6a253: call     0x186b63a70 ; UnityEngine.Object.op_Inequality [282977]
0000000180a6a258: mov      rbp, qword ptr [rsp + 0x80]
0000000180a6a260: test     al, al
0000000180a6a262: je       0x180a6a27c
0000000180a6a264: xor      edx, edx
0000000180a6a266: mov      rcx, rdi
0000000180a6a269: call     0x1808dd7b0 ; Torappu.Battle.Projectile.get_source [71293]
0000000180a6a26e: test     rax, rax
0000000180a6a271: je       0x180a6a31d
0000000180a6a277: mov      rcx, rax
0000000180a6a27a: jmp      0x180a6a2bc
0000000180a6a27c: mov      rdx, qword ptr [rip + 0x7e01fe5] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a6a283: mov      rcx, rsi
0000000180a6a286: call     0x1800057a0
0000000180a6a28b: mov      rcx, qword ptr [rip + 0x7ec8a56] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a6a292: mov      rdi, rax
0000000180a6a295: cmp      dword ptr [rcx + 0xe0], 0
0000000180a6a29c: jne      0x180a6a2a3
0000000180a6a29e: call     0x18048c140
0000000180a6a2a3: xor      r8d, r8d
0000000180a6a2a6: xor      edx, edx
0000000180a6a2a8: mov      rcx, rdi
0000000180a6a2ab: call     0x186b63a70 ; UnityEngine.Object.op_Inequality [282977]
0000000180a6a2b0: test     al, al
0000000180a6a2b2: je       0x180a6a2d6
0000000180a6a2b4: test     rdi, rdi
0000000180a6a2b7: je       0x180a6a31d
0000000180a6a2b9: mov      rcx, rdi
0000000180a6a2bc: xor      edx, edx
0000000180a6a2be: call     0x180702100 ; Torappu.Battle.Entity.get_buffContainer [66402]
0000000180a6a2c3: test     rax, rax
0000000180a6a2c6: je       0x180a6a31d
0000000180a6a2c8: xor      r8d, r8d
0000000180a6a2cb: mov      rdx, rbx
0000000180a6a2ce: mov      rcx, rax
0000000180a6a2d1: call     0x180673440 ; Torappu.Battle.Buff.BuffContainer.OnMakeEnemyUnbalanced [65403]
0000000180a6a2d6: mov      rdi, qword ptr [rsp + 0x88]
0000000180a6a2de: mov      al, 1
0000000180a6a2e0: mov      rbx, qword ptr [rsp + 0x98]
0000000180a6a2e8: movaps   xmm6, xmmword ptr [rsp + 0x60]
0000000180a6a2ed: movaps   xmm7, xmmword ptr [rsp + 0x50]
0000000180a6a2f2: add      rsp, 0x70
0000000180a6a2f6: pop      rsi
0000000180a6a2f7: ret      
0000000180a6a2f8: xor      al, al
0000000180a6a2fa: jmp      0x180a6a2e0
0000000180a6a2fc: mov      qword ptr [rsp + 0x28], 0
0000000180a6a305: movq     r9, xmm6
0000000180a6a30a: mov      r8, rsi
0000000180a6a30d: movss    dword ptr [rsp + 0x20], xmm7
0000000180a6a313: mov      rdx, rbx
0000000180a6a316: call     0x1833962a0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3650 [6305]
0000000180a6a31b: jmp      0x180a6a2e0
0000000180a6a31d: call     0x18048c0b0
0000000180a6a322: int3     
0000000180a6a323: int3     
0000000180a6a324: int3     
0000000180a6a325: int3     
0000000180a6a326: int3     
0000000180a6a327: int3     
0000000180a6a328: int3     
0000000180a6a329: int3     
0000000180a6a32a: int3     
0000000180a6a32b: int3     
0000000180a6a32c: int3     
0000000180a6a32d: int3     
0000000180a6a32e: int3     
0000000180a6a32f: int3     