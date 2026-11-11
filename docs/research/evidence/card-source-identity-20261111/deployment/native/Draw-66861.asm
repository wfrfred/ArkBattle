0x1806eb980: mov qword ptr [rsp + 8], rbx
0x1806eb985: mov qword ptr [rsp + 0x10], rbp
0x1806eb98a: mov qword ptr [rsp + 0x18], rsi
0x1806eb98f: push rdi
0x1806eb990: sub rsp, 0x40
0x1806eb994: cmp byte ptr [rip + 0x88afbff], 0
0x1806eb99b: movzx esi, r9b
0x1806eb99f: movzx ebp, r8b
0x1806eb9a3: movzx edi, dl
0x1806eb9a6: mov rbx, rcx
0x1806eb9a9: jne 0x1806eb9be
0x1806eb9ab: lea rcx, [rip + 0x84d6376]
0x1806eb9b2: call 0x18049c210
0x1806eb9b7: mov byte ptr [rip + 0x88afbdc], 1
0x1806eb9be: mov rax, qword ptr [rip + 0x84d6363]
0x1806eb9c5: mov r10, qword ptr [rax + 0xb8]
0x1806eb9cc: mov rcx, qword ptr [r10 + 0x1d8]
0x1806eb9d3: test rcx, rcx
0x1806eb9d6: jne 0x1806ebb2a
0x1806eb9dc: cmp byte ptr [rsp + 0x70], cl
0x1806eb9e0: jne 0x1806eb9f9
0x1806eb9e2: xor r8d, r8d
0x1806eb9e5: movzx edx, dil
0x1806eb9e9: mov rcx, rbx
0x1806eb9ec: call 0x1806ea970 ; Torappu.Battle.Deck/Card.CheckDrawable
0x1806eb9f1: test al, al
0x1806eb9f3: je 0x1806ebb51
0x1806eb9f9: cmp byte ptr [rip + 0x88ed070], 0
0x1806eba00: jbe 0x1806eba0a
0x1806eba02: mov rcx, qword ptr [rbx]
0x1806eba05: call 0x180457010
0x1806eba0a: mov rdx, qword ptr [rbx]
0x1806eba0d: mov rcx, rbx
0x1806eba10: mov rax, qword ptr [rdx + 0x180]
0x1806eba17: mov rdx, qword ptr [rdx + 0x188]
0x1806eba1e: call rax
0x1806eba20: test al, al
0x1806eba22: jne 0x1806eba30
0x1806eba24: xor dil, 1
0x1806eba28: or dil, bpl
0x1806eba2b: je 0x1806eba30
0x1806eba2d: dec dword ptr [rbx + 0x18]
0x1806eba30: test sil, sil
0x1806eba33: jne 0x1806ebaba
0x1806eba39: cmp byte ptr [rip + 0x88ed030], sil
0x1806eba40: jbe 0x1806eba4a
0x1806eba42: mov rcx, qword ptr [rbx]
0x1806eba45: call 0x180457010
0x1806eba4a: mov rdx, qword ptr [rbx]
0x1806eba4d: mov rcx, rbx
0x1806eba50: mov rax, qword ptr [rdx + 0x1f0]
0x1806eba57: mov rdx, qword ptr [rdx + 0x1f8]
0x1806eba5e: call rax
0x1806eba60: test eax, eax
0x1806eba62: je 0x1806eba8b
0x1806eba64: sub eax, 1
0x1806eba67: je 0x1806eba84
0x1806eba69: cmp eax, 1
0x1806eba6c: jne 0x1806eba8b
0x1806eba6e: mov eax, dword ptr [rbx + 0x18]
0x1806eba71: cmp dword ptr [rbx + 0x170], eax
0x1806eba77: jl 0x1806ebaba
0x1806eba79: cmp dword ptr [rbx + 0x170], 0
0x1806eba80: jle 0x1806ebaba
0x1806eba82: jmp 0x1806ebaaa
0x1806eba84: mov edx, 2
0x1806eba89: jmp 0x1806ebaaf
0x1806eba8b: mov rcx, qword ptr [rbx + 0x30]
0x1806eba8f: test rcx, rcx
0x1806eba92: je 0x1806ebb66
0x1806eba98: mov rdx, qword ptr [rbx + 0x1d0]
0x1806eba9f: xor r9d, r9d
0x1806ebaa2: mov r8b, 1
0x1806ebaa5: call 0x181e4afc0 ; Torappu.PeriodicTimer.Reset
0x1806ebaaa: mov edx, 3
0x1806ebaaf: xor r8d, r8d
0x1806ebab2: mov rcx, rbx
0x1806ebab5: call 0x1806f42c0 ; Torappu.Battle.Deck/Card.set_state
0x1806ebaba: mov rdi, qword ptr [rbx + 0x10]
0x1806ebabe: test rdi, rdi
0x1806ebac1: je 0x1806ebb66
0x1806ebac7: cmp byte ptr [rip + 0x88afa7d], 0
0x1806ebace: jne 0x1806ebae3
0x1806ebad0: lea rcx, [rip + 0x843fca9]
0x1806ebad7: call 0x18049c210
0x1806ebadc: mov byte ptr [rip + 0x88afa68], 1
0x1806ebae3: mov rax, qword ptr [rip + 0x843fc96]
0x1806ebaea: mov rcx, qword ptr [rax + 0xb8]
0x1806ebaf1: mov rcx, qword ptr [rcx + 0x1b8]
0x1806ebaf8: test rcx, rcx
0x1806ebafb: jne 0x1806ebb18
0x1806ebafd: mov rcx, qword ptr [rdi + 0xc0]
0x1806ebb04: test rcx, rcx
0x1806ebb07: je 0x1806ebb66
0x1806ebb09: xor r8d, r8d
0x1806ebb0c: mov rdx, rbx
0x1806ebb0f: call 0x18070c8f0 ; Torappu.Battle.Deck/DeckManagedCardBuffController.OnCardDrawn
0x1806ebb14: mov al, 1
0x1806ebb16: jmp 0x1806ebb51
0x1806ebb18: xor r9d, r9d
0x1806ebb1b: mov r8, rbx
0x1806ebb1e: mov rdx, rdi
0x1806ebb21: call 0x18338c7c0 ; XLua.DelegateBridge.__Gen_Delegate_Imp23
0x1806ebb26: mov al, 1
0x1806ebb28: jmp 0x1806ebb51
0x1806ebb2a: movzx eax, byte ptr [rsp + 0x70]
0x1806ebb2f: movzx r9d, bpl
0x1806ebb33: mov qword ptr [rsp + 0x30], 0
0x1806ebb3c: movzx r8d, dil
0x1806ebb40: mov byte ptr [rsp + 0x28], al
0x1806ebb44: mov rdx, rbx
0x1806ebb47: mov byte ptr [rsp + 0x20], sil
0x1806ebb4c: call 0x183461830 ; XLua.DelegateBridge.__Gen_Delegate_Imp3762
0x1806ebb51: mov rbx, qword ptr [rsp + 0x50]
0x1806ebb56: mov rbp, qword ptr [rsp + 0x58]
0x1806ebb5b: mov rsi, qword ptr [rsp + 0x60]
0x1806ebb60: add rsp, 0x40
0x1806ebb64: pop rdi
0x1806ebb65: ret
0x1806ebb66: call 0x18049c3c0
0x1806ebb6b: int3
0x1806ebb6c: int3
0x1806ebb6d: int3
0x1806ebb6e: int3
0x1806ebb6f: int3
