; Torappu.Battle.Buff.OnTick metadata=65146 token=0x600fe7b VA=0x180687830 RVA=0x687830 size=0x2a0
0000000180687830: mov      qword ptr [rsp + 0x10], rdx
0000000180687835: push     rsi
0000000180687836: sub      rsp, 0x30
000000018068783a: cmp      byte ptr [rip + 0x8608abf], 0
0000000180687841: mov      rsi, rcx
0000000180687844: jne      0x180687865
0000000180687846: lea      rcx, [rip + 0x82d4a03] ; TypeInfo Torappu.Battle.Buff @0x18895c250
000000018068784d: call     0x18048bf00
0000000180687852: lea      rcx, [rip + 0x81d2ea7] ; TypeInfo Torappu.FP @0x18885a700
0000000180687859: call     0x18048bf00
000000018068785e: mov      byte ptr [rip + 0x8608a9b], 1
0000000180687865: mov      rax, qword ptr [rip + 0x82d49e4] ; TypeInfo Torappu.Battle.Buff @0x18895c250
000000018068786c: cmp      dword ptr [rax + 0xe0], 0
0000000180687873: jne      0x180687884
0000000180687875: mov      rcx, rax
0000000180687878: call     0x18048c140
000000018068787d: mov      rax, qword ptr [rip + 0x82d49cc] ; TypeInfo Torappu.Battle.Buff @0x18895c250
0000000180687884: mov      rax, qword ptr [rax + 0xb8]
000000018068788b: mov      rcx, qword ptr [rax + 0x310]
0000000180687892: test     rcx, rcx
0000000180687895: jne      0x180687aaf
000000018068789b: xor      edx, edx
000000018068789d: mov      rcx, rsi
00000001806878a0: call     0x18068ee40 ; Torappu.Battle.Buff.get_isFinished [65100]
00000001806878a5: test     al, al
00000001806878a7: jne      0x1806878bb
00000001806878a9: cmp      byte ptr [rsi + 0x1f9], al
00000001806878af: jne      0x1806878bb
00000001806878b1: xor      edx, edx
00000001806878b3: mov      rcx, rsi
00000001806878b6: call     0x1806872e0 ; Torappu.Battle.Buff.OnStart [65143]
00000001806878bb: xor      edx, edx
00000001806878bd: mov      rcx, rsi
00000001806878c0: call     0x18068ee40 ; Torappu.Battle.Buff.get_isFinished [65100]
00000001806878c5: test     al, al
00000001806878c7: jne      0x180687aa9
00000001806878cd: xor      r8d, r8d
00000001806878d0: lea      rdx, [rsp + 0x48]
00000001806878d5: mov      rcx, rsi
00000001806878d8: call     0x18068cff0 ; Torappu.Battle.Buff._PreprocessDeltaTime [65272]
00000001806878dd: cmp      byte ptr [rsi + 0x1f2], 0
00000001806878e4: jne      0x18068790a
00000001806878e6: cmp      byte ptr [rsi + 0x1f3], 0
00000001806878ed: jne      0x18068790a
00000001806878ef: cmp      byte ptr [rsi + 0x1f4], 0
00000001806878f6: jne      0x18068790a
00000001806878f8: cmp      byte ptr [rsi + 0x1f7], 0
00000001806878ff: jne      0x18068790a
0000000180687901: cmp      byte ptr [rsi + 0x1f8], 0
0000000180687908: je       0x180687914
000000018068790a: xor      edx, edx
000000018068790c: mov      rcx, rsi
000000018068790f: call     0x18068dc50 ; Torappu.Battle.Buff._UpdateIsEnabledIfNotFinished [65267]
0000000180687914: mov      qword ptr [rsp + 0x40], rbx
0000000180687919: xor      edx, edx
000000018068791b: mov      rcx, rsi
000000018068791e: mov      qword ptr [rsp + 0x50], rdi
0000000180687923: call     0x18068ed30 ; Torappu.Battle.Buff.get_isEnabled [65098]
0000000180687928: test     al, al
000000018068792a: je       0x1806879bf
0000000180687930: cmp      dword ptr [rsi + 0x98], 0
0000000180687937: je       0x1806879bf
000000018068793d: mov      rcx, qword ptr [rsi + 0xa8]
0000000180687944: test     rcx, rcx
0000000180687947: je       0x180687ac5
000000018068794d: xor      edx, edx
000000018068794f: call     0x181e04d40 ; Torappu.PeriodicTimer.get_isValid [25965]
0000000180687954: test     al, al
0000000180687956: je       0x1806879bf
0000000180687958: mov      rdi, qword ptr [rsi + 0xa8]
000000018068795f: mov      rbx, qword ptr [rsp + 0x48]
0000000180687964: test     rdi, rdi
0000000180687967: je       0x180687ac5
000000018068796d: cmp      byte ptr [rip + 0x8644e7c], 0
0000000180687974: jbe      0x18068797e
0000000180687976: mov      rcx, qword ptr [rdi]
0000000180687979: call     0x180446d00
000000018068797e: mov      r8, qword ptr [rdi]
0000000180687981: mov      rdx, rbx
0000000180687984: mov      rcx, rdi
0000000180687987: mov      rax, qword ptr [r8 + 0x190]
000000018068798e: mov      r8, qword ptr [r8 + 0x198]
0000000180687995: call     rax
0000000180687997: test     al, al
0000000180687999: je       0x1806879bf
000000018068799b: mov      rdx, qword ptr [rsi + 0xa8]
00000001806879a2: test     rdx, rdx
00000001806879a5: je       0x180687ac5
00000001806879ab: mov      ecx, 7
00000001806879b0: call     0x180005610
00000001806879b5: xor      edx, edx
00000001806879b7: mov      rcx, rsi
00000001806879ba: call     0x180687c30 ; Torappu.Battle.Buff.OnTrigger [65145]
00000001806879bf: mov      rcx, qword ptr [rip + 0x81d2d3a] ; TypeInfo Torappu.FP @0x18885a700
00000001806879c6: mov      rbx, qword ptr [rsi + 0x88]
00000001806879cd: cmp      dword ptr [rcx + 0xe0], 0
00000001806879d4: jne      0x1806879db
00000001806879d6: call     0x18048c140
00000001806879db: xor      edx, edx
00000001806879dd: xor      ecx, ecx
00000001806879df: call     0x1866fdac0
00000001806879e4: xor      r8d, r8d
00000001806879e7: mov      rdx, rax
00000001806879ea: mov      rcx, rbx
00000001806879ed: call     0x185ed91b0
00000001806879f2: test     al, al
00000001806879f4: je       0x180687a69
00000001806879f6: mov      rcx, qword ptr [rip + 0x81d2d03] ; TypeInfo Torappu.FP @0x18885a700
00000001806879fd: mov      rbx, qword ptr [rsi + 0x88]
0000000180687a04: mov      rdi, qword ptr [rsp + 0x48]
0000000180687a09: cmp      dword ptr [rcx + 0xe0], 0
0000000180687a10: jne      0x180687a17
0000000180687a12: call     0x18048c140
0000000180687a17: xor      r8d, r8d
0000000180687a1a: mov      rdx, rdi
0000000180687a1d: mov      rcx, rbx
0000000180687a20: call     0x1866fba10
0000000180687a25: xor      edx, edx
0000000180687a27: mov      qword ptr [rsi + 0x88], rax
0000000180687a2e: xor      ecx, ecx
0000000180687a30: mov      rbx, rax
0000000180687a33: call     0x1866fdac0
0000000180687a38: xor      r8d, r8d
0000000180687a3b: mov      rdx, rax
0000000180687a3e: mov      rcx, rbx
0000000180687a41: call     0x185ed91e0
0000000180687a46: test     al, al
0000000180687a48: je       0x180687a69
0000000180687a4a: mov      r9d, 1
0000000180687a50: mov      qword ptr [rsp + 0x20], 0
0000000180687a59: movzx    r8d, r9b
0000000180687a5d: movzx    edx, r9b
0000000180687a61: mov      rcx, rsi
0000000180687a64: call     0x180680fa0 ; Torappu.Battle.Buff.DecStackCntOrMarkFinish [65122]
0000000180687a69: mov      rcx, qword ptr [rip + 0x81d2c90] ; TypeInfo Torappu.FP @0x18885a700
0000000180687a70: mov      rbx, qword ptr [rsi + 0x90]
0000000180687a77: mov      rdi, qword ptr [rsp + 0x48]
0000000180687a7c: cmp      dword ptr [rcx + 0xe0], 0
0000000180687a83: jne      0x180687a8a
0000000180687a85: call     0x18048c140
0000000180687a8a: xor      r8d, r8d
0000000180687a8d: mov      rdx, rdi
0000000180687a90: mov      rcx, rbx
0000000180687a93: call     0x184624db0
0000000180687a98: mov      rbx, qword ptr [rsp + 0x40]
0000000180687a9d: mov      rdi, qword ptr [rsp + 0x50]
0000000180687aa2: mov      qword ptr [rsi + 0x90], rax
0000000180687aa9: add      rsp, 0x30
0000000180687aad: pop      rsi
0000000180687aae: ret      
0000000180687aaf: mov      r8, qword ptr [rsp + 0x48]
0000000180687ab4: xor      r9d, r9d
0000000180687ab7: mov      rdx, rsi
0000000180687aba: call     0x1833f9830 ; XLua.DelegateBridge.__Gen_Delegate_Imp427 [3082]
0000000180687abf: add      rsp, 0x30
0000000180687ac3: pop      rsi
0000000180687ac4: ret      
0000000180687ac5: call     0x18048c0b0
0000000180687aca: int3     
0000000180687acb: int3     
0000000180687acc: int3     
0000000180687acd: int3     
0000000180687ace: int3     
0000000180687acf: int3     