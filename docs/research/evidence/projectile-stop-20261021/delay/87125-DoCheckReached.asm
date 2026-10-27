; Torappu.Battle.Projectiles.ParacurveMovement.DoCheckReached metadata=87125 token=0x6015456 VA=0x180d77aa0 RVA=0xd77aa0 size=0x1b0
0000000180d77aa0: push     rbx
0000000180d77aa2: sub      rsp, 0x30
0000000180d77aa6: cmp      byte ptr [rip + 0x7f1cd21], 0
0000000180d77aad: mov      rbx, rcx
0000000180d77ab0: jne      0x180d77add
0000000180d77ab2: lea      rcx, [rip + 0x7ae2c47] ; TypeInfo Torappu.FP @0x18885a700
0000000180d77ab9: call     0x18048bf00
0000000180d77abe: lea      rcx, [rip + 0x7b4c173] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180d77ac5: call     0x18048bf00
0000000180d77aca: lea      rcx, [rip + 0x7bd9a4f] ; TypeInfo Torappu.Battle.Projectiles.ParacurveMovement @0x188951520
0000000180d77ad1: call     0x18048bf00
0000000180d77ad6: mov      byte ptr [rip + 0x7f1ccf1], 1
0000000180d77add: mov      rax, qword ptr [rip + 0x7bd9a3c] ; TypeInfo Torappu.Battle.Projectiles.ParacurveMovement @0x188951520
0000000180d77ae4: mov      rcx, qword ptr [rax + 0xb8]
0000000180d77aeb: mov      rcx, qword ptr [rcx + 0x50]
0000000180d77aef: test     rcx, rcx
0000000180d77af2: jne      0x180d77c2c
0000000180d77af8: xor      edx, edx
0000000180d77afa: mov      rcx, rbx
0000000180d77afd: call     0x1808ca5f0 ; Torappu.Battle.BasicMovement.CheckReached [71221]
0000000180d77b02: test     al, al
0000000180d77b04: je       0x180d77bf4
0000000180d77b0a: cmp      byte ptr [rbx + 0xb8], 0
0000000180d77b11: mov      qword ptr [rsp + 0x40], rdi
0000000180d77b16: movaps   xmmword ptr [rsp + 0x20], xmm6
0000000180d77b1b: je       0x180d77c13
0000000180d77b21: xor      edx, edx
0000000180d77b23: mov      rcx, rbx
0000000180d77b26: call     0x186b59d80
0000000180d77b2b: test     rax, rax
0000000180d77b2e: je       0x180d77c3c
0000000180d77b34: xor      edx, edx
0000000180d77b36: mov      rcx, rax
0000000180d77b39: call     0x186b5c980
0000000180d77b3e: test     al, al
0000000180d77b40: je       0x180d77c13
0000000180d77b46: mov      rcx, qword ptr [rip + 0x7b4c0eb] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180d77b4d: movss    xmm6, dword ptr [rbx + 0xec]
0000000180d77b55: cmp      dword ptr [rcx + 0xe0], 0
0000000180d77b5c: jne      0x180d77b63
0000000180d77b5e: call     0x18048c140
0000000180d77b63: xor      r8d, r8d
0000000180d77b66: xorps    xmm1, xmm1
0000000180d77b69: movaps   xmm0, xmm6
0000000180d77b6c: call     0x1866e4c50
0000000180d77b71: test     al, al
0000000180d77b73: je       0x180d77c13
0000000180d77b79: xor      edx, edx
0000000180d77b7b: mov      rcx, rbx
0000000180d77b7e: call     0x1808cf100 ; Torappu.Battle.Projectile.Behaviour.get_projectile [71401]
0000000180d77b83: mov      rcx, qword ptr [rip + 0x7ae2b76] ; TypeInfo Torappu.FP @0x18885a700
0000000180d77b8a: mov      rdi, rax
0000000180d77b8d: movss    xmm6, dword ptr [rbx + 0xec]
0000000180d77b95: cmp      dword ptr [rcx + 0xe0], 0
0000000180d77b9c: jne      0x180d77ba3
0000000180d77b9e: call     0x18048c140
0000000180d77ba3: xor      edx, edx
0000000180d77ba5: movaps   xmm0, xmm6
0000000180d77ba8: call     0x1866fdad0
0000000180d77bad: test     rdi, rdi
0000000180d77bb0: je       0x180d77c3c
0000000180d77bb6: xor      r9d, r9d
0000000180d77bb9: mov      r8b, 1
0000000180d77bbc: mov      rdx, rax
0000000180d77bbf: mov      rcx, rdi
0000000180d77bc2: call     0x1808d7050 ; Torappu.Battle.Projectile.EnsureLifeTime [71349]
0000000180d77bc7: cmp      byte ptr [rbx + 0xc0], 0
0000000180d77bce: je       0x180d77bfa
0000000180d77bd0: cmp      byte ptr [rbx + 0xf0], 0
0000000180d77bd7: jne      0x180d77bea
0000000180d77bd9: xor      edx, edx
0000000180d77bdb: mov      rcx, rbx
0000000180d77bde: call     0x180d788b0 ; Torappu.Battle.Projectiles.ParacurveMovement._UpdateAfterReach [87126]
0000000180d77be3: mov      byte ptr [rbx + 0xf0], 1
0000000180d77bea: mov      rdi, qword ptr [rsp + 0x40]
0000000180d77bef: movaps   xmm6, xmmword ptr [rsp + 0x20]
0000000180d77bf4: add      rsp, 0x30
0000000180d77bf8: pop      rbx
0000000180d77bf9: ret      
0000000180d77bfa: xor      edx, edx
0000000180d77bfc: mov      rcx, rbx
0000000180d77bff: mov      rdi, qword ptr [rsp + 0x40]
0000000180d77c04: movaps   xmm6, xmmword ptr [rsp + 0x20]
0000000180d77c09: add      rsp, 0x30
0000000180d77c0d: pop      rbx
0000000180d77c0e: jmp      0x180d788b0 ; Torappu.Battle.Projectiles.ParacurveMovement._UpdateAfterReach [87126]
0000000180d77c13: xor      edx, edx
0000000180d77c15: mov      rcx, rbx
0000000180d77c18: mov      rdi, qword ptr [rsp + 0x40]
0000000180d77c1d: movaps   xmm6, xmmword ptr [rsp + 0x20]
0000000180d77c22: add      rsp, 0x30
0000000180d77c26: pop      rbx
0000000180d77c27: jmp      0x1808ce920 ; Torappu.Battle.Projectile.Behaviour.Stop [71422]
0000000180d77c2c: xor      r8d, r8d
0000000180d77c2f: mov      rdx, rbx
0000000180d77c32: add      rsp, 0x30
0000000180d77c36: pop      rbx
0000000180d77c37: jmp      0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
0000000180d77c3c: call     0x18048c0b0
0000000180d77c41: int3     
0000000180d77c42: int3     
0000000180d77c43: int3     
0000000180d77c44: int3     
0000000180d77c45: int3     
0000000180d77c46: int3     
0000000180d77c47: int3     
0000000180d77c48: int3     
0000000180d77c49: int3     
0000000180d77c4a: int3     
0000000180d77c4b: int3     
0000000180d77c4c: int3     
0000000180d77c4d: int3     
0000000180d77c4e: int3     
0000000180d77c4f: int3     