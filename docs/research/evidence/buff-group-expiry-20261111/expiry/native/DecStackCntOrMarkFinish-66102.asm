0x1806cec80: mov qword ptr [rsp + 8], rbx
0x1806cec85: mov qword ptr [rsp + 0x10], rbp
0x1806cec8a: mov qword ptr [rsp + 0x18], rsi
0x1806cec8f: push rdi
0x1806cec90: sub rsp, 0x30
0x1806cec94: cmp byte ptr [rip + 0x88cc642], 0
0x1806cec9b: mov esi, r9d
0x1806cec9e: movzx edi, r8b
0x1806ceca2: movzx ebp, dl
0x1806ceca5: mov rbx, rcx
0x1806ceca8: jne 0x1806cecd5
0x1806cecaa: lea rcx, [rip + 0x8475da7]
0x1806cecb1: call 0x18049c210
0x1806cecb6: lea rcx, [rip + 0x84f7ff3]
0x1806cecbd: call 0x18049c210
0x1806cecc2: lea rcx, [rip + 0x85675df]
0x1806cecc9: call 0x18049c210
0x1806cecce: mov byte ptr [rip + 0x88cc608], 1
0x1806cecd5: mov rax, qword ptr [rip + 0x8475d7c]
0x1806cecdc: cmp dword ptr [rax + 0xe0], 0
0x1806cece3: jne 0x1806cecf4
0x1806cece5: mov rcx, rax
0x1806cece8: call 0x18049c450
0x1806ceced: mov rax, qword ptr [rip + 0x8475d64]
0x1806cecf4: mov rax, qword ptr [rax + 0xb8]
0x1806cecfb: mov rcx, qword ptr [rax + 0x268]
0x1806ced02: test rcx, rcx
0x1806ced05: jne 0x1806ceda1
0x1806ced0b: test dil, dil
0x1806ced0e: je 0x1806ced1e
0x1806ced10: cmp byte ptr [rbx + 0xa5], cl
0x1806ced16: je 0x1806ced1e
0x1806ced18: mov dword ptr [rbx + 0x9c], ecx
0x1806ced1e: mov rcx, qword ptr [rip + 0x8567583]
0x1806ced25: mov edi, dword ptr [rbx + 0x9c]
0x1806ced2b: cmp dword ptr [rcx + 0xe0], 0
0x1806ced32: jne 0x1806ced39
0x1806ced34: call 0x18049c450
0x1806ced39: sub edi, esi
0x1806ced3b: xor r8d, r8d
0x1806ced3e: mov ecx, edi
0x1806ced40: xor edx, edx
0x1806ced42: call 0x186946150 ; Torappu.MathUtil.Max
0x1806ced47: mov dword ptr [rbx + 0x9c], eax
0x1806ced4d: test eax, eax
0x1806ced4f: jle 0x1806ced6b
0x1806ced51: mov rax, qword ptr [rbx + 0x80]
0x1806ced58: xor edx, edx
0x1806ced5a: mov rcx, rbx
0x1806ced5d: mov qword ptr [rbx + 0x88], rax
0x1806ced64: call 0x1806d9370 ; Torappu.Battle.Buff._DoUpdateStack
0x1806ced69: jmp 0x1806cedbe
0x1806ced6b: mov rcx, qword ptr [rip + 0x84f7f3e]
0x1806ced72: cmp dword ptr [rcx + 0xe0], 0
0x1806ced79: jne 0x1806ced80
0x1806ced7b: call 0x18049c450
0x1806ced80: xor edx, edx
0x1806ced82: xor ecx, ecx
0x1806ced84: call 0x18695e170 ; Torappu.FP.op_Implicit
0x1806ced89: xor r8d, r8d
0x1806ced8c: mov qword ptr [rbx + 0x88], rax
0x1806ced93: movzx edx, bpl
0x1806ced97: mov rcx, rbx
0x1806ced9a: call 0x1806cfa80 ; Torappu.Battle.Buff.MarkFinish
0x1806ced9f: jmp 0x1806cedbe
0x1806ceda1: mov qword ptr [rsp + 0x28], 0
0x1806cedaa: movzx r9d, dil
0x1806cedae: movzx r8d, bpl
0x1806cedb2: mov dword ptr [rsp + 0x20], esi
0x1806cedb6: mov rdx, rbx
0x1806cedb9: call 0x1833e9770 ; XLua.DelegateBridge.__Gen_Delegate_Imp2997
0x1806cedbe: mov rbx, qword ptr [rsp + 0x40]
0x1806cedc3: mov rbp, qword ptr [rsp + 0x48]
0x1806cedc8: mov rsi, qword ptr [rsp + 0x50]
0x1806cedcd: add rsp, 0x30
0x1806cedd1: pop rdi
0x1806cedd2: ret
0x1806cedd3: int3
0x1806cedd4: int3
0x1806cedd5: int3
0x1806cedd6: int3
0x1806cedd7: int3
0x1806cedd8: int3
0x1806cedd9: int3
0x1806cedda: int3
0x1806ceddb: int3
0x1806ceddc: int3
0x1806ceddd: int3
0x1806cedde: int3
0x1806ceddf: int3
