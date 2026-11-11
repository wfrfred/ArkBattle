0x180fc54e0: push rbx
0x180fc54e2: sub rsp, 0x20
0x180fc54e6: cmp byte ptr [rip + 0x7fdb637], 0
0x180fc54ed: mov rbx, rcx
0x180fc54f0: jne 0x180fc5505
0x180fc54f2: lea rcx, [rip + 0x7b7e7b7]
0x180fc54f9: call 0x18049c210
0x180fc54fe: mov byte ptr [rip + 0x7fdb61f], 1
0x180fc5505: mov rax, qword ptr [rip + 0x7b7e7a4]
0x180fc550c: mov rdx, qword ptr [rax + 0xb8]
0x180fc5513: mov rcx, qword ptr [rdx + 0x30]
0x180fc5517: test rcx, rcx
0x180fc551a: jne 0x180fc5529
0x180fc551c: mov rax, qword ptr [rbx + 0x118]
0x180fc5523: add rsp, 0x20
0x180fc5527: pop rbx
0x180fc5528: ret
0x180fc5529: xor r8d, r8d
0x180fc552c: mov rdx, rbx
0x180fc552f: add rsp, 0x20
0x180fc5533: pop rbx
0x180fc5534: jmp 0x1833b8d30 ; XLua.DelegateBridge.__Gen_Delegate_Imp2689
0x180fc5539: int3
0x180fc553a: int3
0x180fc553b: int3
0x180fc553c: int3
0x180fc553d: int3
0x180fc553e: int3
0x180fc553f: int3
