; Torappu.Battle.BattleController.SpawnPredefinedInstanceByAlias metadata=65656 VA=0x180660b90
0x180660b90: push rbx
0x180660b92: push rbp
0x180660b93: sub rsp, 0x48
0x180660b97: cmp byte ptr [rip + 0x893a46d], 0
0x180660b9e: mov rbp, rdx
0x180660ba1: mov rbx, rcx
0x180660ba4: jne 0x180660bc5
0x180660ba6: lea rcx, [rip + 0x84af093]
0x180660bad: call 0x18049c210
0x180660bb2: lea rcx, [rip + 0x84bf497]
0x180660bb9: call 0x18049c210
0x180660bbe: mov byte ptr [rip + 0x893a446], 1
0x180660bc5: mov rax, qword ptr [rip + 0x84af074]
0x180660bcc: mov byte ptr [rsp + 0x78], 0
0x180660bd1: mov byte ptr [rsp + 0x30], 0
0x180660bd6: cmp dword ptr [rax + 0xe0], 0
0x180660bdd: jne 0x180660bee
0x180660bdf: mov rcx, rax
0x180660be2: call 0x18049c450
0x180660be7: mov rax, qword ptr [rip + 0x84af052]
0x180660bee: mov rax, qword ptr [rax + 0xb8]
0x180660bf5: mov rcx, qword ptr [rax + 0x838]
0x180660bfc: test rcx, rcx
0x180660bff: jne 0x180660e67
0x180660c05: cmp qword ptr [rbx + 0xf8], rcx
0x180660c0c: je 0x180660e5e
0x180660c12: mov qword ptr [rsp + 0x40], r15
0x180660c17: mov qword ptr [rsp + 0x60], rsi
0x180660c1c: mov qword ptr [rsp + 0x68], rdi
0x180660c21: mov qword ptr [rsp + 0x70], r14
0x180660c26: mov rax, qword ptr [rbx + 0xf8]
0x180660c2d: mov r15d, 0x20
0x180660c33: cmp qword ptr [rax + 0x10], rcx
0x180660c37: je 0x180660d52
0x180660c3d: xor edi, edi
0x180660c3f: mov r14d, r15d
0x180660c42: xor edx, edx
0x180660c44: nop dword ptr [rax]
0x180660c48: nop dword ptr [rax + rax]
0x180660c50: mov rcx, qword ptr [rax + 0x10]
0x180660c54: test rcx, rcx
0x180660c57: je 0x180660e7c
0x180660c5d: cmp edx, dword ptr [rcx + 0x18]
0x180660c60: jge 0x180660d52
0x180660c66: mov rax, qword ptr [rbx + 0xf8]
0x180660c6d: test rax, rax
0x180660c70: je 0x180660e7c
0x180660c76: mov rax, qword ptr [rax + 0x10]
0x180660c7a: test rax, rax
0x180660c7d: je 0x180660e7c
0x180660c83: cmp edi, dword ptr [rax + 0x18]
0x180660c86: jae 0x180660e82
0x180660c8c: mov rsi, qword ptr [r14 + rax]
0x180660c90: test rsi, rsi
0x180660c93: je 0x180660e7c
0x180660c99: cmp byte ptr [rip + 0x8977dd0], 0
0x180660ca0: jbe 0x180660caa
0x180660ca2: mov rcx, qword ptr [rsi]
0x180660ca5: call 0x180457010
0x180660caa: mov rdx, qword ptr [rsi]
0x180660cad: mov rcx, rsi
0x180660cb0: mov rax, qword ptr [rdx + 0x1b0]
0x180660cb7: mov rdx, qword ptr [rdx + 0x1b8]
0x180660cbe: call rax
0x180660cc0: xor r8d, r8d
0x180660cc3: mov rdx, rbp
0x180660cc6: mov rcx, rax
0x180660cc9: call 0x186017430 ; System.String.Equals | System.String.op_Equality
0x180660cce: test al, al
0x180660cd0: jne 0x180660cef
0x180660cd2: mov rax, qword ptr [rbx + 0xf8]
0x180660cd9: inc edi
0x180660cdb: add r14, 8
0x180660cdf: mov edx, edi
0x180660ce1: test rax, rax
0x180660ce4: je 0x180660e7c
0x180660cea: jmp 0x180660c50
0x180660cef: lea r9, [rsp + 0x78]
0x180660cf4: mov qword ptr [rsp + 0x20], 0
0x180660cfd: xor r8d, r8d
0x180660d00: mov rdx, rsi
0x180660d03: mov rcx, rbx
0x180660d06: call 0x180664c70 ; Torappu.Battle.BattleController._CreatePredefinedCharacter
0x180660d0b: mov rcx, qword ptr [rip + 0x84bf33e]
0x180660d12: mov rbx, rax
0x180660d15: cmp dword ptr [rcx + 0xe0], 0
0x180660d1c: jne 0x180660d23
0x180660d1e: call 0x18049c450
0x180660d23: xor r8d, r8d
0x180660d26: xor edx, edx
0x180660d28: mov rcx, rbx
0x180660d2b: call 0x186dcf430 ; UnityEngine.Object.op_Inequality
0x180660d30: or al, byte ptr [rsp + 0x78]
0x180660d34: setne al
0x180660d37: mov r14, qword ptr [rsp + 0x70]
0x180660d3c: mov rdi, qword ptr [rsp + 0x68]
0x180660d41: mov rsi, qword ptr [rsp + 0x60]
0x180660d46: mov r15, qword ptr [rsp + 0x40]
0x180660d4b: add rsp, 0x48
0x180660d4f: pop rbp
0x180660d50: pop rbx
0x180660d51: ret
0x180660d52: mov rax, qword ptr [rbx + 0xf8]
0x180660d59: test rax, rax
0x180660d5c: je 0x180660e7c
0x180660d62: cmp qword ptr [rax + 0x18], 0
0x180660d67: je 0x180660e57
0x180660d6d: xor edi, edi
0x180660d6f: xor edx, edx
0x180660d71: mov rcx, qword ptr [rax + 0x18]
0x180660d75: test rcx, rcx
0x180660d78: je 0x180660e7c
0x180660d7e: cmp edx, dword ptr [rcx + 0x18]
0x180660d81: jge 0x180660e57
0x180660d87: mov rax, qword ptr [rbx + 0xf8]
0x180660d8e: test rax, rax
0x180660d91: je 0x180660e7c
0x180660d97: mov rax, qword ptr [rax + 0x18]
0x180660d9b: test rax, rax
0x180660d9e: je 0x180660e7c
0x180660da4: cmp edi, dword ptr [rax + 0x18]
0x180660da7: jae 0x180660e82
0x180660dad: mov rsi, qword ptr [r15 + rax]
0x180660db1: test rsi, rsi
0x180660db4: je 0x180660e7c
0x180660dba: cmp byte ptr [rip + 0x8977caf], 0
0x180660dc1: jbe 0x180660dcb
0x180660dc3: mov rcx, qword ptr [rsi]
0x180660dc6: call 0x180457010
0x180660dcb: mov rdx, qword ptr [rsi]
0x180660dce: mov rcx, rsi
0x180660dd1: mov rax, qword ptr [rdx + 0x1b0]
0x180660dd8: mov rdx, qword ptr [rdx + 0x1b8]
0x180660ddf: call rax
0x180660de1: xor r8d, r8d
0x180660de4: mov rdx, rbp
0x180660de7: mov rcx, rax
0x180660dea: call 0x186017430 ; System.String.Equals | System.String.op_Equality
0x180660def: test al, al
0x180660df1: jne 0x180660e0d
0x180660df3: mov rax, qword ptr [rbx + 0xf8]
0x180660dfa: inc edi
0x180660dfc: add r15, 8
0x180660e00: mov edx, edi
0x180660e02: test rax, rax
0x180660e05: jne 0x180660d71
0x180660e0b: jmp 0x180660e7c
0x180660e0d: lea r9, [rsp + 0x30]
0x180660e12: mov qword ptr [rsp + 0x20], 0
0x180660e1b: mov r8b, 1
0x180660e1e: mov rdx, rsi
0x180660e21: mov rcx, rbx
0x180660e24: call 0x180664c70 ; Torappu.Battle.BattleController._CreatePredefinedCharacter
0x180660e29: mov rcx, qword ptr [rip + 0x84bf220]
0x180660e30: mov rbx, rax
0x180660e33: cmp dword ptr [rcx + 0xe0], 0
0x180660e3a: jne 0x180660e41
0x180660e3c: call 0x18049c450
0x180660e41: xor r8d, r8d
0x180660e44: xor edx, edx
0x180660e46: mov rcx, rbx
0x180660e49: call 0x186dcf430 ; UnityEngine.Object.op_Inequality
0x180660e4e: or al, byte ptr [rsp + 0x30]
0x180660e52: jmp 0x180660d34
0x180660e57: xor al, al
0x180660e59: jmp 0x180660d37
0x180660e5e: xor al, al
0x180660e60: add rsp, 0x48
0x180660e64: pop rbp
0x180660e65: pop rbx
0x180660e66: ret
0x180660e67: xor r9d, r9d
0x180660e6a: mov r8, rbp
0x180660e6d: mov rdx, rbx
0x180660e70: call 0x1833e9f80 ; XLua.DelegateBridge.__Gen_Delegate_Imp29
0x180660e75: add rsp, 0x48
0x180660e79: pop rbp
0x180660e7a: pop rbx
0x180660e7b: ret
0x180660e7c: call 0x18049c3c0
0x180660e81: int3
0x180660e82: call 0x18049c3b0
0x180660e87: int3
0x180660e88: int3
0x180660e89: int3
0x180660e8a: int3
0x180660e8b: int3
0x180660e8c: int3
0x180660e8d: int3
0x180660e8e: int3
0x180660e8f: int3
