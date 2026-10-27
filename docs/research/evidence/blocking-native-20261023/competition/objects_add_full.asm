; Torappu.Battle.FilterUtil.objects_add_full metadata=-1 token=0x0 VA=0x1851afc50 RVA=0x51afc50 size=0x254
00000001851afc50: mov      qword ptr [rsp + 8], rbx
00000001851afc55: mov      qword ptr [rsp + 0x10], rbp
00000001851afc5a: mov      qword ptr [rsp + 0x18], rsi
00000001851afc5f: mov      qword ptr [rsp + 0x20], rdi
00000001851afc64: push     r13
00000001851afc66: push     r14
00000001851afc68: push     r15
00000001851afc6a: sub      rsp, 0x20
00000001851afc6e: mov      rsi, qword ptr [rcx + 0x10]
00000001851afc72: xor      ebp, ebp
00000001851afc74: mov      rbx, r8
00000001851afc77: mov      r15, rdx
00000001851afc7a: mov      r13, rcx
00000001851afc7d: mov      r14d, ebp
00000001851afc80: test     rsi, rsi
00000001851afc83: je       0x1851afe98
00000001851afc89: nop      dword ptr [rax]
00000001851afc90: mov      rax, qword ptr [rbx + 0x20]
00000001851afc94: mov      rcx, qword ptr [rax + 0xc0]
00000001851afc9b: mov      rax, qword ptr [rcx + 8]
00000001851afc9f: cmp      qword ptr [rax + 0x20], 0
00000001851afca4: jne      0x1851afcb7
00000001851afca6: mov      rax, qword ptr [rbx + 0x20]
00000001851afcaa: mov      rcx, qword ptr [rax + 0xc0]
00000001851afcb1: mov      rax, qword ptr [rcx + 8]
00000001851afcb5: call     qword ptr [rax]
00000001851afcb7: mov      rdi, qword ptr [r13 + 0x10]
00000001851afcbb: cmp      r14d, dword ptr [rsi + 0x18]
00000001851afcbf: jge      0x1851afdd0
00000001851afcc5: test     rdi, rdi
00000001851afcc8: je       0x1851afe98
00000001851afcce: mov      rax, qword ptr [rbx + 0x20]
00000001851afcd2: mov      rcx, qword ptr [rax + 0xc0]
00000001851afcd9: mov      rax, qword ptr [rcx + 0x18]
00000001851afcdd: cmp      qword ptr [rax + 0x20], 0
00000001851afce2: jne      0x1851afcf5
00000001851afce4: mov      rax, qword ptr [rbx + 0x20]
00000001851afce8: mov      rcx, qword ptr [rax + 0xc0]
00000001851afcef: mov      rax, qword ptr [rcx + 0x18]
00000001851afcf3: call     qword ptr [rax]
00000001851afcf5: mov      rax, qword ptr [rbx + 0x20]
00000001851afcf9: mov      edx, ebp
00000001851afcfb: mov      rcx, rdi
00000001851afcfe: mov      r8, qword ptr [rax + 0xc0]
00000001851afd05: mov      r8, qword ptr [r8 + 0x18]
00000001851afd09: call     0x184afcf00
00000001851afd0e: mov      rdi, rax
00000001851afd11: test     r15, r15
00000001851afd14: je       0x1851afe98
00000001851afd1a: mov      rcx, qword ptr [rbx + 0x20]
00000001851afd1e: mov      rdx, qword ptr [rcx + 0xc0]
00000001851afd25: mov      rax, qword ptr [rdx + 0x68]
00000001851afd29: test     byte ptr [rax + 0x136], 1
00000001851afd30: jne      0x1851afd3a
00000001851afd32: mov      rcx, rax
00000001851afd35: call     0x1804463f0
00000001851afd3a: xor      ecx, ecx
00000001851afd3c: mov      r9, rdi
00000001851afd3f: mov      r8, r15
00000001851afd42: mov      rdx, rax
00000001851afd45: call     0x180005010
00000001851afd4a: mov      rsi, qword ptr [r13 + 0x10]
00000001851afd4e: test     eax, eax
00000001851afd50: jle      0x1851afd65
00000001851afd52: inc      ebp
00000001851afd54: mov      r14d, ebp
00000001851afd57: test     rsi, rsi
00000001851afd5a: je       0x1851afe98
00000001851afd60: jmp      0x1851afc90
00000001851afd65: test     rsi, rsi
00000001851afd68: je       0x1851afe98
00000001851afd6e: mov      rax, qword ptr [rbx + 0x20]
00000001851afd72: mov      rcx, qword ptr [rax + 0xc0]
00000001851afd79: mov      rax, qword ptr [rcx + 0x78]
00000001851afd7d: cmp      qword ptr [rax + 0x20], 0
00000001851afd82: jne      0x1851afd95
00000001851afd84: mov      rax, qword ptr [rbx + 0x20]
00000001851afd88: mov      r8, qword ptr [rax + 0xc0]
00000001851afd8f: mov      rax, qword ptr [r8 + 0x78]
00000001851afd93: call     qword ptr [rax]
00000001851afd95: mov      rax, qword ptr [rbx + 0x20]
00000001851afd99: mov      r8, r15
00000001851afd9c: mov      edx, ebp
00000001851afd9e: mov      rcx, rsi
00000001851afda1: mov      r9, qword ptr [rax + 0xc0]
00000001851afda8: mov      r9, qword ptr [r9 + 0x78]
00000001851afdac: call     0x184d10a40
00000001851afdb1: mov      rbx, qword ptr [rsp + 0x40]
00000001851afdb6: mov      rbp, qword ptr [rsp + 0x48]
00000001851afdbb: mov      rsi, qword ptr [rsp + 0x50]
00000001851afdc0: mov      rdi, qword ptr [rsp + 0x58]
00000001851afdc5: add      rsp, 0x20
00000001851afdc9: pop      r15
00000001851afdcb: pop      r14
00000001851afdcd: pop      r13
00000001851afdcf: ret      
00000001851afdd0: test     rdi, rdi
00000001851afdd3: je       0x1851afe98
00000001851afdd9: mov      rax, qword ptr [rbx + 0x20]
00000001851afddd: mov      rcx, qword ptr [rax + 0xc0]
00000001851afde4: mov      rax, qword ptr [rcx + 0x80]
00000001851afdeb: cmp      qword ptr [rax + 0x20], 0
00000001851afdf0: jne      0x1851afe06
00000001851afdf2: mov      rax, qword ptr [rbx + 0x20]
00000001851afdf6: mov      rcx, qword ptr [rax + 0xc0]
00000001851afdfd: mov      rax, qword ptr [rcx + 0x80]
00000001851afe04: call     qword ptr [rax]
00000001851afe06: mov      rax, qword ptr [rbx + 0x20]
00000001851afe0a: mov      rdx, qword ptr [rdi + 0x10]
00000001851afe0e: mov      rcx, qword ptr [rax + 0xc0]
00000001851afe15: mov      rbx, qword ptr [rcx + 0x80]
00000001851afe1c: inc      dword ptr [rdi + 0x1c]
00000001851afe1f: test     rdx, rdx
00000001851afe22: je       0x1851afe98
00000001851afe24: movsxd   rcx, dword ptr [rdi + 0x18]
00000001851afe28: cmp      ecx, dword ptr [rdx + 0x18]
00000001851afe2b: jb       0x1851afe73
00000001851afe2d: mov      rax, qword ptr [rbx + 0x20]
00000001851afe31: mov      rdx, qword ptr [rax + 0xc0]
00000001851afe38: mov      rax, qword ptr [rdx + 0x58]
00000001851afe3c: cmp      qword ptr [rax + 0x20], 0
00000001851afe41: jne      0x1851afe54
00000001851afe43: mov      rax, qword ptr [rbx + 0x20]
00000001851afe47: mov      rdx, qword ptr [rax + 0xc0]
00000001851afe4e: mov      rax, qword ptr [rdx + 0x58]
00000001851afe52: call     qword ptr [rax]
00000001851afe54: mov      rax, qword ptr [rbx + 0x20]
00000001851afe58: mov      rdx, r15
00000001851afe5b: mov      rcx, rdi
00000001851afe5e: mov      r8, qword ptr [rax + 0xc0]
00000001851afe65: mov      r8, qword ptr [r8 + 0x58]
00000001851afe69: call     0x184d098e0
00000001851afe6e: jmp      0x1851afdb1
00000001851afe73: lea      eax, [rcx + 1]
00000001851afe76: mov      dword ptr [rdi + 0x18], eax
00000001851afe79: cmp      ecx, dword ptr [rdx + 0x18]
00000001851afe7c: jae      0x1851afe9e
00000001851afe7e: mov      qword ptr [rdx + rcx*8 + 0x20], r15
00000001851afe83: add      rdx, 0x20
00000001851afe87: lea      rcx, [rdx + rcx*8]
00000001851afe8b: mov      rdx, r15
00000001851afe8e: call     0x18048b9e0
00000001851afe93: jmp      0x1851afdb1
00000001851afe98: call     0x18048c0b0
00000001851afe9d: int3     
00000001851afe9e: call     0x18048c0a0
00000001851afea3: int3     