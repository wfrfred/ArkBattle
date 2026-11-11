0x1806fcec0: mov qword ptr [rsp + 8], rbx
0x1806fcec5: mov qword ptr [rsp + 0x10], rbp
0x1806fceca: mov qword ptr [rsp + 0x18], rsi
0x1806fcecf: push rdi
0x1806fced0: sub rsp, 0x70
0x1806fced4: cmp byte ptr [rip + 0x889e659], 0
0x1806fcedb: mov rdi, r9
0x1806fcede: mov esi, r8d
0x1806fcee1: mov ebp, edx
0x1806fcee3: mov rbx, rcx
0x1806fcee6: jne 0x1806fcefb
0x1806fcee8: lea rcx, [rip + 0x842e891]
0x1806fceef: call 0x18049c210
0x1806fcef4: mov byte ptr [rip + 0x889e639], 1
0x1806fcefb: mov rax, qword ptr [rip + 0x842e87e]
0x1806fcf02: mov r10, qword ptr [rax + 0xb8]
0x1806fcf09: mov rcx, qword ptr [r10 + 0x100]
0x1806fcf10: test rcx, rcx
0x1806fcf13: jne 0x1806fcf8f
0x1806fcf15: xor r8d, r8d
0x1806fcf18: mov edx, ebp
0x1806fcf1a: mov rcx, rbx
0x1806fcf1d: call 0x1806f9c90 ; Torappu.Battle.Deck.FindCard
0x1806fcf22: movzx ecx, byte ptr [rsp + 0xb8]
0x1806fcf2a: mov rdx, rax
0x1806fcf2d: movzx eax, byte ptr [rsp + 0xa0]
0x1806fcf35: mov r9, rdi
0x1806fcf38: mov qword ptr [rsp + 0x68], 0
0x1806fcf41: mov r8d, esi
0x1806fcf44: mov byte ptr [rsp + 0x60], 0
0x1806fcf49: mov byte ptr [rsp + 0x58], 0
0x1806fcf4e: mov byte ptr [rsp + 0x50], 0
0x1806fcf53: mov byte ptr [rsp + 0x48], 0
0x1806fcf58: mov byte ptr [rsp + 0x40], cl
0x1806fcf5c: mov rcx, qword ptr [rsp + 0xc0]
0x1806fcf64: mov qword ptr [rsp + 0x38], rcx
0x1806fcf69: movzx ecx, byte ptr [rsp + 0xb0]
0x1806fcf71: mov byte ptr [rsp + 0x30], cl
0x1806fcf75: movzx ecx, byte ptr [rsp + 0xa8]
0x1806fcf7d: mov byte ptr [rsp + 0x28], cl
0x1806fcf81: mov rcx, rbx
0x1806fcf84: mov byte ptr [rsp + 0x20], al
0x1806fcf88: call 0x1806fd140 ; Torappu.Battle.Deck.SpawnCharacterOrToken
0x1806fcf8d: jmp 0x1806fcfe8
0x1806fcf8f: mov rax, qword ptr [rsp + 0xc0]
0x1806fcf97: mov r9d, esi
0x1806fcf9a: mov qword ptr [rsp + 0x50], 0
0x1806fcfa3: mov r8d, ebp
0x1806fcfa6: mov qword ptr [rsp + 0x48], rax
0x1806fcfab: mov rdx, rbx
0x1806fcfae: movzx eax, byte ptr [rsp + 0xb8]
0x1806fcfb6: mov byte ptr [rsp + 0x40], al
0x1806fcfba: movzx eax, byte ptr [rsp + 0xb0]
0x1806fcfc2: mov byte ptr [rsp + 0x38], al
0x1806fcfc6: movzx eax, byte ptr [rsp + 0xa8]
0x1806fcfce: mov byte ptr [rsp + 0x30], al
0x1806fcfd2: movzx eax, byte ptr [rsp + 0xa0]
0x1806fcfda: mov byte ptr [rsp + 0x28], al
0x1806fcfde: mov qword ptr [rsp + 0x20], rdi
0x1806fcfe3: call 0x1833f1e70 ; XLua.DelegateBridge.__Gen_Delegate_Imp3057
0x1806fcfe8: lea r11, [rsp + 0x70]
0x1806fcfed: mov rbx, qword ptr [r11 + 0x10]
0x1806fcff1: mov rbp, qword ptr [r11 + 0x18]
0x1806fcff5: mov rsi, qword ptr [r11 + 0x20]
0x1806fcff9: mov rsp, r11
0x1806fcffc: pop rdi
0x1806fcffd: ret
0x1806fcffe: int3
0x1806fcfff: int3
