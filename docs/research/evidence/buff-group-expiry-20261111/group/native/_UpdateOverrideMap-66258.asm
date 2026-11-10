0x1806dce60: push rbx
0x1806dce62: sub rsp, 0x20
0x1806dce66: cmp byte ptr [rip + 0x88be50c], 0
0x1806dce6d: mov rbx, rcx
0x1806dce70: jne 0x1806dce85
0x1806dce72: lea rcx, [rip + 0x8467bdf]
0x1806dce79: call 0x18049c210
0x1806dce7e: mov byte ptr [rip + 0x88be4f4], 1
0x1806dce85: mov rax, qword ptr [rip + 0x8467bcc]
0x1806dce8c: mov qword ptr [rsp + 0x40], 0
0x1806dce95: cmp dword ptr [rax + 0xe0], 0
0x1806dce9c: jne 0x1806dcead
0x1806dce9e: mov rcx, rax
0x1806dcea1: call 0x18049c450
0x1806dcea6: mov rax, qword ptr [rip + 0x8467bab]
0x1806dcead: mov rax, qword ptr [rax + 0xb8]
0x1806dceb4: mov rcx, qword ptr [rax + 0x748]
0x1806dcebb: test rcx, rcx
0x1806dcebe: jne 0x1806dcef4
0x1806dcec0: mov rcx, qword ptr [rbx + 0x10]
0x1806dcec4: test rcx, rcx
0x1806dcec7: je 0x1806dcf05
0x1806dcec9: xor r9d, r9d
0x1806dcecc: lea r8, [rsp + 0x40]
0x1806dced1: mov rdx, rbx
0x1806dced4: call 0x1806cc000 ; Torappu.Battle.Buff/BuffContainer.TryGetOverrideGroup
0x1806dced9: test al, al
0x1806dcedb: je 0x1806dceff
0x1806dcedd: mov rcx, qword ptr [rsp + 0x40]
0x1806dcee2: test rcx, rcx
0x1806dcee5: je 0x1806dcf05
0x1806dcee7: xor edx, edx
0x1806dcee9: call 0x1806e1030 ; Torappu.Battle.Buff/OverrideGroup._DoUpdateInternal
0x1806dceee: add rsp, 0x20
0x1806dcef2: pop rbx
0x1806dcef3: ret
0x1806dcef4: xor r8d, r8d
0x1806dcef7: mov rdx, rbx
0x1806dcefa: call 0x1833c9ac0 ; XLua.DelegateBridge.__Gen_Delegate_Imp27
0x1806dceff: add rsp, 0x20
0x1806dcf03: pop rbx
0x1806dcf04: ret
0x1806dcf05: call 0x18049c3c0
0x1806dcf0a: int3
0x1806dcf0b: int3
0x1806dcf0c: int3
0x1806dcf0d: int3
0x1806dcf0e: int3
0x1806dcf0f: int3
