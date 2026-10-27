; Torappu.Battle.MoveController..ctor metadata=71070 token=0x601159f VA=0x1808b8580 RVA=0x8b8580 size=0x100
00000001808b8580: mov      qword ptr [rsp + 8], rbx
00000001808b8585: push     rdi
00000001808b8586: sub      rsp, 0x20
00000001808b858a: cmp      byte ptr [rip + 0x83d91b5], 0
00000001808b8591: mov      rbx, rcx
00000001808b8594: jne      0x1808b85b5
00000001808b8596: lea      rcx, [rip + 0x804550b] ; TypeInfo Torappu.Battle.MoveController @0x1888fdaa8
00000001808b859d: call     0x18048bf00
00000001808b85a2: lea      rcx, [rip + 0x80a706f] ; TypeInfo Torappu.PeriodicTicker @0x18895f618
00000001808b85a9: call     0x18048bf00
00000001808b85ae: mov      byte ptr [rip + 0x83d9191], 1
00000001808b85b5: mov      dword ptr [rbx + 0x18], 0x40200000
00000001808b85bc: mov      dword ptr [rbx + 0x1c], 0x40800000
00000001808b85c3: mov      dword ptr [rbx + 0x20], 0x3e4ccccd
00000001808b85ca: mov      rcx, qword ptr [rip + 0x80a7047] ; TypeInfo Torappu.PeriodicTicker @0x18895f618
00000001808b85d1: call     0x18045cfe0
00000001808b85d6: mov      rdi, rax
00000001808b85d9: test     rax, rax
00000001808b85dc: je       0x1808b8676
00000001808b85e2: xor      r9d, r9d
00000001808b85e5: xor      r8d, r8d
00000001808b85e8: mov      edx, 3
00000001808b85ed: mov      rcx, rax
00000001808b85f0: call     0x181e043f0 ; Torappu.PeriodicTicker..ctor [25960]
00000001808b85f5: lea      rcx, [rbx + 0x50]
00000001808b85f9: mov      qword ptr [rbx + 0x50], rdi
00000001808b85fd: mov      rdx, rdi
00000001808b8600: call     0x18048b9e0
00000001808b8605: mov      rcx, qword ptr [rip + 0x80a700c] ; TypeInfo Torappu.PeriodicTicker @0x18895f618
00000001808b860c: call     0x18045cfe0
00000001808b8611: mov      rdi, rax
00000001808b8614: test     rax, rax
00000001808b8617: je       0x1808b8676
00000001808b8619: xor      r9d, r9d
00000001808b861c: xor      r8d, r8d
00000001808b861f: mov      edx, 3
00000001808b8624: mov      rcx, rax
00000001808b8627: call     0x181e043f0 ; Torappu.PeriodicTicker..ctor [25960]
00000001808b862c: lea      rcx, [rbx + 0x58]
00000001808b8630: mov      qword ptr [rbx + 0x58], rdi
00000001808b8634: mov      rdx, rdi
00000001808b8637: call     0x18048b9e0
00000001808b863c: xor      edx, edx
00000001808b863e: mov      rcx, rbx
00000001808b8641: call     0x186b58fb0
00000001808b8646: mov      rax, qword ptr [rip + 0x804545b] ; TypeInfo Torappu.Battle.MoveController @0x1888fdaa8
00000001808b864d: mov      rcx, qword ptr [rax + 0xb8]
00000001808b8654: mov      rcx, qword ptr [rcx + 0xb8]
00000001808b865b: test     rcx, rcx
00000001808b865e: je       0x1808b866b
00000001808b8660: xor      r8d, r8d
00000001808b8663: mov      rdx, rbx
00000001808b8666: call     0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
00000001808b866b: mov      rbx, qword ptr [rsp + 0x30]
00000001808b8670: add      rsp, 0x20
00000001808b8674: pop      rdi
00000001808b8675: ret      
00000001808b8676: call     0x18048c0b0
00000001808b867b: int3     
00000001808b867c: int3     
00000001808b867d: int3     
00000001808b867e: int3     
00000001808b867f: int3     