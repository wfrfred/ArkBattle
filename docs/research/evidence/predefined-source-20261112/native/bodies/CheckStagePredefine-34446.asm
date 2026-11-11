0x18278a7d0: mov qword ptr [rsp + 8], rbx
0x18278a7d5: push rdi
0x18278a7d6: sub rsp, 0x20
0x18278a7da: cmp byte ptr [rip + 0x68289b6], 0
0x18278a7e1: mov rbx, rdx
0x18278a7e4: mov edi, ecx
0x18278a7e6: jne 0x18278a7fb
0x18278a7e8: lea rcx, [rip + 0x63914b1]
0x18278a7ef: call 0x18049c210
0x18278a7f4: mov byte ptr [rip + 0x682899c], 1
0x18278a7fb: mov rax, qword ptr [rip + 0x639149e]
0x18278a802: mov r8, qword ptr [rax + 0xb8]
0x18278a809: mov rcx, qword ptr [r8 + 0x578]
0x18278a810: test rcx, rcx
0x18278a813: jne 0x18278a84d
0x18278a815: test rbx, rbx
0x18278a818: je 0x18278a864
0x18278a81a: mov rax, qword ptr [rbx + 0x10]
0x18278a81e: cmp edi, 2
0x18278a821: je 0x18278a839
0x18278a823: test rax, rax
0x18278a826: je 0x18278a864
0x18278a828: cmp byte ptr [rax + 0x2a], cl
0x18278a82b: setne al
0x18278a82e: mov rbx, qword ptr [rsp + 0x30]
0x18278a833: add rsp, 0x20
0x18278a837: pop rdi
0x18278a838: ret
0x18278a839: test rax, rax
0x18278a83c: je 0x18278a864
0x18278a83e: movzx eax, byte ptr [rax + 0x2b]
0x18278a842: mov rbx, qword ptr [rsp + 0x30]
0x18278a847: add rsp, 0x20
0x18278a84b: pop rdi
0x18278a84c: ret
0x18278a84d: xor r9d, r9d
0x18278a850: mov r8, rbx
0x18278a853: mov edx, edi
0x18278a855: mov rbx, qword ptr [rsp + 0x30]
0x18278a85a: add rsp, 0x20
0x18278a85e: pop rdi
0x18278a85f: jmp 0x18323f0f0 ; XLua.DelegateBridge.__Gen_Delegate_Imp12225
0x18278a864: call 0x18049c3c0
0x18278a869: int3
0x18278a86a: int3
0x18278a86b: int3
0x18278a86c: int3
0x18278a86d: int3
0x18278a86e: int3
0x18278a86f: int3
