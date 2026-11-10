0x1806ce720: mov qword ptr [rsp + 0x10], rbx
0x1806ce725: push rdi
0x1806ce726: sub rsp, 0x30
0x1806ce72a: cmp byte ptr [rip + 0x88ccb9f], 0
0x1806ce731: mov rbx, rdx
0x1806ce734: mov rdi, rcx
0x1806ce737: jne 0x1806ce74c
0x1806ce739: lea rcx, [rip + 0x8476318]
0x1806ce740: call 0x18049c210
0x1806ce745: mov byte ptr [rip + 0x88ccb84], 1
0x1806ce74c: mov rax, qword ptr [rip + 0x8476305]
0x1806ce753: cmp dword ptr [rax + 0xe0], 0
0x1806ce75a: jne 0x1806ce76b
0x1806ce75c: mov rcx, rax
0x1806ce75f: call 0x18049c450
0x1806ce764: mov rax, qword ptr [rip + 0x84762ed]
0x1806ce76b: mov rax, qword ptr [rax + 0xb8]
0x1806ce772: mov rcx, qword ptr [rax + 0x200]
0x1806ce779: test rcx, rcx
0x1806ce77c: jne 0x1806ce815
0x1806ce782: mov qword ptr [rsp + 0x40], rsi
0x1806ce787: xor edx, edx
0x1806ce789: mov rcx, rdi
0x1806ce78c: call 0x1806de3e0 ; Torappu.Battle.Buff.get_priority
0x1806ce791: mov esi, eax
0x1806ce793: test rbx, rbx
0x1806ce796: je 0x1806ce82e
0x1806ce79c: xor edx, edx
0x1806ce79e: mov rcx, rbx
0x1806ce7a1: call 0x1806de3e0 ; Torappu.Battle.Buff.get_priority
0x1806ce7a6: xor edx, edx
0x1806ce7a8: mov rcx, rdi
0x1806ce7ab: cmp esi, eax
0x1806ce7ad: jne 0x1806ce7e1
0x1806ce7af: call 0x1806ddbe0 ; Torappu.Battle.Buff.get_instanceUid
0x1806ce7b4: xor edx, edx
0x1806ce7b6: mov dword ptr [rsp + 0x58], eax
0x1806ce7ba: mov rcx, rbx
0x1806ce7bd: call 0x1806ddbe0 ; Torappu.Battle.Buff.get_instanceUid
0x1806ce7c2: xor r8d, r8d
0x1806ce7c5: lea rcx, [rsp + 0x58]
0x1806ce7ca: mov edx, eax
0x1806ce7cc: call 0x186143b90 ; System.UInt32.CompareTo
0x1806ce7d1: mov rsi, qword ptr [rsp + 0x40]
0x1806ce7d6: mov rbx, qword ptr [rsp + 0x48]
0x1806ce7db: add rsp, 0x30
0x1806ce7df: pop rdi
0x1806ce7e0: ret 
0x1806ce7e1: call 0x1806de3e0 ; Torappu.Battle.Buff.get_priority
0x1806ce7e6: xor edx, edx
0x1806ce7e8: mov dword ptr [rsp + 0x20], eax
0x1806ce7ec: mov rcx, rbx
0x1806ce7ef: call 0x1806de3e0 ; Torappu.Battle.Buff.get_priority
0x1806ce7f4: xor r8d, r8d
0x1806ce7f7: lea rcx, [rsp + 0x20]
0x1806ce7fc: mov edx, eax
0x1806ce7fe: call 0x1861176e0 ; System.Int32.CompareTo
0x1806ce803: mov rsi, qword ptr [rsp + 0x40]
0x1806ce808: neg eax
0x1806ce80a: mov rbx, qword ptr [rsp + 0x48]
0x1806ce80f: add rsp, 0x30
0x1806ce813: pop rdi
0x1806ce814: ret 
0x1806ce815: xor r9d, r9d
0x1806ce818: mov r8, rbx
0x1806ce81b: mov rdx, rdi
0x1806ce81e: call 0x1833e0cb0 ; XLua.DelegateBridge.__Gen_Delegate_Imp293
0x1806ce823: mov rbx, qword ptr [rsp + 0x48]
0x1806ce828: add rsp, 0x30
0x1806ce82c: pop rdi
0x1806ce82d: ret 
0x1806ce82e: call 0x18049c3c0
0x1806ce833: int3 
0x1806ce834: int3 
0x1806ce835: int3 
0x1806ce836: int3 
0x1806ce837: int3 
0x1806ce838: int3 
0x1806ce839: int3 
0x1806ce83a: int3 
0x1806ce83b: int3 
0x1806ce83c: int3 
0x1806ce83d: int3 
0x1806ce83e: int3 
0x1806ce83f: int3 
