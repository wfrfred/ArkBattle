0x180aa94a0: mov rax, rsp
0x180aa94a3: mov byte ptr [rax + 0x20], r9b
0x180aa94a7: mov byte ptr [rax + 0x10], dl
0x180aa94aa: mov qword ptr [rax + 8], rcx
0x180aa94ae: push rbx
0x180aa94af: push rsi
0x180aa94b0: push rdi
0x180aa94b1: push r12
0x180aa94b3: push r15
0x180aa94b5: sub rsp, 0xa0
0x180aa94bc: movaps xmmword ptr [rax - 0x38], xmm6
0x180aa94c0: movzx esi, r9b
0x180aa94c4: movzx ebx, r8b
0x180aa94c8: movzx r12d, dl
0x180aa94cc: mov rdi, rcx
0x180aa94cf: cmp byte ptr [rip + 0x84f423a], 0
0x180aa94d6: jne 0x180aa950f
0x180aa94d8: lea rcx, [rip + 0x812e141]
0x180aa94df: call 0x18049c210
0x180aa94e4: lea rcx, [rip + 0x807bb3d]
0x180aa94eb: call 0x18049c210
0x180aa94f0: lea rcx, [rip + 0x80d5061]
0x180aa94f7: call 0x18049c210
0x180aa94fc: lea rcx, [rip + 0x810865d]
0x180aa9503: call 0x18049c210
0x180aa9508: mov byte ptr [rip + 0x84f4201], 1
0x180aa950f: mov qword ptr [rsp + 0x50], 0
0x180aa9518: xorps xmm0, xmm0
0x180aa951b: movups xmmword ptr [rsp + 0x60], xmm0
0x180aa9520: mov rax, qword ptr [rip + 0x812e0f9]
0x180aa9527: cmp dword ptr [rax + 0xe0], 0
0x180aa952e: jne 0x180aa953f
0x180aa9530: mov rcx, rax
0x180aa9533: call 0x18049c450
0x180aa9538: mov rax, qword ptr [rip + 0x812e0e1]
0x180aa953f: mov rax, qword ptr [rax + 0xb8]
0x180aa9546: mov rcx, qword ptr [rax + 0x400]
0x180aa954d: test rcx, rcx
0x180aa9550: jne 0x180aa9897
0x180aa9556: xor edx, edx
0x180aa9558: mov rcx, rdi
0x180aa955b: call 0x18073a680 ; Torappu.Battle.Entity.get_unfinished
0x180aa9560: test al, al
0x180aa9562: je 0x180aa9893
0x180aa9568: test bl, bl
0x180aa956a: jne 0x180aa959a
0x180aa956c: cmp byte ptr [rip + 0x852f4fe], bl
0x180aa9572: jbe 0x180aa957c
0x180aa9574: mov rcx, qword ptr [rdi]
0x180aa9577: call 0x180457010
0x180aa957c: mov rdx, qword ptr [rdi]
0x180aa957f: mov rax, qword ptr [rdx + 0xf20]
0x180aa9586: mov rdx, qword ptr [rdx + 0xf28]
0x180aa958d: mov rcx, rdi
0x180aa9590: call rax
0x180aa9592: test al, al
0x180aa9594: je 0x180aa9893
0x180aa959a: xor r8d, r8d
0x180aa959d: lea rdx, [rsp + 0x50]
0x180aa95a2: lea rcx, [rsp + 0x70]
0x180aa95a7: call 0x180d3ad70 ; Torappu.Battle.LevelScript.EventParams.Allocate
0x180aa95ac: movups xmm0, xmmword ptr [rax]
0x180aa95af: movups xmmword ptr [rsp + 0x60], xmm0
0x180aa95b4: mov qword ptr [rsp + 0x70], 0
0x180aa95bd: lea rax, [rsp + 0x60]
0x180aa95c2: mov qword ptr [rsp + 0x78], rax
0x180aa95c7: mov rbx, qword ptr [rsp + 0x50]
0x180aa95cc: xor edx, edx
0x180aa95ce: mov rcx, rdi
0x180aa95d1: call 0x180736530 ; Torappu.Battle.Entity.get_id
0x180aa95d6: test rbx, rbx
0x180aa95d9: je 0x180aa98e8
0x180aa95df: xor r8d, r8d
0x180aa95e2: mov rdx, rax
0x180aa95e5: mov rcx, rbx
0x180aa95e8: call 0x180d3b110 ; Torappu.Battle.LevelScript.EventParams.SetSender
0x180aa95ed: mov rbx, qword ptr [rsp + 0x50]
0x180aa95f2: xor edx, edx
0x180aa95f4: mov rcx, rdi
0x180aa95f7: call 0x180736530 ; Torappu.Battle.Entity.get_id
0x180aa95fc: test rbx, rbx
0x180aa95ff: je 0x180aa98e3
0x180aa9605: xor r8d, r8d
0x180aa9608: mov rdx, rax
0x180aa960b: mov rcx, rbx
0x180aa960e: call 0x180d3b0b0 ; Torappu.Battle.LevelScript.EventParams.SetReceiver
0x180aa9613: mov rcx, qword ptr [rip + 0x8108546]
0x180aa961a: call 0x18558e720
0x180aa961f: test rax, rax
0x180aa9622: je 0x180aa98de
0x180aa9628: xor edx, edx
0x180aa962a: mov rcx, rax
0x180aa962d: call 0x180671b60 ; Torappu.Battle.BattleController.get_levelScriptEventManager
0x180aa9632: test rax, rax
0x180aa9635: je 0x180aa98d8
0x180aa963b: xor r9d, r9d
0x180aa963e: mov r8, qword ptr [rsp + 0x50]
0x180aa9643: mov edx, 2
0x180aa9648: mov rcx, rax
0x180aa964b: call 0x180d44ec0 ; Torappu.Battle.LevelScript.LevelScriptEventManager.RaiseLevelEvent
0x180aa9650: nop
0x180aa9651: mov rdx, qword ptr [rip + 0x80d4f00]
0x180aa9658: lea rcx, [rsp + 0x60]
0x180aa965d: call 0x185575620
0x180aa9662: jmp 0x180aa969c
0x180aa9664: mov rdx, qword ptr [rip + 0x80d4eed]
0x180aa966b: lea rcx, [rsp + 0x60]
0x180aa9670: call 0x185575620
0x180aa9675: mov rcx, qword ptr [rsp + 0x70]
0x180aa967a: test rcx, rcx
0x180aa967d: jne 0x180aa98ee
0x180aa9683: movzx esi, byte ptr [rsp + 0xe8]
0x180aa968b: movzx r12d, byte ptr [rsp + 0xd8]
0x180aa9694: mov rdi, qword ptr [rsp + 0xd0]
0x180aa969c: cmp byte ptr [rip + 0x852f3cd], 0
0x180aa96a3: jbe 0x180aa96ad
0x180aa96a5: mov rcx, qword ptr [rdi]
0x180aa96a8: call 0x180457010
0x180aa96ad: mov rdx, qword ptr [rdi]
0x180aa96b0: mov rax, qword ptr [rdx + 0xf70]
0x180aa96b7: mov rdx, qword ptr [rdx + 0xf78]
0x180aa96be: mov rcx, rdi
0x180aa96c1: call rax
0x180aa96c3: test al, al
0x180aa96c5: je 0x180aa97bd
0x180aa96cb: xor edx, edx
0x180aa96cd: mov rcx, rdi
0x180aa96d0: call 0x180734320 ; Torappu.Battle.Entity.get_cost
0x180aa96d5: movd xmm0, eax
0x180aa96d9: cvtdq2ps xmm0, xmm0
0x180aa96dc: mulss xmm0, dword ptr [rdi + 0x4f0]
0x180aa96e4: xor edx, edx
0x180aa96e6: call 0x180549ef0
0x180aa96eb: mov r15d, eax
0x180aa96ee: xor edx, edx
0x180aa96f0: mov rcx, rdi
0x180aa96f3: call 0x180aaf970 ; Torappu.Battle.Character.get_data
0x180aa96f8: test rax, rax
0x180aa96fb: je 0x180aa98f4
0x180aa9701: mov rcx, qword ptr [rax + 0x38]
0x180aa9705: test rcx, rcx
0x180aa9708: je 0x180aa98f4
0x180aa970e: movups xmm6, xmmword ptr [rcx + 0x64]
0x180aa9712: mov ebx, dword ptr [rcx + 0x74]
0x180aa9715: mov rcx, qword ptr [rip + 0x807b90c]
0x180aa971c: cmp dword ptr [rcx + 0xe0], 0
0x180aa9723: jne 0x180aa972a
0x180aa9725: call 0x18049c450
0x180aa972a: movaps xmmword ptr [rsp + 0x70], xmm6
0x180aa972f: mov dword ptr [rsp + 0x80], ebx
0x180aa9736: xor edx, edx
0x180aa9738: lea rcx, [rsp + 0x70]
0x180aa973d: call 0x18686bef0 ; CodeStage.AntiCheat.ObscuredTypes.ObscuredInt.op_Implicit
0x180aa9742: movd xmm0, eax
0x180aa9746: cvtdq2ps xmm0, xmm0
0x180aa9749: mulss xmm0, dword ptr [rdi + 0x344]
0x180aa9751: xor edx, edx
0x180aa9753: call 0x1808fec40
0x180aa9758: mov ebx, eax
0x180aa975a: cmp byte ptr [rdi + 0x4f4], 0
0x180aa9761: je 0x180aa976e
0x180aa9763: mov eax, dword ptr [rdi + 0x4fc]
0x180aa9769: cmp eax, ebx
0x180aa976b: cmovg ebx, eax
0x180aa976e: cmp r15d, ebx
0x180aa9771: cmovl ebx, r15d
0x180aa9775: mov rcx, qword ptr [rip + 0x81083e4]
0x180aa977c: call 0x18558e720
0x180aa9781: test rax, rax
0x180aa9784: je 0x180aa98f4
0x180aa978a: mov qword ptr [rsp + 0x48], 0
0x180aa9793: mov byte ptr [rsp + 0x40], 0
0x180aa9798: mov byte ptr [rsp + 0x38], 0
0x180aa979d: mov byte ptr [rsp + 0x30], 0
0x180aa97a2: mov byte ptr [rsp + 0x28], 0
0x180aa97a7: mov byte ptr [rsp + 0x20], 0
0x180aa97ac: mov r9d, dword ptr [rdi + 0x20]
0x180aa97b0: mov r8, rdi
0x180aa97b3: mov edx, ebx
0x180aa97b5: mov rcx, rax
0x180aa97b8: call 0x180657fa0 ; Torappu.Battle.BattleController.ModifyCost
0x180aa97bd: xor edx, edx
0x180aa97bf: mov rcx, rdi
0x180aa97c2: call 0x180b22ec0 ; Torappu.Battle.VisualObject.get_gridPosition
0x180aa97c7: mov rbx, rax
0x180aa97ca: test r12b, r12b
0x180aa97cd: je 0x180aa97d7
0x180aa97cf: mov r8d, 5
0x180aa97d5: jmp 0x180aa97e6
0x180aa97d7: movzx eax, sil
0x180aa97db: xor eax, 1
0x180aa97de: lea r8d, [rax*2 + 4]
0x180aa97e6: mov ecx, 0x75
0x180aa97eb: mov rdx, rdi
0x180aa97ee: call 0x1800053c0
0x180aa97f3: test sil, sil
0x180aa97f6: jne 0x180aa984d
0x180aa97f8: cmp byte ptr [rsp + 0xf0], sil
0x180aa9800: je 0x180aa988f
0x180aa9806: mov rcx, qword ptr [rip + 0x8108353]
0x180aa980d: call 0x18558e720
0x180aa9812: test rax, rax
0x180aa9815: je 0x180aa98f4
0x180aa981b: xor edx, edx
0x180aa981d: mov rcx, rax
0x180aa9820: call 0x180671c60 ; Torappu.Battle.BattleController.get_logger
0x180aa9825: mov rbx, rax
0x180aa9828: xor edx, edx
0x180aa982a: mov rcx, rdi
0x180aa982d: call 0x180aaf970 ; Torappu.Battle.Character.get_data
0x180aa9832: test rbx, rbx
0x180aa9835: je 0x180aa98f4
0x180aa983b: xor r8d, r8d
0x180aa983e: mov rdx, rax
0x180aa9841: mov rcx, rbx
0x180aa9844: call 0x180740a30 ; Torappu.Battle.BattleLogger.LogCharacterAutoWithdraw
0x180aa9849: mov al, 1
0x180aa984b: jmp 0x180aa98c1
0x180aa984d: mov rcx, qword ptr [rip + 0x810830c]
0x180aa9854: call 0x18558e720
0x180aa9859: test rax, rax
0x180aa985c: je 0x180aa98f4
0x180aa9862: xor edx, edx
0x180aa9864: mov rcx, rax
0x180aa9867: call 0x180671c60 ; Torappu.Battle.BattleController.get_logger
0x180aa986c: mov rsi, rax
0x180aa986f: xor edx, edx
0x180aa9871: mov rcx, rdi
0x180aa9874: call 0x180aaf970 ; Torappu.Battle.Character.get_data
0x180aa9879: test rsi, rsi
0x180aa987c: je 0x180aa98f4
0x180aa987e: xor r9d, r9d
0x180aa9881: mov r8, rbx
0x180aa9884: mov rdx, rax
0x180aa9887: mov rcx, rsi
0x180aa988a: call 0x180742b40 ; Torappu.Battle.BattleLogger.LogManualWithdraw
0x180aa988f: mov al, 1
0x180aa9891: jmp 0x180aa98c1
0x180aa9893: xor al, al
0x180aa9895: jmp 0x180aa98c1
0x180aa9897: mov qword ptr [rsp + 0x30], 0
0x180aa98a0: movzx eax, byte ptr [rsp + 0xf0]
0x180aa98a8: mov byte ptr [rsp + 0x28], al
0x180aa98ac: mov byte ptr [rsp + 0x20], sil
0x180aa98b1: movzx r9d, bl
0x180aa98b5: movzx r8d, r12b
0x180aa98b9: mov rdx, rdi
0x180aa98bc: call 0x183461830 ; XLua.DelegateBridge.__Gen_Delegate_Imp3762
0x180aa98c1: movaps xmm6, xmmword ptr [rsp + 0x90]
0x180aa98c9: add rsp, 0xa0
0x180aa98d0: pop r15
0x180aa98d2: pop r12
0x180aa98d4: pop rdi
0x180aa98d5: pop rsi
0x180aa98d6: pop rbx
0x180aa98d7: ret
0x180aa98d8: call 0x18049c3c0
0x180aa98dd: nop
0x180aa98de: call 0x18049c3c0
0x180aa98e3: call 0x18049c3c0
0x180aa98e8: call 0x18049c3c0
0x180aa98ed: nop
0x180aa98ee: call 0x180483060
0x180aa98f3: int3
0x180aa98f4: call 0x18049c3c0
0x180aa98f9: int3
0x180aa98fa: int3
0x180aa98fb: int3
0x180aa98fc: int3
0x180aa98fd: int3
0x180aa98fe: int3
0x180aa98ff: int3
