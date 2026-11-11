0x180b0aee0: mov qword ptr [rsp + 8], rbx
0x180b0aee5: push rdi
0x180b0aee6: sub rsp, 0x20
0x180b0aeea: cmp byte ptr [rip + 0x8492dce], 0
0x180b0aef1: mov ebx, edx
0x180b0aef3: mov edi, ecx
0x180b0aef5: jne 0x180b0af0a
0x180b0aef7: lea rcx, [rip + 0x80051d2]
0x180b0aefe: call 0x18049c210
0x180b0af03: mov byte ptr [rip + 0x8492db5], 1
0x180b0af0a: mov rax, qword ptr [rip + 0x80051bf]
0x180b0af11: mov r8, qword ptr [rax + 0xb8]
0x180b0af18: mov rcx, qword ptr [r8 + 0xc0]
0x180b0af1f: test rcx, rcx
0x180b0af22: jne 0x180b0af35
0x180b0af24: shl ebx, 0x14
0x180b0af27: lea eax, [rdi + rbx]
0x180b0af2a: mov rbx, qword ptr [rsp + 0x30]
0x180b0af2f: add rsp, 0x20
0x180b0af33: pop rdi
0x180b0af34: ret
0x180b0af35: xor r9d, r9d
0x180b0af38: mov r8d, ebx
0x180b0af3b: mov edx, edi
0x180b0af3d: mov rbx, qword ptr [rsp + 0x30]
0x180b0af42: add rsp, 0x20
0x180b0af46: pop rdi
0x180b0af47: jmp 0x183271d10 ; XLua.DelegateBridge.__Gen_Delegate_Imp12542
0x180b0af4c: int3
0x180b0af4d: int3
0x180b0af4e: int3
0x180b0af4f: int3
