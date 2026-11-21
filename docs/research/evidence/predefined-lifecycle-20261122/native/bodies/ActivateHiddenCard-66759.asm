; Torappu.Battle.Deck.ActivateHiddenCard metadata=66759 VA=0x1806f84d0
0x1806f84d0: mov qword ptr [rsp + 0x10], rbp
0x1806f84d5: mov qword ptr [rsp + 0x18], rsi
0x1806f84da: push rdi
0x1806f84db: sub rsp, 0x30
0x1806f84df: cmp byte ptr [rip + 0x88a3054], 0
0x1806f84e6: mov rsi, r8
0x1806f84e9: mov rdi, rdx
0x1806f84ec: mov rbp, rcx
0x1806f84ef: jne 0x1806f8534
0x1806f84f1: lea rcx, [rip + 0x8433288]
0x1806f84f8: call 0x18049c210
0x1806f84fd: lea rcx, [rip + 0x8473234]
0x1806f8504: call 0x18049c210
0x1806f8509: lea rcx, [rip + 0x8474008]
0x1806f8510: call 0x18049c210
0x1806f8515: lea rcx, [rip + 0x854965c]
0x1806f851c: call 0x18049c210
0x1806f8521: lea rcx, [rip + 0x84b9638]
0x1806f8528: call 0x18049c210
0x1806f852d: mov byte ptr [rip + 0x88a3006], 1
0x1806f8534: mov rax, qword ptr [rip + 0x8433245]
0x1806f853b: mov qword ptr [rsp + 0x40], rbx
0x1806f8540: mov rcx, qword ptr [rax + 0xb8]
0x1806f8547: mov rcx, qword ptr [rcx + 0x130]
0x1806f854e: test rcx, rcx
0x1806f8551: jne 0x1806f8690
0x1806f8557: test rdi, rdi
0x1806f855a: je 0x1806f86ba
0x1806f8560: xor edx, edx
0x1806f8562: mov rcx, rdi
0x1806f8565: call 0x1806f2a20 ; Torappu.Battle.Deck/Card.get_isHidden
0x1806f856a: test al, al
0x1806f856c: jne 0x1806f8573
0x1806f856e: jmp 0x1806f86a5
0x1806f8573: xor r9d, r9d
0x1806f8576: mov r8, rsi
0x1806f8579: xor edx, edx
0x1806f857b: mov rcx, rdi
0x1806f857e: call 0x1806ee9f0 ; Torappu.Battle.Deck/Card.SetHidden
0x1806f8583: mov rcx, qword ptr [rip + 0x84b95d6]
0x1806f858a: call 0x18558e720
0x1806f858f: test rax, rax
0x1806f8592: je 0x1806f86ba
0x1806f8598: xor edx, edx
0x1806f859a: mov rcx, rax
0x1806f859d: call 0x180670490 ; Torappu.Battle.BattleController.get_gameMode
0x1806f85a2: mov rdx, qword ptr [rip + 0x85495cf]
0x1806f85a9: mov rsi, rax
0x1806f85ac: test rax, rax
0x1806f85af: je 0x1806f8670
0x1806f85b5: cmp byte ptr [rip + 0x88e04b4], 0
0x1806f85bc: mov r8, qword ptr [rax]
0x1806f85bf: jbe 0x1806f85cf
0x1806f85c1: mov rcx, r8
0x1806f85c4: call 0x1804566f0
0x1806f85c9: xor ebx, ebx
0x1806f85cb: test al, al
0x1806f85cd: jmp 0x1806f85fb
0x1806f85cf: movzx eax, byte ptr [rdx + 0x130]
0x1806f85d6: xor ebx, ebx
0x1806f85d8: cmp byte ptr [r8 + 0x130], al
0x1806f85df: jb 0x1806f85f7
0x1806f85e1: movzx ecx, al
0x1806f85e4: mov rax, qword ptr [r8 + 0xc8]
0x1806f85eb: cmp qword ptr [rax + rcx*8 - 8], rdx
0x1806f85f0: mov eax, 1
0x1806f85f5: je 0x1806f85f9
0x1806f85f7: mov eax, ebx
0x1806f85f9: test eax, eax
0x1806f85fb: cmovne rbx, rsi
0x1806f85ff: test rbx, rbx
0x1806f8602: je 0x1806f8670
0x1806f8604: xor edx, edx
0x1806f8606: mov rcx, rbx
0x1806f8609: call 0x180cfe280 ; Torappu.Battle.GameMode.GameModeFactory/SandboxGameMode.get_battleManager
0x1806f860e: test rax, rax
0x1806f8611: je 0x1806f86ba
0x1806f8617: xor edx, edx
0x1806f8619: mov rcx, rax
0x1806f861c: call 0x180f310d0 ; Torappu.Battle.Sandbox.SandboxBattleManager.get_originHiddenList
0x1806f8621: test rax, rax
0x1806f8624: je 0x1806f86ba
0x1806f862a: mov r8, qword ptr [rip + 0x8473107]
0x1806f8631: mov rdx, rdi
0x1806f8634: mov rcx, rax
0x1806f8637: call 0x184f453e0
0x1806f863c: test al, al
0x1806f863e: je 0x1806f8670
0x1806f8640: xor edx, edx
0x1806f8642: mov rcx, rbx
0x1806f8645: call 0x180cfe280 ; Torappu.Battle.GameMode.GameModeFactory/SandboxGameMode.get_battleManager
0x1806f864a: test rax, rax
0x1806f864d: je 0x1806f86ba
0x1806f864f: xor edx, edx
0x1806f8651: mov rcx, rax
0x1806f8654: call 0x180f310d0 ; Torappu.Battle.Sandbox.SandboxBattleManager.get_originHiddenList
0x1806f8659: test rax, rax
0x1806f865c: je 0x1806f86ba
0x1806f865e: mov r8, qword ptr [rip + 0x8473eb3]
0x1806f8665: mov rdx, rdi
0x1806f8668: mov rcx, rax
0x1806f866b: call 0x184f4ca00
0x1806f8670: xor edx, edx
0x1806f8672: mov rcx, rdi
0x1806f8675: call 0x1806f2a20 ; Torappu.Battle.Deck/Card.get_isHidden
0x1806f867a: test al, al
0x1806f867c: jne 0x1806f868c
0x1806f867e: xor r8d, r8d
0x1806f8681: mov rdx, rdi
0x1806f8684: mov rcx, rbp
0x1806f8687: call 0x1806fa720 ; Torappu.Battle.Deck.OnCardListChanged
0x1806f868c: mov al, 1
0x1806f868e: jmp 0x1806f86a5
0x1806f8690: xor ebx, ebx
0x1806f8692: mov r9, rsi
0x1806f8695: mov r8, rdi
0x1806f8698: mov qword ptr [rsp + 0x20], rbx
0x1806f869d: mov rdx, rbp
0x1806f86a0: call 0x1833a18e0 ; XLua.DelegateBridge.__Gen_Delegate_Imp252
0x1806f86a5: mov rbx, qword ptr [rsp + 0x40]
0x1806f86aa: mov rbp, qword ptr [rsp + 0x48]
0x1806f86af: mov rsi, qword ptr [rsp + 0x50]
0x1806f86b4: add rsp, 0x30
0x1806f86b8: pop rdi
0x1806f86b9: ret
0x1806f86ba: call 0x18049c3c0
0x1806f86bf: int3
