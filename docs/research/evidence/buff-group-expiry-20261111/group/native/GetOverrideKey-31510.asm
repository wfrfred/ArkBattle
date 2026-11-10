0x18237adf0: push rbx
0x18237adf2: sub rsp, 0x20
0x18237adf6: cmp byte ptr [rip + 0x6c350ec], 0
0x18237adfd: mov rbx, rcx
0x18237ae00: jne 0x18237ae21
0x18237ae02: lea rcx, [rip + 0x67cb567]
0x18237ae09: call 0x18049c210
0x18237ae0e: lea rcx, [rip + 0x6870fa3]
0x18237ae15: call 0x18049c210
0x18237ae1a: mov byte ptr [rip + 0x6c350c8], 1
0x18237ae21: mov rax, qword ptr [rip + 0x67cb548]
0x18237ae28: mov rdx, qword ptr [rax + 0xb8]
0x18237ae2f: mov rcx, qword ptr [rdx + 8]
0x18237ae33: test rcx, rcx
0x18237ae36: jne 0x18237ae77
0x18237ae38: cmp byte ptr [rbx + 0x38], cl
0x18237ae3b: jne 0x18237ae60
0x18237ae3d: mov rcx, qword ptr [rbx + 0x40]
0x18237ae41: xor edx, edx
0x18237ae43: call 0x18601a180 ; System.String.IsNullOrEmpty
0x18237ae48: test al, al
0x18237ae4a: je 0x18237ae56
0x18237ae4c: mov rax, qword ptr [rbx + 0x18]
0x18237ae50: add rsp, 0x20
0x18237ae54: pop rbx
0x18237ae55: ret
0x18237ae56: mov rax, qword ptr [rbx + 0x40]
0x18237ae5a: add rsp, 0x20
0x18237ae5e: pop rbx
0x18237ae5f: ret
0x18237ae60: mov rax, qword ptr [rip + 0x6870f51]
0x18237ae67: mov rax, qword ptr [rax + 0xb8]
0x18237ae6e: mov rax, qword ptr [rax]
0x18237ae71: add rsp, 0x20
0x18237ae75: pop rbx
0x18237ae76: ret
0x18237ae77: xor r8d, r8d
0x18237ae7a: mov rdx, rbx
0x18237ae7d: add rsp, 0x20
0x18237ae81: pop rbx
0x18237ae82: jmp 0x1836cc610 ; XLua.DelegateBridge.__Gen_Delegate_Imp77
0x18237ae87: int3
0x18237ae88: int3
0x18237ae89: int3
0x18237ae8a: int3
0x18237ae8b: int3
0x18237ae8c: int3
0x18237ae8d: int3
0x18237ae8e: int3
0x18237ae8f: int3
