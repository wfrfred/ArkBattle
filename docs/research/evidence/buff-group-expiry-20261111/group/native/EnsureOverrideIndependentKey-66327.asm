0x1806b43c0: mov qword ptr [rsp + 8], rbx
0x1806b43c5: mov qword ptr [rsp + 0x10], rsi
0x1806b43ca: push rdi
0x1806b43cb: sub rsp, 0x40
0x1806b43cf: cmp byte ptr [rip + 0x88e6fe5], 0
0x1806b43d6: mov rdi, r8
0x1806b43d9: mov rsi, rdx
0x1806b43dc: mov rbx, rcx
0x1806b43df: jne 0x1806b4424
0x1806b43e1: lea rcx, [rip + 0x85b69d8]
0x1806b43e8: call 0x18049c210
0x1806b43ed: lea rcx, [rip + 0x859c324]
0x1806b43f4: call 0x18049c210
0x1806b43f9: lea rcx, [rip + 0x859c7a8]
0x1806b4400: call 0x18049c210
0x1806b4405: lea rcx, [rip + 0x859cc2c]
0x1806b440c: call 0x18049c210
0x1806b4411: lea rcx, [rip + 0x859ce68]
0x1806b4418: call 0x18049c210
0x1806b441d: mov byte ptr [rip + 0x88e6f97], 1
0x1806b4424: mov rax, qword ptr [rip + 0x85b6995]
0x1806b442b: xor edx, edx
0x1806b442d: mov qword ptr [rsp + 0x30], rdx
0x1806b4432: mov rcx, qword ptr [rax + 0xb8]
0x1806b4439: mov rcx, qword ptr [rcx + 0x110]
0x1806b4440: test rcx, rcx
0x1806b4443: jne 0x1806b44cf
0x1806b4449: mov rcx, qword ptr [rbx + 0x20]
0x1806b444d: test rcx, rcx
0x1806b4450: je 0x1806b44f2
0x1806b4456: mov r9, qword ptr [rip + 0x859ce23]
0x1806b445d: lea r8, [rsp + 0x30]
0x1806b4462: mov rdx, rsi
0x1806b4465: call 0x185b2cad0
0x1806b446a: test al, al
0x1806b446c: je 0x1806b44e2
0x1806b446e: mov rcx, qword ptr [rbx + 0x20]
0x1806b4472: test rcx, rcx
0x1806b4475: je 0x1806b44f2
0x1806b4477: mov r8, qword ptr [rip + 0x859c72a]
0x1806b447e: mov rdx, rdi
0x1806b4481: call 0x185ae5f80
0x1806b4486: test al, al
0x1806b4488: jne 0x1806b44e2
0x1806b448a: mov rcx, qword ptr [rbx + 0x20]
0x1806b448e: test rcx, rcx
0x1806b4491: je 0x1806b44f2
0x1806b4493: mov r8, qword ptr [rip + 0x859cb9e]
0x1806b449a: mov rdx, rsi
0x1806b449d: call 0x185b24db0
0x1806b44a2: mov rcx, qword ptr [rbx + 0x20]
0x1806b44a6: test rcx, rcx
0x1806b44a9: je 0x1806b44f2
0x1806b44ab: mov r9, qword ptr [rip + 0x859c266]
0x1806b44b2: mov rdx, rdi
0x1806b44b5: mov r8, qword ptr [rsp + 0x30]
0x1806b44ba: call 0x185b20720
0x1806b44bf: mov rbx, qword ptr [rsp + 0x50]
0x1806b44c4: mov rsi, qword ptr [rsp + 0x58]
0x1806b44c9: add rsp, 0x40
0x1806b44cd: pop rdi
0x1806b44ce: ret
0x1806b44cf: mov qword ptr [rsp + 0x20], rdx
0x1806b44d4: mov r9, rdi
0x1806b44d7: mov rdx, rbx
0x1806b44da: mov r8, rsi
0x1806b44dd: call 0x183458110 ; XLua.DelegateBridge.__Gen_Delegate_Imp36
0x1806b44e2: mov rbx, qword ptr [rsp + 0x50]
0x1806b44e7: mov rsi, qword ptr [rsp + 0x58]
0x1806b44ec: add rsp, 0x40
0x1806b44f0: pop rdi
0x1806b44f1: ret
0x1806b44f2: call 0x18049c3c0
0x1806b44f7: int3
0x1806b44f8: int3
0x1806b44f9: int3
0x1806b44fa: int3
0x1806b44fb: int3
0x1806b44fc: int3
0x1806b44fd: int3
0x1806b44fe: int3
0x1806b44ff: int3
