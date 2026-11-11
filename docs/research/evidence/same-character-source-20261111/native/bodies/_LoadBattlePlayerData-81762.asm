0x180c03010: mov qword ptr [rsp + 8], rbx
0x180c03015: push rsi
0x180c03016: push rdi
0x180c03017: push r14
0x180c03019: sub rsp, 0x60
0x180c0301d: mov rsi, rcx
0x180c03020: cmp byte ptr [rip + 0x839b549], 0
0x180c03027: jne 0x180c030a8
0x180c03029: lea rcx, [rip + 0x8026868]
0x180c03030: call 0x18049c210
0x180c03035: lea rcx, [rip + 0x7f18de4]
0x180c0303c: call 0x18049c210
0x180c03041: lea rcx, [rip + 0x7fc04e0]
0x180c03048: call 0x18049c210
0x180c0304d: lea rcx, [rip + 0x8065784]
0x180c03054: call 0x18049c210
0x180c03059: lea rcx, [rip + 0x80659c0]
0x180c03060: call 0x18049c210
0x180c03065: lea rcx, [rip + 0x8065bfc]
0x180c0306c: call 0x18049c210
0x180c03071: lea rcx, [rip + 0x8064460]
0x180c03078: call 0x18049c210
0x180c0307d: lea rcx, [rip + 0x7f4e75c]
0x180c03084: call 0x18049c210
0x180c03089: lea rcx, [rip + 0x7f1c180]
0x180c03090: call 0x18049c210
0x180c03095: lea rcx, [rip + 0x7f1c3bc]
0x180c0309c: call 0x18049c210
0x180c030a1: mov byte ptr [rip + 0x839b4c8], 1
0x180c030a8: xor ebx, ebx
0x180c030aa: mov qword ptr [rsp + 0x90], rbx
0x180c030b2: mov qword ptr [rsp + 0x98], rbx
0x180c030ba: mov rax, qword ptr [rip + 0x80267d7]
0x180c030c1: cmp dword ptr [rax + 0xe0], ebx
0x180c030c7: jne 0x180c030d8
0x180c030c9: mov rcx, rax
0x180c030cc: call 0x18049c450
0x180c030d1: mov rax, qword ptr [rip + 0x80267c0]
0x180c030d8: mov rax, qword ptr [rax + 0xb8]
0x180c030df: mov rcx, qword ptr [rax + 0xe8]
0x180c030e6: test rcx, rcx
0x180c030e9: jne 0x180c032ad
0x180c030ef: mov rcx, qword ptr [rsi + 0x48]
0x180c030f3: test rcx, rcx
0x180c030f6: je 0x180c032e5
0x180c030fc: inc dword ptr [rcx + 0x1c]
0x180c030ff: mov r8d, dword ptr [rcx + 0x18]
0x180c03103: mov dword ptr [rcx + 0x18], ebx
0x180c03106: test r8d, r8d
0x180c03109: jle 0x180c03119
0x180c0310b: xor r9d, r9d
0x180c0310e: xor edx, edx
0x180c03110: mov rcx, qword ptr [rcx + 0x10]
0x180c03114: call 0x186149e10 ; System.Array.Clear
0x180c03119: mov rcx, qword ptr [rsi + 0x48]
0x180c0311d: test rcx, rcx
0x180c03120: je 0x180c032e5
0x180c03126: mov r8, qword ptr [rip + 0x7f1c0e3]
0x180c0312d: mov rdx, qword ptr [rsi + 0xb0]
0x180c03134: call 0x1805182d0
0x180c03139: mov rdx, qword ptr [rsi + 0xa0]
0x180c03140: test rdx, rdx
0x180c03143: je 0x180c032e5
0x180c03149: mov r8, qword ptr [rip + 0x8064388]
0x180c03150: lea rcx, [rsp + 0x28]
0x180c03155: call 0x184b54de0
0x180c0315a: movups xmm0, xmmword ptr [rsp + 0x28]
0x180c0315f: movups xmmword ptr [rsp + 0x40], xmm0
0x180c03164: movsd xmm1, qword ptr [rsp + 0x38]
0x180c0316a: movsd qword ptr [rsp + 0x50], xmm1
0x180c03170: mov qword ptr [rsp + 0x28], rbx
0x180c03175: lea rbx, [rsp + 0x40]
0x180c0317a: mov qword ptr [rsp + 0x30], rbx
0x180c0317f: nop
0x180c03180: mov rdx, qword ptr [rip + 0x8065899]
0x180c03187: lea rcx, [rsp + 0x40]
0x180c0318c: call 0x185cc1470
0x180c03191: test al, al
0x180c03193: je 0x180c0327f
0x180c03199: mov r14d, dword ptr [rsp + 0x50]
0x180c0319e: mov rcx, qword ptr [rsi + 0xb8]
0x180c031a5: test rcx, rcx
0x180c031a8: je 0x180c032d9
0x180c031ae: mov r9, qword ptr [rip + 0x7f4e62b]
0x180c031b5: lea r8, [rsp + 0x90]
0x180c031bd: mov edx, r14d
0x180c031c0: call 0x184cb20a0
0x180c031c5: test al, al
0x180c031c7: je 0x180c03180
0x180c031c9: mov rcx, qword ptr [rsi + 0xc0]
0x180c031d0: test rcx, rcx
0x180c031d3: je 0x180c032d4
0x180c031d9: mov r9, qword ptr [rip + 0x7f4e600]
0x180c031e0: lea r8, [rsp + 0x98]
0x180c031e8: mov edx, r14d
0x180c031eb: call 0x184cb20a0
0x180c031f0: test al, al
0x180c031f2: je 0x180c03180
0x180c031f4: mov rcx, qword ptr [rip + 0x7f18c25]
0x180c031fb: call 0x18046d2f0
0x180c03200: mov rdi, rax
0x180c03203: test rax, rax
0x180c03206: je 0x180c032cf
0x180c0320c: xor edx, edx
0x180c0320e: mov rcx, rax
0x180c03211: call 0x180b2d250 ; Torappu.Battle.BattlePlayerData..ctor
0x180c03216: mov dword ptr [rdi + 0x10], r14d
0x180c0321a: mov rdx, qword ptr [rip + 0x7fc0307]
0x180c03221: mov rcx, qword ptr [rsp + 0x90]
0x180c03229: call 0x18469b910
0x180c0322e: mov qword ptr [rdi + 0x18], rax
0x180c03232: lea rcx, [rdi + 0x18]
0x180c03236: mov rdx, rax
0x180c03239: call 0x18049bcf0
0x180c0323e: mov rdx, qword ptr [rip + 0x7fc02e3]
0x180c03245: mov rcx, qword ptr [rsp + 0x98]
0x180c0324d: call 0x18469b910
0x180c03252: mov qword ptr [rdi + 0x20], rax
0x180c03256: lea rcx, [rdi + 0x20]
0x180c0325a: mov rdx, rax
0x180c0325d: call 0x18049bcf0
0x180c03262: mov rcx, qword ptr [rsi + 0x48]
0x180c03266: test rcx, rcx
0x180c03269: je 0x180c032c9
0x180c0326b: mov r8, qword ptr [rip + 0x7f1bf9e]
0x180c03272: mov rdx, rdi
0x180c03275: call 0x1805182d0
0x180c0327a: jmp 0x180c03180
0x180c0327f: mov rdx, qword ptr [rip + 0x8065552]
0x180c03286: mov rcx, rbx
0x180c03289: call 0x18051df60 ; BattleTimer.EventOnEntryClick | BattleTimer.EventOnTimerPlayNPause | BattleTimer.EventOnTimerRecord | BattleTimer.EventOnTimerReset
0x180c0328e: jmp 0x180c032b8
0x180c03290: mov rdx, qword ptr [rip + 0x8065541]
0x180c03297: mov rcx, qword ptr [rsp + 0x30]
0x180c0329c: call 0x18051df60 ; BattleTimer.EventOnEntryClick | BattleTimer.EventOnTimerPlayNPause | BattleTimer.EventOnTimerRecord | BattleTimer.EventOnTimerReset
0x180c032a1: mov rcx, qword ptr [rsp + 0x28]
0x180c032a6: test rcx, rcx
0x180c032a9: jne 0x180c032df
0x180c032ab: jmp 0x180c032b8
0x180c032ad: xor r8d, r8d
0x180c032b0: mov rdx, rsi
0x180c032b3: call 0x1833c9ac0 ; XLua.DelegateBridge.__Gen_Delegate_Imp27
0x180c032b8: mov rbx, qword ptr [rsp + 0x80]
0x180c032c0: add rsp, 0x60
0x180c032c4: pop r14
0x180c032c6: pop rdi
0x180c032c7: pop rsi
0x180c032c8: ret
0x180c032c9: call 0x18049c3c0
0x180c032ce: nop
0x180c032cf: call 0x18049c3c0
0x180c032d4: call 0x18049c3c0
0x180c032d9: call 0x18049c3c0
0x180c032de: nop
0x180c032df: call 0x180483060
0x180c032e4: int3
0x180c032e5: call 0x18049c3c0
0x180c032ea: int3
0x180c032eb: int3
0x180c032ec: int3
0x180c032ed: int3
0x180c032ee: int3
0x180c032ef: int3
