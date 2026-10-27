; Torappu.Battle.Projectiles.AmiyaS2Movement.OnTick metadata=86805 token=0x6015316 VA=0x180d56ab0 RVA=0xd56ab0 size=0x2e0
0000000180d56ab0: mov      qword ptr [rsp + 0x18], rdi
0000000180d56ab5: mov      qword ptr [rsp + 0x10], rdx
0000000180d56aba: push     rbp
0000000180d56abb: mov      rbp, rsp
0000000180d56abe: sub      rsp, 0x80
0000000180d56ac5: cmp      byte ptr [rip + 0x7f3dc16], 0
0000000180d56acc: mov      rdi, rcx
0000000180d56acf: jne      0x180d56af4
0000000180d56ad1: lea      rcx, [rip + 0x7ad86e0] ; TypeInfo Torappu.Battle.Projectiles.AmiyaS2Movement @0x18882f1b8
0000000180d56ad8: call     0x18048bf00
0000000180d56add: lea      rcx, [rip + 0x7b03c1c] ; TypeInfo Torappu.FP @0x18885a700
0000000180d56ae4: call     0x18048bf00
0000000180d56ae9: mov      rdx, qword ptr [rbp + 0x18]
0000000180d56aed: mov      byte ptr [rip + 0x7f3dbee], 1
0000000180d56af4: mov      rax, qword ptr [rip + 0x7ad86bd] ; TypeInfo Torappu.Battle.Projectiles.AmiyaS2Movement @0x18882f1b8
0000000180d56afb: mov      rcx, qword ptr [rax + 0xb8]
0000000180d56b02: mov      rcx, qword ptr [rcx + 0x10]
0000000180d56b06: test     rcx, rcx
0000000180d56b09: jne      0x180d56d69
0000000180d56b0f: movaps   xmmword ptr [rsp + 0x50], xmm8
0000000180d56b15: xor      r8d, r8d
0000000180d56b18: mov      rcx, rdi
0000000180d56b1b: call     0x1808cbc30 ; Torappu.Battle.BasicMovement.OnTick [71215]
0000000180d56b20: mov      rcx, qword ptr [rip + 0x7b03bd9] ; TypeInfo Torappu.FP @0x18885a700
0000000180d56b27: cmp      dword ptr [rcx + 0xe0], 0
0000000180d56b2e: jne      0x180d56b35
0000000180d56b30: call     0x18048c140
0000000180d56b35: xor      edx, edx
0000000180d56b37: lea      rcx, [rbp + 0x18]
0000000180d56b3b: call     0x1866fae20
0000000180d56b40: movaps   xmm1, xmm0
0000000180d56b43: xor      edx, edx
0000000180d56b45: mulss    xmm1, dword ptr [rip + 0x60e98a3]
0000000180d56b4d: mov      rcx, rdi
0000000180d56b50: movaps   xmm8, xmm0
0000000180d56b54: mulss    xmm1, dword ptr [rdi + 0xc4]
0000000180d56b5c: addss    xmm1, dword ptr [rdi + 0xd4]
0000000180d56b64: movss    dword ptr [rdi + 0xd4], xmm1
0000000180d56b6c: call     0x180d56db0 ; Torappu.Battle.Projectiles.AmiyaS2Movement._UpdateBodyAnimation [86806]
0000000180d56b71: cmp      byte ptr [rdi + 0xd0], 0
0000000180d56b78: je       0x180d56d52
0000000180d56b7e: cmp      byte ptr [rdi + 0x6c], 0
0000000180d56b82: jne      0x180d56d52
0000000180d56b88: xor      edx, edx
0000000180d56b8a: mov      rcx, rdi
0000000180d56b8d: call     0x1808ca5f0 ; Torappu.Battle.BasicMovement.CheckReached [71221]
0000000180d56b92: test     al, al
0000000180d56b94: jne      0x180d56d48
0000000180d56b9a: mov      qword ptr [rsp + 0x90], rbx
0000000180d56ba2: movaps   xmmword ptr [rsp + 0x70], xmm6
0000000180d56ba7: movaps   xmmword ptr [rsp + 0x60], xmm7
0000000180d56bac: cmp      byte ptr [rip + 0x7f75c3e], al
0000000180d56bb2: jbe      0x180d56bbc
0000000180d56bb4: mov      rcx, qword ptr [rdi]
0000000180d56bb7: call     0x180446d00
0000000180d56bbc: mov      r8, qword ptr [rdi]
0000000180d56bbf: lea      rcx, [rbp - 0x50]
0000000180d56bc3: mov      rdx, rdi
0000000180d56bc6: mov      rax, qword ptr [r8 + 0x2c0]
0000000180d56bcd: mov      r8, qword ptr [r8 + 0x2c8]
0000000180d56bd4: call     rax
0000000180d56bd6: xor      r8d, r8d
0000000180d56bd9: lea      rcx, [rbp - 0x50]
0000000180d56bdd: mov      rdx, rdi
0000000180d56be0: movsd    xmm0, qword ptr [rax]
0000000180d56be4: mov      ebx, dword ptr [rax + 8]
0000000180d56be7: movsd    qword ptr [rdi + 0x60], xmm0
0000000180d56bec: mov      dword ptr [rdi + 0x68], ebx
0000000180d56bef: movsd    qword ptr [rbp - 0x60], xmm0
0000000180d56bf4: call     0x1808cdb70 ; Torappu.Battle.BasicMovement.get_position [71203]
0000000180d56bf9: movss    xmm3, dword ptr [rbp - 0x60]
0000000180d56bfe: movss    xmm2, dword ptr [rbp - 0x5c]
0000000180d56c03: movsd    xmm1, qword ptr [rax]
0000000180d56c07: movaps   xmm0, xmm1
0000000180d56c0a: movsd    qword ptr [rbp - 0x60], xmm1
0000000180d56c0f: subss    xmm3, xmm1
0000000180d56c13: shufps   xmm0, xmm0, 0x55
0000000180d56c17: movd     xmm1, ebx
0000000180d56c1b: subss    xmm2, xmm0
0000000180d56c1f: subss    xmm1, dword ptr [rax + 8]
0000000180d56c24: unpcklps xmm3, xmm2
0000000180d56c27: lea      rdx, [rbp - 0x60]
0000000180d56c2b: xor      r8d, r8d
0000000180d56c2e: movsd    qword ptr [rbp - 0x60], xmm3
0000000180d56c33: lea      rcx, [rbp - 0x40]
0000000180d56c37: movss    dword ptr [rbp - 0x58], xmm1
0000000180d56c3c: call     0x18051dd20
0000000180d56c41: xor      r8d, r8d
0000000180d56c44: lea      rdx, [rbp - 0x50]
0000000180d56c48: mov      rcx, rdi
0000000180d56c4b: movsd    xmm0, qword ptr [rax]
0000000180d56c4f: mov      eax, dword ptr [rax + 8]
0000000180d56c52: movsd    qword ptr [rbp - 0x50], xmm0
0000000180d56c57: mov      dword ptr [rbp - 0x48], eax
0000000180d56c5a: call     0x1808cdee0 ; Torappu.Battle.BasicMovement.set_direction [71202]
0000000180d56c5f: xor      edx, edx
0000000180d56c61: lea      rcx, [rbp - 0x60]
0000000180d56c65: call     0x1805690f0
0000000180d56c6a: movaps   xmm7, xmm0
0000000180d56c6d: lea      rcx, [rbp - 0x40]
0000000180d56c71: divss    xmm7, dword ptr [rdi + 0xcc]
0000000180d56c79: xor      r8d, r8d
0000000180d56c7c: mov      rdx, rdi
0000000180d56c7f: call     0x1808cdb70 ; Torappu.Battle.BasicMovement.get_position [71203]
0000000180d56c84: xor      r8d, r8d
0000000180d56c87: lea      rcx, [rbp - 0x40]
0000000180d56c8b: mov      rdx, rdi
0000000180d56c8e: mov      ebx, dword ptr [rax + 8]
0000000180d56c91: movsd    xmm6, qword ptr [rax]
0000000180d56c95: call     0x1808cda30 ; Torappu.Battle.BasicMovement.get_direction [71201]
0000000180d56c9a: movsd    xmm0, qword ptr [rax]
0000000180d56c9e: movss    xmm1, dword ptr [rax + 8]
0000000180d56ca3: movaps   xmm2, xmm0
0000000180d56ca6: movaps   xmm3, xmm0
0000000180d56ca9: movsd    qword ptr [rbp - 0x50], xmm0
0000000180d56cae: shufps   xmm2, xmm2, 0x55
0000000180d56cb2: movaps   xmm0, xmm6
0000000180d56cb5: mulss    xmm2, xmm8
0000000180d56cba: mulss    xmm3, xmm8
0000000180d56cbf: mulss    xmm1, xmm8
0000000180d56cc4: shufps   xmm0, xmm0, 0x55
0000000180d56cc8: mulss    xmm2, xmm7
0000000180d56ccc: mulss    xmm3, xmm7
0000000180d56cd0: mulss    xmm1, xmm7
0000000180d56cd4: addss    xmm2, xmm0
0000000180d56cd8: movd     xmm0, ebx
0000000180d56cdc: addss    xmm3, xmm6
0000000180d56ce0: movsd    qword ptr [rbp - 0x50], xmm6
0000000180d56ce5: addss    xmm1, xmm0
0000000180d56ce9: unpcklps xmm3, xmm2
0000000180d56cec: lea      rdx, [rbp - 0x50]
0000000180d56cf0: xor      r8d, r8d
0000000180d56cf3: movsd    qword ptr [rbp - 0x50], xmm3
0000000180d56cf8: mov      rcx, rdi
0000000180d56cfb: movss    dword ptr [rbp - 0x48], xmm1
0000000180d56d00: call     0x1808cdfe0 ; Torappu.Battle.BasicMovement.set_position [71204]
0000000180d56d05: movss    xmm1, dword ptr [rdi + 0xcc]
0000000180d56d0d: xorps    xmm0, xmm0
0000000180d56d10: movaps   xmm7, xmmword ptr [rsp + 0x60]
0000000180d56d15: subss    xmm1, xmm8
0000000180d56d1a: movaps   xmm6, xmmword ptr [rsp + 0x70]
0000000180d56d1f: mov      rbx, qword ptr [rsp + 0x90]
0000000180d56d27: comiss   xmm0, xmm1
0000000180d56d2a: movss    dword ptr [rdi + 0xcc], xmm1
0000000180d56d32: jb       0x180d56d52
0000000180d56d34: xor      edx, edx
0000000180d56d36: mov      dword ptr [rdi + 0xcc], 0
0000000180d56d40: mov      rcx, rdi
0000000180d56d43: call     0x1808ce870 ; Torappu.Battle.Projectile.Behaviour.Reached [71423]
0000000180d56d48: xor      edx, edx
0000000180d56d4a: mov      rcx, rdi
0000000180d56d4d: call     0x1808ce920 ; Torappu.Battle.Projectile.Behaviour.Stop [71422]
0000000180d56d52: movaps   xmm8, xmmword ptr [rsp + 0x50]
0000000180d56d58: mov      rdi, qword ptr [rsp + 0xa0]
0000000180d56d60: add      rsp, 0x80
0000000180d56d67: pop      rbp
0000000180d56d68: ret      
0000000180d56d69: mov      r8, rdx
0000000180d56d6c: xor      r9d, r9d
0000000180d56d6f: mov      rdx, rdi
0000000180d56d72: call     0x1833f9830 ; XLua.DelegateBridge.__Gen_Delegate_Imp427 [3082]
0000000180d56d77: mov      rdi, qword ptr [rsp + 0xa0]
0000000180d56d7f: add      rsp, 0x80
0000000180d56d86: pop      rbp
0000000180d56d87: ret      
0000000180d56d88: int3     
0000000180d56d89: int3     
0000000180d56d8a: int3     
0000000180d56d8b: int3     
0000000180d56d8c: int3     
0000000180d56d8d: int3     
0000000180d56d8e: int3     
0000000180d56d8f: int3     