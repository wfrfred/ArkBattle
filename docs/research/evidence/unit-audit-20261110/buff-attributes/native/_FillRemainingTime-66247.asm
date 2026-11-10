0x1806d9790: mov qword ptr [rsp + 0x18], rbp
0x1806d9795: push rsi
0x1806d9796: sub rsp, 0x20
0x1806d979a: cmp byte ptr [rip + 0x88c1bcd], 0
0x1806d97a1: mov rsi, rdx
0x1806d97a4: mov rbp, rcx
0x1806d97a7: jne 0x1806d97e0
0x1806d97a9: lea rcx, [rip + 0x846b2a8]
0x1806d97b0: call 0x18049c210
0x1806d97b5: lea rcx, [rip + 0x84ed4f4]
0x1806d97bc: call 0x18049c210
0x1806d97c1: lea rcx, [rip + 0x8446888]
0x1806d97c8: call 0x18049c210
0x1806d97cd: lea rcx, [rip + 0x852c104]
0x1806d97d4: call 0x18049c210
0x1806d97d9: mov byte ptr [rip + 0x88c1b8e], 1
0x1806d97e0: mov rax, qword ptr [rip + 0x846b271]
0x1806d97e7: cmp dword ptr [rax + 0xe0], 0
0x1806d97ee: jne 0x1806d97ff
0x1806d97f0: mov rcx, rax
0x1806d97f3: call 0x18049c450
0x1806d97f8: mov rax, qword ptr [rip + 0x846b259]
0x1806d97ff: mov rax, qword ptr [rax + 0xb8]
0x1806d9806: mov rcx, qword ptr [rax + 0x6f0]
0x1806d980d: test rcx, rcx
0x1806d9810: jne 0x1806d9950
0x1806d9816: test rsi, rsi
0x1806d9819: je 0x1806d9969
0x1806d981f: mov qword ptr [rsp + 0x30], rbx
0x1806d9824: xor edx, edx
0x1806d9826: mov rcx, rsi
0x1806d9829: mov qword ptr [rsp + 0x38], rdi
0x1806d982e: call 0x1806ddfa0 ; Torappu.Battle.Buff.get_lifeTime
0x1806d9833: mov rcx, qword ptr [rip + 0x84ed476]
0x1806d983a: mov rbx, rax
0x1806d983d: cmp dword ptr [rcx + 0xe0], 0
0x1806d9844: jne 0x1806d984b
0x1806d9846: call 0x18049c450
0x1806d984b: xor edx, edx
0x1806d984d: xor ecx, ecx
0x1806d984f: call 0x18695e170 ; Torappu.FP.op_Implicit
0x1806d9854: xor r8d, r8d
0x1806d9857: mov rdx, rax
0x1806d985a: mov rcx, rbx
0x1806d985d: call 0x186139620 ; Torappu.FP.op_GreaterThanOrEqual | System.TimeSpan.op_GreaterThanOrEqual | UnityEngine.Timeline.DiscreteTime.op_GreaterThanOrEqual
0x1806d9862: xor edx, edx
0x1806d9864: mov rcx, rsi
0x1806d9867: test al, al
0x1806d9869: jne 0x1806d9872
0x1806d986b: call 0x1806ddfa0 ; Torappu.Battle.Buff.get_lifeTime
0x1806d9870: jmp 0x1806d98a4
0x1806d9872: call 0x1806ddfa0 ; Torappu.Battle.Buff.get_lifeTime
0x1806d9877: mov rcx, qword ptr [rip + 0x852c05a]
0x1806d987e: mov rbx, rax
0x1806d9881: mov rdi, qword ptr [rbp + 0x88]
0x1806d9888: cmp dword ptr [rcx + 0xe0], 0
0x1806d988f: jne 0x1806d9896
0x1806d9891: call 0x18049c450
0x1806d9896: xor r8d, r8d
0x1806d9899: mov rdx, rdi
0x1806d989c: mov rcx, rbx
0x1806d989f: call 0x18695fe00 ; Torappu.TSMath.Max
0x1806d98a4: mov qword ptr [rbp + 0x88], rax
0x1806d98ab: xor edx, edx
0x1806d98ad: mov rbx, qword ptr [rbp + 0x90]
0x1806d98b4: mov rcx, rsi
0x1806d98b7: call 0x1806ddae0 ; Torappu.Battle.Buff.get_existingTime
0x1806d98bc: mov rcx, qword ptr [rip + 0x84ed3ed]
0x1806d98c3: mov rdi, rax
0x1806d98c6: cmp dword ptr [rcx + 0xe0], 0
0x1806d98cd: jne 0x1806d98d4
0x1806d98cf: call 0x18049c450
0x1806d98d4: xor r8d, r8d
0x1806d98d7: mov rdx, rdi
0x1806d98da: mov rcx, rbx
0x1806d98dd: call 0x18480bfc0 ; Torappu.FP.op_Addition | Torappu.FP.FastAdd | UnityEngine.Timeline.DiscreteTime.op_Addition
0x1806d98e2: xor edx, edx
0x1806d98e4: mov qword ptr [rbp + 0x90], rax
0x1806d98eb: mov rcx, rbp
0x1806d98ee: call 0x1806de320 ; Torappu.Battle.Buff.get_owner
0x1806d98f3: mov rcx, qword ptr [rip + 0x8446756]
0x1806d98fa: mov rbx, rax
0x1806d98fd: mov rdi, qword ptr [rsp + 0x38]
0x1806d9902: cmp dword ptr [rcx + 0xe0], 0
0x1806d9909: jne 0x1806d9910
0x1806d990b: call 0x18049c450
0x1806d9910: xor r8d, r8d
0x1806d9913: xor edx, edx
0x1806d9915: mov rcx, rbx
0x1806d9918: call 0x186dcf430 ; UnityEngine.Object.op_Inequality
0x1806d991d: mov rbx, qword ptr [rsp + 0x30]
0x1806d9922: test al, al
0x1806d9924: je 0x1806d995e
0x1806d9926: xor edx, edx
0x1806d9928: mov rcx, rbp
0x1806d992b: call 0x1806de320 ; Torappu.Battle.Buff.get_owner
0x1806d9930: test rax, rax
0x1806d9933: je 0x1806d9969
0x1806d9935: xor r9d, r9d
0x1806d9938: mov r8, rsi
0x1806d993b: mov rdx, rbp
0x1806d993e: mov rcx, rax
0x1806d9941: mov rbp, qword ptr [rsp + 0x40]
0x1806d9946: add rsp, 0x20
0x1806d994a: pop rsi
0x1806d994b: jmp 0x1807292e0 ; Torappu.Battle.Entity.OnBuffExtend
0x1806d9950: xor r9d, r9d
0x1806d9953: mov r8, rsi
0x1806d9956: mov rdx, rbp
0x1806d9959: call 0x18338c7c0 ; XLua.DelegateBridge.__Gen_Delegate_Imp23
0x1806d995e: mov rbp, qword ptr [rsp + 0x40]
0x1806d9963: add rsp, 0x20
0x1806d9967: pop rsi
0x1806d9968: ret 
0x1806d9969: call 0x18049c3c0
0x1806d996e: int3 
0x1806d996f: int3 
