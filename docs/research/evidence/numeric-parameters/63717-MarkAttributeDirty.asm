{'type': 'Torappu.Battle.Attributes', 'index': 63717, 'name': 'MarkAttributeDirty', 'address': 6449093664, 'slot': 65535, 'parameters': ['attributeType']}
0x180655c20 mov qword ptr [rsp + 0x10], rbx 
0x180655c25 mov qword ptr [rsp + 0x18], rsi 
0x180655c2a push rdi 
0x180655c2b sub rsp, 0x50 
0x180655c2f cmp byte ptr [rip + 0x827988a], 0 
0x180655c36 mov esi, edx 
0x180655c38 mov rdi, rcx 
0x180655c3b jne 0x180655c50 
0x180655c3d lea rcx, [rip + 0x7dfacfc] 
0x180655c44 call 0x1804c1c70 
0x180655c49 mov byte ptr [rip + 0x8279870], 1 
0x180655c50 mov rdx, qword ptr [rip + 0x7dface9] 
0x180655c57 mov ecx, esi 
0x180655c59 mov rbx, qword ptr [rdi + 0x78] 
0x180655c5d call 0x18463c590 
0x180655c62 and eax, 0x3f 
0x180655c65 bts rbx, rax 
0x180655c69 cmp qword ptr [rdi + 0x80], 0 
0x180655c71 mov qword ptr [rdi + 0x78], rbx 
0x180655c75 je 0x180655cea 
0x180655c77 mov rdx, qword ptr [rip + 0x7dfacc2] 
0x180655c7e mov ecx, esi 
0x180655c80 mov rbx, qword ptr [rdi + 0x68] 
0x180655c84 mov qword ptr [rsp + 0x60], rbp 
0x180655c89 mov rbp, qword ptr [rdi + 0x80] 
0x180655c90 call 0x18463c590 
0x180655c95 test rbx, rbx 
0x180655c98 je 0x180655cfa 
0x180655c9a cmp eax, dword ptr [rbx + 0x18] 
0x180655c9d jae 0x180655d00 
0x180655c9f cdqe  
0x180655ca1 xor edx, edx 
0x180655ca3 lea rcx, [rax + rax*4] 
0x180655ca7 movups xmm0, xmmword ptr [rbx + rcx*8 + 0x20] 
0x180655cac movups xmm1, xmmword ptr [rbx + rcx*8 + 0x30] 
0x180655cb1 movaps xmmword ptr [rsp + 0x20], xmm0 
0x180655cb6 movsd xmm0, qword ptr [rbx + rcx*8 + 0x40] 
0x180655cbc lea rcx, [rsp + 0x20] 
0x180655cc1 movsd qword ptr [rsp + 0x40], xmm0 
0x180655cc7 movaps xmmword ptr [rsp + 0x30], xmm1 
0x180655ccc call 0x186315640 Torappu.ObscuredFP.op_Implicit
0x180655cd1 mov r10, qword ptr [rbp + 0x18] 
0x180655cd5 mov r8, rax 
0x180655cd8 mov r9, qword ptr [rbp + 0x28] 
0x180655cdc mov edx, esi 
0x180655cde mov rcx, qword ptr [rbp + 0x40] 
0x180655ce2 call r10 
0x180655ce5 mov rbp, qword ptr [rsp + 0x60] 
0x180655cea mov rbx, qword ptr [rsp + 0x68] 
0x180655cef mov rsi, qword ptr [rsp + 0x70] 
0x180655cf4 add rsp, 0x50 
0x180655cf8 pop rdi 
0x180655cf9 ret  
0x180655cfa call 0x1804c1e20 
0x180655cff int3  
0x180655d00 call 0x1804c1e10 
0x180655d05 int3  
0x180655d06 int3  
0x180655d07 int3  
0x180655d08 int3  
0x180655d09 int3  
0x180655d0a int3  
0x180655d0b int3  
0x180655d0c int3  
0x180655d0d int3  
0x180655d0e int3  
0x180655d0f int3  
