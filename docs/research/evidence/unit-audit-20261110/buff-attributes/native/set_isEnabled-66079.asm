0x1806df330: mov qword ptr [rsp + 8], rbx
0x1806df335: push rdi
0x1806df336: sub rsp, 0x20
0x1806df33a: cmp byte ptr [rip + 0x88bbf85], 0
0x1806df341: movzx edi, dl
0x1806df344: mov rbx, rcx
0x1806df347: jne 0x1806df35c
0x1806df349: lea rcx, [rip + 0x8465708]
0x1806df350: call 0x18049c210
0x1806df355: mov byte ptr [rip + 0x88bbf6a], 1
0x1806df35c: mov rax, qword ptr [rip + 0x84656f5]
0x1806df363: cmp dword ptr [rax + 0xe0], 0
0x1806df36a: jne 0x1806df37b
0x1806df36c: mov rcx, rax
0x1806df36f: call 0x18049c450
0x1806df374: mov rax, qword ptr [rip + 0x84656dd]
0x1806df37b: mov rax, qword ptr [rax + 0xb8]
0x1806df382: mov rcx, qword ptr [rax + 0x1b0]
0x1806df389: test rcx, rcx
0x1806df38c: jne 0x1806df3b2
0x1806df38e: test byte ptr [rbx + 0x1fa], dil
0x1806df395: jne 0x1806df3c1
0x1806df397: xor edx, edx
0x1806df399: mov byte ptr [rbx + 0x1ff], dil
0x1806df3a0: mov rcx, rbx
0x1806df3a3: mov rbx, qword ptr [rsp + 0x30]
0x1806df3a8: add rsp, 0x20
0x1806df3ac: pop rdi
0x1806df3ad: jmp 0x1806dca50 ; Torappu.Battle.Buff._UpdateIsEnabledIfNotFinished
0x1806df3b2: xor r9d, r9d
0x1806df3b5: movzx r8d, dil
0x1806df3b9: mov rdx, rbx
0x1806df3bc: call 0x1833ba950 ; XLua.DelegateBridge.__Gen_Delegate_Imp26
0x1806df3c1: mov rbx, qword ptr [rsp + 0x30]
0x1806df3c6: add rsp, 0x20
0x1806df3ca: pop rdi
0x1806df3cb: ret 
0x1806df3cc: int3 
0x1806df3cd: int3 
0x1806df3ce: int3 
0x1806df3cf: int3 
