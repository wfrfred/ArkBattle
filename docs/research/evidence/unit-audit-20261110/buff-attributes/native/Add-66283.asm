0x1806e0430: mov qword ptr [rsp + 8], rbx
0x1806e0435: mov qword ptr [rsp + 0x10], rsi
0x1806e043a: push rdi
0x1806e043b: sub rsp, 0x20
0x1806e043f: cmp byte ptr [rip + 0x88baf4b], 0
0x1806e0446: mov rsi, rdx
0x1806e0449: mov rdi, rcx
0x1806e044c: jne 0x1806e0461
0x1806e044e: lea rcx, [rip + 0x856ce8b]
0x1806e0455: call 0x18049c210
0x1806e045a: mov byte ptr [rip + 0x88baf30], 1
0x1806e0461: xor ebx, ebx
0x1806e0463: cmp byte ptr [rip + 0x88baf29], 0
0x1806e046a: jne 0x1806e047f
0x1806e046c: lea rcx, [rip + 0x856d0b5]
0x1806e0473: call 0x18049c210
0x1806e0478: mov byte ptr [rip + 0x88baf14], 1
0x1806e047f: cmp qword ptr [rdi + 0x10], 0
0x1806e0484: jne 0x1806e048a
0x1806e0486: xor eax, eax
0x1806e0488: jmp 0x1806e049a
0x1806e048a: mov rdx, qword ptr [rip + 0x856d097]
0x1806e0491: mov rcx, qword ptr [rdi + 0x10]
0x1806e0495: call 0x184af5400
0x1806e049a: cmp ebx, eax
0x1806e049c: jge 0x1806e04be
0x1806e049e: mov rcx, qword ptr [rdi + 0x10]
0x1806e04a2: test rcx, rcx
0x1806e04a5: je 0x1806e04fc
0x1806e04a7: mov r8, qword ptr [rip + 0x856ce32]
0x1806e04ae: mov edx, ebx
0x1806e04b0: call 0x184cde840
0x1806e04b5: cmp rax, rsi
0x1806e04b8: je 0x1806e04ea
0x1806e04ba: inc ebx
0x1806e04bc: jmp 0x1806e0463
0x1806e04be: xor r8d, r8d
0x1806e04c1: mov rdx, rsi
0x1806e04c4: mov rcx, rdi
0x1806e04c7: call 0x1806e0a50 ; Torappu.Battle.Buff/OverrideGroup._DoAddInternal
0x1806e04cc: test al, al
0x1806e04ce: jne 0x1806e04e0
0x1806e04d0: mov rbx, qword ptr [rsp + 0x30]
0x1806e04d5: mov rsi, qword ptr [rsp + 0x38]
0x1806e04da: add rsp, 0x20
0x1806e04de: pop rdi
0x1806e04df: ret 
0x1806e04e0: xor edx, edx
0x1806e04e2: mov rcx, rdi
0x1806e04e5: call 0x1806e1030 ; Torappu.Battle.Buff/OverrideGroup._DoUpdateInternal
0x1806e04ea: mov rbx, qword ptr [rsp + 0x30]
0x1806e04ef: mov al, 1
0x1806e04f1: mov rsi, qword ptr [rsp + 0x38]
0x1806e04f6: add rsp, 0x20
0x1806e04fa: pop rdi
0x1806e04fb: ret 
0x1806e04fc: call 0x18049c3c0
0x1806e0501: int3 
0x1806e0502: int3 
0x1806e0503: int3 
0x1806e0504: int3 
0x1806e0505: int3 
0x1806e0506: int3 
0x1806e0507: int3 
0x1806e0508: int3 
0x1806e0509: int3 
0x1806e050a: int3 
0x1806e050b: int3 
0x1806e050c: int3 
0x1806e050d: int3 
0x1806e050e: int3 
0x1806e050f: int3 
