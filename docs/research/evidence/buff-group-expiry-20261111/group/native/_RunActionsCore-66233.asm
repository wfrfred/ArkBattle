0x1806dbbd0: mov qword ptr [rsp + 0x10], rbx
0x1806dbbd5: mov qword ptr [rsp + 0x18], rsi
0x1806dbbda: mov qword ptr [rsp + 0x20], rdi
0x1806dbbdf: mov qword ptr [rsp + 8], rcx
0x1806dbbe4: push r14
0x1806dbbe6: sub rsp, 0x360
0x1806dbbed: movzx ebx, r9b
0x1806dbbf1: mov r14d, r8d
0x1806dbbf4: mov rdi, rdx
0x1806dbbf7: mov rsi, rcx
0x1806dbbfa: cmp byte ptr [rip + 0x88bf75f], 0
0x1806dbc01: jne 0x1806dbc22
0x1806dbc03: lea rcx, [rip + 0x8468e4e]
0x1806dbc0a: call 0x18049c210
0x1806dbc0f: lea rcx, [rip + 0x84d5f4a]
0x1806dbc16: call 0x18049c210
0x1806dbc1b: mov byte ptr [rip + 0x88bf73e], 1
0x1806dbc22: xor edx, edx
0x1806dbc24: mov r8d, 0x100
0x1806dbc2a: lea rcx, [rsp + 0x60]
0x1806dbc2f: call 0x180511f40
0x1806dbc34: xor edx, edx
0x1806dbc36: mov r8d, 0x100
0x1806dbc3c: lea rcx, [rsp + 0x160]
0x1806dbc44: call 0x180511f40
0x1806dbc49: mov rax, qword ptr [rip + 0x8468e08]
0x1806dbc50: cmp dword ptr [rax + 0xe0], 0
0x1806dbc57: jne 0x1806dbc68
0x1806dbc59: mov rcx, rax
0x1806dbc5c: call 0x18049c450
0x1806dbc61: mov rax, qword ptr [rip + 0x8468df0]
0x1806dbc68: mov rax, qword ptr [rax + 0xb8]
0x1806dbc6f: mov rdx, qword ptr [rax + 0x680]
0x1806dbc76: test rdx, rdx
0x1806dbc79: jne 0x1806dbf79
0x1806dbc7f: mov rcx, rdi
0x1806dbc82: call 0x1806dd840 ; Torappu.Battle.Buff.get_context
0x1806dbc87: test rax, rax
0x1806dbc8a: je 0x1806dc045
0x1806dbc90: xor edx, edx
0x1806dbc92: mov rcx, rax
0x1806dbc95: call 0x1806f7280 ; Torappu.Battle.Context.BeginChangeGard
0x1806dbc9a: mov qword ptr [rsp + 0x40], rax
0x1806dbc9f: mov qword ptr [rsp + 0x48], 0
0x1806dbca8: lea rax, [rsp + 0x40]
0x1806dbcad: mov qword ptr [rsp + 0x50], rax
0x1806dbcb2: xor r8d, r8d
0x1806dbcb5: mov rdx, rdi
0x1806dbcb8: lea rcx, [rsp + 0x40]
0x1806dbcbd: call 0x1806f4a20 ; Torappu.Battle.Context/ChangeGuard.set_buff
0x1806dbcc2: xor edx, edx
0x1806dbcc4: mov rcx, rdi
0x1806dbcc7: call 0x1806de7e0 ; Torappu.Battle.Buff.get_source
0x1806dbccc: xor r8d, r8d
0x1806dbccf: mov rdx, rax
0x1806dbcd2: lea rcx, [rsp + 0x40]
0x1806dbcd7: call 0x1806f4d80 ; Torappu.Battle.Context/ChangeGuard.set_source
0x1806dbcdc: test bl, bl
0x1806dbcde: je 0x1806dbcfa
0x1806dbce0: xor edx, edx
0x1806dbce2: mov rcx, rdi
0x1806dbce5: call 0x1806de320 ; Torappu.Battle.Buff.get_owner
0x1806dbcea: xor r8d, r8d
0x1806dbced: mov rdx, rax
0x1806dbcf0: lea rcx, [rsp + 0x40]
0x1806dbcf5: call 0x1806f4e10 ; Torappu.Battle.Context/ChangeGuard.set_target
0x1806dbcfa: xor edx, edx
0x1806dbcfc: mov rcx, rdi
0x1806dbcff: call 0x1806de320 ; Torappu.Battle.Buff.get_owner
0x1806dbd04: mov rbx, rax
0x1806dbd07: test rax, rax
0x1806dbd0a: je 0x1806dc039
0x1806dbd10: cmp byte ptr [rip + 0x88fcd59], 0
0x1806dbd17: jbe 0x1806dbd21
0x1806dbd19: mov rcx, qword ptr [rax]
0x1806dbd1c: call 0x180457010
0x1806dbd21: mov rdx, qword ptr [rbx]
0x1806dbd24: mov rax, qword ptr [rdx + 0x3c0]
0x1806dbd2b: mov rdx, qword ptr [rdx + 0x3c8]
0x1806dbd32: mov rcx, rbx
0x1806dbd35: call rax
0x1806dbd37: test al, al
0x1806dbd39: je 0x1806dbd88
0x1806dbd3b: xor edx, edx
0x1806dbd3d: mov rcx, rdi
0x1806dbd40: call 0x1806de320 ; Torappu.Battle.Buff.get_owner
0x1806dbd45: mov rbx, rax
0x1806dbd48: test rax, rax
0x1806dbd4b: je 0x1806dc025
0x1806dbd51: cmp byte ptr [rip + 0x88fcd18], 0
0x1806dbd58: jbe 0x1806dbd62
0x1806dbd5a: mov rcx, qword ptr [rax]
0x1806dbd5d: call 0x180457010
0x1806dbd62: mov rdx, qword ptr [rbx]
0x1806dbd65: mov rax, qword ptr [rdx + 0x480]
0x1806dbd6c: mov rdx, qword ptr [rdx + 0x488]
0x1806dbd73: mov rcx, rbx
0x1806dbd76: call rax
0x1806dbd78: xor r8d, r8d
0x1806dbd7b: mov rdx, rax
0x1806dbd7e: lea rcx, [rsp + 0x40]
0x1806dbd83: call 0x1806f4ea0 ; Torappu.Battle.Context/ChangeGuard.set_tile
0x1806dbd88: mov rcx, qword ptr [rdi + 0xb0]
0x1806dbd8f: test rcx, rcx
0x1806dbd92: je 0x1806dc034
0x1806dbd98: movsxd rax, dword ptr [rsp + 0x390]
0x1806dbda0: cmp eax, dword ptr [rcx + 0x18]
0x1806dbda3: jae 0x1806dc01f
0x1806dbda9: mov r14, qword ptr [rcx + rax*8 + 0x20]
0x1806dbdae: xor edx, edx
0x1806dbdb0: mov rcx, rdi
0x1806dbdb3: call 0x1806de320 ; Torappu.Battle.Buff.get_owner
0x1806dbdb8: xor edx, edx
0x1806dbdba: mov rcx, rdi
0x1806dbdbd: call 0x1806de7e0 ; Torappu.Battle.Buff.get_source
0x1806dbdc2: mov rcx, qword ptr [rip + 0x84d5d97]
0x1806dbdc9: call 0x18558e720
0x1806dbdce: test rax, rax
0x1806dbdd1: je 0x1806dc02f
0x1806dbdd7: xor edx, edx
0x1806dbdd9: mov rcx, rax
0x1806dbddc: call 0x18066f680 ; Torappu.Battle.BattleController.get_context
0x1806dbde1: test rax, rax
0x1806dbde4: je 0x1806dc02a
0x1806dbdea: xor r8d, r8d
0x1806dbded: mov rdx, rax
0x1806dbdf0: lea rcx, [rsp + 0x260]
0x1806dbdf8: call 0x1806f7430 ; Torappu.Battle.Context.TakeSnapshot
0x1806dbdfd: lea rdx, [rsp + 0x60]
0x1806dbe02: mov ebx, 2
0x1806dbe07: mov r8d, ebx
0x1806dbe0a: nop word ptr [rax + rax]
0x1806dbe10: movups xmm0, xmmword ptr [rax]
0x1806dbe13: movups xmmword ptr [rdx], xmm0
0x1806dbe16: movups xmm1, xmmword ptr [rax + 0x10]
0x1806dbe1a: movups xmmword ptr [rdx + 0x10], xmm1
0x1806dbe1e: movups xmm0, xmmword ptr [rax + 0x20]
0x1806dbe22: movups xmmword ptr [rdx + 0x20], xmm0
0x1806dbe26: movups xmm1, xmmword ptr [rax + 0x30]
0x1806dbe2a: movups xmmword ptr [rdx + 0x30], xmm1
0x1806dbe2e: movups xmm0, xmmword ptr [rax + 0x40]
0x1806dbe32: movups xmmword ptr [rdx + 0x40], xmm0
0x1806dbe36: movups xmm1, xmmword ptr [rax + 0x50]
0x1806dbe3a: movups xmmword ptr [rdx + 0x50], xmm1
0x1806dbe3e: movups xmm0, xmmword ptr [rax + 0x60]
0x1806dbe42: movups xmmword ptr [rdx + 0x60], xmm0
0x1806dbe46: lea rdx, [rdx + 0x80]
0x1806dbe4d: movups xmm1, xmmword ptr [rax + 0x70]
0x1806dbe51: movups xmmword ptr [rdx - 0x10], xmm1
0x1806dbe55: lea rax, [rax + 0x80]
0x1806dbe5c: sub r8, 1
0x1806dbe60: jne 0x1806dbe10
0x1806dbe62: mov qword ptr [rsp + 0x20], r8
0x1806dbe67: lea r9, [rsp + 0x60]
0x1806dbe6c: mov r8, qword ptr [rdi + 0xb8]
0x1806dbe73: mov edx, 1
0x1806dbe78: mov rcx, r14
0x1806dbe7b: call 0x181257f70 ; Torappu.Battle.Action.ActionUtil.RunActions
0x1806dbe80: lea rax, [rsp + 0x160]
0x1806dbe88: lea rcx, [rsp + 0x60]
0x1806dbe8d: mov rdx, rbx
0x1806dbe90: movups xmm0, xmmword ptr [rcx]
0x1806dbe93: movups xmmword ptr [rax], xmm0
0x1806dbe96: movups xmm1, xmmword ptr [rcx + 0x10]
0x1806dbe9a: movups xmmword ptr [rax + 0x10], xmm1
0x1806dbe9e: movups xmm0, xmmword ptr [rcx + 0x20]
0x1806dbea2: movups xmmword ptr [rax + 0x20], xmm0
0x1806dbea6: movups xmm1, xmmword ptr [rcx + 0x30]
0x1806dbeaa: movups xmmword ptr [rax + 0x30], xmm1
0x1806dbeae: movups xmm0, xmmword ptr [rcx + 0x40]
0x1806dbeb2: movups xmmword ptr [rax + 0x40], xmm0
0x1806dbeb6: movups xmm1, xmmword ptr [rcx + 0x50]
0x1806dbeba: movups xmmword ptr [rax + 0x50], xmm1
0x1806dbebe: movups xmm0, xmmword ptr [rcx + 0x60]
0x1806dbec2: movups xmmword ptr [rax + 0x60], xmm0
0x1806dbec6: lea rax, [rax + 0x80]
0x1806dbecd: movups xmm1, xmmword ptr [rcx + 0x70]
0x1806dbed1: movups xmmword ptr [rax - 0x10], xmm1
0x1806dbed5: lea rcx, [rcx + 0x80]
0x1806dbedc: sub rdx, 1
0x1806dbee0: jne 0x1806dbe90
0x1806dbee2: xor edx, edx
0x1806dbee4: lea rcx, [rsp + 0x40]
0x1806dbee9: call 0x1806f4330 ; Torappu.Battle.Context/ChangeGuard.Dispose
0x1806dbeee: jmp 0x1806dbf17
0x1806dbef0: xor edx, edx
0x1806dbef2: lea rcx, [rsp + 0x40]
0x1806dbef7: call 0x1806f4330 ; Torappu.Battle.Context/ChangeGuard.Dispose
0x1806dbefc: mov rcx, qword ptr [rsp + 0x48]
0x1806dbf01: test rcx, rcx
0x1806dbf04: jne 0x1806dc03f
0x1806dbf0a: mov ebx, 2
0x1806dbf0f: mov rsi, qword ptr [rsp + 0x370]
0x1806dbf17: mov rax, rsi
0x1806dbf1a: lea rcx, [rsp + 0x160]
0x1806dbf22: movups xmm0, xmmword ptr [rcx]
0x1806dbf25: movups xmmword ptr [rax], xmm0
0x1806dbf28: movups xmm1, xmmword ptr [rcx + 0x10]
0x1806dbf2c: movups xmmword ptr [rax + 0x10], xmm1
0x1806dbf30: movups xmm0, xmmword ptr [rcx + 0x20]
0x1806dbf34: movups xmmword ptr [rax + 0x20], xmm0
0x1806dbf38: movups xmm1, xmmword ptr [rcx + 0x30]
0x1806dbf3c: movups xmmword ptr [rax + 0x30], xmm1
0x1806dbf40: movups xmm0, xmmword ptr [rcx + 0x40]
0x1806dbf44: movups xmmword ptr [rax + 0x40], xmm0
0x1806dbf48: movups xmm1, xmmword ptr [rcx + 0x50]
0x1806dbf4c: movups xmmword ptr [rax + 0x50], xmm1
0x1806dbf50: movups xmm0, xmmword ptr [rcx + 0x60]
0x1806dbf54: movups xmmword ptr [rax + 0x60], xmm0
0x1806dbf58: lea rax, [rax + 0x80]
0x1806dbf5f: movups xmm1, xmmword ptr [rcx + 0x70]
0x1806dbf63: movups xmmword ptr [rax - 0x10], xmm1
0x1806dbf67: lea rcx, [rcx + 0x80]
0x1806dbf6e: sub rbx, 1
0x1806dbf72: jne 0x1806dbf22
0x1806dbf74: jmp 0x1806dc002
0x1806dbf79: mov qword ptr [rsp + 0x30], 0
0x1806dbf82: mov eax, dword ptr [rsp + 0x390]
0x1806dbf89: mov dword ptr [rsp + 0x28], eax
0x1806dbf8d: mov byte ptr [rsp + 0x20], bl
0x1806dbf91: mov r9d, r14d
0x1806dbf94: mov r8, rdi
0x1806dbf97: lea rcx, [rsp + 0x260]
0x1806dbf9f: call 0x1833eb5e0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3009
0x1806dbfa4: mov rcx, rsi
0x1806dbfa7: mov ebx, 2
0x1806dbfac: nop dword ptr [rax]
0x1806dbfb0: movups xmm0, xmmword ptr [rax]
0x1806dbfb3: movups xmmword ptr [rcx], xmm0
0x1806dbfb6: movups xmm1, xmmword ptr [rax + 0x10]
0x1806dbfba: movups xmmword ptr [rcx + 0x10], xmm1
0x1806dbfbe: movups xmm0, xmmword ptr [rax + 0x20]
0x1806dbfc2: movups xmmword ptr [rcx + 0x20], xmm0
0x1806dbfc6: movups xmm1, xmmword ptr [rax + 0x30]
0x1806dbfca: movups xmmword ptr [rcx + 0x30], xmm1
0x1806dbfce: movups xmm0, xmmword ptr [rax + 0x40]
0x1806dbfd2: movups xmmword ptr [rcx + 0x40], xmm0
0x1806dbfd6: movups xmm1, xmmword ptr [rax + 0x50]
0x1806dbfda: movups xmmword ptr [rcx + 0x50], xmm1
0x1806dbfde: movups xmm0, xmmword ptr [rax + 0x60]
0x1806dbfe2: movups xmmword ptr [rcx + 0x60], xmm0
0x1806dbfe6: lea rcx, [rcx + 0x80]
0x1806dbfed: movups xmm1, xmmword ptr [rax + 0x70]
0x1806dbff1: movups xmmword ptr [rcx - 0x10], xmm1
0x1806dbff5: lea rax, [rax + 0x80]
0x1806dbffc: sub rbx, 1
0x1806dc000: jne 0x1806dbfb0
0x1806dc002: mov rax, rsi
0x1806dc005: lea r11, [rsp + 0x360]
0x1806dc00d: mov rbx, qword ptr [r11 + 0x18]
0x1806dc011: mov rsi, qword ptr [r11 + 0x20]
0x1806dc015: mov rdi, qword ptr [r11 + 0x28]
0x1806dc019: mov rsp, r11
0x1806dc01c: pop r14
0x1806dc01e: ret
0x1806dc01f: call 0x18049c3b0
0x1806dc024: nop
0x1806dc025: call 0x18049c3c0
0x1806dc02a: call 0x18049c3c0
0x1806dc02f: call 0x18049c3c0
0x1806dc034: call 0x18049c3c0
0x1806dc039: call 0x18049c3c0
0x1806dc03e: nop
0x1806dc03f: call 0x180483060
0x1806dc044: int3
0x1806dc045: call 0x18049c3c0
0x1806dc04a: int3
0x1806dc04b: int3
0x1806dc04c: int3
0x1806dc04d: int3
0x1806dc04e: int3
0x1806dc04f: int3
