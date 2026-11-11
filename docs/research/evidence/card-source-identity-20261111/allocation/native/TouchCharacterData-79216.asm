0x180b0af50: mov qword ptr [rsp + 8], rbx
0x180b0af55: mov qword ptr [rsp + 0x10], rbp
0x180b0af5a: mov qword ptr [rsp + 0x18], rsi
0x180b0af5f: push rdi
0x180b0af60: sub rsp, 0x50
0x180b0af64: cmp byte ptr [rip + 0x8492d3d], 0
0x180b0af6b: mov edi, r9d
0x180b0af6e: movzx esi, r8b
0x180b0af72: movzx ebp, dl
0x180b0af75: mov rbx, rcx
0x180b0af78: jne 0x180b0af8d
0x180b0af7a: lea rcx, [rip + 0x800514f]
0x180b0af81: call 0x18049c210
0x180b0af86: mov byte ptr [rip + 0x8492d1b], 1
0x180b0af8d: mov rax, qword ptr [rip + 0x800513c]
0x180b0af94: mov r10, qword ptr [rax + 0xb8]
0x180b0af9b: mov rcx, qword ptr [r10 + 8]
0x180b0af9f: test rcx, rcx
0x180b0afa2: jne 0x180b0afdc
0x180b0afa4: test rbx, rbx
0x180b0afa7: je 0x180b0b00c
0x180b0afa9: mov rcx, qword ptr [rbx + 0x10]
0x180b0afad: xor eax, eax
0x180b0afaf: mov qword ptr [rsp + 0x40], rax
0x180b0afb4: movzx r9d, sil
0x180b0afb8: mov qword ptr [rsp + 0x38], rax
0x180b0afbd: movzx r8d, bpl
0x180b0afc1: mov dword ptr [rsp + 0x30], edi
0x180b0afc5: mov rdx, rbx
0x180b0afc8: mov byte ptr [rsp + 0x28], al
0x180b0afcc: mov rax, qword ptr [rbx + 0x38]
0x180b0afd0: mov qword ptr [rsp + 0x20], rax
0x180b0afd5: call 0x180b0b0f0 ; Torappu.Battle.BattleDataConverter._ConvertInternal
0x180b0afda: jmp 0x180b0aff7
0x180b0afdc: xor eax, eax
0x180b0afde: movzx r9d, sil
0x180b0afe2: mov qword ptr [rsp + 0x28], rax
0x180b0afe7: movzx r8d, bpl
0x180b0afeb: mov rdx, rbx
0x180b0afee: mov dword ptr [rsp + 0x20], edi
0x180b0aff2: call 0x18326f0e0 ; XLua.DelegateBridge.__Gen_Delegate_Imp12526
0x180b0aff7: mov rbx, qword ptr [rsp + 0x60]
0x180b0affc: mov rbp, qword ptr [rsp + 0x68]
0x180b0b001: mov rsi, qword ptr [rsp + 0x70]
0x180b0b006: add rsp, 0x50
0x180b0b00a: pop rdi
0x180b0b00b: ret
0x180b0b00c: call 0x18049c3c0
0x180b0b011: int3
0x180b0b012: int3
0x180b0b013: int3
0x180b0b014: int3
0x180b0b015: int3
0x180b0b016: int3
0x180b0b017: int3
0x180b0b018: int3
0x180b0b019: int3
0x180b0b01a: int3
0x180b0b01b: int3
0x180b0b01c: int3
0x180b0b01d: int3
0x180b0b01e: int3
0x180b0b01f: int3
