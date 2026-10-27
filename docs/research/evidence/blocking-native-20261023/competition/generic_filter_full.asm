; Torappu.Battle.FilterUtil.generic_filter_full metadata=-1 token=0x0 VA=0x184511e30 RVA=0x4511e30 size=0x18a
0000000184511e30: mov      qword ptr [rsp + 8], rbx
0000000184511e35: mov      qword ptr [rsp + 0x10], rbp
0000000184511e3a: mov      qword ptr [rsp + 0x18], rsi
0000000184511e3f: push     rdi
0000000184511e40: push     r14
0000000184511e42: push     r15
0000000184511e44: sub      rsp, 0x30
0000000184511e48: mov      rbx, qword ptr [rsp + 0x70]
0000000184511e4d: mov      rsi, r9
0000000184511e50: mov      ebp, r8d
0000000184511e53: mov      r14, rdx
0000000184511e56: mov      r15, rcx
0000000184511e59: cmp      qword ptr [rbx + 0x38], 0
0000000184511e5e: jne      0x184511eab
0000000184511e60: lea      rcx, [rip + 0x439ef09] ; GenericMethodInfo 291272 @0x1888b0d70
0000000184511e67: call     0x18048bf00
0000000184511e6c: lea      rcx, [rip + 0x43ecac5] ; GenericMethodInfo 291773 @0x1888fe938
0000000184511e73: call     0x18048bf00
0000000184511e78: lea      rcx, [rip + 0x43a8021] ; GenericMethodInfo 232035 @0x1888b9ea0
0000000184511e7f: call     0x18048bf00
0000000184511e84: lea      rcx, [rip + 0x44117f5] ; GenericMethodInfo 291950 @0x188923680
0000000184511e8b: call     0x18048bf00
0000000184511e90: lea      rcx, [rip + 0x4362c89] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
0000000184511e97: call     0x18048bf00
0000000184511e9c: cmp      qword ptr [rbx + 0x38], 0
0000000184511ea1: jne      0x184511eab
0000000184511ea3: mov      rcx, rbx
0000000184511ea6: call     0x180446470
0000000184511eab: mov      rcx, qword ptr [rip + 0x4362c6e] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
0000000184511eb2: cmp      dword ptr [rcx + 0xe0], 0
0000000184511eb9: jne      0x184511ec7
0000000184511ebb: call     0x18048c140
0000000184511ec0: mov      rcx, qword ptr [rip + 0x4362c59] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
0000000184511ec7: mov      rax, qword ptr [rcx + 0xb8]
0000000184511ece: mov      rdi, qword ptr [rax + 0x88]
0000000184511ed5: test     rdi, rdi
0000000184511ed8: jne      0x184511f21
0000000184511eda: cmp      dword ptr [rcx + 0xe0], edi
0000000184511ee0: jne      0x184511eee
0000000184511ee2: call     0x18048c140
0000000184511ee7: mov      rcx, qword ptr [rip + 0x4362c32] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
0000000184511eee: mov      rax, qword ptr [rcx + 0xb8]
0000000184511ef5: mov      r9, rsi
0000000184511ef8: mov      rcx, qword ptr [rbx + 0x38]
0000000184511efc: mov      r8d, ebp
0000000184511eff: mov      rax, qword ptr [rax + 0x10]
0000000184511f03: mov      rdx, qword ptr [rcx + 8]
0000000184511f07: mov      rcx, r15
0000000184511f0a: mov      qword ptr [rsp + 0x28], rdx
0000000184511f0f: mov      rdx, r14
0000000184511f12: mov      qword ptr [rsp + 0x20], rax
0000000184511f17: call     0x184511870
0000000184511f1c: jmp      0x184511fa1
0000000184511f21: xor      edx, edx
0000000184511f23: mov      rcx, rdi
0000000184511f26: call     0x1830626c0 ; XLua.DelegateBridge.InvokeSessionStart [15516]
0000000184511f2b: mov      rax, qword ptr [rbx + 0x38]
0000000184511f2f: mov      rcx, qword ptr [rax]
0000000184511f32: cmp      qword ptr [rcx + 0x20], 0
0000000184511f37: jne      0x184511f3b
0000000184511f39: call     qword ptr [rcx]
0000000184511f3b: mov      r8, qword ptr [rbx + 0x38]
0000000184511f3f: mov      rdx, r15
0000000184511f42: mov      rcx, rdi
0000000184511f45: mov      r8, qword ptr [r8]
0000000184511f48: call     0x1844c6730
0000000184511f4d: mov      r8, qword ptr [rip + 0x439ee1c] ; GenericMethodInfo 291272 @0x1888b0d70
0000000184511f54: mov      rdx, r14
0000000184511f57: mov      rcx, rdi
0000000184511f5a: call     0x1844c6730
0000000184511f5f: mov      r8, qword ptr [rip + 0x43a7f3a] ; GenericMethodInfo 232035 @0x1888b9ea0
0000000184511f66: mov      edx, ebp
0000000184511f68: mov      rcx, rdi
0000000184511f6b: call     0x1844c6210
0000000184511f70: mov      r8, qword ptr [rip + 0x43ec9c1] ; GenericMethodInfo 291773 @0x1888fe938
0000000184511f77: mov      rdx, rsi
0000000184511f7a: mov      rcx, rdi
0000000184511f7d: call     0x1844c6730
0000000184511f82: xor      r8d, r8d
0000000184511f85: mov      edx, 1
0000000184511f8a: mov      rcx, rdi
0000000184511f8d: call     0x183062770 ; XLua.DelegateBridge.Invoke [15517]
0000000184511f92: mov      rdx, qword ptr [rip + 0x44116e7] ; GenericMethodInfo 291950 @0x188923680
0000000184511f99: mov      rcx, rdi
0000000184511f9c: call     0x1844c9fe0
0000000184511fa1: mov      rbx, qword ptr [rsp + 0x50]
0000000184511fa6: mov      rbp, qword ptr [rsp + 0x58]
0000000184511fab: mov      rsi, qword ptr [rsp + 0x60]
0000000184511fb0: add      rsp, 0x30
0000000184511fb4: pop      r15
0000000184511fb6: pop      r14
0000000184511fb8: pop      rdi
0000000184511fb9: ret      