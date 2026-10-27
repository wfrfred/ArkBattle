; Torappu.Battle.DirectionCursor._GetNextTarget metadata=70275 token=0x6011284 VA=0x180897700 RVA=0x897700 size=0x620
0000000180897700: push     rsi
0000000180897702: sub      rsp, 0x40
0000000180897706: cmp      byte ptr [rip + 0x83f9dd5], 0
000000018089770d: mov      rsi, rcx
0000000180897710: jne      0x180897755
0000000180897712: lea      rcx, [rip + 0x80d59df] ; TypeInfo Torappu.Battle.DirectionCursor @0x18896d0f8
0000000180897719: call     0x18048bf00
000000018089771e: lea      rcx, [rip + 0x802d863] ; TypeInfo Torappu.GridPosition @0x1888c4f88
0000000180897725: call     0x18048bf00
000000018089772a: lea      rcx, [rip + 0x802c507] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180897731: call     0x18048bf00
0000000180897736: lea      rcx, [rip + 0x80215fb] ; TypeInfo Torappu.Battle.BasicCursor.MoveCheckpoint @0x1888b8d38
000000018089773d: call     0x18048bf00
0000000180897742: lea      rcx, [rip + 0x80489ff] ; GenericMethodInfo 282061 @0x1888e0148
0000000180897749: call     0x18048bf00
000000018089774e: mov      byte ptr [rip + 0x83f9d8d], 1
0000000180897755: mov      rax, qword ptr [rip + 0x80d599c] ; TypeInfo Torappu.Battle.DirectionCursor @0x18896d0f8
000000018089775c: mov      rcx, qword ptr [rax + 0xb8]
0000000180897763: mov      rcx, qword ptr [rcx + 0x70]
0000000180897767: test     rcx, rcx
000000018089776a: jne      0x180897d02
0000000180897770: movaps   xmmword ptr [rsp + 0x30], xmm6
0000000180897775: xor      edx, edx
0000000180897777: mov      rcx, rsi
000000018089777a: call     0x180894ed0 ; Torappu.Battle.DirectionCursor.GetLocatorPosition [70291]
000000018089777f: mov      rcx, qword ptr [rip + 0x802d802] ; TypeInfo Torappu.GridPosition @0x1888c4f88
0000000180897786: movq     xmm6, rax
000000018089778b: cmp      dword ptr [rcx + 0xe0], 0
0000000180897792: movsd    qword ptr [rsp + 0x68], xmm6
0000000180897798: jne      0x18089779f
000000018089779a: call     0x18048c140
000000018089779f: mov      qword ptr [rsp + 0x50], rbx
00000001808977a4: xor      edx, edx
00000001808977a6: mov      qword ptr [rsp + 0x58], rdi
00000001808977ab: movq     rcx, xmm6
00000001808977b0: movaps   xmmword ptr [rsp + 0x20], xmm7
00000001808977b5: call     0x182103900 ; Torappu.GridPosition.FromVectorPosition [28047]
00000001808977ba: mov      rcx, qword ptr [rsi + 0x10]
00000001808977be: mov      qword ptr [rsp + 0x60], rax
00000001808977c3: test     rcx, rcx
00000001808977c6: je       0x180897d13
00000001808977cc: mov      rcx, qword ptr [rcx + 0x10]
00000001808977d0: test     rcx, rcx
00000001808977d3: je       0x180897d13
00000001808977d9: xor      r8d, r8d
00000001808977dc: mov      rdx, rax
00000001808977df: call     0x18087a3a0 ; Torappu.Battle.Map.CheckGridValid [70066]
00000001808977e4: test     al, al
00000001808977e6: je       0x180897cb7
00000001808977ec: xor      edx, edx
00000001808977ee: mov      rcx, rsi
00000001808977f1: call     0x180877530 ; Torappu.Battle.BasicCursor.get_visitEveryTileCenter [70146]
00000001808977f6: test     al, al
00000001808977f8: jne      0x180897af2
00000001808977fe: xor      edx, edx
0000000180897800: mov      rcx, rsi
0000000180897803: call     0x180877470 ; Torappu.Battle.BasicCursor.get_visitEveryNodeCenter [70148]
0000000180897808: test     al, al
000000018089780a: jne      0x180897995
0000000180897810: xor      edx, edx
0000000180897812: mov      rcx, rsi
0000000180897815: call     0x1808774d0 ; Torappu.Battle.BasicCursor.get_visitEveryNodeStably [70156]
000000018089781a: test     al, al
000000018089781c: je       0x18089791a
0000000180897822: mov      rcx, qword ptr [rip + 0x802d75f] ; TypeInfo Torappu.GridPosition @0x1888c4f88
0000000180897829: mov      rbx, qword ptr [rsp + 0x60]
000000018089782e: mov      rdi, qword ptr [rsi + 0x70]
0000000180897832: cmp      dword ptr [rcx + 0xe0], 0
0000000180897839: jne      0x180897840
000000018089783b: call     0x18048c140
0000000180897840: xor      r8d, r8d
0000000180897843: mov      rdx, rdi
0000000180897846: mov      rcx, rbx
0000000180897849: call     0x182104110 ; Torappu.GridPosition.op_Inequality [28052]
000000018089784e: test     al, al
0000000180897850: je       0x180897866
0000000180897852: mov      rdx, qword ptr [rsp + 0x60]
0000000180897857: xor      r8d, r8d
000000018089785a: mov      rcx, rsi
000000018089785d: call     0x180897510 ; Torappu.Battle.DirectionCursor._GetNextGrid [70290]
0000000180897862: mov      qword ptr [rsi + 0x70], rax
0000000180897866: mov      rcx, qword ptr [rip + 0x80488db] ; GenericMethodInfo 282061 @0x1888e0148
000000018089786d: call     0x185337c50
0000000180897872: mov      rcx, qword ptr [rsi + 0x10]
0000000180897876: test     rcx, rcx
0000000180897879: je       0x180897d13
000000018089787f: mov      rdx, qword ptr [rcx + 0x18]
0000000180897883: test     rdx, rdx
0000000180897886: je       0x180897d13
000000018089788c: test     rax, rax
000000018089788f: je       0x180897d13
0000000180897895: mov      r8, qword ptr [rsi + 0x70]
0000000180897899: xor      r9d, r9d
000000018089789c: mov      edx, dword ptr [rdx + 0x10]
000000018089789f: mov      rcx, rax
00000001808978a2: call     0x18087a650 ; Torappu.Battle.Map.CheckPassable [70011]
00000001808978a7: test     al, al
00000001808978a9: je       0x18089791a
00000001808978ab: mov      rcx, qword ptr [rip + 0x802d6d6] ; TypeInfo Torappu.GridPosition @0x1888c4f88
00000001808978b2: cmp      dword ptr [rcx + 0xe0], 0
00000001808978b9: jne      0x1808978c0
00000001808978bb: call     0x18048c140
00000001808978c0: lea      rcx, [rsi + 0x70]
00000001808978c4: xor      edx, edx
00000001808978c6: call     0x182104010 ; Torappu.GridPosition.get_asLocalPosition [28039]
00000001808978cb: mov      rcx, qword ptr [rip + 0x802c366] ; TypeInfo Torappu.MathUtil @0x1888c3c38
00000001808978d2: movq     xmm7, rax
00000001808978d7: cmp      dword ptr [rcx + 0xe0], 0
00000001808978de: jne      0x1808978e5
00000001808978e0: call     0x18048c140
00000001808978e5: movss    xmm2, dword ptr [rip + 0x65a84af]
00000001808978ed: xor      r9d, r9d
00000001808978f0: movq     rdx, xmm7
00000001808978f5: movq     rcx, xmm6
00000001808978fa: call     0x1866e3dc0
00000001808978ff: test     al, al
0000000180897901: je       0x180897ab8
0000000180897907: mov      rdx, qword ptr [rsi + 0x70]
000000018089790b: xor      r8d, r8d
000000018089790e: mov      rcx, rsi
0000000180897911: call     0x180897510 ; Torappu.Battle.DirectionCursor._GetNextGrid [70290]
0000000180897916: mov      qword ptr [rsi + 0x70], rax
000000018089791a: mov      rax, qword ptr [rsi + 0x10]
000000018089791e: mov      ebx, dword ptr [rsi + 0x18]
0000000180897921: test     rax, rax
0000000180897924: je       0x180897d13
000000018089792a: nop      word ptr [rax + rax]
0000000180897930: mov      rax, qword ptr [rax + 0x30]
0000000180897934: test     rax, rax
0000000180897937: je       0x180897d13
000000018089793d: cmp      ebx, dword ptr [rax + 0x18]
0000000180897940: jge      0x180897c7d
0000000180897946: mov      rcx, qword ptr [rsi + 0x28]
000000018089794a: test     rcx, rcx
000000018089794d: je       0x180897d13
0000000180897953: cmp      ebx, dword ptr [rcx + 0x18]
0000000180897956: jae      0x180897d19
000000018089795c: mov      rdx, qword ptr [rip + 0x80213d5] ; TypeInfo Torappu.Battle.BasicCursor.MoveCheckpoint @0x1888b8d38
0000000180897963: movsxd   rax, ebx
0000000180897966: mov      rdi, qword ptr [rcx + rax*8 + 0x20]
000000018089796b: test     rdi, rdi
000000018089796e: je       0x180897c26
0000000180897974: cmp      byte ptr [rip + 0x8434e75], 0
000000018089797b: mov      r8, qword ptr [rdi]
000000018089797e: jbe      0x180897bef
0000000180897984: mov      rcx, r8
0000000180897987: call     0x1804463e0
000000018089798c: xor      edx, edx
000000018089798e: test     al, al
0000000180897990: jmp      0x180897c1d
0000000180897995: mov      rcx, qword ptr [rip + 0x802d5ec] ; TypeInfo Torappu.GridPosition @0x1888c4f88
000000018089799c: mov      rbx, qword ptr [rsp + 0x60]
00000001808979a1: mov      rdi, qword ptr [rsi + 0x70]
00000001808979a5: cmp      dword ptr [rcx + 0xe0], 0
00000001808979ac: jne      0x1808979b3
00000001808979ae: call     0x18048c140
00000001808979b3: xor      r8d, r8d
00000001808979b6: mov      rdx, rdi
00000001808979b9: mov      rcx, rbx
00000001808979bc: call     0x182104110 ; Torappu.GridPosition.op_Inequality [28052]
00000001808979c1: test     al, al
00000001808979c3: je       0x1808979d9
00000001808979c5: mov      rdx, qword ptr [rsp + 0x60]
00000001808979ca: xor      r8d, r8d
00000001808979cd: mov      rcx, rsi
00000001808979d0: call     0x180897510 ; Torappu.Battle.DirectionCursor._GetNextGrid [70290]
00000001808979d5: mov      qword ptr [rsi + 0x70], rax
00000001808979d9: mov      rdx, qword ptr [rsi + 0x60]
00000001808979dd: test     rdx, rdx
00000001808979e0: je       0x180897d13
00000001808979e6: mov      rax, qword ptr [rdx + 0x10]
00000001808979ea: movsxd   r8, dword ptr [rsi + 0x70]
00000001808979ee: movsxd   rcx, dword ptr [rsi + 0x74]
00000001808979f2: cmp      r8d, dword ptr [rax]
00000001808979f5: jae      0x180897d19
00000001808979fb: mov      r9, qword ptr [rax + 0x10]
00000001808979ff: cmp      ecx, r9d
0000000180897a02: jae      0x180897d19
0000000180897a08: mov      rax, r8
0000000180897a0b: imul     rax, r9
0000000180897a0f: add      rax, rdx
0000000180897a12: cmp      byte ptr [rcx + rax + 0x20], 0
0000000180897a17: jne      0x18089791a
0000000180897a1d: mov      rcx, qword ptr [rip + 0x802d564] ; TypeInfo Torappu.GridPosition @0x1888c4f88
0000000180897a24: cmp      dword ptr [rcx + 0xe0], 0
0000000180897a2b: jne      0x180897a32
0000000180897a2d: call     0x18048c140
0000000180897a32: lea      rcx, [rsi + 0x70]
0000000180897a36: xor      edx, edx
0000000180897a38: call     0x182104010 ; Torappu.GridPosition.get_asLocalPosition [28039]
0000000180897a3d: mov      rcx, qword ptr [rip + 0x802c1f4] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180897a44: movq     xmm7, rax
0000000180897a49: cmp      dword ptr [rcx + 0xe0], 0
0000000180897a50: jne      0x180897a57
0000000180897a52: call     0x18048c140
0000000180897a57: movss    xmm2, dword ptr [rip + 0x65a921d]
0000000180897a5f: xor      r9d, r9d
0000000180897a62: movq     rdx, xmm7
0000000180897a67: movq     rcx, xmm6
0000000180897a6c: call     0x1866e3dc0
0000000180897a71: test     al, al
0000000180897a73: je       0x180897ab8
0000000180897a75: mov      rdx, qword ptr [rsi + 0x60]
0000000180897a79: test     rdx, rdx
0000000180897a7c: je       0x180897d13
0000000180897a82: mov      rax, qword ptr [rdx + 0x10]
0000000180897a86: movsxd   rcx, dword ptr [rsi + 0x70]
0000000180897a8a: movsxd   r8, dword ptr [rsi + 0x74]
0000000180897a8e: cmp      ecx, dword ptr [rax]
0000000180897a90: jae      0x180897d19
0000000180897a96: mov      r9, qword ptr [rax + 0x10]
0000000180897a9a: cmp      r8d, r9d
0000000180897a9d: jae      0x180897d19
0000000180897aa3: mov      rax, rcx
0000000180897aa6: imul     rax, r9
0000000180897aaa: add      rax, rdx
0000000180897aad: mov      byte ptr [r8 + rax + 0x20], 1
0000000180897ab3: jmp      0x180897907
0000000180897ab8: mov      rcx, qword ptr [rip + 0x802d4c9] ; TypeInfo Torappu.GridPosition @0x1888c4f88
0000000180897abf: cmp      dword ptr [rcx + 0xe0], 0
0000000180897ac6: jne      0x180897acd
0000000180897ac8: call     0x18048c140
0000000180897acd: lea      rcx, [rsi + 0x70]
0000000180897ad1: xor      edx, edx
0000000180897ad3: call     0x182104010 ; Torappu.GridPosition.get_asLocalPosition [28039]
0000000180897ad8: mov      rbx, qword ptr [rsp + 0x50]
0000000180897add: mov      rdi, qword ptr [rsp + 0x58]
0000000180897ae2: movaps   xmm7, xmmword ptr [rsp + 0x20]
0000000180897ae7: movaps   xmm6, xmmword ptr [rsp + 0x30]
0000000180897aec: add      rsp, 0x40
0000000180897af0: pop      rsi
0000000180897af1: ret      
0000000180897af2: mov      rdx, qword ptr [rsi + 0x60]
0000000180897af6: test     rdx, rdx
0000000180897af9: je       0x180897d13
0000000180897aff: mov      rax, qword ptr [rdx + 0x10]
0000000180897b03: movsxd   r9, dword ptr [rsp + 0x60]
0000000180897b08: movsxd   r8, dword ptr [rsp + 0x64]
0000000180897b0d: cmp      r9d, dword ptr [rax]
0000000180897b10: jae      0x180897d19
0000000180897b16: mov      rcx, qword ptr [rax + 0x10]
0000000180897b1a: cmp      r8d, ecx
0000000180897b1d: jae      0x180897d19
0000000180897b23: imul     rcx, r9
0000000180897b27: add      rcx, r8
0000000180897b2a: cmp      byte ptr [rcx + rdx + 0x20], 0
0000000180897b2f: jne      0x18089791a
0000000180897b35: mov      rcx, qword ptr [rip + 0x802d44c] ; TypeInfo Torappu.GridPosition @0x1888c4f88
0000000180897b3c: cmp      dword ptr [rcx + 0xe0], 0
0000000180897b43: jne      0x180897b4a
0000000180897b45: call     0x18048c140
0000000180897b4a: xor      edx, edx
0000000180897b4c: lea      rcx, [rsp + 0x60]
0000000180897b51: call     0x182104010 ; Torappu.GridPosition.get_asLocalPosition [28039]
0000000180897b56: mov      rcx, qword ptr [rip + 0x802c0db] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180897b5d: movq     xmm7, rax
0000000180897b62: cmp      dword ptr [rcx + 0xe0], 0
0000000180897b69: jne      0x180897b70
0000000180897b6b: call     0x18048c140
0000000180897b70: movss    xmm2, dword ptr [rip + 0x65a9104]
0000000180897b78: xor      r9d, r9d
0000000180897b7b: movq     rdx, xmm7
0000000180897b80: movq     rcx, xmm6
0000000180897b85: call     0x1866e3dc0
0000000180897b8a: test     al, al
0000000180897b8c: je       0x180897bd0
0000000180897b8e: mov      rdx, qword ptr [rsi + 0x60]
0000000180897b92: test     rdx, rdx
0000000180897b95: je       0x180897d13
0000000180897b9b: mov      rax, qword ptr [rdx + 0x10]
0000000180897b9f: movsxd   r8, dword ptr [rsp + 0x60]
0000000180897ba4: movsxd   r9, dword ptr [rsp + 0x64]
0000000180897ba9: cmp      r8d, dword ptr [rax]
0000000180897bac: jae      0x180897d19
0000000180897bb2: mov      rcx, qword ptr [rax + 0x10]
0000000180897bb6: cmp      r9d, ecx
0000000180897bb9: jae      0x180897d19
0000000180897bbf: imul     rcx, r8
0000000180897bc3: add      rcx, r9
0000000180897bc6: mov      byte ptr [rcx + rdx + 0x20], 1
0000000180897bcb: jmp      0x18089791a
0000000180897bd0: mov      rcx, qword ptr [rip + 0x802d3b1] ; TypeInfo Torappu.GridPosition @0x1888c4f88
0000000180897bd7: cmp      dword ptr [rcx + 0xe0], 0
0000000180897bde: jne      0x180897be5
0000000180897be0: call     0x18048c140
0000000180897be5: lea      rcx, [rsp + 0x60]
0000000180897bea: jmp      0x180897ad1
0000000180897bef: movzx    eax, byte ptr [rdx + 0x130]
0000000180897bf6: cmp      byte ptr [r8 + 0x130], al
0000000180897bfd: jb       0x180897c17
0000000180897bff: movzx    ecx, al
0000000180897c02: mov      rax, qword ptr [r8 + 0xc8]
0000000180897c09: cmp      qword ptr [rax + rcx*8 - 8], rdx
0000000180897c0e: jne      0x180897c17
0000000180897c10: mov      eax, 1
0000000180897c15: jmp      0x180897c19
0000000180897c17: xor      eax, eax
0000000180897c19: xor      edx, edx
0000000180897c1b: test     eax, eax
0000000180897c1d: cmovne   rdx, rdi
0000000180897c21: test     rdx, rdx
0000000180897c24: jne      0x180897c6e
0000000180897c26: mov      rcx, qword ptr [rsi + 0x28]
0000000180897c2a: test     rcx, rcx
0000000180897c2d: je       0x180897d13
0000000180897c33: cmp      ebx, dword ptr [rcx + 0x18]
0000000180897c36: jae      0x180897d19
0000000180897c3c: movsxd   rax, ebx
0000000180897c3f: mov      rdx, qword ptr [rcx + rax*8 + 0x20]
0000000180897c44: test     rdx, rdx
0000000180897c47: je       0x180897d13
0000000180897c4d: mov      ecx, 0xc
0000000180897c52: mov      r8d, ebx
0000000180897c55: call     0x1800053c0
0000000180897c5a: mov      ebx, eax
0000000180897c5c: mov      rax, qword ptr [rsi + 0x10]
0000000180897c60: test     rax, rax
0000000180897c63: je       0x180897d13
0000000180897c69: jmp      0x180897930
0000000180897c6e: mov      ecx, 0xe
0000000180897c73: call     0x180005610
0000000180897c78: jmp      0x180897ad8
0000000180897c7d: xor      edx, edx
0000000180897c7f: mov      rcx, rsi
0000000180897c82: call     0x180877390 ; Torappu.Battle.BasicCursor.get_route [70151]
0000000180897c87: test     rax, rax
0000000180897c8a: je       0x180897d13
0000000180897c90: mov      rbx, qword ptr [rax + 0x18]
0000000180897c94: test     rbx, rbx
0000000180897c97: je       0x180897d13
0000000180897c99: mov      rcx, qword ptr [rip + 0x802d2e8] ; TypeInfo Torappu.GridPosition @0x1888c4f88
0000000180897ca0: cmp      dword ptr [rcx + 0xe0], 0
0000000180897ca7: jne      0x180897cae
0000000180897ca9: call     0x18048c140
0000000180897cae: lea      rcx, [rbx + 0x1c]
0000000180897cb2: jmp      0x180897ad1
0000000180897cb7: mov      rcx, qword ptr [rip + 0x804848a] ; GenericMethodInfo 282061 @0x1888e0148
0000000180897cbe: call     0x185337c50
0000000180897cc3: test     rax, rax
0000000180897cc6: je       0x180897d13
0000000180897cc8: mov      rdx, qword ptr [rsp + 0x60]
0000000180897ccd: xor      r8d, r8d
0000000180897cd0: mov      rcx, rax
0000000180897cd3: call     0x18087c0d0 ; Torappu.Battle.Map.GetDirectionToGoBackFromInvalidPos [70085]
0000000180897cd8: movss    xmm0, dword ptr [rsp + 0x68]
0000000180897cde: movss    xmm1, dword ptr [rsp + 0x6c]
0000000180897ce4: mov      qword ptr [rsp + 0x60], rax
0000000180897ce9: addss    xmm0, dword ptr [rsp + 0x60]
0000000180897cef: addss    xmm1, dword ptr [rsp + 0x64]
0000000180897cf5: unpcklps xmm0, xmm1
0000000180897cf8: movq     rax, xmm0
0000000180897cfd: jmp      0x180897ad8
0000000180897d02: xor      r8d, r8d
0000000180897d05: mov      rdx, rsi
0000000180897d08: call     0x1835c4140 ; XLua.DelegateBridge.__Gen_Delegate_Imp72 [2727]
0000000180897d0d: add      rsp, 0x40
0000000180897d11: pop      rsi
0000000180897d12: ret      
0000000180897d13: call     0x18048c0b0
0000000180897d18: int3     
0000000180897d19: call     0x18048c0a0
0000000180897d1e: int3     
0000000180897d1f: int3     
