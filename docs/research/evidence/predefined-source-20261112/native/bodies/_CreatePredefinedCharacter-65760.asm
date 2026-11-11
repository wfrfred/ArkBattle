0x180664c70: mov qword ptr [rsp + 8], rcx
0x180664c75: push rbp
0x180664c76: push rsi
0x180664c77: push rdi
0x180664c78: push r13
0x180664c7a: sub rsp, 0x48
0x180664c7e: cmp byte ptr [rip + 0x89363ee], 0
0x180664c85: mov rsi, r9
0x180664c88: movzx edi, r8b
0x180664c8c: mov r13, rdx
0x180664c8f: mov rbp, rcx
0x180664c92: jne 0x180664cd7
0x180664c94: lea rcx, [rip + 0x84aafa5]
0x180664c9b: call 0x18049c210
0x180664ca0: lea rcx, [rip + 0x84b2b89]
0x180664ca7: call 0x18049c210
0x180664cac: lea rcx, [rip + 0x851dcfd]
0x180664cb3: call 0x18049c210
0x180664cb8: lea rcx, [rip + 0x855e2c9]
0x180664cbf: call 0x18049c210
0x180664cc4: lea rcx, [rip + 0x8593acd]
0x180664ccb: call 0x18049c210
0x180664cd0: mov byte ptr [rip + 0x893639c], 1
0x180664cd7: mov rax, qword ptr [rip + 0x84aaf62]
0x180664cde: cmp dword ptr [rax + 0xe0], 0
0x180664ce5: jne 0x180664cf6
0x180664ce7: mov rcx, rax
0x180664cea: call 0x18049c450
0x180664cef: mov rax, qword ptr [rip + 0x84aaf4a]
0x180664cf6: mov rax, qword ptr [rax + 0xb8]
0x180664cfd: mov qword ptr [rsp + 0x78], rbx
0x180664d02: mov rcx, qword ptr [rax + 0xb78]
0x180664d09: xor ebx, ebx
0x180664d0b: mov qword ptr [rsp + 0x28], rbx
0x180664d10: test rcx, rcx
0x180664d13: jne 0x1806651db
0x180664d19: xor r9d, r9d
0x180664d1c: mov qword ptr [rsp + 0x20], rbx
0x180664d21: xor r8d, r8d
0x180664d24: movzx edx, dil
0x180664d28: mov rcx, r13
0x180664d2b: call 0x180b09e40 ; Torappu.Battle.BattleDataConverter.ConvertToCharacterData
0x180664d30: xor r9d, r9d
0x180664d33: mov qword ptr [rsp + 0x30], rax
0x180664d38: lea r8, [rsp + 0x30]
0x180664d3d: movzx edx, dil
0x180664d41: mov rcx, r13
0x180664d44: call 0x180b0ab20 ; Torappu.Battle.BattleDataConverter.OverrideMainSkillBlackboardIfExist
0x180664d49: xor r8d, r8d
0x180664d4c: lea rdx, [rsp + 0x30]
0x180664d51: mov rcx, r13
0x180664d54: call 0x180b0ac00 ; Torappu.Battle.BattleDataConverter.OverrideTalentBlackboardIfExist
0x180664d59: mov rdx, qword ptr [rsp + 0x30]
0x180664d5e: mov r9, rsi
0x180664d61: movzx r8d, dil
0x180664d65: mov qword ptr [rsp + 0x20], rbx
0x180664d6a: mov rcx, rbp
0x180664d6d: call 0x18066c050 ; Torappu.Battle.BattleController._PreprocessPredefinedCharacter
0x180664d72: cmp byte ptr [rsi], bl
0x180664d74: jne 0x1806651ca
0x180664d7a: mov qword ptr [rsp + 0x80], r12
0x180664d82: mov qword ptr [rsp + 0x88], r14
0x180664d8a: mov qword ptr [rsp + 0x40], r15
0x180664d8f: mov rcx, qword ptr [rbp + 0x38]
0x180664d93: test dil, dil
0x180664d96: je 0x180664db0
0x180664d98: test rcx, rcx
0x180664d9b: je 0x180665204
0x180664da1: mov rdx, qword ptr [rsp + 0x30]
0x180664da6: xor r8d, r8d
0x180664da9: call 0x180926d50 ; Torappu.Battle.BattleFactory.CreateToken
0x180664dae: jmp 0x180664dc6
0x180664db0: test rcx, rcx
0x180664db3: je 0x180665204
0x180664db9: mov rdx, qword ptr [rsp + 0x30]
0x180664dbe: xor r8d, r8d
0x180664dc1: call 0x180925b70 ; Torappu.Battle.BattleFactory.CreateCharacter
0x180664dc6: mov r12, rax
0x180664dc9: mov rcx, qword ptr [rsp + 0x30]
0x180664dce: test rcx, rcx
0x180664dd1: je 0x180665204
0x180664dd7: mov rcx, qword ptr [rcx + 0x98]
0x180664dde: xor edx, edx
0x180664de0: call 0x18601a180 ; System.String.IsNullOrEmpty
0x180664de5: test al, al
0x180664de7: jne 0x18066500c
0x180664ded: test r13, r13
0x180664df0: je 0x180665204
0x180664df6: cmp byte ptr [rip + 0x8973c74], bl
0x180664dfc: jbe 0x180664e07
0x180664dfe: mov rcx, qword ptr [r13]
0x180664e02: call 0x180457010
0x180664e07: mov rdx, qword ptr [r13]
0x180664e0b: mov rcx, r13
0x180664e0e: mov rax, qword ptr [rdx + 0x1b0]
0x180664e15: mov rdx, qword ptr [rdx + 0x1b8]
0x180664e1c: call rax
0x180664e1e: xor edx, edx
0x180664e20: mov qword ptr [rsp + 0x38], rax
0x180664e25: mov rcx, rbp
0x180664e28: mov rdi, rax
0x180664e2b: call 0x180670ae0 ; Torappu.Battle.BattleController.get_isCooperateMode
0x180664e30: test al, al
0x180664e32: jne 0x180664e42
0x180664e34: xor edx, edx
0x180664e36: mov rcx, rbp
0x180664e39: call 0x1806715d0 ; Torappu.Battle.BattleController.get_isPvpOrSeperateMode
0x180664e3e: test al, al
0x180664e40: je 0x180664e75
0x180664e42: mov rcx, qword ptr [rip + 0x859394f]
0x180664e49: xor r8d, r8d
0x180664e4c: mov rdx, rdi
0x180664e4f: call 0x1860148b0 ; System.String.Concat
0x180664e54: mov rcx, qword ptr [rip + 0x84b29d5]
0x180664e5b: mov rdi, rax
0x180664e5e: cmp dword ptr [rcx + 0xe0], ebx
0x180664e64: jne 0x180664e6b
0x180664e66: call 0x18049c450
0x180664e6b: xor edx, edx
0x180664e6d: mov rcx, rdi
0x180664e70: call 0x18693dab0 ; UnityEngine.DLog.LogError
0x180664e75: xor r8d, r8d
0x180664e78: xor edx, edx
0x180664e7a: mov rcx, rbp
0x180664e7d: call 0x180653380 ; Torappu.Battle.BattleController.GetDeck
0x180664e82: test rax, rax
0x180664e85: je 0x180665204
0x180664e8b: xor edx, edx
0x180664e8d: mov rcx, rax
0x180664e90: call 0x1806ff3c0 ; Torappu.Battle.Deck.get_cards
0x180664e95: mov r15, rax
0x180664e98: mov ebp, ebx
0x180664e9a: mov ecx, ebx
0x180664e9c: test rax, rax
0x180664e9f: je 0x180665204
0x180664ea5: lea r14, [rax + 0x20]
0x180664ea9: nop dword ptr [rax]
0x180664eb0: cmp ecx, dword ptr [r15 + 0x18]
0x180664eb4: jge 0x180665007
0x180664eba: cmp ebp, dword ptr [r15 + 0x18]
0x180664ebe: jae 0x1806651fe
0x180664ec4: mov rsi, qword ptr [r14]
0x180664ec7: mov rdx, qword ptr [rip + 0x855e0ba]
0x180664ece: test rsi, rsi
0x180664ed1: je 0x180664f5d
0x180664ed7: cmp byte ptr [rip + 0x8973b93], bl
0x180664edd: mov r8, qword ptr [rsi]
0x180664ee0: jbe 0x180664eee
0x180664ee2: mov rcx, r8
0x180664ee5: call 0x1804566f0
0x180664eea: test al, al
0x180664eec: jmp 0x180664f18
0x180664eee: movzx eax, byte ptr [rdx + 0x130]
0x180664ef5: cmp byte ptr [r8 + 0x130], al
0x180664efc: jb 0x180664f14
0x180664efe: movzx ecx, al
0x180664f01: mov rax, qword ptr [r8 + 0xc8]
0x180664f08: cmp qword ptr [rax + rcx*8 - 8], rdx
0x180664f0d: mov eax, 1
0x180664f12: je 0x180664f16
0x180664f14: mov eax, ebx
0x180664f16: test eax, eax
0x180664f18: mov rdi, rbx
0x180664f1b: cmovne rdi, rsi
0x180664f1f: test rdi, rdi
0x180664f22: je 0x180664f5d
0x180664f24: xor edx, edx
0x180664f26: mov rcx, rdi
0x180664f29: call 0x1806f2d90 ; Torappu.Battle.Deck/Card.get_isPredefined
0x180664f2e: test al, al
0x180664f30: je 0x180664f5d
0x180664f32: xor edx, edx
0x180664f34: mov rcx, rdi
0x180664f37: call 0x1806f2450 ; Torappu.Battle.Deck/Card.get_data
0x180664f3c: test rax, rax
0x180664f3f: je 0x180665204
0x180664f45: mov rdx, qword ptr [rsp + 0x38]
0x180664f4a: xor r8d, r8d
0x180664f4d: mov rcx, qword ptr [rax + 0x98]
0x180664f54: call 0x186017430 ; System.String.Equals | System.String.op_Equality
0x180664f59: test al, al
0x180664f5b: jne 0x180664f6a
0x180664f5d: inc ebp
0x180664f5f: add r14, 8
0x180664f63: mov ecx, ebp
0x180664f65: jmp 0x180664eb0
0x180664f6a: xor edx, edx
0x180664f6c: mov rcx, rdi
0x180664f6f: call 0x1806f2450 ; Torappu.Battle.Deck/Card.get_data
0x180664f74: mov rcx, qword ptr [rsp + 0x30]
0x180664f79: test rcx, rcx
0x180664f7c: je 0x180665204
0x180664f82: mov rdx, qword ptr [rcx + 0x10]
0x180664f86: test rax, rax
0x180664f89: je 0x180665204
0x180664f8f: lea rcx, [rax + 0x98]
0x180664f96: mov qword ptr [rax + 0x98], rdx
0x180664f9d: call 0x18049bcf0
0x180664fa2: xor edx, edx
0x180664fa4: mov rcx, rdi
0x180664fa7: call 0x1806f2450 ; Torappu.Battle.Deck/Card.get_data
0x180664fac: mov rdx, qword ptr [rsp + 0x30]
0x180664fb1: test rdx, rdx
0x180664fb4: je 0x180665204
0x180664fba: test rax, rax
0x180664fbd: je 0x180665204
0x180664fc3: mov edx, dword ptr [rdx + 0x6c]
0x180664fc6: mov rcx, rdi
0x180664fc9: mov dword ptr [rax + 0xa0], edx
0x180664fcf: xor edx, edx
0x180664fd1: mov rsi, qword ptr [rsp + 0x30]
0x180664fd6: call 0x1806f2450 ; Torappu.Battle.Deck/Card.get_data
0x180664fdb: test rax, rax
0x180664fde: je 0x180665204
0x180664fe4: test rsi, rsi
0x180664fe7: je 0x180665204
0x180664fed: mov eax, dword ptr [rax + 0x6c]
0x180664ff0: xor edx, edx
0x180664ff2: mov rbp, qword ptr [rsp + 0x70]
0x180664ff7: mov rcx, rbp
0x180664ffa: mov dword ptr [rsi + 0xa0], eax
0x180665000: call 0x180671d60 ; Torappu.Battle.BattleController.get_map
0x180665005: jmp 0x18066501f
0x180665007: mov rbp, qword ptr [rsp + 0x70]
0x18066500c: xor edx, edx
0x18066500e: mov rcx, rbp
0x180665011: call 0x180671d60 ; Torappu.Battle.BattleController.get_map
0x180665016: test r13, r13
0x180665019: je 0x180665204
0x18066501f: test rax, rax
0x180665022: je 0x180665204
0x180665028: mov rdx, qword ptr [r13 + 0x80]
0x18066502f: xor r8d, r8d
0x180665032: mov rcx, rax
0x180665035: call 0x1808bcd00 ; Torappu.Battle.Map.get_Item
0x18066503a: mov rdi, rax
0x18066503d: test rax, rax
0x180665040: je 0x180665204
0x180665046: xor edx, edx
0x180665048: mov rcx, rax
0x18066504b: call 0x1808f2040 ; Torappu.Battle.Tile.ClearCharacterIfExists
0x180665050: test r12, r12
0x180665053: je 0x180665204
0x180665059: mov r9d, dword ptr [r13 + 0x88]
0x180665060: mov r8, rdi
0x180665063: mov rdx, qword ptr [rsp + 0x30]
0x180665068: mov rcx, r12
0x18066506b: mov qword ptr [rsp + 0x20], rbx
0x180665070: call 0x180a9ceb0 ; Torappu.Battle.Character.BuildAsPredefined
0x180665075: xor r9d, r9d
0x180665078: mov qword ptr [rsp + 0x20], rbx
0x18066507d: xor r8d, r8d
0x180665080: mov rdx, r12
0x180665083: mov rcx, rdi
0x180665086: call 0x1808f4ef0 ; Torappu.Battle.Tile.LocateCharacter
0x18066508b: test al, al
0x18066508d: jne 0x1806650d3
0x18066508f: mov rcx, qword ptr [rip + 0x851d91a]
0x180665096: cmp dword ptr [rcx + 0xe0], ebx
0x18066509c: jne 0x1806650a3
0x18066509e: call 0x18049c450
0x1806650a3: xor edx, edx
0x1806650a5: mov rcx, r12
0x1806650a8: call 0x182ac0360 ; Torappu.ObjectPool.PoolManager.Recycle
0x1806650ad: xor eax, eax
0x1806650af: mov r14, qword ptr [rsp + 0x88]
0x1806650b7: mov r12, qword ptr [rsp + 0x80]
0x1806650bf: mov r15, qword ptr [rsp + 0x40]
0x1806650c4: mov rbx, qword ptr [rsp + 0x78]
0x1806650c9: add rsp, 0x48
0x1806650cd: pop r13
0x1806650cf: pop rdi
0x1806650d0: pop rsi
0x1806650d1: pop rbp
0x1806650d2: ret
0x1806650d3: xor edx, edx
0x1806650d5: mov rcx, rbp
0x1806650d8: call 0x180670490 ; Torappu.Battle.BattleController.get_gameMode
0x1806650dd: mov rdi, rax
0x1806650e0: test rax, rax
0x1806650e3: je 0x180665204
0x1806650e9: mov rax, qword ptr [rax]
0x1806650ec: mov ecx, dword ptr [rax + 0x11c]
0x1806650f2: add ecx, 0xfffff625
0x1806650f8: cmp ecx, 0x1a
0x1806650fb: ja 0x180665144
0x1806650fd: movsxd rax, ecx
0x180665100: lea rdx, [rip - 0x665107]
0x180665107: movzx eax, byte ptr [rdx + rax + 0x665214]
0x18066510f: mov ecx, dword ptr [rdx + rax*4 + 0x66520c]
0x180665116: add rcx, rdx
0x180665119: jmp rcx
0x18066511b: xor r8d, r8d
0x18066511e: mov rdx, r12
0x180665121: mov rcx, rdi
0x180665124: call 0x180d02180 ; Torappu.Battle.GameMode.GameModeFactory/SandboxV3GameMode.OnPredefinedCharacterLocated
0x180665129: mov rax, r12
0x18066512c: jmp 0x1806650af
0x18066512e: xor r8d, r8d
0x180665131: mov rdx, r12
0x180665134: mov rcx, rdi
0x180665137: call 0x180c9e400 ; Torappu.Battle.GameMode.GameModeFactory/DefaultGameMode.OnPredefinedCharacterLocated
0x18066513c: mov rax, r12
0x18066513f: jmp 0x1806650af
0x180665144: cmp byte ptr [rip + 0x8973926], bl
0x18066514a: mov rsi, qword ptr [rip + 0x84e7c97]
0x180665151: mov rbp, qword ptr [rdi]
0x180665154: je 0x18066515e
0x180665156: mov rcx, rbp
0x180665159: call 0x180457010
0x18066515e: movzx ecx, word ptr [rbp + 0x12e]
0x180665165: cmp bx, cx
0x180665168: jae 0x180665185
0x18066516a: mov rdx, qword ptr [rbp + 0xb0]
0x180665171: movzx eax, bx
0x180665174: add rax, rax
0x180665177: cmp qword ptr [rdx + rax*8], rsi
0x18066517b: je 0x1806651ae
0x18066517d: inc bx
0x180665180: cmp bx, cx
0x180665183: jb 0x180665171
0x180665185: mov r8d, 0x71
0x18066518b: mov rdx, rsi
0x18066518e: mov rcx, rdi
0x180665191: call 0x180455fd0
0x180665196: mov r9, qword ptr [rax]
0x180665199: mov rdx, r12
0x18066519c: mov r8, qword ptr [rax + 8]
0x1806651a0: mov rcx, rdi
0x1806651a3: call r9
0x1806651a6: mov rax, r12
0x1806651a9: jmp 0x1806650af
0x1806651ae: movzx ecx, bx
0x1806651b1: add rcx, rcx
0x1806651b4: mov eax, dword ptr [rdx + rcx*8 + 8]
0x1806651b8: add eax, 0x71
0x1806651bb: cdqe
0x1806651bd: add rax, 0x14
0x1806651c1: shl rax, 4
0x1806651c5: add rax, rbp
0x1806651c8: jmp 0x180665196
0x1806651ca: xor eax, eax
0x1806651cc: mov rbx, qword ptr [rsp + 0x78]
0x1806651d1: add rsp, 0x48
0x1806651d5: pop r13
0x1806651d7: pop rdi
0x1806651d8: pop rsi
0x1806651d9: pop rbp
0x1806651da: ret
0x1806651db: movzx r9d, dil
0x1806651df: mov qword ptr [rsp + 0x20], rsi
0x1806651e4: mov r8, r13
0x1806651e7: mov rdx, rbp
0x1806651ea: call 0x1833e1630 ; XLua.DelegateBridge.__Gen_Delegate_Imp2944
0x1806651ef: mov rbx, qword ptr [rsp + 0x78]
0x1806651f4: add rsp, 0x48
0x1806651f8: pop r13
0x1806651fa: pop rdi
0x1806651fb: pop rsi
0x1806651fc: pop rbp
0x1806651fd: ret
0x1806651fe: call 0x18049c3b0
0x180665203: int3
0x180665204: call 0x18049c3c0
0x180665209: int3
0x18066520a: nop
