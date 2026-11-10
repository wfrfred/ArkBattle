0x185cadad0: mov qword ptr [rsp + 0x18], rbx
0x185cadad5: mov qword ptr [rsp + 0x20], rbp
0x185cadada: push rsi
0x185cadadb: sub rsp, 0x40
0x185cadadf: cmp byte ptr [rip + 0x331c00d], 0
0x185cadae6: mov rbx, rdx
0x185cadae9: mov esi, ecx
0x185cadaeb: jne 0x185cadb24
0x185cadaed: lea rcx, [rip + 0x2e50814]
0x185cadaf4: call 0x18049c210
0x185cadaf9: lea rcx, [rip + 0x2e4f5c8]
0x185cadb00: call 0x18049c210
0x185cadb05: lea rcx, [rip + 0x2e5111c]
0x185cadb0c: call 0x18049c210
0x185cadb11: lea rcx, [rip + 0x2e8caf8]
0x185cadb18: call 0x18049c210
0x185cadb1d: mov byte ptr [rip + 0x331bfcf], 1
0x185cadb24: mov rax, qword ptr [rbx + 0x20]
0x185cadb28: mov qword ptr [rsp + 0x58], 0
0x185cadb31: test byte ptr [rax + 0x136], 1
0x185cadb38: jne 0x185cadb42
0x185cadb3a: mov rcx, rax
0x185cadb3d: call 0x180456700
0x185cadb42: mov rdx, qword ptr [rax + 0xc0]
0x185cadb49: mov ecx, esi
0x185cadb4b: mov rdx, qword ptr [rdx + 0x30]
0x185cadb4f: call 0x1846c5ed0 ; shared native address; 17 metadata aliases
0x185cadb54: mov ebp, eax
0x185cadb56: mov rax, qword ptr [rbx + 0x20]
0x185cadb5a: test byte ptr [rax + 0x136], 1
0x185cadb61: jne 0x185cadb6b
0x185cadb63: mov rcx, rax
0x185cadb66: call 0x180456700
0x185cadb6b: mov rax, qword ptr [rax + 0xc0]
0x185cadb72: mov rax, qword ptr [rax]
0x185cadb75: test byte ptr [rax + 0x136], 1
0x185cadb7c: jne 0x185cadb86
0x185cadb7e: mov rcx, rax
0x185cadb81: call 0x180456700
0x185cadb86: mov rax, qword ptr [rax + 0xb8]
0x185cadb8d: mov qword ptr [rsp + 0x50], rdi
0x185cadb92: cmp qword ptr [rax + 0x10], 0
0x185cadb97: jne 0x185cadc42
0x185cadb9d: mov rcx, qword ptr [rip + 0x2e8ca6c]
0x185cadba4: call 0x18046d2f0
0x185cadba9: mov rdi, rax
0x185cadbac: test rax, rax
0x185cadbaf: je 0x185cadd62
0x185cadbb5: mov rdx, qword ptr [rip + 0x2e4f50c]
0x185cadbbc: mov rcx, rax
0x185cadbbf: call 0x185a26b70
0x185cadbc4: mov rax, qword ptr [rbx + 0x20]
0x185cadbc8: test byte ptr [rax + 0x136], 1
0x185cadbcf: jne 0x185cadbd9
0x185cadbd1: mov rcx, rax
0x185cadbd4: call 0x180456700
0x185cadbd9: mov rax, qword ptr [rax + 0xc0]
0x185cadbe0: mov rax, qword ptr [rax]
0x185cadbe3: test byte ptr [rax + 0x136], 1
0x185cadbea: jne 0x185cadbf4
0x185cadbec: mov rcx, rax
0x185cadbef: call 0x180456700
0x185cadbf4: mov rax, qword ptr [rax + 0xb8]
0x185cadbfb: mov qword ptr [rax + 0x10], rdi
0x185cadbff: mov rax, qword ptr [rbx + 0x20]
0x185cadc03: test byte ptr [rax + 0x136], 1
0x185cadc0a: jne 0x185cadc14
0x185cadc0c: mov rcx, rax
0x185cadc0f: call 0x180456700
0x185cadc14: mov rax, qword ptr [rax + 0xc0]
0x185cadc1b: mov rax, qword ptr [rax]
0x185cadc1e: test byte ptr [rax + 0x136], 1
0x185cadc25: jne 0x185cadc2f
0x185cadc27: mov rcx, rax
0x185cadc2a: call 0x180456700
0x185cadc2f: mov rcx, qword ptr [rax + 0xb8]
0x185cadc36: mov rdx, rdi
0x185cadc39: add rcx, 0x10
0x185cadc3d: call 0x18049bcf0
0x185cadc42: mov rax, qword ptr [rbx + 0x20]
0x185cadc46: test byte ptr [rax + 0x136], 1
0x185cadc4d: jne 0x185cadc57
0x185cadc4f: mov rcx, rax
0x185cadc52: call 0x180456700
0x185cadc57: mov rax, qword ptr [rax + 0xc0]
0x185cadc5e: mov rax, qword ptr [rax]
0x185cadc61: test byte ptr [rax + 0x136], 1
0x185cadc68: jne 0x185cadc72
0x185cadc6a: mov rcx, rax
0x185cadc6d: call 0x180456700
0x185cadc72: mov rax, qword ptr [rax + 0xb8]
0x185cadc79: mov rcx, qword ptr [rax + 0x10]
0x185cadc7d: test rcx, rcx
0x185cadc80: je 0x185cadd62
0x185cadc86: mov r9, qword ptr [rip + 0x2e5067b]
0x185cadc8d: lea r8, [rsp + 0x58]
0x185cadc92: mov edx, ebp
0x185cadc94: call 0x185a4b410
0x185cadc99: test al, al
0x185cadc9b: jne 0x185cadd48
0x185cadca1: mov rax, qword ptr [rbx + 0x20]
0x185cadca5: test byte ptr [rax + 0x136], 1
0x185cadcac: jne 0x185cadcb6
0x185cadcae: mov rcx, rax
0x185cadcb1: call 0x180456700
0x185cadcb6: mov rax, qword ptr [rax + 0xc0]
0x185cadcbd: mov rax, qword ptr [rax + 0x38]
0x185cadcc1: test byte ptr [rax + 0x136], 1
0x185cadcc8: jne 0x185cadcd2
0x185cadcca: mov rcx, rax
0x185cadccd: call 0x180456700
0x185cadcd2: xor edx, edx
0x185cadcd4: mov qword ptr [rsp + 0x20], rax
0x185cadcd9: lea rcx, [rsp + 0x20]
0x185cadcde: mov qword ptr [rsp + 0x28], 0xffffffffffffffff
0x185cadce7: mov dword ptr [rsp + 0x30], esi
0x185cadceb: call 0x18615dba0 ; System.Enum.ToString
0x185cadcf0: mov qword ptr [rsp + 0x58], rax
0x185cadcf5: mov rax, qword ptr [rbx + 0x20]
0x185cadcf9: test byte ptr [rax + 0x136], 1
0x185cadd00: jne 0x185cadd0a
0x185cadd02: mov rcx, rax
0x185cadd05: call 0x180456700
0x185cadd0a: mov rax, qword ptr [rax + 0xc0]
0x185cadd11: mov rax, qword ptr [rax]
0x185cadd14: test byte ptr [rax + 0x136], 1
0x185cadd1b: jne 0x185cadd25
0x185cadd1d: mov rcx, rax
0x185cadd20: call 0x180456700
0x185cadd25: mov rax, qword ptr [rax + 0xb8]
0x185cadd2c: mov rcx, qword ptr [rax + 0x10]
0x185cadd30: test rcx, rcx
0x185cadd33: je 0x185cadd68
0x185cadd35: mov r9, qword ptr [rip + 0x2e50eec]
0x185cadd3c: mov edx, ebp
0x185cadd3e: mov r8, qword ptr [rsp + 0x58]
0x185cadd43: call 0x185a51500
0x185cadd48: mov rax, qword ptr [rsp + 0x58]
0x185cadd4d: mov rdi, qword ptr [rsp + 0x50]
0x185cadd52: mov rbx, qword ptr [rsp + 0x60]
0x185cadd57: mov rbp, qword ptr [rsp + 0x68]
0x185cadd5c: add rsp, 0x40
0x185cadd60: pop rsi
0x185cadd61: ret 
0x185cadd62: call 0x18049c3c0
0x185cadd67: int3 
0x185cadd68: call 0x18049c3c0
0x185cadd6d: int3 
