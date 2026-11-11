0x180b0a4b0: sub rsp, 0x28
0x180b0a4b4: cmp byte ptr [rip + 0x84937fd], 0
0x180b0a4bb: jne 0x180b0a4d0
0x180b0a4bd: lea rcx, [rip + 0x8005c0c]
0x180b0a4c4: call 0x18049c210
0x180b0a4c9: mov byte ptr [rip + 0x84937e8], 1
0x180b0a4d0: mov rcx, qword ptr [rip + 0x8005bf9]
0x180b0a4d7: mov rax, qword ptr [rcx + 0xb8]
0x180b0a4de: mov r8, qword ptr [rax + 0x88]
0x180b0a4e5: test r8, r8
0x180b0a4e8: jne 0x180b0a4f1
0x180b0a4ea: mov eax, dword ptr [rax]
0x180b0a4ec: add rsp, 0x28
0x180b0a4f0: ret
0x180b0a4f1: xor edx, edx
0x180b0a4f3: mov rcx, r8
0x180b0a4f6: add rsp, 0x28
0x180b0a4fa: jmp 0x1833e6dc0 ; XLua.DelegateBridge.__Gen_Delegate_Imp297
0x180b0a4ff: int3
