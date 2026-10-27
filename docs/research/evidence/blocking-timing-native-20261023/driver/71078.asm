; Torappu.Battle.ObjectManager.OnLateFixedUpdate metadata=71078 token=0x60115a7 VA=0x1808d54d0 RVA=0x8d54d0 size=0x1d0
00000001808d54d0: push     rbx
00000001808d54d2: push     rsi
00000001808d54d3: sub      rsp, 0x28
00000001808d54d7: cmp      byte ptr [rip + 0x83bc26f], 0
00000001808d54de: mov      rbx, rdx
00000001808d54e1: mov      rsi, rcx
00000001808d54e4: jne      0x1808d5535
00000001808d54e6: lea      rcx, [rip + 0x7f86cbb] ; GenericMethodInfo 270124 @0x18885c1a8
00000001808d54ed: call     0x18048bf00
00000001808d54f2: lea      rcx, [rip + 0x7f86edf] ; GenericMethodInfo 270125 @0x18885c3d8
00000001808d54f9: call     0x18048bf00
00000001808d54fe: lea      rcx, [rip + 0x7f8710b] ; GenericMethodInfo 270126 @0x18885c610
00000001808d5505: call     0x18048bf00
00000001808d550a: lea      rcx, [rip + 0x7f8732f] ; GenericMethodInfo 270127 @0x18885c840
00000001808d5511: call     0x18048bf00
00000001808d5516: lea      rcx, [rip + 0x809b3a3] ; GenericMethodInfo 280718 @0x1889708c0
00000001808d551d: call     0x18048bf00
00000001808d5522: lea      rcx, [rip + 0x809b5d7] ; GenericMethodInfo 280719 @0x188970b00
00000001808d5529: call     0x18048bf00
00000001808d552e: mov      byte ptr [rip + 0x83bc218], 1
00000001808d5535: mov      rcx, qword ptr [rsi + 0x10]
00000001808d5539: mov      qword ptr [rsp + 0x40], rbp
00000001808d553e: mov      qword ptr [rsp + 0x48], rdi
00000001808d5543: mov      qword ptr [rsp + 0x50], r14
00000001808d5548: mov      qword ptr [rsp + 0x20], r15
00000001808d554d: test     rcx, rcx
00000001808d5550: je       0x1808d5691
00000001808d5556: mov      rdx, qword ptr [rip + 0x809b5a3] ; GenericMethodInfo 280719 @0x188970b00
00000001808d555d: call     0x1848dd0d0
00000001808d5562: mov      rcx, qword ptr [rsi + 0x18]
00000001808d5566: mov      r15d, eax
00000001808d5569: test     rcx, rcx
00000001808d556c: je       0x1808d5691
00000001808d5572: mov      r8d, dword ptr [rcx + 0x18]
00000001808d5576: xor      ebp, ebp
00000001808d5578: inc      dword ptr [rcx + 0x1c]
00000001808d557b: mov      dword ptr [rcx + 0x18], ebp
00000001808d557e: test     r8d, r8d
00000001808d5581: jle      0x1808d5591
00000001808d5583: mov      rcx, qword ptr [rcx + 0x10]
00000001808d5587: xor      r9d, r9d
00000001808d558a: xor      edx, edx
00000001808d558c: call     0x185ee99a0
00000001808d5591: mov      edi, ebp
00000001808d5593: test     r15d, r15d
00000001808d5596: jle      0x1808d5613
00000001808d5598: nop      dword ptr [rax + rax]
00000001808d55a0: mov      rcx, qword ptr [rsi + 0x10]
00000001808d55a4: test     rcx, rcx
00000001808d55a7: je       0x1808d5691
00000001808d55ad: mov      r8, qword ptr [rip + 0x809b30c] ; GenericMethodInfo 280718 @0x1889708c0
00000001808d55b4: mov      edx, edi
00000001808d55b6: call     0x184ac5e60
00000001808d55bb: test     rax, rax
00000001808d55be: je       0x1808d5691
00000001808d55c4: xor      edx, edx
00000001808d55c6: mov      rcx, rax
00000001808d55c9: call     0x180663080 ; Torappu.Battle.BObject.get_validAndBorned [65019]
00000001808d55ce: test     al, al
00000001808d55d0: je       0x1808d560c
00000001808d55d2: mov      rcx, qword ptr [rsi + 0x10]
00000001808d55d6: mov      r14, qword ptr [rsi + 0x18]
00000001808d55da: test     rcx, rcx
00000001808d55dd: je       0x1808d5691
00000001808d55e3: mov      r8, qword ptr [rip + 0x809b2d6] ; GenericMethodInfo 280718 @0x1889708c0
00000001808d55ea: mov      edx, edi
00000001808d55ec: call     0x184ac5e60
00000001808d55f1: test     r14, r14
00000001808d55f4: je       0x1808d5691
00000001808d55fa: mov      r8, qword ptr [rip + 0x7f86ba7] ; GenericMethodInfo 270124 @0x18885c1a8
00000001808d5601: mov      rdx, rax
00000001808d5604: mov      rcx, r14
00000001808d5607: call     0x1805072d0
00000001808d560c: inc      edi
00000001808d560e: cmp      edi, r15d
00000001808d5611: jl       0x1808d55a0
00000001808d5613: mov      r14, qword ptr [rsi + 0x18]
00000001808d5617: test     r14, r14
00000001808d561a: je       0x1808d5691
00000001808d561c: mov      r14d, dword ptr [r14 + 0x18]
00000001808d5620: test     r14d, r14d
00000001808d5623: jle      0x1808d5676
00000001808d5625: mov      rcx, qword ptr [rsi + 0x18]
00000001808d5629: test     rcx, rcx
00000001808d562c: je       0x1808d5691
00000001808d562e: mov      r8, qword ptr [rip + 0x7f8720b] ; GenericMethodInfo 270127 @0x18885c840
00000001808d5635: mov      edx, ebp
00000001808d5637: call     0x184afcf00
00000001808d563c: mov      rdi, rax
00000001808d563f: test     rax, rax
00000001808d5642: je       0x1808d5691
00000001808d5644: cmp      byte ptr [rip + 0x83f71a5], 0
00000001808d564b: jbe      0x1808d5655
00000001808d564d: mov      rcx, qword ptr [rax]
00000001808d5650: call     0x180446d00
00000001808d5655: mov      r8, qword ptr [rdi]
00000001808d5658: mov      rdx, rbx
00000001808d565b: mov      rcx, rdi
00000001808d565e: mov      r9, qword ptr [r8 + 0x300]
00000001808d5665: mov      r8, qword ptr [r8 + 0x308]
00000001808d566c: call     r9
00000001808d566f: inc      ebp
00000001808d5671: cmp      ebp, r14d
00000001808d5674: jl       0x1808d5625
00000001808d5676: mov      r15, qword ptr [rsp + 0x20]
00000001808d567b: mov      r14, qword ptr [rsp + 0x50]
00000001808d5680: mov      rdi, qword ptr [rsp + 0x48]
00000001808d5685: mov      rbp, qword ptr [rsp + 0x40]
00000001808d568a: add      rsp, 0x28
00000001808d568e: pop      rsi
00000001808d568f: pop      rbx
00000001808d5690: ret      
00000001808d5691: call     0x18048c0b0
00000001808d5696: int3     
00000001808d5697: int3     
00000001808d5698: int3     
00000001808d5699: int3     
00000001808d569a: int3     
00000001808d569b: int3     
00000001808d569c: int3     
00000001808d569d: int3     
00000001808d569e: int3     
00000001808d569f: int3     