0x1806cd650: mov qword ptr [rsp + 0x10], rbx
0x1806cd655: push rdi
0x1806cd656: sub rsp, 0x30
0x1806cd65a: cmp byte ptr [rip + 0x88cdd7d], 0
0x1806cd661: mov rbx, rdx
0x1806cd664: mov rdi, rcx
0x1806cd667: jne 0x1806cd688
0x1806cd669: lea rcx, [rip + 0x859d750]
0x1806cd670: call 0x18049c210
0x1806cd675: lea rcx, [rip + 0x84b997c]
0x1806cd67c: call 0x18049c210
0x1806cd681: mov byte ptr [rip + 0x88cdd56], 1
0x1806cd688: mov rax, qword ptr [rip + 0x859d731]
0x1806cd68f: mov r8, qword ptr [rax + 0xb8]
0x1806cd696: mov rcx, qword ptr [r8 + 0x228]
0x1806cd69d: test rcx, rcx
0x1806cd6a0: jne 0x1806cd714
0x1806cd6a2: mov qword ptr [rsp + 0x40], rsi
0x1806cd6a7: mov rcx, qword ptr [rdi + 0x18]
0x1806cd6ab: test rcx, rcx
0x1806cd6ae: je 0x1806cd72c
0x1806cd6b0: xor r8d, r8d
0x1806cd6b3: mov rdx, rbx
0x1806cd6b6: call 0x1806dfa10 ; Torappu.Battle.Buff/DoubleBufferedBuffList.Remove
0x1806cd6bb: mov rsi, qword ptr [rdi + 0x28]
0x1806cd6bf: test rbx, rbx
0x1806cd6c2: je 0x1806cd72c
0x1806cd6c4: xor edx, edx
0x1806cd6c6: mov rcx, rbx
0x1806cd6c9: call 0x1806ddbe0 ; Torappu.Battle.Buff.get_instanceUid
0x1806cd6ce: test rsi, rsi
0x1806cd6d1: je 0x1806cd72c
0x1806cd6d3: mov r8, qword ptr [rip + 0x84b991e]
0x1806cd6da: mov edx, eax
0x1806cd6dc: mov rcx, rsi
0x1806cd6df: call 0x185bdca30
0x1806cd6e4: mov r9b, 1
0x1806cd6e7: mov qword ptr [rsp + 0x28], 0
0x1806cd6f0: movzx r8d, r9b
0x1806cd6f4: mov byte ptr [rsp + 0x20], 0
0x1806cd6f9: mov rdx, rbx
0x1806cd6fc: mov rcx, rdi
0x1806cd6ff: call 0x1806cd740 ; Torappu.Battle.Buff/BuffContainer._FinishBuff
0x1806cd704: mov rsi, qword ptr [rsp + 0x40]
0x1806cd709: mov rbx, qword ptr [rsp + 0x48]
0x1806cd70e: add rsp, 0x30
0x1806cd712: pop rdi
0x1806cd713: ret
0x1806cd714: xor r9d, r9d
0x1806cd717: mov r8, rbx
0x1806cd71a: mov rdx, rdi
0x1806cd71d: mov rbx, qword ptr [rsp + 0x48]
0x1806cd722: add rsp, 0x30
0x1806cd726: pop rdi
0x1806cd727: jmp 0x18338c7c0 ; XLua.DelegateBridge.__Gen_Delegate_Imp23
0x1806cd72c: call 0x18049c3c0
0x1806cd731: int3
0x1806cd732: int3
0x1806cd733: int3
0x1806cd734: int3
0x1806cd735: int3
0x1806cd736: int3
0x1806cd737: int3
0x1806cd738: int3
0x1806cd739: int3
0x1806cd73a: int3
0x1806cd73b: int3
0x1806cd73c: int3
0x1806cd73d: int3
0x1806cd73e: int3
0x1806cd73f: int3
