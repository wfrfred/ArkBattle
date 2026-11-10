0x1806dfa10: mov qword ptr [rsp + 0x18], rbp
0x1806dfa15: push rsi
0x1806dfa16: sub rsp, 0x50
0x1806dfa1a: cmp byte ptr [rip + 0x88bb967], 0
0x1806dfa21: mov rbp, rdx
0x1806dfa24: mov rsi, rcx
0x1806dfa27: jne 0x1806dfa78
0x1806dfa29: lea rcx, [rip + 0x858b5d8]
0x1806dfa30: call 0x18049c210
0x1806dfa35: lea rcx, [rip + 0x849f1fc]
0x1806dfa3c: call 0x18049c210
0x1806dfa41: lea rcx, [rip + 0x849f690]
0x1806dfa48: call 0x18049c210
0x1806dfa4d: lea rcx, [rip + 0x849f8d4]
0x1806dfa54: call 0x18049c210
0x1806dfa59: lea rcx, [rip + 0x852c6d0]
0x1806dfa60: call 0x18049c210
0x1806dfa65: lea rcx, [rip + 0x852cb5c]
0x1806dfa6c: call 0x18049c210
0x1806dfa71: mov byte ptr [rip + 0x88bb910], 1
0x1806dfa78: mov rax, qword ptr [rip + 0x858b589]
0x1806dfa7f: xorps xmm0, xmm0
0x1806dfa82: movups xmmword ptr [rsp + 0x20], xmm0
0x1806dfa87: mov rcx, qword ptr [rax + 0xb8]
0x1806dfa8e: mov rcx, qword ptr [rcx]
0x1806dfa91: test rcx, rcx
0x1806dfa94: jne 0x1806dfbb5
0x1806dfa9a: test rbp, rbp
0x1806dfa9d: je 0x1806dfba8
0x1806dfaa3: mov qword ptr [rsp + 0x68], rdi
0x1806dfaa8: mov qword ptr [rsp + 0x60], rbx
0x1806dfaad: mov rdi, qword ptr [rsi + 0x10]
0x1806dfab1: test rdi, rdi
0x1806dfab4: je 0x1806dfbce
0x1806dfaba: mov edi, dword ptr [rdi + 0x18]
0x1806dfabd: sub edi, 1
0x1806dfac0: js 0x1806dfb76
0x1806dfac6: nop word ptr [rax + rax]
0x1806dfad0: mov rdx, qword ptr [rsi + 0x10]
0x1806dfad4: test rdx, rdx
0x1806dfad7: je 0x1806dfbce
0x1806dfadd: mov r9, qword ptr [rip + 0x849f844]
0x1806dfae4: lea rcx, [rsp + 0x30]
0x1806dfae9: mov r8d, edi
0x1806dfaec: call 0x184ceb8d0
0x1806dfaf1: movaps xmm0, xmmword ptr [rsp + 0x30]
0x1806dfaf6: lea rcx, [rsp + 0x20]
0x1806dfafb: mov rdx, qword ptr [rip + 0x852cac6]
0x1806dfb02: movdqa xmmword ptr [rsp + 0x20], xmm0
0x1806dfb08: call 0x1853ae780
0x1806dfb0d: test al, al
0x1806dfb0f: je 0x1806dfb6d
0x1806dfb11: mov rdx, qword ptr [rsi + 0x10]
0x1806dfb15: test rdx, rdx
0x1806dfb18: je 0x1806dfbce
0x1806dfb1e: mov r9, qword ptr [rip + 0x849f803]
0x1806dfb25: lea rcx, [rsp + 0x40]
0x1806dfb2a: mov r8d, edi
0x1806dfb2d: call 0x184ceb8d0
0x1806dfb32: movaps xmm0, xmmword ptr [rsp + 0x40]
0x1806dfb37: lea rcx, [rsp + 0x20]
0x1806dfb3c: mov rdx, qword ptr [rip + 0x852c5ed]
0x1806dfb43: movdqa xmmword ptr [rsp + 0x20], xmm0
0x1806dfb49: call 0x1853ae540
0x1806dfb4e: test rax, rax
0x1806dfb51: je 0x1806dfbce
0x1806dfb53: xor edx, edx
0x1806dfb55: mov rcx, rax
0x1806dfb58: call 0x1806ddbe0 ; Torappu.Battle.Buff.get_instanceUid
0x1806dfb5d: xor edx, edx
0x1806dfb5f: mov rcx, rbp
0x1806dfb62: mov ebx, eax
0x1806dfb64: call 0x1806ddbe0 ; Torappu.Battle.Buff.get_instanceUid
0x1806dfb69: cmp ebx, eax
0x1806dfb6b: je 0x1806dfb8d
0x1806dfb6d: sub edi, 1
0x1806dfb70: jns 0x1806dfad0
0x1806dfb76: xor al, al
0x1806dfb78: mov rbx, qword ptr [rsp + 0x60]
0x1806dfb7d: mov rdi, qword ptr [rsp + 0x68]
0x1806dfb82: mov rbp, qword ptr [rsp + 0x70]
0x1806dfb87: add rsp, 0x50
0x1806dfb8b: pop rsi
0x1806dfb8c: ret
0x1806dfb8d: mov rcx, qword ptr [rsi + 0x10]
0x1806dfb91: test rcx, rcx
0x1806dfb94: je 0x1806dfbce
0x1806dfb96: mov r8, qword ptr [rip + 0x849f09b]
0x1806dfb9d: mov edx, edi
0x1806dfb9f: call 0x184ce62f0
0x1806dfba4: mov al, 1
0x1806dfba6: jmp 0x1806dfb78
0x1806dfba8: xor al, al
0x1806dfbaa: mov rbp, qword ptr [rsp + 0x70]
0x1806dfbaf: add rsp, 0x50
0x1806dfbb3: pop rsi
0x1806dfbb4: ret
0x1806dfbb5: xor r9d, r9d
0x1806dfbb8: mov r8, rbp
0x1806dfbbb: mov rdx, rsi
0x1806dfbbe: call 0x1833e9f80 ; XLua.DelegateBridge.__Gen_Delegate_Imp29
0x1806dfbc3: mov rbp, qword ptr [rsp + 0x70]
0x1806dfbc8: add rsp, 0x50
0x1806dfbcc: pop rsi
0x1806dfbcd: ret
0x1806dfbce: call 0x18049c3c0
0x1806dfbd3: int3
0x1806dfbd4: int3
0x1806dfbd5: int3
0x1806dfbd6: int3
0x1806dfbd7: int3
0x1806dfbd8: int3
0x1806dfbd9: int3
0x1806dfbda: int3
0x1806dfbdb: int3
0x1806dfbdc: int3
0x1806dfbdd: int3
0x1806dfbde: int3
0x1806dfbdf: int3
