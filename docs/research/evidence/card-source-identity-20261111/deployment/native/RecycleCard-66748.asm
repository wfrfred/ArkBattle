0x1806fbed0: mov qword ptr [rsp + 0x10], rbx
0x1806fbed5: mov qword ptr [rsp + 0x18], rbp
0x1806fbeda: push rdi
0x1806fbedb: sub rsp, 0x40
0x1806fbedf: cmp byte ptr [rip + 0x889f649], 0
0x1806fbee6: mov ebx, edx
0x1806fbee8: mov rdi, rcx
0x1806fbeeb: jne 0x1806fbf0c
0x1806fbeed: lea rcx, [rip + 0x842f88c]
0x1806fbef4: call 0x18049c210
0x1806fbef9: lea rcx, [rip + 0x849ac88]
0x1806fbf00: call 0x18049c210
0x1806fbf05: mov byte ptr [rip + 0x889f623], 1
0x1806fbf0c: mov rax, qword ptr [rip + 0x842f86d]
0x1806fbf13: xor ebp, ebp
0x1806fbf15: mov qword ptr [rsp + 0x30], rbp
0x1806fbf1a: mov qword ptr [rsp + 0x68], rbp
0x1806fbf1f: mov rcx, qword ptr [rax + 0xb8]
0x1806fbf26: mov rcx, qword ptr [rcx + 0xd8]
0x1806fbf2d: test rcx, rcx
0x1806fbf30: jne 0x1806fc2b9
0x1806fbf36: mov qword ptr [rsp + 0x50], rsi
0x1806fbf3b: mov rcx, qword ptr [rdi + 0x40]
0x1806fbf3f: test rcx, rcx
0x1806fbf42: je 0x1806fc2d7
0x1806fbf48: mov r9, qword ptr [rip + 0x849ac39]
0x1806fbf4f: lea r8, [rsp + 0x30]
0x1806fbf54: mov edx, ebx
0x1806fbf56: call 0x185be68b0
0x1806fbf5b: test al, al
0x1806fbf5d: je 0x1806fc294
0x1806fbf63: mov rbx, qword ptr [rsp + 0x30]
0x1806fbf68: test rbx, rbx
0x1806fbf6b: je 0x1806fc2d7
0x1806fbf71: cmp byte ptr [rip + 0x88dcaf8], bpl
0x1806fbf78: jbe 0x1806fbf82
0x1806fbf7a: mov rcx, qword ptr [rbx]
0x1806fbf7d: call 0x180457010
0x1806fbf82: mov rdx, qword ptr [rbx]
0x1806fbf85: mov rcx, rbx
0x1806fbf88: mov rax, qword ptr [rdx + 0x2d0]
0x1806fbf8f: mov rdx, qword ptr [rdx + 0x2d8]
0x1806fbf96: call rax
0x1806fbf98: cmp byte ptr [rip + 0x889f5a5], bpl
0x1806fbf9f: mov rbx, qword ptr [rsp + 0x30]
0x1806fbfa4: jne 0x1806fbfd1
0x1806fbfa6: lea rcx, [rip + 0x84c5fc3]
0x1806fbfad: call 0x18049c210
0x1806fbfb2: lea rcx, [rip + 0x842f7c7]
0x1806fbfb9: call 0x18049c210
0x1806fbfbe: lea rcx, [rip + 0x849b4f3]
0x1806fbfc5: call 0x18049c210
0x1806fbfca: mov byte ptr [rip + 0x889f573], 1
0x1806fbfd1: mov rax, qword ptr [rip + 0x842f7a8]
0x1806fbfd8: mov rcx, qword ptr [rax + 0xb8]
0x1806fbfdf: mov rcx, qword ptr [rcx + 0x180]
0x1806fbfe6: test rcx, rcx
0x1806fbfe9: jne 0x1806fc0fa
0x1806fbfef: mov rdx, qword ptr [rip + 0x84c5f7a]
0x1806fbff6: test rbx, rbx
0x1806fbff9: je 0x1806fc0e7
0x1806fbfff: cmp byte ptr [rip + 0x88dca6a], bpl
0x1806fc006: mov r8, qword ptr [rbx]
0x1806fc009: jbe 0x1806fc017
0x1806fc00b: mov rcx, r8
0x1806fc00e: call 0x1804566f0
0x1806fc013: test al, al
0x1806fc015: jmp 0x1806fc041
0x1806fc017: movzx eax, byte ptr [rdx + 0x130]
0x1806fc01e: cmp byte ptr [r8 + 0x130], al
0x1806fc025: jb 0x1806fc03d
0x1806fc027: movzx ecx, al
0x1806fc02a: mov rax, qword ptr [r8 + 0xc8]
0x1806fc031: cmp qword ptr [rax + rcx*8 - 8], rdx
0x1806fc036: mov eax, 1
0x1806fc03b: je 0x1806fc03f
0x1806fc03d: mov eax, ebp
0x1806fc03f: test eax, eax
0x1806fc041: mov rcx, rbp
0x1806fc044: cmovne rcx, rbx
0x1806fc048: test rcx, rcx
0x1806fc04b: je 0x1806fc0e7
0x1806fc051: cmp byte ptr [rip + 0x889f51b], bpl
0x1806fc058: jne 0x1806fc06d
0x1806fc05a: lea rcx, [rip + 0x84c5cc7]
0x1806fc061: call 0x18049c210
0x1806fc066: mov byte ptr [rip + 0x889f506], 1
0x1806fc06d: mov rax, qword ptr [rip + 0x84c5cb4]
0x1806fc074: mov rcx, qword ptr [rax + 0xb8]
0x1806fc07b: mov rcx, qword ptr [rcx + 0xa0]
0x1806fc082: test rcx, rcx
0x1806fc085: jne 0x1806fc08d
0x1806fc087: mov rax, qword ptr [rbx + 0x20]
0x1806fc08b: jmp 0x1806fc098
0x1806fc08d: xor r8d, r8d
0x1806fc090: mov rdx, rbx
0x1806fc093: call 0x183460590 ; XLua.DelegateBridge.__Gen_Delegate_Imp3755
0x1806fc098: test rax, rax
0x1806fc09b: je 0x1806fc2d7
0x1806fc0a1: cmp dword ptr [rax + 0xa0], ebp
0x1806fc0a7: jbe 0x1806fc0e7
0x1806fc0a9: mov rsi, qword ptr [rdi + 0x48]
0x1806fc0ad: xor edx, edx
0x1806fc0af: mov rcx, rbx
0x1806fc0b2: call 0x1806f2450 ; Torappu.Battle.Deck/Card.get_data
0x1806fc0b7: test rax, rax
0x1806fc0ba: je 0x1806fc2d7
0x1806fc0c0: test rsi, rsi
0x1806fc0c3: je 0x1806fc2d7
0x1806fc0c9: mov r9, qword ptr [rip + 0x849b3e8]
0x1806fc0d0: lea r8, [rsp + 0x68]
0x1806fc0d5: mov edx, dword ptr [rax + 0xa0]
0x1806fc0db: mov rcx, rsi
0x1806fc0de: call 0x185be68b0
0x1806fc0e3: test al, al
0x1806fc0e5: jne 0x1806fc113
0x1806fc0e7: xor edx, edx
0x1806fc0e9: mov qword ptr [rsp + 0x68], rbp
0x1806fc0ee: lea rcx, [rsp + 0x68]
0x1806fc0f3: call 0x18049bcf0
0x1806fc0f8: jmp 0x1806fc128
0x1806fc0fa: lea r9, [rsp + 0x68]
0x1806fc0ff: mov qword ptr [rsp + 0x20], rbp
0x1806fc104: mov r8, rbx
0x1806fc107: mov rdx, rdi
0x1806fc10a: call 0x1833f3810 ; XLua.DelegateBridge.__Gen_Delegate_Imp3064
0x1806fc10f: test al, al
0x1806fc111: je 0x1806fc128
0x1806fc113: mov rcx, qword ptr [rsp + 0x68]
0x1806fc118: test rcx, rcx
0x1806fc11b: je 0x1806fc2d7
0x1806fc121: xor edx, edx
0x1806fc123: call 0x18071d240 ; Torappu.Battle.Deck/TokenCard.OnHostRecycled
0x1806fc128: cmp byte ptr [rip + 0x889f417], bpl
0x1806fc12f: mov rbx, qword ptr [rsp + 0x30]
0x1806fc134: jne 0x1806fc155
0x1806fc136: lea rcx, [rip + 0x842f643]
0x1806fc13d: call 0x18049c210
0x1806fc142: lea rcx, [rip + 0x84b5a17]
0x1806fc149: call 0x18049c210
0x1806fc14e: mov byte ptr [rip + 0x889f3f1], 1
0x1806fc155: mov rax, qword ptr [rip + 0x842f624]
0x1806fc15c: mov rcx, qword ptr [rax + 0xb8]
0x1806fc163: mov rcx, qword ptr [rcx + 0x190]
0x1806fc16a: test rcx, rcx
0x1806fc16d: jne 0x1806fc2a9
0x1806fc173: test rbx, rbx
0x1806fc176: je 0x1806fc279
0x1806fc17c: mov rcx, qword ptr [rip + 0x84b59dd]
0x1806fc183: call 0x18558e720
0x1806fc188: test rax, rax
0x1806fc18b: je 0x1806fc2d7
0x1806fc191: xor edx, edx
0x1806fc193: mov rcx, rax
0x1806fc196: call 0x180670490 ; Torappu.Battle.BattleController.get_gameMode
0x1806fc19b: test rax, rax
0x1806fc19e: je 0x1806fc2d7
0x1806fc1a4: mov rcx, qword ptr [rax]
0x1806fc1a7: mov r8d, dword ptr [rcx + 0x11c]
0x1806fc1ae: add r8d, 0xfffff625
0x1806fc1b5: cmp r8d, 0x1a
0x1806fc1b9: ja 0x1806fc262
0x1806fc1bf: movsxd rcx, r8d
0x1806fc1c2: lea rdx, [rip - 0x6fc1c9]
0x1806fc1c9: movzx ecx, byte ptr [rdx + rcx + 0x6fc300]
0x1806fc1d1: mov r8d, dword ptr [rdx + rcx*4 + 0x6fc2e0]
0x1806fc1d9: add r8, rdx
0x1806fc1dc: jmp r8
0x1806fc1df: xor r8d, r8d
0x1806fc1e2: mov rdx, rbx
0x1806fc1e5: mov rcx, rax
0x1806fc1e8: call 0x180c71ec0 ; Torappu.Battle.GameMode.GameModeFactory/CooperateGameMode.OnCardListChanged
0x1806fc1ed: jmp 0x1806fc279
0x1806fc1f2: xor r8d, r8d
0x1806fc1f5: mov rdx, rbx
0x1806fc1f8: mov rcx, rax
0x1806fc1fb: call 0x180cd5cd0 ; Torappu.Battle.GameMode.GameModeFactory/HalfIdleGameMode.OnCardListChanged
0x1806fc200: jmp 0x1806fc279
0x1806fc202: xor r8d, r8d
0x1806fc205: mov rdx, rbx
0x1806fc208: mov rcx, rax
0x1806fc20b: call 0x180ce5bf0 ; Torappu.Battle.GameMode.GameModeFactory/LegionGameMode.OnCardListChanged
0x1806fc210: jmp 0x1806fc279
0x1806fc212: xor r8d, r8d
0x1806fc215: mov rdx, rbx
0x1806fc218: mov rcx, rax
0x1806fc21b: call 0x180cf4270 ; Torappu.Battle.GameMode.GameModeFactory/RoguelikeDuelGameMode.OnCardListChanged
0x1806fc220: jmp 0x1806fc279
0x1806fc222: xor r8d, r8d
0x1806fc225: mov rdx, rbx
0x1806fc228: mov rcx, rax
0x1806fc22b: call 0x180cfcc00 ; Torappu.Battle.GameMode.GameModeFactory/SandboxGameMode.OnCardListChanged
0x1806fc230: jmp 0x1806fc279
0x1806fc232: xor r8d, r8d
0x1806fc235: mov rdx, rbx
0x1806fc238: mov rcx, rax
0x1806fc23b: call 0x180cff2d0 ; Torappu.Battle.GameMode.GameModeFactory/SandboxV3BuildGameMode.OnCardListChanged
0x1806fc240: jmp 0x1806fc279
0x1806fc242: xor r8d, r8d
0x1806fc245: mov rdx, rbx
0x1806fc248: mov rcx, rax
0x1806fc24b: call 0x180d01cf0 ; Torappu.Battle.GameMode.GameModeFactory/SandboxV3GameMode.OnCardListChanged
0x1806fc250: jmp 0x1806fc279
0x1806fc252: xor r8d, r8d
0x1806fc255: mov rdx, rbx
0x1806fc258: mov rcx, rax
0x1806fc25b: call 0x180c9daa0 ; Torappu.Battle.GameMode.GameModeFactory/DefaultGameMode.OnCardListChanged
0x1806fc260: jmp 0x1806fc279
0x1806fc262: mov rdx, qword ptr [rip + 0x8450b7f]
0x1806fc269: mov ecx, 0x4a
0x1806fc26e: mov r9, rbx
0x1806fc271: mov r8, rax
0x1806fc274: call 0x180005010
0x1806fc279: mov rcx, qword ptr [rdi + 0x10]
0x1806fc27d: test rcx, rcx
0x1806fc280: je 0x1806fc294
0x1806fc282: mov rax, qword ptr [rcx + 0x18]
0x1806fc286: mov r8, qword ptr [rcx + 0x28]
0x1806fc28a: mov rcx, qword ptr [rcx + 0x40]
0x1806fc28e: mov rdx, qword ptr [rdi + 0x50]
0x1806fc292: call rax
0x1806fc294: mov rsi, qword ptr [rsp + 0x50]
0x1806fc299: mov rbx, qword ptr [rsp + 0x58]
0x1806fc29e: mov rbp, qword ptr [rsp + 0x60]
0x1806fc2a3: add rsp, 0x40
0x1806fc2a7: pop rdi
0x1806fc2a8: ret
0x1806fc2a9: xor r9d, r9d
0x1806fc2ac: mov r8, rbx
0x1806fc2af: mov rdx, rdi
0x1806fc2b2: call 0x18338c7c0 ; XLua.DelegateBridge.__Gen_Delegate_Imp23
0x1806fc2b7: jmp 0x1806fc294
0x1806fc2b9: xor r9d, r9d
0x1806fc2bc: mov r8d, ebx
0x1806fc2bf: mov rdx, rdi
0x1806fc2c2: call 0x183154ba0 ; XLua.DelegateBridge.__Gen_Delegate_Imp1073
0x1806fc2c7: mov rbx, qword ptr [rsp + 0x58]
0x1806fc2cc: mov rbp, qword ptr [rsp + 0x60]
0x1806fc2d1: add rsp, 0x40
0x1806fc2d5: pop rdi
0x1806fc2d6: ret
0x1806fc2d7: call 0x18049c3c0
0x1806fc2dc: int3
0x1806fc2dd: nop dword ptr [rax]
