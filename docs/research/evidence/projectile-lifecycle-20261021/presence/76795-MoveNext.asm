; Torappu.Battle.Enemy.States.DisappearState.<_DoDisappear>d__21.MoveNext metadata=76795 token=0x6012bfc VA=0x180a9da10 RVA=0xa9da10 size=0x4b0
0000000180a9da10: push     rbp
0000000180a9da12: push     rsi
0000000180a9da13: sub      rsp, 0x48
0000000180a9da17: cmp      byte ptr [rip + 0x81f4f61], 0
0000000180a9da1e: mov      rsi, rcx
0000000180a9da21: jne      0x180a9dab2
0000000180a9da27: lea      rcx, [rip + 0x7ed3bba] ; TypeInfo type(0x15, data=0x188b374d0) @0x1889715e8
0000000180a9da2e: call     0x18048bf00
0000000180a9da33: lea      rcx, [rip + 0x7ed56ae] ; TypeInfo type(0x15, data=0x188b3d8f0) @0x1889730e8
0000000180a9da3a: call     0x18048bf00
0000000180a9da3f: lea      rcx, [rip + 0x7e918da] ; TypeInfo DG.Tweening.DOTween @0x18892f320
0000000180a9da46: call     0x18048bf00
0000000180a9da4b: lea      rcx, [rip + 0x7eba10e] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9da52: call     0x18048bf00
0000000180a9da57: lea      rcx, [rip + 0x7d76e82] ; GenericMethodInfo 301116 @0x1888148e0
0000000180a9da5e: call     0x18048bf00
0000000180a9da63: lea      rcx, [rip + 0x7d818c6] ; MethodInfo Torappu.Battle.Enemy.States.DisappearState.<>c.<_DoDisappear>b__21_0 [76789] @0x18881f330
0000000180a9da6a: call     0x18048bf00
0000000180a9da6f: lea      rcx, [rip + 0x7d81afa] ; MethodInfo Torappu.Battle.Enemy.States.DisappearState.<>c.<_DoDisappear>b__21_2 [76790] @0x18881f570
0000000180a9da76: call     0x18048bf00
0000000180a9da7b: lea      rcx, [rip + 0x7d81d2e] ; MethodInfo Torappu.Battle.Enemy.States.DisappearState.<>c__DisplayClass21_0.<_DoDisappear>b__1 [76785] @0x18881f7b0
0000000180a9da82: call     0x18048bf00
0000000180a9da87: lea      rcx, [rip + 0x7d81f62] ; MethodInfo Torappu.Battle.Enemy.States.DisappearState.<>c__DisplayClass21_0.<_DoDisappear>b__3 [76786] @0x18881f9f0
0000000180a9da8e: call     0x18048bf00
0000000180a9da93: lea      rcx, [rip + 0x7e4987e] ; TypeInfo Torappu.Battle.Enemy.States.DisappearState.<>c__DisplayClass21_0 @0x1888e7318
0000000180a9da9a: call     0x18048bf00
0000000180a9da9f: lea      rcx, [rip + 0x7e49632] ; TypeInfo Torappu.Battle.Enemy.States.DisappearState.<>c @0x1888e70d8
0000000180a9daa6: call     0x18048bf00
0000000180a9daab: mov      byte ptr [rip + 0x81f4ecd], 1
0000000180a9dab2: mov      eax, dword ptr [rsi + 0x10]
0000000180a9dab5: mov      rbp, qword ptr [rsi + 0x20]
0000000180a9dab9: mov      qword ptr [rsp + 0x60], rbx
0000000180a9dabe: mov      qword ptr [rsp + 0x68], rdi
0000000180a9dac3: mov      qword ptr [rsp + 0x70], r14
0000000180a9dac8: mov      qword ptr [rsp + 0x40], r15
0000000180a9dacd: test     eax, eax
0000000180a9dacf: jne      0x180a9de43
0000000180a9dad5: mov      dword ptr [rsi + 0x10], 0xffffffff
0000000180a9dadc: mov      rcx, qword ptr [rip + 0x7e49835] ; TypeInfo Torappu.Battle.Enemy.States.DisappearState.<>c__DisplayClass21_0 @0x1888e7318
0000000180a9dae3: call     0x18045cfe0
0000000180a9dae8: mov      rbx, rax
0000000180a9daeb: test     rax, rax
0000000180a9daee: je       0x180a9deab
0000000180a9daf4: xor      edx, edx
0000000180a9daf6: mov      rcx, rax
0000000180a9daf9: call     0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
0000000180a9dafe: mov      rdx, qword ptr [rsi + 0x20]
0000000180a9db02: lea      rcx, [rbx + 0x20]
0000000180a9db06: mov      qword ptr [rbx + 0x20], rdx
0000000180a9db0a: call     0x18048b9e0
0000000180a9db0f: test     rbp, rbp
0000000180a9db12: je       0x180a9deab
0000000180a9db18: mov      rdx, qword ptr [rip + 0x7eba041] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9db1f: mov      rcx, rbp
0000000180a9db22: call     0x18536e540
0000000180a9db27: mov      rdi, rax
0000000180a9db2a: test     rax, rax
0000000180a9db2d: je       0x180a9deab
0000000180a9db33: cmp      byte ptr [rip + 0x822ecb6], 0
0000000180a9db3a: jbe      0x180a9db44
0000000180a9db3c: mov      rcx, qword ptr [rax]
0000000180a9db3f: call     0x180446d00
0000000180a9db44: mov      rdx, qword ptr [rdi]
0000000180a9db47: mov      rcx, rdi
0000000180a9db4a: mov      r8, qword ptr [rdx + 0xb60]
0000000180a9db51: mov      rdx, qword ptr [rdx + 0xb68]
0000000180a9db58: call     r8
0000000180a9db5b: mov      rdi, rax
0000000180a9db5e: test     rax, rax
0000000180a9db61: je       0x180a9deab
0000000180a9db67: cmp      byte ptr [rip + 0x822ec82], 0
0000000180a9db6e: jbe      0x180a9db78
0000000180a9db70: mov      rcx, qword ptr [rax]
0000000180a9db73: call     0x180446d00
0000000180a9db78: mov      r8, qword ptr [rdi]
0000000180a9db7b: lea      rcx, [rsp + 0x30]
0000000180a9db80: mov      rdx, rdi
0000000180a9db83: mov      r9, qword ptr [r8 + 0x190]
0000000180a9db8a: mov      r8, qword ptr [r8 + 0x198]
0000000180a9db91: call     r9
0000000180a9db94: movups   xmm0, xmmword ptr [rax]
0000000180a9db97: movups   xmmword ptr [rbx + 0x10], xmm0
0000000180a9db9b: mov      rcx, qword ptr [rip + 0x7e9177e] ; TypeInfo DG.Tweening.DOTween @0x18892f320
0000000180a9dba2: cmp      dword ptr [rcx + 0xe0], 0
0000000180a9dba9: jne      0x180a9dbb0
0000000180a9dbab: call     0x18048c140
0000000180a9dbb0: xor      ecx, ecx
0000000180a9dbb2: call     0x18424e070
0000000180a9dbb7: mov      r15, rax
0000000180a9dbba: mov      rax, qword ptr [rip + 0x7e49517] ; TypeInfo Torappu.Battle.Enemy.States.DisappearState.<>c @0x1888e70d8
0000000180a9dbc1: cmp      dword ptr [rax + 0xe0], 0
0000000180a9dbc8: jne      0x180a9dbd9
0000000180a9dbca: mov      rcx, rax
0000000180a9dbcd: call     0x18048c140
0000000180a9dbd2: mov      rax, qword ptr [rip + 0x7e494ff] ; TypeInfo Torappu.Battle.Enemy.States.DisappearState.<>c @0x1888e70d8
0000000180a9dbd9: mov      rcx, qword ptr [rax + 0xb8]
0000000180a9dbe0: mov      rdi, qword ptr [rcx + 8]
0000000180a9dbe4: test     rdi, rdi
0000000180a9dbe7: jne      0x180a9dc63
0000000180a9dbe9: cmp      dword ptr [rax + 0xe0], edi
0000000180a9dbef: jne      0x180a9dc00
0000000180a9dbf1: mov      rcx, rax
0000000180a9dbf4: call     0x18048c140
0000000180a9dbf9: mov      rax, qword ptr [rip + 0x7e494d8] ; TypeInfo Torappu.Battle.Enemy.States.DisappearState.<>c @0x1888e70d8
0000000180a9dc00: mov      rax, qword ptr [rax + 0xb8]
0000000180a9dc07: mov      rcx, qword ptr [rip + 0x7ed39da] ; TypeInfo type(0x15, data=0x188b374d0) @0x1889715e8
0000000180a9dc0e: mov      r14, qword ptr [rax]
0000000180a9dc11: call     0x18045cfe0
0000000180a9dc16: mov      rdi, rax
0000000180a9dc19: test     rax, rax
0000000180a9dc1c: je       0x180a9deab
0000000180a9dc22: mov      r8, qword ptr [rip + 0x7d81707] ; MethodInfo Torappu.Battle.Enemy.States.DisappearState.<>c.<_DoDisappear>b__21_0 [76789] @0x18881f330
0000000180a9dc29: xor      r9d, r9d
0000000180a9dc2c: mov      rdx, r14
0000000180a9dc2f: mov      rcx, rax
0000000180a9dc32: call     0x184918520
0000000180a9dc37: mov      rax, qword ptr [rip + 0x7e4949a] ; TypeInfo Torappu.Battle.Enemy.States.DisappearState.<>c @0x1888e70d8
0000000180a9dc3e: mov      rdx, rdi
0000000180a9dc41: mov      rcx, qword ptr [rax + 0xb8]
0000000180a9dc48: mov      qword ptr [rcx + 8], rdi
0000000180a9dc4c: mov      rax, qword ptr [rip + 0x7e49485] ; TypeInfo Torappu.Battle.Enemy.States.DisappearState.<>c @0x1888e70d8
0000000180a9dc53: mov      rcx, qword ptr [rax + 0xb8]
0000000180a9dc5a: add      rcx, 8
0000000180a9dc5e: call     0x18048b9e0
0000000180a9dc63: mov      rcx, qword ptr [rip + 0x7ed547e] ; TypeInfo type(0x15, data=0x188b3d8f0) @0x1889730e8
0000000180a9dc6a: call     0x18045cfe0
0000000180a9dc6f: mov      r14, rax
0000000180a9dc72: test     rax, rax
0000000180a9dc75: je       0x180a9deab
0000000180a9dc7b: mov      r8, qword ptr [rip + 0x7d81b2e] ; MethodInfo Torappu.Battle.Enemy.States.DisappearState.<>c__DisplayClass21_0.<_DoDisappear>b__1 [76785] @0x18881f7b0
0000000180a9dc82: xor      r9d, r9d
0000000180a9dc85: mov      rdx, rbx
0000000180a9dc88: mov      rcx, rax
0000000180a9dc8b: call     0x18198efc0 ; BitBenderGames.AbstractTouchInputController.InputLongTapProgress..ctor [21694]
0000000180a9dc90: mov      rcx, qword ptr [rip + 0x7e91689] ; TypeInfo DG.Tweening.DOTween @0x18892f320
0000000180a9dc97: cmp      dword ptr [rcx + 0xe0], 0
0000000180a9dc9e: jne      0x180a9dca5
0000000180a9dca0: call     0x18048c140
0000000180a9dca5: movss    xmm3, dword ptr [rip + 0x63a404f]
0000000180a9dcad: xorps    xmm2, xmm2
0000000180a9dcb0: mov      rdx, r14
0000000180a9dcb3: mov      qword ptr [rsp + 0x20], 0
0000000180a9dcbc: mov      rcx, rdi
0000000180a9dcbf: call     0x18424f2c0
0000000180a9dcc4: xor      r8d, r8d
0000000180a9dcc7: mov      rdx, rax
0000000180a9dcca: mov      rcx, r15
0000000180a9dccd: call     0x184262620
0000000180a9dcd2: mov      r15, rax
0000000180a9dcd5: mov      rax, qword ptr [rip + 0x7e493fc] ; TypeInfo Torappu.Battle.Enemy.States.DisappearState.<>c @0x1888e70d8
0000000180a9dcdc: cmp      dword ptr [rax + 0xe0], 0
0000000180a9dce3: jne      0x180a9dcf4
0000000180a9dce5: mov      rcx, rax
0000000180a9dce8: call     0x18048c140
0000000180a9dced: mov      rax, qword ptr [rip + 0x7e493e4] ; TypeInfo Torappu.Battle.Enemy.States.DisappearState.<>c @0x1888e70d8
0000000180a9dcf4: mov      rcx, qword ptr [rax + 0xb8]
0000000180a9dcfb: mov      rdi, qword ptr [rcx + 0x10]
0000000180a9dcff: test     rdi, rdi
0000000180a9dd02: jne      0x180a9dd7e
0000000180a9dd04: cmp      dword ptr [rax + 0xe0], edi
0000000180a9dd0a: jne      0x180a9dd1b
0000000180a9dd0c: mov      rcx, rax
0000000180a9dd0f: call     0x18048c140
0000000180a9dd14: mov      rax, qword ptr [rip + 0x7e493bd] ; TypeInfo Torappu.Battle.Enemy.States.DisappearState.<>c @0x1888e70d8
0000000180a9dd1b: mov      rax, qword ptr [rax + 0xb8]
0000000180a9dd22: mov      rcx, qword ptr [rip + 0x7ed38bf] ; TypeInfo type(0x15, data=0x188b374d0) @0x1889715e8
0000000180a9dd29: mov      r14, qword ptr [rax]
0000000180a9dd2c: call     0x18045cfe0
0000000180a9dd31: mov      rdi, rax
0000000180a9dd34: test     rax, rax
0000000180a9dd37: je       0x180a9deab
0000000180a9dd3d: mov      r8, qword ptr [rip + 0x7d8182c] ; MethodInfo Torappu.Battle.Enemy.States.DisappearState.<>c.<_DoDisappear>b__21_2 [76790] @0x18881f570
0000000180a9dd44: xor      r9d, r9d
0000000180a9dd47: mov      rdx, r14
0000000180a9dd4a: mov      rcx, rax
0000000180a9dd4d: call     0x184918520
0000000180a9dd52: mov      rax, qword ptr [rip + 0x7e4937f] ; TypeInfo Torappu.Battle.Enemy.States.DisappearState.<>c @0x1888e70d8
0000000180a9dd59: mov      rdx, rdi
0000000180a9dd5c: mov      rcx, qword ptr [rax + 0xb8]
0000000180a9dd63: mov      qword ptr [rcx + 0x10], rdi
0000000180a9dd67: mov      rax, qword ptr [rip + 0x7e4936a] ; TypeInfo Torappu.Battle.Enemy.States.DisappearState.<>c @0x1888e70d8
0000000180a9dd6e: mov      rcx, qword ptr [rax + 0xb8]
0000000180a9dd75: add      rcx, 0x10
0000000180a9dd79: call     0x18048b9e0
0000000180a9dd7e: mov      rcx, qword ptr [rip + 0x7ed5363] ; TypeInfo type(0x15, data=0x188b3d8f0) @0x1889730e8
0000000180a9dd85: call     0x18045cfe0
0000000180a9dd8a: mov      r14, rax
0000000180a9dd8d: test     rax, rax
0000000180a9dd90: je       0x180a9deab
0000000180a9dd96: mov      r8, qword ptr [rip + 0x7d81c53] ; MethodInfo Torappu.Battle.Enemy.States.DisappearState.<>c__DisplayClass21_0.<_DoDisappear>b__3 [76786] @0x18881f9f0
0000000180a9dd9d: xor      r9d, r9d
0000000180a9dda0: mov      rdx, rbx
0000000180a9dda3: mov      rcx, rax
0000000180a9dda6: call     0x18198efc0 ; BitBenderGames.AbstractTouchInputController.InputLongTapProgress..ctor [21694]
0000000180a9ddab: mov      rcx, qword ptr [rip + 0x7e9156e] ; TypeInfo DG.Tweening.DOTween @0x18892f320
0000000180a9ddb2: cmp      dword ptr [rcx + 0xe0], 0
0000000180a9ddb9: jne      0x180a9ddc0
0000000180a9ddbb: call     0x18048c140
0000000180a9ddc0: movss    xmm3, dword ptr [rip + 0x63a3f34]
0000000180a9ddc8: xorps    xmm2, xmm2
0000000180a9ddcb: mov      rdx, r14
0000000180a9ddce: mov      qword ptr [rsp + 0x20], 0
0000000180a9ddd7: mov      rcx, rdi
0000000180a9ddda: call     0x18424f2c0
0000000180a9dddf: xor      r8d, r8d
0000000180a9dde2: mov      rdx, rax
0000000180a9dde5: mov      rcx, r15
0000000180a9dde8: call     0x184262620
0000000180a9dded: mov      r8, qword ptr [rip + 0x7d76aec] ; GenericMethodInfo 301116 @0x1888148e0
0000000180a9ddf4: mov      rdx, rbp
0000000180a9ddf7: mov      rcx, rax
0000000180a9ddfa: call     0x1845f1320
0000000180a9ddff: xor      edx, edx
0000000180a9de01: mov      rcx, rax
0000000180a9de04: call     0x180ae0a10 ; Torappu.Battle.BattleUtil.Deprecated_PlayTweenInBattle [78250]
0000000180a9de09: lea      rcx, [rbp + 0x30]
0000000180a9de0d: mov      qword ptr [rbp + 0x30], rax
0000000180a9de11: mov      rdx, rax
0000000180a9de14: call     0x18048b9e0
0000000180a9de19: movss    xmm0, dword ptr [rip + 0x63a20f7]
0000000180a9de21: xor      edx, edx
0000000180a9de23: call     0x180647f20 ; Torappu.Battle.AsyncUtil.WaitForFixedSeconds [64127]
0000000180a9de28: lea      rcx, [rsi + 0x18]
0000000180a9de2c: mov      qword ptr [rsi + 0x18], rax
0000000180a9de30: mov      rdx, rax
0000000180a9de33: call     0x18048b9e0
0000000180a9de38: mov      al, 1
0000000180a9de3a: mov      dword ptr [rsi + 0x10], 1
0000000180a9de41: jmp      0x180a9de90
0000000180a9de43: cmp      eax, 1
0000000180a9de46: jne      0x180a9de8e
0000000180a9de48: mov      dword ptr [rsi + 0x10], 0xffffffff
0000000180a9de4f: test     rbp, rbp
0000000180a9de52: je       0x180a9deab
0000000180a9de54: mov      rcx, qword ptr [rbp + 0x30]
0000000180a9de58: xor      r8d, r8d
0000000180a9de5b: movzx    edx, al
0000000180a9de5e: call     0x184260440
0000000180a9de63: mov      rdx, qword ptr [rip + 0x7eb9cf6] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9de6a: mov      rcx, rbp
0000000180a9de6d: call     0x18536e540
0000000180a9de72: test     rax, rax
0000000180a9de75: je       0x180a9deab
0000000180a9de77: xor      edx, edx
0000000180a9de79: mov      rcx, rax
0000000180a9de7c: call     0x186b59d80
0000000180a9de81: xor      r8d, r8d
0000000180a9de84: xor      edx, edx
0000000180a9de86: mov      rcx, rax
0000000180a9de89: call     0x18671b320
0000000180a9de8e: xor      al, al
0000000180a9de90: mov      r15, qword ptr [rsp + 0x40]
0000000180a9de95: mov      r14, qword ptr [rsp + 0x70]
0000000180a9de9a: mov      rdi, qword ptr [rsp + 0x68]
0000000180a9de9f: mov      rbx, qword ptr [rsp + 0x60]
0000000180a9dea4: add      rsp, 0x48
0000000180a9dea8: pop      rsi
0000000180a9dea9: pop      rbp
0000000180a9deaa: ret      
0000000180a9deab: call     0x18048c0b0
0000000180a9deb0: int3     
0000000180a9deb1: int3     
0000000180a9deb2: int3     
0000000180a9deb3: int3     
0000000180a9deb4: int3     
0000000180a9deb5: int3     
0000000180a9deb6: int3     
0000000180a9deb7: int3     
0000000180a9deb8: int3     
0000000180a9deb9: int3     
0000000180a9deba: int3     
0000000180a9debb: int3     
0000000180a9debc: int3     
0000000180a9debd: int3     
0000000180a9debe: int3     
0000000180a9debf: int3     