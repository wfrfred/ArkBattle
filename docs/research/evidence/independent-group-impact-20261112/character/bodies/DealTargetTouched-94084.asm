0x180f97ba0: push rbp
0x180f97ba2: push rsi
0x180f97ba3: push rdi
0x180f97ba4: sub rsp, 0x50
0x180f97ba8: cmp byte ptr [rip + 0x8008e38], 0
0x180f97baf: mov rbp, r8
0x180f97bb2: mov rsi, rdx
0x180f97bb5: mov rdi, rcx
0x180f97bb8: jne 0x180f97c15
0x180f97bba: lea rcx, [rip + 0x7c89c87]
0x180f97bc1: call 0x18049c210
0x180f97bc6: lea rcx, [rip + 0x7c3fa53]
0x180f97bcd: call 0x18049c210
0x180f97bd2: lea rcx, [rip + 0x7b7fc57]
0x180f97bd9: call 0x18049c210
0x180f97bde: lea rcx, [rip + 0x7c75563]
0x180f97be5: call 0x18049c210
0x180f97bea: lea rcx, [rip + 0x7c7579f]
0x180f97bf1: call 0x18049c210
0x180f97bf6: lea rcx, [rip + 0x7b88453]
0x180f97bfd: call 0x18049c210
0x180f97c02: lea rcx, [rip + 0x7c5f19f]
0x180f97c09: call 0x18049c210
0x180f97c0e: mov byte ptr [rip + 0x8008dd2], 1
0x180f97c15: mov rax, qword ptr [rip + 0x7c89c2c]
0x180f97c1c: mov qword ptr [rsp + 0x70], rbx
0x180f97c21: mov rcx, qword ptr [rax + 0xb8]
0x180f97c28: mov rcx, qword ptr [rcx]
0x180f97c2b: test rcx, rcx
0x180f97c2e: jne 0x180f97dec
0x180f97c34: mov qword ptr [rsp + 0x78], r14
0x180f97c39: mov qword ptr [rsp + 0x80], r15
0x180f97c41: cmp dword ptr [rdi + 0x128], 2
0x180f97c48: jne 0x180f97c82
0x180f97c4a: xor edx, edx
0x180f97c4c: mov rcx, rdi
0x180f97c4f: call 0x180605810 ; Torappu.Battle.Ability.get_owner
0x180f97c54: mov rcx, qword ptr [rip + 0x7b883f5]
0x180f97c5b: mov rbx, rax
0x180f97c5e: cmp dword ptr [rcx + 0xe0], 0
0x180f97c65: jne 0x180f97c6c
0x180f97c67: call 0x18049c450
0x180f97c6c: xor r8d, r8d
0x180f97c6f: mov rdx, rbx
0x180f97c72: mov rcx, rsi
0x180f97c75: call 0x186dcf290 ; UnityEngine.Object.op_Equality
0x180f97c7a: test al, al
0x180f97c7c: jne 0x180f97da9
0x180f97c82: mov rdx, qword ptr [rip + 0x7c75707]
0x180f97c89: lea rcx, [rdi + 0x190]
0x180f97c90: call 0x1853ae780
0x180f97c95: test al, al
0x180f97c97: je 0x180f97d09
0x180f97c99: test rbp, rbp
0x180f97c9c: je 0x180f97e0e
0x180f97ca2: mov rdx, qword ptr [rip + 0x7c7549f]
0x180f97ca9: lea rcx, [rdi + 0x190]
0x180f97cb0: mov rbp, qword ptr [rbp + 0x10]
0x180f97cb4: mov r14, qword ptr [rdi + 0x118]
0x180f97cbb: call 0x1853ae540
0x180f97cc0: xor edx, edx
0x180f97cc2: mov rcx, rdi
0x180f97cc5: mov r15, rax
0x180f97cc8: call 0x180604d90 ; Torappu.Battle.Ability.get_blackboard
0x180f97ccd: test rsi, rsi
0x180f97cd0: je 0x180f97e0e
0x180f97cd6: xor ebx, ebx
0x180f97cd8: mov r9, r15
0x180f97cdb: mov qword ptr [rsp + 0x40], rbx
0x180f97ce0: mov r8, r14
0x180f97ce3: mov qword ptr [rsp + 0x38], rbx
0x180f97ce8: mov rdx, rbp
0x180f97ceb: mov qword ptr [rsp + 0x30], rbx
0x180f97cf0: mov rcx, rsi
0x180f97cf3: mov qword ptr [rsp + 0x28], rax
0x180f97cf8: mov qword ptr [rsp + 0x20], rdi
0x180f97cfd: call 0x180720b30 ; Torappu.Battle.Entity.AddBuffsToIdList
0x180f97d02: mov al, 1
0x180f97d04: jmp 0x180f97dab
0x180f97d09: xor edx, edx
0x180f97d0b: mov rcx, rdi
0x180f97d0e: call 0x180605810 ; Torappu.Battle.Ability.get_owner
0x180f97d13: mov rdx, qword ptr [rip + 0x7c3f906]
0x180f97d1a: mov rdi, rax
0x180f97d1d: test rax, rax
0x180f97d20: jne 0x180f97d26
0x180f97d22: xor ebx, ebx
0x180f97d24: jmp 0x180f97d70
0x180f97d26: cmp byte ptr [rip + 0x8040d43], 0
0x180f97d2d: mov r8, qword ptr [rax]
0x180f97d30: jbe 0x180f97d40
0x180f97d32: mov rcx, r8
0x180f97d35: call 0x1804566f0
0x180f97d3a: xor ebx, ebx
0x180f97d3c: test al, al
0x180f97d3e: jmp 0x180f97d6c
0x180f97d40: movzx eax, byte ptr [rdx + 0x130]
0x180f97d47: xor ebx, ebx
0x180f97d49: cmp byte ptr [r8 + 0x130], al
0x180f97d50: jb 0x180f97d68
0x180f97d52: movzx ecx, al
0x180f97d55: mov rax, qword ptr [r8 + 0xc8]
0x180f97d5c: cmp qword ptr [rax + rcx*8 - 8], rdx
0x180f97d61: mov eax, 1
0x180f97d66: je 0x180f97d6a
0x180f97d68: mov eax, ebx
0x180f97d6a: test eax, eax
0x180f97d6c: cmovne rbx, rdi
0x180f97d70: mov rcx, qword ptr [rip + 0x7b882d9]
0x180f97d77: cmp dword ptr [rcx + 0xe0], 0
0x180f97d7e: jne 0x180f97d85
0x180f97d80: call 0x18049c450
0x180f97d85: xor r8d, r8d
0x180f97d88: xor edx, edx
0x180f97d8a: mov rcx, rbx
0x180f97d8d: call 0x186dcf430 ; UnityEngine.Object.op_Inequality
0x180f97d92: test al, al
0x180f97d94: je 0x180f97dc5
0x180f97d96: test rbx, rbx
0x180f97d99: je 0x180f97e0e
0x180f97d9b: xor edx, edx
0x180f97d9d: mov rcx, rbx
0x180f97da0: call 0x180b21a40 ; Torappu.Battle.Unit.get_isDummy
0x180f97da5: test al, al
0x180f97da7: je 0x180f97dc5
0x180f97da9: xor al, al
0x180f97dab: mov r14, qword ptr [rsp + 0x78]
0x180f97db0: mov r15, qword ptr [rsp + 0x80]
0x180f97db8: mov rbx, qword ptr [rsp + 0x70]
0x180f97dbd: add rsp, 0x50
0x180f97dc1: pop rdi
0x180f97dc2: pop rsi
0x180f97dc3: pop rbp
0x180f97dc4: ret
0x180f97dc5: mov rcx, qword ptr [rip + 0x7b7fa64]
0x180f97dcc: cmp dword ptr [rcx + 0xe0], 0
0x180f97dd3: jne 0x180f97dda
0x180f97dd5: call 0x18049c450
0x180f97dda: mov rcx, qword ptr [rip + 0x7c5efc7]
0x180f97de1: xor edx, edx
0x180f97de3: call 0x18693dab0 ; UnityEngine.DLog.LogError
0x180f97de8: mov al, 1
0x180f97dea: jmp 0x180f97dab
0x180f97dec: xor ebx, ebx
0x180f97dee: mov r9, rbp
0x180f97df1: mov r8, rsi
0x180f97df4: mov qword ptr [rsp + 0x20], rbx
0x180f97df9: mov rdx, rdi
0x180f97dfc: call 0x1833a18e0 ; XLua.DelegateBridge.__Gen_Delegate_Imp252
0x180f97e01: mov rbx, qword ptr [rsp + 0x70]
0x180f97e06: add rsp, 0x50
0x180f97e0a: pop rdi
0x180f97e0b: pop rsi
0x180f97e0c: pop rbp
0x180f97e0d: ret
0x180f97e0e: call 0x18049c3c0
0x180f97e13: int3
0x180f97e14: int3
0x180f97e15: int3
0x180f97e16: int3
0x180f97e17: int3
0x180f97e18: int3
0x180f97e19: int3
0x180f97e1a: int3
0x180f97e1b: int3
0x180f97e1c: int3
0x180f97e1d: int3
0x180f97e1e: int3
0x180f97e1f: int3
