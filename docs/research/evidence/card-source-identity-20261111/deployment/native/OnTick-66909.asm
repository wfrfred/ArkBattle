0x1806ed530: mov qword ptr [rsp + 0x18], rbx
0x1806ed535: mov qword ptr [rsp + 0x20], rsi
0x1806ed53a: mov qword ptr [rsp + 0x10], rdx
0x1806ed53f: mov qword ptr [rsp + 8], rcx
0x1806ed544: push rdi
0x1806ed545: push r12
0x1806ed547: push r13
0x1806ed549: push r14
0x1806ed54b: push r15
0x1806ed54d: sub rsp, 0xc0
0x1806ed554: mov rbx, rdx
0x1806ed557: mov rsi, rcx
0x1806ed55a: cmp byte ptr [rip + 0x88ae069], 0
0x1806ed561: jne 0x1806ed62e
0x1806ed567: lea rcx, [rip + 0x84d47ba]
0x1806ed56e: call 0x18049c210
0x1806ed573: lea rcx, [rip + 0x845a9ae]
0x1806ed57a: call 0x18049c210
0x1806ed57f: lea rcx, [rip + 0x847e6fa]
0x1806ed586: call 0x18049c210
0x1806ed58b: lea rcx, [rip + 0x8444f8e]
0x1806ed592: call 0x18049c210
0x1806ed597: lea rcx, [rip + 0x84c8e62]
0x1806ed59e: call 0x18049c210
0x1806ed5a3: lea rcx, [rip + 0x854665e]
0x1806ed5aa: call 0x18049c210
0x1806ed5af: lea rcx, [rip + 0x84451b2]
0x1806ed5b6: call 0x18049c210
0x1806ed5bb: lea rcx, [rip + 0x854688e]
0x1806ed5c2: call 0x18049c210
0x1806ed5c7: lea rcx, [rip + 0x84c9082]
0x1806ed5ce: call 0x18049c210
0x1806ed5d3: lea rcx, [rip + 0x8546abe]
0x1806ed5da: call 0x18049c210
0x1806ed5df: lea rcx, [rip + 0x84453ca]
0x1806ed5e6: call 0x18049c210
0x1806ed5eb: lea rcx, [rip + 0x84c92a6]
0x1806ed5f2: call 0x18049c210
0x1806ed5f7: lea rcx, [rip + 0x84f750a]
0x1806ed5fe: call 0x18049c210
0x1806ed603: lea rcx, [rip + 0x840409e]
0x1806ed60a: call 0x18049c210
0x1806ed60f: lea rcx, [rip + 0x857e892]
0x1806ed616: call 0x18049c210
0x1806ed61b: lea rcx, [rip + 0x8442e66]
0x1806ed622: call 0x18049c210
0x1806ed627: mov byte ptr [rip + 0x88adf9c], 1
0x1806ed62e: xorps xmm0, xmm0
0x1806ed631: xor eax, eax
0x1806ed633: movups xmmword ptr [rsp + 0x48], xmm0
0x1806ed638: mov qword ptr [rsp + 0x58], rax
0x1806ed63d: xorps xmm1, xmm1
0x1806ed640: movups xmmword ptr [rsp + 0x60], xmm1
0x1806ed645: mov qword ptr [rsp + 0x70], rax
0x1806ed64a: movups xmmword ptr [rsp + 0x78], xmm0
0x1806ed64f: movups xmmword ptr [rsp + 0x88], xmm0
0x1806ed657: mov qword ptr [rsp + 0x98], rax
0x1806ed65f: mov rax, qword ptr [rip + 0x84d46c2]
0x1806ed666: mov rcx, qword ptr [rax + 0xb8]
0x1806ed66d: mov rcx, qword ptr [rcx + 0x358]
0x1806ed674: test rcx, rcx
0x1806ed677: jne 0x1806edc1a
0x1806ed67d: movzx edx, byte ptr [rip + 0x88adee1]
0x1806ed684: test dl, dl
0x1806ed686: jne 0x1806ed69c
0x1806ed688: lea rcx, [rip + 0x84d4699]
0x1806ed68f: call 0x18049c210
0x1806ed694: mov dl, 1
0x1806ed696: mov byte ptr [rip + 0x88adec9], dl
0x1806ed69c: mov rax, qword ptr [rip + 0x84d4685]
0x1806ed6a3: mov rcx, qword ptr [rax + 0xb8]
0x1806ed6aa: mov rcx, qword ptr [rcx + 0x30]
0x1806ed6ae: test rcx, rcx
0x1806ed6b1: jne 0x1806ed6bb
0x1806ed6b3: mov eax, dword ptr [rsi + 0x1c0]
0x1806ed6b9: jmp 0x1806ed6cd
0x1806ed6bb: xor r8d, r8d
0x1806ed6be: mov rdx, rsi
0x1806ed6c1: call 0x183196850 ; XLua.DelegateBridge.__Gen_Delegate_Imp11168
0x1806ed6c6: movzx edx, byte ptr [rip + 0x88ade98]
0x1806ed6cd: cmp eax, 3
0x1806ed6d0: je 0x1806ed71c
0x1806ed6d2: test dl, dl
0x1806ed6d4: jne 0x1806ed6e9
0x1806ed6d6: lea rcx, [rip + 0x84d464b]
0x1806ed6dd: call 0x18049c210
0x1806ed6e2: mov byte ptr [rip + 0x88ade7c], 1
0x1806ed6e9: mov rax, qword ptr [rip + 0x84d4638]
0x1806ed6f0: mov rcx, qword ptr [rax + 0xb8]
0x1806ed6f7: mov rcx, qword ptr [rcx + 0x30]
0x1806ed6fb: test rcx, rcx
0x1806ed6fe: jne 0x1806ed708
0x1806ed700: mov eax, dword ptr [rsi + 0x1c0]
0x1806ed706: jmp 0x1806ed713
0x1806ed708: xor r8d, r8d
0x1806ed70b: mov rdx, rsi
0x1806ed70e: call 0x183196850 ; XLua.DelegateBridge.__Gen_Delegate_Imp11168
0x1806ed713: cmp eax, 4
0x1806ed716: jne 0x1806ed7f9
0x1806ed71c: cmp byte ptr [rsi + 0x1d9], 0
0x1806ed723: jne 0x1806ed7e5
0x1806ed729: cmp byte ptr [rsi + 0x1da], 0
0x1806ed730: jne 0x1806ed7f9
0x1806ed736: mov rdi, qword ptr [rsi + 0x30]
0x1806ed73a: test rdi, rdi
0x1806ed73d: je 0x1806edc69
0x1806ed743: cmp byte ptr [rip + 0x88eb326], 0
0x1806ed74a: jbe 0x1806ed754
0x1806ed74c: mov rcx, qword ptr [rdi]
0x1806ed74f: call 0x180457010
0x1806ed754: mov r8, qword ptr [rdi]
0x1806ed757: mov rax, qword ptr [r8 + 0x190]
0x1806ed75e: mov r8, qword ptr [r8 + 0x198]
0x1806ed765: mov rdx, rbx
0x1806ed768: mov rcx, rdi
0x1806ed76b: call rax
0x1806ed76d: test al, al
0x1806ed76f: je 0x1806ed7f9
0x1806ed775: mov ecx, 0xb
0x1806ed77a: mov rdx, rsi
0x1806ed77d: call 0x180005610
0x1806ed782: cmp eax, 2
0x1806ed785: jne 0x1806ed7d3
0x1806ed787: cmp dword ptr [rsi + 0x170], 0
0x1806ed78e: jle 0x1806ed7d3
0x1806ed790: mov eax, dword ptr [rsi + 0x170]
0x1806ed796: dec eax
0x1806ed798: mov dword ptr [rsi + 0x170], eax
0x1806ed79e: test eax, eax
0x1806ed7a0: jle 0x1806ed7d3
0x1806ed7a2: mov rcx, qword ptr [rsi + 0x30]
0x1806ed7a6: test rcx, rcx
0x1806ed7a9: je 0x1806edc69
0x1806ed7af: xor r9d, r9d
0x1806ed7b2: mov r8b, 1
0x1806ed7b5: mov rdx, qword ptr [rsi + 0x1d0]
0x1806ed7bc: call 0x181e4afc0 ; Torappu.PeriodicTimer.Reset
0x1806ed7c1: xor r8d, r8d
0x1806ed7c4: mov edx, 4
0x1806ed7c9: mov rcx, rsi
0x1806ed7cc: call 0x1806f42c0 ; Torappu.Battle.Deck/Card.set_state
0x1806ed7d1: jmp 0x1806ed7f9
0x1806ed7d3: xor r8d, r8d
0x1806ed7d6: mov edx, 1
0x1806ed7db: mov rcx, rsi
0x1806ed7de: call 0x1806f42c0 ; Torappu.Battle.Deck/Card.set_state
0x1806ed7e3: jmp 0x1806ed7f9
0x1806ed7e5: mov rcx, qword ptr [rsi + 0x30]
0x1806ed7e9: test rcx, rcx
0x1806ed7ec: je 0x1806edc69
0x1806ed7f2: xor edx, edx
0x1806ed7f4: call 0x181e4aca0 ; Torappu.PeriodicTimer.MarkInvalid
0x1806ed7f9: xor r14b, r14b
0x1806ed7fc: mov rdx, qword ptr [rip + 0x845a725]
0x1806ed803: mov rcx, qword ptr [rsi + 0x148]
0x1806ed80a: call 0x184699180
0x1806ed80f: lea edi, [rax - 1]
0x1806ed812: test edi, edi
0x1806ed814: js 0x1806ed89c
0x1806ed81a: nop word ptr [rax + rax]
0x1806ed820: mov rcx, qword ptr [rsi + 0x148]
0x1806ed827: test rcx, rcx
0x1806ed82a: je 0x1806edc69
0x1806ed830: mov r8, qword ptr [rip + 0x8442c51]
0x1806ed837: mov edx, edi
0x1806ed839: call 0x184d27b00
0x1806ed83e: test rax, rax
0x1806ed841: je 0x1806edc69
0x1806ed847: xor r8d, r8d
0x1806ed84a: mov rdx, rbx
0x1806ed84d: mov rcx, rax
0x1806ed850: call 0x1807068c0 ; Torappu.Battle.Deck/Card/CardBuff.OnTick
0x1806ed855: test al, al
0x1806ed857: je 0x1806ed888
0x1806ed859: mov rcx, qword ptr [rsi + 0x148]
0x1806ed860: test rcx, rcx
0x1806ed863: je 0x1806edc69
0x1806ed869: mov r8, qword ptr [rip + 0x8442c18]
0x1806ed870: mov edx, edi
0x1806ed872: call 0x184d27b00
0x1806ed877: xor r8d, r8d
0x1806ed87a: mov rdx, rax
0x1806ed87d: mov rcx, rsi
0x1806ed880: call 0x1806ee460 ; Torappu.Battle.Deck/Card.RemoveCardBuff
0x1806ed885: mov r14b, 1
0x1806ed888: sub edi, 1
0x1806ed88b: jns 0x1806ed820
0x1806ed88d: test r14b, r14b
0x1806ed890: je 0x1806ed89c
0x1806ed892: xor edx, edx
0x1806ed894: mov rcx, rsi
0x1806ed897: call 0x1806f0c30 ; Torappu.Battle.Deck/Card._UpdateCardBuff
0x1806ed89c: mov rdx, qword ptr [rsi + 0x188]
0x1806ed8a3: test rdx, rdx
0x1806ed8a6: je 0x1806edc69
0x1806ed8ac: mov r8, qword ptr [rip + 0x857e5f5]
0x1806ed8b3: lea rcx, [rsp + 0x20]
0x1806ed8b8: call 0x184d19f20
0x1806ed8bd: movups xmm0, xmmword ptr [rsp + 0x20]
0x1806ed8c2: movups xmmword ptr [rsp + 0x48], xmm0
0x1806ed8c7: movsd xmm1, qword ptr [rsp + 0x30]
0x1806ed8cd: movsd qword ptr [rsp + 0x58], xmm1
0x1806ed8d3: xor r12d, r12d
0x1806ed8d6: mov qword ptr [rsp + 0x20], r12
0x1806ed8db: lea rdi, [rsp + 0x48]
0x1806ed8e0: mov qword ptr [rsp + 0x28], rdi
0x1806ed8e5: nop word ptr [rax + rax]
0x1806ed8f0: mov rdx, qword ptr [rip + 0x8546559]
0x1806ed8f7: lea rcx, [rsp + 0x48]
0x1806ed8fc: call 0x185cc82d0
0x1806ed901: test al, al
0x1806ed903: je 0x1806eda2c
0x1806ed909: mov r14, qword ptr [rsp + 0x58]
0x1806ed90e: test r14, r14
0x1806ed911: je 0x1806edc45
0x1806ed917: mov rcx, qword ptr [r14]
0x1806ed91a: mov edx, dword ptr [rcx + 0x11c]
0x1806ed920: sub edx, 0x960
0x1806ed926: je 0x1806eda16
0x1806ed92c: sub edx, 1
0x1806ed92f: je 0x1806eda00
0x1806ed935: sub edx, 1
0x1806ed938: je 0x1806ed9ea
0x1806ed93e: cmp edx, 1
0x1806ed941: je 0x1806ed9d4
0x1806ed947: mov r15, qword ptr [rip + 0x843dcaa]
0x1806ed94e: mov r13, rcx
0x1806ed951: cmp byte ptr [rip + 0x88eb118], 0
0x1806ed958: je 0x1806ed95f
0x1806ed95a: call 0x180457010
0x1806ed95f: movzx ecx, r12w
0x1806ed963: movzx edx, word ptr [r13 + 0x12e]
0x1806ed96b: cmp r12w, dx
0x1806ed96f: jae 0x1806ed994
0x1806ed971: mov r8, qword ptr [r13 + 0xb0]
0x1806ed978: nop dword ptr [rax + rax]
0x1806ed980: movzx eax, cx
0x1806ed983: add rax, rax
0x1806ed986: cmp qword ptr [r8 + rax*8], r15
0x1806ed98a: je 0x1806ed9bc
0x1806ed98c: inc cx
0x1806ed98f: cmp cx, dx
0x1806ed992: jb 0x1806ed980
0x1806ed994: xor r8d, r8d
0x1806ed997: mov rdx, r15
0x1806ed99a: mov rcx, r14
0x1806ed99d: call 0x180455fd0
0x1806ed9a2: mov r9, rax
0x1806ed9a5: mov rax, qword ptr [r9]
0x1806ed9a8: mov r9, qword ptr [r9 + 8]
0x1806ed9ac: mov r8, rbx
0x1806ed9af: mov rdx, rsi
0x1806ed9b2: mov rcx, r14
0x1806ed9b5: call rax
0x1806ed9b7: jmp 0x1806ed8f0
0x1806ed9bc: movzx ecx, cx
0x1806ed9bf: add rcx, rcx
0x1806ed9c2: movsxd r9, dword ptr [r8 + rcx*8 + 8]
0x1806ed9c7: add r9, 0x14
0x1806ed9cb: shl r9, 4
0x1806ed9cf: add r9, r13
0x1806ed9d2: jmp 0x1806ed9a5
0x1806ed9d4: xor r9d, r9d
0x1806ed9d7: mov r8, rbx
0x1806ed9da: mov rdx, rsi
0x1806ed9dd: mov rcx, r14
0x1806ed9e0: call 0x1809e0f30 ; Torappu.Battle.TokenCardBuffConditionAvailableTalent/ConditionBuildableModifier.OnTick
0x1806ed9e5: jmp 0x1806ed8f0
0x1806ed9ea: xor r9d, r9d
0x1806ed9ed: mov r8, rbx
0x1806ed9f0: mov rdx, rsi
0x1806ed9f3: mov rcx, r14
0x1806ed9f6: call 0x1809eba20 ; Torappu.Battle.PeriodModifySharedDataBbTalent/SharedDataBbModifier.OnTick
0x1806ed9fb: jmp 0x1806ed8f0
0x1806eda00: xor r9d, r9d
0x1806eda03: mov r8, rbx
0x1806eda06: mov rdx, rsi
0x1806eda09: mov rcx, r14
0x1806eda0c: call 0x1809ea0f0 ; Torappu.Battle.OnlyEffectCardTalent/OnlyEffectCardTalentModifier.OnTick
0x1806eda11: jmp 0x1806ed8f0
0x1806eda16: xor r9d, r9d
0x1806eda19: mov r8, rbx
0x1806eda1c: mov rdx, rsi
0x1806eda1f: mov rcx, r14
0x1806eda22: call 0x1809cf070 ; Torappu.Battle.Thorn2CardTalent/Thorn2CardModifier.OnTick
0x1806eda27: jmp 0x1806ed8f0
0x1806eda2c: mov rdx, qword ptr [rip + 0x85461d5]
0x1806eda33: mov rcx, rdi
0x1806eda36: call 0x18051df60 ; BattleTimer.EventOnEntryClick | BattleTimer.EventOnTimerPlayNPause | BattleTimer.EventOnTimerRecord | BattleTimer.EventOnTimerReset
0x1806eda3b: jmp 0x1806eda6f
0x1806eda3d: mov rdx, qword ptr [rip + 0x85461c4]
0x1806eda44: mov rcx, qword ptr [rsp + 0x28]
0x1806eda49: call 0x18051df60 ; BattleTimer.EventOnEntryClick | BattleTimer.EventOnTimerPlayNPause | BattleTimer.EventOnTimerRecord | BattleTimer.EventOnTimerReset
0x1806eda4e: mov rcx, qword ptr [rsp + 0x20]
0x1806eda53: test rcx, rcx
0x1806eda56: jne 0x1806edc4b
0x1806eda5c: xor r12d, r12d
0x1806eda5f: mov rbx, qword ptr [rsp + 0xf8]
0x1806eda67: mov rsi, qword ptr [rsp + 0xf0]
0x1806eda6f: mov rdx, qword ptr [rsi + 0x190]
0x1806eda76: test rdx, rdx
0x1806eda79: je 0x1806edc69
0x1806eda7f: mov r8, qword ptr [rip + 0x8403c22]
0x1806eda86: lea rcx, [rsp + 0x20]
0x1806eda8b: call 0x184d19f20
0x1806eda90: movups xmm0, xmmword ptr [rsp + 0x20]
0x1806eda95: movups xmmword ptr [rsp + 0x60], xmm0
0x1806eda9a: movsd xmm1, qword ptr [rsp + 0x30]
0x1806edaa0: movsd qword ptr [rsp + 0x70], xmm1
0x1806edaa6: mov qword ptr [rsp + 0x20], r12
0x1806edaab: lea rdi, [rsp + 0x60]
0x1806edab0: mov qword ptr [rsp + 0x28], rdi
0x1806edab5: nop word ptr [rax + rax]
0x1806edac0: mov rdx, qword ptr [rip + 0x84c8b89]
0x1806edac7: lea rcx, [rsp + 0x60]
0x1806edacc: call 0x185cc82d0
0x1806edad1: test al, al
0x1806edad3: je 0x1806edb0f
0x1806edad5: mov r14, qword ptr [rsp + 0x70]
0x1806edada: test r14, r14
0x1806edadd: je 0x1806edc51
0x1806edae3: cmp byte ptr [rip + 0x88eaf86], 0
0x1806edaea: jbe 0x1806edaf4
0x1806edaec: mov rcx, qword ptr [r14]
0x1806edaef: call 0x180457010
0x1806edaf4: mov r8, qword ptr [r14]
0x1806edaf7: mov rax, qword ptr [r8 + 0x1a0]
0x1806edafe: mov r8, qword ptr [r8 + 0x1a8]
0x1806edb05: mov rdx, rbx
0x1806edb08: mov rcx, r14
0x1806edb0b: call rax
0x1806edb0d: jmp 0x1806edac0
0x1806edb0f: mov rdx, qword ptr [rip + 0x84c88ea]
0x1806edb16: mov rcx, rdi
0x1806edb19: call 0x18051df60 ; BattleTimer.EventOnEntryClick | BattleTimer.EventOnTimerPlayNPause | BattleTimer.EventOnTimerRecord | BattleTimer.EventOnTimerReset
0x1806edb1e: jmp 0x1806edb4a
0x1806edb20: mov rdx, qword ptr [rip + 0x84c88d9]
0x1806edb27: mov rcx, qword ptr [rsp + 0x28]
0x1806edb2c: call 0x18051df60 ; BattleTimer.EventOnEntryClick | BattleTimer.EventOnTimerPlayNPause | BattleTimer.EventOnTimerRecord | BattleTimer.EventOnTimerReset
0x1806edb31: mov rcx, qword ptr [rsp + 0x20]
0x1806edb36: test rcx, rcx
0x1806edb39: jne 0x1806edc57
0x1806edb3f: xor r12d, r12d
0x1806edb42: mov rsi, qword ptr [rsp + 0xf0]
0x1806edb4a: mov rdx, qword ptr [rsi + 0x1a0]
0x1806edb51: test rdx, rdx
0x1806edb54: je 0x1806edc69
0x1806edb5a: mov r8, qword ptr [rip + 0x847e11f]
0x1806edb61: lea rcx, [rsp + 0x20]
0x1806edb66: call 0x1859c53b0
0x1806edb6b: movups xmm0, xmmword ptr [rsp + 0x20]
0x1806edb70: movups xmmword ptr [rsp + 0x78], xmm0
0x1806edb75: movups xmm1, xmmword ptr [rsp + 0x30]
0x1806edb7a: movups xmmword ptr [rsp + 0x88], xmm1
0x1806edb82: movsd xmm0, qword ptr [rsp + 0x40]
0x1806edb88: movsd qword ptr [rsp + 0x98], xmm0
0x1806edb91: mov qword ptr [rsp + 0x20], r12
0x1806edb96: lea rbx, [rsp + 0x78]
0x1806edb9b: mov qword ptr [rsp + 0x28], rbx
0x1806edba0: mov rdx, qword ptr [rip + 0x8444bc1]
0x1806edba7: lea rcx, [rsp + 0x78]
0x1806edbac: call 0x185cf5a30
0x1806edbb1: test al, al
0x1806edbb3: je 0x1806edbec
0x1806edbb5: mov rcx, qword ptr [rsp + 0x90]
0x1806edbbd: test rcx, rcx
0x1806edbc0: je 0x1806edc5d
0x1806edbc6: xor edx, edx
0x1806edbc8: call 0x186dc5740 ; UnityEngine.Component.get_gameObject
0x1806edbcd: mov rdi, rax
0x1806edbd0: xor edx, edx
0x1806edbd2: mov rcx, rsi
0x1806edbd5: call 0x1806f2a20 ; Torappu.Battle.Deck/Card.get_isHidden
0x1806edbda: xor al, 1
0x1806edbdc: xor r8d, r8d
0x1806edbdf: movzx edx, al
0x1806edbe2: mov rcx, rdi
0x1806edbe5: call 0x18697b9d0 ; Torappu.GameObjectUtil.SetActiveIfNecessary
0x1806edbea: jmp 0x1806edba0
0x1806edbec: mov rdx, qword ptr [rip + 0x844492d]
0x1806edbf3: mov rcx, rbx
0x1806edbf6: call 0x18051df60 ; BattleTimer.EventOnEntryClick | BattleTimer.EventOnTimerPlayNPause | BattleTimer.EventOnTimerRecord | BattleTimer.EventOnTimerReset
0x1806edbfb: jmp 0x1806edc28
0x1806edbfd: mov rdx, qword ptr [rip + 0x844491c]
0x1806edc04: mov rcx, qword ptr [rsp + 0x28]
0x1806edc09: call 0x18051df60 ; BattleTimer.EventOnEntryClick | BattleTimer.EventOnTimerPlayNPause | BattleTimer.EventOnTimerRecord | BattleTimer.EventOnTimerReset
0x1806edc0e: mov rcx, qword ptr [rsp + 0x20]
0x1806edc13: test rcx, rcx
0x1806edc16: jne 0x1806edc63
0x1806edc18: jmp 0x1806edc28
0x1806edc1a: xor r9d, r9d
0x1806edc1d: mov r8, rbx
0x1806edc20: mov rdx, rsi
0x1806edc23: call 0x1834de650 ; XLua.DelegateBridge.__Gen_Delegate_Imp454
0x1806edc28: lea r11, [rsp + 0xc0]
0x1806edc30: mov rbx, qword ptr [r11 + 0x40]
0x1806edc34: mov rsi, qword ptr [r11 + 0x48]
0x1806edc38: mov rsp, r11
0x1806edc3b: pop r15
0x1806edc3d: pop r14
0x1806edc3f: pop r13
0x1806edc41: pop r12
0x1806edc43: pop rdi
0x1806edc44: ret
0x1806edc45: call 0x18049c3c0
0x1806edc4a: nop
0x1806edc4b: call 0x180483060
0x1806edc50: nop
0x1806edc51: call 0x18049c3c0
0x1806edc56: nop
0x1806edc57: call 0x180483060
0x1806edc5c: nop
0x1806edc5d: call 0x18049c3c0
0x1806edc62: nop
0x1806edc63: call 0x180483060
0x1806edc68: int3
0x1806edc69: call 0x18049c3c0
0x1806edc6e: int3
0x1806edc6f: int3
