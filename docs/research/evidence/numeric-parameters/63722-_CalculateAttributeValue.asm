{'type': 'Torappu.Battle.Attributes', 'index': 63722, 'name': '_CalculateAttributeValue', 'address': 6449098560, 'slot': 65535, 'parameters': ['attributeType']}
0x180656f40 mov dword ptr [rsp + 0x10], edx 
0x180656f44 mov qword ptr [rsp + 8], rcx 
0x180656f49 push rbx 
0x180656f4a push rsi 
0x180656f4b push rdi 
0x180656f4c push r12 
0x180656f4e push r13 
0x180656f50 push r14 
0x180656f52 push r15 
0x180656f54 sub rsp, 0xe0 
0x180656f5b mov r12d, edx 
0x180656f5e mov r13, rcx 
0x180656f61 cmp byte ptr [rip + 0x827855b], 0 
0x180656f68 jne 0x180656fd1 
0x180656f6a lea rcx, [rip + 0x7df99cf] 
0x180656f71 call 0x1804c1c70 
0x180656f76 lea rcx, [rip + 0x7dd6a83] 
0x180656f7d call 0x1804c1c70 
0x180656f82 lea rcx, [rip + 0x7dd6cf7] 
0x180656f89 call 0x1804c1c70 
0x180656f8e lea rcx, [rip + 0x7dd6f63] 
0x180656f95 call 0x1804c1c70 
0x180656f9a lea rcx, [rip + 0x7e21267] 
0x180656fa1 call 0x1804c1c70 
0x180656fa6 lea rcx, [rip + 0x7f6f56b] 
0x180656fad call 0x1804c1c70 
0x180656fb2 lea rcx, [rip + 0x7e74cef] 
0x180656fb9 call 0x1804c1c70 
0x180656fbe lea rcx, [rip + 0x7e53a33] 
0x180656fc5 call 0x1804c1c70 
0x180656fca mov byte ptr [rip + 0x82784f2], 1 
0x180656fd1 xor eax, eax 
0x180656fd3 mov qword ptr [rsp + 0x48], rax 
0x180656fd8 mov qword ptr [rsp + 0x50], rax 
0x180656fdd mov qword ptr [rsp + 0x58], rax 
0x180656fe2 mov qword ptr [rsp + 0x60], rax 
0x180656fe7 xorps xmm0, xmm0 
0x180656fea movups xmmword ptr [rsp + 0xb0], xmm0 
0x180656ff2 mov qword ptr [rsp + 0xc0], rax 
0x180656ffa mov rdx, qword ptr [rip + 0x7df993f] 
0x180657001 mov ecx, r12d 
0x180657004 call 0x18463c590 
0x180657009 movsxd rbx, eax 
0x18065700c mov dword ptr [rsp + 0x44], ebx 
0x180657010 mov dword ptr [rsp + 0x40], ebx 
0x180657014 mov dword ptr [rsp + 0x138], ebx 
0x18065701b mov rcx, qword ptr [rip + 0x7e211e6] 
0x180657022 cmp dword ptr [rcx + 0xe0], 0 
0x180657029 jne 0x180657030 
0x18065702b call 0x1804c1eb0 
0x180657030 xor edx, edx 
0x180657032 xor ecx, ecx 
0x180657034 call 0x1863149f0 Torappu.FP.op_Implicit
0x180657039 mov rdi, rax 
0x18065703c mov qword ptr [rsp + 0x68], rax 
0x180657041 xor edx, edx 
0x180657043 movss xmm0, dword ptr [rip + 0x6420b95] 
0x18065704b call 0x186314a00 Torappu.FP.op_Implicit
0x180657050 mov r14, rax 
0x180657053 mov qword ptr [rsp + 0x70], rax 
0x180657058 xor edx, edx 
0x18065705a xor ecx, ecx 
0x18065705c call 0x1863149f0 Torappu.FP.op_Implicit
0x180657061 mov r15, rax 
0x180657064 mov qword ptr [rsp + 0x78], rax 
0x180657069 xor edx, edx 
0x18065706b movss xmm0, dword ptr [rip + 0x6420b6d] 
0x180657073 call 0x186314a00 Torappu.FP.op_Implicit
0x180657078 mov rsi, rax 
0x18065707b mov qword ptr [rsp + 0x80], rax 
0x180657083 mov rcx, qword ptr [r13 + 0x18] 
0x180657087 test rcx, rcx 
0x18065708a je 0x18065759a 
0x180657090 cmp ebx, dword ptr [rcx + 0x18] 
0x180657093 jae 0x1806575ac 
0x180657099 mov rdx, qword ptr [rcx + rbx*8 + 0x20] 
0x18065709e test rdx, rdx 
0x1806570a1 je 0x1806572ef 
0x1806570a7 mov r8, qword ptr [rip + 0x7f6f46a] 
0x1806570ae lea rcx, [rsp + 0x88] 
0x1806570b6 call 0x184b73580 
0x1806570bb movups xmm0, xmmword ptr [rsp + 0x88] 
0x1806570c3 movups xmmword ptr [rsp + 0xb0], xmm0 
0x1806570cb movsd xmm1, qword ptr [rsp + 0x98] 
0x1806570d4 movsd qword ptr [rsp + 0xc0], xmm1 
0x1806570dd mov qword ptr [rsp + 0x88], 0 
0x1806570e9 lea r12, [rsp + 0xb0] 
0x1806570f1 mov qword ptr [rsp + 0x90], r12 
0x1806570f9 nop dword ptr [rax] 
0x180657100 mov rdx, qword ptr [rip + 0x7dd6b79] 
0x180657107 lea rcx, [rsp + 0xb0] 
0x18065710f call 0x18577bbc0 
0x180657114 test al, al 
0x180657116 je 0x180657282 
0x18065711c mov r13, qword ptr [rsp + 0xc0] 
0x180657124 test r13, r13 
0x180657127 je 0x1806575a0 
0x18065712d mov rbx, qword ptr [rip + 0x7e74b74] 
0x180657134 mov r9, qword ptr [r13] 
0x180657138 mov qword ptr [rsp + 0xc8], r9 
0x180657140 cmp byte ptr [rip + 0x82b66c9], 0 
0x180657147 je 0x180657159 
0x180657149 mov rcx, r9 
0x18065714c call 0x18047cdd0 
0x180657151 mov r9, qword ptr [rsp + 0xc8] 
0x180657159 xor eax, eax 
0x18065715b movzx ecx, ax 
0x18065715e movzx edx, word ptr [r9 + 0x12a] 
0x180657166 cmp ax, dx 
0x180657169 jae 0x180657198 
0x18065716b mov r8, qword ptr [r9 + 0xb0] 
0x180657172 nop dword ptr [rax] 
0x180657176 nop word ptr [rax + rax] 
0x180657180 movzx eax, cx 
0x180657183 add rax, rax 
0x180657186 cmp qword ptr [r8 + rax*8], rbx 
0x18065718a je 0x180657265 
0x180657190 inc cx 
0x180657193 cmp cx, dx 
0x180657196 jb 0x180657180 
0x180657198 xor r8d, r8d 
0x18065719b mov rdx, rbx 
0x18065719e mov rcx, r13 
0x1806571a1 call 0x18047bdb0 
0x1806571a6 mov r10, qword ptr [rax] 
0x1806571a9 mov rax, qword ptr [rax + 8] 
0x1806571ad mov qword ptr [rsp + 0x30], rax 
0x1806571b2 lea rax, [rsp + 0x60] 
0x1806571b7 mov qword ptr [rsp + 0x28], rax 
0x1806571bc lea rax, [rsp + 0x58] 
0x1806571c1 mov qword ptr [rsp + 0x20], rax 
0x1806571c6 lea r9, [rsp + 0x50] 
0x1806571cb lea r8, [rsp + 0x48] 
0x1806571d0 mov edx, dword ptr [rsp + 0x128] 
0x1806571d7 mov rcx, r13 
0x1806571da call r10 
0x1806571dd test al, al 
0x1806571df je 0x180657100 
0x1806571e5 mov rbx, qword ptr [rsp + 0x48] 
0x1806571ea mov rcx, qword ptr [rip + 0x7e21017] 
0x1806571f1 cmp dword ptr [rcx + 0xe0], 0 
0x1806571f8 jne 0x1806571ff 
0x1806571fa call 0x1804c1eb0 
0x1806571ff xor r8d, r8d 
0x180657202 mov rdx, rbx 
0x180657205 mov rcx, rdi 
0x180657208 call 0x1848bcb80 aliases=2 Torappu.FP.op_Addition / Torappu.FP.FastAdd
0x18065720d mov rdi, rax 
0x180657210 mov qword ptr [rsp + 0x68], rax 
0x180657215 xor r8d, r8d 
0x180657218 mov rdx, qword ptr [rsp + 0x50] 
0x18065721d mov rcx, r14 
0x180657220 call 0x1848bcb80 aliases=2 Torappu.FP.op_Addition / Torappu.FP.FastAdd
0x180657225 mov r14, rax 
0x180657228 mov qword ptr [rsp + 0x70], rax 
0x18065722d xor r8d, r8d 
0x180657230 mov rdx, qword ptr [rsp + 0x58] 
0x180657235 mov rcx, r15 
0x180657238 call 0x1848bcb80 aliases=2 Torappu.FP.op_Addition / Torappu.FP.FastAdd
0x18065723d mov r15, rax 
0x180657240 mov qword ptr [rsp + 0x78], rax 
0x180657245 xor r8d, r8d 
0x180657248 mov rdx, qword ptr [rsp + 0x60] 
0x18065724d mov rcx, rsi 
0x180657250 call 0x186312770 aliases=2 Torappu.FP.op_Multiply / Torappu.FP.FastMul
0x180657255 mov rsi, rax 
0x180657258 mov qword ptr [rsp + 0x80], rax 
0x180657260 jmp 0x180657100 
0x180657265 movzx ecx, cx 
0x180657268 add rcx, rcx 
0x18065726b movsxd rax, dword ptr [r8 + rcx*8 + 8] 
0x180657270 shl rax, 4 
0x180657274 add rax, 0x138 
0x18065727a add rax, r9 
0x18065727d jmp 0x1806571a6 
0x180657282 mov rdx, qword ptr [rip + 0x7dd6777] 
0x180657289 mov rcx, r12 
0x18065728c call 0x180542070 aliases=2137 Torappu.AudioManager+<UnloadAll>d__119.System.IDisposable.Dispose / Torappu.AudioManager+<_StopAllChannels>d__120.System.IDisposable.Dispose / Torappu.StatisticToolConfig.CleanFilesInFolder
0x180657291 mov r13, qword ptr [rsp + 0x120] 
0x180657299 mov r12d, dword ptr [rsp + 0x128] 
0x1806572a1 jmp 0x1806572ef 
0x1806572a3 mov rdx, qword ptr [rip + 0x7dd6756] 
0x1806572aa mov rcx, qword ptr [rsp + 0x90] 
0x1806572b2 call 0x180542070 aliases=2137 Torappu.AudioManager+<UnloadAll>d__119.System.IDisposable.Dispose / Torappu.AudioManager+<_StopAllChannels>d__120.System.IDisposable.Dispose / Torappu.StatisticToolConfig.CleanFilesInFolder
0x1806572b7 mov rcx, qword ptr [rsp + 0x88] 
0x1806572bf test rcx, rcx 
0x1806572c2 jne 0x1806575a6 
0x1806572c8 mov rdi, qword ptr [rsp + 0x68] 
0x1806572cd mov r14, qword ptr [rsp + 0x70] 
0x1806572d2 mov r15, qword ptr [rsp + 0x78] 
0x1806572d7 mov rsi, qword ptr [rsp + 0x80] 
0x1806572df mov r13, qword ptr [rsp + 0x120] 
0x1806572e7 mov r12d, dword ptr [rsp + 0x128] 
0x1806572ef movsxd r8, dword ptr [rsp + 0x138] 
0x1806572f7 mov ecx, r8d 
0x1806572fa mov edx, 1 
0x1806572ff shl rdx, cl 
0x180657302 and rdx, qword ptr [r13 + 0x78] 
0x180657306 sub qword ptr [r13 + 0x78], rdx 
0x18065730a mov rdx, qword ptr [r13 + 0x58] 
0x18065730e test rdx, rdx 
0x180657311 je 0x18065759a 
0x180657317 mov eax, dword ptr [rsp + 0x40] 
0x18065731b cmp eax, dword ptr [rdx + 0x18] 
0x18065731e jae 0x1806575ac 
0x180657324 lea rcx, [r8 + 1] 
0x180657328 lea rcx, [r8 + rcx*4] 
0x18065732c lea rcx, [rdx + rcx*8] 
0x180657330 xor edx, edx 
0x180657332 call 0x186314fd0 Torappu.ObscuredFP.Decrypt
0x180657337 mov rbx, rax 
0x18065733a mov rcx, qword ptr [rip + 0x7e20ec7] 
0x180657341 cmp dword ptr [rcx + 0xe0], 0 
0x180657348 jne 0x18065734f 
0x18065734a call 0x1804c1eb0 
0x18065734f xor r8d, r8d 
0x180657352 mov rdx, rdi 
0x180657355 mov rcx, rbx 
0x180657358 call 0x1848bcb80 aliases=2 Torappu.FP.op_Addition / Torappu.FP.FastAdd
0x18065735d mov rbx, rax 
0x180657360 xor edx, edx 
0x180657362 xor ecx, ecx 
0x180657364 call 0x1863149f0 Torappu.FP.op_Implicit
0x180657369 mov rdi, rax 
0x18065736c mov rcx, qword ptr [rip + 0x7e53685] 
0x180657373 cmp dword ptr [rcx + 0xe0], 0 
0x18065737a jne 0x180657381 
0x18065737c call 0x1804c1eb0 
0x180657381 xor r8d, r8d 
0x180657384 mov rdx, r14 
0x180657387 mov rcx, rdi 
0x18065738a call 0x186316680 Torappu.TSMath.Max
0x18065738f xor r8d, r8d 
0x180657392 mov rdx, rax 
0x180657395 mov rcx, rbx 
0x180657398 call 0x186312770 aliases=2 Torappu.FP.op_Multiply / Torappu.FP.FastMul
0x18065739d xor r8d, r8d 
0x1806573a0 mov rdx, r15 
0x1806573a3 mov rcx, rax 
0x1806573a6 call 0x1848bcb80 aliases=2 Torappu.FP.op_Addition / Torappu.FP.FastAdd
0x1806573ab xor r8d, r8d 
0x1806573ae mov rdx, rsi 
0x1806573b1 mov rcx, rax 
0x1806573b4 call 0x186312770 aliases=2 Torappu.FP.op_Multiply / Torappu.FP.FastMul
0x1806573b9 mov rdi, rax 
0x1806573bc cmp byte ptr [rip + 0x8278101], 0 
0x1806573c3 jne 0x1806573f0 
0x1806573c5 lea rcx, [rip + 0x7df9574] 
0x1806573cc call 0x1804c1c70 
0x1806573d1 lea rcx, [rip + 0x7dea2a0] 
0x1806573d8 call 0x1804c1c70 
0x1806573dd lea rcx, [rip + 0x7dea50c] 
0x1806573e4 call 0x1804c1c70 
0x1806573e9 mov byte ptr [rip + 0x82780d4], 1 
0x1806573f0 mov rdx, qword ptr [rip + 0x7df9549] 
0x1806573f7 mov ecx, r12d 
0x1806573fa call 0x18463c590 
0x1806573ff mov r8, qword ptr [r13 + 0x70] 
0x180657403 test r8, r8 
0x180657406 je 0x18065759a 
0x18065740c cmp eax, dword ptr [r8 + 0x18] 
0x180657410 jae 0x1806575ac 
0x180657416 movsxd rcx, eax 
0x180657419 lea rdx, [rcx + rcx*2] 
0x18065741d cmp byte ptr [r8 + rdx*8 + 0x20], 0 
0x180657423 jne 0x18065744b 
0x180657425 mov rcx, qword ptr [r13 + 0x60] 
0x180657429 test rcx, rcx 
0x18065742c je 0x18065759a 
0x180657432 cmp eax, dword ptr [rcx + 0x18] 
0x180657435 jae 0x1806575ac 
0x18065743b movsxd rbx, eax 
0x18065743e add rbx, 2 
0x180657442 add rbx, rbx 
0x180657445 mov rbx, qword ptr [rcx + rbx*8] 
0x180657449 jmp 0x180657475 
0x18065744b cdqe  
0x18065744d lea rdx, [rax + 2] 
0x180657451 lea rdx, [rax + rdx*2] 
0x180657455 lea rdx, [r8 + rdx*8] 
0x180657459 mov r8, qword ptr [rip + 0x7dea490] 
0x180657460 lea rcx, [rsp + 0x88] 
0x180657468 call 0x184fd5d90 
0x18065746d mov rbx, qword ptr [rsp + 0x88] 
0x180657475 cmp byte ptr [rip + 0x8278049], 0 
0x18065747c jne 0x1806574a9 
0x18065747e lea rcx, [rip + 0x7df94bb] 
0x180657485 call 0x1804c1c70 
0x18065748a lea rcx, [rip + 0x7dea1e7] 
0x180657491 call 0x1804c1c70 
0x180657496 lea rcx, [rip + 0x7dea453] 
0x18065749d call 0x1804c1c70 
0x1806574a2 mov byte ptr [rip + 0x827801c], 1 
0x1806574a9 mov rdx, qword ptr [rip + 0x7df9490] 
0x1806574b0 mov ecx, r12d 
0x1806574b3 call 0x18463c590 
0x1806574b8 mov r8, qword ptr [r13 + 0x70] 
0x1806574bc test r8, r8 
0x1806574bf je 0x18065759a 
0x1806574c5 cmp eax, dword ptr [r8 + 0x18] 
0x1806574c9 jae 0x1806575ac 
0x1806574cf movsxd rcx, eax 
0x1806574d2 lea rdx, [rcx + rcx*2] 
0x1806574d6 cmp byte ptr [r8 + rdx*8 + 0x20], 0 
0x1806574dc jne 0x180657501 
0x1806574de mov rcx, qword ptr [r13 + 0x60] 
0x1806574e2 test rcx, rcx 
0x1806574e5 je 0x18065759a 
0x1806574eb cmp eax, dword ptr [rcx + 0x18] 
0x1806574ee jae 0x1806575ac 
0x1806574f4 movsxd r8, eax 
0x1806574f7 add r8, r8 
0x1806574fa mov r8, qword ptr [rcx + r8*8 + 0x28] 
0x1806574ff jmp 0x18065752b 
0x180657501 cdqe  
0x180657503 lea rcx, [rax + 2] 
0x180657507 lea rcx, [rax + rcx*2] 
0x18065750b lea rdx, [r8 + rcx*8] 
0x18065750f mov r8, qword ptr [rip + 0x7dea3da] 
0x180657516 lea rcx, [rsp + 0x88] 
0x18065751e call 0x184fd5d90 
0x180657523 mov r8, qword ptr [rsp + 0x90] 
0x18065752b xor r9d, r9d 
0x18065752e mov rdx, rbx 
0x180657531 mov rcx, rdi 
0x180657534 call 0x186316210 Torappu.TSMath.Clamp
0x180657539 mov rbx, rax 
0x18065753c mov rdi, qword ptr [r13 + 0x68] 
0x180657540 xor r8d, r8d 
0x180657543 mov rdx, rax 
0x180657546 lea rcx, [rsp + 0x88] 
0x18065754e call 0x186315610 Torappu.ObscuredFP.op_Implicit
0x180657553 test rdi, rdi 
0x180657556 je 0x18065759a 
0x180657558 mov ecx, dword ptr [rsp + 0x44] 
0x18065755c cmp ecx, dword ptr [rdi + 0x18] 
0x18065755f jae 0x1806575ac 
0x180657561 movsxd rcx, ecx 
0x180657564 lea rdx, [rcx + rcx*4] 
0x180657568 movups xmm0, xmmword ptr [rax] 
0x18065756b movups xmmword ptr [rdi + rdx*8 + 0x20], xmm0 
0x180657570 movups xmm1, xmmword ptr [rax + 0x10] 
0x180657574 movups xmmword ptr [rdi + rdx*8 + 0x30], xmm1 
0x180657579 movsd xmm0, qword ptr [rax + 0x20] 
0x18065757e movsd qword ptr [rdi + rdx*8 + 0x40], xmm0 
0x180657584 mov rax, rbx 
0x180657587 add rsp, 0xe0 
0x18065758e pop r15 
0x180657590 pop r14 
0x180657592 pop r13 
0x180657594 pop r12 
0x180657596 pop rdi 
0x180657597 pop rsi 
0x180657598 pop rbx 
0x180657599 ret  
0x18065759a call 0x1804c1e20 
0x18065759f nop  
0x1806575a0 call 0x1804c1e20 
0x1806575a5 nop  
0x1806575a6 call 0x1804a8d30 
0x1806575ab int3  
0x1806575ac call 0x1804c1e10 
0x1806575b1 int3  
0x1806575b2 int3  
0x1806575b3 int3  
0x1806575b4 int3  
0x1806575b5 int3  
0x1806575b6 int3  
0x1806575b7 int3  
0x1806575b8 int3  
0x1806575b9 int3  
0x1806575ba int3  
0x1806575bb int3  
0x1806575bc int3  
0x1806575bd int3  
0x1806575be int3  
0x1806575bf int3  
