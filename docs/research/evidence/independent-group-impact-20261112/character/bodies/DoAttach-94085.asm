0x180f97e20: mov qword ptr [rsp + 0x10], rsi
0x180f97e25: push rdi
0x180f97e26: sub rsp, 0x30
0x180f97e2a: cmp byte ptr [rip + 0x8008bb7], 0
0x180f97e31: mov rdi, rdx
0x180f97e34: mov rsi, rcx
0x180f97e37: jne 0x180f97eac
0x180f97e39: lea rcx, [rip + 0x7c89a08]
0x180f97e40: call 0x18049c210
0x180f97e45: lea rcx, [rip + 0x7c3f7d4]
0x180f97e4c: call 0x18049c210
0x180f97e51: lea rcx, [rip + 0x7b7f9d8]
0x180f97e58: call 0x18049c210
0x180f97e5d: lea rcx, [rip + 0x7c7552c]
0x180f97e64: call 0x18049c210
0x180f97e69: lea rcx, [rip + 0x7b95048]
0x180f97e70: call 0x18049c210
0x180f97e75: lea rcx, [rip + 0x7b881d4]
0x180f97e7c: call 0x18049c210
0x180f97e81: lea rcx, [rip + 0x7c19cd8]
0x180f97e88: call 0x18049c210
0x180f97e8d: lea rcx, [rip + 0x7c5ea7c]
0x180f97e94: call 0x18049c210
0x180f97e99: lea rcx, [rip + 0x7c5ecc0]
0x180f97ea0: call 0x18049c210
0x180f97ea5: mov byte ptr [rip + 0x8008b3c], 1
0x180f97eac: mov rax, qword ptr [rip + 0x7c89995]
0x180f97eb3: mov rcx, qword ptr [rax + 0xb8]
0x180f97eba: mov rcx, qword ptr [rcx + 8]
0x180f97ebe: test rcx, rcx
0x180f97ec1: jne 0x180f980ce
0x180f97ec7: mov qword ptr [rsp + 0x40], rbx
0x180f97ecc: xor r8d, r8d
0x180f97ecf: mov rdx, rdi
0x180f97ed2: mov rcx, rsi
0x180f97ed5: call 0x180f94780 ; Torappu.Battle.Abilities.AuraAbility.DoAttach
0x180f97eda: mov rcx, qword ptr [rip + 0x7c19c7f]
0x180f97ee1: call 0x18558e720
0x180f97ee6: test rax, rax
0x180f97ee9: je 0x180f980e6
0x180f97eef: xor edx, edx
0x180f97ef1: mov rcx, rax
0x180f97ef4: call 0x180673050 ; Torappu.Battle.BattleController.get_unitManager
0x180f97ef9: test rax, rax
0x180f97efc: je 0x180f9809e
0x180f97f02: mov rdx, qword ptr [rip + 0x7c3f717]
0x180f97f09: test rdi, rdi
0x180f97f0c: jne 0x180f97f12
0x180f97f0e: xor ebx, ebx
0x180f97f10: jmp 0x180f97f5c
0x180f97f12: cmp byte ptr [rip + 0x8040b57], 0
0x180f97f19: mov r8, qword ptr [rdi]
0x180f97f1c: jbe 0x180f97f2c
0x180f97f1e: mov rcx, r8
0x180f97f21: call 0x1804566f0
0x180f97f26: xor ebx, ebx
0x180f97f28: test al, al
0x180f97f2a: jmp 0x180f97f58
0x180f97f2c: movzx eax, byte ptr [rdx + 0x130]
0x180f97f33: xor ebx, ebx
0x180f97f35: cmp byte ptr [r8 + 0x130], al
0x180f97f3c: jb 0x180f97f54
0x180f97f3e: movzx ecx, al
0x180f97f41: mov rax, qword ptr [r8 + 0xc8]
0x180f97f48: cmp qword ptr [rax + rcx*8 - 8], rdx
0x180f97f4d: mov eax, 1
0x180f97f52: je 0x180f97f56
0x180f97f54: mov eax, ebx
0x180f97f56: test eax, eax
0x180f97f58: cmovne rbx, rdi
0x180f97f5c: mov rcx, qword ptr [rip + 0x7b880ed]
0x180f97f63: cmp dword ptr [rcx + 0xe0], 0
0x180f97f6a: jne 0x180f97f71
0x180f97f6c: call 0x18049c450
0x180f97f71: xor r8d, r8d
0x180f97f74: xor edx, edx
0x180f97f76: mov rcx, rbx
0x180f97f79: call 0x186dcf430 ; UnityEngine.Object.op_Inequality
0x180f97f7e: test al, al
0x180f97f80: je 0x180f97f9d
0x180f97f82: test rbx, rbx
0x180f97f85: je 0x180f980e6
0x180f97f8b: xor edx, edx
0x180f97f8d: mov rcx, rbx
0x180f97f90: call 0x180b21a40 ; Torappu.Battle.Unit.get_isDummy
0x180f97f95: test al, al
0x180f97f97: jne 0x180f9809e
0x180f97f9d: mov rcx, qword ptr [rip + 0x7b880ac]
0x180f97fa4: cmp dword ptr [rcx + 0xe0], 0
0x180f97fab: jne 0x180f97fb2
0x180f97fad: call 0x18049c450
0x180f97fb2: xor r8d, r8d
0x180f97fb5: xor edx, edx
0x180f97fb7: mov rcx, rbx
0x180f97fba: call 0x186dcf290 ; UnityEngine.Object.op_Equality
0x180f97fbf: test al, al
0x180f97fc1: jne 0x180f980ae
0x180f97fc7: test rbx, rbx
0x180f97fca: je 0x180f980e6
0x180f97fd0: xor edx, edx
0x180f97fd2: mov rcx, rbx
0x180f97fd5: call 0x180ab2550 ; Torappu.Battle.Character.get_tokenOrHostUid
0x180f97fda: test eax, eax
0x180f97fdc: je 0x180f980ae
0x180f97fe2: xor edx, edx
0x180f97fe4: mov rcx, rbx
0x180f97fe7: call 0x180ab10d0 ; Torappu.Battle.Character.get_isToken
0x180f97fec: test al, al
0x180f97fee: je 0x180f980ae
0x180f97ff4: mov rcx, qword ptr [rip + 0x7c19b65]
0x180f97ffb: call 0x18558e720
0x180f98000: test rax, rax
0x180f98003: je 0x180f980e6
0x180f98009: xor edx, edx
0x180f9800b: mov rcx, rax
0x180f9800e: call 0x180673050 ; Torappu.Battle.BattleController.get_unitManager
0x180f98013: xor edx, edx
0x180f98015: mov rcx, rbx
0x180f98018: mov rdi, rax
0x180f9801b: call 0x180ab2550 ; Torappu.Battle.Character.get_tokenOrHostUid
0x180f98020: test rdi, rdi
0x180f98023: je 0x180f980e6
0x180f98029: xor r8d, r8d
0x180f9802c: mov edx, eax
0x180f9802e: mov rcx, rdi
0x180f98031: call 0x180b10b40 ; Torappu.Battle.UnitManager.GetFirstCharacterByUid
0x180f98036: mov r8, qword ptr [rip + 0x7b94e7b]
0x180f9803d: lea rcx, [rsp + 0x20]
0x180f98042: mov rdx, rax
0x180f98045: call 0x18474b580
0x180f9804a: movups xmm0, xmmword ptr [rsp + 0x20]
0x180f9804f: lea rcx, [rsi + 0x190]
0x180f98056: xor edx, edx
0x180f98058: movups xmmword ptr [rsi + 0x190], xmm0
0x180f9805f: call 0x18049bcf0
0x180f98064: mov rdx, qword ptr [rip + 0x7c75325]
0x180f9806b: lea rcx, [rsi + 0x190]
0x180f98072: call 0x1853ae780
0x180f98077: test al, al
0x180f98079: jne 0x180f9809e
0x180f9807b: mov rcx, qword ptr [rip + 0x7b7f7ae]
0x180f98082: cmp dword ptr [rcx + 0xe0], 0
0x180f98089: jne 0x180f98090
0x180f9808b: call 0x18049c450
0x180f98090: mov rcx, qword ptr [rip + 0x7c5eac9]
0x180f98097: xor edx, edx
0x180f98099: call 0x18693dab0 ; UnityEngine.DLog.LogError
0x180f9809e: mov rbx, qword ptr [rsp + 0x40]
0x180f980a3: mov rsi, qword ptr [rsp + 0x48]
0x180f980a8: add rsp, 0x30
0x180f980ac: pop rdi
0x180f980ad: ret
0x180f980ae: mov rcx, qword ptr [rip + 0x7b7f77b]
0x180f980b5: cmp dword ptr [rcx + 0xe0], 0
0x180f980bc: jne 0x180f980c3
0x180f980be: call 0x18049c450
0x180f980c3: mov rcx, qword ptr [rip + 0x7c5e846]
0x180f980ca: xor edx, edx
0x180f980cc: jmp 0x180f98099
0x180f980ce: xor r9d, r9d
0x180f980d1: mov r8, rdi
0x180f980d4: mov rdx, rsi
0x180f980d7: mov rsi, qword ptr [rsp + 0x48]
0x180f980dc: add rsp, 0x30
0x180f980e0: pop rdi
0x180f980e1: jmp 0x18338c7c0 ; XLua.DelegateBridge.__Gen_Delegate_Imp23
0x180f980e6: call 0x18049c3c0
0x180f980eb: int3
0x180f980ec: int3
0x180f980ed: int3
0x180f980ee: int3
0x180f980ef: int3
