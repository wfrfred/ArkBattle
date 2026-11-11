0x180b0d230: mov qword ptr [rsp + 8], rbx
0x180b0d235: mov qword ptr [rsp + 0x10], rbp
0x180b0d23a: mov qword ptr [rsp + 0x18], rsi
0x180b0d23f: push rdi
0x180b0d240: sub rsp, 0x30
0x180b0d244: cmp byte ptr [rip + 0x8490a73], 0
0x180b0d24b: mov ebx, r9d
0x180b0d24e: movzx esi, r8b
0x180b0d252: movzx ebp, dl
0x180b0d255: mov edi, ecx
0x180b0d257: jne 0x180b0d26c
0x180b0d259: lea rcx, [rip + 0x8002e70]
0x180b0d260: call 0x18049c210
0x180b0d265: mov byte ptr [rip + 0x8490a52], 1
0x180b0d26c: mov r9, qword ptr [rip + 0x8002e5d]
0x180b0d273: mov rax, qword ptr [r9 + 0xb8]
0x180b0d27a: mov rcx, qword ptr [rax + 0xb8]
0x180b0d281: test rcx, rcx
0x180b0d284: jne 0x180b0d413
0x180b0d28a: test edi, edi
0x180b0d28c: jle 0x180b0d3bd
0x180b0d292: test bpl, bpl
0x180b0d295: jne 0x180b0d2f7
0x180b0d297: cmp byte ptr [rip + 0x8490a21], bpl
0x180b0d29e: jne 0x180b0d2ba
0x180b0d2a0: lea rcx, [rip + 0x8002e29]
0x180b0d2a7: call 0x18049c210
0x180b0d2ac: mov r9, qword ptr [rip + 0x8002e1d]
0x180b0d2b3: mov byte ptr [rip + 0x8490a05], 1
0x180b0d2ba: mov rax, qword ptr [r9 + 0xb8]
0x180b0d2c1: mov rcx, qword ptr [rax + 0xc0]
0x180b0d2c8: test rcx, rcx
0x180b0d2cb: jne 0x180b0d2dd
0x180b0d2cd: shl ebx, 0x14
0x180b0d2d0: add ebx, edi
0x180b0d2d2: bts ebx, 0x1e
0x180b0d2d6: mov eax, ebx
0x180b0d2d8: jmp 0x180b0d42f
0x180b0d2dd: xor r9d, r9d
0x180b0d2e0: mov r8d, ebx
0x180b0d2e3: mov edx, edi
0x180b0d2e5: call 0x183271d10 ; XLua.DelegateBridge.__Gen_Delegate_Imp12542
0x180b0d2ea: mov ebx, eax
0x180b0d2ec: bts ebx, 0x1e
0x180b0d2f0: mov eax, ebx
0x180b0d2f2: jmp 0x180b0d42f
0x180b0d2f7: test sil, sil
0x180b0d2fa: jne 0x180b0d360
0x180b0d2fc: cmp byte ptr [rip + 0x84909bc], sil
0x180b0d303: jne 0x180b0d31f
0x180b0d305: lea rcx, [rip + 0x8002dc4]
0x180b0d30c: call 0x18049c210
0x180b0d311: mov r9, qword ptr [rip + 0x8002db8]
0x180b0d318: mov byte ptr [rip + 0x84909a0], 1
0x180b0d31f: mov rax, qword ptr [r9 + 0xb8]
0x180b0d326: mov rcx, qword ptr [rax + 0xc0]
0x180b0d32d: test rcx, rcx
0x180b0d330: jne 0x180b0d344
0x180b0d332: shl ebx, 0x14
0x180b0d335: add ebx, edi
0x180b0d337: or ebx, 0x80000000
0x180b0d33d: mov eax, ebx
0x180b0d33f: jmp 0x180b0d42f
0x180b0d344: xor r9d, r9d
0x180b0d347: mov r8d, ebx
0x180b0d34a: mov edx, edi
0x180b0d34c: call 0x183271d10 ; XLua.DelegateBridge.__Gen_Delegate_Imp12542
0x180b0d351: mov ebx, eax
0x180b0d353: or ebx, 0x80000000
0x180b0d359: mov eax, ebx
0x180b0d35b: jmp 0x180b0d42f
0x180b0d360: cmp byte ptr [rip + 0x8490958], 0
0x180b0d367: jne 0x180b0d383
0x180b0d369: lea rcx, [rip + 0x8002d60]
0x180b0d370: call 0x18049c210
0x180b0d375: mov r9, qword ptr [rip + 0x8002d54]
0x180b0d37c: mov byte ptr [rip + 0x849093c], 1
0x180b0d383: mov rax, qword ptr [r9 + 0xb8]
0x180b0d38a: mov rcx, qword ptr [rax + 0xc0]
0x180b0d391: test rcx, rcx
0x180b0d394: jne 0x180b0d3a6
0x180b0d396: shl ebx, 0x14
0x180b0d399: add ebx, edi
0x180b0d39b: bts ebx, 0x1d
0x180b0d39f: mov eax, ebx
0x180b0d3a1: jmp 0x180b0d42f
0x180b0d3a6: xor r9d, r9d
0x180b0d3a9: mov r8d, ebx
0x180b0d3ac: mov edx, edi
0x180b0d3ae: call 0x183271d10 ; XLua.DelegateBridge.__Gen_Delegate_Imp12542
0x180b0d3b3: mov ebx, eax
0x180b0d3b5: bts ebx, 0x1d
0x180b0d3b9: mov eax, ebx
0x180b0d3bb: jmp 0x180b0d42f
0x180b0d3bd: mov edi, dword ptr [rax]
0x180b0d3bf: inc edi
0x180b0d3c1: cmp byte ptr [rip + 0x84908f7], 0
0x180b0d3c8: mov dword ptr [rax], edi
0x180b0d3ca: jne 0x180b0d3df
0x180b0d3cc: lea rcx, [rip + 0x8002cfd]
0x180b0d3d3: call 0x18049c210
0x180b0d3d8: mov byte ptr [rip + 0x84908e0], 1
0x180b0d3df: mov rax, qword ptr [rip + 0x8002cea]
0x180b0d3e6: mov rcx, qword ptr [rax + 0xb8]
0x180b0d3ed: mov rcx, qword ptr [rcx + 0xc0]
0x180b0d3f4: test rcx, rcx
0x180b0d3f7: jne 0x180b0d402
0x180b0d3f9: shl ebx, 0x14
0x180b0d3fc: add ebx, edi
0x180b0d3fe: mov eax, ebx
0x180b0d400: jmp 0x180b0d42f
0x180b0d402: xor r9d, r9d
0x180b0d405: mov r8d, ebx
0x180b0d408: mov edx, edi
0x180b0d40a: call 0x183271d10 ; XLua.DelegateBridge.__Gen_Delegate_Imp12542
0x180b0d40f: mov ebx, eax
0x180b0d411: jmp 0x180b0d42f
0x180b0d413: mov qword ptr [rsp + 0x28], 0
0x180b0d41c: movzx r9d, sil
0x180b0d420: movzx r8d, bpl
0x180b0d424: mov dword ptr [rsp + 0x20], ebx
0x180b0d428: mov edx, edi
0x180b0d42a: call 0x183271b00 ; XLua.DelegateBridge.__Gen_Delegate_Imp12541
0x180b0d42f: mov rbx, qword ptr [rsp + 0x40]
0x180b0d434: mov rbp, qword ptr [rsp + 0x48]
0x180b0d439: mov rsi, qword ptr [rsp + 0x50]
0x180b0d43e: add rsp, 0x30
0x180b0d442: pop rdi
0x180b0d443: ret
0x180b0d444: int3
0x180b0d445: int3
0x180b0d446: int3
0x180b0d447: int3
0x180b0d448: int3
0x180b0d449: int3
0x180b0d44a: int3
0x180b0d44b: int3
0x180b0d44c: int3
0x180b0d44d: int3
0x180b0d44e: int3
0x180b0d44f: int3
