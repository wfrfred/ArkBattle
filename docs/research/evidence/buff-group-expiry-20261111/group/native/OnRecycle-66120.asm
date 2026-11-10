0x1806d49b0: push rbx
0x1806d49b2: sub rsp, 0x20
0x1806d49b6: cmp byte ptr [rip + 0x88c6932], 0
0x1806d49bd: mov rbx, rcx
0x1806d49c0: jne 0x1806d49d5
0x1806d49c2: lea rcx, [rip + 0x847008f]
0x1806d49c9: call 0x18049c210
0x1806d49ce: mov byte ptr [rip + 0x88c691a], 1
0x1806d49d5: mov rax, qword ptr [rip + 0x847007c]
0x1806d49dc: cmp dword ptr [rax + 0xe0], 0
0x1806d49e3: jne 0x1806d49f4
0x1806d49e5: mov rcx, rax
0x1806d49e8: call 0x18049c450
0x1806d49ed: mov rax, qword ptr [rip + 0x8470064]
0x1806d49f4: mov rax, qword ptr [rax + 0xb8]
0x1806d49fb: mov rcx, qword ptr [rax + 0x2f8]
0x1806d4a02: xor r8d, r8d
0x1806d4a05: test rcx, rcx
0x1806d4a08: jne 0x1806d4a2a
0x1806d4a0a: xor edx, edx
0x1806d4a0c: mov rcx, rbx
0x1806d4a0f: call 0x1806df2a0 ; Torappu.Battle.Buff.set_instanceUid
0x1806d4a14: xor edx, edx
0x1806d4a16: mov byte ptr [rbx + 0x200], 0
0x1806d4a1d: mov rcx, rbx
0x1806d4a20: add rsp, 0x20
0x1806d4a24: pop rbx
0x1806d4a25: jmp 0x1806d8e70 ; Torappu.Battle.Buff._ClearEventReentryDepth
0x1806d4a2a: mov rdx, rbx
0x1806d4a2d: add rsp, 0x20
0x1806d4a31: pop rbx
0x1806d4a32: jmp 0x1833c9ac0 ; XLua.DelegateBridge.__Gen_Delegate_Imp27
0x1806d4a37: int3
0x1806d4a38: int3
0x1806d4a39: int3
0x1806d4a3a: int3
0x1806d4a3b: int3
0x1806d4a3c: int3
0x1806d4a3d: int3
0x1806d4a3e: int3
0x1806d4a3f: int3
