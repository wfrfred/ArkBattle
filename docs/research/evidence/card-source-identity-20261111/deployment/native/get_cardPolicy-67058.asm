0x180707aa0: push rbx
0x180707aa2: sub rsp, 0x20
0x180707aa6: cmp byte ptr [rip + 0x8893b87], 0
0x180707aad: mov rbx, rcx
0x180707ab0: jne 0x180707ac5
0x180707ab2: lea rcx, [rip + 0x84ba4b7]
0x180707ab9: call 0x18049c210
0x180707abe: mov byte ptr [rip + 0x8893b6f], 1
0x180707ac5: mov rax, qword ptr [rip + 0x84ba4a4]
0x180707acc: mov rdx, qword ptr [rax + 0xb8]
0x180707ad3: mov rcx, qword ptr [rdx + 0x18]
0x180707ad7: test rcx, rcx
0x180707ada: jne 0x180707ae7
0x180707adc: mov eax, 1
0x180707ae1: add rsp, 0x20
0x180707ae5: pop rbx
0x180707ae6: ret
0x180707ae7: xor r8d, r8d
0x180707aea: mov rdx, rbx
0x180707aed: add rsp, 0x20
0x180707af1: pop rbx
0x180707af2: jmp 0x18346c500 ; XLua.DelegateBridge.__Gen_Delegate_Imp3831
0x180707af7: int3
0x180707af8: int3
0x180707af9: int3
0x180707afa: int3
0x180707afb: int3
0x180707afc: int3
0x180707afd: int3
0x180707afe: int3
0x180707aff: int3
