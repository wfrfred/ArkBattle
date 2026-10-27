{'type': 'Torappu.Battle.Buff', 'index': 64540, 'name': 'GetValue', 'address': 6449323648, 'slot': 10, 'parameters': ['attribute', 'addition', 'multiplier', 'finalAddition', 'finalScaler']}
0x18068de80 mov qword ptr [rsp + 8], rbx 
0x18068de85 mov qword ptr [rsp + 0x10], rbp 
0x18068de8a mov qword ptr [rsp + 0x18], rsi 
0x18068de8f push rdi 
0x18068de90 sub rsp, 0x40 
0x18068de94 cmp byte ptr [rip + 0x824175a], 0 
0x18068de9b mov rsi, r9 
0x18068de9e mov rdi, r8 
0x18068dea1 mov ebp, edx 
0x18068dea3 mov rbx, rcx 
0x18068dea6 jne 0x18068ded3 
0x18068dea8 lea rcx, [rip + 0x7f103e1] 
0x18068deaf call 0x1804c1c70 
0x18068deb4 lea rcx, [rip + 0x7dc2a85] 
0x18068debb call 0x1804c1c70 
0x18068dec0 lea rcx, [rip + 0x7dea341] 
0x18068dec7 call 0x1804c1c70 
0x18068decc mov byte ptr [rip + 0x8241722], 1 
0x18068ded3 mov rax, qword ptr [rip + 0x7f103b6] 
0x18068deda cmp dword ptr [rax + 0xe0], 0 
0x18068dee1 jne 0x18068def2 
0x18068dee3 mov rcx, rax 
0x18068dee6 call 0x1804c1eb0 
0x18068deeb mov rax, qword ptr [rip + 0x7f1039e] 
0x18068def2 mov rax, qword ptr [rax + 0xb8] 
0x18068def9 mov rcx, qword ptr [rax + 0x208] 
0x18068df00 test rcx, rcx 
0x18068df03 jne 0x18068dffd 
0x18068df09 xor edx, edx 
0x18068df0b mov rcx, rbx 
0x18068df0e call 0x18069ad10 Torappu.Battle.Buff.get_isEnabled
0x18068df13 test al, al 
0x18068df15 je 0x18068dfb6 
0x18068df1b mov rdx, qword ptr [rip + 0x7dc2a1e] 
0x18068df22 mov ecx, ebp 
0x18068df24 call 0x18463c590 
0x18068df29 mov rdx, qword ptr [rbx + 0x50] 
0x18068df2d movsxd r8, eax 
0x18068df30 test rdx, rdx 
0x18068df33 je 0x18068e048 
0x18068df39 cmp r8d, dword ptr [rdx + 0x18] 
0x18068df3d jae 0x18068e042 
0x18068df43 mov rdx, qword ptr [rdx + r8*8 + 0x20] 
0x18068df48 mov qword ptr [rdi], rdx 
0x18068df4b mov rcx, qword ptr [rbx + 0x48] 
0x18068df4f test rcx, rcx 
0x18068df52 je 0x18068e048 
0x18068df58 cmp r8d, dword ptr [rcx + 0x18] 
0x18068df5c jae 0x18068e042 
0x18068df62 mov rcx, qword ptr [rcx + r8*8 + 0x20] 
0x18068df67 mov qword ptr [rsi], rcx 
0x18068df6a mov rcx, qword ptr [rbx + 0x58] 
0x18068df6e test rcx, rcx 
0x18068df71 je 0x18068e048 
0x18068df77 cmp r8d, dword ptr [rcx + 0x18] 
0x18068df7b jae 0x18068e042 
0x18068df81 mov rcx, qword ptr [rcx + r8*8 + 0x20] 
0x18068df86 mov rax, qword ptr [rsp + 0x70] 
0x18068df8b mov qword ptr [rax], rcx 
0x18068df8e mov rcx, qword ptr [rbx + 0x60] 
0x18068df92 test rcx, rcx 
0x18068df95 je 0x18068e048 
0x18068df9b cmp r8d, dword ptr [rcx + 0x18] 
0x18068df9f jae 0x18068e042 
0x18068dfa5 mov rax, qword ptr [rsp + 0x78] 
0x18068dfaa mov rcx, qword ptr [rcx + r8*8 + 0x20] 
0x18068dfaf mov qword ptr [rax], rcx 
0x18068dfb2 mov al, 1 
0x18068dfb4 jmp 0x18068e02d 
0x18068dfb6 mov rcx, qword ptr [rip + 0x7dea24b] 
0x18068dfbd cmp dword ptr [rcx + 0xe0], 0 
0x18068dfc4 jne 0x18068dfcb 
0x18068dfc6 call 0x1804c1eb0 
0x18068dfcb xor edx, edx 
0x18068dfcd xor ecx, ecx 
0x18068dfcf call 0x1863149f0 Torappu.FP.op_Implicit
0x18068dfd4 mov rcx, qword ptr [rsp + 0x70] 
0x18068dfd9 xor edx, edx 
0x18068dfdb movss xmm0, dword ptr [rip + 0x63e9bfd] 
0x18068dfe3 mov qword ptr [rcx], rax 
0x18068dfe6 mov qword ptr [rsi], rax 
0x18068dfe9 mov qword ptr [rdi], rax 
0x18068dfec call 0x186314a00 Torappu.FP.op_Implicit
0x18068dff1 mov rcx, qword ptr [rsp + 0x78] 
0x18068dff6 mov qword ptr [rcx], rax 
0x18068dff9 xor al, al 
0x18068dffb jmp 0x18068e02d 
0x18068dffd mov rax, qword ptr [rsp + 0x78] 
0x18068e002 mov r9, rdi 
0x18068e005 mov qword ptr [rsp + 0x38], 0 
0x18068e00e mov r8d, ebp 
0x18068e011 mov qword ptr [rsp + 0x30], rax 
0x18068e016 mov rdx, rbx 
0x18068e019 mov rax, qword ptr [rsp + 0x70] 
0x18068e01e mov qword ptr [rsp + 0x28], rax 
0x18068e023 mov qword ptr [rsp + 0x20], rsi 
0x18068e028 call 0x1833108a0 
0x18068e02d mov rbx, qword ptr [rsp + 0x50] 
0x18068e032 mov rbp, qword ptr [rsp + 0x58] 
0x18068e037 mov rsi, qword ptr [rsp + 0x60] 
0x18068e03c add rsp, 0x40 
0x18068e040 pop rdi 
0x18068e041 ret  
0x18068e042 call 0x1804c1e10 
0x18068e047 int3  
0x18068e048 call 0x1804c1e20 
0x18068e04d int3  
0x18068e04e int3  
0x18068e04f int3  
