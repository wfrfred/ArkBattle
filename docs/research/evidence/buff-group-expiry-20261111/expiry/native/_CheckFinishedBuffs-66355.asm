0x1806cc320: mov qword ptr [rsp + 8], rcx
0x1806cc325: push rbx
0x1806cc326: push rsi
0x1806cc327: push rdi
0x1806cc328: push r12
0x1806cc32a: push r13
0x1806cc32c: push r14
0x1806cc32e: push r15
0x1806cc330: sub rsp, 0x60
0x1806cc334: mov r13, rcx
0x1806cc337: cmp byte ptr [rip + 0x88cf099], 0
0x1806cc33e: jne 0x1806cc39b
0x1806cc340: lea rcx, [rip + 0x859ea79]
0x1806cc347: call 0x18049c210
0x1806cc34c: lea rcx, [rip + 0x8584f2d]
0x1806cc353: call 0x18049c210
0x1806cc358: lea rcx, [rip + 0x8523571]
0x1806cc35f: call 0x18049c210
0x1806cc364: lea rcx, [rip + 0x8473415]
0x1806cc36b: call 0x18049c210
0x1806cc370: lea rcx, [rip + 0x852e3a9]
0x1806cc377: call 0x18049c210
0x1806cc37c: lea rcx, [rip + 0x8478615]
0x1806cc383: call 0x18049c210
0x1806cc388: lea rcx, [rip + 0x853fda1]
0x1806cc38f: call 0x18049c210
0x1806cc394: mov byte ptr [rip + 0x88cf03c], 1
0x1806cc39b: xorps xmm0, xmm0
0x1806cc39e: movups xmmword ptr [rsp + 0x40], xmm0
0x1806cc3a3: xor r12d, r12d
0x1806cc3a6: mov qword ptr [rsp + 0x20], r12
0x1806cc3ab: mov rax, qword ptr [rip + 0x859ea0e]
0x1806cc3b2: mov rcx, qword ptr [rax + 0xb8]
0x1806cc3b9: mov rcx, qword ptr [rcx + 0x1f0]
0x1806cc3c0: test rcx, rcx
0x1806cc3c3: jne 0x1806cc712
0x1806cc3c9: xor r15b, r15b
0x1806cc3cc: mov byte ptr [rsp + 0xb0], r15b
0x1806cc3d4: mov rcx, qword ptr [r13 + 0x18]
0x1806cc3d8: test rcx, rcx
0x1806cc3db: je 0x1806cc74f
0x1806cc3e1: mov rdx, qword ptr [rip + 0x85234e8]
0x1806cc3e8: call 0x185c94e80
0x1806cc3ed: mov qword ptr [rsp + 0xb8], rax
0x1806cc3f5: mov qword ptr [rsp + 0x30], r12
0x1806cc3fa: lea rbx, [rsp + 0xb8]
0x1806cc402: mov qword ptr [rsp + 0x38], rbx
0x1806cc407: nop word ptr [rax + rax]
0x1806cc410: mov r8, qword ptr [rsp + 0xb8]
0x1806cc418: test r8, r8
0x1806cc41b: je 0x1806cc73d
0x1806cc421: xor ecx, ecx
0x1806cc423: mov rdx, qword ptr [rip + 0x847856e]
0x1806cc42a: call 0x180005310
0x1806cc42f: test al, al
0x1806cc431: je 0x1806cc58f
0x1806cc437: mov rdi, qword ptr [rsp + 0xb8]
0x1806cc43f: test rdi, rdi
0x1806cc442: je 0x1806cc738
0x1806cc448: mov rsi, qword ptr [rip + 0x852e2d1]
0x1806cc44f: mov r14, qword ptr [rdi]
0x1806cc452: cmp byte ptr [rip + 0x890c617], 0
0x1806cc459: je 0x1806cc463
0x1806cc45b: mov rcx, r14
0x1806cc45e: call 0x180457010
0x1806cc463: movzx ecx, r12w
0x1806cc467: movzx edx, word ptr [r14 + 0x12e]
0x1806cc46f: cmp r12w, dx
0x1806cc473: jae 0x1806cc494
0x1806cc475: mov r8, qword ptr [r14 + 0xb0]
0x1806cc47c: nop dword ptr [rax]
0x1806cc480: movzx eax, cx
0x1806cc483: add rax, rax
0x1806cc486: cmp qword ptr [r8 + rax*8], rsi
0x1806cc48a: je 0x1806cc4e7
0x1806cc48c: inc cx
0x1806cc48f: cmp cx, dx
0x1806cc492: jb 0x1806cc480
0x1806cc494: xor r8d, r8d
0x1806cc497: mov rdx, rsi
0x1806cc49a: mov rcx, rdi
0x1806cc49d: call 0x180455fd0
0x1806cc4a2: mov r8, rax
0x1806cc4a5: mov rax, qword ptr [r8]
0x1806cc4a8: mov r8, qword ptr [r8 + 8]
0x1806cc4ac: mov rdx, rdi
0x1806cc4af: lea rcx, [rsp + 0x50]
0x1806cc4b4: call rax
0x1806cc4b6: movups xmm0, xmmword ptr [rax]
0x1806cc4b9: movups xmmword ptr [rsp + 0x40], xmm0
0x1806cc4be: mov rdx, qword ptr [rip + 0x853fc6b]
0x1806cc4c5: lea rcx, [rsp + 0x40]
0x1806cc4ca: call 0x1853ae540
0x1806cc4cf: mov rdi, rax
0x1806cc4d2: test rax, rax
0x1806cc4d5: jne 0x1806cc4ff
0x1806cc4d7: mov r15b, 1
0x1806cc4da: mov byte ptr [rsp + 0xb0], r15b
0x1806cc4e2: jmp 0x1806cc410
0x1806cc4e7: movzx ecx, cx
0x1806cc4ea: add rcx, rcx
0x1806cc4ed: movsxd r8, dword ptr [r8 + rcx*8 + 8]
0x1806cc4f2: add r8, 0x14
0x1806cc4f6: shl r8, 4
0x1806cc4fa: add r8, r14
0x1806cc4fd: jmp 0x1806cc4a5
0x1806cc4ff: xor edx, edx
0x1806cc501: mov rcx, rdi
0x1806cc504: call 0x1806ddd60 ; Torappu.Battle.Buff.get_isFinished
0x1806cc509: test al, al
0x1806cc50b: je 0x1806cc410
0x1806cc511: xor r8d, r8d
0x1806cc514: mov rdx, rdi
0x1806cc517: mov rcx, r13
0x1806cc51a: call 0x1806cd650 ; Torappu.Battle.Buff/BuffContainer._FinishAndRemoveBuff
0x1806cc51f: xor edx, edx
0x1806cc521: mov rcx, rdi
0x1806cc524: call 0x1806de2a0 ; Torappu.Battle.Buff.get_overrideKey
0x1806cc529: xor edx, edx
0x1806cc52b: mov rcx, rax
0x1806cc52e: call 0x18601a180 ; System.String.IsNullOrEmpty
0x1806cc533: test al, al
0x1806cc535: jne 0x1806cc410
0x1806cc53b: mov rsi, qword ptr [r13 + 0x20]
0x1806cc53f: xor edx, edx
0x1806cc541: mov rcx, rdi
0x1806cc544: call 0x1806de2a0 ; Torappu.Battle.Buff.get_overrideKey
0x1806cc549: test rsi, rsi
0x1806cc54c: je 0x1806cc733
0x1806cc552: mov r9, qword ptr [rip + 0x8584d27]
0x1806cc559: lea r8, [rsp + 0x20]
0x1806cc55e: mov rdx, rax
0x1806cc561: mov rcx, rsi
0x1806cc564: call 0x185b2cad0
0x1806cc569: test al, al
0x1806cc56b: je 0x1806cc410
0x1806cc571: mov rcx, qword ptr [rsp + 0x20]
0x1806cc576: test rcx, rcx
0x1806cc579: je 0x1806cc72d
0x1806cc57f: xor r8d, r8d
0x1806cc582: mov rdx, rdi
0x1806cc585: call 0x1806e06f0 ; Torappu.Battle.Buff/OverrideGroup.Remove
0x1806cc58a: jmp 0x1806cc410
0x1806cc58f: cmp qword ptr [rbx], 0
0x1806cc593: je 0x1806cc5a6
0x1806cc595: xor ecx, ecx
0x1806cc597: mov r8, qword ptr [rbx]
0x1806cc59a: mov rdx, qword ptr [rip + 0x84731df]
0x1806cc5a1: call 0x180005310
0x1806cc5a6: jmp 0x1806cc5e3
0x1806cc5a8: mov r8, qword ptr [rsp + 0x38]
0x1806cc5ad: cmp qword ptr [r8], 0
0x1806cc5b1: je 0x1806cc5c4
0x1806cc5b3: xor ecx, ecx
0x1806cc5b5: mov r8, qword ptr [r8]
0x1806cc5b8: mov rdx, qword ptr [rip + 0x84731c1]
0x1806cc5bf: call 0x180005310
0x1806cc5c4: mov rcx, qword ptr [rsp + 0x30]
0x1806cc5c9: test rcx, rcx
0x1806cc5cc: jne 0x1806cc743
0x1806cc5d2: mov r13, qword ptr [rsp + 0xa0]
0x1806cc5da: movzx r15d, byte ptr [rsp + 0xb0]
0x1806cc5e3: test r15b, r15b
0x1806cc5e6: je 0x1806cc71d
0x1806cc5ec: mov rdi, qword ptr [r13 + 0x18]
0x1806cc5f0: test rdi, rdi
0x1806cc5f3: je 0x1806cc74f
0x1806cc5f9: cmp byte ptr [rip + 0x88ced89], 0
0x1806cc600: jne 0x1806cc651
0x1806cc602: lea rcx, [rip + 0x859e9ff]
0x1806cc609: call 0x18049c210
0x1806cc60e: lea rcx, [rip + 0x8523753]
0x1806cc615: call 0x18049c210
0x1806cc61a: lea rcx, [rip + 0x84b2617]
0x1806cc621: call 0x18049c210
0x1806cc626: lea rcx, [rip + 0x84b2aab]
0x1806cc62d: call 0x18049c210
0x1806cc632: lea rcx, [rip + 0x84b2cef]
0x1806cc639: call 0x18049c210
0x1806cc63e: lea rcx, [rip + 0x853ff83]
0x1806cc645: call 0x18049c210
0x1806cc64a: mov byte ptr [rip + 0x88ced38], 1
0x1806cc651: xorps xmm0, xmm0
0x1806cc654: movups xmmword ptr [rsp + 0x30], xmm0
0x1806cc659: mov rax, qword ptr [rip + 0x859e9a8]
0x1806cc660: mov rcx, qword ptr [rax + 0xb8]
0x1806cc667: mov rcx, qword ptr [rcx + 8]
0x1806cc66b: test rcx, rcx
0x1806cc66e: jne 0x1806cc70d
0x1806cc674: mov rdx, qword ptr [rip + 0x85236ed]
0x1806cc67b: mov rcx, rdi
0x1806cc67e: call 0x185c96c80
0x1806cc683: test al, al
0x1806cc685: jne 0x1806cc71d
0x1806cc68b: mov rbx, qword ptr [rdi + 0x10]
0x1806cc68f: test rbx, rbx
0x1806cc692: je 0x1806cc749
0x1806cc698: mov ebx, dword ptr [rbx + 0x18]
0x1806cc69b: sub ebx, 1
0x1806cc69e: js 0x1806cc71d
0x1806cc6a0: mov rdx, qword ptr [rdi + 0x10]
0x1806cc6a4: test rdx, rdx
0x1806cc6a7: je 0x1806cc749
0x1806cc6ad: mov r9, qword ptr [rip + 0x84b2c74]
0x1806cc6b4: mov r8d, ebx
0x1806cc6b7: lea rcx, [rsp + 0x50]
0x1806cc6bc: call 0x184ceb8d0
0x1806cc6c1: movaps xmm0, xmmword ptr [rsp + 0x50]
0x1806cc6c6: movdqa xmmword ptr [rsp + 0x30], xmm0
0x1806cc6cc: mov rdx, qword ptr [rip + 0x853fef5]
0x1806cc6d3: lea rcx, [rsp + 0x30]
0x1806cc6d8: call 0x1853ae780
0x1806cc6dd: test al, al
0x1806cc6df: jne 0x1806cc6f8
0x1806cc6e1: mov rcx, qword ptr [rdi + 0x10]
0x1806cc6e5: test rcx, rcx
0x1806cc6e8: je 0x1806cc749
0x1806cc6ea: mov r8, qword ptr [rip + 0x84b2547]
0x1806cc6f1: mov edx, ebx
0x1806cc6f3: call 0x184ce62f0
0x1806cc6f8: sub ebx, 1
0x1806cc6fb: jns 0x1806cc6a0
0x1806cc6fd: add rsp, 0x60
0x1806cc701: pop r15
0x1806cc703: pop r14
0x1806cc705: pop r13
0x1806cc707: pop r12
0x1806cc709: pop rdi
0x1806cc70a: pop rsi
0x1806cc70b: pop rbx
0x1806cc70c: ret
0x1806cc70d: mov rdx, rdi
0x1806cc710: jmp 0x1806cc715
0x1806cc712: mov rdx, r13
0x1806cc715: xor r8d, r8d
0x1806cc718: call 0x1833c9ac0 ; XLua.DelegateBridge.__Gen_Delegate_Imp27
0x1806cc71d: add rsp, 0x60
0x1806cc721: pop r15
0x1806cc723: pop r14
0x1806cc725: pop r13
0x1806cc727: pop r12
0x1806cc729: pop rdi
0x1806cc72a: pop rsi
0x1806cc72b: pop rbx
0x1806cc72c: ret
0x1806cc72d: call 0x18049c3c0
0x1806cc732: nop
0x1806cc733: call 0x18049c3c0
0x1806cc738: call 0x18049c3c0
0x1806cc73d: call 0x18049c3c0
0x1806cc742: nop
0x1806cc743: call 0x180483060
0x1806cc748: int3
0x1806cc749: call 0x18049c3c0
0x1806cc74e: int3
0x1806cc74f: call 0x18049c3c0
0x1806cc754: int3
0x1806cc755: int3
0x1806cc756: int3
0x1806cc757: int3
0x1806cc758: int3
0x1806cc759: int3
0x1806cc75a: int3
0x1806cc75b: int3
0x1806cc75c: int3
0x1806cc75d: int3
0x1806cc75e: int3
0x1806cc75f: int3
