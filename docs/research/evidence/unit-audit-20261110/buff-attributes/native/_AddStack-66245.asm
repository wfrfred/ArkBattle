0x1806d83f0: mov qword ptr [rsp + 0x10], rsi
0x1806d83f5: push rdi
0x1806d83f6: sub rsp, 0x20
0x1806d83fa: cmp byte ptr [rip + 0x88c2f6b], 0
0x1806d8401: mov rdi, rdx
0x1806d8404: mov rsi, rcx
0x1806d8407: jne 0x1806d8428
0x1806d8409: lea rcx, [rip + 0x846c648]
0x1806d8410: call 0x18049c210
0x1806d8415: lea rcx, [rip + 0x852d4bc]
0x1806d841c: call 0x18049c210
0x1806d8421: mov byte ptr [rip + 0x88c2f44], 1
0x1806d8428: mov rax, qword ptr [rip + 0x846c629]
0x1806d842f: cmp dword ptr [rax + 0xe0], 0
0x1806d8436: jne 0x1806d8447
0x1806d8438: mov rcx, rax
0x1806d843b: call 0x18049c450
0x1806d8440: mov rax, qword ptr [rip + 0x846c611]
0x1806d8447: mov rax, qword ptr [rax + 0xb8]
0x1806d844e: mov rcx, qword ptr [rax + 0x6e0]
0x1806d8455: test rcx, rcx
0x1806d8458: jne 0x1806d84c1
0x1806d845a: mov qword ptr [rsp + 0x30], rbx
0x1806d845f: inc dword ptr [rsi + 0x9c]
0x1806d8465: mov rbx, qword ptr [rsi + 0x88]
0x1806d846c: test rdi, rdi
0x1806d846f: je 0x1806d84d9
0x1806d8471: xor edx, edx
0x1806d8473: mov rcx, rdi
0x1806d8476: call 0x1806de570 ; Torappu.Battle.Buff.get_remainingTime
0x1806d847b: mov rcx, qword ptr [rip + 0x852d456]
0x1806d8482: mov rdi, rax
0x1806d8485: cmp dword ptr [rcx + 0xe0], 0
0x1806d848c: jne 0x1806d8493
0x1806d848e: call 0x18049c450
0x1806d8493: xor r8d, r8d
0x1806d8496: mov rdx, rdi
0x1806d8499: mov rcx, rbx
0x1806d849c: call 0x18695fe00 ; Torappu.TSMath.Max
0x1806d84a1: xor edx, edx
0x1806d84a3: mov qword ptr [rsi + 0x88], rax
0x1806d84aa: mov rcx, rsi
0x1806d84ad: mov rbx, qword ptr [rsp + 0x30]
0x1806d84b2: mov rsi, qword ptr [rsp + 0x38]
0x1806d84b7: add rsp, 0x20
0x1806d84bb: pop rdi
0x1806d84bc: jmp 0x1806d9370 ; Torappu.Battle.Buff._DoUpdateStack
0x1806d84c1: xor r9d, r9d
0x1806d84c4: mov r8, rdi
0x1806d84c7: mov rdx, rsi
0x1806d84ca: mov rsi, qword ptr [rsp + 0x38]
0x1806d84cf: add rsp, 0x20
0x1806d84d3: pop rdi
0x1806d84d4: jmp 0x18338c7c0 ; XLua.DelegateBridge.__Gen_Delegate_Imp23
0x1806d84d9: call 0x18049c3c0
0x1806d84de: int3 
0x1806d84df: int3 
