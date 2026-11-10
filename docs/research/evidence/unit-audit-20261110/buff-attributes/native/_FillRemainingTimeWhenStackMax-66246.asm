0x1806d96b0: mov qword ptr [rsp + 0x10], rsi
0x1806d96b5: push rdi
0x1806d96b6: sub rsp, 0x20
0x1806d96ba: cmp byte ptr [rip + 0x88c1cac], 0
0x1806d96c1: mov rdi, rdx
0x1806d96c4: mov rsi, rcx
0x1806d96c7: jne 0x1806d96e8
0x1806d96c9: lea rcx, [rip + 0x846b388]
0x1806d96d0: call 0x18049c210
0x1806d96d5: lea rcx, [rip + 0x852c1fc]
0x1806d96dc: call 0x18049c210
0x1806d96e1: mov byte ptr [rip + 0x88c1c85], 1
0x1806d96e8: mov rax, qword ptr [rip + 0x846b369]
0x1806d96ef: cmp dword ptr [rax + 0xe0], 0
0x1806d96f6: jne 0x1806d9707
0x1806d96f8: mov rcx, rax
0x1806d96fb: call 0x18049c450
0x1806d9700: mov rax, qword ptr [rip + 0x846b351]
0x1806d9707: mov rax, qword ptr [rax + 0xb8]
0x1806d970e: mov rcx, qword ptr [rax + 0x6e8]
0x1806d9715: test rcx, rcx
0x1806d9718: jne 0x1806d9772
0x1806d971a: mov qword ptr [rsp + 0x30], rbx
0x1806d971f: mov rbx, qword ptr [rsi + 0x88]
0x1806d9726: test rdi, rdi
0x1806d9729: je 0x1806d978a
0x1806d972b: xor edx, edx
0x1806d972d: mov rcx, rdi
0x1806d9730: call 0x1806de570 ; Torappu.Battle.Buff.get_remainingTime
0x1806d9735: mov rcx, qword ptr [rip + 0x852c19c]
0x1806d973c: mov rdi, rax
0x1806d973f: cmp dword ptr [rcx + 0xe0], 0
0x1806d9746: jne 0x1806d974d
0x1806d9748: call 0x18049c450
0x1806d974d: xor r8d, r8d
0x1806d9750: mov rdx, rdi
0x1806d9753: mov rcx, rbx
0x1806d9756: call 0x18695fe00 ; Torappu.TSMath.Max
0x1806d975b: mov rbx, qword ptr [rsp + 0x30]
0x1806d9760: mov qword ptr [rsi + 0x88], rax
0x1806d9767: mov rsi, qword ptr [rsp + 0x38]
0x1806d976c: add rsp, 0x20
0x1806d9770: pop rdi
0x1806d9771: ret 
0x1806d9772: xor r9d, r9d
0x1806d9775: mov r8, rdi
0x1806d9778: mov rdx, rsi
0x1806d977b: mov rsi, qword ptr [rsp + 0x38]
0x1806d9780: add rsp, 0x20
0x1806d9784: pop rdi
0x1806d9785: jmp 0x18338c7c0 ; XLua.DelegateBridge.__Gen_Delegate_Imp23
0x1806d978a: call 0x18049c3c0
0x1806d978f: int3 
