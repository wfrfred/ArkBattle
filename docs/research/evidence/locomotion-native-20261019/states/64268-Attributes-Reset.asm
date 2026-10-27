; Torappu.Battle.Attributes.Reset metadata=64268 token=0x600fb0d VA=0x18064a480 RVA=0x64a480 size=0x710
000000018064a480: mov      qword ptr [rsp + 0x10], rdx
000000018064a485: push     rsi
000000018064a486: push     r14
000000018064a488: push     r15
000000018064a48a: sub      rsp, 0x90
000000018064a491: cmp      byte ptr [rip + 0x8645d00], 0
000000018064a498: mov      r15, rcx
000000018064a49b: jne      0x18064a51c
000000018064a49d: lea      rcx, [rip + 0x828275c] ; TypeInfo Torappu.AttributesData @0x1888ccc00
000000018064a4a4: call     0x18048bf00
000000018064a4a9: lea      rcx, [rip + 0x8294c90] ; TypeInfo System.Convert @0x1888df140
000000018064a4b0: call     0x18048bf00
000000018064a4b5: lea      rcx, [rip + 0x8210244] ; TypeInfo Torappu.FP @0x18885a700
000000018064a4bc: call     0x18048bf00
000000018064a4c1: lea      rcx, [rip + 0x8242fa8] ; GenericMethodInfo 262743 @0x18888d470
000000018064a4c8: call     0x18048bf00
000000018064a4cd: lea      rcx, [rip + 0x8243ac4] ; GenericMethodInfo 262748 @0x18888df98
000000018064a4d4: call     0x18048bf00
000000018064a4d9: lea      rcx, [rip + 0x8243640] ; GenericMethodInfo 262746 @0x18888db20
000000018064a4e0: call     0x18048bf00
000000018064a4e5: lea      rcx, [rip + 0x82481e4] ; TypeInfo type(0x15, data=0x188b56540) @0x1888926d0
000000018064a4ec: call     0x18048bf00
000000018064a4f1: lea      rcx, [rip + 0x8202150] ; GenericMethodInfo 277299 @0x18884c648
000000018064a4f8: call     0x18048bf00
000000018064a4fd: lea      rcx, [rip + 0x820237c] ; GenericMethodInfo 277300 @0x18884c880
000000018064a504: call     0x18048bf00
000000018064a509: lea      rcx, [rip + 0x82470c8] ; TypeInfo Torappu.TSMath @0x1888915d8
000000018064a510: call     0x18048bf00
000000018064a515: mov      byte ptr [rip + 0x8645c7c], 1
000000018064a51c: mov      rcx, qword ptr [rip + 0x82826dd] ; TypeInfo Torappu.AttributesData @0x1888ccc00
000000018064a523: xor      r14d, r14d
000000018064a526: mov      esi, r14d
000000018064a529: cmp      dword ptr [rcx + 0xe0], r14d
000000018064a530: jne      0x18064a537
000000018064a532: call     0x18048c140
000000018064a537: mov      qword ptr [rsp + 0xb0], rbx
000000018064a53f: xor      ecx, ecx
000000018064a541: mov      qword ptr [rsp + 0xc0], rbp
000000018064a549: mov      qword ptr [rsp + 0xc8], rdi
000000018064a551: mov      qword ptr [rsp + 0x88], r12
000000018064a559: mov      qword ptr [rsp + 0x80], r13
000000018064a561: movaps   xmmword ptr [rsp + 0x70], xmm6
000000018064a566: call     0x18231bb70 ; Torappu.AttributesData.get_fieldMetas [30786]
000000018064a56b: test     rax, rax
000000018064a56e: je       0x18064ab73
000000018064a574: mov      r13d, dword ptr [rax + 0x18]
000000018064a578: test     r13d, r13d
000000018064a57b: jle      0x18064a75b
000000018064a581: nop      dword ptr [rax]
000000018064a585: nop      word ptr [rax + rax]
000000018064a590: mov      rcx, qword ptr [rip + 0x8282669] ; TypeInfo Torappu.AttributesData @0x1888ccc00
000000018064a597: cmp      dword ptr [rcx + 0xe0], r14d
000000018064a59e: jne      0x18064a5a5
000000018064a5a0: call     0x18048c140
000000018064a5a5: xor      ecx, ecx
000000018064a5a7: call     0x18231bb70 ; Torappu.AttributesData.get_fieldMetas [30786]
000000018064a5ac: test     rax, rax
000000018064a5af: je       0x18064ab73
000000018064a5b5: mov      r8, qword ptr [rip + 0x82022c4] ; GenericMethodInfo 277300 @0x18884c880
000000018064a5bc: mov      edx, esi
000000018064a5be: mov      rcx, rax
000000018064a5c1: call     0x184afcf00
000000018064a5c6: test     rax, rax
000000018064a5c9: je       0x18064ab73
000000018064a5cf: mov      rbx, qword ptr [rax + 0x10]
000000018064a5d3: xor      ecx, ecx
000000018064a5d5: call     0x18231bb70 ; Torappu.AttributesData.get_fieldMetas [30786]
000000018064a5da: test     rax, rax
000000018064a5dd: je       0x18064ab73
000000018064a5e3: mov      r8, qword ptr [rip + 0x8202296] ; GenericMethodInfo 277300 @0x18884c880
000000018064a5ea: mov      edx, esi
000000018064a5ec: mov      rcx, rax
000000018064a5ef: call     0x184afcf00
000000018064a5f4: test     rax, rax
000000018064a5f7: je       0x18064ab73
000000018064a5fd: mov      rdi, qword ptr [rax + 0x20]
000000018064a601: test     rdi, rdi
000000018064a604: je       0x18064a750
000000018064a60a: xor      r8d, r8d
000000018064a60d: lea      rcx, [rsp + 0x30]
000000018064a612: mov      rdx, rdi
000000018064a615: call     0x182319850 ; Torappu.AttributeMetaAttribute.GetRangeAsTVector2 [30781]
000000018064a61a: mov      r8, qword ptr [r15 + 0x60]
000000018064a61e: movups   xmm0, xmmword ptr [rax]
000000018064a621: movups   xmmword ptr [rsp + 0x20], xmm0
000000018064a626: test     r8, r8
000000018064a629: je       0x18064ab73
000000018064a62f: movsxd   rcx, dword ptr [rdi + 0x10]
000000018064a633: cmp      ecx, dword ptr [r8 + 0x18]
000000018064a637: jae      0x18064ab89
000000018064a63d: add      rcx, 2
000000018064a641: add      rcx, rcx
000000018064a644: movups   xmmword ptr [r8 + rcx*8], xmm0
000000018064a649: mov      rbp, qword ptr [r15 + 0x58]
000000018064a64d: movsxd   r12, dword ptr [rdi + 0x10]
000000018064a651: test     rbx, rbx
000000018064a654: je       0x18064ab73
000000018064a65a: mov      r8, qword ptr [rsp + 0xb8]
000000018064a662: mov      ecx, 0x1d
000000018064a667: mov      rdx, rbx
000000018064a66a: call     0x180005480
000000018064a66f: mov      rcx, qword ptr [rip + 0x828258a] ; TypeInfo Torappu.AttributesData @0x1888ccc00
000000018064a676: mov      rbx, rax
000000018064a679: cmp      dword ptr [rcx + 0xe0], r14d
000000018064a680: jne      0x18064a687
000000018064a682: call     0x18048c140
000000018064a687: xor      edx, edx
000000018064a689: mov      rcx, rbx
000000018064a68c: call     0x18231aac0 ; Torappu.AttributesData.ReadAttributesField [30790]
000000018064a691: mov      rcx, qword ptr [rip + 0x8210068] ; TypeInfo Torappu.FP @0x18885a700
000000018064a698: movaps   xmm6, xmm0
000000018064a69b: cmp      dword ptr [rcx + 0xe0], r14d
000000018064a6a2: jne      0x18064a6a9
000000018064a6a4: call     0x18048c140
000000018064a6a9: xor      edx, edx
000000018064a6ab: movaps   xmm0, xmm6
000000018064a6ae: call     0x1866fdad0 ; Torappu.FP.op_Implicit [220498]
000000018064a6b3: mov      rcx, qword ptr [rip + 0x8246f1e] ; TypeInfo Torappu.TSMath @0x1888915d8
000000018064a6ba: mov      rbx, rax
000000018064a6bd: cmp      dword ptr [rcx + 0xe0], r14d
000000018064a6c4: jne      0x18064a6cb
000000018064a6c6: call     0x18048c140
000000018064a6cb: mov      r8, qword ptr [rsp + 0x28]
000000018064a6d0: xor      r9d, r9d
000000018064a6d3: mov      rdx, qword ptr [rsp + 0x20]
000000018064a6d8: mov      rcx, rbx
000000018064a6db: call     0x1866ff2e0 ; Torappu.TSMath.Clamp [220532]
000000018064a6e0: xor      r8d, r8d
000000018064a6e3: lea      rcx, [rsp + 0x40]
000000018064a6e8: mov      rdx, rax
000000018064a6eb: call     0x1866fe6e0 ; Torappu.ObscuredFP.op_Implicit [220442]
000000018064a6f0: test     rbp, rbp
000000018064a6f3: je       0x18064ab73
000000018064a6f9: cmp      r12d, dword ptr [rbp + 0x18]
000000018064a6fd: jae      0x18064ab89
000000018064a703: movups   xmm0, xmmword ptr [rax]
000000018064a706: lea      rdx, [r12 + r12*4]
000000018064a70a: movups   xmmword ptr [rbp + rdx*8 + 0x20], xmm0
000000018064a70f: movups   xmm1, xmmword ptr [rax + 0x10]
000000018064a713: movups   xmmword ptr [rbp + rdx*8 + 0x30], xmm1
000000018064a718: movsd    xmm0, qword ptr [rax + 0x20]
000000018064a71d: movsd    qword ptr [rbp + rdx*8 + 0x40], xmm0
000000018064a723: mov      rdx, qword ptr [r15 + 0x70]
000000018064a727: test     rdx, rdx
000000018064a72a: je       0x18064ab73
000000018064a730: movsxd   rax, dword ptr [rdi + 0x10]
000000018064a734: cmp      eax, dword ptr [rdx + 0x18]
000000018064a737: jae      0x18064ab89
000000018064a73d: lea      rcx, [rax + rax*2]
000000018064a741: xorps    xmm0, xmm0
000000018064a744: xor      eax, eax
000000018064a746: movups   xmmword ptr [rdx + rcx*8 + 0x20], xmm0
000000018064a74b: mov      qword ptr [rdx + rcx*8 + 0x30], rax
000000018064a750: inc      esi
000000018064a752: cmp      esi, r13d
000000018064a755: jl       0x18064a590
000000018064a75b: mov      r12d, 0x20
000000018064a761: mov      ebx, r14d
000000018064a764: mov      esi, r12d
000000018064a767: nop      word ptr [rax + rax]
000000018064a770: mov      rax, qword ptr [r15 + 0x18]
000000018064a774: test     rax, rax
000000018064a777: je       0x18064ab73
000000018064a77d: cmp      ebx, dword ptr [rax + 0x18]
000000018064a780: jae      0x18064ab89
000000018064a786: mov      rdi, rax
000000018064a789: cmp      qword ptr [rsi + rax], r14
000000018064a78d: jne      0x18064a7f0
000000018064a78f: mov      rcx, qword ptr [rip + 0x8247f3a] ; TypeInfo type(0x15, data=0x188b56540) @0x1888926d0
000000018064a796: call     0x18045cfe0
000000018064a79b: mov      rbp, rax
000000018064a79e: test     rax, rax
000000018064a7a1: je       0x18064ab73
000000018064a7a7: mov      rdx, qword ptr [rip + 0x8243372] ; GenericMethodInfo 262746 @0x18888db20
000000018064a7ae: mov      rcx, rax
000000018064a7b1: call     0x18497c200
000000018064a7b6: mov      rdx, qword ptr [rdi]
000000018064a7b9: mov      rcx, rbp
000000018064a7bc: mov      rdx, qword ptr [rdx + 0x40]
000000018064a7c0: call     0x18048b9f0
000000018064a7c5: test     rax, rax
000000018064a7c8: je       0x18064ab79
000000018064a7ce: cmp      ebx, dword ptr [rdi + 0x18]
000000018064a7d1: jae      0x18064ab89
000000018064a7d7: movsxd   rax, ebx
000000018064a7da: mov      rdx, rbp
000000018064a7dd: add      rax, 4
000000018064a7e1: mov      qword ptr [rsi + rdi], rbp
000000018064a7e5: lea      rcx, [rdi + rax*8]
000000018064a7e9: call     0x18048b9e0
000000018064a7ee: jmp      0x18064a812
000000018064a7f0: cmp      ebx, dword ptr [rax + 0x18]
000000018064a7f3: jae      0x18064ab89
000000018064a7f9: mov      rcx, qword ptr [rsi + rax]
000000018064a7fd: test     rcx, rcx
000000018064a800: je       0x18064ab73
000000018064a806: mov      rdx, qword ptr [rip + 0x824378b] ; GenericMethodInfo 262748 @0x18888df98
000000018064a80d: call     0x18493c5e0
000000018064a812: inc      ebx
000000018064a814: add      rsi, 8
000000018064a818: cmp      ebx, 0x26
000000018064a81b: jl       0x18064a770
000000018064a821: mov      rdx, qword ptr [r15 + 0x68]
000000018064a825: xor      r9d, r9d
000000018064a828: mov      rcx, qword ptr [r15 + 0x58]
000000018064a82c: mov      r8d, 0x26
000000018064a832: call     0x185ee9f90
000000018064a837: mov      qword ptr [r15 + 0x78], r14
000000018064a83b: mov      ebx, r14d
000000018064a83e: mov      rbp, r12
000000018064a841: mov      rdi, r12
000000018064a844: nop      dword ptr [rax]
000000018064a848: nop      dword ptr [rax + rax]
000000018064a850: mov      rax, qword ptr [r15 + 0x28]
000000018064a854: test     rax, rax
000000018064a857: je       0x18064ab73
000000018064a85d: cmp      ebx, dword ptr [rax + 0x18]
000000018064a860: jae      0x18064ab89
000000018064a866: mov      word ptr [rdi + rax], r14w
000000018064a86b: mov      rax, qword ptr [r15 + 0x20]
000000018064a86f: test     rax, rax
000000018064a872: je       0x18064ab73
000000018064a878: cmp      ebx, dword ptr [rax + 0x18]
000000018064a87b: jae      0x18064ab89
000000018064a881: mov      word ptr [rdi + rax], r14w
000000018064a886: mov      rax, qword ptr [r15 + 0x30]
000000018064a88a: test     rax, rax
000000018064a88d: je       0x18064ab73
000000018064a893: cmp      ebx, dword ptr [rax + 0x18]
000000018064a896: jae      0x18064ab89
000000018064a89c: mov      word ptr [rdi + rax], r14w
000000018064a8a1: mov      rcx, qword ptr [rip + 0x820fe58] ; TypeInfo Torappu.FP @0x18885a700
000000018064a8a8: mov      rsi, qword ptr [r15 + 0x40]
000000018064a8ac: cmp      dword ptr [rcx + 0xe0], r14d
000000018064a8b3: jne      0x18064a8ba
000000018064a8b5: call     0x18048c140
000000018064a8ba: xor      edx, edx
000000018064a8bc: xor      ecx, ecx
000000018064a8be: call     0x1866fdac0 ; Torappu.FP.op_Implicit [220503]
000000018064a8c3: test     rsi, rsi
000000018064a8c6: je       0x18064ab73
000000018064a8cc: cmp      ebx, dword ptr [rsi + 0x18]
000000018064a8cf: jae      0x18064ab89
000000018064a8d5: mov      qword ptr [rsi + rbp], rax
000000018064a8d9: inc      ebx
000000018064a8db: add      rbp, 8
000000018064a8df: add      rdi, 2
000000018064a8e3: cmp      rdi, 0x7c
000000018064a8e7: jl       0x18064a850
000000018064a8ed: mov      rcx, qword ptr [r15 + 0x38]
000000018064a8f1: test     rcx, rcx
000000018064a8f4: je       0x18064ab73
000000018064a8fa: mov      rdx, qword ptr [rip + 0x8242b6f] ; GenericMethodInfo 262743 @0x18888d470
000000018064a901: call     0x18493c5e0
000000018064a906: mov      rdx, qword ptr [r15 + 0x50]
000000018064a90a: mov      qword ptr [r15 + 0x48], r14
000000018064a90e: test     rdx, rdx
000000018064a911: je       0x18064ab73
000000018064a917: mov      qword ptr [rdx + 0x20], r14
000000018064a91b: mov      eax, r14d
000000018064a91e: mov      qword ptr [rdx + 0x28], r14
000000018064a922: mov      rcx, qword ptr [rdx + 0x10]
000000018064a926: test     rcx, rcx
000000018064a929: je       0x18064ab73
000000018064a92f: cmp      eax, dword ptr [rcx + 0x18]
000000018064a932: jae      0x18064ab89
000000018064a938: mov      word ptr [r12 + rcx], r14w
000000018064a93d: mov      rcx, qword ptr [rdx + 0x18]
000000018064a941: test     rcx, rcx
000000018064a944: je       0x18064ab73
000000018064a94a: cmp      eax, dword ptr [rcx + 0x18]
000000018064a94d: jae      0x18064ab89
000000018064a953: mov      word ptr [r12 + rcx], r14w
000000018064a958: inc      eax
000000018064a95a: add      r12, 2
000000018064a95e: cmp      r12, 0x26
000000018064a962: jl       0x18064a922
000000018064a964: mov      rcx, qword ptr [rip + 0x8282295] ; TypeInfo Torappu.AttributesData @0x1888ccc00
000000018064a96b: mov      ebx, r14d
000000018064a96e: cmp      dword ptr [rcx + 0xe0], ebx
000000018064a974: jne      0x18064a97b
000000018064a976: call     0x18048c140
000000018064a97b: xor      ecx, ecx
000000018064a97d: call     0x18231bb70 ; Torappu.AttributesData.get_fieldMetas [30786]
000000018064a982: test     rax, rax
000000018064a985: je       0x18064ab73
000000018064a98b: mov      r12d, dword ptr [rax + 0x18]
000000018064a98f: test     r12d, r12d
000000018064a992: jle      0x18064ab24
000000018064a998: nop      dword ptr [rax + rax]
000000018064a9a0: mov      rcx, qword ptr [rip + 0x8282259] ; TypeInfo Torappu.AttributesData @0x1888ccc00
000000018064a9a7: cmp      dword ptr [rcx + 0xe0], 0
000000018064a9ae: jne      0x18064a9b5
000000018064a9b0: call     0x18048c140
000000018064a9b5: xor      ecx, ecx
000000018064a9b7: call     0x18231bb70 ; Torappu.AttributesData.get_fieldMetas [30786]
000000018064a9bc: test     rax, rax
000000018064a9bf: je       0x18064ab73
000000018064a9c5: mov      r8, qword ptr [rip + 0x8201eb4] ; GenericMethodInfo 277300 @0x18884c880
000000018064a9cc: mov      edx, ebx
000000018064a9ce: mov      rcx, rax
000000018064a9d1: call     0x184afcf00
000000018064a9d6: test     rax, rax
000000018064a9d9: je       0x18064ab73
000000018064a9df: mov      rdi, qword ptr [rax + 0x10]
000000018064a9e3: xor      ecx, ecx
000000018064a9e5: call     0x18231bb70 ; Torappu.AttributesData.get_fieldMetas [30786]
000000018064a9ea: test     rax, rax
000000018064a9ed: je       0x18064ab73
000000018064a9f3: mov      r8, qword ptr [rip + 0x8201e86] ; GenericMethodInfo 277300 @0x18884c880
000000018064a9fa: mov      edx, ebx
000000018064a9fc: mov      rcx, rax
000000018064a9ff: call     0x184afcf00
000000018064aa04: test     rax, rax
000000018064aa07: je       0x18064ab73
000000018064aa0d: mov      rsi, qword ptr [rax + 0x28]
000000018064aa11: test     rsi, rsi
000000018064aa14: je       0x18064aa80
000000018064aa16: test     rdi, rdi
000000018064aa19: je       0x18064ab73
000000018064aa1f: mov      r13, qword ptr [rsp + 0xb8]
000000018064aa27: mov      ecx, 0x1d
000000018064aa2c: mov      r8, r13
000000018064aa2f: mov      rdx, rdi
000000018064aa32: call     0x180005480
000000018064aa37: mov      rcx, qword ptr [rip + 0x8294702] ; TypeInfo System.Convert @0x1888df140
000000018064aa3e: mov      rbp, rax
000000018064aa41: cmp      dword ptr [rcx + 0xe0], 0
000000018064aa48: jne      0x18064aa4f
000000018064aa4a: call     0x18048c140
000000018064aa4f: xor      edx, edx
000000018064aa51: mov      rcx, rbp
000000018064aa54: call     0x185e88280
000000018064aa59: test     al, al
000000018064aa5b: je       0x18064aa88
000000018064aa5d: mov      rdx, qword ptr [r15 + 0x28]
000000018064aa61: test     rdx, rdx
000000018064aa64: je       0x18064ab73
000000018064aa6a: movsxd   r8, dword ptr [rsi + 0x10]
000000018064aa6e: cmp      r8d, dword ptr [rdx + 0x18]
000000018064aa72: jae      0x18064ab89
000000018064aa78: inc      word ptr [rdx + r8*2 + 0x20]
000000018064aa7e: jmp      0x18064aa88
000000018064aa80: mov      r13, qword ptr [rsp + 0xb8]
000000018064aa88: mov      rcx, qword ptr [rip + 0x8282171] ; TypeInfo Torappu.AttributesData @0x1888ccc00
000000018064aa8f: cmp      dword ptr [rcx + 0xe0], 0
000000018064aa96: jne      0x18064aa9d
000000018064aa98: call     0x18048c140
000000018064aa9d: xor      ecx, ecx
000000018064aa9f: call     0x18231bb70 ; Torappu.AttributesData.get_fieldMetas [30786]
000000018064aaa4: test     rax, rax
000000018064aaa7: je       0x18064ab73
000000018064aaad: mov      r8, qword ptr [rip + 0x8201dcc] ; GenericMethodInfo 277300 @0x18884c880
000000018064aab4: mov      edx, ebx
000000018064aab6: mov      rcx, rax
000000018064aab9: call     0x184afcf00
000000018064aabe: test     rax, rax
000000018064aac1: je       0x18064ab73
000000018064aac7: mov      rsi, qword ptr [rax + 0x30]
000000018064aacb: test     rsi, rsi
000000018064aace: je       0x18064ab19
000000018064aad0: test     rdi, rdi
000000018064aad3: je       0x18064ab73
000000018064aad9: mov      ecx, 0x1d
000000018064aade: mov      r8, r13
000000018064aae1: mov      rdx, rdi
000000018064aae4: call     0x180005480
000000018064aae9: mov      rcx, qword ptr [rip + 0x8294650] ; TypeInfo System.Convert @0x1888df140
000000018064aaf0: mov      rdi, rax
000000018064aaf3: cmp      dword ptr [rcx + 0xe0], 0
000000018064aafa: jne      0x18064ab01
000000018064aafc: call     0x18048c140
000000018064ab01: xor      edx, edx
000000018064ab03: mov      rcx, rdi
000000018064ab06: call     0x185e88280
000000018064ab0b: test     al, al
000000018064ab0d: je       0x18064ab19
000000018064ab0f: mov      eax, dword ptr [rsi + 0x10]
000000018064ab12: and      eax, 0x3f
000000018064ab15: bts      r14, rax
000000018064ab19: inc      ebx
000000018064ab1b: cmp      ebx, r12d
000000018064ab1e: jl       0x18064a9a0
000000018064ab24: mov      rcx, qword ptr [r15 + 0x50]
000000018064ab28: test     rcx, rcx
000000018064ab2b: je       0x18064ab73
000000018064ab2d: xor      r9d, r9d
000000018064ab30: mov      r8, r14
000000018064ab33: xor      edx, edx
000000018064ab35: movaps   xmm6, xmmword ptr [rsp + 0x70]
000000018064ab3a: mov      r13, qword ptr [rsp + 0x80]
000000018064ab42: mov      r12, qword ptr [rsp + 0x88]
000000018064ab4a: mov      rdi, qword ptr [rsp + 0xc8]
000000018064ab52: mov      rbp, qword ptr [rsp + 0xc0]
000000018064ab5a: mov      rbx, qword ptr [rsp + 0xb0]
000000018064ab62: add      rsp, 0x90
000000018064ab69: pop      r15
000000018064ab6b: pop      r14
000000018064ab6d: pop      rsi
000000018064ab6e: jmp      0x180647260 ; Torappu.Battle.Attributes.AbnormalComboManager.PushMask [64311]
000000018064ab73: call     0x18048c0b0
000000018064ab78: int3     
000000018064ab79: call     0x18048bc50
000000018064ab7e: mov      rcx, rax
000000018064ab81: xor      edx, edx
000000018064ab83: call     0x18048c070
000000018064ab88: int3     
000000018064ab89: call     0x18048c0a0
000000018064ab8e: int3     
000000018064ab8f: int3     
