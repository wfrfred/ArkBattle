; Torappu.Battle.SPFA._LoadedCacheMap metadata=70340 token=0x60112c5 VA=0x1808a5e50 RVA=0x8a5e50 size=0x190
00000001808a5e50: mov      qword ptr [rsp + 0x18], rbx
00000001808a5e55: mov      qword ptr [rsp + 0x20], rbp
00000001808a5e5a: push     rsi
00000001808a5e5b: sub      rsp, 0x40
00000001808a5e5f: cmp      byte ptr [rip + 0x83eb6af], 0
00000001808a5e66: mov      rsi, r8
00000001808a5e69: mov      rbx, rdx
00000001808a5e6c: mov      rbp, rcx
00000001808a5e6f: jne      0x1808a5e84
00000001808a5e71: lea      rcx, [rip + 0x7f8b408] ; TypeInfo Torappu.Battle.SPFA @0x188831280
00000001808a5e78: call     0x18048bf00
00000001808a5e7d: mov      byte ptr [rip + 0x83eb691], 1
00000001808a5e84: mov      rax, qword ptr [rip + 0x7f8b3f5] ; TypeInfo Torappu.Battle.SPFA @0x188831280
00000001808a5e8b: cmp      dword ptr [rax + 0xe0], 0
00000001808a5e92: jne      0x1808a5ea3
00000001808a5e94: mov      rcx, rax
00000001808a5e97: call     0x18048c140
00000001808a5e9c: mov      rax, qword ptr [rip + 0x7f8b3dd] ; TypeInfo Torappu.Battle.SPFA @0x188831280
00000001808a5ea3: mov      rax, qword ptr [rax + 0xb8]
00000001808a5eaa: mov      rcx, qword ptr [rax + 0x60]
00000001808a5eae: test     rcx, rcx
00000001808a5eb1: jne      0x1808a5f96
00000001808a5eb7: mov      qword ptr [rsp + 0x50], rdi
00000001808a5ebc: mov      qword ptr [rsp + 0x58], r14
00000001808a5ec1: test     rbx, rbx
00000001808a5ec4: je       0x1808a5fd7
00000001808a5eca: xor      edx, edx
00000001808a5ecc: mov      rcx, rbx
00000001808a5ecf: call     0x185eec590
00000001808a5ed4: xor      r9d, r9d
00000001808a5ed7: mov      r8d, eax
00000001808a5eda: mov      rdx, rsi
00000001808a5edd: mov      rcx, rbx
00000001808a5ee0: call     0x185ee9f90
00000001808a5ee5: mov      rax, qword ptr [rbp + 0x10]
00000001808a5ee9: xor      r14d, r14d
00000001808a5eec: xor      ebx, ebx
00000001808a5eee: test     rax, rax
00000001808a5ef1: je       0x1808a5fd7
00000001808a5ef7: nop      word ptr [rax + rax]
00000001808a5f00: xor      edx, edx
00000001808a5f02: mov      rcx, rax
00000001808a5f05: call     0x180886a20 ; Torappu.Battle.Map.get_height [69971]
00000001808a5f0a: cmp      ebx, eax
00000001808a5f0c: jge      0x1808a5fbd
00000001808a5f12: xor      edi, edi
00000001808a5f14: nop      dword ptr [rax]
00000001808a5f18: nop      dword ptr [rax + rax]
00000001808a5f20: mov      rcx, qword ptr [rbp + 0x10]
00000001808a5f24: test     rcx, rcx
00000001808a5f27: je       0x1808a5fd7
00000001808a5f2d: xor      edx, edx
00000001808a5f2f: call     0x180887350 ; Torappu.Battle.Map.get_width [69970]
00000001808a5f34: cmp      edi, eax
00000001808a5f36: jge      0x1808a5f82
00000001808a5f38: test     rsi, rsi
00000001808a5f3b: je       0x1808a5fd7
00000001808a5f41: movsxd   r8, edi
00000001808a5f44: mov      rcx, rsi
00000001808a5f47: movsxd   rdx, r14d
00000001808a5f4a: call     0x1800169b0
00000001808a5f4f: mov      rbx, rax
00000001808a5f52: mov      ecx, dword ptr [rax + 0x24]
00000001808a5f55: mov      dword ptr [rax + 0x28], ecx
00000001808a5f58: xor      ecx, ecx
00000001808a5f5a: call     0x1805073b0 ; Torappu.Battle.BasicCursor.DisappearCheckpoint.GetNextDirection [70205] | Torappu.Battle.BasicCursor.AppearAtPosCheckpoint.GetNextDirection [70214] | Torappu.Battle.BasicCursor.WaitForSecondsCheckpoint.GetNextDirection [70219] | Torappu.Battle.BasicCursor.WaitForPlayTimeCheckpoint.GetNextDirection [70228] | Torappu.Battle.BasicCursor.WaitCurrentWaveTimeCheckpoint.GetNextDirection [70234] | Torappu.Battle.BasicCursor.WaitCurrentFragmentTimeCheckpoint.GetNextDirection [70240] | Torappu.Battle.BasicCursor.AlertCheckpoint.GetNextDirection [70245] | Torappu.Battle.BasicCursor.WaitBossrushWaveCheckPoint.GetNextDirection [70254]
00000001808a5f5f: mov      qword ptr [rsp + 0x30], rax
00000001808a5f64: inc      edi
00000001808a5f66: movss    xmm0, dword ptr [rsp + 0x30]
00000001808a5f6c: movss    xmm1, dword ptr [rsp + 0x34]
00000001808a5f72: movss    dword ptr [rbx + 0x10], xmm0
00000001808a5f77: movss    dword ptr [rbx + 0x14], xmm1
00000001808a5f7c: mov      byte ptr [rbx + 0x2c], 0
00000001808a5f80: jmp      0x1808a5f20
00000001808a5f82: mov      rax, qword ptr [rbp + 0x10]
00000001808a5f86: inc      r14d
00000001808a5f89: mov      ebx, r14d
00000001808a5f8c: test     rax, rax
00000001808a5f8f: je       0x1808a5fd7
00000001808a5f91: jmp      0x1808a5f00
00000001808a5f96: mov      r9, rsi
00000001808a5f99: mov      qword ptr [rsp + 0x20], 0
00000001808a5fa2: mov      r8, rbx
00000001808a5fa5: mov      rdx, rbp
00000001808a5fa8: call     0x18339deb0 ; XLua.DelegateBridge.__Gen_Delegate_Imp36 [2691]
00000001808a5fad: mov      rbx, qword ptr [rsp + 0x60]
00000001808a5fb2: mov      rbp, qword ptr [rsp + 0x68]
00000001808a5fb7: add      rsp, 0x40
00000001808a5fbb: pop      rsi
00000001808a5fbc: ret      
00000001808a5fbd: mov      rdi, qword ptr [rsp + 0x50]
00000001808a5fc2: mov      r14, qword ptr [rsp + 0x58]
00000001808a5fc7: mov      rbx, qword ptr [rsp + 0x60]
00000001808a5fcc: mov      rbp, qword ptr [rsp + 0x68]
00000001808a5fd1: add      rsp, 0x40
00000001808a5fd5: pop      rsi
00000001808a5fd6: ret      
00000001808a5fd7: call     0x18048c0b0
00000001808a5fdc: int3     
00000001808a5fdd: int3     
00000001808a5fde: int3     
00000001808a5fdf: int3     