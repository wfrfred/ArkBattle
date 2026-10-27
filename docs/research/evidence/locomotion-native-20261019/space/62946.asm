; Torappu.Battle.BattleOptions.LoadOptions metadata=62946 token=0x600f5e3 VA=0x1805da010 RVA=0x5da010 size=0x4d0
00000001805da010: mov      qword ptr [rsp + 0x18], rbx
00000001805da015: push     rsi
00000001805da016: sub      rsp, 0x60
00000001805da01a: cmp      byte ptr [rip + 0x86b5c73], 0
00000001805da021: mov      rsi, rdx
00000001805da024: mov      rbx, rcx
00000001805da027: jne      0x1805da078
00000001805da029: lea      rcx, [rip + 0x8359370] ; TypeInfo Torappu.Battle.BattleOptions @0x1889333a0
00000001805da030: call     0x18048bf00
00000001805da035: lea      rcx, [rip + 0x836f024] ; TypeInfo bool @0x188949060
00000001805da03c: call     0x18048bf00
00000001805da041: lea      rcx, [rip + 0x826ec68] ; TypeInfo int @0x188848cb0
00000001805da048: call     0x18048bf00
00000001805da04d: lea      rcx, [rip + 0x835d6d4] ; TypeInfo CodeStage.AntiCheat.ObscuredTypes.ObscuredFloat @0x188937728
00000001805da054: call     0x18048bf00
00000001805da059: lea      rcx, [rip + 0x835db48] ; TypeInfo CodeStage.AntiCheat.ObscuredTypes.ObscuredInt @0x188937ba8
00000001805da060: call     0x18048bf00
00000001805da065: lea      rcx, [rip + 0x83397dc] ; GenericMethodInfo 282427 @0x188913848
00000001805da06c: call     0x18048bf00
00000001805da071: mov      byte ptr [rip + 0x86b5c1c], 1
00000001805da078: test     rbx, rbx
00000001805da07b: je       0x1805da4c0
00000001805da081: mov      rcx, qword ptr [rip + 0x835d6a0] ; TypeInfo CodeStage.AntiCheat.ObscuredTypes.ObscuredFloat @0x188937728
00000001805da088: mov      qword ptr [rsp + 0x78], rdi
00000001805da08d: movaps   xmmword ptr [rsp + 0x50], xmm6
00000001805da092: movss    xmm6, dword ptr [rbx + 0x24]
00000001805da097: cmp      dword ptr [rcx + 0xe0], 0
00000001805da09e: movaps   xmmword ptr [rsp + 0x40], xmm7
00000001805da0a3: jne      0x1805da0aa
00000001805da0a5: call     0x18048c140
00000001805da0aa: xor      r8d, r8d
00000001805da0ad: lea      rcx, [rsp + 0x20]
00000001805da0b2: movaps   xmm1, xmm6
00000001805da0b5: call     0x18660a830 ; CodeStage.AntiCheat.ObscuredTypes.ObscuredFloat.op_Implicit [237392]
00000001805da0ba: movups   xmm6, xmmword ptr [rax]
00000001805da0bd: movsd    xmm7, qword ptr [rax + 0x10]
00000001805da0c2: mov      rax, qword ptr [rip + 0x83592d7] ; TypeInfo Torappu.Battle.BattleOptions @0x1889333a0
00000001805da0c9: cmp      dword ptr [rax + 0xe0], 0
00000001805da0d0: jne      0x1805da0e1
00000001805da0d2: mov      rcx, rax
00000001805da0d5: call     0x18048c140
00000001805da0da: mov      rax, qword ptr [rip + 0x83592bf] ; TypeInfo Torappu.Battle.BattleOptions @0x1889333a0
00000001805da0e1: mov      rax, qword ptr [rax + 0xb8]
00000001805da0e8: lea      rcx, [rsp + 0x20]
00000001805da0ed: xor      r8d, r8d
00000001805da0f0: movups   xmmword ptr [rax], xmm6
00000001805da0f3: movsd    qword ptr [rax + 0x10], xmm7
00000001805da0f8: movss    xmm1, dword ptr [rbx + 0x20]
00000001805da0fd: call     0x18660a830 ; CodeStage.AntiCheat.ObscuredTypes.ObscuredFloat.op_Implicit [237392]
00000001805da102: movaps   xmm7, xmmword ptr [rsp + 0x40]
00000001805da107: movups   xmm1, xmmword ptr [rax]
00000001805da10a: movsd    xmm0, qword ptr [rax + 0x10]
00000001805da10f: mov      rax, qword ptr [rip + 0x835928a] ; TypeInfo Torappu.Battle.BattleOptions @0x1889333a0
00000001805da116: mov      rcx, qword ptr [rax + 0xb8]
00000001805da11d: movups   xmmword ptr [rcx + 0x18], xmm1
00000001805da121: movsd    qword ptr [rcx + 0x28], xmm0
00000001805da126: mov      rcx, qword ptr [rip + 0x835da7b] ; TypeInfo CodeStage.AntiCheat.ObscuredTypes.ObscuredInt @0x188937ba8
00000001805da12d: mov      edi, dword ptr [rbx + 0x1c]
00000001805da130: cmp      dword ptr [rcx + 0xe0], 0
00000001805da137: jne      0x1805da13e
00000001805da139: call     0x18048c140
00000001805da13e: xor      r8d, r8d
00000001805da141: lea      rcx, [rsp + 0x20]
00000001805da146: mov      edx, edi
00000001805da148: call     0x18660b950 ; CodeStage.AntiCheat.ObscuredTypes.ObscuredInt.op_Implicit [237419]
00000001805da14d: mov      edx, dword ptr [rax + 0x10]
00000001805da150: movups   xmm0, xmmword ptr [rax]
00000001805da153: mov      rax, qword ptr [rip + 0x8359246] ; TypeInfo Torappu.Battle.BattleOptions @0x1889333a0
00000001805da15a: mov      rcx, qword ptr [rax + 0xb8]
00000001805da161: movups   xmmword ptr [rcx + 0x30], xmm0
00000001805da165: mov      dword ptr [rcx + 0x40], edx
00000001805da168: mov      rdx, qword ptr [rip + 0x8359231] ; TypeInfo Torappu.Battle.BattleOptions @0x1889333a0
00000001805da16f: mov      rax, qword ptr [rdx + 0xb8]
00000001805da176: cmp      byte ptr [rax + 0xc1], 0
00000001805da17d: jne      0x1805da1a7
00000001805da17f: cmp      dword ptr [rdx + 0xe0], 0
00000001805da186: jne      0x1805da197
00000001805da188: mov      rcx, rdx
00000001805da18b: call     0x18048c140
00000001805da190: mov      rdx, qword ptr [rip + 0x8359209] ; TypeInfo Torappu.Battle.BattleOptions @0x1889333a0
00000001805da197: mov      rax, qword ptr [rdx + 0xb8]
00000001805da19e: mov      byte ptr [rax + 0xc1], 1
00000001805da1a5: jmp      0x1805da1d4
00000001805da1a7: cmp      dword ptr [rdx + 0xe0], 0
00000001805da1ae: jne      0x1805da1bf
00000001805da1b0: mov      rcx, rdx
00000001805da1b3: call     0x18048c140
00000001805da1b8: mov      rdx, qword ptr [rip + 0x83591e1] ; TypeInfo Torappu.Battle.BattleOptions @0x1889333a0
00000001805da1bf: mov      rax, qword ptr [rdx + 0xb8]
00000001805da1c6: movups   xmm0, xmmword ptr [rax + 0x30]
00000001805da1ca: mov      ecx, dword ptr [rax + 0x40]
00000001805da1cd: movups   xmmword ptr [rax + 0x44], xmm0
00000001805da1d1: mov      dword ptr [rax + 0x54], ecx
00000001805da1d4: mov      rcx, qword ptr [rip + 0x835d9cd] ; TypeInfo CodeStage.AntiCheat.ObscuredTypes.ObscuredInt @0x188937ba8
00000001805da1db: mov      edi, dword ptr [rbx + 0x18]
00000001805da1de: cmp      dword ptr [rcx + 0xe0], 0
00000001805da1e5: jne      0x1805da1ec
00000001805da1e7: call     0x18048c140
00000001805da1ec: xor      r8d, r8d
00000001805da1ef: lea      rcx, [rsp + 0x20]
00000001805da1f4: mov      edx, edi
00000001805da1f6: call     0x18660b950 ; CodeStage.AntiCheat.ObscuredTypes.ObscuredInt.op_Implicit [237419]
00000001805da1fb: movups   xmm6, xmmword ptr [rax]
00000001805da1fe: mov      edi, dword ptr [rax + 0x10]
00000001805da201: mov      rax, qword ptr [rip + 0x8359198] ; TypeInfo Torappu.Battle.BattleOptions @0x1889333a0
00000001805da208: cmp      dword ptr [rax + 0xe0], 0
00000001805da20f: jne      0x1805da220
00000001805da211: mov      rcx, rax
00000001805da214: call     0x18048c140
00000001805da219: mov      rax, qword ptr [rip + 0x8359180] ; TypeInfo Torappu.Battle.BattleOptions @0x1889333a0
00000001805da220: mov      rax, qword ptr [rax + 0xb8]
00000001805da227: lea      rcx, [rsp + 0x20]
00000001805da22c: xor      r8d, r8d
00000001805da22f: movups   xmmword ptr [rax + 0x6c], xmm6
00000001805da233: mov      dword ptr [rax + 0x7c], edi
00000001805da236: mov      edx, dword ptr [rbx + 0x10]
00000001805da239: call     0x18660b950 ; CodeStage.AntiCheat.ObscuredTypes.ObscuredInt.op_Implicit [237419]
00000001805da23e: xor      r8d, r8d
00000001805da241: mov      edx, dword ptr [rax + 0x10]
00000001805da244: movups   xmm0, xmmword ptr [rax]
00000001805da247: mov      rax, qword ptr [rip + 0x8359152] ; TypeInfo Torappu.Battle.BattleOptions @0x1889333a0
00000001805da24e: mov      rcx, qword ptr [rax + 0xb8]
00000001805da255: movups   xmmword ptr [rcx + 0x80], xmm0
00000001805da25c: mov      dword ptr [rcx + 0x90], edx
00000001805da262: lea      rcx, [rsp + 0x20]
00000001805da267: mov      edx, dword ptr [rbx + 0x14]
00000001805da26a: call     0x18660b950 ; CodeStage.AntiCheat.ObscuredTypes.ObscuredInt.op_Implicit [237419]
00000001805da26f: movups   xmm0, xmmword ptr [rax]
00000001805da272: mov      edx, dword ptr [rax + 0x10]
00000001805da275: mov      rax, qword ptr [rip + 0x8359124] ; TypeInfo Torappu.Battle.BattleOptions @0x1889333a0
00000001805da27c: mov      rcx, qword ptr [rax + 0xb8]
00000001805da283: movups   xmmword ptr [rcx + 0x94], xmm0
00000001805da28a: mov      dword ptr [rcx + 0xa4], edx
00000001805da290: mov      rax, qword ptr [rip + 0x8359109] ; TypeInfo Torappu.Battle.BattleOptions @0x1889333a0
00000001805da297: movss    xmm0, dword ptr [rip + 0x6865b15]
00000001805da29f: mov      rcx, qword ptr [rax + 0xb8]
00000001805da2a6: movzx    eax, byte ptr [rbx + 0x28]
00000001805da2aa: mov      byte ptr [rcx + 0xbd], al
00000001805da2b0: mov      rax, qword ptr [rip + 0x83590e9] ; TypeInfo Torappu.Battle.BattleOptions @0x1889333a0
00000001805da2b7: mov      rcx, qword ptr [rax + 0xb8]
00000001805da2be: movzx    eax, byte ptr [rbx + 0x29]
00000001805da2c2: mov      byte ptr [rcx + 0xbe], al
00000001805da2c8: mov      rax, qword ptr [rip + 0x83590d1] ; TypeInfo Torappu.Battle.BattleOptions @0x1889333a0
00000001805da2cf: mov      rcx, qword ptr [rax + 0xb8]
00000001805da2d6: movzx    eax, byte ptr [rbx + 0x2a]
00000001805da2da: mov      byte ptr [rcx + 0xbf], al
00000001805da2e0: movd     xmm1, dword ptr [rbx + 0x40]
00000001805da2e5: cvtdq2ps xmm1, xmm1
00000001805da2e8: call     0x1804d3d00
00000001805da2ed: cmp      byte ptr [rip + 0x86b5876], 0
00000001805da2f4: movaps   xmm6, xmm0
00000001805da2f7: mov      rdi, qword ptr [rsp + 0x78]
00000001805da2fc: jne      0x1805da311
00000001805da2fe: lea      rcx, [rip + 0x82e94bb] ; TypeInfo System.Math @0x1888c37c0
00000001805da305: call     0x18048bf00
00000001805da30a: mov      byte ptr [rip + 0x86b5859], 1
00000001805da311: mov      rcx, qword ptr [rip + 0x82e94a8] ; TypeInfo System.Math @0x1888c37c0
00000001805da318: cmp      dword ptr [rcx + 0xe0], 0
00000001805da31f: jne      0x1805da326
00000001805da321: call     0x18048c140
00000001805da326: cvtss2sd xmm6, xmm6
00000001805da32a: lea      rdx, [rsp + 0x70]
00000001805da32f: xorps    xmm0, xmm0
00000001805da332: comisd   xmm6, xmm0
00000001805da336: movaps   xmm0, xmm6
00000001805da339: jb       0x1805da377
00000001805da33b: call     0x1804d57f0
00000001805da340: movsd    xmm1, qword ptr [rip + 0x6866098]
00000001805da348: ucomisd  xmm0, xmm1
00000001805da34c: jp       0x1805da369
00000001805da34e: jne      0x1805da369
00000001805da350: movsd    xmm0, qword ptr [rsp + 0x70]
00000001805da356: cvttsd2si rax, xmm0
00000001805da35b: test     al, 1
00000001805da35d: je       0x1805da3b1
00000001805da35f: addsd    xmm0, qword ptr [rip + 0x6866081]
00000001805da367: jmp      0x1805da3b1
00000001805da369: addsd    xmm6, xmm1
00000001805da36d: movaps   xmm0, xmm6
00000001805da370: call     0x1804d3200
00000001805da375: jmp      0x1805da3b1
00000001805da377: call     0x1804d57f0
00000001805da37c: ucomisd  xmm0, qword ptr [rip + 0x6866074]
00000001805da384: jp       0x1805da3a1
00000001805da386: jne      0x1805da3a1
00000001805da388: movsd    xmm0, qword ptr [rsp + 0x70]
00000001805da38e: cvttsd2si rax, xmm0
00000001805da393: test     al, 1
00000001805da395: je       0x1805da3b1
00000001805da397: subsd    xmm0, qword ptr [rip + 0x6866049]
00000001805da39f: jmp      0x1805da3b1
00000001805da3a1: subsd    xmm6, qword ptr [rip + 0x6866037]
00000001805da3a9: movaps   xmm0, xmm6
00000001805da3ac: call     0x1804d58c0
00000001805da3b1: cvttsd2si edx, xmm0
00000001805da3b5: xor      r8d, r8d
00000001805da3b8: lea      rcx, [rsp + 0x20]
00000001805da3bd: call     0x18660b950 ; CodeStage.AntiCheat.ObscuredTypes.ObscuredInt.op_Implicit [237419]
00000001805da3c2: movups   xmm0, xmmword ptr [rax]
00000001805da3c5: mov      edx, dword ptr [rax + 0x10]
00000001805da3c8: mov      rax, qword ptr [rip + 0x8358fd1] ; TypeInfo Torappu.Battle.BattleOptions @0x1889333a0
00000001805da3cf: mov      rcx, qword ptr [rax + 0xb8]
00000001805da3d6: movups   xmmword ptr [rcx + 0xa8], xmm0
00000001805da3dd: mov      dword ptr [rcx + 0xb8], edx
00000001805da3e3: mov      rcx, qword ptr [rip + 0x833945e] ; GenericMethodInfo 282427 @0x188913848
00000001805da3ea: call     0x185339460
00000001805da3ef: movaps   xmm6, xmmword ptr [rsp + 0x50]
00000001805da3f4: test     rax, rax
00000001805da3f7: je       0x1805da4c0
00000001805da3fd: xor      r8d, r8d
00000001805da400: mov      edx, 7
00000001805da405: mov      rcx, rax
00000001805da408: call     0x183f7f2e0 ; Torappu.Setting.SettingManager.GetData [54483]
00000001805da40d: mov      r8, qword ptr [rip + 0x836ec4c] ; TypeInfo bool @0x188949060
00000001805da414: test     rax, rax
00000001805da417: je       0x1805da4c0
00000001805da41d: mov      rcx, qword ptr [r8 + 0x40]
00000001805da421: mov      rdx, qword ptr [rax]
00000001805da424: cmp      qword ptr [rdx + 0x40], rcx
00000001805da428: mov      rcx, rax
00000001805da42b: jne      0x1805da4cf
00000001805da431: call     0x18048bad0
00000001805da436: mov      rcx, qword ptr [rip + 0x8358f63] ; TypeInfo Torappu.Battle.BattleOptions @0x1889333a0
00000001805da43d: movzx    eax, byte ptr [rax]
00000001805da440: mov      rdx, qword ptr [rcx + 0xb8]
00000001805da447: mov      byte ptr [rdx + 0xbc], al
00000001805da44d: mov      rcx, qword ptr [rip + 0x83393f4] ; GenericMethodInfo 282427 @0x188913848
00000001805da454: call     0x185339460
00000001805da459: test     rax, rax
00000001805da45c: je       0x1805da4c0
00000001805da45e: xor      r8d, r8d
00000001805da461: mov      edx, 0x15
00000001805da466: mov      rcx, rax
00000001805da469: call     0x183f7f2e0 ; Torappu.Setting.SettingManager.GetData [54483]
00000001805da46e: mov      r8, qword ptr [rip + 0x826e83b] ; TypeInfo int @0x188848cb0
00000001805da475: test     rax, rax
00000001805da478: je       0x1805da4c0
00000001805da47a: mov      rcx, qword ptr [r8 + 0x40]
00000001805da47e: mov      rdx, qword ptr [rax]
00000001805da481: cmp      qword ptr [rdx + 0x40], rcx
00000001805da485: mov      rcx, rax
00000001805da488: jne      0x1805da4c6
00000001805da48a: call     0x18048bad0
00000001805da48f: cmp      dword ptr [rax], 0
00000001805da492: mov      rax, qword ptr [rip + 0x8358f07] ; TypeInfo Torappu.Battle.BattleOptions @0x1889333a0
00000001805da499: sete     dl
00000001805da49c: mov      rcx, qword ptr [rax + 0xb8]
00000001805da4a3: mov      byte ptr [rcx + 0xc0], dl
00000001805da4a9: xor      edx, edx
00000001805da4ab: mov      rcx, rsi
00000001805da4ae: mov      rbx, qword ptr [rsp + 0x80]
00000001805da4b6: add      rsp, 0x60
00000001805da4ba: pop      rsi
00000001805da4bb: jmp      0x1805da720 ; Torappu.Battle.BattleOptions._LoadMapTheme [62949]
00000001805da4c0: call     0x18048c0b0
00000001805da4c5: int3     
00000001805da4c6: mov      rdx, r8
00000001805da4c9: call     0x18048ba10
00000001805da4ce: int3     
00000001805da4cf: mov      rdx, r8
00000001805da4d2: call     0x18048ba10
00000001805da4d7: int3     
00000001805da4d8: int3     
00000001805da4d9: int3     
00000001805da4da: int3     
00000001805da4db: int3     
00000001805da4dc: int3     
00000001805da4dd: int3     
00000001805da4de: int3     
00000001805da4df: int3     
