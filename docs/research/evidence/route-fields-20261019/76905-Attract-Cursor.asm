; Torappu.Battle.Enemy.AttractController.UpdateAttractCursor metadata=76905 token=0x6012c6a VA=0x180a87190 RVA=0xa87190 size=0x3d0
0000000180a87190: mov      qword ptr [rsp + 0x10], rbx
0000000180a87195: mov      qword ptr [rsp + 0x18], rsi
0000000180a8719a: push     rdi
0000000180a8719b: sub      rsp, 0xd0
0000000180a871a2: cmp      byte ptr [rip + 0x820b831], 0
0000000180a871a9: movzx    edi, dl
0000000180a871ac: mov      rbx, rcx
0000000180a871af: jne      0x180a87230
0000000180a871b1: lea      rcx, [rip + 0x7dba200] ; GenericMethodInfo 287057 @0x1888413b8
0000000180a871b8: call     0x18048bf00
0000000180a871bd: lea      rcx, [rip + 0x7ee5f34] ; TypeInfo Torappu.Battle.DirectionCursor @0x18896d0f8
0000000180a871c4: call     0x18048bf00
0000000180a871c9: lea      rcx, [rip + 0x7d86f78] ; GenericMethodInfo 292361 @0x18880e148
0000000180a871d0: call     0x18048bf00
0000000180a871d5: lea      rcx, [rip + 0x7e3ed94] ; GenericMethodInfo 263038 @0x1888c5f70
0000000180a871dc: call     0x18048bf00
0000000180a871e1: lea      rcx, [rip + 0x7db40f0] ; GenericMethodInfo 267308 @0x18883b2d8
0000000180a871e8: call     0x18048bf00
0000000180a871ed: lea      rcx, [rip + 0x7eaa4b4] ; GenericMethodInfo 280349 @0x1889316a8
0000000180a871f4: call     0x18048bf00
0000000180a871f9: lea      rcx, [rip + 0x7eaa928] ; GenericMethodInfo 280351 @0x188931b28
0000000180a87200: call     0x18048bf00
0000000180a87205: lea      rcx, [rip + 0x7eaad9c] ; GenericMethodInfo 280353 @0x188931fa8
0000000180a8720c: call     0x18048bf00
0000000180a87211: lea      rcx, [rip + 0x7eaafd0] ; GenericMethodInfo 280354 @0x1889321e8
0000000180a87218: call     0x18048bf00
0000000180a8721d: lea      rcx, [rip + 0x7e58f24] ; GenericMethodInfo 282061 @0x1888e0148
0000000180a87224: call     0x18048bf00
0000000180a87229: mov      byte ptr [rip + 0x820b7aa], 1
0000000180a87230: mov      rcx, qword ptr [rip + 0x7e58f11] ; GenericMethodInfo 282061 @0x1888e0148
0000000180a87237: xorps    xmm0, xmm0
0000000180a8723a: mov      qword ptr [rsp + 0xe0], rbp
0000000180a87242: movaps   xmmword ptr [rsp + 0xc0], xmm6
0000000180a8724a: movaps   xmmword ptr [rsp + 0xb0], xmm7
0000000180a87252: movaps   xmmword ptr [rsp + 0xa0], xmm8
0000000180a8725b: movups   xmmword ptr [rsp + 0x50], xmm0
0000000180a87260: call     0x185337c50
0000000180a87265: mov      rcx, qword ptr [rbx + 0x10]
0000000180a87269: mov      rsi, rax
0000000180a8726c: test     rcx, rcx
0000000180a8726f: je       0x180a87545
0000000180a87275: xor      edx, edx
0000000180a87277: call     0x180ad4090 ; Torappu.Battle.VisualObject.get_gridPosition [77871]
0000000180a8727c: test     rsi, rsi
0000000180a8727f: je       0x180a87545
0000000180a87285: xor      r8d, r8d
0000000180a87288: mov      rdx, rax
0000000180a8728b: mov      rcx, rsi
0000000180a8728e: call     0x18087a3a0 ; Torappu.Battle.Map.CheckGridValid [70066]
0000000180a87293: test     al, al
0000000180a87295: je       0x180a87450
0000000180a8729b: mov      rax, qword ptr [rbx + 0x18]
0000000180a8729f: test     rax, rax
0000000180a872a2: je       0x180a87545
0000000180a872a8: nop      dword ptr [rax + rax]
0000000180a872b0: cmp      dword ptr [rax + 0x18], 0
0000000180a872b4: jle      0x180a87450
0000000180a872ba: mov      r8, qword ptr [rip + 0x7dba0f7] ; GenericMethodInfo 287057 @0x1888413b8
0000000180a872c1: lea      rcx, [rsp + 0x80]
0000000180a872c9: mov      rdx, qword ptr [rbx + 0x18]
0000000180a872cd: call     0x1844acf60
0000000180a872d2: movups   xmm6, xmmword ptr [rsp + 0x80]
0000000180a872da: mov      r8, qword ptr [rip + 0x7eaacc7] ; GenericMethodInfo 280353 @0x188931fa8
0000000180a872e1: lea      rcx, [rsp + 0x60]
0000000180a872e6: xor      edx, edx
0000000180a872e8: movups   xmmword ptr [rsp + 0x50], xmm6
0000000180a872ed: call     0x18515a130
0000000180a872f2: movaps   xmm0, xmmword ptr [rsp + 0x60]
0000000180a872f7: lea      rdx, [rsp + 0x70]
0000000180a872fc: mov      r8, qword ptr [rip + 0x7eaaee5] ; GenericMethodInfo 280354 @0x1889321e8
0000000180a87303: lea      rcx, [rsp + 0x80]
0000000180a8730b: movdqa   xmmword ptr [rsp + 0x70], xmm0
0000000180a87311: movaps   xmmword ptr [rsp + 0x80], xmm6
0000000180a87319: call     0x18515a180
0000000180a8731e: test     al, al
0000000180a87320: je       0x180a87337
0000000180a87322: mov      rdx, qword ptr [rip + 0x7eaa7ff] ; GenericMethodInfo 280351 @0x188931b28
0000000180a87329: lea      rcx, [rsp + 0x50]
0000000180a8732e: call     0x185159fc0
0000000180a87333: test     al, al
0000000180a87335: jne      0x180a87364
0000000180a87337: mov      r8, qword ptr [rip + 0x7d86e0a] ; GenericMethodInfo 292361 @0x18880e148
0000000180a8733e: lea      rcx, [rsp + 0x80]
0000000180a87346: mov      rdx, qword ptr [rbx + 0x18]
0000000180a8734a: call     0x1844d21b0
0000000180a8734f: mov      rax, qword ptr [rbx + 0x18]
0000000180a87353: mov      dil, 1
0000000180a87356: test     rax, rax
0000000180a87359: je       0x180a87545
0000000180a8735f: jmp      0x180a872b0
0000000180a87364: test     dil, dil
0000000180a87367: jne      0x180a873ac
0000000180a87369: cmp      qword ptr [rbx + 0x20], 0
0000000180a8736e: je       0x180a873ac
0000000180a87370: mov      rcx, qword ptr [rbx + 0x20]
0000000180a87374: xor      edx, edx
0000000180a87376: call     0x180898140 ; Torappu.Battle.DirectionCursor.get_cursorIndex [70265]
0000000180a8737b: mov      rcx, qword ptr [rbx + 0x20]
0000000180a8737f: mov      edi, eax
0000000180a87381: test     rcx, rcx
0000000180a87384: je       0x180a87545
0000000180a8738a: xor      edx, edx
0000000180a8738c: call     0x180877390 ; Torappu.Battle.BasicCursor.get_route [70151]
0000000180a87391: test     rax, rax
0000000180a87394: je       0x180a87545
0000000180a8739a: xor      edx, edx
0000000180a8739c: mov      rcx, rax
0000000180a8739f: call     0x1808a4420 ; Torappu.Battle.Route.get_checkpointCnt [70354]
0000000180a873a4: cmp      edi, eax
0000000180a873a6: jl       0x180a87450
0000000180a873ac: xor      edx, edx
0000000180a873ae: mov      rcx, rbx
0000000180a873b1: call     0x180a87560 ; Torappu.Battle.Enemy.AttractController._InitializeAttractRouteData [76907]
0000000180a873b6: mov      rdx, qword ptr [rip + 0x7eaa2eb] ; GenericMethodInfo 280349 @0x1889316a8
0000000180a873bd: lea      rcx, [rsp + 0x50]
0000000180a873c2: mov      rdi, rax
0000000180a873c5: call     0x185159d80
0000000180a873ca: xor      r9d, r9d
0000000180a873cd: mov      r8, rax
0000000180a873d0: mov      rdx, rdi
0000000180a873d3: mov      rcx, rbx
0000000180a873d6: call     0x180a87750 ; Torappu.Battle.Enemy.AttractController._TryGetAttractRouteReachable [76908]
0000000180a873db: test     al, al
0000000180a873dd: je       0x180a87436
0000000180a873df: mov      rcx, qword ptr [rbx + 0x10]
0000000180a873e3: test     rcx, rcx
0000000180a873e6: je       0x180a87545
0000000180a873ec: xor      edx, edx
0000000180a873ee: call     0x180ad4090 ; Torappu.Battle.VisualObject.get_gridPosition [77871]
0000000180a873f3: test     rdi, rdi
0000000180a873f6: je       0x180a87545
0000000180a873fc: mov      rcx, qword ptr [rdi + 0x38]
0000000180a87400: test     rcx, rcx
0000000180a87403: je       0x180a87545
0000000180a87409: cmp      dword ptr [rcx + 0x18], 0
0000000180a8740d: jbe      0x180a8754b
0000000180a87413: mov      rdx, qword ptr [rcx + 0x20]
0000000180a87417: test     rdx, rdx
0000000180a8741a: je       0x180a87545
0000000180a87420: mov      qword ptr [rdx + 0x18], rax
0000000180a87424: xor      r8d, r8d
0000000180a87427: mov      rdx, rdi
0000000180a8742a: mov      qword ptr [rdi + 0x1c], rax
0000000180a8742e: mov      rcx, rbx
0000000180a87431: call     0x180a878b0 ; Torappu.Battle.Enemy.AttractController._UpdateAttractRoute [76909]
0000000180a87436: cmp      qword ptr [rbx + 0x20], 0
0000000180a8743b: mov      rdi, qword ptr [rbx + 0x28]
0000000180a8743f: je       0x180a87486
0000000180a87441: mov      rcx, qword ptr [rbx + 0x20]
0000000180a87445: xor      r8d, r8d
0000000180a87448: mov      rdx, rdi
0000000180a8744b: call     0x180875fa0 ; Torappu.Battle.BasicCursor.OnRouteChanged [70159]
0000000180a87450: movaps   xmm8, xmmword ptr [rsp + 0xa0]
0000000180a87459: lea      r11, [rsp + 0xd0]
0000000180a87461: mov      rbx, qword ptr [r11 + 0x18]
0000000180a87465: mov      rsi, qword ptr [r11 + 0x20]
0000000180a87469: movaps   xmm7, xmmword ptr [rsp + 0xb0]
0000000180a87471: movaps   xmm6, xmmword ptr [rsp + 0xc0]
0000000180a87479: mov      rbp, qword ptr [rsp + 0xe0]
0000000180a87481: mov      rsp, r11
0000000180a87484: pop      rdi
0000000180a87485: ret      
0000000180a87486: mov      rdx, qword ptr [rbx + 0x10]
0000000180a8748a: test     rdx, rdx
0000000180a8748d: je       0x180a87545
0000000180a87493: mov      ecx, 0xe0
0000000180a87498: call     0x180005610
0000000180a8749d: test     rax, rax
0000000180a874a0: je       0x180a87545
0000000180a874a6: xor      r8d, r8d
0000000180a874a9: lea      rcx, [rsp + 0x80]
0000000180a874b1: mov      rdx, rax
0000000180a874b4: call     0x1808773f0 ; Torappu.Battle.BasicCursor.get_snapshot [70152]
0000000180a874b9: xor      ecx, ecx
0000000180a874bb: movups   xmm6, xmmword ptr [rax]
0000000180a874be: movsd    xmm7, qword ptr [rax + 0x10]
0000000180a874c3: call     0x1805073b0 ; Torappu.Battle.BasicCursor.DisappearCheckpoint.GetNextDirection [70205] | Torappu.Battle.BasicCursor.AppearAtPosCheckpoint.GetNextDirection [70214] | Torappu.Battle.BasicCursor.WaitForSecondsCheckpoint.GetNextDirection [70219] | Torappu.Battle.BasicCursor.WaitForPlayTimeCheckpoint.GetNextDirection [70228] | Torappu.Battle.BasicCursor.WaitCurrentWaveTimeCheckpoint.GetNextDirection [70234] | Torappu.Battle.BasicCursor.WaitCurrentFragmentTimeCheckpoint.GetNextDirection [70240] | Torappu.Battle.BasicCursor.AlertCheckpoint.GetNextDirection [70245] | Torappu.Battle.BasicCursor.WaitBossrushWaveCheckPoint.GetNextDirection [70254]
0000000180a874c8: mov      rcx, qword ptr [rip + 0x7ee5c29] ; TypeInfo Torappu.Battle.DirectionCursor @0x18896d0f8
0000000180a874cf: mov      rbp, qword ptr [rbx + 0x10]
0000000180a874d3: movq     xmm8, rax
0000000180a874d8: call     0x18045cfe0
0000000180a874dd: mov      rsi, rax
0000000180a874e0: test     rax, rax
0000000180a874e3: je       0x180a87545
0000000180a874e5: mov      qword ptr [rsp + 0x48], 0
0000000180a874ee: lea      r8, [rsp + 0x80]
0000000180a874f6: mov      byte ptr [rsp + 0x40], 0
0000000180a874fb: movq     r9, xmm8
0000000180a87500: mov      byte ptr [rsp + 0x38], 0
0000000180a87505: mov      rdx, rdi
0000000180a87508: mov      byte ptr [rsp + 0x30], 0
0000000180a8750d: mov      rcx, rax
0000000180a87510: mov      byte ptr [rsp + 0x28], 0
0000000180a87515: mov      qword ptr [rsp + 0x20], rbp
0000000180a8751a: movaps   xmmword ptr [rsp + 0x80], xmm6
0000000180a87522: movsd    qword ptr [rsp + 0x90], xmm7
0000000180a8752b: call     0x180897ef0 ; Torappu.Battle.DirectionCursor..ctor [70270]
0000000180a87530: lea      rcx, [rbx + 0x20]
0000000180a87534: mov      qword ptr [rbx + 0x20], rsi
0000000180a87538: mov      rdx, rsi
0000000180a8753b: call     0x18048b9e0
0000000180a87540: jmp      0x180a87450
0000000180a87545: call     0x18048c0b0
0000000180a8754a: int3     
0000000180a8754b: call     0x18048c0a0
0000000180a87550: int3     
0000000180a87551: int3     
0000000180a87552: int3     
0000000180a87553: int3     
0000000180a87554: int3     
0000000180a87555: int3     
0000000180a87556: int3     
0000000180a87557: int3     
0000000180a87558: int3     
0000000180a87559: int3     
0000000180a8755a: int3     
0000000180a8755b: int3     
0000000180a8755c: int3     
0000000180a8755d: int3     
0000000180a8755e: int3     
0000000180a8755f: int3     