0x1806e0a50: mov qword ptr [rsp + 0x10], rbx
0x1806e0a55: push rdi
0x1806e0a56: sub rsp, 0x20
0x1806e0a5a: cmp byte ptr [rip + 0x88ba936], 0
0x1806e0a61: mov rdi, rdx
0x1806e0a64: mov rbx, rcx
0x1806e0a67: jne 0x1806e0a94
0x1806e0a69: lea rcx, [rip + 0x856c198]
0x1806e0a70: call 0x18049c210
0x1806e0a75: lea rcx, [rip + 0x856c864]
0x1806e0a7c: call 0x18049c210
0x1806e0a81: lea rcx, [rip + 0x856cce8]
0x1806e0a88: call 0x18049c210
0x1806e0a8d: mov byte ptr [rip + 0x88ba903], 1
0x1806e0a94: mov ecx, dword ptr [rbx + 0x18]
0x1806e0a97: mov qword ptr [rsp + 0x30], rsi
0x1806e0a9c: test ecx, ecx
0x1806e0a9e: je 0x1806e0ffb
0x1806e0aa4: sub ecx, 1
0x1806e0aa7: je 0x1806e0ca6
0x1806e0aad: sub ecx, 1
0x1806e0ab0: je 0x1806e0c75
0x1806e0ab6: sub ecx, 1
0x1806e0ab9: je 0x1806e0b29
0x1806e0abb: cmp ecx, 1
0x1806e0abe: jne 0x1806e0f9a
0x1806e0ac4: mov rcx, qword ptr [rbx + 0x10]
0x1806e0ac8: test rcx, rcx
0x1806e0acb: je 0x1806e1025
0x1806e0ad1: mov rdx, qword ptr [rip + 0x856cc98]
0x1806e0ad8: call 0x184cde9e0
0x1806e0add: mov rcx, qword ptr [rbx + 0x10]
0x1806e0ae1: test rcx, rcx
0x1806e0ae4: je 0x1806e1025
0x1806e0aea: test al, al
0x1806e0aec: jne 0x1806e1004
0x1806e0af2: mov r8, qword ptr [rip + 0x856c7e7]
0x1806e0af9: xor edx, edx
0x1806e0afb: call 0x184cde840
0x1806e0b00: test rax, rax
0x1806e0b03: je 0x1806e1025
0x1806e0b09: xor r8d, r8d
0x1806e0b0c: mov rdx, rdi
0x1806e0b0f: mov rcx, rax
0x1806e0b12: call 0x1806d94b0 ; Torappu.Battle.Buff._ExtendRemainingTime
0x1806e0b17: xor al, al
0x1806e0b19: mov rsi, qword ptr [rsp + 0x30]
0x1806e0b1e: mov rbx, qword ptr [rsp + 0x38]
0x1806e0b23: add rsp, 0x20
0x1806e0b27: pop rdi
0x1806e0b28: ret 
0x1806e0b29: mov rcx, qword ptr [rbx + 0x10]
0x1806e0b2d: test rcx, rcx
0x1806e0b30: je 0x1806e1025
0x1806e0b36: mov rdx, qword ptr [rip + 0x856cc33]
0x1806e0b3d: call 0x184cde9e0
0x1806e0b42: mov rcx, qword ptr [rbx + 0x10]
0x1806e0b46: test rcx, rcx
0x1806e0b49: je 0x1806e1025
0x1806e0b4f: test al, al
0x1806e0b51: jne 0x1806e1004
0x1806e0b57: mov r8, qword ptr [rip + 0x856c782]
0x1806e0b5e: xor edx, edx
0x1806e0b60: call 0x184cde840
0x1806e0b65: test rax, rax
0x1806e0b68: je 0x1806e1025
0x1806e0b6e: xor r8d, r8d
0x1806e0b71: mov rdx, rdi
0x1806e0b74: mov rcx, rax
0x1806e0b77: call 0x1806d9790 ; Torappu.Battle.Buff._FillRemainingTime
0x1806e0b7c: mov rcx, qword ptr [rbx + 0x10]
0x1806e0b80: test rcx, rcx
0x1806e0b83: je 0x1806e1025
0x1806e0b89: mov r8, qword ptr [rip + 0x856c750]
0x1806e0b90: xor edx, edx
0x1806e0b92: call 0x184cde840
0x1806e0b97: test rax, rax
0x1806e0b9a: je 0x1806e1025
0x1806e0ba0: mov rax, qword ptr [rax + 0x78]
0x1806e0ba4: test rax, rax
0x1806e0ba7: je 0x1806e1025
0x1806e0bad: cmp byte ptr [rax + 0x79], 0
0x1806e0bb1: je 0x1806e0f9a
0x1806e0bb7: mov rcx, qword ptr [rbx + 0x10]
0x1806e0bbb: test rcx, rcx
0x1806e0bbe: je 0x1806e1025
0x1806e0bc4: mov r8, qword ptr [rip + 0x856c715]
0x1806e0bcb: xor edx, edx
0x1806e0bcd: call 0x184cde840
0x1806e0bd2: test rax, rax
0x1806e0bd5: je 0x1806e1025
0x1806e0bdb: xor edx, edx
0x1806e0bdd: mov rcx, rax
0x1806e0be0: call 0x1806d7130 ; Torappu.Battle.Buff.TakeSnapshotToBuffAttribute
0x1806e0be5: mov rcx, qword ptr [rbx + 0x10]
0x1806e0be9: test rcx, rcx
0x1806e0bec: je 0x1806e1025
0x1806e0bf2: mov r8, qword ptr [rip + 0x856c6e7]
0x1806e0bf9: xor edx, edx
0x1806e0bfb: call 0x184cde840
0x1806e0c00: test rax, rax
0x1806e0c03: je 0x1806e1025
0x1806e0c09: cmp qword ptr [rax + 0xb8], 0
0x1806e0c11: je 0x1806e0f9a
0x1806e0c17: mov rcx, qword ptr [rbx + 0x10]
0x1806e0c1b: test rcx, rcx
0x1806e0c1e: je 0x1806e1025
0x1806e0c24: mov r8, qword ptr [rip + 0x856c6b5]
0x1806e0c2b: xor edx, edx
0x1806e0c2d: call 0x184cde840
0x1806e0c32: test rax, rax
0x1806e0c35: je 0x1806e1025
0x1806e0c3b: test rdi, rdi
0x1806e0c3e: je 0x1806e1025
0x1806e0c44: mov rcx, qword ptr [rax + 0xb8]
0x1806e0c4b: test rcx, rcx
0x1806e0c4e: je 0x1806e1025
0x1806e0c54: mov rdx, qword ptr [rdi + 0xb8]
0x1806e0c5b: xor r8d, r8d
0x1806e0c5e: call 0x182377780 ; Torappu.Blackboard.Assign
0x1806e0c63: xor al, al
0x1806e0c65: mov rsi, qword ptr [rsp + 0x30]
0x1806e0c6a: mov rbx, qword ptr [rsp + 0x38]
0x1806e0c6f: add rsp, 0x20
0x1806e0c73: pop rdi
0x1806e0c74: ret 
0x1806e0c75: mov rcx, qword ptr [rbx + 0x10]
0x1806e0c79: test rcx, rcx
0x1806e0c7c: je 0x1806e1025
0x1806e0c82: mov rdx, qword ptr [rip + 0x856cae7]
0x1806e0c89: call 0x184cde9e0
0x1806e0c8e: test al, al
0x1806e0c90: jne 0x1806e0ffb
0x1806e0c96: mov rsi, qword ptr [rsp + 0x30]
0x1806e0c9b: mov rbx, qword ptr [rsp + 0x38]
0x1806e0ca0: add rsp, 0x20
0x1806e0ca4: pop rdi
0x1806e0ca5: ret 
0x1806e0ca6: mov rcx, qword ptr [rbx + 0x10]
0x1806e0caa: test rcx, rcx
0x1806e0cad: je 0x1806e1025
0x1806e0cb3: mov rdx, qword ptr [rip + 0x856cab6]
0x1806e0cba: call 0x184cde9e0
0x1806e0cbf: test al, al
0x1806e0cc1: jne 0x1806e0fac
0x1806e0cc7: cmp dword ptr [rbx + 0x1c], 0
0x1806e0ccb: jl 0x1806e0e75
0x1806e0cd1: mov rcx, qword ptr [rbx + 0x10]
0x1806e0cd5: test rcx, rcx
0x1806e0cd8: je 0x1806e1025
0x1806e0cde: mov r8, qword ptr [rip + 0x856c5fb]
0x1806e0ce5: xor edx, edx
0x1806e0ce7: call 0x184cde840
0x1806e0cec: test rax, rax
0x1806e0cef: je 0x1806e1025
0x1806e0cf5: mov eax, dword ptr [rax + 0x9c]
0x1806e0cfb: inc eax
0x1806e0cfd: cmp eax, dword ptr [rbx + 0x1c]
0x1806e0d00: jle 0x1806e0e75
0x1806e0d06: mov rcx, qword ptr [rbx + 0x10]
0x1806e0d0a: test rcx, rcx
0x1806e0d0d: je 0x1806e1025
0x1806e0d13: mov r8, qword ptr [rip + 0x856c5c6]
0x1806e0d1a: xor edx, edx
0x1806e0d1c: call 0x184cde840
0x1806e0d21: test rax, rax
0x1806e0d24: je 0x1806e1025
0x1806e0d2a: mov ecx, dword ptr [rbx + 0x1c]
0x1806e0d2d: cmp dword ptr [rax + 0x9c], ecx
0x1806e0d33: jne 0x1806e0f9a
0x1806e0d39: mov rcx, qword ptr [rbx + 0x10]
0x1806e0d3d: test rcx, rcx
0x1806e0d40: je 0x1806e1025
0x1806e0d46: mov r8, qword ptr [rip + 0x856c593]
0x1806e0d4d: xor edx, edx
0x1806e0d4f: call 0x184cde840
0x1806e0d54: test rax, rax
0x1806e0d57: je 0x1806e1025
0x1806e0d5d: cmp byte ptr [rax + 0xa4], 0
0x1806e0d64: je 0x1806e0f9a
0x1806e0d6a: mov rcx, qword ptr [rbx + 0x10]
0x1806e0d6e: test rcx, rcx
0x1806e0d71: je 0x1806e1025
0x1806e0d77: mov r8, qword ptr [rip + 0x856c562]
0x1806e0d7e: xor edx, edx
0x1806e0d80: call 0x184cde840
0x1806e0d85: test rax, rax
0x1806e0d88: je 0x1806e1025
0x1806e0d8e: mov ecx, dword ptr [rbx + 0x20]
0x1806e0d91: mov dword ptr [rax + 0xa0], ecx
0x1806e0d97: mov rcx, qword ptr [rbx + 0x10]
0x1806e0d9b: test rcx, rcx
0x1806e0d9e: je 0x1806e1025
0x1806e0da4: mov r8, qword ptr [rip + 0x856c535]
0x1806e0dab: xor edx, edx
0x1806e0dad: call 0x184cde840
0x1806e0db2: mov rsi, rax
0x1806e0db5: test rax, rax
0x1806e0db8: je 0x1806e1025
0x1806e0dbe: cmp byte ptr [rip + 0x88ba5a8], 0
0x1806e0dc5: jne 0x1806e0de6
0x1806e0dc7: lea rcx, [rip + 0x8463c8a]
0x1806e0dce: call 0x18049c210
0x1806e0dd3: lea rcx, [rip + 0x8524afe]
0x1806e0dda: call 0x18049c210
0x1806e0ddf: mov byte ptr [rip + 0x88ba587], 1
0x1806e0de6: mov rax, qword ptr [rip + 0x8463c6b]
0x1806e0ded: cmp dword ptr [rax + 0xe0], 0
0x1806e0df4: jne 0x1806e0e05
0x1806e0df6: mov rcx, rax
0x1806e0df9: call 0x18049c450
0x1806e0dfe: mov rax, qword ptr [rip + 0x8463c53]
0x1806e0e05: mov rax, qword ptr [rax + 0xb8]
0x1806e0e0c: mov rcx, qword ptr [rax + 0x6e8]
0x1806e0e13: test rcx, rcx
0x1806e0e16: jne 0x1806e0f8c
0x1806e0e1c: mov rbx, qword ptr [rsi + 0x88]
0x1806e0e23: test rdi, rdi
0x1806e0e26: je 0x1806e1025
0x1806e0e2c: xor edx, edx
0x1806e0e2e: mov rcx, rdi
0x1806e0e31: call 0x1806de570 ; Torappu.Battle.Buff.get_remainingTime
0x1806e0e36: mov rcx, qword ptr [rip + 0x8524a9b]
0x1806e0e3d: mov rdi, rax
0x1806e0e40: cmp dword ptr [rcx + 0xe0], 0
0x1806e0e47: jne 0x1806e0e4e
0x1806e0e49: call 0x18049c450
0x1806e0e4e: xor r8d, r8d
0x1806e0e51: mov rdx, rdi
0x1806e0e54: mov rcx, rbx
0x1806e0e57: call 0x18695fe00 ; Torappu.TSMath.Max
0x1806e0e5c: mov qword ptr [rsi + 0x88], rax
0x1806e0e63: xor al, al
0x1806e0e65: mov rsi, qword ptr [rsp + 0x30]
0x1806e0e6a: mov rbx, qword ptr [rsp + 0x38]
0x1806e0e6f: add rsp, 0x20
0x1806e0e73: pop rdi
0x1806e0e74: ret 
0x1806e0e75: mov rcx, qword ptr [rbx + 0x10]
0x1806e0e79: test rcx, rcx
0x1806e0e7c: je 0x1806e1025
0x1806e0e82: mov r8, qword ptr [rip + 0x856c457]
0x1806e0e89: xor edx, edx
0x1806e0e8b: call 0x184cde840
0x1806e0e90: test rax, rax
0x1806e0e93: je 0x1806e1025
0x1806e0e99: mov ecx, dword ptr [rbx + 0x20]
0x1806e0e9c: mov dword ptr [rax + 0xa0], ecx
0x1806e0ea2: mov rcx, qword ptr [rbx + 0x10]
0x1806e0ea6: test rcx, rcx
0x1806e0ea9: je 0x1806e1025
0x1806e0eaf: mov r8, qword ptr [rip + 0x856c42a]
0x1806e0eb6: xor edx, edx
0x1806e0eb8: call 0x184cde840
0x1806e0ebd: mov rsi, rax
0x1806e0ec0: test rax, rax
0x1806e0ec3: je 0x1806e1025
0x1806e0ec9: cmp byte ptr [rip + 0x88ba49c], 0
0x1806e0ed0: jne 0x1806e0ef1
0x1806e0ed2: lea rcx, [rip + 0x8463b7f]
0x1806e0ed9: call 0x18049c210
0x1806e0ede: lea rcx, [rip + 0x85249f3]
0x1806e0ee5: call 0x18049c210
0x1806e0eea: mov byte ptr [rip + 0x88ba47b], 1
0x1806e0ef1: mov rax, qword ptr [rip + 0x8463b60]
0x1806e0ef8: cmp dword ptr [rax + 0xe0], 0
0x1806e0eff: jne 0x1806e0f10
0x1806e0f01: mov rcx, rax
0x1806e0f04: call 0x18049c450
0x1806e0f09: mov rax, qword ptr [rip + 0x8463b48]
0x1806e0f10: mov rax, qword ptr [rax + 0xb8]
0x1806e0f17: mov rcx, qword ptr [rax + 0x6e0]
0x1806e0f1e: test rcx, rcx
0x1806e0f21: jne 0x1806e0f8c
0x1806e0f23: inc dword ptr [rsi + 0x9c]
0x1806e0f29: mov rbx, qword ptr [rsi + 0x88]
0x1806e0f30: test rdi, rdi
0x1806e0f33: je 0x1806e1025
0x1806e0f39: xor edx, edx
0x1806e0f3b: mov rcx, rdi
0x1806e0f3e: call 0x1806de570 ; Torappu.Battle.Buff.get_remainingTime
0x1806e0f43: mov rcx, qword ptr [rip + 0x852498e]
0x1806e0f4a: mov rdi, rax
0x1806e0f4d: cmp dword ptr [rcx + 0xe0], 0
0x1806e0f54: jne 0x1806e0f5b
0x1806e0f56: call 0x18049c450
0x1806e0f5b: xor r8d, r8d
0x1806e0f5e: mov rdx, rdi
0x1806e0f61: mov rcx, rbx
0x1806e0f64: call 0x18695fe00 ; Torappu.TSMath.Max
0x1806e0f69: xor edx, edx
0x1806e0f6b: mov qword ptr [rsi + 0x88], rax
0x1806e0f72: mov rcx, rsi
0x1806e0f75: call 0x1806d9370 ; Torappu.Battle.Buff._DoUpdateStack
0x1806e0f7a: xor al, al
0x1806e0f7c: mov rsi, qword ptr [rsp + 0x30]
0x1806e0f81: mov rbx, qword ptr [rsp + 0x38]
0x1806e0f86: add rsp, 0x20
0x1806e0f8a: pop rdi
0x1806e0f8b: ret 
0x1806e0f8c: xor r9d, r9d
0x1806e0f8f: mov r8, rdi
0x1806e0f92: mov rdx, rsi
0x1806e0f95: call 0x18338c7c0 ; XLua.DelegateBridge.__Gen_Delegate_Imp23
0x1806e0f9a: xor al, al
0x1806e0f9c: mov rsi, qword ptr [rsp + 0x30]
0x1806e0fa1: mov rbx, qword ptr [rsp + 0x38]
0x1806e0fa6: add rsp, 0x20
0x1806e0faa: pop rdi
0x1806e0fab: ret 
0x1806e0fac: mov rcx, qword ptr [rbx + 0x10]
0x1806e0fb0: test rcx, rcx
0x1806e0fb3: je 0x1806e1025
0x1806e0fb5: mov r8, qword ptr [rip + 0x856bc4c]
0x1806e0fbc: mov rdx, rdi
0x1806e0fbf: call 0x1853ff1d0
0x1806e0fc4: mov rcx, qword ptr [rbx + 0x10]
0x1806e0fc8: test rcx, rcx
0x1806e0fcb: je 0x1806e1025
0x1806e0fcd: mov r8, qword ptr [rip + 0x856c30c]
0x1806e0fd4: xor edx, edx
0x1806e0fd6: call 0x184cde840
0x1806e0fdb: test rax, rax
0x1806e0fde: je 0x1806e1025
0x1806e0fe0: mov ecx, dword ptr [rbx + 0x20]
0x1806e0fe3: mov dword ptr [rax + 0xa0], ecx
0x1806e0fe9: mov al, 1
0x1806e0feb: mov rsi, qword ptr [rsp + 0x30]
0x1806e0ff0: mov rbx, qword ptr [rsp + 0x38]
0x1806e0ff5: add rsp, 0x20
0x1806e0ff9: pop rdi
0x1806e0ffa: ret 
0x1806e0ffb: mov rcx, qword ptr [rbx + 0x10]
0x1806e0fff: test rcx, rcx
0x1806e1002: je 0x1806e1025
0x1806e1004: mov r8, qword ptr [rip + 0x856bbfd]
0x1806e100b: mov rdx, rdi
0x1806e100e: call 0x1853ff1d0
0x1806e1013: mov rsi, qword ptr [rsp + 0x30]
0x1806e1018: mov al, 1
0x1806e101a: mov rbx, qword ptr [rsp + 0x38]
0x1806e101f: add rsp, 0x20
0x1806e1023: pop rdi
0x1806e1024: ret 
0x1806e1025: call 0x18049c3c0
0x1806e102a: int3 
0x1806e102b: int3 
0x1806e102c: int3 
0x1806e102d: int3 
0x1806e102e: int3 
0x1806e102f: int3 
