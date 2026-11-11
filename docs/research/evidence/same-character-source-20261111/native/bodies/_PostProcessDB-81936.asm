0x180c2cc20: mov dword ptr [rsp + 0x18], r8d
0x180c2cc25: mov qword ptr [rsp + 0x10], rdx
0x180c2cc2a: mov qword ptr [rsp + 8], rcx
0x180c2cc2f: push rbx
0x180c2cc30: push rsi
0x180c2cc31: push rdi
0x180c2cc32: push r12
0x180c2cc34: push r13
0x180c2cc36: push r14
0x180c2cc38: push r15
0x180c2cc3a: sub rsp, 0xf0
0x180c2cc41: mov edi, r8d
0x180c2cc44: mov r12, rdx
0x180c2cc47: mov r13, rcx
0x180c2cc4a: cmp byte ptr [rip + 0x83719c3], 0
0x180c2cc51: jne 0x180c2cdae
0x180c2cc57: lea rcx, [rip + 0x803efc2]
0x180c2cc5e: call 0x18049c210
0x180c2cc63: lea rcx, [rip + 0x7f11006]
0x180c2cc6a: call 0x18049c210
0x180c2cc6f: lea rcx, [rip + 0x7eeabba]
0x180c2cc76: call 0x18049c210
0x180c2cc7b: lea rcx, [rip + 0x80008a6]
0x180c2cc82: call 0x18049c210
0x180c2cc87: lea rcx, [rip + 0x8000ae2]
0x180c2cc8e: call 0x18049c210
0x180c2cc93: lea rcx, [rip + 0x7f539c6]
0x180c2cc9a: call 0x18049c210
0x180c2cc9f: lea rcx, [rip + 0x7f5e03a]
0x180c2cca6: call 0x18049c210
0x180c2ccab: lea rcx, [rip + 0x7f5e27e]
0x180c2ccb2: call 0x18049c210
0x180c2ccb7: lea rcx, [rip + 0x7f53bf2]
0x180c2ccbe: call 0x18049c210
0x180c2ccc3: lea rcx, [rip + 0x7f5e4b6]
0x180c2ccca: call 0x18049c210
0x180c2cccf: lea rcx, [rip + 0x7f53e2a]
0x180c2ccd6: call 0x18049c210
0x180c2ccdb: lea rcx, [rip + 0x801c696]
0x180c2cce2: call 0x18049c210
0x180c2cce7: lea rcx, [rip + 0x7f5eb8a]
0x180c2ccee: call 0x18049c210
0x180c2ccf3: lea rcx, [rip + 0x7f8c436]
0x180c2ccfa: call 0x18049c210
0x180c2ccff: lea rcx, [rip + 0x7f8c67a]
0x180c2cd06: call 0x18049c210
0x180c2cd0b: lea rcx, [rip + 0x7f3337e]
0x180c2cd12: call 0x18049c210
0x180c2cd17: lea rcx, [rip + 0x7f335ba]
0x180c2cd1e: call 0x18049c210
0x180c2cd23: lea rcx, [rip + 0x7f3311e]
0x180c2cd2a: call 0x18049c210
0x180c2cd2f: lea rcx, [rip + 0x803a51a]
0x180c2cd36: call 0x18049c210
0x180c2cd3b: lea rcx, [rip + 0x7f4e39e]
0x180c2cd42: call 0x18049c210
0x180c2cd47: lea rcx, [rip + 0x7ee522a]
0x180c2cd4e: call 0x18049c210
0x180c2cd53: lea rcx, [rip + 0x7ed02c6]
0x180c2cd5a: call 0x18049c210
0x180c2cd5f: lea rcx, [rip + 0x7f4e12a]
0x180c2cd66: call 0x18049c210
0x180c2cd6b: lea rcx, [rip + 0x7f4e5be]
0x180c2cd72: call 0x18049c210
0x180c2cd77: lea rcx, [rip + 0x7f4e802]
0x180c2cd7e: call 0x18049c210
0x180c2cd83: lea rcx, [rip + 0x7f5b32e]
0x180c2cd8a: call 0x18049c210
0x180c2cd8f: lea rcx, [rip + 0x7fad63a]
0x180c2cd96: call 0x18049c210
0x180c2cd9b: lea rcx, [rip + 0x7f64e96]
0x180c2cda2: call 0x18049c210
0x180c2cda7: mov byte ptr [rip + 0x8371866], 1
0x180c2cdae: xor r15d, r15d
0x180c2cdb1: mov qword ptr [rsp + 0x30], r15
0x180c2cdb6: xorps xmm0, xmm0
0x180c2cdb9: movups xmmword ptr [rsp + 0xb8], xmm0
0x180c2cdc1: mov qword ptr [rsp + 0x60], r15
0x180c2cdc6: mov qword ptr [rsp + 0x68], r15
0x180c2cdcb: mov qword ptr [rsp + 0x58], r15
0x180c2cdd0: movups xmmword ptr [rsp + 0x98], xmm0
0x180c2cdd8: movups xmmword ptr [rsp + 0xa8], xmm0
0x180c2cde0: movups xmmword ptr [rsp + 0xc8], xmm0
0x180c2cde8: mov qword ptr [rsp + 0x70], r15
0x180c2cded: mov rax, qword ptr [rip + 0x803ee2c]
0x180c2cdf4: mov rcx, qword ptr [rax + 0xb8]
0x180c2cdfb: mov rcx, qword ptr [rcx + 8]
0x180c2cdff: test rcx, rcx
0x180c2ce02: jne 0x180c2d299
0x180c2ce08: mov rcx, qword ptr [r13 + 0x20]
0x180c2ce0c: test rcx, rcx
0x180c2ce0f: je 0x180c2d2fc
0x180c2ce15: mov r9, qword ptr [rip + 0x8000954]
0x180c2ce1c: lea r8, [rsp + 0x30]
0x180c2ce21: mov edx, edi
0x180c2ce23: call 0x185a4b410
0x180c2ce28: test al, al
0x180c2ce2a: jne 0x180c2ce76
0x180c2ce2c: mov rcx, qword ptr [rip + 0x803a41d]
0x180c2ce33: call 0x18046d2f0
0x180c2ce38: mov rbx, rax
0x180c2ce3b: test rax, rax
0x180c2ce3e: je 0x180c2d2fc
0x180c2ce44: mov rdx, qword ptr [rip + 0x7f32ffd]
0x180c2ce4b: mov rcx, rax
0x180c2ce4e: call 0x184cc8190
0x180c2ce53: mov qword ptr [rsp + 0x30], rbx
0x180c2ce58: mov rcx, qword ptr [r13 + 0x20]
0x180c2ce5c: test rcx, rcx
0x180c2ce5f: je 0x180c2d2fc
0x180c2ce65: mov r9, qword ptr [rip + 0x80006bc]
0x180c2ce6c: mov r8, rbx
0x180c2ce6f: mov edx, edi
0x180c2ce71: call 0x185a3de80
0x180c2ce76: test r12, r12
0x180c2ce79: je 0x180c2d2fc
0x180c2ce7f: mov r8, qword ptr [rip + 0x7ee50f2]
0x180c2ce86: mov rdx, r12
0x180c2ce89: lea rcx, [rsp + 0x38]
0x180c2ce8e: call 0x184ce30d0
0x180c2ce93: movups xmm0, xmmword ptr [rsp + 0x38]
0x180c2ce98: movups xmmword ptr [rsp + 0x78], xmm0
0x180c2ce9d: movups xmm1, xmmword ptr [rsp + 0x48]
0x180c2cea2: movups xmmword ptr [rsp + 0x88], xmm1
0x180c2ceaa: mov qword ptr [rsp + 0x38], r15
0x180c2ceaf: lea rbx, [rsp + 0x78]
0x180c2ceb4: mov qword ptr [rsp + 0x40], rbx
0x180c2ceb9: nop dword ptr [rax]
0x180c2cec0: mov rdx, qword ptr [rip + 0x7f5e069]
0x180c2cec7: lea rcx, [rsp + 0x78]
0x180c2cecc: call 0x185cb62d0
0x180c2ced1: test al, al
0x180c2ced3: je 0x180c2d057
0x180c2ced9: movups xmm0, xmmword ptr [rsp + 0x88]
0x180c2cee1: movups xmmword ptr [rsp + 0xb8], xmm0
0x180c2cee9: mov r9, qword ptr [rip + 0x7f8c240]
0x180c2cef0: lea r8, [rsp + 0x68]
0x180c2cef5: lea rdx, [rsp + 0x60]
0x180c2cefa: lea rcx, [rsp + 0xb8]
0x180c2cf02: call 0x184c8c100
0x180c2cf07: mov rsi, qword ptr [rsp + 0x60]
0x180c2cf0c: mov rdi, qword ptr [rsp + 0x68]
0x180c2cf11: test rdi, rdi
0x180c2cf14: je 0x180c2d2d9
0x180c2cf1a: cmp qword ptr [rdi + 0x38], 0
0x180c2cf1f: je 0x180c2d014
0x180c2cf25: mov rcx, qword ptr [rdi + 0x38]
0x180c2cf29: xor edx, edx
0x180c2cf2b: mov rcx, qword ptr [rcx + 0x10]
0x180c2cf2f: call 0x18601a180 ; System.String.IsNullOrEmpty
0x180c2cf34: test al, al
0x180c2cf36: jne 0x180c2d014
0x180c2cf3c: cmp byte ptr [rdi + 0x20], al
0x180c2cf3f: jne 0x180c2cec0
0x180c2cf45: mov rax, qword ptr [rdi + 0x38]
0x180c2cf49: test rax, rax
0x180c2cf4c: je 0x180c2d2d4
0x180c2cf52: mov rsi, qword ptr [rax + 0x10]
0x180c2cf56: mov r14d, dword ptr [rdi + 0x28]
0x180c2cf5a: mov rcx, qword ptr [rip + 0x801c417]
0x180c2cf61: cmp dword ptr [rcx + 0xe0], 0
0x180c2cf68: jne 0x180c2cf6f
0x180c2cf6a: call 0x18049c450
0x180c2cf6f: xor r8d, r8d
0x180c2cf72: mov edx, r14d
0x180c2cf75: mov rcx, rsi
0x180c2cf78: call 0x1869822c0 ; Torappu.HGString.Concat
0x180c2cf7d: mov r14, rax
0x180c2cf80: mov rcx, qword ptr [rsp + 0x30]
0x180c2cf85: test rcx, rcx
0x180c2cf88: je 0x180c2d2cf
0x180c2cf8e: mov r9, qword ptr [rip + 0x7f33343]
0x180c2cf95: lea r8, [rsp + 0x58]
0x180c2cf9a: mov rdx, rax
0x180c2cf9d: call 0x184cc65f0
0x180c2cfa2: test al, al
0x180c2cfa4: jne 0x180c2cff2
0x180c2cfa6: mov rcx, qword ptr [rip + 0x7f5b10b]
0x180c2cfad: call 0x18046d2f0
0x180c2cfb2: mov rsi, rax
0x180c2cfb5: test rax, rax
0x180c2cfb8: je 0x180c2d2c5
0x180c2cfbe: mov rdx, qword ptr [rip + 0x7f4decb]
0x180c2cfc5: mov rcx, rax
0x180c2cfc8: call 0x184b06b30
0x180c2cfcd: mov qword ptr [rsp + 0x58], rsi
0x180c2cfd2: mov rcx, qword ptr [rsp + 0x30]
0x180c2cfd7: test rcx, rcx
0x180c2cfda: je 0x180c2d2bf
0x180c2cfe0: mov r9, qword ptr [rip + 0x7f330a9]
0x180c2cfe7: mov r8, rsi
0x180c2cfea: mov rdx, r14
0x180c2cfed: call 0x184cbd830
0x180c2cff2: mov rcx, qword ptr [rsp + 0x58]
0x180c2cff7: test rcx, rcx
0x180c2cffa: je 0x180c2d2ca
0x180c2d000: mov r8, qword ptr [rip + 0x7f4e0d9]
0x180c2d007: mov rdx, rdi
0x180c2d00a: call 0x1805182d0
0x180c2d00f: jmp 0x180c2cec0
0x180c2d014: xor r9d, r9d
0x180c2d017: mov r8, qword ptr [rip + 0x7f64c1a]
0x180c2d01e: mov rdx, rsi
0x180c2d021: mov rcx, qword ptr [rip + 0x7fad3a8]
0x180c2d028: call 0x1860144e0 ; System.String.Concat
0x180c2d02d: mov rdi, rax
0x180c2d030: mov rcx, qword ptr [rip + 0x7eea7f9]
0x180c2d037: cmp dword ptr [rcx + 0xe0], 0
0x180c2d03e: jne 0x180c2d045
0x180c2d040: call 0x18049c450
0x180c2d045: xor r8d, r8d
0x180c2d048: mov rdx, rdi
0x180c2d04b: mov cl, 0x41
0x180c2d04d: call 0x18693d9b0 ; UnityEngine.DLog.LogError
0x180c2d052: jmp 0x180c2cec0
0x180c2d057: mov rdx, qword ptr [rip + 0x7f5dc82]
0x180c2d05e: mov rcx, rbx
0x180c2d061: call 0x18051df60 ; BattleTimer.EventOnEntryClick | BattleTimer.EventOnTimerPlayNPause | BattleTimer.EventOnTimerRecord | BattleTimer.EventOnTimerReset
0x180c2d066: jmp 0x180c2d09a
0x180c2d068: mov rdx, qword ptr [rip + 0x7f5dc71]
0x180c2d06f: mov rcx, qword ptr [rsp + 0x40]
0x180c2d074: call 0x18051df60 ; BattleTimer.EventOnEntryClick | BattleTimer.EventOnTimerPlayNPause | BattleTimer.EventOnTimerRecord | BattleTimer.EventOnTimerReset
0x180c2d079: mov rcx, qword ptr [rsp + 0x38]
0x180c2d07e: test rcx, rcx
0x180c2d081: jne 0x180c2d2df
0x180c2d087: xor r15d, r15d
0x180c2d08a: mov r12, qword ptr [rsp + 0x138]
0x180c2d092: mov r13, qword ptr [rsp + 0x130]
0x180c2d09a: mov rdx, qword ptr [rsp + 0x30]
0x180c2d09f: test rdx, rdx
0x180c2d0a2: je 0x180c2d2fc
0x180c2d0a8: mov r8, qword ptr [rip + 0x7ecff71]
0x180c2d0af: lea rcx, [rsp + 0x38]
0x180c2d0b4: call 0x184ce30d0
0x180c2d0b9: movups xmm0, xmmword ptr [rsp + 0x38]
0x180c2d0be: movups xmmword ptr [rsp + 0x98], xmm0
0x180c2d0c6: movups xmm1, xmmword ptr [rsp + 0x48]
0x180c2d0cb: movups xmmword ptr [rsp + 0xa8], xmm1
0x180c2d0d3: mov qword ptr [rsp + 0x38], r15
0x180c2d0d8: lea rbx, [rsp + 0x98]
0x180c2d0e0: mov qword ptr [rsp + 0x40], rbx
0x180c2d0e5: nop word ptr [rax + rax]
0x180c2d0f0: mov rdx, qword ptr [rip + 0x7f537b9]
0x180c2d0f7: lea rcx, [rsp + 0x98]
0x180c2d0ff: call 0x185cb62d0
0x180c2d104: test al, al
0x180c2d106: je 0x180c2d17e
0x180c2d108: movups xmm0, xmmword ptr [rsp + 0xa8]
0x180c2d110: movups xmmword ptr [rsp + 0xc8], xmm0
0x180c2d118: mov r9, qword ptr [rip + 0x7f5e759]
0x180c2d11f: lea r8, [rsp + 0x70]
0x180c2d124: lea rdx, [rsp + 0x60]
0x180c2d129: lea rcx, [rsp + 0xc8]
0x180c2d131: call 0x184c8c100
0x180c2d136: mov rsi, qword ptr [rsp + 0x70]
0x180c2d13b: test rsi, rsi
0x180c2d13e: je 0x180c2d2ea
0x180c2d144: cmp dword ptr [rsi + 0x18], 1
0x180c2d148: jle 0x180c2d0f0
0x180c2d14a: mov edi, r15d
0x180c2d14d: nop dword ptr [rax]
0x180c2d150: cmp edi, dword ptr [rsi + 0x18]
0x180c2d153: jge 0x180c2d0f0
0x180c2d155: cmp edi, 3
0x180c2d158: jge 0x180c2d0f0
0x180c2d15a: mov r8, qword ptr [rip + 0x7f4e41f]
0x180c2d161: mov edx, edi
0x180c2d163: mov rcx, rsi
0x180c2d166: call 0x184d27b00
0x180c2d16b: test rax, rax
0x180c2d16e: je 0x180c2d2e5
0x180c2d174: lea ecx, [rdi + 1]
0x180c2d177: mov dword ptr [rax + 0x60], ecx
0x180c2d17a: inc edi
0x180c2d17c: jmp 0x180c2d150
0x180c2d17e: mov rdx, qword ptr [rip + 0x7f534db]
0x180c2d185: mov rcx, rbx
0x180c2d188: call 0x18051df60 ; BattleTimer.EventOnEntryClick | BattleTimer.EventOnTimerPlayNPause | BattleTimer.EventOnTimerRecord | BattleTimer.EventOnTimerReset
0x180c2d18d: jmp 0x180c2d1c1
0x180c2d18f: mov rdx, qword ptr [rip + 0x7f534ca]
0x180c2d196: mov rcx, qword ptr [rsp + 0x40]
0x180c2d19b: call 0x18051df60 ; BattleTimer.EventOnEntryClick | BattleTimer.EventOnTimerPlayNPause | BattleTimer.EventOnTimerRecord | BattleTimer.EventOnTimerReset
0x180c2d1a0: mov rcx, qword ptr [rsp + 0x38]
0x180c2d1a5: test rcx, rcx
0x180c2d1a8: jne 0x180c2d2f0
0x180c2d1ae: xor r15d, r15d
0x180c2d1b1: mov r12, qword ptr [rsp + 0x138]
0x180c2d1b9: mov r13, qword ptr [rsp + 0x130]
0x180c2d1c1: xor ecx, ecx
0x180c2d1c3: call 0x180b5c290 ; Torappu.Battle.DataCenter.AutoChessDataCenter.get_instanceOrNull
0x180c2d1c8: test rax, rax
0x180c2d1cb: je 0x180c2d2fc
0x180c2d1d1: xor edx, edx
0x180c2d1d3: mov rcx, rax
0x180c2d1d6: call 0x180b5cde0 ; Torappu.Battle.DataCenter.AutoChessDataCenter.get_selfPlayerIndex
0x180c2d1db: cmp eax, dword ptr [rsp + 0x140]
0x180c2d1e2: jne 0x180c2d2ac
0x180c2d1e8: mov rdx, qword ptr [rip + 0x7f10a81]
0x180c2d1ef: mov rcx, qword ptr [r13 + 0x28]
0x180c2d1f3: call 0x184696030
0x180c2d1f8: test al, al
0x180c2d1fa: je 0x180c2d2ac
0x180c2d200: mov r8, qword ptr [rip + 0x7ee4d71]
0x180c2d207: mov rdx, r12
0x180c2d20a: lea rcx, [rsp + 0x38]
0x180c2d20f: call 0x184ce30d0
0x180c2d214: movups xmm0, xmmword ptr [rsp + 0x38]
0x180c2d219: movups xmmword ptr [rsp + 0x78], xmm0
0x180c2d21e: movups xmm1, xmmword ptr [rsp + 0x48]
0x180c2d223: movups xmmword ptr [rsp + 0x88], xmm1
0x180c2d22b: mov qword ptr [rsp + 0x38], r15
0x180c2d230: lea rbx, [rsp + 0x78]
0x180c2d235: mov qword ptr [rsp + 0x40], rbx
0x180c2d23a: nop word ptr [rax + rax]
0x180c2d240: mov rdx, qword ptr [rip + 0x7f5dce9]
0x180c2d247: lea rcx, [rsp + 0x78]
0x180c2d24c: call 0x185cb62d0
0x180c2d251: test al, al
0x180c2d253: je 0x180c2d26b
0x180c2d255: lea rcx, [r13 + 0x28]
0x180c2d259: xor r8d, r8d
0x180c2d25c: mov rdx, qword ptr [rsp + 0x90]
0x180c2d264: call 0x180c1d4c0 ; Torappu.Battle.AutoChess.AutoChessBattleUtil.CollectPoolConfig
0x180c2d269: jmp 0x180c2d240
0x180c2d26b: mov rdx, qword ptr [rip + 0x7f5da6e]
0x180c2d272: mov rcx, rbx
0x180c2d275: call 0x18051df60 ; BattleTimer.EventOnEntryClick | BattleTimer.EventOnTimerPlayNPause | BattleTimer.EventOnTimerRecord | BattleTimer.EventOnTimerReset
0x180c2d27a: jmp 0x180c2d2ac
0x180c2d27c: mov rdx, qword ptr [rip + 0x7f5da5d]
0x180c2d283: mov rcx, qword ptr [rsp + 0x40]
0x180c2d288: call 0x18051df60 ; BattleTimer.EventOnEntryClick | BattleTimer.EventOnTimerPlayNPause | BattleTimer.EventOnTimerRecord | BattleTimer.EventOnTimerReset
0x180c2d28d: mov rcx, qword ptr [rsp + 0x38]
0x180c2d292: test rcx, rcx
0x180c2d295: jne 0x180c2d2f6
0x180c2d297: jmp 0x180c2d2ac
0x180c2d299: mov qword ptr [rsp + 0x20], r15
0x180c2d29e: mov r9d, edi
0x180c2d2a1: mov r8, r12
0x180c2d2a4: mov rdx, r13
0x180c2d2a7: call 0x183343db0 ; XLua.DelegateBridge.__Gen_Delegate_Imp192
0x180c2d2ac: add rsp, 0xf0
0x180c2d2b3: pop r15
0x180c2d2b5: pop r14
0x180c2d2b7: pop r13
0x180c2d2b9: pop r12
0x180c2d2bb: pop rdi
0x180c2d2bc: pop rsi
0x180c2d2bd: pop rbx
0x180c2d2be: ret
0x180c2d2bf: call 0x18049c3c0
0x180c2d2c4: nop
0x180c2d2c5: call 0x18049c3c0
0x180c2d2ca: call 0x18049c3c0
0x180c2d2cf: call 0x18049c3c0
0x180c2d2d4: call 0x18049c3c0
0x180c2d2d9: call 0x18049c3c0
0x180c2d2de: nop
0x180c2d2df: call 0x180483060
0x180c2d2e4: nop
0x180c2d2e5: call 0x18049c3c0
0x180c2d2ea: call 0x18049c3c0
0x180c2d2ef: nop
0x180c2d2f0: call 0x180483060
0x180c2d2f5: int3
0x180c2d2f6: call 0x180483060
0x180c2d2fb: int3
0x180c2d2fc: call 0x18049c3c0
0x180c2d301: int3
0x180c2d302: int3
0x180c2d303: int3
0x180c2d304: int3
0x180c2d305: int3
0x180c2d306: int3
0x180c2d307: int3
0x180c2d308: int3
0x180c2d309: int3
0x180c2d30a: int3
0x180c2d30b: int3
0x180c2d30c: int3
0x180c2d30d: int3
0x180c2d30e: int3
0x180c2d30f: int3
