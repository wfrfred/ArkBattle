; Torappu.Battle.BattleController.LoadPredefinedData metadata=65640 VA=0x180656f70
0x180656f70: mov qword ptr [rsp + 8], rbx
0x180656f75: push rdi
0x180656f76: sub rsp, 0x20
0x180656f7a: cmp byte ptr [rip + 0x894407a], 0
0x180656f81: mov rbx, rdx
0x180656f84: mov rdi, rcx
0x180656f87: jne 0x180656f9c
0x180656f89: lea rcx, [rip + 0x84b8cb0]
0x180656f90: call 0x18049c210
0x180656f95: mov byte ptr [rip + 0x894405f], 1
0x180656f9c: mov rax, qword ptr [rip + 0x84b8c9d]
0x180656fa3: cmp dword ptr [rax + 0xe0], 0
0x180656faa: jne 0x180656fbb
0x180656fac: mov rcx, rax
0x180656faf: call 0x18049c450
0x180656fb4: mov rax, qword ptr [rip + 0x84b8c85]
0x180656fbb: mov rax, qword ptr [rax + 0xb8]
0x180656fc2: mov rcx, qword ptr [rax + 0x7b8]
0x180656fc9: test rcx, rcx
0x180656fcc: jne 0x180656ffc
0x180656fce: lea rcx, [rdi + 0xf8]
0x180656fd5: mov qword ptr [rdi + 0xf8], rbx
0x180656fdc: mov rdx, rbx
0x180656fdf: call 0x18049bcf0
0x180656fe4: xor r8d, r8d
0x180656fe7: mov rdx, rbx
0x180656fea: mov rcx, rdi
0x180656fed: mov rbx, qword ptr [rsp + 0x30]
0x180656ff2: add rsp, 0x20
0x180656ff6: pop rdi
0x180656ff7: jmp 0x180669b60 ; Torappu.Battle.BattleController._LoadPredefinedData
0x180656ffc: xor r9d, r9d
0x180656fff: mov r8, rbx
0x180657002: mov rdx, rdi
0x180657005: mov rbx, qword ptr [rsp + 0x30]
0x18065700a: add rsp, 0x20
0x18065700e: pop rdi
0x18065700f: jmp 0x18338c7c0 ; XLua.DelegateBridge.__Gen_Delegate_Imp23
0x180657014: int3
0x180657015: int3
0x180657016: int3
0x180657017: int3
0x180657018: int3
0x180657019: int3
0x18065701a: int3
0x18065701b: int3
0x18065701c: int3
0x18065701d: int3
0x18065701e: int3
0x18065701f: int3
