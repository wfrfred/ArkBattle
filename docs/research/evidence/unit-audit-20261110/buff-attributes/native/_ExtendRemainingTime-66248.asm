0x1806d94b0: mov qword ptr [rsp + 0x18], rbp
0x1806d94b5: push rsi
0x1806d94b6: sub rsp, 0x20
0x1806d94ba: cmp byte ptr [rip + 0x88c1eae], 0
0x1806d94c1: mov rbp, rdx
0x1806d94c4: mov rsi, rcx
0x1806d94c7: jne 0x1806d94f4
0x1806d94c9: lea rcx, [rip + 0x846b588]
0x1806d94d0: call 0x18049c210
0x1806d94d5: lea rcx, [rip + 0x84ed7d4]
0x1806d94dc: call 0x18049c210
0x1806d94e1: lea rcx, [rip + 0x8446b68]
0x1806d94e8: call 0x18049c210
0x1806d94ed: mov byte ptr [rip + 0x88c1e7b], 1
0x1806d94f4: mov rax, qword ptr [rip + 0x846b55d]
0x1806d94fb: cmp dword ptr [rax + 0xe0], 0
0x1806d9502: jne 0x1806d9513
0x1806d9504: mov rcx, rax
0x1806d9507: call 0x18049c450
0x1806d950c: mov rax, qword ptr [rip + 0x846b545]
0x1806d9513: mov rax, qword ptr [rax + 0xb8]
0x1806d951a: mov rcx, qword ptr [rax + 0x6f8]
0x1806d9521: test rcx, rcx
0x1806d9524: jne 0x1806d9683
0x1806d952a: test rbp, rbp
0x1806d952d: je 0x1806d969c
0x1806d9533: mov qword ptr [rsp + 0x30], rbx
0x1806d9538: xor edx, edx
0x1806d953a: mov rcx, rbp
0x1806d953d: mov qword ptr [rsp + 0x38], rdi
0x1806d9542: call 0x1806ddfa0 ; Torappu.Battle.Buff.get_lifeTime
0x1806d9547: mov rcx, qword ptr [rip + 0x84ed762]
0x1806d954e: mov rbx, rax
0x1806d9551: cmp dword ptr [rcx + 0xe0], 0
0x1806d9558: jne 0x1806d955f
0x1806d955a: call 0x18049c450
0x1806d955f: xor edx, edx
0x1806d9561: xor ecx, ecx
0x1806d9563: call 0x18695e170 ; Torappu.FP.op_Implicit
0x1806d9568: xor r8d, r8d
0x1806d956b: mov rdx, rax
0x1806d956e: mov rcx, rbx
0x1806d9571: call 0x186139620 ; Torappu.FP.op_GreaterThanOrEqual | System.TimeSpan.op_GreaterThanOrEqual | UnityEngine.Timeline.DiscreteTime.op_GreaterThanOrEqual
0x1806d9576: test al, al
0x1806d9578: je 0x1806d95de
0x1806d957a: xor edx, edx
0x1806d957c: mov rcx, rbp
0x1806d957f: call 0x1806ddfa0 ; Torappu.Battle.Buff.get_lifeTime
0x1806d9584: mov rcx, qword ptr [rip + 0x84ed725]
0x1806d958b: mov rbx, rax
0x1806d958e: mov rdi, qword ptr [rsi + 0x88]
0x1806d9595: cmp dword ptr [rcx + 0xe0], 0
0x1806d959c: jne 0x1806d95a3
0x1806d959e: call 0x18049c450
0x1806d95a3: xor r8d, r8d
0x1806d95a6: mov rdx, rdi
0x1806d95a9: mov rcx, rbx
0x1806d95ac: call 0x18480bfc0 ; Torappu.FP.op_Addition | Torappu.FP.FastAdd | UnityEngine.Timeline.DiscreteTime.op_Addition
0x1806d95b1: mov rbx, qword ptr [rsi + 0x80]
0x1806d95b8: xor edx, edx
0x1806d95ba: mov rcx, rbp
0x1806d95bd: mov qword ptr [rsi + 0x88], rax
0x1806d95c4: call 0x1806ddfa0 ; Torappu.Battle.Buff.get_lifeTime
0x1806d95c9: xor r8d, r8d
0x1806d95cc: mov rdx, rax
0x1806d95cf: mov rcx, rbx
0x1806d95d2: call 0x18480bfc0 ; Torappu.FP.op_Addition | Torappu.FP.FastAdd | UnityEngine.Timeline.DiscreteTime.op_Addition
0x1806d95d7: mov qword ptr [rsi + 0x80], rax
0x1806d95de: mov rbx, qword ptr [rsi + 0x90]
0x1806d95e5: xor edx, edx
0x1806d95e7: mov rcx, rbp
0x1806d95ea: call 0x1806ddae0 ; Torappu.Battle.Buff.get_existingTime
0x1806d95ef: mov rcx, qword ptr [rip + 0x84ed6ba]
0x1806d95f6: mov rdi, rax
0x1806d95f9: cmp dword ptr [rcx + 0xe0], 0
0x1806d9600: jne 0x1806d9607
0x1806d9602: call 0x18049c450
0x1806d9607: xor r8d, r8d
0x1806d960a: mov rdx, rdi
0x1806d960d: mov rcx, rbx
0x1806d9610: call 0x18480bfc0 ; Torappu.FP.op_Addition | Torappu.FP.FastAdd | UnityEngine.Timeline.DiscreteTime.op_Addition
0x1806d9615: xor edx, edx
0x1806d9617: mov qword ptr [rsi + 0x90], rax
0x1806d961e: mov rcx, rsi
0x1806d9621: call 0x1806de320 ; Torappu.Battle.Buff.get_owner
0x1806d9626: mov rcx, qword ptr [rip + 0x8446a23]
0x1806d962d: mov rbx, rax
0x1806d9630: mov rdi, qword ptr [rsp + 0x38]
0x1806d9635: cmp dword ptr [rcx + 0xe0], 0
0x1806d963c: jne 0x1806d9643
0x1806d963e: call 0x18049c450
0x1806d9643: xor r8d, r8d
0x1806d9646: xor edx, edx
0x1806d9648: mov rcx, rbx
0x1806d964b: call 0x186dcf430 ; UnityEngine.Object.op_Inequality
0x1806d9650: mov rbx, qword ptr [rsp + 0x30]
0x1806d9655: test al, al
0x1806d9657: je 0x1806d9691
0x1806d9659: xor edx, edx
0x1806d965b: mov rcx, rsi
0x1806d965e: call 0x1806de320 ; Torappu.Battle.Buff.get_owner
0x1806d9663: test rax, rax
0x1806d9666: je 0x1806d969c
0x1806d9668: xor r9d, r9d
0x1806d966b: mov r8, rbp
0x1806d966e: mov rdx, rsi
0x1806d9671: mov rcx, rax
0x1806d9674: mov rbp, qword ptr [rsp + 0x40]
0x1806d9679: add rsp, 0x20
0x1806d967d: pop rsi
0x1806d967e: jmp 0x1807292e0 ; Torappu.Battle.Entity.OnBuffExtend
0x1806d9683: xor r9d, r9d
0x1806d9686: mov r8, rbp
0x1806d9689: mov rdx, rsi
0x1806d968c: call 0x18338c7c0 ; XLua.DelegateBridge.__Gen_Delegate_Imp23
0x1806d9691: mov rbp, qword ptr [rsp + 0x40]
0x1806d9696: add rsp, 0x20
0x1806d969a: pop rsi
0x1806d969b: ret 
0x1806d969c: call 0x18049c3c0
0x1806d96a1: int3 
0x1806d96a2: int3 
0x1806d96a3: int3 
0x1806d96a4: int3 
0x1806d96a5: int3 
0x1806d96a6: int3 
0x1806d96a7: int3 
0x1806d96a8: int3 
0x1806d96a9: int3 
0x1806d96aa: int3 
0x1806d96ab: int3 
0x1806d96ac: int3 
0x1806d96ad: int3 
0x1806d96ae: int3 
0x1806d96af: int3 
