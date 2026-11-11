0x180b787e0: mov qword ptr [rsp + 0x10], rbx
0x180b787e5: mov qword ptr [rsp + 0x18], rbp
0x180b787ea: mov qword ptr [rsp + 0x20], rsi
0x180b787ef: push rdi
0x180b787f0: sub rsp, 0x40
0x180b787f4: cmp byte ptr [rip + 0x84258b4], 0
0x180b787fb: mov rbx, r8
0x180b787fe: mov esi, edx
0x180b78800: mov rdi, rcx
0x180b78803: jne 0x180b78848
0x180b78805: lea rcx, [rip + 0x80cca0c]
0x180b7880c: call 0x18049c210
0x180b78811: lea rcx, [rip + 0x807f6d8]
0x180b78818: call 0x18049c210
0x180b7881d: lea rcx, [rip + 0x800c92c]
0x180b78824: call 0x18049c210
0x180b78829: lea rcx, [rip + 0x7fb89f0]
0x180b78830: call 0x18049c210
0x180b78835: lea rcx, [rip + 0x7fc3e14]
0x180b7883c: call 0x18049c210
0x180b78841: mov byte ptr [rip + 0x8425867], 1
0x180b78848: mov rax, qword ptr [rip + 0x80cc9c9]
0x180b7884f: xor ebp, ebp
0x180b78851: mov qword ptr [rsp + 0x30], rbp
0x180b78856: mov rcx, qword ptr [rax + 0xb8]
0x180b7885d: mov rcx, qword ptr [rcx + 0x180]
0x180b78864: test rcx, rcx
0x180b78867: jne 0x180b78a03
0x180b7886d: mov qword ptr [rsp + 0x50], r14
0x180b78872: cmp esi, 1
0x180b78875: jne 0x180b789ff
0x180b7887b: mov rdx, qword ptr [rip + 0x807f66e]
0x180b78882: mov rcx, rbx
0x180b78885: call 0x184699180
0x180b7888a: cmp eax, 2
0x180b7888d: jl 0x180b789ff
0x180b78893: mov r9, qword ptr [rip + 0x800c8b6]
0x180b7889a: xor r8d, r8d
0x180b7889d: xor edx, edx
0x180b7889f: mov rcx, rbx
0x180b788a2: call 0x184699b90
0x180b788a7: test eax, eax
0x180b788a9: jne 0x180b789ff
0x180b788af: mov r9, qword ptr [rip + 0x800c89a]
0x180b788b6: xor r8d, r8d
0x180b788b9: mov edx, esi
0x180b788bb: mov rcx, rbx
0x180b788be: call 0x184699b90
0x180b788c3: xor r8d, r8d
0x180b788c6: xor edx, edx
0x180b788c8: mov ecx, eax
0x180b788ca: call 0x180c1f5c0 ; Torappu.Battle.AutoChess.AutoChessBattleUtil.GetChessInst
0x180b788cf: mov rbx, rax
0x180b788d2: test rax, rax
0x180b788d5: je 0x180b789ff
0x180b788db: mov rcx, qword ptr [rdi + 0x18]
0x180b788df: test rcx, rcx
0x180b788e2: je 0x180b78a18
0x180b788e8: mov rdx, qword ptr [rcx + 0x70]
0x180b788ec: test rdx, rdx
0x180b788ef: je 0x180b78a18
0x180b788f5: mov rcx, qword ptr [rdx + 0x10]
0x180b788f9: test rcx, rcx
0x180b788fc: je 0x180b78a18
0x180b78902: mov r9, qword ptr [rip + 0x7fb8917]
0x180b78909: lea r8, [rsp + 0x30]
0x180b7890e: mov edx, dword ptr [rdi + 0x40]
0x180b78911: call 0x184cb20a0
0x180b78916: test al, al
0x180b78918: je 0x180b789ff
0x180b7891e: mov rdx, qword ptr [rsp + 0x30]
0x180b78923: test rdx, rdx
0x180b78926: je 0x180b78a18
0x180b7892c: mov r8, qword ptr [rbx + 0x18]
0x180b78930: xor r9d, r9d
0x180b78933: mov rdx, qword ptr [rdx + 0x28]
0x180b78937: mov rcx, rdi
0x180b7893a: call 0x180b77b10 ; Torappu.Battle.AutoChess.AutoChessDataBridgeLocalPlayer._AddOwnedChess
0x180b7893f: mov ecx, dword ptr [rbx + 0x10]
0x180b78942: xor edx, edx
0x180b78944: mov r14d, eax
0x180b78947: call 0x180c203b0 ; Torappu.Battle.AutoChess.AutoChessBattleUtil.GetEquipInstIds
0x180b7894c: mov rdx, qword ptr [rip + 0x807f59d]
0x180b78953: mov rcx, rax
0x180b78956: mov rbx, rax
0x180b78959: call 0x184699180
0x180b7895e: test eax, eax
0x180b78960: jle 0x180b789cd
0x180b78962: mov rcx, qword ptr [rsp + 0x30]
0x180b78967: test rcx, rcx
0x180b7896a: je 0x180b78a18
0x180b78970: mov rsi, qword ptr [rcx + 0x28]
0x180b78974: test rbx, rbx
0x180b78977: je 0x180b78a18
0x180b7897d: mov r8, qword ptr [rip + 0x7fc3ccc]
0x180b78984: mov edx, ebp
0x180b78986: mov rcx, rbx
0x180b78989: call 0x184e76f40
0x180b7898e: xor edx, edx
0x180b78990: mov ecx, eax
0x180b78992: call 0x180c1f320 ; Torappu.Battle.AutoChess.AutoChessBattleUtil.GetChessId
0x180b78997: xor r9d, r9d
0x180b7899a: mov r8, rax
0x180b7899d: mov rdx, rsi
0x180b789a0: mov rcx, rdi
0x180b789a3: call 0x180b77b10 ; Torappu.Battle.AutoChess.AutoChessDataBridgeLocalPlayer._AddOwnedChess
0x180b789a8: xor r9d, r9d
0x180b789ab: mov r8d, r14d
0x180b789ae: mov edx, eax
0x180b789b0: mov rcx, rdi
0x180b789b3: call 0x180b78a20 ; Torappu.Battle.AutoChess.AutoChessDataBridgeLocalPlayer._EquipItem
0x180b789b8: mov rdx, qword ptr [rip + 0x807f531]
0x180b789bf: mov rcx, rbx
0x180b789c2: inc ebp
0x180b789c4: call 0x184699180
0x180b789c9: cmp ebp, eax
0x180b789cb: jl 0x180b78962
0x180b789cd: mov rcx, qword ptr [rsp + 0x30]
0x180b789d2: test rcx, rcx
0x180b789d5: je 0x180b78a18
0x180b789d7: mov rcx, qword ptr [rcx + 0x50]
0x180b789db: test rcx, rcx
0x180b789de: je 0x180b78a18
0x180b789e0: inc dword ptr [rcx + 0x20]
0x180b789e3: mov al, 1
0x180b789e5: mov r14, qword ptr [rsp + 0x50]
0x180b789ea: mov rbx, qword ptr [rsp + 0x58]
0x180b789ef: mov rbp, qword ptr [rsp + 0x60]
0x180b789f4: mov rsi, qword ptr [rsp + 0x68]
0x180b789f9: add rsp, 0x40
0x180b789fd: pop rdi
0x180b789fe: ret
0x180b789ff: xor al, al
0x180b78a01: jmp 0x180b789e5
0x180b78a03: mov r9, rbx
0x180b78a06: mov qword ptr [rsp + 0x20], rbp
0x180b78a0b: mov r8d, esi
0x180b78a0e: mov rdx, rdi
0x180b78a11: call 0x18347d410 ; XLua.DelegateBridge.__Gen_Delegate_Imp3938
0x180b78a16: jmp 0x180b789ea
0x180b78a18: call 0x18049c3c0
0x180b78a1d: int3
0x180b78a1e: int3
0x180b78a1f: int3
