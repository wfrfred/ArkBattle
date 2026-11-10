0x1806d2e20: push rbx
0x1806d2e22: sub rsp, 0x130
0x1806d2e29: cmp byte ptr [rip + 0x88c84c6], 0
0x1806d2e30: mov rbx, rcx
0x1806d2e33: jne 0x1806d2e48
0x1806d2e35: lea rcx, [rip + 0x8471c1c]
0x1806d2e3c: call 0x18049c210
0x1806d2e41: mov byte ptr [rip + 0x88c84ae], 1
0x1806d2e48: mov rax, qword ptr [rip + 0x8471c09]
0x1806d2e4f: cmp dword ptr [rax + 0xe0], 0
0x1806d2e56: jne 0x1806d2e67
0x1806d2e58: mov rcx, rax
0x1806d2e5b: call 0x18049c450
0x1806d2e60: mov rax, qword ptr [rip + 0x8471bf1]
0x1806d2e67: mov rax, qword ptr [rax + 0xb8]
0x1806d2e6e: mov rcx, qword ptr [rax + 0x330]
0x1806d2e75: test rcx, rcx
0x1806d2e78: jne 0x1806d2eea
0x1806d2e7a: xor edx, edx
0x1806d2e7c: mov rcx, rbx
0x1806d2e7f: call 0x1806ddd60 ; Torappu.Battle.Buff.get_isFinished
0x1806d2e84: test al, al
0x1806d2e86: jne 0x1806d2ef5
0x1806d2e88: xor edx, edx
0x1806d2e8a: mov rcx, rbx
0x1806d2e8d: call 0x1806ddc50 ; Torappu.Battle.Buff.get_isEnabled
0x1806d2e92: test al, al
0x1806d2e94: je 0x1806d2ef5
0x1806d2e96: cmp byte ptr [rbx + 0x1fe], 0
0x1806d2e9d: je 0x1806d2ef5
0x1806d2e9f: mov r9b, 1
0x1806d2ea2: mov byte ptr [rbx + 0x1fe], 0
0x1806d2ea9: mov r8d, 0x20
0x1806d2eaf: mov qword ptr [rsp + 0x20], 0
0x1806d2eb8: mov rdx, rbx
0x1806d2ebb: lea rcx, [rsp + 0x30]
0x1806d2ec0: call 0x1806dc050 ; Torappu.Battle.Buff._RunActions
0x1806d2ec5: xor edx, edx
0x1806d2ec7: mov rcx, rbx
0x1806d2eca: call 0x1806de320 ; Torappu.Battle.Buff.get_owner
0x1806d2ecf: test rax, rax
0x1806d2ed2: je 0x1806d2efe
0x1806d2ed4: xor r8d, r8d
0x1806d2ed7: mov rdx, rbx
0x1806d2eda: mov rcx, rax
0x1806d2edd: add rsp, 0x130
0x1806d2ee4: pop rbx
0x1806d2ee5: jmp 0x18072a990 ; Torappu.Battle.Entity.OnOtherBuffLateEnable
0x1806d2eea: xor r8d, r8d
0x1806d2eed: mov rdx, rbx
0x1806d2ef0: call 0x1833c9ac0 ; XLua.DelegateBridge.__Gen_Delegate_Imp27
0x1806d2ef5: add rsp, 0x130
0x1806d2efc: pop rbx
0x1806d2efd: ret
0x1806d2efe: call 0x18049c3c0
0x1806d2f03: int3
0x1806d2f04: int3
0x1806d2f05: int3
0x1806d2f06: int3
0x1806d2f07: int3
0x1806d2f08: int3
0x1806d2f09: int3
0x1806d2f0a: int3
0x1806d2f0b: int3
0x1806d2f0c: int3
0x1806d2f0d: int3
0x1806d2f0e: int3
0x1806d2f0f: int3
