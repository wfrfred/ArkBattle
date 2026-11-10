0x1806b3fa0: push rbp
0x1806b3fa2: push rdi
0x1806b3fa3: push r14
0x1806b3fa5: sub rsp, 0x30
0x1806b3fa9: cmp byte ptr [rip + 0x88e73f2], 0
0x1806b3fb0: mov rdi, rdx
0x1806b3fb3: mov rbp, rcx
0x1806b3fb6: jne 0x1806b3fef
0x1806b3fb8: lea rcx, [rip + 0x85b6e01]
0x1806b3fbf: call 0x18049c210
0x1806b3fc4: lea rcx, [rip + 0x859c74d]
0x1806b3fcb: call 0x18049c210
0x1806b3fd0: lea rcx, [rip + 0x859d2a9]
0x1806b3fd7: call 0x18049c210
0x1806b3fdc: lea rcx, [rip + 0x85b74b5]
0x1806b3fe3: call 0x18049c210
0x1806b3fe8: mov byte ptr [rip + 0x88e73b3], 1
0x1806b3fef: mov rax, qword ptr [rip + 0x85b6dca]
0x1806b3ff6: xor r14d, r14d
0x1806b3ff9: mov qword ptr [rsp + 0x68], r14
0x1806b3ffe: mov rcx, qword ptr [rax + 0xb8]
0x1806b4005: mov rcx, qword ptr [rcx + 0x48]
0x1806b4009: test rcx, rcx
0x1806b400c: jne 0x1806b4398
0x1806b4012: mov qword ptr [rsp + 0x50], rbx
0x1806b4017: mov qword ptr [rsp + 0x58], rsi
0x1806b401c: mov rbx, qword ptr [rbp + 0x20]
0x1806b4020: test rdi, rdi
0x1806b4023: je 0x1806b43af
0x1806b4029: xor edx, edx
0x1806b402b: mov rcx, rdi
0x1806b402e: call 0x1806de2a0 ; Torappu.Battle.Buff.get_overrideKey
0x1806b4033: test rbx, rbx
0x1806b4036: je 0x1806b43af
0x1806b403c: mov r9, qword ptr [rip + 0x859d23d]
0x1806b4043: lea r8, [rsp + 0x68]
0x1806b4048: mov rdx, rax
0x1806b404b: mov rcx, rbx
0x1806b404e: call 0x185b2cad0
0x1806b4053: test al, al
0x1806b4055: je 0x1806b4210
0x1806b405b: mov rbx, qword ptr [rsp + 0x68]
0x1806b4060: mov rsi, rbx
0x1806b4063: test rbx, rbx
0x1806b4066: je 0x1806b43af
0x1806b406c: cmp byte ptr [rip + 0x88e7320], r14b
0x1806b4073: jne 0x1806b408d
0x1806b4075: lea rcx, [rip + 0x85994ac]
0x1806b407c: call 0x18049c210
0x1806b4081: mov rbx, qword ptr [rsp + 0x68]
0x1806b4086: mov byte ptr [rip + 0x88e7306], 1
0x1806b408d: cmp qword ptr [rsi + 0x10], r14
0x1806b4091: je 0x1806b40b0
0x1806b4093: mov rdx, qword ptr [rip + 0x859948e]
0x1806b409a: mov rcx, qword ptr [rsi + 0x10]
0x1806b409e: call 0x184af5400
0x1806b40a3: test eax, eax
0x1806b40a5: jne 0x1806b4380
0x1806b40ab: mov rbx, qword ptr [rsp + 0x68]
0x1806b40b0: test rbx, rbx
0x1806b40b3: je 0x1806b43af
0x1806b40b9: cmp byte ptr [rip + 0x88e72d0], r14b
0x1806b40c0: jne 0x1806b4105
0x1806b40c2: lea rcx, [rip + 0x8598d87]
0x1806b40c9: call 0x18049c210
0x1806b40ce: lea rcx, [rip + 0x85988eb]
0x1806b40d5: call 0x18049c210
0x1806b40da: lea rcx, [rip + 0x852c37f]
0x1806b40e1: call 0x18049c210
0x1806b40e6: lea rcx, [rip + 0x8552c63]
0x1806b40ed: call 0x18049c210
0x1806b40f2: lea rcx, [rip + 0x8553587]
0x1806b40f9: call 0x18049c210
0x1806b40fe: mov byte ptr [rip + 0x88e728b], 1
0x1806b4105: cmp qword ptr [rbx + 0x10], r14
0x1806b4109: jne 0x1806b4144
0x1806b410b: mov rcx, qword ptr [rip + 0x852c34e]
0x1806b4112: call 0x18046d2f0
0x1806b4117: mov rsi, rax
0x1806b411a: test rax, rax
0x1806b411d: je 0x1806b43af
0x1806b4123: mov rdx, qword ptr [rip + 0x8598896]
0x1806b412a: mov rcx, rax
0x1806b412d: call 0x185401e40
0x1806b4132: lea rcx, [rbx + 0x10]
0x1806b4136: mov qword ptr [rbx + 0x10], rsi
0x1806b413a: mov rdx, rsi
0x1806b413d: call 0x18049bcf0
0x1806b4142: jmp 0x1806b415d
0x1806b4144: mov rcx, qword ptr [rbx + 0x10]
0x1806b4148: test rcx, rcx
0x1806b414b: je 0x1806b43af
0x1806b4151: mov rdx, qword ptr [rip + 0x8598cf8]
0x1806b4158: call 0x1853fff80
0x1806b415d: mov rax, qword ptr [rdi + 0x78]
0x1806b4161: test rax, rax
0x1806b4164: je 0x1806b43af
0x1806b416a: mov eax, dword ptr [rax + 0x48]
0x1806b416d: mov dword ptr [rbx + 0x18], eax
0x1806b4170: cmp eax, 1
0x1806b4173: jne 0x1806b41b2
0x1806b4175: xor edx, edx
0x1806b4177: mov rcx, rdi
0x1806b417a: call 0x1806dd7c0 ; Torappu.Battle.Buff.get_blackboard
0x1806b417f: mov rcx, qword ptr [rdi + 0x78]
0x1806b4183: test rcx, rcx
0x1806b4186: je 0x1806b43af
0x1806b418c: test rax, rax
0x1806b418f: je 0x1806b43af
0x1806b4195: mov r8d, dword ptr [rcx + 0x4c]
0x1806b4199: mov r9b, 1
0x1806b419c: mov rdx, qword ptr [rip + 0x8552bad]
0x1806b41a3: mov rcx, rax
0x1806b41a6: mov qword ptr [rsp + 0x20], r14
0x1806b41ab: call 0x182378c90 ; Torappu.Blackboard.GetIntOrDefault
0x1806b41b0: jmp 0x1806b41b7
0x1806b41b2: mov eax, 1
0x1806b41b7: mov dword ptr [rbx + 0x1c], eax
0x1806b41ba: cmp dword ptr [rbx + 0x18], 1
0x1806b41be: jne 0x1806b4203
0x1806b41c0: xor edx, edx
0x1806b41c2: mov rcx, rdi
0x1806b41c5: call 0x1806dd7c0 ; Torappu.Battle.Buff.get_blackboard
0x1806b41ca: mov rcx, qword ptr [rdi + 0x78]
0x1806b41ce: test rcx, rcx
0x1806b41d1: je 0x1806b43af
0x1806b41d7: test rax, rax
0x1806b41da: je 0x1806b43af
0x1806b41e0: mov r8d, dword ptr [rcx + 0x54]
0x1806b41e4: mov r9b, 1
0x1806b41e7: mov rdx, qword ptr [rip + 0x8553492]
0x1806b41ee: mov rcx, rax
0x1806b41f1: mov qword ptr [rsp + 0x20], r14
0x1806b41f6: call 0x182378c90 ; Torappu.Blackboard.GetIntOrDefault
0x1806b41fb: mov dword ptr [rbx + 0x20], eax
0x1806b41fe: jmp 0x1806b4380
0x1806b4203: mov eax, 0xffffffff
0x1806b4208: mov dword ptr [rbx + 0x20], eax
0x1806b420b: jmp 0x1806b4380
0x1806b4210: mov rcx, qword ptr [rip + 0x85b7281]
0x1806b4217: call 0x18046d2f0
0x1806b421c: mov rbx, rax
0x1806b421f: test rax, rax
0x1806b4222: je 0x1806b43af
0x1806b4228: cmp byte ptr [rip + 0x88e7160], r14b
0x1806b422f: jne 0x1806b4268
0x1806b4231: lea rcx, [rip + 0x8598788]
0x1806b4238: call 0x18049c210
0x1806b423d: lea rcx, [rip + 0x852c21c]
0x1806b4244: call 0x18049c210
0x1806b4249: lea rcx, [rip + 0x8552b00]
0x1806b4250: call 0x18049c210
0x1806b4255: lea rcx, [rip + 0x8553424]
0x1806b425c: call 0x18049c210
0x1806b4261: mov byte ptr [rip + 0x88e7127], 1
0x1806b4268: xor edx, edx
0x1806b426a: mov rcx, rbx
0x1806b426d: call 0x18051df60 ; BattleTimer.EventOnEntryClick | BattleTimer.EventOnTimerPlayNPause | BattleTimer.EventOnTimerRecord | BattleTimer.EventOnTimerReset
0x1806b4272: mov rcx, qword ptr [rip + 0x852c1e7]
0x1806b4279: call 0x18046d2f0
0x1806b427e: mov rsi, rax
0x1806b4281: test rax, rax
0x1806b4284: je 0x1806b43af
0x1806b428a: mov rdx, qword ptr [rip + 0x859872f]
0x1806b4291: mov rcx, rax
0x1806b4294: call 0x185401e40
0x1806b4299: lea rcx, [rbx + 0x10]
0x1806b429d: mov qword ptr [rbx + 0x10], rsi
0x1806b42a1: mov rdx, rsi
0x1806b42a4: call 0x18049bcf0
0x1806b42a9: mov rax, qword ptr [rdi + 0x78]
0x1806b42ad: test rax, rax
0x1806b42b0: je 0x1806b43af
0x1806b42b6: mov eax, dword ptr [rax + 0x48]
0x1806b42b9: mov dword ptr [rbx + 0x18], eax
0x1806b42bc: cmp eax, 1
0x1806b42bf: jne 0x1806b42fe
0x1806b42c1: xor edx, edx
0x1806b42c3: mov rcx, rdi
0x1806b42c6: call 0x1806dd7c0 ; Torappu.Battle.Buff.get_blackboard
0x1806b42cb: mov rcx, qword ptr [rdi + 0x78]
0x1806b42cf: test rcx, rcx
0x1806b42d2: je 0x1806b43af
0x1806b42d8: test rax, rax
0x1806b42db: je 0x1806b43af
0x1806b42e1: mov r8d, dword ptr [rcx + 0x4c]
0x1806b42e5: mov r9b, 1
0x1806b42e8: mov rdx, qword ptr [rip + 0x8552a61]
0x1806b42ef: mov rcx, rax
0x1806b42f2: mov qword ptr [rsp + 0x20], r14
0x1806b42f7: call 0x182378c90 ; Torappu.Blackboard.GetIntOrDefault
0x1806b42fc: jmp 0x1806b4303
0x1806b42fe: mov eax, 1
0x1806b4303: mov dword ptr [rbx + 0x1c], eax
0x1806b4306: cmp dword ptr [rbx + 0x18], 1
0x1806b430a: jne 0x1806b4349
0x1806b430c: xor edx, edx
0x1806b430e: mov rcx, rdi
0x1806b4311: call 0x1806dd7c0 ; Torappu.Battle.Buff.get_blackboard
0x1806b4316: mov rcx, qword ptr [rdi + 0x78]
0x1806b431a: test rcx, rcx
0x1806b431d: je 0x1806b43af
0x1806b4323: test rax, rax
0x1806b4326: je 0x1806b43af
0x1806b432c: mov r8d, dword ptr [rcx + 0x54]
0x1806b4330: mov r9b, 1
0x1806b4333: mov rdx, qword ptr [rip + 0x8553346]
0x1806b433a: mov rcx, rax
0x1806b433d: mov qword ptr [rsp + 0x20], r14
0x1806b4342: call 0x182378c90 ; Torappu.Blackboard.GetIntOrDefault
0x1806b4347: jmp 0x1806b434e
0x1806b4349: mov eax, 0xffffffff
0x1806b434e: mov dword ptr [rbx + 0x20], eax
0x1806b4351: xor edx, edx
0x1806b4353: mov qword ptr [rsp + 0x68], rbx
0x1806b4358: mov rcx, rdi
0x1806b435b: mov rbx, qword ptr [rbp + 0x20]
0x1806b435f: call 0x1806de2a0 ; Torappu.Battle.Buff.get_overrideKey
0x1806b4364: test rbx, rbx
0x1806b4367: je 0x1806b43af
0x1806b4369: mov r9, qword ptr [rip + 0x859c3a8]
0x1806b4370: mov rdx, rax
0x1806b4373: mov r8, qword ptr [rsp + 0x68]
0x1806b4378: mov rcx, rbx
0x1806b437b: call 0x185b20720
0x1806b4380: mov rax, qword ptr [rsp + 0x68]
0x1806b4385: mov rsi, qword ptr [rsp + 0x58]
0x1806b438a: mov rbx, qword ptr [rsp + 0x50]
0x1806b438f: add rsp, 0x30
0x1806b4393: pop r14
0x1806b4395: pop rdi
0x1806b4396: pop rbp
0x1806b4397: ret
0x1806b4398: xor r9d, r9d
0x1806b439b: mov r8, rdi
0x1806b439e: mov rdx, rbp
0x1806b43a1: call 0x183194810 ; XLua.DelegateBridge.__Gen_Delegate_Imp11155
0x1806b43a6: add rsp, 0x30
0x1806b43aa: pop r14
0x1806b43ac: pop rdi
0x1806b43ad: pop rbp
0x1806b43ae: ret
0x1806b43af: call 0x18049c3c0
0x1806b43b4: int3
0x1806b43b5: int3
0x1806b43b6: int3
0x1806b43b7: int3
0x1806b43b8: int3
0x1806b43b9: int3
0x1806b43ba: int3
0x1806b43bb: int3
0x1806b43bc: int3
0x1806b43bd: int3
0x1806b43be: int3
0x1806b43bf: int3
