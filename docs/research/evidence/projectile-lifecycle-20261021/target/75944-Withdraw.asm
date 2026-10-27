; Torappu.Battle.Character.Withdraw metadata=75944 token=0x60128a9 VA=0x180a33970 RVA=0xa33970 size=0x460
0000000180a33970: mov      rax, rsp
0000000180a33973: mov      byte ptr [rax + 0x20], r9b
0000000180a33977: mov      byte ptr [rax + 0x10], dl
0000000180a3397a: mov      qword ptr [rax + 8], rcx
0000000180a3397e: push     rbx
0000000180a3397f: push     rsi
0000000180a33980: push     rdi
0000000180a33981: push     r12
0000000180a33983: push     r15
0000000180a33985: sub      rsp, 0xa0
0000000180a3398c: movaps   xmmword ptr [rax - 0x38], xmm6
0000000180a33990: movzx    esi, r9b
0000000180a33994: movzx    ebx, r8b
0000000180a33998: movzx    r12d, dl
0000000180a3399c: mov      rdi, rcx
0000000180a3399f: cmp      byte ptr [rip + 0x825ec3c], 0
0000000180a339a6: jne      0x180a339df
0000000180a339a8: lea      rcx, [rip + 0x7e388b9] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a339af: call     0x18048bf00
0000000180a339b4: lea      rcx, [rip + 0x7f041ed] ; TypeInfo CodeStage.AntiCheat.ObscuredTypes.ObscuredInt @0x188937ba8
0000000180a339bb: call     0x18048bf00
0000000180a339c0: lea      rcx, [rip + 0x7e6fd21] ; GenericMethodInfo 281670 @0x1888a36e8
0000000180a339c7: call     0x18048bf00
0000000180a339cc: lea      rcx, [rip + 0x7e9ff35] ; GenericMethodInfo 281972 @0x1888d3908
0000000180a339d3: call     0x18048bf00
0000000180a339d8: mov      byte ptr [rip + 0x825ec03], 1
0000000180a339df: mov      qword ptr [rsp + 0x50], 0
0000000180a339e8: xorps    xmm0, xmm0
0000000180a339eb: movups   xmmword ptr [rsp + 0x60], xmm0
0000000180a339f0: mov      rax, qword ptr [rip + 0x7e38871] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a339f7: cmp      dword ptr [rax + 0xe0], 0
0000000180a339fe: jne      0x180a33a0f
0000000180a33a00: mov      rcx, rax
0000000180a33a03: call     0x18048c140
0000000180a33a08: mov      rax, qword ptr [rip + 0x7e38859] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a33a0f: mov      rax, qword ptr [rax + 0xb8]
0000000180a33a16: mov      rcx, qword ptr [rax + 0x400]
0000000180a33a1d: test     rcx, rcx
0000000180a33a20: jne      0x180a33d67
0000000180a33a26: xor      edx, edx
0000000180a33a28: mov      rcx, rdi
0000000180a33a2b: call     0x180708ee0 ; Torappu.Battle.Entity.get_unfinished [66386]
0000000180a33a30: test     al, al
0000000180a33a32: je       0x180a33d63
0000000180a33a38: test     bl, bl
0000000180a33a3a: jne      0x180a33a6a
0000000180a33a3c: cmp      byte ptr [rip + 0x8298dae], bl
0000000180a33a42: jbe      0x180a33a4c
0000000180a33a44: mov      rcx, qword ptr [rdi]
0000000180a33a47: call     0x180446d00
0000000180a33a4c: mov      rdx, qword ptr [rdi]
0000000180a33a4f: mov      rax, qword ptr [rdx + 0xf20]
0000000180a33a56: mov      rdx, qword ptr [rdx + 0xf28]
0000000180a33a5d: mov      rcx, rdi
0000000180a33a60: call     rax
0000000180a33a62: test     al, al
0000000180a33a64: je       0x180a33d63
0000000180a33a6a: xor      r8d, r8d
0000000180a33a6d: lea      rdx, [rsp + 0x50]
0000000180a33a72: lea      rcx, [rsp + 0x70]
0000000180a33a77: call     0x180c99dd0 ; Torappu.Battle.LevelScript.EventParams.Allocate [83821]
0000000180a33a7c: movups   xmm0, xmmword ptr [rax]
0000000180a33a7f: movups   xmmword ptr [rsp + 0x60], xmm0
0000000180a33a84: mov      qword ptr [rsp + 0x70], 0
0000000180a33a8d: lea      rax, [rsp + 0x60]
0000000180a33a92: mov      qword ptr [rsp + 0x78], rax
0000000180a33a97: mov      rbx, qword ptr [rsp + 0x50]
0000000180a33a9c: xor      edx, edx
0000000180a33a9e: mov      rcx, rdi
0000000180a33aa1: call     0x180704d90 ; Torappu.Battle.Entity.get_id [66343]
0000000180a33aa6: test     rbx, rbx
0000000180a33aa9: je       0x180a33db8
0000000180a33aaf: xor      r8d, r8d
0000000180a33ab2: mov      rdx, rax
0000000180a33ab5: mov      rcx, rbx
0000000180a33ab8: call     0x180c9a170 ; Torappu.Battle.LevelScript.EventParams.SetSender [83823]
0000000180a33abd: mov      rbx, qword ptr [rsp + 0x50]
0000000180a33ac2: xor      edx, edx
0000000180a33ac4: mov      rcx, rdi
0000000180a33ac7: call     0x180704d90 ; Torappu.Battle.Entity.get_id [66343]
0000000180a33acc: test     rbx, rbx
0000000180a33acf: je       0x180a33db3
0000000180a33ad5: xor      r8d, r8d
0000000180a33ad8: mov      rdx, rax
0000000180a33adb: mov      rcx, rbx
0000000180a33ade: call     0x180c9a110 ; Torappu.Battle.LevelScript.EventParams.SetReceiver [83824]
0000000180a33ae3: mov      rcx, qword ptr [rip + 0x7e9fe1e] ; GenericMethodInfo 281972 @0x1888d3908
0000000180a33aea: call     0x185337c50
0000000180a33aef: test     rax, rax
0000000180a33af2: je       0x180a33dae
0000000180a33af8: xor      edx, edx
0000000180a33afa: mov      rcx, rax
0000000180a33afd: call     0x180642fd0 ; Torappu.Battle.BattleController.get_levelScriptEventManager [64528]
0000000180a33b02: test     rax, rax
0000000180a33b05: je       0x180a33da8
0000000180a33b0b: xor      r9d, r9d
0000000180a33b0e: mov      r8, qword ptr [rsp + 0x50]
0000000180a33b13: mov      edx, 2
0000000180a33b18: mov      rcx, rax
0000000180a33b1b: call     0x180c9d520 ; Torappu.Battle.LevelScript.LevelScriptEventManager.RaiseLevelEvent [83945]
0000000180a33b20: nop      
0000000180a33b21: mov      rdx, qword ptr [rip + 0x7e6fbc0] ; GenericMethodInfo 281670 @0x1888a36e8
0000000180a33b28: lea      rcx, [rsp + 0x60]
0000000180a33b2d: call     0x18531eef0
0000000180a33b32: jmp      0x180a33b6c
0000000180a33b34: mov      rdx, qword ptr [rip + 0x7e6fbad] ; GenericMethodInfo 281670 @0x1888a36e8
0000000180a33b3b: lea      rcx, [rsp + 0x60]
0000000180a33b40: call     0x18531eef0
0000000180a33b45: mov      rcx, qword ptr [rsp + 0x70]
0000000180a33b4a: test     rcx, rcx
0000000180a33b4d: jne      0x180a33dbe
0000000180a33b53: movzx    esi, byte ptr [rsp + 0xe8]
0000000180a33b5b: movzx    r12d, byte ptr [rsp + 0xd8]
0000000180a33b64: mov      rdi, qword ptr [rsp + 0xd0]
0000000180a33b6c: cmp      byte ptr [rip + 0x8298c7d], 0
0000000180a33b73: jbe      0x180a33b7d
0000000180a33b75: mov      rcx, qword ptr [rdi]
0000000180a33b78: call     0x180446d00
0000000180a33b7d: mov      rdx, qword ptr [rdi]
0000000180a33b80: mov      rax, qword ptr [rdx + 0xf70]
0000000180a33b87: mov      rdx, qword ptr [rdx + 0xf78]
0000000180a33b8e: mov      rcx, rdi
0000000180a33b91: call     rax
0000000180a33b93: test     al, al
0000000180a33b95: je       0x180a33c8d
0000000180a33b9b: xor      edx, edx
0000000180a33b9d: mov      rcx, rdi
0000000180a33ba0: call     0x180702b80 ; Torappu.Battle.Entity.get_cost [66465]
0000000180a33ba5: movd     xmm0, eax
0000000180a33ba9: cvtdq2ps xmm0, xmm0
0000000180a33bac: mulss    xmm0, dword ptr [rdi + 0x4e0]
0000000180a33bb4: xor      edx, edx
0000000180a33bb6: call     0x180535390
0000000180a33bbb: mov      r15d, eax
0000000180a33bbe: xor      edx, edx
0000000180a33bc0: mov      rcx, rdi
0000000180a33bc3: call     0x180a39dd0 ; Torappu.Battle.Character.get_data [75906]
0000000180a33bc8: test     rax, rax
0000000180a33bcb: je       0x180a33dc4
0000000180a33bd1: mov      rcx, qword ptr [rax + 0x38]
0000000180a33bd5: test     rcx, rcx
0000000180a33bd8: je       0x180a33dc4
0000000180a33bde: movups   xmm6, xmmword ptr [rcx + 0x64]
0000000180a33be2: mov      ebx, dword ptr [rcx + 0x74]
0000000180a33be5: mov      rcx, qword ptr [rip + 0x7f03fbc] ; TypeInfo CodeStage.AntiCheat.ObscuredTypes.ObscuredInt @0x188937ba8
0000000180a33bec: cmp      dword ptr [rcx + 0xe0], 0
0000000180a33bf3: jne      0x180a33bfa
0000000180a33bf5: call     0x18048c140
0000000180a33bfa: movaps   xmmword ptr [rsp + 0x70], xmm6
0000000180a33bff: mov      dword ptr [rsp + 0x80], ebx
0000000180a33c06: xor      edx, edx
0000000180a33c08: lea      rcx, [rsp + 0x70]
0000000180a33c0d: call     0x18660ba40
0000000180a33c12: movd     xmm0, eax
0000000180a33c16: cvtdq2ps xmm0, xmm0
0000000180a33c19: mulss    xmm0, dword ptr [rdi + 0x33c]
0000000180a33c21: xor      edx, edx
0000000180a33c23: call     0x1808a9980
0000000180a33c28: mov      ebx, eax
0000000180a33c2a: cmp      byte ptr [rdi + 0x4e4], 0
0000000180a33c31: je       0x180a33c3e
0000000180a33c33: mov      eax, dword ptr [rdi + 0x4ec]
0000000180a33c39: cmp      eax, ebx
0000000180a33c3b: cmovg    ebx, eax
0000000180a33c3e: cmp      r15d, ebx
0000000180a33c41: cmovl    ebx, r15d
0000000180a33c45: mov      rcx, qword ptr [rip + 0x7e9fcbc] ; GenericMethodInfo 281972 @0x1888d3908
0000000180a33c4c: call     0x185337c50
0000000180a33c51: test     rax, rax
0000000180a33c54: je       0x180a33dc4
0000000180a33c5a: mov      qword ptr [rsp + 0x48], 0
0000000180a33c63: mov      byte ptr [rsp + 0x40], 0
0000000180a33c68: mov      byte ptr [rsp + 0x38], 0
0000000180a33c6d: mov      byte ptr [rsp + 0x30], 0
0000000180a33c72: mov      byte ptr [rsp + 0x28], 0
0000000180a33c77: mov      byte ptr [rsp + 0x20], 0
0000000180a33c7c: mov      r9d, dword ptr [rdi + 0x20]
0000000180a33c80: mov      r8, rdi
0000000180a33c83: mov      edx, ebx
0000000180a33c85: mov      rcx, rax
0000000180a33c88: call     0x180629940 ; Torappu.Battle.BattleController.ModifyCost [64618]
0000000180a33c8d: xor      edx, edx
0000000180a33c8f: mov      rcx, rdi
0000000180a33c92: call     0x180ad4090 ; Torappu.Battle.VisualObject.get_gridPosition [77871]
0000000180a33c97: mov      rbx, rax
0000000180a33c9a: test     r12b, r12b
0000000180a33c9d: je       0x180a33ca7
0000000180a33c9f: mov      r8d, 5
0000000180a33ca5: jmp      0x180a33cb6
0000000180a33ca7: movzx    eax, sil
0000000180a33cab: xor      eax, 1
0000000180a33cae: lea      r8d, [rax*2 + 4]
0000000180a33cb6: mov      ecx, 0x75
0000000180a33cbb: mov      rdx, rdi
0000000180a33cbe: call     0x1800053c0
0000000180a33cc3: test     sil, sil
0000000180a33cc6: jne      0x180a33d1d
0000000180a33cc8: cmp      byte ptr [rsp + 0xf0], sil
0000000180a33cd0: je       0x180a33d5f
0000000180a33cd6: mov      rcx, qword ptr [rip + 0x7e9fc2b] ; GenericMethodInfo 281972 @0x1888d3908
0000000180a33cdd: call     0x185337c50
0000000180a33ce2: test     rax, rax
0000000180a33ce5: je       0x180a33dc4
0000000180a33ceb: xor      edx, edx
0000000180a33ced: mov      rcx, rax
0000000180a33cf0: call     0x1806430d0 ; Torappu.Battle.BattleController.get_logger [64507]
0000000180a33cf5: mov      rbx, rax
0000000180a33cf8: xor      edx, edx
0000000180a33cfa: mov      rcx, rdi
0000000180a33cfd: call     0x180a39dd0 ; Torappu.Battle.Character.get_data [75906]
0000000180a33d02: test     rbx, rbx
0000000180a33d05: je       0x180a33dc4
0000000180a33d0b: xor      r8d, r8d
0000000180a33d0e: mov      rdx, rax
0000000180a33d11: mov      rcx, rbx
0000000180a33d14: call     0x18070f230 ; Torappu.Battle.BattleLogger.LogCharacterAutoWithdraw [66979]
0000000180a33d19: mov      al, 1
0000000180a33d1b: jmp      0x180a33d91
0000000180a33d1d: mov      rcx, qword ptr [rip + 0x7e9fbe4] ; GenericMethodInfo 281972 @0x1888d3908
0000000180a33d24: call     0x185337c50
0000000180a33d29: test     rax, rax
0000000180a33d2c: je       0x180a33dc4
0000000180a33d32: xor      edx, edx
0000000180a33d34: mov      rcx, rax
0000000180a33d37: call     0x1806430d0 ; Torappu.Battle.BattleController.get_logger [64507]
0000000180a33d3c: mov      rsi, rax
0000000180a33d3f: xor      edx, edx
0000000180a33d41: mov      rcx, rdi
0000000180a33d44: call     0x180a39dd0 ; Torappu.Battle.Character.get_data [75906]
0000000180a33d49: test     rsi, rsi
0000000180a33d4c: je       0x180a33dc4
0000000180a33d4e: xor      r9d, r9d
0000000180a33d51: mov      r8, rbx
0000000180a33d54: mov      rdx, rax
0000000180a33d57: mov      rcx, rsi
0000000180a33d5a: call     0x180711340 ; Torappu.Battle.BattleLogger.LogManualWithdraw [66978]
0000000180a33d5f: mov      al, 1
0000000180a33d61: jmp      0x180a33d91
0000000180a33d63: xor      al, al
0000000180a33d65: jmp      0x180a33d91
0000000180a33d67: mov      qword ptr [rsp + 0x30], 0
0000000180a33d70: movzx    eax, byte ptr [rsp + 0xf0]
0000000180a33d78: mov      byte ptr [rsp + 0x28], al
0000000180a33d7c: mov      byte ptr [rsp + 0x20], sil
0000000180a33d81: movzx    r9d, bl
0000000180a33d85: movzx    r8d, r12b
0000000180a33d89: mov      rdx, rdi
0000000180a33d8c: call     0x183398d40 ; XLua.DelegateBridge.__Gen_Delegate_Imp3668 [6323]
0000000180a33d91: movaps   xmm6, xmmword ptr [rsp + 0x90]
0000000180a33d99: add      rsp, 0xa0
0000000180a33da0: pop      r15
0000000180a33da2: pop      r12
0000000180a33da4: pop      rdi
0000000180a33da5: pop      rsi
0000000180a33da6: pop      rbx
0000000180a33da7: ret      
0000000180a33da8: call     0x18048c0b0
0000000180a33dad: nop      
0000000180a33dae: call     0x18048c0b0
0000000180a33db3: call     0x18048c0b0
0000000180a33db8: call     0x18048c0b0
0000000180a33dbd: nop      
0000000180a33dbe: call     0x180472d50
0000000180a33dc3: int3     
0000000180a33dc4: call     0x18048c0b0
0000000180a33dc9: int3     
0000000180a33dca: int3     
0000000180a33dcb: int3     
0000000180a33dcc: int3     
0000000180a33dcd: int3     
0000000180a33dce: int3     
0000000180a33dcf: int3     