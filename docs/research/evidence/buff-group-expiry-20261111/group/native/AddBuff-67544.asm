0x1807208c0: mov qword ptr [rsp + 8], rbx
0x1807208c5: mov qword ptr [rsp + 0x10], rbp
0x1807208ca: mov qword ptr [rsp + 0x18], rsi
0x1807208cf: push rdi
0x1807208d0: sub rsp, 0x70
0x1807208d4: cmp byte ptr [rip + 0x887aef9], 0
0x1807208db: mov rbx, r9
0x1807208de: mov rdi, r8
0x1807208e1: mov rsi, rdx
0x1807208e4: mov rbp, rcx
0x1807208e7: jne 0x1807208fc
0x1807208e9: lea rcx, [rip + 0x848c1d0]
0x1807208f0: call 0x18049c210
0x1807208f5: mov byte ptr [rip + 0x887aed8], 1
0x1807208fc: mov rax, qword ptr [rip + 0x848c1bd]
0x180720903: xorps xmm0, xmm0
0x180720906: movups xmmword ptr [rsp + 0x50], xmm0
0x18072090b: cmp dword ptr [rax + 0xe0], 0
0x180720912: jne 0x180720923
0x180720914: mov rcx, rax
0x180720917: call 0x18049c450
0x18072091c: mov rax, qword ptr [rip + 0x848c19d]
0x180720923: mov rax, qword ptr [rax + 0xb8]
0x18072092a: mov rcx, qword ptr [rax + 0x5d8]
0x180720931: test rcx, rcx
0x180720934: jne 0x1807209ab
0x180720936: xor r8d, r8d
0x180720939: lea rdx, [rsp + 0x50]
0x18072093e: mov rcx, rsi
0x180720941: call 0x180b44930 ; Torappu.Battle.BuffDBUtil.TryGetBuff
0x180720946: test al, al
0x180720948: je 0x180720a11
0x18072094e: mov rax, qword ptr [rsp + 0xb8]
0x180720956: lea rdx, [rsp + 0x60]
0x18072095b: movaps xmm0, xmmword ptr [rsp + 0x50]
0x180720960: mov r9, rbx
0x180720963: mov qword ptr [rsp + 0x40], 0
0x18072096c: mov r8, rdi
0x18072096f: mov qword ptr [rsp + 0x38], rax
0x180720974: mov rcx, rbp
0x180720977: mov rax, qword ptr [rsp + 0xb0]
0x18072097f: mov qword ptr [rsp + 0x30], rax
0x180720984: mov rax, qword ptr [rsp + 0xa8]
0x18072098c: mov qword ptr [rsp + 0x28], rax
0x180720991: mov rax, qword ptr [rsp + 0xa0]
0x180720999: mov qword ptr [rsp + 0x20], rax
0x18072099e: movdqa xmmword ptr [rsp + 0x60], xmm0
0x1807209a4: call 0x180720760 ; Torappu.Battle.Entity.AddBuff
0x1807209a9: jmp 0x1807209fb
0x1807209ab: mov rax, qword ptr [rsp + 0xb8]
0x1807209b3: mov r9, rdi
0x1807209b6: mov qword ptr [rsp + 0x48], 0
0x1807209bf: mov r8, rsi
0x1807209c2: mov qword ptr [rsp + 0x40], rax
0x1807209c7: mov rdx, rbp
0x1807209ca: mov rax, qword ptr [rsp + 0xb0]
0x1807209d2: mov qword ptr [rsp + 0x38], rax
0x1807209d7: mov rax, qword ptr [rsp + 0xa8]
0x1807209df: mov qword ptr [rsp + 0x30], rax
0x1807209e4: mov rax, qword ptr [rsp + 0xa0]
0x1807209ec: mov qword ptr [rsp + 0x28], rax
0x1807209f1: mov qword ptr [rsp + 0x20], rbx
0x1807209f6: call 0x1833fb9f0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3117
0x1807209fb: lea r11, [rsp + 0x70]
0x180720a00: mov rbx, qword ptr [r11 + 0x10]
0x180720a04: mov rbp, qword ptr [r11 + 0x18]
0x180720a08: mov rsi, qword ptr [r11 + 0x20]
0x180720a0c: mov rsp, r11
0x180720a0f: pop rdi
0x180720a10: ret
0x180720a11: lea rcx, [rip + 0x83ce1b0]
0x180720a18: call 0x18049c230
0x180720a1d: mov rcx, rax
0x180720a20: mov edx, 5
0x180720a25: call 0x18049bd60
0x180720a2a: mov rcx, rax
0x180720a2d: mov rdi, rax
0x180720a30: call 0x180005cb0
0x180720a35: lea rcx, [rip + 0x84788c4]
0x180720a3c: call 0x18049c230
0x180720a41: mov r8, rax
0x180720a44: xor edx, edx
0x180720a46: mov rcx, rdi
0x180720a49: call 0x180005fe0
0x180720a4e: mov rcx, rsi
0x180720a51: call 0x180005cb0
0x180720a56: mov rbx, qword ptr [rsi + 0x18]
0x180720a5a: mov rcx, rdi
0x180720a5d: call 0x180005cb0
0x180720a62: mov r8, rbx
0x180720a65: mov edx, 1
0x180720a6a: mov rcx, rdi
0x180720a6d: call 0x180005fe0
0x180720a72: mov rcx, rdi
0x180720a75: call 0x180005cb0
0x180720a7a: lea rcx, [rip + 0x83d5db7]
0x180720a81: call 0x18049c230
0x180720a86: mov r8, rax
0x180720a89: mov edx, 2
0x180720a8e: mov rcx, rdi
0x180720a91: call 0x180005fe0
0x180720a96: mov rcx, rsi
0x180720a99: call 0x180005cb0
0x180720a9e: mov rbx, qword ptr [rsi + 0x30]
0x180720aa2: mov rcx, rdi
0x180720aa5: call 0x180005cb0
0x180720aaa: mov r8, rbx
0x180720aad: mov edx, 3
0x180720ab2: mov rcx, rdi
0x180720ab5: call 0x180005fe0
0x180720aba: mov rcx, rdi
0x180720abd: call 0x180005cb0
0x180720ac2: lea rcx, [rip + 0x83d5fb7]
0x180720ac9: call 0x18049c230
0x180720ace: mov r8, rax
0x180720ad1: mov edx, 4
0x180720ad6: mov rcx, rdi
0x180720ad9: call 0x180005fe0
0x180720ade: xor edx, edx
0x180720ae0: mov rcx, rdi
0x180720ae3: call 0x186014120 ; System.String.Concat
0x180720ae8: lea rcx, [rip + 0x84fa7e1]
0x180720aef: mov rbx, rax
0x180720af2: call 0x18049c230
0x180720af7: mov rcx, rax
0x180720afa: call 0x18046d2f0
0x180720aff: mov rcx, rax
0x180720b02: mov rdi, rax
0x180720b05: call 0x180005cb0
0x180720b0a: xor r8d, r8d
0x180720b0d: mov rdx, rbx
0x180720b10: mov rcx, rdi
0x180720b13: call 0x181ad7a00 ; Torappu.GameDataException..ctor
0x180720b18: lea rcx, [rip + 0x844d819]
0x180720b1f: call 0x18049c230
0x180720b24: mov rdx, rax
0x180720b27: mov rcx, rdi
0x180720b2a: call 0x18049c380
0x180720b2f: int3
