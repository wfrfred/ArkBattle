0x180ab2b60: mov qword ptr [rsp + 8], rbx
0x180ab2b65: push rdi
0x180ab2b66: sub rsp, 0x20
0x180ab2b6a: cmp byte ptr [rip + 0x84eab2c], 0
0x180ab2b71: mov ebx, edx
0x180ab2b73: mov rdi, rcx
0x180ab2b76: jne 0x180ab2b8b
0x180ab2b78: lea rcx, [rip + 0x8124aa1]
0x180ab2b7f: call 0x18049c210
0x180ab2b84: mov byte ptr [rip + 0x84eab12], 1
0x180ab2b8b: mov rax, qword ptr [rip + 0x8124a8e]
0x180ab2b92: cmp dword ptr [rax + 0xe0], 0
0x180ab2b99: jne 0x180ab2baa
0x180ab2b9b: mov rcx, rax
0x180ab2b9e: call 0x18049c450
0x180ab2ba3: mov rax, qword ptr [rip + 0x8124a76]
0x180ab2baa: mov rax, qword ptr [rax + 0xb8]
0x180ab2bb1: mov rcx, qword ptr [rax + 0x68]
0x180ab2bb5: test rcx, rcx
0x180ab2bb8: jne 0x180ab2bcb
0x180ab2bba: mov dword ptr [rdi + 0x528], ebx
0x180ab2bc0: mov rbx, qword ptr [rsp + 0x30]
0x180ab2bc5: add rsp, 0x20
0x180ab2bc9: pop rdi
0x180ab2bca: ret
0x180ab2bcb: xor r9d, r9d
0x180ab2bce: mov r8d, ebx
0x180ab2bd1: mov rdx, rdi
0x180ab2bd4: mov rbx, qword ptr [rsp + 0x30]
0x180ab2bd9: add rsp, 0x20
0x180ab2bdd: pop rdi
0x180ab2bde: jmp 0x183154ba0 ; XLua.DelegateBridge.__Gen_Delegate_Imp1073
0x180ab2be3: int3
0x180ab2be4: int3
0x180ab2be5: int3
0x180ab2be6: int3
0x180ab2be7: int3
0x180ab2be8: int3
0x180ab2be9: int3
0x180ab2bea: int3
0x180ab2beb: int3
0x180ab2bec: int3
0x180ab2bed: int3
0x180ab2bee: int3
0x180ab2bef: int3
