; Torappu.Battle.SPFA.GenerateNextMap metadata=70331 token=0x60112bc VA=0x1808a4ec0 RVA=0x8a4ec0 size=0x2f0
00000001808a4ec0: mov      qword ptr [rsp + 0x18], rbx
00000001808a4ec5: mov      qword ptr [rsp + 0x20], rbp
00000001808a4eca: push     rsi
00000001808a4ecb: sub      rsp, 0x50
00000001808a4ecf: cmp      byte ptr [rip + 0x83ec636], 0
00000001808a4ed6: mov      rsi, r8
00000001808a4ed9: mov      rbx, rdx
00000001808a4edc: mov      rbp, rcx
00000001808a4edf: jne      0x1808a4f0c
00000001808a4ee1: lea      rcx, [rip + 0x808b958] ; GenericMethodInfo 248373 @0x188930840
00000001808a4ee8: call     0x18048bf00
00000001808a4eed: lea      rcx, [rip + 0x808bdcc] ; GenericMethodInfo 248375 @0x188930cc0
00000001808a4ef4: call     0x18048bf00
00000001808a4ef9: lea      rcx, [rip + 0x7f8c380] ; TypeInfo Torappu.Battle.SPFA @0x188831280
00000001808a4f00: call     0x18048bf00
00000001808a4f05: mov      byte ptr [rip + 0x83ec600], 1
00000001808a4f0c: mov      rax, qword ptr [rip + 0x7f8c36d] ; TypeInfo Torappu.Battle.SPFA @0x188831280
00000001808a4f13: mov      qword ptr [rsp + 0x30], 0
00000001808a4f1c: cmp      dword ptr [rax + 0xe0], 0
00000001808a4f23: jne      0x1808a4f34
00000001808a4f25: mov      rcx, rax
00000001808a4f28: call     0x18048c140
00000001808a4f2d: mov      rax, qword ptr [rip + 0x7f8c34c] ; TypeInfo Torappu.Battle.SPFA @0x188831280
00000001808a4f34: mov      rax, qword ptr [rax + 0xb8]
00000001808a4f3b: mov      rcx, qword ptr [rax + 0x18]
00000001808a4f3f: test     rcx, rcx
00000001808a4f42: jne      0x1808a5172
00000001808a4f48: mov      qword ptr [rsp + 0x60], rdi
00000001808a4f4d: mov      qword ptr [rsp + 0x68], r14
00000001808a4f52: mov      rcx, qword ptr [rbp + 0x18]
00000001808a4f56: test     rcx, rcx
00000001808a4f59: je       0x1808a51a3
00000001808a4f5f: movsxd   rax, dword ptr [rbx + 8]
00000001808a4f63: cmp      eax, dword ptr [rcx + 0x18]
00000001808a4f66: jae      0x1808a51a9
00000001808a4f6c: mov      rcx, qword ptr [rcx + rax*8 + 0x20]
00000001808a4f71: test     rcx, rcx
00000001808a4f74: je       0x1808a51a3
00000001808a4f7a: movups   xmm0, xmmword ptr [rbx]
00000001808a4f7d: mov      r9, qword ptr [rip + 0x808bd3c] ; GenericMethodInfo 248375 @0x188930cc0
00000001808a4f84: lea      r8, [rsp + 0x30]
00000001808a4f89: lea      rdx, [rsp + 0x40]
00000001808a4f8e: movaps   xmmword ptr [rsp + 0x40], xmm0
00000001808a4f93: call     0x18596f520
00000001808a4f98: test     al, al
00000001808a4f9a: jne      0x1808a5034
00000001808a4fa0: mov      rcx, qword ptr [rbp + 0x18]
00000001808a4fa4: test     rcx, rcx
00000001808a4fa7: je       0x1808a51a3
00000001808a4fad: movsxd   rax, dword ptr [rbx + 8]
00000001808a4fb1: cmp      eax, dword ptr [rcx + 0x18]
00000001808a4fb4: jae      0x1808a51a9
00000001808a4fba: mov      rcx, qword ptr [rcx + rax*8 + 0x20]
00000001808a4fbf: test     rcx, rcx
00000001808a4fc2: je       0x1808a51a3
00000001808a4fc8: movups   xmm0, xmmword ptr [rbx]
00000001808a4fcb: mov      r9, qword ptr [rip + 0x808b86e] ; GenericMethodInfo 248373 @0x188930840
00000001808a4fd2: lea      rdx, [rsp + 0x40]
00000001808a4fd7: mov      r8, rsi
00000001808a4fda: movaps   xmmword ptr [rsp + 0x40], xmm0
00000001808a4fdf: call     0x18595e920
00000001808a4fe4: movups   xmm0, xmmword ptr [rbx]
00000001808a4fe7: xor      r9d, r9d
00000001808a4fea: lea      rdx, [rsp + 0x40]
00000001808a4fef: mov      r8, rsi
00000001808a4ff2: mov      rcx, rbp
00000001808a4ff5: movaps   xmmword ptr [rsp + 0x40], xmm0
00000001808a4ffa: call     0x1808a5860 ; Torappu.Battle.SPFA._GenerateNextMapImpl [70333]
00000001808a4fff: movups   xmm0, xmmword ptr [rbx]
00000001808a5002: xor      r9d, r9d
00000001808a5005: lea      rdx, [rsp + 0x40]
00000001808a500a: mov      r8, rsi
00000001808a500d: mov      rcx, rbp
00000001808a5010: movaps   xmmword ptr [rsp + 0x40], xmm0
00000001808a5015: call     0x1808a5fe0 ; Torappu.Battle.SPFA._PostprocessAndMakeNextMapSmoothly [70341]
00000001808a501a: mov      rdi, qword ptr [rsp + 0x60]
00000001808a501f: mov      r14, qword ptr [rsp + 0x68]
00000001808a5024: mov      rbx, qword ptr [rsp + 0x70]
00000001808a5029: mov      rbp, qword ptr [rsp + 0x78]
00000001808a502e: add      rsp, 0x50
00000001808a5032: pop      rsi
00000001808a5033: ret      
00000001808a5034: cmp      byte ptr [rip + 0x83ec4da], 0
00000001808a503b: mov      rbx, qword ptr [rsp + 0x30]
00000001808a5040: jne      0x1808a5055
00000001808a5042: lea      rcx, [rip + 0x7f8c237] ; TypeInfo Torappu.Battle.SPFA @0x188831280
00000001808a5049: call     0x18048bf00
00000001808a504e: mov      byte ptr [rip + 0x83ec4c0], 1
00000001808a5055: mov      rax, qword ptr [rip + 0x7f8c224] ; TypeInfo Torappu.Battle.SPFA @0x188831280
00000001808a505c: cmp      dword ptr [rax + 0xe0], 0
00000001808a5063: jne      0x1808a5074
00000001808a5065: mov      rcx, rax
00000001808a5068: call     0x18048c140
00000001808a506d: mov      rax, qword ptr [rip + 0x7f8c20c] ; TypeInfo Torappu.Battle.SPFA @0x188831280
00000001808a5074: mov      rax, qword ptr [rax + 0xb8]
00000001808a507b: mov      rcx, qword ptr [rax + 0x60]
00000001808a507f: test     rcx, rcx
00000001808a5082: jne      0x1808a5156
00000001808a5088: test     rbx, rbx
00000001808a508b: je       0x1808a51a3
00000001808a5091: xor      edx, edx
00000001808a5093: mov      rcx, rbx
00000001808a5096: call     0x185eec590
00000001808a509b: xor      r9d, r9d
00000001808a509e: mov      r8d, eax
00000001808a50a1: mov      rdx, rsi
00000001808a50a4: mov      rcx, rbx
00000001808a50a7: call     0x185ee9f90
00000001808a50ac: mov      rax, qword ptr [rbp + 0x10]
00000001808a50b0: xor      r14d, r14d
00000001808a50b3: xor      ebx, ebx
00000001808a50b5: test     rax, rax
00000001808a50b8: je       0x1808a51a3
00000001808a50be: nop      
00000001808a50c0: xor      edx, edx
00000001808a50c2: mov      rcx, rax
00000001808a50c5: call     0x180886a20 ; Torappu.Battle.Map.get_height [69971]
00000001808a50ca: cmp      ebx, eax
00000001808a50cc: jge      0x1808a501a
00000001808a50d2: xor      edi, edi
00000001808a50d4: nop      dword ptr [rax]
00000001808a50d8: nop      dword ptr [rax + rax]
00000001808a50e0: mov      rcx, qword ptr [rbp + 0x10]
00000001808a50e4: test     rcx, rcx
00000001808a50e7: je       0x1808a51a3
00000001808a50ed: xor      edx, edx
00000001808a50ef: call     0x180887350 ; Torappu.Battle.Map.get_width [69970]
00000001808a50f4: cmp      edi, eax
00000001808a50f6: jge      0x1808a5142
00000001808a50f8: test     rsi, rsi
00000001808a50fb: je       0x1808a51a3
00000001808a5101: movsxd   r8, edi
00000001808a5104: mov      rcx, rsi
00000001808a5107: movsxd   rdx, r14d
00000001808a510a: call     0x1800169b0
00000001808a510f: mov      rbx, rax
00000001808a5112: mov      ecx, dword ptr [rax + 0x24]
00000001808a5115: mov      dword ptr [rax + 0x28], ecx
00000001808a5118: xor      ecx, ecx
00000001808a511a: call     0x1805073b0 ; Torappu.Battle.BasicCursor.DisappearCheckpoint.GetNextDirection [70205] | Torappu.Battle.BasicCursor.AppearAtPosCheckpoint.GetNextDirection [70214] | Torappu.Battle.BasicCursor.WaitForSecondsCheckpoint.GetNextDirection [70219] | Torappu.Battle.BasicCursor.WaitForPlayTimeCheckpoint.GetNextDirection [70228] | Torappu.Battle.BasicCursor.WaitCurrentWaveTimeCheckpoint.GetNextDirection [70234] | Torappu.Battle.BasicCursor.WaitCurrentFragmentTimeCheckpoint.GetNextDirection [70240] | Torappu.Battle.BasicCursor.AlertCheckpoint.GetNextDirection [70245] | Torappu.Battle.BasicCursor.WaitBossrushWaveCheckPoint.GetNextDirection [70254]
00000001808a511f: mov      qword ptr [rsp + 0x40], rax
00000001808a5124: inc      edi
00000001808a5126: movss    xmm0, dword ptr [rsp + 0x40]
00000001808a512c: movss    xmm1, dword ptr [rsp + 0x44]
00000001808a5132: movss    dword ptr [rbx + 0x10], xmm0
00000001808a5137: movss    dword ptr [rbx + 0x14], xmm1
00000001808a513c: mov      byte ptr [rbx + 0x2c], 0
00000001808a5140: jmp      0x1808a50e0
00000001808a5142: mov      rax, qword ptr [rbp + 0x10]
00000001808a5146: inc      r14d
00000001808a5149: mov      ebx, r14d
00000001808a514c: test     rax, rax
00000001808a514f: je       0x1808a51a3
00000001808a5151: jmp      0x1808a50c0
00000001808a5156: mov      r9, rsi
00000001808a5159: mov      qword ptr [rsp + 0x20], 0
00000001808a5162: mov      r8, rbx
00000001808a5165: mov      rdx, rbp
00000001808a5168: call     0x18339deb0 ; XLua.DelegateBridge.__Gen_Delegate_Imp36 [2691]
00000001808a516d: jmp      0x1808a501a
00000001808a5172: movups   xmm0, xmmword ptr [rbx]
00000001808a5175: mov      r9, rsi
00000001808a5178: mov      qword ptr [rsp + 0x20], 0
00000001808a5181: lea      r8, [rsp + 0x40]
00000001808a5186: mov      rdx, rbp
00000001808a5189: movaps   xmmword ptr [rsp + 0x40], xmm0
00000001808a518e: call     0x1833650b0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3345 [6000]
00000001808a5193: mov      rbx, qword ptr [rsp + 0x70]
00000001808a5198: mov      rbp, qword ptr [rsp + 0x78]
00000001808a519d: add      rsp, 0x50
00000001808a51a1: pop      rsi
00000001808a51a2: ret      
00000001808a51a3: call     0x18048c0b0
00000001808a51a8: int3     
00000001808a51a9: call     0x18048c0a0
00000001808a51ae: int3     
00000001808a51af: int3     