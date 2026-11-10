0x1806d9370: push rbx
0x1806d9372: sub rsp, 0x20
0x1806d9376: cmp byte ptr [rip + 0x88c1fee], 0
0x1806d937d: mov rbx, rcx
0x1806d9380: jne 0x1806d9395
0x1806d9382: lea rcx, [rip + 0x846b6cf]
0x1806d9389: call 0x18049c210
0x1806d938e: mov byte ptr [rip + 0x88c1fd6], 1
0x1806d9395: mov rax, qword ptr [rip + 0x846b6bc]
0x1806d939c: cmp dword ptr [rax + 0xe0], 0
0x1806d93a3: jne 0x1806d93b4
0x1806d93a5: mov rcx, rax
0x1806d93a8: call 0x18049c450
0x1806d93ad: mov rax, qword ptr [rip + 0x846b6a4]
0x1806d93b4: mov rax, qword ptr [rax + 0xb8]
0x1806d93bb: mov rcx, qword ptr [rax + 0x6d8]
0x1806d93c2: test rcx, rcx
0x1806d93c5: jne 0x1806d9493
0x1806d93cb: mov qword ptr [rsp + 0x30], rdi
0x1806d93d0: cmp dword ptr [rbx + 0xa0], ecx
0x1806d93d6: jl 0x1806d93e6
0x1806d93d8: mov eax, dword ptr [rbx + 0xa0]
0x1806d93de: cmp dword ptr [rbx + 0x9c], eax
0x1806d93e4: jg 0x1806d9446
0x1806d93e6: mov rdx, qword ptr [rbx + 0x78]
0x1806d93ea: test rdx, rdx
0x1806d93ed: je 0x1806d94a3
0x1806d93f3: mov r8d, dword ptr [rbx + 0x9c]
0x1806d93fa: xor r9d, r9d
0x1806d93fd: mov rdx, qword ptr [rdx + 0x10]
0x1806d9401: mov rcx, rbx
0x1806d9404: call 0x1806da630 ; Torappu.Battle.Buff._LoadAttributesModifier
0x1806d9409: xor edx, edx
0x1806d940b: mov rcx, rbx
0x1806d940e: call 0x1806de320 ; Torappu.Battle.Buff.get_owner
0x1806d9413: test rax, rax
0x1806d9416: je 0x1806d94a3
0x1806d941c: xor edx, edx
0x1806d941e: mov rcx, rax
0x1806d9421: call 0x1807335c0 ; Torappu.Battle.Entity.get_attributes
0x1806d9426: xor edx, edx
0x1806d9428: mov rcx, rbx
0x1806d942b: mov rdi, rax
0x1806d942e: call 0x1806dd6c0 ; Torappu.Battle.Buff.get_attributeMask
0x1806d9433: test rdi, rdi
0x1806d9436: je 0x1806d94a3
0x1806d9438: xor r8d, r8d
0x1806d943b: mov rdx, rax
0x1806d943e: mov rcx, rdi
0x1806d9441: call 0x180678770 ; Torappu.Battle.Attributes.MarkAttributesDirty
0x1806d9446: cmp qword ptr [rbx + 0x70], 0
0x1806d944b: je 0x1806d9488
0x1806d944d: xor edx, edx
0x1806d944f: mov rcx, rbx
0x1806d9452: call 0x1806ddc50 ; Torappu.Battle.Buff.get_isEnabled
0x1806d9457: test al, al
0x1806d9459: je 0x1806d9488
0x1806d945b: xor edx, edx
0x1806d945d: mov rcx, rbx
0x1806d9460: call 0x1806de320 ; Torappu.Battle.Buff.get_owner
0x1806d9465: test rax, rax
0x1806d9468: je 0x1806d94a3
0x1806d946a: xor edx, edx
0x1806d946c: mov rcx, rax
0x1806d946f: call 0x1807335c0 ; Torappu.Battle.Entity.get_attributes
0x1806d9474: test rax, rax
0x1806d9477: je 0x1806d94a3
0x1806d9479: mov rdx, qword ptr [rbx + 0x70]
0x1806d947d: xor r8d, r8d
0x1806d9480: mov rcx, rax
0x1806d9483: call 0x180678670 ; Torappu.Battle.Attributes.MarkAbnormalResistanceDirty
0x1806d9488: mov rdi, qword ptr [rsp + 0x30]
0x1806d948d: add rsp, 0x20
0x1806d9491: pop rbx
0x1806d9492: ret
0x1806d9493: xor r8d, r8d
0x1806d9496: mov rdx, rbx
0x1806d9499: add rsp, 0x20
0x1806d949d: pop rbx
0x1806d949e: jmp 0x1833c9ac0 ; XLua.DelegateBridge.__Gen_Delegate_Imp27
0x1806d94a3: call 0x18049c3c0
0x1806d94a8: int3
0x1806d94a9: int3
0x1806d94aa: int3
0x1806d94ab: int3
0x1806d94ac: int3
0x1806d94ad: int3
0x1806d94ae: int3
0x1806d94af: int3
