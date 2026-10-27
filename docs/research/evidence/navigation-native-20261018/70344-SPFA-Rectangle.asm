; Torappu.Battle.SPFA._CheckRectangeAllClear metadata=70344 token=0x60112c9 VA=0x1808a5700 RVA=0x8a5700 size=0x160
00000001808a5700: mov      qword ptr [rsp + 0x18], r8
00000001808a5705: mov      qword ptr [rsp + 0x10], rdx
00000001808a570a: push     rbx
00000001808a570b: push     rsi
00000001808a570c: push     rdi
00000001808a570d: push     r15
00000001808a570f: sub      rsp, 0x48
00000001808a5713: cmp      byte ptr [rip + 0x83ebdff], 0
00000001808a571a: mov      r15d, r9d
00000001808a571d: mov      rdi, r8
00000001808a5720: mov      rbx, rdx
00000001808a5723: mov      rsi, rcx
00000001808a5726: jne      0x1808a573b
00000001808a5728: lea      rcx, [rip + 0x7f8bb51] ; TypeInfo Torappu.Battle.SPFA @0x188831280
00000001808a572f: call     0x18048bf00
00000001808a5734: mov      byte ptr [rip + 0x83ebdde], 1
00000001808a573b: mov      rax, qword ptr [rip + 0x7f8bb3e] ; TypeInfo Torappu.Battle.SPFA @0x188831280
00000001808a5742: cmp      dword ptr [rax + 0xe0], 0
00000001808a5749: jne      0x1808a575a
00000001808a574b: mov      rcx, rax
00000001808a574e: call     0x18048c140
00000001808a5753: mov      rax, qword ptr [rip + 0x7f8bb26] ; TypeInfo Torappu.Battle.SPFA @0x188831280
00000001808a575a: mov      rax, qword ptr [rax + 0xb8]
00000001808a5761: mov      rcx, qword ptr [rax + 0x80]
00000001808a5768: test     rcx, rcx
00000001808a576b: jne      0x1808a581f
00000001808a5771: mov      qword ptr [rsp + 0x88], r12
00000001808a5779: mov      qword ptr [rsp + 0x40], r14
00000001808a577e: mov      qword ptr [rsp + 0x70], rbp
00000001808a5783: cmp      ebx, edi
00000001808a5785: mov      r12d, ebx
00000001808a5788: cmovle   r12d, edi
00000001808a578c: mov      esi, dword ptr [rsp + 0x7c]
00000001808a5790: mov      r14d, esi
00000001808a5793: mov      eax, dword ptr [rsp + 0x84]
00000001808a579a: cmp      esi, eax
00000001808a579c: cmovge   r14d, eax
00000001808a57a0: cmovle   esi, eax
00000001808a57a3: cmp      ebx, edi
00000001808a57a5: cmovge   ebx, edi
00000001808a57a8: cmp      ebx, r12d
00000001808a57ab: jg       0x1808a57fd
00000001808a57ad: mov      rbp, qword ptr [rsp + 0x90]
00000001808a57b5: cmp      r14d, esi
00000001808a57b8: jg       0x1808a57f6
00000001808a57ba: nop      word ptr [rax + rax]
00000001808a57c0: mov      edi, r14d
00000001808a57c3: test     rbp, rbp
00000001808a57c6: je       0x1808a5852
00000001808a57cc: nop      dword ptr [rax]
00000001808a57d0: movsxd   r8, edi
00000001808a57d3: mov      rcx, rbp
00000001808a57d6: movsxd   rdx, ebx
00000001808a57d9: call     0x1800169b0
00000001808a57de: xor      r8d, r8d
00000001808a57e1: mov      edx, r15d
00000001808a57e4: mov      rcx, rax
00000001808a57e7: call     0x1808a08a0 ; Torappu.Battle.Route.Node.CheckObstacleLikeOrInvalid [70394]
00000001808a57ec: test     al, al
00000001808a57ee: jne      0x1808a581b
00000001808a57f0: inc      edi
00000001808a57f2: cmp      edi, esi
00000001808a57f4: jle      0x1808a57d0
00000001808a57f6: inc      ebx
00000001808a57f8: cmp      ebx, r12d
00000001808a57fb: jle      0x1808a57b5
00000001808a57fd: mov      al, 1
00000001808a57ff: mov      rbp, qword ptr [rsp + 0x70]
00000001808a5804: mov      r12, qword ptr [rsp + 0x88]
00000001808a580c: mov      r14, qword ptr [rsp + 0x40]
00000001808a5811: add      rsp, 0x48
00000001808a5815: pop      r15
00000001808a5817: pop      rdi
00000001808a5818: pop      rsi
00000001808a5819: pop      rbx
00000001808a581a: ret      
00000001808a581b: xor      al, al
00000001808a581d: jmp      0x1808a57ff
00000001808a581f: mov      rax, qword ptr [rsp + 0x90]
00000001808a5827: mov      r9, rdi
00000001808a582a: mov      qword ptr [rsp + 0x30], 0
00000001808a5833: mov      r8, rbx
00000001808a5836: mov      qword ptr [rsp + 0x28], rax
00000001808a583b: mov      rdx, rsi
00000001808a583e: mov      dword ptr [rsp + 0x20], r15d
00000001808a5843: call     0x183365dd0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3350 [6005]
00000001808a5848: add      rsp, 0x48
00000001808a584c: pop      r15
00000001808a584e: pop      rdi
00000001808a584f: pop      rsi
00000001808a5850: pop      rbx
00000001808a5851: ret      
00000001808a5852: call     0x18048c0b0
00000001808a5857: int3     
00000001808a5858: int3     
00000001808a5859: int3     
00000001808a585a: int3     
00000001808a585b: int3     
00000001808a585c: int3     
00000001808a585d: int3     
00000001808a585e: int3     
00000001808a585f: int3     