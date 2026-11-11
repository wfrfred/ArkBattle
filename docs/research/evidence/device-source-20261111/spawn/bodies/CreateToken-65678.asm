0x180651420: push rbx
0x180651422: push rsi
0x180651423: push r12
0x180651425: push r14
0x180651427: sub rsp, 0x58
0x18065142b: cmp byte ptr [rip + 0x8949bef], 0
0x180651432: mov rsi, r9
0x180651435: mov r12d, r8d
0x180651438: mov r14, rdx
0x18065143b: mov rbx, rcx
0x18065143e: jne 0x18065145f
0x180651440: lea rcx, [rip + 0x84be7f9]
0x180651447: call 0x18049c210
0x18065144c: lea rcx, [rip + 0x853155d]
0x180651453: call 0x18049c210
0x180651458: mov byte ptr [rip + 0x8949bc2], 1
0x18065145f: mov rax, qword ptr [rip + 0x84be7da]
0x180651466: cmp dword ptr [rax + 0xe0], 0
0x18065146d: jne 0x18065147e
0x18065146f: mov rcx, rax
0x180651472: call 0x18049c450
0x180651477: mov rax, qword ptr [rip + 0x84be7c2]
0x18065147e: mov rax, qword ptr [rax + 0xb8]
0x180651485: mov qword ptr [rsp + 0x88], rdi
0x18065148d: mov rcx, qword ptr [rax + 0x8e8]
0x180651494: test rcx, rcx
0x180651497: jne 0x18065167b
0x18065149d: mov qword ptr [rsp + 0x80], rbp
0x1806514a5: mov qword ptr [rsp + 0x50], r15
0x1806514aa: test r14, r14
0x1806514ad: je 0x1806516bf
0x1806514b3: xor edx, edx
0x1806514b5: mov rcx, r14
0x1806514b8: call 0x1806f2450 ; Torappu.Battle.Deck/Card.get_data
0x1806514bd: mov rcx, qword ptr [rbx + 0x38]
0x1806514c1: mov rbp, rax
0x1806514c4: test rcx, rcx
0x1806514c7: je 0x1806516bf
0x1806514cd: xor r8d, r8d
0x1806514d0: mov rdx, rax
0x1806514d3: call 0x180926d50 ; Torappu.Battle.BattleFactory.CreateToken
0x1806514d8: mov rbx, rax
0x1806514db: test rbp, rbp
0x1806514de: je 0x1806516bf
0x1806514e4: test rax, rax
0x1806514e7: je 0x1806516bf
0x1806514ed: mov edx, dword ptr [rbp + 0x6c]
0x1806514f0: xor r8d, r8d
0x1806514f3: mov rcx, rax
0x1806514f6: call 0x180ab2b60 ; Torappu.Battle.Character.set_cardUid
0x1806514fb: xor r8d, r8d
0x1806514fe: mov rdx, rbp
0x180651501: mov rcx, rbx
0x180651504: call 0x180a9cc00 ; Torappu.Battle.Character.AssignDataForOverlapCheck
0x180651509: movzx r15d, byte ptr [rsp + 0xa0]
0x180651512: mov rdi, qword ptr [rsp + 0xb0]
0x18065151a: test r15b, r15b
0x18065151d: je 0x1806515eb
0x180651523: cmp byte ptr [rip + 0x8987546], 0
0x18065152a: mov qword ptr [rsp + 0x90], r13
0x180651532: jbe 0x18065153c
0x180651534: mov rcx, qword ptr [rbx]
0x180651537: call 0x180457010
0x18065153c: mov rdx, qword ptr [rbx]
0x18065153f: mov rcx, rbx
0x180651542: mov rax, qword ptr [rdx + 0xfb0]
0x180651549: mov rdx, qword ptr [rdx + 0xfb8]
0x180651550: call rax
0x180651552: cmp byte ptr [rip + 0x8987517], 0
0x180651559: movzx r13d, al
0x18065155d: jbe 0x180651567
0x18065155f: mov rcx, qword ptr [rbx]
0x180651562: call 0x180457010
0x180651567: mov rcx, qword ptr [rbx]
0x18065156a: mov r9, rdi
0x18065156d: mov r8, rsi
0x180651570: mov edx, r12d
0x180651573: mov r10, qword ptr [rcx + 0x1050]
0x18065157a: mov rcx, qword ptr [rcx + 0x1058]
0x180651581: mov qword ptr [rsp + 0x28], rcx
0x180651586: mov rcx, rbx
0x180651589: mov byte ptr [rsp + 0x20], r13b
0x18065158e: call r10
0x180651591: mov r13, qword ptr [rsp + 0x90]
0x180651599: test al, al
0x18065159b: je 0x1806515eb
0x18065159d: test rdi, rdi
0x1806515a0: je 0x1806516bf
0x1806515a6: mov byte ptr [rdi + 0x10], 1
0x1806515aa: mov rcx, qword ptr [rip + 0x85313ff]
0x1806515b1: cmp dword ptr [rcx + 0xe0], 0
0x1806515b8: jne 0x1806515bf
0x1806515ba: call 0x18049c450
0x1806515bf: xor edx, edx
0x1806515c1: mov rcx, rbx
0x1806515c4: call 0x182ac0360 ; Torappu.ObjectPool.PoolManager.Recycle
0x1806515c9: xor eax, eax
0x1806515cb: mov rbp, qword ptr [rsp + 0x80]
0x1806515d3: mov r15, qword ptr [rsp + 0x50]
0x1806515d8: mov rdi, qword ptr [rsp + 0x88]
0x1806515e0: add rsp, 0x58
0x1806515e4: pop r14
0x1806515e6: pop r12
0x1806515e8: pop rsi
0x1806515e9: pop rbx
0x1806515ea: ret
0x1806515eb: test rsi, rsi
0x1806515ee: je 0x1806516bf
0x1806515f4: xor r9d, r9d
0x1806515f7: movzx r8d, r15b
0x1806515fb: mov rdx, rbp
0x1806515fe: mov rcx, rsi
0x180651601: call 0x1808f1710 ; Torappu.Battle.Tile.CheckBuildable
0x180651606: test al, al
0x180651608: je 0x1806515aa
0x18065160a: test rdi, rdi
0x18065160d: je 0x1806516bf
0x180651613: mov byte ptr [rdi + 0x10], 1
0x180651617: movzx r9d, r15b
0x18065161b: xor edi, edi
0x18065161d: mov r8d, r12d
0x180651620: mov rdx, rbx
0x180651623: mov qword ptr [rsp + 0x20], rdi
0x180651628: mov rcx, rsi
0x18065162b: call 0x1808f5d70 ; Torappu.Battle.Tile.OnEntityWillBuild
0x180651630: test al, al
0x180651632: je 0x1806515aa
0x180651638: mov r9d, r12d
0x18065163b: mov qword ptr [rsp + 0x20], rdi
0x180651640: mov r8, rsi
0x180651643: mov rdx, r14
0x180651646: mov rcx, rbx
0x180651649: call 0x180a9d3a0 ; Torappu.Battle.Character.BuildAt
0x18065164e: movzx r9d, byte ptr [rsp + 0xa8]
0x180651657: movzx r8d, r15b
0x18065165b: mov rdx, rbx
0x18065165e: mov qword ptr [rsp + 0x20], rdi
0x180651663: mov rcx, rsi
0x180651666: call 0x1808f4ef0 ; Torappu.Battle.Tile.LocateCharacter
0x18065166b: test al, al
0x18065166d: je 0x1806515aa
0x180651673: mov rax, rbx
0x180651676: jmp 0x1806515cb
0x18065167b: mov rax, qword ptr [rsp + 0xb0]
0x180651683: xor edi, edi
0x180651685: mov qword ptr [rsp + 0x40], rdi
0x18065168a: mov r9d, r12d
0x18065168d: mov qword ptr [rsp + 0x38], rax
0x180651692: mov r8, r14
0x180651695: movzx eax, byte ptr [rsp + 0xa8]
0x18065169d: mov rdx, rbx
0x1806516a0: mov byte ptr [rsp + 0x30], al
0x1806516a4: movzx eax, byte ptr [rsp + 0xa0]
0x1806516ac: mov byte ptr [rsp + 0x28], al
0x1806516b0: mov qword ptr [rsp + 0x20], rsi
0x1806516b5: call 0x1833db650 ; XLua.DelegateBridge.__Gen_Delegate_Imp2910
0x1806516ba: jmp 0x1806515d8
0x1806516bf: call 0x18049c3c0
0x1806516c4: int3
0x1806516c5: int3
0x1806516c6: int3
0x1806516c7: int3
0x1806516c8: int3
0x1806516c9: int3
0x1806516ca: int3
0x1806516cb: int3
0x1806516cc: int3
0x1806516cd: int3
0x1806516ce: int3
0x1806516cf: int3
