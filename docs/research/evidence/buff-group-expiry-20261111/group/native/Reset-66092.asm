0x1806d5b20: mov qword ptr [rsp + 0x20], r9
0x1806d5b25: mov qword ptr [rsp + 0x18], r8
0x1806d5b2a: push rbp
0x1806d5b2b: push rbx
0x1806d5b2c: push rsi
0x1806d5b2d: push rdi
0x1806d5b2e: push r12
0x1806d5b30: push r14
0x1806d5b32: lea rbp, [rsp - 7]
0x1806d5b37: sub rsp, 0x98
0x1806d5b3e: cmp byte ptr [rip + 0x88c578e], 0
0x1806d5b45: mov r12, r9
0x1806d5b48: mov rbx, r8
0x1806d5b4b: mov r14, rdx
0x1806d5b4e: mov rsi, rcx
0x1806d5b51: jne 0x1806d5c72
0x1806d5b57: lea rcx, [rip + 0x854a3c2]
0x1806d5b5e: call 0x18049c210
0x1806d5b63: lea rcx, [rip + 0x8453b5e]
0x1806d5b6a: call 0x18049c210
0x1806d5b6f: lea rcx, [rip + 0x846eee2]
0x1806d5b76: call 0x18049c210
0x1806d5b7b: lea rcx, [rip + 0x8501a9e]
0x1806d5b82: call 0x18049c210
0x1806d5b87: lea rcx, [rip + 0x84f1122]
0x1806d5b8e: call 0x18049c210
0x1806d5b93: lea rcx, [rip + 0x85737de]
0x1806d5b9a: call 0x18049c210
0x1806d5b9f: lea rcx, [rip + 0x84a8752]
0x1806d5ba6: call 0x18049c210
0x1806d5bab: lea rcx, [rip + 0x845285e]
0x1806d5bb2: call 0x18049c210
0x1806d5bb7: lea rcx, [rip + 0x85606ea]
0x1806d5bbe: call 0x18049c210
0x1806d5bc3: lea rcx, [rip + 0x84f02be]
0x1806d5bca: call 0x18049c210
0x1806d5bcf: lea rcx, [rip + 0x84f04fa]
0x1806d5bd6: call 0x18049c210
0x1806d5bdb: lea rcx, [rip + 0x8456bfe]
0x1806d5be2: call 0x18049c210
0x1806d5be7: lea rcx, [rip + 0x84579a2]
0x1806d5bee: call 0x18049c210
0x1806d5bf3: lea rcx, [rip + 0x8457e26]
0x1806d5bfa: call 0x18049c210
0x1806d5bff: lea rcx, [rip + 0x844a44a]
0x1806d5c06: call 0x18049c210
0x1806d5c0b: lea rcx, [rip + 0x8502d0e]
0x1806d5c12: call 0x18049c210
0x1806d5c17: lea rcx, [rip + 0x8518322]
0x1806d5c1e: call 0x18049c210
0x1806d5c23: lea rcx, [rip + 0x8448df6]
0x1806d5c2a: call 0x18049c210
0x1806d5c2f: lea rcx, [rip + 0x848ab9a]
0x1806d5c36: call 0x18049c210
0x1806d5c3b: lea rcx, [rip + 0x856d5c6]
0x1806d5c42: call 0x18049c210
0x1806d5c47: lea rcx, [rip + 0x84f9c3a]
0x1806d5c4e: call 0x18049c210
0x1806d5c53: lea rcx, [rip + 0x8528ece]
0x1806d5c5a: call 0x18049c210
0x1806d5c5f: lea rcx, [rip + 0x859b58a]
0x1806d5c66: call 0x18049c210
0x1806d5c6b: mov byte ptr [rip + 0x88c5661], 1
0x1806d5c72: mov rax, qword ptr [rip + 0x846eddf]
0x1806d5c79: xor edi, edi
0x1806d5c7b: mov qword ptr [rbp - 0x19], rdi
0x1806d5c7f: mov qword ptr [rbp - 0x39], rdi
0x1806d5c83: mov qword ptr [rbp - 0x21], rdi
0x1806d5c87: mov qword ptr [rbp - 0x41], rdi
0x1806d5c8b: cmp dword ptr [rax + 0xe0], edi
0x1806d5c91: jne 0x1806d5ca2
0x1806d5c93: mov rcx, rax
0x1806d5c96: call 0x18049c450
0x1806d5c9b: mov rax, qword ptr [rip + 0x846edb6]
0x1806d5ca2: mov rax, qword ptr [rax + 0xb8]
0x1806d5ca9: mov rcx, qword ptr [rax + 0x218]
0x1806d5cb0: test rcx, rcx
0x1806d5cb3: jne 0x1806d6e20
0x1806d5cb9: mov qword ptr [rsp + 0xd0], r13
0x1806d5cc1: mov qword ptr [rsp + 0x90], r15
0x1806d5cc9: movaps xmmword ptr [rsp + 0x80], xmm6
0x1806d5cd1: xor edx, edx
0x1806d5cd3: mov rcx, rsi
0x1806d5cd6: call 0x1806d8e70 ; Torappu.Battle.Buff._ClearEventReentryDepth
0x1806d5cdb: mov rdx, qword ptr [r14 + 8]
0x1806d5cdf: lea rcx, [rsi + 0x78]
0x1806d5ce3: mov qword ptr [rsi + 0x78], rdx
0x1806d5ce7: call 0x18049bcf0
0x1806d5cec: lea rcx, [rsi + 0x10]
0x1806d5cf0: mov qword ptr [rsi + 0x10], rbx
0x1806d5cf4: mov rdx, rbx
0x1806d5cf7: call 0x18049bcf0
0x1806d5cfc: mov rbx, qword ptr [r14 + 8]
0x1806d5d00: test rbx, rbx
0x1806d5d03: je 0x1806d6e75
0x1806d5d09: cmp byte ptr [rip + 0x88c5588], dil
0x1806d5d10: mov rbx, qword ptr [rbx + 0x18]
0x1806d5d14: jne 0x1806d5d29
0x1806d5d16: lea rcx, [rip + 0x846ed3b]
0x1806d5d1d: call 0x18049c210
0x1806d5d22: mov byte ptr [rip + 0x88c556f], 1
0x1806d5d29: mov rax, qword ptr [rip + 0x846ed28]
0x1806d5d30: cmp dword ptr [rax + 0xe0], edi
0x1806d5d36: jne 0x1806d5d47
0x1806d5d38: mov rcx, rax
0x1806d5d3b: call 0x18049c450
0x1806d5d40: mov rax, qword ptr [rip + 0x846ed11]
0x1806d5d47: mov rax, qword ptr [rax + 0xb8]
0x1806d5d4e: mov rcx, qword ptr [rax + 0x40]
0x1806d5d52: test rcx, rcx
0x1806d5d55: jne 0x1806d5d6f
0x1806d5d57: lea rcx, [rsi + 0x208]
0x1806d5d5e: mov qword ptr [rsi + 0x208], rbx
0x1806d5d65: mov rdx, rbx
0x1806d5d68: call 0x18049bcf0
0x1806d5d6d: jmp 0x1806d5d7d
0x1806d5d6f: xor r9d, r9d
0x1806d5d72: mov r8, rbx
0x1806d5d75: mov rdx, rsi
0x1806d5d78: call 0x18338c7c0 ; XLua.DelegateBridge.__Gen_Delegate_Imp23
0x1806d5d7d: xor edx, edx
0x1806d5d7f: mov rcx, r14
0x1806d5d82: call 0x180b2d2c0 ; Torappu.Battle.BuffConfig.GetEffectKey
0x1806d5d87: xor r8d, r8d
0x1806d5d8a: mov rdx, rax
0x1806d5d8d: mov rcx, rsi
0x1806d5d90: call 0x1806df050 ; Torappu.Battle.Buff.set_effectKey
0x1806d5d95: mov rbx, qword ptr [r14 + 8]
0x1806d5d99: test rbx, rbx
0x1806d5d9c: je 0x1806d6e75
0x1806d5da2: cmp byte ptr [rip + 0x88c5513], dil
0x1806d5da9: movzx ebx, byte ptr [rbx + 0xc8]
0x1806d5db0: jne 0x1806d5dc5
0x1806d5db2: lea rcx, [rip + 0x846ec9f]
0x1806d5db9: call 0x18049c210
0x1806d5dbe: mov byte ptr [rip + 0x88c54f7], 1
0x1806d5dc5: mov rax, qword ptr [rip + 0x846ec8c]
0x1806d5dcc: cmp dword ptr [rax + 0xe0], edi
0x1806d5dd2: jne 0x1806d5de3
0x1806d5dd4: mov rcx, rax
0x1806d5dd7: call 0x18049c450
0x1806d5ddc: mov rax, qword ptr [rip + 0x846ec75]
0x1806d5de3: mov rax, qword ptr [rax + 0xb8]
0x1806d5dea: mov rcx, qword ptr [rax + 0x160]
0x1806d5df1: test rcx, rcx
0x1806d5df4: jne 0x1806d5dfe
0x1806d5df6: mov byte ptr [rsi + 0x258], bl
0x1806d5dfc: jmp 0x1806d5e0d
0x1806d5dfe: xor r9d, r9d
0x1806d5e01: movzx r8d, bl
0x1806d5e05: mov rdx, rsi
0x1806d5e08: call 0x1833ba950 ; XLua.DelegateBridge.__Gen_Delegate_Imp26
0x1806d5e0d: xor edx, edx
0x1806d5e0f: mov rcx, r14
0x1806d5e12: call 0x180b2d310 ; Torappu.Battle.BuffConfig.GetOnEventPriority
0x1806d5e17: cmp byte ptr [rip + 0x88c54a0], dil
0x1806d5e1e: mov ebx, eax
0x1806d5e20: jne 0x1806d5e35
0x1806d5e22: lea rcx, [rip + 0x846ec2f]
0x1806d5e29: call 0x18049c210
0x1806d5e2e: mov byte ptr [rip + 0x88c5489], 1
0x1806d5e35: mov rax, qword ptr [rip + 0x846ec1c]
0x1806d5e3c: cmp dword ptr [rax + 0xe0], edi
0x1806d5e42: jne 0x1806d5e53
0x1806d5e44: mov rcx, rax
0x1806d5e47: call 0x18049c450
0x1806d5e4c: mov rax, qword ptr [rip + 0x846ec05]
0x1806d5e53: mov rax, qword ptr [rax + 0xb8]
0x1806d5e5a: mov rcx, qword ptr [rax + 0x170]
0x1806d5e61: test rcx, rcx
0x1806d5e64: jne 0x1806d5e6e
0x1806d5e66: mov dword ptr [rsi + 0x25c], ebx
0x1806d5e6c: jmp 0x1806d5e7c
0x1806d5e6e: xor r9d, r9d
0x1806d5e71: mov r8d, ebx
0x1806d5e74: mov rdx, rsi
0x1806d5e77: call 0x1833e8480 ; XLua.DelegateBridge.__Gen_Delegate_Imp2989
0x1806d5e7c: mov rdx, qword ptr [r14 + 8]
0x1806d5e80: test rdx, rdx
0x1806d5e83: je 0x1806d6e75
0x1806d5e89: mov rdx, qword ptr [rdx + 0x70]
0x1806d5e8d: xor r8d, r8d
0x1806d5e90: mov rcx, rsi
0x1806d5e93: call 0x1806defb0 ; Torappu.Battle.Buff.set_audioSignal
0x1806d5e98: xor edx, edx
0x1806d5e9a: mov rcx, rsi
0x1806d5e9d: call 0x1806dd740 ; Torappu.Battle.Buff.get_audioSignal
0x1806d5ea2: xor edx, edx
0x1806d5ea4: mov rcx, rax
0x1806d5ea7: call 0x18601a180 ; System.String.IsNullOrEmpty
0x1806d5eac: test al, al
0x1806d5eae: jne 0x1806d5fc9
0x1806d5eb4: mov rcx, qword ptr [rip + 0x844a195]
0x1806d5ebb: cmp dword ptr [rcx + 0xe0], edi
0x1806d5ec1: jne 0x1806d5ec8
0x1806d5ec3: call 0x18049c450
0x1806d5ec8: xor r8d, r8d
0x1806d5ecb: xor edx, edx
0x1806d5ecd: mov rcx, r12
0x1806d5ed0: call 0x186dcf430 ; UnityEngine.Object.op_Inequality
0x1806d5ed5: test al, al
0x1806d5ed7: je 0x1806d5fc9
0x1806d5edd: mov rdx, qword ptr [rip + 0x850173c]
0x1806d5ee4: mov rcx, r12
0x1806d5ee7: call 0x1800057a0
0x1806d5eec: test rax, rax
0x1806d5eef: je 0x1806d5fc9
0x1806d5ef5: mov rax, qword ptr [rip + 0x854a024]
0x1806d5efc: cmp dword ptr [rax + 0xe0], edi
0x1806d5f02: jne 0x1806d5f13
0x1806d5f04: mov rcx, rax
0x1806d5f07: call 0x18049c450
0x1806d5f0c: mov rax, qword ptr [rip + 0x854a00d]
0x1806d5f13: mov rax, qword ptr [rax + 0xb8]
0x1806d5f1a: mov ebx, edi
0x1806d5f1c: mov r15, qword ptr [rax]
0x1806d5f1f: mov eax, edi
0x1806d5f21: test r15, r15
0x1806d5f24: je 0x1806d6e75
0x1806d5f2a: lea rdi, [r15 + 0x20]
0x1806d5f2e: nop
0x1806d5f30: cmp eax, dword ptr [r15 + 0x18]
0x1806d5f34: jge 0x1806d5fc5
0x1806d5f3a: cmp ebx, dword ptr [r15 + 0x18]
0x1806d5f3e: jae 0x1806d6e7b
0x1806d5f44: mov r12, qword ptr [rdi]
0x1806d5f47: xor edx, edx
0x1806d5f49: mov rcx, rsi
0x1806d5f4c: call 0x1806dd740 ; Torappu.Battle.Buff.get_audioSignal
0x1806d5f51: mov r13, rax
0x1806d5f54: mov rax, qword ptr [rbp + 0x57]
0x1806d5f58: test rax, rax
0x1806d5f5b: je 0x1806d6e75
0x1806d5f61: cmp byte ptr [rip + 0x8902b08], 0
0x1806d5f68: jbe 0x1806d5f76
0x1806d5f6a: mov rcx, qword ptr [rax]
0x1806d5f6d: call 0x180457010
0x1806d5f72: mov rax, qword ptr [rbp + 0x57]
0x1806d5f76: mov rcx, qword ptr [rax]
0x1806d5f79: lea r9, [rbp - 0x19]
0x1806d5f7d: mov r8, r13
0x1806d5f80: mov rdx, r12
0x1806d5f83: mov r10, qword ptr [rcx + 0x810]
0x1806d5f8a: mov rcx, qword ptr [rcx + 0x818]
0x1806d5f91: mov qword ptr [rsp + 0x28], rcx
0x1806d5f96: lea rcx, [rbp - 0x39]
0x1806d5f9a: mov qword ptr [rsp + 0x20], rcx
0x1806d5f9f: mov rcx, rax
0x1806d5fa2: call r10
0x1806d5fa5: test al, al
0x1806d5fa7: jne 0x1806d5fb6
0x1806d5fa9: inc ebx
0x1806d5fab: add rdi, 8
0x1806d5faf: mov eax, ebx
0x1806d5fb1: jmp 0x1806d5f30
0x1806d5fb6: mov rdx, qword ptr [rbp - 0x39]
0x1806d5fba: xor r8d, r8d
0x1806d5fbd: mov rcx, rsi
0x1806d5fc0: call 0x1806defb0 ; Torappu.Battle.Buff.set_audioSignal
0x1806d5fc5: mov r12, qword ptr [rbp + 0x57]
0x1806d5fc9: mov r8, qword ptr [rip + 0x84575c0]
0x1806d5fd0: lea rcx, [rbp - 0x31]
0x1806d5fd4: mov rdx, r12
0x1806d5fd7: call 0x18474b580
0x1806d5fdc: movups xmm0, xmmword ptr [rbp - 0x31]
0x1806d5fe0: lea rcx, [rsi + 0x18]
0x1806d5fe4: xor edx, edx
0x1806d5fe6: movups xmmword ptr [rsi + 0x18], xmm0
0x1806d5fea: call 0x18049bcf0
0x1806d5fef: mov r8, qword ptr [rip + 0x84567ea]
0x1806d5ff6: lea rcx, [rbp - 0x31]
0x1806d5ffa: mov rdx, qword ptr [rbp + 0x5f]
0x1806d5ffe: call 0x18474b580
0x1806d6003: movups xmm0, xmmword ptr [rbp - 0x31]
0x1806d6007: lea rcx, [rsi + 0x28]
0x1806d600b: xor edx, edx
0x1806d600d: movups xmmword ptr [rsi + 0x28], xmm0
0x1806d6011: call 0x18049bcf0
0x1806d6016: mov r8, qword ptr [rip + 0x8457a03]
0x1806d601d: lea rcx, [rbp - 0x31]
0x1806d6021: mov rdx, qword ptr [rbp + 0x77]
0x1806d6025: call 0x18474b580
0x1806d602a: movups xmm0, xmmword ptr [rbp - 0x31]
0x1806d602e: lea rcx, [rsi + 0x38]
0x1806d6032: xor edx, edx
0x1806d6034: movups xmmword ptr [rsi + 0x38], xmm0
0x1806d6038: call 0x18049bcf0
0x1806d603d: mov rax, qword ptr [r14 + 8]
0x1806d6041: test rax, rax
0x1806d6044: je 0x1806d6e75
0x1806d604a: movzx eax, byte ptr [rax + 0x21]
0x1806d604e: mov byte ptr [rsi + 0x1f0], al
0x1806d6054: mov rax, qword ptr [r14 + 8]
0x1806d6058: test rax, rax
0x1806d605b: je 0x1806d6e75
0x1806d6061: movzx eax, byte ptr [rax + 0x22]
0x1806d6065: mov byte ptr [rsi + 0x1f1], al
0x1806d606b: mov rax, qword ptr [r14 + 8]
0x1806d606f: test rax, rax
0x1806d6072: je 0x1806d6e75
0x1806d6078: movzx eax, byte ptr [rax + 0x23]
0x1806d607c: mov byte ptr [rsi + 0x1f2], al
0x1806d6082: mov rax, qword ptr [r14 + 8]
0x1806d6086: test rax, rax
0x1806d6089: je 0x1806d6e75
0x1806d608f: movzx eax, byte ptr [rax + 0x24]
0x1806d6093: mov byte ptr [rsi + 0x1f3], al
0x1806d6099: mov rax, qword ptr [r14 + 8]
0x1806d609d: test rax, rax
0x1806d60a0: je 0x1806d6e75
0x1806d60a6: movzx eax, byte ptr [rax + 0x25]
0x1806d60aa: mov byte ptr [rsi + 0x1f4], al
0x1806d60b0: mov rax, qword ptr [r14 + 8]
0x1806d60b4: test rax, rax
0x1806d60b7: je 0x1806d6e75
0x1806d60bd: movzx eax, byte ptr [rax + 0x26]
0x1806d60c1: mov byte ptr [rsi + 0x1f7], al
0x1806d60c7: mov rax, qword ptr [r14 + 8]
0x1806d60cb: test rax, rax
0x1806d60ce: je 0x1806d6e75
0x1806d60d4: mov rdi, qword ptr [rbp + 0x67]
0x1806d60d8: movzx eax, byte ptr [rax + 0x27]
0x1806d60dc: mov byte ptr [rsi + 0x1f8], al
0x1806d60e2: test rdi, rdi
0x1806d60e5: je 0x1806d6145
0x1806d60e7: cmp byte ptr [rip + 0x8902982], 0
0x1806d60ee: mov rbx, qword ptr [rsi + 0xb8]
0x1806d60f5: jbe 0x1806d60ff
0x1806d60f7: mov rcx, qword ptr [rdi]
0x1806d60fa: call 0x180457010
0x1806d60ff: mov r8, qword ptr [rdi]
0x1806d6102: mov rdx, rbx
0x1806d6105: mov rcx, rdi
0x1806d6108: mov rax, qword ptr [r8 + 0x140]
0x1806d610f: mov r8, qword ptr [r8 + 0x148]
0x1806d6116: call rax
0x1806d6118: test al, al
0x1806d611a: je 0x1806d6145
0x1806d611c: mov rcx, qword ptr [rip + 0x84535a5]
0x1806d6123: call 0x18046d2f0
0x1806d6128: mov rbx, rax
0x1806d612b: test rax, rax
0x1806d612e: je 0x1806d6e75
0x1806d6134: xor r8d, r8d
0x1806d6137: mov rdx, rdi
0x1806d613a: mov rcx, rax
0x1806d613d: call 0x18237a000 ; Torappu.Blackboard..ctor
0x1806d6142: mov rdi, rbx
0x1806d6145: mov rbx, qword ptr [rbp + 0x6f]
0x1806d6149: test rbx, rbx
0x1806d614c: je 0x1806d61ac
0x1806d614e: cmp byte ptr [rip + 0x890291b], 0
0x1806d6155: mov r15, qword ptr [rsi + 0xb8]
0x1806d615c: jbe 0x1806d6166
0x1806d615e: mov rcx, qword ptr [rbx]
0x1806d6161: call 0x180457010
0x1806d6166: mov r8, qword ptr [rbx]
0x1806d6169: mov rdx, r15
0x1806d616c: mov rcx, rbx
0x1806d616f: mov rax, qword ptr [r8 + 0x140]
0x1806d6176: mov r8, qword ptr [r8 + 0x148]
0x1806d617d: call rax
0x1806d617f: test al, al
0x1806d6181: je 0x1806d61ac
0x1806d6183: mov rcx, qword ptr [rip + 0x845353e]
0x1806d618a: call 0x18046d2f0
0x1806d618f: mov r15, rax
0x1806d6192: test rax, rax
0x1806d6195: je 0x1806d6e75
0x1806d619b: xor r8d, r8d
0x1806d619e: mov rdx, rbx
0x1806d61a1: mov rcx, rax
0x1806d61a4: call 0x18237a000 ; Torappu.Blackboard..ctor
0x1806d61a9: mov rbx, r15
0x1806d61ac: xor r15d, r15d
0x1806d61af: mov word ptr [rsi + 0x1f9], 0
0x1806d61b8: mov dword ptr [rsi + 0x1fc], 0
0x1806d61c2: mov byte ptr [rsi + 0x1fb], 0
0x1806d61c9: cmp qword ptr [rsi + 0x270], r15
0x1806d61d0: je 0x1806d61f7
0x1806d61d2: mov rcx, qword ptr [rsi + 0x270]
0x1806d61d9: mov r8d, dword ptr [rcx + 0x18]
0x1806d61dd: inc dword ptr [rcx + 0x1c]
0x1806d61e0: mov dword ptr [rcx + 0x18], r15d
0x1806d61e4: test r8d, r8d
0x1806d61e7: jle 0x1806d61f7
0x1806d61e9: mov rcx, qword ptr [rcx + 0x10]
0x1806d61ed: xor r9d, r9d
0x1806d61f0: xor edx, edx
0x1806d61f2: call 0x186149e10 ; System.Array.Clear
0x1806d61f7: mov rcx, qword ptr [r14 + 8]
0x1806d61fb: test rcx, rcx
0x1806d61fe: je 0x1806d6e75
0x1806d6204: mov rcx, qword ptr [rcx + 0x80]
0x1806d620b: xor edx, edx
0x1806d620d: call 0x18601a180 ; System.String.IsNullOrEmpty
0x1806d6212: test al, al
0x1806d6214: je 0x1806d622c
0x1806d6216: mov r13, qword ptr [rip + 0x848a5b3]
0x1806d621d: mov rcx, qword ptr [r14 + 8]
0x1806d6221: test rcx, rcx
0x1806d6224: je 0x1806d6e75
0x1806d622a: jmp 0x1806d6243
0x1806d622c: mov rax, qword ptr [r14 + 8]
0x1806d6230: test rax, rax
0x1806d6233: je 0x1806d6e75
0x1806d6239: mov r13, qword ptr [rax + 0x80]
0x1806d6240: mov rcx, rax
0x1806d6243: mov rcx, qword ptr [rcx + 0x88]
0x1806d624a: xor edx, edx
0x1806d624c: call 0x18601a180 ; System.String.IsNullOrEmpty
0x1806d6251: test al, al
0x1806d6253: mov rax, qword ptr [r14 + 8]
0x1806d6257: je 0x1806d626f
0x1806d6259: mov rcx, qword ptr [rip + 0x85288c8]
0x1806d6260: mov qword ptr [rbp - 0x31], rcx
0x1806d6264: test rax, rax
0x1806d6267: je 0x1806d6e75
0x1806d626d: jmp 0x1806d6287
0x1806d626f: test rax, rax
0x1806d6272: je 0x1806d6e75
0x1806d6278: mov rax, qword ptr [rax + 0x88]
0x1806d627f: mov qword ptr [rbp - 0x31], rax
0x1806d6283: mov rax, qword ptr [r14 + 8]
0x1806d6287: cmp byte ptr [rax + 0xb8], 0
0x1806d628e: je 0x1806d65f8
0x1806d6294: xor edx, edx
0x1806d6296: mov rcx, rsi
0x1806d6299: call 0x1806ddf20 ; Torappu.Battle.Buff.get_key
0x1806d629e: xor edx, edx
0x1806d62a0: mov rcx, rax
0x1806d62a3: call 0x18601a180 ; System.String.IsNullOrEmpty
0x1806d62a8: test al, al
0x1806d62aa: jne 0x1806d65f8
0x1806d62b0: xor edx, edx
0x1806d62b2: mov rcx, rsi
0x1806d62b5: call 0x1806ddf20 ; Torappu.Battle.Buff.get_key
0x1806d62ba: mov rcx, qword ptr [rip + 0x85730b7]
0x1806d62c1: mov r15, rax
0x1806d62c4: cmp dword ptr [rcx + 0xe0], 0
0x1806d62cb: jne 0x1806d62d2
0x1806d62cd: call 0x18049c450
0x1806d62d2: mov rcx, qword ptr [rip + 0x84f95af]
0x1806d62d9: xor r8d, r8d
0x1806d62dc: mov rdx, r15
0x1806d62df: call 0x1869844e0 ; Torappu.HGString.Format
0x1806d62e4: mov rcx, qword ptr [rsi + 0xb8]
0x1806d62eb: mov r15, rax
0x1806d62ee: test rcx, rcx
0x1806d62f1: je 0x1806d6e75
0x1806d62f7: mov r8d, dword ptr [rcx + 0x18]
0x1806d62fb: inc dword ptr [rcx + 0x1c]
0x1806d62fe: mov dword ptr [rcx + 0x18], 0
0x1806d6305: test r8d, r8d
0x1806d6308: jle 0x1806d6318
0x1806d630a: mov rcx, qword ptr [rcx + 0x10]
0x1806d630e: xor r9d, r9d
0x1806d6311: xor edx, edx
0x1806d6313: call 0x186149e10 ; System.Array.Clear
0x1806d6318: test rdi, rdi
0x1806d631b: je 0x1806d6359
0x1806d631d: mov rcx, qword ptr [rsi + 0xb8]
0x1806d6324: test rcx, rcx
0x1806d6327: je 0x1806d6e75
0x1806d632d: xor r9d, r9d
0x1806d6330: mov r8, r15
0x1806d6333: mov rdx, rdi
0x1806d6336: call 0x182376fd0 ; Torappu.Blackboard.AssignByPrefix
0x1806d633b: mov rcx, qword ptr [rsi + 0xb8]
0x1806d6342: test rcx, rcx
0x1806d6345: je 0x1806d6e75
0x1806d634b: xor r9d, r9d
0x1806d634e: mov r8, r15
0x1806d6351: mov rdx, rdi
0x1806d6354: call 0x182377330 ; Torappu.Blackboard.AssignValueStrByPrefix
0x1806d6359: test rbx, rbx
0x1806d635c: je 0x1806d639a
0x1806d635e: mov rcx, qword ptr [rsi + 0xb8]
0x1806d6365: test rcx, rcx
0x1806d6368: je 0x1806d6e75
0x1806d636e: xor r9d, r9d
0x1806d6371: mov r8, r15
0x1806d6374: mov rdx, rbx
0x1806d6377: call 0x182376fd0 ; Torappu.Blackboard.AssignByPrefix
0x1806d637c: mov rcx, qword ptr [rsi + 0xb8]
0x1806d6383: test rcx, rcx
0x1806d6386: je 0x1806d6e75
0x1806d638c: xor r9d, r9d
0x1806d638f: mov r8, r15
0x1806d6392: mov rdx, rbx
0x1806d6395: call 0x182377330 ; Torappu.Blackboard.AssignValueStrByPrefix
0x1806d639a: mov rdx, qword ptr [r14 + 8]
0x1806d639e: test rdx, rdx
0x1806d63a1: je 0x1806d6e75
0x1806d63a7: mov rcx, qword ptr [rsi + 0xb8]
0x1806d63ae: test rcx, rcx
0x1806d63b1: je 0x1806d6e75
0x1806d63b7: mov rdx, qword ptr [rdx + 0xc0]
0x1806d63be: xor r8d, r8d
0x1806d63c1: call 0x182377780 ; Torappu.Blackboard.Assign
0x1806d63c6: mov rcx, qword ptr [rsi + 0xb8]
0x1806d63cd: test rcx, rcx
0x1806d63d0: je 0x1806d6e75
0x1806d63d6: xor r8d, r8d
0x1806d63d9: mov rdx, r13
0x1806d63dc: call 0x182377e90 ; Torappu.Blackboard.ContainsKey
0x1806d63e1: test al, al
0x1806d63e3: jne 0x1806d646a
0x1806d63e9: mov rcx, qword ptr [rip + 0x84f08c0]
0x1806d63f0: cmp dword ptr [rcx + 0xe0], 0
0x1806d63f7: jne 0x1806d63fe
0x1806d63f9: call 0x18049c450
0x1806d63fe: xor edx, edx
0x1806d6400: mov ecx, 0xffffffff
0x1806d6405: call 0x18695e170 ; Torappu.FP.op_Implicit
0x1806d640a: xor r15b, r15b
0x1806d640d: mov qword ptr [rbp - 0x41], rax
0x1806d6411: test rdi, rdi
0x1806d6414: je 0x1806d642c
0x1806d6416: xor r9d, r9d
0x1806d6419: lea r8, [rbp - 0x41]
0x1806d641d: mov rdx, r13
0x1806d6420: mov rcx, rdi
0x1806d6423: call 0x1823795f0 ; Torappu.Blackboard.TryGetFP
0x1806d6428: movzx r15d, al
0x1806d642c: test rbx, rbx
0x1806d642f: je 0x1806d6446
0x1806d6431: xor r9d, r9d
0x1806d6434: lea r8, [rbp - 0x41]
0x1806d6438: mov rdx, r13
0x1806d643b: mov rcx, rbx
0x1806d643e: call 0x1823795f0 ; Torappu.Blackboard.TryGetFP
0x1806d6443: or r15b, al
0x1806d6446: test r15b, r15b
0x1806d6449: je 0x1806d646a
0x1806d644b: mov rcx, qword ptr [rsi + 0xb8]
0x1806d6452: test rcx, rcx
0x1806d6455: je 0x1806d6e75
0x1806d645b: mov r8, qword ptr [rbp - 0x41]
0x1806d645f: xor r9d, r9d
0x1806d6462: mov rdx, r13
0x1806d6465: call 0x1823776c0 ; Torappu.Blackboard.Assign
0x1806d646a: xor r15d, r15d
0x1806d646d: mov rcx, qword ptr [rsi + 0xb8]
0x1806d6474: test rcx, rcx
0x1806d6477: je 0x1806d6e75
0x1806d647d: lea r8, [rsi + 0x80]
0x1806d6484: xor r9d, r9d
0x1806d6487: mov rdx, r13
0x1806d648a: call 0x1823795f0 ; Torappu.Blackboard.TryGetFP
0x1806d648f: test al, al
0x1806d6491: jne 0x1806d64ce
0x1806d6493: mov rax, qword ptr [r14 + 8]
0x1806d6497: test rax, rax
0x1806d649a: je 0x1806d6e75
0x1806d64a0: mov rcx, qword ptr [rip + 0x84f0809]
0x1806d64a7: movss xmm6, dword ptr [rax + 0x90]
0x1806d64af: cmp dword ptr [rcx + 0xe0], 0
0x1806d64b6: jne 0x1806d64bd
0x1806d64b8: call 0x18049c450
0x1806d64bd: xor edx, edx
0x1806d64bf: movaps xmm0, xmm6
0x1806d64c2: call 0x18695e180 ; Torappu.FP.op_Implicit
0x1806d64c7: mov qword ptr [rsi + 0x80], rax
0x1806d64ce: mov rax, qword ptr [r14 + 8]
0x1806d64d2: mov rbx, qword ptr [rsi + 0x80]
0x1806d64d9: test rax, rax
0x1806d64dc: je 0x1806d6e75
0x1806d64e2: mov r8, qword ptr [rip + 0x846e56f]
0x1806d64e9: movzx edi, byte ptr [rax + 0x78]
0x1806d64ed: cmp dword ptr [r8 + 0xe0], 0
0x1806d64f5: jne 0x1806d6506
0x1806d64f7: mov rcx, r8
0x1806d64fa: call 0x18049c450
0x1806d64ff: mov r8, qword ptr [rip + 0x846e552]
0x1806d6506: mov r8, qword ptr [r8 + 0xb8]
0x1806d650d: movzx edx, dil
0x1806d6511: mov r9, qword ptr [rip + 0x84ef970]
0x1806d6518: mov rcx, rbx
0x1806d651b: mov r8, qword ptr [r8 + 0x18]
0x1806d651f: call 0x184741640
0x1806d6524: xor edx, edx
0x1806d6526: mov qword ptr [rsi + 0x80], rax
0x1806d652d: mov rcx, rsi
0x1806d6530: call 0x1806db3f0 ; Torappu.Battle.Buff._ModifyLifeTimeFinally
0x1806d6535: mov rcx, qword ptr [rsi + 0xb8]
0x1806d653c: test rcx, rcx
0x1806d653f: je 0x1806d6e75
0x1806d6545: mov rdx, qword ptr [rbp - 0x31]
0x1806d6549: lea r8, [rbp - 0x21]
0x1806d654d: xor r9d, r9d
0x1806d6550: call 0x1823795f0 ; Torappu.Blackboard.TryGetFP
0x1806d6555: test al, al
0x1806d6557: mov rax, qword ptr [rbp - 0x21]
0x1806d655b: jne 0x1806d6564
0x1806d655d: mov rax, qword ptr [rsi + 0x80]
0x1806d6564: mov qword ptr [rsi + 0x88], rax
0x1806d656b: mov rcx, qword ptr [rip + 0x84f073e]
0x1806d6572: cmp dword ptr [rcx + 0xe0], 0
0x1806d6579: jne 0x1806d6580
0x1806d657b: call 0x18049c450
0x1806d6580: xor edx, edx
0x1806d6582: xor ecx, ecx
0x1806d6584: call 0x18695e170 ; Torappu.FP.op_Implicit
0x1806d6589: mov rcx, qword ptr [r14 + 8]
0x1806d658d: mov qword ptr [rsi + 0x90], rax
0x1806d6594: test rcx, rcx
0x1806d6597: je 0x1806d6e75
0x1806d659d: movzx edx, byte ptr [rcx + 0x94]
0x1806d65a4: mov r8d, 0xffffffff
0x1806d65aa: mov ecx, dword ptr [rcx + 0x98]
0x1806d65b0: mov r9, qword ptr [rip + 0x84efb19]
0x1806d65b7: call 0x184741660
0x1806d65bc: mov dword ptr [rsi + 0x98], eax
0x1806d65c2: mov rax, qword ptr [r14 + 8]
0x1806d65c6: test rax, rax
0x1806d65c9: je 0x1806d6e75
0x1806d65cf: cmp byte ptr [rax + 0x94], 0
0x1806d65d6: jne 0x1806d6697
0x1806d65dc: mov rcx, qword ptr [rsi + 0xa8]
0x1806d65e3: test rcx, rcx
0x1806d65e6: je 0x1806d6e75
0x1806d65ec: xor edx, edx
0x1806d65ee: call 0x181e4aca0 ; Torappu.PeriodicTimer.MarkInvalid
0x1806d65f3: jmp 0x1806d67ec
0x1806d65f8: mov rcx, qword ptr [rsi + 0xb8]
0x1806d65ff: test rcx, rcx
0x1806d6602: je 0x1806d6e75
0x1806d6608: mov r8d, dword ptr [rcx + 0x18]
0x1806d660c: inc dword ptr [rcx + 0x1c]
0x1806d660f: mov dword ptr [rcx + 0x18], r15d
0x1806d6613: test r8d, r8d
0x1806d6616: jle 0x1806d6626
0x1806d6618: mov rcx, qword ptr [rcx + 0x10]
0x1806d661c: xor r9d, r9d
0x1806d661f: xor edx, edx
0x1806d6621: call 0x186149e10 ; System.Array.Clear
0x1806d6626: test rdi, rdi
0x1806d6629: je 0x1806d6646
0x1806d662b: mov rcx, qword ptr [rsi + 0xb8]
0x1806d6632: test rcx, rcx
0x1806d6635: je 0x1806d6e75
0x1806d663b: xor r8d, r8d
0x1806d663e: mov rdx, rdi
0x1806d6641: call 0x182377780 ; Torappu.Blackboard.Assign
0x1806d6646: test rbx, rbx
0x1806d6649: je 0x1806d6666
0x1806d664b: mov rcx, qword ptr [rsi + 0xb8]
0x1806d6652: test rcx, rcx
0x1806d6655: je 0x1806d6e75
0x1806d665b: xor r8d, r8d
0x1806d665e: mov rdx, rbx
0x1806d6661: call 0x182377780 ; Torappu.Blackboard.Assign
0x1806d6666: mov rdx, qword ptr [r14 + 8]
0x1806d666a: test rdx, rdx
0x1806d666d: je 0x1806d6e75
0x1806d6673: mov rcx, qword ptr [rsi + 0xb8]
0x1806d667a: test rcx, rcx
0x1806d667d: je 0x1806d6e75
0x1806d6683: mov rdx, qword ptr [rdx + 0xc0]
0x1806d668a: xor r8d, r8d
0x1806d668d: call 0x182377780 ; Torappu.Blackboard.Assign
0x1806d6692: jmp 0x1806d646d
0x1806d6697: mov rbx, qword ptr [rsi + 0xb8]
0x1806d669e: test rax, rax
0x1806d66a1: je 0x1806d6e75
0x1806d66a7: mov rcx, qword ptr [rip + 0x84f0602]
0x1806d66ae: movss xmm6, dword ptr [rax + 0x9c]
0x1806d66b6: cmp dword ptr [rcx + 0xe0], 0
0x1806d66bd: jne 0x1806d66c4
0x1806d66bf: call 0x18049c450
0x1806d66c4: xor edx, edx
0x1806d66c6: movaps xmm0, xmm6
0x1806d66c9: call 0x18695e180 ; Torappu.FP.op_Implicit
0x1806d66ce: test rbx, rbx
0x1806d66d1: je 0x1806d6e75
0x1806d66d7: mov rdx, qword ptr [rip + 0x859ab12]
0x1806d66de: xor r9d, r9d
0x1806d66e1: mov r8, rax
0x1806d66e4: mov qword ptr [rsp + 0x20], r15
0x1806d66e9: mov rcx, rbx
0x1806d66ec: call 0x182378b40 ; Torappu.Blackboard.GetFpOrDefault
0x1806d66f1: mov rcx, qword ptr [rsi + 0xb8]
0x1806d66f8: mov rbx, rax
0x1806d66fb: test rcx, rcx
0x1806d66fe: je 0x1806d6e75
0x1806d6704: mov r8d, dword ptr [rsi + 0x98]
0x1806d670b: xor r9d, r9d
0x1806d670e: mov rdx, qword ptr [rip + 0x844830b]
0x1806d6715: mov qword ptr [rsp + 0x20], r15
0x1806d671a: call 0x182378c90 ; Torappu.Blackboard.GetIntOrDefault
0x1806d671f: mov r8, qword ptr [r14 + 8]
0x1806d6723: mov dword ptr [rsi + 0x98], eax
0x1806d6729: test r8, r8
0x1806d672c: je 0x1806d6e75
0x1806d6732: mov rcx, qword ptr [rsi + 0xa8]
0x1806d6739: test rcx, rcx
0x1806d673c: je 0x1806d6e75
0x1806d6742: movzx r8d, byte ptr [r8 + 0xa0]
0x1806d674a: xor r9d, r9d
0x1806d674d: mov rdx, rbx
0x1806d6750: call 0x181e4afc0 ; Torappu.PeriodicTimer.Reset
0x1806d6755: mov rax, qword ptr [r14 + 8]
0x1806d6759: mov rbx, qword ptr [rsi + 0xb8]
0x1806d6760: test rax, rax
0x1806d6763: je 0x1806d6e75
0x1806d6769: movss xmm0, dword ptr [rax + 0xa4]
0x1806d6771: xor edx, edx
0x1806d6773: call 0x18695e180 ; Torappu.FP.op_Implicit
0x1806d6778: test rbx, rbx
0x1806d677b: je 0x1806d6e75
0x1806d6781: mov rdx, qword ptr [rip + 0x8502198]
0x1806d6788: xor r9d, r9d
0x1806d678b: mov r8, rax
0x1806d678e: mov qword ptr [rsp + 0x20], r15
0x1806d6793: mov rcx, rbx
0x1806d6796: call 0x182378b40 ; Torappu.Blackboard.GetFpOrDefault
0x1806d679b: xor edx, edx
0x1806d679d: xor ecx, ecx
0x1806d679f: mov rbx, rax
0x1806d67a2: call 0x18695e170 ; Torappu.FP.op_Implicit
0x1806d67a7: mov rcx, qword ptr [rip + 0x855fafa]
0x1806d67ae: mov rdi, rax
0x1806d67b1: cmp dword ptr [rcx + 0xe0], 0
0x1806d67b8: jne 0x1806d67bf
0x1806d67ba: call 0x18049c450
0x1806d67bf: xor r8d, r8d
0x1806d67c2: mov rdx, rdi
0x1806d67c5: mov rcx, rbx
0x1806d67c8: call 0x186945140 ; Torappu.MathUtil.GE
0x1806d67cd: test al, al
0x1806d67cf: je 0x1806d67ec
0x1806d67d1: mov rcx, qword ptr [rsi + 0xa8]
0x1806d67d8: test rcx, rcx
0x1806d67db: je 0x1806d6e75
0x1806d67e1: xor r8d, r8d
0x1806d67e4: mov rdx, rbx
0x1806d67e7: call 0x181e4b1e0 ; Torappu.PeriodicTimer.SetRemainingTime
0x1806d67ec: cmp dword ptr [rsi + 0x98], 0
0x1806d67f3: mov rcx, rsi
0x1806d67f6: setg dl
0x1806d67f9: xor r8d, r8d
0x1806d67fc: call 0x1806df6c0 ; Torappu.Battle.Buff.set_triggerable
0x1806d6801: mov rax, qword ptr [r14 + 8]
0x1806d6805: mov r13d, 1
0x1806d680b: mov dword ptr [rsi + 0x9c], r13d
0x1806d6812: test rax, rax
0x1806d6815: je 0x1806d6e75
0x1806d681b: movzx eax, byte ptr [rax + 0x50]
0x1806d681f: mov byte ptr [rsi + 0xa4], al
0x1806d6825: mov rax, qword ptr [r14 + 8]
0x1806d6829: test rax, rax
0x1806d682c: je 0x1806d6e75
0x1806d6832: cmp qword ptr [rsi + 0x70], 0
0x1806d6837: movzx eax, byte ptr [rax + 0x51]
0x1806d683b: mov byte ptr [rsi + 0xa5], al
0x1806d6841: je 0x1806d68a0
0x1806d6843: mov ebx, 0x20
0x1806d6848: nop dword ptr [rax + rax]
0x1806d6850: mov rcx, qword ptr [rip + 0x84f0459]
0x1806d6857: mov rdi, qword ptr [rsi + 0x68]
0x1806d685b: cmp dword ptr [rcx + 0xe0], 0
0x1806d6862: jne 0x1806d6869
0x1806d6864: call 0x18049c450
0x1806d6869: xor edx, edx
0x1806d686b: xor ecx, ecx
0x1806d686d: call 0x18695e170 ; Torappu.FP.op_Implicit
0x1806d6872: test rdi, rdi
0x1806d6875: je 0x1806d6e75
0x1806d687b: cmp r15d, dword ptr [rdi + 0x18]
0x1806d687f: jae 0x1806d6e7b
0x1806d6885: mov qword ptr [rdi + rbx], rax
0x1806d6889: inc r15d
0x1806d688c: add rbx, 8
0x1806d6890: cmp rbx, 0x190
0x1806d6897: jl 0x1806d6850
0x1806d6899: xor r15d, r15d
0x1806d689c: mov qword ptr [rsi + 0x70], r15
0x1806d68a0: mov rdx, qword ptr [r14 + 8]
0x1806d68a4: test rdx, rdx
0x1806d68a7: je 0x1806d6e75
0x1806d68ad: mov r8d, dword ptr [rsi + 0x9c]
0x1806d68b4: xor r9d, r9d
0x1806d68b7: mov rdx, qword ptr [rdx + 0x10]
0x1806d68bb: mov rcx, rsi
0x1806d68be: call 0x1806da630 ; Torappu.Battle.Buff._LoadAttributesModifier
0x1806d68c3: mov rdx, qword ptr [r14]
0x1806d68c6: test rdx, rdx
0x1806d68c9: je 0x1806d6e75
0x1806d68cf: mov rdx, qword ptr [rdx + 0x28]
0x1806d68d3: xor r8d, r8d
0x1806d68d6: mov rcx, rsi
0x1806d68d9: call 0x1806da410 ; Torappu.Battle.Buff._LoadActions
0x1806d68de: cmp byte ptr [rip + 0x88c4a84], 0
0x1806d68e5: movups xmm6, xmmword ptr [r14]
0x1806d68e9: jne 0x1806d68fe
0x1806d68eb: lea rcx, [rip + 0x846e166]
0x1806d68f2: call 0x18049c210
0x1806d68f7: mov byte ptr [rip + 0x88c4a6b], r13b
0x1806d68fe: mov rax, qword ptr [rip + 0x846e153]
0x1806d6905: cmp dword ptr [rax + 0xe0], 0
0x1806d690c: jne 0x1806d691d
0x1806d690e: mov rcx, rax
0x1806d6911: call 0x18049c450
0x1806d6916: mov rax, qword ptr [rip + 0x846e13b]
0x1806d691d: mov rax, qword ptr [rax + 0xb8]
0x1806d6924: mov rcx, qword ptr [rax + 0x6c8]
0x1806d692b: test rcx, rcx
0x1806d692e: jne 0x1806d6947
0x1806d6930: psrldq xmm6, 8
0x1806d6935: xor r8d, r8d
0x1806d6938: movq rdx, xmm6
0x1806d693d: mov rcx, rsi
0x1806d6940: call 0x1806d8b60 ; Torappu.Battle.Buff._CalculatePriority
0x1806d6945: jmp 0x1806d695b
0x1806d6947: xor r9d, r9d
0x1806d694a: movdqa xmmword ptr [rbp - 0x31], xmm6
0x1806d694f: lea r8, [rbp - 0x31]
0x1806d6953: mov rdx, rsi
0x1806d6956: call 0x1833ebc00 ; XLua.DelegateBridge.__Gen_Delegate_Imp3011
0x1806d695b: cmp byte ptr [rip + 0x88c493d], 0
0x1806d6962: mov ebx, eax
0x1806d6964: jne 0x1806d6979
0x1806d6966: lea rcx, [rip + 0x846e0eb]
0x1806d696d: call 0x18049c210
0x1806d6972: mov byte ptr [rip + 0x88c4926], r13b
0x1806d6979: mov rax, qword ptr [rip + 0x846e0d8]
0x1806d6980: cmp dword ptr [rax + 0xe0], 0
0x1806d6987: jne 0x1806d6998
0x1806d6989: mov rcx, rax
0x1806d698c: call 0x18049c450
0x1806d6991: mov rax, qword ptr [rip + 0x846e0c0]
0x1806d6998: mov rax, qword ptr [rax + 0xb8]
0x1806d699f: mov rcx, qword ptr [rax + 0x78]
0x1806d69a3: test rcx, rcx
0x1806d69a6: jne 0x1806d69b0
0x1806d69a8: mov dword ptr [rsi + 0x21c], ebx
0x1806d69ae: jmp 0x1806d69be
0x1806d69b0: xor r9d, r9d
0x1806d69b3: mov r8d, ebx
0x1806d69b6: mov rdx, rsi
0x1806d69b9: call 0x18357d440 ; XLua.DelegateBridge.__Gen_Delegate_Imp55
0x1806d69be: mov rax, qword ptr [r14 + 8]
0x1806d69c2: test rax, rax
0x1806d69c5: je 0x1806d6e75
0x1806d69cb: cmp byte ptr [rax + 0x58], 0
0x1806d69cf: jne 0x1806d6a5b
0x1806d69d5: xor edx, edx
0x1806d69d7: mov rcx, rax
0x1806d69da: call 0x18237adf0 ; Torappu.BuffData.GetOverrideKey
0x1806d69df: cmp byte ptr [rip + 0x88c48b5], 0
0x1806d69e6: mov rbx, rax
0x1806d69e9: jne 0x1806d69fe
0x1806d69eb: lea rcx, [rip + 0x846e066]
0x1806d69f2: call 0x18049c210
0x1806d69f7: mov byte ptr [rip + 0x88c489d], r13b
0x1806d69fe: mov rax, qword ptr [rip + 0x846e053]
0x1806d6a05: cmp dword ptr [rax + 0xe0], 0
0x1806d6a0c: jne 0x1806d6a1d
0x1806d6a0e: mov rcx, rax
0x1806d6a11: call 0x18049c450
0x1806d6a16: mov rax, qword ptr [rip + 0x846e03b]
0x1806d6a1d: mov rax, qword ptr [rax + 0xb8]
0x1806d6a24: mov rcx, qword ptr [rax + 0x58]
0x1806d6a28: test rcx, rcx
0x1806d6a2b: jne 0x1806d6a48
0x1806d6a2d: lea rcx, [rsi + 0x210]
0x1806d6a34: mov qword ptr [rsi + 0x210], rbx
0x1806d6a3b: mov rdx, rbx
0x1806d6a3e: call 0x18049bcf0
0x1806d6a43: jmp 0x1806d6d10
0x1806d6a48: xor r9d, r9d
0x1806d6a4b: mov r8, rbx
0x1806d6a4e: mov rdx, rsi
0x1806d6a51: call 0x18338c7c0 ; XLua.DelegateBridge.__Gen_Delegate_Imp23
0x1806d6a56: jmp 0x1806d6d10
0x1806d6a5b: mov rdx, qword ptr [rip + 0x8500bbe]
0x1806d6a62: test r12, r12
0x1806d6a65: jne 0x1806d6a6c
0x1806d6a67: mov rbx, r15
0x1806d6a6a: jmp 0x1806d6ab3
0x1806d6a6c: cmp byte ptr [rip + 0x8901ffd], 0
0x1806d6a73: mov r8, qword ptr [r12]
0x1806d6a77: jbe 0x1806d6a85
0x1806d6a79: mov rcx, r8
0x1806d6a7c: call 0x1804566f0
0x1806d6a81: test al, al
0x1806d6a83: jmp 0x1806d6aac
0x1806d6a85: movzx eax, byte ptr [rdx + 0x130]
0x1806d6a8c: cmp byte ptr [r8 + 0x130], al
0x1806d6a93: jb 0x1806d6aa6
0x1806d6a95: movzx ecx, al
0x1806d6a98: mov rax, qword ptr [r8 + 0xc8]
0x1806d6a9f: cmp qword ptr [rax + rcx*8 - 8], rdx
0x1806d6aa4: je 0x1806d6aa9
0x1806d6aa6: mov r13d, r15d
0x1806d6aa9: test r13d, r13d
0x1806d6aac: mov rbx, r15
0x1806d6aaf: cmovne rbx, r12
0x1806d6ab3: mov rcx, qword ptr [r14 + 8]
0x1806d6ab7: test rcx, rcx
0x1806d6aba: je 0x1806d6e75
0x1806d6ac0: xor edx, edx
0x1806d6ac2: call 0x18237adf0 ; Torappu.BuffData.GetOverrideKey
0x1806d6ac7: mov rcx, qword ptr [rip + 0x85728aa]
0x1806d6ace: mov rdi, rax
0x1806d6ad1: cmp dword ptr [rcx + 0xe0], 0
0x1806d6ad8: jne 0x1806d6adf
0x1806d6ada: call 0x18049c450
0x1806d6adf: mov r8, qword ptr [rip + 0x856c722]
0x1806d6ae6: xor r9d, r9d
0x1806d6ae9: mov rcx, qword ptr [rip + 0x8517450]
0x1806d6af0: mov rdx, rdi
0x1806d6af3: call 0x186983c90 ; Torappu.HGString.Format
0x1806d6af8: mov rcx, qword ptr [rip + 0x8449551]
0x1806d6aff: mov rdi, rax
0x1806d6b02: cmp dword ptr [rcx + 0xe0], 0
0x1806d6b09: jne 0x1806d6b10
0x1806d6b0b: call 0x18049c450
0x1806d6b10: xor r8d, r8d
0x1806d6b13: xor edx, edx
0x1806d6b15: mov rcx, rbx
0x1806d6b18: call 0x186dcf290 ; UnityEngine.Object.op_Equality
0x1806d6b1d: test al, al
0x1806d6b1f: jne 0x1806d6cea
0x1806d6b25: test rbx, rbx
0x1806d6b28: je 0x1806d6e75
0x1806d6b2e: xor edx, edx
0x1806d6b30: mov rcx, rbx
0x1806d6b33: call 0x180aaf750 ; Torappu.Battle.Character.get_cardUid
0x1806d6b38: mov rcx, qword ptr [rip + 0x8572839]
0x1806d6b3f: mov ebx, eax
0x1806d6b41: cmp dword ptr [rcx + 0xe0], 0
0x1806d6b48: jne 0x1806d6b4f
0x1806d6b4a: call 0x18049c450
0x1806d6b4f: mov rcx, qword ptr [rip + 0x85173ea]
0x1806d6b56: xor r9d, r9d
0x1806d6b59: mov r8d, ebx
0x1806d6b5c: mov rdx, rdi
0x1806d6b5f: call 0x186983af0 ; Torappu.HGString.Format
0x1806d6b64: xor r8d, r8d
0x1806d6b67: mov rdx, rax
0x1806d6b6a: mov rcx, rsi
0x1806d6b6d: call 0x1806df590 ; Torappu.Battle.Buff.set_overrideKey
0x1806d6b72: cmp byte ptr [rip + 0x88c4721], 0
0x1806d6b79: jne 0x1806d6b8e
0x1806d6b7b: lea rcx, [rip + 0x846ded6]
0x1806d6b82: call 0x18049c210
0x1806d6b87: mov byte ptr [rip + 0x88c470c], 1
0x1806d6b8e: mov rax, qword ptr [rip + 0x846dec3]
0x1806d6b95: cmp dword ptr [rax + 0xe0], 0
0x1806d6b9c: jne 0x1806d6bad
0x1806d6b9e: mov rcx, rax
0x1806d6ba1: call 0x18049c450
0x1806d6ba6: mov rax, qword ptr [rip + 0x846deab]
0x1806d6bad: mov rax, qword ptr [rax + 0xb8]
0x1806d6bb4: mov rcx, qword ptr [rax + 0x50]
0x1806d6bb8: test rcx, rcx
0x1806d6bbb: jne 0x1806d6bc6
0x1806d6bbd: mov rbx, qword ptr [rsi + 0x210]
0x1806d6bc4: jmp 0x1806d6bd4
0x1806d6bc6: xor r8d, r8d
0x1806d6bc9: mov rdx, rsi
0x1806d6bcc: call 0x1836cc610 ; XLua.DelegateBridge.__Gen_Delegate_Imp77
0x1806d6bd1: mov rbx, rax
0x1806d6bd4: mov r14, qword ptr [rbp + 0x4f]
0x1806d6bd8: test r14, r14
0x1806d6bdb: je 0x1806d6e75
0x1806d6be1: cmp byte ptr [rip + 0x88c47d3], 0
0x1806d6be8: jne 0x1806d6c2d
0x1806d6bea: lea rcx, [rip + 0x85941cf]
0x1806d6bf1: call 0x18049c210
0x1806d6bf6: lea rcx, [rip + 0x8579b1b]
0x1806d6bfd: call 0x18049c210
0x1806d6c02: lea rcx, [rip + 0x8579f9f]
0x1806d6c09: call 0x18049c210
0x1806d6c0e: lea rcx, [rip + 0x857a423]
0x1806d6c15: call 0x18049c210
0x1806d6c1a: lea rcx, [rip + 0x857a65f]
0x1806d6c21: call 0x18049c210
0x1806d6c26: mov byte ptr [rip + 0x88c478e], 1
0x1806d6c2d: mov rax, qword ptr [rip + 0x859418c]
0x1806d6c34: mov qword ptr [rbp - 0x31], r15
0x1806d6c38: mov rcx, qword ptr [rax + 0xb8]
0x1806d6c3f: mov rcx, qword ptr [rcx + 0x110]
0x1806d6c46: test rcx, rcx
0x1806d6c49: jne 0x1806d6cd5
0x1806d6c4f: mov rcx, qword ptr [r14 + 0x20]
0x1806d6c53: test rcx, rcx
0x1806d6c56: je 0x1806d6e81
0x1806d6c5c: mov r9, qword ptr [rip + 0x857a61d]
0x1806d6c63: lea r8, [rbp - 0x31]
0x1806d6c67: mov rdx, rdi
0x1806d6c6a: call 0x185b2cad0
0x1806d6c6f: test al, al
0x1806d6c71: je 0x1806d6d10
0x1806d6c77: mov rcx, qword ptr [r14 + 0x20]
0x1806d6c7b: test rcx, rcx
0x1806d6c7e: je 0x1806d6e81
0x1806d6c84: mov r8, qword ptr [rip + 0x8579f1d]
0x1806d6c8b: mov rdx, rbx
0x1806d6c8e: call 0x185ae5f80
0x1806d6c93: test al, al
0x1806d6c95: jne 0x1806d6d10
0x1806d6c97: mov rcx, qword ptr [r14 + 0x20]
0x1806d6c9b: test rcx, rcx
0x1806d6c9e: je 0x1806d6e81
0x1806d6ca4: mov r8, qword ptr [rip + 0x857a38d]
0x1806d6cab: mov rdx, rdi
0x1806d6cae: call 0x185b24db0
0x1806d6cb3: mov rcx, qword ptr [r14 + 0x20]
0x1806d6cb7: test rcx, rcx
0x1806d6cba: je 0x1806d6e81
0x1806d6cc0: mov r9, qword ptr [rip + 0x8579a51]
0x1806d6cc7: mov rdx, rbx
0x1806d6cca: mov r8, qword ptr [rbp - 0x31]
0x1806d6cce: call 0x185b20720
0x1806d6cd3: jmp 0x1806d6d10
0x1806d6cd5: mov r9, rbx
0x1806d6cd8: mov qword ptr [rsp + 0x20], r15
0x1806d6cdd: mov r8, rdi
0x1806d6ce0: mov rdx, r14
0x1806d6ce3: call 0x183458110 ; XLua.DelegateBridge.__Gen_Delegate_Imp36
0x1806d6ce8: jmp 0x1806d6d10
0x1806d6cea: mov rcx, qword ptr [rbp + 0x4f]
0x1806d6cee: test rcx, rcx
0x1806d6cf1: je 0x1806d6e75
0x1806d6cf7: xor r8d, r8d
0x1806d6cfa: mov rdx, rdi
0x1806d6cfd: call 0x1806b6150 ; Torappu.Battle.Buff/BuffContainer.GetOverrideKeyCandidate
0x1806d6d02: xor r8d, r8d
0x1806d6d05: mov rdx, rax
0x1806d6d08: mov rcx, rsi
0x1806d6d0b: call 0x1806df590 ; Torappu.Battle.Buff.set_overrideKey
0x1806d6d10: xor edx, edx
0x1806d6d12: mov rcx, rsi
0x1806d6d15: call 0x1806d9f20 ; Torappu.Battle.Buff._InitIsStatusResistable
0x1806d6d1a: cmp byte ptr [rip + 0x88c4651], 0
0x1806d6d21: movzx ebx, al
0x1806d6d24: mov byte ptr [rsi + 0x1f5], al
0x1806d6d2a: jne 0x1806d6d4b
0x1806d6d2c: lea rcx, [rip + 0x846dd25]
0x1806d6d33: call 0x18049c210
0x1806d6d38: lea rcx, [rip + 0x845da09]
0x1806d6d3f: call 0x18049c210
0x1806d6d44: mov byte ptr [rip + 0x88c4627], 1
0x1806d6d4b: mov rax, qword ptr [rip + 0x846dd06]
0x1806d6d52: cmp dword ptr [rax + 0xe0], 0
0x1806d6d59: jne 0x1806d6d6a
0x1806d6d5b: mov rcx, rax
0x1806d6d5e: call 0x18049c450
0x1806d6d63: mov rax, qword ptr [rip + 0x846dcee]
0x1806d6d6a: mov rax, qword ptr [rax + 0xb8]
0x1806d6d71: mov rcx, qword ptr [rax + 0x710]
0x1806d6d78: test rcx, rcx
0x1806d6d7b: jne 0x1806d6dc9
0x1806d6d7d: test bl, bl
0x1806d6d7f: jne 0x1806d6d85
0x1806d6d81: xor al, al
0x1806d6d83: jmp 0x1806d6dd8
0x1806d6d85: mov rax, qword ptr [rsi + 0x78]
0x1806d6d89: test rax, rax
0x1806d6d8c: je 0x1806d6e75
0x1806d6d92: mov rcx, qword ptr [rip + 0x845d9af]
0x1806d6d99: mov rbx, qword ptr [rax + 0x30]
0x1806d6d9d: call 0x1859967e0
0x1806d6da2: test rax, rax
0x1806d6da5: je 0x1806d6e75
0x1806d6dab: mov rdx, qword ptr [rax + 0x20]
0x1806d6daf: test rdx, rdx
0x1806d6db2: je 0x1806d6e75
0x1806d6db8: mov rdx, qword ptr [rdx + 0x30]
0x1806d6dbc: xor r8d, r8d
0x1806d6dbf: mov rcx, rbx
0x1806d6dc2: call 0x186020b40 ; System.String.op_Inequality
0x1806d6dc7: jmp 0x1806d6dd8
0x1806d6dc9: xor r9d, r9d
0x1806d6dcc: movzx r8d, bl
0x1806d6dd0: mov rdx, rsi
0x1806d6dd3: call 0x183767f50 ; XLua.DelegateBridge.__Gen_Delegate_Imp87
0x1806d6dd8: xor edx, edx
0x1806d6dda: mov byte ptr [rsi + 0x1f6], al
0x1806d6de0: mov rcx, rsi
0x1806d6de3: call 0x1806d9c60 ; Torappu.Battle.Buff._InitIsEpBreakBuff
0x1806d6de8: xor edx, edx
0x1806d6dea: mov byte ptr [rsi + 0x201], al
0x1806d6df0: mov rcx, rsi
0x1806d6df3: call 0x1806da140 ; Torappu.Battle.Buff._InitShieldSource
0x1806d6df8: mov r15, qword ptr [rsp + 0x90]
0x1806d6e00: mov r13, qword ptr [rsp + 0xd0]
0x1806d6e08: movaps xmm6, xmmword ptr [rsp + 0x80]
0x1806d6e10: add rsp, 0x98
0x1806d6e17: pop r14
0x1806d6e19: pop r12
0x1806d6e1b: pop rdi
0x1806d6e1c: pop rsi
0x1806d6e1d: pop rbx
0x1806d6e1e: pop rbp
0x1806d6e1f: ret
0x1806d6e20: mov rax, qword ptr [rbp + 0x77]
0x1806d6e24: lea r8, [rbp - 0x31]
0x1806d6e28: movups xmm0, xmmword ptr [r14]
0x1806d6e2c: mov qword ptr [rsp + 0x48], rdi
0x1806d6e31: mov r9, rbx
0x1806d6e34: mov qword ptr [rsp + 0x40], rax
0x1806d6e39: mov rdx, rsi
0x1806d6e3c: mov rax, qword ptr [rbp + 0x6f]
0x1806d6e40: mov qword ptr [rsp + 0x38], rax
0x1806d6e45: mov rax, qword ptr [rbp + 0x67]
0x1806d6e49: mov qword ptr [rsp + 0x30], rax
0x1806d6e4e: mov rax, qword ptr [rbp + 0x5f]
0x1806d6e52: mov qword ptr [rsp + 0x28], rax
0x1806d6e57: mov qword ptr [rsp + 0x20], r12
0x1806d6e5c: movaps xmmword ptr [rbp - 0x31], xmm0
0x1806d6e60: call 0x1833e8eb0 ; XLua.DelegateBridge.__Gen_Delegate_Imp2993
0x1806d6e65: add rsp, 0x98
0x1806d6e6c: pop r14
0x1806d6e6e: pop r12
0x1806d6e70: pop rdi
0x1806d6e71: pop rsi
0x1806d6e72: pop rbx
0x1806d6e73: pop rbp
0x1806d6e74: ret
0x1806d6e75: call 0x18049c3c0
0x1806d6e7a: int3
0x1806d6e7b: call 0x18049c3b0
0x1806d6e80: int3
0x1806d6e81: call 0x18049c3c0
0x1806d6e86: int3
0x1806d6e87: int3
0x1806d6e88: int3
0x1806d6e89: int3
0x1806d6e8a: int3
0x1806d6e8b: int3
0x1806d6e8c: int3
0x1806d6e8d: int3
0x1806d6e8e: int3
0x1806d6e8f: int3
