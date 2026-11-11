0x180602450: mov qword ptr [rsp + 0x18], rbx
0x180602455: push rsi
0x180602456: sub rsp, 0x30
0x18060245a: cmp byte ptr [rip + 0x89987b3], 0
0x180602461: mov rsi, rdx
0x180602464: mov rbx, rcx
0x180602467: jne 0x180602494
0x180602469: lea rcx, [rip + 0x852e760]
0x180602470: call 0x18049c210
0x180602475: lea rcx, [rip + 0x860e3e4]
0x18060247c: call 0x18049c210
0x180602481: lea rcx, [rip + 0x85775d0]
0x180602488: call 0x18049c210
0x18060248d: mov byte ptr [rip + 0x8998780], 1
0x180602494: mov rax, qword ptr [rip + 0x852e735]
0x18060249b: mov rcx, qword ptr [rax + 0xb8]
0x1806024a2: mov rcx, qword ptr [rcx + 0x188]
0x1806024a9: xor r9d, r9d
0x1806024ac: test rcx, rcx
0x1806024af: jne 0x1806026a6
0x1806024b5: mov r8, rbx
0x1806024b8: mov rdx, rsi
0x1806024bb: mov rcx, rbx
0x1806024be: call 0x180750650 ; Torappu.Battle.Entity/FriendComponent.AttachAbilityToEntity
0x1806024c3: mov r8, qword ptr [rip + 0x860e396]
0x1806024ca: lea rcx, [rsp + 0x20]
0x1806024cf: mov rdx, rsi
0x1806024d2: call 0x1853ae8f0
0x1806024d7: movups xmm0, xmmword ptr [rsp + 0x20]
0x1806024dc: lea rcx, [rbx + 0x50]
0x1806024e0: xor edx, edx
0x1806024e2: movups xmmword ptr [rbx + 0x50], xmm0
0x1806024e6: call 0x18049bcf0
0x1806024eb: cmp byte ptr [rip + 0x89d657e], 0
0x1806024f2: jbe 0x1806024fc
0x1806024f4: mov rcx, qword ptr [rbx]
0x1806024f7: call 0x180457010
0x1806024fc: mov rdx, qword ptr [rbx]
0x1806024ff: mov rcx, rbx
0x180602502: mov qword ptr [rsp + 0x40], rbp
0x180602507: mov qword ptr [rsp + 0x48], rdi
0x18060250c: mov rax, qword ptr [rdx + 0x400]
0x180602513: mov rdx, qword ptr [rdx + 0x408]
0x18060251a: call rax
0x18060251c: mov rdx, qword ptr [rip + 0x8577535]
0x180602523: test rsi, rsi
0x180602526: je 0x180602636
0x18060252c: cmp byte ptr [rip + 0x89d653d], 0
0x180602533: mov ebp, 1
0x180602538: mov r8, qword ptr [rsi]
0x18060253b: jbe 0x180602552
0x18060253d: mov rcx, r8
0x180602540: call 0x1804566f0
0x180602545: mov rdx, qword ptr [rip + 0x857750c]
0x18060254c: xor edi, edi
0x18060254e: test al, al
0x180602550: jmp 0x18060257b
0x180602552: movzx eax, byte ptr [rdx + 0x130]
0x180602559: xor edi, edi
0x18060255b: cmp byte ptr [r8 + 0x130], al
0x180602562: jb 0x180602577
0x180602564: movzx ecx, al
0x180602567: mov rax, qword ptr [r8 + 0xc8]
0x18060256e: cmp qword ptr [rax + rcx*8 - 8], rdx
0x180602573: mov eax, ebp
0x180602575: je 0x180602579
0x180602577: mov eax, edi
0x180602579: test eax, eax
0x18060257b: mov rcx, rdi
0x18060257e: cmovne rcx, rsi
0x180602582: test rcx, rcx
0x180602585: je 0x180602636
0x18060258b: cmp byte ptr [rip + 0x89d64de], 0
0x180602592: mov r8, qword ptr [rsi]
0x180602595: jbe 0x1806025aa
0x180602597: mov rcx, r8
0x18060259a: call 0x1804566f0
0x18060259f: mov rdx, qword ptr [rip + 0x85774b2]
0x1806025a6: test al, al
0x1806025a8: jmp 0x1806025d1
0x1806025aa: movzx eax, byte ptr [rdx + 0x130]
0x1806025b1: cmp byte ptr [r8 + 0x130], al
0x1806025b8: jb 0x1806025cd
0x1806025ba: movzx ecx, al
0x1806025bd: mov rax, qword ptr [r8 + 0xc8]
0x1806025c4: cmp qword ptr [rax + rcx*8 - 8], rdx
0x1806025c9: mov eax, ebp
0x1806025cb: je 0x1806025cf
0x1806025cd: mov eax, edi
0x1806025cf: test eax, eax
0x1806025d1: mov rcx, rdi
0x1806025d4: cmovne rcx, rsi
0x1806025d8: test rcx, rcx
0x1806025db: je 0x1806026bb
0x1806025e1: cmp byte ptr [rip + 0x89d6488], 0
0x1806025e8: mov r8, qword ptr [rsi]
0x1806025eb: jbe 0x1806025f9
0x1806025ed: mov rcx, r8
0x1806025f0: call 0x1804566f0
0x1806025f5: test al, al
0x1806025f7: jmp 0x18060261e
0x1806025f9: movzx eax, byte ptr [rdx + 0x130]
0x180602600: cmp byte ptr [r8 + 0x130], al
0x180602607: jb 0x18060261a
0x180602609: movzx ecx, al
0x18060260c: mov rax, qword ptr [r8 + 0xc8]
0x180602613: cmp qword ptr [rax + rcx*8 - 8], rdx
0x180602618: je 0x18060261c
0x18060261a: mov ebp, edi
0x18060261c: test ebp, ebp
0x18060261e: cmovne rdi, rsi
0x180602622: xor edx, edx
0x180602624: mov rcx, rdi
0x180602627: call 0x180b21a40 ; Torappu.Battle.Unit.get_isDummy
0x18060262c: test al, al
0x18060262e: je 0x180602636
0x180602630: cmp byte ptr [rbx + 0x49], 0
0x180602634: je 0x18060265d
0x180602636: cmp byte ptr [rip + 0x89d6433], 0
0x18060263d: jbe 0x180602647
0x18060263f: mov rcx, qword ptr [rbx]
0x180602642: call 0x180457010
0x180602647: mov rdx, qword ptr [rbx]
0x18060264a: mov rcx, rbx
0x18060264d: mov rax, qword ptr [rdx + 0x560]
0x180602654: mov rdx, qword ptr [rdx + 0x568]
0x18060265b: call rax
0x18060265d: xor r8d, r8d
0x180602660: mov dl, 1
0x180602662: mov rcx, rbx
0x180602665: call 0x180605f00 ; Torappu.Battle.Ability.set_isAttached
0x18060266a: cmp byte ptr [rip + 0x89d63ff], 0
0x180602671: jbe 0x18060267b
0x180602673: mov rcx, qword ptr [rbx]
0x180602676: call 0x180457010
0x18060267b: mov rdx, qword ptr [rbx]
0x18060267e: mov rcx, rbx
0x180602681: mov rax, qword ptr [rdx + 0x4c0]
0x180602688: mov rdx, qword ptr [rdx + 0x4c8]
0x18060268f: mov rbp, qword ptr [rsp + 0x40]
0x180602694: mov rdi, qword ptr [rsp + 0x48]
0x180602699: mov rbx, qword ptr [rsp + 0x50]
0x18060269e: add rsp, 0x30
0x1806026a2: pop rsi
0x1806026a3: jmp rax
0x1806026a6: mov r8, rsi
0x1806026a9: mov rdx, rbx
0x1806026ac: mov rbx, qword ptr [rsp + 0x50]
0x1806026b1: add rsp, 0x30
0x1806026b5: pop rsi
0x1806026b6: jmp 0x18338c7c0 ; XLua.DelegateBridge.__Gen_Delegate_Imp23
0x1806026bb: call 0x18049c3c0
0x1806026c0: int3
0x1806026c1: int3
0x1806026c2: int3
0x1806026c3: int3
0x1806026c4: int3
0x1806026c5: int3
0x1806026c6: int3
0x1806026c7: int3
0x1806026c8: int3
0x1806026c9: int3
0x1806026ca: int3
0x1806026cb: int3
0x1806026cc: int3
0x1806026cd: int3
0x1806026ce: int3
0x1806026cf: int3
