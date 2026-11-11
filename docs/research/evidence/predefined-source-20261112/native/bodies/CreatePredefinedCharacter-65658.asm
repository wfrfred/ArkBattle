0x18064f9c0: mov qword ptr [rsp + 8], rbx
0x18064f9c5: mov qword ptr [rsp + 0x10], rsi
0x18064f9ca: push rdi
0x18064f9cb: sub rsp, 0x40
0x18064f9cf: cmp byte ptr [rip + 0x894b637], 0
0x18064f9d6: movzx ebx, r8b
0x18064f9da: mov rdi, rdx
0x18064f9dd: mov rsi, rcx
0x18064f9e0: jne 0x18064fa01
0x18064f9e2: lea rcx, [rip + 0x84c0257]
0x18064f9e9: call 0x18049c210
0x18064f9ee: lea rcx, [rip + 0x84d065b]
0x18064f9f5: call 0x18049c210
0x18064f9fa: mov byte ptr [rip + 0x894b60c], 1
0x18064fa01: mov rax, qword ptr [rip + 0x84c0238]
0x18064fa08: mov byte ptr [rsp + 0x30], 0
0x18064fa0d: cmp dword ptr [rax + 0xe0], 0
0x18064fa14: jne 0x18064fa25
0x18064fa16: mov rcx, rax
0x18064fa19: call 0x18049c450
0x18064fa1e: mov rax, qword ptr [rip + 0x84c021b]
0x18064fa25: mov rax, qword ptr [rax + 0xb8]
0x18064fa2c: mov rcx, qword ptr [rax + 0x848]
0x18064fa33: mov qword ptr [rsp + 0x20], 0
0x18064fa3c: test rcx, rcx
0x18064fa3f: jne 0x18064fa8a
0x18064fa41: lea r9, [rsp + 0x30]
0x18064fa46: movzx r8d, bl
0x18064fa4a: mov rdx, rdi
0x18064fa4d: mov rcx, rsi
0x18064fa50: call 0x180664c70 ; Torappu.Battle.BattleController._CreatePredefinedCharacter
0x18064fa55: mov rcx, qword ptr [rip + 0x84d05f4]
0x18064fa5c: mov rbx, rax
0x18064fa5f: cmp dword ptr [rcx + 0xe0], 0
0x18064fa66: jne 0x18064fa6d
0x18064fa68: call 0x18049c450
0x18064fa6d: xor r8d, r8d
0x18064fa70: xor edx, edx
0x18064fa72: mov rcx, rbx
0x18064fa75: call 0x186dcf430 ; UnityEngine.Object.op_Inequality
0x18064fa7a: mov rbx, qword ptr [rsp + 0x50]
0x18064fa7f: mov rsi, qword ptr [rsp + 0x58]
0x18064fa84: add rsp, 0x40
0x18064fa88: pop rdi
0x18064fa89: ret
0x18064fa8a: movzx r9d, bl
0x18064fa8e: mov r8, rdi
0x18064fa91: mov rdx, rsi
0x18064fa94: call 0x1831ab840 ; XLua.DelegateBridge.__Gen_Delegate_Imp112
0x18064fa99: mov rbx, qword ptr [rsp + 0x50]
0x18064fa9e: mov rsi, qword ptr [rsp + 0x58]
0x18064faa3: add rsp, 0x40
0x18064faa7: pop rdi
0x18064faa8: ret
0x18064faa9: int3
0x18064faaa: int3
0x18064faab: int3
0x18064faac: int3
0x18064faad: int3
0x18064faae: int3
0x18064faaf: int3
