0x180b77b10: mov qword ptr [rsp + 0x18], r8
0x180b77b15: mov qword ptr [rsp + 0x10], rdx
0x180b77b1a: mov qword ptr [rsp + 8], rcx
0x180b77b1f: push rbx
0x180b77b20: push rsi
0x180b77b21: push rdi
0x180b77b22: push r12
0x180b77b24: push r13
0x180b77b26: push r14
0x180b77b28: push r15
0x180b77b2a: sub rsp, 0xa0
0x180b77b31: mov rsi, r8
0x180b77b34: mov r14, rdx
0x180b77b37: mov r15, rcx
0x180b77b3a: cmp byte ptr [rip + 0x842657d], 0
0x180b77b41: jne 0x180b77c02
0x180b77b47: lea rcx, [rip + 0x80cd6ca]
0x180b77b4e: call 0x18049c210
0x180b77b53: lea rcx, [rip + 0x8055eae]
0x180b77b5a: call 0x18049c210
0x180b77b5f: lea rcx, [rip + 0x7f9fcca]
0x180b77b66: call 0x18049c210
0x180b77b6b: lea rcx, [rip + 0x809100e]
0x180b77b72: call 0x18049c210
0x180b77b77: lea rcx, [rip + 0x80a7f4a]
0x180b77b7e: call 0x18049c210
0x180b77b83: lea rcx, [rip + 0x809123e]
0x180b77b8a: call 0x18049c210
0x180b77b8f: lea rcx, [rip + 0x80a8172]
0x180b77b96: call 0x18049c210
0x180b77b9b: lea rcx, [rip + 0x80a83ae]
0x180b77ba2: call 0x18049c210
0x180b77ba7: lea rcx, [rip + 0x809146a]
0x180b77bae: call 0x18049c210
0x180b77bb3: lea rcx, [rip + 0x803b8a6]
0x180b77bba: call 0x18049c210
0x180b77bbf: lea rcx, [rip + 0x7fe7d32]
0x180b77bc6: call 0x18049c210
0x180b77bcb: lea rcx, [rip + 0x8080306]
0x180b77bd2: call 0x18049c210
0x180b77bd7: lea rcx, [rip + 0x7fe7f62]
0x180b77bde: call 0x18049c210
0x180b77be3: lea rcx, [rip + 0x808053e]
0x180b77bea: call 0x18049c210
0x180b77bef: lea rcx, [rip + 0x8082b1a]
0x180b77bf6: call 0x18049c210
0x180b77bfb: mov byte ptr [rip + 0x84264bc], 1
0x180b77c02: xorps xmm0, xmm0
0x180b77c05: xor eax, eax
0x180b77c07: movups xmmword ptr [rsp + 0x70], xmm0
0x180b77c0c: mov qword ptr [rsp + 0x80], rax
0x180b77c14: xorps xmm1, xmm1
0x180b77c17: movups xmmword ptr [rsp + 0x58], xmm1
0x180b77c1c: mov qword ptr [rsp + 0x68], rax
0x180b77c21: mov rax, qword ptr [rip + 0x80cd5f0]
0x180b77c28: mov rcx, qword ptr [rax + 0xb8]
0x180b77c2f: mov rcx, qword ptr [rcx + 0x1f8]
0x180b77c36: test rcx, rcx
0x180b77c39: jne 0x180b78026
0x180b77c3f: xor edx, edx
0x180b77c41: mov rcx, rsi
0x180b77c44: call 0x18601a180 ; System.String.IsNullOrEmpty
0x180b77c49: test al, al
0x180b77c4b: jne 0x180b77ff9
0x180b77c51: xor edi, edi
0x180b77c53: mov dword ptr [rsp + 0x30], edi
0x180b77c57: xor r8d, r8d
0x180b77c5a: mov rdx, rsi
0x180b77c5d: lea rcx, [rsp + 0x38]
0x180b77c62: call 0x180c1f080 ; Torappu.Battle.AutoChess.AutoChessBattleUtil.GetChessBasicInfo
0x180b77c67: movups xmm1, xmmword ptr [rax]
0x180b77c6a: movups xmm0, xmmword ptr [rax + 0x10]
0x180b77c6e: movups xmmword ptr [rsp + 0x48], xmm0
0x180b77c73: mov r13d, dword ptr [r15 + 0x10]
0x180b77c77: lea eax, [r13 + 1]
0x180b77c7b: mov dword ptr [r15 + 0x10], eax
0x180b77c7f: mov dword ptr [rsp + 0x34], r13d
0x180b77c84: psrldq xmm1, 8
0x180b77c89: movq qword ptr [rsp + 0x38], xmm1
0x180b77c8f: movq rcx, xmm1
0x180b77c94: shr rcx, 0x20
0x180b77c98: test ecx, ecx
0x180b77c9a: je 0x180b77e6e
0x180b77ca0: sub ecx, 1
0x180b77ca3: je 0x180b77d11
0x180b77ca5: cmp ecx, 1
0x180b77ca8: jne 0x180b77fcc
0x180b77cae: test r14, r14
0x180b77cb1: je 0x180b78068
0x180b77cb7: mov rdi, qword ptr [r14 + 0x20]
0x180b77cbb: mov rcx, qword ptr [rip + 0x803b79e]
0x180b77cc2: call 0x18046d2f0
0x180b77cc7: mov rbx, rax
0x180b77cca: test rax, rax
0x180b77ccd: je 0x180b78068
0x180b77cd3: xor edx, edx
0x180b77cd5: mov rcx, rax
0x180b77cd8: call 0x18051df60 ; BattleTimer.EventOnEntryClick | BattleTimer.EventOnTimerPlayNPause | BattleTimer.EventOnTimerRecord | BattleTimer.EventOnTimerReset
0x180b77cdd: mov dword ptr [rbx + 0x10], r13d
0x180b77ce1: mov qword ptr [rbx + 0x18], rsi
0x180b77ce5: lea rcx, [rbx + 0x18]
0x180b77ce9: mov rdx, rsi
0x180b77cec: call 0x18049bcf0
0x180b77cf1: test rdi, rdi
0x180b77cf4: je 0x180b78068
0x180b77cfa: mov r8, qword ptr [rip + 0x80801d7]
0x180b77d01: mov rdx, rbx
0x180b77d04: mov rcx, rdi
0x180b77d07: call 0x1805182d0
0x180b77d0c: jmp 0x180b77fcc
0x180b77d11: test r14, r14
0x180b77d14: je 0x180b78068
0x180b77d1a: mov r12, qword ptr [r14 + 0x18]
0x180b77d1e: mov rcx, qword ptr [rip + 0x803b73b]
0x180b77d25: call 0x18046d2f0
0x180b77d2a: mov rbx, rax
0x180b77d2d: test rax, rax
0x180b77d30: je 0x180b78068
0x180b77d36: xor edx, edx
0x180b77d38: mov rcx, rax
0x180b77d3b: call 0x18051df60 ; BattleTimer.EventOnEntryClick | BattleTimer.EventOnTimerPlayNPause | BattleTimer.EventOnTimerRecord | BattleTimer.EventOnTimerReset
0x180b77d40: mov dword ptr [rbx + 0x10], r13d
0x180b77d44: mov qword ptr [rbx + 0x18], rsi
0x180b77d48: lea rcx, [rbx + 0x18]
0x180b77d4c: mov rdx, rsi
0x180b77d4f: call 0x18049bcf0
0x180b77d54: test r12, r12
0x180b77d57: je 0x180b78068
0x180b77d5d: mov r8, qword ptr [rip + 0x8080174]
0x180b77d64: mov rdx, rbx
0x180b77d67: mov rcx, r12
0x180b77d6a: call 0x1805182d0
0x180b77d6f: cmp byte ptr [rsp + 0x38], dil
0x180b77d74: jne 0x180b77fcc
0x180b77d7a: mov rdx, qword ptr [r14 + 0x18]
0x180b77d7e: test rdx, rdx
0x180b77d81: je 0x180b78068
0x180b77d87: mov r8, qword ptr [rip + 0x808039a]
0x180b77d8e: lea rcx, [rsp + 0x38]
0x180b77d93: call 0x184d19f20
0x180b77d98: movups xmm0, xmmword ptr [rsp + 0x38]
0x180b77d9d: movups xmmword ptr [rsp + 0x58], xmm0
0x180b77da2: movsd xmm1, qword ptr [rsp + 0x48]
0x180b77da8: movsd qword ptr [rsp + 0x68], xmm1
0x180b77dae: mov qword ptr [rsp + 0x38], rdi
0x180b77db3: lea rbx, [rsp + 0x58]
0x180b77db8: mov qword ptr [rsp + 0x40], rbx
0x180b77dbd: nop dword ptr [rax]
0x180b77dc0: mov rdx, qword ptr [rip + 0x80a7f41]
0x180b77dc7: lea rcx, [rsp + 0x58]
0x180b77dcc: call 0x185cc82d0
0x180b77dd1: test al, al
0x180b77dd3: je 0x180b77dfe
0x180b77dd5: mov rcx, qword ptr [rsp + 0x68]
0x180b77dda: test rcx, rcx
0x180b77ddd: je 0x180b78050
0x180b77de3: xor r8d, r8d
0x180b77de6: mov rdx, rsi
0x180b77de9: mov rcx, qword ptr [rcx + 0x18]
0x180b77ded: call 0x186017430 ; System.String.Equals | System.String.op_Equality
0x180b77df2: test al, al
0x180b77df4: je 0x180b77dc0
0x180b77df6: inc edi
0x180b77df8: mov dword ptr [rsp + 0x30], edi
0x180b77dfc: jmp 0x180b77dc0
0x180b77dfe: mov rdx, qword ptr [rip + 0x80a7cc3]
0x180b77e05: mov rcx, rbx
0x180b77e08: call 0x18051df60 ; BattleTimer.EventOnEntryClick | BattleTimer.EventOnTimerPlayNPause | BattleTimer.EventOnTimerRecord | BattleTimer.EventOnTimerReset
0x180b77e0d: jmp 0x180b77e4f
0x180b77e0f: mov rdx, qword ptr [rip + 0x80a7cb2]
0x180b77e16: mov rcx, qword ptr [rsp + 0x40]
0x180b77e1b: call 0x18051df60 ; BattleTimer.EventOnEntryClick | BattleTimer.EventOnTimerPlayNPause | BattleTimer.EventOnTimerRecord | BattleTimer.EventOnTimerReset
0x180b77e20: mov rcx, qword ptr [rsp + 0x38]
0x180b77e25: test rcx, rcx
0x180b77e28: jne 0x180b78056
0x180b77e2e: mov rsi, qword ptr [rsp + 0xf0]
0x180b77e36: mov r14, qword ptr [rsp + 0xe8]
0x180b77e3e: mov r15, qword ptr [rsp + 0xe0]
0x180b77e46: mov edi, dword ptr [rsp + 0x30]
0x180b77e4a: mov r13d, dword ptr [rsp + 0x34]
0x180b77e4f: cmp edi, 2
0x180b77e52: jl 0x180b77fcc
0x180b77e58: xor r9d, r9d
0x180b77e5b: mov r8, rsi
0x180b77e5e: mov rdx, r14
0x180b77e61: mov rcx, r15
0x180b77e64: call 0x180b78550 ; Torappu.Battle.AutoChess.AutoChessDataBridgeLocalPlayer._BonusWhenOwnedEquipChess
0x180b77e69: jmp 0x180b77fcc
0x180b77e6e: test r14, r14
0x180b77e71: je 0x180b78068
0x180b77e77: mov r12, qword ptr [r14 + 0x10]
0x180b77e7b: mov rcx, qword ptr [rip + 0x8055b86]
0x180b77e82: call 0x18046d2f0
0x180b77e87: mov rbx, rax
0x180b77e8a: test rax, rax
0x180b77e8d: je 0x180b78068
0x180b77e93: xor edx, edx
0x180b77e95: mov rcx, rax
0x180b77e98: call 0x180b86970 ; Torappu.Battle.AutoChess.CharChess..ctor
0x180b77e9d: mov dword ptr [rbx + 0x10], r13d
0x180b77ea1: mov qword ptr [rbx + 0x20], rsi
0x180b77ea5: lea rcx, [rbx + 0x20]
0x180b77ea9: mov rdx, rsi
0x180b77eac: call 0x18049bcf0
0x180b77eb1: mov dword ptr [rbx + 0x2c], 1
0x180b77eb8: test r12, r12
0x180b77ebb: je 0x180b78068
0x180b77ec1: mov r8, qword ptr [rip + 0x7fe7a30]
0x180b77ec8: mov rdx, rbx
0x180b77ecb: mov rcx, r12
0x180b77ece: call 0x1805182d0
0x180b77ed3: cmp byte ptr [rsp + 0x38], dil
0x180b77ed8: jne 0x180b77fcc
0x180b77ede: mov rdx, qword ptr [r14 + 0x10]
0x180b77ee2: test rdx, rdx
0x180b77ee5: je 0x180b78068
0x180b77eeb: mov r8, qword ptr [rip + 0x7fe7c4e]
0x180b77ef2: lea rcx, [rsp + 0x38]
0x180b77ef7: call 0x184d19f20
0x180b77efc: movups xmm0, xmmword ptr [rsp + 0x38]
0x180b77f01: movups xmmword ptr [rsp + 0x70], xmm0
0x180b77f06: movsd xmm1, qword ptr [rsp + 0x48]
0x180b77f0c: movsd qword ptr [rsp + 0x80], xmm1
0x180b77f15: mov qword ptr [rsp + 0x38], rdi
0x180b77f1a: lea rbx, [rsp + 0x70]
0x180b77f1f: mov qword ptr [rsp + 0x40], rbx
0x180b77f24: mov rdx, qword ptr [rip + 0x8090e9d]
0x180b77f2b: lea rcx, [rsp + 0x70]
0x180b77f30: call 0x185cc82d0
0x180b77f35: test al, al
0x180b77f37: je 0x180b77f65
0x180b77f39: mov rcx, qword ptr [rsp + 0x80]
0x180b77f41: test rcx, rcx
0x180b77f44: je 0x180b7805c
0x180b77f4a: xor r8d, r8d
0x180b77f4d: mov rdx, rsi
0x180b77f50: mov rcx, qword ptr [rcx + 0x20]
0x180b77f54: call 0x186017430 ; System.String.Equals | System.String.op_Equality
0x180b77f59: test al, al
0x180b77f5b: je 0x180b77f24
0x180b77f5d: inc edi
0x180b77f5f: mov dword ptr [rsp + 0x30], edi
0x180b77f63: jmp 0x180b77f24
0x180b77f65: mov rdx, qword ptr [rip + 0x8090c14]
0x180b77f6c: mov rcx, rbx
0x180b77f6f: call 0x18051df60 ; BattleTimer.EventOnEntryClick | BattleTimer.EventOnTimerPlayNPause | BattleTimer.EventOnTimerRecord | BattleTimer.EventOnTimerReset
0x180b77f74: jmp 0x180b77fb6
0x180b77f76: mov rdx, qword ptr [rip + 0x8090c03]
0x180b77f7d: mov rcx, qword ptr [rsp + 0x40]
0x180b77f82: call 0x18051df60 ; BattleTimer.EventOnEntryClick | BattleTimer.EventOnTimerPlayNPause | BattleTimer.EventOnTimerRecord | BattleTimer.EventOnTimerReset
0x180b77f87: mov rcx, qword ptr [rsp + 0x38]
0x180b77f8c: test rcx, rcx
0x180b77f8f: jne 0x180b78062
0x180b77f95: mov rsi, qword ptr [rsp + 0xf0]
0x180b77f9d: mov r14, qword ptr [rsp + 0xe8]
0x180b77fa5: mov r15, qword ptr [rsp + 0xe0]
0x180b77fad: mov edi, dword ptr [rsp + 0x30]
0x180b77fb1: mov r13d, dword ptr [rsp + 0x34]
0x180b77fb6: cmp edi, 3
0x180b77fb9: jl 0x180b77fcc
0x180b77fbb: xor r9d, r9d
0x180b77fbe: mov r8, rsi
0x180b77fc1: mov rdx, r14
0x180b77fc4: mov rcx, r15
0x180b77fc7: call 0x180b78070 ; Torappu.Battle.AutoChess.AutoChessDataBridgeLocalPlayer._BonusWhenOwnedCharChess
0x180b77fcc: mov rcx, qword ptr [r15 + 0x20]
0x180b77fd0: test rcx, rcx
0x180b77fd3: je 0x180b78068
0x180b77fd9: mov qword ptr [rsp + 0x28], 0
0x180b77fe2: mov byte ptr [rsp + 0x20], 0
0x180b77fe7: mov r9d, r13d
0x180b77fea: mov r8, rsi
0x180b77fed: xor edx, edx
0x180b77fef: call 0x180b87d90 ; Torappu.Battle.AutoChess.AutoChessDataBridgeLocalPlayer/MockGarrisonEffectManager.TriggerEffect
0x180b77ff4: mov eax, r13d
0x180b77ff7: jmp 0x180b7803d
0x180b77ff9: mov rcx, qword ptr [rip + 0x7f9f830]
0x180b78000: cmp dword ptr [rcx + 0xe0], 0
0x180b78007: jne 0x180b7800e
0x180b78009: call 0x18049c450
0x180b7800e: xor r8d, r8d
0x180b78011: mov rdx, qword ptr [rip + 0x80826f8]
0x180b78018: mov cl, 0x41
0x180b7801a: call 0x18693d9b0 ; UnityEngine.DLog.LogError
0x180b7801f: mov eax, 0xffffffff
0x180b78024: jmp 0x180b7803d
0x180b78026: mov qword ptr [rsp + 0x20], 0
0x180b7802f: mov r9, rsi
0x180b78032: mov r8, r14
0x180b78035: mov rdx, r15
0x180b78038: call 0x18337d0c0 ; XLua.DelegateBridge.__Gen_Delegate_Imp229
0x180b7803d: add rsp, 0xa0
0x180b78044: pop r15
0x180b78046: pop r14
0x180b78048: pop r13
0x180b7804a: pop r12
0x180b7804c: pop rdi
0x180b7804d: pop rsi
0x180b7804e: pop rbx
0x180b7804f: ret
0x180b78050: call 0x18049c3c0
0x180b78055: nop
0x180b78056: call 0x180483060
0x180b7805b: nop
0x180b7805c: call 0x18049c3c0
0x180b78061: nop
0x180b78062: call 0x180483060
0x180b78067: int3
0x180b78068: call 0x18049c3c0
0x180b7806d: int3
0x180b7806e: int3
0x180b7806f: int3
