; Torappu.Battle.SPFA._GenerateNextMapImpl metadata=70333 token=0x60112be VA=0x1808a5860 RVA=0x8a5860 size=0x5e0
00000001808a5860: mov      qword ptr [rsp + 0x10], rdx
00000001808a5865: push     rsi
00000001808a5866: push     r13
00000001808a5868: push     r15
00000001808a586a: sub      rsp, 0x70
00000001808a586e: cmp      byte ptr [rip + 0x83ebc99], 0
00000001808a5875: mov      r13, r8
00000001808a5878: mov      rsi, rdx
00000001808a587b: mov      r15, rcx
00000001808a587e: jne      0x1808a58db
00000001808a5880: lea      rcx, [rip + 0x801f701] ; TypeInfo Torappu.GridPosition @0x1888c4f88
00000001808a5887: call     0x18048bf00
00000001808a588c: lea      rcx, [rip + 0x7f68ea5] ; GenericMethodInfo 167290 @0x18880e738
00000001808a5893: call     0x18048bf00
00000001808a5898: lea      rcx, [rip + 0x7f690d9] ; GenericMethodInfo 167292 @0x18880e978
00000001808a589f: call     0x18048bf00
00000001808a58a4: lea      rcx, [rip + 0x7f6930d] ; GenericMethodInfo 167293 @0x18880ebb8
00000001808a58ab: call     0x18048bf00
00000001808a58b0: lea      rcx, [rip + 0x7f69541] ; GenericMethodInfo 167306 @0x18880edf8
00000001808a58b7: call     0x18048bf00
00000001808a58bc: lea      rcx, [rip + 0x7f8b9bd] ; TypeInfo Torappu.Battle.SPFA @0x188831280
00000001808a58c3: call     0x18048bf00
00000001808a58c8: lea      rcx, [rip + 0x80a9311] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001808a58cf: call     0x18048bf00
00000001808a58d4: mov      byte ptr [rip + 0x83ebc33], 1
00000001808a58db: mov      rax, qword ptr [rip + 0x7f8b99e] ; TypeInfo Torappu.Battle.SPFA @0x188831280
00000001808a58e2: cmp      dword ptr [rax + 0xe0], 0
00000001808a58e9: jne      0x1808a58fa
00000001808a58eb: mov      rcx, rax
00000001808a58ee: call     0x18048c140
00000001808a58f3: mov      rax, qword ptr [rip + 0x7f8b986] ; TypeInfo Torappu.Battle.SPFA @0x188831280
00000001808a58fa: mov      rax, qword ptr [rax + 0xb8]
00000001808a5901: mov      rcx, qword ptr [rax + 0x28]
00000001808a5905: test     rcx, rcx
00000001808a5908: jne      0x1808a5de5
00000001808a590e: mov      qword ptr [rsp + 0x90], rbx
00000001808a5916: mov      qword ptr [rsp + 0xa0], rbp
00000001808a591e: mov      qword ptr [rsp + 0xa8], rdi
00000001808a5926: mov      qword ptr [rsp + 0x68], r12
00000001808a592b: mov      qword ptr [rsp + 0x60], r14
00000001808a5930: mov      rax, qword ptr [r15 + 0x10]
00000001808a5934: xor      ebp, ebp
00000001808a5936: mov      edi, ebp
00000001808a5938: mov      ebx, ebp
00000001808a593a: test     rax, rax
00000001808a593d: je       0x1808a5e3c
00000001808a5943: xor      edx, edx
00000001808a5945: mov      rcx, rax
00000001808a5948: call     0x180886a20 ; Torappu.Battle.Map.get_height [69971]
00000001808a594d: cmp      ebx, eax
00000001808a594f: jge      0x1808a59f0
00000001808a5955: mov      ebx, ebp
00000001808a5957: nop      word ptr [rax + rax]
00000001808a5960: mov      rcx, qword ptr [r15 + 0x10]
00000001808a5964: test     rcx, rcx
00000001808a5967: je       0x1808a5e3c
00000001808a596d: xor      edx, edx
00000001808a596f: call     0x180887350 ; Torappu.Battle.Map.get_width [69970]
00000001808a5974: cmp      ebx, eax
00000001808a5976: jge      0x1808a59da
00000001808a5978: test     r13, r13
00000001808a597b: je       0x1808a5e42
00000001808a5981: movsxd   r8, ebx
00000001808a5984: mov      rcx, r13
00000001808a5987: movsxd   rdx, edi
00000001808a598a: call     0x1800169b0
00000001808a598f: xor      r9d, r9d
00000001808a5992: mov      qword ptr [rsp + 0x30], rbp
00000001808a5997: mov      r8d, ebx
00000001808a599a: lea      rcx, [rsp + 0x30]
00000001808a599f: mov      edx, edi
00000001808a59a1: mov      rsi, rax
00000001808a59a4: call     0x180518de0 ; QRCoder.QRCodeGenerator.Antilog..ctor [21323] | QRCoder.QRCodeGenerator.PolynomItem..ctor [21326] | Torappu.GridPosition..ctor [28040] | Torappu.RoguelikeTopicDifficultyID..ctor [31979] | Torappu.Building.UI.CleanConditionCheckingResult..ctor [50595] | Torappu.Battle.LegionCharacterStatusManager.StatusKeyValuePair..ctor [66955] | Torappu.UI.HandBook.X_Y..ctor [188904]
00000001808a59a9: mov      rcx, qword ptr [r15 + 0x10]
00000001808a59ad: test     rcx, rcx
00000001808a59b0: je       0x1808a5e42
00000001808a59b6: xor      r9d, r9d
00000001808a59b9: mov      r8d, ebx
00000001808a59bc: mov      edx, edi
00000001808a59be: call     0x180885bb0 ; Torappu.Battle.Map.get_Item [69983]
00000001808a59c3: mov      rdx, qword ptr [rsp + 0x30]
00000001808a59c8: xor      r9d, r9d
00000001808a59cb: mov      r8, rax
00000001808a59ce: mov      rcx, rsi
00000001808a59d1: call     0x1808a0d60 ; Torappu.Battle.Route.Node.Reset [70388]
00000001808a59d6: inc      ebx
00000001808a59d8: jmp      0x1808a5960
00000001808a59da: mov      rax, qword ptr [r15 + 0x10]
00000001808a59de: inc      edi
00000001808a59e0: mov      ebx, edi
00000001808a59e2: test     rax, rax
00000001808a59e5: je       0x1808a5e3c
00000001808a59eb: jmp      0x1808a5943
00000001808a59f0: mov      rax, qword ptr [rip + 0x7f8b889] ; TypeInfo Torappu.Battle.SPFA @0x188831280
00000001808a59f7: cmp      dword ptr [rax + 0xe0], ebp
00000001808a59fd: jne      0x1808a5a0e
00000001808a59ff: mov      rcx, rax
00000001808a5a02: call     0x18048c140
00000001808a5a07: mov      rax, qword ptr [rip + 0x7f8b872] ; TypeInfo Torappu.Battle.SPFA @0x188831280
00000001808a5a0e: mov      rax, qword ptr [rax + 0xb8]
00000001808a5a15: mov      rcx, qword ptr [rax]
00000001808a5a18: test     rcx, rcx
00000001808a5a1b: je       0x1808a5e3c
00000001808a5a21: mov      rdx, qword ptr [rip + 0x7f68d10] ; GenericMethodInfo 167290 @0x18880e738
00000001808a5a28: call     0x1851b8c60
00000001808a5a2d: mov      rsi, qword ptr [rsp + 0x98]
00000001808a5a35: mov      rcx, qword ptr [r15 + 0x10]
00000001808a5a39: mov      rbx, qword ptr [rsi]
00000001808a5a3c: mov      qword ptr [rsp + 0x38], rbx
00000001808a5a41: test     rcx, rcx
00000001808a5a44: je       0x1808a5e3c
00000001808a5a4a: xor      r8d, r8d
00000001808a5a4d: mov      rdx, rbx
00000001808a5a50: call     0x180885c70 ; Torappu.Battle.Map.get_Item [69982]
00000001808a5a55: test     rax, rax
00000001808a5a58: je       0x1808a5e3c
00000001808a5a5e: mov      edx, dword ptr [rsi + 8]
00000001808a5a61: xor      r8d, r8d
00000001808a5a64: mov      rcx, rax
00000001808a5a67: call     0x1808bfa60 ; Torappu.Battle.Tile.IsPassable [70705]
00000001808a5a6c: test     al, al
00000001808a5a6e: je       0x1808a5b00
00000001808a5a74: test     r13, r13
00000001808a5a77: je       0x1808a5e3c
00000001808a5a7d: mov      rax, qword ptr [r13 + 0x10]
00000001808a5a81: movsxd   rdx, dword ptr [rsp + 0x3c]
00000001808a5a86: movsxd   r8, ebx
00000001808a5a89: cmp      r8d, dword ptr [rax]
00000001808a5a8c: jae      0x1808a5e48
00000001808a5a92: mov      rcx, qword ptr [rax + 0x10]
00000001808a5a96: cmp      edx, ecx
00000001808a5a98: jae      0x1808a5e48
00000001808a5a9e: imul     rcx, r8
00000001808a5aa2: add      rcx, rdx
00000001808a5aa5: lea      rax, [rcx + rcx*2]
00000001808a5aa9: add      rax, rax
00000001808a5aac: mov      dword ptr [r13 + rax*8 + 0x44], ebp
00000001808a5ab1: mov      byte ptr [r13 + rax*8 + 0x4c], 1
00000001808a5ab7: mov      rax, qword ptr [rip + 0x7f8b7c2] ; TypeInfo Torappu.Battle.SPFA @0x188831280
00000001808a5abe: cmp      dword ptr [rax + 0xe0], ebp
00000001808a5ac4: jne      0x1808a5ad5
00000001808a5ac6: mov      rcx, rax
00000001808a5ac9: call     0x18048c140
00000001808a5ace: mov      rax, qword ptr [rip + 0x7f8b7ab] ; TypeInfo Torappu.Battle.SPFA @0x188831280
00000001808a5ad5: mov      rax, qword ptr [rax + 0xb8]
00000001808a5adc: mov      rcx, qword ptr [rax]
00000001808a5adf: test     rcx, rcx
00000001808a5ae2: je       0x1808a5e3c
00000001808a5ae8: mov      r8, qword ptr [rip + 0x7f690c9] ; GenericMethodInfo 167293 @0x18880ebb8
00000001808a5aef: mov      rdx, rbx
00000001808a5af2: call     0x1851ba9c0
00000001808a5af7: nop      word ptr [rax + rax]
00000001808a5b00: mov      rcx, qword ptr [rip + 0x7f8b779] ; TypeInfo Torappu.Battle.SPFA @0x188831280
00000001808a5b07: cmp      dword ptr [rcx + 0xe0], 0
00000001808a5b0e: jne      0x1808a5b1c
00000001808a5b10: call     0x18048c140
00000001808a5b15: mov      rcx, qword ptr [rip + 0x7f8b764] ; TypeInfo Torappu.Battle.SPFA @0x188831280
00000001808a5b1c: mov      rax, qword ptr [rcx + 0xb8]
00000001808a5b23: mov      rdx, qword ptr [rax]
00000001808a5b26: test     rdx, rdx
00000001808a5b29: je       0x1808a5e3c
00000001808a5b2f: cmp      dword ptr [rdx + 0x20], 0
00000001808a5b33: jle      0x1808a5e10
00000001808a5b39: cmp      dword ptr [rcx + 0xe0], 0
00000001808a5b40: jne      0x1808a5b4e
00000001808a5b42: call     0x18048c140
00000001808a5b47: mov      rcx, qword ptr [rip + 0x7f8b732] ; TypeInfo Torappu.Battle.SPFA @0x188831280
00000001808a5b4e: mov      rax, qword ptr [rcx + 0xb8]
00000001808a5b55: mov      rcx, qword ptr [rax]
00000001808a5b58: test     rcx, rcx
00000001808a5b5b: je       0x1808a5e3c
00000001808a5b61: mov      rdx, qword ptr [rip + 0x7f68e10] ; GenericMethodInfo 167292 @0x18880e978
00000001808a5b68: call     0x1851b9980
00000001808a5b6d: mov      rdi, rax
00000001808a5b70: test     r13, r13
00000001808a5b73: je       0x1808a5e3c
00000001808a5b79: mov      rdx, rax
00000001808a5b7c: movsxd   r8, edi
00000001808a5b7f: mov      rax, qword ptr [r13 + 0x10]
00000001808a5b83: shr      rdx, 0x20
00000001808a5b87: movsxd   r9, edx
00000001808a5b8a: cmp      r8d, dword ptr [rax]
00000001808a5b8d: jae      0x1808a5e48
00000001808a5b93: mov      rcx, qword ptr [rax + 0x10]
00000001808a5b97: cmp      edx, ecx
00000001808a5b99: jae      0x1808a5e48
00000001808a5b9f: imul     rcx, r8
00000001808a5ba3: mov      esi, 0x20
00000001808a5ba8: add      rcx, r9
00000001808a5bab: mov      qword ptr [rsp + 0x30], rsi
00000001808a5bb0: mov      r12d, esi
00000001808a5bb3: lea      rax, [rcx + rcx*2]
00000001808a5bb7: shl      rax, 4
00000001808a5bbb: add      rax, r13
00000001808a5bbe: mov      qword ptr [rsp + 0x38], rax
00000001808a5bc3: mov      byte ptr [rax + 0x4c], 0
00000001808a5bc7: nop      word ptr [rax + rax]
00000001808a5bd0: mov      rax, qword ptr [rip + 0x801f3b1] ; TypeInfo Torappu.GridPosition @0x1888c4f88
00000001808a5bd7: cmp      dword ptr [rax + 0xe0], 0
00000001808a5bde: jne      0x1808a5bef
00000001808a5be0: mov      rcx, rax
00000001808a5be3: call     0x18048c140
00000001808a5be8: mov      rax, qword ptr [rip + 0x801f399] ; TypeInfo Torappu.GridPosition @0x1888c4f88
00000001808a5bef: mov      rax, qword ptr [rax + 0xb8]
00000001808a5bf6: mov      rdx, qword ptr [rax + 0x50]
00000001808a5bfa: test     rdx, rdx
00000001808a5bfd: je       0x1808a5e3c
00000001808a5c03: cmp      ebp, dword ptr [rdx + 0x18]
00000001808a5c06: jae      0x1808a5e48
00000001808a5c0c: mov      rdx, qword ptr [r12 + rdx]
00000001808a5c10: xor      r8d, r8d
00000001808a5c13: mov      rcx, rdi
00000001808a5c16: call     0x1821040d0 ; Torappu.GridPosition.op_Addition [28049]
00000001808a5c1b: mov      rcx, qword ptr [r15 + 0x10]
00000001808a5c1f: mov      rbx, rax
00000001808a5c22: mov      qword ptr [rsp + 0x40], rax
00000001808a5c27: test     rcx, rcx
00000001808a5c2a: je       0x1808a5e3c
00000001808a5c30: xor      r8d, r8d
00000001808a5c33: mov      rdx, rax
00000001808a5c36: call     0x18087a3a0 ; Torappu.Battle.Map.CheckGridValid [70066]
00000001808a5c3b: test     al, al
00000001808a5c3d: je       0x1808a5dc3
00000001808a5c43: mov      rcx, qword ptr [r15 + 0x10]
00000001808a5c47: test     rcx, rcx
00000001808a5c4a: je       0x1808a5e3c
00000001808a5c50: xor      r8d, r8d
00000001808a5c53: mov      rdx, rbx
00000001808a5c56: call     0x180885c70 ; Torappu.Battle.Map.get_Item [69982]
00000001808a5c5b: mov      rcx, qword ptr [rip + 0x80a8f7e] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001808a5c62: mov      r14, rax
00000001808a5c65: cmp      dword ptr [rcx + 0xe0], 0
00000001808a5c6c: jne      0x1808a5c7a
00000001808a5c6e: call     0x18048c140
00000001808a5c73: mov      rcx, qword ptr [rip + 0x80a8f66] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001808a5c7a: mov      rcx, qword ptr [rcx + 0xb8]
00000001808a5c81: mov      rdx, qword ptr [rcx + 8]
00000001808a5c85: test     rdx, rdx
00000001808a5c88: je       0x1808a5e3c
00000001808a5c8e: cmp      ebp, dword ptr [rdx + 0x18]
00000001808a5c91: jae      0x1808a5e48
00000001808a5c97: cmp      byte ptr [rip + 0x8426b52], 0
00000001808a5c9e: mov      esi, dword ptr [rdx + rsi]
00000001808a5ca1: jbe      0x1808a5cab
00000001808a5ca3: mov      rcx, qword ptr [r15]
00000001808a5ca6: call     0x180446d00
00000001808a5cab: mov      rax, qword ptr [r15]
00000001808a5cae: lea      r8, [rsp + 0x50]
00000001808a5cb3: mov      rcx, qword ptr [rsp + 0x98]
00000001808a5cbb: mov      r9d, esi
00000001808a5cbe: mov      rdx, r14
00000001808a5cc1: mov      r10, qword ptr [rax + 0x1d0]
00000001808a5cc8: movups   xmm0, xmmword ptr [rcx]
00000001808a5ccb: mov      rax, qword ptr [rax + 0x1d8]
00000001808a5cd2: mov      rcx, r15
00000001808a5cd5: mov      qword ptr [rsp + 0x20], rax
00000001808a5cda: movaps   xmmword ptr [rsp + 0x50], xmm0
00000001808a5cdf: call     r10
00000001808a5ce2: test     al, al
00000001808a5ce4: je       0x1808a5dc3
00000001808a5cea: mov      rax, qword ptr [rsp + 0x98]
00000001808a5cf2: cmp      dword ptr [rax + 8], 1
00000001808a5cf6: jne      0x1808a5d00
00000001808a5cf8: mov      r14d, 1
00000001808a5cfe: jmp      0x1808a5d31
00000001808a5d00: mov      rcx, qword ptr [r15 + 0x10]
00000001808a5d04: test     rcx, rcx
00000001808a5d07: je       0x1808a5e3c
00000001808a5d0d: xor      r8d, r8d
00000001808a5d10: mov      rdx, rbx
00000001808a5d13: call     0x180885c70 ; Torappu.Battle.Map.get_Item [69982]
00000001808a5d18: test     rax, rax
00000001808a5d1b: je       0x1808a5e3c
00000001808a5d21: mov      ecx, 0x10
00000001808a5d26: mov      rdx, rax
00000001808a5d29: call     0x180005610
00000001808a5d2e: mov      r14d, eax
00000001808a5d31: movsxd   r8, dword ptr [rsp + 0x44]
00000001808a5d36: mov      rcx, r13
00000001808a5d39: movsxd   rdx, ebx
00000001808a5d3c: call     0x1800169b0
00000001808a5d41: xor      edx, edx
00000001808a5d43: mov      rcx, rax
00000001808a5d46: mov      rsi, rax
00000001808a5d49: call     0x1808a0db0 ; Torappu.Battle.Route.Node.get_isValid [70387]
00000001808a5d4e: test     al, al
00000001808a5d50: je       0x1808a5d62
00000001808a5d52: mov      rax, qword ptr [rsp + 0x38]
00000001808a5d57: mov      ecx, dword ptr [rax + 0x44]
00000001808a5d5a: add      ecx, r14d
00000001808a5d5d: cmp      ecx, dword ptr [rsi + 0x24]
00000001808a5d60: jge      0x1808a5dc3
00000001808a5d62: mov      rax, qword ptr [rsp + 0x38]
00000001808a5d67: mov      ecx, dword ptr [rax + 0x44]
00000001808a5d6a: add      ecx, r14d
00000001808a5d6d: mov      qword ptr [rsi + 0x18], rdi
00000001808a5d71: cmp      byte ptr [rsi + 0x2c], 0
00000001808a5d75: mov      dword ptr [rsi + 0x24], ecx
00000001808a5d78: mov      byte ptr [rsi + 0x20], 1
00000001808a5d7c: jne      0x1808a5dc3
00000001808a5d7e: mov      byte ptr [rsi + 0x2c], 1
00000001808a5d82: mov      rax, qword ptr [rip + 0x7f8b4f7] ; TypeInfo Torappu.Battle.SPFA @0x188831280
00000001808a5d89: cmp      dword ptr [rax + 0xe0], 0
00000001808a5d90: jne      0x1808a5da1
00000001808a5d92: mov      rcx, rax
00000001808a5d95: call     0x18048c140
00000001808a5d9a: mov      rax, qword ptr [rip + 0x7f8b4df] ; TypeInfo Torappu.Battle.SPFA @0x188831280
00000001808a5da1: mov      rax, qword ptr [rax + 0xb8]
00000001808a5da8: mov      rcx, qword ptr [rax]
00000001808a5dab: test     rcx, rcx
00000001808a5dae: je       0x1808a5e3c
00000001808a5db4: mov      r8, qword ptr [rip + 0x7f68dfd] ; GenericMethodInfo 167293 @0x18880ebb8
00000001808a5dbb: mov      rdx, rbx
00000001808a5dbe: call     0x1851ba9c0
00000001808a5dc3: add      qword ptr [rsp + 0x30], 4
00000001808a5dc9: inc      ebp
00000001808a5dcb: mov      rsi, qword ptr [rsp + 0x30]
00000001808a5dd0: add      r12, 8
00000001808a5dd4: cmp      r12, 0x40
00000001808a5dd8: jl       0x1808a5bd0
00000001808a5dde: xor      ebp, ebp
00000001808a5de0: jmp      0x1808a5b00
00000001808a5de5: movups   xmm0, xmmword ptr [rsi]
00000001808a5de8: mov      r9, r13
00000001808a5deb: mov      qword ptr [rsp + 0x20], 0
00000001808a5df4: lea      r8, [rsp + 0x50]
00000001808a5df9: mov      rdx, r15
00000001808a5dfc: movaps   xmmword ptr [rsp + 0x50], xmm0
00000001808a5e01: call     0x1833650b0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3345 [6000]
00000001808a5e06: add      rsp, 0x70
00000001808a5e0a: pop      r15
00000001808a5e0c: pop      r13
00000001808a5e0e: pop      rsi
00000001808a5e0f: ret      
00000001808a5e10: mov      r12, qword ptr [rsp + 0x68]
00000001808a5e15: mov      r14, qword ptr [rsp + 0x60]
00000001808a5e1a: mov      rbp, qword ptr [rsp + 0xa0]
00000001808a5e22: mov      rbx, qword ptr [rsp + 0x90]
00000001808a5e2a: mov      rdi, qword ptr [rsp + 0xa8]
00000001808a5e32: add      rsp, 0x70
00000001808a5e36: pop      r15
00000001808a5e38: pop      r13
00000001808a5e3a: pop      rsi
00000001808a5e3b: ret      