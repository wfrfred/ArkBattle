0x1806e0510: mov qword ptr [rsp + 8], rbx
0x1806e0515: mov qword ptr [rsp + 0x10], rsi
0x1806e051a: push rdi
0x1806e051b: sub rsp, 0x20
0x1806e051f: cmp byte ptr [rip + 0x88bae6f], 0
0x1806e0526: mov rsi, rcx
0x1806e0529: jne 0x1806e054a
0x1806e052b: lea rcx, [rip + 0x856cdae]
0x1806e0532: call 0x18049c210
0x1806e0537: lea rcx, [rip + 0x856cfea]
0x1806e053e: call 0x18049c210
0x1806e0543: mov byte ptr [rip + 0x88bae4b], 1
0x1806e054a: mov rax, qword ptr [rsi + 0x10]
0x1806e054e: xor edi, edi
0x1806e0550: mov ebx, edi
0x1806e0552: test rax, rax
0x1806e0555: je 0x1806e0647
0x1806e055b: nop dword ptr [rax + rax]
0x1806e0560: mov rdx, qword ptr [rip + 0x856cfc1]
0x1806e0567: mov rcx, rax
0x1806e056a: call 0x184af5400
0x1806e056f: cmp ebx, eax
0x1806e0571: jge 0x1806e0637
0x1806e0577: mov rcx, qword ptr [rsi + 0x10]
0x1806e057b: test rcx, rcx
0x1806e057e: je 0x1806e0647
0x1806e0584: mov r8, qword ptr [rip + 0x856cd55]
0x1806e058b: mov edx, edi
0x1806e058d: call 0x184cde840
0x1806e0592: mov rbx, rax
0x1806e0595: test rax, rax
0x1806e0598: je 0x1806e0647
0x1806e059e: cmp byte ptr [rip + 0x88bad37], 0
0x1806e05a5: jne 0x1806e05ba
0x1806e05a7: lea rcx, [rip + 0x84644aa]
0x1806e05ae: call 0x18049c210
0x1806e05b3: mov byte ptr [rip + 0x88bad22], 1
0x1806e05ba: mov rax, qword ptr [rip + 0x8464497]
0x1806e05c1: cmp dword ptr [rax + 0xe0], 0
0x1806e05c8: jne 0x1806e05d9
0x1806e05ca: mov rcx, rax
0x1806e05cd: call 0x18049c450
0x1806e05d2: mov rax, qword ptr [rip + 0x846447f]
0x1806e05d9: mov rax, qword ptr [rax + 0xb8]
0x1806e05e0: mov rcx, qword ptr [rax + 0x260]
0x1806e05e7: test rcx, rcx
0x1806e05ea: jne 0x1806e0617
0x1806e05ec: cmp byte ptr [rbx + 0x1fa], cl
0x1806e05f2: jne 0x1806e0625
0x1806e05f4: xor r8d, r8d
0x1806e05f7: xor edx, edx
0x1806e05f9: mov rcx, rbx
0x1806e05fc: call 0x1806df330 ; Torappu.Battle.Buff.set_isEnabled
0x1806e0601: xor r8d, r8d
0x1806e0604: mov byte ptr [rbx + 0x1fa], 1
0x1806e060b: xor edx, edx
0x1806e060d: mov rcx, rbx
0x1806e0610: call 0x1806ce520 ; Torappu.Battle.Buff.ClearDerivedBuffsIfNot
0x1806e0615: jmp 0x1806e0625
0x1806e0617: xor r9d, r9d
0x1806e061a: xor r8d, r8d
0x1806e061d: mov rdx, rbx
0x1806e0620: call 0x1833ba950 ; XLua.DelegateBridge.__Gen_Delegate_Imp26
0x1806e0625: mov rax, qword ptr [rsi + 0x10]
0x1806e0629: inc edi
0x1806e062b: mov ebx, edi
0x1806e062d: test rax, rax
0x1806e0630: je 0x1806e0647
0x1806e0632: jmp 0x1806e0560
0x1806e0637: mov rbx, qword ptr [rsp + 0x30]
0x1806e063c: mov rsi, qword ptr [rsp + 0x38]
0x1806e0641: add rsp, 0x20
0x1806e0645: pop rdi
0x1806e0646: ret
0x1806e0647: call 0x18049c3c0
0x1806e064c: int3
0x1806e064d: int3
0x1806e064e: int3
0x1806e064f: int3
