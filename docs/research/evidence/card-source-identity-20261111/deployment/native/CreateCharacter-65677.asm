0x18064ba60: mov dword ptr [rsp + 0x18], r8d
0x18064ba65: push rsi
0x18064ba66: push rdi
0x18064ba67: push r12
0x18064ba69: push r14
0x18064ba6b: sub rsp, 0x58
0x18064ba6f: cmp byte ptr [rip + 0x894f5aa], 0
0x18064ba76: mov rdi, r9
0x18064ba79: mov r14d, r8d
0x18064ba7c: mov r12, rdx
0x18064ba7f: mov rsi, rcx
0x18064ba82: jne 0x18064bad3
0x18064ba84: lea rcx, [rip + 0x84c41b5]
0x18064ba8b: call 0x18049c210
0x18064ba90: lea rcx, [rip + 0x85f5339]
0x18064ba97: call 0x18049c210
0x18064ba9c: lea rcx, [rip + 0x84d45ad]
0x18064baa3: call 0x18049c210
0x18064baa8: lea rcx, [rip + 0x8536f01]
0x18064baaf: call 0x18049c210
0x18064bab4: lea rcx, [rip + 0x85a30ed]
0x18064babb: call 0x18049c210
0x18064bac0: lea rcx, [rip + 0x85e6bb1]
0x18064bac7: call 0x18049c210
0x18064bacc: mov byte ptr [rip + 0x894f54d], 1
0x18064bad3: mov rax, qword ptr [rip + 0x84c4166]
0x18064bada: cmp dword ptr [rax + 0xe0], 0
0x18064bae1: jne 0x18064baf2
0x18064bae3: mov rcx, rax
0x18064bae6: call 0x18049c450
0x18064baeb: mov rax, qword ptr [rip + 0x84c414e]
0x18064baf2: mov rax, qword ptr [rax + 0xb8]
0x18064baf9: mov qword ptr [rsp + 0x88], rbp
0x18064bb01: mov rcx, qword ptr [rax + 0x8e0]
0x18064bb08: test rcx, rcx
0x18064bb0b: jne 0x18064be47
0x18064bb11: mov qword ptr [rsp + 0x80], rbx
0x18064bb19: mov qword ptr [rsp + 0x98], r13
0x18064bb21: mov qword ptr [rsp + 0x50], r15
0x18064bb26: test r12, r12
0x18064bb29: je 0x18064be97
0x18064bb2f: xor edx, edx
0x18064bb31: mov rcx, r12
0x18064bb34: call 0x1806f2450 ; Torappu.Battle.Deck/Card.get_data
0x18064bb39: mov rcx, qword ptr [rsi + 0x38]
0x18064bb3d: mov rbp, rax
0x18064bb40: test rcx, rcx
0x18064bb43: je 0x18064be97
0x18064bb49: xor r8d, r8d
0x18064bb4c: mov rdx, rax
0x18064bb4f: call 0x180925b70 ; Torappu.Battle.BattleFactory.CreateCharacter
0x18064bb54: mov rbx, rax
0x18064bb57: test rbp, rbp
0x18064bb5a: je 0x18064be97
0x18064bb60: test rax, rax
0x18064bb63: je 0x18064be97
0x18064bb69: mov edx, dword ptr [rbp + 0x6c]
0x18064bb6c: xor r8d, r8d
0x18064bb6f: mov rcx, rax
0x18064bb72: call 0x180ab2b60 ; Torappu.Battle.Character.set_cardUid
0x18064bb77: mov rcx, qword ptr [rip + 0x84d44d2]
0x18064bb7e: cmp dword ptr [rcx + 0xe0], 0
0x18064bb85: jne 0x18064bb8c
0x18064bb87: call 0x18049c450
0x18064bb8c: xor r8d, r8d
0x18064bb8f: xor edx, edx
0x18064bb91: mov rcx, rbx
0x18064bb94: call 0x186dcf290 ; UnityEngine.Object.op_Equality
0x18064bb99: test al, al
0x18064bb9b: jne 0x18064be14
0x18064bba1: xor edx, edx
0x18064bba3: mov rcx, rsi
0x18064bba6: call 0x1806711a0 ; Torappu.Battle.BattleController.get_isLegionMode
0x18064bbab: movzx r15d, byte ptr [rsp + 0xa0]
0x18064bbb4: test r15b, al
0x18064bbb7: je 0x18064bd2b
0x18064bbbd: xor edx, edx
0x18064bbbf: mov rcx, rsi
0x18064bbc2: call 0x180670490 ; Torappu.Battle.BattleController.get_gameMode
0x18064bbc7: mov r14, rax
0x18064bbca: test rdi, rdi
0x18064bbcd: je 0x18064be97
0x18064bbd3: xor edx, edx
0x18064bbd5: mov rcx, rdi
0x18064bbd8: call 0x1808f3140 ; Torappu.Battle.Tile.GetCharacter
0x18064bbdd: mov rdx, qword ptr [rip + 0x85f51ec]
0x18064bbe4: mov rcx, r14
0x18064bbe7: mov r13, rax
0x18064bbea: call 0x1800057a0
0x18064bbef: test rax, rax
0x18064bbf2: je 0x18064be97
0x18064bbf8: mov rdx, qword ptr [rip + 0x85f51d1]
0x18064bbff: mov rcx, r14
0x18064bc02: call 0x1800057a0
0x18064bc07: mov rcx, rax
0x18064bc0a: xor r9d, r9d
0x18064bc0d: mov r8, r13
0x18064bc10: mov rdx, rbx
0x18064bc13: call 0x180ce7c00 ; Torappu.Battle.GameMode.GameModeFactory/LegionGameMode.ReplaceCharacter
0x18064bc18: test al, al
0x18064bc1a: je 0x18064bd23
0x18064bc20: xor edx, edx
0x18064bc22: mov rcx, rsi
0x18064bc25: call 0x180670490 ; Torappu.Battle.BattleController.get_gameMode
0x18064bc2a: xor edx, edx
0x18064bc2c: mov rcx, rdi
0x18064bc2f: mov r14, rax
0x18064bc32: call 0x1808f3140 ; Torappu.Battle.Tile.GetCharacter
0x18064bc37: mov rdx, qword ptr [rip + 0x85f5192]
0x18064bc3e: mov rcx, r14
0x18064bc41: mov r13, rax
0x18064bc44: call 0x1800057a0
0x18064bc49: test rax, rax
0x18064bc4c: je 0x18064be97
0x18064bc52: mov rdx, qword ptr [rip + 0x85f5177]
0x18064bc59: mov rcx, r14
0x18064bc5c: call 0x1800057a0
0x18064bc61: mov rcx, rax
0x18064bc64: xor r8d, r8d
0x18064bc67: mov rdx, r13
0x18064bc6a: call 0x180ce22c0 ; Torappu.Battle.GameMode.GameModeFactory/LegionGameMode.CheckCharacterNoOverlap
0x18064bc6f: xor r8d, r8d
0x18064bc72: test al, al
0x18064bc74: je 0x18064bd18
0x18064bc7a: xor edx, edx
0x18064bc7c: mov rcx, rsi
0x18064bc7f: call 0x180653380 ; Torappu.Battle.BattleController.GetDeck
0x18064bc84: xor edx, edx
0x18064bc86: mov rcx, rbx
0x18064bc89: mov r14, rax
0x18064bc8c: call 0x180736530 ; Torappu.Battle.Entity.get_id
0x18064bc91: test r14, r14
0x18064bc94: je 0x18064be97
0x18064bc9a: xor r8d, r8d
0x18064bc9d: mov rdx, rax
0x18064bca0: mov rcx, r14
0x18064bca3: call 0x1806f9a70 ; Torappu.Battle.Deck.FindCardById
0x18064bca8: mov r14, rax
0x18064bcab: test rax, rax
0x18064bcae: je 0x18064bd23
0x18064bcb0: xor edx, edx
0x18064bcb2: mov rcx, rsi
0x18064bcb5: call 0x180670490 ; Torappu.Battle.BattleController.get_gameMode
0x18064bcba: mov rdx, qword ptr [rip + 0x85f510f]
0x18064bcc1: mov rcx, rax
0x18064bcc4: mov r13, rax
0x18064bcc7: call 0x1800057a0
0x18064bccc: test rax, rax
0x18064bccf: je 0x18064be97
0x18064bcd5: mov rdx, qword ptr [rip + 0x85f50f4]
0x18064bcdc: mov rcx, r13
0x18064bcdf: call 0x1800057a0
0x18064bce4: mov rcx, rax
0x18064bce7: xor r8d, r8d
0x18064bcea: mov rdx, r14
0x18064bced: call 0x180ce7170 ; Torappu.Battle.GameMode.GameModeFactory/LegionGameMode.PutCardToUsed
0x18064bcf2: xor r8d, r8d
0x18064bcf5: xor edx, edx
0x18064bcf7: mov rcx, rsi
0x18064bcfa: call 0x180653380 ; Torappu.Battle.BattleController.GetDeck
0x18064bcff: test rax, rax
0x18064bd02: je 0x18064be97
0x18064bd08: xor r8d, r8d
0x18064bd0b: mov rdx, r14
0x18064bd0e: mov rcx, rax
0x18064bd11: call 0x1806fa720 ; Torappu.Battle.Deck.OnCardListChanged
0x18064bd16: jmp 0x18064bd23
0x18064bd18: mov rdx, rbx
0x18064bd1b: mov rcx, rdi
0x18064bd1e: call 0x1808f1f40 ; Torappu.Battle.Tile.ClearCharacterIfExistsBeforeReplace
0x18064bd23: mov r14d, dword ptr [rsp + 0x90]
0x18064bd2b: cmp byte ptr [rsp + 0xb8], 0
0x18064bd33: jne 0x18064bd54
0x18064bd35: test rdi, rdi
0x18064bd38: je 0x18064be97
0x18064bd3e: xor r9d, r9d
0x18064bd41: movzx r8d, r15b
0x18064bd45: mov rdx, rbp
0x18064bd48: mov rcx, rdi
0x18064bd4b: call 0x1808f1710 ; Torappu.Battle.Tile.CheckBuildable
0x18064bd50: test al, al
0x18064bd52: je 0x18064bdcb
0x18064bd54: mov rax, qword ptr [rsp + 0xb0]
0x18064bd5c: test rax, rax
0x18064bd5f: je 0x18064be97
0x18064bd65: mov byte ptr [rax + 0x10], 1
0x18064bd69: test rdi, rdi
0x18064bd6c: je 0x18064be97
0x18064bd72: xor ebp, ebp
0x18064bd74: movzx r9d, r15b
0x18064bd78: mov r8d, r14d
0x18064bd7b: mov qword ptr [rsp + 0x20], rbp
0x18064bd80: mov rdx, rbx
0x18064bd83: mov rcx, rdi
0x18064bd86: call 0x1808f5d70 ; Torappu.Battle.Tile.OnEntityWillBuild
0x18064bd8b: test al, al
0x18064bd8d: je 0x18064bdcb
0x18064bd8f: mov r9d, r14d
0x18064bd92: mov qword ptr [rsp + 0x20], rbp
0x18064bd97: mov r8, rdi
0x18064bd9a: mov rdx, r12
0x18064bd9d: mov rcx, rbx
0x18064bda0: call 0x180a9d3a0 ; Torappu.Battle.Character.BuildAt
0x18064bda5: movzx r9d, byte ptr [rsp + 0xa8]
0x18064bdae: movzx r8d, r15b
0x18064bdb2: mov rdx, rbx
0x18064bdb5: mov qword ptr [rsp + 0x20], rbp
0x18064bdba: mov rcx, rdi
0x18064bdbd: call 0x1808f4ef0 ; Torappu.Battle.Tile.LocateCharacter
0x18064bdc2: test al, al
0x18064bdc4: je 0x18064bdcb
0x18064bdc6: mov rax, rbx
0x18064bdc9: jmp 0x18064bdec
0x18064bdcb: mov rcx, qword ptr [rip + 0x8536bde]
0x18064bdd2: cmp dword ptr [rcx + 0xe0], 0
0x18064bdd9: jne 0x18064bde0
0x18064bddb: call 0x18049c450
0x18064bde0: xor edx, edx
0x18064bde2: mov rcx, rbx
0x18064bde5: call 0x182ac0360 ; Torappu.ObjectPool.PoolManager.Recycle
0x18064bdea: xor eax, eax
0x18064bdec: mov r13, qword ptr [rsp + 0x98]
0x18064bdf4: mov rbx, qword ptr [rsp + 0x80]
0x18064bdfc: mov r15, qword ptr [rsp + 0x50]
0x18064be01: mov rbp, qword ptr [rsp + 0x88]
0x18064be09: add rsp, 0x58
0x18064be0d: pop r14
0x18064be0f: pop r12
0x18064be11: pop rdi
0x18064be12: pop rsi
0x18064be13: ret
0x18064be14: mov rcx, qword ptr [rip + 0x85a2d8d]
0x18064be1b: cmp dword ptr [rcx + 0xe0], 0
0x18064be22: jne 0x18064be29
0x18064be24: call 0x18049c450
0x18064be29: xor ecx, ecx
0x18064be2b: call 0x181cfc8a0 ; Torappu.StringRes.get_ALERT_BATTLE_RES_CORRUPTED_ERROR
0x18064be30: mov r8, qword ptr [rip + 0x85e6841]
0x18064be37: xor r9d, r9d
0x18064be3a: mov rdx, rax
0x18064be3d: mov rcx, rsi
0x18064be40: call 0x1806516d0 ; Torappu.Battle.BattleController.CriticalAlertAndForceExit
0x18064be45: jmp 0x18064bdea
0x18064be47: movzx eax, byte ptr [rsp + 0xb8]
0x18064be4f: xor ebp, ebp
0x18064be51: mov qword ptr [rsp + 0x48], rbp
0x18064be56: mov r9d, r14d
0x18064be59: mov byte ptr [rsp + 0x40], al
0x18064be5d: mov r8, r12
0x18064be60: mov rax, qword ptr [rsp + 0xb0]
0x18064be68: mov rdx, rsi
0x18064be6b: mov qword ptr [rsp + 0x38], rax
0x18064be70: movzx eax, byte ptr [rsp + 0xa8]
0x18064be78: mov byte ptr [rsp + 0x30], al
0x18064be7c: movzx eax, byte ptr [rsp + 0xa0]
0x18064be84: mov byte ptr [rsp + 0x28], al
0x18064be88: mov qword ptr [rsp + 0x20], rdi
0x18064be8d: call 0x1833db190 ; XLua.DelegateBridge.__Gen_Delegate_Imp2909
0x18064be92: jmp 0x18064be01
0x18064be97: call 0x18049c3c0
0x18064be9c: int3
0x18064be9d: int3
0x18064be9e: int3
0x18064be9f: int3
