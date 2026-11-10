0x1806cbf40: mov qword ptr [rsp + 8], rbx
0x1806cbf45: mov qword ptr [rsp + 0x10], rsi
0x1806cbf4a: push rdi
0x1806cbf4b: sub rsp, 0x30
0x1806cbf4f: cmp byte ptr [rip + 0x88cf463], 0
0x1806cbf56: mov rdi, r8
0x1806cbf59: mov rsi, rdx
0x1806cbf5c: mov rbx, rcx
0x1806cbf5f: jne 0x1806cbf80
0x1806cbf61: lea rcx, [rip + 0x859ee58]
0x1806cbf68: call 0x18049c210
0x1806cbf6d: lea rcx, [rip + 0x858530c]
0x1806cbf74: call 0x18049c210
0x1806cbf79: mov byte ptr [rip + 0x88cf439], 1
0x1806cbf80: mov rax, qword ptr [rip + 0x859ee39]
0x1806cbf87: mov r8, qword ptr [rax + 0xb8]
0x1806cbf8e: mov rcx, qword ptr [r8 + 0x100]
0x1806cbf95: test rcx, rcx
0x1806cbf98: jne 0x1806cbfc4
0x1806cbf9a: mov rcx, qword ptr [rbx + 0x20]
0x1806cbf9e: test rcx, rcx
0x1806cbfa1: je 0x1806cbfeb
0x1806cbfa3: mov r9, qword ptr [rip + 0x85852d6]
0x1806cbfaa: mov r8, rdi
0x1806cbfad: mov rdx, rsi
0x1806cbfb0: mov rbx, qword ptr [rsp + 0x40]
0x1806cbfb5: mov rsi, qword ptr [rsp + 0x48]
0x1806cbfba: add rsp, 0x30
0x1806cbfbe: pop rdi
0x1806cbfbf: jmp 0x185b2cad0
0x1806cbfc4: mov r9, rdi
0x1806cbfc7: mov qword ptr [rsp + 0x20], 0
0x1806cbfd0: mov r8, rsi
0x1806cbfd3: mov rdx, rbx
0x1806cbfd6: call 0x183194fb0 ; XLua.DelegateBridge.__Gen_Delegate_Imp11158
0x1806cbfdb: mov rbx, qword ptr [rsp + 0x40]
0x1806cbfe0: mov rsi, qword ptr [rsp + 0x48]
0x1806cbfe5: add rsp, 0x30
0x1806cbfe9: pop rdi
0x1806cbfea: ret
0x1806cbfeb: call 0x18049c3c0
0x1806cbff0: int3
0x1806cbff1: int3
0x1806cbff2: int3
0x1806cbff3: int3
0x1806cbff4: int3
0x1806cbff5: int3
0x1806cbff6: int3
0x1806cbff7: int3
0x1806cbff8: int3
0x1806cbff9: int3
0x1806cbffa: int3
0x1806cbffb: int3
0x1806cbffc: int3
0x1806cbffd: int3
0x1806cbffe: int3
0x1806cbfff: int3
