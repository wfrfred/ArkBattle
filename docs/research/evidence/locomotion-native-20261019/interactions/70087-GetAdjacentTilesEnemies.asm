; Torappu.Battle.Map.GetAdjacentTilesEnemies metadata=70087 token=0x60111c8 VA=0x18087bda0 RVA=0x87bda0 size=0x240
000000018087bda0: push     r14
000000018087bda2: push     r15
000000018087bda4: sub      rsp, 0x48
000000018087bda8: cmp      byte ptr [rip + 0x84156d8], 0
000000018087bdaf: mov      r14, rdx
000000018087bdb2: mov      r15, rcx
000000018087bdb5: jne      0x18087bdfa
000000018087bdb7: lea      rcx, [rip + 0x80659fa] ; GenericMethodInfo 268446 @0x1888e17b8
000000018087bdbe: call     0x18048bf00
000000018087bdc3: lea      rcx, [rip + 0x8040c76] ; TypeInfo Torappu.Battle.Map @0x1888bca40
000000018087bdca: call     0x18048bf00
000000018087bdcf: lea      rcx, [rip + 0x80b6f12] ; TypeInfo UnityEngine.Object @0x188932ce8
000000018087bdd6: call     0x18048bf00
000000018087bddb: lea      rcx, [rip + 0x80d2dfe] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
000000018087bde2: call     0x18048bf00
000000018087bde7: lea      rcx, [rip + 0x806435a] ; GenericMethodInfo 282061 @0x1888e0148
000000018087bdee: call     0x18048bf00
000000018087bdf3: mov      byte ptr [rip + 0x841568d], 1
000000018087bdfa: mov      rax, qword ptr [rip + 0x8040c3f] ; TypeInfo Torappu.Battle.Map @0x1888bca40
000000018087be01: cmp      dword ptr [rax + 0xe0], 0
000000018087be08: jne      0x18087be19
000000018087be0a: mov      rcx, rax
000000018087be0d: call     0x18048c140
000000018087be12: mov      rax, qword ptr [rip + 0x8040c27] ; TypeInfo Torappu.Battle.Map @0x1888bca40
000000018087be19: mov      rax, qword ptr [rax + 0xb8]
000000018087be20: mov      rcx, qword ptr [rax + 0x400]
000000018087be27: test     rcx, rcx
000000018087be2a: jne      0x18087bf8a
000000018087be30: mov      qword ptr [rsp + 0x60], rbx
000000018087be35: mov      qword ptr [rsp + 0x68], rbp
000000018087be3a: mov      qword ptr [rsp + 0x70], rsi
000000018087be3f: mov      qword ptr [rsp + 0x78], rdi
000000018087be44: mov      qword ptr [rsp + 0x40], r12
000000018087be49: movaps   xmmword ptr [rsp + 0x30], xmm6
000000018087be4e: movaps   xmmword ptr [rsp + 0x20], xmm7
000000018087be53: test     r15, r15
000000018087be56: je       0x18087bfd2
000000018087be5c: xor      edx, edx
000000018087be5e: mov      rcx, r15
000000018087be61: call     0x1808be180 ; Torappu.Battle.Tile.GetEnemies [70715]
000000018087be66: test     r14, r14
000000018087be69: je       0x18087bfd2
000000018087be6f: mov      r8, qword ptr [rip + 0x8065942] ; GenericMethodInfo 268446 @0x1888e17b8
000000018087be76: mov      rdx, rax
000000018087be79: mov      rcx, r14
000000018087be7c: call     0x184bac9e0
000000018087be81: mov      rax, qword ptr [rip + 0x80d2d58] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
000000018087be88: cmp      dword ptr [rax + 0xe0], 0
000000018087be8f: jne      0x18087bea0
000000018087be91: mov      rcx, rax
000000018087be94: call     0x18048c140
000000018087be99: mov      rax, qword ptr [rip + 0x80d2d40] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
000000018087bea0: mov      rax, qword ptr [rax + 0xb8]
000000018087bea7: xor      ebx, ebx
000000018087bea9: mov      rbp, qword ptr [rax + 0x60]
000000018087bead: mov      eax, ebx
000000018087beaf: test     rbp, rbp
000000018087beb2: je       0x18087bfd2
000000018087beb8: lea      rsi, [rbp + 0x20]
000000018087bebc: nop      dword ptr [rax]
000000018087bec0: cmp      eax, dword ptr [rbp + 0x18]
000000018087bec3: jge      0x18087bfa0
000000018087bec9: cmp      ebx, dword ptr [rbp + 0x18]
000000018087becc: jae      0x18087bfcc
000000018087bed2: movss    xmm6, dword ptr [rsi]
000000018087bed6: xor      edx, edx
000000018087bed8: movss    xmm7, dword ptr [rsi + 4]
000000018087bedd: mov      rcx, r15
000000018087bee0: call     0x180ad4350 ; Torappu.Battle.VisualObject.get_row [77875]
000000018087bee5: xor      edx, edx
000000018087bee7: mov      rcx, r15
000000018087beea: movd     xmm0, eax
000000018087beee: cvtdq2ps xmm0, xmm0
000000018087bef1: addss    xmm0, xmm6
000000018087bef5: cvttss2si edi, xmm0
000000018087bef9: call     0x180ad4030 ; Torappu.Battle.VisualObject.get_col [77876]
000000018087befe: mov      rcx, qword ptr [rip + 0x8064243] ; GenericMethodInfo 282061 @0x1888e0148
000000018087bf05: movd     xmm0, eax
000000018087bf09: cvtdq2ps xmm0, xmm0
000000018087bf0c: addss    xmm0, xmm7
000000018087bf10: cvttss2si r12d, xmm0
000000018087bf15: call     0x185337c50
000000018087bf1a: test     rax, rax
000000018087bf1d: je       0x18087bfd2
000000018087bf23: xor      r9d, r9d
000000018087bf26: mov      r8d, r12d
000000018087bf29: mov      edx, edi
000000018087bf2b: mov      rcx, rax
000000018087bf2e: call     0x18087dc50 ; Torappu.Battle.Map.GetTile [70076]
000000018087bf33: mov      rcx, qword ptr [rip + 0x80b6dae] ; TypeInfo UnityEngine.Object @0x188932ce8
000000018087bf3a: mov      rdi, rax
000000018087bf3d: cmp      dword ptr [rcx + 0xe0], 0
000000018087bf44: jne      0x18087bf4b
000000018087bf46: call     0x18048c140
000000018087bf4b: xor      r8d, r8d
000000018087bf4e: xor      edx, edx
000000018087bf50: mov      rcx, rdi
000000018087bf53: call     0x186b63a70
000000018087bf58: test     al, al
000000018087bf5a: je       0x18087bf7d
000000018087bf5c: test     rdi, rdi
000000018087bf5f: je       0x18087bfd2
000000018087bf61: xor      edx, edx
000000018087bf63: mov      rcx, rdi
000000018087bf66: call     0x1808be180 ; Torappu.Battle.Tile.GetEnemies [70715]
000000018087bf6b: mov      r8, qword ptr [rip + 0x8065846] ; GenericMethodInfo 268446 @0x1888e17b8
000000018087bf72: mov      rdx, rax
000000018087bf75: mov      rcx, r14
000000018087bf78: call     0x184bac9e0
000000018087bf7d: inc      ebx
000000018087bf7f: add      rsi, 8
000000018087bf83: mov      eax, ebx
000000018087bf85: jmp      0x18087bec0
000000018087bf8a: xor      r9d, r9d
000000018087bf8d: mov      r8, r14
000000018087bf90: mov      rdx, r15
000000018087bf93: add      rsp, 0x48
000000018087bf97: pop      r15
000000018087bf99: pop      r14
000000018087bf9b: jmp      0x1832d2220 ; XLua.DelegateBridge.__Gen_Delegate_Imp23 [2678]
000000018087bfa0: movaps   xmm6, xmmword ptr [rsp + 0x30]
000000018087bfa5: mov      r12, qword ptr [rsp + 0x40]
000000018087bfaa: mov      rdi, qword ptr [rsp + 0x78]
000000018087bfaf: mov      rsi, qword ptr [rsp + 0x70]
000000018087bfb4: mov      rbp, qword ptr [rsp + 0x68]
000000018087bfb9: mov      rbx, qword ptr [rsp + 0x60]
000000018087bfbe: movaps   xmm7, xmmword ptr [rsp + 0x20]
000000018087bfc3: add      rsp, 0x48
000000018087bfc7: pop      r15
000000018087bfc9: pop      r14
000000018087bfcb: ret      
000000018087bfcc: call     0x18048c0a0
000000018087bfd1: int3     
000000018087bfd2: call     0x18048c0b0
000000018087bfd7: int3     
000000018087bfd8: int3     
000000018087bfd9: int3     
000000018087bfda: int3     
000000018087bfdb: int3     
000000018087bfdc: int3     
000000018087bfdd: int3     
000000018087bfde: int3     
000000018087bfdf: int3     