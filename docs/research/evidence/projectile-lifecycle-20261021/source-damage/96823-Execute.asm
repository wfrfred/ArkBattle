; Torappu.Battle.Action.Nodes.ApplyDamage.Execute metadata=96823 token=0x6017a38 VA=0x18104a780 RVA=0x104a780 size=0x2c0
000000018104a780: mov      qword ptr [rsp + 8], rbx
000000018104a785: mov      qword ptr [rsp + 0x10], rbp
000000018104a78a: mov      qword ptr [rsp + 0x18], rsi
000000018104a78f: push     rdi
000000018104a790: sub      rsp, 0x150
000000018104a797: cmp      byte ptr [rip + 0x7c4bf26], 0
000000018104a79e: mov      rsi, r9
000000018104a7a1: mov      ebx, r8d
000000018104a7a4: mov      rbp, rdx
000000018104a7a7: mov      rdi, rcx
000000018104a7aa: jne      0x18104a7e3
000000018104a7ac: lea      rcx, [rip + 0x77cad95] ; TypeInfo Torappu.Battle.Action.Nodes.ApplyDamage @0x188815548
000000018104a7b3: call     0x18048bf00
000000018104a7b8: lea      rcx, [rip + 0x780ff41] ; TypeInfo Torappu.FP @0x18885a700
000000018104a7bf: call     0x18048bf00
000000018104a7c4: lea      rcx, [rip + 0x78a29ad] ; TypeInfo Torappu.Battle.Modifier @0x1888ed178
000000018104a7cb: call     0x18048bf00
000000018104a7d0: lea      rcx, [rip + 0x78e8511] ; TypeInfo UnityEngine.Object @0x188932ce8
000000018104a7d7: call     0x18048bf00
000000018104a7dc: mov      byte ptr [rip + 0x7c4bee1], 1
000000018104a7e3: xorps    xmm0, xmm0
000000018104a7e6: xor      eax, eax
000000018104a7e8: mov      qword ptr [rsp + 0xb0], rax
000000018104a7f0: mov      rax, qword ptr [rip + 0x77cad51] ; TypeInfo Torappu.Battle.Action.Nodes.ApplyDamage @0x188815548
000000018104a7f7: movups   xmmword ptr [rsp + 0x30], xmm0
000000018104a7fc: movups   xmmword ptr [rsp + 0x40], xmm0
000000018104a801: movups   xmmword ptr [rsp + 0x50], xmm0
000000018104a806: movups   xmmword ptr [rsp + 0x60], xmm0
000000018104a80b: movups   xmmword ptr [rsp + 0x70], xmm0
000000018104a810: movups   xmmword ptr [rsp + 0x80], xmm0
000000018104a818: movups   xmmword ptr [rsp + 0x90], xmm0
000000018104a820: movups   xmmword ptr [rsp + 0xa0], xmm0
000000018104a828: mov      rcx, qword ptr [rax + 0xb8]
000000018104a82f: mov      rcx, qword ptr [rcx + 0x30]
000000018104a833: test     rcx, rcx
000000018104a836: jne      0x18104a9fa
000000018104a83c: mov      rcx, qword ptr [rip + 0x78e84a5] ; TypeInfo UnityEngine.Object @0x188932ce8
000000018104a843: mov      rbx, qword ptr [rsi + 8]
000000018104a847: cmp      dword ptr [rcx + 0xe0], 0
000000018104a84e: jne      0x18104a855
000000018104a850: call     0x18048c140
000000018104a855: xor      r8d, r8d
000000018104a858: xor      edx, edx
000000018104a85a: mov      rcx, rbx
000000018104a85d: call     0x186b638d0
000000018104a862: test     al, al
000000018104a864: jne      0x18104a9f6
000000018104a86a: mov      rcx, qword ptr [rip + 0x78e8477] ; TypeInfo UnityEngine.Object @0x188932ce8
000000018104a871: mov      rbx, qword ptr [rsi]
000000018104a874: cmp      dword ptr [rcx + 0xe0], 0
000000018104a87b: jne      0x18104a882
000000018104a87d: call     0x18048c140
000000018104a882: xor      r8d, r8d
000000018104a885: xor      edx, edx
000000018104a887: mov      rcx, rbx
000000018104a88a: call     0x186b638d0
000000018104a88f: test     al, al
000000018104a891: je       0x18104a8cb
000000018104a893: mov      rcx, qword ptr [rip + 0x780fe66] ; TypeInfo Torappu.FP @0x18885a700
000000018104a89a: mov      rbx, qword ptr [rdi + 0x28]
000000018104a89e: cmp      dword ptr [rcx + 0xe0], 0
000000018104a8a5: jne      0x18104a8ac
000000018104a8a7: call     0x18048c140
000000018104a8ac: xor      edx, edx
000000018104a8ae: xor      ecx, ecx
000000018104a8b0: call     0x1866fdac0
000000018104a8b5: xor      r8d, r8d
000000018104a8b8: mov      rdx, rax
000000018104a8bb: mov      rcx, rbx
000000018104a8be: call     0x185ed91f0
000000018104a8c3: test     al, al
000000018104a8c5: jne      0x18104a9f6
000000018104a8cb: mov      r8, qword ptr [rsi + 0xb8]
000000018104a8d2: xor      r9d, r9d
000000018104a8d5: mov      rdx, qword ptr [rsi + 8]
000000018104a8d9: mov      rcx, rdi
000000018104a8dc: call     0x18104abb0 ; Torappu.Battle.Action.Nodes.ApplyDamage._SetAttackTypeByMainTarget [96829]
000000018104a8e1: mov      rax, qword ptr [rsi + 8]
000000018104a8e5: lea      rcx, [rsp + 0xc0]
000000018104a8ed: mov      r9, qword ptr [rsi]
000000018104a8f0: mov      edx, 9
000000018104a8f5: mov      r8, rdi
000000018104a8f8: mov      qword ptr [rsp + 0x20], rax
000000018104a8fd: call     0x180044f30
000000018104a902: mov      rcx, qword ptr [rdi + 0x20]
000000018104a906: xor      edx, edx
000000018104a908: movups   xmm0, xmmword ptr [rax]
000000018104a90b: movaps   xmmword ptr [rsp + 0x30], xmm0
000000018104a910: movups   xmm1, xmmword ptr [rax + 0x10]
000000018104a914: movaps   xmmword ptr [rsp + 0x40], xmm1
000000018104a919: movups   xmm0, xmmword ptr [rax + 0x20]
000000018104a91d: movaps   xmmword ptr [rsp + 0x50], xmm0
000000018104a922: movups   xmm1, xmmword ptr [rax + 0x30]
000000018104a926: movaps   xmmword ptr [rsp + 0x60], xmm1
000000018104a92b: movups   xmm0, xmmword ptr [rax + 0x40]
000000018104a92f: movaps   xmmword ptr [rsp + 0x70], xmm0
000000018104a934: movups   xmm1, xmmword ptr [rax + 0x50]
000000018104a938: movaps   xmmword ptr [rsp + 0x80], xmm1
000000018104a940: movups   xmm0, xmmword ptr [rax + 0x60]
000000018104a944: movaps   xmmword ptr [rsp + 0x90], xmm0
000000018104a94c: movups   xmm1, xmmword ptr [rax + 0x70]
000000018104a950: movaps   xmmword ptr [rsp + 0xa0], xmm1
000000018104a958: movsd    xmm0, qword ptr [rax + 0x80]
000000018104a960: movsd    qword ptr [rsp + 0xb0], xmm0
000000018104a969: call     0x185db9d60
000000018104a96e: test     al, al
000000018104a970: jne      0x18104a99b
000000018104a972: mov      rcx, qword ptr [rip + 0x78a27ff] ; TypeInfo Torappu.Battle.Modifier @0x1888ed178
000000018104a979: mov      rbx, qword ptr [rdi + 0x20]
000000018104a97d: cmp      dword ptr [rcx + 0xe0], 0
000000018104a984: jne      0x18104a98b
000000018104a986: call     0x18048c140
000000018104a98b: xor      r8d, r8d
000000018104a98e: lea      rcx, [rsp + 0x30]
000000018104a993: mov      rdx, rbx
000000018104a996: call     0x1808b05a0 ; Torappu.Battle.Modifier.AddCustomKey [70992]
000000018104a99b: xor      r9d, r9d
000000018104a99e: lea      rcx, [rsp + 0x30]
000000018104a9a3: xor      r8d, r8d
000000018104a9a6: mov      rdx, rbp
000000018104a9a9: call     0x180ade970 ; Torappu.Battle.BattleUtil.AddCustomKeyFromBlackboard [78248]
000000018104a9ae: cmp      byte ptr [rdi + 0x38], 0
000000018104a9b2: je       0x18104a9db
000000018104a9b4: mov      rcx, qword ptr [rip + 0x78a27bd] ; TypeInfo Torappu.Battle.Modifier @0x1888ed178
000000018104a9bb: mov      ebx, dword ptr [rdi + 0x3c]
000000018104a9be: cmp      dword ptr [rcx + 0xe0], 0
000000018104a9c5: jne      0x18104a9cc
000000018104a9c7: call     0x18048c140
000000018104a9cc: xor      r8d, r8d
000000018104a9cf: lea      rcx, [rsp + 0x30]
000000018104a9d4: mov      edx, ebx
000000018104a9d6: call     0x1808b2e40 ; Torappu.Battle.Modifier.SetSharedFlag [70990]
000000018104a9db: mov      rcx, qword ptr [rsi + 8]
000000018104a9df: test     rcx, rcx
000000018104a9e2: je       0x18104aa2f
000000018104a9e4: xor      r9d, r9d
000000018104a9e7: lea      rdx, [rsp + 0x30]
000000018104a9ec: xor      r8d, r8d
000000018104a9ef: call     0x1806efd80 ; Torappu.Battle.Entity.ApplyModifier [66665]
000000018104a9f4: jmp      0x18104aa16
000000018104a9f6: xor      al, al
000000018104a9f8: jmp      0x18104aa16
000000018104a9fa: mov      qword ptr [rsp + 0x28], 0
000000018104aa03: mov      r9d, ebx
000000018104aa06: mov      r8, rbp
000000018104aa09: mov      qword ptr [rsp + 0x20], rsi
000000018104aa0e: mov      rdx, rdi
000000018104aa11: call     0x183108750 ; XLua.DelegateBridge.__Gen_Delegate_Imp11071 [13726]
000000018104aa16: lea      r11, [rsp + 0x150]
000000018104aa1e: mov      rbx, qword ptr [r11 + 0x10]
000000018104aa22: mov      rbp, qword ptr [r11 + 0x18]
000000018104aa26: mov      rsi, qword ptr [r11 + 0x20]
000000018104aa2a: mov      rsp, r11
000000018104aa2d: pop      rdi
000000018104aa2e: ret      
000000018104aa2f: call     0x18048c0b0
000000018104aa34: int3     
000000018104aa35: int3     
000000018104aa36: int3     
000000018104aa37: int3     
000000018104aa38: int3     
000000018104aa39: int3     
000000018104aa3a: int3     
000000018104aa3b: int3     
000000018104aa3c: int3     
000000018104aa3d: int3     
000000018104aa3e: int3     
000000018104aa3f: int3     