0x180669b60: push rsi
0x180669b62: push r12
0x180669b64: sub rsp, 0x58
0x180669b68: cmp byte ptr [rip + 0x8931507], 0
0x180669b6f: mov rsi, rdx
0x180669b72: mov r12, rcx
0x180669b75: jne 0x180669bba
0x180669b77: lea rcx, [rip + 0x84a60c2]
0x180669b7e: call 0x18049c210
0x180669b83: lea rcx, [rip + 0x84adca6]
0x180669b8a: call 0x18049c210
0x180669b8f: lea rcx, [rip + 0x84b64ba]
0x180669b96: call 0x18049c210
0x180669b9b: lea rcx, [rip + 0x855bff6]
0x180669ba2: call 0x18049c210
0x180669ba7: lea rcx, [rip + 0x855c23a]
0x180669bae: call 0x18049c210
0x180669bb3: mov byte ptr [rip + 0x89314bc], 1
0x180669bba: mov rax, qword ptr [rip + 0x84a607f]
0x180669bc1: mov byte ptr [rsp + 0x88], 0
0x180669bc9: mov byte ptr [rsp + 0x30], 0
0x180669bce: cmp dword ptr [rax + 0xe0], 0
0x180669bd5: jne 0x180669be6
0x180669bd7: mov rcx, rax
0x180669bda: call 0x18049c450
0x180669bdf: mov rax, qword ptr [rip + 0x84a605a]
0x180669be6: mov rax, qword ptr [rax + 0xb8]
0x180669bed: mov rcx, qword ptr [rax + 0xb90]
0x180669bf4: test rcx, rcx
0x180669bf7: jne 0x180669e41
0x180669bfd: test rsi, rsi
0x180669c00: je 0x180669e78
0x180669c06: mov qword ptr [rsp + 0x50], r13
0x180669c0b: mov qword ptr [rsp + 0x40], r15
0x180669c10: mov qword ptr [rsp + 0x70], rbx
0x180669c15: mov qword ptr [rsp + 0x78], rbp
0x180669c1a: mov qword ptr [rsp + 0x80], rdi
0x180669c22: mov qword ptr [rsp + 0x48], r14
0x180669c27: xor r13d, r13d
0x180669c2a: mov r15d, 0x20
0x180669c30: cmp qword ptr [rsi + 0x10], r13
0x180669c34: je 0x180669d3a
0x180669c3a: mov edi, r13d
0x180669c3d: mov ecx, r13d
0x180669c40: mov r14d, r15d
0x180669c43: mov rax, qword ptr [rsi + 0x10]
0x180669c47: test rax, rax
0x180669c4a: je 0x180669e86
0x180669c50: cmp ecx, dword ptr [rax + 0x18]
0x180669c53: jge 0x180669d3a
0x180669c59: cmp edi, dword ptr [rax + 0x18]
0x180669c5c: jae 0x180669e80
0x180669c62: mov rbx, qword ptr [r14 + rax]
0x180669c66: test rbx, rbx
0x180669c69: je 0x180669e86
0x180669c6f: cmp byte ptr [rip + 0x896edfa], r13b
0x180669c76: jbe 0x180669c80
0x180669c78: mov rcx, qword ptr [rbx]
0x180669c7b: call 0x180457010
0x180669c80: mov rdx, qword ptr [rbx]
0x180669c83: mov rcx, rbx
0x180669c86: mov rax, qword ptr [rdx + 0x190]
0x180669c8d: mov rdx, qword ptr [rdx + 0x198]
0x180669c94: call rax
0x180669c96: test al, al
0x180669c98: jne 0x180669d2d
0x180669c9e: lea r9, [rsp + 0x88]
0x180669ca6: mov qword ptr [rsp + 0x20], r13
0x180669cab: xor r8d, r8d
0x180669cae: mov rdx, rbx
0x180669cb1: mov rcx, r12
0x180669cb4: call 0x180664c70 ; Torappu.Battle.BattleController._CreatePredefinedCharacter
0x180669cb9: mov rcx, qword ptr [rip + 0x84b6390]
0x180669cc0: mov rbp, rax
0x180669cc3: cmp dword ptr [rcx + 0xe0], r13d
0x180669cca: jne 0x180669cd1
0x180669ccc: call 0x18049c450
0x180669cd1: xor r8d, r8d
0x180669cd4: xor edx, edx
0x180669cd6: mov rcx, rbp
0x180669cd9: call 0x186dcf290 ; UnityEngine.Object.op_Equality
0x180669cde: test al, al
0x180669ce0: je 0x180669d2d
0x180669ce2: cmp byte ptr [rsp + 0x88], r13b
0x180669cea: jne 0x180669d2d
0x180669cec: mov ecx, 7
0x180669cf1: mov rdx, rbx
0x180669cf4: call 0x180005610
0x180669cf9: mov rcx, qword ptr [rip + 0x855be98]
0x180669d00: xor r8d, r8d
0x180669d03: mov rdx, rax
0x180669d06: call 0x1860148b0 ; System.String.Concat
0x180669d0b: mov rcx, qword ptr [rip + 0x84adb1e]
0x180669d12: mov rbx, rax
0x180669d15: cmp dword ptr [rcx + 0xe0], r13d
0x180669d1c: jne 0x180669d23
0x180669d1e: call 0x18049c450
0x180669d23: xor edx, edx
0x180669d25: mov rcx, rbx
0x180669d28: call 0x18693dab0 ; UnityEngine.DLog.LogError
0x180669d2d: inc edi
0x180669d2f: add r14, 8
0x180669d33: mov ecx, edi
0x180669d35: jmp 0x180669c43
0x180669d3a: cmp qword ptr [rsi + 0x18], r13
0x180669d3e: je 0x180669e57
0x180669d44: mov edi, r13d
0x180669d47: mov ecx, r13d
0x180669d4a: nop word ptr [rax + rax]
0x180669d50: mov rax, qword ptr [rsi + 0x18]
0x180669d54: test rax, rax
0x180669d57: je 0x180669e86
0x180669d5d: cmp ecx, dword ptr [rax + 0x18]
0x180669d60: jge 0x180669e57
0x180669d66: cmp edi, dword ptr [rax + 0x18]
0x180669d69: jae 0x180669e80
0x180669d6f: mov rbx, qword ptr [r15 + rax]
0x180669d73: test rbx, rbx
0x180669d76: je 0x180669e86
0x180669d7c: cmp byte ptr [rip + 0x896eced], r13b
0x180669d83: jbe 0x180669d8d
0x180669d85: mov rcx, qword ptr [rbx]
0x180669d88: call 0x180457010
0x180669d8d: mov rdx, qword ptr [rbx]
0x180669d90: mov rcx, rbx
0x180669d93: mov rax, qword ptr [rdx + 0x190]
0x180669d9a: mov rdx, qword ptr [rdx + 0x198]
0x180669da1: call rax
0x180669da3: test al, al
0x180669da5: jne 0x180669e34
0x180669dab: lea r9, [rsp + 0x30]
0x180669db0: mov qword ptr [rsp + 0x20], r13
0x180669db5: mov r8b, 1
0x180669db8: mov rdx, rbx
0x180669dbb: mov rcx, r12
0x180669dbe: call 0x180664c70 ; Torappu.Battle.BattleController._CreatePredefinedCharacter
0x180669dc3: mov rcx, qword ptr [rip + 0x84b6286]
0x180669dca: mov rbp, rax
0x180669dcd: cmp dword ptr [rcx + 0xe0], r13d
0x180669dd4: jne 0x180669ddb
0x180669dd6: call 0x18049c450
0x180669ddb: xor r8d, r8d
0x180669dde: xor edx, edx
0x180669de0: mov rcx, rbp
0x180669de3: call 0x186dcf290 ; UnityEngine.Object.op_Equality
0x180669de8: test al, al
0x180669dea: je 0x180669e34
0x180669dec: cmp byte ptr [rsp + 0x30], r13b
0x180669df1: jne 0x180669e34
0x180669df3: mov ecx, 7
0x180669df8: mov rdx, rbx
0x180669dfb: call 0x180005610
0x180669e00: mov rcx, qword ptr [rip + 0x855bfe1]
0x180669e07: xor r8d, r8d
0x180669e0a: mov rdx, rax
0x180669e0d: call 0x1860148b0 ; System.String.Concat
0x180669e12: mov rcx, qword ptr [rip + 0x84ada17]
0x180669e19: mov rbx, rax
0x180669e1c: cmp dword ptr [rcx + 0xe0], r13d
0x180669e23: jne 0x180669e2a
0x180669e25: call 0x18049c450
0x180669e2a: xor edx, edx
0x180669e2c: mov rcx, rbx
0x180669e2f: call 0x18693dab0 ; UnityEngine.DLog.LogError
0x180669e34: inc edi
0x180669e36: add r15, 8
0x180669e3a: mov ecx, edi
0x180669e3c: jmp 0x180669d50
0x180669e41: xor r9d, r9d
0x180669e44: mov r8, rsi
0x180669e47: mov rdx, r12
0x180669e4a: call 0x18338c7c0 ; XLua.DelegateBridge.__Gen_Delegate_Imp23
0x180669e4f: add rsp, 0x58
0x180669e53: pop r12
0x180669e55: pop rsi
0x180669e56: ret
0x180669e57: mov r14, qword ptr [rsp + 0x48]
0x180669e5c: mov rbp, qword ptr [rsp + 0x78]
0x180669e61: mov rdi, qword ptr [rsp + 0x80]
0x180669e69: mov rbx, qword ptr [rsp + 0x70]
0x180669e6e: mov r13, qword ptr [rsp + 0x50]
0x180669e73: mov r15, qword ptr [rsp + 0x40]
0x180669e78: add rsp, 0x58
0x180669e7c: pop r12
0x180669e7e: pop rsi
0x180669e7f: ret
0x180669e80: call 0x18049c3b0
0x180669e85: int3
0x180669e86: call 0x18049c3c0
0x180669e8b: int3
0x180669e8c: int3
0x180669e8d: int3
0x180669e8e: int3
0x180669e8f: int3
