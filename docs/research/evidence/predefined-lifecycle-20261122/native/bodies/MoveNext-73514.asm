; Torappu.Battle.Scheduler/<_DoActivatePredefined>d__154.MoveNext metadata=73514 VA=0x18098cbc0
0x18098cbc0: push rbx
0x18098cbc2: sub rsp, 0x20
0x18098cbc6: cmp byte ptr [rip + 0x860ff8c], 0
0x18098cbcd: mov rbx, rcx
0x18098cbd0: jne 0x18098cbf1
0x18098cbd2: lea rcx, [rip + 0x825668f]
0x18098cbd9: call 0x18049c210
0x18098cbde: lea rcx, [rip + 0x81a5fbb]
0x18098cbe5: call 0x18049c210
0x18098cbea: mov byte ptr [rip + 0x860ff68], 1
0x18098cbf1: mov eax, dword ptr [rbx + 0x10]
0x18098cbf4: test eax, eax
0x18098cbf6: jne 0x18098cc92
0x18098cbfc: mov rdx, qword ptr [rbx + 0x28]
0x18098cc00: mov dword ptr [rbx + 0x10], 0xffffffff
0x18098cc07: test rdx, rdx
0x18098cc0a: je 0x18098cca6
0x18098cc10: mov rcx, qword ptr [rbx + 0x20]
0x18098cc14: test rcx, rcx
0x18098cc17: je 0x18098cca6
0x18098cc1d: mov r8, qword ptr [rip + 0x81a5f7c]
0x18098cc24: xor r9d, r9d
0x18098cc27: mov rdx, qword ptr [rdx + 0x18]
0x18098cc2b: call 0x1809834c0 ; Torappu.Battle.Scheduler.TryActivePredefined
0x18098cc30: cmp qword ptr [rbx + 0x30], 0
0x18098cc35: je 0x18098cc4d
0x18098cc37: mov rcx, qword ptr [rbx + 0x30]
0x18098cc3b: mov rdx, qword ptr [rbx + 0x28]
0x18098cc3f: mov rax, qword ptr [rcx + 0x18]
0x18098cc43: mov r8, qword ptr [rcx + 0x28]
0x18098cc47: mov rcx, qword ptr [rcx + 0x40]
0x18098cc4b: call rax
0x18098cc4d: mov rax, qword ptr [rip + 0x8256614]
0x18098cc54: cmp dword ptr [rax + 0xe0], 0
0x18098cc5b: jne 0x18098cc6c
0x18098cc5d: mov rcx, rax
0x18098cc60: call 0x18049c450
0x18098cc65: mov rax, qword ptr [rip + 0x82565fc]
0x18098cc6c: mov rax, qword ptr [rax + 0xb8]
0x18098cc73: lea rcx, [rbx + 0x18]
0x18098cc77: mov rdx, qword ptr [rax]
0x18098cc7a: mov qword ptr [rbx + 0x18], rdx
0x18098cc7e: call 0x18049bcf0
0x18098cc83: mov al, 1
0x18098cc85: mov dword ptr [rbx + 0x10], 1
0x18098cc8c: add rsp, 0x20
0x18098cc90: pop rbx
0x18098cc91: ret
0x18098cc92: cmp eax, 1
0x18098cc95: jne 0x18098cc9e
0x18098cc97: mov dword ptr [rbx + 0x10], 0xffffffff
0x18098cc9e: xor al, al
0x18098cca0: add rsp, 0x20
0x18098cca4: pop rbx
0x18098cca5: ret
0x18098cca6: call 0x18049c3c0
0x18098ccab: int3
0x18098ccac: int3
0x18098ccad: int3
0x18098ccae: int3
0x18098ccaf: int3
