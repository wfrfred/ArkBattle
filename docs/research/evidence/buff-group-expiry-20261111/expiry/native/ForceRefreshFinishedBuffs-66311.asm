0x1806b4500: push rbx
0x1806b4502: sub rsp, 0x20
0x1806b4506: cmp byte ptr [rip + 0x88e6e9e], 0
0x1806b450d: mov rbx, rcx
0x1806b4510: jne 0x1806b4525
0x1806b4512: lea rcx, [rip + 0x85b68a7]
0x1806b4519: call 0x18049c210
0x1806b451e: mov byte ptr [rip + 0x88e6e86], 1
0x1806b4525: mov rax, qword ptr [rip + 0x85b6894]
0x1806b452c: mov rdx, qword ptr [rax + 0xb8]
0x1806b4533: mov rcx, qword ptr [rdx + 0x90]
0x1806b453a: test rcx, rcx
0x1806b453d: jne 0x1806b454e
0x1806b453f: xor edx, edx
0x1806b4541: mov rcx, rbx
0x1806b4544: add rsp, 0x20
0x1806b4548: pop rbx
0x1806b4549: jmp 0x1806cc320 ; Torappu.Battle.Buff/BuffContainer._CheckFinishedBuffs
0x1806b454e: xor r8d, r8d
0x1806b4551: mov rdx, rbx
0x1806b4554: add rsp, 0x20
0x1806b4558: pop rbx
0x1806b4559: jmp 0x1833c9ac0 ; XLua.DelegateBridge.__Gen_Delegate_Imp27
0x1806b455e: int3
0x1806b455f: int3
