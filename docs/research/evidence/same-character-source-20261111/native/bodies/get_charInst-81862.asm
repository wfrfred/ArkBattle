0x180c2df00: push rbx
0x180c2df02: sub rsp, 0x20
0x180c2df06: cmp byte ptr [rip + 0x83706c0], 0
0x180c2df0d: mov rbx, rcx
0x180c2df10: jne 0x180c2df31
0x180c2df12: lea rcx, [rip + 0x7f3dc77]
0x180c2df19: call 0x18049c210
0x180c2df1e: lea rcx, [rip + 0x7fcc4f3]
0x180c2df25: call 0x18049c210
0x180c2df2a: mov byte ptr [rip + 0x837069c], 1
0x180c2df31: mov rax, qword ptr [rip + 0x7fcc4e0]
0x180c2df38: mov rdx, qword ptr [rax + 0xb8]
0x180c2df3f: mov rcx, qword ptr [rdx + 0x60]
0x180c2df43: test rcx, rcx
0x180c2df46: jne 0x180c2df81
0x180c2df48: mov rbx, qword ptr [rbx + 0x38]
0x180c2df4c: test rbx, rbx
0x180c2df4f: je 0x180c2df5a
0x180c2df51: mov rbx, qword ptr [rbx + 0x38]
0x180c2df55: test rbx, rbx
0x180c2df58: jne 0x180c2df78
0x180c2df5a: mov rcx, qword ptr [rip + 0x7f3dc2f]
0x180c2df61: call 0x18046d2f0
0x180c2df66: mov rbx, rax
0x180c2df69: test rax, rax
0x180c2df6c: je 0x180c2df91
0x180c2df6e: xor edx, edx
0x180c2df70: mov rcx, rax
0x180c2df73: call 0x182461050 ; Torappu.CharacterInst..ctor | Torappu.AdvancedCharacterInst..ctor | Torappu.LevelData/PredefinedData/PredefinedInst..ctor | Torappu.LevelData/PredefinedData/PredefinedCard..ctor
0x180c2df78: mov rax, rbx
0x180c2df7b: add rsp, 0x20
0x180c2df7f: pop rbx
0x180c2df80: ret
0x180c2df81: xor r8d, r8d
0x180c2df84: mov rdx, rbx
0x180c2df87: add rsp, 0x20
0x180c2df8b: pop rbx
0x180c2df8c: jmp 0x1834456d0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3588
0x180c2df91: call 0x18049c3c0
0x180c2df96: int3
0x180c2df97: int3
0x180c2df98: int3
0x180c2df99: int3
0x180c2df9a: int3
0x180c2df9b: int3
0x180c2df9c: int3
0x180c2df9d: int3
0x180c2df9e: int3
0x180c2df9f: int3
