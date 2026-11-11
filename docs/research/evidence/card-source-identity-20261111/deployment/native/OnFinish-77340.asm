0x180aa32c0: mov qword ptr [rsp + 0x10], rbx
0x180aa32c5: push rdi
0x180aa32c6: sub rsp, 0x20
0x180aa32ca: cmp byte ptr [rip + 0x84fa498], 0
0x180aa32d1: mov edi, edx
0x180aa32d3: mov rbx, rcx
0x180aa32d6: jne 0x180aa330f
0x180aa32d8: lea rcx, [rip + 0x8134341]
0x180aa32df: call 0x18049c210
0x180aa32e4: lea rcx, [rip + 0x807cd65]
0x180aa32eb: call 0x18049c210
0x180aa32f0: lea rcx, [rip + 0x810e621]
0x180aa32f7: call 0x18049c210
0x180aa32fc: lea rcx, [rip + 0x810e85d]
0x180aa3303: call 0x18049c210
0x180aa3308: mov byte ptr [rip + 0x84fa45a], 1
0x180aa330f: mov rax, qword ptr [rip + 0x813430a]
0x180aa3316: cmp dword ptr [rax + 0xe0], 0
0x180aa331d: jne 0x180aa332e
0x180aa331f: mov rcx, rax
0x180aa3322: call 0x18049c450
0x180aa3327: mov rax, qword ptr [rip + 0x81342f2]
0x180aa332e: mov rax, qword ptr [rax + 0xb8]
0x180aa3335: mov rcx, qword ptr [rax + 0x6c8]
0x180aa333c: test rcx, rcx
0x180aa333f: jne 0x180aa34e8
0x180aa3345: mov qword ptr [rsp + 0x30], rsi
0x180aa334a: xor edx, edx
0x180aa334c: mov rcx, rbx
0x180aa334f: call 0x180aa1250 ; Torappu.Battle.Character.LogSnapshotIfNot
0x180aa3354: xor edx, edx
0x180aa3356: mov rcx, rbx
0x180aa3359: call 0x180ab1de0 ; Torappu.Battle.Character.get_sharedData
0x180aa335e: test rax, rax
0x180aa3361: je 0x180aa3500
0x180aa3367: mov dword ptr [rax + 0x30], edi
0x180aa336a: cmp edi, 0xb
0x180aa336d: je 0x180aa338b
0x180aa336f: xor edx, edx
0x180aa3371: mov rcx, rbx
0x180aa3374: call 0x180ab1de0 ; Torappu.Battle.Character.get_sharedData
0x180aa3379: test rax, rax
0x180aa337c: je 0x180aa3500
0x180aa3382: xor ecx, ecx
0x180aa3384: mov qword ptr [rax + 0x50], rcx
0x180aa3388: mov dword ptr [rax + 0x58], ecx
0x180aa338b: mov rcx, qword ptr [rip + 0x807ccbe]
0x180aa3392: mov rsi, qword ptr [rbx + 0x3c8]
0x180aa3399: cmp dword ptr [rcx + 0xe0], 0
0x180aa33a0: jne 0x180aa33a7
0x180aa33a2: call 0x18049c450
0x180aa33a7: xor r8d, r8d
0x180aa33aa: xor edx, edx
0x180aa33ac: mov rcx, rsi
0x180aa33af: call 0x186dcf430 ; UnityEngine.Object.op_Inequality
0x180aa33b4: test al, al
0x180aa33b6: je 0x180aa33f1
0x180aa33b8: mov rsi, qword ptr [rbx + 0x3c8]
0x180aa33bf: test rsi, rsi
0x180aa33c2: je 0x180aa3500
0x180aa33c8: cmp byte ptr [rip + 0x85356a1], 0
0x180aa33cf: jbe 0x180aa33d9
0x180aa33d1: mov rcx, qword ptr [rsi]
0x180aa33d4: call 0x180457010
0x180aa33d9: mov r8, qword ptr [rsi]
0x180aa33dc: mov edx, edi
0x180aa33de: mov rcx, rsi
0x180aa33e1: mov rax, qword ptr [r8 + 0x540]
0x180aa33e8: mov r8, qword ptr [r8 + 0x548]
0x180aa33ef: call rax
0x180aa33f1: xor r8d, r8d
0x180aa33f4: mov edx, edi
0x180aa33f6: mov rcx, rbx
0x180aa33f9: call 0x180b18e40 ; Torappu.Battle.Unit.OnFinish
0x180aa33fe: cmp byte ptr [rip + 0x853566b], 0
0x180aa3405: jbe 0x180aa340f
0x180aa3407: mov rcx, qword ptr [rbx]
0x180aa340a: call 0x180457010
0x180aa340f: mov rdx, qword ptr [rbx]
0x180aa3412: mov rcx, rbx
0x180aa3415: mov rax, qword ptr [rdx + 0x480]
0x180aa341c: mov rdx, qword ptr [rdx + 0x488]
0x180aa3423: call rax
0x180aa3425: mov rcx, qword ptr [rip + 0x807cc24]
0x180aa342c: mov rsi, rax
0x180aa342f: cmp dword ptr [rcx + 0xe0], 0
0x180aa3436: jne 0x180aa343d
0x180aa3438: call 0x18049c450
0x180aa343d: xor r8d, r8d
0x180aa3440: xor edx, edx
0x180aa3442: mov rcx, rsi
0x180aa3445: call 0x186dcf430 ; UnityEngine.Object.op_Inequality
0x180aa344a: test al, al
0x180aa344c: je 0x180aa348f
0x180aa344e: cmp byte ptr [rip + 0x853561b], 0
0x180aa3455: jbe 0x180aa345f
0x180aa3457: mov rcx, qword ptr [rbx]
0x180aa345a: call 0x180457010
0x180aa345f: mov rdx, qword ptr [rbx]
0x180aa3462: mov rcx, rbx
0x180aa3465: mov rax, qword ptr [rdx + 0x480]
0x180aa346c: mov rdx, qword ptr [rdx + 0x488]
0x180aa3473: call rax
0x180aa3475: test rax, rax
0x180aa3478: je 0x180aa3500
0x180aa347e: xor r9d, r9d
0x180aa3481: mov r8d, edi
0x180aa3484: mov rdx, rbx
0x180aa3487: mov rcx, rax
0x180aa348a: call 0x1808f5180 ; Torappu.Battle.Tile.OnCharacterFinished
0x180aa348f: mov rcx, qword ptr [rbx + 0x520]
0x180aa3496: test rcx, rcx
0x180aa3499: je 0x180aa3500
0x180aa349b: xor r8d, r8d
0x180aa349e: mov rdx, rbx
0x180aa34a1: call 0x180aee220 ; Torappu.Battle.BlockManager.ClearAllBlockees
0x180aa34a6: mov rcx, qword ptr [rip + 0x810e46b]
0x180aa34ad: call 0x18558e640
0x180aa34b2: test al, al
0x180aa34b4: je 0x180aa34d8
0x180aa34b6: mov rcx, qword ptr [rip + 0x810e6a3]
0x180aa34bd: call 0x18558e720
0x180aa34c2: test rax, rax
0x180aa34c5: je 0x180aa3500
0x180aa34c7: xor r9d, r9d
0x180aa34ca: mov r8d, edi
0x180aa34cd: mov rdx, rbx
0x180aa34d0: mov rcx, rax
0x180aa34d3: call 0x180658ea0 ; Torappu.Battle.BattleController.OnCharacterFinished
0x180aa34d8: mov rsi, qword ptr [rsp + 0x30]
0x180aa34dd: mov rbx, qword ptr [rsp + 0x38]
0x180aa34e2: add rsp, 0x20
0x180aa34e6: pop rdi
0x180aa34e7: ret
0x180aa34e8: xor r9d, r9d
0x180aa34eb: mov r8d, edi
0x180aa34ee: mov rdx, rbx
0x180aa34f1: mov rbx, qword ptr [rsp + 0x38]
0x180aa34f6: add rsp, 0x20
0x180aa34fa: pop rdi
0x180aa34fb: jmp 0x1833f92a0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3100
0x180aa3500: call 0x18049c3c0
0x180aa3505: int3
0x180aa3506: int3
0x180aa3507: int3
0x180aa3508: int3
0x180aa3509: int3
0x180aa350a: int3
0x180aa350b: int3
0x180aa350c: int3
0x180aa350d: int3
0x180aa350e: int3
0x180aa350f: int3
