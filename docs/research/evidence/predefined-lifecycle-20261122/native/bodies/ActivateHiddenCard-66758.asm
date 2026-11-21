; Torappu.Battle.Deck.ActivateHiddenCard metadata=66758 VA=0x1806f86c0
0x1806f86c0: mov qword ptr [rsp + 8], rbx
0x1806f86c5: mov qword ptr [rsp + 0x10], rbp
0x1806f86ca: mov qword ptr [rsp + 0x18], rsi
0x1806f86cf: push rdi
0x1806f86d0: sub rsp, 0x30
0x1806f86d4: cmp byte ptr [rip + 0x88a2e5e], 0
0x1806f86db: mov rbx, r9
0x1806f86de: mov rsi, r8
0x1806f86e1: mov rbp, rdx
0x1806f86e4: mov rdi, rcx
0x1806f86e7: jne 0x1806f86fc
0x1806f86e9: lea rcx, [rip + 0x8433090]
0x1806f86f0: call 0x18049c210
0x1806f86f5: mov byte ptr [rip + 0x88a2e3d], 1
0x1806f86fc: mov rax, qword ptr [rip + 0x843307d]
0x1806f8703: mov r10, qword ptr [rax + 0xb8]
0x1806f870a: mov rcx, qword ptr [r10 + 0x128]
0x1806f8711: test rcx, rcx
0x1806f8714: jne 0x1806f874f
0x1806f8716: xor r8d, r8d
0x1806f8719: mov rdx, rbp
0x1806f871c: mov rcx, rdi
0x1806f871f: call 0x1806f9850 ; Torappu.Battle.Deck.FindCardByAlias
0x1806f8724: mov rdx, rax
0x1806f8727: mov qword ptr [rbx], rax
0x1806f872a: mov rcx, rbx
0x1806f872d: call 0x18049bcf0
0x1806f8732: cmp qword ptr [rbx], 0
0x1806f8736: je 0x1806f874b
0x1806f8738: mov rdx, qword ptr [rbx]
0x1806f873b: xor r9d, r9d
0x1806f873e: mov r8, rsi
0x1806f8741: mov rcx, rdi
0x1806f8744: call 0x1806f84d0 ; Torappu.Battle.Deck.ActivateHiddenCard
0x1806f8749: jmp 0x1806f876b
0x1806f874b: xor al, al
0x1806f874d: jmp 0x1806f876b
0x1806f874f: mov qword ptr [rsp + 0x28], 0
0x1806f8758: mov r9, rsi
0x1806f875b: mov r8, rbp
0x1806f875e: mov qword ptr [rsp + 0x20], rbx
0x1806f8763: mov rdx, rdi
0x1806f8766: call 0x1833f2fc0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3061
0x1806f876b: mov rbx, qword ptr [rsp + 0x40]
0x1806f8770: mov rbp, qword ptr [rsp + 0x48]
0x1806f8775: mov rsi, qword ptr [rsp + 0x50]
0x1806f877a: add rsp, 0x30
0x1806f877e: pop rdi
0x1806f877f: ret
