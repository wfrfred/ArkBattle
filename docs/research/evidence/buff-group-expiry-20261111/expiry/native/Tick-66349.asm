0x1806c9880: mov qword ptr [rsp + 0x10], rbx
0x1806c9885: mov qword ptr [rsp + 0x18], rsi
0x1806c988a: mov qword ptr [rsp + 8], rcx
0x1806c988f: push rdi
0x1806c9890: push r12
0x1806c9892: push r13
0x1806c9894: push r14
0x1806c9896: push r15
0x1806c9898: sub rsp, 0x70
0x1806c989c: mov rbx, rdx
0x1806c989f: mov r13, rcx
0x1806c98a2: cmp byte ptr [rip + 0x88d1b28], 0
0x1806c98a9: jne 0x1806c98fa
0x1806c98ab: lea rcx, [rip + 0x85a150e]
0x1806c98b2: call 0x18049c210
0x1806c98b7: lea rcx, [rip + 0x8525dc2]
0x1806c98be: call 0x18049c210
0x1806c98c3: lea rcx, [rip + 0x8475eb6]
0x1806c98ca: call 0x18049c210
0x1806c98cf: lea rcx, [rip + 0x8530e4a]
0x1806c98d6: call 0x18049c210
0x1806c98db: lea rcx, [rip + 0x847b0b6]
0x1806c98e2: call 0x18049c210
0x1806c98e7: lea rcx, [rip + 0x8542842]
0x1806c98ee: call 0x18049c210
0x1806c98f3: mov byte ptr [rip + 0x88d1ad7], 1
0x1806c98fa: xorps xmm0, xmm0
0x1806c98fd: movups xmmword ptr [rsp + 0x40], xmm0
0x1806c9902: xorps xmm1, xmm1
0x1806c9905: movups xmmword ptr [rsp + 0x50], xmm1
0x1806c990a: mov rax, qword ptr [rip + 0x85a14af]
0x1806c9911: mov rcx, qword ptr [rax + 0xb8]
0x1806c9918: mov rcx, qword ptr [rcx + 0x1c0]
0x1806c991f: test rcx, rcx
0x1806c9922: jne 0x1806c9cc1
0x1806c9928: mov rcx, qword ptr [r13 + 0x18]
0x1806c992c: test rcx, rcx
0x1806c992f: je 0x1806c9d0c
0x1806c9935: mov rdx, qword ptr [rip + 0x8525d44]
0x1806c993c: call 0x185c94aa0
0x1806c9941: mov qword ptr [rsp + 0xb8], rax
0x1806c9949: xor r12d, r12d
0x1806c994c: mov qword ptr [rsp + 0x30], r12
0x1806c9951: lea rdi, [rsp + 0xb8]
0x1806c9959: mov qword ptr [rsp + 0x38], rdi
0x1806c995e: nop
0x1806c9960: mov r8, qword ptr [rsp + 0xb8]
0x1806c9968: test r8, r8
0x1806c996b: je 0x1806c9cef
0x1806c9971: xor ecx, ecx
0x1806c9973: mov rdx, qword ptr [rip + 0x847b01e]
0x1806c997a: call 0x180005310
0x1806c997f: test al, al
0x1806c9981: je 0x1806c9a74
0x1806c9987: mov rsi, qword ptr [rsp + 0xb8]
0x1806c998f: test rsi, rsi
0x1806c9992: je 0x1806c9ce9
0x1806c9998: mov r14, qword ptr [rip + 0x8530d81]
0x1806c999f: mov r15, qword ptr [rsi]
0x1806c99a2: cmp byte ptr [rip + 0x890f0c7], 0
0x1806c99a9: je 0x1806c99b3
0x1806c99ab: mov rcx, r15
0x1806c99ae: call 0x180457010
0x1806c99b3: movzx ecx, r12w
0x1806c99b7: movzx edx, word ptr [r15 + 0x12e]
0x1806c99bf: cmp r12w, dx
0x1806c99c3: jae 0x1806c99e4
0x1806c99c5: mov r8, qword ptr [r15 + 0xb0]
0x1806c99cc: nop dword ptr [rax]
0x1806c99d0: movzx eax, cx
0x1806c99d3: add rax, rax
0x1806c99d6: cmp qword ptr [r8 + rax*8], r14
0x1806c99da: je 0x1806c9a4c
0x1806c99dc: inc cx
0x1806c99df: cmp cx, dx
0x1806c99e2: jb 0x1806c99d0
0x1806c99e4: xor r8d, r8d
0x1806c99e7: mov rdx, r14
0x1806c99ea: mov rcx, rsi
0x1806c99ed: call 0x180455fd0
0x1806c99f2: mov r8, rax
0x1806c99f5: mov rax, qword ptr [r8]
0x1806c99f8: mov r8, qword ptr [r8 + 8]
0x1806c99fc: mov rdx, rsi
0x1806c99ff: lea rcx, [rsp + 0x60]
0x1806c9a04: call rax
0x1806c9a06: movups xmm0, xmmword ptr [rax]
0x1806c9a09: movups xmmword ptr [rsp + 0x40], xmm0
0x1806c9a0e: mov rdx, qword ptr [rip + 0x854271b]
0x1806c9a15: lea rcx, [rsp + 0x40]
0x1806c9a1a: call 0x1853ae540
0x1806c9a1f: mov rsi, rax
0x1806c9a22: test rax, rax
0x1806c9a25: je 0x1806c9960
0x1806c9a2b: xor edx, edx
0x1806c9a2d: mov rcx, rax
0x1806c9a30: call 0x1806de020 ; Torappu.Battle.Buff.get_needRemove
0x1806c9a35: xor r8d, r8d
0x1806c9a38: test al, al
0x1806c9a3a: jne 0x1806c9a64
0x1806c9a3c: mov rdx, rbx
0x1806c9a3f: mov rcx, rsi
0x1806c9a42: call 0x1806d54d0 ; Torappu.Battle.Buff.OnTick
0x1806c9a47: jmp 0x1806c9960
0x1806c9a4c: movzx ecx, cx
0x1806c9a4f: add rcx, rcx
0x1806c9a52: movsxd r8, dword ptr [r8 + rcx*8 + 8]
0x1806c9a57: add r8, 0x14
0x1806c9a5b: shl r8, 4
0x1806c9a5f: add r8, r15
0x1806c9a62: jmp 0x1806c99f5
0x1806c9a64: mov rdx, rsi
0x1806c9a67: mov rcx, r13
0x1806c9a6a: call 0x1806cd650 ; Torappu.Battle.Buff/BuffContainer._FinishAndRemoveBuff
0x1806c9a6f: jmp 0x1806c9960
0x1806c9a74: cmp qword ptr [rdi], 0
0x1806c9a78: je 0x1806c9a8b
0x1806c9a7a: xor ecx, ecx
0x1806c9a7c: mov r8, qword ptr [rdi]
0x1806c9a7f: mov rdx, qword ptr [rip + 0x8475cfa]
0x1806c9a86: call 0x180005310
0x1806c9a8b: jmp 0x1806c9ac2
0x1806c9a8d: mov r8, qword ptr [rsp + 0x38]
0x1806c9a92: cmp qword ptr [r8], 0
0x1806c9a96: je 0x1806c9aa9
0x1806c9a98: xor ecx, ecx
0x1806c9a9a: mov r8, qword ptr [r8]
0x1806c9a9d: mov rdx, qword ptr [rip + 0x8475cdc]
0x1806c9aa4: call 0x180005310
0x1806c9aa9: mov rcx, qword ptr [rsp + 0x30]
0x1806c9aae: test rcx, rcx
0x1806c9ab1: jne 0x1806c9cf5
0x1806c9ab7: xor r12d, r12d
0x1806c9aba: mov r13, qword ptr [rsp + 0xa0]
0x1806c9ac2: mov rcx, qword ptr [r13 + 0x18]
0x1806c9ac6: test rcx, rcx
0x1806c9ac9: je 0x1806c9d0c
0x1806c9acf: mov rdx, qword ptr [rip + 0x8525baa]
0x1806c9ad6: call 0x185c94aa0
0x1806c9adb: mov qword ptr [rsp + 0xb8], rax
0x1806c9ae3: mov qword ptr [rsp + 0x30], r12
0x1806c9ae8: lea rbx, [rsp + 0xb8]
0x1806c9af0: mov qword ptr [rsp + 0x38], rbx
0x1806c9af5: mov rdi, qword ptr [rsp + 0xb8]
0x1806c9afd: test rdi, rdi
0x1806c9b00: je 0x1806c9d00
0x1806c9b06: mov rsi, qword ptr [rip + 0x847ae8b]
0x1806c9b0d: mov r14, qword ptr [rdi]
0x1806c9b10: cmp byte ptr [rip + 0x890ef59], 0
0x1806c9b17: je 0x1806c9b21
0x1806c9b19: mov rcx, r14
0x1806c9b1c: call 0x180457010
0x1806c9b21: movzx ecx, r12w
0x1806c9b25: movzx edx, word ptr [r14 + 0x12e]
0x1806c9b2d: cmp r12w, dx
0x1806c9b31: jae 0x1806c9b58
0x1806c9b33: mov r8, qword ptr [r14 + 0xb0]
0x1806c9b3a: nop word ptr [rax + rax]
0x1806c9b40: movzx eax, cx
0x1806c9b43: add rax, rax
0x1806c9b46: cmp qword ptr [r8 + rax*8], rsi
0x1806c9b4a: je 0x1806c9c3b
0x1806c9b50: inc cx
0x1806c9b53: cmp cx, dx
0x1806c9b56: jb 0x1806c9b40
0x1806c9b58: xor r8d, r8d
0x1806c9b5b: mov rdx, rsi
0x1806c9b5e: mov rcx, rdi
0x1806c9b61: call 0x180455fd0
0x1806c9b66: mov rdx, rax
0x1806c9b69: mov rax, qword ptr [rdx]
0x1806c9b6c: mov rdx, qword ptr [rdx + 8]
0x1806c9b70: mov rcx, rdi
0x1806c9b73: call rax
0x1806c9b75: test al, al
0x1806c9b77: je 0x1806c9c6e
0x1806c9b7d: mov rdi, qword ptr [rsp + 0xb8]
0x1806c9b85: test rdi, rdi
0x1806c9b88: je 0x1806c9cfb
0x1806c9b8e: mov rsi, qword ptr [rip + 0x8530b8b]
0x1806c9b95: mov r14, qword ptr [rdi]
0x1806c9b98: cmp byte ptr [rip + 0x890eed1], 0
0x1806c9b9f: je 0x1806c9ba9
0x1806c9ba1: mov rcx, r14
0x1806c9ba4: call 0x180457010
0x1806c9ba9: movzx ecx, r12w
0x1806c9bad: movzx edx, word ptr [r14 + 0x12e]
0x1806c9bb5: cmp r12w, dx
0x1806c9bb9: jae 0x1806c9be8
0x1806c9bbb: mov r8, qword ptr [r14 + 0xb0]
0x1806c9bc2: nop dword ptr [rax]
0x1806c9bc6: nop word ptr [rax + rax]
0x1806c9bd0: movzx eax, cx
0x1806c9bd3: add rax, rax
0x1806c9bd6: cmp qword ptr [r8 + rax*8], rsi
0x1806c9bda: je 0x1806c9c56
0x1806c9be0: inc cx
0x1806c9be3: cmp cx, dx
0x1806c9be6: jb 0x1806c9bd0
0x1806c9be8: xor r8d, r8d
0x1806c9beb: mov rdx, rsi
0x1806c9bee: mov rcx, rdi
0x1806c9bf1: call 0x180455fd0
0x1806c9bf6: mov r8, rax
0x1806c9bf9: mov rax, qword ptr [r8]
0x1806c9bfc: mov r8, qword ptr [r8 + 8]
0x1806c9c00: mov rdx, rdi
0x1806c9c03: lea rcx, [rsp + 0x60]
0x1806c9c08: call rax
0x1806c9c0a: movups xmm0, xmmword ptr [rax]
0x1806c9c0d: movups xmmword ptr [rsp + 0x50], xmm0
0x1806c9c12: mov rdx, qword ptr [rip + 0x8542517]
0x1806c9c19: lea rcx, [rsp + 0x50]
0x1806c9c1e: call 0x1853ae540
0x1806c9c23: test rax, rax
0x1806c9c26: je 0x1806c9af5
0x1806c9c2c: xor edx, edx
0x1806c9c2e: mov rcx, rax
0x1806c9c31: call 0x1806d2e20 ; Torappu.Battle.Buff.OnLateTick
0x1806c9c36: jmp 0x1806c9af5
0x1806c9c3b: movzx ecx, cx
0x1806c9c3e: add rcx, rcx
0x1806c9c41: movsxd rdx, dword ptr [r8 + rcx*8 + 8]
0x1806c9c46: add rdx, 0x14
0x1806c9c4a: shl rdx, 4
0x1806c9c4e: add rdx, r14
0x1806c9c51: jmp 0x1806c9b69
0x1806c9c56: movzx ecx, cx
0x1806c9c59: add rcx, rcx
0x1806c9c5c: movsxd r8, dword ptr [r8 + rcx*8 + 8]
0x1806c9c61: add r8, 0x14
0x1806c9c65: shl r8, 4
0x1806c9c69: add r8, r14
0x1806c9c6c: jmp 0x1806c9bf9
0x1806c9c6e: cmp qword ptr [rbx], 0
0x1806c9c72: je 0x1806c9c85
0x1806c9c74: xor ecx, ecx
0x1806c9c76: mov r8, qword ptr [rbx]
0x1806c9c79: mov rdx, qword ptr [rip + 0x8475b00]
0x1806c9c80: call 0x180005310
0x1806c9c85: jmp 0x1806c9cb5
0x1806c9c87: mov r8, qword ptr [rsp + 0x38]
0x1806c9c8c: cmp qword ptr [r8], 0
0x1806c9c90: je 0x1806c9ca3
0x1806c9c92: xor ecx, ecx
0x1806c9c94: mov r8, qword ptr [r8]
0x1806c9c97: mov rdx, qword ptr [rip + 0x8475ae2]
0x1806c9c9e: call 0x180005310
0x1806c9ca3: mov rcx, qword ptr [rsp + 0x30]
0x1806c9ca8: test rcx, rcx
0x1806c9cab: jne 0x1806c9d06
0x1806c9cad: mov r13, qword ptr [rsp + 0xa0]
0x1806c9cb5: xor edx, edx
0x1806c9cb7: mov rcx, r13
0x1806c9cba: call 0x1806cc320 ; Torappu.Battle.Buff/BuffContainer._CheckFinishedBuffs
0x1806c9cbf: jmp 0x1806c9ccf
0x1806c9cc1: xor r9d, r9d
0x1806c9cc4: mov r8, rbx
0x1806c9cc7: mov rdx, r13
0x1806c9cca: call 0x1834de650 ; XLua.DelegateBridge.__Gen_Delegate_Imp454
0x1806c9ccf: lea r11, [rsp + 0x70]
0x1806c9cd4: mov rbx, qword ptr [r11 + 0x38]
0x1806c9cd8: mov rsi, qword ptr [r11 + 0x40]
0x1806c9cdc: mov rsp, r11
0x1806c9cdf: pop r15
0x1806c9ce1: pop r14
0x1806c9ce3: pop r13
0x1806c9ce5: pop r12
0x1806c9ce7: pop rdi
0x1806c9ce8: ret
0x1806c9ce9: call 0x18049c3c0
0x1806c9cee: nop
0x1806c9cef: call 0x18049c3c0
0x1806c9cf4: nop
0x1806c9cf5: call 0x180483060
0x1806c9cfa: nop
0x1806c9cfb: call 0x18049c3c0
0x1806c9d00: call 0x18049c3c0
0x1806c9d05: nop
0x1806c9d06: call 0x180483060
0x1806c9d0b: int3
0x1806c9d0c: call 0x18049c3c0
0x1806c9d11: int3
0x1806c9d12: int3
0x1806c9d13: int3
0x1806c9d14: int3
0x1806c9d15: int3
0x1806c9d16: int3
0x1806c9d17: int3
0x1806c9d18: int3
0x1806c9d19: int3
0x1806c9d1a: int3
0x1806c9d1b: int3
0x1806c9d1c: int3
0x1806c9d1d: int3
0x1806c9d1e: int3
0x1806c9d1f: int3
