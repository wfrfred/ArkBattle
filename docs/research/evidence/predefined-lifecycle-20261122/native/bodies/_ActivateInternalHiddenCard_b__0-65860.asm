; Torappu.Battle.BattleController/<>c__DisplayClass444_0.<ActivateInternalHiddenCard>b__0 metadata=65860 VA=0x18068fbd0
0x18068fbd0: mov qword ptr [rsp + 0x10], rbx
0x18068fbd5: push rdi
0x18068fbd6: sub rsp, 0x30
0x18068fbda: cmp byte ptr [rip + 0x890b57f], 0
0x18068fbe1: mov rdi, rdx
0x18068fbe4: mov rbx, rcx
0x18068fbe7: jne 0x18068fbfc
0x18068fbe9: lea rcx, [rip + 0x8570068]
0x18068fbf0: call 0x18049c210
0x18068fbf5: mov byte ptr [rip + 0x890b564], 1
0x18068fbfc: xor eax, eax
0x18068fbfe: mov qword ptr [rsp + 0x40], rax
0x18068fc03: test rdi, rdi
0x18068fc06: je 0x18068fc63
0x18068fc08: mov r8, qword ptr [rbx + 0x18]
0x18068fc0c: lea r9, [rsp + 0x40]
0x18068fc11: mov rdx, qword ptr [rbx + 0x10]
0x18068fc15: mov rcx, rdi
0x18068fc18: mov qword ptr [rsp + 0x20], rax
0x18068fc1d: call 0x1806f86c0 ; Torappu.Battle.Deck.ActivateHiddenCard
0x18068fc22: test al, al
0x18068fc24: je 0x18068fc58
0x18068fc26: mov rcx, qword ptr [rbx + 0x20]
0x18068fc2a: test rcx, rcx
0x18068fc2d: je 0x18068fc63
0x18068fc2f: xor edx, edx
0x18068fc31: call 0x1806701b0 ; Torappu.Battle.BattleController.get_eventPool
0x18068fc36: test rax, rax
0x18068fc39: je 0x18068fc63
0x18068fc3b: mov r9, qword ptr [rip + 0x8570016]
0x18068fc42: mov edx, 0x1b
0x18068fc47: mov r8, qword ptr [rsp + 0x40]
0x18068fc4c: mov rcx, rax
0x18068fc4f: call 0x184af4d90
0x18068fc54: mov byte ptr [rbx + 0x28], 1
0x18068fc58: mov rbx, qword ptr [rsp + 0x48]
0x18068fc5d: add rsp, 0x30
0x18068fc61: pop rdi
0x18068fc62: ret
0x18068fc63: call 0x18049c3c0
0x18068fc68: int3
0x18068fc69: int3
0x18068fc6a: int3
0x18068fc6b: int3
0x18068fc6c: int3
0x18068fc6d: int3
0x18068fc6e: int3
0x18068fc6f: int3
