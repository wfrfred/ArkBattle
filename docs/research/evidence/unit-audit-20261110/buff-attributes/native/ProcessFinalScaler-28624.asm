0x1821556e0: push rbx
0x1821556e2: sub rsp, 0x20
0x1821556e6: cmp byte ptr [rip + 0x6e58e12], 0
0x1821556ed: mov rbx, rcx
0x1821556f0: jne 0x182155705
0x1821556f2: lea rcx, [rip + 0x6a715b7]
0x1821556f9: call 0x18049c210
0x1821556fe: mov byte ptr [rip + 0x6e58dfa], 1
0x182155705: mov rcx, qword ptr [rip + 0x6a715a4]
0x18215570c: cmp dword ptr [rcx + 0xe0], 0
0x182155713: jne 0x18215571a
0x182155715: call 0x18049c450
0x18215571a: xor edx, edx
0x18215571c: xor ecx, ecx
0x18215571e: call 0x18695e170 ; Torappu.FP.op_Implicit
0x182155723: xor r8d, r8d
0x182155726: mov rdx, rax
0x182155729: mov rcx, rbx
0x18215572c: call 0x186139620 ; Torappu.FP.op_GreaterThanOrEqual | System.TimeSpan.op_GreaterThanOrEqual | UnityEngine.Timeline.DiscreteTime.op_GreaterThanOrEqual
0x182155731: test al, al
0x182155733: je 0x18215573e
0x182155735: mov rax, rbx
0x182155738: add rsp, 0x20
0x18215573c: pop rbx
0x18215573d: ret 
0x18215573e: mov rcx, qword ptr [rip + 0x6a7156b]
0x182155745: cmp dword ptr [rcx + 0xe0], 0
0x18215574c: jne 0x182155753
0x18215574e: call 0x18049c450
0x182155753: xor edx, edx
0x182155755: mov ecx, 1
0x18215575a: call 0x18695e170 ; Torappu.FP.op_Implicit
0x18215575f: xor r8d, r8d
0x182155762: mov rdx, rbx
0x182155765: mov rcx, rax
0x182155768: add rsp, 0x20
0x18215576c: pop rbx
0x18215576d: jmp 0x18480bfc0 ; Torappu.FP.op_Addition | Torappu.FP.FastAdd | UnityEngine.Timeline.DiscreteTime.op_Addition
0x182155772: int3 
0x182155773: int3 
0x182155774: int3 
0x182155775: int3 
0x182155776: int3 
0x182155777: int3 
0x182155778: int3 
0x182155779: int3 
0x18215577a: int3 
0x18215577b: int3 
0x18215577c: int3 
0x18215577d: int3 
0x18215577e: int3 
0x18215577f: int3 
