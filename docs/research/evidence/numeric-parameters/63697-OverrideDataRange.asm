{'type': 'Torappu.Battle.Attributes', 'index': 63697, 'name': 'OverrideDataRange', 'address': 6449094128, 'slot': 65535, 'parameters': ['attributeType', 'min', 'max', 'refresh']}
0x180655df0 mov qword ptr [rsp + 0x18], rbx 
0x180655df5 push rbp 
0x180655df6 push rsi 
0x180655df7 push r14 
0x180655df9 sub rsp, 0x60 
0x180655dfd cmp byte ptr [rip + 0x82796ac], 0 
0x180655e04 mov r14, r9 
0x180655e07 mov rbx, r8 
0x180655e0a mov esi, edx 
0x180655e0c mov rbp, rcx 
0x180655e0f jne 0x180655e48 
0x180655e11 lea rcx, [rip + 0x7dfab28] 
0x180655e18 call 0x1804c1c70 
0x180655e1d lea rcx, [rip + 0x7f74e3c] 
0x180655e24 call 0x1804c1c70 
0x180655e29 lea rcx, [rip + 0x7deb350] 
0x180655e30 call 0x1804c1c70 
0x180655e35 lea rcx, [rip + 0x7f75314] 
0x180655e3c call 0x1804c1c70 
0x180655e41 mov byte ptr [rip + 0x8279668], 1 
0x180655e48 cmp byte ptr [rbx], 0 
0x180655e4b jne 0x180655e57 
0x180655e4d cmp byte ptr [r14], 0 
0x180655e51 je 0x180655fb3 
0x180655e57 movups xmm0, xmmword ptr [rbx] 
0x180655e5a mov qword ptr [rsp + 0x80], rdi 
0x180655e62 movd eax, xmm0 
0x180655e66 movups xmmword ptr [rsp + 0x20], xmm0 
0x180655e6b test al, al 
0x180655e6d je 0x180655e76 
0x180655e6f mov rdi, qword ptr [rsp + 0x28] 
0x180655e74 jmp 0x180655ea8 
0x180655e76 mov rdx, qword ptr [rip + 0x7dfaac3] 
0x180655e7d mov ecx, esi 
0x180655e7f mov rbx, qword ptr [rbp + 0x60] 
0x180655e83 call 0x18463c590 
0x180655e88 test rbx, rbx 
0x180655e8b je 0x180655fc4 
0x180655e91 cmp eax, dword ptr [rbx + 0x18] 
0x180655e94 jae 0x180655fd6 
0x180655e9a movsxd rdi, eax 
0x180655e9d add rdi, 2 
0x180655ea1 add rdi, rdi 
0x180655ea4 mov rdi, qword ptr [rbx + rdi*8] 
0x180655ea8 movups xmm0, xmmword ptr [r14] 
0x180655eac movd eax, xmm0 
0x180655eb0 movups xmmword ptr [rsp + 0x20], xmm0 
0x180655eb5 test al, al 
0x180655eb7 je 0x180655ec0 
0x180655eb9 mov rbx, qword ptr [rsp + 0x28] 
0x180655ebe jmp 0x180655ef0 
0x180655ec0 mov rdx, qword ptr [rip + 0x7dfaa79] 
0x180655ec7 mov ecx, esi 
0x180655ec9 mov r14, qword ptr [rbp + 0x60] 
0x180655ecd call 0x18463c590 
0x180655ed2 test r14, r14 
0x180655ed5 je 0x180655fc4 
0x180655edb cmp eax, dword ptr [r14 + 0x18] 
0x180655edf jae 0x180655fd6 
0x180655ee5 movsxd rbx, eax 
0x180655ee8 add rbx, rbx 
0x180655eeb mov rbx, qword ptr [r14 + rbx*8 + 0x28] 
0x180655ef0 mov rdx, qword ptr [rip + 0x7dfaa49] 
0x180655ef7 mov ecx, esi 
0x180655ef9 mov r14, qword ptr [rbp + 0x70] 
0x180655efd mov qword ptr [rsp + 0x88], r15 
0x180655f05 call 0x18463c590 
0x180655f0a xorps xmm0, xmm0 
0x180655f0d movsxd r15, eax 
0x180655f10 xor r9d, r9d 
0x180655f13 lea rcx, [rsp + 0x20] 
0x180655f18 mov r8, rbx 
0x180655f1b mov rdx, rdi 
0x180655f1e movups xmmword ptr [rsp + 0x20], xmm0 
0x180655f23 call 0x18199a940 aliases=3 Torappu.ConvexHull+BorderLine..ctor / Torappu.TSVector2..ctor / Torappu.TSVector2.Set
0x180655f28 mov r8, qword ptr [rip + 0x7deb251] 
0x180655f2f lea rdx, [rsp + 0x30] 
0x180655f34 xorps xmm0, xmm0 
0x180655f37 lea rcx, [rsp + 0x40] 
0x180655f3c movups xmmword ptr [rsp + 0x40], xmm0 
0x180655f41 xor eax, eax 
0x180655f43 movaps xmm0, xmmword ptr [rsp + 0x20] 
0x180655f48 movdqa xmmword ptr [rsp + 0x30], xmm0 
0x180655f4e mov qword ptr [rsp + 0x50], rax 
0x180655f53 call 0x184fd5b40 
0x180655f58 test r14, r14 
0x180655f5b je 0x180655fd0 
0x180655f5d cmp r15d, dword ptr [r14 + 0x18] 
0x180655f61 jae 0x180655fca 
0x180655f63 movups xmm0, xmmword ptr [rsp + 0x40] 
0x180655f68 lea rcx, [r15 + r15*2] 
0x180655f6c xor r8d, r8d 
0x180655f6f mov edx, esi 
0x180655f71 movups xmmword ptr [r14 + rcx*8 + 0x20], xmm0 
0x180655f77 movsd xmm1, qword ptr [rsp + 0x50] 
0x180655f7d movsd qword ptr [r14 + rcx*8 + 0x30], xmm1 
0x180655f84 mov rcx, rbp 
0x180655f87 call 0x180655c20 Torappu.Battle.Attributes.MarkAttributeDirty
0x180655f8c cmp byte ptr [rsp + 0xa0], 0 
0x180655f94 je 0x180655fa3 
0x180655f96 xor r8d, r8d 
0x180655f99 mov edx, esi 
0x180655f9b mov rcx, rbp 
0x180655f9e call 0x180655b30 Torappu.Battle.Attributes.GetValue
0x180655fa3 mov r15, qword ptr [rsp + 0x88] 
0x180655fab mov rdi, qword ptr [rsp + 0x80] 
0x180655fb3 mov rbx, qword ptr [rsp + 0x90] 
0x180655fbb add rsp, 0x60 
0x180655fbf pop r14 
0x180655fc1 pop rsi 
0x180655fc2 pop rbp 
0x180655fc3 ret  
0x180655fc4 call 0x1804c1e20 
0x180655fc9 int3  
0x180655fca call 0x1804c1e10 
0x180655fcf int3  
0x180655fd0 call 0x1804c1e20 
0x180655fd5 int3  
0x180655fd6 call 0x1804c1e10 
0x180655fdb int3  
0x180655fdc int3  
0x180655fdd int3  
0x180655fde int3  
0x180655fdf int3  
