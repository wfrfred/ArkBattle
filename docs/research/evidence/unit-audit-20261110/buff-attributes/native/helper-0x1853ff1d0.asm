0x1853ff1d0: mov qword ptr [rsp + 8], rbx
0x1853ff1d5: mov qword ptr [rsp + 0x10], rbp
0x1853ff1da: mov qword ptr [rsp + 0x18], rsi
0x1853ff1df: mov qword ptr [rsp + 0x20], rdi
0x1853ff1e4: push r13
0x1853ff1e6: push r14
0x1853ff1e8: push r15
0x1853ff1ea: sub rsp, 0x20
0x1853ff1ee: mov rsi, qword ptr [rcx + 0x10]
0x1853ff1f2: xor ebp, ebp
0x1853ff1f4: mov rbx, r8
0x1853ff1f7: mov r15, rdx
0x1853ff1fa: mov r13, rcx
0x1853ff1fd: mov r14d, ebp
0x1853ff200: test rsi, rsi
0x1853ff203: je 0x1853ff418
0x1853ff209: nop dword ptr [rax]
0x1853ff210: mov rax, qword ptr [rbx + 0x20]
0x1853ff214: mov rcx, qword ptr [rax + 0xc0]
0x1853ff21b: mov rax, qword ptr [rcx + 8]
0x1853ff21f: cmp qword ptr [rax + 0x20], 0
0x1853ff224: jne 0x1853ff237
0x1853ff226: mov rax, qword ptr [rbx + 0x20]
0x1853ff22a: mov rcx, qword ptr [rax + 0xc0]
0x1853ff231: mov rax, qword ptr [rcx + 8]
0x1853ff235: call qword ptr [rax]
0x1853ff237: mov rdi, qword ptr [r13 + 0x10]
0x1853ff23b: cmp r14d, dword ptr [rsi + 0x18]
0x1853ff23f: jge 0x1853ff350
0x1853ff245: test rdi, rdi
0x1853ff248: je 0x1853ff418
0x1853ff24e: mov rax, qword ptr [rbx + 0x20]
0x1853ff252: mov rcx, qword ptr [rax + 0xc0]
0x1853ff259: mov rax, qword ptr [rcx + 0x18]
0x1853ff25d: cmp qword ptr [rax + 0x20], 0
0x1853ff262: jne 0x1853ff275
0x1853ff264: mov rax, qword ptr [rbx + 0x20]
0x1853ff268: mov rcx, qword ptr [rax + 0xc0]
0x1853ff26f: mov rax, qword ptr [rcx + 0x18]
0x1853ff273: call qword ptr [rax]
0x1853ff275: mov rax, qword ptr [rbx + 0x20]
0x1853ff279: mov edx, ebp
0x1853ff27b: mov rcx, rdi
0x1853ff27e: mov r8, qword ptr [rax + 0xc0]
0x1853ff285: mov r8, qword ptr [r8 + 0x18]
0x1853ff289: call 0x184d27b00
0x1853ff28e: mov rdi, rax
0x1853ff291: test r15, r15
0x1853ff294: je 0x1853ff418
0x1853ff29a: mov rcx, qword ptr [rbx + 0x20]
0x1853ff29e: mov rdx, qword ptr [rcx + 0xc0]
0x1853ff2a5: mov rax, qword ptr [rdx + 0x68]
0x1853ff2a9: test byte ptr [rax + 0x136], 1
0x1853ff2b0: jne 0x1853ff2ba
0x1853ff2b2: mov rcx, rax
0x1853ff2b5: call 0x180456700
0x1853ff2ba: xor ecx, ecx
0x1853ff2bc: mov r9, rdi
0x1853ff2bf: mov r8, r15
0x1853ff2c2: mov rdx, rax
0x1853ff2c5: call 0x180005010
0x1853ff2ca: mov rsi, qword ptr [r13 + 0x10]
0x1853ff2ce: test eax, eax
0x1853ff2d0: jle 0x1853ff2e5
0x1853ff2d2: inc ebp
0x1853ff2d4: mov r14d, ebp
0x1853ff2d7: test rsi, rsi
0x1853ff2da: je 0x1853ff418
0x1853ff2e0: jmp 0x1853ff210
0x1853ff2e5: test rsi, rsi
0x1853ff2e8: je 0x1853ff418
0x1853ff2ee: mov rax, qword ptr [rbx + 0x20]
0x1853ff2f2: mov rcx, qword ptr [rax + 0xc0]
0x1853ff2f9: mov rax, qword ptr [rcx + 0x78]
0x1853ff2fd: cmp qword ptr [rax + 0x20], 0
0x1853ff302: jne 0x1853ff315
0x1853ff304: mov rax, qword ptr [rbx + 0x20]
0x1853ff308: mov r8, qword ptr [rax + 0xc0]
0x1853ff30f: mov rax, qword ptr [r8 + 0x78]
0x1853ff313: call qword ptr [rax]
0x1853ff315: mov rax, qword ptr [rbx + 0x20]
0x1853ff319: mov r8, r15
0x1853ff31c: mov edx, ebp
0x1853ff31e: mov rcx, rsi
0x1853ff321: mov r9, qword ptr [rax + 0xc0]
0x1853ff328: mov r9, qword ptr [r9 + 0x78]
0x1853ff32c: call 0x184f4a100
0x1853ff331: mov rbx, qword ptr [rsp + 0x40]
0x1853ff336: mov rbp, qword ptr [rsp + 0x48]
0x1853ff33b: mov rsi, qword ptr [rsp + 0x50]
0x1853ff340: mov rdi, qword ptr [rsp + 0x58]
0x1853ff345: add rsp, 0x20
0x1853ff349: pop r15
0x1853ff34b: pop r14
0x1853ff34d: pop r13
0x1853ff34f: ret 
0x1853ff350: test rdi, rdi
0x1853ff353: je 0x1853ff418
0x1853ff359: mov rax, qword ptr [rbx + 0x20]
0x1853ff35d: mov rcx, qword ptr [rax + 0xc0]
0x1853ff364: mov rax, qword ptr [rcx + 0x80]
0x1853ff36b: cmp qword ptr [rax + 0x20], 0
0x1853ff370: jne 0x1853ff386
0x1853ff372: mov rax, qword ptr [rbx + 0x20]
0x1853ff376: mov rcx, qword ptr [rax + 0xc0]
0x1853ff37d: mov rax, qword ptr [rcx + 0x80]
0x1853ff384: call qword ptr [rax]
0x1853ff386: mov rax, qword ptr [rbx + 0x20]
0x1853ff38a: mov rdx, qword ptr [rdi + 0x10]
0x1853ff38e: mov rcx, qword ptr [rax + 0xc0]
0x1853ff395: mov rbx, qword ptr [rcx + 0x80]
0x1853ff39c: inc dword ptr [rdi + 0x1c]
0x1853ff39f: test rdx, rdx
0x1853ff3a2: je 0x1853ff418
0x1853ff3a4: movsxd rcx, dword ptr [rdi + 0x18]
0x1853ff3a8: cmp ecx, dword ptr [rdx + 0x18]
0x1853ff3ab: jb 0x1853ff3f3
0x1853ff3ad: mov rax, qword ptr [rbx + 0x20]
0x1853ff3b1: mov rdx, qword ptr [rax + 0xc0]
0x1853ff3b8: mov rax, qword ptr [rdx + 0x58]
0x1853ff3bc: cmp qword ptr [rax + 0x20], 0
0x1853ff3c1: jne 0x1853ff3d4
0x1853ff3c3: mov rax, qword ptr [rbx + 0x20]
0x1853ff3c7: mov rdx, qword ptr [rax + 0xc0]
0x1853ff3ce: mov rax, qword ptr [rdx + 0x58]
0x1853ff3d2: call qword ptr [rax]
0x1853ff3d4: mov rax, qword ptr [rbx + 0x20]
0x1853ff3d8: mov rdx, r15
0x1853ff3db: mov rcx, rdi
0x1853ff3de: mov r8, qword ptr [rax + 0xc0]
0x1853ff3e5: mov r8, qword ptr [r8 + 0x58]
0x1853ff3e9: call 0x184f43670
0x1853ff3ee: jmp 0x1853ff331
0x1853ff3f3: lea eax, [rcx + 1]
0x1853ff3f6: mov dword ptr [rdi + 0x18], eax
0x1853ff3f9: cmp ecx, dword ptr [rdx + 0x18]
0x1853ff3fc: jae 0x1853ff41e
0x1853ff3fe: mov qword ptr [rdx + rcx*8 + 0x20], r15
0x1853ff403: add rdx, 0x20
0x1853ff407: lea rcx, [rdx + rcx*8]
0x1853ff40b: mov rdx, r15
0x1853ff40e: call 0x18049bcf0
0x1853ff413: jmp 0x1853ff331
0x1853ff418: call 0x18049c3c0
0x1853ff41d: int3 
0x1853ff41e: call 0x18049c3b0
0x1853ff423: int3 
