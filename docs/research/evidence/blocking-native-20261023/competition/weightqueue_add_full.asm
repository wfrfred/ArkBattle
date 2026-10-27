; Torappu.Battle.FilterUtil.weightqueue_add_full metadata=-1 token=0x0 VA=0x1851afeb0 RVA=0x51afeb0 size=0x2f0
00000001851afeb0: mov      qword ptr [rsp + 8], rbx
00000001851afeb5: mov      qword ptr [rsp + 0x10], rbp
00000001851afeba: mov      qword ptr [rsp + 0x18], rsi
00000001851afebf: mov      qword ptr [rsp + 0x20], rdi
00000001851afec4: push     r12
00000001851afec6: push     r14
00000001851afec8: push     r15
00000001851afeca: sub      rsp, 0x60
00000001851afece: mov      rbp, qword ptr [rcx + 0x10]
00000001851afed2: xor      esi, esi
00000001851afed4: mov      rbx, r8
00000001851afed7: mov      r12, rdx
00000001851afeda: mov      r15, rcx
00000001851afedd: mov      r14d, esi
00000001851afee0: test     rbp, rbp
00000001851afee3: je       0x1851b0189
00000001851afee9: nop      dword ptr [rax]
00000001851afef0: mov      rax, qword ptr [rbx + 0x20]
00000001851afef4: mov      rcx, qword ptr [rax + 0xc0]
00000001851afefb: mov      rax, qword ptr [rcx + 8]
00000001851afeff: cmp      qword ptr [rax + 0x20], 0
00000001851aff04: jne      0x1851aff17
00000001851aff06: mov      rax, qword ptr [rbx + 0x20]
00000001851aff0a: mov      rcx, qword ptr [rax + 0xc0]
00000001851aff11: mov      rax, qword ptr [rcx + 8]
00000001851aff15: call     qword ptr [rax]
00000001851aff17: mov      rdi, qword ptr [r15 + 0x10]
00000001851aff1b: cmp      r14d, dword ptr [rbp + 0x18]
00000001851aff1f: jge      0x1851b007a
00000001851aff25: test     rdi, rdi
00000001851aff28: je       0x1851b0189
00000001851aff2e: mov      rax, qword ptr [rbx + 0x20]
00000001851aff32: mov      rcx, qword ptr [rax + 0xc0]
00000001851aff39: mov      rax, qword ptr [rcx + 0x18]
00000001851aff3d: cmp      qword ptr [rax + 0x20], 0
00000001851aff42: jne      0x1851aff55
00000001851aff44: mov      rax, qword ptr [rbx + 0x20]
00000001851aff48: mov      rcx, qword ptr [rax + 0xc0]
00000001851aff4f: mov      rax, qword ptr [rcx + 0x18]
00000001851aff53: call     qword ptr [rax]
00000001851aff55: mov      rax, qword ptr [rbx + 0x20]
00000001851aff59: lea      rcx, [rsp + 0x40]
00000001851aff5e: mov      r8d, esi
00000001851aff61: mov      rdx, rdi
00000001851aff64: mov      r9, qword ptr [rax + 0xc0]
00000001851aff6b: mov      r9, qword ptr [r9 + 0x18]
00000001851aff6f: call     0x184ae93d0
00000001851aff74: mov      rax, qword ptr [rbx + 0x20]
00000001851aff78: mov      rcx, qword ptr [rax + 0xc0]
00000001851aff7f: mov      rcx, qword ptr [rcx + 0x70]
00000001851aff83: call     0x18048c030
00000001851aff88: cmp      dword ptr [rax + 0xe0], 0
00000001851aff8f: jne      0x1851aff99
00000001851aff91: mov      rcx, rax
00000001851aff94: call     0x18048c140
00000001851aff99: mov      rax, qword ptr [rbx + 0x20]
00000001851aff9d: lea      rdx, [rsp + 0x20]
00000001851affa2: movups   xmm0, xmmword ptr [rsp + 0x40]
00000001851affa7: mov      rcx, r12
00000001851affaa: movups   xmm1, xmmword ptr [rsp + 0x50]
00000001851affaf: mov      r8, qword ptr [rax + 0xc0]
00000001851affb6: movaps   xmmword ptr [rsp + 0x20], xmm0
00000001851affbb: movaps   xmmword ptr [rsp + 0x30], xmm1
00000001851affc0: mov      r8, qword ptr [r8 + 0x70]
00000001851affc4: call     0x1855279c0
00000001851affc9: mov      rbp, qword ptr [r15 + 0x10]
00000001851affcd: test     eax, eax
00000001851affcf: jle      0x1851affe4
00000001851affd1: inc      esi
00000001851affd3: mov      r14d, esi
00000001851affd6: test     rbp, rbp
00000001851affd9: je       0x1851b0189
00000001851affdf: jmp      0x1851afef0
00000001851affe4: movups   xmm0, xmmword ptr [r12]
00000001851affe9: movups   xmm1, xmmword ptr [r12 + 0x10]
00000001851affef: movups   xmmword ptr [rsp + 0x40], xmm0
00000001851afff4: movups   xmmword ptr [rsp + 0x20], xmm1
00000001851afff9: test     rbp, rbp
00000001851afffc: je       0x1851b0189
00000001851b0002: mov      rax, qword ptr [rbx + 0x20]
00000001851b0006: mov      rcx, qword ptr [rax + 0xc0]
00000001851b000d: mov      rax, qword ptr [rcx + 0x78]
00000001851b0011: cmp      qword ptr [rax + 0x20], 0
00000001851b0016: jne      0x1851b0033
00000001851b0018: mov      rax, qword ptr [rbx + 0x20]
00000001851b001c: mov      r8, qword ptr [rax + 0xc0]
00000001851b0023: mov      rax, qword ptr [r8 + 0x78]
00000001851b0027: call     qword ptr [rax]
00000001851b0029: movups   xmm0, xmmword ptr [rsp + 0x40]
00000001851b002e: movups   xmm1, xmmword ptr [rsp + 0x20]
00000001851b0033: mov      rax, qword ptr [rbx + 0x20]
00000001851b0037: lea      r8, [rsp + 0x40]
00000001851b003c: mov      edx, esi
00000001851b003e: movaps   xmmword ptr [rsp + 0x40], xmm0
00000001851b0043: mov      rcx, rbp
00000001851b0046: movaps   xmmword ptr [rsp + 0x50], xmm1
00000001851b004b: mov      r9, qword ptr [rax + 0xc0]
00000001851b0052: mov      r9, qword ptr [r9 + 0x78]
00000001851b0056: call     0x184b07290
00000001851b005b: lea      r11, [rsp + 0x60]
00000001851b0060: mov      rbx, qword ptr [r11 + 0x20]
00000001851b0064: mov      rbp, qword ptr [r11 + 0x28]
00000001851b0068: mov      rsi, qword ptr [r11 + 0x30]
00000001851b006c: mov      rdi, qword ptr [r11 + 0x38]
00000001851b0070: mov      rsp, r11
00000001851b0073: pop      r15
00000001851b0075: pop      r14
00000001851b0077: pop      r12
00000001851b0079: ret      
00000001851b007a: movups   xmm0, xmmword ptr [r12]
00000001851b007f: movups   xmm1, xmmword ptr [r12 + 0x10]
00000001851b0085: movups   xmmword ptr [rsp + 0x20], xmm0
00000001851b008a: movups   xmmword ptr [rsp + 0x40], xmm1
00000001851b008f: test     rdi, rdi
00000001851b0092: je       0x1851b0189
00000001851b0098: mov      rax, qword ptr [rbx + 0x20]
00000001851b009c: mov      rcx, qword ptr [rax + 0xc0]
00000001851b00a3: mov      rax, qword ptr [rcx + 0x80]
00000001851b00aa: cmp      qword ptr [rax + 0x20], 0
00000001851b00af: jne      0x1851b00cf
00000001851b00b1: mov      rax, qword ptr [rbx + 0x20]
00000001851b00b5: mov      rcx, qword ptr [rax + 0xc0]
00000001851b00bc: mov      rax, qword ptr [rcx + 0x80]
00000001851b00c3: call     qword ptr [rax]
00000001851b00c5: movups   xmm0, xmmword ptr [rsp + 0x20]
00000001851b00ca: movups   xmm1, xmmword ptr [rsp + 0x40]
00000001851b00cf: mov      rax, qword ptr [rbx + 0x20]
00000001851b00d3: mov      rdx, qword ptr [rdi + 0x10]
00000001851b00d7: mov      rcx, qword ptr [rax + 0xc0]
00000001851b00de: mov      rbx, qword ptr [rcx + 0x80]
00000001851b00e5: inc      dword ptr [rdi + 0x1c]
00000001851b00e8: test     rdx, rdx
00000001851b00eb: je       0x1851b0189
00000001851b00f1: movsxd   rcx, dword ptr [rdi + 0x18]
00000001851b00f5: cmp      ecx, dword ptr [rdx + 0x18]
00000001851b00f8: jb       0x1851b0156
00000001851b00fa: mov      rax, qword ptr [rbx + 0x20]
00000001851b00fe: mov      rcx, qword ptr [rax + 0xc0]
00000001851b0105: mov      rax, qword ptr [rcx + 0x58]
00000001851b0109: cmp      qword ptr [rax + 0x20], 0
00000001851b010e: jne      0x1851b0121
00000001851b0110: mov      rax, qword ptr [rbx + 0x20]
00000001851b0114: mov      rdx, qword ptr [rax + 0xc0]
00000001851b011b: mov      rax, qword ptr [rdx + 0x58]
00000001851b011f: call     qword ptr [rax]
00000001851b0121: mov      rax, qword ptr [rbx + 0x20]
00000001851b0125: lea      rdx, [rsp + 0x20]
00000001851b012a: movups   xmm0, xmmword ptr [rsp + 0x20]
00000001851b012f: mov      rcx, rdi
00000001851b0132: movups   xmm1, xmmword ptr [rsp + 0x40]
00000001851b0137: mov      r8, qword ptr [rax + 0xc0]
00000001851b013e: movaps   xmmword ptr [rsp + 0x20], xmm0
00000001851b0143: movaps   xmmword ptr [rsp + 0x30], xmm1
00000001851b0148: mov      r8, qword ptr [r8 + 0x58]
00000001851b014c: call     0x184afee10
00000001851b0151: jmp      0x1851b005b
00000001851b0156: lea      eax, [rcx + 1]
00000001851b0159: mov      dword ptr [rdi + 0x18], eax
00000001851b015c: cmp      ecx, dword ptr [rdx + 0x18]
00000001851b015f: jae      0x1851b018f
00000001851b0161: lea      rax, [rcx + 1]
00000001851b0165: shl      rcx, 5
00000001851b0169: shl      rax, 5
00000001851b016d: movups   xmmword ptr [rax + rdx], xmm0
00000001851b0171: movups   xmmword ptr [rax + rdx + 0x10], xmm1
00000001851b0176: add      rdx, 0x30
00000001851b017a: add      rcx, rdx
00000001851b017d: xor      edx, edx
00000001851b017f: call     0x18048b9e0
00000001851b0184: jmp      0x1851b005b
00000001851b0189: call     0x18048c0b0
00000001851b018e: int3     
00000001851b018f: call     0x18048c0a0
00000001851b0194: int3     
00000001851b0195: int3     
00000001851b0196: int3     
00000001851b0197: int3     
00000001851b0198: int3     
00000001851b0199: int3     
00000001851b019a: int3     
00000001851b019b: int3     
00000001851b019c: int3     
00000001851b019d: int3     
00000001851b019e: int3     
00000001851b019f: int3     