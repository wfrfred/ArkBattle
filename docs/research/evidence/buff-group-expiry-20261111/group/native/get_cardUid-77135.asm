0x180aaf750: push rbx
0x180aaf752: sub rsp, 0x20
0x180aaf756: cmp byte ptr [rip + 0x84edf3f], 0
0x180aaf75d: mov rbx, rcx
0x180aaf760: jne 0x180aaf775
0x180aaf762: lea rcx, [rip + 0x8127eb7]
0x180aaf769: call 0x18049c210
0x180aaf76e: mov byte ptr [rip + 0x84edf27], 1
0x180aaf775: mov rax, qword ptr [rip + 0x8127ea4]
0x180aaf77c: cmp dword ptr [rax + 0xe0], 0
0x180aaf783: jne 0x180aaf794
0x180aaf785: mov rcx, rax
0x180aaf788: call 0x18049c450
0x180aaf78d: mov rax, qword ptr [rip + 0x8127e8c]
0x180aaf794: mov rax, qword ptr [rax + 0xb8]
0x180aaf79b: mov rcx, qword ptr [rax + 0x60]
0x180aaf79f: test rcx, rcx
0x180aaf7a2: jne 0x180aaf7b0
0x180aaf7a4: mov eax, dword ptr [rbx + 0x528]
0x180aaf7aa: add rsp, 0x20
0x180aaf7ae: pop rbx
0x180aaf7af: ret
0x180aaf7b0: xor r8d, r8d
0x180aaf7b3: mov rdx, rbx
0x180aaf7b6: add rsp, 0x20
0x180aaf7ba: pop rbx
0x180aaf7bb: jmp 0x183403b00 ; XLua.DelegateBridge.__Gen_Delegate_Imp316
