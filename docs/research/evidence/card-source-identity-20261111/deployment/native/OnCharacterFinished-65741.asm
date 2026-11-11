0x180658ea0: mov qword ptr [rsp + 8], rbx
0x180658ea5: mov qword ptr [rsp + 0x10], rsi
0x180658eaa: push rdi
0x180658eab: sub rsp, 0x30
0x180658eaf: cmp byte ptr [rip + 0x89421aa], 0
0x180658eb6: mov esi, r8d
0x180658eb9: mov rbx, rdx
0x180658ebc: mov rdi, rcx
0x180658ebf: jne 0x180658ee0
0x180658ec1: lea rcx, [rip + 0x84b6d78]
0x180658ec8: call 0x18049c210
0x180658ecd: lea rcx, [rip + 0x84c717c]
0x180658ed4: call 0x18049c210
0x180658ed9: mov byte ptr [rip + 0x8942180], 1
0x180658ee0: mov rax, qword ptr [rip + 0x84b6d59]
0x180658ee7: cmp dword ptr [rax + 0xe0], 0
0x180658eee: jne 0x180658eff
0x180658ef0: mov rcx, rax
0x180658ef3: call 0x18049c450
0x180658ef8: mov rax, qword ptr [rip + 0x84b6d41]
0x180658eff: mov rax, qword ptr [rax + 0xb8]
0x180658f06: mov rcx, qword ptr [rax + 0xae0]
0x180658f0d: test rcx, rcx
0x180658f10: jne 0x180659034
0x180658f16: xor edx, edx
0x180658f18: mov rcx, rdi
0x180658f1b: call 0x180670490 ; Torappu.Battle.BattleController.get_gameMode
0x180658f20: test rax, rax
0x180658f23: je 0x180658f49
0x180658f25: xor edx, edx
0x180658f27: mov rcx, rdi
0x180658f2a: call 0x180670490 ; Torappu.Battle.BattleController.get_gameMode
0x180658f2f: test rax, rax
0x180658f32: je 0x18065905b
0x180658f38: xor r9d, r9d
0x180658f3b: mov r8d, esi
0x180658f3e: mov rdx, rbx
0x180658f41: mov rcx, rax
0x180658f44: call 0x180647920
0x180658f49: xor r8d, r8d
0x180658f4c: mov rdx, rbx
0x180658f4f: mov rcx, rdi
0x180658f52: call 0x180653290 ; Torappu.Battle.BattleController.GetDeck
0x180658f57: mov rcx, qword ptr [rip + 0x84c70f2]
0x180658f5e: mov rdi, rax
0x180658f61: cmp dword ptr [rcx + 0xe0], 0
0x180658f68: jne 0x180658f6f
0x180658f6a: call 0x18049c450
0x180658f6f: xor r8d, r8d
0x180658f72: xor edx, edx
0x180658f74: mov rcx, rbx
0x180658f77: call 0x186dcf430 ; UnityEngine.Object.op_Inequality
0x180658f7c: test al, al
0x180658f7e: je 0x18065904b
0x180658f84: test rdi, rdi
0x180658f87: je 0x18065904b
0x180658f8d: lea eax, [rsi - 0xa]
0x180658f90: cmp eax, 1
0x180658f93: jbe 0x18065904b
0x180658f99: test rbx, rbx
0x180658f9c: je 0x18065905b
0x180658fa2: xor edx, edx
0x180658fa4: mov rcx, rbx
0x180658fa7: call 0x180aaf750 ; Torappu.Battle.Character.get_cardUid
0x180658fac: xor r8d, r8d
0x180658faf: mov edx, eax
0x180658fb1: mov rcx, rdi
0x180658fb4: call 0x1806fbed0 ; Torappu.Battle.Deck.RecycleCard
0x180658fb9: xor edx, edx
0x180658fbb: mov rcx, rbx
0x180658fbe: call 0x180aaf970 ; Torappu.Battle.Character.get_data
0x180658fc3: test rax, rax
0x180658fc6: je 0x18065905b
0x180658fcc: cmp byte ptr [rax + 0x91], 0
0x180658fd3: je 0x18065904b
0x180658fd5: xor edx, edx
0x180658fd7: mov rcx, rbx
0x180658fda: call 0x180aaf970 ; Torappu.Battle.Character.get_data
0x180658fdf: test rax, rax
0x180658fe2: je 0x18065905b
0x180658fe4: cmp byte ptr [rax + 0x90], 0
0x180658feb: jne 0x18065904b
0x180658fed: xor edx, edx
0x180658fef: mov rcx, rbx
0x180658ff2: call 0x180aaf970 ; Torappu.Battle.Character.get_data
0x180658ff7: test rax, rax
0x180658ffa: je 0x18065905b
0x180658ffc: cmp dword ptr [rax + 0xa0], 0
0x180659003: jbe 0x18065904b
0x180659005: xor edx, edx
0x180659007: mov rcx, rbx
0x18065900a: call 0x180aaf970 ; Torappu.Battle.Character.get_data
0x18065900f: test rax, rax
0x180659012: je 0x18065905b
0x180659014: mov edx, dword ptr [rax + 0xa0]
0x18065901a: xor r8d, r8d
0x18065901d: mov rcx, rdi
0x180659020: mov rbx, qword ptr [rsp + 0x40]
0x180659025: mov rsi, qword ptr [rsp + 0x48]
0x18065902a: add rsp, 0x30
0x18065902e: pop rdi
0x18065902f: jmp 0x1806fc320 ; Torappu.Battle.Deck.RecycleTokenCard
0x180659034: mov r9d, esi
0x180659037: mov qword ptr [rsp + 0x20], 0
0x180659040: mov r8, rbx
0x180659043: mov rdx, rdi
0x180659046: call 0x1833e1450 ; XLua.DelegateBridge.__Gen_Delegate_Imp2943
0x18065904b: mov rbx, qword ptr [rsp + 0x40]
0x180659050: mov rsi, qword ptr [rsp + 0x48]
0x180659055: add rsp, 0x30
0x180659059: pop rdi
0x18065905a: ret
0x18065905b: call 0x18049c3c0
0x180659060: int3
0x180659061: int3
0x180659062: int3
0x180659063: int3
0x180659064: int3
0x180659065: int3
0x180659066: int3
0x180659067: int3
0x180659068: int3
0x180659069: int3
0x18065906a: int3
0x18065906b: int3
0x18065906c: int3
0x18065906d: int3
0x18065906e: int3
0x18065906f: int3
