; Torappu.Battle.BattleController.Update metadata=64823 token=0x600fd38 VA=0x180635090 RVA=0x635090 size=0x2d0
0000000180635090: push     rbx
0000000180635092: sub      rsp, 0xb0
0000000180635099: cmp      byte ptr [rip + 0x865b0c2], 0
00000001806350a0: mov      rbx, rcx
00000001806350a3: jne      0x1806350b8
00000001806350a5: lea      rcx, [rip + 0x82f2cb4] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
00000001806350ac: call     0x18048bf00
00000001806350b1: mov      byte ptr [rip + 0x865b0aa], 1
00000001806350b8: mov      rcx, qword ptr [rip + 0x82f2ca1] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
00000001806350bf: cmp      dword ptr [rcx + 0xe0], 0
00000001806350c6: jne      0x1806350d4
00000001806350c8: call     0x18048c140
00000001806350cd: mov      rcx, qword ptr [rip + 0x82f2c8c] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
00000001806350d4: mov      rax, qword ptr [rcx + 0xb8]
00000001806350db: mov      r9, qword ptr [rax + 0xc60]
00000001806350e2: test     r9, r9
00000001806350e5: jne      0x18063533f
00000001806350eb: cmp      byte ptr [rip + 0x865b06e], r9b
00000001806350f2: jne      0x180635132
00000001806350f4: lea      rcx, [rip + 0x82f2c65] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
00000001806350fb: call     0x18048bf00
0000000180635100: lea      rcx, [rip + 0x81e0431] ; TypeInfo Torappu.ObjectPool.PoolManager @0x188815538
0000000180635107: call     0x18048bf00
000000018063510c: lea      rcx, [rip + 0x81f28e5] ; GenericMethodInfo 167632 @0x1888279f8
0000000180635113: call     0x18048bf00
0000000180635118: lea      rcx, [rip + 0x81f2d59] ; GenericMethodInfo 167646 @0x188827e78
000000018063511f: call     0x18048bf00
0000000180635124: mov      rcx, qword ptr [rip + 0x82f2c35] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
000000018063512b: mov      byte ptr [rip + 0x865b02e], 1
0000000180635132: cmp      dword ptr [rcx + 0xe0], 0
0000000180635139: jne      0x180635147
000000018063513b: call     0x18048c140
0000000180635140: mov      rcx, qword ptr [rip + 0x82f2c19] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
0000000180635147: mov      rax, qword ptr [rcx + 0xb8]
000000018063514e: mov      qword ptr [rsp + 0xc0], rsi
0000000180635156: mov      qword ptr [rsp + 0xc8], rdi
000000018063515e: mov      rcx, qword ptr [rax + 0xc50]
0000000180635165: test     rcx, rcx
0000000180635168: jne      0x180635279
000000018063516e: xor      edx, edx
0000000180635170: mov      rcx, rbx
0000000180635173: call     0x180644380 ; Torappu.Battle.BattleController.get_state [64558]
0000000180635178: cmp      eax, 1
000000018063517b: je       0x180635197
000000018063517d: xor      edx, edx
000000018063517f: mov      rcx, rbx
0000000180635182: call     0x180644380 ; Torappu.Battle.BattleController.get_state [64558]
0000000180635187: cmp      eax, 2
000000018063518a: jne      0x180635284
0000000180635190: mov      esi, 1
0000000180635195: jmp      0x18063519c
0000000180635197: mov      esi, 2
000000018063519c: xor      edi, edi
000000018063519e: nop      
00000001806351a0: mov      rax, qword ptr [rbx + 0x290]
00000001806351a7: test     rax, rax
00000001806351aa: je       0x180635355
00000001806351b0: cmp      dword ptr [rax + 0x20], 0
00000001806351b4: je       0x180635284
00000001806351ba: nop      word ptr [rax + rax]
00000001806351c0: mov      rax, qword ptr [rbx + 0x290]
00000001806351c7: test     rax, rax
00000001806351ca: je       0x180635355
00000001806351d0: cmp      dword ptr [rax + 0x20], 0
00000001806351d4: jle      0x18063526d
00000001806351da: mov      rdx, rax
00000001806351dd: test     rax, rax
00000001806351e0: je       0x180635355
00000001806351e6: mov      r8, qword ptr [rip + 0x81f280b] ; GenericMethodInfo 167632 @0x1888279f8
00000001806351ed: lea      rcx, [rsp + 0x20]
00000001806351f2: call     0x1851be210
00000001806351f7: mov      rcx, qword ptr [rip + 0x81e033a] ; TypeInfo Torappu.ObjectPool.PoolManager @0x188815538
00000001806351fe: cmp      dword ptr [rcx + 0xe0], 0
0000000180635205: jne      0x18063520c
0000000180635207: call     0x18048c140
000000018063520c: mov      rcx, qword ptr [rsp + 0x28]
0000000180635211: xor      edx, edx
0000000180635213: call     0x182a495d0 ; Torappu.ObjectPool.PoolManager.ContainsPool [34621]
0000000180635218: test     al, al
000000018063521a: jne      0x1806351c0
000000018063521c: mov      rcx, qword ptr [rip + 0x81e0315] ; TypeInfo Torappu.ObjectPool.PoolManager @0x188815538
0000000180635223: cmp      dword ptr [rcx + 0xe0], 0
000000018063522a: jne      0x180635231
000000018063522c: call     0x18048c140
0000000180635231: movups   xmm0, xmmword ptr [rsp + 0x20]
0000000180635236: xor      edx, edx
0000000180635238: lea      rcx, [rsp + 0x60]
000000018063523d: movups   xmm1, xmmword ptr [rsp + 0x30]
0000000180635242: movaps   xmmword ptr [rsp + 0x60], xmm0
0000000180635247: movups   xmm0, xmmword ptr [rsp + 0x40]
000000018063524c: movaps   xmmword ptr [rsp + 0x70], xmm1
0000000180635251: movsd    xmm1, qword ptr [rsp + 0x50]
0000000180635257: movaps   xmmword ptr [rsp + 0x80], xmm0
000000018063525f: movsd    qword ptr [rsp + 0x90], xmm1
0000000180635268: call     0x182a49770 ; Torappu.ObjectPool.PoolManager.LoadPool [34618]
000000018063526d: inc      edi
000000018063526f: cmp      edi, esi
0000000180635271: jl       0x1806351a0
0000000180635277: jmp      0x180635284
0000000180635279: xor      r8d, r8d
000000018063527c: mov      rdx, rbx
000000018063527f: call     0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
0000000180635284: cmp      byte ptr [rip + 0x865adb9], 0
000000018063528b: jne      0x1806352a0
000000018063528d: lea      rcx, [rip + 0x82f2acc] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
0000000180635294: call     0x18048bf00
0000000180635299: mov      byte ptr [rip + 0x865ada4], 1
00000001806352a0: mov      rax, qword ptr [rip + 0x82f2ab9] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
00000001806352a7: cmp      dword ptr [rax + 0xe0], 0
00000001806352ae: jne      0x1806352bf
00000001806352b0: mov      rcx, rax
00000001806352b3: call     0x18048c140
00000001806352b8: mov      rax, qword ptr [rip + 0x82f2aa1] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
00000001806352bf: mov      rax, qword ptr [rax + 0xb8]
00000001806352c6: mov      rcx, qword ptr [rax + 0x350]
00000001806352cd: test     rcx, rcx
00000001806352d0: jne      0x1806352ec
00000001806352d2: xor      edx, edx
00000001806352d4: mov      rcx, rbx
00000001806352d7: call     0x1806429c0 ; Torappu.Battle.BattleController.get_isPlaying [64531]
00000001806352dc: test     al, al
00000001806352de: je       0x180635326
00000001806352e0: xor      edx, edx
00000001806352e2: mov      rcx, rbx
00000001806352e5: call     0x180642920 ; Torappu.Battle.BattleController.get_isPaused [64566]
00000001806352ea: jmp      0x1806352f7
00000001806352ec: xor      r8d, r8d
00000001806352ef: mov      rdx, rbx
00000001806352f2: call     0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
00000001806352f7: test     al, al
00000001806352f9: jne      0x180635326
00000001806352fb: movaps   xmmword ptr [rsp + 0xa0], xmm6
0000000180635303: movss    xmm6, dword ptr [rbx + 0x284]
000000018063530b: xor      ecx, ecx
000000018063530d: call     0x186b711a0
0000000180635312: addss    xmm0, xmm6
0000000180635316: movaps   xmm6, xmmword ptr [rsp + 0xa0]
000000018063531e: movss    dword ptr [rbx + 0x284], xmm0
0000000180635326: mov      rsi, qword ptr [rsp + 0xc0]
000000018063532e: mov      rdi, qword ptr [rsp + 0xc8]
0000000180635336: add      rsp, 0xb0
000000018063533d: pop      rbx
000000018063533e: ret      
000000018063533f: xor      r8d, r8d
0000000180635342: mov      rdx, rbx
0000000180635345: mov      rcx, r9
0000000180635348: add      rsp, 0xb0
000000018063534f: pop      rbx
0000000180635350: jmp      0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
0000000180635355: call     0x18048c0b0
000000018063535a: int3     
000000018063535b: int3     
000000018063535c: int3     
000000018063535d: int3     
000000018063535e: int3     
000000018063535f: int3     