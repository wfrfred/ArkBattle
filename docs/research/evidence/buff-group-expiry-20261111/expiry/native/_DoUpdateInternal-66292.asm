0x1806e1030: push rsi
0x1806e1032: sub rsp, 0x20
0x1806e1036: cmp byte ptr [rip + 0x88ba35b], 0
0x1806e103d: mov rsi, rcx
0x1806e1040: jne 0x1806e1061
0x1806e1042: lea rcx, [rip + 0x856c297]
0x1806e1049: call 0x18049c210
0x1806e104e: lea rcx, [rip + 0x856c4d3]
0x1806e1055: call 0x18049c210
0x1806e105a: mov byte ptr [rip + 0x88ba337], 1
0x1806e1061: mov rcx, qword ptr [rsi + 0x10]
0x1806e1065: mov qword ptr [rsp + 0x30], rbx
0x1806e106a: mov qword ptr [rsp + 0x38], rbp
0x1806e106f: mov qword ptr [rsp + 0x40], rdi
0x1806e1074: test rcx, rcx
0x1806e1077: je 0x1806e112f
0x1806e107d: mov rdx, qword ptr [rip + 0x856c4a4]
0x1806e1084: call 0x184af5400
0x1806e1089: test eax, eax
0x1806e108b: je 0x1806e111a
0x1806e1091: mov rax, qword ptr [rsi + 0x10]
0x1806e1095: xor ebx, ebx
0x1806e1097: xor bpl, bpl
0x1806e109a: mov edi, ebx
0x1806e109c: test rax, rax
0x1806e109f: je 0x1806e112f
0x1806e10a5: nop word ptr [rax + rax]
0x1806e10b0: mov rdx, qword ptr [rip + 0x856c471]
0x1806e10b7: mov rcx, rax
0x1806e10ba: call 0x184af5400
0x1806e10bf: cmp edi, eax
0x1806e10c1: jge 0x1806e111a
0x1806e10c3: mov rcx, qword ptr [rsi + 0x10]
0x1806e10c7: test rcx, rcx
0x1806e10ca: je 0x1806e112f
0x1806e10cc: mov r8, qword ptr [rip + 0x856c20d]
0x1806e10d3: mov edx, ebx
0x1806e10d5: call 0x184cde840
0x1806e10da: mov rdi, rax
0x1806e10dd: test rax, rax
0x1806e10e0: je 0x1806e112f
0x1806e10e2: test bpl, bpl
0x1806e10e5: jne 0x1806e10fe
0x1806e10e7: xor edx, edx
0x1806e10e9: mov rcx, rax
0x1806e10ec: call 0x1806ddd60 ; Torappu.Battle.Buff.get_isFinished
0x1806e10f1: test al, al
0x1806e10f3: jne 0x1806e10fe
0x1806e10f5: mov bpl, 1
0x1806e10f8: movzx edx, bpl
0x1806e10fc: jmp 0x1806e1100
0x1806e10fe: xor dl, dl
0x1806e1100: xor r8d, r8d
0x1806e1103: mov rcx, rdi
0x1806e1106: call 0x1806df330 ; Torappu.Battle.Buff.set_isEnabled
0x1806e110b: mov rax, qword ptr [rsi + 0x10]
0x1806e110f: inc ebx
0x1806e1111: mov edi, ebx
0x1806e1113: test rax, rax
0x1806e1116: je 0x1806e112f
0x1806e1118: jmp 0x1806e10b0
0x1806e111a: mov rdi, qword ptr [rsp + 0x40]
0x1806e111f: mov rbp, qword ptr [rsp + 0x38]
0x1806e1124: mov rbx, qword ptr [rsp + 0x30]
0x1806e1129: add rsp, 0x20
0x1806e112d: pop rsi
0x1806e112e: ret
0x1806e112f: call 0x18049c3c0
0x1806e1134: int3
0x1806e1135: int3
0x1806e1136: int3
0x1806e1137: int3
0x1806e1138: int3
0x1806e1139: int3
0x1806e113a: int3
0x1806e113b: int3
0x1806e113c: int3
0x1806e113d: int3
0x1806e113e: int3
0x1806e113f: int3
