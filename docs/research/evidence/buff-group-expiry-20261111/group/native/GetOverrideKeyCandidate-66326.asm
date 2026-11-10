0x1806b6150: mov qword ptr [rsp + 8], rbx
0x1806b6155: mov qword ptr [rsp + 0x18], rsi
0x1806b615a: mov qword ptr [rsp + 0x10], rdx
0x1806b615f: push rdi
0x1806b6160: sub rsp, 0x60
0x1806b6164: mov rsi, rdx
0x1806b6167: mov rbx, rcx
0x1806b616a: cmp byte ptr [rip + 0x88e5249], 0
0x1806b6171: jne 0x1806b61c2
0x1806b6173: lea rcx, [rip + 0x85b4c46]
0x1806b617a: call 0x18049c210
0x1806b617f: lea rcx, [rip + 0x859b342]
0x1806b6186: call 0x18049c210
0x1806b618b: lea rcx, [rip + 0x84e07b6]
0x1806b6192: call 0x18049c210
0x1806b6197: lea rcx, [rip + 0x84e09f2]
0x1806b619e: call 0x18049c210
0x1806b61a3: lea rcx, [rip + 0x84e0c36]
0x1806b61aa: call 0x18049c210
0x1806b61af: lea rcx, [rip + 0x847845a]
0x1806b61b6: call 0x18049c210
0x1806b61bb: mov byte ptr [rip + 0x88e51f8], 1
0x1806b61c2: mov rax, qword ptr [rip + 0x85b4bf7]
0x1806b61c9: mov rcx, qword ptr [rax + 0xb8]
0x1806b61d0: mov rcx, qword ptr [rcx + 0x108]
0x1806b61d7: test rcx, rcx
0x1806b61da: jne 0x1806b62e1
0x1806b61e0: mov rcx, qword ptr [rbx + 0x20]
0x1806b61e4: test rcx, rcx
0x1806b61e7: je 0x1806b630e
0x1806b61ed: mov rdx, qword ptr [rip + 0x859b2d4]
0x1806b61f4: call 0x1859c6710
0x1806b61f9: test rax, rax
0x1806b61fc: je 0x1806b630e
0x1806b6202: mov r8, qword ptr [rip + 0x8478407]
0x1806b6209: mov rdx, rax
0x1806b620c: lea rcx, [rsp + 0x28]
0x1806b6211: call 0x184c31a80
0x1806b6216: movups xmm0, xmmword ptr [rsp + 0x28]
0x1806b621b: movups xmmword ptr [rsp + 0x40], xmm0
0x1806b6220: movsd xmm1, qword ptr [rsp + 0x38]
0x1806b6226: movsd qword ptr [rsp + 0x50], xmm1
0x1806b622c: mov qword ptr [rsp + 0x28], 0
0x1806b6235: lea rbx, [rsp + 0x40]
0x1806b623a: mov qword ptr [rsp + 0x30], rbx
0x1806b623f: nop
0x1806b6240: mov rdx, qword ptr [rip + 0x84e0949]
0x1806b6247: lea rcx, [rsp + 0x40]
0x1806b624c: call 0x1848e8240
0x1806b6251: test al, al
0x1806b6253: je 0x1806b629a
0x1806b6255: mov rdi, qword ptr [rsp + 0x50]
0x1806b625a: test rdi, rdi
0x1806b625d: je 0x1806b6302
0x1806b6263: xor r8d, r8d
0x1806b6266: mov rdx, rsi
0x1806b6269: mov rcx, rdi
0x1806b626c: call 0x18601f3b0 ; System.String.StartsWith
0x1806b6271: test al, al
0x1806b6273: je 0x1806b6240
0x1806b6275: mov rdx, qword ptr [rip + 0x84e06cc]
0x1806b627c: mov rcx, rbx
0x1806b627f: call 0x18051df60 ; BattleTimer.EventOnEntryClick | BattleTimer.EventOnTimerPlayNPause | BattleTimer.EventOnTimerRecord | BattleTimer.EventOnTimerReset
0x1806b6284: mov rax, rdi
0x1806b6287: mov rbx, qword ptr [rsp + 0x70]
0x1806b628c: mov rsi, qword ptr [rsp + 0x80]
0x1806b6294: add rsp, 0x60
0x1806b6298: pop rdi
0x1806b6299: ret
0x1806b629a: mov rdx, qword ptr [rip + 0x84e06a7]
0x1806b62a1: mov rcx, rbx
0x1806b62a4: call 0x18051df60 ; BattleTimer.EventOnEntryClick | BattleTimer.EventOnTimerPlayNPause | BattleTimer.EventOnTimerRecord | BattleTimer.EventOnTimerReset
0x1806b62a9: jmp 0x1806b62cb
0x1806b62ab: mov rdx, qword ptr [rip + 0x84e0696]
0x1806b62b2: mov rcx, qword ptr [rsp + 0x30]
0x1806b62b7: call 0x18051df60 ; BattleTimer.EventOnEntryClick | BattleTimer.EventOnTimerPlayNPause | BattleTimer.EventOnTimerRecord | BattleTimer.EventOnTimerReset
0x1806b62bc: mov rcx, qword ptr [rsp + 0x28]
0x1806b62c1: test rcx, rcx
0x1806b62c4: jne 0x1806b6308
0x1806b62c6: mov rsi, qword ptr [rsp + 0x78]
0x1806b62cb: mov rax, rsi
0x1806b62ce: mov rbx, qword ptr [rsp + 0x70]
0x1806b62d3: mov rsi, qword ptr [rsp + 0x80]
0x1806b62db: add rsp, 0x60
0x1806b62df: pop rdi
0x1806b62e0: ret
0x1806b62e1: xor r9d, r9d
0x1806b62e4: mov r8, rsi
0x1806b62e7: mov rdx, rbx
0x1806b62ea: call 0x183633560 ; XLua.DelegateBridge.__Gen_Delegate_Imp67
0x1806b62ef: mov rbx, qword ptr [rsp + 0x70]
0x1806b62f4: mov rsi, qword ptr [rsp + 0x80]
0x1806b62fc: add rsp, 0x60
0x1806b6300: pop rdi
0x1806b6301: ret
0x1806b6302: call 0x18049c3c0
0x1806b6307: nop
0x1806b6308: call 0x180483060
0x1806b630d: int3
0x1806b630e: call 0x18049c3c0
0x1806b6313: int3
0x1806b6314: int3
0x1806b6315: int3
0x1806b6316: int3
0x1806b6317: int3
0x1806b6318: int3
0x1806b6319: int3
0x1806b631a: int3
0x1806b631b: int3
0x1806b631c: int3
0x1806b631d: int3
0x1806b631e: int3
0x1806b631f: int3
