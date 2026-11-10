0x182379d90: mov qword ptr [rsp + 0x10], rbp
0x182379d95: mov qword ptr [rsp + 0x18], rsi
0x182379d9a: push rdi
0x182379d9b: sub rsp, 0x60
0x182379d9f: cmp byte ptr [rip + 0x6c3613b], 0
0x182379da6: mov rsi, r8
0x182379da9: mov rbp, rdx
0x182379dac: mov rdi, rcx
0x182379daf: jne 0x182379ddc
0x182379db1: lea rcx, [rip + 0x67af910]
0x182379db8: call 0x18049c210
0x182379dbd: lea rcx, [rip + 0x67af1b4]
0x182379dc4: call 0x18049c210
0x182379dc9: lea rcx, [rip + 0x67af3e8]
0x182379dd0: call 0x18049c210
0x182379dd5: mov byte ptr [rip + 0x6c36105], 1
0x182379ddc: mov rax, qword ptr [rip + 0x67af8e5]
0x182379de3: mov rcx, qword ptr [rax + 0xb8]
0x182379dea: mov rcx, qword ptr [rcx + 0x160]
0x182379df1: test rcx, rcx
0x182379df4: jne 0x182379edc
0x182379dfa: xor edx, edx
0x182379dfc: mov rcx, rbp
0x182379dff: call 0x18601a180 ; System.String.IsNullOrEmpty
0x182379e04: test al, al
0x182379e06: jne 0x182379ec1
0x182379e0c: mov qword ptr [rsp + 0x70], rbx
0x182379e11: xor ebx, ebx
0x182379e13: cmp dword ptr [rdi + 0x18], ebx
0x182379e16: jle 0x182379e7c
0x182379e18: nop dword ptr [rax + rax]
0x182379e20: mov r9, qword ptr [rip + 0x67af391]
0x182379e27: lea rcx, [rsp + 0x30]
0x182379e2c: mov r8d, ebx
0x182379e2f: mov rdx, rdi
0x182379e32: call 0x184ceb860
0x182379e37: mov rcx, qword ptr [rsp + 0x30]
0x182379e3c: xor r9d, r9d
0x182379e3f: mov r8b, 1
0x182379e42: mov rdx, rbp
0x182379e45: call 0x1860133c0 ; System.String.Compare
0x182379e4a: test eax, eax
0x182379e4c: jne 0x182379e75
0x182379e4e: mov r9, qword ptr [rip + 0x67af363]
0x182379e55: lea rcx, [rsp + 0x30]
0x182379e5a: mov r8d, ebx
0x182379e5d: mov rdx, rdi
0x182379e60: call 0x184ceb860
0x182379e65: mov rcx, qword ptr [rsp + 0x40]
0x182379e6a: xor edx, edx
0x182379e6c: call 0x18601a180 ; System.String.IsNullOrEmpty
0x182379e71: test al, al
0x182379e73: jne 0x182379e9c
0x182379e75: inc ebx
0x182379e77: cmp ebx, dword ptr [rdi + 0x18]
0x182379e7a: jl 0x182379e20
0x182379e7c: mov dword ptr [rsi], 0
0x182379e82: xor al, al
0x182379e84: mov rbx, qword ptr [rsp + 0x70]
0x182379e89: mov rbp, qword ptr [rsp + 0x78]
0x182379e8e: mov rsi, qword ptr [rsp + 0x80]
0x182379e96: add rsp, 0x60
0x182379e9a: pop rdi
0x182379e9b: ret 
0x182379e9c: mov r9, qword ptr [rip + 0x67af315]
0x182379ea3: lea rcx, [rsp + 0x30]
0x182379ea8: mov r8d, ebx
0x182379eab: mov rdx, rdi
0x182379eae: call 0x184ceb860
0x182379eb3: movss xmm0, dword ptr [rsp + 0x38]
0x182379eb9: mov al, 1
0x182379ebb: movss dword ptr [rsi], xmm0
0x182379ebf: jmp 0x182379e84
0x182379ec1: mov dword ptr [rsi], 0
0x182379ec7: xor al, al
0x182379ec9: mov rbp, qword ptr [rsp + 0x78]
0x182379ece: mov rsi, qword ptr [rsp + 0x80]
0x182379ed6: add rsp, 0x60
0x182379eda: pop rdi
0x182379edb: ret 
0x182379edc: mov r9, rsi
0x182379edf: mov qword ptr [rsp + 0x20], 0
0x182379ee8: mov r8, rbp
0x182379eeb: mov rdx, rdi
0x182379eee: call 0x183382bd0 ; XLua.DelegateBridge.__Gen_Delegate_Imp233
0x182379ef3: mov rbp, qword ptr [rsp + 0x78]
0x182379ef8: mov rsi, qword ptr [rsp + 0x80]
0x182379f00: add rsp, 0x60
0x182379f04: pop rdi
0x182379f05: ret 
0x182379f06: int3 
0x182379f07: int3 
0x182379f08: int3 
0x182379f09: int3 
0x182379f0a: int3 
0x182379f0b: int3 
0x182379f0c: int3 
0x182379f0d: int3 
0x182379f0e: int3 
0x182379f0f: int3 
