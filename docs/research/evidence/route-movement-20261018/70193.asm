; Torappu.Battle.BasicCursor.MoveCheckpoint.CheckReached metadata=70193 token=0x6011232 VA=0x18089fdb0 RVA=0x89fdb0 size=0x1f0
000000018089fdb0: mov      qword ptr [rsp + 0x10], rbx
000000018089fdb5: mov      qword ptr [rsp + 0x18], rsi
000000018089fdba: push     rdi
000000018089fdbb: sub      rsp, 0x50
000000018089fdbf: cmp      byte ptr [rip + 0x83f16fd], 0
000000018089fdc6: mov      rdi, rcx
000000018089fdc9: movaps   xmmword ptr [rsp + 0x30], xmm7
000000018089fdce: movq     xmm7, rdx
000000018089fdd3: jne      0x18089fdf4
000000018089fdd5: lea      rcx, [rip + 0x80251ac] ; TypeInfo Torappu.GridPosition @0x1888c4f88
000000018089fddc: call     0x18048bf00
000000018089fde1: lea      rcx, [rip + 0x8023e50] ; TypeInfo Torappu.MathUtil @0x1888c3c38
000000018089fde8: call     0x18048bf00
000000018089fded: mov      byte ptr [rip + 0x83f16cf], 1
000000018089fdf4: mov      rcx, qword ptr [rip + 0x802518d] ; TypeInfo Torappu.GridPosition @0x1888c4f88
000000018089fdfb: cmp      dword ptr [rcx + 0xe0], 0
000000018089fe02: jne      0x18089fe09
000000018089fe04: call     0x18048c140
000000018089fe09: xor      edx, edx
000000018089fe0b: movaps   xmmword ptr [rsp + 0x20], xmm8
000000018089fe11: movq     rcx, xmm7
000000018089fe16: call     0x182103900 ; Torappu.GridPosition.FromVectorPosition [28047]
000000018089fe1b: mov      rsi, qword ptr [rdi + 0x18]
000000018089fe1f: mov      rbx, rax
000000018089fe22: mov      qword ptr [rsp + 0x60], rax
000000018089fe27: test     rsi, rsi
000000018089fe2a: je       0x18089ff85
000000018089fe30: cmp      byte ptr [rip + 0x842c9b9], 0
000000018089fe37: jbe      0x18089fe41
000000018089fe39: mov      rcx, qword ptr [rsi]
000000018089fe3c: call     0x180446d00
000000018089fe41: mov      rdx, qword ptr [rsi]
000000018089fe44: mov      rcx, rsi
000000018089fe47: mov      rax, qword ptr [rdx + 0x180]
000000018089fe4e: mov      rdx, qword ptr [rdx + 0x188]
000000018089fe55: call     rax
000000018089fe57: test     al, al
000000018089fe59: jne      0x18089fef0
000000018089fe5f: mov      rcx, qword ptr [rdi + 0x18]
000000018089fe63: test     rcx, rcx
000000018089fe66: je       0x18089ff85
000000018089fe6c: xor      edx, edx
000000018089fe6e: call     0x180877390 ; Torappu.Battle.BasicCursor.get_route [70151]
000000018089fe73: test     rax, rax
000000018089fe76: je       0x18089ff85
000000018089fe7c: mov      rcx, qword ptr [rax + 0x10]
000000018089fe80: test     rcx, rcx
000000018089fe83: je       0x18089ff85
000000018089fe89: xor      r8d, r8d
000000018089fe8c: mov      rdx, rbx
000000018089fe8f: call     0x18087a3a0 ; Torappu.Battle.Map.CheckGridValid [70066]
000000018089fe94: test     al, al
000000018089fe96: je       0x18089ff81
000000018089fe9c: mov      rcx, qword ptr [rdi + 0x28]
000000018089fea0: test     rcx, rcx
000000018089fea3: je       0x18089ff85
000000018089fea9: mov      rax, qword ptr [rcx + 0x10]
000000018089fead: movsxd   r8, dword ptr [rsp + 0x64]
000000018089feb2: movsxd   r9, ebx
000000018089feb5: cmp      r9d, dword ptr [rax]
000000018089feb8: jae      0x18089ff8b
000000018089febe: mov      rdx, qword ptr [rax + 0x10]
000000018089fec2: cmp      r8d, edx
000000018089fec5: jae      0x18089ff8b
000000018089fecb: imul     rdx, r9
000000018089fecf: add      rcx, 0x20
000000018089fed3: add      rdx, r8
000000018089fed6: lea      rax, [rdx + rdx*2]
000000018089feda: xor      edx, edx
000000018089fedc: shl      rax, 4
000000018089fee0: add      rcx, rax
000000018089fee3: call     0x1808a0db0 ; Torappu.Battle.Route.Node.get_isValid [70387]
000000018089fee8: test     al, al
000000018089feea: je       0x18089ff81
000000018089fef0: cmp      byte ptr [rip + 0x842c8f9], 0
000000018089fef7: jbe      0x18089ff01
000000018089fef9: mov      rcx, qword ptr [rdi]
000000018089fefc: call     0x180446d00
000000018089ff01: mov      rdx, qword ptr [rdi]
000000018089ff04: mov      rcx, rdi
000000018089ff07: mov      rax, qword ptr [rdx + 0x220]
000000018089ff0e: mov      rdx, qword ptr [rdx + 0x228]
000000018089ff15: call     rax
000000018089ff17: movq     xmm8, rax
000000018089ff1c: mov      rax, qword ptr [rdi + 0x10]
000000018089ff20: test     rax, rax
000000018089ff23: je       0x18089ff85
000000018089ff25: movaps   xmmword ptr [rsp + 0x40], xmm6
000000018089ff2a: movss    xmm6, dword ptr [rip + 0x65a0d4a]
000000018089ff32: maxss    xmm6, dword ptr [rax + 0x2c]
000000018089ff37: mov      rcx, qword ptr [rip + 0x8023cfa] ; TypeInfo Torappu.MathUtil @0x1888c3c38
000000018089ff3e: cmp      dword ptr [rcx + 0xe0], 0
000000018089ff45: jne      0x18089ff4c
000000018089ff47: call     0x18048c140
000000018089ff4c: xor      r9d, r9d
000000018089ff4f: movaps   xmm2, xmm6
000000018089ff52: movq     rdx, xmm8
000000018089ff57: movq     rcx, xmm7
000000018089ff5c: call     0x1866e3dc0 ; Torappu.MathUtil.CheckDistance [220420]
000000018089ff61: movaps   xmm6, xmmword ptr [rsp + 0x40]
000000018089ff66: movaps   xmm8, xmmword ptr [rsp + 0x20]
000000018089ff6c: mov      rbx, qword ptr [rsp + 0x68]
000000018089ff71: mov      rsi, qword ptr [rsp + 0x70]
000000018089ff76: movaps   xmm7, xmmword ptr [rsp + 0x30]
000000018089ff7b: add      rsp, 0x50
000000018089ff7f: pop      rdi
000000018089ff80: ret      
000000018089ff81: mov      al, 1
000000018089ff83: jmp      0x18089ff66
000000018089ff85: call     0x18048c0b0
000000018089ff8a: int3     
000000018089ff8b: call     0x18048c0a0
000000018089ff90: int3     
000000018089ff91: int3     
000000018089ff92: int3     
000000018089ff93: int3     
000000018089ff94: int3     
000000018089ff95: int3     
000000018089ff96: int3     
000000018089ff97: int3     
000000018089ff98: int3     
000000018089ff99: int3     
000000018089ff9a: int3     
000000018089ff9b: int3     
000000018089ff9c: int3     
000000018089ff9d: int3     
000000018089ff9e: int3     
000000018089ff9f: int3     
