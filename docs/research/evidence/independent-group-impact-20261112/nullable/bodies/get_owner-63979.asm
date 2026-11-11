0x180605810: push rbx
0x180605812: sub rsp, 0x20
0x180605816: cmp byte ptr [rip + 0x89953d2], 0
0x18060581d: mov rbx, rcx
0x180605820: jne 0x180605841
0x180605822: lea rcx, [rip + 0x852b3a7]
0x180605829: call 0x18049c210
0x18060582e: lea rcx, [rip + 0x860a943]
0x180605835: call 0x18049c210
0x18060583a: mov byte ptr [rip + 0x89953ae], 1
0x180605841: mov rax, qword ptr [rip + 0x852b388]
0x180605848: mov rdx, qword ptr [rax + 0xb8]
0x18060584f: mov rcx, qword ptr [rdx + 0x60]
0x180605853: test rcx, rcx
0x180605856: jne 0x18060586d
0x180605858: mov rdx, qword ptr [rip + 0x860a919]
0x18060585f: lea rcx, [rbx + 0x50]
0x180605863: add rsp, 0x20
0x180605867: pop rbx
0x180605868: jmp 0x1853ae540
0x18060586d: xor r8d, r8d
0x180605870: mov rdx, rbx
0x180605873: add rsp, 0x20
0x180605877: pop rbx
0x180605878: jmp 0x1833b9b90 ; XLua.DelegateBridge.__Gen_Delegate_Imp2695
0x18060587d: int3
0x18060587e: int3
0x18060587f: int3
