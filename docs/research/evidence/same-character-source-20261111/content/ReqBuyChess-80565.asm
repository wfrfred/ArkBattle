0x180b759f0: push rbp
0x180b759f2: push r12
0x180b759f4: push r13
0x180b759f6: push r14
0x180b759f8: push r15
0x180b759fa: sub rsp, 0x40
0x180b759fe: cmp byte ptr [rip + 0x842868d], 0
0x180b75a05: mov r15, r9
0x180b75a08: movzx r12d, r8b
0x180b75a0c: mov r14d, edx
0x180b75a0f: mov rbp, rcx
0x180b75a12: jne 0x180b75a6f
0x180b75a14: lea rcx, [rip + 0x80cf7fd]
0x180b75a1b: call 0x18049c210
0x180b75a20: lea rcx, [rip + 0x8057899]
0x180b75a27: call 0x18049c210
0x180b75a2c: lea rcx, [rip + 0x7fbb7ed]
0x180b75a33: call 0x18049c210
0x180b75a38: lea rcx, [rip + 0x8002171]
0x180b75a3f: call 0x18049c210
0x180b75a44: lea rcx, [rip + 0x80023b5]
0x180b75a4b: call 0x18049c210
0x180b75a50: lea rcx, [rip + 0x8002849]
0x180b75a57: call 0x18049c210
0x180b75a5c: lea rcx, [rip + 0x8002a8d]
0x180b75a63: call 0x18049c210
0x180b75a68: mov byte ptr [rip + 0x8428623], 1
0x180b75a6f: mov rax, qword ptr [rip + 0x80cf7a2]
0x180b75a76: xor r13d, r13d
0x180b75a79: mov qword ptr [rsp + 0x30], r13
0x180b75a7e: mov rcx, qword ptr [rax + 0xb8]
0x180b75a85: mov rcx, qword ptr [rcx + 0x98]
0x180b75a8c: test rcx, rcx
0x180b75a8f: jne 0x180b75ca1
0x180b75a95: cmp byte ptr [rbp + 0x58], r13b
0x180b75a99: jne 0x180b75c93
0x180b75a9f: mov qword ptr [rsp + 0x70], rbx
0x180b75aa4: mov qword ptr [rsp + 0x78], rsi
0x180b75aa9: mov qword ptr [rsp + 0x80], rdi
0x180b75ab1: mov rax, qword ptr [rbp + 0x18]
0x180b75ab5: test rax, rax
0x180b75ab8: je 0x180b75cc8
0x180b75abe: mov rdi, qword ptr [rax + 0x40]
0x180b75ac2: test rdi, rdi
0x180b75ac5: je 0x180b75cc8
0x180b75acb: mov rdi, qword ptr [rdi + 0x10]
0x180b75acf: mov ebx, r13d
0x180b75ad2: mov esi, r13d
0x180b75ad5: test rdi, rdi
0x180b75ad8: je 0x180b75cc8
0x180b75ade: nop
0x180b75ae0: mov rdx, qword ptr [rip + 0x80577d9]
0x180b75ae7: mov rcx, qword ptr [rdi + 0x30]
0x180b75aeb: call 0x184699180
0x180b75af0: cmp esi, eax
0x180b75af2: jge 0x180b75c81
0x180b75af8: mov rcx, qword ptr [rdi + 0x30]
0x180b75afc: test rcx, rcx
0x180b75aff: je 0x180b75cc8
0x180b75b05: mov r8, qword ptr [rip + 0x80029e4]
0x180b75b0c: mov edx, ebx
0x180b75b0e: call 0x184d27b00
0x180b75b13: mov rsi, rax
0x180b75b16: test rax, rax
0x180b75b19: je 0x180b75cc8
0x180b75b1f: cmp dword ptr [rax + 0x18], r14d
0x180b75b23: je 0x180b75b2b
0x180b75b25: inc ebx
0x180b75b27: mov esi, ebx
0x180b75b29: jmp 0x180b75ae0
0x180b75b2b: test r12b, r12b
0x180b75b2e: jne 0x180b75b45
0x180b75b30: mov eax, dword ptr [rax + 0x1c]
0x180b75b33: cmp dword ptr [rdi + 0x14], eax
0x180b75b36: jl 0x180b75c81
0x180b75b3c: mov eax, dword ptr [rdi + 0x14]
0x180b75b3f: sub eax, dword ptr [rsi + 0x1c]
0x180b75b42: mov dword ptr [rdi + 0x14], eax
0x180b75b45: mov rax, qword ptr [rbp + 0x18]
0x180b75b49: test rax, rax
0x180b75b4c: je 0x180b75cc8
0x180b75b52: mov rcx, qword ptr [rax + 0x70]
0x180b75b56: test rcx, rcx
0x180b75b59: je 0x180b75cc8
0x180b75b5f: mov rcx, qword ptr [rcx + 0x10]
0x180b75b63: test rcx, rcx
0x180b75b66: je 0x180b75cc8
0x180b75b6c: mov r9, qword ptr [rip + 0x7fbb6ad]
0x180b75b73: lea r8, [rsp + 0x30]
0x180b75b78: mov edx, dword ptr [rbp + 0x40]
0x180b75b7b: call 0x184cb20a0
0x180b75b80: test al, al
0x180b75b82: je 0x180b75c6e
0x180b75b88: cmp dword ptr [rdi + 0x20], 1
0x180b75b8c: mov rcx, qword ptr [rdi + 0x30]
0x180b75b90: je 0x180b75bab
0x180b75b92: test rcx, rcx
0x180b75b95: je 0x180b75cc8
0x180b75b9b: mov r8, qword ptr [rip + 0x80026fe]
0x180b75ba2: mov edx, ebx
0x180b75ba4: call 0x184de9590
0x180b75ba9: jmp 0x180b75bf3
0x180b75bab: test rcx, rcx
0x180b75bae: je 0x180b75cc8
0x180b75bb4: mov r8d, dword ptr [rcx + 0x18]
0x180b75bb8: inc dword ptr [rcx + 0x1c]
0x180b75bbb: mov dword ptr [rcx + 0x18], r13d
0x180b75bbf: test r8d, r8d
0x180b75bc2: jle 0x180b75bd2
0x180b75bc4: mov rcx, qword ptr [rcx + 0x10]
0x180b75bc8: xor r9d, r9d
0x180b75bcb: xor edx, edx
0x180b75bcd: call 0x186149e10 ; System.Array.Clear
0x180b75bd2: mov rcx, qword ptr [rdi + 0x30]
0x180b75bd6: test rcx, rcx
0x180b75bd9: je 0x180b75cc8
0x180b75bdf: mov r8, qword ptr [rip + 0x8001fca]
0x180b75be6: mov rdx, qword ptr [rbp + 0x48]
0x180b75bea: call 0x184f43270
0x180b75bef: mov dword ptr [rdi + 0x20], r13d
0x180b75bf3: mov rdx, qword ptr [rsp + 0x30]
0x180b75bf8: test rdx, rdx
0x180b75bfb: je 0x180b75cc8
0x180b75c01: mov r8, qword ptr [rsi + 0x10]
0x180b75c05: xor r9d, r9d
0x180b75c08: mov rdx, qword ptr [rdx + 0x28]
0x180b75c0c: mov rcx, rbp
0x180b75c0f: call 0x180b77b10 ; Torappu.Battle.AutoChess.AutoChessDataBridgeLocalPlayer._AddOwnedChess
0x180b75c14: xor ecx, ecx
0x180b75c16: call 0x180b5c290 ; Torappu.Battle.DataCenter.AutoChessDataCenter.get_instanceOrNull
0x180b75c1b: mov rdx, qword ptr [rbp + 0x18]
0x180b75c1f: test rdx, rdx
0x180b75c22: je 0x180b75cc8
0x180b75c28: test rax, rax
0x180b75c2b: je 0x180b75cc8
0x180b75c31: mov rdx, qword ptr [rdx + 0x70]
0x180b75c35: xor r8d, r8d
0x180b75c38: mov rcx, rax
0x180b75c3b: call 0x180b5aa50 ; Torappu.Battle.DataCenter.AutoChessDataCenter.UpdateData
0x180b75c40: xor ecx, ecx
0x180b75c42: call 0x180b5c290 ; Torappu.Battle.DataCenter.AutoChessDataCenter.get_instanceOrNull
0x180b75c47: mov rdx, qword ptr [rbp + 0x18]
0x180b75c4b: test rdx, rdx
0x180b75c4e: je 0x180b75cc8
0x180b75c50: test rax, rax
0x180b75c53: je 0x180b75cc8
0x180b75c55: mov rdx, qword ptr [rdx + 0x40]
0x180b75c59: xor r8d, r8d
0x180b75c5c: mov rcx, rax
0x180b75c5f: call 0x180b5a9a0 ; Torappu.Battle.DataCenter.AutoChessDataCenter.UpdateData
0x180b75c64: xor edx, edx
0x180b75c66: mov rcx, rbp
0x180b75c69: call 0x180b75000 ; Torappu.Battle.AutoChess.AutoChessDataBridgeLocalPlayer.OnMessage
0x180b75c6e: test r15, r15
0x180b75c71: je 0x180b75c81
0x180b75c73: mov rax, qword ptr [r15 + 0x18]
0x180b75c77: mov rdx, qword ptr [r15 + 0x28]
0x180b75c7b: mov rcx, qword ptr [r15 + 0x40]
0x180b75c7f: call rax
0x180b75c81: mov rsi, qword ptr [rsp + 0x78]
0x180b75c86: mov rbx, qword ptr [rsp + 0x70]
0x180b75c8b: mov rdi, qword ptr [rsp + 0x80]
0x180b75c93: add rsp, 0x40
0x180b75c97: pop r15
0x180b75c99: pop r14
0x180b75c9b: pop r13
0x180b75c9d: pop r12
0x180b75c9f: pop rbp
0x180b75ca0: ret
0x180b75ca1: mov qword ptr [rsp + 0x28], r13
0x180b75ca6: movzx r9d, r12b
0x180b75caa: mov r8d, r14d
0x180b75cad: mov qword ptr [rsp + 0x20], r15
0x180b75cb2: mov rdx, rbp
0x180b75cb5: call 0x183419400 ; XLua.DelegateBridge.__Gen_Delegate_Imp3310
0x180b75cba: add rsp, 0x40
0x180b75cbe: pop r15
0x180b75cc0: pop r14
0x180b75cc2: pop r13
0x180b75cc4: pop r12
0x180b75cc6: pop rbp
0x180b75cc7: ret
0x180b75cc8: call 0x18049c3c0
0x180b75ccd: int3
0x180b75cce: int3
0x180b75ccf: int3
