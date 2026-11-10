0x1806cc000: mov qword ptr [rsp + 8], rbx
0x1806cc005: mov qword ptr [rsp + 0x10], rsi
0x1806cc00a: push rdi
0x1806cc00b: sub rsp, 0x30
0x1806cc00f: cmp byte ptr [rip + 0x88cf3a6], 0
0x1806cc016: mov rsi, r8
0x1806cc019: mov rbx, rdx
0x1806cc01c: mov rdi, rcx
0x1806cc01f: jne 0x1806cc034
0x1806cc021: lea rcx, [rip + 0x859ed98]
0x1806cc028: call 0x18049c210
0x1806cc02d: mov byte ptr [rip + 0x88cf388], 1
0x1806cc034: mov rax, qword ptr [rip + 0x859ed85]
0x1806cc03b: mov r9, qword ptr [rax + 0xb8]
0x1806cc042: mov rcx, qword ptr [r9 + 0x118]
0x1806cc049: test rcx, rcx
0x1806cc04c: jne 0x1806cc0d4
0x1806cc052: test rbx, rbx
0x1806cc055: je 0x1806cc0fb
0x1806cc05b: xor edx, edx
0x1806cc05d: mov rcx, rbx
0x1806cc060: call 0x1806de2a0 ; Torappu.Battle.Buff.get_overrideKey
0x1806cc065: cmp byte ptr [rip + 0x88cf34d], 0
0x1806cc06c: mov rbx, rax
0x1806cc06f: jne 0x1806cc090
0x1806cc071: lea rcx, [rip + 0x859ed48]
0x1806cc078: call 0x18049c210
0x1806cc07d: lea rcx, [rip + 0x85851fc]
0x1806cc084: call 0x18049c210
0x1806cc089: mov byte ptr [rip + 0x88cf329], 1
0x1806cc090: mov rcx, qword ptr [rip + 0x859ed29]
0x1806cc097: mov rdx, qword ptr [rcx + 0xb8]
0x1806cc09e: mov rcx, qword ptr [rdx + 0x100]
0x1806cc0a5: test rcx, rcx
0x1806cc0a8: jne 0x1806cc0d4
0x1806cc0aa: mov rcx, qword ptr [rdi + 0x20]
0x1806cc0ae: test rcx, rcx
0x1806cc0b1: je 0x1806cc0fb
0x1806cc0b3: mov r9, qword ptr [rip + 0x85851c6]
0x1806cc0ba: mov r8, rsi
0x1806cc0bd: mov rdx, rbx
0x1806cc0c0: mov rbx, qword ptr [rsp + 0x40]
0x1806cc0c5: mov rsi, qword ptr [rsp + 0x48]
0x1806cc0ca: add rsp, 0x30
0x1806cc0ce: pop rdi
0x1806cc0cf: jmp 0x185b2cad0
0x1806cc0d4: mov r9, rsi
0x1806cc0d7: mov qword ptr [rsp + 0x20], 0
0x1806cc0e0: mov r8, rbx
0x1806cc0e3: mov rdx, rdi
0x1806cc0e6: call 0x183194fb0 ; XLua.DelegateBridge.__Gen_Delegate_Imp11158
0x1806cc0eb: mov rbx, qword ptr [rsp + 0x40]
0x1806cc0f0: mov rsi, qword ptr [rsp + 0x48]
0x1806cc0f5: add rsp, 0x30
0x1806cc0f9: pop rdi
0x1806cc0fa: ret
0x1806cc0fb: call 0x18049c3c0
0x1806cc100: int3
0x1806cc101: int3
0x1806cc102: int3
0x1806cc103: int3
0x1806cc104: int3
0x1806cc105: int3
0x1806cc106: int3
0x1806cc107: int3
0x1806cc108: int3
0x1806cc109: int3
0x1806cc10a: int3
0x1806cc10b: int3
0x1806cc10c: int3
0x1806cc10d: int3
0x1806cc10e: int3
0x1806cc10f: int3
