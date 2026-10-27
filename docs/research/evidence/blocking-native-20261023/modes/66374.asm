; Torappu.Battle.Entity.get_changeableMotionMode metadata=66374 token=0x6010347 VA=0x180702940 RVA=0x702940 size=0x1a0
0000000180702940: push     rbx
0000000180702942: sub      rsp, 0x20
0000000180702946: cmp      byte ptr [rip + 0x858dea0], 0
000000018070294d: mov      rbx, rcx
0000000180702950: jne      0x180702965
0000000180702952: lea      rcx, [rip + 0x813ea0f] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180702959: call     0x18048bf00
000000018070295e: mov      byte ptr [rip + 0x858de88], 1
0000000180702965: mov      rcx, qword ptr [rip + 0x813e9fc] ; TypeInfo Torappu.Battle.Entity @0x188841368
000000018070296c: cmp      dword ptr [rcx + 0xe0], 0
0000000180702973: jne      0x180702981
0000000180702975: call     0x18048c140
000000018070297a: mov      rcx, qword ptr [rip + 0x813e9e7] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180702981: mov      rax, qword ptr [rcx + 0xb8]
0000000180702988: mov      r9, qword ptr [rax + 0x100]
000000018070298f: test     r9, r9
0000000180702992: jne      0x180702acc
0000000180702998: cmp      byte ptr [rip + 0x858deb5], r9b
000000018070299f: jne      0x1807029bb
00000001807029a1: lea      rcx, [rip + 0x813e9c0] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001807029a8: call     0x18048bf00
00000001807029ad: mov      rcx, qword ptr [rip + 0x813e9b4] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001807029b4: mov      byte ptr [rip + 0x858de99], 1
00000001807029bb: cmp      dword ptr [rcx + 0xe0], 0
00000001807029c2: jne      0x1807029d0
00000001807029c4: call     0x18048c140
00000001807029c9: mov      rcx, qword ptr [rip + 0x813e998] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001807029d0: mov      rax, qword ptr [rcx + 0xb8]
00000001807029d7: mov      rcx, qword ptr [rax + 0x438]
00000001807029de: test     rcx, rcx
00000001807029e1: jne      0x180702a12
00000001807029e3: xor      edx, edx
00000001807029e5: mov      rcx, rbx
00000001807029e8: call     0x180705bf0 ; Torappu.Battle.Entity.get_isGroundBound [66491]
00000001807029ed: test     al, al
00000001807029ef: je       0x180702a29
00000001807029f1: xor      edx, edx
00000001807029f3: mov      rcx, rbx
00000001807029f6: call     0x1807060c0 ; Torappu.Battle.Entity.get_isLevitate [66490]
00000001807029fb: test     al, al
00000001807029fd: je       0x180702a21
00000001807029ff: mov      rax, qword ptr [rbx + 0xa8]
0000000180702a06: cmp      qword ptr [rbx + 0xa0], rax
0000000180702a0d: setg     al
0000000180702a10: jmp      0x180702a1d
0000000180702a12: xor      r8d, r8d
0000000180702a15: mov      rdx, rbx
0000000180702a18: call     0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
0000000180702a1d: test     al, al
0000000180702a1f: je       0x180702a29
0000000180702a21: xor      eax, eax
0000000180702a23: add      rsp, 0x20
0000000180702a27: pop      rbx
0000000180702a28: ret      
0000000180702a29: cmp      byte ptr [rip + 0x858de25], 0
0000000180702a30: jne      0x180702a45
0000000180702a32: lea      rcx, [rip + 0x813e92f] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180702a39: call     0x18048bf00
0000000180702a3e: mov      byte ptr [rip + 0x858de10], 1
0000000180702a45: mov      rax, qword ptr [rip + 0x813e91c] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180702a4c: cmp      dword ptr [rax + 0xe0], 0
0000000180702a53: jne      0x180702a64
0000000180702a55: mov      rcx, rax
0000000180702a58: call     0x18048c140
0000000180702a5d: mov      rax, qword ptr [rip + 0x813e904] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180702a64: mov      rax, qword ptr [rax + 0xb8]
0000000180702a6b: mov      rcx, qword ptr [rax + 0x440]
0000000180702a72: test     rcx, rcx
0000000180702a75: jne      0x180702aa6
0000000180702a77: xor      edx, edx
0000000180702a79: mov      rcx, rbx
0000000180702a7c: call     0x1807060c0 ; Torappu.Battle.Entity.get_isLevitate [66490]
0000000180702a81: test     al, al
0000000180702a83: je       0x180702ac0
0000000180702a85: xor      edx, edx
0000000180702a87: mov      rcx, rbx
0000000180702a8a: call     0x180705bf0 ; Torappu.Battle.Entity.get_isGroundBound [66491]
0000000180702a8f: test     al, al
0000000180702a91: je       0x180702ab5
0000000180702a93: mov      rax, qword ptr [rbx + 0xa0]
0000000180702a9a: cmp      qword ptr [rbx + 0xa8], rax
0000000180702aa1: setg     al
0000000180702aa4: jmp      0x180702ab1
0000000180702aa6: xor      r8d, r8d
0000000180702aa9: mov      rdx, rbx
0000000180702aac: call     0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
0000000180702ab1: test     al, al
0000000180702ab3: je       0x180702ac0
0000000180702ab5: mov      eax, 1
0000000180702aba: add      rsp, 0x20
0000000180702abe: pop      rbx
0000000180702abf: ret      
0000000180702ac0: mov      eax, dword ptr [rbx + 0x94]
0000000180702ac6: add      rsp, 0x20
0000000180702aca: pop      rbx
0000000180702acb: ret      
0000000180702acc: xor      r8d, r8d
0000000180702acf: mov      rdx, rbx
0000000180702ad2: mov      rcx, r9
0000000180702ad5: add      rsp, 0x20
0000000180702ad9: pop      rbx
0000000180702ada: jmp      0x183333df0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3027 [5682]
0000000180702adf: int3     