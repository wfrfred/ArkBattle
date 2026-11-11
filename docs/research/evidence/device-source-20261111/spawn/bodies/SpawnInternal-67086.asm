0x18071da20: mov qword ptr [rsp + 8], rbx
0x18071da25: mov qword ptr [rsp + 0x10], rbp
0x18071da2a: mov qword ptr [rsp + 0x18], rsi
0x18071da2f: push rdi
0x18071da30: sub rsp, 0x40
0x18071da34: cmp byte ptr [rip + 0x887dc14], 0
0x18071da3b: movzx ebx, r9b
0x18071da3f: mov rdi, r8
0x18071da42: mov esi, edx
0x18071da44: mov rbp, rcx
0x18071da47: jne 0x18071da68
0x18071da49: lea rcx, [rip + 0x8494110]
0x18071da50: call 0x18049c210
0x18071da55: lea rcx, [rip + 0x84a552c]
0x18071da5c: call 0x18049c210
0x18071da61: mov byte ptr [rip + 0x887dbe7], 1
0x18071da68: mov rax, qword ptr [rip + 0x84a5519]
0x18071da6f: mov r8, qword ptr [rax + 0xb8]
0x18071da76: mov rcx, qword ptr [r8 + 0xa8]
0x18071da7d: test rcx, rcx
0x18071da80: jne 0x18071dac6
0x18071da82: mov rcx, qword ptr [rip + 0x84940d7]
0x18071da89: call 0x18558e720
0x18071da8e: test rax, rax
0x18071da91: je 0x18071db09
0x18071da93: mov rcx, qword ptr [rsp + 0x78]
0x18071da98: mov r9, rdi
0x18071da9b: mov qword ptr [rsp + 0x38], 0
0x18071daa4: mov r8d, esi
0x18071daa7: mov qword ptr [rsp + 0x30], rcx
0x18071daac: mov rdx, rbp
0x18071daaf: movzx ecx, byte ptr [rsp + 0x70]
0x18071dab4: mov byte ptr [rsp + 0x28], cl
0x18071dab8: mov rcx, rax
0x18071dabb: mov byte ptr [rsp + 0x20], bl
0x18071dabf: call 0x180651420 ; Torappu.Battle.BattleController.CreateToken
0x18071dac4: jmp 0x18071daf4
0x18071dac6: mov rax, qword ptr [rsp + 0x78]
0x18071dacb: mov r9, rdi
0x18071dace: mov qword ptr [rsp + 0x38], 0
0x18071dad7: mov r8d, esi
0x18071dada: mov qword ptr [rsp + 0x30], rax
0x18071dadf: mov rdx, rbp
0x18071dae2: movzx eax, byte ptr [rsp + 0x70]
0x18071dae7: mov byte ptr [rsp + 0x28], al
0x18071daeb: mov byte ptr [rsp + 0x20], bl
0x18071daef: call 0x1831976c0 ; XLua.DelegateBridge.__Gen_Delegate_Imp11174
0x18071daf4: mov rbx, qword ptr [rsp + 0x50]
0x18071daf9: mov rbp, qword ptr [rsp + 0x58]
0x18071dafe: mov rsi, qword ptr [rsp + 0x60]
0x18071db03: add rsp, 0x40
0x18071db07: pop rdi
0x18071db08: ret
0x18071db09: call 0x18049c3c0
0x18071db0e: int3
0x18071db0f: int3
