0x1806eeaa0: mov qword ptr [rsp + 0x18], rsi
0x1806eeaa5: push rdi
0x1806eeaa6: push r14
0x1806eeaa8: push r15
0x1806eeaaa: sub rsp, 0x40
0x1806eeaae: cmp byte ptr [rip + 0x88acae2], 0
0x1806eeab5: movzx r15d, r9b
0x1806eeab9: mov rsi, r8
0x1806eeabc: mov r14d, edx
0x1806eeabf: mov rdi, rcx
0x1806eeac2: jne 0x1806eeae3
0x1806eeac4: lea rcx, [rip + 0x84d325d]
0x1806eeacb: call 0x18049c210
0x1806eead0: lea rcx, [rip + 0x8431579]
0x1806eead7: call 0x18049c210
0x1806eeadc: mov byte ptr [rip + 0x88acab4], 1
0x1806eeae3: mov rax, qword ptr [rip + 0x84d323e]
0x1806eeaea: mov rdx, qword ptr [rax + 0xb8]
0x1806eeaf1: mov rcx, qword ptr [rdx + 0x1c0]
0x1806eeaf8: test rcx, rcx
0x1806eeafb: jne 0x1806eed4e
0x1806eeb01: mov qword ptr [rsp + 0x60], rbx
0x1806eeb06: mov qword ptr [rsp + 0x68], r12
0x1806eeb0b: cmp byte ptr [rip + 0x88e9f5f], cl
0x1806eeb11: jbe 0x1806eeb1b
0x1806eeb13: mov rcx, qword ptr [rdi]
0x1806eeb16: call 0x180457010
0x1806eeb1b: mov rax, qword ptr [rdi]
0x1806eeb1e: movzx r9d, r15b
0x1806eeb22: mov rbx, qword ptr [rsp + 0x88]
0x1806eeb2a: mov r8, rsi
0x1806eeb2d: mov edx, r14d
0x1806eeb30: mov rcx, rdi
0x1806eeb33: mov r10, qword ptr [rax + 0x300]
0x1806eeb3a: mov rax, qword ptr [rax + 0x308]
0x1806eeb41: mov qword ptr [rsp + 0x30], rax
0x1806eeb46: movzx eax, byte ptr [rsp + 0x80]
0x1806eeb4e: mov qword ptr [rsp + 0x28], rbx
0x1806eeb53: mov byte ptr [rsp + 0x20], al
0x1806eeb57: call r10
0x1806eeb5a: mov rcx, qword ptr [rip + 0x84314ef]
0x1806eeb61: mov r12, rax
0x1806eeb64: cmp dword ptr [rcx + 0xe0], 0
0x1806eeb6b: jne 0x1806eeb72
0x1806eeb6d: call 0x18049c450
0x1806eeb72: xor r8d, r8d
0x1806eeb75: xor edx, edx
0x1806eeb77: mov rcx, r12
0x1806eeb7a: call 0x186dcf430 ; UnityEngine.Object.op_Inequality
0x1806eeb7f: test al, al
0x1806eeb81: jne 0x1806eecb4
0x1806eeb87: test rbx, rbx
0x1806eeb8a: je 0x1806eed92
0x1806eeb90: cmp byte ptr [rbx + 0x10], al
0x1806eeb93: je 0x1806eed32
0x1806eeb99: test rsi, rsi
0x1806eeb9c: je 0x1806eed92
0x1806eeba2: xor edx, edx
0x1806eeba4: mov rcx, rsi
0x1806eeba7: call 0x180b22ec0 ; Torappu.Battle.VisualObject.get_gridPosition
0x1806eebac: cmp byte ptr [rip + 0x88aca09], 0
0x1806eebb3: mov rbx, rax
0x1806eebb6: jne 0x1806eebd7
0x1806eebb8: lea rcx, [rip + 0x84d3169]
0x1806eebbf: call 0x18049c210
0x1806eebc4: lea rcx, [rip + 0x84c2f95]
0x1806eebcb: call 0x18049c210
0x1806eebd0: mov byte ptr [rip + 0x88ac9e5], 1
0x1806eebd7: mov rax, qword ptr [rip + 0x84d314a]
0x1806eebde: mov rcx, qword ptr [rax + 0xb8]
0x1806eebe5: mov rcx, qword ptr [rcx + 0x2e8]
0x1806eebec: test rcx, rcx
0x1806eebef: jne 0x1806eec91
0x1806eebf5: test r15b, r15b
0x1806eebf8: je 0x1806eed05
0x1806eebfe: mov rcx, qword ptr [rip + 0x84c2f5b]
0x1806eec05: call 0x18558e720
0x1806eec0a: test rax, rax
0x1806eec0d: je 0x1806eed92
0x1806eec13: xor edx, edx
0x1806eec15: mov rcx, rax
0x1806eec18: call 0x180671c60 ; Torappu.Battle.BattleController.get_logger
0x1806eec1d: cmp byte ptr [rip + 0x88ac94f], 0
0x1806eec24: mov r15, rax
0x1806eec27: jne 0x1806eec3c
0x1806eec29: lea rcx, [rip + 0x84d30f8]
0x1806eec30: call 0x18049c210
0x1806eec35: mov byte ptr [rip + 0x88ac937], 1
0x1806eec3c: mov rcx, qword ptr [rip + 0x84d30e5]
0x1806eec43: mov rdx, qword ptr [rcx + 0xb8]
0x1806eec4a: mov rcx, qword ptr [rdx + 0xa0]
0x1806eec51: test rcx, rcx
0x1806eec54: jne 0x1806eec5c
0x1806eec56: mov rax, qword ptr [rdi + 0x20]
0x1806eec5a: jmp 0x1806eec67
0x1806eec5c: xor r8d, r8d
0x1806eec5f: mov rdx, rdi
0x1806eec62: call 0x183460590 ; XLua.DelegateBridge.__Gen_Delegate_Imp3755
0x1806eec67: test r15, r15
0x1806eec6a: je 0x1806eed92
0x1806eec70: mov qword ptr [rsp + 0x28], 0
0x1806eec79: mov r9, rbx
0x1806eec7c: mov r8d, r14d
0x1806eec7f: mov byte ptr [rsp + 0x20], 1
0x1806eec84: mov rdx, rax
0x1806eec87: mov rcx, r15
0x1806eec8a: call 0x1807429c0 ; Torappu.Battle.BattleLogger.LogManualSpawn
0x1806eec8f: jmp 0x1806eed05
0x1806eec91: mov qword ptr [rsp + 0x30], 0
0x1806eec9a: mov r9d, r14d
0x1806eec9d: mov byte ptr [rsp + 0x28], r15b
0x1806eeca2: mov r8, r12
0x1806eeca5: mov rdx, rdi
0x1806eeca8: mov qword ptr [rsp + 0x20], rbx
0x1806eecad: call 0x183402cd0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3163
0x1806eecb2: jmp 0x1806eed05
0x1806eecb4: test rsi, rsi
0x1806eecb7: je 0x1806eed92
0x1806eecbd: xor edx, edx
0x1806eecbf: mov rcx, rsi
0x1806eecc2: call 0x180b22ec0 ; Torappu.Battle.VisualObject.get_gridPosition
0x1806eecc7: cmp byte ptr [rip + 0x88e9da2], 0
0x1806eecce: mov rbx, rax
0x1806eecd1: jbe 0x1806eecdb
0x1806eecd3: mov rcx, qword ptr [rdi]
0x1806eecd6: call 0x180457010
0x1806eecdb: mov rax, qword ptr [rdi]
0x1806eecde: mov r9, rbx
0x1806eece1: mov r8d, r14d
0x1806eece4: mov rdx, r12
0x1806eece7: mov rcx, rdi
0x1806eecea: mov r10, qword ptr [rax + 0x2e0]
0x1806eecf1: mov rax, qword ptr [rax + 0x2e8]
0x1806eecf8: mov qword ptr [rsp + 0x28], rax
0x1806eecfd: mov byte ptr [rsp + 0x20], r15b
0x1806eed02: call r10
0x1806eed05: mov rbx, qword ptr [rdi + 0x10]
0x1806eed09: xor edx, edx
0x1806eed0b: mov rcx, rsi
0x1806eed0e: call 0x180b22ec0 ; Torappu.Battle.VisualObject.get_gridPosition
0x1806eed13: test rbx, rbx
0x1806eed16: je 0x1806eed92
0x1806eed18: mov r9, rdi
0x1806eed1b: mov qword ptr [rsp + 0x20], 0
0x1806eed24: mov r8d, r14d
0x1806eed27: mov rdx, rax
0x1806eed2a: mov rcx, rbx
0x1806eed2d: call 0x1806faa50 ; Torappu.Battle.Deck.OnCardSpawn
0x1806eed32: mov rbx, qword ptr [rsp + 0x60]
0x1806eed37: mov rax, r12
0x1806eed3a: mov r12, qword ptr [rsp + 0x68]
0x1806eed3f: mov rsi, qword ptr [rsp + 0x70]
0x1806eed44: add rsp, 0x40
0x1806eed48: pop r15
0x1806eed4a: pop r14
0x1806eed4c: pop rdi
0x1806eed4d: ret
0x1806eed4e: mov rax, qword ptr [rsp + 0x88]
0x1806eed56: mov r9, rsi
0x1806eed59: mov qword ptr [rsp + 0x38], 0
0x1806eed62: mov r8d, r14d
0x1806eed65: mov qword ptr [rsp + 0x30], rax
0x1806eed6a: mov rdx, rdi
0x1806eed6d: movzx eax, byte ptr [rsp + 0x80]
0x1806eed75: mov byte ptr [rsp + 0x28], al
0x1806eed79: mov byte ptr [rsp + 0x20], r15b
0x1806eed7e: call 0x1831976c0 ; XLua.DelegateBridge.__Gen_Delegate_Imp11174
0x1806eed83: mov rsi, qword ptr [rsp + 0x70]
0x1806eed88: add rsp, 0x40
0x1806eed8c: pop r15
0x1806eed8e: pop r14
0x1806eed90: pop rdi
0x1806eed91: ret
0x1806eed92: call 0x18049c3c0
0x1806eed97: int3
0x1806eed98: int3
0x1806eed99: int3
0x1806eed9a: int3
0x1806eed9b: int3
0x1806eed9c: int3
0x1806eed9d: int3
0x1806eed9e: int3
0x1806eed9f: int3
