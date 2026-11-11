0x1806ecc70: push rbx
0x1806ecc72: sub rsp, 0x20
0x1806ecc76: cmp byte ptr [rip + 0x88ae923], 0
0x1806ecc7d: mov rbx, rcx
0x1806ecc80: jne 0x1806ecca1
0x1806ecc82: lea rcx, [rip + 0x84d509f]
0x1806ecc89: call 0x18049c210
0x1806ecc8e: lea rcx, [rip + 0x84c4ecb]
0x1806ecc95: call 0x18049c210
0x1806ecc9a: mov byte ptr [rip + 0x88ae8ff], 1
0x1806ecca1: mov rax, qword ptr [rip + 0x84d5080]
0x1806ecca8: mov rdx, qword ptr [rax + 0xb8]
0x1806eccaf: mov rcx, qword ptr [rdx + 0x208]
0x1806eccb6: test rcx, rcx
0x1806eccb9: jne 0x1806ecf4f
0x1806eccbf: cmp byte ptr [rip + 0x88ebdab], cl
0x1806eccc5: jbe 0x1806ecccf
0x1806eccc7: mov rcx, qword ptr [rbx]
0x1806eccca: call 0x180457010
0x1806ecccf: mov rdx, qword ptr [rbx]
0x1806eccd2: mov rcx, rbx
0x1806eccd5: mov qword ptr [rsp + 0x30], rdi
0x1806eccda: mov rax, qword ptr [rdx + 0x1f0]
0x1806ecce1: mov rdx, qword ptr [rdx + 0x1f8]
0x1806ecce8: call rax
0x1806eccea: cmp eax, 1
0x1806ecced: jne 0x1806ecd83
0x1806eccf3: cmp byte ptr [rip + 0x88ae86b], 0
0x1806eccfa: jne 0x1806ecd0f
0x1806eccfc: lea rcx, [rip + 0x84d5025]
0x1806ecd03: call 0x18049c210
0x1806ecd08: mov byte ptr [rip + 0x88ae856], 1
0x1806ecd0f: mov rax, qword ptr [rip + 0x84d5012]
0x1806ecd16: mov rcx, qword ptr [rax + 0xb8]
0x1806ecd1d: mov rcx, qword ptr [rcx + 0x30]
0x1806ecd21: test rcx, rcx
0x1806ecd24: jne 0x1806ecd2e
0x1806ecd26: mov eax, dword ptr [rbx + 0x1c0]
0x1806ecd2c: jmp 0x1806ecd39
0x1806ecd2e: xor r8d, r8d
0x1806ecd31: mov rdx, rbx
0x1806ecd34: call 0x183196850 ; XLua.DelegateBridge.__Gen_Delegate_Imp11168
0x1806ecd39: cmp eax, 2
0x1806ecd3c: jne 0x1806ecd83
0x1806ecd3e: xor r8d, r8d
0x1806ecd41: mov edx, 3
0x1806ecd46: mov rcx, rbx
0x1806ecd49: call 0x1806f42c0 ; Torappu.Battle.Deck/Card.set_state
0x1806ecd4e: mov rcx, qword ptr [rbx + 0x30]
0x1806ecd52: test rcx, rcx
0x1806ecd55: je 0x1806ecf5f
0x1806ecd5b: mov rdx, qword ptr [rbx + 0x1d0]
0x1806ecd62: xor r9d, r9d
0x1806ecd65: mov r8b, 1
0x1806ecd68: call 0x181e4afc0 ; Torappu.PeriodicTimer.Reset
0x1806ecd6d: xor eax, eax
0x1806ecd6f: cmp byte ptr [rbx + 0x15c], al
0x1806ecd75: setne al
0x1806ecd78: add dword ptr [rbx + 0x158], eax
0x1806ecd7e: jmp 0x1806ece3c
0x1806ecd83: cmp byte ptr [rip + 0x88ebce6], 0
0x1806ecd8a: jbe 0x1806ecd94
0x1806ecd8c: mov rcx, qword ptr [rbx]
0x1806ecd8f: call 0x180457010
0x1806ecd94: mov rdx, qword ptr [rbx]
0x1806ecd97: mov rcx, rbx
0x1806ecd9a: mov rax, qword ptr [rdx + 0x1f0]
0x1806ecda1: mov rdx, qword ptr [rdx + 0x1f8]
0x1806ecda8: call rax
0x1806ecdaa: cmp eax, 2
0x1806ecdad: jne 0x1806ece3c
0x1806ecdb3: xor edx, edx
0x1806ecdb5: mov rcx, rbx
0x1806ecdb8: call 0x1806f3f20 ; Torappu.Battle.Deck/Card.get_state
0x1806ecdbd: cmp eax, 4
0x1806ecdc0: je 0x1806ecdf3
0x1806ecdc2: mov eax, dword ptr [rbx + 0x18]
0x1806ecdc5: cmp dword ptr [rbx + 0x170], eax
0x1806ecdcb: jge 0x1806ecdf3
0x1806ecdcd: mov rcx, qword ptr [rbx + 0x30]
0x1806ecdd1: test rcx, rcx
0x1806ecdd4: je 0x1806ecf5f
0x1806ecdda: mov rdx, qword ptr [rbx + 0x1d0]
0x1806ecde1: xor r9d, r9d
0x1806ecde4: mov r8b, 1
0x1806ecde7: call 0x181e4afc0 ; Torappu.PeriodicTimer.Reset
0x1806ecdec: mov edx, 4
0x1806ecdf1: jmp 0x1806ece31
0x1806ecdf3: xor edx, edx
0x1806ecdf5: mov rcx, rbx
0x1806ecdf8: call 0x1806f3f20 ; Torappu.Battle.Deck/Card.get_state
0x1806ecdfd: cmp eax, 3
0x1806ece00: je 0x1806ece3c
0x1806ece02: mov eax, dword ptr [rbx + 0x18]
0x1806ece05: cmp dword ptr [rbx + 0x170], eax
0x1806ece0b: jl 0x1806ece3c
0x1806ece0d: mov rcx, qword ptr [rbx + 0x30]
0x1806ece11: test rcx, rcx
0x1806ece14: je 0x1806ecf5f
0x1806ece1a: mov rdx, qword ptr [rbx + 0x1d0]
0x1806ece21: xor r9d, r9d
0x1806ece24: mov r8b, 1
0x1806ece27: call 0x181e4afc0 ; Torappu.PeriodicTimer.Reset
0x1806ece2c: mov edx, 3
0x1806ece31: xor r8d, r8d
0x1806ece34: mov rcx, rbx
0x1806ece37: call 0x1806f42c0 ; Torappu.Battle.Deck/Card.set_state
0x1806ece3c: mov rdi, qword ptr [rbx + 0x10]
0x1806ece40: test rdi, rdi
0x1806ece43: je 0x1806ecf5f
0x1806ece49: cmp byte ptr [rip + 0x88ae6f8], 0
0x1806ece50: jne 0x1806ece65
0x1806ece52: lea rcx, [rip + 0x843e927]
0x1806ece59: call 0x18049c210
0x1806ece5e: mov byte ptr [rip + 0x88ae6e3], 1
0x1806ece65: mov rax, qword ptr [rip + 0x843e914]
0x1806ece6c: mov rcx, qword ptr [rax + 0xb8]
0x1806ece73: mov rcx, qword ptr [rcx + 0x1a0]
0x1806ece7a: test rcx, rcx
0x1806ece7d: jne 0x1806ece94
0x1806ece7f: mov byte ptr [rdi + 0x60], 1
0x1806ece83: cmp byte ptr [rdi + 0xb1], cl
0x1806ece89: je 0x1806ecea2
0x1806ece8b: mov byte ptr [rdi + 0x88], 1
0x1806ece92: jmp 0x1806ecea2
0x1806ece94: xor r9d, r9d
0x1806ece97: mov r8, rbx
0x1806ece9a: mov rdx, rdi
0x1806ece9d: call 0x18338c7c0 ; XLua.DelegateBridge.__Gen_Delegate_Imp23
0x1806ecea2: mov rcx, qword ptr [rip + 0x84c4cb7]
0x1806ecea9: call 0x18558e720
0x1806eceae: test rax, rax
0x1806eceb1: je 0x1806ecf5f
0x1806eceb7: xor edx, edx
0x1806eceb9: mov rcx, rax
0x1806ecebc: call 0x180670490 ; Torappu.Battle.BattleController.get_gameMode
0x1806ecec1: test rax, rax
0x1806ecec4: je 0x1806ecf5f
0x1806ececa: mov rcx, qword ptr [rax]
0x1806ececd: mov edx, dword ptr [rcx + 0x11c]
0x1806eced3: add edx, 0xfffff625
0x1806eced9: cmp edx, 0x1a
0x1806ecedc: ja 0x1806ecf2e
0x1806ecede: movsxd rcx, edx
0x1806ecee1: lea r8, [rip - 0x6ecee8]
0x1806ecee8: movzx ecx, byte ptr [r8 + rcx + 0x6ecf70]
0x1806ecef1: mov edx, dword ptr [r8 + rcx*4 + 0x6ecf68]
0x1806ecef9: add rdx, r8
0x1806ecefc: jmp rdx
0x1806ecefe: xor r8d, r8d
0x1806ecf01: mov rdx, rbx
0x1806ecf04: mov rcx, rax
0x1806ecf07: mov rdi, qword ptr [rsp + 0x30]
0x1806ecf0c: add rsp, 0x20
0x1806ecf10: pop rbx
0x1806ecf11: jmp 0x180ce5de0 ; Torappu.Battle.GameMode.GameModeFactory/LegionGameMode.OnCardRecycle
0x1806ecf16: xor r8d, r8d
0x1806ecf19: mov rdx, rbx
0x1806ecf1c: mov rcx, rax
0x1806ecf1f: mov rdi, qword ptr [rsp + 0x30]
0x1806ecf24: add rsp, 0x20
0x1806ecf28: pop rbx
0x1806ecf29: jmp 0x180c9db00 ; Torappu.Battle.GameMode.GameModeFactory/DefaultGameMode.OnCardRecycle
0x1806ecf2e: mov rdx, qword ptr [rip + 0x845feb3]
0x1806ecf35: mov ecx, 0x48
0x1806ecf3a: mov r9, rbx
0x1806ecf3d: mov r8, rax
0x1806ecf40: mov rdi, qword ptr [rsp + 0x30]
0x1806ecf45: add rsp, 0x20
0x1806ecf49: pop rbx
0x1806ecf4a: jmp 0x180005010
0x1806ecf4f: xor r8d, r8d
0x1806ecf52: mov rdx, rbx
0x1806ecf55: add rsp, 0x20
0x1806ecf59: pop rbx
0x1806ecf5a: jmp 0x1833c9ac0 ; XLua.DelegateBridge.__Gen_Delegate_Imp27
0x1806ecf5f: call 0x18049c3c0
0x1806ecf64: int3
0x1806ecf65: nop dword ptr [rax]
