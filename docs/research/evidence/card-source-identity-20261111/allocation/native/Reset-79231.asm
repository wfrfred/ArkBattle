0x180b0ae10: push rbx
0x180b0ae12: sub rsp, 0x20
0x180b0ae16: cmp byte ptr [rip + 0x8492e9a], 0
0x180b0ae1d: mov ebx, ecx
0x180b0ae1f: jne 0x180b0ae34
0x180b0ae21: lea rcx, [rip + 0x80052a8]
0x180b0ae28: call 0x18049c210
0x180b0ae2d: mov byte ptr [rip + 0x8492e83], 1
0x180b0ae34: mov rcx, qword ptr [rip + 0x8005295]
0x180b0ae3b: mov rax, qword ptr [rcx + 0xb8]
0x180b0ae42: mov r9, qword ptr [rax + 0x80]
0x180b0ae49: test r9, r9
0x180b0ae4c: jne 0x180b0ae56
0x180b0ae4e: mov dword ptr [rax], ebx
0x180b0ae50: add rsp, 0x20
0x180b0ae54: pop rbx
0x180b0ae55: ret
0x180b0ae56: xor r8d, r8d
0x180b0ae59: mov edx, ebx
0x180b0ae5b: mov rcx, r9
0x180b0ae5e: add rsp, 0x20
0x180b0ae62: pop rbx
0x180b0ae63: jmp 0x183270e40 ; XLua.DelegateBridge.__Gen_Delegate_Imp12536
0x180b0ae68: int3
0x180b0ae69: int3
0x180b0ae6a: int3
0x180b0ae6b: int3
0x180b0ae6c: int3
0x180b0ae6d: int3
0x180b0ae6e: int3
0x180b0ae6f: int3
