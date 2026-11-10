0x1806d6f80: mov qword ptr [rsp + 0x10], rbx
0x1806d6f85: push rsi
0x1806d6f86: sub rsp, 0x30
0x1806d6f8a: cmp byte ptr [rip + 0x88c435c], 0
0x1806d6f91: mov rbx, rdx
0x1806d6f94: mov rsi, rcx
0x1806d6f97: jne 0x1806d6fb8
0x1806d6f99: lea rcx, [rip + 0x846dab8]
0x1806d6fa0: call 0x18049c210
0x1806d6fa5: lea rcx, [rip + 0x84efd04]
0x1806d6fac: call 0x18049c210
0x1806d6fb1: mov byte ptr [rip + 0x88c4335], 1
0x1806d6fb8: mov rax, qword ptr [rip + 0x846da99]
0x1806d6fbf: cmp dword ptr [rax + 0xe0], 0
0x1806d6fc6: jne 0x1806d6fd7
0x1806d6fc8: mov rcx, rax
0x1806d6fcb: call 0x18049c450
0x1806d6fd0: mov rax, qword ptr [rip + 0x846da81]
0x1806d6fd7: mov rax, qword ptr [rax + 0xb8]
0x1806d6fde: mov rcx, qword ptr [rax + 0x2e8]
0x1806d6fe5: test rcx, rcx
0x1806d6fe8: jne 0x1806d710d
0x1806d6fee: mov rcx, qword ptr [rip + 0x84efcbb]
0x1806d6ff5: cmp dword ptr [rcx + 0xe0], 0
0x1806d6ffc: jne 0x1806d7003
0x1806d6ffe: call 0x18049c450
0x1806d7003: xor edx, edx
0x1806d7005: xor ecx, ecx
0x1806d7007: call 0x18695e170 ; Torappu.FP.op_Implicit
0x1806d700c: xor r8d, r8d
0x1806d700f: mov rdx, rax
0x1806d7012: mov rcx, rbx
0x1806d7015: call 0x186139650 ; Torappu.FP.op_LessThanOrEqual | System.TimeSpan.op_LessThanOrEqual | UnityEngine.Timeline.DiscreteTime.op_LessThanOrEqual
0x1806d701a: test al, al
0x1806d701c: jne 0x1806d711b
0x1806d7022: mov rax, qword ptr [rsi + 0x78]
0x1806d7026: test rax, rax
0x1806d7029: je 0x1806d7126
0x1806d702f: cmp byte ptr [rax + 0x78], 1
0x1806d7033: jne 0x1806d711b
0x1806d7039: mov qword ptr [rsp + 0x40], rdi
0x1806d703e: mov rcx, qword ptr [rip + 0x84efc6b]
0x1806d7045: mov rdi, qword ptr [rsi + 0x88]
0x1806d704c: cmp dword ptr [rcx + 0xe0], 0
0x1806d7053: jne 0x1806d705a
0x1806d7055: call 0x18049c450
0x1806d705a: xor r8d, r8d
0x1806d705d: mov rdx, rbx
0x1806d7060: mov rcx, rdi
0x1806d7063: call 0x18695c0c0 ; Torappu.FP.op_Subtraction | Torappu.FP.FastSub | UnityEngine.Timeline.DiscreteTime.op_Subtraction
0x1806d7068: xor edx, edx
0x1806d706a: xor ecx, ecx
0x1806d706c: mov rbx, rax
0x1806d706f: call 0x18695e170 ; Torappu.FP.op_Implicit
0x1806d7074: xor r8d, r8d
0x1806d7077: mov rdx, rax
0x1806d707a: mov rcx, rbx
0x1806d707d: call 0x186139660 ; Torappu.FP.op_LessThan | System.TimeSpan.op_LessThan | UnityEngine.Timeline.DiscreteTime.op_LessThan
0x1806d7082: mov rdi, qword ptr [rsp + 0x40]
0x1806d7087: test al, al
0x1806d7089: je 0x1806d70ac
0x1806d708b: mov rcx, qword ptr [rip + 0x84efc1e]
0x1806d7092: cmp dword ptr [rcx + 0xe0], 0
0x1806d7099: jne 0x1806d70a0
0x1806d709b: call 0x18049c450
0x1806d70a0: xor edx, edx
0x1806d70a2: xor ecx, ecx
0x1806d70a4: call 0x18695e170 ; Torappu.FP.op_Implicit
0x1806d70a9: mov rbx, rax
0x1806d70ac: mov qword ptr [rsi + 0x88], rbx
0x1806d70b3: mov rcx, qword ptr [rip + 0x84efbf6]
0x1806d70ba: cmp dword ptr [rcx + 0xe0], 0
0x1806d70c1: jne 0x1806d70c8
0x1806d70c3: call 0x18049c450
0x1806d70c8: xor edx, edx
0x1806d70ca: xor ecx, ecx
0x1806d70cc: call 0x18695e170 ; Torappu.FP.op_Implicit
0x1806d70d1: xor r8d, r8d
0x1806d70d4: mov rdx, rax
0x1806d70d7: mov rcx, rbx
0x1806d70da: call 0x186139650 ; Torappu.FP.op_LessThanOrEqual | System.TimeSpan.op_LessThanOrEqual | UnityEngine.Timeline.DiscreteTime.op_LessThanOrEqual
0x1806d70df: test al, al
0x1806d70e1: je 0x1806d711b
0x1806d70e3: mov r9d, 1
0x1806d70e9: mov qword ptr [rsp + 0x20], 0
0x1806d70f2: movzx r8d, r9b
0x1806d70f6: movzx edx, r9b
0x1806d70fa: mov rcx, rsi
0x1806d70fd: call 0x1806cec80 ; Torappu.Battle.Buff.DecStackCntOrMarkFinish
0x1806d7102: mov rbx, qword ptr [rsp + 0x48]
0x1806d7107: add rsp, 0x30
0x1806d710b: pop rsi
0x1806d710c: ret
0x1806d710d: xor r9d, r9d
0x1806d7110: mov r8, rbx
0x1806d7113: mov rdx, rsi
0x1806d7116: call 0x1834de650 ; XLua.DelegateBridge.__Gen_Delegate_Imp454
0x1806d711b: mov rbx, qword ptr [rsp + 0x48]
0x1806d7120: add rsp, 0x30
0x1806d7124: pop rsi
0x1806d7125: ret
0x1806d7126: call 0x18049c3c0
0x1806d712b: int3
0x1806d712c: int3
0x1806d712d: int3
0x1806d712e: int3
0x1806d712f: int3
