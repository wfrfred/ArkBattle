0x1806deb80: push rbx
0x1806deb82: sub rsp, 0x20
0x1806deb86: cmp byte ptr [rip + 0x88bc73f], 0
0x1806deb8d: mov rbx, rcx
0x1806deb90: jne 0x1806debb1
0x1806deb92: lea rcx, [rip + 0x8465ebf]
0x1806deb99: call 0x18049c210
0x1806deb9e: lea rcx, [rip + 0x8557273]
0x1806deba5: call 0x18049c210
0x1806debaa: mov byte ptr [rip + 0x88bc71b], 1
0x1806debb1: mov rax, qword ptr [rip + 0x8465ea0]
0x1806debb8: cmp dword ptr [rax + 0xe0], 0
0x1806debbf: jne 0x1806debd0
0x1806debc1: mov rcx, rax
0x1806debc4: call 0x18049c450
0x1806debc9: mov rax, qword ptr [rip + 0x8465e88]
0x1806debd0: mov rax, qword ptr [rax + 0xb8]
0x1806debd7: mov rcx, qword ptr [rax + 0x1e0]
0x1806debde: test rcx, rcx
0x1806debe1: jne 0x1806dec34
0x1806debe3: mov qword ptr [rsp + 0x30], rdi
0x1806debe8: mov edi, dword ptr [rbx + 0x9c]
0x1806debee: cmp dword ptr [rbx + 0xa0], ecx
0x1806debf4: jl 0x1806dec27
0x1806debf6: mov rcx, qword ptr [rip + 0x855721b]
0x1806debfd: mov ebx, dword ptr [rbx + 0xa0]
0x1806dec03: cmp dword ptr [rcx + 0xe0], 0
0x1806dec0a: jne 0x1806dec11
0x1806dec0c: call 0x18049c450
0x1806dec11: xor r8d, r8d
0x1806dec14: mov edx, ebx
0x1806dec16: mov ecx, edi
0x1806dec18: mov rdi, qword ptr [rsp + 0x30]
0x1806dec1d: add rsp, 0x20
0x1806dec21: pop rbx
0x1806dec22: jmp 0x18611b2a0 ; System.Math.Min
0x1806dec27: mov eax, edi
0x1806dec29: mov rdi, qword ptr [rsp + 0x30]
0x1806dec2e: add rsp, 0x20
0x1806dec32: pop rbx
0x1806dec33: ret 
0x1806dec34: xor r8d, r8d
0x1806dec37: mov rdx, rbx
0x1806dec3a: add rsp, 0x20
0x1806dec3e: pop rbx
0x1806dec3f: jmp 0x18356e600 ; XLua.DelegateBridge.__Gen_Delegate_Imp54
0x1806dec44: int3 
0x1806dec45: int3 
0x1806dec46: int3 
0x1806dec47: int3 
0x1806dec48: int3 
0x1806dec49: int3 
0x1806dec4a: int3 
0x1806dec4b: int3 
0x1806dec4c: int3 
0x1806dec4d: int3 
0x1806dec4e: int3 
0x1806dec4f: int3 
