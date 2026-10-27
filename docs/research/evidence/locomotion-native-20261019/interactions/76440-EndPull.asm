; Torappu.Battle.Enemy.EndPull metadata=76440 token=0x6012a99 VA=0x180a6c970 RVA=0xa6c970 size=0x2c0
0000000180a6c970: mov      qword ptr [rsp + 0x10], rsi
0000000180a6c975: push     rdi
0000000180a6c976: sub      rsp, 0x30
0000000180a6c97a: cmp      byte ptr [rip + 0x8225f00], 0
0000000180a6c981: mov      rdi, rdx
0000000180a6c984: mov      rsi, rcx
0000000180a6c987: jne      0x180a6c9e4
0000000180a6c989: lea      rcx, [rip + 0x7daed20] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6c990: call     0x18048bf00
0000000180a6c995: lea      rcx, [rip + 0x7dedd64] ; TypeInfo Torappu.FP @0x18885a700
0000000180a6c99c: call     0x18048bf00
0000000180a6c9a1: lea      rcx, [rip + 0x7dadcc0] ; GenericMethodInfo 267088 @0x18881a668
0000000180a6c9a8: call     0x18048bf00
0000000180a6c9ad: lea      rcx, [rip + 0x7dae5b4] ; GenericMethodInfo 267092 @0x18881af68
0000000180a6c9b4: call     0x18048bf00
0000000180a6c9b9: lea      rcx, [rip + 0x7ec4628] ; GenericMethodInfo 280346 @0x188930fe8
0000000180a6c9c0: call     0x18048bf00
0000000180a6c9c5: lea      rcx, [rip + 0x7ec631c] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a6c9cc: call     0x18048bf00
0000000180a6c9d1: lea      rcx, [rip + 0x7db6a20] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
0000000180a6c9d8: call     0x18048bf00
0000000180a6c9dd: mov      byte ptr [rip + 0x8225e9d], 1
0000000180a6c9e4: mov      rax, qword ptr [rip + 0x7daecc5] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6c9eb: cmp      dword ptr [rax + 0xe0], 0
0000000180a6c9f2: jne      0x180a6ca03
0000000180a6c9f4: mov      rcx, rax
0000000180a6c9f7: call     0x18048c140
0000000180a6c9fc: mov      rax, qword ptr [rip + 0x7daecad] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6ca03: mov      rax, qword ptr [rax + 0xb8]
0000000180a6ca0a: mov      rcx, qword ptr [rax + 0x548]
0000000180a6ca11: test     rcx, rcx
0000000180a6ca14: jne      0x180a6cc0d
0000000180a6ca1a: mov      qword ptr [rsp + 0x40], rbx
0000000180a6ca1f: mov      r8, qword ptr [rip + 0x7ec45c2] ; GenericMethodInfo 280346 @0x188930fe8
0000000180a6ca26: lea      rcx, [rsp + 0x20]
0000000180a6ca2b: mov      rbx, qword ptr [rsi + 0x438]
0000000180a6ca32: mov      rdx, rdi
0000000180a6ca35: call     0x18515a130
0000000180a6ca3a: test     rbx, rbx
0000000180a6ca3d: je       0x180a6cc25
0000000180a6ca43: movaps   xmm0, xmmword ptr [rsp + 0x20]
0000000180a6ca48: lea      rdx, [rsp + 0x20]
0000000180a6ca4d: mov      r8, qword ptr [rip + 0x7dadc14] ; GenericMethodInfo 267088 @0x18881a668
0000000180a6ca54: mov      rcx, rbx
0000000180a6ca57: movdqa   xmmword ptr [rsp + 0x20], xmm0
0000000180a6ca5d: call     0x184ac56b0
0000000180a6ca62: mov      r8, qword ptr [rip + 0x7ec457f] ; GenericMethodInfo 280346 @0x188930fe8
0000000180a6ca69: lea      rcx, [rsp + 0x20]
0000000180a6ca6e: mov      rbx, qword ptr [rsi + 0x440]
0000000180a6ca75: mov      rdx, rdi
0000000180a6ca78: call     0x18515a130
0000000180a6ca7d: test     rbx, rbx
0000000180a6ca80: je       0x180a6cc25
0000000180a6ca86: movaps   xmm0, xmmword ptr [rsp + 0x20]
0000000180a6ca8b: lea      rdx, [rsp + 0x20]
0000000180a6ca90: mov      r8, qword ptr [rip + 0x7dadbd1] ; GenericMethodInfo 267088 @0x18881a668
0000000180a6ca97: mov      rcx, rbx
0000000180a6ca9a: movdqa   xmmword ptr [rsp + 0x20], xmm0
0000000180a6caa0: call     0x184ac56b0
0000000180a6caa5: mov      rcx, qword ptr [rsi + 0x438]
0000000180a6caac: test     rcx, rcx
0000000180a6caaf: je       0x180a6cc25
0000000180a6cab5: mov      rdx, qword ptr [rip + 0x7dae4ac] ; GenericMethodInfo 267092 @0x18881af68
0000000180a6cabc: call     0x184ac6000
0000000180a6cac1: test     al, al
0000000180a6cac3: je       0x180a6cb15
0000000180a6cac5: xor      edx, edx
0000000180a6cac7: mov      rcx, rsi
0000000180a6caca: call     0x180a7e4f0 ; Torappu.Battle.Enemy.get_isUnbalanced [76336]
0000000180a6cacf: test     al, al
0000000180a6cad1: je       0x180a6cb15
0000000180a6cad3: xor      edx, edx
0000000180a6cad5: mov      rcx, rsi
0000000180a6cad8: call     0x180a800c0 ; Torappu.Battle.Enemy.get_stateMachine [76373]
0000000180a6cadd: mov      rcx, qword ptr [rip + 0x7dedc1c] ; TypeInfo Torappu.FP @0x18885a700
0000000180a6cae4: mov      rbx, rax
0000000180a6cae7: cmp      dword ptr [rcx + 0xe0], 0
0000000180a6caee: jne      0x180a6caf5
0000000180a6caf0: call     0x18048c140
0000000180a6caf5: xor      edx, edx
0000000180a6caf7: xor      ecx, ecx
0000000180a6caf9: call     0x1866fdac0
0000000180a6cafe: test     rbx, rbx
0000000180a6cb01: je       0x180a6cc25
0000000180a6cb07: xor      r8d, r8d
0000000180a6cb0a: mov      rdx, rax
0000000180a6cb0d: mov      rcx, rbx
0000000180a6cb10: call     0x1826483e0 ; Torappu.StateMachine.Tick [33274]
0000000180a6cb15: mov      rdx, qword ptr [rip + 0x7db68dc] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
0000000180a6cb1c: test     rdi, rdi
0000000180a6cb1f: jne      0x180a6cb25
0000000180a6cb21: xor      ebx, ebx
0000000180a6cb23: jmp      0x180a6cb6f
0000000180a6cb25: cmp      byte ptr [rip + 0x825fcc4], 0
0000000180a6cb2c: mov      r8, qword ptr [rdi]
0000000180a6cb2f: jbe      0x180a6cb3f
0000000180a6cb31: mov      rcx, r8
0000000180a6cb34: call     0x1804463e0
0000000180a6cb39: xor      ebx, ebx
0000000180a6cb3b: test     al, al
0000000180a6cb3d: jmp      0x180a6cb6b
0000000180a6cb3f: movzx    eax, byte ptr [rdx + 0x130]
0000000180a6cb46: xor      ebx, ebx
0000000180a6cb48: cmp      byte ptr [r8 + 0x130], al
0000000180a6cb4f: jb       0x180a6cb67
0000000180a6cb51: movzx    ecx, al
0000000180a6cb54: mov      rax, qword ptr [r8 + 0xc8]
0000000180a6cb5b: cmp      qword ptr [rax + rcx*8 - 8], rdx
0000000180a6cb60: mov      eax, 1
0000000180a6cb65: je       0x180a6cb69
0000000180a6cb67: mov      eax, ebx
0000000180a6cb69: test     eax, eax
0000000180a6cb6b: cmovne   rbx, rdi
0000000180a6cb6f: mov      rcx, qword ptr [rip + 0x7ec6172] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a6cb76: cmp      dword ptr [rcx + 0xe0], 0
0000000180a6cb7d: jne      0x180a6cb84
0000000180a6cb7f: call     0x18048c140
0000000180a6cb84: xor      r8d, r8d
0000000180a6cb87: xor      edx, edx
0000000180a6cb89: mov      rcx, rbx
0000000180a6cb8c: call     0x186b63a70
0000000180a6cb91: test     al, al
0000000180a6cb93: je       0x180a6cbfd
0000000180a6cb95: test     rbx, rbx
0000000180a6cb98: je       0x180a6cc25
0000000180a6cb9e: xor      edx, edx
0000000180a6cba0: mov      rcx, rbx
0000000180a6cba3: call     0x1808dd7b0 ; Torappu.Battle.Projectile.get_source [71293]
0000000180a6cba8: mov      rcx, qword ptr [rip + 0x7ec6139] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a6cbaf: mov      rdi, rax
0000000180a6cbb2: cmp      dword ptr [rcx + 0xe0], 0
0000000180a6cbb9: jne      0x180a6cbc0
0000000180a6cbbb: call     0x18048c140
0000000180a6cbc0: xor      r8d, r8d
0000000180a6cbc3: xor      edx, edx
0000000180a6cbc5: mov      rcx, rdi
0000000180a6cbc8: call     0x186b63a70
0000000180a6cbcd: test     al, al
0000000180a6cbcf: je       0x180a6cbfd
0000000180a6cbd1: xor      edx, edx
0000000180a6cbd3: mov      rcx, rbx
0000000180a6cbd6: call     0x1808dd7b0 ; Torappu.Battle.Projectile.get_source [71293]
0000000180a6cbdb: test     rax, rax
0000000180a6cbde: je       0x180a6cc25
0000000180a6cbe0: xor      edx, edx
0000000180a6cbe2: mov      rcx, rax
0000000180a6cbe5: call     0x180702100 ; Torappu.Battle.Entity.get_buffContainer [66402]
0000000180a6cbea: test     rax, rax
0000000180a6cbed: je       0x180a6cc25
0000000180a6cbef: xor      r8d, r8d
0000000180a6cbf2: mov      rdx, rsi
0000000180a6cbf5: mov      rcx, rax
0000000180a6cbf8: call     0x180670b10 ; Torappu.Battle.Buff.BuffContainer.OnEndPulling [65408]
0000000180a6cbfd: mov      rbx, qword ptr [rsp + 0x40]
0000000180a6cc02: mov      rsi, qword ptr [rsp + 0x48]
0000000180a6cc07: add      rsp, 0x30
0000000180a6cc0b: pop      rdi
0000000180a6cc0c: ret      
0000000180a6cc0d: xor      r9d, r9d
0000000180a6cc10: mov      r8, rdi
0000000180a6cc13: mov      rdx, rsi
0000000180a6cc16: mov      rsi, qword ptr [rsp + 0x48]
0000000180a6cc1b: add      rsp, 0x30
0000000180a6cc1f: pop      rdi
0000000180a6cc20: jmp      0x1832d2220 ; XLua.DelegateBridge.__Gen_Delegate_Imp23 [2678]
0000000180a6cc25: call     0x18048c0b0
0000000180a6cc2a: int3     
0000000180a6cc2b: int3     
0000000180a6cc2c: int3     
0000000180a6cc2d: int3     
0000000180a6cc2e: int3     
0000000180a6cc2f: int3     