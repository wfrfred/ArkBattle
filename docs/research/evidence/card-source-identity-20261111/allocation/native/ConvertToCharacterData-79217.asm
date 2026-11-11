0x180b09e40: mov qword ptr [rsp + 8], rbx
0x180b09e45: mov qword ptr [rsp + 0x10], rbp
0x180b09e4a: mov qword ptr [rsp + 0x18], rsi
0x180b09e4f: push rdi
0x180b09e50: sub rsp, 0x50
0x180b09e54: cmp byte ptr [rip + 0x8493e4e], 0
0x180b09e5b: mov edi, r9d
0x180b09e5e: movzx esi, r8b
0x180b09e62: movzx ebp, dl
0x180b09e65: mov rbx, rcx
0x180b09e68: jne 0x180b09e7d
0x180b09e6a: lea rcx, [rip + 0x800625f]
0x180b09e71: call 0x18049c210
0x180b09e76: mov byte ptr [rip + 0x8493e2c], 1
0x180b09e7d: mov rax, qword ptr [rip + 0x800624c]
0x180b09e84: mov r10, qword ptr [rax + 0xb8]
0x180b09e8b: mov rcx, qword ptr [r10 + 0x10]
0x180b09e8f: test rcx, rcx
0x180b09e92: jne 0x180b09ed3
0x180b09e94: test rbx, rbx
0x180b09e97: je 0x180b09f12
0x180b09e99: mov rax, qword ptr [rsp + 0x80]
0x180b09ea1: movzx r9d, sil
0x180b09ea5: mov qword ptr [rsp + 0x40], rcx
0x180b09eaa: movzx r8d, bpl
0x180b09eae: mov rcx, qword ptr [rbx + 0x10]
0x180b09eb2: mov rdx, rbx
0x180b09eb5: mov qword ptr [rsp + 0x38], rax
0x180b09eba: mov rax, qword ptr [rbx + 0x38]
0x180b09ebe: mov dword ptr [rsp + 0x30], edi
0x180b09ec2: mov byte ptr [rsp + 0x28], 1
0x180b09ec7: mov qword ptr [rsp + 0x20], rax
0x180b09ecc: call 0x180b0b0f0 ; Torappu.Battle.BattleDataConverter._ConvertInternal
0x180b09ed1: jmp 0x180b09efd
0x180b09ed3: mov rax, qword ptr [rsp + 0x80]
0x180b09edb: movzx r9d, sil
0x180b09edf: mov qword ptr [rsp + 0x30], 0
0x180b09ee8: movzx r8d, bpl
0x180b09eec: mov qword ptr [rsp + 0x28], rax
0x180b09ef1: mov rdx, rbx
0x180b09ef4: mov dword ptr [rsp + 0x20], edi
0x180b09ef8: call 0x18326f3b0 ; XLua.DelegateBridge.__Gen_Delegate_Imp12527
0x180b09efd: mov rbx, qword ptr [rsp + 0x60]
0x180b09f02: mov rbp, qword ptr [rsp + 0x68]
0x180b09f07: mov rsi, qword ptr [rsp + 0x70]
0x180b09f0c: add rsp, 0x50
0x180b09f10: pop rdi
0x180b09f11: ret
0x180b09f12: call 0x18049c3c0
0x180b09f17: int3
0x180b09f18: int3
0x180b09f19: int3
0x180b09f1a: int3
0x180b09f1b: int3
0x180b09f1c: int3
0x180b09f1d: int3
0x180b09f1e: int3
0x180b09f1f: int3
