0x18066c5c0: mov qword ptr [rsp + 0x10], rbx
0x18066c5c5: mov qword ptr [rsp + 0x18], rsi
0x18066c5ca: mov qword ptr [rsp + 0x20], rdi
0x18066c5cf: mov qword ptr [rsp + 8], rcx
0x18066c5d4: push r14
0x18066c5d6: sub rsp, 0xd0
0x18066c5dd: mov rsi, rcx
0x18066c5e0: cmp byte ptr [rip + 0x892ea6d], 0
0x18066c5e7: jne 0x18066c6a8
0x18066c5ed: lea rcx, [rip + 0x84a364c]
0x18066c5f4: call 0x18049c210
0x18066c5f9: lea rcx, [rip + 0x85fb140]
0x18066c600: call 0x18049c210
0x18066c605: lea rcx, [rip + 0x8554bb4]
0x18066c60c: call 0x18049c210
0x18066c611: lea rcx, [rip + 0x85491a8]
0x18066c618: call 0x18049c210
0x18066c61d: lea rcx, [rip + 0x85493e4]
0x18066c624: call 0x18049c210
0x18066c629: lea rcx, [rip + 0x8554de0]
0x18066c630: call 0x18049c210
0x18066c635: lea rcx, [rip + 0x854961c]
0x18066c63c: call 0x18049c210
0x18066c641: lea rcx, [rip + 0x8555010]
0x18066c648: call 0x18049c210
0x18066c64d: lea rcx, [rip + 0x85e5494]
0x18066c654: call 0x18049c210
0x18066c659: lea rcx, [rip + 0x84ee8d8]
0x18066c660: call 0x18049c210
0x18066c665: lea rcx, [rip + 0x8511edc]
0x18066c66c: call 0x18049c210
0x18066c671: lea rcx, [rip + 0x84eeb08]
0x18066c678: call 0x18049c210
0x18066c67d: lea rcx, [rip + 0x8590bcc]
0x18066c684: call 0x18049c210
0x18066c689: lea rcx, [rip + 0x859faa0]
0x18066c690: call 0x18049c210
0x18066c695: lea rcx, [rip + 0x859ff2c]
0x18066c69c: call 0x18049c210
0x18066c6a1: mov byte ptr [rip + 0x892e9ac], 1
0x18066c6a8: xorps xmm0, xmm0
0x18066c6ab: movups xmmword ptr [rsp + 0x60], xmm0
0x18066c6b0: movups xmmword ptr [rsp + 0x70], xmm0
0x18066c6b5: movups xmmword ptr [rsp + 0x50], xmm0
0x18066c6ba: mov rax, qword ptr [rip + 0x84a357f]
0x18066c6c1: cmp dword ptr [rax + 0xe0], 0
0x18066c6c8: jne 0x18066c6d9
0x18066c6ca: mov rcx, rax
0x18066c6cd: call 0x18049c450
0x18066c6d2: mov rax, qword ptr [rip + 0x84a3567]
0x18066c6d9: mov rax, qword ptr [rax + 0xb8]
0x18066c6e0: mov rcx, qword ptr [rax + 0xa80]
0x18066c6e7: test rcx, rcx
0x18066c6ea: jne 0x18066c8de
0x18066c6f0: mov rdx, qword ptr [rip + 0x85fb049]
0x18066c6f7: mov rcx, qword ptr [rsi + 0x20]
0x18066c6fb: call 0x184696030
0x18066c700: test al, al
0x18066c702: jne 0x18066c8e9
0x18066c708: mov rdx, qword ptr [rsi + 0x20]
0x18066c70c: test rdx, rdx
0x18066c70f: je 0x18066c915
0x18066c715: mov r8, qword ptr [rip + 0x84eea64]
0x18066c71c: lea rcx, [rsp + 0x30]
0x18066c721: call 0x184ce30d0
0x18066c726: movups xmm0, xmmword ptr [rsp + 0x30]
0x18066c72b: movups xmmword ptr [rsp + 0x80], xmm0
0x18066c733: movups xmm1, xmmword ptr [rsp + 0x40]
0x18066c738: movups xmmword ptr [rsp + 0x90], xmm1
0x18066c740: xor r14d, r14d
0x18066c743: mov qword ptr [rsp + 0x20], r14
0x18066c748: lea rax, [rsp + 0x80]
0x18066c750: mov qword ptr [rsp + 0x28], rax
0x18066c755: nop word ptr [rax + rax]
0x18066c760: mov rdx, qword ptr [rip + 0x85492a1]
0x18066c767: lea rcx, [rsp + 0x80]
0x18066c76f: call 0x185cb6220
0x18066c774: test al, al
0x18066c776: je 0x18066c87c
0x18066c77c: mov rdx, qword ptr [rsp + 0x98]
0x18066c784: test rdx, rdx
0x18066c787: je 0x18066c760
0x18066c789: mov r8, qword ptr [rip + 0x8511db8]
0x18066c790: lea rcx, [rsp + 0xb0]
0x18066c798: call 0x184ce30d0
0x18066c79d: movups xmm0, xmmword ptr [rsp + 0xb0]
0x18066c7a5: movups xmmword ptr [rsp + 0x60], xmm0
0x18066c7aa: movups xmm1, xmmword ptr [rsp + 0xc0]
0x18066c7b2: movups xmmword ptr [rsp + 0x70], xmm1
0x18066c7b7: mov qword ptr [rsp + 0x30], r14
0x18066c7bc: lea rbx, [rsp + 0x60]
0x18066c7c1: mov qword ptr [rsp + 0x38], rbx
0x18066c7c6: nop word ptr [rax + rax]
0x18066c7d0: mov rdx, qword ptr [rip + 0x8554c39]
0x18066c7d7: lea rcx, [rsp + 0x60]
0x18066c7dc: call 0x185cb62d0
0x18066c7e1: test al, al
0x18066c7e3: je 0x18066c839
0x18066c7e5: movups xmm0, xmmword ptr [rsp + 0x70]
0x18066c7ea: movups xmmword ptr [rsp + 0x50], xmm0
0x18066c7ef: mov rdx, qword ptr [rip + 0x859fdd2]
0x18066c7f6: lea rcx, [rsp + 0x50]
0x18066c7fb: call 0x1853ae780
0x18066c800: test al, al
0x18066c802: je 0x18066c7d0
0x18066c804: mov rdi, qword ptr [rsi + 0x90]
0x18066c80b: mov rdx, qword ptr [rip + 0x859f91e]
0x18066c812: lea rcx, [rsp + 0x50]
0x18066c817: call 0x1853ae540
0x18066c81c: test rdi, rdi
0x18066c81f: je 0x18066c903
0x18066c825: mov r8, qword ptr [rip + 0x8590a24]
0x18066c82c: mov rdx, rax
0x18066c82f: mov rcx, rdi
0x18066c832: call 0x1853acb60
0x18066c837: jmp 0x18066c7d0
0x18066c839: mov rdx, qword ptr [rip + 0x8554980]
0x18066c840: mov rcx, rbx
0x18066c843: call 0x18051df60 ; 3159 metadata aliases
0x18066c848: jmp 0x18066c760
0x18066c84d: mov rdx, qword ptr [rip + 0x855496c]
0x18066c854: mov rcx, qword ptr [rsp + 0x38]
0x18066c859: call 0x18051df60 ; 3159 metadata aliases
0x18066c85e: mov rcx, qword ptr [rsp + 0x30]
0x18066c863: test rcx, rcx
0x18066c866: jne 0x18066c909
0x18066c86c: xor r14d, r14d
0x18066c86f: mov rsi, qword ptr [rsp + 0xe0]
0x18066c877: jmp 0x18066c760
0x18066c87c: mov rdx, qword ptr [rip + 0x8548f3d]
0x18066c883: mov rcx, qword ptr [rsp + 0x28]
0x18066c888: call 0x18051df60 ; 3159 metadata aliases
0x18066c88d: jmp 0x18066c8b5
0x18066c88f: mov rdx, qword ptr [rip + 0x8548f2a]
0x18066c896: mov rcx, qword ptr [rsp + 0x28]
0x18066c89b: call 0x18051df60 ; 3159 metadata aliases
0x18066c8a0: mov rcx, qword ptr [rsp + 0x20]
0x18066c8a5: test rcx, rcx
0x18066c8a8: jne 0x18066c90f
0x18066c8aa: xor r14d, r14d
0x18066c8ad: mov rsi, qword ptr [rsp + 0xe0]
0x18066c8b5: mov rcx, qword ptr [rsi + 0x20]
0x18066c8b9: test rcx, rcx
0x18066c8bc: je 0x18066c915
0x18066c8be: inc dword ptr [rcx + 0x1c]
0x18066c8c1: mov r8d, dword ptr [rcx + 0x18]
0x18066c8c5: mov dword ptr [rcx + 0x18], r14d
0x18066c8c9: test r8d, r8d
0x18066c8cc: jle 0x18066c8e9
0x18066c8ce: xor r9d, r9d
0x18066c8d1: xor edx, edx
0x18066c8d3: mov rcx, qword ptr [rcx + 0x10]
0x18066c8d7: call 0x186149e10 ; System.Array.Clear
0x18066c8dc: jmp 0x18066c8e9
0x18066c8de: xor r8d, r8d
0x18066c8e1: mov rdx, rsi
0x18066c8e4: call 0x1833c9ac0 ; XLua.DelegateBridge.__Gen_Delegate_Imp27
0x18066c8e9: lea r11, [rsp + 0xd0]
0x18066c8f1: mov rbx, qword ptr [r11 + 0x18]
0x18066c8f5: mov rsi, qword ptr [r11 + 0x20]
0x18066c8f9: mov rdi, qword ptr [r11 + 0x28]
0x18066c8fd: mov rsp, r11
0x18066c900: pop r14
0x18066c902: ret
0x18066c903: call 0x18049c3c0
0x18066c908: nop
0x18066c909: call 0x180483060
0x18066c90e: nop
0x18066c90f: call 0x180483060
0x18066c914: int3
0x18066c915: call 0x18049c3c0
0x18066c91a: int3
0x18066c91b: int3
0x18066c91c: int3
0x18066c91d: int3
0x18066c91e: int3
0x18066c91f: int3
