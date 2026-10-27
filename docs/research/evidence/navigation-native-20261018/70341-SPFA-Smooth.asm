; Torappu.Battle.SPFA._PostprocessAndMakeNextMapSmoothly metadata=70341 token=0x60112c6 VA=0x1808a5fe0 RVA=0x8a5fe0 size=0x2b0
00000001808a5fe0: push     rsi
00000001808a5fe2: push     r13
00000001808a5fe4: push     r15
00000001808a5fe6: sub      rsp, 0x60
00000001808a5fea: cmp      byte ptr [rip + 0x83eb525], 0
00000001808a5ff1: mov      rsi, r8
00000001808a5ff4: mov      r13, rdx
00000001808a5ff7: mov      r15, rcx
00000001808a5ffa: jne      0x1808a600f
00000001808a5ffc: lea      rcx, [rip + 0x7f8b27d] ; TypeInfo Torappu.Battle.SPFA @0x188831280
00000001808a6003: call     0x18048bf00
00000001808a6008: mov      byte ptr [rip + 0x83eb507], 1
00000001808a600f: mov      rax, qword ptr [rip + 0x7f8b26a] ; TypeInfo Torappu.Battle.SPFA @0x188831280
00000001808a6016: cmp      dword ptr [rax + 0xe0], 0
00000001808a601d: jne      0x1808a602e
00000001808a601f: mov      rcx, rax
00000001808a6022: call     0x18048c140
00000001808a6027: mov      rax, qword ptr [rip + 0x7f8b252] ; TypeInfo Torappu.Battle.SPFA @0x188831280
00000001808a602e: mov      rax, qword ptr [rax + 0xb8]
00000001808a6035: mov      rcx, qword ptr [rax + 0x68]
00000001808a6039: test     rcx, rcx
00000001808a603c: jne      0x1808a6225
00000001808a6042: mov      qword ptr [rsp + 0x80], rbx
00000001808a604a: mov      qword ptr [rsp + 0x90], rdi
00000001808a6052: mov      qword ptr [rsp + 0x88], rbp
00000001808a605a: mov      qword ptr [rsp + 0x58], r12
00000001808a605f: mov      qword ptr [rsp + 0x50], r14
00000001808a6064: mov      rax, qword ptr [r15 + 0x10]
00000001808a6068: xor      edi, edi
00000001808a606a: xor      ebx, ebx
00000001808a606c: mov      dword ptr [rsp + 0x30], edi
00000001808a6070: test     rax, rax
00000001808a6073: je       0x1808a627e
00000001808a6079: nop      dword ptr [rax]
00000001808a6080: xor      edx, edx
00000001808a6082: mov      rcx, rax
00000001808a6085: call     0x180886a20 ; Torappu.Battle.Map.get_height [69971]
00000001808a608a: cmp      ebx, eax
00000001808a608c: jge      0x1808a6252
00000001808a6092: xor      r12d, r12d
00000001808a6095: nop      word ptr [rax + rax]
00000001808a60a0: mov      rcx, qword ptr [r15 + 0x10]
00000001808a60a4: test     rcx, rcx
00000001808a60a7: je       0x1808a627e
00000001808a60ad: xor      edx, edx
00000001808a60af: call     0x180887350 ; Torappu.Battle.Map.get_width [69970]
00000001808a60b4: cmp      r12d, eax
00000001808a60b7: jge      0x1808a620f
00000001808a60bd: test     rsi, rsi
00000001808a60c0: je       0x1808a627e
00000001808a60c6: movsxd   r8, r12d
00000001808a60c9: mov      rcx, rsi
00000001808a60cc: movsxd   rdx, edi
00000001808a60cf: call     0x1800169b0
00000001808a60d4: xor      edx, edx
00000001808a60d6: mov      r14, rax
00000001808a60d9: mov      ecx, dword ptr [rax + 0x24]
00000001808a60dc: mov      dword ptr [rax + 0x28], ecx
00000001808a60df: mov      rcx, rax
00000001808a60e2: call     0x1808a0db0 ; Torappu.Battle.Route.Node.get_isValid [70387]
00000001808a60e7: test     al, al
00000001808a60e9: je       0x1808a6207
00000001808a60ef: cmp      byte ptr [r14 + 0x20], 0
00000001808a60f4: je       0x1808a6207
00000001808a60fa: cmp      byte ptr [r13 + 0xc], 0
00000001808a60ff: mov      rdi, qword ptr [r14 + 0x18]
00000001808a6103: mov      qword ptr [rsp + 0x40], rdi
00000001808a6108: jne      0x1808a6190
00000001808a610e: nop      
00000001808a6110: mov      rax, rdi
00000001808a6113: movsxd   rdx, edi
00000001808a6116: shr      rax, 0x20
00000001808a611a: mov      rcx, rsi
00000001808a611d: movsxd   r8, eax
00000001808a6120: call     0x1800169b0
00000001808a6125: cmp      byte ptr [rax + 0x20], 0
00000001808a6129: je       0x1808a61ff
00000001808a612f: movsxd   rbp, dword ptr [rsp + 0x44]
00000001808a6134: mov      rcx, rsi
00000001808a6137: mov      rbx, qword ptr [r14]
00000001808a613a: mov      r8, rbp
00000001808a613d: movsxd   rdx, edi
00000001808a6140: call     0x1800169b0
00000001808a6145: mov      r9d, dword ptr [r13 + 8]
00000001808a6149: mov      rdx, rbx
00000001808a614c: mov      qword ptr [rsp + 0x28], 0
00000001808a6155: mov      rcx, r15
00000001808a6158: mov      qword ptr [rsp + 0x20], rsi
00000001808a615d: mov      r8, qword ptr [rax + 0x18]
00000001808a6161: call     0x1808a68f0 ; Torappu.Battle.SPFA._RaycastSegmentLine [70343]
00000001808a6166: test     al, al
00000001808a6168: je       0x1808a61ff
00000001808a616e: mov      r8, rbp
00000001808a6171: movsxd   rdx, edi
00000001808a6174: mov      rcx, rsi
00000001808a6177: call     0x1800169b0
00000001808a617c: mov      rdi, qword ptr [rax + 0x18]
00000001808a6180: mov      qword ptr [rsp + 0x40], rdi
00000001808a6185: jmp      0x1808a6110
00000001808a6187: nop      word ptr [rax + rax]
00000001808a6190: mov      rax, rdi
00000001808a6193: movsxd   rdx, edi
00000001808a6196: shr      rax, 0x20
00000001808a619a: mov      rcx, rsi
00000001808a619d: movsxd   r8, eax
00000001808a61a0: call     0x1800169b0
00000001808a61a5: cmp      byte ptr [rax + 0x20], 0
00000001808a61a9: je       0x1808a61ff
00000001808a61ab: movsxd   rbp, dword ptr [rsp + 0x44]
00000001808a61b0: mov      rcx, rsi
00000001808a61b3: mov      rbx, qword ptr [r14]
00000001808a61b6: mov      r8, rbp
00000001808a61b9: movsxd   rdx, edi
00000001808a61bc: call     0x1800169b0
00000001808a61c1: mov      r9d, dword ptr [r13 + 8]
00000001808a61c5: mov      rdx, rbx
00000001808a61c8: mov      qword ptr [rsp + 0x28], 0
00000001808a61d1: mov      rcx, r15
00000001808a61d4: mov      qword ptr [rsp + 0x20], rsi
00000001808a61d9: mov      r8, qword ptr [rax + 0x18]
00000001808a61dd: call     0x1808a6290 ; Torappu.Battle.SPFA._RaycastBresenhamLine [70342]
00000001808a61e2: test     al, al
00000001808a61e4: je       0x1808a61ff
00000001808a61e6: mov      r8, rbp
00000001808a61e9: movsxd   rdx, edi
00000001808a61ec: mov      rcx, rsi
00000001808a61ef: call     0x1800169b0
00000001808a61f4: mov      rdi, qword ptr [rax + 0x18]
00000001808a61f8: mov      qword ptr [rsp + 0x40], rdi
00000001808a61fd: jmp      0x1808a6190
00000001808a61ff: mov      qword ptr [r14 + 0x18], rdi
00000001808a6203: mov      edi, dword ptr [rsp + 0x30]
00000001808a6207: inc      r12d
00000001808a620a: jmp      0x1808a60a0
00000001808a620f: mov      rax, qword ptr [r15 + 0x10]
00000001808a6213: inc      edi
00000001808a6215: mov      dword ptr [rsp + 0x30], edi
00000001808a6219: mov      ebx, edi
00000001808a621b: test     rax, rax
00000001808a621e: je       0x1808a627e
00000001808a6220: jmp      0x1808a6080
00000001808a6225: movups   xmm0, xmmword ptr [r13]
00000001808a622a: mov      r9, rsi
00000001808a622d: mov      qword ptr [rsp + 0x20], 0
00000001808a6236: lea      r8, [rsp + 0x40]
00000001808a623b: mov      rdx, r15
00000001808a623e: movaps   xmmword ptr [rsp + 0x40], xmm0
00000001808a6243: call     0x1833650b0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3345 [6000]
00000001808a6248: add      rsp, 0x60
00000001808a624c: pop      r15
00000001808a624e: pop      r13
00000001808a6250: pop      rsi
00000001808a6251: ret      
00000001808a6252: mov      r12, qword ptr [rsp + 0x58]
00000001808a6257: mov      rbp, qword ptr [rsp + 0x88]
00000001808a625f: mov      r14, qword ptr [rsp + 0x50]
00000001808a6264: mov      rbx, qword ptr [rsp + 0x80]
00000001808a626c: mov      rdi, qword ptr [rsp + 0x90]
00000001808a6274: add      rsp, 0x60
00000001808a6278: pop      r15
00000001808a627a: pop      r13
00000001808a627c: pop      rsi
00000001808a627d: ret      
00000001808a627e: call     0x18048c0b0
00000001808a6283: int3     
00000001808a6284: int3     
00000001808a6285: int3     
00000001808a6286: int3     
00000001808a6287: int3     
00000001808a6288: int3     
00000001808a6289: int3     
00000001808a628a: int3     
00000001808a628b: int3     
00000001808a628c: int3     
00000001808a628d: int3     
00000001808a628e: int3     
00000001808a628f: int3     