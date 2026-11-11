0x1806fd000: mov qword ptr [rsp + 8], rbx
0x1806fd005: mov qword ptr [rsp + 0x10], rbp
0x1806fd00a: mov qword ptr [rsp + 0x18], rsi
0x1806fd00f: push rdi
0x1806fd010: sub rsp, 0x80
0x1806fd017: cmp byte ptr [rip + 0x889e515], 0
0x1806fd01e: mov rdi, r9
0x1806fd021: mov esi, r8d
0x1806fd024: mov ebp, edx
0x1806fd026: mov rbx, rcx
0x1806fd029: jne 0x1806fd03e
0x1806fd02b: lea rcx, [rip + 0x842e74e]
0x1806fd032: call 0x18049c210
0x1806fd037: mov byte ptr [rip + 0x889e4f5], 1
0x1806fd03e: mov rax, qword ptr [rip + 0x842e73b]
0x1806fd045: mov r10, qword ptr [rax + 0xb8]
0x1806fd04c: mov rcx, qword ptr [r10 + 0xf8]
0x1806fd053: test rcx, rcx
0x1806fd056: jne 0x1806fd0ce
0x1806fd058: xor r8d, r8d
0x1806fd05b: mov edx, ebp
0x1806fd05d: mov rcx, rbx
0x1806fd060: call 0x1806f9c90 ; Torappu.Battle.Deck.FindCard
0x1806fd065: movzx ecx, byte ptr [rsp + 0xc8]
0x1806fd06d: mov rdx, rax
0x1806fd070: xor eax, eax
0x1806fd072: mov r9, rdi
0x1806fd075: mov qword ptr [rsp + 0x68], rax
0x1806fd07a: mov r8d, esi
0x1806fd07d: mov byte ptr [rsp + 0x60], al
0x1806fd081: mov byte ptr [rsp + 0x58], al
0x1806fd085: mov byte ptr [rsp + 0x50], al
0x1806fd089: mov byte ptr [rsp + 0x48], al
0x1806fd08d: mov byte ptr [rsp + 0x40], cl
0x1806fd091: movzx ecx, byte ptr [rsp + 0xc0]
0x1806fd099: mov qword ptr [rsp + 0x70], rax
0x1806fd09e: lea rax, [rsp + 0x70]
0x1806fd0a3: mov qword ptr [rsp + 0x38], rax
0x1806fd0a8: movzx eax, byte ptr [rsp + 0xb0]
0x1806fd0b0: mov byte ptr [rsp + 0x30], cl
0x1806fd0b4: movzx ecx, byte ptr [rsp + 0xb8]
0x1806fd0bc: mov byte ptr [rsp + 0x28], cl
0x1806fd0c0: mov rcx, rbx
0x1806fd0c3: mov byte ptr [rsp + 0x20], al
0x1806fd0c7: call 0x1806fd140 ; Torappu.Battle.Deck.SpawnCharacterOrToken
0x1806fd0cc: jmp 0x1806fd118
0x1806fd0ce: xor eax, eax
0x1806fd0d0: mov r9d, esi
0x1806fd0d3: mov qword ptr [rsp + 0x48], rax
0x1806fd0d8: mov r8d, ebp
0x1806fd0db: movzx eax, byte ptr [rsp + 0xc8]
0x1806fd0e3: mov rdx, rbx
0x1806fd0e6: mov byte ptr [rsp + 0x40], al
0x1806fd0ea: movzx eax, byte ptr [rsp + 0xc0]
0x1806fd0f2: mov byte ptr [rsp + 0x38], al
0x1806fd0f6: movzx eax, byte ptr [rsp + 0xb8]
0x1806fd0fe: mov byte ptr [rsp + 0x30], al
0x1806fd102: movzx eax, byte ptr [rsp + 0xb0]
0x1806fd10a: mov byte ptr [rsp + 0x28], al
0x1806fd10e: mov qword ptr [rsp + 0x20], rdi
0x1806fd113: call 0x1833f1c10 ; XLua.DelegateBridge.__Gen_Delegate_Imp3056
0x1806fd118: lea r11, [rsp + 0x80]
0x1806fd120: mov rbx, qword ptr [r11 + 0x10]
0x1806fd124: mov rbp, qword ptr [r11 + 0x18]
0x1806fd128: mov rsi, qword ptr [r11 + 0x20]
0x1806fd12c: mov rsp, r11
0x1806fd12f: pop rdi
0x1806fd130: ret
0x1806fd131: int3
0x1806fd132: int3
0x1806fd133: int3
0x1806fd134: int3
0x1806fd135: int3
0x1806fd136: int3
0x1806fd137: int3
0x1806fd138: int3
0x1806fd139: int3
0x1806fd13a: int3
0x1806fd13b: int3
0x1806fd13c: int3
0x1806fd13d: int3
0x1806fd13e: int3
0x1806fd13f: int3
