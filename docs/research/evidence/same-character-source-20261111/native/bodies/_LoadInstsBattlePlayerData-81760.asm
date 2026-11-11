0x180c03800: mov qword ptr [rsp + 0x10], rbx
0x180c03805: mov qword ptr [rsp + 8], rcx
0x180c0380a: push rsi
0x180c0380b: push rdi
0x180c0380c: push r14
0x180c0380e: sub rsp, 0xc0
0x180c03815: mov rdi, rcx
0x180c03818: cmp byte ptr [rip + 0x839ad4f], 0
0x180c0381f: jne 0x180c038bc
0x180c03825: lea rcx, [rip + 0x802606c]
0x180c0382c: call 0x18049c210
0x180c03831: lea rcx, [rip + 0x7f796a8]
0x180c03838: call 0x18049c210
0x180c0383d: lea rcx, [rip + 0x8064f94]
0x180c03844: call 0x18049c210
0x180c03849: lea rcx, [rip + 0x7f798e0]
0x180c03850: call 0x18049c210
0x180c03855: lea rcx, [rip + 0x80651c4]
0x180c0385c: call 0x18049c210
0x180c03861: lea rcx, [rip + 0x8065400]
0x180c03868: call 0x18049c210
0x180c0386d: lea rcx, [rip + 0x7f79b0c]
0x180c03874: call 0x18049c210
0x180c03879: lea rcx, [rip + 0x8063c58]
0x180c03880: call 0x18049c210
0x180c03885: lea rcx, [rip + 0x7f7b21c]
0x180c0388c: call 0x18049c210
0x180c03891: lea rcx, [rip + 0x7f4df48]
0x180c03898: call 0x18049c210
0x180c0389d: lea rcx, [rip + 0x7f1475c]
0x180c038a4: call 0x18049c210
0x180c038a9: lea rcx, [rip + 0x7ef3c30]
0x180c038b0: call 0x18049c210
0x180c038b5: mov byte ptr [rip + 0x839acb2], 1
0x180c038bc: xorps xmm0, xmm0
0x180c038bf: movups xmmword ptr [rsp + 0x60], xmm0
0x180c038c4: xor esi, esi
0x180c038c6: mov dword ptr [rsp + 0xf0], esi
0x180c038cd: mov qword ptr [rsp + 0xf8], rsi
0x180c038d5: xor eax, eax
0x180c038d7: movups xmmword ptr [rsp + 0x90], xmm0
0x180c038df: mov qword ptr [rsp + 0xa0], rax
0x180c038e7: mov qword ptr [rsp + 0x58], rsi
0x180c038ec: mov qword ptr [rsp + 0x50], rsi
0x180c038f1: mov rax, qword ptr [rip + 0x8025fa0]
0x180c038f8: cmp dword ptr [rax + 0xe0], esi
0x180c038fe: jne 0x180c0390f
0x180c03900: mov rcx, rax
0x180c03903: call 0x18049c450
0x180c03908: mov rax, qword ptr [rip + 0x8025f89]
0x180c0390f: mov rax, qword ptr [rax + 0xb8]
0x180c03916: mov rcx, qword ptr [rax + 0xd8]
0x180c0391d: test rcx, rcx
0x180c03920: jne 0x180c03c4d
0x180c03926: mov rdx, qword ptr [rdi + 0xb8]
0x180c0392d: test rdx, rdx
0x180c03930: je 0x180c03c95
0x180c03936: mov r8, qword ptr [rip + 0x7ef3ba3]
0x180c0393d: lea rcx, [rsp + 0x30]
0x180c03942: call 0x184ce30d0
0x180c03947: movups xmm0, xmmword ptr [rsp + 0x30]
0x180c0394c: movups xmmword ptr [rsp + 0x70], xmm0
0x180c03951: movups xmm1, xmmword ptr [rsp + 0x40]
0x180c03956: movups xmmword ptr [rsp + 0x80], xmm1
0x180c0395e: mov qword ptr [rsp + 0x30], rsi
0x180c03963: lea rbx, [rsp + 0x70]
0x180c03968: mov qword ptr [rsp + 0x38], rbx
0x180c0396d: nop dword ptr [rax]
0x180c03970: mov rdx, qword ptr [rip + 0x7f797b9]
0x180c03977: lea rcx, [rsp + 0x70]
0x180c0397c: call 0x185cb6220
0x180c03981: test al, al
0x180c03983: je 0x180c039e3
0x180c03985: movups xmm0, xmmword ptr [rsp + 0x80]
0x180c0398d: movups xmmword ptr [rsp + 0x60], xmm0
0x180c03992: mov r9, qword ptr [rip + 0x7f7b10f]
0x180c03999: lea r8, [rsp + 0xf8]
0x180c039a1: lea rdx, [rsp + 0xf0]
0x180c039a9: lea rcx, [rsp + 0x60]
0x180c039ae: call 0x184c74970
0x180c039b3: mov rcx, qword ptr [rsp + 0xf8]
0x180c039bb: test rcx, rcx
0x180c039be: je 0x180c03c6c
0x180c039c4: inc dword ptr [rcx + 0x1c]
0x180c039c7: mov r8d, dword ptr [rcx + 0x18]
0x180c039cb: mov dword ptr [rcx + 0x18], esi
0x180c039ce: test r8d, r8d
0x180c039d1: jle 0x180c03970
0x180c039d3: xor r9d, r9d
0x180c039d6: xor edx, edx
0x180c039d8: mov rcx, qword ptr [rcx + 0x10]
0x180c039dc: call 0x186149e10 ; System.Array.Clear
0x180c039e1: jmp 0x180c03970
0x180c039e3: mov rdx, qword ptr [rip + 0x7f794f6]
0x180c039ea: mov rcx, rbx
0x180c039ed: call 0x18051df60 ; BattleTimer.EventOnEntryClick | BattleTimer.EventOnTimerPlayNPause | BattleTimer.EventOnTimerRecord | BattleTimer.EventOnTimerReset
0x180c039f2: jmp 0x180c03a1d
0x180c039f4: mov rdx, qword ptr [rip + 0x7f794e5]
0x180c039fb: mov rcx, qword ptr [rsp + 0x38]
0x180c03a00: call 0x18051df60 ; BattleTimer.EventOnEntryClick | BattleTimer.EventOnTimerPlayNPause | BattleTimer.EventOnTimerRecord | BattleTimer.EventOnTimerReset
0x180c03a05: mov rcx, qword ptr [rsp + 0x30]
0x180c03a0a: test rcx, rcx
0x180c03a0d: jne 0x180c03c72
0x180c03a13: xor esi, esi
0x180c03a15: mov rdi, qword ptr [rsp + 0xe0]
0x180c03a1d: mov rdx, qword ptr [rdi + 0xc0]
0x180c03a24: test rdx, rdx
0x180c03a27: je 0x180c03c95
0x180c03a2d: mov r8, qword ptr [rip + 0x7ef3aac]
0x180c03a34: lea rcx, [rsp + 0x30]
0x180c03a39: call 0x184ce30d0
0x180c03a3e: movups xmm0, xmmword ptr [rsp + 0x30]
0x180c03a43: movups xmmword ptr [rsp + 0x70], xmm0
0x180c03a48: movups xmm1, xmmword ptr [rsp + 0x40]
0x180c03a4d: movups xmmword ptr [rsp + 0x80], xmm1
0x180c03a55: mov qword ptr [rsp + 0x30], rsi
0x180c03a5a: lea rbx, [rsp + 0x70]
0x180c03a5f: mov qword ptr [rsp + 0x38], rbx
0x180c03a64: mov rdx, qword ptr [rip + 0x7f796c5]
0x180c03a6b: lea rcx, [rsp + 0x70]
0x180c03a70: call 0x185cb6220
0x180c03a75: test al, al
0x180c03a77: je 0x180c03ad7
0x180c03a79: movups xmm0, xmmword ptr [rsp + 0x80]
0x180c03a81: movups xmmword ptr [rsp + 0x60], xmm0
0x180c03a86: mov r9, qword ptr [rip + 0x7f7b01b]
0x180c03a8d: lea r8, [rsp + 0xf8]
0x180c03a95: lea rdx, [rsp + 0xf0]
0x180c03a9d: lea rcx, [rsp + 0x60]
0x180c03aa2: call 0x184c74970
0x180c03aa7: mov rcx, qword ptr [rsp + 0xf8]
0x180c03aaf: test rcx, rcx
0x180c03ab2: je 0x180c03c78
0x180c03ab8: inc dword ptr [rcx + 0x1c]
0x180c03abb: mov r8d, dword ptr [rcx + 0x18]
0x180c03abf: mov dword ptr [rcx + 0x18], esi
0x180c03ac2: test r8d, r8d
0x180c03ac5: jle 0x180c03a64
0x180c03ac7: xor r9d, r9d
0x180c03aca: xor edx, edx
0x180c03acc: mov rcx, qword ptr [rcx + 0x10]
0x180c03ad0: call 0x186149e10 ; System.Array.Clear
0x180c03ad5: jmp 0x180c03a64
0x180c03ad7: mov rdx, qword ptr [rip + 0x7f79402]
0x180c03ade: mov rcx, rbx
0x180c03ae1: call 0x18051df60 ; BattleTimer.EventOnEntryClick | BattleTimer.EventOnTimerPlayNPause | BattleTimer.EventOnTimerRecord | BattleTimer.EventOnTimerReset
0x180c03ae6: jmp 0x180c03b11
0x180c03ae8: mov rdx, qword ptr [rip + 0x7f793f1]
0x180c03aef: mov rcx, qword ptr [rsp + 0x38]
0x180c03af4: call 0x18051df60 ; BattleTimer.EventOnEntryClick | BattleTimer.EventOnTimerPlayNPause | BattleTimer.EventOnTimerRecord | BattleTimer.EventOnTimerReset
0x180c03af9: mov rcx, qword ptr [rsp + 0x30]
0x180c03afe: test rcx, rcx
0x180c03b01: jne 0x180c03c7e
0x180c03b07: xor esi, esi
0x180c03b09: mov rdi, qword ptr [rsp + 0xe0]
0x180c03b11: mov rdx, qword ptr [rdi + 0xa0]
0x180c03b18: test rdx, rdx
0x180c03b1b: je 0x180c03c95
0x180c03b21: mov r8, qword ptr [rip + 0x80639b0]
0x180c03b28: lea rcx, [rsp + 0x30]
0x180c03b2d: call 0x184b54de0
0x180c03b32: movups xmm0, xmmword ptr [rsp + 0x30]
0x180c03b37: movups xmmword ptr [rsp + 0x90], xmm0
0x180c03b3f: movsd xmm1, qword ptr [rsp + 0x40]
0x180c03b45: movsd qword ptr [rsp + 0xa0], xmm1
0x180c03b4e: mov qword ptr [rsp + 0x30], rsi
0x180c03b53: lea rbx, [rsp + 0x90]
0x180c03b5b: mov qword ptr [rsp + 0x38], rbx
0x180c03b60: mov rdx, qword ptr [rip + 0x8064eb9]
0x180c03b67: lea rcx, [rsp + 0x90]
0x180c03b6f: call 0x185cc1470
0x180c03b74: test al, al
0x180c03b76: je 0x180c03c1f
0x180c03b7c: mov r14d, dword ptr [rsp + 0xa0]
0x180c03b84: mov rcx, qword ptr [rdi + 0xb8]
0x180c03b8b: test rcx, rcx
0x180c03b8e: je 0x180c03c89
0x180c03b94: mov r9, qword ptr [rip + 0x7f4dc45]
0x180c03b9b: lea r8, [rsp + 0x58]
0x180c03ba0: mov edx, r14d
0x180c03ba3: call 0x184cb20a0
0x180c03ba8: test al, al
0x180c03baa: je 0x180c03b60
0x180c03bac: mov rcx, qword ptr [rdi + 0xc0]
0x180c03bb3: test rcx, rcx
0x180c03bb6: je 0x180c03c84
0x180c03bbc: mov r9, qword ptr [rip + 0x7f4dc1d]
0x180c03bc3: lea r8, [rsp + 0x50]
0x180c03bc8: mov edx, r14d
0x180c03bcb: call 0x184cb20a0
0x180c03bd0: test al, al
0x180c03bd2: je 0x180c03b60
0x180c03bd4: mov qword ptr [rsp + 0x28], rsi
0x180c03bd9: mov rax, qword ptr [rsp + 0x50]
0x180c03bde: mov qword ptr [rsp + 0x20], rax
0x180c03be3: mov r9, qword ptr [rsp + 0x58]
0x180c03be8: mov r8d, r14d
0x180c03beb: mov rdx, qword ptr [rdi + 0x20]
0x180c03bef: mov rcx, rdi
0x180c03bf2: call 0x180c029b0 ; Torappu.Battle.AutoChess.AutoChessBattleDataModel._LoadBattlePlayerData
0x180c03bf7: mov qword ptr [rsp + 0x28], rsi
0x180c03bfc: mov rax, qword ptr [rsp + 0x50]
0x180c03c01: mov qword ptr [rsp + 0x20], rax
0x180c03c06: mov r9, qword ptr [rsp + 0x58]
0x180c03c0b: mov r8d, r14d
0x180c03c0e: mov rdx, qword ptr [rdi + 0x30]
0x180c03c12: mov rcx, rdi
0x180c03c15: call 0x180c029b0 ; Torappu.Battle.AutoChess.AutoChessBattleDataModel._LoadBattlePlayerData
0x180c03c1a: jmp 0x180c03b60
0x180c03c1f: mov rdx, qword ptr [rip + 0x8064bb2]
0x180c03c26: mov rcx, rbx
0x180c03c29: call 0x18051df60 ; BattleTimer.EventOnEntryClick | BattleTimer.EventOnTimerPlayNPause | BattleTimer.EventOnTimerRecord | BattleTimer.EventOnTimerReset
0x180c03c2e: jmp 0x180c03c58
0x180c03c30: mov rdx, qword ptr [rip + 0x8064ba1]
0x180c03c37: mov rcx, qword ptr [rsp + 0x38]
0x180c03c3c: call 0x18051df60 ; BattleTimer.EventOnEntryClick | BattleTimer.EventOnTimerPlayNPause | BattleTimer.EventOnTimerRecord | BattleTimer.EventOnTimerReset
0x180c03c41: mov rcx, qword ptr [rsp + 0x30]
0x180c03c46: test rcx, rcx
0x180c03c49: jne 0x180c03c8f
0x180c03c4b: jmp 0x180c03c58
0x180c03c4d: xor r8d, r8d
0x180c03c50: mov rdx, rdi
0x180c03c53: call 0x1833c9ac0 ; XLua.DelegateBridge.__Gen_Delegate_Imp27
0x180c03c58: mov rbx, qword ptr [rsp + 0xe8]
0x180c03c60: add rsp, 0xc0
0x180c03c67: pop r14
0x180c03c69: pop rdi
0x180c03c6a: pop rsi
0x180c03c6b: ret
0x180c03c6c: call 0x18049c3c0
0x180c03c71: nop
0x180c03c72: call 0x180483060
0x180c03c77: nop
0x180c03c78: call 0x18049c3c0
0x180c03c7d: nop
0x180c03c7e: call 0x180483060
0x180c03c83: nop
0x180c03c84: call 0x18049c3c0
0x180c03c89: call 0x18049c3c0
0x180c03c8e: nop
0x180c03c8f: call 0x180483060
0x180c03c94: int3
0x180c03c95: call 0x18049c3c0
0x180c03c9a: int3
0x180c03c9b: int3
0x180c03c9c: int3
0x180c03c9d: int3
0x180c03c9e: int3
0x180c03c9f: int3
