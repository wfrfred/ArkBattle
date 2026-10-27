; Torappu.Battle.Projectile.EnsureLifeTime metadata=71349 token=0x60116b6 VA=0x1808d7050 RVA=0x8d7050 size=0x120
00000001808d7050: mov      qword ptr [rsp + 0x10], rbx
00000001808d7055: mov      qword ptr [rsp + 0x18], rbp
00000001808d705a: push     rsi
00000001808d705b: sub      rsp, 0x40
00000001808d705f: cmp      byte ptr [rip + 0x83ba7a2], 0
00000001808d7066: movzx    ebp, r8b
00000001808d706a: mov      rbx, rdx
00000001808d706d: mov      rsi, rcx
00000001808d7070: jne      0x1808d709d
00000001808d7072: lea      rcx, [rip + 0x7f83687] ; TypeInfo Torappu.FP @0x18885a700
00000001808d7079: call     0x18048bf00
00000001808d707e: lea      rcx, [rip + 0x805ebe3] ; GenericMethodInfo 280380 @0x188935c68
00000001808d7085: call     0x18048bf00
00000001808d708a: lea      rcx, [rip + 0x7f4c367] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808d7091: call     0x18048bf00
00000001808d7096: mov      byte ptr [rip + 0x83ba76b], 1
00000001808d709d: mov      rax, qword ptr [rip + 0x7f4c354] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808d70a4: mov      rcx, qword ptr [rax + 0xb8]
00000001808d70ab: mov      rcx, qword ptr [rcx + 0x1d0]
00000001808d70b2: test     rcx, rcx
00000001808d70b5: jne      0x1808d713e
00000001808d70bb: mov      qword ptr [rsp + 0x50], rdi
00000001808d70c0: mov      rcx, qword ptr [rip + 0x7f83639] ; TypeInfo Torappu.FP @0x18885a700
00000001808d70c7: mov      rdi, qword ptr [rsi + 0x98]
00000001808d70ce: cmp      dword ptr [rcx + 0xe0], 0
00000001808d70d5: jne      0x1808d70dc
00000001808d70d7: call     0x18048c140
00000001808d70dc: xor      r8d, r8d
00000001808d70df: mov      rdx, rbx
00000001808d70e2: mov      rcx, rdi
00000001808d70e5: call     0x1866fba10
00000001808d70ea: xor      r8d, r8d
00000001808d70ed: mov      rdx, rax
00000001808d70f0: mov      rcx, rsi
00000001808d70f3: call     0x1808ddbb0 ; Torappu.Battle.Projectile.set_currentTime [71289]
00000001808d70f8: mov      rdi, qword ptr [rsp + 0x50]
00000001808d70fd: test     bpl, bpl
00000001808d7100: je       0x1808d7156
00000001808d7102: mov      r8, qword ptr [rip + 0x805eb5f] ; GenericMethodInfo 280380 @0x188935c68
00000001808d7109: lea      rcx, [rsp + 0x30]
00000001808d710e: xor      edx, edx
00000001808d7110: call     0x18515a130
00000001808d7115: movups   xmm0, xmmword ptr [rsp + 0x30]
00000001808d711a: lea      rcx, [rsi + 0x118]
00000001808d7121: xor      edx, edx
00000001808d7123: movups   xmmword ptr [rsi + 0x118], xmm0
00000001808d712a: mov      rbx, qword ptr [rsp + 0x58]
00000001808d712f: mov      rbp, qword ptr [rsp + 0x60]
00000001808d7134: add      rsp, 0x40
00000001808d7138: pop      rsi
00000001808d7139: jmp      0x18048b9e0
00000001808d713e: movzx    r9d, bpl
00000001808d7142: mov      qword ptr [rsp + 0x20], 0
00000001808d714b: mov      r8, rbx
00000001808d714e: mov      rdx, rsi
00000001808d7151: call     0x183364690 ; XLua.DelegateBridge.__Gen_Delegate_Imp3340 [5995]
00000001808d7156: mov      rbx, qword ptr [rsp + 0x58]
00000001808d715b: mov      rbp, qword ptr [rsp + 0x60]
00000001808d7160: add      rsp, 0x40
00000001808d7164: pop      rsi
00000001808d7165: ret      
00000001808d7166: int3     
00000001808d7167: int3     
00000001808d7168: int3     
00000001808d7169: int3     
00000001808d716a: int3     
00000001808d716b: int3     
00000001808d716c: int3     
00000001808d716d: int3     
00000001808d716e: int3     
00000001808d716f: int3     