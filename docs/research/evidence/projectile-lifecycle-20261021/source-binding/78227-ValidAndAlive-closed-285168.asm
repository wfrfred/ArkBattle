; Torappu.Battle.BattleUtil.ValidAndAlive metadata=78227 token=0x6013194 VA=0x18449ab40 RVA=0x449ab40 size=0x180
000000018449ab40: mov      qword ptr [rsp + 8], rbx
000000018449ab45: mov      qword ptr [rsp + 0x10], rsi
000000018449ab4a: push     rdi
000000018449ab4b: sub      rsp, 0x40
000000018449ab4f: cmp      qword ptr [rdx + 0x38], 0
000000018449ab54: mov      rbx, rdx
000000018449ab57: mov      rdi, rcx
000000018449ab5a: jne      0x18449ab83
000000018449ab5c: lea      rcx, [rip + 0x449cdfd] ; TypeInfo Torappu.Battle.BattleUtil @0x188937960
000000018449ab63: call     0x18048bf00
000000018449ab68: lea      rcx, [rip + 0x4490249] ; GenericMethodInfo 232548 @0x18892adb8
000000018449ab6f: call     0x18048bf00
000000018449ab74: cmp      qword ptr [rbx + 0x38], 0
000000018449ab79: jne      0x18449ab83
000000018449ab7b: mov      rcx, rbx
000000018449ab7e: call     0x180446470
000000018449ab83: mov      rax, qword ptr [rip + 0x449cdd6] ; TypeInfo Torappu.Battle.BattleUtil @0x188937960
000000018449ab8a: mov      rcx, qword ptr [rax + 0xb8]
000000018449ab91: mov      rsi, qword ptr [rcx + 0x40]
000000018449ab95: test     rsi, rsi
000000018449ab98: jne      0x18449ac12
000000018449ab9a: mov      rdx, qword ptr [rbx + 0x38]
000000018449ab9e: mov      rcx, rdi
000000018449aba1: mov      rdx, qword ptr [rdx + 8]
000000018449aba5: call     0x185159fc0
000000018449abaa: test     al, al
000000018449abac: jne      0x18449abbe
000000018449abae: mov      rbx, qword ptr [rsp + 0x50]
000000018449abb3: mov      rsi, qword ptr [rsp + 0x58]
000000018449abb8: add      rsp, 0x40
000000018449abbc: pop      rdi
000000018449abbd: ret      
000000018449abbe: mov      rdx, qword ptr [rbx + 0x38]
000000018449abc2: mov      rcx, rdi
000000018449abc5: mov      rdx, qword ptr [rdx + 0x18]
000000018449abc9: call     0x185159d80
000000018449abce: mov      rbx, rax
000000018449abd1: test     rax, rax
000000018449abd4: je       0x18449ac82
000000018449abda: cmp      byte ptr [rip + 0x4831c0f], 0
000000018449abe1: jbe      0x18449abeb
000000018449abe3: mov      rcx, qword ptr [rax]
000000018449abe6: call     0x180446d00
000000018449abeb: mov      rdx, qword ptr [rbx]
000000018449abee: mov      rcx, rbx
000000018449abf1: mov      r8, qword ptr [rdx + 0x3c0]
000000018449abf8: mov      rdx, qword ptr [rdx + 0x3c8]
000000018449abff: call     r8
000000018449ac02: mov      rbx, qword ptr [rsp + 0x50]
000000018449ac07: mov      rsi, qword ptr [rsp + 0x58]
000000018449ac0c: add      rsp, 0x40
000000018449ac10: pop      rdi
000000018449ac11: ret      
000000018449ac12: xor      edx, edx
000000018449ac14: movaps   xmmword ptr [rsp + 0x30], xmm6
000000018449ac19: mov      rcx, rsi
000000018449ac1c: call     0x1830626c0 ; XLua.DelegateBridge.InvokeSessionStart [15516]
000000018449ac21: mov      rax, qword ptr [rbx + 0x38]
000000018449ac25: movups   xmm6, xmmword ptr [rdi]
000000018449ac28: mov      rcx, qword ptr [rax]
000000018449ac2b: cmp      qword ptr [rcx + 0x20], 0
000000018449ac30: jne      0x18449ac34
000000018449ac32: call     qword ptr [rcx]
000000018449ac34: mov      r8, qword ptr [rbx + 0x38]
000000018449ac38: lea      rdx, [rsp + 0x20]
000000018449ac3d: mov      rcx, rsi
000000018449ac40: movdqa   xmmword ptr [rsp + 0x20], xmm6
000000018449ac46: mov      r8, qword ptr [r8]
000000018449ac49: call     0x1844c5100
000000018449ac4e: xor      r8d, r8d
000000018449ac51: mov      edx, 1
000000018449ac56: mov      rcx, rsi
000000018449ac59: call     0x183062770 ; XLua.DelegateBridge.Invoke [15517]
000000018449ac5e: mov      rdx, qword ptr [rip + 0x4490153] ; GenericMethodInfo 232548 @0x18892adb8
000000018449ac65: mov      rcx, rsi
000000018449ac68: call     0x1844c7bb0
000000018449ac6d: movaps   xmm6, xmmword ptr [rsp + 0x30]
000000018449ac72: mov      rbx, qword ptr [rsp + 0x50]
000000018449ac77: mov      rsi, qword ptr [rsp + 0x58]
000000018449ac7c: add      rsp, 0x40
000000018449ac80: pop      rdi
000000018449ac81: ret      
000000018449ac82: call     0x18048c0b0
000000018449ac87: int3     
000000018449ac88: int3     
000000018449ac89: int3     
000000018449ac8a: int3     
000000018449ac8b: int3     
000000018449ac8c: int3     
000000018449ac8d: int3     
000000018449ac8e: int3     
000000018449ac8f: int3     
000000018449ac90: mov      qword ptr [rsp + 0x18], rbp
000000018449ac95: mov      qword ptr [rsp + 0x20], rsi
000000018449ac9a: mov      dword ptr [rsp + 8], ecx
000000018449ac9e: push     rdi
000000018449ac9f: sub      rsp, 0x20
000000018449aca3: cmp      qword ptr [r8 + 0x38], 0
000000018449aca8: mov      rdi, r8
000000018449acab: movzx    ebp, dl
000000018449acae: jne      0x18449acef
000000018449acb0: lea      rcx, [rip + 0x449cca9] ; TypeInfo Torappu.Battle.BattleUtil @0x188937960
000000018449acb7: call     0x18048bf00