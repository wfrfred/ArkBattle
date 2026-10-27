; Torappu.Battle.FilterUtil.Filter metadata=74633 token=0x601238a VA=0x1809d8270 RVA=0x9d8270 size=0x3f0
00000001809d8270: mov      qword ptr [rsp + 8], rbx
00000001809d8275: mov      qword ptr [rsp + 0x10], rbp
00000001809d827a: mov      qword ptr [rsp + 0x18], rsi
00000001809d827f: mov      qword ptr [rsp + 0x20], rdi
00000001809d8284: push     r14
00000001809d8286: sub      rsp, 0x40
00000001809d828a: cmp      byte ptr [rip + 0x82b9f66], 0
00000001809d8291: mov      edi, r9d
00000001809d8294: mov      ebp, r8d
00000001809d8297: mov      r14, rdx
00000001809d829a: mov      rsi, rcx
00000001809d829d: jne      0x1809d82ee
00000001809d829f: lea      rcx, [rip + 0x7f2ebc2] ; GenericMethodInfo 256114 @0x188906e68
00000001809d82a6: call     0x18048bf00
00000001809d82ab: lea      rcx, [rip + 0x7f2e4f6] ; GenericMethodInfo 256111 @0x1889067a8
00000001809d82b2: call     0x18048bf00
00000001809d82b7: lea      rcx, [rip + 0x7f2c7fa] ; GenericMethodInfo 293295 @0x188904ab8
00000001809d82be: call     0x18048bf00
00000001809d82c3: lea      rcx, [rip + 0x7f2ca2e] ; GenericMethodInfo 293296 @0x188904cf8
00000001809d82ca: call     0x18048bf00
00000001809d82cf: lea      rcx, [rip + 0x7e9c84a] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809d82d6: call     0x18048bf00
00000001809d82db: lea      rcx, [rip + 0x7f605b6] ; GenericMethodInfo 271524 @0x188938898
00000001809d82e2: call     0x18048bf00
00000001809d82e7: mov      byte ptr [rip + 0x82b9f09], 1
00000001809d82ee: mov      rdx, qword ptr [rip + 0x7e9c82b] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809d82f5: xor      ebx, ebx
00000001809d82f7: mov      qword ptr [rsp + 0x38], rbx
00000001809d82fc: mov      qword ptr [rsp + 0x30], rbx
00000001809d8301: cmp      dword ptr [rdx + 0xe0], ebx
00000001809d8307: jne      0x1809d8318
00000001809d8309: mov      rcx, rdx
00000001809d830c: call     0x18048c140
00000001809d8311: mov      rdx, qword ptr [rip + 0x7e9c808] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809d8318: mov      rax, qword ptr [rdx + 0xb8]
00000001809d831f: mov      rcx, qword ptr [rax + 0xc0]
00000001809d8326: test     rcx, rcx
00000001809d8329: jne      0x1809d858d
00000001809d832f: cmp      dword ptr [rdx + 0xe0], ebx
00000001809d8335: jne      0x1809d8346
00000001809d8337: mov      rcx, rdx
00000001809d833a: call     0x18048c140
00000001809d833f: mov      rdx, qword ptr [rip + 0x7e9c7da] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809d8346: cmp      byte ptr [rip + 0x82b9eb0], bl
00000001809d834c: jne      0x1809d8368
00000001809d834e: lea      rcx, [rip + 0x7e9c7cb] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809d8355: call     0x18048bf00
00000001809d835a: mov      rdx, qword ptr [rip + 0x7e9c7bf] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809d8361: mov      byte ptr [rip + 0x82b9e94], 1
00000001809d8368: cmp      dword ptr [rdx + 0xe0], ebx
00000001809d836e: jne      0x1809d837f
00000001809d8370: mov      rcx, rdx
00000001809d8373: call     0x18048c140
00000001809d8378: mov      rdx, qword ptr [rip + 0x7e9c7a1] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809d837f: mov      rax, qword ptr [rdx + 0xb8]
00000001809d8386: mov      rcx, qword ptr [rax + 0xe8]
00000001809d838d: test     rcx, rcx
00000001809d8390: jne      0x1809d8458
00000001809d8396: cmp      edi, 0x15
00000001809d8399: jle      0x1809d83c6
00000001809d839b: cmp      edi, 0x39
00000001809d839e: je       0x1809d8410
00000001809d83a0: lea      eax, [rdi - 0x45]
00000001809d83a3: cmp      eax, 8
00000001809d83a6: ja       0x1809d8434
00000001809d83ac: lea      eax, [rdi - 0x45]
00000001809d83af: movsxd   rcx, eax
00000001809d83b2: lea      r8, [rip - 0x9d83b9]
00000001809d83b9: mov      eax, dword ptr [r8 + rcx*4 + 0x9d8608]
00000001809d83c1: add      rax, r8
00000001809d83c4: jmp      rax
00000001809d83c6: lea      eax, [rdi - 1]
00000001809d83c9: cmp      eax, 0xa
00000001809d83cc: ja       0x1809d840b
00000001809d83ce: lea      eax, [rdi - 1]
00000001809d83d1: movsxd   rcx, eax
00000001809d83d4: lea      r8, [rip - 0x9d83db]
00000001809d83db: mov      eax, dword ptr [r8 + rcx*4 + 0x9d862c]
00000001809d83e3: add      rax, r8
00000001809d83e6: jmp      rax
00000001809d83e8: cmp      dword ptr [rdx + 0xe0], ebx
00000001809d83ee: jne      0x1809d83ff
00000001809d83f0: mov      rcx, rdx
00000001809d83f3: call     0x18048c140
00000001809d83f8: mov      rdx, qword ptr [rip + 0x7e9c721] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809d83ff: mov      rbx, qword ptr [rdx + 0xb8]
00000001809d8406: mov      rbx, qword ptr [rbx]
00000001809d8409: jmp      0x1809d846c
00000001809d840b: cmp      edi, 0x15
00000001809d840e: jne      0x1809d8434
00000001809d8410: cmp      dword ptr [rdx + 0xe0], ebx
00000001809d8416: jne      0x1809d8427
00000001809d8418: mov      rcx, rdx
00000001809d841b: call     0x18048c140
00000001809d8420: mov      rdx, qword ptr [rip + 0x7e9c6f9] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809d8427: mov      rbx, qword ptr [rdx + 0xb8]
00000001809d842e: mov      rbx, qword ptr [rbx + 8]
00000001809d8432: jmp      0x1809d846c
00000001809d8434: cmp      dword ptr [rdx + 0xe0], ebx
00000001809d843a: jne      0x1809d844b
00000001809d843c: mov      rcx, rdx
00000001809d843f: call     0x18048c140
00000001809d8444: mov      rdx, qword ptr [rip + 0x7e9c6d5] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809d844b: mov      rbx, qword ptr [rdx + 0xb8]
00000001809d8452: mov      rbx, qword ptr [rbx + 0x10]
00000001809d8456: jmp      0x1809d846c
00000001809d8458: xor      r8d, r8d
00000001809d845b: mov      edx, edi
00000001809d845d: call     0x1831b1c90 ; XLua.DelegateBridge.__Gen_Delegate_Imp12136 [14791]
00000001809d8462: mov      rdx, qword ptr [rip + 0x7e9c6b7] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809d8469: mov      rbx, rax
00000001809d846c: test     edi, edi
00000001809d846e: jne      0x1809d847c
00000001809d8470: test     rsi, rsi
00000001809d8473: je       0x1809d8600
00000001809d8479: mov      ebp, dword ptr [rsi + 0x18]
00000001809d847c: cmp      dword ptr [rdx + 0xe0], 0
00000001809d8483: jne      0x1809d8494
00000001809d8485: mov      rcx, rdx
00000001809d8488: call     0x18048c140
00000001809d848d: mov      rdx, qword ptr [rip + 0x7e9c68c] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809d8494: mov      rax, qword ptr [rdx + 0xb8]
00000001809d849b: mov      rcx, qword ptr [rax + 0x38]
00000001809d849f: test     rcx, rcx
00000001809d84a2: je       0x1809d8600
00000001809d84a8: mov      r9, qword ptr [rip + 0x7f2e2f9] ; GenericMethodInfo 256111 @0x1889067a8
00000001809d84af: lea      r8, [rsp + 0x38]
00000001809d84b4: mov      edx, edi
00000001809d84b6: call     0x185a46d00
00000001809d84bb: test     al, al
00000001809d84bd: jne      0x1809d854f
00000001809d84c3: mov      rax, qword ptr [rip + 0x7e9c656] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809d84ca: cmp      dword ptr [rax + 0xe0], 0
00000001809d84d1: jne      0x1809d84e2
00000001809d84d3: mov      rcx, rax
00000001809d84d6: call     0x18048c140
00000001809d84db: mov      rax, qword ptr [rip + 0x7e9c63e] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809d84e2: mov      rax, qword ptr [rax + 0xb8]
00000001809d84e9: mov      rcx, qword ptr [rax + 0x40]
00000001809d84ed: test     rcx, rcx
00000001809d84f0: je       0x1809d8600
00000001809d84f6: mov      r9, qword ptr [rip + 0x7f2e96b] ; GenericMethodInfo 256114 @0x188906e68
00000001809d84fd: lea      r8, [rsp + 0x30]
00000001809d8502: mov      edx, edi
00000001809d8504: call     0x185a46d00
00000001809d8509: test     al, al
00000001809d850b: je       0x1809d85bf
00000001809d8511: mov      rcx, qword ptr [rip + 0x7e9c608] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809d8518: mov      rdi, qword ptr [rsp + 0x30]
00000001809d851d: cmp      dword ptr [rcx + 0xe0], 0
00000001809d8524: jne      0x1809d852b
00000001809d8526: call     0x18048c140
00000001809d852b: mov      rax, qword ptr [rip + 0x7f2c7c6] ; GenericMethodInfo 293296 @0x188904cf8
00000001809d8532: mov      r9, rdi
00000001809d8535: mov      qword ptr [rsp + 0x28], rax
00000001809d853a: mov      r8d, ebp
00000001809d853d: mov      rdx, r14
00000001809d8540: mov      qword ptr [rsp + 0x20], rbx
00000001809d8545: mov      rcx, rsi
00000001809d8548: call     0x1844f9740
00000001809d854d: jmp      0x1809d85a4
00000001809d854f: mov      rcx, qword ptr [rip + 0x7e9c5ca] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809d8556: mov      rdi, qword ptr [rsp + 0x38]
00000001809d855b: cmp      dword ptr [rcx + 0xe0], 0
00000001809d8562: jne      0x1809d8569
00000001809d8564: call     0x18048c140
00000001809d8569: mov      rax, qword ptr [rip + 0x7f2c548] ; GenericMethodInfo 293295 @0x188904ab8
00000001809d8570: mov      r9, rdi
00000001809d8573: mov      qword ptr [rsp + 0x28], rax
00000001809d8578: mov      r8d, ebp
00000001809d857b: mov      rdx, r14
00000001809d857e: mov      qword ptr [rsp + 0x20], rbx
00000001809d8583: mov      rcx, rsi
00000001809d8586: call     0x1844f9140
00000001809d858b: jmp      0x1809d85a4
00000001809d858d: mov      qword ptr [rsp + 0x28], rbx
00000001809d8592: mov      r9d, ebp
00000001809d8595: mov      r8, r14
00000001809d8598: mov      dword ptr [rsp + 0x20], edi
00000001809d859c: mov      rdx, rsi
00000001809d859f: call     0x1831b13a0 ; XLua.DelegateBridge.__Gen_Delegate_Imp12132 [14787]
00000001809d85a4: mov      rbx, qword ptr [rsp + 0x50]
00000001809d85a9: mov      rbp, qword ptr [rsp + 0x58]
00000001809d85ae: mov      rsi, qword ptr [rsp + 0x60]
00000001809d85b3: mov      rdi, qword ptr [rsp + 0x68]
00000001809d85b8: add      rsp, 0x40
00000001809d85bc: pop      r14
00000001809d85be: ret      
00000001809d85bf: lea      rcx, [rip + 0x7f54f62] ; TypeInfo System.NotImplementedException @0x18892d528
00000001809d85c6: call     0x18048bf20
00000001809d85cb: mov      rcx, rax
00000001809d85ce: call     0x18045cfe0
00000001809d85d3: mov      rcx, rax
00000001809d85d6: mov      rbx, rax
00000001809d85d9: call     0x180005cb0
00000001809d85de: xor      edx, edx
00000001809d85e0: mov      rcx, rbx
00000001809d85e3: call     0x185ebc710
00000001809d85e8: lea      rcx, [rip + 0x7f2cb81] ; MethodInfo Torappu.Battle.FilterUtil.Filter [74633] @0x188905170
00000001809d85ef: call     0x18048bf20
00000001809d85f4: mov      rdx, rax
00000001809d85f7: mov      rcx, rbx
00000001809d85fa: call     0x18048c070
00000001809d85ff: int3     
00000001809d8600: call     0x18048c0b0
00000001809d8605: int3     
00000001809d8606: nop      
00000001809d8608: adc      byte ptr [rbp + rbx*4 - 0x627c1800], al
00000001809d860f: add      byte ptr [rsp + rax*4], dh
00000001809d8612: popfq    
00000001809d8613: add      byte ptr [rsp + rax*4], dh
00000001809d8616: popfq    
00000001809d8617: add      byte ptr [rsp + rax*4], dh
00000001809d861a: popfq    
00000001809d861b: add      byte ptr [rsp + rax*4], dh
00000001809d861e: popfq    
00000001809d861f: add      byte ptr [rax], dl
00000001809d8621: test     byte ptr [rbp - 0x627c1800], bl
00000001809d8627: add      al, ch
00000001809d8629: sbb      dword ptr [rbp - 0x627c1800], 0
00000001809d8630: xor      al, 0x84
00000001809d8632: popfq    
00000001809d8633: add      byte ptr [rsp + rax*4], dh
00000001809d8636: popfq    
00000001809d8637: add      byte ptr [rax], dl
00000001809d8639: test     byte ptr [rbp - 0x627bcc00], bl
00000001809d863f: add      byte ptr [rax], dl
00000001809d8641: test     byte ptr [rbp - 0x627bf000], bl
00000001809d8647: add      byte ptr [rsp + rax*4], dh
00000001809d864a: popfq    
00000001809d864b: add      byte ptr [rsp + rax*4], dh
00000001809d864e: popfq    
00000001809d864f: add      al, ch
00000001809d8651: sbb      dword ptr [rbp - 0x627c1800], 0
00000001809d8658: int3     
00000001809d8659: int3     
00000001809d865a: int3     
00000001809d865b: int3     
00000001809d865c: int3     
00000001809d865d: int3     
00000001809d865e: int3     
00000001809d865f: int3     