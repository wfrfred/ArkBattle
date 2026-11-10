0x1853acb60: mov qword ptr [rsp + 8], rbx
0x1853acb65: mov qword ptr [rsp + 0x10], rbp
0x1853acb6a: mov qword ptr [rsp + 0x18], rsi
0x1853acb6f: push rdi
0x1853acb70: sub rsp, 0x20
0x1853acb74: mov rbx, r8
0x1853acb77: mov rdi, rdx
0x1853acb7a: mov rbp, rcx
0x1853acb7d: test rdx, rdx
0x1853acb80: je 0x1853accb6
0x1853acb86: mov rsi, qword ptr [rcx + 0x28]
0x1853acb8a: test rsi, rsi
0x1853acb8d: je 0x1853acccd
0x1853acb93: mov rax, qword ptr [r8 + 0x20]
0x1853acb97: mov r9, qword ptr [rax + 0xc0]
0x1853acb9e: mov rax, qword ptr [r9 + 0x98]
0x1853acba5: cmp qword ptr [rax + 0x20], 0
0x1853acbaa: jne 0x1853acbc0
0x1853acbac: mov rax, qword ptr [r8 + 0x20]
0x1853acbb0: mov rdx, qword ptr [rax + 0xc0]
0x1853acbb7: mov rax, qword ptr [rdx + 0x98]
0x1853acbbe: call qword ptr [rax]
0x1853acbc0: mov rax, qword ptr [rbx + 0x20]
0x1853acbc4: mov rdx, rdi
0x1853acbc7: mov rcx, rsi
0x1853acbca: mov r8, qword ptr [rax + 0xc0]
0x1853acbd1: mov r8, qword ptr [r8 + 0x98]
0x1853acbd8: call 0x184b7c030
0x1853acbdd: test al, al
0x1853acbdf: je 0x1853accb6
0x1853acbe5: mov rax, qword ptr [rbx + 0x20]
0x1853acbe9: mov rcx, qword ptr [rax + 0xc0]
0x1853acbf0: mov rax, qword ptr [rcx + 0xa0]
0x1853acbf7: cmp qword ptr [rax + 0x20], 0
0x1853acbfc: jne 0x1853acc12
0x1853acbfe: mov rax, qword ptr [rbx + 0x20]
0x1853acc02: mov rcx, qword ptr [rax + 0xc0]
0x1853acc09: mov rax, qword ptr [rcx + 0xa0]
0x1853acc10: call qword ptr [rax]
0x1853acc12: mov rax, qword ptr [rbx + 0x20]
0x1853acc16: mov rsi, qword ptr [rbp + 0x20]
0x1853acc1a: mov rcx, qword ptr [rax + 0xc0]
0x1853acc21: mov rbx, qword ptr [rcx + 0xa0]
0x1853acc28: test rsi, rsi
0x1853acc2b: je 0x1853acccd
0x1853acc31: mov rax, qword ptr [rbx + 0x20]
0x1853acc35: mov rdx, qword ptr [rax + 0xc0]
0x1853acc3c: mov rax, qword ptr [rdx + 0xd8]
0x1853acc43: cmp qword ptr [rax + 0x20], 0
0x1853acc48: jne 0x1853acc5e
0x1853acc4a: mov rax, qword ptr [rbx + 0x20]
0x1853acc4e: mov rdx, qword ptr [rax + 0xc0]
0x1853acc55: mov rax, qword ptr [rdx + 0xd8]
0x1853acc5c: call qword ptr [rax]
0x1853acc5e: mov rax, qword ptr [rbx + 0x20]
0x1853acc62: mov rdx, rdi
0x1853acc65: mov rcx, rsi
0x1853acc68: mov r8, qword ptr [rax + 0xc0]
0x1853acc6f: mov r8, qword ptr [r8 + 0xd8]
0x1853acc76: call 0x1855c0250
0x1853acc7b: mov rax, qword ptr [rbx + 0x20]
0x1853acc7f: mov rcx, qword ptr [rax + 0xc0]
0x1853acc86: mov rax, qword ptr [rcx + 0x90]
0x1853acc8d: cmp qword ptr [rax + 0x20], 0
0x1853acc92: jne 0x1853acca8
0x1853acc94: mov rax, qword ptr [rbx + 0x20]
0x1853acc98: mov rcx, qword ptr [rax + 0xc0]
0x1853acc9f: mov rax, qword ptr [rcx + 0x90]
0x1853acca6: call qword ptr [rax]
0x1853acca8: xor edx, edx
0x1853accaa: mov rcx, rdi
0x1853accad: call 0x185e87f60
0x1853accb2: mov al, 1
0x1853accb4: jmp 0x1853accb8
0x1853accb6: xor al, al
0x1853accb8: mov rbx, qword ptr [rsp + 0x30]
0x1853accbd: mov rbp, qword ptr [rsp + 0x38]
0x1853accc2: mov rsi, qword ptr [rsp + 0x40]
0x1853accc7: add rsp, 0x20
0x1853acccb: pop rdi
0x1853acccc: ret
0x1853acccd: call 0x18049c3c0
0x1853accd2: int3
