; Torappu.Battle.Projectiles.AdvancedMovement.CheckStartTick metadata=86746 token=0x60152db VA=0x180d519f0 RVA=0xd519f0 size=0x110
0000000180d519f0: push     rbx
0000000180d519f2: sub      rsp, 0x40
0000000180d519f6: cmp      byte ptr [rip + 0x7f42cc1], 0
0000000180d519fd: mov      rbx, rcx
0000000180d51a00: movaps   xmmword ptr [rsp + 0x30], xmm6
0000000180d51a05: movaps   xmm6, xmm1
0000000180d51a08: jne      0x180d51a29
0000000180d51a0a: lea      rcx, [rip + 0x7ad3417] ; TypeInfo Torappu.Battle.Projectiles.AdvancedMovement @0x188824e28
0000000180d51a11: call     0x18048bf00
0000000180d51a16: lea      rcx, [rip + 0x7b7221b] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180d51a1d: call     0x18048bf00
0000000180d51a22: mov      byte ptr [rip + 0x7f42c95], 1
0000000180d51a29: mov      rax, qword ptr [rip + 0x7ad33f8] ; TypeInfo Torappu.Battle.Projectiles.AdvancedMovement @0x188824e28
0000000180d51a30: mov      rdx, qword ptr [rax + 0xb8]
0000000180d51a37: mov      rcx, qword ptr [rdx + 0x118]
0000000180d51a3e: test     rcx, rcx
0000000180d51a41: jne      0x180d51ae1
0000000180d51a47: cmp      byte ptr [rbx + 0x6c], cl
0000000180d51a4a: jne      0x180d51ad4
0000000180d51a50: xor      edx, edx
0000000180d51a52: mov      rcx, rbx
0000000180d51a55: call     0x1808cf100 ; Torappu.Battle.Projectile.Behaviour.get_projectile [71401]
0000000180d51a5a: test     rax, rax
0000000180d51a5d: je       0x180d51af9
0000000180d51a63: xor      edx, edx
0000000180d51a65: mov      rcx, rax
0000000180d51a68: call     0x1808dd100 ; Torappu.Battle.Projectile.get_hasReached [71326]
0000000180d51a6d: test     al, al
0000000180d51a6f: je       0x180d51a7a
0000000180d51a71: cmp      byte ptr [rbx + 0xff], 0
0000000180d51a78: jne      0x180d51ad4
0000000180d51a7a: mov      rcx, qword ptr [rip + 0x7b721b7] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180d51a81: movaps   xmmword ptr [rsp + 0x20], xmm7
0000000180d51a86: movss    xmm7, dword ptr [rbx + 0x104]
0000000180d51a8e: cmp      dword ptr [rcx + 0xe0], 0
0000000180d51a95: jne      0x180d51a9c
0000000180d51a97: call     0x18048c140
0000000180d51a9c: xor      r8d, r8d
0000000180d51a9f: xorps    xmm1, xmm1
0000000180d51aa2: movaps   xmm0, xmm7
0000000180d51aa5: call     0x1866e4c50
0000000180d51aaa: movaps   xmm7, xmmword ptr [rsp + 0x20]
0000000180d51aaf: test     al, al
0000000180d51ab1: jne      0x180d51ac0
0000000180d51ab3: mov      al, 1
0000000180d51ab5: movaps   xmm6, xmmword ptr [rsp + 0x30]
0000000180d51aba: add      rsp, 0x40
0000000180d51abe: pop      rbx
0000000180d51abf: ret      
0000000180d51ac0: movss    xmm0, dword ptr [rbx + 0x104]
0000000180d51ac8: subss    xmm0, xmm6
0000000180d51acc: movss    dword ptr [rbx + 0x104], xmm0
0000000180d51ad4: xor      al, al
0000000180d51ad6: movaps   xmm6, xmmword ptr [rsp + 0x30]
0000000180d51adb: add      rsp, 0x40
0000000180d51adf: pop      rbx
0000000180d51ae0: ret      
0000000180d51ae1: xor      r9d, r9d
0000000180d51ae4: movaps   xmm2, xmm6
0000000180d51ae7: mov      rdx, rbx
0000000180d51aea: movaps   xmm6, xmmword ptr [rsp + 0x30]
0000000180d51aef: add      rsp, 0x40
0000000180d51af3: pop      rbx
0000000180d51af4: jmp      0x1835b8140 ; XLua.DelegateBridge.__Gen_Delegate_Imp721 [3376]
0000000180d51af9: call     0x18048c0b0
0000000180d51afe: int3     
0000000180d51aff: int3     