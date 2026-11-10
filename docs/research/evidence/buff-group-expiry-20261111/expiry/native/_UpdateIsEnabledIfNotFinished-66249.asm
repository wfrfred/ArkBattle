0x1806dca50: push rbx
0x1806dca52: sub rsp, 0x130
0x1806dca59: cmp byte ptr [rip + 0x88be910], 0
0x1806dca60: mov rbx, rcx
0x1806dca63: jne 0x1806dca84
0x1806dca65: lea rcx, [rip + 0x8467fec]
0x1806dca6c: call 0x18049c210
0x1806dca71: lea rcx, [rip + 0x84435d8]
0x1806dca78: call 0x18049c210
0x1806dca7d: mov byte ptr [rip + 0x88be8ec], 1
0x1806dca84: mov rax, qword ptr [rip + 0x8467fcd]
0x1806dca8b: cmp dword ptr [rax + 0xe0], 0
0x1806dca92: jne 0x1806dcaa3
0x1806dca94: mov rcx, rax
0x1806dca97: call 0x18049c450
0x1806dca9c: mov rax, qword ptr [rip + 0x8467fb5]
0x1806dcaa3: mov rax, qword ptr [rax + 0xb8]
0x1806dcaaa: mov rcx, qword ptr [rax + 0x700]
0x1806dcab1: test rcx, rcx
0x1806dcab4: jne 0x1806dce42
0x1806dcaba: mov qword ptr [rsp + 0x140], rsi
0x1806dcac2: mov qword ptr [rsp + 0x148], rdi
0x1806dcaca: movzx esi, byte ptr [rbx + 0x1ff]
0x1806dcad1: xor edx, edx
0x1806dcad3: mov rcx, rbx
0x1806dcad6: call 0x1806de320 ; Torappu.Battle.Buff.get_owner
0x1806dcadb: cmp byte ptr [rbx + 0x1f2], 0
0x1806dcae2: mov rdi, rax
0x1806dcae5: je 0x1806dcb28
0x1806dcae7: mov rcx, qword ptr [rip + 0x8443562]
0x1806dcaee: cmp dword ptr [rcx + 0xe0], 0
0x1806dcaf5: jne 0x1806dcafc
0x1806dcaf7: call 0x18049c450
0x1806dcafc: xor r8d, r8d
0x1806dcaff: xor edx, edx
0x1806dcb01: mov rcx, rdi
0x1806dcb04: call 0x186dcf430 ; UnityEngine.Object.op_Inequality
0x1806dcb09: test al, al
0x1806dcb0b: je 0x1806dcb28
0x1806dcb0d: test rdi, rdi
0x1806dcb10: je 0x1806dce55
0x1806dcb16: xor edx, edx
0x1806dcb18: mov rcx, rdi
0x1806dcb1b: call 0x180737eb0 ; Torappu.Battle.Entity.get_isSilenced
0x1806dcb20: test al, al
0x1806dcb22: jne 0x1806dcc48
0x1806dcb28: cmp byte ptr [rbx + 0x1f3], 0
0x1806dcb2f: je 0x1806dcb72
0x1806dcb31: mov rcx, qword ptr [rip + 0x8443518]
0x1806dcb38: cmp dword ptr [rcx + 0xe0], 0
0x1806dcb3f: jne 0x1806dcb46
0x1806dcb41: call 0x18049c450
0x1806dcb46: xor r8d, r8d
0x1806dcb49: xor edx, edx
0x1806dcb4b: mov rcx, rdi
0x1806dcb4e: call 0x186dcf430 ; UnityEngine.Object.op_Inequality
0x1806dcb53: test al, al
0x1806dcb55: je 0x1806dcb72
0x1806dcb57: test rdi, rdi
0x1806dcb5a: je 0x1806dce55
0x1806dcb60: xor edx, edx
0x1806dcb62: mov rcx, rdi
0x1806dcb65: call 0x1807381a0 ; Torappu.Battle.Entity.get_isStunned
0x1806dcb6a: test al, al
0x1806dcb6c: jne 0x1806dcc48
0x1806dcb72: cmp byte ptr [rbx + 0x1f4], 0
0x1806dcb79: je 0x1806dcbbc
0x1806dcb7b: mov rcx, qword ptr [rip + 0x84434ce]
0x1806dcb82: cmp dword ptr [rcx + 0xe0], 0
0x1806dcb89: jne 0x1806dcb90
0x1806dcb8b: call 0x18049c450
0x1806dcb90: xor r8d, r8d
0x1806dcb93: xor edx, edx
0x1806dcb95: mov rcx, rdi
0x1806dcb98: call 0x186dcf430 ; UnityEngine.Object.op_Inequality
0x1806dcb9d: test al, al
0x1806dcb9f: je 0x1806dcbbc
0x1806dcba1: test rdi, rdi
0x1806dcba4: je 0x1806dce55
0x1806dcbaa: xor edx, edx
0x1806dcbac: mov rcx, rdi
0x1806dcbaf: call 0x1807372f0 ; Torappu.Battle.Entity.get_isFrozen
0x1806dcbb4: test al, al
0x1806dcbb6: jne 0x1806dcc48
0x1806dcbbc: cmp byte ptr [rbx + 0x1f7], 0
0x1806dcbc3: je 0x1806dcc02
0x1806dcbc5: mov rcx, qword ptr [rip + 0x8443484]
0x1806dcbcc: cmp dword ptr [rcx + 0xe0], 0
0x1806dcbd3: jne 0x1806dcbda
0x1806dcbd5: call 0x18049c450
0x1806dcbda: xor r8d, r8d
0x1806dcbdd: xor edx, edx
0x1806dcbdf: mov rcx, rdi
0x1806dcbe2: call 0x186dcf430 ; UnityEngine.Object.op_Inequality
0x1806dcbe7: test al, al
0x1806dcbe9: je 0x1806dcc02
0x1806dcbeb: test rdi, rdi
0x1806dcbee: je 0x1806dce55
0x1806dcbf4: xor edx, edx
0x1806dcbf6: mov rcx, rdi
0x1806dcbf9: call 0x180736ac0 ; Torappu.Battle.Entity.get_isActuallyLevitate
0x1806dcbfe: test al, al
0x1806dcc00: jne 0x1806dcc48
0x1806dcc02: cmp byte ptr [rbx + 0x1f8], 0
0x1806dcc09: je 0x1806dcc4b
0x1806dcc0b: mov rcx, qword ptr [rip + 0x844343e]
0x1806dcc12: cmp dword ptr [rcx + 0xe0], 0
0x1806dcc19: jne 0x1806dcc20
0x1806dcc1b: call 0x18049c450
0x1806dcc20: xor r8d, r8d
0x1806dcc23: xor edx, edx
0x1806dcc25: mov rcx, rdi
0x1806dcc28: call 0x186dcf430 ; UnityEngine.Object.op_Inequality
0x1806dcc2d: test al, al
0x1806dcc2f: je 0x1806dcc4b
0x1806dcc31: test rdi, rdi
0x1806dcc34: je 0x1806dce55
0x1806dcc3a: xor edx, edx
0x1806dcc3c: mov rcx, rdi
0x1806dcc3f: call 0x180736a10 ; Torappu.Battle.Entity.get_isActuallyGroundBound
0x1806dcc44: test al, al
0x1806dcc46: je 0x1806dcc4b
0x1806dcc48: xor sil, sil
0x1806dcc4b: cmp byte ptr [rbx + 0x1fd], sil
0x1806dcc52: je 0x1806dcd48
0x1806dcc58: test sil, sil
0x1806dcc5b: jne 0x1806dcd61
0x1806dcc61: cmp byte ptr [rip + 0x88be689], sil
0x1806dcc68: mov byte ptr [rbx + 0x1fd], sil
0x1806dcc6f: jne 0x1806dcc84
0x1806dcc71: lea rcx, [rip + 0x8467de0]
0x1806dcc78: call 0x18049c210
0x1806dcc7d: mov byte ptr [rip + 0x88be66d], 1
0x1806dcc84: mov rax, qword ptr [rip + 0x8467dcd]
0x1806dcc8b: cmp dword ptr [rax + 0xe0], 0
0x1806dcc92: jne 0x1806dcca3
0x1806dcc94: mov rcx, rax
0x1806dcc97: call 0x18049c450
0x1806dcc9c: mov rax, qword ptr [rip + 0x8467db5]
0x1806dcca3: mov rax, qword ptr [rax + 0xb8]
0x1806dccaa: mov rcx, qword ptr [rax + 0x308]
0x1806dccb1: test rcx, rcx
0x1806dccb4: jne 0x1806dce32
0x1806dccba: xor edx, edx
0x1806dccbc: mov rcx, rbx
0x1806dccbf: call 0x1806de320 ; Torappu.Battle.Buff.get_owner
0x1806dccc4: test rax, rax
0x1806dccc7: je 0x1806dce55
0x1806dcccd: xor edx, edx
0x1806dcccf: mov rcx, rax
0x1806dccd2: call 0x1807335c0 ; Torappu.Battle.Entity.get_attributes
0x1806dccd7: test rax, rax
0x1806dccda: je 0x1806dce55
0x1806dcce0: xor r8d, r8d
0x1806dcce3: mov rdx, rbx
0x1806dcce6: mov rcx, rax
0x1806dcce9: call 0x180678e60 ; Torappu.Battle.Attributes.RemoveModifier
0x1806dccee: cmp qword ptr [rbx + 0x70], 0
0x1806dccf3: je 0x1806dcd29
0x1806dccf5: xor edx, edx
0x1806dccf7: mov rcx, rbx
0x1806dccfa: call 0x1806de320 ; Torappu.Battle.Buff.get_owner
0x1806dccff: test rax, rax
0x1806dcd02: je 0x1806dce55
0x1806dcd08: xor edx, edx
0x1806dcd0a: mov rcx, rax
0x1806dcd0d: call 0x1807335c0 ; Torappu.Battle.Entity.get_attributes
0x1806dcd12: test rax, rax
0x1806dcd15: je 0x1806dce55
0x1806dcd1b: xor r8d, r8d
0x1806dcd1e: mov rdx, rbx
0x1806dcd21: mov rcx, rax
0x1806dcd24: call 0x180678dc0 ; Torappu.Battle.Attributes.RemoveAbnormalResistanceModifier
0x1806dcd29: mov qword ptr [rsp + 0x20], 0
0x1806dcd32: mov r9b, 1
0x1806dcd35: mov r8d, 0x19
0x1806dcd3b: mov rdx, rbx
0x1806dcd3e: lea rcx, [rsp + 0x30]
0x1806dcd43: call 0x1806dc050 ; Torappu.Battle.Buff._RunActions
0x1806dcd48: mov rsi, qword ptr [rsp + 0x140]
0x1806dcd50: mov rdi, qword ptr [rsp + 0x148]
0x1806dcd58: add rsp, 0x130
0x1806dcd5f: pop rbx
0x1806dcd60: ret
0x1806dcd61: cmp byte ptr [rip + 0x88be588], 0
0x1806dcd68: mov word ptr [rbx + 0x1fd], 0x101
0x1806dcd71: jne 0x1806dcd86
0x1806dcd73: lea rcx, [rip + 0x8467cde]
0x1806dcd7a: call 0x18049c210
0x1806dcd7f: mov byte ptr [rip + 0x88be56a], 1
0x1806dcd86: mov rax, qword ptr [rip + 0x8467ccb]
0x1806dcd8d: cmp dword ptr [rax + 0xe0], 0
0x1806dcd94: jne 0x1806dcda5
0x1806dcd96: mov rcx, rax
0x1806dcd99: call 0x18049c450
0x1806dcd9e: mov rax, qword ptr [rip + 0x8467cb3]
0x1806dcda5: mov rax, qword ptr [rax + 0xb8]
0x1806dcdac: mov rcx, qword ptr [rax + 0x300]
0x1806dcdb3: test rcx, rcx
0x1806dcdb6: jne 0x1806dce32
0x1806dcdb8: xor edx, edx
0x1806dcdba: mov rcx, rbx
0x1806dcdbd: call 0x1806de320 ; Torappu.Battle.Buff.get_owner
0x1806dcdc2: test rax, rax
0x1806dcdc5: je 0x1806dce55
0x1806dcdcb: xor edx, edx
0x1806dcdcd: mov rcx, rax
0x1806dcdd0: call 0x1807335c0 ; Torappu.Battle.Entity.get_attributes
0x1806dcdd5: test rax, rax
0x1806dcdd8: je 0x1806dce55
0x1806dcdda: xor r8d, r8d
0x1806dcddd: mov rdx, rbx
0x1806dcde0: mov rcx, rax
0x1806dcde3: call 0x180677240 ; Torappu.Battle.Attributes.AddModifier
0x1806dcde8: cmp qword ptr [rbx + 0x70], 0
0x1806dcded: je 0x1806dce1b
0x1806dcdef: xor edx, edx
0x1806dcdf1: mov rcx, rbx
0x1806dcdf4: call 0x1806de320 ; Torappu.Battle.Buff.get_owner
0x1806dcdf9: test rax, rax
0x1806dcdfc: je 0x1806dce55
0x1806dcdfe: xor edx, edx
0x1806dce00: mov rcx, rax
0x1806dce03: call 0x1807335c0 ; Torappu.Battle.Entity.get_attributes
0x1806dce08: test rax, rax
0x1806dce0b: je 0x1806dce55
0x1806dce0d: xor r8d, r8d
0x1806dce10: mov rdx, rbx
0x1806dce13: mov rcx, rax
0x1806dce16: call 0x1806770c0 ; Torappu.Battle.Attributes.AddAbnormalResistanceModifier
0x1806dce1b: mov qword ptr [rsp + 0x20], 0
0x1806dce24: mov r9b, 1
0x1806dce27: mov r8d, 0x18
0x1806dce2d: jmp 0x1806dcd3b
0x1806dce32: xor r8d, r8d
0x1806dce35: mov rdx, rbx
0x1806dce38: call 0x1833c9ac0 ; XLua.DelegateBridge.__Gen_Delegate_Imp27
0x1806dce3d: jmp 0x1806dcd48
0x1806dce42: xor r8d, r8d
0x1806dce45: mov rdx, rbx
0x1806dce48: add rsp, 0x130
0x1806dce4f: pop rbx
0x1806dce50: jmp 0x1833c9ac0 ; XLua.DelegateBridge.__Gen_Delegate_Imp27
0x1806dce55: call 0x18049c3c0
0x1806dce5a: int3
0x1806dce5b: int3
0x1806dce5c: int3
0x1806dce5d: int3
0x1806dce5e: int3
0x1806dce5f: int3
