0x1810bf5b0: mov qword ptr [rsp + 0x10], rdx
0x1810bf5b5: push rbx
0x1810bf5b6: push rsi
0x1810bf5b7: push rdi
0x1810bf5b8: push r15
0x1810bf5ba: sub rsp, 0x78
0x1810bf5be: cmp byte ptr [rip + 0x7ee2190], 0
0x1810bf5c5: mov r15, r9
0x1810bf5c8: mov ebx, r8d
0x1810bf5cb: mov rsi, rdx
0x1810bf5ce: mov rdi, rcx
0x1810bf5d1: jne 0x1810bf60a
0x1810bf5d3: lea rcx, [rip + 0x7a6a0ee]
0x1810bf5da: call 0x18049c210
0x1810bf5df: lea rcx, [rip + 0x7a85472]
0x1810bf5e6: call 0x18049c210
0x1810bf5eb: lea rcx, [rip + 0x7b2c64e]
0x1810bf5f2: call 0x18049c210
0x1810bf5f7: lea rcx, [rip + 0x7a60a52]
0x1810bf5fe: call 0x18049c210
0x1810bf603: mov byte ptr [rip + 0x7ee214b], 1
0x1810bf60a: mov rax, qword ptr [rip + 0x7b2c62f]
0x1810bf611: mov rcx, qword ptr [rax + 0xb8]
0x1810bf618: mov rcx, qword ptr [rcx + 0x10]
0x1810bf61c: test rcx, rcx
0x1810bf61f: jne 0x1810bf93b
0x1810bf625: mov qword ptr [rsp + 0xa0], rbp
0x1810bf62d: mov edx, dword ptr [rdi + 0x18]
0x1810bf630: xor r8d, r8d
0x1810bf633: mov rcx, r15
0x1810bf636: call 0x18107acb0 ; Torappu.Battle.Action.Nodes.GetActionTarget
0x1810bf63b: mov rcx, qword ptr [rip + 0x7a60a0e]
0x1810bf642: mov rbp, rax
0x1810bf645: mov qword ptr [rsp + 0x50], rax
0x1810bf64a: cmp dword ptr [rcx + 0xe0], 0
0x1810bf651: jne 0x1810bf658
0x1810bf653: call 0x18049c450
0x1810bf658: xor r8d, r8d
0x1810bf65b: xor edx, edx
0x1810bf65d: mov rcx, rbp
0x1810bf660: call 0x186dcf290 ; UnityEngine.Object.op_Equality
0x1810bf665: test al, al
0x1810bf667: jne 0x1810bf937
0x1810bf66d: mov qword ptr [rsp + 0xb0], r13
0x1810bf675: mov qword ptr [rsp + 0x70], r14
0x1810bf67a: xor r13d, r13d
0x1810bf67d: mov qword ptr [rsp + 0x58], r13
0x1810bf682: cmp qword ptr [r15 + 0x10], r13
0x1810bf686: je 0x1810bf6af
0x1810bf688: mov rcx, qword ptr [r15 + 0x10]
0x1810bf68c: xor edx, edx
0x1810bf68e: call 0x1806de7e0 ; Torappu.Battle.Buff.get_source
0x1810bf693: mov rcx, qword ptr [r15 + 0x10]
0x1810bf697: mov r13, rax
0x1810bf69a: test rcx, rcx
0x1810bf69d: je 0x1810bf967
0x1810bf6a3: xor edx, edx
0x1810bf6a5: call 0x1806dd330 ; Torappu.Battle.Buff.get_ability
0x1810bf6aa: mov qword ptr [rsp + 0x58], rax
0x1810bf6af: cmp byte ptr [rdi + 0x1c], 0
0x1810bf6b3: je 0x1810bf6c6
0x1810bf6b5: mov edx, dword ptr [rdi + 0x20]
0x1810bf6b8: xor r8d, r8d
0x1810bf6bb: mov rcx, r15
0x1810bf6be: call 0x18107acb0 ; Torappu.Battle.Action.Nodes.GetActionTarget
0x1810bf6c3: mov r13, rax
0x1810bf6c6: xor r14d, r14d
0x1810bf6c9: cmp byte ptr [rdi + 0x27], r14b
0x1810bf6cd: je 0x1810bf833
0x1810bf6d3: cmp byte ptr [rip + 0x7f19396], r14b
0x1810bf6da: jbe 0x1810bf6e4
0x1810bf6dc: mov rcx, qword ptr [rdi]
0x1810bf6df: call 0x180457010
0x1810bf6e4: mov rdx, qword ptr [rdi]
0x1810bf6e7: mov rcx, rdi
0x1810bf6ea: mov rax, qword ptr [rdx + 0x1c0]
0x1810bf6f1: mov rdx, qword ptr [rdx + 0x1c8]
0x1810bf6f8: call rax
0x1810bf6fa: test rax, rax
0x1810bf6fd: je 0x1810bf967
0x1810bf703: cmp byte ptr [rip + 0x7ee204d], 0
0x1810bf70a: mov r14, qword ptr [rax + 0x60]
0x1810bf70e: jne 0x1810bf72f
0x1810bf710: lea rcx, [rip + 0x7b2c529]
0x1810bf717: call 0x18049c210
0x1810bf71c: lea rcx, [rip + 0x7a6092d]
0x1810bf723: call 0x18049c210
0x1810bf728: mov byte ptr [rip + 0x7ee2028], 1
0x1810bf72f: mov rax, qword ptr [rip + 0x7b2c50a]
0x1810bf736: mov rcx, qword ptr [rax + 0xb8]
0x1810bf73d: mov rcx, qword ptr [rcx + 0x20]
0x1810bf741: test rcx, rcx
0x1810bf744: jne 0x1810bf819
0x1810bf74a: cmp qword ptr [r15 + 0x10], rcx
0x1810bf74e: je 0x1810bf833
0x1810bf754: mov rcx, qword ptr [r15 + 0x10]
0x1810bf758: xor edx, edx
0x1810bf75a: call 0x1806de750 ; Torappu.Battle.Buff.get_sourceProjectile
0x1810bf75f: mov rcx, qword ptr [rip + 0x7a608ea]
0x1810bf766: mov rbx, rax
0x1810bf769: cmp dword ptr [rcx + 0xe0], 0
0x1810bf770: jne 0x1810bf777
0x1810bf772: call 0x18049c450
0x1810bf777: xor r8d, r8d
0x1810bf77a: xor edx, edx
0x1810bf77c: mov rcx, rbx
0x1810bf77f: call 0x186dcf290 ; UnityEngine.Object.op_Equality
0x1810bf784: test al, al
0x1810bf786: jne 0x1810bf833
0x1810bf78c: test rbx, rbx
0x1810bf78f: je 0x1810bf967
0x1810bf795: xor edx, edx
0x1810bf797: mov rcx, rbx
0x1810bf79a: call 0x18091bac0 ; Torappu.Battle.Projectile.get_effectReplacePairs
0x1810bf79f: test rax, rax
0x1810bf7a2: je 0x1810bf833
0x1810bf7a8: xor edx, edx
0x1810bf7aa: mov rcx, rbx
0x1810bf7ad: call 0x18091bac0 ; Torappu.Battle.Projectile.get_effectReplacePairs
0x1810bf7b2: mov rsi, rax
0x1810bf7b5: xor ebx, ebx
0x1810bf7b7: xor eax, eax
0x1810bf7b9: test rsi, rsi
0x1810bf7bc: je 0x1810bf967
0x1810bf7c2: lea rbp, [rsi + 0x20]
0x1810bf7c6: cmp eax, dword ptr [rsi + 0x18]
0x1810bf7c9: jge 0x1810bf80a
0x1810bf7cb: cmp ebx, dword ptr [rsi + 0x18]
0x1810bf7ce: jae 0x1810bf961
0x1810bf7d4: movups xmm0, xmmword ptr [rbp]
0x1810bf7d8: xor r8d, r8d
0x1810bf7db: mov rdx, r14
0x1810bf7de: movq rcx, xmm0
0x1810bf7e3: movups xmmword ptr [rsp + 0x60], xmm0
0x1810bf7e8: call 0x186017430 ; System.String.Equals | System.String.op_Equality
0x1810bf7ed: test al, al
0x1810bf7ef: jne 0x1810bf7fb
0x1810bf7f1: inc ebx
0x1810bf7f3: add rbp, 0x10
0x1810bf7f7: mov eax, ebx
0x1810bf7f9: jmp 0x1810bf7c6
0x1810bf7fb: movups xmm0, xmmword ptr [rsp + 0x60]
0x1810bf800: psrldq xmm0, 8
0x1810bf805: movq r14, xmm0
0x1810bf80a: mov rbp, qword ptr [rsp + 0x50]
0x1810bf80f: mov rsi, qword ptr [rsp + 0xa8]
0x1810bf817: jmp 0x1810bf833
0x1810bf819: mov r9, r14
0x1810bf81c: mov qword ptr [rsp + 0x20], 0
0x1810bf825: mov r8, r15
0x1810bf828: mov rdx, rdi
0x1810bf82b: call 0x1831bf9f0 ; XLua.DelegateBridge.__Gen_Delegate_Imp11428
0x1810bf830: mov r14, rax
0x1810bf833: mov rcx, qword ptr [rip + 0x7a69e8e]
0x1810bf83a: call 0x18046d2f0
0x1810bf83f: mov rbx, rax
0x1810bf842: test rax, rax
0x1810bf845: je 0x1810bf967
0x1810bf84b: xor r8d, r8d
0x1810bf84e: mov rdx, rsi
0x1810bf851: mov rcx, rax
0x1810bf854: call 0x18237a000 ; Torappu.Blackboard..ctor
0x1810bf859: cmp byte ptr [rip + 0x7f19210], 0
0x1810bf860: jbe 0x1810bf86a
0x1810bf862: mov rcx, qword ptr [rdi]
0x1810bf865: call 0x180457010
0x1810bf86a: mov rdx, qword ptr [rdi]
0x1810bf86d: mov rcx, rdi
0x1810bf870: mov rax, qword ptr [rdx + 0x1c0]
0x1810bf877: mov rdx, qword ptr [rdx + 0x1c8]
0x1810bf87e: call rax
0x1810bf880: cmp byte ptr [rdi + 0x26], 0
0x1810bf884: mov rsi, rax
0x1810bf887: je 0x1810bf89f
0x1810bf889: mov rcx, qword ptr [r15 + 0x10]
0x1810bf88d: test rcx, rcx
0x1810bf890: je 0x1810bf967
0x1810bf896: xor edx, edx
0x1810bf898: call 0x1806de750 ; Torappu.Battle.Buff.get_sourceProjectile
0x1810bf89d: jmp 0x1810bf8a1
0x1810bf89f: xor eax, eax
0x1810bf8a1: test rbp, rbp
0x1810bf8a4: je 0x1810bf967
0x1810bf8aa: mov r9, qword ptr [rsp + 0x58]
0x1810bf8af: mov r8, r13
0x1810bf8b2: mov qword ptr [rsp + 0x40], 0
0x1810bf8bb: mov rdx, rsi
0x1810bf8be: mov qword ptr [rsp + 0x38], r14
0x1810bf8c3: mov rcx, rbp
0x1810bf8c6: mov qword ptr [rsp + 0x30], rax
0x1810bf8cb: mov qword ptr [rsp + 0x28], 0
0x1810bf8d4: mov qword ptr [rsp + 0x20], rbx
0x1810bf8d9: call 0x1807208c0 ; Torappu.Battle.Entity.AddBuff
0x1810bf8de: cmp byte ptr [rdi + 0x24], 0
0x1810bf8e2: mov rsi, rax
0x1810bf8e5: je 0x1810bf916
0x1810bf8e7: mov rcx, qword ptr [rip + 0x7a8516a]
0x1810bf8ee: mov rbx, qword ptr [r15 + 0x10]
0x1810bf8f2: movzx edi, byte ptr [rdi + 0x25]
0x1810bf8f6: cmp dword ptr [rcx + 0xe0], 0
0x1810bf8fd: jne 0x1810bf904
0x1810bf8ff: call 0x18049c450
0x1810bf904: xor r9d, r9d
0x1810bf907: movzx r8d, dil
0x1810bf90b: mov rdx, rsi
0x1810bf90e: mov rcx, rbx
0x1810bf911: call 0x1806cdea0 ; Torappu.Battle.Buff.AddDerivedBuffSafe
0x1810bf916: mov r14, qword ptr [rsp + 0x70]
0x1810bf91b: mov al, 1
0x1810bf91d: mov r13, qword ptr [rsp + 0xb0]
0x1810bf925: mov rbp, qword ptr [rsp + 0xa0]
0x1810bf92d: add rsp, 0x78
0x1810bf931: pop r15
0x1810bf933: pop rdi
0x1810bf934: pop rsi
0x1810bf935: pop rbx
0x1810bf936: ret
0x1810bf937: xor al, al
0x1810bf939: jmp 0x1810bf925
0x1810bf93b: mov qword ptr [rsp + 0x28], 0
0x1810bf944: mov r9d, ebx
0x1810bf947: mov r8, rsi
0x1810bf94a: mov qword ptr [rsp + 0x20], r15
0x1810bf94f: mov rdx, rdi
0x1810bf952: call 0x1831be380 ; XLua.DelegateBridge.__Gen_Delegate_Imp11420
0x1810bf957: add rsp, 0x78
0x1810bf95b: pop r15
0x1810bf95d: pop rdi
0x1810bf95e: pop rsi
0x1810bf95f: pop rbx
0x1810bf960: ret
0x1810bf961: call 0x18049c3b0
0x1810bf966: int3
0x1810bf967: call 0x18049c3c0
0x1810bf96c: int3
0x1810bf96d: int3
0x1810bf96e: int3
0x1810bf96f: int3
