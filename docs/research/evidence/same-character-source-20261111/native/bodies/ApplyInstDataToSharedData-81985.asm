0x180c1cd50: mov qword ptr [rsp + 0x18], rbx
0x180c1cd55: mov qword ptr [rsp + 0x20], rsi
0x180c1cd5a: push r14
0x180c1cd5c: sub rsp, 0x20
0x180c1cd60: cmp byte ptr [rip + 0x83818cc], 0
0x180c1cd67: mov r14, r8
0x180c1cd6a: mov esi, edx
0x180c1cd6c: mov rbx, rcx
0x180c1cd6f: jne 0x180c1cd9c
0x180c1cd71: lea rcx, [rip + 0x7f0c950]
0x180c1cd78: call 0x18049c210
0x180c1cd7d: lea rcx, [rip + 0x7f973b4]
0x180c1cd84: call 0x18049c210
0x180c1cd89: lea rcx, [rip + 0x7f97f20]
0x180c1cd90: call 0x18049c210
0x180c1cd95: mov byte ptr [rip + 0x8381897], 1
0x180c1cd9c: test rbx, rbx
0x180c1cd9f: je 0x180c1ce69
0x180c1cda5: mov qword ptr [rsp + 0x30], rbp
0x180c1cdaa: mov qword ptr [rsp + 0x38], rdi
0x180c1cdaf: mov rax, qword ptr [rbx + 0x160]
0x180c1cdb6: test rax, rax
0x180c1cdb9: je 0x180c1ce7a
0x180c1cdbf: cmp qword ptr [rax + 0x38], 0
0x180c1cdc4: jne 0x180c1cdfb
0x180c1cdc6: mov rcx, qword ptr [rip + 0x7f0c8fb]
0x180c1cdcd: mov rbp, rax
0x180c1cdd0: call 0x18046d2f0
0x180c1cdd5: mov rdi, rax
0x180c1cdd8: test rax, rax
0x180c1cddb: je 0x180c1ce7a
0x180c1cde1: xor edx, edx
0x180c1cde3: mov rcx, rax
0x180c1cde6: call 0x18237a0c0 ; Torappu.Blackboard..ctor
0x180c1cdeb: lea rcx, [rbp + 0x38]
0x180c1cdef: mov qword ptr [rbp + 0x38], rdi
0x180c1cdf3: mov rdx, rdi
0x180c1cdf6: call 0x18049bcf0
0x180c1cdfb: test esi, esi
0x180c1cdfd: jle 0x180c1ce2a
0x180c1cdff: mov rax, qword ptr [rbx + 0x160]
0x180c1ce06: test rax, rax
0x180c1ce09: je 0x180c1ce7a
0x180c1ce0b: mov rcx, qword ptr [rax + 0x38]
0x180c1ce0f: test rcx, rcx
0x180c1ce12: je 0x180c1ce7a
0x180c1ce14: mov rdx, qword ptr [rip + 0x7f97e95]
0x180c1ce1b: xor r9d, r9d
0x180c1ce1e: movd xmm2, esi
0x180c1ce22: cvtdq2ps xmm2, xmm2
0x180c1ce25: call 0x182377ce0 ; Torappu.Blackboard.Assign
0x180c1ce2a: xor edx, edx
0x180c1ce2c: mov rcx, r14
0x180c1ce2f: call 0x18601a180 ; System.String.IsNullOrEmpty
0x180c1ce34: test al, al
0x180c1ce36: jne 0x180c1ce5f
0x180c1ce38: mov rax, qword ptr [rbx + 0x160]
0x180c1ce3f: test rax, rax
0x180c1ce42: je 0x180c1ce7a
0x180c1ce44: mov rcx, qword ptr [rax + 0x38]
0x180c1ce48: test rcx, rcx
0x180c1ce4b: je 0x180c1ce7a
0x180c1ce4d: mov rdx, qword ptr [rip + 0x7f972e4]
0x180c1ce54: xor r9d, r9d
0x180c1ce57: mov r8, r14
0x180c1ce5a: call 0x182377b30 ; Torappu.Blackboard.Assign
0x180c1ce5f: mov rbp, qword ptr [rsp + 0x30]
0x180c1ce64: mov rdi, qword ptr [rsp + 0x38]
0x180c1ce69: mov rbx, qword ptr [rsp + 0x40]
0x180c1ce6e: mov rsi, qword ptr [rsp + 0x48]
0x180c1ce73: add rsp, 0x20
0x180c1ce77: pop r14
0x180c1ce79: ret
0x180c1ce7a: call 0x18049c3c0
0x180c1ce7f: int3
