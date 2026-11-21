; Torappu.Battle.BattleController.WithdrawPredefinedInstByAlias metadata=65660 VA=0x180663ac0
0x180663ac0: push rbx
0x180663ac2: push r12
0x180663ac4: sub rsp, 0x28
0x180663ac8: cmp byte ptr [rip + 0x8937540], 0
0x180663acf: mov r12, rdx
0x180663ad2: mov rbx, rcx
0x180663ad5: jne 0x180663aea
0x180663ad7: lea rcx, [rip + 0x84ac162]
0x180663ade: call 0x18049c210
0x180663ae3: mov byte ptr [rip + 0x8937525], 1
0x180663aea: mov rax, qword ptr [rip + 0x84ac14f]
0x180663af1: cmp dword ptr [rax + 0xe0], 0
0x180663af8: jne 0x180663b09
0x180663afa: mov rcx, rax
0x180663afd: call 0x18049c450
0x180663b02: mov rax, qword ptr [rip + 0x84ac137]
0x180663b09: mov rax, qword ptr [rax + 0xb8]
0x180663b10: mov rcx, qword ptr [rax + 0x858]
0x180663b17: test rcx, rcx
0x180663b1a: jne 0x180663d0b
0x180663b20: cmp qword ptr [rbx + 0xf8], rcx
0x180663b27: je 0x180663d01
0x180663b2d: mov qword ptr [rsp + 0x48], rsi
0x180663b32: mov qword ptr [rsp + 0x20], r15
0x180663b37: mov qword ptr [rsp + 0x40], rbp
0x180663b3c: mov qword ptr [rsp + 0x50], rdi
0x180663b41: mov qword ptr [rsp + 0x58], r14
0x180663b46: mov rax, qword ptr [rbx + 0xf8]
0x180663b4d: xor esi, esi
0x180663b4f: mov r15d, 0x20
0x180663b55: cmp qword ptr [rax + 0x10], rsi
0x180663b59: je 0x180663c13
0x180663b5f: mov ebp, esi
0x180663b61: mov edx, esi
0x180663b63: mov r14d, r15d
0x180663b66: nop word ptr [rax + rax]
0x180663b70: mov rcx, qword ptr [rax + 0x10]
0x180663b74: test rcx, rcx
0x180663b77: je 0x180663d20
0x180663b7d: cmp edx, dword ptr [rcx + 0x18]
0x180663b80: jge 0x180663c13
0x180663b86: mov rax, qword ptr [rbx + 0xf8]
0x180663b8d: test rax, rax
0x180663b90: je 0x180663d20
0x180663b96: mov rax, qword ptr [rax + 0x10]
0x180663b9a: test rax, rax
0x180663b9d: je 0x180663d20
0x180663ba3: cmp ebp, dword ptr [rax + 0x18]
0x180663ba6: jae 0x180663d26
0x180663bac: mov rdi, qword ptr [r14 + rax]
0x180663bb0: test rdi, rdi
0x180663bb3: je 0x180663d20
0x180663bb9: cmp byte ptr [rip + 0x8974eb0], sil
0x180663bc0: jbe 0x180663bca
0x180663bc2: mov rcx, qword ptr [rdi]
0x180663bc5: call 0x180457010
0x180663bca: mov rdx, qword ptr [rdi]
0x180663bcd: mov rcx, rdi
0x180663bd0: mov rax, qword ptr [rdx + 0x1b0]
0x180663bd7: mov rdx, qword ptr [rdx + 0x1b8]
0x180663bde: call rax
0x180663be0: xor r8d, r8d
0x180663be3: mov rdx, r12
0x180663be6: mov rcx, rax
0x180663be9: call 0x186017430 ; System.String.Equals | System.String.op_Equality
0x180663bee: test al, al
0x180663bf0: jne 0x180663ccc
0x180663bf6: mov rax, qword ptr [rbx + 0xf8]
0x180663bfd: inc ebp
0x180663bff: add r14, 8
0x180663c03: mov edx, ebp
0x180663c05: test rax, rax
0x180663c08: je 0x180663d20
0x180663c0e: jmp 0x180663b70
0x180663c13: mov rax, qword ptr [rbx + 0xf8]
0x180663c1a: test rax, rax
0x180663c1d: je 0x180663d20
0x180663c23: cmp qword ptr [rax + 0x18], rsi
0x180663c27: je 0x180663cfd
0x180663c2d: mov edx, esi
0x180663c2f: nop
0x180663c30: mov rcx, qword ptr [rax + 0x18]
0x180663c34: test rcx, rcx
0x180663c37: je 0x180663d20
0x180663c3d: cmp edx, dword ptr [rcx + 0x18]
0x180663c40: jge 0x180663cfd
0x180663c46: mov rax, qword ptr [rbx + 0xf8]
0x180663c4d: test rax, rax
0x180663c50: je 0x180663d20
0x180663c56: mov rax, qword ptr [rax + 0x18]
0x180663c5a: test rax, rax
0x180663c5d: je 0x180663d20
0x180663c63: cmp esi, dword ptr [rax + 0x18]
0x180663c66: jae 0x180663d26
0x180663c6c: mov rdi, qword ptr [r15 + rax]
0x180663c70: test rdi, rdi
0x180663c73: je 0x180663d20
0x180663c79: cmp byte ptr [rip + 0x8974df0], 0
0x180663c80: jbe 0x180663c8a
0x180663c82: mov rcx, qword ptr [rdi]
0x180663c85: call 0x180457010
0x180663c8a: mov rdx, qword ptr [rdi]
0x180663c8d: mov rcx, rdi
0x180663c90: mov rax, qword ptr [rdx + 0x1b0]
0x180663c97: mov rdx, qword ptr [rdx + 0x1b8]
0x180663c9e: call rax
0x180663ca0: xor r8d, r8d
0x180663ca3: mov rdx, r12
0x180663ca6: mov rcx, rax
0x180663ca9: call 0x186017430 ; System.String.Equals | System.String.op_Equality
0x180663cae: test al, al
0x180663cb0: jne 0x180663ccc
0x180663cb2: mov rax, qword ptr [rbx + 0xf8]
0x180663cb9: inc esi
0x180663cbb: add r15, 8
0x180663cbf: mov edx, esi
0x180663cc1: test rax, rax
0x180663cc4: jne 0x180663c30
0x180663cca: jmp 0x180663d20
0x180663ccc: xor r8d, r8d
0x180663ccf: mov rdx, rdi
0x180663cd2: mov rcx, rbx
0x180663cd5: call 0x18066d9a0 ; Torappu.Battle.BattleController._WithdrawPredefinedCharacter
0x180663cda: mov al, 1
0x180663cdc: mov r14, qword ptr [rsp + 0x58]
0x180663ce1: mov rdi, qword ptr [rsp + 0x50]
0x180663ce6: mov rbp, qword ptr [rsp + 0x40]
0x180663ceb: mov rsi, qword ptr [rsp + 0x48]
0x180663cf0: mov r15, qword ptr [rsp + 0x20]
0x180663cf5: add rsp, 0x28
0x180663cf9: pop r12
0x180663cfb: pop rbx
0x180663cfc: ret
0x180663cfd: xor al, al
0x180663cff: jmp 0x180663cdc
0x180663d01: xor al, al
0x180663d03: add rsp, 0x28
0x180663d07: pop r12
0x180663d09: pop rbx
0x180663d0a: ret
0x180663d0b: xor r9d, r9d
0x180663d0e: mov r8, r12
0x180663d11: mov rdx, rbx
0x180663d14: add rsp, 0x28
0x180663d18: pop r12
0x180663d1a: pop rbx
0x180663d1b: jmp 0x1833e9f80 ; XLua.DelegateBridge.__Gen_Delegate_Imp29
0x180663d20: call 0x18049c3c0
0x180663d25: int3
0x180663d26: call 0x18049c3b0
0x180663d2b: int3
0x180663d2c: int3
0x180663d2d: int3
0x180663d2e: int3
0x180663d2f: int3
