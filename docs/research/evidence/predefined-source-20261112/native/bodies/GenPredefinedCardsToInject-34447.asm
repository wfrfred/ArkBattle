0x18278b630: mov qword ptr [rsp + 8], rbx
0x18278b635: push rdi
0x18278b636: sub rsp, 0x20
0x18278b63a: cmp byte ptr [rip + 0x6827b57], 0
0x18278b641: mov edi, edx
0x18278b643: mov rbx, rcx
0x18278b646: jne 0x18278b65b
0x18278b648: lea rcx, [rip + 0x6390651]
0x18278b64f: call 0x18049c210
0x18278b654: mov byte ptr [rip + 0x6827b3d], 1
0x18278b65b: mov rax, qword ptr [rip + 0x639063e]
0x18278b662: mov r8, qword ptr [rax + 0xb8]
0x18278b669: mov rcx, qword ptr [r8 + 0x580]
0x18278b670: test rcx, rcx
0x18278b673: jne 0x18278b6c1
0x18278b675: test rbx, rbx
0x18278b678: je 0x18278b6d9
0x18278b67a: mov rax, qword ptr [rbx + 0x10]
0x18278b67e: test rax, rax
0x18278b681: je 0x18278b6d9
0x18278b683: cmp byte ptr [rax + 0x2c], cl
0x18278b686: jne 0x18278b6b4
0x18278b688: cmp edi, 2
0x18278b68b: je 0x18278b696
0x18278b68d: mov rax, qword ptr [rbx + 0x90]
0x18278b694: jmp 0x18278b6a0
0x18278b696: xor edx, edx
0x18278b698: mov rcx, rbx
0x18278b69b: call 0x182791ac0 ; Torappu.DataConvertUtil.LoadComposeHardPredefine
0x18278b6a0: test rax, rax
0x18278b6a3: je 0x18278b6b4
0x18278b6a5: mov rax, qword ptr [rax + 0x20]
0x18278b6a9: mov rbx, qword ptr [rsp + 0x30]
0x18278b6ae: add rsp, 0x20
0x18278b6b2: pop rdi
0x18278b6b3: ret
0x18278b6b4: xor eax, eax
0x18278b6b6: mov rbx, qword ptr [rsp + 0x30]
0x18278b6bb: add rsp, 0x20
0x18278b6bf: pop rdi
0x18278b6c0: ret
0x18278b6c1: xor r9d, r9d
0x18278b6c4: mov r8d, edi
0x18278b6c7: mov rdx, rbx
0x18278b6ca: mov rbx, qword ptr [rsp + 0x30]
0x18278b6cf: add rsp, 0x20
0x18278b6d3: pop rdi
0x18278b6d4: jmp 0x18323f2e0 ; XLua.DelegateBridge.__Gen_Delegate_Imp12226
0x18278b6d9: call 0x18049c3c0
0x18278b6de: int3
0x18278b6df: int3
