0x1823795f0: mov qword ptr [rsp + 8], rbx
0x1823795f5: mov qword ptr [rsp + 0x10], rsi
0x1823795fa: push rdi
0x1823795fb: sub rsp, 0x50
0x1823795ff: cmp byte ptr [rip + 0x6c368c7], 0
0x182379606: mov rbx, r8
0x182379609: mov rdi, rdx
0x18237960c: mov rsi, rcx
0x18237960f: jne 0x182379630
0x182379611: lea rcx, [rip + 0x67b00b0]
0x182379618: call 0x18049c210
0x18237961d: lea rcx, [rip + 0x684d68c]
0x182379624: call 0x18049c210
0x182379629: mov byte ptr [rip + 0x6c3689d], 1
0x182379630: mov rax, qword ptr [rip + 0x67b0091]
0x182379637: mov dword ptr [rsp + 0x30], 0
0x18237963f: mov rcx, qword ptr [rax + 0xb8]
0x182379646: mov rcx, qword ptr [rcx + 0xb0]
0x18237964d: test rcx, rcx
0x182379650: jne 0x1823796ae
0x182379652: movaps xmmword ptr [rsp + 0x40], xmm6
0x182379657: xor r9d, r9d
0x18237965a: lea r8, [rsp + 0x30]
0x18237965f: mov rdx, rdi
0x182379662: mov rcx, rsi
0x182379665: call 0x182379d90 ; Torappu.Blackboard._TryGetNumber
0x18237966a: mov rcx, qword ptr [rip + 0x684d63f]
0x182379671: movzx edi, al
0x182379674: movss xmm6, dword ptr [rsp + 0x30]
0x18237967a: cmp dword ptr [rcx + 0xe0], 0
0x182379681: jne 0x182379688
0x182379683: call 0x18049c450
0x182379688: xor edx, edx
0x18237968a: movaps xmm0, xmm6
0x18237968d: call 0x18695e180 ; Torappu.FP.op_Implicit
0x182379692: movaps xmm6, xmmword ptr [rsp + 0x40]
0x182379697: mov qword ptr [rbx], rax
0x18237969a: movzx eax, dil
0x18237969e: mov rbx, qword ptr [rsp + 0x60]
0x1823796a3: mov rsi, qword ptr [rsp + 0x68]
0x1823796a8: add rsp, 0x50
0x1823796ac: pop rdi
0x1823796ad: ret 
0x1823796ae: mov r9, rbx
0x1823796b1: mov qword ptr [rsp + 0x20], 0
0x1823796ba: mov r8, rdi
0x1823796bd: mov rdx, rsi
0x1823796c0: call 0x183801380 ; XLua.DelegateBridge.__Gen_Delegate_Imp979
0x1823796c5: mov rbx, qword ptr [rsp + 0x60]
0x1823796ca: mov rsi, qword ptr [rsp + 0x68]
0x1823796cf: add rsp, 0x50
0x1823796d3: pop rdi
0x1823796d4: ret 
0x1823796d5: int3 
0x1823796d6: int3 
0x1823796d7: int3 
0x1823796d8: int3 
0x1823796d9: int3 
0x1823796da: int3 
0x1823796db: int3 
0x1823796dc: int3 
0x1823796dd: int3 
0x1823796de: int3 
0x1823796df: int3 
