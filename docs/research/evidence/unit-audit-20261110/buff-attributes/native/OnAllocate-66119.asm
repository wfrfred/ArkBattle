0x1806d0320: push rbx
0x1806d0322: sub rsp, 0x20
0x1806d0326: cmp byte ptr [rip + 0x88cafc1], 0
0x1806d032d: mov rbx, rcx
0x1806d0330: jne 0x1806d0345
0x1806d0332: lea rcx, [rip + 0x847471f]
0x1806d0339: call 0x18049c210
0x1806d033e: mov byte ptr [rip + 0x88cafa9], 1
0x1806d0345: mov rcx, qword ptr [rip + 0x847470c]
0x1806d034c: cmp dword ptr [rcx + 0xe0], 0
0x1806d0353: jne 0x1806d0361
0x1806d0355: call 0x18049c450
0x1806d035a: mov rcx, qword ptr [rip + 0x84746f7]
0x1806d0361: mov rax, qword ptr [rcx + 0xb8]
0x1806d0368: mov r9, qword ptr [rax + 0x2f0]
0x1806d036f: test r9, r9
0x1806d0372: jne 0x1806d0422
0x1806d0378: mov qword ptr [rsp + 0x30], rdi
0x1806d037d: cmp dword ptr [rcx + 0xe0], r9d
0x1806d0384: jne 0x1806d0392
0x1806d0386: call 0x18049c450
0x1806d038b: mov rcx, qword ptr [rip + 0x84746c6]
0x1806d0392: mov rax, qword ptr [rcx + 0xb8]
0x1806d0399: mov edi, dword ptr [rax]
0x1806d039b: inc edi
0x1806d039d: cmp byte ptr [rip + 0x88caef9], 0
0x1806d03a4: mov dword ptr [rax], edi
0x1806d03a6: jne 0x1806d03bb
0x1806d03a8: lea rcx, [rip + 0x84746a9]
0x1806d03af: call 0x18049c210
0x1806d03b4: mov byte ptr [rip + 0x88caee2], 1
0x1806d03bb: mov rax, qword ptr [rip + 0x8474696]
0x1806d03c2: cmp dword ptr [rax + 0xe0], 0
0x1806d03c9: jne 0x1806d03da
0x1806d03cb: mov rcx, rax
0x1806d03ce: call 0x18049c450
0x1806d03d3: mov rax, qword ptr [rip + 0x847467e]
0x1806d03da: mov rax, qword ptr [rax + 0xb8]
0x1806d03e1: mov rcx, qword ptr [rax + 0x68]
0x1806d03e5: test rcx, rcx
0x1806d03e8: jne 0x1806d0402
0x1806d03ea: mov dword ptr [rbx + 0x218], edi
0x1806d03f0: mov rdi, qword ptr [rsp + 0x30]
0x1806d03f5: mov byte ptr [rbx + 0x200], 1
0x1806d03fc: add rsp, 0x20
0x1806d0400: pop rbx
0x1806d0401: ret 
0x1806d0402: xor r9d, r9d
0x1806d0405: mov r8d, edi
0x1806d0408: mov rdx, rbx
0x1806d040b: call 0x183154ba0 ; XLua.DelegateBridge.__Gen_Delegate_Imp1073
0x1806d0410: mov rdi, qword ptr [rsp + 0x30]
0x1806d0415: mov byte ptr [rbx + 0x200], 1
0x1806d041c: add rsp, 0x20
0x1806d0420: pop rbx
0x1806d0421: ret 
0x1806d0422: xor r8d, r8d
0x1806d0425: mov rdx, rbx
0x1806d0428: mov rcx, r9
0x1806d042b: add rsp, 0x20
0x1806d042f: pop rbx
0x1806d0430: jmp 0x1833c9ac0 ; XLua.DelegateBridge.__Gen_Delegate_Imp27
0x1806d0435: int3 
0x1806d0436: int3 
0x1806d0437: int3 
0x1806d0438: int3 
0x1806d0439: int3 
0x1806d043a: int3 
0x1806d043b: int3 
0x1806d043c: int3 
0x1806d043d: int3 
0x1806d043e: int3 
0x1806d043f: int3 
