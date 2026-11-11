0x180c029b0: mov qword ptr [rsp + 8], rbx
0x180c029b5: mov qword ptr [rsp + 0x10], rsi
0x180c029ba: mov qword ptr [rsp + 0x20], r9
0x180c029bf: mov dword ptr [rsp + 0x18], r8d
0x180c029c4: push rdi
0x180c029c5: push r12
0x180c029c7: push r13
0x180c029c9: push r14
0x180c029cb: push r15
0x180c029cd: sub rsp, 0x130
0x180c029d4: mov r15, r9
0x180c029d7: mov r12d, r8d
0x180c029da: mov rbx, rdx
0x180c029dd: mov rdi, rcx
0x180c029e0: cmp byte ptr [rip + 0x839bb81], 0
0x180c029e7: jne 0x180c02a84
0x180c029ed: lea rcx, [rip + 0x8026ea4]
0x180c029f4: call 0x18049c210
0x180c029f9: lea rcx, [rip + 0x8009650]
0x180c02a00: call 0x18049c210
0x180c02a05: lea rcx, [rip + 0x7f698a4]
0x180c02a0c: call 0x18049c210
0x180c02a11: lea rcx, [rip + 0x8009888]
0x180c02a18: call 0x18049c210
0x180c02a1d: lea rcx, [rip + 0x7f69adc]
0x180c02a24: call 0x18049c210
0x180c02a29: lea rcx, [rip + 0x7f69d20]
0x180c02a30: call 0x18049c210
0x180c02a35: lea rcx, [rip + 0x8009aac]
0x180c02a3c: call 0x18049c210
0x180c02a41: lea rcx, [rip + 0x7f51398]
0x180c02a48: call 0x18049c210
0x180c02a4d: lea rcx, [rip + 0x8014e84]
0x180c02a54: call 0x18049c210
0x180c02a59: lea rcx, [rip + 0x7f15110]
0x180c02a60: call 0x18049c210
0x180c02a65: lea rcx, [rip + 0x7f763c4]
0x180c02a6c: call 0x18049c210
0x180c02a71: lea rcx, [rip + 0x8063bf8]
0x180c02a78: call 0x18049c210
0x180c02a7d: mov byte ptr [rip + 0x839bae4], 1
0x180c02a84: xorps xmm0, xmm0
0x180c02a87: movups xmmword ptr [rsp + 0xe0], xmm0
0x180c02a8f: xor esi, esi
0x180c02a91: mov dword ptr [rsp + 0x40], esi
0x180c02a95: mov qword ptr [rsp + 0x48], rsi
0x180c02a9a: xor eax, eax
0x180c02a9c: movups xmmword ptr [rsp + 0x90], xmm0
0x180c02aa4: mov qword ptr [rsp + 0xa0], rax
0x180c02aac: xorps xmm1, xmm1
0x180c02aaf: movups xmmword ptr [rsp + 0xa8], xmm1
0x180c02ab7: mov qword ptr [rsp + 0xb8], rax
0x180c02abf: mov rax, qword ptr [rip + 0x8026dd2]
0x180c02ac6: cmp dword ptr [rax + 0xe0], esi
0x180c02acc: jne 0x180c02add
0x180c02ace: mov rcx, rax
0x180c02ad1: call 0x18049c450
0x180c02ad6: mov rax, qword ptr [rip + 0x8026dbb]
0x180c02add: mov rax, qword ptr [rax + 0xb8]
0x180c02ae4: mov rcx, qword ptr [rax + 0xa8]
0x180c02aeb: test rcx, rcx
0x180c02aee: jne 0x180c02f76
0x180c02af4: xor edx, edx
0x180c02af6: mov rcx, rdi
0x180c02af9: call 0x180c05e10 ; Torappu.Battle.AutoChess.AutoChessBattleDataModel.get_center
0x180c02afe: test rax, rax
0x180c02b01: je 0x180c03003
0x180c02b07: mov rax, qword ptr [rax + 0x128]
0x180c02b0e: test rax, rax
0x180c02b11: je 0x180c03003
0x180c02b17: mov r13, qword ptr [rax + 0xc0]
0x180c02b1e: mov qword ptr [rsp + 0x58], r13
0x180c02b23: test rbx, rbx
0x180c02b26: je 0x180c03003
0x180c02b2c: mov r8, qword ptr [rip + 0x8063b3d]
0x180c02b33: mov rdx, rbx
0x180c02b36: lea rcx, [rsp + 0xc0]
0x180c02b3e: call 0x184ce30d0
0x180c02b43: movups xmm0, xmmword ptr [rsp + 0xc0]
0x180c02b4b: movups xmmword ptr [rsp + 0xf0], xmm0
0x180c02b53: movups xmm1, xmmword ptr [rsp + 0xd0]
0x180c02b5b: movups xmmword ptr [rsp + 0x100], xmm1
0x180c02b63: mov qword ptr [rsp + 0x70], rsi
0x180c02b68: lea rax, [rsp + 0xf0]
0x180c02b70: mov qword ptr [rsp + 0x78], rax
0x180c02b75: nop word ptr [rax + rax]
0x180c02b80: mov rdx, qword ptr [rip + 0x7f69979]
0x180c02b87: lea rcx, [rsp + 0xf0]
0x180c02b8f: call 0x185cb6220
0x180c02b94: test al, al
0x180c02b96: je 0x180c02f42
0x180c02b9c: movups xmm0, xmmword ptr [rsp + 0x100]
0x180c02ba4: movups xmmword ptr [rsp + 0xe0], xmm0
0x180c02bac: mov r9, qword ptr [rip + 0x7f5122d]
0x180c02bb3: lea r8, [rsp + 0x48]
0x180c02bb8: lea rdx, [rsp + 0x40]
0x180c02bbd: lea rcx, [rsp + 0xe0]
0x180c02bc5: call 0x184c74970
0x180c02bca: mov rbx, qword ptr [rsp + 0x48]
0x180c02bcf: mov qword ptr [rsp + 0x50], rbx
0x180c02bd4: test rbx, rbx
0x180c02bd7: je 0x180c02ff7
0x180c02bdd: mov r8, qword ptr [rip + 0x7f7624c]
0x180c02be4: mov rdx, rbx
0x180c02be7: lea rcx, [rsp + 0xc0]
0x180c02bef: call 0x184d19f20
0x180c02bf4: movups xmm0, xmmword ptr [rsp + 0xc0]
0x180c02bfc: movups xmmword ptr [rsp + 0x90], xmm0
0x180c02c04: movsd xmm1, qword ptr [rsp + 0xd0]
0x180c02c0d: movsd qword ptr [rsp + 0xa0], xmm1
0x180c02c16: mov qword ptr [rsp + 0x60], rsi
0x180c02c1b: lea rax, [rsp + 0x90]
0x180c02c23: mov qword ptr [rsp + 0x68], rax
0x180c02c28: jmp 0x180c02c38
0x180c02c2a: nop word ptr [rax + rax]
0x180c02c30: mov r15, qword ptr [rsp + 0x178]
0x180c02c38: mov rdx, qword ptr [rip + 0x8009661]
0x180c02c3f: lea rcx, [rsp + 0x90]
0x180c02c47: call 0x185cc82d0
0x180c02c4c: test al, al
0x180c02c4e: je 0x180c02ef1
0x180c02c54: mov r14, qword ptr [rsp + 0xa0]
0x180c02c5c: test r14, r14
0x180c02c5f: je 0x180c02fec
0x180c02c65: cmp dword ptr [r14 + 0x40], r12d
0x180c02c69: jne 0x180c02c38
0x180c02c6b: xor edx, edx
0x180c02c6d: mov rcx, r14
0x180c02c70: call 0x180c2dfa0 ; Torappu.Battle.AutoChess.ChessInst.get_isCharacter
0x180c02c75: test al, al
0x180c02c77: je 0x180c02c38
0x180c02c79: xor edx, edx
0x180c02c7b: mov rcx, r14
0x180c02c7e: call 0x180c2df00 ; Torappu.Battle.AutoChess.ChessInst.get_charInst
0x180c02c83: mov qword ptr [rsp + 0x28], rsi
0x180c02c88: mov qword ptr [rsp + 0x20], rsi
0x180c02c8d: mov r9d, r12d
0x180c02c90: xor r8d, r8d
0x180c02c93: xor edx, edx
0x180c02c95: mov rcx, rax
0x180c02c98: call 0x180b09e40 ; Torappu.Battle.BattleDataConverter.ConvertToCharacterData
0x180c02c9d: mov rbx, rax
0x180c02ca0: xor r9d, r9d
0x180c02ca3: mov r8, qword ptr [r14 + 0x18]
0x180c02ca7: mov edx, dword ptr [r14 + 0x10]
0x180c02cab: mov rcx, rax
0x180c02cae: call 0x180c1cd50 ; Torappu.Battle.AutoChess.AutoChessBattleUtil.ApplyInstDataToSharedData
0x180c02cb3: test rbx, rbx
0x180c02cb6: je 0x180c02fe7
0x180c02cbc: mov eax, dword ptr [rbx + 0x6c]
0x180c02cbf: mov dword ptr [r14 + 0x44], eax
0x180c02cc3: mov qword ptr [r14 + 0x48], rbx
0x180c02cc7: lea rcx, [r14 + 0x48]
0x180c02ccb: mov rdx, rbx
0x180c02cce: call 0x18049bcf0
0x180c02cd3: mov rdi, qword ptr [rbx + 0x180]
0x180c02cda: xor edx, edx
0x180c02cdc: mov ecx, dword ptr [r14 + 0x30]
0x180c02ce0: call 0x180c1dd90 ; Torappu.Battle.AutoChess.AutoChessBattleUtil.GetBattleMapLayer
0x180c02ce5: test rdi, rdi
0x180c02ce8: je 0x180c02fe2
0x180c02cee: mov dword ptr [rdi + 0x28], eax
0x180c02cf1: test r15, r15
0x180c02cf4: je 0x180c02fdd
0x180c02cfa: mov r8, qword ptr [rip + 0x7f14e6f]
0x180c02d01: mov rdx, rbx
0x180c02d04: mov rcx, r15
0x180c02d07: call 0x1805182d0
0x180c02d0c: test r13, r13
0x180c02d0f: je 0x180c02fd8
0x180c02d15: mov r9, qword ptr [rip + 0x8014bbc]
0x180c02d1c: mov r8, r14
0x180c02d1f: mov edx, dword ptr [rbx + 0x6c]
0x180c02d22: mov rcx, r13
0x180c02d25: call 0x184ca83c0
0x180c02d2a: xor edx, edx
0x180c02d2c: mov rcx, r14
0x180c02d2f: call 0x180c2df00 ; Torappu.Battle.AutoChess.ChessInst.get_charInst
0x180c02d34: mov qword ptr [rsp + 0x20], rsi
0x180c02d39: xor r9d, r9d
0x180c02d3c: mov r8d, r12d
0x180c02d3f: mov rdx, rax
0x180c02d42: mov rcx, rbx
0x180c02d45: call 0x180b0a2e0 ; Torappu.Battle.BattleDataConverter.ConvertToTokenDataOrNull
0x180c02d4a: mov r15, rax
0x180c02d4d: test rax, rax
0x180c02d50: je 0x180c02c30
0x180c02d56: xor r9d, r9d
0x180c02d59: mov r8, qword ptr [r14 + 0x18]
0x180c02d5d: mov edx, dword ptr [r14 + 0x10]
0x180c02d61: mov rcx, rax
0x180c02d64: call 0x180c1cd50 ; Torappu.Battle.AutoChess.AutoChessBattleUtil.ApplyInstDataToSharedData
0x180c02d69: mov eax, dword ptr [r15 + 0x6c]
0x180c02d6d: mov dword ptr [rbx + 0xa0], eax
0x180c02d73: mov rax, qword ptr [rsp + 0x180]
0x180c02d7b: test rax, rax
0x180c02d7e: je 0x180c02fd3
0x180c02d84: mov r8, qword ptr [rip + 0x7f14de5]
0x180c02d8b: mov rdx, r15
0x180c02d8e: mov rcx, rax
0x180c02d91: call 0x1805182d0
0x180c02d96: mov rax, qword ptr [rsp + 0x50]
0x180c02d9b: test rax, rax
0x180c02d9e: je 0x180c02fce
0x180c02da4: mov r8, qword ptr [rip + 0x7f76085]
0x180c02dab: mov rdx, rax
0x180c02dae: lea rcx, [rsp + 0xc0]
0x180c02db6: call 0x184d19f20
0x180c02dbb: movups xmm0, xmmword ptr [rsp + 0xc0]
0x180c02dc3: movups xmmword ptr [rsp + 0xa8], xmm0
0x180c02dcb: movsd xmm1, qword ptr [rsp + 0xd0]
0x180c02dd4: movsd qword ptr [rsp + 0xb8], xmm1
0x180c02ddd: mov qword ptr [rsp + 0x80], rsi
0x180c02de5: lea rbx, [rsp + 0xa8]
0x180c02ded: mov qword ptr [rsp + 0x88], rbx
0x180c02df5: nop word ptr [rax + rax]
0x180c02e00: mov rdx, qword ptr [rip + 0x8009499]
0x180c02e07: lea rcx, [rsp + 0xa8]
0x180c02e0f: call 0x185cc82d0
0x180c02e14: test al, al
0x180c02e16: je 0x180c02ea2
0x180c02e1c: mov rdi, qword ptr [rsp + 0xb8]
0x180c02e24: test rdi, rdi
0x180c02e27: je 0x180c02fc3
0x180c02e2d: cmp dword ptr [rdi + 0x40], r12d
0x180c02e31: jne 0x180c02e00
0x180c02e33: xor edx, edx
0x180c02e35: mov rcx, rdi
0x180c02e38: call 0x180c2e1f0 ; Torappu.Battle.AutoChess.ChessInst.get_isToken
0x180c02e3d: test al, al
0x180c02e3f: je 0x180c02e00
0x180c02e41: mov eax, dword ptr [rdi + 0x10]
0x180c02e44: test r14, r14
0x180c02e47: je 0x180c02fbe
0x180c02e4d: cmp eax, dword ptr [r14 + 0x10]
0x180c02e51: jne 0x180c02e00
0x180c02e53: mov eax, dword ptr [r15 + 0x6c]
0x180c02e57: mov dword ptr [rdi + 0x44], eax
0x180c02e5a: mov qword ptr [rdi + 0x48], r15
0x180c02e5e: lea rcx, [rdi + 0x48]
0x180c02e62: mov rdx, r15
0x180c02e65: call 0x18049bcf0
0x180c02e6a: mov rsi, qword ptr [r15 + 0x180]
0x180c02e71: xor edx, edx
0x180c02e73: mov ecx, dword ptr [rdi + 0x30]
0x180c02e76: call 0x180c1dd90 ; Torappu.Battle.AutoChess.AutoChessBattleUtil.GetBattleMapLayer
0x180c02e7b: test rsi, rsi
0x180c02e7e: je 0x180c02fb8
0x180c02e84: mov dword ptr [rsi + 0x28], eax
0x180c02e87: mov r9, qword ptr [rip + 0x8014a4a]
0x180c02e8e: mov r8, rdi
0x180c02e91: mov edx, dword ptr [r15 + 0x6c]
0x180c02e95: mov rcx, r13
0x180c02e98: call 0x184ca83c0
0x180c02e9d: jmp 0x180c02e00
0x180c02ea2: mov rdx, qword ptr [rip + 0x80091a7]
0x180c02ea9: mov rcx, rbx
0x180c02eac: call 0x18051df60 ; BattleTimer.EventOnEntryClick | BattleTimer.EventOnTimerPlayNPause | BattleTimer.EventOnTimerRecord | BattleTimer.EventOnTimerReset
0x180c02eb1: xor esi, esi
0x180c02eb3: jmp 0x180c02c30
0x180c02eb8: mov rdx, qword ptr [rip + 0x8009191]
0x180c02ebf: mov rcx, qword ptr [rsp + 0x88]
0x180c02ec7: call 0x18051df60 ; BattleTimer.EventOnEntryClick | BattleTimer.EventOnTimerPlayNPause | BattleTimer.EventOnTimerRecord | BattleTimer.EventOnTimerReset
0x180c02ecc: mov rcx, qword ptr [rsp + 0x80]
0x180c02ed4: test rcx, rcx
0x180c02ed7: jne 0x180c02fc9
0x180c02edd: xor esi, esi
0x180c02edf: mov r12d, dword ptr [rsp + 0x170]
0x180c02ee7: mov r13, qword ptr [rsp + 0x58]
0x180c02eec: jmp 0x180c02c30
0x180c02ef1: mov rdx, qword ptr [rip + 0x8009158]
0x180c02ef8: mov rcx, qword ptr [rsp + 0x68]
0x180c02efd: call 0x18051df60 ; BattleTimer.EventOnEntryClick | BattleTimer.EventOnTimerPlayNPause | BattleTimer.EventOnTimerRecord | BattleTimer.EventOnTimerReset
0x180c02f02: jmp 0x180c02b80
0x180c02f07: mov rdx, qword ptr [rip + 0x8009142]
0x180c02f0e: mov rcx, qword ptr [rsp + 0x68]
0x180c02f13: call 0x18051df60 ; BattleTimer.EventOnEntryClick | BattleTimer.EventOnTimerPlayNPause | BattleTimer.EventOnTimerRecord | BattleTimer.EventOnTimerReset
0x180c02f18: mov rcx, qword ptr [rsp + 0x60]
0x180c02f1d: test rcx, rcx
0x180c02f20: jne 0x180c02ff2
0x180c02f26: xor esi, esi
0x180c02f28: mov r12d, dword ptr [rsp + 0x170]
0x180c02f30: mov r13, qword ptr [rsp + 0x58]
0x180c02f35: mov r15, qword ptr [rsp + 0x178]
0x180c02f3d: jmp 0x180c02b80
0x180c02f42: mov rdx, qword ptr [rip + 0x7f69367]
0x180c02f49: mov rcx, qword ptr [rsp + 0x78]
0x180c02f4e: call 0x18051df60 ; BattleTimer.EventOnEntryClick | BattleTimer.EventOnTimerPlayNPause | BattleTimer.EventOnTimerRecord | BattleTimer.EventOnTimerReset
0x180c02f53: jmp 0x180c02f9b
0x180c02f55: mov rdx, qword ptr [rip + 0x7f69354]
0x180c02f5c: mov rcx, qword ptr [rsp + 0x78]
0x180c02f61: call 0x18051df60 ; BattleTimer.EventOnEntryClick | BattleTimer.EventOnTimerPlayNPause | BattleTimer.EventOnTimerRecord | BattleTimer.EventOnTimerReset
0x180c02f66: mov rcx, qword ptr [rsp + 0x70]
0x180c02f6b: test rcx, rcx
0x180c02f6e: jne 0x180c02ffd
0x180c02f74: jmp 0x180c02f9b
0x180c02f76: mov qword ptr [rsp + 0x30], rsi
0x180c02f7b: mov rax, qword ptr [rsp + 0x180]
0x180c02f83: mov qword ptr [rsp + 0x28], rax
0x180c02f88: mov qword ptr [rsp + 0x20], r15
0x180c02f8d: mov r9d, r12d
0x180c02f90: mov r8, rbx
0x180c02f93: mov rdx, rdi
0x180c02f96: call 0x18348e000 ; XLua.DelegateBridge.__Gen_Delegate_Imp4044
0x180c02f9b: lea r11, [rsp + 0x130]
0x180c02fa3: mov rbx, qword ptr [r11 + 0x30]
0x180c02fa7: mov rsi, qword ptr [r11 + 0x38]
0x180c02fab: mov rsp, r11
0x180c02fae: pop r15
0x180c02fb0: pop r14
0x180c02fb2: pop r13
0x180c02fb4: pop r12
0x180c02fb6: pop rdi
0x180c02fb7: ret
0x180c02fb8: call 0x18049c3c0
0x180c02fbd: nop
0x180c02fbe: call 0x18049c3c0
0x180c02fc3: call 0x18049c3c0
0x180c02fc8: nop
0x180c02fc9: call 0x180483060
0x180c02fce: call 0x18049c3c0
0x180c02fd3: call 0x18049c3c0
0x180c02fd8: call 0x18049c3c0
0x180c02fdd: call 0x18049c3c0
0x180c02fe2: call 0x18049c3c0
0x180c02fe7: call 0x18049c3c0
0x180c02fec: call 0x18049c3c0
0x180c02ff1: nop
0x180c02ff2: call 0x180483060
0x180c02ff7: call 0x18049c3c0
0x180c02ffc: nop
0x180c02ffd: call 0x180483060
0x180c03002: int3
0x180c03003: call 0x18049c3c0
0x180c03008: int3
0x180c03009: int3
0x180c0300a: int3
0x180c0300b: int3
0x180c0300c: int3
0x180c0300d: int3
0x180c0300e: int3
0x180c0300f: int3
