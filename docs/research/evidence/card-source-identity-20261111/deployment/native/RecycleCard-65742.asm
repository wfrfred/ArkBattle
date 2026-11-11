0x18065d2d0: mov qword ptr [rsp + 8], rbx
0x18065d2d5: push rdi
0x18065d2d6: sub rsp, 0x20
0x18065d2da: cmp byte ptr [rip + 0x893dd80], 0
0x18065d2e1: mov rbx, rdx
0x18065d2e4: mov rdi, rcx
0x18065d2e7: jne 0x18065d308
0x18065d2e9: lea rcx, [rip + 0x84b2950]
0x18065d2f0: call 0x18049c210
0x18065d2f5: lea rcx, [rip + 0x84c2d54]
0x18065d2fc: call 0x18049c210
0x18065d301: mov byte ptr [rip + 0x893dd59], 1
0x18065d308: mov rax, qword ptr [rip + 0x84b2931]
0x18065d30f: cmp dword ptr [rax + 0xe0], 0
0x18065d316: jne 0x18065d327
0x18065d318: mov rcx, rax
0x18065d31b: call 0x18049c450
0x18065d320: mov rax, qword ptr [rip + 0x84b2919]
0x18065d327: mov rax, qword ptr [rax + 0xb8]
0x18065d32e: mov rcx, qword ptr [rax + 0xae8]
0x18065d335: test rcx, rcx
0x18065d338: jne 0x18065d414
0x18065d33e: xor r8d, r8d
0x18065d341: mov rdx, rbx
0x18065d344: mov rcx, rdi
0x18065d347: call 0x180653290 ; Torappu.Battle.BattleController.GetDeck
0x18065d34c: mov rcx, qword ptr [rip + 0x84c2cfd]
0x18065d353: mov rdi, rax
0x18065d356: cmp dword ptr [rcx + 0xe0], 0
0x18065d35d: jne 0x18065d364
0x18065d35f: call 0x18049c450
0x18065d364: xor r8d, r8d
0x18065d367: xor edx, edx
0x18065d369: mov rcx, rbx
0x18065d36c: call 0x186dcf430 ; UnityEngine.Object.op_Inequality
0x18065d371: test al, al
0x18065d373: je 0x18065d422
0x18065d379: test rdi, rdi
0x18065d37c: je 0x18065d422
0x18065d382: test rbx, rbx
0x18065d385: je 0x18065d42d
0x18065d38b: xor edx, edx
0x18065d38d: mov rcx, rbx
0x18065d390: call 0x180aaf750 ; Torappu.Battle.Character.get_cardUid
0x18065d395: xor r8d, r8d
0x18065d398: mov edx, eax
0x18065d39a: mov rcx, rdi
0x18065d39d: call 0x1806fbed0 ; Torappu.Battle.Deck.RecycleCard
0x18065d3a2: xor edx, edx
0x18065d3a4: mov rcx, rbx
0x18065d3a7: call 0x180aaf970 ; Torappu.Battle.Character.get_data
0x18065d3ac: test rax, rax
0x18065d3af: je 0x18065d42d
0x18065d3b1: cmp byte ptr [rax + 0x91], 0
0x18065d3b8: je 0x18065d422
0x18065d3ba: xor edx, edx
0x18065d3bc: mov rcx, rbx
0x18065d3bf: call 0x180aaf970 ; Torappu.Battle.Character.get_data
0x18065d3c4: test rax, rax
0x18065d3c7: je 0x18065d42d
0x18065d3c9: cmp byte ptr [rax + 0x90], 0
0x18065d3d0: jne 0x18065d422
0x18065d3d2: xor edx, edx
0x18065d3d4: mov rcx, rbx
0x18065d3d7: call 0x180aaf970 ; Torappu.Battle.Character.get_data
0x18065d3dc: test rax, rax
0x18065d3df: je 0x18065d42d
0x18065d3e1: cmp dword ptr [rax + 0xa0], 0
0x18065d3e8: jbe 0x18065d422
0x18065d3ea: xor edx, edx
0x18065d3ec: mov rcx, rbx
0x18065d3ef: call 0x180aaf970 ; Torappu.Battle.Character.get_data
0x18065d3f4: test rax, rax
0x18065d3f7: je 0x18065d42d
0x18065d3f9: mov edx, dword ptr [rax + 0xa0]
0x18065d3ff: xor r8d, r8d
0x18065d402: mov rcx, rdi
0x18065d405: mov rbx, qword ptr [rsp + 0x30]
0x18065d40a: add rsp, 0x20
0x18065d40e: pop rdi
0x18065d40f: jmp 0x1806fc320 ; Torappu.Battle.Deck.RecycleTokenCard
0x18065d414: xor r9d, r9d
0x18065d417: mov r8, rbx
0x18065d41a: mov rdx, rdi
0x18065d41d: call 0x18338c7c0 ; XLua.DelegateBridge.__Gen_Delegate_Imp23
0x18065d422: mov rbx, qword ptr [rsp + 0x30]
0x18065d427: add rsp, 0x20
0x18065d42b: pop rdi
0x18065d42c: ret
0x18065d42d: call 0x18049c3c0
0x18065d432: int3
0x18065d433: int3
0x18065d434: int3
0x18065d435: int3
0x18065d436: int3
0x18065d437: int3
0x18065d438: int3
0x18065d439: int3
0x18065d43a: int3
0x18065d43b: int3
0x18065d43c: int3
0x18065d43d: int3
0x18065d43e: int3
0x18065d43f: int3
