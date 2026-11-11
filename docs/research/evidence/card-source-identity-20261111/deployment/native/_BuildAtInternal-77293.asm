0x180aaaaf0: mov rax, rsp
0x180aaaaf3: mov qword ptr [rax + 0x10], rdx
0x180aaaaf7: mov qword ptr [rax + 8], rcx
0x180aaaafb: push rbx
0x180aaaafc: push rsi
0x180aaaafd: push rdi
0x180aaaafe: push r14
0x180aaab00: push r15
0x180aaab02: sub rsp, 0x130
0x180aaab09: movaps xmmword ptr [rax - 0x38], xmm6
0x180aaab0d: movaps xmmword ptr [rax - 0x48], xmm7
0x180aaab11: mov rbx, rdx
0x180aaab14: mov rdi, rcx
0x180aaab17: cmp byte ptr [rip + 0x84f2c1c], 0
0x180aaab1e: jne 0x180aaab6f
0x180aaab20: lea rcx, [rip + 0x8065119]
0x180aaab27: call 0x18049c210
0x180aaab2c: lea rcx, [rip + 0x812caed]
0x180aaab33: call 0x18049c210
0x180aaab38: lea rcx, [rip + 0x8083ac9]
0x180aaab3f: call 0x18049c210
0x180aaab44: lea rcx, [rip + 0x8083d05]
0x180aaab4b: call 0x18049c210
0x180aaab50: lea rcx, [rip + 0x80754f9]
0x180aaab57: call 0x18049c210
0x180aaab5c: lea rcx, [rip + 0x807a4c5]
0x180aaab63: call 0x18049c210
0x180aaab68: mov byte ptr [rip + 0x84f2bcb], 1
0x180aaab6f: mov rax, qword ptr [rip + 0x812caaa]
0x180aaab76: cmp dword ptr [rax + 0xe0], 0
0x180aaab7d: jne 0x180aaab8e
0x180aaab7f: mov rcx, rax
0x180aaab82: call 0x18049c450
0x180aaab87: mov rax, qword ptr [rip + 0x812ca92]
0x180aaab8e: mov rax, qword ptr [rax + 0xb8]
0x180aaab95: mov rcx, qword ptr [rax + 0x550]
0x180aaab9c: test rcx, rcx
0x180aaab9f: jne 0x180aab0b1
0x180aaaba5: movups xmm6, xmmword ptr [rbx + 0x30]
0x180aaaba9: movups xmm0, xmmword ptr [rbx + 0x40]
0x180aaabad: movaps xmmword ptr [rsp + 0xa0], xmm0
0x180aaabb5: movsd xmm1, qword ptr [rbx + 0x50]
0x180aaabba: movsd qword ptr [rsp + 0xb0], xmm1
0x180aaabc3: movaps xmmword ptr [rsp + 0x90], xmm6
0x180aaabcb: movups xmm1, xmm0
0x180aaabce: movaps xmmword ptr [rsp + 0xa0], xmm0
0x180aaabd6: movsd xmm0, qword ptr [rbx + 0x50]
0x180aaabdb: movsd qword ptr [rsp + 0xb0], xmm0
0x180aaabe4: mov rdx, qword ptr [rbx]
0x180aaabe7: mov qword ptr [rsp + 0x50], rdx
0x180aaabec: movaps xmmword ptr [rsp + 0x90], xmm6
0x180aaabf4: movaps xmmword ptr [rsp + 0xa0], xmm1
0x180aaabfc: movaps xmm1, xmm0
0x180aaabff: movsd qword ptr [rsp + 0xb0], xmm1
0x180aaac08: mov r14, qword ptr [rbx + 0x10]
0x180aaac0c: shr r14, 0x20
0x180aaac10: test rdx, rdx
0x180aaac13: je 0x180aab14e
0x180aaac19: xor r8d, r8d
0x180aaac1c: mov edx, dword ptr [rdx + 0x6c]
0x180aaac1f: mov rcx, rdi
0x180aaac22: call 0x180ab2b60 ; Torappu.Battle.Character.set_cardUid
0x180aaac27: movaps xmmword ptr [rsp + 0x90], xmm6
0x180aaac2f: movups xmm1, xmmword ptr [rbx + 0x40]
0x180aaac33: movaps xmmword ptr [rsp + 0xa0], xmm1
0x180aaac3b: movsd xmm0, qword ptr [rbx + 0x50]
0x180aaac40: movsd qword ptr [rsp + 0xb0], xmm0
0x180aaac49: mov rdx, qword ptr [rbx + 8]
0x180aaac4d: mov qword ptr [rdi + 0x3b0], rdx
0x180aaac54: lea rcx, [rdi + 0x3b0]
0x180aaac5b: call 0x18049bcf0
0x180aaac60: mov rcx, qword ptr [rip + 0x8064fd9]
0x180aaac67: cmp dword ptr [rcx + 0xe0], 0
0x180aaac6e: jne 0x180aaac75
0x180aaac70: call 0x18049c450
0x180aaac75: xor ecx, ecx
0x180aaac77: call 0x180670340 ; Torappu.Battle.BattleController.get_fixedPlayTime
0x180aaac7c: mov qword ptr [rdi + 0x398], rax
0x180aaac83: mov rsi, qword ptr [rdi + 0x3b0]
0x180aaac8a: mov rcx, qword ptr [rip + 0x80753bf]
0x180aaac91: cmp dword ptr [rcx + 0xe0], 0
0x180aaac98: jne 0x180aaac9f
0x180aaac9a: call 0x18049c450
0x180aaac9f: xor r8d, r8d
0x180aaaca2: xor edx, edx
0x180aaaca4: mov rcx, rsi
0x180aaaca7: call 0x186dcf430 ; UnityEngine.Object.op_Inequality
0x180aaacac: test al, al
0x180aaacae: je 0x180aaacd4
0x180aaacb0: mov rcx, qword ptr [rdi + 0x3b0]
0x180aaacb7: test rcx, rcx
0x180aaacba: je 0x180aab14e
0x180aaacc0: xor edx, edx
0x180aaacc2: call 0x1808fcd50 ; Torappu.Battle.Tile.get_mapLayer
0x180aaacc7: xor r8d, r8d
0x180aaacca: mov edx, eax
0x180aaaccc: mov rcx, rdi
0x180aaaccf: call 0x18073b0e0 ; Torappu.Battle.Entity.set_mapLayer
0x180aaacd4: movaps xmmword ptr [rsp + 0x90], xmm6
0x180aaacdc: movups xmm1, xmmword ptr [rbx + 0x40]
0x180aaace0: movaps xmmword ptr [rsp + 0xa0], xmm1
0x180aaace8: movsd xmm0, qword ptr [rbx + 0x50]
0x180aaaced: movsd qword ptr [rsp + 0xb0], xmm0
0x180aaacf6: mov rdx, qword ptr [rbx + 0x28]
0x180aaacfa: mov qword ptr [rdi + 0x458], rdx
0x180aaad01: lea rcx, [rdi + 0x458]
0x180aaad08: call 0x18049bcf0
0x180aaad0d: movaps xmmword ptr [rsp + 0x90], xmm6
0x180aaad15: movups xmm1, xmmword ptr [rbx + 0x40]
0x180aaad19: movaps xmmword ptr [rsp + 0xa0], xmm1
0x180aaad21: movsd xmm0, qword ptr [rbx + 0x50]
0x180aaad26: movsd qword ptr [rsp + 0xb0], xmm0
0x180aaad2f: mov rdx, qword ptr [rbx + 0x20]
0x180aaad33: mov qword ptr [rdi + 0x450], rdx
0x180aaad3a: lea rcx, [rdi + 0x450]
0x180aaad41: call 0x18049bcf0
0x180aaad46: movups xmm2, xmm6
0x180aaad49: movups xmm0, xmmword ptr [rbx + 0x40]
0x180aaad4d: movaps xmmword ptr [rsp + 0xa0], xmm0
0x180aaad55: movsd xmm1, qword ptr [rbx + 0x50]
0x180aaad5a: movsd qword ptr [rsp + 0xb0], xmm1
0x180aaad63: psrldq xmm2, 4
0x180aaad68: movd eax, xmm2
0x180aaad6c: mov byte ptr [rdi + 0x37a], al
0x180aaad72: movaps xmmword ptr [rsp + 0x90], xmm6
0x180aaad7a: movups xmm2, xmm0
0x180aaad7d: movaps xmmword ptr [rsp + 0xa0], xmm0
0x180aaad85: movaps xmm0, xmm1
0x180aaad88: movsd qword ptr [rsp + 0xb0], xmm0
0x180aaad91: movups xmm1, xmmword ptr [rsp + 0x98]
0x180aaad99: movups xmmword ptr [rdi + 0x4d0], xmm1
0x180aaada0: unpckhpd xmm2, xmm2
0x180aaada4: movsd qword ptr [rdi + 0x4e0], xmm2
0x180aaadac: mov eax, dword ptr [rdi + 0x340]
0x180aaadb2: mov dword ptr [rdi + 0x4f0], eax
0x180aaadb8: mov byte ptr [rdi + 0x4f4], 0
0x180aaadbf: mov dword ptr [rdi + 0x4fc], r14d
0x180aaadc6: movsd qword ptr [rsp + 0xb0], xmm0
0x180aaadcf: mov eax, dword ptr [rsp + 0xb0]
0x180aaadd6: mov dword ptr [rdi + 0x4f8], eax
0x180aaaddc: mov rcx, qword ptr [rdi + 0x508]
0x180aaade3: test rcx, rcx
0x180aaade6: je 0x180aab14e
0x180aaadec: mov rdx, qword ptr [rip + 0x8083815]
0x180aaadf3: call 0x185cab500
0x180aaadf8: mov rcx, qword ptr [rdi + 0x508]
0x180aaadff: test rcx, rcx
0x180aaae02: je 0x180aab14e
0x180aaae08: mov r9, qword ptr [rip + 0x8083a41]
0x180aaae0f: movzx r8d, byte ptr [rdi + 0x374]
0x180aaae17: mov dl, 1
0x180aaae19: call 0x185cab640
0x180aaae1e: mov rcx, qword ptr [rdi + 0x510]
0x180aaae25: test rcx, rcx
0x180aaae28: je 0x180aab14e
0x180aaae2e: xor edx, edx
0x180aaae30: call 0x186975960 ; Torappu.EnableStateWithKey.Reset
0x180aaae35: mov qword ptr [rsp + 0x20], 0
0x180aaae3e: movd r15d, xmm6
0x180aaae43: mov r9d, r15d
0x180aaae46: mov r8d, dword ptr [rbx + 0x18]
0x180aaae4a: mov rdx, qword ptr [rsp + 0x50]
0x180aaae4f: mov rcx, rdi
0x180aaae52: call 0x180aa9900 ; Torappu.Battle.Character._AssignData
0x180aaae57: xor r8d, r8d
0x180aaae5a: mov edx, dword ptr [rbx + 0x10]
0x180aaae5d: mov rcx, rdi
0x180aaae60: call 0x18073ad00 ; Torappu.Battle.Entity.set_direction
0x180aaae65: mov rax, qword ptr [rsp + 0x50]
0x180aaae6a: test rax, rax
0x180aaae6d: je 0x180aab14e
0x180aaae73: mov rax, qword ptr [rax + 0x38]
0x180aaae77: test rax, rax
0x180aaae7a: je 0x180aab14e
0x180aaae80: movups xmm6, xmmword ptr [rax + 0x64]
0x180aaae84: mov esi, dword ptr [rax + 0x74]
0x180aaae87: mov rcx, qword ptr [rip + 0x807a19a]
0x180aaae8e: cmp dword ptr [rcx + 0xe0], 0
0x180aaae95: jne 0x180aaae9c
0x180aaae97: call 0x18049c450
0x180aaae9c: movaps xmmword ptr [rsp + 0xe0], xmm6
0x180aaaea4: mov dword ptr [rsp + 0xf0], esi
0x180aaaeab: xor edx, edx
0x180aaaead: lea rcx, [rsp + 0xe0]
0x180aaaeb5: call 0x18686bef0 ; CodeStage.AntiCheat.ObscuredTypes.ObscuredInt.op_Implicit
0x180aaaeba: mov dword ptr [rsp + 0x178], eax
0x180aaaec1: mov qword ptr [rsp + 0xc0], 0
0x180aaaecd: lea rax, [rsp + 0x50]
0x180aaaed2: mov qword ptr [rsp + 0xc8], rax
0x180aaaeda: lea rax, [rsp + 0x178]
0x180aaaee2: mov qword ptr [rsp + 0xd0], rax
0x180aaaeea: mov rsi, qword ptr [rsp + 0x50]
0x180aaaeef: test rsi, rsi
0x180aaaef2: je 0x180aab142
0x180aaaef8: mov rsi, qword ptr [rsi + 0x38]
0x180aaaefc: mov rcx, qword ptr [rip + 0x807a125]
0x180aaaf03: cmp dword ptr [rcx + 0xe0], 0
0x180aaaf0a: jne 0x180aaaf11
0x180aaaf0c: call 0x18049c450
0x180aaaf11: xor r8d, r8d
0x180aaaf14: mov edx, r14d
0x180aaaf17: lea rcx, [rsp + 0xe0]
0x180aaaf1f: call 0x18686be00 ; CodeStage.AntiCheat.ObscuredTypes.ObscuredInt.op_Implicit
0x180aaaf24: movups xmm0, xmmword ptr [rax]
0x180aaaf27: mov ecx, dword ptr [rax + 0x10]
0x180aaaf2a: test rsi, rsi
0x180aaaf2d: je 0x180aab13d
0x180aaaf33: movups xmmword ptr [rsi + 0x64], xmm0
0x180aaaf37: mov dword ptr [rsi + 0x74], ecx
0x180aaaf3a: mov rax, qword ptr [rsp + 0x50]
0x180aaaf3f: test rax, rax
0x180aaaf42: je 0x180aab138
0x180aaaf48: mov rsi, qword ptr [rax + 0x38]
0x180aaaf4c: movups xmm6, xmmword ptr [rbx + 0x10]
0x180aaaf50: mov r14d, dword ptr [rdi + 0x2c8]
0x180aaaf57: mov rcx, qword ptr [rbx + 8]
0x180aaaf5b: test rcx, rcx
0x180aaaf5e: je 0x180aab133
0x180aaaf64: xor edx, edx
0x180aaaf66: call 0x180b23080 ; Torappu.Battle.VisualObject.get_mapPosition
0x180aaaf6b: movq xmm7, rax
0x180aaaf70: mov rcx, qword ptr [rbx + 8]
0x180aaaf74: test rcx, rcx
0x180aaaf77: je 0x180aab12e
0x180aaaf7d: xor edx, edx
0x180aaaf7f: call 0x1808fcb30 ; Torappu.Battle.Tile.get_locateHeight
0x180aaaf84: mov rax, qword ptr [rsp + 0x50]
0x180aaaf89: test rax, rax
0x180aaaf8c: je 0x180aab129
0x180aaaf92: mov rax, qword ptr [rax + 0x110]
0x180aaaf99: test rax, rax
0x180aaaf9c: je 0x180aab123
0x180aaafa2: mov qword ptr [rsp + 0x40], 0
0x180aaafab: mov rax, qword ptr [rax + 0x48]
0x180aaafaf: mov qword ptr [rsp + 0x38], rax
0x180aaafb4: movss dword ptr [rsp + 0x30], xmm0
0x180aaafba: movsd qword ptr [rsp + 0x28], xmm7
0x180aaafc0: mov dword ptr [rsp + 0x20], r14d
0x180aaafc5: mov r9d, r15d
0x180aaafc8: psrldq xmm6, 8
0x180aaafcd: movd r8d, xmm6
0x180aaafd2: mov rdx, rsi
0x180aaafd5: mov rcx, rdi
0x180aaafd8: call 0x1807264b0 ; Torappu.Battle.Entity.Init
0x180aaafdd: nop
0x180aaafde: lea rcx, [rsp + 0xc8]
0x180aaafe6: call 0x180a9a6b0
0x180aaafeb: jmp 0x180aab01b
0x180aaafed: lea rcx, [rsp + 0xc8]
0x180aaaff5: call 0x180a9a6b0
0x180aaaffa: mov rcx, qword ptr [rsp + 0xc0]
0x180aab002: test rcx, rcx
0x180aab005: jne 0x180aab148
0x180aab00b: mov rbx, qword ptr [rsp + 0x168]
0x180aab013: mov rdi, qword ptr [rsp + 0x160]
0x180aab01b: mov rcx, qword ptr [rsp + 0x50]
0x180aab020: test rcx, rcx
0x180aab023: je 0x180aab14e
0x180aab029: mov rcx, qword ptr [rcx + 0x160]
0x180aab030: test rcx, rcx
0x180aab033: je 0x180aab14e
0x180aab039: inc dword ptr [rcx + 0x20]
0x180aab03c: mov rcx, qword ptr [rip + 0x8064bfd]
0x180aab043: cmp dword ptr [rcx + 0xe0], 0
0x180aab04a: jne 0x180aab051
0x180aab04c: call 0x18049c450
0x180aab051: xor ecx, ecx
0x180aab053: call 0x1806702b0 ; Torappu.Battle.BattleController.get_fixedFrameCnt
0x180aab058: test eax, eax
0x180aab05a: je 0x180aab08a
0x180aab05c: mov rdx, qword ptr [rip + 0x8064bdd]
0x180aab063: cmp dword ptr [rdx + 0xe0], 0
0x180aab06a: jne 0x180aab07b
0x180aab06c: mov rcx, rdx
0x180aab06f: call 0x18049c450
0x180aab074: mov rdx, qword ptr [rip + 0x8064bc5]
0x180aab07b: mov rax, qword ptr [rdx + 0xb8]
0x180aab082: mov ecx, dword ptr [rax + 0x50]
0x180aab085: inc ecx
0x180aab087: mov dword ptr [rax + 0x50], ecx
0x180aab08a: xor edx, edx
0x180aab08c: mov rcx, rdi
0x180aab08f: call 0x180aa8d20 ; Torappu.Battle.Character.UpdateHatred
0x180aab094: xor r9d, r9d
0x180aab097: mov r8b, 1
0x180aab09a: mov edx, dword ptr [rbx + 0x10]
0x180aab09d: mov rcx, rdi
0x180aab0a0: call 0x18072dc70 ; Torappu.Battle.Entity.SetBodyDirection
0x180aab0a5: xor edx, edx
0x180aab0a7: mov rcx, rdi
0x180aab0aa: call 0x180aac1b0 ; Torappu.Battle.Character._InitAllModeDirection
0x180aab0af: jmp 0x180aab104
0x180aab0b1: movups xmm0, xmmword ptr [rbx]
0x180aab0b4: movaps xmmword ptr [rsp + 0x60], xmm0
0x180aab0b9: movups xmm1, xmmword ptr [rbx + 0x10]
0x180aab0bd: movaps xmmword ptr [rsp + 0x70], xmm1
0x180aab0c2: movups xmm0, xmmword ptr [rbx + 0x20]
0x180aab0c6: movaps xmmword ptr [rsp + 0x80], xmm0
0x180aab0ce: movups xmm1, xmmword ptr [rbx + 0x30]
0x180aab0d2: movaps xmmword ptr [rsp + 0x90], xmm1
0x180aab0da: movups xmm0, xmmword ptr [rbx + 0x40]
0x180aab0de: movaps xmmword ptr [rsp + 0xa0], xmm0
0x180aab0e6: movsd xmm1, qword ptr [rbx + 0x50]
0x180aab0eb: movsd qword ptr [rsp + 0xb0], xmm1
0x180aab0f4: xor r9d, r9d
0x180aab0f7: lea r8, [rsp + 0x60]
0x180aab0fc: mov rdx, rdi
0x180aab0ff: call 0x183463300 ; XLua.DelegateBridge.__Gen_Delegate_Imp3773
0x180aab104: movaps xmm6, xmmword ptr [rsp + 0x120]
0x180aab10c: movaps xmm7, xmmword ptr [rsp + 0x110]
0x180aab114: add rsp, 0x130
0x180aab11b: pop r15
0x180aab11d: pop r14
0x180aab11f: pop rdi
0x180aab120: pop rsi
0x180aab121: pop rbx
0x180aab122: ret
0x180aab123: call 0x18049c3c0
0x180aab128: nop
0x180aab129: call 0x18049c3c0
0x180aab12e: call 0x18049c3c0
0x180aab133: call 0x18049c3c0
0x180aab138: call 0x18049c3c0
0x180aab13d: call 0x18049c3c0
0x180aab142: call 0x18049c3c0
0x180aab147: nop
0x180aab148: call 0x180483060
0x180aab14d: int3
0x180aab14e: call 0x18049c3c0
0x180aab153: int3
0x180aab154: int3
0x180aab155: int3
0x180aab156: int3
0x180aab157: int3
0x180aab158: int3
0x180aab159: int3
0x180aab15a: int3
0x180aab15b: int3
0x180aab15c: int3
0x180aab15d: int3
0x180aab15e: int3
0x180aab15f: int3
