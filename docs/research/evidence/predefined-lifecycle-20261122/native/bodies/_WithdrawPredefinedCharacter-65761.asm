; Torappu.Battle.BattleController._WithdrawPredefinedCharacter metadata=65761 VA=0x18066d9a0
0x18066d9a0: mov qword ptr [rsp + 8], rbx
0x18066d9a5: push rdi
0x18066d9a6: sub rsp, 0x20
0x18066d9aa: cmp byte ptr [rip + 0x892d6c3], 0
0x18066d9b1: mov rdi, rdx
0x18066d9b4: mov rbx, rcx
0x18066d9b7: jne 0x18066d9d8
0x18066d9b9: lea rcx, [rip + 0x84a2280]
0x18066d9c0: call 0x18049c210
0x18066d9c5: lea rcx, [rip + 0x84b2684]
0x18066d9cc: call 0x18049c210
0x18066d9d1: mov byte ptr [rip + 0x892d69c], 1
0x18066d9d8: mov rax, qword ptr [rip + 0x84a2261]
0x18066d9df: cmp dword ptr [rax + 0xe0], 0
0x18066d9e6: jne 0x18066d9f7
0x18066d9e8: mov rcx, rax
0x18066d9eb: call 0x18049c450
0x18066d9f0: mov rax, qword ptr [rip + 0x84a2249]
0x18066d9f7: mov rax, qword ptr [rax + 0xb8]
0x18066d9fe: mov rcx, qword ptr [rax + 0xb80]
0x18066da05: test rcx, rcx
0x18066da08: jne 0x18066dabc
0x18066da0e: xor edx, edx
0x18066da10: mov rcx, rbx
0x18066da13: call 0x180671d60 ; Torappu.Battle.BattleController.get_map
0x18066da18: test rdi, rdi
0x18066da1b: je 0x18066dad5
0x18066da21: test rax, rax
0x18066da24: je 0x18066dad5
0x18066da2a: mov rdx, qword ptr [rdi + 0x80]
0x18066da31: xor r8d, r8d
0x18066da34: mov rcx, rax
0x18066da37: call 0x1808bcd00 ; Torappu.Battle.Map.get_Item
0x18066da3c: test rax, rax
0x18066da3f: je 0x18066dad5
0x18066da45: xor edx, edx
0x18066da47: mov rcx, rax
0x18066da4a: call 0x1808f3140 ; Torappu.Battle.Tile.GetCharacter
0x18066da4f: mov rcx, qword ptr [rip + 0x84b25fa]
0x18066da56: mov rbx, rax
0x18066da59: cmp dword ptr [rcx + 0xe0], 0
0x18066da60: jne 0x18066da67
0x18066da62: call 0x18049c450
0x18066da67: xor r8d, r8d
0x18066da6a: xor edx, edx
0x18066da6c: mov rcx, rbx
0x18066da6f: call 0x186dcf430 ; UnityEngine.Object.op_Inequality
0x18066da74: test al, al
0x18066da76: je 0x18066daca
0x18066da78: test rbx, rbx
0x18066da7b: je 0x18066dad5
0x18066da7d: xor edx, edx
0x18066da7f: mov rcx, rbx
0x18066da82: call 0x180736530 ; Torappu.Battle.Entity.get_id
0x18066da87: mov rdx, qword ptr [rdi + 0x10]
0x18066da8b: xor r8d, r8d
0x18066da8e: mov rcx, rax
0x18066da91: call 0x186017430 ; System.String.Equals | System.String.op_Equality
0x18066da96: test al, al
0x18066da98: je 0x18066daca
0x18066da9a: xor edx, edx
0x18066da9c: mov rcx, rbx
0x18066da9f: call 0x180ab08e0 ; Torappu.Battle.Character.get_isBuiltPredefined
0x18066daa4: test al, al
0x18066daa6: je 0x18066daca
0x18066daa8: xor edx, edx
0x18066daaa: mov rcx, rbx
0x18066daad: mov rbx, qword ptr [rsp + 0x30]
0x18066dab2: add rsp, 0x20
0x18066dab6: pop rdi
0x18066dab7: jmp 0x1807249f0 ; Torappu.Battle.Entity.FinishWithNoReason
0x18066dabc: xor r9d, r9d
0x18066dabf: mov r8, rdi
0x18066dac2: mov rdx, rbx
0x18066dac5: call 0x18338c7c0 ; XLua.DelegateBridge.__Gen_Delegate_Imp23
0x18066daca: mov rbx, qword ptr [rsp + 0x30]
0x18066dacf: add rsp, 0x20
0x18066dad3: pop rdi
0x18066dad4: ret
0x18066dad5: call 0x18049c3c0
0x18066dada: int3
0x18066dadb: int3
0x18066dadc: int3
0x18066dadd: int3
0x18066dade: int3
0x18066dadf: int3
