0x1806fd140: mov dword ptr [rsp + 0x18], r8d
0x1806fd145: push rbp
0x1806fd146: push rsi
0x1806fd147: push rdi
0x1806fd148: push r13
0x1806fd14a: push r15
0x1806fd14c: sub rsp, 0x90
0x1806fd153: cmp byte ptr [rip + 0x889e3dc], 0
0x1806fd15a: mov r13, r9
0x1806fd15d: mov ebp, r8d
0x1806fd160: mov rdi, rdx
0x1806fd163: mov rsi, rcx
0x1806fd166: jne 0x1806fd1ab
0x1806fd168: lea rcx, [rip + 0x84c4e01]
0x1806fd16f: call 0x18049c210
0x1806fd174: lea rcx, [rip + 0x842e605]
0x1806fd17b: call 0x18049c210
0x1806fd180: lea rcx, [rip + 0x8422ec9]
0x1806fd187: call 0x18049c210
0x1806fd18c: lea rcx, [rip + 0x84b49cd]
0x1806fd193: call 0x18049c210
0x1806fd198: lea rcx, [rip + 0x84c5de9]
0x1806fd19f: call 0x18049c210
0x1806fd1a4: mov byte ptr [rip + 0x889e38b], 1
0x1806fd1ab: mov rax, qword ptr [rip + 0x842e5ce]
0x1806fd1b2: xor r15d, r15d
0x1806fd1b5: mov qword ptr [rsp + 0x80], r15
0x1806fd1bd: mov rcx, qword ptr [rax + 0xb8]
0x1806fd1c4: mov rcx, qword ptr [rcx + 0x110]
0x1806fd1cb: test rcx, rcx
0x1806fd1ce: jne 0x1806fd697
0x1806fd1d4: mov qword ptr [rsp + 0xd8], r14
0x1806fd1dc: mov qword ptr [rsp + 0xc0], rbx
0x1806fd1e4: mov qword ptr [rsp + 0xc8], r12
0x1806fd1ec: mov r14, qword ptr [rsp + 0xf8]
0x1806fd1f4: xor edx, edx
0x1806fd1f6: mov rcx, r14
0x1806fd1f9: mov qword ptr [r14], r15
0x1806fd1fc: call 0x18049bcf0
0x1806fd201: mov rcx, qword ptr [rsi + 0x58]
0x1806fd205: test rcx, rcx
0x1806fd208: je 0x1806fd72b
0x1806fd20e: xor edx, edx
0x1806fd210: call 0x18071b840 ; Torappu.Battle.Deck/SpawnDetailsTracker.Reset
0x1806fd215: test rdi, rdi
0x1806fd218: je 0x1806fd690
0x1806fd21e: movzx ebx, byte ptr [rsp + 0xf0]
0x1806fd226: movzx r12d, byte ptr [rsp + 0xe8]
0x1806fd22f: cmp byte ptr [rsp + 0x108], r15b
0x1806fd237: jne 0x1806fd289
0x1806fd239: cmp byte ptr [rip + 0x88db830], r15b
0x1806fd240: jbe 0x1806fd24a
0x1806fd242: mov rcx, qword ptr [rdi]
0x1806fd245: call 0x180457010
0x1806fd24a: mov rax, qword ptr [rdi]
0x1806fd24d: movzx r8d, bl
0x1806fd251: xor r8b, 1
0x1806fd255: movzx r9d, r12b
0x1806fd259: mov rdx, r13
0x1806fd25c: mov rcx, rdi
0x1806fd25f: mov r10, qword ptr [rax + 0x2b0]
0x1806fd266: mov rax, qword ptr [rax + 0x2b8]
0x1806fd26d: mov qword ptr [rsp + 0x28], rax
0x1806fd272: movzx eax, byte ptr [rsp + 0x100]
0x1806fd27a: mov byte ptr [rsp + 0x20], al
0x1806fd27e: call r10
0x1806fd281: test al, al
0x1806fd283: je 0x1806fd690
0x1806fd289: test bl, bl
0x1806fd28b: jne 0x1806fd2fb
0x1806fd28d: cmp byte ptr [rsp + 0xe0], r15b
0x1806fd295: je 0x1806fd2a6
0x1806fd297: mov ecx, 0x10
0x1806fd29c: mov rdx, rdi
0x1806fd29f: call 0x180005610
0x1806fd2a4: jmp 0x1806fd2f3
0x1806fd2a6: mov rcx, qword ptr [rip + 0x84b48b3]
0x1806fd2ad: call 0x18558e720
0x1806fd2b2: mov ecx, 0xa
0x1806fd2b7: mov rdx, rdi
0x1806fd2ba: mov rbp, rax
0x1806fd2bd: call 0x180005610
0x1806fd2c2: xor edx, edx
0x1806fd2c4: mov rcx, rdi
0x1806fd2c7: mov r15d, eax
0x1806fd2ca: call 0x1806f32a0 ; Torappu.Battle.Deck/Card.get_playerSide
0x1806fd2cf: test rbp, rbp
0x1806fd2d2: je 0x1806fd72b
0x1806fd2d8: xor r9d, r9d
0x1806fd2db: mov r8d, eax
0x1806fd2de: mov edx, r15d
0x1806fd2e1: mov rcx, rbp
0x1806fd2e4: call 0x180654510 ; Torappu.Battle.BattleController.IsCostEnough
0x1806fd2e9: mov ebp, dword ptr [rsp + 0xd0]
0x1806fd2f0: xor r15d, r15d
0x1806fd2f3: test al, al
0x1806fd2f5: je 0x1806fd690
0x1806fd2fb: xor r8d, r8d
0x1806fd2fe: movzx edx, bl
0x1806fd301: mov rcx, rdi
0x1806fd304: call 0x1806ea970 ; Torappu.Battle.Deck/Card.CheckDrawable
0x1806fd309: test al, al
0x1806fd30b: je 0x1806fd690
0x1806fd311: mov rdx, qword ptr [rip + 0x84c5c70]
0x1806fd318: mov rcx, rdi
0x1806fd31b: call 0x1800057a0
0x1806fd320: test rax, rax
0x1806fd323: je 0x1806fd341
0x1806fd325: cmp byte ptr [rsp + 0x110], 0
0x1806fd32d: jne 0x1806fd341
0x1806fd32f: xor edx, edx
0x1806fd331: mov rcx, rax
0x1806fd334: call 0x18071dec0 ; Torappu.Battle.Deck/TokenCard.get_hostIsAlive
0x1806fd339: test al, al
0x1806fd33b: je 0x1806fd690
0x1806fd341: mov rax, qword ptr [rsi + 0x58]
0x1806fd345: movzx r9d, r12b
0x1806fd349: mov qword ptr [rsp + 0x30], r15
0x1806fd34e: mov r8, r13
0x1806fd351: mov qword ptr [rsp + 0x28], rax
0x1806fd356: mov edx, ebp
0x1806fd358: mov rcx, rdi
0x1806fd35b: mov byte ptr [rsp + 0x20], bl
0x1806fd35f: call 0x1806eeaa0 ; Torappu.Battle.Deck/Card.SpawnPrefab
0x1806fd364: mov rdx, rax
0x1806fd367: mov qword ptr [r14], rax
0x1806fd36a: mov rcx, r14
0x1806fd36d: call 0x18049bcf0
0x1806fd372: mov rcx, qword ptr [rip + 0x8422cd7]
0x1806fd379: mov rbp, qword ptr [r14]
0x1806fd37c: cmp dword ptr [rcx + 0xe0], 0
0x1806fd383: jne 0x1806fd38a
0x1806fd385: call 0x18049c450
0x1806fd38a: xor r8d, r8d
0x1806fd38d: xor edx, edx
0x1806fd38f: mov rcx, rbp
0x1806fd392: call 0x186dcf430 ; UnityEngine.Object.op_Inequality
0x1806fd397: test al, al
0x1806fd399: jne 0x1806fd567
0x1806fd39f: mov rax, qword ptr [rsi + 0x58]
0x1806fd3a3: test rax, rax
0x1806fd3a6: je 0x1806fd72b
0x1806fd3ac: cmp byte ptr [rax + 0x10], 0
0x1806fd3b0: je 0x1806fd52f
0x1806fd3b6: cmp byte ptr [rip + 0x889e17b], 0
0x1806fd3bd: jne 0x1806fd3d2
0x1806fd3bf: lea rcx, [rip + 0x842e3ba]
0x1806fd3c6: call 0x18049c210
0x1806fd3cb: mov byte ptr [rip + 0x889e166], 1
0x1806fd3d2: mov rax, qword ptr [rip + 0x842e3a7]
0x1806fd3d9: mov rcx, qword ptr [rax + 0xb8]
0x1806fd3e0: mov rcx, qword ptr [rcx + 0x120]
0x1806fd3e7: test rcx, rcx
0x1806fd3ea: jne 0x1806fd494
0x1806fd3f0: mov rax, qword ptr [rsi + 0x58]
0x1806fd3f4: test rax, rax
0x1806fd3f7: je 0x1806fd72b
0x1806fd3fd: cmp byte ptr [rax + 0x14], cl
0x1806fd400: je 0x1806fd4a8
0x1806fd406: cmp byte ptr [rax + 0x15], cl
0x1806fd409: jne 0x1806fd425
0x1806fd40b: mov qword ptr [rsp + 0x28], r15
0x1806fd410: xor r9d, r9d
0x1806fd413: mov byte ptr [rsp + 0x20], cl
0x1806fd417: xor r8d, r8d
0x1806fd41a: mov rcx, rdi
0x1806fd41d: movzx edx, bl
0x1806fd420: call 0x1806eb980 ; Torappu.Battle.Deck/Card.Draw
0x1806fd425: cmp byte ptr [rip + 0x889e137], 0
0x1806fd42c: jne 0x1806fd441
0x1806fd42e: lea rcx, [rip + 0x84c48f3]
0x1806fd435: call 0x18049c210
0x1806fd43a: mov byte ptr [rip + 0x889e122], 1
0x1806fd441: mov rax, qword ptr [rip + 0x84c48e0]
0x1806fd448: mov rcx, qword ptr [rax + 0xb8]
0x1806fd44f: mov rcx, qword ptr [rcx + 0x20]
0x1806fd453: test rcx, rcx
0x1806fd456: jne 0x1806fd460
0x1806fd458: mov ebx, dword ptr [rdi + 0x1b0]
0x1806fd45e: jmp 0x1806fd46d
0x1806fd460: xor r8d, r8d
0x1806fd463: mov rdx, rdi
0x1806fd466: call 0x18345eda0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3745
0x1806fd46b: mov ebx, eax
0x1806fd46d: xor edx, edx
0x1806fd46f: mov rcx, rdi
0x1806fd472: call 0x1806ebfe0 ; Torappu.Battle.Deck/Card.FinishCardBuffsOnSpawned
0x1806fd477: xor r8d, r8d
0x1806fd47a: mov edx, ebx
0x1806fd47c: mov rcx, rdi
0x1806fd47f: call 0x1806ec3c0 ; Torappu.Battle.Deck/Card.FinishDeckBuffsOnSpawned
0x1806fd484: xor r8d, r8d
0x1806fd487: mov rdx, rdi
0x1806fd48a: mov rcx, rsi
0x1806fd48d: call 0x1806fa720 ; Torappu.Battle.Deck.OnCardListChanged
0x1806fd492: jmp 0x1806fd4a8
0x1806fd494: movzx r9d, bl
0x1806fd498: mov qword ptr [rsp + 0x20], r15
0x1806fd49d: mov r8, rdi
0x1806fd4a0: mov rdx, rsi
0x1806fd4a3: call 0x1833b46c0 ; XLua.DelegateBridge.__Gen_Delegate_Imp265
0x1806fd4a8: xor edx, edx
0x1806fd4aa: mov rcx, rsi
0x1806fd4ad: call 0x1806ff720 ; Torappu.Battle.Deck.get_playerSide
0x1806fd4b2: mov r9b, 1
0x1806fd4b5: mov qword ptr [rsp + 0x20], r15
0x1806fd4ba: xor r8d, r8d
0x1806fd4bd: mov edx, eax
0x1806fd4bf: xor ecx, ecx
0x1806fd4c1: call 0x1806f8de0 ; Torappu.Battle.Deck.ApplyDeployCostPostDelta
0x1806fd4c6: mov rax, qword ptr [rsi + 0x58]
0x1806fd4ca: test rax, rax
0x1806fd4cd: je 0x1806fd72b
0x1806fd4d3: cmp byte ptr [rax + 0x16], 0
0x1806fd4d7: je 0x1806fd52f
0x1806fd4d9: cmp byte ptr [rip + 0x889e0e5], 0
0x1806fd4e0: mov ebx, dword ptr [rax + 0x18]
0x1806fd4e3: jne 0x1806fd4f8
0x1806fd4e5: lea rcx, [rip + 0x84c483c]
0x1806fd4ec: call 0x18049c210
0x1806fd4f1: mov byte ptr [rip + 0x889e0cd], 1
0x1806fd4f8: mov rax, qword ptr [rip + 0x84c4829]
0x1806fd4ff: mov rcx, qword ptr [rax + 0xb8]
0x1806fd506: mov rcx, qword ptr [rcx + 0x330]
0x1806fd50d: test rcx, rcx
0x1806fd510: jne 0x1806fd521
0x1806fd512: xor r8d, r8d
0x1806fd515: mov edx, ebx
0x1806fd517: mov rcx, rdi
0x1806fd51a: call 0x1806f42c0 ; Torappu.Battle.Deck/Card.set_state
0x1806fd51f: jmp 0x1806fd52f
0x1806fd521: xor r9d, r9d
0x1806fd524: mov r8d, ebx
0x1806fd527: mov rdx, rdi
0x1806fd52a: call 0x183196a20 ; XLua.DelegateBridge.__Gen_Delegate_Imp11169
0x1806fd52f: mov rax, qword ptr [rsi + 0x58]
0x1806fd533: test rax, rax
0x1806fd536: je 0x1806fd72b
0x1806fd53c: movzx eax, byte ptr [rax + 0x10]
0x1806fd540: mov r12, qword ptr [rsp + 0xc8]
0x1806fd548: mov rbx, qword ptr [rsp + 0xc0]
0x1806fd550: mov r14, qword ptr [rsp + 0xd8]
0x1806fd558: add rsp, 0x90
0x1806fd55f: pop r15
0x1806fd561: pop r13
0x1806fd563: pop rdi
0x1806fd564: pop rsi
0x1806fd565: pop rbp
0x1806fd566: ret
0x1806fd567: test bl, bl
0x1806fd569: jne 0x1806fd5d1
0x1806fd56b: mov rcx, qword ptr [rip + 0x84b45ee]
0x1806fd572: call 0x18558e720
0x1806fd577: mov ecx, 0xa
0x1806fd57c: mov rdx, rdi
0x1806fd57f: mov r15, rax
0x1806fd582: call 0x180005610
0x1806fd587: mov r12, qword ptr [r14]
0x1806fd58a: xor edx, edx
0x1806fd58c: mov rcx, rsi
0x1806fd58f: mov ebp, eax
0x1806fd591: call 0x1806ff720 ; Torappu.Battle.Deck.get_playerSide
0x1806fd596: test r15, r15
0x1806fd599: je 0x1806fd72b
0x1806fd59f: mov qword ptr [rsp + 0x48], 0
0x1806fd5a8: neg ebp
0x1806fd5aa: mov byte ptr [rsp + 0x40], bl
0x1806fd5ae: mov r9d, eax
0x1806fd5b1: mov byte ptr [rsp + 0x38], bl
0x1806fd5b5: mov r8, r12
0x1806fd5b8: mov byte ptr [rsp + 0x30], bl
0x1806fd5bc: mov edx, ebp
0x1806fd5be: mov byte ptr [rsp + 0x28], bl
0x1806fd5c2: mov rcx, r15
0x1806fd5c5: mov byte ptr [rsp + 0x20], bl
0x1806fd5c9: call 0x180657fa0 ; Torappu.Battle.BattleController.ModifyCost
0x1806fd5ce: xor r15d, r15d
0x1806fd5d1: mov rdx, qword ptr [r14]
0x1806fd5d4: test rdx, rdx
0x1806fd5d7: je 0x1806fd72b
0x1806fd5dd: mov ecx, 0x29
0x1806fd5e2: call 0x180005610
0x1806fd5e7: test al, al
0x1806fd5e9: je 0x1806fd658
0x1806fd5eb: movzx r9d, byte ptr [rsp + 0x120]
0x1806fd5f4: movzx edx, bl
0x1806fd5f7: movzx r8d, byte ptr [rsp + 0x118]
0x1806fd600: mov rcx, rdi
0x1806fd603: mov qword ptr [rsp + 0x28], r15
0x1806fd608: mov byte ptr [rsp + 0x20], 1
0x1806fd60d: call 0x1806eb980 ; Torappu.Battle.Deck/Card.Draw
0x1806fd612: mov rdx, qword ptr [rip + 0x84c4957]
0x1806fd619: mov rcx, rdi
0x1806fd61c: call 0x1800057a0
0x1806fd621: test rax, rax
0x1806fd624: je 0x1806fd658
0x1806fd626: xor r9d, r9d
0x1806fd629: lea r8, [rsp + 0x80]
0x1806fd631: mov rdx, rdi
0x1806fd634: mov rcx, rsi
0x1806fd637: call 0x1806fe9b0 ; Torappu.Battle.Deck._TryGetToken
0x1806fd63c: test al, al
0x1806fd63e: je 0x1806fd658
0x1806fd640: mov rcx, qword ptr [rsp + 0x80]
0x1806fd648: test rcx, rcx
0x1806fd64b: je 0x1806fd72b
0x1806fd651: xor edx, edx
0x1806fd653: call 0x18071d2a0 ; Torappu.Battle.Deck/TokenCard.OnHostSpawned
0x1806fd658: xor edx, edx
0x1806fd65a: mov rcx, rdi
0x1806fd65d: call 0x1806f1f30 ; Torappu.Battle.Deck/Card.get_advancedBuildState
0x1806fd662: xor edx, edx
0x1806fd664: mov rcx, rdi
0x1806fd667: mov ebx, eax
0x1806fd669: call 0x1806ebfe0 ; Torappu.Battle.Deck/Card.FinishCardBuffsOnSpawned
0x1806fd66e: xor r8d, r8d
0x1806fd671: mov edx, ebx
0x1806fd673: mov rcx, rdi
0x1806fd676: call 0x1806ec3c0 ; Torappu.Battle.Deck/Card.FinishDeckBuffsOnSpawned
0x1806fd67b: xor r8d, r8d
0x1806fd67e: mov rdx, rdi
0x1806fd681: mov rcx, rsi
0x1806fd684: call 0x1806fa720 ; Torappu.Battle.Deck.OnCardListChanged
0x1806fd689: mov al, 1
0x1806fd68b: jmp 0x1806fd540
0x1806fd690: xor al, al
0x1806fd692: jmp 0x1806fd540
0x1806fd697: movzx eax, byte ptr [rsp + 0x120]
0x1806fd69f: mov r9d, ebp
0x1806fd6a2: mov qword ptr [rsp + 0x70], r15
0x1806fd6a7: mov r8, rdi
0x1806fd6aa: mov byte ptr [rsp + 0x68], al
0x1806fd6ae: mov rdx, rsi
0x1806fd6b1: movzx eax, byte ptr [rsp + 0x118]
0x1806fd6b9: mov byte ptr [rsp + 0x60], al
0x1806fd6bd: movzx eax, byte ptr [rsp + 0x110]
0x1806fd6c5: mov byte ptr [rsp + 0x58], al
0x1806fd6c9: movzx eax, byte ptr [rsp + 0x108]
0x1806fd6d1: mov byte ptr [rsp + 0x50], al
0x1806fd6d5: movzx eax, byte ptr [rsp + 0x100]
0x1806fd6dd: mov byte ptr [rsp + 0x48], al
0x1806fd6e1: mov rax, qword ptr [rsp + 0xf8]
0x1806fd6e9: mov qword ptr [rsp + 0x40], rax
0x1806fd6ee: movzx eax, byte ptr [rsp + 0xf0]
0x1806fd6f6: mov byte ptr [rsp + 0x38], al
0x1806fd6fa: movzx eax, byte ptr [rsp + 0xe8]
0x1806fd702: mov byte ptr [rsp + 0x30], al
0x1806fd706: movzx eax, byte ptr [rsp + 0xe0]
0x1806fd70e: mov byte ptr [rsp + 0x28], al
0x1806fd712: mov qword ptr [rsp + 0x20], r13
0x1806fd717: call 0x1833f2650 ; XLua.DelegateBridge.__Gen_Delegate_Imp3059
0x1806fd71c: add rsp, 0x90
0x1806fd723: pop r15
0x1806fd725: pop r13
0x1806fd727: pop rdi
0x1806fd728: pop rsi
0x1806fd729: pop rbp
0x1806fd72a: ret
0x1806fd72b: call 0x18049c3c0
0x1806fd730: int3
0x1806fd731: int3
0x1806fd732: int3
0x1806fd733: int3
0x1806fd734: int3
0x1806fd735: int3
0x1806fd736: int3
0x1806fd737: int3
0x1806fd738: int3
0x1806fd739: int3
0x1806fd73a: int3
0x1806fd73b: int3
0x1806fd73c: int3
0x1806fd73d: int3
0x1806fd73e: int3
0x1806fd73f: int3
